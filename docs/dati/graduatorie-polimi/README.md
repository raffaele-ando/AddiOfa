# Analisi graduatorie Polimi 2021-2026

Analisi aggregata dei dati `PoliNetworkOrg/rankings-data` (cartella `data/output/rankings`, un JSON per graduatoria).
Contiene **solo statistiche aggregate**: nessun ID, data di nascita o riga individuale.

Rigenerare le tabelle: `python3 analisi.py <percorso>/data/output/rankings`

## Struttura dei dati
- Una graduatoria per scuola (Ingegneria, Architettura, Design, Urbanistica) e fase; ogni riga = un candidato.
- Campi: `id` (hash anonimo, stabile tra le graduatorie dello stesso anno), `birthDate`, `position`, `canEnroll`,
  `courses` (corsi e ammissione per corso), `result`, `englishResult`, `sectionsResults`, `ofa` (`ENG`, `TEST`).
- Negli HTML originali la colonna "Matricola" contiene un codice mascherato (es. `TI5581`), non la matricola reale
  né il codice persona. Il codice 11155511 non compare in nessun file.

## Metodo
- Ammesso = `canEnroll = true` in almeno una graduatoria dell'anno; conteggio per **ID unico** (doppioni esclusi).
- Verifica incrociata con chiave (scuola, nascita, punteggi): +2-3%, quindi il conteggio per ID è coerente.
- Nelle tabelle OFA ogni studente è preso dalla prima graduatoria in cui è ammesso; per questo i valori possono
  differire di pochi decimi da quelli calcolati "OFA in almeno una graduatoria".
- Gli ammessi non sono gli immatricolati effettivi (dato assente).

## Risultati principali
| Anno | Candidati | Ammessi | % | Ing | Arch | Design | Urb | Extra-UE | % OFA (qualsiasi) |
|---|---|---|---|---|---|---|---|---|---|
| 2021 | 9.347 | 5.179 | 55,4 | 3.205 | 1.346 | 480 | 148 | 213 | 24,9 |
| 2022 | 11.574 | 6.075 | 52,5 | 3.440 | 1.459 | 1.004 | 172 | 209 | 31,7 |
| 2023 | 10.525 | 5.892 | 56,0 | 3.390 | 1.390 | 949 | 163 | 194 | 35,7 |
| 2024 | 11.062 | 6.442 | 58,2 | 3.890 | 1.467 | 983 | 102 | 174 | 25,0 |
| 2025 | 11.594 | 7.982 | 68,8 | 6.187 | 1.467 | 192 | 136 | 276 | 21,3 |
| 2026 | 14.162 | 9.686 | 68,4 | 7.115 | 1.396 | 1.034 | 141 | 948 | 21,9 |

- **Doppioni 2026**: 13.072 righe di ammessi → 9.686 persone; 1.925 in più graduatorie, 1.041 in più corsi, 264 in più scuole.
- **Fase**: dove indicata, la maggioranza entra in seconda fase; gli scorrimenti aggiungono poche centinaia di persone.
- **Test (Ingegneria)**: Matematica media ammessi 45,5 (2021) → 39,2 (2025); 2024 su scala dimezzata, 2026 senza sezioni.
- **Soglie 2026**: più alte Civil Engineering (86), Engineering Science (77,4), Aerospaziale (71,4); la maggior parte
  dei corsi di Ingegneria ≈ 30 (minimo per superare il test).
- **OFA ENG**: 21-25% degli ammessi dal 2022. Chi lo ha prende ~20 in `englishResult` contro ~27, 4-5 punti in meno
  in Matematica, è più spesso ≥20 anni e (2021-23) ha più spesso anche OFA TEST.
- **OFA ENG per corso**: sempre alto in Produzione Industriale, Elettrica, Informatica Online, Civile, Edile-Architettura,
  Architettura (25-40%); basso in Biomedica, Matematica, Design Comunicazione/Moda (<15%). Nei corsi in inglese
  (86-100%) indica probabilmente certificazione mancante, non preparazione scarsa.

## Limiti dei dati
- 2020: un solo record. Design 2025 (192) incompleto. Extra-UE 2026 anomalo (948).
- OFA TEST non registrato dal 2024. Dato OFA mancante per ~30% degli ammessi 2021 e 2026.
- Punteggi totali su scale diverse tra scuole/fasi: medie solo indicative.

## Tabelle (`tabelle/`)
01 trend ammessi · 02 doppioni · 03 fase di prima ammissione · 04 sezioni test Ingegneria · 05 OFA totale ·
06 confronto con/senza OFA ENG · 07 OFA ENG per corso e anno · 08 corsi 2026 · 09 sedi 2026 · 10 età 2026 · 11 soglie 2026
