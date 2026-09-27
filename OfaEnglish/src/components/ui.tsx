import { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';
import { ECOSYSTEM } from '../config/ecosystem';

// Mattoncini condivisi dalle schermate del funnel (onboarding, piani, prontuario), nello stile del Brand Kit.

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <div className={cn("flex flex-col h-full p-5 sm:p-8 gap-4 overflow-y-auto scrollbar-hide", className)}>
        {children}
      </div>
    </div>
  );
}

export function TopBar({ step, totalSteps, onBack }: { step?: number; totalSteps?: number; onBack?: () => void }) {
  return (
    <div className="flex items-center gap-3 shrink-0 min-h-[32px]">
      {onBack ? (
        <button
          onClick={() => { playTapSound(); onBack(); }}
          className="p-1 -ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Indietro"
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>
      ) : (
        <span className="w-[26px]" />
      )}
      {step !== undefined && totalSteps !== undefined && (
        <div className="flex-1 flex gap-1.5" aria-label={`Passo ${step} di ${totalSteps}`}>
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < step ? "bg-[#EF4444]" : "bg-gray-200 dark:bg-[#334155]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PrimaryButton({ children, onClick, disabled, className }: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      disabled={disabled}
      className={cn(
        "w-full bg-[#EF4444] hover:bg-[#DC2626] border-[#DC2626] active:scale-[.99] text-white font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none shrink-0",
        className
      )}
    >
      <span>{children}</span>
      <ChevronRight size={22} strokeWidth={3} />
    </button>
  );
}

export function SecondaryButton({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        "w-full py-3 px-6 font-bold text-sm sm:text-base text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl active:scale-[.99] hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-all shrink-0",
        className
      )}
    >
      {children}
    </button>
  );
}

export function ChoiceCard({ selected, onClick, title, subtitle }: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
}) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        "w-full text-left p-4 sm:p-5 rounded-2xl border flex items-center gap-4 transition-all",
        selected
          ? "border-[#EF4444] bg-[#FEE2E2]/60 dark:bg-[#7F1D1D]/40"
          : "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B]"
      )}
    >
      <span className={cn(
        "w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors",
        selected ? "bg-[#EF4444] border-[#EF4444] text-white" : "border-gray-300 dark:border-[#475569] text-transparent"
      )}>
        <Check size={16} strokeWidth={3.5} />
      </span>
      <span className="flex flex-col">
        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{title}</span>
        {subtitle && <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">{subtitle}</span>}
      </span>
    </button>
  );
}

// Firma dell'infrastruttura: algoritmo e servizi sono di ATLAS
export function PoweredByAtlas({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-center justify-center gap-1.5 text-[10px] font-bold tracking-[0.18em] text-gray-400 dark:text-gray-500", className)}>
      <span className="inline-block w-3 h-3 rotate-45 rounded-[3px] bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]" aria-hidden />
      Algoritmo e infrastruttura {ECOSYSTEM.engineName}
    </p>
  );
}

// Rende *corsivo* e **grassetto** nei testi del prontuario, senza HTML arbitrario
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="font-bold not-italic text-[#1D4ED8] dark:text-[#93C5FD]">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
