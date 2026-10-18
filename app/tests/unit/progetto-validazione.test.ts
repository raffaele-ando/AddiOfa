// Registrazione: controllo di nome ed email PoliMi (formato e dominio, mai «verificata»), consensi sempre spenti, profilo salvato nello stato.
import test from 'node:test';
import assert from 'node:assert/strict';
import { controllaDatiMinimi, controllaEmailPolimi, dominioPolimi, pulisciNome } from '../../src/lib/progetto/validazione';
import {
  aggiornaProgetto, CONSENSI_VUOTI, corpoIscrizione, creaProfilo, impostaProfilo, leggiProfilo, leggiProgetto, segnaEmailVerificata, serveRegistrazione,
} from '../../src/lib/progetto/profilo';
import { eProvenienza, nomeProvenienza, PROVENIENZE, provenienzaDa } from '../../src/lib/progetto/corsi';
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

test('dati minimi: l\'email è obbligatoria; il nome solo se non si ricava dall\'email', () => {
  assert.deepEqual(controllaDatiMinimi({ nome: '', email: 'mario.rossi@mail.polimi.it' }), {});
  assert.deepEqual(controllaDatiMinimi({ nome: 'Mario', email: '10501234@polimi.it' }), {});
  const matricola = controllaDatiMinimi({ nome: '', email: '10501234@polimi.it' });
  assert.ok(matricola.nome && !matricola.email);
  const e = controllaDatiMinimi({ nome: '', email: 'mario@gmail.com' });
  assert.ok(e.email && /polimi/.test(e.email));
  assert.ok(controllaDatiMinimi({ nome: 'x'.repeat(90), email: 'mario.rossi@polimi.it' }).nome);
});

test('consensi: partono tutti spenti e solo «true» esplicito vale come sì', () => {
  assert.deepEqual({ ...CONSENSI_VUOTI }, { noi: false, atlas: false, comunicazioni: false });
  assert.ok(Object.isFrozen(CONSENSI_VUOTI));
  const senza = creaProfilo({ email: 'mario.rossi@mail.polimi.it' }, 1000)!;
  assert.deepEqual(senza.consensi, { noi: false, atlas: false, comunicazioni: false });
  const storti = creaProfilo({ email: 'mario.rossi@mail.polimi.it', consensi: { noi: 'sì' as unknown as boolean, atlas: 1 as unknown as boolean, comunicazioni: undefined } }, 1000)!;
  assert.deepEqual(storti.consensi, { noi: false, atlas: false, comunicazioni: false });
  const uno = creaProfilo({ email: 'mario.rossi@mail.polimi.it', consensi: { atlas: true } }, 1000)!;
  assert.deepEqual(uno.consensi, { noi: false, atlas: true, comunicazioni: false });
});

test('profilo: il nome si ricava dall\'email; «verificata» solo se lo era per la stessa email', () => {
  const p = creaProfilo({ email: 'Maria.Rossi@Mail.Polimi.it' }, 5)!;
  assert.equal(p.nome, 'Maria Rossi');
  assert.equal(p.email, 'maria.rossi@mail.polimi.it');
  assert.equal(p.emailVerificata, false);
  assert.equal(p.completato, true);
  assert.equal(creaProfilo({ email: 'maria.rossi@mail.polimi.it', nome: '  Maria  Chiara Rossi ' }, 5)!.nome, 'Maria Chiara Rossi');
  // matricola: il nome non si ricava, serve scriverlo
  assert.equal(creaProfilo({ email: '10501234@polimi.it' }, 5), null);
  assert.equal(creaProfilo({ email: '10501234@polimi.it', nome: 'Mario' }, 5)?.nome, 'Mario');
  // salvando di nuovo con la stessa email resta verificata; con un'altra email no
  const verificata = { ...p, emailVerificata: true };
  assert.equal(creaProfilo({ email: 'maria.rossi@mail.polimi.it' }, 9, verificata)!.emailVerificata, true);
  assert.equal(creaProfilo({ email: 'maria.bianchi@mail.polimi.it' }, 9, verificata)!.emailVerificata, false);
  assert.equal(creaProfilo({ email: 'maria.rossi@mail.polimi.it' }, 9, verificata)!.creatoIl, 5);
});

test('segnaEmailVerificata: solo per l\'email del profilo', () => {
  const p = creaProfilo({ email: 'maria.rossi@mail.polimi.it' }, 5)!;
  const s = impostaProfilo(statoVuoto(), p);
  assert.equal(leggiProgetto(segnaEmailVerificata(s, 'altra.persona@mail.polimi.it')).profilo?.emailVerificata, false);
  assert.equal(leggiProgetto(segnaEmailVerificata(s, ' Maria.Rossi@Mail.Polimi.it ')).profilo?.emailVerificata, true);
  assert.equal(segnaEmailVerificata(statoVuoto(), 'maria.rossi@mail.polimi.it').extra, undefined);
});

test('profilo: percorso di studi con ids ammessi; fuori elenco si scarta', () => {
  const p = creaProfilo({ email: 'maria.rossi@mail.polimi.it', scuola: 'icat', sede: 'Lecco', livello: 'triennale', corso: 'Un corso', corsoId: 'ic-c-t-1', anno: 2, provenienza: 'instagram' }, 1)!;
  assert.deepEqual([p.scuola, p.sede, p.livello, p.corso, p.corsoId, p.anno, p.provenienza], ['icat', 'lecco', 'triennale', 'Un corso', 'ic-c-t-1', 2, 'instagram']);
  const x = creaProfilo({ email: 'maria.rossi@mail.polimi.it', scuola: 'luna', sede: 'Via Lattea 1', livello: 'dottorato', anno: 9, provenienza: 'boh' }, 1)!;
  assert.deepEqual([x.scuola, x.sede, x.livello, x.anno, x.provenienza], [undefined, undefined, undefined, undefined, undefined]);
  assert.equal(creaProfilo({ email: 'maria.rossi@mail.polimi.it', anno: 2.5 }, 1)!.anno, undefined);
});

test('profilo salvato dalla prima versione (nome scritto, sede e provenienza a testo): si rilegge', () => {
  const vecchio = leggiProfilo({ nome: 'Maria Rossi', email: 'maria.rossi@mail.polimi.it', emailVerificata: false, corso: 'Ingegneria Gestionale', sede: 'Bovisa', provenienza: 'Instagram (polimi.agora)', consensi: { noi: true, atlas: false, comunicazioni: false }, versioneInformativa: 'iscrizione-2026-10-16', creatoIl: 1, aggiornatoIl: 2 })!;
  assert.equal(vecchio.nome, 'Maria Rossi');
  assert.equal(vecchio.sede, 'bovisa');
  assert.equal(vecchio.provenienza, 'instagram');
  assert.equal(vecchio.corso, 'Ingegneria Gestionale');
  assert.equal(vecchio.completato, true);
  assert.equal(vecchio.consensi.noi, true);
});

test('profilo rovinato: email non valida = nessun profilo; nome mancante si ricava; consensi solo se true', () => {
  assert.equal(leggiProfilo({ nome: 'Mario', email: 'x@gmail.com' }), undefined);
  assert.equal(leggiProfilo({ nome: 'Mario' }), undefined);
  assert.equal(leggiProfilo(null), undefined);
  assert.equal(leggiProfilo('testo'), undefined);
  assert.equal(leggiProfilo({ email: 'maria.rossi@mail.polimi.it', nome: 5 })?.nome, 'Maria Rossi');
  assert.equal(leggiProfilo({ email: '10501234@polimi.it' }), undefined);
  assert.deepEqual(leggiProfilo({ email: 'maria.rossi@mail.polimi.it', consensi: { noi: 1, atlas: 'true', comunicazioni: true } })!.consensi, { noi: false, atlas: false, comunicazioni: true });
  assert.equal(leggiProfilo({ email: 'maria.rossi@mail.polimi.it', completato: false })!.completato, false);
});

test('provenienza: quattro id; le risposte della prima versione si rileggono', () => {
  assert.deepEqual(PROVENIENZE.map(p => p.id), ['gruppo-chat', 'instagram', 'amici', 'altro']);
  assert.ok(PROVENIENZE.every(p => eProvenienza(p.id) && /^[a-z0-9-]{2,30}$/.test(p.id)));
  assert.equal(provenienzaDa('Gruppo o chat'), 'gruppo-chat');
  assert.equal(provenienzaDa('Amici o compagni'), 'amici');
  assert.equal(provenienzaDa('Ricerca su internet'), 'altro');
  assert.equal(provenienzaDa('boh'), undefined);
  assert.equal(nomeProvenienza('instagram'), 'Instagram');
});

test('invio: il corpo di POST /v1/signups ha i campi del Worker e solo quelli compilati', () => {
  const minimo = corpoIscrizione(creaProfilo({ email: 'maria.rossi@mail.polimi.it' }, 1)!);
  assert.deepEqual(minimo, {
    appId: 'addiofa', nome: 'Maria Rossi', email: 'maria.rossi@mail.polimi.it',
    consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: ISCRIZIONE_VERSIONE,
  });
  assert.ok(/^[A-Za-z0-9._-]{1,32}$/.test(minimo.consentVersion));
  const pieno = corpoIscrizione(creaProfilo({ email: 'maria.rossi@mail.polimi.it', scuola: 'ing-ind-inf', sede: 'leonardo', livello: 'magistrale', corso: 'Ingegneria Gestionale', corsoId: 'x', anno: 2, provenienza: 'amici', consensi: { noi: true } }, 1)!);
  assert.deepEqual(pieno, {
    appId: 'addiofa', nome: 'Maria Rossi', email: 'maria.rossi@mail.polimi.it',
    scuola: 'ing-ind-inf', sede: 'leonardo', livello: 'magistrale', corso: 'Ingegneria Gestionale', anno: 2, provenienza: 'amici',
    consensi: { noi: true, atlas: false, comunicazioni: false }, consentVersion: ISCRIZIONE_VERSIONE,
  });
});

test('stato: un salvataggio vecchio senza profilo si legge; il profilo si aggiunge e si rilegge senza toccare il resto', () => {
  const vecchio = statoVuoto({ streak: 3, extra: { sfide: { amici: [] } } });
  assert.deepEqual(leggiProgetto(vecchio), {});
  const p = creaProfilo({ email: 'mario.rossi@mail.polimi.it' }, 7)!;
  const nuovo = impostaProfilo(vecchio, p);
  assert.equal(nuovo.streak, 3);
  assert.deepEqual(nuovo.extra!.sfide, { amici: [] });
  assert.equal(leggiProgetto(nuovo).profilo?.nome, 'Mario Rossi');
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
  const p = creaProfilo({ email: 'mario.rossi@mail.polimi.it' }, 1)!;
  assert.equal(serveRegistrazione(impostaProfilo(statoVuoto({ onboarding: { completedAt: 1, hasCertification: false, hasOfa: 'yes' } }), p)), false);
});
