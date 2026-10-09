# Note luminoso (kit blu luminoso, immagini 16 e 17)

- Un generatore per gruppo di soggetti (`s_*.py`), tutti con `Scena` di `comune.py`; `salva()` scrive luminoso (img 16) e `vivo/` (img 17: stessa illustrazione, blu più acceso, senza bagliore, lucchetto/croce rossi) più la variante `.scuro.svg`.
- Oggetti nuovi in `oggetti_nuovi.py`: banconota, lucchetto, trofeo, orologio, cappello_laurea, busta, bulbo_lampadina, aereo, party_popper, lente, clessidra. Libri e bandiera UK riusano `illustrazioni/oggetti.py`.
- Il bagliore caldo è un gradiente radiale (niente filtri) ritagliato sulla forma con clipPath: regge anche a 120 px. Alone "pallido" (chiaro) attenuato nel tema scuro, altrimenti diventa nebbia.
- Le immagini 16 e 17 sono due stili dello stesso kit: il 17 ("vivo") ha cose che non esistono nel 16 (B rossa nel quiz, lucchetto rosso, orologio rosso): sono in `STILI`/parametri `lum`.
- Scritte scure (numero 82%) nel tema scuro: `Scena.per_scuro[id] = colore`.
- Sigillo del Politecnico: segnaposto neutro (17.034).
- Rifinire: continenti del globo e coriandoli del party popper sono la parte meno fedele; i ritagli piccoli 17.037/038 sono la stessa illustrazione.
