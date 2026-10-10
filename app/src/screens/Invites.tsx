import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { INVITE, PASS } from '../config/offer';
import type { InviteProgress } from '../access/provider';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar, PrimaryButton } from '../components/ui';

interface InvitesProps {
  onBack(): void;
}

export default function Invites({ onBack }: InvitesProps) {
  const { provider } = useAccess();
  const [codice, setCodice] = useState<string | null>(null);
  const [avanzamento, setAvanzamento] = useState<InviteProgress | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [copia, setCopia] = useState<string | null>(null);
  const [inserito, setInserito] = useState('');
  const [esito, setEsito] = useState<{ ok: boolean; message: string } | null>(null);
  const [invio, setInvio] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const [c, p] = await Promise.all([provider.createInvite(), provider.inviteProgress()]);
        if (!vivo) return;
        setCodice(c.code);
        setAvanzamento(p);
      } catch {
        if (vivo) setErrore('Non riesco a caricare il tuo codice. Riprova tra poco.');
      }
    })();
    return () => { vivo = false; };
  }, [provider]);

  const copiaCodice = async () => {
    if (!codice) return;
    try {
      await navigator.clipboard.writeText(codice);
      setCopia('Codice copiato.');
    } catch {
      setCopia('Copia non riuscita: selezionalo e copialo a mano.');
    }
  };

  const usa = async () => {
    const c = inserito.trim();
    if (!c || invio) return;
    setInvio(true);
    try {
      setEsito(await provider.redeemInvite(c));
    } catch {
      setEsito({ ok: false, message: 'Non sono riuscito a controllare il codice. Riprova.' });
    } finally {
      setInvio(false);
    }
  };

  const richiesti = avanzamento?.required ?? INVITE.required;
  const verificati = Math.min(avanzamento?.verified ?? 0, richiesti);
  const minuti = Math.round(INVITE.minDiagnosticSeconds / 60);

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div>
        <h1 className="text-3xl font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">Invita 3 compagni, il Pass è gratis</h1>
        <p className="mt-2 font-semibold text-gray-500 dark:text-gray-400">
          Condividi il tuo codice con chi deve preparare il test d'inglese.
        </p>
      </div>

      <div className="rounded-2xl border border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30 p-4 flex flex-col gap-3">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Il tuo codice</span>
        {codice ? (
          <>
            <span className="select-all break-all text-3xl font-bold tracking-widest text-[#0F172A] dark:text-[#F8FAFC]" aria-label={`Il tuo codice è ${codice}`}>{codice}</span>
            <button
              onClick={() => { playTapSound(); void copiaCodice(); }}
              className="self-start inline-flex items-center gap-2 rounded-xl border border-[#EF4444] text-[#B91C1C] dark:text-[#FCA5A5] font-bold text-sm px-4 py-2.5"
            >
              <Copy size={16} aria-hidden /> Copia il codice
            </button>
            {copia && <p className="text-xs font-bold text-gray-600 dark:text-gray-300" role="status">{copia}</p>}
          </>
        ) : (
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400" role={errore ? 'alert' : 'status'}>{errore ?? 'Preparo il tuo codice…'}</span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-baseline">
          <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">Compagni verificati</h2>
          <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]" aria-label={`${verificati} su ${richiesti}`}>{verificati}/{richiesti}</span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {Array.from({ length: richiesti }, (_, i) => (
            <div key={i} className={cn('h-2.5 flex-1 rounded-full', i < verificati ? 'bg-[#EF4444]' : 'bg-gray-200 dark:bg-[#334155]')} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC] mb-2">Le regole</h2>
        <ul className="flex flex-col gap-2 text-sm font-semibold text-[#0F172A] dark:text-gray-200 list-disc pl-5">
          <li>Il {PASS.name} diventa gratis quando {INVITE.required} compagni con email @{INVITE.emailDomain} verificata finiscono il diagnostico, impiegando almeno {minuti} minuti.</li>
          <li>Chi usa il tuo codice ha il {INVITE.inviteeDiscountPct} % di sconto sul Pass.</li>
          <li>Conta finire il diagnostico, non il punteggio: non c'è nessun premio per chi sbaglia apposta.</li>
        </ul>
        {provider.mode === 'demo' && (
          <p className="mt-3 rounded-2xl bg-[#FEF3C7] dark:bg-[#78350F]/30 p-3 text-xs font-bold text-[#78350F] dark:text-[#FDE68A]">
            In questa versione dimostrativa la verifica delle email non è attiva: il conteggio non può essere confermato e non si sblocca nessun Pass.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="invito-codice" className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">Hai un codice?</label>
        <div className="flex gap-2">
          <input
            id="invito-codice"
            value={inserito}
            onChange={e => { setInserito(e.target.value); setEsito(null); }}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="Scrivilo qui"
            className="min-w-0 flex-1 rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 py-3 font-bold tracking-widest text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-semibold focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/30"
          />
          <button
            onClick={() => { playTapSound(); void usa(); }}
            disabled={!inserito.trim() || invio}
            className="shrink-0 rounded-2xl bg-[#EF4444] text-white font-bold px-5 disabled:opacity-40 disabled:pointer-events-none"
          >
            Usa il codice
          </button>
        </div>
        {esito && (
          <p className={cn('text-sm font-bold', esito.ok ? 'text-[#15803D] dark:text-[#34D399]' : 'text-[#B91C1C] dark:text-[#FCA5A5]')} role="status">{esito.message}</p>
        )}
      </div>

      <div className="mt-auto pt-2">
        <PrimaryButton onClick={onBack}>Torna all'app</PrimaryButton>
      </div>
    </Screen>
  );
}
