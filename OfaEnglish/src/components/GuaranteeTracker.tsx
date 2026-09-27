import { ShieldCheck, Check } from 'lucide-react';
import { AppState } from '../types';
import { computeGuaranteeProgress } from '../lib/guarantee';
import { cn } from '../lib/utils';

// Mostra all'utente, con i suoi dati, a che punto è con le condizioni della Garanzia Promosso
export default function GuaranteeTracker({ appState }: { appState: AppState }) {
  const progress = computeGuaranteeProgress(appState);

  return (
    <div className="bg-[#F0FDF4] dark:bg-[#064E3B]/40 border-2 border-[#22C55E]/40 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck size={20} className="text-[#16A34A]" />
        <span className="font-black text-sm uppercase tracking-widest text-[#15803D] dark:text-[#34D399]">
          Stato della garanzia
        </span>
      </div>
      {progress.checks.map(c => (
        <div key={c.label} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-[#0F172A] dark:text-gray-200">
            <span className="flex items-center gap-1.5">
              {c.done && <Check size={14} strokeWidth={3.5} className="text-[#16A34A]" />}
              {c.label}
            </span>
            <span>{c.current}/{c.target}</span>
          </div>
          <div className="h-2 bg-white dark:bg-[#0F172A] rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", c.done ? "bg-[#22C55E]" : "bg-[#F59E0B]")}
              style={{ width: `${(c.current / c.target) * 100}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
        {progress.qualified
          ? 'Hai tutti i requisiti: se non superi il test hai diritto al rimborso.'
          : 'Completa tutti i requisiti prima del test per avere diritto al rimborso.'}
      </p>
    </div>
  );
}
