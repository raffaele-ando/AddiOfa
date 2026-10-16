import { useState } from 'react';
import { cheatSheet } from '../data/cheatSheet';
import { RichText } from './ui';
import { Pagina } from '../screens/extra/ui';
import { Icona } from '../brand/icone/Icona';
import type { PaywallReason } from '../types';

/** Prontuario: le regole che tornano più spesso. L'argomento è blu (studio), la trappola ha il filo corallo a sinistra: una sola riga di colore per carta. Il testo delle regole è contenuto. */
export default function CheatSheet({ onBack }: { onBack: () => void; onNeedPass?: (reason: PaywallReason) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rules = q
    ? cheatSheet.filter(r => `${r.topic} ${r.rule} ${r.trap ?? ''}`.toLowerCase().includes(q))
    : cheatSheet;

  return (
    <Pagina titolo="Prontuario" onBack={onBack}>
      <div className="mt-4 relative">
        <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue pointer-events-none"><Icona nome="cerca" size={18} /></span>
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} aria-label="Cerca"
          placeholder="Cerca" autoComplete="off" spellCheck={false}
          className="w-full h-[46px] rounded-[12px] border border-linea bg-superficie-2 pl-10 pr-10 text-[15px] text-testo placeholder:text-testo-tenue outline-none focus:border-azione" />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Cancella"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo">
            <Icona nome="chiudi" size={17} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {rules.map(r => (
          <div key={r.topic} data-testo-ok className="bg-superficie-2 rounded-[12px] p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-azione-scuro">
              <Icona nome="prontuario" size={16} />{r.topic}
            </div>
            <p className="mt-1.5 text-[15px] font-medium text-testo leading-[23px]">
              <RichText text={r.rule} />
            </p>
            {r.trap && (
              <p className="mt-2.5 flex gap-2 border-l-[3px] border-basso pl-3 text-[13.5px] leading-[20px] text-testo">
                <span aria-hidden="true" className="mt-0.5 shrink-0 text-basso-numero"><Icona nome="stato-risposta-sbagliata" size={16} /></span>
                <span><span className="sr-only">Da evitare: </span><RichText text={r.trap} /></span>
              </p>
            )}
          </div>
        ))}
        {rules.length === 0 && (
          <div role="status" className="flex flex-col items-center gap-2 py-8 text-testo-tenue">
            <Icona nome="cerca" size={28} />
            <p className="text-[14px] font-semibold">Nessun risultato</p>
          </div>
        )}
      </div>
    </Pagina>
  );
}
