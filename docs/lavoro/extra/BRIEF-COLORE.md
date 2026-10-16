# Colore e gerarchia: brief comune (16/10)

L'utente: «Attento alle duplicazioni nel design, al posizionamento degli elementi e alla gerarchia. Stai attento anche alla teoria dei colori: non uniformare tutto, dai importanza. Guarda i concept e anche quelli che hai convertito.»
Oggi le schermate nuove sono quasi tutte blu su grigio chiaro: icone tutte uguali, barre tutte blu, carte tutte della stessa tinta. Nei concept il colore SIGNIFICA qualcosa e guida l'occhio.

## Cosa guardare (con Read, sono PNG)
- Concept originali in `grafica/fonti/design-concept/` (elenco NN → file in `grafica/fonti/INDICE.md`) e le loro ricostruzioni/ritagli già fatti: `grafica/brand/concept/<NN>-*/` (ritagli per schermata: `NNN-schermata.png`, `anteprima.png`) e `grafica/brand/concept-svg/schermate/<NN>-*/` (SVG ricostruiti). Schermate di riferimento per il colore: NN 06 e 22 (Sfide, Profilo, Badge, Obiettivi, Attività: tessere icona colorate arancio/verde/rosso/viola/blu, scheda verde «Sfida della settimana», scheda blu «Supera l'OFA», valori «+150 pt» in ambra, barre blu e verdi), NN 18 e 19 (tessere con cerchi colorati: rosso, blu, verde), NN 03/14/21/33/39 (home: fasce corallo/ambra/verde), NN 31/36/49 (liste con icone colorate), 13, 30, 34.
- Palette del brand (concept 15/35): navy #0F172A, blu #3B82F6, azzurro #60A5FA, verde #22C55E, rosso #EF4444, ambra #F59E0B, viola #8B5CF6 («Quiz / Apprendimento»), grigi #E5E7EB/#6B7280, fondo #F6F8FC.

## Sistema di colore dell'app (token in `app/src/index.css`; NON modificarlo: se ti serve altro scrivilo in NOTE)
- Blu (`azione*`): azione e studio: il bottone principale, i link, lezioni e teoria, navigazione attiva.
- Verde (`alto*`): ciò che è riuscito: obiettivi raggiunti, accuratezza, superato, progresso verso l'obiettivo.
- Ambra/arancio (`medio*`): sforzo e premio: giorni di studio, tempo, trofei, scadenze, attenzione.
- Corallo/rosso (`basso*`): confronto e rischio: duelli, errori, sbagliato, tempo scaduto, probabilità bassa.
- Viola (`viola*`, nuovo): apprendimento e traguardi: badge, quiz, livelli, memoria.
- Navy (`testo`): i titoli e i numeri; grigio (`testo-tenue`) il testo di supporto; `superficie-2` le carte neutre.
Kit pronto in `app/src/screens/extra/ui.tsx` (NON modificarlo): `type Tono`, `TONI[tono]` (classi complete: tinta, icona, testo, barra, pieno, bordo), `IconaTono` (tessera con icona colorata), `BarraTono` (barra nel tono). Le classi Tailwind vanno scritte intere (`bg-alto-tinta`, `text-alto-testo`, `bg-viola-pieno`...), mai costruite a pezzi. Per il testo colorato su fondo chiaro/tinta usa SEMPRE `text-<tono>-testo` (contrasto ≥ 4,5:1); `<tono>-numero` per numeri grandi e icone (≥ 3:1).

## Regole di gerarchia (valgono per ogni schermata)
1. Un solo punto focale per schermata: UN bottone pieno blu (azione principale); il resto secondario (contorno/tinta) o testuale. Mai due pulsanti pieni di pari peso.
2. Un solo blocco «in evidenza» tinto per area visibile (la sfida del giorno verde, la prossima lezione blu, l'avviso ambra): le altre carte restano neutre (`superficie-2`). Niente riquadri tinti uno dopo l'altro.
3. Il colore sta in icone, barre, numeri chiave e piccole etichette; i titoli restano navy. Non colorare i testi lunghi.
4. Tono per significato, non a rotazione: la stessa cosa ha sempre lo stesso colore in tutta l'app (giorni di studio = ambra ovunque; domande imparate = verde; simulazioni = blu; tempo = ambra; badge = viola; duelli = corallo; obiettivi = verde).
5. Scala del testo: titolo di pagina 26/40 (800), sezione 15,5 (700), titolo di carta 15 (700), corpo 14, nota 12,5; numeri chiave 26-32 (800, tabulari). Spazi: 24 tra sezioni, 10 tra titolo e contenuto, 8 tra righe di lista, 12 tra carte.
6. Niente duplicazioni: la stessa informazione una volta sola per schermata (non titolo e sottotitolo che dicono lo stesso; non due pulsanti con la stessa etichetta; non la stessa icona/illustrazione su righe adiacenti; non un'etichetta ripetuta su ogni carta se vale per tutte); la stessa azione non compare sia come riga sia come pulsante nella stessa vista.
7. Posizionamento: azioni e comandi sempre nello stesso posto (freccia indietro a sinistra del titolo, comandi piccoli a destra del titolo, azione principale in basso nella carta o in fondo alla pagina, mai in mezzo al testo); nessuna icona decorativa a destra del titolo; le illustrazioni solo dove aiutano (stati vuoti, esiti, intestazioni delle schede principali).
8. Tema scuro: gli stessi token si adattano; controlla che le tinte non diventino fango e che il blu d'azione resti luminoso ma non fluorescente. Contrasto con `tools/controlla-contrasto.py` (vedi l'uso nel file) o misurato in pagina.

## Come lavorare
- Regole del repository: `CLAUDE.md` (statico: niente animazioni decorative; token, niente colori letterali per fondi e testi; italiano; nessun git; nessun `rm`). Contratto delle schermate extra: `docs/lavoro/extra/BRIEF.md`.
- Server di prova in modalità demo su una porta TUA: `cd /home/user/AddiOfa/app && (VITE_MODE=demo npx vite --config vite.demo.config.ts --port <porta> > /tmp/vite-<area>.log 2>&1 &)`, poi Playwright Python (`executable_path='/opt/pw-browsers/chromium'`) su `http://localhost:<porta>/?vista=<id>` (id delle schermate extra; per le altre viste parti dalla home con uno stato salvato in `localStorage['ofa_polimi_app_state']`, vedi `scratchpad/tutte.py` e `scratchpad/nav.py` in `/tmp/claude-0/-home-user-AddiOfa/553cbc19-7099-5f91-95ed-46eecd1a1a4a/scratchpad/` per l'impostazione). NON lanciare `npm run build:demo`. Ferma il tuo server alla fine.
- Metodo: (1) per ogni tua schermata fai uno screenshot di ADESSO (400 px, chiaro e scuro) e affiancalo al concept corrispondente (ritaglio PIL, salva in `docs/lavoro/extra/colore/<area>/confronto-<schermata>.png`); (2) elenca a parole cosa non va (duplicazioni, posizione, gerarchia, colore), (3) correggi, (4) ripeti lo screenshot e rileggilo a occhio; giudica con gli occhi, non solo con le misure. Stato «ricco» (utente con progressi) E stato «vuoto» (utente nuovo).
- Prima di finire: `cd app && npx tsc --noEmit` pulito, `npm test` dalla radice (tutti verdi), screenshot finali 400 px e 1280 px in chiaro e scuro riletti, zero errori in console, nessuno scorrimento orizzontale. Scrivi `docs/lavoro/extra/NOTE-COLORE-<AREA>.md` (cosa hai cambiato, schermata per schermata, con i colori scelti e perché; cosa non hai fatto) e un `NOTE.md` di tre righe dove manca nelle cartelle che tocchi. Non modificare `ui.tsx` né `index.css`: richieste in NOTE.
