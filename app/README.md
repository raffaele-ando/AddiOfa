# AddiOFA: il sito

Sito statico (React 19, Vite 6, Tailwind 4) per prepararsi al test d'inglese dell'OFA. Gratuito, senza account, senza server: domande e correzione stanno nel browser, i progressi nel dispositivo (`localStorage`, chiave storica `ofa_polimi_app_state`, con esporta/importa dalle Impostazioni).

> Progetto studentesco indipendente, non affiliato al Politecnico di Milano.

## Avvio

```bash
npm ci
npm run dev       # http://localhost:3000
npm run lint      # tipi (tsc --noEmit)
npm test          # prove unitarie (app/tests/unit)
npm run build     # sito in dist/ (vedi DEPLOY.md per pubblicarlo)
npm run preview   # prova locale del sito costruito
```

## Dove sta cosa

| Percorso | Cosa contiene |
|---|---|
| `src/config/offer.ts` | Nome, avvertenza di indipendenza, il formato del test (`EXAM`: 30 domande, 15 minuti, soglia 25), numeri dell'OFA |
| `src/access/` | Il banco domande: `import { provider } from '../access'` (correzione e simulazioni, tutto nel browser) |
| `src/data/questions.ts`, `theory.ts` | Banco e teoria, GENERATI da `../contenuti` con `npm run contenuti` (dalla radice): non si modificano a mano |
| `src/lib/` | Logica pura: ripasso SM-2 (`spacedRepetition.ts`), diagnostico e probabilità (`diagnostic.ts`), simulazioni (`exam.ts`), salvataggio (`storage.ts`), profilo, sfide, studio, guida |
| `src/components/`, `src/screens/` | Interfaccia; le schermate extra stanno in `src/screens/extra/<area>/` |
| `src/brand/` | Brand Kit: token, icone, illustrazioni, catalogo (`?brand`, solo in sviluppo) |
| `tests/unit/` | Prove unitarie (`npm test`); `tests/anteprime/` pagine di prova per lavorare in locale |

## Il quiz diagnostico

Dieci domande (3 A1, 2 A2, 5 B1, argomenti tutti diversi). La probabilità mostrata è calcolata davvero, con un modello beta-binomiale: dato il numero di risposte giuste su 10, stima la probabilità di farne almeno 25 su 30 al test reale. Le risposte del diagnostico alimentano già il ripasso.

## Dati e privacy

Nessun dato lascia il dispositivo: non c'è nessun server a riceverlo, nessun account, nessun cookie di tracciamento, nessuna statistica d'uso. Chi cambia dispositivo esporta i progressi in un file e li importa dall'altra parte.
