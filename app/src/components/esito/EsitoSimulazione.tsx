// Esito della simulazione: misuratore, tessere, aree, correzioni complete. Solo disegno: la consegna e i dati restano in ExamMode.
import { useRef, useState } from 'react';
import { Check, Clock, Info, Lock, Minus, RotateCcw, X, XCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import type { ExamResult, PublicQuestion } from '../../access/provider';
import type { ExamFormat } from '../../config/offer';
import { cn, formatDuration, formatNumber } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';
import MisuratoreEsito from './MisuratoreEsito';
import CorrezioniComplete from './CorrezioniComplete';
import InfoPunteggio from './InfoPunteggio';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';

interface Props {
  format: ExamFormat;
  result: ExamResult;
  questions: PublicQuestion[];
  answers: Record<string, number>;
  elapsedSeconds: number;
  onExit: () => void;
  /** Rifà la stessa simulazione (o porta al Pass se non è più gratis). */
  onRetry: () => void;
  retryLocked: boolean;
  onOpenTheory?: (id: string) => void;
  /** Risposte su cui è calcolata la stima (diagnostico + simulazioni): se manca, il foglio non rimanda a FoglioStima. */
  risposteStima?: number;
}

function Tessera({ Icona, valore, etichetta, tono, aria }: { Icona: typeof Check; valore: string; etichetta: string; tono: 'verde' | 'rosso' | 'grigio' | 'blu'; aria: string }) {
  const toni = {
    verde: 'bg-[#DCFCE7] text-[#15803D] dark:bg-[#064E3B] dark:text-[#34D399]',
    rosso: 'bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/60 dark:text-[#FCA5A5]',
    grigio: 'bg-gray-100 text-gray-600 dark:bg-[#334155] dark:text-gray-300',
    blu: 'bg-azione-tinta text-azione-scuro dark:bg-azione-tinta-scura/60 dark:text-azione-chiaro',
  } as const;
  return (
    <div role="group" aria-label={aria} className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-2 py-3 flex flex-col items-center gap-1 min-w-0">
      <span className={cn('w-8 h-8 rounded-full flex items-center justify-center', toni[tono])}><Icona size={17} strokeWidth={3} aria-hidden /></span>
      <span className="text-2xl font-extrabold tabular-nums leading-none text-[#0F172A] dark:text-[#F8FAFC]" aria-hidden>{valore}</span>
      <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 text-center leading-tight" aria-hidden>{etichetta}</span>
    </div>
  );
}

export default function EsitoSimulazione({ format, result, questions, answers, elapsedSeconds, onExit, onRetry, retryLocked, onOpenTheory, risposteStima }: Props) {
  const [info, setInfo] = useState(false);
  const [rivedi, setRivedi] = useState(0);
  const infoBtn = useRef<HTMLButtonElement>(null);
  const correzioniRef = useRef<HTMLDivElement>(null);
  const totale = format.questions;
  const superata = result.passed;
  const mancano = format.passMark - result.rawCorrect;

  const perQ = new Map(result.perQuestion.map(r => [r.id, r]));
  const aree: Record<string, { correct: number; total: number }> = {};
  questions.forEach(q => {
    const c = aree[q.category] || (aree[q.category] = { correct: 0, total: 0 });
    c.total++;
    if (perQ.get(q.id)?.correct === true) c.correct++;
  });

  const vaiAlleCorrezioni = () => {
    playTapSound();
    correzioniRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
  };
  const chiudiInfo = () => { setInfo(false); infoBtn.current?.focus(); };

  return (
    <div className="h-full w-full sm:max-h-[calc(100dvh-3rem)] overflow-hidden bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] shadow-sm transition-colors duration-100">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-5">
          <header className="flex items-center gap-2 min-h-[40px]">
            <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Torna al menu" className="p-1 -ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-100">
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">Esito della simulazione</h2>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{format.name}</p>
            </div>
            <button ref={infoBtn} type="button" onClick={() => { playTapSound(); setInfo(true); }} aria-label="Come viene calcolato il punteggio" aria-haspopup="dialog"
              className="shrink-0 w-10 h-10 -mr-1 rounded-full flex items-center justify-center text-azione dark:text-azione-chiaro hover:bg-azione-tinta/60 dark:hover:bg-azione-tinta-scura/40 transition-colors duration-100">
              <Info size={22} strokeWidth={2.2} aria-hidden />
            </button>
          </header>

          <section aria-label="Risultato" className="rounded-3xl border border-gray-200 dark:border-[#334155] bg-gray-50/70 dark:bg-[#0F172A]/70 px-4 pt-3 pb-4 text-center">
            {/* L'animazione parte una volta all'apertura; toccandola si rivede (Invio e Spazio compresi). */}
            <button type="button" onClick={() => setRivedi(n => n + 1)} aria-label="Rivedi l'animazione"
              className="mx-auto mb-1 block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione dark:focus-visible:outline-azione-chiaro">
              <IllustrazioneAnimata nome={superata ? 'successo' : 'mancato-superamento'} lato={120} riavvia={rivedi} />
            </button>
            <MisuratoreEsito giuste={result.rawCorrect} totale={totale} soglia={format.passMark} superata={superata} />
            <div className="-mt-1 flex justify-center">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-extrabold',
                superata ? 'bg-[#DCFCE7] text-[#15803D] dark:bg-[#064E3B] dark:text-[#34D399]' : 'bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/60 dark:text-[#FCA5A5]'
              )}>
                {superata ? <CheckCircle2 size={18} strokeWidth={2.8} aria-hidden /> : <XCircle size={18} strokeWidth={2.8} aria-hidden />}
                {superata ? 'Superata' : 'Non superata'}
              </span>
            </div>
            <p className="mt-2.5 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              {superata
                ? `Soglia ${format.passMark} su ${totale}: raggiunta.`
                : `Soglia ${format.passMark} su ${totale}: ${mancano === 1 ? 'ti è mancata 1 risposta' : `ti sono mancate ${mancano} risposte`}.`}
            </p>
            {format.penalty > 0 && (
              <p className="mt-1 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Punteggio con penalità: {formatNumber(result.score)} su {totale}
                <span className="block font-semibold text-xs text-gray-500 dark:text-gray-400">{formatNumber(format.penalty)} in meno per ognuna delle {result.wrong} sbagliate; le senza risposta non tolgono nulla.</span>
              </p>
            )}
            <p className="mt-3 text-xs font-semibold text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.
            </p>
          </section>

          <div className="grid grid-cols-2 min-[460px]:grid-cols-4 gap-2.5">
            <Tessera Icona={Check} valore={String(result.rawCorrect)} etichetta="Giuste" tono="verde" aria={`${result.rawCorrect} risposte giuste`} />
            <Tessera Icona={X} valore={String(result.wrong)} etichetta="Sbagliate" tono="rosso" aria={`${result.wrong} risposte sbagliate`} />
            <Tessera Icona={Minus} valore={String(result.omitted)} etichetta="Senza risposta" tono="grigio" aria={`${result.omitted} domande senza risposta`} />
            <Tessera Icona={Clock} valore={`${Math.floor(elapsedSeconds / 60)}:${String(elapsedSeconds % 60).padStart(2, '0')}`} etichetta={`Tempo su ${format.minutes} min`} tono="blu" aria={`Tempo usato: ${formatDuration(elapsedSeconds)} su ${format.minutes} minuti`} />
          </div>

          <div className="flex flex-col gap-2.5">
            <button type="button" onClick={vaiAlleCorrezioni}
              className="w-full bg-azione hover:bg-azione-scuro text-white font-bold text-base py-3.5 rounded-2xl transition-colors duration-100">
              Vedi le correzioni
            </button>
            <button type="button" onClick={() => { playTapSound(); onExit(); }}
              className="w-full bg-white dark:bg-[#1E293B] border border-azione dark:border-azione-chiaro text-azione dark:text-azione-chiaro font-bold text-base py-3.5 rounded-2xl transition-colors duration-100 hover:bg-azione-tinta/40 dark:hover:bg-azione-tinta-scura/30">
              Torna al menu
            </button>
          </div>

          {Object.keys(aree).length > 0 && (
            <section aria-label="Per area" className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-4 text-left">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">Per area</h3>
              <ul className="space-y-3">
                {Object.entries(aree).map(([nome, a]) => {
                  const pct = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
                  return (
                    <li key={nome}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{nome}</span>
                        <span className="font-bold tabular-nums text-gray-600 dark:text-gray-300">{a.correct}/{a.total} <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">({pct}%)</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 rounded-full bg-gray-100 dark:bg-[#334155] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={a.total} aria-valuenow={a.correct} aria-label={`${nome}: ${a.correct} su ${a.total}`}>
                        <div className="h-full rounded-full bg-azione dark:bg-azione-chiaro" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <div ref={correzioniRef} className="scroll-mt-3">
            <CorrezioniComplete questions={questions} perQuestion={perQ} answers={answers} onOpenTheory={onOpenTheory} />
          </div>

          <div className="flex flex-col gap-2.5 pt-1 pb-4">
            <button type="button" onClick={() => { playTapSound(); onRetry(); }}
              className={cn('w-full font-bold text-base py-3.5 rounded-2xl transition-colors duration-100 flex items-center justify-center gap-2',
                retryLocked
                  ? 'bg-white dark:bg-[#1E293B] border border-azione dark:border-azione-chiaro text-azione dark:text-azione-chiaro'
                  : 'bg-azione hover:bg-azione-scuro text-white')}>
              {retryLocked ? <><Lock size={16} strokeWidth={3} aria-hidden /> Altre simulazioni con il Pass</> : <><RotateCcw size={17} strokeWidth={3} aria-hidden /> Rifai la simulazione</>}
            </button>
            <button type="button" onClick={() => { playTapSound(); onExit(); }}
              className="w-full py-3 px-6 font-bold text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors duration-100">
              Torna al menu
            </button>
          </div>
        </div>
      </div>
      <InfoPunteggio format={format} aperto={info} onChiudi={chiudiInfo} risposteStima={risposteStima} />
    </div>
  );
}
