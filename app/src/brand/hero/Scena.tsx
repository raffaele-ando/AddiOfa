import { useLayoutEffect, useRef, useState } from 'react';
import Misuratore from '../../components/home/Misuratore';
import { Icona } from '../icone/Icona';
import scenaChiara from '../essenziali/hero/scena-chiara.webp';
import scenaScura from '../essenziali/hero/scena-scura.webp';

/**
 * Scena dell'hero: la lastra blu con la porta di luce a forma di stella, la scalinata, il cielo e le carte di vetro.
 * L'immagine è ritagliata dal concept 41 (grafica/strumenti/brand/estrai_hero.py: senza insegne e senza la carta «82 %»);
 * la carta con la probabilità stimata è vera (Misuratore con un valore d'esempio dichiarato tale) e copre il posto di quella del concept.
 * In tema scuro c'è una vera scena notturna (scena-scura.webp, generata dallo stesso script: cielo blu notte, porta di luce calda, alfa ai bordi); niente filtri.
 * Il `prop` scuro non serve più: la scena giusta la sceglie il CSS. Tutto fermo.
 * Palco di 976 x 490 unità (la misura dell'immagine), scalato alla larghezza disponibile.
 */
const L = 976, A = 490;

/** Bandiera del Regno Unito, semplificata (decorazione della carta del quiz). */
function Bandiera() {
  return (
    <svg viewBox="0 0 60 36" width="40" height="24" aria-hidden focusable="false" className="rounded-[3px]">
      <rect width="60" height="36" fill="var(--color-azione-tinta-scura)" />
      <path d="M0 0L60 36M60 0L0 36" stroke="var(--landing-gradino-sopra)" strokeWidth="7" />
      <path d="M0 0L60 36M60 0L0 36" stroke="var(--landing-corallo-linea)" strokeWidth="2.4" />
      <path d="M30 0V36M0 18H60" stroke="var(--landing-gradino-sopra)" strokeWidth="11" />
      <path d="M30 0V36M0 18H60" stroke="var(--landing-corallo-linea)" strokeWidth="6.5" />
    </svg>
  );
}

export default function Scena({ scuro: _scuro, conCarte = true, className = '' }: { scuro?: boolean; conCarte?: boolean; className?: string }) {
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

  return (
    <div ref={host} aria-hidden className={`relative select-none ${className}`} style={{ aspectRatio: `${L} / ${A}` }}>
      {/* due scene, ne vede una sola il CSS (classe .dark sull'antenato): la chiara sfuma a sinistra, in alto e in basso con una maschera,
          la scura ha le sfumature già nel canale alfa, così sul fondo scuro non restano bordi */}
      <img src={scenaChiara} alt="" draggable={false} className="brand-scena-chiara absolute inset-0 h-full w-full" />
      <img src={scenaScura} alt="" draggable={false} className="brand-scena-scura absolute inset-0 h-full w-full" />

      {conCarte && (
        <div className="absolute left-0 top-0 hidden origin-top-left sm:block" style={{ width: L, height: A, transform: `scale(${scala})` }}>
          <div className="vetro absolute rounded-[28px] p-[12px] pb-[10px]" style={{ left: 76, top: 40, width: 240, transform: 'rotate(-4deg)' }}>
            <p className="text-[15px] font-bold leading-tight text-testo">Probabilità stimata<br />di superare il test</p>
            <div className="mt-1"><Misuratore percento={72} livello="alto" etichetta="Esempio" sotto="" /></div>
          </div>
          {/* le due carte che il concept aveva dentro l'immagine (quiz con bandiera; piano bloccato) sono state cancellate dall'immagine:
              qui ci sono carte vere, un po' più grandi, che coprono anche i ritocchi dello sfondo */}
          <div className="vetro absolute rounded-[24px] p-[14px]" style={{ left: 684, top: 30, width: 144, transform: 'rotate(-4deg)' }}>
            <Bandiera />
            <ul className="mt-2.5 space-y-2">
              {[['A', 'bg-azione text-azione-su'], ['B', 'bg-alto-pieno text-alto-su'], ['C', 'bg-azione text-azione-su']].map(([l, c], i) => (
                <li key={l} className="flex items-center gap-2">
                  <span className={`grid h-[22px] w-[22px] place-items-center rounded-md text-[11px] font-extrabold ${c}`}>{i === 1 ? <Icona nome="stato-risposta-giusta" size={14} /> : l}</span>
                  <span className="h-1.5 flex-1 rounded-full bg-testo/15" /><span className="h-1.5 w-3 rounded-full bg-testo/15" />
                </li>
              ))}
            </ul>
          </div>
          <div className="vetro absolute rounded-[24px] p-[14px]" style={{ left: 744, top: 258, width: 182, transform: 'rotate(-3deg)' }}>
            <p className="flex items-center gap-1.5 text-[14px] font-bold leading-tight text-testo"><Icona nome="errori" size={17} className="text-basso-numero" />Ripasso su misura</p>
            <ul className="mt-2.5 space-y-1.5">
              {[0, 1, 2].map(i => (
                <li key={i} className="flex items-center gap-2 rounded-lg bg-superficie/70 px-2 py-1.5">
                  <Icona nome="stato-incluso" size={15} className="text-alto-pieno" />
                  <span className="h-1.5 rounded-full bg-testo/15" style={{ width: `${70 - i * 14}%` }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
