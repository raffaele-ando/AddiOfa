import { useEffect, useState } from 'react';
import type { LegalSection } from '../types';
import Footer from './Footer';
import Barra from './landing/Barra';
import Hero from './landing/Hero';
import Vantaggi from './landing/Vantaggi';
import Passi from './landing/Passi';
import SeNonSuperi from './landing/SeNonSuperi';
import Offerta from './landing/Offerta';
import Faq from './landing/Faq';
import CtaFinale from './landing/CtaFinale';
import { Colonna } from './landing/comune';

interface LandingProps {
  onStartDiagnostic(): void;
  onSkip(): void;
  onOpenLegal(s: LegalSection): void;
  /** Facoltativa: porta al Pass (lista d'attesa finché i pagamenti sono spenti). Senza, il pulsante non compare. */
  onOpenPass?(): void;
}

// La landing occupa tutta la finestra: la cornice stretta dell'app (max-w-3xl, 800 px) non basta per due colonne.
// Per questo è un livello fisso con il suo scorrimento; se un domani App la mette fuori dal Layout, resta uguale.
export default function Landing({ onStartDiagnostic, onSkip, onOpenLegal, onOpenPass }: LandingProps) {
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
    <div className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden bg-[#F6F8FC] dark:bg-[#111B21] text-[#0F172A] dark:text-[#E2E8F0]">
      {import.meta.env.VITE_MODE === 'demo' && (
        <p role="note" className="bg-[#0F172A] dark:bg-[#1E293B] px-4 py-1.5 text-center text-[11px] leading-snug text-white">
          Versione dimostrativa: nessun pagamento, i dati restano su questo dispositivo.
        </p>
      )}
      <Barra onStart={onStartDiagnostic} />
      <main>
        <Hero onStart={onStartDiagnostic} onSkip={onSkip} />
        <Vantaggi />
        <Passi />
        <SeNonSuperi onStart={onStartDiagnostic} />
        <Offerta scuro={scuro} onStart={onStartDiagnostic} onOpenPass={onOpenPass} onOpenLegal={onOpenLegal} />
        <Faq onOpenLegal={onOpenLegal} />
        <CtaFinale scuro={scuro} onStart={onStartDiagnostic} onSkip={onSkip} />
      </main>
      <Colonna className="pb-8">
        <Footer onOpenLegal={onOpenLegal} />
      </Colonna>
    </div>
  );
}
