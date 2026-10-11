// Fine di una sessione di studio: com'è andata, quante domande si sanno prima e dopo, cosa riprendere, cosa fare ora.
// Niente punti, livelli o serie: solo numeri veri presi dalle risposte della sessione.
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, BookOpen, Check, Clock, Plus, RotateCcw } from 'lucide-react';
import { Illustrazione } from '../../brand/Illustrazione';
import { cn, formatDuration } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';

export interface DomandaDaRiprendere { id: string; prompt: string; argomento: string }

interface Props {
  corrette: number;          // giuste al primo tentativo
  totale: number;
  secondi: number;
  /** Domande imparate prima e dopo la sessione, sul gruppo di domande che l'utente può studiare. */
  prima: number;
  dopo: number;
  gruppo: number;
  nuove: number;             // domande del gruppo mai viste
  daRiprendere: DomandaDaRiprendere[];
  /** L'argomento in cui si è sbagliato di più, se ha una scheda di teoria. */
  regola?: { nome: string; theoryId: string };
  prossima: string;          // a parole, cosa farà la prossima sessione
  onContinua: () => void;
  onExit: () => void;
  onOpenTheory?: (id: string) => void;
}

export default function FineSessione({ corrette, totale, secondi, prima, dopo, gruppo, nuove, daRiprendere, regola, prossima, onContinua, onExit, onOpenTheory }: Props) {
  const ridotto = useReducedMotion();
  const entra = (i: number) => ridotto ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.32, delay: 0.1 + 0.08 * i } };
  const pc = (n: number) => (gruppo > 0 ? Math.max(0, Math.min(100, (n / gruppo) * 100)) : 0);
  const differenza = dopo - prima;
  const mostraPrimaDopo = gruppo > 0;
  const mm = Math.floor(secondi / 60);
  const ss = String(secondi % 60).padStart(2, '0');

  return (
    <div className="flex flex-col h-full w-full sm:max-h-[calc(100dvh-3rem)] bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center pt-1">
            <motion.div initial={ridotto ? false : { scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35 }}>
              <Illustrazione kit="kit-blu" nome="successo" lato={104} />
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">Sessione finita</h2>
            <p className="text-sm sm:text-base font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Al primo tentativo hai risposto bene a {corrette} domande su {totale}.
            </p>
          </div>

          <motion.div {...entra(0)} className="grid grid-cols-3 gap-2.5">
            <div role="group" aria-label={`${corrette} giuste al primo tentativo`} className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-2 py-3 flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#DCFCE7] text-[#15803D] dark:bg-[#064E3B] dark:text-[#34D399]"><Check size={17} strokeWidth={3} aria-hidden /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-[#0F172A] dark:text-[#F8FAFC]">{corrette}</span>
              <span aria-hidden className="text-[11px] font-bold text-gray-500 dark:text-gray-400 text-center leading-tight">Giuste al primo colpo</span>
            </div>
            <div role="group" aria-label={`${daRiprendere.length} da riprendere`} className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-2 py-3 flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F]/60 dark:text-[#FCD34D]"><RotateCcw size={16} strokeWidth={3} aria-hidden /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-[#0F172A] dark:text-[#F8FAFC]">{daRiprendere.length}</span>
              <span aria-hidden className="text-[11px] font-bold text-gray-500 dark:text-gray-400 text-center leading-tight">Da riprendere</span>
            </div>
            <div role="group" aria-label={`Tempo: ${formatDuration(secondi)}`} className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-2 py-3 flex flex-col items-center gap-1">
              <span className="w-8 h-8 rounded-full flex items-center justify-center bg-azione-tinta text-azione-scuro dark:bg-azione-tinta-scura/60 dark:text-azione-chiaro"><Clock size={16} strokeWidth={3} aria-hidden /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-[#0F172A] dark:text-[#F8FAFC]">{mm}:{ss}</span>
              <span aria-hidden className="text-[11px] font-bold text-gray-500 dark:text-gray-400 text-center leading-tight">Tempo</span>
            </div>
          </motion.div>

          {mostraPrimaDopo && (
            <motion.section {...entra(1)} aria-label="Domande imparate prima e dopo" className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50/70 dark:bg-[#0F172A]/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Domande imparate</h3>
                {differenza > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] dark:bg-[#064E3B] text-[#15803D] dark:text-[#34D399] text-xs font-bold px-2.5 py-1">
                    <Plus size={12} strokeWidth={3.5} aria-hidden /> {differenza} {differenza === 1 ? 'nuova' : 'nuove'}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 sm:gap-5 text-center">
                <div>
                  <div className="text-3xl font-extrabold tabular-nums leading-none text-gray-500 dark:text-gray-400">{prima}</div>
                  <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1">Prima</div>
                </div>
                <ArrowRight size={22} strokeWidth={2.5} className="text-gray-400 dark:text-gray-500 shrink-0" aria-hidden />
                <div>
                  <div className="text-3xl font-extrabold tabular-nums leading-none text-azione dark:text-azione-chiaro">{dopo}</div>
                  <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-1">Dopo</div>
                </div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-left pl-1">su {gruppo}<br />domande</div>
              </div>
              <div className="mt-3 relative h-3 rounded-full bg-gray-200 dark:bg-[#334155] overflow-hidden" role="img" aria-label={`Prima ${prima}, dopo ${dopo}, su ${gruppo} domande`}>
                <motion.div className="absolute inset-y-0 left-0 rounded-full bg-azione dark:bg-azione-chiaro"
                  initial={{ width: ridotto ? `${pc(dopo)}%` : `${pc(prima)}%` }} animate={{ width: `${pc(dopo)}%` }} transition={{ duration: ridotto ? 0 : 0.9, delay: 0.5, ease: 'easeOut' }} />
                <div className="absolute inset-y-0 w-0.5 bg-[#0F172A] dark:bg-[#F8FAFC]" style={{ left: `${pc(prima)}%` }} aria-hidden />
              </div>
              <p className="mt-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
                {differenza > 0
                  ? 'Una domanda conta come imparata quando l\u2019hai risposta bene e il ripasso la rimanda a più avanti. Il segno nero è dove eri prima.'
                  : differenza === 0
                    ? 'Questa volta il numero non è cambiato: rispondere bene più volte alla stessa domanda la fa contare come imparata.'
                    : 'Qualche domanda è tornata da ripassare: succede quando si sbaglia qualcosa che sembrava già saputo. Il ripasso la riprende.'}
              </p>
            </motion.section>
          )}

          {daRiprendere.length > 0 && (
            <motion.section {...entra(2)} aria-label="Domande da riprendere" className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-4 text-left">
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Da riprendere</h3>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2.5">Non erano giuste al primo tentativo: torneranno nelle prossime sessioni.</p>
              <ul className="divide-y divide-gray-100 dark:divide-[#334155]">
                {daRiprendere.slice(0, 5).map(d => (
                  <li key={d.id} className="py-2 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{d.prompt}</p>
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">{d.argomento}</p>
                  </li>
                ))}
              </ul>
              {daRiprendere.length > 5 && <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">e altre {daRiprendere.length - 5}</p>}
              {regola && onOpenTheory && (
                <button type="button" onClick={() => { playTapSound(); onOpenTheory(regola.theoryId); }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-azione dark:border-azione-chiaro text-azione dark:text-azione-chiaro font-bold text-sm py-2.5 hover:bg-azione-tinta/40 dark:hover:bg-azione-tinta-scura/30 transition-colors">
                  <BookOpen size={16} aria-hidden /> Studia la regola: {regola.nome}
                </button>
              )}
            </motion.section>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1E293B] p-3 sm:p-4">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-2">
          <button type="button" onClick={() => { playTapSound(); onContinua(); }}
            className={cn('w-full text-left bg-azione hover:bg-azione-scuro active:scale-[.99] text-white rounded-2xl px-4 py-3 transition-all flex items-center gap-3')}>
            <span className="flex-1 min-w-0">
              <span className="block font-bold text-base leading-tight">Continua da qui</span>
              <span className="block text-xs font-semibold text-white/85 leading-snug mt-0.5">{prossima}{nuove > 0 ? ` Ancora mai viste: ${nuove}.` : ''}</span>
            </span>
            <ArrowRight size={22} strokeWidth={3} className="shrink-0" aria-hidden />
          </button>
          <button type="button" onClick={() => { playTapSound(); onExit(); }}
            className="w-full bg-white dark:bg-[#1E293B] border border-azione dark:border-azione-chiaro text-azione dark:text-azione-chiaro font-bold text-base py-3 rounded-2xl transition-all active:scale-[.99] hover:bg-azione-tinta/40 dark:hover:bg-azione-tinta-scura/30">
            Torna al menu
          </button>
        </div>
      </div>
    </div>
  );
}
