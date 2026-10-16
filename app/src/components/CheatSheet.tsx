import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cheatSheet } from '../data/cheatSheet';
import { RichText } from './ui';
import { Pagina } from '../screens/extra/ui';
import { FORMATS } from '../config/offer';
import type { PaywallReason } from '../types';

/** Prontuario: le regole che tornano più spesso. L'argomento è blu (studio), la trappola ha il filo corallo a sinistra: una sola riga di colore per carta. */
export default function CheatSheet({ onBack }: { onBack: () => void; onNeedPass?: (reason: PaywallReason) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rules = q
    ? cheatSheet.filter(r => `${r.topic} ${r.rule} ${r.trap ?? ''}`.toLowerCase().includes(q))
    : cheatSheet;
  const f = FORMATS.ente;

  return (
    <Pagina titolo="Prontuario" onBack={onBack}
      sottotitolo={`Le ${cheatSheet.length} regole che tornano più spesso, con la trappola tipica di chi parla italiano.`}>
      <p className="mt-3 text-[13px] leading-[19px] text-testo-tenue">
        Il test di recupero ha {f.questions} domande in {f.minutes} minuti e si supera con {f.passMark} su {f.questions}.
      </p>

      <div className="mt-4 relative">
        <Search size={18} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue pointer-events-none" />
        <input type="search" value={query} onChange={e => setQuery(e.target.value)} aria-label="Cerca un argomento"
          placeholder="Cerca un argomento (es. since, conditional)" autoComplete="off" spellCheck={false}
          className="w-full h-[46px] rounded-[12px] border border-linea bg-superficie-2 pl-10 pr-10 text-[15px] text-testo placeholder:text-testo-tenue outline-none focus:border-azione" />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Cancella la ricerca"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo">
            <X size={17} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {rules.map(r => (
          <div key={r.topic} className="bg-superficie-2 rounded-[12px] p-4">
            <div className="text-[12.5px] font-bold text-azione-scuro">{r.topic}</div>
            <p className="mt-1 text-[15px] font-medium text-testo leading-[23px]">
              <RichText text={r.rule} />
            </p>
            {r.trap && (
              <p className="mt-2.5 border-l-[3px] border-basso pl-3 text-[13.5px] leading-[20px] text-testo">
                <span className="font-bold text-basso-testo">Da evitare: </span><RichText text={r.trap} />
              </p>
            )}
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-center text-[14px] font-semibold text-testo-tenue py-8">Nessuna regola trovata.</p>
        )}
      </div>
    </Pagina>
  );
}
