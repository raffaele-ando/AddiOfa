import { useMemo, useState } from 'react';
import { AppState, CorpusType, LegalSection, PaywallReason } from '../types';
import { Volume2, VolumeX, Moon, Sun, Upload, Download, Bug, Fingerprint, Lock, KeyRound } from 'lucide-react';
import { User } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { questions, getQuestionsByCorpus, INITIAL_CORPUS_COUNT } from '../data/questions';
import { playTapSound, isAudioMuted, setAudioMuted } from '../lib/audio';
import { ECOSYSTEM } from '../config/ecosystem';
import { FEATURE_FLAGS, FORMATS } from '../config/offer';
import { useAccess } from '../access/context';
import { remainingFreeSims } from '../access/entitlement';
import Footer from '../screens/Footer';
import { PoweredByAtlas } from './ui';
import { FONT } from '../brand/tokens';
import Navigazione, { Scheda } from './Navigazione';
import { urlIcona } from '../brand/risorse';
import Cta from './home/Cta';
import FoglioStima from './FoglioStima';
import { StimaSezione, BannerStato, ScopriCard, chiaveBanner } from './home/Stima';
import GraficoStime from './home/GraficoStime';
import Fattori from './home/Fattori';
import ObiettivoCard from './home/Obiettivo';
import ProssimoObiettivo from './home/Lezione';
import { SerieCard, ProgressiCard } from './home/Serie';
import Strumenti, { VoceStrumento } from './home/Strumenti';
import { countLearned } from '../lib/spacedRepetition';
import { calcolaFattori, calcolaStima, lezioneConsigliata, livelloDi, progressoArgomento, serieStime, ultimaSimulazione, ultimiGiorni } from './home/stima';

interface MenuProps {
  appState: AppState;
  user: User | null;
  onStartSmart: () => void;
  onStartLearn: () => void;
  onStartExam: () => void;
  onOpenStats: () => void;
  /** Assente = il pulsante non si vede (in demo l'esportazione è un download). */
  onExport?: () => void;
  onImport?: () => void;
  /** Assente = login non mostrato (spento nel lancio e in demo). */
  onLogin?: () => void;
  onLogout?: () => void;
  onOpenDebug?: () => void;
  onSelectCorpus?: (corpus: CorpusType) => void;
  /** Corpus in uso (nella parte gratuita è sempre il nucleo). */
  corpus?: CorpusType;
  onOpenPaywall: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  onStartErrors: () => void;
  onOpenTheory: () => void;
  /** Apre la scheda di teoria di un argomento (id di TheoryTopic). Assente = si apre l'elenco con onOpenTheory. */
  onOpenTheoryTopic?: (id: string) => void;
  /** Avvia l'allenamento mirato su un filtro come "category:Grammatica" o "level:A2" (stesso formato di PracticeMenu). Assente = le barre non sono cliccabili. */
  onStartFocus?: (filtro: string) => void;
  onOpenLegal: (s: LegalSection) => void;
  onOpenCheatSheet?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  onNaviga?: (s: Scheda) => void;
}

export default function Menu({ appState, user, corpus, onStartSmart, onStartLearn, onStartExam, onOpenStats, onExport, onImport, onLogin, onOpenDebug, onSelectCorpus, onOpenPaywall, onNeedPass, onStartErrors, onOpenTheory, onOpenTheoryTopic, onStartFocus, onOpenLegal, onOpenCheatSheet, onOpenDiagnostic, onOpenProfile, onOpenLeaderboard, onNaviga }: MenuProps) {
  const { isDark, toggleTheme } = useTheme();
  const { pass, entitlement, simsDone, provider } = useAccess();
  const [muted, setMuted] = useState(isAudioMuted());
  const [foglio, setFoglio] = useState(false);

  const simsRimaste = remainingFreeSims(entitlement, simsDone);
  const testoSim = pass
    ? 'Simulazioni illimitate'
    : simsRimaste > 0
      ? `${simsRimaste} ${simsRimaste === 1 ? 'simulazione gratuita' : 'simulazioni gratuite'}`
      : 'La simulazione gratuita è già usata';
  const simBloccata = !pass && simsRimaste === 0;
  const selectedCorpus: CorpusType = corpus ?? appState.selectedCorpus ?? 'all';
  const activeQuestions = getQuestionsByCorpus(selectedCorpus);
  const totalQuestions = activeQuestions.length;
  const masteredQuestions = countLearned(appState.stats, activeQuestions.map(q => q.id));
  const nome = user?.displayName?.split(' ')[0];

  // Tutti i numeri della home vengono da qui: stima, aree, ultima simulazione, lezione, attività
  const dati = useMemo(() => ({
    stima: calcolaStima(appState),
    fattori: calcolaFattori(appState),
    ultima: ultimaSimulazione(appState),
    lezione: lezioneConsigliata(appState, pass),
    giorni: ultimiGiorni(appState),
    punti: serieStime(appState),
  }), [appState, pass]);
  const { stima, fattori, ultima, lezione, giorni, punti } = dati;
  const haRisposte = fattori.risposteTotali > 0;
  const livello = stima ? livelloDi(stima.p) : null;
  const progresso = useMemo(
    () => (lezione ? progressoArgomento(appState, lezione.topic.id, new Set(activeQuestions.map(q => q.id))) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appState, lezione, selectedCorpus],
  );

  const faiSimulazione = () => (simBloccata ? onNeedPass('simulazione') : onStartExam());
  const apriLezione = () => {
    if (!lezione) return;
    if (lezione.bloccata) onNeedPass('teoria');
    else if (onOpenTheoryTopic) onOpenTheoryTopic(lezione.topic.id);
    else onOpenTheory();
  };
  const descrizioneSessione = selectedCorpus === 'initial'
    ? `${pass ? 'Nucleo' : 'Nucleo gratuito'} · ${INITIAL_CORPUS_COUNT} frasi`
    : `Sessione di 10 domande · ${questions.length} nel banco`;
  // Il pulsante principale cambia con lo stato: inizia, continua, oppure mettiti alla prova
  const cta = livello === 'alto' && !simBloccata
    ? { etichetta: 'Fai una simulazione', sotto: `${FORMATS.ente.questions} domande, ${FORMATS.ente.minutes} minuti · soglia ${FORMATS.ente.passMark}`, azione: onStartExam }
    : { etichetta: haRisposte ? 'Continua a studiare' : 'Inizia a studiare', sotto: descrizioneSessione, azione: onStartSmart };

  const voci: VoceStrumento[] = [
    { id: 'simulazione', titolo: "Simulazione d'esame", testo: `30 domande, 15 minuti · ${testoSim}`, onClick: onStartExam, bloccato: simBloccata },
    { id: 'esercizi', titolo: 'Esercizi mirati', testo: 'Punti deboli, blitz, richiamo attivo', onClick: onStartLearn },
    { id: 'errori', titolo: 'Ripasso sugli errori', testo: 'Riparti da ciò che hai sbagliato', onClick: () => (pass ? onStartErrors() : onNeedPass('errori')), bloccato: !pass },
    { id: 'teoria', titolo: 'Teoria', testo: pass ? 'Tutti i 31 argomenti' : 'Una scheda gratis, le altre con il Pass', onClick: onOpenTheory, bloccato: !pass },
    { id: 'prontuario', titolo: 'Prontuario', testo: 'Le 24 regole e le trappole', onClick: onOpenCheatSheet },
    { id: 'livello', titolo: 'Verifica il livello', testo: '10 domande, 3 minuti', onClick: onOpenDiagnostic },
    { id: 'statistiche', titolo: 'Statistiche', testo: pass ? 'Argomenti, simulazioni, costanza' : 'Quelle complete con il Pass', onClick: onOpenStats, bloccato: !pass },
    ...(FEATURE_FLAGS.leaderboard ? [{ id: 'classifica', titolo: `Classifica ${ECOSYSTEM.rankingName}`, testo: 'Chi sa più regole', onClick: onOpenLeaderboard }] : []),
    ...(!pass ? [{ id: 'pass', titolo: 'Pass AddiOFA', testo: 'Tutto sbloccato, un solo pagamento', onClick: onOpenPaywall, evidenza: true }] : []),
  ];

  const icona = 'text-[#6B7280] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors p-1.5';

  return (
    <div className="h-full w-full bg-[#F6F8FC] dark:bg-[#0F172A] sm:rounded-[28px] sm:border sm:border-[#E5E7EB] dark:sm:border-[#334155] overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 pt-4 pb-6">
        <div className="mx-auto w-full max-w-[560px] flex flex-col gap-3.5">
          {/* intestazione */}
          <header className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={urlIcona} alt="" className="w-9 h-9 rounded-[10px] shrink-0" />
              <div className="text-[19px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-none">AddiOFA</div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              {onOpenDebug && <button onClick={onOpenDebug} className={icona} title="Debug (solo sviluppo)" aria-label="Debug"><Bug size={19} /></button>}
              <button onClick={() => { const n = !muted; setMuted(n); setAudioMuted(n); if (!n) playTapSound(); }} className={icona}
                title={muted ? 'Riattiva suoni' : 'Disattiva suoni'} aria-label={muted ? 'Riattiva suoni' : 'Disattiva suoni'}>
                {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
              </button>
              <button onClick={() => { playTapSound(); toggleTheme(); }} className={icona} title="Tema" aria-label={isDark ? 'Tema chiaro' : 'Tema scuro'}>{isDark ? <Sun size={19} /> : <Moon size={19} />}</button>
              {!pass && (
                <button onClick={() => { playTapSound(); onOpenPaywall(); }} className="brand-premibile ml-1 flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#2563EB] px-3 py-2 rounded-xl">
                  <KeyRound size={15} aria-hidden="true" /> Pass
                </button>
              )}
              {user ? (
                <button onClick={() => { playTapSound(); onOpenProfile?.(); }} className="ml-1 rounded-full ring-2 ring-[#E5E7EB] hover:ring-[#2563EB] transition-all" title={ECOSYSTEM.accountName}>
                  {user.photoURL
                    ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full" />
                    : <span className="w-9 h-9 rounded-full bg-[#DBEAFE] text-[#1D4ED8] dark:text-[#93C5FD] flex items-center justify-center font-semibold">{(user.displayName || '?')[0]}</span>}
                </button>
              ) : onLogin && (
                <button onClick={() => { playTapSound(); onLogin(); }} className="brand-premibile ml-1 flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#0F172A] px-3 py-2 rounded-xl">
                  <Fingerprint size={15} /> Accedi
                </button>
              )}
            </div>
          </header>

          {/* saluto: solo se l'utente è collegato */}
          {nome && <p className="px-1 text-[15px] text-[#6B7280] dark:text-[#94A3B8] -mb-1.5">Ciao, <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{nome}</span></p>}

          {stima && livello ? (
            <>
              {/* misuratore a tutta larghezza, con (i) che apre il foglio della stima */}
              <StimaSezione stima={stima} livello={livello} onInfo={() => setFoglio(true)} />

              {/* stato: tocco = pratica, oppure simulazione se la stima è alta */}
              <BannerStato chiave={chiaveBanner(stima, livello)} onClick={livello === 'alto' && !simBloccata ? onStartExam : onStartSmart} />

              {/* pulsante principale */}
              <Cta onClick={cta.azione} sotto={cta.sotto}>{cta.etichetta}</Cta>
            </>
          ) : (
            /* nessuna stima: niente misuratore finto, si invita al diagnostico */
            <ScopriCard haRisposte={haRisposte} onDiagnostico={onOpenDiagnostic} onStudia={onStartSmart} etichettaStudia="Oppure inizia a studiare" />
          )}

          {/* prossimo obiettivo: argomento più debole, o il primo da toccare */}
          {lezione && progresso && <ProssimoObiettivo lezione={lezione} progresso={progresso} onApri={apriLezione} onPercorso={onOpenTheory} />}

          {/* solo punti misurati: diagnostico e simulazioni */}
          {punti.length > 0 && <GraficoStime punti={punti} onSimulazione={faiSimulazione} />}

          {/* blocchi secondari, compatti */}
          {haRisposte && <Fattori categorie={fattori.categorie} livelli={fattori.livelli} onVai={onStartFocus} />}
          <ObiettivoCard ultima={ultima} bloccata={simBloccata} onVai={faiSimulazione} />
          <div className="grid grid-cols-2 gap-3 items-stretch">
            <SerieCard serie={appState.streak} giorni={giorni} />
            <ProgressiCard imparate={masteredQuestions} totale={totalQuestions} giorni={giorni} onVai={onOpenStats} />
          </div>

          {/* materiale */}
          {onSelectCorpus && (
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EEF1F6] dark:bg-[#1E293B]">
              {([['all', `Tutte le frasi (${questions.length})`], ['initial', `Nucleo (${INITIAL_CORPUS_COUNT})`]] as const).map(([id, testo]) => (
                <button key={id} onClick={() => { playTapSound(); onSelectCorpus(id); }}
                  className={cn('rounded-lg py-2 text-[13px] font-semibold transition-colors',
                    selectedCorpus === id ? 'bg-white dark:bg-[#334155] text-[#0F172A] dark:text-[#F8FAFC] shadow-sm' : 'text-[#6B7280]')}>
                  {testo}{id === 'all' && !pass && <Lock size={12} className="inline ml-1 -mt-0.5" aria-label="Richiede il Pass" />}
                </button>
              ))}
            </div>
          )}

          <Strumenti voci={voci} />

          {(onImport || onExport) && (
            <div className="flex justify-center gap-6 text-[12px] text-[#6B7280]">
              {onImport && <button onClick={() => { playTapSound(); onImport(); }} className="flex items-center gap-1.5 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"><Upload size={14} /> Importa progressi</button>}
              {onExport && <button onClick={() => { playTapSound(); onExport(); }} className="flex items-center gap-1.5 hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"><Download size={14} /> Esporta progressi</button>}
            </div>
          )}
          {FEATURE_FLAGS.projectId && provider.mode !== 'demo' && <PoweredByAtlas className="-mt-2" />}
          <Footer onOpenLegal={onOpenLegal} />
        </div>
      </div>
      {stima && <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo={stima.fonte === 'diagnostico' ? 'diagnostico' : 'simulazione'} risposte={stima.risposte} />}
      {onNaviga && <Navigazione attiva="home" onVai={onNaviga} />}
    </div>
  );
}
