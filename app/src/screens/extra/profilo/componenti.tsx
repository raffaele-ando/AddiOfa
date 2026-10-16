// Mattoncini condivisi dalle schermate del profilo: pagina con intestazione, avatar, righe di lista, e gli hook che
// leggono il banco domande attivo e i badge. Stile: lo stesso di Lezioni e Impostazioni (carte superficie-2, token, niente animazioni).
import { useEffect, useMemo, type ReactNode } from 'react';
import { questions } from '../../../data/questions';
import { urlDisegno } from '../../../brand/risorse';
import { useTheme } from '../../../hooks/useTheme';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { iniziale, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { valutaBadge, type BadgeValutato } from '../../../lib/profilo/badge';
import { useExtra, useExtraDati } from '../contesto';

import { IconaTono, Pagina as PaginaBase, Sezione, TONI, type Tono } from '../ui';
export { Sezione };
/** Pagina del profilo: la pagina comune, con `indietro` come nome della prop (compatibilità con le schermate esistenti). */
export function Pagina({ titolo, indietro, destra, children }: { titolo: string; indietro?: () => void; destra?: ReactNode; children: ReactNode }) {
  return <PaginaBase titolo={titolo} onBack={indietro} destra={destra}>{children}</PaginaBase>;
}

/** Avatar tondo: la lettera del nome oppure un'illustrazione del kit. Mai una foto. */
export function Avatar({ profilo, lato = 72 }: { profilo: ProfiloDati; lato?: number }) {
  const { isDark } = useTheme();
  const src = profilo.avatar === 'iniziale' ? undefined : urlDisegno('kit-blu', 'illustrazioni', profilo.avatar, isDark);
  return (
    <span className="shrink-0 rounded-full overflow-hidden bg-azione-tinta text-azione grid place-items-center font-extrabold select-none"
      style={{ width: lato, height: lato, fontSize: lato * 0.42 }} aria-hidden="true">
      {src ? <img src={src} alt="" draggable={false} className="w-[84%] h-[84%] object-contain" /> : iniziale(profilo)}
    </span>
  );
}

/** Tessera di un solo gesto: icona nel tono del suo significato e UNA parola. */
export function TesseraIcona({ icona, tono = 'azione', parola, onClick }: { icona: ReactNode; tono?: Tono; parola: string; onClick: () => void }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile flex flex-col items-center justify-center gap-2.5 rounded-[14px] bg-superficie-2 px-2 py-4 min-h-[96px]">
      <IconaTono tono={tono} lato={44} className="rounded-[13px] bg-superficie">{icona}</IconaTono>
      <span className="text-[14.5px] leading-[18px] font-bold text-testo">{parola}</span>
    </button>
  );
}

/** Selettore a sole icone (una per sezione, con `aria-label`): la scelta è quella con lo sfondo blu chiaro. */
export function SelettoreIcone<T extends string>({ nome, voci, valore, onScegli }: {
  nome: string; voci: { id: T; icona: ReactNode; nome: string }[]; valore: T; onScegli: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className="grid gap-1 p-1 rounded-[14px] bg-superficie-2" style={{ gridTemplateColumns: `repeat(${voci.length}, minmax(0, 1fr))` }}>
      {voci.map(v => {
        const on = v.id === valore;
        return (
          <button key={v.id} type="button" role="radio" aria-checked={on} aria-label={v.nome} title={v.nome}
            onClick={() => { playTapSound(); onScegli(v.id); }}
            className={cn('brand-premibile h-11 rounded-[10px] grid place-items-center', on ? 'bg-superficie text-azione-scuro shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>
            {v.icona}
          </button>
        );
      })}
    </div>
  );
}

/** Icona + numero (con il tono del significato): al posto di una frase. */
export function Numero({ icona, valore, tono = 'azione', nome, className }: { icona: ReactNode; valore: ReactNode; tono?: Tono; nome: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-bold tabular-nums', className)} role="img" aria-label={`${nome}: ${typeof valore === 'string' || typeof valore === 'number' ? valore : ''}`}>
      <span aria-hidden="true" className={TONI[tono].icona}>{icona}</span><span aria-hidden="true" className="text-testo">{valore}</span>
    </span>
  );
}

/** Il profilo salvato, già ripulito. */
export function useProfilo() {
  const [grezzo, salva] = useExtraDati<ProfiloDati | null>('profilo', null);
  const profilo = useMemo(() => normalizzaProfilo(grezzo), [grezzo]);
  return { profilo, salva: (p: ProfiloDati) => salva(normalizzaProfilo(p)) };
}

/** Il banco domande: uno solo, tutte le domande. */
export function useBanco() {
  return questions;
}

/** Oggi, fissato al montaggio della schermata. */
export function useOggi(): Date {
  return useMemo(() => new Date(), []);
}

/**
 * I badge valutati sullo stato attuale. Quelli visti sbloccati si salvano (appState.extra['badge-sbloccati']):
 * restano sbloccati anche se poi una domanda torna «in corso».
 */
export function useBadge(): BadgeValutato[] {
  const { appState } = useExtra();
  const banco = useBanco();
  const [salvati, salva] = useExtraDati<Record<string, number>>('badge-sbloccati', {});
  const chiave = Object.keys(salvati).sort().join(',');
  const valutati = useMemo(
    () => valutaBadge({ stato: appState, banco }, chiave ? chiave.split(',') : []),
    [appState, banco, chiave],
  );
  useEffect(() => {
    const nuovi = valutati.filter(b => b.sbloccato && !(b.id in salvati));
    if (nuovi.length > 0) {
      const adesso = Date.now();
      salva(prec => ({ ...prec, ...Object.fromEntries(nuovi.map(b => [b.id, adesso])) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valutati]);
  return valutati;
}
