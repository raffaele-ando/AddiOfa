-- AddiOFA Pass: utenti, Pass (entitlement), ordini, domande servite dal server, esami, inviti.
-- Le date sono in millisecondi (INTEGER); i JSON sono TEXT.

-- Un utente e' un account Firebase (auth_uid) oppure un dispositivo anonimo (device_id, salvato come hash SHA-256).
CREATE TABLE IF NOT EXISTS users (
  id             TEXT PRIMARY KEY,           -- es. U-7K3QX9AB2CDE: e' il client_reference_id di Stripe
  auth_uid       TEXT UNIQUE,
  device_id      TEXT UNIQUE,
  email          TEXT,                       -- email del login Firebase (verificata)
  verified_email TEXT UNIQUE,                -- email @mail.polimi.it verificata col codice: conta una sola volta
  verified_at    INTEGER,
  diag_seconds   INTEGER,                    -- durata massima dichiarata del diagnostico (serve solo agli inviti)
  created_at     INTEGER NOT NULL
);

-- Il Pass: una riga per ogni concessione. Vale se expires_at e' nel futuro.
CREATE TABLE IF NOT EXISTS entitlements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source     TEXT NOT NULL CHECK (source IN ('stripe', 'invite', 'manual')),
  starts_at  INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  order_id   TEXT,                           -- ordine Stripe che l'ha generato (idempotenza del webhook)
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_entitlements_user ON entitlements (user_id, expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_entitlements_order ON entitlements (order_id);
-- Un solo Pass gratuito per invito per utente
CREATE UNIQUE INDEX IF NOT EXISTS uq_entitlements_invite ON entitlements (user_id) WHERE source = 'invite';

-- Ordini: restano anche se l'utente cancella l'account (obbligo fiscale), staccati dall'utente.
CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,         -- id della sessione Stripe Checkout (cs_...)
  user_id          TEXT REFERENCES users(id) ON DELETE SET NULL,
  stripe_event_id  TEXT UNIQUE,
  amount_cents     INTEGER NOT NULL,
  currency         TEXT NOT NULL,
  email            TEXT,
  consent_ts       INTEGER,                  -- accettazione dei termini
  waiver_ts        INTEGER,                  -- consenso a iniziare subito e rinuncia al recesso
  created_at       INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);

CREATE TABLE IF NOT EXISTS waitlist (
  email      TEXT PRIMARY KEY,               -- minuscola: una riga per email
  audience   TEXT NOT NULL CHECK (audience IN ('recupero', 'prevenzione')),
  consent_ts INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS invites (
  code       TEXT PRIMARY KEY,               -- OFA-XXXXXX
  inviter_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL
);
-- Un invitato puo' usare un solo codice
CREATE TABLE IF NOT EXISTS invite_uses (
  invitee_id  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code        TEXT NOT NULL REFERENCES invites(code) ON DELETE CASCADE,
  redeemed_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_invite_uses_code ON invite_uses (code);

-- Codici a 6 cifre per verificare l'email Polimi: si salva solo l'hash, validi 10 minuti
CREATE TABLE IF NOT EXISTS email_verifications (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  code_hash  TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts   INTEGER NOT NULL DEFAULT 0,
  used_at    INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user ON email_verifications (user_id, created_at);

-- Simulazioni: risposte esatte e mescolamento delle opzioni restano qui, mai verso il client
CREATE TABLE IF NOT EXISTS exams (
  id             TEXT PRIMARY KEY,
  user_id        TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  format         TEXT NOT NULL,
  started_at     INTEGER NOT NULL,
  questions      TEXT NOT NULL,              -- JSON: [{id, options:[...mescolate], correct}]
  submitted_at   INTEGER,
  elapsed_client INTEGER,                    -- secondi dichiarati dall'app (il server usa i suoi orologi)
  result         TEXT                        -- JSON dell'ExamResult
);
CREATE INDEX IF NOT EXISTS idx_exams_user ON exams (user_id, started_at);

CREATE TABLE IF NOT EXISTS withdrawals (
  id         TEXT PRIMARY KEY,               -- REC-XXXXXX, e' la ricevuta
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  order_ref  TEXT,
  created_at INTEGER NOT NULL
);

-- Statistiche aggregate per giorno: nessun identificativo
CREATE TABLE IF NOT EXISTS events (
  day    TEXT NOT NULL,                      -- YYYY-MM-DD (UTC)
  name   TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',           -- es. 'ente:pass', 'recupero'
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, name, detail)
);

-- Limite giornaliero: user_id e' l'id utente oppure 'ip:<ambito>:<hash giornaliero>'
CREATE TABLE IF NOT EXISTS usage (
  day     TEXT NOT NULL,
  user_id TEXT NOT NULL,
  n       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, user_id)
);

-- Il banco domande: lo riempie il generatore dei contenuti con pass/seed.sql
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  prompt TEXT NOT NULL,
  options TEXT NOT NULL,
  extra_option TEXT,
  correct_index INTEGER NOT NULL,
  explanation_it TEXT NOT NULL,
  theory_id TEXT,
  category TEXT NOT NULL,
  level TEXT,
  grammar_topic TEXT,
  core INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_questions_core ON questions (core);
