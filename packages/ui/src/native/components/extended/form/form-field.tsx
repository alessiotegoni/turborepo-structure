import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import React from "react";
import { cn, FieldError, TextField } from "heroui-native";
import { Controller, useFormContext } from "react-hook-form";

// Props di fieldState normalizzate: sostituiamo `invalid` con `isInvalid`
// per conformarci alla convenzione HeroUI Native
export type NormalizedFieldState = Omit<ControllerFieldState, "invalid"> & {
  isInvalid: boolean;
};

type RenderFn<
  TFormSchema extends FieldValues,
  TName extends Path<TFormSchema>,
> = (args: {
  field: ControllerRenderProps<TFormSchema, TName>;
  fieldState: NormalizedFieldState;
}) => React.ReactNode;

interface FormFieldProps<
  TFormSchema extends FieldValues,
  TName extends Path<TFormSchema>,
> {
  name: TName;
  render: RenderFn<TFormSchema, TName>;
  className?: string;
  isDisabled?: boolean;
}

/**
 * Inietta automaticamente le props di fieldState (isInvalid, error, ecc.)
 * ricorsivamente su tutti i nodi foglia (elementi senza children React)
 * restituiti dalla render callback.
 *
 * Questo permette di scrivere:
 *   render={({ field }) => (
 *     <View>           ← contenitore attraversato, NON riceve le props
 *       <Label />      ← foglia, riceve { isInvalid, error, isDirty, ... }
 *       <Input />      ← foglia, riceve { isInvalid, error, isDirty, ... }
 *     </View>
 *   )}
 *
 * Logica:
 *   - Primitivi (string, number, null) → invariati
 *   - Elemento con children React → ricorre nei figli, restituisce clone
 *   - Elemento senza children React (foglia) → inietta fieldState
 */
function injectFieldStateIntoChildren(
  node: React.ReactNode,
  fieldState: NormalizedFieldState,
): React.ReactNode {
  // Primitivi o nodi non clonabili — restituiamo invariati
  if (node === null || node === undefined || typeof node !== "object") {
    return node;
  }

  const element = node as React.ReactElement<Record<string, unknown>>;
  const elementChildren = element.props.children as React.ReactNode | undefined;

  // L'elemento ha figli React (Fragment, View, Box, o qualsiasi wrapper):
  // lo attraversiamo senza toccare le sue props, iniettando solo nelle foglie.
  if (elementChildren !== undefined && elementChildren !== null) {
    const hasReactElementChildren = React.Children.toArray(
      elementChildren,
    ).some((child) => React.isValidElement(child));

    if (hasReactElementChildren) {
      const newChildren = React.Children.map(elementChildren, (child) =>
        injectFieldStateIntoChildren(child, fieldState),
      );
      return React.cloneElement(element, {}, newChildren);
    }
  }

  // Foglia (nessun figlio React, es. <Input />, <Label>testo</Label>):
  // iniettamo le props di fieldState direttamente.
  return React.cloneElement(element, { ...fieldState });
}

/**
 * Componente base interno che gestisce la logica del campo.
 * TFormSchema e TName sono entrambi inferiti correttamente.
 */
function FormFieldBase<
  TFormSchema extends FieldValues,
  TName extends Path<TFormSchema>,
>({ name, render, className, isDisabled }: FormFieldProps<TFormSchema, TName>) {
  const form = useFormContext<TFormSchema>();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const normalizedFieldState: NormalizedFieldState = {
          ...fieldState,
          isInvalid: fieldState.invalid,
        };

        const rendered = render({ field, fieldState: normalizedFieldState });
        const childrenWithState = injectFieldStateIntoChildren(
          rendered,
          normalizedFieldState,
        );

        return (
          <TextField
            isInvalid={fieldState.invalid}
            isDisabled={isDisabled}
            className={cn("gap-2", className)}
          >
            {childrenWithState}
            {fieldState.error && (
              <FieldError>{fieldState.error.message}</FieldError>
            )}
          </TextField>
        );
      }}
    />
  );
}

// =============================================================================
// Object.assign — come funziona e perché lo usiamo qui
// =============================================================================
//
// In JavaScript, le funzioni sono oggetti a tutti gli effetti.
// Questo significa che puoi aggiungere proprietà a una funzione esattamente
// come faresti con un normale oggetto:
//
//   function greet() { return "ciao"; }
//   greet.language = "it";          // ✅ valido
//   console.log(greet.language);    // "it"
//
// `Object.assign(target, ...sources)` copia tutte le proprietà enumerabili
// proprie dei source nell'oggetto target e restituisce target:
//
//   const a = { x: 1 };
//   const b = { y: 2 };
//   Object.assign(a, b);  // → a è ora { x: 1, y: 2 }, la stessa referenza
//
// ---------------------------------------------------------------------------
// Nel nostro caso:
//
//   export const FormField = Object.assign(FormFieldBase, { typed: ... });
//
// Questo fa tre cose contemporaneamente:
//
//   1. FormField === FormFieldBase (stessa referenza in memoria) → usabile
//      come componente React: <FormField name="title" ... />
//
//   2. FormField.typed viene aggiunto come proprietà statica della funzione,
//      proprio come i "static methods" sui class-components React.
//
//   3. TypeScript inferisce il tipo risultante come intersezione:
//      typeof FormFieldBase & { typed: ... }
//      → intellisense completo sia per l'uso JSX che per FormField.typed()
//
// Pattern comune in React per i "compound components":
//
//   const Select = Object.assign(SelectBase, {
//     Option: SelectOption,
//     Group: SelectGroup,
//   });
//   → <Select><Select.Option value="a" /></Select>
//
// ---------------------------------------------------------------------------

/**
 * FormField è il componente principale per gestire un singolo campo di un
 * form React Hook Form, con iniezione automatica di fieldState sui figli.
 *
 * ## Pattern 1 — uso diretto (senza type safety sul form)
 * ```tsx
 * <FormField name="title" render={({ field }) => <Input {...field} />} />
 * ```
 *
 * ## Pattern 2 — `FormField.typed<T>()` (type safety completa)
 * Crea una versione del componente con `TFormSchema` fisso, lasciando che
 * `TName` venga inferito automaticamente dalla prop `name`.
 *
 * TypeScript NON supporta partial type inference sui generici JSX:
 * non puoi scrivere `<FormField<InsertEvent> name="title" .../>` e aspettarti
 * che il secondo generico venga inferito. Il pattern curried risolve questo:
 *
 * ```tsx
 * // Una volta sola fuori dal componente:
 * const Field = FormField.typed<InsertEvent>();
 *
 * // Nel JSX — TName inferito da "title" → field.value: string
 * <Field name="title" render={({ field }) => <Input {...field} />} />
 * // Nel JSX — TName inferito da "startDate" → field.value: Date
 * <Field name="startDate" render={({ field }) => <DatePicker {...field} />} />
 * ```
 */
export const FormField = Object.assign(FormFieldBase, {
  typed:
    <TFormSchema extends FieldValues>() =>
    <TName extends Path<TFormSchema>>(
      props: FormFieldProps<TFormSchema, TName>,
    ) => <FormFieldBase<TFormSchema, TName> {...props} />,
});
