# Revisione C: schede principali, simulazione, studio

Revisore esterno. Giudico solo le immagini in `scratchpad/rev/app/{light,dark}-{400,1280}/` (03-scheda-*, 05-sim-*, 06-studio-*), più una lettura veloce dei file indicati per dare riferimenti precisi. Nessun file del progetto è stato modificato.

Limiti di ciò che ho visto, da sapere prima di leggere:

- Le «pagine intere» sono in realtà il solo viewport (400x860 e 1280x800): sotto la piega di Home, Esercizi e Sfide non vedo niente (la sezione «Simulazione» di Home è tagliata, «Ultime sfide» mostra solo l'inizio di uno stato vuoto). Giudico quello che c'è.
- `05-sim-15.png` non è la domanda 15: è ancora la domanda 1 con un'altra risposta (C) e il timer a 14:55. O lo script di prova non ha navigato, o la navigazione non funziona. Non posso dire quale; la navigazione fra domande resta quindi non verificata (sezione 4).
- Chiaro e scuro mostrano domande diverse (estrazione casuale): confronto le interfacce, non i contenuti.
- Lo studio c'è solo in chiaro (`06-studio-*`): il giudizio sul tema scuro dello studio è per deduzione dai token, non dalle immagini.

---

## 1. Verdetto generale e voti

L'app ha un'identità riconoscibile e coerente: palette blu/ambra, icone a tratto, illustrazioni 3D morbide, tessere arrotondate, un'interfaccia calma. Non sembra un template. Il problema è che oggi sembra **un prodotto fatto con cura ma non ancora rifinito da un occhio esterno**: la gerarchia è piatta (quasi tutto è una tessera lavanda con un'icona, di peso uguale), la Home spreca i primi 300 px su un indicatore che non spiega nulla, la scheda Sfide mette in primo piano la funzione meno importante per uno studente solo (Duello con campo nome) e la versione desktop è una colonna da 392 px dentro un riquadro da 766 px dentro uno schermo da 1280: si vede lo scaffale, non il prodotto. La simulazione è la schermata migliore (pulita, leggibile, tocco ampio) ma ha un'area di navigazione quasi inutilizzabile (pallini da 6 px) e un esito che dà un 0/30 senza spiegare niente. Lo studio ha un'idea buona (fiducia Non so / Incerto / Sicuro) presentata nel modo meno comprensibile possibile, e un pannello di feedback pesante e confuso.

Il tema scuro è nel complesso più riuscito del chiaro: il contrasto è buono, le tinte ambra e verde reggono, nessun elemento «rotto». Il chiaro soffre di tessere lavanda su bianco con poco stacco.

Voto 1-10 (chiaro / scuro):

| Schermata o gruppo | Chiaro | Scuro |
|---|---|---|
| Home 400 | 6 | 6,5 |
| Esercizi 400 | 6,5 | 7 |
| Sfide 400 | 5,5 | 6 |
| Schede a 1280 (desktop) | 4 | 4 |
| Simulazione: domanda, selezione, consegna | 7,5 | 7,5 |
| Simulazione: esito | 5,5 | 6 |
| Studio: domanda | 6 | n.d. (non visto) |
| Studio: feedback sbagliato | 4,5 | n.d. |
| Media del gruppo | 5,9 | 6,3 |

---

## 2. Problemi in ordine di gravità

### Bloccanti

**B1. Studio: la scelta della fiducia (Non so / Incerto / Sicuro) è l'unico modo per confermare la risposta, ma non lo dice e sembra disabilitata.**
File: `app/src/components/LearnMode.tsx` righe 563-590 (i tre pulsanti), `06-studio-00.png`.
Cosa non va: dopo aver toccato B (grigio appena più scuro, nessun colore di selezione) in fondo compaiono tre pulsanti grigi con testo grigio e icone da 6 px di «barrette» quasi invisibili. Nessuna domanda («Quanto sei sicuro?»), nessun titolo, e il testo è `text-testo` ma con `disabled:opacity-50`, quindi nello stato di default sembra spento. Uno studente di 18 anni non capisce che deve toccarli per ottenere la correzione: la prima volta resta fermo. Inoltre «Non so» dopo aver scelto una risposta è contraddittorio (se non so, perché ho scelto B?).
Correzione:
1. Sopra i tre pulsanti una riga di 13 px, `font-semibold`, colore `testo-tenue`, testo: **«Quanto sei sicuro di questa risposta?»**, margine sotto 8 px.
2. Pulsanti: altezza 52 px, gap 8 px, ciascuno con sfondo pieno quando la risposta è scelta (bassa: tinta ambra/rossa `basso-tinta`, media: `medio-tinta`, alta: `alto-tinta`), testo in `testo`, **non** opacity 50. Prima della scelta, disabilitati con opacity 40 e la riga sopra che dice «Scegli una risposta».
3. Icone fiducia a 22 px (oggi 20 ma disegnate piccole, si leggono come puntini).
4. Etichette nuove: **«Tirato a caso»**, **«Non del tutto»**, **«Sicuro»**. «Non so» diventa «Tirato a caso»: dice la verità sull'atto (hai risposto lo stesso).

**B2. Simulazione: i pallini di navigazione non sono usabili.**
File: `app/src/components/ExamMode.tsx` righe 487-499, `05-sim-00.png`.
Cosa non va: 30 pallini alti 6 px, larghi 6 px, in un contenitore da 150 px con scroll orizzontale nascosto (`scrollbar-hide`): ne vedo circa 15, gli altri sono fuori e non si capisce che esistono. Area di tocco 6x6 px contro un minimo di 44x44 (WCAG 2.5.5, Apple HIG). Funziona come decorazione, non come navigazione. In più, quando la domanda 20 è selezionata il pallino «attuale» non è nemmeno visibile (fuori scroll).
Correzione: sostituire i pallini con un **indicatore testuale cliccabile** al centro della barra: **«Domanda 12 di 30 ▾»** (altezza 44 px, larghezza 150 px). Al tocco apre un foglio dal basso con la griglia 6x5 di 30 tessere 48x48 px, numerate; stati: risposta data (azione piena, testo bianco), corrente (bordo 2 px azione), non risposta (superficie-2, testo tenue). Questo risolve anche «quante me ne mancano» che oggi è solo nel `0/30` minuscolo. Frecce ‹ › invariate (già 44 px+).

**B3. Desktop: contenuto da 392 px dentro un riquadro da 766 px.**
File: `app/src/App.tsx` riga 269 (`sm:rounded-[28px]`), `app/src/components/Layout.tsx` riga 6 (`max-w-3xl`, `sm:max-h-[800px]`), schede a 1280.
Cosa non va: a 1280 px l'app è una finestra arrotondata alta 750 con il contenuto in una colonna centrale che lascia 188 px vuoti per lato dentro la finestra stessa (doppio contenitore). La barra in basso invece occupa tutti i 766 px: le tre voci sono staccate dalla colonna di contenuto (Home a x=385, il contenuto parte a x=444). Il logo e l'avatar sono incollati alla colonna, il bordo arrotondato è inutile. Risulta «un telefono finto in un monitor» e la parte bassa (Prontuario tagliato dalla barra a 800 px, `03-scheda-esercizi.png`) taglia il contenuto in modo brusco senza dissolvenza.
Correzione (due strade, scegli una):
- A (consigliata, minima): sotto 640 px come oggi; da 640 px in su **togliere il riquadro arrotondato** e usare un'unica colonna di 480 px centrata, barra in basso della stessa larghezza (480 px) e centrata, sfondo pagina `superficie-2` appena più scuro per far risaltare la colonna `superficie`. Altezza: tutto il viewport, niente `max-h-[800px]`.
- B (migliore, più lavoro): da 1024 px in su barra di navigazione **a sinistra** (rail 88 px con le tre icone) e contenuto largo 640 px; Home in due colonne (misuratore + CTA a sinistra, lezioni a destra).

### Forti

**F1. Home: il misuratore «41%» occupa 300 px per dire poco, e «Vicino» è un'etichetta orfana.**
File: `app/src/components/home/Misuratore.tsx`, `home/Stima.tsx` riga 26, `03-scheda-home.png`.
Cosa non va: l'arco e il pallino ambra (decorazione con raggi attorno) mangiano il 35% dello schermo. Il numero 41% è in marrone-ambra su bianco (contrasto circa 4,6:1, al limite) e il sottotitolo «di superare il test» è grigio chiaro da 12 px (circa 3,8:1: sotto 4,5). Subito sotto, una tessera crema con un'icona di barrette e la sola parola **«Vicino»**: senza contesto non si capisce che cosa sia vicino, né a che cosa. Si legge come un'etichetta di stato scollegata (sembra una tag), occupa 64 px di altezza e rompe il collegamento visivo fra misuratore e pulsante «Continua».
Correzione:
1. Misuratore: altezza da 165 a 120 px (arco più piatto, raggi decorativi eliminati, restano 3 tacche a 0/50/100); pallino senza alone.
2. Eliminare la tessera «Vicino» e **fondere** la parola nel misuratore: sotto «Probabilità stimata di superare il test» una pillola di 28 px: **«Ci sei quasi: servono 25/30»**.
3. Sottotitolo a 13 px, colore `testo-tenue` scurito fino a 4,5:1.
4. Il guadagno: circa 100 px verticali, così «Lezioni» sale e la sezione «Simulazione» (oggi tagliata) entra nel primo schermo.

**F2. Home: «Continua» non dice che cosa continua.**
File: `components/home/Cta.tsx`, `03-scheda-home.png`.
Cosa non va: pulsante largo 100% con l'icona play in un cerchio bianco, testo «Continua» e una freccia: tre segnali per una sola azione; nessun oggetto («Continua» cosa? lezione? esercizi?). Con 0/35 ovunque l'utente è al primo avvio: dovrebbe esserci «Inizia».
Correzione: sottotitolo di 13 px dentro il pulsante, bianco 85%: **«Present Simple, lezione 1 di 35»** (se mai avviato: titolo **«Inizia da qui»**, sottotitolo **«Present Simple · 5 minuti»**). Togliere la freccia a destra (il play e il pulsante pieno bastano); altezza 60 px, raggio 16.

**F3. Sfide: la gerarchia è rovesciata.**
File: `app/src/screens/extra/sfide/Sfide.tsx`, `03-scheda-sfide.png`.
Cosa non va: sotto «Sfida del giorno» (giusto, in primo piano) ci sono due tessere di peso quasi uguale: «Duello» con campo nome e «Hai un link?» con campo link e pulsante freccia grigio. Per uno studente solo, e al primo avvio, sono due moduli aperti che chiedono di digitare. Il campo «Il tuo nome» chiede un dato personale in una schermata che non dice a cosa serve. Il pulsante «Sfida» (contorno blu) è visualmente quasi più forte di «Gioca». Il pulsante freccia del link è un quadrato grigio disabilitato che sembra rotto. In basso «Ultime sfide» con una nuvola triste: uno stato vuoto che apre con un'emozione negativa.
Correzione:
1. Unire Duello e Link in **un'unica tessera** «Sfida un amico» con due righe di testo: titolo, sottotitolo **«Crea un link e mandalo a chi vuoi. Vince chi fa più risposte giuste.»** e un solo pulsante secondario **«Crea il link di sfida»**. Il campo nome compare solo dopo il tocco, in un foglio.
2. «Hai un link?» diventa un link testuale sotto la tessera: **«Hai ricevuto un link? Incollalo»** che apre un foglio con il campo.
3. Stato vuoto delle Ultime sfide: sostituire la nuvola triste con l'illustrazione del trofeo piccola (64 px) e il testo **«Ancora nessuna sfida. Fai la prima, bastano 5 minuti.»**
4. Pulsante «Gioca» alto 52 px come i principali; «Sfida del giorno» con il verde pastello va bene.

**F4. Studio: il pannello di feedback «sbagliato» è un blocco rosa pesante e confuso.**
File: `LearnMode.tsx` righe 520-558, `06-studio-01.png`, `06-studio-02.png`.
Cosa non va: sbagliando, un pannello rosa occupa 260 px (30% dello schermo) con: un'icona documento-errore **e** una X rossa (due simboli di errore per lo stesso fatto), la spiegazione in grassetto `font-semibold` **centrata** su 5 righe (il paragrafo centrato e in neretto è la forma meno leggibile possibile), un link «Teoria» sottolineato nero, e il pulsante «Riprova» in blu scuro (`#1d4ed8`, diverso da tutti gli altri pulsanti primari). Il testo spiegazione cita le risposte con virgolette dritte `'...'` dentro un'altra frase. La risposta giusta (C) è già evidenziata sopra, quindi il messaggio della X è ridondante.
Correzione:
1. Togliere l'icona documento-errore; tenere un solo segnale: titolo di 15 px `font-bold` **«Non è questa»** (se giusta: **«Giusto»**) con l'icona X/spunta a sinistra, allineato a sinistra.
2. Spiegazione: `font-normal` (400), 15 px, interlinea 22 px, **allineata a sinistra**, colore `testo`; massimo 3 righe visibili con «Leggi tutto» se più lunga; virgolette tipografiche ‹«more interesting»›.
3. «Teoria»: pulsante secondario piccolo (altezza 40 px, contorno) a sinistra, non sottolineato nero.
4. Fondo pannello: `bg-basso-tinta` ridotto (opacità 60%) con bordo superiore 1 px del rosso; altezza totale non oltre 200 px.
5. Pulsante: stesso `bg-azione` degli altri; testo **«Riprova»** se sbagliata, **«Avanti»** se giusta (già così).
6. Domanda aperta: dopo un secondo errore (come in `06-studio-02`) offrire «Mostra la risposta e vai avanti» altrimenti l'utente resta bloccato in un ciclo.

**F5. Esito simulazione: 0/30 senza spiegazione e un confronto che confonde.**
File: `app/src/components/esito/*`, `05-sim-esito.png`.
Cosa non va:
- Un 0/30 con «1 sbagliata, 29 senza risposta» dopo 10 secondi: la schermata dà giudizio («Non superata») senza dire «hai consegnato con 29 domande vuote».
- Nel gauge compare un trattino scuro isolato a destra (la soglia 25/30?) senza etichetta: sembra un artefatto.
- La riga «25/30 | 0:10 / 15 min» ha icone (righello, orologio) senza etichette: «25/30» non dice «soglia».
- «Prima 26/30 → Ora 0/30 ▼ −26» è un confronto fra due simulazioni, ma l'unica «prima» che l'utente ricorda è inesistente: ridondante e deprimente quando il «prima» è un dato di prova.
- Illustrazione documento con X rossa grande sopra il gauge: sommata al badge «Non superata» e al segno −26 rosso sono tre segnali negativi nei primi 400 px.
Correzione:
1. Togliere l'illustrazione sopra il gauge (guadagno 90 px). Il gauge diventa il protagonista, con **etichetta sulla soglia**: piccolo pennone con **«Soglia 25»**.
2. Sostituire la riga di icone con testo: **«Soglia 25 su 30 · Tempo usato 0:10 su 15:00»**, 13 px.
3. Banner sotto il badge solo se ci sono domande vuote: **«29 domande senza risposta. Le senza risposta contano come errori.»**
4. Il confronto con la volta prima solo dalla seconda simulazione, con testo **«Rispetto alla simulazione precedente: 26 → 0»** e senza il freccino rosso: solo il numero e una riga neutra.
5. Il colore del badge «Non superata»: usare ambra (`medio`) quando il punteggio è ≥ 20 (vicino), rosso solo sotto.

### Medi

**M1. Barra superiore della simulazione: tre elementi di peso quasi uguale.**
File: `ExamMode.tsx` righe 368-393, `05-sim-00.png`.
X, timer in pillola gialla, «Consegna» con contorno: il timer è al centro, grande, in giallo-ambra permanente (la pillola gialla suggerisce «attenzione» fin dal secondo zero). Il testo «Consegna» è a 12 px (`text-xs`), sotto la soglia di leggibilità comoda, con tocco di circa 34 px di altezza. Correzione: timer neutro (`superficie-2`, testo `testo`) fino a 2:00, poi ambra, e sotto 1:00 rosso (già previsto per 120 s: portarlo a ambra a 5:00 e rosso a 1:00); «Consegna» a 13 px, altezza 40 px; X 44x44.

**M2. Barra di avanzamento della simulazione: `0/30` a 11 px e una barra da 12 px che parte da zero.**
`0/30` sta a sinistra, tenue e minuscolo; dopo una risposta la barra mostra solo un puntino azzurro all'inizio (`05-sim-01.png`). Non dice «risposte date» ma sembra «domanda corrente». Correzione: etichetta **«1 risposta su 30»** a 12 px, spostata a destra della barra; barra alta 6 px (non 12) per ridurre il peso.

**M3. Selezione risposta nello studio e nella simulazione: due stati diversi per la stessa azione.**
Simulazione: scelta = tessera azzurra con bordo blu e cerchio blu pieno (chiara). Studio (`06-studio-00`): scelta = tessera appena più grigia, senza bordo né cerchio colorato. Stesso gesto, due grammatiche. Correzione: usare in entrambi lo stato della simulazione (`azione-tinta`, bordo 1,5 px `azione`, cerchio pieno).

**M4. Timer dello studio: un numero «30» in una pillola senza unità.**
`06-studio-00.png`: in alto a destra «30» con orologio, poi 29. Non dice secondi né che scade. Correzione: **«30 s»**, e una sottile barra di consumo sotto la barra di avanzamento invece di una pillola gialla fissa. Se scade senza risposta, dire cosa succede (oggi invisibile).

**M5. Esercizi: «Intelligente» è un nome poco chiaro e la tessera grande è metà vuota.**
File: `screens/Esercizi.tsx` righe 83-100, `03-scheda-esercizi.png`.
L'illustrazione A/B/C occupa 130 px, a bassissimo contrasto (tinte lavanda su lavanda) e il pulsante riempie l'intera larghezza con la sola parola «Intelligente». Non dice cosa fa. Nel chiaro l'illustrazione quasi sparisce nel fondo `superficie-2`. Correzione: titolo sopra il pulsante **«Allenamento consigliato»**, sottotitolo **«10 domande scelte sui tuoi punti deboli»**, pulsante **«Inizia»**; illustrazione ridotta a 96 px e spostata a destra del titolo (layout orizzontale: testo a sinistra, illustrazione a destra), altezza tessera da 218 a circa 150 px.

**M6. Esercizi: quattro modalità identiche senza sottotitolo.**
«Punti deboli, Blitz, Richiamo, Argomento»: quattro tessere uguali, ciascuna con icona colorata e una parola. «Richiamo» e «Blitz» non si capiscono da soli a 18 anni. Correzione: sottotitolo di 12 px in ogni tessera (vedi sezione 3). L'altezza sale a 124 px, accettabile; la distribuzione verticale oggi lascia 70 px vuoti in basso, li assorbe.

**M7. Frasi e Prontuario: due illustrazioni di scala e stile diversi.**
`03-scheda-esercizi.png`: il libro con bandiera e la lampadina escono dal bordo sinistro della riga a larghezze diverse (circa 40 e 44 px), allineamento verticale di testo diverso da quello delle tessere sopra. A 1280 la lampadina si vede come un sole tagliato. Correzione: miniatura sempre in un quadrato 48x48 con raggio 12 e sfondo tinta, come nelle righe delle Lezioni della Home.

**M8. Home: il titolo «Simulazione» arriva sotto la piega e le tre lezioni sono tutte «0/35, 0/19, 0/29».**
`03-scheda-home.png`: tre barre di progresso vuote ripetute, A1/A1/A1: informazione ripetitiva e senza gerarchia. Correzione: la prima lezione in versione grande (con «Continua» incorporato), le altre due più compatte (senza barra se a 0, con la sola durata «12 min»).

**M9. Barra di navigazione: voce attiva con solo colore e peso.**
Home/Esercizi/Sfide: l'attiva è blu con icona piena, ma le inattive sono grigio-blu a 12 px con contrasto di circa 4:1. In scuro il grigio-blu delle inattive è ancora più basso. Correzione: etichette a 12 px `font-semibold` colore `testo-tenue` a 4,6:1 minimo; sopra la voce attiva una «pillola» di 56x32 px dietro l'icona (tinta azione 12%), come negli indicatori Material 3.

### Rifiniture

- **R1.** Home, intestazione: il logo AddiOFA è alto 32 px e l'avatar 36 px: non allineati sulla linea di base visiva; portare entrambi a 36 px o allineare i centri.
- **R2.** Sfide: icona «i» accanto all'avatar senza etichetta e con area di tocco piccola; spostarla dentro la pagina («Come funzionano le sfide») o darle 44x44.
- **R3.** Sfide: le tre schede «Oggi / Amici / Classifica» sono tagliate a destra a 400 px (la parola «Classifica» arriva al bordo, 12 px di margine); stringere le icone a 18 px o togliere le icone.
- **R4.** Sfide: statistica «10» e «5 min» con icone in cerchi bianchi: cerchi da 32 px che sembrano pulsanti. Meglio testo semplice: **«10 domande · 5 minuti»**.
- **R5.** Consegna (dialogo): illustrazione da 80 px nel foglio, pulsanti «Continua» e «Consegna» di peso uguale a larghezza uguale; «Consegna» è l'azione irreversibile e dovrebbe avere stesso peso ma il testo «Continua» è ambiguo (continuare cosa?). Nuovo: **«Torna alle domande»** e **«Consegna»**.
- **R6.** Dialogo di consegna, testo: «Dopo la consegna non si torna indietro» a 14 px grigio: accettabile ma più forte in `testo` normale. Il numero «29» in grassetto.
- **R7.** Etichetta categoria «Grammatica» nella domanda: una pillola viola con icona bersaglio; in una sola categoria (Grammatica) non aggiunge nulla. Nasconderla in simulazione (a esame vero non c'è) o mostrarla solo nello studio.
- **R8.** Il numero «1» nel cerchio accanto alla categoria ripete «1/30» di sopra e la domanda sotto; in simulazione tenere solo uno dei due.
- **R9.** Frase con trattino basso `_____`: va bene, ma portare lo spazio vuoto ad una linea più spessa (2 px) con 4 caratteri di larghezza fissa così non cambia l'impaginazione.
- **R10.** Scuro: il bordo del riquadro desktop (`border-linea`) è quasi invisibile contro lo sfondo (`#0b1020` contro `#111a30`); aumentare di un gradino.
- **R11.** Chiaro: tessere `superficie-2` (lavanda molto pallido) su `superficie` bianco: stacco di circa 1,05:1. Aggiungere un bordo 1 px `linea` oppure scurire `superficie-2` del 3%.
- **R12.** Pulsante freccia del link in Sfide: disabilitato ma con lo stesso stile della tessera: sembra un riquadro vuoto; nasconderlo finché il campo è vuoto.

---

## 3. Revisione dei testi

| Dove | Ora | Problema | Nuovo |
|---|---|---|---|
| Home, misuratore | «Probabilità stimata di superare il test» | Lungo, a due righe, il «stimata» sposta l'accento sul numero senza dire da cosa deriva | **«Probabilità di superare il test»** + piccolo «i» che apre «Come la calcoliamo» |
| Home, tessera | «Vicino» | Parola sola, senza oggetto | **«Ci sei quasi»** dentro la pillola sul misuratore; tessera eliminata |
| Home, CTA | «Continua» | Non dice cosa | **«Continua: Present Simple»** / primo avvio **«Inizia da qui»** |
| Home, sezioni | «Lezioni» / «Simulazione» / «Tutte» | Va bene; «Tutte» due volte | «Lezioni», «Simulazione», link **«Vedi tutte»** |
| Esercizi, titolo grande | «Intelligente» | Gergo, non dice la funzione | **«Allenamento consigliato»**, pulsante **«Inizia»** |
| Esercizi, tessere | «Punti deboli» | Ok | **«Punti deboli»** sottotitolo *«Le domande che sbagli»* |
| | «Blitz» | Gergo | **«Blitz»** sottotitolo *«10 domande, 30 secondi l'una»* |
| | «Richiamo» | Poco chiaro | **«Ripasso»** sottotitolo *«Le domande da rivedere oggi»* |
| | «Argomento» | Ok ma generico | **«Per argomento»** sottotitolo *«Scegli tu cosa studiare»* |
| Esercizi, righe | «Frasi» / «Prontuario» | Prontuario è parola da ufficio; Frasi non dice cosa | **«Frasi utili»** sottotitolo *«Strutture da imparare a memoria»*; **«Riepilogo di grammatica»** sottotitolo *«Una pagina per ogni regola»* |
| Sfide, tessera | «Duello» | Ok come gioco ma serve contesto | **«Sfida un amico»** + sottotitolo *«Crei un link, lo mandi, vince chi risponde meglio.»* |
| | «Il tuo nome» (segnaposto) | Chiede dato personale senza dire perché | **«Come ti chiami? (lo vede solo chi sfidi)»** |
| | «Sfida» | Ok | **«Crea il link»** |
| | «Hai un link?» / «Incolla il link» | Ok | **«Hai ricevuto una sfida?»** / *«Incolla qui il link»* |
| Sfide, statistiche | icone + «10» + «5 min» | Nessuna etichetta | **«10 domande · 5 minuti»** |
| Sfide, vuoto | (nuvola triste, testo non visibile) | Emozione negativa | **«Ancora nessuna sfida. Fai la prima: bastano 5 minuti.»** |
| Simulazione, pulsante | «Consegna» | Ok | **«Consegna»** |
| Simulazione, dialogo | «Consegnare adesso?» | Ok | **«Vuoi consegnare ora?»** |
| | «Hai ancora 29 domande senza risposta. Dopo la consegna non si torna indietro.» | Ok, ma «ancora» addolcisce | **«Mancano 29 risposte. Una volta consegnato non puoi più cambiare niente.»** |
| | «Continua» (pulsante annulla) | Ambiguo | **«Torna alle domande»** |
| Simulazione, uscita | «Uscire dalla simulazione?» | Non dice cosa si perde | **«Uscire? Le risposte date andranno perse.»** |
| Esito | «Non superata» | Secca; uguale per 0 e per 24 | **«Sotto la soglia»** con ambra se 20-24; **«Superata»** ≥ 25 |
| Esito | «Esito» (titolo) | Ok | **«Risultato»** |
| Esito | «Aree» | Troppo breve | **«Come sei andato per argomento»** |
| Esito | «Correzioni» / «Rifai» | «Correzioni» ok; «Rifai» ambiguo | **«Vedi le correzioni»** / **«Rifai la simulazione»** |
| Esito, confronto | «Prima / Ora» | Non dice cosa | **«Simulazione precedente»** / **«Questa»** |
| Studio, fiducia | «Non so / Incerto / Sicuro» | Vedi B1 | **«Tirato a caso / Non del tutto / Sicuro»**, domanda **«Quanto sei sicuro?»** |
| Studio, feedback | (spiegazione in neretto centrata) + «Teoria» | Vedi F4 | Titolo **«Non è questa»**, spiegazione normale, pulsante **«Rivedi la teoria»** |
| Studio, spiegazione | `'-er' si usa solo con aggettivi brevi, 'most interesting' è un superlativo` | Virgolette dritte, frase lunga e unica | *Gli aggettivi lunghi come «interesting» formano il comparativo con «more»: «more interesting than». Il «-er» va solo con aggettivi brevi. «Most interesting» è un superlativo e «very interesting» non regge «than».* |
| Studio, errore di rete | «Non riesco a controllare la risposta. Riprova.» | Ok | Tenere |

---

## 4. Simulazione e studio come esperienza

**Leggibilità della domanda.** La domanda è a 20 px in grassetto, interlinea stretta, colore pieno, allineata a sinistra: la forma giusta, si legge bene a 400 px (`05-sim-00`). Una frase di due righe in 20 px bold regge; se la frase ha tre righe, la domanda spinge la prima risposta sotto i 280 px (nessun problema qui). Manca la **frase-istruzione** per chi non ha mai visto il test: una riga tenue **«Scegli la parola giusta per completare la frase»** sopra la domanda, solo alla prima domanda della sessione. La categoria «Grammatica» con il numero «1» nel cerchio aggiunge rumore (R7, R8). Il trattino `_____` è corretto.

**Area di tocco.** Risposte: tessere da 56-58 px di altezza, larghezza piena: ottime. Frecce ‹ ›: 44 px circa: ok. X, «Consegna»: sotto i 44 px (X circa 34 px, Consegna circa 34 px di altezza). Pallini: 6 px: inaccettabile (B2). In studio i tre pulsanti di fiducia sono 52 px: ok ma muti (B1).

**Feedback giusto/sbagliato (studio).** La parte migliore: nelle tessere, rosso con X e verde con spunta, le altre risposte sbiadiscono. Chiaro a colpo d'occhio e non solo per colore (icona + tinta): bene per il daltonismo. Il guaio è il pannello sotto (F4): pesa più di tutto il resto, ripete l'errore con una seconda icona, la spiegazione è in neretto centrato e il pulsante «Riprova» è blu scuro diverso dagli altri. Quando si risponde giusto non ho il frame (non c'è nelle immagini), da controllare che usi lo stesso schema con verde e «Avanti». Un punto positivo vero: la spiegazione appare subito e in italiano, con rinvio alla teoria.

**Timer.** Simulazione: una pillola gialla con «15:00», cifre tabulari (non salta), «role=timer» presente: bene. Ma è gialla da subito, quindi la soglia di allarme perde senso (M1). Non c'è un avviso a 5:00 o 1:00 verificabile nelle immagini. Studio: «30» senza unità (M4).

**Navigazione fra domande.** Frecce piccole a sinistra e a destra, la sinistra grigia a prima domanda (bene). Selezionare una risposta non avanza automaticamente (corretto per una simulazione: l'utente deve poter cambiare idea), ma allora serve un modo rapido per tornare indietro e saltare: i pallini non lo danno (B2). Ripeto: `05-sim-15` mostra ancora la domanda 1; se la navigazione reale non avanza, è un bug da risolvere prima di tutto il resto, ma non posso affermarlo dalle immagini.

**Consegna.** Il foglio dal basso con scuro dietro è ben fatto, illustrazione piccola, testo chiaro, due pulsanti larghi. Miglioramenti nelle rifiniture (R5, R6).

**Esito.** Struttura giusta (punteggio, tre contatori, confronto, azioni, aree) ma la prima impressione è confusa (F5): il gauge a 0 con il trattino orfano, tre segnali negativi in sequenza, confronto con un «26» che l'utente non conosce. Le tre tessere giuste/sbagliate/vuote (0, 1, 29) sono ottime: icona, numero grande, nessuna frase. Le azioni «Correzioni» (primario) e «Rifai» (secondario) hanno la gerarchia giusta.

---

## 5. Differenze chiaro e scuro

- **Il scuro è più riuscito.** Le tessere `#16213b` su `#0f172e` hanno più stacco (circa 1,15:1) delle lavanda su bianco del chiaro (circa 1,05:1): in scuro le card si leggono come card, in chiaro come aloni.
- **Pulsanti primari.** In scuro il blu diventa un azzurro chiaro con testo scuro: ottimo contrasto, ma cambia il carattere (da «deciso» a «pastello»). Il testo scuro su azzurro è giusto; non aggiungere altro.
- **Misuratore.** In scuro l'ambra su fondo scuro è molto più leggibile (41% brillante); in chiaro il numero marrone-ambra è al limite del contrasto. Scurire l'ambra del chiaro del 10-15%.
- **Tessera «Vicino».** In scuro diventa marrone cupo con bordo ambra: sembra un avviso di errore, più che una nota neutra. In chiaro è crema. Il messaggio cambia fra i due temi: in scuro più allarmante.
- **Sfida del giorno.** Verde cupo (`#04301f`) con bordo: bello ma il verde profondo è molto saturo accanto al blu pastello dei pulsanti. In chiaro è un verde-menta pulito. In scuro ridurre la saturazione del 20%.
- **Illustrazioni.** Le scene (nuvola, fogli A/B/C, trofeo) sono tre «versioni scuro» fatte ricolorando: reggono, ma il foglio A/B/C in scuro diventa grigio-blu con i badge colorati vivaci: più leggibile che in chiaro, dove le righe sono lavanda su lavanda.
- **Cerchietti delle icone.** In scuro sfondi pieni e scuri (marrone, viola, verde) che danno un bell'effetto di profondità; in chiaro pastelli quasi invisibili (R11).
- **Simulazione.** Tema scuro e chiaro quasi equivalenti; unica nota: in scuro la lettera nel cerchio non selezionato (A, B, C, D) è `testo-tenue` su fondo scuro, circa 3,8:1, sotto i 4,5.
- **Desktop scuro.** Riquadro quasi invisibile (R10) ma proprio per questo è meno brutto del chiaro, dove il bordo grigio sul bianco disegna chiaramente un «telefono finto».

---

## 6. Cosa funziona e va tenuto

1. **Identità visiva coerente**: logo, palette blu/ambra/verde/viola, icone a tratto uniformi, illustrazioni morbide. Non sembra un tema scaricato.
2. **La simulazione in sé**: domanda grande, quattro tessere larghe da 56 px con cerchio lettera, stato selezionato netto (azzurro + bordo + cerchio pieno), timer sempre visibile, barra di avanzamento. È la schermata più professionale.
3. **Tre voci nella barra in basso**: una scelta coraggiosa e giusta. Home / Esercizi / Sfide è chiaro, nessun menu nascosto.
4. **Esito con tre contatori a icona** (giuste / sbagliate / vuote) e numeri grandi: informazione densa senza frasi.
5. **Feedback nelle tessere della risposta** (X rossa, spunta verde, altre sbiadite) accessibile anche senza colore.
6. **Dialogo di consegna** pulito, in basso, con conseguenza detta chiaramente.
7. **Cifre tabulari** nel timer e nei contatori: niente salti.
8. **Sfida del giorno** come prima cosa nelle Sfide, con pulsante pieno e trofeo: l'idea è giusta (è il gancio quotidiano).
9. **Tema scuro** curato e non una semplice inversione.
10. **Testi in italiano diretto e senza gergo da marketing** nelle schermate principali; la spiegazione dopo l'errore è rispettosa e utile.
11. **Interfaccia statica**: nessuna animazione decorativa, in linea con il tono sobrio di un prodotto per studiare.

---

## 7. Le 5 modifiche che alzano di più la qualità percepita

1. **Ridisegnare la parte alta della Home** (F1, F2): misuratore più basso (120 px), fusione di «Vicino» in una pillola «Ci sei quasi: servono 25/30», CTA con oggetto («Continua: Present Simple»). Risultato: la prima schermata mostra anche la simulazione, ha una sola cosa da fare e sembra un prodotto, non un cruscotto.
2. **Risolvere il desktop** (B3): colonna unica di 480 px senza riquadro finto, barra in basso della stessa larghezza (o rail a sinistra sopra 1024 px). Oggi è la cosa che grida «fatto da un generatore» a chiunque apra il sito dal computer.
3. **Rifare il feedback dello studio** (B1, F4): domanda «Quanto sei sicuro?» sopra pulsanti attivi e chiari, pannello di spiegazione allineato a sinistra con un solo segnale, testo normale non in neretto centrato, pulsante nel colore primario. È il cuore del prodotto e oggi è la schermata più debole.
4. **Sostituire i pallini della simulazione con «Domanda N di 30 ▾» e la griglia a tessere da 48 px** (B2): da navigazione decorativa a strumento vero, e finalmente si vede quante mancano.
5. **Rendere l'esito leggibile e meno punitivo** (F5): togliere l'illustrazione con la X, etichettare la soglia sul gauge, dire «29 senza risposta contano come errori» e tenere il confronto con la volta prima solo quando esiste. In più, riorganizzare Sfide (F3) con una sola tessera «Sfida un amico»: due schermate che oggi sembrano moduli diventano azioni.
