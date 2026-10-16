import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { LegalSection, PaywallReason } from '../types';
import {
  PAYMENTS_ENABLED, STRIPE_LINK,
} from '../config/offer';
import { useAccess, type AccessValue } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar, PrimaryButton } from '../components/ui';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Icona } from '../brand/icone/Icona';
import { IconaTono } from './extra/ui';
import { BloccoPrezzo, MOTIVI_PASS, TabellaConfronto } from './landing/dati';
import { InfoFoglio } from './landing/comune';
import { ICONE_LEGALI, NotaRecesso } from './Footer';
import { DISCLAIMER } from '../config/offer';
import { LEGAL_TABS } from '../legal';

interface PaywallProps {
  onBack(): void;
  onWaitlist(): void;
  onOpenLegal(s: LegalSection): void;
  reason?: PaywallReason;
}

const dataCorta = (iso: string | number) =>
  new Date(typeof iso === 'number' ? iso : `${iso}T12:00:00`).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

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
      <span data-testo-ok>{children}</span>
    </label>
  );
}

// Il Pass: intestazione con icona e due-tre parole, prezzo e date in cifre, confronto Gratis/Pass a icone (spunte, lucchetti, numeri),
// un solo pulsante pieno. Le spiegazioni stanno dietro la «i»; il recesso e l'avvertenza nel piè di pagina legale.
export default function Paywall({ onBack, onWaitlist, onOpenLegal, reason = 'generico' }: PaywallProps) {
  const access = useAccess() as Utente;
  const { provider, pass, entitlement, track, unlockDemo } = access;
  const [subito, setSubito] = useState(false);
  const [letto, setLetto] = useState(false);
  const [stato, setStato] = useState<{ ok: boolean; testo: string } | null>(null);
  const visto = useRef(false);

  useEffect(() => {
    if (visto.current || pass) return;
    visto.current = true;
    track({ name: 'paywall_seen' });
  }, [pass, track]);

  const testa = MOTIVI_PASS[reason] ?? MOTIVI_PASS.generico;

  const paga = () => {
    if (!PAYMENTS_ENABLED || !STRIPE_LINK) return;
    const url = new URL(STRIPE_LINK);
    url.searchParams.set('client_reference_id', access.userId ?? idAnonimo());
    if (access.email) url.searchParams.set('prefilled_email', access.email);
    window.location.href = url.toString();
  };

  const prova = async () => {
    try { await unlockDemo(); setStato({ ok: true, testo: 'Pass in prova attivo' }); } catch { setStato({ ok: false, testo: 'Non sbloccato, riprova' }); }
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
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-alto/30 bg-alto-tinta p-4" role="status">
          <Icona nome="stato-ok" size={30} className="text-alto-numero" titolo="Pass attivo" />
          <h1 className="text-2xl font-bold text-testo">Pass attivo</h1>
          <span className="ml-auto inline-flex items-center gap-1.5 font-bold text-alto-testo">
            <Icona nome="scadenza" size={20} />
            {entitlement.expiresAt ? dataCorta(entitlement.expiresAt) : <Icona nome="illimitato" size={22} titolo="Senza scadenza" />}
          </span>
          {entitlement.source === 'demo' && <Icona nome="stato-prova" size={22} className="text-medio-testo" titolo="Pass in prova" />}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <IconaTono tono="viola" lato={56} className="!rounded-full"><Icona nome={testa.icona} size={28} /></IconaTono>
          <h1 className="min-w-0 flex-1 text-3xl font-bold leading-tight text-testo">{testa.titolo}</h1>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-superficie-2 text-testo-tenue"><Icona nome="blocco" size={20} titolo="Nel Pass" /></span>
        </div>
      )}

      <BloccoPrezzo />

      <TabellaConfronto evidenzia={reason} />

      {!pass && PAYMENTS_ENABLED && (
        <div className="flex flex-col gap-3">
          <Casella spuntata={subito} onChange={setSubito}>
            Voglio iniziare subito a usare il Pass e so che così perdo il diritto di recesso dei 14 giorni.
          </Casella>
          <Casella spuntata={letto} onChange={setLetto}>
            Ho letto {link('termini', 'Termini')} e {link('privacy', 'Informativa privacy')}.
          </Casella>
          <PrimaryButton onClick={paga} disabled={!(subito && letto)}>Ordine con obbligo di pagare</PrimaryButton>
          <div className="flex justify-center">
            <InfoFoglio titolo="Pagamento" etichetta="Come avviene il pagamento">
              <p>Il pagamento avviene sulla pagina del provider: AddiOFA non vede né salva i dati della carta.</p>
            </InfoFoglio>
          </div>
        </div>
      )}

      {!pass && !PAYMENTS_ENABLED && (
        <div className="flex flex-col gap-2">
          <PrimaryButton onClick={onWaitlist}>Avvisami</PrimaryButton>
        </div>
      )}

      {!pass && provider.mode === 'demo' && (
        <div className="rounded-2xl border border-dashed border-medio/30 bg-medio-tinta p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icona nome="stato-prova" size={22} className="text-medio-testo" />
            <h2 className="flex-1 font-bold text-medio-testo">Prova</h2>
            <InfoFoglio titolo="Versione di prova" etichetta="Informazioni sulla prova" className="!text-medio-testo">
              <p>Questa è una versione di prova: non si paga nulla e il blocco, qui, è solo grafico (le domande sono già dentro la pagina). Puoi provare il Pass come se l'avessi comprato.</p>
            </InfoFoglio>
          </div>
          <button
            onClick={() => { playTapSound(); void prova(); }}
            className="w-full rounded-2xl border border-medio/30 bg-superficie text-testo font-bold py-3.5 px-6"
          >
            Sblocca il Pass in prova
          </button>
          {stato && (
            <p className={`flex items-center gap-2 text-sm font-bold ${stato.ok ? 'text-alto-testo' : 'text-basso-testo'}`} role="status">
              <Icona nome={stato.ok ? 'stato-ok' : 'stato-errore'} size={20} />{stato.testo}
            </p>
          )}
        </div>
      )}

      {pass && (
        <div className="mt-auto">
          <PrimaryButton onClick={onBack}>Torna all'app</PrimaryButton>
        </div>
      )}

      <footer className={cn('flex flex-col items-center gap-2 pb-1', !pass && 'mt-2')}>
        <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1" aria-label="Documenti legali">
          {LEGAL_TABS.filter(t => t.id !== 'cookie').map(t => (
            <button key={t.id} onClick={() => onOpenLegal(t.id)} className="inline-flex items-center gap-1.5 px-1.5 py-1.5 text-xs font-bold text-testo-tenue underline underline-offset-2">
              <Icona nome={ICONE_LEGALI[t.id]} size={15} />{t.label}
            </button>
          ))}
        </nav>
        <div data-testo-ok className="flex flex-col items-center gap-1.5">
          <p className="text-center text-[10px] font-semibold text-testo-tenue">{DISCLAIMER}</p>
          <NotaRecesso onOpenLegal={onOpenLegal} className="text-center text-[10px] font-semibold text-testo-tenue" />
        </div>
      </footer>
    </Screen>
  );
}
