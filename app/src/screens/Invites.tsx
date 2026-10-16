import { useEffect, useState } from 'react';
import { Check, Copy, Gift, MailCheck, Share2 } from 'lucide-react';
import { INVITE, PASS } from '../config/offer';
import type { InviteProgress } from '../access/provider';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar } from '../components/ui';
import { IconaTono, type Tono } from './extra/ui';
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

  // Ogni passo ha il suo colore per significato: condividere è azione (blu), confermare l'email è «verificato» (verde), il Pass è il premio (ambra).
  const passi: { t: string; d: string; tono: Tono; Icona: typeof Share2 }[] = [
    { t: 'Condividi il tuo codice', d: 'Mandalo a chi deve preparare il test d\'inglese.', tono: 'azione', Icona: Share2 },
    { t: 'I compagni lo usano e confermano l\'email', d: `Serve un'email @${INVITE.emailDomain} verificata con un codice che ricevono per posta.`, tono: 'alto', Icona: MailCheck },
    { t: `Quando ${richiesti} hanno finito il diagnostico`, d: `Il ${PASS.name} è tuo per ${PASS.validMonths} mesi, senza pagare. Il diagnostico deve durare almeno ${minuti} minuti.`, tono: 'medio', Icona: Gift },
  ];

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div>
        <h1 className="text-[26px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo">Invita {richiesti} compagni, il Pass è gratis</h1>
        <p className="mt-1 text-[14px] leading-[20px] text-testo-tenue">
          Condividi il tuo codice con chi deve preparare il test d'inglese.
        </p>
      </div>

      {sbloccato && <BloccoSbloccato onInizia={onBack} />}

      <ol className="flex flex-col gap-2.5" aria-label="Come funziona">
        {passi.map((p, i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl bg-superficie-2 border border-linea p-3.5">
            <IconaTono tono={p.tono} lato={36}><p.Icona size={18} /></IconaTono>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold leading-snug text-testo">{p.t}</span>
              <span className="block text-[13px] leading-snug text-testo-tenue">{p.d}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4 flex flex-col gap-3">
        <span className="text-[13px] font-bold text-azione-scuro">Il tuo codice</span>
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
          <h2 className="text-[15.5px] leading-[20px] font-bold text-testo">I tuoi inviti</h2>
          <span className={cn('text-[15.5px] font-extrabold tabular-nums', verificati > 0 ? 'text-alto-testo' : 'text-testo-tenue')} aria-label={`${verificati} su ${richiesti}`}>{verificati}/{richiesti}</span>
        </div>
        {/* Tre tappe collegate (come nel concept): verde e spuntata quando il compagno è verificato, vuota quando è in attesa. Il server non dice chi sono. */}
        <ol className="mt-3 flex items-center" aria-label="Compagni verificati">
          {Array.from({ length: richiesti }, (_, i) => {
            const fatto = i < verificati;
            return (
              <li key={i} className={cn('flex items-center', i < richiesti - 1 && 'flex-1')}>
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full border-2', fatto ? 'border-alto-pieno bg-alto-pieno text-azione-su' : 'border-linea bg-superficie text-testo-tenue')}
                  aria-label={`Compagno ${i + 1}: ${fatto ? 'verificato' : 'in attesa'}`}>
                  {fatto ? <Check size={18} strokeWidth={3} aria-hidden /> : <span className="text-[13px] font-extrabold" aria-hidden>{i + 1}</span>}
                </span>
                {i < richiesti - 1 && <span className={cn('mx-1 h-1 flex-1 rounded-full', i < verificati - 1 ? 'bg-alto' : 'bg-tacca/60')} aria-hidden />}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[13px] leading-[18px] text-testo-tenue">
          {verificati === 0 ? 'Nessun compagno verificato, per ora. ' : `${verificati} ${verificati === 1 ? 'compagno ha' : 'compagni hanno'} finito il diagnostico. `}
          Il server comunica solo quanti sono, non chi: per questo qui non ci sono nomi.
        </p>
      </div>

      <div>
        <h2 className="mb-2 text-[15.5px] leading-[20px] font-bold text-testo">Le regole</h2>
        <ul className="flex flex-col gap-2 text-[14px] leading-[20px] text-testo list-disc pl-5">
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
        <label htmlFor="invito-codice" className="text-[15.5px] leading-[20px] font-bold text-testo">Hai un codice?</label>
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
            className="shrink-0 rounded-2xl border border-azione bg-superficie text-azione-scuro font-bold px-5 disabled:opacity-40 disabled:pointer-events-none"
          >
            Usa il codice
          </button>
        </div>
        {esito && (
          <p className={cn('text-sm font-bold', esito.ok ? 'text-alto-testo' : 'text-basso-testo')} role="status">{esito.message}</p>
        )}
      </div>

      <div className="mt-auto pt-2">
        <button type="button" onClick={() => { playTapSound(); onBack(); }} className="brand-premibile w-full rounded-2xl py-3.5 text-[15px] font-bold text-azione-scuro">Torna all'app</button>
      </div>
    </Screen>
  );
}
