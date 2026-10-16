import type { NomeIcona } from '../../brand/icone/Icona';
import { EXAM, RETAKE_COST_EUR } from '../../config/offer';
import type { Tono } from '../extra/ui';

// Dati a icone usati da più schermate dell'ingresso (landing, risultato del diagnostico): una sola fonte, così «Se non superi»
// dice le stesse cose negli stessi simboli. I numeri vengono da config/offer.ts.

export interface Conseguenza { icona: NomeIcona; valore: string; etichetta: string; tono: Tono }

/** «Se non superi»: tre fatti veri (config/offer.ts), ciascuno icona + numero. */
export const CONSEGUENZE: Conseguenza[] = [
  { icona: 'stato-risposta-sbagliata', valore: `<${EXAM.passMark}/${EXAM.questions}`, etichetta: 'Non superi', tono: 'basso' },
  { icona: 'costo', valore: `~${RETAKE_COST_EUR} €`, etichetta: 'Ogni tentativo', tono: 'basso' },
  { icona: 'blocco', valore: '1° anno', etichetta: 'Solo esami', tono: 'basso' },
];

/** Spiegazione a richiesta di «Se non superi» (dietro la «i»). */
export function TestoOfa() {
  return (
    <div className="flex flex-col gap-2">
      <p>L'OFA di inglese è un obbligo formativo aggiuntivo: per toglierlo si supera un test di recupero ({EXAM.questions} domande in {EXAM.minutes} minuti, soglia {EXAM.passMark} su {EXAM.questions}).</p>
      <p>Se non lo superi, un nuovo tentativo costa circa {RETAKE_COST_EUR} € presso gli enti convenzionati e finché c'è l'OFA nel piano degli studi puoi inserire solo esami del 1° anno.</p>
      <p>AddiOFA non cambia le regole né sostituisce il test: ti aiuta a sapere a che punto sei prima di affrontarlo.</p>
    </div>
  );
}
