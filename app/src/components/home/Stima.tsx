import { ReactNode } from 'react';
import Misuratore from './Misuratore';
import { Illustrazione } from '../../brand/Illustrazione';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';
import { ARTE_STATO } from './arte';
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

// Una fascia = illustrazione di stato + una o due parole. Non si tocca: dice solo a che punto sei.
const FASCIA: Record<ChiaveBanner, { parola: string; fascia: Livello | null }> = {
  nuovo: { parola: 'Da iniziare', fascia: null },
  partenza: { parola: 'In partenza', fascia: 'basso' },
  margine: { parola: 'Da migliorare', fascia: 'basso' },
  soglia: { parola: 'Vicino', fascia: 'medio' },
  strada: { parola: 'In linea', fascia: 'alto' },
};

/** "In partenza" solo a chi ha fatto il diagnostico e basta (sotto il 20 %); dopo le simulazioni "Da migliorare". */
export function chiaveBanner(stima: Stima | null, livello: Livello): ChiaveBanner {
  if (!stima) return 'nuovo';
  return livello === 'alto' ? 'strada' : livello === 'medio' ? 'soglia' : stima.fonte === 'diagnostico' && stima.p < 0.2 ? 'partenza' : 'margine';
}

/**
 * Fascia di stato: l'illustrazione della fascia (ARTE_STATO: avvertenza, andamento, traguardo) e una o due parole, sulla tinta della fascia.
 * Non è cliccabile. `onClick` esiste solo per le vecchie anteprime di prova e viene ignorato.
 */
export function BannerStato({ chiave }: { chiave: ChiaveBanner; onClick?: () => void }) {
  const m = FASCIA[chiave];
  const colore = m.fascia ? `var(--color-${m.fascia})` : 'var(--color-azione)';
  return (
    <div role="status" aria-label={`Stato: ${m.parola}`}
      className="w-full min-h-[64px] flex items-center gap-[14px] rounded-[12px] pl-[10px] pr-[14px] py-[6px] shadow-[0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_0_0_1px_var(--anello)]"
      style={{ background: m.fascia ? `var(--color-${m.fascia}-tinta)` : 'var(--color-azione-tinta)', ['--anello' as string]: `color-mix(in srgb, ${colore} 40%, transparent)` }}>
      <span aria-hidden="true" className="w-[64px] h-[52px] shrink-0 flex items-center justify-center">
        <Illustrazione nome={ARTE_STATO[chiave]} lato={chiave === 'nuovo' ? 50 : 56} />
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

/** «Tutte ›» a destra del titolo di una sezione (come «Vedi percorso» del concept 14): area di tocco di 44 px, colore tenue. */
export function LinkTutte({ onClick, aria }: { onClick: () => void; aria: string }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={aria}
      className="brand-premibile -my-3 -mr-2 inline-flex min-h-[44px] items-center gap-0.5 rounded-[10px] pl-3 pr-2 text-[14px] leading-[18px] font-semibold text-testo-tenue hover:text-testo">
      Tutte<Icona nome="avanti" size={18} />
    </button>
  );
}
