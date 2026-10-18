// Pagine legali e informative: dicono il vero trattamento (nessun dato per studiare; Project ID, NOI e comunicazioni solo su scelta), niente «bozza»,
// niente titolare finto, niente rimando a un contatto che non c'è.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LEGAL_DOCS } from '../../src/legal';
import { CONTACT_EMAIL, DISCLAIMER, TITOLARE } from '../../src/config/offer';
import { FRASE_PROJECT } from '../../src/config/ecosystem';
import { INFORMATIVA_ACCOUNT, INFORMATIVA_COMUNICAZIONI, INFORMATIVA_NOI, RIGA_APERTURA, RIGA_SOLO_DISPOSITIVO } from '../../src/lib/progetto/informativa';
import { vociFaq } from '../../src/lib/servizi/faq';

const testo = (id: 'termini' | 'privacy' | 'cookie') => JSON.stringify(LEGAL_DOCS[id]);

test('legali: nessun «bozza», nessun «contatto: indicato nel sito», nessuna parola vietata', () => {
  for (const id of ['termini', 'privacy', 'cookie'] as const) {
    assert.ok(!/bozza/i.test(testo(id)), id);
    assert.ok(!/indicato nel sito/i.test(testo(id)), id);
    assert.ok(!/\b(beta|dimostrativ|esperiment|in arrivo|presto)\b/i.test(testo(id)), id);
    assert.ok(LEGAL_DOCS[id].sezioni.length >= 3, id);
  }
});

test('privacy: nessun dato per studiare; elenca dati per servizio, destinatari, basi, conservazione e diritti', () => {
  const t = testo('privacy');
  for (const parola of ['senza dati personali', 'Project ID', 'NOI', '@nome utente', 'domande imparate', 'Cloudflare', 'Google', 'Firebase', 'Stati Uniti', 'Data Privacy Framework',
    'art. 6.1.a', 'art. 6.1.b', 'art. 6.1.f', 'art. 130', 'Garante', 'Esporta', 'Cancella dal dispositivo', 'Elimina', 'senza eliminare l\'account', 'almeno 14 anni',
    'cookie di tracciamento', 'Se non fornisci i dati', 'sul tuo dispositivo']) {
    assert.ok(t.toLowerCase().includes(parola.toLowerCase()), `manca: ${parola}`);
  }
  const titoli = LEGAL_DOCS.privacy.sezioni.map(s => s.titolo);
  for (const t2 of ['Chi è il titolare', 'Quanto restano', 'I tuoi diritti e come esercitarli', 'Se non fornisci i dati', 'Minori']) assert.ok(titoli.includes(t2), t2);
});

test('privacy: non dice più che si raccolgono nome ricavato, corso, sede, provenienza o email PoliMi all\'avvio', () => {
  const t = testo('privacy');
  assert.ok(!/nome che ricaviamo/i.test(t));
  assert.ok(!/ricava/i.test(t));
  assert.ok(!/All'inizio ti chiediamo/i.test(testo('termini')));
  assert.ok(!/invia(ti|ti)? ad ATLAS, appena possibile/i.test(t));
});

test('titolare: nessun nome finto; la riga del contatto compare solo se c\'è un indirizzo vero', () => {
  const t = testo('privacy');
  if (TITOLARE.nome) assert.ok(t.includes(`Titolare del trattamento: ${TITOLARE.nome}`));
  else assert.ok(/Titolare del trattamento: l'autore di AddiOFA, una persona fisica/.test(t));
  assert.ok(!/Titolare del trattamento: Project/.test(t));
  assert.equal(t.includes('Contatto del titolare'), CONTACT_EMAIL !== undefined);
  assert.equal(testo('termini').includes('Contatto del titolare'), CONTACT_EMAIL !== undefined);
  // senza indirizzo, la cancellazione resta possibile dentro l'app
  assert.ok(t.includes('elimina il Project ID'));
});

test('cookie: nessun tracciamento, chiavi del dispositivo senza coda di invio', () => {
  const t = testo('cookie');
  assert.ok(!t.includes('addiofa_progetto_coda'));
  assert.ok(t.includes('addiofa_verifica_email'));
  assert.ok(t.includes('ofa_polimi_app_state'));
  assert.ok(!/nome ricavato|consensi\)/.test(t));
  assert.ok(/non usa cookie di tracciamento/.test(t));
});

test('termini: dicono chi lo pubblica, che non è affiliato e che uscire non richiede di eliminare l\'account', () => {
  const t = testo('termini');
  assert.ok(t.includes(DISCLAIMER));
  assert.ok(t.includes('fa parte di Project'));
  assert.ok(/non richiede di eliminare/.test(t));
  assert.ok(FRASE_PROJECT.startsWith('AddiOFA fa parte di Project, insieme a NOI, ATLAS e Agorà.'));
  assert.ok(FRASE_PROJECT.includes(DISCLAIMER));
});

test('informative brevi: una per punto di raccolta, ciascuna dice che cosa e come si revoca', () => {
  assert.ok(/salviamo il tuo indirizzo email/.test(INFORMATIVA_ACCOUNT()));
  assert.ok(/Google \(Firebase\)/.test(INFORMATIVA_ACCOUNT()));
  assert.ok(/@nome utente, le domande imparate e il miglior punteggio/.test(INFORMATIVA_NOI()));
  assert.ok(/sparisce subito/.test(INFORMATIVA_NOI()));
  assert.ok(/link/.test(INFORMATIVA_COMUNICAZIONI()) && /con un tocco/.test(INFORMATIVA_COMUNICAZIONI()));
  for (const i of [INFORMATIVA_ACCOUNT(), INFORMATIVA_NOI(), INFORMATIVA_COMUNICAZIONI()]) {
    assert.ok(!/Titolare: Project/.test(i));
    assert.equal(i.includes('Titolare:') || i.includes('Contatto:'), TITOLARE.nome !== undefined || CONTACT_EMAIL !== undefined);
  }
  assert.ok(/Non ti chiediamo nessun dato/.test(RIGA_APERTURA));
  assert.ok(/non lo inviamo a nessuno/.test(RIGA_SOLO_DISPOSITIVO));
});

test('FAQ: «Che dati raccogliete?» e «Devo dare l\'email del Politecnico?» dicono il vero', () => {
  const dati = vociFaq().find(f => f.id === 'dati-raccolti')!;
  assert.ok(/Nessun dato per studiare/.test(dati.risposta.join(' ')));
  const email = vociFaq().find(f => f.id === 'dati-email-polimi')!;
  assert.ok(/^No\./.test(email.risposta[0]));
  assert.ok(!vociFaq().some(f => /ricaviamo dall'email|All'inizio ti chiediamo/.test(f.risposta.join(' '))));
});
