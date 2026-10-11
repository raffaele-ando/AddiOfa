import { MARCHIO } from './marchio.generato';

/**
 * Marchio AddiOFA: lettermark (la A con la stella dalla base piatta) e wordmark, scelti dall'utente nella galleria loghi.
 * Vettoriale in linea: i colori seguono i token (testo e marchio), quindi vale per tema chiaro e scuro senza altri file.
 * La stella nella O è bianca su chiaro e del colore del fondo su scuro. Il logo 3D resta solo icona dell'app e degli store.
 */
type Disposizione = 'orizzontale' | 'verticale' | 'lettermark' | 'wordmark';

const CLASSE = { testo: 'fill-testo', marchio: 'fill-marchio', stella: 'fill-white dark:fill-superficie' } as const;

function Parole({ tx, ty }: { tx: number; ty: number }) {
  const [sx, sy] = MARCHIO.wordmark.traslazione;
  return (
    <g transform={`translate(${tx} ${ty})`}>
      <g transform={`translate(${sx} ${sy})`}>
        {MARCHIO.wordmark.glifi.map(g => 'd' in g
          ? <path key={g.id} d={g.d} className={CLASSE[g.tono]} />
          : <circle key={g.id} cx={g.cerchio.cx} cy={g.cerchio.cy} r={g.cerchio.r} className={CLASSE[g.tono]} />)}
      </g>
    </g>
  );
}

export default function Marchio({ disposizione = 'orizzontale', altezza = 32, className }: { disposizione?: Disposizione; altezza?: number; className?: string }) {
  const L = MARCHIO.lettermark;
  let W: number, H: number, corpo: React.ReactNode;
  if (disposizione === 'lettermark') {
    [, , W, H] = L.vb;
    corpo = <path d={L.d} transform={`translate(${-L.vb[0]} ${-L.vb[1]})`} fillRule="evenodd" className="fill-marchio" />;
  } else if (disposizione === 'wordmark') {
    const [x, y, w, h] = MARCHIO.wordmark.vb; W = w; H = h;
    corpo = <Parole tx={-x} ty={-y} />;
  } else {
    const d = MARCHIO[disposizione];
    W = d.W; H = d.H;
    const [lx, ly, k] = d.lm; const [wx, wy] = d.wm;
    corpo = (<>
      <path d={L.d} transform={`translate(${lx} ${ly}) scale(${k})`} fillRule="evenodd" className="fill-marchio" />
      <Parole tx={wx} ty={wy} />
    </>);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} height={altezza} width={(altezza * W) / H} role="img" aria-label="AddiOFA" className={className}>
      {corpo}
    </svg>
  );
}
