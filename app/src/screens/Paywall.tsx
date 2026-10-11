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
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';

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
  if (v === true) return <Check size={18} strokeWidth={3.5} className="text-azione mx-auto" aria-label="incluso" />;
  if (v === false) return <Minus size={18} strokeWidth={3} className="text-testo-tenue mx-auto" aria-label="non incluso" />;
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
    <label className="flex items-start gap-3 cursor-pointer text-sm font-semibold text-testo">
      <input
        type="checkbox"
        checked={spuntata}
        onChange={e => { playTapSound(); onChange(e.target.checked); }}
        className="mt-0.5 w-5 h-5 shrink-0 accent-azione"
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
        <div className="rounded-2xl border border-alto/30 bg-alto-tinta p-4" role="status">
          <h1 className="text-2xl font-bold text-testo">Hai già il Pass</h1>
          <p className="mt-1 text-sm font-semibold text-testo-tenue">
            {entitlement.expiresAt ? `Vale fino al ${dataEstesa(entitlement.expiresAt)}.` : 'Non ha una scadenza.'}
            {entitlement.source === 'demo' && ' È il Pass in prova della versione dimostrativa.'}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex justify-center"><IllustrazioneAnimata nome="piano-studi-bloccato" lato={130} /></div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-testo">{testa.titolo}</h1>
          <p className="mt-2 font-semibold text-testo-tenue">{testa.testo}</p>
        </div>
      )}

      <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-4xl font-bold text-testo">{formatEur(prezzo)}</span>
          {lancio && <span className="text-lg font-semibold text-testo-tenue"><span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s></span>}
        </div>
        {lancio && <p className="text-sm font-bold text-azione-scuro">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>}
        <p className="mt-1 text-sm font-bold text-testo">
          Un solo pagamento, valido {PASS.validMonths} mesi, nessun abbonamento.
        </p>
      </div>

      <div>
        <h2 className="font-bold text-lg text-testo mb-2">Cosa include</h2>
        <ul className="flex flex-col gap-2">
          {PASS.features.map(f => (
            <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-testo">
              <Check size={16} strokeWidth={3.5} className="text-azione shrink-0 mt-0.5" aria-hidden />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-linea overflow-hidden">
        <table className="w-full text-xs sm:text-sm table-fixed">
          <caption className="sr-only">Confronto tra la parte gratuita e il Pass</caption>
          <thead className="bg-superficie-2">
            <tr className="text-left text-testo-tenue">
              <th scope="col" className="p-2.5 font-bold w-[40%]">Funzione</th>
              <th scope="col" className="p-2.5 font-bold text-center w-[30%]">Gratis</th>
              <th scope="col" className="p-2.5 font-bold text-center w-[30%] text-azione">Pass</th>
            </tr>
          </thead>
          <tbody>
            {RIGHE.map(r => (
              <tr key={r.voce} className="border-t border-linea font-semibold text-testo">
                <th scope="row" className="p-2.5 text-left font-bold">{r.voce}</th>
                <td className="p-2.5 text-center text-testo-tenue"><Cella v={r.gratis} /></td>
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
          <p className="text-center text-[11px] font-semibold text-testo-tenue">
            Il pagamento avviene sulla pagina del provider: AddiOFA non vede né salva i dati della carta.
          </p>
        </div>
      )}

      {!pass && !PAYMENTS_ENABLED && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-testo">
            I pagamenti non sono ancora attivi. Intanto il diagnostico e il nucleo di domande sono gratis.
          </p>
          <PrimaryButton onClick={onWaitlist}>Avvisami quando apre</PrimaryButton>
        </div>
      )}

      {!pass && provider.mode === 'demo' && (
        <div className="rounded-2xl border border-dashed border-medio/30 bg-medio-tinta p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <FlaskConical size={20} className="text-medio-testo" aria-hidden />
            <h2 className="font-bold text-medio-testo">Modalità dimostrativa</h2>
          </div>
          <p className="text-sm font-semibold text-medio-testo">
            Questa è una versione di prova: non si paga nulla e il blocco, qui, è solo grafico (le domande sono già dentro la pagina). Puoi provare il Pass come se l'avessi comprato.
          </p>
          <button
            onClick={() => { playTapSound(); void prova(); }}
            className="w-full rounded-2xl bg-testo text-superficie font-bold py-3.5 px-6"
          >
            Sblocca il Pass in prova
          </button>
          {stato && <p className="text-sm font-bold text-medio-testo" role="status">{stato}</p>}
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
            <button key={id} onClick={() => onOpenLegal(id)} className="text-xs font-bold text-testo-tenue underline underline-offset-2">{label}</button>
          ))}
        </nav>
        <p className="text-center text-[10px] font-semibold text-testo-tenue">{DISCLAIMER}</p>
      </footer>
    </Screen>
  );
}
