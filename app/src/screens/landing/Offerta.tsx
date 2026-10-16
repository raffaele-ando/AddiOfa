import type { LegalSection } from '../../types';
import { PASS, PAYMENTS_ENABLED, currentPriceEur, isLaunchPrice, formatEur } from '../../config/offer';
import { urlDisegno } from '../../brand/risorse';
import { Icona } from '../../brand/icone/Icona';
import { IconaTono } from '../extra/ui';
import { FOCUS, Occhiello, Colonna, Dato, SCHEDA, dataCorta, InfoFoglio } from './comune';
import { CONFRONTO, Cella } from './dati';
import { playTapSound } from '../../lib/audio';
import { cn } from '../../lib/utils';

// Una riga del confronto: tessera con l'icona, una parola, il valore (spunta, lucchetto, infinito o numero).
function Riga({ r, pass }: { r: (typeof CONFRONTO)[number]; pass?: boolean }) {
  return (
    <li className={cn('flex items-center gap-3 rounded-2xl px-1 py-1.5', pass && 'text-white')}>
      {pass
        ? <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-white/15 text-white"><Icona nome={r.icona} size={22} /></span>
        : <IconaTono tono={r.tono} lato={40}><Icona nome={r.icona} size={22} /></IconaTono>}
      <span className={cn('min-w-0 flex-1 text-[15px] font-bold', pass ? 'text-white' : 'text-testo')}>{r.etichetta}</span>
      <span className="grid min-w-[2.5rem] place-items-center"><Cella v={pass ? r.pass : r.gratis} pieno={pass} /></span>
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
// Niente frasi: righe icona + parola + numero; il recesso e l'avvertenza stanno nel piè di pagina legale.
export default function Offerta({ scuro, onStart, onOpenPass }: Props) {
  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();
  const quiz = urlDisegno('kit-blu', 'illustrazioni', 'quiz-test', scuro);
  const stats = urlDisegno('kit-blu', 'illustrazioni', 'progressi-statistiche', scuro);

  return (
    <section id="prezzo" aria-labelledby="t-offerta" className="scroll-mt-20 py-14 sm:py-20">
      <Colonna>
        <div className="max-w-2xl">
          <Occhiello icona="prezzo">Prezzi</Occhiello>
          <h2 id="t-offerta" className="mt-4 text-[2.4rem] font-extrabold leading-[1.05] tracking-tight text-testo sm:text-5xl">
            <span className="text-azione">Gratis</span> o Pass
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={cn(SCHEDA, 'flex flex-col p-6 sm:p-8')}>
            <div className="flex items-start justify-between gap-4">
              <h3 className="flex items-center gap-2.5 text-2xl font-extrabold text-testo"><Icona nome="gratis" size={26} className="text-alto-numero" />Gratis</h3>
              {quiz && <img src={quiz} alt="" width={96} draggable={false} className="shrink-0" />}
            </div>
            <ul className="mt-6 flex flex-col gap-1.5">{CONFRONTO.map(r => <Riga key={r.id} r={r} />)}</ul>
            <div className="flex items-center gap-4 pt-8 lg:mt-auto">
              <Dato icona="senza-account" tono="viola" lato={30}>Senza account</Dato>
            </div>
            <div className="pt-4">
              <button
                type="button"
                onClick={() => { playTapSound(); onStart(); }}
                className={cn('inline-flex w-full items-center justify-between gap-4 rounded-full border border-azione py-2.5 pl-7 pr-2.5 text-base font-bold text-azione-scuro transition-colors duration-100 hover:bg-azione-tinta sm:w-auto', FOCUS)}
              >
                <span>Fai il diagnostico</span>
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-azione text-azione-su"><Icona nome="avanti" size={22} /></span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_24px_48px_-18px_rgba(18,62,168,0.6)] [background:linear-gradient(150deg,var(--landing-blocco-blu-da),var(--landing-blocco-blu-a))] dark:shadow-none sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <h3 className="flex items-center gap-2.5 text-2xl font-extrabold"><Icona nome="pass" size={26} />{PASS.name}</h3>
              {stats && <img src={stats} alt="" width={96} draggable={false} className="shrink-0 rounded-2xl bg-white/90 p-1" />}
            </div>
            <ul className="mt-6 flex flex-col gap-1.5">{CONFRONTO.map(r => <Riga key={r.id} r={r} pass />)}</ul>

            <div className="mt-7 border-t border-white/25 pt-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-5xl font-extrabold tracking-tight">{formatEur(prezzo)}</span>
                {lancio && (
                  <span className="text-base font-semibold text-white">
                    <span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s>
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-bold text-white">
                {lancio && <span className="inline-flex items-center gap-1.5"><Icona nome="scadenza" size={18} /><span className="sr-only">Prezzo di lancio fino al </span>{dataCorta(PASS.launchUntil)}</span>}
                <span className="inline-flex items-center gap-1.5"><Icona nome="validita" size={18} />{PASS.validMonths} mesi</span>
                <span className="inline-flex items-center gap-1.5"><Icona nome="pagamento-unico" size={18} />1×</span>
                <InfoFoglio titolo="Il Pass" etichetta="Informazioni sul Pass" className="!text-white hover:!text-white">
                  <div className="flex flex-col gap-2">
                    <p>Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento e nessun rinnovo.</p>
                    {!PAYMENTS_ENABLED && <p>I pagamenti non sono ancora attivi: puoi lasciare la tua email e ti scriviamo una sola volta quando il Pass apre. La lista d'attesa non è un ordine e non blocca il prezzo.</p>}
                  </div>
                </InfoFoglio>
              </div>
              {onOpenPass && (
                <button
                  type="button"
                  onClick={() => { playTapSound(); onOpenPass(); }}
                  aria-label={PAYMENTS_ENABLED ? 'Prendi il Pass' : "Entra in lista d'attesa"}
                  className="mt-5 inline-flex w-full items-center justify-between gap-4 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-base font-bold text-[#123EA8] transition-colors duration-100 hover:bg-[#DBEAFE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                >
                  <span className="inline-flex items-center gap-2">
                    {!PAYMENTS_ENABLED && <Icona nome="lista-attesa" size={20} />}
                    {PAYMENTS_ENABLED ? 'Prendi il Pass' : 'Avvisami'}
                  </span>
                  <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] text-white"><Icona nome="avanti" size={22} /></span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Colonna>
    </section>
  );
}
