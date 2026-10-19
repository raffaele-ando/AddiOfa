// Mattoncini comuni a TUTTE le schermate extra: una sola impostazione di pagina, intestazione e sezione, così profilo, sfide,
// studio e servizi hanno la stessa gerarchia e lo stesso posto per i comandi.
// Scala tipografica a tre livelli: titolo di pagina 26/800; titolo di sezione 17/700; testo 15 (titolo di riga 15/600, secondario 13); mai sotto 12.
// Regole: la freccia indietro sta sulla stessa riga del titolo; a destra del titolo solo un comando piccolo (ingranaggio, info),
// mai un'illustrazione o un'icona decorativa; il sottotitolo è una frase sola; la barra in basso la mette l'App.
// Superfici (revisione 18/10): la pagina `velata` ha il fondo velato (`fondo`) e le card sono bianche (`Carta`: superficie, bordo, ombra leggera
// in chiaro; in scuro solo il bordo, niente ombra). Raggi: card 16, tessere interne 12, pulsanti 14, pillole tonde.
// Icone e illustrazioni: icone a tratto per azioni, righe e metadati; illustrazioni solo per gli stati vuoto/errore (96-120 px) e per la testata di Community.
import { useEffect, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
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
  /** Fondo velato (`fondo`) con card bianche (`Carta`): il sistema nuovo. Senza, il fondo resta bianco (schermate di altri). */
  velata?: boolean;
  /** Piè di pagina fisso (il pulsante principale di un modulo): non scorre. */
  piede?: ReactNode;
  children: ReactNode;
}

/** Pagina a scorrimento: colonna centrata, intestazione con freccia indietro e titolo sulla stessa riga. */
export function Pagina({ titolo, sottotitolo, onBack, destra, velata, piede, children }: PropsPagina) {
  return (
    <div className={cn('h-full w-full text-testo overflow-hidden flex flex-col', velata ? 'bg-fondo' : 'bg-superficie')} style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          <header className="flex items-start gap-1">
            {onBack && (
              <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
                className="brand-premibile -ml-3 grid h-11 w-11 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
                <Icona nome="indietro" size={28} />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-[26px] leading-[44px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
              {sottotitolo && <p data-testo-ok className="-mt-1 text-[15px] leading-[21px] text-testo-tenue">{sottotitolo}</p>}
            </div>
            {destra && <div className="shrink-0 pt-0.5">{destra}</div>}
          </header>
          {children}
        </div>
      </div>
      {piede && (
        <div className={cn('shrink-0 border-t border-linea px-6 pt-3 pb-[max(14px,env(safe-area-inset-bottom))]', velata ? 'bg-fondo' : 'bg-superficie')}>
          <div className="mx-auto w-full max-w-[440px]">{piede}</div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
// Colore con significato (teoria dei colori dei concept): il blu è l'azione e lo studio; il verde è ciò che è riuscito
// (obiettivi, accuratezza, superato); l'ambra è sforzo e premio (giorni di studio, tempo, trofei); il corallo è il confronto
// e il rischio (duelli, da ripassare; l'errore vero è un'altra tinta: errore*); il viola è apprendimento e traguardi (badge, quiz). Un solo colore per significato, mai
// a caso: i toni non si mescolano nella stessa riga. Il testo grande resta navy: il colore sta in icone, barre e numeri chiave.
export type Tono = 'azione' | 'alto' | 'medio' | 'basso' | 'viola';

/** Classi complete (Tailwind le trova come testo): tinta di fondo, icona, testo di accento leggibile, barra piena, fondo di pulsante col suo testo (`*-su`: sopra l'ambra mai il bianco). Nella barra l'ambra è medio-numero: l'ambra chiara da sola non arriva a 3:1. */
export const TONI: Record<Tono, { tinta: string; icona: string; testo: string; barra: string; pieno: string; bordo: string }> = {
  azione: { tinta: 'bg-azione-tinta', icona: 'text-azione-testo', testo: 'text-azione-testo', barra: 'bg-azione', pieno: 'bg-azione text-azione-su', bordo: 'border-azione/30' },
  alto: { tinta: 'bg-alto-tinta', icona: 'text-alto-numero', testo: 'text-alto-testo', barra: 'bg-alto', pieno: 'bg-alto-pieno text-alto-su', bordo: 'border-alto/30' },
  medio: { tinta: 'bg-medio-tinta', icona: 'text-medio-numero', testo: 'text-medio-testo', barra: 'bg-medio-numero', pieno: 'bg-medio-pieno text-medio-su', bordo: 'border-medio/30' },
  basso: { tinta: 'bg-basso-tinta', icona: 'text-basso-numero', testo: 'text-basso-testo', barra: 'bg-basso', pieno: 'bg-basso-pieno text-basso-su', bordo: 'border-basso/30' },
  viola: { tinta: 'bg-viola-tinta', icona: 'text-viola', testo: 'text-viola-testo', barra: 'bg-viola', pieno: 'bg-viola-pieno text-viola-su', bordo: 'border-viola/30' },
};

/** Card bianca (superficie, bordo, ombra leggera in chiaro; in scuro solo il bordo). `tono` colora lo sfondo solo per la card in evidenza della
 *  schermata (di norma una): in chiaro la tinta, in scuro la superficie con il bordo nel colore (niente fondi marrone, palude o melanzana). */
export function Carta({ children, className, tono = 'neutro', as: Tag = 'div' }: {
  children: ReactNode; className?: string; tono?: 'neutro' | Tono; as?: 'div' | 'section' | 'li';
}) {
  const stile = {
    neutro: 'border-linea bg-superficie',
    azione: 'border-azione/25 bg-azione-tinta dark:bg-superficie dark:border-azione/45',
    alto: 'border-alto/30 bg-alto-tinta dark:bg-superficie dark:border-alto/45',
    medio: 'border-medio/40 bg-medio-tinta dark:bg-superficie dark:border-medio/45',
    basso: 'border-basso/30 bg-basso-tinta dark:bg-superficie dark:border-basso/45',
    viola: 'border-viola/30 bg-viola-tinta dark:bg-superficie dark:border-viola/45',
  } as const;
  return <Tag className={cn('rounded-[16px] border p-4 shadow-sm dark:shadow-none', stile[tono], className)}>{children}</Tag>;
}

/** Titolo di sezione 17/700, con a destra un'azione scritta («Vedi tutti») o un'indicazione breve. */
export function TitoloSezione({ id, children, azione, destra }: { id?: string; children: ReactNode; azione?: { testo: string; onClick: () => void }; destra?: ReactNode }) {
  return (
    <div className="flex min-h-[28px] items-center justify-between gap-3">
      <h2 id={id} className="text-[17px] leading-[24px] font-bold text-testo">{children}</h2>
      {azione ? (
        <button type="button" onClick={() => { playTapSound(); azione.onClick(); }}
          className="brand-premibile -my-2 -mr-2 inline-flex min-h-[44px] items-center gap-0.5 rounded-[10px] px-2 text-[14px] font-bold text-azione-testo">
          {azione.testo}<Icona nome="avanti" size={16} />
        </button>
      ) : destra}
    </div>
  );
}

/** Sezione con titolo e, se serve, un'azione scritta o un'indicazione breve a destra. Blocchi a 12 px, sezioni a 28 px. */
export function Sezione({ id, titolo, destra, azione, children, className }: { id: string; titolo: string; destra?: ReactNode; azione?: { testo: string; onClick: () => void }; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('mt-7 flex flex-col gap-3', className)}>
      <TitoloSezione id={id} azione={azione} destra={destra}>{titolo}</TitoloSezione>
      {children}
    </section>
  );
}

/** Tessera quadrata con l'icona, nel tono scelto. In chiaro la tinta del tono; in scuro un fondo neutro (le tinte scure attorno alle icone
 *  sembravano buchi), con l'icona nel colore del tono. */
export function IconaTono({ tono, children, lato = 40, className }: { tono: Tono; children: ReactNode; lato?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('grid shrink-0 place-items-center rounded-[12px] dark:bg-superficie-2', TONI[tono].tinta, TONI[tono].icona, className)} style={{ width: lato, height: lato }}>
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
// Controlli: UN solo segmentato, UN solo filtro a chip, UNA sola riga di lista. Sempre con le parole (l'icona è facoltativa).

/** Controllo segmentato con le parole (13-14 px, 600): traccia incavata, voce scelta sollevata (bianca in chiaro, più chiara della traccia in scuro)
 *  con il testo `azione`. Da 2 a 4 voci. L'icona a sinistra è facoltativa. */
export function Segmenti<T extends string>({ nome, voci, valore, onScegli, className }: {
  nome: string; voci: { id: T; nome: string; icona?: NomeIcona; conto?: ReactNode }[]; valore: T; onScegli: (v: T) => void; className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className={cn('grid gap-1 rounded-[14px] border border-linea bg-superficie-2 p-1 dark:bg-fondo', className)}
      style={{ gridTemplateColumns: `repeat(${voci.length}, minmax(0, 1fr))` }}>
      {voci.map(v => {
        const on = v.id === valore;
        return (
          <button key={v.id} type="button" role="radio" aria-checked={on} onClick={() => { if (!on) { playTapSound(); onScegli(v.id); } }}
            className={cn('brand-premibile flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-[10px] px-1.5 text-[14px] leading-[18px] transition-colors duration-100',
              on ? 'bg-superficie font-bold text-azione-testo shadow-sm dark:bg-superficie-2 dark:shadow-none' : 'font-semibold text-testo-tenue')}>
            {v.icona && <Icona nome={v.icona} size={18} className="shrink-0" />}
            <span className="truncate">{v.nome}</span>
            {v.conto !== undefined && <span className="shrink-0 text-[12px] font-semibold tabular-nums opacity-80">{v.conto}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Filtri a chip con le parole, in una riga che scorre di lato (40 px di altezza, tutti uguali). Il chip scelto è blu tenue con bordo azione. */
export function FiltriChip<T extends string>({ nome, voci, valore, onScegli, className }: {
  nome: string; voci: { id: T; nome: string; conto?: ReactNode }[]; valore: T; onScegli: (v: T) => void; className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={nome} className={cn('-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 scrollbar-hide', className)}>
      {voci.map(v => {
        const on = v.id === valore;
        return (
          <button key={v.id} type="button" role="radio" aria-checked={on} onClick={() => { playTapSound(); onScegli(v.id); }}
            className={cn('brand-premibile inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-semibold',
              on ? 'border-azione bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo')}>
            {v.nome}{v.conto !== undefined && <span className="text-[12px] tabular-nums text-testo-tenue">{v.conto}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Gruppo di righe: UNA card con filetti che iniziano dopo la tessera (56 px). */
export function GruppoRighe({ children, etichetta, className }: { children: ReactNode; etichetta: string; className?: string }) {
  return (
    <section aria-label={etichetta} className={cn('overflow-hidden rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none', className)}>
      <ul className="flex flex-col">{children}</ul>
    </section>
  );
}

/** Riga di lista: tessera 40 px (raggio 12) con l'icona a tratto 22 px, titolo 15/600, sottotitolo 13 tenue, a destra un valore o la freccia.
 *  Minimo 56 px; il filetto fra le righe parte dopo la tessera. Niente illustrazioni nelle righe. */
export function Riga({ icona, tono, titolo, sottotitolo, destra, onClick, className }: {
  icona?: NomeIcona; tono?: Tono; titolo: ReactNode; sottotitolo?: ReactNode; destra?: ReactNode; onClick?: () => void; className?: string;
}) {
  const corpo = (
    <>
      {icona && (tono
        ? <IconaTono tono={tono} lato={40}><Icona nome={icona} size={22} /></IconaTono>
        : <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-superficie-2 text-testo-tenue"><Icona nome={icona} size={22} /></span>)}
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-[21px] font-semibold text-testo">{titolo}</span>
        {sottotitolo && <span className="block text-[13px] leading-[18px] text-testo-tenue">{sottotitolo}</span>}
      </span>
      {destra}
      {onClick && !destra && <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />}
    </>
  );
  const base = 'flex w-full min-h-[56px] items-center gap-3 px-3.5 py-2 text-left';
  // filetto che parte dopo la tessera
  const filetto = 'relative [&:not(:first-child)]:before:absolute [&:not(:first-child)]:before:left-[66px] [&:not(:first-child)]:before:right-0 [&:not(:first-child)]:before:top-0 [&:not(:first-child)]:before:h-px [&:not(:first-child)]:before:bg-linea';
  return (
    <li className={cn(filetto, className)}>
      {onClick
        ? <button type="button" onClick={() => { playTapSound(); onClick(); }} className={cn('brand-premibile', base)}>{corpo}</button>
        : <div className={base}>{corpo}</div>}
    </li>
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

/** Pulsante tondo «i»: le spiegazioni lunghe non stanno scritte in pagina, si aprono qui (foglio). Area di tocco 44 px. */
export function PulsanteInfo({ onClick, etichetta = 'Informazioni', className }: { onClick: () => void; etichetta?: string; className?: string }) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }} aria-label={etichetta}
      className={cn('brand-premibile grid h-11 w-11 place-items-center rounded-full text-testo-tenue hover:text-testo', className)}>
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
      <div role="dialog" aria-modal="true" aria-label={titolo} className="max-h-[80%] w-full overflow-y-auto rounded-t-[24px] border-t border-linea bg-superficie p-6 pb-8 text-testo shadow-xl dark:shadow-none">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-[18px] leading-[24px] font-extrabold">{titolo}</h2>
          <button type="button" onClick={onChiudi} aria-label="Chiudi" className="brand-premibile grid h-11 w-11 place-items-center rounded-full bg-superficie-2 text-testo"><Icona nome="chiudi" size={20} /></button>
        </div>
        <div className="text-[14.5px] leading-[21px] text-testo">{children}</div>
      </div>
    </div>
  );
}
