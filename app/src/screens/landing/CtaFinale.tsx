import Lastra from '../../brand/hero/Lastra';
import { Icona } from '../../brand/icone/Icona';
import { Colonna } from './comune';
import { playTapSound } from '../../lib/audio';

// Chiusura: blocco blu con la porta di luce, un solo invito, senza scadenze finte. Il titolo è marketing (`data-testo-ok`).
export default function CtaFinale({ onStart, onSkip }: { scuro?: boolean; onStart(): void; onSkip(): void }) {
  return (
    <section aria-labelledby="t-fine" className="py-10 sm:py-16">
      <Colonna>
        <div className="relative overflow-hidden rounded-[2rem] p-7 pb-44 text-white shadow-[0_24px_48px_-18px_rgba(18,62,168,0.6)] [background:linear-gradient(120deg,var(--landing-blocco-blu-da),var(--landing-blocco-blu-a))] dark:shadow-none sm:p-12 sm:pb-12">
          <div aria-hidden className="pointer-events-none absolute bottom-0 -right-10 w-[15rem] sm:right-6 sm:w-[24rem] lg:w-[28rem]">
            <Lastra className="block w-full" />
          </div>
          <div className="relative max-w-md">
            <h2 id="t-fine" data-testo-ok className="text-[2.2rem] font-extrabold leading-[1.05] tracking-tight sm:text-5xl">Parti da dove sei oggi.</h2>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => { playTapSound(); onStart(); }}
                className="inline-flex items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-base font-bold text-[#123EA8] transition-colors duration-100 hover:bg-[#DBEAFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Fai il diagnostico</span>
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"><Icona nome="avanti" size={22} /></span>
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
