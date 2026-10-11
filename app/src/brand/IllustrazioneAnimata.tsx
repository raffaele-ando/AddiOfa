import { useEffect, useMemo, useRef, useState } from 'react';
import './animazioni/comune.css';
import './animazioni/attesa-caricamento.css';
import './animazioni/celebrazione.css';
import './animazioni/mancato-superamento.css';
import './animazioni/piano-studi-bloccato.css';
import './animazioni/progressi-statistiche.css';
import './animazioni/quiz-test.css';
import './animazioni/risultato-probabilita.css';
import './animazioni/studio-inglese.css';
import './animazioni/successo.css';
import './animazioni/suggerimenti-consigli.css';
import './animazioni/superamento.css';

/**
 * Illustrazione con animazione a pezzi (un libro che si impila, una spunta che si traccia, barre che crescono...).
 * Non è un'animazione decorativa: parte UNA volta quando compare e si ferma sullo stato statico.
 * API e regole: app/src/brand/animazioni/README.md. L'SVG è inline, con gli id prefissati per illustrazione.
 */
export type NomeAnimata =
  | 'studio-inglese' | 'quiz-test' | 'risultato-probabilita' | 'successo' | 'celebrazione' | 'mancato-superamento'
  | 'progressi-statistiche' | 'piano-studi-bloccato' | 'attesa-caricamento' | 'superamento' | 'suggerimenti-consigli';

export const NOMI_ANIMATI: readonly string[] = [
  'studio-inglese', 'quiz-test', 'risultato-probabilita', 'successo', 'celebrazione', 'mancato-superamento',
  'progressi-statistiche', 'piano-studi-bloccato', 'attesa-caricamento', 'superamento', 'suggerimenti-consigli',
];
export function eAnimata(nome: string): nome is NomeAnimata { return NOMI_ANIMATI.includes(nome); }

// Solo le 11 illustrazioni animate (chiaro e scuro): un glob più largo porterebbe nel pacchetto tutto il kit.
const SVG = import.meta.glob(
  './essenziali/disegni/kit-blu/illustrazioni/{studio-inglese,quiz-test,risultato-probabilita,successo,celebrazione,mancato-superamento,progressi-statistiche,piano-studi-bloccato,attesa-caricamento,superamento,suggerimenti-consigli}{,.scuro}.svg',
  { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function sorgente(nome: string, scuro: boolean): string | undefined {
  const chiave = `./essenziali/disegni/kit-blu/illustrazioni/${nome}${scuro ? '.scuro' : ''}.svg`;
  return SVG[chiave] ?? SVG[`./essenziali/disegni/kit-blu/illustrazioni/${nome}.svg`];
}

/** Prefissa ogni id e ogni riferimento (url(#x), href="#x") per evitare scontri tra illustrazioni nella stessa pagina. */
function prefissaId(svg: string, prefisso: string): string {
  const ids = new Set<string>();
  for (const m of svg.matchAll(/\bid="([^"]+)"/g)) ids.add(m[1]);
  let out = svg.replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefisso}${id}"`);
  out = out.replace(/url\(#([^)]+)\)/g, (t, id) => (ids.has(id) ? `url(#${prefisso}${id})` : t));
  out = out.replace(/(xlink:)?href="#([^"]+)"/g, (t, x, id) => (ids.has(id) ? `${x ?? ''}href="#${prefisso}${id}"` : t));
  return out;
}

function usaTemaScuro(): boolean {
  const [scuro, setScuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const o = new MutationObserver(() => setScuro(document.documentElement.classList.contains('dark')));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => o.disconnect();
  }, []);
  return scuro;
}

export function IllustrazioneAnimata({ nome, lato, alt = '', riavvia = 0, avvia = true, quandoVisibile = false, className }: {
  nome: NomeAnimata; lato?: number; alt?: string;
  /** Cambiando questo numero l'animazione riparte (pulsante «Rivedi»). */
  riavvia?: number; avvia?: boolean;
  /** Per le illustrazioni fuori dallo schermo (landing in fondo): parte quando compare. Finché non compare è nascosta, così non lampeggia. */
  quandoVisibile?: boolean; className?: string;
}) {
  const scuro = usaTemaScuro();
  const ref = useRef<HTMLSpanElement>(null);
  const html = useMemo(() => {
    const svg = sorgente(nome, scuro);
    if (!svg) return '';
    const dim = lato ? ` width="${lato}"` : '';
    return prefissaId(svg, `${nome}--`).replace(/<svg\b([^>]*?)>/, (_, a) =>
      `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')}${dim} aria-hidden="true" focusable="false">`);
  }, [nome, scuro, lato, alt]);

  const [visto, setVisto] = useState(!quandoVisibile);
  useEffect(() => {
    if (!quandoVisibile || visto) return;
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setVisto(true); return; }
    const o = new IntersectionObserver(voci => { if (voci.some(v => v.isIntersecting)) { setVisto(true); o.disconnect(); } }, { threshold: 0.5 });
    o.observe(el);
    return () => o.disconnect();
  }, [quandoVisibile, visto]);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.classList.remove('in');
    if (!avvia || !visto) return;
    void el.offsetWidth; // forza il reflow: così l'animazione riparte da capo
    el.classList.add('in');
  }, [html, riavvia, avvia, visto]);

  return (
    <span ref={ref} className={`anim anim-${nome}${className ? ` ${className}` : ''}`} role={alt ? 'img' : undefined} aria-label={alt || undefined}
      style={visto ? undefined : { opacity: 0 }}
      dangerouslySetInnerHTML={{ __html: html }} />
  );
}
