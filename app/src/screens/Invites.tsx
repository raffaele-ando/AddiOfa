import { useEffect, useState } from 'react';
import { Check, Copy, Hourglass, Share2 } from 'lucide-react';
import { INVITE, PASS } from '../config/offer';
import type { InviteProgress } from '../access/provider';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar, PrimaryButton } from '../components/ui';
import FoglioCondividi from './extra/sfide/FoglioCondividi';
import { BloccoSbloccato, sbloccatoConInviti } from './extra/sfide/AccessoSbloccato';
import { indirizzoApp } from './extra/sfide/dati';

interface InvitesProps {
  onBack(): void;
}

export default function Invites({ onBack }: InvitesProps) {
  const { provider, entitlement, pass, refresh } = useAccess();
  const [codice, setCodice] = useState<string | null>(null);
  const [avanzamento, setAvanzamento] = useState<InviteProgress | null>(null);
  const [errore, setErrore] = useState<string | null>(null);
  const [copia, setCopia] = useState<string | null>(null);
  const [inserito, setInserito] = useState('');
  const [esito, setEsito] = useState<{ ok: boolean; message: string } | null>(null);
  const [invio, setInvio] = useState(false);
  const [foglio, setFoglio] = useState(false);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const [c, p] = await Promise.all([provider.createInvite(), provider.inviteProgress()]);
        if (!vivo) return;
        setCodice(c.code);
        setAvanzamento(p);
        // Il server concede il Pass quando i compagni verificati sono abbastanza: si rilegge il Pass per mostrarlo subito
        if (p.verified >= p.required && !pass) void refresh();
      } catch {
        if (vivo) setErrore('Non riesco a caricare il tuo codice. Riprova tra poco.');
      }
    })();
    return () => { vivo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const sbloccato = pass && sbloccatoConInviti(entitlement);
  const testoInvito = codice
    ? `Studio per il test d'inglese dell'OFA con AddiOFA. Usa il mio codice invito ${codice}: nell'app apri «Inviti» e scrivilo in «Hai un codice?».`
    : '';

  const passi = [
    { t: 'Condividi il tuo codice', d: 'Mandalo a chi deve preparare il test d\'inglese.' },
    { t: 'I compagni lo usano e confermano l\'email', d: `Serve un'email @${INVITE.emailDomain} verificata con un codice che ricevono per posta.` },
    { t: `Quando ${richiesti} hanno finito il diagnostico`, d: `Il ${PASS.name} è tuo per ${PASS.validMonths} mesi, senza pagare. Il diagnostico deve durare almeno ${minuti} minuti.` },
  ];

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div>
        <h1 className="text-3xl font-bold leading-tight text-testo">Invita {richiesti} compagni, il Pass è gratis</h1>
        <p className="mt-2 font-semibold text-testo-tenue">
          Condividi il tuo codice con chi deve preparare il test d'inglese.
        </p>
      </div>

      {sbloccato && <BloccoSbloccato onInizia={onBack} />}

      <ol className="flex flex-col gap-2.5" aria-label="Come funziona">
        {passi.map((p, i) => (
          <li key={i} className="flex gap-3 rounded-2xl bg-superficie-2 border border-linea p-3.5">
            <span className="w-7 h-7 shrink-0 rounded-full bg-azione-tinta text-azione-scuro text-sm font-extrabold flex items-center justify-center" aria-hidden>{i + 1}</span>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold leading-snug text-testo">{p.t}</span>
              <span className="block text-[13px] font-semibold leading-snug text-testo-tenue">{p.d}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4 flex flex-col gap-3">
        <span className="text-xs font-bold text-testo-tenue">Il tuo codice</span>
        {codice ? (
          <>
            <span className="select-all break-all text-3xl font-bold tracking-widest text-testo" aria-label={`Il tuo codice è ${codice}`}>{codice}</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { playTapSound(); setFoglio(true); }}
                className="inline-flex items-center gap-2 rounded-xl bg-azione text-azione-su font-bold text-sm px-4 py-2.5"
              >
                <Share2 size={16} aria-hidden /> Condividi
              </button>
              <button
                onClick={() => { playTapSound(); void copiaCodice(); }}
                className="inline-flex items-center gap-2 rounded-xl border border-azione text-azione-scuro font-bold text-sm px-4 py-2.5"
              >
                <Copy size={16} aria-hidden /> Copia il codice
              </button>
            </div>
            {copia && <p className="text-xs font-bold text-testo-tenue" role="status">{copia}</p>}
            <p className="text-xs font-semibold text-testo-tenue">Il codice si scrive dentro l'app: non è un link che si apre da solo.</p>
          </>
        ) : (
          <span className="text-sm font-semibold text-testo-tenue" role={errore ? 'alert' : 'status'}>{errore ?? 'Preparo il tuo codice…'}</span>
        )}
      </div>
      {codice && <FoglioCondividi aperto={foglio} onChiudi={() => setFoglio(false)} testo={testoInvito} url={indirizzoApp()} titolo="Invita un compagno" />}

      <div>
        <div className="flex justify-between items-baseline">
          <h2 className="font-bold text-lg text-testo">I tuoi inviti</h2>
          <span className="font-bold text-lg text-testo" aria-label={`${verificati} su ${richiesti}`}>{verificati}/{richiesti}</span>
        </div>
        <ul className="mt-2 flex flex-col gap-2">
          {Array.from({ length: richiesti }, (_, i) => {
            const fatto = i < verificati;
            return (
              <li key={i} className={cn('flex items-center gap-3 rounded-2xl border p-3', fatto ? 'bg-alto-tinta border-alto/30' : 'bg-superficie-2 border-linea')}>
                <span className={cn('w-8 h-8 shrink-0 rounded-full flex items-center justify-center', fatto ? 'bg-alto-pieno text-azione-su' : 'bg-superficie text-testo-tenue border border-linea')} aria-hidden>
                  {fatto ? <Check size={17} strokeWidth={3} /> : <Hourglass size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-bold text-testo">Compagno {i + 1}</span>
                  <span className={cn('block text-[13px] font-semibold', fatto ? 'text-alto-testo' : 'text-testo-tenue')}>{fatto ? 'Verificato: ha finito il diagnostico' : 'In attesa…'}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-xs font-semibold text-testo-tenue">Il server comunica solo quanti compagni sono già verificati, non chi sono: per questo qui non ci sono nomi.</p>
      </div>

      <div>
        <h2 className="font-bold text-lg text-testo mb-2">Le regole</h2>
        <ul className="flex flex-col gap-2 text-sm font-semibold text-testo list-disc pl-5">
          <li>Il {PASS.name} diventa gratis quando {INVITE.required} compagni con email @{INVITE.emailDomain} verificata finiscono il diagnostico, impiegando almeno {minuti} minuti.</li>
          <li>Chi usa il tuo codice avrà il {INVITE.inviteeDiscountPct} % di sconto sul Pass: è previsto per quando i pagamenti saranno attivi, oggi non c'è ancora nessuno sconto da applicare.</li>
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
