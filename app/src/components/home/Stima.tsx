import { ReactNode } from 'react';
import Misuratore from './Misuratore';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';
import type { Livello, Stima } from './stima';
import { testiFascia, type ChiaveBanner } from './stato';

export { chiaveBanner, type ChiaveBanner } from './stato';

/** Il misuratore del concept 14: percentuale, etichetta colorata e riga grigia. Senza stima (stima = null) l'arco è vuoto e non c'è nessun numero. */
export function StimaSezione({ stima, livello, onInfo }: { stima: Stima | null; livello: Livello; onInfo?: () => void }) {
  return (
    <section aria-label="Probabilità stimata di superare il test">
      <Misuratore percento={stima ? stima.p * 100 : null} livello={livello}
        etichetta="Probabilità stimata" sotto="di superare il test" onInfo={onInfo} />
    </section>
  );
}

// Una fascia = glifo da 40 px + titolo + riga. Colore, forma e parola dicono lo stesso: attenzione (triangolo), barre a metà, spunta, germoglio.
// Classi scritte per intero (Tailwind non legge nomi composti). Tema chiaro: tinta della fascia. Tema scuro: la fascia al 14 % sulla carta, niente lastra marrone e niente filo.
const FASCIA: Record<ChiaveBanner, { icona: NomeIcona; fondo: string; glifo: string }> = {
  nuovo: { icona: 'stato-nuovo', fondo: 'bg-azione-tinta', glifo: 'bg-azione text-azione-su' },
  partenza: { icona: 'stato-attenzione', fondo: 'bg-basso-tinta dark:bg-[color-mix(in_srgb,var(--color-basso)_12%,var(--color-superficie-2))]', glifo: 'bg-basso-pieno text-basso-su' },
  margine: { icona: 'stato-attenzione', fondo: 'bg-basso-tinta dark:bg-[color-mix(in_srgb,var(--color-basso)_12%,var(--color-superficie-2))]', glifo: 'bg-basso-pieno text-basso-su' },
  soglia: { icona: 'progressi', fondo: 'bg-medio-tinta dark:bg-[color-mix(in_srgb,var(--color-medio)_12%,var(--color-superficie-2))]', glifo: 'bg-medio-pieno text-medio-su' },
  strada: { icona: 'stato-risposta-giusta', fondo: 'bg-alto-tinta dark:bg-[color-mix(in_srgb,var(--color-alto)_12%,var(--color-superficie-2))]', glifo: 'bg-alto-pieno text-alto-su' },
};

/**
 * Fascia di stato (concept 14, 01): glifo da 40 px, titolo di al massimo tre parole e una riga di spiegazione (al massimo dieci, in `data-testo-ok`).
 * Non è cliccabile. A destra, con due o più misure, il chip «da {prima stima}» con la freccia (nessun rosso per un calo).
 * `onClick` esiste solo per le vecchie anteprime di prova e viene ignorato.
 */
export function BannerStato({ chiave, stima = null, areeConDati = false, variazione }: {
  chiave: ChiaveBanner; stima?: Stima | null; areeConDati?: boolean; variazione?: { da: number; verso: 'su' | 'giu' } | null; onClick?: () => void;
}) {
  const m = FASCIA[chiave];
  const { titolo, riga } = testiFascia(chiave, stima, areeConDati);
  return (
    <div role="status" aria-label={`Stato: ${titolo}. ${riga}`} data-testo-ok
      className={`w-full min-h-[76px] flex items-center gap-3 rounded-[16px] px-4 py-[14px] ${m.fondo}`}>
      <span aria-hidden="true" className={`w-10 h-10 shrink-0 rounded-full grid place-items-center ${m.glifo}`}>
        <Icona nome={m.icona} size={22} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[17px] leading-[22px] font-bold text-testo">{titolo}</span>
          {variazione && (
            <span title={`Prima stima: ${variazione.da} %`} className={`shrink-0 inline-flex items-center gap-0.5 text-[13px] leading-[18px] font-bold tabular-nums ${variazione.verso === 'su' ? 'text-alto-testo' : 'text-testo-tenue'}`}>
              <Icona nome={variazione.verso === 'su' ? 'trend-su' : 'trend-giu'} size={14} />
              <span className="sr-only">Prima stima </span>da {variazione.da}%
            </span>
          )}
        </span>
        <span className="block text-[14px] leading-[19px] text-testo-tenue">{riga}</span>
      </span>
    </div>
  );
}

/** Titolo di sezione: 18/24 extra-grassetto (20/26 sul desktop), chiaramente più grande del titolo di riga (15-16 px). Con un elemento a destra (link o niente). */
export function TitoloSezione({ children, destra, id }: { children: ReactNode; destra?: ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-extrabold tracking-[-0.01em] text-testo">{children}</h2>
      {destra}
    </div>
  );
}

/** «Tutte ›» a destra del titolo di una sezione: area di tocco di 44 px, colore tenue. `testo` dice cosa si apre; `testoBreve` lo sostituisce da 1024 px, dove la colonna è stretta. */
export function LinkTutte({ onClick, aria, testo = 'Tutte', testoBreve }: { onClick: () => void; aria: string; testo?: string; testoBreve?: string }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={aria}
      className="brand-premibile -my-3 -mr-2 inline-flex min-h-[44px] items-center gap-0.5 rounded-[10px] pl-3 pr-2 text-[14px] leading-[18px] font-semibold text-testo-tenue hover:text-testo">
      {testoBreve ? <><span className="lg:hidden">{testo}</span><span className="hidden lg:inline">{testoBreve}</span></> : testo}<Icona nome="avanti" size={18} />
    </button>
  );
}
