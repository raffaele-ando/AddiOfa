import { ReactNode, useEffect, useRef, useState } from 'react';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { Illustrazione } from '../brand/Illustrazione';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';

// Mattoncini condivisi dalle schermate del funnel (onboarding, piani, prontuario), nello stile del Brand Kit.
//
// Impaginazione unica del percorso di ingresso (revisione del 18/10): testata fissa in alto (freccia, barra di avanzamento), zona centrale
// che scorre e che assorbe il vuoto (l'illustrazione `Eroe` cresce, le opzioni si allungano), piè di pagina fisso con il pulsante.
// Il contenuto sta attaccato al pulsante; il vuoto sta dentro l'illustrazione, non fra il testo e il pulsante.
// Quattro modelli: Storia (Eroe + titolo + righe), Domanda (etichetta + domanda + opzioni), Lista (titolo + ricerca + elenco), Modulo (titolo + campi).
// Le schermate che non passano `testata` né `piede` (Legal, esercizi) restano come prima, con il solo limite di larghezza su desktop.

export function Screen({ children, className, testata, piede }: {
  children: ReactNode;
  className?: string;
  /** Testata fissa (di solito `<TopBar … />`): non scorre e non cambia mai posto né altezza. */
  testata?: ReactNode;
  /** Piè di pagina fisso: il pulsante principale (e, sopra o sotto, una riga di micro-testo o un secondo pulsante). */
  piede?: ReactNode;
}) {
  const nuovo = testata !== undefined || piede !== undefined;
  return (
    // Su desktop una sola colonna da 480 px, la stessa del telefono: si progetta una volta sola.
    <div className="h-full w-full sm:max-w-[480px] sm:mx-auto bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100 flex flex-col">
      {testata !== undefined && <div className="shrink-0 px-5 sm:px-6 pt-1 sm:pt-4">{testata}</div>}
      <div className={cn(
        'flex flex-col flex-1 min-h-0 gap-4 overflow-y-auto scrollbar-hide',
        nuovo ? cn('px-5 sm:px-6', testata !== undefined ? 'pt-1' : 'pt-5 sm:pt-6', piede !== undefined ? 'pb-3' : 'pb-5 sm:pb-6') : 'p-5 sm:p-8',
        className,
      )}>
        {children}
      </div>
      {piede !== undefined && (
        <div className="relative shrink-0 flex flex-col gap-2 px-5 sm:px-6 pt-3 pb-5 sm:pb-6 before:pointer-events-none before:absolute before:inset-x-0 before:-top-4 before:h-4 before:bg-gradient-to-t before:from-superficie before:to-transparent">
          {piede}
        </div>
      )}
    </div>
  );
}

/**
 * Testata: freccia indietro (area 44 px, sempre presente anche se invisibile, così la barra non si sposta), barra di avanzamento continua
 * (`step` su `totalSteps`) e, a destra, un'azione facoltativa («Salta»). Senza `step` resta solo la freccia.
 */
export function TopBar({ step, totalSteps, onBack, destra, centro }: { step?: number; totalSteps?: number; onBack?: () => void; destra?: ReactNode; centro?: ReactNode }) {
  const conBarra = step !== undefined && totalSteps !== undefined && totalSteps > 0;
  const frazione = conBarra ? Math.max(0, Math.min(1, step / totalSteps)) : 0;
  return (
    <div className="flex items-center gap-2 shrink-0 h-14">
      {onBack ? (
        <button
          onClick={() => { playTapSound(); onBack(); }}
          className="grid h-11 w-11 -ml-2.5 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo transition-colors duration-100"
          aria-label="Indietro"
        >
          <Icona nome="indietro" size={28} />
        </button>
      ) : (
        <span aria-hidden="true" className="block h-11 w-11 -ml-2.5 shrink-0" />
      )}
      {centro}
      {conBarra && (
        // traccia scura ≥ 2:1 sulla superficie, in tutti e due i temi; una sola barra continua (niente tacche)
        <div role="progressbar" aria-label="Avanzamento" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={step} className="h-1.5 flex-1 overflow-hidden rounded-full bg-testo-tenue/45">
          <div className="h-full rounded-full bg-azione" style={{ width: `${frazione * 100}%` }} />
        </div>
      )}
      {!conBarra && !centro && <span className="flex-1" />}
      {destra && <div className="shrink-0 -mr-2">{destra}</div>}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, className, senzaFreccia }: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  senzaFreccia?: boolean;
}) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      disabled={disabled}
      className={cn(
        // disattivo = superficie e testo tenue (leggibile in tutti e due i temi), non il blu al 40 %
        'w-full min-h-14 bg-azione hover:bg-azione-scuro text-azione-su font-bold text-[17px] leading-[24px] py-3.5 px-6 rounded-2xl shadow-sm dark:shadow-none flex items-center justify-center gap-2 transition-colors duration-100 disabled:bg-superficie-2 disabled:text-testo-tenue disabled:shadow-none disabled:border disabled:border-linea disabled:pointer-events-none shrink-0',
        className,
      )}
    >
      <span>{children}</span>
      {!senzaFreccia && <Icona nome="avanti" size={24} />}
    </button>
  );
}

export function SecondaryButton({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'w-full min-h-12 py-2.5 px-6 font-semibold text-[16px] leading-[22px] text-testo bg-transparent border border-bordo-campo rounded-2xl hover:bg-superficie-2 transition-colors duration-100 shrink-0',
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Azione di testo (altezza 44 px): «Non lo so», «Salta». Non è un pulsante principale e non ruba il posto a quello. */
export function TastoTesto({ children, onClick, icona, className, etichetta }: { children: ReactNode; onClick: () => void; icona?: NomeIcona; className?: string; etichetta?: string }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={etichetta}
      className={cn('inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-[15px] leading-[20px] font-semibold text-testo-tenue hover:text-testo transition-colors duration-100', className)}>
      {icona && <Icona nome={icona} size={18} />}{children}
    </button>
  );
}

/**
 * Riga di scelta, la stessa per tutto il percorso: bordo 1 px, superficie, titolo 17/24 peso 600, altezza minima 64 px.
 * Scelta: bordo azione e tinta, con la spunta a destra. `avanza` mette il chevron (il tocco porta avanti da solo).
 * Nel tema scuro la superficie è più chiara della scheda, mai più scura. Senza cerchio vuoto a sinistra.
 */
export function ChoiceCard({ selected, onClick, title, subtitle, avanza }: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  avanza?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        'w-full min-h-16 text-left px-4 py-3 rounded-2xl border flex items-center gap-3 transition-colors duration-100',
        selected
          ? 'border-azione ring-1 ring-azione bg-azione-tinta'
          : 'border-tacca bg-superficie-2 hover:bg-linea',
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[17px] leading-[24px] font-semibold text-testo">{title}</span>
        {subtitle && <span className="text-[14px] leading-[20px] font-medium text-testo-tenue">{subtitle}</span>}
      </span>
      {selected
        ? <Icona nome="stato-risposta-giusta" size={22} className="text-azione-testo" />
        : avanza ? <Icona nome="avanti" size={20} className="text-testo-tenue" /> : null}
    </button>
  );
}

/** Scelta fra poche voci corte in una riga (Sì / No / Non so, livello, anno): pillole larghe uguali, altezza 56 px. */
export function Segmenti<T extends string | number>({ voci, valore, onChange, etichetta, className, compatto }: {
  voci: { id: T; nome: string }[];
  valore: T | null | undefined;
  onChange: (id: T) => void;
  etichetta: string;
  className?: string;
  /** Altezza 48 px (livello, anno) invece di 56. */
  compatto?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={etichetta} className={cn('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(${voci.length}, minmax(0, 1fr))` }}>
      {voci.map(v => {
        const sel = valore === v.id;
        return (
          <button key={String(v.id)} type="button" role="radio" aria-checked={sel} onClick={() => { playTapSound(); onChange(v.id); }}
            className={cn(
              'rounded-2xl border px-2 text-[16px] leading-[22px] font-semibold transition-colors duration-100',
              compatto ? 'min-h-12' : 'min-h-14',
              sel ? 'border-azione ring-1 ring-azione bg-azione-tinta text-azione-testo' : 'border-tacca bg-superficie-2 text-testo hover:bg-linea',
            )}>
            {v.nome}
          </button>
        );
      })}
    </div>
  );
}

/** Titolo di una schermata: etichetta di posizione (13 px), titolo 28/34, frase di spiegazione (16/24, tenue). Il titolo è sempre una frase. */
export function Titolo({ etichetta, titolo, sotto, destra }: { etichetta?: string; titolo: string; sotto?: ReactNode; destra?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {etichetta && <p data-testo-ok className="text-[13px] leading-[18px] font-medium text-testo-tenue tabular-nums">{etichetta}</p>}
      <div className="flex items-start gap-2">
        <h2 data-testo-ok className="min-w-0 flex-1 text-[28px] leading-[34px] font-bold text-testo">{titolo}</h2>
        {destra}
      </div>
      {sotto && <p data-testo-ok className="text-[16px] leading-[24px] text-testo-tenue">{sotto}</p>}
    </div>
  );
}

/**
 * Zona flessibile con l'illustrazione: prende tutto lo spazio che avanza e l'illustrazione cresce fino a `max` px (poi resta centrata);
 * se lo spazio è poco (telefono piccolo, tastiera aperta) si riduce e sotto i 96 px sparisce. Nessuna cornice, nessun cerchio attorno.
 * `min`: altezza sotto cui la zona non scende (le schermate di racconto la vogliono sempre).
 */
export function Eroe({ nome, kit = 'kit-blu', gruppo, max = 280, min = 0, className }: { nome: string; kit?: 'kit-blu' | 'kit-luminoso'; gruppo?: string; max?: number; min?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lato, setLato] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const misura = () => {
      const l = Math.min(max, el.clientWidth, el.clientHeight - 8);
      setLato(l >= 96 ? Math.floor(l) : 0);
    };
    misura();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(misura);
    ro.observe(el);
    return () => ro.disconnect();
  }, [max]);
  return (
    <div ref={ref} aria-hidden="true" data-eroe className={cn('flex flex-1 basis-0 items-center justify-center overflow-hidden', className)} style={{ minHeight: min }}>
      {lato > 0 && <Illustrazione kit={kit} nome={nome} gruppo={gruppo} lato={lato} />}
    </div>
  );
}

/** Riga di racconto (Perché farlo): icona nuda a sinistra (24 px, nel colore della fascia), frase intera 17/24, filetto sotto. Nessun riquadro. */
export function RigaStoria({ icona, testo, tono = 'azione' }: { icona: NomeIcona; testo: ReactNode; tono?: 'azione' | 'basso' | 'alto' }) {
  const colore = { azione: 'text-azione-testo', basso: 'text-basso-numero', alto: 'text-alto-numero' }[tono];
  return (
    <li className="flex items-start gap-3.5 border-b border-linea py-3 last:border-b-0">
      <Icona nome={icona} size={24} className={cn('mt-0.5', colore)} />
      <span data-testo-ok className="min-w-0 flex-1 text-[17px] leading-[24px] font-semibold text-testo">{testo}</span>
    </li>
  );
}

// Rende *corsivo* e **grassetto** nei testi del prontuario, senza HTML arbitrario
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="font-bold not-italic text-azione-testo">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
