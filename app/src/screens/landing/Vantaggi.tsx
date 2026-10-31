import { DIAGNOSTIC_QUESTIONS, EXAM } from '../../config/offer';
import { questions } from '../../data/questions';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { Colonna } from './comune';

// Striscia dei quattro vantaggi: una voce per cosa che fai, tutte all'imperativo come i pulsanti. Icone di un solo tono (il blu del marchio).
// Qui stanno i numeri veri (domande, minuti, ripasso) e non si ripetono nelle sezioni sotto. Sale di 24 px sul bordo basso della scena.
const VANTAGGI: { icona: NomeIcona; titolo: string; sotto: string }[] = [
  { icona: 'diagnostico', titolo: 'Scopri il tuo livello', sotto: `${DIAGNOSTIC_QUESTIONS} domande, 3 minuti` },
  { icona: 'simulazioni', titolo: 'Simula il test vero', sotto: `${EXAM.questions} domande, ${EXAM.minutes} minuti` },
  { icona: 'errori', titolo: 'Ripassa i tuoi errori', sotto: `tra ${questions.length} domande` },
  { icona: 'spiegazioni', titolo: 'Capisci perché', sotto: 'ogni risposta è spiegata' },
];

export default function Vantaggi() {
  return (
    <Colonna className="relative z-10 -mt-6">
      <ul data-testo-ok className="vetro vetro-forte grid grid-cols-2 gap-x-4 gap-y-5 rounded-3xl px-4 py-5 sm:px-8 lg:grid-cols-4 lg:gap-x-0 lg:py-5" aria-label="I vantaggi in breve">
        {VANTAGGI.map(({ icona, titolo, sotto }, i) => (
          <li key={titolo} className={`flex flex-col items-center gap-2.5 text-center lg:flex-row lg:items-start lg:gap-3 lg:text-left ${i > 0 ? 'lg:border-l lg:border-linea lg:pl-8' : 'lg:pl-2'}`}>
            <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-azione-tinta text-azione-testo"><Icona nome={icona} size={22} /></span>
            <span>
              <span className="block text-[15px] font-bold leading-snug text-testo">{titolo}</span>
              <span className="mt-0.5 block text-[13px] font-medium leading-snug text-testo-tenue">{sotto}</span>
            </span>
          </li>
        ))}
      </ul>
    </Colonna>
  );
}
