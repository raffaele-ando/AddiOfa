# Revisione indipendente B: il percorso di ingresso (funnel)

Revisore: product designer esterno. Base di giudizio: i 24 scatti `02-funnel-00 … 23` in telefono chiaro (400 px) e scuro (400 px), e gli scatti desktop chiari (1280 px, visti 00-09, 14, 21, 22, 23). Per i nomi dei file e degli elementi ho letto anche `app/src/components/Onboarding.tsx`, `app/src/components/ui.tsx` e `app/src/screens/landing/dati.tsx`. Non ho modificato nulla. I contrasti sono stimati a occhio dagli scatti: vanno misurati. Non ho potuto vedere tastiera aperta, telefoni piccoli (360x640, 375x667), tocchi reali.

Convenzione: «chiaro-NN» = `light-400/02-funnel-NN.png`, «scuro-NN» = `dark-400/02-funnel-NN.png`, «desk-NN» = `light-1280/02-funnel-NN.png`.

Mappa delle 24 schermate: 00 Se non superi · 01 Con AddiOFA · 02 D1 · 03 D2 · 04 Email · 05 D3 · 06 Come ci hai conosciuto · 07 D4 · 08 Scuola · 09 D5 · 10 Sede · 11 D6 · 12 Livello · 13 D7 · 14 Corso · 15 D8 · 16 Anno · 17 D9 · 18 Certificazione · 19 D10 · 20 OFA · 21 Consensi · 22 Calcolo · 23 Risultato.

---

## 1. Verdetto generale

Il percorso è pulito e coerente nei mattoncini (barra, freccia, bottone, righe): si vede che esiste un sistema. Le schermate di domanda sono leggibili e sobrie, e questa è la parte meglio riuscita. Il problema è che il sistema c'è nei componenti ma non nell'impaginazione: ogni schermata decide da sola dove mettere il vuoto, e il risultato è un percorso a «strati» (illustrazione sopra, scheda grigia, vuoto, bottone in fondo) che sa di modello ripetuto più che di prodotto disegnato. Quasi tutto è in grassetto, quindi non c'è gerarchia di peso; ci sono cinque accenti di colore in tre schermate; le illustrazioni sono generiche e di stili diversi. Il momento che conta di più, il risultato, è la schermata più debole: un enorme «2 %» color corallo, senza parola che lo spieghi, a uno studente di 18 anni che ha risposto giusto a 5 domande su 10, con un banner che dice «Hai margine» ma si veste da allarme. Va rifatto per primo. Poi il ritmo: 24 schermate, e fra l'ultima domanda e il risultato ce ne sono quattro di burocrazia (OFA, consensi, calcolo, «Risultato»). Il tema scuro è una traduzione corretta ma non rifinita: quadrati scuri attorno alle icone, bottone disattivato fangoso, tacche della barra quasi invisibili. Il desktop è un telefono allargato a 766 px, con il pulsante principale tagliato in 01.

| Superficie | Voto | Motivo in una riga |
|---|---|---|
| Telefono chiaro | **6 / 10** | Base solida e leggibile; vuoti, grassetto uniforme, illustrazioni generiche, risultato scoraggiante |
| Telefono scuro | **5 / 10** | Stessi difetti più quadrati scuri, bottone disattivato illeggibile, tacche e bordi troppo deboli |
| Desktop (1280) | **4 / 10** | Colonna di 766 px troppo larga, bottone tagliato in 01, grande vuoto laterale senza scopo |

---

## 2. Problemi in ordine di gravità

### BLOCCANTI

**B1. Risultato: il numero eroe scoraggia, non si spiega e contraddice il resto** (`chiaro-23`, `scuro-22`, `desk-23`; `Onboarding.tsx` case `'result'`, `Misuratore`, `MESSAGGI.basso`, `STILE_MESSAGGIO`)
Cosa non va, in ordine di impatto:
1. L'elemento più grande è «2 %» (o «1 %») in corallo, senza nessuna parola in pagina che dica «di cosa». L'etichetta «Probabilità» esiste solo come `aria-label`. Chi ha risposto 5/10 legge «2 %» come il proprio voto. Due righe sopra c'è «5/10»: la dissonanza è immediata.
2. Il commento a riga 64 di `Onboarding.tsx` dice «mai percentuali precise su così poche domande», e poi la percentuale è la cosa più grande della pagina. Con dieci domande l'intervallo è largo, la percentuale a una cifra è falsa precisione.
3. «Hai margine» è un eufemismo messo dentro un riquadro rosato con icona di errore (cerchio con punto esclamativo su cerchio corallo): il colore dice «allarme», il testo dice «tranquillo». La frase che davvero consola («Non è un giudizio su di te») sta nascosta dietro la «i».
4. «10-20» e «25» sono due pillole con icone senza etichetta (freccia doppia, righello). Nessuno capisce «25 di cosa».
5. Il pallino di partenza del misuratore, in `chiaro-23`, ha un secondo cerchio bianco/rosato sfalsato sotto: sembra un difetto di resa (in `scuro-22` e `desk-23` è pulito). Da verificare in Chromium.
6. Le tessere: «Grammatica 5/10» ripete «5/10» in testa; «A1 1/3» e «B1 3/5» non sommano a 5/10 perché A2 è nascosto (meno di 3 domande); in griglia a 2 colonne con 3 tessere resta un buco a destra (`chiaro-23`).
7. I «Da ripassare» sono 5-6 pillole tutte in corallo (colore dell'errore), in inglese grammaticale tecnico («Questions and Origins», «Quantifiers»), non toccabili.
8. Il bottone finale è «Avanti»: nel momento più importante non dice dove porta. Ed è attaccato alle pillole (nessun respiro), mentre altrove il bottone è lontano.
9. Sette blocchi impilati (titolo+dato, misuratore, pillole, banner, tessere, pillole, bottone): su un telefono 360x640 il bottone uscirà dallo schermo.

Correzione concreta (struttura, dall'alto):
- Titolo: «Il tuo punto di partenza» (24/30, peso 700), sotto, grigio 15/22: «Hai risposto bene a 5 domande su 10.»
- Eroe: la fascia di punteggio, non la percentuale. «**10–20** su 30» a 44/48 peso 700, colore testo (non corallo). Sotto, una barra orizzontale 0-30 alta 12 px con la fascia 10–20 in blu pieno, un tratto verticale alto 24 px a 25 con etichetta «soglia 25» a 13 px. Una riga: «Per superare servono 25. Ti mancano da 5 a 15 punti.»
- Frase rassicurante visibile, 15/22, grigio testo: «Con dieci domande la stima è larga: è un punto di partenza, non un giudizio su di te. Si stringe con le simulazioni.»
- Probabilità: una sola riga piccola sotto la barra, qualitativa e con la «i»: «Probabilità di superare oggi: bassa». Mai «2 %».
- Banner «Hai margine» eliminato (il titolo e la frase fanno il suo lavoro). Per la fascia bassa niente rosa/corallo: usare il blu di marca. Il corallo resta per le risposte sbagliate.
- «Da ripassare» diventa «Da dove cominciare»: massimo 3 argomenti, righe da 56 px (non pillole), nome + «2 errori» a destra, neutri (testo scuro su superficie), tutta la riga toccabile.
- Via le tessere Grammatica/A1/B1 dal risultato del funnel (si ritrovano in Home). Se si vogliono i livelli, una sola barra segmentata A1 · A2 · B1 con n/m sotto.
- Bottone: «Inizia il ripasso» (primario). Sotto, link testuale: «Prova una simulazione da 30 domande».
- Altezza totale: titolo+frase 90, eroe 130, rassicurazione 70, tre righe 3x56+2x8=184, bottone 56+footer. Sta in 640 px.
- Testi delle altre fasce, stessi principi: alto «Hai buone basi», medio «Sei vicino alla soglia», basso **«Si parte da qui»** (al posto di «Hai margine»).

**B2. Desktop: il bottone principale è tagliato dal bordo della scheda** (`desk-01`; `ui.tsx` `Screen`: `h-full … overflow-hidden` + contenitore interno `overflow-y-auto scrollbar-hide`)
A 1280x800 il bottone «Inizia» è tagliato a metà (si vede metà etichetta) e lo scorrimento interno non ha nessun indizio (scrollbar nascosta, nessuna sfumatura). Su un portatile 1366x768 con la barra del browser (viewport ~650) la stessa cosa succede anche su `desk-00`, `desk-21`, `desk-23`. Su desktop l'azione principale deve essere sempre visibile.
Correzione: footer del bottone **fisso in fondo alla scheda** (fuori dall'area che scorre), con sfumatura di 16 px sopra il contenuto; scheda alta `min(100dvh - 48px, 780px)`. Vedi §2 problema F1 per la colonna.

### FORTI

**F1. Desktop: telefono allargato, non una pagina pensata** (`desk-00 … desk-23`)
Scheda di 766 px su un fondo grigio-azzurro vuoto (257 px per lato). Le righe diventano barre da 702 px con 6-12 caratteri di testo a sinistra: l'occhio fa 600 px per collegare l'opzione al niente. I titoli da 24 px sembrano piccoli. In `desk-08` le quattro schede scuola sono larghe 345 px con l'illustrazione minuscola al centro e 240 px di vuoto sotto.
Correzione: colonna unica **max-width 480 px**, centrata, stessi spazi e dimensioni del telefono (così si progetta una volta sola); scheda alta come in B2. Il fondo diventa una quinta: marchio AddiOFA in alto a sinistra della pagina e, in basso, la riga «Progetto studentesco indipendente, non affiliato al Politecnico di Milano.» (13 px, grigio). Niente seconda colonna: non serve.

**F2. Vuoti verticali diversi in ogni schermata; il bottone è lontano dal contenuto** (quasi tutte)
Misure dagli scatti a 860 px di altezza (bottone a y 784):

| Schermata | Fine contenuto | Vuoto fino al bottone | Quota di schermo |
|---|---|---|---|
| chiaro-00 Se non superi | y 572 | ~210 px | 24% |
| chiaro-02 domanda (4 opzioni) | y 456 | ~328 px | 38% |
| chiaro-04 Email | y 318 | ~466 px | 54% |
| chiaro-08 Scuola (senza bottone) | y 522 | ~340 px | 40% |
| chiaro-10 Sede | y 592 | ~270 px | 31% |
| chiaro-12 Livello | y 410 | ~450 px | 52% |
| chiaro-16 Anno | y 357 | ~500 px | 58% |
| chiaro-18/20 Certificazione/OFA | y 284/358 | ~500/430 px | 50-58% |
| chiaro-23 Risultato | y 710 | ~0 px | (troppo pieno) |

Il percorso oscilla fra «mezza schermata vuota» e «schermata stipata», senza regola. La posizione del bottone cambia: y 784 quasi ovunque, y 744 in `chiaro-06` (per colpa di «Salta» sotto), assente nelle schermate a tocco. Il pollice deve ritrovare il bottone sempre nello stesso punto.
Correzione: il sistema unico di §2bis qui sotto.

**F3. Schermate «righe-icona»: leggibili male e a basso valore** (`chiaro-00`, `chiaro-01`, `scuro-00`, `scuro-01`; `Onboarding.tsx` `righe()` e `CONSEGUENZE` in `dati.tsx`)
- `chiaro-00`: riga = quadrato tinto 48 px + valore 24 px extra-bold («<25/30») + etichetta 14 px grigia **allineata all'estrema destra** («Non superi»). Valore ed etichetta distano ~200 px: si legge «<25/30 ………… Non superi» come due cose separate. «Solo esami», «Ogni tentativo» sono frammenti, non frasi: chi non conosce l'OFA non capisce «1° anno / Solo esami». E «Non superi» ripete il titolo «Se non superi». Tre ridondanze in una riga.
- `chiaro-01`: quattro righe identiche per peso (18 px extra-bold). Le icone (percentuale, mirino, righello, calendario barrato) non hanno relazione col testo che accompagnano: «Arrivi preparato» col righello, «Verso il 2° anno libero» col calendario con la X (che sembra «annullato»). Le icone non aggiungono informazione; i quadrati tinti occupano il 20% della larghezza della riga. «2° anno libero» è gergo da addetti.
- Nessuna riga ha una sottoriga di spiegazione: tutto ciò che spiega sta dietro la «i» (due «i» per schermata in 00, tre in 01 compresa quella di intestazione).
- I due indicatori «10» e «3 min» (`chiaro-01`): due cerchietti da 36 px con glifo minuscolo; «10» non dice «domande». «3 min» è inoltre una promessa non vera: solo le 10 domande, senza le 10 richieste di profilo.
Correzione: vedi §3 (testi) e §2bis (modello «Storia»): niente quadrati, riga = numero/segno + frase intera + sottoriga in tono tenue; etichetta sempre a sinistra, attaccata al valore.

**F4. Illustrazioni generiche, di stili diversi, senza legame col contenuto**
- `chiaro-01` bersaglio con freccia: icona di clip-art, grande (200 px) e senza relazione con «Con AddiOFA». In scuro ha il disco centrale bianchissimo: è l'oggetto più luminoso della schermata e batte il titolo (`scuro-01`).
- `chiaro-00` banconota con ali: l'unica con un'idea (il denaro che vola via); va tenuta.
- `chiaro-04` tessera con ritratto, 130 px, appesa fra titolo e campo: decorazione orfana, non aiuta a compilare, è rosata e sbiadita rispetto alle due prime (stile piatto e sfumato contro il 3D lucido).
- `chiaro-08` le quattro scuole: grafico a barre, mappamondo con aereo, libri **con la bandiera inglese** per Architettura (suggerisce che la scuola sia inglese), lampadina per Design (cliché). Gli oggetti non sono allineati: la lampadina sta ~30 px più in basso del grafico, il mappamondo più in alto; testi da 2, 3, 4 e 1 riga (`chiaro-08`: «Scuola di Architettura Urbanistica Ingegneria delle Costruzioni» va in 4 righe da 12 caratteri).
- `chiaro-22` documento con orologio viola: l'unico viola dell'intero percorso.
Regola: illustrazione solo nei momenti-racconto (arrivo e risultato), stesso stile (3D lucido blu), mai nelle domande di profilo. Le scuole diventano righe con la sigla (§2bis, §3).

**F5. Icone in quadrati scuri nel tema scuro** (`scuro-00`, `scuro-01`, `scuro-21`)
Nel chiaro il quadrato è più chiaro della scheda (tinta calda o verde pallida); nel scuro è più **scuro** della scheda: marrone quasi nero (pain), verde quasi nero (gain), blu quasi nero (soglia). Sembrano buchi rettangolari nella scheda, e sono 3-4 per schermata. In `scuro-00` il marrone fangoso accanto al blu navy è la combinazione meno elegante del percorso.
Correzione (vale per entrambi i temi): togliere il contenitore. Segno 24 px nel colore del tono (corallo 400, verde 400, blu 400 nel scuro), allineato a sinistra sulla stessa linea del testo; oppure, se si vuole un contenitore, in scuro = **stesso colore al 16% di opacità sopra la scheda (quindi più chiaro)** con bordo 1 px al 28%. Nella versione consigliata in §2bis le icone spariscono del tutto e restano numeri 1-2-3.

**F6. Tre sistemi di riga diversi** (`chiaro-02` vs `chiaro-10` vs `chiaro-08`)
- Domande/certificazione/OFA/provenienza: `ChoiceCard`, bordo chiarissimo, cerchio vuoto a sinistra, nessuna freccia.
- Sede/livello/corso: bottone con **bordo grigio scuro** pieno e chevron a destra, nessun cerchio.
- Scuola: schede quadrate con bordo scuro e illustrazione.
Tre pesi di bordo e tre «grammatiche» per dire la stessa cosa (scegli una voce). In scuro i bordi delle liste sono ben visibili, quelli di `ChoiceCard` quasi no (`scuro-02`: schede e fondo differiscono di pochissimo).
Correzione: un solo componente riga, altezza 64 (72 se due righe di testo), bordo 1 px colore `linea` (chiaro `#D5DAE6`, scuro `#33415E`), sfondo = superficie, nessun cerchio quando il tocco avanza da solo (usare chevron), cerchio/segno di spunta solo quando serve «Avanti».

**F7. Passi «Cosa fai al Poli»: cinque schermate, titolo doppio, striscia di pillole criptica** (`chiaro-08, 10, 12, 14, 16`)
- Doppia testata: icona tonda 52 px + «Cosa fai al Poli» (24 px) e subito sotto «La tua scuola» (24 px). Due titoli uguali impilati, e il primo non è una frase.
- La striscia di scelte fatte: «3I ✎», «Milano Leonardo ✎», «Triennale ✎», «Engineering Science ✎»: «3I» non lo conosce chi non è già al Poli; ogni pillola ha la matita (quattro inviti a modificare che competono col contenuto); da quattro pillole va a capo e **spinge giù il titolo di ~50 px** (`chiaro-16`: «Che anno?» sta più in basso di `chiaro-14`: «Il tuo corso»), quindi il contenuto salta fra una schermata e l'altra.
- «Anno» in `chiaro-16`: tre quadrati 112x84 appiccicati in cima, 500 px di vuoto sotto: la schermata più vuota di tutte.
- «Università partner» (`chiaro-10`) è una sede che non è una sede.
Correzione: ridurre a **una sola schermata «Il tuo corso»** (ricerca + elenco raggruppato Triennale / Magistrale / Ciclo unico; la scuola e il livello si ricavano dal corso). Anno: tre pillole «1° · 2° · 3°» in cima alla stessa schermata, **«1°» già selezionato** (non è un consenso, la preselezione è lecita e toglie un tocco). Sede: chiedere solo se cambia davvero qualcosa nell'app; altrimenti toglierla. Domanda per il progetto: oggi la sede cambia il risultato o i contenuti? Se no, via.

**F8. Consensi: tondini al posto di caselle, gergo mai spiegato, muro di testo** (`chiaro-21`, `scuro-20`, `desk-21`; `registrazione.tsx` `CampiConsensi`)
- Sono scelte indipendenti, cioè caselle; i cerchi dicono «scegline una». Chi tocca il primo si aspetta che gli altri si spengano.
- Qui compaiono per la prima volta NOI, ATLAS, Project, Agorà: quattro nomi mai presentati, in una schermata di consenso, cioè dove serve più fiducia. «Personalizzazione ATLAS» non vuol dire niente a uno studente.
- Il paragrafo sotto è una fitta di 70 parole a 12 px con la frase davvero importante («Sono tutti facoltativi: puoi continuare senza») nascosta in apertura.
- L'«Avanti» è attivo con tutto spento: bene, ma l'etichetta potrebbe dirlo («Continua senza» quando nulla è spuntato).
Correzione: caselle quadrate 24 px (angolo 6) con segno di spunta; titolo «Le tue scelte», sottotitolo visibile «Sono tutte facoltative. Puoi cambiare idea quando vuoi.»; testi in §3; informativa ridotta a 2 righe + link, il resto in un foglio apribile. Il contenuto giuridico va rivisto da chi cura la privacy: qui si propone solo la forma.

**F9. Ritmo: quattro schermate di burocrazia fra l'ultima domanda e il risultato** (vedi §4)
D10 → OFA → Consensi → Calcolo → «Risultato». Il picco emotivo (voglio sapere come sono andato) viene ritardato di quattro tocchi. Peggio: «Calcolo» (`chiaro-22`) è un finto caricamento con tutte le spunte già verdi e con la riga «Livelli 3 A1 · 2 A2 · 5 B1» che non è il livello dello studente ma la **composizione del quiz** (`Onboarding.tsx` case `'calcolo'`): si legge come «sono 5 B1».

### MEDI

**M1. Gerarchia tipografica «tutto in grassetto»** (tutte)
Titoli 700-800, opzioni 700, etichette 12 px 700, pillole 700, valori 800, bottone 700. Se tutto è in grassetto, il grassetto non segnala niente. In scuro il testo bianco 700 «sfarfalla» e pesa ancora di più (alone).
Scala proposta (Inter o attuale famiglia): titolo schermata 28/34 peso 700; domanda 24/32 peso 600; opzioni 17/24 peso 500; testo 16/24 peso 400; etichetta/etichetta-sopra 13/18 peso 500 (in scuro i pesi 400-600, mai 800); numeri tabulari. 700 solo per titolo e bottone.

**M2. Cinque colori d'accento in tre schermate** (`chiaro-00/01/22/23`)
Corallo (pain), verde (gain), viola (calcolo), ambra (tempo/soglia), blu (marca). Ogni schermata inventa la sua palette: effetto «generatore». Regola: blu = unico accento di marca (bottone, selezione, barra, numeri); verde/corallo **solo** per giusto/sbagliato; ambra solo per attenzione. Via il viola.

**M3. Barra di avanzamento che si ferma e due contatori** (`chiaro-01 … 21`)
13 tacche per 24 schermate: la barra sta ferma per le richieste (stesso riempimento di D2 e Email, di D3 e Provenienza ecc.), poi in `chiaro-22/23` è tutta piena prima del risultato. In più le domande mostrano «3/10» (tre numeri diversi in pagina). Sulle richieste manca ogni etichetta di posizione. Tacche vuote quasi invisibili in scuro (`#2A3550` su `#111A2E`, rapporto ~1,3:1) e deboli anche in chiaro. Vedi §4 per la proposta.

**M4. Il bottone disattivato non si legge, soprattutto in scuro** (`chiaro-02`, `scuro-02`; `ui.tsx` `PrimaryButton` `disabled:opacity-40`)
Disattivo = stesso bottone al 40%: in chiaro bianco su azzurro pallido (~1,7:1); in scuro **testo blu notte su blu spento** (~2,3:1), fangoso, e sembra un bottone attivo sbagliato. Correzione: disattivo = sfondo `superficie-2` + testo grigio `testo-tenue` + nessuna ombra; in scuro sfondo `#1B2745`, testo `#7C8AA8`. E soprattutto: sulle domande a risposta singola togliere il bottone (vedi M5).

**M5. Un tocco in più a ogni domanda e tre modelli di interazione diversi**
- Le domande del test: scegli, poi «Avanti» (2 tocchi x 10).
- Le liste (scuola, sede, livello, corso, anno): il tocco avanza da solo.
- Provenienza, certificazione, OFA: scegli + «Avanti».
- Email e consensi: modulo + «Avanti».
Poiché nel quiz non c'è correzione immediata, il secondo tocco non dà nulla. Regola unica: **scelta singola = il tocco avanza** (con evidenziazione di 100-120 ms, consentita dalle regole, e freccia «Indietro» per correggersi); modulo o scelta multipla = bottone. Così il bottone compare solo dove serve ed è sempre «azione», mai «conferma». Dieci tocchi in meno.

**M6. Hover «appiccicoso» sui telefoni** (`chiaro-09, 11, 13, 15` e `scuro-09`)
In diverse domande successive una riga (sempre alla stessa y) compare già scurita: è l'hover rimasto dal tocco precedente. Su un telefono vero un'opzione sembrerà pre-selezionata nella domanda dopo. Correzione: `hover:` solo dentro `@media (hover:hover)`; stato premuto con `:active`.

**M7. Email: tre cose sbagliate in una schermata** (`chiaro-04`, `scuro-04`, `desk-04`)
- Il distintivo ambra «⚠ Non verificata» appare **prima che l'utente abbia scritto qualcosa**: è un rimprovero a campo vuoto. Va mostrato solo dopo aver inserito un indirizzo valido, con tono neutro («Da verificare»).
- Nessuna ragione per cui la chiedi: in un funnel dove l'email è obbligatoria è il punto in cui si perde più gente. Serve una frase vera e breve (§3).
- «Avanti» è attivo a campo vuoto (diversamente da tutte le altre schermate), e il tocco produce solo un errore: renderlo disattivo fino a indirizzo valido, oppure mantenerlo attivo ovunque (scelta da fare, non da lasciare a caso).
- La tessera da 130 px fra titolo e campo è un riempitivo (vedi F4). E 466 px di vuoto sotto: con la tastiera aperta sparisce, ma si deve verificare che il bottone non resti coperto (dvh / `visualViewport`).

**M8. Provenienza: il bottone cambia posto per colpa di «Salta»** (`chiaro-06`)
«Avanti» a y 744 invece di 784, «Salta» a 13 px grigio sotto. Correzione: «Salta» diventa pulsante testuale **in alto a destra della TopBar** (allineato alla freccia, area 44x44), così il bottone resta dove sta sempre, e tocco su una voce = avanza.

**M9. Difficoltà delle domande senza una curva** (`chiaro-03 «My parents ___ live in London»`, `scuro-19 «He lives ___ London»` come ultima, `scuro-02 «We have been waiting for/since»` come prima)
L'ordine delle domande cambia da una prova all'altra e la difficoltà non ha un andamento: la prima può essere di livello B1, l'ultima di livello A1. Per «farlo finire con fiducia»: D1-D2 facili (due vittorie subito), D3-D8 miste crescenti, D9-D10 le più difficili o una media per chiudere senza sconfitta. Se l'algoritmo è adattivo, almeno le prime due sono fisse e facili.

**M10. Nessuna uscita onesta per «non lo so»** (tutte le domande)
Costringere a scegliere porta a risposte a caso, che sporcano la stima e frustrano. Aggiungere sotto le opzioni un link testuale «Non lo so» (14 px, tenue; conta come errata, non come salto). Riduce l'ansia e migliora il dato.

**M11. Tocchi e testo piccoli** (`ui.tsx` `TopBar`)
La freccia indietro ha area ~36 px (icona 28 + `p-1`): portare a 44x44. I numeri di domanda (`2/10`) sono a 14 px, grigi, con icona da 13 px: titolo di riferimento della posizione e il pezzo più piccolo della schermata. Le etichette «Non verificata», «Cerca» e le pillole stanno a 12 px.

**M12. «Ⓘ» per ogni cosa; due «i» sulla stessa schermata** (`chiaro-00`: in alto a destra e accanto a «Se non superi»)
Le due «i» hanno significati diversi (indipendenza del progetto; conseguenze) e lo stesso aspetto. La spiegazione onesta («AddiOFA non garantisce l'esito») è dietro un tocco. Correzione: l'avvertenza di indipendenza diventa riga visibile di 13 px sotto il bottone di `00` e nel fondo della pagina desktop; le spiegazioni brevi vengono portate in pagina come sottorighe; le «i» restano solo per i dettagli lunghi (calcolo della stima).

### RIFINITURE

**R1.** `chiaro-22/23`: senza freccia indietro la barra parte a x 58 invece di 64 e **scatta di 6 px** rispetto alle schermate prima. Usare sempre uno spazio di 44 px per il segnaposto.
**R2.** `chiaro-14` / `scuro-14`: l'ultima riga («Ingegneria Informatica») è tagliata dal bordo e non c'è sfumatura: poca indicazione che si scorre. Aggiungere sfumatura di 24 px in fondo all'elenco.
**R3.** Il trattino della domanda: `_____` in underscore, stesso peso del testo. Disegnare lo spazio vuoto come blocco in linea 56x2 px a metà x-height, colore azione. Si legge come «spazio da riempire», non come sbaglio di battitura.
**R4.** `chiaro-01`: l'illustrazione ha `my-3` e `minHeight 150`, quindi il titolo scende a y 325 mentre in `chiaro-00` sta a y 300: il titolo cambia posizione fra due schermate gemelle.
**R5.** Il segno di spunta nel cerchio di `ChoiceCard` è «trasparente» fino alla scelta: il cerchio vuoto è grigio chiaro con linea 1 px, appena percepibile; passare a 1,5 px `testo-tenue`.
**R6.** In scuro il rosso «2 %» e il banner marrone (`scuro-22`) sono gli oggetti più pesanti della pagina: vedi B1; se il banner sparisce, il problema sparisce.
**R7.** «Questions and Origins» (`scuro-22`): nome di argomento che non è chiaro nemmeno a un madrelingua. Rivedere i nomi degli argomenti nel data set per gli studenti.

---

## 2bis. Sistema di impaginazione unico per tutto il percorso

Principio: **il contenuto sta ancorato al bottone, il vuoto lo assorbe una zona flessibile in alto**; il bottone (quando c'è) sta sempre nello stesso punto; mai più di ~120 px di vuoto fra ultimo elemento e piè di pagina, tranne che nelle domande, dove si gestisce con l'ingrandimento delle righe.

**Griglia comune (telefono 360-430 px)**
- Margine laterale 20 px. Ritmo base 8 px. Scheda a tutta altezza (`100dvh`), nessuna scheda con bordi su telefono.
- **Testata fissa, 56 px**: freccia 44x44 a sinistra, barra di avanzamento 6 px (una sola barra continua, vedi §4), a destra «Salta» (solo dove la domanda è facoltativa) 44 px di altezza. La testata non cambia mai posizione né altezza.
- **Piè di pagina fisso**: bottone 56 px, raggio 16, padding laterale 20, sotto 16 px + area sicura; sopra, se serve, una riga di micro-testo 13/18 (rassicurazione o avvertenza) a 8 px dal bottone; sfumatura di 16 px sopra. Quando il tocco avanza da solo (liste), lo spazio del piè di pagina resta e ospita la micro-riga («Tocca una voce per continuare»); così non cambia mai l'asse verticale.
- Scala (§ M1): titolo 28/34 · domanda 24/32 · opzione 17/24 · testo 16/24 · etichetta 13/18.
- Spazi: testata→titolo 16; titolo→contenuto 20; righe 12; riga 64 (72 se due righe).

**Quattro modelli (e solo quattro)**
1. **Storia** (Perché, Risultato). Dall'alto: testata · **zona eroe flessibile** (altezza = spazio avanzato, min 140, max 280; dentro, l'illustrazione centrata e scalata a `min(240px, 80% della zona)`) · blocco testo (titolo, frase, ≤3 righe) · piè. Il vuoto di `chiaro-00` (210 px) viene assorbito dall'illustrazione, che cresce; le righe e il bottone restano attaccati (≤24 px).
2. **Domanda** (D1-D10, Certificazione, OFA, Provenienza). Testata · etichetta «Domanda 3 di 10» (13 px) · domanda 24/32 · opzioni (riga 68, che sui telefoni alti cresce fino a 80) · link «Non lo so» · spazio · piè. Il vuoto che resta in fondo (~180-220 px su 860) è accettabile perché sopra al bottone c'è la micro-riga e perché la domanda è il solo contenuto.
3. **Lista** (Corso). Testata · titolo · pillole anno · ricerca · elenco a scorrimento con sfumatura finale · nessun bottone.
4. **Modulo** (Email, Consensi, OFA+Certificazione). Testata · titolo · sottotitolo · campi · spazio · piè.

**Riga unica**: sfondo superficie, bordo 1 px `linea`, raggio 16, altezza 64, testo 17/24 peso 500, a destra chevron (lista) o niente (domanda). Selezionata: bordo azione 2 px + sfondo `azione-tinta`.

**Righe «racconto» (Perché)**: nessuna scheda. Numero in cerchietto 28 px (blu 12% con numero blu 700) o segno di spunta, titolo di riga 17/24 peso 600, sottoriga 15/22 `testo-tenue`; separatori 1 px. Nessun quadrato tinto, nessuna icona decorativa.

**Tema scuro (valori di partenza)**: sfondo `#0F1729`; superficie riga `#17223D` (non meno di 4 punti di luminosità sopra lo sfondo); bordo `#33415E`; testo `#EAF0FA` peso 600; testo tenue `#9AA8C4`; azione `#6C9CFF`, testo su azione `#0B1226`; tacca vuota `#3A4767`; disattivo come in M4. Illustrazioni: la variante a aloni traslucidi ovunque, e il bersaglio senza bianco puro (anelli `#C9D6EE`).

---

## 3. Testi schermata per schermata

Regole di tono: dare del tu; frasi intere con verbo; niente gergo di ecosistema prima di averlo spiegato (ATLAS, NOI, Agorà, Project, «3I»); niente «Gratis/Prova/presto/in arrivo/beta» (CLAUDE.md); niente promesse non verificabili («3 min»).

| # | Ora | Problema | Proposta (pronta da incollare) |
|---|---|---|---|
| 00 | Titolo «Se non superi»; righe «<25/30 · Non superi», «~30 € · Ogni tentativo», «1° anno · Solo esami»; bottone «Avanti» | Frammenti, ridondanza, non dice cosa è l'OFA, parte da una minaccia | **Fusa con 01 in una sola schermata «Perché».** Titolo: «Per togliere l'OFA servono 25 risposte giuste su 30.» Sottotitolo: «Se non ci arrivi rifai il test (circa 30 € a tentativo) e, finché l'OFA resta, nel piano di studi puoi inserire solo esami del 1° anno.» Rubrica sotto: «Con AddiOFA»: **1** «Vedi a che punto sei» · sotto «Dieci domande e una stima onesta, con il suo margine d'errore.» **2** «Ripassi ciò che sbagli» · sotto «Solo gli argomenti in cui hai perso punti.» **3** «Arrivi preparato» · sotto «Simulazioni da 30 domande in 15 minuti, come il test vero.» Micro-riga sopra il bottone: «Non garantiamo l'esito: ti aiutiamo a prepararti.» Bottone: **«Inizia le 10 domande»**. Sotto, 13 px: «Progetto studentesco indipendente, non affiliato al Politecnico di Milano.» |
| 01 | «Con AddiOFA»; 4 righe; chips «10» «3 min»; bottone «Inizia» | Righe uguali, icone senza legame, gergo «2° anno libero» | Assorbita in 00. Se si tiene separata: titolo «Come funziona», 3 passi 1-2-3 come sopra; meta: «10 domande · meno di 5 minuti»; bottone «Inizia le 10 domande». «Verso il 2° anno libero» → «Piano del 2° anno senza limiti» (solo nella «i», non fra le promesse). |
| 02-… (D1-D10) | «1/10» + domanda + 4 opzioni + «Avanti» | Nessuna istruzione, contatore minuscolo, nessuna uscita «Non lo so» | Etichetta: «Domanda 3 di 10». Prima domanda, sotto la domanda, 14 px tenue: «Scegli la parola o l'espressione che completa la frase.» Link sotto le opzioni: «Non lo so». Con tocco che avanza il bottone sparisce; all'ultima domanda: «Vedi il risultato». |
| 04 | Titolo «La tua email» + icona; etichetta «Email PoliMi» + distintivo «Non verificata»; «Avanti» | Il distintivo accusa a campo vuoto; manca il perché | Titolo: «La tua email PoliMi». Sottotitolo: «Ci serve per creare la tua iscrizione. Le email di novità le scegli tu nel passo dopo.» Etichetta: «Email PoliMi». Segnaposto: «nome.cognome@mail.polimi.it». Aiuto sotto il campo (13 px): «Ricaviamo il tuo nome da qui.» Distintivo solo con indirizzo scritto: «Da verificare». Errore (dopo il primo tentativo): «Controlla l'indirizzo: deve essere la tua email PoliMi.» Bottone: «Continua». |
| 06 | «Come ci hai conosciuto?» + 4 voci + «Salta» | Va bene; «Salta» è sotto il bottone | Titolo invariato; sottotitolo «Ci aiuta a capire dove farci trovare.» Voci: «Gruppo o chat» · «Instagram» · «Amici» · «Altro». «Salta» in alto a destra. Meglio ancora: spostarla dopo il risultato (vedi §4). |
| 08 | «Cosa fai al Poli» + «La tua scuola» + 4 schede | Titolo doppio; nomi in 4 righe; sigle ignote | Una sola schermata «Il tuo corso» (vedi sotto); per chi serve ancora la scuola, righe: «Ingegneria Industriale e dell'Informazione · 3I», «Ingegneria Civile, Ambientale e Territoriale · ICA», «Architettura, Urbanistica, Ingegneria delle Costruzioni · AUIC», «Design». |
| 10 | «La sede» + pillole «3I ✎» | Sigla ignota; «Università partner» | Se la sede resta: titolo «Dove segui le lezioni?», voci «Milano Leonardo», «Milano Bovisa», «Cremona», «Lecco», «Piacenza», «Altra sede». |
| 12 | «Il livello»: Triennale, Ciclo unico, Magistrale | Ricavabile dal corso | Eliminato: i corsi sono raggruppati per «Laurea triennale · Laurea magistrale · Ciclo unico». |
| 14 | «Il tuo corso» + «Cerca» + elenco | Elenco lungo senza guida | Titolo: **«Che corso frequenti?»**. Pillole «Anno: 1° · 2° · 3°» (1° scelto). Ricerca, segnaposto: «Cerca il tuo corso». Sotto l'elenco: «Non trovo il mio corso». |
| 16 | «Che anno?» | Pillole di scelte precedenti, 500 px di vuoto | Eliminato come schermata (vedi 14). |
| 18 | «Certificazione?» + Sì/No | Titolo senza verbo, la «i» spiega | Con OFA nella stessa schermata. Domanda 2: «Hai una certificazione d'inglese?» Aiuto sotto: «Per esempio Cambridge, IELTS o TOEFL.» Voci: «Sì» · «No». |
| 20 | «OFA di inglese?» + Sì/No/Non so | Idem | Domanda 1: **«Hai l'OFA di inglese?»** Aiuto: «Se non sei sicuro, scegli “Non so”: puoi prepararti lo stesso.» Voci: «Sì» · «No» · «Non so». Titolo schermata unica: «Dove sei partito». Bottone: «Continua». |
| certInfo (se «Sì») | «Forse sei esente» / «Mi alleno» / «Vai all'app» | «Esente» è gergo; i due bottoni non spiegano la differenza | Titolo: «Forse non devi fare il test». Testo: «Se la tua certificazione è tra quelle accettate dal Politecnico, potresti essere esentato. Controlla l'elenco e i livelli minimi sul sito del tuo corso.» Primario: «Mi preparo lo stesso». Secondario: «Vai all'app». |
| 21 | «Consensi» + 3 schede con tondini + paragrafo | Gergo, tondini, muro di testo | Titolo: «Le tue scelte». Sottotitolo: «Sono tutte facoltative. Puoi cambiare idea quando vuoi.» Caselle: «**Compari nella classifica** — con il nome utente e i tuoi punteggi. Puoi uscire quando vuoi.» · «**Ripasso su misura** — usiamo i tuoi risultati per decidere cosa farti ripassare per primo.» · «**Novità per email** — ti scriviamo all'indirizzo che hai indicato, solo per novità del progetto.» Informativa breve (13 px): «Nome ed email PoliMi, percorso di studi e provenienza servono a creare la tua iscrizione. Restano su questo dispositivo finché non c'è connessione, poi vanno al servizio del progetto. Come li usiamo.» (link «Informativa completa»). Bottone: «Continua senza» quando nulla è spuntato, «Continua» altrimenti. Revisione giuridica del testo da fare a cura del progetto. |
| 22 | «Calcolo» + 3 righe già spuntate + «Risultato» | Finto caricamento, «Livelli» fraintendibile | Eliminata. Se resta: uno spinner con la riga «Sto contando le risposte» per al massimo 1,2 secondi, poi avanza da solo. |
| 23 | «Risultato», «5/10», misuratore «2 %», «10-20», «25», «Hai margine», tessere, «Da ripassare», «Avanti» | Vedi B1 | Titolo: «Il tuo punto di partenza». Frase: «Hai risposto bene a 5 domande su 10.» Eroe: «10–20 su 30». Barra con «soglia 25». «Ti mancano da 5 a 15 punti.» Rassicurazione: «Con dieci domande la stima è larga: è un punto di partenza, non un giudizio su di te.» Probabilità: «Probabilità di superare oggi: bassa» (con «i»). Titolo sezione: «Da dove cominciare». Bottone: **«Inizia il ripasso»**; link: «Prova una simulazione da 30 domande». Titoli fascia: alto «Hai buone basi» · medio «Sei vicino alla soglia» · basso «Si parte da qui». |

---

## 4. Ritmo del percorso

**Com'è oggi (24 schermate):** 2 di racconto · 10 domande · 10 richieste (email, provenienza, 5 passi del Poli, certificazione, OFA, consensi) · calcolo · risultato. Rapporto 10 : 10 : 4: i dati dell'utente pesano quanto le domande del test, e il racconto iniziale quanto il calcolo finale. Il «3 min» promesso non regge con 24 tocchi.

**Cosa pesa di più:** email (chiede un dato personale a freddo, a metà quiz), consensi (testo lungo, gergo), i cinque passi del Poli (cinque schermate per un dato derivabile), il blocco finale di burocrazia, il racconto doppio all'inizio.

**Proposta: 16 schermate**

| # | Schermata | Tipo | Nota |
|---|---|---|---|
| 1 | Perché (00+01 fuse) | Storia | Una sola schermata di apertura; meno di 20 secondi |
| 2-4 | Domande 1-3 | Domanda | Le prime due facili: due vittorie |
| 5 | Email | Modulo | Dopo la terza: l'utente ha già ricevuto qualcosa (3 risposte date) |
| 6 | Le tue scelte (consensi) | Modulo | Subito dopo l'email, perché la riguardano |
| 7-8 | Domande 4-5 | Domanda | |
| 9 | Che corso frequenti? (corso + anno) | Lista | Sostituisce scuola, sede, livello, corso, anno |
| 10-11 | Domande 6-7 | Domanda | |
| 12 | Dove sei partito (OFA + certificazione) | Modulo | Due piccole domande sì/no nella stessa schermata |
| 13-15 | Domande 8-10 | Domanda | Tutta la burocrazia è già chiusa |
| 16 | Risultato | Storia | Senza «Calcolo»: eventualmente 1,2 s di spinner su `22`, poi avanza |

Fuori dal percorso: «Come ci hai conosciuto?» dopo il risultato, come domanda leggera e saltabile, perché non serve all'utente e non va messa prima del suo premio. Se il progetto la vuole nel funnel, in posizione 5-6 insieme all'email (stessa schermata con 4 pillole sotto il campo).

Perché alternare e non raggruppare: l'alternanza alleggerisce il test, ma ogni cambio di registro costa. Con 16 schermate le richieste diventano 5 (di cui due a coppia) e le domande restano dieci: il test torna a sembrare un test, le richieste a sembrare brevi pause. Il blocco finale (D8-D10 → risultato) deve essere **solo domande**: l'utente deve sentire «ci siamo».

**Far sentire il progresso**
- Una sola barra **continua** alta 6 px (non 13 tacche), larghezza = schermate completate / totali (16, 15 se si salta qualcosa). Colore azione su `tacca` (chiaro `#D5DAE6`, scuro `#3A4767`).
- Etichetta sopra il titolo: sulle domande «Domanda 4 di 10»; sulle richieste «Su di te» (così si capisce che non pesa sul punteggio). Niente doppio contatore.
- Due frasi di tappa, statiche, in 13 px accanto all'etichetta: alla domanda 5 «Sei a metà», alla domanda 8 «Ultime tre». Nessuna animazione.
- Dopo l'email e dopo il corso, nessun festeggiamento: bastano il cambio di etichetta e l'avanzare della barra.
- Il risultato deve arrivare subito dopo D10, senza nuove richieste in mezzo.

---

## 5. Differenze chiaro / scuro

| Punto | Chiaro | Scuro | Giudizio e correzione |
|---|---|---|---|
| Quadrati attorno alle icone (`00`, `01`, `21`) | Tinta calda/verde/blu più **chiara** della scheda | Marrone/verde/blu quasi nero, più **scuro** della scheda | Peggiora: sembrano buchi. Togliere i contenitori (F5), o in scuro usare il colore al 16% sopra la scheda |
| Bottone disattivo (`02`…) | Bianco su azzurro pallido | Blu notte su blu spento (testo scuro su fondo medio) | Illeggibile in scuro (M4) |
| Tacche vuote della barra | `#D5DAE6` su bianco, ~1,4:1 | `#2A3550` su `#111A2E`, ~1,3:1 | Quasi invisibili in scuro: `#3A4767` e barra continua |
| Distanza scheda/fondo | Schede grigio-azzurro su bianco, ok | Scheda `#17223D`-ish su `#111A2E`: quasi uguali; bordi delle domande invisibili | Alzare le superfici in scuro e dare bordo 1 px visibile alle righe |
| Peso del testo | 700 su bianco, leggibile | 700 bianco su blu notte: alone, pesa il doppio | Scendere a 500/600 in scuro (M1) |
| Illustrazioni | Bersaglio ben integrato | Il disco bianco puro è l'oggetto più luminoso (`scuro-01`); banconota con alone traslucido OK (`scuro-00`) | Una variante scuro per tutte, senza bianco puro |
| Banner risultato (`scuro-22`) | Rosa pallido leggero | Marrone pesante: l'oggetto più grande e più cupo | Via il banner (B1) |
| Pillole «Da ripassare» | Pesca su rosato | Pesca su marrone: corretto ma cupo | Neutre (B1) |
| Link «Informativa completa» | Blu sottolineato | Azzurro sottolineato, ottimo | Tenere |
| Etichetta «Non verificata» | Ambra su giallino | Ambra su marrone scuro | Coerente; il problema è il quando (M7), non il tema |
| Barra superiore / freccia | Grigio-blu | Grigio-blu più chiaro | Coerente |

In generale: il tema scuro ha preso le stesse scelte del chiaro invertendo i valori, invece di essere pensato (profondità, bordi, pesi). Un tema scuro buono qui è più contenuto: meno riquadri, più linee 1 px, testi più leggeri.

---

## 6. Cosa funziona e va tenuto

- **L'impalcatura:** freccia indietro + barra in alto + titolo a sinistra + bottone a tutta larghezza: chiara, prevedibile, mobile-first.
- **Le domande** (`chiaro-02` e seguenti): testo sobrio, un solo elemento per schermata, nessuna illustrazione a distrarre. Le opzioni sono grandi e facili da colpire. Questo è lo standard a cui portare il resto.
- **Il tocco che avanza da solo** nelle liste (scuola, sede, livello, anno): giusto, va esteso alle domande.
- **L'idea di alternare** domande e richieste: ha senso e va tenuta, con meno richieste.
- **La ricerca nel corso** (`chiaro-14`): indispensabile con 30+ voci.
- **Il tono dei Consensi:** nulla preselezionato, «sono tutti facoltativi», link all'informativa. Onestà reale; si migliora solo la forma.
- **«Salta»** come possibilità esplicita sulle domande non essenziali.
- **La banconota con le ali** (`00`): l'unica illustrazione che racconta qualcosa; tenerla.
- **Il marchio AddiOFA** in apertura e la sua leggibilità in chiaro e scuro (`00`).
- **Il blu pieno del bottone** e i raggi di 16 px: identità riconoscibile.
- **Numeri tabulari e l'idea di «Da ripassare»** nel risultato: la sostanza è giusta (cosa fare adesso), va solo ordinata e addolcita.
- **Onestà della stima:** il progetto sa che con dieci domande l'intervallo è largo e lo dice; va portato dall'ombra della «i» in pagina.

---

## 7. Le cinque modifiche che alzerebbero di più la qualità percepita

1. **Rifare la schermata del Risultato (B1).** Fascia di punteggio contro soglia al posto della percentuale eroe, frase rassicurante visibile, nessun banner d'allarme, tre argomenti «Da dove cominciare» toccabili, bottone «Inizia il ripasso». È il momento in cui l'utente decide se fidarsi: oggi lo perde.
2. **Adottare i quattro modelli di impaginazione (§2bis).** Testata e piè fissi, zona eroe flessibile che assorbe il vuoto, una sola riga, una sola scala tipografica con il grassetto riservato a titoli e bottone. Risolve da solo vuoti, bottone staccato, righe incoerenti e tre quarti dell'aspetto «da generatore».
3. **Portare il percorso da 24 a 16 schermate e chiudere tutta la burocrazia prima della domanda 8.** Racconto in una schermata; scuola/sede/livello/corso/anno in una; OFA+certificazione in una; «Calcolo» tolto; «Come ci hai conosciuto?» dopo il risultato. Tocco che avanza da solo anche sulle domande. Dalla D10 al risultato: un tocco.
4. **Togliere quadrati, icone decorative e illustrazioni generiche; riscrivere i testi senza gergo.** Righe numerate 1-2-3 con frasi intere, illustrazione solo in apertura e nel risultato, tutte dello stesso stile; ATLAS/NOI/Project/Agorà non compaiono prima di essere spiegati; consensi con caselle, email con il suo perché, nessun distintivo «Non verificata» a campo vuoto. Nel tema scuro: superfici più alte, bordi visibili, bottone disattivo leggibile, pesi più leggeri.
5. **Desktop: colonna unica da 480 px, piè di pagina fisso, avvertenza di indipendenza visibile.** Il bottone non viene più tagliato (B2), le righe non diventano barre da 700 px, il fondo smette di essere un vuoto.

Prove da fare dopo le modifiche (non fatte in questa revisione): 360x640 e 375x667 con tastiera aperta sull'email; contrasti misurati (testo disattivo, tacche, bordi in scuro); schermate a 320 px con testi in 4 righe; `prefers-reduced-motion` sull'unico spinner dell'interludio.
