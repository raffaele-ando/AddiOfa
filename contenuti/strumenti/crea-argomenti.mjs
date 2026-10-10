// Crea (o rinfresca gli elenchi di id di) contenuti/teoria/argomenti.json. Titoli, slug e collegamenti al prontuario sono scritti qui;
// dopo la prima creazione il file si può modificare a mano. Uso: node contenuti/strumenti/crea-argomenti.mjs
import path from 'node:path';
import { DIR_TEORIA, leggiDomande, scriviJson, duplicataDi, numeroId } from './lib.mjs';

// grammarTopic (nome nelle domande) -> [slug, titolo italiano, voce di app/src/data/cheatSheet.ts o null]
const ARGOMENTI = [
  ['Present Simple', 'present-simple', 'Present Simple: abitudini e fatti', 'Present Simple'],
  ['Present Continuous', 'present-continuous', 'Present Continuous: azioni in corso', 'Present Continuous'],
  ['Present Perfect', 'present-perfect', 'Present Perfect: esperienze e durata', 'Present Perfect / Past Simple'],
  ['Past Simple', 'past-simple', 'Past Simple: azioni concluse nel passato', 'Past Simple'],
  ['Past Continuous', 'past-continuous', 'Past Continuous: azioni in corso nel passato', null],
  ['Past Perfect', 'past-perfect', 'Past Perfect: il passato del passato', 'Past Perfect'],
  ['Used to', 'used-to', 'Used to: abitudini del passato', 'Used to'],
  ['Future: going to', 'going-to', 'Going to: intenzioni e previsioni', 'Going to'],
  ['First Conditional', 'first-conditional', 'Primo periodo ipotetico (First Conditional)', 'First Conditional'],
  ['Second Conditional', 'second-conditional', 'Secondo periodo ipotetico (Second Conditional)', 'Second Conditional'],
  ['Third Conditional', 'third-conditional', 'Terzo periodo ipotetico (Third Conditional)', 'Third Conditional'],
  ['Passive Voice', 'passive-voice', 'Forma passiva', 'Passive'],
  ['Reported Speech', 'reported-speech', 'Discorso indiretto (Reported Speech)', 'Reported speech'],
  ['Modals of Obligation and Advice', 'modals-obligation-advice', 'Obbligo e consiglio: must, have to, should', 'Modali'],
  ['Modals of Ability and Permission', 'modals-ability-permission', 'Capacità e permesso: can, could, may', 'Modali'],
  ['Modals of Deduction', 'modals-deduction', 'Deduzione: must, can\'t, might', 'Deduzione'],
  ['Gerunds vs Infinitives', 'gerunds-infinitives', 'Gerundio o infinito', 'Gerundio / infinito'],
  ['Relative Clauses', 'relative-clauses', 'Frasi relative: who, which, that, whose', 'Relative clauses'],
  ['Question Tags', 'question-tags', 'Question tags', 'Question tags'],
  ['Questions and Origins', 'questions-origins', 'Domande e provenienza: how, where, whose', null],
  ['There is / There are', 'there-is-are', 'There is / There are', 'There is / are'],
  ['Quantifiers', 'quantifiers', 'Quantificatori: much, many, few, little, some, any', 'Quantifiers'],
  ['Comparatives and Superlatives', 'comparatives-superlatives', 'Comparativi e superlativi', 'Comparativi'],
  ['Adverbs of Manner', 'adverbs-manner', 'Avverbi di modo', 'Avverbi'],
  ['Prepositions of Time', 'prepositions-time', 'Preposizioni di tempo: at, on, in, for, since', 'Preposizioni'],
  ['Prepositions of Place', 'prepositions-place', 'Preposizioni di luogo: in, on, at, under, between', 'Preposizioni'],
  ['Possessives', 'possessives', 'Aggettivi e pronomi possessivi', 'Possessivi'],
  ['Possessive S', 'possessive-s', 'Il genitivo sassone (\'s)', 'Possessivi'],
  ['Object Pronouns', 'object-pronouns', 'Pronomi complemento: me, you, him, her, us, them', null],
  ['Demonstratives', 'demonstratives', 'Dimostrativi: this, that, these, those', null],
  ['Imperative', 'imperative', 'Imperativo', null],
];

const domande = leggiDomande();
const livelloDi = (qs) => {
  const c = { A1: 0, A2: 0, B1: 0 };
  for (const q of qs) c[q.level]++;
  // il livello più frequente; a parità vince quello più facile
  return ['A1', 'A2', 'B1'].reduce((m, l) => (c[l] > c[m] ? l : m), 'A1');
};
const perNum = (a, b) => numeroId(a) - numeroId(b);

const nomi = new Set(domande.map((q) => q.grammarTopic));
for (const [g] of ARGOMENTI) nomi.delete(g);
if (nomi.size) { console.error('Argomenti senza voce:', [...nomi]); process.exit(1); }

const out = ARGOMENTI.map(([grammarTopic, id, titolo, voce]) => {
  const qs = domande.filter((q) => q.grammarTopic === grammarTopic && duplicataDi(q.stato) === null);
  return {
    id,
    titolo,
    livello: livelloDi(qs),
    grammarTopic,
    inCheatSheet: voce !== null,
    voceCheatSheet: voce,
    domande: qs.map((q) => q.id).sort(perNum),
    nucleo: qs.filter((q) => q.core).map((q) => q.id).sort(perNum),
  };
});
scriviJson(path.join(DIR_TEORIA, 'argomenti.json'), out);
console.log(`${out.length} argomenti scritti.`);
