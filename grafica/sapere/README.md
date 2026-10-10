# Sapere: come è stato ricreato il brand di AddiOFA

Questa cartella raccoglie **tutto quello che è stato imparato** rifacendo logo, illustrazioni, icone
e schermate di AddiOFA a partire da immagini generate con l'AI: il procedimento, gli strumenti, le
misure, e soprattutto **il giudizio** — come si capisce cosa serve, cosa è un errore da correggere e
cosa è un dettaglio da copiare, quando fidarsi di un numero e quando degli occhi.

È scritta per chi riprende il lavoro senza la chat di allora (una persona o un modello), e per chi
vuole applicare lo stesso metodo a un altro logo, un altro kit, un'altra app.

| File | Di cosa parla |
|---|---|
| [01-giudizio.md](01-giudizio.md) | **Da leggere per primo.** Principi e criteri di decisione, con gli esempi concreti in cui hanno contato |
| [02-logo.md](02-logo.md) | Il logo 3D in SVG: la scena, ogni fase, gli algoritmi, le misure, gli errori corretti, come modificarlo |
| [03-illustrazioni.md](03-illustrazioni.md) | Tutti i tentativi sulle illustrazioni (7 metodi), perché i primi sei non bastavano, il metodo attuale |
| [04-app.md](04-app.md) | Come il Brand Kit entra nell'app: componenti in codice, illustrazioni, tema scuro, coerenza delle pagine |
| [05-strumenti.md](05-strumenti.md) | Ogni programma di `strumenti/brand/`: cosa fa, quando usarlo, come si lancia |
| [06-lavoro-con-agenti.md](06-lavoro-con-agenti.md) | Come dividere il lavoro tra più agenti, cosa è andato storto e come si evita |
| [07-cosa-funziona.md](07-cosa-funziona.md) | Riassunto secco: cosa funziona, cosa non funziona, con il perché |
| [08-concept.md](08-concept.md) | Estrazione automatica degli elementi dalle 52 immagini di `design-concept/` |
| [09-concept-svg.md](09-concept-svg.md) | Dagli elementi agli SVG: logo, icone, kit luminoso, componenti, schermate, layout |

La stessa conoscenza, in forma operativa, è nella skill
[`.claude/skills/ricreare-grafica/SKILL.md`](../.claude/skills/ricreare-grafica/SKILL.md): è quella
da seguire quando si deve rifare una grafica.

## Stato (settembre 2026)

- **Logo**: finito. SVG costruito come scena 3D + maglie di sfumature misurate, scarto 3,0/255 dalla
  reference (SSIM 0,938), con due errori della reference corretti apposta. Icone dell'app generate dall'SVG.
- **Componenti in codice** (pulsanti, interruttori, caselle, radio, avanzamento, badge, stati,
  icone, misuratore, caricamento): finiti, in `src/brand/`.
- **Illustrazioni**: tutte le 41 ridisegnate pulite col metodo 7 (3 esempi approvati dall'utente,
  poi 38 da quattro agenti con le stesse regole). Un generatore per illustrazione in
  `strumenti/brand/illustrazioni/` (oggetti comuni in `oggetti.py` e `oggetti_a/b/c/d.py`), SVG in
  `brand/disegni/`, varianti scure `<nome>.scuro.svg`, tavole in `brand/tavole/puliti/`, tavola
  d'insieme `brand/tavole/disegni-puliti.png`.
- **App**: pagine coerenti con il kit rosso, barra di navigazione, illustrazioni SVG.
- **Concept**: `fonti/design-concept/` appiattita in una cartella; 1277 elementi estratti in `brand/concept/` con `estrai_concept.py` (vedi 08).
