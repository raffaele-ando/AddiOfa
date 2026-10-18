import { useState, type ReactNode } from 'react';
import { DIAGNOSTIC_QUESTIONS, EXAM } from '../../config/offer';
import { cn } from '../../lib/utils';
import { BottoneAzione, Evidenza, Occhiello, Sezione, TITOLO_H2 } from './comune';
import { SchermoEsito, SchermoRipasso, SchermoSimulazione, SchermoTest, Telefono, type SchedaTelefono } from './TelefonoPassi';

// «Come funziona»: i quattro passi stanno sempre tutti in vista (elenco con filo), e accanto (desktop) o sotto (telefono) c'è un telefono grande
// con la schermata del passo scelto. Si cambia passo toccando una riga, subito, senza animazioni. Il primo è attivo all'apertura.
// Le schermate sono d'esempio e lo dicono (scritta «Esempio» sul telefono).
const PASSI: { titolo: string; testo: string; scheda: SchedaTelefono; Schermo: () => ReactNode }[] = [
  { titolo: 'Fai il test di livello', testo: `${DIAGNOSTIC_QUESTIONS} domande in 3 minuti: scopri a che punto sei.`, scheda: 'home', Schermo: SchermoTest },
  { titolo: 'Ripassa gli errori', testo: 'Rivedi ciò che sbagli con quiz mirati e teoria in italiano.', scheda: 'esercizi', Schermo: SchermoRipasso },
  { titolo: 'Allenati con le simulazioni', testo: `Stesso formato del test: ${EXAM.questions} domande, ${EXAM.minutes} minuti, correzione dettagliata.`, scheda: 'home', Schermo: SchermoSimulazione },
  { titolo: 'Arriva pronto', testo: `Quando le simulazioni arrivano a ${EXAM.passMark} su ${EXAM.questions}, sei in linea con la soglia del test.`, scheda: 'home', Schermo: SchermoEsito },
];

export default function Passi({ onStart }: { onStart(): void }) {
  const [attivo, setAttivo] = useState(0);
  const Schermo = PASSI[attivo].Schermo;
  return (
    <Sezione id="come-funziona" titoloId="t-passi">
      <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-x-12 lg:gap-y-6">
        <div data-testo-ok>
          <Occhiello>Come funziona</Occhiello>
          <h2 id="t-passi" className={cn(TITOLO_H2, 'mt-2')}>Come funziona, <Evidenza>in 4 passi</Evidenza></h2>
          <ol role="group" aria-label="Passi" className="mt-6 flex flex-col lg:mt-8">
            {PASSI.map((p, i) => {
              const on = i === attivo;
              return (
                <li key={p.titolo} className="relative">
                  {i < PASSI.length - 1 && <span aria-hidden className="absolute left-[calc(1.875rem-1px)] top-12 -bottom-3 w-0.5 bg-tacca" />}
                  <button type="button" aria-pressed={on} onClick={() => setAttivo(i)}
                    className={cn('flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione',
                      on ? 'border-azione/40 bg-azione-tinta' : 'border-transparent hover:bg-superficie-2')}>
                    <span aria-hidden className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full text-[15px] font-extrabold', on ? 'bg-azione text-azione-su' : 'border-2 border-azione-testo/50 bg-fondo text-azione-testo')}>{i + 1}</span>
                    <span className="min-w-0 pt-0.5">
                      <span className="block text-base font-bold leading-snug text-testo">{p.titolo}</span>
                      <span className="mt-0.5 block text-[14px] leading-snug text-testo-tenue">{p.testo}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* il telefono su una lastra blu inclinata: solo il passo scelto, senza movimento */}
        <figure data-scheda aria-label="Esempio della schermata del passo scelto" className="relative mx-auto lg:row-span-2 lg:row-start-1 lg:col-start-2 lg:self-center flex w-full max-w-[26rem] justify-center py-6 lg:max-w-none">
          <div aria-hidden className="absolute left-1/2 top-1/2 h-[88%] w-[78%] max-w-[22rem] -translate-x-1/2 -translate-y-1/2 rotate-[7deg] rounded-[44px] bg-gradient-to-br from-azione-tinta via-azione/25 to-azione/45" />
          <Telefono larghezza={280} altezzaSchermo={420} scheda={PASSI[attivo].scheda} className="relative rotate-[3deg] lg:rotate-[4deg]"><Schermo /></Telefono>
        </figure>
        <div className="lg:col-start-1 lg:row-start-2"><BottoneAzione onClick={onStart} className="w-full sm:w-auto">Inizia il test di livello</BottoneAzione></div>
      </div>
    </Sezione>
  );
}
