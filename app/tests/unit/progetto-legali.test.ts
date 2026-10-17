// Pagine legali: dicono il vero trattamento (dati raccolti, destinatari, diritti), niente «bozza», niente rimando a un contatto che non c'è.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LEGAL_DOCS } from '../../src/legal';
import { CONTACT_EMAIL, TITOLARE } from '../../src/config/offer';
import { FRASE_PROJECT } from '../../src/config/ecosystem';
import { DISCLAIMER } from '../../src/config/offer';
import { INFORMATIVA_BREVE } from '../../src/lib/progetto/informativa';

const testo = (id: 'termini' | 'privacy' | 'cookie') => JSON.stringify(LEGAL_DOCS[id]);

test('legali: nessun «bozza» e nessun «contatto: indicato nel sito»', () => {
  for (const id of ['termini', 'privacy', 'cookie'] as const) {
    assert.ok(!/bozza/i.test(testo(id)), id);
    assert.ok(!/indicato nel sito/i.test(testo(id)), id);
    assert.ok(LEGAL_DOCS[id].sezioni.length >= 3, id);
  }
});

test('privacy: elenca i dati raccolti, i destinatari, la base giuridica, la conservazione e i diritti', () => {
  const t = testo('privacy');
  for (const parola of ['email del Politecnico', 'nome', 'percorso di studi', 'scuola, sede, livello, corso, anno', 'come ci hai conosciuto', 'consensi', 'Cloudflare', 'Google', 'Firebase', 'art. 6.1.a', 'art. 6.1.b', 'Garante', 'Esporta', 'Cancella dal dispositivo', 'Elimina', 'non verificata', 'Verifica con un link', 'cookie di tracciamento', 'profilazione commerciale']) {
    assert.ok(t.toLowerCase().includes(parola.toLowerCase()), `manca: ${parola}`);
  }
  const titoli = LEGAL_DOCS.privacy.sezioni.map(s => s.titolo);
  for (const t2 of ['Chi è il titolare', 'Quanto restano', 'I tuoi diritti e come esercitarli']) assert.ok(titoli.includes(t2), t2);
});

test('titolare: la riga del contatto compare solo se c\'è un indirizzo vero', () => {
  const t = testo('privacy');
  assert.ok(t.includes(`Titolare del trattamento: ${TITOLARE.nome}`));
  assert.equal(t.includes('Contatto del titolare'), CONTACT_EMAIL !== undefined);
  assert.equal(testo('termini').includes('Contatto del titolare'), CONTACT_EMAIL !== undefined);
  // senza indirizzo, la cancellazione resta possibile dentro l'app
  assert.ok(t.includes('elimina il Project ID'));
});

test('cookie: nessun tracciamento, e le chiavi del dispositivo comprendono la coda di invio', () => {
  const t = testo('cookie');
  assert.ok(t.includes('addiofa_progetto_coda'));
  assert.ok(t.includes('addiofa_verifica_email'));
  assert.ok(t.includes('ofa_polimi_app_state'));
  assert.ok(/non usa cookie di tracciamento/.test(t));
});

test('termini: dicono chi lo pubblica e che non è affiliato al Politecnico', () => {
  const t = testo('termini');
  assert.ok(t.includes(DISCLAIMER));
  assert.ok(t.includes('fa parte di Project'));
  assert.ok(FRASE_PROJECT.startsWith('AddiOFA fa parte di Project, insieme a NOI, ATLAS e Agorà.'));
  assert.ok(FRASE_PROJECT.includes(DISCLAIMER));
});

test('informativa breve (passo dei consensi): titolare, dove vanno i dati, uso dei consensi', () => {
  assert.ok(INFORMATIVA_BREVE.includes(`Titolare: ${TITOLARE.nome}`));
  assert.ok(/inviati ad ATLAS/.test(INFORMATIVA_BREVE));
  assert.ok(/restano su questo dispositivo/.test(INFORMATIVA_BREVE));
  assert.equal(INFORMATIVA_BREVE.includes('Contatto:'), CONTACT_EMAIL !== undefined);
});
