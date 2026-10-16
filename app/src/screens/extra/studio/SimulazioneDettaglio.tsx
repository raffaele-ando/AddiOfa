// Dettaglio di una simulazione svolta: misuratore, tessere icona/numero, riepilogo per argomento e correzioni (concept 36 schede 10-11).
// Le regole del punteggio stanno dietro la «i». Senza `id` (o con un id che non c'è) mostra solo «non trovata»: la nuova simulazione si avvia dalla scheda.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { useAccess } from '../../../access/context';
import type { ExamQuestionResult, PublicQuestion, DataProvider } from '../../../access/provider';
import { FORMATS } from '../../../config/offer';
import { entrataStorico, perArgomentoSimulazione, trovaSimulazione } from '../../../lib/studio/simulazioni';
import MisuratoreEsito from '../../../components/esito/MisuratoreEsito';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import InfoPunteggio from '../../../components/esito/InfoPunteggio';
import { TessereEsito, RigaTempo } from '../../../components/esito/TessereEsito';
import { cn } from '../../../lib/utils';
import { Pagina, Carta, Barra, coloreValore, dataBreve } from './comune';
import { PulsanteInfo } from '../ui';
import { Bottone, Fermo } from '../sfide/comuni';
import type { ExamHistory } from '../../../types';

// ---- Correzioni di una simulazione svolta
type Correzioni =
  | { fase: 'carico' }
  | { fase: 'errore' }
  | { fase: 'assenti' } // lo storico non ha le risposte domanda per domanda (salvataggio vecchio)
  | { fase: 'ok'; domande: PublicQuestion[]; perQ: Map<string, ExamQuestionResult>; risposte: Record<string, number> };

/**
 * Ricostruisce le correzioni dai log salvati. Le opzioni di ogni domanda erano rimescolate durante la prova e l'ordine non è stato salvato:
 * si sa se la risposta era giusta, sbagliata o vuota e qual è l'esatta (dal banco), ma non il testo dell'opzione sbagliata scelta.
 */
async function caricaCorrezioni(provider: DataProvider, h: ExamHistory): Promise<Correzioni> {
  const logs = Array.isArray(h.questionLogs) ? h.questionLogs : [];
  if (logs.length === 0) return { fase: 'assenti' };
  const ids = (Array.isArray(h.questionIds) && h.questionIds.length > 0 ? h.questionIds : logs.map(l => l.questionId)).filter((x, i, a) => a.indexOf(x) === i);
  const lette: PublicQuestion[] = [];
  for (let i = 0; i < ids.length; i += 80) lette.push(...await provider.getQuestions(ids.slice(i, i + 80)));
  const perId = new Map(lette.map(q => [q.id, q]));
  const domande = ids.map(id => perId.get(id)).filter((q): q is PublicQuestion => !!q);
  if (domande.length === 0) return { fase: 'errore' };
  const giudizi = await Promise.all(domande.map(async q => {
    try { return [q.id, await provider.grade(q.id, -1)] as const; } catch { return [q.id, null] as const; }
  }));
  const voti = new Map(giudizi);
  const logPer = new Map(logs.map(l => [l.questionId, l]));
  const perQ = new Map<string, ExamQuestionResult>();
  const risposte: Record<string, number> = {};
  for (const q of domande) {
    const g = voti.get(q.id);
    const l = logPer.get(q.id);
    if (!g || !l) continue;
    const data = l.userAnswerIndex !== null && l.userAnswerIndex !== undefined;
    perQ.set(q.id, { id: q.id, correct: data ? l.isCorrect === true : null, correctIndex: g.correctIndex, explanation: g.explanation, ...(g.theoryId ? { theoryId: g.theoryId } : {}) });
    if (data) risposte[q.id] = l.isCorrect === true ? g.correctIndex : -1; // -1 = data ma sbagliata (il testo scelto non è salvato)
  }
  const complete = domande.filter(q => perQ.has(q.id));
  return complete.length > 0 ? { fase: 'ok', domande: complete, perQ, risposte } : { fase: 'errore' };
}

function Svolta({ chiave }: { chiave: string }) {
  const { appState, vai, indietro, apriTeoria } = useExtra();
  const { provider } = useAccess();
  const s = useMemo(() => trovaSimulazione(appState.history, chiave), [appState.history, chiave]);
  const entrata = useMemo(() => (s ? entrataStorico(appState.history, s.id) : undefined), [appState.history, s]);
  const [corr, setCorr] = useState<Correzioni>({ fase: 'carico' });
  const [tentativo, setTentativo] = useState(0);
  const correzioniRef = useRef<HTMLDivElement>(null);
  const [info, setInfo] = useState(false);

  useEffect(() => {
    if (!entrata) return;
    let vivo = true;
    setCorr({ fase: 'carico' });
    caricaCorrezioni(provider, entrata).then(r => { if (vivo) setCorr(r); }).catch(() => { if (vivo) setCorr({ fase: 'errore' }); });
    return () => { vivo = false; };
  }, [provider, entrata, tentativo]);

  if (!s || !entrata) return <NonTrovata onIndietro={indietro} onSimulazioni={() => vai('simulazioni')} />;

  const f = FORMATS[s.formato];
  const { righe } = perArgomentoSimulazione(entrata);

  return (
    <div className="relative h-full">
      <Pagina titolo={`Simulazione ${s.numero}`} onIndietro={indietro} destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole della simulazione" />}>
        <Carta className="mt-4 px-4 pt-3 pb-4 text-center">
          <MisuratoreEsito giuste={s.esatte} totale={s.totale} soglia={s.soglia} superata={s.superata} />
          <div className="-mt-1 flex justify-center">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[16px] font-extrabold', s.superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')}>
              <Icona nome={s.superata ? 'stato-ok' : 'stato-errore'} size={19} />
              {s.superata ? 'Superata' : 'Non superata'}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
            <span className="text-[13.5px] font-bold tabular-nums text-testo-tenue">{dataBreve(s.data)}</span>
            <span role="img" aria-label={`Soglia ${s.soglia} su ${s.totale}`} className="inline-flex items-center gap-1.5 text-[14px] font-bold tabular-nums text-testo">
              <Icona nome="soglia" size={17} className="text-alto-numero" />{s.soglia}/{s.totale}
            </span>
            <RigaTempo secondi={s.tempoSecondi} minuti={f.minutes} />
          </div>
        </Carta>

        <div className="mt-3"><TessereEsito giuste={s.esatte} sbagliate={s.sbagliate} vuote={s.omesse} /></div>

        {righe.length > 0 && (
          <section aria-labelledby="titolo-argomenti" className="mt-7 flex flex-col gap-2.5">
            <h2 id="titolo-argomenti" className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="argomenti" size={20} className="text-viola" />Argomenti</h2>
            <Carta className="p-4">
              <ul className="flex flex-col gap-3.5">
                {righe.map(r => (
                  <li key={r.nome}>
                    <div className="flex items-baseline justify-between gap-3 text-[14px]">
                      <span className="font-semibold text-testo break-words min-w-0">{r.nome}</span>
                      <span className="shrink-0 font-bold tabular-nums text-testo">{r.esatte}/{r.totale}</span>
                    </div>
                    <div className="mt-1.5"><Barra valore={r.percento} colore={coloreValore(r.percento)} alta={7} /></div>
                  </li>
                ))}
              </ul>
            </Carta>
          </section>
        )}

        <div ref={correzioniRef} className="mt-7 scroll-mt-3">
          {corr.fase === 'carico' && <p role="status" aria-label="Carico le correzioni" className="flex justify-center text-testo-tenue"><Icona nome="stato-caricamento" size={22} className="animate-spin" /></p>}
          {corr.fase === 'errore' && (
            <Carta className="flex items-center gap-3">
              <Icona nome="stato-attenzione" size={22} className="shrink-0 text-medio-numero" />
              <p role="alert" className="flex-1 text-[14px] font-bold text-testo">Correzioni non disponibili.</p>
              <Bottone variante="secondario" icona="riprova" aria="Riprova" className="w-14 px-0" onClick={() => setTentativo(n => n + 1)} />
            </Carta>
          )}
          {corr.fase === 'assenti' && (
            <Carta className="flex items-center gap-3">
              <Icona nome="correzioni" size={22} className="shrink-0 text-testo-tenue" />
              <p role="status" className="text-[14px] font-bold text-testo-tenue">Correzioni non salvate.</p>
            </Carta>
          )}
          {corr.fase === 'ok' && <CorrezioniComplete questions={corr.domande} perQuestion={corr.perQ} answers={corr.risposte} onOpenTheory={apriTeoria} senzaLettere />}
        </div>
      </Pagina>
      <InfoPunteggio format={f} aperto={info} onChiudi={() => setInfo(false)} />
    </div>
  );
}

function NonTrovata({ onIndietro, onSimulazioni }: { onIndietro: () => void; onSimulazioni: () => void }) {
  return (
    <Pagina titolo="Simulazione" onIndietro={onIndietro}>
      <Fermo icona="stato-attenzione" tono="basso" testo="Simulazione non trovata.">
        <Bottone icona="simulazioni" aria="Le mie simulazioni" onClick={onSimulazioni} />
      </Fermo>
    </Pagina>
  );
}

export default function SimulazioneDettaglio() {
  const { params, vai, indietro } = useExtra();
  return params.id ? <Svolta chiave={params.id} /> : <NonTrovata onIndietro={indietro} onSimulazioni={() => vai('simulazioni')} />;
}
