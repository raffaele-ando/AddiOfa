// Registrazione: controllo di nome ed email PoliMi (formato e dominio, mai «verificata»), consensi sempre spenti, profilo salvato nello stato.
import test from 'node:test';
import assert from 'node:assert/strict';
import { controllaDatiMinimi, controllaEmailPolimi, dominioPolimi, pulisciNome } from '../../src/lib/progetto/validazione';
import {
  aggiornaProgetto, CONSENSI_VUOTI, corpoIscrizione, creaProfilo, impostaProfilo, leggiProfilo, leggiProgetto, serveRegistrazione,
} from '../../src/lib/progetto/profilo';
import { CORSI, CORSO_ALTRO, eCorso, eProvenienza, eSede, PROVENIENZE, SEDI } from '../../src/lib/progetto/corsi';
import { ISCRIZIONE_VERSIONE } from '../../src/config/ecosystem';
import { statoVuoto } from './aiuti';

test('email: i domini del Politecnico passano, normalizzati', () => {
  for (const [in_, out] of [
    ['mario.rossi@mail.polimi.it', 'mario.rossi@mail.polimi.it'],
    ['  Mario.Rossi@Mail.Polimi.IT ', 'mario.rossi@mail.polimi.it'],
    ['a.b@polimi.it', 'a.b@polimi.it'],
    ['x@dei.polimi.it', 'x@dei.polimi.it'],
    ['x@a.b.polimi.it', 'x@a.b.polimi.it'],
    ["d'arco@mail.polimi.it", "d'arco@mail.polimi.it"],
  ]) {
    const e = controllaEmailPolimi(in_);
    assert.deepEqual(e, { ok: true, email: out }, in_);
  }
});

test('email: altri domini e domini simili sono rifiutati con il motivo giusto', () => {
  const dominio = ['x@gmail.com', 'x@evilpolimi.it', 'x@polimi.it.evil.com', 'x@polimi.com', 'x@mail.polimi.com', 'x@fakepolimi.it', 'x@polimi.itt'];
  for (const e of dominio) assert.deepEqual(controllaEmailPolimi(e), { ok: false, motivo: 'dominio' }, e);
  const formato = ['senzachiocciola', 'x@@polimi.it', '@polimi.it', 'x y@polimi.it', 'x..y@polimi.it', 'x.@polimi.it', 'x@polimi', 'x@.polimi.it', 'x@polimi.it.', 'a@b'];
  for (const e of formato) assert.equal(controllaEmailPolimi(e).ok, false, e);
  assert.deepEqual(controllaEmailPolimi('   '), { ok: false, motivo: 'vuota' });
  assert.deepEqual(controllaEmailPolimi('a'.repeat(300) + '@polimi.it'), { ok: false, motivo: 'formato' });
});

test('dominioPolimi: solo polimi.it e i suoi sottodomini veri', () => {
  assert.equal(dominioPolimi('polimi.it'), true);
  assert.equal(dominioPolimi('MAIL.POLIMI.IT'), true);
  assert.equal(dominioPolimi('evilpolimi.it'), false);
  assert.equal(dominioPolimi('polimi.it.evil.com'), false);
  assert.equal(dominioPolimi('.polimi.it'), false);
});

test('nome: spazi ripuliti, caratteri di controllo tolti, lunghezze', () => {
  assert.equal(pulisciNome('  Maria   Chiara \t Bianchi '), 'Maria Chiara Bianchi');
  assert.equal(pulisciNome('A'), null);
  assert.equal(pulisciNome('   '), null);
  assert.equal(pulisciNome('x'.repeat(81)), null);
  assert.equal(pulisciNome('x'.repeat(80))?.length, 80);
  assert.equal(pulisciNome('Ma\u0000rio'), 'Ma rio');
});

test('dati minimi: sono obbligatori solo nome ed email', () => {
  assert.deepEqual(controllaDatiMinimi({ nome: 'Mario', email: 'mario@mail.polimi.it' }), {});
  const e = controllaDatiMinimi({ nome: '', email: 'mario@gmail.com' });
  assert.ok(e.nome && e.email);
  assert.ok(/polimi/.test(e.email!));
});

test('consensi: partono tutti spenti e solo «true» esplicito vale come sì', () => {
  assert.deepEqual({ ...CONSENSI_VUOTI }, { noi: false, atlas: false, comunicazioni: false });
  assert.ok(Object.isFrozen(CONSENSI_VUOTI));
  const senza = creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it' }, 1000)!;
  assert.deepEqual(senza.consensi, { noi: false, atlas: false, comunicazioni: false });
  const storti = creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it', consensi: { noi: 'sì' as unknown as boolean, atlas: 1 as unknown as boolean, comunicazioni: undefined } }, 1000)!;
  assert.deepEqual(storti.consensi, { noi: false, atlas: false, comunicazioni: false });
  const uno = creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it', consensi: { atlas: true } }, 1000)!;
  assert.deepEqual(uno.consensi, { noi: false, atlas: true, comunicazioni: false });
});

test('profilo: l\'email non è mai «verificata», nemmeno rileggendo un file che lo dice', () => {
  const p = creaProfilo({ nome: 'Mario', email: 'Mario@Mail.Polimi.it', corso: 'Ingegneria Gestionale', sede: 'Bovisa', provenienza: 'Amici o compagni' }, 5)!;
  assert.equal(p.emailVerificata, false);
  assert.equal(p.email, 'mario@mail.polimi.it');
  const riletto = leggiProfilo({ ...p, emailVerificata: true, consensi: { noi: 1, atlas: 'true', comunicazioni: true } })!;
  assert.equal(riletto.emailVerificata, false);
  assert.deepEqual(riletto.consensi, { noi: false, atlas: false, comunicazioni: true });
});

test('profilo: nome o email non validi non fanno un profilo; corso, sede e provenienza fuori elenco si scartano', () => {
  assert.equal(creaProfilo({ nome: 'M', email: 'mario@mail.polimi.it' }, 1), null);
  assert.equal(creaProfilo({ nome: 'Mario', email: 'mario@gmail.com' }, 1), null);
  const p = creaProfilo({ nome: 'Mario', email: 'mario@polimi.it', corso: 'Corso inventato', sede: 'Luna', provenienza: 'boh' }, 1)!;
  assert.equal(p.corso, undefined);
  assert.equal(p.sede, undefined);
  assert.equal(p.provenienza, undefined);
  assert.equal(leggiProfilo({ nome: 'Mario', email: 'x@gmail.com' }), undefined);
  assert.equal(leggiProfilo(null), undefined);
  assert.equal(leggiProfilo('testo'), undefined);
});

test('elenchi: «Altro» chiude corsi e sedi, tutti i valori sono riconosciuti', () => {
  assert.ok(CORSI.length >= 20);
  assert.equal(new Set(CORSI).size, CORSI.length);
  assert.ok(CORSI.every(c => c.length <= 120));
  assert.ok(eCorso(CORSO_ALTRO) && eCorso(CORSI[0]) && !eCorso('x'));
  assert.deepEqual([...SEDI], ['Leonardo', 'Bovisa', 'Altro']);
  assert.ok(SEDI.every(eSede) && PROVENIENZE.every(eProvenienza));
  assert.ok(PROVENIENZE.includes('Instagram (polimi.agora)'));
});

test('invio: il corpo di POST /v1/signups ha i campi del Worker e solo quelli compilati', () => {
  const minimo = corpoIscrizione(creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it' }, 1)!);
  assert.deepEqual(minimo, {
    appId: 'addiofa', nome: 'Mario', email: 'mario@mail.polimi.it',
    consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: ISCRIZIONE_VERSIONE,
  });
  assert.ok(/^[A-Za-z0-9._-]{1,32}$/.test(minimo.consentVersion));
  const pieno = corpoIscrizione(creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it', corso: 'Ingegneria Gestionale', sede: 'Leonardo', provenienza: 'Gruppo o chat', consensi: { noi: true } }, 1)!);
  assert.equal(pieno.corso, 'Ingegneria Gestionale');
  assert.equal(pieno.sede, 'Leonardo');
  assert.equal(pieno.provenienza, 'Gruppo o chat');
  assert.equal(pieno.consensi.noi, true);
});

test('stato: un salvataggio vecchio senza profilo si legge; il profilo si aggiunge e si rilegge senza toccare il resto', () => {
  const vecchio = statoVuoto({ streak: 3, extra: { sfide: { amici: [] } } });
  assert.deepEqual(leggiProgetto(vecchio), {});
  const p = creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it' }, 7)!;
  const nuovo = impostaProfilo(vecchio, p);
  assert.equal(nuovo.streak, 3);
  assert.deepEqual(nuovo.extra!.sfide, { amici: [] });
  assert.equal(leggiProgetto(nuovo).profilo?.nome, 'Mario');
  // l'originale non è stato modificato
  assert.equal(vecchio.extra!.progetto, undefined);
  // dati rovinati: nessun errore
  assert.deepEqual(leggiProgetto({ extra: { progetto: 'rotto' } }), {});
  assert.deepEqual(leggiProgetto({ extra: { progetto: { profilo: { nome: 5 }, collegamento: { scopes: 'x' } } } }), {});
  assert.equal(aggiornaProgetto(nuovo, () => ({})).extra?.progetto, undefined);
});

test('collegamento: i permessi sconosciuti si scartano e quelli obbligatori ci sono sempre', () => {
  const s = statoVuoto({ extra: { progetto: { collegamento: { scopes: ['noi.leaderboard', 'hack', 7], collegatoIl: 1, aggiornatoIl: 2, handle: 'mario1234' } } } });
  const c = leggiProgetto(s).collegamento!;
  assert.deepEqual([...c.scopes].sort(), ['noi.leaderboard', 'profile']);
  assert.equal(c.handle, 'mario1234');
});

test('registrazione: la chiede solo a chi ha già usato l\'app e non ha un profilo', () => {
  assert.equal(serveRegistrazione(statoVuoto()), false);
  assert.equal(serveRegistrazione(statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'yes' } })), true);
  assert.equal(serveRegistrazione(statoVuoto({ stats: { q1: { correct: 1, incorrect: 0, lastSeen: 1, box: 1 } } })), true);
  const p = creaProfilo({ nome: 'Mario', email: 'mario@mail.polimi.it' }, 1)!;
  assert.equal(serveRegistrazione(impostaProfilo(statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'yes' } }), p)), false);
});
