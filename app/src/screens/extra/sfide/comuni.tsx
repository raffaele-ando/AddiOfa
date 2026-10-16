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

export { Pagina, Sezione } from '../ui';

export function Carta({ children, className, tono = 'neutro' }: { children: ReactNode; className?: string; tono?: 'neutro' | Tono }) {
  const toni = {
    neutro: 'bg-superficie-2 border-linea',
    azione: 'bg-azione-tinta border-azione/25',
    alto: 'bg-alto-tinta border-alto/25',
    medio: 'bg-medio-tinta border-medio/30',
    basso: 'bg-basso-tinta border-basso/25',
    viola: 'bg-viola-tinta border-viola/25',
  } as const;
  return <div className={cn('rounded-[16px] border p-4', toni[tono], className)}>{children}</div>;
}

const BASE_BOTTONE = 'brand-premibile w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 text-[15px] font-bold transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none';

/** Pulsante: un verbo, oppure solo l'icona (con `aria` che dice cosa fa). Uno solo pieno per schermata. */
export function Bottone({ children, onClick, variante = 'primario', disabled, className, icona, aria, type = 'button' }: {
  children?: ReactNode; onClick?: () => void; variante?: 'primario' | 'secondario' | 'testo'; disabled?: boolean; className?: string;
  icona?: NomeIcona; aria?: string; type?: 'button' | 'submit';
}) {
  const v = {
    primario: 'bg-azione text-azione-su hover:bg-azione-scuro',
    secondario: 'border border-azione text-azione-scuro bg-superficie',
    testo: 'text-azione-scuro bg-transparent',
  } as const;
  return (
    <button type={type} disabled={disabled} aria-label={aria} onClick={onClick ? () => { playTapSound(); onClick(); } : undefined} className={cn(BASE_BOTTONE, v[variante], className)}>
      {icona && <Icona nome={icona} size={children ? 20 : 26} />}{children}
    </button>
  );
}

/** Campo di testo senza etichetta in pagina: il segnaposto e l'icona dicono cosa scrivere (`aria` per chi non vede). */
export function Campo({ id, aria, valore, onCambia, segnaposto, maxLength, errore, onInvio, icona, className }: {
  id: string; aria: string; valore: string; onCambia: (v: string) => void; segnaposto?: string; maxLength?: number; errore?: string | null;
  onInvio?: () => void; icona?: NomeIcona; className?: string;
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <div className="relative">
        {icona && <Icona nome={icona} size={20} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue" />}
        <input id={id} value={valore} onChange={e => onCambia(e.target.value)} placeholder={segnaposto} maxLength={maxLength} aria-label={aria}
          autoComplete="off" spellCheck={false}
          onKeyDown={onInvio ? e => { if (e.key === 'Enter') onInvio(); } : undefined}
          aria-invalid={errore ? true : undefined} aria-describedby={errore ? `${id}-err` : undefined}
          className={cn('w-full min-w-0 rounded-2xl border border-linea bg-superficie py-3 pr-4 text-[15px] font-semibold text-testo placeholder:text-testo-tenue placeholder:font-medium focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30', icona ? 'pl-11' : 'pl-4')} />
      </div>
      {errore && <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 text-[13px] font-bold text-basso-testo"><Icona nome="stato-attenzione" size={15} />{errore}</p>}
    </div>
  );
}

/** Icona in tessera e numero accanto: «10» con le domande, «5 min» con il tempo. Sostituisce le frasi. */
export function Dato({ icona, tono, valore, aria, unita, className }: { icona: NomeIcona; tono: Tono; valore: ReactNode; aria: string; unita?: string; className?: string }) {
  return (
    <span role="group" aria-label={aria} className={cn('inline-flex items-center gap-2', className)}>
      <IconaTono tono={tono} lato={34} className="rounded-full bg-superficie"><Icona nome={icona} size={18} /></IconaTono>
      <span aria-hidden className="text-[19px] leading-[22px] font-extrabold tabular-nums text-testo">{valore}{unita && <span className="ml-0.5 text-[12.5px] font-bold text-testo-tenue">{unita}</span>}</span>
    </span>
  );
}

/** I due dati di ogni sfida: le domande e il tempo. */
export function DatiSfida({ domande, minuti, className }: { domande: number; minuti: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <Dato icona="risposte" tono="azione" valore={domande} aria={`${domande} domande`} />
      <Dato icona="tempo" tono="medio" valore={minuti} unita="min" aria={`${minuti} minuti`} />
    </div>
  );
}

/** L'esito di un confronto, solo icona e colore (verde, ambra, corallo smorzato) più una parola: «Vinto», «Pari», «Perso». */
const ESITO_VISTA = {
  vinto: { nome: 'stato-vinto', tono: 'alto', parola: 'Vinto' },
  pari: { nome: 'trend-uguale', tono: 'medio', parola: 'Pari' },
  perso: { nome: 'stato-perso', tono: 'basso', parola: 'Perso' },
} as const satisfies Record<Esito, { nome: NomeIcona; tono: Tono; parola: string }>;

/** Icona tonda dell'esito (nelle righe di elenco): niente parola, `aria-label` con la parola. */
export function IconaEsito({ esito, lato = 34 }: { esito: Esito; lato?: number }) {
  const e = ESITO_VISTA[esito];
  return (
    <span role="img" aria-label={e.parola} className={cn('grid shrink-0 place-items-center rounded-full', TONI[e.tono].tinta, TONI[e.tono].icona)} style={{ width: lato, height: lato }}>
      <Icona nome={e.nome} size={Math.round(lato * 0.52)} />
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
    <div className={cn('min-w-0 flex-1 rounded-[14px] bg-superficie p-3 text-center border', io ? 'border-azione/50' : 'border-linea')}>
      <p className="truncate text-[13px] font-bold text-testo-tenue">{nome}</p>
      <p className={cn('mt-1 text-[30px] leading-[34px] font-extrabold tabular-nums', vince ? 'text-alto-numero' : 'text-testo')}>{r.corrette}<span className="text-[16px] font-bold text-testo-tenue">/{r.totale}</span></p>
      <p className="mt-1 text-[13px] font-semibold text-testo-tenue"><Tempo secondi={r.secondi} /></p>
    </div>
  );
}

/** L'illustrazione di ogni esito (piano d'uso, docs/design/ILLUSTRAZIONI.md §3.2): vinto = coriandoli luminosi, pari = piccolo traguardo (il fiocco),
 *  perso = il foglio con la croce (piatto, più piccolo). Una per esito, mai le stesse per altro. */
export function IlluEsito({ esito }: { esito: Esito }) {
  if (esito === 'vinto') return <Illustrazione kit="kit-luminoso" nome="celebrazione" lato={104} />;
  if (esito === 'pari') return <Illustrazione nome="celebrazione-fiocco" lato={92} />;
  return <Illustrazione nome="mancato-superamento" lato={112} />;
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

/** Stato che ferma la strada: un'illustrazione degli stati (o, se non ce n'è una adatta, l'icona grande nel tono), al massimo una riga corta
 *  (≤ 8 parole), poi le azioni (uno solo pieno). */
export function Fermo({ icona, tono, testo, illustrazione, children }: {
  icona?: NomeIcona; tono: Tono; testo?: string; illustrazione?: { nome: string; kit?: 'kit-blu' | 'kit-luminoso'; lato?: number }; children?: ReactNode;
}) {
  return (
    <div className="mt-8 flex flex-col items-center text-center">
      {illustrazione
        ? <Illustrazione nome={illustrazione.nome} kit={illustrazione.kit} lato={illustrazione.lato ?? 120} />
        : icona && <IconaTono tono={tono} lato={72} className="rounded-full"><Icona nome={icona} size={34} /></IconaTono>}
      {testo && <p role="status" className="mt-3 max-w-[30ch] text-[15px] leading-[21px] font-bold text-testo">{testo}</p>}
      {children && <div className="mt-6 flex w-full flex-col gap-2">{children}</div>}
    </div>
  );
}

export { tempoBreve };
export type { Risultato };
