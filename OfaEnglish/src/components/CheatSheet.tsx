import { useState } from 'react';
import { Search } from 'lucide-react';
import { cheatSheet } from '../data/cheatSheet';
import { Screen, TopBar, RichText } from './ui';

export default function CheatSheet({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rules = q
    ? cheatSheet.filter(r => `${r.topic} ${r.rule} ${r.trap ?? ''}`.toLowerCase().includes(q))
    : cheatSheet;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div className="shrink-0">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Prontuario</h2>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
          Le {cheatSheet.length} regole che tornano più spesso, con la trappola tipica di chi parla italiano.
        </p>
      </div>

      <label className="flex items-center gap-2 bg-gray-100 dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl px-4 py-2.5 shrink-0">
        <Search size={18} className="text-gray-400" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cerca un argomento (es. since, conditional)"
          className="flex-1 bg-transparent outline-none font-semibold text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-gray-400"
        />
      </label>

      <div className="flex flex-col gap-3 pb-4">
        {rules.map(r => (
          <div key={r.topic} className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] border-b-4 rounded-2xl p-4">
            <div className="text-xs font-black uppercase tracking-widest text-[#8B5CF6]">{r.topic}</div>
            <p className="mt-1.5 text-sm sm:text-base font-semibold text-[#0F172A] dark:text-gray-200 leading-relaxed">
              <RichText text={r.rule} />
            </p>
            {r.trap && (
              <p className="mt-2 text-xs sm:text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5] bg-[#FEE2E2] dark:bg-[#7F1D1D]/40 rounded-xl px-3 py-2">
                Da evitare: <RichText text={r.trap} />
              </p>
            )}
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-center text-sm font-bold text-gray-400 py-8">Nessuna regola trovata.</p>
        )}
      </div>
    </Screen>
  );
}
