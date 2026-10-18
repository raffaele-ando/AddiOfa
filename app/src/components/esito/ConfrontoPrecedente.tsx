// Confronto con la simulazione precedente: solo numeri veri dello storico, solo se le due prove hanno lo stesso numero di domande
// (altrimenti non sono confrontabili) e solo dalla seconda simulazione in poi. Tono neutro: i due punteggi con la loro parola
// e una riga che dice la differenza, senza frecce rosse né giudizi.
import { Icona } from '../../brand/icone/Icona';

export interface PuntiConfronto { esatte: number; totale: number }

/** Differenza di risposte esatte, solo se le due prove avevano lo stesso numero di domande (altrimenti i numeri non sono confrontabili). */
export function differenzaEsatte(prima: PuntiConfronto, dopo: PuntiConfronto): number | null {
  return prima.totale === dopo.totale ? dopo.esatte - prima.esatte : null;
}

/** La riga della differenza: «3 risposte esatte in più», «Come la precedente». */
export function fraseDifferenza(d: number): string {
  if (d === 0) return 'Come la precedente';
  const n = Math.abs(d);
  return `${n} ${n === 1 ? 'risposta esatta' : 'risposte esatte'} ${d > 0 ? 'in più' : 'in meno'} della precedente`;
}

export default function ConfrontoPrecedente({ prima, dopo }: { prima: PuntiConfronto; dopo: PuntiConfronto }) {
  const d = differenzaEsatte(prima, dopo);
  if (d === null) return null;
  const aria = `Simulazione precedente ${prima.esatte} su ${prima.totale}, questa ${dopo.esatte} su ${dopo.totale}. ${fraseDifferenza(d)}`;
  return (
    <section role="group" aria-label={aria} className="rounded-[12px] bg-superficie-2 px-4 py-3">
      <div aria-hidden="true" className="flex items-end justify-center gap-5">
        <div className="text-center">
          <div className="text-[26px] leading-[28px] font-extrabold tabular-nums text-testo-tenue">{prima.esatte}<span className="text-[14px] font-bold">/{prima.totale}</span></div>
          <div className="mt-0.5 text-[12.5px] leading-[16px] font-semibold text-testo-tenue">Simulazione precedente</div>
        </div>
        <Icona nome="avanti" size={22} className="mb-5 shrink-0 text-testo-tenue" />
        <div className="text-center">
          <div className="text-[26px] leading-[28px] font-extrabold tabular-nums text-testo">{dopo.esatte}<span className="text-[14px] font-bold text-testo-tenue">/{dopo.totale}</span></div>
          <div className="mt-0.5 text-[12.5px] leading-[16px] font-semibold text-testo-tenue">Questa</div>
        </div>
      </div>
      <p aria-hidden="true" data-testo-ok className="mt-2.5 text-center text-[13px] leading-[18px] text-testo-tenue">{fraseDifferenza(d)}</p>
    </section>
  );
}
