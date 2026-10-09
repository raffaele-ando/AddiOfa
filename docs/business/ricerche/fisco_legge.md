# Ricerca: fisco, INPS, consumatori, store e privacy per vendere un'app di preparazione al test di inglese (Italia, ottobre 2026)

Data della ricerca: 9 ottobre 2026. Ho aperto ogni fonte citata (pagina web, PDF o testo vigente su Normattiva). Quando una cosa viene solo dalla mia conoscenza e non l'ho riverificata, lo dico.

Livelli di sicurezza: **ALTA** = fonte primaria aperta e testo chiaro; **MEDIA** = fonte professionale o interpretazione prevalente; **BASSA** = fonti in disaccordo, poco chiare o non verificate.

> Novità strutturale: il **nuovo Testo unico delle imposte sui redditi (D.Lgs. 19 giugno 2026 n. 117, GU 3/7/2026, S.O. 26)** si applica **dal 1° gennaio 2027**. Assorbe il TUIR del 1986 e la L. 190/2014 sul forfettario (nuovo Capo XXI, art. 235, coefficienti in Allegato D). La sostanza dichiarata non cambia: è un riordino. Cambia però la numerazione degli articoli, quindi dal 2027 i riferimenti "art. 12/53/54-octies/67 TUIR" e "L. 190/2014 commi 54-89" vanno riletti sul nuovo testo. Per il 2026 restano validi quelli citati qui. (Fisco Oggi 6/7/2026; Normattiva; sicurezza ALTA.)

---

## A. FISCO

### A1. Si può vendere senza partita IVA? Prestazione occasionale, 5.000 €, Merchant of Record e store

**Risposta breve: no, non in modo continuativo.** Vendere con regolarità l'accesso a una piattaforma tramite un sito, un'app, un checkout o pubblicità è un'attività abituale e organizzata, quindi serve la partita IVA fin dalla prima vendita. Questo vale qualunque sia l'importo.

- **La soglia dei 5.000 € non è fiscale.** È solo la franchigia **contributiva INPS** per il lavoro autonomo occasionale (art. 44 c.2 DL 269/2003; INPS, scheda "I contributi dei lavoratori autonomi occasionali": *"i primi 5.000 euro annui costituiscono una soglia di esenzione"*). Si somma tra tutti i committenti nell'anno solare (circ. INPS 103/2004). Sopra la soglia l'aliquota 2026 per i "rapporti occasionali autonomi" è il **33,72%** (circ. INPS 8/2026), ripartita 1/3 a carico del lavoratore e 2/3 a carico del committente.
  - **Fonti:** INPS; Fiscozen ("la soglia dei 5.000 euro riguarda il lavoro autonomo occasionale di servizi, non la vendita di beni", ago. 2026); Il Commercialista Online ("il limite dei 5.000 euro riguarda solo la contribuzione INPS").
  - **Sicurezza:** ALTA.
- **L'abitualità si giudica dal modo in cui si opera, non dall'importo.** Il riferimento è l'art. 2082 c.c. Gli indizi di impresa sono un sito o canale stabile con catalogo e pagamenti integrati, la promozione continuativa, un marchio. Fiscozen: *"Un sito o un profilo creato per vendere indica organizzazione"*. Anche la prestazione occasionale senza P.IVA (redditi diversi, art. 67 c.1 lett. i/l TUIR) esclude la promozione stabile. Una web app con checkout è quindi, per definizione, un'attività organizzata. **Sicurezza:** ALTA come interpretazione prevalente; non esiste una soglia numerica di legge.
- **Merchant of Record (Paddle, Lemon Squeezy, Gumroad, Stripe Managed Payments) e Apple/Google non tolgono l'obbligo di P.IVA.**
  - Il MoR o lo store diventa il venditore verso il consumatore e gestisce l'IVA estera.
  - Lo sviluppatore italiano però incassa comunque, in modo abituale, proventi da un'attività economica propria: è un'operazione B2B verso il MoR o verso Apple (Apple Distribution International Ltd., Irlanda, che agisce come *commissionaire* per la UE secondo il DPLA, Schedule 1-2).
  - Fiscomania (2024) e Il Commercialista Online indicano P.IVA, Registro imprese e INPS per chi vende app sugli store.
  - **Non ho trovato un interpello dell'Agenzia delle Entrate specifico sugli store.** Alcune guide richiamano per analogia la R.M. 132/E/2004 (impresa commerciale, art. 2195 c.c.).
  - **Sicurezza:** MEDIA-ALTA.
- **Caso diverso (vedi D1):** concedere in licenza il proprio software già creato a una società che lo vende, ricevendo royalties come diritti d'autore.

### A2. Regime forfettario 2026, codici ATECO 2025, coefficienti e INPS

**Regole del forfettario 2026** (L. 190/2014 art. 1, testo vigente su Normattiva al 9/10/2026; sicurezza ALTA):

| Voce | Regola |
|---|---|
| Limite ricavi | **85.000 €** nell'anno precedente (c.54). Se si superano i **100.000 €** si esce subito, con IVA dall'operazione che fa superare il limite (c.71). |
| Imposta sostitutiva | 15%, ridotta al **5% per l'anno di inizio e i 4 successivi** (c.65) se: a) nei 3 anni precedenti non si è svolta attività artistica, professionale o d'impresa; b) la nuova attività non è la mera prosecuzione di un precedente lavoro dipendente o autonomo; c) se si rileva l'attività di un altro, i suoi ricavi non superavano 85.000 €. |
| Base imponibile | Ricavi incassati × coefficiente di redditività. Dal risultato si deducono i contributi previdenziali versati (c.64). |
| Cause di esclusione rilevanti | Controllare un'SRL che svolge un'attività riconducibile alla propria (c.57 lett. d); redditi da lavoro dipendente sopra il limite, che fonti professionali indicano a 35.000 € anche per il 2026 (non riletto sul testo). |
| Ritenute | Il forfettario **non** è sostituto d'imposta (salvo artt. 23-24 DPR 600). Nella dichiarazione deve però indicare il codice fiscale di chi ha ricevuto pagamenti senza ritenuta e i relativi importi (c.69). |

Da verificare con il commercialista: se un'eventuale attività occasionale svolta prima conta come "attività" ai fini del 5%.

**Coefficienti: si usa ancora la tabella ATECO 2007.**
- L'ATECO 2025 è in vigore dal 1/4/2025, ma la tabella dei coefficienti (Allegato 4 L. 190/2014) usa i codici ATECO 2007. **Anche l'Allegato D del nuovo TUIR 2027, che ho letto su Normattiva, è ancora intestato "Codici attività ATECO 2007".**
- Fiscal Focus (7/7/2026): *il nuovo codice ATECO non decide il coefficiente*. Si indica il codice 2025, ma il reddito si calcola, in via transitoria, in base all'inquadramento della stessa attività in ATECO 2007.
- **Sicurezza:** ALTA.

| Gruppo (codici ATECO 2007) | Coefficiente |
|---|---|
| Commercio all'ingrosso e al dettaglio (45; 46.2-46.9; 47.1-47.7; 47.9) | 40% |
| Intermediari del commercio (46.1) | 62% |
| Attività professionali, scientifiche, tecniche, sanitarie, istruzione, finanza (64-66, 69-75, **85**, 86-88) | **78%** |
| Altre attività economiche, tra cui **58-63** (editoria, software, informazione) | **67%** |

**Codici ATECO 2025 pertinenti.** Li ho verificati sul file ufficiale ISTAT "Struttura ATECO 2025" e sulle "Note esplicative" (xlsx). Sicurezza ALTA sui codici; MEDIA sulla scelta del codice.

| Codice 2025 | Titolo ufficiale | Note ISTAT rilevanti | Coefficiente |
|---|---|---|---|
| **58.29.00** | Edizione di altri software | Il 62.10 esclude espressamente "edizione di software on demand, software e applicazioni basati su cloud → 58.2" e "sviluppo di software connesso all'edizione → 58.2". **È il codice più coerente per chi sviluppa e vende la propria app o web app.** | 67% |
| **62.10.00** | Attività di programmazione informatica | "Sviluppo di software non connesso all'edizione" (ex 62.01.00). È il codice di chi sviluppa per conto di altri. | 67% |
| 60.39.00 | Altre attività di distribuzione di contenuti | "Fornitura online di software, non connessa all'edizione"; e-book in streaming o download non connessi all'edizione. | 67% (div. 58-63) |
| **85.59.20** | Corsi di formazione e corsi di aggiornamento professionale | Include "professional examination review courses" (corsi di preparazione agli esami). Adatto ai **corsi live su Zoom**. | 78% |
| 85.59.10 | Corsi di lingua straniera | Possibile per un corso di inglese. | 78% |
| 85.59.99 | Tutti gli altri servizi vari di istruzione e formazione n.c.a. | Include "academic tutoring". | 78% |
| 85.69.09 | Altri servizi vari di supporto all'istruzione e formazione n.c.a. | Supporto all'istruzione. | 78% |
| ~~47.91.10~~ | Non esiste più in ATECO 2025 | Il 47.91 ora è "intermediazione per il commercio al dettaglio". L'e-commerce è riclassificato in base al prodotto venduto. | (40% in ATECO 2007) |

**Le fonti non sono d'accordo, va chiesto al commercialista.**
- Fiscozen (guida ago. 2026) e Il Commercialista Online suggeriscono ancora il **47.91.10** (e-commerce, coefficiente 40%) per i prodotti digitali automatizzati.
- Il 47.91.10 però riguardava il commercio al dettaglio di *prodotti* via internet ed è stato abolito. Vendere l'accesso a un servizio digitale è una prestazione di servizi, non una vendita di beni.
- **La differenza è grande: 40% contro 67% del ricavo tassato.** Il codice e il coefficiente vanno fissati dal commercialista.
- Il sito fidocommercialista indica la "Gestione Artigiani" per il 62.10: è un'indicazione isolata e non verificata.

**Professionista o impresa? Gestione Separata o Commercianti?** È il punto più costoso. Sicurezza MEDIA: non esiste una norma che lo dica espressamente.
- **Interpretazione prevalente** (Fiscozen ago. 2026, Il Commercialista Online, Fiscomania):
  - **prodotti digitali automatizzati** (accesso a quiz e simulazioni, video on demand, download, piattaforma con carrello) = **ditta individuale commerciale**. Comporta ComUnica, **iscrizione al Registro imprese** e alla **Gestione Commercianti INPS**, e una SCIA al SUAP. La SCIA è indicata per l'e-commerce; non ho verificato se sia dovuta per la vendita di soli servizi digitali.
  - **lezioni live, tutoraggio, correzioni, Q&A** = lavoro autonomo professionale (es. 85.59.20). Comporta solo il modello AA9/12, niente Camera di commercio e **Gestione Separata**.
  - Fiscomania: se si svolgono sia sviluppo su commissione sia vendita sugli store, "solitamente prevale l'attività commerciale".
- **App + corsi live:** possibile attività mista con due codici. Va chiesto al commercialista se l'attività prevalente porta tutto in Gestione Commercianti.

**Contributi INPS 2026**

| | Gestione Commercianti (impresa) | Gestione Separata (professionista) |
|---|---|---|
| Fonte | Circ. INPS **14 del 9/2/2026** (PDF letto) | Circ. INPS **8 del 3/2/2026** (PDF letto) |
| Aliquota | 24% IVS + 0,48% indennizzo = **24,48%** (25,48% oltre 56.224 €) | **26,07%** (25% IVS + 0,72% + 0,35% ISCRO); 24% se già assicurati altrove |
| Minimale di reddito | **18.808 €**: si paga **comunque** un contributo fisso | Nessun pagamento minimo. 18.808 € è solo la soglia per l'accredito di un anno pieno. |
| Contributo fisso annuo | **4.611,64 €** (4.604,20 IVS + 7,44 maternità); artigiani 4.521,36 €; per frazioni d'anno 384,31 €/mese | — |
| Con riduzione forfettari −35% (c.77 L.190) | **≈ 2.997,57 €/anno** (mio calcolo: 4.611,64 × 0,65). Va chiesta all'INPS. Chi apre nel 2026 deve chiederla "con la massima tempestività"; per gli anni successivi il termine è il 28 febbraio. | — |
| Massimale | — | 122.295 € |
| Scadenze del fisso 2026 | 18/5, 20/8, 16-17/11/2026, 16/2/2027 | Con le imposte |

**Esempi** (miei calcoli: forfettario al 5%, coefficiente 67%, senza costi di gestione e commissioni):

| Ricavi annui | Impresa (Gestione Commercianti −35%) | Professionista (Gestione Separata) |
|---|---|---|
| 3.000 € | Contributi ≈ 2.998 €, imposta 0 → **resta quasi nulla** | Contributi ≈ 524 €, imposta ≈ 74 € |
| 10.000 € | Contributi ≈ 2.998 €, imposta ≈ 185 € | Contributi ≈ 1.747 €, imposta ≈ 248 € |

**Conclusione:** con la Gestione Commercianti, sotto i 4.000-6.000 € di ricavi l'attività è in perdita, perché il fisso INPS si paga anche con incassi bassi.

### A3. IVA, OSS, store e fatturazione

- **Forfettario:** non applica IVA sulle vendite in Italia (franchigia). **Sicurezza:** ALTA.
- **Servizi elettronici a consumatori di altri Stati UE:**
  - Sotto **10.000 € annui** complessivi di vendite B2C intra-UE (D.Lgs. 83/2021) il luogo dell'operazione resta l'Italia.
  - **Sopra la soglia** si applica l'IVA del Paese del cliente, che si può versare tramite **OSS**. Bisogna conservare le prove della localizzazione del cliente (Fiscozen, ago. 2026).
  - **Come si combini OSS con il forfettario non l'ho trovato in fonti primarie.** Va chiesto al commercialista.
  - **Sicurezza:** MEDIA.
- **Apple:** nel DPLA (Exhibit B, letto) l'**Italia è nell'elenco dei Paesi in cui Apple riscuote e versa le imposte sulle vendite agli utenti finali**, senza le eccezioni per gli sviluppatori locali che valgono per altri Paesi. Per l'UE Apple agisce come commissionaria tramite Apple Distribution International (Irlanda).
  - Il sviluppatore non versa quindi l'IVA sul prezzo pagato dall'utente.
  - Documenta invece i propri proventi verso un soggetto UE come operazione B2B estera. Nei forum professionali si parla di reverse charge; per un forfettario va chiarito il documento esatto da emettere.
  - **Sicurezza:** ALTA per Apple che riscuote l'IVA; MEDIA per la documentazione dei proventi.
- **Google Play, Paddle, Lemon Squeezy, Gumroad, Stripe Managed Payments:** sono MoR e dichiarano di riscuotere e versare l'IVA (pagine prezzi e documentazione lette). **Sicurezza:** ALTA sulla dichiarazione dei fornitori.
- **Vendita diretta con Stripe** (sei tu il venditore):
  - Per i **servizi elettronici B2C** c'è l'**esonero dalla certificazione dei corrispettivi** (DM 27/10/2015, GU 263/2015). Quindi niente scontrino né invio telematico (DM 10/5/2019).
  - La **fattura** è dovuta solo se il cliente la chiede entro il momento dell'operazione (art. 22 DPR 633/72). Fonte: EC News.
  - Il forfettario è esonerato dalla tenuta dei registri (c.69).
  - Se emette fattura, dal 2024 deve essere **elettronica via SdI**. Questo l'ho visto solo in una pagina Stripe che non ho aperto; per un privato la fattura arriva nella sua area riservata dell'Agenzia delle Entrate.
  - I **corsi live** non sono "servizi elettronici", perché c'è intervento umano: per questi la certificazione va verificata (fattura o corrispettivi telematici).
  - **Sicurezza:** MEDIA.

### A4. Costi reali di gestione (2026)

| Voce | Costo | Fonte e sicurezza |
|---|---|---|
| Fiscozen, forfettario libero professionista | 499 €/anno (o 49,90 €/mese), IVA inclusa, apertura P.IVA inclusa | fiscozen.it/prezzi, ALTA |
| Fiscozen, forfettario artigiani/commercianti (anche e-commerce) | 599 €/anno (o 59,90 €/mese), IVA inclusa | ALTA |
| Fiscozen, extra | Apertura ditta individuale 150 €, PEC 15 €, firma digitale qualificata 40 € | ALTA |
| Flextax | "A partire da 366 € IVA inclusa" (descrizione dell'azienda su Trustpilot; la pagina prezzi non si è caricata) | BASSA |
| Commercialista tradizionale | Non verificato | — |
| Diritto annuale Camera di commercio 2026, ditta individuale | **53 €** in sezione speciale, **120 €** in sezione ordinaria (maggiorazione 20% inclusa, DM MIMIT 17/3/2026) | CCIAA Bologna, ALTA. Per Milano non sono riuscito a leggere la pagina: da verificare. |
| PEC | Obbligatoria per le imprese; 15 € con Fiscozen | MEDIA |
| Apple Developer Program | 99 USD/anno (in valuta locale dove disponibile) | ALTA |
| Google Play | 25 USD una tantum | ALTA |
| INPS | Vedi A2: ≈ 3.000 €/anno come impresa forfettaria; percentuale come professionista | ALTA |

**Totale minimo come impresa forfettaria:** circa **3.700-3.800 €/anno** prima di vendere qualcosa (INPS ≈ 2.998 + commercialista ≈ 600 + Camera di commercio 53-120 + PEC + store). Come professionista restano solo il commercialista (≈ 500 €) e il 26,07% sul reddito.

### A5. Studente a carico, ISEE e borsa DSU (informazioni critiche)

**Limite per restare a carico** (TUIR art. 12 c.2 vigente, Normattiva; istruzioni 730/2026; sicurezza ALTA):
- Figli **fino a 24 anni**: reddito complessivo **≤ 4.000 €** lordo degli oneri deducibili. Oltre i 24 anni il limite è 2.840,51 €.
- Il requisito dell'età vale anche se c'è per una parte dell'anno.
- **Nel limite si conta anche "il reddito d'impresa o di lavoro autonomo assoggettato ad imposta sostitutiva in applicazione del regime forfetario"** (istruzioni 730/2026; pagina "Familiari a carico" dell'Agenzia). Lo conferma l'art. 1 c.75 L. 190/2014: il reddito forfettario conta ogni volta che una norma fa riferimento a requisiti di reddito.
- **Il limite è annuale:** se si supera, il figlio **non è a carico per tutto l'anno**.

**Che cosa perdono i genitori se il figlio non è più a carico:**
- la detrazione per figli a carico, che dal 2025 spetta solo per figli **dai 21 ai 29 anni** (950 € teorici, decrescenti col reddito); sotto i 21 anni c'è l'Assegno Unico;
- soprattutto, **non possono più detrarre le spese sostenute per il figlio**: tasse universitarie (codice 13), spese sanitarie, abbonamento ai trasporti, ecc.
- La detrazione per l'affitto da studente fuori sede è nell'elenco degli oneri del 730, ma non ho verificato se richieda il figlio a carico.

**Si conta il reddito al netto dei contributi?** Le istruzioni parlano di reddito "assoggettato ad imposta sostitutiva", cioè quello dopo la deduzione dei contributi (c.64). È la mia lettura. Il dato esatto (il rigo LM) va confermato dal commercialista o dal CAF. **Sicurezza:** MEDIA.

**Ricavi massimi per restare a carico** (miei calcoli, coefficiente 67%):

| Inquadramento | Se conta il reddito netto dei contributi | Se conta il reddito lordo |
|---|---|---|
| Impresa (contributo fisso ≈ 2.998 €) | ≈ 10.400 € di ricavi | ≈ 5.970 € |
| Professionista in Gestione Separata (67%) | ≈ 8.070 € | ≈ 5.970 € |
| Professionista in Gestione Separata (78%) | ≈ 6.940 € | ≈ 5.130 € |

**ISEE e borsa DSU del Politecnico di Milano:**
- **Soglie 2026/27** (integrazione al bando, PDF letto): **ISEE Università ≤ 26.887,93 €** e **ISPE ≤ 58.452,06 €**. Chi supera anche un solo limite è escluso, qualunque sia il merito. Terza fascia: da 17.925,30 a 26.887,93 €.
- **Il reddito forfettario entra nell'ISEE del nucleo familiare.** Le istruzioni DSU (Min. Lavoro, edizione 2025) dicono che i redditi forfettari si prendono dalla dichiarazione (determinati "secondo le regole del quadro LM"). Se la dichiarazione non c'è, vanno autodichiarati nel quadro FC8.
- **Ritardo di due anni:** l'ISEE usa i redditi del **secondo anno precedente**. Quanto si guadagna nel 2026 pesa sull'ISEE 2028, quindi sulla borsa dell'a.a. 2028/29.
- **Anche i risparmi contano** nel patrimonio (ISP): giacenze e saldi. Per un'impresa individuale si dichiarano il patrimonio netto (contabilità ordinaria) oppure rimanenze e beni ammortizzabili (semplificata). Non è scritto esplicitamente per il forfettario. Per un'attività di software sono di solito importi piccoli.
- **Ordine di grandezza** (mio, con la scala di equivalenza del DPCM 159/2013 che non ho riverificato, 2,46 per 4 persone): +4.000 € di reddito dello studente fanno salire l'ISEE di circa 1.600 €. Il rischio è concreto solo se la famiglia è già vicina alla soglia o a un cambio di fascia, che cambia l'importo della borsa.
- **Studente "indipendente" ai fini DSU** (bando art. 3.3): servono **da almeno due anni** una residenza fuori dalla casa di famiglia con alloggio a titolo oneroso **e** un reddito proprio da **lavoro dipendente o assimilato**. Il reddito da partita IVA **non** basta a diventare indipendente.
- La borsa DSU è esente da IRPEF (bando). Non ho trovato nel bando incompatibilità con l'avere una partita IVA. L'art. 12.1 riguarda solo il cumulo con altre borse.
- **Sicurezza:** ALTA sulle soglie e sulle regole del bando; MEDIA sull'impatto numerico.

### A6. Pagare commissioni agli "ambassador"

**Obblighi di chi paga:**
- **Se chi paga è un forfettario:** non è sostituto d'imposta (c.69 L. 190/2014). Quindi **non applica ritenute**, ma nella dichiarazione dei redditi **deve indicare il codice fiscale di ogni percettore e l'importo pagato**. **Sicurezza:** ALTA.
- **Se chi paga è un'SRL o un altro sostituto d'imposta:**
  - per le **provvigioni di procacciamento d'affari, anche occasionali**, si applica l'art. 25-bis DPR 600/73: ritenuta **23% sul 50%** della provvigione;
  - Fiscozen, nella guida sul procacciatore occasionale (giu. 2026), indica invece il **20%** come prestazione occasionale (art. 25). **Le fonti non sono d'accordo.**
  - Il sostituto versa con F24 entro il 16 del mese successivo, poi rilascia la CU e presenta il modello 770.
  - **Sicurezza:** MEDIA.

**Inquadramento dell'ambassador:**
- **Se occasionale:** redditi diversi, art. 67 TUIR (lett. i, attività commerciale non abituale, oppure lett. l). Riceve una ricevuta non fiscale, con marca da bollo di 2 € sopra 77,47 €.
- **Se abituale** (link sempre attivo, promozione continua): servirebbe una sua P.IVA come procacciatore d'affari.
- **INPS:**
  - sopra i 5.000 € annui scatta la Gestione Separata sulla quota eccedente (Fiscozen);
  - per le provvigioni da procacciatore l'obbligo è discusso: c'è un'opinione contraria, non verificata, in un forum;
  - ENASARCO non è dovuto per i procacciatori occasionali.

**Vincoli da rispettare:**
- **Niente schemi piramidali.** È vietato in ogni caso un sistema in cui si guadagna "principalmente dall'entrata di altri consumatori nel sistema" (Codice del Consumo art. 23 lett. p, lista nera). La commissione va pagata **solo sulle vendite dirette**, senza bonus per il reclutamento e senza quota d'ingresso.
- **Gli ambassador devono dichiarare il rapporto commerciale** quando promuovono il prodotto (vedi C11).

---

## B. STORE E PAGAMENTI

### B7. Apple

| Tema | Regola attuale | Fonte e sicurezza |
|---|---|---|
| Small Business Program | Commissione **15%** per gli sviluppatori fino a 1 milione USD di proventi (anno precedente e anno in corso). Abbonamenti dopo il primo anno: 10%. Si aderisce in App Store Connect dichiarando gli account associati. Vale anche con i termini UE. | developer.apple.com/app-store/small-business-program, ALTA |
| Regola 3.1.1 | Sbloccare contenuti o funzioni (abbonamenti, contenuti premium, versione completa) richiede **l'acquisto in-app (IAP)**. Niente chiavi di licenza o codici. Prova gratuita possibile con un IAP a prezzo 0 chiamato "XX-day Trial". | App Review Guidelines, ALTA |
| Regola 3.1.1(a), Stati Uniti | Sullo storefront USA sono consentiti pulsanti e link verso acquisti esterni. Negli altri Paesi servono gli entitlement. | ALTA |
| Regola 3.1.3(d) | Servizi in tempo reale **1:1** (es. tutoraggio): ammessi pagamenti esterni. I servizi **"one-to-few e one-to-many" in tempo reale devono usare l'IAP**. Corsi live di gruppo venduti dentro l'app = IAP (è una mia interpretazione). | ALTA |
| **Nuovi termini UE dal 1/10/2026** (DPLA aggiornato il 18/8/2026, Attachment 14) | IAP: **26%**, oppure **15%** con SBP. Processore di pagamento alternativo dentro l'app: **20%** / **10%** con SBP. **Link esterno** (out-of-app offer): commissione "store services" **15%** / **10%** con SBP, solo sulle vendite entro **7 giorni** dal tocco sul link. **Core Technology Commission 5%** solo per la distribuzione fuori dall'App Store (marketplace alternativi, web). Initial Acquisition Fee e Store Services Fee **eliminate**. Rendiconto mensile entro 15 giorni. Con pagamenti esterni **le tasse le versi tu**. | developer.apple.com/support/dma-and-apps-in-the-eu e /payment-options-on-the-app-store-in-the-eu, ALTA. Non è chiaro se il 26% includa altre voci: la pagina non lo dice. |
| Regola 4.3 Spam | (a) Non creare più Bundle ID della stessa app. Il testo cita espressamente le versioni per **"universities"**: Apple consiglia **una sola app** con le varianti vendute tramite IAP. (b) Niente app indistinguibili da quelle già diffuse. | ALTA. **Molto rilevante: niente app separate per ogni ateneo o esame.** |
| Regola 4.2 Funzionalità minima | L'app non deve essere un "sito web riconfezionato". | ALTA |
| Regola 5.1.1(v) | Se l'app permette di creare un account, deve permettere anche di **cancellarlo dall'app**. | ALTA |
| Account e nome visibile | Un individuo o un'impresa individuale si iscrive come **Individual** e sull'App Store appare il suo **nome legale**; non sono ammessi alias. Per un nome commerciale serve una **Organization**: persona giuridica, D-U-N-S, sito web e email di dominio. | developer.apple.com/support/enrollment, ALTA |
| Status di "trader" (Digital Services Act) | Chi distribuisce nell'UE deve dichiarare se è un trader. Chi incassa da app a pagamento o IAP lo è di fatto. Per un individuo **indirizzo (o casella postale), telefono ed email vengono pubblicati** sulla pagina dell'app nei 27 Paesi UE. | Pagina DSA di App Store Connect, ALTA |
| Web app / PWA | Nessuna commissione dello store; si vende con Stripe o con un MoR. Un'app su App Store può far accedere a contenuti comprati sul web (regola 3.1.3(b) "multiplatform"), purché siano acquistabili anche tramite IAP. | Ricordo il testo della 3.1.3(b) ma **non l'ho riletto**: BASSA |

### B8. Google Play

- **Quota di registrazione:** **25 USD** una tantum. Servono verifica dell'identità con documento e carta a proprio nome ed età minima 18 anni (support.google.com 6112435). **Sicurezza:** ALTA.
- **Account personali creati dopo il 13/11/2023:** prima della pubblicazione serve un test chiuso con **almeno 12 tester iscritti per 14 giorni consecutivi** (answer 14151465). **Sicurezza:** ALTA.
- **Dati pubblici:** per un account personale è pubblica l'email dello sviluppatore; per un'organizzazione anche il telefono. Secondo un risultato di ricerca (non riaperto), per gli account che vendono può essere mostrato l'indirizzo completo. **Sicurezza:** MEDIA.
- **Commissioni** (answer 112622):
  - Negli altri mercati: **15% sul primo milione USD**, 30% oltre; abbonamenti 15%.
  - **Nello Spazio economico europeo, nel Regno Unito e negli USA dal 30/6/2026:** nuova struttura con commissione di servizio **più il 5% di commissione di fatturazione**. Abbonamenti: 10% + 5%. Altre transazioni: valori diversi per installazioni "nuove" ed "esistenti", con una tariffa ridotta per i link web esterni.
  - **Le versioni italiana e inglese della pagina, lette con estrazione automatica, danno percentuali diverse** per le altre transazioni (20%+5% o 25%+5%; 10%+5% o 20%+5%).
  - **Sicurezza:** BASSA sui numeri esatti; verificarli nella Play Console.
- **Spam e duplicati:**
  - vietate le app che "offrono la stessa esperienza di altre app già su Google Play";
  - se si hanno più app piccole, Google suggerisce di **riunirle in una sola**;
  - vietate le webview di siti altrui senza permesso; un'app solo-webview rischia anche la regola sulla funzionalità minima.
  - Fonte: answer 9899034. **Sicurezza:** ALTA.
- **Verifica dello sviluppatore Android:** aperta a tutti da marzo 2026. È obbligatoria dal 30/9/2026 solo in Brasile, Indonesia, Singapore e Thailandia; **nel resto del mondo nel 2027**. La maggior parte degli sviluppatori Play risulta già verificata (Android Developers Blog). **Sicurezza:** ALTA.

### B9. Commissioni dei pagamenti

| Servizio | Commissione | Su una vendita da 9,99 € (mio calcolo) | MoR (gestisce l'IVA)? | Fonte e sicurezza |
|---|---|---|---|---|
| **Stripe** Italia | Carte standard SEE 1,5% + 0,25 €; carte premium SEE 2,8% + 0,25 €; Regno Unito 2,5% + 0,25 €; internazionali 3,15% + 0,25 € (+2% se c'è conversione). Apple Pay e Google Pay = tariffa della carta. Billing 0,7%; Stripe Tax 0,5%; contestazione 20 € | ≈ 0,40 € (4%) | No | stripe.com/it/pricing, ALTA |
| Stripe Managed Payments | Stripe fa da MoR per SaaS e contenuti digitali; l'Italia è tra i Paesi supportati. Prezzo non pubblicato nella documentazione letta. | — | Sì | docs.stripe.com, MEDIA |
| **Paddle** | 5% + 0,50 USD | ≈ 0,95 € (~9,5%) | Sì | paddle.com/pricing, ALTA |
| Lemon Squeezy | 5% + 0,50 USD, più possibili costi extra fuori dagli USA. Ora "Link, LLC", gruppo Stripe; migrazione verso Managed Payments. | ≈ 0,95 €+ | Sì | lemonsqueezy.com/pricing, ALTA |
| Gumroad | **10% + 0,50 USD**; **30%** sulle vendite che arrivano dal marketplace Discover | ≈ 1,45 € (~15%) | Sì, dal 1/1/2025 | gumroad.com/pricing, ALTA |
| PayPal Italia | 3,40% + 0,35 €; carte senza conto PayPal 1,20% + 0,35 €; nessuna maggiorazione per pagatori SEE; micropagamenti sotto 5 € 5% + 0,10 € (su richiesta) | ≈ 0,69 € (~7%) | No | paypal.com/it, pagina del 7/9/2026, ALTA |
| Satispay Business | Negozi fisici: gratis sotto 10 €, 0,95% sopra. **E-commerce: non indicato** ("condizioni standard"). Fonti secondarie: 1% + 0,20 € oppure 1,5% + 0,20 € sopra 10 €. **Il modulo di iscrizione chiede la P.IVA.** | ? | No | satispay.com, BASSA per l'e-commerce |
| Apple / Google (per confronto) | 15% del prezzo al netto dell'IVA | ≈ 6,96 € netti allo sviluppatore (9,99/1,22 × 0,85) | Sì | — |

**Stripe chiede la partita IVA?** **No, non obbligatoriamente.** La FAQ sulla fatturazione elettronica in Italia dice che chi non ha P.IVA può indicare il **codice fiscale**; il RI/REA può essere richiesto a seconda del tipo di soggetto. Accettare il codice fiscale però **non rende lecita** la vendita abituale senza P.IVA (vedi A1). **Sicurezza:** ALTA.

---

## C. CONSUMATORI E PRIVACY

### C10. Codice del Consumo: recesso, informazioni, rinnovi, dark pattern, sanzioni

- **Recesso:** 14 giorni per i contratti a distanza.
- **Come si perde per i contenuti digitali** (art. 59 c.1 lett. o, vigente): il recesso è escluso per i contenuti digitali non forniti su supporto materiale se l'esecuzione è iniziata e, per i contratti a pagamento, ci sono **tutti e tre** questi elementi:
  1. **consenso espresso preventivo** del consumatore a iniziare durante il periodo di recesso;
  2. **riconoscimento** che così perde il diritto di recesso;
  3. **conferma** del contratto su supporto durevole (art. 50 c.2 o art. 51 c.7).
  - In pratica: due caselle non preselezionate al checkout e un'email di conferma che le ripete. Per i **servizi** (corsi live) vale la lett. a): il recesso si perde solo dopo la **completa prestazione**, iniziata con consenso espresso.
  - **Sicurezza:** ALTA.
- **Pulsante d'ordine:** deve dire soltanto **"ordine con obbligo di pagare"** o una formula equivalente inequivocabile. Subito prima dell'ordine vanno mostrate le informazioni dell'art. 49 c.1 lett. a, e, n-bis, q, r. Se manca, il consumatore non è vincolato (art. 51 c.2). **Sicurezza:** ALTA.
- **Nuova "funzione di recesso" obbligatoria dal 19/6/2026** (art. 54-bis, D.Lgs. 31/12/2025 n. 209, Direttiva UE 2023/2673):
  - riguarda tutti i contratti a distanza conclusi tramite interfaccia online;
  - serve una funzione con la scritta **"recedere dal contratto qui"** (o formula equivalente), ben visibile, sempre disponibile per tutto il periodo di recesso;
  - deve permettere di indicare nome, contratto e mezzo per la conferma, e avere un pulsante **"conferma recesso"**;
  - dopo l'invio, il professionista manda un **avviso di ricevimento su supporto durevole** con data e ora.
  - **Sicurezza:** ALTA.
- **Rinnovo automatico** (art. 65-bis, vigente):
  - nei contratti di servizi **a tempo determinato con rinnovo automatico**, il professionista deve **avvisare 30 giorni prima** della scadenza indicando entro quando si può disdire;
  - l'avviso va per iscritto, SMS o altro mezzo telematico indicato dal consumatore;
  - se manca, il consumatore può **recedere in qualsiasi momento senza spese** fino alla scadenza successiva.
  - Non ho identificato la legge che ha introdotto l'articolo. Come si applichi agli abbonamenti mensili non è chiaro: è prudente un avviso prima di ogni rinnovo, almeno per i piani annuali.
  - **Sicurezza:** ALTA sul testo; MEDIA sull'applicazione al caso mensile.
- **Pratiche sempre vietate (lista nera, art. 23):**
  - **lett. g:** dichiarare falsamente che il prodotto è disponibile solo per un tempo molto limitato, per ottenere una decisione immediata. Copre **countdown finti e falsa urgenza**;
  - **lett. v:** chiamare "gratuito" ciò che comporta costi;
  - **lett. bb-ter e bb-quater:** recensioni (vedi C11);
  - **lett. p:** schemi piramidali.
- **Caso AGCM di riferimento:** **eDreams, PS12853, comunicato del 4/2/2026, sanzione totale 9 milioni €.**
  - **6 milioni €** per la prima pratica: vantaggi presentati in modo ambiguo, **pressione del tempo e scarsità artificiale**, **preselezione del piano più caro**, **addebito immediato dell'abbonamento annuale a chi non aveva diritto alla prova gratuita** senza preavviso adeguato.
  - **3 milioni €** per gli **ostacoli alla disdetta**, qualificati come pratica aggressiva.
  - **Sicurezza:** ALTA. Non ho trovato altri casi AGCM 2025-2026 su app specifiche.
- **Sanzioni AGCM** (art. 27, vigente):
  - pratiche scorrette: **da 5.000 € a 10.000.000 €**, minimo 50.000 € nei casi dell'art. 21 c.3-4;
  - infrazioni diffuse in più Stati UE: fino al **4% del fatturato** (o 2 milioni € se il fatturato non è disponibile);
  - mancato rispetto dei provvedimenti: da 10.000 € a 10.000.000 €.
  - **Sicurezza:** ALTA.
- **Digital Fairness Act (UE):** proposta attesa per il 3° trimestre 2026. Non ne ho trovato la pubblicazione. **Sicurezza:** MEDIA.

### C11. Recensioni false, pubblicità occulta e ambassador

- **Recensioni** (Codice del Consumo, vigente):
  - è vietato dire che le recensioni vengono da clienti reali senza misure ragionevoli per verificarlo (art. 23 lett. bb-ter);
  - è vietato pubblicare o **far pubblicare** recensioni false (art. 23 lett. bb-quater);
  - se si mostrano recensioni bisogna dire **se e come** si verifica che vengano da acquirenti reali (art. 22 c.5-bis).
  - **Sicurezza:** ALTA.
- **Pubblicità occulta:** è vietato promuovere un prodotto con contenuti apparentemente redazionali pagati dal professionista senza che sia chiaro (art. 23 lett. m). Non palesare l'intento commerciale è anche un'omissione ingannevole (art. 22).
- **AGCOM, delibera 197/25/CONS** (Linee guida e Codice di condotta, approvati il 23/7/2025):
  - si applica solo agli **"influencer rilevanti"**: almeno 500.000 follower o 1 milione di visualizzazioni medie mensili;
  - per loro: registro AGCOM, dicitura "in elenco AGCOM", etichetta "Pubblicità/ADV" tra i primi tre hashtag.
  - Gli ambassador studenti di norma **non** rientrano in questa delibera, ma restano soggetti al Codice del Consumo e all'autodisciplina IAP.
- **IAP, Regolamento Digital Chart:**
  - con un compenso in denaro, beni o servizi serve la dicitura "pubblicità", "advertising", "promosso da… [brand]" o "adv + brand" **come prima informazione o tra i primi tre hashtag**, in sovrimpressione nei video e nelle stories;
  - con codice sconto o link di affiliazione serve anche **"link affiliato + brand"**.
- **Conclusione per gli ambassador:** ogni amico pagato a commissione **deve dichiarare** il legame. Il venditore deve imporlo per contratto, dare il testo pronto e controllare. La responsabilità verso AGCM ricade anche sul professionista. Vietato chiedere ad amici recensioni sugli store o sul sito senza indicarlo.

### C12. Garanzia "rimborsato se non passi"

- **È lecita:** è una promessa commerciale volontaria. Non esiste un diritto legale al "soddisfatti o rimborsati".
- **Va rispettata alla lettera e presentata in modo trasparente.** Se le condizioni sono nascoste o non dette, è un'omissione ingannevole (art. 22). Se poi si ostacola il rimborso, è una pratica aggressiva (come la disdetta ostacolata nel caso eDreams).
- **Clausole che rischiano di essere vessatorie e quindi nulle** (artt. 33-36, vigenti):
  - clausole che **escludono o limitano i diritti del consumatore** (art. 33 c.2 lett. b);
  - rimborso **subordinato a condizioni che dipendono solo dalla volontà del venditore** (lett. d), ad esempio "a nostro insindacabile giudizio";
  - possibilità di **cambiare unilateralmente le condizioni senza giustificato motivo** (lett. m);
  - le clausole devono essere chiare e, nel dubbio, si interpretano a favore del consumatore (art. 35).
  - **Sicurezza:** ALTA sulle norme; MEDIA sull'applicazione al caso.
- **Come comunicarla:**
  - condizioni **oggettive e verificabili**: prova dell'esito ufficiale negativo, finestra temporale ragionevole, eventuale uso minimo dichiarato prima dell'acquisto e proporzionato;
  - una pagina dedicata richiamata vicino al prezzo e al pulsante d'acquisto;
  - procedura semplice e tempi di rimborso definiti;
  - **non promettere "superamento garantito"** né tassi di successo non documentati: l'AGCM può chiedere di provarli (art. 27 c.5) e, se la prova manca, i dati si considerano inesatti.
- **Conseguenze pratiche:**
  - per un forfettario, il rimborso riduce gli incassi dell'anno in cui si paga (principio di cassa: lo dico per ragionamento, va verificato);
  - con Apple e Google **i rimborsi li decide lo store**, quindi la garanzia funziona bene solo per le vendite dirette.
  - Non ho trovato provvedimenti AGCM specifici su garanzie di superamento di un esame.

### C13. GDPR: il minimo per una piccola app

- **Età del consenso digitale:** **14 anni** (D.Lgs. 196/2003 art. 2-quinquies, vigente). Sotto i 14 anni serve il consenso di chi esercita la responsabilità genitoriale, e l'informativa deve essere comprensibile per un minore. Per servizi a universitari è un caso marginale. **Sicurezza:** ALTA.
- **Minimizzazione dei dati:**
  - basta l'email, anche non istituzionale;
  - la **matricola** e l'**email istituzionale** vanno chieste solo se servono davvero, ad esempio per uno sconto riservato agli studenti;
  - l'**esito dell'esame** va raccolto solo quando si chiede il rimborso della garanzia, conservato il tempo necessario e poi cancellato.
- **Obblighi minimi:**
  - informativa artt. 13-14;
  - basi giuridiche: contratto per l'account e gli acquisti, consenso per marketing e analytics non tecnici;
  - **registro dei trattamenti:** obbligatorio anche sotto i 250 dipendenti se il trattamento **non è occasionale**, come in un servizio continuativo (FAQ del Garante); esiste un modello semplificato per le PMI;
  - **nomina dei responsabili esterni (art. 28)**: hosting/Firebase, Cloudflare, Stripe/MoR, email; di solito si accettano i loro DPA;
  - procedura per i diritti degli interessati; misure di sicurezza adeguate;
  - **cancellazione dell'account dall'app** (Apple 5.1.1(v)).
  - **Sicurezza:** ALTA.
- **Cookie e analytics** (Linee guida del Garante del 10/6/2021):
  - analytics **senza consenso** solo se assimilabili ai cookie tecnici: **statistiche aggregate**, un solo sito o app, nessuna identificazione del singolo, **IP mascherato almeno nell'ultimo ottetto** se gestiti da terzi, nessun incrocio con altri dati;
  - altrimenti servono banner e **consenso preventivo**;
  - nell'informativa vanno indicati i criteri usati per classificare i cookie.
  - Soluzioni self-hosted o cookieless semplificano molto.
- **Trasferimento dei dati verso gli USA:** l'**EU-US Data Privacy Framework è valido**.
  - Il Tribunale UE ha respinto il ricorso Latombe (T-553/23) il 3/9/2025.
  - L'**appello C-703/25 P è pendente** e non c'è ancora una data per la decisione.
  - Conviene usare fornitori **certificati DPF** e con clausole contrattuali standard come piano B, preferendo regioni UE per i dati (Firebase e Cloudflare permettono di scegliere la località).
  - **Sicurezza:** MEDIA-ALTA, perché la situazione può cambiare con la sentenza d'appello.

### C14. Uso di "Politecnico di Milano" o "Polimi"

- **Non esiste un regolamento autonomo sul marchio.** Ci sono:
  - le **Linee guida di comunicazione per soggetti esterni (8/7/2025)**: il logo si usa solo con approvazione (patrocinio concesso dalla Rettrice, richieste a comunicazione@polimi.it). Nei contratti con i fornitori il Politecnico impone che **"non potrà essere citato a scopi pubblicitari, promozionali e nella documentazione commerciale, né potrà mai essere utilizzato il logo… se non previa autorizzazione"**;
  - il **Brand manual**, in cui **"Polimi" è un segno usato dall'Ateneo stesso** (loghi "Polimi" per la comunicazione rivolta agli studenti).
  - **Sicurezza:** ALTA.
- **Non ho verificato** se "POLIMI" sia registrato come marchio all'EUIPO o all'UIBM. Va controllato su TMview.
- **Rischi:**
  - Codice della proprietà industriale, art. 21: l'uso di un marchio altrui è ammesso solo se **necessario per indicare la destinazione** del prodotto, in modo **conforme alla correttezza professionale** e **senza rischio di confusione** né inganno sulla provenienza;
  - Codice del Consumo, art. 23 lett. d (lista nera): dichiarare falsamente che un prodotto è **approvato o autorizzato** da un organismo pubblico;
  - concorrenza sleale (art. 2598 c.c.);
  - le linee guida di Apple sulla proprietà intellettuale vietano di far pensare a un'approvazione: lo ricordo, ma non ho riletto il testo della regola 5.2.
- **Raccomandazione:**
  - **non** mettere "PoliMi" o "Polimi" nel **nome** dell'app né nell'icona o nel logo, e non usare i colori o lo stile dell'Ateneo;
  - nella descrizione usare formule descrittive, ad esempio *"preparazione al test di inglese richiesto per l'OFA del Politecnico di Milano"*;
  - aggiungere un disclaimer chiaro: *"Prodotto indipendente, non affiliato né approvato dal Politecnico di Milano"*.
  - Se si vuole qualcosa di più, chiedere un'autorizzazione scritta a comunicazione@polimi.it.

---

## D. STRADE ALTERNATIVE

### D1. Licenza del software a una società che lo vende (diritti d'autore)

- **Inquadramento:**
  - i redditi "derivanti dalla utilizzazione economica, da parte dell'autore… di opere dell'ingegno… **se non sono conseguiti nell'esercizio di imprese commerciali**" sono redditi assimilati al lavoro autonomo (TUIR art. 53 c.2 lett. b, vigente);
  - il software è un'opera protetta (L. 633/1941, art. 2 n. 8).
  - **Sicurezza:** ALTA.
- **Deduzione forfettaria** (TUIR **art. 54-octies** c.1, vigente; prima della riforma era l'art. 54 c.8): i proventi sono ridotti del **25%**, oppure del **40% se chi li riceve ha meno di 35 anni**. Si tassa quindi il 60% del lordo. Le istruzioni del 730/2026 lo confermano. **Sicurezza:** ALTA.
- **Ritenuta:** se chi paga è un sostituto d'imposta (es. un'SRL), applica il **20% sulla base ridotta**: per un under 35 è il 12% del lordo (art. 25 DPR 600/73; Fiscozen giu. 2026). **Sicurezza:** ALTA.
- **Partita IVA:** **non serve** se si cede o si concede in licenza un'opera già creata, senza un'attività abituale e organizzata di creazione su commissione (Fiscozen). **Sicurezza:** MEDIA-ALTA.
- **IVA:** le licenze di diritti d'autore concesse dagli autori sono fuori campo IVA (art. 3 c.4 lett. a DPR 633/72; R. 145/E/2007). Si emette una ricevuta, con marca da bollo di 2 € sopra 77,47 €.
  - La norma esclude dal beneficio alcune categorie di opere (nn. 5 e 6 dell'art. 2 della L. 633/41, e le opere usate per pubblicità commerciale). Il software (n. 8) sembra non escluso, ma **una fonte online sostiene il contrario**.
  - **Sicurezza:** MEDIA; chiedere al commercialista.
- **INPS:** in genere **non dovuto**, salvo che i proventi siano collegati a un'attività professionale abituale (Fiscozen ago. 2026, che richiama la L. 335/95 art. 2 c.26). **Sicurezza:** MEDIA.
- **Se poi si apre un forfettario:** i diritti d'autore entrano nel forfettario solo se "correlati" all'attività; altrimenti restano tassati a parte con IRPEF e ritenuta (Il Sole 24 Ore, 4/10/2025, che richiama la circ. 9/E/2019 e l'interpello 517/2019).
- **Limiti e rischi:**
  - **Ruolo attivo dell'autore:** se lo studente aggiorna i contenuti su richiesta, fa assistenza, marketing o gestisce la piattaforma per la società, queste sono **prestazioni di servizi**. Non sono più diritti d'autore e, se abituali, richiedono P.IVA e INPS.
  - Il contratto deve riguardare un **opera già esistente**, specificando diritti, territorio, durata e compenso. Il software sviluppato su commissione è lavoro autonomo, non diritto d'autore.
  - **SRL di un parente:** se lo studente la **controlla**, perde la possibilità di usare il forfettario (c.57 lett. d L. 190/2014).
  - Royalties fuori mercato verso familiari, o una struttura usata solo per evitare i contributi, possono essere contestate come abuso del diritto (art. 10-bis L. 212/2000). Non ho letto il testo di questa norma in questa sessione.
  - È la società a vendere: lei ha gli obblighi di consumo, privacy e store, e l'account sviluppatore è a suo nome.
- **Effetto sul "carico" familiare:** le royalties entrano nel reddito complessivo al 60% (sotto i 35 anni). **Restando sotto i 6.666 € lordi l'anno si resta a carico** (4.000 / 0,60, mio calcolo). Entrano anche nell'ISEE.

### D2. Esonero contributivo per chi apre nel 2025-2026

- **Legge di Bilancio 2025** (L. 207/2024 art. 1 c.186; circ. INPS 83 del 24/4/2025; messaggio 2449 di agosto 2025):
  - **riduzione del 50% della sola aliquota IVS per 36 mesi** dall'inizio dell'attività;
  - per chi **si iscrive per la prima volta** alle gestioni Artigiani o Commercianti **nel corso del 2025**;
  - maternità e quota dello 0,48% restano dovute per intero;
  - **non si somma** con la riduzione del 35% per forfettari né con altre riduzioni di aliquota;
  - rispetto degli aiuti "de minimis"; domanda sul Portale delle Agevolazioni.
  - **Non c'è un limite di età "under 35"** nella pagina INPS.
  - Valore stimato (mio calcolo): ≈ 2.355 €/anno, contro ≈ 2.998 € con la riduzione del 35%.
  - **Sicurezza:** ALTA per chi si è iscritto nel 2025.
- **Iscritti nel 2026:** la circ. INPS 14 del 9/2/2026 descrive la misura ancora come riservata a chi si iscrive "nel corso dell'anno 2025". **Non ho trovato una proroga** per il 2026 nella Legge di Bilancio 2026. Ad oggi quindi **sembra non applicabile** a chi apre nel 2026. **Sicurezza:** MEDIA (assenza di prova); verificare con l'INPS o il commercialista.
- **Altre agevolazioni:** non ho trovato un esonero generale per gli "under 35" autonomi. Le agevolazioni per giovani che conosco riguardano le assunzioni di dipendenti, che qui non servono.

### D3. Limite per restare a carico: quale reddito conta

- **Il limite è il reddito complessivo**, non i ricavi, "al lordo degli oneri deducibili". A questo si aggiungono redditi esclusi dal complessivo, tra cui **il reddito "assoggettato" al regime forfettario** (TUIR art. 12; istruzioni 730/2026; pagina "Familiari a carico" dell'Agenzia). **Sicurezza:** ALTA.
- **Forfettario:** conta il **reddito forfettario** (ricavi × coefficiente), non i ricavi.
  - Secondo la mia lettura conta **dopo** la deduzione dei contributi, perché quello è il reddito "assoggettato" all'imposta sostitutiva.
  - È il punto da far confermare al commercialista, perché sposta la soglia di molto: vedi la tabella in A5.
  - **Sicurezza:** MEDIA.
- **Diritti d'autore:** contano, al netto della deduzione forfettaria (60% del lordo per un under 35).
- **Prestazioni occasionali:** contano come redditi diversi, al netto delle spese.
- **Borsa DSU:** è esente da IRPEF (bando Polimi), quindi non entra nel reddito complessivo. Non ho trovato una regola specifica sul limite "a carico".

---

## Da chiedere al commercialista (lista operativa)

1. **Professionista o impresa:** per una web app o app di quiz venduta online, Gestione Separata (es. 62.10.00 o 85.59.20) o Registro imprese + Gestione Commercianti (58.29.00)? Con i corsi live si può separare l'attività?
2. **Codice ATECO 2025 e corrispondenza ATECO 2007** per il coefficiente: 67% (58/62), 78% (85) o 40% (ex 47.91.10)?
3. Nel limite dei 4.000 € per restare a carico conta il reddito forfettario **netto o lordo dei contributi**? Quanto si può fatturare restando a carico?
4. Come documentare i proventi da Apple, Google, Paddle, Gumroad (fattura elettronica verso soggetto estero, diciture, bollo)? Come gestire OSS e forfettario se le vendite dirette UE superano 10.000 €?
5. Riduzione del 35% INPS: tempi della domanda; esistenza nel 2026 di proroghe della riduzione del 50%.
6. Serve la SCIA per vendere solo servizi digitali? Sezione speciale o ordinaria del Registro imprese (53 € o 120 €)?
7. Ambassador: ritenuta 20% o 23% sul 50%; obblighi di segnalazione nel quadro LM per chi è forfettario.
8. Strada dei diritti d'autore (D1): IVA sul software, rischio di riqualificazione, compatibilità con un futuro forfettario.
9. Il 5% per i primi 5 anni resta possibile se prima si è fatta un'attività occasionale?

---

## Fonti (aperte e lette in questa sessione)

**Normativa vigente (Normattiva, versione al 9/10/2026)**
- L. 190/2014 art. 1 (commi 54, 57, 64, 65, 69, 71, 75, 77): https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:2014-12-23;190~art1!vig=2026-10-09
- TUIR art. 12 (familiari a carico), art. 53, art. 54-octies: https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:1986-12-22;917~art54octies!vig=2026-10-09
- Nuovo TUIR D.Lgs. 117/2026 (indice) e Allegato D, coefficienti con codici ATECO 2007: https://www.normattiva.it/eli/id/2026/07/03/26G00131/ORIGINAL
- Codice del Consumo, artt. 22, 23, 27, 33, 35, 36, 51, 54-bis, 59, 65-bis: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-09-06;206~art54bis!vig=2026-10-09 (e gli altri articoli con lo stesso schema di indirizzo)
- Codice della privacy, art. 2-quinquies: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-06-30;196~art2quinquies!vig=2026-10-09
- Codice della proprietà industriale, art. 21: https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-02-10;30~art21!vig=2026-10-09

**Agenzia delle Entrate, INPS, ISTAT, Ministero, Camere di commercio**
- Istruzioni 730/2026: https://www.agenziaentrate.gov.it/portale/documents/20143/9764684/730_+istruzioni_2026.pdf
- Familiari a carico (precompilata): https://infoprecompilata.agenziaentrate.gov.it/portale/familiari-a-carico1
- Circ. INPS 14/2026 (Artigiani e Commercianti): https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/02/Circolare_15162/Allegati/16561_Circolare-numero-14-del-09-02-2026.pdf
- Circ. INPS 8/2026 (Gestione Separata): https://www.inps.it/content/dam/inps-site/it/scorporati/circolari-e-messaggi/2026/02/Circolare_15153/Allegati/16573_Circolare-numero-8-del-03-02-2026.pdf
- INPS, autonomi occasionali: https://www.inps.it/it/it/dettaglio-approfondimento.schede-informative.49893.i-contributi-dei-lavoratori-autonomi-occasionali.html
- INPS, riduzione 50% nuovi iscritti 2025: https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2025.04.artigiani-e-commercianti-riduzione-contributiva-ai-nuovi-iscritti.html
- INPS, contributi 2026 Artigiani e Commercianti: https://www.inps.it/it/it/inps-comunica/notizie/dettaglio-news-page.news.2026.02.gestioni-artigiani-e-commercianti-i-contributi-per-il-2026.html
- ISTAT ATECO 2025 (struttura e note esplicative, xlsx): https://www.istat.it/it/archivio/ateco-2025
- Istruzioni DSU/ISEE (Ministero del Lavoro): https://www.lavoro.gov.it/strumenti-e-servizi/modulistica/istruzioni-isee-2025
- Diritto annuale 2026 (CCIAA Bologna): https://www.bo.camcom.gov.it/it/diritto-annuale/diritto-2026

**Politecnico di Milano**
- Bando DSU 2026/27: https://www.polimi.it/fileadmin/user_upload/studenti/tasse-borse-agevolazioni-economiche/dsu/bando_2026-2027/Bando_Benefici_DSU_2026-2027.pdf
- Integrazione con le soglie ISEE e ISPE: https://www.polimi.it/fileadmin/user_upload/studenti/tasse-borse-agevolazioni-economiche/dsu/bando_2026-2027/Supplementation_to_the_DSU_call_a.y._26-27.pdf
- Linee guida comunicazione esterni (8/7/2025): https://www.polimi.it/fileadmin/user_upload/Il-Politecnico/brand/Linee_Guida_Comunicazione_ESTERNI_08-07-2025.pdf
- Brand manual: https://www.polimi.it/fileadmin/user_upload/Il-Politecnico/brand/Politecnico_di_Milano_Brand_manual.pdf

**Autorità**
- AGCM, eDreams PS12853: https://www.agcm.it/media/comunicati-stampa/2026/2/PS12853
- AGCOM, influencer (pagina): https://www.agcom.it/comunicazione/avvisi/influencer-linee-guida-codice-di-condotta-e-faq
- AGCOM, delibera 197/25/CONS: https://www.agcom.it/provvedimenti/delibera-197-25-cons
- IAP, Digital Chart: https://www.iap.it/codice-e-altre-fonti/regolamenti-autodisciplinari/regolamento-digital-chart/
- Garante, linee guida cookie: https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876
- Garante, FAQ registro dei trattamenti: https://www.garanteprivacy.it/home/faq/registro-delle-attivita-di-trattamento

**Store e pagamenti**
- Apple Small Business Program: https://developer.apple.com/app-store/small-business-program/
- Apple, app nell'UE (DMA): https://developer.apple.com/support/dma-and-apps-in-the-eu/
- Apple, opzioni di pagamento nell'UE: https://developer.apple.com/support/payment-options-on-the-app-store-in-the-eu
- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Apple, iscrizione: https://developer.apple.com/support/enrollment/
- Apple Developer Program License Agreement: https://developer.apple.com/support/terms/apple-developer-program-license-agreement/
- Apple, trader DSA: https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/
- Google Play, commissioni: https://support.google.com/googleplay/android-developer/answer/112622
- Google Play, test per account personali: https://support.google.com/googleplay/android-developer/answer/14151465
- Google Play, registrazione: https://support.google.com/googleplay/android-developer/answer/6112435
- Google Play, spam: https://support.google.com/googleplay/android-developer/answer/9899034
- Google Play, dati di contatto: https://support.google.com/googleplay/android-developer/answer/10840893
- Verifica sviluppatori Android: https://android-developers.googleblog.com/2026/03/android-developer-verification-rolling-out-to-all-developers.html
- Stripe Italia, prezzi: https://stripe.com/it/pricing
- Stripe, FAQ fatturazione elettronica Italia: https://support.stripe.com/questions/faq-vat-e-invoicing-requirements-in-italy
- Stripe Managed Payments: https://docs.stripe.com/payments/managed-payments
- Paddle: https://www.paddle.com/pricing
- Lemon Squeezy: https://www.lemonsqueezy.com/pricing
- Gumroad: https://gumroad.com/pricing
- PayPal Italia: https://www.paypal.com/it/business/paypal-business-fees
- Satispay Business: https://www.satispay.com/it-it/business/

**Fonti professionali**
- Fiscozen, vendita occasionale: https://www.fiscozen.it/guide/cosa-si-intende-per-vendita-occasionale/
- Fiscozen, vendere corsi online: https://www.fiscozen.it/guide/cosa-si-deve-fare-per-vendere-on-line/
- Fiscozen, prezzi: https://www.fiscozen.it/prezzi/
- Fiscozen, diritti d'autore senza P.IVA: https://www.fiscozen.it/guide/cessione-diritti-dautore-senza-partita-iva/
- Fiscozen, contributi sui diritti d'autore: https://www.fiscozen.it/guide/contributi-cessione-diritti-dautore/
- Fiscozen, procacciatore occasionale: https://www.fiscozen.it/guide/procacciatore-d-affari-prestazione-occasionale/
- Il Commercialista Online, vendere infoprodotti: https://www.ilcommercialistaonline.it/vendere-infoprodotti-online/
- Fiscomania, sviluppatore di app: https://fiscomania.com/sviluppatore-di-app/
- InformazioneFiscale, ATECO 2025 e coefficienti: https://www.informazionefiscale.it/Regime-forfettario-codici-ATECO-2025-coefficienti-redditivita
- Fiscal Focus, 7/7/2026 (parte libera): https://www.fiscal-focus.it/quotidiano/il-quotidiano/articoli-fisco/forfettari-il-nuovo-codice-ateco-non-decide-il-coefficiente-di-redditivita,3,186313
- Fisco Oggi, nuovo TUIR: https://www.fiscooggi.it/portale/-/esordio-ufficiale-per-il-nuovo
- EC News, esonero corrispettivi per servizi elettronici: https://www.ecnews.it/fiscale/fisco-e-patrimonio/iva/esonero-da-certificazione-dei-corrispettivi-per-i-servizi-digitali/
- Il Sole 24 Ore, diritti d'autore e forfettari (4/10/2025): https://quotidiano.ilsole24ore.com/art.php?artid=2045706&e=SOLE&i=20251004&t=S24
- fidocommercialista, ATECO 62.10.00: https://fidocommercialista.it/codice-ateco-62-10-00
