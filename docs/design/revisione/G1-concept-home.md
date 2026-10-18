# G1. Concept contro Home implementata: revisione indipendente

Revisore esterno. Visti: 7 concept (cartella `grafica/brand/concept/`: 14, 03, 39, 21, 33, 01 e 11) e la Home implementata a 400 px (chiaro e scuro) e a 1280 px (chiaro e scuro). Ho letto anche il codice di `Menu.tsx` e dei componenti in `app/src/components/home/` e due anteprime già presenti in `docs/lavoro/extra/illustrato/home/` per vedere ciò che sta sotto la piega. Gli screenshot a 400 px sono ritagliati al primo schermo (860 px): Simulazione e Andamento li ho giudicati dalle anteprime, non da una pagina intera. I testi e i numeri dei concept (rischio, 82 %, percorsi, euro, streak) sono ignorati: giudico struttura, gerarchia, spazi, tipografia, colore, illustrazione, rappresentazione dei dati.

Misure: nei concept ho convertito i pixel alla larghezza di 390 (14 e 03 sono larghi 760, 39 è 738, 21 è 625, 33 è 749); nella Home uso i px reali a 400. Le dimensioni dei concept sono stime a occhio, con margine di circa 10 %.

---

## 0. Risposta in una riga

Il cliente ha ragione a metà. Sul **primo schermo** (misuratore, fascia, pulsante) la Home è già quasi il concept 14: stessa geometria, e nello stato verde è altrettanto bella. Dove i concept sono **decisamente meglio** è tutto il resto: la fascia di stato dice qualcosa, c'è una carta «prossimo passo» che spiega cosa si sta per fare, c'è l'elenco delle aree deboli, la scala tipografica ha tre livelli veri, gli spazi respirano. La Home implementata è meglio dei concept su onestà dei dati, tema scuro (i concept non ne hanno), desktop (i concept non ne hanno), simulazioni reali e contrasti verificati.

---

## 1. Verdetto concept per concept

Scala: voto 1-10 del solo disegno (struttura, gerarchia, tipografia, colore, dati), non dei contenuti inventati.

### 14 · home-rischio-alto: **migliore** (8,5)
È il modello da cui la Home è stata costruita (il codice cita «geometria del concept 14»), quindi sul misuratore, sulla distanza fascia-pulsante (9 px) e sul pulsante da 60 px siamo pari. Il concept vince su tre punti. (a) La carta di stato è alta circa 80 px, ha un tondo rosso con «!» da 40 px, un titolo da 17 px e due righe di spiegazione: dice perché sei lì e cosa fare; la fascia della Home è alta 62 px e contiene una sola parola. (b) Sotto il pulsante c'è un titolo di sezione da circa 19 px a 37 px di distanza dal pulsante, poi una sola carta ben fatta («Il tuo prossimo obiettivo»: tessera, categoria in maiuscolo, titolo, barra da 6 px, contatore); la Home ha titoli da 15,5 px a 24 px di distanza e tre righe identiche. (c) Il blocco finale (3 punti con valore sotto) è leggero, su fondo bianco, con un filo sotto il primo punto. Il punto debole del concept: l'ultima sezione è tutta fittizia (82, 62, 28 %).

### 03 · home-rischio-singola: **migliore ma di poco** (8)
Come il 14 con in più un titolo «Il tuo rischio OFA (i)» e una riga guida sopra il misuratore, e il grafico finale dentro una carta tenue («Il tuo impatto»). Il titolo dà un punto di partenza alla pagina ma costa circa 60 px di altezza e duplica quello che il numero grande già dice; la carta intorno al grafico invece è una buona idea (il grafico non galleggia). Leggermente sotto il 14 perché «Il tuo impatto» è un nome che non spiega cosa si vede e il misuratore si abbassa fuori dal primo schermo.

### 39 · home-fattori: **peggiore come insieme, migliore in tre pezzi** (6,5)
Troppa roba: misuratore dentro una carta, chip, avviso, pulsante, griglia 2×2 di aree, obiettivo con anello, lezione, due mini-carte (streak e progressi), citazione. Nove carte in 1670 px, tutte con lo stesso peso: dopo il pulsante la gerarchia sparisce, le didascalie scendono a 11 px e le aree in griglia 2×2 (barra 70 px) sono troppo piccole per essere lette. Ma contiene tre pezzi da prendere: il **chip di variazione** in alto a destra (freccia + valore + «rispetto alla prima stima»), la **carta lezione consigliata** (titolo, durata con orologio, pulsante interno) e l'idea di raggruppare misuratore + avviso + pulsante come un solo blocco. Da non prendere: streak, anello obiettivo, citazione, mini-carte progressi.

### 21 · home-dettaglio-rischio: **migliore** (8)
Il miglior ordine di lettura dopo il 01: misuratore, avviso, pulsante, **elenco «Fattori principali»** (un'unica carta a una colonna: icona, nome, barra, percentuale a destra, chevron, filetti fra le righe), poi suggerimenti, poi percorso. L'elenco a una colonna è la rappresentazione migliore di «dove sono debole» in tutta la raccolta: barre larghe 160 px a 390 di larghezza, leggibili anche da vicino. Difetti: le percentuali stanno più in basso del nome (disallineate), la fila orizzontale «Come ridurre il rischio?» è tagliata a destra con testi troncati (cattiva affordance), il percorso a tre cerchi vuoti dice quasi niente.

### 33 · home-rischio-b: **migliore** (8,5)
Ha la carta che alla Home manca di più: **«Prossimo passo»**. Dentro una sola carta: titolo piccolo in maiuscolo, titolo grande «Future tenses» (circa 24 px, ExtraBold), una riga di meta con icone (tipo, durata, effetto), una frase, il pulsante interno a larghezza piena. Mostra cosa succede quando si preme. Il misuratore senza titolo è pulito, e il grafico «Il tuo percorso» è dentro una carta con «Vedi tutti». Difetti: la carta è tinta di rosa (il colore di stato «rischio alto» è passato sulla carta della lezione e la fa sembrare un allarme); la (i) isolata in alto a destra è orfana; «Il tuo progresso» con barre crescenti è un riempitivo.

### 01 · home-rischio-tre-stati: **migliore** (9)
Il più pulito e il più utile come sistema. Struttura fissa (saluto, misuratore, carta di stato con icona-tonda, «Cosa puoi fare ora?», pulsante) e **tre stati che cambiano colore, icona, frase e verbo del pulsante** (Inizia / Continua / Fai una simulazione). Il pulsante che cambia con lo stato è la cosa più intelligente di tutta la raccolta: nello stato verde la Home propone un'altra azione. Il giallo è morbido, senza contorno scuro. Come Home è povero (poi non c'è nient'altro), ma come disegno del primo schermo è il riferimento.

### 11 · home-rischio-tre-stati-b: **pari o leggermente peggiore** (7,5)
01 più elenco aree, carta «piano» e carta secondaria, nei tre stati. Utile per vedere come l'elenco aree cambia colore da rosso a ambra a verde (confermando il coding a tre fasce) e come la carta secondaria cambia ruolo con lo stato. Ma è denso (testi da 10-11 px, tre carte dopo il pulsante con peso uguale) e il saluto del terzo stato va a tre righe. Sotto il 01.

### Voti finali
- **Miglior concept: 01 = 9/10** (come sistema del primo schermo); come Home completa il migliore è il **33 (8,5)**, con l'elenco aree del 21 aggiunto.
- **Home implementata: 6,5/10 chiaro, 6/10 scuro.**
  - Perché 6,5 e non meno: il misuratore (specie verde) è all'altezza del concept; la struttura è onesta; i contrasti sono verificati; c'è una carta Simulazione vera.
  - Perché non di più: fascia di stato muta, pulsante «Continua» senza oggetto, tre righe uguali a 0/N come unico contenuto sotto il pulsante, nessuna area debole, scala tipografica piatta, desktop sprecato, stato ambra sporco.
  - Perché il scuro è mezzo punto sotto: fascia ambra come lastra marrone con filo, marcatore del misuratore con anello blu notte (sparisce nel fondo), tracce e barre quasi invisibili.

---

## 2. Dove la Home implementata è migliore o equivalente (per onestà)

| Punto | Esito |
|---|---|
| Misuratore: geometria, tacche, alone, numero da 42 px | **Pari** al 14. Nello stato verde (87 %, anteprima) è bello quanto il concept. |
| Stati e colori a tre fasce | **Pari**: la logica è la stessa del 01 (corallo, ambra, verde). |
| Contenuto vero | **Migliore**: concept con 82/62/28 % inventati; qui solo punti misurati, «Nessuna stima» onesto, vuoto onesto del grafico. |
| Tema scuro | **Migliore per esistenza** (i concept non hanno scuro); da rifinire (punto 5). |
| Desktop | **Esiste** (i concept no), anche se mal sfruttato (punto 4.3). |
| Carta Simulazione (x/30, «Superata» / «Sotto soglia» con icona, data, ▶) | **Migliore**: nei concept non c'è nulla di simile; il numero 24/30 colorato con icona è un buon dato leggibile. |
| Tessere illustrate per famiglia di argomento (clessidra, ecc.) | **Pari o migliore** del libro unico del concept 14: distinguono le righe. Ma due tessere non c'entrano (vedi 5.9). |
| Contrasto: l'ambra ha bordo per arrivare a 3:1, testi con token «-numero» e «-testo» | **Migliore** come rigore. Il costo estetico (contorno marrone) si può ridurre. |
| Navigazione a tre voci con voce attiva evidente e area di tocco ≥ 56 px | **Pari** al 14. |

---

## 3. Cosa la Home deve PRENDERE dai concept (ordinato per resa)

Ogni voce: elemento, come appare nel concept (riferimenti), come riprodurlo.

### 3.1 Fascia di stato con titolo e riga (14, 01, 11, 21)
- **Concept**: carta a tinta tenue (rosa, giallo, verde), alta ~76-80 px a 390, raggio ~16 px, a sinistra un **tondo pieno di 40 px nel colore dello stato con simbolo bianco** (punto esclamativo, barre, spunta), titolo 17 px bold navy, sotto 1-2 righe da 14 px grigio-blu.
- **Home ora**: 62 px, illustrazione blu da 56 px, una sola parola («Vicino») senza oggetto. Resta ambiguo (vicino a cosa?) e la banda occupa quanto il pulsante senza dare informazione.
- **Come riprodurre**: altezza minima 76 px, padding 14/16, raggio 16. Tondo da 40 px: fondo `-basso` / `-medio` / `-alto` (nel medio simbolo navy `medio-su`, non bianco) con glifo (triangolo con «!», barre, spunta) di 22 px. Titolo 17/22 bold; riga 14/19 `testo-tenue`, al massimo due righe. Nessun chevron (la carta non è un pulsante). Illustrazione grande solo per gli stati senza dati (nuovo) e per il verde (coppa).
- **Dato vero per la riga**: nel medio, il punteggio probabile con `formatPunteggio` («tra 22 e 27 su 30, soglia 25»). Nessun numero inventato.

### 3.2 Carta «Prossimo passo» (33; 14 «Il tuo prossimo obiettivo»; 39 «Prossima lezione consigliata»)
- **Concept 33**: carta alta ~210 px, raggio ~20 px. Dentro, dall'alto: maiuscoletto grigio 11 px («PROSSIMO PASSO»), titolo 24 px ExtraBold, tessera 56 px con l'illustrazione a sinistra, riga meta con tre icone (tipo, 10 min, effetto) da 13 px, una frase da 15 px, pulsante pieno 52 px alto con ▶ tondo bianco.
- **Home ora**: la sezione «Lezioni» ha tre righe uguali; nessuna dice cosa succede premendo il pulsante «Continua» (sopra) né quanto dura.
- **Come riprodurre**: sostituire la prima riga di «Lezioni» con una carta in `superficie-2` (non tinta di stato: è l'errore del 33) con eyebrow «PROSSIMA LEZIONE», titolo 20/26 ExtraBold, tessera 56 px dell'argomento, riga meta 13 px con tre dati **veri**: livello (`A1`), numero di domande (icona `risposte`), minuti di lettura (`minutiLettura`, icona `tempo`). Non copiare «Riduce il rischio ~6 %» (proiezione inventata). Le altre due lezioni restano sotto, come righe compatte (sezione 4).

### 3.3 Elenco aree «Fattori» a una colonna (21, 11)
- **Concept 21**: unica carta bianca (raggio ~16) con 4 righe alte ~56 px: icona azzurra da 28 px, nome 15 px, barra da 6 px a estremità tonde con **sfumatura chiaro-saturo del colore di fascia**, percentuale 15 px bold a destra, chevron, filetto fra righe. Le barre occupano ~160 px (la maggior parte della riga).
- **Home ora**: non c'è nulla. `Fattori.tsx` esiste (griglia 2×2 da 14 px con didascalie da 11 px) ma serve ad altre schermate e non è sulla Home. Chi apre l'app non vede «dove sono debole», il dato più utile per studiare.
- **Come riprodurre**: sezione «Le tue aree», 4 righe (categorie reali: ordinate dalla più debole), una per riga, non 2×2. Colore barra: `basso` sotto 40, `medio-numero` fra 40 e 70, `alto` da 70 (le soglie già usate da `coloreValore`). **Percentuale sulla stessa riga del nome**, allineata al bordo destro (nel 21 sta più in basso: errore da non ripetere). Con meno di 5 risposte (`MIN_RISPOSTE`): «–» e barra vuota. Tocco sulla riga: apre l'allenamento sull'area (`onVai(filtro)`, già previsto).

### 3.4 Scala tipografica a tre livelli (tutti i concept)
- **Concept**: titolo di sezione ~19-20 px ExtraBold (14: «Il tuo prossimo obiettivo»), titolo di carta ~17 px bold, testo 15 px medium, didascalia 13 px. Interlinea comoda; tracking leggermente stretto sui titoli.
- **Home ora**: titolo di sezione 15,5 px bold, titolo di riga 15 px bold: **stessa misura, stesso peso**, per cui «Lezioni» e «Present Simple» valgono uguale. Il logo (34 px, nerissimo) pesa più del numero 41 %.
- **Come riprodurre**: titoli di sezione 18/24 ExtraBold (peso 800 già caricato), titoli di carta 16/22 bold, testo 14-15 medium, didascalia 12,5. Logo a 28-30 px.

### 3.5 Il pulsante che cambia con lo stato (01) e dice cosa fa (14, 33)
- **Concept 01**: «Inizia a studiare» (rosso), «Continua a studiare» (ambra), **«Fai una simulazione»** (verde): con rischio basso la proposta cambia. Sopra, una domanda guida piccola, «Cosa puoi fare ora?».
- **Home ora**: sempre «Continua» (tranne «Diagnostico» a chi non ha stima).
- **Come riprodurre**: stesso componente `Cta`, etichetta dalla fascia: nuovo «Fai il test iniziale» (`onOpenDiagnostic`), basso/medio «Continua» con riga piccola sotto («Allenamento su {area più debole}»), alto «Fai una simulazione» (`onStartExam`). La riga piccola sotto «Continua» è 12,5 px con opacità 85 % sul fondo blu e porta l'altezza a 64 px. Non aggiungere la domanda guida «Cosa puoi fare ora?»: costa 24 px e il pulsante parla da solo.

### 3.6 Chip di variazione (39)
- **Concept 39**: in alto a destra del misuratore, carta tinta verde 94×50 px: freccia, «−28 %» bold, «Rispetto alla prima stima» 11 px su due righe.
- **Come riprodurre**: **dentro la fascia di stato, a destra** (nel 39 il chip sta sopra le tacche perché il misuratore è più piccolo; nella Home le tacche arrivano ai bordi e un chip assoluto le coprirebbe). Appare solo con due o più misure: freccia in su verde + «+12 punti» (differenza fra l'ultima e la prima stima misurata), 13 px bold, sotto «dalla prima stima» 11 px. Se la differenza è negativa, nessuna freccia rossa: si mostra solo «−5 punti» in `testo-tenue`. Nessun colore allarme per un calo normale.

### 3.7 Morbidezza delle carte e dello sfondo (14, 21, 33, 01)
- **Concept**: pagina bianca; carte con tinta quasi invisibile (~#F7F9FE), raggio 16-20, **nessun bordo**, ombra larga e leggerissima (blur ~24, opacità 4-6 %) sotto solo il pulsante e la carta eroe.
- **Home ora**: `superficie-2` `#F2F5FB` raggio 12: più grigia, più «modulo» che «scheda», e le tre righe, tutte con lo stesso grigio, fanno un blocco compatto.
- **Come riprodurre**: raggio carte 16 (tessere 14), `superficie-2` alleggerita a `#F5F7FD` in chiaro, nessuna ombra tranne il pulsante. Distanza fra sezioni da 24 a **32 px** (il 14 ha 37 px tra pulsante e titolo, ~30 tra sezioni); fra titolo e contenuto 12.

### 3.8 Contenitore del grafico e filo sotto il punto (03, 33)
- **Concept 33**: il grafico sta in una carta tenue con titolo e «Vedi tutti», punti da 12 px, il valore in grassetto sotto ogni punto, il nome in grigio, il filo verticale sotto il primo.
- **Home ora**: titolo e linea senza contenitore, scala 0-100 su 32 px di altezza utile: con due punti vicini (54 → 51) la linea è piatta e non dice nulla; è tagliata dalla barra in basso nelle anteprime.
- **Come riprodurre**: carta `superficie-2` con titolo; altezza utile del grafico 96 px; **scala adattiva** (min−10 … max+10, limitata a 0-100) perché le variazioni si vedano; 3 filetti orizzontali sottilissimi (`linea`) come riferimento; punto finale con anello `superficie` da 3 px; etichette come ora (valore bold, nome grigio). Con un solo punto: il punto e la riga «Fai un'altra simulazione per vedere la curva.».

### 3.9 Saluto con nome (01, 11)
- **Concept**: «Ciao, Raffaele» 24 px ExtraBold + riga di commento 15 px grigia, sopra il misuratore.
- **Home ora**: nessun saluto. Il nome esiste (profilo, dati solo nel dispositivo): non sarebbe un nome inventato.
- **Come riprodurre**: solo se `profilo.nome` non è vuoto **e** l'altezza della finestra supera 820 px (variante `corto`). Altrimenti niente. Costa ~56 px: sui telefoni reali (viewport 640-760 px) il pulsante deve restare sopra la piega e il saluto non entra. Quindi: beneficio piccolo, tenerlo ultimo.

### 3.10 Barra in basso: icona attiva piena (14)
- **Concept 14**: la casa attiva è piena blu, le altre sono contorni grigi sottili; icone semplici (casa, barre, libro).
- **Home ora**: tutte a tratto, 27 px; manubrio e spade sono i glifi più complessi della pagina e pesano più dell'icona attiva.
- **Come riprodurre**: se `Icona` ha varianti piene, usarle per la voce attiva; altrimenti spessore del tratto 2 px sull'attiva e 1,6 sulle altre. Semplificare l'icona Sfide (una sola spada o un trofeo).

---

## 4. Cosa NON copiare e perché

| Elemento | Dove | Perché no |
|---|---|---|
| Campanella notifiche | tutti | Notifiche inventate: l'app non ne ha. Il profilo in alto a destra è giusto. |
| «Rischio di fallimento», «Rischio molto alto», «percentuale di rischio» | tutti | Formulazione ansiogena e prodotto già deciso su «Probabilità stimata». Anche i titoli «Cosa influenza il tuo rischio». |
| Curva a tre punti 82 → 62 → 28 %, «Dopo 5 lezioni», «Dopo 15 lezioni» | 14, 03, 21, 33 | Proiezione inventata: promette un risultato che l'algoritmo non garantisce. Resta solo la serie misurata. |
| «-28 % rispetto alla prima stima», «-6 %», «Riduci il rischio sotto il 20 %» | 39 | Numeri inventati; del chip si prende solo la forma (3.6) con dati veri. |
| Streak di studio, mini-carta con cerchi spuntati | 39 | La filosofia dell'app esclude streak e livelli; è decorazione senza informazione. |
| Anello obiettivo 20 %, citazione «Ogni lezione ti avvicina...» | 39 | Obiettivo inventato; citazione che non serve. |
| «-30 € di costi aggiuntivi», «evita il pagamento» | 11 | Promessa commerciale e urgenza finta. |
| Fila orizzontale tagliata «Come ridurre il rischio?» | 21 | I testi troncati (`Studia le a…`) sono un'affordance sbagliata, e i suggerimenti ripetono pulsanti già presenti. |
| Carta lezione tinta di rosa | 33 | Il colore di stato non deve passare sulle carte neutre: la carta «prossimo passo» deve restare neutra. |
| Griglia 2×2 delle aree | 39 | Barre da 70 px, didascalie da 11 px, illeggibile. Meglio l'elenco a una colonna del 21. |
| Titolo «Il tuo rischio OFA» sopra il misuratore | 03, 39, 21 | Ripete ciò che il numero dice e costa ~60 px; il 14 e il 33 ne fanno a meno. |
| (i) isolata in alto a destra | 33 | Orfana; nella Home è già dentro il misuratore. |
| Testi da 10-11 px | 39, 11 | Sotto il minimo leggibile per studenti su telefono in movimento. |
| Il marchio «AddiOfa» bicolore e il saluto con nome fisso | 14, 01 | Il marchio è una decisione di brand (vedi 5.3); il saluto non va mostrato senza nome. |

---

## 5. Specifica finale di layout della Home

Convenzioni: px a 390-400 di larghezza, margini laterali 24 (come ora), colonna massima 440. «Tok» = token già esistenti. I testi sono pronti da incollare, in italiano, senza maiuscole inutili, nei limiti del progetto (titoli ≤ 3 parole, righe ≤ 8 parole). Dove una riga supera il limite dei «5 parole» interno, è perché una sola frase concreta vale più di una parola ambigua (vedi 6.1): l'autore decida.

### 5.1 Telefono, tema chiaro (dall'alto in basso)

**A. Intestazione**, 36 px. Marchio a sinistra, altezza 30 px (oggi 34). Pulsante profilo a destra, 36 px, `superficie-2`. Distanza dal margine alto 16 (safe area inclusa).

**B. (facoltativo) Saluto**, solo se `profilo.nome` ≠ '' e altezza finestra > 820 px: «Ciao, {nome}» 24/30 ExtraBold, riga sotto 14/20 `testo-tenue`. Testi della riga: nuovo «Facciamo la prima stima.», basso «Ripartiamo dalle aree più deboli.», medio «Ci sei quasi.», alto «Ottimo lavoro.» (usare «Stai migliorando.» solo se la differenza dalla prima stima è positiva). Distanza dall'intestazione 12, dal misuratore 0 (il misuratore ha già ~20 px d'aria).

**C. Misuratore**, a tutta larghezza (−24 di margine), identico a oggi (geometria 14, rapporto 390 × 204). Cambia solo la fascia ambra (6.4) e, nel tema scuro, il marcatore (5.2). Sotto «Probabilità stimata» (15 px, semibold, colore di fascia) e «di superare il test» (13,5 px, `testo-tenue`). Nessuna carta intorno.

**D. Fascia di stato**, distanza dal misuratore 14. Altezza min 76, raggio 16, padding 14/16, fondo `{fascia}-tinta`. Tondo 40 px (fondo `{fascia}`, glifo 22 px: «!»/barre/spunta; nel medio glifo navy). Titolo 17/22 bold; riga 14/19 `testo-tenue`, max 2 righe. A destra, solo con ≥ 2 misure, chip variazione (3.6): 13 px bold. Testi (titolo / riga):
- nuovo: «Da iniziare» / «Con 10 domande ottieni la prima stima.»
- basso: «Da migliorare» / «Parti dalle aree in cima all'elenco.»
- medio: «Vicino alla soglia» / «Punteggio probabile {tra 22 e 27 su 30}, soglia 25.»
- alto: «In linea» / «Mantieni il ritmo con una simulazione.»
Etichetta di accessibilità invariata (`role="status"`).

**E. Pulsante principale**, distanza 9. Altezza 60-64, raggio 14, gradiente `azione-da → azione-a`, cerchio bianco 38 px con ▶, testo 17 px semibold a x = 14 + 38 + 14 (ossia **allineato al testo della fascia D**: stessa colonna di testo a 66 px dal bordo della carta; oggi sono 98, 112 e 103 px: tre allineamenti diversi in 130 px di altezza). Freccia a destra 26 px. Etichette: nuovo «Fai il test iniziale»; basso/medio «Continua»; alto «Fai una simulazione». Riga piccola sotto (solo basso/medio): «Allenamento su {area più debole}» 12,5 px.

**F. Prossima lezione** (nuova), distanza 32. Titolo di sezione «Prossima lezione» 18/24 ExtraBold, a destra «Tutte ›» (44 px di tocco, come oggi). Sotto, 12 px: carta `superficie-2`, raggio 16, padding 14. Dentro: a sinistra tessera dell'argomento 56 px; accanto, eyebrow «A1 · GRAMMATICA» 11 px maiuscolo `testo-tenue`, titolo 20/26 ExtraBold «{titolo lezione}», e sotto, su una riga, tre dati da 13 px con icona 16 px: «35 domande», «10 min», «0 imparate». Sotto, pulsante secondario a larghezza piena, 48 px, `azione-tinta` con testo `azione-testo`, ▶ e «Inizia la lezione» (o «Riprendi la lezione» se già iniziata). Poi, a 8 px, **due righe compatte** (le attuali `RigaLezione` ridotte: tessera 44, titolo 15/20, a destra «0/29», nessuna barra se 0) sotto un'etichetta 12 px «Poi» `testo-tenue`.

**G. Le tue aree**, distanza 32. Titolo «Le tue aree» 18/24 ExtraBold + (i) 28 px a destra del titolo. Carta `superficie-2` raggio 16, 12 px sotto il titolo, dentro 4 righe alte 56, separate da filetto `linea` 1 px inset 12. Riga: icona 28 px `azione` a sinistra; a destra dell'icona, nome 15/20 semibold (sinistra) e percentuale 15 bold tabular (destra), **sulla stessa linea**; sotto, barra 6 px a estremità tonde (traccia `linea`; riempimento sfumato `{fascia}-chiaro → {fascia}`), larga fino al chevron 18 px. Ordine: dalla più debole. Con meno di 5 risposte: «–» e barra vuota. Esempi segnaposto: «Grammatica 38 %», «Traduzione 52 %», «Vocabolario 61 %», «Lettura 74 %» (sostituire con le categorie reali di `calcolaFattori`).

**H. Simulazione**, distanza 32. Invariata (è già buona): titolo ora 18/24, carta `superficie-2` raggio 16, illustrazione 54 px, risultato 30/32 ExtraBold + «/30» + icona e stato («Superata» / «Sotto soglia»), data 13 px, ▶ da 48 px. Senza risultato: i tre dati del formato come ora. Aggiungere, solo nello stato «Sotto soglia», una riga 12,5 px `testo-tenue` «Soglia: 25 su 30.».

**I. Andamento**, distanza 32. Titolo «Andamento» 18/24 + (i). Carta `superficie-2` raggio 16, padding 14/12, grafico alto 96 px con scala adattiva e 3 filetti (3.8). Etichette sotto i punti: valore 12,5 bold nel colore di fascia, nome 11-12 px `testo-tenue` («Oggi» sull'ultimo). Vuoto: tessera `progressi-statistiche-scheda` 68 px + «Ancora nessun dato».

**J. Fondo pagina**, padding in basso 16 + barra di navigazione (56 px + safe area). Nessun altro blocco.

**K. Barra di navigazione**: invariata nelle voci (Home, Esercizi, Sfide); voce attiva piena o con tratto più spesso (3.10).

Altezza stimata della colonna: ~1250 px a 400 (oggi ~990 senza i nuovi blocchi). Primo schermo a 390 × 700: A, C, D, E visibili e l'inizio di F (il pulsante resta sopra la piega anche a 360 × 640 se il saluto B è nascosto; con B nascosto il pulsante finisce a ~y 540 a 360 × 640).

### 5.2 Telefono, tema scuro

Stessa struttura. Differenze:
- **Fondo pagina** `#0D1526` (un gradino più scuro di `superficie`) e carte `#17223A` con bordo interno 1 px `rgba(255,255,255,0.05)`. Oggi `superficie` `#111A2E` e carte `#17223A` sono quasi lo stesso colore (rapporto ~1,1:1): le tre lezioni sembrano buchi.
- **Misuratore**: traccia da `#1F2B45` a `#2A3A60` (oggi si legge appena); **anello del marcatore chiaro** (`#EAF0FC` a 90 %) invece di blu notte: nell'anteprima precedente era bianco e il pallino sembrava un maniglia, oggi (anello `superficie`) sembra un buco. Alone invariato.
- **Fascia di stato**: niente lastra marrone con filo ocra. Fondo `color-mix(in srgb, {fascia} 14%, var(--color-superficie-2))`, nessun contorno; tondo con il colore di fascia e glifo scuro `#0A101F`; titolo `testo`, riga `testo-tenue`.
- **Pulsante**: gradiente azzurro chiaro con testo `#0A101F` come ora, ma più saturo (`#4F86F7 → #3F76EA` con testo bianco **non** va: bianco su #4F86F7 è ~3,5:1 e a 17 px semibold non passa). Mantenere testo scuro; ridurre la luminosità di 6 punti per non essere l'elemento più chiaro della pagina (oggi è più luminoso del numero).
- **Barre aree e lezioni**: traccia `#26345A` (oggi `#1F2B45` su `#17223A`, invisibile), riempimenti con le tinte «-chiaro» di fascia.
- **Chip variazione**: fondo `alto` 16 % e testo `alto-chiaro`.
- Illustrazioni: tessere con fondo `azione-tinta` come oggi.

### 5.3 Desktop (1280 × 800 e oltre)

Problema oggi: una colonna da 392 px dentro una carta da 768 px (1280 × 800): 188 px vuoti per lato, intestazione che non sta ai bordi della carta, barra in basso larga 768 con voci a 255 px una dall'altra, altezza limitata a 800 e scorrimento dentro un riquadro: si vedono solo tre lezioni e **mai la Simulazione**.

Nuova specifica (solo per la Home, senza toccare le altre schermate): contenitore `max-w-[1080px]`, altezza **libera** (scorre la pagina, non il riquadro), padding 32.
- **Intestazione a tutta larghezza**: marchio a sinistra, a destra voci di navigazione (Home, Esercizi, Sfide) come tab in alto e il profilo. Barra in basso nascosta da 768 px in su.
- **Due colonne**, gap 32:
  - **Sinistra, 400 px, `position: sticky; top: 24`**: misuratore (max 400), fascia di stato (D), pulsante (E). Nessuna carta intorno.
  - **Destra, flessibile (≈ 600 px)**: Prossima lezione (F), poi Le tue aree **in griglia 2×2** (qui c'è spazio: 2 colonne da ~290 px, barra 6 px; le 4 righe diventano 2 righe di 2), poi Lezioni successive e Simulazione affiancate (2 colonne), poi Andamento a tutta larghezza (grafico 140 px).
- Titoli di sezione 20/26. Raggio carte 16. Pulsanti non più larghi di 400 px.
- A 768-1023 px: una colonna da 560 px centrata, con le aree in 2×2.
- Altezza disponibile 800: primo schermo = misuratore, fascia, pulsante a sinistra; Prossima lezione, aree e (in parte) la Simulazione a destra, senza scorrere.

Tema scuro desktop: come 5.2, con la colonna sinistra su `#0D1526` e le carte della destra su `#17223A`.

---

## 6. Problemi della Home attuale indipendenti dai concept

Ordinati per gravità.

1. **La fascia di stato è muta e il pulsante non dice cosa fa.** «Vicino» (a cosa? a 25 su 30?) e «Continua» (cosa?) sono le due parole più importanti della pagina e nessuna ha un oggetto. Il progetto ha un limite interno «niente frasi, 5 parole»: ottimo in generale, ma qui una riga concreta di 6-8 parole («Punteggio probabile tra 22 e 27 su 30, soglia 25») è un **dato**, non una frase.
2. **Gerarchia piatta sotto il pulsante.** Titolo di sezione 15,5 px e titolo di riga 15 px, stesso peso e stessi grigi; tre righe identiche e tutte a 0/N (tre barre vuote = zero informazione). Il primo scorrimento non mostra niente che una persona al primo giorno non sappia già.
3. **Manca il dato più utile: le aree deboli.** `Fattori.tsx` esiste ma sulla Home non c'è.
4. **Tre allineamenti diversi del testo in 130 px** (fascia x = 112, pulsante x = 98, righe x = 103, misurati a 400 px): la pila sembra storta. Un'unica colonna testo (66 px dal bordo carta) li risolve.
5. **Tre blocchi pieni a larghezza piena impilati** (fascia 62 px, pulsante 60 px, riga 73 px, riga 73 px): la fascia color crema (`#FFF7DE`) è luminosa quanto il pulsante e ne attenua la forza. Una fascia più bassa di contrasto (con tondo-glifo) la rimette al suo posto.
6. **Stato ambra sporco.** Arco con contorno marrone di 2 px, estremità sinistra molto pallida, cerchietto con bordo marrone: l'effetto è «disegno con contorno» in mezzo a tutto il resto senza contorni. Il 3:1 si può ottenere senza contorno usando un ambra più profondo per la parte satura dell'arco (da `#F7BD36` a `#E5A113` al valore) e tenendo la fascia chiara solo come inizio sfumato; il contorno si può tenere sul solo marcatore. Da verificare con il controllo dei contrasti già presente.
7. **Marcatore in tema scuro**: anello `superficie` (blu notte) invece di chiaro: sembra un buco, non una maniglia. Nell'anteprima precedente era bianco.
8. **Logo più pesante del dato**: marchio 34 px ExtraBold nerissimo con due stelle nelle A; sul telefono pesa più del 41 %. A 28-30 px, o con «OFA» in blu come nel marchio dei concept, la gerarchia torna. Le stelle nelle A a 30 px sono al limite della leggibilità. Questa è una scelta di marchio: la segnalo, non la impongo.
9. **Due tessere illustrate sbagliate.** «Quantificatori» usa le barre blu, **la stessa illustrazione della fascia** a 130 px di distanza; «There is / There are» usa una carta d'identità (famiglia «chi e dove»), che non c'entra con la grammatica. Cambiare famiglia o mettere un glifo neutro (libro).
10. **Il contatore «0/35»** ha un'icona di doppia spunta da 14 px e nessuna unità: 35 cosa? Meglio «0/35 imparate» o solo la barra più «35 domande» in caption.
11. **Barre e tracce quasi invisibili in scuro** (barra lezione `#1F2B45` su `#17223A`), e la traccia del misuratore con rapporto ~1,2:1.
12. **Desktop**: vedi 5.3. La Home mostra a 1280 × 800 meno contenuto di quella telefonica (la Simulazione non compare), con scorrimento annidato (pagina > riquadro > colonna).
13. **Fondo `fondo` `#F7F9FD` contro carta bianca** a 1280: il riquadro si distingue solo per il filo; sembra un telefono sospeso nel vuoto.
14. **Grafico andamento**: scala 0-100 su altezza ridotta, quindi la linea è piatta per variazioni normali; nelle anteprime è già tagliata sotto la barra (si vede solo la linea), cioè la parte più «morbida» della pagina è anche la meno visibile.
15. **Icone di navigazione**: manubrio e spade sono i due glifi più complessi e più scuri della schermata e pesano più della voce attiva.
16. **Nomi**: la Home non fa mai vedere il nome della persona, che pure l'app raccoglie e conserva nel dispositivo; costa poco (3.9), però non va fatto a scapito del pulsante sopra la piega.
17. **Il menu non ha un percorso di ritorno al punto debole**: la riga della lezione apre la scheda, ma non c'è nulla che colleghi la stima bassa al dato per cui è bassa (le aree). Risolto da 3.3.

---

## 7. Limiti di questa revisione

- Ho visto solo il primo schermo a 400 px (860 di altezza) e a 1280 × 800; il resto da anteprime vecchie (`docs/lavoro/extra/illustrato/home/`), che a volte differiscono da oggi (il marcatore chiaro in scuro).
- Le misure dei concept sono a occhio.
- Non ho provato interazioni, tastiera, lettore di schermo, Safari, dispositivi reali.
- I testi in 5.1 usano il limite «≤ 8 parole per riga»: l'autore può accorciarli; i dati (`formatPunteggio`, `calcolaFattori`, `minutiLettura`) esistono già nel codice.
- Nessun file del progetto è stato toccato; ho creato solo questo documento.
