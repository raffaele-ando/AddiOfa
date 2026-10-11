// Foglio "Come viene calcolato il punteggio" (regole del formato). FoglioStima spiega un'altra cosa, la stima di superare il test.
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { ExamFormat } from '../../config/offer';
import { formatNumber } from '../../lib/utils';
import FoglioStima from '../FoglioStima';

/** "Come viene calcolato il punteggio": le regole del formato. Se si sa su quante risposte è calcolata la stima, rimanda a FoglioStima. */
export default function InfoPunteggio({ format, aperto, onChiudi, risposteStima }: { format: ExamFormat; aperto: boolean; onChiudi: () => void; risposteStima?: number }) {
  const chiudiRef = useRef<HTMLButtonElement>(null);
  const [stima, setStima] = useState(false);
  useEffect(() => { if (aperto) chiudiRef.current?.focus(); else setStima(false); }, [aperto]);
  if (!aperto) return null;

  if (stima && risposteStima !== undefined) {
    return <FoglioStima aperto onChiudi={() => setStima(false)} tipo="simulazione" risposte={risposteStima} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="info-punteggio-titolo"
      onKeyDown={e => { if (e.key === 'Escape') onChiudi(); }} onClick={e => { if (e.target === e.currentTarget) onChiudi(); }}>
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1E293B] p-5 shadow-xl max-h-[85dvh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <h2 id="info-punteggio-titolo" className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Come viene calcolato il punteggio</h2>
          <button ref={chiudiRef} type="button" onClick={onChiudi} aria-label="Chiudi" className="shrink-0 -mr-1 -mt-1 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#334155]">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <ul className="mt-3 space-y-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 leading-relaxed list-disc pl-5">
          <li>Si contano le risposte esatte su {format.questions}. In questo formato la soglia è {format.passMark}: con {format.passMark} o più la simulazione è superata.</li>
          {format.penalty > 0 ? (
            <li>Ogni risposta sbagliata toglie {formatNumber(format.penalty)} punti; una domanda lasciata vuota non toglie nulla. Il punteggio con penalità è quello del test d&apos;ingresso, mentre per l&apos;OFA conta il numero di risposte esatte.</li>
          ) : (
            <li>Non ci sono penalità: una risposta sbagliata o lasciata vuota vale zero.</li>
          )}
          <li>Il tempo non cambia il punteggio, ma allo scadere la prova si consegna da sola.</li>
          <li>È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.</li>
        </ul>
        {risposteStima !== undefined && (
          <button type="button" onClick={() => setStima(true)} className="mt-4 text-sm font-bold text-azione dark:text-azione-chiaro underline underline-offset-2">
            Come viene calcolata la stima di superare il test
          </button>
        )}
        <button type="button" onClick={onChiudi} className="mt-5 w-full rounded-xl bg-azione hover:bg-azione-scuro py-3 font-bold text-white">Ho capito</button>
      </div>
    </div>
  );
}
