import type { ComponentType } from 'react';
import { ArrowRight, BarChart3, CalendarDays, Lock, Wallet, X } from 'lucide-react';
import { FORMATS, OFA_DEADLINES, OFA_RULES_NOTE, RETAKE_COST_EUR } from '../../config/offer';
import { BottoneAzione, Colonna, Evidenza } from './comune';
import { cn } from '../../lib/utils';

type Icona = ComponentType<{ size?: number; strokeWidth?: number; className?: string; 'aria-hidden'?: boolean }>;

// Conseguenze dell'OFA: solo fatti presi da config/offer.ts. Nessun numero di studenti, nessuna percentuale.
const CATENA: { Icona: Icona; titolo: string; testo: string; inclina: string }[] = [
  { Icona: X, titolo: 'Non superi il test', testo: `Meno di ${FORMATS.ente.passMark} risposte esatte su ${FORMATS.ente.questions}`, inclina: 'lg:rotate-[-1.5deg] lg:translate-y-6' },
  { Icona: Wallet, titolo: `Un tentativo costa circa ${RETAKE_COST_EUR} €`, testo: 'Presso gli enti convenzionati', inclina: 'lg:rotate-[-1deg] lg:translate-y-3' },
  { Icona: Lock, titolo: 'Piano di studi bloccato', testo: 'Finché c\'è l\'OFA, solo esami del 1° anno', inclina: 'lg:rotate-[0.5deg]' },
  { Icona: CalendarDays, titolo: 'Scadenze del 2° anno', testo: 'Per il piano completo: tra fine agosto e fine settembre', inclina: 'lg:rotate-[1deg] lg:-translate-y-3' },
];

export default function SeNonSuperi({ onStart }: { onStart(): void }) {
  return (
    <section aria-labelledby="t-ofa" className="relative scroll-mt-20 py-14 sm:py-20 lg:py-24">
      <Colonna>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold text-testo-tenue" aria-hidden>
              <span>01</span><span className="h-px w-16 bg-azione" /><span className="h-px w-24 bg-linea" />
            </p>
            <h2 id="t-ofa" className="mt-5 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
              Cos'è <Evidenza>l'OFA di inglese?</Evidenza>
            </h2>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-testo-tenue sm:text-lg">
              Un obbligo formativo aggiuntivo d'inglese: per toglierlo si supera un test di recupero ({FORMATS.ente.questions} domande in {FORMATS.ente.minutes} minuti, soglia {FORMATS.ente.passMark} su {FORMATS.ente.questions}).
              Se non lo superi, un nuovo tentativo costa e il piano degli studi resta limitato.
            </p>
            <p className="mt-3 max-w-md text-sm font-medium text-testo-tenue">
              AddiOFA non cambia le regole né sostituisce il test: ti aiuta a sapere a che punto sei prima di affrontarlo.
            </p>
          </div>

          <div className="relative">
            {/* filo rosso che attraversa le conseguenze fino alla carta blu */}
            <svg aria-hidden viewBox="0 0 800 260" className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-64 w-full -translate-y-1/2 lg:block" preserveAspectRatio="none" focusable="false">
              <defs>
                <linearGradient id="filo-rosso" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="var(--landing-rosso-linea)" stopOpacity="0" />
                  <stop offset=".25" stopColor="var(--landing-rosso-linea)" stopOpacity=".65" />
                  <stop offset="1" stopColor="var(--landing-rosso-linea)" stopOpacity=".8" />
                </linearGradient>
              </defs>
              <path d="M10 190C140 150 230 215 340 170S520 120 600 150S720 120 790 118" fill="none" stroke="url(#filo-rosso)" strokeWidth="7" strokeLinecap="round" />
            </svg>

            <ol className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:items-stretch lg:gap-0">
              {CATENA.map(({ Icona, titolo, testo, inclina }, i) => (
                <li key={titolo} className={cn('lg:-mr-3 lg:w-[19%] lg:min-w-0 lg:shrink-0', inclina)}>
                  <div className="vetro flex h-full min-h-[11rem] flex-col rounded-[26px] p-4 sm:p-5 lg:min-h-[15rem]">
                    <span className="text-xs font-bold text-testo-tenue" aria-hidden>0{i + 1}</span>
                    <h3 className="mt-1 text-base font-bold leading-snug text-testo">{titolo}</h3>
                    <p className="mt-1 break-words text-xs font-medium leading-snug text-testo-tenue sm:text-sm lg:text-[13px]">{testo}</p>
                    <span aria-hidden className="mt-auto flex h-12 w-12 items-center justify-center self-center rounded-2xl bg-basso-tinta text-basso-pieno">
                      <Icona size={26} strokeWidth={2.6} />
                    </span>
                  </div>
                </li>
              ))}
              <li className="col-span-2 lg:col-span-1 lg:ml-2 lg:w-[25%] lg:shrink-0 lg:-translate-y-4 lg:rotate-[-1.5deg]">
                <div className="vetro relative flex h-full min-h-[11rem] flex-col rounded-[26px] !border-azione/50 !bg-azione-tinta p-5 lg:min-h-[17rem]">
                  <h3 className="text-lg font-bold leading-snug text-testo">Con AddiOFA<br />ti prepari <span className="text-azione-scuro">prima</span>.</h3>
                  <p className="mt-1 text-sm font-medium leading-snug text-testo">Diagnostico gratuito e ripasso dai tuoi errori.</p>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                    <BarChart3 size={52} strokeWidth={2.4} className="text-azione" aria-hidden />
                    <button
                      type="button"
                      onClick={onStart}
                      aria-label="Fai il diagnostico gratuito"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-azione text-azione-su hover:bg-azione-scuro transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione"
                    >
                      <ArrowRight size={22} strokeWidth={2.8} aria-hidden />
                    </button>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="vetro mt-10 rounded-[28px] p-5 sm:p-6 lg:mt-14">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-lg font-bold text-testo">Scadenze per il piano completo del 2° anno</h3>
              <p className="mt-1 text-xs font-medium text-testo-tenue sm:text-sm">Calendario 2026/27 del Politecnico. {OFA_RULES_NOTE}</p>
            </div>
            <dl className="grid grid-cols-3 gap-3 sm:gap-6">
              {OFA_DEADLINES.map(d => (
                <div key={d.scuola} className="rounded-2xl bg-azione-tinta px-3 py-2.5 text-center sm:px-5">
                  <dt className="text-xs font-semibold text-azione-scuro sm:text-sm">{d.scuola}</dt>
                  <dd className="text-sm font-extrabold text-testo sm:text-base">{d.data}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-5 flex justify-start lg:hidden">
            <BottoneAzione onClick={onStart} className="w-full sm:w-auto">Fai il diagnostico gratuito</BottoneAzione>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
