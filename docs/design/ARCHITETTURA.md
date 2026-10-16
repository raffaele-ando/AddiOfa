# Architettura dell'app: quattro destinazioni, una funzione = un posto, icone al posto delle frasi (16/10)

Richiesta dell'utente: ripensare i quattro pulsanti che si vedono dalla Home (il profilo in alto a destra e le tre schede in basso). Le quattro schermate non devono avere le stesse funzioni dentro: ogni funzione sta in un solo punto, facile e immediato da raggiungere. Le frasi lasciano il posto a icone diverse tra loro; le frasi che spiegano una funzione non devono esserci (se servono, il design non è abbastanza chiaro).

## 1. Le quattro destinazioni

| Destinazione | Domanda a cui risponde | Contiene (e SOLO qui) |
|---|---|---|
| **Home** (scheda) | Come sto andando e cosa faccio adesso? | misuratore della probabilità (+ «i» per il calcolo), fascia di stato, UN pulsante ▶ (sessione intelligente; per chi è nuovo, il diagnostico), la prossima lezione (apre la lezione), andamento della probabilità |
| **Simulazioni** (scheda) | Mi metto alla prova | due sezioni con icone: **Prove** (nuova simulazione 30 domande · 15 min · soglia 25/30, elenco svolte, dettaglio con correzioni) e **Sfide** (sfida del giorno, duello con un amico, amici, classifica, condividi) |
| **Lezioni** (scheda) | Studio | la prossima lezione e quattro tessere: **Percorso** (31 lezioni con la teoria dentro), **Esercizi** (modalità di allenamento, compreso il ripasso degli errori), **Frasi** (frasi e vocaboli), **Prontuario** (regole in breve) |
| **Profilo** (in alto a destra, su ogni scheda) | Io | **Progressi** (statistiche, analisi per argomento, calendario e attività), **Obiettivi**, **Badge**, **Pass** (stato, inviti per sbloccarlo), **Project ID** (account e servizi collegati: classifica NOI, Agorà), **Impostazioni** (ingranaggio: tema, suoni, materiale, dati, aiuto → FAQ e Segnala, informazioni, pagine legali, pagina di presentazione) |

Regole:
- Nessuna funzione si ripete in due destinazioni. Dalla Home si può solo «continuare» (▶) o aprire la prossima lezione; non ci sono elenchi di strumenti.
- Le statistiche (Progressi) stanno solo nel Profilo; la Home mostra soltanto il misuratore e l'andamento. Il diagnostico si rifà da Progressi; la Home lo propone solo a chi non l'ha mai fatto.
- Il ripasso degli errori è una modalità di Esercizi (non una riga a parte); «Teoria» è dentro il Percorso (non una voce a parte); «Esplora» non esiste più (le sue voci stanno nel posto a cui appartengono).
- Il profilo (avatar tondo) sta nello stesso punto — in alto a destra — su Home, Simulazioni e Lezioni; il Profilo ha l'ingranaggio delle Impostazioni nello stesso punto.
- Le schermate di dettaglio hanno la freccia a sinistra del titolo e nient'altro che serva a quella schermata.

## 2. Mappa delle schermate (id) e proprietario

Schede: `home` (components/Menu.tsx), `simulazioni` (extra), `lezioni` (screens/Lezioni.tsx).
- **Prove e Sfide**: `simulazioni`, `simulazione-dettaglio`, `sfide`, `sfida-gioco`, `sfida-risultato`, `sfida-accetta`, `amici`, `classifica`, `condividi`; gli esami in corso (`ExamMode`) e l'esito (`components/esito/*`).
- **Studio**: `percorso`, `lezione-dettaglio` (teoria, esercizi sull'argomento), `frasi`; viste esistenti `practiceMenu` (= Esercizi), `learn`, `cheatsheet` (= Prontuario), `theory` (scheda di teoria).
- **Profilo**: `profilo`, `profilo-modifica`, `progressi` (NUOVO: unisce statistiche, analisi del livello, calendario e attività in una pagina con tre sezioni a icone; sostituisce `statistiche`, `atlas-analisi`, `calendario`, `attivita`), `obiettivi`, `badge`, `pass` (NUOVO: stato del Pass + inviti + accesso sbloccato; sostituisce la riga Inviti e `accesso-sbloccato`), `projectid` (unisce `noi` e `agora` come due righe di stato), vista `impostazioni`, `faq`, `segnala`.
- **Stati e ingresso**: `stato-vuoto`, `offline`, `splash`, landing, onboarding, paywall, lista d'attesa, ringraziamento, pagine legali.
Ids tolti: `esplora`, `statistiche`, `atlas-analisi`, `calendario`, `attivita`, `noi`, `agora`, `accesso-sbloccato` (le loro funzioni vivono nei nuovi posti). Chi li linka li aggiorna.

## 3. Icone invece di frasi

- Kit: **lucide** (ISC, 1500+ icone, un solo stile a tratto), già nel progetto. Si usano SOLO tramite `<Icona nome="..."/>` (`app/src/brand/icone/Icona.tsx`): nessun import diretto da `lucide-react` nei componenti. Le icone sono SVG-indirizzo disegnati come maschera (niente tracciati nel codice: il controllo di pubblicazione dell'Artifact rifiuta certe icone scritte inline).
- Registro: `app/src/brand/icone/registro/<area>.json` (`{ "nome-semantico": "nome-lucide" }`). `node tools/genera-icone.mjs` genera gli SVG e `nomi.generato.ts` e FALLISCE se due funzioni usano la stessa icona lucide o se un nome non esiste. Una funzione = un'icona, la stessa in tutta l'app; stati (spunta, lucchetto, avviso) hanno nomi `stato-*` e non servono mai come icona di una funzione.
- Il colore dell'icona segue i toni (`app/src/screens/extra/ui.tsx`: `IconaTono`, `TONI`).
- Le illustrazioni del kit blu restano per gli stati vuoti, gli esiti e l'intestazione dell'avvio.

## 4. Niente frasi (regola del testo)

- Titolo di pagina: 1-2 parole. Etichetta di tessera o riga: 1-2 parole. Pulsante: un verbo o solo icona (con `aria-label`). Numeri con icona al posto delle frasi («30 · 15 min · 25/30» con tre icone).
- Vietato in pagina: frasi che spiegano cosa fa una funzione o perché esiste, sottotitoli, «Qui trovi…», note sotto i pulsanti, paragrafi introduttivi, testi che ripetono l'etichetta.
- Stato vuoto: illustrazione/icona + titolo di 2-4 parole + un'azione. Errore: massimo 8 parole.
- Le informazioni che per onestà devono esserci (come si calcola la stima, che non è una garanzia, cosa è la demo, privacy) stanno dietro il pulsante «i» (`PulsanteInfo` + `FoglioInfo` in `ui.tsx`), mai in pagina; la banda «versione dimostrativa» in alto è l'unica frase fissa.
- Esenti dal controllo: i contenuti (domande, spiegazioni, teoria, frasi), le risposte della FAQ, le pagine legali, i testi di marketing della landing (marcati `data-testo-ok`).
- Controllo automatico: `python3 tools/controlla-testo.py --base http://localhost:<porta> --viste home,lezioni,simulazioni,profilo,...` (blocchi ≥ 6 parole); obiettivo: zero, salvo gli esenti.
