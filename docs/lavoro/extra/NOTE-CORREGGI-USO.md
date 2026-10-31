# NOTE-CORREGGI-USO: una icona / una illustrazione = un solo significato

Agente CORREGGI-USO, 31/10/2026. Applica nel codice dell'app tutte le correzioni di `docs/design/revisione/AUDIT-USO-ICONE-ILLUSTRAZIONI.md`, con le decisioni dell'autore (che prevalgono sul rapporto). Nessun git, nessun file cancellato.

## Cosa è cambiato, per voce del rapporto

**d1 Lezioni (31 su 7 immagini).** Nessuna illustrazione per lezione. Nuovo `TesseraLezione` (`screens/extra/studio/comune.tsx`): tessera quadrata col NUMERO della lezione, più il `ChipLivello` A1/A2/B1 già esistente. Usata in Teoria (elenco e scheda), dettaglio lezione, Percorso (la tessera inline di prima è diventata questo componente) e Home (carta «Prossima lezione» e righe «Poi»; accanto al numero ora c'è il chip del livello invece del testo «A1»). Teoria ora usa l'ordine del Percorso (`ordinaPercorso`), così il numero di una lezione è lo stesso ovunque (prima l'elenco Teoria seguiva l'ordine del file e il numero non esisteva). Le due tabelle: `components/home/arte.ts` eliminata (resta come file vuoto con commento, da cancellare); `lib/studio/famiglie.ts` ridotta a semplice raggruppamento per nome (campo `illustrazione` tolto, i test restano). Le immagini tolte non sono state riciclate: `studio-inglese` torna in uso solo nel passo «Da dove parti» dell'onboarding (inglese), le altre vedi la tabella.

**d2 Sfide / duello.** Nuova icona `duello` (`git-compare-arrows`) in Sfide (riga storico e «Sfida un amico»), Amici (2 pulsanti), Classifica (conteggio duelli), SfidaGioco (intestazione e pulsante «Inizia la sfida»), SfidaAccetta («Accetta la sfida»). `sfide` (spade) resta solo per scheda Sfide e «Vai alle sfide».

**d3 Coppa `successo`.** Resta solo NOI/classifica (Noi, Esplora, Classifica). Fine sessione di studio e risultato della Sfida del giorno: `celebrazione-fiocco` (statica; il fiocco non è più usato altrove: né badge, né esito del duello). Sfide.tsx (carta) e SfidaAccetta: nessuna illustrazione. Stato vuoto badge: icone (vedi d4).

**d4 Badge (19).** Un'icona Lucide diversa per ciascuno, nuovo registro `app/src/brand/icone/registro/badge.json` (`badge-<id>`, 19 icone che non erano nel registro, quindi mai riusate; `genera-icone.mjs` blocca i doppioni). `DefinizioneBadge.illustrazione` è diventato `icona`. Si mostra in `IconaBadge` (tessera nel colore del gruppo, 45 % se da ottenere) in pagina Badge, foglio di dettaglio e Profilo. Stati vuoti dei badge: icona `badge` («Nessun badge ancora») e `stato-ok` («Li hai ottenuti tutti»).

**d5 Avatar.** Tolte le 11 illustrazioni e il selettore: l'avatar è sempre la lettera iniziale. `ProfiloDati` non ha più il campo `avatar`; `normalizzaProfilo` scarta un vecchio `avatar` salvato (profili con un'illustrazione scelta tornano alla lettera, senza errori; test aggiunto). In Modifica profilo resta l'anteprima della lettera. Informativa privacy: tolta la parola «avatar» dall'elenco dei dati.

**d6 Esito del duello.** «Vinto»: `celebrazione` (luminoso), che non fa più altro. «Pari» e «Perso»: nessuna illustrazione, solo l'icona di stato nel tono dell'esito (`stato-pari` nuova, ex `garanzia`/handshake; `stato-perso`). Per liberare `celebrazione`, la simulazione superata (`EsitoSimulazione`, animata, e la finta schermata della landing) usa `superamento` (anch'essa animata), che già serviva il dettaglio simulazione.

**d7 Testate dell'onboarding.** «Da dove parti» (OFA e certificazione): `studio-inglese`. «Come ci hai conosciuto»: icona `provenienza` grande. Livello di studi: icona `percorso-livello` grande. Consensi: icona `consensi` grande. Le icone grandi usano il nuovo `EroeIcona` (`components/ui.tsx`): stessa zona flessibile di `Eroe`, icona nuda, nessuna cornice. Scuola (`cappello-laurea-orologio`) e sede (`mondo-internazionale`) restano.

**d8 Home «Le tue aree».** Livelli A1/A2/B1: chip testuale (non icone uguali). Grammatica `teoria-regola`, Traduzione `frasi`. Stato vuoto: `vuoto` (non più `progressi-statistiche-scheda`, che resta solo nel grafico Andamento).

**d9 Project ID, riepilogo.** Scuola `percorso-scuola` (school), Sede `percorso-sede` (map-pin), Livello `percorso-livello` (library-big), Anno `percorso-anno` (calendar-range), Corso e «Percorso di studi» `percorso-corso` (book-marked); provenienza `provenienza` (megaphone); consensi `consensi` (toggle-right); «Invia ad ATLAS» `invia-dati` (cloud-upload, prima `condividi`); «Necessario»: nessuna icona (basta la parola).

**d10 Stati vuoti.** Amici e Condividi: `vuoto`. Faq e «Sfida non trovata»: `ricerca-scintille` (anche il predefinito di `StatoVuoto` di servizi; `ricerca` e `messaggi-supporto` tolti dalle ammesse). Esercizi «Allenamento consigliato» e la sua copia nel telefono della landing: `quiz-test-lista`. Intro della sfida: nessuna illustrazione.

**d11 Community, NOI, Agorà.** Community `community` (network); «Classifica tra amici» `classifica` (trophy); «Apri su Instagram» `instagram`.

**d12 Stato come azione/selezione.** «Salva»: `salva`. «Selezionato» (scelte dell'onboarding, ChoiceCard): `selezionato` (ex `stato-incluso`, circle-check-big; aggiornato anche `brand/hero/Scena.tsx`, codice non raggiungibile). Sfida del giorno fatta, fascia Home «In linea», «Hai risposto a tutte» (SfidaGioco): `stato-ok`.

**d13 `studia`.** Simulazione: `simulazioni`; sfida del giorno: `sfida-giorno`; sfida a due: `duello`; «Crea link»: `crea-link` (link-2); «Riprendi da dove eri» (Offline): `indietro`; «Lezione successiva»: `avanti`. `studia` resta per avviare studio, esercizi, lezione.

**d14 Altre.** `trend-uguale` solo «invariato»: Pari → `stato-pari` (anche nella riga Amici), «Da migliorare» e «Priorità media» → `stato-medio`. `suggerimento` solo per suggerimenti e consigli; le spiegazioni (Correzioni, «Perché» in Teoria, Frasi) → `spiegazioni`. Errori veri (`stato-attenzione` → `stato-errore`): campo, «Non riesco a creare il link», «Non riesco a caricare le correzioni», «Correzioni non disponibili». `dettaglio` → solo tab Dettaglio; Indice legale → `indice`. «Scopri il tuo livello» (landing) → `diagnostico`. Inoltre: `amici` solo per Amici, `community` per Community; `sfida-giorno` cambia da `calendar-check-2` a `sunrise` (voce (f): era quasi uguale a `giorni-studio`).

**(f) Osservazioni.** Due tabelle lezione→immagine: risolte (d1). `tools/controlla-illustrazioni.py`: il riconoscimento ora include i file che usano `Eroe`, `Arte`, `Testata`, `Vuoto`, `Fermo`, `StatoPagina`, `Messaggio` (falso negativo di `rischio-economico-ali` risolto), motivo corretto di `piano-studi-bloccato` (solo landing), `NON_USATE_OK` aggiornato con `kit-blu/stati/messaggi` e i doppioni `kit-luminoso/illustrazioni/*` rimasti senza uso. `docs/design/ILLUSTRAZIONI.md`: aggiunto in testa un avviso che dichiara superate le righe della §3 che riciclano un'immagine (non ho riscritto la tabella). Aggiunto `tests/unit/uso-icone.test.ts` (5 prove).

## Scelte mie dove la decisione lasciava spazio
- Badge: `badge-question-mark`, `files`, `library`, `bookmark-check`, `puzzle`, `blocks`, `gem`, `memory-stick`, `focus`, `alarm-clock-check`, `file-pen-line`, `file-check`, `ribbon`, `calendar-heart`, `calendar-sync`, `calendar-fold`, `footprints`, `compass`, `mountain-snow` (i tre di costanza hanno tre calendari diversi perché `flame`, `calendar-check` e `calendar-days` sono già del registro).
- Pari = `handshake`; Perso = pollice in giù (già dell'app).
- Il numero di lezione è quello del Percorso; l'elenco Teoria ora ha lo stesso ordine.

## Cosa NON ho applicato (e perché)
- Nessuna grafica nuova disegnata: dove serviva (lezioni, badge, avatar, esiti) ho usato «numero», «solo icona», «nessuna illustrazione».
- `stati/vuoto` è ancora la «nuvola triste» (il catalogo lo dice; il repository vuole «mai una faccia triste»): togliere il viso richiede di ridisegnare lo SVG, non l'ho toccato. Sta in 13 stati vuoti.
- Lasciati come nel rapporto (casi ambigui che il rapporto classifica OK): `avanti`/`indietro`, `cancella` (dati e account), `email`, `risposte`, `frasi` (Traduzione/Frasi utili), `teoria-regola` (Regola/Grammatica), `profilo` (profilo e riga «Nome»), `projectid`, `info` (registrazione «Da verificare»: è davvero un pulsante info), `riprova` («Rifai la simulazione»), `correzioni` («Vedi il risultato» in SfidaAccetta), `stato-risposta-sbagliata` nella landing «Non superi» (`dati.tsx`), `documento-completato`/`documento-in-corso`/`mondo-globo` (stesso significato in più stati), `progressi-statistiche` (carta ATLAS e stati vuoti di progressi e analisi: stessa idea).
- `stato-attenzione` per i «Selezionalo a mano» di Segnala: avviso, lasciato.

## Tabella finale: nome → unico uso
La dichiarazione (una funzione per nome, nessuna funzione per due nomi) è nello script di audit; gli usi vengono dal compilatore TypeScript (una stringa conta se il suo tipo di contesto è `NomeIcona` in una prop `nome`/`icona`; per le illustrazioni, `nome`/`illustrazione`/`arte` di `Illustrazione`, `Arte`, `Eroe`, `Disegno`, `Testata`, `Vuoto`, `Fermo`, `StatoVuoto`, `StatoPagina`, `Messaggio`). Esclusi codice non raggiungibile (`brand/hero/`, `CalcoloRisultato.tsx`), catalogo `?brand` e dati.

### Illustrazioni (32 usate su 37 del kit blu; il kit luminoso conta come lo stesso soggetto)
| illustrazione | unica funzione | usi | file |
|---|---|---|---|
| `accesso-bloccato` | landing: scadenze del 2° anno | 1 | 1 |
| `attenzione-rischio` | dialog «Esci dalla simulazione?» | 1 | 1 |
| `attesa` | duello in attesa dell'amico | 2 | 2 |
| `attesa-caricamento` | caricamento | 3 | 3 |
| `cappello-laurea-orologio` | onboarding: scuola | 1 | 1 |
| `celebrazione` | duello vinto | 1 | 1 |
| `celebrazione-fiocco` | sessione/sfida completata | 2 | 2 |
| `documento-completato` | completato / tutto a posto | 5 | 5 |
| `documento-errore` | errore di caricamento / consegna / link | 7 | 5 |
| `documento-in-corso` | consegna / elaborazione in corso | 2 | 2 |
| `mancato-superamento` | landing: sotto 25 su 30 | 1 | 1 |
| `messaggi-supporto` | Agorà | 2 | 2 |
| `mondo-globo` | connessione (offline/online) | 2 | 1 |
| `mondo-internazionale` | onboarding: sede | 1 | 1 |
| `obiettivo` | ATLAS: piano non ancora disponibile | 1 | 1 |
| `piano-studi-bloccato` | landing: piano di studi limitato | 1 | 1 |
| `piano-superamento` | piano di studio verso il test | 2 | 2 |
| `progressi-statistiche` | ATLAS / progressi (analisi) | 5 | 4 |
| `progressi-statistiche-scheda` | andamento delle stime (Home) | 1 | 1 |
| `quiz-test` | onboarding: test di livello | 1 | 1 |
| `quiz-test-lista` | allenamento consigliato | 2 | 2 |
| `ricerca` | onboarding: cerca il tuo corso | 1 | 1 |
| `ricerca-scintille` | nessun risultato / non trovato | 6 | 6 |
| `rischio-economico` | landing: costo del tentativo | 1 | 1 |
| `rischio-economico-ali` | onboarding: costo del tentativo | 1 | 1 |
| `simulazione-esame` | simulazione d'esame | 3 | 3 |
| `studio-inglese` | onboarding: OFA e certificazione d'inglese | 1 | 1 |
| `successo` | NOI / classifica | 3 | 3 |
| `suggerimenti-consigli` | pagina Teoria | 1 | 1 |
| `superamento` | simulazione superata | 3 | 3 |
| `verifica-utente` | Project ID / iscrizione (email) | 2 | 2 |
| `vuoto` | non c'è ancora niente | 10 | 9 |

Non usate (con motivo in `NON_USATE_OK`): `caricamento` (lo spinner è un componente), `composizione-tre` e `risultato-probabilita` (scritto «82 %» nel disegno), `messaggi` (doppione di `messaggi-supporto`), `notifica` (l'app non ha notifiche), le sfere (vietate), i doppioni luminosi e il kit rosso.

### Icone (154 usate su 178)
| icona | unica funzione | usi | file |
|---|---|---|---|
| `accuratezza` | percentuale di accuratezza | 1 | 1 |
| `amici` | elenco/schermata Amici | 1 | 1 |
| `app` | versione dell'app | 1 | 1 |
| `argomenti` | esito per argomento | 2 | 2 |
| `ascolta` | pronuncia | 1 | 1 |
| `avanti` | freccia avanti / apri / prosegui | 40 | 28 |
| `badge` | sezione Badge (stato vuoto) | 1 | 1 |
| `badge-accuratezza-80` | badge «accuratezza 80%» | 1 | 1 |
| `badge-argomenti-10` | badge «10 argomenti» | 1 | 1 |
| `badge-argomenti-20` | badge «20 argomenti» | 1 | 1 |
| `badge-argomenti-tutti` | badge «tutti gli argomenti» | 1 | 1 |
| `badge-argomento-1` | badge «primo argomento» | 1 | 1 |
| `badge-domande-100` | badge «100 domande» | 1 | 1 |
| `badge-domande-25` | badge «25 domande» | 1 | 1 |
| `badge-giorni-14` | badge «14 giorni» | 1 | 1 |
| `badge-giorni-31` | badge «31 giorni» | 1 | 1 |
| `badge-giorni-7` | badge «7 giorni» | 1 | 1 |
| `badge-livello-a1` | badge «livello A1» | 1 | 1 |
| `badge-livello-a2` | badge «livello A2» | 1 | 1 |
| `badge-livello-b1` | badge «livello B1» | 1 | 1 |
| `badge-memoria-10` | badge «memoria a lungo termine» | 1 | 1 |
| `badge-ore-5` | badge «5 ore» | 1 | 1 |
| `badge-prima-domanda` | badge «prima domanda» | 1 | 1 |
| `badge-prima-simulazione` | badge «prima simulazione» | 1 | 1 |
| `badge-simulazione-superata` | badge «simulazione superata» | 1 | 1 |
| `badge-simulazioni-superate-3` | badge «3 simulazioni superate» | 1 | 1 |
| `blocco` | bloccato / limitato | 3 | 3 |
| `cancella` | elimina / togli | 5 | 4 |
| `cerca` | campo di ricerca | 5 | 4 |
| `certificazione` | certificazione d'inglese | 1 | 1 |
| `chiudi` | chiudi / annulla / svuota | 16 | 13 |
| `classifica` | classifica tra amici | 1 | 1 |
| `classifica-noi` | classifica NOI | 1 | 1 |
| `community` | Community | 1 | 1 |
| `condividi` | condividere un risultato o un link | 2 | 2 |
| `consensi` | consensi (scelte sui dati) | 2 | 2 |
| `cookie` | pagina Cookie | 1 | 1 |
| `copia` | copiare | 5 | 4 |
| `correzioni` | rivedere correzioni / risposte | 8 | 6 |
| `costo` | costo di un nuovo tentativo | 2 | 2 |
| `crea-link` | creare un link | 1 | 1 |
| `data-test` | data del test | 2 | 1 |
| `dettaglio` | tab Dettaglio / elenco domande | 2 | 1 |
| `diagnostico` | test di livello | 7 | 5 |
| `documento` | pagina Termini | 1 | 1 |
| `duello` | duello (sfida a due) | 8 | 5 |
| `email` | email / posta | 4 | 3 |
| `errori` | sezione Errori | 2 | 2 |
| `esci` | esci da Project ID | 1 | 1 |
| `esercizi` | scheda Esercizi | 4 | 4 |
| `espandi` | apri/chiudi (chevron giù) | 9 | 8 |
| `esporta` | esporta | 2 | 2 |
| `faq` | Domande frequenti | 1 | 1 |
| `ferma` | ferma la pronuncia | 1 | 1 |
| `filtro` | filtra | 1 | 1 |
| `filtro-tutte` | filtro Tutte | 1 | 1 |
| `frasi` | frasi con traduzione | 2 | 2 |
| `giorni-studio` | giorni di studio | 1 | 1 |
| `home` | Home | 6 | 6 |
| `imparate` | domande imparate | 1 | 1 |
| `importa` | importa progressi | 1 | 1 |
| `impostazioni` | impostazioni | 1 | 1 |
| `incolla` | incolla un link | 1 | 1 |
| `indice` | indice del documento legale | 1 | 1 |
| `indietro` | freccia indietro / precedente | 20 | 14 |
| `info` | informazione | 7 | 7 |
| `instagram` | apri Instagram | 1 | 1 |
| `invia-dati` | invia i dati ad ATLAS | 1 | 1 |
| `livello` | livello CEFR (A1/A2/B1) | 2 | 2 |
| `menu` | menu della landing | 1 | 1 |
| `messaggi` | canale SMS | 1 | 1 |
| `modifica` | modifica | 3 | 2 |
| `modo-argomento` | modalità Per argomento | 2 | 2 |
| `modo-blitz` | modalità Blitz | 2 | 2 |
| `modo-punti-deboli` | punti deboli (modalità e consiglio) | 4 | 4 |
| `modo-richiamo` | modalità Richiamo | 2 | 2 |
| `obiettivi` | Obiettivi | 2 | 2 |
| `opzioni` | mostra le opzioni | 1 | 1 |
| `ordina` | ordina | 1 | 1 |
| `percorso` | apri il percorso | 1 | 1 |
| `percorso-anno` | riga Anno | 1 | 1 |
| `percorso-corso` | riga Corso | 3 | 1 |
| `percorso-livello` | livello di studi (triennale/magistrale) | 2 | 2 |
| `percorso-scuola` | riga Scuola | 1 | 1 |
| `percorso-sede` | riga Sede | 1 | 1 |
| `preferita` | frase preferita | 2 | 1 |
| `presentazione` | Cos'è AddiOFA | 1 | 1 |
| `privacy` | pagina Privacy | 2 | 2 |
| `probabilita` | stima della probabilità | 1 | 1 |
| `profilo` | profilo / persona | 3 | 3 |
| `progressi` | fascia Home «vicino alla soglia» | 1 | 1 |
| `projectid` | Project ID (account) | 3 | 3 |
| `prontuario` | riepilogo di grammatica | 1 | 1 |
| `provenienza` | come ci hai conosciuto | 2 | 2 |
| `riprova` | riprova / rifai | 13 | 10 |
| `risposte` | conteggio risposte / domande | 11 | 9 |
| `salta` | salta | 2 | 2 |
| `salva` | salva le modifiche | 1 | 1 |
| `scollega` | scollega da Project ID | 1 | 1 |
| `segnala` | segnala | 6 | 5 |
| `segnala-app` | segnalazione: problema dell'app | 2 | 1 |
| `segnala-domanda` | segnalazione: domanda | 2 | 1 |
| `segnala-idea` | segnalazione: idea | 1 | 1 |
| `segnala-spiegazione` | segnalazione: spiegazione | 1 | 1 |
| `selezionato` | voce selezionata | 1 | 1 |
| `senza-account` | senza password | 1 | 1 |
| `serie` | serie di risposte giuste | 2 | 1 |
| `sfida-giorno` | sfida del giorno | 4 | 2 |
| `sfide` | scheda Sfide | 6 | 6 |
| `simulazioni` | simulazioni | 10 | 9 |
| `soglia` | soglia 25/30 | 6 | 4 |
| `spiegazioni` | spiegazione di una risposta | 4 | 4 |
| `stato-attenzione` | avviso | 10 | 7 |
| `stato-attesa` | in attesa | 3 | 3 |
| `stato-basso` | fascia «si parte da qui» | 1 | 1 |
| `stato-caricamento` | caricamento | 5 | 5 |
| `stato-da-iniziare` | da iniziare | 2 | 2 |
| `stato-da-ripassare` | da ripassare | 4 | 2 |
| `stato-errore` | errore | 7 | 6 |
| `stato-imparata` | imparata / completata | 7 | 5 |
| `stato-in-corso` | lezione in corso | 1 | 1 |
| `stato-medio` | priorità media / da migliorare | 1 | 1 |
| `stato-nuovo` | fascia «nuovo» | 1 | 1 |
| `stato-ok` | esito positivo / fatto | 20 | 16 |
| `stato-pari` | esito Pari | 2 | 2 |
| `stato-perso` | esito Perso | 2 | 2 |
| `stato-primo` | primo / migliore | 2 | 2 |
| `stato-risposta-giusta` | risposta giusta | 9 | 5 |
| `stato-risposta-omessa` | risposta omessa | 5 | 3 |
| `stato-risposta-sbagliata` | risposta sbagliata | 10 | 7 |
| `stato-vinto` | esito Vinto | 2 | 2 |
| `stima-campione` | FoglioStima: campione | 1 | 1 |
| `stima-escluso` | FoglioStima: cosa non entra | 1 | 1 |
| `stima-garanzia` | FoglioStima: non è una previsione | 1 | 1 |
| `stima-intervallo` | FoglioStima: punteggio probabile | 1 | 1 |
| `stima-miglioramento` | FoglioStima: migliora con le simulazioni | 1 | 1 |
| `stima-modello` | modello della stima | 2 | 2 |
| `storico` | storico simulazioni | 1 | 1 |
| `studia` | avvia studio / esercizi / lezione | 13 | 11 |
| `suggerimento` | suggerimento / consiglio | 2 | 2 |
| `suoni` | suoni | 1 | 1 |
| `telegram` | canale Telegram | 1 | 1 |
| `tema-chiaro` | tema chiaro | 1 | 1 |
| `tema-scuro` | tema scuro | 1 | 1 |
| `tema-sistema` | tema di sistema | 1 | 1 |
| `tempo` | tempo / durata | 21 | 16 |
| `teoria` | teoria | 6 | 5 |
| `teoria-esempi` | sezione Esempi | 1 | 1 |
| `teoria-regola` | regola / grammatica | 2 | 2 |
| `trend-giu` | in calo | 2 | 2 |
| `trend-su` | in aumento | 2 | 2 |
| `trend-uguale` | invariato | 1 | 1 |
| `verifica` | passo Verifica | 1 | 1 |
| `whatsapp` | canale WhatsApp | 1 | 1 |

Non usate (24, tutte del registro, nessuna funzione dichiarata): `andamento calendario codice dati debug esame fiducia-alta fiducia-bassa fiducia-media gratis legale lezioni minuti-giorno ofa panoramica partecipanti pass ricontrolla scadenza scadenze-piano stato-link-rotto stato-non-attivo suoni-spenti tema` (alcune hanno nomi vecchi, `pass` e `gratis`: non toccate, non visibili).

## Controlli e numeri
- `cd app && npx tsc --noEmit`: 0 errori.
- `npm test` dalla radice: 316 prove, 312 verdi, 4 saltate (come prima), 0 rosse (erano 311/307: +5 prove nuove; aggiornata la prova del profilo sull'avatar).
- `node tools/genera-icone.mjs`: «178 icone, 178 file svg», nessun doppione (erano 145: +33 nomi, cioè i 19 badge e le nuove funzioni; `stato-incluso` e `garanzia` sono stati rinominati `selezionato` e `stato-pari`).
- `python3 tools/controlla-illustrazioni.py`: 88 nel catalogo, 36 usate, 52 non usate con motivo, 0 senza motivo. Il controllo è testuale: segnala `kit-blu/stati/messaggi` come «usata» per via dell'icona omonima `messaggi` (falso positivo; il compilatore lo dà non usato).
- `python3 tools/controlla-testo.py --base http://localhost:5297` (vite su 5297): 0 blocchi lunghi in 13 viste chiare e 7 scure.
- Contrasto: `tools/controlla-contrasto.py` percorre solo la landing della demo (0 violazioni, chiaro e scuro); sulle schermate toccate l'ho eseguito con la sua funzione `controlla` su 24 viste a 400 px, chiaro e scuro (48 pagine): 0 violazioni.
- Screenshot a 400 px, 2600 px di altezza, tema chiaro e scuro, letti a occhio: Home, Profilo, Modifica profilo (con un vecchio avatar salvato `successo`), Badge, Percorso, dettaglio lezione, Teoria (elenco e scheda), Sfide (oggi), Amici, Classifica, esito del duello (vinto, pari, perso, in attesa) e della sfida del giorno, intro sfida, Noi, Community, Project ID, Agorà, Simulazioni, Faq, Offline, Esercizi, landing, fine sessione di studio (400 × 1500), onboarding (pain, gain, «Da dove parti», prima domanda, e le schermate scuola, sede, livello, corso). Console: 0 errori in tutte; nessun overflow orizzontale (scrollWidth = 400).
- Script di audit (scratchpad: `usi.mjs`, `funzioni.py`, `audit.py`, uscita in `audit.txt`): ESITO OK, nessun nome senza funzione dichiarata, nessuna funzione per due nomi, nessun nome dichiarato «non usato» ma usato né il contrario.

## Cosa non ho provato
- Onboarding: le schermate «Come ci hai conosciuto» e «Le tue scelte» (consensi) con l'icona grande non le ho raggiunte in Chromium (ho visto livello, che usa lo stesso `EroeIcona`); passano tsc.
- `tools/controlla-animazioni.py` non parte qui (PIL non importabile in questo ambiente). Ho solo verificato a occhio e in console che `IllustrazioneAnimata nome="superamento"` in `EsitoSimulazione` renda; non ho visto l'animazione nel risultato di una simulazione superata (non ho giocato una simulazione).
- `npm run build:demo` passa; non ho riaperto il file demo a mano.
- Larghezza 1280 px non ripetuta per le schermate toccate (prova a 400 px).

## File da cancellare (non cancellati)
- `app/src/components/home/arte.ts` (svuotato, non più importato).
- `app/tests/unit/zz-dbg.test.ts` (era già «scratch di prova, DA CANCELLARE»).
- SVG di icona non più nel registro (generati, innocui): `app/src/brand/icone/svg/{calendar-check-2,bell-ring,box,boxes,credit-card,flask-conical,gift,infinity,key-round,lock-open,log-in,mail-check,messages-square,sparkles,tag,undo-2,user-check,users-round}.svg` (solo `calendar-check-2` è dovuto a questo lavoro).
