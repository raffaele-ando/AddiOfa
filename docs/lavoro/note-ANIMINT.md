# Note ANIMINT: le animazioni inserite nell'app

Cartelle mie: `app/src/brand/IllustrazioneAnimata.tsx` (ritocchi), i file di schermata elencati sotto. Nessun git, nessun `rm`.

## Dove sono finite
| Schermata | File | Animazione |
|---|---|---|
| Grazie dopo il pagamento | `components/PaymentThanks.tsx` | celebrazione 170 |
| Progressi (testata, con e senza Pass) | `components/StatsMode.tsx` | progressi-statistiche 84 |
| Onboarding | `components/Onboarding.tsx` (`Scena`) | animata se il nome è tra gli 11 (studio-inglese, superamento, quiz-test), altrimenti `Illustrazione` statica |
| Fine sessione di allenamento | `components/esito/FineSessione.tsx` | successo 104 |
| Scelta formato simulazione | `components/ExamMode.tsx` | quiz-test 110 |
| Caricamento "Preparo le domande" e "Consegno e correggo" | `LearnMode.tsx`, `ExamMode.tsx` | attesa-caricamento 110 al posto dello spinner da 32 e 36 px |
| Lista d'attesa riuscita | `screens/Waitlist.tsx` | successo 160 |
| Landing: Offerta (2) e CtaFinale | `screens/landing/*` | quiz-test, progressi-statistiche (84), superamento (170), con `quandoVisibile` |
| Esito simulazione (nuovo) | `components/esito/EsitoSimulazione.tsx` | in cima al riquadro del risultato: successo se superata, mancato-superamento se no, 120; è un pulsante «Rivedi l'animazione» (Invio e Spazio) |
| Paywall (nuovo) | `screens/Paywall.tsx` | piano-studi-bloccato 130, centrato sopra il titolo (non se c'è già il Pass) |
| Lezioni (nuovo) | `screens/Lezioni.tsx` | studio-inglese 110 a destra del titolo |
Non fatti: spinner piccoli (16 e 18 px) lasciati; `suggerimenti-consigli` non inserita (in `CorrezioniComplete` "Studia la regola" è un pulsante ripetuto per ogni domanda, in `FineSessione` è dentro "Da riprendere": nessuno spazio naturale); `risultato-probabilita` non richiesta.

## Cambiamenti al componente
- `quandoVisibile`: IntersectionObserver (50%); finché non compare ha `opacity: 0`, poi parte (senza, lo stato finale lampeggia e riparte). Usato nella landing.
- `eAnimata(nome)` e `NOMI_ANIMATI`.
- Glob `?raw` ristretto alle 11 illustrazioni x 2 temi. Peso `artifact.html`: 2.106.861 byte prima, 2.205.995 dopo (+97 KB, sotto i 3 MB). I due temi sono byte per byte identici, quindi se un domani restano uguali si può includere solo il chiaro (-40 KB circa).
- Bug trovato in prova: React 19 riscrive `innerHTML` a ogni render se l'oggetto `dangerouslySetInnerHTML` è nuovo, e l'animazione ripartiva a ogni render del genitore (nella scelta formato dopo circa 3 s, quando arrivava lo stato dell'accesso). Ora l'oggetto è memorizzato.
- Accessibilità: `role="img"` e `aria-label` sul wrapper solo se c'è `alt`, SVG sempre `aria-hidden`.

## Prove (Chromium, build:demo, 390x858 chiaro e scuro, 1280x800 chiaro e scuro dove indicato)
- `npx tsc --noEmit` pulito; `npm test` 99/99; `npm run build:demo` e `npm run check` passano.
- `home/static3.py` (scratchpad) riscritto: confronta due screenshot subito (0,5 s) e dopo 3 s. Subito si muovono solo pixel dentro i riquadri `.anim` (più 8 px di margine); dopo 3 s zero pixel mossi ovunque. Unica eccezione, fuori dalle illustrazioni: il timer dell'esame (110-130 px). A 1280 su Lezioni 11 px in alto a (996,1) fuori dalle illustrazioni, nel bordo alto della cornice, non dell'illustrazione.
- Fotogrammi deterministici (animazione portata a 0, 400, 900, 1800, 2600 ms): scarto medio tra fotogrammi successivi diverso da zero fino a 1800 e zero tra 1800 e 2600 (paywall 0,09 e Lezioni 0: finiscono in ~1,95 s): esito superata, esito non superata, paywall, Lezioni, Progressi, scelta formato, in chiaro e scuro. Sequenze guardate a occhio: coppa che cala poi stella e raggi, calendario poi lucchetto, libri poi bandiera, barre una dopo l'altra, documento con croce.
- Landing in fondo, fotogrammi reali (50, 450, 900, 1500, 2600 ms) dopo aver fatto scorrere: parte quando compare, 3 su 3 (a 1280 anche la CtaFinale); prima del tocco sono a opacity 0.
- Fine sessione e Waitlist: stato finale corretto, partenza reale.
- Movimento ridotto (Chromium `reduced_motion=reduce`): zero animazioni in corso, classe `in` presente, stato finale.
- Rivedi: Invio e Spazio sul pulsante fanno ripartire 16 animazioni; dopo 3 s l'immagine è quella di prima salvo l'anello di focus.
- Console: zero errori e zero avvisi in tutti i flussi; overflow orizzontale 0 ovunque.

## Cosa non convince / non provato
- Schermate di caricamento: nella demo il caricamento dura qualche millisecondo, quindi la clessidra non si vede mai in pagina. Il componente è provato altrove, la composizione a 110 px nella `Screen` centrata non l'ho vista. Per un'attesa lunga la clessidra si ferma dopo 2,15 s: può sembrare congelata (lo spinner girava senza fine).
- Esito: la coppa a 120 px aggiunge circa 120 px di altezza sopra il misuratore; il numero è ancora sopra la piega a 858 px, ma a occhio, non misurato sui telefoni bassi, spinge in basso le tessere.
- Paywall: la scena occupa circa 100 px prima del titolo; su schermi bassi il prezzo scende sotto la piega.
- Onboarding: nel flusso provato i passi 2 e 3 non hanno illustrazioni animate (le scene `verifica-utente` e `rischio-economico` del file restano statiche).
- Non provato in Safari e Firefox; Onboarding provato solo fino al quarto passo del flusso del diagnostico (non il passo "superamento").
