// Progressi, vista «Panoramica» (concept 06.9 e 18.2): un grafico che racconta una storia («Probabilità di superare il test», con il valore di oggi e
// l'obiettivo tratteggiato), tre numeri con il loro nome, i risultati delle simulazioni con la soglia scritta, l'elenco «Per argomento» e i livelli.
// Tutto viene da lib/profilo/numeri.ts e dalle stesse funzioni di Home e ATLAS: una grandezza ha un solo nome e un solo valore in tutta l'app.
// Il grafico è disegnato in HTML e in un SVG senza testi; i numeri e le date sono HTML.
import { useEffect, useMemo, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { provider } from '../../../access';
import { REAL_TEST_PASS_MARK } from '../../../config/offer';
import { serieStime } from '../../../components/home/stima';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { analizzaLivello } from '../../../lib/servizi/analisi';
import { livelloAttuale } from '../../../lib/profilo/livello';
import { normalizzaObiettivi, OBIETTIVI_INIZIALI, type ObiettiviDati } from '../../../lib/profilo/obiettivi';
import { andamentoSimulazioni, formatTempoStudio, tessereStatistiche } from '../../../lib/studio/statistiche';
import { NOMI_MESI } from '../../../lib/profilo/giorni';
import { BarraTono, Carta, IconaTono, TONI, type Tono } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { tonoAccuratezza, TESTO_TONO } from '../servizi/tono';
import { useBanco, useNumeri } from './componenti';

const data = (ms: number) => { const d = new Date(ms); return `${d.getDate()} ${NOMI_MESI[d.getMonth()].slice(0, 3)}`; };
const virgola = (n: number) => String(n).replace('.', ',');

/** Grafico della probabilità: una linea fra le stime MISURATE (dopo il test di livello e dopo ogni simulazione), l'ultimo punto scritto, l'obiettivo tratteggiato. */
function GraficoProbabilita() {
  const { appState } = useExtra();
  const n = useNumeri();
  const [grezzi] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const target = normalizzaObiettivi(grezzi).stimaTarget;
  const punti = useMemo(() => serieStime(appState, 6), [appState]);
  const date = useMemo(() => andamentoSimulazioni(appState, 0).map(p => p.data), [appState]);
  // le date delle simulazioni, in coda: il test di livello non ha una data in archivio e si chiama per nome
  const nSim = punti.filter(p => p.tipo === 'simulazione').length;
  const dateSim = date.slice(Math.max(0, date.length - nSim));
  let k = 0;
  const etichette = punti.map(p => (p.tipo === 'diagnostico' ? 'Test di livello' : dateSim[k] ? data(dateSim[k++]) : `Sim. ${++k}`));

  const larghezza = 100, altezza = 100;
  const x = (i: number) => (punti.length === 1 ? 50 : 4 + (i / (punti.length - 1)) * (larghezza - 8));
  const y = (p: number) => altezza - 4 - Math.min(1, Math.max(0, p)) * (altezza - 8);
  const linea = punti.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(2)},${y(p.p).toFixed(2)}`).join(' ');
  const area = `${linea} L${x(punti.length - 1).toFixed(2)},${altezza} L${x(0).toFixed(2)},${altezza} Z`;

  return (
    <Carta as="section">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[17px] leading-[24px] font-bold text-testo">Probabilità di superare il test</h2>
        {n.probabilita !== null && <p className="text-[26px] leading-[30px] font-extrabold tabular-nums text-testo" aria-label={`Ora ${n.probabilita} per cento`}>{n.probabilita}%</p>}
      </div>
      {punti.length >= 2 ? (
        <>
          <div className="relative mt-4 h-[150px]" role="img"
            aria-label={`Probabilità dopo ogni misura: ${punti.map((p, i) => `${etichette[i]} ${Math.round(p.p * 100)} per cento`).join(', ')}. Obiettivo ${target} per cento.`}>
            <svg viewBox={`0 0 ${larghezza} ${altezza}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
              {[0, 50, 100].map(g => <line key={g} x1="0" x2={larghezza} y1={y(g / 100)} y2={y(g / 100)} stroke="var(--color-linea)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
              <line x1="0" x2={larghezza} y1={y(target / 100)} y2={y(target / 100)} stroke="var(--color-testo-tenue)" strokeWidth="1.5" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
              <path d={area} fill="var(--color-azione)" fillOpacity="0.12" />
              <path d={linea} fill="none" stroke="var(--color-azione)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <span aria-hidden="true" className="absolute right-0 rounded-md bg-superficie px-1 text-[12px] leading-[16px] font-semibold text-testo-tenue" style={{ top: `calc(${y(target / 100)}% - 18px)` }}>Obiettivo {target}%</span>
            {punti.map((p, i) => (
              <span key={i} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x(i)}%`, top: `${y(p.p)}%` }}>
                <span className={cn('block h-3 w-3 rounded-full border-2 border-superficie bg-azione', i === punti.length - 1 && 'h-4 w-4')} />
                {i === punti.length - 1 && <span className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-azione px-1.5 py-0.5 text-[12px] leading-[16px] font-bold tabular-nums text-azione-su">{Math.round(p.p * 100)}%</span>}
              </span>
            ))}
          </div>
          <div aria-hidden="true" className="mt-2 flex justify-between gap-1 text-[12px] leading-[16px] font-medium text-testo-tenue">
            {etichette.map((e, i) => <span key={i} className={cn('min-w-0 truncate', i === 0 ? 'text-left' : i === etichette.length - 1 ? 'text-right' : 'text-center')}>{e}</span>)}
          </div>
        </>
      ) : (
        <p data-testo-ok className="mt-3 text-[14px] leading-[20px] text-testo-tenue">
          {n.probabilita !== null ? 'Servono il test di livello e una simulazione per tracciare la linea.' : 'La stima nasce dal test di livello: poi qui compare la linea.'}
        </p>
      )}
    </Carta>
  );
}

/** Tre numeri, ognuno con il suo nome (13 px) e il suo colore: risposte date, tempo di studio, media delle simulazioni. */
function TreNumeri() {
  const { appState } = useExtra();
  const n = useNumeri();
  const t = useMemo(() => tessereStatistiche(appState), [appState]);
  const voci: { icona: NomeIcona; tono: Tono; valore: string; nome: string }[] = [
    { icona: 'risposte', tono: 'azione', valore: String(n.risposte), nome: 'Risposte' },
    { icona: 'tempo', tono: 'medio', valore: formatTempoStudio(t.secondiStudio), nome: 'Tempo di studio' },
    { icona: 'simulazioni', tono: 'alto', valore: n.mediaSimulazioni !== null ? `${virgola(n.mediaSimulazioni)}/30` : '0', nome: n.simulazioni > 0 ? `Media di ${n.simulazioni} ${n.simulazioni === 1 ? 'simulazione' : 'simulazioni'}` : 'Simulazioni' },
  ];
  return (
    <ul className="grid grid-cols-3 gap-3" aria-label="Riepilogo">
      {voci.map(v => (
        <li key={v.nome} className="flex min-w-0 flex-col items-center rounded-[16px] border border-linea bg-superficie px-1.5 py-3.5 text-center shadow-sm dark:shadow-none">
          <IconaTono tono={v.tono} lato={36}><Icona nome={v.icona} size={20} /></IconaTono>
          <span className="mt-2 text-[19px] leading-[24px] font-extrabold tabular-nums text-testo whitespace-nowrap">{v.valore}</span>
          <span className="mt-0.5 text-[12px] leading-[16px] font-medium text-testo-tenue">{v.nome}</span>
        </li>
      ))}
    </ul>
  );
}

/** Le simulazioni una a una: colonna verde dalla soglia in su, ambra sotto; la soglia è tratteggiata e scritta; la legenda ha parola e forma. */
function RisultatiSimulazioni() {
  const { appState } = useExtra();
  const punti = useMemo(() => andamentoSimulazioni(appState, 8), [appState]);
  const migliore = punti.length ? Math.max(...punti.map(p => p.esatte)) : null;
  const totali = Math.max(30, ...punti.map(p => p.totale));
  return (
    <Carta as="section">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] leading-[24px] font-bold text-testo">Ultime simulazioni</h2>
        {migliore !== null && <p className="text-[14px] leading-[20px] font-semibold tabular-nums text-testo-tenue">Migliore {migliore}/{totali}</p>}
      </div>
      {punti.length === 0 ? (
        <p data-testo-ok className="mt-3 text-[14px] leading-[20px] text-testo-tenue">Non hai ancora fatto simulazioni. Qui compare ogni risultato.</p>
      ) : (
        <>
          <div className="relative mt-6 h-[120px]" role="img" aria-label={`Risultati delle ultime ${punti.length} simulazioni: ${punti.map(p => `${p.esatte} su ${p.totale}`).join(', ')}. Soglia ${REAL_TEST_PASS_MARK}.`}>
            <div aria-hidden="true" className="absolute inset-x-0 border-t-2 border-dashed border-testo-tenue/70" style={{ bottom: `${(REAL_TEST_PASS_MARK / totali) * 100}%` }} />
            {/* la soglia si scrive nella colonna a destra, fuori dalle barre: non copre i valori */}
            <span aria-hidden="true" className="absolute right-0 whitespace-nowrap pl-1 text-[12px] leading-[16px] font-semibold text-testo-tenue" style={{ bottom: `calc(${(REAL_TEST_PASS_MARK / totali) * 100}% + 3px)` }}>Soglia {REAL_TEST_PASS_MARK}</span>
            <div aria-hidden="true" className="absolute inset-y-0 left-0 right-[68px] flex items-end gap-2">
              {punti.map(p => {
                const alt = Math.max(4, (p.esatte / totali) * 100);
                const ok = p.esatte >= REAL_TEST_PASS_MARK;
                return (
                  <div key={p.numero} className="relative h-full min-w-0 flex-1">
                    <div className={cn('absolute bottom-0 left-1/2 w-full max-w-[30px] -translate-x-1/2 rounded-t-[6px]', ok ? 'bg-alto' : 'bg-medio-numero')} style={{ height: `${alt}%` }} />
                    <span className="absolute left-1/2 -translate-x-1/2 text-[13px] leading-[16px] font-bold tabular-nums text-testo" style={{ bottom: `calc(${alt}% + 3px)` }}>{p.esatte}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div aria-hidden="true" className="mt-1.5 flex gap-2 pr-[68px]">
            {punti.map(p => <span key={p.numero} className="min-w-0 flex-1 truncate text-center text-[12px] leading-[16px] font-medium text-testo-tenue">{data(p.data)}</span>)}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] leading-[16px] font-semibold" aria-label="Legenda">
            <li className={cn('inline-flex items-center gap-1.5', TONI.alto.testo)}><Icona nome="stato-ok" size={14} />Superata</li>
            <li className={cn('inline-flex items-center gap-1.5', TONI.medio.testo)}><Icona nome="stato-attenzione" size={14} />Sotto soglia</li>
          </ul>
        </>
      )}
    </Carta>
  );
}

/** «Per argomento»: i tre più deboli per primi, con barra e percentuale scritta; il resto è in «Argomenti». */
function PerArgomento({ onTutti }: { onTutti: () => void }) {
  const { appState, vai } = useExtra();
  const an = useMemo(() => analizzaLivello(appState), [appState]);
  const deboli = useMemo(() => an.argomenti.filter(a => a.percento !== null).sort((a, b) => (a.percento ?? 0) - (b.percento ?? 0) || b.risposte - a.risposte).slice(0, 3), [an.argomenti]);
  return (
    <Carta as="section">
      <h2 className="text-[17px] leading-[24px] font-bold text-testo">Per argomento</h2>
      {deboli.length === 0 ? (
        <p data-testo-ok className="mt-2 text-[14px] leading-[20px] text-testo-tenue">Compare dopo tre risposte sullo stesso argomento.</p>
      ) : (
        <>
          <p className="mt-0.5 text-[13px] leading-[18px] text-testo-tenue">I più deboli per primi</p>
          <ul className="mt-3 flex flex-col gap-3">
            {deboli.map(a => {
              const tono = tonoAccuratezza(a.percento) ?? 'azione';
              return (
                <li key={a.id}>
                  <button type="button" onClick={() => { playTapSound(); vai('lezione-dettaglio', { id: a.id }); }} className="brand-premibile block w-full text-left" aria-label={`${a.titolo}: ${a.percento}%`}>
                    <span className="flex items-baseline justify-between gap-3">
                      <span data-testo-ok className="min-w-0 truncate text-[15px] leading-[21px] font-semibold text-testo">{a.titolo}</span>
                      <span className={cn('shrink-0 text-[14px] font-bold tabular-nums', TESTO_TONO[tono])}>{a.percento}%</span>
                    </span>
                    <BarraTono className="mt-1.5 h-1.5" tono={tono} valore={a.percento ?? 0} />
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <button type="button" onClick={() => { playTapSound(); onTutti(); }}
        className="brand-premibile mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-1 rounded-[12px] text-[14px] font-bold text-azione-testo">
        Tutti i {an.argomenti.length} argomenti<Icona nome="avanti" size={16} />
      </button>
    </Carta>
  );
}

/** Domande imparate per livello (A1, A2, B1). */
function PerLivello() {
  const { appState } = useExtra();
  const banco = useBanco();
  const l = useMemo(() => livelloAttuale(appState.stats, banco), [appState.stats, banco]);
  return (
    <Carta as="section">
      <h2 className="text-[17px] leading-[24px] font-bold text-testo">Per livello</h2>
      <ul className="mt-3 flex flex-col gap-3">
        {l.quote.map(q => (
          <li key={q.livello}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[15px] leading-[21px] font-semibold text-testo">{q.livello}</span>
              <span className="text-[14px] font-semibold tabular-nums text-testo-tenue">{q.imparate} di {q.totale} imparate</span>
            </div>
            <BarraTono className="mt-1.5 h-2" tono="viola" valore={q.totale ? (q.imparate / q.totale) * 100 : 0} />
          </li>
        ))}
      </ul>
    </Carta>
  );
}

/** Le domande sbagliate più spesso, con la risposta esatta: testo e risposta arrivano dal provider (le domande stanno nel sito). */
function ErroriFrequenti() {
  const { appState } = useExtra();
  const errori = useMemo(() => Object.entries(appState.stats ?? {})
    .map(([id, s]) => {
      const giuste = s.correct || 0, sbagliate = s.incorrect || 0, omesse = s.omitted || 0;
      const tot = giuste + sbagliate + omesse;
      return { id, giuste, sbagliate, omesse, tot, tasso: tot > 0 ? (sbagliate + omesse) / tot : 0 };
    })
    .filter(e => e.sbagliate > 0 || e.omesse > 0)
    .sort((a, b) => b.tasso - a.tasso || b.sbagliate - a.sbagliate)
    .slice(0, 5), [appState.stats]);
  const chiave = errori.map(e => e.id).join(',');
  const [testi, setTesti] = useState<Record<string, { domanda: string; risposta: string }>>({});
  useEffect(() => {
    if (!chiave) return;
    let vivo = true;
    (async () => {
      try {
        const domande = await provider.getQuestions(chiave.split(','));
        const out: Record<string, { domanda: string; risposta: string }> = {};
        await Promise.all(domande.map(async q => {
          let risposta = '';
          try { const g = await provider.grade(q.id, -1); risposta = q.options[g.correctIndex] ?? ''; } catch { /* la risposta esatta è un di più */ }
          out[q.id] = { domanda: q.prompt, risposta };
        }));
        if (vivo) setTesti(t => ({ ...t, ...out }));
      } catch { /* senza testo si mostrano i puntini */ }
    })();
    return () => { vivo = false; };
  }, [chiave]);
  return (
    <Carta as="section">
      <h2 className="text-[17px] leading-[24px] font-bold text-testo">Errori più frequenti</h2>
      {errori.length === 0 ? (
        <p data-testo-ok className="mt-2 flex items-center gap-2 text-[14px] leading-[20px] text-testo-tenue"><Icona nome="stato-ok" size={18} className="text-alto-numero" />Nessun errore da rivedere.</p>
      ) : (
        <ul className="mt-3 flex flex-col divide-y divide-linea">
          {errori.map(e => (
            <li key={e.id} className="py-3 first:pt-0 last:pb-0">
              <p data-testo-ok className="line-clamp-2 text-[15px] leading-[21px] font-semibold text-testo">{testi[e.id]?.domanda ?? '…'}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] leading-[18px] tabular-nums">
                <span className="font-semibold text-errore-testo">Sbagliata {e.sbagliate + e.omesse} su {e.tot}</span>
                {testi[e.id]?.risposta && <span data-testo-ok className="text-testo-tenue">Risposta: <span className="font-semibold text-alto-testo">{testi[e.id].risposta}</span></span>}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Carta>
  );
}

export default function PanoramicaProgressi({ onArgomenti }: { onArgomenti: () => void }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <GraficoProbabilita />
      <TreNumeri />
      <RisultatiSimulazioni />
      <PerArgomento onTutti={onArgomenti} />
      <PerLivello />
      <ErroriFrequenti />
    </div>
  );
}

