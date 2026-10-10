# Lavorare con più agenti

Le 41 illustrazioni del metodo 6 sono state fatte da 4 agenti in parallelo (10 ciascuno). Cosa si è
imparato.

## Cosa ha funzionato

- **Istruzioni complete e autonome**: cosa leggere prima (la guida, un esempio finito con la sua
  tavola), l'elenco esatto dei file, il ciclo "disegna → controlla → guarda la tavola → correggi" con
  un limite di giri, le regole (solo i propri file, niente git, non toccare gli strumenti, un comando
  pesante alla volta: 4 CPU condivise), e il formato del resoconto finale.
- **Un file di misure per disegno** (`<nome>.misure.json`) invece di un indice condiviso: quattro
  agenti che scrivono lo stesso JSON si cancellano a vicenda.
- **Ripresa dopo il blocco**: i quattro agenti si sono fermati per il limite di sessione dell'API;
  ripresi con un messaggio ("controlla cosa hai già fatto, tieni quello e continua") hanno perso zero
  lavoro, perché lo stato era nei file.
- **Resoconti con i problemi degli strumenti**: gli agenti hanno trovato difetti veri
  (`riempi_maglie.py` non vedeva i tratti ereditati dai gruppi, filtri tagliati sulle forme sottili,
  `rx` negativi), poi corretti nello strumento.

## Cosa è andato storto

- **Metodo non validato prima di scalare**: 40 disegni fatti bene secondo le istruzioni, ma le
  istruzioni portavano a copiare i difetti dell'AI. Da rifare. Ora: tre esempi di tipo diverso,
  approvati dall'utente, poi gli agenti (01-giudizio §5).
- **Strumenti che deformano**: un ottimizzatore che muove ogni punto da solo va bene per una scena
  parametrica (il logo), male per forme libere; gli agenti hanno dovuto combatterlo.
- **Criterio sbagliato**: "scarto < 4/255" come obiettivo ha spinto a copiare. L'obiettivo deve
  essere "stessa illustrazione, fatta bene", con l'ingombro come controllo e la tavola da guardare.

## Modello di istruzioni per il ridisegno pulito

Da usare solo dopo che i tre esempi sono approvati:

> Leggi `strumenti/brand/STILE.md`, `sapere/03-illustrazioni.md` e i generatori di esempio in
> `strumenti/brand/illustrazioni/` con le loro tavole in `brand/tavole/puliti/`. Per ognuna delle
> tue illustrazioni: guarda l'originale, scrivi i difetti AI da correggere, scrivi il generatore
> `strumenti/brand/illustrazioni/<nome>.py` usando `geometria.py` e `oggetti.py` (aggiungi lì gli
> oggetti nuovi che servono ad altri), lancialo, controlla con `controlla_disegno.py` e guarda la
> tavola; correggi al massimo 4 volte. Non usare `adatta_svg.py` né `riempi_maglie.py`. Solo i tuoi
> file, niente git. Resoconto: difetti corretti, cosa resta imperfetto, IoU.

## Secondo giro (ridisegno pulito, 38 illustrazioni)

Fatto dopo l'approvazione dei tre esempi, con il modello di istruzioni qui sopra: tutte accettate
al primo controllo. Cosa è successo:

- **Collisioni di nomi**: un agente ha sovrascritto il generatore `quiz_test.py` di un altro (lo
  strumento di scrittura non l'ha impedito). Il disegno era salvo; il generatore è stato rifatto
  (`blu_quiz_test.py`) e verificato identico al byte. Da allora: prefissi per kit (`blu_`, `rosso_`,
  `stato_`) fissati **nelle istruzioni**, e ogni agente lavora in una sottocartella sua dello
  scratchpad (anche i file temporanei si sono sovrascritti).
- **IoU sotto 0,8** in 6 casi, tutti spiegati: l'originale ha residui bianchi opachi o buchi che il
  disegno pulito non copia (celebrazione, quiz rosso, ricerca). L'IoU è un controllo, non un obiettivo.
- **Oggetti comuni** costruiti una volta per famiglia (foglio con badge, clessidra, fumetto) rendono
  coerenti gli stati tra loro: da chiedere sempre quando più illustrazioni condividono parti.
