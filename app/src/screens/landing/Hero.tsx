import { EXAM } from '../../config/offer';
import scenaChiara from '../../brand/essenziali/hero/scena-chiara.webp';
import scenaScura from '../../brand/essenziali/hero/scena-scura.webp';
import { BottoneAzione, BottoneContorno, Colonna, Occhiello } from './comune';
import { vaiA } from './Barra';
import { Telefono, SchermoSimulazione, SchermoTest } from './TelefonoPassi';

// Hero in un'unica composizione. Telefono: la scena (porta di luce, studente) a grandezza vera dietro la barra, il titolo si appoggia sui gradini che sfumano
// nel fondo, il pulsante sta sopra la piega. Da 1024 px: testo a sinistra, scena al centro e due telefoni con schermate d'esempio a destra (niente carte con dati).
// Una promessa («scopri a che punto sei»), un'azione con un solo nome. Il titolo e le frasi sono marketing (`data-testo-ok`).
export default function Hero({ onStart, onSkip }: { onStart(): void; onSkip(): void }) {
  return (
    <section id="home" aria-labelledby="t-hero" className="relative overflow-hidden scroll-mt-0 lg:min-h-[41rem]">
      {/* scena: i due file (chiaro e notte) si scambiano col tema; la maschera sfuma tutti i lati, così non resta nessun bordo rettangolare */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[27rem] max-w-[1280px] lg:inset-y-0 lg:h-auto">
        <div className="landing-scena absolute left-1/2 top-6 h-[26rem] w-[52rem] -translate-x-1/2 lg:left-[26%] lg:top-16 lg:h-auto lg:w-[70%] lg:translate-x-0">
          <img src={scenaChiara} alt="" draggable={false} className="landing-scena-chiara h-full w-full select-none object-cover" />
          <img src={scenaScura} alt="" draggable={false} className="landing-scena-scura h-full w-full select-none object-cover" />
        </div>
      </div>

      {/* telefoni d'esempio (da 1024 px): uno dietro, uno davanti, schermate vere dell'app */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 inset-x-0 mx-auto hidden max-w-[1280px] lg:block">
        <Telefono larghezza={232} altezzaSchermo={316} scheda="home" className="absolute right-[8.5rem] top-[4.75rem] -rotate-[5deg]"><SchermoSimulazione /></Telefono>
        <Telefono larghezza={248} altezzaSchermo={366} scheda="home" className="absolute right-6 top-[6.5rem] rotate-[3deg]"><SchermoTest /></Telefono>
      </div>

      <Colonna className="relative z-10 pb-12 pt-[21.5rem] lg:pb-32 lg:pt-36">
        <div className="max-w-[34rem] lg:max-w-[28rem] xl:max-w-[33rem]">
          <Occhiello data-testo-ok className="text-testo-tenue">Per gli studenti del Politecnico di Milano</Occhiello>
          <h1 id="t-hero" data-testo-ok className="mt-3 text-[2.125rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-testo text-balance sm:text-5xl lg:text-[2.5rem] xl:text-[3.1rem]">
            Scopri a che punto sei <span className="text-azione">con l’OFA di inglese.</span>
          </h1>
          <p data-testo-ok className="mt-4 max-w-[26rem] text-base font-medium leading-relaxed text-testo-tenue sm:text-lg">
            In 3 minuti. Poi ripassi solo ciò che sbagli e provi il test vero: {EXAM.questions} domande, {EXAM.minutes} minuti.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <BottoneAzione grande onClick={onStart} className="w-full sm:w-auto">Inizia il test di livello</BottoneAzione>
            <BottoneContorno onClick={() => vaiA('come-funziona')} className="hidden lg:inline-flex">Come funziona</BottoneContorno>
          </div>
          <p data-testo-ok className="mt-4 text-[13px] font-medium leading-snug text-testo-tenue">Gratuita, senza password, con i progressi sul tuo dispositivo.</p>
          <button type="button" onClick={onSkip} data-testo-ok
            className="mt-1 inline-flex min-h-11 items-center rounded text-[13px] font-semibold text-azione-testo underline underline-offset-4 hover:text-azione focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione">
            Preferisci esplorare? Vai all’app senza test
          </button>
        </div>
      </Colonna>
    </section>
  );
}
