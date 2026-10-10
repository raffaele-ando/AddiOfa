import { FormEvent, useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronDown } from 'lucide-react';
import type { LegalSection } from '../types';
import { Screen, TopBar } from '../components/ui';
import { cn } from '../lib/utils';
import { PAYMENTS_ENABLED } from '../config/offer';
import { useAccess } from '../access/context';
import { LEGAL_DOCS, LEGAL_DRAFT, LEGAL_TABS } from '../legal';

const MISURA = 'mx-auto w-full max-w-[65ch]';
const TESTO = 'text-[15px] leading-relaxed text-gray-700 dark:text-gray-300';
const CAMPO =
  'w-full rounded-xl border border-gray-300 dark:border-[#475569] bg-white dark:bg-[#0F172A] px-3 py-3 text-base text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EF4444]';

const riduciMovimento = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Bozza({ aggiornato }: { aggiornato: string }) {
  return (
    <div
      role="note"
      className="flex gap-2.5 rounded-xl border border-[#F59E0B]/50 bg-[#FEF7EC] dark:bg-[#F59E0B]/10 p-3 text-sm text-[#8A5A03] dark:text-[#FCD34D]"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" aria-hidden />
      <p>
        <strong className="font-bold">Testo in bozza: prima di vendere va rivisto da un professionista.</strong>{' '}
        Aggiornato il {aggiornato}.
      </p>
    </div>
  );
}

// Modulo "Recedi dal contratto qui" (art. 54-bis del Codice del Consumo)
function ModuloRecesso() {
  const { provider } = useAccess();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [rif, setRif] = useState('');
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState('');
  const [ricevuta, setRicevuta] = useState<{ receiptId: string; at: number; stored: 'device' | 'server' } | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const pronto = nome.trim().length > 1 && emailOk && !invio;

  async function invia(e: FormEvent) {
    e.preventDefault();
    if (!pronto) return;
    setInvio(true);
    setErrore('');
    try {
      const r = await provider.requestWithdrawal({
        name: nome.trim(),
        email: email.trim(),
        orderRef: rif.trim() || undefined,
      });
      setRicevuta(r);
    } catch {
      setErrore('Non siamo riusciti a registrare la richiesta. Riprova tra poco o scrivici ai contatti qui sopra.');
    } finally {
      setInvio(false);
    }
  }

  const quando = (ms: number) =>
    new Date(ms).toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'medium' });

  return (
    <div id="modulo-recesso" className="my-4 rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] p-4">
      <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Recedi dal contratto qui</h3>
      {!PAYMENTS_ENABLED && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Oggi il Pass non è ancora in vendita, quindi non c'è un acquisto da annullare. Il modulo resta visibile e funziona come funzionerà dopo l'apertura.
        </p>
      )}

      {ricevuta ? (
        <div role="status" className="mt-3 rounded-xl border border-[#22C55E]/50 bg-[#EDF9F1] dark:bg-[#22C55E]/10 p-3 text-sm text-[#14633B] dark:text-[#86EFAC]">
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 size={18} aria-hidden /> Richiesta di recesso ricevuta
          </p>
          <dl className="mt-2 space-y-1">
            <div><dt className="inline font-semibold">Ricevuta: </dt><dd className="inline break-all">{ricevuta.receiptId}</dd></div>
            <div><dt className="inline font-semibold">Data e ora: </dt><dd className="inline">{quando(ricevuta.at)}</dd></div>
          </dl>
          <p className="mt-2">
            Quando i pagamenti sono attivi, ti inviamo una ricevuta anche via email.
            {ricevuta.stored === 'device' && ' In questa versione la richiesta è registrata solo su questo dispositivo.'}
          </p>
        </div>
      ) : (
        <form onSubmit={invia} className="mt-3 space-y-3" noValidate>
          <div>
            <label htmlFor="rec-nome" className="mb-1 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Nome e cognome</label>
            <input id="rec-nome" className={CAMPO} value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="rec-email" className="mb-1 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Email usata per l'ordine</label>
            <input id="rec-email" type="email" inputMode="email" className={CAMPO} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="rec-rif" className="mb-1 block text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
              Riferimento dell'ordine <span className="font-normal text-gray-500 dark:text-gray-400">(facoltativo)</span>
            </label>
            <input id="rec-rif" className={CAMPO} value={rif} onChange={(e) => setRif(e.target.value)} />
          </div>
          {errore && <p role="alert" className="text-sm font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">{errore}</p>}
          <button
            type="submit"
            disabled={!pronto}
            className="w-full rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] active:scale-[.99] text-white font-bold text-base py-3.5 px-6 shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {invio ? 'Invio in corso…' : 'Conferma recesso'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Legal({ section, onBack, onSection }: {
  section: LegalSection;
  onBack: () => void;
  onSection: (s: LegalSection) => void;
}) {
  const doc = LEGAL_DOCS[section];
  const cima = useRef<HTMLDivElement>(null);

  // Cambiando scheda si riparte dall'alto
  useEffect(() => {
    cima.current?.scrollIntoView({ block: 'start' });
  }, [section]);

  const vai = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: riduciMovimento() ? 'auto' : 'smooth', block: 'start' });

  const sid = (i: number) => `${section}-s${i}`;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div ref={cima} className="-mt-2" />
      <div className={cn(MISURA, 'flex flex-col gap-4 pb-6')}>
        <div role="tablist" aria-label="Documenti legali" className="grid grid-cols-4 gap-1 rounded-xl bg-gray-100 dark:bg-[#0F172A] p-1">
          {LEGAL_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === section}
              aria-controls="legal-pannello"
              onClick={() => onSection(t.id)}
              className={cn(
                'rounded-lg px-1 py-2 text-[13px] font-bold transition-colors',
                t.id === section
                  ? 'bg-white dark:bg-[#334155] text-[#0F172A] dark:text-[#F8FAFC] shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <article id="legal-pannello" role="tabpanel" aria-labelledby={`tab-${section}`} className="flex flex-col gap-3">
          <h1 className="text-2xl font-extrabold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">{doc.titolo}</h1>
          {LEGAL_DRAFT && <Bozza aggiornato={doc.aggiornato} />}
          {!LEGAL_DRAFT && <p className="text-sm text-gray-500 dark:text-gray-400">Aggiornato il {doc.aggiornato}</p>}

          <nav aria-label="In questa pagina" className="rounded-xl border border-gray-200 dark:border-[#334155]">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] [&::-webkit-details-marker]:hidden">
                <h2 className="text-sm font-bold">In questa pagina <span className="font-normal text-gray-500 dark:text-gray-400">({doc.sezioni.length} sezioni)</span></h2>
                <ChevronDown size={18} aria-hidden className="shrink-0 text-gray-500 transition-transform group-open:rotate-180" />
              </summary>
              <ol className="space-y-0.5 px-3 pb-3 text-sm">
                {doc.sezioni.map((s, i) => (
                  <li key={sid(i)}>
                    <button
                      type="button"
                      onClick={() => vai(sid(i))}
                      className="w-full py-1.5 text-left font-semibold text-[#DC2626] dark:text-[#F87171] hover:underline underline-offset-2"
                    >
                      {i + 1}. {s.titolo}
                    </button>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          {doc.sezioni.map((s, i) => (
            <section key={sid(i)} id={sid(i)} className="scroll-mt-4 pt-2">
              <h2 className="text-lg font-extrabold leading-snug text-[#0F172A] dark:text-[#F8FAFC]">
                {i + 1}. {s.titolo}
              </h2>
              {s.paragrafi.map((p, j) => (
                <p key={j} className={cn(TESTO, 'mt-2')}>{p}</p>
              ))}
              {s.elenco && (
                <ul className={cn(TESTO, 'mt-2 list-disc space-y-1.5 pl-5 marker:text-gray-400')}>
                  {s.elenco.map((e, j) => <li key={j}>{e}</li>)}
                </ul>
              )}
              {s.modulo && <ModuloRecesso />}
            </section>
          ))}
        </article>
      </div>
    </Screen>
  );
}
