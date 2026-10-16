import { FormEvent, useEffect, useRef, useState } from 'react';
import { Icona } from '../brand/icone/Icona';
import type { LegalSection } from '../types';
import { Screen, TopBar } from '../components/ui';
import { cn } from '../lib/utils';
import { PAYMENTS_ENABLED } from '../config/offer';
import { useAccess } from '../access/context';
import { LEGAL_DOCS, LEGAL_DRAFT, LEGAL_TABS } from '../legal';
import { ICONE_LEGALI } from './Footer';

const MISURA = 'mx-auto w-full max-w-[65ch]';
const TESTO = 'text-[15px] leading-[1.7] text-testo';
const CAMPO =
  'w-full rounded-xl border border-linea bg-superficie-2 px-3 py-3 text-base text-testo placeholder:text-testo-tenue focus:outline-none focus:ring-2 focus:ring-azione';

function Bozza({ aggiornato }: { aggiornato: string }) {
  return (
    <div
      role="note"
      className="flex gap-2.5 rounded-xl border border-medio/30 bg-medio-tinta p-3 text-sm text-medio-testo"
    >
      <Icona nome="stato-attenzione" size={20} className="mt-0.5 shrink-0" titolo="Bozza" />
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
    <div id="modulo-recesso" className="my-4 rounded-2xl border border-linea bg-superficie-2 p-4">
      <h3 className="text-lg font-extrabold text-testo">Recedi dal contratto qui</h3>
      {!PAYMENTS_ENABLED && (
        <p className="mt-1 text-sm text-testo-tenue">
          Oggi il Pass non è ancora in vendita, quindi non c'è un acquisto da annullare. Il modulo resta visibile e funziona come funzionerà dopo l'apertura.
        </p>
      )}

      {ricevuta ? (
        <div role="status" className="mt-3 rounded-xl border border-alto/30 bg-alto-tinta p-3 text-sm text-alto-testo">
          <p className="flex items-center gap-2 font-bold">
            <Icona nome="stato-ok" size={20} /> Richiesta di recesso ricevuta
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
            <label htmlFor="rec-nome" className="mb-1 block text-sm font-semibold text-testo">Nome e cognome</label>
            <input id="rec-nome" className={CAMPO} value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" required />
          </div>
          <div>
            <label htmlFor="rec-email" className="mb-1 block text-sm font-semibold text-testo">Email usata per l'ordine</label>
            <input id="rec-email" type="email" inputMode="email" className={CAMPO} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <label htmlFor="rec-rif" className="mb-1 block text-sm font-semibold text-testo">
              Riferimento dell'ordine <span className="font-normal text-testo-tenue">(facoltativo)</span>
            </label>
            <input id="rec-rif" className={CAMPO} value={rif} onChange={(e) => setRif(e.target.value)} />
          </div>
          {errore && <p role="alert" className="text-sm font-semibold text-basso-testo">{errore}</p>}
          <button
            type="submit"
            disabled={!pronto}
            className="w-full rounded-2xl bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base py-3.5 px-6 shadow-sm dark:shadow-none transition-colors duration-100 disabled:opacity-40 disabled:pointer-events-none"
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
    document.getElementById(id)?.scrollIntoView({ block: 'start' });

  const sid = (i: number) => `${section}-s${i}`;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div ref={cima} className="-mt-2" />
      <div className={cn(MISURA, 'flex flex-col gap-4 pb-6')}>
        <div role="tablist" aria-label="Documenti legali" className="grid grid-cols-4 gap-1 rounded-xl bg-superficie-2 p-1">
          {LEGAL_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === section}
              aria-controls="legal-pannello"
              onClick={() => onSection(t.id)}
              className={cn(
                'flex flex-col items-center rounded-lg px-1 py-2 text-[12px] font-bold transition-colors duration-100',
                t.id === section
                  ? 'bg-superficie text-testo shadow-sm dark:shadow-none'
                  : 'text-testo-tenue hover:text-testo'
              )}
            >
              <Icona nome={ICONE_LEGALI[t.id]} size={20} className="mb-0.5" />
              {t.label}
            </button>
          ))}
        </div>

        <article id="legal-pannello" data-testo-ok role="tabpanel" aria-labelledby={`tab-${section}`} className="flex flex-col gap-3">
          <h1 className="text-2xl font-extrabold leading-tight text-testo">{doc.titolo}</h1>
          {LEGAL_DRAFT && <Bozza aggiornato={doc.aggiornato} />}
          {!LEGAL_DRAFT && <p className="text-sm text-testo-tenue">Aggiornato il {doc.aggiornato}</p>}

          <nav aria-label="Indice della pagina" className="rounded-xl bg-superficie-2">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-bold text-testo [&::-webkit-details-marker]:hidden">
                <h2 className="flex items-center gap-2 text-sm font-bold"><Icona nome="dettaglio" size={18} />Indice <span className="font-normal text-testo-tenue">{doc.sezioni.length}</span></h2>
                <Icona nome="espandi" size={20} className="shrink-0 text-testo-tenue group-open:rotate-180" />
              </summary>
              <ol className="space-y-0.5 px-3 pb-3 text-sm">
                {doc.sezioni.map((s, i) => (
                  <li key={sid(i)}>
                    <button
                      type="button"
                      onClick={() => vai(sid(i))}
                      className="w-full py-1.5 text-left font-semibold text-azione-scuro hover:underline underline-offset-2"
                    >
                      {i + 1}. {s.titolo}
                    </button>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          {doc.sezioni.map((s, i) => (
            <section key={sid(i)} id={sid(i)} className="scroll-mt-4 border-t border-linea pt-5 mt-2">
              <h2 className="text-[17px] font-extrabold leading-snug text-testo">
                <span className="mr-1.5 text-azione-scuro tabular-nums">{i + 1}.</span>{s.titolo}
              </h2>
              {s.paragrafi.map((p, j) => (
                <p key={j} className={cn(TESTO, 'mt-2')}>{p}</p>
              ))}
              {s.elenco && (
                <ul className={cn(TESTO, 'mt-2 list-disc space-y-1.5 pl-5 marker:text-testo-tenue')}>
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
