// Mattoncini condivisi dalle schermate del profilo: pagina (fondo velato, card bianche), avatar, e gli hook che
// leggono il banco domande attivo, i numeri dell'utente e i badge. Il resto (card, righe, segmenti, titoli di sezione) è in ../ui.
import { useEffect, useMemo, type ReactNode } from 'react';
import { questions } from '../../../data/questions';
import { urlDisegno } from '../../../brand/risorse';
import { useTheme } from '../../../hooks/useTheme';
import { cn } from '../../../lib/utils';
import { iniziale, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { valutaBadge, type BadgeValutato } from '../../../lib/profilo/badge';
import { numeriUtente, type NumeriUtente } from '../../../lib/profilo/numeri';
import { useExtra, useExtraDati } from '../contesto';
import { Pagina as PaginaBase, Sezione } from '../ui';
export { Sezione };

/** Pagina del profilo: la pagina comune a fondo velato, con `indietro` come nome della prop (compatibilità con le schermate esistenti). */
export function Pagina({ titolo, indietro, destra, piede, children }: { titolo: string; indietro?: () => void; destra?: ReactNode; piede?: ReactNode; children: ReactNode }) {
  return <PaginaBase velata titolo={titolo} onBack={indietro} destra={destra} piede={piede}>{children}</PaginaBase>;
}

/** Avatar: la lettera del nome oppure un'illustrazione del kit, in un quadrato dagli angoli morbidi (mai un cerchio attorno a un'illustrazione). Mai una foto. */
export function Avatar({ profilo, lato = 72 }: { profilo: ProfiloDati; lato?: number }) {
  const { isDark } = useTheme();
  const src = profilo.avatar === 'iniziale' ? undefined : urlDisegno('kit-blu', 'illustrazioni', profilo.avatar, isDark);
  return (
    <span className={cn('shrink-0 overflow-hidden grid place-items-center font-extrabold select-none', src ? 'bg-superficie-2' : 'bg-azione-tinta text-azione-testo dark:bg-superficie-2')}
      style={{ width: lato, height: lato, borderRadius: lato * 0.28, fontSize: lato * 0.42 }} aria-hidden="true">
      {src ? <img src={src} alt="" draggable={false} className="w-[80%] h-[80%] object-contain" /> : iniziale(profilo)}
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

/** I numeri dell'utente (domande imparate, probabilità, simulazioni, risposte): una sola fonte per tutte le schermate. */
export function useNumeri(): NumeriUtente {
  const { appState } = useExtra();
  return useMemo(() => numeriUtente(appState, questions), [appState]);
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

/** L'arte di ogni badge. Due scelte del piano d'uso (docs/design/ILLUSTRAZIONI.md §3.4): i badge di costanza hanno il calendario;
 *  `risultato-probabilita` ha scritto nel disegno «82 %», un numero che sembrerebbe dell'utente, e qui non si usa. */
export function arteBadge(b: BadgeValutato): string {
  if (b.gruppo === 'costanza') return 'piano-superamento';
  if (b.illustrazione === 'risultato-probabilita') return 'progressi-statistiche-scheda';
  return b.illustrazione;
}

/** I badge da mettere in vista: prima gli ottenuti, poi quelli più vicini (barra più piena). */
export function badgeInVista(badge: BadgeValutato[], n: number): BadgeValutato[] {
  const ottenuti = badge.filter(b => b.sbloccato);
  const vicini = badge.filter(b => !b.sbloccato && b.raggiungibile).sort((a, b) => b.quota - a.quota);
  return [...ottenuti, ...vicini].slice(0, n);
}
