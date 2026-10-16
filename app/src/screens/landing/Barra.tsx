import { useEffect, useState } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';
import Marchio from '../../brand/Marchio';
import { FOCUS } from './comune';
import { cn } from '../../lib/utils';

export const ANCORE = [
  { id: 'home', label: 'Home' },
  { id: 'come-funziona', label: 'Come funziona' },
  { id: 'perche', label: 'Perché AddiOFA' },
  { id: 'prezzo', label: 'Prezzi' },
  { id: 'domande', label: 'FAQ' },
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
  const [attiva, setAttiva] = useState(ANCORE[0].id);
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

// Barra in alto, sopra la scena: il marchio, il menu a pillola (da 1024 px), il pulsante d'azione e, sul telefono, il menu a tendina.
export default function Barra({ onStart }: { onStart(): void }) {
  const attiva = useSezioneAttiva();
  const [aperto, setAperto] = useState(false);
  const vai = (id: string) => { playTapSound(); setAperto(false); vaiA(id); };

  return (
    <header className="sticky top-0 z-30 -mb-16 h-16">
      <div className="absolute inset-0 backdrop-blur-md [background:var(--landing-barra)] lg:[background:transparent] lg:backdrop-blur-none" aria-hidden />
      <div className="relative mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-8">
        <button type="button" onClick={() => vai('home')} aria-label="AddiOFA, torna in cima" className={cn('flex shrink-0 items-center rounded-lg', FOCUS)}>
          <Marchio disposizione="orizzontale" altezza={34} />
        </button>

        <nav aria-label="Sezioni della pagina" className="vetro vetro-forte hidden lg:flex items-center gap-0.5 rounded-full p-1">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              aria-current={attiva === a.id ? 'true' : undefined}
              onClick={e => { e.preventDefault(); vai(a.id); }}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-100',
                attiva === a.id ? 'bg-azione-tinta text-azione-scuro' : 'text-testo hover:bg-azione-tinta hover:text-azione-scuro',
                FOCUS,
              )}
            >
              {a.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { playTapSound(); onStart(); }}
            className={cn('flex shrink-0 items-center gap-2.5 rounded-full bg-azione hover:bg-azione-scuro py-1.5 pl-5 pr-1.5 text-sm font-bold text-azione-su transition-colors duration-100', FOCUS)}
          >
            <span className="sm:hidden">Inizia</span>
            <span className="hidden sm:inline">Fai il diagnostico</span>
            <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full bg-azione-su text-azione"><Icona nome="avanti" size={18} /></span>
          </button>
          <button
            type="button"
            aria-expanded={aperto}
            aria-controls="menu-landing"
            aria-label={aperto ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => { playTapSound(); setAperto(v => !v); }}
            className={cn('flex h-10 w-10 items-center justify-center rounded-full text-testo hover:bg-linea lg:hidden', FOCUS)}
          >
            <Icona nome={aperto ? 'chiudi' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {aperto && (
        <nav id="menu-landing" aria-label="Sezioni della pagina" className="vetro vetro-forte absolute inset-x-4 top-[4.25rem] flex flex-col rounded-3xl p-2 lg:hidden">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={e => { e.preventDefault(); vai(a.id); }}
              className={cn('rounded-2xl px-4 py-3 text-base font-semibold text-testo hover:bg-azione-tinta', attiva === a.id && 'bg-azione-tinta text-azione-scuro', FOCUS)}
            >
              {a.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
