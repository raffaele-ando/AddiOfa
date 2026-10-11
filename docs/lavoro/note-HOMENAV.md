# Note HOMENAV: home come il concept 14, barra a tre voci, Lezioni e Impostazioni

## File
- Home: `app/src/components/Menu.tsx` (ridotta al concept: marchio testuale `AddiOFA` + una icona profilo, misuratore, banner, pulsante, prossimo obiettivo, grafico, barra), `components/home/{Misuratore,Stima,Cta,Lezione,GraficoStime}.tsx` riscritti; `Fattori.tsx` e `comune.tsx` portati ai token. `Serie`, `Obiettivo`, `Strumenti`, `Indicatore` non più usati dalla home (non cancellati).
- Barra: `components/Navigazione.tsx` (Home, Simulazioni, Lezioni; icone del concept). In `App.tsx`: viste `lezioni` e `impostazioni`; Simulazioni = vista `exam`; teoria, esercizi e progressi mostrano la barra con "Lezioni" attiva; tutte le pagine aperte da home/Lezioni/Impostazioni tornano indietro con la pila (`apri` / `indietro`).
- Nuove pagine: `screens/Lezioni.tsx`, `screens/Impostazioni.tsx` (tema Sistema/Chiaro/Scuro, suoni, Pass, dati, account, informazioni e legale, versione).
- Token in `index.css` (`@theme static` + override `.dark`): fondo, superficie, superficie-2, testo, testo-tenue, linea, tacca, azione*, marchio, e per le fasce basso/medio/alto: colore, chiaro, testo, numero, tinta. Variante `corto` (altezza < 820 px). `hooks/useTheme.ts`: `modo` sistema/chiaro/scuro (sistema = nessun valore salvato).
- Anteprima: `tests/anteprime/home.tsx` con `vista=home|lezioni|impostazioni|misuratore`, `stato`, `punti`, `pass`, `tema`.

## Scelte
- Misure copiate dall'SVG del concept (arco r 141, spessore 25,7, tacche, pallino, alone, banner 80 px, pulsante 60 px, scheda 77 px, barra). Tutto fermo, nessuna animazione.
- Probabilità e non rischio: bassa = corallo, media = ambra, alta = verde. Etichetta "Probabilità stimata di superare / il test OFA di inglese". Senza stima: arco grigio, "Scopri a che punto sei", banner e pulsante "Fai il diagnostico gratuito", riga "Qui vedrai come cambia la tua probabilità".
- Il grafico mostra solo punti misurati (2-5), colore secondo la fascia di ogni punto; un punto solo: invito a fare una simulazione. Gli (i) del misuratore e del grafico aprono `FoglioStima`.
- Spazio: a 390x858 la home sta in una schermata; sotto 820 px di altezza la variante `corto` restringe i vuoti e il misuratore (con la banda demo a 800 px sta ancora).
- Tema scuro: banner con ring sottile del colore di fascia su tinta slate (niente marroni); CTA con testo navy (contrasto >= 4,5:1).

## Provato
`tsc`, `npm test` 99/99, `npm run check`, `build:demo`. Chromium: home (nuovo, basso, medio, alto, 1-5 punti, con/senza Pass), Lezioni, Impostazioni a 390x858, 360x640, 1280x800, chiaro e scuro: overflow 0, nessun elemento fuori, zero errori in console. Clic verificati nei registri. Flusso demo `static3`/`e2e3` (copie di static2/e2e2 adattate alla barra) a 400x800 chiaro/scuro e 1280: zero errori, overflow 0; l'unico movimento è il timer della simulazione.
Non provato: telefono vero, login/Project ID acceso, Pass vero (non demo).

## Differenze dal concept / dubbi
- Il pallino segue il valore vero (nel concept 82 % è a circa 74 %). Logo in Inter 800 ("AddiOFA", FA maiuscolo, più largo di "AddiOfa").
- La riga "tra X e Y su 30" e "calcolata su N risposte" non sono più sulla home: restano nel `FoglioStima`.
- Titolo scheda lungo: va su due righe (la scheda cresce di 20 px). Barra di avanzamento più corta del concept per via di "n/m domande imparate".
- Layout desktop (sm+, cornice 800 px con padding) taglia la barra in basso a 1280x800: è `Layout.tsx`, non toccato.
- ExamMode non mostra la barra (schermata intera); la versione dell'app in Impostazioni è una costante uguale a package.json.
