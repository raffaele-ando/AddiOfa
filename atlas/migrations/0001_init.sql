-- ATLAS: account Project ID, collegamenti tra app con consenso, classifica NOI

CREATE TABLE IF NOT EXISTS accounts (
  id           TEXT PRIMARY KEY,            -- Project ID pubblico, es. PRJ-7K3QX9
  auth_uid     TEXT NOT NULL UNIQUE,        -- uid del provider di login (Firebase / Google)
  email        TEXT,
  display_name TEXT NOT NULL,
  handle       TEXT NOT NULL UNIQUE,        -- @nome visibile in classifica, minuscolo
  avatar_url   TEXT,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS apps (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT NOT NULL
);

INSERT OR IGNORE INTO apps (id, name, description) VALUES
  ('addiofa', 'AddiOFA', 'Preparazione all''OFA di Inglese'),
  ('noi', 'NOI', 'Classifiche e community delle app Project');

-- Un collegamento app ↔ account esiste solo dopo il consenso; scopes è un array JSON
CREATE TABLE IF NOT EXISTS app_links (
  account_id      TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  app_id          TEXT NOT NULL REFERENCES apps(id),
  scopes          TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  granted_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL,
  PRIMARY KEY (account_id, app_id)
);

-- Registro di ogni concessione, modifica o revoca (prova del consenso)
CREATE TABLE IF NOT EXISTS consent_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id      TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  app_id          TEXT NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('grant', 'update', 'revoke')),
  scopes          TEXT NOT NULL,
  consent_version TEXT NOT NULL,
  created_at      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS noi_scores (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  app_id     TEXT NOT NULL REFERENCES apps(id),
  score      INTEGER NOT NULL,
  mastered   INTEGER NOT NULL,
  best_sim   INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, app_id)
);

CREATE INDEX IF NOT EXISTS idx_noi_scores_rank ON noi_scores (app_id, score DESC, updated_at ASC);
CREATE INDEX IF NOT EXISTS idx_consent_log_account ON consent_log (account_id, created_at);
