import { playTapSound } from '../../lib/audio';
import Marchio from '../../brand/Marchio';
import { FOCUS } from './comune';
import { cn } from '../../lib/utils';

export const ANCORE = [
  { id: 'come-funziona', label: 'Come funziona' },
  { id: 'cosa-ottieni', label: 'Cosa ottieni' },
  { id: 'prezzo', label: 'Prezzo' },
  { id: 'domande', label: 'Domande' },
];

/** Porta alla sezione senza toccare l'indirizzo della pagina (l'app usa l'URL per altro). */
export function vaiA(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
  // il focus segue lo scorrimento, così chi usa la tastiera continua da lì
  const titolo = el.querySelector<HTMLElement>('h2');
  if (titolo) { titolo.tabIndex = -1; titolo.focus({ preventScroll: true }); }
}

// Barra in alto: logo sempre, ancore solo da 1024 px, pulsante d'azione sempre.
export default function Barra({ onStart }: { onStart(): void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-linea/80 bg-superficie-2/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center shrink-0">
          <Marchio disposizione="orizzontale" altezza={36} />
        </div>

        <nav aria-label="Sezioni della pagina" className="hidden lg:flex items-center gap-1 rounded-full border border-linea bg-superficie/70 p-1">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={e => { e.preventDefault(); playTapSound(); vaiA(a.id); }}
              className={cn('rounded-full px-4 py-2 text-sm font-semibold text-testo hover:bg-azione-tinta hover:text-azione-scuro transition-colors duration-100', FOCUS)}
            >
              {a.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => { playTapSound(); onStart(); }}
          className={cn('shrink-0 rounded-xl bg-azione hover:bg-azione-scuro px-4 py-2.5 text-sm font-bold text-azione-su transition-colors duration-100', FOCUS)}
        >
          <span className="sm:hidden">Inizia</span>
          <span className="hidden sm:inline">Fai il diagnostico</span>
        </button>
      </div>
    </header>
  );
}
