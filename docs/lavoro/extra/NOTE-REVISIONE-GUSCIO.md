# Revisione 18/10: guscio (Layout, barra in basso, marchio)

Agente GUSCIO. Immagini di confronto in `docs/lavoro/extra/guscio/`.

## Cosa è cambiato

**1. Desktop: colonna unica (`app/src/components/Layout.tsx`, `index.css`)**
- Via la cornice finta (padding `sm:p-6`, `max-w-3xl`, `max-h-[800px]`). Ora: una colonna a tutta altezza, larga `--colonna` = 480 px, centrata, `bg-superficie` con due fili laterali (`border-linea`) sul fondo pagina `bg-fondo`; nei due temi i colori sono token. Sotto 640 px la colonna è tutta la finestra (identico a prima).
- La barra in basso sta dentro la colonna, quindi è larga 480 px come il contenuto.
- Compatibilità senza toccare i file degli altri: le schermate che hanno ancora la loro cornice (`sm:rounded-[28px] sm:border`, `sm:rounded-[32px]`, `sm:max-h-[calc(100dvh-3rem)]`: Menu, Esercizi, Theory, ui.tsx, LearnMode, ExamMode, Esito, StatsMode, sfide, `extra/ui.tsx`, il `conBarra` di App.tsx) la perdono con tre regole `.guscio-colonna ...` aggiunte in fondo a `index.css` (solo aggiunte). Quando gli altri tolgono quelle classi le regole non fanno più nulla.
- Colonna larga per la Home a due colonne: `useColonnaLarga()` (esportata da `Layout.tsx`) oppure `<Layout larga>`. Da 1024 px la colonna passa a 960 px (`--colonna`); sotto non cambia nulla. Si spegne da sola allo smontaggio. Dentro si usa `lg:` di Tailwind. Nota: oggi `Menu.tsx` fa già il suo layout a tutta finestra con `lg:fixed lg:inset-0` (come la landing), quindi non ha bisogno del meccanismo; resta disponibile.
- La landing (`fixed inset-0 z-40`) non dipende dal guscio: non toccata, verificata.

**2. Barra in basso (`Navigazione.tsx`)**
- «Sfide» più scura: causa = `hover:text-testo` sulle voci inattive (la voce toccata per ultima restava in hover; nella cattura dei revisori il mouse restava lì). Tolto: nessun cambio di colore al passaggio. Misurato in Chromium dopo aver cliccato ogni voce: le due inattive hanno sempre lo stesso colore (chiaro `rgb(86,98,121)`, scuro `rgb(151,165,196)`).
- Voce attiva = icona PIENA (nuovi `app/src/brand/icone/pieno/{house,dumbbell,swords}.svg`, solo file aggiunti, usati da `<Icona pieno>`), blu, grassetto; inattive a contorno.
- Tocco: 133 x 56 px a 400 px (minimo 44); etichette 12,5 px.

**3. Marchio (`brand/Marchio.tsx`, `brand/marchio.generato.ts`, `tools/genera-marchio.py`)**
- Adottata la versione del concept: «Addi» in `fill-testo`, «OFA» in `fill-azione` (blu d'azione; scuro `#5A92FF`), la O è un disco con UNA sola stella (scintilla a 4 punte) ritagliata. Sorgente `grafica/brand/logo/wordmark-primario.svg` (già nel repo); il generatore ora produce i tracciati con un `ruolo` (testo/azione) e il componente li colora con i token. Nuova prop `monocolore` (stampa). Nessun `<text>`, nessun esadecimale nel componente. `lettermark` (solo A) resta, ora blu.
- Dettaglio: nei concept 07 e 28 (ho guardato `003-grafica.png` e `anteprima.png`) il blu copre «OFA» intero, non solo la O (G5 e il brief dicevano «O»): ho seguito l'immagine. Prova anche la variante «solo O blu»: leggibile uguale, meno colore; scartata per fedeltà al concept.
- Prima/dopo: `guscio/logo-confronto-varianti.png` (5 varianti, 24/34/120 px, chiaro e scuro, 2x), `logo-24px-chiaro-x4.png` e `logo-24px-scuro-x4.png` (24 e 34 px a 1x ingranditi 4x). Giudizio: a 24 px il vecchio ha le due stelle che si leggono come tacche; il nuovo ha una scintilla chiara nel disco, e «OFA» si stacca da «Addi». La stella a 5 punte nella O (varianti 3 e 4) a 24 px diventa un pentagono impastato: scartata. Scelta onesta: nuovo marchio, variante 1.
- Costo: nel sistema ora convivono la scintilla a 4 punte (wordmark) e la stella a 5 punte (icona app 3D, lettermark); il revisore G5 la considera un'incoerenza dei concept. Per il wordmark ha vinto la leggibilità a 24 px. Favicon, `apple-touch-icon`, icone del manifest restano l'icona 3D con stella a 5 punte (invariate: il marchio verbale non è nell'icona).
- Provato a 24, 34 (Menu/Onboarding), 28 (barra landing), 72 (splash) di altezza; chiaro e scuro.

**4. Lingua e meta**: `<html lang="it">` era già presente. `theme-color`: blu in chiaro, `#0A101F` in scuro (`index.html`, due meta con `media`); `manifest.json` invariato.

## Cosa NON applicato e perché
- **«Home» attiva nelle sottopagine: NON risolto nel mio perimetro.** Misurato: su 25 schermate registrate, Home è evidenziata in tutte quelle che non appartengono a una scheda (profilo, profilo-modifica, progressi, obiettivi, badge, faq, segnala, stato-vuoto, offline, esplora, projectid, atlas-analisi, noi, agora, simulazione-dettaglio, il Teoria di App); sfide/amici/classifica/condividi/sfida-risultato evidenziano Sfide, frasi Esercizi: questi sono giusti. Il campo `barra` non ha un valore «nessuna». Richiesta (3 righe, fuori dal mio perimetro): in `screens/extra/registro.ts` il tipo diventa `barra?: 'home'|'esercizi'|'sfide'|'nessuna'|null`; in `App.tsx` `return def.barra === null ? pagina : conBarra(def.barra === 'nessuna' ? null : (def.barra ?? 'home'), pagina)` (e `conBarra(null, ...)` per il Teoria); poi `barra: 'nessuna'` nelle schermate elencate. `Navigazione` già gestisce `attiva = null` (nessuna voce evidenziata).
- Icone «manubrio/spade» sostituite con «quiz/trofeo» (G5): non fatto. Il registro (`registro/*.json`) impone una funzione = un'icona e il trofeo è di «classifica»; il cambio tocca file non miei. Proposta aperta.
- Rail di navigazione a sinistra da 1024 px (opzione B di C): non fatta (scelta A, la minima).
- Landing/funnel: nessuna modifica; il funnel (ui.tsx `Schermata`) perde la cornice per la regola CSS.

## Richieste per file non miei
1. App.tsx/registro.ts: valore `'nessuna'` (sopra).
2. Chi ha ancora `sm:rounded-[28px|32px] sm:border sm:border-linea` o `sm:max-h-[calc(100dvh-3rem)]` sulla radice di una schermata può toglierli: il guscio ora è la cornice. Le colonne interne `max-w-[440px] px-6` lasciano 20 px per lato dentro i 480 px: va bene; se vogliono più respiro usino `max-w-[var(--colonna)]`.
3. `Esercizi.tsx` e `Menu.tsx` renderizzano la propria `Navigazione`: ok, stessa barra.
4. Nelle catture ho visto che `Menu.tsx` contiene un secondo `<nav aria-label="Sezioni">` (`hidden lg:flex`): è dell'agente Home; ha lo stesso nome accessibile della barra.

## Numeri (provato)
- `npm test` dalla radice: 297 prove, 293 passano, 0 falliscono, 4 saltate.
- `npx tsc --noEmit`: NON pulito, ma gli errori sono in file di altri agenti in lavorazione (`screens/extra/profilo/{Badge,Progressi}.tsx`: `SelettoreIcone` mancante; `components/CheatSheet.tsx`: `Arte` non definito). Nessun errore nei miei file.
- `npm run build`: ok.
- `tools/controlla-testo.py`: 2 blocchi oltre 5 parole, non miei («Le regole che tornano più spesso» in Esercizi, «e il corso, per personalizzare l'app» in Profilo). `tools/controlla-contrasto.py`: 0 violazioni (lo script si interrompe in un passo perché non trova il pulsante «Inizia» dopo le modifiche degli altri agenti).
- Schermate a 400 e 1280 px, chiaro e scuro (16 pagine ciascuna: landing, funnel 3 schermate, Home, Esercizi, Sfide, Profilo, Progressi, FAQ, Lezione, simulazione): zero errori in console, zero scorrimento orizzontale (misurato `scrollWidth <= innerWidth`).
- Barra: misurati colori e dimensioni dopo il click su ogni voce (chiaro e scuro).

## Non provato
- Pagine intere (400x2600) e la tastiera/telefoni piccoli; Safari/iOS (safe-area) e un vero touch; le schermate dopo la 3ª del funnel; l'esito della simulazione; zoom a 1024-1100 px con `useColonnaLarga` (la funzione non è ancora usata da nessuno); icona piena della casa con maschera interna provata solo in Chromium.
