import { Gauge, Repeat2, Timer, Languages } from 'lucide-react';
import { FORMATS, FREE_LIMITS } from '../../config/offer';
import { Colonna } from './comune';

const VANTAGGI = [
  { Icona: Gauge, titolo: 'Sai a che punto sei', testo: `${FREE_LIMITS.diagnostic} domande e una stima della probabilità` },
  { Icona: Timer, titolo: 'Provi il formato del test', testo: `${FORMATS.ente.questions} domande in ${FORMATS.ente.minutes} minuti` },
  { Icona: Repeat2, titolo: 'Ripassi dai tuoi errori', testo: 'Le domande sbagliate tornano finché non le sai' },
  { Icona: Languages, titolo: 'Spiegazioni in italiano', testo: 'Ogni risposta ha la sua spiegazione' },
];

// Fascia chiara con i quattro vantaggi: 2x2 sul telefono, in fila da 1024 px. Sale sul bordo basso della scena.
export default function Vantaggi() {
  return (
    <Colonna className="relative z-10 -mt-3 lg:-mt-14">
      <ul className="vetro vetro-forte grid grid-cols-2 gap-x-4 gap-y-6 rounded-[32px] px-5 py-6 sm:px-8 lg:grid-cols-4 lg:gap-x-8 lg:py-7" aria-label="I vantaggi in breve">
        {VANTAGGI.map(({ Icona, titolo, testo }, i) => (
          <li key={titolo} className={`flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:text-left ${i > 0 ? 'lg:border-l lg:border-linea lg:pl-8' : ''}`}>
            <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-azione-tinta text-azione-scuro lg:h-14 lg:w-14">
              <Icona size={24} />
            </span>
            <span>
              <span className="block text-sm font-bold leading-snug text-testo sm:text-base">{titolo}</span>
              <span className="mt-0.5 block text-xs font-medium leading-snug text-testo-tenue sm:text-sm">{testo}</span>
            </span>
          </li>
        ))}
      </ul>
    </Colonna>
  );
}
