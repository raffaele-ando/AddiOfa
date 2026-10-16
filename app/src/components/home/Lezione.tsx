import { Icona } from '../../brand/icone/Icona';
import { TitoloSezione } from './Stima';
import type { Lezione, ProgressoArgomento } from './stima';
import { playTapSound } from '../../lib/audio';

/**
 * Carta chiara del concept: tessera con il libro, area in maiuscolo grigio, titolo della scheda,
 * barra verde (domande imparate) e «n/m» con la spunta. Senza Pass, se la scheda non è gratuita: lucchetto al posto della freccia.
 */
export function SchedaLezione({ lezione, progresso, onApri }: { lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void }) {
  const { imparate, totale } = progresso;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${lezione.topic.titolo}: ${imparate} su ${totale} domande imparate${lezione.bloccata ? ' (richiede il Pass)' : ''}`}
      className="brand-premibile relative w-full flex items-center gap-[14px] rounded-[12px] bg-superficie-2 p-[10px] pr-[12px] text-left">
      <span className="w-[53px] h-[53px] rounded-[13px] bg-azione-tinta flex items-center justify-center shrink-0 text-azione-scuro" aria-hidden="true">
        <Icona nome="lezioni" size={30} />
      </span>
      <span className="flex-1 min-w-0 py-[1px]">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            {progresso.area && <span className="block text-[11px] leading-[13px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">{progresso.area}</span>}
            <span data-testo-ok className="block text-[15px] leading-[20px] font-bold text-testo line-clamp-2">{lezione.topic.titolo}</span>
          </span>
          {lezione.bloccata
            ? <Icona nome="blocco" size={18} className="shrink-0 mt-0.5 text-medio-numero" />
            : <Icona nome="avanti" size={22} className="shrink-0 -mr-1 text-testo-tenue" />}
        </span>
        <span className="mt-[6px] flex items-center gap-3">
          <span className="flex-1 min-w-[40px] h-[7px] rounded-full bg-linea overflow-hidden">
            <span className="block h-full rounded-full" style={{ width: `${valore}%`, background: 'linear-gradient(90deg, var(--color-alto-chiaro), var(--color-alto))' }} />
          </span>
          <span className="shrink-0 inline-flex items-center gap-1 text-[12.5px] leading-[14px] text-alto-testo font-semibold tabular-nums">
            <Icona nome="imparate" size={14} />{imparate}/{totale}
          </span>
        </span>
      </span>
    </button>
  );
}

/** La prossima lezione: titolo di due parole e la carta della scheda. Si apre toccando la carta. */
export default function ProssimoObiettivo({ lezione, progresso, onApri }: {
  lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void;
}) {
  return (
    <section aria-labelledby="titolo-obiettivo" className="flex flex-col gap-[10px]">
      <TitoloSezione id="titolo-obiettivo">Prossima lezione</TitoloSezione>
      <SchedaLezione lezione={lezione} progresso={progresso} onApri={onApri} />
    </section>
  );
}
