// Pezzi delle scelte facoltative, usati da «Project ID» e da NOI: «Cosa fai al Poli» (scelta a cascata, un tocco per schermata), «Come ci hai conosciuto?»,
// il campo email e la casella di consenso. Niente di tutto questo compare all'avvio: si arriva qui solo aprendo la schermata, e ogni scelta si può saltare.
// Regole delle caselle (docs/design/PRIVACY-LEGGE.md §4): mai preselezionate, una per finalità, sempre con informativa breve e revoca con un tocco.
import { useId, useMemo, useState, type ReactNode } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { PROVENIENZE } from '../../../lib/progetto/corsi';
import {
  briciole, CORSI_PER_RICERCA, esitoPercorso, filtraCorsi, risolvi, scegli, torna,
  type EsitoPercorso, type FonteCorsi, type PassoPercorso, type ScelteCorso,
} from '../../../lib/progetto/percorso';
import { fonteCorsi } from '../../../lib/progetto/percorsoDati';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { Profilo } from '../../../lib/progetto/profilo';

/** Le scelte della cascata come stanno nel profilo (per riaprirla da dove si era). */
export function scelteDa(p?: Profilo): ScelteCorso {
  return {
    ...(p?.scuola ? { scuola: p.scuola } : {}), ...(p?.sede ? { sede: p.sede } : {}), ...(p?.livello ? { livello: p.livello } : {}),
    ...(p?.corsoId ? { corso: p.corsoId } : {}), ...(p?.anno ? { anno: p.anno } : {}),
  };
}

/** I campi del percorso da salvare: completi se la cascata è finita, altrimenti solo quelli già scelti. */
export function campiPercorso(s: ScelteCorso, fonte: FonteCorsi = fonteCorsi): { scuola?: string; sede?: string; livello?: string; corso?: string; corsoId?: string; anno?: number } {
  const e = esitoPercorso(s, fonte);
  if (e) return { scuola: e.scuola, sede: e.sede, livello: e.livello, corso: e.corso, corsoId: e.corsoId, anno: e.anno };
  const r = risolvi(s, fonte).scelte;
  return { scuola: r.scuola, sede: r.sede, livello: r.livello };
}

export const CAMPO = 'w-full rounded-[12px] border border-bordo-campo bg-superficie-2 px-3.5 py-3 text-[16px] leading-[22px] text-testo placeholder:text-testo-tenue focus:outline focus:outline-2 focus:outline-azione';

/** Etichetta, campo e riga d'errore (in `errore-testo`, con il testo: mai solo colore). */
export function Campo({ id, etichetta, destra, errore, children }: { id: string; etichetta: string; destra?: ReactNode; errore?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-testo">{etichetta}</label>
        {destra}
      </div>
      {children}
      {errore && <p id={`${id}-errore`} role="alert" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-errore-testo">{errore}</p>}
    </div>
  );
}

/** Campo email: scrive il valore così com'è, il controllo lo fa chi lo usa. */
export function CampoEmail({ etichetta, valore, onChange, errore, placeholder = 'nome@esempio.it' }: { etichetta: string; valore: string; onChange: (v: string) => void; errore?: string; placeholder?: string }) {
  const id = useId();
  return (
    <Campo id={id} etichetta={etichetta} errore={errore}>
      <input id={id} type="email" inputMode="email" value={valore} maxLength={254} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="done"
        placeholder={placeholder} aria-invalid={!!errore} aria-describedby={errore ? `${id}-errore` : undefined}
        onChange={ev => onChange(ev.target.value)} className={CAMPO} />
    </Campo>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Cosa fai al Poli

/** Un'illustrazione piana del kit blu per scuola (non ce n'è una dedicata a ciascuna: le più vicine al tema, vedi la nota di consegna). Nessuno sfondo tondo. */
const ARTE_SCUOLA: Record<string, string> = { 'ing-ind-inf': 'progressi-statistiche', icat: 'mondo-internazionale', auic: 'studio-inglese', design: 'suggerimenti-consigli' };

const TITOLO_PASSO: Record<PassoPercorso, string> = { scuola: 'La tua scuola', sede: 'La sede', livello: 'Il livello', corso: 'Il tuo corso', anno: 'Che anno?' };

/**
 * «Cosa fai al Poli»: scuola → sede → livello → corso → anno, una scelta per schermata, il tocco avanza da solo. In alto le scelte già fatte come briciole:
 * toccandone una si torna a quel passo. I passi con una sola scelta si saltano (la briciola resta, ferma). Quando il percorso è completo chiama `onFine`.
 * Se arriva già completo mostra il riepilogo e `fine`.
 */
export function PassoPercorso({ scelte, onChange, onFine, fonte = fonteCorsi, fine }: {
  scelte: ScelteCorso; onChange: (s: ScelteCorso) => void; onFine: (esito: EsitoPercorso) => void; fonte?: FonteCorsi;
  /** Cosa mostrare quando il percorso è completo (di solito il pulsante «Fatto»). */
  fine?: ReactNode;
}) {
  const stato = useMemo(() => risolvi(scelte, fonte), [scelte, fonte]);
  const [ricerca, setRicerca] = useState('');
  const crumbs = briciole(stato.scelte, stato.automatici, fonte);

  const scelto = (passo: PassoPercorso, idOpzione: string) => {
    playTapSound();
    const nuove = risolvi(scegli(stato.scelte, passo, idOpzione), fonte);
    setRicerca('');
    onChange(nuove.scelte);
    if (nuove.passo === null) {
      const e = esitoPercorso(nuove.scelte, fonte);
      if (e) onFine(e);
    }
  };

  const opzioni = stato.opzioni;
  const corsi = stato.passo === 'corso' ? filtraCorsi(opzioni, ricerca) : opzioni;
  const conRicerca = stato.passo === 'corso' && opzioni.length - 1 > CORSI_PER_RICERCA; // «Altro» non conta

  return (
    <div className="flex flex-col gap-4">
      {crumbs.length > 0 && (
        <nav aria-label="Scelte fatte" className="flex flex-wrap gap-1.5">
          {crumbs.map(c => c.automatica ? (
            <span key={c.passo} className="inline-flex max-w-full items-center rounded-full bg-superficie-2 px-3 py-1.5 text-[13px] font-bold text-testo-tenue"><span className="truncate">{c.nome}</span></span>
          ) : (
            <button key={c.passo} type="button" onClick={() => { playTapSound(); onChange(torna(stato.scelte, c.passo)); setRicerca(''); }} aria-label={`Cambia: ${c.nome}`}
              className="brand-premibile inline-flex max-w-full items-center gap-1.5 rounded-full bg-azione-tinta px-3 py-1.5 text-[13px] font-bold text-azione-testo">
              <span className="truncate">{c.nome}</span><Icona nome="modifica" size={13} className="shrink-0" />
            </button>
          ))}
        </nav>
      )}

      {stato.passo === null ? (
        <div className="flex flex-col gap-3">
          <p role="status" data-testo-ok className="text-[15px] font-bold text-testo">Percorso scelto</p>
          {fine}
        </div>
      ) : (
        <>
          <h2 data-testo-ok className="text-2xl sm:text-3xl font-bold text-testo">{TITOLO_PASSO[stato.passo]}</h2>
          {conRicerca && (
            <div className="flex items-center gap-2 rounded-[12px] border border-bordo-campo bg-superficie-2 px-3.5 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
              <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
              <input type="search" value={ricerca} onChange={ev => setRicerca(ev.target.value)} placeholder="Cerca" aria-label="Cerca il corso" autoComplete="off" maxLength={60}
                className="w-full bg-transparent py-3 text-[16px] text-testo placeholder:text-testo-tenue focus:outline-none" />
            </div>
          )}

          {stato.passo === 'scuola' && (
            <div className="grid grid-cols-2 gap-3">
              {opzioni.map(o => (
                <button key={o.id} type="button" onClick={() => scelto('scuola', o.id)}
                  className="brand-premibile flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-[18px] border border-bordo-campo bg-superficie-2 p-3 text-center">
                  {ARTE_SCUOLA[o.id] && <Illustrazione nome={ARTE_SCUOLA[o.id]} lato={72} />}
                  <span data-testo-ok className="text-[14px] leading-[18px] font-bold text-testo">{o.nome}</span>
                </button>
              ))}
            </div>
          )}

          {stato.passo === 'anno' && (
            <div className="grid grid-cols-3 gap-3">
              {opzioni.map(o => (
                <button key={o.id} type="button" onClick={() => scelto('anno', o.id)} aria-label={`${o.nome}° anno`}
                  className="brand-premibile grid min-h-[84px] place-items-center rounded-[18px] border border-bordo-campo bg-superficie-2 text-[30px] font-extrabold tabular-nums text-testo">{o.nome}°</button>
              ))}
            </div>
          )}

          {(stato.passo === 'sede' || stato.passo === 'livello' || stato.passo === 'corso') && (
            <ul className="flex flex-col gap-2.5">
              {corsi.map(o => (
                <li key={o.id}>
                  <button type="button" onClick={() => scelto(stato.passo!, o.id)}
                    className="brand-premibile flex w-full items-center justify-between gap-3 rounded-[14px] border border-bordo-campo bg-superficie-2 px-4 py-3.5 text-left">
                    <span data-testo-ok className="min-w-0 text-[15.5px] leading-[21px] font-bold text-testo">{o.nome}</span>
                    <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />
                  </button>
                </li>
              ))}
              {corsi.length === 0 && <li role="status" data-testo-ok className="px-1 py-3 text-[14px] font-bold text-testo-tenue">Nessun corso con queste parole</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Come ci hai conosciuto

/** La domanda «Come ci hai conosciuto?»: quattro scelte, nessuna suggerita; toccando di nuovo la scelta fatta si toglie. */
export function ScelteProvenienza({ valore, onChange }: { valore: string; onChange: (id: string) => void }) {
  return (
    <div data-testo-ok className="flex flex-col gap-2.5">
      {PROVENIENZE.map(p => {
        const scelta = valore === p.id;
        return (
          <button key={p.id} type="button" aria-pressed={scelta} onClick={() => { playTapSound(); onChange(p.id); }}
            className={cn('brand-premibile flex w-full items-center gap-3.5 rounded-[14px] border px-4 py-3.5 text-left transition-colors duration-100',
              scelta ? 'border-azione bg-azione-tinta' : 'border-bordo-campo bg-superficie-2')}>
            <span aria-hidden="true" className={cn('grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-100',
              scelta ? 'border-azione bg-azione text-azione-su' : 'border-bordo-campo bg-superficie text-transparent')}>
              <Icona nome="stato-ok" size={16} />
            </span>
            <span className="text-[15.5px] leading-[21px] font-bold text-testo">{p.nome}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Casella di consenso

/**
 * Una casella di consenso: spenta finché l'utente non la tocca, e si spegne con lo stesso tocco. `titolo` e `testo` dicono che cosa succede se la accendi;
 * `informativa` è la riga breve sotto (titolare, dato, scopo, revoca). Se `occupato`, il tocco è in corso (la casella non cambia finché il servizio non risponde).
 */
export function CasellaConsenso({ spuntata, onChange, titolo, testo, informativa, occupato, children }: {
  spuntata: boolean; onChange: (v: boolean) => void; titolo: string; testo: string; informativa?: string; occupato?: boolean; children?: ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <button type="button" role="checkbox" aria-checked={spuntata} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`} disabled={occupato}
        onClick={() => { playTapSound(); onChange(!spuntata); }}
        className={cn('brand-premibile flex w-full items-start gap-3 rounded-[14px] border p-3.5 text-left transition-colors duration-100 disabled:opacity-60',
          spuntata ? 'border-azione bg-azione-tinta' : 'border-bordo-campo bg-superficie-2')}>
        <span aria-hidden="true" className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-100',
          spuntata ? 'border-azione bg-azione text-azione-su' : 'border-bordo-campo bg-superficie text-transparent')}>
          <Icona nome="stato-ok" size={16} />
        </span>
        <span className="min-w-0">
          <span id={`${id}-t`} data-testo-ok className="block text-[15px] leading-[20px] font-bold text-testo">{titolo}</span>
          <span id={`${id}-d`} data-testo-ok className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{testo}</span>
        </span>
      </button>
      {children}
      {informativa && <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">{informativa}</p>}
    </div>
  );
}
