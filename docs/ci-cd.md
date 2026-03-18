# Guida CI/CD per il Monorepo Beeto

Questo documento spiega l'architettura tecnica per il sistema di Continuous Integration e Continuous Deployment (CI/CD) all'interno del progetto Beeto. Esso si basa sulle best practices e su come sfruttare al meglio GitHub Actions e Turborepo per il nostro specifico monorepo, formato attualmente da App Mobile (React Native + Expo) e un'API di backend.

## 1. Il Concetto di Base: CI/CD

**CI (Continuous Integration):**
È il processo che risponde alla domanda _"Questo codice è pronto per essere deployato e privo di errori di base?"_. Appena uno sviluppatore apre una Pull Request (PR) in GitHub o unisce del codice nel branch `main`, scattano automaticamente i controlli.
L'obiettivo è prevenire che errori di formattazione, tipizzazione (Typecheck) o sintassi arrivino agli utenti.

**CD (Continuous Deployment/Delivery):**
È il passo successivo che si compie _solo_ una volta che tutte le difese del passaggio CI passano in verde e il codice staziona su `main` o un ambiente sicuro. Risponde alla domanda _"Come compilo l'app e la distribuisco rapidamente all'utente o ai tester (staging)?"_.

Rispetto ai deployment "manuali" sulle macchine (SSH o caricamento file a mano), utilizzare un sistema automatizzato garantisce velocità e affidabilità.

---

## 2. Il Flusso Attuale: GitHub Actions in `ci.yml`

Il nostro `.github/workflows/ci.yml` è il cervello delle operazioni.

### Che cosa fa esattamente?

- **Triggers:**
  Il workflow si avvia per tutte le Pull Request in qualsiasi branch, e per i push direttamente su `main`. C'è anche l'aggiunta di `merge_group` per le code di unione (spiegato più avanti).
- **Controllo della Concurrency:**
  ```yaml
  concurrency:
    group: ${{ github.workflow }}-${{ github.ref }}
    cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}
  ```
  Se fai un push in un branch e dopo 2 minuti ti accorgi di un errore e fai subito un altro push, GitHub capisce che la prima ondata di test è ormai obsoleta, cancella l'azione precedente e spara immediatamente l'ultimo test. Questo riduce i tempi d'attesa (queue delay) e salva moltissimi minuti preziosi sulla CI che altrimenti si accavallerebbero inutilmente. NOTA: Questo non cancella mai i branch `main`.
- **Esecuzioni Parallele (Jobs):**
  Il file di setup utilizza parallelismo, definendo tre "jobs" separati (`lint`, `format`, e `typecheck`) che corrono _simultaneamente_ in macchine ubuntu diverse su Github Actions. Grazie a `tooling/github/setup/action.yml` l'installazione delle dipendenze con Node e pnpm avviene in modo rapidissimo riutilizzando il sistema centrale di cache (Dependency Caching) che riduce i tempi di installazione enormemente (NPM ci impiega solitamente 45s a pacchetto intero, con cache ci mette spesso sotto i 9s).

---

## 3. Gestione e Utilizzo di Turborepo

Usiamo `turbo` come orchestratore a monte del monorepo per capire la dipendenza tra pacchetti ed eseguire i comandi localmente o su GitHub.
Nel nostro `turbo.json`:

- `outputs` definisce dove va la cache delle build di typescript, garantendo che non occorra scansionare tutto il codice sempre.
- È possibile ottimizzare per pacchetti non-lavorati specificando un `--filter`.

### A) Come Escludere l'App Web (Temporaneamente)

Hai detto che per la stesura dell'App Web non verranno impiegate risorse attuali. Dato che non vogliamo testare ed effettuare `lint` o compilazioni sull'app vuota, puoi dire a Turborepo e Pnpm di filtrarlo:

Nei comandi di `pnpm` della CI (nel file `ci.yml`: es. `pnpm lint`), cambia per includere il flag Turborepo (assumendo che il package web si chiami ad esempio `@beeto/web`):

```bash
turbo run lint --filter="!@beeto/web"
turbo run typecheck --filter="!@beeto/web"
```

In alternativa puoi usare `pnpm --filter="!@beeto/web" run lint`.
Con questo semplice `!nome-pacchetto` salteremo a piè pari la parte in sviluppo, riducendo lo spreco.

### B) Vercel Remote Caching (Come Implementarlo)

Il _Remote Caching_ è una funziona incredibile di Turborepo: invece di mantenere la cache unicamente ristretta nel portabile dello sviluppatore o della singola istanza runner in GitHub, il sistema si connette a Vercel in remoto per tenere un "grosso database globale delle build" su cui i dev possono attingere le build fatte dai loro compagni, evitando a chiunque di doverci rifare test già compiuti da altri se il codice di un file non è per davvero venuto compromesso!

Nel tuo file `ci.yml` questo è già parzialmente configurato:

```yaml
env:
  TURBO_TEAM: ${{ vars.TURBO_TEAM }}
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
```

**Come terminarne l'impianto per i Devs e le GitHub Actions?**

1. Dovresti (tu come proprietario) intersecare Vercel al pc connettendolo col tuo terminale lanciando il comando `npx turbo login` e poi autenticare l'applicazione a un Team/Progetto su Vercel scrivendo al terminale locale `npx turbo link`.
2. Dentro la Repo Vercel dovresti ottenere dall'impostazione "Tokens" il tuo Bearer Token per le azioni (`TURBO_TOKEN`) oltre all'ID della tua associazione in Vercel (`TURBO_TEAM` come identificativo che inizia talvolta con stringhe alfanumeriche).
3. Entro nella tua interfaccia di GitHub Repository -> "Settings" -> Sidebar sin: "Secrets and variables" -> "Actions" e configuri in **Repository Secrets** il param `TURBO_TOKEN`. Fai lo stesso passandoselo in **Variables** sotto il nome `TURBO_TEAM`.
   Il Remote Caching sarà auto-abilitato in modo automatico su OGNI CI run da quel punto in poi.

---

## 4. Costruire l'effettivo Delivery Workflow (Deploy in Produzione)

Poiché l'API non è fissata mentre l'App Native avverrà via EAS (Expo Application Services), avresti un Setup Separato dai Controlli base della CI.

Ti potremmo suggerire di creare due nuovi workflow: `.github/workflows/deploy-native.yml` e `.github/workflows/deploy-api.yml`
Questi due faranno Deploy solo ed esclusivamente nel caso in cui un Push va in Branch MAIN e su Cartelle pertinenti. Questo impedisce di submittare una Release del Mobile se avete solo toccato l'API.

**Workflow App Mobile (Expo/EAS):**
Utilizzando pass-through di Secrets e l'ottima infrastruttura di expo:

```yaml
name: Deploy Native via EAS
on:
  push:
    branches:
      - main
    paths:
      - "apps/native/**" # deployiamo l'app selettivamente
jobs:
  build_and_submit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - name: Setup
        uses: ./tooling/github/setup # setup di node + pnpm
      - name: Setup Expo e EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }} # token EAS prelevato dai secret di log in da GitHub
      - name: Lancia EAS Submit Build ad App Stores / Expo Go Preview
        run: pnpm --filter native eas build --submit --platform all --profile production
```

**Workflow API:**
Dato che non hai un'idea decisa sull'API, hai tre comode scelte di PaaS moderne:

- **Render o Railway o Fly.io**: Meno sforzo mentale; basta collegare la risorsa al repo GitHub dal loro sito, in due click, dicendo di "Rilevare la build solo nella cartella dell'API se viene aggiornata in master", ed essi compileranno il progetto backend senza impiegare una traccia su GitHub Actions.
- **Vercel** per API Serverless in edge. (Il framework lo supporta in automatico in zero configuration inserendo la cartella nella dash di vercel)
- **AWS AppRunner / AWS EC2** in Docker se punti ad implementare NGINX + PM2 nel classico metodo "fatto a mano", tramite deploy ssh-based rsyncando in cartelle dell'istanza e avviando il server dal Cloud e riavviando pm2 dal runner github su connessione tunnel SSH privato. (È poco costoso, ma richiede più manutenzione setup iniziale). Lì devi passarti con Github Secrets la SSH Keys AWS.

---

## 5. Che cos'è questa "Merge Queue"?

Nel tuo `ci.yml` vedi citato:

```yaml
on:
  merge_group:
```

La **Merge Queue (Coda di Merge)** è un trucco formidabile di scalabilità. Se un giorno diventate 5 developer o banalmente l'uso delle Pull request è così costante in un giorno, avremmo uno scenario orribile:
Sviluppatore A e B completano un ticket per conti separati e il CTO approva a entrambi la Pull Request quasi nello stesso momento, avendoli passati i tests della validazione singola dei codici separati su PRs. Tuttavia al termine di fusione al ramo MAIN, scontrandosi fra le linee non calcolate in precedenza testando in un ambiente unito, introducono un bug su master disattivando tutti (Master branch rotto).

**GitHub ha uno Strumento per questo:** invece di premerne Unione immediata, il Developer può cliccare "Add to Merge Queue" anziché il pulsante di Merge tradizionale.

1. GitHub mette il file di PR numero A ed il file di PR numero B in "fila / coda".
2. Prende il tuo Main, ci merge temporaneamente i branch uniti, fa rieseguire CI Test a QUESTA versione unita in sottofondo nel workflow (questo trigger di background che github lancia si identifica come `merge_group` trigger di cui avevamo la voce in `ci.yml`).
3. Alla terminazione e approvazione a pallino rosso/verde in GitHub della CI, esso la sposa definitivamente.
   Zero problemi, e la CI risolverà le dispute.

### Come attivare la Merge Queue su GitHub

Per abilitare questa funzione sulla vostra repository, segui questi passaggi:

1. Assicurati che l'evento `merge_group:` sia presente nel blocco `on:` del tuo workflow (come è già impostato nel nostro `.github/workflows/ci.yml`).
2. Vai sulla pagina della tua repository su GitHub e clicca nella tab **"Settings"** (Impostazioni).
3. Nella barra laterale sinistra, sotto la sezione "Code and automation", clicca su **"Branches"**.
4. Clicca su **"Add branch protection rule"** (oppure modifica la regola esistente per il tuo branch `main` cliccandoci sopra).
5. Se stai creando una nuova regola, inserisci `main` nel campo _"Branch name pattern"_.
6. Scorri l'elenco delle varie opzioni di protezione e spunta la casella **"Require merge queue"**.
7. Salva la nuova configurazione cliccando sul bottone **"Save changes"** a fondo pagina.

_(Nota: L'opzione "Require merge queue" è utilizzabile in forma nativa in repositories private che operano sotto piane Github per Organizzazioni, o su i repositories Pubblici)._
