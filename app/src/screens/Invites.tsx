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
        <h1 className="text-3xl font-bold leading-tight text-testo">Invita 3 compagni, il Pass è gratis</h1>
        <p className="mt-2 font-semibold text-testo-tenue">
          Condividi il tuo codice con chi deve preparare il test d'inglese.
        </p>
      </div>

      <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4 flex flex-col gap-3">
        <span className="text-xs font-bold text-testo-tenue">Il tuo codice</span>
        {codice ? (
          <>
            <span className="select-all break-all text-3xl font-bold tracking-widest text-testo" aria-label={`Il tuo codice è ${codice}`}>{codice}</span>
            <button
              onClick={() => { playTapSound(); void copiaCodice(); }}
              className="self-start inline-flex items-center gap-2 rounded-xl border border-azione text-azione-scuro font-bold text-sm px-4 py-2.5"
            >
              <Copy size={16} aria-hidden /> Copia il codice
            </button>
            {copia && <p className="text-xs font-bold text-testo-tenue" role="status">{copia}</p>}
          </>
        ) : (
          <span className="text-sm font-semibold text-testo-tenue" role={errore ? 'alert' : 'status'}>{errore ?? 'Preparo il tuo codice…'}</span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-baseline">
          <h2 className="font-bold text-lg text-testo">Compagni verificati</h2>
          <span className="font-bold text-lg text-testo" aria-label={`${verificati} su ${richiesti}`}>{verificati}/{richiesti}</span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {Array.from({ length: richiesti }, (_, i) => (
            <div key={i} className={cn('h-2.5 flex-1 rounded-full', i < verificati ? 'bg-azione' : 'bg-tacca')} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-lg text-testo mb-2">Le regole</h2>
        <ul className="flex flex-col gap-2 text-sm font-semibold text-testo list-disc pl-5">
          <li>Il {PASS.name} diventa gratis quando {INVITE.required} compagni con email @{INVITE.emailDomain} verificata finiscono il diagnostico, impiegando almeno {minuti} minuti.</li>
          <li>Chi usa il tuo codice ha il {INVITE.inviteeDiscountPct} % di sconto sul Pass.</li>
          <li>Conta finire il diagnostico, non il punteggio: non c'è nessun premio per chi sbaglia apposta.</li>
        </ul>
        {provider.mode === 'demo' && (
          <p className="mt-3 rounded-2xl bg-medio-tinta p-3 text-xs font-bold text-medio-testo">
            In questa versione dimostrativa la verifica delle email non è attiva: il conteggio non può essere confermato e non si sblocca nessun Pass.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="invito-codice" className="font-bold text-lg text-testo">Hai un codice?</label>
        <div className="flex gap-2">
          <input
            id="invito-codice"
            value={inserito}
            onChange={e => { setInserito(e.target.value); setEsito(null); }}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="Scrivilo qui"
            className="min-w-0 flex-1 rounded-2xl border border-linea bg-superficie-2 px-4 py-3 font-bold tracking-widest text-testo placeholder:text-testo-tenue placeholder:tracking-normal placeholder:font-semibold focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30"
          />
          <button
            onClick={() => { playTapSound(); void usa(); }}
            disabled={!inserito.trim() || invio}
            className="shrink-0 rounded-2xl bg-azione text-azione-su font-bold px-5 disabled:opacity-40 disabled:pointer-events-none"
          >
            Usa il codice
          </button>
        </div>
        {esito && (
          <p className={cn('text-sm font-bold', esito.ok ? 'text-alto-testo' : 'text-basso-testo')} role="status">{esito.message}</p>
        )}
      </div>

      <div className="mt-auto pt-2">
        <PrimaryButton onClick={onBack}>Torna all'app</PrimaryButton>
      </div>
    </Screen>
  );
}
