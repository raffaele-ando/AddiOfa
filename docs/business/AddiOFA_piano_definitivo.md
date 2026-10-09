# AddiOFA — Piano definitivo e business model

9 ottobre 2026 · Versione con grafici e commenti: https://claude.ai/code/artifact/1e348078-04e0-4bed-b6ee-5d64dfa449f0

## Sintesi e verdetto

AddiOFA deve diventare una sola app web, onesta e misurabile, che porta gli studenti sopra la soglia d'inglese del Poli con un **Pass da 14,99 € una tantum**. Sul solo Poli rende tra 0 e 1.750 € netti l'anno: è un buon primo prodotto e un buon portfolio, non uno stipendio. Per avvicinarti ai 16.400 € servono il mercato dei candidati al test d'ingresso, altri atenei o un accordo con chi vende già test, in 2-3 anni e senza garanzie.

### I numeri che contano

| Dato | Valore |
| --- | --- |
| Studenti che ogni anno devono recuperare l'OFA di inglese | 1.100-1.500 |
| Candidati che ogni anno fanno la prova d'inglese del test d'ingresso | circa 14.000 |
| Costo di un tentativo di recupero presso un ente | 27,50-30,50 € |
| Unico concorrente diretto (Unitest, corso TENG) | 64 € |
| Pass venduti nel 2027, scenario base | 68 (4 % del mercato del recupero, più la prevenzione) |
| Ricavi lordi 2027: prudente / base / buono | 249 / 1.338 / 3.834 € |
| Utile netto 2027 da professionista: prudente / base / buono | -352 / 179 / 1.747 € |
| Utile netto 2027 da impresa (contributo INPS minimo) | sempre in perdita, da -807 a -3.603 € |
| Lavoro per arrivare a vendere | circa 15 giorni la prima versione, 33 la completa |

### Le decisioni definitive

1. **Un solo marchio e una sola app web.** Niente app "concorrenti" finte, niente app nativa per ora, niente "Polimi" nel nome.
2. **Due pubblici con lo stesso prodotto.** Chi ha l'OFA e deve recuperarlo; chi prepara il test d'ingresso e vuole evitarlo.
3. **Un Pass a 14,99 €**, con un prezzo di lancio di 9,99 € fino a una data vera. Dall'estate 2027 una versione con garanzia a 19,99 €, con condizioni misurate dall'app.
4. **La tua idea degli inviti, resa robusta.** Il Pass è gratis con 3 compagni verificati con l'email del Poli che finiscono il diagnostico. Gli ambassador prendono il 20 % e devono dichiararlo.
5. **PoliNetwork come alleato dichiarato**, non da aggirare.
6. **Commercialista prima del primo euro.** Niente partita IVA da impresa finché i numeri della beta non dicono che i ricavi superano 5.000-6.000 €; la licenza a un partner è l'alternativa senza costi fissi.
7. **Decisione il 30 settembre 2027.** Con almeno 100 Pass nell'anno e almeno l'80 % di promossi tra chi li ha comprati, si allarga; altrimenti si tiene gratuita o si cedono i contenuti.

Le pratiche aggressive delle chat (account finti, urgenza finta, simulazione costruita per far fallire, tre app finte) sono escluse. Non per moralismo: sono vietate, si scoprono subito in una community chiusa e farebbero perdere l'unico mercato che hai. In un mercato di 1.400 persone dove tutti si parlano, il passaparola vero e un tasso di superamento dimostrato valgono più di ogni trucco.

Tutte le cifre vengono da fonti aperte il 9 ottobre 2026 o dal foglio `docs/business/AddiOFA_conti.xlsx`. Le ipotesi (conversione, quota con certificato, gestione INPS) sono segnate come tali e vanno sostituite con i dati della beta.

## Revisione critica delle chat

Delle due conversazioni con l'altra AI regge circa un terzo. Reggono:

- i dati delle graduatorie;
- il confronto del prezzo con i 29 € del test;
- lo spostamento su Cloudflare;
- l'obbligo della partita IVA.

Il resto sono numeri inventati, conti sbagliati e tattiche che in un ateneo chiuso come il Poli fanno perdere più soldi di quanti ne portano.

Le due fonti lette per intero sono `chat-idea-bozza.md` e il riassunto `docs/addiofa_strategia.md`, quest'ultimo di una seconda chat che nel repository non c'è.

### Le tue intuizioni giuste

In diversi punti hai corretto tu l'AI, e avevi ragione:

- Hai rifiutato di fare liste di singoli studenti dalle graduatorie: è giusto per legge e per reputazione.
- Hai visto che il sondaggio di Gestionale contava due volte chi aveva votato sia nel gruppo generale sia nello scaglione.
- Hai corretto il dato su PoliTo: il primo tentativo IELTS è gratuito, si pagano 164,90 € dal secondo.
- Hai detto subito che nei gruppi PoliNetwork un link a pagamento viene tolto in poche ore.
- Hai chiesto scenari prudenti e il costo vero della partita IVA, invece di fidarti del primo conto.
- Hai chiesto di non lasciarsi influenzare da un'altra AI.

### Le affermazioni dell'AI, una per una

| Affermazione dell'AI | Giudizio | Perché |
| --- | --- | --- |
| Mercato di 2.000-3.500 studenti l'anno con OFA di inglese | Gonfiato | Le graduatorie danno 1.437-1.609 ammessi con OFA ENG l'anno (2024-2026). Sono ammessi, non immatricolati. Una parte toglie l'OFA caricando un certificato. Nei corsi in inglese l'OFA segnala il certificato mancante, non lo scarso livello. Chi deve davvero fare il test è sotto i 1.500. |
| Conversione del 18-25 % a pagamento | Senza base | Nessun dato misurato. Le app educative convertono pochi punti percentuali (vedi Mercato). Il 25 % era un'ipotesi scritta come fatto. |
| Referral "porta 3 amici": 1.350 paganti e 13.486 € | Conto sbagliato | Il conto presume che chi non completa i 3 inviti paghi. In realtà quasi tutti questi studenti usano la parte gratuita, rimandano o pagano solo il test. La stessa AI, poco prima, stimava 2.000-3.500 € netti l'anno. |
| 450.000 € di ARR in 36 mesi, exit a 1,8-2,7 M€ | Fantasia | Non c'è un ricavo ricorrente: si vende una volta per esame. I multipli "4-6x ARR" valgono per software in abbonamento che cresce. Nessun compratore paga milioni per un'app da poche migliaia di euro. |
| Account finti che si consigliano l'app, notifiche con attività inventata, conti alla rovescia finti, "rischio bocciatura 78 %" senza calcolo | Vietato e controproducente | Sono pratiche commerciali scorrette (Codice del Consumo, artt. 20-26; alcune sono nella lista nera). In 5-6 gruppi dove tutti si conoscono, e con te admin, si scoprono in pochi giorni. Una volta scoperte, bruciano l'unico mercato che hai. |
| Simulazione gratuita costruita per far fallire, "le 100 domande esatte di LinguaViva" | Vietato | O è falso (pubblicità ingannevole), o sono domande d'esame riservate (diritti dell'ente e regole del test). In entrambi i casi è un rischio legale. |
| Tre app "concorrenti" dello stesso autore | Da scartare | Viola la regola 4.3 dell'App Store sulle app duplicate. Con lo stesso login Project ID la finta indipendenza cade da sola. Su circa 1.000 clienti l'anno triplica il lavoro senza allargare il mercato. |
| Vendere senza partita IVA (prestazione occasionale, Merchant of Record, "donazioni") | Sbagliato | L'AI stessa ha ammesso l'errore. Vendere online in modo continuativo è un'attività abituale. La soglia dei 5.000 € riguarda i contributi delle vere prestazioni occasionali, non le vendite. |
| "Chiamalo tutorato per stare in Gestione Separata" | Rischioso | L'inquadramento dipende da cosa fai davvero, non dal nome sul sito. Se l'Agenzia o l'INPS lo riqualificano come commercio, arrivano i contributi fissi arretrati. Va deciso con un commercialista (vedi Legale). |
| Codice ATECO 62.01.00 | Superato | Dal 1° aprile 2025 vale la classificazione ATECO 2025, con codici diversi. |
| Rimborso "se non passi", che "il 98-99 % passa" | Idea buona, numeri inventati | La garanzia condizionata è lecita se le condizioni sono chiare prima dell'acquisto. Il 98 % non è un dato. La verifica con video del login SPID è invasiva e da evitare. |
| Prezzo legato ai 29 € del test | Regge | È l'argomento più forte, ma ha un tetto: un tentativo fallito costa 29 € e un mese di attesa, non migliaia di euro. |
| Crash course a 49 € con 50 iscritti per 3 sessioni (7.350 €) | Da provare | Nessuna prova di domanda. Va testato con una lista d'attesa prima di organizzarlo. |
| Espansione a TOLC, Statale, PoliTo "senza riscrivere una riga" | Ottimista | Ogni ateneo ha un test, un calendario e un canale diversi. CISIA offre già esercitazioni gratuite. Ogni mercato va validato a parte. |

### Il conto che l'AI non ha mai fatto per intero

La domanda giusta è quanto vale l'app per lo studente. L'AI non l'ha mai posta.

Se l'app evita in media mezzo tentativo fallito, fa risparmiare circa 15 € e qualche settimana. Per questo il prezzo sostenibile sta tra 10 e 15 €, non oltre, e con circa 1.000-1.500 clienti possibili l'anno l'OFA d'inglese del Poli da solo non ti mantiene a Milano.

L'AI lo ha detto una volta ("500-1.000 € netti l'anno, scenario più probabile"), poi lo ha contraddetto con i conti gonfiati sul referral.

## Mercato verificato

Il mercato del recupero vale circa 1.100-1.500 studenti l'anno, con un solo concorrente diretto a pagamento (Unitest, 64 €) e nessuna alternativa gratuita del Politecnico. Accanto c'è un mercato dieci volte più grande che l'altra AI non ha visto: chi prepara la prova di inglese del test d'ingresso per non prendere l'OFA.

Tutti i dati sono stati controllati il 9 ottobre 2026 su fonti aperte; l'elenco completo è in fondo.

### Le regole, come sono davvero

| Punto | Cosa dicono le fonti ufficiali (a.a. 2026/27) |
| --- | --- |
| Chi riceve l'OFA | Chi fa meno di 24 risposte giuste su 30 nel TENG, la prova di inglese del test d'ingresso (TOL, TOLD, ARCHED): 30 domande in 15 minuti. Anche chi entra con il TOLC-I sotto 24/30. A Urbanistica tutti. |
| Livello richiesto | B1, non B2. Bastano Cambridge B1 Preliminary, IELTS 4, TOEFL 45 o TOEIC 550. |
| Come si toglie | Con una certificazione B1, o con un test presso un ente convenzionato. Non esistono corsi gratuiti di recupero: lo dice la FAQ dei corsi di lingua del Poli. |
| Conseguenza | Finché c'è l'OFA, nel piano degli studi entrano solo esami del 1° anno. Niente corsi né esami del 2° anno; l'iscrizione all'anno dopo non è bloccata. |
| Scadenze | Per avere il piano completo del 2° anno: 25 settembre (Ingegneria), 31 agosto (Architettura), 3 settembre (Design). Chi le manca ha una seconda finestra a gennaio-marzo, ma solo per il 2° semestre. |
| OFA di matematica | Non esiste più: dal 2024/25 restano solo inglese e italiano. Non è un mercato in cui espandersi. |

### I test di recupero

| Ente | Prezzo a tentativo | Formato | Soglia |
| --- | --- | --- | --- |
| LinguaViva (British Language Services) | 29,00 € | 30 domande A-D in 15 minuti, da casa con sorveglianza | 25/30, più alta del TENG |
| Language Academy | 27,50 € | 30 domande in 15 minuti, 1 sessione al mese | non pubblicata |
| British Institutes | 30,50 € | scritto di 40 minuti e orale di 20 | non pubblicata |
| EAS Milan | non pubblicato | TOEIC Bridge in sede, circa un'ora | 84 |

Nessuna fonte indica un limite ai tentativi: si ripete pagando ogni volta. A metà ottobre le sessioni LinguaViva risultavano piene o quasi, segno che la domanda c'è.

### Quanti clienti

Il numero di studenti con OFA di inglese non è pubblico: va stimato. Le tre fonti disponibili vanno nella stessa direzione.

| Fonte | Dato |
| --- | --- |
| Immatricolati triennali e ciclo unico (USTAT) | 7.476-7.905 l'anno dal 2020 al 2025; 7.820 nel 2024/25 |
| Graduatorie 2022-2026 (tua analisi aggregata) | 21-25 % degli ammessi con il dato ha l'OFA ENG: 1.437-1.609 persone l'anno |
| Tuo sondaggio a Gestionale, senza doppioni | 32 su 136, cioè 23,5 % |

Da qui la stima di lavoro:

- circa 1.400 matricole l'anno con l'OFA (il 21 % dei circa 7.000 iscritti ai corsi in italiano);
- di queste, il 15-30 % lo toglie con un certificato B1 già in tasca, quindi circa 1.000-1.200 devono fare un test;
- si aggiungono 100-300 studenti degli anni prima che lo trascinano.

Il totale è di 1.100-1.500 persone l'anno. La quota con certificato e gli arretrati sono ipotesi: un sondaggio più largo, o una richiesta all'Ufficio statistico del Poli, le può misurare.

**Il mercato che manca nelle chat.** Ogni anno circa 14.000 candidati (14.162 nelle graduatorie 2026) fanno il TENG dentro il test d'ingresso, tra febbraio e maggio. Prepararlo serve due volte: evita l'OFA e alza il punteggio d'ammissione (l'inglese vale fino a 10 punti su 100). È il mercato su cui Unitest vende a 64 €. Lo pagano spesso le famiglie, che per il test d'ingresso comprano già libri e kit da 19-140 €.

### Concorrenti

| Chi | Cosa offre | Prezzo |
| --- | --- | --- |
| [Unitest, Corso TENG Polimi](https://www.unitest.app/test/teng-polimi/) | 300 quesiti, 10 simulazioni, schede di grammatica, demo gratuita; sul mercato dal 2016 | 64 € (listino 99 €) |
| [Supermat INGenius](https://academy.supermat.it/ingeniustest/) | Preparazione al TOL con un modulo di inglese | 57-77 € l'anno |
| [Alpha Test](https://www.alphatest.it/libri/test-universitari/alpha-test-ingegneria-tolc-i-manuale-di-preparazione) | Libri per TOLC-I; il manuale non tratta l'inglese | 18,90-139,50 € |
| Testbusters | Corsi TOL e TOLC-I senza un modulo dedicato al TENG | non pubblicato |
| Hoepli Test, thefaculty | App gratuite per i test d'ingresso, non specifiche per il TENG | gratis |
| Politecnico | 2 test di autovalutazione con circa 60 domande (PDF del 2006); corsi di inglese a 100 € che non tolgono l'OFA | gratis / 100 € |

Nessuna app è dedicata a chi ha già l'OFA e deve recuperarlo, e su YouTube non c'è un video dedicato. Il rischio vero non è un concorrente: è il materiale gratuito che gira nei gruppi Telegram, che non ho potuto verificare.

### Quanto convertono prodotti simili

| Riferimento | Dato |
| --- | --- |
| [RevenueCat, State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps) | Da download a pagante entro 35 giorni: mediana 2,1 %, quartile alto 4,5 %; con accesso solo a pagamento 10,7 %. Europa occidentale 2,0 %. |
| [Duolingo, 2° trimestre 2026](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm) | 12,7 milioni di paganti su 140,6 milioni di utenti mensili, circa il 9 %: è un tetto, non un riferimento. |
| [Lenny Rachitsky sulla conversione freemium](https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion) | 3-5 % è buono, 6-8 % ottimo. |
| Referral ([Andrew Chen](https://andrewchen.substack.com/p/braindump-on-viral-loops)) | Coefficiente virale tipico 0,2-0,3: il passaparola aggiunge il 25-43 % di utenti, non una crescita che si alimenta da sola. |
| [Pubblicità Meta in Italia (Superads)](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/italy) | Circa 10,50 € ogni mille visualizzazioni e 0,50 a clic. Con le conversioni sopra, una vendita da pubblicità costa 200-330 €. |

Con un acquisto da 10-20 € la pubblicità a pagamento non si ripaga: i clienti devono arrivare dal passaparola, dalle ricerche su Google e dai tuoi canali. Il bisogno qui è più acuto che in un'app generica, quindi tra chi prova davvero l'app è ragionevole puntare al 5-12 %, non al 18-25 % delle chat.

## Il prodotto definitivo

AddiOFA deve essere una sola app web (PWA) con un solo marchio. Fa una cosa: portare uno studente sopra la soglia d'inglese del Poli, prima del test d'ingresso o dopo, con l'acquisto di un Pass una tantum.

Oggi l'app è una buona app di studio gratuita, ma non si può vendere: pagare non sblocca niente e tutte le 636 domande con le risposte sono già scaricabili dal browser. Servono circa 15 giorni di lavoro per una prima versione a pagamento e circa 33 per quella completa.

### Per chi

| Pubblico | Quanti l'anno | Quando compra | Cosa vuole |
| --- | --- | --- | --- |
| Recupero: matricole e studenti con l'OFA | 1.100-1.500 | ottobre-novembre, gennaio-febbraio, soprattutto luglio-settembre | passare il test dell'ente al primo tentativo e avere il piano del 2° anno completo |
| Prevenzione: candidati al test d'ingresso | circa 14.000 | febbraio-maggio | non prendere l'OFA e guadagnare fino a 10 punti nel test d'ingresso |

I due pubblici studiano le stesse regole d'inglese di livello B1. Cambiano solo il formato della simulazione e il modo di raggiungerli.

### Cosa è gratis e cosa si paga

| Funzione | Gratis | Pass |
| --- | --- | --- |
| Quiz diagnostico da 10 domande con la probabilità vera di superare il test (il calcolo già nell'app è corretto) | sì | sì |
| Ripasso intelligente su un nucleo di circa 100 domande delle regole di base | sì | sì |
| Una simulazione completa nel formato scelto | sì | sì |
| Tutte le domande, ripulite (circa 600) |  | sì |
| Simulazioni illimitate in due formati: ente convenzionato (4 opzioni, soglia 25/30) e TENG (5 opzioni, soglia 24/30, penalità -0,25) |  | sì |
| Spiegazioni in italiano e teoria per ognuno dei 31 argomenti |  | sì |
| Modalità sugli errori, radar degli argomenti, statistiche complete |  | sì |

La parte gratuita deve bastare a capire il proprio livello e a imparare le basi, non a sembrare sufficiente. Il Pass vale 12 mesi.

### Cosa togliere o rimandare

| Cosa | Decisione | Perché |
| --- | --- | --- |
| Domande q607-q636 e nucleo q1-q60 | Riscrivere prima di vendere | Hanno il formato e i refusi di una prova copiata: se vengono da un test vero c'è un rischio di diritto d'autore e di riservatezza. |
| Tre app "concorrenti" | Eliminare | Vietate dalla regola 4.3 dell'App Store, ingannevoli, triplo lavoro su un mercato piccolo. |
| App nativa iOS e Android | Rimandare | La PWA basta. Evita i 99 $ l'anno e la commissione dello store; lo screenshot non si blocca comunque. |
| Project ID, ATLAS, classifica NOI | Rimandare | Al lancio aggiungono obblighi di privacy e una classifica falsificabile. Il codice di ATLAS che verifica i login è però la base più rapida per il server. |
| Garanzia "rimborsato se non passi" | Rimandare alla stagione estiva | Oggi si falsifica in un minuto. Torna quando i progressi sono registrati sul server (vedi Business model). |
| Watermark con la matricola, video del login SPID | Eliminare | Sono dati personali in più senza un vantaggio vero. |
| Login solo con email @mail.polimi.it | Solo per il recupero | Serve a verificare gli inviti. I candidati al test d'ingresso non hanno ancora l'email del Poli. |

### Il lavoro tecnico, in ordine

| # | Lavoro | Giorni | Per la prima versione a pagamento |
| --- | --- | --- | --- |
| 1 | Server su Cloudflare (Worker + D1): domande servite una alla volta, risposte controllate sul server, stato "Pass" deciso dal server | 4 | sì |
| 2 | Pagamento con Stripe Checkout e conferma automatica | 2,5 | sì |
| 3 | Paywall nell'app | 2,5 | sì |
| 4 | Salvataggi più leggeri e regole Firestore che validano i dati | 1,5 | sì |
| 5 | Domande di provenienza dubbia riscritte | 2 | sì |
| 6 | Formato dei test di recupero verificato con chi li ha fatti | 1 | sì |
| 7 | Misure di uso e vendite (diagnostico fatto, paywall visto, acquisto, esito del test) | 2 | sì |
| 8 | Pagine legali e consensi al checkout | 1,5 | sì |
| 9 | Hosting, pulizia del codice, prove su telefono | 4,5 | in parte |
| 10 | Spiegazioni in italiano | 5 | no |
| 11 | Teoria per argomento | 4 | no |
| 12 | Illustrazioni più leggere e prove complete sui dispositivi | 2,5 | no |

Il totale è circa 33 giorni; i lavori 1-8, più 2 giorni di prove, fanno la prima versione a pagamento in circa 15 giorni.

## Business model e prezzi

Si vende un solo prodotto, il **Pass AddiOFA a 14,99 € una tantum**, valido 12 mesi. Dall'estate 2027 si aggiunge una versione con garanzia a 19,99 €. Tutto il resto (inviti, ambassador, corso live, affiliazioni) serve a vendere più Pass o va prima provato con una lista d'attesa.

### Perché 14,99 €

- È metà di un tentativo fallito (27,50-30,50 €) e un quarto di Unitest (64 €).
- Con meno di 1.500 clienti possibili l'anno, a 4,99 € non si coprono nemmeno i costi fissi.
- Oltre 20 € il prezzo supera il valore per lo studente: un tentativo fallito costa 29 € e un mese di attesa.

Al lancio vale un prezzo di lancio di 9,99 € con una scadenza vera e scritta (per esempio fino al 31 gennaio 2027). Uno sconto con un timer che riparte è vietato; uno con una data vera no.

### I prodotti

| Prodotto | Prezzo | Quando | Note |
| --- | --- | --- | --- |
| Pass AddiOFA | 14,99 € (lancio 9,99 €) | da gennaio 2027 | Tutte le domande, simulazioni illimitate nei due formati, spiegazioni e teoria. Vale per recupero e prevenzione. |
| Pass con garanzia | 19,99 € | da giugno 2027 | Rimborso se non passi il test di un ente avendo rispettato condizioni misurate sul server (vedi sotto). |
| Corso live prima della sessione | 25-29 €, 2 ore su Zoom, massimo 30 persone | luglio e gennaio, solo se la lista d'attesa supera 15 iscritti | Pass incluso. Lo tiene un compagno di livello C1 pagato a ore, o tu. |
| Affiliazione per le certificazioni (TOEIC, Cambridge) | commissione per contatto o vendita | da provare nel 2027 | Utile a chi vuole un certificato per Erasmus o magistrale. Va trovato un partner disposto a pagare. |

### La garanzia, fatta bene

La tua idea è giusta: rimborso solo a chi ha studiato davvero, con le condizioni scritte nei termini. La differenza con le chat è che ogni condizione deve essere misurata dal server, visibile prima dell'acquisto e semplice da dimostrare.

1. **Condizioni, tutte registrate dall'app**: almeno 7 giorni con 30 minuti di studio prima del test, almeno 3 simulazioni nel formato dell'ente superate con 25/30 o più, e padronanza di almeno l'80 % delle domande.
2. **Prova della bocciatura**: l'esito inviato dall'ente, con lo stesso nome dell'account, entro 14 giorni. Niente video del login né codice fiscale.
3. **Limiti**: un rimborso per persona, pagato con Stripe in pochi giorni.
4. **Comunicazione**: le condizioni stanno accanto al prezzo, non solo nei termini. In app c'è una barra che mostra a che punto sei, come già previsto da `GuaranteeTracker`.

La garanzia è anche uno strumento di studio: spinge a fare quello che fa passare il test. Il costo atteso è basso, perché chi rispetta le condizioni di solito passa; il numero vero si misura nella prima estate.

### Inviti e ambassador

| Meccanismo | Come funziona | Perché così |
| --- | --- | --- |
| Invita i compagni (la tua idea) | Il Pass diventa gratuito per chi porta 3 compagni con email @mail.polimi.it verificata che completano il diagnostico in almeno 4 minuti. Chi è invitato ha il 20 % di sconto. | Lo sblocco dipende dal fatto che il diagnostico venga completato, non dal punteggio: se dipendesse dal fallire, lo farebbero fallire apposta. L'email del Poli impedisce gli account finti. |
| Ambassador | Chi ha comprato può chiedere un link: 20 % (3 €) per ogni vendita portata, pagato a fine mese. Deve scrivere che è un link con commissione. | Un prezzo uguale per tutti evita il "perché a me 15 e a lui 10?". Una commissione non dichiarata è pubblicità occulta. |

Secondo i benchmark, gli inviti porteranno il 25-40 % di utenti in più, non una crescita che si alimenta da sola. Il Pass regalato a chi invita è il costo di acquisizione e va bene così.

### Test A/B: su cosa sì e su cosa no

I test tra corsi diversi sono una buona idea per i messaggi, il diagnostico, il numero di inviti richiesti (2 o 3) e la parte gratuita. **Il prezzo invece va cambiato tra stagioni, non tra corsi nello stesso momento**, per due motivi:

- le community sono collegate e un prezzo diverso tra compagni si scopre in un giorno;
- in Italia la personalizzazione dei prezzi va dichiarata.

### PoliNetwork: da ostacolo a canale

Il problema non è aggirare gli admin, è che sei uno di loro. La strada che regge è proporre un accordo dichiarato al direttivo di PoliNetwork:

- diagnostico e nucleo gratuiti per tutti;
- un codice sconto per gli iscritti alla community;
- una quota fissa (per esempio il 10 % degli incassi) alla community, oppure Pass gratuiti per chi ha l'ISEE più basso;
- un messaggio fissato una volta per sessione che dice chiaramente che il prodotto è tuo.

Se dicono di no, hai perso una conversazione. Se fai da solo e ti scoprono, perdi il canale, il ruolo e la reputazione nell'unico mercato che hai. La stessa regola vale per il profilo polimi.agora: si può usare, dicendo che AddiOFA è tuo.

## Conti

Con le ipotesi verificate, AddiOFA sul solo Poli porta nel 2027 tra -350 e +1.750 € netti (circa 180 € nello scenario base), e solo se puoi lavorare come professionista. Se l'attività è un'impresa, i contributi INPS minimi la mettono in perdita in tutti e tre gli scenari. L'obiettivo di 16.400 € l'anno non si raggiunge con questo mercato da solo.

Utile netto del 2027 (foglio `AddiOFA_conti.xlsx`, Anno 2027):

| Scenario | Da professionista (Gestione Separata) | Da impresa (Commercianti) |
| --- | --- | --- |
| Prudente | -352 € | -3.603 € |
| Base | +179 € | -2.863 € |
| Buono | +1.747 € | -807 € |

Il conto completo, con ogni ipotesi modificabile, è nel foglio `docs/business/AddiOFA_conti.xlsx`. Le formule sono calcolate e controllate (242 formule, nessun errore); il foglio lo rigenera `docs/business/genera_conti.py`.

### Il 2027 in tre scenari

| Voce | Prudente | Base | Buono |
| --- | --- | --- | --- |
| Mercato del recupero (persone) | 1.129 | 1.401 | 1.669 |
| Finiscono il diagnostico | 282 | 560 | 918 |
| Pass venduti, recupero + prevenzione | 18 | 68 | 164 |
| Quota del mercato del recupero che compra | 1,3 % | 3,6 % | 7,2 % |
| Ricavi lordi (Pass, garanzia, corsi live) | 249 € | 1.338 € | 3.834 € |
| Costi variabili (Stripe, recessi, rimborsi, ambassador, community, docente) | 39 € | 268 € | 659 € |
| Costi fissi (commercialista, dominio, stampa, legale, server) | 515 € | 635 € | 685 € |
| Margine prima di contributi e imposta | -305 € | 435 € | 2.490 € |
| Contributi INPS da professionista (26,07 % del reddito forfettario) | 41 € | 224 € | 651 € |
| Contributi INPS da impresa (minimo ridotto del 35 %) | 2.998 € | 2.998 € | 2.998 € |

Le ipotesi principali sono queste:

- conversione del 5 / 9 / 13 % di chi finisce il diagnostico;
- dal 25 al 55 % del mercato che prova l'app;
- il 2,5 % dei candidati al test d'ingresso raggiunti nello scenario base;
- Pass a 14,99 €, con una parte delle vendite a 9,99 € di lancio;
- coefficiente del 67 % e imposta del 5 %.

### Quanti Pass servono

| Traguardo | Da professionista | Da impresa |
| --- | --- | --- |
| Andare in pari nell'anno | 78 Pass | 382 Pass |
| Arrivare a 16.400 € netti | circa 2.090 Pass | circa 1.970 Pass |
| Per confronto: tutto il mercato del recupero | 1.401 persone | 1.401 persone |

Da impresa servirebbe vendere a un quarto di tutti gli studenti con OFA solo per andare in pari. L'obiettivo personale richiede più Pass di quante persone hanno l'OFA in un anno.

### I prossimi tre anni (scenario base)

Se ogni anno cresce del 25 % la quota che prova l'app, raddoppiano i candidati raggiunti e dal 2029 si aggiunge un secondo mercato da 2.000 €, l'utile da professionista passa da circa 180 € (2027) a 490 € (2028) e 2.170 € (2029). Da impresa resta in perdita fino al 2029 (-230 €).

### Tre cose che contano più delle altre

1. **La gestione INPS.** È la differenza tra un piccolo utile e una perdita sicura. L'interpretazione prevalente dice che vendere l'accesso automatico a quiz è un'impresa (Gestione Commercianti); i corsi e il tutoraggio sono attività da professionista (Gestione Separata). Lo decide il commercialista, prima di aprire.
2. **Restare a carico dei genitori.** Il limite è 4.000 € di reddito complessivo l'anno, e conta anche il reddito forfettario (ricavi × 67 %). Nello scenario buono sei a circa 2.500 €, quindi sotto. Se lo superi, i genitori perdono le detrazioni per te per tutto l'anno, comprese quelle sulle tasse universitarie. Sulla borsa DSU il reddito pesa nell'ISEE con due anni di ritardo.
3. **La dimensione del mercato.** Con circa 1.400 persone l'anno nessun prezzo e nessun referral fanno 16.400 €. Servono la prevenzione (14.000 candidati), altri atenei o un accordo con chi vende già test d'ingresso (vedi Roadmap).

## Go-to-market

I clienti vanno raggiunti senza pubblicità a pagamento, nei tre momenti in cui il bisogno è forte, con canali dove dici chiaramente che il prodotto è tuo. Il primo incasso utile è a gennaio-marzo 2027; il grosso arriva tra luglio e settembre 2027.

### Canali

| Canale | Per chi | Costo | Cosa fare |
| --- | --- | --- | --- |
| Ricerca su Google | recupero e prevenzione | 0 € | Una guida gratuita "Come togliere l'OFA di inglese al Poli" con regole, enti, prezzi e scadenze aggiornati, e pagine per "simulazione TENG" e "test OFA LinguaViva". Chi cerca su Google ha già il problema. |
| Accordo con PoliNetwork | recupero | quota concordata | Vedi Business model. È il canale con più studenti, se si usa alla luce del sole. |
| polimi.agora (circa 6.000 follower) | recupero | 0 € | Post nelle settimane prima delle scadenze, con scritto che AddiOFA è un tuo progetto. |
| Sondaggi nei gruppi di corso | recupero | 0 € | Come hai fatto a Gestionale: misurano quanti hanno l'OFA. Si scrive in privato solo a chi sceglie l'opzione "voglio provare il simulatore gratis". |
| Video brevi e YouTube | prevenzione | 0 € | Su YouTube non c'è nessun video sul TENG: "Le 24 regole del TENG in 10 minuti" può posizionarsi subito. Reel e TikTok per i maturandi tra febbraio e maggio. |
| Volantini con QR diverso per ogni punto | recupero | 50-100 € l'anno | La tua idea di misurare quale punto rende di più è giusta. Vanno messi solo nelle bacheche libere e nei punti consentiti: adesivi su tavoli e muri sono imbrattamento (art. 639 c.p.) e portano dritti a te. |
| Inviti e ambassador | tutti | 20 % per vendita | Vedi Business model. |
| Email agli iscritti gratuiti | tutti | 0 € | Due messaggi prima di ogni scadenza, solo con il consenso dato all'iscrizione. |

### Calendario dei picchi

| Periodo | Chi compra | Mossa |
| --- | --- | --- |
| ottobre-novembre | matricole che hanno appena scoperto l'OFA | guida, sondaggi, beta |
| gennaio-marzo | chi ha mancato settembre e vuole il 2° semestre (finestra del piano 11/02-09/03 per Ingegneria) | lancio a pagamento, email |
| febbraio-maggio | candidati al test d'ingresso | video, simulazione TENG |
| luglio-25 settembre | tutti quelli che vogliono il piano completo del 2° anno | stagione principale, garanzia, corso live |

### Cosa misurare dal primo giorno

| Misura | Obiettivo della prima stagione |
| --- | --- |
| Visitatori che finiscono il diagnostico | 50 % o più |
| Iscritti con il diagnostico finito che comprano entro 60 giorni | 5-10 % |
| Ancora attivi dopo 7 giorni | 30 % o più |
| Chi ha il Pass e supera il test dell'ente (dichiarato in app) | 80 % o più |
| Rimborsi e contestazioni | sotto il 5 % |
| Origine di ogni iscritto (QR, Google, inviti, PoliNetwork) | sempre registrata |

Il tasso di superamento è il numero più importante. Se è alto e vero, è la pubblicità più forte che puoi avere ("l'85 % di chi ha usato AddiOFA ha passato il test al primo tentativo"). Se non lo misuri, non lo puoi dire.

## Legale, fisco e rischi

Per vendere serve una partita IVA fin dal primo Pass. La forma fiscale decide se AddiOFA guadagna o perde, quindi la scelta va fatta con un commercialista prima di incassare, non dopo. Le pratiche aggressive proposte nelle chat sono quasi tutte nella lista nera del Codice del Consumo.

### Le tre strade per incassare

| Strada | Come funziona | Costo fisso | Per te |
| --- | --- | --- | --- |
| Partita IVA da professionista (Gestione Separata) | Forfettario al 5 %, contributi del 26,07 % solo su quanto guadagni. Adatta soprattutto se vendi formazione con una parte dal vivo (codice 85.59.20, coefficiente 78 %). | circa 500 € l'anno di commercialista | La migliore, se il commercialista conferma che regge. Non basta chiamare "tutorato" un'app automatica. |
| Partita IVA da impresa (Commercianti) | Interpretazione prevalente per chi vende l'accesso automatico a quiz (codice 58.29.00, coefficiente 67 %): Registro imprese e contributo minimo. | circa 3.000 € l'anno di INPS (4.611,64 € meno il 35 %) più circa 600 € di commercialista e camera di commercio | In perdita sotto i 4.000-6.000 € di ricavi: non conviene aprire così prima di avere i numeri. |
| Licenza del software a una società che lo vende | Un partner con partita IVA (una scuola di lingue, un'azienda di test d'ingresso) vende AddiOFA e ti paga diritti d'autore. | nessuno | Niente partita IVA né INPS; tassato il 60 % sotto i 35 anni, con ritenuta. Funziona solo se non fai tu assistenza, marketing o gestione: altrimenti è di nuovo attività. |

Le strade che le chat proponevano senza partita IVA non reggono: prestazione occasionale, Paddle o Gumroad, "donazioni", Satispay tra privati. La riduzione INPS del 50 % per i nuovi iscritti valeva solo per chi è entrato nel 2025: non ne ho trovato una proroga per il 2026.

**Restare a carico.** Il limite è 4.000 € di reddito l'anno. Conta il reddito forfettario (ricavi × coefficiente) o il 60 % dei diritti d'autore. Con i diritti d'autore resti a carico fino a circa 6.660 € lordi.

### Domande per il commercialista

- [ ] Vendere l'accesso a una web app di quiz è attività da professionista o da impresa? Aggiungere corsi live sposta l'inquadramento?
- [ ] Quale codice ATECO 2025 e quale coefficiente: 67 %, 78 % o 40 %?
- [ ] Per il limite di 4.000 € conta il reddito forfettario prima o dopo i contributi?
- [ ] La strada dei diritti d'autore con un partner è sicura, e serve l'IVA sulla licenza del software?
- [ ] Come pagare gli ambassador (ritenuta, dichiarazione)?
- [ ] Il 5 % per i primi 5 anni vale anche se prima hai fatto lavori occasionali?

### Obblighi verso chi compra

| Obbligo | Cosa fare nell'app |
| --- | --- |
| Pulsante d'ordine | Deve dire "ordine con obbligo di pagare" (o simile); prima mostrare prezzo, durata e condizioni. |
| Recesso di 14 giorni | Per un contenuto digitale si perde solo con due caselle non preselezionate (consenso e rinuncia) e un'email di conferma. |
| Funzione "recedere dal contratto qui" | Obbligatoria dal 19 giugno 2026 per i contratti online, con conferma e ricevuta. |
| Garanzia | Condizioni oggettive accanto al prezzo; niente "a nostro insindacabile giudizio" e niente percentuali di successo che non puoi provare. |
| Recensioni e ambassador | Solo recensioni vere; chi è pagato scrive "adv" o "link affiliato". Commissioni solo sulle vendite dirette: più livelli sono uno schema piramidale. |
| Privacy | Informativa, registro dei trattamenti, contratti con i fornitori (Cloudflare, Firebase, Stripe), cancellazione dell'account dall'app, statistiche senza dati personali o con consenso. Chiedere l'esito del test solo per un rimborso, poi cancellarlo. |
| Nome del Politecnico | Niente "Polimi" nel nome, nell'icona o nei colori; nella descrizione "preparazione all'OFA di inglese del Politecnico di Milano" con la dicitura "prodotto indipendente, non affiliato". |

Come riferimento: a febbraio 2026 l'AGCM ha multato eDreams per 9 milioni di euro per falsa urgenza, piano più caro preselezionato, prova gratuita addebitata e disdetta ostacolata. Le sanzioni vanno da 5.000 € a 10 milioni.

### Rischi

| Rischio | Probabilità | Effetto | Cosa fare |
| --- | --- | --- | --- |
| Domande copiate da una prova vera (q1-q60, q607-q636) | media | diffida, prodotto da ritirare | Riscriverle prima di vendere. |
| Contributo INPS fisso da impresa | alta, se nessuno decide prima | -3.000 € l'anno | Commercialista prima di aprire; licenza a un partner come alternativa. |
| Scontro con PoliNetwork | alta, se promuovi di nascosto | perdi canale, ruolo e reputazione | Accordo dichiarato con il direttivo. |
| Il Poli cambia o abolisce l'OFA di inglese | bassa nel breve, reale nel tempo | il mercato sparisce | La Scuola AUIC sta già valutando il superamento degli OFA. Tieni il prodotto utile anche per il TENG e per la certificazione B1. |
| Contenuti che girano gratis | media | meno vendite | Domande servite dal server una alla volta; il valore sta nell'algoritmo e nelle statistiche, non nella lista. |
| Unitest abbassa il prezzo o fa un'app | media | concorrenza sul prezzo | Puntare su ciò che Unitest non ha: ripasso adattivo, recupero dopo l'OFA, prezzo sotto i 15 €. |
| Tempo tuo | certo | circa 33 giorni di lavoro, più la gestione | Fare prima la versione da 15 giorni e fermarsi se i numeri della beta non arrivano. |

## Roadmap

Il piano ha cinque fasi da oggi al 2028. Il momento della decisione è il 30 settembre 2027: lascia una stagione intera per misurare se il prodotto vende e se fa passare il test.

| Quando | Fase | Controllo alla fine |
| --- | --- | --- |
| ott - dic 2026 | 1. Preparare (circa 15 giorni di lavoro): domande riscritte, server e paywall, misure, pagine legali, commercialista, PoliNetwork, sondaggio | 15 dicembre: forma fiscale decisa e risposta di PoliNetwork |
| gen - mar 2027 | 2. Beta pubblica e prime vendite (Pass a 9,99 € fino al 31 gennaio, poi 14,99 €, solo con la partita IVA pronta; altrimenti lista d'attesa) | 31 marzo: almeno 300 diagnostici finiti e 5 % che compra o si mette in lista |
| feb - mag 2027 | 3. Prevenzione: video sul TENG, simulazione TENG, pagine per Google | |
| giu - 25 set 2027 | 4. Stagione principale: garanzia, corso live, ambassador, email prima delle scadenze | 30 settembre: almeno 100 Pass nell'anno e 80 % di promossi tra chi ha il Pass |
| 2028 | 5. Allargare (secondo mercato o accordo con un'azienda di test) o cedere (app gratuita, licenza dei contenuti) | |

Se il controllo di marzo non passa, la stagione estiva si fa comunque, ma con l'app gratuita e la lista d'attesa. Così non si apre una partita IVA da impresa che costa 3.000 € l'anno prima di sapere se qualcuno paga.

### Questa settimana

- [ ] Togliere dal repository `firebase-applet-config.json`, che contiene la chiave di un altro progetto Firebase.
- [ ] Controllare da dove vengono le domande q1-q60 e q607-q636, e riscrivere quelle copiate.
- [ ] Prenotare una consulenza con un commercialista e portargli le domande della sezione Legale.
- [ ] Scrivere la proposta per il direttivo di PoliNetwork (gratis per tutti, codice sconto, quota alla community, prodotto dichiarato tuo).
- [ ] Lanciare un sondaggio in 4-5 corsi diversi: chi ha l'OFA, chi ha già un certificato B1, con quale ente ha fatto o farà il test.
- [ ] Chiedere a 5 compagni che hanno fatto il test LinguaViva o Language Academy com'era davvero (formato, difficoltà, argomenti).

### Il primo mese di sviluppo

1. Server su Cloudflare partendo dallo scheletro di ATLAS: domande servite una alla volta, controllo delle risposte, stato del Pass.
2. Due formati di simulazione (ente 25/30 e TENG 24/30).
3. Stripe Checkout con conferma automatica, paywall, pulsante d'ordine e caselle del recesso.
4. Misure: diagnostico, paywall, acquisto, esito del test dichiarato, origine dell'utente.
5. Pagine legali, informativa privacy e funzione di recesso.
6. Guida gratuita "Come togliere l'OFA di inglese" per Google.

## Fonti

Tutte aperte il 9 ottobre 2026. I rapporti completi delle ricerche, con il grado di sicurezza di ogni dato, sono in `docs/business/ricerche/`.

**Politecnico di Milano**

- [OFA di inglese](https://www.polimi.it/studenti/piano-degli-studi-e-ofa/ofa-obblighi-formativi-aggiuntivi-di-inglese-e-di-italiano/ofa-di-inglese)
- [Requisiti linguistici, triennali in italiano](https://www.polimi.it/studenti/requisiti-linguistici/studenti-dei-corsi-di-laurea-triennale-in-italiano)
- [Enti esterni convenzionati](https://www.polimi.it/studenti/requisiti-linguistici/enti-esterni)
- [Agevolazioni economiche](https://www.polimi.it/studenti/requisiti-linguistici/agevolazioni-economiche)
- [FAQ dei corsi di lingua](https://www.polimi.it/fileadmin/user_upload/formazione/Corsi_di_lingua/FAQ_CORSI_DI_LINGUA_STRANIERA.pdf)
- [Calendario 2026/27, dettaglio processi](https://www.polimi.it/fileadmin/user_upload/studenti/calendari-scadenze/Dettaglio_processi_calendario_a.a._2026-2027_-_SA_20.04.2026_agg_29.04.pdf)
- [Come prepararsi al TOL](https://www.polimi.it/futuri-studenti/test-e-ammissione/laurea/ingegneria/in-cosa-consiste-il-tol-e-come-prepararsi)
- [Relazione del Nucleo di Valutazione 2024](https://www.polimi.it/fileadmin/user_upload/Il-Politecnico/governance/organi-di-ateneo/nucleo-di-valutazione/relazioni/Relazione_NdV_2024_31_OTTOBRE.pdf)
- [Linee guida di comunicazione per soggetti esterni](https://www.polimi.it/fileadmin/user_upload/Il-Politecnico/brand/Linee_Guida_Comunicazione_ESTERNI_08-07-2025.pdf)
- [Bando DSU 2026/27](https://www.polimi.it/fileadmin/user_upload/studenti/tasse-borse-agevolazioni-economiche/dsu/bando_2026-2027/Bando_Benefici_DSU_2026-2027.pdf)

**Enti, concorrenti e dati**

- [LinguaViva, test OFA](https://www.linguaviva.net/it/iscrizione-test-30/)
- [Language Academy](https://www.language-academy.it/politecnico/)
- [British Institutes](https://www.britishinstitutes.it/politecnico/)
- [Unitest, TENG Polimi](https://www.unitest.app/test/teng-polimi/)
- [Supermat, OFA Polimi](https://supermat.it/test-ingegneria/ofa-polimi/)
- [USTAT, Politecnico di Milano](https://ustat.mur.gov.it/dati/didattica/italia/atenei-statali/milano-politecnico)
- [CISIA, dati TOLC 2025](https://www.cisiaonline.it/report-e-statistiche/analisi-TOLC-2025/dati-TOLC-2025)
- [PoliTo, IELTS](https://www.polito.it/en/education/services-and-life-at-politecnico/polito-language-centre-cla/english/to-know-before-registering-for-the-ielts-test)
- [Bicocca, idoneità linguistica](https://www.unimib.it/studiare/opportunita-studio/lingue-unimib/idoneita-ateneo-e-accertamento-linguistico)
- Analisi aggregata delle graduatorie 2021-2026 e sondaggio di Gestionale: `polimi_rankings_analisi/` e chat nel repository.

**Benchmark**

- [RevenueCat, State of Subscription Apps](https://www.revenuecat.com/state-of-subscription-apps)
- [Lenny Rachitsky, conversione freemium](https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion)
- [Andrew Chen, viral loops](https://andrewchen.substack.com/p/braindump-on-viral-loops)
- [Superads, costi Meta in Italia](https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/italy)
- [Flippa, multipli 2025](https://flippa.com/blog/2025-online-business-ma-insights-from-flippa/)
- [Acquire.com, multipli gennaio 2026](https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/)
- [Testbusters acquisisce TopSquad](https://bebeez.it/club-deal/il-gruppo-edtech-testbusters-acquisisce-anche-topsquad-raggiunti-i-10-mln-euro-di-ricavi-nel-2024/)
- [Stripe, prezzi Italia](https://stripe.com/it/pricing)
- [Cloudflare Workers, prezzi](https://developers.cloudflare.com/workers/platform/pricing/)

**Fisco e leggi**

- [Legge 190/2014, regime forfettario](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2014-12-23;190~art1!vig=2026-10-09)
- [INPS, circolare 14/2026 (Commercianti)](https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/02/Circolare_15162/Allegati/16561_Circolare-numero-14-del-09-02-2026.pdf)
- [INPS, circolare 8/2026 (Gestione Separata)](https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/02/Circolare_15153/Allegati/16573_Circolare-numero-8-del-03-02-2026.pdf)
- [ISTAT, ATECO 2025](https://www.istat.it/it/archivio/ateco-2025)
- [Fiscal Focus, ATECO e coefficienti](https://www.fiscal-focus.it/quotidiano/il-quotidiano/articoli-fisco/forfettari-il-nuovo-codice-ateco-non-decide-il-coefficiente-di-redditivita,3,186313)
- [Fiscozen, vendere online](https://www.fiscozen.it/guide/cosa-si-deve-fare-per-vendere-on-line/)
- [Fiscozen, diritti d'autore senza partita IVA](https://www.fiscozen.it/guide/cessione-diritti-dautore-senza-partita-iva/)
- [Agenzia delle Entrate, familiari a carico](https://infoprecompilata.agenziaentrate.gov.it/portale/familiari-a-carico1)
- [Codice del Consumo, art. 54-bis (funzione di recesso)](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-09-06;206~art54bis!vig=2026-10-09)
- [AGCM, caso eDreams](https://www.agcm.it/media/comunicati-stampa/2026/2/PS12853)
- [IAP, Digital Chart](https://www.iap.it/codice-e-altre-fonti/regolamenti-autodisciplinari/regolamento-digital-chart/)
- [Garante privacy, registro dei trattamenti](https://www.garanteprivacy.it/home/faq/registro-delle-attivita-di-trattamento)
- [Apple, App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Apple, Small Business Program](https://developer.apple.com/app-store/small-business-program/)
