// Controlla contenuti/corsi/corsi-polimi.json: esce con codice 1 se ci sono errori.
// Uso: node contenuti/strumenti/valida-corsi.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ORIGINE = path.join(RADICE, 'contenuti', 'corsi', 'corsi-polimi.json');

const errori = [];
const err = (m) => errori.push(m);
const LIVELLI = ['triennale', 'magistrale', 'ciclo-unico'];
const LINGUE = ['it', 'en', 'it-en'];
const nonVuota = (s) => typeof s === 'string' && s.trim().length > 0;
const urlUfficiale = (s) => nonVuota(s) && /^https:\/\/([a-z0-9-]+\.)*polimi\.it\//.test(s);

let dati;
try { dati = JSON.parse(fs.readFileSync(ORIGINE, 'utf8')); } catch (e) {
  console.error(`corsi-polimi.json non leggibile: ${e.message}`);
  process.exit(1);
}

if (!/^\d{4}\/\d{2}$/.test(dati.versione ?? '')) err('versione: atteso AAAA/AA (es. 2026/27)');
if (!/^\d{4}-\d{2}-\d{2}$/.test(dati.verificatoIl ?? '')) err('verificatoIl: atteso AAAA-MM-GG');
for (const k of ['scuole', 'sedi', 'corsi', 'inEsaurimento', 'dubbi', 'fonti']) {
  if (!Array.isArray(dati[k])) err(`${k}: deve essere un array`);
}
if (errori.length) { for (const e of errori) console.error('ERRORE', e); process.exit(1); }

const unici = (nome, elenco, chiave = 'id') => {
  const visti = new Set();
  for (const x of elenco) {
    if (!nonVuota(x[chiave])) { err(`${nome}: voce senza ${chiave}: ${JSON.stringify(x).slice(0, 80)}`); continue; }
    if (visti.has(x[chiave])) err(`${nome}: id duplicato «${x[chiave]}»`);
    visti.add(x[chiave]);
  }
  return visti;
};

const idScuole = unici('scuole', dati.scuole);
const idSedi = unici('sedi', dati.sedi);
unici('corsi', dati.corsi);
unici('inEsaurimento', dati.inEsaurimento);
const sedePerId = new Map(dati.sedi.map((s) => [s.id, s]));
const scuolaPerId = new Map(dati.scuole.map((s) => [s.id, s]));

for (const s of dati.scuole) {
  if (!nonVuota(s.nome) || !nonVuota(s.sigla)) err(`scuola ${s.id}: nome e sigla obbligatori`);
  if (!Array.isArray(s.sedi) || !s.sedi.length) err(`scuola ${s.id}: sedi vuote`);
  for (const sd of s.sedi ?? []) if (!idSedi.has(sd)) err(`scuola ${s.id}: sede inesistente «${sd}»`);
}
for (const s of dati.sedi) {
  if (!nonVuota(s.nome) || !nonVuota(s.citta)) err(`sede ${s.id}: nome e citta obbligatori`);
  if (typeof s.attiva !== 'boolean') err(`sede ${s.id}: attiva deve essere true/false`);
  if (typeof s.nota !== 'string') err(`sede ${s.id}: nota deve essere una stringa (anche vuota)`);
}

const chiaviViste = new Set();
for (const c of dati.corsi) {
  const ref = `corso ${c.id}`;
  if (!nonVuota(c.nome)) err(`${ref}: nome mancante`);
  if (!idScuole.has(c.scuola)) err(`${ref}: scuola inesistente «${c.scuola}»`);
  if (!idSedi.has(c.sede)) err(`${ref}: sede inesistente «${c.sede}»`);
  else if (!sedePerId.get(c.sede).attiva) err(`${ref}: sede inattiva «${c.sede}» (un corso attivo non può stare in una sede inattiva)`);
  if (scuolaPerId.has(c.scuola) && !scuolaPerId.get(c.scuola).sedi.includes(c.sede)) err(`${ref}: la scuola ${c.scuola} non elenca la sede ${c.sede}`);
  if (!LIVELLI.includes(c.livello)) err(`${ref}: livello non valido «${c.livello}»`);
  if (!Number.isInteger(c.anni) || c.anni < 1 || c.anni > 6) err(`${ref}: anni non valido «${c.anni}»`);
  if (c.livello === 'triennale' && c.anni !== 3) err(`${ref}: una triennale dura 3 anni`);
  if (c.livello === 'magistrale' && c.anni !== 2) err(`${ref}: una magistrale dura 2 anni`);
  if (c.livello === 'ciclo-unico' && c.anni < 5) err(`${ref}: un ciclo unico dura almeno 5 anni`);
  if (!LINGUE.includes(c.lingua)) err(`${ref}: lingua non valida «${c.lingua}»`);
  if (!urlUfficiale(c.fonte)) err(`${ref}: fonte mancante o non ufficiale (polimi.it): ${c.fonte}`);
  const chiave = `${c.nome}|${c.livello}|${c.sede}`;
  if (chiaviViste.has(chiave)) err(`${ref}: stesso nome, livello e sede già presenti (${chiave})`);
  chiaviViste.add(chiave);
}
for (const c of dati.inEsaurimento) {
  const ref = `inEsaurimento ${c.id}`;
  if (!idScuole.has(c.scuola)) err(`${ref}: scuola inesistente «${c.scuola}»`);
  if (!idSedi.has(c.sede)) err(`${ref}: sede inesistente «${c.sede}»`);
  if (!LIVELLI.includes(c.livello)) err(`${ref}: livello non valido`);
  if (!Array.isArray(c.anniAttivi) || !c.anniAttivi.length) err(`${ref}: anniAttivi vuoto`);
  if (!urlUfficiale(c.fonte)) err(`${ref}: fonte mancante o non ufficiale`);
}

// nessuna sede attiva senza corsi (e nessuna scuola senza corsi nelle sedi che elenca)
for (const s of dati.sedi) {
  if (s.attiva && !dati.corsi.some((c) => c.sede === s.id)) err(`sede ${s.id}: attiva ma senza corsi`);
}
for (const s of dati.scuole) {
  for (const sd of s.sedi ?? []) {
    if (!dati.corsi.some((c) => c.scuola === s.id && c.sede === sd)) err(`scuola ${s.id}: elenca la sede ${sd} ma lì non ha corsi`);
  }
}
if (!dati.fonti.length || !dati.fonti.every(urlUfficiale)) err('fonti: elenco vuoto o con URL non ufficiali');

// ---------- riepilogo ----------
const conta = (elenco, f) => elenco.reduce((m, x) => m.set(f(x), (m.get(f(x)) ?? 0) + 1), new Map());
const riga = (m) => [...m].map(([k, v]) => `${k}: ${v}`).join(' · ');
console.log(`Corsi Politecnico di Milano ${dati.versione} (verificati il ${dati.verificatoIl})`);
console.log(`  sedi attive: ${dati.sedi.filter((s) => s.attiva).length} di ${dati.sedi.length}; scuole: ${dati.scuole.length}`);
console.log(`  voci corso (una per sede): ${dati.corsi.length}; in esaurimento: ${dati.inEsaurimento.length}; dubbi: ${dati.dubbi.length}`);
console.log(`  per scuola:  ${riga(conta(dati.corsi, (c) => c.scuola))}`);
console.log(`  per sede:    ${riga(conta(dati.corsi, (c) => c.sede))}`);
console.log(`  per livello: ${riga(conta(dati.corsi, (c) => c.livello))}`);
for (const s of dati.scuole) {
  console.log(`  ${s.sigla}: ${riga(conta(dati.corsi.filter((c) => c.scuola === s.id), (c) => `${c.sede}/${c.livello}`))}`);
}

if (errori.length) {
  for (const e of errori) console.error('ERRORE', e);
  console.error(`\n${errori.length} errori.`);
  process.exit(1);
}
console.log('OK: nessun errore.');
