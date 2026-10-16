# NOTE-ILLUSTRATO-HOME: la Home «completa» ricostruita dai concept

Agente ILLUSTRATO-HOME. Immagini di confronto in `docs/lavoro/extra/illustrato/home/` (concept 14 | app, chiaro e scuro, 400 px; medio e alto; nuovo e 360×640; 1280 px).

## Cosa fa la Home ora (ordine, e niente altro)
Intestazione (marchio a sinistra, profilo a destra) → misuratore con ⓘ (apre `FoglioStima`) → fascia di stato con illustrazione → un solo ▶ (Continua; «Diagnostico» a chi non l'ha mai fatto) → **Lezioni** (prossime tre del percorso, «Tutte» → `percorso`) → **Simulazione** (ultimo x/30 + data, ▶, «Tutte» → `simulazioni`) → **Andamento** (solo punti misurati; vuoto onesto se non ce n'è; ⓘ anche qui) → barra Home | Esercizi | Sfide.

## Tabella schermata → concept → illustrazioni → cosa non somiglia

| Parte | Concept | Illustrazione (kit blu) | Non somiglia ancora / scelta |
|---|---|---|---|
| Home, fascia di stato | 14, 01, 03, 11, 21, 33 | nuovo `quiz-test-lista`; basso (in partenza, da migliorare) `attenzione-rischio`; medio `progressi-statistiche`; alto `successo`, 56 px a sinistra delle due parole | Nei concept la fascia ha icone tonde (!, barre, spunta) e due righe di testo; qui illustrazione del piano d'uso e 1-2 parole (regola «niente frasi»). `quiz-test-lista` è chiaro su chiaro: la fascia «nuovo» è tinta azzurra perché il foglio si legga |
| Home, misuratore | 14 | componente `Misuratore` (non toccato) | Etichetta «Probabilità stimata» e non «Rischio di fallimento» (decisione di prodotto). Il saluto «Ciao, Raffaele» dei concept 01/11 non c'è (non ci sono nomi inventati) |
| Home, Lezioni | 14 («Il tuo prossimo obiettivo»), 39, 21, 33 | una tessera bianca per riga con l'illustrazione della **famiglia di argomento** (tabella del piano: tempi `attesa-caricamento`, domande `ricerca`, confronti `progressi-statistiche`, condizionali/modali `suggerimenti-consigli`, discorso `messaggi-supporto`, chi e dove `verifica-utente`, il resto `studio-inglese`), 56 px | Il piano d'uso per la «Lezione consigliata» prevedeva `sfera-studio` 48 px; ho preferito la famiglia di argomento perché il brief chiede «la tessera/illustrazione dell'argomento» e così le tre righe si distinguono. Il concept 14 mostra una sola carta con il libro: qui tre righe (lo chiede il brief) |
| Home, Simulazione | 36/49 (Simulazioni), 18, 14 (▶) | `simulazione-esame` 54 px; ▶ tondo azzurro | I concept non hanno una carta simulazione in Home: è disegnata con i pezzi del 14 (carta superficie-2, ▶ come il pulsante). Con risultato: x/30 colorato + «Superata»/«Sotto soglia» con icona + data; senza: i tre dati del formato con icone (30, 15 min, 25/30) |
| Home, Andamento | 14, 21, 33 («Come cambia il tuo rischio» / «Il tuo percorso») | vuoto: `progressi-statistiche-scheda` 68 px | Nei concept la curva ha tre punti **inventati** (82→62→28 %): qui solo punti misurati. Il vuoto usa `progressi-statistiche-scheda` (piano d'uso: «Sessione: fine» e «Progressi»); il piano prevedeva `ricerca-scintille` per i «nessun dato» di Progressi, ma sulla Home una lente che non trova nulla sembra un errore: da decidere con chi tocca Progressi |
| Barra | 14, 45 | icone `home`, `esercizi`, `sfide` (lucide via `Icona`) | Tolta la pillola azzurra: come nei concept la voce attiva è blu e in grassetto, le altre grigio-blu, icone 27 px, nome 12,5 px, colonna alta ≥ 56 px. Nel concept l'icona attiva è piena; con le icone a tratto non si può: resta il colore + grassetto + `aria-current` |

## Props di `Menu` per `App.tsx` (tutte opzionali, nuove)
- `onStartExam?: () => void`: ▶ della carta Simulazione (in App: `() => setView('exam')`, come `avviaSimulazione`). Senza, la carta non ha il ▶.
- `onApriExtra?: (id: string, params?: Record<string, string>) => void`: stessa firma di `vaiExtra`. Usata per `'percorso'` («Tutte» Lezioni), `'simulazioni'` («Tutte» Simulazione) e `'simulazione-dettaglio'` con `{ id }` (tocco sull'ultimo risultato). Senza, i «Tutte» non compaiono.
- Già esistenti e usate: `onApriLezione(id)` per ogni riga (poi `onOpenTheoryTopic`, poi `onOpenTheory`), `onOpenDiagnostic`, `onStartSmart`, `onOpenImpostazioni`, `onNaviga`.
Nel `App.tsx` attuale `onStartExam` e `onApriExtra` **non sono ancora passati**: la Home funziona ma senza ▶ della simulazione e senza i due «Tutte». Da aggiungere: `onStartExam={() => setView('exam')}` e `onApriExtra={vaiExtra}`.

## Scelte da sapere
- **Quali lezioni**: le prime tre **non ancora imparate** nell'ordine del percorso (`lezioniPercorso`, lo stesso di «Percorso» e della sua «Continua»), non più l'argomento più debole (`lezioneConsigliata`, che resta in `stima.ts` ma la Home non lo usa più). Se sono tutte imparate: riga «Tutte imparate».
- Un'illustrazione fa lo stesso mestiere in più punti della Home solo dove il piano lo dice: `progressi-statistiche` è sia «andamento» (fascia media) sia la famiglia «confronti e quantità» (riga «Quantificatori»); con lo stato medio compaiono insieme.
- `arte.ts` (`arteArgomento(topicId)`) è riusabile da Percorso e LezioneDettaglio (stessa tabella delle famiglie): non l'ho collegato a quelle schermate (fuori perimetro).
- Il `Misuratore` e la sua anteprima di taratura (`?vista=misuratore`) sono invariati; `GraficoStime` ha ora il vuoto e senza l'icona nel titolo.
- Anteprima: `tests/anteprime/home.html?stato=nuovo|basso|medio|alto&sim=0|1&punti=1..5&tema=dark`; ho corretto lo stato «medio» (ora diagnostico 9/10 = 62 %; prima 8/10 dava la fascia bassa) e passa le tre nuove callback (registro in `window.__log`).

## Controlli eseguiti (numeri)
- `cd app && npx tsc --noEmit`: 0 errori. `npm test` dalla radice: 240 prove, 240 ok. `vite build` (in cartella temporanea): ok.
- `python3 tools/controlla-testo.py --base http://127.0.0.1:5261 --viste home` (chiaro e scuro, sull'App vera, utente nuovo): 0 blocchi sopra 5 parole.
- `tools/controlla-contrasto.py --pagina …/home.html?… --solo-pagina` a 400 px, chiaro e scuro, su 5 stati (basso+sim, medio+sim scuro, nuovo, alto+4 punti scuro, nuovo scuro): 0 violazioni, 0 errori in console.
- Screenshot letti a occhio (Chromium, Playwright): 400 px chiaro e scuro per nuovo, basso, medio, alto (con e senza simulazioni, 1-4 punti); 360×640 chiaro (medio) e scuro (nuovo); 1280×800 chiaro (medio, 3 punti) e scuro (basso). Nessuno scorrimento orizzontale (scrollWidth = clientWidth in tutti: 400, 360, 766 del riquadro a 1280). A 360×640 il ▶ Continua è visibile senza scorrere; il resto scorre dentro il riquadro.
- Click provati in Playwright: «Tutte» lezioni → `onApriExtra('percorso')`, «Tutte» simulazioni → `onApriExtra('simulazioni')`, ▶ simulazione → `onStartExam`, riga lezione → `onApriLezione('present-simple')`, Continua → `onStartSmart`, profilo → `onOpenImpostazioni`, ⓘ → foglio «Come viene calcolata la stima».
- `controlla-illustrazioni.py`: le illustrazioni della Home risultano «usata» (`quiz-test-lista`, `attenzione-rischio`, `simulazione-esame`, `progressi-statistiche-scheda` e le sette di famiglia).

## Non provato / limiti
- Home **dentro l'App vera** con ▶ e «Tutte»: non provata (mancano le due props in `App.tsx`); provata nell'anteprima. Navigazione fra le schermate extra non provata.
- Barra: provata solo nella Home; le altre schermate la usano (`Navigazione.tsx` è condiviso) e hanno ora il nuovo aspetto, ma non le ho riviste una per una.
- Altezze diverse da 640/800/860/1000 e larghezze tra 400 e 1280 non fotografate. Nessun test con tastiera/lettore di schermo oltre alle etichette `aria`.
- A 1280 px la Home resta nel riquadro da 768 px con colonna da 440 px (com'era): non l'ho allargata.
- Dispositivi reali e Safari non provati.

## File toccati
`app/src/components/Menu.tsx`, `Navigazione.tsx`, `home/{Stima,Lezione,GraficoStime}.tsx`, `home/Simulazione.tsx` (nuovo), `home/arte.ts` (nuovo), `home/NOTE.md`, `app/tests/anteprime/home.tsx`. `Layout.tsx` invariato. Nessun file da cancellare (le vecchie `SchedaLezione`/`ProssimoObiettivo` sono state sostituite dentro `Lezione.tsx`).
