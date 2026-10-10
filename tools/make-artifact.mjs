// Trasforma dist-demo/index.html (build "demo" a file unico) nel formato dell'Artifact:
// niente <!doctype>/<html>/<head>/<body>, <title> in cima, stile e script incorporati.
// Uso: node tools/make-artifact.mjs   → app/dist-demo/artifact.html
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = resolve(radice, 'app/dist-demo');
const html = readFileSync(resolve(dir, 'index.html'), 'utf8');

const titolo = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'AddiOFA';
// Si legge l'HTML per posizione e non con regex sull'intero testo: il JavaScript incorporato contiene stringhe come "<script".
const inizioModulo = html.indexOf('<script type="module"');
if (inizioModulo < 0) throw new Error('nessuno script module nel build: eseguire prima npm run build:demo');
const testa = html.slice(0, inizioModulo);
const corpoModulo = html.slice(html.indexOf('>', inizioModulo) + 1, html.lastIndexOf('</script>'));
const resto = html.slice(html.lastIndexOf('</script>'));
const stili = [...(testa + resto).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const classici = [...testa.matchAll(/<script(?![^>]*type="module")[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const moduli = [corpoModulo];

// Il tema chiaro/scuro del visualizzatore arriva da data-theme sulla radice (o da prefers-color-scheme).
const tema = `(function () {
  try {
    var d = document.documentElement, t = d.getAttribute('data-theme'), s = null;
    try { s = localStorage.getItem('theme'); } catch (e) {}
    var scuro = t ? t === 'dark' : (s ? s === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
    d.classList.toggle('dark', scuro);
  } catch (e) {}
})();`;

const uscita = [
  `<title>${titolo}</title>`,
  `<style>${stili}</style>`,
  `<script>${tema}</script>`,
  ...classici.filter(c => !/localStorage\.getItem\('theme'\)/.test(c)).map(c => `<script>${c}</script>`),
  '<div id="root"></div>',
  ...moduli.map(m => `<script type="module">${m}</script>`),
].join('\n');

const file = resolve(dir, 'artifact.html');
writeFileSync(file, uscita);
const mb = (uscita.length / 1048576).toFixed(2);
console.log(`${file}: ${mb} MB`);
if (uscita.length > 16 * 1048576) { console.error('troppo grande per un Artifact (16 MB)'); process.exit(1); }
