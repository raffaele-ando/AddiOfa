import { BookOpen, ChevronRight, Lock } from 'lucide-react';
import { TitoloSezione } from './Stima';
import type { Lezione, ProgressoArgomento } from './stima';
import { playTapSound } from '../../lib/audio';

/**
 * Carta chiara del concept: tessera bianca con il libro, area in maiuscolo grigio, titolo della scheda,
 * barra blu di avanzamento e "n/m domande imparate". Senza Pass, se la scheda non è gratuita: lucchetto al posto della freccia.
 */
export function SchedaLezione({ lezione, progresso, onApri }: { lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void }) {
  const { imparate, totale } = progresso;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${lezione.topic.titolo}: ${imparate} su ${totale} domande imparate${lezione.bloccata ? ' (richiede il Pass)' : ''}`}
      className="brand-premibile relative w-full flex items-center gap-[14px] rounded-[12px] bg-superficie-2 p-[10px] pr-[12px] text-left">
      <span className="w-[53px] h-[53px] rounded-[13px] bg-superficie flex items-center justify-center shrink-0 text-azione shadow-[0_1px_4px_rgba(37,99,235,0.12)] dark:shadow-none dark:border dark:border-linea" aria-hidden="true">
        <BookOpen size={30} strokeWidth={2.2} />
      </span>
      <span className="flex-1 min-w-0 py-[1px]">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            {progresso.area && <span className="block text-[11px] leading-[13px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">{progresso.area}</span>}
            <span className="block text-[15px] leading-[20px] font-bold text-testo line-clamp-2">{lezione.topic.titolo}</span>
          </span>
          {lezione.bloccata
            ? <Lock size={18} className="shrink-0 mt-0.5 text-testo-tenue" aria-hidden="true" />
            : <ChevronRight size={22} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />}
        </span>
        <span className="mt-[6px] flex items-center gap-3">
          <span className="flex-1 min-w-[40px] h-[7px] rounded-full bg-linea overflow-hidden">
            <span className="block h-full rounded-full" style={{ width: `${valore}%`, background: 'linear-gradient(90deg, var(--color-azione-chiaro), var(--color-azione))' }} />
          </span>
          <span className="shrink-0 text-[12px] leading-[14px] text-testo-tenue tabular-nums">{imparate}/{totale} domande imparate</span>
        </span>
      </span>
    </button>
  );
}

/** "Il tuo prossimo obiettivo" con il link "Vedi percorso" (apre la Teoria) e la carta della scheda. */
export default function ProssimoObiettivo({ lezione, progresso, onApri, onPercorso }: {
  lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void; onPercorso: () => void;
}) {
  return (
    <section aria-labelledby="titolo-obiettivo" className="flex flex-col gap-[10px]">
      <TitoloSezione id="titolo-obiettivo" destra={
        <button type="button" onClick={() => { playTapSound(); onPercorso(); }}
          className="shrink-0 inline-flex items-center text-[13.5px] font-medium text-testo-tenue hover:text-testo -mr-1">
          Vedi percorso <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      }>Il tuo prossimo obiettivo</TitoloSezione>
      <SchedaLezione lezione={lezione} progresso={progresso} onApri={onApri} />
    </section>
  );
}
