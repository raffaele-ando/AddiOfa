// Radar a N assi (3-8), fermo. Disegnato in SVG senza testi; le etichette sono HTML attorno al disegno.
// Il valore di ogni asse è scritto anche nella lista sotto: il radar da solo non è l'unica fonte.
import { SOGLIA_DA_MIGLIORARE } from '../../../lib/servizi/analisi';
import { TESTO_TONO, VAR_TONO, tonoAccuratezza } from './tono';

export interface AsseRadar { nome: string; valore: number }

const C = 50;       // centro, in unità di viewBox (0-100)
const R = 29;       // raggio del 100 %
const R_ETICHETTE = 38.5;

const punto = (i: number, n: number, r: number): [number, number] => {
  const a = (-90 + (360 * i) / n) * (Math.PI / 180);
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const poligono = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => punto(i, n, f(i)).map(v => v.toFixed(2)).join(',')).join(' ');

export default function Radar({ assi, descrizione }: { assi: AsseRadar[]; descrizione: string }) {
  const n = assi.length;
  if (n < 3) return null;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" role="img" aria-label={descrizione}>
        {[25, 50, 75, 100].map(g => (
          <polygon key={g} points={poligono(n, () => (R * g) / 100)} fill="none" stroke="var(--color-tacca)" strokeWidth={g === 100 ? 0.5 : 0.35} />
        ))}
        {/* l'anello tratteggiato è la soglia sotto cui un argomento è «da migliorare» */}
        <polygon points={poligono(n, () => (R * SOGLIA_DA_MIGLIORARE) / 100)} fill="none" stroke="var(--color-testo-tenue)" strokeWidth={0.45} strokeDasharray="1.6 1.2" />
        {assi.map((_, i) => {
          const [x, y] = punto(i, n, R);
          return <line key={i} x1={C} y1={C} x2={x} y2={y} stroke="var(--color-tacca)" strokeWidth={0.35} />;
        })}
        <polygon points={poligono(n, i => (R * Math.max(0, Math.min(100, assi[i].valore))) / 100)}
          fill="var(--color-azione)" fillOpacity={0.22} stroke="var(--color-azione)" strokeWidth={0.9} strokeLinejoin="round" />
        {assi.map((a, i) => {
          const [x, y] = punto(i, n, (R * Math.max(0, Math.min(100, a.valore))) / 100);
          // il punto ha il tono dell'argomento (verde solido, ambra da migliorare, corallo da ripassare): la forma resta blu, i punti dicono dove guardare
          const t = tonoAccuratezza(a.valore);
          return <circle key={i} cx={x} cy={y} r={2} fill={t ? VAR_TONO[t] : 'var(--color-azione)'} stroke="var(--color-superficie-2)" strokeWidth={0.7} />;
        })}
      </svg>
      {assi.map((a, i) => {
        const [x, y] = punto(i, n, R_ETICHETTE);
        return (
          <span key={a.nome} aria-hidden="true" className="absolute w-[84px] -translate-x-1/2 -translate-y-1/2 text-center text-[11px] leading-[13px] font-semibold text-testo"
            style={{ left: `${x}%`, top: `${y}%` }}>
            {a.nome}
            <span className={`block text-[11px] font-bold tabular-nums ${TESTO_TONO[tonoAccuratezza(a.valore) ?? 'nessuno']}`}>{Math.round(a.valore)}%</span>
          </span>
        );
      })}
    </div>
  );
}
