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
| `tools/archivio/` | Script e dump usati per costruire e controllare il banco (non servono all'app) |

## Il quiz diagnostico

Dieci domande (3 A1, 2 A2, 5 B1, argomenti tutti diversi). La probabilità mostrata è calcolata davvero, con un modello beta-binomiale: dato il numero di risposte giuste su 10, stima la probabilità di farne almeno 24 su 30 al test reale. Esempi: 6/10 → 11%, 8/10 → 46%, 9/10 → 70%, 10/10 → 91%. Le risposte del diagnostico alimentano già il ripasso.

## Pagamenti

L'app non gestisce mai dati di pagamento. Ogni piano apre un link di pagamento esterno (per esempio uno Stripe Payment Link), da impostare in `.env` (vedi `.env.example`). Senza link l'app mostra "Siamo in beta" e resta tutta gratuita.

Prima di attivare i pagamenti serve:

1. **Verifica lato server.** Oggi le domande e le risposte sono nel bundle JavaScript e non esiste un controllo degli acquisti: qualunque blocco fatto solo nel browser si aggira in pochi minuti. Le parti a pagamento vanno servite da un backend (per esempio Cloudflare Worker + D1, oppure Cloud Functions) che verifica il pagamento tramite webhook del provider.
2. **Termini e condizioni** scritti e controllati da qualcuno competente, con le condizioni della garanzia identiche a quelle mostrate nell'app (`GUARANTEE_CONDITIONS`). Le condizioni sono volutamente visibili accanto al prezzo: nasconderle solo nei termini esporrebbe a contestazioni per pratica commerciale scorretta.
3. **Aspetti fiscali** (partita IVA o regime adatto) prima di incassare.

## Dati e sincronizzazione

Lo stato è in `localStorage` (chiave storica `ofa_polimi_app_state`, da non cambiare) e, con il login Google, in Firestore `users/{uid}`. Sul cloud va una versione alleggerita dello storico, per restare sotto il limite di 1 MiB per documento: i clic dettagliati restano solo in locale e i log per domanda sono conservati per le ultime 50 simulazioni.
