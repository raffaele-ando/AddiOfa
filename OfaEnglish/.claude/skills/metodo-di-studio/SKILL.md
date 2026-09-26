---
name: metodo-di-studio
description: "Il metodo di studio personale dell'utente, nato dall'app con cui ha superato l'OFA di Inglese del Politecnico di Milano: algoritmo di ripasso che misura davvero quanto sa, informazioni strutturate e mostrate al momento giusto, gamification «vera» basata su quanto ne sa (padronanza %, accuratezza, profilo per argomento, non livelli/XP/streak), tutto dinamico e progressivo, e si comincia con poco. Va adattato a qualsiasi esame. Usa questa skill ogni volta che l'utente deve preparare un esame o un test (esami universitari di ingegneria come Analisi, Fisica, Geometria, Informatica; TOLC, test d'ingresso, OFA, orali, certificazioni) o chiede un piano di studio, di essere interrogato in chat, esercizi, flashcard, statistiche sui progressi, simulazioni d'esame o un'app/sito per studiare, anche se non nomina il metodo."
---

# Il mio metodo di studio

Questa skill descrive **come studia l'utente e cosa funziona con lui**. Viene dall'app *OFA Polimi Prep* (repo `raffaele-ando/OfaEnglish`), che ha modificato molte volte finché non gli ha funzionato perfettamente; ha superato l'OFA di Inglese studiando solo da lì.

L'utente è stato esplicito su quali sono le parti migliori, cioè quelle su cui ha lavorato di più:
1. **l'algoritmo**, cioè come si scelgono le domande e come si misura se una cosa è davvero imparata;
2. **come sono strutturate e mostrate le informazioni**: cosa vede, dove e quando;
3. **la gamification vera**: la motivazione viene dal vedere **quanto ne sa** (padronanza, accuratezza, argomenti forti e deboli), **non** da livelli immaginari, XP o streak.

A questi si aggiungono due caratteristiche che attraversano tutto:
- **tutto è dinamico e progressivo** (§5): i numeri si calcolano e si adattano a lui (tempo atteso, voto, confidenza con tendenza, intervalli) e il feedback cresce con le risposte giuste della sessione (suoni che salgono di tono, coriandoli sempre più grandi);
- **si comincia con poco** (§6): un nucleo piccolo e sessioni brevi, così i primi passi riescono bene e la padronanza sale in fretta.

L'OFA era un quiz a risposta multipla. Un esame di Analisi, un orale di Fisica o un esame di programmazione sono un'altra cosa. **I tre pilastri restano, la forma cambia**: ogni volta chiediti "come si misura *quanto ne so* in questo esame, e come glielo mostro?".

---

## 1. Profilo dello studente

- **L'attenzione cala con la monotonia e la costanza è difficile.** Nel codice l'utente ha descritto la modalità principale come pensata per *"ADHD & Low Conscientiousness"*. Da qui: poco attrito, sessioni brevi, varietà, un riscontro immediato.
- **Lo motivano i dati veri su di sé.** Vuole vedere quanto sa, dove sbaglia, se sta migliorando. Gli piacciono le spiegazioni con il perché e le basi scientifiche (SM-2, interleaving).
- **Studia soprattutto dal telefono** (molte modifiche all'app sono servite solo al layout mobile), con tema chiaro/scuro a scelta e i dati sincronizzati.
- **Lingua**: italiano. Tono diretto e concreto.

## 2. Pilastro 1: l'algoritmo (misurare davvero quanto sa)

L'idea centrale: **una cosa è imparata solo se la ricorda bene, non se ci azzecca.** Ogni elemento di studio (domanda, esercizio-tipo, definizione, dimostrazione) ha uno **stato** che si aggiorna a ogni tentativo:

- risposte giuste, sbagliate e **omesse** (contate a parte);
- **voto di qualità da 0 a 5** dell'ultimo richiamo, calcolato da **segnali oggettivi** e non solo dall'autovalutazione:
  - quanto tempo ha impiegato rispetto al tempo atteso;
  - se ha cambiato risposta, partendo da quella giusta o da una sbagliata;
  - quanto ha esitato prima di confermare;
  - quanti tentativi gli sono serviti (nell'app gli aiuti — suggerimento dell'argomento, passaggio alle opzioni multiple — erano **gratuiti**, così la via d'uscita più facile non spaventava; negli adattamenti con aiuti a scalini gli aiuti invece pesano, vedi `references/algoritmo.md` §7);
  - e infine la **sicurezza dichiarata**: *Indovino* toglie 2 punti, *Incerto* 0,6, *Sicuro* niente;
- **SM-2**: con un voto di almeno 3 l'intervallo di ripasso cresce (1 giorno → 6 giorni → intervallo × facilità); sotto 3 si riparte da zero. Si tengono anche la **facilità** attuale e quella **precedente**, per mostrare la tendenza;
- **velocità personale**: il tempo atteso si adatta a lui con una media mobile esponenziale.

**Scelta di cosa studiare (modalità Smart, quella predefinita):** punteggio = *urgenza di ripasso* + *debolezza* (tasso di errore, bassa facilità) + *un po' di casualità* per mescolare gli argomenti. Si prendono i primi 10 elementi. Esistono anche Standard (solo SM-2), Weakness (solo errori), Blitz (tempo stretto) e Active Recall (produrre la risposta senza opzioni).

Formule, soglie e come adattarle a esercizi, domande aperte e chat sono in **`references/algoritmo.md`**. Il codice collaudato è in `assets/codice-ofa/spacedRepetition.ts`.

## 3. Pilastro 2: come strutturare e mostrare le informazioni

**La struttura dei dati viene prima di tutto.** Ogni elemento è etichettato con **categoria** (tipo di prova: es. Grammatica / Traduzione), **argomento**, **livello o difficoltà** e appartenenza al **nucleo**. Tutte le viste nascono da queste etichette più lo stato dell'algoritmo. Senza etichette buone non esistono radar, filtri né modalità Weakness.

**Ogni informazione compare nel momento in cui serve:**

| Momento | Cosa si mostra |
|---|---|
| **Apertura** | Un solo pulsante per iniziare (Smart). Subito sotto: **% padronanza** e **accuratezza** del materiale scelto (nucleo o tutto) |
| **Durante la domanda** | Numero della domanda, barra di avanzamento, timer e, dalla seconda giusta di fila, il contatore 🔥 "N x" che rimbalza. Niente altro che distragga |
| **Risposta** | In due tempi: tocca l'opzione (può cambiarla), poi **conferma con Indovino / Incerto / Sicuro**. I tre pulsanti *sono* il tasto di conferma: dichiarare la sicurezza non costa un tocco in più |
| **Subito dopo la risposta** | Se giusta: "Ottimo!", **spiegazione** (perché è giusta e perché la trappola è sbagliata), **categoria e argomento**. Se sbagliata: la giusta si illumina di verde, poi *Riprova* con l'opzione sbagliata disattivata; la spiegazione arriva quando ci arriva da solo |
| **Fine sessione** | "X su N **al primo tentativo**": conta solo il richiamo vero |
| **Simulazione** | Durante: nessun feedback, contatore delle risposte date, griglia per saltare tra le domande. Alla fine: SUPERATO/NON SUPERATO, punteggio rispetto alla soglia, tempo impiegato, e una revisione **solo delle sbagliate e delle omesse** (tua risposta, quella giusta, argomento, spiegazione): si guarda dove si è perso punti |
| **Statistiche** | Numeri di sintesi → profilo per argomento → per livello → andamento nel tempo → dettaglio per elemento ordinato **dai peggiori** |

La **scelta del materiale** (nucleo o tutto) si fa una volta e vale ovunque: sessioni, simulazione e numeri del menu.

Tutti i dettagli (definizioni delle metriche, colori semaforo, dettaglio per elemento, come tradurre le viste per esercizi e orali) sono in **`references/informazioni-e-statistiche.md`**.

## 4. Pilastro 3: la gamification vera (quanto ne so)

La motivazione viene da **numeri che misurano l'apprendimento reale** e che si muovono solo se sta imparando davvero:

- **% di padronanza (Domande Imparate)**: elementi imparati sul totale, dove "imparato" vuol dire che l'ultimo richiamo è stato buono (voto ≥ 3). Se poi sbaglia, l'elemento torna "da imparare": il numero è onesto.
- **Accuratezza**: **esito oggettivo del primo tentativo** (giuste / giuste + sbagliate), globale, per argomento e per elemento; per elemento con colori semaforo (oltre 70% verde, 40–70% giallo, sotto 40% rosso). Tienila **separata** dalla qualità del richiamo (voto, confidenza, imparato): sono due misure diverse e non vanno mescolate.
- **Profilo per argomento (radar)** e barre **imparate / da imparare** per argomento e per livello: si vede a colpo d'occhio dove è forte e dove no.
- **Confidenza per elemento** (dalla facilità SM-2, da 0 a 100%) con **freccia di tendenza** ↑ ↓ – rispetto al tentativo precedente.
- **Simulazioni**: esami superati, **pass rate**, **record**, distanza dalla soglia di sicurezza. È la misura di prontezza.
- **Tempo e attività**: domande al giorno e minuti studiati. È un dato informativo, non una quota, e anche lui è **onesto**: il tempo si conta solo quando la schermata è davvero aperta.

**I dati sui progressi sono preziosi**, perché sono loro la ricompensa: salvali sempre (in locale e sul cloud, con export) e non farli mai perdere o azzerare per errore.

**Cosa non lo motiva (non costruirci sopra niente):** livelli e XP immaginari (anche con i 50 XP regalati all'inizio), la **serie di giorni consecutivi**, obiettivi giornalieri fissi o sfide a fasi. XP, livello e sfida quotidiana sono stati provati nel menu e poi sostituiti da Imparate % e Accuratezza % (restano solo in fondo alle statistiche); il contatore dei giorni è rimasto come numerino nell'intestazione senza mai avere un ruolo (conta anche le semplici aperture dell'app). L'utente ha detto chiaramente che non sono quello che funziona con lui: in un progetto nuovo non metterli.

**Cosa conta come "imparato" è una scelta precisa.** La *copertura* (domande viste / totale) è stata provata e scartata perché cresce anche sbagliando. "Imparata" = ultimo voto ≥ 3 è volutamente una soglia bassa, così la padronanza si muove dal primo giorno; se la rendi più severa, accanto serve un numero che si muova subito. Mostra percentuali con una barra, non conteggi assoluti. Non vanno confusi con il **feedback progressivo dentro la sessione** (§5), che invece gli piace.

## 5. Tutto è dinamico e progressivo

L'utente ci tiene molto: **niente è fisso, tutto si calcola e si adatta a lui mentre studia.** Quando costruisci qualcosa per lui, fai in modo che ogni numero e ogni reazione sia calcolato dai suoi dati e cambi man mano.

- **Il tempo atteso** si calcola per ogni domanda (lunghezza del testo) ed è moltiplicato per il suo **fattore di velocità personale**, che si aggiorna a ogni risposta giusta con una media mobile.
- **Il voto** è continuo (per esempio 4,38 e non solo giusto/sbagliato) e viene da tempo, cambi di opzione, esitazione e sicurezza.
- **La confidenza per elemento** (dalla facilità SM-2) cambia a ogni risposta e mostra la **tendenza** ↑ ↓ – rispetto alla volta prima.
- **Gli intervalli di ripasso** crescono (1 → 6 → 16 → 45 giorni…) oppure crollano a 1 dopo un errore; la facilità ricorda che quella domanda era difficile.
- **La scelta delle domande** si riordina a ogni sessione in base a urgenza, debolezza e un po' di casualità.
- **Padronanza, accuratezza, radar e barre** si ricalcolano dopo ogni risposta.
- **Il feedback cresce con la serie di risposte giuste dentro la sessione**:
  - messaggio: "Ottimo!", poi "Fantastico! 🔥 N di fila!" dalla terza;
  - suono: accordo di Do maggiore con una scintilla acuta, il cui **tono sale** del 4% per ogni risposta giusta dopo la seconda, fino a +20%;
  - coriandoli: *mini* → *burst* dalla seconda di fila → *cannon* (due cannoni laterali) dalla quarta;
  - a fine sessione ed esame superato: fanfara e *celebration*;
  - vibrazione diversa per tocco, risposta giusta, risposta sbagliata e celebrazione;
  - un errore riporta tutto a zero, con un suono discendente morbido;
  - **anche la risposta giusta dopo il Riprova viene premiata** (serie che riparte da 1, accordo, coriandoli *mini*, spiegazione): la correzione si chiude con un piccolo premio;
  - i pulsanti **Indovino / Incerto / Sicuro sono rosso / giallo / verde**: il semaforo vale anche per l'autovalutazione.

  È una ricompensa **immediata e proporzionata a quanto sta andando bene adesso**. È diversa dalla serie di giorni (che non lo motiva): qui la serie dura una sessione e premia risposte vere. Suoni sintetizzati al momento (Web Audio API, niente file), con il pulsante per disattivarli. Codice: `assets/codice-ofa/audio.ts`.
- **Anche i dettagli visivi sono progressivi**: la barra di avanzamento si riempie con un'animazione, il timer diventa rosso e lampeggia negli ultimi 5 s, le barre si colorano a semaforo.

## 6. Cominciare con poco, per iniziare bene

Il metodo è pensato perché **i primi passi riescano bene**, così da voler continuare:
- **Un nucleo piccolo prima di tutto**: il "Primo Corpus" di 60 domande invece di 606. Con poco materiale la **padronanza sale in fretta e si vede** ("Imparate (su 60)": ogni domanda vale quasi il 2%), mentre su 606 la barra si muoverebbe appena. È la gamification vera che funziona fin dal primo giorno.
- **Sessioni da 10**: un traguardo vicino, che si chiude sempre con una schermata di fine ("X su N al primo tentativo") e una celebrazione.
- **Un tocco per iniziare**, senza configurare niente.
- **All'inizio vince il nuovo**: nella modalità Smart le domande mai viste hanno la priorità più alta (800–1000), quindi le prime sessioni sono varie e fresche. Il ripasso degli errori entra man mano che ci sono dati.
- **Dopo un errore si chiude comunque con la risposta giusta** (Riprova), così nessuna domanda finisce con un fallimento.
- **Da piccolo a grande**: prima il nucleo, poi il resto a blocchi per argomento; prima le sessioni, poi le simulazioni complete.

**Quando il materiale cresce, ricrea un nucleo piccolo.** Anche l'app è partita con 50 domande ed è cresciuta a blocchi fino a 606. Quando la barra "Imparate" non si muoveva quasi più, l'utente ha aggiunto la scelta "Primo Corpus (60)" con la sua padronanza separata. Se il materiale di un esame diventa grande, fai lo stesso.

**Vale anche per come rispondi.** Apri con **cosa fare adesso**: poche righe, il primo passo concreto (o direttamente la prima domanda). Poi il resto, in ordine di urgenza. Il piano completo, le tabelle e il materiale lungo vanno in fondo o in un file a parte. Niente muri di testo prima di poter cominciare: un messaggio iniziale lungo è attrito, come un menu con troppe scelte.

Per un esame nuovo: individua subito un nucleo **piccolo** (poche decine di elementi: gli esercizi-tipo più frequenti, le domande che tornano sempre) e mostrane la padronanza separata dal totale.

## 7. Principi della sessione

- **Si parte con un tocco solo**: un pulsante che avvia subito la modalità Smart. Ogni scelta prima di cominciare è attrito.
- **Sessioni brevi e con un tempo**: circa 10 domande, 30 s a domanda (Blitz 10 s). Il timer nasce dal ritmo dell'esame (OFA: 15 minuti / 30 domande = 30 s): **timer per elemento = tempo d'esame / numero di quesiti, Blitz ≈ un terzo**. Per esercizi lunghi: un esercizio-tipo o un blocco di 20–25 minuti.
- **Dopo un errore si riprova finché non è giusta**, con l'opzione sbagliata disattivata. Dopo il primo errore il timer si ferma: il nuovo tentativo è per capire, non per correre. Il tempo scaduto conta come "Indovino" sbagliato.
- **C'è sempre una via d'uscita più facile invece di mollare**: in Active Recall "Troppo difficile? Usa le opzioni multiple" riporta alle 4 opzioni; negli esercizi il prossimo aiuto a scalino. Si scende di un gradino, non si abbandona.
- **Richiamo attivo**: produrre la risposta invece di riconoscerla; il suggerimento dice solo l'**argomento**, gli aiuti arrivano a scalini.
- **Argomenti mescolati** e dritti sui punti deboli.
- **Prima il nucleo** (per l'OFA le prime 60 domande, cioè il banco originale; in generale le domande più frequenti all'esame, se le conosci), poi il resto a blocchi per argomento.
- **Simulazione più severa del vero**: formato e tempo reali, soglia più alta (25/30 invece di 24/30), nessun feedback, navigazione libera tra le domande.

## 8. Come lavorare quando arriva un esame nuovo

1. **Ricostruisci l'esame vero**: tipo di prova, durata, punteggio e penalità, soglia, data, materiali (i **temi d'esame passati** sono la fonte più preziosa). Se non lo sai, chiedi o cerca. Non inventare il formato di un esame universitario.
2. **Scegli l'adattamento**: leggi **`references/adattamento-per-esame.md`** (risposta multipla, TOLC con penalità, esercizi di ingegneria, teoria e orali, programmazione, memorizzazione, piano di studio).
3. **Definisci la struttura delle informazioni**: quali sono gli elementi, con quali etichette (categoria, argomento, livello, nucleo) e come si calcola "imparato" per questo esame.
4. **Scegli cosa produrre**, partendo dalla cosa più piccola che permette di iniziare oggi (e metti in cima alla risposta cosa fare adesso, §6): interrogazione in chat (§9), piano di studio, materiale (domande, esercizi con aiuti, flashcard), oppure un'app (leggi **`references/app-blueprint.md`** e riusa `assets/codice-ofa/`). Se non è chiaro, proponi una sola opzione consigliata e parti.
5. **Costruisci prima il nucleo**, poi il resto a blocchi per argomento.
6. **Misura dal primo giorno**: crea il registro (`scripts/registro.cjs init` + `import` degli elementi con argomento e nucleo), così padronanza e punti deboli sono calcolati e non stimati.
7. **Controlla la qualità**: **`references/banco-domande.md`**, più `node scripts/audit_bank.cjs <file>` per i banchi a risposta multipla.

## 9. Modalità tutor in chat

In chat non si possono misurare i tempi, ma l'algoritmo e la gamification vera si applicano lo stesso:
- **Parti subito** con la prima domanda: una o due righe di contesto, niente menu. Le prime domande devono essere alla sua portata e dal nucleo, così si comincia bene.
- **Blocchi da circa 10**, con contatore "3/10". **Una domanda alla volta.**
- **Chiedi la sicurezza (I / In / S).** Per le domande aperte e gli orali il voto si basa sui punti chiave coperti (`references/algoritmo.md` §7). Per le altre usa gli stessi valori del registro: giusta + S = 5; giusta + In = 4,4; giusta + I = al massimo 2,5, cioè da ripassare; ogni aiuto −1,5; giusta solo al secondo tentativo = al massimo 2,2; sbagliata = 0.
- **Dopo ogni risposta**: giusto o sbagliato, spiegazione breve, **argomento**. Se è sbagliata: secondo tentativo o una variante vicina prima di andare avanti.
- **Tieni lo stato di ogni elemento** e **riproponi** più avanti, in forma diversa, quelli con voto sotto 3.
- **Feedback progressivo anche in chat**: "Giusta ✅", poi "3 di fila 🔥", "5 di fila 🔥🔥". Si azzera con l'errore, senza drammi.
- **Mostra quanto ne sa, non punti**: alla fine del blocco dai un riepilogo con "X/10 al primo tentativo", accuratezza per argomento, cosa è ora *imparato* e cosa resta *da imparare*, e la tendenza rispetto alla sessione precedente se la conosci. Esempio: `Cinematica 4/5 ✅ · Dinamica 2/5 ⚠️ → da ripassare: attrito, piano inclinato`.
- **Tieni un registro dei progressi vero** se puoi eseguire comandi: `node scripts/registro.cjs` applica lo stesso algoritmo dell'app (voto, SM-2, scelta Smart) e calcola padronanza, accuratezza per argomento a semaforo, i peggiori con confidenza e tendenza, simulazioni. Comandi principali: `init`, `import`, `risposta <id> giusta --sicurezza In`, `prossimi 10`, `stato`, `simulazione 22 30`. Salva il file `progressi-studio.json` insieme al materiale. Se non puoi eseguire comandi, tieni la stessa tabella a mano (elemento, argomento, voto, data).

## 10. Cose da ricordare sempre

- I tre pilastri: **algoritmo onesto**, **informazioni strutturate e mostrate al momento giusto**, **gamification basata su quanto ne sa**.
- Il metodo si adatta, non si copia: per ogni esame ridefinisci gli elementi, le etichette e cosa vuol dire "imparato".
- Niente livelli, XP, serie di giorni o quote giornaliere come motore della motivazione. Sì al feedback progressivo dentro la sessione e a numeri che si calcolano e si aggiornano in continuo.
- **Si comincia con poco** (nucleo piccolo, sessioni brevi) perché i primi passi riescano bene.
- Ciò che è giusto per caso torna indietro. Il formato reale va ricostruito con esattezza e la simulazione va resa più severa.
