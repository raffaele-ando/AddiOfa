// Pezzi della registrazione, usati dal funnel (components/Onboarding.tsx) e da «Project ID»: il campo email (da cui si ricava il nome), il corso
// («Che corso frequenti?» nel funnel: scuola, sede e livello si ricavano dal corso; la cascata completa resta in `PassoPercorso`, che serve a Project ID),
// «Come ci hai conosciuto?» e i consensi. Regole: obbligatoria solo l'email PoliMi; il nome si ricava dall'email e si corregge con la matita
// (si chiede solo se non si ricava); l'email è «da verificare» finché non c'è una verifica vera con il link (il distintivo compare solo dopo
// aver scritto un indirizzo valido); i tre consensi sono facoltativi, sono VERE CASELLE e PARTONO SEMPRE SPENTE. Le frasi dei consensi e
// dell'informativa sono testo legale (data-testo-ok).
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { InfoFoglio } from '../../landing/comune';
import { ChoiceCard, Segmenti } from '../../../components/ui';
import { anniDelLivello, corsoScelto, elencoCorsi, livelliPresenti, NOME_LIVELLO_ELENCO, type VoceCorso } from '../../../components/funnel-logica';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { PROVENIENZE } from '../../../lib/progetto/corsi';
import { INFORMATIVA_BREVE } from '../../../lib/progetto/informativa';
import { nomeDaEmail } from '../../../lib/progetto/nomeDaEmail';
import {
  briciole, CORSI_PER_RICERCA, CORSO_ALTRO_ID, CORSO_ALTRO_NOME, esitoPercorso, filtraCorsi, opzioniPasso, risolvi, scegli, torna,
  type EsitoPercorso, type FonteCorsi, type LivelloId, type PassoPercorso, type ScelteCorso,
} from '../../../lib/progetto/percorso';
import { fonteCorsi } from '../../../lib/progetto/percorsoDati';
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
  // «Non trovo il mio corso»: il corso è «Altro», senza scuola né sede (non si ricavano); livello e anno si salvano lo stesso
  if (s.corso === CORSO_ALTRO_ID && s.anno) return { ...(s.scuola ? { scuola: s.scuola } : {}), ...(s.sede ? { sede: s.sede } : {}), ...(s.livello ? { livello: s.livello } : {}), corso: CORSO_ALTRO_NOME, corsoId: CORSO_ALTRO_ID, anno: s.anno };
  const r = risolvi(s, fonte).scelte;
  return { scuola: r.scuola, sede: r.sede, livello: r.livello };
}

const CAMPO = 'w-full min-h-[52px] rounded-2xl border border-bordo-campo bg-superficie-2 px-4 py-3 text-[17px] leading-[24px] text-testo placeholder:text-testo-tenue focus:outline focus:outline-2 focus:outline-azione';

function Campo({ id, etichetta, destra, errore, children }: { id: string; etichetta: string; destra?: ReactNode; errore?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-[15px] leading-[20px] font-semibold text-testo">{etichetta}</label>
        {destra}
      </div>
      {children}
      {errore && <p id={`${id}-errore`} role="alert" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-errore-testo">{errore}</p>}
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
        destra={!e.ok ? undefined : verificata ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-alto-tinta px-2.5 py-1 text-[13px] leading-[18px] font-semibold text-alto-testo"><Icona nome="stato-ok" size={14} />Verificata</span>
        ) : (
          // «Da verificare» solo dopo aver scritto un indirizzo valido (mai a campo vuoto), in tono neutro: non è un rimprovero
          <InfoFoglio titolo="Email da verificare" etichetta="Perché da verificare"
            bottone={apri => (
              <button type="button" onClick={() => { playTapSound(); apri(); }} aria-label="Perché da verificare"
                className="brand-premibile inline-flex items-center gap-1 rounded-full bg-superficie-2 px-2.5 py-1 text-[13px] leading-[18px] font-semibold text-testo-tenue">
                <Icona nome="info" size={14} />Da verificare
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
        {!e.ok && !erroreEmail && <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">Ricaviamo il tuo nome da qui.</p>}
      </Campo>

      {e.ok && derivato && !correggi && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-superficie-2 pl-4 pr-1.5 py-1.5 min-h-14" role="status">
          <span className="min-w-0 text-[17px] leading-[24px] font-semibold text-testo">Ciao <span className="break-words">{nomeEffettivo(form)}</span></span>
          <button type="button" onClick={() => { playTapSound(); setCorreggi(true); }} aria-label="Correggi il nome"
            className="brand-premibile grid h-11 w-11 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo"><Icona nome="modifica" size={20} /></button>
        </div>
      )}

      {chiediNome && (
        <Campo id={`${id}-nome`} etichetta={derivato ? 'Il tuo nome' : 'Come ti chiami?'} errore={erroreNome}
          destra={correggi && derivato ? (
            <button type="button" onClick={() => { playTapSound(); setCorreggi(false); }} className="text-[14px] font-semibold text-azione-testo underline underline-offset-2">Fatto</button>
          ) : undefined}>
          <input id={`${id}-nome`} type="text" value={form.nome} maxLength={NOME_MAX} autoComplete="name" enterKeyHint="done" autoFocus={correggi}
            placeholder={derivato?.nome ?? ''} aria-invalid={!!erroreNome} aria-describedby={erroreNome ? `${id}-nome-errore` : undefined}
            onChange={ev => onChange({ ...form, nome: ev.target.value })} className={CAMPO} />
        </Campo>
      )}

      {puoVerificare && (
        <div className="flex flex-col gap-2">
          <button type="button" disabled={verifica.fase === 'invio'} onClick={() => { playTapSound(); void invia(); }}
            className="brand-premibile flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl border border-bordo-campo px-4 py-3 text-[15px] font-semibold text-testo disabled:opacity-50">
            <Icona nome="email" size={18} className="text-azione-testo" />{verifica.fase === 'invio' ? 'Invio…' : 'Verifica con un link'}
          </button>
          {verifica.fase === 'inviato' && <p role="status" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-alto-testo">Link inviato. Aprilo dalla posta quando vuoi: intanto puoi continuare.</p>}
          {verifica.fase === 'errore' && <p role="alert" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-errore-testo">{verifica.messaggio}</p>}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Il corso: «Che corso frequenti?» (funnel)

/**
 * La schermata «Lista» del funnel: livello (Triennale · Ciclo unico · Magistrale) in alto, la ricerca, poi i corsi di tutte le scuole, uno per sede,
 * con la sede sotto il nome. Toccare un corso lo sceglie e porta avanti: scuola, sede e livello si ricavano dal corso e l'anno è quello delle pillole
 * (che stanno nel piè di pagina, vicino al pollice, e partono dal 1°: non è un consenso). In fondo «Non trovo il mio corso». Controllata da fuori:
 * il livello e l'anno stanno in chi la usa, perché le pillole dell'anno sono nel piè di pagina e dipendono dal livello.
 */
export function ElencoCorsi({ fonte = fonteCorsi, scelte, livello, onLivello, anno, onScelto, onAltro }: {
  fonte?: FonteCorsi; scelte: ScelteCorso; livello: LivelloId; onLivello: (l: LivelloId) => void; anno: number;
  onScelto: (s: ScelteCorso, v: VoceCorso) => void; onAltro: () => void;
}) {
  const voci = useMemo(() => elencoCorsi(fonte), [fonte]);
  const livelli = useMemo(() => livelliPresenti(voci), [voci]);
  const [ricerca, setRicerca] = useState('');
  const cerca = ricerca.trim().length > 0;
  const scelto = corsoScelto(voci, scelte);
  const visibili = cerca ? filtraCorsi(voci, ricerca) : voci.filter(v => v.livello === livello);
  // sfumatura in fondo solo se c'è altro da scorrere
  const lista = useRef<HTMLUListElement>(null);
  const [piuSotto, setPiuSotto] = useState(false);
  const misura = () => { const el = lista.current; if (el) setPiuSotto(el.scrollHeight - el.scrollTop - el.clientHeight > 8); };
  useEffect(() => { misura(); }, [visibili.length, livello, ricerca]);
  const tocca = (v: VoceCorso) => { playTapSound(); onScelto({ scuola: v.scuola, sede: v.sede, livello: v.livello, corso: v.id, anno: Math.max(1, Math.min(v.anni, anno)) }, v); };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {livelli.length > 1 && !cerca && (
        <Segmenti compatto etichetta="Livello" voci={livelli.map(l => ({ id: l, nome: NOME_LIVELLO_ELENCO[l] }))} valore={livello} onChange={onLivello} />
      )}
      <div className="flex items-center gap-2 rounded-2xl border border-bordo-campo bg-superficie-2 px-4 min-h-12 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
        <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
        <input type="search" value={ricerca} onChange={ev => setRicerca(ev.target.value)} placeholder="Cerca il tuo corso" aria-label="Cerca il tuo corso" autoComplete="off" maxLength={60}
          className="w-full bg-transparent py-3 text-[17px] text-testo placeholder:text-testo-tenue focus:outline-none" />
      </div>
      <div className="relative flex min-h-[168px] flex-1 flex-col">
        <ul ref={lista} onScroll={misura} className="absolute inset-0 flex flex-col gap-2 overflow-y-auto scrollbar-hide pb-1">
          {visibili.map(v => (
            <li key={v.chiave}>
              <ChoiceCard avanza selected={scelto?.chiave === v.chiave} onClick={() => tocca(v)} title={v.nome} subtitle={cerca ? `${NOME_LIVELLO_ELENCO[v.livello]} · ${v.sedeNome}` : v.sedeNome} />
            </li>
          ))}
          {visibili.length === 0 && <li role="status" data-testo-ok className="px-1 py-2 text-[15px] leading-[22px] text-testo-tenue">Nessun corso con queste parole.</li>}
          <li><ChoiceCard avanza selected={scelte.corso === CORSO_ALTRO_ID} onClick={onAltro} title="Non trovo il mio corso" subtitle="Puoi continuare lo stesso" /></li>
        </ul>
        {piuSotto && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-superficie to-transparent" />}
      </div>
    </div>
  );
}

/** Le pillole dell'anno per un livello (1°, 2°, 3°…): il numero dipende dal livello. */
export function PilloleAnno({ voci, livello, anno, onChange }: { voci?: VoceCorso[]; livello: LivelloId; anno: number; onChange: (a: number) => void }) {
  const tutte = useMemo(() => voci ?? elencoCorsi(fonteCorsi), [voci]);
  const n = anniDelLivello(tutte, livello);
  return <Segmenti compatto etichetta="Anno di corso" voci={Array.from({ length: n }, (_, i) => ({ id: i + 1, nome: `${i + 1}°` }))} valore={anno} onChange={onChange} />;
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Cosa fai al Poli (cascata completa: serve a Project ID, dove si modifica il percorso)

const TITOLO_PASSO: Record<PassoPercorso, string> = { scuola: 'Che scuola frequenti?', sede: 'Dove segui le lezioni?', livello: 'Che livello?', corso: 'Che corso frequenti?', anno: 'In che anno sei?' };

/**
 * Cascata completa: scuola → sede → livello → corso → anno, una scelta per volta, il tocco avanza da solo. In alto le scelte già fatte come
 * pulsanti con il nome intero (non la sigla): toccandone una si torna a quel passo. I passi con una sola scelta si saltano (la scelta resta, ferma).
 * Quando il percorso è completo chiama `onFine`. Se arriva già completo (si è tornati indietro o si modifica) mostra `fine`.
 * Il funnel di ingresso non la usa più: ha `ElencoCorsi` (una sola schermata); resta qui per la pagina «Modifica» di Project ID.
 */
export function PassoPercorso({ scelte, onChange, onFine, fonte = fonteCorsi, fine, unPasso }: {
  scelte: ScelteCorso; onChange: (s: ScelteCorso) => void; onFine: (esito: EsitoPercorso) => void; fonte?: FonteCorsi;
  /** Un passo per schermata, tra una domanda del test e l'altra: dopo ogni scelta chiama questo invece di mostrare il passo successivo. */
  unPasso?: () => void;
  /** Pulsante da mostrare quando il percorso è completo (di solito «Avanti»). */
  fine?: ReactNode;
}) {
  const stato = useMemo(() => risolvi(scelte, fonte), [scelte, fonte]);
  const [ricerca, setRicerca] = useState('');
  const crumbs = briciole(stato.scelte, stato.automatici, fonte);
  const nomeIntero = (passo: PassoPercorso, id: string) => passo === 'anno' ? `${id}° anno` : opzioniPasso(passo, stato.scelte, fonte).find(o => o.id === id)?.nome ?? id;

  const scelto = (passo: PassoPercorso, idOpzione: string) => {
    playTapSound();
    const nuove = risolvi(scegli(stato.scelte, passo, idOpzione), fonte);
    setRicerca('');
    onChange(nuove.scelte);
    if (unPasso) { unPasso(); return; }
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
        <nav aria-label="Scelte fatte" className="flex flex-wrap gap-2">
          {crumbs.map(c => c.automatica ? (
            <span key={c.passo} className="inline-flex max-w-full items-center rounded-full bg-superficie-2 px-3 py-1.5 text-[14px] leading-[20px] font-medium text-testo-tenue"><span className="truncate">{nomeIntero(c.passo, c.id)}</span></span>
          ) : (
            <button key={c.passo} type="button" onClick={() => { playTapSound(); onChange(torna(stato.scelte, c.passo)); setRicerca(''); }} aria-label={`Cambia: ${nomeIntero(c.passo, c.id)}`}
              className="brand-premibile inline-flex max-w-full items-center rounded-full bg-azione-tinta px-3 py-1.5 text-[14px] leading-[20px] font-semibold text-azione-testo">
              <span className="truncate">{nomeIntero(c.passo, c.id)}</span>
            </button>
          ))}
        </nav>
      )}

      {stato.passo === null ? (
        <div className="flex flex-col gap-3">
          <p role="status" data-testo-ok className="text-[16px] leading-[22px] font-semibold text-testo">Percorso scelto</p>
          {fine}
        </div>
      ) : (
        <>
          <h3 data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">{TITOLO_PASSO[stato.passo]}</h3>
          {conRicerca && (
            <div className="flex items-center gap-2 rounded-2xl border border-bordo-campo bg-superficie-2 px-4 min-h-12 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
              <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
              <input type="search" value={ricerca} onChange={ev => setRicerca(ev.target.value)} placeholder="Cerca il tuo corso" aria-label="Cerca il corso" autoComplete="off" maxLength={60}
                className="w-full bg-transparent py-3 text-[17px] text-testo placeholder:text-testo-tenue focus:outline-none" />
            </div>
          )}

          {stato.passo === 'anno' ? (
            <Segmenti etichetta="Anno di corso" voci={opzioni.map(o => ({ id: o.id, nome: `${o.nome}°` }))} valore={null} onChange={id => scelto('anno', id)} />
          ) : (
            <ul className="flex flex-col gap-2">
              {corsi.map(o => (
                <li key={o.id}>
                  <ChoiceCard avanza selected={false} onClick={() => scelto(stato.passo!, o.id)} title={o.nome} subtitle={stato.passo === 'scuola' && o.sigla ? o.sigla : undefined} />
                </li>
              ))}
              {corsi.length === 0 && <li role="status" data-testo-ok className="px-1 py-2 text-[15px] leading-[22px] text-testo-tenue">Nessun corso con queste parole.</li>}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Come ci hai conosciuto

/** La domanda «Come ci hai conosciuto?»: stessa riga di una domanda del test; non conta nel punteggio. */
export function ScelteProvenienza({ valore, onChange }: { valore: string; onChange: (id: string) => void }) {
  return (
    <div data-testo-ok className="flex flex-col gap-3">
      {PROVENIENZE.map(p => <ChoiceCard key={p.id} selected={valore === p.id} onClick={() => onChange(p.id)} title={p.nome} />)}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// Consensi

/** Una casella di consenso: una vera casella quadrata (le scelte sono indipendenti), spenta finché l'utente non la tocca. */
export function CasellaConsenso({ spuntata, onChange, titolo, testo }: { spuntata: boolean; onChange: (v: boolean) => void; titolo: string; testo: string }) {
  const id = useId();
  return (
    <button type="button" role="checkbox" aria-checked={spuntata} aria-labelledby={`${id}-t`} aria-describedby={`${id}-d`}
      onClick={() => { playTapSound(); onChange(!spuntata); }}
      className={cn('brand-premibile flex w-full min-h-16 items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors duration-100',
        spuntata ? 'border-azione ring-1 ring-azione bg-azione-tinta' : 'border-tacca bg-superficie-2')}>
      <span aria-hidden="true" className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors duration-100',
        spuntata ? 'border-azione bg-azione text-azione-su' : 'border-bordo-campo bg-superficie')}>
        {spuntata && (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4 6.6 11.6 12.8 4.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        )}
      </span>
      <span className="min-w-0">
        <span id={`${id}-t`} data-testo-ok className="block text-[17px] leading-[24px] font-semibold text-testo">{titolo}</span>
        <span id={`${id}-d`} data-testo-ok className="mt-0.5 block text-[14px] leading-[20px] text-testo-tenue">{testo}</span>
      </span>
    </button>
  );
}

export const CONSENSI_TESTI: { chiave: keyof Consensi; titolo: string; testo: string }[] = [
  { chiave: 'noi', titolo: `Classifica ${ECOSYSTEM.rankingName}`, testo: 'Il tuo nome utente e i tuoi punteggi compaiono nella classifica. Puoi uscire quando vuoi.' },
  { chiave: 'atlas', titolo: `Personalizzazione ${ECOSYSTEM.engineName}`, testo: `${ECOSYSTEM.engineName}, il servizio di ${ECOSYSTEM.name}, usa i tuoi risultati per decidere cosa farti ripassare per primo.` },
  { chiave: 'comunicazioni', titolo: `Messaggi da ${ECOSYSTEM.name} e ${ECOSYSTEM.agoraName}`, testo: 'Ti scriviamo all\'email che hai indicato, solo per novità del progetto.' },
];

/**
 * I tre consensi facoltativi (caselle, tutte spente) e, sotto, due righe di informativa con «Informativa completa» in un foglio.
 * `senzaIntro`: il titolo della schermata dice già che sono facoltativi (funnel); altrimenti la riga è qui (Project ID).
 */
export function CampiConsensi({ consensi, onChange, onOpenLegal, senzaIntro }: { consensi: Consensi; onChange: (c: Consensi) => void; onOpenLegal?: (s: LegalSection) => void; senzaIntro?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {!senzaIntro && <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Sono tutti facoltativi: puoi continuare senza.</p>}
      <div role="group" aria-label="Consensi facoltativi" className="flex flex-col gap-3">
        {CONSENSI_TESTI.map(c => (
          <CasellaConsenso key={c.chiave} spuntata={consensi[c.chiave]} titolo={c.titolo} testo={c.testo} onChange={v => onChange({ ...consensi, [c.chiave]: v })} />
        ))}
      </div>
      <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">
        Nome, email, corso e provenienza servono a creare la tua iscrizione.{' '}
        <InfoFoglio titolo="Come usiamo i tuoi dati" etichetta="Informativa breve"
          bottone={apri => (
            <button type="button" onClick={() => { playTapSound(); apri(); }} className="font-semibold text-azione-testo underline underline-offset-2">Come li usiamo</button>
          )}>
          <p data-testo-ok>{INFORMATIVA_BREVE}</p>
          {onOpenLegal && (
            <button type="button" onClick={() => onOpenLegal('privacy')} className="mt-3 font-semibold text-azione-testo underline underline-offset-2">Informativa completa</button>
          )}
        </InfoFoglio>
      </p>
    </div>
  );
}
