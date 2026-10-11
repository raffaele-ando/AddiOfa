import { Check } from 'lucide-react';
import type { LegalSection } from '../../types';
import {
  FREE_FEATURES, PASS, PAYMENTS_ENABLED, currentPriceEur, isLaunchPrice, formatEur,
} from '../../config/offer';
import { IllustrazioneAnimata } from '../../brand/IllustrazioneAnimata';
import { BottoneAzione, FOCUS, Sezione, TitoloSezione, SCHEDA, dataEstesa } from './comune';
import { cn } from '../../lib/utils';

function Voce({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm font-semibold text-testo">
      <Check size={17} strokeWidth={3.5} className="mt-0.5 shrink-0 text-azione " aria-hidden />
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

// Parte gratuita e Pass, con il prezzo vero e la data vera del prezzo di lancio.
export default function Offerta({ scuro, onStart, onOpenPass, onOpenLegal }: Props) {
  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();

  return (
    <Sezione id="cosa-ottieni" titoloId="t-offerta">
      <div>
        <TitoloSezione id="t-offerta" occhiello="Cosa ottieni" sotto="Il diagnostico e il ripasso di base sono gratis. Il Pass apre tutto il resto, con un solo pagamento.">
          Cosa ottieni gratis e cosa c'è nel Pass
        </TitoloSezione>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div>
          <div className={cn(SCHEDA, 'flex flex-col p-6 sm:p-7')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-testo">Gratis</h3>
                <p className="mt-1 text-sm font-medium text-testo-tenue">Senza account e senza carta.</p>
              </div>
              <div className="shrink-0"><IllustrazioneAnimata nome="quiz-test" lato={84} quandoVisibile /></div>
            </div>
            <ul className="mt-5 flex flex-col gap-3">{FREE_FEATURES.map(f => <Voce key={f}>{f}</Voce>)}</ul>
            <div className="pt-6">
              <BottoneAzione onClick={onStart} className="w-full sm:w-auto">Fai il diagnostico gratuito</BottoneAzione>
            </div>
          </div>
        </div>

        <div>
          <div id="prezzo" className="relative scroll-mt-20 rounded-3xl border border-azione bg-superficie p-6 shadow-[0_12px_32px_rgba(37,99,235,0.14)] dark:shadow-none sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-testo">{PASS.name}</h3>
                <p className="mt-1 text-sm font-medium text-testo-tenue">Tutto quello che c'è nell'app.</p>
              </div>
              <div className="shrink-0"><IllustrazioneAnimata nome="progressi-statistiche" lato={84} quandoVisibile /></div>
            </div>
            <ul className="mt-5 flex flex-col gap-3">{PASS.features.map(f => <Voce key={f}>{f}</Voce>)}</ul>

            <div className="mt-6 border-t border-linea pt-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-4xl font-extrabold tracking-tight text-testo">{formatEur(prezzo)}</span>
                {lancio && (
                  <span className="text-base font-semibold text-testo-tenue">
                    <span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s>
                  </span>
                )}
                <span className="text-sm font-semibold text-testo-tenue">una tantum</span>
              </div>
              {lancio && (
                <p className="mt-1 text-sm font-bold text-azione-scuro">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>
              )}
              <p className="mt-2 text-sm font-medium text-testo-tenue">
                Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento e nessun rinnovo.
              </p>
              {!PAYMENTS_ENABLED && (
                <p className="mt-2 text-sm font-medium text-testo-tenue">
                  I pagamenti non sono ancora attivi. Puoi lasciare la tua email: ti scriviamo una sola volta quando il Pass apre. La lista d'attesa non è un ordine e non blocca il prezzo.
                </p>
              )}
              {onOpenPass && (
                <BottoneAzione onClick={onOpenPass} className="mt-4 w-full sm:w-auto">
                  {PAYMENTS_ENABLED ? 'Prendi il Pass' : "Entra in lista d'attesa"}
                </BottoneAzione>
              )}
              <p className="mt-3 text-xs font-medium text-testo-tenue">
                Se compri da consumatore hai 14 giorni per recedere, nei casi previsti dalla legge:{' '}
                <button type="button" onClick={() => onOpenLegal('recesso')} className={cn('font-bold underline underline-offset-2 rounded', FOCUS)}>leggi le condizioni</button>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sezione>
  );
}
