import type { ReactNode } from 'react';
import { Check, Clock, ListChecks } from 'lucide-react';
import { FORMATS, FREE_LIMITS } from '../../config/offer';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { BottoneAzione, Colonna, Occhiello } from './comune';
import Telefono from './Telefono';

// Mini-schermate dei passi: disegnate con gli stessi token dell'app, ferme.
function Schermo({ children, inclina }: { children: ReactNode; inclina: string }) {
  return <div aria-hidden className={`vetro vetro-forte mx-auto hidden h-[14.5rem] w-full max-w-[15rem] rounded-[24px] p-4 lg:block ${inclina}`}>{children}</div>;
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
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-alto-tinta text-alto-pieno"><Check size={14} strokeWidth={3.4} /></span>{r}
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
      <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-testo"><Clock size={15} className="text-azione" />{FORMATS.ente.minutes} minuti</div>
      <div className="mt-1.5 flex items-center gap-2 text-[12px] font-bold text-testo"><ListChecks size={15} className="text-azione" />{FORMATS.ente.questions} domande</div>
      <p className="mt-1.5 text-[11px] font-medium text-testo-tenue">Soglia {FORMATS.ente.passMark} su {FORMATS.ente.questions}</p>
      <div className="mt-4 rounded-xl bg-azione py-2.5 text-center text-xs font-bold text-azione-su">Inizia la simulazione</div>
    </Schermo>
  );
}

// Le note dicono cosa è gratis (verde: ciò che ottieni) e cosa no; l'ultima è neutra perché sta fuori da AddiOFA.
const PASSI: { titolo: string; testo: string; nota: string; gratis?: boolean; Schermo: () => ReactNode }[] = [
  {
    titolo: 'Test iniziale',
    testo: `${FREE_LIMITS.diagnostic} domande, circa 3 minuti, senza account. Vedi la probabilità stimata e gli argomenti da ripassare.`,
    nota: 'Gratis', gratis: true, Schermo: SchermoDiagnostico,
  },
  {
    titolo: 'Ripasso su misura',
    testo: `Le domande sbagliate tornano, con la spiegazione in italiano. Parti da un nucleo di circa ${FREE_LIMITS.coreQuestions} domande.`,
    nota: 'Nucleo gratis, tutto il banco con il Pass', gratis: true, Schermo: SchermoRipasso,
  },
  {
    titolo: 'Simulazioni',
    testo: `Provi il test per intero: ${FORMATS.ente.questions} domande in ${FORMATS.ente.minutes} minuti, con la correzione.`,
    nota: 'Una gratis, illimitate con il Pass', gratis: true, Schermo: SchermoSimulazione,
  },
  {
    titolo: 'Il test vero',
    testo: 'Ci arrivi sapendo cosa aspettarti. Il test lo fai con il Politecnico o con l\'ente che scegli, non con noi.',
    nota: 'Si fa fuori da AddiOFA',
    Schermo: () => (
      <Schermo inclina="lg:rotate-[1deg]">
        <div className="flex h-full items-center justify-center"><IllustrazioneAnimata nome="superamento" lato={150} quandoVisibile /></div>
      </Schermo>
    ),
  },
];

// «Un percorso su misura, in 4 passi»: da 1024 px titolo a sinistra e quattro mini-schermate; sotto, passi in colonna e telefono a destra.
export default function Passi({ onStart }: { onStart(): void }) {
  return (
    <section id="come-funziona" aria-labelledby="t-passi" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_2.05fr] lg:gap-10">
          <div className="lg:pt-6">
            <Occhiello>Come funziona</Occhiello>
            <h2 id="t-passi" className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
              Un percorso su misura, in <span className="text-azione">4 passi.</span>
            </h2>
            <p className="mt-4 max-w-sm text-base font-medium text-testo-tenue sm:text-lg">Dal test iniziale al test vero, un passo alla volta.</p>
            <div className="mt-6 hidden lg:block">
              <BottoneAzione onClick={onStart}>Inizia dal diagnostico</BottoneAzione>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_10.5rem] gap-3 sm:grid-cols-[1fr_16rem] lg:block">
            <ol className="relative flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-5">
              {PASSI.map((p, i) => (
                <li key={p.titolo} className="relative pl-12 lg:pl-0">
                  {i < PASSI.length - 1 && <span aria-hidden className="absolute left-[19px] top-10 -bottom-6 w-0.5 bg-azione/25 lg:hidden" />}
                  <div className="flex items-center gap-3 lg:mb-4">
                    <span aria-hidden className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-azione-tinta text-sm font-extrabold text-azione-scuro ring-4 ring-fondo lg:static lg:h-8 lg:w-8 lg:text-xs lg:ring-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-bold leading-snug text-testo lg:text-[15px]">{p.titolo}</h3>
                  </div>
                  {p.Schermo()}
                  <p className="mt-1 text-sm font-medium leading-snug text-testo-tenue lg:mt-4 lg:text-center">{p.testo}</p>
                  <p className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold lg:mt-3 lg:block lg:w-fit lg:self-center lg:mx-auto ${p.gratis ? 'bg-alto-tinta text-alto-testo' : 'bg-superficie-2 text-testo-tenue'}`}>{p.nota}</p>
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
