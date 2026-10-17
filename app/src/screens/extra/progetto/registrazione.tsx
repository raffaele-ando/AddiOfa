// Pezzi della registrazione, usati dal funnel (components/Onboarding.tsx) e da «Project ID»: il campo email (da cui si ricava il nome), «Cosa fai al Poli»
// (scelta a cascata, un tocco per schermata), «Come ci hai conosciuto?» e i consensi. Regole: obbligatoria solo l'email PoliMi; il nome si ricava
// dall'email e si corregge con la matita (si chiede solo se non si ricava); l'email è «non verificata» finché non c'è una verifica vera con il link;
// i tre consensi sono facoltativi e PARTONO SEMPRE SPENTI. Le frasi dei consensi e dell'informativa sono testo legale (data-testo-ok).
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { InfoFoglio } from '../../landing/comune';
import { ChoiceCard } from '../../../components/ui';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { PROVENIENZE } from '../../../lib/progetto/corsi';
import { INFORMATIVA_BREVE } from '../../../lib/progetto/informativa';
import { nomeDaEmail } from '../../../lib/progetto/nomeDaEmail';
import {
  briciole, CORSI_PER_RICERCA, esitoPercorso, filtraCorsi, risolvi, scegli, torna,
  type EsitoPercorso, type FonteCorsi, type PassoPercorso, type ScelteCorso,
} from '../../../lib/progetto/percorso';
import { DATI_DI_PROVA, fonteCorsi } from '../../../lib/progetto/percorsoDati';
import { CONSENSI_VUOTI, type Consensi, type Profilo } from '../../../lib/progetto/profilo';
import { controllaEmailPolimi, NOME_MAX, pulisciNome, TESTO_MOTIVO_EMAIL } from '../../../lib/progetto/validazione';
import type { EsitoInvioLink } from '../../../lib/firebase';
import { verificaDisponibile } from '../../../lib/firebase';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { LegalSection } from '../../../types';

export interface FormRegistrazione {
  email: string;
  /** Quello che l'utente ha scritto o corretto; vuoto = si usa il nome ricavato dall'email. */
  nome: string;
  percorso: ScelteCorso;
  provenienza: string;
  consensi: Consensi;
}

/** Il modulo di partenza: vuoto e con i consensi spenti, oppure i dati già salvati. */
export function formDa(p?: Profilo): FormRegistrazione {
  return {
    email: p?.email ?? '',
    // il nome salvato si tiene come «corretto a mano» solo se differisce da quello ricavabile dall'email
    nome: p && p.nome !== nomeDaEmail(p.email)?.nome ? p.nome : '',
    percorso: {
      ...(p?.scuola ? { scuola: p.scuola } : {}), ...(p?.sede ? { sede: p.sede } : {}), ...(p?.livello ? { livello: p.livello } : {}),
      ...(p?.corsoId ? { corso: p.corsoId } : {}), ...(p?.anno ? { anno: p.anno } : {}),
    },
    provenienza: p?.provenienza ?? '',
    consensi: p ? { ...p.consensi } : { ...CONSENSI_VUOTI },
  };
}

/** Il nome che finirà nel profilo: quello scritto, altrimenti quello ricavato dall'email, altrimenti nessuno. */
export function nomeEffettivo(form: Pick<FormRegistrazione, 'email' | 'nome'>): string | null {
  const e = controllaEmailPolimi(form.email);
  return pulisciNome(form.nome) ?? (e.ok ? nomeDaEmail(e.email)?.nome ?? null : null);
}

/** I campi del percorso da salvare nel profilo: completi se la cascata è finita, altrimenti solo quelli già scelti. */
export function campiPercorso(s: ScelteCorso, fonte: FonteCorsi = fonteCorsi): { scuola?: string; sede?: string; livello?: string; corso?: string; corsoId?: string; anno?: number } {
  const e = esitoPercorso(s, fonte);
  if (e) return { scuola: e.scuola, sede: e.sede, livello: e.livello, corso: e.corso, corsoId: e.corsoId, anno: e.anno };
  const r = risolvi(s, fonte).scelte;
  return { scuola: r.scuola, sede: r.sede, livello: r.livello };
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

// ---------------------------------------------------------------------------------------------------------------------------------
// Email e nome

/**
 * «La tua email»: un solo campo. Scritta un'email PoliMi valida, il nome si ricava («Ciao Mario Rossi») con la matita per correggerlo;
 * se non si ricava (matricola, una sola parola) compare «Come ti chiami?». Con Firebase configurato c'è «Verifica con un link» (non blocca: si prosegue).
 */
export function CampoEmail({ form, onChange, provato, verificata, onInviaVerifica }: {
  form: FormRegistrazione; onChange: (f: FormRegistrazione) => void; provato: boolean;
  /** L'email del profilo è già stata verificata con un link. */
  verificata?: boolean;
  /** Salva i dati e chiede il link; senza questa funzione (o senza Firebase) il pulsante non compare. */
  onInviaVerifica?: () => Promise<EsitoInvioLink>;
}) {
  const id = useId();
  const [toccato, setToccato] = useState(false);
  const [correggi, setCorreggi] = useState(false);
  const [verifica, setVerifica] = useState<{ fase: 'quiete' | 'invio' | 'inviato' | 'errore'; messaggio?: string }>({ fase: 'quiete' });
  const e = controllaEmailPolimi(form.email);
  const derivato = e.ok ? nomeDaEmail(e.email) : null;
  const erroreEmail = (provato || toccato) && 'motivo' in e ? TESTO_MOTIVO_EMAIL[e.motivo] : undefined;
  const chiediNome = e.ok && (!derivato || correggi);
  const erroreNome = provato && e.ok && !nomeEffettivo(form) ? 'Scrivi il tuo nome.' : undefined;
  const puoVerificare = e.ok && !verificata && !!onInviaVerifica && verificaDisponibile();

  // se l'email cambia dopo aver chiesto il link, il link chiesto non vale più per questo indirizzo
  useEffect(() => { setVerifica({ fase: 'quiete' }); }, [form.email]);

  const invia = async () => {
    if (!onInviaVerifica) return;
    setVerifica({ fase: 'invio' });
    const r = await onInviaVerifica();
    setVerifica('messaggio' in r ? { fase: 'errore', messaggio: r.messaggio } : { fase: 'inviato' });
  };

  return (
    <div className="flex flex-col gap-3.5">
      <Campo id={`${id}-email`} etichetta="Email PoliMi" errore={erroreEmail}
        destra={verificata ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-alto-tinta px-2.5 py-1 text-[12px] font-bold text-alto-testo"><Icona nome="stato-ok" size={14} />Verificata</span>
        ) : (
          <InfoFoglio titolo="Email non verificata" etichetta="Perché non verificata"
            bottone={apri => (
              <button type="button" onClick={() => { playTapSound(); apri(); }} aria-label="Perché non verificata"
                className="brand-premibile inline-flex items-center gap-1 rounded-full bg-medio-tinta px-2.5 py-1 text-[12px] font-bold text-medio-testo">
                <Icona nome="stato-attenzione" size={14} />Non verificata
              </button>
            )}>
            <p data-testo-ok>Controllo che l&apos;indirizzo finisca con @polimi.it, @mail.polimi.it o un sottodominio di polimi.it. Questo non prova che sia tuo.</p>
            <p data-testo-ok className="mt-2">{verificaDisponibile()
              ? 'Puoi provarlo con «Verifica con un link»: ti scrivo un link da aprire. Finché non l\'apri, l\'indirizzo resta «non verificata».'
              : 'In questa versione non c\'è l\'invio del link di verifica, quindi l\'indirizzo resta «non verificata».'}</p>
          </InfoFoglio>
        )}>
        <input id={`${id}-email`} type="email" inputMode="email" value={form.email} maxLength={254} autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="done"
          placeholder="nome.cognome@mail.polimi.it" aria-invalid={!!erroreEmail} aria-describedby={erroreEmail ? `${id}-email-errore` : undefined}
          onBlur={() => setToccato(true)} onChange={ev => onChange({ ...form, email: ev.target.value })} className={CAMPO} />
      </Campo>

      {e.ok && derivato && !correggi && (
        <div className="flex items-center justify-between gap-3 rounded-[14px] bg-superficie-2 px-3.5 py-3" role="status">
          <span className="min-w-0 text-[17px] leading-[24px] font-bold text-testo">Ciao <span className="break-words">{nomeEffettivo(form)}</span></span>
          <button type="button" onClick={() => { playTapSound(); setCorreggi(true); }} aria-label="Correggi il nome"
            className="brand-premibile grid h-9 w-9 shrink-0 place-items-center rounded-full bg-superficie text-testo-tenue hover:text-testo"><Icona nome="modifica" size={18} /></button>
        </div>
      )}

      {chiediNome && (
        <Campo id={`${id}-nome`} etichetta={derivato ? 'Il tuo nome' : 'Come ti chiami?'} errore={erroreNome}
          destra={correggi && derivato ? (
            <button type="button" onClick={() => { playTapSound(); setCorreggi(false); }} className="text-[13px] font-bold text-azione-scuro underline underline-offset-2">Fatto</button>
          ) : undefined}>
          <input id={`${id}-nome`} type="text" value={form.nome} maxLength={NOME_MAX} autoComplete="name" enterKeyHint="done" autoFocus={correggi}
            placeholder={derivato?.nome ?? ''} aria-invalid={!!erroreNome} aria-describedby={erroreNome ? `${id}-nome-errore` : undefined}
            onChange={ev => onChange({ ...form, nome: ev.target.value })} className={CAMPO} />
        </Campo>
      )}

      {puoVerificare && (
        <div className="flex flex-col gap-2">
          <button type="button" disabled={verifica.fase === 'invio'} onClick={() => { playTapSound(); void invia(); }}
            className="brand-premibile flex w-full items-center justify-center gap-2 rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo disabled:opacity-50">
            <Icona nome="email" size={18} className="text-azione-scuro" />{verifica.fase === 'invio' ? 'Invio…' : 'Verifica con un link'}
          </button>
          {verifica.fase === 'inviato' && <p role="status" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-alto-testo">Link inviato. Aprilo dalla posta quando vuoi: intanto puoi continuare.</p>}
          {verifica.fase === 'errore' && <p role="alert" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-basso-testo">{verifica.messaggio}</p>}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Cosa fai al Poli

/** Un'illustrazione per scuola dal kit blu (non ce n'è una per ciascuna: le sfere più vicine al tema, vedi la nota di consegna). */
const ARTE_SCUOLA: Record<string, string> = { 'ing-ind-inf': 'sfera-app', icat: 'sfera-opportunita', auic: 'sfera-polimi', design: 'sfera-tips' };

const TITOLO_PASSO: Record<PassoPercorso, string> = { scuola: 'La tua scuola', sede: 'La sede', livello: 'Il livello', corso: 'Il tuo corso', anno: 'Che anno?' };

/**
 * «Cosa fai al Poli»: scuola → sede → livello → corso → anno, una scelta per schermata, il tocco avanza da solo. In alto le scelte già fatte come briciole:
 * toccandone una si torna a quel passo. I passi con una sola scelta si saltano (la briciola resta, ferma). Quando il percorso è completo chiama `onFine`.
 * Se arriva già completo (si è tornati indietro o si modifica) mostra il riepilogo e il pulsante `fine`.
 */
export function PassoPercorso({ scelte, onChange, onFine, fonte = fonteCorsi, fine }: {
  scelte: ScelteCorso; onChange: (s: ScelteCorso) => void; onFine: (esito: EsitoPercorso) => void; fonte?: FonteCorsi;
  /** Pulsante da mostrare quando il percorso è completo (di solito «Avanti»). */
  fine?: ReactNode;
}) {
  const stato = useMemo(() => risolvi(scelte, fonte), [scelte, fonte]);
  const [ricerca, setRicerca] = useState('');
  const crumbs = briciole(stato.scelte, stato.automatici, fonte);

  const scelto = (passo: PassoPercorso, idOpzione: string) => {
    playTapSound();
    const nuove = risolvi(scegli(stato.scelte, passo, idOpzione), fonte);
    setRicerca('');
    onChange(nuove.scelte);
    if (nuove.passo === null) {
      const e = esitoPercorso(nuove.scelte, fonte);
      if (e) onFine(e);
    }
  };

  const opzioni = stato.opzioni;
  const corsi = stato.passo === 'corso' ? filtraCorsi(opzioni, ricerca) : opzioni;
  const conRicerca = stato.passo === 'corso' && opzioni.length - 1 > CORSI_PER_RICERCA; // «Altro» non conta

  return (
    <div className="flex flex-col gap-4">
      {crumbs.length > 0 && (
        <nav aria-label="Scelte fatte" className="flex flex-wrap gap-1.5">
          {crumbs.map(c => c.automatica ? (
            <span key={c.passo} className="inline-flex max-w-full items-center rounded-full bg-superficie-2 px-3 py-1.5 text-[13px] font-bold text-testo-tenue"><span className="truncate">{c.nome}</span></span>
          ) : (
            <button key={c.passo} type="button" onClick={() => { playTapSound(); onChange(torna(stato.scelte, c.passo)); setRicerca(''); }} aria-label={`Cambia: ${c.nome}`}
              className="brand-premibile inline-flex max-w-full items-center gap-1.5 rounded-full bg-azione-tinta px-3 py-1.5 text-[13px] font-bold text-azione-scuro">
              <span className="truncate">{c.nome}</span><Icona nome="modifica" size={13} className="shrink-0" />
            </button>
          ))}
        </nav>
      )}

      {stato.passo === null ? (
        <div className="flex flex-col gap-3">
          <p role="status" data-testo-ok className="text-[15px] font-bold text-testo">Percorso scelto</p>
          {fine}
        </div>
      ) : (
        <>
          <h2 data-testo-ok className="text-2xl sm:text-3xl font-bold text-testo">{TITOLO_PASSO[stato.passo]}</h2>
          {import.meta.env.DEV && DATI_DI_PROVA && <p className="text-[11px] font-bold text-basso-testo">DATI DI PROVA</p>}
          {conRicerca && (
            <div className="flex items-center gap-2 rounded-[12px] bg-superficie-2 px-3.5 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
              <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
              <input type="search" value={ricerca} onChange={ev => setRicerca(ev.target.value)} placeholder="Cerca" aria-label="Cerca il corso" autoComplete="off" maxLength={60}
                className="w-full bg-transparent py-3 text-[16px] text-testo placeholder:text-testo-tenue focus:outline-none" />
            </div>
          )}

          {stato.passo === 'scuola' && (
            <div className="grid grid-cols-2 gap-3">
              {opzioni.map(o => (
                <button key={o.id} type="button" onClick={() => scelto('scuola', o.id)}
                  className="brand-premibile flex min-h-[148px] flex-col items-center justify-center gap-2 rounded-[18px] border border-linea bg-superficie-2 p-3 text-center">
                  {ARTE_SCUOLA[o.id] && <Illustrazione nome={ARTE_SCUOLA[o.id]} lato={64} />}
                  <span data-testo-ok className="text-[14px] leading-[18px] font-bold text-testo">{o.nome}</span>
                </button>
              ))}
            </div>
          )}

          {stato.passo === 'anno' && (
            <div className="grid grid-cols-3 gap-3">
              {opzioni.map(o => (
                <button key={o.id} type="button" onClick={() => scelto('anno', o.id)} aria-label={`${o.nome}° anno`}
                  className="brand-premibile grid min-h-[84px] place-items-center rounded-[18px] border border-linea bg-superficie-2 text-[30px] font-extrabold tabular-nums text-testo">{o.nome}°</button>
              ))}
            </div>
          )}

          {(stato.passo === 'sede' || stato.passo === 'livello' || stato.passo === 'corso') && (
            <ul className="flex flex-col gap-2.5">
              {corsi.map(o => (
                <li key={o.id}>
                  <button type="button" onClick={() => scelto(stato.passo!, o.id)}
                    className="brand-premibile flex w-full items-center justify-between gap-3 rounded-[14px] border border-linea bg-superficie-2 px-4 py-3.5 text-left">
                    <span data-testo-ok className="min-w-0 text-[15.5px] leading-[21px] font-bold text-testo">{o.nome}</span>
                    <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />
                  </button>
                </li>
              ))}
              {corsi.length === 0 && <li role="status" data-testo-ok className="px-1 py-3 text-[14px] font-bold text-testo-tenue">Nessun corso con queste parole</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Come ci hai conosciuto

/** La domanda «Come ci hai conosciuto?»: stessa grafica di una domanda del test con quattro scelte; non conta nel punteggio. */
export function ScelteProvenienza({ valore, onChange }: { valore: string; onChange: (id: string) => void }) {
  return (
    <div data-testo-ok className="flex flex-col gap-2.5">
      {PROVENIENZE.map(p => <ChoiceCard key={p.id} selected={valore === p.id} onClick={() => onChange(p.id)} title={p.nome} />)}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Consensi

/** Una casella di consenso: spenta finché l'utente non la tocca. */
export function CasellaConsenso({ spuntata, onChange, titolo, testo }: { spuntata: boolean; onChange: (v: boolean) => void; titolo: string; testo: string }) {
  const id = useId();
  return (
    <button type="button" role="checkbox" aria-checked={spuntata} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}
      onClick={() => { playTapSound(); onChange(!spuntata); }}
      className={cn('brand-premibile flex w-full items-start gap-3 rounded-[14px] border p-3.5 text-left transition-colors duration-100',
        spuntata ? 'border-azione bg-azione-tinta' : 'border-linea bg-superficie-2')}>
      <span aria-hidden="true" className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-100',
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
