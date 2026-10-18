import { useId } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import type { PuntoStima } from './stima';
import { livelloDi } from './stima';
import { TitoloSezione } from './Stima';
import { PIENO_FASCIA } from './comune';
import { scalaGrafico } from './stato';
import { formatProbabilita } from '../../lib/diagnostic';
import { playTapSound } from '../../lib/audio';

// Disegno su 320 x 96: il grafico sta in una carta; la scala è ADATTIVA (da minimo-10 a massimo+10, almeno 30 punti, tra 0 e 100),
// così due misure vicine non fanno una linea piatta né un salto finto. Le linee e i punti sono solo misure: nessuna proiezione.
const W = 320, ALTO = 96, SU = 12, GIU = 12;
// Punti sulla stessa griglia del concept: dal 8 % al 92 % della larghezza (un punto solo: al centro)
const xDi = (i: number, n: number) => (n === 1 ? 0.5 : 0.08 + (0.84 * i) / (n - 1));
const nomeBreve = (nome: string) => nome.replace(/^Dopo sim\.\s*/, 'Sim. ');

/**
 * "Andamento": solo punti MISURATI (la stima dopo il diagnostico e dopo ogni simulazione, ultimi 5), linea a gradiente dal colore di un punto a quello
 * del successivo, valore e nome sotto ogni punto, tre filetti di riferimento. Con un solo punto si vede il punto e cosa fare per avere la curva.
 */
export default function GraficoStime({ punti, onInfo }: { punti: PuntoStima[]; onInfo?: () => void }) {
  const id = useId().replace(/:/g, '');
  const n = punti.length;
  const titolo = (
    <TitoloSezione id="titolo-grafico">
      <span className="inline-flex items-center gap-2">
        Andamento
        {onInfo && n > 0 && (
          <button type="button" onClick={() => { playTapSound(); onInfo(); }} aria-label="Come è calcolata la stima"
            className="grid place-items-center w-7 h-7 -m-1.5 rounded-full text-testo-tenue hover:text-testo"><Icona nome="info" size={18} /></button>
        )}
      </span>
    </TitoloSezione>
  );
  if (n === 0) {
    // Nessuna stima misurata (né diagnostico né simulazioni): nessun punto disegnato, e si dice perché.
    return (
      <section aria-labelledby="titolo-grafico" className="flex flex-col gap-3">
        {titolo}
        <div role="status" className="flex items-center gap-[14px] rounded-[16px] bg-superficie-2 p-[14px]">
          <span aria-hidden="true" className="w-[68px] h-[56px] shrink-0 grid place-items-center"><Illustrazione nome="progressi-statistiche-scheda" lato={64} /></span>
          <span className="min-w-0">
            <span className="block text-[16px] leading-[22px] font-bold text-testo">Ancora nessun dato</span>
            <span data-testo-ok className="block text-[14px] leading-[19px] text-testo-tenue">Dopo il test iniziale vedrai la curva.</span>
          </span>
        </div>
      </section>
    );
  }
  const val = punti.map(p => p.p * 100);
  const { lo, hi } = scalaGrafico(val);
  const yDi = (v: number) => SU + (1 - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (ALTO - SU - GIU);
  const xs = punti.map((_, i) => xDi(i, n) * W);
  const ys = val.map(yDi);
  const fasce = punti.map(p => livelloDi(p.p));
  const linea = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join('');
  const descrizione = punti.map((p, i) => `${i === n - 1 && n > 1 ? 'Oggi' : p.nome}: ${formatProbabilita(p.p)}`).join('; ');
  return (
    <section aria-labelledby="titolo-grafico" className="flex flex-col gap-3">
      {titolo}
      <div className="rounded-[16px] bg-superficie-2 px-3 pt-3 pb-3">
        <div role="img" aria-label={`Andamento della stima. ${descrizione}`}>
          <div className="relative w-full" style={{ height: ALTO }}>
            <svg viewBox={`0 0 ${W} ${ALTO}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
              <defs>
                {n > 1 && (
                  <linearGradient id={`l${id}`} gradientUnits="userSpaceOnUse" x1={xs[0]} y1="0" x2={xs[n - 1]} y2="0">
                    {fasce.map((f, i) => <stop key={i} offset={i / (n - 1)} style={{ stopColor: PIENO_FASCIA[f] }} />)}
                  </linearGradient>
                )}
              </defs>
              {[SU, (SU + ALTO - GIU) / 2, ALTO - GIU].map(y => (
                <line key={y} x1="0" x2={W} y1={y} y2={y} strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-tacca" opacity="0.7" />
              ))}
              {n > 1 && <path d={linea} fill="none" stroke={`url(#l${id})`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />}
            </svg>
            {/* i punti sono tondi veri (non si deformano con la larghezza); l'ultimo ha l'anello della carta da 3 px */}
            {punti.map((_, i) => {
              const ultimo = i === n - 1;
              return <span key={i} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: `${(xs[i] / W) * 100}%`, top: ys[i], width: ultimo ? 16 : 12, height: ultimo ? 16 : 12, background: PIENO_FASCIA[fasce[i]],
                  boxShadow: ultimo ? '0 0 0 3px var(--color-superficie-2)' : undefined }} />;
            })}
          </div>
          <div className="relative w-full h-[40px] mt-2" aria-hidden="true">
            {punti.map((p, i) => {
              const ultimo = i === n - 1;
              return (
                <div key={i} className="absolute top-0 flex flex-col items-center text-center whitespace-nowrap -translate-x-1/2" style={{ left: `${(xs[i] / W) * 100}%` }}>
                  <span className="text-[13px] leading-[18px] font-bold tabular-nums" style={{ color: `var(--color-${fasce[i]}-testo)` }}>{formatProbabilita(p.p).replace(/\s+%/, '%')}</span>
                  <span className="text-[12px] leading-[16px] text-testo-tenue">{ultimo && n > 1 ? 'Oggi' : nomeBreve(p.nome)}</span>
                </div>
              );
            })}
          </div>
        </div>
        {n === 1 && <p data-testo-ok className="mt-1 text-center text-[13px] leading-[18px] text-testo-tenue">Fai una simulazione per vedere la curva.</p>}
      </div>
    </section>
  );
}
