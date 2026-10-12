import { ReactNode, useMemo, useState } from 'react';
import { Bell, BookOpen, Bug, ChevronLeft, Globe, ChevronRight, ClipboardCopy, Download, FileText, HelpCircle, KeyRound, LifeBuoy, LogIn, LogOut, Moon, ShieldCheck, Sparkles, Target, Trash2, Upload, UserRound, Volume2 } from 'lucide-react';
import type { CorpusType, LegalSection } from '../types';
import { useAccess } from '../access/context';
import { useTheme, type ModoTema } from '../hooks/useTheme';
import { useToast } from '../components/Toast';
import { isAudioMuted, playTapSound, setAudioMuted } from '../lib/audio';
import { cn } from '../lib/utils';
import { DISCLAIMER, FEATURE_FLAGS } from '../config/offer';
import { LEGAL_DRAFT, LEGAL_TABS } from '../legal';
import { PoweredByAtlas } from '../components/ui';
import ConfirmDialog from '../components/ConfirmDialog';
import { FONT } from '../brand/tokens';
import { INITIAL_CORPUS_COUNT, questions } from '../data/questions';
import { loadState } from '../lib/storage';
import { nomeVisibile, normalizzaProfilo } from '../lib/profilo/dati';
import { SCHERMATE } from './extra/registro';

// Stessa versione di package.json (l'app non legge il file a runtime)
const VERSIONE_APP = '1.0.0';

interface Props {
  /** Utente collegato (solo con il login acceso). */
  utente?: { displayName?: string | null; email?: string | null } | null;
  onBack: () => void;
  onOpenPaywall: () => void;
  /** Apre la pagina di presentazione (landing) senza cancellare i progressi. */
  onOpenLanding?: () => void;
  onOpenLegal: (s: LegalSection) => void;
  /** Assente = la riga non si vede (in demo l'esportazione è un download). */
  onImport?: () => void;
  onExport?: () => void;
  /** Assente = nessun login (spento nel lancio e in demo). */
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onOpenDebug?: () => void;
  /** Apre una schermata extra (profilo-modifica, obiettivi, faq, segnala): `vaiExtra` di App. Assente = si apre con un ricaricamento della pagina (?vista=). */
  onVai?: (id: string, params?: Record<string, string>) => void;
  /** Materiale di studio in uso e come cambiarlo (la scelta si vede solo con il Pass). */
  corpus?: CorpusType;
  onCambiaCorpus?: (c: CorpusType) => void;
  /** Cancella i dati locali. Assente = si cancellano le chiavi dei progressi e si ricarica la pagina. */
  onReset?: () => void;
}

// Chiavi del localStorage che contengono i dati dell'utente (progressi con profilo, obiettivi e badge dentro `extra`; ultimo diagnostico).
// Non si tocca il Pass né l'identificativo del dispositivo: restano validi.
const CHIAVI_DATI = ['ofa_polimi_app_state', 'addiofa_diagnostico_ultimo'];

/** Apre una schermata extra senza App: ricarica la pagina con ?vista=id (i progressi sono già salvati). */
function vaiConUrl(id: string) {
  window.location.assign(`${window.location.pathname}?vista=${encodeURIComponent(id)}`);
}

/** Sezione stile liste iOS: titoletto grigio sopra, gruppo bianco con righe separate da un filetto, nota piccola sotto. */
function Sezione({ titolo, nota, children }: { titolo: string; nota?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={titolo} className="mt-[22px]">
      <h2 className="px-1 pb-[7px] text-[12px] leading-[14px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">{titolo}</h2>
      <div className="rounded-[12px] bg-superficie-2 overflow-hidden divide-y divide-linea">{children}</div>
      {nota && <p className="px-1 pt-2 text-[12px] leading-[17px] text-testo-tenue">{nota}</p>}
    </section>
  );
}

function Icona({ children }: { children: ReactNode }) {
  return <span className="w-[30px] h-[30px] rounded-[8px] bg-azione-tinta text-azione flex items-center justify-center shrink-0" aria-hidden="true">{children}</span>;
}

function Riga({ icona, titolo, testo, destra, onClick, forte }: {
  icona?: ReactNode; titolo: string; testo?: string; destra?: ReactNode; onClick?: () => void; forte?: boolean;
}) {
  const corpo = (
    <>
      {icona && <Icona>{icona}</Icona>}
      <span className="flex-1 min-w-0">
        <span className={cn('block text-[15px] leading-[20px]', forte ? 'font-semibold text-azione' : 'text-testo')}>{titolo}</span>
        {testo && <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{testo}</span>}
      </span>
      {destra}
      {onClick && !destra && <ChevronRight size={20} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />}
    </>
  );
  const classe = 'w-full flex items-center gap-3 px-3.5 py-[11px] min-h-[52px] text-left';
  return onClick
    ? <button type="button" onClick={() => { playTapSound(); onClick(); }} className={cn('brand-premibile', classe)}>{corpo}</button>
    : <div className={classe}>{corpo}</div>;
}

function Interruttore({ acceso, onCambia, etichetta }: { acceso: boolean; onCambia: (v: boolean) => void; etichetta: string }) {
  return (
    <button type="button" role="switch" aria-checked={acceso} aria-label={etichetta} onClick={() => onCambia(!acceso)}
      className={cn('relative shrink-0 w-[51px] h-[31px] rounded-full', acceso ? 'bg-azione' : 'bg-tacca')}>
      <span className={cn('absolute top-[2px] w-[27px] h-[27px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]', acceso ? 'left-[22px]' : 'left-[2px]')} />
    </button>
  );
}

const TEMI: { id: ModoTema; nome: string }[] = [
  { id: 'sistema', nome: 'Sistema' },
  { id: 'chiaro', nome: 'Chiaro' },
  { id: 'scuro', nome: 'Scuro' },
];

export default function Impostazioni({ utente, onBack, onOpenPaywall, onOpenLanding, onOpenLegal, onImport, onExport, onLogin, onLogout, onOpenProfile, onOpenDebug, onVai, corpus, onCambiaCorpus, onReset }: Props) {
  const { pass, entitlement, provider, unlockDemo } = useAccess();
  const { modo, setModo } = useTheme();
  const toast = useToast();
  const [suoniSpenti, setSuoniSpenti] = useState(isAudioMuted());
  const [chiediCancella, setChiediCancella] = useState(false);
  const [testoCopia, setTestoCopia] = useState<string | null>(null);
  const demo = provider.mode === 'demo';
  // il nome del profilo si legge dai progressi salvati (lo scrive la schermata profilo-modifica)
  const nome = useMemo(() => nomeVisibile(normalizzaProfilo(loadState().extra?.profilo)), []);
  const haNome = useMemo(() => !!normalizzaProfilo(loadState().extra?.profilo).nome, []);
  const vai = (id: string) => (onVai ? onVai(id) : vaiConUrl(id));
  const c = SCHERMATE;

  const cambiaSuoni = (acceso: boolean) => {
    setSuoniSpenti(!acceso);
    setAudioMuted(!acceso);
    if (acceso) playTapSound();
  };
  const sbloccaProva = async () => {
    try { await unlockDemo(); toast('Pass in prova attivo.', 'ok'); } catch { toast('Non sono riuscito a sbloccare il Pass in prova. Riprova.', 'errore'); }
  };
  const scadenza = entitlement.expiresAt
    ? `Vale fino al ${new Date(entitlement.expiresAt).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}.`
    : 'Non ha una scadenza.';

  // Nella demo scaricare un file non si può: si copia il testo dei progressi, con il testo selezionabile se gli appunti non rispondono.
  const copiaProgressi = async () => {
    const testo = JSON.stringify(loadState(), null, 2);
    try {
      await navigator.clipboard.writeText(testo);
      toast('Progressi copiati negli appunti.', 'ok');
    } catch {
      setTestoCopia(testo);
      toast('Non ho potuto usare gli appunti: il testo è qui sotto, selezionalo e copialo.', 'info');
    }
  };
  const cancellaDati = () => {
    setChiediCancella(false);
    if (onReset) { onReset(); return; }
    try { for (const k of CHIAVI_DATI) localStorage.removeItem(k); } catch { /* memoria non disponibile: niente da cancellare */ }
    window.location.reload();
  };

  const materiale = corpus ?? 'all';
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-4 pt-[max(8px,env(safe-area-inset-top))] pb-8">
          <div className="flex items-center h-11">
            <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
              className="brand-premibile -ml-2 pl-1 pr-2 h-11 flex items-center gap-0.5 text-azione text-[16px]">
              <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" /> Indietro
            </button>
          </div>
          <h1 className="px-1 mt-1 text-[28px] leading-[36px] font-extrabold tracking-[-0.02em] text-testo">Impostazioni</h1>

          <Sezione titolo="Account" nota={!utente && !onLogin ? 'Non serve un account: i tuoi dati restano su questo dispositivo.' : undefined}>
            {c['profilo-modifica'] && (
              <Riga icona={<UserRound size={17} />} titolo={haNome ? nome : 'Il tuo profilo'} testo="Nome, avatar e corso di studi" onClick={() => vai('profilo-modifica')} />
            )}
            {utente ? (
              <>
                <Riga icona={<UserRound size={17} />} titolo={utente.displayName || 'Account collegato'} testo={utente.email ?? undefined} onClick={onOpenProfile} />
                {onLogout && <Riga icona={<LogOut size={17} />} titolo="Esci" onClick={onLogout} />}
              </>
            ) : (
              onLogin && <Riga icona={<LogIn size={17} />} titolo="Accedi" testo="Per salvare i progressi nel tuo account" forte onClick={onLogin} />
            )}
            {!c['profilo-modifica'] && !utente && !onLogin && <Riga titolo="Nessun account" testo="L'app funziona senza registrazione" />}
          </Sezione>

          <Sezione titolo="Preferenze">
            <div className="flex items-center gap-3 px-3.5 py-[11px] min-h-[52px]">
              <Icona><Moon size={17} /></Icona>
              <span className="text-[15px] text-testo shrink-0">Tema</span>
              <div role="radiogroup" aria-label="Tema" className="ml-auto grid grid-cols-3 gap-0.5 p-0.5 rounded-[9px] bg-superficie">
                {TEMI.map(t => (
                  <button key={t.id} type="button" role="radio" aria-checked={modo === t.id} onClick={() => { playTapSound(); setModo(t.id); }}
                    className={cn('rounded-[7px] px-2.5 py-1.5 text-[13px] font-semibold', modo === t.id ? 'bg-superficie-2 text-testo shadow-[0_1px_3px_rgba(15,23,42,0.1)] dark:shadow-none dark:border dark:border-tacca' : 'text-testo-tenue')}>
                    {t.nome}
                  </button>
                ))}
              </div>
            </div>
            <Riga icona={<Volume2 size={17} />} titolo="Suoni dell'app" testo="Tocchi, risposte giuste e sbagliate"
              destra={<Interruttore acceso={!suoniSpenti} onCambia={cambiaSuoni} etichetta="Suoni dell'app" />} />
            {pass && onCambiaCorpus ? (
              <div className="px-3.5 py-[11px] flex items-start gap-3">
                <span className="mt-[3px]"><Icona><BookOpen size={17} /></Icona></span>
                <div className="flex-1 min-w-0">
                  <span className="block text-[15px] leading-[20px] text-testo">Domande da studiare</span>
                  <div role="radiogroup" aria-label="Domande da studiare" className="mt-2 grid grid-cols-2 gap-0.5 p-0.5 rounded-[9px] bg-superficie">
                    {([['initial', `Nucleo (${INITIAL_CORPUS_COUNT})`], ['all', `Tutto il banco (${questions.length})`]] as const).map(([id, testo]) => (
                      <button key={id} type="button" role="radio" aria-checked={materiale === id} onClick={() => { playTapSound(); onCambiaCorpus(id); }}
                        className={cn('rounded-[7px] px-2.5 py-1.5 text-[13px] font-semibold', materiale === id ? 'bg-superficie-2 text-testo shadow-[0_1px_3px_rgba(15,23,42,0.1)] dark:shadow-none dark:border dark:border-tacca' : 'text-testo-tenue')}>
                        {testo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : !pass && (
              <Riga icona={<BookOpen size={17} />} titolo="Domande da studiare" testo={`Nucleo gratuito (${INITIAL_CORPUS_COUNT} domande). Tutto il banco (${questions.length}) con il Pass.`} />
            )}
          </Sezione>

          <Sezione titolo="Promemoria" nota="AddiOFA non può mandarti notifiche: non c'è un servizio che le invii, e non ti mostriamo interruttori che non farebbero nulla. Per non perdere il filo, scegli quanti minuti studiare ogni giorno e metti una sveglia sul telefono.">
            <Riga icona={<Bell size={17} />} titolo="Promemoria e notifiche" destra={<span className="shrink-0 text-[14px] text-testo-tenue">Non disponibili</span>} />
            {c.obiettivi && <Riga icona={<Target size={17} />} titolo="Obiettivo giornaliero" testo="Scegli i minuti di studio al giorno" onClick={() => vai('obiettivi')} />}
          </Sezione>

          {onOpenLanding && (
            <Sezione titolo="Sito">
              <Riga icona={<Globe size={17} />} titolo="Pagina di presentazione" testo="La pagina che vede chi arriva la prima volta" onClick={onOpenLanding} />
            </Sezione>
          )}

          <Sezione titolo="Il tuo Pass" nota={demo && !pass ? 'Versione dimostrativa: nessun pagamento. Il Pass in prova serve solo a vedere come funziona.' : undefined}>
            <Riga icona={<KeyRound size={17} />} titolo="Pass AddiOFA"
              testo={pass ? `${entitlement.source === 'demo' ? 'Pass in prova attivo. ' : ''}${scadenza}` : 'Stai usando la parte gratuita.'}
              destra={<span className={cn('shrink-0 text-[14px] font-semibold', pass ? 'text-azione' : 'text-testo-tenue')}>{pass ? 'Attivo' : 'Gratis'}</span>} />
            {!pass && <Riga icona={<Sparkles size={17} />} titolo="Scopri il Pass" forte onClick={onOpenPaywall} />}
            {!pass && demo && <Riga icona={<Sparkles size={17} />} titolo="Sblocca il Pass in prova" forte onClick={() => void sbloccaProva()} />}
          </Sezione>

          <Sezione titolo="Privacy e dati" nota="Progressi, profilo e obiettivi restano su questo dispositivo. Esportali per tenerne una copia o spostarli.">
            {onImport && <Riga icona={<Upload size={17} />} titolo="Importa progressi" onClick={onImport} />}
            {onExport
              ? <Riga icona={<Download size={17} />} titolo="Esporta progressi" onClick={onExport} />
              : <Riga icona={<ClipboardCopy size={17} />} titolo="Copia i progressi" testo="Come testo, negli appunti" onClick={() => void copiaProgressi()} />}
            <Riga icona={<Trash2 size={17} />} titolo="Cancella i dati di questo dispositivo" testo="Progressi, profilo, obiettivi e badge" onClick={() => setChiediCancella(true)} />
          </Sezione>
          {testoCopia !== null && (
            <div className="mt-2">
              <label htmlFor="testo-progressi" className="block px-1 pb-1.5 text-[12.5px] text-testo-tenue">Testo dei progressi: selezionalo e copialo</label>
              <textarea id="testo-progressi" readOnly value={testoCopia} rows={6} onFocus={e => e.currentTarget.select()}
                className="w-full rounded-[12px] bg-superficie-2 border border-linea p-3 text-[12px] font-mono text-testo" />
            </div>
          )}

          {(c.faq || c.segnala) && (
            <Sezione titolo="Aiuto">
              {c.faq && <Riga icona={<HelpCircle size={17} />} titolo="Domande frequenti" onClick={() => vai('faq')} />}
              {c.segnala && <Riga icona={<LifeBuoy size={17} />} titolo="Segnala un problema" testo="Una domanda sbagliata, un errore dell'app" onClick={() => vai('segnala')} />}
            </Sezione>
          )}

          <Sezione titolo="Informazioni" nota={<>{LEGAL_DRAFT && <>I testi legali sono bozze in attesa di revisione. </>}{DISCLAIMER}</>}>
            {LEGAL_TABS.map(t => (
              <Riga key={t.id} icona={t.id === 'privacy' ? <ShieldCheck size={17} /> : <FileText size={17} />} titolo={t.label} onClick={() => onOpenLegal(t.id)} />
            ))}
            <Riga titolo="Versione dell'app" destra={<span className="shrink-0 text-[14px] text-testo-tenue tabular-nums">{VERSIONE_APP}{demo ? ' · demo' : ''}</span>} />
            {onOpenDebug && <Riga icona={<Bug size={17} />} titolo="Debug (solo sviluppo)" onClick={onOpenDebug} />}
          </Sezione>

          {FEATURE_FLAGS.projectId && !demo && <PoweredByAtlas className="mt-6" />}
        </div>
      </div>
      <ConfirmDialog open={chiediCancella} danger title="Cancellare i dati di questo dispositivo?"
        message="Vengono cancellati progressi, simulazioni, profilo, obiettivi e badge salvati qui. Non si può tornare indietro: se vuoi una copia, esportali prima. Il Pass non viene toccato."
        confirmLabel="Cancella tutto" onConfirm={cancellaDati} onCancel={() => setChiediCancella(false)} />
    </div>
  );
}
