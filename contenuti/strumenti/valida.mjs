// Controlla contenuti/: esce con codice 1 se ci sono errori. Uso: node contenuti/strumenti/valida.mjs [--finale]
//   --finale: prima della pubblicazione; anche le domande ancora 'da-riscrivere' e le schede mancanti diventano errori.
import path from 'node:path';
import {
  DIR_DOMANDE, DIR_TEORIA, SOGLIA_SIMILARITA, fileBlocchi, leggiJson, leggiDomande, leggiSpiegazioni, leggiArgomenti,
  leggiSchedeTeoria, somiglianzaDomande, numeroId, duplicataDi, idCanonico,
} from './lib.mjs';

const finale = process.argv.includes('--finale');
const errori = [];
const avvisi = [];
const err = (m) => errori.push(m);
const avv = (m) => avvisi.push(m);

const REFUSI = ["dcn't", 'raning', 'Saras']; // refusi noti da ricopiatura (stato_app.md §1.4)
const CATEGORIE = new Set(['Grammatica', 'Traduzione']);
const LIVELLI = new Set(['A1', 'A2', 'B1']);
const STATI = new Set(['originale', 'da-riscrivere', 'riscritta', 'rivista']);
// Confronto delle opzioni: solo maiuscole e spazi; apostrofi e punteggiatura contano (dogs / dogs' sono opzioni diverse).
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const nonVuota = (s) => typeof s === 'string' && s.trim().length > 0;

// ---------- lettura ----------
let argomenti = [];
try { argomenti = leggiArgomenti(); } catch (e) { err(`teoria/argomenti.json non leggibile: ${e.message}`); }
const nomiArgomenti = new Set(argomenti.map((a) => a.grammarTopic));

const domande = [];
const fileDomande = fileBlocchi(DIR_DOMANDE);
if (!fileDomande.length) err('contenuti/domande/ non ha blocchi qNNN-qMMM.json');
for (const f of fileDomande) {
  const nome = path.basename(f);
  const [, da, a] = nome.match(/^q(\d+)-q(\d+)\.json$/);
  let blocco;
  try { blocco = leggiJson(f); } catch (e) { err(`${nome}: JSON non valido (${e.message})`); continue; }
  if (!Array.isArray(blocco)) { err(`${nome}: deve essere un array`); continue; }
  for (const q of blocco) {
    domande.push(q);
    const n = numeroId(q.id);
    if (!(n >= Number(da) && n <= Number(a))) err(`${q.id}: sta nel file ${nome} ma l'id è fuori dall'intervallo`);
  }
}

// ---------- id ----------
const perId = new Map();
for (const q of domande) {
  if (typeof q.id !== 'string' || !/^q[1-9]\d*$/.test(q.id)) { err(`id non valido: ${JSON.stringify(q.id)} (atteso q1, q2, ...)`); continue; }
  if (perId.has(q.id)) err(`${q.id}: id duplicato`);
  perId.set(q.id, q);
}
const massimo = Math.max(0, ...[...perId.keys()].map(numeroId));
const buchi = [];
for (let i = 1; i <= massimo; i++) if (!perId.has('q' + i)) buchi.push('q' + i);
if (buchi.length) err(`id mancanti (buchi): ${buchi.slice(0, 20).join(', ')}${buchi.length > 20 ? '...' : ''}`);

// ---------- singole domande ----------
const spieg = leggiSpiegazioni();
for (const id of spieg.doppie) err(`${id}: spiegazione presente due volte in spiegazioni/`);
const spiegazioneFinale = (q) => (spieg.mappa[q.id] ?? '').trim() || (q.explanation ?? '');

let conRefusi = 0;
for (const q of domande) {
  const id = q.id;
  const stato = q.stato;
  const sospetta = stato === 'da-riscrivere'; // i difetti di queste sono attesi: si riscrivono
  const problema = (m) => (sospetta && !finale ? avv(`${id} (da riscrivere): ${m}`) : err(`${id}: ${m}`));

  if (!nonVuota(q.prompt)) err(`${id}: prompt vuoto`);
  if (!Array.isArray(q.options) || q.options.length !== 4 || q.options.some((o) => !nonVuota(o))) {
    err(`${id}: servono 4 opzioni non vuote`);
  } else {
    const viste = new Set();
    q.options.forEach((o, i) => {
      const k = norm(o);
      if (viste.has(k)) problema(`opzione ripetuta ("${o}")`);
      viste.add(k);
    });
    if (q.extraOption !== undefined) {
      if (!nonVuota(q.extraOption)) err(`${id}: extraOption vuota`);
      else if (viste.has(norm(q.extraOption))) err(`${id}: extraOption uguale a un'altra opzione ("${q.extraOption}")`);
    }
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) err(`${id}: correctIndex non valido (${q.correctIndex})`);
    else {
      const esatta = norm(q.options[q.correctIndex]);
      const uguali = q.options.filter((o, i) => i !== q.correctIndex && norm(o) === esatta);
      if (uguali.length) problema(`un'opzione è identica alla risposta esatta ("${uguali[0]}")`);
    }
  }
  if (!CATEGORIE.has(q.category)) err(`${id}: category "${q.category}" non ammessa (Grammatica o Traduzione)`);
  if (!LIVELLI.has(q.level)) err(`${id}: level "${q.level}" non ammesso (A1, A2, B1)`);
  if (!nomiArgomenti.has(q.grammarTopic)) err(`${id}: grammarTopic "${q.grammarTopic}" non è in teoria/argomenti.json`);
  if (typeof q.core !== 'boolean') err(`${id}: core deve essere true o false`);
  if (!nonVuota(spiegazioneFinale(q))) err(`${id}: spiegazione vuota`);

  // stato
  const dup = duplicataDi(stato);
  if (dup !== null) {
    if (!perId.has(dup)) err(`${id}: stato "${stato}" punta a una domanda che non esiste`);
    else if (dup === id) err(`${id}: è duplicata di se stessa`);
    else if (duplicataDi(perId.get(dup).stato) !== null) err(`${id}: duplicata di ${dup}, che a sua volta è duplicata (punta alla domanda tenuta)`);
    if (q.core === true) err(`${id}: core true ma segnata come duplicata`);
  } else if (!STATI.has(stato)) err(`${id}: stato "${stato}" non valido`);
  if (q.core === true && stato === 'da-riscrivere') err(`${id}: nel nucleo gratuito non possono stare domande da riscrivere`);

  // refusi
  const testo = [q.prompt, ...(q.options ?? []), q.extraOption ?? '', spiegazioneFinale(q)].join(' \n ');
  for (const r of REFUSI) if (testo.toLowerCase().includes(r.toLowerCase())) { problema(`refuso noto "${r}"`); conRefusi++; }
  if (finale && sospetta) err(`${id}: ancora da riscrivere`);
}
const daRiscrivere = domande.filter((q) => q.stato === 'da-riscrivere').length;

// ---------- spiegazioni ----------
for (const id of Object.keys(spieg.mappa)) {
  const q = perId.get(id);
  if (!q) { err(`spiegazioni/: ${id} non esiste nelle domande`); continue; }
  if (!nonVuota(spieg.mappa[id])) err(`spiegazioni/: ${id} ha una spiegazione vuota`);
  if (duplicataDi(q.stato) !== null) avv(`spiegazioni/: ${id} è una duplicata (spiegazione inutile)`);
}
const nonDup = domande.filter((q) => duplicataDi(q.stato) === null);
const conSpiegazioneIt = nonDup.filter((q) => nonVuota(spieg.mappa[q.id])).length;

// ---------- argomenti ----------
const ids31 = new Set(argomenti.map((a) => a.id));
if (argomenti.length !== 31) err(`argomenti.json: servono 31 argomenti, ce ne sono ${argomenti.length}`);
if (ids31.size !== argomenti.length) err('argomenti.json: slug ripetuti');
const coperti = new Set(nonDup.map((q) => q.grammarTopic));
for (const a of argomenti) {
  if (!coperti.has(a.grammarTopic)) err(`argomento "${a.grammarTopic}" senza domande`);
  const attese = nonDup.filter((q) => q.grammarTopic === a.grammarTopic).map((q) => q.id).sort((x, y) => numeroId(x) - numeroId(y));
  const scritte = [...(a.domande ?? [])].sort((x, y) => numeroId(x) - numeroId(y));
  if (JSON.stringify(attese) !== JSON.stringify(scritte)) err(`argomenti.json: l'elenco domande di "${a.id}" non coincide con le domande (rilancia node contenuti/strumenti/crea-argomenti.mjs)`);
  const nuc = nonDup.filter((q) => q.grammarTopic === a.grammarTopic && q.core).length;
  if (nuc < 3) avv(`nucleo: "${a.grammarTopic}" ha solo ${nuc} domande`);
}

// ---------- nucleo ----------
const nucleo = nonDup.filter((q) => q.core);
if (nucleo.length !== 100) avv(`nucleo: ${nucleo.length} domande (obiettivo 100)`);

// ---------- duplicati ----------
let distinte = new Set();
try {
  for (const c of leggiJson(path.join(DIR_DOMANDE, 'da-rivedere.json'))) if (c.esito === 'distinta') distinte.add(`${c.a.id}/${c.b.id}`);
} catch { avv('da-rivedere.json non trovato: nessuna coppia giudicata'); }
const attive = nonDup.slice().sort((a, b) => numeroId(a.id) - numeroId(b.id));
let nonSegnate = 0;
for (let i = 0; i < attive.length; i++) {
  for (let j = i + 1; j < attive.length; j++) {
    const a = attive[i], b = attive[j];
    if (!Array.isArray(a.options) || !Array.isArray(b.options)) continue;
    const s = somiglianzaDomande(a, b);
    if (s >= SOGLIA_SIMILARITA && !distinte.has(`${a.id}/${b.id}`)) {
      err(`${a.id} e ${b.id} sono quasi doppie (${s.toFixed(2)} >= ${SOGLIA_SIMILARITA}) e non sono segnate: node contenuti/strumenti/trova-duplicati.mjs --applica`);
      nonSegnate++;
    }
  }
}

// ---------- teoria ----------
const schede = leggiSchedeTeoria();
const visteSchede = new Set();
for (const s of schede) {
  const e = (m) => err(`teoria "${s.id}": ${m}`);
  if (!ids31.has(s.id)) { err(`teoria: id "${s.id}" non è in argomenti.json`); continue; }
  if (visteSchede.has(s.id)) e('scheda ripetuta');
  visteSchede.add(s.id);
  const arg = argomenti.find((a) => a.id === s.id);
  if (!nonVuota(s.titolo)) e('titolo vuoto');
  if (!LIVELLI.has(s.livello)) e('livello non valido');
  if (!Array.isArray(s.regola) || !s.regola.length || s.regola.some((r) => !nonVuota(r))) e('regola: serve un elenco di frasi non vuote');
  if (!Array.isArray(s.esempi) || !s.esempi.length || s.esempi.some((x) => !nonVuota(x?.en) || !nonVuota(x?.it))) e('esempi: servono coppie { en, it } non vuote');
  if (!Array.isArray(s.errori) || !s.errori.length || s.errori.some((x) => !nonVuota(x?.sbagliato) || !nonVuota(x?.giusto) || !nonVuota(x?.perche))) e('errori: servono { sbagliato, giusto, perche } non vuoti');
  if (!nonVuota(s.consiglio)) e('consiglio vuoto');
  if (!Array.isArray(s.domande) || s.domande.length !== 3 || new Set(s.domande).size !== 3) e('domande: servono esattamente 3 id diversi');
  else for (const id of s.domande) {
    const q = perId.get(idCanonico(id));
    if (!q || id !== idCanonico(id)) e(`la domanda ${id} non esiste (usa id come q61)`);
    else if (duplicataDi(q.stato) !== null) e(`la domanda ${id} è una duplicata`);
    else if (arg && q.grammarTopic !== arg.grammarTopic) avv(`teoria "${s.id}": la domanda ${id} è di un altro argomento (${q.grammarTopic})`);
  }
}
const mancanti = argomenti.filter((a) => !visteSchede.has(a.id));
if (mancanti.length) (finale ? err : avv)(`${mancanti.length} schede di teoria mancanti`);

// ---------- riepilogo ----------
const per = (f) => nonDup.reduce((m, q) => ((m[f(q)] = (m[f(q)] ?? 0) + 1), m), {});
console.log('Riepilogo');
console.log(`  domande nei file:        ${domande.length} (id fino a q${massimo})`);
console.log(`  duplicate segnate:       ${domande.length - nonDup.length}`);
console.log(`  domande nel banco:       ${nonDup.length}`);
console.log(`  stati:                   ${JSON.stringify(per((q) => q.stato))}`);
console.log(`  nucleo gratuito:         ${nucleo.length} (livelli ${JSON.stringify(nucleo.reduce((m, q) => ((m[q.level] = (m[q.level] ?? 0) + 1), m), {}))})`);
console.log(`  da riscrivere:           ${daRiscrivere}`);
console.log(`  spiegazioni in italiano: ${conSpiegazioneIt}/${nonDup.length}`);
console.log(`  argomenti:               ${argomenti.length} (${coperti.size} coperti da domande)`);
console.log(`  schede di teoria:        ${visteSchede.size}/${argomenti.length}`);
console.log(`  coppie sopra soglia non segnate: ${nonSegnate}`);
console.log(`  errori: ${errori.length}   avvisi: ${avvisi.length}`);
for (const m of avvisi.slice(0, 40)) console.log('  avviso:', m);
if (avvisi.length > 40) console.log(`  ... altri ${avvisi.length - 40} avvisi`);
for (const m of errori.slice(0, 80)) console.log('  ERRORE:', m);
if (errori.length > 80) console.log(`  ... altri ${errori.length - 80} errori`);
process.exit(errori.length ? 1 : 0);
