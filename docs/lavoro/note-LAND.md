# Note LAND: landing rifatta (mobile e desktop)

## Cosa ho fatto
- `app/src/screens/Landing.tsx` ora compone le sezioni in `app/src/screens/landing/`: `Barra` (logo, ancore Come funziona / Cosa ottieni / Prezzo / Domande solo da 1024 px, pulsante sempre), `Hero` (due colonne da 1024 px, pila sul telefono) con `Telefono` (home disegnata in HTML/CSS con l'`Indicatore` vero e un valore di esempio dichiarato tale: etichetta "Esempio" e didascalia "Schermata di esempio con dati di prova"), `Vantaggi` (4 vantaggi), `Passi` (4 passi con linea di collegamento, verticale sul telefono e orizzontale da 1024 px), `SeNonSuperi` (fatti di `OFA_*`, soglie di `FORMATS`, scadenze), `Offerta` (gratis e Pass con `PASS`, `FREE_FEATURES`, `currentPriceEur()`, `isLaunchPrice()`), `Faq` (accordion con `aria-expanded`, `aria-controls`, regione e `inert` a riga chiusa), `CtaFinale`, poi `Footer` esistente. `comune.tsx` ha i pezzi condivisi (ingresso, pulsanti, titoli).
- Colori solo coi token `azione` (nessun rosso). Illustrazioni `kit-blu`: `quiz-test`, `progressi-statistiche`, `superamento`. Nessuna risorsa esterna, niente emoji.
- Animazioni con `motion`: ingresso in sequenza dell'hero, ingresso all'ingresso nello schermo delle sezioni, telefono e pillole che galleggiano. Con `prefers-reduced-motion` tutto è fermo e già al suo posto (verificato: 0 elementi animati nel telefono).
- Disclaimer di non affiliazione: sotto i pulsanti dell'hero (visibile subito) e nel footer; anche nella risposta della FAQ.
- Anteprima: `app/tests/anteprime/landing.html` + `landing.tsx` (`?tema=dark`, `?pass=0`).

## Scelte da sapere
- La landing è un livello `fixed inset-0` con il suo scorrimento: il `Layout` dell'app la chiuderebbe in 768 x 800 px e non permetterebbe due colonne. Copre il banner della demo, quindi in demo (`VITE_MODE=demo`) mostra lei la stessa riga di avviso. Se App.tsx la metterà fuori dal `Layout`, funziona uguale.
- Prop in più, facoltativa: `onOpenPass?(): void`. Le tre prop richieste sono invariate. Il pulsante "Entra in lista d'attesa" (con `PAYMENTS_ENABLED` falso; "Prendi il Pass" se vero) compare nella card del Pass solo se la prop c'è, perché senza non saprebbe dove portare. Senza, restano il testo sulla lista d'attesa e il diagnostico.
- Il tema scuro si legge dalla classe `dark` su `<html>` con un osservatore (per le illustrazioni a fondo scuro).
- Testi con affermazioni solo vere: niente numeri di utenti, percentuali, testimonianze, "ufficiale", garanzia, timer. La lista d'attesa "non blocca il prezzo" (dai Termini). Recesso di 14 giorni con rimando alla pagina legale.
- Non copiati dai concept: foto con il Politecnico, 82 %, avatar, badge negli store, "Scarica l'app" (qui è "Fai il diagnostico"), video, "Storie", piano personalizzato.

## Richieste ad altri (App.tsx)
- Passare a `Landing` la prop `onOpenPass` (apre il Paywall o la lista d'attesa).
- Facoltativo: renderizzare `Landing` fuori da `Layout` (ora la copre con `fixed`).

## Verifica
`npx tsc --noEmit` pulito, `npm run build:demo` superato. Chromium: 400, 768, 1024 e 1280 px, chiaro e scuro, scorrimento orizzontale 0, zero errori in console (il solo avviso di motion con "riduci movimento" attivo è del modo sviluppo). Provati: ancore (portano alla sezione e spostano il focus sul titolo), accordion con mouse, Invio e Spazio, tutte le callback (`onStartDiagnostic`, `onSkip`, `onOpenLegal`, `onOpenPass`), anello di focus blu visibile (chiaro `#2563EB`, scuro `#60A5FA`), un solo h1 e h2 in ordine, landing dentro l'app vera (`/`, clic su "Fai il diagnostico" porta all'onboarding).
Non provato: Safari e Firefox, lettore di schermo, schermi sotto i 360 px, tema che cambia mentre la pagina è aperta (l'osservatore c'è ma non l'ho esercitato).

## Cosa non mi convince
- Nel telefono il valore 62 % è di esempio: se si preferisce nessun numero, si può sostituire con uno stato "nuovo" senza percentuale.
- Le illustrazioni sono solo nelle due card dell'offerta e nel banner finale; altrove icone `lucide-react`.
