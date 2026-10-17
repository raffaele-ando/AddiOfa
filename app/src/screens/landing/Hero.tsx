import { DISCLAIMER, EXAM } from '../../config/offer';
import Scena from '../../brand/hero/Scena';
import { Icona } from '../../brand/icone/Icona';
import { BottoneAzione, BottoneContorno, Colonna, InfoFoglio } from './comune';
import { vaiA } from './Barra';

// Hero (concetti 41 e 45): a sinistra l'etichetta, il titolo grande, due righe e i due pulsanti; a destra la scena con la porta di luce
// e le carte di vetro vere. Sul telefono la scena sta sopra il titolo, ritagliata sulla porta. Il titolo e le frasi sono marketing (`data-testo-ok`).
export default function Hero({ onStart, onSkip, scuro }: { onStart(): void; onSkip(): void; scuro: boolean }) {
  return (
    <section id="home" aria-labelledby="t-hero" className="relative overflow-hidden scroll-mt-0 lg:min-h-[41rem]">
      {/* telefono: scena a tutta larghezza, ritagliata attorno alla porta */}
      <div aria-hidden className="pointer-events-none relative mt-[3.5rem] h-[18.5rem] overflow-hidden sm:hidden">
        <div className="absolute left-[-24%] top-0 w-[148%]"><Scena scuro={scuro} conCarte={false} /></div>
      </div>
      <Colonna className="relative z-10 pb-24 pt-2 sm:pt-28 lg:pb-32 lg:pt-36">
        <div className="max-w-[26rem] sm:max-w-xl lg:max-w-[33rem] xl:max-w-[38rem]">
          <p data-testo-ok className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-testo-tenue sm:text-xs">
            <Icona nome="avanti" size={14} className="text-azione" />Per gli studenti del Politecnico di Milano
          </p>
          <h1 id="t-hero" data-testo-ok className="mt-4 text-[2.7rem] font-extrabold leading-[1.0] tracking-[-0.035em] text-testo sm:text-6xl lg:text-[3.4rem] xl:text-[4rem]">
            Oltre l'OFA,
            <span className="block text-azione">un passo<br className="sm:hidden" /> in più.</span>
          </h1>
          <p data-testo-ok className="mt-5 max-w-[22rem] text-base font-medium leading-relaxed text-testo-tenue sm:max-w-md sm:text-lg">
            AddiOFA ti aiuta a prepararti all'OFA di inglese con un percorso personalizzato: scopri a che punto sei, ripassa i tuoi errori e allenati sul formato del test.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BottoneAzione onClick={onStart} className="w-full whitespace-nowrap sm:w-auto">Fai il diagnostico</BottoneAzione>
            <BottoneContorno onClick={() => vaiA('come-funziona')} freccia className="hidden whitespace-nowrap sm:inline-flex">Come funziona</BottoneContorno>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-testo">
            <span className="inline-flex items-center gap-2"><Icona nome="stato-incluso" size={18} className="text-alto-pieno" />Senza limiti</span>
            <span className="inline-flex items-center gap-2"><Icona nome="senza-account" size={18} className="text-viola" />Senza account</span>
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

      <div aria-hidden className="pointer-events-none absolute hidden sm:relative sm:left-auto sm:top-auto sm:-mt-24 sm:block sm:w-full lg:absolute lg:right-0 lg:top-14 lg:mt-0 lg:-right-[2%] lg:w-[64%] xl:w-[62%] min-[1500px]:right-0 min-[1500px]:w-[58%]">
        <Scena scuro={scuro} />
      </div>
    </section>
  );
}
