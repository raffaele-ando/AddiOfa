import { useLayoutEffect, useRef, useState } from 'react';
import Misuratore from '../../components/home/Misuratore';
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
          <div className="vetro absolute rounded-[28px] p-[16px] pb-[12px]" style={{ left: 104, top: 44, width: 206, transform: 'rotate(-4deg)' }}>
            <p className="text-[15px] font-bold leading-tight text-testo">Probabilità stimata<br />di superare il test</p>
            <div className="mt-1"><Misuratore percento={72} livello="alto" etichetta="Esempio" sotto="" /></div>
          </div>
        </div>
      )}
    </div>
  );
}
