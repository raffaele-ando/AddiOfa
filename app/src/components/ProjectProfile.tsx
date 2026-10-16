import { useState } from 'react';
import { User } from 'firebase/auth';
import { Icona } from '../brand/icone/Icona';
import { AppState, ProjectLink } from '../types';
import { ECOSYSTEM, SCOPES, ScopeId, ATLAS_API_URL } from '../config/ecosystem';
import { APP_NAME } from '../config/offer';
import { atlas, ProjectAccount } from '../lib/atlas';
import { Screen, TopBar, PoweredByAtlas } from './ui';
import { Toggle } from './ProjectConsent';
import { urlIcona } from '../brand/risorse';

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

export default function ProjectProfile({ user, account, appState, onBack, onAccountChange, onChangeScopes, onUnlink, onDeleteAccount, onLogout }: ProjectProfileProps) {
  const [editing, setEditing] = useState(false);
  const [handle, setHandle] = useState(account?.handle ?? '');
  const [displayName, setDisplayName] = useState(account?.displayName ?? user.displayName ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dati, setDati] = useState<string | null>(null);
  const [copiato, setCopiato] = useState(false);
  const [confermaElimina, setConfermaElimina] = useState(false);
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

  // Niente scaricamento via link (non funziona nelle anteprime): i dati si mostrano e si copiano.
  const exportData = () => run(async () => {
    const remote = ATLAS_API_URL ? await atlas.exportMe() : null;
    const testo = JSON.stringify({ projectId: remote, [ECOSYSTEM.appId]: appState }, null, 2);
    setDati(testo);
    try { await navigator.clipboard.writeText(testo); setCopiato(true); } catch { setCopiato(false); }
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
        <Icona nome="projectid" size={24} className="text-testo" />
        <h2 className="text-2xl sm:text-3xl font-bold text-testo">{ECOSYSTEM.accountName}</h2>
      </div>

      <div className="bg-gradient-to-br from-azione-da to-azione-a text-azione-su rounded-3xl p-5 flex items-center gap-4 shrink-0">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-16 h-16 rounded-full border border-white/40" />
        ) : (
          <span className="w-16 h-16 rounded-full bg-azione-su/20 flex items-center justify-center text-2xl font-bold">
            {(user.displayName || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg truncate">{account?.displayName ?? user.displayName}</div>
          {account && <div className="font-bold text-azione-su/80 text-sm">@{account.handle}</div>}
          <div className="text-xs font-semibold text-azione-su/70 truncate">{user.email}</div>
          <div className="mt-1 text-[10px] font-bold text-azione-su/70">
            {account ? account.id : 'Solo su questo dispositivo'}
          </div>
        </div>
        {account && !editing && (
          <button onClick={() => setEditing(true)} className="p-2 rounded-xl bg-azione-su/10 hover:bg-azione-su/20" aria-label="Modifica profilo">
            <Icona nome="modifica" size={20} />
          </button>
        )}
      </div>

      {editing && (
        <div className="flex flex-col gap-2 bg-superficie-2 border border-linea rounded-2xl p-4">
          <label className="text-xs font-bold text-testo-tenue">Nome</label>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} maxLength={60}
            className="bg-superficie border border-linea rounded-xl px-3 py-2 font-bold text-testo" />
          <label className="text-xs font-bold text-testo-tenue mt-1">Nome utente (visibile in {ECOSYSTEM.rankingName})</label>
          <div className="flex items-center bg-superficie border border-linea rounded-xl px-3">
            <span className="font-bold text-testo-tenue">@</span>
            <input value={handle} onChange={e => setHandle(e.target.value.toLowerCase())} maxLength={20}
              className="flex-1 bg-transparent py-2 font-bold outline-none text-testo" />
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setEditing(false)} className="flex-1 py-2.5 rounded-xl font-bold text-testo-tenue border border-linea">Annulla</button>
            <button onClick={saveProfile} disabled={busy} className="flex-1 py-2.5 rounded-xl font-bold text-azione-su bg-azione hover:bg-azione-scuro disabled:opacity-50">Salva</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-testo-tenue">App collegate</h3>
        <div className="border border-linea rounded-2xl">
          <div className="flex items-center gap-3 p-4 border-b border-linea">
            <img src={urlIcona} alt="" className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <div className="font-bold text-testo">{APP_NAME}</div>
              <div className="text-xs font-semibold text-testo-tenue">
                {link ? `Collegata dal ${new Date(link.grantedAt).toLocaleDateString('it-IT')}` : 'Non collegata'}
              </div>
            </div>
          </div>
          {link && SCOPES.map(s => (
            <div key={s.id} className="flex items-start gap-3 p-3.5 border-b last:border-b-0 border-linea">
              <div className="flex-1">
                <div className="font-bold text-sm text-testo">{s.title}</div>
                <p className="text-xs font-semibold text-testo-tenue">{s.description}</p>
              </div>
              <Toggle on={s.required || link.scopes.includes(s.id)} disabled={s.required || busy} onChange={v => toggleScope(s.id, v)} label={s.title} />
            </div>
          ))}
        </div>
        {link && (
          <button onClick={() => run(onUnlink)} disabled={busy}
            className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-testo-tenue border border-linea">
            <Icona nome="scollega" size={18} /> Scollega {APP_NAME}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-testo-tenue">I tuoi dati</h3>
        <button onClick={exportData} disabled={busy}
          className="flex items-center gap-3 p-3.5 rounded-2xl border border-linea font-bold text-sm text-testo">
          <Icona nome="copia" size={20} className="text-azione" /> Copia i tuoi dati
        </button>
        <button onClick={onLogout}
          className="flex items-center gap-3 p-3.5 rounded-2xl border border-linea font-bold text-sm text-testo">
          <Icona nome="esci" size={20} className="text-testo-tenue" /> Esci
        </button>
        {dati && (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold text-testo-tenue" role="status">
              {copiato ? 'Copiati negli appunti. Puoi anche selezionare il testo qui sotto.' : 'Non riesco a copiare da solo: seleziona il testo qui sotto e copialo a mano.'}
            </p>
            <textarea readOnly value={dati} rows={6} onFocus={e => e.currentTarget.select()} aria-label="I tuoi dati"
              className="w-full resize-y rounded-xl border border-linea bg-superficie-2 p-3 font-mono text-[11px] text-testo" />
          </div>
        )}
        {confermaElimina ? (
          <div className="flex flex-col gap-2 rounded-2xl border border-basso/40 p-3.5" role="alertdialog" aria-label={`Conferma eliminazione del ${ECOSYSTEM.accountName}`}>
            <p className="text-sm font-bold text-basso-testo">
              Eliminare il {ECOSYSTEM.accountName}? Collegamenti, consensi e punteggi {ECOSYSTEM.rankingName} vengono cancellati. I progressi restano su questo dispositivo.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfermaElimina(false)} className="flex-1 py-2.5 rounded-xl font-bold text-testo-tenue border border-linea">Annulla</button>
              <button onClick={() => { setConfermaElimina(false); run(onDeleteAccount); }} disabled={busy}
                className="flex-1 py-2.5 rounded-xl font-bold text-basso-testo border border-basso/40">Elimina</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfermaElimina(true)} disabled={busy}
            className="flex items-center gap-3 p-3.5 rounded-2xl border border-basso/40 font-bold text-sm text-basso-testo">
            <Icona nome="cancella" size={20} /> Elimina {ECOSYSTEM.accountName}
          </button>
        )}
      </div>

      {error && <p className="text-xs font-bold text-basso-testo bg-basso-tinta rounded-xl p-2.5 text-center">{error}</p>}
      {!ATLAS_API_URL && (
        <p className="text-xs font-semibold text-testo-tenue text-center">
          Il servizio {ECOSYSTEM.engineName} non è ancora attivo: il {ECOSYSTEM.accountName} e i consensi sono salvati solo sul tuo account Google e su questo dispositivo.
        </p>
      )}
      <PoweredByAtlas className="mt-auto pt-2" />
    </Screen>
  );
}
