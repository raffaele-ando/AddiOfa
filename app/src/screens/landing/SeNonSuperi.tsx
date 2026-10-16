import { OFA_DEADLINES, OFA_RULES_NOTE, RETAKE_COST_EUR, EXAM } from '../../config/offer';
import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { Colonna, InfoFoglio } from './comune';
import { TestoOfa } from './dati';
import { cn } from '../../lib/utils';

// «Cos'è l'OFA di inglese?» (concetto 41): a sinistra titolo, due righe e un pulsante; a destra quattro carte di vetro con un'illustrazione
// grande, su un filo rosso che sale fino alla carta blu «Con AddiOFA...». Le cifre sono quelle vere (config/offer.ts).
const CARTE: { illustrazione: string; titolo: string; sotto: string; classe: string }[] = [
  { illustrazione: 'mancato-superamento', titolo: 'Non superi l\'OFA', sotto: `sotto ${EXAM.passMark} su ${EXAM.questions}`, classe: 'lg:translate-y-9 lg:rotate-[-2deg]' },
  { illustrazione: 'rischio-economico', titolo: `Circa ${RETAKE_COST_EUR} € a tentativo`, sotto: 'presso gli enti convenzionati', classe: 'lg:translate-y-5 lg:rotate-[-1.5deg]' },
  { illustrazione: 'piano-studi-bloccato', titolo: 'Piano di studi bloccato', sotto: 'solo esami del 1° anno', classe: 'lg:translate-y-1 lg:rotate-[-1deg]' },
  { illustrazione: 'accesso-bloccato', titolo: 'Il piano del 2° anno', sotto: 'scadenze a fine estate', classe: 'lg:-translate-y-3 lg:rotate-[-0.5deg]' },
];

export default function SeNonSuperi({ onStart }: { onStart(): void }) {
  return (
    <section id="ofa" aria-labelledby="t-ofa" className="relative scroll-mt-20 py-16 sm:py-20 lg:py-24">
      <Colonna>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,21rem)_1fr] lg:gap-8">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold text-testo-tenue" aria-hidden>
              <span>01</span><span className="h-0.5 w-14 rounded bg-azione" /><span className="h-px w-28 bg-linea" />
            </p>
            <h2 id="t-ofa" data-testo-ok className="mt-5 text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.03em] text-testo sm:text-5xl">
              Cos'è<br />l'<span className="text-azione">OFA di inglese?</span>
            </h2>
            <p data-testo-ok className="mt-5 max-w-sm text-base leading-relaxed text-testo-tenue">
              Un obbligo formativo aggiuntivo: lo togli superando un test di inglese. Se non lo superi, il piano degli studi resta limitato e ogni nuovo tentativo ha un costo.
            </p>
            <InfoFoglio titolo="OFA di inglese: tutti i rischi" etichetta="Scopri tutti i rischi"
              bottone={apri => (
                <button type="button" onClick={apri}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-testo/30 bg-superficie/60 px-6 py-3 text-base font-bold text-testo hover:bg-linea transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione">
                  Scopri tutti i rischi<Icona nome="avanti" size={18} />
                </button>
              )}>
              <TestoOfa />
              <dl className="mt-3 grid grid-cols-3 gap-2">
                {OFA_DEADLINES.map(d => (
                  <div key={d.scuola} className="rounded-xl bg-medio-tinta px-2 py-2 text-center">
                    <dt className="text-xs font-semibold text-medio-testo">{d.scuola}</dt>
                    <dd className="text-sm font-extrabold text-testo">{d.data}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-xs text-testo-tenue">Scadenze del calendario 2026/27 per avere il piano completo del 2° anno. {OFA_RULES_NOTE}</p>
            </InfoFoglio>
          </div>

          <div className="relative">
            {/* filo rosso che attraversa le carte e sale fino alla carta blu */}
            <svg aria-hidden viewBox="0 0 800 300" className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-72 w-full -translate-y-1/2 lg:block" preserveAspectRatio="none" focusable="false">
              <defs>
                <linearGradient id="filo-rosso" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="var(--landing-rosso-linea)" stopOpacity="0" />
                  <stop offset=".18" stopColor="var(--landing-rosso-linea)" stopOpacity=".55" />
                  <stop offset="1" stopColor="var(--landing-rosso-linea)" stopOpacity=".9" />
                </linearGradient>
              </defs>
              <path d="M0 215C110 190 170 250 270 215S430 170 520 190S640 120 760 120" fill="none" stroke="var(--landing-rosso-linea)" strokeOpacity=".22" strokeWidth="30" strokeLinecap="round" />
              <path d="M0 215C110 190 170 250 270 215S430 170 520 190S640 120 760 120" fill="none" stroke="url(#filo-rosso)" strokeWidth="10" strokeLinecap="round" />
              <path d="M752 104L786 120L752 138Z" fill="var(--landing-rosso-linea)" />
            </svg>

            <ol data-testo-ok className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:flex lg:items-stretch lg:gap-3">
              {CARTE.map(c => (
                <li key={c.illustrazione} className={cn('lg:min-w-0 lg:flex-1', c.classe)}>
                  <div className="vetro flex h-full min-h-[12rem] flex-col items-start justify-between gap-3 rounded-[24px] p-4 text-left lg:min-h-[16rem]">
                    <div>
                      <span className="block text-[15px] font-extrabold leading-tight text-testo">{c.titolo}</span>
                      <span className="mt-1 block text-xs font-medium leading-snug text-testo-tenue">{c.sotto}</span>
                    </div>
                    <Illustrazione nome={c.illustrazione} lato={88} style={{ alignSelf: 'center' }} />
                  </div>
                </li>
              ))}
              <li className="col-span-2 lg:col-span-1 lg:min-w-0 lg:flex-[1.3] lg:-translate-y-8 lg:rotate-[-1.5deg]">
                <div className="vetro relative flex h-full min-h-[11rem] flex-col items-start justify-between gap-4 rounded-[26px] !border-azione/45 !bg-azione-tinta p-5 lg:min-h-[17rem]">
                  <p className="text-[17px] font-extrabold leading-snug text-testo">Con AddiOFA ti prepari <span className="text-azione-scuro">ed eviti tutto questo.</span></p>
                  <div className="flex w-full items-end justify-between">
                    <Illustrazione nome="progressi-statistiche" lato={62} />
                    <button
                      type="button"
                      onClick={onStart}
                      aria-label="Fai il diagnostico"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-azione text-azione-su hover:bg-azione-scuro transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione"
                    >
                      <Icona nome="avanti" size={24} />
                    </button>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
