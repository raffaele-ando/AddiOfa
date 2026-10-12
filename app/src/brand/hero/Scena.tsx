import { useLayoutEffect, useRef, useState } from 'react';
import Misuratore from '../../components/home/Misuratore';
import scenaChiara from '../essenziali/hero/scena-chiara.webp';

/**
 * Scena dell'hero: la lastra blu con la porta di luce a forma di stella, la scalinata, il cielo e le carte di vetro.
 * L'immagine è ritagliata dal concept 41 (grafica/strumenti/brand/estrai_hero.py: senza insegne e senza la carta «82 %»);
 * la carta con la probabilità stimata è vera (Misuratore con un valore d'esempio dichiarato tale) e copre il posto di quella del concept.
 * In tema scuro la stessa scena si scurisce con un filtro e un velo blu notte. Tutto fermo.
 * Palco di 976 x 490 unità (la misura dell'immagine), scalato alla larghezza disponibile.
 */
const L = 976, A = 490;

export default function Scena({ scuro, conCarte = true, className = '' }: { scuro: boolean; conCarte?: boolean; className?: string }) {
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
      {/* immagine: sfuma a sinistra, in alto e in basso nel fondo della pagina */}
      <div className="absolute inset-0" style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 84%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 9%, #000 84%, transparent 100%)',
        WebkitMaskComposite: 'source-in', maskComposite: 'intersect',
      }}>
        <img src={scenaChiara} alt="" draggable={false} className="absolute inset-0 h-full w-full"
          style={scuro ? { filter: 'brightness(0.74) saturate(1.2) contrast(1.22)' } : undefined} />
        {scuro && <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--landing-cielo-alto) 0%, var(--landing-cielo-medio) 55%, var(--landing-cielo-basso) 100%)', mixBlendMode: 'multiply', opacity: 0.5 }} />}
      </div>

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
