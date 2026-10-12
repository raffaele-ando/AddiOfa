import { ReactNode } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';

// Pezzi condivisi dalle sezioni della landing: contenitore, titoli, pulsanti, carte di vetro, data.

export const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione ';

export const dataEstesa = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

/** Colonna centrata della pagina: sensata a 1280 px, a tutta larghezza sotto. */
export function Colonna({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-5 sm:px-8', className)}>{children}</div>;
}

export function Sezione({ id, titoloId, className, children }: { id?: string; titoloId?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={titoloId} className={cn('scroll-mt-20 py-14 sm:py-20', className)}>
      <Colonna>{children}</Colonna>
    </section>
  );
}

/** Etichetta sopra il titolo: pillola con freccina e lettere spaziate, come nei concept. */
export function Occhiello({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-azione-tinta px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-azione-scuro">
      <ArrowRight size={12} strokeWidth={3} aria-hidden />{children}
    </span>
  );
}

export function TitoloSezione({ id, occhiello, children, sotto, className }: { id: string; occhiello?: string; children: ReactNode; sotto?: ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {occhiello && <Occhiello>{occhiello}</Occhiello>}
      <h2 id={id} className={cn('text-[2.4rem] sm:text-5xl font-extrabold leading-[1.05] tracking-tight text-testo', occhiello && 'mt-4')}>{children}</h2>
      {sotto && <p className="mt-4 text-base sm:text-lg font-medium text-testo-tenue">{sotto}</p>}
    </div>
  );
}

export function Evidenza({ children }: { children: ReactNode }) {
  return <span className="text-azione ">{children}</span>;
}

/** Pulsante pieno blu, a pillola, con la freccia in un cerchio chiaro. */
export function BottoneAzione({ children, onClick, className, freccia = true }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-between gap-4 rounded-full bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base sm:text-lg py-2.5 pl-7 pr-2.5 shadow-[0_14px_28px_-8px_rgba(37,99,235,0.55)] dark:shadow-none transition-colors duration-100 ',
        FOCUS, className,
      )}
    >
      <span>{children}</span>
      {freccia && (
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azione-su text-azione">
          <ArrowRight size={20} strokeWidth={2.6} />
        </span>
      )}
    </button>
  );
}

/** Pulsante a contorno, per l'azione secondaria. */
export function BottoneContorno({ children, onClick, className, freccia }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'vetro vetro-forte inline-flex items-center justify-center gap-2 rounded-full !border-testo/30 hover:bg-linea text-testo font-bold text-base py-3.5 px-7 transition-colors duration-100 ',
        FOCUS, className,
      )}
    >
      {children}{freccia && <ChevronRight size={18} strokeWidth={2.6} aria-hidden />}
    </button>
  );
}

/** Carta di vetro usata dalle sezioni (tondeggiante, bordo chiaro, ombra morbida). */
export const SCHEDA = 'vetro rounded-[28px]';
