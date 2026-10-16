# AddiOFA: guida per lavorare nel repository

Lingua: italiano nei testi per l'utente e nei documenti; codice, nomi di variabili e commit in italiano chiaro o inglese corrente, come il file che si tocca. Mai identificatori di modelli in commit, PR o codice.

## Cos'è

Sito web statico, gratuito e senza account, per preparare il test d'inglese dell'OFA del Politecnico di Milano. Nessun server: domande, correzione, simulazioni e progressi stanno nel browser (i progressi nel dispositivo, con esporta/importa), quindi regge qualsiasi numero di studenti contemporanei. Decisione del 16/10: non si pensa più alla monetizzazione (niente Pass, pagamenti, lista d'attesa, inviti, Project ID, classifica NOI). Il vecchio piano di business in `docs/business/AddiOFA_piano_definitivo.md` è superato e resta come storico. Come si pubblica: `app/DEPLOY.md`.

## Mappa

| Cartella | Cosa c'è | Si lavora qui quando |
|---|---|---|
| `app/` | App React 19 + Vite 6 + Tailwind 4 (`src/components`, `src/screens` (le schermate extra stanno in `src/screens/extra/<area>/` e si registrano in `registro.ts`, contratto in `extra/contesto.tsx`), `src/access` (il banco domande: `import { provider } from '../access'`), `src/lib`, `src/config`, `src/data`, `src/brand`) | si cambia l'app |
| `pass/`, `atlas/` | I due Worker Cloudflare del vecchio progetto a pagamento: **fuori uso**, l'app non li chiama più. Non si toccano; vanno spostati in `docs/archivio/` | mai |
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

- Minuscole e trattini, mai spazi né UUID. Cartelle di primo livello in italiano chiaro; i prodotti si chiamano `app`, `pass`, `atlas`.
- Mai rinominare i file di `grafica/fonti/design-concept/`: il numero NN del catalogo è la loro posizione alfabetica.
- Cartelle di grafica come `grafica/brand/*` non si rinominano (centinaia di riferimenti).
- Un documento nuovo va in `docs/` (non alla radice); uno vecchio e superato va in `docs/archivio/`.
- Ogni cartella con più di 5 file ha un `README.md` o `NOTE.md` di tre righe: cosa contiene e come si rigenera.
- Le grafiche che l'app spedisce stanno in `app/src/brand/essenziali/`, copiate da `grafica/brand/` con `npm run grafica:sync`. Non si importa mai da `grafica/` nel codice dell'app.

## Cose pesanti da non aprire (e perché)

`grafica/brand/{concept,concept-svg,tavole,livelli,vettori}` e `grafica/fonti/` valgono circa 500 MB e sono rigenerabili con gli script: `.rgignore` li esclude dalle ricerche. Leggerli solo per percorso esplicito. `.git` pesa 645 MB e non si riduce senza riscrivere la storia (non farlo).

## Cose che non si fanno

- Niente server, account, pagamenti, analytics, cookie di tracciamento: ogni funzione deve lavorare nel browser e funzionare subito. Se una funzione ha bisogno di un server, non si fa a metà: non c'è. Niente urgenza finta, account o recensioni finti, notifiche inventate.
- Nei testi per l'utente: niente «Pass», «Sblocca», «Gratis/Prova» come etichette, niente beta, dimostrativo, esperimento, «presto», «in arrivo». Tutto è aperto e senza limiti. «Simulazione di prova» è lecito. Un solo formato di test: 30 domande, 15 minuti, soglia 25/30.
- Niente `<text>` negli SVG generati (testi come tracciati), niente font esterni nella demo.
- Non si cancellano `app/firebase-applet-config.json` e `app/bun.lock`: li toglie l'utente.
- Niente PR né push su `main` senza richiesta; si lavora sul branch indicato.
- Pagine legali (Termini, Privacy, Cookie): scritte per un sito gratuito, senza account né pagamenti, con dati solo nel dispositivo. Nell'app niente marcatori «bozza»; resta l'avvertenza «Progetto studentesco indipendente, non affiliato al Politecnico di Milano». Una revisione di un professionista resta consigliata (si dice qui e nelle note, non nell'app).
- Niente animazioni decorative (scala, rimbalzo, galleggiamento, pulsazione, conteggi che salgono, coriandoli): l'interfaccia è statica; restano gli spinner di caricamento, cambi di colore ≤ 120 ms e le animazioni a pezzi delle illustrazioni in `app/src/brand/animazioni/`.

## Prima di dire "fatto"

`npm run check` (link, tipi, prove, build); per l'app anche la prova in Chromium a 400 e 1280 px, tema chiaro e scuro, zero errori in console. Per i contenuti la validazione in `contenuti/validazione/`. Dire con numeri onesti cosa è stato provato e cosa no.

## Lavoro con agenti

Ogni agente ha cartelle sue e un `NOTE.md`; non esegue git; non cancella file (nessun `rm`); scrive i risultati su disco prima di finire. Chi coordina committa a ogni fase. Se un agente si ferma (limiti di spesa), si riprende con SendMessage dai file su disco.
