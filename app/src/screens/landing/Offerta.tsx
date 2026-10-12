import { Check } from 'lucide-react';
import type { LegalSection } from '../../types';
import {
  FREE_FEATURES, PASS, PAYMENTS_ENABLED, currentPriceEur, isLaunchPrice, formatEur,
} from '../../config/offer';
import { urlDisegno } from '../../brand/risorse';
import { FOCUS, Occhiello, Colonna, dataEstesa, SCHEDA } from './comune';
import { ArrowRight } from 'lucide-react';
import { playTapSound } from '../../lib/audio';
import { cn } from '../../lib/utils';

function Voce({ children, bianca }: { children: string; bianca?: boolean }) {
  return (
    <li className={cn('flex items-start gap-2.5 text-sm font-semibold', bianca ? 'text-white' : 'text-testo')}>
      <span aria-hidden className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full', bianca ? 'bg-white/20 text-white' : 'bg-azione-tinta text-azione-scuro')}>
        <Check size={13} strokeWidth={3.6} />
      </span>
      <span>{children}</span>
    </li>
  );
}

interface Props {
  scuro: boolean;
  onStart(): void;
  onOpenPass?(): void;
  onOpenLegal(s: LegalSection): void;
}

// Parte gratuita e Pass, con il prezzo vero e la data vera del prezzo di lancio. Il Pass è il blocco blu, come nei concept.
export default function Offerta({ scuro, onStart, onOpenPass, onOpenLegal }: Props) {
  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();
  const quiz = urlDisegno('kit-blu', 'illustrazioni', 'quiz-test', scuro);
  const stats = urlDisegno('kit-blu', 'illustrazioni', 'progressi-statistiche', scuro);

  return (
    <section id="prezzo" aria-labelledby="t-offerta" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="max-w-2xl">
          <Occhiello>Prezzi</Occhiello>
          <h2 id="t-offerta" className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
            Cosa ottieni <span className="text-azione">gratis</span> e cosa c'è nel Pass
          </h2>
          <p className="mt-4 text-base font-medium text-testo-tenue sm:text-lg">Il diagnostico e il ripasso di base sono gratis. Il Pass apre tutto il resto, con un solo pagamento.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={cn(SCHEDA, 'flex flex-col p-6 sm:p-8')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold text-testo">Gratis</h3>
                <p className="mt-1 text-sm font-medium text-testo-tenue">Senza account e senza carta.</p>
              </div>
              {quiz && <img src={quiz} alt="" width={96} draggable={false} className="shrink-0" />}
            </div>
            <ul className="mt-6 flex flex-col gap-3">{FREE_FEATURES.map(f => <Voce key={f}>{f}</Voce>)}</ul>
            <div className="pt-8 lg:mt-auto">
              <button
                type="button"
                onClick={() => { playTapSound(); onStart(); }}
                className={cn('inline-flex w-full items-center justify-between gap-4 rounded-full border border-azione py-2.5 pl-7 pr-2.5 text-base font-bold text-azione-scuro transition-colors duration-100 hover:bg-azione-tinta sm:w-auto', FOCUS)}
              >
                <span>Fai il diagnostico gratuito</span>
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-azione text-azione-su"><ArrowRight size={20} strokeWidth={2.6} /></span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_24px_48px_-18px_rgba(18,62,168,0.6)] [background:linear-gradient(150deg,var(--landing-blocco-blu-da),var(--landing-blocco-blu-a))] dark:shadow-none sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-extrabold">{PASS.name}</h3>
                <p className="mt-1 text-sm font-medium text-white">Tutto quello che c'è nell'app.</p>
              </div>
              {stats && <img src={stats} alt="" width={96} draggable={false} className="shrink-0 rounded-2xl bg-white/90 p-1" />}
            </div>
            <ul className="mt-6 flex flex-col gap-3">{PASS.features.map(f => <Voce key={f} bianca>{f}</Voce>)}</ul>

            <div className="mt-7 border-t border-white/25 pt-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-5xl font-extrabold tracking-tight">{formatEur(prezzo)}</span>
                {lancio && (
                  <span className="text-base font-semibold text-white">
                    <span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s>
                  </span>
                )}
                <span className="text-sm font-semibold text-white">una tantum</span>
              </div>
              {lancio && (
                <p className="mt-1 text-sm font-bold text-white">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>
              )}
              <p className="mt-2 text-sm font-medium text-white">
                Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento e nessun rinnovo.
              </p>
              {!PAYMENTS_ENABLED && (
                <p className="mt-2 text-sm font-medium text-white">
                  I pagamenti non sono ancora attivi. Puoi lasciare la tua email: ti scriviamo una sola volta quando il Pass apre. La lista d'attesa non è un ordine e non blocca il prezzo.
                </p>
              )}
              {onOpenPass && (
                <button
                  type="button"
                  onClick={() => { playTapSound(); onOpenPass(); }}
                  className="mt-5 inline-flex w-full items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-base font-bold text-[#123EA8] transition-colors duration-100 hover:bg-[#DBEAFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                >
                  <span>{PAYMENTS_ENABLED ? 'Prendi il Pass' : "Entra in lista d'attesa"}</span>
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"><ArrowRight size={20} strokeWidth={2.6} /></span>
                </button>
              )}
              <p className="mt-4 text-xs font-medium text-white">
                Se compri da consumatore hai 14 giorni per recedere, nei casi previsti dalla legge:{' '}
                <button type="button" onClick={() => onOpenLegal('recesso')} className="rounded font-bold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">leggi le condizioni</button>.
              </p>
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
