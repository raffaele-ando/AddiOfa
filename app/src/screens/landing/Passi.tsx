import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { IconaTono, type Tono } from '../extra/ui';
import { DIAGNOSTIC_QUESTIONS, EXAM } from '../../config/offer';
import { questions } from '../../data/questions';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { BottoneAzione, Colonna, Dato, Occhiello } from './comune';
import Telefono from './Telefono';

// Mini-schermate dei passi: disegnate con gli stessi token dell'app, ferme.
function Schermo({ children, inclina }: { children: ReactNode; inclina: string }) {
  return <div aria-hidden data-testo-ok className={`vetro vetro-forte mx-auto hidden h-[14.5rem] w-full max-w-[15rem] rounded-[24px] p-4 lg:block ${inclina}`}>{children}</div>;
}

const OPZIONI = ['go', 'goes', 'going', 'to go'];
function SchermoDiagnostico() {
  return (
    <Schermo inclina="lg:rotate-[-1deg]">
      <div className="mb-2 flex gap-1" aria-hidden>{[0, 1, 2].map(i => <span key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? 'bg-azione' : 'bg-linea'}`} />)}</div>
      <p className="text-[10px] font-semibold text-testo-tenue">Scegli la forma corretta</p>
      <p className="mt-0.5 text-[13px] font-bold text-testo">She ___ to Milan every day.</p>
      <ul className="mt-2.5 space-y-1.5">
        {OPZIONI.map((o, i) => (
          <li key={o} className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold ${i === 1 ? 'border-azione bg-azione-tinta text-azione-scuro' : 'border-linea bg-superficie text-testo'}`}>
            <span className={`h-3 w-3 rounded-full border-2 ${i === 1 ? 'border-azione bg-azione' : 'border-tacca'}`} />{o}
          </li>
        ))}
      </ul>
    </Schermo>
  );
}

function SchermoRipasso() {
  const righe = ['Domande sbagliate', 'Quiz mirati', 'Teoria in italiano'];
  return (
    <Schermo inclina="lg:rotate-[1deg]">
      <p className="text-[10px] font-semibold text-testo-tenue">Ripasso su misura</p>
      <ul className="mt-2.5 space-y-2.5">
        {righe.map(r => (
          <li key={r} className="flex items-center gap-2.5 rounded-xl border border-linea bg-superficie px-3 py-2.5 text-[12px] font-bold text-testo">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-alto-tinta text-alto-pieno"><Icona nome="stato-incluso" size={14} /></span>{r}
          </li>
        ))}
      </ul>
    </Schermo>
  );
}

function SchermoSimulazione() {
  return (
    <Schermo inclina="lg:rotate-[-1deg]">
      <p className="text-[10px] font-semibold text-testo-tenue">Simulazione</p>
      <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-testo"><Icona nome="tempo" size={15} className="text-azione" />{EXAM.minutes} minuti</div>
      <div className="mt-1.5 flex items-center gap-2 text-[12px] font-bold text-testo"><Icona nome="risposte" size={15} className="text-azione" />{EXAM.questions} domande</div>
      <p className="mt-1.5 text-[11px] font-medium text-testo-tenue">Soglia {EXAM.passMark} su {EXAM.questions}</p>
      <div className="mt-4 rounded-xl bg-azione py-2.5 text-center text-xs font-bold text-azione-su">Inizia la simulazione</div>
    </Schermo>
  );
}

// I quattro passi: icona + 1-3 parole + un numero.
const PASSI: { icona: NomeIcona; tono: Tono; titolo: string; numeri: { icona: NomeIcona; testo: string }[]; Schermo: () => ReactNode }[] = [
  {
    icona: 'diagnostico', tono: 'azione', titolo: 'Diagnostico', Schermo: SchermoDiagnostico,
    numeri: [{ icona: 'risposte', testo: String(DIAGNOSTIC_QUESTIONS) }, { icona: 'tempo', testo: '3 min' }],
  },
  {
    icona: 'errori', tono: 'basso', titolo: 'Ripasso errori', Schermo: SchermoRipasso,
    numeri: [{ icona: 'risposte', testo: String(questions.length) }],
  },
  {
    icona: 'simulazioni', tono: 'medio', titolo: 'Simulazioni', Schermo: SchermoSimulazione,
    numeri: [{ icona: 'risposte', testo: String(EXAM.questions) }, { icona: 'tempo', testo: `${EXAM.minutes} min` }],
  },
  {
    icona: 'esame', tono: 'alto', titolo: 'Test vero', numeri: [{ icona: 'soglia', testo: `${EXAM.passMark}/${EXAM.questions}` }],
    Schermo: () => (
      <Schermo inclina="lg:rotate-[1deg]">
        <div className="flex h-full items-center justify-center"><IllustrazioneAnimata nome="superamento" lato={150} quandoVisibile /></div>
      </Schermo>
    ),
  },
];

// «Come funziona»: da 1024 px titolo a sinistra e quattro mini-schermate; sotto, passi in colonna e telefono a destra.
export default function Passi({ onStart }: { onStart(): void }) {
  return (
    <section id="come-funziona" aria-labelledby="t-passi" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_2.05fr] lg:gap-10">
          <div className="lg:pt-6">
            <Occhiello icona="studia">4 passi</Occhiello>
            <h2 id="t-passi" className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
              Come <span className="text-azione">funziona</span>
            </h2>
            <div className="mt-6 hidden lg:block">
              <BottoneAzione onClick={onStart}>Diagnostico</BottoneAzione>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_10.5rem] gap-3 sm:grid-cols-[1fr_16rem] lg:block">
            <ol className="relative flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-5">
              {PASSI.map((p, i) => (
                <li key={p.titolo} className="relative pl-14 lg:pl-0">
                  {i < PASSI.length - 1 && <span aria-hidden className="absolute left-[23px] top-12 -bottom-6 w-0.5 bg-azione/25 lg:hidden" />}
                  <div className="flex items-center gap-3 lg:mb-4">
                    <IconaTono tono={p.tono} lato={48} className="absolute left-0 top-0 !rounded-full ring-4 ring-fondo lg:static lg:!h-10 lg:!w-10 lg:ring-0">
                      <Icona nome={p.icona} size={24} />
                    </IconaTono>
                    <h3 className="text-base font-bold leading-snug text-testo lg:text-[15px]">{p.titolo}</h3>
                  </div>
                  {p.Schermo()}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm lg:mt-4 lg:justify-center">
                    {p.numeri.map(n => <Dato key={n.icona + n.testo} icona={n.icona} tono="azione" lato={28}>{n.testo}</Dato>)}
                  </div>
                </li>
              ))}
            </ol>
            <div className="relative h-[19rem] w-full lg:hidden sm:h-[26rem]" aria-hidden>
              <div className="absolute left-0 top-0 w-[290px] origin-top-left scale-[.52] sm:scale-[.8]"><Telefono pillole={false} /></div>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
