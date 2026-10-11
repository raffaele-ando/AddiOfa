import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { formatPunteggio, type IntervalloStima } from '../../lib/diagnostic';
import { REAL_TEST_PASS_MARK } from '../../config/offer';

/** Colore semantico di un valore 0-100 (sempre accompagnato dal numero scritto, mai solo colore). */
export function coloreValore(v: number): string { return v < 40 ? '#EF4444' : v < 70 ? '#F59E0B' : '#22C55E'; }

/** Card della home: bianca, angoli larghi, ombra morbida. Ferma. */
export function Carta({ className, children, tinta }: { className?: string; children: ReactNode; tinta?: string }) {
  return (
    <section
      className={cn('rounded-3xl border shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:shadow-none',
        tinta ?? 'bg-white dark:bg-[#1E293B] border-[#E8ECF3] dark:border-[#334155]', className)}>
      {children}
    </section>
  );
}

/** Barra di avanzamento: la larghezza è subito quella finale. */
export function Barra({ valore, colore, alta = 8, sfondo }: { valore: number; colore: string; alta?: number; sfondo?: string }) {
  return (
    <div className={cn('rounded-full overflow-hidden', sfondo ?? 'bg-[#EEF1F6] dark:bg-[#334155]')} style={{ height: alta }}>
      <div className="h-full rounded-full" style={{ background: colore, width: `${Math.max(0, Math.min(100, valore))}%` }} />
    </div>
  );
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
