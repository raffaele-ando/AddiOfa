# Catalogo design allegati: NN 18-35

Blocco `grafica/fonti/design-concept/`, immagini NN 18 e 35 (ordine alfabetico, vedi `grafica/fonti/INDICE.md`). Ogni immagine è stata aperta e guardata. Confronto fatto con `app/src/screens/*.tsx`, `app/src/components/*.tsx`, `app/src/config/offer.ts`, `app/src/brand/`.

Convenzioni: **P** = priorità (alta = migliora subito il prodotto di lancio; media; bassa = rimandata o fuori dal lancio). **DA ADATTARE** = il design contraddice una regola del prodotto, con la correzione proposta. Le percentuali, i nomi e i numeri che compaiono nei mockup (82%, 12,4K follower, "Luca, Ingegneria", 62%/28% dopo N lezioni) sono segnaposto dell'AI e non vanno mai copiati come dati.

## Tabella riassuntiva

| NN | Tipo | Schermate | P | Schermata app |
|---|---|---|---|---|
| 18 | Schermate app (kit rosso) | 9: Profilo, Statistiche, Frasi e vocaboli, Test 3/10, Quiz completato 80%, Correzioni, Simulatore d'esame, Simulazione 12/40, Simulazione completata 76% | alta (Esito, Statistiche, Correzioni); media (Simulatore, Frasi); bassa (Profilo) | Esito / Statistiche / Simulazione / Teoria-Prontuario / Profilo |
| 19 | Schermate app (kit rosso) | Le stesse 9 di NN 18, numerate, con barra a 5 schede | come 18 | come 18 |
| 20 | Schermate app (kit blu) | 6: calcolo del risultato da 0% a 82% | alta (animazione), DA ADATTARE (testi) | Risultato del diagnostico |
| 21 | Schermata app (kit blu) | 1: Home "Il tuo rischio OFA" con fattori, come ridurre, percorso | media, DA ADATTARE | Home / Menu |
| 22 | Schermate app (kit blu) | 2: Sfide, Profilo | bassa (rimandata) | Profilo / Sfide |
| 23 | Brand kit blu | tavola unica: palette, illustrazioni, icone, UI | già nell'app | Brand kit |
| 24 | Icona app | 1: stella luminosa in rettangolo blu | media (icona PWA/store) | icona PWA, favicon |
| 25 | Schermate app (flusso, kit blu) | 8: Home + 7 schermate collegate (come è calcolato, fattori, lezione, dettaglio obiettivo, come cambia, percorso) | alta (spiegazioni), DA ADATTARE | Risultato / Home / Teoria |
| 26 | Social | 11 pannelli: profilo Instagram, highlight, formati, post, stories, reels, tono di voce, caption, applicazioni, pattern, copertine | bassa (dopo il lancio); media (formati e tono) | nessuna (marketing) |
| 27 | Brand kit blu | tavola identica a NN 23 | già nell'app | Brand kit |
| 28 | Brand identity (nuovo logo) | tavola: logo, griglia, palette, Inter, icone, componenti UI, applicazioni | media (decisione logo) | Brand kit / logo |
| 29 | Schermate app (kit blu) | 6: calcolo del risultato 0% a 82%, variante con icone di stato | alta (animazione), DA ADATTARE | Risultato del diagnostico |
| 30 | Schermate app (flusso completo con ATLAS) | 16: splash, 2 onboarding, test, risultati ATLAS, home, studia, lezione, esercizio, simulazioni, risultato sim., sfide, sfida, classifica, profilo Project ID, impostazioni | media; parti bassa | Landing / Onboarding / Home / Teoria / Esito / Impostazioni |
| 31 | Schermate app (flusso completo senza ATLAS) | 14: splash, onboarding, "già sostenuto?", email Polimi, test, home, lezione, esercizi, fine lezione, simulazioni, lezioni, dettaglio lezione, percorso, profilo | alta (il più vicino al lancio) | Onboarding / Home / Teoria / Esito |
| 32 | Landing (mobile, 3 colonne) | 3 strisce verticali: hero, come funziona + funzionalità + dati, futuro + storie + CTA | alta (struttura), DA ADATTARE (molti testi) | Landing |
| 33 | Schermata app (kit blu) | 1: Home con "Prossimo passo" | alta, DA ADATTARE | Home / Menu |
| 34 | Schermate app (flusso con NOI/Agorà) | 15: come NN 30 ma con Classifica NOI, Sfida NOI, Agorà, Project ID | bassa (rimandata) | Atlas / Profilo / Classifica |
| 35 | Brand identity (nuovo logo) | tavola: logo variazioni, lettermark, tipografia, illustrazioni, applicazioni, tagline | media (decisione logo) | Brand kit / logo |

---

## Osservazioni generali (valgono per tutto il blocco)

1. **Due famiglie di design.** (A) "kit rosso": pulsanti d'azione rossi, barra in basso con icone rosse, nome "AddiOfa" in blu navy con "fa" blu (NN 18, 19, 20, 29). (B) "kit blu": pulsanti d'azione blu `#3B82F6`/`#2563EB`, rosso solo per il rischio (NN 21, 22, 25, 30, 31, 33, 34) e il nuovo logo "AddiOFA" con la stella a quattro punte dentro la O (NN 28, 35, 26, 32). L'app oggi è la famiglia A (rosso `#EF4444` come colore d'azione, come dice `brief-agenti.md`). Decisione da prendere dall'utente: restare in rosso o passare al blu; qui si cataloga per famiglia e si indica cosa si può prendere comunque (layout, componenti, copy).
2. **Rischio di fallimento.** Quasi tutte le schermate di risultato e la home sono costruite sul numero "82% Rischio di fallimento" in rosso, con "Rischio molto alto" e il pulsante rosso "Continua". L'app oggi dice "Probabilità stimata di superare il test oggi" con spiegazione prudente: è la forma giusta. Il layout del misuratore si può copiare, il testo no (vedi le singole schede).
3. **Abilità che non esistono nel banco.** I design mostrano Grammar / Vocabulary / Listening / Reading / Writing / "Ragionamento". Il banco ha solo due categorie (`Grammatica` 386 domande, `Traduzione` 231). Ascolto, lettura, scrittura, ragionamento: da non mostrare. Usare gli argomenti veri (31 argomenti di teoria, `grammarTopic`) e le due categorie.
4. **"Lezioni".** Il design ha un percorso a lezioni ("Future tenses", 5 lezioni, "Riduce il rischio ~6%"). L'app ha 31 schede di teoria e sessioni di esercizi per argomento, non lezioni con durata e "riduzione del rischio". Si può copiare la struttura (argomento -> elenco di unità con minuti -> esercizi finali) usando la teoria esistente, ma senza "riduce il rischio del 6%" (numero inventato).
5. **Nomi e marchi.** "CRAM Pass Pro" (NN 18, 19) va sostituito con "Pass AddiOFA" (14,99 €, lancio 9,99 € fino al 31/01/2027, una tantum, 12 mesi). "Intelligenza di ATLAS" / "Analisi generata da ATLAS" (NN 30, 34): ATLAS è rimandato e non è un'intelligenza artificiale; non promettere. Scritte e stemmi "Politecnico di Milano" (fotografie, footer, "Email Polimi"): sono un'affiliazione che l'app nega nel `DISCLAIMER`.
6. **Navigazione.** Il design usa 3 schede (Home / Simulazioni o Studio / Lezioni; NN 18, 21, 25, 31, 33) o 5 (Home, Lezioni, Quiz, Classifica, Profilo; NN 19) o 3 con Sfide (NN 22, 30, 34). L'app ha `Navigazione.tsx`: Home, Esercizi, Teoria, Progressi (+ Classifica con flag, + Pass se non attivo). Nulla da cambiare, ma "Simulazioni" come scheda a sé (NN 25, 31, 33) è un'idea da valutare: oggi la simulazione è dentro Home -> Strumenti.

---

## Schede

### NN 18 - `file_00000000496c820a90b90569fb6a69a8.png` (1536x1024)

**Tipo:** schermate app, kit rosso, 9 schermate in due file (4 sopra, 5 sotto). Barra in basso a 3 schede: Studio, Lezioni, Profilo (la scheda attiva in rosso).

Schermate, da sinistra a destra, riga alta poi bassa:

1. **Il tuo profilo.** Titolo, ingranaggio in alto a destra. Avatar grigio, "Raffaele A. - Studente @ Polimi". Riquadro "Livello attuale B2" con barra rossa al 65%. Due tessere: fiamma "12 Giorni di streak" e coppa "#4 in classifica". Riga evidenziata arancione con stella: "CRAM Pass Pro - Sblocca simulazioni illimitate" con freccia. Lista con icone e freccia: I tuoi obiettivi, Statistiche, Certificazioni, Impostazioni.
2. **Le tue statistiche.** Selettore "Ultimi 30 giorni". Tre tessere con icona in cerchio colorato: 24 Quiz svolti (rosso), 4h 20m Tempo di studio (blu), 82% Media risultati (verde). Grafico a barre rosse "Andamento risultati 82%" con barre di altezza crescente. "Per abilità - Vedi dettagli": Grammar 88%, Vocabulary 76%, Listening 84%, Reading 90%, barre rosse con icone quadrate.
3. **Frasi e vocaboli.** Campo di ricerca "Cerca una frase, parola o tema..." con icona filtri. Chip: Tutte (rosso pieno), Preferite, Da ripassare, Già note. Elenco di frasi in inglese con traduzione italiana sotto ("I'm looking forward to it. / Non vedo l'ora."), icona altoparlante blu a sinistra, stella (piena gialla o vuota) a destra per i preferiti.
4. **Test 3/10.** Freccia indietro, "3/10", barra a segmenti rossi (2 pieni). "Scegli la risposta corretta." Frase "She ___ to Milan last year." Quattro opzioni con radio: go, going, went (selezionata: bordo e fondo rosato), goes. Pulsante rosso "Avanti >".
5. **Quiz completato!** Illustrazione foglio con spunta verde. "Hai ottenuto 8 su 10." Misuratore ad arco "80%". Tre tessere: 8 Corrette (verde), 2 Errate (rosso), 3m Tempo (blu). Pulsante rosso "Vedi le correzioni", pulsante contorno blu "Torna alla home".
6. **Correzioni.** "8/10 risposte corrette". Elenco numerato (cerchietto con numero): frase, sotto la risposta in riquadro verde con spunta ("went") oppure in riquadro rosso con X ("is playing") più riga "Risposta corretta: are playing".
7. **Simulatore d'esame.** Illustrazione cronometro e fogli. "Preparati all'OFA con simulazioni ufficiali e tempi a tempo reale." Quattro schede con icona, titolo, durata e pulsante rosso "Inizia": Simulazione completa (60 min, 3 sezioni), Solo Grammar (20 min, 40 domande), Solo Listening (25 min, 30), Solo Reading (25 min, 30).
8. **Durante la simulazione 12/40.** Pillola rossa con orologio "00:24:15". Barra a segmenti. Chip rosso "Grammar" con icona. "Choose the best option." Frase "If I ___ more time, I would travel the world." Quattro opzioni, "had" selezionata. In basso: pulsante quadrato con segnalibro (a sinistra) e "Avanti >".
9. **Simulazione completata!** Coppa con stella, "Ecco il tuo risultato.", misuratore "76%", tessere 30 Corrette / 10 Errate / 25m Tempo, "Vedi le correzioni", "Torna alla home".

**Collegamenti:** Profilo -> Statistiche (voce in lista) ; Frasi -> Test (la scheda Lezioni); Test (4) -> Quiz completato (5) -> Correzioni (6); Simulatore (7) -> Durante (8) -> Completata (9) -> Correzioni.

**Manca nell'app:**
- Esito del quiz con misuratore + 3 tessere (corrette, errate, tempo) e pulsante "Vedi le correzioni": `LearnMode` finisce con "Sessione completata!" e un solo numero; l'esito della simulazione (`ExamMode`) non ha il misuratore ad arco né le tessere.
- Elenco "Correzioni" completo, numerato, con giuste e sbagliate insieme: oggi `ExamMode` mostra solo "Rivedi le risposte sbagliate".
- Statistiche con tre tessere in alto (quiz svolti, tempo di studio, media) e grafico a barre dell'andamento: `StatsMode` gratuito ha solo due tessere (domande imparate, accuratezza) e l'ultimo esame; il grafico a barre nel Pass non è per data.
- Scheda simulatore con più formati in elenco e durata: l'app ha due formati (ente, TENG) in `ExamMode`, in forma di card; coerente, mancano solo icona/durata visibile e pulsante "Inizia" per card.
- Chip categoria nella domanda di simulazione e segnalibro "segna per rivedere": nell'app c'è la categoria solo dopo la risposta in `LearnMode`; il segnalibro in simulazione non esiste.
- Elenco "Frasi e vocaboli" con ricerca, preferiti, filtro "Da ripassare", audio: l'app ha il Prontuario con ricerca (`CheatSheet.tsx`) ma non un elenco di frasi preferibili né la lettura audio.
- Barra a segmenti nel quiz (un segmento per domanda): l'app ha barra continua.

**DA ADATTARE:**
- "CRAM Pass Pro / Sblocca simulazioni illimitate" -> "Pass AddiOFA - simulazioni illimitate, 9,99 € fino al 31/01/2027, poi 14,99 €".
- "Livello attuale B2 65%": il livello CEFR non è misurato con precisione; se serve, "Domande imparate 65%" (c'è già in Home).
- "#4 in classifica" e streak come tessere: classifica spenta nel lancio (`FEATURE_FLAGS.leaderboard`). Lo streak c'è già (fiamma in Home): non ampliare.
- "Certificazioni": non serve al lancio.
- Abilità Listening/Reading/Vocabulary: non esistono nel banco, usare Grammatica e Traduzione o gli argomenti.
- "Simulazioni ufficiali": vietato "ufficiale" -> "simulazioni nei formati del test di recupero e del TENG".
- Simulazione da 60 minuti con 40 domande: i formati veri sono 30 domande in 15 minuti.
- Il nome "Raffaele A. - Studente @ Polimi" e simili: nel lancio nessun account.

**Schermata app:** Esito (5, 9), Correzioni (6), Statistiche (2), Simulazione (7, 8), Teoria/Prontuario (3), Profilo (1, bassa).
**Priorità:** alta per 5, 6, 9, 2; media per 7, 8, 3; bassa per 1.

### NN 19 - `file_000000004b048210aa21adae790dbaef.png` (1536x1024)

**Tipo:** le stesse 9 schermate di NN 18, con titoli numerati sopra ("1. Profilo", "2. Statistiche", "3. Elenco frasi", "4. Test", "5. Fine test con correzioni", "6. Simulatore", "7. Durante la simulazione", "8. Fine simulazione"). Differenza vera: **barra in basso a 5 schede** (Home, Lezioni, Quiz, Classifica, Profilo) nelle prime tre schermate, e il Test (4) senza barra. Il resto del contenuto (testi, tessere, valori) è identico a NN 18. La schermata "Correzioni" è presentata come seconda parte della 5.
**Manca nell'app / DA ADATTARE / Priorità:** come NN 18 (esito con misuratore e tessere, Correzioni complete, Statistiche con tre tessere e andamento, simulatore a schede, Frasi con preferiti e audio; da correggere: CRAM Pass Pro, abilità Listening/Reading, "simulazioni ufficiali", 60 min/40 domande, classifica). Utile come mappa dei collegamenti: Profilo e Statistiche sono raggiungibili dalla barra, Frasi sta sotto "Lezioni", il test dà accesso alle correzioni dal pulsante nell'esito.
**Schermata app:** come NN 18.

### NN 20 - `file_0000000053508210b048731fb8d31af2.png` (1536x1024)

**Tipo:** schermate app, 6 schermate in fila con frecce di collegamento, kit blu. Tutte con freccia indietro e barra superiore azzurra "10/10" (il diagnostico è finito).

1. **"Calcoliamo il tuo risultato"** - "Stiamo analizzando le tue risposte per stimare il tuo livello di preparazione." Arco grigio vuoto con pallino blu all'inizio, "0%", "Analizzando le risposte...". Sotto, scheda con 4 voci con spunta: Grammatica (in corso, anello che gira), Comprensione, Vocabolario, Ragionamento (grigie).
2. **"Elaboriamo i tuoi risultati"** - "Stiamo confrontando le tue risposte con migliaia di studenti del Polimi." Arco blu fino al 18%, "Rischio di fallimento, Calcolando...". Grammatica e Comprensione spuntate, Vocabolario in corso.
3. **"Stiamo analizzando..."** - "Consideriamo anche la difficoltà delle domande e il tempo impiegato." Arco che passa da blu a giallo, 42%. Tre voci spuntate, Ragionamento in corso.
4. **"Ultimi calcoli..."** - "Ora combiniamo tutti i fattori per ottenere una stima accurata del tuo risultato." Arco arancione 68%. La scheda in basso cambia: tre barre "Difficoltà delle domande" (arancione), "Tempo impiegato" (viola), "Modello di previsione" (verde), con icone.
5. **"Quasi pronto..."** - "Stiamo finalizzando la tua stima in base al modello di previsione dell'OFA." 80%, le tre barre con spunte verdi.
6. **"Il tuo risultato"** - "Ecco la tua stima attuale del rischio di fallimento all'OFA di inglese." Arco rosso pieno con pallino luminoso, "82% Rischio di fallimento" in rosso. Scheda rosata con 4 conseguenze (icone rosse): "~30 € di costi aggiuntivi", "Piano di studi bloccato", "Nessun esame dal secondo anno", "Ritardo di almeno 1 anno". Pulsante rosso "Continua >".

**Cosa mostra di nuovo:** l'arco cambia colore con il valore (blu -> giallo -> arancione -> rosso), il pallino luminoso scorre lungo l'arco, la scheda sotto passa da "checklist per abilità" a "fattori di calcolo" e poi alle conseguenze.

**Manca nell'app:** una schermata di calcolo animata tra l'ultima domanda e il risultato. Oggi `Onboarding.tsx` passa da ultima domanda a "risk" (conseguenze) e poi a "result" con `Misuratore` che anima solo da 0 al valore in 900 ms. Mancano: le frasi di attesa a tappe, la checklist, l'arco che cambia colore. Il componente `Misuratore` (`brand/componenti.tsx`) ha già l'arco da 220 gradi e il pallino, ma un solo colore (rosso).

**DA ADATTARE:**
- "Rischio di fallimento 82%" rosso allarmista -> "Probabilità stimata di superare il test: N%" con colore che sale verso il verde quando la probabilità è alta (arco da rosso a verde, non il contrario). Mai rosso pieno "Rischio elevato" come messaggio finale.
- "Confrontando le tue risposte con migliaia di studenti del Polimi" è FALSO (nessun confronto con altri studenti): togliere. "Modello di previsione dell'OFA": non esiste un modello ufficiale; dire "calcolo sulle tue risposte: al test servono 24 giuste su 30" (come già scrive il risultato attuale).
- "Difficoltà delle domande / Tempo impiegato / Modello di previsione" come fattori: verificare se `calcolo` usa davvero difficoltà (livello A1/A2/B1: sì, `LEVEL_MIX`) e tempo (no, solo `timeMs` registrato). Mostrare solo i fattori realmente usati, altrimenti l'animazione è finzione. Le quattro voci Grammatica/Comprensione/Vocabolario/Ragionamento -> "Livelli A1, A2, B1" e "Argomenti" (veri).
- La durata dell'attesa: una pausa finta con numero che sale è accettabile solo se breve (2-3 secondi) e dichiarata come "calcolo"; non prolungare per far sembrare importante.
- "Piano di studi bloccato / Nessun esame dal secondo anno / Ritardo di almeno 1 anno": le conseguenze vere in `OFA_CONSEQUENCES` sono: test di recupero circa 30 €, nel piano degli studi solo esami del 1° anno finché l'OFA non è tolto, scadenze di fine agosto-settembre. Non scrivere "ritardo di almeno 1 anno" (non verificabile).

**Schermata app:** Risultato del diagnostico (tra domande e "Quiz completato").
**Priorità:** alta per l'animazione e per il cambio colore dell'arco (valore percepito, costo basso: `Misuratore` esiste già); i testi vanno adattati.

### NN 21 - `file_0000000058b0824397163a42e262e503.png` (941x1672)

**Tipo:** una sola schermata mobile, kit blu: **Home "Il tuo rischio OFA".**
Dall'alto: logo "AddiOfa" (blu navy + "Ofa" blu) con campanella; titolo "Il tuo rischio OFA" con icona (i) e sottotitolo "Più studi, più il rischio si abbassa."; misuratore grande ad arco rosso con tacche e pallino luminoso, "82%" in rosso, "Rischio di fallimento all'OFA di inglese"; riquadro rosa con punto esclamativo rosso e freccia: "Rischio molto alto - Con il tuo livello attuale potresti non superare l'OFA. Inizia a studiare per ridurre il rischio."; pulsante blu "Inizia a studiare >" con cerchio bianco e triangolo; sezione "Fattori principali (i)": 4 righe con icona blu, nome, barra e %: Grammatica 20% (rosso), Comprensione 35% (rosso), Vocabolario 45% (giallo), Ragionamento 50% (arancione), freccia a destra; sezione "Come ridurre il rischio? - Vedi tutti": carosello orizzontale di schede (Completa le lezioni consigliate "Puoi ridurre il rischio fino al 20%", Fai una simulazione "Scopri il tuo livello attuale con un test completo", Studia le a... "Concentrati in cui hai difficoltà"); sezione "Il tuo percorso": linea a tre punti Oggi 82% / Dopo 5 lezioni 62% / Dopo 15 lezioni 28%. Barra in basso: Home, Simulazioni, Lezioni.

**Manca nell'app:** `Menu.tsx` mostra la probabilità solo come riga piccola nel riquadro "progressi" (una riga "Probabilità stimata di superare il test"), senza misuratore grande; mancano la lista "fattori principali" con barre per argomento/livello, il carosello "come ridurre", la linea del percorso. L'app non ha una vera home "cruscotto".

**DA ADATTARE:**
- Titolo e testi: "Il tuo livello oggi" / "Probabilità stimata di superare il test" (non "rischio"), sottotitolo "Si aggiorna con ogni risposta e simulazione".
- Riquadro "Rischio molto alto... potresti non superare l'OFA": cancellare; vietato l'allarme. Al suo posto, una frase neutra e utile: "Hai risposto bene a X domande su Y. I tuoi punti deboli: ..." (già calcolato da `weakTopics`).
- Fattori: 4 voci "Grammatica / Comprensione / Vocabolario / Ragionamento" -> categorie vere (Grammatica, Traduzione) o i 3 livelli A1/A2/B1; percentuali vere dalle statistiche.
- "Dopo 5 lezioni 62%, Dopo 15 lezioni 28%": numeri inventati, previsione non fondata. NON copiare. Alternativa onesta: "Prossimo traguardo: 24 su 30" con la barra dell'ultima simulazione, o il grafico delle sole simulazioni già fatte (dati reali).
- "Puoi ridurre il rischio fino al 20%": inventato, togliere.
- Il pulsante blu: nel nostro kit è rosso (famiglia A).

**Schermata app:** Home / Menu.
**Priorità:** media. Il misuratore in Home e la lista "Dove sei debole" con barre sono una buona migliore (alta come componente), il resto è da riscrivere.

### NN 22 - `file_00000000715481f49fb2ead59f0c4fa8.png` (1536x1024)

**Tipo:** due schermate app, kit blu, con barra a 3 schede Home / Studia / Sfide, logo in alto.

1. **Sfide.** Avatar (foto) in alto a destra. "Sfide - Studia, completa sfide, scala la classifica e riduci il rischio OFA." Tab: Attive (blu pieno), Classifica, Amici, icona calendario. Carta verde "SFIDA DELLA SETTIMANA - 5 giorni rimanenti": bersaglio, "Completa 5 lezioni", "Completa 5 lezioni di qualsiasi argomento questa settimana.", barra verde 3/5, "+100 pt" con medaglia, pulsante tondo blu con freccia; punti di paginazione. "Sfide attive - Vedi tutte": 7 giorni di studio (fiamma, 5/7, +150 pt), Duello simulazione (sfida un altro studente in una simulazione di 40 domande, 0/1, +200 pt), Grammar Sprint (10 esercizi di grammatica, 6/10, +80 pt). "Classifica settimanale - Vedi completa": podio con 3 avatar (giulia.p 1.240 pt, ale.dis 1.560 pt con corona, marti.s 1.120 pt).
2. **Profilo.** Logo, ingranaggio. Avatar grande, "Raffaele @raffaele.ando", freccia. Riquadro "Project ID #4821" con icona copia. Quattro statistiche: 12 livello, 320 pt totali, 7 giorni di studio, 3 badge. "I tuoi progressi - Vedi dettagli": tre tessere Lezioni 24/60, Simulazioni 8, Punteggio medio 72% (+12%). "Obiettivi - Vedi tutti": "Supera l'OFA - Riduci il rischio sotto il 20%", barra 82% -> 28%; due obiettivi piccoli "Studia 30 giorni 7/30", "Completa 10 simulazioni 8/10". "Badge - Vedi tutti": 5 badge (7 giorni consecutivi, 10 lezioni, Prima simulazione, Accuracy > 80%, Sfida completata con lucchetto).

**Manca nell'app:** Sfide, duelli, punti, livello a punti, badge, Project ID, classifica settimanale, profilo con avatar. In `app/src/components` ci sono `Leaderboard.tsx` e `ProjectProfile.tsx` dietro i flag spenti.

**DA ADATTARE:** "Duello" e classifica con nomi/avatar altrui: nel lancio niente classifica né altri utenti; niente utenti finti in nessun caso. Punti: l'app calcola il livello solo da risposte vere (commento in `StatsMode`), non regalare punti. "Riduci il rischio sotto il 20%" e "82% -> 28%": numeri inventati.
**Cosa si può copiare:** gli **obiettivi personali** a barra senza altri utenti ("Studia 30 giorni", "Completa 10 simulazioni", "Supera l'OFA: 24 su 30") e i **badge sobri** (Prima simulazione, 10 simulazioni, accuratezza oltre 80%): sono vere gamification basate su ciò che l'utente ha fatto, come chiede la skill `metodo-di-studio`.

**Schermata app:** Profilo / Sfide (flag spenti).
**Priorità:** bassa/rimandata per Sfide, Duello, classifica, Project ID; media per "obiettivi personali" e badge nei Progressi.

### NN 23 - `file_00000000743c820a9624a4d04d2a32da.jpg` (1536x683)

**Tipo:** brand kit blu (tavola unica). Titolo "Brand Kit - Illustrazioni per l'app OFA Inglese - Politecnico di Milano".
Contenuti: palette di 9 colori con hex: Primario `#0F172A`, Secondario `#3B82F6`, Sfondo `#F6F8FC`, Superfici `#E5E7EB`, Testo secondario `#6B7280`, Accento/Rischio `#EF4444`, Attenzione `#F59E0B`, Successo `#22C55E`, Quiz/Apprendimento `#8B5CF6`. **Illustrazioni principali (8):** Studio/Inglese (libri con bandiera), Quiz/Test, Risultato/Probabilità (arco 82%), Rischio economico (banconota con euro), Piano di studi bloccato (calendario con lucchetto), Superamento (foglio con spunta), Successo (coppa), Suggerimenti (lampadina). **Contestuali (10):** Email Polimi (busta con stemma), Verifica utente, Accesso bloccato dal secondo anno, Mancato superamento, Progressi/Statistiche, Mondo/Internazionale, Messaggi/Supporto, Celebrazione, Attesa/Caricamento (clessidra), Ricerca. **Icone (14):** Studio, Statistiche, Quiz, Contenuti, Costo, Blocco, Successo, Email, Profilo, Impostazioni, Aiuto, Completato, Errore, Info. **Stati e feedback (4):** Operazione completata, Qualcosa è andato storto, Attenzione leggi bene, Informazione importante. **Elementi UI:** pulsanti Primario (rosso), Secondario, Outline; interruttore, casella, radio; indicatore di avanzamento a 6 passi (Verifica, Quiz, Risultato, Piani, Pagamento, Successo). **Elementi extra:** "Più scelto", "Massima sicurezza", "Consigliato".

**Nell'app:** già estratto (`app/src/brand/essenziali/`, `catalogo.ts`, `componenti.tsx`: `Pulsante`, `Interruttore`, `Casella`, `Radio`, `Avanzamento`, `Badge`, `Stato`, `IconaChip`, `Misuratore`, `Caricamento`, illustrazioni `kit-blu`/`kit-rosso`).
**DA ADATTARE:** il sottotitolo "Politecnico di Milano" (affiliazione); l'illustrazione "Email Polimi" con stemma dell'ateneo; i badge extra "Più scelto" e "Massima sicurezza" sono prova sociale/garanzia non dimostrabili: usare solo "Consigliato" se è vero (es. etichetta di formato).
**Schermata app:** Brand kit (`BrandKit.tsx`). **Priorità:** già fatto; le illustrazioni "Rischio economico", "Piano di studi bloccato", "Accesso bloccato dal secondo anno", "Mancato superamento" servono alla schermata conseguenze (alta, se non già in uso: `Onboarding` usa "rischio-economico").

### NN 24 - `file_00000000762c8243a72d58d109b8a9ca.jpg` (1254x1254)

**Tipo:** icona app. Rettangolo con angoli molto arrotondati, blu cobalto profondo con gradiente, una stella a cinque punte ritagliata come una porta nel muro da cui esce luce calda dorata che si riflette sul pavimento in prospettiva. Fotorealistico/3D morbido.
**Nell'app:** `grafica/brand` ha già il logo 3D; l'icona dell'app oggi è `urlIcona` (`brand/risorse.ts`, favicon 64). Controllare in `grafica/` se già ricreata (CLAUDE.md: skill `ricreare-grafica`).
**Priorità:** media: è l'icona PWA/ store e il simbolo del nuovo brand (stella = "Supera l'OFA, senza blocchi"). Da vettorializzare in più dimensioni (192, 512, maskable) se si adotta il nuovo logo.
**Nota:** anche NN 28 e 35 usano questa icona; la stella a quattro punte dentro la O è la variante semplificata.

### NN 25 - `file_0000000079808210b70464a09e79ef88.png` (1174x1340)

**Tipo:** flusso di 8 schermate collegate da linee blu, famiglia blu. Al centro la Home (come NN 21 con in più una scheda "Il tuo prossimo obiettivo" e il grafico "Come cambia il tuo rischio (i)" in piccolo). Le altre:

1. **Modale "Come viene calcolato il tuo rischio? (i)"** (sullo sfondo sfocato della Home): "Il rischio di fallimento è una stima basata su:" tre voci con icona (Il tuo livello attuale nei diversi argomenti; Le prestazioni di altri studenti con un livello simile; La difficoltà dell'esame e il numero di domande) e riquadro azzurro "Più completi le lezioni e migliori nei test, più il rischio si abbassa."
2. **Bottom sheet "Fattori che influenzano il tuo rischio" (X):** Grammatica "Influisce molto: è la parte più frequente nell'esame." Comprensione "Molto importante per il punteggio totale." Vocabolario "Ti aiuta a rispondere più velocemente e con più precisione." Ragionamento "Serve per le domande più complesse." Ognuna con barra colorata.
3. **Lezione "Grammatica - Future tenses"** (freccia indietro, barra segmentata): icona libro, "Impara e pratica i tempi futuri più comuni.", tre punti con icona (Spiegazioni semplici, Esempi pratici, Esercizi interattivi), pulsante blu "Inizia la lezione >".
4. **"Dettaglio obiettivo"** Grammatica - Future tenses, 0/5 lezioni. Elenco: 1 Introduzione 5 min, 2 Will 8 min, 3 Going to 8 min, 4 Present continuous 8 min, 5 Esercizi finali 10 min; pulsante "Inizia la prima lezione".
5. **Modale "Come cambia il tuo rischio ?":** grafico a tre punti 82% -> 62% -> 28%, riquadro "Perché è solo una stima? La riduzione del rischio dipende dal tuo impegno, dai risultati nei quiz e dalla tua costanza nello studio."
6. **"Il tuo percorso":** testo "Se completi le lezioni consigliate, il tuo rischio può scendere così:", grafico grande, riquadro "Obiettivo: sotto il 20%. Con un rischio inferiore al 20% aumenti notevolmente la probabilità di superare l'OFA."

**Collegamenti:** icona (i) accanto a "Il tuo rischio OFA" apre la modale 1; "Fattori principali" (non visibile) apre 2; "Inizia a studiare" apre 3; "Il tuo prossimo obiettivo" apre 4; "Come cambia" apre 5 e 6.

**Manca nell'app:** le **spiegazioni "come viene calcolato" e "perché è solo una stima"** come foglio a scomparsa accessibile da un (i). Oggi la spiegazione è un paragrafo piccolo in `Onboarding` 'result'. Manca anche la pagina "dettaglio obiettivo" con unità e minuti.
**DA ADATTARE:**
- "Le prestazioni di altri studenti con un livello simile": falso nell'app -> togliere. Testo vero: "Quante risposte hai dato giuste, il livello delle domande (A1, A2, B1) e la soglia del test: 24 giuste su 30."
- "Perché è solo una stima?": ottimo, tenerlo (onestà) e allargarlo: con 10 domande la stima è prudente e approssimativa.
- Il grafico 82% -> 62% -> 28% e "Obiettivo: sotto il 20%": numeri inventati. NON copiare.
- Le voci "Ragionamento", "Comprensione": categorie inesistenti.
- Nomi delle unità (Will, Going to, Present continuous): corrispondono a schede di teoria esistenti? Verificare in `Theory.tsx`; se sì, collegare ognuna alla scheda e a un set di esercizi dell'argomento.

**Schermata app:** Risultato / Home / Teoria. **Priorità:** alta per le due modali di spiegazione (onestà, costo basso); media per "dettaglio obiettivo" come lista unità di un argomento.

### NN 26 - `file_000000007c448210acbc3b891fe6e023.png` (1536x1024)

**Tipo:** social media identity v1.0, tavola con 11 pannelli.
- Copertina: "Contenuti che ti portano più lontano." "Il tuo inglese, senza ostacoli. Per il Politecnico di Milano e oltre." "Small steps, big opportunities" a mano libera, scalinata con cubo blu e stella luminosa.
- **Profilo Instagram** (mockup telefono): addiofa, 163 post, 12,4K follower, 12 seguiti, bio ("Il tuo inglese, senza ostacoli. Per gli studenti del Politecnico di Milano. Quiz, strategie e risorse. Supera l'OFA e sblocca il tuo percorso"), link, pulsanti Segui/Messaggio, highlight Quiz, Tips, Risultati, Studenti, FAQ.
- **Highlight covers** (6 cerchi icona: Quiz, Tips, Risultati, Studenti, FAQ, OFA).
- **Formati di contenuto** (4 verticali): Quiz Time (Edu/Quiz), "3 consigli per l'OFA di inglese" (Tips/Consigli), "82% degli studenti rischia di non superare l'OFA. Tu sei tra questi?" (Risultati/Dati), "Stessi studenti. Percorsi più luminosi." (Community).
- **Template post 1:1:** Quiz Time, 3 consigli, 82% arco, Politecnico di Milano facciata, "Errori comuni all'inglese" (lista: Tempi verbali, Preposizioni, Reading, Listening), "La tua checklist pre esame".
- **Template stories 9:16:** Nuovo quiz!, Lo sapevi? ("Dal secondo anno non puoi sostenere alcuni esami se non superi l'OFA"), Tip del giorno, Risultato personale (+40% progresso medio dopo 2 settimane), Motivazione.
- **Template reels/TikTok:** 3 consigli per superare l'OFA (125K), Quiz reale dell'OFA (98K), Errore comune (210K), La mia esperienza con l'OFA (76K), Ce l'ho fatta! (142K).
- **Tono di voce:** Chiaro, Motivante, Pratico, Amichevole, Istituzionale, Autentico. **Esempi di caption** con hashtag. **Applicazioni** TikTok, YouTube, LinkedIn. **Pattern e background**, **grafiche testo**, **copertine social** (banner YouTube/LinkedIn).

**DA ADATTARE:** follower e visualizzazioni (12,4K, 125K...) sono mockup, mai pubblicarli; "Quiz reale dell'OFA" -> "Quiz di allenamento"; "82% degli studenti rischia..." e "+40%" inventati; "Istituzionale" come tono: l'app è un progetto studentesco indipendente, tono "Chiaro, Pratico, Amichevole, Autentico"; "Ce l'ho fatta!" e "La mia esperienza" = testimonianze: solo reali e con consenso, altrimenti no; la facciata "Politecnico di Milano" come immagine.
**Cosa si può copiare:** i formati "Quiz Time", "Errori comuni all'inglese" (4 errori veri dal banco), "La tua checklist pre esame", "Tip del giorno", le covers highlight.
**Schermata app:** nessuna (marketing). **Priorità:** bassa/dopo il lancio; media per il tono di voce e i formati onesti.

### NN 27 - `file_000000007d588243bc36c3920520a8f3.jpg` (1536x683)

**Tipo:** brand kit blu, tavola **identica a NN 23** (stesso contenuto, stessa impaginazione; verificato voce per voce: palette, 8 principali, 10 contestuali, 14 icone, 4 stati, elementi UI, progress a 6 passi, elementi extra). Nessuna informazione nuova.
**Schermata app / priorità / adattare:** come NN 23. Duplicato, non serve estrarre di nuovo.

### NN 28 - `file_0000000084bc8210aea02bc9e24200d6.png` (1536x1024)

**Tipo:** brand identity / "AddiOFA Visual System v1.0" (tavola fitta, circa 160 elementi).
- **Logo system:** wordmark "AddiOFA" navy con la O sostituita da cerchio blu con stella a quattro punte bianca; logo primario, secondario (con "IL TUO INGLESE, SENZA OSTACOLI"), compatto (quadrato blu con stella), varianti (su fondo scuro, su chiaro, monocromatica positiva/negativa).
- **Griglia e costruzione** (misura x, 2x) e **area di rispetto**.
- **Palette:** Blu primario `#0F172A`, Blu secondario `#3B82F6`, Azzurro `#60A5FA`; neutri Sfondo `#F6F8FC`, Superfici `#E5E7EB`, Testo secondario `#6B7280`; stato Rischio/Errore `#EF4444`, Attenzione `#F59E0B`, Successo `#22C55E`, Quiz/Apprendimento `#8B5CF6`.
- **Tipografia:** Inter (Light, Regular, Medium, Semibold, Bold).
- **Iconografia:** Studio, Quiz, Statistiche, Blocco, Successo, Mondo, Suggerimenti, Profilo. **Stile icona:** stella contorno -> piena -> app icon blu.
- **Illustrazioni 3D:** Studio, Quiz, Risultato, Piano di studi, Internazionale, Successo, Suggerimenti; stile: forme morbide, ombre leggere, colori luminosi, 3D minimal, coerenza con UI. **Pattern grafici** (forme blu con stella), **elementi decorativi** (linea con stella cometa).
- **Componenti UI:** pulsanti Primario (blu), Secondario (outline), Rischio (rosso); input/selezione (radio, campo, cerca); toggle/checkbox; progress a 4 passi (Verifica, Quiz, Risultati, Piani); badge/tag (Completato, Errore, Attenzione, Info); card esempio "Simulazione - 10 domande, 3 minuti"; **App icon set esteso** (18 icone: libro, grafico, cappello, lucchetto, coppa, documento, euro, ecc.).
- **Esempi di applicazione:** telefono con icona e notifica, felpa, tote bag, quaderno, borraccia; sfondi; "visual elements" con scalinata e stella.

**Nell'app:** il kit di componenti e le icone sono già estratti (kit blu/rosso). Mancano: il nuovo logo (stella nella O), il pulsante "Rischio" rosso come variante, la **card "Simulazione - 10 domande, 3 minuti"** (riga con icona a sinistra e freccia: è il pattern di `Strumento` in `Menu.tsx`, già simile), il set di 18 icone (3 in più oltre alle 14).
**DA ADATTARE:** merchandising (felpa, borraccia): non serve; "Politecnico" nel visual con scalinata (solo come fondale generico).
**Schermata app:** Brand kit / logo. **Priorità:** media: richiede la decisione sul nuovo logo e sulla famiglia di colore (vedi osservazione 1).

### NN 29 - `file_00000000883481f498a06da70e0aea49.png` (1536x1024)

**Tipo:** variante di NN 20, 6 schermate di calcolo del risultato, kit blu. Differenze rispetto a NN 20:
- Testi: "Calcoliamo il tuo risultato - ... per stimare il rischio di fallimento all'OFA", "Elaboriamo i tuoi risultati - Stiamo valutando il livello di preparazione in base alle tue risposte" (**senza** il confronto con altri studenti: più onesto), "Stiamo analizzando... - Consideriamo la difficoltà delle domande e il tempo impiegato", "Quasi pronto... - ... in base al modello di previsione dell'OFA", "Ultimi dettagli... - Verifichiamo gli ultimi parametri per un risultato più accurato", "Ecco il tuo risultato".
- Valori: 0%, 12%, 36%, 58%, 74%, 82%. Etichetta "Rischio di fallimento" sotto la %.
- In basso, **una scheda a una riga con icona e testo di stato** (grafico che sale "Analizzando le risposte...", elenco "Valutando sezioni del test...", ingranaggio "Elaborazione in corso...", documento "Calcolando il risultato finale...", spunta "Quasi fatto...").
- Ultima schermata: riquadro rosso "Rischio elevato - Ti consigliamo di prepararti prima di affrontare l'esame." e "Continua".
- Arco: colori più a tappe (blu -> giallo -> arancione -> rosso), pallino con alone.

**Rispetto a NN 20:** più semplice e senza la checklist per abilità; più adatta a essere ricreata. **DA ADATTARE:** come NN 20 (rischio -> probabilità, "modello di previsione dell'OFA" via, "Rischio elevato" via). "Ti consigliamo di prepararti prima di affrontare l'esame" è accettabile come frase, senza etichetta di rischio.
**Schermata app:** Risultato del diagnostico. **Priorità:** alta. Proposta unica: schermata di attesa con stato a una riga che cambia ("Contiamo le risposte esatte", "Pesiamo i livelli delle domande", "Calcoliamo la probabilità") e arco `Misuratore` con colore variabile.

### NN 30 - `file_0000000089688210bbf00df3de3f973f.png` (1536x1024)

**Tipo:** flusso completo di 16 schermate numerate, famiglia blu, con "ATLAS" come motore. Barra a 3 schede: Home / Studia / Sfide.

1. **Splash screen:** fondo blu pieno con onda, "AddiOfa - Supera l'OFA di inglese. Senza blocchi."
2. **Onboarding 1:** "AddiOfa - Studia in modo mirato con l'intelligenza di ATLAS", illustrazione fogli e grafico, tre punti di paginazione, "Inizia >".
3. **Onboarding 2:** "Un percorso personalizzato per te" con 5 voci con icona: Analizza il tuo livello con ATLAS, Lezioni ed esercizi mirati, Simulazioni realistiche, Sfide con altri studenti grazie a NOI, Confrontati su Agorà quando hai dubbi. "Avanti >".
4. **Test iniziale (ATLAS):** 3/20, "Choose the correct form. If I ___ more time, I would travel." Opzioni have, had (selezionata), will have, would have.
5. **Risultati test (ATLAS):** "Il tuo livello (i) - Analisi generata da ATLAS", radar a pentagono (Grammar 72%, Vocabulary 58%, Listening 65%, Reading 78%, Writing 62%), riquadro "ATLAS ha analizzato le tue risposte e ha creato un percorso personalizzato.", "Inizia il tuo percorso".
6. **Home:** misuratore 82%, "Prossimo passo - Future tenses" (Lezione, 10 min, -6%), "Inizia la lezione", "Il tuo percorso" 82% -> 62% -> 28%.
7. **Studia (panoramica):** tab Percorso / Esercizi / Simulazioni; "Percorso personalizzato creato da ATLAS"; "Continua da qui - Future tenses"; "Unità del percorso" con 5 unità numerate (Present simple, Present continuous, Past simple, Future tenses in corso, Modal verbs).
8. **Lezione (esempio):** "Future tenses - 1. Spiegazione. Il futuro si usa per parlare di azioni che accadranno.", due esempi ("I will go to Milan. (decisione al momento)", "I am going to study. (piano già deciso)"), "Continua".
9. **Esercizio:** 4/10, "Completa la frase - We ___ to Milan tomorrow", opzioni go, goes, will go (scelta), are going; banner verde "Corretto! 'Will go' è la forma corretta." (nota: la risposta mostrata è discutibile, il giusto sarebbe "are going"), "Avanti".
10. **Simulazioni:** 3 voci: Simulazione completa (40 domande, 60 min), Simulazione per argomento (scegli l'argomento), Le mie simulazioni (2 completate).
11. **Risultati simulazione (ATLAS):** anello verde 72%, "29/40 risposte corrette", "Analisi di ATLAS: ecco le aree su cui concentrarti per migliorare", "Aree da migliorare" con barre (Grammar 65%, Vocabulary 80%, Listening 45%, Reading 90%), "Vedi analisi dettagliata".
12. **Sfide (home):** tab Attive/Classifica/Amici, sfida della settimana "Completa 5 lezioni" +100 pt, sfide attive.
13. **Sfida (dettaglio):** coppa, "7 giorni di studio", 5/7 giorni, righe di giorni L M M G V S D con spunte, "Ricompensa +150 punti - Badge esclusivo", "Continua a studiare".
14. **Classifica (dentro Sfide):** tab Settimanale / Mensile / Sempre; podio; righe 4-7; "La tua posizione #5, 820 pt" con condividi.
15. **Profilo (Project ID):** avatar iniziale "R", Raffaele @raffaele.ando, Project ID #4821, 12 livello, 320 pt, 7 sfide, 3 badge; menu: I miei progressi, Le mie sfide, Classifica, Obiettivi, Attività, Collegamenti, Project ID.
16. **Impostazioni:** Account (Email, password, sicurezza), Preferenze (Tema, lingua), Notifiche (Solo attività importanti), Privacy (Dati e permessi), Aiuto (FAQ e supporto), Informazioni (Versione dell'app).

**Collegamenti:** 1 -> 2 -> 3 -> 4 -> 5 -> 6; da 6: 7 -> 8 -> 9; poi 10 -> 11; 12 -> 13 -> 14; 15 -> 16. Linea di collegamento 5 -> 9 ("flusso test -> esercizio").

**Manca nell'app (cose nuove):** splash a schermo intero con claim; onboarding a due pagine con elenco di vantaggi; **radar riassuntivo del diagnostico** (c'è nel Pass in Statistiche ma non nel risultato); schermata **Studia** con tab Percorso / Esercizi / Simulazioni e "Continua da qui"; **lezione a passi** con spiegazione, esempi con nota in italiano ("decisione al momento") e "Continua" (l'app ha la teoria in scheda unica: `Theory.tsx` regola, esempi, errori, consiglio); banner "Corretto!" verde con spiegazione breve (c'è già in `LearnMode`); **Simulazione per argomento** (l'app ha solo i due formati); **Impostazioni** (non esiste una schermata dedicata: tema e suono stanno nell'intestazione di `Menu`).
**DA ADATTARE:** tutto "ATLAS ha analizzato / intelligenza di ATLAS" (non c'è IA: il percorso è l'algoritmo di ripasso dilazionato `spacedRepetition.ts`); "Sfide con altri studenti grazie a NOI" e "Agorà" (rimandati); "Simulazione completa 40 domande 60 min" (i formati veri 30/15); "Writing/Listening/Reading"; "-6%" riduzione del rischio; classifica e Project ID.
**Schermata app:** Landing/splash (1), Onboarding (2, 3, 4, 5), Home (6), Teoria (7, 8), Simulazione ed Esito (10, 11), Impostazioni (16), Sfide/Classifica/Profilo (12-15, rimandate).
**Priorità:** media per 1-11 e 16; bassa per 12-15.

### NN 31 - `file_000000008ba881f4a420b137ffc486c3.png` (1312x1199)

**Tipo:** flusso completo di 14 schermate numerate, famiglia blu, **senza ATLAS / NOI**: è la versione più vicina al prodotto di lancio. Barra a 3 schede Home / Simulazioni / Lezioni.

1. **Splash screen:** blu pieno, "AddiOfa - Supera l'OFA di inglese. Senza blocchi."
2. **Onboarding:** "Valuta il tuo livello, studia in modo mirato e riduci il rischio di fallire.", illustrazione foglio, "Inizia >".
3. **"Verifica OFA già sostenuto?":** "Hai già l'attestato OFA di inglese? Se hai già superato l'OFA, puoi consultare la nostra guida con tutte le informazioni utili." Due scelte: "Sì, l'ho già superato - Vai alla guida", "No, devo ancora sostenerlo - Fai il test di valutazione".
4. **"Inserimento email Polimi":** barra a 5 segmenti, "Inserisci la tua email @polimi.it - Salveremo i tuoi progressi e verificheremo che tu sia uno studente del Politecnico di Milano.", campo "nome.cognome@polimi.it", "Continua", lucchetto "I tuoi dati sono al sicuro."
5. **"Test di valutazione (quiz)":** 3/20, "Scegli la frase corretta. She ___ to Milan every week." go / goes (selezionata) / is going, "Avanti".
6. **"Home (dopo il test)":** misuratore 82%, "Prossimo passo: Future tenses - Lezione, 10 min, Riduce il rischio ~6%. Completa questa lezione per abbassare il tuo rischio di fallimento.", "Inizia la lezione", "Il tuo percorso 82% -> 62% -> 28%".
7. **Lezione:** "Future tenses - 1. Spiegazione", due esempi, barra a 5 punti, "Continua".
8. **Esercizi:** 3/10, "Completa la frase. We ___ a test tomorrow." have / will have (scelta) / are having; banner verde "Corretto!", "Avanti".
9. **Fine lezione:** coppa, "Lezione completata! Il tuo rischio stimato è diminuito di circa 6%.", confronto "82% Rischio precedente -> 76% Rischio attuale", "Vai alla prossima lezione", "Torna alla Home".
10. **Simulazioni:** 3 voci (Simulazione completa 40 domande 60 min, Simulazione per argomento, Le mie simulazioni).
11. **Lezioni (lista):** Present simple (spunta verde), Present continuous (spunta), Past simple, Future tenses (evidenziata), Modal verbs, Conditionals; con cerchio vuoto/spuntato per ognuna.
12. **Dettaglio lezione:** "Future tenses - Impara e pratica i tempi futuri più comuni." con 4 righe: Spiegazione, Esempi, Esercizi, Quiz finale; "Inizia la lezione".
13. **Il tuo percorso (dettaglio):** grafico 82% -> 62% -> 28% e 3 righe: "Come viene calcolato il tuo rischio?", "Fattori che lo influenzano", "Obiettivo: sotto il 20%".
14. **Profilo / Impostazioni:** iniziale "R", Raffaele raffaele@polimi.it, I tuoi progressi, Notifiche (interruttore), Guida e FAQ, Esci.

**Manca nell'app:**
- **Schermata "Hai già l'attestato OFA?"** (3): l'app ha già "Hai già una certificazione di inglese riconosciuta dal tuo ateneo?" (`Onboarding` 'certification') e "Forse non ti serve il test": equivalente presente.
- **Schermata di fine lezione** con confronto prima/dopo (9): manca; `LearnMode` ha "Sessione completata!". Si può fare con valori veri: probabilità prima/dopo la sessione, calcolata sulle risposte (se cambia).
- **Lista lezioni con spunte** (11): in `Theory.tsx` c'è l'elenco dei 31 argomenti; non c'è lo stato "fatto".
- **Pagina "Il tuo percorso"** con 3 voci di aiuto (13): manca (vedi NN 25).
- **Profilo/impostazioni** (14): manca.
**DA ADATTARE:**
- **Email @polimi.it come passo obbligato (4):** nel lancio non si richiede account né email (CLAUDE.md, piano: nessun account). Non copiare; l'email si chiede solo per Inviti/lista d'attesa e in forma facoltativa, il dominio degli inviti è `mail.polimi.it` (config).
- "Verificheremo che tu sia uno studente del Politecnico": nessuna verifica ufficiale.
- "Riduce il rischio ~6%", "Il tuo rischio stimato è diminuito di circa 6%", 82% -> 62% -> 28%: inventati.
- "Simulazione completa 40 domande, 60 min": non è il formato reale.
- "Rischio di fallimento": come sopra.
**Schermata app:** Onboarding (1-5), Home (6), Teoria/lezioni (7, 11, 12), Esito/fine sessione (9), Simulazioni (10), Profilo (14).
**Priorità:** alta per 3 (già presente), 9 (fine sessione con prima/dopo), 11 (lista unità con spunte e "Continua da qui"), 13 (spiegazioni); media per 2 (onboarding in una pagina), 14.

### NN 32 - `file_000000008f5c82109632fc8fed9b6ca6.png` (941x1672)

**Tipo:** landing mobile, 3 colonne verticali affiancate (una sola pagina lunga spezzata in tre). Stile fotografico/3D: scalinata di cemento con arco a forma di stella luminosa, studente di spalle che sale, cielo al tramonto, Duomo di Milano sullo sfondo. Fondo navy per i blocchi di apertura, bianco per i contenuti.

**Colonna 1 (hero):**
- Barra: logo "AddiOFA" con stella, "Menu".
- Testo verticale "STUDIA / PREPARATI / SUPERA / SBLOCCA / IL TUO / PERCORSO".
- Titolo: "Oltre l'OFA, un passo in più." (la seconda riga in blu elettrico). Testo: "AddiOFA ti aiuta a superare l'OFA di inglese con un percorso personalizzato, evitando rischi, costi e blocchi del tuo piano di studi." Pulsante bianco "Inizia ora >". "SCORRI" con linea.
- Foto Duomo con "Lo stesso obiettivo. Un domani più aperto."
- Bordo strappato bianco; sezione "PERCHÉ ADDIOFA - Il primo passo per non fermarti. L'OFA di inglese può bloccare il tuo percorso al Politecnico. AddiOFA ti dà gli strumenti per superarlo in modo semplice, efficace e su misura." Immagine di muro "SAME STUDENTS HIGHER HORIZONS".

**Colonna 2:**
- "COME FUNZIONA 01": "Un percorso che si adatta a te. Dall'analisi iniziale al superamento, tutto in un'unica esperienza." Telefono con la home "Sei a rischio? 82% Probabilità di non superare l'OFA, Rischi di perdere circa 30€, Inizia a studiare" e timeline a 4 passi: 01 Test iniziale, 02 Piano personalizzato, 03 Simulazioni reali, 04 Supera l'OFA.
- "FUNZIONALITÀ 02": "Tutto quello che ti serve, in un'unica app." Quattro carte vetro: Quiz interattivi ("Domande come nell'esame reale"), Simulazioni ufficiali ("Timer e formato autentico"), Analisi del livello ("Statistiche chiare e dettagliate"), Spiegazioni semplici ("Teoria, esempi e consigli pratici"). Foto di studente con cuffie e pannelli QUIZ, SIMULAZIONI, PROGRESSI.
- "DATI REALI 03": "Molti studenti partono a rischio. In base alle nostre analisi, l'82% degli studenti che inizia senza preparazione adeguata non supera l'OFA al primo tentativo." Anello 82% su ghiaccio; tre statistiche: "~30€ di tasse aggiuntive in media", "Piano di studi bloccato", "Rischi di dover ripetere un anno".

**Colonna 3:**
- "UN FUTURO PIÙ APERTO 04": "Supera un ostacolo oggi, per tutto ciò che verrà dopo." Quattro punti: Accesso al secondo anno, Libertà di scegliere il tuo percorso, Più opportunità internazionali, Un Politecnico senza ostacoli. Corsivo "Stessa partenza. Più possibilità."
- "STORIE REALI 05": "Stessi studenti, storie diverse. AddiOFA è già al fianco di migliaia di studenti del Politecnico di Milano." Testimonianza video: "Pensavo fosse impossibile, invece con AddiOFA l'ho superato al primo tentativo. - Luca, Ingegneria Politecnico di Milano" con carosello.
- "INIZIA ORA 06": "Sblocca il tuo domani. Un piccolo passo ora, per un grande percorso al Politecnico di Milano." Pulsante "Inizia ora", "Disponibile su" App Store / Google Play. Footer: logo, "Funzionalità, Prezzi, FAQ", **logo del Politecnico di Milano**.

**Nell'app (`screens/Landing.tsx`):** h1 ("Il test d'inglese dell'OFA, senza sorprese" simile), card di benefici (`p.titolo`), box Gratis/Pass, scadenze OFA, footer. Non c'è: hero fotografica/3D con scalinata e stella, timeline "Come funziona" a 4 passi con mockup del telefono, 4 carte funzionalità, sezione "Un futuro più aperto", pulsante "Inizia ora" ripetuto in coda.

**DA ADATTARE (molti):**
- **"l'82% degli studenti ... non supera l'OFA" e "migliaia di studenti"**: numeri inventati e prova sociale falsa. Rimuovere. Si può usare solo ciò che è vero e verificabile: ~30 € a tentativo di recupero (`RETAKE_COST_EUR`), nel piano solo esami del 1° anno, scadenze 31 agosto / 3 settembre / 25 settembre (`OFA_DEADLINES`).
- **Testimonianza "Luca, Ingegneria"**: recensione finta -> eliminare finché non esistono storie reali con consenso.
- **"Rischi di perdere circa 30€" nel telefono, "~30€ di tasse aggiuntive in media"**: riformulare "Il test di recupero presso un ente costa circa 30 € a tentativo" (verificabile).
- **"Simulazioni ufficiali / Timer e formato autentico / Domande come nell'esame reale"**: vietati "ufficiale" e "identiche al test" -> "Simulazioni nei formati del test di recupero e del TENG: 30 domande, 15 minuti".
- **"Libertà di scegliere il tuo percorso", "Più opportunità internazionali", "Un Politecnico senza ostacoli"**: promesse non dimostrabili, tono troppo da marketing -> ridurre a "Senza OFA puoi inserire nel piano gli esami del secondo anno" (vero, con avviso "le regole possono cambiare").
- **"Evitando rischi, costi e blocchi del tuo piano di studi"**: ammorbidire.
- **Logo del Politecnico di Milano** in footer, foto con scritta "POLITECNICO DI MILANO", "Un Politecnico senza ostacoli": affiliazione implicita; il `DISCLAIMER` dice il contrario. Togliere il logo; foto generiche di scalinata e stella vanno bene.
- **Pulsanti App Store / Google Play**: l'app è una PWA, non è negli store: non mettere.
- **"Disponibile su"**: sostituire con "Funziona nel browser, installabile".
- **Prezzo**: la landing del design non ha prezzo; la nostra deve avere Pass 14,99 (9,99 di lancio fino al 31/01/2027) e un solo pulsante principale; niente urgenza finta.

**Cosa copiare (alta):** la sequenza narrativa (problema vero -> come funziona in 4 passi -> cosa c'è dentro -> CTA), la timeline "01 Test iniziale, 02 Piano personalizzato, 03 Simulazioni, 04 Supera l'OFA" con il vero Percorso dell'app, il mockup di telefono con il misuratore, le 4 carte funzionalità, il pulsante in coda "Inizia il diagnostico".
**Schermata app:** Landing. **Priorità:** alta (struttura e 4 carte); le fotografie come immagini di sfondo (media: peso e rigenerazione).

### NN 33 - `file_00000000921c81f49ff61dea267eeb68.png` (941x1672)

**Tipo:** una schermata mobile, kit blu, Home con "Prossimo passo".
Dall'alto: logo "AddiOfa" + campanella; icona (i) a destra; misuratore grande 82% "Rischio di fallimento all'OFA di inglese"; card rosata **"PROSSIMO PASSO - Future tenses"** con icona libro, metadati "Lezione | 10 min | Riduce il rischio ~6%", testo "Completa questa lezione per abbassare il tuo rischio di fallimento.", pulsante blu "Inizia la lezione >"; box **"Il tuo percorso - Vedi tutti"** con linea 82% -> 62% -> 28%; box **"Il tuo progresso - 3 lezioni completate"** con barre crescenti e freccia. Barra: Home, Simulazioni, Lezioni.

**Cosa c'è di nuovo rispetto all'app:** la card "Prossimo passo" = suggerimento unico guidato (una sola azione chiara) con tipo, durata, effetto. `Menu.tsx` ha "Continua a studiare" ma senza dire che cosa si studia.
**DA ADATTARE:** "Riduce il rischio ~6%" (numero inventato) -> "Dura circa N minuti, Argomento: Future tenses, perché: sbagliato 3 volte su 4"; "Rischio di fallimento" -> "Probabilità stimata"; linea 82/62/28 -> togliere o usare dati veri; il pulsante blu in rosso se si resta nella famiglia A.
**Cosa copiare (alta):** la card "Prossimo passo" costruita sul ripasso dilazionato: l'argomento più debole + numero di domande + minuti stimati + motivo; il box "Il tuo progresso" con mini-barre crescenti.
**Schermata app:** Home / Menu. **Priorità:** alta (card Prossimo passo), DA ADATTARE (testi).

### NN 34 - `file_000000009a2c8246b7dab8a14af06360.png` (1536x1024)

**Tipo:** flusso di 15 schermate numerate (come NN 30, con NOI e Agorà al posto di Sfide generiche). Barra a 3 schede: Home / Studia / Classifica.

1. Splash. 2. Onboarding "Studia in modo mirato con un percorso personalizzato grazie all'intelligenza di ATLAS." 3. Test iniziale con ATLAS (box "ATLAS adatta le domande al tuo livello in tempo reale"). 4. **Risultati test (ATLAS):** radar a 5 assi, "Vai al tuo percorso". 5. **Home** (82%, prossimo passo Future tenses, il tuo percorso). 6. **Studia (panoramica):** tab Percorso/Esercizi/Simulazioni, "Continua da qui", "Tutte le unità" (5 unità). 7. **Lezione (esempio):** Future tenses, 1. Spiegazione. 8. **Esercizio:** 4/10, will go, Corretto. 9. **Simulazioni (lista)**. 10. **Risultato simulazione (ATLAS):** 72%, 29/40, analisi, aree da migliorare. 11. **Classifica (NOI):** logo "NOI", tab Settimanale/Mensile/Sempre, podio, righe 4-7, "Sfide attive: Completa 5 lezioni questa settimana 3/5". 12. **Sfida (NOI) "Sfida settimanale":** coppa, "Completa 5 lezioni questa settimana 3/5 completate", checklist di 5 azioni (lezioni di Grammar, Vocabulary, Listening, Reading, una simulazione), ricompensa "+100 punti, Badge esclusivo". 12b. **Discussione (Agorà) contestuale:** modale "Agorà - Qual è il modo migliore per studiare i phrasal verbs? 12 risposte - 2h fa", tab Più rilevanti / Più recenti, due commenti (laura.s, marco.p) con like e "Rispondi", campo "Scrivi una risposta...". 13. **Profilo (Project ID)**. 15. **Impostazioni** (Account, Preferenze, Notifiche, Privacy, Aiuto, Informazioni).

**Manca nell'app:** tutto ciò che riguarda NOI, Agorà, Project ID, sfide: è fuori lancio (`atlas/` Worker rimandato). Il forum Agorà con risposte altrui sarebbe un contenuto inventato.
**DA ADATTARE:** commenti di utenti finti; punti, badge esclusivi; ATLAS come IA.
**Cosa copiare:** solo la forma delle schede (sfida settimanale con checklist: utile per un **obiettivo personale** "questa settimana": 5 sessioni da 10 domande).
**Schermata app:** Atlas / Classifica / Profilo (rimandate). **Priorità:** bassa/rimandata.

### NN 35 - `file_000000009c60824684ade9547e05128a.png` (1536x1024)

**Tipo:** brand kit v1.0 "Politecnico di Milano 2026" (tavola fitta, circa 112 elementi), nuova identità con stella.
- **Hero:** "AddiOFA" (O con stella) e icona app con stella nella porta luminosa; claim "IL TUO INGLESE, SENZA OSTACOLI."
- **Logo variations:** primario, con tagline, orizzontale con icona, monocromatica positiva/negativa.
- **Icon / lettermark:** "A" blu con stella, app icon colore e dark (stella bianca su nero), icone semplici (stella, cerchio con stella, A, quadrato con stella).
- **Palette** (stessi hex di NN 28), **tipografia Inter** con gerarchia testi: H1 "L'inglese a Polimi senza sorprese." (con "senza sorprese" in blu), H2/H3, body "Verifica il tuo livello, scopri se sei a rischio e preparati per superare l'OFA di inglese." e caption "Evita di perdere circa 30€, sblocca il tuo piano di studi."
- **Iconografia** (10 illustrazioni), **illustrazioni & stile visivo** (4 immagini: scalinata con stella, cartelli Studio/Test/Progresso, telefono con 82%, edificio Politecnico), **elementi grafici**, **pattern & background**.
- **Applicazioni:** telefono, felpa, tote bag, quaderno "From obstacles to opportunities", borraccia. **Tagline e claim:** "Il tuo inglese, senza ostacoli.", "Small steps, big opportunities.", "Dall'OFA a tutto il resto.", "Stessi studenti. Percorsi più luminosi.", "Verifica. Preparati. Supera." **Tono di voce:** Chiaro, Motivante, Pratico, Affidabile, Giovanile, Empatico, Istituzionale, Diretto. **Valori del brand:** Crescita, Sicurezza, Accessibilità, Opportunità, Successo.

**Nell'app:** nessun nuovo logo; il testo "L'inglese a Polimi senza sorprese." ricorda la riga di apertura della Landing attuale.
**DA ADATTARE:** "L'inglese a Polimi": "Polimi" nel nome del prodotto e "Politecnico di Milano 2026" in testata -> riferimento all'ateneo, meglio "per il test d'inglese dell'OFA del Politecnico di Milano" in chiaro con disclaimer; "Evita di perdere circa 30€" va bene riformulato "Evita un tentativo di recupero (circa 30 €)"; "Sicurezza" come valore: attenzione a promesse di garanzia; "Istituzionale": togliere dal tono.
**Cosa copiare:** gerarchia dei testi (H1 bicolore, body, caption), tagline "Verifica. Preparati. Supera." (tre verbi: è anche la timeline del funnel), lettermark "A" per favicon/ avatar, valori brand.
**Schermata app:** Brand kit / logo. **Priorità:** media (dipende dalla decisione logo/colore).

---

## Dettagli da copiare

**Componenti**
- **Misuratore con colore variabile** (NN 20, 29): arco da blu a giallo a arancione a rosso mentre sale; per la probabilità conviene invertire (rosso basso, verde alto). Pallino luminoso con alone; tacche intorno all'arco (NN 21, 33).
- **Tessere dell'esito** (NN 18): tre tessere "Corrette / Errate / Tempo" con icona in cerchio colorato (verde, rosso, blu) sotto il misuratore, con "Vedi le correzioni" (pieno) e "Torna alla home" (contorno).
- **Elenco "Correzioni"** (NN 18): numero in cerchio, frase, risposta in riquadro verde con spunta o rosso con X, e sotto la risposta giusta per gli errori.
- **Tre tessere statistiche** (NN 18): Quiz svolti, Tempo di studio, Media risultati, con selettore periodo "Ultimi 30 giorni".
- **Barre per abilità con %** e "Vedi dettagli" (NN 18, 21): righe con icona quadrata, nome, barra, percentuale.
- **Card "Prossimo passo"** (NN 33, 30, 31): tipo, durata, motivo, un solo pulsante.
- **Card unità / lezioni con spunta** (NN 31, 30): numeri in cerchio, verde con spunta quando fatta, evidenziata la corrente, "Continua da qui".
- **Dettaglio obiettivo** (NN 25): unità con minuti, "Esercizi finali", pulsante "Inizia la prima lezione".
- **Fine lezione con prima/dopo** (NN 31): coppa, due valori affiancati con freccia, "Vai alla prossima lezione / Torna alla Home".
- **Schede simulazione in elenco** (NN 18, 30, 31): icona, titolo, durata, domande, pulsante "Inizia" (o freccia).
- **Barra a segmenti** nelle domande (NN 18): un segmento per domanda; **pillola timer rossa con orologio** (NN 18, 12/40); **chip categoria** sopra la domanda (NN 18); **pulsante segnalibro** accanto ad "Avanti" per rivedere dopo (NN 18).
- **Banner "Corretto!" verde** con spiegazione breve sotto la domanda (NN 30, 31).
- **Chip filtro** "Tutte / Preferite / Da ripassare / Già note" e **stella preferiti** (NN 18, Frasi e vocaboli): lista frasi con traduzione e altoparlante.
- **Obiettivi personali a barra** (NN 22): "Studia 30 giorni 7/30", "Completa 10 simulazioni 8/10"; **badge sobri** (Prima simulazione, 10 simulazioni, Accuratezza > 80%).
- **Radar o barre riassuntive nel risultato** del diagnostico (NN 30, 34), con argomenti veri.
- **Impostazioni** (NN 30, 31): Account, Preferenze (tema), Notifiche (interruttore), Privacy, Aiuto, Informazioni/Versione: raccoglie tema e suono oggi sparsi nell'intestazione di `Menu`.

**Micro-interazioni**
- Il pallino luminoso scorre lungo l'arco, il numero sale da 0, la scheda sotto cambia testo a tappe (NN 20, 29). Rispettare `prefers-reduced-motion` (nell'app `animato` esiste già).
- Opzione scelta: bordo e fondo rosato (famiglia A) o azzurro (famiglia B), radio pieno; dopo la risposta compare il banner.
- Icona (i) accanto ai titoli "Il tuo livello", "Fattori principali", "Come cambia": apre un foglio a scomparsa con (X) per chiudere (NN 25).
- Carosello orizzontale di suggerimenti con scheda che sporge dal bordo (NN 21, 25) e puntini di paginazione.
- Foglio che sale dal basso con maniglia/sfondo sfocato per "Come viene calcolato" (NN 25).

**Copy (da copiare con le correzioni indicate)**
- "Più studi, più il livello sale" al posto di "Più studi, più il rischio si abbassa" (NN 21).
- "Perché è solo una stima?" con spiegazione di cosa pesa (impegno, risultati nei quiz, costanza) (NN 25): onesto, da tenere.
- "Verifica. Preparati. Supera." (NN 35): tre passi del percorso.
- "Il tuo inglese, senza ostacoli." / "Supera l'OFA di inglese. Senza blocchi." (splash, NN 30/31): claim breve, accettabile.
- "Hai già l'attestato OFA di inglese? ..." (NN 31): già nel funnel come "certificazione".
- "Completa questa lezione per abbassare il tuo rischio di fallimento" -> "Ripassa questo argomento: è quello in cui hai più errori".
- Stati d'attesa del calcolo (NN 29): "Analizzando le risposte...", "Valutando sezioni del test...", "Calcolando il risultato finale...", "Quasi fatto...": usare solo se corrispondono a passi veri (conteggio risposte, livelli, soglia 24/30).
- "Lo sapevi? Dal secondo anno non puoi sostenere alcuni esami se non superi l'OFA" (NN 26): in linea con la regola del piano di studi; da accompagnare con la nota "Le regole possono cambiare" (`OFA_RULES_NOTE`).

**Da NON copiare** (riepilogo): "Rischio di fallimento 82%", "Rischio molto alto", "Rischio elevato", 82% -> 62% -> 28%, "Riduce il rischio ~6%", "migliaia di studenti del Polimi", "l'82% degli studenti...", testimonianza "Luca, Ingegneria", "Simulazioni ufficiali", "CRAM Pass Pro", logo/stemma Politecnico, App Store/Google Play, email @polimi.it obbligatoria, "ATLAS ha analizzato", classifica/Project ID/duelli/Agorà, follower e visualizzazioni dei mockup social, badge "Più scelto", "Massima sicurezza", "Ritardo di almeno 1 anno".
