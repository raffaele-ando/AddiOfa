import { useState } from 'react';
import { AppState, CorpusType } from '../types';
import { BookOpen, GraduationCap, Download, Flame, Award, BarChart2, Upload, Cloud, Moon, Sun, Crown, Gift, CheckCircle, Bug, Volume2, VolumeX, Layers, BookmarkCheck } from 'lucide-react';
import { User } from 'firebase/auth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';
import { questions, getQuestionsByCorpus, INITIAL_CORPUS_COUNT } from '../data/questions';
import { playTapSound, isAudioMuted, setAudioMuted } from '../lib/audio';
import { ClipboardCheck, ScrollText, Sparkles, Trophy, Fingerprint } from 'lucide-react';
import { ECOSYSTEM } from '../config/ecosystem';
import { PoweredByAtlas } from './ui';
import { DISCLAIMER } from '../config/offer';

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
}

export default function Menu({ appState, user, onStartSmart, onStartLearn, onStartExam, onOpenStats, onExport, onImport, onLogin, onLogout, onOpenDebug, onSelectCorpus, onOpenPlans, onOpenCheatSheet, onOpenDiagnostic, onOpenProfile, onOpenLeaderboard }: MenuProps) {
  const { isDark, toggleTheme } = useTheme();
  const [muted, setMuted] = useState(isAudioMuted());

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    setAudioMuted(next);
    if (!next) {
      playTapSound();
    }
  };

  const selectedCorpus: CorpusType = appState.selectedCorpus || 'all';
  const activeQuestions = getQuestionsByCorpus(selectedCorpus);
  const totalQuestions = activeQuestions.length;
  const masteredQuestions = activeQuestions.filter(q => (appState.stats[q.id]?.box ?? 0) > 0).length;
  const masteryPercent = totalQuestions > 0 ? Math.min(100, Math.round((masteredQuestions / totalQuestions) * 100)) : 0;

  let totalCorrect = 0;
  let totalIncorrect = 0;
  activeQuestions.forEach(q => {
    const stat = appState.stats[q.id];
    if (stat) {
      totalCorrect += stat.correct;
      totalIncorrect += stat.incorrect;
    }
  });
  const totalAttempts = totalCorrect + totalIncorrect;
  const accuracyPercent = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <div className="flex flex-col h-full p-4 sm:p-6 gap-3 sm:gap-4 overflow-y-auto scrollbar-hide">
        {/* Header */}
        <header className="flex justify-between items-center shrink-0">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">AddiOFA</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenDebug && (
              <button 
                onClick={() => { playTapSound(); onOpenDebug(); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title="Debug Firebase (solo sviluppo)"
              >
                <Bug size={24} strokeWidth={2.5} />
              </button>
            )}
            <button 
              onClick={handleToggleMute}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={muted ? 'Riattiva suoni' : 'Disattiva suoni'}
            >
              {muted ? <VolumeX size={24} strokeWidth={2.5} /> : <Volume2 size={24} strokeWidth={2.5} className="text-[#3B82F6]" />}
            </button>
            <button 
              onClick={() => { playTapSound(); toggleTheme(); }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isDark ? <Sun size={24} strokeWidth={2.5} /> : <Moon size={24} strokeWidth={2.5} />}
            </button>
            <div className="flex items-center gap-1.5 text-[#F59E0B] font-black border-2 border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] px-2 sm:px-3 py-1 rounded-xl shadow-sm transition-colors text-sm sm:text-base">
              <Flame size={18} fill="currentColor" />
              <span>{appState.streak}</span>
            </div>
            {user ? (
              <button
                onClick={() => { playTapSound(); onOpenProfile?.(); }}
                className="rounded-full ring-2 ring-[#3B82F6]/40 hover:ring-[#3B82F6] transition-all"
                title={`${ECOSYSTEM.accountName}: ${user.displayName ?? ''}`}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={ECOSYSTEM.accountName} referrerPolicy="no-referrer" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center font-black text-sm">
                    {(user.displayName || '?').charAt(0).toUpperCase()}
                  </span>
                )}
              </button>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <button onClick={() => { playTapSound(); onLogin(); }} className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-widest bg-[#3B82F6] hover:bg-[#2563EB] border-b-2 border-[#2563EB] active:border-b-0 active:translate-y-0.5 px-3 py-1.5 rounded-xl transition-all shadow-sm">
                  <Fingerprint size={16} /> {ECOSYSTEM.accountName}
                </button>
              </div>
            )}
          </div>
        </header>

        {!user && window.self !== window.top && (
          <div className="bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 border-2 border-[#EF4444] dark:border-[#EF4444] rounded-xl p-2 sm:p-3 text-xs sm:text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5] flex items-center justify-center text-center shadow-sm shrink-0">
            ⚠️ Per fare il login con Google, apri l'app in una nuova scheda (clicca l'icona "Open in new tab" in alto a destra).
          </div>
        )}

        {/* Account collegato */}
        {user && (
          <div className="flex justify-end shrink-0 -mt-1 sm:-mt-2">
            <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1"><Cloud size={14} /> {ECOSYSTEM.accountName} · {user.displayName}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:gap-4 flex-1">
          {/* Corpus Switcher */}
          {onSelectCorpus && (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-[#0F172A] p-1.5 rounded-2xl border-2 border-gray-200 dark:border-[#334155] shrink-0">
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectCorpus('all'); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5",
                  selectedCorpus !== 'initial'
                    ? "bg-white dark:bg-[#1E293B] text-[#3B82F6] shadow-xs border border-gray-200/50 dark:border-[#334155]"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <Layers size={15} />
                <span>Tutte le frasi ({questions.length})</span>
              </button>
              <button
                type="button"
                onClick={() => { playTapSound(); onSelectCorpus('initial'); }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5",
                  selectedCorpus === 'initial'
                    ? "bg-white dark:bg-[#1E293B] text-[#22C55E] shadow-xs border border-gray-200/50 dark:border-[#334155]"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <BookmarkCheck size={15} />
                <span>Primo Corpus ({INITIAL_CORPUS_COUNT})</span>
              </button>
            </div>
          )}

          {/* Top Stats Row: Domande Imparate & Accuratezza */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            {/* Domande Imparate */}
            <div className="bg-white dark:bg-[#0F172A] rounded-[24px] p-4 sm:p-5 border-2 border-gray-200 dark:border-[#334155] border-b-4 flex flex-col justify-center gap-3 shadow-sm transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Imparate {selectedCorpus === 'initial' ? `(su ${INITIAL_CORPUS_COUNT})` : ''}
                </span>
                <span className="text-lg sm:text-xl font-black text-[#22C55E]">{masteryPercent}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden flex relative">
                <div 
                  className="bg-[#22C55E] h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${masteryPercent}%` }} 
                />
              </div>
            </div>

            {/* Accuratezza */}
            <div className="bg-white dark:bg-[#0F172A] rounded-[24px] p-4 sm:p-5 border-2 border-gray-200 dark:border-[#334155] border-b-4 flex flex-col justify-center gap-3 shadow-sm transition-colors">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider">Accuratezza</span>
                <span className="text-lg sm:text-xl font-black text-[#8B5CF6] dark:text-[#A78BFA]">{accuracyPercent}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden flex relative">
                <div 
                  className="bg-[#8B5CF6] dark:bg-[#A78BFA] h-full rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${accuracyPercent}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 shrink-0 mt-auto pt-2">
            <button
              onClick={() => { playTapSound(); onStartSmart(); }}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] border-b-4 border-[#2563EB] active:border-b-0 active:translate-y-1 text-white font-black p-6 sm:p-8 rounded-[20px] sm:rounded-2xl shadow-sm flex flex-col items-center justify-center transition-all duration-200"
            >
              <span className="text-2xl sm:text-3xl leading-tight uppercase tracking-widest mb-2">Inizia Sessione</span>
              <span className="text-[#DBEAFE] text-xs sm:text-sm uppercase font-bold tracking-widest bg-black/10 px-4 py-1.5 rounded-full">
                {selectedCorpus === 'initial' ? `Primo Corpus (${INITIAL_CORPUS_COUNT} frasi)` : `Algoritmo Ottimizzato (${questions.length})`}
              </span>
            </button>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => { playTapSound(); onStartLearn(); }}
                className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] border-b-4 text-gray-400 dark:text-gray-500 font-black p-3 sm:p-4 rounded-[20px] sm:rounded-2xl shadow-sm flex flex-col items-center justify-center active:border-b-0 active:translate-y-1 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-500 dark:hover:text-gray-400"
              >
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 mb-2 text-[#8B5CF6] dark:text-[#A78BFA]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-center">Modalità mirate</span>
              </button>

              <button
                onClick={() => { playTapSound(); onStartExam(); }}
                className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] border-b-4 text-gray-400 dark:text-gray-500 font-black p-3 sm:p-4 rounded-[20px] sm:rounded-2xl shadow-sm flex flex-col items-center justify-center active:border-b-0 active:translate-y-1 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:text-gray-500 dark:hover:text-gray-400"
              >
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 mb-2 text-[#F59E0B]" />
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-center">Simulazione Esame</span>
              </button>
            </div>
          </div>
        </div>

        {/* Verifica, prontuario e piani */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
          {[
            { label: 'Verifica livello', icon: ClipboardCheck, onClick: onOpenDiagnostic, color: 'text-[#EF4444]' },
            { label: 'Prontuario', icon: ScrollText, onClick: onOpenCheatSheet, color: 'text-[#8B5CF6]' },
            { label: 'Piani', icon: Sparkles, onClick: onOpenPlans, color: 'text-[#F59E0B]' },
            { label: `Classifica ${ECOSYSTEM.rankingName}`, icon: Trophy, onClick: onOpenLeaderboard, color: 'text-[#22C55E]' },
          ].filter(item => item.onClick).map(({ label, icon: Icon, onClick, color }) => (
            <button
              key={label}
              onClick={() => { playTapSound(); onClick!(); }}
              className="flex items-center justify-center gap-1.5 bg-gray-50 dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl py-2.5 px-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1E293B] transition-colors"
            >
              <Icon size={16} className={color} />
              {label}
            </button>
          ))}
        </div>

        {/* Bottom Nav / Extra Actions */}
        <div className="grid grid-cols-3 gap-2 border-t-2 border-gray-200 dark:border-[#334155] pt-3 sm:pt-4 shrink-0 transition-colors">
          <button 
            onClick={() => { playTapSound(); onOpenStats(); }}
            className="flex flex-col items-center gap-1 sm:gap-2 text-gray-400 dark:text-gray-500 font-black uppercase text-xs sm:text-sm hover:text-[#22C55E] dark:hover:text-[#22C55E] transition-colors"
          >
            <BarChart2 size={24} strokeWidth={2.5} />
            Statistiche
          </button>
          <button 
            onClick={() => { playTapSound(); onImport(); }}
            className="flex flex-col items-center gap-1 sm:gap-2 text-gray-400 dark:text-gray-500 font-black uppercase text-xs sm:text-sm hover:text-[#3B82F6] dark:hover:text-[#60A5FA] transition-colors"
          >
            <Upload size={24} strokeWidth={2.5} />
            Importa
          </button>
          <button 
            onClick={() => { playTapSound(); onExport(); }}
            className="flex flex-col items-center gap-1 sm:gap-2 text-gray-400 dark:text-gray-500 font-black uppercase text-xs sm:text-sm hover:text-[#8B5CF6] dark:hover:text-[#A78BFA] transition-colors"
          >
            <Download size={24} strokeWidth={2.5} />
            Esporta
          </button>
        </div>
        <p className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 shrink-0 -mt-1">{DISCLAIMER}</p>
        <PoweredByAtlas className="shrink-0 -mt-2" />
      </div>
    </div>
  );
}
