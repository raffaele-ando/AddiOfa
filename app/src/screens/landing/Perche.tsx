import { EXAM } from '../../config/offer';
import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import bannerEdificio from '../../brand/essenziali/landing/banner-edificio.webp';
import { Colonna, InfoFoglio } from './comune';

// «Tutto ciò che ti serve» (concetti 12 e 45): quattro schede con l'illustrazione grande del kit, poi il dato (la soglia del test, in un anello)
// e il banner con l'edificio. Niente numeri già detti nella striscia dei vantaggi; il dato è quello del test di recupero.
const SCHEDE = [
  { illustrazione: 'quiz-test', titolo: 'Quiz interattivi', testo: 'Domande come nel test vero, con la spiegazione.' },
  { illustrazione: 'attesa-caricamento', titolo: 'Simulazioni', testo: 'Timer e formato del test di recupero.' },
  { illustrazione: 'progressi-statistiche', titolo: 'Analisi del livello', testo: 'Statistiche chiare, argomento per argomento.' },
  { illustrazione: 'suggerimenti-consigli', titolo: 'Spiegazioni semplici', testo: 'Teoria, esempi e consigli in italiano.' },
];

/** Anello della soglia: 25 su 30 (83 %). Tutto fermo. */
function Anello() {
  const R = 62, C = 2 * Math.PI * R, f = EXAM.passMark / EXAM.questions;
  return (
    <div className="relative h-40 w-40 shrink-0" role="img" aria-label={`Soglia: ${EXAM.passMark} risposte esatte su ${EXAM.questions}`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden focusable="false">
        <defs>
          <linearGradient id="anello-soglia" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-azione)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--color-azione)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-linea)" strokeWidth="14" />
        <circle cx="80" cy="80" r={R} fill="none" stroke="url(#anello-soglia)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * f} ${C}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2rem] font-extrabold leading-none tracking-tight text-testo">{EXAM.passMark}/{EXAM.questions}</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-testo-tenue">soglia</span>
      </div>
    </div>
  );
}

export default function Perche({ onStart }: { onStart(): void }) {
  return (
    <section id="perche" aria-labelledby="t-perche" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-testo-ok>
          <h2 id="t-perche" className="max-w-xl text-[2.1rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-testo sm:text-[2.6rem]">
            Tutto ciò che ti serve <span className="text-azione">per arrivare preparato.</span>
          </h2>
          <button type="button" onClick={onStart}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-azione-tinta px-5 py-3 text-sm font-bold text-azione-testo hover:bg-azione hover:text-azione-su transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione sm:self-auto">
            Parti dal diagnostico<Icona nome="avanti" size={18} />
          </button>
        </div>

        <ul data-testo-ok className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {SCHEDE.map(s => (
            <li key={s.titolo} className="vetro flex flex-col items-center rounded-[26px] px-4 pb-6 pt-7 text-center sm:px-5">
              <div className="flex h-[5.5rem] items-end sm:h-28"><Illustrazione nome={s.illustrazione} lato={104} style={{ width: 'auto' }} /></div>
              <h3 className="mt-4 text-base font-extrabold leading-snug text-testo sm:text-[17px]">{s.titolo}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-testo-tenue sm:text-sm">{s.testo}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="vetro flex flex-col items-center gap-5 rounded-[28px] p-6 sm:flex-row sm:p-8 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Anello />
            <div data-testo-ok>
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-azione-testo">
                Il test in cifre
                <InfoFoglio titolo="Il test di recupero" etichetta="Informazioni sul test">
                  <p>Il test di riferimento è quello di recupero nel formato LinguaViva: {EXAM.questions} domande, {EXAM.minutes} minuti, si supera con {EXAM.passMark} risposte esatte. Le regole possono cambiare: controlla il regolamento del tuo corso.</p>
                </InfoFoglio>
              </p>
              <h3 className="mt-1 text-[1.45rem] font-extrabold leading-tight text-testo">{EXAM.passMark} risposte esatte su {EXAM.questions}.</h3>
              <p className="mt-2 text-sm leading-relaxed text-testo-tenue">Hai {EXAM.minutes} minuti. AddiOFA ti fa provare lo stesso formato, finché non lo senti tuo.</p>
            </div>
          </div>

          {/* banner con l'edificio: foto a destra, sfumata nel fondo notte; il testo sta sul fondo scuro */}
          <div className="relative flex min-h-[19rem] overflow-hidden rounded-[28px] text-white [background:linear-gradient(110deg,var(--landing-blocco-scuro-da),var(--landing-blocco-scuro-a))] sm:min-h-[17rem]">
            <img src={bannerEdificio} alt="" draggable={false} aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 h-full w-[88%] select-none object-cover object-right opacity-90 [mask-image:linear-gradient(to_right,transparent,#000_60%)] dark:brightness-[.82] dark:saturate-[.7] sm:w-[62%] sm:[mask-image:linear-gradient(to_right,transparent,#000_52%)]" />
            {/* tema scuro: la foto si abbassa verso il fondo (velo del colore di fondo scuro, più forte in basso), con la stessa sfumatura della foto */}
            <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[88%] [background:linear-gradient(to_top,rgba(10,16,31,0.55),rgba(10,16,31,0.15))] [mask-image:linear-gradient(to_right,transparent,#000_60%)] dark:block sm:w-[62%] sm:[mask-image:linear-gradient(to_right,transparent,#000_52%)]" />
            <div data-testo-ok className="relative z-10 flex max-w-[22rem] flex-col justify-between p-6 sm:p-9">
              <div>
                <h3 className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2rem]">Il tuo futuro non si ferma a un esame.</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/85 sm:text-[15px]">Superare l'OFA ti permette di completare il piano degli studi e di inserire anche gli esami del 2° anno, senza ostacoli.</p>
              </div>
              <button type="button" onClick={onStart} aria-label="Fai il diagnostico"
                className="mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <Icona nome="avanti" size={24} />
              </button>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
