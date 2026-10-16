// Il contenuto del Pass: stato, scadenza, pulsante per scoprirlo o provarlo, inviti (codice e condivisione), accesso sbloccato.
// Lo usano la schermata `pass` (extra) e la vista `invites` di App (screens/Invites.tsx), così il punto di accesso è uno solo.
import { useEffect, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useAccess } from '../../../access/context';
import type { InviteProgress } from '../../../access/provider';
import { useToast } from '../../../components/Toast';
import { INVITE, PASS } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { FoglioInfo, IconaTono, PulsanteInfo, TONI, type Tono } from '../ui';
import { Disegno } from '../servizi/componenti';

/** Vero se il Pass è attivo grazie agli inviti (il server lo concede a chi ha abbastanza compagni verificati). */
export function sbloccatoConInviti(e: { tier: string; source: string; expiresAt: number | null }, ora: number = Date.now()): boolean {
  return e.tier === 'pass' && e.source === 'invite' && (e.expiresAt === null || e.expiresAt > ora);
}

const dataBreve = (ms: number) => new Date(ms).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });

export interface PropsCorpoPass {
  /** Apre la condivisione del codice: la schermata `condividi` (o, fuori dalle schermate extra, il foglio). */
  onCondividi: (p: { testo: string; url: string; titolo: string }) => void;
  /** «Studia» dopo l'accesso sbloccato. */
  onInizia: () => void;
  /** Scopri il Pass (paywall). */
  onScopri: () => void;
}

/** Indirizzo dell'app da condividere: l'origine della pagina, senza parametri. */
function indirizzoApp(): string {
  try { return `${window.location.origin}${window.location.pathname}`; } catch { return ''; }
}

export default function CorpoPass({ onCondividi, onInizia, onScopri }: PropsCorpoPass) {
  const { provider, entitlement, pass, refresh, unlockDemo } = useAccess();
  const toast = useToast();
  const demo = provider.mode === 'demo';
  const [codice, setCodice] = useState<string | null>(null);
  const [avanzamento, setAvanzamento] = useState<InviteProgress | null>(null);
  const [errore, setErrore] = useState(false);
  const [copiato, setCopiato] = useState(false);
  const [inserito, setInserito] = useState('');
  const [esito, setEsito] = useState<{ ok: boolean; message: string } | null>(null);
  const [invio, setInvio] = useState(false);
  const [info, setInfo] = useState(false);

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
        if (vivo) setErrore(true);
      }
    })();
    return () => { vivo = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const copiaCodice = async () => {
    if (!codice) return;
    try { await navigator.clipboard.writeText(codice); setCopiato(true); } catch { toast('Copia non riuscita: selezionalo e copialo a mano.', 'info'); }
  };
  const usa = async () => {
    const c = inserito.trim();
    if (!c || invio) return;
    setInvio(true);
    try { setEsito(await provider.redeemInvite(c)); } catch { setEsito({ ok: false, message: 'Codice non controllato. Riprova.' }); } finally { setInvio(false); }
  };
  const prova = async () => {
    try { await unlockDemo(); toast('Pass in prova attivo.', 'ok'); } catch { toast('Pass in prova non attivato. Riprova.', 'errore'); }
  };

  const richiesti = avanzamento?.required ?? INVITE.required;
  const verificati = Math.min(avanzamento?.verified ?? 0, richiesti);
  const minuti = Math.round(INVITE.minDiagnosticSeconds / 60);
  const sbloccato = pass && sbloccatoConInviti(entitlement);
  const inProva = pass && entitlement.source === 'demo';
  const testoInvito = codice
    ? `Studio per il test d'inglese dell'OFA con AddiOFA. Usa il mio codice invito ${codice}: nell'app apri Profilo, poi Pass, e scrivilo nel campo del codice.`
    : '';

  const stato: { icona: NomeIcona; tono: Tono; parola: string } = !pass
    ? { icona: 'blocco', tono: 'medio', parola: 'Gratis' }
    : inProva ? { icona: 'stato-prova', tono: 'medio', parola: 'Prova' } : { icona: 'stato-ok', tono: 'alto', parola: 'Attivo' };

  return (
    <div className="flex flex-col gap-4">
      {/* stato del Pass: icona, parola di stato, scadenza */}
      <section aria-label="Stato del Pass" className="mt-4 flex items-center gap-4 rounded-[14px] bg-superficie-2 p-4">
        <IconaTono tono="medio" lato={56} className="rounded-[16px] bg-superficie"><Icona nome="pass" size={30} /></IconaTono>
        <div className="min-w-0 flex-1">
          <p role="status" className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[15px] font-extrabold', TONI[stato.tono].tinta, TONI[stato.tono].testo)}>
            <Icona nome={stato.icona} size={18} />{stato.parola}
          </p>
          {pass && entitlement.expiresAt && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[14px] font-bold tabular-nums text-testo" role="img" aria-label={`Vale fino al ${dataBreve(entitlement.expiresAt)}`}>
              <Icona nome="scadenza" size={16} className="text-medio-numero" />{dataBreve(entitlement.expiresAt)}
            </p>
          )}
        </div>
      </section>

      {!pass && (
        <div className="flex flex-col gap-2.5">
          <button type="button" onClick={() => { playTapSound(); onScopri(); }}
            className="brand-premibile w-full min-h-[52px] rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su flex items-center justify-center gap-2">
            <Icona nome="pass" size={20} />Scopri
          </button>
          {demo && (
            <button type="button" onClick={() => { playTapSound(); void prova(); }}
              className="brand-premibile w-full min-h-[48px] rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo flex items-center justify-center gap-2">
              <Icona nome="sblocca" size={20} />Prova
            </button>
          )}
        </div>
      )}

      {/* accesso sbloccato: solo se il Pass è davvero attivo per invito */}
      {sbloccato && (
        <section aria-label="Accesso sbloccato" className="flex flex-col items-center rounded-[14px] bg-alto-tinta p-4 text-center">
          <Disegno nome="successo" lato={110} />
          <h2 className="mt-1 inline-flex items-center gap-2 text-[22px] leading-[28px] font-extrabold text-alto-testo"><Icona nome="stato-ok" size={24} />Sbloccato</h2>
          <button type="button" onClick={() => { playTapSound(); onInizia(); }}
            className="brand-premibile mt-3 inline-flex min-h-[48px] items-center gap-2 rounded-[13px] bg-azione px-6 text-[16px] font-bold text-azione-su"><Icona nome="studia" size={20} />Studia</button>
        </section>
      )}

      {/* inviti: codice, condivisione, compagni verificati */}
      <section aria-labelledby="titolo-inviti" className="rounded-[14px] bg-superficie-2 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="titolo-inviti" className="inline-flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="inviti" size={20} className="text-basso-numero" />Inviti</h2>
          <span className={cn('inline-flex items-center gap-1.5 text-[15.5px] font-extrabold tabular-nums', verificati > 0 ? 'text-alto-testo' : 'text-testo-tenue')} role="img" aria-label={`${verificati} su ${richiesti} compagni verificati`}>
            <Icona nome="compagno" size={18} />{verificati}/{richiesti}
          </span>
          <PulsanteInfo onClick={() => setInfo(true)} etichetta="Come funzionano gli inviti" className="-mr-1.5" />
        </div>

        {codice ? (
          <div className="flex items-center gap-2">
            <span className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[12px] bg-superficie px-3.5 py-2.5">
              <Icona nome="codice" size={22} className="shrink-0 text-azione-scuro" />
              <span className="select-all whitespace-nowrap text-[21px] leading-[28px] font-bold tracking-[0.1em] text-testo" aria-label={`Il tuo codice è ${codice}`}>{codice}</span>
            </span>
            <button type="button" onClick={() => { playTapSound(); void copiaCodice(); }} aria-label={copiato ? 'Codice copiato' : 'Copia il codice'}
              className="brand-premibile grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-superficie text-azione-scuro"><Icona nome={copiato ? 'stato-ok' : 'copia'} size={22} /></button>
            <button type="button" onClick={() => { playTapSound(); onCondividi({ testo: testoInvito, url: indirizzoApp(), titolo: 'Invita' }); }} aria-label="Condividi il codice"
              className="brand-premibile grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-azione-tinta text-azione-scuro"><Icona nome="condividi" size={22} /></button>
          </div>
        ) : (
          <p role={errore ? 'alert' : 'status'} className="inline-flex items-center gap-2 text-[14px] font-bold text-testo-tenue">
            <Icona nome={errore ? 'stato-errore' : 'stato-caricamento'} size={18} className={errore ? 'text-basso-numero' : 'animate-spin'} />{errore ? 'Codice non disponibile' : ''}
          </p>
        )}

        {/* tre tappe: spuntata e verde quando il compagno è verificato, numerata quando è in attesa. Il server dice solo quanti sono, non chi. */}
        <ol className="flex items-center" aria-label="Compagni verificati">
          {Array.from({ length: richiesti }, (_, i) => {
            const fatto = i < verificati;
            return (
              <li key={i} className={cn('flex items-center', i < richiesti - 1 && 'flex-1')}>
                <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full border-2', fatto ? 'border-alto-pieno bg-alto-pieno text-azione-su' : 'border-linea bg-superficie text-testo-tenue')}
                  aria-label={`Compagno ${i + 1}: ${fatto ? 'verificato' : 'in attesa'}`}>
                  {fatto ? <Icona nome="stato-ok" size={18} /> : <span className="text-[13px] font-extrabold" aria-hidden>{i + 1}</span>}
                </span>
                {i < richiesti - 1 && <span className={cn('mx-1 h-1 flex-1 rounded-full', i < verificati - 1 ? 'bg-alto' : 'bg-tacca/60')} aria-hidden />}
              </li>
            );
          })}
        </ol>
      </section>

      {/* hai un codice? */}
      <section aria-label="Usa un codice" className="flex flex-col gap-2">
        <div className="flex gap-2">
          <label htmlFor="invito-codice" className="sr-only">Codice invito</label>
          <input id="invito-codice" value={inserito} onChange={e => { setInserito(e.target.value); setEsito(null); }}
            autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="Codice"
            className="min-w-0 flex-1 rounded-[12px] border border-linea bg-superficie-2 px-4 py-3 font-bold tracking-widest text-testo placeholder:text-testo-tenue placeholder:tracking-normal placeholder:font-semibold focus:outline-none focus:border-azione focus:ring-2 focus:ring-azione/30" />
          <button type="button" onClick={() => { playTapSound(); void usa(); }} disabled={!inserito.trim() || invio} aria-label="Usa il codice"
            className="brand-premibile inline-flex h-12 shrink-0 items-center gap-2 rounded-[12px] bg-superficie-2 px-4 text-[15px] font-bold text-azione-scuro disabled:opacity-40 disabled:pointer-events-none">
            <Icona nome="usa-codice" size={20} />Usa
          </button>
        </div>
        {esito && (
          <p className={cn('inline-flex items-center gap-1.5 text-sm font-bold', esito.ok ? 'text-alto-testo' : 'text-basso-testo')} role="status">
            <Icona nome={esito.ok ? 'stato-ok' : 'stato-errore'} size={18} />{esito.message}
          </p>
        )}
      </section>

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Inviti">
        <ol className="flex flex-col gap-3">
          {[
            { icona: 'condividi' as const, tono: 'azione' as const, t: 'Condividi il tuo codice', d: 'Mandalo a chi deve preparare il test d\'inglese.' },
            { icona: 'email-verificata' as const, tono: 'alto' as const, t: 'I compagni lo usano e confermano l\'email', d: `Serve un'email @${INVITE.emailDomain} verificata con un codice che ricevono per posta.` },
            { icona: 'pass' as const, tono: 'medio' as const, t: `Quando ${richiesti} hanno finito il diagnostico`, d: `Il ${PASS.name} è tuo per ${PASS.validMonths} mesi, senza pagare. Il diagnostico deve durare almeno ${minuti} minuti.` },
          ].map(p => (
            <li key={p.t} className="flex items-start gap-3">
              <IconaTono tono={p.tono} lato={36}><Icona nome={p.icona} size={18} /></IconaTono>
              <span className="min-w-0"><span className="block font-bold">{p.t}</span><span className="block text-testo-tenue">{p.d}</span></span>
            </li>
          ))}
        </ol>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5">
          <li>Chi usa il tuo codice avrà il {INVITE.inviteeDiscountPct} % di sconto sul Pass: è previsto per quando i pagamenti saranno attivi, oggi non c'è ancora nessuno sconto da applicare.</li>
          <li>Conta finire il diagnostico, non il punteggio. Il server comunica solo quanti compagni sono verificati, non chi: per questo non ci sono nomi.</li>
          <li>Il codice si scrive dentro l'app: non è un link che si apre da solo.</li>
          {demo && <li>In questa versione dimostrativa la verifica delle email non è attiva: il conteggio non può essere confermato e non si sblocca nessun Pass. Il Pass in prova serve solo a vedere come funziona.</li>}
        </ul>
      </FoglioInfo>
    </div>
  );
}
