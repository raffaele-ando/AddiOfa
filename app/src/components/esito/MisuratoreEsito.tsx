// Misuratore dell'esito: quante risposte esatte rispetto alla soglia del formato.
// Il numero e l'etichetta «Soglia 25» sono testo vero (non nell'SVG); l'arco è fermo, già al valore finale.
// La traccia è `tacca` (si vede anche a 0), il segno della soglia sporge dall'arco ed è nominato.

const LARG = 320, ALT = 150;
const CX = 160, CY = 104, R = 88, DA = 160, AMP = 220;
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
  // L'etichetta sta oltre il segno, dal lato verso cui punta: a destra, a sinistra o sopra
  const [ex, ey] = punto(gSoglia, R + 22);
  const c = Math.cos((gSoglia * Math.PI) / 180);
  const ancora = c > 0.3 ? 'translate(0,-50%)' : c < -0.3 ? 'translate(-100%,-50%)' : 'translate(-50%,-100%)';

  return (
    <div className="relative mx-auto w-full max-w-[300px]" role="img"
      aria-label={`${giuste} risposte esatte su ${totale}. Soglia: ${soglia}. ${superata ? 'Soglia raggiunta.' : 'Soglia non raggiunta.'}`}>
      <svg viewBox={`0 0 ${LARG} ${ALT}`} className="w-full h-auto block" aria-hidden>
        <path d={arco} fill="none" strokeWidth="16" strokeLinecap="round" className="stroke-tacca" />
        {frazione > 0 && (
          <path d={arco} fill="none" strokeWidth="16" strokeLinecap="round"
            className={superata ? 'stroke-alto-testo' : 'stroke-azione'}
            strokeDasharray={`${lung * frazione} ${lung}`} />
        )}
        {/* segno della soglia: sporge dall'arco da una parte e dall'altra */}
        <line x1={t0x} y1={t0y} x2={t1x} y2={t1y} strokeWidth="4" strokeLinecap="round" className="stroke-testo" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute whitespace-nowrap text-[12.5px] leading-none font-bold text-testo"
        style={{ left: `${(ex / LARG) * 100}%`, top: `${(ey / ALT) * 100}%`, transform: ancora }}>
        Soglia {soglia}
      </span>
      <div className="absolute inset-x-0 top-[34%] flex flex-col items-center leading-none pointer-events-none">
        <div className="text-[52px] font-extrabold tabular-nums text-testo">
          {giuste}<span className="text-xl font-bold text-testo-tenue">/{totale}</span>
        </div>
      </div>
    </div>
  );
}
