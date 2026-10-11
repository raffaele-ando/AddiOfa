import { useState } from 'react';
import { Search } from 'lucide-react';
import { cheatSheet } from '../data/cheatSheet';
import { Screen, TopBar, RichText } from './ui';
import { FORMATS, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';
import type { PaywallReason } from '../types';

export default function CheatSheet({ onBack }: { onBack: () => void; onNeedPass?: (reason: PaywallReason) => void }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const rules = q
    ? cheatSheet.filter(r => `${r.topic} ${r.rule} ${r.trap ?? ''}`.toLowerCase().includes(q))
    : cheatSheet;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div className="shrink-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-testo">Prontuario</h2>
        <p className="text-sm font-semibold text-testo-tenue mt-1">
          Le {cheatSheet.length} regole che tornano più spesso, con la trappola tipica di chi parla italiano.
        </p>
        <p className="text-xs sm:text-sm font-semibold text-testo-tenue mt-3 leading-relaxed">
          Cosa si sa del test: il TENG, la parte di inglese del test d'ingresso, ha {FORMATS.teng.questions} domande in {FORMATS.teng.minutes} minuti e dà l'OFA se le risposte esatte sono meno di {FORMATS.teng.passMark}.
          Il test di recupero di LinguaViva ha {FORMATS.ente.questions} domande in {FORMATS.ente.minutes} minuti e si supera con {FORMATS.ente.passMark} su {FORMATS.ente.questions}.
          Language Academy e British Institutes non pubblicano la soglia: chiedila all'ente che scegli.
        </p>
      </div>

      <label className="flex items-center gap-2 bg-superficie-2 border border-linea rounded-2xl px-4 py-2.5 shrink-0">
        <Search size={18} className="text-testo-tenue" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cerca un argomento (es. since, conditional)"
          className="flex-1 bg-transparent outline-none font-semibold text-testo placeholder:text-testo-tenue"
        />
      </label>

      <div className="flex flex-col gap-3 pb-4">
        {rules.map(r => (
          <div key={r.topic} className="bg-superficie-2 border border-linea rounded-2xl p-4">
            <div className="text-xs font-bold text-azione">{r.topic}</div>
            <p className="mt-1.5 text-sm sm:text-base font-semibold text-testo leading-relaxed">
              <RichText text={r.rule} />
            </p>
            {r.trap && (
              <p className="mt-2 text-xs sm:text-sm font-bold text-basso-testo bg-basso-tinta rounded-xl px-3 py-2">
                Da evitare: <RichText text={r.trap} />
              </p>
            )}
          </div>
        ))}
        {rules.length === 0 && (
          <p className="text-center text-sm font-bold text-testo-tenue py-8">Nessuna regola trovata.</p>
        )}
      </div>
    </Screen>
  );
}
