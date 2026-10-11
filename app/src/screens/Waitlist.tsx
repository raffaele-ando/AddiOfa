import { useState } from 'react';
import type { LegalSection } from '../types';
import { DISCLAIMER, PASS, PublicAudience } from '../config/offer';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from '../components/ui';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';

interface WaitlistProps {
  onBack(): void;
  onDone(): void;
  onOpenLegal(s: LegalSection): void;
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Waitlist({ onBack, onDone, onOpenLegal }: WaitlistProps) {
  const { provider, track } = useAccess();
  const [email, setEmail] = useState('');
  const [toccata, setToccata] = useState(false);
  const [audience, setAudience] = useState<PublicAudience | null>(null);
  const [consenso, setConsenso] = useState(false);
  const [invio, setInvio] = useState(false);
  const [esito, setEsito] = useState<{ ok: boolean; message: string } | null>(null);

  const pulita = email.trim();
  const emailValida = EMAIL_OK.test(pulita);
  const pronto = emailValida && audience !== null && consenso && !invio;

  const invia = async () => {
    if (!pronto || !audience) return;
    setInvio(true);
    try {
      const r = await provider.joinWaitlist({ email: pulita, audience, consent: consenso });
      setEsito({ ok: r.ok, message: r.message });
      if (r.ok) track({ name: 'waitlist_join', audience });
    } catch {
      setEsito({ ok: false, message: 'Non sono riuscito a salvare la tua email. Riprova tra poco.' });
    } finally {
      setInvio(false);
    }
  };

  if (esito?.ok) {
    return (
      <Screen>
        <TopBar />
        <div className="mx-auto my-4 flex items-center justify-center" style={{ minHeight: 140 }}>
          <IllustrazioneAnimata nome="successo" lato={160} />
        </div>
        <h1 className="text-3xl font-bold text-center text-testo">Fatto</h1>
        <p className="text-center font-semibold text-testo-tenue" role="status">{esito.message}</p>
        <div className="mt-auto">
          <PrimaryButton onClick={onDone}>Torna all'app</PrimaryButton>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div>
        <h1 className="text-3xl font-bold leading-tight text-testo">Avvisami quando apre</h1>
        <p className="mt-2 font-semibold text-testo-tenue">
          I pagamenti del {PASS.name} non sono ancora attivi. Lascia la tua email: ti scriviamo una sola volta, quando aprono.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="waitlist-email" className="text-sm font-bold text-testo">La tua email</label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setToccata(true)}
          aria-invalid={toccata && !emailValida}
          aria-describedby="waitlist-email-err"
          placeholder="nome@esempio.it"
          className="w-full rounded-2xl border border-linea bg-superficie-2 px-4 py-3.5 font-semibold text-testo placeholder:text-testo-tenue focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30"
        />
        <p id="waitlist-email-err" className="text-xs font-bold text-basso-testo min-h-4">
          {toccata && !emailValida ? 'Controlla l\'indirizzo: deve essere del tipo nome@esempio.it.' : ''}
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-bold text-testo mb-2">Sei qui perché…</legend>
        <ChoiceCard selected={audience === 'recupero'} onClick={() => setAudience('recupero')} title="Ho l'OFA e devo recuperarlo" />
        <ChoiceCard selected={audience === 'prevenzione'} onClick={() => setAudience('prevenzione')} title="Preparo il test d'ingresso" />
      </fieldset>

      <label className="flex items-start gap-3 cursor-pointer text-sm font-semibold text-testo">
        <input
          type="checkbox"
          checked={consenso}
          onChange={e => { playTapSound(); setConsenso(e.target.checked); }}
          className="mt-0.5 w-5 h-5 shrink-0 accent-azione"
        />
        <span>Voglio ricevere una sola email quando i pagamenti aprono.</span>
      </label>
      <p className="text-xs font-semibold text-testo-tenue -mt-2">
        Uso la tua email solo per questo avviso. Dettagli nell'<button type="button" onClick={() => onOpenLegal('privacy')} className="underline underline-offset-2 font-bold">Informativa privacy</button>.
      </p>

      {esito && !esito.ok && (
        <p className="rounded-2xl bg-basso-tinta text-basso-testo p-3 text-sm font-bold" role="alert">{esito.message}</p>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton onClick={() => { void invia(); }} disabled={!pronto}>{invio ? 'Invio in corso' : 'Avvisami quando apre'}</PrimaryButton>
        <SecondaryButton onClick={onBack}>Indietro</SecondaryButton>
        <p className="text-center text-[10px] font-semibold text-testo-tenue">{DISCLAIMER}</p>
      </div>
    </Screen>
  );
}
