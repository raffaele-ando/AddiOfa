import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Minus, FlaskConical } from 'lucide-react';
import type { LegalSection, PaywallReason } from '../types';
import {
  DISCLAIMER, FREE_LIMITS, PASS, PAYMENTS_ENABLED, STRIPE_LINK, currentPriceEur, formatEur, isLaunchPrice,
} from '../config/offer';
import { useAccess, type AccessValue } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar, PrimaryButton } from '../components/ui';

interface PaywallProps {
  onBack(): void;
  onWaitlist(): void;
  onOpenLegal(s: LegalSection): void;
  reason?: PaywallReason;
}

const INTESTAZIONI: Record<PaywallReason, { titolo: string; testo: string }> = {
  simulazione: { titolo: 'Hai usato la simulazione gratuita', testo: 'Con il Pass fai simulazioni illimitate, nel formato del test di recupero e nel TENG.' },
  domande: { titolo: 'Il resto del banco è nel Pass', testo: `Il nucleo di circa ${FREE_LIMITS.coreQuestions} domande resta gratis. Con il Pass hai tutte le altre, con la spiegazione in italiano.` },
  teng: { titolo: 'Il formato TENG è nel Pass', testo: '30 domande in 15 minuti, 5 opzioni e penalità per ogni errore, come nel test d\'ingresso.' },
  teoria: { titolo: 'La teoria completa è nel Pass', testo: 'Una scheda è gratis. Con il Pass hai la teoria di tutti i 31 argomenti.' },
  errori: { titolo: 'Il ripasso sugli errori è nel Pass', testo: 'Ripassi le domande che hai sbagliato, nell\'ordine che serve a te.' },
  statistiche: { titolo: 'Le statistiche complete sono nel Pass', testo: 'Vedi dove sei debole argomento per argomento.' },
  generico: { titolo: 'Il Pass AddiOFA', testo: PASS.summary },
};

// Righe della tabella Gratis / Pass: i numeri vengono da config/offer.ts
const RIGHE: { voce: string; gratis: string | boolean; pass: string | boolean }[] = [
  { voce: 'Quiz diagnostico con probabilità', gratis: `${FREE_LIMITS.diagnostic} domande`, pass: true },
  { voce: 'Ripasso intelligente', gratis: `nucleo di circa ${FREE_LIMITS.coreQuestions} domande`, pass: 'tutte le domande' },
  { voce: 'Simulazioni', gratis: `${FREE_LIMITS.freeSimulations} completa`, pass: 'illimitate' },
  { voce: 'Formato TENG', gratis: false, pass: true },
  { voce: 'Spiegazioni in italiano', gratis: false, pass: true },
  { voce: 'Teoria', gratis: `${FREE_LIMITS.freeTheoryTopics} scheda`, pass: '31 argomenti' },
  { voce: 'Ripasso sugli errori', gratis: false, pass: true },
  { voce: 'Statistiche complete', gratis: false, pass: true },
];

const dataEstesa = (iso: string | number) =>
  new Date(typeof iso === 'number' ? iso : `${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

function Cella({ v }: { v: string | boolean }) {
  if (v === true) return <Check size={18} strokeWidth={3.5} className="text-[#EF4444] mx-auto" aria-label="incluso" />;
  if (v === false) return <Minus size={18} strokeWidth={3} className="text-gray-300 dark:text-gray-600 mx-auto" aria-label="non incluso" />;
  return <span>{v}</span>;
}

// Id anonimo per collegare il pagamento a chi lo ha fatto quando non c'è un utente: resta sul dispositivo
function idAnonimo(): string {
  const chiave = 'addiofa.anon-id';
  try {
    const salvato = localStorage.getItem(chiave);
    if (salvato) return salvato;
    const nuovo = `anon-${crypto.randomUUID()}`;
    localStorage.setItem(chiave, nuovo);
    return nuovo;
  } catch {
    return `anon-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}

type Utente = AccessValue & { userId?: string; email?: string };

function Casella({ spuntata, onChange, children }: { spuntata: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer text-sm font-semibold text-[#0F172A] dark:text-gray-200">
      <input
        type="checkbox"
        checked={spuntata}
        onChange={e => { playTapSound(); onChange(e.target.checked); }}
        className="mt-0.5 w-5 h-5 shrink-0 accent-[#EF4444]"
      />
      <span>{children}</span>
    </label>
  );
}

export default function Paywall({ onBack, onWaitlist, onOpenLegal, reason = 'generico' }: PaywallProps) {
  const access = useAccess() as Utente;
  const { provider, pass, entitlement, track, unlockDemo } = access;
  const [subito, setSubito] = useState(false);
  const [letto, setLetto] = useState(false);
  const [stato, setStato] = useState<string | null>(null);
  const visto = useRef(false);

  useEffect(() => {
    if (visto.current || pass) return;
    visto.current = true;
    track({ name: 'paywall_seen' });
  }, [pass, track]);

  const prezzo = currentPriceEur();
  const lancio = isLaunchPrice();
  const testa = INTESTAZIONI[reason] ?? INTESTAZIONI.generico;

  const paga = () => {
    if (!PAYMENTS_ENABLED || !STRIPE_LINK) return;
    const url = new URL(STRIPE_LINK);
    url.searchParams.set('client_reference_id', access.userId ?? idAnonimo());
    if (access.email) url.searchParams.set('prefilled_email', access.email);
    window.location.href = url.toString();
  };

  const prova = async () => {
    try { await unlockDemo(); setStato('Pass in prova attivo.'); } catch { setStato('Non sono riuscito a sbloccare il Pass in prova. Riprova.'); }
  };

  const link = (s: LegalSection, testo: string) => (
    <button
      type="button"
      onClick={e => { e.preventDefault(); e.stopPropagation(); onOpenLegal(s); }}
      className="underline underline-offset-2 font-bold"
    >{testo}</button>
  );

  return (
    <Screen>
      <TopBar onBack={onBack} />

      {pass ? (
        <div className="rounded-2xl border border-[#22C55E]/50 bg-[#F0FDF4] dark:bg-[#064E3B]/40 p-4" role="status">
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Hai già il Pass</h1>
          <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
            {entitlement.expiresAt ? `Vale fino al ${dataEstesa(entitlement.expiresAt)}.` : 'Non ha una scadenza.'}
            {entitlement.source === 'demo' && ' È il Pass in prova della versione dimostrativa.'}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">{testa.titolo}</h1>
          <p className="mt-2 font-semibold text-gray-500 dark:text-gray-400">{testa.testo}</p>
        </div>
      )}

      <div className="rounded-2xl border border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{formatEur(prezzo)}</span>
          {lancio && <span className="text-lg font-semibold text-gray-500 dark:text-gray-400"><span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s></span>}
        </div>
        {lancio && <p className="text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5]">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>}
        <p className="mt-1 text-sm font-bold text-[#0F172A] dark:text-gray-200">
          Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento.
        </p>
      </div>

      <div>
        <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC] mb-2">Cosa include</h2>
        <ul className="flex flex-col gap-2">
          {PASS.features.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-[#0F172A] dark:text-gray-200">
              <Check size={16} strokeWidth={3.5} className="text-[#EF4444] shrink-0 mt-0.5" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-[#334155] overflow-hidden">
        <table className="w-full text-xs sm:text-sm table-fixed">
          <caption className="sr-only">Confronto tra la parte gratuita e il Pass</caption>
          <thead className="bg-gray-50 dark:bg-[#0F172A]">
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th scope="col" className="p-2.5 font-bold w-[40%]">Funzione</th>
              <th scope="col" className="p-2.5 font-bold text-center w-[30%]">Gratis</th>
              <th scope="col" className="p-2.5 font-bold text-center w-[30%] text-[#EF4444]">Pass</th>
            </tr>
          </thead>
          <tbody>
            {RIGHE.map(r => (
              <tr key={r.voce} className="border-t border-gray-200 dark:border-[#334155] font-semibold text-[#0F172A] dark:text-gray-200">
                <th scope="row" className="p-2.5 text-left font-bold">{r.voce}</th>
                <td className="p-2.5 text-center text-gray-600 dark:text-gray-300"><Cella v={r.gratis} /></td>
                <td className="p-2.5 text-center"><Cella v={r.pass} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!pass && PAYMENTS_ENABLED && (
        <div className="flex flex-col gap-3">
          <Casella spuntata={subito} onChange={setSubito}>
            Voglio iniziare subito a usare il Pass e so che così perdo il diritto di recesso dei 14 giorni.
          </Casella>
          <Casella spuntata={letto} onChange={setLetto}>
            Ho letto {link('termini', 'Termini')} e {link('privacy', 'Informativa privacy')}.
          </Casella>
          <PrimaryButton onClick={paga} disabled={!(subito && letto)}>Ordine con obbligo di pagare</PrimaryButton>
          <p className="text-center text-[11px] font-semibold text-gray-500 dark:text-gray-400">
            Il pagamento avviene sulla pagina del provider: AddiOFA non vede né salva i dati della carta.
          </p>
        </div>
      )}

      {!pass && !PAYMENTS_ENABLED && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-gray-200">
            I pagamenti non sono ancora attivi. Intanto il diagnostico e il nucleo di domande sono gratis.
          </p>
          <PrimaryButton onClick={onWaitlist}>Avvisami quando apre</PrimaryButton>
        </div>
      )}

      {!pass && provider.mode === 'demo' && (
        <div className="rounded-2xl border-2 border-dashed border-[#F59E0B] bg-[#FEF3C7] dark:bg-[#78350F]/30 p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={20} className="text-[#B45309] dark:text-[#FCD34D]" aria-hidden />
            <h2 className="font-bold text-[#78350F] dark:text-[#FDE68A]">Modalità dimostrativa</h2>
          </div>
          <p className="text-sm font-semibold text-[#78350F] dark:text-[#FDE68A]">
            Questa è una versione di prova: non si paga nulla e il blocco, qui, è solo grafico (le domande sono già dentro la pagina). Puoi provare il Pass come se l'avessi comprato.
          </p>
          <button
            onClick={() => { playTapSound(); void prova(); }}
            className="w-full rounded-2xl bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] font-bold py-3.5 px-6 active:scale-[.99] transition-transform"
          >
            Sblocca il Pass in prova
          </button>
          {stato && <p className="text-sm font-bold text-[#78350F] dark:text-[#FDE68A]" role="status">{stato}</p>}
        </div>
      )}

      {pass && (
        <div className="mt-auto">
          <PrimaryButton onClick={onBack}>Torna all'app</PrimaryButton>
        </div>
      )}

      <footer className={cn('flex flex-col items-center gap-2 pb-1', !pass && 'mt-2')}>
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Documenti legali">
          {([['termini', 'Termini'], ['privacy', 'Privacy'], ['recesso', 'Recesso']] as const).map(([id, label]) => (
            <button key={id} onClick={() => onOpenLegal(id)} className="text-xs font-bold text-gray-500 dark:text-gray-400 underline underline-offset-2">{label}</button>
          ))}
        </nav>
        <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
      </footer>
    </Screen>
  );
}
