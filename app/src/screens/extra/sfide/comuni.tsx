// Pezzi comuni alle schermate delle sfide: carta, bottoni (verbo o solo icona), campi, numeri con icona, avatar, pannello dell'esito.
// Niente frasi: l'icona dice che cosa è, il numero quanto; le regole stanno dietro la «i» (PulsanteInfo + FoglioInfo).
import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import type { Tono } from '../ui';
import { IconaTono, TONI } from '../ui';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { fraseEsito, tempoBreve, type Esito, type Risultato } from '../../../lib/sfide/risultati';

export { Pagina as PaginaBase, Sezione } from '../ui';
import { Carta as CartaBase, Pagina as PaginaUi } from '../ui';
import type { PropsPagina } from '../ui';

/** Pagina delle sfide: la pagina comune a fondo velato. */
export function Pagina(props: PropsPagina) { return <PaginaUi velata {...props} />; }

/** Card bianca del sistema (ui.tsx): `tono` solo per la card in evidenza. */
export function Carta({ children, className, tono = 'neutro' }: { children: ReactNode; className?: string; tono?: 'neutro' | Tono }) {
  return <CartaBase tono={tono} className={className}>{children}</CartaBase>;
}

const BASE_BOTTONE = 'brand-premibile w-full inline-flex min-h-[52px] items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-[16px] font-bold transition-colors duration-100 disabled:opacity-45 disabled:pointer-events-none';

/** Pulsante: SEMPRE con un verbo scritto (l'icona è facoltativa, a sinistra). Uno solo pieno per schermata. */
export function Bottone({ children, onClick, variante = 'primario', disabled, className, icona, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variante?: 'primario' | 'secondario' | 'testo'; disabled?: boolean; className?: string;
  icona?: NomeIcona; type?: 'button' | 'submit';
}) {
  const v = {
    primario: 'bg-azione text-azione-su hover:bg-azione-scuro',
    secondario: 'border border-tacca bg-superficie text-testo',
    testo: 'text-azione-testo bg-transparent',
  } as const;
  return (
    <button type={type} disabled={disabled} onClick={onClick ? () => { playTapSound(); onClick(); } : undefined} className={cn(BASE_BOTTONE, v[variante], className)}>
      {icona && <Icona nome={icona} size={20} />}{children}
    </button>
  );
}

/** Campo di testo con la sua etichetta scritta sopra (non solo il segnaposto: dopo averlo scritto l'etichetta resta). */
export function Campo({ id, etichetta, valore, onCambia, segnaposto, maxLength, errore, onInvio, icona, className }: {
  id: string; etichetta: string; valore: string; onCambia: (v: string) => void; segnaposto?: string; maxLength?: number; errore?: string | null;
  onInvio?: () => void; icona?: NomeIcona; className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] leading-[20px] font-bold text-testo">{etichetta}</label>
      <div className="relative">
        {icona && <Icona nome={icona} size={20} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue" />}
        <input id={id} value={valore} onChange={e => onCambia(e.target.value)} placeholder={segnaposto} maxLength={maxLength}
          autoComplete="off" spellCheck={false}
          onKeyDown={onInvio ? e => { if (e.key === 'Enter') onInvio(); } : undefined}
          aria-invalid={errore ? true : undefined} aria-describedby={errore ? `${id}-err` : undefined}
          className={cn('h-12 w-full min-w-0 rounded-[12px] border border-bordo-campo bg-superficie pr-4 text-[16px] font-semibold text-testo placeholder:font-normal placeholder:text-testo-tenue focus:border-azione focus:outline-none focus:ring-2 focus:ring-azione/30', icona ? 'pl-11' : 'pl-3.5')} />
      </div>
      {errore && <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 text-[13px] font-bold text-errore-testo"><Icona nome="stato-attenzione" size={15} />{errore}</p>}
    </div>
  );
}

/** I due dati di ogni sfida, scritti: «10 domande · 5 minuti» (niente icone da decifrare). */
export function DatiSfida({ domande, minuti, className }: { domande: number; minuti: number; className?: string }) {
  return (
    <p className={cn('text-[15px] leading-[21px] font-semibold text-testo', className)}>
      {domande} domande <span aria-hidden="true" className="text-testo-tenue">·</span> {minuti} {minuti === 1 ? 'minuto' : 'minuti'}
    </p>
  );
}

/** L'esito di un confronto, solo icona e colore (verde, ambra, corallo smorzato) più una parola: «Vinto», «Pari», «Perso». */
const ESITO_VISTA = {
  vinto: { nome: 'stato-vinto', tono: 'alto', parola: 'Vinto' },
  pari: { nome: 'trend-uguale', tono: 'medio', parola: 'Pari' },
  perso: { nome: 'stato-perso', tono: 'basso', parola: 'Perso' },
} as const satisfies Record<Esito, { nome: NomeIcona; tono: Tono; parola: string }>;

/** L'esito di un confronto in una pillola: icona e PAROLA («Vinto», «Pari», «Perso»), nel tono dell'esito. In scuro il fondo è neutro. */
export function PillolaEsito({ esito, className }: { esito: Esito; className?: string }) {
  const e = ESITO_VISTA[esito];
  return (
    <span className={cn('inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-[3px] text-[12px] leading-[16px] font-bold dark:bg-superficie-2', TONI[e.tono].tinta, TONI[e.tono].testo, className)}>
      <Icona nome={e.nome} size={13} />{e.parola}
    </span>
  );
}

// Toni stabili per persona: l'avatar con l'iniziale prende un tono dal nome (sempre lo stesso per la stessa persona), mai il blu,
// che è riservato a «tu». Le classi sono scritte intere perché Tailwind le trovi.
const AVATAR: readonly string[] = [
  'bg-viola-tinta text-viola-testo',
  'bg-alto-tinta text-alto-testo',
  'bg-medio-tinta text-medio-testo',
  'bg-basso-tinta text-basso-testo',
];
export function tonoAvatar(nome: string): string {
  let h = 0;
  for (const c of nome.trim().toLowerCase()) h = (h * 31 + c.charCodeAt(0)) % 9973;
  return AVATAR[h % AVATAR.length];
}

/** Cerchio con l'iniziale. `io` = tu, in blu pieno; gli altri in un tono calcolato dal nome. */
export function Avatar({ nome, grande, io }: { nome: string; grande?: boolean; io?: boolean }) {
  return (
    <span aria-hidden className={cn('rounded-full flex items-center justify-center font-extrabold shrink-0',
      grande ? 'w-14 h-14 text-[22px]' : 'w-10 h-10 text-[16px]', io ? 'bg-azione text-azione-su' : tonoAvatar(nome))}>
      {(nome.trim()[0] ?? '?').toUpperCase()}
    </span>
  );
}

/** Tempo con l'orologio ambra (il tempo è sempre ambra). */
export function Tempo({ secondi, className }: { secondi: number; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 tabular-nums', className)} aria-label={`Tempo ${tempoBreve(secondi)}`}><Icona nome="tempo" size={14} className="text-medio-numero" />{tempoBreve(secondi)}</span>;
}

function Colonna({ nome, r, io, vince }: { nome: string; r: Risultato; io?: boolean; vince: boolean }) {
  return (
    <div className={cn('min-w-0 flex-1 rounded-[14px] bg-superficie p-3 text-center border', io ? 'border-azione/60' : 'border-linea')}>
      <p className="truncate text-[13px] font-bold text-testo-tenue">{io ? `${nome} (tu)` : nome}</p>
      <p className={cn('mt-1 text-[30px] leading-[34px] font-extrabold tabular-nums', vince ? 'text-alto-numero' : 'text-testo')}>{r.corrette}<span className="text-[16px] font-bold text-testo-tenue">/{r.totale}</span></p>
      <p className="mt-1 text-[13px] font-semibold text-testo-tenue"><Tempo secondi={r.secondi} /></p>
    </div>
  );
}

/** L'illustrazione di ogni esito: vinto = coriandoli luminosi, pari = il fiocco, perso = il quiz (calmo: una sfida persa non è un fallimento, niente foglio con la croce). */
export function IlluEsito({ esito }: { esito: Esito }) {
  if (esito === 'vinto') return <Illustrazione kit="kit-luminoso" nome="celebrazione" lato={104} />;
  if (esito === 'pari') return <Illustrazione nome="celebrazione-fiocco" lato={92} />;
  return <Illustrazione nome="quiz-test" lato={96} />;
}

/** L'esito di un duello: UN blocco tinto nel tono dell'esito (verde vinto, ambra pari, corallo smorzato perso) con l'illustrazione, la frase
 *  («Hai vinto», «Pari», «Ha vinto Marta») e i due risultati affiancati (il tuo con il bordo blu, chi vince in verde). */
export function PannelloEsito({ esito, nomeMio, io, nomeAltro, altro, className }: {
  esito: Esito; nomeMio: string; io: Risultato; nomeAltro: string; altro: Risultato; className?: string;
}) {
  const e = ESITO_VISTA[esito];
  return (
    <Carta tono={e.tono} className={cn('flex flex-col items-center', className)}>
      <IlluEsito esito={esito} />
      <p role="status" className="mt-2 text-center text-[24px] leading-[30px] font-extrabold tracking-[-0.01em] text-testo">{fraseEsito(esito, nomeAltro)}</p>
      <div className="mt-3.5 flex w-full gap-2.5">
        <Colonna nome={nomeMio} r={io} io vince={esito === 'vinto'} />
        <Colonna nome={nomeAltro} r={altro} vince={esito === 'perso'} />
      </div>
    </Carta>
  );
}

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
/** «12 ott» */
export function dataBreve(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${MESI[d.getMonth()]}`;
}

/** Stato che ferma la strada, lo stesso di tutta l'app: illustrazione dell'area (96 px, mai una faccia triste), titolo 20/700 senza punto, UNA riga di causa
 *  sempre visibile, azioni con un verbo (una sola piena). */
export function Fermo({ illustrazione, titolo, causa, children }: {
  illustrazione?: { nome: string; kit?: 'kit-blu' | 'kit-luminoso'; lato?: number }; titolo: string; causa?: string; children?: ReactNode;
}) {
  return (
    <div role="status" className="mt-10 flex flex-col items-center text-center">
      {illustrazione && <Illustrazione nome={illustrazione.nome} kit={illustrazione.kit} lato={illustrazione.lato ?? 96} />}
      <h2 className={cn('text-[20px] leading-[26px] font-bold text-testo', illustrazione && 'mt-4')}>{titolo}</h2>
      {causa && <p data-testo-ok className="mt-1.5 max-w-[32ch] text-[15px] leading-[21px] text-testo-tenue">{causa}</p>}
      {children && <div className="mt-6 flex w-full flex-col gap-2.5">{children}</div>}
    </div>
  );
}

export { tempoBreve };
export type { Risultato };
