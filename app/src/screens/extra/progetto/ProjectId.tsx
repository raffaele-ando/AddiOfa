// «Project ID» (concept 06 profilo, 30/34/36): l'account unico delle app di Project e, sullo stesso schermo, tutto ciò che è facoltativo e sta altrove nell'app:
// il percorso di studi e «come ci hai conosciuto» (solo nel dispositivo), il badge «studente PoliMi» (solo dopo la verifica con link), le comunicazioni
// (casella dedicata, spenta di partenza) e i dati. All'apertura non parte nessuna richiesta a Firebase né ad ATLAS, a meno che su questo dispositivo ci sia già
// un accesso. Regole: docs/design/PRIVACY-LEGGE.md §4 (nessuna casella per creare l'account, soglia 14 anni, revoca con un tocco senza eliminare l'account).
import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneRiga, BottoneSecondario, Etichetta, Nota, Pagina, RigaDato, Sezione, Testata, copiaTesto } from './comuni';
import { CAMPO, Campo, CampoEmail, campiPercorso, CasellaConsenso, PassoPercorso, scelteDa, ScelteProvenienza } from './registrazione';
import { useAccesso, useRitornoLink, useSincronizzaCollegamento } from './hooks';
import { atlas } from '../../../lib/atlas';
import {
  aggiornaProgetto, impostaPercorso, impostaProvenienza, leggiProgetto, togliStudentePoliMi, type Collegamento, type Profilo,
} from '../../../lib/progetto/profilo';
import { controllaEmail, controllaEmailPolimi, controllaHandle, TESTO_MOTIVO_EMAIL } from '../../../lib/progetto/validazione';
import { INFORMATIVA_ACCOUNT, INFORMATIVA_COMUNICAZIONI, RIGA_SOLO_DISPOSITIVO } from '../../../lib/progetto/informativa';
import { riepilogoPercorso } from '../../../lib/progetto/percorsoDati';
import type { ScelteCorso } from '../../../lib/progetto/percorso';
import { dimenticaLinkInAttesa, inviaLinkVerifica, verificaDisponibile } from '../../../lib/firebase';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { CONTACT_EMAIL } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { AppState } from '../../../types';

type Vista = 'principale' | 'percorso' | 'nome' | 'esporta' | 'cancella-locale' | 'elimina-account';
type Acc = ReturnType<typeof useAccesso>;

const rimuoviCollegamento = (s: AppState) => aggiornaProgetto(s, p => { const { collegamento: _c, ...resto } = p; return resto; });

export default function ProjectId() {
  const { appState, aggiorna, vai, apriLegale } = useExtra();
  const { profilo, collegamento } = leggiProgetto(appState);
  const acc = useAccesso(!!collegamento);
  const [vista, setVista] = useState<Vista>('principale');
  const [esito, setEsito] = useState<string | null>(null);
  useSincronizzaCollegamento(acc.me, aggiorna);
  const ritorno = useRitornoLink(appState, aggiorna);

  const torna = (messaggio?: string) => { setVista('principale'); setEsito(messaggio ?? null); };

  if (vista === 'percorso') {
    return <Percorso profilo={profilo} onFine={campi => { aggiorna(s => impostaPercorso(s, campi)); torna(); }} onTogli={() => { aggiorna(s => impostaPercorso(s, {})); torna(); }} onAnnulla={() => torna()} />;
  }
  if (vista === 'nome' && acc.me) {
    return <NomeUtente acc={acc} corrente={acc.me.account.handle} onAnnulla={() => torna()} onFatto={() => torna('@nome utente cambiato.')} />;
  }
  if (vista === 'esporta') return <Esporta profilo={profilo} collegamento={collegamento} acc={acc} onChiudi={() => torna()} />;
  if (vista === 'cancella-locale') {
    return (
      <Conferma titolo="Cancella dal dispositivo" onAnnulla={() => torna()} etichetta="Cancella" occupato={false}
        onConferma={() => { aggiorna(s => aggiornaProgetto(s, () => ({}))); dimenticaLinkInAttesa(); torna('Cancellato da questo dispositivo.'); }}>
        <p data-testo-ok>Si cancellano da questo dispositivo il percorso di studi, come ci hai conosciuto, il badge studente e il collegamento al {ECOSYSTEM.accountName}. I progressi di studio non si toccano.</p>
        <p data-testo-ok className="mt-2">
          Quello che hai dato a {ECOSYSTEM.engineName} (account, classifica, comunicazioni) resta lì finché non lo togli: dalle caselle in Project ID e in NOI o eliminando il {ECOSYSTEM.accountName}
          {CONTACT_EMAIL ? `; oppure scrivi a ${CONTACT_EMAIL}` : ''}.
        </p>
      </Conferma>
    );
  }
  if (vista === 'elimina-account') {
    return (
      <Conferma titolo={`Elimina ${ECOSYSTEM.accountName}`} onAnnulla={() => torna()} etichetta="Elimina" occupato={acc.occupato} errore={acc.errore}
        onConferma={async () => {
          const ok = await acc.esegui(async () => { await atlas.deleteMe(); return true; });
          if (!ok) return;
          await acc.esci();
          aggiorna(rimuoviCollegamento);
          torna(`${ECOSYSTEM.accountName} eliminato da ${ECOSYSTEM.engineName}.`);
        }}>
        <p data-testo-ok>Si cancellano da {ECOSYSTEM.engineName}: l&apos;account, i permessi, il punteggio NOI, l&apos;email delle comunicazioni e il registro dei tuoi consensi. I dati su questo dispositivo restano.</p>
      </Conferma>
    );
  }

  const percorso = riepilogoPercorso(profilo);
  const inClassifica = !!acc.me?.consensi.noi;

  return (
    <Pagina titolo={ECOSYSTEM.accountName}>
      <Testata nome="verifica-utente" kit="kit-luminoso" lato={150} />
      {esito && <Nota tono="riuscito" className="mt-4"><p role="status" data-testo-ok>{esito}</p></Nota>}
      {ritorno?.tipo === 'ok' && ritorno.scopo === 'verifica' && <Nota tono="riuscito" className="mt-4"><p role="status" data-testo-ok>Email verificata: {ritorno.email}.</p></Nota>}
      {ritorno?.tipo === 'ok' && ritorno.scopo === 'accesso' && <Nota tono="riuscito" className="mt-4"><p role="status" data-testo-ok>Accesso effettuato.</p></Nota>}
      {ritorno?.tipo === 'errore' && <Nota tono="attenzione" className="mt-4"><p role="alert" data-testo-ok>{ritorno.messaggio}</p></Nota>}

      <Sezione id="pid-account" titolo="Account">
        <AccountBlocco acc={acc} apriLegale={() => apriLegale('privacy')}
          onNome={() => setVista('nome')}
          onEsci={async () => { await acc.esci(); aggiorna(rimuoviCollegamento); }}
          onElimina={() => setVista('elimina-account')} />
      </Sezione>

      {acc.utente && acc.me && (
        <>
          <Sezione id="pid-noi" titolo={`Classifica ${ECOSYSTEM.rankingName}`}>
            <ul className="divide-y divide-linea overflow-hidden rounded-[14px] bg-superficie-2">
              <RigaDato icona="amici" etichetta="Nella classifica" tono={inClassifica ? 'alto' : 'azione'}
                valore={<Etichetta tono={inClassifica ? 'alto' : 'neutro'}>{inClassifica ? 'Sì' : 'No'}</Etichetta>} />
            </ul>
            <BottoneRiga icona="amici" onClick={() => vai('noi')}>{inClassifica ? `Apri ${ECOSYSTEM.rankingName} o esci` : `Apri ${ECOSYSTEM.rankingName}`}</BottoneRiga>
          </Sezione>

          <Sezione id="pid-comunicazioni" titolo="Comunicazioni">
            <Comunicazioni acc={acc} />
          </Sezione>
        </>
      )}

      <Sezione id="pid-percorso" titolo="Il tuo percorso">
        <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">Facoltativo. {RIGA_SOLO_DISPOSITIVO}</p>
        {percorso.length > 0 && (
          <ul className="divide-y divide-linea overflow-hidden rounded-[14px] bg-superficie-2">
            {percorso.map(r => <RigaDato key={r.etichetta} icona={r.etichetta === 'Corso' ? 'lezioni' : r.etichetta === 'Sede' ? 'home' : 'livello'} etichetta={r.etichetta} valore={r.valore} />)}
          </ul>
        )}
        <BottoneSecondario onClick={() => setVista('percorso')} icona={<Icona nome="modifica" size={20} />}>{percorso.length ? 'Cambia' : 'Cosa fai al Poli'}</BottoneSecondario>
        <h3 className="mt-2 text-sm font-bold text-testo">Come ci hai conosciuto</h3>
        <ScelteProvenienza valore={profilo?.provenienza ?? ''} onChange={id => aggiorna(s => impostaProvenienza(s, profilo?.provenienza === id ? undefined : id))} />
      </Sezione>

      <Sezione id="pid-studente" titolo="Studente PoliMi">
        <BadgeStudente profilo={profilo} onTogli={() => aggiorna(togliStudentePoliMi)} />
      </Sezione>

      <Sezione id="pid-dati" titolo="I tuoi dati">
        <div className="flex flex-col gap-2">
          <BottoneRiga icona="esporta" onClick={() => setVista('esporta')}>Esporta</BottoneRiga>
          <BottoneRiga icona="privacy" onClick={() => apriLegale('privacy')}>Informativa privacy</BottoneRiga>
          <BottoneRiga icona="cancella" tono="rischio" disabled={!profilo && !collegamento} onClick={() => setVista('cancella-locale')}>Cancella dal dispositivo</BottoneRiga>
        </div>
      </Sezione>
    </Pagina>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------

const ErroreRiga = ({ testo }: { testo: string }) => <p role="alert" data-testo-ok className="rounded-[12px] bg-errore-tinta p-3 text-center text-[13px] font-bold text-errore-testo">{testo}</p>;

/** Account: prima dell'accesso la dichiarazione dell'età (non è un consenso e non si salva), poi Google o email; dopo, i dati dell'account. */
function AccountBlocco({ acc, apriLegale, onNome, onEsci, onElimina }: { acc: Acc; apriLegale: () => void; onNome: () => void; onEsci: () => void; onElimina: () => void }) {
  const [eta, setEta] = useState(false);
  const [sotto14, setSotto14] = useState(false);
  const [conEmail, setConEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [errEmail, setErrEmail] = useState<string | undefined>();
  const [invio, setInvio] = useState<{ fase: 'quiete' | 'inviato' | 'errore'; testo?: string }>({ fase: 'quiete' });

  if (!acc.atlasOnline) {
    return <Nota tono="attenzione"><p data-testo-ok>{ECOSYSTEM.engineName} non è collegato in questa versione: l&apos;accesso non è disponibile. Tutto il resto funziona sul tuo dispositivo.</p></Nota>;
  }
  if (!acc.loginDisponibile) {
    return <Nota tono="attenzione"><p data-testo-ok>L&apos;accesso non è configurato in questa versione.</p></Nota>;
  }
  if (acc.controllo) {
    return <div role="status" aria-label="Controllo l'accesso" className="mx-auto my-3 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />;
  }

  if (!acc.utente) {
    const manda = async () => {
      const c = controllaEmail(email);
      if ('motivo' in c) { setErrEmail(c.motivo === 'vuota' ? 'Scrivi la tua email.' : 'L\'indirizzo non sembra corretto.'); return; }
      setErrEmail(undefined);
      const r = await acc.accediEmail(c.email);
      setInvio('messaggio' in r ? { fase: 'errore', testo: r.messaggio } : { fase: 'inviato', testo: c.email });
    };
    return (
      <>
        <CasellaConsenso spuntata={eta} onChange={v => { setEta(v); if (v) setSotto14(false); }} titolo="Ho almeno 14 anni"
          testo="Sotto i 14 anni serve l'autorizzazione di un genitore o di chi ne fa le veci: l'account non è disponibile. L'allenamento di AddiOFA funziona uguale." />
        {!eta && (
          <button type="button" onClick={() => { playTapSound(); setSotto14(true); }} className="brand-premibile self-start rounded-[10px] px-1 py-2 text-[13.5px] font-bold text-azione-testo">Ho meno di 14 anni</button>
        )}
        {sotto14 && !eta && (
          <Nota tono="neutro"><p role="status" data-testo-ok>L&apos;allenamento resta aperto e senza dati. Per {ECOSYSTEM.accountName} e {ECOSYSTEM.rankingName} serve l&apos;autorizzazione di un genitore{CONTACT_EMAIL ? `: chiedigli di scrivere a ${CONTACT_EMAIL}` : ''}.</p></Nota>
        )}
        <div className="flex flex-col gap-2.5">
          <BottoneAzione onClick={() => { void acc.accedi(); }} disabled={!eta || acc.occupato} icona={<Icona nome="projectid" size={20} />}>Accedi con Google</BottoneAzione>
          <BottoneSecondario onClick={() => setConEmail(v => !v)} disabled={!eta || acc.occupato} icona={<Icona nome="email" size={20} />}>Accedi con email</BottoneSecondario>
        </div>
        {conEmail && eta && (
          <div className="flex flex-col gap-2.5">
            <CampoEmail etichetta="La tua email (anche personale)" valore={email} onChange={v => { setEmail(v); setInvio({ fase: 'quiete' }); }} errore={errEmail} />
            <BottoneSecondario onClick={() => { void manda(); }} disabled={acc.occupato}>{acc.occupato ? 'Invio…' : 'Invia il link'}</BottoneSecondario>
            {invio.fase === 'inviato' && <p role="status" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-alto-testo">Link inviato a {invio.testo}. Aprilo da questo browser per entrare.</p>}
            {invio.fase === 'errore' && <ErroreRiga testo={invio.testo ?? ''} />}
          </div>
        )}
        {acc.errore && <ErroreRiga testo={acc.errore} />}
        <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">{INFORMATIVA_ACCOUNT()}</p>
        <button type="button" onClick={() => { playTapSound(); apriLegale(); }} className="brand-premibile self-start rounded-[10px] px-1 py-1.5 text-[13px] font-bold text-azione-testo">Informativa completa</button>
      </>
    );
  }

  const account = acc.me?.account;
  const u = acc.utente;
  return (
    <>
      <div className="flex items-center gap-3 rounded-[14px] bg-superficie-2 p-3.5">
        <span aria-hidden="true" className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-azione-tinta text-[20px] font-extrabold text-azione-testo">{(account?.handle ?? u.email ?? '?').charAt(0).toUpperCase()}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-bold text-testo">{account ? `@${account.handle}` : (u.email ?? ECOSYSTEM.accountName)}</span>
          {account && <span className="block truncate text-[13.5px] font-semibold text-testo-tenue">{account.id}</span>}
          <span className="block truncate text-[12.5px] text-testo-tenue">{account?.email ?? u.email}</span>
        </span>
      </div>
      {acc.errore && <ErroreRiga testo={acc.errore} />}
      <div className="flex flex-col gap-2">
        {account && <BottoneRiga icona="modifica" disabled={acc.occupato} onClick={onNome}>Cambia @nome utente</BottoneRiga>}
        <BottoneRiga icona="esci" onClick={onEsci}>Esci</BottoneRiga>
        <BottoneRiga icona="cancella" tono="rischio" disabled={acc.occupato} onClick={onElimina}>{`Elimina ${ECOSYSTEM.accountName}`}</BottoneRiga>
      </div>
    </>
  );
}

/** La casella delle comunicazioni: indirizzo qualunque, spenta di partenza, si spegne con un tocco. Dice com'è davvero lo stato (conferma con link: oggi non collegata). */
function Comunicazioni({ acc }: { acc: Acc }) {
  const com = acc.me?.consensi.comunicazioni ?? null;
  const [email, setEmail] = useState('');
  const [errore, setErrore] = useState<string | undefined>();
  const cambia = async (acceso: boolean) => {
    if (acceso) {
      const c = controllaEmail(email);
      if ('motivo' in c) { setErrore(c.motivo === 'vuota' ? 'Scrivi un indirizzo email.' : 'L\'indirizzo non sembra corretto.'); return; }
      setErrore(undefined);
      const r = await acc.esegui(() => atlas.modifica({ consensi: { comunicazioni: true }, comunicazioniEmail: c.email }));
      if (r) acc.impostaMe(r);
    } else {
      const r = await acc.esegui(() => atlas.modifica({ consensi: { comunicazioni: false } }));
      if (r) { acc.impostaMe(r); setEmail(''); }
    }
  };
  return (
    <CasellaConsenso spuntata={!!com} onChange={v => { void cambia(v); }} occupato={acc.occupato}
      titolo={`Voglio ricevere email da ${ECOSYSTEM.name} e ${ECOSYSTEM.agoraName}`}
      testo={`Novità del progetto e di ${ECOSYSTEM.agoraName}, all'indirizzo che scrivo qui. Ti mandiamo un link per confermare: finché non confermi non ti scriviamo. Puoi disiscriverti da questa pagina.`}
      informativa={INFORMATIVA_COMUNICAZIONI()}>
      {!com && <CampoEmail etichetta="Email (anche personale)" valore={email} onChange={v => { setEmail(v); setErrore(undefined); }} errore={errore} />}
      {com && (
        <Nota tono="neutro">
          <p role="status" data-testo-ok>{com.email}: {com.stato === 'confermato' ? 'confermata.' : 'in attesa di conferma. L\'invio del link di conferma oggi non è collegato, quindi non parte nessuna email.'}</p>
        </Nota>
      )}
      {acc.errore && <ErroreRiga testo={acc.errore} />}
    </CasellaConsenso>
  );
}

/** Il badge «studente PoliMi»: c'è solo dopo la verifica con il link, altrimenti si offre di chiederla. */
function BadgeStudente({ profilo, onTogli }: { profilo: Profilo | undefined; onTogli: () => void }) {
  const [email, setEmail] = useState('');
  const [errore, setErrore] = useState<string | undefined>();
  const [fase, setFase] = useState<'quiete' | 'invio' | 'inviato' | 'errore'>('quiete');
  const [messaggio, setMessaggio] = useState('');
  const badge = profilo?.studentePoliMi;

  if (badge) {
    return (
      <>
        <ul className="divide-y divide-linea overflow-hidden rounded-[14px] bg-superficie-2">
          <RigaDato icona="stato-ok" etichetta="Email PoliMi" tono="alto" valore={<span className="flex flex-wrap items-center gap-2">{badge.email}<Etichetta tono="alto">Verificata</Etichetta></span>} />
        </ul>
        <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">{RIGA_SOLO_DISPOSITIVO}</p>
        <BottoneSecondario onClick={onTogli}>Togli il badge</BottoneSecondario>
      </>
    );
  }
  if (!verificaDisponibile()) {
    return <Nota tono="neutro"><p data-testo-ok>La verifica con link non è disponibile in questa versione.</p></Nota>;
  }
  const manda = async () => {
    const c = controllaEmailPolimi(email);
    if ('motivo' in c) { setErrore(TESTO_MOTIVO_EMAIL[c.motivo]); return; }
    setErrore(undefined); setFase('invio');
    const r = await inviaLinkVerifica(c.email);
    if ('messaggio' in r) { setFase('errore'); setMessaggio(r.messaggio); } else setFase('inviato');
  };
  return (
    <>
      <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">Facoltativo e non serve per studiare. Ti mandiamo un link: il badge compare solo dopo che lo apri.</p>
      <CampoEmail etichetta="Email del Politecnico" valore={email} onChange={v => { setEmail(v); setErrore(undefined); setFase('quiete'); }} errore={errore} placeholder="nome@mail.polimi.it" />
      <BottoneSecondario onClick={() => { void manda(); }} disabled={fase === 'invio'} icona={<Icona nome="email" size={20} />}>{fase === 'invio' ? 'Invio…' : 'Verifica con un link'}</BottoneSecondario>
      {fase === 'inviato' && <p role="status" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-alto-testo">Link inviato. Aprilo dalla posta, da questo browser: finché non lo fai l&apos;email non è verificata.</p>}
      {fase === 'errore' && <ErroreRiga testo={messaggio} />}
    </>
  );
}

/** «Cosa fai al Poli»: la cascata, un tocco per schermata. Si può lasciare a metà (non si salva niente) o togliere. */
function Percorso({ profilo, onFine, onTogli, onAnnulla }: { profilo: Profilo | undefined; onFine: (c: ReturnType<typeof campiPercorso>) => void; onTogli: () => void; onAnnulla: () => void }) {
  const [scelte, setScelte] = useState<ScelteCorso>(() => scelteDa(profilo));
  const haPercorso = !!(profilo?.scuola || profilo?.corsoId);
  return (
    <Pagina titolo="Il tuo percorso" indietroA={onAnnulla}>
      <div className="mt-4 flex flex-col gap-4">
        <PassoPercorso scelte={scelte} onChange={setScelte} onFine={e => onFine(e)}
          fine={<BottoneAzione onClick={() => onFine(campiPercorso(scelte))}>Fatto</BottoneAzione>} />
        <p data-testo-ok className="text-[12.5px] leading-[18px] text-testo-tenue">{RIGA_SOLO_DISPOSITIVO}</p>
        <div className="flex flex-col gap-2.5">
          {haPercorso && <BottoneSecondario onClick={onTogli}>Togli il percorso</BottoneSecondario>}
          <BottoneSecondario onClick={onAnnulla}>Salta</BottoneSecondario>
        </div>
      </div>
    </Pagina>
  );
}

/** Il @nome utente: è l'unico nome che si vede in classifica; lo sceglie l'utente. */
function NomeUtente({ acc, corrente, onAnnulla, onFatto }: { acc: Acc; corrente: string; onAnnulla: () => void; onFatto: () => void }) {
  const [valore, setValore] = useState(corrente);
  const [errore, setErrore] = useState<string | undefined>();
  const salva = async () => {
    const h = controllaHandle(valore);
    if (!h) { setErrore('Da 3 a 20 caratteri: lettere minuscole, numeri, _ e .'); return; }
    setErrore(undefined);
    if (h === corrente) { onAnnulla(); return; }
    const r = await acc.esegui(() => atlas.modifica({ handle: h }));
    if (r) { acc.impostaMe(r); onFatto(); }
  };
  return (
    <Pagina titolo="@nome utente" indietroA={onAnnulla}>
      <div className="mt-4 flex flex-col gap-4">
        <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">È il solo nome che compare nella classifica, se decidi di entrarci. Non usare il tuo nome vero se non vuoi.</p>
        <Campo id="pid-handle" etichetta="Nome utente" errore={errore}>
          <input id="pid-handle" value={valore} maxLength={20} autoCapitalize="none" autoCorrect="off" spellCheck={false} aria-invalid={!!errore}
            onChange={ev => { setValore(ev.target.value); setErrore(undefined); }} className={CAMPO} />
        </Campo>
        {acc.errore && <ErroreRiga testo={acc.errore} />}
        <div className="flex flex-col gap-2.5">
          <BottoneAzione onClick={() => { void salva(); }} disabled={acc.occupato}>Salva</BottoneAzione>
          <BottoneSecondario onClick={onAnnulla} disabled={acc.occupato}>Annulla</BottoneSecondario>
        </div>
      </div>
    </Pagina>
  );
}

/** Mostra i dati come testo, da copiare: niente scaricamento via link (non funziona nelle anteprime). */
function Esporta({ profilo, collegamento, acc, onChiudi }: { profilo: Profilo | undefined; collegamento: Collegamento | undefined; acc: Acc; onChiudi: () => void }) {
  const [testo, setTesto] = useState<string | null>(null);
  const [copiato, setCopiato] = useState(false);
  const [lavoro, setLavoro] = useState(false);
  const prepara = async () => {
    setLavoro(true);
    const remoto = acc.utente && acc.atlasOnline ? await acc.esegui(() => atlas.exportMe()) : null;
    const dati = { esportatoIl: new Date().toISOString(), suQuestoDispositivo: { percorsoEScelte: profilo ?? null, collegamento: collegamento ?? null }, suAtlas: remoto };
    const t = JSON.stringify(dati, null, 2);
    setTesto(t);
    setCopiato(await copiaTesto(t));
    setLavoro(false);
  };
  return (
    <Pagina titolo="Esporta" indietroA={onChiudi}>
      <div className="mt-4 flex flex-col gap-3">
        <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Le scelte su questo dispositivo{acc.utente && acc.atlasOnline ? `, più la copia che ${ECOSYSTEM.engineName} ha di te` : ''}. I progressi di studio si esportano dalle Impostazioni.</p>
        <BottoneAzione onClick={prepara} disabled={lavoro} icona={<Icona nome="copia" size={20} />}>{testo ? 'Aggiorna' : 'Mostra e copia'}</BottoneAzione>
        {acc.errore && <ErroreRiga testo={acc.errore} />}
        {testo && (
          <>
            <p role="status" data-testo-ok className="text-[13px] font-semibold text-testo-tenue">{copiato ? 'Copiato negli appunti. Puoi anche selezionare il testo qui sotto.' : 'Non riesco a copiare da solo: seleziona il testo qui sotto e copialo a mano.'}</p>
            <textarea readOnly value={testo} rows={12} onFocus={e => e.currentTarget.select()} aria-label="I tuoi dati"
              className="w-full resize-y rounded-[12px] border border-bordo-campo bg-superficie-2 p-3 font-mono text-[11px] leading-[16px] text-testo" />
          </>
        )}
      </div>
    </Pagina>
  );
}

function Conferma({ titolo, children, etichetta, onConferma, onAnnulla, occupato, errore }: {
  titolo: string; children: React.ReactNode; etichetta: string; onConferma: () => void; onAnnulla: () => void; occupato: boolean; errore?: string | null;
}) {
  return (
    <Pagina titolo={titolo} indietroA={onAnnulla}>
      <div role="alertdialog" aria-label={titolo} className="mt-5 rounded-[14px] bg-errore-tinta p-4 text-[14px] leading-[21px] text-testo">{children}</div>
      {errore && <div className="mt-3"><ErroreRiga testo={errore} /></div>}
      <div className="mt-5 flex flex-col gap-2.5">
        <button type="button" disabled={occupato} onClick={() => { playTapSound(); onConferma(); }}
          className={cn('brand-premibile w-full min-h-[52px] rounded-[13px] bg-errore px-4 py-3 text-[16px] font-bold text-errore-su disabled:opacity-40')}>{occupato ? 'Attendi…' : etichetta}</button>
        <BottoneSecondario onClick={onAnnulla} disabled={occupato}>Annulla</BottoneSecondario>
      </div>
    </Pagina>
  );
}
