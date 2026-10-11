import { Gauge, Repeat2, Timer, Languages } from 'lucide-react';
import { FORMATS, FREE_LIMITS } from '../../config/offer';
import { Colonna, SCHEDA } from './comune';
import { cn } from '../../lib/utils';

const VANTAGGI = [
  { Icona: Gauge, titolo: 'Sai a che punto sei', testo: `${FREE_LIMITS.diagnostic} domande e una stima della probabilità di superare il test.` },
  { Icona: Timer, titolo: 'Provi il formato del test', testo: `${FORMATS.ente.questions} domande in ${FORMATS.ente.minutes} minuti, come al test.` },
  { Icona: Repeat2, titolo: 'Ripassi dai tuoi errori', testo: 'Le domande sbagliate tornano finché non le sai.' },
  { Icona: Languages, titolo: 'Spiegazioni in italiano', testo: 'Ogni risposta ha la sua spiegazione, in italiano.' },
];

// Riga dei quattro vantaggi: 2x2 sul telefono, in fila da 1024 px.
export default function Vantaggi() {
  return (
    <Colonna className="relative z-10 -mt-1 sm:-mt-4">
      <div>
        <ul className={cn(SCHEDA, 'grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 p-5 sm:p-6')} aria-label="I vantaggi in breve">
          {VANTAGGI.map(({ Icona, titolo, testo }) => (
            <li key={titolo} className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-azione-tinta text-azione-scuro ">
                <Icona size={22} aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-bold text-testo">{titolo}</span>
                <span className="mt-0.5 block text-sm font-medium text-testo-tenue">{testo}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Colonna>
  );
}
