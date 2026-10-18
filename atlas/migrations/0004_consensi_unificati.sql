-- ATLAS: un solo modello di consenso, e solo per ciò che esiste davvero (docs/design/PRIVACY-LEGGE.md).
--  - La raccolta anonima all'avvio (tabella `signups`) non esiste più: nessuna riga viene più scritta, le colonne che non servono a nessuna funzione
--    si tolgono (scuola, livello, anno, corso, sede, provenienza, consenso_atlas: mai usate in produzione, il Worker non era pubblicato).
--    La tabella e le sue righe, se ce ne fossero, restano finché l'autore non le cancella (atlas/DEPLOY.md §7).
--  - L'email PoliMi non si salva più sul server (la verifica con link vale sul dispositivo): `accounts.polimi_email` si toglie.
--  - Le comunicazioni sono un consenso dell'account (casella dentro Project ID, indirizzo qualunque, conferma con link):
--    indirizzo, stato ('in-attesa' | 'confermato') e data. La conferma richiede l'invio di un'email, che non esiste: lo stato resta 'in-attesa'
--    e nessun messaggio parte. La prova del consenso sta nel registro unico `consent_log` (una sola versione del testo, CONSENT_VERSION).

DROP INDEX IF EXISTS idx_signups_scuola;
DROP INDEX IF EXISTS idx_signups_livello;
DROP INDEX IF EXISTS idx_signups_corso;
ALTER TABLE signups DROP COLUMN scuola;
ALTER TABLE signups DROP COLUMN livello;
ALTER TABLE signups DROP COLUMN anno;
ALTER TABLE signups DROP COLUMN corso;
ALTER TABLE signups DROP COLUMN sede;
ALTER TABLE signups DROP COLUMN provenienza;
ALTER TABLE signups DROP COLUMN consenso_atlas;

DROP INDEX IF EXISTS idx_accounts_polimi_email;
ALTER TABLE accounts DROP COLUMN polimi_email;

ALTER TABLE accounts ADD COLUMN comunicazioni_email TEXT;
ALTER TABLE accounts ADD COLUMN comunicazioni_stato TEXT;
ALTER TABLE accounts ADD COLUMN comunicazioni_at    INTEGER;
CREATE INDEX IF NOT EXISTS idx_accounts_comunicazioni ON accounts (comunicazioni_stato);
