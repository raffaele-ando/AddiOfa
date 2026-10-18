// Verifica dell'email con un link: parti pure (impostazioni, ritorno dal link, confronto, errori). NON prova Firebase vero.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CHIAVE_VERIFICA_EMAIL, emailCoincide, impostazioniLink, leggiPendente, messaggioVerifica, sembraLinkDiAccesso, serializzaPendente } from '../../src/lib/progetto/verificaEmail';

test('impostazioni del link: stessa pagina senza parametri, aperto nell\'app', () => {
  assert.deepEqual(impostazioniLink({ origin: 'https://addiofa.example', pathname: '/' }), { url: 'https://addiofa.example/', handleCodeInApp: true });
  assert.deepEqual(impostazioniLink({ origin: 'http://localhost:3000', pathname: '/app/' }), { url: 'http://localhost:3000/app/', handleCodeInApp: true });
  assert.ok(CHIAVE_VERIFICA_EMAIL.startsWith('addiofa_'));
});

test('ritorno dal link: si riconosce da mode=signIn e oobCode, altrimenti Firebase non si carica', () => {
  assert.equal(sembraLinkDiAccesso('?apiKey=k&oobCode=abc&mode=signIn&lang=it'), true);
  assert.equal(sembraLinkDiAccesso('?mode=signIn&oobCode=abc'), true);
  assert.equal(sembraLinkDiAccesso('?mode=resetPassword&oobCode=abc'), false);
  assert.equal(sembraLinkDiAccesso('?mode=signIn'), false);
  assert.equal(sembraLinkDiAccesso(''), false);
  assert.equal(sembraLinkDiAccesso('?vista=esplora'), false);
});

test('«verificata» solo se l\'email del link è quella del profilo', () => {
  assert.equal(emailCoincide('maria.rossi@mail.polimi.it', 'maria.rossi@mail.polimi.it'), true);
  assert.equal(emailCoincide('maria.rossi@mail.polimi.it', ' Maria.Rossi@Mail.Polimi.it '), true);
  assert.equal(emailCoincide('maria.rossi@mail.polimi.it', 'altra@mail.polimi.it'), false);
  assert.equal(emailCoincide('maria.rossi@mail.polimi.it', null), false);
  assert.equal(emailCoincide(undefined, 'maria.rossi@mail.polimi.it'), false);
  assert.equal(emailCoincide('', ''), false);
});

test('errori: ogni codice di Firebase diventa una riga onesta, e l\'email resta non verificata', () => {
  const codici = ['auth/operation-not-allowed', 'auth/unauthorized-continue-uri', 'auth/invalid-continue-uri', 'auth/network-request-failed', 'auth/too-many-requests',
    'auth/quota-exceeded', 'auth/invalid-email', 'auth/expired-action-code', 'auth/invalid-action-code', 'nessuna-email-salvata', 'email-diversa', 'auth/qualcosa-di-nuovo', undefined];
  for (const c of codici) {
    for (const fase of ['invio', 'ritorno'] as const) {
      const m = messaggioVerifica(c, fase);
      assert.ok(m.length > 15 && m.length < 140, `${c}/${fase}: ${m}`);
      assert.ok(!/verificata\b/i.test(m.replace(/non verificata/gi, '')), `non deve dire «verificata»: ${m}`);
    }
  }
  assert.match(messaggioVerifica('auth/operation-not-allowed'), /non è abilitato/);
  assert.match(messaggioVerifica('auth/unauthorized-continue-uri'), /non è autorizzato/);
  assert.match(messaggioVerifica('auth/network-request-failed'), /offline/);
  assert.match(messaggioVerifica('auth/invalid-action-code', 'ritorno'), /già stato usato/);
  assert.match(messaggioVerifica('email-diversa', 'ritorno'), /diverso/);
  assert.match(messaggioVerifica(undefined, 'invio'), /Non sono riuscito a inviare/);
  assert.match(messaggioVerifica(undefined, 'ritorno'), /completare/);
});

test('link in attesa: si salva con lo scopo (accesso o verifica) e si rilegge; un testo semplice vecchio era una verifica', () => {
  const raw = serializzaPendente({ email: ' Maria.Rossi@Mail.Polimi.it ', scopo: 'verifica' });
  assert.deepEqual(leggiPendente(raw), { email: 'maria.rossi@mail.polimi.it', scopo: 'verifica' });
  assert.deepEqual(leggiPendente(serializzaPendente({ email: 'a@b.it', scopo: 'accesso' })), { email: 'a@b.it', scopo: 'accesso' });
  assert.deepEqual(leggiPendente('maria.rossi@mail.polimi.it'), { email: 'maria.rossi@mail.polimi.it', scopo: 'verifica' });
  for (const x of [null, undefined, '', '{"email":"a@b.it","scopo":"altro"}', '{"scopo":"accesso"}', 'testo senza chiocciola']) assert.equal(leggiPendente(x as string), null);
});
