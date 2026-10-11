import { ReactNode, useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

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
