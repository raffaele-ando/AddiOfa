import { ReactNode } from 'react';
import { Icona } from '../brand/icone/Icona';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';

// Mattoncini condivisi dalle schermate del funnel (onboarding, piani, prontuario), nello stile del Brand Kit.

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="h-full w-full bg-superficie sm:rounded-[32px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
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
          className="p-1 -ml-1 text-testo-tenue hover:text-testo transition-colors duration-100"
          aria-label="Indietro"
        >
          <Icona nome="indietro" size={28} />
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
                "h-1.5 flex-1 rounded-full transition-colors duration-100",
                i < step ? "bg-azione" : "bg-tacca"
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
        "w-full bg-azione hover:bg-azione-scuro border-azione-scuro text-azione-su font-bold text-base sm:text-lg py-4 px-6 rounded-2xl shadow-sm dark:shadow-none flex items-center justify-center gap-2 transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none shrink-0",
        className
      )}
    >
      <span>{children}</span>
      <Icona nome="avanti" size={24} />
    </button>
  );
}

export function SecondaryButton({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={() => { playTapSound(); onClick(); }}
      className={cn(
        "w-full py-3 px-6 font-bold text-sm sm:text-base text-testo-tenue bg-superficie-2 border border-linea rounded-2xl hover:bg-linea transition-colors duration-100 shrink-0",
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
        "w-full text-left p-4 sm:p-5 rounded-2xl border flex items-center gap-4 transition-colors duration-100",
        selected
          ? "border-azione bg-azione-tinta"
          : "border-linea bg-superficie-2 hover:bg-linea"
      )}
    >
      <span className={cn(
        "w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-100",
        selected ? "bg-azione border-azione text-azione-su" : "border-linea text-transparent"
      )}>
        <Icona nome="stato-ok" size={16} />
      </span>
      <span className="flex flex-col">
        <span className="font-bold text-testo">{title}</span>
        {subtitle && <span className="text-xs sm:text-sm font-semibold text-testo-tenue">{subtitle}</span>}
      </span>
    </button>
  );
}

// Rende *corsivo* e **grassetto** nei testi del prontuario, senza HTML arbitrario
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="font-bold not-italic text-azione-testo">{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
