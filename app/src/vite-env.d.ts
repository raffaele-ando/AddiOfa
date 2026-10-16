/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Impostata a 'demo' solo da vite.demo.config.ts (build a file unico, `npm run build:demo`): le immagini restano incorporate nel file. Nel sito normale è assente. */
  readonly VITE_MODE?: 'demo';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
