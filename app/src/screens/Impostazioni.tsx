import { ReactNode, useState } from 'react';
import { Bug, ChevronLeft, ChevronRight, Download, FileText, KeyRound, LogIn, LogOut, Moon, ShieldCheck, Sparkles, Upload, UserRound, Volume2 } from 'lucide-react';
import type { LegalSection } from '../types';
import { useAccess } from '../access/context';
import { useTheme, type ModoTema } from '../hooks/useTheme';
import { useToast } from '../components/Toast';
import { isAudioMuted, playTapSound, setAudioMuted } from '../lib/audio';
import { cn } from '../lib/utils';
import { DISCLAIMER, FEATURE_FLAGS } from '../config/offer';
import { LEGAL_DRAFT, LEGAL_TABS } from '../legal';
import { PoweredByAtlas } from '../components/ui';
import { FONT } from '../brand/tokens';

// Stessa versione di package.json (l'app non legge il file a runtime)
const VERSIONE_APP = '1.0.0';

interface Props {
  /** Utente collegato (solo con il login acceso). */
  utente?: { displayName?: string | null; email?: string | null } | null;
  onBack: () => void;
  onOpenPaywall: () => void;
  onOpenLegal: (s: LegalSection) => void;
  /** Assente = la riga non si vede (in demo l'esportazione è un download). */
  onImport?: () => void;
  onExport?: () => void;
  /** Assente = nessun login (spento nel lancio e in demo). */
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onOpenDebug?: () => void;
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

export default function Impostazioni({ utente, onBack, onOpenPaywall, onOpenLegal, onImport, onExport, onLogin, onLogout, onOpenProfile, onOpenDebug }: Props) {
  const { pass, entitlement, provider, unlockDemo } = useAccess();
  const { modo, setModo } = useTheme();
  const toast = useToast();
  const [suoniSpenti, setSuoniSpenti] = useState(isAudioMuted());
  const demo = provider.mode === 'demo';

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

          <Sezione titolo="Aspetto">
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
          </Sezione>

          <Sezione titolo="Suoni">
            <Riga icona={<Volume2 size={17} />} titolo="Suoni dell'app" testo="Tocchi, risposte giuste e sbagliate"
              destra={<Interruttore acceso={!suoniSpenti} onCambia={cambiaSuoni} etichetta="Suoni dell'app" />} />
          </Sezione>

          <Sezione titolo="Il tuo Pass" nota={demo && !pass ? 'Versione dimostrativa: nessun pagamento. Il Pass in prova serve solo a vedere come funziona.' : undefined}>
            <Riga icona={<KeyRound size={17} />} titolo="Pass AddiOFA"
              testo={pass ? `${entitlement.source === 'demo' ? 'Pass in prova attivo. ' : ''}${scadenza}` : 'Stai usando la parte gratuita.'}
              destra={<span className={cn('shrink-0 text-[14px] font-semibold', pass ? 'text-azione' : 'text-testo-tenue')}>{pass ? 'Attivo' : 'Gratis'}</span>} />
            {!pass && <Riga icona={<Sparkles size={17} />} titolo="Scopri il Pass" forte onClick={onOpenPaywall} />}
            {!pass && demo && <Riga icona={<Sparkles size={17} />} titolo="Sblocca il Pass in prova" forte onClick={() => void sbloccaProva()} />}
          </Sezione>

          {(onImport || onExport) && (
            <Sezione titolo="Dati" nota="I progressi restano su questo dispositivo. Esportali per tenerne una copia o spostarli.">
              {onImport && <Riga icona={<Upload size={17} />} titolo="Importa progressi" onClick={onImport} />}
              {onExport && <Riga icona={<Download size={17} />} titolo="Esporta progressi" onClick={onExport} />}
            </Sezione>
          )}

          {(utente || onLogin) && (
            <Sezione titolo="Account">
              {utente ? (
                <>
                  <Riga icona={<UserRound size={17} />} titolo={utente.displayName || 'Account collegato'} testo={utente.email ?? undefined} onClick={onOpenProfile} />
                  {onLogout && <Riga icona={<LogOut size={17} />} titolo="Esci" onClick={onLogout} />}
                </>
              ) : (
                onLogin && <Riga icona={<LogIn size={17} />} titolo="Accedi" testo="Per salvare i progressi nel tuo account" forte onClick={onLogin} />
              )}
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
    </div>
  );
}
