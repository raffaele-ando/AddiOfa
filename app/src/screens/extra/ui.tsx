// Mattoncini comuni a TUTTE le schermate extra: una sola impostazione di pagina, intestazione e sezione, così profilo, sfide,
// studio e servizi hanno la stessa gerarchia (titolo 26/34, sottotitolo 14, sezioni 15,5, colonna di 440 px) e lo stesso posto per i comandi.
// Regole: la freccia indietro sta sulla stessa riga del titolo; a destra del titolo solo un comando piccolo (ingranaggio, info),
// mai un'illustrazione o un'icona decorativa; il sottotitolo è una frase sola; la barra in basso la mette l'App.
import type { ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { FONT } from '../../brand/tokens';
import { playTapSound } from '../../lib/audio';
import { cn } from '../../lib/utils';

export interface PropsPagina {
  titolo: string;
  sottotitolo?: ReactNode;
  /** Freccia indietro. Assente = nessuna freccia (schermate a livello di scheda). */
  onBack?: () => void;
  /** Un comando piccolo a destra del titolo (ingranaggio, info). Mai illustrazioni. */
  destra?: ReactNode;
  children: ReactNode;
}

/** Pagina a scorrimento: cornice, colonna centrata, intestazione con freccia indietro e titolo sulla stessa riga. */
export function Pagina({ titolo, sottotitolo, onBack, destra, children }: PropsPagina) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          <header className="flex items-start gap-1">
            {onBack && (
              <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
                className="brand-premibile -ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
                <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
              {sottotitolo && <p className="mt-0.5 text-[14px] leading-[20px] text-testo-tenue">{sottotitolo}</p>}
            </div>
            {destra && <div className="shrink-0 pt-1">{destra}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Sezione con titolo (15,5 px) e, se serve, un'indicazione breve a destra. */
export function Sezione({ id, titolo, destra, children, className }: { id: string; titolo: string; destra?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('mt-[24px] flex flex-col gap-[10px]', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{titolo}</h2>
        {destra}
      </div>
      {children}
    </section>
  );
}
