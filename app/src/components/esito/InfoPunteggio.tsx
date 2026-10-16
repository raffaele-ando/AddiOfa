// Foglio «i» di una simulazione: le regole del formato e, se si sa su quante risposte è calcolata la stima, il rimando a FoglioStima.
// Le regole non stanno in pagina (esito, simulazioni): si aprono qui. Il foglio copre la sola pagina (il genitore è `relative`).
import { useEffect, useState, type ReactNode } from 'react';
import type { ExamFormat } from '../../config/offer';
import { FoglioInfo } from '../../screens/extra/ui';
import FoglioStima from '../FoglioStima';

/** Le regole del formato, una riga ciascuna (le usano il foglio della «i» dell'esito e la scheda Simulazioni). */
export function RegoleFormato({ format, nota }: { format: ExamFormat; nota?: ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-2.5 pl-5 marker:text-testo-tenue">
      <li>{format.questions} domande in {format.minutes} minuti: la soglia è {format.passMark}. Con {format.passMark} risposte esatte o più la simulazione è superata.</li>
      <li>Nessuna penalità: una risposta sbagliata o lasciata vuota vale zero.</li>
      <li>Il tempo non cambia il punteggio, ma allo scadere la prova si consegna da sola.</li>
      <li>Durante la prova non vedi se hai risposto bene: le correzioni e le spiegazioni arrivano alla consegna.</li>
      <li>È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.</li>
      {nota && <li>{nota}</li>}
    </ul>
  );
}

export default function InfoPunteggio({ format, aperto, onChiudi, risposteStima, nota }: {
  format: ExamFormat; aperto: boolean; onChiudi: () => void; risposteStima?: number;
  /** Una riga in più in fondo alle regole. */
  nota?: ReactNode;
}) {
  const [stima, setStima] = useState(false);
  useEffect(() => { if (!aperto) setStima(false); }, [aperto]);

  if (aperto && stima && risposteStima !== undefined) {
    return <FoglioStima aperto onChiudi={() => setStima(false)} tipo="simulazione" risposte={risposteStima} />;
  }

  return (
    <FoglioInfo aperto={aperto} onChiudi={onChiudi} titolo="Regole">
      <RegoleFormato format={format} nota={nota} />
      {risposteStima !== undefined && (
        <button type="button" onClick={() => setStima(true)} className="mt-4 text-sm font-bold text-azione-scuro underline underline-offset-2">
          Come viene calcolata la stima
        </button>
      )}
    </FoglioInfo>
  );
}
