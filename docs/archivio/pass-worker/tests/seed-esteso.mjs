// Genera un banco di prova da 40 domande (10 nucleo + 30 a pagamento, 35 con quinta opzione) per provare i soglie dei 30/30.
// Uso: node tests/seed-esteso.mjs > /tmp/seed-esteso.sql && npx wrangler d1 execute addiofa-pass --local --file=/tmp/seed-esteso.sql
const rows = [];
const words = ['apple', 'river', 'window', 'garden', 'music', 'engine', 'bridge', 'planet', 'doctor', 'castle'];
for (let i = 1; i <= 40; i++) {
  const w = words[i % words.length];
  const id = `X${String(i).padStart(3, '0')}`;
  const prompt = `Question ${i} about ${w}${i}: choose the right form of verb${i} in sentence number${i}.`;
  const extra = i <= 35 ? `'extra${i}'` : 'NULL';
  rows.push(`('${id}', '${prompt}', '["a${i}","b${i}","c${i}","d${i}"]', ${extra}, ${i % 4}, 'Spiegazione ${i}.', NULL, 'grammar', 'B1', NULL, ${i <= 10 ? 1 : 0})`);
}
console.log("DELETE FROM questions WHERE id LIKE 'X%';");
console.log('INSERT INTO questions (id, prompt, options, extra_option, correct_index, explanation_it, theory_id, category, level, grammar_topic, core) VALUES');
console.log(rows.join(',\n') + ';');
