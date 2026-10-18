# Note: rifacimento della landing da revisione (agente LANDING, 18/10)

Perimetro: `app/src/screens/Landing.tsx` e `app/src/screens/landing/**`. Nessun altro file toccato (nessuna immagine nuova, niente in `index.css`, `ui.tsx`, `Layout`, `Footer`, `Scena`).

## Cosa è cambiato
- **Barra**: trasparente solo in cima; dopo 8 px di scorrimento fondo al 96 % + sfocatura + filetto, quindi il testo non passa più sotto logo e menu (verificato a 400 e 1280, chiaro e scuro). Sta nella stessa colonna dei contenuti (logo e pulsante allineati a 72 px a 1280). Pillola del menu opaca. Voci: Cos'è l'OFA, Come funziona, Il test, Domande (tolta «Home»). Sul telefono il pulsante compare solo quando quello dell'hero è uscito (dopo 400 px).
- **Hero** in un'unica composizione. Telefono: scena a grandezza vera dietro la barra, titolo che si appoggia sui gradini sfumati, pulsante a ~556 px (sopra la piega di 667). Desktop: testo a sinistra, scena al centro, due telefoni a destra con schermate d'esempio (domanda del test, simulazione) con «Esempio» a 11 px; tolta la carta «72 %», la carta con la bandiera e la «i». Maschera su tutti i lati: niente bordo rettangolare nel tema scuro.
- **Testi** (da A): titolo «Scopri a che punto sei con l'OFA di inglese.», sotto «In 3 minuti. Poi ripassi solo ciò che sbagli e provi il test vero: 30 domande, 15 minuti.», pulsante unico «Inizia il test di livello» (stesso nome in barra, hero, passi, carta blu, chiusura), «Preferisci esplorare? Vai all'app senza test» al posto di «Salta». «Diagnostico» sparisce da tutta la landing. Apostrofi tipografici ovunque nei testi della landing.
- **Sistema**: una sola etichetta di sezione (12 px, maiuscolo, blu, senza pillola né numero), una sola scala dei titoli (32 px telefono / 44 desktop), tre pulsanti (pieno senza cerchio-freccia, contorno 1,5 px, link), ritmo verticale 80 px (telefono) / 112 px (desktop) tra sezioni, testo minimo 13 px fuori dalle mini-schermate (11-12 px lì).
- **Tagliato**: sezione «Tutto ciò che ti serve» (le 4 schede ripetevano striscia e passi) e il testo emotivo «Il tuo futuro non si ferma a un esame»; tolta la fascia/nastro rosso e le inclinazioni; tolti i cerchi-freccia muti. Altezza pagina: 1280 px da 5555 a 3534 (-36 %); 400 px da ≥ 6000 (la vecchia cattura era troncata) a 5200.
- **Striscia dei vantaggi**: 4 voci all'imperativo, icone di un solo tono, numeri veri (10 domande, 30/15, 613).
- **Cos'è l'OFA**: titolo e testo in alto, cinque carte (quattro conseguenze + carta blu «Con AddiOFA arrivi al test preparato», senza promessa di esito) in una riga da 1024 px, 2x2 sul telefono; schede senza vuoti, testo 13 px+. Cifre da `config/offer.ts`; la carta «scadenze» ora dice «tra fine agosto e fine settembre» (è in `OFA_CONSEQUENCES`) al posto di «fine estate».
- **Come funziona**: i 4 passi sempre leggibili in un elenco con filo; il telefono grande (280 px, inclinato 3-4° su lastra blu) mostra la schermata del passo toccato (cambio immediato). Passo 4 ora «Arriva pronto» (era un esito, non un'azione) con esito d'esempio dichiarato tale.
- **Il test in cifre + fiducia** (`Perche.tsx`): anello a sinistra con traccia al 20 % del testo (leggibile nel tema scuro); riquadro «Un progetto studentesco, indipendente dal Politecnico» con tre fatti veri e il link «Come usiamo i tuoi dati» (apre la privacy). Al posto del banner emotivo, come da A.
- **Immagini scure**: banner dell'edificio e sfondo della chiusura sono rigradati in blu notte dal CSS (`.landing-notte`: luminosità/saturazione + livello colore), non più velo grigio. Cucitura della chiusura sul telefono eliminata (immagine sotto il testo, sfuma verso l'alto nel blu); piè di pagina con filetto e 13 px, marchio a sinistra e documenti a destra da 1024 px (`PiePagina.tsx`, il `Footer` comune non è stato toccato).
- **FAQ**: titolo «Domande frequenti» senza pillola, domande riscritte (A), colonna sticky a 88 px, risposta 1 accorciata.

## Rapporti NON applicati (e perché)
- **«Senza registrazione» (A)**: falso. Il funnel chiede nome/email PoliMi al primo avvio. Uso «senza password» e «con i progressi sul tuo dispositivo» (frase, non etichetta «Gratis»).
- **Eliminare il blocco con l'edificio (A F6)**: la SINTESI chiede di rigradarlo; l'ho tenuto ma con un testo di fatti veri al posto dello slogan.
- **Titolo «Oltre l'OFA, un passo in più» (G2)**: sostituito dalla promessa unica di A; lo slogan non compare più (tre slogan ridotti a zero).
- **Pillole attorno ai telefoni (G2, max 3)**, **motto a mano in SVG (G2 2.7)**, **trittico con volti (G2 2.5)**, **logo a due toni (G2 2.8)**: non fatti. Il motto richiede tracciati disegnati; il trittico richiede illustrazioni nuove; il logo è decisione di brand.
- **Hero a piena larghezza 21:9 e immagine 4:5 dedicata (G2 2.1)**: servirebbero asset nuovi; uso la scena esistente (976 x 490) ritagliata dal CSS a grandezza vera sul telefono. Sul desktop la scena resta una fascia al centro, non a tutto schermo.
- **Fondo con gradiente `#0B1740 → #070D24` e accento più saturo in scuro (G2 2.9)**: richiedono token in `index.css` (vedi richieste); in scuro l'immagine dell'hero è già a piena forza (nessun velo).
- **Icone dei vantaggi nel colore accento al 18-22 %** in scuro: uso `azione-tinta`/`azione-testo` (token esistenti), che dà lo stesso effetto.
- **«Fai il test di livello» (G2) / «Test di livello» in barra**: preferito «Inizia il test di livello» (A) ovunque; in barra sul telefono, per spazio, la scritta è «Inizia il test» (l'etichetta accessibile è quella intera).
- Pulsante «Leggi cosa succede se non lo superi»: accorciato in «Se non lo superi» (la regola delle 5 parole), apre lo stesso foglio.

## Richieste per file non miei
- `index.css`: nessuna obbligatoria. Opzionali: token per il fondo scuro a gradiente (G2 2.9) e un'ombra neutra per le carte (G2 5.16).
- `screens/Footer.tsx`: il testo dell'avvertenza è a 11 px (A R6); la landing usa un suo piè di pagina a 13 px, ma le altre schermate col `Footer` comune restano a 11 px.
- `brand/hero/Scena.tsx` ormai non è più usata dalla landing (resta nel repository); la carta «72 %» e la bandiera lì dentro non compaiono più in pagina. Se nessun altro la usa si può togliere.
- Chi chiama «Fai il diagnostico» per cliccare (script di cattura in scratchpad, prove e2e esterne) deve passare a «Inizia il test di livello».
- `tsc` a fine lavoro segnalava errori non miei: `components/CheatSheet.tsx` (nome `Arte`) e `screens/extra/profilo/Progressi.tsx` (`SelettoreIcone`), file di altri agenti.

## Controlli e numeri
- `npx tsc --noEmit`: nessun errore nei miei file (2 errori in file di altri agenti, sopra). `npm test` dalla radice: 290 test, 286 verdi, 0 falliti, 4 saltati. `vite build` (in cartella di prova): ok.
- `controlla-testo` (stessa funzione dello script, aperta su `/?landing`, 400 px, chiaro e scuro, e 1280): 0 blocchi sopra 5 parole (le righe di marketing e le domande della FAQ sono in `data-testo-ok`).
- Testo sotto 13 px: solo dentro le mini-schermate dei telefoni (11-12 px, aria-hidden, dichiarate «Esempio»).
- `controlla-contrasto` sulla landing (anteprima, 400 px e 1280, chiaro e scuro): 0 violazioni a 400 px; a 1280 chiaro due voci sulla prima carta (3,4:1 e 2,2:1) misurate durante la comparsa scorrendo (opacità a metà della transizione, ricomposta nello sfondo): non sono colori veri. Non riprovato con riduzione del movimento attiva.
- Schermate lette a occhio, pagina intera con viewport alto: 400 x 5200 e 1280 x 3534, chiaro e scuro; viste anche a 320, 360, 768, 1024 e con la barra dopo lo scorrimento e il menu aperto. Nessuno scorrimento orizzontale (scrollWidth = clientWidth in tutte le larghezze), 0 errori in console, clic su «Inizia il test di livello» porta all'onboarding.
- Nessun esadecimale nei file della landing (solo token e `var(--landing-*)`); nessuna parola vietata (cercate: Pass, Sblocca, Gratis, Prova come etichetta, beta, dimostrativo, esperimento, presto, in arrivo).

## Non provato
- Tastiera/lettore di schermo solo a lettura del codice (focus visibile e etichette presenti), non con un lettore.
- Browser diversi da Chromium; Safari iOS (backdrop-filter, `mask-image` composito) non provato.
- Tema scuro delle immagini giudicato solo a occhio (banner e chiusura); il filtro CSS «color» sul banner appiattisce un po' i colori dell'edificio.
- 1024-1100 px: il testo dell'hero arriva vicino alla scena (la scena sfuma sotto il testo, leggibile ma stretta).
- Il pulsante «Inizia il test» in barra sul telefono compare dopo 400 px di scorrimento: soglia fissa, non legata al pulsante dell'hero.
