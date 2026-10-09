# Benchmark per il business plan: app di preparazione a un test universitario di inglese (Italia)

Ricerca svolta il 9 ottobre 2026. Ogni numero ha accanto la fonte (sezione "Fonti" in fondo, con i riferimenti [n]).

Legenda dell'affidabilità:
- **M** = numero misurato e pubblicato dalla fonte (dati di piattaforma, bilanci, listini ufficiali).
- **D** = dichiarazione dell'azienda o del venditore, senza metodo pubblicato.
- **C** = calcolo mio a partire da numeri misurati (la formula è indicata).
- **S** = stima o ipotesi mia, da sostituire con dati propri appena possibile.
- "(snippet)" = numero letto solo nell'estratto del motore di ricerca, perché la pagina era bloccata o a pagamento. Va verificato prima di citarlo.

Il caso: mercato di ~1.500-2.500 potenziali clienti l'anno in un ateneo, picchi stagionali, freemium con acquisto una tantum da 10-20 €. Quasi tutti i benchmark sotto vengono da app in abbonamento con milioni di download, quindi vanno ridimensionati (vedi "Applicabilità" in ogni sezione).

---

## 1. Conversione freemium → pagante

### 1.1 RevenueCat, State of Subscription Apps 2026 (dati 2025, oltre 115.000 app) [1][2]

| Metrica | Valore | Tipo |
|---|---|---|
| Download → pagante entro 35 giorni, mediana di tutte le app | 2,0% | M |
| Stessa metrica, app con **hard paywall** (mediana / quartile alto / top 10%) | 10,7% / >20% / 38,7% | M |
| Stessa metrica, app **freemium** (mediana / quartile alto) | 2,1% / >4,5% | M |
| Stessa metrica, Europa occidentale (mediana) | 2,0% | M |
| Prova gratuita → pagante, Europa occidentale (mediana) | 29,7% | M |
| Prova → pagante per durata della prova: ≤4 giorni / 5-9 giorni / 17-32 giorni | 25,5% / 37,4% / 42,5% | M |
| **Education**: download → prova entro 30 giorni (mediana) | 6,5% | M |
| **Education**: prezzo mediano mensile / annuale | 9,99 $ / 44,99 $ (l'annuale più alto fra le categorie) | M |
| **Education**: ricavo per installazione a 14 giorni (RPI D14, mediana) | 0,30 $ | M |
| **Education**: ricavo per pagante nel primo anno (RLTV, mediana) | 22,82 $ | M |
| **Education**: quota di conversioni a pagamento avvenute nel giorno 0 | 28,5% (la più bassa fra le categorie: in Education si compra più tardi) | M |
| **Education**: prove avviate nel giorno 0 | 78,5% (la più bassa) | M |
| App con piano "lifetime" prevalente: RPI a 14 / 60 giorni | 0,19 $ / 0,24 $ | M |
| Peso dei piani lifetime o una tantum nel mix venduto | 4-18% secondo la categoria; sotto il 5% in tutte le aree geografiche | M |
| Prezzo mediano settimanale / annuale (tutte le categorie) | 5,99 $ / 34,80 $ | M |

Il report non pubblica né la conversione download → pagante né la conversione prova → pagante specifiche di Education: dice solo che Education è fra le categorie con più distanza fra il quartile alto e il top 10%.

### 1.2 Altre fonti

| Fonte | Numero | Tipo |
|---|---|---|
| Lenny Rachitsky e Kyle Poyar (1 agosto 2023) [3]: freemium self-serve, conversione da gratuito a pagante | buona 3-5%, ottima 6-8% | D (sondaggio fra aziende, B2B SaaS) |
| Stessa fonte: prodotti con prova gratuita | buona 8-12%, ottima 15-25% | D |
| SaaStr (Jason Lemkin) [4] | ~1,7% conversione media da gratuito a pagante sulle app mobile gestite da RevenueCat; Dropbox ~2,5% (15 M+ paganti su ~600 M registrati); lavora con l'ipotesi del 2% | D / C |
| Duolingo, lettera agli azionisti del Q2 2026 [5] | DAU 58,7 M; MAU 140,6 M; abbonati paganti 12,7 M; ricavi 298,5 M$ | M |
| Duolingo: paganti / MAU | ~9,0% (12,7 / 140,6) | C |
| Duolingo: DAU / MAU | ~41,7% (58,7 / 140,6) | C |
| Adapty, State of In-App Subscriptions 2026 (pagina pubblica) [6] | installazione → prova 10,9%; prova → pagante 25,6% (medie globali); piani settimanali = 55,5% dei ricavi delle app | M |
| Unbounce Conversion Benchmark Report 2024 (41.000+ landing page) [7][8] | mediana di tutti i settori 6,6%; **Education 8,4%**; per canale in Education: email 14,1%, ricerca a pagamento 7,3%, social a pagamento 5,1% | M (la conversione misurata è di solito un'iscrizione o un contatto, non un acquisto) |
| Waitlist → acquisto (Venture Curator, aprile 2025) [9] | "la maggior parte delle waitlist converte al 2-3%"; accesso entro un mese ≈ 50%, attese oltre 90 giorni < 20% (grafico attribuito a Lenny's Newsletter) | D (fonte primaria non verificabile) |

### Applicabilità al caso
- Per un'app freemium il riferimento più solido è **2,1% di mediana e 4,5% per il quartile alto** (RevenueCat), coerente con il 3-5% "buono" di Lenny. Il 10,7% vale per l'hard paywall, cioè senza contenuto gratuito utile.
- Su un test con data fissa e un problema sentito (l'OFA blocca la carriera), l'intenzione d'acquisto è più alta della media delle app. È plausibile superare il 2% fra gli **utenti attivi** (S), ma la base è piccola: con 1.500-2.500 persone l'anno, uno scarto di 2 punti percentuali vale poche decine di vendite.
- I prodotti una tantum rendono meno per installazione degli abbonamenti (RPI D14 0,19 $ contro 0,30 $ di Education), però per un test da superare una volta sola sono più onesti e rischiano meno rimborsi e contestazioni.
- I tassi di Unbounce misurano iscrizioni, non acquisti: usarli per la tappa visita → registrazione, non per quella registrazione → pagamento.

---

## 2. Programmi referral, coefficiente virale, ambassador

| Fonte | Numero | Tipo |
|---|---|---|
| Dropbox, slide "Startup Lessons Learned" di Drew Houston (aprile 2010) [10] | il referral con premio per entrambi ha aumentato le iscrizioni del **60% in modo permanente**; **2,8 M di inviti diretti** in 30 giorni (aprile 2010); il referral = **35% delle iscrizioni giornaliere**, le cartelle condivise e altre funzioni virali un altro 20% | M (dato dell'azienda) |
| Andrew Chen, "Braindump on viral loops" (5 novembre 2025) [11] | fattori virali tipici "0,2 o 0,3 o meno"; 1,5 "raramente visto"; sotto 0,5 "quasi non vale la pena" | D (esperto, non un dataset) |
| Stessa fonte, moltiplicatore sulla crescita | K = 0,1 → ×1,11; 0,25 → ×1,33; 0,5 → ×2; 0,75 → ×4; 0,9 → ×10 | C (formula 1/(1-K)) |
| Stessa fonte, funnel degli inviti email | 10-15% aperti, ~5% cliccati | D |
| Stessa fonte, Uber | 10-20% delle prime corse da referral | D |
| Schmitt, Skiera e Van den Bulte (NIM Marketing Intelligence Review, 2013; banca tedesca, ~10.000 conti) [12] | i clienti arrivati da referral sono **~25% più redditizi** e più fedeli in 33 mesi; un premio da 25 € ha reso ~60% di ROI in 6 anni; effetto più forte fra i giovani | M (studio accademico) |
| Insert Affiliate (fornitore di software, 22 maggio 2026) [13] | un campus ambassador "converte 20-50 utenti a semestre" | D (nessuna fonte o metodo) |
| Sondaggio Medium su ~200 studenti (articolo di circa 10 anni fa) | 21% ha scaricato un'app grazie a un ambassador; 7% la usa ancora | (snippet: pagina bloccata, 403) |
| Coursera for Campus (Manipal) [snippet] | 99 ambassador selezionati; nessun dato per ambassador | (snippet) |

**Non trovato:** un benchmark indipendente sulla **quota di utenti che invita** e sulla **conversione degli invitati** nelle app consumer. Le percentuali che circolano (per esempio "il 30% del database porta 2 contatti") sono ipotesi dei fornitori di software. Non ho trovato nemmeno risultati misurati di programmi ambassador universitari, cioè iscritti o vendite per ambassador con un metodo dichiarato.

### Applicabilità al caso
- Con un mercato chiuso (un ateneo, una coorte l'anno) il passaparola si satura in fretta: per un business plan prudente conviene assumere **K = 0,2-0,3**, cioè +25-43% di utenti "gratis" (S basata su [11]), non K ≥ 1.
- Il modello Dropbox (premio per entrambi, legato al prodotto) si adatta bene: per esempio sbloccare simulazioni extra invece di dare sconti in denaro.
- Ambassador: in assenza di dati misurati, conviene un pilota con codici tracciati (2-3 studenti, compenso a vendita) e misurare i costi per acquisto.

---

## 3. Costi di acquisizione (Italia)

### 3.1 Meta (Facebook e Instagram)

| Fonte | CPM | CPC | Tipo |
|---|---|---|---|
| Superads, Italia, mediane di "tutti i settori" (luglio 2025 → luglio 2026; >3 mld $ di spesa sulla piattaforma) [14][15] | media **~10,50 €**; minimo 7,05 € (aprile 2026); massimo 15,54 € (ottobre 2025); settembre-ottobre 2025 ~15,4-15,5 € | media **~0,50** (valuta non dichiarata; probabilmente €); da 0,37 (luglio 2025) a 0,59 (novembre 2025) | M (campione della piattaforma) |
| Superads, Italia rispetto alla media globale | CPM -49%; CPC -52% | | M |
| Stackmatix (6 settembre 2026) [16] | Facebook Italia **5,40-9,20 $** | n.d. | D (nessun metodo) |
| Stackmatix, regola generale | CPM di Instagram +15-25% rispetto a Facebook nello stesso mercato | | D |

Il CPM italiano sale nei mesi di settembre, ottobre e novembre, cioè proprio quando cade il picco delle immatricolazioni e degli OFA.

**Non trovati:** CPM o CPC per la fascia **18-24 anni** in Italia; **TikTok** Italia (esistono solo stime USA e globali di 3-20 $ di CPM, non applicabili); **CPI** (costo per installazione) per l'Italia. Per questi numeri l'unica fonte affidabile è lo strumento di pianificazione di Meta o TikTok Ads Manager, impostando il pubblico reale (per esempio 18-20 anni, Milano, interessi universitari).

### 3.2 Volantini e QR

| Fonte | Numero | Tipo |
|---|---|---|
| PressUP (listino, ottobre 2026) [17] | volantini **A6, 1.000 copie: da 49 € + IVA**; A5, 5.000 copie: da 149 € + IVA; spedizione gratuita in Italia; carta consigliata patinata da 130 g | M (listino) |
| Stampafast A6, 1.000 copie, patinata 130 g, solo fronte | 23 € + IVA | (snippet: pagina bloccata, 403) |
| Nellymoser, "Scan Response Rates in National Magazines" (dati 2012) [18] | tasso medio di scansione dei codici nelle riviste **6,4%**; mediana 4,5-5,9%; posta diretta 4,4% (dato DMA) | M (vecchio, riviste e non volantini) |
| SlopeFillers, campagna di volantini in una stazione sciistica (aprile 2011) [19] | ~1.000 volantini; fra chi ha risposto, il 37,7% ha usato il QR e il 62,3% ha digitato l'URL breve | M (caso singolo e vecchio) |

**Non trovato:** un tasso di scansione per volantini distribuiti a mano, misurato in modo indipendente. I "1-5% per i supporti passivi" che circolano vengono da blog di fornitori di QR senza metodo.

### Applicabilità al caso
- Ordini di grandezza: **1.000 impressioni Meta ≈ 7-15 €; 1.000 volantini A6 ≈ 25-60 € + IVA** (M). Il volantino costa di più per contatto, ma se lo dai a mano davanti a un'aula dell'ateneo raggiunge esattamente il target, mentre un'impressione Meta no.
- Simulazione prudente (S): CPC 0,50 € e conversione landing → registrazione del 5% (social a pagamento in Education [8]) danno ~10 € per registrato; con conversione registrato → acquisto del 3-5% si arriva a **200-330 € per vendita**. Con un prezzo di 10-20 € l'advertising a pagamento **non sta in piedi**: per un prodotto da 15 € l'acquisizione deve essere quasi tutta organica (passaparola, gruppi WhatsApp e Telegram dei corsi, rappresentanti degli studenti, volantini mirati).
- QR: per il business plan conviene assumere l'1-2% di scansioni sui volantini distribuiti (S), stampare un QR diverso per ogni luogo di distribuzione e misurare.

---

## 4. Abbonamenti settimanali, prove gratuite, rimborsi e contestazioni

| Fonte | Numero | Tipo |
|---|---|---|
| RevenueCat 2026 [2] | quota delle cancellazioni di prova avvenute nel giorno 0: **55,4%** (prova di 3 giorni), 39,8% (7 giorni), 35,7% (14 giorni), 31,1% (30 giorni); l'84% delle cancellazioni delle prove da 3 giorni avviene fra il giorno 0 e il giorno 1 | M |
| RevenueCat, "one-year retention" (aggiornato a giugno 2024) [20] | abbonati ancora attivi dopo 1 anno (mediana; quartili): **settimanale 3% (1-4%)**, **mensile 11% (5-19%)**, **annuale 28% (17-43%)** | M |
| RevenueCat 2026, parte 2, riportato da 9to5Mac (27 maggio 2026) [21] | il 95% degli abbonati annuali che cancellano non torna; riattivazione annuale 5%; il mese 1 pesa il 35% delle cancellazioni annuali; **Education ha le cancellazioni nel primo mese più basse fra i piani annuali (30%)**; prima rinnovazione annuale mediana 23-40% | M (riportato da terzi) |
| Stessa fonte | "i piani annuali rinnovano all'83,4%" | dato incoerente con il 23-40% della stessa fonte: non usarlo senza leggere il report |
| Adapty 2026 [6] | retention al giorno 380: annuale con prova 19,9%, mensile 14,2%, settimanale 5,5% | M |
| Stripe, programmi di monitoraggio delle contestazioni [22] | **Visa VAMP**: "non conforme" da 0,5% (e almeno 5 casi); "eccessivo" da 1,5% in UE. **Mastercard ECM**: 1,5-2,99% con 100-299 chargeback | M (soglie ufficiali) |
| Stripe Italia, listino [23] | commissione su carte SEE standard **1,5% + 0,25 €** (premium 2,8% + 0,25 €); **20 € per ogni contestazione ricevuta** | M |
| Apple Small Business Program [24] | commissione **15%** sotto 1 M$ di proventi; 10% con i termini alternativi UE e sugli abbonamenti dopo il primo anno | M |
| Your Europe (Commissione UE) [25] | recesso di 14 giorni; per i contenuti digitali il diritto si perde all'inizio dell'accesso solo con **consenso esplicito e rinuncia** del cliente, da riportare nella conferma del contratto | M (norma) |

**Non trovato:** un tasso medio di rimborso affidabile per prodotti digitali o in-app. Gli unici numeri sono aneddoti: 1-2% sulle vendite App Store in un thread del forum sviluppatori Apple (snippet); ~7% per un autore Kindle nel 2014 (snippet); mediana del 9,5% per i giochi su Steam (snippet, altro mercato). I report RevenueCat 2024 e 2026 non riportano un tasso di rimborso nelle parti pubbliche.

### Applicabilità al caso
- Un abbonamento settimanale per un test che si prepara in poche settimane funziona sui numeri (prezzo mediano 5,99 $), ma ha la retention peggiore (3% a 1 anno) ed è il formato che genera più contestazioni e reputazione da "trappola". Per un acquisto una tantum da 10-20 € il problema non si pone.
- Sul web con Stripe, su 15 € la commissione è ~0,48 € (3,2%). Una sola contestazione (20 €) cancella il margine di più di una vendita: servono un descrittore chiaro sull'estratto conto, una ricevuta email e un rimborso facile.
- Per il business plan conviene assumere **rimborsi al 2-5%** (S, nessun benchmark solido). Il checkbox di rinuncia al recesso (norma UE) va inserito comunque.

---

## 5. Costi tecnici attuali (pagine ufficiali, ottobre 2026)

### 5.1 Cloudflare [26][27]

| Servizio | Free | Paid (minimo 5 $/mese per account) |
|---|---|---|
| Workers: richieste | 100.000 al giorno | 10 M al mese inclusi, poi 0,30 $ per milione |
| Workers: CPU | 10 ms per invocazione | 30 M ms di CPU al mese inclusi, poi 0,02 $ per milione |
| D1: righe lette | 5 M al giorno | 25 mld al mese, poi 0,001 $ per milione |
| D1: righe scritte | 100.000 al giorno | 50 M al mese, poi 1,00 $ per milione |
| D1: storage | 5 GB totali | 5 GB inclusi, poi 0,75 $ per GB al mese (massimo 10 GB per database) |
| KV | 100.000 letture al giorno, 1.000 scritture al giorno, 1 GB | 10 M letture e 1 M scritture al mese, 1 GB |
| Pages (piano free) | 500 build al mese, 1 build alla volta, 20.000 file, 25 MiB per file, 100 domini custom per progetto | le Pages Functions sono fatturate come Workers |
| Egress e banda | nessun costo | nessun costo |

Sul piano free i limiti si azzerano ogni giorno alle 00:00 UTC; superati, le operazioni falliscono con un errore invece di essere addebitate.

### 5.2 Autenticazione ed email

| Servizio | Gratuito | Oltre | Fonte |
|---|---|---|---|
| Firebase Authentication | **50.000 MAU** gratis (Spark e Blaze) | Identity Platform: 0,0055 $ per MAU fra 50k e 100k | [28][29] |
| Firebase: limiti email al giorno (Spark / Blaze) | verifica dell'indirizzo 1.000 / 100.000; reset password 150 / 10.000; **accesso con link email: solo 5 al giorno** / 25.000 | | [30] |
| Firebase: SMS | solo sul piano Blaze; **Italia 0,05 $ per SMS**; i primi 10 SMS al giorno non sono addebitati (Identity Platform); limite 3.000 SMS al giorno senza Identity Platform | | [29][30] |
| Resend | **3.000 email al mese, massimo 100 al giorno**, 3 domini | Pro 20 $/mese per 50.000 email | [31] |
| Brevo | **300 email al giorno** (piano Free) | Starter "da 5.000 email al mese" (prezzo caricato via script, non leggibile) | [32] |

Nota pratica: sul piano gratuito di Firebase, 5 email di accesso con link al giorno sono troppo poche per un login senza password. Conviene un OTP via email gestito in proprio (Worker + Resend o Brevo) oppure il passaggio al piano Blaze.

### 5.3 Dominio .it

| Fonte | Prezzo | Tipo |
|---|---|---|
| Aruba, listino domini [33] | **11,99 € + IVA all'anno** per il gruppo .it/.eu/.es/… | M |
| Register.it [34] | pubblicizza il "dominio .it gratis" il primo anno (fino a 3 domini per utente), con rinnovo automatico a prezzo di listino | M (promozione) |
| Route 53 (AWS) [snippet] | registrazione e rinnovo del .it per 1 anno; serve un indirizzo nell'UE e, per chi risiede in Italia, il codice fiscale | (snippet) |

### 5.4 API di un modello LLM economico (prezzi per milione di token, in USD)

| Modello | Input | Output | Fonte |
|---|---|---|---|
| Claude Haiku 5.5 (prompt sotto i 100k token) | 0,10 | 0,50 | [35] |
| Claude Haiku 4.5 | 1,00 | 5,00 | [35] |
| Gemini 2.5 Flash-Lite | 0,10 | 0,40 | [36] |
| Gemini 3.1 Flash-Lite | 0,25 | 1,50 | [36] |
| Gemini 3.8 Flash | 0,75 fino al 31/12/2026, poi 1,50 | 3,75, poi 7,50 | [36] |
| GPT-5 nano | 0,05 | 0,40 | [37] |
| GPT-5 mini | 0,25 | 2,00 | [37] |
| GPT-4o mini | 0,15 | 0,60 | [37] |

La Batch API di Anthropic dimezza i prezzi (Haiku 5.5: 0,05 $ / 0,25 $). Gemini ha un piano gratuito, ma lì i contenuti possono essere usati da Google per migliorare i prodotti.

**Stima per 1.000 spiegazioni brevi (C/S).** Ipotesi: 600 token di input (domanda, risposta dello studente, istruzioni) e 250 token di output per spiegazione.

| Modello | Costo per 1.000 spiegazioni |
|---|---|
| GPT-5 nano | ~0,13 $ (più gli eventuali token di ragionamento) |
| Gemini 2.5 Flash-Lite | ~0,16 $ |
| Claude Haiku 5.5 | ~0,19 $ |
| GPT-4o mini | ~0,24 $ |
| Gemini 3.1 Flash-Lite | ~0,53 $ |
| GPT-5 mini | ~0,65 $ |
| Claude Haiku 4.5 | ~1,85 $ |

Con le spiegazioni pre-generate una volta per ogni domanda della banca dati (per esempio 2.000 domande), il costo è **una tantum e sotto i 5 $**. Il costo tecnico marginale per utente è praticamente zero: i costi veri sono il tempo, la commissione di pagamento e l'IVA.

---

## 6. Valutazioni per una "exit"

### 6.1 Marketplace

| Fonte | Multiplo | Tipo |
|---|---|---|
| Acquire.com, report semestrale di gennaio 2026 (aggiornato al 1° settembre 2026; SaaS con valore d'impresa sotto 10 M$) [38] | **mediana 3,9× l'utile annuo** sia nel 2024 sia nel 2025; media "nella fascia bassa-media dei 4×"; margini medi 71%; **81 giorni** in media sul mercato; i prezzi richiesti realistici attirano più acquirenti | M (dati di piattaforma; transazioni auto-dichiarate) |
| Acquire.com, report di gennaio 2024 | deal sotto 100k $: 4,11× l'utile; 100k-1 M$: 4,97× | (snippet) |
| Flippa, riepilogo del 2025 (aggiornato al 23 dicembre 2025) [39] | multipli medi dell'utile per tipo: **App 2,4× (quartile alto 5,4×)**; SaaS 2,7× (5,8×); contenuti 2,6×; e-commerce 1,4× | M |
| Stessa fonte, per dimensione del deal | **10k-100k $: 1,8× (quartile alto 3,9×)**; 100k-250k $: 2,1×; 250k-1 M$: 2,3×; >1 M$: 2,9× | M |
| Empire Flippers (articolo del 2021) [40] | da 20× a oltre 80× l'**utile netto mensile** (≈ 1,7-6,7× l'annuo) | D |

**Cosa alza il multiplo** (Empire Flippers [40], Acquire [38]): ricavi ricorrenti; crescita stabile; storico di utili lungo; churn annuo sotto ~30% (self-serve); traffico diversificato, soprattutto SEO; codice documentato e procedure scritte; poca dipendenza dal fondatore; pagamenti trasferibili. **Cosa lo abbassa:** dipendenza da un solo canale; un fondatore indispensabile; sconti pesanti o lifetime deal; ricavi in calo.

### 6.2 Edtech italiane del test prep

| Società | Dati | Fonte e tipo |
|---|---|---|
| **Testbusters** (Testbusters S.r.l. Società Benefit, Milano) | il gruppo dichiara **oltre 10 M€ di ricavi nel 2024**; esercizio chiuso il 30/9/2023 con ricavi >8,7 M€, **EBITDA 3,7 M€**, liquidità netta 3,3 M€; ~25.000 future matricole l'anno; ~1.200 studenti-docenti in 34 città; il fondatore detiene il 79,18% | [41] BeBeez, 5 maggio 2025 (M/D) |
| Testbusters, acquisizioni | **Ammesso / Squezy S.r.l.** (2021, app di preparazione ai test); **UniAdmissions** (UK, 2023); **TopSquad** (2025, test Bocconi, >1.500 studenti l'anno) | [41] |
| Testbusters S.r.l. (sola società), bilanci | fatturato 8,7 M€ (2023), 6,8 M€ (2024, perdita di 187,8 k€), 5,2 M€ (2025, utile 961 k€); il calo riguarda la sola S.r.l., non necessariamente il gruppo | [42] reportaziende (M) |
| **Alpha Test** (Milano, dal 1987) | Aksìa Capital IV acquisisce il 70% nel marzo 2017; **White Bridge Investments II rileva la maggioranza a luglio 2020** (Aksìa reinveste in minoranza); il prezzo non è pubblico | [43] BeBeez, 31 luglio 2020 (M) |
| Alpha Test, acquisizioni successive | Boolean e 700+ Club (2021); ADC (corsi digitali); "gruppo Alpha Test-Sironi > 10 M€ di fatturato" | (snippet) |
| **Skuola.net** (Skuola Network S.r.l., Torino) | fatturato **2,7 M€ (2022), 3,3 M€ (2023), 3,2 M€ (2024)**; utile 2024 12,6 k€ | [44] reportaziende (M) |
| **Studenti.it** | faceva parte del perimetro di Banzai Media che **Mondadori ha comprato nel 2016 per 45 M€ di EV** (41 M€ fissi + 4 M€ di earn-out); il perimetro aveva **24 M€ di ricavi e 4 M€ di EBITDA** nel 2015 → ~11× l'EBITDA, ~1,9× i ricavi (C) | [45] Il Post, 10 maggio 2016 (M); l'inclusione di Studenti.it è (snippet) |
| **Docsity** (Ladybird S.r.l., Torino) | 15,4 M di studenti registrati; acquisizioni di Ebah (Brasile, 2017), Koofers (USA, 2019), Estudar com Você (2020); fatturato non trovato | (snippet: Wikipedia, CB Insights) |
| **UnidTest** (UniD S.r.l., Roma) | fatturato non trovato; listino corsi in sezione 7 | [46] |

### Applicabilità al caso
- Con ricavi di qualche migliaio di euro l'anno e un solo ateneo, la fascia realistica è quella **Flippa 10k-100k $ e oltre: ~1,8× l'utile annuo (quartile alto 3,9×)** (M). Sotto i 100k $ Acquire dice che il valore dipende soprattutto dagli asset: codice, banca dati delle domande, dominio, lista email.
- Il compratore più naturale non è un marketplace ma un operatore del settore. **Testbusters ha comprato un'app di preparazione (Ammesso, 2021) e un network di nicchia legato a un ateneo (TopSquad, 2025).** Una banca dati di domande validate e una base utenti in un ateneo grande sono il tipo di asset che questi gruppi comprano.
- Vendibilità: banca domande di proprietà (non copiata dai materiali dell'ateneo); metriche pulite (cohort, conversioni, tasso di superamento); stack semplice e documentato; più atenei o più test (un solo test di un solo ateneo è rischioso, perché basta un cambio di regolamento).

---

## 7. Marketplace e modelli alternativi nel test prep italiano

| Offerta | Prezzo / modello | Fonte e tipo |
|---|---|---|
| UniD Formazione (UnidTest), corsi in aula a Roma più corso online, per i test del 2027 e 2028 | **da 1.222 € (90 ore, estate) a 5.500 € (biennale 300 ore)** scontati; listino 1.490-6.900 €; corsi del "semestre filtro" di Medicina da 480 € a 3.780 € | [46] M (listino, ottobre 2026) |
| Unitest, TOLC-I online | **Corso completo 55 €** (barrato 99 €): 6 + 4 simulazioni; **Plus 69 €** (barrato 198 €) con l'inglese; demo gratuita | [47] M (listino; data non indicata) |
| TestBuddy (app) | piano gratuito: 3 esercitazioni al giorno e 1 simulazione a settimana; premium a 1, 3, 6 o 12 mesi "da circa 10 €/mese" (snippet); una recensione App Store cita 20 € per il premium; 4,4★ su 667 valutazioni | [48] M per le valutazioni; prezzo (snippet) |
| Testbusters (app di Squezy S.r.l.) | app gratuita con una selezione di simulazioni; simulatore completo e corsi a pagamento sul web (prezzi caricati via script, non letti); nessun acquisto in-app | [49] M |
| thefaculty (SmartCreative S.r.l.) | **gratis per gli studenti**; 4,7★ su 5.900 valutazioni; **patrocinata da atenei** (Bocconi, Sapienza, Bicocca, Pavia…); offre anche corsi di recupero OFA; modello B2C finanziato da brand che pagano per raggiungere la Gen Z, più licenze B2B del software | [50][51] M/D |
| thefaculty, contratto B2B documentato | Università di Torino: affidamento diretto da **4.200 €** per l'uso dell'app nell'orientamento (aprile-giugno 2024) | (snippet: pagina di trasparenza bloccata) |
| Contributo CISIA per il TOLC | **35 € a tentativo** (stesso prezzo per TOLC@UNI e TOLC@CASA), secondo TestBuddy (aggiornato al 9 luglio 2026) | [52] D (fonte commerciale; verificare sul regolamento CISIA) |

### Applicabilità al caso
- La scala dei prezzi conferma l'ipotesi: **corsi in aula 1.000-5.000 €; corsi online e simulatori 35-70 €; app freemium 0 € o ~10 €/mese**. Un acquisto una tantum da 10-20 € sta nella fascia bassa dei simulatori, quindi è credibile come impulso d'acquisto. 20 € non è un prezzo alto rispetto ai 55-69 € dei corsi TOLC online.
- Il concorrente più pericoloso è il gratuito: thefaculty (gratis, finanziata da brand e atenei) e le simulazioni gratuite di Testbusters e di CISIA.
- Modello B2B / B2B2C: c'è almeno un precedente di ateneo che paga direttamente un'app (4.200 € a UniTo, da verificare) e atenei che "patrocinano" uno strumento gratuito. Per un test di inglese di un singolo ateneo, la strada B2B più realistica è proporsi al centro linguistico o al servizio OFA come strumento gratuito per gli studenti, pagato dall'ateneo o da uno sponsor. Per un'entità piccola, l'affidamento diretto sotto soglia è la procedura tipica (dato da verificare con l'ufficio acquisti dell'ateneo).

---

## 8. Stagionalità e retention nel test prep

| Fonte | Numero | Tipo |
|---|---|---|
| RevenueCat 2026 [2] | Education: solo il **28,5% delle conversioni avviene nel giorno 0** (la più bassa); in Europa occidentale il **21,2% delle conversioni arriva dopo la sesta settimana** | M |
| RevenueCat 2026 via 9to5Mac [21] | Education ha le cancellazioni nel primo mese più basse fra i piani annuali (30%) | M |
| RevenueCat [20] | retention a 1 anno: settimanale 3%, mensile 11%, annuale 28% | M |
| Duolingo Q2 2026 [5] | DAU/MAU ~41,7% (C): un riferimento alto, raggiunto da un prodotto di abitudine, non di scadenza | C |
| Superads [14] | il CPM di Meta in Italia tocca il massimo a settembre-ottobre: la stagionalità dell'acquisizione coincide con quella degli OFA | M |

**Non trovato:** dati pubblici sulla **durata media d'uso** di un'app di preparazione a un esame o sul churn dopo la data dell'esame. Mancano anche benchmark di retention D1/D7/D30 per Education da fonti primarie: Business of Apps ha risposto 403, Adjust e AppsFlyer hanno dati a pagamento, e i numeri dei blog si contraddicono fra loro (D30 Education 2-3% contro 8%). Anche le durate tipiche della preparazione (1-3 mesi per GRE e GMAT) vengono da articoli di consigli, non da sondaggi.

### Applicabilità al caso
- Per un test con data fissa il ciclo di vita del cliente è **un picco di alcune settimane per sessione di test, poi zero**. Il LTV coincide con il primo acquisto, quindi l'una tantum è il modello giusto e l'abbonamento perde quasi tutto il suo vantaggio.
- I ricavi saranno concentrati nelle finestre prima di ogni sessione del test e all'inizio di ogni semestre. Nel business plan conviene ragionare per sessione (ricavi = iscritti alla sessione × quota raggiunta × conversione) invece che per mese.
- Da misurare dal primo giorno: giorni fra registrazione ed esame, sessioni per utente, giorno dell'acquisto rispetto alla data del test, tasso di superamento di chi ha usato l'app (è anche la metrica che vende di più).

---

## Riepilogo: cosa non ho trovato (o ho solo come snippet)
- Conversione download → pagante e prova → pagante specifiche di **Education** (RevenueCat le pubblica solo nel PDF a registrazione).
- Tasso medio di **rimborsi** per prodotti digitali o in-app.
- Quota di utenti che **invita** e conversione degli invitati; risultati **misurati** di programmi ambassador universitari.
- CPM, CPC e CPI per **18-24 anni** in Italia; **TikTok Italia**; tasso di scansione dei QR sui **volantini**.
- Durata d'uso e churn delle app di **test prep**.
- Fatturati di **Docsity** e **UniD**; prezzo dell'operazione **Alpha Test** (2020).
- Da verificare sulla fonte primaria (letti solo come snippet): Acquire.com 2024 sotto 100k $ (4,11×); contratto UniTo-thefaculty da 4.200 €; Stampafast 23 €/1.000 A6; prezzo di TestBuddy "da ~10 €/mese"; inclusione di Studenti.it nel deal Banzai.

---

## Fonti (pagine aperte)
1. RevenueCat, State of Subscription Apps 2026 – Education: https://www.revenuecat.com/state-of-subscription-apps-2026-education
2. RevenueCat, State of Subscription Apps 2026 (dati 2025; asset pubblicati a marzo 2026): https://www.revenuecat.com/state-of-subscription-apps
3. Lenny's Newsletter (K. Poyar, L. Rachitsky), "What is a good free-to-paid conversion rate", 1 agosto 2023: https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion
4. SaaStr (J. Lemkin), "You need 50 million users for freemium to actually work": https://www.saastr.com/you-need-50-million-users-for-freemium-to-actually-work
5. Duolingo, lettera agli azionisti del Q2 2026 (8-K SEC): https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm
6. Adapty, State of In-App Subscriptions 2026: https://adapty.io/state-of-in-app-subscriptions/
7. Unbounce, Conversion Benchmark Report 2024: https://unbounce.com/conversion-benchmark-report/
8. Unbounce, Education conversion rate: https://unbounce.com/conversion-benchmark-report/education-conversion-rate/
9. Venture Curator, "What's a good waitlist conversion", 4 aprile 2025: https://www.venturecurator.com/p/whats-a-good-waitlist-conversion
10. Drew Houston, "Dropbox: Startup Lessons Learned" (slide, aprile 2010): https://www.slideshare.net/slideshow/dropbox-startup-lessons-learned-3836587/3836587
11. Andrew Chen, "Braindump on viral loops", 5 novembre 2025: https://andrewchen.substack.com/p/braindump-on-viral-loops
12. Schmitt, Skiera, Van den Bulte, NIM Marketing Intelligence Review 5(1), 2013: https://ideas.repec.org/a/vrs/gfkmir/v5y2013i1p8-11n2.html
13. Insert Affiliate, "Student ambassador vs affiliate programs for education apps", 22 maggio 2026: https://insertaffiliate.com/blog/student-ambassador-vs-affiliate-programs-education-apps/
14. Superads, Facebook Ads CPM Italia: https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/italy
15. Superads, Facebook Ads CPC Italia: https://www.superads.ai/facebook-ads-costs/cpc-cost-per-click/italy
16. Stackmatix, Facebook Ads CPM by country 2026, 6 settembre 2026: https://www.stackmatix.com/blog/facebook-ads-cpm-by-country-2026
17. PressUP, stampa volantini: https://www.pressup.it/stampa-volantini-flyer-online
18. Mobile Marketer / Marketing Dive, studio Nellymoser sui codici nelle riviste: https://www.marketingdive.com/ex/mobilemarketer/cms/news/research/13905.html
19. SlopeFillers, campagna QR, 19 aprile 2011: https://www.slopefillers.com/ski-resort-qr-codes-advertising/
20. RevenueCat, "One-year retention rates insights" (aggiornato al 6 giugno 2024): https://www.revenuecat.com/blog/one-year-retention-rates-insights
21. 9to5Mac, RevenueCat SOSA 2026 parte 2, 27 maggio 2026: https://9to5mac.com/2026/05/27/new-report-shows-annual-app-subscribers-rarely-return-after-they-cancel/
22. Stripe Docs, programmi di monitoraggio delle contestazioni: https://docs.stripe.com/disputes/monitoring-programs
23. Stripe Italia, tariffe: https://stripe.com/it/pricing
24. Apple, App Store Small Business Program: https://developer.apple.com/app-store/small-business-program/
25. Your Europe (UE), commercio elettronico e vendite a distanza: https://europa.eu/youreurope/business/selling-in-eu/selling-goods-services/ecommerce-distance-selling/index_it.htm
26. Cloudflare Workers, pricing (Workers, KV, D1): https://developers.cloudflare.com/workers/platform/pricing/
27. Cloudflare Pages, limiti: https://developers.cloudflare.com/pages/platform/limits/
28. Firebase, pricing: https://firebase.google.com/pricing
29. Google Cloud Identity Platform, pricing (MAU e SMS per paese): https://cloud.google.com/identity-platform/pricing
30. Firebase Authentication, limiti: https://firebase.google.com/docs/auth/limits
31. Resend, pricing: https://resend.com/pricing
32. Brevo, pricing: https://www.brevo.com/pricing/
33. Aruba, listino domini: https://www.aruba.it/listino-domini.aspx
34. Register.it, domini: https://www.register.it/domains/
35. Anthropic, Claude pricing: https://platform.claude.com/docs/en/about-claude/pricing
36. Google, Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
37. OpenAI, API pricing: https://developers.openai.com/api/docs/pricing
38. Acquire.com, Biannual Acquisition Multiples Report (gennaio 2026): https://blog.acquire.com/acquire-com-biannual-acquisition-multiples-report-jan-2026/
39. Flippa, "Online Business M&A Insights: 2025 Recap & 2026 Outlook": https://flippa.com/blog/2025-online-business-ma-insights-from-flippa/
40. Empire Flippers, "How SaaS valuations work" (2021): https://empireflippers.com/saas-company-valuation-multiples-metrics/
41. BeBeez, "Il gruppo EdTech Testbusters acquisisce anche TopSquad…", 5 maggio 2025: https://bebeez.it/club-deal/il-gruppo-edtech-testbusters-acquisisce-anche-topsquad-raggiunti-i-10-mln-euro-di-ricavi-nel-2024/
42. Reportaziende, Testbusters S.r.l. SB: https://www.reportaziende.it/testbusters_srl_mi_08459930965
43. BeBeez, "White Bridge va al controllo della casa editrice Alpha Test", 31 luglio 2020: https://bebeez.it/private-equity/white-bridge-va-al-controllo-della-casa-editrice-alpha-test-aksia-reinveste/
44. Reportaziende, Skuola Network S.r.l.: https://www.reportaziende.it/skuola_network_srl_to_10404470014
45. Il Post, "Mondadori ha acquisito Banzai Media Holding", 10 maggio 2016: https://www.ilpost.it/2016/05/10/mondadori-ha-acquisito-banzai-media-holding/
46. UniD Formazione, corsi per i test di ammissione a Roma: https://www.unidformazione.com/corsi-test-ammissione-roma/
47. Unitest, TOLC-I: https://www.unitest.app/test/tolc-i/
48. App Store, TestBuddy: https://apps.apple.com/it/app/testbuddy/id1601706324
49. App Store, Testbusters: https://apps.apple.com/il/app/testbusters/id6754759157
50. App Store, thefaculty: https://apps.apple.com/it/app/thefaculty/id1444906315
51. Touchpoint News, "Smartcreative: l'edutainment di thefaculty…", 27 gennaio 2022: https://www.touchpoint.news/2022/01/27/smartcreative-ledutainment-di-thefaculty-per-connettere-aziende-e-genz/
52. TestBuddy, "Costo TOLC 2026" (aggiornato al 9 luglio 2026): https://testbuddy.it/blog/test-di-ammissione/quanto-costa-il-tolc-del-cisia-prezzo-2025-pagamen
