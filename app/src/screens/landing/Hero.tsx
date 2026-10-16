import { DISCLAIMER, EXAM } from '../../config/offer';
import Scena from '../../brand/hero/Scena';
import { Icona } from '../../brand/icone/Icona';
import { BottoneAzione, BottoneContorno, Colonna, Fatti, InfoFoglio, Occhiello } from './comune';
import { vaiA } from './Barra';

// Hero: titolo grande a sinistra, scena a destra che esce dal bordo. Sul telefono la scena sta sopra il testo.
// Testo: il titolo e una frase sono marketing (`data-testo-ok`); il resto sono icone e numeri; le avvertenze stanno dietro la «i».
export default function Hero({ onStart, onSkip, scuro }: { onStart(): void; onSkip(): void; scuro: boolean }) {
  return (
    <section id="home" aria-labelledby="t-hero" className="relative overflow-hidden scroll-mt-0">
      {/* sul telefono la scena sta sopra il testo, a tutta larghezza */}
      <div aria-hidden className="pointer-events-none relative mt-[4.25rem] sm:hidden">
        <Scena scuro={scuro} conCarte={false} />
      </div>
      <Colonna className="relative z-10 pb-10 pt-1 sm:pt-28 lg:pb-20 lg:pt-28 xl:pt-32">
        <div className="max-w-[26rem] sm:max-w-xl lg:max-w-[32rem] xl:max-w-[40rem]">
          <Occhiello icona="ofa">OFA di inglese</Occhiello>
          <h1 id="t-hero" data-testo-ok className="mt-3 text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-testo sm:text-6xl lg:text-[3.2rem] xl:text-[3.9rem]">
            Oltre l'OFA,
            <span className="block text-azione">un passo<br className="sm:hidden" /> in più.</span>
          </h1>
          <p data-testo-ok className="mt-4 max-w-[20rem] text-base font-medium leading-relaxed text-testo sm:max-w-md lg:text-[1.05rem]">
            Scopri la probabilità di superare il test.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BottoneAzione onClick={onStart} className="w-full whitespace-nowrap sm:w-auto">Fai il diagnostico</BottoneAzione>
            <BottoneContorno onClick={() => vaiA('come-funziona')} freccia className="hidden whitespace-nowrap sm:inline-flex">Come funziona</BottoneContorno>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Fatti />
            <InfoFoglio titolo="Il test e la stima">
              <div className="flex flex-col gap-2">
                <p>Il test di riferimento è quello di recupero nel formato LinguaViva: {EXAM.questions} domande in {EXAM.minutes} minuti, soglia {EXAM.passMark}/{EXAM.questions}.</p>
                <p>La probabilità è una stima calcolata sulle tue risposte e non garantisce l'esito. {DISCLAIMER}</p>
              </div>
            </InfoFoglio>
            <button type="button" onClick={onSkip} aria-label="Salta e vai all'app"
              className="inline-flex items-center gap-1.5 rounded px-1 py-1 text-sm font-semibold text-testo-tenue hover:text-azione focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione">
              <Icona nome="salta" size={16} />Salta
            </button>
          </div>
        </div>
      </Colonna>

      <div aria-hidden className="pointer-events-none absolute hidden sm:relative sm:left-auto sm:top-auto sm:-mt-6 sm:block sm:w-full lg:absolute lg:right-0 lg:top-10 lg:mt-0 lg:w-[70%] xl:w-[68%] min-[1500px]:w-[64%]">
        <Scena scuro={scuro} />
      </div>
    </section>
  );
}
