// Una funzione = un'icona, un'immagine = un significato: i controlli che si possono fare sui dati (il resto lo fa tools/genera-icone.mjs e la lettura degli usi).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BADGE } from '../../src/lib/profilo/badge';
import { ICONE } from '../../src/brand/icone/nomi.generato';
import { FAMIGLIE } from '../../src/lib/studio/famiglie';
import { normalizzaProfilo } from '../../src/lib/profilo/dati';

test('ogni badge ha la sua icona: esiste nel registro, non è di un altro badge e nessun altro nome la riusa', () => {
  const nomi = BADGE.map(b => b.icona);
  assert.equal(new Set(nomi).size, BADGE.length, 'due badge con la stessa icona');
  for (const n of nomi) assert.ok(n in ICONE, `icona assente dal registro: ${n}`);
  const lucide = nomi.map(n => ICONE[n]);
  const tutte = Object.values(ICONE);
  for (const l of lucide) assert.equal(tutte.filter(x => x === l).length, 1, `l'icona ${l} è usata da più di un nome`);
  assert.deepEqual(nomi.filter(n => !n.startsWith('badge-')), [], 'le icone dei badge si chiamano badge-<id>');
});

test('i nomi del registro non puntano mai alla stessa icona lucide', () => {
  const valori = Object.values(ICONE);
  assert.equal(new Set(valori).size, valori.length);
});

test('le famiglie di lezioni sono solo raggruppamenti: nessuna immagine', () => {
  for (const f of FAMIGLIE) assert.equal('illustrazione' in f, false);
});

test('un profilo salvato con un avatar illustrato si legge senza errori e torna alla lettera', () => {
  const p = normalizzaProfilo({ nome: 'Luca', avatar: 'cappello-laurea-orologio', corso: '' });
  assert.deepEqual(p, { nome: 'Luca', corso: '' });
});

test('le sorgenti dell\'app non danno più illustrazioni ai badge né agli avatar', () => {
  const badge = readFileSync(new URL('../../src/lib/profilo/badge.ts', import.meta.url), 'utf8');
  assert.equal(/illustrazione:\s*['"]/.test(badge), false);
});
