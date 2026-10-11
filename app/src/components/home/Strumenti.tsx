import { ReactNode } from 'react';
import { ChevronRight, Lock, ClipboardCheck, Dumbbell, RotateCcw, GraduationCap, ListChecks, Gauge, BarChart3, Trophy, KeyRound } from 'lucide-react';
import { Carta } from './comune';
import { playTapSound } from '../../lib/audio';

export interface VoceStrumento { id: string; titolo: string; testo: string; onClick?: () => void; bloccato?: boolean; evidenza?: boolean }

const ICONE: Record<string, ReactNode> = {
  simulazione: <ClipboardCheck size={19} />, esercizi: <Dumbbell size={19} />, errori: <RotateCcw size={19} />, teoria: <GraduationCap size={19} />,
  prontuario: <ListChecks size={19} />, livello: <Gauge size={19} />, statistiche: <BarChart3 size={19} />, classifica: <Trophy size={19} />, pass: <KeyRound size={19} />,
};

/** Elenco compatto di tutte le funzioni: sotto le sezioni principali, non al centro della home. */
export default function Strumenti({ voci }: { voci: VoceStrumento[] }) {
  const presenti = voci.filter(v => v.onClick);
  return (
    <Carta className="p-2">
      <h2 className="text-[15px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] px-2.5 pt-2 pb-1">Strumenti</h2>
      <ul>
        {presenti.map((v, i) => (
          <li key={v.id} className={i > 0 ? 'border-t border-[#EEF1F6] dark:border-[#334155]' : ''}>
            <button type="button" onClick={() => { playTapSound(); v.onClick!(); }} className="brand-premibile w-full flex items-center gap-3 px-2.5 py-2.5 text-left rounded-2xl">
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${v.evidenza ? 'bg-[#2563EB] text-white' : 'bg-[#EFF6FF] dark:bg-[#2563EB]/15 text-[#2563EB] dark:text-[#60A5FA]'}`} aria-hidden="true">{ICONE[v.id]}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14.5px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">{v.titolo}</span>
                <span className="block text-[12px] leading-snug text-[#6B7280] dark:text-[#94A3B8]">{v.testo}</span>
              </span>
              {v.bloccato ? <Lock size={15} className="shrink-0 text-[#6B7280] dark:text-[#94A3B8]" aria-label="Richiede il Pass" /> : <ChevronRight size={16} className="shrink-0 text-[#94A3B8]" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>
    </Carta>
  );
}
