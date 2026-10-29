# Revisione 18/10: agente PROFILO (profilo, sfide, servizi, progetto, Impostazioni, Legal)

Fonti: `docs/design/revisione/` (SINTESI.md vincolante, D, G4, C «Sfide», G5). Solo file del mio perimetro; niente git, niente rm.

## Cosa è cambiato

**Sistema unico (`screens/extra/ui.tsx`)**
- Pagina con fondo velato (`velata`) e card bianche (`Carta`: bordo, ombra leggera in chiaro, solo bordo in scuro; tinte per la sola card in evidenza, in scuro superficie + bordo colorato: niente marrone, palude, melanzana). Piè fisso opzionale (`piede`).
- Un solo controllo segmentato con le parole (`Segmenti`), un solo filtro a chip scorrevoli (`FiltriChip`), una sola riga di lista (`Riga`/`GruppoRighe`: tessera 40 px, titolo 15/600, sottotitolo 13), titolo di sezione 17/700 con «Vedi tutti» (`TitoloSezione`/`Sezione`).
- Scala tipografica: 26 / 17 / 15 (secondario 13, mai sotto 12). Raggi: card 16, tessere 12, pulsanti 14. Tocco ≥ 44 px (anche `PulsanteInfo`).
- `IconaTono`: in scuro fondo neutro (niente quadrati scuri attorno alle icone).
- Illustrazioni: solo stati vuoto/errore (96-112 px) e testata 72 px di Community, NOI, Agorà. Via la nuvola triste dal mio perimetro (lente = non trovato, globo = offline, messaggi = amici, coppa = classifica, grafico = progressi). Avatar in quadrato morbido (mai un cerchio attorno a un'illustrazione).
- `servizi/componenti.tsx`: `Vuoto` (stato vuoto in pagina: illustrazione, titolo, UNA riga di causa, azioni con verbo), pulsanti 52 px (primario/secondario), `Nota` neutra in scuro. `StatoPagina` ridisegnata (titolo 20/700, causa sempre visibile; stessa API, quindi vale anche per l'ErrorBoundary).

**Numeri (causa nel codice, non solo nel testo)**: nuova fonte unica `lib/profilo/numeri.ts` (`numeriUtente`), usata da Profilo, Progressi, Obiettivi e NOI (`valoriNoi` la richiama; ATLAS usa `calcolaStima`, la stessa della Home). Il banco è lo stesso della Home (`questions` = `poolMeta()`: tutte le 613 domande). Due grandezze con due nomi: «domande imparate» (isLearned, `N di 613`) e «probabilità» (calcolaStima). Cause trovate:
- «Progressi 41 %» era la probabilità sotto l'etichetta «Progressi»; «0/116» era il traguardo del livello A1 (60 % delle domande A1) senza nome: ora «Livello: verso A1, 14 di 116».
- «Risposte 0» conta le risposte date (statistiche delle domande), «Media 24/30» viene dallo storico: nello stato di prova dei revisori lo storico c'è e le statistiche no (dato di prova incoerente, non un bug di aggregazione). Ora le etichette dicono cosa sono («Media di 3 simulazioni»).
- ATLAS «stima su 60 risposte» (test di livello + simulazioni) e «ne hai 0» (argomenti con dati da allenamento) erano due basi con la stessa parola: ora «si basa su N risposte» (stima) e «Ora: N argomenti» (profilo per argomento).

**Profilo = cruscotto**: identità (tocco = modifica; senza nome «Aggiungi il tuo nome», niente «Studente»), scheda Project ID (valore e stato veri), striscia di 4 numeri (probabilità, domande imparate, miglior simulazione, badge; «–» solo dove un numero non esiste), «I tuoi progressi», «Obiettivi» (scheda «Superare il test»: la probabilità sale verso l'obiettivo), «Badge» (cinque in vista, ottenuti per primi, non ottenuti al 45 % e non grigi), Community, Aiuto, Informazioni. «Progetto» è diventato «Community» (titolo della schermata `esplora` e riga del Profilo; l'id resta `esplora`).

**Progressi**: segmenti a parole (Panoramica · Argomenti · Calendario); grafico «Probabilità di superare il test» con valore, ultimo punto scritto e obiettivo tratteggiato (solo con ≥ 2 misure vere, altrimenti una riga che dice cosa serve); tre numeri con nome; «Ultime simulazioni» con soglia scritta (colonna a destra), verde/ambra con parola e forma; «Per argomento» (tre più deboli), «Per livello», errori frequenti. `components/StatsMode.tsx` non è più usato da Progressi (il file resta, non è mio).
**Obiettivi**: scheda dell'obiettivo principale; campo data a tre menu Giorno/Mese/Anno (`CampoData.tsx`: il `type=date` nativo mostra mm/dd/yyyy nei browser in inglese, `lang` non basta; `index.html` ha già `lang="it"`); chip in griglia da 5 (minuti 15-30-45-60-90); nessuna illustrazione.
**Badge**: selettore Tutti · Ottenuti · Da ottenere; «Il prossimo badge» in testa; schede ad altezza fissa, titoli brevi in `lib/profilo/badge.ts` («Prima domanda», «25 domande»…), «0 di 10» neutro finché è zero.
**Profilo-modifica**: «Modifica profilo», etichette sopra i campi, nessun cappello, «Salva» fisso (attivo solo se cambia qualcosa), 12 avatar (aggiunto «Laurea»), anteprima rimossa.
**Sfide**: scheda «Sfida del giorno» in evidenza («10 domande · 5 minuti» scritto, «Gioca la sfida»), due righe uguali («Sfida un amico», «Ho ricevuto una sfida») con i campi di testo in un foglio (etichetta «Il tuo nome» sopra il campo), «Ultime sfide» vuote = una riga di testo; «duello» tolto dai titoli; esito con la parola (Vinto/Pari/Perso), chi perde non vede più il foglio con la croce; pagina «pronto» con blocco centrato e «Inizia la sfida» fisso; Amici, Classifica (podio solo con ≥ 3 persone vere, riga «Tu»), Classifica NOI = una riga neutra; Condividi senza vicolo cieco; nessun pulsante a sola icona (`Bottone` richiede il testo).
**Servizi**: FAQ con chip a parole (Tutte · Il test · Lo studio · I tuoi dati · L'app), domande 15/600 senza pallini, tre domande riformulate in `lib/servizi/faq.ts`; Segnala con selezione sempre blu, segnaposto per tipo, «Prepara il testo» + riga onesta («Non parte da qui: copi il testo e lo mandi tu»: l'app non apre la posta, per questo non «Prepara l'email»); Stato-vuoto («Questa pagina non esiste», causa, «Torna indietro»); Offline mostra davvero «Sei offline» quando `navigator.onLine` è falso (provato con rete spenta in Chromium) e «Sei di nuovo online» altrimenti.
**Progetto**: Community (card uguali, pillole «Su questo dispositivo / Non attivo / Instagram» + stati veri dell'iscrizione, avvertenza una volta sola); Project ID («I tuoi dati», «Non indicato», icone neutre); ATLAS in tre viste Probabilità · Argomenti · Piano (priorità con parola e forma), «Come calcoliamo la stima», pillola «Stima provvisoria» sotto 30 risposte, «%» sempre attaccato; NOI (nota neutra «Non attiva su questo sito», numeri neutri, «Classifica tra amici»); Agorà («Apri su Instagram», sezione «Novità»).
**Testi nuovi dal coordinatore**: «diagnostico» → «test di livello» in tutti i testi visibili del mio perimetro (anche `lib/servizi/faq.ts` e `analisi.ts`; test aggiornato). Intelligente/Prontuario non compaiono nelle mie schermate.
**Impostazioni/Legal**: tema con le parole, righe con testo per esporta/importa/cancella, fondo velato; Legal senza illustrazione, schede a 13 px.
**Barra in basso**: `DefSchermata.barra` ha il valore `'nessuna'` (registro.ts; App.tsx lo gestisce già), usato da profilo, profilo-modifica, progressi, obiettivi, badge, faq, segnala, stato-vuoto, offline, esplora, projectid, atlas-analisi, noi, agora.

## Richieste per file non miei
- `App.tsx`: le viste `impostazioni` e `legal` usano `conBarra('home', …)`: per non evidenziare Home dovrebbero usare `conBarra('nessuna', …)`.
- `components/home/Stima.tsx`/`Misuratore`: il numero grande ambra non diventa grigio con poca base dati; in ATLAS metto sopra la pillola «Stima provvisoria».
- Studio: `studio/Simulazioni.tsx` importa `Carta` da `sfide/comuni` (ora card bianca con bordo) e usa `SchedaProveSfide sezione="prove"` (fondo bianco; con `velata` prende il fondo velato).
- Chi usa ancora la nuvola triste `vuoto` fuori dal mio perimetro (studio, esito): sostituirla con l'illustrazione dell'area.
- `lib/studio/statistiche.ts` (tessereStatistiche, andamentoSimulazioni, formatTempoStudio) è importata dalla mia Panoramica: se cambiano firma, avvisarmi.

## Non applicato (e perché)
- **Dettaglio per domanda** (StatsMode) non più raggiungibile da Progressi: la panoramica ha «Errori più frequenti» e l'elenco per argomento; ripristinarlo richiede toccare StatsMode (non è mio).
- Sfere di vetro come icone di Esplora/Profilo (G5): escluse dalla SINTESI. «Streak», «pt», conto alla rovescia dei concept: scartati.
- Desktop a due colonne (D F9): è del Layout. «Copia» dell'ID (G4): non c'è un ID da mostrare finché ATLAS non è collegato (la scheda mostra `@handle` o lo stato vero). Mese a pallini (G4 2.12): c'è già il calendario in Progressi.

## Verifiche (numeri onesti)
Vedi la sezione «Esito» in fondo, scritta a prove finite.

## Esito (prove finite)
- `tsc --noEmit` pulito; `npm test` (dalla radice e da `app/`): 307 verdi, 0 falliti. Nuovo `tests/unit/profilo-numeri.test.ts`; aggiornato `servizi-analisi.test.ts` («test di livello»).
- `controlla-testo.py` (400 px, stato di prova): 0 blocchi > 5 parole in profilo, obiettivi, sfide, amici, classifica, agora, noi, esplora, projectid (le altre schermate erano già a 0).
- `controlla-contrasto.py` (390 px, chiaro e scuro, una schermata per volta con `--pagina …?vista=ID --solo-pagina`, stato vuoto): 18 schermate su 18, 0 violazioni, 0 errori in console. Non coperto: il contrasto con lo stato «con dati» (letto solo a occhio).
- Schermate a tutta altezza (viewport alto, build di produzione servita da cartella temporanea), 22 schermate (profilo, profilo-modifica, progressi, obiettivi, badge, faq, segnala, stato-vuoto, offline, offline con rete spenta, sfide, sfida-gioco, sfida-risultato (non trovata), amici, classifica, condividi, esplora, projectid, atlas-analisi, noi, agora, impostazioni, legal) a 400 e 1280 px, chiaro e scuro, con dati e a stato vuoto: tutte catturate, zero errori in console, nessun overflow orizzontale di pagina. Lette a occhio: a 400 px quasi tutte in chiaro e in scuro (con dati e vuoto); a 1280 px un campione (progressi, profilo-modifica, esplora, profilo).
- Corretti a vista durante le prove: titolo del Profilo senza nome troncato; «Soglia 25» sopra il valore 24 nel grafico delle simulazioni (ora colonna a destra, `whitespace-nowrap`); dodicesimo avatar che mostrava la lettera (ora «Laurea»).
- **Non provato**: sfida con risultato vero e duello con avversario (servono link veri: provati solo gli stati non trovato/vuoto), accesso Google/ATLAS online, tocco su touch reale, screen reader, Safari/Firefox (il campo data a menu è pensato per questo ma non l'ho visto lì), il grafico del Progressi dopo l'ultima correzione della soglia (ricostruito ma non ricatturato).
