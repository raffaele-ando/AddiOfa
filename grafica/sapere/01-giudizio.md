# Il giudizio: come si decide cosa serve

Gli strumenti si rifanno in un pomeriggio. Quello che è costato davvero è capire, ogni volta, **che
cosa fosse giusto fare**. Qui ci sono i criteri, ognuno con il caso concreto da cui è nato.

## 1. Misurare sempre, ma guardare sempre

Ogni prova si rende nello stesso motore dell'app (Chromium, `render.py`) e si confronta con la
reference in numeri: scarto medio su 0–255 (`mae_255`), il 95° percentile (`p95`), la quota di pixel
entro 8/255, la somiglianza strutturale (`ssim`). Senza numeri si procede a sensazione e non si sa
se un cambio ha migliorato o peggiorato.

Ma **il numero non è l'obiettivo**, è un termometro. Lo scarto medio premia la sfocatura: una
forma sfumata sbaglia "un po' dappertutto" e fa meno errore di una forma netta messa di un pixel
fuori posto. Casi reali:

- Logo, giro 6: aggiungendo 26 "luci" (macchie radiali sfumate) messe dove l'errore era massimo, lo
  scarto è sceso da 4,95 a 4,07. Guardando la tavola a 4x, però, la stella era piena di chiazze e
  le pareti sembravano sporche. **Scartato**: si è cambiato metodo (misurare le forme invece di
  inseguire l'errore), e lo scarto giusto è arrivato dopo (2,9) con bordi netti.
- Logo, grana del materiale: aggiungerla **alza** lo scarto (da 2,75 a 3,0) perché il rumore mio
  non coincide pixel per pixel con quello della reference. Senza grana, però, il pavimento sembrava
  plastica. **Tenuta**, con l'intensità tarata misurando la grana della reference (deviazione del
  dettaglio fine: 1,8 sul pavimento, 1,1 sul muro) e non a occhio.

Regola: si guarda sempre la tavola ingrandita (3–4x, fondo chiaro **e** scuro, originale accanto),
e si guarda **anche alle dimensioni vere d'uso** (64, 120, 280 px). Un difetto che a 1254 px non si
vede (le fessure tra le righe delle maglie) in piccolo diventa una riga, o un finto gradino.

## 2. La reference ha degli errori: distinguere i dettagli dagli sbagli

Le immagini di partenza sono generate dall'AI. Sono belle nell'insieme e sbagliate nei dettagli.
Copiarle "esattamente" vuol dire copiare anche gli errori. Per ogni cosa strana ci si chiede:
**nella realtà (o in un disegno fatto da una persona brava) sarebbe così?**

Errori dell'AI trovati e corretti:

- **Logo, pavimento**: a sinistra la linea tra muro e pavimento scende verso il bordo, a destra
  no; dentro la porta la soglia ha due righe nette e sembra un gradino. In una stanza vera il
  pavimento è uno solo. L'utente l'ha notato ("sembra una parete che si solleva"): corretto con una
  linea simmetrica e un pavimento continuo dalla stanza dietro fino a davanti.
- **Libri**: spigoli che non tornano, facce che non sono in prospettiva, dorso piatto. Un libro vero
  ha copertine rigide che sporgono dal blocco pagine, un dorso curvo, facce parallele.
- **Bandiere del Regno Unito** con le diagonali rosse centrate (quelle vere sono sfalsate).
- **Simboli e scritte senza senso**: segni nelle caselle di un calendario, righe di testo doppie,
  lettere storte. Si sostituiscono con cose vere (lettere reali, barre di testo pulite).
- **Asimmetrie non volute**: manici della coppa diversi, stella storta, raggi disuguali.
- **Bordi bianchi sfrangiati** attorno a quasi tutto (residui del ritaglio dal foglio).

Quello che invece **si copia**: composizione, proporzioni, colori (campionati sulle zone pulite),
stile della luce, tipo di materiale. Sono le scelte di design, e sono buone.

## 3. La rappresentazione giusta dipende da cosa si sta rappresentando

- **Geometria** (contorni, spigoli, pieghe, simmetrie) → forme parametriche con nomi: poligoni con
  raccordi veri, curve, simmetrie costruite. Mai ricalcarla dai pixel: i pixel di un'immagine AI
  piccola sono morbidi e tremolanti, e il ricalco diventa un acquerello.
- **Luce complessa e continua** (il riflesso sul pavimento del logo, le sfumature di una parete
  lucida) → maglie di sfumature misurate sui pixel (`maglia.py`). Qui i pixel sono l'informazione.
- **Luce semplice** (un'illustrazione piatta con volume) → 2–3 sfumature lineari e un riflesso,
  disegnati. Una maglia qui copierebbe le macchie dell'AI.
- **Elementi d'interfaccia** (pulsanti, interruttori, badge, barre) → codice React con i token:
  devono essere cliccabili, animabili, avere lo stato vero.

L'errore da non ripetere: usare lo strumento di un caso sull'altro. Le maglie hanno fatto
benissimo al logo e male alle illustrazioni (copiavano i difetti).

## 4. Modificabile vuol dire strutturato

Un SVG che "sembra uguale" ma è una nuvola di tracciati anonimi non si può cambiare. Ogni pezzo
deve avere un **nome** (`libro-blu-copertina`, `bandiera`, `lucchetto-arco`), le parti animabili un
gruppo loro, i numeri importanti un **parametro** (nel logo `parametri.json`, nelle illustrazioni
i generatori in `strumenti/brand/illustrazioni/`). Prova che funziona: `modifica_disegno.py` cambia
colore, posizione, scala, rotazione di un pezzo per id; `ricolora_logo.py` fa le varianti del logo.

## 5. Prima pochi esempi, poi in grande

Con le illustrazioni è stato fatto l'errore opposto: lanciati quattro agenti su 40 disegni con un
metodo non ancora provato fino in fondo. Risultato: 40 disegni fedeli ma con i difetti dell'AI, da
rifare. La regola ora è: **uno, poi un altro diverso, poi un terzo diverso** (un oggetto in 3D, un
oggetto simmetrico, un oggetto piatto), si mostrano all'utente, e solo quando il metodo regge su
tutti e tre si scala. Ogni esempio fallito insegna qualcosa (il primo libro "spigoloso" ha insegnato
che servono raccordi veri e una sagoma unica).

## 6. Ascoltare come l'utente descrive le cose

Le descrizioni dell'utente sono state la guida migliore sulla geometria: "un unico pavimento", "un
muro bucato", "la stella non ha un pavimento suo ma due pareti larghe in basso che salendo si
restringono", "il muro è curvo, il centro è più avanti", "le pareti sono molto riflettenti". Ogni
frase è diventata un pezzo del modello (`curva` del muro, `specchio` del pavimento, i vertici del
fondo della porta). Quando una frase e un pixel sono in disaccordo, di solito ha ragione la frase
(il pixel può essere un errore dell'AI, vedi punto 2).

## 7. Capire perché, non aggiustare a caso

Quando qualcosa non torna si cerca la causa con una prova piccola e isolata, prima di correggere:

- Righe chiare nel logo in piccolo → prova con una maglia di un solo colore a 37 px: righe anche lì
  → prova con rettangoli pieni senza maschere: righe anche lì → causa: due rettangoli affiancati con
  antialiasing coprono ciascuno una parte del pixel di confine e lo sfondo passa. Correzione: ogni
  riga scende sotto le successive. Riprova a 37, 53, 100, 241 px: nessuna riga.
- Grana che schiariva il pavimento → misura: il rumore aveva media 186 invece di 128 → causa: i
  filtri SVG lavorano in linearRGB → `color-interpolation-filters="sRGB"`.
- Le pieghe tra le pareti della stella non si vedevano → profili di luminosità attraverso la piega
  nella reference: è un salto netto con una riga di luce sottile → ricerca del punto di piega che
  massimizza il salto → maglie divise lì + riga di luce misurata.

## 8. Dire le cose come stanno

Numeri veri, anche quando peggiorano; cosa non è riuscito, con il perché; cosa resta da fare. Le
metriche su fondo scuro delle illustrazioni sono alte perché gli originali hanno bordi sporchi: si
dice, non si nasconde.
