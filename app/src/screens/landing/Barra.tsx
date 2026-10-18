import { useEffect, useRef, useState } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';
import Marchio from '../../brand/Marchio';
import { Colonna, FOCUS } from './comune';
import { cn } from '../../lib/utils';

export const ANCORE = [
  { id: 'ofa', label: 'Cos’è l’OFA' },
  { id: 'come-funziona', label: 'Come funziona' },
  { id: 'perche', label: 'Il test' },
  { id: 'domande', label: 'Domande' },
];

/** Porta alla sezione senza toccare l'indirizzo della pagina (l'app usa l'URL per altro). */
export function vaiA(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  // il focus segue lo scorrimento, così chi usa la tastiera continua da lì
  const titolo = el.querySelector<HTMLElement>('h1, h2');
  if (titolo) { titolo.tabIndex = -1; titolo.focus({ preventScroll: true }); }
}

/** Sezione in vista: la voce del menu si colora. Nessun movimento, solo il cambio di colore. */
function useSezioneAttiva(): string {
  const [attiva, setAttiva] = useState('');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const visibili = new Map<string, number>();
    const o = new IntersectionObserver(voci => {
      for (const v of voci) visibili.set(v.target.id, v.isIntersecting ? v.intersectionRatio : 0);
      let migliore = ''; let r = 0;
      for (const a of ANCORE) { const x = visibili.get(a.id) ?? 0; if (x > r) { r = x; migliore = a.id; } }
      if (migliore) setAttiva(migliore);
    }, { rootMargin: '-20% 0px -45% 0px', threshold: [0, 0.1, 0.3, 0.6, 1] });
    for (const a of ANCORE) { const el = document.getElementById(a.id); if (el) o.observe(el); }
    return () => o.disconnect();
  }, []);
  return attiva;
}

// Barra in alto: il marchio, il menu a pillola (da 1024 px), il pulsante d'azione e, sul telefono, il menu a tendina. Sta nella stessa colonna dei contenuti.
// In cima alla pagina è trasparente (sotto c'è la scena); appena si scorre diventa piena (fondo al 96 %, sfocatura, filetto), così il testo non passa sotto il marchio.
// Il pulsante d'azione sul telefono compare solo quando quello dell'hero è uscito dalla vista: un solo pulsante alla volta.
export default function Barra({ onStart }: { onStart(): void }) {
  const attiva = useSezioneAttiva();
  const [aperto, setAperto] = useState(false);
  const [scorsa, setScorsa] = useState(false);
  const [oltreHero, setOltreHero] = useState(false);
  const rif = useRef<HTMLElement>(null);
  const vai = (id: string) => { playTapSound(); setAperto(false); vaiA(id); };

  useEffect(() => {
    const radice = rif.current?.parentElement;
    if (!radice) return;
    const f = () => { setScorsa(radice.scrollTop > 8); setOltreHero(radice.scrollTop > 400); };
    f();
    radice.addEventListener('scroll', f, { passive: true });
    return () => radice.removeEventListener('scroll', f);
  }, []);

  return (
    <header ref={rif} className="sticky top-0 z-30 -mb-16 h-16">
      <div aria-hidden className={cn('absolute inset-0 border-b transition-colors duration-100', scorsa || aperto ? 'border-linea bg-fondo/96 backdrop-blur-md' : 'border-transparent bg-transparent')} />
      <Colonna className="relative flex h-16 items-center justify-between gap-3">
        <button type="button" onClick={() => vai('home')} aria-label="AddiOFA, torna in cima" className={cn('flex shrink-0 items-center rounded-lg', FOCUS)}>
          <Marchio disposizione="orizzontale" altezza={28} />
        </button>

        <nav aria-label="Sezioni della pagina" className="hidden items-center gap-0.5 rounded-full border border-linea bg-superficie p-1 lg:flex">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              aria-current={attiva === a.id ? 'true' : undefined}
              onClick={e => { e.preventDefault(); vai(a.id); }}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-100',
                attiva === a.id ? 'bg-azione-tinta text-azione-testo' : 'text-testo hover:bg-azione-tinta hover:text-azione-testo',
                FOCUS,
              )}
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Inizia il test di livello"
            onClick={() => { playTapSound(); onStart(); }}
            className={cn('h-10 shrink-0 items-center gap-2 rounded-full bg-azione px-5 text-sm font-bold text-azione-su transition-colors duration-100 hover:bg-azione-scuro', oltreHero ? 'inline-flex' : 'hidden lg:inline-flex', FOCUS)}
          >
            <span className="lg:hidden">Inizia il test</span>
            <span className="hidden lg:inline">Inizia il test di livello</span>
          </button>
          <button
            type="button"
            aria-expanded={aperto}
            aria-controls="menu-landing"
            aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => { playTapSound(); setAperto(v => !v); }}
            className={cn('flex h-11 w-11 items-center justify-center rounded-full text-testo hover:bg-linea lg:hidden', FOCUS)}
          >
            <Icona nome={aperto ? 'chiudi' : 'menu'} size={24} />
          </button>
        </div>
      </Colonna>

      {aperto && (
        <nav id="menu-landing" aria-label="Sezioni della pagina" className="absolute inset-x-4 top-[4.25rem] flex flex-col rounded-3xl border border-linea bg-superficie p-2 shadow-lg dark:shadow-none lg:hidden">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={e => { e.preventDefault(); vai(a.id); }}
              className={cn('rounded-2xl px-4 py-3 text-base font-semibold text-testo hover:bg-azione-tinta', attiva === a.id && 'bg-azione-tinta text-azione-testo', FOCUS)}
            >
              {a.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
