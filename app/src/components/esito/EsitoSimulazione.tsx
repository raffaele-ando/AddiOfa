// Esito della simulazione (concept 18.9, 30.11, 10, 43): illustrazione dell'esito (superata `celebrazione`, non superata `mancato-superamento`),
// misuratore, tessere icona/numero, confronto con la precedente, «Correzioni» e «Rifai», aree, correzioni complete.
// Solo disegno: la consegna e i dati restano in ExamMode. Niente frasi: le regole stanno dietro la «i» (InfoPunteggio).
import { useRef, useState } from 'react';
import type { ExamResult, PublicQuestion } from '../../access/provider';
import type { ExamFormat } from '../../config/offer';
import { Icona } from '../../brand/icone/Icona';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';
import MisuratoreEsito from './MisuratoreEsito';
import CorrezioniComplete from './CorrezioniComplete';
import InfoPunteggio from './InfoPunteggio';
import { TessereEsito, RigaTempo } from './TessereEsito';
import ConfrontoPrecedente, { type PuntiConfronto } from './ConfrontoPrecedente';
import { coloreValore } from '../home/comune';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { PulsanteInfo } from '../../screens/extra/ui';

interface Props {
  format: ExamFormat;
  result: ExamResult;
  questions: PublicQuestion[];
  answers: Record<string, number>;
  elapsedSeconds: number;
  onExit: () => void;
  /** Rifà la stessa simulazione. */
  onRetry: () => void;
  onOpenTheory?: (id: string) => void;
  /** Risposte su cui è calcolata la stima (diagnostico + simulazioni): se manca, il foglio non rimanda a FoglioStima. */
  risposteStima?: number;
  /** La simulazione svolta prima di questa (dallo storico), per il confronto prima/dopo. Senza, il confronto non compare. */
  precedente?: PuntiConfronto | null;
  /** La prova si è chiusa perché il tempo è scaduto. */
  scaduto?: boolean;
}

export default function EsitoSimulazione({ format, result, questions, answers, elapsedSeconds, onExit, onRetry, onOpenTheory, risposteStima, precedente, scaduto }: Props) {
  const [info, setInfo] = useState(false);
  const [rivedi, setRivedi] = useState(0);
  const correzioniRef = useRef<HTMLDivElement>(null);
  const totale = format.questions;
  const superata = result.passed;

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

  return (
    <div className="relative h-full w-full sm:max-h-[calc(100dvh-3rem)] overflow-hidden bg-superficie sm:rounded-[32px] sm:border sm:border-linea shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-5">
          <header className="flex items-center gap-2 min-h-[40px]">
            <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Indietro" className="brand-premibile -ml-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
              <Icona nome="indietro" size={28} />
            </button>
            <h2 className="min-w-0 flex-1 text-[22px] leading-[30px] font-extrabold tracking-[-0.01em] text-testo">Esito</h2>
            <PulsanteInfo onClick={() => setInfo(true)} etichetta="Regole della simulazione" />
          </header>

          <section aria-label="Risultato" className="rounded-[12px] bg-superficie-2 px-4 pt-3 pb-4 text-center">
            {/* L'animazione parte una volta all'apertura; toccandola si rivede (Invio e Spazio compresi). */}
            <button type="button" onClick={() => setRivedi(n => n + 1)} aria-label="Rivedi l'animazione"
              className="mx-auto mb-1 block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione ">
              <IllustrazioneAnimata nome={superata ? 'celebrazione' : 'mancato-superamento'} lato={120} riavvia={rivedi} />
            </button>
            <MisuratoreEsito giuste={result.rawCorrect} totale={totale} soglia={format.passMark} superata={superata} />
            <div className="-mt-1 flex justify-center">
              <span className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-extrabold',
                superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo'
              )}>
                <Icona nome={superata ? 'stato-ok' : 'stato-errore'} size={19} />
                {superata ? 'Superata' : 'Non superata'}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
              <span role="img" aria-label={`Soglia ${format.passMark} su ${totale}`} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-testo">
                <Icona nome="soglia" size={17} className="text-alto-numero" /><span className="tabular-nums">{format.passMark}/{totale}</span>
              </span>
              <RigaTempo secondi={elapsedSeconds} minuti={format.minutes} scaduto={scaduto} />
            </div>
          </section>

          <TessereEsito giuste={result.rawCorrect} sbagliate={result.wrong} vuote={result.omitted} />

          {precedente && <ConfrontoPrecedente prima={precedente} dopo={{ esatte: result.rawCorrect, totale }} />}

          {/* Un solo pulsante pieno: «Correzioni» (sono sotto, a un tocco); «Rifai» ricomincia con altre 30 domande. */}
          <div className="flex gap-2.5">
            <button type="button" onClick={vaiAlleCorrezioni}
              className="flex h-[54px] flex-[3] items-center justify-center gap-2 rounded-[12px] bg-azione text-[15px] font-bold text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
              <Icona nome="correzioni" size={22} />Correzioni
            </button>
            <button type="button" onClick={() => { playTapSound(); onRetry(); }}
              className="flex h-[54px] flex-[2] items-center justify-center gap-2 rounded-[12px] border border-azione/60 bg-superficie text-[15px] font-bold text-azione-scuro transition-colors duration-100 hover:bg-azione-tinta">
              <Icona nome="riprova" size={22} />Rifai
            </button>
          </div>

          {Object.keys(aree).length > 0 && (
            <section aria-labelledby="titolo-aree" className="rounded-[12px] bg-superficie-2 p-4 text-left">
              <h3 id="titolo-aree" className="mb-3 flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="argomenti" size={20} className="text-viola" />Aree</h3>
              <ul className="space-y-3">
                {Object.entries(aree).map(([nome, a]) => {
                  const pct = a.total > 0 ? Math.round((a.correct / a.total) * 100) : 0;
                  return (
                    <li key={nome}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <span data-testo-ok className="font-bold text-testo">{nome}</span>
                        <span className="font-bold tabular-nums text-testo">{a.correct}/{a.total}</span>
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

          <div ref={correzioniRef} className="scroll-mt-3 pb-4">
            <CorrezioniComplete questions={questions} perQuestion={perQ} answers={answers} onOpenTheory={onOpenTheory} />
          </div>
        </div>
      </div>
      <InfoPunteggio format={format} aperto={info} onChiudi={() => setInfo(false)} risposteStima={risposteStima} />
    </div>
  );
}
