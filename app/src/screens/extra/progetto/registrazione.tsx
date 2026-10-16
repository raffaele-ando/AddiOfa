// Pezzi della registrazione, usati dal funnel (components/Onboarding.tsx) e da «Il tuo profilo» (Project ID): i campi di «Chi sei»,
// di «Il tuo corso» e dei consensi. Regole: obbligatori solo nome ed email; l'email si controlla nel formato e nel dominio e si dice «non verificata»;
// i tre consensi sono facoltativi e PARTONO SEMPRE SPENTI. Le frasi dei consensi e dell'informativa sono testo legale (data-testo-ok).
import { useId, useState, type ReactNode } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { InfoFoglio } from '../../landing/comune';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { CONTACT_EMAIL, TITOLARE } from '../../../config/offer';
import { CORSI, CORSO_ALTRO, PROVENIENZE, SEDI } from '../../../lib/progetto/corsi';
import { CONSENSI_VUOTI, type Consensi, type Profilo } from '../../../lib/progetto/profilo';
import { controllaEmailPolimi, NOME_MAX, TESTO_MOTIVO_EMAIL } from '../../../lib/progetto/validazione';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { LegalSection } from '../../../types';

export interface FormRegistrazione {
  nome: string;
  email: string;
  corso: string;
  sede: string;
  provenienza: string;
  consensi: Consensi;
}

/** Il modulo di partenza: vuoto e con i consensi spenti, oppure i dati già salvati. */
export function formDa(p?: Profilo): FormRegistrazione {
  return {
    nome: p?.nome ?? '', email: p?.email ?? '', corso: p?.corso ?? '', sede: p?.sede ?? '', provenienza: p?.provenienza ?? '',
    consensi: p ? { ...p.consensi } : { ...CONSENSI_VUOTI },
  };
}

const CAMPO = 'w-full rounded-[12px] border border-linea bg-superficie-2 px-3.5 py-3 text-[16px] leading-[22px] text-testo placeholder:text-testo-tenue focus:outline focus:outline-2 focus:outline-azione';

function Campo({ id, etichetta, destra, errore, children }: { id: string; etichetta: string; destra?: ReactNode; errore?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-bold text-testo">{etichetta}</label>
        {destra}
      </div>
      {children}
      {errore && <p id={`${id}-errore`} role="alert" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-basso-testo">{errore}</p>}
    </div>
  );
}

/** «Chi sei»: nome ed email PoliMi. Gli errori compaiono quando l'utente lascia il campo o prova ad andare avanti (`provato`). */
export function CampiChiSei({ form, onChange, provato }: { form: FormRegistrazione; onChange: (f: FormRegistrazione) => void; provato: boolean }) {
  const id = useId();
  const [toccato, setToccato] = useState({ nome: false, email: false });
  const mostraErrori = { nome: provato || toccato.nome, email: provato || toccato.email };
  const nomeOk = form.nome.trim().length >= 2;
  const e = controllaEmailPolimi(form.email);
  const erroreEmail = 'motivo' in e ? TESTO_MOTIVO_EMAIL[e.motivo] : undefined;
  return (
    <div className="flex flex-col gap-4">
      <Campo id={`${id}-nome`} etichetta="Nome" errore={mostraErrori.nome && !nomeOk ? 'Scrivi il tuo nome.' : undefined}>
        <input id={`${id}-nome`} type="text" value={form.nome} maxLength={NOME_MAX} autoComplete="given-name" enterKeyHint="next"
          aria-invalid={mostraErrori.nome && !nomeOk} aria-describedby={mostraErrori.nome && !nomeOk ? `${id}-nome-errore` : undefined}
          onBlur={() => setToccato(t => ({ ...t, nome: true }))} onChange={ev => onChange({ ...form, nome: ev.target.value })} className={CAMPO} />
      </Campo>
      <Campo id={`${id}-email`} etichetta="Email PoliMi" errore={mostraErrori.email ? erroreEmail : undefined}
        destra={(
          <InfoFoglio titolo="Email non verificata" etichetta="Perché non verificata"
            bottone={apri => (
              <button type="button" onClick={() => { playTapSound(); apri(); }} aria-label="Perché non verificata"
                className="brand-premibile inline-flex items-center gap-1 rounded-full bg-medio-tinta px-2.5 py-1 text-[12px] font-bold text-medio-testo">
                <Icona nome="stato-attenzione" size={14} />Non verificata
              </button>
            )}>
            <p data-testo-ok>Controllo solo che l'indirizzo finisca con @polimi.it, @mail.polimi.it o un sottodominio di polimi.it. Non ti mando nessun codice, quindi non posso sapere se l'indirizzo è davvero tuo: per questo risulta «non verificata».</p>
          </InfoFoglio>
        )}>
        <input id={`${id}-email`} type="email" inputMode="email" value={form.email} maxLength={254} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="done"
          placeholder="nome.cognome@mail.polimi.it" aria-invalid={mostraErrori.email && !!erroreEmail} aria-describedby={mostraErrori.email && erroreEmail ? `${id}-email-errore` : undefined}
          onBlur={() => setToccato(t => ({ ...t, email: true }))} onChange={ev => onChange({ ...form, email: ev.target.value })} className={CAMPO} />
      </Campo>
    </div>
  );
}

/** «Il tuo corso»: corso, sede, come ci hai conosciuto. Tutto facoltativo. */
export function CampiCorso({ form, onChange }: { form: FormRegistrazione; onChange: (f: FormRegistrazione) => void }) {
  const id = useId();
  const scelta = (valore: string, attuale: string, cambia: (v: string) => void, etichetta: string) => (
    <button key={valore} type="button" role="radio" aria-checked={attuale === valore}
      onClick={() => { playTapSound(); cambia(attuale === valore ? '' : valore); }}
      className={cn('brand-premibile flex-1 rounded-[12px] border px-2 py-3 text-[15px] font-bold transition-colors duration-100',
        attuale === valore ? 'border-azione bg-azione-tinta text-azione-scuro' : 'border-linea bg-superficie-2 text-testo')}>
      {etichetta}
    </button>
  );
  return (
    <div className="flex flex-col gap-4">
      <Campo id={`${id}-corso`} etichetta="Corso di laurea">
        <select id={`${id}-corso`} value={form.corso} onChange={ev => onChange({ ...form, corso: ev.target.value })} className={CAMPO}>
          <option value="">Scegli…</option>
          {CORSI.map(c => <option key={c} value={c}>{c}</option>)}
          <option value={CORSO_ALTRO}>{CORSO_ALTRO}</option>
        </select>
      </Campo>
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-sede`} className="text-sm font-bold text-testo">Sede</span>
        <div role="radiogroup" aria-labelledby={`${id}-sede`} className="flex gap-2">
          {SEDI.map(s => scelta(s, form.sede, v => onChange({ ...form, sede: v }), s))}
        </div>
      </div>
      <Campo id={`${id}-prov`} etichetta="Come ci hai conosciuto">
        <select id={`${id}-prov`} value={form.provenienza} onChange={ev => onChange({ ...form, provenienza: ev.target.value })} className={CAMPO}>
          <option value="">Scegli…</option>
          {PROVENIENZE.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </Campo>
    </div>
  );
}

/** Una casella di consenso: spenta finché l'utente non la tocca. */
export function CasellaConsenso({ spuntata, onChange, titolo, testo }: { spuntata: boolean; onChange: (v: boolean) => void; titolo: string; testo: string }) {
  const id = useId();
  return (
    <button type="button" role="checkbox" aria-checked={spuntata} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}
      onClick={() => { playTapSound(); onChange(!spuntata); }}
      className={cn('brand-premibile flex w-full items-start gap-3 rounded-[14px] border p-3.5 text-left transition-colors duration-100',
        spuntata ? 'border-azione bg-azione-tinta' : 'border-linea bg-superficie-2')}>
      <span aria-hidden="true" className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[7px] border-2 transition-colors duration-100',
        spuntata ? 'border-azione bg-azione text-azione-su' : 'border-tacca bg-superficie text-transparent')}>
        <Icona nome="stato-ok" size={16} />
      </span>
      <span className="min-w-0">
        <span id={`${id}-t`} data-testo-ok className="block text-[15px] leading-[20px] font-bold text-testo">{titolo}</span>
        <span id={`${id}-d`} data-testo-ok className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{testo}</span>
      </span>
    </button>
  );
}

export const CONSENSI_TESTI: { chiave: keyof Consensi; titolo: string; testo: string }[] = [
  { chiave: 'noi', titolo: `Classifica ${ECOSYSTEM.rankingName}`, testo: 'Se vuoi, il tuo nome utente e i tuoi punteggi compaiono nella classifica. Puoi uscire quando vuoi.' },
  { chiave: 'atlas', titolo: `Personalizzazione ${ECOSYSTEM.engineName}`, testo: `${ECOSYSTEM.engineName} usa i dati di studio di AddiOFA per adattare ripasso e suggerimenti.` },
  { chiave: 'comunicazioni', titolo: `Messaggi da ${ECOSYSTEM.name} e ${ECOSYSTEM.agoraName}`, testo: 'Ti scriviamo all\'email che hai indicato, per novità del progetto e di Agorà.' },
];

/** I tre consensi facoltativi, più l'informativa breve. */
export function CampiConsensi({ consensi, onChange, onOpenLegal }: { consensi: Consensi; onChange: (c: Consensi) => void; onOpenLegal?: (s: LegalSection) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div role="group" aria-label="Consensi facoltativi" className="flex flex-col gap-2.5">
        {CONSENSI_TESTI.map(c => (
          <CasellaConsenso key={c.chiave} spuntata={consensi[c.chiave]} titolo={c.titolo} testo={c.testo} onChange={v => onChange({ ...consensi, [c.chiave]: v })} />
        ))}
      </div>
      <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">
        Sono tutti facoltativi: puoi continuare senza. {INFORMATIVA_BREVE}{' '}
        {onOpenLegal && (
          <button type="button" onClick={() => onOpenLegal('privacy')} className="font-bold text-azione-scuro underline underline-offset-2">Informativa completa</button>
        )}
      </p>
    </div>
  );
}

/** Informativa breve: che cosa si raccoglie, dove va, con che base. Il testo intero è in legal/privacy.ts. */
export const INFORMATIVA_BREVE =
  `Titolare: ${TITOLARE.nome}${TITOLARE.responsabile ? ` (${TITOLARE.responsabile})` : ''}. Nome, email, corso, sede e provenienza servono a creare la tua iscrizione e vengono inviati ad ${ECOSYSTEM.engineName}, il servizio di ${ECOSYSTEM.name}, appena possibile; fino ad allora restano su questo dispositivo. I consensi li usiamo solo per le tre cose indicate e li puoi cambiare o ritirare quando vuoi.${CONTACT_EMAIL ? ` Contatto: ${CONTACT_EMAIL}.` : ''}`;
