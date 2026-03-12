export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

/**
 * Utilizza questa funzione nei tuoi resolver per ritornare dati tipizzati
 * con un messaggio di successo opzionale.
 */
export function createSuccess<T>(
  data: T,
  message = "Operazione completata con successo",
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}
