# G3 · Concept contro implementazione: percorso di ingresso e risultato

Revisione esterna e indipendente. Oggetto: 12 tavole di concept (`grafica/brand/concept/{30,31,34,36,47,05,09,10,20,29,42,43}-*`, lette dalle `anteprima.png`, con ritagli ingranditi di 47, 43 e 42) contro l'implementazione attuale (`rev/app/light-400`, `dark-400`, `light-1280`: 24 schermate `02-funnel-00…23`, più `05-sim-esito` chiaro e scuro).

Metodo: ho guardato ogni schermata del percorso una per una (24 chiare, 24 scure, 4 desktop, 2 esiti) e ho confrontato struttura, ritmo, gerarchia, spazi, tipografia, colore, illustrazioni, animazioni mostrate e resa del risultato. Ho ignorato numeri, prezzi, piani e testimonianze dei concept (inventati). Per capire a cosa si riferisce un numero ho letto `app/src/components/Onboarding.tsx` e `CalcoloRisultato.tsx`: la percentuale del risultato è la probabilità di superare il test, non il rischio di fallire come nei concept.

Limite dichiarato: nessun concept ha un tema scuro. Il giudizio sul tema scuro è quindi solo sull'implementazione, e le specifiche del tema scuro al punto 2 sono derivate, non copiate. Nelle schermate non ho visto lo stato «risposta selezionata» delle domande (compaiono solo hover o fuoco): non lo giudico.

---

## 1. Verdetto

Il cliente ha ragione a metà. Sul **risultato**, sul **calcolo** e sul **gancio iniziale** i concept sono decisamente migliori come presentazione. Sulle **schermate di domanda**, sul **contenuto onesto** e sull'**esito della simulazione** l'implementazione è pari o migliore. Il concept vince quasi solo dove c'è una gerarchia visiva forte: un eroe grande, un titolo con una riga di spiegazione, una scheda tinta con conseguenze, due livelli di pulsante. L'implementazione ha tolto quasi ogni riga di spiegazione e ogni elemento eroe, e il risultato è corretto ma muto.

### Per gruppo di concept

| Gruppo | Cosa mostra | Verdetto vs implementazione | Perché | Voto concept |
|---|---|---|---|---|
| **47** onboarding C (14 schermate) | Gancio «Hai l'OFA di inglese?», domande-scheda su certificazione e OFA, quiz, email «Salva i tuoi risultati», «Se non superi l'OFA…», risultato, poi paywall | **Migliore** su gancio, pain, certificazione/OFA, email. **Peggiore** su tutto dopo la 8 (piano a pagamento) | Titolo da 32 px con parola in colore, sottotitolo, illustrazione grande, pulsante: tre livelli chiari. «Se non superi l'OFA…» ha quattro frasi intere, non frammenti. Certificazione e OFA sono domande intere con scelte a due righe e arrivano **prima** del quiz | 7 |
| **05** onboarding invito | Gancio, guida gratuita, quiz 3/10, risultato 32%, verifica account, invita 3 amici, regalo, classifica | **Peggiore / pari** | Il meccanismo «sblocca invitando amici» è l'opposto del prodotto. Le schermate di quiz e di risultato sono più povere del 43. Unica idea buona: sottotitolo sotto ogni titolo | 5 |
| **30, 31, 34, 36** flussi a/b/c/d (app intera) | Splash blu, onboarding con illustrazione, test iniziale, livello con radar, home, studio, simulazioni, classifica, profilo | **Pari** sul quiz, **migliore** sul momento di marca (splash e onboarding), **peggiore** sul radar | Layout calmo e coerente, ma micro-testi spesso illeggibili (artefatti dell'IA), titoli di altezza diversa nella stessa tavola. Il radar a 4 assi (Grammar, Writing, Vocabulary, Reading) non è replicabile: l'app misura solo Grammatica e Traduzione | 6 |
| **09** calcolo (6 stati) | Titolo e sottotitolo che cambiano ad ogni stato, arco 0%→82%, elenco Grammatica/Comprensione/Vocabolario/Ragionamento che si spunta, risultato con 4 righe | **Migliore** | Comunica «sta lavorando davvero» con titolo che cambia, elenco che si completa e barra piena «10/10». L'implementazione ha una schermata ferma con tre spunte già messe: onesta, ma senza tensione né ritmo | 7 |
| **10** risultato dettaglio | Come 09 più «Analizzando le aree» (barre per area), «Fattori considerati», curva a campana con «Tu», istogramma studenti che superano/non superano | **Migliore** come rappresentazione, **peggiore** come contenuto | Il pannello cambia a ogni stato, quindi lo schermo non è mai vuoto. Ma la maggior parte dei dati (confronto con altri studenti) non esiste nell'app | 8 |
| **20** risultato sei | 6 stati, arco spesso con sfumatura e pallino con alone, elenco icona + area che si spunta, risultato con 4 righe e «Continua» | **Migliore**, la più pulita | Un solo eroe (l'arco), un numero da ~48 px, una didascalia sotto, una scheda tinta, un pulsante. Nessuna informazione concorrente | 8 |
| **29** risultato sei b | Arco più sottile, didascalia sotto il numero, riquadro unico «Rischio elevato» | **Pari / peggiore** del 20 | Più vuoto, il riquadro unico è allarmista e dice poco. Un solo dettaglio utile: la didascalia su due righe sotto il numero | 6 |
| **42** risultato animazioni | Arco con scia, icone che orbitano, schegge e raggi nel finale | **Migliore come spettacolo, non utilizzabile** | È la tavola più memorabile, ma quasi tutto è decorazione vietata dal progetto (scia, orbite, esplosione, coriandoli). Il fotogramma finale (82%, didascalia a due righe, nessuna scheda) mostra anche che con troppa scena il numero perde forza | 7 come design, 3 come materiale copiabile |
| **43** risultato sette | Arco con tacche, «Analizzando le aree» con barre, «Fattori considerati», risultato con scheda 4 righe, istogramma con «Tu», due pulsanti | **Migliore**, la più completa | È la tavola con il risultato più ricco ma ancora ordinato. Il doppio pulsante (primario «Continua» + secondario «Scopri come migliorare») è la cosa più utile da riprendere | 8 |

### Voti, scala 1-10

| Parte | Miglior concept | Implementazione chiaro | Implementazione scuro |
|---|---|---|---|
| Gancio / pain (schermata 00) | 7 (47-001, 47-007) | 4 | 4 |
| Perché farlo / gain (01) | 7 (47-004) | 6 | 6 |
| Domanda (02…20, pari) | 7 (47-005, 34-003) | 7 | 7 |
| Richieste di profilo (email, scuola, sede, livello, corso, anno, certificazione, OFA, provenienza) | 7 (47-002, 47-003, 47-006) | 5 | 5 |
| Consensi | n.d. (il concept non li ha) | 4 | 4 |
| Calcolo (22) | 8 (20, 43) | 5 | 5 |
| Risultato (23) | 8 (43-006, 20-006) | 5 | 5 |
| Esito simulazione (05-sim-esito) | 6 (31-010, 30-011) | 7 | 7 |
| **Percorso nel complesso** | **8** | **6** | **6** |

Note sui voti. Il tema scuro è coerente con il chiaro: stessi pesi, contrasti leggibili, accenti riportati bene. Non è peggiore, e il suo difetto principale (traccia dell'arco quasi invisibile) è lo stesso del chiaro. Il 6 complessivo è dato da un funnel con ottima base (token, icone, bottoni, tipografia, accessibilità) ma pochissima regia: ogni schermata ha lo stesso peso, lo stesso pulsante «Avanti», nessun picco emotivo.

---

## 2. Cosa l'implementazione dovrebbe PRENDERE dai concept (in ordine di effetto)

Le misure sono riferite a una larghezza di 400 px, margini laterali di 20 px, come negli screenshot. Colori e token restano quelli esistenti dell'app (`alto/medio/basso`, `azione`, `superficie-2`).

### P1. Risultato: l'arco diventa l'eroe  (concept 43-006, 20-006, 09-006)

Nel concept: l'arco occupa quasi tutta la larghezza (≈ 250 px su 262), spessore circa il 10-12% del diametro, pallino con anello bianco e leggero alone, numero a 44-48 px con peso 800 nel colore della fascia, didascalia colorata subito sotto. Tutto il resto della schermata (scheda con righe, pulsanti) è chiaramente secondario.

Nell'implementazione (23): arco di ≈ 250 px con spessore ≈ 7% del diametro, traccia grigio chiaro, numero di ≈ 60 px **senza didascalia** («2 %» e basta), due chip e un banner subito sotto che competono con l'arco. Il titolo «Risultato» e il chip «5/10» stanno sopra l'arco con lo stesso peso.

Come riprodurlo:
- Viewbox 300 × 170, raggio 130, **spessore 28** (non 16-18), estremi arrotondati. Larghezza in pagina 300 px (non 250).
- Riempimento con sfumatura statica dalla tinta della fascia alla sua versione piena (nel concept è arancio→rosso; nell'app, `basso-tinta`→`basso-pieno`, `medio-…`, `alto-…`). Nessuna animazione.
- Pallino di raggio 13 con anello di 4 px del colore della superficie e ombra morbida (0 2 6 rgba 20% sul tono). Il pallino sta **sull'asse dell'arco**, non fuori (vedi problema 5.3).
- Minimo visibile: sotto il 6% il riempimento resta di 6% di arco, così che 1-2% non somigli a un caricamento fallito.
- Tacche discrete sul bordo esterno (come in 43-006) ogni 10%, opacità 25%: danno precisione e aspetto di strumento.
- Numero 52/56 px, peso 800, `tabular-nums`, senza spazio fra cifra e «%» (la Home già fa `.replace(/\s+%/, '%')`).
- Didascalia 15 px, peso 700, colore `…-testo` della fascia, sotto il numero: **«probabilità di superare il test»**.
- Titolo «Risultato» e chip «5/10» scendono di livello: titolo 24 px a sinistra, sottotitolo grigio sotto («Ecco la tua stima attuale»), come in 43-006 e 20-006. Il chip «5/10» diventa una riga di testo sotto l'arco («5 risposte esatte su 10»).

### P2. Risultato: struttura a tre blocchi + due pulsanti  (43-006, 10-006)

Nel concept: titolo + sottotitolo → arco → scheda tinta (4 righe icona + frase breve) → pulsante primario → pulsante secondario con icona libro «Scopri come migliorare».

Nell'implementazione: titolo + chip, arco, 2 chip senza etichetta, banner tinto con **solo il titolo** («Hai margine», la spiegazione sta dietro la «i»), tessere n/m, tag «Da ripassare», pulsante unico «Avanti».

Come riprodurlo: vedi la specifica della schermata 23 al punto 4. In sintesi: la scheda tinta contiene tre righe vere (punteggio probabile, soglia, argomenti da ripassare) con la fascia scritta a parole; le tessere n/m scendono sotto; la CTA primaria dice cosa succede dopo e c'è un secondario («Ripassa gli argomenti sbagliati»).

### P3. Risultato: posizione rispetto alla soglia, ma con dati veri  (10-005, 43-005)

Nel concept: curva o istogramma con il marcatore «Tu» e la legenda «Studenti che superano / non superano». Funziona perché fa **vedere** dove sei rispetto a un traguardo.

Come riprodurlo senza inventare dati: barra orizzontale 0-30 (altezza 12 px, raggio 6), traccia `superficie-2`; segmento colorato dal punteggio minimo al massimo probabile (l'`intervallo.punteggio` che l'app già calcola, per esempio 10-20); segno verticale alla soglia (25) con etichetta «Soglia 25» sopra; tacche e numeri 0 · 10 · 20 · 30 sotto; etichetta «La tua stima» sul segmento. Niente popolazione di studenti, niente «sotto la media».

È la correzione più forte del risultato: oggi «2 %» e «Hai margine» dicono due cose opposte, la barra dice «sei qui, ti serve arrivare lì».

### P4. Calcolo: sequenza vera invece di schermata ferma  (09, 20-001…005, 43-001…004)

Nel concept: titolo e sottotitolo che cambiano ad ogni stato («Calcoliamo il tuo risultato» → «Elaboriamo…» → «Stiamo analizzando…» → «Quasi pronto…»), elenco con voci che passano da vuoto a rotella a spunta, barra «10/10» piena.

Nell'implementazione (22): titolo fisso «Calcolo», tre righe già spuntate, pulsante «Risultato» subito attivo. Corretto e onesto, ma non c'è passaggio: la schermata non fa niente.

Come riprodurlo rispettando le regole del progetto (niente animazioni decorative, niente conteggio che sale, niente alone che pulsa):
- Le tre tappe reali (risposte esatte, livelli, soglia) compaiono come righe già presenti, tutte con cerchio vuoto.
- Una alla volta (≈ 450 ms l'una) la riga passa a **rotella di caricamento** (lo spinner è consentito) e poi alla **spunta**; il cambio di colore ≤ 120 ms. Totale ≈ 1,5 s.
- Il numero della tappa è già scritto (4/10, 3 A1 · 2 A2 · 5 B1, 25/30) e cambia solo il segno a destra.
- Il titolo cambia due volte (testi al punto 4). Il pulsante compare attivo solo a fine sequenza. Con `prefers-reduced-motion` tutte le righe sono subito spuntate (cioè la schermata di oggi).
- **Nessun arco con percentuale che sale** (concept 09 e 20): sarebbe un conteggio finto, perché il risultato è già noto.

Se si decide che la regola «interfaccia statica» vale anche qui, almeno si prenda dal concept: titolo + sottotitolo veri, barra piena, e il pulsante diventa «Vedi il risultato».

### P5. Gancio e pain: domanda di riconoscimento e frasi intere  (47-001, 47-007, 05-001)

Nel concept: la prima schermata è una domanda che chi ha l'OFA riconosce al volo («Hai l'OFA di inglese?», «inglese?» in colore), con sottotitolo e illustrazione grande, poi «Se non superi l'OFA…» con quattro frasi complete sotto un'illustrazione di ≈ 130 px.

Nell'implementazione (00): logo, illustrazione di ≈ 170 px, titolo «Se non superi» (frase sospesa, non dice mai **cosa**), tre righe-frammento: «<25/30 · Non superi» (ripete due volte la stessa cosa), «~30 € · Ogni tentativo», «1° anno · Solo esami» (incomprensibile da solo). Sull'intero schermo la sigla OFA compare solo nel logo.

Come riprodurlo: vedi schermata 00 al punto 4. Cambiamenti concreti: titolo 28/34 px peso 800 con «OFA di inglese» come termine in evidenza, quattro righe icona + frase da 16/22 px (riga alta 64-72 px, raggio 16, tinta corallo sul tondo dell'icona), illustrazione a 180 px, unico pulsante con etichetta che dice cosa succede.

L'illustrazione attuale (cubo azzurro con ali e €) è più pulita e coerente con il kit rispetto alle banconote dei concept: va tenuta.

### P6. Gain: sottotitolo e etichette ai numeri  (47-004)

Nel concept: «Verifica il tuo livello di inglese» + «10 domande, 3 minuti. Il risultato è immediato.»

Nell'implementazione (01): titolo «Con AddiOFA» (non dice cosa), quattro righe generiche, e due chip «10» e «3 min» **senza etichetta** (10 cosa?). Testo al punto 4.

### P7. Certificazione e OFA: domande intere con scelte a due righe  (47-002, 47-003, 31-003)

Nel concept: titolo-domanda completo («Hai già una certificazione di inglese riconosciuta dal Polimi?», «Hai l'OFA di inglese assegnato?»), riga di aiuto («Puoi verificarlo sulla tua pagina di iscrizione al Polimi»), scelte come schede da ≈ 60 px con etichetta e sotto-etichetta («Cambridge, IELTS, TOEFL…»), scelta attiva con bordo e tinta.

Nell'implementazione (18, 20): titoli di una parola («Certificazione?», «OFA di inglese?») con icona; scelte nude Sì / No / Non so. Chi non sa cos'è una certificazione riconosciuta non ha aiuto.

**Più importante dell'aspetto:** nel concept queste due domande vengono **prima del quiz** (schermate 2 e 3). Nell'implementazione arrivano a metà e a fine quiz (schermate 18 e 20), cioè uno studente già esonerato fa nove o dieci domande inutili prima di scoprirlo. Va spostato (punto 4 e problema 5.1).

### P8. Email: perché la chiedi, e che ne fai  (47-006, 34-004, 31-004, 05-006)

Nel concept: titolo che promette un vantaggio («Salva i tuoi risultati»), una frase che spiega perché, campo, riga con lucchetto sulla sicurezza dei dati, illustrazione di una busta.

Nell'implementazione (04): titolo «La tua email», un'illustrazione piccola, etichetta del campo con un **badge ambra «Non verificata» già visibile a campo vuoto**, niente spiegazione. Ispira ansia e non fiducia. Testo al punto 4.

### P9. Sottotitolo sotto ogni titolo, CTA con verbo  (tutti i concept)

Nei concept ogni schermata ha un'etichetta del pulsante che dice cosa segue («Inizia la verifica», «Inizia il quiz», «Scopri come evitarlo», «Vai al tuo percorso»). Nell'implementazione 19 schermate su 24 hanno «Avanti» come pulsante. Specifica per tutte nel punto 4.

### P10. Tema scuro (nessun concept: regole derivate)

- Traccia dell'arco: oggi nel scuro è `#1f2a44` su `#111a2e`, rapporto ≈ 1,3:1, e a 1-2% l'arco sembra assente. Alzarla a ≈ 2:1 sulla superficie (`#2a3858`) e tenere il minimo del 6% di riempimento.
- Il pallino con anello: l'anello del colore della superficie scura (non bianco).
- Numero e didascalia: i toni «numero» scuri già esistenti (`#e98d5f` ecc.) vanno bene; verificare ≥ 4,5:1 su `superficie`.
- Scheda tinta del risultato: oggi in scuro è un marrone saturo che pesa; usare la tinta al 14% di opacità sul fondo, bordo da 1 px dello stesso tono al 30%.
- Barra del punteggio: segmento con colore di fascia, tacche al 40% di bianco.
- Illustrazioni: già hanno variante con aloni semitrasparenti (`fondoScuro`): usarle sempre.
- Pulsante primario: già corretto (blu chiaro con testo scuro).

---

## 3. Cosa NON copiare, e perché

1. **Tutti i numeri, i prezzi, i piani, le testimonianze** (47 dalla schermata 9 in poi, 31/30 con «+100 pt», classifiche, badge): inventati o di un prodotto che non esiste. Il progetto è gratuito, senza account obbligatorio, senza pagamenti.
2. **Il quadro «Rischio di fallimento» / «Probabilità di non superarlo» / «Rischio elevato»** (09, 10, 20, 29, 42, 43, 47-008, 05-005): paura come leva, in rosso, con costi addosso (~30 €, anno perso). Il progetto dichiara «niente urgenza finta» e la stima è onesta solo se detta nel verso giusto: **probabilità di superare**, con intervallo. La riga «~30 € ogni tentativo» e le conseguenze del pain vanno **verificate sulla fonte ufficiale** prima di restare in pagina; i concept non sono una fonte.
3. **«Confrontiamo le tue risposte con migliaia di studenti del Polimi»** (09-002, 10-002, 20-002, 43-002) e «Il tuo risultato è inferiore alla media degli studenti che superano l'OFA» (10-005, 43-005): affermazioni su dati che l'app non ha. Falso scritto in pagina.
4. **L'istogramma «Studenti che superano / non superano»** (10-005, 43-005): rappresenta una popolazione inventata. Si copia solo l'idea del marcatore («Tu»), con la barra del punteggio probabile (P3).
5. **«ATLAS adatta le domande al tuo livello in tempo reale»** (30-004, 31, 34-003, 36-003): se il diagnostico è fisso, è una promessa non mantenuta.
6. **Stemma e nome del Politecnico** (47-001, 47-006): l'app dice «Progetto studentesco indipendente, non affiliato». Mai lo stemma né il nome come marchio.
7. **Animazioni: arco che sale 0→82%, scia, pianeti/icone che orbitano, schegge, raggi e burst finale** (09, 20, 42, 43): decorazione vietata, e il conteggio che sale è un conteggio finto. Si prende il principio (la sequenza segnala lavoro), non la scena.
8. **Meccaniche di sblocco e inviti** (05-007…010, 47-009…014): non esistono nel prodotto.
9. **Ricolorare tutto in rosso** (47 è un'intera variante corallo): il blu è il marchio e il corallo è la fascia «basso» nell'app; usarlo ovunque svuoterebbe il suo significato.
10. **Radar a 4 assi** (30-005, 31, 34-004, 36-004): l'app misura Grammatica e Traduzione e livelli A1/A2/B1. Un radar a due assi è una linea. Le tessere n/m che già ci sono sono la rappresentazione giusta.
11. **Segni dell'IA**: micro-testi illeggibili, loghi deformati (stemma), icone diverse per stile fra schermate gemelle, titoli di altezze diverse. Il kit vettoriale dell'app è più coerente: è un punto a favore dell'implementazione.
12. **Il percorso a 4-5 segmenti di avanzamento** (47) e **la barra continua «3/20»** (34): nessuna delle due è migliore dei 13 segmenti attuali; il problema delle tacche è altrove (5.8).

---

## 4. Specifica finale, schermata per schermata

Premesse valide per tutto il percorso: un solo formato di test (30 domande, 15 minuti, soglia 25/30); niente «Pass», «Sblocca», «Gratis/Prova», «beta», «presto», «in arrivo»; testo in «tu», frasi brevi; pulsante primario sempre in basso, altezza 56 px, raggio 16; titolo 28/34 px peso 800, sottotitolo 15/22 px `testo-tenue`; i colori sono i token esistenti.

### 4.0 Ordine consigliato (rispetto ai 24 schermi attuali)

Oggi: pain → gain → Q1-Q2 → email → Q3 → provenienza → Q4 → scuola → Q5 → sede → Q6 → livello → Q7 → corso → Q8 → anno → Q9 → certificazione → Q10 → OFA → consensi → calcolo → risultato (24 schermate; tra l'ultima domanda e il risultato due schermate di modulo).

Proposto (17-18 schermate):

1. Pain
2. Gain
3. Certificazione (se sì: percorso breve, nessun quiz; l'`esente` esiste già)
4. OFA assegnato
5. Q1, Q2
6. Email e consensi (una schermata: email, tre consensi facoltativi sotto, informativa in foglio)
7. Q3, Q4
8. Come ci hai conosciuto (con «Salta»)
9. Q5, Q6
10. Cosa studi (schermata 1 di 2: scuola e sede)
11. Q7, Q8
12. Cosa studi (schermata 2 di 2: livello, corso, anno)
13. Q9, Q10
14. Calcolo → Risultato

**Dopo la decima domanda non c'è più nessun modulo.** Il momento di massima attesa va dalla risposta al numero senza interruzioni (come nel concept 09, che parte da «10/10»).

Se la sequenza deve restare com'è per scelta di prodotto, le due regole minime sono: certificazione e OFA prima del quiz; consensi prima della Q10, non dopo.

### 4.1 Schermata 00 · Pain

- **Struttura**: logo a sinistra e «i» a destra (invariati, riga alta 56 px). Illustrazione cubo-€ con ali, 180 px di altezza, centrata, 24 px sotto il logo. Titolo. Quattro righe. Pulsante.
- **Titolo** (28/34, 800, due righe): «Se non superi l'OFA di inglese…» con «OFA di inglese» in `azione`.
- **Righe** (icona in tondo corallo 40 px + frase 16/22 peso 600, riga alta 64 px, 10 px fra le righe):
  1. «Non superi il test: servono 25 risposte esatte su 30»
  2. «Ogni nuovo tentativo costa circa 30 €» *(verificare l'importo sulla fonte ufficiale prima di pubblicare)*
  3. «Resti con gli esami del primo anno» *(verificare la conseguenza esatta sul regolamento; se non è certa, togliere la riga)*
  4. «Fino a che non lo superi, il secondo anno resta in sospeso» *(idem)*
- **Pulsante**: «Scopri a che punto sei»
- **Dietro la «i»** (foglio): «Il Politecnico chiede un livello d'inglese per iscriversi con tranquillità. Questo sito è un progetto studentesco indipendente, non affiliato al Politecnico di Milano.»

### 4.2 Schermata 01 · Gain

- **Struttura**: illustrazione bersaglio (invariata, 180 px), titolo, sottotitolo, quattro righe, riga di due indicatori con etichetta, pulsante.
- **Titolo**: «Arrivi al test sapendo come stai messo»
- **Sottotitolo**: «10 domande, circa 3 minuti. Il risultato è subito.»
- **Righe** (icona tonda verde + frase 16/22 peso 600):
  1. «Una stima onesta della tua probabilità di superare»
  2. «Quali argomenti ripassare, in ordine»
  3. «Simulazioni da 30 domande in 15 minuti»
  4. «Il tuo percorso sempre con te, nel dispositivo»
- **Indicatori**: «10 domande» e «3 minuti» (non «10» e «3 min»).
- **Pulsante**: «Inizia le 10 domande»

### 4.3 Schermate 3-20 (pari) · Domanda

Struttura attuale giusta; cambiano pochi dettagli.
- Sopra la domanda: «Domanda 3 di 10» (13 px, `testo-tenue`) al posto del chip con icona «3/10».
- Sotto: la frase con il vuoto (20/28, peso 700). Una riga di aiuto prima della frase, 13 px tenue: «Scegli la forma corretta».
- Scelte: scheda 56-62 px, raggio 14, cerchio a sinistra. Stato selezionato: bordo 2 px `azione`, fondo `azione-tinta`, cerchio pieno con punto bianco.
- Pulsante disattivato: fondo `superficie-2`, testo `testo-tenue` (non il blu al 40%, che ha bianco su celeste a ≈ 1,8:1). Attivo: blu pieno. Etichetta: «Avanti» per le prime nove, **«Vedi il risultato»** per la decima.
- Nessun feedback immediato giusto/sbagliato (il diagnostico non deve influenzare le risposte successive).

### 4.4 Richieste di profilo

Principio: ogni richiesta ha titolo (la domanda), una riga di perché (13-14 px), la risposta, e una sola azione; le scelte fatte restano in una **sola riga di riepilogo** (non in 3-4 chip impilati).

**Email e consensi (una schermata)**
- Titolo: «Salva i tuoi risultati»
- Sottotitolo: «Scrivi la tua email PoliMi: ci serve per tenere i tuoi progressi e per la classifica NOI, se vuoi.»
- Campo: etichetta «Email PoliMi», segnaposto «nome.cognome@mail.polimi.it».
- Sotto il campo (13 px, con lucchetto): «Usiamo la tua email solo per l'iscrizione. Dettagli nell'informativa.»
- Il badge: nessuno a campo vuoto. Dopo l'inserimento, riga neutra grigia «Non ancora verificata» (mai ambra, mai prima di scrivere).
- Consensi, uguali all'attuale (nessuno preselezionato), con titoli: «Compari nella classifica NOI», «Personalizzazione con ATLAS», «Novità da Project e Agorà». Sotto, **due righe** e un link «Informativa completa» che apre il foglio; il paragrafo lungo di oggi va nel foglio.
- Intestazione dei consensi: «Facoltativi: puoi andare avanti anche senza.»
- Pulsante: «Avanti»

**Come ci hai conosciuto?**
- Titolo: «Come ci hai conosciuto?»
- Sottotitolo: «Ci aiuta a capire dove farci trovare. Puoi saltare.»
- Scelte: «Gruppo o chat», «Instagram», «Amici», «Altro». Link «Salta» sotto il pulsante (invariato).

**Cosa studi (schermata 1 di 2): scuola e sede**
- Titolo: «Cosa studi al Poli?»
- Sottotitolo: «Scuola e sede.»
- Scuole come elenco di righe a larghezza piena (non schede 2×2 con 4 righe di testo a 12 px): «Ingegneria Industriale e dell'Informazione (3I)», «Ingegneria Civile, Ambientale e Territoriale», «Architettura Urbanistica Ingegneria delle Costruzioni (AUIC)», «Design». Icona uguale per tutte (libro), **mai la pila di libri con bandiera inglese** della scheda attuale di AUIC.
- Sede subito sotto (Milano Leonardo, Milano Bovisa, Cremona, Lecco, Piacenza, Università partner), come righe.
- Riepilogo delle scelte fatte: una riga di testo piccolo sopra il titolo («3I · Milano Leonardo · Triennale · Engineering Science»), con «Modifica».

**Cosa studi (schermata 2 di 2): livello, corso, anno**
- Titolo: «Che corso fai?»
- Sottotitolo: «Livello, corso e anno.»
- Livello come tre segmenti (Triennale · Ciclo unico · Magistrale), corso come elenco con «Cerca il corso», anno come tre pulsanti 1° · 2° · 3°.

**Certificazione (prima del quiz)**
- Titolo: «Hai già una certificazione di inglese riconosciuta dal Politecnico?»
- Sottotitolo: «Cambridge, IELTS, TOEFL e simili. Se ce l'hai, controlla sul sito del Poli se ti esonera dal test.»
- Scelte (scheda con etichetta + sotto-etichetta):
  - «Sì, ce l'ho» / «Cambridge, IELTS, TOEFL…»
  - «No, non ce l'ho» / «Faccio il test di prova»
- Pulsante: «Avanti». Se «Sì»: foglio breve (schermata `certInfo` esistente) e l'utente può uscire dal diagnostico.

**OFA assegnato (prima del quiz)**
- Titolo: «Hai l'OFA di inglese assegnato?»
- Sottotitolo: «Lo vedi nella tua pagina personale dell'iscrizione al Poli.»
- Scelte: «Sì, ce l'ho» · «No» / «Allora il test serve solo come esercizio» · «Non lo so» / «Va bene, puoi controllarlo dopo».
- Pulsante: «Inizia le 10 domande»

### 4.5 Schermata 22 · Calcolo

- **Barra di avanzamento**: tutti i segmenti pieni, allineata al margine sinistro dei contenuti (20 px), non spostata di 40 px come oggi.
- **Illustrazione** `documento-in-corso`, 112 px (invariata).
- **Titolo** che cambia due volte: «Calcoliamo la tua stima» → «Quasi pronto…» → «Stima pronta».
- **Sottotitolo**: «Tre passaggi, pochi secondi.» → «Applichiamo la soglia del test.» → «Eccola.»
- **Righe** (icona + etichetta piccola + numero, come oggi):
  1. «Risposte esatte» · «4 su 10»
  2. «Livelli delle domande» · «3 A1 · 2 A2 · 5 B1»
  3. «Soglia del test» · «25 su 30»
- **Stato di ogni riga**: cerchio vuoto → rotella → spunta (una alla volta, ≈ 450 ms; ≤ 120 ms di cambio colore; con riduzione del movimento sono subito tutte spuntate).
- **Pulsante**: «Vedi il risultato» (compare attivo alla fine; fino ad allora disattivato con lo stile di 4.3).
- **Nessuna frase** di confronto con altri studenti.

### 4.6 Schermata 23 · Risultato

Struttura dall'alto:
1. **Barra di avanzamento** piena, allineata.
2. **Titolo** «Il tuo risultato» (24/30, 800, a sinistra) e sottotitolo: «Ecco la tua stima attuale. Con dieci domande è approssimata.»
3. **Arco** (specifica P1), centrato, 300 px: numero (senza spazio prima del %), didascalia «probabilità di superare il test».
4. **Riga di conteggio** sotto l'arco: «5 risposte esatte su 10».
5. **Barra del punteggio** (P3): titolo piccolo «Punteggio probabile al test», segmento 10-20 su 0-30, segno alla soglia con «25», etichetta «La tua stima: 10-20 su 30». Accanto, la «i» «Come viene calcolata la stima» (come oggi).
6. **Scheda tinta** della fascia, titolo + una frase **visibile** (non solo dietro la «i»):
   - alto: «Hai buone basi» · «Con queste risposte la stima è favorevole. Dieci domande sono poche: una simulazione da 30 lo conferma.»
   - medio: «Sei vicino alla soglia» · «Oggi potrebbe andare in un modo o nell'altro. Ripassa gli errori e prova una simulazione.»
   - basso: «Per ora sei sotto la soglia» · «Servono 25 risposte esatte su 30: con dieci domande la stima parte bassa anche andando bene. Non è un giudizio su di te.»
7. **Tessere n/m** (come oggi) con etichette che si capiscono: «Grammatica 5/10», «Livello A1 · 1/3», «Livello B1 · 3/5». Se un'area ha lo stesso totale del conteggio sopra (qui Grammatica 5/10), toglierla.
8. **Da ripassare**: massimo 3 argomenti come tag, poi «Altri N»; sopra la riga «Da ripassare» (con icona). Se nessuno: «Nessun errore».
9. **Pulsante primario**: «Inizia a ripassare» (porta al primo argomento sbagliato). **Secondario** (contorno): «Fai una simulazione da 30 domande».

Il pulsante «Avanti» che oggi chiude il funnel sta nel flusso (`onFinish`): se è un passaggio obbligato verso la Home, il primario può essere «Vai alla tua Home» e il ripasso essere la scheda più in evidenza della Home. Scegliere una delle due, non lasciare «Avanti».

### 4.7 Esito simulazione (05-sim-esito), correzioni minime

La schermata è buona (supera il concept 11 per contenuto: risposte giuste/sbagliate/non date, confronto con la volta prima, «Correzioni» e «Rifai»). Tre correzioni:
- Il tratto scuro a destra dell'arco (a ≈ 83%) è la soglia 25/30, ma sembra un artefatto: aggiungere l'etichetta «25» sopra il segno e farlo sporgere simmetricamente oltre l'arco.
- L'illustrazione documento + «X» sopra (≈ 100 px) è ridondante con il pillola «Non superata»: toglierla o ridurla a 56 px accanto al titolo «Esito». Il guadagno è l'arco più alto in pagina.
- Il numero «0/30» sull'arco a ≈ 40 px: portarlo a 52 px, peso 800, come il risultato del funnel, così i due archi parlano la stessa lingua.

---

## 5. Problemi dell'implementazione indipendenti dai concept

Ordinati per gravità.

1. **Ordine e numero di schermate.** 24 schermate prima del numero; dopo l'ultima domanda altre due di modulo (OFA, consensi) che spezzano l'attesa; certificazione e OFA (che possono esonerare) arrivano alla Q9-Q10. Una persona esonerata fa 9-10 domande inutili. Alta gravità.
2. **Il numero del risultato non dice che cosa è.** «2 %» senza didascalia visibile (l'etichetta c'è solo per lo screen reader). Nell'app Home la didascalia c'è, nel funnel no. In più c'è uno spazio fra la cifra e il «%». Alta.
3. **Resa dell'arco ai valori bassi.** A 1-2% il pallino sta fuori dall'asse dell'arco, a ore 7, con un **mezzo cerchio rosa residuo sotto** (artefatto dell'ombra o dell'alone, visibile nel chiaro 400 px); il riempimento è invisibile, quindi l'arco sembra un caricamento fallito. Alta.
4. **Messaggio e numero contraddittori.** «Hai margine» sotto «2 %» in corallo; la spiegazione sta dietro una «i» che molti non apriranno. Media-alta.
5. **Pain senza contesto.** Il titolo «Se non superi» non completa mai la frase; l'OFA è nominata solo nel logo; le tre righe sono frammenti, di cui due ripetono la stessa cosa («<25/30» e «Non superi»). Per chi non sa cos'è l'OFA, la schermata non spiega nulla. Alta.
6. **Indicatori senza etichetta.** Nel gain «10» e «3 min»; nel risultato «10-20» e «25» con icone righello e frecce, comprensibili solo aprendo la «i». Media.
7. **Pulsante «Avanti» ovunque** (19 schermate su 24). Le etichette non dicono cosa succede; nelle ultime tre schermate è il primo dubbio. Media.
8. **Barra di avanzamento a 13 tacche.** Alla prima domanda mostra già 3 su 13 piene (pain, gain contati); le tacche sono sottili (≈ 4 px) e a 400 px si contano a fatica; in calcolo e risultato manca il tasto indietro ma la barra mantiene lo spostamento a sinistra di ≈ 40 px, quindi non è allineata al margine dei contenuti (20 px). Media.
9. **Pulsante disattivato.** Bianco su celeste al 40% (≈ 1,8:1): è la prima cosa che si vede in ogni domanda, e sembra rotto. Media.
10. **Email con badge ambra «Non verificata» a campo vuoto** e senza perché. Allarma prima ancora di scrivere. Media.
11. **Schede della scuola.** Illustrazioni di stile diverso (barre, globo, **pila di libri con bandiera inglese** per Architettura, lampadina), altezze diverse, nomi lunghi a 12 px su 4-5 righe. Media.
12. **Chip di riepilogo impilati.** Fino a quattro chip («3I», «Milano Leonardo», «Triennale», «Engineering Science») su due righe consumano il 25% dell'altezza prima della domanda; «3I» da solo non si capisce. Media-bassa.
13. **Consensi.** Un paragrafo di 11 righe a 12 px sotto tre scelte, il pulsante attivo anche senza nulla spuntato. Informativa ineccepibile ma illeggibile in quel posto. Media.
14. **Tag «Da ripassare».** Con poche risposte giuste i tag diventano 5-6 (Present Continuous, Question Tags, Possessives, Second Conditional, There is / There are, First Conditional): è un elenco di errori, non una priorità. Sembrano pulsanti ma non lo sono. Media-bassa.
15. **Tessera ridondante.** «Grammatica 4/10» ripete il totale «4/10» in cima. Bassa.
16. **Desktop (1280).** Il funnel è una carta da 500 px su fondo quasi vuoto, a 25 px dal bordo superiore; i contenuti non crescono, c'è molto vuoto fra il contenuto e il pulsante; l'arco da 250 px sembra piccolo in una carta larga 700. Non è un difetto grave, ma nessuna schermata ha un momento di marca sul desktop. Bassa.
17. **Tema scuro.** Traccia dell'arco ≈ 1,3:1 (invisibile a 1-2%); banner «Hai margine» marrone molto saturo. Per il resto il tema scuro è ben fatto, e dovrebbe essere il riferimento per la parte di tema nei prossimi cambiamenti. Bassa-media.
18. **Esito simulazione.** Segno di soglia non etichettato (sembra un artefatto), illustrazione ridondante, numero più piccolo del risultato del funnel. Bassa.

Cosa l'implementazione fa **meglio** dei concept e va difeso: contenuto onesto (probabilità di superare con intervallo e soglia), tessere n/m (mai percentuali precise su poche domande), tag degli argomenti veri, illustrazioni vettoriali coerenti, icone e token, accessibilità (etichette, tabular-nums, ruoli), tema scuro che esiste davvero, esito di simulazione con confronto «prima/ora», domande leggere e coerenti, formato di test unico.

---

## Riepilogo (8 righe)

1. Il cliente ha ragione su risultato, calcolo e gancio iniziale: i concept 43, 20 e 47 hanno gerarchia, eroe e CTA doppia che il funnel non ha; ha torto sulle domande, sul contenuto onesto e sull'esito simulazione, dove l'implementazione pareggia o vince.
2. Voti: miglior concept 8/10 (43, 20); implementazione 6/10 sia chiaro sia scuro (risultato 5, calcolo 5, pain 4, domanda 7, esito simulazione 7). Nessun concept ha il tema scuro.
3. Da prendere, in ordine: arco eroe con didascalia «probabilità di superare il test»; risultato a tre blocchi con due pulsanti; barra del punteggio con soglia 25 (al posto dell'istogramma inventato); calcolo in sequenza vera; pain con frasi intere; domande intere per certificazione e OFA con sotto-etichette; email con motivo e riga sulla sicurezza.
4. Da non copiare: tutto il contenuto fittizio, il quadro «rischio di fallimento», i confronti con «migliaia di studenti», lo stemma del Poli, ogni animazione di scia, orbita, burst, il paywall e gli inviti, il radar a quattro assi.
5. Problema strutturale più grave: 24 schermate, modulo dopo l'ultima domanda, certificazione e OFA (che possono esonerare) a fine quiz invece che all'inizio; proposta a 17-18 schermate, nessun modulo tra l'ultima risposta e il numero.
6. Il numero del risultato è senza didascalia, con spazio prima del «%», e a 1-2% l'arco ha il pallino fuori asse, una mezzaluna rosa residua e nessun riempimento: sembra un errore di caricamento.
7. «Hai margine» sotto «2 %» si contraddice; testi pronti (4.6) lo sostituiscono con «Per ora sei sotto la soglia» e una frase visibile, più la barra 10-20 contro soglia 25.
8. Tema scuro coerente ma la traccia dell'arco è a 1,3:1: alzarla a circa 2:1 e tenere un riempimento minimo del 6%; per la sequenza di calcolo usare solo spinner e spunte, senza conteggi che salgono.
