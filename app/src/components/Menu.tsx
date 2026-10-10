import { useState } from 'react';
import { AppState, CorpusType } from '../types';
import { Volume2, VolumeX, Moon, Sun, Flame, Upload, Download, Bug, Fingerprint, ChevronRight } from 'lucide-react';
import { User } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { questions, getQuestionsByCorpus, INITIAL_CORPUS_COUNT } from '../data/questions';
import { playTapSound, isAudioMuted, setAudioMuted } from '../lib/audio';
import { ECOSYSTEM } from '../config/ecosystem';
import { DISCLAIMER } from '../config/offer';
import { PoweredByAtlas } from './ui';
import { IconaChip, NOMI_ICONE } from '../brand/componenti';
import { Illustrazione } from '../brand/Illustrazione';
import { FONT } from '../brand/tokens';
import Navigazione, { Scheda } from './Navigazione';
import { urlIcona } from '../brand/risorse';

interface MenuProps {
  appState: AppState;
  user: User | null;
  onStartSmart: () => void;
  onStartLearn: () => void;
  onStartExam: () => void;
  onOpenStats: () => void;
  onExport: () => void;
  onImport: () => void;
  onLogin: () => void;
  onLogout: () => void;
  onOpenDebug?: () => void;
  onSelectCorpus?: (corpus: CorpusType) => void;
  onOpenPlans?: () => void;
  onOpenCheatSheet?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenProfile?: () => void;
  onOpenLeaderboard?: () => void;
  onNaviga?: (s: Scheda) => void;
}

function Strumento({ icona, titolo, testo, onClick }: { icona: typeof NOMI_ICONE[number]; titolo: string; testo: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <button onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile flex items-center gap-3 text-left bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <IconaChip nome={icona} lato={44} />
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">{titolo}</span>
        <span className="block text-xs text-[#6B7280] dark:text-[#94A3B8] truncate">{testo}</span>
      </span>
    </button>
  );
}

export default function Menu({ appState, user, onStartSmart, onStartLearn, onStartExam, onOpenStats, onExport, onImport, onLogin, onOpenDebug, onSelectCorpus, onOpenPlans, onOpenCheatSheet, onOpenDiagnostic, onOpenProfile, onOpenLeaderboard, onNaviga }: MenuProps) {
  const { isDark, toggleTheme } = useTheme();
  const [muted, setMuted] = useState(isAudioMuted());

  const selectedCorpus: CorpusType = appState.selectedCorpus || 'all';
  const activeQuestions = getQuestionsByCorpus(selectedCorpus);
  const totalQuestions = activeQuestions.length;
  const masteredQuestions = activeQuestions.filter(q => (appState.stats[q.id]?.box ?? 0) > 0).length;
  const masteryPercent = totalQuestions > 0 ? Math.min(100, Math.round((masteredQuestions / totalQuestions) * 100)) : 0;
  let totalCorrect = 0, totalIncorrect = 0;
  activeQuestions.forEach(q => { const s = appState.stats[q.id]; if (s) { totalCorrect += s.correct; totalIncorrect += s.incorrect; } });
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracyPercent = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const nome = user?.displayName?.split(' ')[0];
  const probabilita = appState.onboarding?.passProbability;

  const icona = 'text-[#6B7280] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-[#F8FAFC] transition-colors p-1';

  return (
    <div className="h-full w-full bg-[#F6F8FC] dark:bg-[#0F172A] sm:rounded-[28px] sm:border sm:border-[#E5E7EB] dark:sm:border-[#334155] overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 sm:px-6 pt-4 pb-5 flex flex-col gap-4">
        {/* intestazione */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={urlIcona} alt="" className="w-9 h-9 rounded-[10px]" />
            <div className="leading-tight">
              <div className="text-[17px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">AddiOFA</div>
              <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">OFA di Inglese</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onOpenDebug && <button onClick={onOpenDebug} className={icona} title="Debug (solo sviluppo)"><Bug size={20} /></button>}
            <button onClick={() => { const n = !muted; setMuted(n); setAudioMuted(n); if (!n) playTapSound(); }} className={icona} title={muted ? 'Riattiva suoni' : 'Disattiva suoni'}>
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button onClick={() => { playTapSound(); toggleTheme(); }} className={icona} title="Tema">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <span className="flex items-center gap-1 text-[#F59E0B] font-semibold text-sm px-2" title="Giorni di fila"><Flame size={17} fill="currentColor" />{appState.streak}</span>
            {user ? (
              <button onClick={() => { playTapSound(); onOpenProfile?.(); }} className="rounded-full ring-2 ring-[#E5E7EB] hover:ring-[#EF4444] transition-all" title={ECOSYSTEM.accountName}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="w-9 h-9 rounded-full" />
                  : <span className="w-9 h-9 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center justify-center font-semibold">{(user.displayName || '?')[0]}</span>}
              </button>
            ) : (
              <button onClick={() => { playTapSound(); onLogin(); }} className="brand-premibile flex items-center gap-1.5 text-[13px] font-semibold text-white bg-[#0F172A] px-3 py-2 rounded-xl">
                <Fingerprint size={15} /> Accedi
              </button>
            )}
          </div>
        </header>

        {/* saluto */}
        <section className="flex items-center gap-3">
          <div className="flex-1">
            <h1 className="text-[26px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">{nome ? `Ciao, ${nome}` : 'Ciao!'}</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1">Continua la tua preparazione per superare l'OFA.</p>
          </div>
          <Illustrazione kit="kit-rosso" nome="studio-inglese" lato={112} fondoScuro={isDark} />
        </section>

        {/* inizia */}
        <button onClick={() => { playTapSound(); onStartSmart(); }}
          className="brand-premibile w-full flex items-center gap-4 rounded-2xl bg-[#EF4444] text-white px-5 py-4 text-left shadow-[0_6px_16px_rgba(239,68,68,0.28)]">
          <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0">
            <svg width="16" height="18" viewBox="0 0 16 18"><path d="M2 1.5 14 9 2 16.5Z" fill="#EF4444" /></svg>
          </span>
          <span className="flex-1">
            <span className="block text-[17px] font-bold">Continua a studiare</span>
            <span className="block text-[13px] text-white/85">
              {selectedCorpus === 'initial' ? `Primo Corpus · ${INITIAL_CORPUS_COUNT} frasi` : `Sessione di 10 domande · ${questions.length} nel banco`}
            </span>
          </span>
          <ChevronRight size={20} />
        </button>

        {/* progressi */}
        <section className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl p-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-[#94A3B8]">Domande imparate</div>
            <div className="text-[26px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">{masteryPercent}%</div>
            <div className="h-2 rounded-full bg-[#EEF1F6] dark:bg-[#334155] overflow-hidden mt-1.5">
              <div className="h-full rounded-full bg-[#22C55E] transition-all duration-700" style={{ width: `${masteryPercent}%` }} />
            </div>
            <div className="text-[11px] text-[#6B7280] mt-1">{masteredQuestions} su {totalQuestions}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-[#6B7280] dark:text-[#94A3B8]">Accuratezza</div>
            <div className="text-[26px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">{accuracyPercent}%</div>
            <div className="h-2 rounded-full bg-[#EEF1F6] dark:bg-[#334155] overflow-hidden mt-1.5">
              <div className="h-full rounded-full bg-[#8B5CF6] transition-all duration-700" style={{ width: `${accuracyPercent}%` }} />
            </div>
            <div className="text-[11px] text-[#6B7280] mt-1">{totalAttempts} risposte date</div>
          </div>
          {probabilita !== undefined && (
            <button onClick={() => { playTapSound(); onOpenDiagnostic?.(); }} className="col-span-2 flex items-center justify-between text-left bg-[#F6F8FC] dark:bg-[#0F172A] rounded-xl px-3 py-2">
              <span className="text-xs text-[#6B7280]">Probabilità stimata di superare il test</span>
              <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">{Math.round(probabilita * 100)}%</span>
            </button>
          )}
        </section>

        {/* materiale */}
        {onSelectCorpus && (
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#EEF1F6] dark:bg-[#1E293B]">
            {([['all', `Tutte le frasi (${questions.length})`], ['initial', `Primo Corpus (${INITIAL_CORPUS_COUNT})`]] as const).map(([id, testo]) => (
              <button key={id} onClick={() => { playTapSound(); onSelectCorpus(id); }}
                className={cn('rounded-lg py-2 text-[13px] font-semibold transition-colors',
                  selectedCorpus === id ? 'bg-white dark:bg-[#334155] text-[#0F172A] dark:text-[#F8FAFC] shadow-sm' : 'text-[#6B7280]')}>
                {testo}
              </button>
            ))}
          </div>
        )}

        {/* strumenti */}
        <section className="flex flex-col gap-2.5">
          <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">Strumenti</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Strumento icona="quiz" titolo="Simulazione d'esame" testo="30 domande, 15 minuti" onClick={onStartExam} />
            <Strumento icona="studio" titolo="Esercizi mirati" testo="Punti deboli, blitz, richiamo attivo" onClick={onStartLearn} />
            <Strumento icona="contenuti" titolo="Prontuario" testo="Le 24 regole e le trappole" onClick={onOpenCheatSheet} />
            <Strumento icona="completato" titolo="Verifica il livello" testo="10 domande, 3 minuti" onClick={onOpenDiagnostic} />
            <Strumento icona="statistiche" titolo="Statistiche" testo="Argomenti, simulazioni, costanza" onClick={onOpenStats} />
            <Strumento icona="successo" titolo={`Classifica ${ECOSYSTEM.rankingName}`} testo="Chi sa più regole" onClick={onOpenLeaderboard} />
            <Strumento icona="costo" titolo="Piani" testo="Simulatore, CRAM Pass, garanzia" onClick={onOpenPlans} />
          </div>
        </section>

        <div className="flex justify-center gap-6 text-[12px] text-[#6B7280]">
          <button onClick={() => { playTapSound(); onImport(); }} className="flex items-center gap-1.5 hover:text-[#0F172A]"><Upload size={14} /> Importa progressi</button>
          <button onClick={() => { playTapSound(); onExport(); }} className="flex items-center gap-1.5 hover:text-[#0F172A]"><Download size={14} /> Esporta progressi</button>
        </div>
        <p className="text-center text-[10px] text-[#9CA3AF]">{DISCLAIMER}</p>
        <PoweredByAtlas className="-mt-2" />
      </div>
      {onNaviga && <Navigazione attiva="home" onVai={onNaviga} />}
    </div>
  );
}
