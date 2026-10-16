// Mattoncini comuni alle schermate di studio: pagina con intestazione, bottoni, barre. Tutto con i token (chiaro e scuro).
import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { cn } from '../../../lib/utils';
import { playTapSound } from '../../../lib/audio';
import { FONT } from '../../../brand/tokens';
export { TitoloSezione } from '../../../components/home/Stima';
export { Carta, Barra, coloreValore } from '../../../components/home/comune';

import { Pagina as PaginaBase, TONI, IconaTono, BarraTono, type Tono } from '../ui';
export { TONI, IconaTono, BarraTono };
export type { Tono };
/** Pagina di studio: la pagina comune, con i nomi delle prop usati da queste schermate. */
export function Pagina({ titolo, sotto, onIndietro, destra, children }: {
  titolo: string; sotto?: ReactNode; onIndietro?: () => void; destra?: ReactNode; children: ReactNode; larghezza?: number;
}) {
  return <PaginaBase titolo={titolo} sottotitolo={sotto} onBack={onIndietro} destra={destra}>{children}</PaginaBase>;
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

/** Stato vuoto: icona, titolo di 2-4 parole, un'azione facoltativa. Il testo è facoltativo e si usa solo dove serve davvero. */
export function StatoVuoto({ titolo, testo, icona, children }: { titolo: string; testo?: string; icona?: NomeIcona; children?: ReactNode }) {
  return (
    <div role="status" className="rounded-[12px] bg-superficie-2 px-5 py-7 text-center">
      {icona && <span aria-hidden="true" className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-[14px] bg-superficie text-testo-tenue"><Icona nome={icona} size={26} /></span>}
      <p className="text-[16px] leading-[22px] font-bold text-testo">{titolo}</p>
      {testo && <p className="mt-1.5 mx-auto max-w-[34ch] text-[14px] leading-[20px] text-testo-tenue">{testo}</p>}
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

/** Un tono per livello (A1 blu, A2 viola, B1 ambra): vale in tutta l'app, in teoria, percorso, lezione. Il verde e il corallo restano degli stati (imparata, errore). */
export const TONO_LIVELLO: Record<string, Tono> = { A1: 'azione', A2: 'viola', B1: 'medio' };

/** Piccola etichetta del livello («A1») nel tono del livello. */
export function ChipLivello({ livello, className }: { livello: string; className?: string }) {
  const t = TONI[TONO_LIVELLO[livello] ?? 'azione'];
  return <span className={cn('inline-flex items-center rounded-[7px] px-1.5 py-0.5 text-[11.5px] leading-[14px] font-extrabold tabular-nums', t.tinta, t.testo, className)}>{livello}</span>;
}
