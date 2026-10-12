// Pezzi comuni alle schermate delle sfide: pagina con intestazione, schede Sfide/Classifica/Amici, carte, bottoni, tema.
import { useEffect, useState, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useExtra } from '../contesto';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { FONT } from '../../../brand/tokens';
import { confronta, tempoBreve, type Esito, type Risultato } from '../../../lib/sfide/risultati';

export function useScuro(): boolean {
  const [scuro, setScuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const o = new MutationObserver(() => setScuro(document.documentElement.classList.contains('dark')));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => o.disconnect();
  }, []);
  return scuro;
}

/** Pagina a scorrimento nello stile di Lezioni: cornice, colonna centrata, intestazione con freccia indietro. */
export function Pagina({ titolo, sottotitolo, onBack, destra, children }: {
  titolo: string; sottotitolo?: string; onBack?: () => void; destra?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-8">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {onBack && (
                <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
                  className="brand-premibile -ml-2 mb-1 p-1 rounded-full text-testo-tenue hover:text-testo">
                  <ChevronLeft size={26} strokeWidth={2.5} />
                </button>
              )}
              <h1 className="text-[28px] leading-[36px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
              {sottotitolo && <p className="mt-1 text-[14px] leading-[20px] text-testo-tenue">{sottotitolo}</p>}
            </div>
            {destra && <div className="shrink-0">{destra}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

const SCHEDE = [['sfide', 'Sfide'], ['classifica', 'Classifica'], ['amici', 'Amici']] as const;

/** Le tre schede del concept (Sfide, Classifica, Amici). Sono tre schermate: toccarne una la apre. */
export function SchedeSfide({ attiva }: { attiva: 'sfide' | 'classifica' | 'amici' }) {
  const { vai } = useExtra();
  return (
    <nav aria-label="Sfide" className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-[12px] bg-superficie-2">
      {SCHEDE.map(([id, nome]) => {
        const on = id === attiva;
        return (
          <button key={id} type="button" aria-current={on ? 'page' : undefined} onClick={() => { if (!on) { playTapSound(); vai(id); } }}
            className={cn('rounded-[9px] py-2.5 text-[13.5px] font-semibold transition-colors duration-100',
              on ? 'bg-azione text-azione-su' : 'text-testo-tenue hover:text-testo')}>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}

export function Sezione({ id, titolo, destra, children, className }: { id: string; titolo: string; destra?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('mt-6 flex flex-col gap-[10px]', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{titolo}</h2>
        {destra}
      </div>
      {children}
    </section>
  );
}

export function Carta({ children, className, tono = 'neutro' }: { children: ReactNode; className?: string; tono?: 'neutro' | 'azione' | 'alto' | 'medio' }) {
  const toni = {
    neutro: 'bg-superficie-2 border-linea',
    azione: 'bg-azione-tinta border-azione/25',
    alto: 'bg-alto-tinta border-alto/25',
    medio: 'bg-medio-tinta border-medio/30',
  } as const;
  return <div className={cn('rounded-[16px] border p-4', toni[tono], className)}>{children}</div>;
}

const BASE_BOTTONE = 'brand-premibile w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 text-[15px] font-bold transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none';
export function Bottone({ children, onClick, variante = 'primario', disabled, className, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variante?: 'primario' | 'secondario' | 'testo'; disabled?: boolean; className?: string; type?: 'button' | 'submit';
}) {
  const v = {
    primario: 'bg-azione text-azione-su hover:bg-azione-scuro',
    secondario: 'border border-azione text-azione-scuro bg-superficie',
    testo: 'text-azione-scuro bg-transparent',
  } as const;
  return (
    <button type={type} disabled={disabled} onClick={onClick ? () => { playTapSound(); onClick(); } : undefined} className={cn(BASE_BOTTONE, v[variante], className)}>
      {children}
    </button>
  );
}

export function Campo({ id, etichetta, valore, onCambia, segnaposto, maxLength, errore, onInvio }: {
  id: string; etichetta: string; valore: string; onCambia: (v: string) => void; segnaposto?: string; maxLength?: number; errore?: string | null; onInvio?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-testo-tenue">{etichetta}</label>
      <input id={id} value={valore} onChange={e => onCambia(e.target.value)} placeholder={segnaposto} maxLength={maxLength}
        autoComplete="off" spellCheck={false}
        onKeyDown={onInvio ? e => { if (e.key === 'Enter') onInvio(); } : undefined}
        aria-invalid={errore ? true : undefined} aria-describedby={errore ? `${id}-err` : undefined}
        className="min-w-0 rounded-2xl border border-linea bg-superficie px-4 py-3 text-[15px] font-semibold text-testo placeholder:text-testo-tenue placeholder:font-medium focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30" />
      {errore && <p id={`${id}-err`} role="alert" className="text-[13px] font-bold text-basso-testo">{errore}</p>}
    </div>
  );
}

/** «Vinto», «Pari», «Perso»: parola e forma, non solo colore. */
export function EtichettaEsito({ esito }: { esito: Esito }) {
  const m = {
    vinto: ['Vinto', 'bg-alto-tinta text-alto-testo border-alto/30'],
    pari: ['Pari', 'bg-superficie text-testo-tenue border-linea'],
    perso: ['Perso', 'bg-basso-tinta text-basso-testo border-basso/30'],
  } as const;
  return <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-[12px] font-bold', m[esito][1])}>{m[esito][0]}</span>;
}

export { confronta, tempoBreve };
export type { Risultato };

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
/** «12 ott» */
export function dataBreve(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${MESI[d.getMonth()]}`;
}
/** «lunedì 12 ottobre» */
export function dataLunga(d: Date = new Date()): string {
  const t = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
