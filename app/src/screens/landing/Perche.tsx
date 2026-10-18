import { EXAM } from '../../config/offer';
import { questions } from '../../data/questions';
import bannerEdificio from '../../brand/essenziali/landing/banner-edificio.webp';
import type { LegalSection } from '../../types';
import { BottoneLink, InfoFoglio, Occhiello, Sezione, TITOLO_H2 } from './comune';

// «Perché fidarti»: il dato del test (soglia 25 su 30, in un anello) e un riquadro con tre fatti veri (domande con spiegazione, dati nel dispositivo,
// progetto indipendente). Niente slogan: ogni riga si può verificare. Il numero delle domande viene da data/questions.

/** Anello della soglia: 25 su 30 (83 %). Tutto fermo. La traccia è del colore del testo al 20 %, così si legge anche nel tema scuro. */
function Anello() {
  const R = 62, C = 2 * Math.PI * R, f = EXAM.passMark / EXAM.questions;
  return (
    <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36" role="img" aria-label={`Soglia: ${EXAM.passMark} risposte esatte su ${EXAM.questions}`}>
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden focusable="false">
        <defs>
          <linearGradient id="anello-soglia" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--color-azione)" stopOpacity=".55" />
            <stop offset="1" stopColor="var(--color-azione)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={R} fill="none" stroke="currentColor" strokeWidth="14" className="text-testo/20" />
        <circle cx="80" cy="80" r={R} fill="none" stroke="url(#anello-soglia)" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * f} ${C}`} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[1.5rem] font-extrabold leading-none tracking-tight text-testo sm:text-[1.9rem]">{EXAM.passMark}/{EXAM.questions}</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-testo-tenue">soglia</span>
      </div>
    </div>
  );
}

export default function Perche({ onOpenLegal }: { onOpenLegal(s: LegalSection): void }) {
  return (
    <Sezione id="perche" titoloId="t-perche">
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-6">
        <div className="flex items-center gap-5 rounded-[28px] border border-linea bg-superficie p-5 sm:gap-8 sm:p-8">
          <Anello />
          <div data-testo-ok>
            <Occhiello>Il test in cifre</Occhiello>
            <h2 id="t-perche" className="mt-1 text-[1.4rem] font-extrabold leading-tight tracking-tight text-testo lg:text-[1.75rem]">{EXAM.passMark} risposte esatte su {EXAM.questions}.</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-testo-tenue">Il test vero: {EXAM.questions} domande, {EXAM.minutes} minuti. Qui lo simuli quante volte vuoi.</p>
            <InfoFoglio titolo="Il test di recupero" etichetta="Fonte e regole del test"
              bottone={apri => <BottoneLink onClick={apri} className="mt-1 !min-h-9 !text-sm">Fonte e regole</BottoneLink>}>
              <p>Il test di riferimento è quello di recupero nel formato LinguaViva: {EXAM.questions} domande, {EXAM.minutes} minuti, si supera con {EXAM.passMark} risposte esatte. Le regole possono cambiare: controlla il regolamento del tuo corso.</p>
            </InfoFoglio>
          </div>
        </div>

        {/* riquadro di fiducia: l'immagine sta a destra e, nel tema scuro, è rigradata in blu notte (landing.css); sul telefono sta sopra il testo */}
        <div className="relative flex flex-col overflow-hidden rounded-[28px] text-white [background:linear-gradient(110deg,var(--landing-blocco-scuro-da),var(--landing-blocco-scuro-a))] sm:min-h-[17rem]">
          <div aria-hidden className="landing-notte landing-notte-banner pointer-events-none relative h-36 sm:absolute sm:inset-y-0 sm:right-0 sm:h-full sm:w-[58%]">
            <img src={bannerEdificio} alt="" draggable={false} className="h-full w-full select-none object-cover object-[70%_40%]" />
          </div>
          <div data-testo-ok className="relative z-10 flex flex-col gap-3 p-6 sm:max-w-[24rem] sm:p-8">
            <h3 className="text-[1.5rem] font-extrabold leading-[1.15] tracking-tight sm:text-[1.75rem]">Un progetto studentesco, indipendente dal Politecnico.</h3>
            <p className="text-[15px] leading-relaxed text-white/90">Le {questions.length} domande hanno la spiegazione in italiano e i tuoi progressi restano sul tuo dispositivo.</p>
            <button type="button" onClick={() => onOpenLegal('privacy')}
              className="inline-flex min-h-11 items-center self-start rounded text-[15px] font-bold text-white underline underline-offset-4 hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              Come usiamo i tuoi dati
            </button>
          </div>
        </div>
      </div>
    </Sezione>
  );
}
