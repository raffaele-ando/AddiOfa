# Perché un'interfaccia sembra fatta con l'IA, e come lo fanno le app di successo

Ricerca del 7/11 su 82 fonti online (blog di design, documentazione di design system, team di design di aziende, W3C, NN/g, studi sulla percezione). Il confronto con AddiOFA è fatto leggendo il codice e le schermate, non a occhio. Il rapporto non modifica il codice.

## 1. La risposta breve

Il segnale non è il blu, né un gradiente preciso. È l'**assenza di un punto di vista**: ogni elemento è gradevole da solo, ma gli elementi non sono coordinati tra loro. Le fonti convergono su quattro meccanismi:

1. **Incoerenza tra i componenti.** Ogni pezzo è scritto in modo locale e senza memoria delle scelte precedenti. Risultato: raggi diversi, ombre che implicano luci diverse, pulsanti alti 44 px accanto a controlli alti 32 px, icone di stili diversi nella stessa barra. Il rimedio indicato è trattare raggio, ombra, colore e spaziatura come token, con un solo carattere per ciascuno. Fonte: https://dev.to/kiwibreaksme/why-ai-generated-uis-look-off-and-the-one-principle-that-fixes-it-4j20
2. **Effetti decorativi su tutto.** Gradienti, bagliori colorati (glow), vetro e bordi luminosi usati come decorazione, non per informare. Le fonti dicono che il problema è il budget: cinque o sei colori accesi in competizione, barre colorate su ogni card, pallini di stato ovunque. Fonte: https://924b8765.impeccable-2rv.pages.dev/slop (fonte anonima, opinione informata, non dato misurato)
3. **Gerarchia piatta e ritmo uniforme.** Le stesse card, la stessa spaziatura, scale tipografiche con passi troppo vicini (la regola citata è almeno 1,25 tra un passo e il successivo). Le fonti descrivono il layout tipico: hero centrato, tre card con icona identiche, etichetta sopra il titolo, numeri 01/02/03. Fonte: https://www.925studios.co/blog/ai-slop-design-tells
4. **Convergenza verso la media.** Il modello restituisce le scelte «sicure che non offendono nessuno», perché sono le più frequenti nei dati di addestramento. Questo spiega perché i risultati sembrano tutti uguali. Fonte: https://superdesign.dev/blog/why-ai-design-looks-generic

Una nota sulle ipotesi che circolano: la storia dell'indaco di Tailwind come causa del viola (lo stesso Wathan si è scusato nel 2025 per aver reso indaco il colore di tutti i pulsanti di Tailwind UI) è una tesi di blog, non dimostrata. Non la uso come spiegazione.

## 2. Il meccanismo percettivo (perché gradienti e colori sembrano sporchi)

- **Interpolazione in sRGB.** Un gradiente tra blu e giallo in sRGB passa per un grigio fangoso, perché il punto medio è la media dei canali. Il rimedio è interpolare in uno spazio percettivo: `linear-gradient(in oklab, …)` o `in oklch`. Fonti: https://bottosson.github.io/posts/oklab/ e https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient
- **Helmholtz-Kohlrausch.** A pari luminanza un colore molto saturo appare più luminoso. Per questo i rossi e i rosa su fondo scuro «bruciano».
- **Contrasto simultaneo e vibrazione.** Due colori saturi accostati alla stessa luminosità vibrano. Le fonti citano anche la cromostereopsi: rosso e blu a pari distanza sembrano a profondità diverse.
- **Su fondo scuro i colori saturi avanzano**, e il neon affatica la vista. Fonte: https://www.nngroup.com/articles/dark-mode/

## 3. Dark mode: le regole dei sistemi maturi

Fonti principali: https://m2.material.io/design/color/dark-theme , https://developer-mdn.apple.com/design/human-interface-guidelines/foundations/dark-mode , https://linear.app/blog/how-we-redesigned-the-linear-ui , https://material.io/blog/tone-based-surface-color-m3

- Niente nero puro: grigi scuri tinti. Figma usa circa #1E1E1E, YouTube #181818.
- **L'elevazione si ottiene con superfici più chiare, non con ombre**: le ombre nere su fondo scuro si vedono poco. Material 3 usa ruoli di superficie a tono (container low, container, high, highest).
- Testo non bianco puro: grigio chiaro o off-white, gerarchia per opacità.
- Colori semantici e token, non valori fissi: il tema scuro è una variante dello stesso sistema.
- **Il glow è controverso**: alcune fonti lo condannano come «genere» (https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c); altre lo propongono come sostituto delle ombre. Linear dichiara che la dark mode non è primaria.
- Contrasto: 4,5:1 per il testo normale, 3:1 per il grande e per i componenti (WCAG 2.2, https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## 4. Cosa fanno le app di successo

- **Duolingo.** Un solo colore d'azione dominante (il verde), uno stile di illustrazione minimale e riconoscibile, circa 15 forme per illustrazione, personaggi piatti con profondità solo lungo una linea, niente grigi nelle illustrazioni. Fonti: https://design.duolingo.com/illustration , https://design.duolingo.com/identity/color , https://blog.duolingo.com/shape-language-duolingos-art-style/
- **Linear.** Tema generato da tre valori (colore base, accento, contrasto), spazio colore LCH per avere luminosità percettive uniformi, poco rumore visivo. Fonte: https://linear.app/blog/how-we-redesigned-the-linear-ui
- **Apple.** Colori semantici che cambiano con il tema, due livelli di sfondo (base ed elevato), icone con forma fissa su tutte le piattaforme. Fonte: https://developer.apple.com/design/human-interface-guidelines/app-icons.md
- **Material 3.** Colori chiave, palette tonali, ruoli mappati; Material Symbols usato quasi senza modifiche per coerenza. Fonti: https://m3.material.io (citato da snippet), https://developer.android.com/codelabs/m3-design-theming
- **Stripe, Revolut, Monzo, Notion, Headspace, Calm.** I gradienti di Stripe sono usati con parsimonia; Revolut e Monzo riducono gli elementi decorativi. Le fonti su questi marchi sono pagine di terzi, quindi le uso solo come conferma.

Regole comuni: un solo colore d'azione, colori decorativi pochi e con un ruolo, uno stile per tutte le illustrazioni (stesso tratto, stessa luce, stessa saturazione), una sola direzione della luce per le ombre, icone dello stesso stile nella stessa barra.

## 5. Illustrazioni e icone

- Le illustrazioni generate con 3D IA hanno spesso la luce «cotta» nella texture, e il look glossy, sovrasaturo e simmetrico è indicato come default delle generazioni IA. Fonte: https://gamedeveloper.com/art/how-devs-can-spot-ai-generated-3d-models
- La critica al 3D gonfiato non riguarda solo il 3D: riguarda l'incoerenza di stile. Il 3D più sottile e tattile di oggi è meno criticato. Fonte: https://kompozy.io/guides/the-ai-aesthetic-design-language
- Le guide per illustrazioni fissano spessore del tratto, dimensioni, spaziature e luce. Fonte: https://www.pixelmatters.com/blog/keep-your-brand-consistent-with-an-illustration-style-guide
- Icone: un solo stile per superficie (non piene e a contorno nella stessa barra), griglia a 8/16/32, keyline. Fonti: https://cieden.com/book/sub-atomic/iconography/icon-grids-and-keylines

## 6. Dove stiamo noi (verificato nel codice, 7/11)

| Regola | Stato | Dato |
|---|---|---|
| Niente nero puro, niente bianco puro nel tema scuro | rispettata | token in `index.css` |
| Niente palette Tailwind di default, niente emoji | rispettata | verificato |
| Elevazione con superfici chiare, non con ombre (scuro) | in parte | 39 `shadow-none` nel tema scuro |
| Contrasto testo ≥ 4,5:1 | rispettata | 10 coppie controllate |
| Un solo colore d'azione | rispettata | blu |
| **Illustrazioni piatte, stile unico** | **non rispettata** | 200 SVG su 214 con gradienti (2.447 definizioni), 164 con sfocatura o filtri, sfere con riflesso e alone |
| **Niente effetti decorativi** | **non rispettata** | gradienti radiali nella landing (6 occorrenze, aloni), 6 ombre colorate nei componenti, `radial-gradient` in `index.css` |
| **Gradienti in spazio percettivo** | **non rispettata** | 0 gradienti con `in oklab` o `in oklch`: quelli esistenti interpolano in sRGB |
| **Gerarchia tipografica** | **non rispettata** | 612 dimensioni di font in pixel scritte a mano, passi fra 12 e 18 px |
| **Un solo sistema di raggi** | in parte | 10 classi di raggio diverse |
| **Colori con un ruolo** | in parte | barre viola «Per livello» in `PanoramicaProgressi.tsx`, colore decorativo contro la regola del nostro `index.css` |
| Layout non uniforme | in parte | molte card identiche (Home, Profilo, Community) |

Lettura onesta: il blu e il gradiente del tema scuro non sono il problema. Il problema è che abbiamo **due sistemi di decorazione (illustrazioni a gradiente e aloni) che non seguono le regole che ci siamo scritti**, e una gerarchia tipografica piatta. Le illustrazioni sono il punto più visibile: sono proprio il tratto che le fonti indicano come «IA».

## 7. Cosa non copiare

- Il contenuto dei concept (numeri, testimonianze, prezzi), come già deciso.
- Il look glossy e sovrasaturo delle icone.
- Il viola indaco come colore di default.
- Il glow come decorazione.

## 8. Piano di correzione (in ordine di impatto, da approvare)

1. **Illustrazioni**: una sola famiglia, piatta, con un tratto e una luce comuni, senza sfumature né riflessi. Le sfere restano escluse (decisione dell'autore). Le illustrazioni vanno ridotte a poche, nelle testate e negli stati, non in ogni card.
2. **Gradienti e aloni**: eliminare gli aloni radiali decorativi; se un gradiente resta, dichiarare lo spazio `in oklch`.
3. **Tipografia**: sostituire i 612 valori in pixel con una scala di 5-6 passi, con rapporto almeno 1,25, come token.
4. **Raggi**: ridurre a due valori (per card e per controlli).
5. **Colore con un ruolo**: togliere il viola decorativo dalle barre «Per livello»; ogni colore semantico deve significare qualcosa.
6. **Layout**: differenziare le card della Home per importanza (una dominante, le altre secondarie), invece di tre card identiche.

## 9. Limiti della ricerca

- Le fonti sono quasi tutte blog, opinioni e documentazione di design system. Nessuna fonte misura che questi segni vengano letti come «IA» dalle persone.
- Le illustrazioni sono valutate dal codice SVG, non viste renderizzate.
- La parte su Material 3 e su alcuni marchi (Stripe, Revolut, Monzo) viene da snippet o da pagine di terzi: la uso come conferma, non come prova.
- Lo studio di psicologia citato (fluidità di elaborazione, Reber e altri, 2004) è stato letto come abstract: il collegamento con l'IA è un'inferenza mia.
