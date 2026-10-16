# Colore e gerarchia: area SFIDE (agente COLORE-B, 16/10)

File toccati: `app/src/screens/extra/sfide/*` (comuni, Sfide, Classifica, Amici, SfidaGioco, SfidaRisultato, SfidaAccetta, FoglioCondividi, AccessoSbloccato) e `app/src/screens/Invites.tsx`. Nessuna modifica a `ui.tsx`, `index.css`, `lib/sfide`. Screenshot prima/dopo e confronti con i concept in `docs/lavoro/extra/colore/sfide/` (`prima-*`, `dopo-*`, `flusso-*`, `confronto-*.png`).

## Regole usate in tutta l'area
- Duello = corallo (tessera Swords, righe dello storico). Sfida del giorno = verde (UN solo blocco tinto nell'hub). Tempo = ambra (orologio, timer). Tu = blu (avatar, bordo della tua colonna, tua riga). Primo in classifica = ambra con corona. Badge/Classifica NOI/Correzioni = viola.
- Esiti: vinto verde, pari ambra, perso corallo smorzato (tinta chiara, titolo navy: «Hai perso 6 a 8» non è un errore). Frasi con punteggio («Hai vinto 8 a 6», «Pari, 7 a 7», «Hai vinto per tempo»).
- Un solo bottone blu pieno per schermata; gli altri a contorno o solo testo.
- Le tre schede sono pillole (attiva blu pieno) e ogni scheda ha il suo sottotitolo: Sfide «Una sfida al giorno e i duelli con gli amici…», Classifica «Media di risposte giuste nei duelli…», Amici «Il saldo dei duelli, persona per persona».

## Per schermata
- **sfide**: carta verde del giorno con tessera e orologio ambra; «Sfida un amico» neutra con tessera corallo, bottone secondario finché la sfida del giorno non è fatta (poi diventa primario); «Hai ricevuto una sfida?» ridotta a una riga (campo + «Apri», prima etichetta e segnaposto ripetevano lo stesso testo e il bottone era a tutta larghezza); storico con tessera verde (giorno) o corallo (duello), «8 a 6» al posto di «lui 6/10».
- **classifica**: podio dal terzo in poi (primo ambra + corona, gli altri neutri); l'elenco riprende dal quarto: nessuno compare due volte (prima podio ed elenco ripetevano le stesse persone). Con 2 persone solo l'elenco, il primo con la corona. Avatar a tono stabile per nome (viola/verde/ambra/corallo; il blu è solo «tu»). «Classifica NOI»: tessera viola e pillola «Non attiva» a destra del titolo (non più doppia nel testo).
- **amici**: avatar a tono per persona; saldo con solo le voci non nulle (vinti verde, pari ambra, persi corallo); «In attesa di risposta» non più una carta ambra per duello ma righe neutre con clessidra ambra.
- **sfida-gioco**: intro con tre dati su tessere colorate (domande blu, tempo ambra, correzioni viola) e un solo elenco di due note; durante la prova timer ambra (corallo sotto il minuto), barra = posizione (1/10) e pallini = risposte date, «Consegna» in testata solo finché non sei all'ultima domanda (prima c'erano due «Consegna» insieme), pillola del tipo (verde giorno / corallo duello). Errore: tessera corallo e testo navy.
- **sfida-risultato**: un solo blocco tinto: l'esito (verde/ambra/corallo) con i due risultati affiancati (il tuo con bordo blu), oppure il tuo risultato (verde per il giorno, neutro per il duello in attesa) + avviso ambra «In attesa dell'amico». Via l'illustrazione ripetuta. «Fatto» è primario solo se non c'è «Condividi il link».
- **sfida-accetta**: tre regole con tessere (blu domande, ambra tempo, corallo regola), niente sottotitolo che ripete il corpo; messaggi: corallo link non valido, ambra domande diverse, blu «È la tua sfida»; «Vai alle sfide» primario solo se è l'unica azione. La risposta dell'amico usa lo stesso pannello esito.
- **condividi / foglio**: un colore per canale (WhatsApp verde, Telegram blu, Messaggi viola), «Altre app» e «Copia link» neutri.
- **accesso-sbloccato**: lo stato vero resta la carta verde; lo stato «non ancora» ha il regalo ambra (premio) e una barra verde «Compagni verificati: n su 3», «Torna alla home» solo testo.
- **Inviti**: passi con icone colorate (condividi blu, email verde, Pass ambra) al posto dei tre numeri blu; i tre «Compagno N / In attesa…» uguali sostituiti da un percorso a tre tappe (verde quando verificato, come R7); «Usa il codice» a contorno e «Torna all'app» solo testo (erano tre pieni blu); titoli sulla scala 26/15,5.

## Prove (numeri onesti)
- `npx tsc --noEmit` pulito; `npm test` dalla radice: 217 test verdi (non ho aggiunto test: nessuna logica pura nuova in `lib`).
- Playwright su Chromium, porta 5212: stato ricco (sfida del giorno + 5 duelli: vinto, perso, pari, in attesa) e vuoto; 400 px chiaro e scuro per hub, classifica, amici, risultato (vinto/perso/pari/attesa/giorno), accetta (+errore, «tua», «già giocata»), pronto, gioco, ultimo minuto, dialogo di consegna, condividi, foglio, accesso (vero e non vero), Inviti; 1280 px chiaro e scuro per hub, classifica, amici, risultato, pronto e gioco. Screenshot riletti a occhio.
- Flusso del duello a due browser (A sfida, B accetta e gioca, B manda la risposta, A la apre): funziona; B che riapre il link → «Hai già giocato», A che apre il proprio → «È la tua sfida»; amici e classifica aggiornati (Marta 1 duello, 1 perso). Zero errori in console nel flusso, scrollWidth = clientWidth a 400 e 1280.
- Contrasto misurato in pagina (testo ≥ 4,5:1, grande ≥ 3:1) su tutte le schermate sopra, chiaro e scuro: 0 violazioni.
- Una volta un 500 transitorio su `landing/Passi.tsx` (file di un altro agente in scrittura): non mio, sparito.
- Non provato: `build:demo` e `npm run check` (vietati dal brief), Safari/iOS, `navigator.share` su dispositivo, il timer coral a 0:50 è stato forzato spostando `Date.now`.

## Cosa manca / richieste
- Nessun colore nuovo richiesto a `index.css`/`ui.tsx`. `Carta` locale (`comuni.tsx`) ora accetta tutti i toni di `Tono`; se `ui.tsx` ne esponesse una uguale si potrebbe togliere.
- Il podio mostra solo nome e percentuale (il tempo medio sta nell'elenco dal 4° in poi).
- L'avviso demo di Inviti resta ambra (unico blocco tinto in basso) e non è stato ridisegnato.
- Non ho confrontato 05/30 in dettaglio: i riferimenti sono 06, 22, 34 e R7 (`confronto-*.png`).
