-- ATLAS: percorso di studi nelle iscrizioni (scuola, livello, anno). Compatibile con 0002:
-- solo colonne nuove e facoltative, le righe esistenti restano com'erano (NULL = non indicato).
-- `sede`, `corso` e `provenienza` esistono già; da ora il Worker accetta per sede e provenienza un id breve (a-z0-9-),
-- ma i valori già salvati (testo libero) non vengono toccati.

ALTER TABLE signups ADD COLUMN scuola  TEXT;     -- ing-ind-inf | icat | auic | design (controllato dal Worker)
ALTER TABLE signups ADD COLUMN livello TEXT;     -- triennale | magistrale | ciclo-unico
ALTER TABLE signups ADD COLUMN anno    INTEGER;  -- 1-6

CREATE INDEX IF NOT EXISTS idx_signups_scuola  ON signups (scuola);
CREATE INDEX IF NOT EXISTS idx_signups_livello ON signups (livello);
CREATE INDEX IF NOT EXISTS idx_signups_corso   ON signups (corso);
