import { useId } from 'react';
import { Info } from 'lucide-react';
import type { Livello } from './stima';
import { formatProbabilita } from '../../lib/diagnostic';

// Geometria del concept 14 (390 x 858): semicerchio con centro a (195.5, 281.2), raggio 141, arco spesso 25.7.
// Tutto fermo: il valore è già quello finale. I testi sono veri (non tracciati) e scalano con la larghezza (unità cqw).
const CX = 195.5, CY = 281.21, R = 141.12, SPESSORE = 25.66;
const VB_Y = 104, VB_H = 204; // porzione del foglio 390 x 858 che contiene il misuratore
const pt = (gradi: number, r: number) => [CX + r * Math.cos((gradi * Math.PI) / 180), CY - r * Math.sin((gradi * Math.PI) / 180)] as const;
const cq = (px: number) => `${((px / 390) * 100).toFixed(3)}cqw`;
const pct = (y: number) => `${(((y - VB_Y) / VB_H) * 100).toFixed(2)}%`;

// Opacità del grande alone attorno al pallino: più forte nella fascia bassa, come nel foglio dei tre stati.
const ALONE: Record<Livello, number> = { basso: 0.3, medio: 0.12, alto: 0.12 };

interface Props {
  /** 0-100. null = nessuna stima: arco vuoto e invito a fare il diagnostico. */
  percento: number | null;
  livello: Livello;
  /** Riga colorata in grassetto sotto la percentuale */
  etichetta: string;
  /** Riga grigia sotto l'etichetta */
  sotto: string;
  onInfo?: () => void;
}

/** Misuratore a tutta larghezza: arco con estremità tonde, tacche, pallino con anello e alone sul valore, (i), percentuale gigante. */
export default function Misuratore({ percento, livello, etichetta, sotto, onInfo }: Props) {
  const id = useId().replace(/:/g, '');
  const vuoto = percento === null;
  const frazione = vuoto ? 0 : Math.max(0, Math.min(1, percento / 100));
  const gradiValore = 180 * frazione; // angolo dal lato sinistro
  const col = `var(--color-${livello})`;
  const [x0, y0] = pt(180, R);
  const [x1, y1] = pt(0, R);
  const [px, py] = pt(180 - gradiValore, R);
  const arcoFondo = `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  const arcoValore = `M${x0.toFixed(2)} ${y0.toFixed(2)}A${R} ${R} 0 0 1 ${px.toFixed(2)} ${py.toFixed(2)}`;
  const esterne = Array.from({ length: 13 }, (_, i) => i);
  const interne = Array.from({ length: 11 }, (_, i) => i + 1);
  const accesa = (i: number) => !vuoto && 15 * i <= gradiValore + 3;
  const testo = vuoto ? '' : formatProbabilita(frazione).replace(/\s+%/, '%');

  return (
    <div className="relative w-full select-none" style={{ containerType: 'inline-size', aspectRatio: `390 / ${VB_H}` }}>
      <svg viewBox={`0 ${VB_Y} 390 ${VB_H}`} className="absolute inset-0 w-full h-full overflow-visible" role="img"
        aria-label={vuoto ? 'Probabilità stimata di superare il test: ancora nessuna stima' : `Probabilità stimata di superare il test: ${testo}`}>
        <defs>
          <linearGradient id={`a${id}`} gradientUnits="userSpaceOnUse" x1={x0} y1="0" x2={x1} y2="0">
            <stop offset="0" style={{ stopColor: `var(--color-${livello}-chiaro)` }} />
            <stop offset="1" style={{ stopColor: col }} />
          </linearGradient>
          <radialGradient id={`h1${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" style={{ stopColor: col, stopOpacity: ALONE[livello] }} />
            <stop offset="0.55" style={{ stopColor: col, stopOpacity: ALONE[livello] / 3 }} />
            <stop offset="1" style={{ stopColor: col, stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id={`h2${id}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" style={{ stopColor: col, stopOpacity: 0.35 }} />
            <stop offset="1" style={{ stopColor: col, stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* tacche esterne: più lunghe ogni tre, colorate fino al valore */}
        {esterne.map(i => {
          const g = 180 - 15 * i;
          const [a, b] = pt(g, 161.1); const [c, d] = pt(g, i % 3 === 0 ? 171.4 : 167.3);
          return <line key={`e${i}`} x1={a} y1={b} x2={c} y2={d} strokeWidth="1.33" strokeLinecap="round" opacity="0.55"
            style={{ stroke: accesa(i) ? col : 'var(--color-tacca)' }} />;
        })}
        {/* tacche interne, sottili */}
        {interne.map(i => {
          const g = 180 - 15 * i;
          const [a, b] = pt(g, 112.4); const [c, d] = pt(g, 105.2);
          const on = accesa(i);
          return <line key={`i${i}`} x1={a} y1={b} x2={c} y2={d} strokeWidth="0.82" strokeLinecap="round" opacity={on ? 0.22 : 0.55}
            style={{ stroke: on ? col : 'var(--color-tacca)' }} />;
        })}

        {!vuoto && <circle cx={px} cy={py} r="51.3" fill={`url(#h1${id})`} />}
        <path d={arcoFondo} fill="none" strokeWidth={SPESSORE} strokeLinecap="round" style={{ stroke: 'var(--color-linea)' }} />
        {!vuoto && frazione > 0 && <path d={arcoValore} fill="none" stroke={`url(#a${id})`} strokeWidth={SPESSORE} strokeLinecap="round" />}
        {!vuoto && (
          <>
            <circle cx={px} cy={py} r="38.5" fill={`url(#h2${id})`} />
            <circle cx={px} cy={py} r="17.45" fill="#FFFFFF" style={{ filter: `drop-shadow(0 1px 2px color-mix(in srgb, ${col} 40%, transparent))` }} />
            <circle cx={px} cy={py} r="10.26" style={{ fill: col }} />
          </>
        )}
      </svg>

      {/* (i): apre il foglio che spiega la stima */}
      {onInfo && !vuoto && (
        <button type="button" onClick={onInfo} aria-label="Come è calcolata la stima"
          className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo"
          style={{ left: `${(195 / 390) * 100}%`, top: pct(194) }}>
          <Info size={16} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}

      {vuoto ? (
        <div className="absolute inset-x-0 flex flex-col items-center text-center pointer-events-none" style={{ top: pct(222) }}>
          <div className="font-extrabold text-testo leading-[1.1]" style={{ fontSize: cq(22), letterSpacing: '-0.01em' }}>Scopri a che<br />punto sei</div>
          <div className="text-testo-tenue font-medium" style={{ fontSize: cq(13.5), marginTop: cq(8) }}>la tua probabilità di superare il test</div>
        </div>
      ) : (
        <>
          <div className="absolute inset-x-0 text-center font-extrabold tabular-nums whitespace-nowrap pointer-events-none"
            style={{ top: pct(221.5), fontSize: cq(42), lineHeight: 1, letterSpacing: '-0.02em', color: `var(--color-${livello}-numero)` }}>{testo}</div>
          <div className="absolute inset-x-0 text-center font-semibold whitespace-nowrap pointer-events-none"
            style={{ top: pct(268.5), fontSize: cq(15), lineHeight: 1, color: `var(--color-${livello}-testo)` }}>{etichetta}</div>
          <div className="absolute inset-x-0 text-center font-medium text-testo-tenue whitespace-nowrap pointer-events-none"
            style={{ top: pct(291.5), fontSize: cq(13.5), lineHeight: 1 }}>{sotto}</div>
        </>
      )}
    </div>
  );
}
