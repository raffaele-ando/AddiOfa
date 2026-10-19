// «Project ID» (concept 06 profilo, 30/34/36): l'account unico delle app di Project, più i dati della registrazione e il loro stato di invio.
// Tre blocchi: «La tua iscrizione» (i dati salvati nel dispositivo e se sono arrivati ad ATLAS), «Project ID» (accesso con Google, permessi uno per uno,
// tutti spenti di partenza) e «I tuoi dati» (esporta, scollega, cancella dal dispositivo, elimina l'account). Se ATLAS o Google non sono configurati, lo dice con una riga vera.
import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { BottoneAzione, BottoneRiga, BottoneSecondario, Etichetta, Interruttore, Nota, Pagina, RigaDato, Sezione, copiaTesto, type TonoStato } from './comuni';
import { CampiConsensi, CampoEmail, campiPercorso, formDa, nomeEffettivo, PassoPercorso, ScelteProvenienza, type FormRegistrazione } from './registrazione';
import { useAccesso, useInvio, useRitornoVerifica, useSincronizzaCollegamento } from './hooks';
import { atlas, type MeRisposta } from '../../../lib/atlas';
import { coda, descriviInvio, type ChiaveStato } from '../../../lib/progetto/coda';
import { aggiornaProgetto, corpoIscrizione, creaProfilo, impostaProfilo, leggiProgetto, type Collegamento, type Profilo } from '../../../lib/progetto/profilo';
import { controllaDatiMinimi } from '../../../lib/progetto/validazione';
import { nomeProvenienza } from '../../../lib/progetto/corsi';
import { esitoPercorso } from '../../../lib/progetto/percorso';
import { fonteCorsi, riepilogoPercorso } from '../../../lib/progetto/percorsoDati';
import { inviaLinkVerifica, verificaDisponibile } from '../../../lib/firebase';
import { ATLAS_API_URL, CONSENT_VERSION, ECOSYSTEM, REQUIRED_SCOPES, SCOPES, type ScopeId } from '../../../config/ecosystem';
import { CONTACT_EMAIL } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import type { Tono } from '../ui';

type Vista = 'principale' | 'consenso' | 'modifica' | 'esporta' | 'cancella-locale' | 'elimina-account';

const TONO_INVIO: Record<ChiaveStato, TonoStato> = { inviata: 'alto', 'in-attesa': 'medio', invio: 'azione', rifiutata: 'errore', 'solo-locale': 'neutro' };
const NOMI_CONSENSI = { noi: `Classifica ${ECOSYSTEM.rankingName}`, atlas: `Personalizzazione ${ECOSYSTEM.engineName}`, comunicazioni: `Messaggi da ${ECOSYSTEM.name} e ${ECOSYSTEM.agoraName}` } as const;

function consensiDati(p: { noi: boolean; atlas: boolean; comunicazioni: boolean }): string {
  const dati = (Object.keys(NOMI_CONSENSI) as (keyof typeof NOMI_CONSENSI)[]).filter(k => p[k]).map(k => NOMI_CONSENSI[k]);
  return dati.length ? dati.join(', ') : 'Nessun consenso dato';
}

export default function ProjectId() {
  const { appState, aggiorna, vai, apriLegale } = useExtra();
  const { profilo, collegamento } = leggiProgetto(appState);
  const invio = useInvio();
  const acc = useAccesso(!!collegamento);
  const [vista, setVista] = useState<Vista>('principale');
  const [esito, setEsito] = useState<string | null>(null);
  const [adesso] = useState(() => Date.now());

  const iscrizioneRemota = acc.me?.signup ?? null; // iscrizione collegata a questo Project ID: dal modulo pubblico non si modifica più
  // Se ATLAS ha già l'iscrizione collegata a questo account lo si sa dal servizio, non dalla coda locale
  const statoInvio = iscrizioneRemota
    ? { chiave: 'inviata' as const, titolo: 'Inviata', dettaglio: `Registrata su ${ECOSYSTEM.engineName} e collegata al tuo ${ECOSYSTEM.accountName}.` }
    : descriviInvio(invio, adesso);

  useSincronizzaCollegamento(acc.me, aggiorna);
  const ritorno = useRitornoVerifica(appState, aggiorna);
  const [link, setLink] = useState<{ fase: 'quiete' | 'invio' | 'inviato' | 'errore'; messaggio?: string }>({ fase: 'quiete' });
  const chiediLink = async () => {
    if (!profilo) return;
    setLink({ fase: 'invio' });
    const r = await inviaLinkVerifica(profilo.email);
    setLink('messaggio' in r ? { fase: 'errore', messaggio: r.messaggio } : { fase: 'inviato' });
  };

  const salvaCollegamento = (scopes: ScopeId[], r: MeRisposta) => {
    const link = r.links.find(l => l.appId === ECOSYSTEM.appId);
    aggiorna(s => aggiornaProgetto(s, p => ({
      ...p,
      collegamento: {
        scopes: Array.from(new Set([...REQUIRED_SCOPES, ...(link?.scopes ?? scopes)])), collegatoIl: link?.grantedAt ?? Date.now(), aggiornatoIl: Date.now(),
        projectId: r.account.id, handle: r.account.handle,
      },
    })));
  };

  const torna = (messaggio?: string) => { setVista('principale'); setEsito(messaggio ?? null); };

  if (vista === 'consenso' && acc.utente) {
    return <Consenso profilo={profilo} acc={acc} onAnnulla={() => torna()} onFatto={(scopes, r) => { salvaCollegamento(scopes, r); void acc.ricarica(); torna('Collegato.'); }} />;
  }
  if (vista === 'modifica' && profilo) {
    return <Modifica profilo={profilo} remota={iscrizioneRemota} acc={acc} onAnnulla={() => torna()} onSalva={p => { aggiorna(s => impostaProfilo(s, p)); torna('Salvato.'); }} apriLegale={apriLegale} />;
  }
  if (vista === 'esporta') return <Esporta profilo={profilo} collegamento={collegamento} acc={acc} onChiudi={() => torna()} />;
  if (vista === 'cancella-locale') {
    return (
      <Conferma titolo="Cancella dal dispositivo" onAnnulla={() => torna()} etichetta="Cancella" occupato={false}
        onConferma={() => { aggiorna(s => aggiornaProgetto(s, () => ({}))); coda.svuota(); torna('Cancellato da questo dispositivo.'); }}>
        <p data-testo-ok>Si cancellano da questo dispositivo nome, email, corso, sede, scelte e collegamento. I progressi di studio non si toccano.</p>
        <p data-testo-ok className="mt-2">
          Quello che è già stato inviato ad {ECOSYSTEM.engineName} resta lì. Per cancellarlo: accedi con Google, collega la tua iscrizione ed elimina il {ECOSYSTEM.accountName}
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
          aggiorna(s => aggiornaProgetto(s, p => { const { collegamento: _c, ...resto } = p; return resto; }));
          coda.svuota();
          torna('Account eliminato da ATLAS.');
        }}>
        <p data-testo-ok>Si cancellano da {ECOSYSTEM.engineName}: account, permessi, punteggio NOI e l&apos;iscrizione collegata, con il registro dei tuoi consensi. I dati su questo dispositivo restano.</p>
      </Conferma>
    );
  }

  const percorso = riepilogoPercorso(profilo);
  const puoRiprovare = (statoInvio.chiave === 'in-attesa' || statoInvio.chiave === 'rifiutata') && acc.atlasOnline;

  return (
    <Pagina titolo={ECOSYSTEM.accountName}>
      {esito && <Nota tono="riuscito" className="mt-4"><p role="status" data-testo-ok>{esito}</p></Nota>}
      {ritorno?.tipo === 'ok' && <Nota tono="riuscito" className="mt-4"><p role="status" data-testo-ok>Email verificata: {ritorno.email}.</p></Nota>}
      {ritorno?.tipo === 'errore' && <Nota tono="attenzione" className="mt-4"><p role="alert" data-testo-ok>{ritorno.messaggio}</p></Nota>}

      <Sezione id="pid-iscrizione" titolo="I tuoi dati">
        {!profilo ? (
          <>
            <Nota><p data-testo-ok>Non hai ancora scritto la tua email: manca l&apos;iscrizione.</p></Nota>
            <BottoneAzione onClick={() => vai('completa-profilo')}>Completa il profilo</BottoneAzione>
          </>
        ) : (
          <>
            <ul className="divide-y divide-linea overflow-hidden rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none">
              <RigaDato icona="email" etichetta="Email PoliMi" tono={profilo.emailVerificata ? 'alto' : 'medio'}
                valore={<span className="flex flex-wrap items-center gap-2">{profilo.email}{profilo.emailVerificata ? <Etichetta tono="alto">Verificata</Etichetta> : <Etichetta tono="medio">Non verificata</Etichetta>}</span>} />
              <RigaDato icona="profilo" etichetta="Nome" valore={profilo.nome || 'Non indicato'} />
              {percorso.length > 0
                ? percorso.map(r => <RigaDato key={r.etichetta} icona={r.etichetta === 'Corso' ? 'lezioni' : r.etichetta === 'Sede' ? 'home' : 'livello'} etichetta={r.etichetta} valore={r.valore} tono="alto" />)
                : <RigaDato icona="lezioni" etichetta="Percorso di studi" valore="Non indicato" tono="alto" />}
              <RigaDato icona="condividi" etichetta="Come ci hai conosciuto" valore={nomeProvenienza(profilo.provenienza) ?? 'Non indicato'} tono="viola" />
              <RigaDato icona="privacy" etichetta="Consensi" valore={consensiDati(iscrizioneRemota?.consensi ?? profilo.consensi)} tono="viola" />
              <RigaDato icona={statoInvio.chiave === 'inviata' ? 'stato-ok' : statoInvio.chiave === 'rifiutata' ? 'stato-errore' : 'stato-attesa'} etichetta={`Invio ad ${ECOSYSTEM.engineName}`} tono={statoInvio.chiave === 'inviata' ? 'alto' : statoInvio.chiave === 'rifiutata' ? 'errore' : 'medio'}
                valore={<span><Etichetta tono={TONO_INVIO[statoInvio.chiave]}>{statoInvio.titolo}</Etichetta><span className="mt-1 block text-[13px] font-normal leading-[18px] text-testo-tenue">{statoInvio.dettaglio}</span></span>} />
            </ul>
            <div className="flex flex-col gap-2">
              {!profilo.emailVerificata && verificaDisponibile() && (
                <>
                  <BottoneSecondario onClick={() => { void chiediLink(); }} disabled={link.fase === 'invio'} icona={<Icona nome="email" size={20} />}>{link.fase === 'invio' ? 'Invio…' : 'Verifica con un link'}</BottoneSecondario>
                  {link.fase === 'inviato' && <p role="status" data-testo-ok className="text-[13px] leading-[18px] font-semibold text-alto-testo">Link inviato. Aprilo dalla posta: l&apos;email resta non verificata finché non lo fai.</p>}
                  {link.fase === 'errore' && <ErroreRiga testo={link.messaggio ?? ''} />}
                </>
              )}
              {puoRiprovare && <BottoneSecondario onClick={() => { void coda.riprova(); }} icona={<Icona nome="riprova" size={20} />}>Riprova ora</BottoneSecondario>}
              {statoInvio.chiave === 'solo-locale' && acc.atlasOnline && !iscrizioneRemota && (
                <BottoneSecondario onClick={() => { void coda.accoda(corpoIscrizione(profilo), { forza: true }); }} icona={<Icona nome="condividi" size={20} />}>{`Invia ad ${ECOSYSTEM.engineName}`}</BottoneSecondario>
              )}
              <BottoneSecondario onClick={() => setVista('modifica')} icona={<Icona nome="modifica" size={20} />}>Modifica i dati</BottoneSecondario>
            </div>
          </>
        )}
      </Sezione>

      <Sezione id="pid-account" titolo="Accesso con Google">
        <AccountBlocco acc={acc} collegamento={collegamento} profilo={profilo}
          onCollega={() => setVista('consenso')}
          onPermesso={async (id, acceso) => {
            const scopi = new Set(collegamento?.scopes ?? REQUIRED_SCOPES);
            if (acceso) scopi.add(id); else scopi.delete(id);
            const elenco = Array.from(scopi);
            const r = await acc.esegui(() => atlas.setLink(ECOSYSTEM.appId, elenco));
            if (r) salvaCollegamento(elenco, r);
          }}
          onScollega={async () => {
            const ok = await acc.esegui(async () => { await atlas.removeLink(ECOSYSTEM.appId); return true; });
            if (ok) { aggiorna(s => aggiornaProgetto(s, p => { const { collegamento: _c, ...resto } = p; return resto; })); setEsito('Scollegato.'); }
          }}
          onElimina={() => setVista('elimina-account')} />
      </Sezione>

      <Sezione id="pid-dati" titolo="Esporta e cancella">
        <div className="flex flex-col gap-2">
          <BottoneRiga icona="esporta" onClick={() => setVista('esporta')}>Esporta</BottoneRiga>
          <BottoneRiga icona="privacy" onClick={() => apriLegale('privacy')}>Informativa privacy</BottoneRiga>
          <BottoneRiga icona="cancella" tono="rischio" disabled={!profilo && !collegamento && !invio} onClick={() => setVista('cancella-locale')}>Cancella dal dispositivo</BottoneRiga>
        </div>
      </Sezione>
    </Pagina>
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------------

function AccountBlocco({ acc, collegamento, profilo, onCollega, onPermesso, onScollega, onElimina }: {
  acc: ReturnType<typeof useAccesso>; collegamento: Collegamento | undefined; profilo: Profilo | undefined;
  onCollega: () => void; onPermesso: (id: ScopeId, acceso: boolean) => void; onScollega: () => void; onElimina: () => void;
}) {
  void profilo;
  if (!acc.atlasOnline) {
    return <Nota tono="neutro"><p data-testo-ok>Il collegamento ad {ECOSYSTEM.engineName} non è attivo: i dati non sono stati inviati e restano su questo dispositivo.</p></Nota>;
  }
  if (!acc.loginDisponibile) {
    return <Nota tono="neutro"><p data-testo-ok>L&apos;accesso con Google non è attivo su questo sito.</p></Nota>;
  }
  if (acc.controllo) {
    return <div role="status" aria-label="Controllo l'accesso" className="mx-auto my-3 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />;
  }
  if (!acc.utente) {
    return (
      <>
        {collegamento && <Nota tono="neutro"><p data-testo-ok>Su questo dispositivo risulti collegato, ma non hai effettuato l&apos;accesso.</p></Nota>}
        <BottoneAzione onClick={() => { void acc.accedi().then(ok => { if (ok && !collegamento) onCollega(); }); }} icona={<Icona nome="projectid" size={20} />} disabled={acc.occupato}>Accedi con Google</BottoneAzione>
        {acc.errore && <ErroreRiga testo={acc.errore} />}
      </>
    );
  }
  const u = acc.utente;
  const account = acc.me?.account;
  return (
    <>
      <div className="flex items-center gap-3 rounded-[16px] border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
        {u.photoURL
          ? <img src={u.photoURL} alt="" referrerPolicy="no-referrer" className="h-12 w-12 rounded-full" />
          : <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full bg-azione-tinta text-[20px] font-extrabold text-azione-testo">{(u.displayName || u.email || '?').charAt(0).toUpperCase()}</span>}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-bold text-testo">{account?.displayName ?? u.displayName}</span>
          {account && <span className="block truncate text-[13.5px] font-semibold text-testo-tenue">@{account.handle} · {account.id}</span>}
          <span className="block truncate text-[12.5px] text-testo-tenue">{u.email}</span>
        </span>
      </div>
      {acc.errore && <ErroreRiga testo={acc.errore} />}
      {!collegamento ? (
        <BottoneAzione onClick={onCollega}>Scegli cosa condividere</BottoneAzione>
      ) : (
        <ul className="divide-y divide-linea overflow-hidden rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none" aria-label="Permessi">
          {SCOPES.map(s => (
            <li key={s.id} className="flex items-start gap-3 p-3.5">
              <span className="min-w-0 flex-1">
                <span data-testo-ok className="flex items-center gap-2 text-[15px] leading-[20px] font-bold text-testo">{s.title}</span>
                <span data-testo-ok className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{s.description}</span>
              </span>
              {s.required ? <Obbligatorio /> : <Interruttore acceso={collegamento.scopes.includes(s.id)} disabled={acc.occupato} etichetta={s.title} onChange={v => onPermesso(s.id, v)} />}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-col gap-2">
        {collegamento && <BottoneRiga icona="scollega" disabled={acc.occupato} onClick={onScollega}>Scollega AddiOFA</BottoneRiga>}
        <BottoneRiga icona="esci" onClick={() => { void acc.esci(); }}>Esci</BottoneRiga>
        <BottoneRiga icona="cancella" tono="rischio" disabled={acc.occupato} onClick={onElimina}>{`Elimina ${ECOSYSTEM.accountName}`}</BottoneRiga>
      </div>
    </>
  );
}

/** Il permesso senza il quale l'account non esiste: non è una scelta, quindi nessun interruttore. */
const Obbligatorio = () => <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-superficie px-2.5 py-1 text-[12px] font-semibold text-testo-tenue"><Icona nome="blocco" size={12} />Necessario</span>;

const ErroreRiga = ({ testo }: { testo: string }) => <p role="alert" data-testo-ok className="rounded-[14px] border border-errore/30 bg-errore-tinta p-3 text-center text-[14px] font-bold text-errore-testo dark:bg-superficie">{testo}</p>;

/** Schermata di consenso «Accedi con Project ID»: i permessi uno per uno, tutti spenti, tranne il profilo di base senza il quale l'account non esiste. */
function Consenso({ profilo, acc, onAnnulla, onFatto }: {
  profilo: Profilo | undefined; acc: ReturnType<typeof useAccesso>; onAnnulla: () => void; onFatto: (scopes: ScopeId[], r: MeRisposta) => void;
}) {
  const [scelti, setScelti] = useState<Set<ScopeId>>(() => new Set());
  const [collegaIscrizione, setCollegaIscrizione] = useState(false);
  const u = acc.utente!;
  const conferma = async () => {
    const elenco = Array.from(new Set<ScopeId>([...REQUIRED_SCOPES, ...scelti]));
    const r = await acc.esegui(() => atlas.setLink(ECOSYSTEM.appId, elenco, collegaIscrizione && profilo ? profilo.email : undefined));
    if (r) onFatto(elenco, r);
  };
  return (
    <Pagina titolo={`Accedi con ${ECOSYSTEM.accountName}`} indietroA={onAnnulla}>
      <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-linea bg-superficie p-3.5 shadow-sm dark:shadow-none">
        <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-azione-tinta text-[18px] font-extrabold text-azione-testo">{(u.displayName || u.email || '?').charAt(0).toUpperCase()}</span>
        <span className="min-w-0"><span className="block truncate font-bold text-testo">{u.displayName}</span><span className="block truncate text-[13px] text-testo-tenue">{u.email}</span></span>
      </div>
      <Sezione id="cons-permessi" titolo="Cosa condividere">
        <ul className="divide-y divide-linea overflow-hidden rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none">
          {SCOPES.map(s => (
            <li key={s.id} className="flex items-start gap-3 p-3.5">
              <span className="min-w-0 flex-1">
                <span data-testo-ok className="flex items-center gap-2 text-[15px] leading-[20px] font-bold text-testo">{s.title}</span>
                <span data-testo-ok className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">{s.description}</span>
              </span>
              {s.required ? <Obbligatorio /> : (
                <Interruttore acceso={scelti.has(s.id)} disabled={acc.occupato} etichetta={s.title}
                  onChange={v => setScelti(prec => { const n = new Set(prec); if (v) n.add(s.id); else n.delete(s.id); return n; })} />
              )}
            </li>
          ))}
          {profilo && (
            <li className="flex items-start gap-3 p-3.5">
              <span className="min-w-0 flex-1">
                <span data-testo-ok className="block text-[15px] leading-[20px] font-bold text-testo">Collega la mia iscrizione</span>
                <span data-testo-ok className="mt-0.5 block text-[13px] leading-[18px] text-testo-tenue">Lega all&apos;account l&apos;email {profilo.email}, così da qui puoi esportare e cancellare anche l&apos;iscrizione. L&apos;email non è verificata.</span>
              </span>
              <Interruttore acceso={collegaIscrizione} disabled={acc.occupato} etichetta="Collega la mia iscrizione" onChange={setCollegaIscrizione} />
            </li>
          )}
        </ul>
      </Sezione>
      <p data-testo-ok className="mt-3 text-[12.5px] leading-[18px] text-testo-tenue">Versione del consenso {CONSENT_VERSION}. Puoi cambiare o ritirare ogni permesso quando vuoi da questa pagina.</p>
      {acc.errore && <div className="mt-3"><ErroreRiga testo={acc.errore} /></div>}
      <div className="mt-5 flex flex-col gap-2.5">
        <BottoneAzione onClick={conferma} disabled={acc.occupato}>{acc.occupato ? 'Collego…' : 'Consenti'}</BottoneAzione>
        <BottoneSecondario onClick={onAnnulla} disabled={acc.occupato}>Annulla</BottoneSecondario>
      </div>
    </Pagina>
  );
}

/** Modifica dei dati della registrazione. Se l'iscrizione è collegata a un Project ID, dal modulo pubblico non si cambia più: restano percorso di studi e provenienza (via account). */
function Modifica({ profilo, remota, acc, onAnnulla, onSalva, apriLegale }: {
  profilo: Profilo; remota: MeRisposta['signup']; acc: ReturnType<typeof useAccesso>; onAnnulla: () => void; onSalva: (p: Profilo) => void; apriLegale: (s: 'privacy') => void;
}) {
  const [form, setForm] = useState<FormRegistrazione>(() => formDa(profilo));
  const [provato, setProvato] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [cambiaPercorso, setCambiaPercorso] = useState(false);
  const bloccata = !!remota; // iscrizione collegata
  const errori = controllaDatiMinimi({ nome: form.nome, email: form.email });
  const corrente = riepilogoPercorso(profilo);
  const salva = async () => {
    if (!bloccata && (errori.nome || errori.email)) { setProvato(true); return; }
    const p = creaProfilo(
      { email: bloccata ? profilo.email : form.email, nome: bloccata ? profilo.nome : nomeEffettivo(form) ?? '', ...(cambiaPercorso && esitoPercorso(form.percorso, fonteCorsi) ? campiPercorso(form.percorso) : { scuola: profilo.scuola, sede: profilo.sede, livello: profilo.livello, corso: profilo.corso, corsoId: profilo.corsoId, anno: profilo.anno }),
        provenienza: form.provenienza, consensi: bloccata ? profilo.consensi : form.consensi, completato: true },
      Date.now(), profilo);
    if (!p) { setProvato(true); return; }
    if (bloccata) {
      const r = await acc.esegui(async () => {
        await atlas.updateMe({ corso: p.corso ?? null, sede: p.sede ?? null, scuola: p.scuola ?? null, livello: p.livello ?? null, anno: p.anno ?? null, provenienza: p.provenienza ?? null });
        return true;
      });
      if (!r) { setErrore(acc.errore ?? 'Non riesco ad aggiornare i dati su ATLAS.'); return; }
    } else {
      void coda.accoda(corpoIscrizione(p));
    }
    onSalva(p);
  };
  return (
    <Pagina titolo="Modifica i dati" indietroA={onAnnulla}>
      <div className="mt-4 flex flex-col gap-6">
        {bloccata ? (
          <Nota tono="neutro"><p data-testo-ok>Email, nome e consensi sono registrati su {ECOSYSTEM.engineName} e legati al tuo {ECOSYSTEM.accountName}: da qui non si cambiano. Per ritirare i consensi puoi eliminare il {ECOSYSTEM.accountName}.</p></Nota>
        ) : (
          <CampoEmail form={form} onChange={setForm} provato={provato} verificata={profilo.emailVerificata && profilo.email === form.email.trim().toLowerCase()} />
        )}

        <section aria-labelledby="mod-percorso" className="flex flex-col gap-3">
          <h2 id="mod-percorso" className="text-[17px] leading-[24px] font-bold text-testo">Corso di studi</h2>
          {cambiaPercorso ? (
            <PassoPercorso scelte={form.percorso} onChange={percorso => setForm(f => ({ ...f, percorso }))} onFine={() => undefined}
              fine={<BottoneSecondario onClick={() => setCambiaPercorso(false)}>Fatto</BottoneSecondario>} />
          ) : (
            <>
              {corrente.length > 0 && (
                <ul className="divide-y divide-linea overflow-hidden rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none">
                  {corrente.map(r => <RigaDato key={r.etichetta} etichetta={r.etichetta} valore={r.valore} />)}
                </ul>
              )}
              <BottoneSecondario onClick={() => { setForm(f => ({ ...f, percorso: {} })); setCambiaPercorso(true); }} icona={<Icona nome="modifica" size={20} />}>{corrente.length ? 'Cambia' : 'Scegli'}</BottoneSecondario>
            </>
          )}
        </section>

        <section aria-labelledby="mod-prov" className="flex flex-col gap-3">
          <h2 id="mod-prov" className="text-[17px] leading-[24px] font-bold text-testo">Come ci hai conosciuto</h2>
          <ScelteProvenienza valore={form.provenienza} onChange={id => setForm({ ...form, provenienza: form.provenienza === id ? '' : id })} />
        </section>

        {!bloccata && <CampiConsensi consensi={form.consensi} onChange={c => setForm({ ...form, consensi: c })} onOpenLegal={() => apriLegale('privacy')} />}
        {(errore || acc.errore) && <ErroreRiga testo={errore ?? acc.errore ?? ''} />}
        <div className="flex flex-col gap-2.5">
          <BottoneAzione onClick={salva} disabled={acc.occupato}>Salva</BottoneAzione>
          <BottoneSecondario onClick={onAnnulla}>Annulla</BottoneSecondario>
        </div>
      </div>
    </Pagina>
  );
}

/** Mostra i dati di Project ID e dell'iscrizione come testo, da copiare: niente scaricamento via link (non funziona nelle anteprime). */
function Esporta({ profilo, collegamento, acc, onChiudi }: { profilo: Profilo | undefined; collegamento: Collegamento | undefined; acc: ReturnType<typeof useAccesso>; onChiudi: () => void }) {
  const [testo, setTesto] = useState<string | null>(null);
  const [copiato, setCopiato] = useState(false);
  const [lavoro, setLavoro] = useState(false);
  const prepara = async () => {
    setLavoro(true);
    const remoto = acc.utente && acc.atlasOnline ? await acc.esegui(() => atlas.exportMe()) : null;
    const dati = { esportatoIl: new Date().toISOString(), suQuestoDispositivo: { iscrizione: profilo ?? null, invio: coda.leggi() ? { ...coda.leggi(), corpo: undefined } : null, collegamento: collegamento ?? null }, suAtlas: remoto };
    const t = JSON.stringify(dati, null, 2);
    setTesto(t);
    setCopiato(await copiaTesto(t));
    setLavoro(false);
  };
  return (
    <Pagina titolo="Esporta" indietroA={onChiudi}>
      <div className="mt-4 flex flex-col gap-3">
        <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">I dati di iscrizione e collegamento su questo dispositivo{acc.utente && acc.atlasOnline ? `, più la copia che ${ECOSYSTEM.engineName} ha di te` : ''}. I progressi di studio si esportano dalle Impostazioni.</p>
        <BottoneAzione onClick={prepara} disabled={lavoro} icona={<Icona nome="copia" size={20} />}>{testo ? 'Aggiorna' : 'Mostra e copia'}</BottoneAzione>
        {acc.errore && <ErroreRiga testo={acc.errore} />}
        {testo && (
          <>
            <p role="status" data-testo-ok className="text-[13px] font-semibold text-testo-tenue">{copiato ? 'Copiato negli appunti. Puoi anche selezionare il testo qui sotto.' : 'Non riesco a copiare da solo: seleziona il testo qui sotto e copialo a mano.'}</p>
            <textarea readOnly value={testo} rows={12} onFocus={e => e.currentTarget.select()} aria-label="I tuoi dati"
              className="w-full resize-y rounded-[12px] border border-bordo-campo bg-superficie p-3 font-mono text-[12px] leading-[17px] text-testo" />
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
      <div role="alertdialog" aria-label={titolo} className="mt-5 rounded-[16px] border border-errore/30 bg-errore-tinta p-4 text-[14px] leading-[21px] text-testo dark:bg-superficie">{children}</div>
      {errore && <div className="mt-3"><ErroreRiga testo={errore} /></div>}
      <div className="mt-5 flex flex-col gap-2.5">
        <button type="button" disabled={occupato} onClick={() => { playTapSound(); onConferma(); }}
          className={cn('brand-premibile w-full min-h-[52px] rounded-[14px] bg-errore px-4 py-3 text-[16px] font-bold text-errore-su disabled:opacity-45')}>{occupato ? 'Attendi…' : etichetta}</button>
        <BottoneSecondario onClick={onAnnulla} disabled={occupato}>Annulla</BottoneSecondario>
      </div>
    </Pagina>
  );
}
