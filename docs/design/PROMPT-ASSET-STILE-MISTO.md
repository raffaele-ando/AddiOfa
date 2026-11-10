# Prompt per gli asset nello stile misto (da generare con ChatGPT)

Scritto il 10/11/2026. Sostituisce, **solo per gli asset nuovi elencati qui**, il blocco di stile piatto di `docs/design/PROMPT-ASSET-CHATGPT.md`.
Decisione dell'autore (10/11/2026): lo stile voluto è simile a Phantom, Brilliant, Duolingo e Headspace (Phantom in particolare), con sfumature e bagliori ammessi. Le regole di prima (illustrazioni piatte, niente effetti) sono superate per i nuovi asset.

Regola di lettura: ciò che segue è diviso in **fatti verificati** (sezione 1, con fonte), **decisione dell'autore** (sezione 2: la miscela è una scelta, non una regola dei marchi) e **modifiche al progetto** (sezione 5). Dove una fonte manca c'è scritto «non verificato».

## 1. Cosa si prende da ciascun marchio

Solo l'idea di stile. Mai i colori (la palette è quella di AddiOFA; il viola resta solo per i livelli), mai personaggi, loghi o mascotte.

**Phantom** (fantasma, Wallet)
- Verificato: il simbolo è una sagoma piena, tutta curve, senza contorno né sfumature (fill `#AB9FF2`), con la coda ondulata. Fonte: https://phantom.com/_web_platform_assets/favicon.svg
- Verificato: il sito usa angoli molto arrotondati (pillole e cerchi) e gradienti lineari (esempio misurato: 157deg, opacità 65 %). Fonte: https://phantom.com
- Verificato: il rebrand parla di tono amichevole e di «colori complementari vivaci». Fonte: https://phantom.com/learn/blog/introducing-phantom-s-new-brand-identity . Lo studio parla di «sistema colore a gradienti multi-tono» e di illustrazioni 3D su misura. Fonte: https://bakkenbaeck.com/case/phantom
- **Non verificato**: bagliori, riflessi, direzione della luce e contorni delle illustrazioni 3D (le fonti non li descrivono e non ho visto le immagini). Il «bagliore alla Phantom» è quindi una scelta dell'autore, non un fatto dalle fonti. Linee guida ufficiali del marchio: non trovate (phantom.com/brand dà 404).

**Brilliant**
- Verificato (CSS e immagini ufficiali): card bianche con raggio 24 px e bordo 1 px, fondo caldo color avena, pulsanti con bordo inferiore pieno di 4 px, diagrammi puliti con 2-3 tinte. Fonte: https://brilliant.org e https://brilliant.org/_next/static/chunks/0-gupe3765p1h.css
- Verificato dalle immagini: gli elementi importanti hanno un alone morbido verde-menta a più anelli; solo la mascotte ha un gradiente interno. Fonte: immagini sotto https://brilliant.org/_next/static/media/ (misurate a pixel; valori approssimati). Geometria esatta e valori dell'alone: non verificati.
- Da non attribuire: la scheda di terzi «brilliant-org» di webdesignhot.com (fondo scuro, corallo) contraddice le fonti ufficiali ed è scartata.

**Duolingo**
- Verificato (linee guida ufficiali, istantanea archiviata del 2024): tutto è fatto con rettangolo arrotondato, cerchio e triangolo arrotondato; «Pointy shapes are off-brand»; circa 15 forme per illustrazione; ombra sempre a pillola, mai ovale. Fonte: https://web.archive.org/web/2024/https://design.duolingo.com/illustration
- Verificato sugli SVG ufficiali: riempimenti piatti senza contorno. Fonte: https://web.archive.org/web/2024id_/https://design.duolingo.com/fe225c25f1c6afe81424.svg
- Verificato per **assenza**: le linee guida non parlano di luce 3D, bagliori né sfumature di volume. Da Duolingo si prende quindi solo la costruzione (forme piene, arrotondate, poche, vivaci), non gli effetti. Valori esadecimali letti sull'istantanea del 2024, non confermati sul sito di oggi.

**Headspace**
- Verificato sugli SVG ufficiali: personaggi a tinta unita senza contorno (nessun attributo stroke), fondo a cerchio pieno con una seconda forma arrotondata che esce dal cerchio, volto minimale `#141313`. Fonte: https://static-2.headspace.com/7LgQ7zE5yihhzCv7O8Y7tS/acedfbf85e4c9274fb039d9743827955/Frame_370079.svg
- Verificato: gli SVG analizzati non hanno gradienti né ombre; il gradiente compare solo in Ebb (blob amichevole, riferimento alla lava lamp). Fonte: https://www.figma.com/blog/headspace-ebb-ai-companion/ . Colori esatti dei gradienti di Ebb: non verificati (misura da immagine compressa).
- Verificato: rebrand 2024 con volti che esprimono emozioni oltre il sorriso. Fonte: https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424 . Linee guida ufficiali (design.headspace.com): non raggiungibili, non verificate.

**Conflitti tra le fonti, da sapere**
- Duolingo, Headspace e il simbolo di Phantom sono piatti; bagliori e sfumature verificati sono solo di Brilliant (alone), Ebb (gradienti) e del sito Phantom (gradienti lineari). Lo stile misto quindi è una miscela voluta, non l'immagine di un solo marchio.
- Le icone nei cerchi: Brilliant e Headspace mostrano le icone **senza** contenitore; Duolingo non ha una regola. Il cerchio netto come nelle «storie in evidenza» di Instagram è una decisione dell'autore.

## 2. Lo stile misto di AddiOFA

Incolla questo blocco all'inizio di ogni prompt (sostituisce il blocco «flat» del vecchio file). Sono meno di 140 parole (contate: 138).

```
Polished modern product illustration, soft but crisp. Clean geometric rounded shapes, few of them, strong silhouette, precise like a diagram. Saturated fills with smooth soft gradients inside one hue family, a gentle luminous glow in light blue around the key object only, a soft highlight on rounded edges, one soft light from the top left, a soft diffuse shadow below. No outlines. Friendly, slightly organic, rounded forms. Palette strictly: #2563EB main blue, #1D4ED8 dark blue, #60A5FA light blue, #DBEAFE pale blue, #0E1B3F navy, #FFFFFF white, #D9DEE9 light grey, #4D5B78 slate. No purple, no other hues. Fully transparent background. A crisp, sharp-edged flat circle behind the subject is allowed only when the prompt asks for it. Never a cloud-like blob, soft bubble, glass sphere or rounded white tile behind the subject. No text, letters, numbers, logos, photos, real faces.
```

Cosa dice il blocco, in italiano:
- **Cerchio di sfondo**: ammesso solo un cerchio netto (bordo pulito, tinta unita o sfumatura leggera) e solo se il prompt lo chiede; mai nuvoletta, bolla, sfera di vetro o riquadro bianco arrotondato.
- **Contorni**: nessuno. È coerente con quanto verificato su Phantom (simbolo), Duolingo e Headspace (SVG ufficiali); Brilliant ha solo un bordo di 1 px sulle card dell'interfaccia, non sulle illustrazioni.
- **Luce**: una sola sorgente morbida dall'alto a sinistra, riflesso leggero sui bordi, ombra diffusa sotto; il bagliore azzurro solo attorno all'oggetto principale, non su tutto.
- **Sfondo**: trasparente (PNG). Le reference di schermata hanno invece un fondo pieno, dichiarato nel prompt.

**Variante per il tema scuro** (da aggiungere in coda al prompt quando serve):

```
Dark-theme version of the same subject, designed to sit on #0A101F. Replace navy parts with #60A5FA and #DBEAFE, keep #2563EB as the main body, make the glow slightly stronger. Same composition, same transparent background.
```

Dopo la generazione va **guardata su `#0A101F` e su `#F7F9FD`**: il bagliore non deve sporcare il fondo chiaro.

## 3. Prompt per gli asset

Ogni prompt va incollato con il blocco della sezione 2 al posto di `[blocco di stile]`. Un asset per volta, nome file = id.

### 3.1 Hero della landing

**`hero-scena`** — 2:1 (1952×976 px). Variante scura: `hero-scena-scuro`. Composizione di partenza: `grafica/fonti/ai-nuove/ref-hero-a.webp` (a sinistra un terzo vuoto per il testo).

```
[blocco di stile]
Wide 2:1 scene. A young student seen from behind, with a backpack, climbing a wide staircase
of three or four steps towards a tall arched doorway; inside the doorway a large five-point
star with rounded tips, softly glowing. The doorway is set in a simple straight-edged wall in
#60A5FA with a #DBEAFE inner reveal around the opening, the door frame in #2563EB; no panels
or tiles behind the scene. The figure is a simple rounded silhouette,
no face visible. Keep the left third calm and empty. Transparent background.
```

Variante scura: aggiungi la «variante per il tema scuro» e `Dark-theme version`.

### 3.2 Dieci emblemi di badge

Formato 1:1 (1024×1024, poi ridotto), un solo oggetto centrato, stessa dimensione ottica per tutti. Varianti scure solo se l'emblema sparisce su `#0A101F`: controllare prima.

Modello:

```
[blocco di stile]
Square 1:1 badge emblem, one subject only, centred, same optical size as the others:
<soggetto>. Behind it a crisp sharp-edged flat circle in #DBEAFE, no rim, no outline.
```

(Il cerchio dietro è l'unica variante ammessa dal blocco, e senza bordo perché il blocco dice «No outlines»: si può togliere la riga se si preferisce l'icona libera, come mostrano Brilliant e Headspace.)

| id | Soggetto da inserire |
|---|---|
| `badge-studio` | an open book with a soft bookmark ribbon and a bold checkmark on the page |
| `badge-simulazioni` | a folder with a small stopwatch in front of it, the stopwatch face has only two plain hands, no numerals |
| `badge-costanza` | a calendar page with a row of small squares, most of them ticked, no numerals or letters, plain marks only |
| `badge-livello` | three steps of a staircase rising from left to right, in three blue tints |
| `badge-memoria-10` | an archive box with a small clock on its front, the clock face has only two plain hands, no numerals |
| `badge-accuratezza-80` | a target with a bullseye and an arrow stuck in it |
| `badge-ore-5` | an hourglass with sand mostly in the lower half |
| `badge-prima-simulazione` | a small flag planted on top of a folder |
| `badge-simulazione-superata` | a rosette ribbon with a bold checkmark in the centre |
| `badge-simulazioni-superate-3` | three cards stacked with a slight offset, each with a small checkmark |

Niente numeri nei disegni («80 %», «5», «3»): il numero lo scrive l'app. Per `badge-simulazioni-superate-3` la quantità si vede dagli oggetti (tre schede), non dalle cifre. `badge-ore-5` non mostra nessuna quantità di ore: la clessidra è solo il simbolo del tempo e il numero lo scrive l'app.

### 3.3 Stati

Formato 4:3 (1200×900), un'illustrazione per stato, niente cerchio di sfondo salvo dove indicato.

**`stato-vuoto`**

```
[blocco di stile]
Empty state: an open, empty tray or box seen slightly from above, lid flaps rounded, a single
small star floating just above it with a gentle glow. Calm, inviting. 4:3.
```

**`stato-successo`**

```
[blocco di stile]
Success state: a large rounded checkmark badge on a crisp sharp-edged circle in #2563EB,
with a soft glow, and three small round dots in #60A5FA placed evenly around it (no sparkles, no confetti, no figures). 4:3.
```

**`stato-errore`**

```
[blocco di stile]
Error state: one single object, a slightly tilted rounded-square sign in #DBEAFE (it is the
subject itself, not a tile or background behind something), carrying a bold warning mark in
#2563EB built only from a rounded vertical bar and a round dot, no font glyph, no text, a soft
shadow below. Gentle, not alarming, no red. 4:3.
```

**`stato-ricerca-vuota`**

```
[blocco di stile]
No-results state: a magnifying glass over a flat empty page with a few soft grey lines,
the lens slightly glowing in light blue, one short rounded horizontal dash inside the lens
(a shape, not a character). 4:3.
```

Per tutti e quattro, variante scura con la riga della sezione 2.

### 3.4 Tre schermate di riferimento (layout, non vanno nell'app)

Servono a far vedere la disposizione, che poi si ricostruisce nel codice con i token. **Niente testo leggibile**: barre grigie al posto delle parole. Fondo pieno `#F7F9FD` (chiaro) o `#0A101F` (scuro). Dimensione 390×844, senza cornice del telefono.

Per queste tre schermate, dove il blocco di stile dice altro, valgono le eccezioni scritte nella riga «Exception» di ogni prompt: decadono «No outlines» (ammessi bordi sottili di 1 px su righe, card e casella), «Fully transparent background» (il fondo è pieno) e «Never ... rounded white tile» (card e righe sono riquadri arrotondati, perché sono interfaccia e non un'illustrazione). Restano valide tutte le altre clausole: palette, niente testo, niente viola.

**`screen-home`**

```
[blocco di stile]
Exception for this UI mockup only: the style block's "No outlines", "Fully transparent background" and "rounded tile" rules do not apply; thin 1 px borders, rounded cards and a solid background are allowed. Everything else in the block still applies.
Mobile app screen mockup, no device frame, background #F7F9FD (not transparent). At the top a
small greeting bar made of grey bars and a semicircular gauge in #2563EB. Below: ONE large
card at full width in #2563EB with a soft light gradient and a play icon, two grey placeholder
bars on it (the dominant action). Then three compact rows with a thin #D9DEE9 border, small
icons, each clearly shorter than the dominant card. Grey bars instead of any text.
```

**`screen-consenso`**

```
[blocco di stile]
Exception for this UI mockup only: the style block's "No outlines", "Fully transparent background" and "rounded tile" rules do not apply; thin 1 px borders, rounded cards and a solid background are allowed. Everything else in the block still applies.
Mobile app screen mockup, no device frame, background #F7F9FD (not transparent). A title bar
and a short paragraph shown as grey bars. ONE single large checkbox row, unchecked,
border #2563EB, with two grey bars next to the box. A full-width primary button in #2563EB
below, with a soft highlight. No second checkbox, no optional toggles. Grey bars instead of text.
```

**`screen-stato-vuoto`**

```
[blocco di stile]
Exception for this UI mockup only: the style block's "No outlines", "Fully transparent background" and "rounded tile" rules do not apply; thin 1 px borders, rounded cards and a solid background are allowed. Everything else in the block still applies.
Mobile app screen mockup, no device frame, background #F7F9FD (not transparent). A top bar,
then centred: one illustration of an empty open tray with a small glowing star above it, a
title bar and a two-line grey paragraph, and one primary button in #2563EB. Grey bars
instead of text.
```

## 4. Come usarli

1. **Reference reale del marchio**: allegare a ChatGPT uno screenshot reale dell'app o del sito del marchio (per esempio la home di Phantom per bagliori e sfumature, una lezione di Brilliant per i diagrammi puliti) rende meglio della sola descrizione. Lo screenshot serve per lo **stile**, non per il contenuto: scrivere nel messaggio «use only the lighting and shape language, do not copy any character, logo, text or colour».
2. **Mai i vecchi riferimenti piatti insieme ai nuovi.** Niente `kit-blu`, niente `app/src/brand/essenziali/disegni/*`, niente `kit-blu.png`, niente schede lucide vecchie (`zip2-*`, `ref-badge-*`). Allegare insieme un riferimento piatto e uno con bagliori fa uscire un risultato incerto. Eccezione ragionata per l'hero: la composizione è in `ref-hero-a.webp` (piatto): si può allegare **da solo**, con la frase «same composition, restyle with the style block», se la composizione non viene al primo tentativo.
3. **Un'immagine per volta**, nella stessa chat finché lo stile tiene; se cambia, aprire una chat nuova e rincollare il blocco.
4. **Nome file = id** (`hero-scena.png`, `badge-studio.png`, `stato-vuoto.png`, `screen-home.png`…). PNG con sfondo trasparente per hero, badge e stati; fondo pieno per le schermate. Salvare in `grafica/fonti/ai-nuove/<id>.png`.
5. **Controllo prima di accettare**: nessun testo o numero, nessun volto riconoscibile, nessun palazzo o stemma del Politecnico, nessun viola, nessuna bolla/sfera/riquadro dietro; poi su `#F7F9FD` e su `#0A101F`. Se manca una di queste cose si rigenera, non si corregge a mano.
6. Le reference di marchio non si salvano nel repository: sono materiale di terzi, solo per la sessione di generazione.

## 5. Regole del progetto da cambiare prima di usare questi asset

Elenco onesto: **nessuna di queste modifiche è stata fatta**; questo file è l'unico modificato.

1. **`tools/sincronizza-essenziali.sh` appiattisce tutto.** Le due chiamate a `tools/appiattisci-illustrazioni.py` (su `disegni` e su `glifi`) tolgono gradienti, filtri, aloni e riflessi: applicate ai nuovi asset li riporterebbero allo stile vecchio. I nuovi asset vanno in una cartella a parte (proposta: `app/src/brand/essenziali/stile-misto/`, copiata da `grafica/brand/stile-misto/`) e il passo di appiattimento va **saltato** per quella cartella. Da decidere: una riga `cp` dedicata nello script, mai dentro `disegni/` o `glifi/`.
2. **`tools/ricolora-illustrazioni.py` ricolora tutto** (SVG e raster `hero/scena-*`, con operazioni OKLCH). Per i nuovi asset va escluso, perché i colori sono già quelli di AddiOFA e il ricolorare altererebbe sfumature e bagliori. Da fare: escludere la cartella nuova, e dire nel commento in testa che `hero/scena-*` verranno sostituite o tolte.
3. **Formato.** L'app oggi spedisce SVG (illustrazioni, glifi) e `webp` per l'hero. Immagini con sfumature e bagliori non si vettorializzano bene: i nuovi asset vanno spediti come `webp` con trasparenza (o PNG ottimizzato), non come SVG. Questo contrasta con la regola «niente `<text>` negli SVG generati» solo in apparenza (non c'è testo), ma cambia il metodo di `.claude/skills/ricreare-grafica` (pensato per ricostruire in vettoriale): per questi asset la skill va annotata come «non si applica, si spedisce il raster». Dimensione: da misurare, non assunta.
4. **`docs/design/RICERCA-AI-LOOK.md`** va annotata (non cancellata): in testa una riga «Superata per i nuovi asset dalla decisione del 10/11/2026 (`PROMPT-ASSET-STILE-MISTO.md`)». In particolare:
   - la riga di piano 8.1 («una sola famiglia, piatta, senza sfumature né riflessi») e 8.2 («eliminare gli aloni radiali decorativi»; «gradienti in `oklch`») non valgono per i nuovi asset;
   - il punto «Il glow come decorazione» della sezione 7 («Cosa non copiare») viene ribaltato dalla decisione, ma il rischio che la ricerca descrive resta vero: bagliori e sfumature su tutto fanno «aspetto IA». Il blocco di stile lo limita (bagliore solo sull'oggetto principale), ma va controllato a occhio;
   - la tabella dell'audit (righe «Illustrazioni piatte, stile unico», «Niente effetti decorativi») va marcata come non più un obiettivo per i nuovi asset.
5. **`docs/design/PROMPT-ASSET-CHATGPT.md`**: la sezione 0 e il blocco 1 chiedono piatto e «no circle or frame behind the subject». Per gli asset di questo file valgono i nuovi; in testa va una riga che rimanda qui, così non si mescolano i due blocchi. La riga «se arriva con sfumature… la rifiuto» (sezione 3) è da invertire per questi asset.
6. **`docs/design/ILLUSTRAZIONI.md`** dice «`kit-blu`: piatte… È lo stile dell'app» e vieta di mettere `kit-luminoso` accanto alle piatte nella stessa riga. Va aggiunta la regola di convivenza: gli asset nuovi **non si mescolano nella stessa schermata** con i `kit-blu` piatti finché i vecchi non sono sostituiti (altrimenti due stili sulla stessa pagina: il difetto che la ricerca segnalava come «assenza di un punto di vista»).
7. **`tools/controlla-illustrazioni.py`** misura «aloni bianchi» e ritagli ai bordi: i bagliori azzurri dei nuovi asset possono essere segnalati. Il controllo va applicato con soglia diversa o non applicato a quella cartella (da provare, non assunto).
8. **`CLAUDE.md`**: la sezione «Cose che non si fanno» vieta le animazioni decorative, ma non dice nulla di stile piatto, quindi non va cambiata per questo. Va però aggiunta una riga che dice che per gli asset nuovi lo stile è quello di `PROMPT-ASSET-STILE-MISTO.md` (bagliori e sfumature ammessi nell'immagine), mentre l'**interfaccia** resta statica: il bagliore è dentro l'immagine, non un effetto CSS animato.
9. **Tema scuro e contrasto.** I bagliori vanno provati su `#0A101F` e su `#F7F9FD` (regola di CLAUDE.md: Chromium a 400 e 1280 px, chiaro e scuro). Se il bagliore sporca il chiaro, serve la coppia di file chiaro/scuro come per l'hero attuale (`scena-chiara.webp`, `scena-scura.webp`), con scelta nel componente.
10. **Tavole precedenti** (`grafica/fonti/ai-nuove/zip2-*`, nota di `NOTE.md`): sono già segnate come «non tutto usabile» (volti, Politecnico, numeri). Restano non usabili anche con la nuova decisione: i vincoli su volti, testi, numeri, Politecnico e statistiche inventate non cambiano.
