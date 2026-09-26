#!/usr/bin/env node
/**
 * Registro dei progressi: lo stesso algoritmo dell'app OFA (voto 0–5, SM-2, scelta Smart,
 * metriche "quanto ne so") usabile in chat, con un piano di studio o con materiale su carta.
 *
 * Uso: node registro.cjs <comando> [argomenti] [--file progressi-studio.json]
 *
 *   init "<esame>" [--data AAAA-MM-GG] [--soglia 18/30]
 *   add <id> --argomento "<t>" [--categoria "<c>"] [--livello "<l>"] [--nucleo] [--testo "<t>"]
 *   import <elementi.json>          array di {id, argomento, categoria?, livello?, nucleo?, testo?}
 *   risposta <id> giusta|sbagliata|omessa [--sicurezza S|In|I] [--aiuti N] [--tentativi N] [--punti k/n]
 *   prossimi [N=10] [--modo smart|weakness|standard] [--nucleo]
 *   stato [--nucleo]
 *   simulazione <punteggio> <totale> [--soglia X]
 *
 * Voto (references/algoritmo.md §7): giusta+S = 5, giusta+In = 4,4, giusta+I = al massimo 2,5 (torna presto);
 * ogni aiuto −1,5 (1 aiuto = 3,5; 2 aiuti = 2,0); più tentativi → al massimo 2,2; --punti k/n (domande aperte)
 * = 5·k/n meno la penalità di sicurezza (imparata con S da 60% dei punti, con In da 72%); sbagliata = 0.
 * Omessa: contata a parte, non abbassa la facilità ma torna domani.
 * Esiti accettati: giusta/sbagliata/omessa (anche giusto, errato, saltata…); sicurezza: S/In/I o Sicuro/Incerto/Indovino.
 */
const fs = require('fs');

const argv = process.argv.slice(2);
const flags = {};
const pos = [];
const BOOL = new Set(['nucleo']);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) {
    const k = argv[i].slice(2);
    const v = !BOOL.has(k) && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
    flags[k] = v;
  } else pos.push(argv[i]);
}
const FILE = flags.file || 'progressi-studio.json';
const DAY = 86400000;
const now = Date.now();

const load = () => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : null);
const save = (db) => fs.writeFileSync(FILE, JSON.stringify(db, null, 1));
const need = () => { const db = load(); if (!db) { console.error(`Nessun registro: esegui prima "init" (file ${FILE}).`); process.exit(1); } return db; };
const newItem = (o) => ({ argomento: o.argomento || 'Altro', categoria: o.categoria || '', livello: o.livello || '', nucleo: !!o.nucleo, testo: o.testo || '',
  correct: 0, incorrect: 0, omitted: 0, box: 0, easiness: 2.5, previousEasiness: 2.5, interval: 0, lastSeen: 0, lastQuality: null });
const pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
const light = (p) => (p > 70 ? '🟢' : p > 40 ? '🟡' : '🔴');
const r2 = (x) => Math.round(x * 100) / 100;
const die = (m) => { console.error(m); process.exit(1); };

function normEsito(e) {
  const x = String(e || '').toLowerCase();
  if (/^(giust[ao]|corrett[ao]|ok)$/.test(x)) return 'giusta';
  if (/^(sbagliat[ao]|errat[ao])$/.test(x)) return 'sbagliata';
  if (/^(omess[ao]|saltat[ao]|bianco)$/.test(x)) return 'omessa';
  return die(`Esito non valido: "${e}". Usa giusta, sbagliata oppure omessa.`);
}
function normSicurezza(v) {
  const x = String(v || 'S').toLowerCase();
  if (/^(i|indovino)$/.test(x)) return 'I';
  if (/^(in|incerto)$/.test(x)) return 'In';
  if (/^(s|sicuro)$/.test(x)) return 'S';
  return die(`Sicurezza non valida: "${v}". Usa S (Sicuro), In (Incerto) oppure I (Indovino).`);
}

function quality(esito) {
  if (esito !== 'giusta') return 0;
  const sic = normSicurezza(flags.sicurezza);
  const pen = sic === 'I' ? 2 : sic === 'In' ? 0.6 : 0;
  let q;
  if (flags.punti) {
    const m = String(flags.punti).match(/^(\d+)\/(\d+)$/);
    if (!m || Number(m[2]) <= 0 || Number(m[1]) > Number(m[2])) die(`--punti non valido: "${flags.punti}". Formato k/n con 0 ≤ k ≤ n e n > 0 (es. 3/4).`);
    q = 5 * (Number(m[1]) / Number(m[2])) - pen;
  } else {
    q = 5 - pen;
  }
  if (sic === 'I') q = Math.min(q, 2.5); // giusto per caso non è imparato
  const aiuti = Number(flags.aiuti || 0);
  if (!Number.isFinite(aiuti) || aiuti < 0) die(`--aiuti non valido: "${flags.aiuti}".`);
  q -= 1.5 * aiuti;
  if (Number(flags.tentativi || 1) > 1) q = Math.min(q, 2.2);
  return Math.max(0, Math.min(5, r2(q)));
}

function sm2(it, q) {
  if (q >= 3) {
    it.interval = it.box === 0 ? 1 : it.box === 1 ? 6 : Math.max(1, Math.round(it.interval * it.easiness));
    it.box += 1;
  } else { it.box = 0; it.interval = 1; }
  it.previousEasiness = it.easiness;
  it.easiness = Math.max(1.3, r2(it.easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
}

function score(it, modo) {
  const err = it.correct + it.incorrect ? it.incorrect / (it.correct + it.incorrect) : 0;
  const days = it.lastSeen ? (now - it.lastSeen) / DAY : 0;
  const urg = !it.lastSeen ? 800 + Math.random() * 200 : days >= it.interval ? 500 + (days - it.interval) * 10 : (days / Math.max(1, it.interval)) * 100;
  if (modo === 'weakness') return it.correct + it.incorrect ? err * 1000 + (5 - it.easiness) * 100 : 0;
  if (modo === 'standard') return !it.lastSeen ? 1000 + Math.random() * 100 : urg;
  const weak = it.correct + it.incorrect ? err * 400 + (5 - it.easiness) * 40 : 0;
  return urg + weak + Math.random() * 100;
}

const cmd = pos[0];
if (cmd === 'init') {
  if (load()) { console.error(`${FILE} esiste già.`); process.exit(1); }
  save({ esame: { nome: pos[1] || 'Esame', data: flags.data || null, soglia: flags.soglia || null }, items: {}, simulazioni: [], log: [] });
  console.log(`Registro creato: ${FILE}`);
} else if (cmd === 'add') {
  const db = need();
  if (!pos[1]) die('Specifica un id.');
  const ex = db.items[pos[1]];
  if (ex) {
    ['argomento', 'categoria', 'livello', 'testo'].forEach((k) => { if (typeof flags[k] === 'string') ex[k] = flags[k]; });
    if (flags.nucleo) ex.nucleo = true;
    save(db); console.log(`${pos[1]} esisteva già: aggiornate solo le etichette, i progressi restano.`);
  } else {
    db.items[pos[1]] = newItem(flags);
    save(db); console.log(`Aggiunto ${pos[1]} (${flags.argomento || 'Altro'})`);
  }
} else if (cmd === 'import') {
  const db = need();
  const arr = JSON.parse(fs.readFileSync(pos[1], 'utf8'));
  let n = 0;
  arr.forEach((o) => { if (!db.items[o.id]) { db.items[o.id] = newItem(o); n++; } });
  save(db); console.log(`Importati ${n} elementi (totale ${Object.keys(db.items).length}).`);
} else if (cmd === 'risposta') {
  const db = need();
  const it = db.items[pos[1]];
  if (!it) { console.error(`Elemento ${pos[1]} non trovato.`); process.exit(1); }
  const esito = normEsito(pos[2]);
  const q = quality(esito);
  const first = Number(flags.tentativi || 1) === 1;
  if (esito === 'omessa') {
    // come nell'app: le omesse si contano a parte e non abbassano la facilità; tornano però domani
    it.omitted++; it.box = 0; it.interval = 1; it.previousEasiness = it.easiness;
  } else {
    if (first) esito === 'giusta' ? it.correct++ : it.incorrect++;
    sm2(it, q);
  }
  it.lastSeen = now; it.lastQuality = q;
  db.log.push({ id: pos[1], t: now, esito, q });
  save(db);
  const trend = it.easiness > it.previousEasiness ? '↑' : it.easiness < it.previousEasiness ? '↓' : '–';
  console.log(`${pos[1]}: voto ${q} → ${it.box > 0 ? 'imparato ✅' : 'da imparare ⚠️'} · prossimo ripasso tra ${it.interval} g · confidenza ${trend}`);
} else if (cmd === 'prossimi') {
  const db = need();
  const n = Number(pos[1] || 10);
  const list = Object.entries(db.items).filter(([, it]) => !flags.nucleo || it.nucleo)
    .map(([id, it]) => ({ id, it, s: score(it, flags.modo || 'smart') })).sort((a, b) => b.s - a.s).slice(0, n);
  list.forEach(({ id, it }, i) => console.log(`${i + 1}. ${id} · ${it.argomento}${it.testo ? ' · ' + it.testo : ''} ${!it.lastSeen ? '(nuovo)' : it.box === 0 ? '(da ripassare)' : ''}`));
} else if (cmd === 'stato') {
  const db = need();
  const items = Object.entries(db.items).filter(([, it]) => !flags.nucleo || it.nucleo);
  const tot = items.length;
  const imp = items.filter(([, it]) => it.box > 0).length;
  let c = 0, w = 0, om = 0, due = 0;
  const top = {};
  items.forEach(([, it]) => {
    c += it.correct; w += it.incorrect; om += it.omitted;
    if (it.lastSeen && (now - it.lastSeen) / DAY >= it.interval) due++;
    const t = (top[it.argomento] = top[it.argomento] || { c: 0, w: 0, imp: 0, tot: 0 });
    t.c += it.correct; t.w += it.incorrect; t.tot++; if (it.box > 0) t.imp++;
  });
  const acc = pct(c, c + w);
  console.log(`# ${db.esame.nome}${db.esame.data ? ` · esame il ${db.esame.data} (tra ${Math.ceil((new Date(db.esame.data) - now) / DAY)} giorni)` : ''}${flags.nucleo ? ' · solo nucleo' : ''}`);
  console.log(`Padronanza: ${pct(imp, tot)}% (${imp}/${tot} imparati) · Accuratezza: ${c + w ? `${acc}% ${light(acc)}` : 'nessun tentativo ancora ⚪'} · Omesse: ${om} · Da ripassare oggi: ${due}`);
  const nucleo = Object.values(db.items).filter((it) => it.nucleo);
  if (!flags.nucleo && nucleo.length) console.log(`Nucleo: ${pct(nucleo.filter((it) => it.box > 0).length, nucleo.length)}% imparato (${nucleo.length} elementi)`);
  console.log('\n## Per argomento (accuratezza · imparati/totale)');
  Object.entries(top).sort((a, b) => pct(a[1].c, a[1].c + a[1].w) - pct(b[1].c, b[1].c + b[1].w)).forEach(([k, t]) => {
    const a = pct(t.c, t.c + t.w);
    console.log(`${t.c + t.w ? light(a) : '⚪'} ${k}: ${t.c + t.w ? a + '%' : 'mai visto'} · ${t.imp}/${t.tot}`);
  });
  const worst = items.filter(([, it]) => it.incorrect + it.omitted > 0)
    .map(([id, it]) => ({ id, it, err: (it.incorrect + it.omitted) / (it.correct + it.incorrect + it.omitted) }))
    .sort((a, b) => b.err - a.err || a.it.easiness - b.it.easiness).slice(0, 5);
  if (worst.length) {
    console.log('\n## I peggiori (confidenza e tendenza)');
    worst.forEach(({ id, it }) => {
      const conf = Math.min(100, Math.round(((it.easiness - 1.3) / 1.7) * 100));
      const tr = it.easiness > it.previousEasiness ? '↑' : it.easiness < it.previousEasiness ? '↓' : '–';
      console.log(`${id} · ${it.argomento} · confidenza ${conf}% ${tr} · ${it.correct}✓ ${it.incorrect}✗ ${it.omitted}∅`);
    });
  }
  if (db.simulazioni.length) {
    const s = db.simulazioni;
    const best = s.reduce((a, b) => (b.punteggio / b.totale > a.punteggio / a.totale ? b : a));
    console.log(`\n## Simulazioni: ${s.length} · superate ${s.filter((x) => x.superata).length} (pass rate ${pct(s.filter((x) => x.superata).length, s.length)}%) · record ${best.punteggio}/${best.totale} · ultima ${s[s.length - 1].punteggio}/${s[s.length - 1].totale}`);
  }
} else if (cmd === 'simulazione') {
  const db = need();
  const [p, t] = [Number(pos[1]), Number(pos[2])];
  let soglia = flags.soglia ? Number(flags.soglia) : null;
  if (soglia == null && db.esame.soglia) {
    const [s0, T0] = String(db.esame.soglia).split('/').map(Number);
    soglia = T0 ? Math.ceil(((s0 + 1) / T0) * t) : s0 + 1; // soglia reale +1, riscalata sul totale di questa simulazione
  }
  db.simulazioni.push({ t: now, punteggio: p, totale: t, soglia, superata: soglia != null ? p >= soglia : null });
  save(db);
  console.log(`Simulazione registrata: ${p}/${t}${soglia != null ? ` · soglia di sicurezza ${soglia} → ${p >= soglia ? 'SUPERATA ✅' : 'non superata ⚠️'}` : ''}`);
} else {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 20).map((l) => l.replace(/^ \* ?/, '')).join('\n'));
}
