# Perché mantenere il Linting nel Monorepo (anche con un team piccolo)

Spesso si pensa che, in un team ristretto (es. 3 sviluppatori), rimuovere il linter possa accelerare lo sviluppo evitando "falsi positivi" e regole troppo pedanti. Tuttavia, la realtà è che un sistema di linting ben configurato **aumenta la velocità di sviluppo** e funge da "quarto membro del team" automatizzando processi che altrimenti richiederebbero tempo e attenzione mentale durante lo sviluppo e la code review.

Ecco i motivi principali per cui rimuovere il linting è un rischio e perché mantenerlo (con regole minime e intelligenti) vi farà guadagnare tempo:

## 1. Velocità nello Sviluppo e Nelle Code Review
Senza linter, le differenze di stile e i bug banali arrivano fino alle Pull Request. Questo obbliga il senior e i colleghi a sprecare tempo nelle review per segnalare:
- Variabili dichiarate ma non usate
- Import superflui o doppi
- Hook di React usati male (es. dipendenze mancanti negli `useEffect`)
- Promesse non gestite correttamente

**Con il linter:** la macchina cattura e spesso corregge automaticamente (`--fix`) questi problemi. Le code review diventano puramente incentrate sulla **logica di business** e sull'**architettura**, non sulla sintassi.

## 2. Onboarding e Coerenza in un Monorepo
Il progetto è un monorepo che contiene pacchetti condivisi, frontend mobile, frontend web, ecc. Saltare tra questi pacchetti può causare disorientamento se ognuno ha uno stile o convenzioni differenti.
Il linter garantisce che tutto il codice sembri scritto da un'unica persona. Inoltre, se il team dovesse espandersi in futuro, i nuovi membri avranno regole automatiche che li guideranno, azzerando i tempi di onboarding sulle "convenzioni di progetto".

## 3. Prevenzione di Bug Invisibili
Molte regole del linter non sono di "stile", ma salvano letteralmente da crash in produzione, specialmente in TypeScript e React.

---

## Analisi dell'Attuale Configurazione ESLint
Ho analizzato i file esistenti dentro la cartella `tooling/eslint/`. L'attuale configurazione è già **eccellente, minimale e per nulla pedante**. Non ci sono regole di formattazione pure (che rallentano e frustrano), ma si concentra esclusivamente sulla prevenzione dei bug e sulla consistenza dei tipi.

Ecco cosa fa l'attuale setup diviso per moduli:

### `base.ts` (Regole Base e TypeScript)
Questa è la configurazione core per i file JavaScript/TypeScript:
- Estende solo le **regole raccomandate** di ESLint e TypeScript (`recommended`, `recommendedTypeChecked`). Niente regole estreme alla "Airbnb", solo ciò che la community ritiene essenziale.
- **`no-unused-vars`**: Segnala le variabili dichiarate e non usate (permettendo però quelle che iniziano con underscore `_`, ad esempio argomenti ignorati. Molto permissivo).
- **`consistent-type-imports`**: Forza l'uso di `import type { ... }` invece di import normali per i tipi di TypeScript. Questo migliora radicalmente le performance di compilazione nel monorepo e riduce la grandezza dei bundle finali (costo: zero fatica perché si auto-fixa).
- **`restrictEnvAccess`**: Genera errore se si usa direttamente `process.env`. Suggerisce invece di usare un file `env` tipizzato e validato, bloccando alla radice uno dei bug più comuni (variabili d'ambiente mancanti runtime).
- **`no-misused-promises` e `no-unnecessary-condition`**: Previene l'uso di promesse non attese correttamente e condizioni logiche che sono sempre vere/false, trovando bug silenti difficilissimi da scovare a mano.

### `react.ts` (Regole per React e React Native)
- Utilizza i preset `recommended` e `jsx-runtime` ufficiali di React.
- Include anche `react-hooks/recommended`. Questo è **ritenuto obbligatorio** dalla core team di React: rileva errori critici nell'uso degli Hook (come usare uno stato condizionalmente o dimenticare dipendenze negli `useCallback/useEffect`). Senza queste regole, debuggare i ri-render infiniti di React costa ore di sviluppo.

### `nextjs.ts` (Regole per le Web App Next.js)
- Estende solo le raccomandazioni ufficiali di Next.js e i controlli per le "Core Web Vitals", utili per mantenere alte prestazioni e SEO sulle interfacce web, senza richiedere setup manuale.  

--- 

## Conclusione

La configurazione attualmente presente in `tooling/eslint` è perfettamente calibrata per un team di 3 persone che vuole **andare veloce**. 
Disabilita il linter comporterebbe un risparmio di tempo apparente oggi, ma lo costerebbe con gli interessi domani a colpi di bug sfuggiti (`useEffect` esplosi, variabili d'ambiente mancanti in production, e dead code accumulato).

Se il team sperimenta dei blocchi, il consiglio non è eliminare il linting, ma piuttosto assicurarsi che:
1. Siano attivi gli **auto-fixers on save** nell'IDE (VSCode).
2. Durante lo sviluppo locale i comandi dev tollerino i "Warning" invece di interrompere la build.
3. Lo stile visuale puro sia demandato a Prettier, svincolando ESLint da regole puramente estetiche.
