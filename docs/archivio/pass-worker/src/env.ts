export interface Env {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
  ALLOWED_ORIGINS: string; // elenco separato da virgole, oppure *
  PAYMENTS_ENABLED: string; // 'true' per accendere /v1/checkout
  LAUNCH_UNTIL: string; // AAAA-MM-GG, compreso
  PRICE_CENTS: string;
  LAUNCH_PRICE_CENTS: string;
  EMAIL_FROM?: string;

  // Segreti: `wrangler secret put`. Mai nel file di configurazione.
  STRIPE_SECRET?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  EMAIL_API_KEY?: string;

  // Opzionali
  DAILY_LIMIT?: string;    // richieste al giorno per identita' (default 600)
  IP_DAILY_LIMIT?: string; // richieste al giorno per indirizzo (default 3000)

  // Solo sviluppo locale (.dev.vars). Mai in produzione.
  ALLOW_TEST_TOKENS?: string; // accetta token "test:<uid>:<email>[:unverified]"
  ALLOW_SHORT_EXAMS?: string; // consente esami con meno di 30 domande (banco di prova)
  DEV_RETURN_CODE?: string;   // restituisce il codice di verifica email invece di inviarlo
}
