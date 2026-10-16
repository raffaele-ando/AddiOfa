import { playTapSound } from '../lib/audio';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { cn } from '../lib/utils';

export type Scheda = 'home' | 'esercizi' | 'sfide';

// Tre destinazioni (struttura «Home completa»: la Home ospita lezioni e simulazione; Esercizi e Sfide sono le altre due pagine). Il profilo sta in alto a destra.
const VOCI: { id: Scheda; nome: string; icona: NomeIcona }[] = [
  { id: 'home', nome: 'Home', icona: 'home' },
  { id: 'esercizi', nome: 'Esercizi', icona: 'esercizi' },
  { id: 'sfide', nome: 'Sfide', icona: 'sfide' },
];

/** Barra in basso: tre voci. La voce attiva ha la pillola blu chiara dietro l'icona e il testo blu. */
export default function Navigazione({ attiva, onVai }: { attiva: Scheda | null; onVai: (s: Scheda) => void }) {
  return (
    <nav aria-label="Sezioni" className="shrink-0 flex border-t border-linea bg-superficie pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
      {VOCI.map(({ id, nome, icona }) => {
        const on = id === attiva;
        return (
          <button key={id} type="button" onClick={() => { playTapSound(); onVai(id); }} aria-current={on ? 'page' : undefined}
            className={cn('flex-1 min-w-0 flex flex-col items-center gap-1 py-1 text-[12px] leading-[16px]', on ? 'text-azione-scuro font-bold' : 'text-testo-tenue font-medium')}>
            <span className={cn('grid h-8 w-16 place-items-center rounded-full transition-colors duration-100', on && 'bg-azione-tinta')}>
              <Icona nome={icona} size={26} />
            </span>
            {nome}
          </button>
        );
      })}
    </nav>
  );
}
