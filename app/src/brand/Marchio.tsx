import { MARCHIO } from './marchio.generato';

/**
 * Marchio AddiOFA: il wordmark con il lettermark (la A con la stella dalla base piatta) al posto della prima A.
 * MONOCOLORE: un solo colore, quello del testo (chiaro/scuro seguono i token); la stella è un vuoto e si vede lo sfondo.
 * Il logo 3D resta solo icona dell'app e degli store.
 * `disposizione`: 'orizzontale' e 'wordmark' (identici: il lettermark è già dentro la parola), 'lettermark' (solo la A).
 */
type Disposizione = 'orizzontale' | 'verticale' | 'lettermark' | 'wordmark';

export default function Marchio({ disposizione = 'orizzontale', altezza = 32, className }: { disposizione?: Disposizione; altezza?: number; className?: string }) {
  const solo = disposizione === 'lettermark';
  const [x, y, W, H] = solo ? MARCHIO.lettermark.vb : MARCHIO.parola.vb;
  const [tx, ty] = MARCHIO.parola.trasl;
  const percorsi = solo ? MARCHIO.parola.percorsi.filter(p => p.id === 'lettermark') : MARCHIO.parola.percorsi;
  return (
    <svg viewBox={`${x} ${y} ${W} ${H}`} height={altezza} width={(altezza * W) / H} role="img" aria-label="AddiOFA" className={className}>
      <g transform={`translate(${tx} ${ty})`} className="fill-testo">
        {percorsi.map(p => <path key={p.id} d={p.d} fillRule={p.eo ? 'evenodd' : undefined} />)}
      </g>
    </svg>
  );
}
