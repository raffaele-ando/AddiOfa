# Scelte di design dell'utente

Le scelte si fanno nella galleria (Artifact «Galleria Design AddiOFA», sezione per sezione) e si leggono dalla collezione `scelte` del suo database. Questo file le riporta nel repository.

| Sezione | Variante scelta | Fonte | Data | Stato |
|---|---|---|---|---|
| Home | `home-n14-a`: misuratore a tutta larghezza, prossimo obiettivo, grafico dei punti misurati | concept 14 · schermata 1 | 11/10/2026 | implementata e pubblicata (adattata: probabilità stimata, solo punti misurati) |
| Landing, funnel, risultato, paywall, simulazione, statistiche, inviti, brand e altre | da scegliere | | | |

## Logo (11/10, dalla galleria `galleria-logo.html` (in `app/dist-demo/`, non nel repository))

- **Marchio nell'app**: orizzontale, lettermark «A piena con la stella a base piatta» + wordmark «Primario» (scintilla nella O), su fondo chiaro; su scuro gli stessi disegni con i colori dei token. Implementato in `app/src/brand/Marchio.tsx` (dati generati da `tools/genera-marchio.py`): intestazione della home, barra e mockup della landing, avvio.
- Sezione A (lettermark) scelta: «Navy, una tinta» (monocromatico: da usare per timbri/stampa, non ancora usato nell'app).
- **Icona dell'app e degli store**: il logo 3D, invariato (`docs/design/store/`; `icon-maskable-512.png` aggiunta al manifest).
- Lettermark definitivo (11/10, ultima indicazione): la **A piena del concept 07/35 con dentro la stella dalla base piatta** (non la scintilla a 4 punte). File `lettermark-piena-*.svg` e `lockup-*-piena*.svg` in `grafica/brand/logo/`; nell'app è già questo (`Marchio.tsx`). Le varianti con la scintilla nella A sono state tolte; la scintilla resta nella O del wordmark primario (esiste anche il wordmark con la stella a 5 punte nella O).
