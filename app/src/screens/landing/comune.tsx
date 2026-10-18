import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { playTapSound } from '../../lib/audio';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { DIAGNOSTIC_QUESTIONS } from '../../config/offer';
import { PulsanteInfo, IconaTono, type Tono } from '../extra/ui';

// Pezzi condivisi dalle sezioni della landing: contenitore, titoli, pulsanti, carte di vetro, data, fatti a icone, foglio «i».

export const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione ';

export const dataEstesa = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

/** Data corta, tutta in cifre (31/01/2027): al posto delle frasi «fino al 31 gennaio 2027». */
export const dataCorta = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

/** Colonna centrata della pagina: sensata a 1280 px, a tutta larghezza sotto. Barra, sezioni e piè di pagina usano la stessa (margini di 72 px a 1280). */
export function Colonna({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-5 sm:px-8', className)}>{children}</div>;
}

/** Ritmo verticale unico: 40 px sopra e sotto sul telefono (80 tra due sezioni), 56 px da 1024 px (112 tra due sezioni). */
export function Sezione({ id, titoloId, className, children }: { id?: string; titoloId?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={titoloId} className={cn('scroll-mt-20 py-10 lg:py-14', className)}>
      <Colonna>{children}</Colonna>
    </section>
  );
}

/** Etichetta di sezione: l'unico stile della pagina (12 px, maiuscolo, blu, niente pillola né numero). */
export function Occhiello({ children, className, ...resto }: { children: ReactNode; className?: string; 'data-testo-ok'?: boolean }) {
  return <p {...resto} className={cn('text-xs font-bold uppercase tracking-[0.08em] text-azione-testo', className)}>{children}</p>;
}

/** Titolo di sezione: l'unica scala della pagina (32 px sul telefono, 44 px da 1024 px); la parte in `<Evidenza>` è blu. */
export const TITOLO_H2 = 'text-[2rem] leading-[1.1] font-extrabold tracking-[-0.025em] text-testo text-balance lg:text-[2.75rem]';

export function TitoloSezione({ id, occhiello, children, className }: { id: string; occhiello?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {occhiello && <Occhiello>{occhiello}</Occhiello>}
      <h2 id={id} className={cn(TITOLO_H2, occhiello && 'mt-2')}>{children}</h2>
    </div>
  );
}

export function Evidenza({ children }: { children: ReactNode }) {
  return <span className="text-azione">{children}</span>;
}

/** Pulsante primario: blu pieno, testo bianco, freccia semplice (niente cerchio). Un solo stile e un solo nome per l'azione in tutta la pagina. */
export function BottoneAzione({ children, onClick, className, freccia = true, grande }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean; grande?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base px-7 transition-colors duration-100 whitespace-nowrap',
        grande ? 'h-14' : 'h-[52px] lg:h-12',
        FOCUS, className,
      )}
    >
      <span>{children}</span>
      {freccia && <Icona nome="avanti" size={20} />}
    </button>
  );
}

/** Pulsante secondario: contorno di 1,5 px. */
export function BottoneContorno({ children, onClick, className, freccia }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-azione-testo/60 bg-transparent hover:bg-azione-tinta text-azione-testo font-bold text-base h-[52px] px-7 transition-colors duration-100 whitespace-nowrap lg:h-12',
        FOCUS, className,
      )}
    >
      {children}{freccia && <Icona nome="avanti" size={18} />}
    </button>
  );
}

/** Link: testo blu con freccia, per le azioni di terzo livello. */
export function BottoneLink({ children, onClick, className, freccia = true }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('inline-flex min-h-11 items-center gap-1.5 rounded text-[15px] font-bold text-azione-testo underline-offset-4 hover:underline', FOCUS, className)}
    >
      {children}{freccia && <Icona nome="avanti" size={18} />}
    </button>
  );
}

/** Carta di vetro usata dalle sezioni (tondeggiante, bordo chiaro, ombra morbida). */
export const SCHEDA = 'vetro rounded-[28px]';

/** Icona nel suo tono + numero o parola: l'unità con cui la landing dice le cose (al posto delle frasi). */
export function Dato({ icona, tono = 'azione', children, etichetta, className, lato = 32 }: { icona: NomeIcona; tono?: Tono; children: ReactNode; etichetta?: string; className?: string; lato?: number }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-bold text-testo', className)} title={etichetta}>
      <IconaTono tono={tono} lato={lato} className="!rounded-full"><Icona nome={icona} size={Math.round(lato * 0.56)} /></IconaTono>
      {etichetta && <span className="sr-only">{etichetta}: </span>}
      <span>{children}</span>
    </span>
  );
}

/** I fatti del diagnostico in una riga di icone: domande, minuti, senza password. */
export function Fatti({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-semibold text-testo', className)} aria-label="In breve">
      <li><Dato icona="risposte" tono="azione" etichetta="Domande">{DIAGNOSTIC_QUESTIONS}</Dato></li>
      <li><Dato icona="tempo" tono="medio" etichetta="Durata">3 min</Dato></li>
      <li><Dato icona="senza-account" tono="viola">Senza password</Dato></li>
    </ul>
  );
}

/**
 * Pulsante «i» e foglio dal basso con la spiegazione a richiesta. Il foglio sta sul body (la landing ha vetri e scorrimento propri che
 * spostano gli elementi fissi) ed è un dialogo: il controllo del testo lo salta. Si chiude con la X, toccando fuori o con Esc.
 */
export function InfoFoglio({ titolo, etichetta = 'Informazioni', children, className, bottone }: { titolo: string; etichetta?: string; children: ReactNode; className?: string; bottone?: (apri: () => void) => ReactNode }) {
  const [aperto, setAperto] = useState(false);
  useEffect(() => {
    if (!aperto) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setAperto(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [aperto]);
  return (
    <>
      {bottone ? bottone(() => setAperto(true)) : <PulsanteInfo onClick={() => setAperto(true)} etichetta={etichetta} className={className} />}
      {aperto && createPortal(
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-testo/40" onClick={e => { if (e.target === e.currentTarget) setAperto(false); }}>
          <div role="dialog" aria-modal="true" aria-label={titolo} className="max-h-[80%] w-full max-w-xl overflow-y-auto rounded-t-[24px] bg-superficie p-6 pb-8 text-testo shadow-xl dark:shadow-none">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[18px] leading-[24px] font-extrabold">{titolo}</h2>
              <button type="button" onClick={() => setAperto(false)} aria-label="Chiudi" className="brand-premibile grid h-9 w-9 place-items-center rounded-full bg-superficie-2 text-testo"><Icona nome="chiudi" size={20} /></button>
            </div>
            <div className="text-[14.5px] leading-[21px] text-testo">{children}</div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
