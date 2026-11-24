import { MARCHIO } from './marchio.generato';
import marchioIcona from './essenziali/logo/marchio-porta-stella.svg?url';

/**
 * Marchio AddiOFA, come nei concept 07, 28 e 35: «Addi» nel colore del testo, «OFA» nel blu d'azione, la O è un disco con UNA sola stella
 * (la scintilla a quattro punte, ritagliata: si vede lo sfondo). I colori sono token (fill-testo, fill-azione): chiaro e scuro seguono il tema.
 * Leggibile da 24 px di altezza in su; sotto, usare 'lettermark' (la sola A con la stella).
 * 'orizzontale' mette a sinistra il marchio-icona «porta a stella» (scelto dall'autore il 24/11/2026), come nella tavola del marchio;
 * 'wordmark' è la sola scritta.
 * `disposizione`: 'orizzontale' e 'wordmark' (identici), 'lettermark' (solo la A). `monocolore`: tutto nel colore del testo (stampa, filigrana).
 * Generato da tools/genera-marchio.py (non si modifica a mano marchio.generato.ts).
 */
type Disposizione = 'orizzontale' | 'verticale' | 'lettermark' | 'wordmark';

export default function Marchio({ disposizione = 'orizzontale', altezza = 32, className, monocolore = false }: { disposizione?: Disposizione; altezza?: number; className?: string; monocolore?: boolean }) {
  const solo = disposizione === 'lettermark';
  const [x, y, W, H] = solo ? MARCHIO.lettermark.vb : MARCHIO.parola.vb;
  const [tx, ty] = solo ? MARCHIO.lettermark.trasl : MARCHIO.parola.trasl;
  // il file del marchio-icona ha un margine di 32/512 per lato: lo si allarga perché il riquadro visibile sia alto quanto la scritta
  const lato = Math.round(altezza * 512 / 448);
  if (disposizione === 'orizzontale') {
    return (
      <span role="img" aria-label="AddiOFA" className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(altezza * 0.22) }}>
        <img src={marchioIcona} alt="" aria-hidden="true" width={lato} height={lato} style={{ margin: -Math.round((lato - altezza) / 2), flexShrink: 0 }} />
        <Marchio disposizione="wordmark" altezza={altezza} monocolore={monocolore} />
      </span>
    );
  }
  return (
    <svg viewBox={`${x} ${y} ${W} ${H}`} height={altezza} width={(altezza * W) / H} role="img" aria-label="AddiOFA" className={className}>
      <g transform={`translate(${tx} ${ty})`}>
        {solo
          ? <path d={MARCHIO.lettermark.d} fillRule="evenodd" className="fill-azione" />
          : MARCHIO.parola.percorsi.map(p => (
              <path key={p.id} d={p.d} fillRule={p.eo ? 'evenodd' : undefined} className={monocolore || p.ruolo === 'testo' ? 'fill-testo' : 'fill-azione'} />
            ))}
      </g>
    </svg>
  );
}
