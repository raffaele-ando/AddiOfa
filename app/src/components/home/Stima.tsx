import { ReactNode } from 'react';
import Misuratore from './Misuratore';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import type { Livello, Stima } from './stima';

/** Il misuratore del concept 14: percentuale, etichetta colorata e riga grigia. Senza stima (stima = null) l'arco è vuoto e non c'è nessun numero. */
export function StimaSezione({ stima, livello, onInfo }: { stima: Stima | null; livello: Livello; onInfo?: () => void }) {
  return (
    <section aria-label="Probabilità stimata di superare il test">
      <Misuratore percento={stima ? stima.p * 100 : null} livello={livello}
        etichetta="Probabilità stimata" sotto="di superare il test" onInfo={onInfo} />
    </section>
  );
}

export type ChiaveBanner = 'nuovo' | 'partenza' | 'margine' | 'soglia' | 'strada';

// Una fascia = icona di stato + una o due parole. Non si tocca: dice solo a che punto sei.
const FASCIA: Record<ChiaveBanner, { parola: string; fascia: Livello | null; icona: NomeIcona }> = {
  nuovo: { parola: 'Da iniziare', fascia: null, icona: 'stato-nuovo' },
  partenza: { parola: 'In partenza', fascia: 'basso', icona: 'stato-basso' },
  margine: { parola: 'Da migliorare', fascia: 'basso', icona: 'stato-basso' },
  soglia: { parola: 'Vicino', fascia: 'medio', icona: 'stato-medio' },
  strada: { parola: 'In linea', fascia: 'alto', icona: 'stato-ok' },
};

/** "In partenza" solo a chi ha fatto il diagnostico e basta (sotto il 20 %); dopo le simulazioni "Da migliorare". */
export function chiaveBanner(stima: Stima | null, livello: Livello): ChiaveBanner {
  if (!stima) return 'nuovo';
  return livello === 'alto' ? 'strada' : livello === 'medio' ? 'soglia' : stima.fonte === 'diagnostico' && stima.p < 0.2 ? 'partenza' : 'margine';
}

/** Fascia di stato: icona tonda nel colore della fascia e una o due parole. Non è cliccabile. */
/** `onClick` esiste solo per le vecchie anteprime di prova: la fascia non è cliccabile e lo ignora. */
export function BannerStato({ chiave }: { chiave: ChiaveBanner; onClick?: () => void }) {
  const m = FASCIA[chiave];
  const colore = m.fascia ? `var(--color-${m.fascia})` : 'var(--color-azione)';
  return (
    <div role="status" aria-label={`Stato: ${m.parola}`}
      className="w-full min-h-[56px] flex items-center gap-[16px] rounded-[12px] pl-[14px] pr-[14px] py-[8px] shadow-[0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_0_0_1px_var(--anello)]"
      style={{ background: m.fascia ? `var(--color-${m.fascia}-tinta)` : 'var(--color-superficie-2)', ['--anello' as string]: `color-mix(in srgb, ${colore} 40%, transparent)` }}>
      <span className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 text-superficie shadow-[0_1px_3px_rgba(15,23,42,0.18)] dark:shadow-none" style={{ background: colore }} aria-hidden="true">
        <Icona nome={m.icona} size={22} />
      </span>
      <span className="text-[17px] font-bold leading-[22px] text-testo">{m.parola}</span>
    </div>
  );
}

/** Titolo di sezione del concept: grassetto, con un elemento a destra (link o niente). */
export function TitoloSezione({ children, destra, id }: { children: ReactNode; destra?: ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{children}</h2>
      {destra}
    </div>
  );
}
