# AddiOFA: guida per lavorare nel repository

Lingua: italiano nei testi per l'utente e nei documenti; codice, nomi di variabili e commit in italiano chiaro o inglese corrente, come il file che si tocca. Mai identificatori di modelli in commit, PR o codice.

## Cos'è

Sito web (PWA) gratuito per preparare il test d'inglese dell'OFA del Politecnico di Milano. È anche il canale con cui l'autore distribuisce il suo ecosistema: **Project** (l'autore), **Project ID** (account), **ATLAS** (algoritmo e infrastruttura, Worker in `atlas/`), **NOI** (classifica e community), **Agorà** (`polimi.agora`). Domande, correzione, simulazioni e progressi stanno nel browser (progressi nel dispositivo, esporta/importa), quindi il sito statico regge qualsiasi numero di studenti insieme; ATLAS serve per le iscrizioni (nome, email PoliMi, corso: raccolte subito al primo avvio), l'accesso Project ID e la classifica NOI. Decisione del 16/10: niente monetizzazione (niente Pass, pagamenti, lista d'attesa, inviti; il Worker `pass/` è in `docs/archivio/pass-worker/`). Il vecchio piano di business in `docs/business/AddiOFA_piano_definitivo.md` è superato. Come si pubblica: `app/DEPLOY.md` (sito) e `atlas/DEPLOY.md` (Worker).

## Mappa

| Cartella | Cosa c'è | Si lavora qui quando |
|---|---|---|
| `app/` | App React 19 + Vite 6 + Tailwind 4 (`src/components`, `src/screens` (le schermate extra stanno in `src/screens/extra/<area>/` e si registrano in `registro.ts`, contratto in `extra/contesto.tsx`), `src/access` (il banco domande: `import { provider } from '../access'`), `src/lib`, `src/config`, `src/data`, `src/brand`) | si cambia l'app |
| `atlas/` | Worker Cloudflare + D1 di ATLAS: iscrizioni con email PoliMi, Project ID (verifica i token Firebase), classifica NOI, esportazione per l'autore. Si pubblica con `atlas/DEPLOY.md`; prove: `cd atlas && npm test` | si cambia il server |
| `contenuti/` | Fonte unica di domande, teoria e spiegazioni; genera i file in `app/src/data/` e il seed del Worker | si cambiano i contenuti |
| `grafica/` | Officina grafica: `brand/` (risultati), `strumenti/` (programmi Python), `sapere/` (metodo), `fonti/` (immagini di partenza) | si ridisegna o si estrae grafica |
| `docs/` | `business/` (piano, conti, ricerche), `design/` (catalogo dei concept), `lavoro/` (note degli agenti), `strategia/`, `dati/` (graduatorie), `archivio/` (storico) | si leggono o scrivono documenti |
| `tools/` | Script di repository (`sincronizza-essenziali.sh`, `check-links.mjs`, build demo) | si automatizza |
| `.claude/skills/` | `metodo-di-studio`, `ricreare-grafica` | si usano le skill |

## Comandi

Dalla radice: `npm run dev` · `lint` (tipi) · `test` (prove unitarie) · `build` (sito statico in `app/dist/`) · `build:demo` (comodità: una sola pagina HTML) · `check` (link, tipi, prove, build) · `contenuti` e `contenuti:valida` · `grafica:sync`.
Nella cartella del pacchetto `app/`: `npm run lint`, `npm test`, `npm run build`, `npm run preview`.
Gli script Python della grafica si lanciano **da `grafica/`**: `python3 strumenti/brand/<script>.py` (percorsi di `sapere/` e delle skill sono relativi a `grafica/`).

## Regole di nome e di posto

- Minuscole e trattini, mai spazi né UUID. Cartelle di primo livello in italiano chiaro; i prodotti si chiamano `app`, `atlas`.
- Mai rinominare i file di `grafica/fonti/design-concept/`: il numero NN del catalogo è la loro posizione alfabetica.
- Cartelle di grafica come `grafica/brand/*` non si rinominano (centinaia di riferimenti).
- Un documento nuovo va in `docs/` (non alla radice); uno vecchio e superato va in `docs/archivio/`.
- Ogni cartella con più di 5 file ha un `README.md` o `NOTE.md` di tre righe: cosa contiene e come si rigenera.
- Le grafiche che l'app spedisce stanno in `app/src/brand/essenziali/`, copiate da `grafica/brand/` con `npm run grafica:sync`. Non si importa mai da `grafica/` nel codice dell'app.

## Cose pesanti da non aprire (e perché)

`grafica/brand/{concept,concept-svg,tavole,livelli,vettori}` e `grafica/fonti/` valgono circa 500 MB e sono rigenerabili con gli script: `.rgignore` li esclude dalle ricerche. Leggerli solo per percorso esplicito. `.git` pesa 645 MB e non si riduce senza riscrivere la storia (non farlo).

## Cose che non si fanno

- Niente pagamenti, analytics, cookie di tracciamento. Ogni funzione funziona subito nel browser; ciò che ha bisogno di ATLAS (iscrizione, Project ID, classifica NOI) dice con una riga vera se non è collegato e non finge mai. Dati personali raccolti solo con informativa, consensi facoltativi non preselezionati, email PoliMi mai segnata «verificata» se non lo è. Niente urgenza finta, account o recensioni finti, notifiche inventate.
- Nei testi per l'utente: niente «Pass», «Sblocca», «Gratis/Prova» come etichette, niente beta, dimostrativo, esperimento, «presto», «in arrivo». Tutto è aperto e senza limiti. «Simulazione di prova» è lecito. Un solo formato di test: 30 domande, 15 minuti, soglia 25/30.
- Niente `<text>` negli SVG generati (testi come tracciati), niente font esterni nella demo.
- Non si cancellano `app/firebase-applet-config.json` e `app/bun.lock`: li toglie l'utente.
- Niente PR né push su `main` senza richiesta; si lavora sul branch indicato.
- Pagine legali (Termini, Privacy, Cookie): scritte per un sito gratuito, senza account né pagamenti, con dati solo nel dispositivo. Nell'app niente marcatori «bozza»; resta l'avvertenza «Progetto studentesco indipendente, non affiliato al Politecnico di Milano». Una revisione di un professionista resta consigliata (si dice qui e nelle note, non nell'app).
- Niente animazioni decorative (scala, rimbalzo, galleggiamento, pulsazione, conteggi che salgono, coriandoli): l'interfaccia è statica. Unica eccezione richiesta dall'utente: nella landing le schede sotto l'hero compaiono (dissolvenza breve) solo quando chi scorre ci arriva (`useRivelaScorrendo` in `Landing.tsx`); la pagina da sola non si muove; restano gli spinner di caricamento, cambi di colore ≤ 120 ms e le animazioni a pezzi delle illustrazioni in `app/src/brand/animazioni/`.

## Prima di dire "fatto"

`npm run check` (link, tipi, prove, build); per l'app anche la prova in Chromium a 400 e 1280 px, tema chiaro e scuro, zero errori in console. Per i contenuti la validazione in `contenuti/validazione/`. Dire con numeri onesti cosa è stato provato e cosa no.

## Lavoro con agenti

Ogni agente ha cartelle sue e un `NOTE.md`; non esegue git; non cancella file (nessun `rm`); scrive i risultati su disco prima di finire. Chi coordina committa a ogni fase. Se un agente si ferma (limiti di spesa), si riprende con SendMessage dai file su disco.
