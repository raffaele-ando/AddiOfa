// Mattoncini comuni alle schermate di studio: pagina con intestazione, bottoni, barre. Tutto con i token (chiaro e scuro).
import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { cn } from '../../../lib/utils';
import { playTapSound } from '../../../lib/audio';
import { FONT } from '../../../brand/tokens';
import { Illustrazione } from '../../../brand/Illustrazione';
import type { KitId } from '../../../brand/risorse';
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

/** Bottone pieno (azione principale) o con bordo (secondaria), alto almeno 52 px, sempre con la parola del verbo. */
export function Bottone({ children, onClick, variante = 'primario', disabled, className, icona }: {
  children: ReactNode; onClick: () => void; variante?: 'primario' | 'secondario'; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'w-full min-h-[52px] rounded-[12px] px-4 py-3 text-[15px] font-bold flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-50',
        variante === 'primario' ? 'bg-azione text-azione-su hover:bg-azione-scuro' : 'border border-azione/60 bg-superficie text-azione hover:bg-azione-tinta',
        className,
      )}>
      {icona}{children}
    </button>
  );
}

/** Un'illustrazione del Brand Kit scelta per nome (kit blu piatto di default; `luminoso` per le testate da 160 px in su). */
export function Arte({ nome, lato, kit, gruppo, className }: { nome: string; lato: number; kit?: KitId; gruppo?: string; className?: string }) {
  return <span aria-hidden="true" className={cn('inline-block shrink-0', className)}><Illustrazione nome={nome} lato={lato} kit={kit} gruppo={gruppo} /></span>;
}

/** Tessera quadrata con una piccola illustrazione dentro (righe di elenco e carte di argomento). */
export function TesseraArte({ nome, kit, gruppo, lato = 56, className }: { nome: string; kit?: KitId; gruppo?: string; lato?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('grid shrink-0 place-items-center', className)} style={{ width: lato, height: lato }}>
      <Illustrazione nome={nome} lato={lato} kit={kit} gruppo={gruppo} />
    </span>
  );
}

/** Stato vuoto, errore, non trovato: un'illustrazione degli stati (o un'icona), un titolo, UNA riga con la causa (sempre visibile, ≤ 10 parole) e un'azione con il verbo.
 *  `pagina`: occupa la pagina intera, centrato e senza carta; senza, sta dentro un elenco come carta. Mai una faccia triste, mai due stati impilati. */
export function StatoVuoto({ titolo, testo, icona, illustrazione, children, pagina }: {
  titolo: string; testo?: string; icona?: NomeIcona; illustrazione?: { nome: string; gruppo?: string; kit?: KitId; lato?: number }; children?: ReactNode; pagina?: boolean;
}) {
  return (
    <div role="status" className={cn('text-center', pagina ? 'flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-6' : 'rounded-[12px] bg-superficie-2 px-5 py-6')}>
      {illustrazione
        ? <div className="mx-auto mb-3 flex justify-center"><Arte nome={illustrazione.nome} gruppo={illustrazione.gruppo ?? 'stati'} kit={illustrazione.kit} lato={illustrazione.lato ?? 96} /></div>
        : icona && <span aria-hidden="true" className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-[14px] bg-superficie text-testo-tenue"><Icona nome={icona} size={26} /></span>}
      <p className="text-[20px] leading-[26px] font-bold text-testo">{titolo}</p>
      {testo && <p data-testo-ok className="mt-1.5 mx-auto max-w-[34ch] text-[15px] leading-[22px] text-testo-tenue">{testo}</p>}
      {children && <div className="mt-5 mx-auto flex w-full max-w-[300px] flex-col gap-2.5">{children}</div>}
    </div>
  );
}

export type StatoOpzione = 'neutra' | 'scelta' | 'giusta' | 'sbagliata' | 'spenta';

/** Una risposta a scelta multipla, uguale nello studio e nella simulazione: la scelta è sempre tinta blu con bordo e cerchio pieni;
 *  giusta e sbagliata (solo studio) hanno anche l'icona e una parola per chi legge a voce. */
export function OpzioneRisposta({ lettera, testo, stato, disabilitata, onClick }: {
  lettera: string; testo: string; stato: StatoOpzione; disabilitata?: boolean; onClick?: () => void;
}) {
  const classi: Record<StatoOpzione, { riga: string; cerchio: string }> = {
    neutra: { riga: 'border-tacca bg-superficie-2 hover:bg-linea', cerchio: 'border-tacca bg-superficie text-testo' },
    scelta: { riga: 'border-azione bg-azione-tinta', cerchio: 'border-azione bg-azione text-azione-su' },
    giusta: { riga: 'border-alto bg-alto-tinta', cerchio: 'border-alto bg-alto-pieno text-alto-su' },
    sbagliata: { riga: 'border-errore bg-errore-tinta', cerchio: 'border-errore bg-errore text-errore-su' },
    spenta: { riga: 'border-linea bg-superficie-2 opacity-45', cerchio: 'border-tacca bg-superficie text-testo' },
  };
  const c = classi[stato];
  return (
    <button type="button" disabled={disabilitata} onClick={onClick} aria-pressed={stato === 'scelta'}
      className={cn('flex min-h-[56px] w-full items-center gap-4 rounded-2xl border-[1.5px] p-3 text-left text-testo transition-colors duration-100', c.riga)}>
      <span aria-hidden="true" className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors duration-100', c.cerchio)}>{lettera}</span>
      <span data-testo-ok className="min-w-0 flex-1 text-[16px] font-semibold leading-snug">{testo}</span>
      {stato === 'giusta' && <><Icona nome="stato-risposta-giusta" size={22} className="shrink-0 text-alto-testo" /><span className="sr-only">Giusta</span></>}
      {stato === 'sbagliata' && <><Icona nome="stato-risposta-sbagliata" size={22} className="shrink-0 text-errore-testo" /><span className="sr-only">Sbagliata</span></>}
    </button>
  );
}

/** Virgolette dritte attorno a una parola o a una frase («'more' …») diventano caporali; gli apostrofi (l'auto, students') restano. */
export function tipografiche(t: string): string {
  return t.replace(/(^|[\s(\[—-])'((?:[^'\n]|'(?=\p{L})){1,80}?)'(?=$|[\s.,;:!?)\]—])/gu, '$1«$2»');
}

/** Data breve in italiano: «12 ott»; l'anno compare solo se non è quello in corso («12 ott 2025»). */
export function dataBreve(t: number): string {
  try {
    const d = new Date(t);
    const stessoAnno = d.getFullYear() === new Date().getFullYear();
    return d.toLocaleDateString('it-IT', stessoAnno ? { day: 'numeric', month: 'short' } : { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
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
