import { FREE_LIMITS } from '../../config/offer';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { BottoneAzione, Colonna } from './comune';

// Chiusura: un solo invito, senza scadenze finte.
export default function CtaFinale({ scuro, onStart, onSkip }: { scuro: boolean; onStart(): void; onSkip(): void }) {
  return (
    <section aria-labelledby="t-fine" className="py-14 sm:py-20">
      <Colonna>
        <div>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-azione via-[#2F6BEE] to-azione-scuro p-7 text-white shadow-[0_20px_44px_rgba(37,99,235,0.3)] dark:shadow-none sm:p-12">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <h2 id="t-fine" className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Parti da dove sei oggi.</h2>
                <p className="mt-3 max-w-xl text-base font-medium text-white sm:text-lg">
                  {FREE_LIMITS.diagnostic} domande, circa 3 minuti, nessun account: poi sai da dove ripassare.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <BottoneAzione onClick={onStart} className="!bg-white !text-azione-scuro hover:!bg-azione-tinta !shadow-none focus-visible:!outline-white">Fai il diagnostico gratuito</BottoneAzione>
                  <button
                    type="button"
                    onClick={onSkip}
                    className="rounded-2xl px-4 py-3 text-base font-bold text-white underline underline-offset-4 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Salta e vai all'app
                  </button>
                </div>
              </div>
              <div className="hidden md:block rounded-3xl bg-white/95 dark:bg-[#0F172A]/80 p-3">
                <IllustrazioneAnimata nome="superamento" lato={170} quandoVisibile />
              </div>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
