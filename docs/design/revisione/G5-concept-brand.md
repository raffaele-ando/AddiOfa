# G5 – Riferimenti (concept, brand board, kit) contro implementazione

Revisione esterna e indipendente. Occhio da brand e product designer: nessuna scelta da difendere.
Materiale guardato: le 12 anteprime dei riferimenti (07, 28, 35, 40, 08, 16, 17, 23, 50, 15, 24, 44) e le schermate dell'app a 400 px (chiaro e scuro: landing, funnel 01/02/04, home, esercizi, sfide, profilo, esplora, FAQ, stato vuoto, esito simulazione) più la landing a 1280 px chiaro. Per i due casi dubbi ho aperto anche `app/src/brand/essenziali/hero/scena-scura.webp` e `landing/banner-edificio.webp` e un ingrandimento del wordmark. Non ho aperto il codice dei componenti se non per capire cosa esiste (token, sfere, glifi). Nessun file del progetto è stato toccato.

Limite onesto: valuto immagini statiche, non il comportamento. Il vuoto in fondo alla landing mobile (01-landing-01) può dipendere dalla comparsa allo scorrimento: lo segnalo ma non lo conto come difetto.

---

## 0. Risposta secca al cliente

Il cliente ha ragione a metà.

- **Dove i riferimenti sono davvero meglio**: (1) il wordmark, bicolore con la «O» azzurra; (2) la presenza di un'illustrazione grande per schermata, con una luce calda come unico accento; (3) il set di sfere di vetro (44); (4) il tema scuro del cover 40, che è un vero «blu notte» e non la foto chiara spenta; (5) la fattura di icone piene e bicolori; (6) il gauge «82%» pulito.
- **Dove l'implementazione è migliore o pari**: la palette è la stessa e usata con più disciplina funzionale (rosso solo per errore, azione in `#2563EB`); la tipografia è la stessa (Inter); le illustrazioni sono vettoriali con varianti `.scuro`, cosa che nessun riferimento ha; le schermate sono leggibili, coerenti nei bordi e nelle dimensioni dei bersagli; le scelte di contenuto (niente costi, niente paura, niente falsi utenti) sono migliori dei riferimenti.
- **Il problema vero** non è che le immagini siano «meglio»: è che l'app ha già nelle risorse quasi tutto ciò che nei riferimenti brilla (sfere, glifi pieni, illustrazioni, varianti scure) e nelle schermate lo usa troppo piccolo, troppo ripetuto o sostituito da icone a contorno generiche. Il divario si chiude più con regole d'uso che con nuova grafica.

---

## 1. Verdetto per riferimento

Voti 1-10. «Rif.» = il riferimento preso da solo, come immagine. «Impl.» = come quella cosa compare davvero nelle schermate, chiaro / scuro. I riferimenti non hanno un tema scuro (salvo icona app e cover), quindi per loro il voto è unico.

| Riferimento | Verdetto | Rif. | Impl. chiaro | Impl. scuro |
|---|---|---|---|---|
| 07 brand board logo + palette | **Migliore** (logo) | 8 | 5,5 | 5,5 |
| 28 brand identity system | **Migliore** (sistema, componenti) | 8,5 | 6 | 6 |
| 35 brand identity B | **Migliore, di poco** (più ordinato di 07) | 8 | 6 | 6 |
| 40 art direction | **Migliore** (cover e blu notte); le foto no | 8,5 | 7 (hero) | 5 (hero) |
| 08 brand kit illustrazioni (rosso) | **Peggiore** | 6 | 7 | 6,5 |
| 16 brand kit B (blu, lucido) | **Migliore, di poco** nel volume e nel bagliore | 8,5 | 7 | 6,5 |
| 17 brand kit C (blu, più piatto) | **Pari** | 8 | 7 | 6,5 |
| 23 / 50 brand kit D / F | **Peggiore**, e sono la stessa immagine | 6 | 7 | 6,5 |
| 15 concept logo stella | **Pari**: icona app superba, pagine mock deboli nei contenuti | 7,5 | 7 | 6 |
| 24 icona app stella | **Migliore**, ma non è in discussione: è l'asset giusto | 9,5 | 8 (dove compare) | 8 |
| 44 icone sfera | **Migliore** | 9 | 6 | 5,5 |

### Motivazioni, gruppo per gruppo

**Logo e marchio (07, 28, 35, 15, 24).**
Il wordmark dei riferimenti è «Addi» e «FA» in blu notte con una «O» blu pieno che contiene una stella a quattro punte: due colori, una sola firma, leggibile anche a 20 px. L'implementazione ha un wordmark monocolore con una stella a cinque punte ritagliata in *entrambe* le A (vedi ingrandimento: a 24 px d'altezza sembrano tacche o sporco, non stelle) e la «O» liscia. Perde proprio l'elemento che rendeva il marchio memorizzabile e non ha più un tocco di colore nelle intestazioni. La scelta monocolore è difendibile come variante (stampa, filigrana), non come versione principale. Inoltre la ripetizione (due stelle nella stessa parola) toglie unicità. L'icona app 3D (24, 15) è il pezzo migliore dell'intero materiale: nell'app compare solo come favicon e come scena, mai come «sigillo» in un luogo di rilievo (schermata di accesso, fine funnel, pagina Progetto).

**Palette (07, 28, 35, 40).**
Stessi valori: `#0F172A`, `#3B82F6`, `#60A5FA`, `#F6F8FC`, `#E5E7EB`, `#6B7280`, più rosso, ambra, verde, viola semantici. L'implementazione aggiunge `#2563EB` come colore d'azione (scelta corretta: più contrasto con testo bianco). Differenza di *uso*: nei riferimenti le illustrazioni sono quasi tutte blu con un solo accento caldo (oro/ambra della luce, del trofeo, della lampadina), e questo dà l'effetto «premium». Nell'app, nelle stesse schermate, convivono tessere pastello in cinque tinte (Esplora: lilla, azzurro, verde, giallo; Esercizi: arancio, ambra, viola, verde): è allegro ma meno distinto e più «kit di componenti». Il Profilo, che resta neutro, è la schermata più vicina allo spirito dei riferimenti.

**Illustrazioni (08, 16, 17, 23, 50).**
Il kit rosso (08, 23, 50) è una copia dichiarata di Duolingo (lo dice la sua stessa etichetta) con macchie rosa: per un'app il cui colore d'azione è blu è fuori marca e fuori tono. 23 e 50 sono lo stesso file con un altro nome: non sono due opzioni. Il kit B (16) è il più ricco: ogni oggetto ha una luce da sinistra in alto, un'ombra morbida al suolo, un alone chiaro dietro, un solo accento caldo (arancio dell'orbe del gauge, oro del trofeo e della lampadina, ambra della clessidra). Il kit C (17) è più piatto e più pulito: l'implementazione ne è, di fatto, una versione vettoriale, e come asset è pari. Dove l'implementazione perde è nell'*uso* (vedi punto 2 e 4) e nella resa scura: le illustrazioni «di vetro» (foglio quiz, carta d'identità, documento) diventano grigio-blu spenti su fondo scuro, con poco contrasto (esercizi scuro, funnel-04 scuro, esito scuro), mentre trofeo, globo e lampadina restano luminosi: due trattamenti diversi nella stessa schermata. La nuvola triste, scura, è una macchia piatta.

**Icone (08, 16, 17, 28, 35).**
I riferimenti usano glifi *pieni e bicolori* dentro una tessera arrotondata tinta (libro, barre, fulmine, documento, lucchetto, trofeo, busta, profilo, ingranaggio, punto interrogativo, spunta, X, info). Sono in famiglia con le illustrazioni (stesso blu, stesso accento caldo) e hanno carattere. L'app, nelle schermate viste, usa icone a *contorno* sottile da libreria standard in tessere pastello e, nella barra inferiore, un manubrio (Esercizi) e due spade incrociate (Sfide): metafore da palestra e da videogioco che non appartengono al brand. Le icone a contorno sono pulite ma generiche e creano due lingue visive (contorno sottile accanto a illustrazioni piene e volumetriche). Le risorse per fare meglio ci sono già (`essenziali/glifi/kit-blu/*.svg`, 14 glifi), ma non compaiono nelle schermate esaminate.

**Sfere (44).**
Quattordici icone in disco di vetro, tutte blu con un solo accento caldo o rosso (lampadina, bersaglio): è il sistema più unitario di tutto il materiale e quello che meglio traduce «premium ma amichevole». L'app ha già le 14 sfere (e le `.scuro`) ma nelle schermate viste non si vedono: sono state sostituite da illustrazioni di forma e peso diversi (carta d'identità, barre, trofeo, fumetti in Esplora: quattro sagome, quattro larghezze, bordo sinistro irregolare). Dove ci sarebbe da mettere un'icona-destinazione, l'effetto di insieme è più disordinato di quello che il set 44 darebbe.

**Art direction (40) e moodboard.**
Il cover scuro di 40 (wordmark bianco con «O» azzurra, portale blu saturo, studente, luce dorata) è la cosa più forte del materiale. L'hero chiaro dell'app ne deriva e funziona: a 1280 px è bello, quasi pari al riferimento. Nello scuro invece non è un cover blu notte: è la stessa scena chiara abbassata, con blu desaturato in lavanda-ardesia, doppia esposizione di città fantasma ai lati, cornice nera visibile ai bordi del file (`scena-scura.webp`) e portale che perde il blu iconico. Qui il riferimento è nettamente migliore. Il banner dell'edificio (`banner-edificio.webp`) è a bassa risoluzione, con artefatti e velo blu-seppia: peggiore di qualunque foto di 40.

**Tipografia.**
Pari: Inter dappertutto, titoli pesanti e stretti, ottimo. Nell'app i titoli sono ben gerarchizzati; manca solo la cura tipografica (apostrofi dritti `'` invece di `’` in «Oltre l'OFA», «Cos'è», titolo che va a capo in «un passo / in più.»; testi secondari a 11 px nei benefit). Il corsivo a mano dei riferimenti («Small steps, big opportunities») non è tipografia del sistema: è lettering di un'AI (vedi punto 3).

**Tono generale.**
Riferimenti: luminoso, istituzionale ma amichevole, quasi da marchio di fintech/edtech di fascia alta. App: chiaro e rassicurante, ma nelle schermate interne diventa «template»: tessere `#F1F4FB` su bianco senza bordo né ombra, poca separazione, illustrazioni piccole. La landing è l'unica parte che sembra premium.

---

## 2. Cosa l'implementazione dovrebbe PRENDERE, in ordine di effetto

Ordine = rapporto fra effetto percepito e costo. Tutto si appoggia a risorse già nel repository, salvo dove indicato.

1. **Wordmark bicolore con una sola stella nella «O»** (riferimenti 07 riquadri «Logo variations» e «Brandmark»; 28 «Logo primario»; 35 «Logo primario»).
   - Chiaro: «Addi» e «FA» `#0F172A`, «O» disco `#3B82F6` con stella bianca. Scuro: parola bianca, «O» `#60A5FA` (è l'«Azzurro» elencato proprio nei primari di 28 e 35, evidentemente pensato per questo).
   - Una stella sola. Togliere quelle dalle A (restano nel lettermark «A» isolato, dove hanno il corpo per leggersi). Scegliere *una* forma di stella per tutto il sistema (nei riferimenti convivono la stella a 5 punte dell'icona app e lo scintillio a 4 punte del wordmark: è un'incoerenza dei riferimenti, non da copiare): consiglio la 5 punte dell'icona nell'O, e il 4 punte solo come micro-decorazione (puntini, fine di tracciato) mai come logo.
   - Altezza minima 22 px in testata; sotto, usare il lettermark. Tenere il monocolore solo per stampa/filigrana.

2. **Un'illustrazione grande per schermata di stato e di benvenuto** (15 «Stile UI» a destra: quattro schermate mock con *una* illustrazione centrale da 120-160 px, titolo, una frase, un pulsante).
   - Funnel (benefit, domanda introduttiva, esito diagnostico), Esito, stati vuoti, fine simulazione: illustrazione 128-160 px su mobile, 200-240 px da 1024 px in su, centrata, 24 px sopra il titolo.
   - Non più di una per schermata (vedi regole, sezione 4).

3. **Hero scuro vero, da cover 40** (40 «Art direction», pannello grande in alto a sinistra).
   - Rigenerare `scena-scura.webp` dalla scena chiara, non spegnerla: sfondo a gradiente `#0B1530 → #0F172A` che sfuma nel fondo della pagina; portale conservato saturo (`#1D4ED8-#2563EB`), stella a luce piena e calda (`#FFE9A8` al centro, alone `#F59E0B` al 35%), niente doppia esposizione della città, niente cornice nera (ritagliare di 6-8 px o stendere uno sfondo uniforme), dissolvenza solo sul bordo inferiore.
   - Sul mobile, immagine a tutta larghezza, 300-340 px di altezza, senza sfumatura laterale (ora i lati svaniscono in modo sporco in entrambi i temi).

4. **Sfere come icone-destinazione e come identificatori di sezione** (44 intero; 28 «App icon set esteso»).
   - Esplora (4 voci): Project ID → `sfera-addiofa`, ATLAS → `sfera-risultati`, NOI → `sfera-community`, Agorà → `sfera-faq`. 56 px, a sinistra in un riquadro quadrato fisso (stessa larghezza per tutte), niente più sagome diverse. Il globo grande in testa può restare, ma a 96 px e non ripetuto.
   - Profilo (4 tessere): Progressi → `sfera-risultati`, Obiettivi → `sfera-successi`, Progetto → `sfera-opportunita`, Badge → trofeo del kit (non c'è una sfera adatta: se serve, produrre una `sfera-badge` con nastro e stella in stile 44). 64 px.
   - Funnel, schermata benefit (4 voci): `sfera-studio`, `sfera-risultati`, `sfera-consigli`, `sfera-opportunita`, 40 px, al posto delle quattro icone verdi a contorno.
   - Scuro: usare sempre le `.scuro`; verificare che il disco abbia un filo di luce sul bordo (rim) per staccare dallo sfondo `#172140`.
   - Escluse dall'uso: `sfera-costi` (€) e `sfera-polimi` come marchio (vedi sezione 3).

5. **Icone piene bicolori nelle tessere e nella barra inferiore** (08/16/17 riga «Icone»; 28 «Iconografia»).
   - Tessera 40×40, raggio 12, tinta al 12-14% del colore, glifo 22-24 px pieno (`glifi/kit-blu`). Associazione *fissa* colore-significato (vedi sezione 4).
   - Barra inferiore: attiva = piena e blu, inattiva = contorno grigio `#6B7280`; sostituire manubrio e spade con il glifo «Quiz» (documento A/B/C) per Esercizi e il trofeo («Successo») per Sfide. Home resta la casa.
   - Contorno sottile solo per i comandi di sistema (indietro, chevron, cerca, chiudi, info).

6. **Gauge «82%» del kit B/C** (16 e 17, «Risultato / Probabilità»; 15 schermata «Sei a rischio?», solo la forma).
   - Arco spesso a estremità tonde, senza contorno; traccia `#E5E7EB` (scuro `#1E293B`); progresso in blu `#3B82F6 → #60A5FA`; sul capo dell'arco un piccolo orbe ambra `#F59E0B` con alone chiaro (è l'unico accento caldo, e dà il tocco «luminoso»); numero al centro in blu notte `#0F172A` (scuro: bianco), 800, 44-56 px.
   - Lo stato («Vicino», «Non superata») va nella pillola sotto, non nel colore dell'arco e del numero. Ora in home il 41% è ambra con numero marrone e contorno scuro intorno all'arco (aspetto datato, e il marrone non è in palette).
   - Evitare il testo «paura» presente nel mock 15 («Sei a rischio?»).

7. **Scheda con ombra morbida su sfondo `#F6F8FC`** (28 «Card esempio», 15 «Stile UI», 17 «Elementi UI»).
   - Chiaro: pagina `#F6F8FC`, scheda bianca, bordo 1 px `#E5E7EB`, ombra `0 4px 16px rgba(15,23,42,.06)`, raggio 16. Ora le tessere `#F1F4FB` su bianco si distinguono poco e danno l'aria di template.
   - Scuro: pagina `#0F172A`, scheda `#172140`, bordo `rgba(255,255,255,.06)`, nessuna ombra (la luce viene dal bordo).

8. **Fondi decorativi «Pattern & background»** (07, 28, 35, 40: macchia azzurra sfumata, stella-sagoma, arco sottile con scintillio).
   - Usare l'arco sottile e una macchia al 6-10% di opacità dietro le testate di Esito, stati vuoti, fine funnel. Raggio dell'arco: ampio, un solo tracciato per schermata. È già presente nell'hero e va portato anche lì.
   - Scuro: stessa forma ma `#3B82F6` al 10%, mai bianco.

9. **Pannelli di stato con cerchio-icona e titolo colorato** (16/17 «Stati e feedback»).
   - Già parzialmente fatto (la scheda «Non collegato» di NOI). Uniformare: cerchio 24 px pieno, titolo 14/700 nel colore semantico scuro, testo 13 `#4B5563`, sfondo tinta al 8-10%.

10. **Stepper numerato per i flussi corti** (16/17 «Progress indicator»: cerchi numerati con etichetta).
    - Solo per percorsi di 3-6 passaggi con nomi (iscrizione); il funnel di 12+ passaggi resta a segmenti. Priorità bassa.

---

## 3. Cosa NON copiare, e perché

- **Il kit rosso (08, 23, 50).** Duolingo dichiarato, macchie rosa, rosso come colore d'azione. In questa app il rosso è errore e pericolo. Non sono neanche tre opzioni: 23 e 50 coincidono.
- **Tutto ciò che parla di costi e di pagamento**: «Rischio economico» (euro con le ali), icona «Costo», sfera `sfera-costi`, passo «Pagamento» dello stepper, badge «Più scelto» / «Massima sicurezza» / «Consigliato», la schermata «Rischi di perdere circa 30€» (15). Contraddicono «niente monetizzazione» e creano urgenza che il progetto vieta.
- **«Sei a rischio? 82% non superare l'OFA»** (15) e la retorica di paura in generale: contraria al tono dichiarato e alla regola «niente urgenza finta».
- **Tagline «Studia oggi, sblocca il tuo domani»** (15): contiene «sblocca», parola vietata nei testi per l'utente. Il claim «Il tuo inglese, senza ostacoli» (07, 28, 40) è lecito ma è dei riferimenti, non dell'app attuale.
- **Foto di studenti e facciata «POLITECNICO DI MILANO» con insegna leggibile** (07 moodboard, 40, 15 «Atmosfera»): sono immagini generate; le didascalie parlano di «studenti reali e contesto Polimi». Sarebbero persone finte e una sede reale usata come marchio, con il sito che deve dire di non essere affiliato. Se serve un edificio, usare una foto vera con licenza o un'illustrazione senza insegna. Da controllare: nel banner attuale non c'è insegna leggibile, ma il file è comunque troppo debole (vedi sezione 5).
- **Lettering a mano «Small steps, big opportunities» / «From obstacles to opportunities»**: scritto da AI (con parti illeggibili, vedi «to be better than… Progress» in 15), in inglese nel prodotto italiano, richiederebbe un font esterno o testi come tracciati, e la regola vieta `<text>` negli SVG e font esterni nella demo. Al massimo come immagine di marketing, mai nell'interfaccia.
- **Merchandising e mock-up** (felpa, borsa, quaderno, borraccia, icona app con notifica rossa «1»): non servono a un sito gratuito; la notifica «1» sarebbe una notifica inventata.
- **Moodboard fotografico generale** (07 «Moodboard», 40 «Stile fotografico»): serve all'art direction, non a una PWA da 400 px.
- **Due stelle in un marchio, né due forme di stella**: i riferimenti mescolano 5 punte (icona) e 4 punte (wordmark, lettermark). Non copiare l'incoerenza.
- **Etichette storte generate dall'AI**: «AddiΘFA» (44), testi sovrapposti nelle tavole 28 e 35, «Quiz (A, B, C)» con lettere diverse fra i kit, elementi «extra» in blu duplicati. Sono errori di generazione, non scelte.
- **Il rosso nei pulsanti primari dei mock** (15, 28 «Rischio»).
- **Icone-ingranaggio, euro e catena come glifi decorativi dell'app**: l'ingranaggio sta bene nelle impostazioni, non come ornamento.

---

## 4. Regole d'uso del sistema visivo

### 4.1 Quale elemento, quando

| Elemento | Quando | Dimensione (mobile) | Note |
|---|---|---|---|
| **Illustrazione** (`kit-blu/illustrazioni`, `stati`) | Un risultato, uno stato o un inizio: benvenuto, esito, vuoto, successo, attesa, errore | 128-160 px (hero) | **Una sola per schermata.** Mai sotto 96 px. Centrata sopra il titolo, 24 px di distanza. Mai accanto a un'icona che dice la stessa cosa |
| **Sfera** (`kit-blu/sfere`) | Destinazione o sezione: Esplora, Profilo, benefit, intestazioni di hub | 40 px in elenco, 56-64 px in tessera, 96 px in testata di hub | Mai dentro una tessera quadrata tinta (è già un disco). Una per riga. Stesso spazio quadrato a sinistra, sempre |
| **Glifo pieno bicolore** (`glifi/kit-blu`) | Elemento di elenco o di impostazione con significato (studio, statistiche, quiz, email, profilo, info) | 22-24 px in tessera 40 px, raggio 12 | Colore fisso per significato (vedi 4.2) |
| **Icona a contorno** | Comandi di sistema: indietro, chiudi, cerca, chevron, info, menu | 20-24 px, tratto 1,75-2 px | Mai come illustrazione di un contenuto |
| **Nessuna immagine** | Schermate di lavoro: domanda del test, simulazione in corso, tabelle, elenchi lunghi | – | La domanda del funnel (02-funnel-02) è già giusta: solo testo e risposte |

### 4.2 Colore per significato (fisso in tutte le schermate)

Blu `#3B82F6` studio, informazione, azione · violetto `#8B5CF6` quiz e apprendimento · verde `#22C55E` successo e superato · ambra `#F59E0B` attenzione, tempo, premio (l'oro) · rosso `#EF4444` solo errore e «non superata». Mai assegnare un colore a una funzione solo per variare la schermata. In una stessa schermata, al massimo due tinte oltre al blu.

### 4.3 Spazi

- Margine laterale 16-20 px (ora 20-24: va bene, ma uguale in tutte). Fra schede 12 px, fra sezioni 24 px, interno delle schede 16 px.
- Blocco illustrazione: 16 px sopra, 24 px sotto (verso il titolo). Il titolo di pagina e l'illustrazione non stanno nella stessa riga.
- Pulsante principale in fondo alla pagina, 48-52 px di altezza, raggio 12-14; secondario a contorno.

### 4.4 Intestazioni di pagina

- **Radice di scheda (Home, Esercizi, Sfide)**: titolo 28/800 a sinistra, pulsante profilo a destra. Nessuna illustrazione sopra il titolo; l'eventuale illustrazione sta nella prima scheda.
- **Sottopagina** (Profilo, Esplora, FAQ, Badge, NOI): indietro + titolo 24/800. Se la pagina è un «hub» (Esplora), una sfera da 96 px sotto il titolo; per le altre, al massimo un'illustrazione da 72-96 px *a destra del titolo*, mai da 140 px in testa che spinge il contenuto fuori dallo schermo (FAQ oggi: 130 px di fumetti prima della ricerca).
- **Intestazione con icona e illustrazione insieme** (funnel-04: icona busta + titolo + carta d'identità piccola): una o l'altra. Per «La tua email» basta una sfera o una tessera, e il campo deve stare più in alto.

### 4.5 Stati vuoti

- Illustrazione 112-128 px, titolo 20/700, una riga di spiegazione 14 px grigia, **un** pulsante. Posizione a circa un terzo dell'altezza, non al centro esatto sopra la barra.
- Tono: la nuvola triste serve per errore e assenza di rete. Un elenco vuoto perché non si è ancora fatto nulla («Ultime sfide», «Amici») non è un fallimento: usare «Ricerca» (lente) o una versione neutra e un invito («Fai la prima sfida»).
- «Niente da vedere» con il solo pulsante «Indietro» non dice cosa è successo: serve la ragione in una riga.

### 4.6 Tema scuro

- Fondo `#0F172A` (oggi circa `#121A2E`, accettabile), scheda `#172140`, bordo bianco al 6%.
- Accento: `#60A5FA` per testi e linee, pulsante primario `#5B8DFF` con testo `#0F172A` (già così, va bene).
- Illustrazioni e sfere: sempre le `.scuro`, con le stesse luci calde piene. Non lasciare oggetti «di vetro» opachi (foglio quiz, carta, documento): dargli bordo chiaro `rgba(255,255,255,.18)` e riempimento blu `#243B6B`.
- Tessere colorate: tinta al 12% sopra la scheda, non sfondi opachi marrone, bordeaux e verde bosco (Esplora scuro: ambra e lilla diventano fango).
- Pulsante disabilitato: grigio-azzurro `#2A3A63` con testo `#8FA0C4`, non azzurro spento con testo blu notte.

---

## 5. Problemi dell'implementazione indipendenti dai riferimenti

Ordinati per gravità.

1. **Testata della landing trasparente: il contenuto passa sotto il logo** (01-landing-01, chiaro e scuro: «Senza limiti / Senza password» si leggono dietro il wordmark). Serve sfondo pieno o sfocatura con 85-90% di opacità e filo inferiore.
2. **Barra inferiore incoerente.** Il glifo «Sfide» è sempre più scuro del glifo «Esercizi» da inattivo (nero/bianco contro grigio): sembra uno stato bloccato (focus o hover). Inoltre «Home» risulta attiva in Profilo, Esplora, FAQ, Badge, NOI e nello stato vuoto, che non sono Home: l'utente perde il dove.
3. **Icone con significati incoerenti fra schermate.** La stessa funzione è `%` blu nella landing e `%` verde nel funnel; «Ripassi ciò che sbagli» è un punto esclamativo arancio nella landing e un mirino verde nel funnel; tre glifi quasi uguali (mirino, bersaglio concentrico, bersaglio con freccia) significano cose diverse (Punti deboli, Argomento, Obiettivi); nel funnel le quattro voci sono tutte verdi (verde = successo), ma nessuna lo è.
4. **Elenco del Profilo con tre tipi di elemento a sinistra nella stessa scheda**: fumetti (illustrazione senza tessera), bandiera (icona in tessera bianca), libro con bandiera (illustrazione). Stesso problema in Esercizi (tessere con icona a contorno sopra, illustrazioni da 40 px sotto: «Frasi» e «Prontuario»). A 40 px le illustrazioni perdono i dettagli (la bandiera sul libro, i raggi della lampadina) e non sono né icone né illustrazioni.
5. **Esercizi: arcobaleno di tessere.** Mirino arancio, fulmine ambra, cervello viola, bersaglio verde, tutti a contorno. Quattro tinte per quattro modalità non portano informazione.
6. **Esito (05-sim-esito):** una lancetta isolata sul lato destro dell'arco (soglia 25/30?) senza etichetta, un arco vuoto a 0/30, e sopra un'illustrazione del documento con la X rossa: due messaggi di fallimento più la pillola «Non superata». Per un esito 0/30 c'è molto più «bocciato» che «cosa faccio adesso». Un messaggio, un grafico, una azione.
7. **Funnel-04 (email):** icona busta in cerchio + titolo + carta d'identità da ~100 px (che racconta «verifica utente», non l'email) + ~450 px vuoti sotto il campo. Il pulsante non ha altra informazione intorno (consenso, perché serve): non è un problema di sola grafica, ma qui sembra una schermata non finita.
8. **Home, gauge:** arco ambra con contorno marrone, numero e titolo marroni, icona info piccola dentro l'arco; sotto una scheda «Vicino» con barre da 40 px, che non dice «vicino a cosa». Il bagliore dorato dietro l'orbe è la parte migliore e si perde nel contorno scuro.
9. **Scheda «Intelligente» (Esercizi):** illustrazione da 100 px in una scheda alta con molto vuoto laterale; l'etichetta «Intelligente» non spiega cosa farà.
10. **Landing mobile:** «Salta» da solo sulla riga sotto i tre elementi (orfano), icona ⓘ senza etichetta, sottotitoli dei benefit a 11 px (sotto i 12 px minimi per testo corrente), titolo con rottura «un passo / in più.» poco elegante, apostrofi dritti.
11. **Landing 1280 px:** la scheda «Ripasso su misura» è tagliata dal bordo destro; il gauge d'esempio è verde e con «Esempio» a 7 px, in colore e scala diversi dal gauge reale (ambra); si vede un'alone rettangolare chiaro in alto a destra dell'immagine; l'illustrazione ha qualche lato che svanisce in modo irregolare.
12. **Hero scuro:** vedi punto 3 della sezione 2. File con cornice nera, doppia esposizione, saturazione persa. È il difetto visivo più visibile del tema scuro.
13. **Banner edificio:** 936×472 px, ingrandito, artefatti, velo blu-seppia. Se viene mostrato a larghezza piena su 1280 px è molle. Sostituirlo con una foto reale a 2x, o toglierlo.
14. **Pulsante disabilitato in chiaro** (funnel-02 «Avanti»): testo bianco su azzurro pallido, contrasto circa 2:1; la funzione è chiara ma il testo è illeggibile. In scuro, testo navy su blu spento.
15. **Tessere «tono su tono»** (`#F1F4FB` su bianco, senza bordo): la gerarchia visiva fra pagina e scheda è debole; i testi secondari grigi scendono in contrasto quando la scheda è tinta (Esplora).
16. **Scuro, tessere tinte opache** di Esplora (bordeaux, bosco, marrone) e illustrazioni «di vetro» spente: la parte meno rifinita del tema.
17. **Stato vuoto «Niente da vedere»**: nessuna spiegazione, pulsante «Indietro» a tutta larghezza come azione primaria (è un'uscita, non un'azione).

### Cosa funziona e va protetto (per bilanciare)

- La domanda del funnel (02): pulita, risposte grandi, pulsante in fondo, progresso a segmenti, nessuna decorazione.
- I titoli: forti, con la seconda riga in blu; la gerarchia delle schermate è leggibile.
- La landing a 1280 px (hero, schede mobili a fianco, barra dei benefit): è l'immagine più vicina ai riferimenti.
- Il rosso riservato agli errori e le pillole «Non verificata» / «Non collegato»: oneste, coerenti con le regole del progetto, e migliori dei riferimenti.
- Le varianti `.scuro` di tutte le illustrazioni e sfere: un lavoro che i riferimenti non hanno.

---

## Riepilogo (8 righe)

1. I riferimenti sono migliori in: wordmark bicolore con «O» azzurra, sfere di vetro (44), cover scuro (40), icone piene bicolori, gauge pulito; l'implementazione è pari o migliore su palette, tipografia, contenuti onesti, varianti scure e leggibilità.
2. Voti: 07/28/35 logo 8-8,5 contro 5,5-6; 44 sfere 9 contro 6,5/5,5; 40 art direction 8,5 contro 7/5; kit B/C 8-8,5 contro 7/6,5; kit rosso 6; icona app 9,5.
3. Da prendere, nell'ordine: wordmark con una sola stella nella O; un'illustrazione da 128-160 px per schermata di stato; hero scuro blu notte rigenerato; sfere come icone-destinazione (Esplora, Profilo, benefit); glifi pieni al posto del contorno e barra inferiore senza manubrio e spade; gauge con arco blu, orbe ambra, numero blu notte; schede bianche con bordo e ombra.
4. Da non copiare: kit rosso (Duolingo), costi, pagamento, badge di urgenza, «sblocca», paura («Sei a rischio?»), foto AI di studenti e insegna Polimi, lettering a mano, merchandising, doppia forma di stella.
5. Il vero divario sono le regole d'uso: le sfere, i glifi e le illustrazioni scure esistono già nel repository, ma le schermate usano illustrazioni da 40 px, icone a contorno generiche e cinque tinte pastello insieme.
6. Regole proposte: illustrazione sola, 96 px minimo, per stato; sfera per destinazione (40-64 px); glifo pieno per elenco; contorno per soli comandi di sistema; colore fisso per significato; stato vuoto con motivo e un'azione.
7. Difetti indipendenti più gravi: testata della landing trasparente, barra inferiore con «Sfide» sempre più scura e «Home» attiva nelle sottopagine, significati delle icone incoerenti fra schermate, esito con doppio messaggio di fallimento, hero scuro con cornice nera e colori spenti, banner a bassa risoluzione.
8. Cosa non ho potuto provare: comportamenti, animazioni, schermate fuori elenco (ne ho viste solo due extra, Badge e NOI), il vuoto in fondo alla landing mobile (può dipendere dal reveal), e non ho misurato i contrasti con uno strumento: i valori citati sono stime a occhio.
