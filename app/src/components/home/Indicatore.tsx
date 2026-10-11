import { useId } from 'react';
import { useContaSu } from './comune';
import type { Livello } from './stima';
import { formatProbabilita } from '../../lib/diagnostic';

export const COLORI_STATO: Record<Livello, { arco: [string, string]; punto: string; numero: string }> = {
  basso: { arco: ['#FCA5A5', '#EF4444'], punto: '#EF4444', numero: 'text-[#C81E1E] dark:text-[#FCA5A5]' },
  medio: { arco: ['#FDE68A', '#F59E0B'], punto: '#F59E0B', numero: 'text-[#B45309] dark:text-[#FCD34D]' },
  alto: { arco: ['#86EFAC', '#22C55E'], punto: '#22C55E', numero: 'text-[#15803D] dark:text-[#86EFAC]' },
};

// Arco di 210° che si apre in basso, con tacche: stessa idea del design, riempito dal valore vero.
const CX = 150, CY = 150, R = 108, INIZIO = 165, AMPIEZZA = 210;
const pt = (g: number, r = R) => [CX + r * Math.cos((g * Math.PI) / 180), CY + r * Math.sin((g * Math.PI) / 180)] as const;

export default function Indicatore({ percento, livello, etichetta, sotto }: { percento: number; livello: Livello; etichetta: string; sotto: string }) {
  const id = useId().replace(/:/g, '');
  const mostrato = useContaSu(percento);
  // durante il conteggio si vede il numero che sale; alla fine la forma onesta ('<1 %', '>99 %')
  const finito = mostrato >= percento - 0.001;
  const c = COLORI_STATO[livello];
  const [x0, y0] = pt(INIZIO); const [x1, y1] = pt(INIZIO + AMPIEZZA);
  const lung = (Math.PI * R * AMPIEZZA) / 180;
  const frazione = Math.max(0, Math.min(1, mostrato / 100));
  const [px, py] = pt(INIZIO + AMPIEZZA * frazione);
  const d = `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 1 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  const tacche = Array.from({ length: 15 }, (_, i) => INIZIO + (AMPIEZZA * i) / 14);
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <svg viewBox="0 0 300 200" className="block w-full h-auto" role="img" aria-label={`${etichetta}: ${formatProbabilita(percento / 100)}`}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.arco[0]} /><stop offset="1" stopColor={c.arco[1]} />
          </linearGradient>
        </defs>
        {tacche.map((g, i) => {
          const [a, b] = pt(g, 126); const [e, f] = pt(g, i % 2 === 0 ? 138 : 133);
          return <line key={i} x1={a} y1={b} x2={e} y2={f} strokeWidth="2.5" strokeLinecap="round" className="stroke-[#D9DEE8] dark:stroke-[#475569]" />;
        })}
        <path d={d} fill="none" strokeWidth="18" strokeLinecap="round" className="stroke-[#E9EDF4] dark:stroke-[#334155]" />
        {frazione > 0 && (
          <path d={d} fill="none" stroke={`url(#g${id})`} strokeWidth="18" strokeLinecap="round" strokeDasharray={`${lung * frazione} ${lung}`} />
        )}
        <circle cx={px} cy={py} r="15" fill={c.punto} opacity="0.22" />
        <circle cx={px} cy={py} r="10" fill={c.punto} stroke="#fff" strokeWidth="4.5" />
      </svg>
      <div className="absolute inset-x-0 top-[44%] flex flex-col items-center text-center pointer-events-none">
        <div className={`text-[52px] leading-none font-extrabold tabular-nums whitespace-nowrap ${c.numero}`}>{finito ? formatProbabilita(percento / 100) : `${Math.round(mostrato)} %`}</div>
        <div className="mt-1.5 text-[14px] font-bold text-[#0F172A] dark:text-[#F8FAFC] px-6 leading-tight">{etichetta}</div>
      </div>
      <div className="text-[12px] text-[#6B7280] dark:text-[#94A3B8] text-center leading-snug -mt-1">{sotto}</div>
    </div>
  );
}
