# AddiOFA: strategia, prezzi, conti e rischi

> Fonte: `fonti/conversazioni_incollate/addiofa_chat_completa.md` (conversazione con un'AI, 27-30/09/2026 circa; il testo contiene la prima metà ripetuta due volte, qui contata una volta sola). Letta per intero.
> Complementare a `simulatore_ofa.md` (idea generale, dati sugli ammessi con OFA, rischi emersi in una chat precedente) e `ecosistema_project.md` (collegamento con Project ID, ATLAS, NOI, Agorà): qui non si ripete ciò che c'è già lì.
> Regola di lettura: quello che segue registra **che cosa è stato detto** (da te e dall'AI), con cifre e ipotesi. Le stime dell'AI non sono dati misurati. Le righe marcate **[verifica]** sono miei controlli o dubbi, non frasi della chat.
> Le idee proposte dall'AI che sono rischiose o illecite sono nel punto 8; qui sopra sono comunque segnalate con **(vedi 8)**.

---

## 1. Cosa è e perché

**Cos'è.** App per recuperare l'OFA di inglese al Politecnico di Milano: quiz, teoria e simulazione dei test; modello freemium, da vendere agli studenti (la tua descrizione iniziale).

**Come è stato scelto il nome**
1. Hai chiesto idee di nome. L'AI ne ha dato una prima lista (circa 15, in 4 stili) e, su richiesta, altre 50 (in 5 stili).
2. Hai proposto tu **AddiOFA** ("Addio" + "OFA"). L'AI lo ha approvato con tre motivi:
   - suona bene e si ricorda subito (pronuncia Ad-di-ò-fa);
   - esprime il sollievo di liberarsi di un blocco burocratico;
   - si presta a slogan.
3. Raccomandazione dell'AI: nel sottotitolo e nella grafica deve essere chiaro che si tratta di **inglese**, perché al Poli esistono anche gli OFA di matematica (test TOL). Nomi suggeriti per gli store: "AddiOFA – Inglese PoliMi" oppure "AddiOFA: Simulazioni TENG".
4. Slogan e usi proposti dall'AI: "AddiOFA: Supera l'inglese al PoliMi", "Scarica l'app e... AddiOFA.", "Di' per sempre AddiOFA al debito di inglese.", notifica "Mancano 3 quiz e poi sarà AddiOFA!". Suggerimento di marketing: livelli con nomi a tema Poli ("Matricola" gratuito, "Laureato" o "Sbloccato" premium).
5. **[verifica]** Nel nome/sottotitolo compare "PoliMi": in `simulatore_ofa.md` avevi già annotato di non usare "Polimi" nel nome del prodotto e di aggiungere che non è un servizio ufficiale. L'AI, invece, ha scritto "non violi nessun copyright del Politecnico": non è una verifica legale. Anche "TENG" come nome del test del Poli è detto dall'AI e non verificato.

**Alternative proposte dall'AI e non scelte.** Non hai scritto perché le hai scartate: hai semplicemente proposto un tuo nome. Nella tabella: il motivo che l'AI aveva dato per ciascuna, non un tuo rifiuto.

| Nome | Stile | Pregio indicato dall'AI | Punto debole (da me, dove non c'è nella chat) |
|---|---|---|---|
| OFApp | gioco di parole | corto, facile da cercare sullo store (consigliato per conversioni/SEO) | generico |
| ZeroOFA | diretto | punta al risultato (consigliato per conversioni/SEO); poi proposto come nome della seconda app ("UniOFA o ZeroOFA") | |
| ByeByeOFA, Sbloccami | colloquiali | empatia sui social (consigliati per meme/reel) | |
| RecuperOFA | descrittivo | ottimo per la SEO ("recupero ofa") | |
| Polingo | parodia di Duolingo | tra i 3 preferiti dell'AI nella seconda lista | richiama Duolingo [verifica marchio] |
| OFAtto! | gioco di parole | tra i 3 preferiti dell'AI ("Sì, OFAtto!") | |
| TengPass | tech | tra i 3 preferiti dell'AI; poi usato come nome (TENG-Pass) della **finta concorrente** a abbonamento | |
| TENG-Go, ClearEng, OFA Buster, OFAway, PoliPass Eng, ScansaOFA, OFA Free, EngPoli, BovisaEng/LeoEng, PolyLingua | varie | citati nella prima lista | |
| Seconda lista (50): SbloccaPoli, OFA Unlock, LiberOFA, OFA Exit, PoliTENG, TengHero, FastOFA, TurboTENG, SkipOFA, KillOFA, NoMoreOFA, Tengly, Ofify, PoliAce, ExamPoli e altri | 5 categorie: sblocco, insider Poli, ironici, fast-track, tech | un commento breve ciascuno | |

Nota: **nomi con "Poli/Polimi" o "TENG"** (PoliTENG, PoliPass, ExamPoli, ecc.) hanno lo stesso problema del punto 5 sopra.

---

## 2. Posizionamento e prodotto

### 2.1 Posizionamento
- Tua idea: AddiOFA **semplice, funzionale, completa, a prezzo giusto**; le altre due app fanno la monetizzazione e il marketing aggressivi (vedi 4).
- Costo dell'OFA come ancora di prezzo: **circa 30 €** (detto da te). Per l'AI qualunque cifra sotto 30 € è percepita come risparmio. In `simulatore_ofa.md`: 27,50-29 € a tentativo presso gli enti esterni.
- Ruolo di AddiOFA per l'AI: l'app "pulita", l'hub da cui portare lo studente verso NOI, Atlas, Agorà.
- Messaggio proposto dall'AI per AddiOFA: "Supera l'inglese e non pensarci più." Colori: viola/arancio moderno (stile Notion). Personalità: lo studente senior empatico.

### 2.2 Il test e il dataset (cifre dette da te)
| Dato | Valore |
|---|---|
| Frasi nel dataset | **636** |
| Argomenti | **31** (circa 20 frasi ciascuno, 636/31 = 20,5) |
| Test ufficiale | "di solito" **15 domande in 30 minuti**, frase a completamento di un termine (2 minuti a domanda) |
| Simulazioni distinte con 636 frasi (AI) | 42, senza ripetere frasi (636/15 = 42,4) |
| Simulazioni che fa uno studente medio (AI) | 4-8 (stima dell'AI, non un dato) |

**[verifica]** In `simulatore_ofa.md` il test è scritto come "30 domande in 15 minuti, soglia 25/30". Nella chat dici 15 domande in 30 minuti. Va chiarito quale sia giusto (i due documenti si contraddicono; forse sono due test diversi: Poli vs enti convenzionati).

### 2.3 Come cambia il freemium nella chat (4 versioni)
| # | Versione | Cosa è gratis | Cosa è a pagamento | Chi l'ha proposta |
|---|---|---|---|---|
| a | Freemium onesto di AddiOFA | teoria riassunta, 50 quiz base, **1 simulazione completa** | dalla 2ª simulazione, algoritmo di previsione, pacchetto 300+ domande avanzate | AI |
| b | "Quarantena" (free pool) | tutte le app gratuite pescano **solo dalle stesse 86 domande** (~13%) | le altre **550** (~87%) stanno nel "vault" e il server le dà solo agli utenti PAID | AI |
| c | Tua proposta | le 120 frasi che si possono vedere con la prova gratuita sono sempre le stesse per tutti, eventualmente non sbloccate tutte insieme | resto | tu |
| d | **Paywall verticale per argomento** (ultima risposta dell'AI) | **5 argomenti su 31** completi (es. Present Tenses, preposizioni base, pronomi, comparativi, modal verbs): circa **100 frasi** (5 x 20) | **26 argomenti** (es. Third Conditional, Phrasal Verbs, Passive Forms, Inversion) | AI |

Come funziona la versione d, secondo l'AI:
- la simulazione gratuita da 15 domande pesca 3 domande dai 5 argomenti liberi e **12 dai 26 bloccati**; risultato atteso 3/15 o 4/15, quindi "bocciato";
- a fine test il report dice: "Hai superato le domande di grammatica base, ma hai fallito su Condizionali e Phrasal Verbs. Questi 26 argomenti sono inclusi nel Pass Completo." **(vedi 8: la simulazione è costruita per far fallire)**.

Altre indicazioni dell'AI sul dataset:
- **non portarlo a 1.000 ora**: 636 bastano, meglio lanciare; aggiungere altre ~300 frasi dopo 6 mesi con l'app nazionale per i TOLC (tu avevi chiesto se salire a 1.000 o più/meno);
- varianti dinamiche: far generare a ChatGPT 2-3 varianti delle frasi più critiche (cambiano soggetti/complementi, la regola resta) così Google Lens non trova una corrispondenza esatta;
- timer per frase nelle simulazioni: **45 secondi massimi** (contro i 2 minuti a domanda del test reale), per non lasciare il tempo di passare la frase a un'AI;
- tempo minimo: nella simulazione non si può premere "Fine" prima di **20 minuti** (massimo 35).

### 2.4 Quote e tempi per app (calcolo dell'AI sul free pool da 86)
| App | Domande gratis | Tempo | Muro |
|---|---|---|---|
| AddiOFA | 1 test diagnostico da 10 domande + 1 simulazione da 30 = 40 | ~30 min (min 20, max 35) | hard paywall dalla domanda 41 |
| TENG-Pass | 1 test di valutazione da 15 domande; con la prova di 3 giorni max 40 domande al giorno, quindi 120 in 3 giorni | 12 min | addebito di 4,99 € al 4° giorno |
| CrashOFA | circa 9-12 domande prima di finire le 3 vite (errore medio ipotizzato 30%, quindi 1 su 3) | 6-8 min | cooldown 6 ore per 1 cuore (18 ore per 3) |

Caso peggiore (AI): lo studente scarica tutte e 3 le app nello stesso pomeriggio, spende **53 minuti**, vede al massimo le 86 domande del free pool e ne restano nascoste 550. **[verifica]** Il 30% di errore è un'ipotesi dell'AI. Inoltre le quote (40, 15, 120) non sono coerenti con il free pool da 86 e con la versione d: il passaggio da a/b a d non è stato riconciliato.

### 2.5 Domande fornite una alla volta dal server
- L'app **non scarica mai tutte le 636 domande**: chiama il server una domanda per volta (invia la 1, l'utente risponde, il server valida e invia la 2). Per l'AI è "tecnicamente impossibile" scaricare il dataset in blocco.
- Le domande non pagate sono inaccessibili a livello di server se l'utente non ha lo status PAID.
- Da `simulatore_ofa.md`: togliere domande e risposte dal codice che arriva al browser è già un lavoro tecnico previsto.

### 2.6 Protezioni contro screenshot, AI e copia
| Rischio | Contromisura proposta dall'AI | Note |
|---|---|---|
| Screenshot/registrazione su Android | `FLAG_SECURE` (schermo nero) | |
| Screenshot su iOS | listener `userDidTakeScreenshotNotification`: sfoca e mostra avviso; "al terzo screenshot l'account verrà sospeso senza rimborso" | **[verifica]** su iOS la notifica arriva dopo lo screenshot: si può reagire, non impedirlo. Clausola "senza rimborso": vedi 8 |
| Foto con altro telefono / giro su Telegram | watermark quasi invisibile (opacità 3%) con matricola o email dell'utente, per risalire a chi diffonde e "bannare per violazione del copyright" | serve informativa privacy (vedi 8) |
| Estrazione del database dall'APK o da F12/Network | domande una alla volta dal server | vale anche per una web app |
| ChatGPT / Google Lens sullo screenshot | timer 45 s a frase; varianti delle frasi; per l'AI all'esame reale non si può usare un'AI, quindi chi bara si boccia da solo | |
| Uso di più app/account per vedere più domande | quarantena 86/550; paywall verticale | |

**App nativa o web app.** Tu hai osservato che con una web app non si possono bloccare gli screenshot. L'AI ti ha dato ragione: "senza un'app nativa perdi il controllo sulla sicurezza", con F12/Network si scarica il JSON in 10 secondi e `Print Screen` non si blocca. Architettura consigliata dall'AI: app nativa in Flutter o React Native (un solo codice per iOS e Android), domande dal server una alla volta, pagamenti di AddiOFA via web (Stripe/Satispay con webhook che sblocca l'account). **[verifica]** Nel punto 7 lo stesso AI propone invece di partire con una PWA (che non ha `FLAG_SECURE`): è un compromesso da decidere, non una contraddizione risolta.

---

## 3. Prezzi e pagamenti

### 3.1 Le fasce
Tua idea originale: **5,99 / 9,99 / 19,99 €**, dove l'ultima aveva il rimborso totale in caso di fallimento, solo se rispettavi le condizioni (cioè se facevi il test con alta confidenza di superarlo). Hai chiesto di ricalibrare "in modo più giusto" sapendo che l'OFA costa circa 30 €.

| Versione | Fascia 1 | Fascia 2 | Fascia 3 (garanzia) | Note |
|---|---|---|---|---|
| Tua idea | 5,99 | 9,99 | 19,99 (rimborso totale se non passi) | |
| AI, ragionamento interno | 9,99 base | 14,99 "Pro" (tutte le simulazioni) | 24,99 o 29,99 | non è nella risposta finale |
| **AI, ricalibrazione finale** | **9,99 "Quick Pass"**: teoria riassunta + 300 quiz tematici, correzione base | **16,99 "Full Safe"**, il più venduto: tutto + simulazioni illimitate + spiegazione di ogni errore ("metà del costo del test") | **29,99 "Garanzia 100% o rimborsato"**: tutto + assistenza prioritaria + rimborso se non passi ("costa quanto l'esame") | dice che 5,99 è "troppo poco per il Poli" |
| Nella fase beta (AI) | 9,99 per il "Pass" dopo i posti gratuiti; pre-ordine a 9,99 | prezzi pieni 16,99 / 29,99 dopo la beta | | |
| `simulatore_ofa.md` | 9,99-14,99 € di accesso completo | | | altra chat, non coincide |

Confronto con la tua idea e con l'AI per gli altri prodotti: vedi 4.

### 3.2 Garanzia di rimborso: condizioni (3 versioni successive)
| Versione | Condizioni |
|---|---|
| 1 (risposta sui prezzi) | 100% della teoria completata; almeno 5 simulazioni consecutive con punteggio > 80%; attestato ufficiale di bocciatura dell'appello sostenuto entro 14 giorni dall'uso dell'app. L'AI dice che chi le rispetta passa "nel 99% dei casi" **(vedi 8: affermazione non sostenibile)** |
| 2 (prima risposta sulla verifica) | telemetria interna: tutte le simulazioni > 85% e tempo medio per domanda coerente (se cliccando a caso in 2 minuti totali, richiesta invalidata); poi prova video integrale; poi matricola |
| 3 (risposta finale) | **file `.eml` originale** o **video con login live**, più dati dati al pagamento |

La tua domanda: quando hai fatto il test, hai visto il punteggio live sul sito e poi hai ricevuto l'email con un documento HTML e una con nome e cognome; ma uno studente potrebbe falsificare un inoltro. Vuoi una sicurezza.

**Verifica della bocciatura (come proposta dall'AI)**
| Metodo | Come funziona | Limite |
|---|---|---|
| **Email `.eml` con DKIM** | non accettare inoltri o PDF/HTML/screenshot, solo il messaggio originale salvato come `.eml`; le email del dominio `polimi.it` sono firmate DKIM, se si cambia una cifra la firma risulta non valida; controllo con un tool online di validazione DKIM o uno script Python sul server | **[verifica]** non è detto che l'email di esito arrivi da `polimi.it` né che sia firmata; se l'OFA si fa presso enti esterni (vedi `simulatore_ofa.md`) il mittente è un altro |
| **Video continuo con login e refresh** | registrazione schermo senza tagli: apertura browser da zero, URL reale (nel testo finale `servizipoli.polimi.it`, nella prima versione `servizi.polimi.it`), accesso con SPID o credenziali di Ateneo, navigazione agli esiti test/carriera, refresh forzato (F5 o swipe), esito negativo e matricola coincidenti | espone credenziali e dati personali nel video (vedi 8); i due URL citati non coincidono: **[verifica]** |
| **Matricola** | al momento dell'acquisto del livello Garanzia si inseriscono nome, cognome, matricola (e, nella risposta finale, **codice fiscale**); rimborso solo se coincidono con la prova; **una matricola può chiedere il rimborso una sola volta nella vita** | dati personali raccolti (vedi 8) |
| Telemetria interna | punteggi, tempi per domanda, schemi anomali (la "trappola nell'app") | |

Clausola proposta: "Il rimborso è vincolato alla verifica dell'autenticità della prova fornita. Qualsiasi tentativo di manomissione, alterazione digitale di documenti o manipolazione del codice sorgente delle pagine di ateneo comporterà il rifiuto immediato del rimborso e la segnalazione del profilo per frode contrattuale." L'AI sostiene che il rimborso si fa "con Stripe in 1 click" e costa solo 0,20 € di commissione: **[verifica]** Stripe in Italia richiede partita IVA (vedi 7) e 0,20 € è la tariffa Satispay, non Stripe.

### 3.3 Commissioni: cifre dette dall'AI
Tua osservazione: nel calcolo iniziale non erano contate le commissioni che non gestisci tu, né il modo di farle costare il meno possibile.

| Canale | Commissione secondo l'AI | Su 29,99 € | Note |
|---|---|---|---|
| App Store / Google Play standard | 30% | circa 9 € | |
| App Store Small Business Program | **15%** (gratis, sotto 1 milione di dollari/anno) | calcolo dell'AI: imponibile 24,58 (IVA 22% scorporata), commissione 3,69, incasso 20,89 | su 16,99: imponibile 13,93, commissione 2,09, incasso 11,84 |
| Google Play | "15% in automatico sui primi 25.000 $" (frase dell'AI); account sviluppatore **25 $ una tantum** | | **[verifica]** soglia e condizioni |
| **Stripe** (web, carte e Apple/Google Pay) | **1,4% + 0,25 €** (in una risposta intermedia 1,5% + 0,25 €) | 0,67 €, incasso 29,32 | richiede partita IVA (vedi 7) |
| **Satispay Business** | **0,20 € fissi** sopra i 10 € (in una risposta "0,5% o 0,20 €") | 0,20 €, incasso 29,79 (99,3%) | proposto come "arma segreta" perché lo usano gli studenti |
| **Gumroad** (Merchant of Record) | **circa 10%** | circa 3 € [mio calcolo] | non serve partita IVA all'inizio, secondo l'AI |
| Apple Pay su carta web | in una riga del ragionamento interno "5%" | non ripreso | ignorare |

Confronto annuo dell'AI per 400 studenti (20% di 2.000) che comprano il pacchetto da 16,99: via Apple/Google circa **4.730 €**, via web (Satispay/Stripe) circa **6.500 €**, "quasi 1.800 € in più". **[verifica]** il primo numero parte dall'imponibile scorporato dall'IVA (11,84), il secondo dal prezzo pieno (16,99): il confronto non è omogeneo; inoltre 400 x 16,99 = 6.796 lordi.

Sulle regole Apple: l'AI dice che con il DMA si possono inserire link esterni per i pagamenti; in alternativa l'app permette solo il login e i "codici di attivazione" si vendono sul sito o via passaparola. **[verifica]** da leggere le regole Apple/Google attuali (link esterni, vendita di contenuti digitali): non da fidarsi della sola chat.

### 3.4 Scelte di pagamento per le diverse app (tua proposta: "diversi tipi di pagamento per le diverse app")
| App | Prodotto | Pagamento | Perché (AI) | Commissione | Netto |
|---|---|---|---|---|---|
| AddiOFA | una tantum 9,99-29,99 | **web: Stripe + Satispay** (Apple Pay e Google Pay attivi su web) | acquisto "ragionato", margine ~98% | ~1,5% | su 29,99: ~29,30 |
| TENG-Pass | abbonamento 4,99/settimana | **IAP nativo Apple/Google** | meno frizione (Face ID), conversione "5 volte superiore" (stima AI) | 15% | su 19,96: ~17,00 |
| CrashOFA | microtransazioni 0,99-3,99 | **solo IAP nativo, 1 tap** | acquisto d'impulso: col browser "abbandono del carrello al 100%" | 15% | su 0,99: ~0,84 |

---

## 4. Strategia delle app "concorrenti"

### 4.1 L'idea
Tua idea di partenza: creare **altre 2 app con lo stesso obiettivo e fare "una finta concorrenza dove vinco sempre io"**, anche perché se un possibile concorrente vede 3 app che fanno la stessa cosa forse rinuncia. Lo stesso autore, cioè tu, non è dichiarato **(vedi 8)**.

Risposta dell'AI: strategia "multi-brand" (come Luxottica o Match Group), con vantaggi (ASO sugli store, cambia la psicologia d'acquisto da "la compro?" a "quale compro?", deterrente per concorrenti, test di prezzo) e rischi:
- **regola 4.3 di Apple** (spam: stessa app con "skin" diversa dallo stesso account; "Don't create multiple Bundle IDs of the same app");
- recensioni diluite (1 app con 150 recensioni a 4,8 stelle contro 3 da 50);
- il passaparola funziona con **un solo nome**;
- manutenzione tripla (a meno di un backend unico).
L'AI inizialmente consigliava di lanciare prima solo AddiOFA e poi la seconda ("Cavallo di Troia", 2 app bastano); dopo la tua precisazione (presentarle in modo diverso, OFA anche fuori dal Poli, A/B test) ha detto che la strategia "diventa estremamente intelligente".

### 4.2 Le app: nomi, target, monetizzazione (evoluzione)
| Fase | App 1 | App 2 | App 3 |
|---|---|---|---|
| Idea AI (portfolio) | **AddiOFA** locale iper-Poli, ironica, meme | **UniOFA** (o ZeroOFA) generalista nazionale: Statale, Bicocca, PoliTo, Bologna, Sapienza; TOLC/CISIA | **CrashOFA** flashcard e quiz da 3 minuti, "100 vocaboli salvavita" |
| "3 must" (saturare il mercato) | identitaria (appartenenza) | istituzionale: sembri "quasi ufficiale o ministeriale", blu/bianco, nessuna battuta; 7,99-9,99 o abbonamento | pronto soccorso: "passa l'inglese in 72 ore senza studiare tutta la grammatica"; 1,99-2,99 o 0,99/giorno |
| Versione monetizzazione aggressiva | 4,99/sett + "The Vault" 9,99 (25-40 € per utente) | 19,99 accesso annuale una tantum (19,99 garantiti) | micro (0,99 vite, 2,99 PDF), 5-15 € per utente |
| **Versione finale (dopo la tua richiesta)** | **AddiOFA**: pulita, onesta, una tantum, integra le tue piattaforme | **TENG-Pass**: abbonamento **4,99 €/settimana**, **3 giorni di prova con carta** | **CrashOFA**: microtransazioni con le "vite" |

Dettagli della versione finale (AI):
- **TENG-Pass.** Personalità "professore severo/ente certificatore"; colori blu navy/grigio/bianco; slogan "Lo standard rigoroso per il superamento del TENG"; target: chi ha paura di sbagliare. Matematica: 4 settimane = 19,96 €, 6 = 29,94 €; durata media ipotizzata 3,5 settimane = 17,50 €.
- **CrashOFA.** Personalità "hacker furbo"; colori nero/verde neon/giallo; slogan "Bypassa l'OFA in 72 ore senza aprire libro"; target: disperato/pigro. Listino: spiegazione errori 3,99 €; pacchetto 3 simulazioni 4,99 €; cheat sheet "Le domande che escono sempre" 7,99 €; ricarica vite 1,99 € (altrove 0,99 € e spiegazione 1,99 €: **[verifica]** prezzi incoerenti nella chat). Carrello medio 16,97-21,96 €.
- Regola che hai posto: **le altre app non devono farti incassare meno di AddiOFA ("o uguale o maggiore, mai minore")**. Risposta AI: "valore estratto per utente tra 15 e 30 €" in tutti e tre i casi; niente sconti. **[verifica]** Nel conto del punto 6 CrashOFA incassa 11,00 € a pagante contro 18,19 € di AddiOFA (4.547,50/250) e 17,50 € di TENG-Pass: la tua regola non è rispettata dal modello.
- Il "Ponte": nelle app aggressive, nelle impostazioni o nei footer, un messaggio tipo "Stanco degli abbonamenti? Unisciti alla community di AddiOFA", così chi si stufa finisce comunque da te.

### 4.3 Elenco di ciò che si può differenziare (risposta "tutte le cose differenti")
| Area | Idee dell'AI per le finte concorrenti | Vedi 8 |
|---|---|---|
| Formato/UI | swipe stile Tinder (frase giusta/sbagliata); modalità "Sopravvivenza/Time Attack" (60 s, +3 s per risposta corretta, -5 s per errore); "Simulatore Terminale" grigio e spartano, "identico al software vetusto del Politecnico" | claim "identico" |
| Pressione all'acquisto | countdown rosso in home ("Mancano 11 giorni, 4 ore e 12 minuti al prossimo appello TENG", preparazione 34%, "rischio bocciatura: elevato"); vite (3 cuori, blocco 8 ore, ricarica 0,99 €); blur sulla spiegazione dell'errore, sblocco 1,99 €; notifica "I tuoi colleghi del Poli oggi hanno fatto 40 quiz. Tu sei ancora a 0" | sì |
| Contenuti | cheat sheet e trucchi "per indovinare"; modulo "Vocaboli Salva-Vita" da 3,99 € (300 vocaboli formali del Reading); diagnostico "predittivo con AI" a 15 domande con grafico a ragnatela "Probabilità di passare al primo colpo: 42%", il piano per portarla a 90% si paga | sì |
| Prezzi | offerta a tempo finto ("Sconto Matricole del 70%, solo per i prossimi 14 minuti: 6,99 € invece di 24,99 €", timer che scorre); upsell "Assistenza Dubbi H24" a 2,99 € con risposte automatiche generate dalle API di ChatGPT | sì |
| Onboarding (funnel "panico controllato") | quiz diagnostico obbligatorio di 5 domande trabocchetto; animazione finta "Analisi del tuo livello in corso..."; schermata "Rischio di bocciatura al TENG: 78%"; paywall "95% di probabilità in 7 giorni, sblocca la prova gratuita a 4,99 €/settimana" | sì |
| IAP aggiuntivi | "Spiegazione Pro" a pagamento; simulazione ufficiale a pacchetti (1 = 2,99 €, 5 = 6,99 €); **"The Vault: Archivio Domande Segnalate dagli Studenti" 9,99 €**, con in piccolo "Ricostruzione basata sui feedback della community" | sì |
| Abbonamento | settimanale 4,99 € (suona "come un drink"), prova gratuita di 3 giorni con carta; l'AI scrive che "moltissimi dimenticano di disdire" | sì |
| Pubblicità | video da 30 secondi per ricaricare una vita (~0,02 € a visualizzazione con AdMob) | |
| Marketing | un altro studente "(o tu stesso con un account fake)" che sui gruppi risponde "Usate AddiOFA" quando qualcuno si lamenta delle finte concorrenti | sì |

### 4.4 A/B test (tua motivazione: "mi permetterebbe di fare A/B test di varie funzioni")
| Test | Varianti (AI) |
|---|---|
| Modello di pagamento | A: gratis la teoria + 4,99 € una tantum per sbloccare le simulazioni; B: microtransazioni (3 simulazioni 1,99 €, 10 simulazioni 3,99 €); C: abbonamento 2,99 €/settimana |
| Onboarding | diagnostico obbligatorio ("scopri quanto sei a rischio bocciatura") contro dashboard senza frizioni |
| Teoria | grammatica spiegata (testi/schemi) contro solo quiz infiniti |
| Freemium | tre meccanismi diversi: onesto (AddiOFA), prova SaaS (TENG-Pass), arcade a vite (CrashOFA) |

Nota dell'AI: **separare le app** serve anche per testare il modello di prezzo sugli studenti, la cosa "più difficile".

### 4.5 Backend unico
- Un solo database (Firebase o Supabase nella prima risposta; poi nella tua configurazione: Cloudflare D1 + Firebase Auth) con le stesse domande e un tag per ogni domanda (#polimi, #tolc, #livelloB1, #grammatica).
- Frontend separati (3 progetti React Native/Flutter) con palette, font e icone diversi, che leggono le stesse API.
- Campi utente: AddiOFA `tier_level = 'free' | 'pro'` (free: teoria + 50 quiz + `simulations_completed <= 1`); TENG-Pass `has_active_subscription` (webhook Apple/Google); CrashOFA `hearts_count = 3` (scala a ogni errore, ricarica dopo 6 ore, oppure torna a 3 con IAP da 0,99 €).

### 4.6 Account sviluppatore, costi e regole
Tua domanda: si può mettere l'app sugli store con un nome sviluppatore diverso senza pagare di più, per non sembrare lo stesso?

| Store | Risposta AI | Costo | Note |
|---|---|---|---|
| **Apple** | **No.** Il nome sviluppatore è unico per account (account personale: nome e cognome reali; aziendale: ragione sociale). Per un nome diverso serve un secondo Apple ID | **99 $/anno** ciascuno; "trucco": pubblicare una con l'account di un amico/collega, dividendo la spesa | **Regola 4.3 (spam)**: no stesse app con skin diverse dallo stesso account; per aggirarla: 2-3 account diversi o app davvero diverse in struttura e tipo di quiz |
| **Google Play** | un solo nome sviluppatore per account; "molto più economico": un secondo account con altra email e altro nome | **25 $ una tantum** ("una pizza e una birra") | |
| Con poco budget | pubblicarle tutte dallo stesso account con loghi, colori, descrizioni e nome dell'app molto diversi: "il 90% degli studenti non guarda chi è lo sviluppatore" | | |

Altre cose dette: white-label publisher scartati come non praticabili; "Small Business Program" per la commissione al 15% (vedi 3.3).

### 4.7 Collegamento con Project ID, ATLAS, NOI, Agorà
Domanda tua: integrare Atlas, NOI, Project ID, Agorà in AddiOFA e, essendo lo stesso autore, anche nelle app concorrenti?
Risposta AI: **no, solo in AddiOFA**, per tre motivi:
1. protezione del marchio: le app aggressive avranno recensioni negative e utenti frustrati, e non vuoi che Atlas/NOI vengano associati;
2. AddiOFA come "Cavallo di Troia": risolve il primo problema (l'OFA) e porta lo studente dentro NOI, Atlas, Agorà;
3. il "Ponte" dalle finte concorrenti verso AddiOFA (vedi 4.2).

Il resto del piano di integrazione (login con l'account Project, algoritmo e infrastruttura di ATLAS, classifica su NOI, banner e post su polimi.agora) è già in `ecosistema_project.md` e `simulatore_ofa.md` e non viene ripetuto. **[verifica]** Se AddiOFA usa Project ID come login unico, qualunque altra app con lo stesso login rende evidente che sono dello stesso autore: la finta indipendenza è incompatibile con l'ecosistema (e con il punto 8).

---

## 5. Marketing e lancio

### 5.1 Numeri di mercato (detti da te)
- Studenti con OFA ogni anno al Poli: circa **2.000** su circa **10.000** matricole (con OFA di inglese); "forse non tutti", perché chi ha la certificazione deve solo inserirla nei servizi online del Poli.
- **[verifica]** `simulatore_ofa.md` riporta 1.400-1.600 ammessi/anno con OFA ENG (21-25%): da riconciliare con i 2.000 della chat.
- Ipotesi dell'AI sulla conversione: 15-25% dei debitori con le 3 app sommate; scenario "realistico" 25% = **500 paganti/anno**; altro scenario 20% = 400.

### 5.2 Gruppi PoliNetwork e rischio spam
- Tuo timore: nei gruppi del Poli di PoliNetwork una cosa a pagamento viene considerata spam e ti bloccano.
- Tua soluzione: aprire all'inizio solo a un **numero limitato di studenti**, guardare il comportamento e le statistiche.
- Piano AI: **beta chiusa gratuita da 50-100 studenti** (testo del post dell'AI: "progetto personale/tesi/esperimento", "cerco 50 matricole che hanno ancora il debito", registrazione con mail istituzionale) **(vedi 8: presentare il prodotto senza dichiarare l'intento commerciale e senza dire che è tuo; tu sei admin di PoliNetwork)**.
- Gestione tecnica della beta: accesso solo con mail `@mail.polimi.it`; codice invito (es. `POLIBETA24`) che azzera il prezzo del livello 2; chiusura automatica al 101° utente con messaggio "I 100 accessi gratuiti per la fase Beta sono esauriti... Sblocca il Pass a 9,99 €".

### 5.3 Statistiche da osservare (AI)
| Metrica | A cosa serve |
|---|---|
| Tempo medio per domanda | circa 15 s: interfaccia chiara; circa 2 minuti: testo troppo fitto o app lenta |
| Argomento più fallito tra i 31 | contenuti marketing; esempio fatto dall'AI: "80% sbaglia i Phrasal Verbs" (**ipotesi**, non dato) |
| Drop-off | in che schermata chiudono l'app: dove mettere i paywall |
| Esito del test reale | mail "Com'è andato l'esame ieri?" ai tester dopo il primo appello; raccolta di testimonianze |

Poi: chiedere ai tester che hanno passato di consigliare AddiOFA sui gruppi (l'AI: "non sarai più tu a fare spam; i moderatori non possono bannare studenti che si consigliano strumenti"), poi riattivare i prezzi pieni e vendere "sulle altre 1.900 matricole con debito" (**[verifica]** conto ingenuo: il mercato pagante reale è molto più basso, vedi 6).

### 5.4 Altri canali
Nella chat: gruppi Telegram/WhatsApp/Spotted (il passaparola di un solo nome), reel e meme su IG/TikTok con nomi come ByeByeOFA/Sbloccami, ASO sugli store. Per Agorà/polimi.agora e il banner, vedi `simulatore_ofa.md` e `ecosistema_project.md`.

---

## 6. Conti

### 6.1 Ipotesi (dell'AI, non misurate)
- 2.000 studenti con OFA di inglese al Poli all'anno; conversione 25%; **500 paganti** ripartiti 50% / 25% / 25%.
- Stack: **Cloudflare** (Pages, D1) per sito e database, **Firebase Auth** per il login, **GitHub** per il codice che va su Cloudflare (detto da te). **[verifica]** `simulatore_ofa.md` parla di login Google e `ecosistema_project.md` di Project ID: stack da riconciliare.

| App | Paganti | Ricavo | Commissione | Netto |
|---|---|---|---|---|
| AddiOFA (web) | 250: 50 x 9,99 + 150 x 16,99 + 50 x 29,99 | 499,50 + 2.548,50 + 1.499,50 = **4.547,50** | 2% (Stripe/Satispay): -90,95 | **4.456,55** |
| TENG-Pass (IAP) | 125 x 17,50 (3,5 settimane x 4,99) | 2.187,50 | 15%: -328,12 | **1.859,38** |
| CrashOFA (IAP) | 125 x 11,00 | 1.375,00 | 15%: -206,25 | **1.168,75** |
| **Totale** | 500 | **8.110,00** lordi | -625,32 | **7.484,68** |

**[verifica]** Se si divide per pagante: 18,19 € (AddiOFA), 17,50 € (TENG-Pass), 11,00 € (CrashOFA); contraddice la regola "mai minore" del punto 4.2. Nel conto non c'è un'ipotesi esplicita sui rimborsi del livello 29,99 (solo il fondo da 150 €), né l'IVA.

### 6.2 Costi fissi
**Primo calcolo (solo infrastruttura):** Cloudflare Pages 0; D1 0 (secondo l'AI "5 milioni di letture al giorno" nel piano gratuito); Firebase Auth 0 (fino a 50.000 utenti attivi mensili); GitHub 0; 2 domini ~12 €/anno ciascuno (~2 €/mese); Apple 99 $/anno (~8 €/mese); Google 25 $ una tantum. Totale **~10 €/mese**, 120 €/anno. Utile operativo (senza burocrazia e tasse): **7.364,68 €/anno**, **~613 €/mese** in media.

**Dopo la tua obiezione ("non hai calcolato la partita IVA con costi di apertura e mantenimento, ci sono tanti altri costi")**

| Voce (annuo) | Importo | Note |
|---|---|---|
| Commercialista in regime forfettario | 400-450 € (usato 450) | servizio online tipo Fiscozen/FlexTax; commercialista fisico a Milano 800-1.200 € |
| PEC + firma digitale | 40 € | Aruba o InfoCert |
| Conto business | ~84 € (7 €/mese) | Revolut Business, Qonto, Tot; banche tradizionali il doppio |
| Iubenda (privacy, cookie, termini di vendita) | 90 € | piano che copra più domini |
| Email (es. Google Workspace) | ~36 € (3 €/mese) | |
| Apple Developer Program | ~92 € | 99 $ |
| Domini | ~36 € | 3 domini per le 3 app, ~12 € ciascuno |
| Fondo rimborsi e contestazioni | ~150 € | ~2% del fatturato (**[verifica]** 2% di 8.110 = 162) |
| **Totale** | **~978 €/anno (~81,50 €/mese)** | 450+40+84+90+36+92+36+150 = 978 |

- Una tantum nel primo anno: 100-150 € per apertura formale della partita IVA e firma digitale.
- Se invece si fosse iscritti alla Camera di Commercio come e-commerce: 150 € di apertura e 53 €/anno, più INPS Commercianti con minimale fisso di circa **4.400 €/anno** (circa **2.900 €** con il forfettario), da pagare anche con incassi a zero. L'AI lo definisce lo "scenario sbagliato".

### 6.3 Fisco: ipotesi esatte
| Ipotesi | Valore (dalla chat) |
|---|---|
| Inquadramento | libero professionista/sviluppatore software (concessione di licenze d'uso del proprio software), **non** ditta individuale e-commerce |
| **Codice Ateco** | **62.01.00** |
| Regime | **forfettario startup**: primi 5 anni |
| Coefficiente di redditività | **67%** |
| INPS | **Gestione Separata**, **26,07%** sull'imponibile, nessun minimale fisso (si paga solo sull'incassato) |
| Imposta sostitutiva | **5%** per i primi 5 anni |
| Base su cui calcola | fatturato **netto di commissioni** 7.484,68 € (non il lordo 8.110) |

**[verifica]** Che l'Ateco 62.01.00 esenti da INPS commercianti, che le commissioni degli store si possano sottrarre dal fatturato fiscale e se l'IVA vada o no applicata dipendono dal caso concreto: le stesse domande sono nel punto 8 (commercialista). Anche `simulatore_ofa.md` avvertiva che l'inquadramento "non è scontato".

### 6.4 Netto
| Passaggio | Importo |
|---|---|
| Incassato netto (fatturato fiscale) | 7.484,68 € |
| Meno spese vive | -978,00 € |
| Cassa prima di tasse e INPS | 6.506,68 € |
| Base imponibile (67% di 7.484,68) | 5.014,73 € |
| INPS 26,07% | -1.307,34 € |
| Base per l'imposta (5.014,73 - 1.307,34) | 3.707,39 € |
| Imposta sostitutiva 5% | -185,37 € |
| Totale tasse + INPS | -1.492,71 € |
| **Netto annuo** | **5.013,97 €** |
| **Netto mensile (media su 12 mesi)** | **~418 €** |

Altre stime dell'AI:
- Prima della correzione sui costi (forfettario stimato a spanne): circa 5.400-5.800 €/anno, ossia 450-480 €/mese, partendo da 7.364,68 €.
- **Stagionalità** (esami): nei mesi di sessione (gen, feb, giu, lug) **1.400-1.800 €/mese**; nei mesi "morti" (mar, apr, mag, ott, nov, dic) **50-150 €/mese**; agosto e settembre non assegnati (settembre è citato come sessione).
- **Pareggio**: per coprire i ~978 € di costi fissi servono circa **60 pacchetti da 16,99 €** (978/16,99 = 57,6; calcolo senza tasse né commissioni).
- Scalabilità: costi burocratici fissi; con 1.500 studenti (altre università: Statale, Bicocca, TOLC/CISIA) l'AI dice "oltre 1.200-1.400 € netti al mese" senza mostrare il calcolo. **[verifica]** non verificabile.
- Il primo conto con prestazione occasionale: "fino a 5.000 € netti con ritenuta d'acconto del 20%" **(corretto poi, vedi 7)**.

**[verifica]** Confronti con i tuoi obiettivi: `simulatore_ofa.md` stima "500-1.000 € netti/anno" come scenario più probabile col solo OFA d'inglese del Poli e un obiettivo di circa 16.000 € netti/anno; il conto di questa chat arriva a circa 5.000 €/anno con ipotesi molto più ottimistiche (25% di conversione, tre app, partita IVA). I due scenari vanno confrontati.

### 6.5 Stack tecnico a basso costo
| Componente | Uso | Costo secondo l'AI |
|---|---|---|
| Cloudflare Pages | sito e frontend web | 0 € (banda e build illimitate) |
| Cloudflare D1 | database SQL con le 636 domande | 0 € (limite gratuito citato: 5 milioni di letture al giorno) |
| Firebase Authentication | login | 0 € fino a 50.000 utenti attivi al mese |
| GitHub | codice e deploy su Cloudflare | 0 € (repository privati gratuiti) |
| Cloudflare Email Routing | `info@addiofa.it` che inoltra su Gmail | 0 € |
| Domini .it/.com | | ~10-12 € l'anno ciascuno |

---

## 7. Come partire spendendo il minimo

La domanda: "Come fare per iniziare senza tutto questo, solo il minimo, o gratis?"

### 7.1 Prima risposta dell'AI (poi in parte corretta)
| Voce | Costo attuale | Soluzione proposta | Stato |
|---|---|---|---|
| Commercialista | 450 € | non aprire la partita IVA; incassare come privato; "cessione di diritto d'autore o prestazione occasionale" | **errato/rischioso (vedi 8)** |
| Privacy/Iubenda | 90 € | generatori gratuiti (FreePrivacyPolicy.com, PrivacyPolicies.com) o policy standard adattata | da valutare (vedi 8) |
| Conto business | 84 € | sotto-conto gratuito (Revolut personale, Hype, N26) usato solo per i soldi dell'app | |
| PEC + firma digitale | 40 € | non servono senza partita IVA | |
| Email | 36 € | Cloudflare Email Routing (gratis) | ok |
| Stripe | | account come "Persona fisica/Impresa individuale" con codice fiscale, senza partita IVA "fino a determinati volumi" | **corretto dall'utente: falso** |
| Apple 99 $ | | PWA (vedi sotto) o pre-ordine | |

**PWA.** AddiOFA come sito mobile-friendly su Cloudflare Pages, dominio addiofa.it (~10 €/anno), banner "Aggiungi alla schermata Home". Vantaggi (AI): costo iniziale circa 10 €, niente 99 $ Apple né 25 $ Google, niente commissioni store, incasso del 100% via Stripe (questo punto cade con la correzione). **[verifica]** Una PWA non ha il blocco screenshot nativo che nel punto 2.6 era "fondamentale".

**Pre-ordine per finanziare l'account Apple.** Dopo la beta: "I 100 posti gratis sono finiti. Chi vuole accedere in anteprima può fare il pre-ordine del Pass a 9,99 € sul sito"; con i primi 10 pre-ordini si raccolgono 100 € che pagano l'account Apple Developer, senza spendere di tasca propria.

**Semaforo a 3 fasi (prima versione)**
| Fase | Cosa | Spesa |
|---|---|---|
| 0 Validazione | niente P.IVA, pagamenti da privato; obiettivo 500-1.000 € di incassi | 10 € (solo dominio) |
| 1 Primi incassi | con i primi 1.500 € si paga Apple (99 $) e si creano le altre due app | |
| 2 Regolarizzazione | oltre 2.000-3.000 € di incassi stabili: 400 € a Fiscozen/FlexTax e partita IVA forfettaria (Gestione Separata) | 400 € dai soldi già incassati |

### 7.2 La tua correzione (fact-checking)
Hai incollato un fact-checking con fonti (Stripe, Fiscozen e altri) che dice, in sintesi:
- **Vero:** Stripe permette di scegliere "Persona fisica/Impresa individuale", di inserire il codice fiscale all'inizio, e accetta carte, Apple Pay, Google Pay.
- **Falso:** che Stripe consenta pagamenti commerciali senza partita IVA fino a certi volumi. In Italia Stripe richiede i dati fiscali completi (partita IVA) per la verifica (KYC) e per abilitare i **payout** sul conto; senza, l'account viene bloccato o limitato.
- **Falso:** che esista una soglia sotto la quale si vende online in modo continuativo senza partita IVA (nemmeno i 5.000 €): la discriminante è l'abitualità e l'organizzazione. Senza partita IVA solo APS/ASD e simili con il codice fiscale dell'ente.

**L'AI ha ammesso l'errore**: "darti quell'indicazione su Stripe per l'Italia è stato un errore grossolano". La vendita di beni digitali con consegna automatica 24/7 è e-commerce organizzato e continuativo; i 5.000 € valgono solo per il lavoro autonomo occasionale; Stripe rischia di bloccare i payout con i soldi degli studenti fermi sulla piattaforma.

### 7.3 Strade proposte dopo la correzione (prima della partita IVA)
| # | Strada | Come funziona (AI) | Nota |
|---|---|---|---|
| 1 | **Merchant of Record, es. Gumroad** | lo studente compra da Gumroad (azienda estera), che incassa, gestisce l'IVA, emette la ricevuta e ti paga una royalty; basta il codice fiscale; ~10% trattenuto; webhook che attiva l'account | **[verifica]** regime fiscale dell'incasso per te e condizioni attuali di Gumroad |
| 2 | **Validazione manuale peer-to-peer** | sblocco a mano: "Invia 9,99 € su Satispay o PayPal a [tuo tag] con la mail istituzionale nelle note"; cambi `tier = 'free'` in `'pro'` su D1 a mano o con uno script; obiettivo 20-30 studenti = 300 € | **(vedi 8)**: resta un incasso da dichiarare; Satispay/PayPal tra privati hanno condizioni d'uso proprie |
| 3 | **Apple/Google come Merchant of Record** | account "Individual" con codice fiscale; Apple vende, versa l'IVA e ti riconosce i proventi; 99 $ l'anno; "non ti blocca i bonifici come Stripe" | l'AI stessa nota che l'attività continuativa va regolarizzata; **[verifica]** il ruolo reale di Apple |
| 4 | Ko-fi / Buy Me a Coffee | l'app come "progetto studentesco libero"; funzioni premium sbloccate con una "donazione" da 5 o 10 €, con webhook per il codice licenza | **(vedi 8)**: donazione di facciata per un acquisto |

**Strategia finale dell'AI:** Fase 0, beta chiusa per 50 studenti su PoliNetwork (0 €); fase validazione con sblocco manuale Satispay tra privati o checkout Gumroad (0 €); poi il "semaforo": se non paga nessuno si è speso 0 € e resta un progetto per il CV; se i pagamenti superano **500-1.000 €**, si bloccano temporaneamente i pagamenti, si apre la partita IVA forfettaria (Gestione Separata, Ateco 62.01.00) con Fiscozen/FlexTax, si collega Stripe in regola e si scala "a 10.000 €".

---

## 8. Rischi e punti da verificare

Impostazione: sono proposte dell'AI (e alcune tue idee) che nella conversazione sono presentate come normali scelte commerciali. Qui le registro tutte, con il rischio accanto, senza giudizi morali. I riferimenti normativi sono a titolo di orientamento e **vanno verificati con un commercialista e/o un legale**; il principio generale è quello già richiamato in `simulatore_ofa.md`: Codice del Consumo (D.Lgs. 206/2005, pratiche commerciali scorrette, artt. 20 ss.), sanzioni dell'AGCM.

### 8.1 Pratiche commerciali e dark pattern
| Idea (chi) | Dove nella chat | Rischio |
|---|---|---|
| Monetizzazione "aggressiva, più soldi possibili" (tu) e "vendi la soluzione al panico, pagheranno qualsiasi cifra" (AI) | tutta la parte sulla monetizzazione | leva su ansia e paura (es. "perdere un anno e migliaia di euro", "spiegare ai genitori l'affitto"): pratica aggressiva/ingannevole se sfrutta lo stato di debolezza; non è un'idea sbagliata dire "AddiOFA costa meno dell'esame", lo è costruire la paura |
| **Abbonamento settimanale con prova gratuita che si rinnova** ("moltissimi dimenticano di disdire", "continueranno a pagare per settimane") | "The Sneaky Weekly", TENG-Pass | obbligo di informazioni chiare su prezzo, durata, rinnovo e come disdire prima dell'addebito; far leva sulla dimenticanza è proprio ciò che l'AGCM sanziona; rischio rimborsi/chargeback |
| **Urgenza finta**: sconto "Matricole 70% per 14 minuti, 6,99 € invece di 24,99 €" con timer che scorre | punto 4 delle differenze | pratica ingannevole (lista nera) se lo sconto non è reale; prezzo "pieno" mai praticato |
| **Countdown finto/ansiogeno** ("Mancano 11 giorni, 4 ore e 12 minuti al prossimo appello"; "preparazione 34%, rischio elevato") | UI e leve psicologiche | ok solo se la data e la percentuale sono veri e calcolati; altrimenti ingannevole |
| **Notifiche con attività inventata** ("I tuoi colleghi del Poli oggi hanno fatto 40 quiz...") | idem | affermazione falsa e pressione sociale |
| **Finto calcolo del rischio**: animazione "Analisi del tuo livello", "Rischio bocciatura 78%", "95% di probabilità in 7 giorni" | funnel di onboarding | percentuali senza base statistica: pubblicità ingannevole |
| **Simulazione gratuita costruita per far fallire** (12 domande su 26 argomenti bloccati, risultato atteso 3-4/15) | paywall verticale | presenta il punteggio come prova di impreparazione quando è determinato dal paywall; ingannevole se il report dice che sei "bocciato" |
| "Probabilità di passare al primo colpo: 42%" (diagnostico predittivo) | contenuti | affermazione scientifica non supportata |
| Vite punitive, blur sulla spiegazione, ricarica a 0,99 €, spiegazione a 1,99 € | freemium arcade | modello legittimo in sé ma "ad attrito" calibrato sulla frustrazione; informazione chiara del prezzo; attenzione a chi è sotto esame |
| Garanzia "99% dei casi" ("chi soddisfa i requisiti passerà nel 99% dei casi") | rimborso | non è un dato; non deve comparire in comunicazioni |
| Il livello "Garanzia" con condizioni poco visibili ("Garantito o rimborsato") | rimborso | le condizioni vanno mostrate **prima** dell'acquisto, in modo chiaro; clausole vessatorie (es. "al terzo screenshot sospensione senza rimborso", rimborso una sola volta nella vita per matricola) |
| Assistenza "Dubbi H24" a 2,99 € che in realtà è automatica (API ChatGPT) | upsell | se descritta come assistenza umana è ingannevole; dichiarare che è automatica |

### 8.2 Recensioni, account e concorrenza finti
| Idea | Rischio |
|---|---|
| **Account finto ("o tu stesso con un account fake")** che risponde sui gruppi "Usate AddiOFA" | recensione/promozione occulta; viola regole dei gruppi e dei moderatori (di cui sei admin); pratica commerciale scorretta |
| **Finta concorrenza**: 3 app dello stesso autore che si presentano come indipendenti, "tutte e tre ti lasciano 15-30 €", "nessuno scarica" | il consumatore non sa che le app sono collegate; se i nomi, i target e le recensioni sono presentati come concorrenti reali è pubblicità/pratica ingannevole; l'AI parla di "finte app" e di "monopolio dell'illusione di scelta". Se invece si dichiara "stesso autore" (come fanno i marchi di un gruppo), il problema cala molto |
| Un'app deve sembrare **"quasi ufficiale o ministeriale"** (UniOFA) | falso riferimento all'origine; vietato presentarsi come ente ufficiale |
| **Tre account sviluppatore** (e dividere un account con un amico) per non far risultare lo stesso autore | regole degli store sull'identità dello sviluppatore, **regola 4.3 (spam)** e duplicazione; chiusura degli account collegati; verifiche di identità richieste dagli store; **[verifica]** regole attuali Apple/Google |
| Recensioni a 5 stelle concentrate sull'app "pulita" ("Concentra lì tutte le recensioni a 5 stelle") | le recensioni false o sollecitate in modo non genuino sono vietate (norme consumo e store); solo recensioni vere |
| **Ponte** nelle finte concorrenti verso AddiOFA ("Stanco degli abbonamenti? Unisciti alla community") | accettabile solo se si dice che è lo stesso autore; altrimenti è un riferimento ingannevole al "concorrente" |
| Integrazione (Project ID, ATLAS) solo in AddiOFA | se lo stesso login collega le app, la finta indipendenza cade da sola |
| Obiettivo dichiarato: scoraggiare nuovi concorrenti "occupando" ogni angolo | non illecito in sé, ma non va fatto con false informazioni; per il Codice del Consumo conta come ti presenti al consumatore |

### 8.3 Domande e test del Politecnico: diritto d'autore e nome
| Idea | Rischio |
|---|---|
| "**Domande segnalate dagli studenti**" / "The Vault: Archivio Domande Segnalate dagli Studenti" a 9,99 €, con in piccolo "Ricostruzione basata sui feedback della community"; "Cheat Sheet: le domande che escono sempre" | se sono domande reali del test, si tratta di riproduzione di materiale d'esame (diritti d'autore e riservatezza del test, possibile violazione dei regolamenti per chi le ha segnalate); se non lo sono, "domande segnalate" è un'affermazione ingannevole. La chat non dice da dove vengano le 636 frasi: **da chiarire** |
| "Simulatore **esatto** del TENG"; interfaccia "identica al software vetusto del Politecnico" | claim di fedeltà non verificato; uso del nome del test e dell'ente |
| Nome e sottotitolo "AddiOFA – Inglese PoliMi" / "Simulazioni TENG"; "PoliPass Eng", "PoliTENG" ecc. | uso di "Polimi" e del nome del test; serve la dicitura che non è un servizio ufficiale (vedi `simulatore_ofa.md`) |
| App "istituzionale" blu/bianco che sembra ministeriale | vedi 8.2 |

### 8.4 Conflitto di interessi e gruppi PoliNetwork
- **Post "da ricercatore/studente"** ("progetto personale/tesi/esperimento") per entrare nei gruppi e "aggirare i moderatori", con l'obiettivo di monetizzare dopo la beta. Rischi: non dichiarare l'intento commerciale e la natura del progetto; contraddice il ruolo che hai in PoliNetwork (admin e responsabile Design & Marketing, da `simulatore_ofa.md`), cioè scrivi le regole che stai aggirando; perdita di fiducia, base del Pilastro 3.
- **Chiedere ai tester di fare promozione** sui gruppi "così non sei più tu a fare spam" (e di scrivere "io non sapevo nulla di inglese... scaricatela"): è accettabile se spontanea e dichiarando eventuali vantaggi; non se pilotata o con incentivi non detti.
- **Contare su una scarsità** ("i 100 posti gratuiti sono esauriti"): onesta solo se il limite è reale.
- **Uso di polimi.agora** per sponsorizzare: va dichiarato che AddiOFA è un tuo prodotto e va concordato con Agorà (già in `simulatore_ofa.md`).

### 8.5 Rimborsi, verifica e privacy (GDPR)
| Punto | Rischio |
|---|---|
| **Video con login SPID/credenziali d'Ateneo** | il video conserva dati personali e potenzialmente credenziali o sessioni autenticate; chiedere di mostrarle a un privato è rischioso per lo studente e per te (responsabilità, sicurezza, conservazione). Da evitare o da sostituire con un controllo meno invasivo |
| Raccolta di **matricola, codice fiscale, nome e cognome**, esito dell'esame | dati personali (alcuni sensibili per la carriera): serve informativa, base giuridica, minimizzazione, conservazione limitata |
| **Watermark con matricola/email** nelle schermate (3%) | traccia non dichiarata: va scritto nell'informativa |
| Telemetria dettagliata (tempi per domanda, drop-off, schemi di risposta, "tempo medio coerente") usata per **negare rimborsi** | trasparenza: va detto che i dati sono usati così; decisioni automatizzate |
| Mail e notifiche ai tester ("Com'è andato l'esame ieri?") | serve consenso/informativa per le comunicazioni |
| Privacy policy generata o copiata ("Usa FreePrivacyPolicy.com... o prendi una standard") | la policy deve descrivere ciò che l'app fa davvero (video, matricola, watermark, analytics) |
| Condizioni del rimborso | quelle pattuite devono essere chiare prima del pagamento; l'AI propone "rimborso una sola volta nella vita per matricola", sospensione "senza rimborso" al terzo screenshot, video senza tagli: da valutare come clausole vessatorie |
| "Segnalazione del profilo per frode contrattuale" | usare con cautela; non diffamare |

### 8.6 Recesso e obblighi verso i consumatori
- **Diritto di recesso di 14 giorni** nei contratti a distanza; per i contenuti digitali si perde solo con consenso esplicito e conferma dell'inizio dell'esecuzione (principio generale da verificare con un legale). Né la chat né le idee di prezzo ne parlano.
- **Abbonamenti**: informazioni su rinnovi, prezzo e modo di disdire; per le app via store, la gestione dell'abbonamento passa dallo store ma l'informazione resta tua.
- Il **rimborso** per chi non passa non sostituisce il recesso né le garanzie di legge.
- Termini e condizioni di vendita, informativa sul prezzo comprensivo di IVA (se applicabile), assistenza clienti.

### 8.7 Fisco e pagamenti
| Idea (AI) | Rischio / correzione |
|---|---|
| Incassare da privato senza partita IVA, "inquadrare come cessione di diritto d'autore o prestazione occasionale" | **errore ammesso dall'AI**: vendita online continuativa = attività organizzata, serve la partita IVA (i 5.000 € non sono una franchigia) |
| Stripe con solo codice fiscale | **errore ammesso**: payout bloccati senza partita IVA |
| Satispay/PayPal tra privati per vendere lo sblocco ("20-30 studenti = 300 €") | resta un ricavo da dichiarare; **[verifica]** condizioni d'uso dei servizi |
| Ko-fi / Buy Me a Coffee come "donazioni" per sbloccare le funzioni | è una vendita mascherata da donazione |
| Pre-ordine a 9,99 € sul sito per pagare Apple, prima della partita IVA | stessa questione fiscale; e pre-ordinare un prodotto che deve ancora esistere richiede chiarezza |
| Apple/Google come "Merchant of Record" senza partita IVA "i primi mesi" | l'AI stessa dice che prima o poi serve la regolarizzazione; **[verifica]** |
| Inquadramento 62.01.00 (Gestione Separata, 5%) | l'AI lo dà come "scenario corretto"; **da verificare con un commercialista** (ditta individuale/INPS commercianti, Camera di Commercio, coerenza del codice Ateco con la vendita di contenuti digitali, soglie del forfettario) |
| Netto calcolato su fatturato "netto commissioni" e senza IVA | **[verifica]** come si determina il fatturato quando c'è un intermediario (Apple, Google, Stripe) e se serve l'IVA |

### 8.8 Altri punti da controllare (miei)
- Numeri della chat che sono stime dell'AI: 25% di conversione, 3,5 settimane di abbonamento, 30% di errore, 15-30 € per utente, "conversione 5 volte superiore con Face ID", "99% di superamento", "5.000 € ecc.". Contano solo i dati misurati con la beta (come già in `simulatore_ofa.md`).
- Regole degli store (Apple 3.1.1, 4.3, link esterni/DMA, Small Business Program, Google Play) da leggere alla fonte.
- Funzioni tecniche dette dall'AI e da provare: blocco screenshot su iOS (solo rilevazione), `FLAG_SECURE`, verifica DKIM dell'email di esito.
- Marketing basato sul dato "80% bocciato per i Phrasal Verbs": usare solo se misurato.
- L'AI ha proposto più volte "ChatGPT dietro le quinte" per generare varianti e assistenza: contenuti generati vanno controllati e dichiarati.

---

## 9. Cose da decidere / da fare

| # | Cosa | Stato |
|---|---|---|
| 1 | Nome: confermare AddiOFA e verificare marchio e dominio (addiofa.it); decidere se "PoliMi"/"TENG" compaiono nel sottotitolo | da decidere |
| 2 | Chiarire il formato del test reale (15 domande in 30 minuti o 30 in 15; soglia) e l'origine delle 636 frasi (proprietà, diritti) | da fare |
| 3 | Scegliere il modello di freemium e la quota gratuita (free pool 86, 120 frasi, paywall verticale 5 argomenti su 31) | da decidere |
| 4 | Scegliere i prezzi (9,99 / 16,99 / 29,99 dell'AI, 5,99 / 9,99 / 19,99 tuoi, 9,99-14,99 della chat precedente) e le condizioni del rimborso | da decidere |
| 5 | Protocollo di verifica del rimborso: valutare un metodo meno invasivo del video con login (vedi 8.5) | da decidere |
| 6 | Decidere se fare le due app aggressive e, se sì, quali pratiche escludere (vedi 8.1-8.2) e se dichiarare lo stesso autore | da decidere |
| 7 | Decidere se integrare Project ID/ATLAS/NOI/Agorà solo in AddiOFA (consiglio dell'AI) | da decidere |
| 8 | Dimensionare la beta (50-100 studenti, mail `@mail.polimi.it`) con presentazione onesta del progetto e del tuo ruolo | da fare |
| 9 | Raccogliere le statistiche della beta (tempo per domanda, argomenti più sbagliati, drop-off, esito reale) | da fare |
| 10 | Informare e concordare con PoliNetwork e Agorà l'uso dei gruppi e di polimi.agora | da fare |
| 11 | Parlare con un commercialista **prima del primo incasso**: partita IVA, Ateco 62.01.00, INPS, IVA, trattamento delle commissioni | da fare |
| 12 | Scegliere come incassare nella fase iniziale (Gumroad/MoR, partita IVA subito + Stripe/Satispay Business) e scartare i metodi non regolari | da decidere |
| 13 | Scegliere PWA o app nativa per il lancio (sicurezza del dataset contro costo di 99 $ + 25 $) | da decidere |
| 14 | Rivedere i conti con ipotesi misurate (conversione, rimborsi, IVA) e confrontarli con `simulatore_ofa.md` | da fare |
| 15 | Privacy e termini: informativa su dati, matricola, watermark, telemetria; termini di vendita e recesso | da fare |
| 16 | Backend: una sola base (Cloudflare D1), domande una alla volta, `tier_level`/accessi lato server; riconciliare login (Firebase, Google, Project ID) | da fare |
| 17 | Leggere le regole Apple/Google (4.3, link esterni, Small Business Program, recensioni) | da fare |
