import { useState } from 'react';
import { ChevronRight, ShieldCheck, Info } from 'lucide-react';
import { User } from 'firebase/auth';
import { AppState } from '../types';
import { PLANS, PlanId, GUARANTEE_CONDITIONS, isPaymentConfigured, formatEur, DISCLAIMER } from '../config/offer';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';
import { Screen, TopBar, PrimaryButton, SecondaryButton } from './ui';
import GuaranteeTracker from './GuaranteeTracker';

interface PlansProps {
  appState: AppState;
  user: User | null;
  onBack?: () => void;
  onContinueFree: () => void;
  step?: number;
  totalSteps?: number;
}

export default function Plans({ appState, user, onBack, onContinueFree, step, totalSteps }: PlansProps) {
  const [selected, setSelected] = useState<PlanId>('pro');
  const plan = PLANS.find(p => p.id === selected)!;
  const paymentsActive = PLANS.some(isPaymentConfigured);

  const handleCheckout = () => {
    if (!isPaymentConfigured(plan)) return;
    // Il pagamento (carta, PayPal, Apple Pay, Google Pay) avviene sulla pagina del provider:
    // l'app non vede né salva mai i dati di pagamento.
    const url = new URL(plan.paymentLink!);
    if (user?.uid) url.searchParams.set('client_reference_id', user.uid);
    if (user?.email) url.searchParams.set('prefilled_email', user.email);
    window.location.href = url.toString();
  };

  return (
    <Screen>
      <TopBar onBack={onBack} step={step} totalSteps={totalSteps} />
      <div className="shrink-0 text-center">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Come vuoi prepararti?</h2>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Scegli il piano più adatto a te. Pagamento una tantum, nessun abbonamento.</p>
      </div>

      <div className="flex flex-col gap-3">
        {PLANS.map(p => {
          const isSelected = p.id === selected;
          return (
            <button
              key={p.id}
              onClick={() => { playTapSound(); setSelected(p.id); }}
              className={cn(
                "relative text-left rounded-2xl border-2 border-b-4 p-4 transition-all",
                isSelected
                  ? p.id === 'garanzia' ? "border-[#22C55E] bg-[#F0FDF4] dark:bg-[#064E3B]/40" : "border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30"
                  : "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A]"
              )}
            >
              {p.badge && (
                <span className={cn(
                  "inline-block mb-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-black text-white",
                  p.badge.tone === 'red' ? "bg-[#EF4444]" : "bg-[#22C55E]"
                )}>
                  {p.badge.label}
                </span>
              )}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-black text-lg text-[#0F172A] dark:text-[#F8FAFC]">{p.name}</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">{p.summary}</span>
                  <span className="mt-1 font-black text-xl text-[#0F172A] dark:text-[#F8FAFC]">{formatEur(p.priceEur)}</span>
                </div>
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                  isSelected ? (p.id === 'garanzia' ? "bg-[#22C55E] text-white" : "bg-[#EF4444] text-white") : "bg-gray-100 dark:bg-[#1E293B] text-gray-400"
                )}>
                  <ChevronRight size={18} strokeWidth={3} />
                </span>
              </div>
              {isSelected && (
                <ul className="mt-3 flex flex-col gap-1">
                  {p.features.map(f => (
                    <li key={f} className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-gray-200">• {f}</li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>

      {selected === 'garanzia' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#16A34A]" />
              <span className="font-black text-sm text-[#0F172A] dark:text-[#F8FAFC]">Condizioni per il rimborso</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {GUARANTEE_CONDITIONS.map(c => (
                <li key={c} className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">• {c}</li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] font-semibold text-gray-400">
              I requisiti vengono misurati dall'app e li vedi sempre in Statistiche. Restano validi i diritti previsti dal Codice del Consumo.
            </p>
          </div>
          <GuaranteeTracker appState={appState} />
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-2">
        {isPaymentConfigured(plan) ? (
          <>
            <PrimaryButton onClick={handleCheckout}>Procedi al pagamento · {formatEur(plan.priceEur)}</PrimaryButton>
            <p className="text-center text-[11px] font-semibold text-gray-400">Pagamento sicuro sulla pagina del provider (carta, PayPal, Apple Pay, Google Pay)</p>
          </>
        ) : (
          <div className="flex items-start gap-2 text-xs sm:text-sm font-bold text-[#1D4ED8] dark:text-[#93C5FD] bg-[#DBEAFE] dark:bg-[#1E3A8A]/40 rounded-2xl p-3">
            <Info size={18} className="shrink-0 mt-0.5" />
            {paymentsActive
              ? 'Questo piano non è ancora acquistabile: scegline un altro oppure continua gratis.'
              : 'Siamo in beta: i pagamenti non sono ancora attivi e per ora puoi usare tutto gratis.'}
          </div>
        )}
        <SecondaryButton onClick={onContinueFree}>Continua gratis</SecondaryButton>
        <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
      </div>
    </Screen>
  );
}
