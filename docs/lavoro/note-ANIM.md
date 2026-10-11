# note-ANIM: interfaccia statica

Decisione dell'utente: nessuna animazione decorativa. Restano lo spinner di caricamento (`Loader2 animate-spin`, `.brand-anim-gira`) e i cambi di colore/ombra/filtro ≤ 120 ms.

## Stato trovato
Il lavoro era già quasi tutto nei commit precedenti (nessun uso di `motion/react`, nessun coriandolo, `CalcoloRisultato` già statico con tre tappe spuntate, `brand.css` con il solo `brand-gira`).

## Fatto in questa fase
- `CLAUDE.md`: regola «Niente animazioni decorative» in «Cose che non si fanno».
- `brand/Illustrazione.tsx`: la prop `animazione` accetta di fatto solo `gira`; ogni altro valore è ignorato.
- `components/StatsMode.tsx`: Recharts animava barre, radar e tooltip di default; messo `isAnimationActive={false}` su tutti i `Bar`, sul `Radar` e sui `Tooltip` (era l'unico movimento rimasto, schermata Progressi).
- `vite.config.ts`: tolto il chunk `motion` (`motion/react`, `canvas-confetti` non sono più importati). Le dipendenze restano in `package.json`/lockfile: toglierle spetta a chi gestisce i pacchetti.

## Eccezioni dichiarate
- `brand/catalogo.ts` e `BrandKit.tsx` conservano il tipo `Animazione` e il campo `animazione` come metadati di sviluppo; la galleria dice «non attiva, l'app è statica».
- Il conto alla rovescia della simulazione cambia ogni secondo: è un orologio, non un'animazione.

## Prove
tsc ok; `npm test` 99/99; `build:demo` superato; zero grep per le animazioni vietate; Chromium 400×800 chiaro/scuro e 1280×800 scuro: flusso completo (diagnostico, calcolo, risultato, simulazioni, paywall, progressi, ricarica), zero errori in console, nessun overflow, schermate ferme tra 0 e 1,5 s salvo il timer. Gli script `static.py`/`e2e.py` originali si fermano perché il passo di calcolo è cambiato («Vedi il risultato» al posto di «Salta»): usate le copie `static2.py`/`e2e2.py` nello scratchpad. Non provato: 1280 chiaro.
