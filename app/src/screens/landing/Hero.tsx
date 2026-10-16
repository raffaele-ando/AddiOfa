import { Clock, UserX, Gift } from 'lucide-react';
import { DISCLAIMER, FORMATS, FREE_LIMITS } from '../../config/offer';
import Scena from '../../brand/hero/Scena';
import { BottoneAzione, BottoneContorno, Colonna } from './comune';
import { vaiA } from './Barra';

// Gratis = verde (ciò che ottieni), senza account = blu, tempo = ambra.
const FATTI = [
  { Icona: Gift, testo: 'Gratis', colore: 'text-alto-numero' },
  { Icona: UserX, testo: 'Senza account', colore: 'text-azione-scuro' },
  { Icona: Clock, testo: 'Circa 3 minuti', colore: 'text-medio-numero' },
];

// Hero: titolo grande a sinistra, scena a destra che esce dal bordo. Sul telefono la scena sta sopra il testo.
export default function Hero({ onStart, onSkip, scuro }: { onStart(): void; onSkip(): void; scuro: boolean }) {
  return (
    <section id="home" aria-labelledby="t-hero" className="relative overflow-hidden scroll-mt-0">
      {/* sul telefono la scena sta sopra il testo, a tutta larghezza */}
      <div aria-hidden className="pointer-events-none relative mt-[4.25rem] sm:hidden">
        <Scena scuro={scuro} conCarte={false} />
      </div>
      <Colonna className="relative z-10 pb-10 pt-1 sm:pt-28 lg:pb-20 lg:pt-28 xl:pt-32">
        <div className="max-w-[26rem] sm:max-w-xl lg:max-w-[32rem] xl:max-w-[40rem]">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-testo sm:text-xs">
            Per chi ha l'OFA di inglese
          </p>
          <h1 id="t-hero" className="mt-3 text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-testo sm:text-6xl lg:text-[3.2rem] xl:text-[3.9rem]">
            Oltre l'OFA,
            <span className="block text-azione">un passo<br className="sm:hidden" /> in più.</span>
          </h1>
          <p className="mt-4 max-w-[15.5rem] text-base font-medium leading-relaxed text-testo sm:max-w-md lg:text-[1.05rem]">
            Scopri a che punto sei con {FREE_LIMITS.diagnostic} domande, vedi la probabilità stimata di superare il test e ripassa dai tuoi errori.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BottoneAzione onClick={onStart} className="w-full whitespace-nowrap sm:w-auto">Fai il diagnostico gratuito</BottoneAzione>
            <BottoneContorno onClick={() => vaiA('come-funziona')} freccia className="hidden whitespace-nowrap sm:inline-flex">Come funziona</BottoneContorno>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-testo" aria-label="In breve">
            {FATTI.map(({ Icona, testo, colore }) => (
              <li key={testo} className="flex items-center gap-1.5">
                <Icona size={16} className={colore} aria-hidden />{testo}
              </li>
            ))}
            <li className="flex items-center gap-1.5">
              <button type="button" onClick={() => { onSkip(); }} className="rounded font-semibold underline underline-offset-4 hover:text-azione focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione">
                Salta e vai all'app
              </button>
            </li>
          </ul>
          <p className="mt-4 max-w-sm text-[11px] font-medium leading-snug text-testo-tenue sm:max-w-lg sm:text-xs">
            Il test di riferimento è quello di recupero nel formato LinguaViva: {FORMATS.ente.questions} domande in {FORMATS.ente.minutes} minuti, soglia {FORMATS.ente.passMark}/{FORMATS.ente.questions}.
            La probabilità è una stima e non garantisce l'esito. {DISCLAIMER}
          </p>
        </div>
      </Colonna>

      <div aria-hidden className="pointer-events-none absolute hidden sm:relative sm:left-auto sm:top-auto sm:-mt-6 sm:block sm:w-full lg:absolute lg:right-0 lg:top-10 lg:mt-0 lg:w-[70%] xl:w-[68%] min-[1500px]:w-[64%]">
        <Scena scuro={scuro} />
      </div>
    </section>
  );
}
