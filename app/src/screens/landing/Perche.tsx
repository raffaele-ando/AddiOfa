import { ArrowRight, BarChart3, FileCheck2, Lightbulb, Target } from 'lucide-react';
import { FORMATS, FREE_LIMITS } from '../../config/offer';
import Lastra from '../../brand/hero/Lastra';
import Misuratore from '../../components/home/Misuratore';
import { Colonna, Evidenza, Occhiello } from './comune';
import { cn } from '../../lib/utils';

const CARTE = [
  { Icona: BarChart3, tinta: 'bg-azione-tinta text-azione-scuro', titolo: 'Test iniziale', testo: `Scopri il tuo livello e la probabilità stimata, in ${FREE_LIMITS.diagnostic} domande.` },
  { Icona: Target, tinta: 'bg-basso-tinta text-basso-pieno', titolo: 'Ripasso su misura', testo: 'Le domande sbagliate tornano, con la spiegazione, finché non le sai.' },
  { Icona: FileCheck2, tinta: 'bg-alto-tinta text-alto-pieno', titolo: 'Simulazioni realistiche', testo: `${FORMATS.ente.questions} domande in ${FORMATS.ente.minutes} minuti, nel formato del test.` },
  { Icona: Lightbulb, tinta: 'bg-medio-tinta text-medio-pieno', titolo: 'Spiegazioni chiare', testo: 'Teoria in italiano, esempi e consigli pratici.' },
];

// «Più di un semplice quiz»: quattro carte, un esempio del misuratore e il blocco scuro con la porta di luce.
export default function Perche({ onStart }: { onStart(): void }) {
  return (
    <section id="perche" aria-labelledby="t-perche" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <div>
            <Occhiello>Perché AddiOFA</Occhiello>
            <h2 id="t-perche" className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
              Più di un <Evidenza>semplice quiz.</Evidenza>
            </h2>
            <p className="mt-4 max-w-xl text-base font-medium text-testo-tenue sm:text-lg">Tutto ciò che serve per arrivare al test sapendo cosa aspettarti.</p>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-3.5" aria-label="Cosa c'è in AddiOFA">
              {CARTE.map(({ Icona, tinta, titolo, testo }) => (
                <li key={titolo} className="vetro rounded-[24px] p-4">
                  <span aria-hidden className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', tinta)}><Icona size={24} /></span>
                  <h3 className="mt-3 text-[15px] font-bold leading-snug text-testo">{titolo}</h3>
                  <p className="mt-1 text-xs font-medium leading-snug text-testo-tenue sm:text-[13px]">{testo}</p>
                </li>
              ))}
            </ul>

            <div className="vetro mt-4 grid items-center gap-4 rounded-[28px] p-5 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:p-6">
              <div className="mx-auto w-full max-w-[14rem]">
                <Misuratore percento={72} livello="alto" etichetta="Esempio" sotto="valore di prova" />
              </div>
              <div>
                <span className="inline-block rounded-full bg-azione-tinta px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-azione-scuro">Esempio</span>
                <h3 className="mt-2 text-xl font-extrabold leading-tight text-testo sm:text-2xl">La probabilità stimata di superare il test</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-testo-tenue">
                  Si calcola sulle tue risposte. Con poche domande è approssimativa e non garantisce l'esito: si affina con le simulazioni.
                </p>
              </div>
            </div>
          </div>

          {/* blocco scuro: porta di luce su fondo notte */}
          <div className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[32px] p-7 text-white [background:linear-gradient(150deg,var(--landing-blocco-scuro-da),var(--landing-blocco-scuro-a))] sm:p-9 lg:min-h-0">
            <div aria-hidden className="pointer-events-none absolute bottom-0 right-[-3.5rem] w-[24rem] max-w-[90%] sm:right-4">
              <Lastra className="block w-full" />
            </div>
            <div className="relative max-w-[17rem]">
              <h3 className="text-[1.9rem] font-extrabold leading-[1.1] tracking-tight sm:text-4xl">Il tuo futuro non si ferma a un test.</h3>
              <p className="mt-4 text-sm font-medium leading-relaxed text-white sm:text-base">
                Togliere l'OFA ti permette di completare il piano degli studi e arrivare al secondo anno senza esami fermi.
              </p>
            </div>
            <button
              type="button"
              onClick={onStart}
              aria-label="Fai il diagnostico gratuito"
              className="relative mt-auto flex h-12 w-12 items-center justify-center self-start rounded-full bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowRight size={22} aria-hidden />
            </button>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
