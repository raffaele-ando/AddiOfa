import { Check } from 'lucide-react';
import type { LegalSection } from '../types';
import {
  APP_NAME, DISCLAIMER, FREE_FEATURES, FREE_LIMITS, OFA_CONSEQUENCES, OFA_DEADLINES, OFA_RULES_NOTE,
  PASS, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, PAYMENTS_ENABLED, currentPriceEur, isLaunchPrice, formatEur,
} from '../config/offer';
import { playTapSound } from '../lib/audio';
import { Screen, PrimaryButton, SecondaryButton } from '../components/ui';
import { Illustrazione } from '../brand/Illustrazione';
import { urlIcona } from '../brand/risorse';

interface LandingProps {
  onStartDiagnostic(): void;
  onSkip(): void;
  onOpenLegal(s: LegalSection): void;
}

const dataEstesa = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

const LEGAL_LINKS: { id: LegalSection; label: string }[] = [
  { id: 'termini', label: 'Termini' },
  { id: 'privacy', label: 'Informativa privacy' },
  { id: 'cookie', label: 'Cookie' },
  { id: 'recesso', label: 'Recesso' },
];

function Titolo({ children }: { children: string }) {
  return <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-4">{children}</h2>;
}

function Voce({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm font-semibold text-[#0F172A] dark:text-gray-200">
      <Check size={16} strokeWidth={3.5} className="text-[#EF4444] shrink-0 mt-0.5" aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export default function Landing({ onStartDiagnostic, onSkip, onOpenLegal }: LandingProps) {
  const scuro = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();

  const passi = [
    { titolo: 'Diagnostico gratuito', testo: `${FREE_LIMITS.diagnostic} domande, circa 3 minuti, senza account. Ti dice a che punto sei rispetto alla soglia del test.` },
    { titolo: 'Ripasso e simulazioni', testo: 'Ripassi dove sbagli e provi il test per intero, nei formati con 30 domande in 15 minuti.' },
    { titolo: 'Il test reale', testo: 'Ci arrivi sapendo cosa aspettarti. Il test lo fai con il Politecnico o con l\'ente che scegli, non con noi.' },
  ];

  const pubblici = [
    { titolo: 'Hai l\'OFA e devi recuperarlo', testo: 'Vedi da dove partire e ti alleni sul formato del test di recupero, fino a quando le simulazioni vanno bene.' },
    { titolo: 'Prepari il test d\'ingresso', testo: 'Lo fai prima del test per evitare l\'OFA, con il formato TENG: 5 opzioni e penalità per ogni errore.' },
  ];

  return (
    <Screen>
      <div className="flex items-center gap-2 shrink-0">
        <img src={urlIcona} alt="" className="w-9 h-9 rounded-xl" />
        <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
      </div>

      <div className="mt-2">
        <h1 className="text-4xl font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
          Hai l'OFA di <span className="text-[#EF4444]">inglese?</span>
        </h1>
        <p className="mt-3 text-base font-semibold text-gray-500 dark:text-gray-400">
          Scopri a che punto sei in 3 minuti. Il diagnostico è gratuito: {FREE_LIMITS.diagnostic} domande e una probabilità stimata di superare il test (servono {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}).
        </p>
      </div>

      <div className="mx-auto flex items-center justify-center" style={{ minHeight: 140 }}>
        <Illustrazione kit="kit-rosso" nome="studio-inglese" lato={190} fondoScuro={scuro} />
      </div>

      <div className="flex flex-col gap-3">
        <PrimaryButton onClick={onStartDiagnostic}>Fai il diagnostico gratuito</PrimaryButton>
        <button
          onClick={() => { playTapSound(); onSkip(); }}
          className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1"
        >
          Salta e vai all'app
        </button>
      </div>

      <Titolo>Per chi è</Titolo>
      <div className="flex flex-col gap-3">
        {pubblici.map(p => (
          <div key={p.titolo} className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] p-4">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{p.titolo}</h3>
            <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">{p.testo}</p>
          </div>
        ))}
      </div>

      <Titolo>Come funziona</Titolo>
      <ol className="flex flex-col gap-3">
        {passi.map((p, i) => (
          <li key={p.titolo} className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-[#EF4444] text-white font-bold flex items-center justify-center shrink-0" aria-hidden>{i + 1}</span>
            <span>
              <span className="block font-bold text-[#0F172A] dark:text-[#F8FAFC]">{p.titolo}</span>
              <span className="block text-sm font-semibold text-gray-500 dark:text-gray-400">{p.testo}</span>
            </span>
          </li>
        ))}
      </ol>

      <Titolo>Cosa è gratis e cosa c'è nel Pass</Titolo>
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-4">
          <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">Gratis</h3>
          <ul className="flex flex-col gap-2">{FREE_FEATURES.map(f => <Voce key={f}>{f}</Voce>)}</ul>
        </div>
        <div className="rounded-2xl border border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30 p-4">
          <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">{PASS.name}</h3>
          <ul className="flex flex-col gap-2">{PASS.features.map(f => <Voce key={f}>{f}</Voce>)}</ul>
          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{formatEur(prezzo)}</span>
            {lancio && (
              <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
                <span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s>
              </span>
            )}
          </div>
          {lancio && (
            <p className="text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5]">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>
          )}
          <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
            Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento.
            {!PAYMENTS_ENABLED && ' I pagamenti non sono ancora attivi: puoi lasciare la tua email e ti avvisiamo una volta sola quando aprono.'}
          </p>
        </div>
      </div>

      <Titolo>Cosa c'è in gioco</Titolo>
      <ul className="flex flex-col gap-2">
        {OFA_CONSEQUENCES.slice(0, 2).map(c => <Voce key={c}>{c}</Voce>)}
      </ul>
      <div className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] p-4">
        <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Scadenze per avere il piano completo del 2° anno</h3>
        <dl className="mt-2 flex flex-col gap-1">
          {OFA_DEADLINES.map(d => (
            <div key={d.scuola} className="flex justify-between gap-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
              <dt>{d.scuola}</dt><dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{d.data}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-xs font-semibold text-gray-400">Dati del calendario 2026/27 del Politecnico. {OFA_RULES_NOTE}</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <PrimaryButton onClick={onStartDiagnostic}>Fai il diagnostico gratuito</PrimaryButton>
        <SecondaryButton onClick={onSkip}>Salta e vai all'app</SecondaryButton>
      </div>

      <footer className="flex flex-col items-center gap-2 pt-2 pb-1">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Documenti legali">
          {LEGAL_LINKS.map(l => (
            <button key={l.id} onClick={() => onOpenLegal(l.id)} className="text-xs font-bold text-gray-500 dark:text-gray-400 underline underline-offset-2">
              {l.label}
            </button>
          ))}
        </nav>
        <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
      </footer>
    </Screen>
  );
}
