import logo3d from '../essenziali/logo/addiofa-logo-scena.svg?url';
import { useId } from 'react';

/**
 * La lastra blu con la porta di luce a forma di stella: è l'icona di AddiOFA ingrandita, ridisegnata leggera
 * (pochi tracciati e sfumature, nessun filtro di rumore) e con i colori dai token --landing-*, così in scuro diventa notturna.
 * Le coordinate sono quelle del logo (1254 x 1254): la lastra va da x 68 a 1186, la base piatta della porta sta a y 865.
 * La base della porta è aperta: sotto la lastra ci sono i gradini, da cui esce la luce.
 */
export const PORTA = 'M600.5 298.2Q629.8 244.9 656.4 299.6L736.8 464.3Q744.4 479.9 761.5 482.5L922.9 507.5Q970.7 514.9 936.9 549.5L828.7 660.2Q816.5 672.7 817.3 690.2L825.9 865L415.3 865L428.2 694Q429.5 677 417.7 664.8L309.5 553.4Q272 514.7 325.3 506.9L488.6 483Q499.7 481.4 505.1 471.6Z';
export const FRONTE = 'M68.1 865V367.6C68.1 174.8 173.8 69.1 366.6 69.1H887.4C1080.3 69.1 1185.9 174.8 1185.9 367.6V865Z';
/** Centro della porta e punto più basso, in coordinate del logo: servono a chi ci appoggia sopra la luce. */
export const CENTRO_PORTA = { x: 620, base: 865 } as const;

const s = (v: string) => ({ stopColor: `var(${v})` });

/** Contenuto in coordinate del logo: va dentro un <svg> (o un <g transform>) che lo posiziona. */
export function LastraContenuto({ idp }: { idp: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${idp}f`} gradientUnits="userSpaceOnUse" x1="140" y1="900" x2="1100" y2="120">
          <stop offset="0" style={s('--landing-lastra-3')} />
          <stop offset=".5" style={s('--landing-lastra-2')} />
          <stop offset="1" style={s('--landing-lastra-1')} />
        </linearGradient>
        <linearGradient id={`${idp}l`} gradientUnits="userSpaceOnUse" x1="200" y1="100" x2="1200" y2="800">
          <stop offset="0" style={s('--landing-lastra-1')} />
          <stop offset="1" style={s('--landing-lastra-fianco')} />
        </linearGradient>
        <radialGradient id={`${idp}p`} gradientUnits="userSpaceOnUse" cx="620" cy="690" r="330">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".45" stopColor="#FFFFFF" />
          <stop offset=".8" style={s('--landing-luce')} />
          <stop offset="1" style={s('--landing-luce-bordo')} />
        </radialGradient>
        <radialGradient id={`${idp}a`} cx=".5" cy=".5" r=".5">
          <stop offset="0" style={{ stopColor: 'var(--landing-luce-bordo)', stopOpacity: 0.3 }} />
          <stop offset=".4" style={{ stopColor: 'var(--landing-luce-bordo)', stopOpacity: 0.07 }} />
          <stop offset="1" style={{ stopColor: 'var(--landing-luce-bordo)', stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id={`${idp}b`} gradientUnits="userSpaceOnUse" x1="0" y1="250" x2="0" y2="865">
          <stop offset="0" stopColor="#E8932C" />
          <stop offset=".5" stopColor="#FFC766" />
          <stop offset="1" stopColor="#FFF1C4" />
        </linearGradient>
        <linearGradient id={`${idp}w`} gradientUnits="userSpaceOnUse" x1="0" y1="450" x2="0" y2="865">
          <stop offset="0" style={{ stopColor: 'var(--landing-luce)', stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: 'var(--landing-luce)', stopOpacity: 0.95 }} />
        </linearGradient>
        <linearGradient id={`${idp}v`} gradientUnits="userSpaceOnUse" x1="120" y1="100" x2="700" y2="500">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${idp}c`}><path d={FRONTE} /></clipPath>
        <clipPath id={`${idp}d`}><path d={PORTA} /></clipPath>
        <filter id={`${idp}z`} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id={`${idp}y`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
      </defs>

      {/* spessore: il dorso della lastra, spostato in alto a destra */}
      <path d={FRONTE} transform="translate(44 -30)" fill={`url(#${idp}l)`} />
      <path d={FRONTE} transform="translate(22 -15)" fill={`url(#${idp}l)`} opacity=".7" />
      {/* faccia anteriore con la porta tagliata via */}
      <path d={`${FRONTE}${PORTA}`} fillRule="evenodd" fill={`url(#${idp}f)`} />
      {/* riflesso morbido in alto a sinistra */}
      <path d={FRONTE} fill={`url(#${idp}v)`} clipPath={`url(#${idp}c)`} opacity=".5" />
      {/* il bagliore della porta sporca di caldo il blu intorno */}
      <g clipPath={`url(#${idp}c)`}>
        <ellipse cx="620" cy="600" rx="600" ry="520" fill={`url(#${idp}a)`} style={{ mixBlendMode: 'screen' }} />
      </g>

      {/* dentro la porta: luce piena, bordo interno ambrato */}
      <path d={PORTA} fill={`url(#${idp}p)`} />
      <path d={PORTA} fill={`url(#${idp}w)`} />
      <g clipPath={`url(#${idp}d)`}>
        <path d={PORTA} fill="none" stroke={`url(#${idp}b)`} strokeWidth="46" strokeLinejoin="round" filter={`url(#${idp}z)`} />
        <path d={`M300 200L470 520L360 880L110 880L110 200Z`} fill="#0B1F66" opacity=".16" filter={`url(#${idp}y)`} />
      </g>
    </>
  );
}

/** Lastra da sola, ritagliata attorno alla lastra: per i blocchi in fondo alla pagina. È il logo 3D vero (con luce e profondità), senza il fondo chiaro. */
export default function Lastra({ className }: { className?: string }) {
  return (
    <svg viewBox="40 20 1220 870" className={className} aria-hidden focusable="false">
      <image href={logo3d} x="0" y="0" width="1254" height="1254" />
    </svg>
  );
}
