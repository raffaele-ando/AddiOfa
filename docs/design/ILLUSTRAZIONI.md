# Illustrazioni di AddiOFA: inventario e piano d'uso

Scritto dall'agente ASSET il 16/10. Risponde a «non stai usando tutte le illustrazioni e i concept»: tutta la grafica ridisegnata che esiste in `grafica/brand/` è ora spedita con l'app (tema chiaro e scuro) e ogni illustrazione ha un posto previsto in una schermata. Dove una non può averlo, c'è il motivo (sezione 4).

Numeri (verificati con `python3 tools/controlla-illustrazioni.py`): **67 illustrazioni** dell'app, più il misuratore (in codice) e il logo; **16 sono già usate** da qualche schermata, **48 aspettano** le schermate (il piano è nella sezione 3), **3 non si usano** con motivo (sezione 4); il kit rosso (21 file) resta solo per il catalogo `?brand`.

## 1. Come si usano

```tsx
import { Illustrazione } from '../brand/Illustrazione';
<Illustrazione nome="obiettivo" lato={120} />                                  // kit blu: il nome basta (gruppo dal catalogo)
<Illustrazione kit="kit-luminoso" nome="quiz-test" lato={160} />                // kit luminoso: serve il kit
<IllustrazioneAnimata nome="successo" lato={120} />                            // solo le 11 con animazione a pezzi (kit blu)
```

- **Chiaro e scuro**: `Illustrazione` rende le due varianti e il CSS ne mostra una sola (classe `.dark`): non si passa il tema. Ogni file ha il suo `.scuro.svg`, fatto da `scuro_svg.py` (fogli → carta blu notte, blu scuri schiariti, anelli bianchi tolti).
- **Tre famiglie, tre mestieri** (regola di scelta, per non mescolare stili nella stessa pagina):
  - `kit-blu` / `illustrazioni` e `stati`: piatte, **fino a 200 px**: stati, carte, righe, esiti, onboarding, badge, avatar. È lo stile dell'app.
  - `kit-luminoso`: gli stessi soggetti con luce piena e blu più acceso (concept 16 e 17): **intestazioni di pagina da 160 px in su**, mai accanto alle piatte nella stessa riga.
  - `kit-blu` / `sfere`: icone grandi di vetro (concept 44): **48-96 px**, per voci di elenco, schede di categoria, righe di impostazioni; non al posto delle icone lucide piccole (tab bar, pulsanti).
- Una stessa illustrazione fa **un solo mestiere** nell'app (colonna «mestiere» del piano): se serve un'immagine per un'altra cosa, se ne sceglie un'altra, non si ricicla.
- **Mai** un numero scritto nel disegno che sembri dell'utente: le due con «82 %» (`composizione-tre`, `kit-luminoso/risultato-probabilita`) non si usano; il misuratore è il componente `Misuratore`.
- Niente `<text>` negli SVG (controllato: zero), niente animazioni decorative: l'unica che gira è lo spinner `Caricamento`.
- Catalogo vivo: `?brand` in sviluppo (tema chiaro, tema scuro e descrizione di ognuna).
- A fine lavoro, ogni agente lancia `python3 tools/controlla-illustrazioni.py` (esce con 1 se resta un'illustrazione non usata e senza motivo in `NON_USATE_OK`).

## 2. Inventario

Formato: SVG pulito (nitido a ogni dimensione) con variante scura. Tutte spedite in `app/src/brand/essenziali/disegni/` (0,7 MB in totale con il kit rosso, ottimizzate con `ottimizza-svg.mjs`). «Concept» = numero NN di `grafica/fonti/design-concept/` da cui vengono (vedi `grafica/fonti/INDICE.md`). «Usata oggi» = compare in un file di `app/src` fuori da `brand/` (stato del 16/10: le schermate si stanno riscrivendo).

| nome | kit / gruppo | concept | cosa raffigura | formato | dimensione | spedita | usata oggi |
|---|---|---|---|---|---|---|---|
| `studio-inglese` | blu / illustrazioni | 07, 15, 28, 35, 50 | Due libri impilati con la bandiera del Regno Unito: lo studio dell'inglese. | SVG chiaro + scuro | 218×151 | sì | sì: `Onboarding.tsx`, `badge.ts`, `dati.ts` … |
| `quiz-test` | blu / illustrazioni | 28, 40, 50 | Foglio di quiz con risposte A, B, C e una spunta: domande a risposta multipla. | SVG chiaro + scuro | 205×166 | sì | sì: `Onboarding.tsx`, `badge.ts`, `dati.ts` … |
| `rischio-economico` | blu / illustrazioni | 15, 35, 50 (e 02/47 in forma alata) | Banconota da euro inclinata: il costo di un nuovo tentativo (circa 30 €). Il rischio economico del «Se non superi». | SVG chiaro + scuro | 198×156 | sì | sì: `Onboarding.tsx`, `SeNonSuperi.tsx` |
| `piano-studi-bloccato` | blu / illustrazioni | 15, 50 | Calendario con un lucchetto rosso: il piano di studi che resta limitato finché c'è l'OFA. | SVG chiaro + scuro | 202×159 | sì | sì: `SeNonSuperi.tsx` |
| `superamento` | blu / illustrazioni | 15, 35, 50 | Fogli con una spunta verde: test superato, OFA tolto. Il test superato. | SVG chiaro + scuro | 207×161 | sì | sì: `Onboarding.tsx`, `badge.ts`, `dati.ts` … |
| `successo` | blu / illustrazioni | 07, 15, 28, 35, 50 | Coppa gialla con una stella: obiettivo raggiunto. | SVG chiaro + scuro | 191×171 | sì | sì: `LearnMode.tsx`, `EsitoSimulazione.tsx`, `badge.ts` … |
| `suggerimenti-consigli` | blu / illustrazioni | 28, 50 | Lampadina accesa: un consiglio, una spiegazione. | SVG chiaro + scuro | 185×158 | sì | sì: `ErrorBoundary.tsx`, `badge.ts`, `dati.ts` … |
| `verifica-utente` | blu / illustrazioni | 50 | Tessera con foto e righe di testo: il profilo, i dati di chi studia. | SVG chiaro + scuro | 181×103 | sì | sì: `badge.ts` |
| `accesso-bloccato` | blu / illustrazioni | 50 | Studente col tocco in una finestra e un orologio: l'accesso al secondo anno che dipende dalla scadenza. | SVG chiaro + scuro | 169×112 | sì | sì: `StatoPagina.tsx`, `SeNonSuperi.tsx` |
| `mancato-superamento` | blu / illustrazioni | 50 | Foglio con una croce rossa: test non superato, sotto soglia. | SVG chiaro + scuro | 149×122 | sì | sì: `EsitoSimulazione.tsx`, `SeNonSuperi.tsx` |
| `progressi-statistiche` | blu / illustrazioni | 07, 35, 50 | Quattro barre blu crescenti: andamento e statistiche. | SVG chiaro + scuro | 146×105 | sì | sì: `badge.ts`, `dati.ts`, `StatoVuoto.tsx` … |
| `mondo-internazionale` | blu / illustrazioni | 07, 15, 28, 35, 50 | Globo con un aeroplano in orbita: il mondo, i collegamenti. | SVG chiaro + scuro | 156×120 | sì | sì: `badge.ts`, `dati.ts`, `Offline.tsx` |
| `messaggi-supporto` | blu / illustrazioni | 50 | Due fumetti, uno con tre puntini: messaggi e supporto. | SVG chiaro + scuro | 141×114 | sì | sì: `dati.ts`, `StatoPagina.tsx`, `StatoVuoto.tsx` … |
| `celebrazione` | blu / illustrazioni | 50 | Cono di coriandoli: festa per un esito positivo. Si usa ferma (niente coriandoli che cadono). | SVG chiaro + scuro | 139×116 | sì | sì: `badge.ts`, `dati.ts` |
| `attesa-caricamento` | blu / illustrazioni | 50 | Clessidra: attesa e tempo. | SVG chiaro + scuro | 150×118 | sì | sì: `ExamMode.tsx`, `LearnMode.tsx`, `badge.ts` … |
| `ricerca` | blu / illustrazioni | 50 | Lente d'ingrandimento: cercare. | SVG chiaro + scuro | 130×117 | sì | sì: `badge.ts`, `dati.ts`, `StatoPagina.tsx` … |
| `attenzione-rischio` | blu / illustrazioni | 08 | Triangolo di attenzione rosso con tre tacche: avvertenza seria (rosso perché il rosso qui è significato). | SVG chiaro + scuro | 153×146 | sì | no |
| `piano-superamento` | blu / illustrazioni | 08 | Calendario con due caselle spuntate e raggi: il piano di studio in corso verso il test. | SVG chiaro + scuro | 166×150 | sì | no |
| `simulazione-esame` | blu / illustrazioni | 08 | Cartellina con la bandiera UK e due spunte: una simulazione d'esame. | SVG chiaro + scuro | 163×153 | sì | no |
| `rischio-economico-ali` | blu / illustrazioni | 08 (e 02/47: «Se non superi») | Pila di euro con le ali: i soldi che volano via a ogni tentativo. | SVG chiaro + scuro | 172×150 | sì | no |
| `progressi-statistiche-scheda` | blu / illustrazioni | 08 | Scheda con barre blu e freccia in su: miglioramento tra una simulazione e l'altra. | SVG chiaro + scuro | 172×141 | sì | no |
| `quiz-test-lista` | blu / illustrazioni | 08 | Lista di domande con la prima già spuntata: una sessione appena iniziata. | SVG chiaro + scuro | 182×140 | sì | no |
| `cappello-laurea-orologio` | blu / illustrazioni | 15 | Tocco di laurea con un cronometro: il tempo che resta prima dell'OFA e della laurea. | SVG chiaro + scuro | 114×103 | sì | no |
| `composizione-tre` | blu / illustrazioni | 40 | Misuratore, globo e calendario con lucchetto insieme: riepilogo del percorso, intestazioni larghe. | SVG chiaro + scuro | 219×198 | sì | no |
| `attesa` | blu / stati | 08 | Clessidra azzurra chiara: aspettare qualcosa (sfida inviata, risposta dell'amico). | SVG chiaro + scuro | 57×83 | sì | no |
| `caricamento` | blu / stati | 08 | Anello a due archi: caricamento (l'anello che gira è il componente Caricamento). | SVG chiaro + scuro | 74×76 | sì | no |
| `celebrazione-fiocco` | blu / stati | 08 | Fiocco blu con coriandoli: piccolo traguardo (badge sbloccato, lezione finita). | SVG chiaro + scuro | 78×81 | sì | no |
| `documento-completato` | blu / stati | 08 | Foglio con spunta verde: operazione o lezione completata. | SVG chiaro + scuro | 82×84 | sì | no |
| `documento-errore` | blu / stati | 08 | Foglio con una croce rossa: qualcosa non è andato a buon fine (import fallito, file non valido). | SVG chiaro + scuro | 82×84 | sì | no |
| `documento-in-corso` | blu / stati | 08 | Foglio con un orologio: elaborazione in corso, calcolo. | SVG chiaro + scuro | 85×84 | sì | no |
| `messaggi` | blu / stati | 08 | Tre fumetti: messaggi, conversazioni, segnalazioni inviate. | SVG chiaro + scuro | 180×77 | sì | no |
| `mondo-globo` | blu / stati | 08 | Globo senza aeroplano: collegamento, offline, mondo. | SVG chiaro + scuro | 101×94 | sì | no |
| `notifica` | blu / stati | 08 | Busta con un pallino rosso «1»: un avviso da leggere (promemoria dello studio). | SVG chiaro + scuro | 93×69 | sì | no |
| `obiettivo` | blu / stati | 08 | Bersaglio con una freccia al centro: obiettivo (data del test, punteggio da raggiungere). | SVG chiaro + scuro | 92×90 | sì | no |
| `ricerca-scintille` | blu / stati | 08 | Lente con tre tratti: la ricerca non trova nulla. | SVG chiaro + scuro | 100×80 | sì | no |
| `vuoto` | blu / stati | 08 | Nuvola triste: non c'è ancora niente (nessuna simulazione, nessun amico). | SVG chiaro + scuro | 103×69 | sì | no |
| `sfera-addiofa` | blu / sfere | 44 (28, 35) | Sfera di vetro con la stella a quattro punte del marchio. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-app` | blu / sfere | 44 (28, 35) | Sfera con un telefono: installare l'app, funziona offline. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-community` | blu / sfere | 44 (28, 35) | Sfera con tre persone: amici, community, classifica. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-consigli` | blu / sfere | 44 (28, 35) | Sfera con la lampadina: consigli e spiegazioni. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-costi` | blu / sfere | 44 (28, 35) | Sfera con una moneta da euro: quanto costa il test (circa 30 €); l'app è gratuita. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-faq` | blu / sfere | 44 (28, 35) | Sfera con due fumetti: domande frequenti, aiuto. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-ofa` | blu / sfere | 44 (28, 35) | Sfera con un lucchetto: che cos'è l'OFA e che cosa blocca. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-opportunita` | blu / sfere | 44 (28, 35) | Sfera con il globo e l'aeroplano: le opportunità dopo l'OFA (secondo anno, scambi). | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-polimi` | blu / sfere | 44 (28, 35) | Sfera con un edificio a colonne: il Politecnico come istituzione, in testo mai come marchio. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-quiz` | blu / sfere | 44 (28, 35) | Sfera con un foglio A, B, C: quiz e domande. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-risultati` | blu / sfere | 44 (28, 35) | Sfera con barre e una freccia: risultati e andamento. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-studio` | blu / sfere | 44 (28, 35) | Sfera con libri e bandiera UK: studio, lezioni. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-successi` | blu / sfere | 44 (28, 35) | Sfera con un bersaglio colpito: traguardi e obiettivi. | SVG chiaro + scuro | 272×272 | sì | no |
| `sfera-tips` | blu / sfere | 44 (28, 35) | Sfera con un tocco di laurea: i consigli per arrivare al test. | SVG chiaro + scuro | 272×272 | sì | no |
| `accesso-bloccato` | luminoso / illustrazioni | 16, 17 | Come nel kit blu, in stile luminoso: studente con il tocco, finestra e orologio. | SVG chiaro + scuro | 168×118 | sì | no |
| `attesa-caricamento` | luminoso / illustrazioni | 16, 17 | Clessidra arancione in stile luminoso. | SVG chiaro + scuro | 143×120 | sì | no |
| `celebrazione` | luminoso / illustrazioni | 16, 17 | Cono di coriandoli in stile luminoso. | SVG chiaro + scuro | 99×124 | sì | no |
| `mancato-superamento` | luminoso / illustrazioni | 16, 17 | Fogli con una croce rossa in stile luminoso. | SVG chiaro + scuro | 150×131 | sì | no |
| `messaggi-supporto` | luminoso / illustrazioni | 16, 17 | Due fumetti blu in stile luminoso. | SVG chiaro + scuro | 147×95 | sì | no |
| `mondo-internazionale` | luminoso / illustrazioni | 16, 17 | Globo blu con aeroplano e orbita gialla, stile luminoso. | SVG chiaro + scuro | 152×125 | sì | no |
| `piano-studi-bloccato` | luminoso / illustrazioni | 16, 17 | Calendario con lucchetto rosso, stile luminoso. | SVG chiaro + scuro | 179×160 | sì | no |
| `progressi-statistiche` | luminoso / illustrazioni | 16, 17 | Quattro barre blu piene, stile luminoso. | SVG chiaro + scuro | 144×112 | sì | no |
| `quiz-test` | luminoso / illustrazioni | 16, 17 | Foglio di quiz A, B, C (B rossa), stile luminoso. | SVG chiaro + scuro | 176×169 | sì | no |
| `ricerca` | luminoso / illustrazioni | 16, 17 | Lente blu, stile luminoso. | SVG chiaro + scuro | 134×123 | sì | no |
| `rischio-economico` | luminoso / illustrazioni | 16, 17 | Banconote blu con l'euro, stile luminoso. | SVG chiaro + scuro | 189×156 | sì | no |
| `risultato-probabilita` | luminoso / illustrazioni | 16, 17 | Arco blu con il 82 % e il pallino giallo, stile luminoso. | SVG chiaro + scuro | 213×140 | sì | no |
| `studio-inglese` | luminoso / illustrazioni | 16, 17 | Libri blu con la bandiera UK, stile luminoso. | SVG chiaro + scuro | 184×154 | sì | no |
| `successo` | luminoso / illustrazioni | 16, 17 | Coppa gialla con la stella, stile luminoso. | SVG chiaro + scuro | 156×162 | sì | no |
| `suggerimenti-consigli` | luminoso / illustrazioni | 16, 17 | Lampadina gialla, stile luminoso. | SVG chiaro + scuro | 169×170 | sì | no |
| `superamento` | luminoso / illustrazioni | 16, 17 | Fogli con spunta verde, stile luminoso. | SVG chiaro + scuro | 206×162 | sì | no |
| `verifica-utente` | luminoso / illustrazioni | 16, 17 | Tessera con avatar e righe, stile luminoso. | SVG chiaro + scuro | 164×106 | sì | no |
| `studio-inglese` | rosso / illustrazioni | 08 | Kit rosso: libri rosa con la bandiera UK. Solo catalogo (l'app è blu). | SVG chiaro + scuro | 168×164 | sì | no |
| `quiz-test` | rosso / illustrazioni | 08 | Kit rosso: lista di domande con una spunta. Variante blu: quiz-test-lista. | SVG chiaro + scuro | 182×138 | sì | no |
| `rischio-economico` | rosso / illustrazioni | 08 | Kit rosso: pila di euro con le ali. Variante blu: rischio-economico-ali. | SVG chiaro + scuro | 172×150 | sì | no |
| `piano-studi-bloccato` | rosso / illustrazioni | 08 | Kit rosso: calendario con lucchetto. Doppione del kit blu. | SVG chiaro + scuro | 156×137 | sì | no |
| `piano-superamento` | rosso / illustrazioni | 08 | Kit rosso: calendario con spunte. Variante blu: piano-superamento. | SVG chiaro + scuro | 166×149 | sì | no |
| `successo-superamento` | rosso / illustrazioni | 08 | Kit rosso: coppa. Doppione del kit blu (successo). | SVG chiaro + scuro | 152×164 | sì | no |
| `verifica-utente` | rosso / illustrazioni | 08 | Kit rosso: tessera. Doppione del kit blu. | SVG chiaro + scuro | 199×108 | sì | no |
| `simulazione-esame` | rosso / illustrazioni | 08 | Kit rosso: cartellina con bandiera. Variante blu: simulazione-esame. | SVG chiaro + scuro | 163×152 | sì | no |
| `attenzione-rischio` | rosso / illustrazioni | 08 | Kit rosso: triangolo di attenzione. Già rosso anche nel kit blu. | SVG chiaro + scuro | 153×146 | sì | no |
| `progressi-statistiche` | rosso / illustrazioni | 08 | Kit rosso: scheda con barre. Variante blu: progressi-statistiche-scheda. | SVG chiaro + scuro | 172×140 | sì | no |
| `suggerimenti-consigli` | rosso / illustrazioni | 08 | Kit rosso: lampadina. Doppione del kit blu. | SVG chiaro + scuro | 142×146 | sì | no |
| `ricerca` | rosso / stati | 08 | Kit rosso: lente con tratti. Variante blu: ricerca-scintille. | SVG chiaro + scuro | 100×80 | sì | no |
| `completato` | rosso / stati | 08 | Kit rosso: foglio con spunta. Variante blu: documento-completato. | SVG chiaro + scuro | 82×84 | sì | no |
| `errore` | rosso / stati | 08 | Kit rosso: foglio con croce. Variante blu: documento-errore. | SVG chiaro + scuro | 82×84 | sì | no |
| `vuoto` | rosso / stati | 08 | Kit rosso: nuvola triste. Variante blu: vuoto. | SVG chiaro + scuro | 103×69 | sì | no |
| `celebrazione` | rosso / stati | 08 | Kit rosso: fiocco rosso con coriandoli. Variante blu: celebrazione-fiocco. | SVG chiaro + scuro | 78×81 | sì | no |
| `attesa` | rosso / stati | 08 | Kit rosso: clessidra. Variante blu: attesa. | SVG chiaro + scuro | 57×82 | sì | no |
| `in-corso` | rosso / stati | 08 | Kit rosso: foglio con orologio. Variante blu: documento-in-corso. | SVG chiaro + scuro | 85×84 | sì | no |
| `obiettivo` | rosso / stati | 08 | Kit rosso: bersaglio. Variante blu: obiettivo. | SVG chiaro + scuro | 92×90 | sì | no |
| `messaggi` | rosso / stati | 08 | Kit rosso: tre fumetti. Variante blu: messaggi. | SVG chiaro + scuro | 180×77 | sì | no |
| `mondo-internazionale` | rosso / stati | 08 | Kit rosso: globo. Variante blu: mondo-globo. | SVG chiaro + scuro | 101×94 | sì | no |
## 3. Piano d'uso: schermata → illustrazione

Ogni riga dice **quale** illustrazione, **dove** sta e **quanto** è grande. `L:` = `kit-luminoso` (serve `kit="kit-luminoso"`), `A:` = animata (`IllustrazioneAnimata`, parte una volta), le sfere sono `sfera-…`. Le dimensioni sono la larghezza (`lato`) a 400 px di schermo; a 1280 px si può arrivare a 1,3 volte. Dove una cella dice «già», lo schema c'è oggi nel codice. I concept citati sono i NN di `grafica/fonti/INDICE.md`; i concept sono quasi tutti fatti di icone e foto: dove non mostrano arte, l'illustrazione sta nel posto che il kit prevede per quello stato (es. stati vuoto/errore: concept 08, 16, 17).

### 3.1 Home e studio

| Schermata | Illustrazione (mestiere) | Dimensione e posizione | Concept |
|---|---|---|---|
| **Home, primo avvio** (nessuna risposta) | `quiz-test-lista` (inizia a rispondere) | 96 px, a sinistra del pulsante «Inizia a studiare», sotto il misuratore vuoto | 01, 03, 14 |
| **Home, fascia bassa** (banner sotto il misuratore) | `attenzione-rischio` (avvertenza) | 64 px, al posto del punto esclamativo nel banner tinto di corallo | 01 (a sinistra), 21 |
| **Home, fascia media** | `progressi-statistiche` (andamento) | 64 px, nel banner ambra (nel concept c'è il grafico a barre) | 01 (al centro) |
| **Home, fascia alta** | `successo` (traguardo) | 64 px, nel banner verde (nel concept c'è la spunta) | 01 (a destra) |
| **Home, scheda «Lezione consigliata»** | `sfera-studio` (lezioni) | 48 px, a sinistra del titolo della lezione | 39, 21, 30.6 |
| **Esercizi** (menu di allenamento) | `L: quiz-test` (domande) in testata; sfere nelle voci: `sfera-quiz` (Quiz e domande), `sfera-studio` (Lezioni e teoria) | testata 160 px centrata sopra le voci; sfere 56 px a sinistra di ogni voce | 30.9, 49.2 |
| **Percorso** (elenco lezioni per unità) | `L: studio-inglese` (studio) in testata; `piano-superamento` (calendario di studio) sulla scheda «Il tuo piano» | testata 200 px a destra del titolo; scheda 96 px | 30.7, 49.4 |
| **Lezione, dettaglio** (per argomento) | un'illustrazione per famiglia di argomento, sempre piatta e piccola (vedi sotto) | 72 px a destra del titolo, nell'intestazione; a lezione finita `documento-completato` (operazione riuscita) 96 px sopra «Continua» | 30.8, 49.5 |
| **Teoria** (elenco e pagina di una regola) | `L: suggerimenti-consigli` (spiegazione) in testata dell'elenco; `ricerca-scintille` (nessun risultato) quando la ricerca non trova nulla | testata 160 px; stato vuoto 96 px | 36, 49 |
| **Cheat sheet** | `sfera-consigli` (promemoria rapido) | 72 px nella testata | 36 |
| **Frasi e vocaboli** | `L: ricerca` (cerca) in testata; `ricerca-scintille` se non trova | 160 px; 96 px | 36, 49 |
| **Sessione di studio: domanda** | nessuna (il concept è solo testo e risposte) | — | 30.9, 49.5 |
| **Sessione: feedback giusto / sbagliato** | nessuna illustrazione: icone lucide (spunta, croce) e testo della spiegazione | — | 30.9 |
| **Sessione: caricamento delle domande** | `A: attesa-caricamento` (già) | 110 px al centro | — |
| **Sessione: fine** | `A: successo` (già, traguardo); sotto, se ci sono due misure, `progressi-statistiche-scheda` (prima / dopo) | 104 px; 120 px sopra la tabella «prima → dopo» | 31, 30 |

Famiglie di argomento per «Lezione, dettaglio» e per le carte dell'elenco (l'argomento viene da `grammarTopic`, 31 argomenti):

| Famiglia | Argomenti | Illustrazione |
|---|---|---|
| Tempi | Present Simple/Continuous, Past Simple/Continuous/Perfect, Present Perfect, Future: going to, Used to | `attesa-caricamento` |
| Domande | Question Tags, Questions and Origins | `ricerca` |
| Confronti e quantità | Comparatives and Superlatives, Quantifiers | `progressi-statistiche` |
| Condizionali e modali | First/Second/Third Conditional, Modals (obbligo, deduzione, abilità) | `suggerimenti-consigli` |
| Discorso e frase | Reported Speech, Passive Voice, Relative Clauses, Gerunds vs Infinitives | `messaggi-supporto` |
| Chi e dove | Object Pronouns, Possessives, Possessive S, Demonstratives, There is/are, Prepositions of Place/Time | `verifica-utente` |
| Il resto | Imperative, Adverbs of Manner | `studio-inglese` |

### 3.2 Simulazioni e sfide

| Schermata | Illustrazione (mestiere) | Dimensione e posizione | Concept |
|---|---|---|---|
| **Simulazioni, elenco** | `simulazione-esame` (simulazione) in testata; `vuoto` (nessuna ancora) se non ne esiste nessuna | 140 px a destra del titolo; 120 px al centro | 30.10, 49.6 |
| **Simulazione, dettaglio** (esito) | superata: `L: superamento`; non superata: `L: mancato-superamento` | 160 px in testata sopra il punteggio | 18, 43 |
| **Simulazione, intro** (30 domande, 15 minuti, soglia 25) | `L: attesa-caricamento` (tempo) | 160 px sopra i tre dati | 30.10 |
| **Simulazione in corso** | nessuna (sono le domande) | — | 30.9 |
| **Simulazione: consegna** (correzione in corso) | `documento-in-corso` (elaborazione) | 96 px al centro, finché si calcola | 09, 20 |
| **Esito superato** (`EsitoSimulazione`) | `A: celebrazione` (festa per un esito positivo; oggi usa `successo`, da cambiare) | 120 px nella scheda dell'esito | 10, 20, 43 |
| **Esito non superato** | `A: mancato-superamento` (già) | 120 px | 10, 43 |
| **Correzioni complete** | nessuna sulle singole domande (icone); vuote: `vuoto` | — | 10, 43 |
| **Sfide, oggi** (sfida del giorno, duello) | `successo` (traguardo: la sfida della settimana) nella scheda in evidenza | 96 px a destra del titolo della sfida | 06.1, 30.12 |
| **Sfida, gioco** | `A: quiz-test` e `A: attesa-caricamento` (già) | 120 px, 110 px | 30.13 |
| **Sfida: in attesa** dopo aver condiviso il link | `attesa` (aspetto l'amico) | 96 px sopra il link | 05 |
| **Sfida: accetta** (arrivo da link `?sfida=`) | `L: successo` (la sfida da accettare) | 160 px in testata | 06.3, 30.13 |
| **Sfida: risultato** | vinta: `L: celebrazione`; persa: `mancato-superamento` (piatta, non superata) | 160 px; 120 px | 06.6, 30.12 |
| **Amici** | `messaggi-supporto` (già, vuoto) | 120 px | 06.5, 22 |
| **Classifica** | `sfera-community` (testata); `vuoto` se non c'è nessuno | 72 px; 120 px | 06.4, 30.14 |
| **Condividi** (foglio) | `attesa` (aspetto l'amico: stesso mestiere dell'attesa) | 96 px sopra il link | 05, R7 |

### 3.3 Onboarding e funnel

L'onboarding è un unico flusso di 9 passi (`Onboarding.tsx`): qui sono tutti. Nei concept 02 e 47 è la sequenza «Hai l'OFA? → certificazione → OFA → verifica il livello → quiz → Se non superi → risultato».

| Schermata | Illustrazione (mestiere) | Dimensione e posizione | Concept |
|---|---|---|---|
| **Intro** | `A: studio-inglese` (già) | 200 px sotto il titolo | 02.1, 47.1 |
| **Certificazione** (domanda sì/no) | `sfera-tips` (titolo di studio: il cappello) | 96 px sopra le due scelte | 02.2 |
| **Certificazione: forse sei esente** | `A: superamento` (già) | 200 px | 02.2 |
| **OFA** (domanda sì/no) | `sfera-ofa` (obbligo) | 96 px sopra le due scelte | 02.3 |
| **Verifica il livello** (introduzione al quiz) | `A: quiz-test` (già) | 200 px | 02.4 |
| **Quiz diagnostico** | nessuna | — | 02.5 |
| **Se non superi** (rischio) | `A: rischio-economico-ali` al posto di `rischio-economico`: costo vero (circa 30 € a tentativo) | 200 px sopra le quattro righe | 02.7, 47.7 |
| **Calcolo del risultato** | `documento-in-corso` (elaborazione): facoltativa, il concept è solo il misuratore | 72 px a fianco dell'elenco delle aree analizzate | 09, 10, 20, 42, 43 |
| **Risultato, fascia bassa** | `attenzione-rischio` (avvertenza) | 160 px sopra il titolo «Hai margine» | 09.6, 10.6 |
| **Risultato, fascia media** | `progressi-statistiche` (andamento) | 160 px | 10.6 |
| **Risultato, fascia alta** | `successo` (traguardo) | 160 px | 10.6 |
| **Registrazione** (nome ed email, se il coordinatore la rimette nel funnel) | `L: verifica-utente` (identità) | 160 px sopra i campi | 02.6, 05 |
| **Fine / obiettivo** (ultimo passo, «Il tuo obiettivo è a portata di mano») | `obiettivo` (bersaglio) | 160 px sopra il pulsante | 02.14, 47.14 |

### 3.4 Profilo, progressi, obiettivi, badge, impostazioni

| Schermata | Illustrazione (mestiere) | Dimensione e posizione | Concept |
|---|---|---|---|
| **Profilo, hub a tessere** | tessere: `sfera-risultati` (Progressi), `sfera-successi` (Obiettivi), `celebrazione-fiocco` (Badge), `piano-superamento` (Calendario) | 56 px a sinistra del titolo di ogni tessera; senza nome impostato `verifica-utente` 96 px nella testata | 06 (riga in basso), 18, 19 |
| **Modifica profilo** | `cappello-laurea-orologio` (il tuo corso di studi); le dieci illustrazioni scelte per l'avatar restano (già) | 120 px sopra il campo «Corso» | 06.7, 19 |
| **Progressi** | `L: progressi-statistiche` in testata; `sfera-risultati` sulla riga «Per argomento»; `ricerca-scintille` se non ci sono dati | 160 px; 48 px; 96 px | 06.2, 18, 19 |
| **Progressi: calendario e attività** | `piano-superamento` (calendario) quando non c'è nessuna attività | 96 px | 06.5, 18 |
| **Obiettivi** | `obiettivo` in testata; `L: accesso-bloccato` accanto alle scadenze del piano del 2° anno; `notifica` (promemoria) sulla riga «Ricordami» | 120 px; 160 px; 56 px | 06.3, 18 |
| **Badge** | `celebrazione-fiocco` quando se ne sblocca uno; per ogni badge l'illustrazione già scelta in `lib/profilo/badge.ts`; costanza (giorni di studio) → `piano-superamento` | 96 px nel foglio di sblocco; 72 px nel badge | 06.4 |
| **Impostazioni** | righe con sfera: `sfera-faq` (Aiuto e FAQ), `sfera-app` (Installa l'app), `sfera-addiofa` (Informazioni); `notifica` (Notifiche); `documento-completato` / `documento-errore` quando «Importa progressi» riesce o fallisce | 40 px a sinistra della riga; 96 px nel foglio di esito | 06.6, 19, 30.16 |
| **Informazioni sull'OFA** (foglio dal funnel, dalle Impostazioni, dalla landing) | `L: piano-studi-bloccato` (piano limitato) in testata; `L: rischio-economico` (costo del test) sul paragrafo dei costi | 160 px; 128 px | 02.7, 45 |

### 3.5 Esplora, Project, servizi e stati

| Schermata | Illustrazione (mestiere) | Dimensione e posizione | Concept |
|---|---|---|---|
| **Esplora** (hub dei progetti) | `L: mondo-internazionale` (il mondo di Project) in testata; schede: `sfera-opportunita` (ATLAS), `sfera-community` (NOI), `sfera-polimi` (Agorà: in testo «Politecnico di Milano», l'edificio è generico, mai marchio) | 200 px; 72 px a sinistra di ogni scheda | 30.8, 49.8 |
| **Project ID** | `L: verifica-utente` (identità: la stessa della registrazione) | 160 px in testata | 06.1, 30.15 |
| **ATLAS, analisi** | `sfera-opportunita` (ATLAS) | 96 px nella testata | 30.4, 30.5, 49.9 |
| **NOI** | `sfera-community` | 96 px nella testata | 49.11 |
| **Agorà** | `sfera-polimi` | 96 px nella testata | 49.13 |
| **Project (informazioni sull'ecosistema)** | `mondo-internazionale` (piatta, con l'aeroplano: viaggio) | 96 px sopra il testo | 13 |
| **FAQ** | `L: messaggi-supporto` in testata; categorie con sfera: `sfera-ofa` (OFA), `sfera-costi` (Costi), `sfera-app` (App), `sfera-quiz` (Test e quiz); `ricerca` sul campo di ricerca; `ricerca-scintille` se non trova | 160 px; 48 px; 64 px; 96 px | 49, 30.16 |
| **Segnala** | `messaggi` (tre fumetti) in testata; inviata: `documento-completato`; non riuscita: `documento-errore` | 120 px; 120 px; 120 px | 13, 16, 17 |
| **Stato vuoto** (`stato-vuoto`) | `vuoto` (nuvola triste): oggi usa `messaggi-supporto` | 120 px al centro | 08.068, 17 |
| **Errore** (`ErrorBoundary`, import fallito) | `documento-errore` (oggi usa `suggerimenti-consigli`) | 120 px | 08, 16 |
| **Offline** | `mondo-globo` (il globo senza aeroplano: nessun collegamento); oggi usa `mondo-internazionale` | 168 px | 08.074 |
| **Caricamento** | componente `Caricamento` (spinner) o `A: attesa-caricamento` (già) | 110 px | 08 |
| **Successo** (operazione riuscita, generico) | `documento-completato` | 96-120 px | 08, 16 |
| **Splash** | logo (`Marchio`/`Logo`), nessuna illustrazione | — | 30.1, 49.1 |
| **Pagine legali** (Termini, Privacy, Cookie) | `sfera-addiofa` (marchio) sopra il titolo; il resto è testo | 56 px | — |
| **404** (pagina non trovata) | `ricerca-scintille` (non trovato) | 168 px | 16, 17 |
| **Landing** (agente LANDING) | già: `mancato-superamento`, `rischio-economico`, `piano-studi-bloccato`, `accesso-bloccato` (88 px), `quiz-test`, `attesa-caricamento`, `progressi-statistiche`, `suggerimenti-consigli` (104 px), `superamento` (150 px). Da aggiungere sulla fila dei quattro vantaggi (concept 45): `sfera-ofa` (sblocca il piano), `sfera-costi` (non perdere i circa 30 €), `sfera-risultati` (test iniziale), `sfera-quiz` (simulazioni) | sfere 48 px a sinistra di ogni vantaggio | 12, 41, 45, 51 |

### 3.6 Copertura

Le 67 illustrazioni dell'app compaiono tutte nelle tabelle sopra, tranne le tre della sezione 4. Controllo meccanico: `python3 tools/controlla-illustrazioni.py` dà l'elenco di quelle non ancora usate dalle schermate.

## 4. Le illustrazioni che nessuna schermata usa, e perché

| Grafica | Dove sta | Motivo |
|---|---|---|
| `composizione-tre` (misuratore + globo + calendario) | spedita, `NON_USATE_OK` | Ha scritto nel disegno «82 %» accanto al misuratore: un numero che sembrerebbe dell'utente. Il misuratore dell'app è il componente con il valore vero. Si può usare solo se si ridisegna senza cifra. |
| `kit-luminoso/risultato-probabilita` | spedita, `NON_USATE_OK` | Stesso motivo: «82 %» nel disegno. |
| `kit-blu/stati/caricamento` | spedita, `NON_USATE_OK` | È un anello fermo: lo spinner che gira è il componente `Caricamento`; un'immagine ferma farebbe pensare a un blocco. |
| Kit rosso (11 illustrazioni e 10 stati) | spedito (solo catalogo `?brand`, non nella demo), `NON_USATE_OK` | L'app è blu (decisione 11/10). Le composizioni **diverse** dal kit blu sono state ricolorate in blu e portate nel kit blu (`blu_da_rosso.py`: `rischio-economico-ali`, `progressi-statistiche-scheda`, `quiz-test-lista`, `piano-superamento`, `simulazione-esame`, `attenzione-rischio` e i 12 stati); le altre (`studio-inglese`, `successo-superamento`, `suggerimenti-consigli`, `verifica-utente`, `piano-studi-bloccato`, `risultato-probabilita`) sono lo stesso disegno del kit blu in rosso. |
| `email-istituzionale` (blu e rosso, `email-istituzionale-sigillo`, `email-polimi`) | **non spedite** | Contengono il sigillo del Politecnico (qui un segnaposto): non si usa lo stemma come marchio (CLAUDE.md). Tolte dal catalogo. Se la registrazione chiede l'email PoliMi, l'illustrazione è `kit-luminoso/verifica-utente`. |
| `piano-studi-bloccato-lucchetto-blu` / `-navy` | **non spedite** | Doppioni di `piano-studi-bloccato` con il lucchetto di un altro colore; il rosso del lucchetto è anche il significato (blocco). |
| `forme-*`, `scintilla`, `scia-scintilla-onda`, `quadrato-stella-punti`, `piastra-punti` (concept-svg/illustrazioni/kit-blu/forme) | **non spedite** | Forme decorative dei layout (locandine, social, landing): non sono illustrazioni di un'azione o di uno stato. Restano in `grafica/` per chi disegna una locandina. |

### «Se non superi»: il costo (circa 30 €) è un dato vero

`rischio-economico` (banconota inclinata), `rischio-economico-ali` (pila di euro con le ali: i soldi che volano via) e `kit-luminoso/rischio-economico` **si possono usare**, perché il costo di un tentativo (circa 30 € presso gli enti convenzionati, `RETAKE_COST_EUR` in `config/offer.ts`) è un dato vero e il testo accanto lo dice. Il lucchetto del concept 02 era del Pass a pagamento; non c'è più: `piano-studi-bloccato` e `accesso-bloccato` restano perché «il piano di studi resta limitato finché c'è l'OFA» è la regola vera, non un blocco commerciale. Non si usa invece nessuna illustrazione con prezzi (14,99 €, 9,99 €, «Pass»).

## 5. Le altre grafiche in `grafica/brand/`: cosa se ne fa

| Cartella | Contenuto | Decisione |
|---|---|---|
| `disegni/kit-blu`, `disegni/kit-rosso` | le 18 + 12 + 12 illustrazioni disegnate (con `.maglie.svg`, `.misure.json`) | fonte; spedite le versioni pulite, **tutte** (sezione 2). I `.maglie.svg` (3 MB di lavoro) non entrano nell'app. |
| `disegni/kit-luminoso` (nuova) | copia del «vivo» (concept 17) da `concept-svg/illustrazioni-luminose/vivo/` (17 soggetti, viewBox allargato dove un raggio usciva dalla tela) | spedita, sezione 2. Lo stile «luminoso» con i bagliori caldi (concept 16, `concept-svg/illustrazioni-luminose/`) resta nella cartella: stessi soggetti, più effetti, più peso; non serve a niente in più. |
| `disegni/kit-blu/sfere` (nuova) | 14 icone sfera del concept 44 | spedite, sezione 2. |
| `elementi/` (PNG estratti dalle tavole), `vettori/` (ricalchi), `livelli/`, `tavole/` | raster da 200 px e ricalchi automatici | fonti storiche, **non spedite** (25 MB; il disegno pulito le sostituisce). |
| `glifi/kit-blu` (14, ridisegnati puliti dall'agente ILLU), `glifi/kit-rosso` | glifi delle icone tonde | già spediti; il kit rosso è solo catalogo. |
| `hero/`, `landing/` | scena dell'hero, banner, sfondo della chiusura | agente LANDING: non toccati. |
| `logo/` (73 file) | il logo 3D, varianti, icone PWA | spedito il logo e l'icona; le varianti (rosso, tile piatti) restano fonti. |
| `concept-svg/logo/` (wordmark, lockup, lettermark, stelle) | sistema del marchio in SVG | l'app usa `Marchio.tsx` (generato da `genera-marchio.py` da questi file); i lockup colorati servono a locandine e social. |
| `concept-svg/componenti/` (blu, rosso, luminoso: pulsanti, chip, campi, avanzamento) | i componenti dei kit disegnati in SVG | l'app li ha in codice (`brand/componenti.tsx`, `components/ui.tsx`): gli SVG sono riferimento per il confronto, non per la spedizione. |
| `concept-svg/icone/tonde` (kit blu, rosso, d, luminoso, marchio) e `icone/tratto` | set di icone tonde e a tratto | l'app ha `lucide-react` e i glifi: le icone tonde del kit blu sono gli stessi 14 glifi già in `glifi/`; `tratto` sarebbe un terzo sistema di icone (regola: una funzione = una icona). Non spedite. |
| `concept-svg/layout/` (locandine, carosello, banner, profilo Instagram, copertine, landing desktop) | grafica per social e stampa | non è per l'app; serve alla comunicazione fuori dall'app. |
| `concept-svg/schermate/` (16 cartelle) e `concept/NN-*/` | schermate dei concept ricostruite e ritagli | **riferimento** per chi costruisce le schermate (brief ILLUSTRATO): non spedite. |
| `concept-svg/token/` | palette e tipografia | riferimento; i token veri sono in `app/src/index.css` e `brand/tokens.ts`. |

## 6. Come si rigenera (e cosa resta da togliere)

```bash
cd grafica
python3 strumenti/brand/blu_da_rosso.py       # varianti blu del kit rosso -> disegni/kit-blu/{illustrazioni,stati}
python3 strumenti/brand/porta_in_disegni.py   # cappello, composizione, 14 sfere, kit luminoso -> disegni/
python3 strumenti/brand/scuro_svg.py          # tutte le varianti .scuro.svg (tabella REGOLE e scuro_sfera)
python3 strumenti/brand/controlla_temi.py ../app/src/brand/essenziali/disegni --foglio /tmp/foglio.png
cd .. && bash tools/sincronizza-essenziali.sh # copia in app/src/brand/essenziali (ottimizza, toglie le nuvolette)
python3 tools/controlla-illustrazioni.py
```

`controlla_temi.py` rende ogni SVG in Chromium su `#F7F9FD` e `#0A101F` e misura bianchi abbaglianti, blu scuro su scuro, ritagli ai bordi, aloni bianchi, `<text>`; il foglio è da guardare. Esito del 16/10 sui 67 file dell'app: nessun `<text>`, nessun colore che sparisce sul fondo scuro, nessun ritaglio nelle nuove; restano segnalate come «bianco su chiaro» alcune carte bianche già esistenti (quiz-test, messaggi-supporto, simulazione-esame…), che hanno bordo e ombra e si vedono (controllato sul foglio).

**File da cancellare** (non posso cancellare): `grafica/brand/disegni/kit-blu/stati/{completato,errore,in-corso}{.svg,.scuro.svg}` e le stesse sei copie in `app/src/brand/essenziali/disegni/kit-blu/stati/`: sono i nomi di una prima versione, sostituiti da `documento-completato`, `documento-errore`, `documento-in-corso` (il nome «errore» e «completato» è anche una icona del kit: il catalogo cercherebbe il file sbagliato). Non fanno danni, ma nel bundle pesano 15 KB.
