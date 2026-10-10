import { Home, BookOpen, BarChart3, Trophy, GraduationCap, KeyRound, Lock } from 'lucide-react';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import { FEATURE_FLAGS } from '../config/offer';
import { useAccess } from '../access/context';

export type Scheda = 'home' | 'esercizi' | 'teoria' | 'progressi' | 'classifica' | 'pass';

// Barra in basso delle schede principali (scheda attiva in rosso). La teoria ha il lucchetto senza Pass; "Pass" apre il paywall.
export default function Navigazione({ attiva, onVai }: { attiva: Scheda | null; onVai: (s: Scheda) => void }) {
  const { pass } = useAccess();
  const voci: { id: Scheda; nome: string; Icona: typeof Home; blocco?: boolean }[] = [
    { id: 'home', nome: 'Home', Icona: Home },
    { id: 'esercizi', nome: 'Esercizi', Icona: BookOpen },
    { id: 'teoria', nome: 'Teoria', Icona: GraduationCap, blocco: !pass },
    { id: 'progressi', nome: 'Progressi', Icona: BarChart3 },
    ...(FEATURE_FLAGS.leaderboard ? [{ id: 'classifica' as const, nome: 'Classifica', Icona: Trophy }] : []),
    ...(!pass ? [{ id: 'pass' as const, nome: 'Pass', Icona: KeyRound }] : []),
  ];
  return (
    <nav aria-label="Sezioni" className="shrink-0 flex border-t border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {voci.map(({ id, nome, Icona, blocco }) => {
        const on = id === attiva;
        return (
          <button key={id} onClick={() => { if (!on) { playTapSound(); onVai(id); } }} aria-current={on ? 'page' : undefined}
            className="relative flex-1 min-w-0 flex flex-col items-center gap-1 py-1"
            style={{ font: `${on ? 600 : 500} 11px ${FONT}`, color: on || id === 'pass' ? '#EF4444' : '#6B7280' }}>
            <span className="relative">
              <Icona size={22} strokeWidth={on ? 2.4 : 2} fill={on ? '#EF4444' : 'none'} fillOpacity={on ? 0.15 : 0} />
              {blocco && <Lock size={11} strokeWidth={2.6} className="absolute -right-2 -top-1 text-[#6B7280] bg-white dark:bg-[#1E293B] rounded-full" aria-label="Richiede il Pass" />}
            </span>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}
