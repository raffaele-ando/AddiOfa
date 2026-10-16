# Colore e gerarchia: servizi e ingresso (agente COLORE-D, 16/10)

Area: servizi (`screens/extra/servizi`), funnel (Onboarding, CalcoloRisultato, FoglioStima, Paywall, Waitlist, PaymentThanks, Legal), landing, stati. Nessuna modifica a `ui.tsx` né a `index.css`.
Screenshot prima/dopo (400 e 1280 px, chiaro e scuro) e confronti con i concept: `docs/lavoro/extra/colore/servizi/` (`confronto-esplora.png`, `confronto-analisi.png`, `confronto-landing.png`; `prima-*`, `*-ricco/povero-*`, `fn-*` = funnel).

## Schermata per schermata
- **Esplora**: la tessera di ogni carta ha il colore del significato: analisi del livello verde, frasi viola, percorso blu, Project ID azzurro pieno (si distingue dal blu dello studio), classifica NOI ambra (trofeo), Agorà viola, guida blu, inviti corallo (persone), segnala ambra. Tolte le note sotto le carte (ripetevano l'etichetta): l'etichetta compare solo se la carta non è utilizzabile adesso («Solo informazioni», «Richiede il Project ID», «Non ancora attiva»). Sottotitolo accorciato.
- **Project ID**: lo stato in breve in alto (avviso ambra con titolo e una riga; il testo lungo resta nel pannello che si apre premendo «Collega»). «Cos'è» ridotto a un paragrafo. I permessi hanno la tessera nel tono della cosa che condividono (profilo e progressi blu, classifica ambra, personalizzazione ATLAS verde); l'etichetta «Facoltativo, parte spento» ripetuta su tre carte è una riga sopra la lista, resta solo «Necessario» sul profilo. Con il collegamento spento «Collega» è secondario (non è un'azione possibile): il punto focale è l'avviso. Tolta l'icona impronta dal pulsante (è già sulla carta di Esplora).
- **Analisi del livello**: barre, percentuali e punti del radar nel tono dell'accuratezza: verde solido (da 85 %, la soglia «da migliorare» già nel codice), ambra da migliorare, corallo da ripassare (sotto 50 %); legenda a tre voci sotto il radar; la serie «Come è cambiata la stima» nei toni delle fasce della Home (stesse soglie di `livelloDi`); il valore grande al centro del misuratore resta quello della Home, già nella sua fascia. Tolto «Torna a Esplora» (c'è la freccia).
- **NOI**: avviso ambra se spenta, verde se aderito; blocco posizione neutro (un solo blocco tinto); numeri personali: domande imparate verdi, miglior simulazione blu; tolte l'illustrazione decorativa in fondo, le icone doppie sui pulsanti e una frase che ripeteva il passo 2.
- **Agorà**: viola (tessere con icona per Domande, Idee, Confronto; il sottotitolo non ripete più le stesse tre parole); tolto «Torna a Esplora» e la frase «Oggi non è attivo» ripetuta.
- **FAQ**: categorie come pillole leggere (test blu, Pass e pagamenti ambra, dati verde, app viola; quella scelta si riempie), puntino di categoria su ogni domanda, freccia neutra.
- **Segnala**: il tipo ha tessera e tono (domanda sbagliata corallo, spiegazione viola, problema dell'app ambra, suggerimento blu); selezione con tinta e bordo del tono; le segnalazioni salvate hanno la pillola del tipo.
- **Stato vuoto / Offline / Splash**: un solo pulsante pieno (senza azione, «Indietro» diventa primario); nell'offline la nota «i progressi restano qui» è verde. Splash invariata.
- **Onboarding**: tessere «n su m» con barra e numero nei toni delle fasce della Home; il messaggio del risultato è l'unico blocco tinto, con tinta e icona della fascia (come il banner della Home); «Gratis, da subito» con spunte verdi.
- **Calcolo**: le tre tappe hanno icona e colore di ciò che misurano (risposte esatte verde, livelli viola, soglia blu) e l'esito nel tono.
- **Foglio stima**: icone per significato (calcolo blu, cosa non entra corallo, limiti ambra, come migliorare verde). Tolta la frase sul TENG (regola di prodotto) e una variabile inutilizzata.
- **Paywall**: tolta la lista «Cosa include» (stesse voci della tabella); nella tabella colonna Pass tinta e spunte verdi; «Sblocca il Pass in prova» (solo demo) non è più pieno scuro: un solo pulsante pieno.
- **Lista d'attesa**: tolto il pulsante «Indietro» (c'è la freccia) e la frase del sottotitolo che ripeteva la casella di consenso.
- **PaymentThanks**: la festa solo a Pass confermato; riquadro verde se attivo, ambra se non ancora visto.
- **Legal**: sezioni separate da una linea, numero in blu, interlinea 1,7, indice su fondo neutro. Contenuti invariati (restano bozze).
- **Landing**: «Vantaggi» e le quattro carte di «Perché AddiOFA» dicevano le stesse quattro cose (più i passi): tenuta la fascia (con colore per significato: stima blu, tempo ambra, errori corallo, teoria viola), tolte le carte e la pillola «Esempio» doppia. «Se non superi» aveva una quarta carta «Scadenze» che ripeteva il riquadro con le date: tolta; le date ora sono ambra; tolto il pulsante pieno doppio su telefono. Passi: note «Gratis» verdi, l'ultima neutra. Offerta: spunte verdi nella carta Gratis. Hero: icone dei fatti per significato. Scena dell'hero non toccata.

## Prove (numeri onesti)
- `npx tsc --noEmit` pulito; `npm test` 217 su 217 verdi (nessun test nuovo: solo presentazione).
- Playwright su porta 5214: 10 schermate extra a 400 px (chiaro e scuro, stato ricco e povero) e a 1280 px; funnel completo nel banco `tests/anteprime`: intro, certificazione, info certificazione, OFA, quiz da 10 domande (risposte miste), rischio, calcolo, risultato, foglio, «Scopri come prepararti», «Vedi il Pass» (evento paywall arrivato), landing, paywall, lista d'attesa, ringraziamento; a 400 e 1280, chiaro e scuro. Nessuno scorrimento orizzontale. Console: solo un 404 al primo caricamento di ogni nuova pagina (non riprodotto con una pagina semplice: verosimile favicon), nessun errore JS.
- Non provato: risultato in fascia alta del funnel (il banco non espone la risposta giusta; la logica è la stessa delle altre fasce), Legal a 1280 e in scuro (solo 400 chiaro), Paywall con pagamenti accesi (restano spenti), `build:demo` (vietato dal brief), `npm run check`.

## Cosa manca / richieste
- Il Paywall nomina ancora il TENG in `INTESTAZIONI.teng` e nella riga «Formato TENG» della tabella (regola: niente TENG nei testi): da decidere con chi tiene `config/offer.ts`.
- La riga «Esplora» in `Lezioni.tsx` (non mia) usava la stessa impronta di Project ID: nelle mie schermate l'impronta ora è solo sulla carta Project ID.
- Il tono azzurro del Project ID è una tessera piena (`bg-azione-chiaro`); un token `azzurro*` in `index.css` renderebbe la scelta pulita.
- `components/ui.tsx` (ChoiceCard, barra di avanzamento a tinta unica) e l'illustrazione `quiz-test` (fogli quasi vuoti) non sono miei.
- I circa 120 screenshot in `docs/lavoro/extra/colore/servizi/` pesano 20 MB: si possono ridurre a mano (io non cancello).
