# Catalogo logo AddiOFA

Tabella generata dal `manifest.json` di `grafica/brand/logo/` (cartella con i vettori puliti). Per ogni variante: file (su fondo chiaro), versioni per fondo scuro in `su-scuro/` e per fondo blu in `su-blu/` con lo stesso nome, numero NN dei concept in `grafica/fonti/design-concept/` (vedi `grafica/fonti/INDICE.md`) e tipo: **concept** = riprodotta da un'immagine, **derivata** = mescolanza nuova di elementi dei concept, **copia** = copiata da `grafica/brand/concept-svg/logo/`.

La galleria per scegliere è `galleria-logo.html` (in `app/dist-demo/`, non nel repository) (si ricostruisce con `python3 tools/make-galleria-logo.py`). Il logo 3D (`grafica/strumenti/brand/logo/addiofa-logo.svg`) resta l'icona dell'app e degli store: non è toccato (icone in `docs/design/store/`).

## Lettermark (la A con la stella a cinque punte, base piatta)

| Variante | File | Fonte (NN) | Tipo | Cos'è / come si usa |
|---|---|---|---|---|
| Bicolore, navy e blu | `lettermark-bicolore.svg` | 15 | concept | A navy con il piede destro blu: la versione dei concept 15. Intestazione su fondo chiaro, firma di documenti; la versione «principale» del concept 15. |
| Blu pieno | `lettermark-blu.svg` | 35, 07, 15 | concept | A blu pieno, un solo colore. Nei concept 07/35 aveva la stella a 4 punte: qui è quella a 5. Un solo colore: stampa, timbri, icone in app. |
| Navy, una tinta | `lettermark-navy.svg` | 28 (monocromatica) | derivata | A tutta navy (bianca su fondo scuro): monocromatica per timbri, stampa, filigrana. Monocromatico per stampa in nero/bianco. |
| Solo contorno | `lettermark-contorno.svg` | nessuna (nuova) | derivata | A solo contorno, leggera; per sfondi fotografici o bollini. Filigrana, sfondi fotografici. |
| Quadrato blu | `lettermark-tile-blu.svg` | 15 | concept | A bianca nel quadrato arrotondato blu: la versione tile dei concept 15. Avatar, profilo, notifiche (dove serve un quadrato). |
| Quadrato blu notte | `lettermark-tile-notte.svg` | 35, 07 | derivata | A bianca nel quadrato blu notte (come l'icona «dark» del concept 35, con la A al posto della stella). Come sopra su fondo chiaro con più peso. |
| Quadrato sfumato | `lettermark-tile-sfumato.svg` | 07, 35 | derivata | A bianca nel quadrato con sfumatura blu, vicina all'icona 3D. Dove si vuole un richiamo all'icona 3D. |
| Quadrato chiaro, A bicolore | `lettermark-tile-chiaro.svg` | 15 + 35 | derivata | A bicolore nel quadrato chiaro: per profili e miniature su fondo scuro. Miniature su fondo scuro. |
| Cerchio blu | `lettermark-cerchio-blu.svg` | 35, 37 | derivata | A bianca nel cerchio blu (come la scintilla nel cerchio dei concept 35, 37). Avatar social tondi. |
| Cerchio blu notte | `lettermark-cerchio-notte.svg` | 37 | derivata | A bianca nel cerchio blu notte: avatar dei profili social. Avatar social tondi, versione scura. |

### Lettermark «A piena» (forma del concept 07/35): con la stella dalla base piatta (`piena-*`) e con la scintilla a 4 punte (`scintilla-*`)

La A piena con la stella è ridisegnata per stare nella A (stella più grande e morbida, fascia sotto di pari spessore dei piedi). Le varianti `scintilla-*` (A con la scintilla del concept 07/35, 6 lettermark e 3 lockup) restano come alternativa.

| Variante | File | Fonte (NN) | Tipo | Cos'è / come si usa |
|---|---|---|---|---|
| A piena blu | `lettermark-piena-blu.svg` | 07, 35 + stella del 15 | concept | A piena a cima piatta con la stella a 5 punte dalla base piatta ritagliata al centro. Lettermark scelto dall'utente. |
| Navy, una tinta | `lettermark-piena-navy.svg` | — | derivata | Monocromatica per timbri e stampa. |
| Solo contorno | `lettermark-piena-contorno.svg` | — | derivata | Filigrana. |
| Quadrato blu / blu notte | `lettermark-piena-tile-blu.svg`, `lettermark-piena-tile-notte.svg` | 35 | derivata | Avatar e profilo. |
| Cerchio blu | `lettermark-piena-cerchio-blu.svg` | 35, 37 | derivata | Avatar social tondi. |
| Lockup | `lockup-orizzontale-piena.svg`, `lockup-orizzontale-piena-tagline.svg`, `lockup-verticale-piena.svg` | 07, 35 | derivata | A piena + wordmark primario. |

## Wordmark

| Variante | File | Fonte (NN) | Tipo | Cos'è / come si usa |
|---|---|---|---|---|
| Primario, scintilla nella O | `wordmark-primario.svg` | 07, 28, 35, 40 | concept | AddiOFA con la scintilla a 4 punte nella O: il wordmark dei concept 07, 28, 35. |
| Stella a 5 punte nella O | `wordmark-o-stella5.svg` | nessuna (nuova) | derivata | Come il primario ma nella O c'è la stella a 5 punte con la base piatta, coerente con la A. |
| O semplice, senza stella | `wordmark-o-semplice.svg` | 15 | concept | AddiOFA con la O vera (anello), senza stella; OFA in blu. |
| Tutto navy, solo la O blu | `wordmark-solo-o-blu.svg` | 07 (variante) | derivata | Tutto navy, solo il disco della O è blu (con la scintilla). |
| Con il motto in maiuscole | `wordmark-con-tagline.svg` | 07, 28, 35, 40 | concept | Con «IL TUO INGLESE, SENZA OSTACOLI.» spaziato sotto. |
| «Studia oggi, sblocca il tuo domani» | `wordmark-con-tagline-studia.svg` | 15 | concept | O vera e il motto «Studia oggi, sblocca il tuo domani.». |
| Stella a 5 punte e motto | `wordmark-stella5-con-tagline.svg` | nessuna (nuova) | derivata | O con la stella a 5 punte e il motto in maiuscole. |
| Monocromatico navy | `wordmark-mono-navy.svg` | 28 | concept | Monocromatica, un solo colore (navy, bianco su scuro). |
| Monocromatico grigio | `wordmark-mono-grigio.svg` | 28 | concept | Monocromatica grigia: versione discreta, per filigrana. |

## Lockup

| Variante | File | Fonte (NN) | Tipo | Cos'è / come si usa |
|---|---|---|---|---|
| Orizzontale, quadrato blu | `lockup-orizzontale-tile.svg` | 07, 28, 35 | derivata | Quadrato blu con la A + wordmark: la disposizione del concept 07/35 «logo orizzontale con icona». |
| Orizzontale, quadrato e motto | `lockup-orizzontale-tile-tagline.svg` | 07, 35 | derivata | Come sopra con il motto sotto il wordmark. |
| Orizzontale, A bicolore | `lockup-orizzontale-bicolore.svg` | 15 | derivata | La A bicolore libera + wordmark. |
| Orizzontale, A bicolore e stella nella O | `lockup-orizzontale-bicolore-stella5.svg` | nessuna (nuova) | derivata | A bicolore + wordmark con la stella a 5 punte nella O: tutto con la stessa stella. |
| Orizzontale, quadrato blu notte | `lockup-orizzontale-tile-notte.svg` | 35 | derivata | Quadrato blu notte con la A + wordmark. |
| Orizzontale, cerchio blu | `lockup-orizzontale-cerchio.svg` | 35 | derivata | Cerchio blu con la A + wordmark (per intestazioni compatte). |
| Verticale, quadrato e motto | `lockup-verticale-tile.svg` | 07, 28 | derivata | Quadrato con la A sopra, wordmark e motto centrati. |
| Verticale, A bicolore | `lockup-verticale-bicolore.svg` | 15 | derivata | A bicolore sopra il wordmark. |
| Verticale, A bicolore e motto | `lockup-verticale-bicolore-tagline.svg` | 15, 07 | derivata | A bicolore sopra il wordmark con il motto. |
| Orizzontale con l'icona 3D | `lockup-orizzontale-3d.svg` | 07, 35, 28 | copia | Icona 3D + wordmark + motto: la disposizione dei concept 07/35 con l'icona com'è. |
| Verticale con l'icona 3D | `lockup-verticale-3d.svg` | 07, 35, 28 | copia | Icona 3D sopra il wordmark e il motto (concept 07). |

## Stelle e simboli

| Variante | File | Fonte (NN) | Tipo | Cos'è / come si usa |
|---|---|---|---|---|
| Stella con la base piatta, blu | `stella-porta-blu.svg` | 24, 07, 35 | concept | La stella a 5 punte con la base piatta («la porta» dell'icona 3D), blu pieno. |
| Stella con la base piatta, navy | `stella-porta-navy.svg` | 35 (app icon dark) | derivata | La stessa stella in navy (bianca su scuro). |
| Stella con la base piatta, contorno | `stella-porta-contorno.svg` | nessuna (nuova) | derivata | La stella con la base piatta solo a contorno. |
| Stella piatta nel quadrato blu notte | `stella-porta-tile-notte.svg` | 35, 07, 28 | concept | Stella piatta bianca nel quadrato blu notte: l'icona «dark» del concept 35. |
| Stella piatta nel quadrato blu | `stella-porta-tile-blu.svg` | 35 | concept | Stella piatta bianca nel quadrato blu: la mini-icona piatta del concept 35. |
| Stella piatta nel quadrato chiaro | `stella-porta-tile-chiaro.svg` | nessuna (nuova) | derivata | Stella piatta blu nel quadrato chiaro. |
| Stella piatta nel cerchio blu | `stella-porta-cerchio-blu.svg` | nessuna (nuova) | derivata | Stella piatta bianca nel cerchio blu (avatar). |
| Stella piatta nel cerchio chiaro | `stella-porta-cerchio-chiaro.svg` | 26, 44 | derivata | Stella piatta blu nel cerchio chiaro (copertine delle storie in evidenza). |
| Stella regolare a 5 punte | `stella-regolare-blu.svg` | 16, 17, 23 (elementi extra) | concept | Stella a 5 punte regolare, arrotondata, blu: per «Consigliato», valutazioni. |
| Stella regolare, contorno | `stella-regolare-contorno.svg` | 35 (valori del brand) | concept | Stella a 5 punte regolare, a contorno. |
| Scintilla a 4 punte | `stella-scintilla-blu.svg` | 07, 28, 35, 37, 44 | concept | La scintilla a 4 punte dei concept (dentro la O, avatar social). |
| Scintilla, contorno | `stella-scintilla-contorno.svg` | 28 (stile icona) | concept | La scintilla a contorno (stile icona). |
| Scintilla nel cerchio blu | `stella-scintilla-cerchio.svg` | 35, 44 | concept | La scintilla bianca nel cerchio blu. |
| Scintilla nel tondo chiaro | `stella-scintilla-tondo-chiaro.svg` | 37 | concept | La scintilla blu nel tondo chiaro (avatar del profilo Instagram). |
| Scintilla nel quadrato blu | `stella-scintilla-tile.svg` | 28 | concept | La scintilla bianca nel quadrato blu: l'icona «compatta» del concept 28. |

## Dove si vedono nei concept (NN)

| NN | Soggetto | Cosa c'è di logo |
|---|---|---|
| 07 | brand board logo palette | Brandmark 3D con wordmark e motto; «logo variations» (wordmark primario, lockup con icona 3D e motto, tile scuro con stella piatta); costruzione del brandmark; **lettermark A blu con scintilla a 4 punte** (la versione sbagliata); applicazioni (felpa, tote bag) |
| 15 | brand concept logo stella | **Lettermark A bicolore navy/blu con stella a 5 punte e A bianca nel quadrato blu con stella a 5 punte** (le due versioni corrette); wordmark con O semplice e motto «Studia oggi, sblocca il tuo domani.»; icona 3D |
| 28 | brand identity system | Logo primario, secondario con motto, compatto (tile blu con scintilla), bianco su blu notte, su chiaro, monocromatico nero e grigio; griglia e area di rispetto; stile icona (scintilla contorno, piena, in tile) |
| 35 | brand identity b | Pannello «Icon / Lettermark»: A blu con scintilla, app icon colore (3D) e dark (stella piatta bianca su blu notte), icone semplificate (scintilla, scintilla nel cerchio, A, stella piatta nel quadrato blu); logo variations con lockup orizzontale |
| 24 | icona app stella | L'icona 3D a 1254 px (sorgente della forma della stella con base piatta) |
| 44 | icone sfera | Avatar «AddiOFA»: scintilla blu nel cerchio; etichetta con la O a scintilla |
| 26, 37 | social identity, profilo Instagram | Avatar tondo chiaro con scintilla blu; wordmark nei post; icona 3D come foto profilo |
| 40 | art direction | Wordmark bianco su scuro con O blu e scintilla scura, motto su due righe; scintilla nelle icone |
| 16, 17, 23, 27, 50 | brand kit b, c, d, e, f | Nessun logo: solo la stella a 5 punte regolare («Consigliato», trofeo) e i colori |
| 04, 38, 46, 00, 32, 41, 45, 51, 12 | locandine, social, landing | Wordmark con motto in intestazione, icona 3D in piccolo |

## Come sono state costruite (cosa è a mano)

- **La A con la stella**: poligono unico di 13 vertici (`A_STELLA` in `genera-logo.py`), misurato sul concept 15 con contorni a 6x e sovrapposto a vista finché coincideva; simmetrizzato (nel concept la A è un po' storta) con gambe parallele a 22,5 gradi. La stella a 5 punte è il vuoto tra le gambe: il suo corpo scende nell'apertura della A e la base piatta è la linea di base. Il bicolore taglia il piede destro alla quota delle punte.
- **La stella con la base piatta** (`PORTA`): misurata sul bordo esterno dell'apertura dell'icona 3D (concept 24) e simmetrizzata; i vertici sono spostati per la «recessione» del raccordo, così dopo l'arrotondamento la forma tocca il contorno originale.
- **Wordmark**: lettere di Inter Bold (peso scelto per lo spessore dello stelo, 0,20 dell'altezza delle maiuscole come nel concept 07) come tracciati con fontTools, spigoli raccordati, puntino della i tondo; disco della O di diametro 1,067 volte l'altezza delle maiuscole, a 3,2 px da i e F; scintilla a 4 punte e stella a 5 punte come bianco/blu nel disco. Niente `<text>`.
- **Lockup**: composti dal generatore con le regole dei concept (lettermark alto 1,15 volte le maiuscole, quadrato alto quanto il blocco, verticale con il lettermark al 36-40% della larghezza del wordmark). Le due varianti 3D sono copie di `concept-svg/logo/`.

## Cosa non convince

- La stella dentro la A, sotto 24 px di altezza, si riduce a una tacca; da 32 px si legge. Per dimensioni minime usare la variante «blu» o «navy», o il quadrato.
- La stella a base piatta dentro la O del wordmark, piccola, ricorda una pedina; la scintilla a 4 punte del concept regge meglio.
- Le lettere del wordmark sono Inter Bold arrotondata, non identiche al concept (che ha una A più aperta e terminali più morbidi).
- Lockup con la A più «AddiOFA»: la A si ripete; funziona meglio con il quadrato o in intestazione con il solo lettermark.
- «Quadrato chiaro, A bicolore» ha poco contrasto su fondo chiaro; è pensato per fondo scuro.
- Il blu navy del logo (#071438) non coincide con `--brand-primario` (#0F172A): è il valore misurato sul concept; da allineare se si adottano i token.
