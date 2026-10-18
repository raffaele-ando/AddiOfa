# G2 - Concept contro landing implementata

Revisione esterna, schermata per schermata. Valutati: 4 concept (`grafica/brand/concept/12-landing-mobile`, `41-landing-desktop`, `45-landing-desktop-b`, `51-landing-desktop-c`) contro la landing costruita (telefono 400 px e desktop 1280 px, tema chiaro e scuro, 8 + 6 schermate per tema).

Metodo e limiti. Ho guardato tutte le immagini per intero. Le schermate dell'implementazione sono finestre di viewport, non pagine intere: alcuni vuoti verticali potrebbero essere schede «a rivelazione» non ancora comparse al momento dello scatto (lo segnalo dove il dubbio c'è). Non ho potuto verificare interazioni, hover, caricamento, né i colori esatti: le tinte sono stimate a occhio. I riquadri verdi/viola sui concept 45 e 51 sono sovrapposizioni dell'estrazione automatica, non disegno. I concept sono poster statici: non hanno FAQ, stati, contrasto verificato, né un tema chiaro e scuro per ciascuno.

---

## 1. Verdetto

**Sintesi per il cliente.** L'affermazione «decisamente meglio» è vera per una cosa precisa: **la prima schermata (hero) e il primo impatto emotivo**. È falsa per tutto il resto: leggibilità, onestà del contenuto, struttura informativa, tema scuro coerente, stati, FAQ e dati veri sono meglio nella landing costruita. La landing attuale è un buon prodotto con un hero più povero del dovuto e un ritmo verticale allentato; i concept sono ottimi hero attaccati a una pagina generica da SaaS.

### Per concept

| Concept | Rispetto alla landing implementata | Perché |
|---|---|---|
| **12 - mobile** | **Migliore nell'hero, pari nel resto, peggiore nella sostanza** | Hero: l'immagine è a tutta larghezza e *sotto* il testo, il titolo a 3 righe si appoggia sulla scena, il personaggio che sale verso la stella è grande (circa 110 px di altezza equivalente a 400 px di larghezza, contro i circa 75 px della landing) e c'è una vera storia in un colpo d'occhio. La landing mette invece l'immagine come fascia ritagliata sopra e il titolo sotto: sono due blocchi, non una composizione. «Come funziona» del concept (elenco 1-4 con filo verticale + telefono inclinato su forma blu) è più leggibile della fila di 4 cerchi della landing, di cui si vede una sola didascalia. Il resto (quattro tessere, 82%, banner, CTA con store) è generico; due blocchi contengono dati finti. |
| **41 - desktop** | **Migliore nell'atmosfera, peggiore nella leggibilità; la landing ne è una versione ridotta** | La scena (scala bianca, portale blu con stella luminosa, schede di vetro fluttuanti) è la stessa che la landing usa nel hero, ma nel concept riempie tutta la larghezza, ha profondità e aria; nella landing è un ritaglio nella metà destra con il bordo sinistro sfumato in modo sporco. La seconda sezione (quattro schede di vetro che salgono a gradini su un nastro rosso fino alla scheda blu) è la cosa migliore dell'intero set e la landing l'ha già ripresa bene. Debolezze del concept: testo grigio chiaro su fondo pastello (contrasto basso), scritte inglesi decorative illeggibili dentro l'immagine, rosso/paura. |
| **45 - desktop B** | **Migliore** nell'hero, pari nel resto | Il miglior hero «di prodotto»: titolo a sinistra su fondo pulito, a destra quattro telefoni con le schermate vere dell'app a ventaglio davanti all'arco con la stella, sei etichette-pillola ancorate. Fa vedere il prodotto in tre secondi; la landing mostra solo due mini-schede. La striscia di quattro vantaggi sovrapposta al bordo dell'hero è pulita. La parte bassa è il tipico SaaS (griglia di quattro tessere, riquadro 82%, banner scuro, CTA con store): pari alla landing, con contenuto meno onesto. |
| **51 - desktop C** | **Migliore** nell'hero e nel racconto; peggiore nel resto | L'hero è cinematografico e a piena larghezza (scuro): arco in cemento con la stella, figura di spalle, fogli che volano, cielo, titolo bianco con «un passo in più.» blu elettrico. È il riferimento per il tema scuro. La fascia sotto è una trittico narrativo (problema a sinistra: studente stressato con appunti a mano; centro: il dato; destra: studente sereno con la Milano vera alle spalle e «Stesso punto di partenza. Più strade davanti a te.») che dà un volto umano a ciò che la landing dice solo con icone. Debolezze: testo piccolo su immagine, appunti a mano minuscoli, il resto della pagina tagliato dall'estrazione (anteprima non completa). |

### Voti (1-10)

Il voto del concept è per il concept migliore *per quel formato*; il voto della landing è per la pagina così com'è.

| Formato | Concept migliore | Voto concept | Voto landing attuale | Note |
|---|---|---|---|---|
| Telefono, chiaro | 12 | **8** | **6,5** | Il concept vince nell'hero (9 contro 6); la landing vince da «Se non superi» in giù per contenuto e struttura, ma perde ritmo per i vuoti e i cerchi di «Come funziona». |
| Telefono, scuro | (nessun concept scuro; riferimento 51 per atmosfera) | n.d. (51 lo suggerisce: 8,5 per l'hero) | **7** | In scuro la landing regge meglio che in chiaro: la stella brilla di più, il resto è coerente. Peccato per le immagini «spente» (vedi sezione 5). |
| Desktop, chiaro | 45 (hero) / 41 (secondo schermo) | **8,5** | **7** | Il concept è più spettacolare, la landing più ordinata e leggibile. Il divario è quasi tutto nell'hero e nell'allineamento. |
| Desktop, scuro | 51 | **8,5** (hero 9) | **7,5** | Il desktop scuro della landing è la sua versione migliore e si avvicina al 51 più di quanto ci si aspetterebbe: gli manca la scena a piena larghezza e il racconto con volti. |

### Dove la landing è meglio o pari (da difendere, non toccare)

- **«Il test in cifre» (25/30, 15 minuti, 30 domande)** batte il riquadro «82% dati reali» dei concept: è vero, ha un anello leggibile, ha la «i» per la spiegazione. Il concept è una promessa di paura mascherata da dato.
- **FAQ** (assenti nei concept): ben fatte, la prima aperta, linguaggio chiaro, onesta («La stima è una promessa?»).
- **«Cos'è l'OFA di inglese?» desktop**: la catena di schede inclinate su nastro rosso è all'altezza del 41 e più sobria; le cifre vengono da `config/offer.ts`.
- **Hero desktop scuro**: già vicino al 51 per palette e gerarchia.
- **CTA finale desktop**: pari al banner blu dei concept (e senza i bollini degli store).
- **Funzionalità** (Quiz, Simulazioni, Analisi, Spiegazioni): pari al concept; le illustrazioni sono un po' più calde e piacevoli.
- **Onestà del testo**: nessun dato inventato. Questo è un punto di forza di prodotto, non un difetto di design.

---

## 2. Cosa la landing deve PRENDERE dai concept (in ordine di impatto)

Per ciascuna voce: dove sta nel concept, come appare, come riprodurlo. Le dimensioni sono relative alla larghezza della pagina (W) o in px css.

### 2.1 Hero a composizione unica, non «immagine + testo» (concept 12, 41, 51) - impatto massimo

**Nel concept.** In 12 la scena occupa tutta la larghezza e circa i primi 555 px su 714 di larghezza (cioè 78% di W di altezza); il titolo (3 righe, circa 44% di W di larghezza) parte a circa 16% di W dall'alto e si appoggia sulla parte sinistra della scena, che sfuma verso il fondo chiaro. Il personaggio è sul terzo destro, a circa 55% dell'altezza della scena, ed è guidato dalle linee delle scale verso la stella. In 51 il titolo bianco è su un fondo che si scurisce verso sinistra (scrim) e la scena arriva fino al bordo destro e alto, *dietro* anche l'header.

**Come riprodurre sul telefono (400 px).**
1. Un unico blocco `hero` alto 620-660 px, con l'immagine come fondo `cover`, ancorata a destra-basso, a tutta larghezza e *dietro l'header* (header trasparente sopra, con velo vedi 5.1).
2. La scena è un ritaglio 4:5: portale e stella nella metà alta, personaggio a circa 55% di altezza del blocco e alto almeno 100 px (oggi circa 75 px). Serve una versione più stretta/alta dell'asset (oggi è un nastro largo).
3. Il titolo parte a circa 46% dell'altezza dell'immagine e si sovrappone alla parte bassa (scale, già chiare e quasi vuote) con un gradiente verso il colore di fondo (`linear-gradient(to bottom, transparent 0%, var(--fondo) 55%)` sul bordo inferiore dell'immagine), così il titolo naviga sopra la scena, non sotto.
4. Titolo a 40/40 px, ExtraBold, tre righe come ora; «un passo / in più.» in blu con leggero gradiente verticale (da `#3B82F6` a `#2563EB`), non piatto.
5. Sottotitolo massimo 3 righe, 16/24; CTA a larghezza piena 56 px di altezza; la CTA deve stare sopra la piega su 667 px di altezza (oggi sta a 675-735 px su 860: su un telefono piccolo scompare).

**Desktop.** Seguire 51 nella costruzione e 41 nella luce: scena a piena larghezza dietro l'header (altezza hero `min(100svh, 760px)`, minimo 640), titolo a sinistra su scrim (gradiente orizzontale che copre il 60% sinistro, opacità 0,92 → 0), portale e stella a circa 62-66% dell'ampiezza, personaggio a circa 70% della scena in basso. Serve un'immagine larga 21:9 (almeno 2560 px): quella attuale è un ritaglio morbido (vedi 5.9).

### 2.2 Il prodotto nell'hero (concept 45) - impatto alto

**Nel concept.** Tre/quattro telefoni a ventaglio (il centrale grande: «Sei a rischio?» con indicatore; a destra un quiz con risposta selezionata; a destra ancora la schermata di successo), con pillole flottanti ancorate («Quiz interattivi», «Simulazioni realistiche», «Piano di studio», «Analisi del livello», «Statistiche»). Il pubblico capisce in tre secondi che è un'app che *si usa*.

**Come riprodurre.** Desktop: sostituire le due mini-schede attuali con due telefoni sovrapposti (centrale 250 px di larghezza, laterale 210 px dietro e a destra, rotazione 0°/4°) che mostrano **schermate vere** dell'app (domanda del diagnostico con risposta scelta; risultato con la soglia 25/30), non il 72% «Esempio». Pillole: massimo 3, sempre reali («Quiz con spiegazione», «Simulazione 30 domande», «Ripasso errori»), testo 13 px, 600. Telefono: nessun telefono nell'hero (troppo piccolo); il telefono vero sta in «Come funziona» (2.4).

### 2.3 Striscia dei vantaggi che morde l'hero (concept 12, 45)

**Nel concept.** Contenitore bianco a vetro con raggio 24 px, sovrapposto al bordo inferiore dell'hero di circa 28 px, quattro colonne con icona in cerchio **tutta blu** (stesso tono), titolo a due righe con la parola chiave in grassetto.

**Come riprodurre.** La landing ce l'ha ma con altro contenuto e quattro colori diversi (blu, giallo, arancio, viola). Tenere i testi veri e: icone tutte nel tono del brand (cerchio `#E8EFFF` chiaro / `#1B2A5C` scuro, glifo `#2563EB` / `#8FB1FF`); usare il rosso solo per il rischio. Sul telefono 2x2 come ora, ma sovrapposto all'hero di 24 px, non staccato da 40-80 px di vuoto. Altezza della striscia desktop 96-110 px, non 123.

### 2.4 «Come funziona»: elenco 1-4 completo + telefono grande inclinato (concept 12)

**Nel concept.** Pillola eyebrow «COME FUNZIONA» (fondo celeste, testo maiuscolo blu 12 px), titolo a due righe, sottotitolo, poi elenco verticale 1-4: cerchi da 36 px con numero, collegati da un filo da 2 px, titolo 16/600 e descrizione di due righe a 14, **tutte e quattro visibili insieme**. A destra un telefono grande (circa 1/2 di W) inclinato di 5-6° su una forma blu arrotondata ruotata di 8° che spunta dietro e a destra, con ombra profonda.

**Come riprodurre.**
- Telefono 400 px: elenco verticale a tutta larghezza (4 righe da 64-72 px) con filo; sotto, il telefono centrato (230-250 px di larghezza, rotazione 3°, forma blu dietro) che mostra la schermata del passo attivo. Toccare una riga cambia la schermata e evidenzia la riga (bordo sinistro 3 px blu, fondo celeste). Niente animazioni, solo cambio immediato. Oggi: fila di quattro cerchi con etichette tagliate («Ripasso su misura» a due righe), una sola didascalia visibile e telefono diritto: i passi 2-4 sono nascosti dietro un tocco.
- Desktop: due colonne 5/7: a sinistra l'elenco verticale con filo (sostituisce la fila di quattro mini-schermate con testo di 8-11 px, illeggibili); a destra il telefono grande (280 × 570 px) inclinato di 4°, con forma blu dietro. Il pulsante «Fai il test di livello» sotto l'elenco.

### 2.5 Il racconto in tre atti, con volti (concept 51, fascia sotto l'hero) - impatto medio, richiede grafica nuova

**Nel concept.** Fascia a tutta larghezza divisa in tre: a sinistra problema (studente chino sugli appunti, tono caldo e scuro, appunti a mano con frecce), al centro un dato con pulsante («Scopri i dati»), a destra la risoluzione (studente sereno con cuffie sullo sfondo di Milano, titolo «Stesso punto di partenza. Più strade davanti a te.» in bianco e blu).

**Come riprodurre (desktop soltanto).** Dentro o accanto a «Cos'è l'OFA»/«Il test in cifre»: tre pannelli di altezza 340 px, raggio 24 px: sinistra immagine scura + etichetta, centro *l'anello 25/30 esistente* (non l'82%), destra immagine luminosa + titolo. Le due immagini vanno create (illustrazioni, non foto finte di persone: niente volti realistici di «studenti» che sembrerebbero testimonial). Se non ci sono illustrazioni pronte, rimandare: non sostituirle con foto di repertorio. Sul telefono: due schede impilate, 16:9.

### 2.6 Il nastro rosso → blu come filo narrativo anche sul telefono (concept 41)

**Nel concept.** Le quattro schede di vetro salgono a scalino (ogni scheda 30-40 px più alta della precedente) su un nastro rosso che si fa blu nell'ultima scheda («Con AddiOFA ti prepari ed eviti tutto questo»).

**Come riprodurre sul telefono.** Oggi 2x2 + scheda larga senza il nastro: si perde il passaggio problema → soluzione. Mettere un filo verticale da 3 px (da `#E5604D` a `#2563EB`) a sinistra delle schede disposte in colonna o, meglio, una griglia 2x2 con un solo connettore a gomito che entra nella scheda blu. Ridurre il vuoto tra icona e testo nelle schede (circa 60 px di bianco oggi).

### 2.7 La firma scritta a mano, una volta sola (concept 12, 41, 45, 51)

**Nel concept.** Una frase in corsivo a mano con un tratto blu sotto: «Stessa partenza. Più possibilità.» (12, 45, nella CTA finale) o in alto a destra dell'hero (51). Dà calore e un tocco umano a una pagina altrimenti geometrica.

**Come riprodurre.** Una sola occorrenza, nella CTA finale (angolo basso a destra, rotazione -6°, 22-24 px equivalenti) come **tracciato SVG** (niente `<text>`, niente font esterni), colore bianco 85% su blu. La frase è un motto, non un dato. Non ripeterla nell'hero.

### 2.8 Logo: segno + parola a due toni (concept 12, 45, 51)

**Nel concept.** Icona app (quadrato arrotondato blu con stella) a sinistra, poi «Addi» navy e «OFA» blu. In piccolo si legge subito.

**Come riprodurre.** Proposta, non obbligo (il logo è una decisione di brand): sull'header usare icona + parola a due toni a 28-32 px di altezza, perché la parola attuale tutta navy con le due A «a stella» è pesante e, a 20-30 px di altezza, le A sembrano lettere con un buco. Provarlo in una anteprima prima di sostituire.

### 2.9 Tema scuro: luce e profondità del 51

**Nel concept 51.** Fondo blu notte (circa `#07102E`) che si schiarisce verso cobalto dietro il portale; la stella è l'unico punto caldo; titolo bianco puro; l'accento blu è vivo e saturo (circa `#3D7BFF`), non pastello.

**Come riprodurre.**
- L'immagine dell'hero in scuro deve essere *a piena forza* (nessun velo di opacità sopra).
- Sotto l'hero il fondo non passa a un nero uniforme: gradiente da `#0B1740` (alto) a `#070D24` (basso) per i primi 600 px, poi piatto.
- Accento primario in scuro più saturo (`#4C86FF` al posto del periwinkle chiaro), CTA primario bianco con testo navy (come 51: bottone bianco) *oppure* blu pieno: scegliere uno solo, oggi in scuro il blu pastello con testo scuro perde forza.
- Banner edificio e CTA finale in scuro: usare versioni rigradate in blu notte, non l'immagine chiara con velo grigio (vedi 5.7).

### 2.10 Ritmo e proporzioni di sezione (tutti)

I concept hanno 3-4 «idee» per schermata; la landing ne ha una. Obiettivo: padding verticale delle sezioni 64-72 px sul telefono (oggi circa 110-160), 96-112 px sul desktop (oggi circa 140-180), e titoli di sezione con la stessa scala (vedi 5.5). Un'eccezione: dare più aria solo prima della CTA finale.

---

## 3. Cosa NON copiare

| Elemento (dove) | Perché no |
|---|---|
| «Già 12.000+ studenti si stanno preparando» e le quattro facce (12, 45, 51) | Numero e persone inventati. Vietato dal progetto (account/recensioni finti). Lo spazio sotto la CTA si riempie con una riga vera (6.2). |
| Riquadro «82% - Dati reali: molti studenti partono a rischio» e indicatore rosso 82% (12, 41, 45, 51) | Dato inventato e leva di paura su ragazzi di 18-20 anni. Sostituito bene dall'anello 25/30. |
| «Sei a rischio? 82% Probabilità di non superare l'OFA / Rischi di perdere circa 30 €» sul telefono (12, 41, 45) | Stessa cosa, più stima personale presentata come probabilità: la landing dice già correttamente «La stima è una promessa?». Nei telefoni dell'hero mostrare schermate vere. |
| Bollini «App Store / Google Play», «Scarica l'app» (12, 41, 45, 51) | L'app non è negli store: è un sito che si può installare. Header e CTA devono dire «Fai il test di livello» / «Inizia». |
| «Sblocca il tuo domani», «Sblocca il tuo piano di studi» (12, 45) | La parola «Sblocca» è vietata come etichetta. |
| Voci di menu «Prezzi» e «Storie» (45, 51) | Non esistono: è tutto gratuito, non ci sono storie vere. Il menu attuale (Cos'è l'OFA, Come funziona, Funzionalità, FAQ) è corretto. |
| «Scopri il video» con tasto play (51) | Non c'è un video. Nessun tasto che promette contenuto assente. |
| Indicatore di diapositive «01 02 03 04» e «SCROLL» verticale (51), «Scorri per scoprire» con mouse (41) | Decorazioni di carosello/animazione: la pagina è statica. |
| Scritte inglesi incise o scritte a mano *dentro* le immagini («SAME STUDENTS HIGHER HORIZONS», «SMALL STEPS BIG OPPORTUNITIES», «Stessa partenza. Più possibilità.» come raster) (41, 51) | Non localizzabili, non accessibili, illeggibili a grandezza reale. Il motto va come SVG tracciato e una sola volta (2.7). |
| «POLITECNICO DI MILANO» inciso sull'edificio come se fosse un monumento ufficiale (12, 41, 51) | Suggerisce un'affiliazione che il sito esclude per scelta («Progetto studentesco indipendente, non affiliato»). La scena può evocare un ateneo, non portare il nome sulla pietra. Controllare che l'asset dell'hero non porti il nome. |
| Eccesso di rosso: scheda con X rossa, portafoglio rosso, lucchetto, nastro rosso acceso (41) | Tono d'allarme. La landing attuale tiene un rosso più caldo e basso: va bene così. |
| Vetro smerigliato su ogni scheda e testo grigio chiaro su pastello (41) | Contrasto insufficiente (stimo circa 3:1 sul testo di corpo). Si copia la profondità, non il colore del testo. |
| Testo di corpo piccolo su foto (51, appunti a mano da 11-12 px) | Illeggibile a 400 px e non accessibile. |
| Menu a lingua «IT ▾» (51) | Un solo lingua, nessuna utilità. |
| Slogan «Più strade davanti a te» come promessa di risultato | Va bene come tono, ma niente garanzia: la FAQ dice che la stima non è una promessa. Usare «Stesso punto di partenza» solo se accanto sta un fatto (formato del test, 613 domande). |
| Foto di studenti reali o simili a reali (51) | Se non si hanno illustrazioni, non usare facce da repertorio: sembrano testimonial. |

---

## 4. Specifica finale della landing

Principi: un solo formato di test (30 domande, 15 minuti, soglia 25/30), tutti i numeri da `config/offer.ts` e dai dati reali (qui scritti come `{N}` dove cambiano), mai «Pass», «Sblocca», «Gratis/Prova» come etichette, mai «presto/in arrivo/beta». Interfaccia statica: le schede compaiono solo scorrendo, come ora; il resto non si muove. Icone della stessa famiglia e dello stesso tono. Apostrofi tipografici ovunque (’).

### 4.0 Header

**Telefono.** Altezza 56 px. Sinistra: icona app 28 px + parola «Addi» navy / «OFA» blu. Destra: pulsante pieno «Test di livello» (altezza 40, raggio 20, senza cerchio con freccia) + menu (hamburger 44 px di area). Sfondo `fondo` al 92% con `backdrop-blur(12px)` e linea inferiore 1 px quando si scorre; trasparente sopra l'hero finché non si scorre.
**Desktop.** Barra a tutta larghezza alta 64 px con lo stesso contenitore del contenuto (stessi margini, 72 px a 1280): logo a sinistra allineato al titolo, pillola con le voci al centro, CTA a destra allineata al margine destro del contenuto. Voci: «Cos’è l’OFA», «Come funziona», «Funzionalità», «Domande» (la voce «Home» si toglie: il logo la fa già). Stato attivo con fondo celeste. Sfondo come sul telefono.

Testi: voci come sopra; CTA «Fai il test di livello» (desktop), «Test di livello» (telefono). Lo stesso nome di azione ovunque.

### 4.1 Hero

**Telefono (400 px).** Blocco 620-660 px, scena a tutta larghezza dietro l'header; titolo sovrapposto alla parte bassa della scena su gradiente; CTA sopra la piega.
- Eyebrow (12 px, maiuscolo, 600, blu): `Per gli studenti del Politecnico di Milano`
- H1 (40/40, ExtraBold): `Oltre l’OFA,` / `un passo` / `in più.` (le ultime due righe blu con gradiente)
- Sottotitolo: `Scopri a che punto sei, ripassa i tuoi errori e allenati sul formato del test. È aperto a tutti e non serve nessuna password.`
- CTA primario (56 px, larghezza piena): `Fai il test di livello`; sotto, riga di 13 px: `10 domande · 3 minuti · senza password`
- CTA secondario (testo + freccia, senza bordo): `Come funziona`
- Riga di fiducia (due chip su una riga, 13 px, mai su tre): `{N} domande con spiegazione in italiano` · `Simulazioni illimitate`. Il vecchio «Salta» esce dall'hero (va in 4.7 come link testuale, vedi 6.3).

**Desktop (1280 px).** Scena a piena larghezza, altezza `min(100svh, 760px)`; testo a sinistra in colonna di 520 px su scrim.
- Stessi testi del telefono; H1 su due righe: `Oltre l’OFA,` / `un passo in più.` a 64/64.
- CTA: primario `Fai il test di livello` + secondario `Come funziona` (outline).
- A destra, due telefoni con schermate vere (vedi 2.2) e fino a 3 pillole: `Quiz con spiegazione`, `Simulazione da 30 domande`, `Ripasso degli errori`.
- Niente avatar. Niente indicatori di pagina.

**Tema scuro.** Scena a piena forza, fondo `#0B1740` → `#070D24`, H1 bianco puro, blu `#4C86FF`, CTA primario bianco con testo `#0B1740`.

### 4.2 Vantaggi

Striscia sovrapposta di 24 px all'hero. Icone nel tono del brand.
- `Sai a che punto sei` · `10 domande, 3 minuti`
- `Provi il test vero` · `30 domande in 15 minuti, soglia 25/30`
- `Ripassi ciò che sbagli` · `{N} domande`
- `Capisci perché` · `spiegazioni in italiano`

Telefono: 2x2, padding 20, gap 20, raggio 24. Desktop: 4 colonne con divisori verticali 1 px, altezza 96-110.

### 4.3 Cos’è l’OFA di inglese? (problema → soluzione)

- Eyebrow: `01` + filo (come ora).
- H2 (32 telefono / 44 desktop): `Cos’è` / `l’OFA di inglese?` («OFA di inglese?» in blu).
- Testo: `Un obbligo formativo aggiuntivo: lo togli superando un test di inglese. Se non lo superi, il piano degli studi resta limitato e ogni nuovo tentativo ha un costo.`
- Link: `Scopri tutti i rischi`
- Schede (testi esistenti, numeri da config): `Non superi l’OFA` · `sotto 25 su 30`; `Circa {costo} € a tentativo` · `presso gli enti convenzionati`; `Piano di studi limitato` · `solo esami del 1° anno`; `Il piano del 2° anno` · `scadenze a fine estate`; ultima scheda blu: `Con AddiOFA ti prepari ed eviti tutto questo.` (con il tasto freccia che porta al test, e un'etichetta accessibile «Fai il test di livello»).

Desktop: catena di schede inclinate su nastro, come ora; ultima scheda con bordo blu e CTA. Telefono: griglia 2x2 + filo verticale (rosso → blu) che entra nella scheda blu; icone a 56 px, riducendo i 60 px di vuoto sopra le icone. Se ci sono le illustrazioni (2.5), sul desktop aggiungere il pannello «problema» e il pannello «domani» attorno al 25/30.

### 4.4 Come funziona

- Eyebrow (pillola): `COME FUNZIONA`
- H2: `Un percorso su misura, in 4 passi`
- Sottotitolo: `Dal test iniziale alla simulazione, tutto in un’unica app.`
- Passi:
  1. `Fai il test iniziale` · `Scopri il tuo livello con 10 domande in 3 minuti.`
  2. `Ripassa su misura` · `Rivedi le domande sbagliate, i quiz mirati e la teoria in italiano.`
  3. `Allenati con le simulazioni` · `Stesso formato del test: 30 domande, 15 minuti, correzione dettagliata.`
  4. `Supera l’OFA` · `Togli l’obbligo e vai avanti con il piano degli studi.`
- CTA: `Fai il test di livello`

Telefono: elenco verticale a 4 righe con filo, poi il telefono (240 px, rotazione 3°, forma blu dietro) con la schermata del passo selezionato; il passo 1 è attivo all'apertura; tocco sulle righe cambia la schermata (nessuna animazione). Desktop: due colonne 5/7, elenco a sinistra, telefono grande (280 × 570) inclinato di 4° a destra. Tutte le schermate mostrate sono quelle vere e la scritta «Esempio» è leggibile (12 px), non di 8.

### 4.5 Funzionalità

- H2: `Tutto ciò che ti serve per arrivare preparato.` (seconda parte in blu)
- Link: `Parti dal test di livello`
- Schede:
  - `Quiz interattivi` · `Domande come nel test vero, con la spiegazione.`
  - `Simulazioni` · `Timer e formato del test di recupero.`
  - `Analisi del livello` · `Statistiche chiare, argomento per argomento.`
  - `Spiegazioni semplici` · `Teoria, esempi e consigli in italiano.`

Telefono: 2x2, icona 72 px centrata, titolo 16/600, testo 13/18 centrato. Desktop: 4 colonne a 269 px, come ora. Stile: icone nella stessa famiglia e con lo stesso trattamento di luce (oggi la clessidra è arancione, la lampadina gialla, le barre blu: tenerle, ma tutte dentro lo stesso quadrato di luce).

### 4.6 Il test in cifre + banner

- Anello 25/30 (`SOGLIA`), eyebrow `IL TEST IN CIFRE`, titolo `25 risposte esatte su 30.`, testo `Hai 15 minuti. AddiOFA ti fa provare lo stesso formato, finché non lo senti tuo.`
- Banner con foto (edificio): titolo `Il tuo futuro non si ferma a un esame.`, testo `Superare l’OFA ti permette di completare il piano degli studi e di inserire anche gli esami del 2° anno, senza ostacoli.` Il tasto freccia diventa un link con testo: `Fai il test di livello`, altrimenti si toglie.

Telefono: due schede impilate, l'anello a sinistra e il testo a destra (anello 120 px) per ridurre l'altezza da 345 px a circa 200 px; banner 16:9 con testo su scrim pieno, non su sfumatura che lascia il testo a metà su foto. Desktop: due colonne 5/7 come ora, stessa altezza (324 px).

### 4.7 Domande (FAQ)

- Eyebrow `DOMANDE`, H2 `Domande frequenti`
- Voci: `Quanto costa?` (prima aperta), `Cos’è il test di livello?`, `La stima è una promessa?`, `Dove restano i progressi?`, `Legata al Polimi?`. Risposte esistenti, con «diagnostico» → «test di livello».
- Sotto l'ultima voce, riga di 14 px: `Vuoi andare direttamente agli esercizi? Vai agli esercizi.` (link, sostituisce «Salta»).

Telefono: una colonna, voci alte 56 px, raggio 16. Desktop: titolo a sinistra *sticky*, voci a destra (colonna di 648 px). La colonna sinistra non resta vuota per 300 px: o sticky, o mettere sotto il titolo la riga sul tempo di risposta/contatto se esiste.

### 4.8 CTA finale

- Eyebrow `INIZIA OGGI`; H2 `Costruisci il tuo domani.`; testo `Un piccolo passo ora, per un percorso universitario senza ostacoli.`
- CTA bianco: `Fai il test di livello`. Link testuale: `Vai agli esercizi`.
- Motto in corsivo tracciato (SVG): `Stessa partenza. Più possibilità.`

Telefono: card blu a tutta larghezza (raggio 24), testo in alto, **icona 3D a destra in basso e sovrapposta al margine (circa 45% di larghezza, non tagliata), senza fascia/cucitura**; motto sotto l'icona. Desktop: card 1136 × 366, testo a sinistra, icona 3D a destra come ora, motto in basso a destra.

### 4.9 Footer

`Termini · Privacy · Cookie` e: `Progetto studentesco indipendente, non affiliato al Politecnico di Milano.` Telefono: due righe centrate come ora, più respiro sopra (padding 32). Nessun altro testo.

---

## 5. Problemi della landing attuale, indipendenti dai concept

Elenco ordinato per gravità. «Telefono»/«Desktop»/«Scuro» indicano dove si vede.

**5.1 Header che lascia passare il contenuto (Desktop e Telefono, entrambi i temi) - grave.**
Sul desktop il logo sta senza sfondo e il contenuto che scorre gli passa sotto, producendo testo sovrapposto illeggibile (es. «AddiOFA» sopra «Un percorso su», schermate 02 chiara e scura; il logo si confonde con «Domande» in 05). La pillola del menu è troppo trasparente: il testo della FAQ si legge attraverso. Sul telefono la fascia dell'header (circa 64 px) mostra del testo fantasma attraverso (es. «Senza limiti» in schermata 01, titolo in 02). Soluzione: 4.0.

**5.2 Header e contenuto non sono sulla stessa griglia (Desktop).**
Logo a x = 32, titolo a x = 72; CTA a destra termina a x = 1248, contenuto a 1208. Il logo non si allinea a niente. Soluzione: stesso contenitore.

**5.3 Apostrofi dritti nei titoli (tutti).**
«Oltre l'OFA», «Cos'è», «l'OFA di inglese?», «Cos'è il diagnostico?» usano `'`. In display a 40-64 px si vede. Usare `’` (U+2019) ovunque: nei titoli è il difetto tipografico più visibile e il più economico da correggere.

**5.4 Hero telefono: composizione debole e persona minuscola (Telefono, entrambi).**
Immagine a fascia da circa 280 px con personaggio di 75 px; titolo staccato sotto; l'effetto è «foto decorativa», non «porta verso qualcosa». Il bordo superiore dell'immagine sotto l'header è piatto/morbido in modo poco deliberato. Soluzione: 2.1.

**5.5 Scala dei titoli di sezione incoerente (Desktop).**
A 1280: «Cos'è l'OFA…» circa 52 px, «Un percorso su misura…» circa 36 px, «Tutto ciò che ti serve…» circa 40 px, «Domande» circa 48 px. Il titolo del passo 2 sembra più piccolo del titolo della sezione prima. Soluzione: un'unica scala: H2 sezione 32 (telefono) / 44 (desktop), invariata.

**5.6 Ritmo verticale allentato (tutti; verificare il caso «rivelazione»).**
Padding tra sezioni circa 110-170 px: sotto «Scopri tutti i rischi» (telefono, schermata 01) restano circa 100 px vuoti; sul desktop tra la catena di schede e «Come funziona» circa 170 px vuoti, e tra FAQ e CTA finale circa 140. Una parte potrebbe essere dovuta alle schede ancora non comparse al momento dello scatto: va ricontrollata scorrendo davvero. In ogni caso la pagina è lunga circa 5-6 schermate di telefono per dire cose che i concept dicono in tre. Ridurre a 64-72 / 96-112 px.

**5.7 Immagini «spente» nel tema scuro (Telefono e Desktop).**
Il banner dell'edificio e la CTA finale in scuro diventano grigio-azzurri sporchi (immagine chiara con velo scuro sopra): perdono contrasto e calore, la stella della CTA diventa opaca. Servono versioni rigradate in blu notte, non un velo.

**5.8 Cucitura nella CTA finale del telefono (Telefono, entrambi).**
Tra la zona blu col testo e l'immagine inferiore c'è un bordo netto orizzontale (circa y = 505 nella schermata 07) e l'icona 3D è tagliata in basso. Sembra due blocchi incollati. Soluzione: 4.8.

**5.9 Qualità dell'immagine dell'hero desktop (Desktop, entrambi).**
A 1280 la scena è morbida, con un lato sinistro sfumato sporco (scale che si sciolgono in una striscia lattiginosa intorno a x = 520-760) e il bordo destro che arriva alla fine della finestra con la scheda quasi tagliata. Sembra un ritaglio ingrandito. Serve un asset più largo e più nitido (2.1).

**5.10 Etichetta «Esempio» illeggibile e dato «72%» nel hero (Desktop).**
La dicitura che dice che il 72% è un esempio è circa 8 px. Il numero si legge come una stima reale; con la FAQ che dice che la stima non è una promessa, è una piccola incoerenza. Sostituire con schermate vere (2.2) o ingrandire la dicitura a 12 px minimo.

**5.11 Mini-schermate di «Come funziona» sul desktop (Desktop).**
Testo di 8-11 px dentro sagome da circa 190 px: sono illustrazioni, non si leggono come interfaccia. Soluzione: 2.4.

**5.12 Etichette e riga di fiducia dell'hero (Telefono e Desktop).**
La riga «Senza limiti · Senza password · (i) · Salta» ha un'icona «i» senza testo e «Salta» (senza dire cosa si salta); sul telefono «Salta» va a capo da solo. Nella CTA finale «Salta» bianco su blu resta orfano. Soluzione: 4.1, 4.7, 4.8.

**5.13 Nome dell'azione non coerente e gergale (tutti).**
Header telefono dice «Inizia», hero «Fai il diagnostico», FAQ «Cos'è il diagnostico?». «Diagnostico» è gergo per una persona di 18 anni; tre nomi per la stessa azione frenano. Proposta: «Fai il test di livello» ovunque, con la sottoriga «10 domande · 3 minuti».

**5.14 Pulsanti freccia senza etichetta (tutti).**
Il cerchio con la freccia nella scheda blu «Con AddiOFA…» e nel banner dell'edificio non dice dove porta; per chi usa lettore di schermo e per chi tocca è un'azione sconosciuta. Dare un'etichetta o toglierlo (4.3, 4.6).

**5.15 Icone di colori diversi (tutti).**
La striscia dei vantaggi usa quattro tonalità (blu, giallo, arancio, viola) senza un significato; il resto della pagina è blu/neutro con rosso per il rischio. Un solo tono (2.3).

**5.16 Ombre troppo larghe e azzurrine (Desktop, chiaro).**
Sotto le voci della FAQ e le schede, ombre molto diffuse e blu sporcano il fondo («aloni»). Ridurre a 0 8 24 -12 con opacità 8-10%, colore neutro.

**5.17 Informazione chiave troppo in basso (tutti).**
Il formato del test (30 domande, 15 minuti, 25/30) compare solo dopo «Funzionalità», a metà pagina. È la prima cosa che uno studente cerca. Anticiparla nella striscia (4.2) e, su desktop, nell'hero.

**5.18 Colonna sinistra della FAQ vuota (Desktop).**
Dopo «Domande» restano circa 300 px di vuoto mentre la colonna destra scorre. Sticky (4.7).

**5.19 Telefono: passi 2-4 nascosti (Telefono).**
Nascosti dietro il tocco su cerchi da 44 px con etichette tagliate: gran parte dei visitatori non vedrà mai cosa sono il ripasso e le simulazioni. Soluzione: 2.4.

**5.20 Cose che funzionano e non vanno toccate.**
Anello 25/30; catena di schede su nastro (desktop); striscia dei vantaggi; testi onesti; FAQ aperta sulla prima domanda; contrasto del testo di corpo (a occhio sufficiente, da verificare con uno strumento); tema scuro come impianto; footer con l'avvertenza.

---

## 6. Appendice: priorità e sforzo

| # | Intervento | Impatto | Sforzo | Richiede grafica nuova |
|---|---|---|---|---|
| 1 | Header con sfondo e griglia unica (5.1, 5.2) | Alto | Basso | No |
| 2 | Apostrofi tipografici (5.3) | Medio | Minimo | No |
| 3 | Un solo nome per l'azione, togliere «Salta»/«(i)» dall'hero (5.12, 5.13) | Alto | Basso | No |
| 4 | Ritmo verticale (5.6) | Alto | Basso | No |
| 5 | Hero telefono a composizione unica (2.1, 5.4) | Molto alto | Medio | Sì: ritaglio 4:5 della scena |
| 6 | «Come funziona» con elenco completo + telefono grande (2.4, 5.11, 5.19) | Alto | Medio | No (schermate vere) |
| 7 | CTA finale senza cucitura (5.8) | Medio | Basso | Ritaglio |
| 8 | Immagini scure rigradate (5.7, 2.9) | Medio | Medio | Sì: versioni notte |
| 9 | Hero desktop a piena larghezza con due telefoni veri (2.1, 2.2, 5.9, 5.10) | Molto alto | Alto | Sì: scena 21:9 nitida |
| 10 | Icone nel tono del brand, ombre neutre, scala titoli (2.3, 5.5, 5.15, 5.16) | Medio | Basso | No |
| 11 | Motto a mano in SVG nella CTA finale (2.7) | Basso-medio | Basso | Sì: tracciato |
| 12 | Trittico problema-numero-domani con volti (2.5) | Medio | Alto | Sì: due illustrazioni |
| 13 | Logo a due toni (2.8) | Basso | Basso | Decisione di brand |

---

## Riepilogo in 8 righe

1. Il cliente ha ragione solo in parte: i concept battono la landing sull'hero e sul primo impatto, non sul resto della pagina.
2. Voti: concept 12 mobile 8, 45 desktop 8,5, 51 desktop scuro 8,5; landing attuale 6,5 (telefono chiaro), 7 (telefono scuro), 7 (desktop chiaro), 7,5 (desktop scuro).
3. Da prendere: hero in un'unica composizione con il personaggio grande, il prodotto vero nell'hero desktop (45), «Come funziona» con elenco 1-4 completo e telefono grande (12), la luce del tema scuro (51), il nastro problema → soluzione anche sul telefono (41), il motto scritto a mano una volta.
4. Da non copiare: 12.000+ studenti e avatar, 82%, bollini store, «Sblocca», «Prezzi/Storie», «Scopri il video», scritte inglesi e «Politecnico di Milano» dentro le immagini, rosso d'allarme, vetro con testo a basso contrasto.
5. Da difendere: anello 25/30, FAQ, catena «Cos'è l'OFA», testi onesti, striscia vantaggi, tema scuro come impianto.
6. Problemi indipendenti più gravi: header trasparente che sovrappone il testo (desktop e telefono), logo non allineato alla griglia, apostrofi dritti nei titoli, tre nomi diversi per la stessa azione, ritmo verticale allentato.
7. Immagini in scuro spente (banner e CTA) e cucitura nella CTA del telefono; hero desktop morbido e sfumato male a sinistra.
8. Ordine di lavoro: prima i fix a costo basso (1-4 e 7), poi hero telefono e «Come funziona», poi la scena larga desktop e le immagini notte; il trittico con volti solo se ci sono illustrazioni vere.
