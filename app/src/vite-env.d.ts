/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 'demo' = versione dimostrativa a file unico; 'prod' = versione vera con server (vedi .env.example). */
  readonly VITE_MODE?: 'demo' | 'prod';
  readonly VITE_API_URL?: string;
  readonly VITE_STRIPE_LINK?: string;
  readonly VITE_PAYMENTS_ENABLED?: string;
  readonly VITE_ATLAS_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
