import { useState } from 'react';
import { User } from 'firebase/auth';
import { Fingerprint, Pencil, Download, Trash2, LogOut, Unlink } from 'lucide-react';
import { AppState, ProjectLink } from '../types';
import { ECOSYSTEM, SCOPES, ScopeId, ATLAS_API_URL } from '../config/ecosystem';
import { APP_NAME } from '../config/offer';
import { atlas, ProjectAccount } from '../lib/atlas';
import { Screen, TopBar, PoweredByAtlas } from './ui';
import { Toggle } from './ProjectConsent';

interface ProjectProfileProps {
  user: User;
  account: ProjectAccount | null;
  appState: AppState;
  onBack: () => void;
  onAccountChange: (account: ProjectAccount) => void;
  onChangeScopes: (scopes: ScopeId[]) => Promise<void>;
  onUnlink: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
  onLogout: () => void;
}

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ProjectProfile({ user, account, appState, onBack, onAccountChange, onChangeScopes, onUnlink, onDeleteAccount, onLogout }: ProjectProfileProps) {
  const [editing, setEditing] = useState(false);
  const [handle, setHandle] = useState(account?.handle ?? '');
  const [displayName, setDisplayName] = useState(account?.displayName ?? user.displayName ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const link: ProjectLink | undefined = appState.projectLink;

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const saveProfile = () => run(async () => {
    const { account: updated } = await atlas.updateMe({ handle, displayName });
    onAccountChange(updated);
    setEditing(false);
  });

  const exportData = () => run(async () => {
    const remote = ATLAS_API_URL ? await atlas.exportMe() : null;
    downloadJson({ projectId: remote, [ECOSYSTEM.appId]: appState }, 'project-id-dati.json');
  });

  const toggleScope = (id: ScopeId, on: boolean) => run(async () => {
    const current = new Set(link?.scopes ?? []);
    if (on) current.add(id); else current.delete(id);
    await onChangeScopes(Array.from(current));
  });

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div className="flex items-center gap-2">
        <Fingerprint className="text-[#0F172A] dark:text-[#F8FAFC]" size={22} />
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{ECOSYSTEM.accountName}</h2>
      </div>

      <div className="bg-gradient-to-br from-[#0F172A] to-[#1D4ED8] text-white rounded-3xl p-5 flex items-center gap-4 shrink-0">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full border border-white/40" />
        ) : (
          <span className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {(user.displayName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg truncate">{account?.displayName ?? user.displayName}</div>
          {account && <div className="font-bold text-white/80 text-sm">@{account.handle}</div>}
          <div className="text-xs font-semibold text-white/60 truncate">{user.email}</div>
          <div className="mt-1 text-[10px] font-bold text-white/60">
            {account ? account.id : 'Solo su questo dispositivo'}
          </div>
        </div>
        {account && !editing && (
          <button onClick={() => setEditing(true)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20" aria-label="Modifica profilo">
            <Pencil size={18} />
          </button>
        )}
      </div>

      {editing && (
        <div className="flex flex-col gap-2 bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl p-4">
          <label className="text-xs font-bold text-gray-400">Nome</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={60}
            className="bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl px-3 py-2 font-bold text-[#0F172A] dark:text-[#F8FAFC]" />
          <label className="text-xs font-bold text-gray-400 mt-1">Nome utente (visibile in {ECOSYSTEM.rankingName})</label>
          <div className="flex items-center bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl px-3">
            <span className="font-bold text-gray-400">@</span>
            <input value={handle} onChange={e => setHandle(e.target.value.toLowerCase())} maxLength={20}
              className="flex-1 bg-transparent py-2 font-bold outline-none text-[#0F172A] dark:text-[#F8FAFC]" />
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl font-bold text-gray-500 border border-gray-200 dark:border-[#334155]">Annulla</button>
            <button onClick={saveProfile} disabled={busy} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50">Salva</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400">App collegate</h3>
        <div className="border border-gray-200 dark:border-[#334155] rounded-2xl">
          <div className="flex items-center gap-3 p-4 border-b-2 border-gray-100 dark:border-[#334155]">
            <img src="/favicon-64.png" alt="" className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</div>
              <div className="text-xs font-semibold text-gray-500">
                {link ? `Collegata dal ${new Date(link.grantedAt).toLocaleDateString('it-IT')}` : 'Non collegata'}
              </div>
            </div>
          </div>
          {link && SCOPES.map(s => (
            <div key={s.id} className="flex items-start gap-3 p-3.5 border-b-2 last:border-b-0 border-gray-100 dark:border-[#334155]">
              <div className="flex-1">
                <div className="font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{s.title}</div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{s.description}</p>
              </div>
              <Toggle on={s.required || link.scopes.includes(s.id)} disabled={s.required || busy} onChange={v => toggleScope(s.id, v)} label={s.title} />
            </div>
          ))}
        </div>
        {link && (
          <button onClick={() => run(onUnlink)} disabled={busy}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-gray-500 border border-gray-200 dark:border-[#334155]">
            <Unlink size={16} /> Scollega {APP_NAME}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-gray-400">I tuoi dati</h3>
        <button onClick={exportData} disabled={busy}
          className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-[#334155] font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">
          <Download size={18} className="text-[#EF4444]" /> Scarica una copia dei tuoi dati
        </button>
        <button onClick={onLogout}
          className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-200 dark:border-[#334155] font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC]">
          <LogOut size={18} className="text-gray-400" /> Esci
        </button>
        <button
          onClick={() => {
            if (window.confirm(`Eliminare il ${ECOSYSTEM.accountName}? Collegamenti, consensi e punteggi ${ECOSYSTEM.rankingName} vengono cancellati. I progressi restano su questo dispositivo.`)) {
              run(onDeleteAccount);
            }
          }}
          disabled={busy}
          className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#EF4444]/40 font-bold text-sm text-[#B91C1C] dark:text-[#FCA5A5]">
          <Trash2 size={18} /> Elimina {ECOSYSTEM.accountName}
        </button>
      </div>

      {error && <p className="text-xs font-bold text-[#B91C1C] bg-[#FEE2E2] rounded-xl p-2.5 text-center">{error}</p>}
      {!ATLAS_API_URL && (
        <p className="text-xs font-semibold text-gray-400 text-center">
          Il servizio {ECOSYSTEM.engineName} non è ancora attivo: il {ECOSYSTEM.accountName} e i consensi sono salvati solo sul tuo account Google e su questo dispositivo.
        </p>
      )}
      <PoweredByAtlas className="mt-auto pt-2" />
    </Screen>
  );
}
