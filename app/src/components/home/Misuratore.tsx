import { useId } from 'react';
import { Info } from 'lucide-react';
import { useContaSu } from './comune';
import type { Livello } from './stima';
import { formatProbabilita } from '../../lib/diagnostic';

// Colori della fascia: dal caldo (basso) al verde (alto). Niente rosso di allarme: il testo dice già dove si è.
const COLORI: Record<Livello, { arco: [string, string]; punto: string; numero: string }> = {
  basso: { arco: ['#FDBA74', '#F97316'], punto: '#F97316', numero: 'text-[#C2410C] dark:text-[#FDBA74]' },
  medio: { arco: ['#FDE68A', '#F59E0B'], punto: '#F59E0B', numero: 'text-[#B45309] dark:text-[#FCD34D]' },
  alto: { arco: ['#86EFAC', '#22C55E'], punto: '#22C55E', numero: 'text-[#15803D] dark:text-[#86EFAC]' },
};

// Arco di 210° aperto in basso, grande quanto la larghezza: viewBox 360 x 232, stessa idea del concept 14.
const W = 360, CX = 180, CY = 172, R = 140, SPESSORE = 22, INIZIO = 165, AMPIEZZA = 210, TOP = -8, ALTEZZA = 232;
const pt = (g: number, r = R) => [CX + r * Math.cos((g * Math.PI) / 180), CY + r * Math.sin((g * Math.PI) / 180)] as const;

interface Props {
  /** 0-100 */
  percento: number;
  livello: Livello;
  etichetta: string;
  onInfo: () => void;
}

/** Misuratore a tutta larghezza: arco che si riempie, tacche, pallino sull'arco, (i) in alto al centro, percentuale grande. */
export default function Misuratore({ percento, livello, etichetta, onInfo }: Props) {
  const id = useId().replace(/:/g, '');
  const mostrato = useContaSu(percento, 1100);
  // durante il conteggio si vede il numero che sale; alla fine la forma onesta ('<1 %', '>99 %')
  const finito = mostrato >= percento - 0.001;
  const c = COLORI[livello];
  const [x0, y0] = pt(INIZIO); const [x1, y1] = pt(INIZIO + AMPIEZZA);
  const lung = (Math.PI * R * AMPIEZZA) / 180;
  const frazione = Math.max(0, Math.min(1, mostrato / 100));
  const [px, py] = pt(INIZIO + AMPIEZZA * frazione);
  const d = `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 1 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  const tacche = Array.from({ length: 21 }, (_, i) => INIZIO + (AMPIEZZA * i) / 20);
  return (
    <div className="relative mx-auto w-full" style={{ containerType: 'inline-size' }}>
      <svg viewBox={`0 ${TOP} ${W} ${ALTEZZA}`} className="block w-full h-auto" role="img" aria-label={`${etichetta}: ${formatProbabilita(percento / 100)}`}>
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={c.arco[0]} /><stop offset="1" stopColor={c.arco[1]} />
          </linearGradient>
        </defs>
        {tacche.map((g, i) => {
          const [a, b] = pt(g, R + SPESSORE / 2 + 7); const [e, f] = pt(g, R + SPESSORE / 2 + (i % 2 === 0 ? 20 : 15));
          return <line key={i} x1={a} y1={b} x2={e} y2={f} strokeWidth="2.5" strokeLinecap="round" className="stroke-[#D5DBE6] dark:stroke-[#475569]" />;
        })}
        <path d={d} fill="none" strokeWidth={SPESSORE} strokeLinecap="round" className="stroke-[#E6EAF2] dark:stroke-[#334155]" />
        {frazione > 0 && (
          <path d={d} fill="none" stroke={`url(#g${id})`} strokeWidth={SPESSORE} strokeLinecap="round" strokeDasharray={`${lung * frazione} ${lung}`} />
        )}
        <circle cx={px} cy={py} r="19" fill={c.punto} opacity="0.16" />
        <circle cx={px} cy={py} r="12" fill={c.punto} stroke="#fff" strokeWidth="5" />
      </svg>

      <button type="button" onClick={onInfo} aria-label="Come è calcolata la stima"
        className="absolute left-1/2 -translate-x-1/2 p-2 rounded-full text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]" style={{ top: '27%' }}>
        <Info size={22} aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 flex flex-col items-center text-center pointer-events-none" style={{ top: '38%' }}>
        <div className={`font-extrabold tabular-nums whitespace-nowrap leading-none ${c.numero}`} style={{ fontSize: 'min(19cqw, 92px)' }}>
          {finito ? formatProbabilita(percento / 100) : `${Math.round(mostrato)} %`}
        </div>
        <div className="mt-2 text-[15px] font-bold text-[#0F172A] dark:text-[#F8FAFC] max-w-[56%] text-balance leading-tight">{etichetta}</div>
      </div>
    </div>
  );
}
