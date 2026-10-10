#!/usr/bin/env node
/**
 * Controlli automatici su un banco di domande a risposta multipla.
 *
 * Uso: node audit_bank.cjs <file.json | file.ts | file.js>
 *
 * Accetta un array di oggetti con almeno: id, prompt, options[], correctIndex, explanation.
 * Campi opzionali usati nelle statistiche: category, topic | grammarTopic, level, core.
 * Per .ts/.js estrae il primo array letterale assegnato con `= [`.
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Uso: node audit_bank.cjs <file.json|file.ts|file.js>');
  process.exit(1);
}

function load(p) {
  const raw = fs.readFileSync(p, 'utf8');
  if (path.extname(p) === '.json') return JSON.parse(raw);
  const start = raw.search(/=\s*\[/);
  if (start === -1) throw new Error('Nessun array "= [" trovato nel file');
  let i = raw.indexOf('[', start), depth = 0, inStr = null, esc = false;
  for (let j = i; j < raw.length; j++) {
    const c = raw[j];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') inStr = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) {
      return Function('"use strict";return (' + raw.slice(i, j + 1) + ')')();
    }
  }
  throw new Error('Array non chiuso');
}

const qs = load(file);
const out = [];
const warn = [];
const log = (s = '') => out.push(s);
const pct = (n, d) => (d ? ((100 * n) / d).toFixed(1) + '%' : '-');
const norm = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
const count = (f) => {
  const m = {};
  qs.forEach((q) => { const k = f(q) ?? '(mancante)'; m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};

log(`# Audit banco domande: ${path.basename(file)}`);
log(`Totale domande: ${qs.length}`);

// Struttura
const ids = count((q) => q.id).filter(([, n]) => n > 1);
if (ids.length) warn.push(`ID duplicati: ${ids.map(([k]) => k).join(', ')}`);
const mcq = qs.filter((q) => Array.isArray(q.options));
const badIdx = mcq.filter((q) => !(q.correctIndex >= 0 && q.correctIndex < q.options.length));
if (badIdx.length) warn.push(`correctIndex non valido: ${badIdx.map((q) => q.id).join(', ')}`);
const dupOpt = mcq.filter((q) => new Set(q.options.map(norm)).size !== q.options.length);
if (dupOpt.length) warn.push(`Opzioni ripetute nella stessa domanda: ${dupOpt.map((q) => q.id).join(', ')}`);
const noExp = qs.filter((q) => !q.explanation || !String(q.explanation).trim());
if (noExp.length) warn.push(`Senza spiegazione: ${noExp.map((q) => q.id).join(', ')}`);
const shortExp = qs.filter((q) => q.explanation && String(q.explanation).trim().length < 25);
if (shortExp.length) warn.push(`Spiegazioni molto brevi (<25 caratteri): ${shortExp.length} (es. ${shortExp.slice(0, 8).map((q) => q.id).join(', ')})`);
const backslash = qs.filter((q) => /\\['"]/.test(q.prompt + (q.options || []).join('') + q.explanation));
if (backslash.length) warn.push(`Barre rovesciate visibili (es. That\\'s): ${backslash.map((q) => q.id).join(', ')}`);

// Distribuzioni
log('\n## Distribuzioni');
log('Categoria: ' + count((q) => q.category).map(([k, n]) => `${k} ${n}`).join(' · '));
log('Livello: ' + count((q) => q.level).map(([k, n]) => `${k} ${n}`).join(' · '));
const topics = count((q) => q.topic ?? q.grammarTopic);
log(`Argomenti (${topics.length}): ` + topics.map(([k, n]) => `${k} ${n}`).join(' · '));
const thin = topics.filter(([, n]) => n < 5);
if (thin.length) warn.push(`Argomenti con meno di 5 domande: ${thin.map(([k, n]) => `${k} (${n})`).join(', ')}`);
const core = qs.filter((q) => q.core).length;
log(`Nucleo (core: true): ${core || 'campo non usato'}`);

// Indizi involontari
if (mcq.length) {
  log('\n## Indizi involontari (risposta multipla)');
  const pos = {};
  mcq.forEach((q) => { pos[q.correctIndex] = (pos[q.correctIndex] || 0) + 1; });
  log('Posizione della risposta giusta: ' + Object.keys(pos).sort().map((k) => `${'ABCDEFG'[k]} ${pct(pos[k], mcq.length)}`).join(' · '));
  const maxPos = Math.max(...Object.values(pos)) / mcq.length;
  if (maxPos > 0.4) warn.push(`Sbilanciamento di posizione: una lettera è giusta nel ${(maxPos * 100).toFixed(0)}% dei casi. Rimescola il sorgente e le opzioni a video.`);
  let longest = 0, shortest = 0;
  mcq.forEach((q) => {
    const L = q.options.map((o) => String(o).length);
    const mx = Math.max(...L), mn = Math.min(...L);
    if (L[q.correctIndex] === mx && L.filter((l) => l === mx).length === 1) longest++;
    if (L[q.correctIndex] === mn && L.filter((l) => l === mn).length === 1) shortest++;
  });
  log(`Giusta = unica opzione più lunga: ${pct(longest, mcq.length)} · più corta: ${pct(shortest, mcq.length)} (atteso intorno o sotto il 25%)`);
  if (longest / mcq.length > 0.35) warn.push('La risposta giusta tende a essere la più lunga: rendi i distrattori altrettanto elaborati.');
}

// Duplicati e quasi duplicati
const stop = new Set('the a an is are was were do does did have has had in on at to for of with choose correct sentence translation which complete translate and or but if by from as about il lo la i gli le un una di da con su per tra fra e o che'.split(' '));
const tok = (s) => new Set(String(s).toLowerCase().replace(/[^\p{L}\p{N}\s]|_/gu, '').split(/\s+/).filter((w) => w && !stop.has(w)));
const toks = qs.map((q) => tok(q.prompt));
const pairs = [];
for (let i = 0; i < qs.length; i++) {
  for (let j = i + 1; j < qs.length; j++) {
    const A = toks[i], B = toks[j];
    if (!A.size || !B.size) continue;
    let inter = 0; for (const w of A) if (B.has(w)) inter++;
    const s = inter / (A.size + B.size - inter);
    if (s >= 0.7) pairs.push(`${qs[i].id}~${qs[j].id} (${s.toFixed(2)})`);
  }
}
log('\n## Duplicati');
log(pairs.length ? `Coppie quasi identiche (Jaccard ≥ 0,7): ${pairs.length}\n${pairs.join(', ')}` : 'Nessuna coppia quasi identica.');
if (pairs.length) warn.push(`${pairs.length} coppie di domande quasi identiche: unificale o differenziale.`);

log('\n## Da sistemare');
log(warn.length ? warn.map((w) => '- ' + w).join('\n') : '- Nessun problema strutturale trovato.');
log('\nRicorda: lo script non verifica se le risposte sono giuste o se i distrattori sono davvero sbagliati. Serve comunque la rilettura domanda per domanda (vedi references/banco-domande.md).');

console.log(out.join('\n'));
