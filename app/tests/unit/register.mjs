// Permette a `node --test` di eseguire i sorgenti TypeScript dell'app così come sono:
// import senza estensione (come in Vite) e `import.meta.env` (che fuori da Vite non esiste).
import { register } from 'node:module';
register('./loader.mjs', import.meta.url);
