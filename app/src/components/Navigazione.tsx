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

/**
 * Barra in basso come nei concept 14 e 45: tre voci con icona e nome, senza pillole né riquadri.
 * Voce attiva: icona PIENA, blu, nome in grassetto (`aria-current`). Voci inattive: icona a contorno, tutte dello stesso grigio-blu `testo-tenue`,
 * senza alcun cambio di colore al passaggio del mouse (il vecchio `hover:text-testo` faceva sembrare più scura la voce toccata per ultima).
 * `attiva = null`: nessuna voce evidenziata (pagina che non appartiene a una scheda).
 * Area di tocco: tutta la colonna, alta almeno 56 px (minimo richiesto 44); etichette da 12,5 px. Larga quanto la colonna del Layout.
 */
export default function Navigazione({ attiva, onVai }: { attiva: Scheda | null; onVai: (s: Scheda) => void }) {
  return (
    <nav aria-label="Sezioni" className="shrink-0 flex border-t border-linea bg-superficie pt-[6px] pb-[max(10px,env(safe-area-inset-bottom))]">
      {VOCI.map(({ id, nome, icona }) => {
        const on = id === attiva;
        return (
          <button key={id} type="button" onClick={() => { playTapSound(); onVai(id); }} aria-current={on ? 'page' : undefined}
            className={cn('brand-premibile flex-1 min-w-0 min-h-[56px] flex flex-col items-center justify-center gap-[3px] rounded-[12px] text-[12.5px] leading-[16px] transition-colors duration-100',
              on ? 'text-azione font-bold' : 'text-testo-tenue font-medium')}>
            <Icona nome={icona} size={27} pieno={on} />
            {nome}
          </button>
        );
      })}
    </nav>
  );
}
