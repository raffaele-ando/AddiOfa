// Confronto prima/dopo tra la simulazione precedente e questa (concept 31.9 «82% → 76%», 30). Solo numeri veri dello storico:
// senza una simulazione precedente non si mostra nulla. Arte: `progressi-statistiche-scheda` (miglioramento tra una simulazione e l'altra).
import { Illustrazione } from '../../brand/Illustrazione';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { cn } from '../../lib/utils';

export interface PuntiConfronto { esatte: number; totale: number }

/** Differenza di risposte esatte, solo se le due prove avevano lo stesso numero di domande (altrimenti i numeri non sono confrontabili). */
export function differenzaEsatte(prima: PuntiConfronto, dopo: PuntiConfronto): number | null {
  return prima.totale === dopo.totale ? dopo.esatte - prima.esatte : null;
}

export default function ConfrontoPrecedente({ prima, dopo }: { prima: PuntiConfronto; dopo: PuntiConfronto }) {
  const d = differenzaEsatte(prima, dopo);
  const verso: { nome: NomeIcona; classe: string; segno: string } | null = d === null ? null
    : d > 0 ? { nome: 'trend-su', classe: 'bg-alto-tinta text-alto-testo', segno: '+' }
    : d < 0 ? { nome: 'trend-giu', classe: 'bg-basso-tinta text-basso-testo', segno: '−' }
    : { nome: 'trend-uguale', classe: 'bg-medio-tinta text-medio-testo', segno: '' };
  const aria = `Prima ${prima.esatte} su ${prima.totale}, ora ${dopo.esatte} su ${dopo.totale}`
    + (d === null ? '' : d === 0 ? ', uguale' : d > 0 ? `, ${d} in più` : `, ${-d} in meno`);
  return (
    <section role="group" aria-label={aria} className="flex items-center gap-3 rounded-[12px] bg-superficie-2 px-3 py-3">
      <Illustrazione nome="progressi-statistiche-scheda" lato={84} />
      <div aria-hidden="true" className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <div className="text-center">
          <div className="text-[22px] leading-[26px] font-extrabold tabular-nums text-testo-tenue">{prima.esatte}<span className="text-[13px] font-bold">/{prima.totale}</span></div>
          <div className="text-[11.5px] leading-[15px] font-semibold text-testo-tenue">Prima</div>
        </div>
        <Icona nome="avanti" size={20} className="text-testo-tenue" />
        <div className="text-center">
          <div className="text-[22px] leading-[26px] font-extrabold tabular-nums text-testo">{dopo.esatte}<span className="text-[13px] font-bold text-testo-tenue">/{dopo.totale}</span></div>
          <div className="text-[11.5px] leading-[15px] font-semibold text-testo-tenue">Ora</div>
        </div>
        {verso && (
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[14px] font-extrabold tabular-nums', verso.classe)}>
            <Icona nome={verso.nome} size={16} />{d !== 0 && `${verso.segno}${Math.abs(d as number)}`}
          </span>
        )}
      </div>
    </section>
  );
}
