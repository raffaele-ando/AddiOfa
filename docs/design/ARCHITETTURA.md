# Architettura dell'app: «Home completa» (struttura n. 9 delle dieci proposte, 17/10)

L'utente voleva: la Home ospita lezioni e simulazione; le altre due pagine hanno funzioni diverse tra loro; le statistiche stanno nel profilo (la Home mostra già come cambi); il profilo è un hub a tessere. Le dieci proposte sono confrontate nella pagina generata da `tools/make-opzioni-10.py` (pubblicata come Artifact). Fra le dieci, la 9 è quella che segue meglio «in Home puoi inserire simulazioni e lezioni con le funzioni attuali»; si cambia struttura cambiando `Navigazione.tsx`, il tipo `Scheda` e `vaiScheda` in `App.tsx`.

## 1. Destinazioni

| Destinazione | Domanda a cui risponde | Contiene (e SOLO qui) |
|---|---|---|
| **Home** (scheda) | Come sto andando e cosa faccio adesso? | misuratore della probabilità (+ ⓘ per il calcolo), fascia di stato, UN ▶ (Continua; per chi è nuovo, Diagnostico), **Lezioni** (prossime tre, «Tutte» → Percorso), **Simulazione** (ultimo risultato, ▶, «Tutte» → elenco), andamento delle stime |
| **Esercizi** (scheda) | Mi alleno | ▶ Intelligente, Punti deboli (ripasso errori compreso), Blitz, Richiamo, Per argomento; **Frasi**; **Prontuario** |
| **Sfide** (scheda) | Gioco con altri | Oggi (sfida del giorno, duello con link, link ricevuto, storico), Amici, Classifica (locale e NOI quando ATLAS è collegato) |
| **Profilo** (icona in alto a destra, su ogni pagina) | Io | hub a tessere: **Progressi** (panoramica, argomenti, calendario), **Obiettivi**, **Badge**, **Progetto** (Project ID, ATLAS, NOI, Agorà); Aiuto (FAQ, Segnala); Informazioni (presentazione, termini, privacy, cookie); ingranaggio → Impostazioni (tema, suoni, importa/esporta, cancella i dati, versione) |

Regole: una funzione, un posto; le statistiche solo nel profilo; la barra non ha voci per statistiche; frecce di ritorno a sinistra del titolo; ogni schermata somiglia al suo concept (`docs/design/CATALOGO-SCHERMATE.md`) e usa le illustrazioni del piano d'uso (`docs/design/ILLUSTRAZIONI.md`); le icone stanno su barra, righe, pulsanti e selettori.

## 2. Mappa delle schermate (id)

- Schede: `home` (`components/Menu.tsx`), `esercizi` (`screens/Esercizi.tsx`), `sfide` (extra). Barra attiva per le pagine aperte da una scheda (campo `barra` del registro).
- Home → `percorso`, `lezione-dettaglio`, `simulazioni`, `simulazione-dettaglio`, `theory` (lettore), simulazione in corso (`ExamMode`), esito.
- Esercizi → `learn` (sessione), `frasi`, `cheatsheet`.
- Sfide → `sfide`, `sfida-gioco`, `sfida-risultato`, `sfida-accetta` (`?sfida=`), `amici`, `classifica`, `condividi`.
- Profilo → `profilo`, `profilo-modifica`, `progressi`, `obiettivi`, `badge`, `esplora` e area Progetto (`projectid`, `atlas-analisi`, `noi`, `agora`), `faq`, `segnala`, Impostazioni, `legal`.
- Ingresso → landing (`?landing`), onboarding con registrazione (nome, email PoliMi, corso, consensi), diagnostico, calcolo, risultato; stati `stato-vuoto`, `offline`, `splash`.

## 3. Testo e icone
Titolo di 1-2 parole, etichette di 1-2 parole, spiegazioni solo dietro ⓘ, pulsanti con verbo o icona; stati vuoti: illustrazione + 2-4 parole; errori ≤ 8 parole. `python3 tools/controlla-testo.py` segnala i blocchi lunghi fuori da `data-testo-ok`. Icone: lucide via `<Icona>`, registro per area in `app/src/brand/icone/registro/*.json`, `node tools/genera-icone.mjs` blocca le icone usate per due funzioni.
