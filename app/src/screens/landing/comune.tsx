import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';

// Pezzi condivisi dalle sezioni della landing: ingresso in sequenza, contenitore, titoli, pulsanti, data.

export const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione dark:focus-visible:outline-azione-chiaro';

export const dataEstesa = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

/** Compare salendo di poco quando entra nello schermo; con "riduci movimento" è già al suo posto. */
export function Ingresso({ children, ritardo = 0, className, daSinistra }: { children: ReactNode; ritardo?: number; className?: string; daSinistra?: boolean }) {
  const riduci = useReducedMotion();
  if (riduci) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: daSinistra ? 0 : 16, x: daSinistra ? -16 : 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: ritardo, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Colonna centrata della pagina: sensata a 1280 px, a tutta larghezza sotto. */
export function Colonna({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>{children}</div>;
}

export function Sezione({ id, titoloId, className, children }: { id?: string; titoloId?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={titoloId} className={cn('scroll-mt-20 py-14 sm:py-20', className)}>
      <Colonna>{children}</Colonna>
    </section>
  );
}

export function Occhiello({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-azione-tinta dark:bg-azione-tinta-scura/60 px-3 py-1 text-xs font-bold tracking-wide text-azione-scuro dark:text-[#BFDBFE]">
      {children}
    </span>
  );
}

export function TitoloSezione({ id, occhiello, children, sotto, className }: { id: string; occhiello?: string; children: ReactNode; sotto?: ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {occhiello && <Occhiello>{occhiello}</Occhiello>}
      <h2 id={id} className={cn('text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-[#0F172A] dark:text-[#F8FAFC]', occhiello && 'mt-3')}>{children}</h2>
      {sotto && <p className="mt-3 text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300">{sotto}</p>}
    </div>
  );
}

export function Evidenza({ children }: { children: ReactNode }) {
  return <span className="text-azione dark:text-azione-chiaro">{children}</span>;
}

/** Pulsante pieno blu (#2563EB con testo bianco). */
export function BottoneAzione({ children, onClick, className, freccia = true }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl bg-azione hover:bg-azione-scuro active:scale-[.99] text-white font-bold text-base sm:text-lg py-3.5 px-6 shadow-[0_8px_20px_rgba(37,99,235,0.25)] dark:shadow-none transition-all duration-150',
        FOCUS, className,
      )}
    >
      <span>{children}</span>
      {freccia && <ChevronRight size={20} strokeWidth={3} aria-hidden />}
    </button>
  );
}

/** Pulsante a contorno, per l'azione secondaria. */
export function BottoneContorno({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-300 dark:border-[#475569] bg-white/70 dark:bg-[#0F172A]/60 hover:bg-white dark:hover:bg-[#1E293B] active:scale-[.99] text-[#0F172A] dark:text-[#F8FAFC] font-bold text-base py-3.5 px-6 transition-all duration-150',
        FOCUS, className,
      )}
    >
      {children}
    </button>
  );
}

/** Superficie bianca con bordo morbido, usata dalle schede. */
export const SCHEDA =
  'rounded-3xl border border-[#E2E8F0] dark:border-[#334155] bg-white dark:bg-[#1E293B] shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:shadow-none';
