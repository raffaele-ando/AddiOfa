# Revisione indipendente: landing page (A)

Revisore: product designer esterno. Ho guardato tutte le 28 immagini: `light-400` e `dark-400` (8 schermate ciascuna, 00-07), `light-1280` e `dark-1280` (6 schermate ciascuna, 00-05). Giudico solo ciò che si vede. Dove le schede compaiono scorrendo, ho valutato lo stato finale. Un limite: tra `01-landing-01` e `01-landing-02` (400 px) la prima riga delle schede «rischi» finisce sotto l'header e non è leggibile, quindi i suoi titoli li ho letti solo nella versione desktop.

Tutti i riferimenti a immagini sono relativi a `.../rev/app/`. Quando scrivo «01-landing-NN» senza cartella, vale per tutte e quattro le cartelle, salvo diversa indicazione.

---

## 1. Verdetto generale

La landing ha un'identità riconoscibile (il portale blu con la stella è un buon oggetto di marca), un'impostazione cromatica coerente (blu + accenti caldi) e una chiusura (CTA finale) davvero forte. Si vede che dietro c'è cura: il tema scuro non è un'inversione automatica, le illustrazioni 3D sono dello stesso mondo, il pulsante principale è sempre riconoscibile.

Il problema è un altro: sembra fatta da un generatore di landing, non da qualcuno che ha deciso cosa dire. Lo stesso concetto (quattro vantaggi) compare tre volte; lo stesso slogan emotivo («un passo in più», «il tuo futuro non si ferma», «costruisci il tuo domani») compare tre volte; ogni pulsante ha il cerchietto con la freccia; ci sono quattro stili diversi di etichetta di sezione. Nessuna schermata dice la cosa che convince un diciottenne: è gratuita, dura 3 minuti, ti dice a che punto sei. La parola «gratuita» non compare mai sopra la piega, e il titolo non dice che cosa si ottiene.

A questo si aggiunge un difetto tecnico che si nota subito: l'header non isola il contenuto. Su desktop il logo si sovrappone ai titoli (`light-1280/01-landing-02`), su telefono il testo scorre visibile sotto la barra.

Voti (1-10):

| Variante | Voto | Perché |
|---|---|---|
| Telefono, chiaro | 6,5 | Hero buono, ma ripetizioni, spazi morti, testi di 11 px, header che «perde» |
| Telefono, scuro | 7 | Hero più drammatico e leggibile; sezioni piatte e icone fangose; stessi difetti di struttura |
| Desktop, chiaro | 6,5 | Hero ben composto; header sovrapposto ai titoli, mockup minuscoli, 150-170 px di vuoto tra sezioni |
| Desktop, scuro | 7 | Come il chiaro, con più atmosfera; bordo rettangolare dell'immagine hero visibile, superfici poco distinte |

---

## 2. Problemi in ordine di gravità

### BLOCCANTE

**B1. L'header non protegge il contenuto: testi che si sovrappongono al logo e alla navigazione**
- Dove: `light-1280/01-landing-02` e `dark-1280/01-landing-02` (il titolo «Un percorso su misura, in 4 passi» è scritto sopra il logo «AddiOFA», illeggibili entrambi); `light-1280/01-landing-04` e `-05` (il testo della FAQ scorre dietro la pillola di navigazione e dietro il pulsante «Fai il diagnostico»; la pillola «FAQ» sticky finisce sotto il logo); `light-400/01-landing-01`, `-02`, `-03` e le scure (la scritta «Senza limiti / Senza password» e il titolo «Un percorso su misura» si leggono a metà dietro la barra).
- Cosa non va: su desktop il logo e la pillola nav sono fluttuanti senza nessuno sfondo dietro; su telefono la barra è troppo trasparente e senza sfocatura. Il contenuto che passa sotto genera rumore visivo e dà l'impressione di un bug.
- Correzione:
  - Telefono: barra alta 56-64 px, sfondo = colore pagina al 88-92% di opacità + `backdrop-filter: blur(14px)`, linea inferiore 1 px a bassa opacità (chiaro: nero 6%; scuro: bianco 8%). Quando la pagina è in cima, la barra può restare trasparente, ma deve diventare piena dopo 8 px di scroll.
  - Desktop: dare una fascia sticky a tutta larghezza alta 64 px con lo stesso trattamento (blur + 90%). La pillola centrale con i link resta, ma sta dentro la fascia. In alternativa, nascondere logo e CTA a destra e lasciare solo la pillola (che ha già fondo solido) con `background` al 96%.
  - La colonna sticky della FAQ («FAQ / Domande») deve avere `top: 88px` (altezza header + 24 px), non meno, per non finire sotto il logo.

### FORTE

**F1. Il titolo non dice nulla di concreto e il valore principale (gratuito, 3 minuti) è nascosto**
- Dove: `*/01-landing-00`, titolo «Oltre l'OFA, un passo in più.» e riga «Senza limiti · Senza password».
- Cosa non va: è un gioco di parole. In 3 secondi un ventenne non capisce cosa ottiene. «Senza limiti» è vago (limiti di cosa?). La parola «gratuita», il motivo principale per provarla, compare solo nella FAQ («Quanto costa?», quinta schermata su telefono). Inoltre, su telefono il titolo va a capo in modo sgraziato: «un passo / in più.» su due righe, con una riga rotta a metà.
- Correzione (testi pronti in sezione 3): titolo che promette l'azione, `font-size` 36-38 px su telefono con `text-wrap: balance`, seconda riga in blu come ora; riga di fiducia con «Gratuita» come prima voce.

**F2. Due pulsanti primari blu in competizione nella prima schermata del telefono, con nomi diversi**
- Dove: `light-400/01-landing-00` e `dark-400/01-landing-00`: «Inizia» nell'header e «Fai il diagnostico» nel corpo; più «Salta» sotto. Su desktop la CTA è «Fai il diagnostico» ovunque; su telefono l'header dice «Inizia».
- Cosa non va: stesso pulsante, due nomi; due blu pieni a 700 px di distanza. L'utente si chiede se sono azioni diverse. «Fai il diagnostico» è inoltre una forma strana in italiano (si «fa» un test, «il diagnostico» è un aggettivo sostantivato che i ragazzi non usano).
- Correzione: su telefono nascondere la CTA dell'header finché il pulsante dell'hero è visibile (la mostri con una transizione ≤ 120 ms quando esce dallo schermo). Un solo nome in tutto il sito: «Inizia il test di livello». Se il termine «diagnostico» è parte del prodotto, usarlo come sostantivo («Il diagnostico dura 3 minuti»), mai come oggetto del verbo «fare».

**F3. Lo stesso contenuto ripetuto tre volte, la pagina è più lunga del suo messaggio**
- Dove: (a) striscia/scheda delle 4 voci in `*/01-landing-00/01` («Sai a che punto sei / Provi il test vero / Ripassi ciò che sbagli / Capisci perché»); (b) 4 passi in `*/01-landing-02/03` e desktop `02`; (c) 4 schede «Tutto ciò che ti serve» in `*/01-landing-03/04` e desktop `02/03`. Sono lo stesso elenco: test di livello, test vero/simulazione, ripasso errori, spiegazioni.
- Cosa non va: su telefono sono circa 3 schermate e mezza per dire la stessa cosa tre volte; chi scorre ha la sensazione che la pagina «giri a vuoto». Dilata anche la distanza tra hero e CTA finale.
- Correzione: tenere due blocchi su quattro. (1) Striscia sotto l'hero: tenerla, ma ridurla a 3 voci su telefono (le 3 che servono davvero: livello in 3 minuti, test come quello vero, errori ripassati). (2) I 4 passi con il telefono: tenerli, sono l'unico blocco con prova concreta (la domanda «She ___ to Milan every day.»). (3) Eliminare la sezione «Tutto ciò che ti serve per arrivare preparato» come blocco a sé: se serve, i suoi 4 testi diventano le didascalie dei 4 passi. Risparmio: circa 1,3 schermate su telefono, 480 px su desktop.

**F4. Le card «fittizie» nell'hero desktop contengono dati inventati con la dicitura illeggibile**
- Dove: `light-1280/01-landing-00` e `dark-1280/01-landing-00`, card «Probabilità stimata di superare il test 72%» con sotto «Esempio» a circa 6 px.
- Cosa non va: un numero grande (72%) presentato come stima; il disclaimer c'è ma non si legge. Per un prodotto che dice di non fare promesse (vedi FAQ «La stima è una promessa?») è una contraddizione e un rischio di fiducia. Le altre due card (bandiera con A/B/C, «Ripasso su misura») hanno testo da 8-9 px, sono rumore decorativo. Inoltre la card sporge a x≈545 mentre il titolo finisce a x≈530: 15 px di respiro, sembra una collisione.
- Correzione: togliere il 72% e mostrare una forma che non sia un risultato: anello vuoto con «?» e la scritta «Lo scopri in 3 minuti», oppure tenere il numero con un'etichetta «ESEMPIO» a 11 px, maiuscolo, in un chip visibile. Spostare la card 24-32 px a destra o ridurla (-10%) per avere almeno 40 px di aria dal titolo. Eliminare la card con la bandiera (informazione zero).

**F5. Le schede «rischi»: testi microscopici, vuoto interno, leggibilità e tono**
- Dove: `*/01-landing-01/02` (telefono) e `*/01-landing-01` (desktop), sezione «Cos'è l'OFA di inglese?».
- Cosa non va:
  - Testo secondario a circa 11 px grigio chiaro («sotto 25 su 30», «presso gli enti convenzionati»): sotto la soglia di leggibilità su telefono.
  - Ogni scheda ha 60-70 px di vuoto tra il testo (in alto) e l'illustrazione (in basso): sembrano card tirate in altezza per riempire.
  - Su desktop le 5 schede inclinate con una fascia rossa dietro hanno testo ruotato, quindi sfocato; non si capisce che cosa rappresenti la fascia (un percorso? un pericolo?). Sotto la composizione restano 170 px di vuoto prima della sezione successiva.
  - L'ultima scheda («Con AddiOFA ti prepari ed eviti tutto questo») promette di «evitare tutto questo»: è una promessa di risultato che la FAQ stessa nega. Usa la stessa icona a barre di «Analisi del livello», quindi il simbolo cambia significato.
  - Su telefono il pulsante «Scopri tutti i rischi» sta prima delle schede che dovrebbe introdurre.
- Correzione:
  - Testo secondario a 13 px (telefono) / 14 px (desktop), colore con contrasto ≥ 4,5:1 sul fondo della scheda.
  - Card telefono: altezza minima 132 px, illustrazione 56-64 px a destra del testo (non in fondo), così la scheda non ha buchi.
  - Desktop: togliere l'inclinazione (0°) e la fascia rossa, oppure inclinare di 2° al massimo. Allineare le 4 schede di rischio su una riga, con la quinta (soluzione) separata da una freccia o da un filetto. Ridurre di 80-100 px il padding verticale della sezione.
  - Mettere il pulsante dopo le schede, non prima. Cambiare l'etichetta (sezione 3).

**F6. Il blocco con la foto «Il tuo futuro non si ferma a un esame» è ridondante, generico e con CTA muta**
- Dove: `*/01-landing-04` (telefono, fine schermata), `*/01-landing-03` (desktop).
- Cosa non va: ripete in forma emotiva ciò che le schede «rischi» dicono già (piano di studi, esami del 2° anno). Il pulsante è un cerchio con chevron, senza etichetta: non si capisce dove porta. La foto di un edificio storico con la scritta «non affiliato» nel footer genera ambiguità (sembra il Politecnico?); se non è una foto con licenza chiara, è anche un rischio.
- Correzione: eliminarlo. Al suo posto, un blocco di fiducia reale (vedi sezione 6, punto 5): chi l'ha fatto, perché è gratis, dove stanno i dati.

### MEDIO

**M1. Sistema di etichette di sezione incoerente**
- Dove: «01 ———» (solo nella prima sezione, nessuno 02-03), «COME FUNZIONA» (testo semplice), «IL TEST IN CIFRE» (testo con icona i), pillola «FAQ» con icona e fondo, «INIZIA OGGI» (bianco su blu). In FAQ, pillola «FAQ» + titolo «Domande» dicono due volte la stessa cosa.
- Correzione: un solo stile: testo maiuscolo 12 px, `letter-spacing` 0,08 em, colore blu accento, senza numero e senza pillola, 12 px sopra il titolo. Eliminare «01». In FAQ tenere solo il titolo «Domande frequenti» (senza pillola).

**M2. Troppi tipi di pulsante e il cerchio-freccia ovunque**
- Dove: primario pieno blu con cerchio bianco (hero, header), contorno (`Scopri tutti i rischi`, `Come funziona`), tonale azzurro pallido (`Parti dal diagnostico`), cerchi con chevron senza testo (scheda blu, scheda foto), bianco su blu (CTA finale).
- Cosa non va: il tonale azzurro pallido nel chiaro sembra disabilitato (contrasto basso con la pagina); i cerchi muti non sono pulsanti riconoscibili; il cerchio-freccia dentro ogni pulsante è un tic da generatore e occupa 40 px.
- Correzione: tre stili soltanto. Primario: blu pieno, testo bianco, altezza 52 px su telefono / 48 px su desktop, freccia come semplice icona `→` 18 px senza cerchio. Secondario: contorno 1,5 px. Link: testo blu con freccia. Il cerchio bianco con freccia può restare solo nel primario dell'hero (è il «gesto firma»). Eliminare i cerchi muti.

**M3. Spazi verticali irregolari e «buchi»**
- Dove: `*/01-landing-01` telefono (≈ 120 px vuoti sotto «Scopri tutti i rischi»); `*/01-landing-02` desktop (≈ 150 px tra le didascalie dei passi e «Tutto ciò che ti serve»); `*/01-landing-03` desktop (≈ 120 px sotto le due schede); `*/01-landing-04` desktop (≈ 130 px prima della CTA finale).
- Correzione: ritmo fisso. Padding verticale di sezione: 72 px telefono, 112 px desktop (oggi sembra 160-200). Distanza titolo → contenuto: 24 px telefono, 40 px desktop. Le sezioni che compaiono scorrendo non devono riservare altezza «vuota» prima della comparsa: usare `min-height` reale della scheda o il placeholder con la stessa altezza.

**M4. Testi piccoli e poco contrastati**
- Dove: sottotitoli delle 4 voci dell'hero («10 domande, 3 minuti», `*/01-landing-01`), etichette dei passi 2-4 («Ripasso su misura», «Allenati», «Supera», `*/01-landing-02`), descrizioni delle 4 schede funzione, footer (≈ 10-11 px, grigio chiaro).
- Correzione: minimo 13 px per qualsiasi testo che il lettore deve leggere (12 px solo per etichette maiuscole), footer 13 px. Colore secondario del tema chiaro: scurire di circa 12% di luminosità (da grigio-blu medio a grigio-blu scuro, contrasto ≥ 4,5:1 anche sulle card bianche). I numeri 2, 3, 4 nei cerchi dei passi (azzurro pallido su azzurro pallido) devono arrivare a ≥ 3:1: sfondo cerchio più saturo o numero blu pieno.

**M5. I 4 passi: la didascalia sta lontana dal selettore, e il mockup mostra una domanda troppo facile**
- Dove: `*/01-landing-02` (telefono): selettore 1-4 a y≈225, mockup telefono a y 335-835, didascalia «1. Test iniziale: Scopri il tuo livello…» a y≈105 della schermata dopo (`-03`), oltre 600 px sotto. Su desktop (`light-1280/01-landing-01/02`) i 4 mockup sono inclinati e con testo da 8-10 px, il quarto è quasi vuoto.
- Cosa non va: chi tocca «2» non vede subito cosa cambia; il titolo del passo e la sua spiegazione dovrebbero stare tra selettore e mockup. La domanda del mockup («She ___ to Milan every day.», livello A1) è elegante come esempio ma abbassa la credibilità del «test vero» di un livello universitario. Il chip «Diagnostico» sovrapposto al telefono è usato solo qui e il suo senso non è chiaro.
- Correzione: sotto il selettore, titolo del passo (18 px, peso 700) + una riga (15 px), poi il mockup. Usare una domanda più vicina al livello reale (es. «If I ___ more time, I would study abroad.» con opzioni: have / had / would have / having). Togliere il chip fluttuante o trasformarlo in didascalia sopra il telefono. Su desktop: mockup a 0° o 1°, testo ≥ 11 px, il quarto riempito con un esito (anello 25/30 completato) invece di un'icona documento.

**M6. Il blocco «Il test in cifre» e il contrasto di tipo di card**
- Dove: `*/01-landing-04` telefono; `*/01-landing-03` desktop.
- Cosa non va: su telefono l'anello è al centro e il testo a sinistra: due allineamenti nella stessa card; su desktop la card è alta 324 px per 140 di contenuto. L'icona (i) non spiega nulla (che cosa si apre?). Nel tema scuro la traccia dell'anello quasi sparisce, quindi non si legge più la proporzione 25 su 30.
- Correzione: telefono, anello a sinistra (96 px) e testo a destra, oppure tutto centrato; altezza card su desktop ≤ 240 px. Nel tema scuro traccia dell'anello a bianco 14% (oggi ≈ 6%). Mettere sotto «Fonte: regolamento del test» con link (se vero) al posto dell'icona (i), oppure toglierla.

**M7. Header e contenuto non condividono il margine**
- Dove: desktop, tutte le immagini: il logo sta a x=32, il contenuto parte a x=72; il pulsante a destra finisce a x=1248, il contenuto a 1208.
- Correzione: logo e CTA dentro lo stesso contenitore del contenuto (padding laterale 72 px a 1280), oppure contenuto e header a 32 px. Una linea sola.

**M8. Cucitura visibile nella CTA finale e nel footer**
- Dove: `light-400/01-landing-07`, `dark-400/01-landing-07` (a y≈505 il blu piatto incontra la foto con un bordo orizzontale netto); `light-1280/01-landing-05` e `dark-1280/01-landing-05` e telefono (a y≈697 / y≈757 il fondo con sfumatura finisce e comincia una fascia piatta per il footer).
- Correzione: nella CTA, sfumatura di 80-120 px dal blu alla foto (`linear-gradient` sopra l'immagine, blu pieno → trasparente), o la foto in un riquadro con angoli arrotondati. Nel footer, estendere la sfumatura della pagina sotto il footer, oppure dare al footer un filetto 1 px e un fondo volutamente diverso (6% più scuro nel chiaro).

**M9. L'immagine hero nel tema scuro ha bordo rettangolare**
- Dove: `dark-1280/01-landing-00`: sul bordo alto (y≈70, sotto la pillola nav) e a sinistra (x≈540) si legge il rettangolo dell'immagine, più chiaro del fondo; a destra si taglia a x=1280.
- Correzione: maschera `mask-image` con sfumatura su tutti i lati (24-32 px alto e sinistra, 64 px basso), e allineare il colore di base dell'immagine al fondo scuro, oppure aggiungere un velo con il colore pagina all'8-12%.

### RIFINITURA

- **R1. Riga di fiducia dell'hero sbilenca su telefono** (`*/01-landing-00`): «Senza limiti · Senza password · (i)» in prima riga, «Salta» da solo in seconda. L'icona (i) non ha etichetta. Sistemare come da sezione 3 (una sola riga: «Gratuita · Senza registrazione · Progressi sul tuo dispositivo»), togliere (i), spostare «Salta» (vedi testi).
- **R2. «Salta» non si capisce** (hero e CTA finale): salta che cosa? Nella CTA finale è anche rientrato di circa 17 px rispetto al bordo sinistro del pulsante (`*/01-landing-07`: icona a x=65, bordo pulsante a x=48).
- **R3. Titoli delle schede funzione a lunghezza diversa** (`*/01-landing-03/04`): «Analisi del livello» a una riga, «Spiegazioni semplici» a due, quindi le descrizioni iniziano a quote diverse. Fissare un'altezza minima di 2 righe per il titolo o accorciare («Spiegazioni»).
- **R4. Striscia delle 4 voci desktop** (`*/01-landing-00`): titoli a una e due righe, altezze diverse, allineamento verticale al centro che li fa sembrare disallineati. Allineare in alto e fissare `min-height`.
- **R5. Icone nei cerchi colorati** (giallo, rosso, viola) diventano marrone/prugna nel tema scuro (vedi sezione 4).
- **R6. Footer** (`*/01-landing-07` telefono, `*/01-landing-05` desktop): link e avvertenza a 10-11 px, centrati sotto una pagina a sinistra. Portare a 13 px, aggiungere il logo piccolo a sinistra e i tre link a destra su desktop.
- **R7. Terminologia**: «Polimi» (FAQ) e «Politecnico di Milano» (hero, footer) alternati. Usare «Politecnico di Milano» ovunque, «Polimi» solo se è parola del pubblico (e allora anche nell'eyebrow).
- **R8. Prima FAQ aperta di default**: la risposta è un blocco di 5 righe; su telefono spinge giù le altre 4 domande. Tenere aperta solo se accorciata (sezione 3) o chiudere tutte.
- **R9. «Parti dal diagnostico»** (pulsante tonale accanto al titolo «Tutto ciò che ti serve…»): quarta CTA nella pagina prima del footer. Una volta tolta la sezione (F3), sparisce.

---

## 3. Revisione dei testi

Principio: frasi che dicono una cosa concreta, un verbo all'inizio dei pulsanti, un solo nome per ogni cosa («test di livello»), niente slogan duplicati.

**Hero (`*/01-landing-00`)**

| Oggi | Problema | Proposta |
|---|---|---|
| «Oltre l'OFA, un passo in più.» | Gioco di parole, non dice cosa fa il sito | Titolo: «Scopri a che punto sei con l'OFA di inglese.» Seconda riga blu: «In 3 minuti.» |
| «AddiOFA ti aiuta a prepararti all'OFA di inglese con un percorso personalizzato: scopri a che punto sei, ripassa i tuoi errori e allenati sul formato del test.» (4 righe) | Lungo, generico («personalizzato»), ripete il titolo | «Poi ripassi solo ciò che sbagli e provi il test vero: 30 domande, 15 minuti.» (2 righe) |
| «Fai il diagnostico» | Costruzione strana, nome interno | «Inizia il test di livello» |
| «Inizia» (header telefono) | Nome diverso dal pulsante dell'hero | Nascosto finché c'è l'hero; poi «Inizia il test» |
| «Senza limiti · Senza password · (i)» | Vago, (i) muto | «Gratuita · Senza registrazione · Progressi sul tuo dispositivo» (una riga, 3 voci, niente (i)) |
| «Salta» | Salta cosa? | Link sotto il pulsante: «Preferisci esplorare? Vai all'app senza test» |
| Eyebrow «PER GLI STUDENTI DEL POLITECNICO DI MILANO» | Buono, resta | Resta |

Nota sulla parola «gratuita»: nelle regole del repository la parola «Gratis» è vietata come etichetta di pulsante o di piano. Qui è un'affermazione di fatto in una riga di fiducia, non un'etichetta; se la regola va applicata alla lettera, usare «Tutto aperto, senza pagare nulla».

**Striscia / 4 voci**

| Oggi | Proposta |
|---|---|
| «Sai a che punto sei · 10 domande, 3 minuti» | «Scopri il tuo livello · 10 domande, 3 minuti» |
| «Provi il test vero · a tempo, con la soglia» | «Prova il test vero · 30 domande, 15 minuti» (la «soglia» è gergo) |
| «Ripassi ciò che sbagli · 613 domande» | «Ripassa i tuoi errori · tra 613 domande» |
| «Capisci perché · spiegazioni in italiano» | «Capisci perché · ogni risposta è spiegata in italiano» |

Coerenza grammaticale: tutti all'imperativo (come i pulsanti) o tutti alla seconda persona; oggi si mescolano «Sai», «Provi», «Ripassi», «Capisci».

**Sezione «Cos'è l'OFA di inglese?»**

| Oggi | Proposta |
|---|---|
| «Un obbligo formativo aggiuntivo: lo togli superando un test di inglese. Se non lo superi, il piano degli studi resta limitato e ogni nuovo tentativo ha un costo.» | «L'OFA è un obbligo formativo aggiuntivo. Finché non superi il test d'inglese, il tuo piano di studi resta limitato agli esami del primo anno. Ogni nuovo tentativo costa.» |
| «Scopri tutti i rischi» | «Leggi cosa succede se non lo superi» (se il pulsante porta a una pagina; altrimenti toglierlo) |
| «Non superi l'OFA / sotto 25 su 30» | «Sotto 25 su 30 non è superato» |
| «Circa 30 € a tentativo / presso gli enti convenzionati» | «Ogni nuovo tentativo costa circa 30 €» (verificare la cifra e citarne la fonte) |
| «Piano di studi bloccato / solo esami del 1° anno» | Resta, è chiaro |
| «Il piano del 2° anno / scadenze a fine estate» | Vago. «Esami del 2° anno / non inseribili finché l'OFA è aperto» (verificare il regolamento) oppure tagliare e tenere 3 schede |
| «Con AddiOFA ti prepari ed eviti tutto questo» | «Con AddiOFA arrivi al test preparato» (nessuna promessa di esito) |

**Sezione «Come funziona» (4 passi)**

| Oggi | Proposta |
|---|---|
| «Un percorso su misura, in 4 passi» | «Come funziona, in 4 passi» (il «su misura» è già nel passo 2) |
| «Dal test iniziale alla simulazione, tutto in un'unica app.» | Tagliare: ripete il titolo |
| Passi «Test iniziale / Ripasso su misura / Allenati / Supera» | «Test di livello / Ripassa gli errori / Allenati / Simula il test» (il quarto era un esito, non un'azione) |
| Descrizione del passo 4 «Togli l'OFA e vai avanti con il piano degli studi.» | Va bene come didascalia del risultato, ma sotto un altro titolo: «Poi tocca al test vero» |

**Sezione «Tutto ciò che ti serve per arrivare preparato.»** da eliminare (F3). Se resta: titolo «Dentro trovi:», voci «Quiz con spiegazione», «Simulazioni illimitate», «Statistiche per argomento», «Teoria in italiano».

**Il test in cifre**

| Oggi | Proposta |
|---|---|
| «25 risposte esatte su 30. Hai 15 minuti. AddiOFA ti fa provare lo stesso formato, finché non lo senti tuo.» | «Il test vero: 30 domande, 15 minuti. Per superarlo servono 25 risposte esatte. Qui lo simuli quante volte vuoi.» |

**Blocco foto «Il tuo futuro non si ferma a un esame.»**: eliminare. «Senza ostacoli» è un cliché che ricompare anche nella CTA finale.

**FAQ**

| Oggi | Proposta |
|---|---|
| Titolo «Domande» con pillola «FAQ» | «Domande frequenti» (senza pillola) |
| «Quanto costa?» | Resta. Risposta: «Niente. AddiOFA è gratuita e non serve registrarsi. Trovi tutte le 613 domande con spiegazione in italiano, la teoria, simulazioni illimitate (30 domande in 15 minuti) e le statistiche.» (2 righe in meno e meno «aperto a tutti / nessuna password») |
| «Cos'è il diagnostico?» | «Cos'è il test di livello?» |
| «La stima è una promessa?» | Criptica (sul telefono «stima» non è mai stata introdotta). «Il risultato del test è una garanzia?» |
| «Dove restano i progressi?» | «Dove vengono salvati i miei progressi?» |
| «Legata al Polimi?» | «AddiOFA è un servizio del Politecnico di Milano?» |

**CTA finale**

| Oggi | Proposta |
|---|---|
| «INIZIA OGGI / Costruisci il tuo domani. / Un piccolo passo ora, per un percorso universitario senza ostacoli.» | Eyebrow: «PARTI DAL TEST DI LIVELLO». Titolo: «Quanto sai davvero?» Sottotitolo: «10 domande, 3 minuti, nessuna registrazione. Poi scegli tu cosa ripassare.» Pulsante: «Inizia il test di livello» |
| «Salta» | «Vai all'app senza test» |

**Footer**: tenere «Progetto studentesco indipendente, non affiliato al Politecnico di Milano.» e aggiungere una riga di attribuzione vera (autore o nome del progetto) sopra o accanto.

**Tre slogan da ridurre a zero o uno**: «Oltre l'OFA, un passo in più», «Il tuo futuro non si ferma a un esame», «Costruisci il tuo domani». Dicono la stessa cosa in registro motivazionale. Si può tenere «un passo in più» solo come claim secondario vicino al logo, non come titolo.

---

## 4. Differenze fra tema chiaro e scuro che peggiorano uno dei due

**Peggiora il tema scuro**
- Le card hanno bordo 1 px a contrasto basso e nessuna ombra; il fondo scheda e il fondo pagina sono quasi uguali (`dark-400/01-landing-03`, `-04`; `dark-1280/01-landing-02`, `-03`). La struttura a card si perde e la pagina sembra una colata uniforme. Correzione: fondo scheda più chiaro del fondo pagina di circa 4-5% di luminosità, bordo bianco al 10-12%, più una luce sottile sul bordo superiore (1 px bianco al 6%).
- Cerchi colorati delle 4 voci hero (`dark-400/01-landing-01`, `dark-1280/01-landing-00`): il giallo diventa oliva-marrone, il rosso marrone, il viola prugna; l'effetto è «sporco». Correzione: sfondo del cerchio = colore accento al 18-22% sul fondo scuro, e icona nel colore accento chiaro (giallo 300, arancio 300, viola 300).
- Anello 25/30: traccia quasi invisibile (vedi M6).
- Illustrazioni delle schede «rischi»: il documento con la X è navy su navy, poco leggibile (`dark-400/01-landing-02`). Correzione: ripetere la carta in colore chiaro (bianco 85%) oppure aggiungere un alone chiaro dietro l'icona.
- Bordo dell'immagine hero visibile (M9).
- Il blocco foto è meno scuro che nel chiaro (sfumatura da navy a azzurro più chiara): il testo bianco ha meno contrasto verso la parte destra del titolo. Si risolve eliminando il blocco (F6).

**Peggiora il tema chiaro**
- Fondo pagina quasi bianco, schede bianche con ombra morbida: le card si distinguono poco, la pagina è lavata (`light-400/01-landing-03`, `-04`). Correzione: fondo pagina con una leggera tinta fredda (circa 3% più scuro del bianco) e schede bianche con bordo 1 px blu-grigio al 10%.
- Pulsanti tonali azzurro pallido («Parti dal diagnostico»): sembrano disabilitati; nel tema scuro invece si leggono. Correzione: testo blu scuro (più scuro di oggi) e fondo azzurro al 14% invece del 8-10%.
- Numeri dei passi 2-4 e icone dei cerchi (chiaro su chiaro): contrasto basso, non tutti raggiungono 3:1.
- Il blocco foto è un rettangolo navy molto scuro in una pagina chiarissima: il salto di valore è brusco (`light-400/01-landing-04`). Si risolve eliminandolo.

**Cosa è coerente e va tenuto in entrambi**: gerarchia dei titoli, uso del blu come unico accento, CTA finale (stesso blocco luminoso in entrambi, ottimo nel scuro dove è l'elemento più luminoso della pagina).

---

## 5. Cosa funziona e va tenuto

- **L'immagine hero** (portale con stella, ragazzo che sale le scale): è l'unica immagine «di significato» (superare una soglia), è riconoscibile e ben composta, specialmente su desktop. Su telefono la dissolvenza verso il fondo funziona. Nel tema scuro è ancora migliore.
- **Il logo** con la stella nella A e nella F: leggibile, forte, chiaro anche a 20 px di altezza.
- **Il blocco «Il test in cifre»** come idea: un numero grande, un anello, due righe. È l'unico elemento della pagina che dà un dato verificabile in un colpo d'occhio. Ridurre e correggere, non togliere.
- **Il mockup del telefono con una domanda reale** (`*/01-landing-02`, telefono): mostra il prodotto vero, con il tag «Esempio» che dichiara cosa è. Più prodotto reale e meno illustrazione, ovunque.
- **La CTA finale** (`*/01-landing-07`, `*/01-landing-05`): la composizione più riuscita della pagina: titolo grande bianco, pulsante bianco ad alto contrasto, immagine con la stella che richiude il cerchio con l'hero.
- **La FAQ come accordion**: struttura giusta, domande brevi, chevron chiaro.
- **Le illustrazioni 3D delle funzioni** (quiz, clessidra, grafico, lampadina): stesso stile, colori coerenti, buona resa in entrambi i temi.
- **Tipografia**: un solo sans geometrico, pesi netti, titoli con seconda riga blu. Funziona; solo il titolo hero su telefono va in capo a metà.
- **Onestà del tono**: «Progetto studentesco indipendente, non affiliato…» e «Esempio» sul mockup. Resta, e va semmai reso più leggibile (13 px).
- **Navigazione desktop a pillola** con voce attiva evidenziata: pulita e comprensibile (una volta risolto B1).

---

## 6. Le 5 modifiche che alzerebbero di più la qualità percepita

1. **Riparare l'header (B1)**: fascia sticky con sfondo al 90% e sfocatura, padding sincronizzato col contenuto (M7), CTA di header nascosta su telefono finché c'è l'hero (F2). È la correzione con il miglior rapporto effetto/costo: sparisce l'effetto «bug» in tutta la pagina.
2. **Riscrivere l'hero e fare un solo tipo di promessa (F1, F2, F4)**: titolo «Scopri a che punto sei con l'OFA di inglese. In 3 minuti.», pulsante «Inizia il test di livello», riga «Gratuita · Senza registrazione · Progressi sul tuo dispositivo», rimozione di «Salta» e (i), card desktop senza il 72% o con «ESEMPIO» leggibile.
3. **Tagliare la pagina di un terzo (F3, F6)**: eliminare la sezione «Tutto ciò che ti serve» e il blocco foto, tenere striscia + schede rischi + 4 passi + test in cifre + FAQ + CTA. Su telefono da 8 schermate a circa 6; i CTA da 7 a 3 (hero, dopo i passi, finale).
4. **Un sistema, non una somma di componenti (M1, M2, M3, M4)**: un solo stile di etichetta di sezione, tre stili di pulsante senza cerchi muti, ritmo verticale fisso (72 px telefono / 112 px desktop), testo minimo 13 px, schede senza buchi (F5). Questo è ciò che separa «fatto da un professionista» da «fatto da un generatore».
5. **Prova e fiducia reali al posto dello slogan**: dove oggi c'è il blocco foto, un riquadro con 3 fatti verificabili: «Fatto da uno studente che ha superato l'OFA con questo metodo» (solo se vero), «613 domande con spiegazione, tutte in italiano», «I tuoi progressi restano sul tuo dispositivo: nessun account». Aggiungere una vera schermata del prodotto (non illustrata) con l'esito di un test di livello. Niente recensioni né numeri di utenti che non esistono.
