import { APP_NAME } from '../../config/offer';
import { urlIcona } from '../../brand/risorse';
import { playTapSound } from '../../lib/audio';
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
    <header className="sticky top-0 z-30 border-b border-[#E2E8F0]/80 dark:border-[#334155]/80 bg-white/85 dark:bg-[#0F172A]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex items-center gap-2.5 shrink-0">
          <img src={urlIcona} alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
          <span className="text-lg font-extrabold tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
        </div>

        <nav aria-label="Sezioni della pagina" className="hidden lg:flex items-center gap-1 rounded-full border border-[#E2E8F0] dark:border-[#334155] bg-white/70 dark:bg-[#1E293B]/70 p-1">
          {ANCORE.map(a => (
            <a
              key={a.id}
              href={`#${a.id}`}
              onClick={e => { e.preventDefault(); playTapSound(); vaiA(a.id); }}
              className={cn('rounded-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-azione-tinta hover:text-azione-scuro dark:hover:bg-azione-tinta-scura/50 dark:hover:text-white transition-colors duration-100', FOCUS)}
            >
              {a.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => { playTapSound(); onStart(); }}
          className={cn('shrink-0 rounded-xl bg-azione hover:bg-azione-scuro px-4 py-2.5 text-sm font-bold text-white transition-colors duration-100', FOCUS)}
        >
          <span className="sm:hidden">Inizia</span>
          <span className="hidden sm:inline">Fai il diagnostico</span>
        </button>
      </div>
    </header>
  );
}
