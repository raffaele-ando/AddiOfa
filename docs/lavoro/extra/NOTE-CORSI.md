# NOTE-CORSI: elenco dei corsi del Politecnico di Milano, a.a. 2026/27

Agente CORSI. Verificato il 17/10/2026 sulle pagine ufficiali di polimi.it (le pagine rispondevano: nessun problema di rete tranne il sito della Scuola ICAT, vedi sotto).

## Cosa c'è

| Percorso | Cosa è |
|---|---|
| `contenuti/corsi/corsi-polimi.json` | La fonte: scuole, sedi, corsi (una voce per sede), `inEsaurimento`, `dubbi`, `fonti` |
| `contenuti/strumenti/valida-corsi.mjs` | `npm run contenuti:corsi:valida` (id unici, riferimenti, nessuna sede attiva senza corsi, nessun corso senza fonte, riepilogo) |
| `contenuti/strumenti/genera-corsi.mjs` | `npm run contenuti:corsi` scrive `app/src/data/corsi.ts` (GENERATO) |
| `app/src/data/corsi.ts` | Tipi `Scuola`, `Sede`, `Corso`, `Livello`, dati e funzioni `sediDellaScuola`, `livelliDisponibili`, `corsiDisponibili`, `anniDelCorso` (escludono sempre le sedi inattive) |
| `app/tests/unit/corsi.test.ts` | 9 prove (passano) |

Campi in più rispetto allo schema chiesto, tutti facoltativi o di servizio: `nota` sul corso (partner, corso online), `nota` sempre presente sulla sede, `VERSIONE_CORSI` e `CORSI_VERIFICATI_IL` esportati. Gli `id` dei corsi sono `slug-nome-lt|lm|cu-sede` (esempio `ingegneria-gestionale-lt-cremona`).

## Numeri

- Elenco ufficiale: 29 corsi di laurea (triennali e a ciclo unico) e 45 lauree magistrali. Come voci per sede: 34 triennali, 3 a ciclo unico, 52 magistrali, in tutto 89 (una in più dell'elenco ufficiale: Ingegneria Informatica online, vedi dubbi).
- Controllo meccanico: tutte le coppie corso-sede dell'elenco ufficiale (36 per triennali e ciclo unico, 52 per magistrali) sono nel JSON; l'unica voce in più è Ingegneria Informatica online.
- Sedi attive: 7 (Milano Leonardo, Milano Bovisa, Cremona, Lecco, Mantova, Piacenza, «Università partner»). Inattiva: 1 (Xi'an).
- Voci per scuola: 3I (Ing. Industriale e dell'Informazione) 57, AUIC 14, Design 12, ICAT 6.
- Voci per sede: Leonardo 40, Bovisa 24, Piacenza 7, Lecco 6, Cremona 5, partner 5, Mantova 2.
- Per scuola, sede e livello:
  - 3I: Leonardo 11 tri + 1 cu + 16 mag; Bovisa 5 tri + 8 mag; Cremona 3 tri + 2 mag; Piacenza 2 tri + 2 mag; Lecco 1 tri + 1 mag; partner 1 cu + 4 mag.
  - ICAT: Leonardo 2 tri + 3 mag; Lecco 1 mag.
  - AUIC: Leonardo 3 tri + 4 mag; Piacenza 1 tri + 2 mag; Mantova 1 tri + 1 mag; Lecco 1 cu + 1 mag.
  - Design: Bovisa 4 tri + 7 mag; Lecco 1 tri (Interaction Design).
- Novità 2026/27 visibili negli elenchi: Engineering Science, Industrial Engineering (Piacenza), Process Engineering (Cremona), Interaction Design (Lecco) sono solo nel nuovo ordinamento 96/23.

## Sedi inattive o ambigue

- Xi'an (XJTU-POLIMI International Campus): è nell'elenco «Sedi» del sito ma nessuna laurea o laurea magistrale la indica come campus. Marcata `attiva: false`, non compare nella scelta guidata.
- Nessun'altra sede dell'elenco 2026/27 è chiusa. Sedi o corsi chiusi in anni precedenti (per esempio i poli che non compaiono più) non sono stati cercati nell'archivio: non è stato possibile confrontare con il 2025/26 (vedi non verificato).
- Mantova ha solo Architettura (triennale Progettazione dell'Architettura e magistrale Architectural Design and History). Lecco: nessuna triennale di Ingegneria Meccanica, Civile o Gestionale nel 2026/27 (non sono negli elenchi).

## Corsi in esaurimento

`inEsaurimento` è vuoto: negli elenchi delle Scuole 3I, AUIC e Design ogni corso «ord. 270» (coorti già iscritte, anni 2 e 3 nel 2026/27) ha lo stesso nome e la stessa sede di un corso «ord. 96/23», quindi non c'è un corso interamente disattivato. È un cambio di ordinamento, non una chiusura. Per ICAT non è stato possibile fare lo stesso confronto.

## Dubbi (stessi del JSON, campo `dubbi`)

Ingegneria Informatica online (150 posti nel bando, nessuna scheda propria), MEDTEC (livello «Laurea» 6 anni nella scheda, ma testo da ciclo unico; si iscrive via Humanitas), sedi di Engineering Science (pagina: Leonardo e Bovisa; Scuola e bando: solo Leonardo/Città Studi) e di Music and Acoustic Engineering (pagina: Leonardo e Cremona; Scuola: solo Cremona), assegnazione a ICAT di Geoinformatics Engineering (la pagina cita ICAT e 3I), assegnazione ad AUIC di Management of Built Environment (cita AUIC e 3I), lingue per sede di Progettazione dell'Architettura, significato di «partner» (quattro atenei diversi: Humanitas, Statale, Bocconi, San Raffaele).

## Non verificato

- Sito della Scuola ICAT (www.icat.polimi.it): connessione rifiutata dal proxy; i corsi ICAT vengono dalle schede su polimi.it, non dal loro elenco.
- Offerta 2025/26 e archivi (web.archive.org irraggiungibile): niente confronto storico.
- Manifesti degli studi, curricula e orientamenti: non letti. Ogni corso è una voce per nome e sede, non per curriculum. Anni = durata legale della scheda, non l'elenco degli insegnamenti.
- Posti disponibili e date dei bandi: non rilevanti per la scelta e non riportati.
- Il bando Magistrali 2026/27 non è stato letto (le sedi e le lingue delle magistrali vengono dalle schede dei corsi).
- Sigle delle scuole (3I, ICAT, AUIC, Design): `3I` è la sigla comune della Scuola di Ingegneria Industriale e dell'Informazione, non letta come tale su una pagina letta qui.

## Come si aggiorna

Cambiare `contenuti/corsi/corsi-polimi.json` (aggiornare `versione` e `verificatoIl`), poi `npm run contenuti:corsi:valida && npm run contenuti:corsi`, poi `npm test` nell'app. L'altro agente (interfaccia di registrazione) deve importare da `app/src/data/corsi.ts`; esiste anche `app/src/lib/progetto/corsi.ts` scritto da altri, che non ho toccato.
