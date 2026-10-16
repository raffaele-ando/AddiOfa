# Intuitivo, Home e Profilo (agente INTUITIVO-A)

Porta di prova 5241. Registro icone: `app/src/brand/icone/registro/profilo.json`. Screenshot: `docs/lavoro/extra/intuitivo/profilo/prima/` (codice precedente, 400 px chiaro) e `dopo/` (stato ricco e povero, chiaro e scuro, 400 e 1280 px).

## Cosa ho tolto, spostato, unito (funzione → posto)

| Prima | Dopo |
|---|---|
| Home: banner con titolo + frase, pulsante con 4 etichette diverse, «Vedi percorso», frasi di aiuto sotto il grafico, invito a fare una simulazione | Marchio + profilo, misuratore con la «i» (calcolo), fascia di stato (icona + 1-2 parole, non cliccabile), UN pulsante ▶ («Diagnostico» a chi non ha mai fatto il diagnostico, «Continua» agli altri), prossima lezione, andamento |
| Profilo: 4 tessere di numeri, riga Livello con frasi, carta Pass con frase, due gruppi di 10 righe (Obiettivi, Calendario, Badge, Attività, Statistiche, Sfide, Amici, Classifica, Inviti, Esplora) | Testata (avatar, nome, livello icona + valore, Pass icona + stato), ingranaggio → Impostazioni, 5 tessere icona + una parola: Progressi, Obiettivi, Badge, Pass, Project ID. Sfide, Amici, Classifica stanno solo in Simulazioni |
| `statistiche`, `atlas-analisi`, `calendario`, `attivita` | `progressi`: selettore a sole icone, 3 sezioni (panoramica = ex StatsMode, argomenti = radar e barre dell'ex analisi, calendario = mese + attività a barre) |
| Statistiche duplicate in StatsMode (per argomento, obiettivi, costanza, grafico delle stime) | Tolte dalla panoramica: per argomento sta in «argomenti», obiettivi in Profilo > Obiettivi, costanza in «calendario», andamento della probabilità solo in Home |
| Riga Inviti, `accesso-sbloccato`, riga «Il tuo Pass» di Impostazioni, «Sblocca il Pass in prova» di Impostazioni | `pass`: stato, scadenza, Scopri, Prova (solo demo), inviti (codice, copia, condividi → `vai('condividi')`), tre compagni, «Hai un codice?», blocco «Sbloccato». La vista `invites` di App mostra lo stesso contenuto (`CorpoPass`): punto di accesso unico |
| `projectid`, `noi`, `agora`, `esplora` (4 schermate lunghe) | `projectid`: tre righe-icona con icona di stato e «i» (foglio con la spiegazione onesta). `noi`, `agora`, `esplora` tolte dal registro |
| Impostazioni: 7 sezioni con titoli, note e righe lunghe (Promemoria, Il tuo Pass, Account, Obiettivo giornaliero...) | Righe icona + una parola: Tema (3 icone), Suoni (interruttore), Materiale (2 icone, la seconda con lucchetto porta al Pass), Dati (importa, esporta o copia, cancella), FAQ, Segnala, Versione (+ «i»), Termini, Privacy, Cookie, Recesso, Presentazione. Promemoria, Pass e Obiettivo giornaliero tolti (sono in Profilo) |
| `faq`, `segnala`, `stato-vuoto`, `offline` | FAQ: categorie a icone, risposte intatte (`data-testo-ok`); Segnala: 4 tipi a icone, un campo, un pulsante; stati: illustrazione + 2-3 parole + azioni con icona; avvertenze dietro la «i» |

## Icone (funzione → lucide), registro `profilo.json`

Riuso dei nomi altrui: `tempo`, `teoria`, `riprova`, `stato-risposta-giusta`/`-sbagliata`, `stato-da-iniziare`, `filtro-tutte` (studio); `espandi` (prove); `cookie`, `recesso` (ingresso); `home`, `studia`, `pass`, `blocco`, `info`, `indietro`, `avanti`, `chiudi`, `cerca`, `profilo`, `impostazioni`, `lezioni`, `simulazioni` (base).

| Funzione | Icona | Funzione | Icona |
|---|---|---|---|
| progressi | chart-column-increasing | obiettivi | goal |
| badge | award | projectid | fingerprint |
| modifica | pencil | livello | layers |
| andamento | chart-line | probabilita | percent |
| panoramica | layout-dashboard | argomenti | radar |
| calendario | calendar-days | diagnostico | activity |
| risposte | list-checks | accuratezza | chart-pie |
| imparate | check-check | giorni-studio | calendar-check |
| data-test | calendar-clock | minuti-giorno | timer |
| errori | circle-alert | dettaglio | rows-3 |
| filtro / ordina | funnel / arrow-up-down | trend-su / giu / uguale | arrow-up / arrow-down / equal |
| garanzia | handshake | scollega | unlink |
| inviti | gift | condividi | share-2 |
| copia | copy | codice | ticket |
| compagno | user-check | email-verificata | mail-check |
| scadenza | hourglass | sblocca | lock-open |
| usa-codice | key-round | classifica-noi | list-ordered |
| agora | messages-square | partecipanti | users-round |
| tema / chiaro / scuro / sistema | sun-moon / sun / moon / monitor | suoni / suoni-spenti | audio-lines / volume-x |
| materiale / nucleo / tutto | library / box / boxes | dati | database |
| esporta / importa / cancella | download / upload / trash-2 | faq | circle-question-mark |
| segnala | flag | documento / privacy / legale | file-text / eye-off / scale |
| presentazione | globe | accedi / esci | log-in / log-out |
| debug | terminal | app | smartphone |
| esame | pencil-ruler | segnala-domanda / spiegazione / app / idea | file-question-mark / message-square-warning / bug / message-square-plus |
| stato-ok | badge-check | stato-attenzione | triangle-alert |
| stato-errore | octagon-x | stato-non-attivo | power-off |
| stato-prova | flask-conical | stato-nuovo | sprout |
| stato-basso / medio | trending-up / gauge | stato-caricamento | loader-circle |
| stato-risposta-omessa | minus | | |

Fascia della Home: da iniziare = sprout, in partenza e da migliorare = trending-up (corallo), vicino = gauge (ambra), in linea = stato-ok (verde).

## Come l'ho fatto (decisioni)

- Nessun file che ho toccato importa più da `lucide-react` (verificato con grep). Colori sempre dai toni di `extra/ui.tsx`.
- Le spiegazioni oneste (come si calcola la stima, scadenze OFA, regole degli inviti, cosa condivide il Project ID, perché NOI e Agorà non sono attivi, perché la segnalazione non è inviata, bozze legali) sono dietro la «i» (`FoglioInfo`), con le parole di prima.
- Badge: la condizione si apre toccando il badge; in pagina solo figura, titolo, barra e «n/m» (nuovo campo `numeri` in `lib/profilo/badge.ts`).
- Progressi: parametro `sezione` (`panoramica|argomenti|calendario`) per aprirne una; `StatsMode` ha ora `incorporata` (solo corpo) e `onDiagnostico`.
- FAQ: le domande e le risposte sono contenuto (`data-testo-ok`); i collegamenti delle risposte puntano a `progressi` (sezione argomenti), `pass`, `projectid`, `segnala`.
- Impostazioni: «Informazioni» ha la versione e la «i»; i 4 testi legali hanno 4 icone diverse.
- Testo: titoli di sezione 1-2 parole; resta qualche etichetta da 3-4 parole che è un nome (titolo di una lezione, «Memoria a lungo termine», «Classifica NOI»).

## Richieste al coordinatore (App.tsx, contesto.tsx, altre aree)

1. `Menu` ha la nuova prop `onApriLezione`: App la passa già (riga `onApriLezione={id => vaiExtra('lezione-dettaglio', { id })}` è per StatsMode; per Menu serve la stessa riga). Senza, la prossima lezione apre la teoria come prima.
2. Diagnostico da Progressi: manca in `ExtraCtx` una funzione `avviaDiagnostico: () => setView('onboarding')`. `Progressi.tsx` la cerca (`ctx.avviaDiagnostico`) e, se manca, porta alla Home (per chi ha già fatto il diagnostico la Home non lo propone: il pulsante è quindi un vicolo cieco finché non la aggiungete).
3. `<Invites onBack={indietro} onOpenPaywall={() => apriPaywall('generico')} />` (altrimenti «Scopri» nella vista `invites` torna indietro).
4. La vista `stats` (StatsMode) resta compilabile ma non va più raggiunta: `Lezioni` ha ancora `onOpenStats={() => apri('stats')}` (da ritirare o da portare a `vaiExtra('progressi')`); App può togliere la vista `stats` quando Lezioni non la usa più.
5. Registro studio: ho tolto `statistiche` da `screens/extra/studio/index.ts` (una riga, fuori dalla mia lista, richiesta dal brief). `studio/Statistiche.tsx` resta come ponte non registrato.
6. `sfide/Classifica.tsx` linkava `vai('noi')`: ora deve linkare `vai('projectid')` (verificare che l'agente prove l'abbia fatto: nel mio grep non compare più).
7. File ormai vuoti o non usati, da cancellare a mano (non faccio `rm`): `screens/extra/profilo/{Calendario,Attivita}.tsx`, `screens/extra/servizi/{Noi,Agora,Esplora,AtlasAnalisi}.tsx`, `components/home/{Obiettivo,Serie,Strumenti}.tsx`, `lib/servizi/esplora.ts`, `screens/extra/studio/Statistiche.tsx`.
8. Non miei, con testo o icone da sistemare: `brand/Splash.tsx` (slogan di 6 parole, «Studia oggi, sblocca il tuo domani»), `components/FoglioStima.tsx` (importa ancora `lucide-react`), `tests/anteprime/home.tsx` (usa `BannerStato` con `onClick`: l'ho lasciato accettato e ignorato per non rompere `tsc`).

## Prove (numeri onesti)

Vedi la fine del file, sezione aggiornata dopo l'ultimo giro.
