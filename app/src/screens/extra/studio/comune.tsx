// Mattoncini comuni alle schermate di studio: pagina con intestazione, bottoni, barre. Tutto con i token (chiaro e scuro).
import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { playTapSound } from '../../../lib/audio';
import { FONT } from '../../../brand/tokens';
export { TitoloSezione } from '../../../components/home/Stima';
export { Carta, Barra, coloreValore } from '../../../components/home/comune';

/** Pagina a scorrimento con la freccia indietro e il titolo, come Lezioni e Impostazioni. */
export function Pagina({ titolo, sotto, onIndietro, destra, children, larghezza = 520 }: {
  titolo: string; sotto?: ReactNode; onIndietro?: () => void; destra?: ReactNode; children: ReactNode; larghezza?: number;
}) {
  return (
    <div className="h-full w-full bg-superficie text-testo overflow-y-auto scrollbar-hide" style={{ fontFamily: FONT }}>
      <div className="mx-auto w-full px-5 pt-[max(14px,env(safe-area-inset-top))] pb-8" style={{ maxWidth: larghezza }}>
        <header className="flex items-start gap-1">
          {onIndietro && (
            <button type="button" onClick={() => { playTapSound(); onIndietro(); }} aria-label="Indietro"
              className="-ml-2 mt-[3px] grid place-items-center w-10 h-10 shrink-0 rounded-full text-testo-tenue hover:text-testo">
              <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
            </button>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-[26px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
            {sotto && <p className="mt-0.5 text-[14px] leading-[20px] text-testo-tenue">{sotto}</p>}
          </div>
          {destra}
        </header>
        {children}
      </div>
    </div>
  );
}

/** Bottone pieno (azione principale) o con bordo (secondaria), alto almeno 48 px. */
export function Bottone({ children, onClick, variante = 'primario', disabled, className, icona }: {
  children: ReactNode; onClick: () => void; variante?: 'primario' | 'secondario'; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'w-full min-h-[48px] rounded-[12px] px-4 py-3 text-[15px] font-bold flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50',
        variante === 'primario' ? 'bg-azione text-azione-su hover:bg-azione-scuro' : 'border border-azione/60 bg-superficie text-azione hover:bg-azione-tinta',
        className,
      )}>
      {icona}{children}
    </button>
  );
}

/** Una nota di stato vuoto: icona leggera, riga principale, riga che spiega, bottone facoltativo. */
export function StatoVuoto({ titolo, testo, children }: { titolo: string; testo: string; children?: ReactNode }) {
  return (
    <div role="status" className="rounded-[12px] bg-superficie-2 px-5 py-7 text-center">
      <p className="text-[16px] leading-[22px] font-bold text-testo">{titolo}</p>
      <p className="mt-1.5 mx-auto max-w-[34ch] text-[14px] leading-[20px] text-testo-tenue">{testo}</p>
      {children && <div className="mt-4 mx-auto max-w-[280px]">{children}</div>}
    </div>
  );
}

/** Data breve in italiano: «12 ott 2026». */
export function dataBreve(t: number): string {
  try { return new Date(t).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return ''; }
}

/** Secondi in «12:05». */
export function minSec(secondi: number): string {
  const s = Math.max(0, Math.round(secondi));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
