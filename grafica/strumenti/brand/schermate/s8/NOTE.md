# s8 - home rischio / ATLAS / landing

Fatto: 01 (3 stati), 11 (3 stati B), 12 landing, 13 (15 schermate + avatar), 14, 21, 33, 39. Generatori gen_*.py, moduli in componenti.py
(barra di stato, misuratore, avviso, pulsante, nav a 3/5 voci, card obiettivo, fattori, percorso, icone in piu).
Lanciare con `--tavola` per le tavole in brand/concept-svg/_tavole/home/.

Imparato
- Disegnare in px dell'originale con T(...,larg=misurata) (corpo ricavato dalla larghezza) funziona meglio che indovinare i corpi.
- Ritaglio con coordinate: zoom con griglia (px originali) e lettura dei numeri direttamente.
- Schermate ritagliate dal foglio: si disegna in coordinate del foglio dentro un gruppo traslato (TelaF).
- Pagine lunghe (landing, 12): 750 KB per i tracciati di testo; salva_leggero() arrotonda i decimali.
- File loghi pieno-campo pesa 468 KB: per le icone piccole usare marchio-tile-porta.svg.

Da migliorare in ui.py: sfumatura con opacita' per fermata (qui sfum_op), ombra con area relativa al contenuto traslato,
corpo da larghezza (fit), nav con icone attive piene, icone mancanti (cuffie, monete, bersaglio-freccia, libro-pieno...).
Non convince: 06-esplora (decorazioni astratte), 12 landing (scarto 22, scritta a mano in Inter inclinato, foto hero con pulsanti ripuliti), file 12/11 > 300 KB.
