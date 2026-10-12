// Mattoncini condivisi dalle schermate del profilo: pagina con intestazione, avatar, righe di lista, e gli hook che
// leggono il banco domande attivo e i badge. Stile: lo stesso di Lezioni e Impostazioni (carte superficie-2, token, niente animazioni).
import { useEffect, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CorpusType } from '../../../types';
import { getQuestionsByCorpus, questions } from '../../../data/questions';
import { urlDisegno } from '../../../brand/risorse';
import { FONT } from '../../../brand/tokens';
import { useTheme } from '../../../hooks/useTheme';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { iniziale, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { valutaBadge, type BadgeValutato } from '../../../lib/profilo/badge';
import { useExtra, useExtraDati } from '../contesto';

/** Pagina a scorrimento con intestazione: freccia indietro (se c'è `indietro`), titolo grande, elemento a destra. */
export function Pagina({ titolo, indietro, destra, children }: { titolo: string; indietro?: () => void; destra?: ReactNode; children: ReactNode }) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(12px,env(safe-area-inset-top))] pb-8">
          {indietro && (
            <div className="flex items-center h-11">
              <button type="button" onClick={() => { playTapSound(); indietro(); }} aria-label="Indietro"
                className="brand-premibile -ml-2.5 pl-1 pr-2 h-11 flex items-center gap-0.5 text-azione text-[16px]">
                <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" /> Indietro
              </button>
            </div>
          )}
          <header className={cn('flex items-center justify-between gap-3', indietro ? 'mt-0.5' : 'mt-2')}>
            <h1 className="text-[28px] leading-[36px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
            {destra}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Sezione({ titolo, id, children, className }: { titolo: string; id: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('mt-[24px] flex flex-col gap-[10px]', className)}>
      <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{titolo}</h2>
      {children}
    </section>
  );
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

/** Riga di lista cliccabile (icona, titolo, testo, freccia). */
export function RigaLista({ icona, titolo, testo, destra, onClick }: { icona: ReactNode; titolo: string; testo?: string; destra?: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full flex items-center gap-3 px-3.5 py-[11px] min-h-[56px] text-left">
      <span className="w-[34px] h-[34px] rounded-[9px] bg-azione-tinta text-azione flex items-center justify-center shrink-0" aria-hidden="true">{icona}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] leading-[20px] font-semibold text-testo">{titolo}</span>
        {testo && <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{testo}</span>}
      </span>
      {destra}
      <ChevronRight size={20} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />
    </button>
  );
}

export function GruppoRighe({ children }: { children: ReactNode }) {
  return <div className="rounded-[12px] bg-superficie-2 overflow-hidden divide-y divide-linea">{children}</div>;
}

/** Il profilo salvato, già ripulito. */
export function useProfilo() {
  const [grezzo, salva] = useExtraDati<ProfiloDati | null>('profilo', null);
  const profilo = useMemo(() => normalizzaProfilo(grezzo), [grezzo]);
  return { profilo, salva: (p: ProfiloDati) => salva(normalizzaProfilo(p)) };
}

/** Domande che l'utente può studiare adesso (nucleo gratuito, o tutto il banco con il Pass) e tutto il banco. */
export function useBanco() {
  const { appState, pass } = useExtra();
  const corpus: CorpusType = pass ? (appState.selectedCorpus || 'all') : 'initial';
  return useMemo(() => ({ pool: getQuestionsByCorpus(corpus), nucleo: getQuestionsByCorpus('initial'), tutte: questions, corpus }), [corpus]);
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
  const { pool, nucleo, tutte } = useBanco();
  const [salvati, salva] = useExtraDati<Record<string, number>>('badge-sbloccati', {});
  const chiave = Object.keys(salvati).sort().join(',');
  const valutati = useMemo(
    () => valutaBadge({ stato: appState, pool, nucleo, tutte }, chiave ? chiave.split(',') : []),
    [appState, pool, nucleo, tutte, chiave],
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
