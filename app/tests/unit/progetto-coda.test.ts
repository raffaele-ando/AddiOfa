// Coda di invio dell'iscrizione: stati, nuovi tentativi, errori che si ritentano e quelli che no, nessun blocco senza server.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applicaEsito, attesaDopo, ATTESE_S, attesaResidua, classificaErrore, CHIAVE_CODA, creaCoda, descriviInvio, firmaCorpo, nuovoRecord,
  type ArchivioChiave,
} from '../../src/lib/progetto/coda';
import { AtlasErrore, AtlasNonConfigurato, type CorpoIscrizione } from '../../src/lib/atlas';

const T0 = Date.UTC(2026, 9, 16, 10, 0, 0);
const corpo = (extra: Partial<CorpoIscrizione> = {}): CorpoIscrizione => ({
  appId: 'addiofa', nome: 'Mario', email: 'mario@mail.polimi.it',
  consensi: { noi: false, atlas: false, comunicazioni: false }, consentVersion: 'iscrizione-2026-10-16', ...extra,
});

function archivio(): ArchivioChiave & { mappa: Map<string, string> } {
  const mappa = new Map<string, string>();
  return { mappa, getItem: k => mappa.get(k) ?? null, setItem: (k, v) => { mappa.set(k, v); }, removeItem: k => { mappa.delete(k); } };
}

/** Un server finto: risponde con le risposte in elenco, una per chiamata (l'ultima si ripete). */
function server(...risposte: (number | 'rete')[]) {
  const chiamate: { url: string; init: RequestInit }[] = [];
  const f = (async (url: string, init: RequestInit) => {
    chiamate.push({ url, init });
    const r = risposte[Math.min(chiamate.length - 1, risposte.length - 1)];
    if (r === 'rete') throw new TypeError('Failed to fetch');
    return new Response(JSON.stringify(r === 200 ? { ok: true } : { error: `errore ${r}` }), { status: r, headers: { 'Content-Type': 'application/json' } });
  }) as unknown as typeof fetch;
  return { f, chiamate };
}

function nuova(opz: { fetchImpl?: typeof fetch; baseUrl?: string | undefined; online?: boolean; t?: { v: number } } = {}) {
  const arch = archivio();
  const t = opz.t ?? { v: T0 };
  const c = creaCoda({ archivio: arch, fetchImpl: opz.fetchImpl, baseUrl: 'baseUrl' in opz ? opz.baseUrl : 'https://atlas.test', ora: () => t.v, online: () => opz.online !== false });
  return { c, arch, t };
}

test('attese: 30 s, 1 min, 2 min, 5 min, 15 min, 1 h, poi ogni 6 h', () => {
  assert.deepEqual(ATTESE_S, [30, 60, 120, 300, 900, 3600, 21600]);
  assert.equal(attesaDopo(1), 30_000);
  assert.equal(attesaDopo(4), 300_000);
  assert.equal(attesaDopo(99), 21_600_000);
  assert.equal(attesaDopo(0), 30_000);
});

test('invio riuscito: stato «inviata», il corpo con i dati personali non resta nella coda', async () => {
  const s = server(200);
  const { c, arch } = nuova({ fetchImpl: s.f });
  const r = await c.accoda(corpo());
  assert.equal(r?.stato, 'inviata');
  assert.equal(r?.corpo, undefined);
  assert.equal(r?.inviataIl, T0);
  assert.equal(s.chiamate.length, 1);
  assert.equal(s.chiamate[0].url, 'https://atlas.test/v1/signups');
  assert.equal(s.chiamate[0].init.method, 'POST');
  assert.equal(new Headers(s.chiamate[0].init.headers).get('Authorization'), null, 'l\'iscrizione è pubblica: niente token');
  assert.deepEqual(JSON.parse(String(s.chiamate[0].init.body)), corpo());
  assert.ok(!arch.mappa.get(CHIAVE_CODA)!.includes('mario@'), 'l\'email non resta nella chiave della coda');
  assert.equal(descriviInvio(r, T0).chiave, 'inviata');
});

test('senza indirizzo del servizio: «in attesa di collegamento», nessuna chiamata, nessun orologio, nessun blocco', async () => {
  const s = server(200);
  const { c } = nuova({ fetchImpl: s.f, baseUrl: undefined });
  const r = await c.accoda(corpo());
  assert.equal(r?.stato, 'in-attesa');
  assert.equal(r?.motivo, 'non-configurato');
  assert.equal(r?.tentativi, 0);
  assert.equal(r?.prossimoTentativo, undefined);
  assert.equal(s.chiamate.length, 0);
  const v = descriviInvio(r, T0);
  assert.equal(v.chiave, 'in-attesa');
  assert.equal(v.titolo, 'In attesa di collegamento');
  assert.ok(/non è collegato/.test(v.dettaglio) && /su questo dispositivo/.test(v.dettaglio));
  // il corpo resta: quando il servizio ci sarà, parte
  assert.ok(r?.corpo);
});

test('offline: non conta come tentativo e riparte quando torna la rete', async () => {
  const s = server(200);
  let su = false;
  const arch = archivio();
  const c = creaCoda({ archivio: arch, fetchImpl: s.f, baseUrl: 'https://atlas.test', ora: () => T0, online: () => su });
  let r = await c.accoda(corpo());
  assert.equal(r?.motivo, 'offline');
  assert.equal(r?.tentativi, 0);
  assert.equal(s.chiamate.length, 0);
  su = true;
  r = await c.prova();
  assert.equal(r?.stato, 'inviata');
  assert.equal(s.chiamate.length, 1);
});

test('rete o server in errore: si ritenta con attese crescenti e poi parte', async () => {
  const s = server('rete', 503, 429, 200);
  const { c, t } = nuova({ fetchImpl: s.f });
  let r = await c.accoda(corpo());
  assert.equal(r?.stato, 'in-attesa');
  assert.equal(r?.motivo, 'rete');
  assert.equal(r?.tentativi, 1);
  assert.equal(r?.prossimoTentativo, T0 + 30_000);
  // troppo presto: nessuna nuova chiamata
  t.v = T0 + 10_000;
  r = await c.prova();
  assert.equal(s.chiamate.length, 1);
  assert.equal(attesaResidua(r!, t.v), 20_000);
  assert.ok(/tra 20 secondi/.test(descriviInvio(r, t.v).dettaglio));
  // scaduta l'attesa: secondo tentativo, 503
  t.v = T0 + 30_000;
  r = await c.prova();
  assert.equal(s.chiamate.length, 2);
  assert.equal(r?.motivo, 'server');
  assert.equal(r?.tentativi, 2);
  assert.equal(r?.prossimoTentativo, t.v + 60_000);
  // terzo: 429
  t.v += 60_000;
  r = await c.prova();
  assert.equal(r?.motivo, 'limite');
  assert.equal(r?.tentativi, 3);
  assert.equal(r?.prossimoTentativo, t.v + 120_000);
  // quarto: arriva
  t.v += 120_000;
  r = await c.prova();
  assert.equal(r?.stato, 'inviata');
  assert.equal(r?.tentativi, 4);
  assert.equal(s.chiamate.length, 4);
  // da qui non parte più niente
  t.v += 10 * 3600_000;
  await c.prova();
  assert.equal(s.chiamate.length, 4);
});

test('«Riprova» ignora l\'attesa', async () => {
  const s = server('rete', 200);
  const { c } = nuova({ fetchImpl: s.f });
  await c.accoda(corpo());
  const r = await c.riprova();
  assert.equal(r?.stato, 'inviata');
  assert.equal(s.chiamate.length, 2);
});

test('dati rifiutati (400): stato «rifiutata», non si ritenta da soli', async () => {
  const s = server(400);
  const { c, t } = nuova({ fetchImpl: s.f });
  let r = await c.accoda(corpo());
  assert.equal(r?.stato, 'rifiutata');
  assert.equal(r?.prossimoTentativo, undefined);
  assert.ok(/errore 400/.test(r?.messaggio ?? ''));
  assert.equal(descriviInvio(r, t.v).chiave, 'rifiutata');
  t.v += 24 * 3600_000;
  r = await c.prova();
  assert.equal(s.chiamate.length, 1);
  // salvando di nuovo (anche con gli stessi dati) si prova un'altra volta; qui il server dice ancora no
  const ancora = await c.accoda(corpo());
  assert.equal(s.chiamate.length, 2);
  assert.equal(ancora?.stato, 'rifiutata');
});

test('classificazione: 4xx = dati sbagliati; rete, 408, 429, 5xx e indirizzo sbagliato = si ritenta', () => {
  assert.deepEqual(classificaErrore(new AtlasNonConfigurato()), { tipo: 'attesa', motivo: 'non-configurato', contaTentativo: false });
  assert.equal(classificaErrore(new AtlasErrore(0, 'x')).tipo, 'attesa');
  for (const s of [408, 429, 500, 502, 503, 404, 405]) assert.equal(classificaErrore(new AtlasErrore(s, 'x')).tipo, 'attesa', String(s));
  for (const s of [400, 401, 403, 409, 413, 422]) assert.equal(classificaErrore(new AtlasErrore(s, 'x')).tipo, 'rifiutata', String(s));
  assert.equal(classificaErrore(new Error('boh')).tipo, 'attesa');
});

test('stessi dati: non si rinvia; dati cambiati (corso, consenso): si rinvia', async () => {
  const s = server(200);
  const { c } = nuova({ fetchImpl: s.f });
  await c.accoda(corpo());
  await c.accoda(corpo());
  assert.equal(s.chiamate.length, 1);
  const r = await c.accoda(corpo({ corso: 'Ingegneria Gestionale' }));
  assert.equal(s.chiamate.length, 2);
  assert.equal(r?.stato, 'inviata');
  await c.accoda(corpo({ corso: 'Ingegneria Gestionale', consensi: { noi: true, atlas: false, comunicazioni: false } }));
  assert.equal(s.chiamate.length, 3);
  assert.notEqual(firmaCorpo(corpo()), firmaCorpo(corpo({ consensi: { noi: false, atlas: true, comunicazioni: false } })));
});

test('un profilo cambiato mentre l\'invio è in corso non viene segnato come inviato per sbaglio', async () => {
  let sblocca!: () => void;
  const fermo = new Promise<void>(r => { sblocca = r; });
  const chiamate: string[] = [];
  const f = (async (_u: string, init: RequestInit) => {
    chiamate.push(JSON.parse(String(init.body)).nome);
    if (chiamate.length === 1) await fermo;
    return new Response('{"ok":true}', { status: 200 });
  }) as unknown as typeof fetch;
  const { c, t } = nuova({ fetchImpl: f });
  const primo = c.accoda(corpo({ nome: 'Mario' }));
  await new Promise(r => setTimeout(r, 5));
  t.v += 1000;
  const secondo = c.accoda(corpo({ nome: 'Maria' }));
  await new Promise(r => setTimeout(r, 5));
  sblocca();
  await Promise.all([primo, secondo]);
  const r = c.leggi();
  assert.equal(r?.stato, 'inviata');
  assert.equal(r?.firma, firmaCorpo(corpo({ nome: 'Maria' })));
  assert.deepEqual(chiamate, ['Mario', 'Maria']);
});

test('chiusura a metà invio: alla riapertura lo stato torna «in attesa» e riparte', async () => {
  const arch = archivio();
  const rec = { ...nuovoRecord(corpo(), T0), stato: 'invio' as const };
  arch.setItem(CHIAVE_CODA, JSON.stringify(rec));
  const s = server(200);
  const c = creaCoda({ archivio: arch, fetchImpl: s.f, baseUrl: 'https://atlas.test', ora: () => T0 + 5000, online: () => true });
  assert.equal(c.leggi()?.stato, 'in-attesa');
  const r = await c.prova();
  assert.equal(r?.stato, 'inviata');
});

test('chiave rovinata o di altra versione: si ignora senza errori', () => {
  const arch = archivio();
  for (const grezzo of ['{', 'null', '[]', '{"versione":2}', '{"versione":1,"firma":"x","stato":"boh"}']) {
    arch.setItem(CHIAVE_CODA, grezzo);
    const c = creaCoda({ archivio: arch, baseUrl: 'https://atlas.test' });
    assert.equal(c.leggi(), null, grezzo);
  }
});

test('svuota: toglie la coda e avvisa chi ascolta', async () => {
  const s = server(200);
  const { c, arch } = nuova({ fetchImpl: s.f });
  let avvisi = 0;
  c.iscriviti(() => { avvisi++; });
  await c.accoda(corpo());
  const prima = avvisi;
  c.svuota();
  assert.equal(c.leggi(), null);
  assert.equal(arch.mappa.has(CHIAVE_CODA), false);
  assert.ok(avvisi > prima);
});

test('istantanea stabile: lo stesso oggetto finché la chiave non cambia (serve a React)', async () => {
  const { c } = nuova({ fetchImpl: server(200).f });
  await c.accoda(corpo());
  assert.equal(c.istantanea(), c.istantanea());
});

test('applicaEsito è pura: non cambia il record di partenza', () => {
  const r = nuovoRecord(corpo(), T0);
  const copia = JSON.stringify(r);
  applicaEsito(r, { tipo: 'ok' }, T0 + 1);
  applicaEsito(r, { tipo: 'rifiutata', messaggio: 'x' }, T0 + 1);
  applicaEsito(r, { tipo: 'attesa', motivo: 'rete', contaTentativo: true }, T0 + 1);
  assert.equal(JSON.stringify(r), copia);
});

test('descrizione: profilo salvato ma mai messo in coda = solo su questo dispositivo', () => {
  assert.equal(descriviInvio(null, T0).chiave, 'solo-locale');
});
