// Esito della simulazione: misuratore, tessere, aree, correzioni complete. Solo disegno: la consegna e i dati restano in ExamMode.
import { useRef, useState } from 'react';
import { Info, Lock, RotateCcw, XCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import type { ExamResult, PublicQuestion } from '../../access/provider';
import type { ExamFormat } from '../../config/offer';
import { cn, formatNumber } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';
import MisuratoreEsito from './MisuratoreEsito';
import CorrezioniComplete from './CorrezioniComplete';
import InfoPunteggio from './InfoPunteggio';
import { TessereEsito, RigaTempo } from './TessereEsito';
import { coloreValore } from '../home/comune';
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
    <div className="h-full w-full sm:max-h-[calc(100dvh-3rem)] overflow-hidden bg-superficie sm:rounded-[32px] sm:border sm:border-linea shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-5">
          <header className="flex items-center gap-2 min-h-[40px]">
            <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Torna al menu" className="p-1 -ml-1 text-testo-tenue hover:text-testo-tenue transition-colors duration-100">
              <ChevronLeft size={26} strokeWidth={2.5} />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold leading-tight text-testo">Esito della simulazione</h2>
              <p className="text-xs font-semibold text-testo-tenue truncate">{format.name}</p>
            </div>
            <button ref={infoBtn} type="button" onClick={() => { playTapSound(); setInfo(true); }} aria-label="Come viene calcolato il punteggio" aria-haspopup="dialog"
              className="shrink-0 w-10 h-10 -mr-1 rounded-full flex items-center justify-center text-azione hover:bg-azione-tinta/60 transition-colors duration-100">
              <Info size={22} strokeWidth={2.2} aria-hidden />
            </button>
          </header>

          <section aria-label="Risultato" className="rounded-[12px] bg-superficie-2 px-4 pt-3 pb-4 text-center">
            {/* L'animazione parte una volta all'apertura; toccandola si rivede (Invio e Spazio compresi). */}
            <button type="button" onClick={() => setRivedi(n => n + 1)} aria-label="Rivedi l'animazione"
              className="mx-auto mb-1 block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione ">
              <IllustrazioneAnimata nome={superata ? 'successo' : 'mancato-superamento'} lato={120} riavvia={rivedi} />
            </button>
            <MisuratoreEsito giuste={result.rawCorrect} totale={totale} soglia={format.passMark} superata={superata} />
            <div className="-mt-1 flex justify-center">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-extrabold',
                superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo'
              )}>
                {superata ? <CheckCircle2 size={18} strokeWidth={2.8} aria-hidden /> : <XCircle size={18} strokeWidth={2.8} aria-hidden />}
                {superata ? 'Superata' : 'Non superata'}
              </span>
            </div>
            <RigaTempo secondi={elapsedSeconds} minuti={format.minutes} />
            <p className="mt-2.5 text-sm font-bold text-testo">
              {superata
                ? `Soglia ${format.passMark} su ${totale}: raggiunta.`
                : `Soglia ${format.passMark} su ${totale}: ${mancano === 1 ? 'ti è mancata 1 risposta' : `ti sono mancate ${mancano} risposte`}.`}
            </p>
            {format.penalty > 0 && (
              <p className="mt-1 text-sm font-bold text-testo">
                Punteggio con penalità: {formatNumber(result.score)} su {totale}
                <span className="block font-semibold text-xs text-testo-tenue">{formatNumber(format.penalty)} in meno per ognuna delle {result.wrong} sbagliate; le senza risposta non tolgono nulla.</span>
              </p>
            )}
            <p className="mt-3 text-xs font-semibold text-testo-tenue max-w-sm mx-auto">
              È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.
            </p>
          </section>

          <TessereEsito giuste={result.rawCorrect} sbagliate={result.wrong} vuote={result.omitted} />

          <div className="flex flex-col gap-2.5">
            <button type="button" onClick={vaiAlleCorrezioni}
              className="w-full bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base py-3.5 rounded-[12px] transition-colors duration-100">
              Vedi le correzioni
            </button>
            <button type="button" onClick={() => { playTapSound(); onExit(); }}
              className="w-full bg-superficie border border-azione/60 text-azione font-bold text-base py-3.5 rounded-[12px] transition-colors duration-100 hover:bg-azione-tinta">
              Torna al menu
            </button>
          </div>

          {Object.keys(aree).length > 0 && (
            <section aria-label="Per area" className="rounded-[12px] bg-superficie-2 p-4 text-left">
              <h3 className="text-base font-bold text-testo mb-3">Per area</h3>
              <ul className="space-y-3">
                {Object.entries(aree).map(([nome, a]) => {
                  const pct = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
                  return (
                    <li key={nome}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-bold text-testo">{nome}</span>
                        <span className="font-bold tabular-nums text-testo-tenue">{a.correct}/{a.total} <span className="text-xs font-semibold text-testo-tenue">({pct}%)</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 rounded-full bg-tacca/60 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={a.total} aria-valuenow={a.correct} aria-label={`${nome}: ${a.correct} su ${a.total}`}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: coloreValore(pct) }} />
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

          <div className="pt-1 pb-4">
            <button type="button" onClick={() => { playTapSound(); onRetry(); }}
              className="w-full bg-superficie border border-azione/60 text-azione hover:bg-azione-tinta font-bold text-base py-3.5 rounded-[12px] transition-colors duration-100 flex items-center justify-center gap-2">
              {retryLocked ? <><Lock size={16} strokeWidth={3} aria-hidden /> Altre simulazioni con il Pass</> : <><RotateCcw size={17} strokeWidth={3} aria-hidden /> Rifai la simulazione</>}
            </button>
          </div>
        </div>
      </div>
      <InfoPunteggio format={format} aperto={info} onChiudi={chiudiInfo} risposteStima={risposteStima} />
    </div>
  );
}
