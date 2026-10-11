import { playTapSound } from '../lib/audio';

export type Scheda = 'home' | 'simulazioni' | 'lezioni';

// Icone del concept (24 x 24, tratto 2): casa piena quando è attiva, barre e libro a contorno.
const ICONE: Record<Scheda, { d: string; pieno?: boolean }> = {
  home: { d: 'M12 3.2 3.4 10.6V20a1 1 0 0 0 1 1h4.6v-6h6v6h4.6a1 1 0 0 0 1-1v-9.4z', pieno: true },
  simulazioni: { d: 'M4.5 14.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM10.5 9.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1zM16 5.5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H17a1 1 0 0 1-1-1z' },
  lezioni: { d: 'M12 6.5C10 5 7 4.6 3.5 5v13c3.5-.4 6.5 0 8.5 1.5 2-1.5 5-1.9 8.5-1.5V5C17 4.6 14 5 12 6.5zM12 6.5v13' },
};

const VOCI: { id: Scheda; nome: string }[] = [
  { id: 'home', nome: 'Home' },
  { id: 'simulazioni', nome: 'Simulazioni' },
  { id: 'lezioni', nome: 'Lezioni' },
];

/** Barra in basso: tre voci come nel concept (Home, Simulazioni, Lezioni). Voce attiva blu, le altre grigio-blu, filetto sottile sopra. */
export default function Navigazione({ attiva, onVai }: { attiva: Scheda | null; onVai: (s: Scheda) => void }) {
  return (
    <nav aria-label="Sezioni" className="shrink-0 flex border-t border-linea bg-superficie pt-2.5 pb-[max(14px,env(safe-area-inset-bottom))]">
      {VOCI.map(({ id, nome }) => {
        const on = id === attiva;
        const { d, pieno } = ICONE[id];
        return (
          <button key={id} type="button" onClick={() => { playTapSound(); onVai(id); }} aria-current={on ? 'page' : undefined}
            className={`flex-1 min-w-0 flex flex-col items-center gap-0.5 py-1 text-[12px] leading-[16px] ${on ? 'text-azione font-semibold' : 'text-[#6B7794] dark:text-testo-tenue font-medium'}`}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill={on && pieno ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={on && pieno ? 0.8 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={d} />
            </svg>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}
