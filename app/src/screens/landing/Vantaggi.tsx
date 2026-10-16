import { FORMATS, FREE_LIMITS } from '../../config/offer';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IconaTono, type Tono } from '../extra/ui';
import { Colonna } from './comune';

// I quattro vantaggi: icona + 2-3 parole + un numero. Un colore per significato, lo stesso dell'app:
// la probabilità = blu, le simulazioni (il tempo) = ambra, gli errori = corallo, la spiegazione = viola.
const VANTAGGI: { icona: NomeIcona; tono: Tono; titolo: string; numero: string }[] = [
  { icona: 'probabilita', tono: 'azione', titolo: 'Probabilità', numero: `${FREE_LIMITS.diagnostic} domande` },
  { icona: 'simulazioni', tono: 'medio', titolo: 'Simulazioni', numero: `${FORMATS.ente.questions} · ${FORMATS.ente.minutes} min` },
  { icona: 'errori', tono: 'basso', titolo: 'Ripasso errori', numero: '' },
  { icona: 'spiegazioni', tono: 'viola', titolo: 'Spiegazioni', numero: 'In italiano' },
];

// Fascia chiara con i quattro vantaggi: 2x2 sul telefono, in fila da 1024 px. Sale sul bordo basso della scena.
export default function Vantaggi() {
  return (
    <Colonna className="relative z-10 -mt-3 lg:-mt-14">
      <ul className="vetro vetro-forte grid grid-cols-2 gap-x-4 gap-y-6 rounded-[32px] px-5 py-6 sm:px-8 lg:grid-cols-4 lg:gap-x-8 lg:py-7" aria-label="I vantaggi in breve">
        {VANTAGGI.map(({ icona, tono, titolo, numero }, i) => (
          <li key={titolo} className={`flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:text-left ${i > 0 ? 'lg:border-l lg:border-linea lg:pl-8' : ''}`}>
            <IconaTono tono={tono} lato={56} className="!rounded-full lg:!h-14 lg:!w-14"><Icona nome={icona} size={26} /></IconaTono>
            <span>
              <span className="block text-sm font-bold leading-snug text-testo sm:text-base">{titolo}</span>
              {numero && <span className="mt-0.5 block text-xs font-medium leading-snug text-testo-tenue sm:text-sm">{numero}</span>}
            </span>
          </li>
        ))}
      </ul>
    </Colonna>
  );
}
