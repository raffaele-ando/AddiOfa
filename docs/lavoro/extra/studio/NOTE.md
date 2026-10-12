Screenshot di prova dell'area STUDIO (porta 5203, demo): `<schermata>-<larghezza>-<tema>[-variante][-pN].png`, `-pN` = pezzi scorrendo la pagina.
Varianti: `-free` senza Pass, `-povero` quasi senza progressi, `-sbagliate` filtro delle correzioni; `esito-live-*` = esito di una simulazione fatta davvero.
Si rigenerano con un server `VITE_MODE=demo npx vite --config vite.demo.config.ts --port 5203` e Playwright (stato in `localStorage['ofa_polimi_app_state']`).
