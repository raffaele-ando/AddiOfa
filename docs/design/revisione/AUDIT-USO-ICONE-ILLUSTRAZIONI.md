# Audit: una icona / una illustrazione = un solo significato

Agente AUDIT-USO, 31/10/2026. Verifica di sola lettura su `app/src` (nessuna modifica al codice dell'app, nessun git, nessun file cancellato). Ho lanciato `node tools/genera-icone.mjs` (lo script riscrive i file generati; è deterministico e non ho usato git per confermare che i byte siano identici; esito: «145 icone, 145 file svg», nessun doppione di icona lucide nel registro) e `python3 tools/controlla-illustrazioni.py` (solo lettura). Le correzioni qui sotto sono PROPOSTE: non applicate.

Regola applicata: è violazione quando lo stesso asset serve funzioni, voci o categorie diverse (anche: stato usato come azione; più elementi di una lista con la stessa immagine). Non è violazione lo stesso significato in più schermate né la stessa icona ripetuta nella stessa funzione. I kit blu e luminoso contano come lo stesso soggetto.

## (a) Numeri

| | Icone | Illustrazioni |
|---|---|---|
| Nel registro / nel catalogo spedito | 145 nomi (145 file svg) | 31 disegni del kit blu usati + 3 immagini della landing + marchio |
| Distinte effettivamente usate nell'app | **117** | **31** disegni del kit (22 `illustrazioni` + 9 `stati`; il kit luminoso ne ripete 5 come stesso soggetto) + 3 immagini landing (scena hero, banner edificio, sfondo CTA) + il marchio |
| OK (un solo significato) | **101** | **18** righe della tabella (14 disegni del kit + 3 immagini landing + marchio) |
| VIOLAZIONE | **16** | **17** disegni del kit |
| Non usate (nessun punto di uso raggiungibile) | 28 | kit-blu: `quiz-test-lista`, `composizione-tre`, `risultato-probabilita`, `stati/caricamento`, `stati/messaggi`, `stati/notifica`, tutte le sfere (vietate); kit rosso solo catalogo |

Elementi in lista che condividono l'immagine (il tipo di problema che chiedeva la verifica):

- **31 lezioni di teoria condividono 7 immagini** (una per famiglia: Tempi 8 lezioni, Chi e dove 7, Condizionali e modali 6, Discorso 4, Domande 2, Confronti 2, Altro 2), e quelle 7 immagini servono anche ad altro (stati di caricamento, badge, avatar, onboarding).
- **19 badge condividono 12 immagini**; i 3 badge di costanza hanno tutti `piano-superamento`; 11 di quelle immagini sono anche avatar scelti dall'utente.
- **Home «Le tue aree»**: i 3 livelli A1/A2/B1 hanno la stessa icona (`livello`).
- **Project ID, riepilogo del percorso di studi**: Scuola, Livello di studi e Anno hanno la stessa icona (`livello`); Sede usa `home`; Corso usa `lezioni`.
- **4 scuole, 4 provenienze**: non condividono un'immagine fra le voci (sono carte di solo testo con lo stesso segno di selezione `stato-risposta-giusta`); condivide invece l'illustrazione di testata ogni passo, vedi (c). Il segno di selezione è un'icona di «risposta giusta» riusata come «scelto» (vedi `stato-risposta-giusta`).
- **Landing «Se non superi»**: le 4 carte hanno 4 illustrazioni diverse (OK).

Dopo le correzioni proposte in (d) rimarrebbero in uso le stesse 31 illustrazioni, ma ognuna con un solo significato; per le lezioni, i badge e gli avatar non c'è abbastanza grafica esistente non usata (vedi (d1), (d4), (d5): «serve nuova grafica» o «meglio nessuna illustrazione»).

## (b) Icone

Colonna «usi»: `file:riga → significato`; per le icone senza violazione un solo significato e un campione di righe. «Correzione» = icona DIVERSA già esistente nel registro (o lucide, verificata presente in `lucide-react`) da assegnare a un nuovo nome semantico.

| nome | usi (file:riga → significato) | verdetto | correzione proposta / nota |
|---|---|---|---|
| `amici` | Community (Profilo:190) ≠ lista Amici/rivali (SfidaAccetta:70) ≠ «Classifica tra amici» (Noi:138). [Profilo.tsx:190, Noi.tsx:138, SfidaAccetta.tsx:70] | **VIOLAZIONE** | Profilo:190 → nuova `community` = lucide `network`; Noi:138 → `classifica` (trophy, già nel registro e oggi inutilizzata); `amici` resta solo per Amici (SfidaAccetta:70). |
| `blocco` | «limite/vincolo»: piano di studi limitato (Onboarding:310, landing dati:14); badge non sbloccato (Badge:28); permesso «Necessario» (ProjectId:247). [Onboarding.tsx:310, Badge.tsx:28, ProjectId.tsx:247, dati.tsx:14] | **VIOLAZIONE** | ProjectId:247 «Necessario» → nessuna icona (basta la parola) o `asterisk`; gli altri 3 usi (limitato/bloccato) restano. |
| `condividi` | condividere un risultato/link (FoglioCondividi:80, SfidaRisultato:121) ≠ riga «Come ci hai conosciuto» (ProjectId:131) ≠ «Invia ad ATLAS» (ProjectId:146, ambiguo). [ProjectId.tsx:131, ProjectId.tsx:146, FoglioCondividi.tsx:80, SfidaRisultato.tsx:121] | **VIOLAZIONE** | ProjectId:131 (provenienza) → nuova `provenienza` = lucide `megaphone`. ProjectId:146 resta (ambiguo, è un invio di dati). |
| `dettaglio` | tab «Dettaglio» e conteggio lista (StatsMode:194/264) ≠ «Indice» del documento legale (Legal:64). [StatsMode.tsx:194, StatsMode.tsx:264, Legal.tsx:64] | **VIOLAZIONE** | Legal:64 → nuova `indice` = lucide `table-of-contents`. |
| `home` | scheda Home (barra, menu desktop, «Torna alla Home», «Vai alla Home») ≠ riga «Sede» del percorso di studi (ProjectId:129). [7 punti, es. LearnMode.tsx:706, Menu.tsx:66, Navigazione.tsx:9, ProjectId.tsx:129, Offline.tsx:28] | **VIOLAZIONE** | ProjectId:129 → nuove icone di percorso: Sede = `map-pin` (vedi `livello`). |
| `livello` | livello CEFR A1/A2/B1: StatsMode:206, Profilo:124, Aree:9 (le 3 righe A1/A2/B1 della Home hanno la STESSA icona) ≠ ProjectId:129 (righe Scuola, Livello di studi e Anno: tutte `livello`). [CalcoloRisultato.tsx:26, StatsMode.tsx:206, Aree.tsx:9, Profilo.tsx:124, ProjectId.tsx:129] | **VIOLAZIONE** | ProjectId:129 → 5 icone diverse: Scuola `school`, Sede `map-pin`, Livello di studi `library-big`, Anno `calendar-range`, Corso `book-marked` (nuovi nomi `percorso-*`). Aree:9 → per i livelli usare il chip testuale A1/A2/B1 (`ChipLivello`) oppure `fiducia-bassa/media/alta` (signal-low/medium/high, già nel registro e inutilizzate, da rinominare `livello-a1/a2/b1`). |
| `presentazione` | «Cos'è AddiOFA» (landing, Profilo:199) ≠ «Apri su Instagram» (Agora:24). [Profilo.tsx:199, Agora.tsx:24] | **VIOLAZIONE** | Agora:24 → nuova `instagram` = lucide `instagram` (o `external-link`). |
| `privacy` | pagina Privacy (ICONE_LEGALI; ProjectId:174 «Informativa privacy») ≠ riga dati «Consensi» (ProjectId:132). [ProjectId.tsx:132, ProjectId.tsx:174, Footer.tsx:9] | **VIOLAZIONE** | ProjectId:132 → nuova `consensi` = lucide `toggle-right`. |
| `probabilita` | stima della probabilità (Onboarding:42) ≠ vantaggio «Scopri il tuo livello» (il test di livello, landing Vantaggi:9). [Onboarding.tsx:42, Vantaggi.tsx:9] | **VIOLAZIONE** | Vantaggi:9 → `diagnostico` (è il test di livello). |
| `sfide` | sezione/scheda «Sfide» (Navigazione:11, Menu:68, TelefonoPassi:102, «Vai alle sfide» SfidaRisultato:61, SfidaAccetta:26, Condividi:17) ≠ DUELLO (riga duello Sfide:23, «Sfida un amico» Sfide:100 e Amici:86/110, conteggio «N duelli» Classifica:87, intestazione del duello SfidaGioco:272). [12 punti, es. Menu.tsx:68, Navigazione.tsx:11, Amici.tsx:110, Amici.tsx:86, Classifica.tsx:87] | **VIOLAZIONE** | Duelli → nuova `duello` = lucide `git-compare-arrows` (confronto a due) in Sfide:23, Sfide:100, Amici:86, Amici:110, Classifica:87, SfidaGioco:272. `sfide` (swords) resta solo per scheda/«Vai alle sfide». |
| `stato-attenzione` | avviso: Home Stima «partenza/margine» (Stima:24/25), «Da migliorare» (Aree:36), «Sotto soglia» (PanoramicaProgressi:143), «Stima provvisoria» (AtlasAnalisi:100), «Non inviata» (Segnala:78), «Sotto soglia» (Simulazione:42) MA ANCHE errori veri: errore di campo (sfide/comuni:59), «Non riesco a creare il link» (SfidaRisultato:125), «Non riesco a caricare le correzioni» (SfidaRisultato:38). [14 punti, es. Onboarding.tsx:51, Aree.tsx:36, Simulazione.tsx:42, Stima.tsx:24, Stima.tsx:25] | **VIOLAZIONE** | sfide/comuni:59 e SfidaRisultato:125 → `stato-errore` (octagon-x, è errore non avviso). Gli altri usi (avviso) restano. |
| `stato-ok` | «esito positivo»: Toast ok, «Superata» (RiepilogoEsito:32, Simulazioni:28), «Verificata» (registrazione:122), «Raggiunto» (Obiettivi:66/108), badge ottenuto (Badge:27), «Nessun errore» (Onboarding:247, StatsMode:228, PanoramicaProgressi:248), «Soglia raggiunta» (TelefonoPassi:89), «Copiato» (Segnala:43) MA ANCHE il comando «Salva» (ProfiloModifica:25, AZIONE) e il segno di avatar selezionato (ProfiloModifica:37, SELEZIONE). [21 punti, es. CalcoloRisultato.tsx:46, Onboarding.tsx:247, Onboarding.tsx:50, StatsMode.tsx:228, Toast.tsx:16] | **VIOLAZIONE** | ProfiloModifica:25 «Salva» → nuova `salva` = lucide `save`; ProfiloModifica:37 (selezionato) → `stato-incluso` (circle-check-big, inutilizzata) rinominata `selezionato`, la stessa che serve a ui.tsx:153 (vedi `stato-risposta-giusta`). |
| `stato-risposta-giusta` | risposta giusta (LearnMode:527/637, CorrezioniComplete, Theory:182, studio/comune:89, StatsMode:65) MA ANCHE: «selezionato» nelle liste di scelta (ChoiceCard, ui.tsx:153: scuola, sede, livello, provenienza), «fatta» della sfida del giorno (Sfide:86), fascia Home «In linea» (Stima:27), «hai risposto a tutte» (SfidaGioco:276). [13 punti, es. LearnMode.tsx:527, LearnMode.tsx:637, StatsMode.tsx:65, CorrezioniComplete.tsx:116, CorrezioniComplete.tsx:136] | **VIOLAZIONE** | ui.tsx:153 → `stato-incluso` rinominata `selezionato`; Sfide:86 → `stato-ok`; Stima:27 (strada) → `stato-ok`. SfidaGioco:276 resta (conteggio risposte). |
| `studia` | «avvia»: studio/allenamento (LearnMode:174/702, Cta:17, Lezione:51, Esercizi:101/139, Progressi:35, ProgressiArgomenti:57, AtlasAnalisi:79, Offline:37, TelefonoPassi:50, Percorso:78, LezioneDettaglio:79) MA ANCHE: avvio simulazione (Simulazione:69, Simulazioni:49), avvio sfida (Sfide:93, SfidaGioco:217, SfidaAccetta:128), «Crea link» (Sfide:119), «Riprendi da dove eri» (Offline:27), «Lezione successiva» (LezioneDettaglio:97). [21 punti, es. LearnMode.tsx:174, LearnMode.tsx:702, Cta.tsx:17, Lezione.tsx:51, Simulazione.tsx:69] | **VIOLAZIONE** | Simulazione:69 e Simulazioni:49 → `simulazioni`; Sfide:93 → `sfida-giorno`; SfidaGioco:217 → `sfida-giorno` o `duello`; SfidaAccetta:128 → `duello`; Sfide:119 → nuova `crea-link` = lucide `link-2` (file svg già presente); Offline:27 → `indietro`; LezioneDettaglio:97 → `avanti`. |
| `suggerimento` | SUGGERIMENTO prima di rispondere (LearnMode:463) e CONSIGLIO «Per il test» (Theory:199) ≠ SPIEGAZIONE dopo la risposta (CorrezioniComplete:148, Theory:186 «Perché», Frasi:139). [LearnMode.tsx:463, CorrezioniComplete.tsx:148, Theory.tsx:186, Theory.tsx:199, Frasi.tsx:139] | **VIOLAZIONE** | Le tre spiegazioni → `spiegazioni` (message-square-text, già nel registro). `suggerimento` resta per suggerimento/consiglio. |
| `trend-uguale` | trend invariato (StatsMode:354) ≠ «Pari» nel duello (sfide/comuni:76) ≠ banda «Da migliorare» (ProgressiArgomenti:69) ≠ «Priorità media» (AtlasAnalisi:46). [StatsMode.tsx:354, ProgressiArgomenti.tsx:69, AtlasAnalisi.tsx:46, comuni.tsx:76] | **VIOLAZIONE** | sfide/comuni:76 → nuova `stato-pari` = lucide `handshake` (è `garanzia`, inutilizzata: rinominarla); ProgressiArgomenti:69 e AtlasAnalisi:46 → `stato-medio` (gauge, inutilizzata). |
| `accuratezza` | percentuale di accuratezza della domanda (StatsMode). [StatsMode.tsx:349] | OK |  |
| `app` | riga «Versione» delle Impostazioni. [Impostazioni.tsx:113] | OK |  |
| `argomenti` | intestazione «Argomenti/Aree» dell'esito (2 punti identici). [EsitoSimulazione.tsx:96, SimulazioneDettaglio.tsx:99] | OK |  |
| `ascolta` | pronuncia di una frase (alterna con `ferma`: stesso pulsante, stato attivo). [Frasi.tsx:113] | OK |  |
| `avanti` | freccia «vai/apri/prosegui»: chevron di riga (apri dettaglio), «Avanti» alla domanda successiva, mese successivo, freccia dei pulsanti d'invito. [39 punti, es. ExamMode.tsx:434, LearnMode.tsx:548, LearnMode.tsx:665, ConfrontoPrecedente.tsx:21, InfoPunteggio.tsx:43] | OK | Ambiguo (opinione): è un glifo direzionale unico e coerente, non lo tratto come violazione. Distinguere «apri riga» da «domanda successiva» sarebbe eccesso. |
| `cancella` | eliminare/togliere: dati del dispositivo, account Project ID, bozza Segnala, amico dall'elenco. [Impostazioni.tsx:100, ProjectId.tsx:175, ProjectId.tsx:240, Segnala.tsx:152, Amici.tsx:58] | OK | Ambiguo (opinione): la stessa icona per «Cancella dal dispositivo» (ProjectId:175) ed «Elimina Project ID» (ProjectId:240), nella stessa schermata, due gravità diverse; accettabile perché entrambe sono «elimina», ma si potrebbe dare `senza-account` (user-x) all'eliminazione dell'account. |
| `cerca` | campo di ricerca (5 campi). [CheatSheet.tsx:19, registrazione.tsx:218, registrazione.tsx:307, Faq.tsx:53, Frasi.tsx:60] | OK |  |
| `certificazione` | domanda «Hai una certificazione?» (Onboarding:379). [Onboarding.tsx:379] | OK |  |
| `chiudi` | chiudi/annulla/svuota (X): chiusura di fogli e schermate, «Cancella la ricerca», «Esci senza salvare», «Togli l'obiettivo». [16 punti, es. CheatSheet.tsx:26, CheatSheet.tsx:48, ExamMode.tsx:336, ExamMode.tsx:387, FoglioStima.tsx:81] | OK |  |
| `classifica-noi` | classifica NOI (ClassificaNoi:15). [ClassificaNoi.tsx:15] | OK |  |
| `cookie` | pagina Cookie (ICONE_LEGALI). [Footer.tsx:10] | OK |  |
| `copia` | copiare testo/link/progressi (4 punti). [Impostazioni.tsx:99, ProjectId.tsx:393, Segnala.tsx:150, Segnala.tsx:43, FoglioCondividi.tsx:91] | OK |  |
| `correzioni` | rivedere le correzioni; anche «Vedi il risultato» (SfidaAccetta:83/96) che porta alla pagina del risultato. [8 punti, es. CorrezioniComplete.tsx:61, EsitoSimulazione.tsx:86, SfidaAccetta.tsx:69, SfidaAccetta.tsx:83, SfidaAccetta.tsx:96] | OK | Ambiguo (opinione): su SfidaAccetta:83/96 il testo dice «risultato», l'icona dice «correzioni»; la pagina di arrivo contiene le correzioni, quindi lo lascio. |
| `costo` | costo di un nuovo tentativo (Onboarding:309, landing dati:13). [Onboarding.tsx:309, dati.tsx:13] | OK |  |
| `data-test` | data del test nel calendario (2 punti). [ProgressiCalendario.tsx:108, ProgressiCalendario.tsx:117] | OK |  |
| `diagnostico` | «Test di livello» (tab e 5 pulsanti). [7 punti, es. StatsMode.tsx:189, stima.ts:176, Obiettivi.tsx:80, Progressi.tsx:34, Progressi.tsx:44] | OK |  |
| `documento` | pagina Termini (ICONE_LEGALI). [Footer.tsx:8] | OK |  |
| `email` | email: dato «Email PoliMi» (ProjectId:125), invio del link di verifica (ProjectId:139, registrazione:167), riga novità via email (Agora:30). [Agora.tsx:30, ProjectId.tsx:125, ProjectId.tsx:139, registrazione.tsx:167] | OK | Ambiguo: 3 contesti, un solo concetto (posta). Lo lascio. |
| `errori` | sezione «Errori» (StatsMode:226), vantaggio «Ripassa i tuoi errori» (landing Vantaggi:11). [StatsMode.tsx:226, Vantaggi.tsx:11] | OK |  |
| `esci` | uscire da Project ID (ProjectId:239). [ProjectId.tsx:239] | OK |  |
| `esercizi` | scheda Esercizi (barra e menu desktop) e passo «Esercizi» della lezione (LezioneDettaglio:76). [Menu.tsx:67, Navigazione.tsx:10, LezioneDettaglio.tsx:76, TelefonoPassi.tsx:102] | OK |  |
| `espandi` | apri/chiudi (chevron giù, ruota di 180°): accordion, «Mostra tutti», elenco domande. [9 punti, es. ExamMode.tsx:430, CorrezioniComplete.tsx:148, Legal.tsx:65, ProgressiArgomenti.tsx:85, AtlasAnalisi.tsx:108] | OK |  |
| `esporta` | esporta (Impostazioni:98, ProjectId:173). [Impostazioni.tsx:98, ProjectId.tsx:173] | OK |  |
| `faq` | Domande frequenti (Profilo:197). [Profilo.tsx:197] | OK |  |
| `ferma` | stop della pronuncia (stato dello stesso pulsante di `ascolta`). [Frasi.tsx:113] | OK |  |
| `filtro` | filtro dell'elenco (StatsMode:268). [StatsMode.tsx:268] | OK |  |
| `filtro-tutte` | filtro «Tutte» (Frasi:19). [Frasi.tsx:19] | OK |  |
| `frasi` | Frasi utili (Esercizi:146) e area «Traduzione» (Aree:9). [Aree.tsx:9, Esercizi.tsx:146] | OK | Ambiguo (opinione): «Traduzione» e «Frasi con traduzione» sono lo stesso concetto, lo lascio. |
| `giorni-studio` | giorni di studio (ProgressiCalendario:138). [ProgressiCalendario.tsx:138] | OK | Nota visiva: `calendar-check` e `calendar-check-2` (sfida-giorno) sono quasi indistinguibili a 16 px. |
| `imparate` | conteggio domande imparate (Lezione:47). [Lezione.tsx:47] | OK |  |
| `importa` | importa i progressi (Impostazioni:96). [Impostazioni.tsx:96] | OK |  |
| `impostazioni` | ingranaggio nel Profilo (Profilo:69). [Profilo.tsx:69] | OK |  |
| `incolla` | «Ho ricevuto una sfida: incolla il link» (Sfide:101). [Sfide.tsx:101] | OK |  |
| `indietro` | indietro/precedente (chevron sinistro): testate, pulsanti «Indietro», mese precedente, domanda precedente. [19 punti, es. ExamMode.tsx:308, ExamMode.tsx:426, LearnMode.tsx:175, LearnMode.tsx:192, StatsMode.tsx:263] | OK | Ambiguo come `avanti`: lo lascio. |
| `info` | «i» di informazione: pulsante info, nota (`Nota` usa sempre `info`), toast informativo; registrazione:129 «Da verificare» è uno stato. [7 punti, es. Toast.tsx:16, GraficoStime.tsx:32, Misuratore.tsx:103, ProgressiArgomenti.tsx:91, registrazione.tsx:129] | OK | Ambiguo: registrazione:129 (stato «Da verificare») dovrebbe usare `stato-attesa` o `stato-attenzione`; è 1 solo punto, non cambia il verdetto. |
| `lezioni` | riga «Corso» e «Percorso di studi» in ProjectId:129/130 (corso di laurea, non le lezioni dell'app). [ProjectId.tsx:129, ProjectId.tsx:130] | OK | Ambiguo: unico uso, ma il nome del registro («lezioni») non corrisponde al significato («corso di studi»). Sparisce con la correzione di `livello` (Corso → `book-marked`). |
| `menu` | apri il menu della landing (Barra:107). [Barra.tsx:107] | OK |  |
| `messaggi` | canale «Messaggi» (SMS) del foglio di condivisione. [FoglioCondividi.tsx:23, FoglioCondividi.tsx:27] | OK |  |
| `modifica` | modifica (3 punti). [ProjectId.tsx:148, ProjectId.tsx:354, registrazione.tsx:148] | OK |  |
| `modo-argomento` | modalità «Per argomento». [Esercizi.tsx:116, TelefonoPassi.tsx:43] | OK |  |
| `modo-blitz` | modalità Blitz. [Esercizi.tsx:43, TelefonoPassi.tsx:42] | OK |  |
| `modo-punti-deboli` | modalità «Punti deboli» (anche pulsante Atlas «Allenati sui punti deboli» e vantaggio onboarding). [Onboarding.tsx:43, Esercizi.tsx:42, AtlasAnalisi.tsx:251, TelefonoPassi.tsx:42] | OK |  |
| `modo-richiamo` | modalità Richiamo. [Esercizi.tsx:44, TelefonoPassi.tsx:43] | OK |  |
| `obiettivi` | Obiettivi (pagina e sezione del Profilo). [Obiettivi.tsx:61, Profilo.tsx:138] | OK |  |
| `opzioni` | «Mostra le opzioni» (LearnMode:472). [LearnMode.tsx:472] | OK |  |
| `ordina` | ordinamento (StatsMode:283). [StatsMode.tsx:283] | OK |  |
| `percorso` | «Apri il percorso» (LezioneDettaglio:45). [LezioneDettaglio.tsx:45] | OK |  |
| `preferita` | preferita (stella; variante piena = attiva). [Frasi.tsx:132, Frasi.tsx:20] | OK |  |
| `profilo` | profilo/persona: pulsante nella testata (Menu:136, ui.tsx:233) e riga «Nome» (ProjectId:127). [Menu.tsx:136, ProjectId.tsx:127, ui.tsx:233] | OK | Ambiguo: «Nome» con l'icona del profilo è accettabile (persona). |
| `progressi` | fascia Home «Vicino alla soglia» (Stima:26), unico uso. [Stima.tsx:26] | OK | Nota: il nome («progressi») non coincide con l'uso (stato della stima), ma il significato è uno solo. |
| `projectid` | Project ID/account: scheda nel Profilo, «Accedi con Google», pulsante in NOI. [Profilo.tsx:89, Agora.tsx:30, Noi.tsx:137, ProjectId.tsx:202] | OK | Ambiguo: l'icona è anche il comando di accesso (ProjectId:202); è lo stesso oggetto (l'account), lo lascio. |
| `prontuario` | Riepilogo di grammatica (Esercizi:147). [Esercizi.tsx:147] | OK |  |
| `riprova` | riprovare dopo un errore (12 punti) e «Rifai la simulazione» (EsitoSimulazione:90). [13 punti, es. ErrorBoundary.tsx:70, ExamMode.tsx:307, ExamMode.tsx:335, LearnMode.tsx:191, LearnMode.tsx:549] | OK | Ambiguo: «Rifai la simulazione» non è un riprovare dopo un errore; stesso concetto di ripetizione, lo lascio. |
| `risposte` | conteggio risposte/domande (anche filtro «Tutte» in CorrezioniComplete:16). [13 punti, es. CalcoloRisultato.tsx:25, FoglioStima.tsx:95, CorrezioniComplete.tsx:16, Fattori.tsx:19, Lezione.tsx:45] | OK | Ambiguo: sta sia per «risposte date» sia per «N domande»; stesso oggetto (la domanda con risposta). |
| `salta` | «Salta» (LearnMode:555, Onboarding:417). [LearnMode.tsx:555, Onboarding.tsx:417] | OK |  |
| `scollega` | scollega AddiOFA da Project ID. [ProjectId.tsx:238] | OK |  |
| `segnala` | segnalare un problema/idea (ErrorBoundary, Profilo, BottoneSegnala, Faq, form). [ErrorBoundary.tsx:71, Profilo.tsx:198, BottoneSegnala.tsx:21, Faq.tsx:72, Segnala.tsx:131, Segnala.tsx:86] | OK | Nota: Faq:72 «Scrivici un'idea» usa `segnala` invece di `segnala-idea` (stesso significato: lo lascio). |
| `segnala-app` | tipo di segnalazione «Problema dell'app». [Segnala.tsx:118, Segnala.tsx:20] | OK |  |
| `segnala-domanda` | tipo di segnalazione «Domanda». [Segnala.tsx:109, Segnala.tsx:18] | OK |  |
| `segnala-idea` | tipo di segnalazione «Idea». [Segnala.tsx:21] | OK |  |
| `segnala-spiegazione` | tipo di segnalazione «Spiegazione». [Segnala.tsx:19] | OK |  |
| `senza-account` | «Senza password» nella landing (comune.tsx:123). [comune.tsx:123] | OK |  |
| `serie` | serie di risposte giuste di fila (LearnMode:384/531). [LearnMode.tsx:384, LearnMode.tsx:531] | OK |  |
| `sfida-giorno` | Sfida del giorno (Sfide:23, SfidaGioco:272). [SfidaGioco.tsx:272, Sfide.tsx:23] | OK |  |
| `simulazioni` | simulazioni: scheda, vantaggi, statistiche, «Fai una simulazione», «Vai alle simulazioni». [8 punti, es. Onboarding.tsx:44, PanoramicaProgressi.tsx:90, ProgressiCalendario.tsx:123, Condividi.tsx:16, SimulazioneDettaglio.tsx:139] | OK |  |
| `soglia` | soglia 25/30 (righello): etichetta e badge «Sotto la soglia». [9 punti, es. CalcoloRisultato.tsx:27, FoglioStima.tsx:100, FoglioStima.tsx:88, Onboarding.tsx:308, RiepilogoEsito.tsx:32] | OK |  |
| `spiegazioni` | «Capisci perché, ogni risposta è spiegata» (landing Vantaggi:12): UNICO uso, mentre nell'app la spiegazione usa `suggerimento`. [Vantaggi.tsx:12] | OK | Vedi `suggerimento`: è l'icona giusta per le spiegazioni in app. |
| `stato-attesa` | «in attesa» (ProjectId:133, Amici:102, Sfide:28). [ProjectId.tsx:133, Amici.tsx:102, Sfide.tsx:28] | OK |  |
| `stato-basso` | fascia onboarding «Si parte da qui» (Onboarding:52). [Onboarding.tsx:52] | OK |  |
| `stato-caricamento` | spinner di caricamento (5 punti). [ExamMode.tsx:331, StatsMode.tsx:289, SfidaGioco.tsx:172, SfidaRisultato.tsx:34, SimulazioneDettaglio.tsx:117] | OK |  |
| `stato-da-iniziare` | «da iniziare/mai vista» (StatsMode:364, Percorso:17). [StatsMode.tsx:364, Percorso.tsx:17] | OK |  |
| `stato-da-ripassare` | «da ripassare» (5 punti). [LearnMode.tsx:642, LearnMode.tsx:677, ProgressiArgomenti.tsx:69, Frasi.tsx:126, Frasi.tsx:21] | OK |  |
| `stato-errore` | errore: toast, ProjectId:133 «rifiutata», StatsMode:293. [StatsMode.tsx:293, Toast.tsx:16, ProjectId.tsx:133] | OK |  |
| `stato-imparata` | «imparata/completata» (lezione, frase, domande imparate; passo «fatto» in LezioneDettaglio:25). [7 punti, es. LearnMode.tsx:656, Lezione.tsx:99, Frasi.tsx:126, Frasi.tsx:22, LezioneDettaglio.tsx:25] | OK |  |
| `stato-in-corso` | lezione «in corso» (Percorso:16). [Percorso.tsx:16] | OK |  |
| `stato-nuovo` | fascia Home «nuovo» (Stima:23). [Stima.tsx:23] | OK |  |
| `stato-perso` | esito duello «Perso» (sfide/comuni:77). [comuni.tsx:77] | OK |  |
| `stato-primo` | primo in classifica (Classifica:25) e «Migliore» (Simulazioni:57). [Classifica.tsx:25, Simulazioni.tsx:57] | OK |  |
| `stato-risposta-omessa` | risposta omessa/senza risposta (StatsMode, CorrezioniComplete, SfidaGioco:276). [StatsMode.tsx:65, CorrezioniComplete.tsx:123, CorrezioniComplete.tsx:18, CorrezioniComplete.tsx:26, SfidaGioco.tsx:276] | OK |  |
| `stato-risposta-sbagliata` | risposta sbagliata (CorrezioniComplete, Theory, CheatSheet, StatsMode, LearnMode). [10 punti, es. CheatSheet.tsx:40, LearnMode.tsx:527, StatsMode.tsx:65, CorrezioniComplete.tsx:123, CorrezioniComplete.tsx:17] | OK | Nota: landing dati.tsx:12 la usa per «Non superi» (esito del test, non una risposta): 1 punto ambiguo, lo lascio. |
| `stato-vinto` | esito duello «Vinto». [comuni.tsx:75] | OK |  |
| `stima-campione` | FoglioStima: voce «Poche domande / più risposte, più stabile» (unico uso). [FoglioStima.tsx:116] | OK |  |
| `stima-escluso` | FoglioStima: voce «Cosa non entra» (unico uso). [FoglioStima.tsx:109] | OK |  |
| `stima-garanzia` | FoglioStima: voce «Non è una previsione» (unico uso). [FoglioStima.tsx:129] | OK |  |
| `stima-intervallo` | FoglioStima: voce «Punteggio probabile» (unico uso). [FoglioStima.tsx:106] | OK |  |
| `stima-miglioramento` | FoglioStima: voce «Migliora con le simulazioni» (unico uso). [FoglioStima.tsx:132] | OK |  |
| `stima-modello` | modello della stima (FoglioStima:103, InfoPunteggio:41). [FoglioStima.tsx:103, InfoPunteggio.tsx:41] | OK |  |
| `storico` | «Storico» delle simulazioni (Simulazioni:54). [Simulazioni.tsx:54] | OK |  |
| `suoni` | interruttore suoni (Impostazioni:90). [Impostazioni.tsx:90] | OK |  |
| `telegram` | canale Telegram. [FoglioCondividi.tsx:22, FoglioCondividi.tsx:27] | OK |  |
| `tema-chiaro` | tema chiaro. [Impostazioni.tsx:46] | OK |  |
| `tema-scuro` | tema scuro. [Impostazioni.tsx:47] | OK |  |
| `tema-sistema` | tema di sistema. [Impostazioni.tsx:45] | OK |  |
| `tempo` | tempo/durata/cronometro (orologio): sempre «tempo» (oltre 20 punti). [22 punti, es. ExamMode.tsx:327, ExamMode.tsx:392, LearnMode.tsx:391, LearnMode.tsx:647, StatsMode.tsx:339] | OK |  |
| `teoria` | «Rivedi la teoria» / passo «Teoria». [LearnMode.tsx:542, LearnMode.tsx:690, CorrezioniComplete.tsx:159, AtlasAnalisi.tsx:252, Frasi.tsx:148, LezioneDettaglio.tsx:72] | OK |  |
| `teoria-esempi` | sezione «Esempi» della scheda (Theory:158). [Theory.tsx:158] | OK |  |
| `teoria-regola` | sezione «Regola» (Theory:152) e area «Grammatica» (Aree:9, tutte le categorie senza icona propria). [Aree.tsx:9, Theory.tsx:152] | OK | Ambiguo (opinione): oggi la Home ha una sola categoria con questa icona (Grammatica), quindi non c'è condivisione fra righe; se si aggiungono categorie, ognuna deve avere la sua. |
| `trend-giu` | variazione in calo. [StatsMode.tsx:354, Stima.tsx:51] | OK |  |
| `trend-su` | variazione in aumento. [StatsMode.tsx:354, Stima.tsx:51] | OK |  |
| `verifica` | passo «Verifica» della lezione (LezioneDettaglio:82). [LezioneDettaglio.tsx:82] | OK |  |
| `whatsapp` | canale WhatsApp. [FoglioCondividi.tsx:21, FoglioCondividi.tsx:27] | OK |  |

Registro: 28 nomi non sono usati da nessuna schermata raggiungibile: `andamento`, `badge`, `calendario`, `classifica`, `codice`, `dati`, `debug`, `esame`, `fiducia-alta`, `fiducia-bassa`, `fiducia-media`, `garanzia`, `gratis`, `legale`, `minuti-giorno`, `ofa`, `panoramica`, `partecipanti`, `pass`, `ricontrolla`, `scadenza`, `scadenze-piano`, `stato-incluso`, `stato-link-rotto`, `stato-medio`, `stato-non-attivo`, `suoni-spenti`, `tema`. Di questi `calendario`, `panoramica`, `classifica` compaiono nel codice solo come id di sezione, non come icona; `stato-incluso` è usata solo in `brand/hero/Scena.tsx` (nessun import: codice morto). Alcune sono utili alle correzioni: `classifica` (trophy), `stato-medio` (gauge), `stato-incluso` (circle-check-big), `fiducia-bassa/media/alta` (signal-low/medium/high), `garanzia` (handshake), `badge` (award). Nota fuori ambito: `pass`, `gratis`, `codice`, `garanzia` sono nomi vecchi (il repository vieta «Pass» e «Gratis» nei testi per l'utente); non sono usati.

Ricerca degli usi: oltre ai letterali `<Icona nome="…">` (≈330 punti) ho risolto le mappe `icona:`/`nome:` (ICONE di Toast e FoglioCondividi, ICONE_LEGALI, FILTRI/STATO di CorrezioniComplete, FILTRI di Frasi, STILE_TIPO di Segnala, FASCIA di Stima, ESITO_VISTA delle sfide, `eroe` e MESSAGGI/GUADAGNI di Onboarding, TEMI, VOCI di Navigazione e Menu, Percorso, ProgressiArgomenti, AtlasAnalisi.priorita, i ternari di ProjectId), i prop `icona="…"` di `Riga`, `Bottone`, `BottoneRiga`, `PassoAzione`, `Dato`, `RigaStoria`, `TastoTesto`, `StatoVuoto`, i template e i ternari. Le uniche stringhe composte che arrivano a `<Icona>` sono `ICONE[m.tipo]` (Toast), `ICONE[l.id]` (FoglioCondividi), `ICONE_LEGALI[…]`, `ICONA_AREA(f)` e `ic as NomeIcona` (TelefonoPassi:92): tutte risolte.

## (c) Illustrazioni e immagini

Stessa struttura. Il kit luminoso è lo stesso soggetto del kit blu e sta nella stessa riga. «Eroe» è lo spazio flessibile di `components/ui.tsx` usato dall'onboarding.

| asset | usi (file:riga → significato) | verdetto | correzione proposta / nota |
|---|---|---|---|
| `studio-inglese (libri + bandiera UK)` | famiglia di lezioni «Altro» (famiglie.ts:29 → Theory.tsx:125/147, LezioneDettaglio.tsx:63; fallback di home/arte.ts:30 → Home Lezione.tsx:14) = lezioni imperative e adverbs-manner; badge «25 domande» (badge.ts:174); badge «14 giorni» (badge.ts:221, sostituito a runtime da piano-superamento, quindi non visibile); avatar «Libri» (dati.ts:20) | **VIOLAZIONE** | Lezioni e badge: vedi sez. d1/d4. Avatar: d5. Dopo le correzioni l'asset non è più usato (è il candidato naturale per il tab/testata «Lezioni» se mai servirà). |
| `quiz-test (foglio A/B/C; anche kit-luminoso)` | intro «Test di livello» (Onboarding.tsx:344); testata «Allenamento consigliato» (Esercizi.tsx:97, kit-luminoso); intro della sfida (SfidaGioco.tsx:211); ESITO «perso» del duello (sfide/comuni.tsx:133); finto telefono della landing «Allenamento consigliato» (TelefonoPassi.tsx:49, kit-luminoso); badge «100 domande» e «Prima simulazione» (badge.ts:175, 206); avatar «Quiz» (dati.ts:21) | **VIOLAZIONE** | Tenere `quiz-test` solo per Onboarding.tsx:344 (test di livello). Esercizi.tsx:97 → `quiz-test-lista` (kit-blu, oggi inutilizzata: «una sessione appena iniziata»); TelefonoPassi.tsx:49 la segue (è lo specchio di Esercizi). SfidaGioco.tsx:211 e sfide/comuni.tsx:133 → nessuna illustrazione (per il «perso» basta l'icona `stato-perso`, calma). Badge/avatar: d4/d5. |
| `superamento (fogli con spunta; anche kit-luminoso)` | schermata «Da dove parti» (OFA e certificazione) dell'onboarding (Onboarding.tsx:365); riepilogo della simulazione superata nel dettaglio (SimulazioneDettaglio.tsx:91, kit-luminoso); badge «Simulazione superata» e «Livello B1» (badge.ts:211, 225); avatar «Documento» (dati.ts:23) | **VIOLAZIONE** | Onboarding.tsx:365 → nessuna illustrazione (la schermata è una domanda a due scelte; «test superato» qui dice una cosa falsa: l'utente non l'ha superato). Tenere `superamento` per SimulazioneDettaglio.tsx:91. Badge/avatar: d4/d5. |
| `successo (coppa; anche kit-luminoso; anche animata)` | testata NOI (Noi.tsx:74) e carta NOI in Community (Esplora.tsx:34); stato vuoto «Nessuna classifica per ora» tra amici (Classifica.tsx:65); carta «Sfida del giorno» (Sfide.tsx:81); risultato della sfida del giorno (SfidaRisultato.tsx:113); testata «X ti sfida» (SfidaAccetta.tsx:122, kit-luminoso); fine sessione di esercizi «Sessione completata» (LearnMode.tsx:627, animata); stato vuoto «Li hai ottenuti tutti» dei badge (Badge.tsx:83); badge «10 argomenti» (badge.ts:177); avatar «Coppa» (dati.ts:22). 9 significati diversi | **VIOLAZIONE** | Tenere la coppa per NOI/classifica (Noi.tsx:74, Esplora.tsx:34, Classifica.tsx:65). LearnMode.tsx:627 → `celebrazione-fiocco` (il catalogo dice «lezione finita»; servirà una versione statica, perché solo `successo` è fra le 11 animate); SfidaRisultato.tsx:113 (non duello) → `celebrazione-fiocco` (stesso significato «sessione completata»); Sfide.tsx:81 e SfidaAccetta.tsx:122 → nessuna illustrazione (c'è già l'icona `sfida-giorno`/`duello` e il titolo); Badge.tsx:83 «Li hai ottenuti tutti» → nessuna illustrazione, icona `badge` (award, inutilizzata). Badge/avatar: d4/d5. |
| `suggerimenti-consigli (lampadina; anche kit-luminoso)` | testata «Teoria» (Theory.tsx:89, kit-luminoso); famiglia «Condizionali e modali» = 6 lezioni (famiglie.ts:23 → Theory/LezioneDettaglio/Home); badge «Prima domanda» e «Livello A1» (badge.ts:173, 223); avatar «Idea» (dati.ts:25) | **VIOLAZIONE** | Tenere Theory.tsx:89 (la lampadina della pagina Teoria). Lezioni: d1; badge: d4; avatar: d5. |
| `verifica-utente (tessera)` | passo email dell'onboarding (Onboarding.tsx:401) e carta Project ID in Community (Esplora.tsx:32): stesso significato (la tua iscrizione/identità), OK; ma anche famiglia «Chi e dove» = 7 lezioni (famiglie.ts:27); badge «Accuratezza 80 %» e «Livello A2» (badge.ts:186, 224) | **VIOLAZIONE** | Tenere Onboarding.tsx:401 e Esplora.tsx:32. Lezioni: d1; badge: d4. |
| `progressi-statistiche (4 barre; anche kit-luminoso)` | carta ATLAS in Community (Esplora.tsx:33); stati vuoti «nessuna risposta/nessuna stima» di ATLAS (AtlasAnalisi.tsx:76, 113), «Ancora nessun progresso» (Progressi.tsx:31), «Ancora nessun argomento» (ProgressiArgomenti.tsx:56): significato «progressi/analisi», OK; MA anche passo «livello di studi» dell'onboarding (Onboarding.tsx:434/440 via `eroe`), famiglia «Confronti» = 2 lezioni (famiglie.ts:21), avatar «Grafico» (dati.ts:27), badge «7 giorni» (badge.ts:220, sostituito a runtime) | **VIOLAZIONE** | Onboarding.tsx:440 (livello triennale/magistrale, nessuna relazione con le barre) → nessuna illustrazione. Lezioni: d1; avatar: d5. |
| `progressi-statistiche-scheda (scheda con barre)` | stato vuoto del grafico «Andamento» della Home (GraficoStime.tsx:43) ≠ stato vuoto delle «Le tue aree» della Home (Aree.tsx:63) ≠ badge «20 argomenti» (sostituisce risultato-probabilita in arteBadge, componenti.tsx:83) | **VIOLAZIONE** | Tenere GraficoStime.tsx:43. Aree.tsx:63 → `vuoto` (stato «nessun dato», come negli altri 8 stati vuoti). Badge: d4. |
| `mondo-internazionale (globo + aereo)` | passo «sede» dell'onboarding (Onboarding.tsx:434/440 via `eroe`); badge «5 ore di studio» (badge.ts:198); avatar «Mondo» (dati.ts:26) | **VIOLAZIONE** | Tenere per la sede (Onboarding.tsx:440). Badge: d4; avatar: d5. |
| `messaggi-supporto (due fumetti)` | testata Agorà (Agora.tsx:17) e carta Agorà in Community (Esplora.tsx:35): stesso significato, OK; ma anche passo «Come ci hai conosciuto?» (Onboarding.tsx:420), stato vuoto «Ancora nessun amico» (Amici.tsx:85), stato vuoto «Niente da condividere» (Condividi.tsx:15), famiglia «Discorso» = 4 lezioni (famiglie.ts:25), avatar «Messaggi» (dati.ts:29) | **VIOLAZIONE** | Amici.tsx:85 e Condividi.tsx:15 → `vuoto`; Onboarding.tsx:420 → nessuna illustrazione. Lezioni: d1; avatar: d5. |
| `celebrazione (cono di coriandoli; anche kit-luminoso; anche animata)` | simulazione superata (EsitoSimulazione.tsx:74, animata), duello vinto (sfide/comuni.tsx:131, kit-luminoso), finto telefono della landing «risultato» (TelefonoPassi.tsx:87): significato «esito positivo», OK; MA anche badge «Tutti gli argomenti» e «3 simulazioni superate» (badge.ts:179, 216), badge «31 giorni» (badge.ts:222, sostituito a runtime); avatar «Festa» (dati.ts:24) | **VIOLAZIONE** | Badge: d4; avatar: d5. Gli altri 3 usi restano. |
| `attesa-caricamento (clessidra; anche animata)` | caricamento: LearnMode.tsx:183, ExamMode.tsx:304 (animata), SfidaGioco.tsx:163 (statica): OK; MA anche famiglia «Tempi» = 8 lezioni + home/arte.ts:25 «prepositions-time» (famiglie.ts:17), badge «Memoria a lungo termine» (badge.ts:181) | **VIOLAZIONE** | Lezioni: d1; badge: d4. |
| `ricerca (lente)` | passo «cerca il tuo corso» (Onboarding.tsx:464, ha davvero un campo di ricerca): OK; MA «nessun risultato» in Faq.tsx:71 e «Sfida non trovata» (SfidaRisultato.tsx:60) mentre l'asset degli stati «nessun risultato» è `ricerca-scintille`; famiglia «Domande» = 2 lezioni + there-is-are e prepositions-place nella Home (famiglie.ts:19, arte.ts:13/25); badge «Primo argomento» (badge.ts:176); avatar «Lente» (dati.ts:28) | **VIOLAZIONE** | Faq.tsx:71 e SfidaRisultato.tsx:60: `ricerca` → `ricerca-scintille` (stesso significato, asset già esistente). Lezioni: d1; badge: d4; avatar: d5. |
| `piano-superamento (calendario con spunte)` | schermata «Arrivi al test sapendo a che punto sei» (Onboarding.tsx:321) e testata «Percorso» (Percorso.tsx:66): stesso significato (il piano di studio verso il test), OK; MA anche TUTTI i badge del gruppo costanza «7/14/31 giorni» (arteBadge in componenti.tsx:82: Badge.tsx:25/71/106, Profilo.tsx:179) | **VIOLAZIONE** | Badge: d4. Gli altri 2 usi restano. |
| `cappello-laurea-orologio (tocco + cronometro)` | passo «scuola» dell'onboarding (Onboarding.tsx:434/440 via `eroe`); avatar «Laurea» (dati.ts:30) | **VIOLAZIONE** | Avatar: d5. L'uso in onboarding resta. |
| `stati/celebrazione-fiocco (fiocco)` | esito «pari» del duello (sfide/comuni.tsx:132) ≠ stato vuoto «Nessun badge ancora» (Badge.tsx:83) | **VIOLAZIONE** | sfide/comuni.tsx:132 → nessuna illustrazione («Pari» ha già `stato-pari`/etichetta); Badge.tsx:83 → `vuoto`. Il fiocco passa a «sessione completata» (vedi `successo`). |
| `stati/documento-completato (foglio con spunta)` | tutto a posto/completato: LearnMode.tsx:173, CorrezioniComplete.tsx:92, Frasi.tsx:29, LezioneDettaglio.tsx:95 (lezione imparata), SfidaAccetta.tsx:93 (già giocata) — OK (ambiguo: «niente da ripassare» e «completato» sono vicini); MA anche testata «Le tue scelte» dei consensi dell'onboarding (Onboarding.tsx:482), dove nulla è completato | **VIOLAZIONE** | Onboarding.tsx:482 → nessuna illustrazione. |
| `rischio-economico (banconota)` | carta «~30 € a tentativo» della landing (SeNonSuperi.tsx:11) | OK |  |
| `rischio-economico-ali (euro con le ali)` | schermata «Se non superi» dell'onboarding (Onboarding.tsx:297). Lo stesso soggetto di rischio-economico (costo di un nuovo tentativo) in due sedi: landing e onboarding; stesso significato, lo considero OK. | OK | Nota: tools/controlla-illustrazioni.py la segnala «non usata» perché cerca solo nei file che nominano `Illustrazione`, e Onboarding usa `<Eroe>`: falso negativo. |
| `piano-studi-bloccato (calendario + lucchetto)` | carta «Piano di studi limitato» della landing (SeNonSuperi.tsx:12) | OK |  |
| `accesso-bloccato (studente + finestra + orologio)` | carta «Scadenze del 2° anno» della landing (SeNonSuperi.tsx:13) | OK |  |
| `mancato-superamento (foglio con croce)` | carta «Sotto 25 su 30» della landing (SeNonSuperi.tsx:10) | OK |  |
| `attenzione-rischio (triangolo)` | dialog «Esci dalla simulazione?» (ExamMode.tsx:284) | OK |  |
| `simulazione-esame (cartellina con bandiera)` | carta Simulazione della Home (Simulazione.tsx:52), dialog «Consegnare?» (ExamMode.tsx:284), testata della scheda Simulazioni (Simulazioni.tsx:42): sempre «la simulazione d'esame» | OK |  |
| `stati/attesa (clessidra azzurra)` | duello in attesa dell'amico: SfidaRisultato.tsx:113 e «Questa è una tua sfida» (SfidaAccetta.tsx:82): stesso significato | OK |  |
| `stati/documento-errore (foglio con croce)` | errore di caricamento/consegna/link: ErrorBoundary.tsx:64, LearnMode.tsx:190, ExamMode.tsx:306/334, SfidaGioco.tsx:175, SfidaAccetta.tsx:54/57 | OK |  |
| `stati/documento-in-corso (foglio con orologio)` | consegna in corso (ExamMode.tsx:330); «segnalazione pronta, non inviata» (Segnala.tsx:76); CalcoloRisultato.tsx:33 non è raggiungibile (nessun import) | OK | Ambiguo (opinione): «elaborazione in corso» ed «in attesa che tu la copia» sono vicini e il commento in Segnala.tsx:75 giustifica la scelta; non lo conto come violazione. |
| `stati/mondo-globo (globo)` | schermata Offline: sia «Sei offline» sia «Sei di nuovo online» (Offline.tsx:23, 32) | OK | Ambiguo (opinione): lo stesso disegno per due stati opposti della stessa schermata. Un solo significato («connessione»), lo lascio. |
| `stati/obiettivo (bersaglio)` | stato vuoto «Il piano non c'è ancora» (AtlasAnalisi.tsx:248) | OK |  |
| `stati/ricerca-scintille (lente senza risultati)` | «nessun risultato / non trovato»: CheatSheet.tsx:47, Frasi.tsx:89, LezioneDettaglio.tsx:44, SimulazioneDettaglio.tsx:138 | OK |  |
| `stati/vuoto (nuvola)` | «non c'è ancora niente»: Percorso.tsx:60, Theory.tsx:91, CorrezioniComplete.tsx:92, Noi.tsx:112, StatistichePezzi.tsx:46, Frasi.tsx:28/30 | OK | Nota: il catalogo la descrive «nuvola triste», mentre il repository dice «mai una faccia triste»: da guardare a occhio, non è un tema di questa verifica. |
| `landing: scena hero (scena-chiara/scura.webp)` | sfondo dell'hero (Hero.tsx:17/18) | OK |  |
| `landing: banner-edificio.webp` | riquadro «Progetto studentesco indipendente dal Politecnico» (Perche.tsx:53) | OK |  |
| `landing: cta-fondo.webp` | sfondo della CTA finale (CtaFinale.tsx:15) | OK |  |
| `Marchio / logo (Marchio.tsx; urlLogo)` | marchio AddiOFA: testate Onboarding/Menu/landing/footer, Splash: sempre «il marchio» | OK |  |

### Gruppi di elementi che condividono immagini

Lezioni (`lib/studio/famiglie.ts` per Teoria e dettaglio lezione; `components/home/arte.ts` per la Home: due tabelle diverse, che per `there-is-are`, `prepositions-place` e `prepositions-time` danno immagini DIVERSE alla stessa lezione nella Home e in Teoria):

| famiglia | n. lezioni | immagine | altri significati della stessa immagine |
|---|---|---|---|
| Tempi | 8 (+ `prepositions-time` nella Home) | `attesa-caricamento` | caricamento (3 schermate), badge «Memoria» |
| Domande | 2 (+ `there-is-are`, `prepositions-place` nella Home) | `ricerca` | corso, «nessun risultato», badge, avatar |
| Confronti | 2 | `progressi-statistiche` | ATLAS, stati vuoti, livello di studi, avatar |
| Condizionali e modali | 6 | `suggerimenti-consigli` | testata Teoria, badge ×2, avatar |
| Discorso | 4 | `messaggi-supporto` | Agorà, provenienza, stati vuoti, avatar |
| Chi e dove | 7 (4 nella Home) | `verifica-utente` | Project ID, email, badge ×2 |
| Altro / fallback | 2 | `studio-inglese` | badge, avatar |

Badge (`lib/profilo/badge.ts:173-225`, dopo `arteBadge`): prima-domanda e livello-A1 → `suggerimenti-consigli`; domande-25 → `studio-inglese`; domande-100 e prima-simulazione → `quiz-test`; argomento-1 → `ricerca`; argomenti-10 → `successo`; argomenti-20 → `progressi-statistiche-scheda`; argomenti-tutti e simulazioni-superate-3 → `celebrazione`; memoria-10 → `attesa-caricamento`; accuratezza-80 e livello-A2 → `verifica-utente`; ore-5 → `mondo-internazionale`; simulazione-superata e livello-B1 → `superamento`; giorni-7, giorni-14, giorni-31 → `piano-superamento`.

Avatar (`lib/profilo/dati.ts:20-30`, scelti in ProfiloModifica.tsx:33 e mostrati in Profilo.tsx:75): `studio-inglese`, `quiz-test`, `successo`, `superamento`, `celebrazione`, `suggerimenti-consigli`, `mondo-internazionale`, `progressi-statistiche`, `ricerca`, `messaggi-supporto`, `cappello-laurea-orologio`: 11 illustrazioni che hanno già un altro mestiere.

Testate dell'onboarding (un'illustrazione per passo, `<Eroe>`): pain `rischio-economico-ali` (297), gain `piano-superamento` (321), test di livello `quiz-test` (344), «Da dove parti» `superamento` (365), email `verifica-utente` (401), provenienza `messaggi-supporto` (420), scuola `cappello-laurea-orologio` / sede `mondo-internazionale` / livello `progressi-statistiche` (434-440), corso `ricerca` (464), consensi `documento-completato` (482).

## (d) Violazioni in ordine di evidenza per l'utente, con la correzione

Le correzioni usano asset già esistenti e non usati; dove non ce n'è uno adatto lo dico. Non ho guardato i disegni SVG uno per uno: mi baso sulla descrizione del catalogo (`catalogo.ts`) e su `docs/design/ILLUSTRAZIONI.md`; la scelta finale va confermata a occhio.

**d1. Le 31 lezioni hanno 7 immagini, e riciclate** (Teoria, dettaglio lezione, Home «prossimo passo»). Evidenza massima: ogni riga della lista Teoria mostra una delle 7 immagini e la stessa immagine ricompare altrove con altro senso.
- `lib/studio/famiglie.ts:17-29` (campo `illustrazione`) e `components/home/arte.ts:9-30` → togliere le illustrazioni di famiglia.
- `screens/Theory.tsx:125` (`TesseraArte` 44 px sulla riga) → tessera col numero della lezione + `ChipLivello` (lo schema esiste già: `LezioneDettaglio.tsx:~107` mostra il numero della lezione successiva in un riquadro 36 px).
- `screens/Theory.tsx:147` (`Arte` 76 px nella testata della scheda) e `screens/extra/studio/LezioneDettaglio.tsx:63` (40 px) → nessuna illustrazione (il chip del livello c'è già).
- `components/home/Lezione.tsx:14` (`TesseraArgomento`, usata alle righe 38 e 69) → stessa tessera col numero.
- Se si vuole davvero un'immagine per lezione: serve nuova grafica (31 soggetti, non realistico); 7 immagini per famiglia vanno bene solo se sono dedicate e non riusate altrove: serve nuova grafica.

**d2. L'icona «Sfide» (swords) è anche l'icona del «Duello».** (esempio indicato nella richiesta)
- Resta `sfide` per: `components/Navigazione.tsx:11`, `components/Menu.tsx:68`, `screens/landing/TelefonoPassi.tsx:102`, «Vai alle sfide» (`SfidaRisultato.tsx:61`, `SfidaAccetta.tsx:26`, `Condividi.tsx:17`).
- Passano a `duello` (nuovo nome nel registro `prove.json` → lucide `git-compare-arrows`; alternativa `user-round-plus` solo per i pulsanti «Sfida un amico»): `Sfide.tsx:23` (riga duello nello storico), `Sfide.tsx:100` (riga «Sfida un amico»), `Amici.tsx:86` e `Amici.tsx:110` (pulsanti «Sfida un amico»), `Classifica.tsx:87` (conteggio «N duelli»), `SfidaGioco.tsx:272` (icona del duello in gara).

**d3. La coppa (`successo`) ha 9 significati**: NOI, classifica tra amici, Sfida del giorno (carta e risultato), «X ti sfida», fine sessione di esercizi, badge ottenuti, badge «10 argomenti», avatar.
- Resta per NOI/classifica: `Noi.tsx:74`, `Esplora.tsx:34`, `Classifica.tsx:65`.
- `LearnMode.tsx:627`: `successo` (animata) → `celebrazione-fiocco` statica («lezione finita» nel catalogo); `SfidaRisultato.tsx:113` (ramo non duello): `successo` → `celebrazione-fiocco`.
- `Sfide.tsx:81` e `SfidaAccetta.tsx:122` (`kit-luminoso`): `successo` → nessuna illustrazione (titolo e icona `sfida-giorno`/`duello` bastano).
- `Badge.tsx:83` ramo «Li hai ottenuti tutti»: `successo` → nessuna illustrazione, icona `badge`.

**d4. 19 badge su 12 immagini, tutte riciclate** (pagina Badge, Profilo, dettaglio): `lib/profilo/badge.ts:173-225` e `screens/extra/profilo/componenti.tsx:81-85` (`arteBadge`). Correzione: serve nuova grafica (19 emblemi), oppure icone lucide dedicate, una per badge, da aggiungere al registro come `badge-<id>` (nessuna già in uso). Con i soli asset esistenti non si risolve: gli unici disegni non usati sono `quiz-test-lista` e `stati/messaggi`.

**d5. 11 avatar = 11 illustrazioni con altro mestiere**: `lib/profilo/dati.ts:19-31` (lista `AVATAR`), `screens/extra/profilo/componenti.tsx:20-29` (`Avatar`), `ProfiloModifica.tsx:33-39`. Correzione: lasciare solo la lettera (`iniziale`) oppure disegnare avatar dedicati (serve nuova grafica).

**d6. Esito del duello**: `screens/extra/sfide/comuni.tsx:129-134` (`IlluEsito`): «Pari» = `celebrazione-fiocco` (fiocco da badge) e «Perso» = `quiz-test` (foglio del quiz). `pari` e `perso` → nessuna illustrazione (c'è già la parola, il tono e le icone `stato-pari`/`stato-perso`); `vinto` (`celebrazione` luminoso) resta.

**d7. Testate dell'onboarding con un significato non loro**:
- `Onboarding.tsx:365` «Da dove parti» (OFA/certificazione): `superamento` («test superato», falso) → nessuna illustrazione.
- `Onboarding.tsx:420` «Come ci hai conosciuto?»: `messaggi-supporto` (Agorà) → nessuna illustrazione.
- `Onboarding.tsx:440` passo livello di studi: `progressi-statistiche` (le 4 barre di ATLAS) → nessuna illustrazione.
- `Onboarding.tsx:482` consensi: `documento-completato` → nessuna illustrazione.
- Se si rimuove l'`<Eroe>`, `ui.tsx` va controllato: la zona flessibile (`flex-1 basis-0`) oggi riempie lo spazio.

**d8. Home «Le tue aree»: 3 livelli, una icona** (`components/home/Aree.tsx:9`): `ICONA_AREA` dà `livello` (layers) a A1, A2 e B1. Correzione: per i livelli un chip testuale A1/A2/B1 (`ChipLivello`, già in `screens/extra/studio/comune.tsx:116`) o `fiducia-bassa/media/alta` rinominate `livello-a1/a2/b1`. Inoltre `Aree.tsx:63` (stato vuoto «Nessun dato per area») usa la stessa `progressi-statistiche-scheda` di `GraficoStime.tsx:43` → `vuoto`.

**d9. Project ID, riepilogo del percorso** (`screens/extra/progetto/ProjectId.tsx:125-133`): icone per riga: Corso `lezioni`, Sede `home`, Scuola/Livello/Anno `livello` (tre righe uguali), «Come ci hai conosciuto» `condividi`, «Consensi» `privacy`. Nuovi nomi `percorso-*`: Scuola `school`, Sede `map-pin`, Livello di studi `library-big`, Anno `calendar-range`, Corso `book-marked`; `provenienza` = `megaphone`; `consensi` = `toggle-right`. (`ProjectId.tsx:247` «Necessario»: `blocco` → nessuna icona o `asterisk`.)

**d10. Stati vuoti e testate che prestano l'immagine di un altro oggetto**:
- `Amici.tsx:85` (nessun amico) e `Condividi.tsx:15` (niente da condividere): `messaggi-supporto` → `vuoto`.
- `Faq.tsx:71` (nessun risultato) e `SfidaRisultato.tsx:60` (sfida non trovata): `ricerca` → `ricerca-scintille` (è l'asset degli stati «non trovato», usato in altre 4 schermate).
- `Badge.tsx:83` ramo «Nessun badge ancora»: `celebrazione-fiocco` → `vuoto`.
- `Esercizi.tsx:97` (testata «Allenamento consigliato», `kit-luminoso`): `quiz-test` → `quiz-test-lista` (piatto, 88 px: coerente col kit blu); la finta schermata `TelefonoPassi.tsx:49` della landing la segue. `SfidaGioco.tsx:211` (intro sfida): `quiz-test` → nessuna illustrazione.

**d11. Icone di Community, NOI e Agorà** (da (b)): `Profilo.tsx:190` Community usa `amici` → `community` (lucide `network`); `Noi.tsx:138` «Classifica tra amici» usa `amici` → `classifica` (trophy, già nel registro); `Agora.tsx:24` «Apri su Instagram» usa `presentazione` (globo della landing) → `instagram` (lucide) o `external-link`.

**d12. Icone di stato usate come azione o selezione**:
- `ProfiloModifica.tsx:25` «Salva»: `stato-ok` → `salva` (lucide `save`).
- Segno «selezionato» (due icone diverse nell'app): `components/ui.tsx:153` (ChoiceCard di scuola, sede, livello, provenienza: `stato-risposta-giusta`) e `ProfiloModifica.tsx:37` (avatar: `stato-ok`) → entrambe `stato-incluso` (circle-check-big, oggi inutilizzata) rinominata `selezionato`.
- `Sfide.tsx:86` (sfida del giorno già giocata) e `Stima.tsx:27` (fascia «In linea»): `stato-risposta-giusta` → `stato-ok`.

**d13. `studia` (play) è «avvia» per 7 funzioni diverse**: simulazione (`Simulazione.tsx:69`, `Simulazioni.tsx:49` → `simulazioni`); sfida (`Sfide.tsx:93` → `sfida-giorno`; `SfidaGioco.tsx:217` → `sfida-giorno`/`duello`; `SfidaAccetta.tsx:128` → `duello`); «Crea link» (`Sfide.tsx:119` → `crea-link` = lucide `link-2`, svg già presente); «Riprendi da dove eri» (`Offline.tsx:27` → `indietro`); «Lezione successiva» (`LezioneDettaglio.tsx:97` → `avanti`). Gli altri 12 usi (studio/allenamento/lezione) restano.

**d14. Altre icone**:
- `trend-uguale`: `sfide/comuni.tsx:76` «Pari» → `stato-pari` (`garanzia`/handshake rinominata); `ProgressiArgomenti.tsx:69` «Da migliorare» e `AtlasAnalisi.tsx:46` «Priorità media» → `stato-medio` (gauge, inutilizzata).
- `suggerimento`: le spiegazioni (`CorrezioniComplete.tsx:148`, `Theory.tsx:186`, `Frasi.tsx:139`) → `spiegazioni` (esiste, oggi solo nella landing); suggerimento/consiglio (`LearnMode.tsx:463`, `Theory.tsx:199`) restano.
- `stato-attenzione` per errori: `sfide/comuni.tsx:59` e `SfidaRisultato.tsx:125` → `stato-errore`.
- `dettaglio`: `Legal.tsx:64` «Indice» → `indice` (lucide `table-of-contents`).
- `probabilita`: `landing/Vantaggi.tsx:9` «Scopri il tuo livello» → `diagnostico`.

Effetto previsto: con (d2), (d9), (d11), (d12), (d13), (d14) le 16 icone in violazione diventano 0; con (d1), (d3)-(d8), (d10) le 17 illustrazioni in violazione diventano 0. Per lezioni, badge e avatar la correzione è «nessuna illustrazione» o «serve nuova grafica», non un asset esistente.

## (e) Cosa non ho potuto verificare

- Non ho aperto né visto renderizzati i singoli SVG/webp: il contenuto di ogni disegno e della scena hero/banner/CTA della landing viene dal catalogo (`catalogo.ts`), da `docs/design/ILLUSTRAZIONI.md` e dai nomi dei file. Non ho verificato a occhio che le sostituzioni proposte (`quiz-test-lista`, `ricerca-scintille`, `vuoto`, `celebrazione-fiocco`) stiano bene dove le propongo.
- Nessuna prova in browser: significato e uso sono letti dal codice e dai testi accanto all'icona. Gli usi che dipendono da dati a runtime (quale ramo di un ternario si vede, quali badge sono sbloccati) li ho considerati tutti possibili.
- Icone: ho cercato i nomi come stringhe intere dentro file `.ts`/`.tsx` (esclusi `data/` e il generato); un nome costruito per concatenazione non lo troverei. Ho controllato i pattern `stato-${`, `modo-${`, ecc.: nessuno. `Segmenti` accetta `voci[].icona` (`extra/ui.tsx:142`), ma l'unico uso con icone è `Frasi.tsx:19-22` e `CorrezioniComplete.tsx:15-19` (risolti).
- Esclusi perché non raggiungibili: `brand/hero/Scena.tsx` e `brand/hero/Lastra.tsx` (nessun import: usano `errori`, `stato-incluso`, `stato-risposta-giusta` e il logo 3D `addiofa-logo-scena.svg`), `components/CalcoloRisultato.tsx` (nessun import: `documento-in-corso`, `risposte`, `livello`, `soglia`, `stato-ok`), `brand/BrandKit.tsx` e `brand/componenti.tsx` (`IconaChip`, glifi del catalogo `?brand`, solo in sviluppo).
- `screens/landing/Passi.tsx`, `Perche.tsx`, `Hero.tsx`, `Barra.tsx`: letti per le sole righe che usano icone/immagini (grep), non per intero. Le schermate d'esempio del finto telefono (TelefonoPassi) le ho trattate come specchio delle schermate vere.
- Opinioni, non fatti: `avanti`/`indietro` (glifo direzionale), `cancella` (due gravità), `email`, `risposte`, `frasi`, `correzioni`, `profilo`, `projectid`, `info` (registrazione:129), `documento-in-corso` (Segnala), `mondo-globo` (online/offline) e `documento-completato` (tutto a posto vs completato) sono casi ambigui che ho classificato OK; chi preferisce una lettura più rigida può metterli fra le violazioni.

## (f) Osservazioni collaterali (fuori dal perimetro, per chi corregge)

- Due tabelle lezione→illustrazione divergenti (`famiglie.ts` e `home/arte.ts`): la stessa lezione ha immagini diverse in Home e in Teoria.
- `docs/design/ILLUSTRAZIONI.md` §3 prevede essa stessa riusi (per esempio `successo` come fascia alta della Home, `quiz-test` in testata e `ricerca` per Frasi) mentre la sezione 1 dice «una stessa illustrazione fa un solo mestiere»: il documento va allineato dopo le correzioni.
- `tools/controlla-illustrazioni.py` ha falsi negativi: cerca i nomi solo nei file che nominano `Illustrazione`/`urlDisegno`/`illustrazione`; per questo segnala `rischio-economico-ali` «non usata» mentre `Onboarding.tsx:297` la usa tramite `<Eroe>`. Non rileva i riusi con più significati (non è il suo compito).
- Il testo `NON_USATE_OK` dello stesso script dice che `piano-studi-bloccato` è usata «negli Obiettivi»: oggi la usa solo la landing.
- `kit-blu/stati/vuoto` è descritta «nuvola triste» mentre la regola del repository dice «mai una faccia triste».
- `calendar-check` (`giorni-studio`) e `calendar-check-2` (`sfida-giorno`) sono quasi identiche a 16-18 px: significati diversi con segni troppo vicini.
