// Esegue i sorgenti TypeScript dell'app così come sono, senza dipendenze nuove (esbuild c'è già in app/):
// import senza estensione (come in Vite), import di soli tipi tolti, `import.meta.env` vuoto.
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { transformSync } = require('../../node_modules/esbuild');

export async function resolve(specifier, context, next) {
  if ((specifier.startsWith('./') || specifier.startsWith('../')) && !/\.[cm]?[jt]sx?$|\.json$/.test(specifier) && context.parentURL) {
    for (const suffisso of ['.ts', '/index.ts']) {
      const url = new URL(specifier + suffisso, context.parentURL);
      if (existsSync(fileURLToPath(url))) return next(url.href, context);
    }
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (url.startsWith('file:') && url.endsWith('.ts') && !url.includes('/node_modules/')) {
    const sorgente = readFileSync(fileURLToPath(url), 'utf8');
    const { code } = transformSync(sorgente, {
      loader: 'ts', format: 'esm', target: 'es2022', sourcefile: fileURLToPath(url),
      define: { 'import.meta.env': '{}' },
    });
    return { format: 'module', source: code, shortCircuit: true };
  }
  return next(url, context);
}
