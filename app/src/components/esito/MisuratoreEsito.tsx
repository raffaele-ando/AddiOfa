// Misuratore dell'esito: quante risposte esatte rispetto alla soglia del formato.
// Il numero è un testo vero (non nell'SVG) e l'arco è fermo, già al valore finale.

const CX = 116, CY = 104, R = 88, DA = 160, AMP = 220;
const punto = (gradi: number, r = R): [number, number] => [CX + r * Math.cos((gradi * Math.PI) / 180), CY + r * Math.sin((gradi * Math.PI) / 180)];

export default function MisuratoreEsito({ giuste, totale, soglia, superata }: { giuste: number; totale: number; soglia: number; superata: boolean }) {
  const frazione = totale > 0 ? Math.max(0, Math.min(1, giuste / totale)) : 0;
  const [x0, y0] = punto(DA);
  const [x1, y1] = punto(DA + AMP);
  const arco = `M${x0} ${y0}A${R} ${R} 0 1 1 ${x1} ${y1}`;
  const lung = (Math.PI * R * AMP) / 180;
  const gSoglia = DA + AMP * (soglia / totale);
  const [t0x, t0y] = punto(gSoglia, R - 15);
  const [t1x, t1y] = punto(gSoglia, R + 15);

  return (
    <div className="relative mx-auto w-full max-w-[280px]" role="img"
      aria-label={`${giuste} risposte esatte su ${totale}. Soglia: ${soglia}. ${superata ? 'Soglia raggiunta.' : 'Soglia non raggiunta.'}`}>
      <svg viewBox="0 0 232 150" className="w-full h-auto block" aria-hidden>
        <path d={arco} fill="none" strokeWidth="16" strokeLinecap="round" className="stroke-[#E5E9F0] dark:stroke-[#334155]" />
        {frazione > 0 && (
          <path d={arco} fill="none" strokeWidth="16" strokeLinecap="round"
            className={superata ? 'stroke-[#16A34A] dark:stroke-[#10B981]' : 'stroke-azione dark:stroke-azione-chiaro'}
            strokeDasharray={`${lung * frazione} ${lung}`} />
        )}
        {/* segno della soglia */}
        <line x1={t0x} y1={t0y} x2={t1x} y2={t1y} strokeWidth="4" strokeLinecap="round" className="stroke-[#0F172A] dark:stroke-[#F8FAFC]" />
      </svg>
      <div className="absolute inset-x-0 top-[33%] flex flex-col items-center leading-none pointer-events-none">
        <div className="text-[44px] font-extrabold tabular-nums text-[#0F172A] dark:text-[#F8FAFC]">
          {giuste}<span className="text-xl font-bold text-gray-400 dark:text-gray-500">/{totale}</span>
        </div>
        <div className="mt-1.5 text-xs font-bold text-gray-500 dark:text-gray-400">risposte esatte</div>
      </div>
    </div>
  );
}
