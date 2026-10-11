import { useId, useState } from 'react';
import { Info } from 'lucide-react';
import type { PuntoStima } from './stima';
import { formatProbabilita } from '../../lib/diagnostic';
import { playTapSound } from '../../lib/audio';

// Scala unica 0-100 per tutti i punti, tracciato su 360 x 112.
const W = 360, ALTO = 112, SU = 12, GIU = 98;
const yDi = (p: number) => GIU - ((Math.max(0, Math.min(100, p)) / 100) * (GIU - SU));

// Colore secondo il valore (rosso, giallo, verde): la stessa funzione dà il gradiente della linea e il colore dei punti.
const STOP: [number, [number, number, number]][] = [[0, [239, 68, 68]], [28, [239, 68, 68]], [40, [245, 158, 11]], [58, [245, 158, 11]], [70, [34, 197, 94]], [100, [34, 197, 94]]];
function coloreDi(v: number): string {
  for (let i = 1; i < STOP.length; i++) {
    if (v <= STOP[i][0]) {
      const [a, ca] = STOP[i - 1], [b, cb] = STOP[i];
      const t = b === a ? 0 : (v - a) / (b - a);
      return `rgb(${ca.map((x, k) => Math.round(x + (cb[k] - x) * t)).join(',')})`;
    }
  }
  return 'rgb(34,197,94)';
}

/**
 * "Come cambia la tua probabilità": solo punti MISURATI (la stima dopo il diagnostico e dopo ogni simulazione, ultimi 5).
 * Nessuna proiezione. Con un solo punto si vede il punto e l'invito a fare una simulazione.
 */
export default function GraficoStime({ punti, onSimulazione }: { punti: PuntoStima[]; onSimulazione?: () => void }) {
  const id = useId().replace(/:/g, '');
  const [info, setInfo] = useState(false);
  const n = punti.length;
  if (n === 0) return null;
  const xs = punti.map((_, i) => ((i + 0.5) / n) * W);
  const val = punti.map(p => p.p * 100);
  const ys = val.map(yDi);
  const linea = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join('');
  const descrizione = punti.map((p, i) => `${i === n - 1 ? 'Oggi' : p.nome}: ${formatProbabilita(p.p)}`).join('; ');
  return (
    <section aria-labelledby="titolo-grafico" className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 px-0.5">
        <h2 id="titolo-grafico" className="text-[19px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Come cambia la tua probabilità</h2>
        <button type="button" onClick={() => { playTapSound(); setInfo(v => !v); }} aria-expanded={info} aria-controls="info-grafico" aria-label="Cosa mostra il grafico"
          className="p-1.5 -m-0.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"><Info size={19} aria-hidden="true" /></button>
      </div>
      {info && (
        <p id="info-grafico" className="mt-1 rounded-xl bg-[#F1F5F9] dark:bg-[#1E293B] px-3 py-2.5 text-[12.5px] leading-snug text-[#475569] dark:text-[#CBD5E1]">
          Ogni punto è una stima che hai avuto davvero: dopo il diagnostico e dopo ciascuna simulazione, con le risposte date fino a quel momento. Non è una previsione: il grafico non dice cosa succederà.
        </p>
      )}

      <div role="img" aria-label={`Come cambia la stima. ${descrizione}`}>
        <svg viewBox={`0 0 ${W} ${ALTO}`} className="block w-full h-auto mt-1" aria-hidden="true">
          <defs>
            {/* gradiente in unità del disegno: il colore dipende dal valore, anche con la linea piatta */}
            <linearGradient id={`l${id}`} gradientUnits="userSpaceOnUse" x1="0" y1={yDi(100)} x2="0" y2={yDi(0)}>
              <stop offset="0" stopColor="#22C55E" /><stop offset="0.3" stopColor="#22C55E" />
              <stop offset="0.42" stopColor="#F59E0B" /><stop offset="0.6" stopColor="#F59E0B" />
              <stop offset="0.72" stopColor="#EF4444" /><stop offset="1" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <line x1="0" y1={GIU + 6} x2={W} y2={GIU + 6} strokeWidth="1.5" className="stroke-[#E3E8F0] dark:stroke-[#334155]" />
          {n > 1 && (
            <path d={linea} fill="none" stroke={`url(#l${id})`} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          )}
          {xs.map((x, i) => (
            <g key={i}>
              <line x1={x} y1={ys[i] + 8} x2={x} y2={GIU + 6} strokeWidth="1.5" strokeDasharray="2 4" strokeLinecap="round" className="stroke-[#D5DBE6] dark:stroke-[#475569]" />
              <circle cx={x} cy={ys[i]} r={i === n - 1 ? 9 : 7} fill={coloreDi(val[i])} stroke="#fff" strokeWidth={i === n - 1 ? 4 : 3.5} className="dark:stroke-[#0F172A]" />
            </g>
          ))}
        </svg>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {punti.map((p, i) => {
            const ultimo = i === n - 1;
            return (
              <div key={i} className="flex flex-col items-center text-center min-w-0 px-0.5">
                <span className={`font-extrabold tabular-nums whitespace-nowrap leading-tight text-[#0F172A] dark:text-[#F8FAFC] ${ultimo ? 'text-[16px]' : 'text-[14px]'}`}>{formatProbabilita(p.p)}</span>
                <span className={`text-[11px] whitespace-nowrap leading-tight ${ultimo ? 'font-semibold text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#6B7280] dark:text-[#94A3B8]'}`}>{ultimo ? 'Oggi' : p.nome}</span>
                {ultimo && n === 1 && <span className="text-[11px] leading-tight text-[#6B7280] dark:text-[#94A3B8]">{p.nome}</span>}
                {ultimo && n > 1 && <span className="text-[10.5px] whitespace-nowrap leading-tight text-[#6B7280] dark:text-[#94A3B8]">{p.nome}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {n === 1 && (
        onSimulazione
          ? <button type="button" onClick={() => { playTapSound(); onSimulazione(); }} className="mt-2 self-center text-[13.5px] font-semibold text-azione-scuro dark:text-azione-chiaro underline underline-offset-4 decoration-1">Fai una simulazione per vedere come cambia</button>
          : <p className="mt-2 text-center text-[13.5px] text-[#475569] dark:text-[#CBD5E1]">Fai una simulazione per vedere come cambia</p>
      )}
    </section>
  );
}
