# AddiOFA

Web app (PWA) per prepararsi all'OFA di Inglese: ripasso dilazionato SM-2, simulazioni da 30 domande in 15 minuti, prontuario delle regole e un funnel di ingresso con quiz diagnostico.

> Progetto studentesco indipendente e non ufficiale. Non affiliato, autorizzato o collegato al Politecnico di Milano.

## Avvio

```bash
npm ci
npm run dev      # http://localhost:3000
npm run lint     # typecheck
npm run build    # build di produzione in dist/
```

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `src/config/offer.ts` | Nome dell'app, disclaimer, piani e prezzi, condizioni della garanzia, testi sulle conseguenze dell'OFA |
| `src/components/Onboarding.tsx` | Funnel dei mockup: verifica → certificazione → OFA → quiz da 10 domande → risultato → piani |
| `src/components/Plans.tsx` | Piani (Pass Simulatore, CRAM Pass Pro, Garanzia Promosso) e checkout esterno |
| `src/components/CheatSheet.tsx` | Prontuario delle 24 regole con le trappole tipiche |
| `src/components/GuaranteeTracker.tsx` | Avanzamento verso i requisiti della garanzia (anche in Statistiche) |
| `src/lib/diagnostic.ts` | Scelta delle domande del diagnostico e stima della probabilità di superare il test |
| `src/data/questions.ts` | Banco di 636 domande |
| `src/config/ecosystem.ts` | Nomi dell'ecosistema (Project, Project ID, ATLAS, NOI) e permessi della schermata di consenso |
| `src/components/ProjectConsent.tsx` | Consenso al collegamento con il Project ID, permesso per permesso |
| `src/components/ProjectProfile.tsx` | Profilo Project ID: @nome utente, app collegate, esporta ed elimina i dati |
| `src/components/Leaderboard.tsx` | Classifica NOI |
| `src/lib/atlas.ts` | Client dell'API ATLAS (`../atlas/`) |
| `src/brand/` | Brand Kit: token misurati, componenti in codice, icone miste, illustrazioni animabili, catalogo (`?brand`) |
| `brand/` e `strumenti/brand/` | Elementi estratti e ricreati dalle immagini, e il programma che li produce e li verifica (vedi `strumenti/brand/README.md`) |
| `tools/archivio/` | Script e dump usati per costruire e controllare il banco (non servono all'app) |

## Il quiz diagnostico

Dieci domande (3 A1, 2 A2, 5 B1, argomenti tutti diversi). La probabilità mostrata è calcolata davvero, con un modello beta-binomiale: dato il numero di risposte giuste su 10, stima la probabilità di farne almeno 24 su 30 al test reale. Esempi: 6/10 → 11%, 8/10 → 46%, 9/10 → 70%, 10/10 → 91%. Le risposte del diagnostico alimentano già il ripasso.

## Pagamenti

L'app non gestisce mai dati di pagamento. Ogni piano apre un link di pagamento esterno (per esempio uno Stripe Payment Link), da impostare in `.env` (vedi `.env.example`). Senza link l'app mostra "Siamo in beta" e resta tutta gratuita.

Prima di attivare i pagamenti serve:

1. **Verifica lato server.** Oggi le domande e le risposte sono nel bundle JavaScript e non esiste un controllo degli acquisti: qualunque blocco fatto solo nel browser si aggira in pochi minuti. Le parti a pagamento vanno servite da un backend (per esempio Cloudflare Worker + D1, oppure Cloud Functions) che verifica il pagamento tramite webhook del provider.
2. **Termini e condizioni** scritti e controllati da qualcuno competente, con le condizioni della garanzia identiche a quelle mostrate nell'app (`GUARANTEE_CONDITIONS`). Le condizioni sono volutamente visibili accanto al prezzo: nasconderle solo nei termini esporrebbe a contestazioni per pratica commerciale scorretta.
3. **Aspetti fiscali** (partita IVA o regime adatto) prima di incassare.

## Project ID, ATLAS e NOI

- **Project ID** è l'account unico delle app Project. Si entra con Google; subito dopo compare la schermata di consenso "AddiOFA vuole collegarsi al tuo Project ID", con un interruttore per ogni permesso. Solo il profilo di base è obbligatorio, gli altri partono spenti. Con "Annulla" non si collega nulla e si resta ospiti.
- **ATLAS** è l'algoritmo e l'infrastruttura: la firma "Algoritmo e infrastruttura ATLAS" è in menu, onboarding, statistiche, consenso e profilo. Il backend è il Worker in `../atlas/`.
- **NOI** è la classifica: ci entra solo chi attiva il permesso, dal consenso, dal profilo o con "Entra in classifica".
- Senza `VITE_ATLAS_API_URL` il consenso resta sull'account Google e sul dispositivo, e la classifica mostra "arriva presto".
- I nomi si cambiano tutti in `src/config/ecosystem.ts`.

## Dati e sincronizzazione

Lo stato è in `localStorage` (chiave storica `ofa_polimi_app_state`, da non cambiare) e, con il login Google, in Firestore `users/{uid}`. Sul cloud va una versione alleggerita dello storico, per restare sotto il limite di 1 MiB per documento: i clic dettagliati restano solo in locale e i log per domanda sono conservati per le ultime 50 simulazioni.
