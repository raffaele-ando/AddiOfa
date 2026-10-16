# NOTE-LANDING: la landing segue i concept 41, 45, 51, 12

Agente LANDING. Confronti concept | app in `docs/lavoro/extra/landing/` (concept a sinistra, app a destra, stessa larghezza; 1280 e 400 px, chiaro; scuro: `51-hero-1280-scuro.png` e le pagine intere `app-scuro-1280-intera.png` / `app-scuro-400-intera.png`; chiare intere `app-chiaro-*-intera.png`).

## Sezione -> concept -> cosa è stato fatto

| Sezione (file in `screens/landing/`) | Concept | Cosa c'è ora |
|---|---|---|
| Barra (`Barra.tsx`) | 41, 45 | marchio, menu a pillola (Home, Cos'è l'OFA, Come funziona, Funzionalità, FAQ), «Fai il diagnostico»; sul telefono l'hamburger apre la tendina (provato: 5 voci, si chiude dopo la scelta). |
| Hero (`Hero.tsx` + `brand/hero/Scena.tsx`) | 41 (scena), 45/12 (testi), 51 (studente) | etichetta «Per gli studenti del Politecnico di Milano», titolo «Oltre l'OFA, un passo in più.», due righe, «Fai il diagnostico» + «Come funziona», «Gratis · Senza account · i · Salta». Scena a destra, grande, che esce dal bordo: lastra con la porta di luce, scalinata, città; **lo studente di spalle del concept 51 cammina verso la porta** (ritagliato con GrabCut, in chiaro e in scuro); tre carte di vetro **vere** (probabilità con «Esempio», quiz con bandiera A/B/C, «Ripasso su misura»). Sul telefono la scena sta sopra il titolo, ritagliata sulla porta (come 12). |
| Vantaggi (`Vantaggi.tsx`) | 45, 12 | striscia di vetro con 4 cerchi-icona (probabilità, simulazioni, errori, spiegazioni) e due righe di testo; sale sul bordo della scena. È l'unico posto dei numeri «10 domande, 3 minuti» e «N domande». |
| SeNonSuperi (`SeNonSuperi.tsx`) | 41 | «Cos'è l'OFA di inglese?» con una frase e «Scopri tutti i rischi» (apre il foglio con regole e scadenze 2026/27); a destra 4 carte di vetro inclinate con l'illustrazione grande del kit blu (mancato superamento, rischio economico, piano bloccato, accesso 2° anno) su un filo rosso che sale alla carta blu «Con AddiOFA ti prepari ed eviti tutto questo» con pulsante rotondo al diagnostico. |
| Passi (`Passi.tsx`, `Telefono.tsx`) | 51 (desktop), 12 (telefono) | «Un percorso su misura, in 4 passi»: da 1024 px quattro colonne numerate (01-04) con la mini-schermata vera dell'app e una riga di spiegazione; sul telefono lista con linea verticale e il telefono con la home vera (Indicatore con valore d'esempio, badge «Esempio»). |
| Perche (`Perche.tsx`) | 45, 12 | «Tutto ciò che ti serve per arrivare preparato.»: 4 schede con illustrazione grande (quiz-test, attesa-caricamento, progressi-statistiche, suggerimenti-consigli); anello «25/30 soglia» al posto dell'82 % del concept; banner con la foto dell'edificio e «Il tuo futuro non si ferma a un esame.» |
| Faq (`Faq.tsx`) | menu di 41/45 | invariata (5 domande). |
| CtaFinale (`CtaFinale.tsx`) | 45, 12 | «Sblocca il tuo domani.» su blu, con il ritaglio del concept (cielo, blocchi, logo 3D) a destra, sfumato nel blu; i bottoni App Store/Google Play sono sostituiti da «Fai il diagnostico» e «Salta». |
| Footer | - | invariato. |

## Arte (script riproducibili)
- `grafica/strumenti/brand/estrai_hero.py` (aggiornato come chiesto dal coordinatore): ora cancella con l'inpainting il **contenuto** delle due carte di vetro baked (quiz con bandiera, «Piano di studi bloccato»), in chiaro e in scuro, e aggiunge lo studente (`studente()`, `metti_studente()`). Restano due pannelli di vetro vuoti dietro le carte vere, che sono un po' più grandi per coprire i ritocchi (le sfumature del ripristino si vedono solo senza le carte). Output in `grafica/brand/hero/` e copiato in `app/src/brand/essenziali/hero/`.
- `grafica/strumenti/brand/estrai_landing.py` (nuovo): `banner-edificio.webp` (foto del concept 45 senza le lettere «Politecnico di Milano» sulla facciata e senza il testo) e `cta-fondo.webp` (cielo, blocchi e logo 3D, senza testo, bottoni degli store e «Stessa partenza»). Output in `grafica/brand/landing/` e in `app/src/brand/essenziali/landing/`. Pesi: 48 KB e 13 KB.
- `tools/sincronizza-essenziali.sh`: aggiunta una riga che copia `grafica/brand/landing/*.webp` (lo script cancella tutta `essenziali/` prima di ricopiare: senza la riga i due file sparirebbero). Non l'ho eseguito.
- Nuovo `screens/landing/landing.css`: sposta gli aloni dello sfondo dentro la tessera di 1500 px (c'era una riga netta ogni 1500 px).
- Modificato `brand/hero/Scena.tsx` (dopo il via libera del coordinatore): carte vere; carta della probabilità un po' più larga (così il «72 %» supera il contrasto).

## Testi: tolto / sostituito
Tolti: «12.000+ studenti», avatar, «82 %» come dato, badge degli store, «Scarica l'app», «rischio di fallimento», stemma e insegne nelle immagini (lettere sulla facciata, insegna sul palazzo), «Stessa partenza…», Pass/prezzi/lista d'attesa/«demo». Sostituiti con dati veri da `config/offer.ts`: 30 domande · 15 minuti · soglia 25/30, circa 30 € a tentativo, solo esami del 1° anno, scadenze 2026/27, 10 domande · 3 minuti, numero di domande dal file dei dati (oggi 613).

## Verifiche fatte
- `npx tsc --noEmit` (app): 0 errori (alla fine; durante il lavoro c'erano errori nei file degli altri agenti). `npm run build` e `npm run build:demo`: ok, «Controllo superato».
- `python3 tools/controlla-contrasto.py --pagina "http://127.0.0.1:5255/?landing" --solo-pagina` a 400 e 1280, chiaro e scuro: 0 violazioni (all'inizio 2: «ed eviti tutto questo» 4,24 e il «72 %» 3,31, corrette). Console 0 errori/avvisi a 360, 400, 768, 1024, 1280, 1920 px, chiaro e scuro.
- Scorrimento orizzontale: nessuno visibile (il contenitore ha `overflow-x-hidden`); a 360 px `scrollWidth` risulta 363, causato dalla scena ritagliata dentro un riquadro nascosto: nessun elemento sporge fuori dai riquadri con overflow.
- Tastiera: Tab attraversa nell'ordine marchio, menu, pulsanti dell'hero, «i», «Salta», sezioni; menu mobile apribile e richiudibile.
- Guardato a occhio (non a numeri) in Chromium: 1280 e 400 px, chiaro e scuro, tutte le sezioni.

## Quanto somiglia, onestamente
- **Molto vicino**: hero con la scena di 41 + studente di 45/12/51; striscia dei 4 (45/12); «Cos'è l'OFA» con carte di vetro e filo rosso (41); i 4 passi (51) e il telefono (12); schede illustrate, banner con l'edificio e chiusura col logo 3D (45/12).
- **Meno vicino**: (1) l'hero del concept 41 riempie tutta la finestra con più scalinata e cielo; il mio ritaglio (976x490 del concept) è più basso e la scena finisce con una dissolvenza; (2) i **tre telefoni** dell'hero di 45 non ci sono: nel concept coprono la lastra e l'arco, ho lasciato un solo telefono in «Come funziona» come da brief; (3) l'hero scuro del concept 51 (monolito, studente ripreso da vicino, fogli che volano, Duomo) non è riproducibile senza le scritte scolpite: in scuro c'è la scena notturna di ILLU con lo studente; (4) non ho fatto i pannelli prima/dopo di 51 (foto dello studente stanco / col Duomo); (5) le carte del concept 41 sono dentro l'arte e prospettiche, le mie sono carte di vetro CSS appena inclinate; (6) l'arte dei concept è a 1536 px: a 1280-1920 px è un po' morbida (banner 2x Lanczos, scena 1x).
- **Non provato**: Safari/Firefox (`backdrop-filter`, `mask-image`), 768 px non fotografato (solo console e scorrimento), lettore di schermo, schermi molto alti, la demo aperta come `artifact.html` (solo build e controllo automatico).
- Lo studente è ritagliato con GrabCut: a 1x non si vedono frange, le mani restano tagliate ai polsini.

## Note per chi coordina
- `screens/landing/Offerta.tsx` (stub) e `brand/hero/Lastra.tsx` non sono più usati dalla landing (non li ho cancellati). `dati.tsx` esporta ancora `CONSEGUENZE`, usato da `components/Onboarding.tsx`.
- `grafica/brand/landing/*-1x.png` sono i ritagli non ingranditi (riferimento).
