// Pezzi comuni alle schermate delle sfide: pagina con intestazione, schede Sfide/Classifica/Amici, carte, bottoni, tema.
import { useEffect, useState, type ReactNode } from 'react';
import { Clock, Equal, Swords, Trophy } from 'lucide-react';
import { useExtra } from '../contesto';
import type { Tono } from '../ui';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { FONT } from '../../../brand/tokens';
import { confronta, tempoBreve, type Esito, type Risultato } from '../../../lib/sfide/risultati';

export function useScuro(): boolean {
  const [scuro, setScuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const o = new MutationObserver(() => setScuro(document.documentElement.classList.contains('dark')));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => o.disconnect();
  }, []);
  return scuro;
}

export { Pagina } from '../ui';

const SCHEDE = [['sfide', 'Sfide'], ['classifica', 'Classifica'], ['amici', 'Amici']] as const;

/** Le tre schede del concept (Sfide, Classifica, Amici): pillole, quella aperta in blu pieno. Sono tre schermate: toccarne una la apre. */
export function SchedeSfide({ attiva }: { attiva: 'sfide' | 'classifica' | 'amici' }) {
  const { vai } = useExtra();
  return (
    <nav aria-label="Sezioni delle sfide" className="mt-4 flex gap-2">
      {SCHEDE.map(([id, nome]) => {
        const on = id === attiva;
        return (
          <button key={id} type="button" aria-current={on ? 'page' : undefined} onClick={() => { if (!on) { playTapSound(); vai(id); } }}
            className={cn('flex-1 rounded-full py-2.5 text-[13.5px] font-bold transition-colors duration-100',
              on ? 'bg-azione text-azione-su' : 'bg-superficie-2 text-testo-tenue hover:text-testo')}>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}

export { Sezione } from '../ui';

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
export function Bottone({ children, onClick, variante = 'primario', disabled, className, type = 'button' }: {
  children: ReactNode; onClick?: () => void; variante?: 'primario' | 'secondario' | 'testo'; disabled?: boolean; className?: string; type?: 'button' | 'submit';
}) {
  const v = {
    primario: 'bg-azione text-azione-su hover:bg-azione-scuro',
    secondario: 'border border-azione text-azione-scuro bg-superficie',
    testo: 'text-azione-scuro bg-transparent',
  } as const;
  return (
    <button type={type} disabled={disabled} onClick={onClick ? () => { playTapSound(); onClick(); } : undefined} className={cn(BASE_BOTTONE, v[variante], className)}>
      {children}
    </button>
  );
}

export function Campo({ id, etichetta, valore, onCambia, segnaposto, maxLength, errore, onInvio }: {
  id: string; etichetta: string; valore: string; onCambia: (v: string) => void; segnaposto?: string; maxLength?: number; errore?: string | null; onInvio?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-testo-tenue">{etichetta}</label>
      <input id={id} value={valore} onChange={e => onCambia(e.target.value)} placeholder={segnaposto} maxLength={maxLength}
        autoComplete="off" spellCheck={false}
        onKeyDown={onInvio ? e => { if (e.key === 'Enter') onInvio(); } : undefined}
        aria-invalid={errore ? true : undefined} aria-describedby={errore ? `${id}-err` : undefined}
        className="min-w-0 rounded-2xl border border-linea bg-superficie px-4 py-3 text-[15px] font-semibold text-testo placeholder:text-testo-tenue placeholder:font-medium focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30" />
      {errore && <p id={`${id}-err`} role="alert" className="text-[13px] font-bold text-basso-testo">{errore}</p>}
    </div>
  );
}

/** «Vinto», «Pari», «Perso»: parola e colore (verde, ambra, corallo smorzato), mai solo il colore. */
export function EtichettaEsito({ esito }: { esito: Esito }) {
  const m = {
    vinto: ['Vinto', 'bg-alto-tinta text-alto-testo border-alto/30'],
    pari: ['Pari', 'bg-medio-tinta text-medio-testo border-medio/30'],
    perso: ['Perso', 'bg-basso-tinta text-basso-testo border-basso/30'],
  } as const;
  return <span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-[12px] font-bold', m[esito][1])}>{m[esito][0]}</span>;
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
  return <span className={cn('inline-flex items-center gap-1 tabular-nums', className)}><Clock size={13} className="text-medio-numero" aria-hidden /> {tempoBreve(secondi)}</span>;
}

function Colonna({ nome, r, io }: { nome: string; r: Risultato; io?: boolean }) {
  return (
    <div className={cn('min-w-0 flex-1 rounded-[14px] bg-superficie p-3 text-center border', io ? 'border-azione/50' : 'border-linea')}>
      <p className="truncate text-[13px] font-bold text-testo-tenue">{nome}</p>
      <p className="mt-1 text-[30px] leading-[34px] font-extrabold tabular-nums text-testo">{r.corrette}<span className="text-[16px] font-bold text-testo-tenue">/{r.totale}</span></p>
      <p className="mt-1 text-[13px] font-semibold text-testo-tenue"><Tempo secondi={r.secondi} /></p>
    </div>
  );
}

/** La frase dell'esito, con il punteggio: «Hai vinto 8 a 6», «Hai perso 6 a 8», «Pari, 7 a 7». Chi perde non è un errore: nessun rosso allarmista. */
export function fraseConPunteggio(esito: Esito, io: Risultato, altro: Risultato): { titolo: string; nota: string | null } {
  const stesse = io.corrette === altro.corrette;
  const nota = stesse && esito !== 'pari' ? 'Stesso numero di risposte giuste: ha deciso il tempo.' : null;
  if (esito === 'pari') return { titolo: `Pari, ${io.corrette} a ${altro.corrette}`, nota: 'Stesse risposte giuste e stesso tempo.' };
  if (esito === 'vinto') return { titolo: stesse ? 'Hai vinto per tempo' : `Hai vinto ${io.corrette} a ${altro.corrette}`, nota };
  return { titolo: stesse ? 'Hai perso per tempo' : `Hai perso ${io.corrette} a ${altro.corrette}`, nota };
}

const ESITO_TONO = {
  vinto: { tono: 'alto', Icona: Trophy },
  pari: { tono: 'medio', Icona: Equal },
  perso: { tono: 'basso', Icona: Swords },
} as const;

/** L'esito di un duello: UN blocco tinto nel tono dell'esito (verde vinto, ambra pari, corallo smorzato perso) con la frase,
 *  e i due risultati affiancati (il tuo con il bordo blu). Lo usano il risultato e la risposta di un amico. */
export function PannelloEsito({ esito, nomeMio, io, nomeAltro, altro, className }: {
  esito: Esito; nomeMio: string; io: Risultato; nomeAltro: string; altro: Risultato; className?: string;
}) {
  const { tono, Icona } = ESITO_TONO[esito];
  const { titolo, nota } = fraseConPunteggio(esito, io, altro);
  return (
    <Carta tono={tono} className={className}>
      <div className="flex items-center gap-3" role="status">
        <span aria-hidden className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-superficie', TONI_ICONA[tono])}><Icona size={22} /></span>
        <div className="min-w-0">
          <p className="text-[22px] leading-[28px] font-extrabold tracking-[-0.01em] text-testo">{titolo}</p>
          {nota && <p className="text-[13px] leading-[18px] text-testo-tenue">{nota}</p>}
        </div>
      </div>
      <div className="mt-3.5 flex gap-2.5">
        <Colonna nome={`${nomeMio} (tu)`} r={io} io />
        <Colonna nome={nomeAltro} r={altro} />
      </div>
    </Carta>
  );
}
const TONI_ICONA = { alto: 'text-alto-numero', medio: 'text-medio-numero', basso: 'text-basso-numero' } as const;

export { confronta, tempoBreve };
export type { Risultato };

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
/** «12 ott» */
export function dataBreve(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${MESI[d.getMonth()]}`;
}
/** «lunedì 12 ottobre» */
export function dataLunga(d: Date = new Date()): string {
  const t = d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
  return t.charAt(0).toUpperCase() + t.slice(1);
}
