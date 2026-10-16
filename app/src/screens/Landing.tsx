import { useEffect, useState } from 'react';
import type { LegalSection } from '../types';
import Footer from './Footer';
import Barra from './landing/Barra';
import Hero from './landing/Hero';
import Vantaggi from './landing/Vantaggi';
import Perche from './landing/Perche';
import Passi from './landing/Passi';
import SeNonSuperi from './landing/SeNonSuperi';
import Faq from './landing/Faq';
import CtaFinale from './landing/CtaFinale';
import { Colonna } from './landing/comune';

interface LandingProps {
  onStartDiagnostic(): void;
  onSkip(): void;
  onOpenLegal(s: LegalSection): void;
}

// La landing occupa tutta la finestra: la cornice stretta dell'app (max-w-3xl, 800 px) non basta per due colonne.
// Per questo è un livello fisso con il suo scorrimento; se un domani App la mette fuori dal Layout, resta uguale.
export default function Landing({ onStartDiagnostic, onSkip, onOpenLegal }: LandingProps) {
  const [scuro, setScuro] = useState(() => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const el = document.documentElement;
    const aggiorna = () => setScuro(el.classList.contains('dark'));
    aggiorna();
    const o = new MutationObserver(aggiorna);
    o.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => o.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden bg-fondo text-testo">
      <Barra onStart={onStartDiagnostic} />
      <main className="landing-pagina">
        <Hero onStart={onStartDiagnostic} onSkip={onSkip} scuro={scuro} />
        <Vantaggi />
        <SeNonSuperi onStart={onStartDiagnostic} />
        <Passi onStart={onStartDiagnostic} />
        <Perche onStart={onStartDiagnostic} />
        <Faq onOpenLegal={onOpenLegal} />
        <CtaFinale onStart={onStartDiagnostic} onSkip={onSkip} />
      </main>
      <Colonna className="pb-8">
        <Footer onOpenLegal={onOpenLegal} />
      </Colonna>
    </div>
  );
}
