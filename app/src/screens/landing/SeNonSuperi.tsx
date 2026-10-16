import { OFA_DEADLINES, OFA_RULES_NOTE, FREE_LIMITS } from '../../config/offer';
import { Icona } from '../../brand/icone/Icona';
import { IconaTono } from '../extra/ui';
import { Colonna, Evidenza, InfoFoglio } from './comune';
import { CONSEGUENZE, TestoOfa } from './dati';
import { cn } from '../../lib/utils';

// «Se non superi»: tre fatti veri (icona + numero) e le date del calendario 2026/27. La definizione dell'OFA sta dietro la «i».
const INCLINAZIONI = ['lg:rotate-[-1.5deg] lg:translate-y-6', 'lg:rotate-[-1deg] lg:translate-y-3', 'lg:rotate-[0.5deg]'];

export default function SeNonSuperi({ onStart }: { onStart(): void }) {
  return (
    <section aria-labelledby="t-ofa" className="relative scroll-mt-20 py-14 sm:py-20 lg:py-24">
      <Colonna>
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.4fr] lg:gap-6">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold text-testo-tenue" aria-hidden>
              <span>01</span><span className="h-px w-16 bg-azione" /><span className="h-px w-24 bg-linea" />
            </p>
            <div className="mt-5 flex items-start gap-2">
              <h2 id="t-ofa" className="text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
                Se <Evidenza>non superi</Evidenza>
              </h2>
              <InfoFoglio titolo="OFA di inglese" etichetta="Che cos'è l'OFA"><TestoOfa /></InfoFoglio>
            </div>
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
              {CONSEGUENZE.map((c, i) => (
                <li key={c.etichetta} className={cn('lg:-mr-3 lg:w-[24%] lg:min-w-0 lg:shrink-0', i === CONSEGUENZE.length - 1 && 'col-span-2 lg:col-span-1', INCLINAZIONI[i])}>
                  <div className="vetro flex h-full min-h-[10rem] flex-col items-center justify-center gap-3 rounded-[26px] p-4 text-center sm:p-5 lg:min-h-[15rem]">
                    <IconaTono tono={c.tono} lato={56}><Icona nome={c.icona} size={30} /></IconaTono>
                    <span className="text-2xl font-extrabold leading-none text-testo">{c.valore}</span>
                    <span className="text-xs font-semibold text-testo-tenue sm:text-sm">{c.etichetta}</span>
                  </div>
                </li>
              ))}
              <li className="col-span-2 lg:col-span-1 lg:ml-2 lg:w-[25%] lg:shrink-0 lg:-translate-y-4 lg:rotate-[-1.5deg]">
                <div className="vetro relative flex h-full min-h-[10rem] flex-col items-center justify-center gap-3 rounded-[26px] !border-azione/50 !bg-azione-tinta p-5 text-center lg:min-h-[17rem]">
                  <Icona nome="diagnostico" size={44} className="text-azione" />
                  <span className="text-2xl font-extrabold leading-none text-testo">{FREE_LIMITS.diagnostic} <span className="text-base font-bold text-azione-scuro">domande</span></span>
                  <button
                    type="button"
                    onClick={onStart}
                    aria-label="Fai il diagnostico"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-azione text-azione-su hover:bg-azione-scuro transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione"
                  >
                    <Icona nome="avanti" size={24} />
                  </button>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="vetro mt-10 rounded-[28px] p-5 sm:p-6 lg:mt-14">
          <div className="grid gap-4 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-8">
            <div className="flex items-center gap-3">
              <IconaTono tono="medio" lato={48} className="!rounded-full"><Icona nome="scadenze-piano" size={26} /></IconaTono>
              <h3 className="text-lg font-bold text-testo">Scadenze 2026/27</h3>
              <InfoFoglio titolo="Scadenze" etichetta="Informazioni sulle scadenze">
                <p>Date del calendario 2026/27 del Politecnico per avere il piano completo del 2° anno. {OFA_RULES_NOTE}</p>
              </InfoFoglio>
            </div>
            <dl className="grid grid-cols-3 gap-3 sm:gap-6">
              {OFA_DEADLINES.map(d => (
                <div key={d.scuola} className="rounded-2xl bg-medio-tinta px-3 py-2.5 text-center sm:px-5">
                  <dt className="text-xs font-semibold text-medio-testo sm:text-sm">{d.scuola}</dt>
                  <dd className="text-sm font-extrabold text-testo sm:text-base">{d.data}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
