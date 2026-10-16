-- ATLAS: iscrizioni raccolte dalle app Project (nome, email PoliMi, consensi) e limite di richieste.
-- Compatibile con 0001: le tabelle esistenti non perdono righe né colonne.

-- Iscrizioni. L'email è l'identificatore (minuscola, già normalizzata dal Worker).
-- email_verificata resta 0 finché ATLAS non potrà inviare un codice per posta: oggi si controlla solo il dominio.
CREATE TABLE IF NOT EXISTS signups (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  email                   TEXT NOT NULL UNIQUE,
  nome                    TEXT NOT NULL,
  app_id                  TEXT NOT NULL,
  corso                   TEXT,
  sede                    TEXT,
  provenienza             TEXT,
  consenso_noi            INTEGER NOT NULL DEFAULT 0 CHECK (consenso_noi IN (0, 1)),
  consenso_atlas          INTEGER NOT NULL DEFAULT 0 CHECK (consenso_atlas IN (0, 1)),
  consenso_comunicazioni  INTEGER NOT NULL DEFAULT 0 CHECK (consenso_comunicazioni IN (0, 1)),
  consent_version         TEXT NOT NULL,
  email_verificata        INTEGER NOT NULL DEFAULT 0 CHECK (email_verificata IN (0, 1)),
  account_id              TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  created_at              INTEGER NOT NULL,
  updated_at              INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_signups_account ON signups (account_id);
CREATE INDEX IF NOT EXISTS idx_signups_created ON signups (created_at);
CREATE INDEX IF NOT EXISTS idx_signups_comunicazioni ON signups (consenso_comunicazioni);

-- Email PoliMi indicata da chi ha il Project ID (serve a collegare l'iscrizione, anche se arriva dopo)
ALTER TABLE accounts ADD COLUMN polimi_email TEXT;
CREATE INDEX IF NOT EXISTS idx_accounts_polimi_email ON accounts (polimi_email);

-- Il registro dei consensi deve poter descrivere anche chi non ha un account: account_id diventa facoltativo
-- e si aggiunge signup_id (una delle due è obbligatoria). SQLite non cambia i vincoli sul posto: si ricostruisce
-- la tabella copiando tutte le righe e gli id esistenti.
CREATE TABLE consent_log_nuova (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id      TEXT REFERENCES accounts(id) ON DELETE CASCADE,
  signup_id       INTEGER REFERENCES signups(id) ON DELETE CASCADE,
  app_id          TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('grant', 'update', 'revoke')),
  scopes          TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  created_at      INTEGER NOT NULL,
  CHECK (account_id IS NOT NULL OR signup_id IS NOT NULL)
);
INSERT INTO consent_log_nuova (id, account_id, app_id, action, scopes, consent_version, created_at)
  SELECT id, account_id, app_id, action, scopes, consent_version, created_at FROM consent_log;
DROP TABLE consent_log;
ALTER TABLE consent_log_nuova RENAME TO consent_log;
CREATE INDEX IF NOT EXISTS idx_consent_log_account ON consent_log (account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_consent_log_signup ON consent_log (signup_id, created_at);

-- Limite di richieste con finestra scorrevole: una riga per richiesta, tolta dopo un'ora.
-- key = "<rotta>:<impronta dell'IP>" (l'IP non è memorizzato in chiaro).
CREATE TABLE IF NOT EXISTS rate_limit (
  key TEXT NOT NULL,
  ts  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_key ON rate_limit (key, ts);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ts ON rate_limit (ts);
