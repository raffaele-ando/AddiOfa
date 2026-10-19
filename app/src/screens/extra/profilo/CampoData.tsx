// Campo data in italiano: tre menu «Giorno · Mese · Anno». Il campo nativo `type=date` mostra mm/dd/yyyy nei browser impostati in inglese
// (la lingua della pagina non basta, la sceglie il browser): qui l'ordine e i nomi dei mesi sono sempre quelli italiani, in ogni browser, e il tocco è da 44 px.
// Il valore è «2026-11-20» (come prima) oppure null.
import { useId } from 'react';
import { cn } from '../../../lib/utils';
import { NOMI_MESI, leggiData } from '../../../lib/profilo/giorni';

const SELECT = 'h-11 w-full min-w-0 rounded-[12px] border border-bordo-campo bg-superficie px-2.5 text-[15px] text-testo focus:border-azione focus:outline-none focus:ring-2 focus:ring-azione/30';

const giorniDelMese = (anno: number, mese: number) => new Date(anno, mese + 1, 0).getDate();
const due = (n: number) => String(n).padStart(2, '0');

export default function CampoData({ valore, onCambia, anni, className }: { valore: string | null; onCambia: (v: string | null) => void; anni: number[]; className?: string }) {
  const id = useId();
  const d = valore ? leggiData(valore) : null;
  const g = d ? d.getDate() : 0, m = d ? d.getMonth() : -1, a = d ? d.getFullYear() : 0;
  // ogni scelta ricompone la data; il giorno si riporta alla fine del mese se non esiste (31 → 30 in novembre)
  const compone = (gg: number, mm: number, aa: number) => {
    if (!gg || mm < 0 || !aa) return; // finché mancano pezzi non c'è una data
    const ok = Math.min(gg, giorniDelMese(aa, mm));
    onCambia(`${aa}-${due(mm + 1)}-${due(ok)}`);
  };
  // se la data salvata è di un anno fuori elenco, l'anno resta scelto
  const elencoAnni = a && !anni.includes(a) ? [...anni, a].sort((x, y) => x - y) : anni;
  return (
    <div lang="it" role="group" aria-label="Data del test" className={cn('grid grid-cols-[72px_minmax(0,1fr)_92px] gap-2', className)}>
      <div>
        <label htmlFor={`${id}-g`} className="mb-1 block text-[12px] leading-[16px] font-semibold text-testo-tenue">Giorno</label>
        <select id={`${id}-g`} className={SELECT} value={g || ''} onChange={e => compone(Number(e.target.value), m < 0 ? new Date().getMonth() : m, a || elencoAnni[0])}>
          <option value="">–</option>
          {Array.from({ length: m >= 0 && a ? giorniDelMese(a, m) : 31 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-m`} className="mb-1 block text-[12px] leading-[16px] font-semibold text-testo-tenue">Mese</label>
        <select id={`${id}-m`} className={SELECT} value={m < 0 ? '' : m} onChange={e => compone(g || 1, Number(e.target.value), a || elencoAnni[0])}>
          <option value="">–</option>
          {NOMI_MESI.map((n, i) => <option key={n} value={i}>{n[0].toUpperCase() + n.slice(1)}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-a`} className="mb-1 block text-[12px] leading-[16px] font-semibold text-testo-tenue">Anno</label>
        <select id={`${id}-a`} className={SELECT} value={a || ''} onChange={e => compone(g || 1, m < 0 ? new Date().getMonth() : m, Number(e.target.value))}>
          <option value="">–</option>
          {elencoAnni.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
    </div>
  );
}
