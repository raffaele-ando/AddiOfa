import { Icona } from '../../brand/icone/Icona';
import ctaFondo from '../../brand/essenziali/landing/cta-fondo.webp';
import { Colonna } from './comune';
import { playTapSound } from '../../lib/audio';

// Chiusura (concetti 45 e 12): blocco blu con il logo 3D su cielo e blocchi, un invito e due pulsanti (al posto dei bottoni degli store).
// L'immagine è il ritaglio del concetto, ripulito dalle scritte (grafica/strumenti/brand/estrai_landing.py); il testo è marketing (`data-testo-ok`).
export default function CtaFinale({ onStart, onSkip }: { scuro?: boolean; onStart(): void; onSkip(): void }) {
  return (
    <section aria-labelledby="t-fine" className="py-10 sm:py-16">
      <Colonna>
        <div className="relative isolate overflow-hidden rounded-[2rem] text-white shadow-[0_24px_48px_-18px_rgba(18,62,168,0.6)] [background:linear-gradient(115deg,var(--landing-blocco-blu-a),var(--landing-blocco-blu-da)_70%)] dark:shadow-none">
          <div aria-hidden className="pointer-events-none absolute bottom-0 right-0 -z-10 h-[40%] w-full sm:inset-y-0 sm:h-auto sm:w-[72%]">
            <img src={ctaFondo} alt="" draggable={false}
              className="h-full w-full select-none object-cover object-[66%_50%] [mask-image:linear-gradient(to_right,transparent,#000_34%)] max-sm:[mask-image:linear-gradient(to_bottom,transparent,#000_42%)] dark:brightness-[.86] dark:saturate-[.88]" />
            {/* tema scuro: velo del colore di fondo al 20%, con la stessa sfumatura dell'immagine */}
            <div className="absolute inset-0 hidden bg-fondo/20 [mask-image:linear-gradient(to_right,transparent,#000_34%)] max-sm:[mask-image:linear-gradient(to_bottom,transparent,#000_42%)] dark:block" />
          </div>
          <div data-testo-ok className="relative flex min-h-[34rem] max-w-[34rem] flex-col justify-start p-7 sm:min-h-[19rem] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">Inizia oggi</p>
            <h2 id="t-fine" className="mt-2 text-[2.2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">Costruisci il tuo domani.</h2>
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/90">Un piccolo passo ora, per un percorso universitario senza ostacoli.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => { playTapSound(); onStart(); }}
                className="inline-flex items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-base font-bold text-[var(--landing-blocco-blu-a)] transition-colors duration-100 hover:bg-azione-tinta dark:hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Fai il diagnostico</span>
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-azione text-azione-su"><Icona nome="avanti" size={22} /></span>
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-base font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Icona nome="salta" size={18} />Salta
              </button>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
