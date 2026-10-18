import { useLayoutEffect, useRef } from 'react';
import type { LegalSection } from '../types';
import Barra from './landing/Barra';
import Hero from './landing/Hero';
import Vantaggi from './landing/Vantaggi';
import Perche from './landing/Perche';
import Passi from './landing/Passi';
import SeNonSuperi from './landing/SeNonSuperi';
import Faq from './landing/Faq';
import CtaFinale from './landing/CtaFinale';
import PiePagina from './landing/PiePagina';
import './landing/landing.css';

interface LandingProps {
  onStartDiagnostic(): void;
  onSkip(): void;
  onOpenLegal(s: LegalSection): void;
}

// La landing occupa tutta la finestra: la cornice stretta dell'app (max-w-3xl, 800 px) non basta per due colonne.
// Per questo è un livello fisso con il suo scorrimento; se un domani App la mette fuori dal Layout, resta uguale.
export default function Landing({ onStartDiagnostic, onSkip, onOpenLegal }: LandingProps) {
  // Pagina ferma: sotto l'hero ogni scheda compare solo quando chi scorre (rotella o dito) ci arriva. Niente movimento da sola.
  const scorri = useRef<HTMLDivElement>(null);
  useRivelaScorrendo(scorri);

  return (
    <div ref={scorri} className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden bg-fondo text-testo">
      <Barra onStart={onStartDiagnostic} />
      <main className="landing-pagina">
        <Hero onStart={onStartDiagnostic} onSkip={onSkip} />
        <Vantaggi />
        <SeNonSuperi onStart={onStartDiagnostic} />
        <Passi onStart={onStartDiagnostic} />
        <Perche onOpenLegal={onOpenLegal} />
        <Faq onOpenLegal={onOpenLegal} />
        <CtaFinale onStart={onStartDiagnostic} onSkip={onSkip} />
      </main>
      <PiePagina onOpenLegal={onOpenLegal} />
    </div>
  );
}

/** Le schede sotto l'hero (liste, carte, titoli, domande) partono nascoste e compaiono quando entrano nella finestra mentre si scorre.
 *  Non si applica con «riduci movimento» o senza IntersectionObserver: allora tutto è già visibile. Le mini-schermate (aria-hidden) non si toccano. */
function useRivelaScorrendo(radice: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = radice.current;
    if (!el || typeof IntersectionObserver === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const schede = Array.from(el.querySelectorAll<HTMLElement>('main > section:not(:first-of-type) :is(li, article, details, h2, figure, [data-scheda])'))
      .filter(n => !n.closest('[aria-hidden="true"]'));
    // un elemento dentro un'altra scheda non si rivela due volte: si tengono i più esterni
    const esterne = schede.filter(n => !schede.some(m => m !== n && m.contains(n)));
    esterne.forEach(n => n.classList.add('rivela'));
    const o = new IntersectionObserver(voci => {
      const entrano = voci.filter(v => v.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      entrano.forEach((v, i) => { (v.target as HTMLElement).style.transitionDelay = `${Math.min(i, 5) * 70}ms`; v.target.classList.add('rivela-si'); o.unobserve(v.target); });
    }, { root: el, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    esterne.forEach(n => o.observe(n));
    return () => { o.disconnect(); esterne.forEach(n => { n.classList.remove('rivela', 'rivela-si'); n.style.transitionDelay = ''; }); };
  }, [radice]);
}
