// Mattoncini condivisi dalle schermate del profilo: pagina (fondo velato, card bianche), avatar, e gli hook che
// leggono il banco domande attivo, i numeri dell'utente e i badge. Il resto (card, righe, segmenti, titoli di sezione) è in ../ui.
import { useEffect, useMemo, type ReactNode } from 'react';
import { questions } from '../../../data/questions';
import { iniziale, normalizzaProfilo, type ProfiloDati } from '../../../lib/profilo/dati';
import { valutaBadge, type BadgeValutato, type GruppoBadge } from '../../../lib/profilo/badge';
import { Icona } from '../../../brand/icone/Icona';
import { cn } from '../../../lib/utils';
import { numeriUtente, type NumeriUtente } from '../../../lib/profilo/numeri';
import { useExtra, useExtraDati } from '../contesto';
import { corpoIscrizione, creaProfilo, impostaProfilo, leggiProgetto } from '../../../lib/progetto/profilo';
import { coda } from '../../../lib/progetto/coda';
import { Pagina as PaginaBase, Sezione, IconaTono, type Tono } from '../ui';
export { Sezione };

/** Pagina del profilo: la pagina comune a fondo velato, con `indietro` come nome della prop (compatibilità con le schermate esistenti). */
export function Pagina({ titolo, indietro, destra, piede, children }: { titolo: string; indietro?: () => void; destra?: ReactNode; piede?: ReactNode; children: ReactNode }) {
  return <PaginaBase velata titolo={titolo} onBack={indietro} destra={destra} piede={piede}>{children}</PaginaBase>;
}

/** Avatar: la lettera del nome in un quadrato dagli angoli morbidi. Nessuna illustrazione e nessuna foto. */
export function Avatar({ profilo, lato = 72 }: { profilo: ProfiloDati; lato?: number }) {
  return (
    <span className="shrink-0 overflow-hidden grid place-items-center font-extrabold select-none rounded-2xl bg-azione-tinta text-azione-testo dark:bg-superficie-2"
      style={{ width: lato, height: lato, fontSize: lato * 0.42 }} aria-hidden="true">
      {iniziale(profilo)}
    </span>
  );
}

/** Il profilo: una sola fonte per nome e corso. Se c'è l'iscrizione (email PoliMi, lib/progetto/profilo.ts) nome e corso sono i suoi,
 *  gli stessi che leggono Home e Project ID; salvando si aggiorna l'iscrizione (e si rimanda ad ATLAS se non è legata a un Project ID).
 *  Senza iscrizione restano in appState.extra['profilo'], come prima. */
export function useProfilo() {
  const { appState, aggiorna } = useExtra();
  const [grezzo, salvaLocale] = useExtraDati<ProfiloDati | null>('profilo', null);
  const iscrizione = leggiProgetto(appState).profilo;
  const profilo = useMemo(
    () => (iscrizione ? normalizzaProfilo({ nome: iscrizione.nome, corso: iscrizione.corso ?? '' }) : normalizzaProfilo(grezzo)),
    [grezzo, iscrizione?.nome, iscrizione?.corso], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const salva = (p: ProfiloDati) => {
    const nuovo = normalizzaProfilo(p);
    salvaLocale(nuovo);
    if (!iscrizione) return;
    const corsoCambiato = nuovo.corso !== (iscrizione.corso ?? '');
    const agg = creaProfilo({
      email: iscrizione.email, nome: nuovo.nome || iscrizione.nome, scuola: iscrizione.scuola, sede: iscrizione.sede, livello: iscrizione.livello,
      corso: nuovo.corso || undefined, corsoId: corsoCambiato ? undefined : iscrizione.corsoId, anno: iscrizione.anno,
      provenienza: iscrizione.provenienza, consensi: iscrizione.consensi, completato: iscrizione.completato,
    }, Date.now(), iscrizione);
    if (!agg) return;
    aggiorna(s => impostaProfilo(s, agg));
    if (agg.completato && !leggiProgetto(appState).collegamento) void coda.accoda(corpoIscrizione(agg));
  };
  return { profilo, salva };
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

/** Ogni gruppo di badge ha il suo colore, lo stesso in tutta l'app: domande e argomenti imparati = verde, simulazioni = blu, giorni di studio = ambra, livelli = viola. */
export const TONO_GRUPPO: Record<GruppoBadge, Tono> = { studio: 'alto', simulazioni: 'azione', costanza: 'medio', livello: 'viola' };

/** Il segno di un badge: la SUA icona (una per badge, nel colore del gruppo) in una tessera. Nessuna illustrazione: quelle fanno altri mestieri.
 *  Da ottenere = la stessa tessera al 45 %. */
export function IconaBadge({ b, lato = 56 }: { b: Pick<BadgeValutato, 'icona' | 'gruppo' | 'sbloccato'>; lato?: number }) {
  return (
    <IconaTono tono={TONO_GRUPPO[b.gruppo]} lato={lato} className={cn(!b.sbloccato && 'opacity-45')}>
      <Icona nome={b.icona} size={Math.round(lato * 0.52)} />
    </IconaTono>
  );
}

/** I badge da mettere in vista: prima gli ottenuti, poi quelli più vicini (barra più piena). */
export function badgeInVista(badge: BadgeValutato[], n: number): BadgeValutato[] {
  const ottenuti = badge.filter(b => b.sbloccato);
  const vicini = badge.filter(b => !b.sbloccato && b.raggiungibile).sort((a, b) => b.quota - a.quota);
  return [...ottenuti, ...vicini].slice(0, n);
}
