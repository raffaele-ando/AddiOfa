// Consenso unico obbligatorio (termini e privacy): accettato solo se copre tutti i campi (classifica NOI, Agorà, Project ID, ATLAS).
import test from 'node:test';
import assert from 'node:assert/strict';
import { CONSENSI_VUOTI, consensoAccettato, consensoTutto } from '../../src/lib/progetto/profilo';

test('consenso unico: accettato solo con tutti i campi a true', () => {
  assert.equal(consensoAccettato({ ...CONSENSI_VUOTI }), false);
  assert.equal(consensoAccettato({ noi: true, atlas: true, comunicazioni: false }), false);
  assert.equal(consensoAccettato({ noi: true, atlas: true, comunicazioni: true }), true);
});

test('consenso unico: accettare o ritirare imposta tutti i campi insieme', () => {
  assert.deepEqual(consensoTutto(true), { noi: true, atlas: true, comunicazioni: true });
  assert.deepEqual(consensoTutto(false), { noi: false, atlas: false, comunicazioni: false });
  assert.equal(consensoAccettato(consensoTutto(true)), true);
});
