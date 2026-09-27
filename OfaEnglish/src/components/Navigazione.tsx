import { Home, BookOpen, BarChart3, Trophy } from 'lucide-react';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';

export type Scheda = 'home' | 'esercizi' | 'progressi' | 'classifica';

// Barra in basso delle schede principali, come nelle schermate del Brand Kit (scheda attiva in rosso)
export default function Navigazione({ attiva, onVai }: { attiva: Scheda; onVai: (s: Scheda) => void }) {
  const voci: { id: Scheda; nome: string; Icona: typeof Home }[] = [
    { id: 'home', nome: 'Home', Icona: Home },
    { id: 'esercizi', nome: 'Esercizi', Icona: BookOpen },
    { id: 'progressi', nome: 'Progressi', Icona: BarChart3 },
    { id: 'classifica', nome: 'Classifica', Icona: Trophy },
  ];
  return (
    <nav aria-label="Sezioni" className="shrink-0 grid grid-cols-4 border-t border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {voci.map(({ id, nome, Icona }) => {
        const on = id === attiva;
        return (
          <button key={id} onClick={() => { if (!on) { playTapSound(); onVai(id); } }} aria-current={on ? 'page' : undefined}
            className="flex flex-col items-center gap-1 py-1"
            style={{ font: `${on ? 600 : 500} 11px ${FONT}`, color: on ? '#EF4444' : '#6B7280' }}>
            <Icona size={22} strokeWidth={on ? 2.4 : 2} fill={on ? '#EF4444' : 'none'} fillOpacity={on ? 0.15 : 0} />
            {nome}
          </button>
        );
      })}
    </nav>
  );
}
