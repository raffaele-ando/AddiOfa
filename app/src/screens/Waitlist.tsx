import { useState } from 'react';
import type { LegalSection } from '../types';
import { PublicAudience } from '../config/offer';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { Screen, TopBar, PrimaryButton, ChoiceCard } from '../components/ui';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Icona } from '../brand/icone/Icona';
import { InfoFoglio } from './landing/comune';
import { InfoIndipendenza } from './Footer';

interface WaitlistProps {
  onBack(): void;
  onDone(): void;
  onOpenLegal(s: LegalSection): void;
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Lista d'attesa: campo email, due scelte, consenso, un solo pulsante. L'esito è un'icona; il messaggio del server sta dietro la «i».
export default function Waitlist({ onBack, onDone, onOpenLegal }: WaitlistProps) {
  const { provider, track } = useAccess();
  const [email, setEmail] = useState('');
  const [toccata, setToccata] = useState(false);
  const [audience, setAudience] = useState<PublicAudience | null>(null);
  const [consenso, setConsenso] = useState(false);
  const [invio, setInvio] = useState(false);
  const [esito, setEsito] = useState<{ ok: boolean; message: string; sulDispositivo?: boolean } | null>(null);

  const pulita = email.trim();
  const emailValida = EMAIL_OK.test(pulita);
  const pronto = emailValida && audience !== null && consenso && !invio;

  const invia = async () => {
    if (!pronto || !audience) return;
    setInvio(true);
    try {
      const r = await provider.joinWaitlist({ email: pulita, audience, consent: consenso });
      setEsito({ ok: r.ok, message: r.message, sulDispositivo: r.stored === 'device' });
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
        <div className="flex items-center justify-center gap-2" role="status">
          <Icona nome="stato-ok" size={30} className="text-alto-numero" />
          <h1 className="text-3xl font-bold text-center text-testo">Fatto</h1>
          {esito.sulDispositivo && <Icona nome="stato-prova" size={22} className="text-medio-testo" titolo="Solo su questo dispositivo" />}
          <InfoFoglio titolo="Iscrizione" etichetta="Dettagli dell'iscrizione"><p>{esito.message}</p></InfoFoglio>
        </div>
        <div className="mt-auto">
          <PrimaryButton onClick={onDone}>Torna all'app</PrimaryButton>
        </div>
      </Screen>
    );
  }

  const sbagliata = toccata && !emailValida;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div className="flex items-center gap-3">
        <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-azione-tinta text-azione-scuro"><Icona nome="lista-attesa" size={26} /></span>
        <h1 className="text-3xl font-bold leading-tight text-testo">Avvisami</h1>
        <InfoFoglio titolo="Lista d'attesa" etichetta="Come funziona la lista d'attesa">
          <p>I pagamenti del Pass non sono ancora attivi. Uso la tua email solo per avvisarti una volta, all'apertura. La lista d'attesa non è un ordine e non blocca il prezzo.</p>
        </InfoFoglio>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="waitlist-email" className="sr-only">La tua email</label>
        <div className="relative">
          <Icona nome="email" size={22} className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${sbagliata ? 'text-basso-testo' : 'text-testo-tenue'}`} />
          <input
            id="waitlist-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setToccata(true)}
            aria-invalid={sbagliata}
            placeholder="nome@esempio.it"
            className={`w-full rounded-2xl border bg-superficie-2 py-3.5 pl-12 pr-4 font-semibold text-testo placeholder:text-testo-tenue focus:outline-none focus:ring-2 ${sbagliata ? 'border-basso focus:border-basso focus:ring-basso/30' : 'border-linea focus:border-azione focus:ring-azione/30'}`}
          />
          {sbagliata && <Icona nome="stato-attenzione" size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-basso-testo" titolo="Indirizzo non valido" />}
        </div>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="sr-only">Perché sei qui</legend>
        <ChoiceCard selected={audience === 'recupero'} onClick={() => setAudience('recupero')} title="Ho l'OFA" />
        <ChoiceCard selected={audience === 'prevenzione'} onClick={() => setAudience('prevenzione')} title="Test d'ingresso" />
      </fieldset>

      <div className="flex items-start gap-3">
        <label className="flex flex-1 items-start gap-3 cursor-pointer text-sm font-semibold text-testo">
          <input
            type="checkbox"
            checked={consenso}
            onChange={e => { playTapSound(); setConsenso(e.target.checked); }}
            className="mt-0.5 w-5 h-5 shrink-0 accent-azione"
          />
          <span data-testo-ok>Voglio ricevere una sola email quando i pagamenti aprono.</span>
        </label>
        <button type="button" onClick={() => onOpenLegal('privacy')} aria-label="Informativa privacy"
          className="brand-premibile grid h-9 w-9 shrink-0 place-items-center rounded-full bg-superficie-2 text-testo"><Icona nome="privacy" size={20} /></button>
      </div>

      {esito && !esito.ok && (
        <div className="flex items-center gap-2 rounded-2xl bg-basso-tinta p-3 text-basso-testo" role="alert">
          <Icona nome="stato-errore" size={22} titolo="Non inviato" />
          <span className="flex-1 font-bold">Non inviato</span>
          <InfoFoglio titolo="Non inviato" etichetta="Dettagli dell'errore"><p>{esito.message}</p></InfoFoglio>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton onClick={() => { void invia(); }} disabled={!pronto}>{invio ? 'Invio' : 'Avvisami'}</PrimaryButton>
        <div className="flex justify-center"><InfoIndipendenza /></div>
      </div>
    </Screen>
  );
}
