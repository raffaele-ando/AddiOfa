# Revisione D: profilo, statistiche, sfide, community, servizi, studio

Revisore esterno, solo sulle immagini. Base: `rev/app/{light,dark}-400/04-*.png` (25 schermate x 2 temi) e `{light,dark}-1280/04-{profilo,progressi,esplora,faq}.png`.

**Limite dichiarato.** Le PNG non sono a pagina intera: sono la sola finestra visibile (400x860 il telefono, 1280x800 il desktop). Non ho visto cosa c'è sotto la piega in Profilo (dopo «Presentazione»), Progressi («Livelli» in giù), Badge (le altre categorie), Project ID (avviso dopo «Project ID»), ATLAS (da «Cosa pesa»). «Offline» mostra lo stato «Connesso», non quello senza rete. Lezione-dettaglio, Sfida-risultato e Simulazione-dettaglio mostrano solo lo stato «non trovato». Giudico solo ciò che si vede. Dove un difetto potrebbe essere un residuo della cattura (hover, localizzazione del browser) lo scrivo.

---

## 1. Verdetto generale e voti

Il sistema ha una base buona: tipografia sicura (titoli extra-bold, corpo pulito), raggi coerenti, ritmo verticale regolare (16 px tra card, 24 px tra sezioni), illustrazioni 3D morbide con una famiglia riconoscibile, tema scuro curato nei dettagli. Il prodotto non sembra un generatore; sembra una cosa fatta con cura e poi lasciata a metà.

Il problema principale non è l'estetica, è la **leggibilità del significato**. Troppi pulsanti primari, filtri e metriche sono solo icone: un 18enne deve indovinare cosa fa un triangolo «play» a tutta larghezza o cosa conta una stellina con uno zero. Gli stati vuoti, di errore e offline sono tre mascotte diverse con titoli di due parole, senza dire cosa è successo. I numeri si contraddicono nella stessa schermata (0/116 e «Progressi 41%»; «Risposte 0» e «Media 24/30»; «41%» e «Ora ne hai 0»), e questo è il difetto che costa più fiducia.

Poi ci sono incoerenze di sistema che l'occhio professionale nota subito: due stili di controllo segmentato, tre posizioni dell'illustrazione di testa, icone-in-tessera mescolate a illustrazioni nelle stesse liste, un arcobaleno di tinte pastello (chiaro) che nel tema scuro diventa marrone, verde palude e melanzana. Su desktop l'app è un telefono dentro una scheda dentro la pagina: usa il 31% della larghezza.

Voto medio 5,5/10. Con le correzioni del §7 si arriva a 7,5-8 senza ridisegnare niente.

| Schermata | Chiaro | Scuro | Nota di una riga |
|---|---|---|---|
| profilo | 6 | 6 | tessere disallineate, «Progetto» ambiguo, 41% contro 0/116 |
| profilo-modifica | 5 | 5 | illustrazione tra etichetta e campo, nessun «Salva» visibile |
| progressi | 6 | 6 | metriche chiare ma grafico muto, tre segmenti senza parole |
| obiettivi | 6 | 6 | chip orfani, `mm/dd/yyyy`, metriche solo icona |
| badge | 6 | 6 | muro grigio, titoli su 3 righe, «0/10» in verde |
| faq | 6 | 6 | cinque filtri solo icona, tutte le domande in grassetto pieno |
| segnala | 6 | 6 | «Prepara» criptico, segnaposto uguale per ogni tipo |
| stato-vuoto | 4 | 4 | nuvola triste + «Niente da vedere», nessuna causa |
| offline | 4 | 4 | titolo «Connesso» con «i», nessuna frase |
| sfide (oggi) | 7 | 6 | buona gerarchia, tre card di peso diverso, «Il tuo nome» senza etichetta |
| sfida-gioco | 4 | 4 | 500 px di vuoto, «10» e «5 min» senza unità |
| sfida-risultato | 3 | 3 | pulsante primario vuoto (solo spade) |
| amici | 6 | 6 | il migliore degli stati vuoti, tono un po' amaro |
| classifica | 5 | 5 | vuoto dentro vuoto, CTA ripetuta |
| condividi | 3 | 3 | vicolo cieco senza azione |
| frasi | 6 | 6 | righe buone; lente che collide con l'intestazione, spiegazioni troncate |
| percorso | 6 | 5 | stessa tessera «carta d'identità» su 3 lezioni, riga attiva sporge |
| lezione-dettaglio | 5 | 5 | non trovato dentro una card, gli altri no |
| simulazioni | 5 | 5 | pulsante primario solo play, «25/30» con righello |
| simulazione-dettaglio | 3 | 3 | triangolo di avviso + pulsante vuoto |
| esplora | 7 | 5 | struttura ottima; in scuro colori sporchi |
| projectid | 7 | 7 | la lista migliore; sei icone di sei colori |
| atlas-analisi | 6 | 6 | calibro bello, testo gergale e incoerente |
| noi | 5 | 5 | si apre con un avviso, numeri in colori arbitrari |
| agora | 6 | 6 | sezione «In AddiOFA» che non contiene niente |
| desktop (profilo, progressi, esplora, faq) | 5 | 5 | colonna da 392 px in scheda da 766 px |

---

## 2. Problemi in ordine di gravità

### BLOCCANTI

**B1. Pulsanti primari senza etichetta.**
- Dove: `studio/Simulazioni.tsx`, il `Bottone` a tutta larghezza nella card blu in testa (solo ▷). `sfide/SfidaRisultato.tsx`, pulsante blu con sole spade incrociate. `studio/SimulazioneDettaglio.tsx`, pulsante blu con solo blocco appunti. Il codice conferma che l'etichetta c'è solo come `aria`.
- Cosa non va: l'azione principale della pagina non si capisce. «▷» sotto «30 / 15 min / 25/30» potrebbe voler dire «guarda il video», non «inizia». Nello stato di errore, un pulsante blu vuoto non dice dove porta. In `StatoPagina` gli altri pulsanti hanno il testo, quindi manca anche la coerenza.
- Correzione: ogni pulsante primario ha un verbo scritto, 15,5 px bold, altezza 52 px, icona facoltativa a sinistra (20 px). Testi pronti: Simulazioni «Inizia la simulazione»; Sfida-risultato «Vai alle sfide»; Simulazione-dettaglio «Vai alle simulazioni». Regola: mai un pulsante con la sola icona, salvo chiusura/indietro/info.

**B2. Numeri che si contraddicono nella stessa schermata.**
- Dove: Profilo, card in testa (`0/116` con barra vuota) e tessera «Progressi 41%». Progressi (`0` Risposte, `0 min` Tempo, ma `24/30` Media e due simulazioni). ATLAS (41% con «Stima su 60 risposte») contro il box «Ora ne hai 0». Obiettivi (`41%` e `0 min / 30 min`).
- Cosa non va: lo studente legge «0 risposte» e «41% di probabilità» insieme e conclude che l'app inventa. In Profilo «Progressi 41%» è in realtà la probabilità ATLAS, ma l'etichetta dice «progressi» e accanto c'è una barra vuota. Il «–» davanti a `0/116` non spiega niente. Nessun numero ha l'unità.
- Correzione: (1) separare due grandezze con due nomi fissi in tutta l'app: «Domande imparate» (0 di 116) e «Probabilità di superare» (41%). (2) La tessera di Profilo diventa «Progressi» con sottotitolo «0 domande imparate»; la probabilità sta solo in ATLAS e in Obiettivi, sempre con etichetta «Probabilità». (3) «Risposte 0 / Tempo 0 min» contano solo gli esercizi: dirlo, «Risposte (esercizi)», e mostrare la media come «Media simulazioni (2)». (4) Sotto 30 risposte totali, ATLAS non mostra il 41% grande: mostra «Stima poco affidabile» in grigio e il numero più piccolo (vedi F8). (5) Nel Profilo il `–` si toglie o diventa «Livello A1».

**B3. Stati vuoto, errore e offline che non dicono cosa è successo né cosa fare.**
- Dove: `servizi/StatoPagina.tsx` (usata da stato-vuoto, offline, lezione/sfida/simulazione non trovate), `sfide/Condividi.tsx`.
- Cosa non va: «Niente da vedere», «Niente da condividere.» e «Connesso (i)» sono titoli senza causa. Condividi non ha nessuna azione: vicolo cieco. «Connesso» con globo e due pulsanti («Riprendi», «Home») non dice se prima eri offline. La spiegazione è nascosta dietro la «i», che per un errore è l'informazione principale. Tre mascotte diverse per lo stesso concetto (nuvola, lente, triangolo di avviso in cerchio salmone) e titoli con e senza punto («Sfida non trovata.» / «Lezione non trovata»).
- Correzione: un solo componente con titolo (20 px/700, senza punto), **una riga di causa** (15 px, colore tenue, sempre visibile) e un pulsante con verbo. Testi pronti al §3. La «i» resta solo per approfondimenti.

### FORTI

**F1. Filtri e controlli segmentati fatti solo di icone.**
- Dove: `profilo/Progressi.tsx` (3 segmenti: griglia, radar, calendario), `profilo/Badge.tsx` (elenco, medaglia con spunta, cerchio), `servizi/Faq.tsx` (5 quadrati: elenco, matita-riga, manubrio, database, telefono), `studio/Frasi.tsx` (lista 612, stella 0, frecce 0, spunta 0).
- Cosa non va: il significato si indovina. «Cerchio vuoto» in Badge vuol dire «da ottenere»? «Database» in FAQ vuol dire «dati»? Nelle FAQ i pallini colorati davanti a ogni domanda (blu/ocra) rimandano al filtro, ma non c'è legenda. Fuori dal gioco di indovinare, sono anche poco accessibili.
- Correzione: etichetta di testo in ogni segmento (13 px, 600), icona facoltativa a sinistra (18 px). Progressi: «Panoramica · Argomenti · Calendario». Badge: «Tutti · Ottenuti · Da ottenere». FAQ: chip scorrevoli in orizzontale, altezza 40 px, solo testo con i nomi reali delle categorie (da adattare: «Tutte · Test · Esercizi · Dati · App»); togliere i pallini colorati o farli diventare un'etichetta grigia a destra. Frasi: «Tutte 612 · Preferite 0 · Da ripassare 0 · Imparate 0», scorrevoli.

**F2. Profilo: griglia disallineata e architettura da cassetto.**
- Dove: `profilo/Profilo.tsx`, le quattro tessere e le liste sotto.
- Cosa non va: le etichette stanno a quote diverse (Progressi y≈338, Obiettivi y≈347; Badge y≈511, Progetto y≈502) perché le tessere senza sottotitolo centrano il contenuto più in basso. Le quattro illustrazioni hanno peso ottico diverso (barre alte e leggere, bersaglio grande, fiocco con raggi, globo piccolo). «Progetto» non dice niente e porta a una pagina chiamata «Esplora», che contiene Project ID, ATLAS, NOI, Agorà: tre nomi per una stessa cosa. Nella lista sotto: FAQ ha un'illustrazione nuda, Segnala un'icona a tratto in tessera bianca, Presentazione un'illustrazione: tre trattamenti nelle prime tre righe. Il profilo mescola «io» (progressi, obiettivi, badge) e «app» (FAQ, segnala, presentazione, community).
- Correzione: tessere 2x2 di altezza fissa 148 px, illustrazione in una casella fissa di 56x56 px alta 20 px dal bordo, titolo sempre sulla stessa linea (16 px/700), riga di sottotitolo **sempre presente** (13 px, altezza riservata 18 px): Progressi «0 domande imparate», Obiettivi «30 min al giorno», Badge «2 di 19», Community «Account, NOI, Agorà». Rinominare «Progetto» in «Community». Sotto, un gruppo «Aiuto» con righe uniformi (vedi §4): FAQ, Segnala, Presentazione, tutte con tessera da 40 px e icona a tratto, non illustrazioni.

**F3. Illustrazione di testa: tre posizioni, altezze eccessive, collisioni.**
- Dove: centrata sotto il titolo (Progressi, Obiettivi, FAQ, Esplora, NOI, Agorà, Segnala, Project ID), a destra sovrapposta all'intestazione (Frasi: lente a x≈260-350 y≈25-110 con ombra che galleggia sopra la ricerca; Percorso: libri), assente (Sfide, Simulazioni).
- Cosa non va: consuma 90-120 px dei primi 860 dove servono i dati (FAQ: la prima risposta arriva a y=310; Frasi: a y=255). Nelle schermate a destra, l'illustrazione sembra un errore di layout. Le tre composizioni fanno sembrare le pagine fatte da mani diverse.
- Correzione: regola unica (§4). Illustrazione di testa **solo** in Esplora/Community, NOI e Agorà, centrata, 72 px. Nelle altre sparisce dall'intestazione (Progressi, Obiettivi, FAQ, Frasi, Percorso, Segnala, Project ID, Modifica). Dove si vuole tenere un segno, sta nella riga del titolo, a destra, 40 px, allineato in verticale al titolo, mai oltre l'altezza della riga. Si recuperano 90-100 px a schermata.

**F4. Stati vuoti: tre mascotte, tono triste, uno dentro l'altro.**
- Dove: nuvola triste (stato-vuoto, condividi, classifica, «Ultime sfide», sfide), lente (sfida/lezione), triangolo (simulazione), bolle (amici), globo (NOI non collegato).
- Cosa non va: la faccia triste dice allo studente che ha sbagliato qualcosa; «Nessun amico», «Nessuna classifica» e «Niente da vedere» sono negativi e secchi. In Sfide > Classifica ci sono due card vuote impilate, ognuna con la sua illustrazione. In «Ultime sfide» una nuvola da 90 px dentro una card per dire che non c'è nulla.
- Correzione: un solo componente con 3 varianti (§4). Per «ancora niente» una nuvola neutra senza faccia (o la stessa illustrazione dell'area, ridotta a 96 px); per «non trovato» la lente; per «offline» il globo. Voce: «Ancora nessun amico», «Nessuna classifica per ora» (evitare «presto» e «in arrivo»). In Sfide-oggi, «Ultime sfide» vuoto diventa una sola riga di testo tenue (15 px) senza illustrazione.

**F5. Esplora: arcobaleno pastello (chiaro), colori sporchi (scuro).**
- Dove: `progetto/Esplora.tsx`, le quattro card.
- Cosa non va: in chiaro quattro sfondi diversi (lilla, azzurro, menta, crema) fanno sembrare le quattro voci quattro prodotti senza legame; non c'è gerarchia fra loro. In scuro i tre pastello diventano melanzana (#2a1a3a circa), verde palude (#06301f) e marrone (#3a2a08): più saturi delle card neutre del resto dell'app, tonalità che non esistono altrove. Le pillole di stato dicono cose quasi uguali per significati diversi («Solo su questo dispositivo» / «Sul dispositivo»). Sottotitolo ATLAS «Il tuo livello», ma la pagina mostra una probabilità.
- Correzione: card tutte con la stessa superficie (`superficie-2`), illustrazione a sinistra in casella 64x64, **un solo** bordo sinistro di 3 px o un cerchio di 10 px nel colore del prodotto. Pillole in due soli stati: «Su questo dispositivo» e «Non attivo». Testi nuovi nel §3. Il footer «AddiOFA fa parte di Project…» resta, ma a 13 px e con contrasto 4,5:1.

**F6. Profilo-modifica: l'illustrazione spezza etichetta e campo.**
- Dove: `profilo/ProfiloModifica.tsx`, blocco «Corso».
- Cosa non va: tra l'etichetta «Corso» e il suo campo c'è un cappello da laureato di 96 px. L'etichetta resta orfana, il campo sembra appartenere all'immagine. I due campi mostrano «Studente» e «Ingegneria informatica» in grigio come segnaposto: non si capisce se sono valori. Sotto la piega non si vede un «Salva». Il selettore avatar ha 11 voci in 4 colonne: l'ultima riga ne ha 3 e un buco. L'anteprima grande da 96 px duplica la voce selezionata.
- Correzione: togliere il cappello (o spostarlo sopra tutto il modulo a 56 px). Etichetta sopra il campo a 8 px di distanza; valore reale in colore pieno, segnaposto in grigio più chiaro. Barra «Salva» fissa in basso (52 px, sopra la tab bar) e attiva solo se qualcosa è cambiato. Avatar: 12 voci (4x3) o 8 (4x2); anteprima rimossa, la voce selezionata fa da anteprima.

**F7. Segnala: pulsante criptico, segnaposto sbagliato, stato selezionato fuori sistema.**
- Dove: `servizi/Segnala.tsx`.
- Cosa non va: «Prepara» non dice cosa prepara. Il segnaposto «Cosa non va?» resta tale anche con «Idea» selezionata. La tessera selezionata ha bordo ambra (App), mentre ovunque nell'app la selezione è blu (chip minuti, filtro FAQ). Il pulsante disattivato è bianco su azzurro pallido (circa 1,8:1) e in scuro testo scuro su blu spento: illeggibile. «Spiegazione» riempie tutta la larghezza della tessera (circa 76 px su 82): a font ingranditi si taglia.
- Correzione: pulsante «Prepara l'email» (se è così che funziona; altrimenti «Invia segnalazione») con una riga sotto, 13 px: «Si apre la tua app di posta. Da qui non parte niente.» Segnaposto per tipo (§3). Selezione sempre blu: bordo 1,5 px `azione` e sfondo tinta 8%. Disattivato = stesso blu al 45% di opacità con testo bianco pieno. Tessere con etichetta a 13 px/600, padding 10 px, `Spiegazione` può andare su due righe.

**F8. ATLAS: gergo, incoerenza, ripetizione.**
- Dove: `progetto/AtlasAnalisi.tsx`.
- Cosa non va: «All'80 % di credibilità la probabilità sta tra 12 e 73 %» è statistica per addetti; lo spazio prima di «%» contrasta con «41%». Un 41% in grande ambra sopra «Stima su 60 risposte» mentre tre card sotto dicono che non c'è abbastanza dato: la prima impressione è più sicura della realtà. Le due card consecutive «Profilo» e «Da migliorare» dicono la stessa cosa (servono almeno 3 risposte). «Il radar», «il diagnostico» in «Cosa pesa» sono termini interni mai spiegati. Il calibro è bello ma grigio-ambra non dice se 41% sia basso o alto.
- Correzione: sotto il calibro due righe sole, 14 px: «Probabile al test: tra 22 e 26 su 30. Ne servono 25.» e «Stima poco precisa: si basa su 60 risposte.» L'intervallo 12-73% va in un «Dettagli» richiudibile. Fondere «Profilo» e «Da migliorare» in un'unica card «Profilo per argomento» (testo nel §3). «Cosa pesa» diventa «Come calcoliamo la stima» con tre punti brevi; via «diagnostico». Con poca base dati: numero 41% a 36 px in grigio con etichetta «provvisoria», non 56 px in ambra. Tutti i «%» senza spazio.

**F9. Desktop: telefono dentro scheda dentro pagina.**
- Dove: layout 1280 di Profilo, Progressi, Esplora, FAQ (`components/Layout.tsx` presumibilmente).
- Cosa non va: pagina #f8f9fd, scheda bianca 766x750 con raggio 24, colonna di contenuto da 392 px: il contenuto occupa il 31% della larghezza. In chiaro, la scheda bianca sul grigio quasi bianco ha bordo appena visibile. La tab bar si distribuisce su 766 px (Home x=385, Esercizi x=640, Sfide x=895) mentre il contenuto sta tra 444 e 836: le voci non si allineano alla colonna. La scheda taglia il contenuto a metà con la barra, come fosse uno schermo di telefono finto. Le illustrazioni di testa restano da telefono.
- Correzione, due strade. (a) Minima: scheda largo come la colonna (440 px max, centrata), sfondo pagina con tinta distinguibile (`#eef1f8` chiaro, `#0a0f1e` scuro già buono), tab bar della stessa larghezza della scheda. (b) Corretta: da 1024 px in su, barra di navigazione verticale a sinistra (72-200 px) e contenuto su due colonne (Profilo: card e tessere a sinistra, liste a destra; Progressi: panoramica a sinistra, grafici a destra), colonna massima 960 px.

**F10. Sfide: tre card di peso diverso, vocabolario confuso.**
- Dove: `sfide/Sfide.tsx`.
- Cosa non va: la card verde «Sfida del giorno» è una presenza forte; «Duello» e «Hai un link?» sembrano form da amministrazione. «Il tuo nome» è solo segnaposto: dopo averlo scritto non resta etichetta. «Sfida» (pulsante piccolo contorno), «Duello» (titolo), «Sfida un amico» (CTA in Amici): tre nomi per la stessa azione. Il pulsante-chevron disattivato in «Hai un link?» è un quadrato fantasma senza testo. «10» e «5 min» con icone senza unità («10» cosa?).
- Correzione: «Sfida del giorno» resta hero ma con «10 domande · 5 minuti» scritto. Le altre due card si fondono in una: «Sfida un amico» con campo etichettato e un'azione «Crea link»; la voce «Hai ricevuto un link?» diventa una riga più piccola sotto, con campo e «Apri». Vocabolario: «sfida» ovunque, «duello» si toglie.

**F11. Obiettivi: chip a capo orfani, metriche mute, data in formato americano.**
- Dove: `profilo/Obiettivi.tsx`.
- Cosa non va: i chip dei minuti vanno 5+2 (60 e 90 da soli sulla seconda riga), quelli delle probabilità 4+1 («90%» solo): ritmo rotto. Le metriche sotto («0 min / 30 min», «0/7», «41%» contro «70%» con icona bersaglio) non dicono cosa sono: 0/7 di cosa? 41% di cosa? Il campo data mostra `mm/dd/yyyy` (formato americano) con un calendario nativo: sull'app di italiani è un errore se non si adatta (se il browser è in italiano il campo mostrerà gg/mm/aaaa: verificare). In ogni caso manca il testo che spiega a cosa serve la data. I chip sono alti circa 34 px (sotto i 44 consigliati).
- Correzione: chip in griglia a colonne uguali: minuti 15-30-45-60-90 (5 colonne, gap 8, larghezza circa 57 px, altezza 44), probabilità 50-60-70-80-90 (5 colonne). Due righe sotto l'indicatore: «Oggi 0 di 30 minuti» e «0 giorni su 7 questa settimana». Probabilità: «Ora 41% · Obiettivo 70%» (due colonne con etichetta 12 px). Data: etichetta «Quando fai il test?» e riga «Ti diciamo quanti giorni mancano.»; dopo la scelta, «Mancano 42 giorni».

### MEDI

**M1. Due controlli segmentati e un tema scuro «affondato».** Progressi e Badge: traccia grigio-azzurra, segmento selezionato bianco con ombra leggera. Sfide: traccia identica ma selezionato con fondo azzurro e bordo blu. In scuro il segmento selezionato è più scuro della traccia (sembra premuto o disabilitato) mentre in chiaro è più chiaro (sembra sollevato): la logica è invertita. Correzione: un solo componente. Selezionato = riempimento `superficie` (bianco in chiaro, #1e2a47 in scuro, più chiaro della traccia), testo `azione` bold, nessun bordo.

**M2. Voci inattive della tab bar non uguali.** In tutte le schermate Home-attive «Esercizi» è grigio e «Sfide» quasi nero (bianco in scuro); in quelle di Sfide, «Esercizi» è più scuro di «Home». In `Navigazione.tsx` esiste `hover:text-testo`: è probabile che sia il puntatore rimasto sopra la voce nella cattura. Se è un residuo, nessun problema; se no, è un difetto che si vede su ogni schermata. Da verificare con puntatore fuori dalla barra.

**M3. Grafico «Risultati» (`profilo/StatisticheComponenti` e simili).** Asse x «1, 2» senza significato (meglio le date brevi «15 ott», «9 ott»). L'etichetta «22» si sovrappone alla linea tratteggiata. La soglia 25 non è scritta: aggiungere «25» a destra della linea. Colore incoerente con Simulazioni: nel grafico 22 è azzurro, nell'elenco è arancio-rosso. In scuro la barra sotto soglia è un azzurro pallidissimo (periwinkle) accanto a un verde saturo: due pesi diversi. Correzione: sopra soglia verde, sotto soglia ambra, stessi due colori ovunque (grafico, elenco, badge), stessa luminosità.

**M4. Badge: muro grigio.** Con 0 progresso la prima schermata è dieci card grigie quasi uguali: scoraggia. Titoli a 3 righe («Prima domanda imparata») fanno card di altezza diversa nella stessa riga. L'ultima riga ha una card sola (10 voci in 3 colonne). «0/10» accanto a «Studio» è verde: il verde dice «bene» e qui c'è zero. Barre da 4 px quasi invisibili. Correzione: in testa un blocco «Il prossimo badge» con il più vicino (barra da 8 px, testo «Ti mancano 25 domande»); griglia a card di altezza fissa con titolo su 2 righe max; «0 di 10» in colore tenue; il verde solo da 1 in su.

**M5. Percorso: tessere ripetute.** La carta d'identità si ripete 3 volte (There is, Aggettivi, Genitivo): sembra un segnaposto. In chiaro le miniature sono quadrati bianchi che, sulla riga attiva azzurra, danno l'impressione di casella spuntata; in scuro sono quadrati più scuri della riga. La riga attiva sporge oltre i 24 px di gutter (12-388) mentre le altre no. Il numero col orologio («7») non ha unità. «0/31» in grande e «0/11» in A1 senza etichetta. Correzione: miniature da 44 px con sfondo `superficie-2` a raggio 12, un'icona a tratto diversa per tema (non illustrazioni ripetute); riga attiva dentro il gutter, con barra sinistra da 3 px invece che sfondo pieno; «7 min» scritto; testata «0 di 31 lezioni», «A1 · 0 di 11».

**M6. Frasi: righe buone, dettaglio sprecato.** Le spiegazioni sono troncate a due righe con «…» a metà frase («participio...», «e si...»): si tronca proprio ciò che si studia. L'icona del cappello ripetuta in ogni riga è rumore. Correzione: spiegazione completa (max 3 righe, poi «Altro»), icona solo una volta come prefisso «Perché:» in tenue; stella con area di tocco 44x44.

**M7. Simulazioni: dettagli.** Le date sono del 2025 mentre oggi è ottobre 2026 (se è un dato di prova, ignorarlo; se è reale, mostrare l'anno solo se diverso da quello corrente). Gli orari sono in ambra senza motivo. L'icona rossa con X per il 22/30 è dura: scrivere «Sotto soglia» in ambra. «25/30» con righello senza spiegazione. Correzione: «30 domande · 15 minuti · si supera con 25»; righe con «26/30 Superata», «22/30 Sotto soglia (25)»; orario in colore tenue.

**M8. Project ID: sei tessere di sei colori.** Giallo, azzurro, verde, viola, viola, giallo: l'arcobaleno senza significato nella lista migliore dell'app. Titolo «La tua iscrizione» mentre la riga finale dice «L'iscrizione non è stata inviata». I «–» come valore. Il titolo «Project ID» ripetuto come sezione sotto il titolo della pagina; avviso ambra sotto la piega con «in questa versione» (suona da prodotto non finito). Correzione: tessere tutte neutre (`superficie` + icona `testo-tenue`), colore solo sulla pillola di stato; «–» diventa «Non indicato»; titolo «I tuoi dati».

**M9. NOI: si apre con un avviso.** Dopo il trofeo, il primo elemento è un riquadro ambra con «Non collegato», cioè la schermata comincia con un errore. Le due tessere numeriche usano verde per 0 e blu per 26/30 senza criterio. «Tra amici» è un pulsante grigio senza peso. Correzione: card neutra con icona «i» e una riga («La classifica NOI non è attiva su questo sito.»); i numeri nel colore del testo; «Tra amici» come pulsante secondario con testo «Classifica tra amici».

**M10. Agorà: sezione senza contenuto.** «In AddiOFA» è un'intestazione che introduce un avviso («Qui non ci sono discussioni…»): onesto, ma è un disclaimer travestito da sezione. «Messaggi» è in realtà una riga di impostazione (consenso), non una casella messaggi; con chevron fa pensare a una posta. L'icona globo sul pulsante primario non dice «si apre fuori». Correzione: pulsante «Apri su Instagram» con icona «apri esterno», sotto una nota da 13 px che assorbe l'avviso; sezione rinominata «Novità» con riga «Novità da Project e Agorà · Disattivate».

**M11. Sfida-gioco: contenuto in alto, 500 px di vuoto.** Illustrazione, titolo, «10» «5 min», «Inizia» occupano 300 px, il resto è vuoto. Nessuna spiegazione di come si gioca. Correzione: centrare il blocco in verticale (o fissare «Inizia la sfida» in basso, 52 px) e aggiungere una riga: «10 domande, 5 minuti. Rispondi più che puoi.» (testo da adattare alle regole reali).

**M12. Dimensioni minime.** Pillole di stato a 11 px bold (Esplora, Project ID), didascalie delle tessere Progressi 11 px («Risposte», «Tempo», «Media»), contatori Badge 12 px: sotto i 12 px non si legge bene su telefono in movimento e il contrasto delle didascalie sul fondo colorato (grigio su azzurro/crema) è circa 4:1. Chip e icone «i» sono ≈32-34 px: area di tocco minima 44x44. Correzione: minimo 12 px dappertutto (13 px per le didascalie), area di tocco 44 px con padding trasparente.

### RIFINITURE

- «Modifica» come titolo: «Modifica profilo». «Simulazione» come titolo del dettaglio: «Simulazione 2».
- Azioni in alto a destra: ingranaggio (Profilo), «i» (FAQ, Segnala, Simulazioni, Sfide), figura (Sfide) e niente altrove. Un solo significato per ogni icona; la figura di Sfide va allo stesso posto del profilo e sembra un avatar: usare lo stesso disegno dell'avatar scelto.
- Domande FAQ in grassetto pieno su otto righe consecutive: pesantissimo. Peso 600, 15 px, risposta in 400.
- Il nome predefinito «Studente» compare come valore reale in Profilo: meglio «Aggiungi il tuo nome» in tenue finché non c'è.
- Il footer «AddiOFA fa parte di Project, insieme a NOI, ATLAS e Agorà…» è ripetuto in Esplora e Agorà: tenerlo una volta (Esplora).
- Titoli di stato con o senza punto finale: nessun punto.
- Il pulsante «Indietro» a tutta larghezza di Stato-vuoto sta a y≈470, a metà schermo: ok, ma la regola vale per tutte (vedi §4).
- Bordi: le card di Sfide-amici/classifica hanno bordo 1 px, quelle di Profilo no: scegliere (consiglio: 1 px `bordo` a bassa opacità su tutte in scuro; nessuno in chiaro).

---

## 3. Revisione dei testi, schermata per schermata

Principi: frase intera dove serve, un solo concetto per riga, unità sempre scritta («domande», «min», «giorni»), verbo all'infinito o imperativo sui pulsanti, «tu» informale, mai «presto», «in arrivo», «beta», «dimostrativo», «Pass», «Sblocca». Tono onesto quando una funzione non è attiva (la regola del repository).

**Profilo**
- Nome vuoto: «Aggiungi il tuo nome». Sotto: «0 di 116 domande imparate» al posto di `– 0/116`.
- Tessere: «Progressi» / «0 domande imparate»; «Obiettivi» / «30 min al giorno»; «Badge» / «2 di 19»; «Community» (era «Progetto») / «Account, NOI, Agorà».
- Gruppo «Aiuto»: «Domande frequenti», «Segnala un problema o un'idea», «Cos'è AddiOFA».

**Profilo-modifica**
- Titolo «Modifica profilo». Etichette «Avatar», «Nome», «Corso di studi». Segnaposto: «Come ti chiami?» e «Es. Ingegneria informatica». Pulsante «Salva».

**Progressi**
- Segmenti: «Panoramica · Argomenti · Calendario».
- Tessere: «Risposte» / «Tempo di studio» / «Media simulazioni». Sezione «Risultati» → «Ultime simulazioni»; sotto, 12 px: «Linea tratteggiata: soglia 25». «Livelli» → «Per livello».

**Obiettivi**
- «Quando fai il test?» / «Ti diciamo quanti giorni mancano.»
- «Quanto studi al giorno» / «Oggi 0 di 30 minuti» / «0 giorni su 7 questa settimana».
- «Probabilità di superare il test» / «Ora 41% · Obiettivo 70%» (al posto di «Probabilità» con due numeri senza nome).

**Badge**
- Segmenti: «Tutti · Ottenuti · Da ottenere». In testa: «Il prossimo: 25 domande imparate · ti mancano 25». Sezione: «Studio · 0 di 10».

**FAQ**
- Domande più chiare: «La probabilità che vedo è una promessa?» → «La probabilità è una garanzia di passare?»; «Il test lo faccio con AddiOFA?» → «Il test ufficiale lo faccio su AddiOFA?»; «Ho già una certificazione o ho già fatto il test: cosa cambia?» → «Ho già una certificazione: devo fare il test?». Segnaposto di ricerca: «Cerca nelle domande».

**Segnala**
- Pulsante: «Prepara l'email» (se apre la posta) con sotto «Si apre la tua app di posta. Da qui non parte niente.»
- Segnaposto per tipo: Domanda «Quale domanda ha un problema, e cosa non torna?»; Spiegazione «Quale spiegazione non è chiara?»; App «Cosa non funziona, e su che telefono?»; Idea «Cosa vorresti trovare in AddiOFA?».

**Stato vuoto, offline, non trovato**
- Stato-vuoto: «Questa pagina non esiste» / «Il link potrebbe essere vecchio.» / «Torna indietro».
- Sfida non trovata: «Sfida non trovata» / «Il link non è valido o la sfida non è più disponibile.» / «Vai alle sfide».
- Simulazione non trovata: «Simulazione non trovata» / «Non è più salvata su questo dispositivo.» / «Vai alle simulazioni».
- Lezione non trovata: «Lezione non trovata» / «Scegline un'altra dal percorso.» / «Apri il percorso».
- Condividi: «Niente da condividere» / «Fai una simulazione o una sfida: poi puoi mandare il risultato.» / «Fai una simulazione».
- Offline vero: «Sei offline» / «Domande, correzione e progressi funzionano lo stesso. Sfide e classifica servono la rete.» / «Continua a studiare».
- Di nuovo connesso: «Sei di nuovo online» / pulsanti «Riprendi da dove eri» e «Vai alla Home». Via la «i».

**Sfide**
- Tab: «Oggi · Amici · Classifica». Hero: «Sfida del giorno» / «10 domande · 5 minuti» / «Inizia».
- Card unica «Sfida un amico»: etichetta «Il tuo nome» (sopra il campo), aiuto «Crea un link e mandalo a chi vuoi sfidare.», pulsante «Crea link».
- Riga «Hai ricevuto una sfida?» / segnaposto «Incolla qui il link» / pulsante «Apri».
- «Ultime sfide» vuoto: «Non hai ancora giocato sfide.»
- Amici vuoto: «Ancora nessun amico» / «Gli amici compaiono dopo la prima sfida a due.» / «Sfida un amico».
- Classifica: card «Nessuna classifica per ora» / «Nasce dalla prima sfida a due.» (senza CTA, già in Amici); sezione «Classifica NOI» / «Non attiva su questo sito. Vedi solo la classifica con i tuoi amici.»
- Sfida-gioco: titolo «Sfida del giorno», «10 domande · 5 minuti», aiuto «Rispondi più che puoi.», pulsante «Inizia la sfida».

**Frasi**
- Filtri: «Tutte 612 · Preferite 0 · Da ripassare 0 · Imparate 0». Ricerca «Cerca una frase». La spiegazione intera, senza «…».

**Percorso**
- Testata: «0 di 31 lezioni» / «Inizia dalla prima: Present Simple» / pulsante «Inizia». Livello «A1 · 0 di 11». Durata «7 min».

**Simulazioni**
- «Simulazione completa» / «30 domande · 15 minuti · si supera con 25» / «Inizia la simulazione». Elenco «Svolte» / «Migliore 26/30». Riga: «26/30 · Superata» e «22/30 · Sotto soglia (25)».

**Esplora (titolo «Community»)**
- Introduzione, 14 px: «Account, classifica e community per chi prepara l'OFA.»
- «Project ID» / «Il tuo profilo di iscrizione» / pillola «Su questo dispositivo».
- «ATLAS» / «Quanto sei pronto/a» / «Su questo dispositivo».
- «NOI» / «Classifica degli studenti» / «Non attiva».
- «Agorà» / «Idee e domande tra studenti» / «Instagram».

**Project ID**
- Sezione «I tuoi dati». Righe: «Email PoliMi · Non verificata», «Nome», «Corso di studi», «Come ci hai conosciuto», «Consensi · Nessun consenso dato», «Stato · Non inviata» con «I tuoi dati sono solo su questo dispositivo.» Valori vuoti: «Non indicato». Pulsante «Modifica i dati». Avviso: «Il collegamento ad ATLAS non è attivo: i dati non sono stati inviati e restano su questo dispositivo.»

**ATLAS**
- «Probabilità stimata di superare il test» / «Probabile al test: tra 22 e 26 su 30. Ne servono 25.» / «Stima poco precisa: si basa su 60 risposte.» Dettagli richiudibili: «Intervallo di affidabilità (80%): 12-73%».
- Card unica «Profilo per argomento»: «Compare quando hai risposto ad almeno 3 domande in 3 argomenti. Ora: 0 argomenti.»
- «Cosa pesa» → «Come calcoliamo la stima»: «Contano soprattutto le simulazioni più recenti. Più rispondi, più la stima si stringe.»

**NOI**
- Card neutra: «La classifica NOI non è attiva su questo sito.» / «I tuoi numeri restano su questo dispositivo.»
- «I tuoi numeri»: «0 domande imparate», «26/30 miglior simulazione». Nota: «Alla classifica arrivano solo se aderisci.» Pulsante «Classifica tra amici».

**Agorà**
- Pulsante «Apri su Instagram» (icona «apri esterno»), sotto 13 px: «Si apre Instagram, fuori da AddiOFA: valgono le sue regole. Qui non ci sono commenti né utenti.»
- Sezione «Novità» / riga «Novità da Project e Agorà» / stato «Disattivate: non hai dato il consenso.»

---

## 4. Coerenza del sistema: regole uniche proposte

**Scheletro di pagina.** Intestazione: freccia indietro con area 44x44, titolo 26/800, **una sola** azione a destra. Contenuto con gutter 24 px; blocchi separati da 16 px, sezioni da 24 px. Titolo di sezione 16/700, nessuna icona davanti (le icone stanno nelle card). Le pagine radice (Sfide, Home, Esercizi) senza freccia.

**Card.** Un solo raggio per le card (16), uno per le tessere interne (12), uno per i pulsanti (14), pill 999 per i chip. Padding interno 16. Superficie `superficie-2` in chiaro con nessun bordo; in scuro lo stesso con bordo 1 px a bassa opacità (la separazione dal fondo oggi è troppo debole). Un solo sfondo tinta per schermata: l'unica card «hero» (es. Sfida del giorno). Mai quattro card pastello diverse in fila.

**Righe (liste).** Altezza minima 56 px, tessera iniziale 40x40 (raggio 12) con icona a tratto 22 px nel colore del testo tenue, titolo 15/600, sottotitolo 13/400 tenue, chevron finale 20 px. Divisore inset di 56 px. Sempre così per FAQ/Segnala/Presentazione, Project ID, Agorà, liste di impostazione. Niente illustrazioni nelle righe di lista, tranne le miniature delle lezioni (e in tal caso diverse tra loro, mai ripetute).

**Icone contro illustrazioni.** Icone a tratto (24 px, 1,75) per azioni, metadati, navigazione, righe. Illustrazioni per tre soli usi: destinazioni principali (tessere di Profilo, card di Esplora), testata di 3 pagine (Community, NOI, Agorà) e stati vuoti/errore. Taglie fisse: 120 (stati), 72 (testata), 56 (tessera). Nessuna illustrazione tra etichetta e campo; nessuna illustrazione ripetuta per contenuti diversi.

**Colore.** Un accento (blu) per primario, selezione e link. Verde/ambra solo per esiti reali (superata/sotto soglia/avviso) e mai su zeri. Le tinte categoria (FAQ, Segnala, Project ID) si riducono a un'unica tinta neutra: la categoria si legge dall'icona e dall'etichetta, non dal colore. Il testo secondario deve restare ≥4,5:1 sul proprio fondo.

**Controlli segmentati e chip.** Un componente solo: traccia `superficie-2`, selezione con riempimento più chiaro, testo `azione`, etichetta sempre presente (icona facoltativa). Chip di scelta in griglia a colonne uguali, altezza 44, selezione blu tenue con bordo 1,5 px. Mai più di 5 per riga; oltre, scorrimento orizzontale con bordo sfumato.

**Pulsanti.** Primario 52 px a tutta larghezza, uno per schermata, sempre con verbo; secondario stessa altezza su `superficie-2`; ghost solo dentro le card. Disattivato: stessa forma, opacità 45%, testo pieno. Pulsanti piccoli in riga (come «Sfida») 44 px minimo.

**Stati vuoto/errore/offline.** Un solo componente `StatoPagina` con tre varianti: «vuoto» (illustrazione neutra, 96 px), «non trovato» (lente), «offline» (globo). Struttura fissa: illustrazione, titolo 20/700 senza punto, **una riga di causa** 15 px tenue, un pulsante con verbo. Centrato in verticale quando occupa tutta la pagina; dentro una card solo quando fa parte di un elenco, e in quel caso senza illustrazione (una riga di testo). Mai una faccia triste. Mai due stati vuoti impilati.

**Pillole di stato.** Tre soli valori: «Su questo dispositivo», «Non attivo», e il nome del servizio esterno («Instagram»). 12 px/600, padding 4x10, nessun colore proprio: colore solo per «Non attivo» (ambra tenue).

**Numeri.** Valore sempre con la sua unità o etichetta: «0 domande imparate», «30 min», «0 giorni su 7». «%» attaccato al numero. Un numero con significato diverso ha un nome diverso (domande imparate, probabilità, media simulazioni).

---

## 5. Differenze chiaro/scuro

- **Superfici.** In scuro le card (#16203a circa) differiscono dal fondo (#111a2e) di pochi punti e quasi nessuna ha bordo: Profilo, Obiettivi, Progressi si fondono col fondo. In chiaro funziona meglio (card #f1f4fc su bianco). Correzione: bordo 1 px (alpha 8-10%) su tutte le card in scuro, e +2 punti di luminosità alle card.
- **Card tinta.** In chiaro sono pastello gentili; in scuro le stesse diventano marrone, verde palude, melanzana: più sature delle card neutre. Succede in Esplora, nelle tessere di Progressi, nell'hero di Sfide e negli avvisi (NOI, Project ID). Correzione: in scuro, superficie neutra con 1 px di bordo nel colore e icona/numero colorato, non sfondo pieno.
- **Segmenti selezionati.** In chiaro sollevato (bianco), in scuro affondato (più scuro della traccia). Vedi M1.
- **Pulsanti primari.** In scuro il blu diventa azzurro chiaro con testo scuro: contrasto buono, ma le icone dentro i pulsanti sono nere su azzurro e sembrano di un altro set. Provare testo e icona #0b1020 al 100% e `azione` leggermente più saturo (#4f8cff).
- **Illustrazioni.** Le versioni scure sono ben fatte (tessera d'identità scura, bolle scure), ma la carta d'identità della testata di Profilo e dei Progressi si perde: contrasto insufficiente con la card. In Percorso le miniature sono quadrati più scuri della riga (visibili come cassette), in chiaro quadrati bianchi.
- **Badge bloccati.** In scuro l'illustrazione grigia su tessera quasi nera ha contrasto molto basso (circa 2:1): sembra assente, non bloccata. Alzare la luminosità dell'icona bloccata e aggiungere un lucchetto da 16 px.
- **Grafico.** Barra sotto soglia: azzurro pallidissimo in scuro contro verde saturo; in chiaro azzurro medio. Stessa luminosità percepita per i due stati.
- **Tab bar.** Sfide quasi bianco in scuro vs quasi nero in chiaro mentre le altre sono grigie: vedi M2 (probabile hover).
- **Disabilitato.** In chiaro testo bianco su azzurro pallido, in scuro testo scuro su blu spento: in entrambi poco leggibile. Vedi F7.
- **Aspetto generale.** Il tema scuro è più elegante in alcuni punti (calibro ATLAS ambra su navy, Sfide) ma meno coerente nei colori tinta. Il tema chiaro è più uniforme ma meno «caldo».

---

## 6. Cosa funziona e va tenuto

- La **tipografia**: titoli 26-28 px extra-bold con tracking stretto, corpo pulito, buon contrasto. Dà subito un tono sicuro.
- Il **ritmo verticale** di 16/24 px e i raggi coerenti: le schermate si leggono in ordine senza fatica.
- L'**illustrazione** come famiglia: morbida, volumetrica, riconoscibile, con versioni scure dedicate.
- **Project ID**: la lista di righe con etichetta piccola sopra e valore in grassetto è il miglior componente dell'app (da portare ovunque).
- **Amici** (stato vuoto con illustrazione, titolo, una riga, CTA): il modello da usare per tutti gli stati.
- **Frasi**: righe-card con frase in inglese in grassetto e spiegazione sotto; densità giusta e stella ben posta.
- Il **calibro ATLAS**: numero grande, etichetta, scala visiva; l'idea è forte e riconoscibile.
- La **sfida del giorno**: card con trofeo, due dati, un solo pulsante.
- **Onestà** dei testi sui servizi non attivi: dichiarare «non collegato» e «non hai dato il consenso» è la scelta giusta; va solo detta con parole da studente.
- **Esplora** come indice: quattro voci, illustrazione, sottotitolo, pillola di stato, chevron. Struttura ottima, serve solo ripulire il colore.
- **Nessuna animazione** decorativa, nessun contatore che sale: l'interfaccia è calma e credibile.
- La **tab bar** a tre voci (Home, Esercizi, Sfide): semplice e chiara.

---

## 7. Le cinque modifiche che alzano di più la qualità percepita

1. **Etichette di parole su ogni pulsante primario, segmento e filtro** (B1, F1). Costo basso, effetto massimo: l'app smette di chiedere di indovinare. Pulsanti primari con verbo («Inizia la simulazione», «Vai alle sfide»), segmenti di Progressi/Badge e filtri di FAQ/Frasi con testo.
2. **Un solo componente per stati vuoto, errore e offline, con una riga di causa vera** (B3, F4). Via la nuvola triste e le tre mascotte diverse; titolo, causa, pulsante con verbo; testi del §3. Sistema in un colpo sei schermate con voto 3-4.
3. **Riconciliare i numeri e riscrivere i testi gergali** (B2, F8, §3). Due grandezze con due nomi («Domande imparate», «Probabilità»), unità sempre scritte, ATLAS senza «credibilità/diagnostico/radar» e con numero grigio «provvisorio» sotto la soglia di dati. È il cambiamento che recupera la fiducia.
4. **Rifare Profilo ed Esplora/Community come le due porte d'ingresso** (F2, F5). Tessere allineate con sottotitolo sempre presente, «Progetto» → «Community», gruppo «Aiuto» con righe uniformi, card di Esplora tutte con la stessa superficie e pillole in due stati. Sono le schermate che tutti vedono per prime.
5. **Regole di superficie e illustrazione** (F3, §4, §5). Illustrazione di testa solo in tre pagine e a 72 px (si recuperano 90-100 px a schermata), un solo controllo segmentato, un solo accento, tinte scure neutre con bordo 1 px al posto delle tinte marrone/palude/melanzana. Per il desktop: scheda a larghezza della colonna o, meglio, navigazione laterale e due colonne da 1024 px (F9).
