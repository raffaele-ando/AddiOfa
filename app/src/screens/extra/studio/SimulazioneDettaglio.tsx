// Dettaglio di una simulazione svolta (concept 18.9, 30.11, 43): lo stesso riquadro del risultato della consegna (RiepilogoEsito), tessere icona/numero/parola,
// confronto con la precedente, riepilogo per argomento e correzioni complete con confronto.
// Le regole del punteggio stanno dietro la «i». Senza `id` (o con un id che non c'è) mostra solo «non trovata»: la nuova simulazione si avvia dalla scheda.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { provider } from '../../../access';
import type { ExamQuestionResult, PublicQuestion, DataProvider } from '../../../access/provider';
import { EXAM } from '../../../config/offer';
import { calcolaStima } from '../../../components/home/stima';
import { elencoSimulazioni, entrataStorico, perArgomentoSimulazione, trovaSimulazione } from '../../../lib/studio/simulazioni';
import RiepilogoEsito from '../../../components/esito/RiepilogoEsito';
import CorrezioniComplete from '../../../components/esito/CorrezioniComplete';
import InfoPunteggio from '../../../components/esito/InfoPunteggio';
import { TessereEsito } from '../../../components/esito/TessereEsito';
import ConfrontoPrecedente from '../../../components/esito/ConfrontoPrecedente';
import { Pagina, Carta, Barra, coloreValore, dataBreve, StatoVuoto, Bottone as BottoneStudio } from './comune';
import { PulsanteInfo } from '../ui';
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

  const f = EXAM;
  const prima = elencoSimulazioni(appState.history).find(x => x.numero === s.numero - 1);
  const scaduta = s.tempoSecondi >= f.minutes * 60;
  const { righe } = perArgomentoSimulazione(entrata);

  return (
    <div className="relative h-full">
      <Pagina titolo={`Simulazione ${s.numero}`} onIndietro={indietro} destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole della simulazione" />}>
        <div className="mt-4">
          <RiepilogoEsito giuste={s.esatte} totale={s.totale} soglia={s.soglia} superata={s.superata} vuote={s.omesse}
            secondi={s.tempoSecondi} minuti={f.minutes} scaduto={scaduta} data={dataBreve(s.data)}
            arte={<Illustrazione kit="kit-luminoso" nome="superamento" lato={110} />} />
        </div>

        <div className="mt-3"><TessereEsito giuste={s.esatte} sbagliate={s.sbagliate} vuote={s.omesse} /></div>
        {prima && <div className="mt-3"><ConfrontoPrecedente prima={{ esatte: prima.esatte, totale: prima.totale }} dopo={{ esatte: s.esatte, totale: s.totale }} /></div>}

        {righe.length > 0 && (
          <section aria-labelledby="titolo-argomenti" className="mt-7 flex flex-col gap-2.5">
            <h2 id="titolo-argomenti" className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="argomenti" size={20} className="text-viola" />Come sei andato per argomento</h2>
            <Carta className="p-4">
              <ul className="flex flex-col gap-3.5">
                {righe.map(r => (
                  <li key={r.nome}>
                    <div className="flex items-baseline justify-between gap-3 text-[14px]">
                      <span data-testo-ok className="font-semibold text-testo break-words min-w-0">{r.nome}</span>
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
            <StatoVuoto icona="stato-errore" titolo="Correzioni non disponibili" testo="Non siamo riusciti a leggerle.">
              <BottoneStudio variante="secondario" icona={<Icona nome="riprova" size={18} />} onClick={() => setTentativo(n => n + 1)}>Riprova</BottoneStudio>
            </StatoVuoto>
          )}
          {corr.fase === 'assenti' && (
            <StatoVuoto icona="correzioni" titolo="Correzioni non salvate" testo="Questa simulazione è di una versione precedente." />
          )}
          {corr.fase === 'ok' && <CorrezioniComplete questions={corr.domande} perQuestion={corr.perQ} answers={corr.risposte} onOpenTheory={apriTeoria} senzaLettere />}
        </div>
      </Pagina>
      <InfoPunteggio format={f} aperto={info} onChiudi={() => setInfo(false)} risposteStima={calcolaStima(appState)?.risposte} />
    </div>
  );
}

function NonTrovata({ onIndietro, onSimulazioni }: { onIndietro: () => void; onSimulazioni: () => void }) {
  return (
    <Pagina titolo="Simulazione" onIndietro={onIndietro}>
      <div className="mt-6">
        <StatoVuoto illustrazione={{ nome: 'ricerca-scintille' }} titolo="Simulazione non trovata" testo="Non è più salvata su questo dispositivo.">
          <BottoneStudio onClick={onSimulazioni} icona={<Icona nome="simulazioni" size={18} />}>Vai alle simulazioni</BottoneStudio>
        </StatoVuoto>
      </div>
    </Pagina>
  );
}

export default function SimulazioneDettaglio() {
  const { params, vai, indietro } = useExtra();
  return params.id ? <Svolta chiave={params.id} /> : <NonTrovata onIndietro={indietro} onSimulazioni={() => vai('simulazioni')} />;
}
