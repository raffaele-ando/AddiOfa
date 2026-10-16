import { DIAGNOSTIC_QUESTIONS } from '../../config/offer';
import { questions } from '../../data/questions';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IconaTono, type Tono } from '../extra/ui';
import { Colonna } from './comune';

// Striscia dei quattro vantaggi (concetti 45 e 12): cerchio con l'icona, una riga in grassetto, una riga sotto. Un colore per significato
// (blu probabilità, ambra tempo, corallo errori, viola spiegazioni). I numeri veri stanno qui e non si ripetono nelle sezioni sotto.
const VANTAGGI: { icona: NomeIcona; tono: Tono; titolo: string; sotto: string }[] = [
  { icona: 'probabilita', tono: 'azione', titolo: 'Sai a che punto sei', sotto: `${DIAGNOSTIC_QUESTIONS} domande, 3 minuti` },
  { icona: 'simulazioni', tono: 'medio', titolo: 'Provi il test vero', sotto: 'a tempo, con la soglia' },
  { icona: 'errori', tono: 'basso', titolo: 'Ripassi ciò che sbagli', sotto: `${questions.length} domande` },
  { icona: 'spiegazioni', tono: 'viola', titolo: 'Capisci perché', sotto: 'spiegazioni in italiano' },
];

// Fascia di vetro con i quattro vantaggi: 2x2 sul telefono, in fila da 1024 px. Sale sul bordo basso della scena.
export default function Vantaggi() {
  return (
    <Colonna className="relative z-10 -mt-16 lg:-mt-24">
      <ul data-testo-ok className="vetro vetro-forte grid grid-cols-2 gap-x-4 gap-y-6 rounded-[32px] px-5 py-6 sm:px-8 lg:grid-cols-4 lg:gap-x-8 lg:py-7" aria-label="I vantaggi in breve">
        {VANTAGGI.map(({ icona, tono, titolo, sotto }, i) => (
          <li key={titolo} className={`flex flex-col items-center gap-3 text-center lg:flex-row lg:items-center lg:text-left ${i > 0 ? 'lg:border-l lg:border-linea lg:pl-8' : ''}`}>
            <IconaTono tono={tono} lato={56} className="!rounded-full lg:!h-14 lg:!w-14"><Icona nome={icona} size={26} /></IconaTono>
            <span>
              <span className="block text-sm font-bold leading-snug text-testo sm:text-base">{titolo}</span>
              <span className="mt-0.5 block text-xs font-medium leading-snug text-testo-tenue sm:text-sm">{sotto}</span>
            </span>
          </li>
        ))}
      </ul>
    </Colonna>
  );
}
