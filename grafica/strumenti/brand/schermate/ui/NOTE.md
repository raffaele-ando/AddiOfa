# Note dell'agente `ui` (componenti e token)

Generatori: `gen_componenti.py` (86 SVG: componenti singoli + un foglio per kit), `gen_token.py` (palette, tipografia),
`rapporto.py` (brand/concept-svg/_rapporti/ui.json). Primitive in `extra.py`. Tutto si rilancia da solo.

## Cosa ho imparato
- Un SVG con molto testo come tracciati supera subito i 300 KB (un foglio con ~100 parole: 450 KB). Soluzione in
  `TelaCompatta`: ogni lettera (per peso) è definita una volta in `<defs>` e riusata con `<use>` (155 KB). Attenzione alla
  scala dei glifi: in unità del font (upm 2048) la scala è ~0,01 e va scritta con 5 decimali (con `n()` a 2 decimali le lettere
  diventavano più piccole dell'avanzamento: testo "spaziato" in modo strano).
- La cartella `ui/` e il file `ui.py` hanno lo stesso nome: in `extra.py` `ui.py` si carica per percorso (importlib) come `ui_base`.
- Il Light (300) esiste nei file Inter ma `ui._peso` lo arrotonda a 400: `extra.py` allarga la lista (patch del modulo caricato, `ui.py` intatto).
- I «pannello» del segmentatore sono pezzi a metà (un pulsante in 4 riquadri, una scritta unita a un'altra): si assegnano per
  posizione del centro (`rapporto.py`, REGIONI), non uno a uno.
- I colori dei campioni vanno presi dalle scritte HEX (i pixel del jpeg sono più saturi: il «blu» del campione è #2B7FFF e non #3B82F6).
- Misura giusta del kit: 17 e 16 sono a 1881 px, 08/50/28 a 1536 px: i componenti restano nei pixel della propria immagine
  (i moduli di 28 nel foglio blu sono scalati x1,225).

## Correzioni ai token di src/brand/tokens.ts (da riportare nell'app, non l'ho toccato)
- `KIT.blu.pulsante.primario` è rosso (#F4393F, 151x45): è il primario dell'immagine 50 (blu con primario rosso), non del kit blu piatto:
  in 17 il primario è blu (#1C6EFD circa, 145x47 a 1881 px, r 12). Il rosso è il «Rischio» di 28 (pulsante-rischio).
- Interruttore blu: 51x30 in 17 (token 47x27); casella blu 26 (token 24); radio blu 29 (token 26).
- Misuratore: arco di ~212° (da 164° a 376°) invece di 220° da 160°.
- Palette: l'immagine 17 scrive Testo secondario #64748B, 16 scrive Sfondo #EDF2FF, Superfici #F8FAFF, Accento #FF6B6B; la palette canonica
  (28, 40, 50) è #6B7280 e Azzurro #60A5FA. I fogli di kit riportano il valore scritto nel loro originale.

## Cosa non mi convince
- Le ombre/riflessi del kit luminoso sono approssimati (veli bianchi e ombre colorate), non misurati su maglie.
- Per il kit rosso l'immagine 08 non mostra badge e card di stato: non li ho inventati.
- Gli stati disabilitato/focus non compaiono negli originali: non fatti.
