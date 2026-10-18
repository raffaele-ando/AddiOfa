> Scartato dall'utente (18/10): la parte legale la fa chi ne ha l'autorità. Nessuna modifica del prodotto deriva da questo documento.

# Privacy e consenso: cosa si può e si deve fare (agente LEGGE)

Data della ricerca: 17 ottobre 2026. Autore del documento: agente LEGGE (nessuna modifica al codice, nessun comando git).
Questo è un lavoro di ricerca sulle fonti, **non una consulenza legale**: dove le fonti non danno una risposta netta lo dico (sezione 5), e ogni affermazione importante rimanda a una fonte numerata (elenco in fondo, con il grado di lettura: «letta» = testo estratto e riletto; «riassunto» = letta tramite riassunto automatico; «secondaria» = commento di terzi; «non letta»).

Domanda dell'autore: se i servizi (Agorà, ATLAS, NOI, Project / Project ID) non sono necessari al funzionamento dell'app, o si attivano solo quando l'utente apre quella schermata e accetta con una casella, allora non vanno richiesti all'avvio. Che cosa si può/deve fare, e come.

---

## 0. Risposta in breve

1. **Sì: all'avvio non va chiesto nessun dato personale.** Il servizio principale (domande, correzione, simulazioni, diagnostico, progressi) funziona interamente nel dispositivo; nessuna delle informazioni che oggi la registrazione raccoglie (email PoliMi, nome, corso, sede, provenienza, consensi) è necessaria a erogarlo. Per il GDPR «necessario» si legge in senso stretto, con un nesso «diretto e oggettivo» con il servizio richiesto [F2 §30]; chi raccoglie di più viola minimizzazione e protezione per impostazione predefinita [F1 art. 5.1.c, art. 25.2].
2. **L'email PoliMi all'avvio non è necessaria**, e renderla obbligatoria per ottenere il diagnostico non si può «salvare» con un consenso: il consenso dato per ottenere un servizio gratuito che non ne ha bisogno si presume non libero [F1 art. 7.4, considerando 43; F2 §§25-35]. Il test completo si può offrire senza alcun dato; l'email si chiede solo quando serve a una cosa che l'utente ha scelto (accesso Project ID, comunicazioni, eventuale badge «studente PoliMi» verificato).
3. **La casella di consenso è la base giusta solo per ciò che è davvero facoltativo** (comunicazioni, classifica pubblica NOI, eventuale personalizzazione): non preselezionata, una per finalità, revocabile con la stessa facilità, con informativa breve e link, senza che il rifiuto tolga nulla dello studio. Per l'**account** (Project ID) la base è l'esecuzione del servizio che l'utente chiede cliccando «Crea / Accedi», non il consenso.
4. **Oggi il codice fa quattro cose da correggere prima di pubblicare il Worker** (dettaglio al §1.3): email e nome obbligatori nel funnel; un «consenso ATLAS» per un trattamento che non esiste; consensi dell'iscrizione ritirabili solo eliminando il Project ID (contro l'art. 7.3); e titolare «Project» senza nome di persona né contatto (contro l'art. 13.1.a).
5. **Comunicazioni di marketing**: servono consenso specifico e, per non dover provare un consenso su un'email che magari non è di chi l'ha scritta, conferma con doppio passaggio (link nell'email). Il «soft spam» non si applica a una semplice iscrizione gratuita [F7; F6 §2.7].
6. **Un privato che raccoglie dati resta titolare** a tutti gli effetti (nessuna esenzione «domestica» per un sito pubblico che raccoglie email di terzi, si veda §7 per il grado di certezza): informativa completa, registro dei trattamenti (art. 30.5 non esenta i trattamenti non occasionali), contratti con Cloudflare e Google (incorporati nei loro termini, da conservare), trasferimenti extra-UE dichiarati, tempi di conservazione scritti, un recapito vero per i diritti.

---

## 1. Che cosa c'è oggi nel repository (fatti letti, con riferimento ai file)

### 1.1 Flusso di raccolta

- Funnel (`app/src/components/Onboarding.tsx`): pain → gain → 2 domande → **email PoliMi (obbligatoria)** → altre domande, con «Come ci hai conosciuto?» dopo la sesta → percorso di studi → certificazione/OFA → **consensi (3 caselle, spente)** → calcolo → risultato. Il nome si ricava dall'email (`lib/progetto/nomeDaEmail.ts`).
- Solo arrivati al passo dei consensi (`salva(true)`) l'iscrizione va in coda e parte verso `POST /v1/signups` con ritentativi in background (`lib/progetto/coda.ts`). Prima resta nel dispositivo.
- Il Worker ATLAS **non risulta pubblicato** (`atlas/README.md`, `atlas/DEPLOY.md`): quindi, salvo verifica contraria, **non ci sono dati già raccolti da sanare**. È il momento giusto per cambiare.
- Il diagnostico, ATLAS «analisi del livello» (`AtlasAnalisi.tsx`) e le statistiche sono calcolati sul dispositivo: «nessun invio». Il Firebase SDK si carica in modo dinamico solo per l'accesso (`lib/firebase.ts` righe 30-41): all'avvio non si contatta Google (da riverificare dopo ogni modifica).

### 1.2 I tre consensi dell'iscrizione e i quattro permessi del Project ID

| Casella / permesso | Che cosa fa davvero nel codice |
|---|---|
| Consenso «Classifica NOI» (iscrizione) | Viene solo registrato (`consenso_noi`). Un punteggio parte solo con Project ID + permesso `noi.leaderboard` (`Noi.tsx`, `atlas/src/index.ts`). |
| Consenso «Personalizzazione ATLAS» e permesso `atlas.personalize` | **Nessun codice li usa**: nessuna personalizzazione lato server esiste (grep in `app/src` e `atlas/src`: solo definizione e registrazione). È un consenso per un trattamento inesistente. |
| Permesso `progress.share` | Idem: nessun consumatore. |
| Consenso «Messaggi da Project e Agorà» | Registrato; l'autore può esportare le email con `comunicazioni=1` (`GET /v1/admin/signups`). Non esiste invio né conferma dell'indirizzo. |
| Permesso `profile` (obbligatorio) | Nome, foto ed email del Project ID: servono a creare l'account. La foto non risulta usata (da verificare). |

### 1.3 Punti da correggere (ordinati per gravità)

1. **Email e nome obbligatori all'avvio** per proseguire il funnel (`Onboarding.tsx`: `emailOk`, `controllaDatiMinimi`). Contro art. 5.1.c, 25.2, 7.4 (§2 qui sotto).
2. **Consensi dell'iscrizione ritirabili solo eliminando il Project ID** (`ProjectId.tsx` riga ~338; `legal/privacy.ts` sezione «I tuoi diritti»). Contro art. 7.3: «il consenso è revocato con la stessa facilità con cui è accordato» [F1; F2 §§113-114]. Un consenso si dà con un tocco: deve potersi togliere con un tocco, senza cancellare l'account.
3. **Consenso ATLAS vuoto**: si chiede un consenso per qualcosa che non avviene. Viola trasparenza e correttezza (art. 5.1.a) e rende non «specifico» e non «informato» il consenso (art. 4.11, art. 7). Toglierlo finché non c'è un uso reale.
4. **Titolare non identificabile**: `TITOLARE = { nome: 'Project' }` e `CONTACT_EMAIL = undefined` (`config/offer.ts`). L'art. 13.1.a richiede «l'identità e i dati di contatto del titolare» [F1]; «Project» non è un soggetto. Senza recapito, anche i diritti (art. 12.2) sono solo a parole: oggi chi si è iscritto senza Project ID non ha nessuna strada per cancellarsi (`legal/base.ts`: `testoCancellazioneIscrizione` rimanda al login).
5. **Base «legittimo interesse» per statistiche sull'iscrizione** (`legal/privacy.ts`): è la base più fragile quando i dati sono stati chiesti come obbligatori e il titolare non ha rapporto precedente con l'interessato (considerando 47: contano le «ragionevoli aspettative» [F1]). Meglio non appoggiarsi lì.
6. **Email mai confermata + consenso al marketing**: chiunque può iscrivere l'email di un altro con la casella «messaggi» accesa. Il titolare deve poter dimostrare il consenso (art. 7.1); il Garante suggerisce per la prova una conferma con link via email [F6 §2.6.4].
7. **Invio in background di dati salvati nel dispositivo** (`coda.ts`): per l'ePrivacy un codice del sito che invia al server informazioni già salvate nel terminale è un «accesso a informazioni già archiviate» e richiede consenso o eccezione di stretta necessità [F4 §§33, 44, 52-53]. Se l'invio segue un gesto esplicito dell'utente («Iscrivimi») è la prosecuzione del servizio richiesto (mia lettura, non una risposta testuale delle fonti: §5); se parte da solo per chi non ha mai chiesto nulla, no.
8. **Due sistemi di consenso sovrapposti** (3 caselle dell'iscrizione + 4 permessi del Project ID, con testi e versioni diversi, `ISCRIZIONE_VERSIONE` e `CONSENT_VERSION`): confonde e raddoppia le prove. Unificare in un solo registro per finalità.
9. **Nome reale ricavato dall'email** senza che l'utente lo scriva: non è necessario a nulla (la classifica usa il @nome utente). Minimizzazione: non ricavarlo, non salvarlo; chiedere al massimo un nome da mostrare.

---

## 2. Quadro giuridico essenziale (cosa dicono le fonti)

Citazioni brevi dal testo italiano del GDPR [F1] e dalle linee guida EDPB [F2, F3, F4].

**Minimizzazione e limitazione della finalità.** Dati «adeguati, pertinenti e limitati a quanto necessario rispetto alle finalità» (art. 5.1.c); finalità «determinate, esplicite e legittime» (art. 5.1.b). Per impostazione predefinita si trattano «solo i dati personali necessari per ogni specifica finalità», e la regola vale per «quantità dei dati raccolti, portata del trattamento, periodo di conservazione e accessibilità»; in particolare per impostazione predefinita non si rendono accessibili dati «a un numero indefinito di persone fisiche senza l'intervento della persona fisica» (art. 25.2). Per l'EDPB, «accessibility» significa che prima di pubblicare dati (la classifica) l'interessato deve poter intervenire, ad esempio con un consenso o con impostazioni di privacy [F3 §§56-58].

**Consenso.** Manifestazione di volontà «libera, specifica, informata e inequivocabile», con dichiarazione o «azione positiva inequivocabile» (art. 4.11). Il silenzio, l'inattività e la preselezione di caselle non sono consenso (considerando 32); le caselle già spuntate sono invalide [F2 §79]. Il consenso non si ottiene con lo stesso gesto con cui si accettano i termini generali [F2 §81]. Se il consenso è dato in un testo che riguarda altro, la richiesta è «chiaramente distinguibile» (art. 7.2).

**Subordinazione («bundling»).** Si tiene «nella massima considerazione» che un servizio sia condizionato al consenso a dati «non necessario[i]» (art. 7.4). Considerando 43: il consenso si presume non libero se non si può dare separatamente a trattamenti distinti, o se il servizio «è subordinato al consenso sebbene esso non sia necessario». L'EDPB: i casi in cui la subordinazione non invalida il consenso saranno «highly exceptional» [F2 §35]; il consenso e il contratto non vanno confusi [F2 §26]; l'onere della prova è del titolare [F2 §36].

**Granularità.** Più finalità, più consensi separati [F2 §§42-45; considerando 32 e 43]. Un esempio dell'EDPB: marketing per email e cessione dei dati ad altre società nella stessa richiesta = consenso non valido [F2 §45]. Il Garante (spam, 2013): consenso per ciascuna finalità distinta (marketing, profilazione, comunicazione a terzi) [F6 §2.6.1].

**Informato.** Minimo: identità del titolare, finalità di ciascun trattamento, quali dati, diritto di revoca, eventuali rischi di trasferimenti senza adeguatezza [F2 §64]. Informativa all'atto della raccolta con tutte le voci dell'art. 13 [F1].

**Revoca.** «Il consenso è revocato con la stessa facilità con cui è accordato»; l'interessato ne è informato prima (art. 7.3). Se il consenso si dà con un clic nell'interfaccia di un sito o app, si deve poter revocare nella stessa interfaccia [F2 §114]. Se si revoca e non c'è altra base, i dati si cancellano [F2 §117; art. 17.1.b].

**Minori.** Se la base è il consenso e il servizio è offerto direttamente a minori, in Italia il consenso è valido da soli dai **14 anni**; sotto, serve chi esercita la responsabilità genitoriale (art. 8 GDPR + art. 2-quinquies D.Lgs. 196/2003 [F8, secondaria]); informazioni in linguaggio comprensibile al minore (art. 12.1 [F1]; art. 2-quinquies c. 2). Verifica dell'età proporzionata: per rischi bassi basta una dichiarazione [F2 §135]. Se un servizio è chiaramente rivolto solo a maggiorenni e le circostanze non lo smentiscono, l'art. 8 non si applica [F2 §130]: qui non è credibile, perché il pubblico include chi si prepara prima dei 18.

**Marketing diretto.** Email promozionali: consenso preventivo (art. 130 c. 1-2 Codice, secondo il riassunto [F8]); la deroga del c. 4 (soft spam) riguarda chi ha acquistato prodotti o servizi e vale solo per email e servizi analoghi con possibilità di opporsi [F6 §2.7]. La Cassazione (sez. II, 15 marzo 2023, n. 7555) ha escluso la deroga per chi si è solo registrato o ha usato un servizio gratuito e ha detto che l'opt-out successivo non sana un consenso mancante [F7, secondaria]. Il consenso al marketing non può essere condizione per registrarsi o accedere al servizio [F6 §2.6]. Diritto di opposizione al marketing diretto in qualsiasi momento e da portare «esplicitamente all'attenzione» al più tardi alla prima comunicazione (art. 21.2-21.4 [F1]).

**Archiviazione nel dispositivo.** L'art. 122 Codice vieta archiviare o accedere a informazioni nel terminale senza consenso, **salvo** se è solo per trasmettere una comunicazione o se «strettamente necessario» a un servizio della società dell'informazione espressamente richiesto [F8 riassunto; F5 §5: per i cookie tecnici basta l'informativa]. Il Garante nelle linee guida del 2021 non nomina `localStorage`/IndexedDB nella parte letta; copre in generale «altri strumenti di tracciamento» [F5 §3]. L'EDPB (2/2023) dice che un'applicazione web che usa dentro il browser informazioni già salvate (cookie, local storage...) senza che escano dal dispositivo **non** «accede» ai sensi dell'art. 5.3 ePrivacy; appena l'informazione, o una derivazione, viene inviata altrove, l'art. 5.3 si applica [F4 §44, §§52-53].

**Trasferimenti extra-UE.** Ammessi con decisione di adeguatezza (art. 45) o garanzie adeguate (art. 46, per esempio clausole contrattuali tipo) [F1]. Cloudflare dichiara di appoggiarsi alla certificazione al Data Privacy Framework UE-USA e, in subordine, alle clausole tipo, con il DPA incorporato automaticamente nell'accordo self-serve [F10]. Google dichiara che Google LLC ha certificato l'adesione al DPF; **Firebase Authentication «è eseguita solo da data center USA»** [F9]. Il DPF è stato confermato dal Tribunale UE il 3 settembre 2025 (causa Latombe, T-553/23); contro la sentenza pende appello alla Corte di giustizia (C-703/25 P) secondo fonti secondarie di fine 2025 [F12]: stato attuale da riverificare.

**Direttive e regolamenti non pertinenti (o non verificati).** Digital Services Act e Data Act: non letti in questa sessione. Per il Data Act (prodotti connessi, cambio di fornitore cloud) non vedo pertinenza. Per il DSA: una classifica con @nome utente e un'eventuale community sono forse «hosting» di informazioni fornite dagli utenti; gli obblighi minimi (punto di contatto, condizioni chiare, segnalazione) scattano davvero se si aggiungono contenuti degli utenti (commenti, messaggi, bio). Da verificare con un professionista prima di aprire una community vera; oggi (nome utente e punteggio) il rischio sembra basso ma **non l'ho verificato sul testo**.

---

## 3. Tabelle (punto 1 della consegna)

### 3.1 Per servizio

| Servizio | Necessario al funzionamento dell'app? | Finalità | Base giuridica adeguata | Quando e dove chiederlo | Se l'utente rifiuta |
|---|---|---|---|---|---|
| **AddiOFA base** (domande, correzione, simulazioni, diagnostico, progressi, esporta/importa) | È il servizio | Studiare | Nessun trattamento da parte dell'autore: i dati restano nel dispositivo; archiviazione locale = «strettamente necessaria» al servizio richiesto (art. 122 [F8]; F4 §44) | Mai chiedere dati. Informare con una riga vera | Non esiste rifiuto: nulla viene chiesto |
| **Project ID** (account, login Google o link email) | No | Ritrovare l'iscrizione, usare NOI, collegare più app | Esecuzione del servizio richiesto (art. 6.1.b) per i dati strettamente necessari all'account; **non** consenso [F2 §31] | Solo dopo che l'utente apre «Project ID» e tocca «Crea / Accedi» (azione esplicita). Riga informativa accanto al pulsante | Resta tutto com'è: nessuna funzione di studio dipende dall'account |
| **ATLAS** (Worker + D1) | No: è l'infrastruttura di Project ID e NOI, non un servizio a sé per l'utente | Custodire account, punteggi, consensi | Quella del servizio che lo usa (Project ID, NOI, comunicazioni). **Non** una casella a sé | Nessuna casella «ATLAS» all'avvio. La schermata «ATLAS analisi» resta locale e non chiede nulla | Nulla da rifiutare |
| **Personalizzazione ATLAS** | No | (oggi non esiste un trattamento) | Se un giorno esisterà: consenso specifico (profilazione, art. 4.4; cautela minori, considerando 38) | Non si chiede finché non esiste. Poi: casella dedicata, nella schermata ATLAS | N/A |
| **NOI** (classifica pubblica) | No | Confronto tra partecipanti | Consenso (art. 6.1.a) per la pubblicazione a un numero indefinito di persone, con intervento dell'interessato (art. 25.2; F3 §56-58). Incertezza: potrebbe anche essere «servizio richiesto» (6.1.b): §7 | Solo nella schermata NOI, dopo il Project ID, con casella non preselezionata e controllo di età (14) | Nessun punteggio inviato, nessuna comparsa in classifica; resto invariato |
| **Agorà** (Instagram `polimi.agora`) | No | Raggiungere gli studenti del Poli | Nessun dato trattato dall'autore: è un link verso Instagram (Meta è titolare per conto suo) | Nessuna casella. Il link avverte «esci da AddiOFA» (già in privacy/termini). Se si manda marketing via email vale il consenso «comunicazioni» | Nulla |
| **Project: comunicazioni** (email di novità) | No | Marketing diretto | Consenso (art. 6.1.a + art. 130 Codice), specifico, con conferma via link; **niente soft spam** [F7; F6 §2.7] | Solo da «Project ID › Comunicazioni» o da un invito dopo il risultato, con casella non preselezionata | Non si scrive. Nessun effetto sul resto |

### 3.2 Per dato

| Dato | Necessario? | Finalità | Base | Quando e dove | Se rifiuta / non lo dà |
|---|---|---|---|---|---|
| Risposte, simulazioni, statistiche, obiettivi, preferenze, corso/anno/certificazione/OFA usati per il piano | Sì per le funzioni locali | Studio e piano personale | Restano nel dispositivo: nessun trattamento dell'autore | Possono continuare a essere chieste **in locale** quando servono a una funzione visibile (es. il piano), mai inviate senza azione dell'utente | Il piano è meno personalizzato |
| Email (per accesso Project ID) | Sì, solo per il login con link | Autenticare | 6.1.b | In «Project ID» quando sceglie «Accedi con email» | Può usare Google o non avere account |
| Email (per comunicazioni) | No | Marketing | Consenso + doppio passaggio | In «Comunicazioni», qualunque indirizzo (non solo PoliMi) | Non si salva |
| **Email PoliMi** | **No, a meno di una funzione che la richieda davvero** (es. community «studenti Poli» con verifica dell'indirizzo) | Dimostrare/qualificare l'appartenenza all'ateneo (se la funzione esiste) | 6.1.b se è il servizio richiesto e l'indirizzo è **verificato**; altrimenti non chiederla | Solo nella schermata di quella funzione | Si usa il Project ID senza badge Poli |
| Nome (ricavato dall'email) | No | — | — | Non ricavarlo né salvarlo. Se serve un nome visibile: «come vuoi essere chiamato» scelto dall'utente | Si usa solo il @nome utente |
| @nome utente | Sì per NOI | Identità pubblica in classifica | Quella di NOI (consenso o 6.1.b) | In NOI | Niente classifica |
| Foto Google | No (se non è usata) | — | — | Non chiederla/salvarla se non c'è una schermata che la mostra | — |
| Corso, scuola, sede, livello, anno | No | Eventuale classifica per corso o funzioni di gruppo; oppure statistica | Se usati da una funzione scelta dall'utente (es. NOI per corso): parte del consenso NOI; come mera statistica: consenso distinto o niente | Solo nel profilo del Project ID, facoltativi, con frase «a che cosa servono» | Si salta, nessun effetto |
| «Come ci hai conosciuto» | No | Statistica sul progetto | Consenso, o non chiederlo; il legittimo interesse è fragile (§7) | Solo in «Project ID», facoltativo; meglio eliminarlo se nessuno lo guarda | Si salta |
| Punteggio NOI (domande imparate, miglior simulazione) | Solo per NOI | Classifica | Come NOI | In NOI | Non inviato |
| Registro dei consensi (data, versione, finalità) | Sì per l'obbligo di dimostrare (art. 7.1) | Prova | Obbligo di accountability (art. 5.2, art. 7.1) | Automatico, con il consenso | — |
| IP (impronta per limite richieste, 1 ora) | Sì per sicurezza | Anti-abuso | Legittimo interesse (art. 6.1.f), minimo | Dichiarare in informativa | — |
| Dati di connessione nei log di Cloudflare | Sì tecnico | Erogare/proteggere il servizio | Fornitore come responsabile | Dichiarare in informativa | — |
| Dati nel dispositivo (`localStorage`, IndexedDB Firebase dopo il login) | Sì (tecnici) | Funzionare, ricordare l'accesso | Art. 122: strettamente necessari [F8; F5 §5] | Informativa cookie/dati sul dispositivo (già c'è); nessun banner | — |

---

## 4. Regole di prodotto numerate (punto 2 della consegna)

**Funnel all'avvio**

1. All'avvio **non si chiede e non si invia nessun dato personale**: via email, nome, provenienza, caselle dei consensi. Il funnel diventa: pain → gain → diagnostico (10 domande) → risultato. Il test completo è disponibile senza alcun dato.
2. Corso/anno/certificazione/OFA possono restare nel funnel **solo se usati subito in locale** (piano, scadenze) e senza invio; altrimenti si spostano. Se si tengono, dire con una riga «resta sul tuo dispositivo».
3. Nessun invio a ATLAS e nessuna chiamata a Firebase all'avvio (nessuna coda di iscrizione in background per chi non ha chiesto nulla). La coda (`coda.ts`) si può tenere solo come ritentativo di un invio che l'utente ha chiesto con un gesto esplicito.
4. In un punto visibile (primo avvio o schermata dati/privacy) una riga vera: «Non ti chiediamo dati: tutto resta sul tuo dispositivo» (testo al §5.1). È vera solo finché le regole 1 e 3 sono rispettate.
5. Nessun banner cookie: non servono se si usa solo archiviazione tecnica e non ci sono analytics/tracciamento [F5 §5]. L'informativa sui dati nel dispositivo resta (pagina Cookie).

**Dove spostare ciò che c'era**

6. **Project ID**: schermata esistente. Pulsanti «Accedi con Google» / «Accedi con email» con riga di informativa breve + link. Base: servizio richiesto; **nessuna casella**. Chiedere l'età con una dichiarazione («Ho almeno 14 anni», non salvata come data di nascita) prima di creare l'account o prima di NOI/comunicazioni: sotto i 14 anni non si procede senza autorizzazione dei genitori; per semplicità di prodotto: sotto i 14 anni l'area account è non disponibile e si dice con una riga.
7. **NOI**: dentro NOI, dopo il Project ID. Casella dedicata, non preselezionata, con tre elementi: che cosa è pubblico (solo @nome utente, domande imparate, miglior simulazione), chi lo vede (tutti i partecipanti), come uscire (stesso schermo, un tocco, il punteggio sparisce subito). Mai il nome reale né l'email in classifica. Il @nome utente è scelto dall'utente, non derivato dall'email.
8. **ATLAS**: nessuna casella, nessuna schermata di raccolta. La schermata «ATLAS analisi» resta locale. Togliere il consenso e il permesso «Personalizzazione ATLAS» (e `progress.share`) dalle schermate finché non esiste il trattamento; quando esisterà: casella dedicata, testo al §5.3.
9. **Agorà**: nessuna casella. Il pulsante apre Instagram con avviso «Esci da AddiOFA» (già previsto); aggiungere `rel="noopener noreferrer"` ai link esterni (minimizzazione: non comunicare da quale pagina arriva l'utente).
10. **Comunicazioni da Project/Agorà**: sezione «Comunicazioni» dentro Project ID **o** un invito non ripetitivo dopo il risultato del diagnostico; indirizzo qualunque (non solo PoliMi); conferma con link («doppio passaggio»); nessuna email prima della conferma; ogni messaggio con link di disiscrizione e indicazione del titolare [F1 art. 21.4; F8 art. 130 c. 5].
11. **Email PoliMi**: non va chiesta a nessuno. Va chiesta solo se esiste una funzione concreta che la richiede (es. badge «studente PoliMi» nella community) e solo dopo la verifica con link (`lib/progetto/verificaEmail.ts` già esiste): finché non è verificata non si usa per decidere nulla né si chiama «verificata». Se la funzione non c'è, non si raccoglie.
12. **Corso/sede/anno/provenienza**: tutti facoltativi, solo nel profilo del Project ID, ciascuno con la funzione che lo usa. Se nessuna funzione li usa, eliminarli (e togliere le colonne dallo schema alla prossima migrazione).

**Caselle di consenso (come devono essere)**

13. Mai preselezionate [F1 considerando 32; F2 §79]; si accendono solo con un gesto.
14. Una casella per finalità: classifica NOI, comunicazioni, (in futuro) personalizzazione. Mai una casella che unisce due scopi, mai «accetto tutto» [F2 §§42-45].
15. Separate dall'accettazione dei Termini e da qualsiasi pulsante di avanzamento: la richiesta è «chiaramente distinguibile» (art. 7.2). Il pulsante «Continua» deve funzionare identico con tutte le caselle spente.
16. Ogni casella dice: chi è il titolare, che dato, a quale scopo, chi lo vede, il diritto di revoca, [F2 §64]; sotto, una riga di informativa breve con link all'informativa completa (§6.2).
17. **Revoca con lo stesso gesto**: ogni consenso ha un interruttore nella stessa schermata dove si è dato (comunicazioni e NOI nella loro sezione; comunicazioni anche dal link nell'email). La revoca **non** richiede di eliminare l'account [F1 art. 7.3; F2 §114].
18. Nessuna subordinazione: il rifiuto o il mancato rilascio non toglie nessuna funzione di studio, e nemmeno limita l'account, a meno che la funzione richiesta sia di per sé il trattamento (NOI senza dati in classifica non ha senso: lo dice la casella). Nessun testo che faccia pressione («Sei sicuro?», timer, ecc. già vietati da CLAUDE.md).
19. Registro delle prove: per ogni consenso data, ora, finalità, versione del testo (con testo conservato nel repository per versione) [F1 art. 7.1]. Un solo registro (`consent_log`) per tutti i consensi; eliminare la doppia versione `ISCRIZIONE_VERSIONE`/`CONSENT_VERSION` unificando in una.

**Dati e funzioni**

20. Non ricavare né conservare il nome reale dall'email (`nomeDaEmail.ts`): se serve un nome visibile, lo sceglie l'utente.
21. Foto e altri dati del profilo Google: non salvarli se non c'è una schermata che li usa.
22. Cancellazione senza Project ID: ora impossibile (nessun contatto); con le regole 1-12 l'unico dato fuori dal login è l'email delle comunicazioni, che si cancella con la disiscrizione; in più un recapito di contatto vero (§6).
23. Esporta/importa locale resta; l'esportazione ATLAS (`/v1/me/export`) soddisfa la portabilità (art. 20: vale per dati forniti e trattati con consenso o contratto [F1]).
24. Prima di pubblicare il Worker: titolare con nome e cognome (o ragione sociale) e recapito vero in `config/offer.ts`; D1 in giurisdizione UE (§6); testi legali del §5.

**Se l'autore volesse comunque l'email all'avvio (non consigliato)**

25. Lecito solo come passo **opzionale e fuori dal percorso del test**, per esempio dopo il risultato: pulsante «Non ora» alla stessa evidenza di «Avanti», nessuna email obbligatoria, nessun invio automatico, casella delle comunicazioni spenta, e il test già consegnato. È un rischio maggiore (richiesta «non inutilmente invasiva» [F2 §82]) e contraddice la logica «all'avvio solo il necessario» dell'art. 25.2: la sede giusta resta il Project ID.

---

## 5. Testi proposti (punto 3 della consegna)

Segnaposto: `[NOME COGNOME]` e `[EMAIL DI CONTATTO]` del titolare (persona fisica). I testi rispettano il registro di CLAUDE.md (niente «Pass», «Sblocca», «beta», «presto», «in arrivo»).

### 5.1 Riga di apertura (primo avvio / schermata dati)

> Non ti chiediamo nessun dato: domande, correzione e progressi restano sul tuo dispositivo. Account, classifica e messaggi sono facoltativi e li trovi in «Project ID».

### 5.2 Informativa breve (sotto ogni punto di raccolta; variante per servizio)

Account (Project ID):
> Titolare: [NOME COGNOME] ([EMAIL DI CONTATTO]). Per creare il tuo Project ID salviamo il tuo indirizzo email (e il nome del tuo account Google, se accedi con Google) su ATLAS, il servizio di Project ospitato da Cloudflare; l'accesso è gestito da Google (Firebase), anche negli Stati Uniti, con le garanzie previste dalla legge. Li teniamo finché non elimini il Project ID o per 24 mesi di inattività. Puoi accedere, correggere, cancellare, esportare i dati e reclamare al Garante: [informativa completa].

NOI:
> Titolare: [NOME COGNOME]. Se accendi la casella, il tuo @nome utente, le domande imparate e il miglior punteggio compaiono nella classifica e li vedono tutti. Spegnendo la casella il punteggio sparisce subito. [informativa completa].

Comunicazioni:
> Titolare: [NOME COGNOME]. Usiamo la tua email solo per scriverti di Project e di Agorà. Ti mandiamo prima un link per confermare. Ti disiscrivi da ogni email e da «Project ID › Comunicazioni». [informativa completa].

### 5.3 Caselle (tutte non preselezionate)

**Classifica NOI** (in NOI, dopo il Project ID):
- Titolo: `Voglio comparire nella classifica NOI`
- Testo: `Si vedono il mio @nome utente, le domande imparate e il miglior punteggio in simulazione, e li vedono tutti i partecipanti. Posso uscire quando voglio da qui, con un tocco, e il mio punteggio sparisce subito. Non cambia nulla nello studio.`
- Sotto: la riga di informativa breve NOI.

**Comunicazioni** (in «Project ID › Comunicazioni»):
- Titolo: `Voglio ricevere email da Project e Agorà`
- Testo: `Novità del progetto e di Agorà, all'indirizzo che scrivo qui. Ti mandiamo un link per confermare: finché non confermi non ti scriviamo. Puoi disiscriverti da ogni email e da questa pagina.`
- Campo: `Email (anche personale)`.
- Sotto: la riga di informativa breve Comunicazioni.

**Personalizzazione ATLAS** (da usare **solo quando il trattamento esisterà**; oggi non mostrarla):
- Titolo: `Voglio che ATLAS usi le mie risposte per consigliarmi cosa ripassare`
- Testo: `ATLAS legge le mie risposte e il mio punteggio per proporre ripassi nelle altre app di Project. Puoi toglierlo quando vuoi da qui e i dati usati per questo si cancellano.`

**Età** (non è un consenso: è un requisito, prima di creare il Project ID):
- Casella: `Ho almeno 14 anni`
- Testo: `Sotto i 14 anni serve l'autorizzazione di un genitore o di chi ne fa le veci: per ora l'account non è disponibile. L'allenamento di AddiOFA funziona uguale.`

**Messaggio se è sotto i 14 anni** (senza account):
> L'allenamento resta aperto e senza dati. Per Project ID e NOI serve l'autorizzazione di un genitore: chiedigli di scrivere a [EMAIL DI CONTATTO].

### 5.4 Modifiche ai testi legali e alle FAQ

**`legal/privacy.ts`**
- *In breve* (sostituire):
  > AddiOFA si usa senza dati personali: domande, simulazioni e progressi stanno nel tuo browser e non li riceviamo. Solo se scegli tu di creare un Project ID, di entrare nella classifica NOI o di ricevere email, trattiamo i dati che servono a quella cosa e nient'altro. Non usiamo cookie di tracciamento né statistiche, non c'è pubblicità e non vendiamo dati.
- *Chi è il titolare*: nome e cognome della persona, recapito (email o PEC); eliminare «Project è il progetto…» come titolare. Aggiungere: «Se ci scrivi, rispondiamo entro un mese (prorogabile di due, se serve).»
- *Quali dati trattiamo*: rifare l'elenco per servizio (tabella 3.2): sul dispositivo; Project ID (email, identificativo, @nome utente, permessi con data); NOI (@nome utente, domande imparate, miglior simulazione); comunicazioni (email, data e versione del consenso, data della conferma); dati tecnici (impronta dell'IP per un'ora, log del fornitore). **Eliminare** nome ricavato, corso, sede, provenienza se non usati.
- *Perché li trattiamo e su quale base*: sostituire con:
  > Project ID: esecuzione del servizio che chiedi (art. 6.1.b GDPR). Classifica NOI: tuo consenso (art. 6.1.a), revocabile con un tocco. Email di Project e Agorà: tuo consenso (art. 6.1.a e art. 130 del Codice privacy), confermato con un link. Sicurezza e limite delle richieste: legittimo interesse (art. 6.1.f), con dati minimi. I consensi sono facoltativi e indipendenti: non darli non toglie nessuna funzione di studio.
  Togliere la frase sulle «statistiche aggregate» come legittimo interesse.
- *Con chi li condividiamo*: aggiungere che Cloudflare e Google agiscono come responsabili del trattamento sulla base dei loro termini di trattamento dei dati; che l'accesso Firebase (Google) è eseguito da data center negli Stati Uniti e si basa sul Data Privacy Framework e sulle clausole contrattuali tipo; che i dati di ATLAS sono conservati in un database in Unione europea (se la giurisdizione UE sarà impostata, §6).
- *Quanto restano* (proposta da far validare):
  > Project ID: finché non lo elimini; dopo 24 mesi senza accessi ti avvisiamo per email e, se non rispondi, lo cancelliamo. Punteggio NOI: finché sei in classifica. Email delle comunicazioni: finché non ti disiscrivi; dopo la disiscrizione teniamo solo un'impronta dell'indirizzo per non riscriverti per sbaglio. Prova del consenso: [da decidere, §7]. Impronta dell'IP: un'ora.
- *I tuoi diritti*: sostituire il blocco che dice che i consensi si ritirano «eliminando il Project ID» con: «Ogni consenso si ritira con lo stesso tocco con cui si dà, nella stessa pagina, senza eliminare l'account». Aggiungere che chi non ha un Project ID scrive a [EMAIL DI CONTATTO] (oppure usa il link di disiscrizione). Aggiungere il diritto di opporsi alla ricezione dei messaggi promozionali in ogni momento.
- *Email non verificata*: riscrivere secondo ciò che esiste (verifica con link per Project ID; per le comunicazioni conferma con link).
- *Minori*: «Per creare il Project ID e dare i consensi devi avere almeno 14 anni; sotto serve l'autorizzazione di chi esercita la responsabilità genitoriale. Ti scriviamo qui in modo semplice: se non sei sicuro, chiedi a un adulto o non attivare nulla: AddiOFA funziona uguale.»
- Aggiungere sezione *Se non fornisci i dati*: «Nessun dato è obbligatorio per studiare. Per creare il Project ID serve l'email; per la classifica NOI, un @nome utente.» (art. 13.2.e [F1]).

**`legal/termini.ts`**
- *Come si usa*: sostituire «All'inizio ti chiediamo nome ed email del Politecnico; il resto della registrazione e i consensi sono facoltativi» con «Non ti chiediamo dati per studiare. Project ID, NOI e le email di Project sono facoltativi e si attivano solo se lo scegli.»
- *Dati veri e email*: sostituire con «Se crei un Project ID, scrivi il tuo indirizzo, non quello di un'altra persona.» e togliere i riferimenti all'«email PoliMi non verificata».
- *Project ID, NOI e Agorà*: aggiungere una frase: «Uscire dalla classifica o dalle comunicazioni non richiede di eliminare il Project ID.»

**`legal/cookie.ts`**
- Aggiornare la chiave `ofa_polimi_app_state` (non più «dati della tua registrazione»), togliere `addiofa_progetto_coda` finché non c'è un invio chiesto dall'utente (o descriverla come «solo dopo un invio che hai chiesto»), confermare che IndexedDB di Firebase si usa solo dopo il login (testo già corretto).

**`lib/servizi/faq.ts`**
- `dati-raccolti`:
  > Nessun dato per studiare: domande, correzione e progressi restano nel tuo browser. Solo se crei un Project ID, entri nella classifica NOI o chiedi le email di Project raccogliamo ciò che serve a quella cosa. Le caselle sono spente finché non le accendi tu e le puoi spegnere quando vuoi.
- `certificazione` (riga ~63): «non ti chiede nessuna email istituzionale» resta vero e va tenuto.
- Aggiungere: «Devo dare l'email del Politecnico?» → «No. Non è necessaria per studiare. La chiediamo solo se vuoi una funzione che ne ha bisogno, e in quel caso te lo diciamo prima.»

**`lib/progetto/informativa.ts`**: l'`INFORMATIVA_BREVE` attuale (una per tutto) va divisa nelle tre righe del §5.2 e deve nominare una persona e un recapito (oggi `TITOLARE.nome` = 'Project').

---

## 6. Cosa serve a un privato che raccoglie dati (punto 4 della consegna)

L'esenzione per attività «esclusivamente personali o domestiche» (art. 2.2.c, considerando 18 [F1]) vale per trattamenti «senza connessione con attività commerciale o professionale»; il considerando aggiunge che il regolamento si applica a chi fornisce i mezzi per quelle attività. Un sito pubblico che raccoglie email e pubblica nomi di terzi non mi sembra coperto (giurisprudenza non verificata, §7): quindi l'autore è titolare, **anche se persona fisica e senza società**, e risponde in proprio.

1. **Identità e recapito** (art. 13.1.a [F1]): nome e cognome e un recapito che funzioni (email dedicata o PEC). L'indirizzo postale non è richiesto dal testo dell'art. 13; un obbligo informativo diverso per i prestatori di servizi online (D.Lgs. 70/2003) **non l'ho verificato**: da far controllare (può chiedere anche il domicilio). Per non esporre la residenza, valutare un recapito alternativo (casella postale, domiciliazione) solo dopo parere.
2. **Informativa** (artt. 12-14): breve ai punti di raccolta + completa nella pagina Privacy, in linguaggio semplice, adatta ai minori dove serve. Voci obbligatorie dell'art. 13.1-13.2 (identità, finalità e base, destinatari, trasferimenti, periodo, diritti, revoca, reclamo, obbligatorietà) già coperte dal §5.4.
3. **Registro dei trattamenti** (art. 30): l'esenzione per organizzazioni sotto 250 dipendenti **non vale** se il trattamento non è occasionale, comporta rischio o tratta categorie particolari (art. 30.5 [F1]). Un servizio continuo che raccoglie email non è occasionale: tenere un registro semplice (anche una tabella). Il Garante raccomanda di tenerlo a tutti [F13, secondaria]. Struttura minima: titolare e recapito; per ogni trattamento (account, NOI, comunicazioni, sicurezza) finalità, categorie di interessati e dati, destinatari, trasferimenti extra-UE, termini di cancellazione, misure di sicurezza.
4. **Responsabili del trattamento** (art. 28): Cloudflare (Worker, D1, eventuale hosting) e Google (Firebase Authentication). Il DPA di Cloudflare è incorporato nell'accordo self-serve e include le clausole tipo [F10]; per Google/Firebase valgono i «Firebase Data Processing and Security Terms» [F9, link alla pagina]. Azioni: **scaricare e archiviare** le versioni dei due accordi con la data in cui l'autore li ha accettati/utilizzati; elencarli nel registro e nell'informativa (categorie di destinatari, art. 13.1.e). Meta/Instagram **non è** un responsabile: è un titolare autonomo per ciò che avviene su Instagram.
5. **Trasferimenti extra-UE** (art. 13.1.f; artt. 44-49): Firebase Authentication è eseguita solo da data center USA [F9] → trasferimento verso gli Stati Uniti, coperto dal DPF per Google LLC e, in subordine, dalle clausole tipo [F9]. Cloudflare: DPF + clausole tipo [F10]. Dire entrambe le cose nell'informativa. Il DPF ha retto davanti al Tribunale UE (3 settembre 2025) ma è impugnato [F12]: tenere d'occhio l'esito.
6. **Dove sta il database**: oggi D1 è creato «Europa occidentale» (`atlas/DEPLOY.md`). Secondo la documentazione Cloudflare, una **giurisdizione** UE vincola esecuzione e archiviazione, ma si imposta **solo alla creazione** del database; i Worker possono comunque accedervi da qualunque parte del mondo [F11, snippet di ricerca]. Un indizio di posizione (location hint) non è una garanzia. Il Worker non è ancora pubblicato e il database è vuoto o quasi: conviene ricrearlo con `--jurisdiction eu` prima del lancio (verificare i comandi sulla pagina Cloudflare).
7. **Sicurezza** (art. 32; art. 5.1.f): HTTPS già c'è; `ADMIN_TOKEN` come segreto; esportazioni dei dati personali fuori dal repository (già in `DEPLOY.md`); limitare chi accede; cifratura dei backup; prova di cancellazione. Violazioni (art. 33): notifica al Garante entro 72 ore se c'è rischio per le persone; scrivere in anticipo una procedura di una pagina.
8. **Tempi di conservazione** (art. 5.1.e; art. 13.2.a): proposte nel §5.4. **Non sono termini fissati dalla legge**: sono scelte da documentare. Opzioni da decidere sulla prova del consenso (art. 7.1): (a) cancellare tutto con l'account (prova eliminata insieme alla persona; più semplice); (b) conservare per un periodo limitato solo data, versione e impronta dell'email per difendersi da contestazioni, dichiarandolo in informativa. Non ho trovato una fonte che indichi un periodo preciso: da far decidere a un professionista.
9. **Canale per i diritti** (artt. 12, 15-22): casella email dedicata; risposta entro un mese, prorogabile di due con motivazione (art. 12.3 [F1]); in app: esporta/cancella dal Project ID; disiscrizione in ogni email; revoca dei consensi dove sono stati dati. Verificare l'identità di chi scrive prima di cancellare (già indicato in privacy).
10. **Consenso e prova** (art. 7.1): un solo registro, con versioni dei testi conservate per data. Per le comunicazioni, conferma con link e tenere data e ora della conferma.
11. **Minori** (art. 8; art. 2-quinquies): dichiarazione di età 14+ prima di Project ID/NOI/comunicazioni; sotto i 14 niente account (scelta di prodotto più semplice rispetto a verificare l'autorizzazione dei genitori, che richiederebbe «ogni sforzo ragionevole», art. 8.2 [F1]).
12. **Valutazione d'impatto, DPO**: non le ho verificate sulle fonti ufficiali (artt. 35 e 37, elenco del Garante). Per un trattamento di piccola scala con possibili minori e una classifica pubblica sembrano non obbligatorie, ma lo dico come **ipotesi**.
13. **Da far verificare a un professionista** (elenco nel §7).

---

## 7. Incertezze dichiarate (punto 5 della consegna)

| # | Punto | Che cosa dicono le fonti | Che cosa non so / ipotesi |
|---|---|---|---|
| 1 | L'email all'avvio è «necessaria»? | La necessità contrattuale si interpreta in senso stretto e vuole un nesso «diretto e oggettivo» [F2 §30]. Il test non ne ha bisogno. | Nessuna incertezza reale sul diagnostico; una funzione futura (verifica studenti Poli) potrebbe rendere l'email necessaria **per quella funzione** e solo allora. |
| 2 | NOI: base consenso o esecuzione del servizio | L'EDPB dice che se il trattamento è necessario al servizio richiesto il consenso non è la base appropriata [F2 §31]; ma la pubblicazione a un numero indefinito di persone richiede l'intervento dell'interessato per impostazione predefinita [F1 art. 25.2; F3 §§56-58]. | Si può difendere l'una o l'altra. Raccomando la casella (più prudente, dà revoca); un professionista può preferire la base contrattuale con interruttore. |
| 3 | Minori sotto i 18 e base contrattuale | L'art. 8.3 lascia ferme le regole nazionali sulla validità dei contratti con i minori [F1]. | Non ho consultato il Codice civile: la capacità contrattuale piena è a 18 anni (mia conoscenza generale, non verificata). Potrebbe indebolire l'esecuzione di un contratto con un quindicenne: per questo la dichiarazione 14+ e, per NOI/comunicazioni, il consenso. |
| 4 | L'art. 8 si applica? | Riguarda «servizi della società dell'informazione», cioè normalmente prestati a pagamento [F2 §128 nota 62]; non si applica a servizi chiaramente solo per adulti [F2 §130]. | Non so se un servizio gratuito di uno studente rientri nella definizione (la Corte ha ammesso in altri casi una remunerazione indiretta, non verificato). Per prudenza applico la soglia 14. |
| 5 | Esenzione domestica | Art. 2.2.c e considerando 18 [F1]; comunicato CGUE C-25/17 sui Testimoni di Geova (la raccolta di dati porta a porta non è domestica) [F15, secondaria]. | Non ho letto Lindqvist (C-101/01) né altra giurisprudenza: la mia lettura è che un sito pubblico che raccoglie email non sia domestico. |
| 6 | `localStorage` e Garante | Le linee guida cookie 2021 (parte letta, 100.000 su ~134.000 caratteri) non nominano `localStorage` né IndexedDB; parlano di «altri strumenti» [F5 §3]. EDPB: l'uso locale senza invio non è «accesso» [F4 §44]. | Non ho letto la parte finale del documento del Garante. Conclusione operativa (archiviazione tecnica, nessun banner) è mia sintesi coerente con F4 e F5 §5. |
| 7 | Invio in background di dati salvati | Il codice del sito che invia al server informazioni già salvate nel terminale è «accesso» [F4 §§33, 52-53]. | Non è chiaro se un invio ritentato dopo un gesto esplicito dell'utente rientri nell'eccezione «strettamente necessario al servizio richiesto». Mia lettura: sì. Da far confermare. |
| 8 | Legittimo interesse per statistiche | Considerando 47: serve prova delle ragionevoli aspettative [F1]. Il Garante ha escluso il legittimo interesse per i cookie di tracciamento (riassunto di F5 §5, non confermato nel testo). | Per le statistiche aggregate di un servizio gratuito il Garante può essere più tollerante: non ho trovato un provvedimento specifico. Evito di appoggiarmici. |
| 9 | Provenienza e corso come «statistica» | Le fonti non dicono come trattare campi facoltativi non necessari se non con consenso o altra base [F2]. | Opzioni: eliminarli (consigliato) o chiederli con consenso distinto. |
| 10 | Soft spam per email di iscritti gratuiti | La Cassazione 7555/2023 lo esclude per registrazione/servizio gratuito [F7 secondaria]; il Garante limita l'art. 130.4 a email e servizi analoghi di chi ha acquistato [F6 §2.7]. | Ho letto la sentenza solo tramite un commento; il Garante tramite un riassunto. Se un giorno ci fossero acquisti, il quadro cambia (non è il caso: niente monetizzazione). |
| 11 | Marketing per due «brand» (Project e Agorà) | Il Garante richiede un consenso distinto per comunicazioni a terzi e per profilazione [F6 §2.6.3]. | Se Project e Agorà sono lo stesso titolare (l'autore), un unico consenso con informativa chiara dovrebbe bastare; se un giorno Agorà è di altri, serve consenso separato. |
| 12 | Tempi di conservazione | Servono un periodo o i criteri (art. 13.2.a [F1]); nessuna fonte consultata fissa un periodo per questo tipo di dati. | I 24 mesi di inattività e la gestione della prova del consenso sono proposte mie, non obblighi. |
| 13 | DPF dopo la sentenza | Tribunale UE ha respinto il ricorso il 3 settembre 2025; appello C-703/25 P depositato il 31 ottobre 2025 [F12 secondaria]. | Non ho verificato l'esito dopo fine 2025: ricontrollare. Per questo l'informativa dichiara anche le clausole tipo. |
| 14 | DSA, Data Act, DPIA, DPO, D.Lgs. 70/2003 | Non letti. | Vedi §2 e §6: segnalati come punti da far verificare. |
| 15 | Testi del Codice privacy | Ho letto art. 2-quinquies, 122, 130 solo tramite Brocardi (riassunti), non il testo ufficiale in Normattiva/Gazzetta Ufficiale [F8]. | Prima di citare in app o a terzi, riscontrare con Normattiva. |
| 16 | Dove sono i dati D1 | Docs Cloudflare (snippet di ricerca): giurisdizione UE solo alla creazione [F11]. | Non ho letto la pagina intera né verificato i comandi di Wrangler. |

**Da far verificare a un professionista** (come dice CLAUDE.md: si scrive qui, non nell'app): (a) base giuridica di NOI (punto 2) e testo finale delle caselle; (b) informativa completa e testi legali; (c) l'obbligo di indicare un domicilio per un sito che offre servizi online (punto 14); (d) tempi di conservazione e gestione della prova del consenso; (e) DPIA/DPO; (f) clausole e DPA effettivamente accettati con Google e Cloudflare; (g) il DPF dopo il ricorso; (h) minori: soglia 14 anni e disponibilità dell'account sotto quella età.

---

## 8. Sequenza di lavoro consigliata per chi coordina (nessuna modifica fatta da me)

1. Toccare il funnel (`Onboarding.tsx`, `registrazione.tsx`, `profilo.ts`, `coda.ts`) per rispettare le regole 1-5 e 20; eliminare `percorso`/`provenienza`/`consensi` dal funnel (o tenerli solo se locali).
2. Spostare le caselle in `ProjectId.tsx` (comunicazioni, con doppio passaggio) e `Noi.tsx` (classifica), togliere il consenso e i permessi ATLAS/`progress.share` (regole 8, 14, 17).
3. ATLAS (Worker): iscrizione pubblica (`POST /v1/signups`) solo per le comunicazioni con conferma via link; un solo registro dei consensi; cancellazione/disiscrizione con link firmato; migrazione per togliere colonne inutili; D1 in giurisdizione UE.
4. `config/offer.ts`: titolare con nome e cognome e recapito; sostituire i testi legali (§5.4); aggiornare `CONSENT_VERSION` e le FAQ.
5. Prima di dire «fatto»: `npm run check` (CLAUDE.md) e prova in Chromium a 400 e 1280 px, tema chiaro e scuro, zero errori in console, con verifica che all'avvio **nessuna richiesta di rete verso ATLAS o Google** parta (pannello rete) e che con tutte le caselle spente il comportamento sia identico.

---

## 9. Fonti consultate

Livello di lettura: **letta** = testo scaricato ed estratto in locale e riletto; **riassunto** = pagina web letta tramite riassunto automatico (può omettere dettagli); **secondaria** = articolo o commento di terzi; **non letta** = indicata ma non aperta.

- **F1 (letta)** Regolamento (UE) 2016/679, testo italiano «arricchito» con i considerando, aggiornato alle rettifiche GUUE 127 del 23 maggio 2018, pubblicato dal Garante: https://www.garanteprivacy.it/documents/10160/0/Regolamento+UE+2016+679.+Arricchito+con+riferimenti+ai+Considerando+Aggiornato+alle+rettifiche+pubblicate+sulla+Gazzetta+Ufficiale++dell%27Unione+europea+127+del+23+maggio+2018.pdf/1bd9bde0-d074-4ca8-b37d-82a3478fd5d3?version=1.9 (indice: https://www.garanteprivacy.it/garante/document?ID=6264597; versione EUR-Lex: https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=uriserv:OJ.L_.2016.119.01.0001.01.ITA , non apribile da questa sessione). Articoli e considerando usati: 2.2.c, 4.11, 5, 6, 7, 8, 12, 13, 17, 20, 21, 25, 28, 30, 33, 45, considerando 18, 32, 38, 43, 47.
- **F2 (letta)** EDPB, Linee guida 05/2020 sul consenso ai sensi del Regolamento 2016/679, versione 1.1 (4 maggio 2020), copia ospitata dal Garante rumeno: https://www.dataprotection.ro/servlet/ViewDocument?id=2491 (originale EDPB: https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en). Paragrafi citati: 25-45 (subordinazione e granularità), 46-54 (pregiudizio), 64-65 (informato), 75-82 (azione positiva, caselle preselezionate), 112-118 (revoca), 124-135 (minori).
- **F3 (letta)** EDPB, Linee guida 4/2019 sull'articolo 25, versione 2.0 (20 ottobre 2020): https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_201904_dataprotection_by_design_and_by_default_v2.0_en.pdf (§§46-58).
- **F4 (letta)** EDPB, Linee guida 2/2023 sull'ambito tecnico dell'art. 5.3 della direttiva ePrivacy, versione 2.0 (7 ottobre 2024): https://edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf (§§32-34, 44, 52-53).
- **F5 (riassunto, 100.000 su ~134.000 caratteri)** Garante, Linee guida cookie e altri strumenti di tracciamento, 10 giugno 2021: https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876 (§§3-5).
- **F6 (riassunto)** Garante, Linee guida in materia di attività promozionale e contrasto allo spam, 4 luglio 2013 (provv. n. 330, doc. web 2542348): https://www.garanteprivacy.it/home/docweb/-/docweb-display/print/2542348 (§§2.4-2.7). Il Garante ha adottato in parallelo un provvedimento generale sul consenso al marketing (doc. web 2543820, non letto). Non ho verificato se le linee guida siano state aggiornate dopo il 2018.
- **F7 (secondaria)** Cass. civ., sez. II, 15 marzo 2023, n. 7555 (soft spam e registrazione gratuita): sintesi in https://www.diritto.it/?p=201888 ; commenti collegati: https://www.diritto.it/newsletter-marketing-cassazione-trattamento-dati/ . Sulla linea del Garante su «consenso unico» e granularità (orientamento citato come costante e ordinanze, non lette per intero): https://www.cybersecurity360.it/?p=85719 , https://garanteprivacy.it/garante/doc.jsp?ID=4337465 , https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2952211 , https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/2974595 (**non lette**, emerse dalla ricerca).
- **F8 (secondaria)** D.Lgs. 196/2003 (Codice privacy), riassunti di Brocardi (testo non ufficiale, aggiornato al 20/02/2026 secondo la pagina): art. 2-quinquies https://www.brocardi.it/codice-della-privacy/parte-i/titolo-i/capo-ii/art2quinquies.html ; art. 122 https://www.brocardi.it/codice-della-privacy/parte-ii/titolo-x/capo-i/art122.html ; art. 130 https://www.brocardi.it/codice-della-privacy/parte-ii/titolo-x/capo-i/art130.html . Testo ufficiale: Normattiva/Gazzetta Ufficiale (**non consultata**). L'art. 111-bis citato nella richiesta riguarda la ricezione di curricula e non è pertinente: non letto.
- **F9 (letta)** Google, «Privacy and Security in Firebase»: https://firebase.google.com/support/privacy (ruolo di responsabile; DPF di Google LLC; «The Firebase Authentication service is run only from US data centers»). Termini: https://firebase.google.com/terms/data-processing-terms (solo snippet di ricerca).
- **F10 (letta)** Cloudflare, GDPR / Trust Hub: https://www.cloudflare.com/trust-hub/gdpr/ (DPA incorporato nell'accordo self-serve; clausole tipo; DPF). DPA: https://www.cloudflare.com/cloudflare-customer-dpa/ (solo snippet).
- **F11 (snippet)** Cloudflare, D1 «Data location»: https://developers.cloudflare.com/d1/configuration/data-location/ ; changelog giurisdizione: https://developers.cloudflare.com/changelog/post/2025-11-05-d1-jurisdiction/index.md
- **F12 (secondaria)** Latombe v Commissione (T-553/23), sentenza del 3 settembre 2025 e appello C-703/25 P: https://digitalpolicyalert.org/event/35459-latombe-filed-appeal-against-general-court-dismissal-of-challenge-to-european-unionunited-states-data-protection-framework-adequacy-decision-in-latombe-v-commission ; https://www.ebglaw.com/workforce-bulletin/adequacy-of-the-eu-u-s-data-privacy-framework-survives-challenge
- **F13 (secondaria)** Garante, FAQ sul registro delle attività di trattamento (2018): https://garanteprivacy.it/garante/document?ID=9047529 (snippet di ricerca).
- **F14 (snippet)** CGUE, Planet49 (C-673/17, 1 ottobre 2019, caselle preselezionate e consenso per cookie): https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-10/cp190125en.pdf . Non l'ho usata come fonte determinante (confermano già art. 4.11, considerando 32, F2 §79).
- **F15 (secondaria)** CGUE, C-25/17 (Jehovan todistajat, 10 luglio 2018): comunicato https://curia.europa.eu/jcms/upload/docs/application/pdf/2018-07/cp180103hu.pdf (snippet).
- Repository letto: `CLAUDE.md`, `docs/lavoro/extra/BRIEF-PROGETTO.md`, `atlas/README.md`, `atlas/DEPLOY.md`, `atlas/migrations/0002_signups.sql`, `atlas/src/{index,signups,limite,scopes}.ts` (parti), `app/src/legal/{base,privacy,termini,cookie}.ts`, `app/src/screens/extra/progetto/{registrazione,ProjectId,Noi,Agora,AtlasAnalisi}.tsx`, `app/src/lib/progetto/{informativa,profilo,coda,verificaEmail}.ts`, `app/src/components/Onboarding.tsx` (parti), `app/src/lib/firebase.ts` (parti), `app/src/lib/servizi/faq.ts` (parti), `app/src/config/offer.ts`.
- **Non consultate** (e quindi non usate per affermazioni): Digital Services Act (Reg. UE 2022/2065), Data Act (Reg. UE 2023/2854), art. 35 e 37 GDPR, elenco del Garante dei trattamenti soggetti a DPIA, D.Lgs. 70/2003, Codice civile, EDPB 1/2024 sul legittimo interesse, Garante su tempi di conservazione, Normattiva.
