import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { Trophy, Users } from 'lucide-react';
import { AppState } from '../types';
import { ECOSYSTEM } from '../config/ecosystem';
import { atlas, isAtlasOnline, Leaderboard as LeaderboardData } from '../lib/atlas';
import { cn } from '../lib/utils';
import { Screen, TopBar, PrimaryButton, PoweredByAtlas } from './ui';

interface LeaderboardProps {
  user: User | null;
  appState: AppState;
  onBack: () => void;
  onLogin: () => void;
  onJoin: () => Promise<void>; // aggiunge il permesso della classifica al collegamento
}

const medal = ['bg-[#F59E0B]', 'bg-[#9CA3AF]', 'bg-[#B45309]'];

export default function Leaderboard({ user, appState, onBack, onLogin, onJoin }: LeaderboardProps) {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const joined = !!appState.projectLink?.scopes.includes('noi.leaderboard');

  useEffect(() => {
    if (!isAtlasOnline()) return;
    atlas.leaderboard(ECOSYSTEM.appId).then(setData).catch(e => setError((e as Error).message));
  }, [user, joined]);

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-[#FEF3C7] text-[#F59E0B] flex items-center justify-center"><Trophy size={22} /></span>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Classifica {ECOSYSTEM.rankingName}</h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">Chi sa più regole: domande imparate, poi miglior simulazione.</p>
        </div>
      </div>

      {!isAtlasOnline() && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10">
          <Users size={40} className="text-gray-300" />
          <p className="font-black text-[#0F172A] dark:text-[#F8FAFC]">La classifica {ECOSYSTEM.rankingName} arriva presto</p>
          <p className="text-sm font-semibold text-gray-500 max-w-xs">Sarà attiva appena il servizio {ECOSYSTEM.engineName} è online. Parteciperà solo chi lo sceglie.</p>
        </div>
      )}

      {isAtlasOnline() && data?.me && (
        <div className="bg-[#DBEAFE] dark:bg-[#1E3A8A]/40 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-black text-[#1D4ED8] dark:text-[#93C5FD]">La tua posizione</span>
          <span className="font-black text-2xl text-[#1D4ED8] dark:text-[#93C5FD]">#{data.me.rank} <span className="text-sm">su {data.total}</span></span>
        </div>
      )}

      {isAtlasOnline() && (
        <ol className="flex flex-col gap-2">
          {data?.entries.map(e => (
            <li key={e.handle} className={cn(
              "flex items-center gap-3 p-3 rounded-2xl border-2",
              e.isMe ? "border-[#3B82F6] bg-[#EFF6FF] dark:bg-[#1E3A8A]/30" : "border-gray-200 dark:border-[#334155]"
            )}>
              <span className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-sm",
                e.rank <= 3 ? `${medal[e.rank - 1]} text-white` : "bg-gray-100 dark:bg-[#0F172A] text-gray-500")}>{e.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm text-[#0F172A] dark:text-[#F8FAFC] truncate">{e.displayName}</div>
                <div className="text-xs font-semibold text-gray-400">@{e.handle}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-[#22C55E]">{e.mastered}</div>
                <div className="text-[10px] font-bold text-gray-400">imparate · {e.bestSim}/30</div>
              </div>
            </li>
          ))}
          {data && data.entries.length === 0 && (
            <p className="text-center text-sm font-bold text-gray-400 py-6">Nessuno in classifica per ora: entra per primo.</p>
          )}
        </ol>
      )}

      {error && <p className="text-xs font-bold text-[#B91C1C] bg-[#FEE2E2] rounded-xl p-2.5 text-center">{error}</p>}

      {isAtlasOnline() && !joined && (
        <div className="mt-auto flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-500 text-center">
            Entrando in classifica, il tuo @nome utente, le domande imparate e il miglior punteggio saranno visibili agli altri. Puoi uscire quando vuoi dal {ECOSYSTEM.accountName}.
          </p>
          {user ? (
            <PrimaryButton onClick={async () => { setJoining(true); try { await onJoin(); } finally { setJoining(false); } }} disabled={joining}>
              Entra in classifica
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={onLogin}>Accedi con {ECOSYSTEM.accountName}</PrimaryButton>
          )}
        </div>
      )}
      <PoweredByAtlas className={cn(joined || !isAtlasOnline() ? "mt-auto" : "")} />
    </Screen>
  );
}
