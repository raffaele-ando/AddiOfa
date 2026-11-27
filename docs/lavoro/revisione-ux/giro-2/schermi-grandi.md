# Revisione UX giro 2: schermi grandi (768, 1280, 1440 px; chiaro e scuro)

Osservazioni scritte man mano, schermata per schermata. Schermate in scratchpad/ux/giro-2/schermi-grandi/.


Ripresa (secondo ispettore): il file conteneva solo l'intestazione; le schermate in scratchpad erano già scattate ma senza note. Rifatto il giro con `giro.py` (768x1024, 1280x800, 1440x900, chiaro e scuro, 40 schermi) più script di clic e scorrimento. Le schermate citate sono in `scratchpad/ux/giro-2/schermi-grandi/`.

## 1. Landing (`/?landing`, localStorage pulito)

Console: zero errori nei 6 casi. Nessuno scorrimento orizzontale. Clic provati a 1280 chiaro: le 4 voci della barra (Cos'è l'OFA, Come funziona, Il test, Domande) scorrono alla sezione giusta e la voce attiva si evidenzia; «Se non lo superi» e «Fonte e regole» aprono un foglio che si chiude con Esc e con la X; «Come usiamo i tuoi dati», Termini, Cookie aprono la pagina legale e Esc riporta alla landing.

- **Alta – testo sopra l'immagine illeggibile (768, chiaro e scuro).** Nella carta finale «Quanto sai davvero?» il paragrafo «…Poi scegli tu cosa ripassare» e il link «Vai all'app senza test» passano sopra la stella luminosa e il cielo chiaro: bianco su giallo/azzurro chiaro, «scegli» quasi sparisce. A 1280/1440 il testo resta sul blu e si legge. Riprodurre: landing a 768x1024, scorrere in fondo. File: `crop-landing-768-cta.png`, `landing-768-chiaro-p4.png`. Proposta: sotto i 1024 px spostare l'immagine sotto il testo o limitare la colonna di testo alla parte blu (max-w ~55%) / aggiungere un velo blu dietro il testo.
- **Media – scrim dei fogli nel tema scuro schiarisce la pagina.** Con «Se non lo superi» aperto, nel tema scuro lo sfondo diventa grigio-azzurro chiaro (pagina sbiadita) invece di scurirsi; in chiaro lo scrim è grigio-blu. Il foglio scuro su un fondo più chiaro di lui sembra un buco. File: `landing-dialogo-senonlosuperi-1280-scuro.png` vs `-chiaro.png`. Proposta: scrim nero al 50-60% in scuro.
- **Media – carte «Cos'è l'OFA» con molto vuoto (1280/1440).** Le quattro carte alte 144 px contengono due righe centrate verticalmente: metà carta è vuota e sembra mancare un'icona; la quarta («Scadenze del 2° anno», tre righe) ha il titolo più in alto delle altre, quindi i titoli non sono allineati in fila. La freccia «>» tra quarta carta e carta blu galleggia nel solco. File: `landing-nav-cose-1280-chiaro.png`. Proposta: allineare i contenuti in alto (`justify-start`) o ridurre min-height; titoli sulla stessa linea.
- **Bassa – hero 1280: il telefono finto copre l'illustrazione.** Il secondo telefono taglia il primo e la scena con la stella; voluto, ma a 1280 il telefono posteriore mostra risposte troncate («alrea», «si»). File: `landing-1280-chiaro.png`.
- **Bassa – a 768 manca il pulsante secondario «Come funziona» dell'hero** presente a 1280/1440 (scelta coerente con il telefono, si segnala solo come differenza). File: `landing-768-scuro.png`.

## 2. Test iniziale e iscrizione (dalla landing, localStorage pulito)

Percorso completo fatto a 1280 chiaro (fino alla Home), a 768 scuro e 1440 scuro: conseguenze → cosa ottieni → «Da dove parti» → 10 domande intercalate da email, «Come ci hai conosciuto?» (provato «Salta»), scuola, sede, laurea, corso + anno, Termini e privacy → «Il tuo punto di partenza» → «Vai alla tua Home». Console: zero errori. File: `onb-1280-chiaro-00..23.png`, montaggi `M-onb-1280-chiaro-a.png`, `-b.png`, `M-onb-768-scuro-a.png`, `M-onb-1440-scuro-*.png`. Su schermi grandi tutto il percorso sta in una colonna di 480 px centrata (coerente su 768/1280/1440).

- **Media – il segnaposto dell'email sembra già compilato.** «nome.cognome@mail.polimi.it» è scritto a 20 px in grigio medio, quasi come un valore vero; premendo Continua compare «Scrivi la tua email del Politecnico» e solo allora si capisce che il campo è vuoto. Il campo in errore non cambia bordo. File: `onb-1280-chiaro-06.png`, `onb-1280-chiaro-07.png`. Proposta: segnaposto più chiaro e corto («nome.cognome@…»), oppure etichetta d'esempio sotto; bordo rosso con l'errore.
- **Media – indicatore di probabilità disegnato in due modi diversi.** Nel risultato del test iniziale l'arco è grigio pieno, spesso, senza tacche, con «<1%» enorme; nella Home lo stesso dato è un arco azzurro chiaro sottile con tacche, icona «i» e cifra più piccola. Stesso componente, due stili. File: `onb-1280-chiaro-22.png` vs `home-1280-chiaro.png`. Proposta: un solo componente indicatore.
- **Media – risultato del test iniziale: il blocco «Da dove cominciare» sfuma sotto i pulsanti fissi.** A 1280x800 il titolo «Da dove cominciare» si vede solo come testo sbiadito dietro la sfumatura sopra «Vai alla tua Home»: bisogna scorrere dentro la colonna per vederlo, e niente lo suggerisce. File: `onb-1280-chiaro-22.png`. Proposta: su schermi grandi pulsanti non fissi o colonna più alta.
- **Bassa – risposte del test iniziale alte 104 px con una sola parola.** Su desktop le quattro risposte sono blocchi grandi con il testo in alto a sinistra a 16 px; nel resto dell'app (allenamento, simulazione) le risposte hanno lettere A–D e altezza minore. File: `onb-1280-chiaro-05.png`. Proposta: stessa scheda risposta ovunque.
- **Bassa – «Da dove parti»: il contenuto si sposta di ~10 px** quando si sceglie la prima risposta (compare la riga d'aiuto). File: `onb-768-scuro-02.png` vs `-03.png`.

## 3. Home (stato «pieno») e navigazione generale

Console: zero errori nei 6 casi; nessuno scorrimento orizzontale; nessuna immagine rotta; nessun bersaglio sotto 44 px (misura automatica su tutti i 40 schermi x 6 casi, `misure-.json`).

- **Media – la struttura dell'app cambia da schermata a schermata su desktop.** La Home a 1280/1440 è una pagina larga 960 px a due colonne con la navigazione in alto (Home · Esercizi · Sfide, accanto al logo); appena si tocca Esercizi o Sfide (o si apre Progressi, Profilo…) si torna a una colonna di 480 px con la barra delle schede in basso, come al telefono. La stessa navigazione cambia posto e forma tra due clic. File: `home-1280-chiaro.png` vs `esercizi-1280-chiaro.png`, `sfide-1440-scuro.png`, `progressi-1280-scuro.png`. Proposta: o tutte le schede principali usano il layout largo con barra in alto, o la Home resta nella colonna come le altre.
- **Media – a 768 px tutto sta in una colonna di 480 px** con 144 px di fondo vuoto per lato (Home inclusa), mentre a 1024+ la Home diventa larga: il tablet verticale spreca un terzo dello schermo. File: `home-768-scuro.png`. Proposta: colonna fino a ~640 px sotto i 1024.
- **Bassa – colonne della Home non allineate in alto.** «Ciao, Mario Rossi» sta a y≈94, «Prossima lezione» a y≈106: le due colonne partono a quote diverse. File: `home-1280-chiaro.png`.
- **Bassa – «Continua l'allenamento» va a capo su due righe a 1280/1440** con il titolo a 26 px in una colonna di 400 px, mentre a 768 sta su una riga: il pulsante principale diventa alto 110 px. File: `home-1440-scuro.png`.

## 4. Esercizi, Riepilogo di grammatica, Frasi utili

Viste a 768/1280/1440 chiaro e scuro, scorse fino in fondo (`G-esercizi.png`, `G-prontuario.png`, `G-frasi.png`). Console pulita.

- **Media – nel tema scuro spariscono i fondini colorati delle icone.** In chiaro ogni icona (Punti deboli, Blitz, Richiamo, Per argomento, Frasi utili, Riepilogo) sta in un quadratino colorato; in scuro il quadratino non c'è e l'icona galleggia. Stesso difetto nella Lezione (Teoria, Esercizi senza fondino; Verifica e «2» sì). File: `G-esercizi.png`, `G-lezione.png`. Proposta: tinta scura dell'accento (es. 15% di opacità) dietro le icone anche in scuro.
- **Media – Riepilogo di grammatica: gli esempi «da evitare» sono barrati a 12 px grassetto.** «I have been to Africa in 2009» in rosso, 12 px, barrato: la riga attraversa la x-height e la frase si legge a fatica (25 esempi). Il contrasto del colore è sufficiente; il problema è dimensione + barratura. File: `crop-prontuario-scuro.png`. Proposta: 14 px, niente barratura (basta l'icona ⊗ e il colore) o barratura sottile con `text-decoration-thickness:1px`.
- **Bassa – Frasi utili «Tutte 612»** mentre landing e sessioni parlano di 613 domande: se le frasi sono una per domanda, il numero stona. File: `G-frasi.png`.

## 5. Allenamento (Home → «Continua l'allenamento»), sessione completa

Fatte 10 domande a 1280 chiaro scegliendo risposta + fiducia, fino a «Sessione completata» (`allen-1280-chiaro-00..10-fine.png`). Console pulita.

- **Media – tre disegni diversi per la stessa scheda risposta.** Test iniziale: blocchi alti 104 px senza lettere; allenamento e simulazione: righe da 58 px con cerchietto A–D; anche lo spazio da riempire cambia (lineetta blu nel test iniziale, «_____» nel resto). File: `onb-1280-chiaro-05.png`, `allenamento-1280-chiaro.png`, `simulazione-esame-1280-scuro.png`.
- **Bassa – due barre di avanzamento in testa all'allenamento.** Una barra grigia (domande) accanto al timer e una linea blu sotto l'intestazione (tempo che scorre): senza etichette non si capisce quale è quale. File: `allenamento-1280-chiaro.png`.
- **Bassa – «Domande imparate 0 → 0» mostra comunque un trattino scuro all'inizio della barra.** File: `allen-1280-chiaro-10-fine.png`.

## 6. Sfide (Oggi, Amici, Classifica), Condividi, Sfida da link

`G-classifica.png`, `G-amici.png`, `G-condividi.png`, `G-sfida-accetta.png`, `sfide-1440-scuro.png`. Console pulita.

- **Media – Classifica vuota senza azione.** «Nessuna classifica per ora – Nasce dalla prima sfida a due» non offre il pulsante «Sfida un amico», che invece c'è nello stato vuoto di Amici con la stessa causa. File: `G-classifica.png` vs `G-amici.png`. Proposta: stesso pulsante anche qui.
- **Media – «Condividi» non dice cosa si condivide.** Titolo «Condividi», riga «La tua ultima simulazione: 21/30», campo «Il link» con il solo indirizzo del sito (`http://localhost:4302/`): non è chiaro se si manda il risultato, una sfida o l'app. File: `G-condividi.png`. Proposta: titolo «Invita a provare AddiOFA» o «Condividi il tuo risultato» con anteprima del messaggio.
- **Bassa – la scheda «Non attiva su questo sito» (Classifica NOI) ha un'ombra in chiaro** che le altre schede-elenco non hanno. File: `G-classifica.png`.

## 7. Lezione, Percorso, Teoria

`G-lezione.png`, `G-percorso.png`, `clic--teoria-1280-chiaro.png`. Clic: Teoria → pagina teoria; Esercizi → 10 domande della lezione; Lezione successiva → «There is / There are»; Indietro → Home. La riga «Verifica · domande imparate 0/35» non è cliccabile (atteso, ma il bordo tratteggiato la fa sembrare un segnaposto). Console pulita.

- **Media – fondo della colonna diverso tra schermate.** Lezione e Percorso hanno la colonna bianca (scuro: #111a2e), Sfide/Esercizi/Progressi la colonna grigio-azzurra (#f7f9fd; scuro #0a101f). Passando da una all'altra lo sfondo cambia tono. Misura con `getComputedStyle` a 1280. File: `G-lezione.png` vs `G-sfida-accetta.png`. Proposta: un solo colore di fondo per le pagine.
- **Bassa – righe della Lezione con affordance diverse:** Teoria ha la freccia «>», Esercizi un cerchio blu «▶», Verifica niente. File: `G-lezione.png`.
- **Bassa – Teoria: il riquadro «1» in alto a destra** ripete il numero già scritto in «Lezione 1 di 31» e sembra un pulsante. File: `clic--teoria-1280-chiaro.png`.
- **Bassa – margini laterali diversi:** testo della Teoria a x=444, Allenamento a x=421, Esercizi a x=425 (colonna da 400 a 880 a 1280 px).

## 8. Simulazione d'esame e risultato

A 1280 chiaro, 1280 scuro e 1440 scuro: Home → «Fai un'altra simulazione» → indice domande («Domanda 1 di 30») → 30 risposte → Consegna → conferma → Risultato; provati i filtri Tutte/Sbagliate/Senza risposta/Giuste (contano 30/21/0/9 e mostrano gli elementi giusti; «Senza risposta 0» mostra uno stato vuoto chiaro). File: `sim-1280-*-indice.png`, `G-sim-esito.png`, `sim-1440-scuro-filtro-*.png`. Console pulita.

- **Media – lo scrim dei fogli copre solo la colonna dell'app.** Aprendo l'indice delle domande, il velo scurisce solo i 480 px centrali; i fianchi restano chiari (in chiaro) o neri (in scuro). Nella landing invece il velo copre tutta la finestra. In scuro il velo schiarisce la colonna (grigio) invece di scurirla. File: `sim-1280-chiaro-indice.png`, `sim-1280-scuro-indice.png`, `landing-dialogo-senonlosuperi-1280-scuro.png`. Proposta: velo a tutta finestra, nero semitrasparente in entrambi i temi.
- **Media – terzo disegno dell'indicatore a semicerchio.** Il risultato usa un arco con «4/30» e tacca «Soglia 25» esterna, diverso da quello della Home e del test iniziale. File: `G-sim-esito.png`.
- **Bassa – «Tempo 0:06» in arancione** come se fosse un avviso, accanto a «Soglia 25 su 30» verde. File: `G-sim-esito.png`.

## 9. Simulazioni (elenco) e Simulazione svolta (dettaglio)

`G-simulazioni.png`, `G-simulazione-dettaglio.png`. Console pulita.

- **Media – lo stesso risultato 21/30 ha colori ed etichette diversi.** Home: «21 /30 ⚠ Sotto soglia» in rosso; Simulazioni: «21/30» marrone-giallo con badge giallo «Sotto la soglia»; Dettaglio: arco blu con badge giallo «Sotto la soglia». File: `home-1280-chiaro.png`, `G-simulazioni.png`, `G-simulazione-dettaglio.png`. Proposta: una sola etichetta («Sotto la soglia») e un solo colore di stato.
- **Bassa – Dettaglio: «Tempo 19:00 su 15 min · Scaduto».** Lo stato di prova ha 1140 s; l'app mostra un tempo oltre il limite senza tagliarlo a 15:00. Se nella prova reale il tempo si ferma a 15 min, conviene comunque mostrare al massimo «15:00». File: `G-simulazione-dettaglio.png`. (Dato di prova: va verificato con una simulazione vera scaduta.)

## 10. Profilo, Modifica profilo, Obiettivi, Badge, Impostazioni, Progressi

`G-profilo.png`, `G-profilo-modifica.png`, `G-obiettivi.png`, `G-badge.png`, `G-impostazioni.png`, `progressi-1280-scuro*.png`. Clic in Impostazioni: Esporta → avviso «Copia salvata: addiofa_progressi.json»; Importa → selettore file (nessun foglio); Cancella i dati → finestra di conferma, Esc la chiude. Console pulita.

- **Media – l'avviso di Esporta copre la barra delle schede.** Il toast «Copia salvata…» si posa sopra Home/Esercizi/Sfide (y 713–783 a 1280x800) e le nasconde finché non sparisce o si chiude. File: `clic--impostazioni-esporta-1280-chiaro.png`. Proposta: toast sopra la barra (bottom = altezza barra + 12 px).
- **Media – Modifica profilo: «Salva» staccato dal modulo.** Su desktop il modulo finisce a y≈350 e il pulsante sta fisso in fondo a y≈660, 300 px più giù, separato da una linea. File: `G-profilo-modifica.png`. Proposta: pulsante subito sotto i campi su schermi alti.
- **Media – il corso si sceglie in due modi diversi.** All'iscrizione è un elenco con ricerca (scuola → sede → laurea → corso → anno); in Modifica profilo è un campo libero «Es. Ingegneria informatica», e il Profilo dice «Aggiungi il corso di studi» anche se il corso era stato chiesto. File: `onb-1280-chiaro-16c.png` vs `G-profilo-modifica.png`.
- **Media – finestre modali con velo diverso.** «Cancellare i dati?» ha un velo grigio su tutta la finestra e la finestra al centro; i fogli (indice simulazione, informazioni) hanno il velo solo sulla colonna. File: `clic--impostazioni-cancella-i-dati-1280-chiaro.png` vs `sim-1280-chiaro-indice.png`.
- **Media – Badge: «Accuratezza 80 %» va a capo lasciando «%» da solo** sulla seconda riga (12 px, riquadro 105 px). File: `G-badge.png`. Proposta: spazio non separabile (80 %) o «80%».
- **Bassa – Obiettivi: data del test con tre `<select>` nativi** (freccia e menu del sistema), unico punto dell'app con controlli nativi; in scuro il menu a discesa resta quello del sistema. File: `G-obiettivi.png`.
- **Bassa – Profilo: «Livello: verso A1 · 0 di 116 domande»** mentre Progressi dice «A1 · 0 di 192 domande imparate»: 116 è il 60% di 192 (spiegato solo in Progressi). File: `G-profilo.png`, `progressi-1280-scuro-s1.png`. Proposta: «0 di 116 per il livello A1 (60% di 192)».
- **Bassa – Progressi: «Ultime simulazioni» con una sola barra spostata a sinistra del centro** (x≈606 in una scheda centrata a 640). File: `progressi-1280-scuro.png`.

## 11. Domande frequenti, Segnala un problema

`G-faq.png`, `faq-vuota-1280-chiaro.png`, `G-segnala.png`, `segnala-prepara-1280-chiaro.png`. Ricerca senza risultati: stato vuoto con «Scrivici un'idea» (bene). Segnalazione: scritto un testo, «Prepara il testo» → «Non inviata» + Copia il testo. Console pulita.

- **Media – Segnala: non si sa a chi mandare il testo.** Dopo «Prepara il testo» compare «Copia il testo e mandalo tu al contatto da cui hai conosciuto AddiOFA»: chi ha saltato «Come ci hai conosciuto?» (o l'ha trovata su Instagram) non ha un contatto; nessun indirizzo o pulsante di invio. In più c'è un secondo «Indietro» sotto il pulsante, doppione della freccia in alto. File: `segnala-prepara-1280-chiaro.png`. Proposta: indicare un indirizzo/canale preciso (es. email o Agorà) con pulsante «Apri email».
- **Bassa – FAQ: il filtro «L'app» va a capo da solo** su una seconda riga nella colonna da 480 px. File: `G-faq.png`.
- **Bassa – Segnala: il segnaposto chiede «e su che telefono?»** anche su desktop/tablet. File: `G-segnala.png`.

## 12. Community, NOI, Agorà, Project ID, ATLAS

`G-community.png`, `G-noi.png`, `G-agora.png`, `G-project-id.png`, `G-atlas.png`, `clic--verifica-con-un-link-1280-chiaro.png`, `clic--esporta-1280-chiaro.png`, `clic--cancella-dal-dispositivo-1280-chiaro.png`.

- **Alta – Project ID → «Verifica con un link»: errore in console e azione che non funziona.** Il clic manda una richiesta a `identitytoolkit.googleapis.com/v1/accounts:sendOobCode` che risponde 400; in console «Failed to load resource: the server responded with a status of 400». A schermo il pulsante sparisce e al suo posto compare in rosso «L'accesso con link non è abilitato nel progetto: per ora l'email resta non verificata» (testo tecnico). Riprodotto a 1280 chiaro e scuro. File: `clic--verifica-con-un-link-1280-chiaro.png`, `projectid-verifica-1280-scuro.png`. Proposta: se il collegamento non è configurato, non mostrare il pulsante (o mostrarlo disattivato con una riga vera) invece di chiamare il servizio.
- **Alta – numero di risposte contraddittorio.** Progressi: «0 Risposte»; ATLAS (stessa utente): «Stima poco precisa: si basa su 45 risposte». Senza qualificatore le due cifre si contraddicono (le 45 sono test di livello + simulazione, lo 0 forse solo allenamento). File: `progressi-1280-scuro.png`, `G-atlas.png`. Proposta: etichette esplicite («0 risposte in allenamento», «45 risposte tra test e simulazioni») o un solo totale.
- **Media – due «Esporta» e due «Cancella» con comportamenti diversi.** Impostazioni → Esporta scarica subito un file con avviso; Project ID → Esporta apre una pagina con «Mostra e copia». Impostazioni → Cancella i dati apre una finestra di conferma; Project ID → Cancella dal dispositivo apre una pagina intera con riquadro rosso e due pulsanti. File: `clic--impostazioni-esporta-1280-chiaro.png`, `clic--esporta-1280-chiaro.png`, `clic--impostazioni-cancella-i-dati-1280-chiaro.png`, `clic--cancella-dal-dispositivo-1280-chiaro.png`.
- **Media – «Cancella dal dispositivo» suggerisce un'azione non disponibile:** «accedi con Google, collega la tua iscrizione ed elimina il Project ID», mentre la stessa pagina Project ID dice «Il collegamento ad ATLAS non è attivo». File: `clic--cancella-dal-dispositivo-1280-chiaro.png`, `G-project-id.png`.
- **Media – Project ID: sezione «Accesso con Google» senza pulsante**, contiene solo la nota «Il collegamento ad ATLAS non è attivo»: il titolo promette un'azione che non c'è. File: `G-project-id.png`. Proposta: titolo «Accesso con Google (non attivo)» o sezione nascosta.
- **Bassa – Community: sottotitolo rientrato sotto il titolo** (inizia a x=90 come il titolo dopo la freccia), mentre in Sfide il sottotitolo parte dal margine. File: `G-community.png`.

## 13. Pagine legali, stato vuoto, offline, avvio, iscrizioni

`G-legale-privacy.png`, `legale-privacy-1440-chiaro.png`, `legale-privacy-su-1440-scuro.png`, `G-stato-vuoto.png`, `G-offline.png`, `G-avvio.png`, `G-iscrizioni-admin.png`. Console pulita.

- **Media – le pagine legali si aprono già scorse di 96 px e nascondono «Indietro».** Dalla landing («Come usiamo i tuoi dati») la pagina parte con il contenitore a scrollTop=96: il pulsante Indietro è a y=−58, fuori schermo; si vede solo scorrendo su. In più l'intestazione non è fissa (il documento è lungo 5300 px) e, quando si vede, contiene solo la freccia senza titolo, con 50 px vuoti. Verificato a 1440 e 768. File: `legale-privacy-1440-chiaro.png` vs `legale-privacy-su-1440-scuro.png`. Proposta: aprire in cima, intestazione fissa con freccia + «Privacy».
- **Bassa – pagine legali in colonna da 480 px a 1280/1440**, con testo a 15 px: dalla landing larga si passa a un documento stretto e lunghissimo. File: `legale-privacy-1440-chiaro.png`.
- **Bassa – Iscrizioni: il secondo pulsante disattivato («Solo chi ha il consenso ai messaggi») è quasi invisibile** (testo grigio chiaro su bianco, bordo appena accennato). È disattivato quindi l'eccezione WCAG vale, ma non si capisce che è un pulsante. File: `G-iscrizioni-admin.png`.

## 14. Landing: «Vai all'app senza test»

- **Media – «Preferisci esplorare? Vai all'app senza test» porta alla richiesta dell'email PoliMi** (`?vista=completa-profilo`, «La tua email PoliMi»), non all'app. Chi sceglie di esplorare si trova un modulo di iscrizione: l'etichetta promette altro. Provato a 1280 chiaro da localStorage pulito. File: `landing-esplora-1280-chiaro.png`. Proposta: etichetta onesta («Iscriviti e vai all'app») o una riga che dice che prima serve l'email.

## Riepilogo numeri

- Schermate viste: 40 schermi del piano x 3 larghezze x 2 temi (240 scatti con misure automatiche) + percorsi completi: test iniziale e iscrizione (1280 chiaro, 768 scuro, 1440 scuro), allenamento da 10 domande (1280 chiaro), simulazione consegnata (1280 chiaro, 1280 scuro, 1440 scuro), clic in landing, lezione, impostazioni, Project ID, segnalazione, FAQ.
- Console: un solo errore, su «Verifica con un link» (400). Nessuno scorrimento orizzontale, nessuna immagine rotta, nessun bersaglio sotto 44 px misurato.
- Non provato: sfida del giorno giocata fino in fondo, «Sfida un amico» e «Ho ricevuto una sfida» con link valido, modalità Punti deboli/Blitz/Richiamo/Per argomento, Importa con un file vero, tutte le altre FAQ aperte.
