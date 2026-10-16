import { useState } from 'react';
import { User } from 'firebase/auth';
import { Icona } from '../brand/icone/Icona';
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
        "relative w-12 h-7 rounded-full transition-colors duration-100 shrink-0 disabled:opacity-60",
        on ? "bg-azione" : "bg-tacca"
      )}
    >
      <span className={cn("absolute top-1 left-1 w-5 h-5 rounded-full bg-superficie shadow dark:shadow-none ", on && "translate-x-5")} />
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6">
      <div className="w-full sm:max-w-md max-h-[100dvh] overflow-y-auto bg-superficie sm:rounded-[28px] rounded-t-[28px] shadow-xl dark:shadow-none p-5 sm:p-7 flex flex-col gap-4">
        <div className="flex items-center gap-2 justify-center">
          <span className="w-8 h-8 rounded-xl bg-testo text-superficie flex items-center justify-center">
            <Icona nome="projectid" size={20} />
          </span>
          <span className="font-bold text-testo">Accedi con {ECOSYSTEM.accountName}</span>
        </div>

        <div className="flex flex-col items-center text-center gap-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full" />
          ) : (
            <span className="w-16 h-16 rounded-full bg-azione-tinta text-azione-scuro flex items-center justify-center text-2xl font-bold">
              {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <div className="font-bold text-testo">{user.displayName}</div>
            <div className="text-xs font-semibold text-testo-tenue">{user.email}</div>
          </div>
          <h2 className="mt-1 text-xl font-bold text-testo">
            {APP_NAME} vuole collegarsi al tuo {ECOSYSTEM.accountName}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-testo-tenue">
            Scegli cosa condividere tra le app {ECOSYSTEM.name}. Solo il profilo di base è necessario.
          </p>
        </div>

        <ul className="flex flex-col divide-y-2 divide-linea border border-linea rounded-2xl">
          {SCOPES.map(s => (
            <li key={s.id} className="flex items-start gap-3 p-3.5">
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-sm text-testo">
                  {s.title}
                  {s.required && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-testo-tenue">
                      <Icona nome="blocco" size={11} /> Necessario
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-testo-tenue mt-0.5">{s.description}</p>
              </div>
              <Toggle on={s.required || scopes.has(s.id)} disabled={s.required || busy} onChange={v => toggle(s.id, v)} label={s.title} />
            </li>
          ))}
        </ul>

        <p className="text-[11px] font-semibold text-testo-tenue text-center">
          Puoi cambiare o revocare queste scelte quando vuoi da {ECOSYSTEM.accountName} › App collegate. Revocando un permesso i dati relativi smettono di essere condivisi.
        </p>

        {error && <p className="text-xs font-bold text-basso-testo bg-basso-tinta rounded-xl p-2.5 text-center">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => { playTapSound(); onCancel(); }}
            disabled={busy}
            className="flex-1 py-3 font-bold text-testo-tenue bg-superficie-2 border border-linea rounded-2xl"
          >
            Annulla
          </button>
          <button
            onClick={() => { playTapSound(); onAccept(Array.from(new Set([...scopes, ...SCOPES.filter(s => s.required).map(s => s.id)]))); }}
            disabled={busy}
            className="flex-1 py-3 font-bold text-azione-su bg-azione hover:bg-azione-scuro rounded-2xl disabled:opacity-50"
          >
            {busy ? 'Collegamento…' : 'Consenti'}
          </button>
        </div>
        <PoweredByAtlas />
      </div>
    </div>
  );
}
