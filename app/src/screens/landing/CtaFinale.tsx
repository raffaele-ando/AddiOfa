import { DIAGNOSTIC_QUESTIONS } from '../../config/offer';
import ctaFondo from '../../brand/essenziali/landing/cta-fondo.webp';
import { Icona } from '../../brand/icone/Icona';
import { Colonna } from './comune';
import { playTapSound } from '../../lib/audio';

// Chiusura: blocco blu con il logo 3D su cielo e blocchi. Telefono: testo in alto e immagine in basso, che sfuma verso l'alto nel blu senza cucitura;
// da 640 px l'immagine sta a destra e sfuma verso sinistra. Nel tema scuro l'immagine è rigradata in blu notte (landing.css). Un solo pulsante e un link.
export default function CtaFinale({ onStart, onSkip }: { onStart(): void; onSkip(): void }) {
  return (
    <section aria-labelledby="t-fine" className="py-10 lg:py-14">
      <Colonna>
        <div className="relative isolate flex flex-col overflow-hidden rounded-[2rem] text-white [background:linear-gradient(115deg,var(--landing-blocco-blu-a),var(--landing-blocco-blu-da)_70%)] sm:min-h-[19rem]">
          <div aria-hidden className="landing-notte landing-notte-cta pointer-events-none order-2 -mt-14 h-56 w-full sm:absolute sm:inset-y-0 sm:right-0 sm:z-0 sm:order-none sm:mt-0 sm:h-full sm:w-[68%]">
            <img src={ctaFondo} alt="" draggable={false} className="h-full w-full select-none object-cover object-[66%_50%]" />
          </div>
          <div data-testo-ok className="relative z-10 flex max-w-[34rem] flex-col p-6 pb-0 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/85">Parti dal test di livello</p>
            <h2 id="t-fine" className="mt-2 text-[2rem] font-extrabold leading-[1.1] tracking-tight lg:text-[2.75rem]">Quanto sai davvero?</h2>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-white/90">{DIAGNOSTIC_QUESTIONS} domande, 3 minuti, nessuna password. Poi scegli tu cosa ripassare.</p>
            <div className="mt-6 flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={() => { playTapSound(); onStart(); }}
                className="inline-flex h-[52px] w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-7 text-base font-bold text-[var(--landing-blocco-blu-a)] transition-colors duration-100 hover:bg-azione-tinta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto lg:h-12"
              >
                Inizia il test di livello<Icona nome="avanti" size={20} />
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="inline-flex min-h-11 items-center rounded text-[15px] font-bold text-white underline underline-offset-4 hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Vai all’app senza test
              </button>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
