import { useState } from 'react';
import { User } from 'firebase/auth';
import { Lock, Fingerprint } from 'lucide-react';
import { ECOSYSTEM, SCOPES, ScopeId } from '../config/ecosystem';
import { APP_NAME } from '../config/offer';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';
import { PoweredByAtlas } from './ui';

interface ProjectConsentProps {
  user: User;
  initialScopes?: ScopeId[];
  busy?: boolean;
  error?: string | null;
  onAccept: (scopes: ScopeId[]) => void;
  onCancel: () => void;
}

export function Toggle({ on, disabled, onChange, label }: { on: boolean; disabled?: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => { playTapSound(); onChange(!on); }}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors shrink-0 disabled:opacity-60",
        on ? "bg-[#EF4444]" : "bg-gray-300 dark:bg-[#475569]"
      )}
    >
      <span className={cn("absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform", on && "translate-x-5")} />
    </button>
  );
}

// Schermata di consenso stile "Accedi con…": l'app chiede al Project ID i permessi, uno per uno.
// Obbligatorio solo il profilo di base; tutto il resto parte spento e si può cambiare dopo.
export default function ProjectConsent({ user, initialScopes, busy, error, onAccept, onCancel }: ProjectConsentProps) {
  const [scopes, setScopes] = useState<Set<ScopeId>>(
    () => new Set(initialScopes ?? SCOPES.filter(s => s.required).map(s => s.id))
  );

  const toggle = (id: ScopeId, on: boolean) => {
    const next = new Set(scopes);
    if (on) next.add(id); else next.delete(id);
    setScopes(next);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6">
      <div className="w-full sm:max-w-md max-h-[100dvh] overflow-y-auto bg-white dark:bg-[#1E293B] sm:rounded-[28px] rounded-t-[28px] shadow-xl p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-8 h-8 rounded-xl bg-[#0F172A] dark:bg-[#F8FAFC] text-white dark:text-[#0F172A] flex items-center justify-center">
            <Fingerprint size={18} />
          </span>
          <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Accedi con {ECOSYSTEM.accountName}</span>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full" />
          ) : (
            <span className="w-16 h-16 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center text-2xl font-bold">
              {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{user.displayName}</div>
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">{user.email}</div>
          </div>
          <h2 className="mt-1 text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            {APP_NAME} vuole collegarsi al tuo {ECOSYSTEM.accountName}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
            Scegli cosa condividere tra le app {ECOSYSTEM.name}. Solo il profilo di base è necessario.
          </p>
        </div>

        <ul className="flex flex-col divide-y-2 divide-gray-100 dark:divide-[#334155] border border-gray-200 dark:border-[#334155] rounded-2xl">
          {SCOPES.map(s => (
            <li key={s.id} className="flex items-start gap-3 p-3.5">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">
                  {s.title}
                  {s.required && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400">
                      <Lock size={10} /> Necessario
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</p>
              </div>
              <Toggle on={s.required || scopes.has(s.id)} disabled={s.required || busy} onChange={v => toggle(s.id, v)} label={s.title} />
            </li>
          ))}
        </ul>

        <p className="text-[11px] font-semibold text-gray-400 text-center">
          Puoi cambiare o revocare queste scelte quando vuoi da {ECOSYSTEM.accountName} › App collegate. Revocando un permesso i dati relativi smettono di essere condivisi.
        </p>

        {error && <p className="text-xs font-bold text-[#B91C1C] bg-[#FEE2E2] rounded-xl p-2.5 text-center">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => { playTapSound(); onCancel(); }}
            disabled={busy}
            className="flex-1 py-3 font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl"
          >
            Annulla
          </button>
          <button
            onClick={() => { playTapSound(); onAccept(Array.from(new Set([...scopes, ...SCOPES.filter(s => s.required).map(s => s.id)]))); }}
            disabled={busy}
            className="flex-1 py-3 font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-2xl disabled:opacity-50"
          >
            {busy ? 'Collegamento…' : 'Consenti'}
          </button>
        </div>
        <PoweredByAtlas />
      </div>
    </div>
  );
}
