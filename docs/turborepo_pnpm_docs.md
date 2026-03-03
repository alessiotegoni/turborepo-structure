# Guida alla Gestione dei Pacchetti e Monorepo 📚

Benvenuto al team di sviluppo di Beeto! Questo documento è una guida essenziale per comprendere come gestiamo le nostre dipendenze e i nostri pacchetti all'interno del progetto. Utilizziamo un'architettura a **Monorepo** orchestrata da **Turborepo** e **pnpm**.

## L'Architettura Monorepo 🏗️

Un monorepo è una singola repository Git che contiene più progetti o "pacchetti" isolati ma che possono dipendere l'uno dall'altro. Questa architettura ci permette di:

- Evitare la duplicazione di codice (es. schemi DB, configurazioni logiche o UI).
- Semplificare le modifiche che impattano più app contemporaneamente.
- Effettuare refactor sicuri avendo tutta l'infrastruttura sott'occhio.

La nostra struttura è divisa concettualmente in 3 macro-cartelle:

1. `apps/`: Contiene i progetti finiti e deployabili (es. `web` per il sito Next.js, `native` per l'app mobile Expo).
2. `packages/`: Contiene tutta la business logic (es. `api`, `auth`, `db`, `features`, `payments`).
3. `tooling/`: Contiene le configurazioni astratte per tutto l'ecosistema (es. `eslint`, `prettier`, `typescript`).

## Il Superpotere di pnpm: I Catalogs 📦⚡

Nei monorepo tradizionali, gestire le dipendenze può diventare un incubo. Se aggiorni una versione di `react` nell'app mobile ma ti dimentichi di aggiornarla in un altro pacchetto frontend, puoi trovarti con pacchetti ridondanti o crash inspiegabili perché girerebbero più versioni della libreria simultaneamente.

Per evitare questo, in Beeto usiamo i **cataloghi di pnpm (`catalog:`)**.

### Cos'è un catalog?

È un meccanismo per centralizzare brutalmente le versioni dei pacchetti installati da NPM all'interno della repository.

Tutte le versioni sono definite **una sola volta** nella root del progetto: dentro `pnpm-workspace.yaml`.

```yaml
# pnpm-workspace.yaml (esempio radice)
catalog:
  "@supabase/supabase-js": ^2.48.1
  drizzle-orm: ^0.44.7
  zod: ^4.1.12
```

### Come si usa nei pacchetti?

Invece di scrivere `drizzle-orm: ^0.44.7` o pacchetti esterni dentro un `package.json` di un nostro pacchetto (es. in `@beeto/db`), usiamo l'alias `catalog:`.

```json
// packages/db/package.json
{
  "dependencies": {
    "drizzle-orm": "catalog:",
    "drizzle-zod": "catalog:",
    "postgres": "catalog:",
    "zod": "catalog:"
  }
}
```

**Perchè è fondamentale che lo usiamo tutti?**

- **Nessuna discrepanza:** Siamo certi matematicamente che tutti i packages utilizzino ESATTAMENTE la stessa identica versione di Supabase, di Zod o di React.
- **Aggiornamenti in 2 secondi:** Quando arriva la nuova versione di Drizzle o Supabase, modifichiamo SOLO il valore nel `pnpm-workspace.yaml`. Lanciando `pnpm install`, l'intero progetto – web, mobile, e moduli – verrà aggiornato istantaneamente senza dover ritoccare un singolo `package.json`.

## Regola d'Oro per le Dipendenze Interne 🔗

Che succede invece quando un nostro pacchetto (es. `@beeto/api`) ha bisogno di utilizzare un _nostro_ pacchetto (es `@beeto/db`)?
Non usiamo alcun package manager esterno o npm registry. Utilizziamo la keyword `"workspace:*"`

```json
// packages/api/package.json
{
  "dependencies": {
    "@beeto/db": "workspace:*",
    "@beeto/auth": "workspace:*"
  }
}
```

In questo modo creiamo dei **symlink locali**. Il codice non viene mai copiato o scaricato, e le modifiche apportate su `packages/db` si riflettono istantaneamente su `packages/api` senza dover effettuare "publish".

## Aggiungere Pacchetti: Locali vs Globali 🌍

Quando devi installare un nuovo pacchetto - che sia una libreria NPM esterna (`date-fns`) o un nostro pacchetto interno (`@beeto/ui`) - c'è una precisa direttiva:

> [!IMPORTANT]
> **NON installare MAI un pacchetto globalmente (nella root del progetto) se serve solo a una specifica app o a un package.**

Se un pacchetto serve specificamente a `apps/web` o a `packages/api` (come ad esempio una libreria per pagamenti o un trpc-link), **deve** essere dichiarato esplicitamente solo nei `dependencies` del `package.json` di **quel** relativo modulo. Installarlo nella directory padre appesantirebbe l'intera infrastruttura e creerebbe conflitti, inquinando i log.

### Come installare in un modulo specifico dal terminale 🛠️

Il modo migliore per installare un pacchetto mirato, senza doversi muovere con il `cd` nel terminale, è usare il flag di **filtraggio di pnpm (`-F` o `--filter`)**.

#### Esempio: aggiungere una libreria NPM nativa

Vogliamo aggiungere `date-fns` al nostro pacchetto condiviso `@beeto/features`.

1. Aggiungila prima al catalog in `pnpm-workspace.yaml`:
   ```yaml
   catalog:
     date-fns: ^3.0.0
   ```
2. Esegui il comando di installazione col filtro `-F`:
   ```bash
   pnpm add date-fns -F @beeto/features
   ```
   _Nota Magica: pnpm capirà in automatico che hai definito `date-fns` nel catalog e inserirà nel `package.json` locale la dicitura pulita `"date-fns": "catalog:"`._

#### Esempio: importare un nostro pacchetto interno in un'App

Vogliamo usare i nostri bottoni del pacchetto `@beeto/ui` dentro il sito in `apps/web`.
Niente di più semplice, eseguiamo:

```bash
pnpm add @beeto/ui -F @beeto/web
```

Pnpm abbinerà la versione creando il symlink `"@beeto/ui": "workspace:*"` nel package.json dell'app target.

## Esportare Moduli da un Pacchetto (Il Campo `exports`) 🚪

Quando crei un **nuovo file** all'interno di un pacchetto (per esempio, `packages/auth/src/native.ts`), non basta scriverci dentro il codice. Affinché gli altri pacchetti (come `apps/web` o `packages/api`) possano importarlo con un path "pulito" (es. `import { foo } from "@beeto/auth/native"`), **devi dichiararlo esplicitamente nel `package.json`** del pacchetto che lo contiene.

Per farlo, usiamo il campo `"exports"` nel `packages/<nome-pacchetto>/package.json`:

```json
{
  "name": "@beeto/auth",
  "exports": {
    "./client": "./src/client.ts",
    "./server": "./src/server.ts",
    "./native": "./src/native.ts", // <-- Nuova entry aggiunta!
    "./env": "./env.ts"
  }
}
```

> [!WARNING]
> **Errore "Cannot find module"**
> Se ti dimentichi di aggiungere il file agli `"exports"`, TypeScript e i bundler (Next.js, Metro) genereranno l'errore: `Cannot find module '@beeto/auth/native'`. Questo accade perché i file non dichiarati in `"exports"` sono considerati **privati** e invisibili dall'esterno del pacchetto.

## Recap Operativo per il Dev Team 📌

1. **Libreria esterna condivisa:** Dichiarala in `pnpm-workspace.yaml` e installala solo dove serve tramite `pnpm add <libreria> -F <nome-pacchetto>`.
2. **Collegare due pacchetti interni:** Utilizza `pnpm add @beeto/<package-name> -F <nome-pacchetto-o-app>`.
3. **Isolamento assoluto:** Mai usare il terminale sulla root per fare `pnpm add x` a meno che non si tratti di uno strumento globale (linting ecc). Mantieni le `dependencies` esclusive per il package che ne ha effettivamente bisogno.
