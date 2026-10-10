# AddiOFA: guida per lavorare nel repository

Lingua: italiano nei testi per l'utente e nei documenti; codice, nomi di variabili e commit in italiano chiaro o inglese corrente, come il file che si tocca. Mai identificatori di modelli in commit, PR o codice.

## Cos'è

App web (PWA) per preparare il test d'inglese dell'OFA del Politecnico di Milano, con un Worker Cloudflare per accessi e pagamenti. Il piano di business è in `docs/business/AddiOFA_piano_definitivo.md`: un solo prodotto (Pass a 14,99 €), contenuti ripuliti, pagamenti spenti finché non c'è la partita IVA.

## Mappa

| Cartella | Cosa c'è | Si lavora qui quando |
|---|---|---|
| `app/` | App React 19 + Vite 6 + Tailwind 4 (`src/components`, `src/screens`, `src/access`, `src/lib`, `src/config`, `src/data`, `src/brand`) | si cambia l'app |
| `pass/` | Worker Cloudflare + D1: domande servite, entitlement, Stripe, lista d'attesa, inviti | si cambia il server |
| `atlas/` | Worker Project ID e classifica NOI (rimandato, non serve al lancio) | quasi mai |
| `contenuti/` | Fonte unica di domande, teoria e spiegazioni; genera i file in `app/src/data/` e il seed del Worker | si cambiano i contenuti |
| `grafica/` | Officina grafica: `brand/` (risultati), `strumenti/` (programmi Python), `sapere/` (metodo), `fonti/` (immagini di partenza) | si ridisegna o si estrae grafica |
| `docs/` | `business/` (piano, conti, ricerche), `strategia/`, `dati/` (graduatorie), `archivio/` (storico) | si leggono o scrivono documenti |
| `tools/` | Script di repository (`sincronizza-essenziali.sh`, `check-links.mjs`, build demo) | si automatizza |
| `.claude/skills/` | `metodo-di-studio`, `ricreare-grafica` | si usano le skill |

## Comandi

Dalla radice: `npm run dev` · `lint` · `build` · `build:demo` · `check` (link, tipi, build) · `grafica:sync`.
Nella cartella del pacchetto: `app/` (`npm run lint`, `npm run build`), `pass/` (`npm run typecheck`, `npm run dev`).
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

- Niente pagamenti reali attivati: `PAYMENTS_ENABLED` resta `false` finché l'utente non lo cambia. Niente urgenza finta, account o recensioni finti, notifiche inventate.
- Niente `<text>` negli SVG generati (testi come tracciati), niente font esterni nella demo.
- Non si cancellano `app/firebase-applet-config.json` e `app/bun.lock`: li toglie l'utente.
- Niente PR né push su `main` senza richiesta; si lavora sul branch indicato.
- Pagine legali: sono bozze da far rivedere a un professionista, da dichiarare tali.

## Prima di dire "fatto"

`npm run check`; per l'app anche `npm run build:demo` e la prova in Chromium a 400 e 1280 px, tema chiaro e scuro, zero errori in console. Per i contenuti la validazione in `contenuti/validazione/`. Dire con numeri onesti cosa è stato provato e cosa no.

## Lavoro con agenti

Ogni agente ha cartelle sue e un `NOTE.md`; non esegue git; non cancella file (nessun `rm`); scrive i risultati su disco prima di finire. Chi coordina committa a ogni fase. Se un agente si ferma (limiti di spesa), si riprende con SendMessage dai file su disco.
