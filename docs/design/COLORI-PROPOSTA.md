# Proposta colori di AddiOFA

Consegna del consulente di colore. Basata solo su `COLORI-INVENTARIO.md`. Tutte le misure sono calcolate (contrasto WCAG 2.x; OKLCH con L = luminosità 0-1, C = croma, H = tinta in gradi; ΔE = distanza in OKLab moltiplicata per 100, sotto 2 due colori sono indistinguibili a occhio, sotto 1 sono lo stesso colore; simulazione del daltonismo con le matrici di Machado, gravità 1,0).

Come leggere: ogni valore di questo documento va applicato alla lettera. Dove un valore è ripetuto in tabelle diverse, la fonte di verità è il blocco JSON della sezione 3 (interfaccia) e della sezione 4 (landing).

---

## 1. Diagnosi (dal più grave al meno grave)

**1. Il rosso fa due mestieri opposti.** La fascia «bassa» è un rosso puro, `#F5303B` (L 0,63, C 0,229, H 25), e lo stesso rosso serve per l'errore (`#E11D2E` in Scena, `#DC2626` nelle illustrazioni). La distanza è ΔE 4,8 e 5,6: per l'occhio è lo stesso colore. Uno studente che vede «probabilità 28%» in rosso carico riceve lo stesso segnale di «risposta sbagliata»: è esattamente la pressione che il marchio promette di non esercitare. Nelle illustrazioni la cosa è sistematica: 17 delle 68 illustrazioni contengono rossi (25%); `attenzione-rischio` ha 5 colori su 5 rossi, `attesa-caricamento` 7 su 8 (una attesa in rosso è pressione), `risultato-probabilita` 6 su 8, `composizione-tre` 5 su 8. I rossi sono 32 esadecimali distinti con H 16-28 (più un arancio a H 44) e croma fino a 0,23 (il massimo che lo schermo permette nella tinta), cioè il tono più allarmante possibile.

**2. Nel tema scuro le tre tinte delle fasce non si distinguono e non hanno la loro tinta.** `basso-tinta` `#26283D` (H 279, blu-viola), `medio-tinta` `#262C3B` (H 268, blu-grigio), `alto-tinta` `#1B2D40` (H 251, blu): sono tre blu-grigi con distanze ΔE 1,5 / 1,7 / 2,1 tra loro. La tinta «ambra» scura non è ambra, la «verde» è blu. In chiaro invece le tre tinte hanno la tinta giusta (H 17, 70, 158). Il tema scuro perde quindi proprio il codice colore delle fasce. In più `azione-tinta-scura` in scuro è identico ad `azione-tinta` (`#16264A`, contrasto 1,00:1): usato come testo sulla tinta sparisce.

**3. Contrasti sotto soglia** (WCAG: testo normale 4,5, testo grande e componenti grafici 3):
- `medio` `#FFA92D` su bianco: 1,92:1; `alto` `#0BB474`: 2,69:1; `azione-chiaro` `#60A5FA`: 2,54:1. Se sono l'unico segno di una barra, di un anello o di un bordo, falliscono.
- `tacca` `#D3DAE6` su fondo: 1,33:1 (scuro `#2A3858` su `#0A101F`: 1,63:1) e `linea`: 1,13:1. Vanno bene solo come divisori; se qualcuno li usa come bordo di un campo, fallisce (serve 3:1 e il sistema non ha un token per questo).
- `viola` `#8B5CF6` su bianco: 4,23:1, sotto 4,5 se usato come testo.
- `medio-testo` (4,99:1) e `alto-testo` (5,00:1) passano per un soffio: basta una tinta un po' diversa per cadere.
- Nelle illustrazioni, `#97A8CF` su bianco fa 2,38:1 (è decorativo, ma è il colore di un bordo in `quiz-test`).
- Tutto il resto dell'interfaccia (testo, testo-tenue, azione, i quattro testi semantici in scuro) supera AA con ampio margine: la parte sana del sistema.

**4. Daltonismo rosso-verde: le fasce basso e alto collassano.** In deuteranopia `#F5303B` diventa `#A09033` e `#0BB474` diventa `#A19878`: ΔE 7,4 (sotto 10 si confondono). In protanopia `medio` e `alto` hanno ΔE 8,7. In più rosso e verde sono saturi e vicini di luminosità (L 0,630 e 0,679). Senza icona o parola, le fasce sono ambigue per circa l'8% degli studenti maschi.

**5. Illustrazioni: troppi colori quasi uguali e troppe tinte di blu.** Nella variante chiara ci sono 388 esadecimali distinti tra i soli 8 colori più usati per file (452 con la scura), con 2.179 coppie sotto ΔE 2 (indistinguibili). I «bianchi» sono 39 valori tra `#FCFDFF` e `#EBEFFB` (L da 0,997 a 0,95): per esempio `#F4F7FE`, `#F6F8FE`, `#F5F7FE`, `#F4F7FF`, `#F3F7FF` sono lo stesso bianco. I blu sono 208 valori con H tra 249 e 277: quelli a 248-255 (`#3F90FF`, `#60AAFF`) tirano al ciano, `#5563EC` a 274 tira all'indaco, mentre l'interfaccia sta a 263. 81 dei 452 valori distinti hanno C > 0,20 (blu «elettrico»), poco coerente con «calmo».

**6. Rosso e blu accostati vibrano.** `composizione-tre` e `piano-studi-bloccato` mettono `#1D4ED8` (L 0,488, H 264) accanto a `#DC2626` (L 0,577, H 27): tinte opposte (ΔE 39) con luminosità quasi uguale (ΔL 0,09). Il bordo tra le due vibra (cromostereopsi) ed è faticoso da guardare, soprattutto la sera. Di nuovo, ansia.

**7. Doppioni nei token (decine di coppie «quasi uguali»).**
- `marchio` `#1D6BFF` e `azione` `#2563EB`: due blu di marca, ΔE 3,5.
- `azione-da` `#2C6BEA` e `azione-a` `#2563EB`: ΔE 2,1, il gradiente non si vede.
- Landing: `lastra-fianco` (ΔE 0,9 da `lastra-3`), `muro-1` (0,3 da `cielo-basso`), `pagina-da` (1,0 da `cielo-basso`), `muro-2` (1,1 da `gradino-fronte`).
- Scuro: `azione-chiaro` = `azione-scuro` (`#7FA8FF`); `basso`, `basso-numero`, `basso-pieno` tutti `#F2766B` (e così per medio e alto: 9 token, 3 valori); `viola-chiaro` identico nei due temi; `azione-tinta` = `azione-tinta-scura`.
- `azione-tinta` `#DBEAFE` ha H 256 e `azione-chiaro` `#60A5FA` H 255: 7-8 gradi verso il ciano rispetto all'azione (H 263). Piccolo, ma si vede nei gradienti.

**8. Colori scritti a mano: 24 tinte chiare «a mano» in `componenti.tsx`** (6 azzurrini H 268-283, 4 grigi, 8 rosati H 12-17, 2 ambra, 3 verdi, più il bianco) che differiscono di ΔL ≤ 0,02, ΔE 1-3 tra loro: sono la stessa tinta ripetuta con piccoli errori. E, se non vengono ricolorate dal tema, in scuro restano chiare (L 0,95 su fondo L 0,18) con testo chiaro: illeggibili. Altri 10 colori (Scena, Lastra, CtaFinale, TelefonoPassi) duplicano token della landing.

**9. Ambra che tira all'arancio e si avvicina al corallo.** `medio` `#FFA92D` è H 70 (arancio), `medio-numero` `#D4780A` è H 60. Le illustrazioni hanno «ambra» da H 44 (`#FF7A3A`, arancio pieno) a H 88: 44 gradi di scarto. Verso il basso l'ambra tocca il territorio del corallo che sostituirà il rosso.

**10. Viola vicino al blu.** `#8B5CF6` (H 293, C 0,219) è a 30 gradi dall'azione, con luminosità simile (0,606 contro 0,546; ΔE 12,7). Su un chip piccolo si scambia con il blu.

**Cosa va bene e si tiene.** I neutri: tinta H 264-267 coerente, croma bassa (0,006-0,05), gradini di luminosità regolari (chiaro 0,982 / 1,0 / 0,970 / 0,939 / 0,887; scuro 0,176 / 0,22 / 0,255 / 0,292 / 0,344), niente bianco né nero puri nello scuro (testo `#EAF0FC`, L 0,95; fondo `#0A101F`, L 0,176). Il blu d'azione `#2563EB` (5,17:1, H 263). Le coppie `testo` e `testo-tenue`.

---

## 2. Principi scelti

**Armonia: un blu maestro e satelliti con tinte disgiunte.** Il sistema è una «ruota» di sei tinte in OKLCH, con distanza minima tra due tinte vicine di 24 gradi e luminosità/croma diverse in ogni coppia vicina:

| Ruolo | H (OKLCH) | Distanza dalla successiva | Significato |
|---|---|---|---|
| errore (cremisi) | 14 | 24° da corallo | solo risposta sbagliata, validazione, annulla |
| basso (corallo) | 38 | 46° da ambra | «da lavorare»: caldo ma non allarmante |
| medio (ambra dorato) | 84 | 86° da verde-acqua | «a metà strada» |
| alto (verde-acqua) | 170 | 93° da blu | «ci sei» |
| azione (blu) | 263 | 37° da viola | tutto ciò che si può premere |
| viola | 300 | 74° da errore | apprendimento e traguardi, raro |

Nel tema scuro corallo e errore si allontanano ancora (corallo H 44, errore H 6, ΔE 11) perché con L alta i due rosati altrimenti si avvicinano. Il blu resta l'unico colore d'azione; i colori semantici non sono mai pulsanti. Proporzioni attese per schermata: neutri almeno 70%, blu al massimo 20%, colori semantici al massimo 8% (le fasce, solo quando mostrano un risultato), viola al massimo 2% (un elemento per schermata).

**Simbolismo per un pubblico sotto stress.** Il corallo (arancio-rosato) in contesto italiano ed europeo dice «attenzione, c'è da fare» senza il carico del rosso (divieto, errore, voto insufficiente sul registro). Il rosso vero (cremisi) resta, ma solo dove c'è davvero un errore, sempre con icona e parola. Il verde-acqua (H 170) al posto del verde puro evita il «verde semaforo» (via libera, quasi pubblicitario) e fa da cugino del blu: tutta la palette resta fredda con un solo accento caldo, quindi calma. L'ambra è il colore della luce e della crescita; il viola è il colore dell'«ora sai una cosa in più».

**Saturazione e luminosità per ruolo** (tutto in OKLCH):

| Ruolo | Chiaro: L / C | Scuro: L / C |
|---|---|---|
| riempimento (`x`, `x-pieno`) | 0,50-0,64 (ambra 0,83) / 0,10-0,19 | 0,68-0,84 / 0,12-0,14 |
| testo su tinta (`x-testo`) | 0,42-0,46 / 0,09-0,17 | 0,84-0,87 / 0,075-0,095 |
| numeri grandi (`x-numero`) | 0,55-0,59 / 0,115-0,16 | uguale al riempimento |
| tinta di sfondo (`x-tinta`) | 0,966-0,975 / 0,018-0,035 | 0,266-0,275 / 0,040-0,058 |
| chiaro (`x-chiaro`) | 0,80-0,91 / 0,08-0,10 | 0,82-0,89 / 0,075-0,08 |

**Tema scuro: regole.** (1) Non è un'inversione: i fondi restano blu notte di tinta 265 (C 0,033-0,05); l'elevazione si fa con la luminosità (fondo 0,176, superficie 0,22, superficie-2 0,255: +0,04, +0,035), mai con ombre. (2) Niente nero né bianco puri: massimo L 0,95 per il testo, 0,90 per le «carte bianche» delle illustrazioni. (3) Accenti più chiari e più desaturati: C scende di circa un quarto (azione 0,215 -> 0,172; corallo 0,16 -> 0,13; verde-acqua 0,124 -> 0,12; viola 0,18 -> 0,14). (4) Le tinte scure di ogni fascia conservano la propria tinta (H 40, 86, 173, 300, 8) con L 0,27: si riconoscono. (5) Sul riempimento pieno il testo è `#0A101F`, non bianco.

**Daltonismo.** (a) Le fasce stanno sull'asse blu-giallo che chi ha deuteranopia/protanopia distingue ancora: verde-acqua (sposta verso il blu) contro corallo e ambra (che diventano due gialli di luminosità diversa: corallo scuro e ambra chiaro). (b) La luminosità è ordinata (medio sempre il più chiaro). (c) **Regola vincolante: ogni fascia ha sempre la parola («Bassa / Media / Alta») e una forma** (per esempio: freccia in giù, trattino, spunta), mai il solo colore. In chiaro il corallo è volutamente più scuro del verde-acqua (luminanza relativa 0,198 contro 0,274) e l'ambra molto più chiaro (0,564), così anche in scala di grigi le tre fasce hanno tre livelli.

**Garanzie di contrasto** (tutte misurate, tabella in sezione 3): testo e testo semantico ≥ 4,5:1 su fondo, superficie, superficie-2 e sulla propria tinta, in entrambi i temi; numeri grandi (≥ 24 px, o ≥ 19 px in grassetto) ≥ 3:1 (minimo misurato 3,91:1); componenti e bordi di campo ≥ 3:1 (bordo-campo); pulsanti e chip pieni ≥ 4,5:1 col loro testo `*-su`.

**Regola del riempimento ambra.** `medio` (L 0,83) da solo non arriva a 3:1 su bianco (1,71:1), ed è inevitabile: un ambra a 3:1 è marrone. Quindi: ogni barra, anello o indicatore che usa `medio` come riempimento deve avere un bordo di 2 px in `medio-numero` (3,91:1 o più) oppure usare `medio-numero` come riempimento. Basso e alto in chiaro arrivano a 4,23:1 e 3,24:1 e non hanno bisogno del bordo.

---

## 3. Token dell'interfaccia (sezione 1 dell'inventario)

I token nuovi hanno `cambia: true` e il motivo comincia con «NUOVO». Sono 11: `azione-testo`, `bordo-campo`, `errore`, `errore-chiaro`, `errore-testo`, `errore-tinta`, `errore-su`, `basso-su`, `medio-su`, `alto-su`, `viola-su`.

Istruzioni di applicazione, da seguire insieme alla tabella:
1. Dove nel codice un fondo pieno usava `azione-su` o il bianco come testo sopra `basso-pieno`, `alto-pieno`, `viola-pieno`, ora si usa il rispettivo `*-su`. Sopra `medio-pieno` si usa `medio-su` (blu notte), mai il bianco.
2. Dove il codice usava `basso*` per un errore (risposta sbagliata, campo non valido, «annulla», `Misuratore` che indica errore), passare ai token `errore*`. Dove usava `basso*` per la fascia di probabilità bassa, restano `basso*` (ora corallo).
3. Bordi di campi di testo, caselle e interruttori: `bordo-campo`. `linea` e `tacca` restano per divisori e tracce.
4. `azione-tinta-scura` si usa solo come fondo di blocco con testo chiaro. Per il testo blu su `azione-tinta` o su bianco: `azione-testo`.
5. `marchio` e `azione` hanno ora lo stesso valore: si possono lasciare entrambi.

```json
[
  {"token": "fondo", "chiaro": "#F7F9FD", "scuro": "#0A101F", "cambia": false, "motivo": "Invariato. Neutro azzurrato (OKLCH L 0,982 C 0,006 H 265); testo 15,97:1. Chiaro, non bianco puro, cosi la scheda bianca (superficie) si stacca senza ombre."},
  {"token": "superficie", "chiaro": "#FFFFFF", "scuro": "#111A2E", "cambia": false, "motivo": "Invariato. Bianco puro ammesso solo nel tema chiaro e solo come superficie di scheda."},
  {"token": "superficie-2", "chiaro": "#F2F5FB", "scuro": "#17223A", "cambia": false, "motivo": "Invariato (L 0,970). Terzo e ultimo grado di neutro chiaro: nessun altro bianco quasi uguale e ammesso."},
  {"token": "testo", "chiaro": "#0E1B3F", "scuro": "#EAF0FC", "cambia": false, "motivo": "Invariato. Blu notte (L 0,234 H 266) invece del nero: 15,97:1 su fondo, caldo e coerente col blu d'azione."},
  {"token": "testo-tenue", "chiaro": "#566279", "scuro": "#97A5C4", "cambia": false, "motivo": "Invariato. 5,83:1 su fondo, 5,62:1 su superficie-2, 5,07:1 su azione-tinta: supera AA ovunque."},
  {"token": "linea", "chiaro": "#E6EBF5", "scuro": "#1F2B45", "cambia": false, "motivo": "Invariato. Solo decorativo (1,13:1): mai usarlo come unico segno di un controllo, per quello c'e bordo-campo."},
  {"token": "tacca", "chiaro": "#D3DAE6", "scuro": "#2A3858", "cambia": false, "motivo": "Invariato. Solo decorativo (divisori, tracce di barre). Non e adatto ai bordi dei campi (1,33:1): usare bordo-campo."},
  {"token": "azione", "chiaro": "#2563EB", "scuro": "#5A92FF", "cambia": false, "motivo": "Invariato. #2563EB (L 0,546 C 0,215 H 263) e gia un blu fidato: 5,17:1 su bianco, 5,17:1 con testo bianco. E il punto di riferimento della tinta (H 263) per tutto il sistema."},
  {"token": "azione-scuro", "chiaro": "#1D4ED8", "scuro": "#7FA8FF", "cambia": false, "motivo": "Invariato (stato hover/premuto, 6,70:1 col bianco). Coincide con azione-testo in chiaro."},
  {"token": "azione-tinta", "chiaro": "#DFEAFE", "scuro": "#16264A", "cambia": true, "motivo": "H 256 -> 263 (era piu ciano dell'azione, 7 gradi di scarto) e L 0,932 -> 0,935: ora e la stessa tinta del blu d'azione. Il valore scuro resta."},
  {"token": "azione-tinta-scura", "chiaro": "#1E3A8A", "scuro": "#1A3268", "cambia": true, "motivo": "Scuro: era identico ad azione-tinta (#16264A, contrasto 1,00:1: sparisce). Ora e un blu profondo piu chiaro (L 0,33) per blocchi con testo chiaro (testo 10,8:1). Chiaro invariato. Non va usato come colore di testo: per il testo sulla tinta c'e azione-testo."},
  {"token": "azione-chiaro", "chiaro": "#70A0F8", "scuro": "#9FC1FF", "cambia": true, "motivo": "Chiaro: #60A5FA aveva H 255 (tira al ciano) e contrasto 2,54:1; ora H 262, L 0,71. Scuro: era uguale ad azione-scuro (#7FA8FF): ora L 0,81 e un gradino a se (evidenziazioni, bordi di focus sullo scuro)."},
  {"token": "azione-da", "chiaro": "#2D6BEC", "scuro": "#73A3FC", "cambia": true, "motivo": "Il gradiente da/a era invisibile (DeltaE 2,1 tra #2C6BEA e #2563EB). Ora da e piu chiaro (L 0,565) e a piu scuro (L 0,505); il bianco su da resta 4,74:1 (>= 4,5)."},
  {"token": "azione-a", "chiaro": "#2657D4", "scuro": "#578EF9", "cambia": true, "motivo": "Vedi azione-da. In scuro il gradiente va da L 0,72 a L 0,66, con testo #0A101F sempre >= 6,0:1."},
  {"token": "azione-su", "chiaro": "#FFFFFF", "scuro": "#0A101F", "cambia": false, "motivo": "Invariato (bianco su azione, scuro #0A101F su azione scuro)."},
  {"token": "marchio", "chiaro": "#2563EB", "scuro": "#5A92FF", "cambia": true, "motivo": "Era un secondo blu (#1D6BFF, DeltaE 3,5 dall'azione): due blu di marca diversi sembrano un errore. Ora e uguale a azione (chiaro e scuro): 5,17:1 e 6,32:1."},
  {"token": "basso", "chiaro": "#CD5630", "scuro": "#DA7C52", "cambia": true, "motivo": "Da rosso puro (#F5303B, H 25, C 0,23) a corallo (H 38, C 0,16, L 0,60). Il rosso e riservato all'errore (token errore). 4,23:1 su bianco, quindi valido anche come grafica; piu scuro del verde-acqua (luminanza 0,198 contro 0,274) perche in scala di grigi le due fasce restino diverse. In scuro L 0,68, 5,8:1."},
  {"token": "basso-chiaro", "chiaro": "#F7AC92", "scuro": "#F2B49C", "cambia": true, "motivo": "Corallo chiaro per gradienti e riflessi (L 0,81); prima #FF8E8E era rosa-rosso."},
  {"token": "basso-testo", "chiaro": "#903820", "scuro": "#F6BBA6", "cambia": true, "motivo": "Corallo scuro per testo su basso-tinta: 6,87:1 (prima 7,13:1 ma in rosso). Scuro 9,1:1."},
  {"token": "basso-numero", "chiaro": "#BC4621", "scuro": "#EC9067", "cambia": true, "motivo": "Numeri grandi (>= 24 px, o >= 19 px in grassetto): 5,20:1 su bianco, 4,72:1 su tinta. Non piu #E8101E (rosso acceso). Scuro: L 0,74."},
  {"token": "basso-tinta", "chiaro": "#FFF1EC", "scuro": "#3D1C10", "cambia": true, "motivo": "Da rosa #FEF0F0 a pesca-corallo (H 40, C 0,02). Scuro: era #26283D (H 279, blu-viola, ΔE 1,5-2,1 dalle altre tinte): ora L 0,27, C 0,055, H 40, un bruno-corallo riconoscibile (ΔE 4,2 da medio-tinta, 9,7 da alto-tinta)."},
  {"token": "basso-pieno", "chiaro": "#BC4621", "scuro": "#DA7C52", "cambia": true, "motivo": "Fondo pieno (chip, pulsante) col testo basso-su: bianco 5,20:1 in chiaro, #0A101F 6,3:1 in scuro. Era #D12A33 (rosso)."},
  {"token": "medio", "chiaro": "#F7BD36", "scuro": "#F1C364", "cambia": true, "motivo": "Da arancio-ambra (H 70) ad ambra dorato (H 84, L 0,83): piu giallo e quindi piu lontano dal corallo (46 gradi). Come riempimento da solo non arriva a 3:1 (1,71:1): mai da solo, sempre con la parola e con un bordo in medio-numero. Scuro: 10,5:1."},
  {"token": "medio-chiaro", "chiaro": "#FBDE9C", "scuro": "#F2D89E", "cambia": true, "motivo": "Ambra chiaro per gradienti e riflessi, stesso H 87."},
  {"token": "medio-testo", "chiaro": "#7A4C0D", "scuro": "#F0D08B", "cambia": true, "motivo": "Marrone-ambra per testo su tinta: 6,84:1 (prima 4,99:1, al limite)."},
  {"token": "medio-numero", "chiaro": "#A97015", "scuro": "#F1C364", "cambia": true, "motivo": "Numeri grandi: 4,19:1 su bianco, 3,91:1 su tinta (la soglia per il testo grande e 3:1). Da H 60 (arancio) a H 72 (ambra scuro)."},
  {"token": "medio-tinta", "chiaro": "#FFF7DE", "scuro": "#332606", "cambia": true, "motivo": "Giallo-crema (H 92, C 0,035); scuro: era #262C3B (blu-grigio, H 268): ora L 0,275, C 0,05, H 86, un bruno-oliva caldo, leggibile come ambra (ΔE 6,9 da alto-tinta)."},
  {"token": "medio-pieno", "chiaro": "#F7BD36", "scuro": "#F1C364", "cambia": true, "motivo": "Riempimento pieno ambra, ma il testo sopra e medio-su (blu notte, 9,85:1), non il bianco: il bianco su ambra e 1,7:1 e l'ambra scurita per reggere il bianco diventa marrone sporco."},
  {"token": "alto", "chiaro": "#0BA27F", "scuro": "#4FCAA8", "cambia": true, "motivo": "Da verde puro (H 159) a verde-acqua (H 170, L 0,635): sta sull'asse blu-giallo, che chi ha deuteranopia/protanopia distingue ancora, mentre il corallo e l'ambra diventano gialli. 3,2:1 su bianco (prima 2,69:1). Scuro: L 0,76, 8,5:1."},
  {"token": "alto-chiaro", "chiaro": "#98E8C9", "scuro": "#A4E5CB", "cambia": true, "motivo": "Verde-acqua chiaro per gradienti, H 168."},
  {"token": "alto-testo", "chiaro": "#03614B", "scuro": "#91E1C3", "cambia": true, "motivo": "Testo su alto-tinta: 6,91:1 (prima 5,00:1)."},
  {"token": "alto-numero", "chiaro": "#09896B", "scuro": "#4FCAA8", "cambia": true, "motivo": "Numeri grandi: 4,37:1 su bianco, 4,05:1 su tinta."},
  {"token": "alto-tinta", "chiaro": "#E6FBF3", "scuro": "#032F25", "cambia": true, "motivo": "Menta (H 170, C 0,024). Scuro: era #1B2D40 (H 251, blu): ora L 0,272, C 0,05, H 173, verde-acqua scuro riconoscibile."},
  {"token": "alto-pieno", "chiaro": "#007C60", "scuro": "#4FCAA8", "cambia": true, "motivo": "Fondo pieno col testo alto-su: bianco 5,18:1; scuro #0A101F 9,35:1."},
  {"token": "viola", "chiaro": "#8C5AD3", "scuro": "#B28FEF", "cambia": true, "motivo": "H 293 -> 300 e C 0,22 -> 0,18: 7 gradi piu lontano dall'azione (ora 37 gradi) e meno elettrico. Riservato ad apprendimento e traguardi: al massimo un elemento viola per schermata. 4,65:1 su bianco (prima 4,23:1, sotto AA se usato come testo)."},
  {"token": "viola-chiaro", "chiaro": "#D2BFF8", "scuro": "#D2BFF8", "cambia": true, "motivo": "Era identico nei due temi (#C4B5FD). Chiaro L 0,84 H 300; scuro stesso valore perche e un riflesso."},
  {"token": "viola-testo", "chiaro": "#5C2F95", "scuro": "#D5C3F8", "cambia": true, "motivo": "Testo su viola-tinta: 8,24:1 chiaro, 9,6:1 scuro."},
  {"token": "viola-tinta", "chiaro": "#F5F1FF", "scuro": "#2A1E3D", "cambia": true, "motivo": "Lavanda H 300 (C 0,02); scuro L 0,266, C 0,058."},
  {"token": "viola-pieno", "chiaro": "#763EBD", "scuro": "#B28FEF", "cambia": true, "motivo": "Fondo pieno col testo viola-su: bianco 6,57:1; scuro #0A101F 7,3:1."},
  {"token": "azione-testo", "chiaro": "#1D4ED8", "scuro": "#A5C5FE", "cambia": true, "motivo": "NUOVO. Testo blu su azione-tinta e su bianco: 5,53:1 e 6,70:1; scuro #A5C5FE 8,5:1 su azione-tinta. Risolve il caso di azione-tinta-scura usato come testo."},
  {"token": "bordo-campo", "chiaro": "#778193", "scuro": "#6C7A99", "cambia": true, "motivo": "NUOVO. Bordo di campi di testo, caselle, interruttori: serve 3:1 (WCAG 1.4.11), che linea e tacca (1,13 e 1,33:1) non danno. Chiaro 3,60:1 su superficie-2 e 3,93:1 su bianco; scuro 3,68:1 su superficie-2."},
  {"token": "errore", "chiaro": "#D21D4E", "scuro": "#F786A0", "cambia": true, "motivo": "NUOVO. Il rosso vero, solo per risposta sbagliata, errore di validazione, annullamento. Cremisi H 14 (non H 25): piu freddo e piu lontano dal corallo (24 gradi). 5,22:1 su bianco. In scuro e un rosa-rosso desaturato (L 0,75, C 0,14), 7,3:1."},
  {"token": "errore-chiaro", "chiaro": "#F7A3A9", "scuro": "#FCB8C6", "cambia": true, "motivo": "NUOVO. Riflessi e bordi morbidi dell'errore."},
  {"token": "errore-testo", "chiaro": "#9D1137", "scuro": "#FCB8C6", "cambia": true, "motivo": "NUOVO. Testo d'errore: 7,37:1 su errore-tinta, 8,17:1 su bianco; scuro 9,4:1."},
  {"token": "errore-tinta", "chiaro": "#FEF0F0", "scuro": "#3B1B22", "cambia": true, "motivo": "NUOVO. Sfondo dell'avviso d'errore. In scuro L 0,27, C 0,05, H 8."},
  {"token": "errore-su", "chiaro": "#FFFFFF", "scuro": "#0A101F", "cambia": true, "motivo": "NUOVO. Testo sul fondo pieno errore: bianco in chiaro (5,22:1), #0A101F in scuro (8,0:1)."},
  {"token": "basso-su", "chiaro": "#FFFFFF", "scuro": "#0A101F", "cambia": true, "motivo": "NUOVO. Bianco in chiaro, #0A101F in scuro."},
  {"token": "medio-su", "chiaro": "#0E1B3F", "scuro": "#0A101F", "cambia": true, "motivo": "NUOVO. Testo sul fondo pieno ambra: #0E1B3F in chiaro, #0A101F in scuro (11,5:1)."},
  {"token": "alto-su", "chiaro": "#FFFFFF", "scuro": "#0A101F", "cambia": true, "motivo": "NUOVO. Bianco in chiaro, #0A101F in scuro."},
  {"token": "viola-su", "chiaro": "#FFFFFF", "scuro": "#0A101F", "cambia": true, "motivo": "NUOVO. Bianco in chiaro, #0A101F in scuro."}
]
```

### Coppie testo/sfondo principali, con rapporto di contrasto calcolato

Ogni coppia supera la soglia in entrambi i temi. «x» sta per ciascuna di basso, errore, medio, alto, viola.

| Coppia (primo piano su sfondo) | Soglia | Chiaro | Scuro |
|---|---|---|---|
| testo su fondo | 4,5:1 | 15,97:1 | 16,60:1 |
| testo su superficie | 4,5:1 | 16,84:1 | 15,17:1 |
| testo su superficie-2 | 4,5:1 | 15,42:1 | 13,85:1 |
| testo-tenue su fondo | 4,5:1 | 5,83:1 | 7,68:1 |
| testo-tenue su superficie | 4,5:1 | 6,14:1 | 7,01:1 |
| testo-tenue su superficie-2 | 4,5:1 | 5,62:1 | 6,40:1 |
| testo-tenue su azione-tinta | 4,5:1 | 5,07:1 | 6,02:1 |
| azione su fondo | 4,5:1 | 4,90:1 | 6,32:1 |
| azione su superficie-2 | 4,5:1 | 4,73:1 | 5,27:1 |
| azione-testo su azione-tinta | 4,5:1 | 5,53:1 | 8,52:1 |
| azione-su su azione | 4,5:1 | 5,17:1 | 6,32:1 |
| azione-su su azione-da | 4,5:1 | 4,74:1 | 7,57:1 |
| azione-su su azione-a | 4,5:1 | 6,18:1 | 6,00:1 |
| azione-su su azione-scuro | 4,5:1 | 6,70:1 | 8,08:1 |
| bordo-campo su superficie | 3:1 | 3,93:1 | 4,03:1 |
| bordo-campo su superficie-2 | 3:1 | 3,60:1 | 3,68:1 |
| basso-testo su basso-tinta | 4,5:1 | 6,87:1 | 9,17:1 |
| basso-testo su superficie | 4,5:1 | 7,57:1 | 10,39:1 |
| errore-testo su errore-tinta | 4,5:1 | 7,37:1 | 9,38:1 |
| errore-testo su superficie | 4,5:1 | 8,17:1 | 10,58:1 |
| medio-testo su medio-tinta | 4,5:1 | 6,84:1 | 9,93:1 |
| medio-testo su superficie | 4,5:1 | 7,32:1 | 11,64:1 |
| alto-testo su alto-tinta | 4,5:1 | 6,91:1 | 9,58:1 |
| alto-testo su superficie | 4,5:1 | 7,46:1 | 11,36:1 |
| viola-testo su viola-tinta | 4,5:1 | 8,24:1 | 9,61:1 |
| viola-testo su superficie | 4,5:1 | 9,15:1 | 10,73:1 |
| basso-numero su superficie | 3 (testo grande) | 5,20:1 | 7,23:1 |
| medio-numero su superficie | 3 (testo grande) | 4,19:1 | 10,51:1 |
| alto-numero su superficie | 3 (testo grande) | 4,37:1 | 8,54:1 |
| basso su superficie | 3:1 | 4,23:1 | 5,77:1 |
| errore su superficie | 3:1 | 5,22:1 | 7,33:1 |
| alto su superficie | 3:1 | 3,24:1 | 8,54:1 |
| viola su superficie | 3:1 | 4,65:1 | 6,66:1 |
| medio su superficie | vedi regola | 1,71:1 | 10,51:1 |
| basso-su su basso-pieno | 4,5:1 | 5,20:1 | 6,31:1 |
| medio-su su medio-pieno | 4,5:1 | 9,85:1 | 11,50:1 |
| alto-su su alto-pieno | 4,5:1 | 5,18:1 | 9,35:1 |
| viola-su su viola-pieno | 4,5:1 | 6,57:1 | 7,29:1 |
| errore-su su errore | 4,5:1 | 5,22:1 | 8,02:1 |

### Le tre fasce sotto daltonismo (riempimenti `basso`, `medio`, `alto`)

| Tema | Simulazione | basso | medio | alto | DeltaE basso-medio | medio-alto | basso-alto |
|---|---|---|---|---|---|---|---|
| Chiaro | deuteranopia | `#94852C` | `#E3CC3D` | `#8C8A81` | 23 | 25 | 10 |
| Chiaro | protanopia | `#776B2B` | `#D6BD1B` | `#9D967D` | 28 | 17 | 15 |
| Chiaro | grigi | `#7B7B7B` | `#C6C6C6` | `#8F8F8F` | 24 | 18 | 7 |
| Scuro | deuteranopia | `#AC9D51` | `#E2CE67` | `#B2B1AA` | 16 | 15 | 11 |
| Scuro | protanopia | `#95884E` | `#D7C25B` | `#C4BEA6` | 19 | 9 | 18 |
| Scuro | grigi | `#959595` | `#C9C9C9` | `#B6B6B6` | 17 | 6 | 11 |

Prima (rosso, ambra, verde) in deuteranopia basso-alto faceva ΔE 7 e in protanopia medio-alto 9; in grigi basso-alto 10 e medio-alto 9. Ora in deuteranopia le tre coppie stanno tra 10 e 25, in protanopia tra 9 e 28 (il minimo è medio-alto in protanopia, 9: ambra e verde-acqua chiaro diventano due sabbie di luminosità diversa). In scala di grigi il minimo è 7 in chiaro (basso-alto) e 6 in scuro (medio-alto). Restano quindi coppie vicine a 10 o sotto: sono coperte dalla regola vincolante di forma più parola (sezione 2), perché alzarle ancora costerebbe il contrasto dei riempimenti.

---

## 4. Colori della landing (sezione 2 dell'inventario)

La landing era già coerente (blu H 257-264, un solo accento caldo, luce dorata): si tiene com'è e si eliminano solo i doppioni. Per il tema scuro l'inventario non dà valori: i valori `scuro` qui sotto sono la scena notturna proposta (cielo da L 0,22 a 0,34, lastra più luminosa, nessun bianco puro, la luce calda come punto più chiaro). Se il codice ha già una versione scura propria per un token, si sostituisce con questa. Per i token con `cambia: false` il valore `chiaro` non cambia.

Nuovi: `luce-ombra` e `lastra-ombra` (sostituiscono due colori scritti a mano in `Lastra.tsx`, vedi sezione 5).

```json
[
  {"token": "cielo-alto", "chiaro": "#7DB2FF", "scuro": "#0C1936", "cambia": false, "motivo": "Chiaro invariato (H 258, gia nella famiglia dell'azione). Scuro: cielo notturno L 0,22, C 0,06: il bordo alto si fonde col fondo (DeltaE 5,2), il basso si schiarisce verso l'orizzonte."},
  {"token": "cielo-medio", "chiaro": "#BCD8FF", "scuro": "#112555", "cambia": false, "motivo": "Chiaro invariato. Scuro: L 0,28, C 0,09."},
  {"token": "cielo-basso", "chiaro": "#EEF5FF", "scuro": "#1C346B", "cambia": false, "motivo": "Chiaro invariato; e il valore di riferimento per muro-1 e pagina-da. Scuro: L 0,34, C 0,10 (orizzonte)."},
  {"token": "lastra-1", "chiaro": "#3B7BFF", "scuro": "#568EF9", "cambia": false, "motivo": "Chiaro invariato (L 0,615, H 263: stesso blu dell'azione). Scuro piu luminoso (L 0,66) perche la lastra sia il punto focale sulla notte."},
  {"token": "lastra-2", "chiaro": "#1446B8", "scuro": "#2B5BC2", "cambia": false, "motivo": "Chiaro invariato. Scuro L 0,50."},
  {"token": "lastra-3", "chiaro": "#0A2A82", "scuro": "#183680", "cambia": false, "motivo": "Chiaro invariato. Scuro L 0,36."},
  {"token": "lastra-fianco", "chiaro": "#0A2A82", "scuro": "#183680", "cambia": true, "motivo": "Era #0B2C86, DeltaE 0,9 da lastra-3: doppione. Ora identico a lastra-3 (#0A2A82)."},
  {"token": "gradino-sopra", "chiaro": "#FDFEFF", "scuro": "#D3DFF3", "cambia": false, "motivo": "Chiaro invariato. Scuro: mai bianco puro, L 0,90 (luce di luna)."},
  {"token": "gradino-fronte", "chiaro": "#A6BFEC", "scuro": "#4C6291", "cambia": false, "motivo": "Chiaro invariato. Scuro L 0,50."},
  {"token": "gradino-ombra", "chiaro": "#7C9DDA", "scuro": "#2F4168", "cambia": false, "motivo": "Chiaro invariato. Scuro L 0,38."},
  {"token": "muro-1", "chiaro": "#EEF5FF", "scuro": "#162137", "cambia": true, "motivo": "Era #EDF4FF, DeltaE 0,3 da cielo-basso: ora identico a cielo-basso (#EEF5FF). Scuro L 0,25."},
  {"token": "muro-2", "chiaro": "#A6BFEC", "scuro": "#2D3F65", "cambia": true, "motivo": "Era #A3BBEA, DeltaE 1,1 da gradino-fronte: ora identico (#A6BFEC). Scuro L 0,37."},
  {"token": "luce", "chiaro": "#FFF6D2", "scuro": "#F9E7B3", "cambia": false, "motivo": "Chiaro invariato. Scuro: bagliore caldo L 0,93, che sulla notte deve restare il punto piu chiaro."},
  {"token": "luce-bordo", "chiaro": "#FCBA43", "scuro": "#EFB146", "cambia": true, "motivo": "Era #FFB54A (H 73, arancio). Ora H 78 e L 0,83, in linea con l'ambra del sistema (medio, H 84). Scuro L 0,80."},
  {"token": "vetro", "chiaro": "rgba(255, 255, 255, 0.58)", "scuro": "rgba(23, 34, 58, 0.62)", "cambia": false, "motivo": "Chiaro invariato. Scuro: rgba(23, 34, 58, 0.62) (la superficie-2 scuro semitrasparente, non bianco)."},
  {"token": "vetro-forte", "chiaro": "rgba(255, 255, 255, 0.78)", "scuro": "rgba(23, 34, 58, 0.80)", "cambia": false, "motivo": "Chiaro invariato. Scuro: rgba(23, 34, 58, 0.80)."},
  {"token": "vetro-bordo", "chiaro": "rgba(255, 255, 255, 0.9)", "scuro": "rgba(255, 255, 255, 0.14)", "cambia": false, "motivo": "Chiaro invariato. Scuro: rgba(255, 255, 255, 0.14)."},
  {"token": "vetro-ombra", "chiaro": "0 22px 44px -16px rgba(30, 64, 175, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.95)", "scuro": "0 22px 44px -16px rgba(2, 6, 18, 0.60), inset 0 1px 0 rgba(255, 255, 255, 0.10)", "cambia": false, "motivo": "Chiaro invariato. Scuro: ombra neutra piu fonda, riflesso interno debole."},
  {"token": "barra", "chiaro": "rgba(247, 249, 253, 0.72)", "scuro": "rgba(10, 16, 31, 0.72)", "cambia": false, "motivo": "Chiaro invariato (e il fondo al 72%). Scuro: il fondo scuro al 72%."},
  {"token": "fascia", "chiaro": "rgba(255, 255, 255, 0.82)", "scuro": "rgba(17, 26, 46, 0.82)", "cambia": false, "motivo": "Chiaro invariato. Scuro: la superficie scuro all'82%."},
  {"token": "pagina-da", "chiaro": "#EEF5FF", "scuro": "#0E172D", "cambia": true, "motivo": "Era #EAF2FF, DeltaE 1,0 da cielo-basso: ora identico (#EEF5FF). Scuro #0E172D, appena sopra il fondo."},
  {"token": "blocco-scuro-da", "chiaro": "#0E1B3F", "scuro": "#1A294E", "cambia": false, "motivo": "Chiaro invariato (uguale a testo). Scuro: era indistinguibile dalla superficie; ora L 0,29 per staccarsi dal fondo."},
  {"token": "blocco-scuro-a", "chiaro": "#1B2F73", "scuro": "#1D3673", "cambia": false, "motivo": "Chiaro invariato. Scuro L 0,35."},
  {"token": "blocco-blu-da", "chiaro": "#2358D6", "scuro": "#204FB5", "cambia": false, "motivo": "Chiaro invariato (bianco 6,11:1). Scuro L 0,46 (testo chiaro 6,45:1)."},
  {"token": "blocco-blu-a", "chiaro": "#123EA8", "scuro": "#173888", "cambia": false, "motivo": "Chiaro invariato (bianco 9,21:1). Scuro L 0,37 (testo chiaro 9,38:1)."},
  {"token": "rosso-linea", "chiaro": "#CD5630", "scuro": "#DA7C52", "cambia": true, "motivo": "Rosso -> corallo, uguale a basso (chiaro #CD5630, scuro #DA7C52): una linea rossa nella prima schermata e pressione; il corallo e un segnale morbido. Si consiglia di rinominare il token in corallo-linea (facoltativo)."},
  {"token": "luce-ombra", "chiaro": "#E49B2E", "scuro": "#C9892B", "cambia": true, "motivo": "NUOVO. Ombra della luce, sostituisce il #E8932C scritto a mano in Lastra.tsx (L 0,745, H 72). Scuro L 0,68."},
  {"token": "lastra-ombra", "chiaro": "#0B1F66", "scuro": "#0B1C58", "cambia": true, "motivo": "NUOVO. Sostituisce #0B1F66 scritto a mano in Lastra.tsx; stesso valore in chiaro. Scuro L 0,26."}
]
```

---

## 5. Colori scritti a mano (sezione 3 dell'inventario)

Regola generale: nessun esadecimale nei componenti, solo token. Così i colori seguono il tema scuro da soli (oggi le 24 tinte chiare non lo fanno).

### `componenti.tsx`

| Colore a mano | Sostituire con | Come scegliere |
|---|---|---|
| `#FFFFFF` | `superficie` | sempre, tranne dove è il bianco di un'illustrazione (vedi sotto) |
| `#F0F4FE`, `#EFF3FE` (L 0,964-0,967, azzurrini neutri) | `superficie-2` | pannelli passivi, righe alterne |
| `#EBF0FE`, `#ECEDFE`, `#EBEFFE`, `#E8EDFE` (L 0,947-0,955, azzurrini più scuri) | `azione-tinta` | stato selezionato, evidenziazione, chip azione |
| `#F1F3F6`, `#F1F2F6`, `#F1F3F7` (grigi, L 0,962-0,964) | `superficie-2` | pannelli neutri |
| `#ECEEF1` (grigio, L 0,948) | `linea` | riempimento di traccia o disabilitato |
| `#FEEFF0`, `#FEEFEF`, `#FEEEEF`, `#FEF0F0`, `#FEEBEC`, `#FEF0F1`, `#FEECED`, `#FEE7E9` (rosati H 12-17) | `basso-tinta` se il contesto è la fascia bassa/probabilità/«da ripassare»; `errore-tinta` se il contesto è risposta sbagliata, campo non valido, errore | nel dubbio: `errore-tinta` se la parola vicina è errore/sbagliata/invalido, altrimenti `basso-tinta` |
| `#FEF7EC`, `#FEF3E7` (ambra) | `medio-tinta` | fascia media |
| `#EBF9F0`, `#E4F7EA`, `#E4F7EC` (verdi) | `alto-tinta` | fascia alta, risposta esatta |

### `Lastra.tsx`, `Misuratore.tsx`

| Colore a mano | Sostituire con |
|---|---|
| `#FFFFFF` in `Lastra.tsx` (riflesso sulla lastra) | `gradino-sopra` (`#FDFEFF` / `#D3DFF3`): in scuro non deve restare bianco puro |
| `#FFFFFF` in `Misuratore.tsx` | `superficie` (se è sfondo di scheda) oppure `azione-su` (se è sopra un riempimento colorato) |
| `#E8932C` | `luce-ombra` (nuovo) |
| `#FFC766` | `luce-bordo` |
| `#FFF1C4` | `luce` |
| `#0B1F66` | `lastra-ombra` (nuovo, stesso valore) |

### Altri file

| Colore a mano | File | Sostituire con |
|---|---|---|
| `#1E3A8A` | `Scena.tsx` | `azione-tinta-scura` |
| `#E11D2E` | `Scena.tsx` | `rosso-linea` (ora corallo). Non `errore`: è l'elemento di scena, non un errore dell'utente |
| `#0E1B3F` | `TelefonoPassi.tsx` | `blocco-scuro-da` |
| `#123EA8` | `CtaFinale.tsx` | `blocco-blu-a` |
| `#DBEAFE` | `CtaFinale.tsx` | `azione-tinta` |
| `#2563EB` | `CtaFinale.tsx` | `azione` |

---

## 6. Illustrazioni (sezione 4) e immagini raster (sezione 5)

### 6.1 Famiglie di tinta (si classifica sul colore ORIGINALE, in OKLCH)

La classificazione si fa una sola volta sul valore di partenza, con finestre che non si sovrappongono. Ogni famiglia ha una banda di tinta di arrivo che non tocca quella delle altre: le famiglie non si possono fondere.

| # | Famiglia (finestra su L, C, H originali) | Regola variante CHIARA | Banda H di arrivo |
|---|---|---|---|
| 1 | **Bianchi**: L ≥ 0,93, C < 0,06, H 225-300 (o C < 0,02) | si agganciano a 3 soli valori: L 0,985 / 0,960 / 0,935 (il più vicino), C 0,008 / 0,017 / 0,028, H 264 | 264 |
| 2 | **Neutri**: C < 0,02, oppure H 225-300 con C < 0,06 | H = 265, C = min(max(C; 0,006); 0,04), L invariata | 265 |
| 3 | **Rossi**: H ≥ 345 o H < 33 | **corallo** (caso normale): H' = 38 + (H - 22) × 0,3; C' = C × 0,72 (C × 0,85 se L > 0,78); L' = L + 0,02 (+ 0,01 se L > 0,78) | 36-41 (scura 30-41) |
| 4 | **Arancio**: H 33-62 | diventa ambra: H' = 70 + (H - 33) × 0,3; C' = C × 0,95; L' = max(L; 0,78) | 70-79 |
| 5 | **Ambra/oro**: H 63-109 | H' = 80 + (H - 80) × 0,35; C' = min(C × 0,95; 0,16); L' = L + 0,02 se L < 0,78 | 73-82 |
| 6 | **Verdi**: H 110-199 | verde-acqua: H' = 168 + (H - 150) × 0,3; C' = min(C × 0,85; 0,145); L invariata | 167-168 |
| 7 | **Blu**: H 200-281 (e C ≥ 0,02) | H' = 262 + (H - 262) × 0,35 (comprime tutti i blu verso 262); C' = min(C × 0,96; 0,21); L' = L + 0,02 se L < 0,30 | 257-264 |
| 8 | **Viola/indaco**: H 282-344 | H' = 300 + (H - 300) × 0,3; C' = min(C × 0,85; 0,19); L invariata | 292-300 |

Eccezione per i bianchi: un chiaro con C ≥ 0,02 e H fuori da 225-300 (per esempio il rosato `#FBE3E4`, la carta `#E9D9B8`) non è un «bianco»: va nella famiglia della sua tinta (3, 5, ...), tenendo L e riducendo C di un decimo.

### 6.2 Regole per la variante SCURA

Si applicano le regole della tabella 6.1 al colore della variante scura (non si ricava la scura dalla chiara), poi queste correzioni:

| Famiglia | Correzione scura |
|---|---|
| Bianchi (le «carte» restate chiare nella scura, per esempio `#EAF1FE` in `kit-luminoso`) | 3 valori più bassi: L 0,930 / 0,900 / 0,870, C 0,008 / 0,017 / 0,028, H 264. Mai oltre L 0,93 |
| Neutri | come nella chiara |
| Blu saturi (C ≥ 0,12) con L < 0,60 | L' = 0,60 - (0,60 - L') × 0,25: sono compressi verso 0,60 e non spariscono sul fondo (`#1D4ED8`: 2,2:1 -> 3,9:1 su superficie) |
| Blu poco saturi (C < 0,12), cioè le lastre blu notte `#273B6C`, `#41629F`... | H' = 265, C' = C × 0,75: così hanno la stessa tinta e la stessa croma delle superfici dell'interfaccia; L invariata |
| Corallo | L' = max(L'; 0,68) se C originale ≥ 0,10; C' × 0,9 |
| Ambra e arancio | L' ≤ 0,86; C' × 0,9 |
| Verde-acqua | L' = max(L'; 0,70); C' × 0,9 |
| Viola | L' = max(L'; 0,70); C' × 0,9 |
| Errore (vedi eccezioni) | L' = max(L; 0,72); C' × 0,7 |

### 6.3 Eccezioni per illustrazioni nominate

Il caso normale dei rossi è il corallo. Fanno eccezione:

| Illustrazione | Cosa succede | Perché |
|---|---|---|
| `documento-errore` (kit-blu/stati), `quiz-test` (kit-blu), `notifica` (kit-blu/stati) | i rossi diventano **errore** (cremisi, non corallo): H' = 14 + (H - 22) × 0,3; C' = min(C × 0,9; 0,21); L invariata. Scura: L' ≥ 0,72, C' × 0,7 | significano davvero «errore» o «avviso»: il rosso resta, ma H 14 e C ≤ 0,21 invece di H 25-27 e C 0,22-0,23, in scuro un rosa-rosso morbido |
| `attenzione-rischio` | tutti e 5 i rossi diventano corallo (`#DC2626` -> `#C85B33`, il più scuro, resta leggibile con L 0,60). Si conserva l'idea di «attenzione» perché il segno (triangolo, punto esclamativo) è nel disegno, non nel colore | è rischio, non errore |
| `attesa-caricamento` (kit-blu e kit-luminoso) | corallo; l'arancio `#FF7A3A`/`#FFA25A` diventa ambra | una attesa non deve essere rossa |
| `risultato-probabilita`, `composizione-tre`, `piano-studi-bloccato`, `mancato-superamento` | corallo. Accostato al blu `#1D4ED8` il corallo (L 0,63-0,72, C 0,12-0,16) non vibra: ΔL tra 0,15 e 0,25 e croma più bassa | era la coppia rosso-blu che vibrava |
| `sfera-successi` (kit-blu/sfere) e `celebrazione` (kit-luminoso) | rosso -> **viola**: L' tra 0,56 e 0,78, C' = min(C × 0,82; 0,18), H' = 300 | il viola è il colore dei traguardi; un trofeo o dei coriandoli rossi sono l'opposto |
| `sfera-costi` | rosso -> **ambra** brillante: L' = min(max(L + 0,16; 0,80); 0,86), C' = 0,15, H' = 82 | la parola «costi» in rosso carico è proprio la pressione da evitare; l'ambra avvisa senza minacciare |
| `documento-in-corso` | i blu-indaco (H ≥ 272, C ≥ 0,10: `#5563EC`, `#9AA6FF`, `#7080FB`) -> **viola** (H' = 300 + (H - 300) × 0,3) | «in corso» è apprendimento; si stacca dal blu d'azione |
| `successo` (entrambi i kit), `celebrazione` (kit-blu), `suggerimenti-consigli`, `sfera-consigli` | restano ambra (famiglia 5): il dorato è il colore giusto per medaglie e idee | nessuna modifica di significato |
| `superamento`, `documento-completato` | i verdi diventano verde-acqua (famiglia 6): `#16A34A` -> `#0B9D77` | coerenza con la fascia «alta» |

### 6.4 Ordine di applicazione e come evitare che due famiglie si fondano

1. Leggere il colore originale e convertirlo in OKLCH.
2. **Classificare sull'originale** (tabella 6.1, finestre disgiunte; l'ordine di prova è: bianchi, neutri, rossi, arancio, ambra, verdi, blu, viola). Non si riclassifica mai dopo la trasformazione.
3. Applicare le eccezioni per illustrazione (6.3): cambiano la famiglia di destinazione di un colore rosso o indaco, non la finestra di classificazione.
4. Applicare la trasformazione della famiglia in una sola passata, usando solo i valori originali (nessuna trasformazione parte da un risultato di un'altra).
5. Per la variante scura, applicare la correzione 6.2.
6. Se il colore esce dal gamut sRGB, ridurre solo la croma (mai L e H).
7. Quantizzare: L a passi di 0,02, C a passi di 0,01 (elimina i doppioni a 1-2 unità).
8. Solo variante chiara: un blu che dopo tutto questo cade entro ΔE 2,5 da `#2563EB` o `#1D4ED8` diventa esattamente quel token.

Perché non si fondono: le bande di arrivo sono separate di almeno 20 gradi (errore 14-16, corallo 30-41, ambra 73-83, verde-acqua 167-168, blu 257-266, viola 292-300) e le classificazioni avvengono prima delle trasformazioni. Dopo l'applicazione si controlla che ogni colore con C > 0,05 cada in una sola banda: nella prova sull'inventario, fuori banda: 0 colori su entrambe le varianti (le bande di controllo sono errore 8-22, corallo 28-46, ambra 66-92, verde-acqua 160-175, blu 250-270, viola 288-305). Bande misurate chiara: {"corallo": [37, 41], "blu": [257, 264], "ambra": [73, 82], "errore": [14, 16], "verde-acqua": [167, 168], "viola": [292, 300]}; scura: {"corallo": [30, 41], "blu": [258, 266], "ambra": [73, 83], "errore": [14, 16], "verde-acqua": [167, 168], "viola": [292, 300]}.

Effetto misurato sull'inventario (colori delle sole illustrazioni, i primi 8 per file): variante chiara da 388 a 246 esadecimali distinti e da 2179 a 384 coppie sotto ΔE 2; variante scura da 326 a 240 colori e da 855 a 590 coppie (nella scura molte coppie ravvicinate sono gradini di blu notte voluti). I valori della famiglia bianchi (60 nella chiara) diventano 3 per variante.

Un gradiente i cui due estremi cadono nello stesso passo di quantizzazione (ΔL < 0,02) diventa piatto: è voluto, perché a quella distanza era invisibile.

### 6.5 Esempi (calcolati con il codice di riferimento qui sotto)

| Colore originale | Illustrazione | Chiara | Scura |
|---|---|---|---|
| `#DC2626` | kit-blu/illustrazioni/attenzione-rischio | `#C85B33` | `#DF7753` |
| `#DC2626` | kit-blu/stati/documento-errore | `#D23853` | `#EF7D87` |
| `#DF252B` | kit-blu/illustrazioni/quiz-test | `#D63052` | `#EF7D88` |
| `#F6474B` | kit-blu/illustrazioni/risultato-probabilita | `#E4734E` | `#E07654` |
| `#F8334F` | kit-blu/sfere/sfera-ofa | `#E26944` | `#E47351` |
| `#F8334F` | kit-blu/sfere/sfera-costi | `#EDB333` | `#EAB444` |
| `#FF5D70` | kit-blu/sfere/sfera-successi | `#AE84F2` | `#AC89E8` |
| `#EF4444` | kit-luminoso/illustrazioni/celebrazione | `#9D6FE3` | `#AD87ED` |
| `#FF7A3A` | kit-luminoso/illustrazioni/attesa-caricamento | `#F5A40C` | `#F0A633` |
| `#FFA25A` | kit-luminoso/illustrazioni/attesa-caricamento | `#ECB253` | `#E9B35E` |
| `#F59E0B` | kit-blu/illustrazioni/successo | `#F0A714` | `#EAAA3F` |
| `#16A34A` | kit-blu/stati/documento-completato | `#0B9D77` | `#2EB88E` |
| `#4FD27E` | kit-blu/illustrazioni/superamento | `#3ED4A7` | `#4FD2A8` |
| `#5563EC` | kit-blu/stati/documento-in-corso | `#795BCE` | `#A289F8` |
| `#3F90FF` | kit-blu/illustrazioni/quiz-test-lista | `#4C8EFE` | `#4C8EFE` |
| `#0057FC` | kit-blu/sfere/sfera-faq | `#2563EB` | `#2D70F4` |
| `#1D4ED8` | kit-blu/illustrazioni/composizione-tre | `#1D4ED8` | `#316FF4` |
| `#FBE3E4` | kit-blu/illustrazioni/attesa-caricamento | `#F8E7E2` | `#F8E7E2` |
| `#F4F7FE` | kit-luminoso/illustrazioni/accesso-bloccato | `#F8FAFE` | `#E5E8ED` |
| `#EAF1FE` | kit-luminoso/illustrazioni/quiz-test | `#ECF2FE` | `#E5E8ED` |
| `#273B6C` | kit-blu/illustrazioni/mancato-superamento | `#263C67` | `#2B3C62` |
| `#41629F` | kit-luminoso/illustrazioni/quiz-test | `#43629C` | `#4D6291` |
| `#475569` | kit-blu/stati/vuoto | `#485269` | `#485269` |

### 6.6 Codice di riferimento

Il codice implementa esattamente le regole sopra e produce gli esempi della tabella (provato su tutti i colori dell'inventario). Se l'agente che applica lavora in un altro linguaggio, deve riprodurre le stesse formule.

```python
# Trasformazione dei colori delle illustrazioni (una passata, deterministica).
# Uso: trasforma('#DC2626', 'chiara', 'kit-blu/illustrazioni/attenzione-rischio') -> '#C85B33'
import math

# --- conversioni sRGB <-> OKLCH -------------------------------------------
def _s2l(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def _l2s(c):
    c = max(0.0, min(1.0, c))
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
def hex_a_lch(h):
    r, g, b = [_s2l(int(h[i:i + 2], 16)) for i in (1, 3, 5)]
    l = (.4122214708*r + .5363325363*g + .0514459929*b) ** (1/3)
    m = (.2119034982*r + .6806995451*g + .1073969566*b) ** (1/3)
    s = (.0883024619*r + .2817188376*g + .6299787005*b) ** (1/3)
    L = .2104542553*l + .7936177850*m - .0040720468*s
    a = 1.9779984951*l - 2.4285922050*m + .4505937099*s
    bb = .0259040371*l + .7827717662*m - .8086757660*s
    return L, math.hypot(a, bb), math.degrees(math.atan2(bb, a)) % 360
def lch_a_hex(L, C, H):
    c = C
    while True:  # fuori gamut: si riduce solo la croma, L e H restano
        a = c * math.cos(math.radians(H)); b = c * math.sin(math.radians(H))
        l = (L + .3963377774*a + .2158037573*b) ** 3
        m = (L - .1055613458*a - .0638541728*b) ** 3
        s = (L - .0894841775*a - 1.2914855480*b) ** 3
        rgb = (4.0767416621*l - 3.3077115913*m + .2309699292*s,
               -1.2684380046*l + 2.6097574011*m - .3413193965*s,
               -.0041960863*l - .7034186147*m + 1.7076147010*s)
        if all(-1e-4 <= x <= 1 + 1e-4 for x in rgb) or c <= 0: break
        c -= 0.002
    return '#%02X%02X%02X' % tuple(round(_l2s(x) * 255) for x in rgb)
def _dE(a, b):  # distanza in OKLab x100
    def lab(h):
        L, C, H = hex_a_lch(h); return L, C*math.cos(math.radians(H)), C*math.sin(math.radians(H))
    return 100 * math.dist(lab(a), lab(b))

# --- eccezioni per illustrazione (chiave = ultimo segmento del percorso) ----
ERRORE = {'documento-errore', 'quiz-test', 'notifica'}      # rosso vero, addolcito
VIOLA = {'sfera-successi'}                                   # + kit-luminoso/celebrazione
AMBRA = {'sfera-costi'}
A_VIOLA_DA_INDACO = {'documento-in-corso'}                   # indaco -> viola
BIANCHI = {'chiara': [(.985, .008), (.960, .017), (.935, .028)],
           'scura':  [(.930, .008), (.900, .017), (.870, .028)]}   # (L, C), H = 264

def _famiglia(L, C, H):
    if L >= .93 and C < .06 and (225 <= H <= 300 or C < .02): return 'bianco'
    if C < .02 or (225 <= H < 300 and C < .06): return 'neutro'
    if H >= 345 or H < 33: return 'rosso'
    if H < 63: return 'arancio'
    if H < 110: return 'ambra'
    if H < 200: return 'verde'
    if H < 282: return 'blu'
    return 'viola'

def trasforma(hexcol, variante, illustrazione):
    nome = illustrazione.split('/')[-1]
    kit = illustrazione.split('/')[0]
    L, C, H = hex_a_lch(hexcol)
    fam = _famiglia(L, C, H)                       # 1. si classifica sull'ORIGINALE
    scura = variante == 'scura'
    errore = fam == 'rosso' and nome in ERRORE
    a_viola = (fam == 'rosso' and (nome in VIOLA or (nome == 'celebrazione' and kit == 'kit-luminoso'))) \
              or (fam == 'blu' and nome in A_VIOLA_DA_INDACO and H >= 272 and C >= .10)
    a_ambra = fam == 'rosso' and nome in AMBRA

    if fam == 'bianco':
        Ls, Cs = min(BIANCHI[variante], key=lambda t: abs(t[0] - L)); return lch_a_hex(Ls, Cs, 264)
    if fam == 'neutro':
        L2, C2, H2 = L, min(max(C, .006), .04), 265
    elif a_viola:
        L2, C2, H2 = (min(max(L, .56), .78), min(C * .82, .18), 300) if fam == 'rosso' else (L, min(C * .85, .19), 300 + (H - 300) * .3)
        if scura: L2, C2 = max(L2, .70), C2 * .9
    elif a_ambra:
        L2, C2, H2 = min(max(L + .16, .80), .86), .15, 82
        if scura: C2 *= .9
    elif errore:
        hh = H - 360 if H > 300 else H
        L2, C2, H2 = L, min(C * .9, .21), 14 + (hh - 22) * .3
        if scura: L2, C2 = max(L2, .72), C2 * .7
    elif fam == 'rosso':                            # corallo (caso normale del rosso)
        hh = H - 360 if H > 300 else H
        L2 = L + (.02 if L <= .78 else .01)
        C2 = C * (.72 if L <= .78 else .85); H2 = 38 + (hh - 22) * .3
        if scura:
            if C >= .10: L2 = max(L2, .68)
            C2 *= .9
    elif fam == 'arancio':                          # arancio -> ambra
        L2, C2, H2 = max(L, .78), C * .95, 70 + (H - 33) * .3
        if scura: L2, C2 = min(L2, .86), C2 * .9
    elif fam == 'ambra':
        L2 = L + (.02 if L < .78 else 0); C2 = min(C * .95, .16); H2 = 80 + (H - 80) * .35
        if scura: L2, C2 = min(L2, .86), C2 * .9
    elif fam == 'verde':
        L2, C2, H2 = L, min(C * .85, .145), 168 + (H - 150) * .3
        if scura: L2, C2 = max(L2, .70), C2 * .9
    elif fam == 'blu':
        L2 = L + (.02 if L < .30 else 0); C2 = min(C * .96, .21); H2 = 262 + (H - 262) * .35
        if scura:
            if C >= .12 and L2 < .60: L2 = .60 - (.60 - L2) * .25      # blu saturati: non spariscono sul fondo
            if C < .12: C2, H2 = C * .75, 265                          # lastre blu scuro: come le superfici dell'interfaccia
    elif fam == 'viola':
        L2, C2, H2 = L, min(C * .85, .19), 300 + (H - 300) * .3
        if scura: L2, C2 = max(L2, .70), C2 * .9
    # 2. quantizzazione: L a passi di 0,02, C a passi di 0,01 (elimina i doppioni a 1-2 unita)
    out = lch_a_hex(round(L2 / .02) * .02, round(C2 / .01) * .01, H2)
    # 3. (solo variante chiara) aggancio ai token: se un blu cade entro DeltaE 2,5 dal blu d'azione, diventa quel token
    if fam == 'blu' and not scura:
        for tok in ('#2563EB', '#1D4ED8'):
            if _dE(out, tok) <= 2.5: return tok
    return out

```

### 6.7 Immagini raster (sezione 5)

Le operazioni sono in OKLCH, pixel per pixel (L, C, H come sopra). Se si lavora con filtri CSS al posto di una rielaborazione dei file, valgono gli equivalenti indicati; i file sorgente restano da rigenerare solo se si vuole il risultato esatto.

**`hero/scena-chiara.webp`** (dominanti: `#ADB5D0` H 272 C 0,039; `#DFDCE4` H 303 C 0,011; `#F5F6F6` H 197; `#EBEDF4` H 273; `#C4D4EF`; `#40619F` H 262 C 0,107). Il difetto è un'ombreggiatura lavanda-violetta nei grigi (H 272-303) e un bianco ciano (H 197), mentre il cielo della landing e il blu dell'interfaccia stanno a H 258-263.
- Pixel con C < 0,06 e H tra 265 e 310: H' = 262 + (H - 262) × 0,25 (272 -> 264,5; 303 -> 272); C' = C × 1,25 (minimo 0,012).
- Pixel quasi neutri (C < 0,012, L > 0,90): H = 262, C = 0,010 (il `#F5F6F6` diventa circa `#F5F7FC`).
- Pixel con C ≥ 0,10 (i blu pieni): H' = 262 + (H - 262) × 0,35, C invariata.
- Luminosità: L' = L + 0,02 per L tra 0,55 e 0,85; i bianchi sopra 0,95 non si toccano.
- Equivalente CSS approssimato: `filter: hue-rotate(-5deg) saturate(1.05) brightness(1.02)`.

**`hero/scena-scura.webp`** (dominanti: `#1C3777` L 0,356 C 0,115; `#122357` L 0,277 C 0,097; `#2D4B8E`; `#325498`; `#214590` C 0,131; `#959AA8`). Il difetto è la croma: C 0,10-0,13 contro C 0,033-0,05 delle superfici scure (fondo `#0A101F`): la scena è un blocco blu elettrico su un fondo spento, non un tema scuro coerente.
- Pixel con C ≥ 0,08: C' = C × 0,72, H' = 265 (`#214590` -> C 0,094).
- Ombre: L' = max(L; 0,22), cioè mai sotto il livello della superficie `#111A2E`, per non creare buchi neri.
- Luci (`#959AA8`, L 0,687): L' = 0,74, C' = 0,03, H' = 265.
- Nessun pixel sopra L 0,93.
- Bordi: maschera sfumata di 24 px verso `#0A101F` su tutti i lati, così non c'è stacco col fondo.
- Equivalente CSS approssimato: `filter: saturate(0.72) brightness(1.02)` più una sovrapposizione `linear-gradient` di `#0A101F` ai bordi.

**`landing/banner-edificio.webp`** (dominanti: `#5E5F64`, `#313641`, `#9B846F` H 64 C 0,041, `#A49790` H 50, `#697C99` H 259, `#BFAB9C` H 59). È una fotografia con un dominante marrone-beige caldo (C 0,02-0,04) accanto a blu freddi: due temperature che non si parlano.
- Chiaro: pixel con H 40-80 e C < 0,06: C' = C × 0,6 e H' = 75 (il beige si raffredda quasi a grigio caldo, richiamo della luce ambra della landing); ombre L < 0,45: H' = 265 e C' = max(C; 0,02) (ombre blu); L' = L + 0,02. Equivalente CSS: `filter: saturate(0.75) contrast(1.02)`.
- Scuro: stesse operazioni, poi L' = L × 0,85 e C' = C × 0,85 (luminosità media sotto 0,45), più una sovrapposizione `linear-gradient(to top, rgba(10, 16, 31, 0.55), rgba(10, 16, 31, 0.15))`. Equivalente CSS: `filter: brightness(0.82) saturate(0.7)`.

**`landing/cta-fondo.webp`** (dominanti: `#C2D3F0`, `#163885` L 0,367 C 0,135 H 263, `#3760BA`, `#FEFAEF` L 0,985 C 0,015 H 90, `#E7EAF5`, `#8495C3` H 269). È già coerente (blu a H 261-269 più un bianco caldo).
- Chiaro: pixel con H 266-272 e C ≥ 0,03: H' = 264. Il bianco caldo `#FEFAEF` si alza di croma (C 0,015 -> 0,030, H 92), così richiama `luce` (`#FFF6D2`). Il resto invariato.
- Scuro: L' = L × 0,88 per L > 0,70 (il bianco caldo passa a circa `#E8E1CD`, mai bianco puro), C' = C × 0,85, e una sovrapposizione di `#0A101F` al 20%. Equivalente CSS: `filter: brightness(0.86) saturate(0.88)`.

---

## 7. Controlli finali da fare dopo l'applicazione

1. **Contrasto, tutte le coppie della tabella della sezione 3, entrambi i temi**, misurate sui colori calcolati del browser (non sull'esadecimale scritto): testo e testo semantico ≥ 4,5:1; numeri grandi ≥ 3:1; `bordo-campo` ≥ 3:1 su superficie, superficie-2 e fondo; ogni `*-pieno` col suo `*-su` ≥ 4,5:1.
2. **Coppie che nel codice non sono nella tabella**: ogni testo che sta su `azione-tinta`, `basso-tinta`, `errore-tinta`, `medio-tinta`, `alto-tinta`, `viola-tinta`, sia `testo` sia `testo-tenue` (devono fare ≥ 4,5:1: misurati 5,07-6,29:1); il testo sopra gli sfondi della landing (`cielo-*`, `blocco-*`) in entrambi i temi.
3. **Daltonismo**: simulare deuteranopia, protanopia e tritanopia sulle schermate con le fasce (probabilità, misuratore, cronologia dei test) e verificare che ogni fascia sia riconoscibile da parola e da forma, non solo da colore. Misurare ΔE tra i tre riempimenti simulati (attesi: deuteranopia ≥ 10, protanopia ≥ 9, grigi ≥ 6) e confermare che nessuna schermata ponga corallo e verde-acqua adiacenti senza etichetta o separatore.
4. **Scala di grigi**: schermata dei risultati in grigi; deve restare leggibile con le sole parole e forme.
5. **Il rosso resta raro**: cercare nel codice e nelle illustrazioni ogni valore con H tra 345 e 33 e C > 0,10. Ammessi solo i token `errore*` e le illustrazioni dell'elenco errore (6.3). Nessun rosso nella schermata del risultato, nel misuratore, nella landing prima della sezione errori.
6. **Cerchio delle tinte**: estrarre tutti i colori con C > 0,05 dall'interfaccia, dalla landing e dalle illustrazioni e verificare che ogni tinta cada in una delle sei bande (errore 8-22, corallo 28-46, ambra 66-92, verde-acqua 160-175, blu 250-270, viola 288-305). Zero colori fuori banda.
7. **Doppioni**: rieseguire l'inventario; nessuna coppia di token distinti con ΔE < 2 (eccezioni dichiarate: i valori scuri uguali di `x`, `x-numero`, `x-pieno`, e `lastra-fianco` = `lastra-3`, `muro-1` = `cielo-basso`, `muro-2` = `gradino-fronte`, `pagina-da` = `cielo-basso`, `marchio` = `azione`, che sono alias voluti). Nelle illustrazioni, bianchi distinti ≤ 3 per variante e colori distinti ≤ 246 (chiara) e ≤ 240 (scura).
8. **Tema scuro**: tutte le tinte di fascia nella schermata scura devono avere tinta riconoscibile (corallo, ambra, verde-acqua, viola, rosa-rosso) e ΔE tra le tre tinte `basso-tinta`, `medio-tinta`, `alto-tinta` ≥ 4 (misurato 4,2 / 6,9 / 9,7; prima 1,5-2,1). Nessun pixel sopra L 0,95 in grandi aree; nessun colore dei componenti scritto a mano rimasto chiaro nello scuro.
9. **Illustrazioni sui due sfondi**: guardare a occhio, a 400 e 1280 px, le 17 con rossi (elenco in 1 e 6.3), le sfere e gli stati, su fondo chiaro `#F7F9FD` e scuro `#0A101F`. Controllare che nessun blu saturo sparisca sul fondo scuro (contrasto minimo grafico ≥ 3:1 per i contorni principali), che nessuna coppia corallo-blu vibri, e che i gradienti non siano diventati piatti dove deve esserci volume 3D (se succede, riportare il passo di quantizzazione a L 0,01 solo per quell'illustrazione).
10. **Raster**: confrontare le 4 immagini prima/dopo in chiaro e scuro; hero chiaro e cielo della landing devono sembrare dello stesso blu (H 262 ± 5); la scena scura non deve staccarsi dal fondo ai bordi.
11. **Console e struttura**: 0 errori; nessun esadecimale rimasto nei componenti (ricerca di `#[0-9A-Fa-f]{6}` in `src/screens`, `src/components`: ammessi solo file di token e illustrazioni).
