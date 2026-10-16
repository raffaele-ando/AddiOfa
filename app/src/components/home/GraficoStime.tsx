import { useId } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import type { PuntoStima } from './stima';
import { livelloDi } from './stima';
import { TitoloSezione } from './Stima';
import { formatProbabilita } from '../../lib/diagnostic';
import { playTapSound } from '../../lib/audio';

// Disegno su 343 x 100: la scala è unica (0-100) per tutti i punti, così l'altezza dice davvero quanto vale la stima.
const W = 342.8, ALTO = 84, SU = 6, GIU = 38;
const yDi = (p: number) => GIU - (Math.max(0, Math.min(100, p)) / 100) * (GIU - SU);
// Punti sulla stessa griglia del concept: dal 8 % al 91 % della larghezza (un punto solo: al centro)
const xDi = (i: number, n: number) => (n === 1 ? 0.5 : 0.08 + (0.832 * i) / (n - 1)) * W;

/**
 * "Andamento": solo punti MISURATI (la stima dopo il diagnostico e dopo ogni simulazione, ultimi 5), linea a gradiente
 * dal colore di un punto a quello del successivo, valore e nome sotto ogni punto. Nessuna proiezione.
 * Con un solo punto si vede il punto.
 */
export default function GraficoStime({ punti, onInfo }: { punti: PuntoStima[]; onInfo?: () => void }) {
  const id = useId().replace(/:/g, '');
  const n = punti.length;
  if (n === 0) {
    // Andamento vuoto: nessuna stima è ancora stata misurata (né diagnostico né simulazioni). Non si disegna nessun punto.
    return (
      <section aria-labelledby="titolo-grafico" className="flex flex-col gap-[8px]">
        <TitoloSezione id="titolo-grafico">Andamento</TitoloSezione>
        <div role="status" className="flex items-center gap-[14px] rounded-[12px] bg-superficie-2 p-[10px] pr-[14px]">
          <span aria-hidden="true" className="w-[72px] h-[60px] shrink-0 grid place-items-center"><Illustrazione nome="progressi-statistiche-scheda" lato={68} /></span>
          <span className="text-[15px] leading-[20px] font-bold text-testo">Ancora nessun dato</span>
        </div>
      </section>
    );
  }
  const val = punti.map(p => p.p * 100);
  const xs = punti.map((_, i) => xDi(i, n));
  const ys = val.map(yDi);
  const fasce = punti.map(p => livelloDi(p.p));
  const linea = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join('');
  const descrizione = punti.map((p, i) => `${i === n - 1 ? 'Oggi' : p.nome}: ${formatProbabilita(p.p)}`).join('; ');
  const alto = ALTO; // spazio per valore e nome sotto il punto più basso
  return (
    <section aria-labelledby="titolo-grafico" className="flex flex-col gap-[8px]">
      <TitoloSezione id="titolo-grafico" destra={undefined}>
        <span className="inline-flex items-center gap-2">
          Andamento
          {onInfo && (
            <button type="button" onClick={() => { playTapSound(); onInfo(); }} aria-label="Come è calcolata la stima"
              className="grid place-items-center w-7 h-7 -m-1.5 rounded-full text-testo-tenue hover:text-testo"><Icona nome="info" size={18} /></button>
          )}
        </span>
      </TitoloSezione>

      <div role="img" aria-label={`Andamento della stima. ${descrizione}`} className="relative w-full" style={{ aspectRatio: `${W} / ${alto}` }}>
        <svg viewBox={`0 0 ${W} ${alto}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            {n > 1 && (
              <linearGradient id={`l${id}`} gradientUnits="userSpaceOnUse" x1={xs[0]} y1="0" x2={xs[n - 1]} y2="0">
                {fasce.map((f, i) => <stop key={i} offset={i / (n - 1)} style={{ stopColor: `var(--color-${f})` }} />)}
              </linearGradient>
            )}
          </defs>
          {n > 1 && <path d={linea} fill="none" stroke={`url(#l${id})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
          {/* come nel concept: un filo sotto il punto di oggi */}
          <line x1={xs[n - 1]} y1={ys[n - 1] + 8} x2={xs[n - 1]} y2={ys[n - 1] + 15} strokeWidth="1.4" strokeLinecap="round" style={{ stroke: `var(--color-${fasce[n - 1]})`, opacity: 0.45 }} />
          {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="5.64" style={{ fill: `var(--color-${fasce[i]})` }} />)}
        </svg>
        {punti.map((p, i) => {
          const ultimo = i === n - 1;
          return (
            <div key={i} className="absolute flex flex-col items-center text-center whitespace-nowrap leading-none -translate-x-1/2"
              style={{ left: `${(xs[i] / W) * 100}%`, top: `${((ys[i] + (ultimo ? 17 : 11)) / alto) * 100}%` }}>
              <span className="text-[12.5px] leading-[15px] font-bold tabular-nums" style={{ color: `var(--color-${fasce[i]}-testo)` }}>{formatProbabilita(p.p).replace(/\s+%/, '%')}</span>
              <span className={`${n >= 4 ? 'text-[11px]' : 'text-[12px]'} leading-[15px] text-testo-tenue`}>{ultimo ? 'Oggi' : p.nome}</span>
              {ultimo && n === 1 && <span className="text-[11px] leading-[14px] text-testo-tenue">{p.nome}</span>}
            </div>
          );
        })}
      </div>

    </section>
  );
}
