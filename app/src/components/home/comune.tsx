import { ReactNode, useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';
import { formatPunteggio, type IntervalloStima } from '../../lib/diagnostic';
import { REAL_TEST_PASS_MARK } from '../../config/offer';

/** Vero se l'utente ha chiesto meno movimento: tutte le animazioni della home partono dal valore finale. */
export function useRiduci(): boolean { return !!useReducedMotion(); }

/** Colore semantico di un valore 0-100 (sempre accompagnato dal numero scritto, mai solo colore). */
export function coloreValore(v: number): string { return v < 40 ? '#EF4444' : v < 70 ? '#F59E0B' : '#22C55E'; }

/** Card della home: bianca, angoli larghi, ombra morbida. Compare in sequenza. */
export function Carta({ indice = 0, className, children, tinta }: { indice?: number; className?: string; children: ReactNode; tinta?: string }) {
  const riduci = useRiduci();
  return (
    <motion.section
      initial={riduci ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: riduci ? 0 : 0.45, delay: riduci ? 0 : 0.05 + indice * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-3xl border shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:shadow-none',
        tinta ?? 'bg-white dark:bg-[#1E293B] border-[#E8ECF3] dark:border-[#334155]', className)}>
      {children}
    </motion.section>
  );
}

/** Barra che cresce all'ingresso. */
export function BarraCresce({ valore, colore, ritardo = 0, alta = 8, sfondo }: { valore: number; colore: string; ritardo?: number; alta?: number; sfondo?: string }) {
  const riduci = useRiduci();
  return (
    <div className={cn('rounded-full overflow-hidden', sfondo ?? 'bg-[#EEF1F6] dark:bg-[#334155]')} style={{ height: alta }}>
      <motion.div className="h-full rounded-full" style={{ background: colore }}
        initial={riduci ? false : { width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, valore))}%` }}
        transition={{ duration: riduci ? 0 : 0.8, delay: riduci ? 0 : 0.3 + ritardo, ease: 'easeOut' }} />
    </div>
  );
}

/** Numero che sale da 0 al valore (o resta fermo con "riduci movimento"). */
export function useContaSu(valore: number, durataMs = 900): number {
  const riduci = useRiduci();
  const [v, setV] = useState(riduci ? valore : 0);
  useEffect(() => {
    if (riduci) { setV(valore); return; }
    const c = animate(0, valore, { duration: durataMs / 1000, delay: 0.25, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    return () => c.stop();
  }, [valore, riduci, durataMs]);
  return v;
}

/** Sotto questo numero di risposte la stima è larga: accanto alla percentuale si mostra anche il punteggio probabile su 30. */
export const RISPOSTE_PER_STIMA_STRETTA = 90;

/**
 * Una riga piccola e onesta sotto la percentuale: l'intervallo all'80 % del punteggio al test (intervalloStima).
 * Con poche risposte la percentuale da sola è larga (con 8 su 10 va da meno di 1 a 91 %): il punteggio dice di più.
 */
export function RigaIntervallo({ intervallo, className }: { intervallo: IntervalloStima; className?: string }) {
  return (
    <p className={cn('text-[12px] leading-snug text-[#6B7280] dark:text-[#94A3B8] text-center', className)}>
      Punteggio probabile al test: <span className="font-bold whitespace-nowrap">{formatPunteggio(intervallo)}</span> (soglia {REAL_TEST_PASS_MARK}).
    </p>
  );
}

/** La regola di "domanda imparata" (isLearned in lib/spacedRepetition.ts), scritta una volta sola per tutta l'app. */
export const REGOLA_IMPARATA = 'Una domanda conta come imparata quando l’hai risposta bene due volte, a distanza di almeno mezza giornata.';
