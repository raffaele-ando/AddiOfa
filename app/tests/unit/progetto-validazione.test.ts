// Controlli di email e @nome utente, e profilo locale (percorso, provenienza, badge studente): niente email né nome né consensi nel dispositivo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { controllaEmail, controllaEmailPolimi, controllaHandle, dominioPolimi } from '../../src/lib/progetto/validazione';
import {
  aggiornaProgetto, impostaPercorso, impostaProfilo, impostaProvenienza, leggiPercorso, leggiProfilo, leggiProgetto, segnaStudentePoliMi, togliStudentePoliMi,
} from '../../src/lib/progetto/profilo';
import { eProvenienza, nomeProvenienza, PROVENIENZE, provenienzaDa } from '../../src/lib/progetto/corsi';
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

test('email qualunque (accesso e comunicazioni): normalizzata, senza vincolo di dominio', () => {
  assert.deepEqual(controllaEmail('  Anna.Verdi@Gmail.COM '), { ok: true, email: 'anna.verdi@gmail.com' });
  assert.deepEqual(controllaEmail('x@polimi.it'), { ok: true, email: 'x@polimi.it' });
  assert.deepEqual(controllaEmail(''), { ok: false, motivo: 'vuota' });
  for (const e of ['senzachiocciola', 'x@@a.it', 'x..y@a.it', 'x@a', 'x y@a.it']) assert.deepEqual(controllaEmail(e), { ok: false, motivo: 'formato' }, e);
});

test('@nome utente: 3-20 caratteri tra a-z, 0-9, _ e . (come il Worker)', () => {
  assert.equal(controllaHandle('  Mario_R.01 '), 'mario_r.01');
  for (const h of ['ab', 'a'.repeat(21), 'con spazio', 'àccento', 'x-y', '']) assert.equal(controllaHandle(h), null, h);
});

test('profilo: tiene percorso, provenienza e badge; email, nome e consensi delle versioni vecchie si scartano', () => {
  const vecchio = leggiProfilo({
    nome: 'Maria Rossi', email: 'maria.rossi@mail.polimi.it', emailVerificata: false, corso: 'Ingegneria Gestionale', sede: 'Bovisa',
    provenienza: 'Instagram (polimi.agora)', consensi: { noi: true, atlas: false, comunicazioni: true }, versioneInformativa: 'iscrizione-2026-10-16', creatoIl: 1, aggiornatoIl: 2,
  })!;
  assert.equal(vecchio.sede, 'bovisa');
  assert.equal(vecchio.provenienza, 'instagram');
  assert.equal(vecchio.corso, 'Ingegneria Gestionale');
  assert.equal(vecchio.studentePoliMi, undefined);
  assert.deepEqual(Object.keys(vecchio).sort(), ['aggiornatoIl', 'corso', 'provenienza', 'sede']);
  const json = JSON.stringify(vecchio);
  assert.ok(!/maria|rossi|consensi|noi|comunicazioni|email/i.test(json.replace('Ingegneria Gestionale', '')), json);
});

test('profilo: un\'email PoliMi segnata «verificata» da una versione vecchia diventa il badge, una non verificata sparisce', () => {
  const v = leggiProfilo({ email: 'Maria.Rossi@Mail.Polimi.it', emailVerificata: true, aggiornatoIl: 77 })!;
  assert.deepEqual(v.studentePoliMi, { email: 'maria.rossi@mail.polimi.it', verificataIl: 77 });
  assert.equal(leggiProfilo({ email: 'maria.rossi@mail.polimi.it', emailVerificata: false }), undefined);
  assert.equal(leggiProfilo({ email: 'x@gmail.com', emailVerificata: true }), undefined);
});

test('profilo rovinato o vuoto: nessun profilo e nessun errore', () => {
  for (const x of [null, undefined, 'testo', 5, [], {}, { nome: 'Mario' }, { scuola: 'luna', anno: 9, provenienza: 'boh' }]) assert.equal(leggiProfilo(x), undefined);
});

test('percorso di studi: ids ammessi; fuori elenco si scarta; sede vecchia a testo si rilegge', () => {
  assert.deepEqual(leggiPercorso({ scuola: 'icat', sede: 'Lecco', livello: 'triennale', corso: 'Un corso', corsoId: 'ic-c-t-1', anno: 2 }),
    { scuola: 'icat', sede: 'lecco', livello: 'triennale', corso: 'Un corso', corsoId: 'ic-c-t-1', anno: 2 });
  assert.deepEqual(leggiPercorso({ scuola: 'luna', sede: 'Via Lattea 1', livello: 'dottorato', anno: 9 }), {});
  assert.deepEqual(leggiPercorso({ anno: 2.5 }), {});
});

test('impostaPercorso e impostaProvenienza: si aggiungono e si tolgono senza toccare il resto', () => {
  let s = statoVuoto({ streak: 3, extra: { sfide: { amici: [] } } });
  s = impostaPercorso(s, { scuola: 'icat', sede: 'lecco', livello: 'triennale', corso: 'Un corso', corsoId: 'ic-c-t-1', anno: 2 }, 10);
  s = impostaProvenienza(s, 'amici', 11);
  assert.equal(s.streak, 3);
  assert.deepEqual(s.extra!.sfide, { amici: [] });
  const p = leggiProgetto(s).profilo!;
  assert.deepEqual([p.scuola, p.corso, p.anno, p.provenienza, p.aggiornatoIl], ['icat', 'Un corso', 2, 'amici', 11]);
  s = impostaPercorso(s, {}, 12);
  assert.deepEqual([leggiProgetto(s).profilo?.scuola, leggiProgetto(s).profilo?.provenienza], [undefined, 'amici']);
  s = impostaProvenienza(s, undefined, 13);
  assert.equal(leggiProgetto(s).profilo, undefined);
  assert.equal(s.extra!.progetto, undefined); // un profilo vuoto non lascia traccia
  assert.equal(leggiProgetto(impostaProvenienza(statoVuoto(), 'boh')).profilo, undefined);
});

test('badge studente: solo un indirizzo PoliMi, e si toglie', () => {
  const s0 = statoVuoto();
  assert.equal(segnaStudentePoliMi(s0, 'x@gmail.com'), s0);
  const s = segnaStudentePoliMi(s0, ' Maria.Rossi@Mail.Polimi.it ', 5);
  assert.deepEqual(leggiProgetto(s).profilo?.studentePoliMi, { email: 'maria.rossi@mail.polimi.it', verificataIl: 5 });
  assert.equal(leggiProgetto(togliStudentePoliMi(s)).profilo, undefined);
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

test('stato: un salvataggio vecchio si legge; dati rovinati non fanno errori', () => {
  assert.deepEqual(leggiProgetto(statoVuoto({ streak: 3 })), {});
  assert.deepEqual(leggiProgetto({ extra: { progetto: 'rotto' } }), {});
  assert.deepEqual(leggiProgetto({ extra: { progetto: { profilo: { nome: 5 }, collegamento: { scopes: 'x' } } } }), {});
  const nuovo = impostaProfilo(statoVuoto(), { provenienza: 'altro', aggiornatoIl: 1 });
  assert.equal(aggiornaProgetto(nuovo, () => ({})).extra?.progetto, undefined);
});

test('collegamento: i permessi sconosciuti si scartano e quelli obbligatori ci sono sempre', () => {
  const s = statoVuoto({ extra: { progetto: { collegamento: { scopes: ['noi.leaderboard', 'hack', 'progress.share', 7], collegatoIl: 1, aggiornatoIl: 2, handle: 'mario1234' } } } });
  const c = leggiProgetto(s).collegamento!;
  assert.deepEqual([...c.scopes].sort(), ['noi.leaderboard', 'profile']);
  assert.equal(c.handle, 'mario1234');
});
