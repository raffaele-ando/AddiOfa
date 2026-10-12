import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { BarChart3, ListChecks, ShieldCheck } from 'lucide-react';
import logo3d from '../essenziali/logo/addiofa-logo-scena.svg?url';
import Misuratore from '../../components/home/Misuratore';
import { IllustrazioneAnimata } from '../IllustrazioneAnimata';
import { urlDisegno } from '../risorse';

/**
 * Scena dell'hero: la lastra blu con la porta di luce, la scalinata che sale, il cielo e le carte di vetro.
 * Tutto fermo. È disegnata su un palco di 1000 x 680 unità e scalata alla larghezza disponibile (come un'immagine),
 * così le carte tengono le proporzioni a ogni larghezza. Il tema scuro cambia solo i token --landing-*: cielo notturno, bagliore caldo.
 */
const L = 1000, A = 680;
const K = 0.36, OX = 424, OY = 15;                       // posto e scala della lastra sul palco
const PORTA_X = OX + 620 * K, BASE_Y = OY + 865 * K;     // centro e base della porta (647, 326)
const LARG_PORTA = (826 - 415) * K;                      // 148: larghezza della base della porta
const APERTURA = 1.6;                                    // quanto si allarga la scala per ogni unità verso il basso
const larg = (y: number) => LARG_PORTA + (y - BASE_Y) * APERTURA;

// Gradini: dal più alto (vicino alla porta) al più basso. Ogni gradino ha un piano e un'alzata.
function gradini() {
  const out: { piano: string; alzata: string; i: number }[] = [];
  let y = BASE_Y;
  for (let i = 0; i < 8; i++) {
    const d = 11 + i * 1.7, h = 17 + i * 2.5;
    const q = (y0: number, y1: number) => {
      const a = larg(y0) / 2, b = larg(y1) / 2;
      return `${PORTA_X - a},${y0} ${PORTA_X + a},${y0} ${PORTA_X + b},${y1} ${PORTA_X - b},${y1}`;
    };
    out.push({ i, piano: q(y, y + d), alzata: q(y + d, y + d + h) });
    y += d + h;
  }
  return out;
}
const GRADINI = gradini();
const Y_FINE = BASE_Y + GRADINI.reduce((t, _g, i) => t + 11 + i * 1.7 + 17 + i * 2.5, 0);

const sf = (v: string): CSSProperties => ({ fill: `var(${v})` });
const st = (v: string, o?: number) => ({ stopColor: `var(${v})`, stopOpacity: o });

function Vetro({ className = '', style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return <div className={`vetro absolute ${className}`} style={style}>{children}</div>;
}

function Pillola({ Icona, children, style }: { Icona: typeof ListChecks; children: string; style: CSSProperties }) {
  return (
    <div className="vetro vetro-forte absolute flex items-center gap-2.5 whitespace-nowrap rounded-full py-2 pl-2 pr-5 text-[17px] font-bold text-testo" style={style}>
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azione-tinta text-azione-scuro"><Icona size={18} aria-hidden /></span>
      {children}
    </div>
  );
}

export default function Scena({ scuro, conCarte = true, className = '' }: { scuro: boolean; conCarte?: boolean; className?: string }) {
  const idp = useId().replace(/:/g, '') + 'S';
  const host = useRef<HTMLDivElement>(null);
  const [scala, setScala] = useState(0.7);
  useLayoutEffect(() => {
    const el = host.current; if (!el) return;
    const misura = () => setScala(el.clientWidth / L);
    misura();
    if (typeof ResizeObserver === 'undefined') return;
    const o = new ResizeObserver(misura);
    o.observe(el);
    return () => o.disconnect();
  }, []);

  const quiz = urlDisegno('kit-blu', 'illustrazioni', 'quiz-test', scuro);

  return (
    <div ref={host} aria-hidden className={`relative select-none ${className}`} style={{ aspectRatio: `${L} / ${A}` }}>
      {/* cielo e scalinata: sfumano a sinistra e in basso nel fondo della pagina */}
      <div className="absolute inset-0" style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 34%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 72%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, #000 34%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 72%, transparent 100%)',
        WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
      }}>
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, var(--landing-cielo-alto) 0%, var(--landing-cielo-medio) 46%, var(--landing-cielo-basso) 82%)',
      }} />
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: L, height: A, transform: `scale(${scala})` }}>
        {/* lastre di vetro dietro, per la profondità */}
        <div className="vetro absolute rounded-[34px]" style={{ left: 840, top: 110, width: 170, height: 230, transform: 'rotate(5deg)', opacity: 0.55 }} />

        <svg viewBox={`0 0 ${L} ${A}`} width={L} height={A} className="absolute inset-0 overflow-hidden" focusable="false">
          <defs>
            <linearGradient id={`${idp}m`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={st('--landing-muro-1')} /><stop offset="1" style={st('--landing-muro-2')} />
            </linearGradient>
            <linearGradient id={`${idp}t`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={st('--landing-gradino-sopra')} /><stop offset="1" style={st('--landing-gradino-sopra')} />
            </linearGradient>
            <radialGradient id={`${idp}r`} cx=".5" cy=".5" r=".5">
              <stop offset="0" style={st('--landing-luce', 0.8)} />
              <stop offset=".35" style={st('--landing-luce-bordo', 0.3)} />
              <stop offset="1" style={st('--landing-luce-bordo', 0)} />
            </radialGradient>
            <linearGradient id={`${idp}f`} gradientUnits="userSpaceOnUse" x1="0" y1={BASE_Y} x2="0" y2={Y_FINE}>
              <stop offset="0" style={st('--landing-luce', 0.6)} />
              <stop offset=".6" style={st('--landing-luce-bordo', 0.14)} />
              <stop offset="1" style={st('--landing-luce-bordo', 0)} />
            </linearGradient>
            <linearGradient id={`${idp}o`} gradientUnits="userSpaceOnUse" x1="470" y1="0" x2="990" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".95" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <filter id={`${idp}b`} x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="3" /></filter>
          </defs>

          {/* fianchi della scalinata */}
          <polygon points={`${OX + 68 * K},${BASE_Y} ${PORTA_X - LARG_PORTA / 2},${BASE_Y} ${PORTA_X - larg(Y_FINE) / 2},${Y_FINE} -190,${Y_FINE}`} fill={`url(#${idp}m)`} />
          <polygon points={`${OX + 1186 * K},${BASE_Y} ${PORTA_X + LARG_PORTA / 2},${BASE_Y} ${PORTA_X + larg(Y_FINE) / 2},${Y_FINE} 1190,${Y_FINE}`} fill={`url(#${idp}m)`} />
          <polygon points={`${PORTA_X - LARG_PORTA / 2},${BASE_Y} ${PORTA_X - LARG_PORTA / 2 - 9},${BASE_Y} ${PORTA_X - larg(Y_FINE) / 2 - 9 * 1.0},${Y_FINE} ${PORTA_X - larg(Y_FINE) / 2},${Y_FINE}`} style={sf('--landing-gradino-ombra')} opacity=".7" />
          <polygon points={`${PORTA_X + LARG_PORTA / 2},${BASE_Y} ${PORTA_X + LARG_PORTA / 2 + 9},${BASE_Y} ${PORTA_X + larg(Y_FINE) / 2 + 9},${Y_FINE} ${PORTA_X + larg(Y_FINE) / 2},${Y_FINE}`} style={sf('--landing-gradino-ombra')} opacity=".7" />

          {/* la lastra */}
          <image href={logo3d} x={OX} y={OY} width={1254 * K} height={1254 * K} />

          {/* i gradini: piano chiaro, alzata più scura */}
          {GRADINI.map(g => (
            <g key={g.i}>
              <polygon points={g.alzata} style={sf('--landing-gradino-fronte')} />
              <polygon points={g.piano} style={sf('--landing-gradino-sopra')} />
            </g>
          ))}

          {/* la luce che esce dalla porta e sale sui gradini */}
          <polygon points={`${PORTA_X - LARG_PORTA / 2},${BASE_Y} ${PORTA_X + LARG_PORTA / 2},${BASE_Y} ${PORTA_X + larg(Y_FINE) / 2},${Y_FINE} ${PORTA_X - larg(Y_FINE) / 2},${Y_FINE}`} fill={`url(#${idp}f)`} style={{ mixBlendMode: 'screen' }} />
          <ellipse cx={PORTA_X} cy={BASE_Y + 10} rx="330" ry="150" fill={`url(#${idp}r)`} style={{ mixBlendMode: 'screen' }} />

          {/* scia di luce */}
          <path d={`M470 ${BASE_Y + 40}C520 ${BASE_Y - 80},760 ${BASE_Y - 70},980 ${BASE_Y - 20}`} fill="none" stroke={`url(#${idp}o)`} strokeWidth="3" strokeLinecap="round" filter={`url(#${idp}b)`} opacity=".8" />
        </svg>

        </div>
      </div>

      <div className="absolute left-0 top-0 origin-top-left hidden sm:block" style={{ width: L, height: A, transform: `scale(${scala})` }}>
        {conCarte && (
          <>
            {/* probabilità stimata, con il misuratore vero e un valore d'esempio dichiarato tale */}
            <Vetro className="rounded-[28px] p-[18px] pb-[14px]" style={{ left: 168, top: 36, width: 262, transform: 'rotate(-7deg)' }}>
              <p className="text-[16px] font-bold leading-tight text-testo">Probabilità stimata<br />di superare il test</p>
              <div className="mt-2"><Misuratore percento={72} livello="alto" etichetta="Esempio" sotto="" /></div>
            </Vetro>

            {/* quiz */}
            <Vetro className="rounded-[26px] p-[14px]" style={{ left: 808, top: 28, width: 168, transform: 'rotate(6deg)' }}>
              {quiz && <img src={quiz} alt="" draggable={false} className="block w-full" />}
              <p className="mt-1 text-center text-[15px] font-bold text-testo">Quiz come al test</p>
            </Vetro>

            {/* piano degli studi bloccato */}
            <Vetro className="rounded-[26px] p-[16px]" style={{ left: 796, top: 252, width: 196, transform: 'rotate(-5deg)' }}>
              <div className="flex justify-center"><IllustrazioneAnimata nome="piano-studi-bloccato" lato={112} quandoVisibile /></div>
              <p className="mt-1 text-[16px] font-bold leading-tight text-testo">Piano di studi bloccato</p>
              <p className="mt-1 text-[13px] font-medium leading-snug text-testo-tenue">Con l'OFA aperto, solo esami del 1° anno.</p>
            </Vetro>

            <Pillola Icona={ShieldCheck} style={{ left: 292, top: 372, transform: 'rotate(-3deg)' }}>Quiz interattivi</Pillola>
            <Pillola Icona={ListChecks} style={{ left: 230, top: 440, transform: 'rotate(-3deg)' }}>Simulazioni realistiche</Pillola>
            <Pillola Icona={BarChart3} style={{ left: 760, top: 470, transform: 'rotate(3deg)' }}>Analisi del livello</Pillola>
          </>
        )}
      </div>
    </div>
  );
}
