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

/** Etichetta sopra il titolo: pillola con l'icona della sezione e lettere spaziate, come nei concept. */
export function Occhiello({ children, icona }: { children: ReactNode; icona?: NomeIcona }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-azione-tinta px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-azione-scuro">
      {icona && <Icona nome={icona} size={14} />}{children}
    </span>
  );
}

export function TitoloSezione({ id, occhiello, icona, children, className, destra }: { id: string; occhiello?: string; icona?: NomeIcona; children: ReactNode; className?: string; destra?: ReactNode }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {occhiello && <Occhiello icona={icona}>{occhiello}</Occhiello>}
      <div className={cn('flex items-start gap-2', occhiello && 'mt-4')}>
        <h2 id={id} className="text-[2.4rem] sm:text-5xl font-extrabold leading-[1.05] tracking-tight text-testo">{children}</h2>
        {destra}
      </div>
    </div>
  );
}

export function Evidenza({ children }: { children: ReactNode }) {
  return <span className="text-azione ">{children}</span>;
}

/** Pulsante pieno blu, a pillola, con la freccia in un cerchio chiaro. */
export function BottoneAzione({ children, onClick, className, freccia = true, etichetta }: { children: ReactNode; onClick: () => void; className?: string; freccia?: boolean; etichetta?: string }) {
  return (
    <button
      type="button"
      aria-label={etichetta}
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'inline-flex items-center justify-between gap-4 rounded-full bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base sm:text-lg py-2.5 pl-7 pr-2.5 shadow-[0_14px_28px_-8px_rgba(37,99,235,0.55)] dark:shadow-none transition-colors duration-100 ',
        FOCUS, className,
      )}
    >
      <span>{children}</span>
      {freccia && (
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-azione-su text-azione">
          <Icona nome="avanti" size={22} />
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

/** I fatti del diagnostico in una riga di icone: domande, minuti, senza account (e «Gratis» solo dove si presenta il sito: `gratis`). */
export function Fatti({ className, gratis = false }: { className?: string; gratis?: boolean }) {
  return (
    <ul className={cn('flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-semibold text-testo', className)} aria-label="In breve">
      <li><Dato icona="risposte" tono="azione" etichetta="Domande">{DIAGNOSTIC_QUESTIONS}</Dato></li>
      <li><Dato icona="tempo" tono="medio" etichetta="Durata">3 min</Dato></li>
      {gratis && <li><Dato icona="gratis" tono="alto">Gratis</Dato></li>}
      <li><Dato icona="senza-account" tono="viola">Senza account</Dato></li>
    </ul>
  );
}

/**
 * Pulsante «i» e foglio dal basso con la spiegazione a richiesta. Il foglio sta sul body (la landing ha vetri e scorrimento propri che
 * spostano gli elementi fissi) ed è un dialogo: il controllo del testo lo salta. Si chiude con la X, toccando fuori o con Esc.
 */
export function InfoFoglio({ titolo, etichetta = 'Informazioni', children, className }: { titolo: string; etichetta?: string; children: ReactNode; className?: string }) {
  const [aperto, setAperto] = useState(false);
  useEffect(() => {
    if (!aperto) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setAperto(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [aperto]);
  return (
    <>
      <PulsanteInfo onClick={() => setAperto(true)} etichetta={etichetta} className={className} />
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
