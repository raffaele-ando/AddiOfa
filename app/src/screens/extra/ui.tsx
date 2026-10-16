// Mattoncini comuni a TUTTE le schermate extra: una sola impostazione di pagina, intestazione e sezione, così profilo, sfide,
// studio e servizi hanno la stessa gerarchia (titolo 26/34, sottotitolo 14, sezioni 15,5, colonna di 440 px) e lo stesso posto per i comandi.
// Regole: la freccia indietro sta sulla stessa riga del titolo; a destra del titolo solo un comando piccolo (ingranaggio, info),
// mai un'illustrazione o un'icona decorativa; il sottotitolo è una frase sola; la barra in basso la mette l'App.
import { useEffect, type ReactNode } from 'react';
import { Icona } from '../../brand/icone/Icona';
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
                <Icona nome="indietro" size={28} />
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

// ---------------------------------------------------------------------------------------------------------------
// Colore con significato (teoria dei colori dei concept): il blu è l'azione e lo studio; il verde è ciò che è riuscito
// (obiettivi, accuratezza, superato); l'ambra è sforzo e premio (giorni di studio, tempo, trofei); il corallo è il confronto
// e il rischio (duelli, errori); il viola è apprendimento e traguardi (badge, quiz). Un solo colore per significato, mai
// a caso: i toni non si mescolano nella stessa riga. Il testo grande resta navy: il colore sta in icone, barre e numeri chiave.
export type Tono = 'azione' | 'alto' | 'medio' | 'basso' | 'viola';

/** Classi complete (Tailwind le trova come testo): tinta di fondo, icona, testo di accento leggibile, barra piena, fondo di pulsante con testo bianco. */
export const TONI: Record<Tono, { tinta: string; icona: string; testo: string; barra: string; pieno: string; bordo: string }> = {
  azione: { tinta: 'bg-azione-tinta', icona: 'text-azione-scuro', testo: 'text-azione-scuro', barra: 'bg-azione', pieno: 'bg-azione text-azione-su', bordo: 'border-azione/30' },
  alto: { tinta: 'bg-alto-tinta', icona: 'text-alto-numero', testo: 'text-alto-testo', barra: 'bg-alto', pieno: 'bg-alto-pieno text-azione-su', bordo: 'border-alto/30' },
  medio: { tinta: 'bg-medio-tinta', icona: 'text-medio-numero', testo: 'text-medio-testo', barra: 'bg-medio', pieno: 'bg-medio-pieno text-azione-su', bordo: 'border-medio/30' },
  basso: { tinta: 'bg-basso-tinta', icona: 'text-basso-numero', testo: 'text-basso-testo', barra: 'bg-basso', pieno: 'bg-basso-pieno text-azione-su', bordo: 'border-basso/30' },
  viola: { tinta: 'bg-viola-tinta', icona: 'text-viola', testo: 'text-viola-testo', barra: 'bg-viola', pieno: 'bg-viola-pieno text-azione-su', bordo: 'border-viola/30' },
};

/** Tessera quadrata con l'icona, nel tono scelto (come le icone colorate dei concept). */
export function IconaTono({ tono, children, lato = 40, className }: { tono: Tono; children: ReactNode; lato?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('grid shrink-0 place-items-center rounded-[11px]', TONI[tono].tinta, TONI[tono].icona, className)} style={{ width: lato, height: lato }}>
      {children}
    </span>
  );
}

/** Barra di avanzamento nel tono scelto. `valore` da 0 a 100. */
export function BarraTono({ valore, tono = 'azione', className }: { valore: number; tono?: Tono; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-tacca/60', className)} role="presentation">
      <div className={cn('h-full rounded-full', TONI[tono].barra)} style={{ width: `${Math.max(0, Math.min(100, valore))}%` }} />
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Testata delle tre schede (Simulazioni, Lezioni; la Home ha il marchio al posto del titolo): titolo a sinistra, il profilo
// sempre a destra, nello stesso punto in tutta l'app. Nessuna frase sotto il titolo.
export function TestataScheda({ titolo, onProfilo, destra }: { titolo: string; onProfilo: () => void; destra?: ReactNode }) {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
      <div className="flex items-center gap-2">
        {destra}
        <button type="button" onClick={() => { playTapSound(); onProfilo(); }} aria-label="Profilo"
          className="brand-premibile grid h-9 w-9 place-items-center rounded-full bg-superficie-2 text-testo">
          <Icona nome="profilo" size={22} />
        </button>
      </div>
    </header>
  );
}

/** Pulsante tondo «i»: le spiegazioni non stanno scritte in pagina, si aprono qui (foglio). */
export function PulsanteInfo({ onClick, etichetta = 'Informazioni', className }: { onClick: () => void; etichetta?: string; className?: string }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={etichetta}
      className={cn('brand-premibile grid h-8 w-8 place-items-center rounded-full text-testo-tenue hover:text-testo', className)}>
      <Icona nome="info" size={20} />
    </button>
  );
}

/** Foglio in basso con una spiegazione a richiesta. Si chiude con la X, toccando fuori o con Esc. Niente `alert/confirm`. */
export function FoglioInfo({ aperto, onChiudi, titolo, children }: { aperto: boolean; onChiudi: () => void; titolo: string; children: ReactNode }) {
  useEffect(() => {
    if (!aperto) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onChiudi(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [aperto, onChiudi]);
  if (!aperto) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-testo/40" onClick={e => { if (e.target === e.currentTarget) onChiudi(); }}>
      <div role="dialog" aria-modal="true" aria-label={titolo} className="max-h-[80%] w-full overflow-y-auto rounded-t-[24px] bg-superficie p-6 pb-8 text-testo shadow-xl dark:shadow-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[18px] leading-[24px] font-extrabold">{titolo}</h2>
          <button type="button" onClick={onChiudi} aria-label="Chiudi" className="brand-premibile grid h-9 w-9 place-items-center rounded-full bg-superficie-2 text-testo"><Icona nome="chiudi" size={20} /></button>
        </div>
        <div className="text-[14.5px] leading-[21px] text-testo">{children}</div>
      </div>
    </div>
  );
}
