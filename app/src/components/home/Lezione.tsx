import { BookOpen, ChevronRight, Lock } from 'lucide-react';
import { Carta, BarraCresce } from './comune';
import type { Lezione, ProgressoArgomento } from './stima';
import { playTapSound } from '../../lib/audio';

/**
 * "Il tuo prossimo obiettivo": l'argomento più debole (o il primo non toccato) con quante delle sue domande sono imparate.
 * Il titolo ha a destra il link "Vedi percorso" (apre la Teoria). Senza Pass, se la scheda non è quella gratuita: lucchetto.
 */
export default function ProssimoObiettivo({ lezione, progresso, onApri, onPercorso }: {
  lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void; onPercorso: () => void;
}) {
  const { imparate, totale } = progresso;
  const valore = totale > 0 ? (imparate / totale) * 100 : 0;
  return (
    <section aria-labelledby="titolo-obiettivo" className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3 px-0.5">
        <h2 id="titolo-obiettivo" className="text-[19px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Il tuo prossimo obiettivo</h2>
        <button type="button" onClick={() => { playTapSound(); onPercorso(); }}
          className="shrink-0 inline-flex items-center gap-0.5 text-[13.5px] font-medium text-[#475569] dark:text-[#94A3B8] hover:text-azione dark:hover:text-azione-chiaro">
          Vedi percorso <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
      <Carta indice={3} className="p-0">
        <button type="button" onClick={() => { playTapSound(); onApri(); }} className="brand-premibile w-full flex items-center gap-3.5 p-3.5 text-left rounded-3xl">
          <span className="w-14 h-14 rounded-2xl bg-azione-tinta/60 dark:bg-azione-tinta-scura/50 text-azione dark:text-azione-chiaro flex items-center justify-center shrink-0"><BookOpen size={28} aria-hidden="true" /></span>
          <span className="flex-1 min-w-0">
            {progresso.area && <span className="block text-[12px] font-semibold tracking-wide uppercase text-[#6B7280] dark:text-[#94A3B8] leading-tight">{progresso.area}</span>}
            <span className="block text-[17px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{lezione.topic.titolo}</span>
            <span className="mt-1.5 flex items-center gap-2.5">
              <span className="flex-1 min-w-[48px]"><BarraCresce valore={valore} colore="#2563EB" alta={7} /></span>
              <span className="shrink-0 text-[12.5px] text-[#6B7280] dark:text-[#94A3B8] tabular-nums">{imparate}/{totale} domande imparate</span>
            </span>
            {lezione.bloccata && <span className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#475569] dark:text-[#CBD5E1]"><Lock size={12} aria-hidden="true" /> Questa scheda richiede il Pass</span>}
          </span>
          {lezione.bloccata
            ? <Lock size={18} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]" aria-label="Richiede il Pass" />
            : <ChevronRight size={22} className="shrink-0 text-[#94A3B8]" aria-hidden="true" />}
        </button>
      </Carta>
    </section>
  );
}
