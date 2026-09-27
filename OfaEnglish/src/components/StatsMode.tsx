import { useState, useMemo } from 'react';
import { AppState } from '../types';
import { questions, getQuestionsByCorpus, INITIAL_CORPUS_COUNT } from '../data/questions';
import { X, Trophy, TrendingUp, AlertCircle, Clock, Target, List, ArrowLeft, Activity, Filter, ArrowDownUp, ArrowUp, ArrowDown, Minus, Crown, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { confidenceFromEasiness } from '../lib/spacedRepetition';
import GuaranteeTracker from './GuaranteeTracker';
import { PoweredByAtlas } from './ui';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface StatsModeProps {
  appState: AppState;
  onExit: () => void;
}

export default function StatsMode({ appState, onExit }: StatsModeProps) {
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Compute stats
  // Stesso materiale del menu: con il Primo Corpus la percentuale è calcolata su quelle domande
  const activeQuestions = getQuestionsByCorpus(appState.selectedCorpus || 'all');
  const totalQuestions = activeQuestions.length;
  const masteredQuestions = activeQuestions.filter(q => (appState.stats[q.id]?.box ?? 0) > 0).length;
  const masteryPercentage = Math.round((masteredQuestions / totalQuestions) * 100) || 0;
  
  const examsTaken = appState.history.length;
  const passedExams = appState.history.filter(h => h.passed).length;
  const passRate = examsTaken > 0 ? Math.round((passedExams / examsTaken) * 100) : 0;
  
  const bestScore = Math.max(0, ...appState.history.map(h => h.score));

  let totalCorrect = 0;
  let totalIncorrect = 0;
  Object.values(appState.stats).forEach(stat => {
    totalCorrect += stat.correct;
    totalIncorrect += stat.incorrect;
  });
  const globalAccuracy = (totalCorrect + totalIncorrect) > 0 
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
    : 0;

  const topicStats = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    questions.forEach(q => {
      if (q.grammarTopic) {
        const stat = appState.stats[q.id];
        if (stat) {
          if (!stats[q.grammarTopic]) {
            stats[q.grammarTopic] = { correct: 0, total: 0 };
          }
          stats[q.grammarTopic].correct += stat.correct;
          stats[q.grammarTopic].total += stat.correct + stat.incorrect;
        }
      }
    });
    return stats;
  }, [appState.stats]);

  // Find most frequent errors
  const errorRates = Object.keys(appState.stats)
    .map(qId => {
      const stat = appState.stats[qId];
      const correct = stat.correct || 0;
      const incorrect = stat.incorrect || 0;
      const omitted = stat.omitted || 0;
      const totalAttempts = correct + incorrect + omitted;
      const errorRate = totalAttempts > 0 ? (incorrect + omitted) / totalAttempts : 0;
      return { qId, errorRate, incorrect, correct, omitted, box: stat.box, easiness: stat.easiness || 2.5 };
    })
    .filter(item => item.incorrect > 0 || item.omitted > 0)
    .sort((a, b) => (b.errorRate - a.errorRate) || (b.incorrect - a.incorrect));

  const topErrors = errorRates.slice(0, 5); // top 5 hardest questions

  // Prepare Daily Activity Data for Chart (last 7 days)
  const activityData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = d.toLocaleDateString('it-IT', { weekday: 'short' });
      data.push({
        name: displayStr,
        domande: appState.dailyActivity?.[dateStr] || 0,
        minuti: Math.round((appState.dailyTimeSpent?.[dateStr] || 0) / 60)
      });
    }
    return data;
  }, [appState.dailyActivity, appState.dailyTimeSpent]);

  const levelStatsData = useMemo(() => {
    const stats: Record<string, { imparate: number; total: number }> = {};
    questions.forEach(q => {
      const level = q.level || 'Varie';
      if (!stats[level]) {
        stats[level] = { imparate: 0, total: 0 };
      }
      stats[level].total += 1;
      const stat = appState.stats[q.id];
      if (stat && stat.box > 0) {
        stats[level].imparate += 1;
      }
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      imparate: data.imparate,
      daImparare: data.total - data.imparate,
      total: data.total
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [appState.stats]);

  const topicStatsData = useMemo(() => {
    const stats: Record<string, { imparate: number; total: number }> = {};
    questions.forEach(q => {
      const topic = q.grammarTopic || 'Altro';
      if (!stats[topic]) {
        stats[topic] = { imparate: 0, total: 0 };
      }
      stats[topic].total += 1;
      const stat = appState.stats[q.id];
      if (stat && stat.box > 0) {
        stats[topic].imparate += 1;
      }
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      imparate: data.imparate,
      daImparare: data.total - data.imparate,
      total: data.total
    })).sort((a, b) => b.total - a.total);
  }, [appState.stats]);

  const categories = useMemo(() => Array.from(new Set(questions.map(q => q.category))), []);

  // Endowed Progress Effect: Give users a 50 XP head start so they feel invested immediately.
  const totalXP = 50 + Object.values(appState.stats).reduce((sum, stat) => sum + stat.correct, 0) * 10;
  const currentLevel = Math.floor(Math.sqrt(totalXP / 50)) + 1;
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 50;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 50;
  const progressPercent = Math.min(100, Math.max(0, ((totalXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100));

  // Endless Daily Quest
  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivity = appState.dailyActivity?.[todayStr] || 0;
  const endowedDaily = 1; // 1 free progress step every day just for opening the app
  const currentTotalDaily = todayActivity + endowedDaily;
  
  const milestones = [10, 25, 50, 100, 150, 250, 400, 600, 1000, 99999];
  let milestoneIndex = 0;
  while (milestoneIndex < milestones.length - 1 && currentTotalDaily >= milestones[milestoneIndex]) {
    milestoneIndex++;
  }
  const currentMilestone = milestones[milestoneIndex];
  const previousMilestone = milestoneIndex === 0 ? 0 : milestones[milestoneIndex - 1];
  const currentPhaseProgress = currentTotalDaily - previousMilestone;
  const currentPhaseGoal = currentMilestone - previousMilestone;
  const phaseProgressPercent = Math.min(100, (currentPhaseProgress / currentPhaseGoal) * 100);

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions;
    if (filterCategory === 'corpus:initial') {
      filtered = getQuestionsByCorpus('initial');
    } else if (filterCategory !== 'all') {
      filtered = filtered.filter(q => q.category === filterCategory);
    }
    
    return [...filtered].sort((a, b) => {
      const statA = appState.stats[a.id];
      const statB = appState.stats[b.id];
      
      const confA = statA ? confidenceFromEasiness(statA.easiness) : -1;
      const confB = statB ? confidenceFromEasiness(statB.easiness) : -1;

      if (sortOrder === 'asc') {
        return confA - confB;
      } else {
        return confB - confA;
      }
    });
  }, [filterCategory, sortOrder, appState.stats]);

  if (showDetailedStats) {
    return (
      <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-[#334155] shrink-0 transition-colors">
          <button onClick={() => setShowDetailedStats(false)} className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft size={20} />
            Indietro
          </button>
          <div className="flex flex-col items-end">
            <h2 className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-widest leading-tight">Dettaglio Frasi</h2>
            <span className="text-xs font-bold text-gray-400">{filteredAndSortedQuestions.length} frasi totali</span>
          </div>
        </header>
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 dark:border-[#334155] shrink-0 transition-colors bg-gray-50 dark:bg-[#0F172A]">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] focus:ring-0 cursor-pointer"
            >
              <option value="all">Tutte le categorie</option>
              <option value="corpus:initial">⭐ Primo Corpus ({INITIAL_CORPUS_COUNT} frasi)</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#2563EB] transition-colors"
          >
            <ArrowDownUp size={16} />
            {sortOrder === 'asc' ? 'Peggiori prima' : 'Migliori prima'}
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {filteredAndSortedQuestions.map((q, index) => {
            const stat = appState.stats[q.id];
            const hasSeen = !!stat;
            const correctCount = stat?.correct || 0;
            const incorrectCount = stat?.incorrect || 0;
            const omittedCount = stat?.omitted || 0;
            const totalAttempts = correctCount + incorrectCount + omittedCount;
            const accuracy = (correctCount + incorrectCount) > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
            const confidenceScore = hasSeen ? confidenceFromEasiness(stat.easiness) : 0;
            const previousEasiness = stat?.previousEasiness ?? stat?.easiness;
            let trend = 'same';
            if (stat && stat.easiness !== undefined && previousEasiness !== undefined) {
              if (stat.easiness > previousEasiness) trend = 'up';
              if (stat.easiness < previousEasiness) trend = 'down';
            }

            return (
              <div key={q.id} className="bg-gray-50 dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 flex gap-3 sm:gap-4 items-start">
                  <span className="text-gray-400 dark:text-gray-500 font-black text-sm sm:text-base mt-0.5 shrink-0 w-6 sm:w-8 text-right">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="font-bold text-[#1E293B] dark:text-[#F8FAFC] text-sm sm:text-base mb-1">{q.prompt}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2 flex-wrap">
                      <span>{q.category}</span>
                      {q.level && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span className="bg-[#3B82F6]/10 text-[#3B82F6] px-1.5 py-0.5 rounded">{q.level}</span>
                        </>
                      )}
                      {q.grammarTopic && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                          <span>{q.grammarTopic}</span>
                        </>
                      )}
                    </p>

                    {/* Breakdown: Giuste, Sbagliate, Omesse + Telemetria Cognitiva */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors",
                        correctCount > 0 
                          ? "bg-[#DCFCE7] dark:bg-[#059669]/20 text-[#16A34A] dark:text-[#34D399] border-[#22C55E]/30" 
                          : "bg-white dark:bg-[#1E293B] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                      )}>
                        <Check size={12} strokeWidth={3} />
                        {correctCount} {correctCount === 1 ? 'giusta' : 'giuste'}
                      </span>

                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors",
                        incorrectCount > 0 
                          ? "bg-[#FEE2E2] dark:bg-[#7F1D1D]/30 text-[#B91C1C] dark:text-[#FCA5A5] border-[#EF4444]/30" 
                          : "bg-white dark:bg-[#1E293B] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                      )}>
                        <X size={12} strokeWidth={3} />
                        {incorrectCount} {incorrectCount === 1 ? 'sbagliata' : 'sbagliate'}
                      </span>

                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors",
                        omittedCount > 0 
                          ? "bg-[#FFF4E5] dark:bg-[#F59E0B]/20 text-[#D97706] dark:text-[#FBBF24] border-[#F59E0B]/30" 
                          : "bg-white dark:bg-[#1E293B] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                      )}>
                        <Minus size={12} strokeWidth={3} />
                        {omittedCount} {omittedCount === 1 ? 'omessa' : 'omesse'}
                      </span>

                      {stat?.lastSwitchCount !== undefined && stat.lastSwitchCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                          {stat.lastSwitchCount} {stat.lastSwitchCount === 1 ? 'cambio' : 'cambi'}
                        </span>
                      )}

                      {stat?.lastResponseTimeMs !== undefined && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                          <Clock size={11} /> {(stat.lastResponseTimeMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 items-center sm:items-end w-full sm:w-auto shrink-0">
                  {hasSeen ? (
                    <>
                      <div className="flex flex-col items-center sm:items-end">
                        <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Accuratezza</span>
                        <span className={cn("text-sm sm:text-base font-black", accuracy > 70 ? "text-[#22C55E]" : accuracy > 40 ? "text-[#F59E0B]" : "text-[#EF4444]")}>
                          {accuracy}%
                        </span>
                      </div>
                      <div className="flex flex-col items-center sm:items-end w-full sm:w-24">
                        <div className="flex justify-between w-full mb-1 items-center">
                          <span className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            Confidenza
                            {trend === 'up' && <ArrowUp size={12} className="text-[#22C55E]" />}
                            {trend === 'down' && <ArrowDown size={12} className="text-[#EF4444]" />}
                            {trend === 'same' && <Minus size={12} className="text-gray-400" />}
                          </span>
                          <span className="text-[10px] sm:text-xs font-black text-[#3B82F6]">{confidenceScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-[#334155] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#3B82F6] h-full transition-all" style={{ width: `${confidenceScore}%` }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-gray-400 dark:text-gray-500 px-3 py-1 bg-gray-200 dark:bg-[#334155] rounded-full uppercase tracking-wider">
                      Mai vista
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <div className="flex flex-col h-full p-2 sm:p-4">
      <header className="flex items-center justify-between p-2 border-b-2 border-gray-200 dark:border-[#334155] shrink-0 transition-colors">
        <h2 className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-widest">Statistiche</h2>
        <button onClick={onExit} className="p-1 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155] rounded-full transition-colors">
          <X size={18} className="sm:w-5 sm:h-5" strokeWidth={3} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6 flex flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Left Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-[#EFF6FF] dark:bg-[#3B82F6]/10 border-2 border-[#93C5FD] dark:border-[#2563EB] rounded-[24px] p-4 sm:p-5 flex flex-col items-center text-center transition-colors">
              <Trophy className="text-[#3B82F6] dark:text-[#60A5FA] mb-2 sm:mb-3 w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-[#3B82F6] dark:text-[#60A5FA] leading-none mb-1">{masteryPercentage}%</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#2563EB] dark:text-[#2563EB] uppercase tracking-widest mt-1">Domande Imparate</span>
            </div>
            <div className="bg-[#DCFCE7] dark:bg-[#059669]/10 border-2 border-[#22C55E] dark:border-[#059669] rounded-[24px] p-4 sm:p-5 flex flex-col items-center text-center transition-colors">
              <Target className="text-[#22C55E] dark:text-[#10B981] mb-2 sm:mb-3 w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-[#16A34A] dark:text-[#34D399] leading-none mb-1">{globalAccuracy}%</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#16A34A] dark:text-[#059669] uppercase tracking-widest mt-1">Accuratezza</span>
            </div>
            <div className="bg-[#FFF4E5] dark:bg-[#F59E0B]/10 border-2 border-[#F59E0B] dark:border-[#D97706] rounded-[24px] p-4 sm:p-5 flex flex-col items-center text-center transition-colors">
              <TrendingUp className="text-[#F59E0B] dark:text-[#FBBF24] mb-2 sm:mb-3 w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-[#D97706] dark:text-[#F59E0B] leading-none mb-1">{passRate}%</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#D97706] dark:text-[#D97706] uppercase tracking-widest mt-1">Superate</span>
            </div>
            <div className="bg-[#EDE9FE] dark:bg-[#A78BFA]/10 border-2 border-[#8B5CF6] dark:border-[#7C3AED] rounded-[24px] p-4 sm:p-5 flex flex-col items-center text-center transition-colors">
              <Trophy className="text-[#8B5CF6] dark:text-[#C4B5FD] mb-2 sm:mb-3 w-8 h-8 sm:w-10 sm:h-10 shrink-0" />
              <span className="text-2xl sm:text-3xl font-black text-[#7C3AED] dark:text-[#C4B5FD] leading-none mb-1">{bestScore}/30</span>
              <span className="text-[10px] sm:text-xs font-bold text-[#7C3AED] dark:text-[#7C3AED] uppercase tracking-widest mt-1">Record</span>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col min-h-[250px]">
             <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-4 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <Activity className="text-[#F59E0B] dark:text-[#FBBF24] w-5 h-5" />
              Costanza (Ultimi 7 Giorni)
            </h3>
            <div className="flex-1 min-h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} allowDecimals={false} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB', fontWeight: 'bold', color: '#0F172A' }}
                  />
                  <Bar dataKey="domande" name="Domande" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="minuti" name="Minuti" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Exam Stats */}
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col justify-center">
            <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-3 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <Clock className="text-[#8B5CF6] dark:text-[#A78BFA] w-5 h-5" />
              Simulazioni
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#334155]">
                <span className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400">Esami completati</span>
                <span className="text-base sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">{examsTaken}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-[#334155]">
                <span className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400">Esami superati</span>
                <span className="text-base sm:text-lg font-black text-[#22C55E] dark:text-[#10B981]">{passedExams}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400">Miglior punteggio</span>
                <span className="text-base sm:text-lg font-black text-[#F59E0B] dark:text-[#FBBF24]">{examsTaken > 0 ? `${bestScore}/30` : '-'}</span>
              </div>
            </div>
          </div>

          <GuaranteeTracker appState={appState} />
          <PoweredByAtlas />

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4 sm:gap-6">
          
          {/* Go to detailed view button */}
          <button 
            onClick={() => setShowDetailedStats(true)}
            className="w-full bg-[#3B82F6] hover:bg-[#2563EB] border-b-4 border-[#2563EB] active:border-b-0 active:translate-y-1 text-white font-black text-sm sm:text-base py-3 sm:py-4 px-4 rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <List className="w-5 h-5" />
            Vedi Dettaglio Frasi
          </button>

          {Object.keys(topicStats).length >= 3 ? (
            <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col h-full min-h-[300px]">
              <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-4 uppercase tracking-widest flex items-center gap-2 shrink-0">
                <Target className="text-[#3B82F6] dark:text-[#60A5FA] w-5 h-5" />
                Skill Profile
              </h3>
              
              <div className="flex-1 min-h-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="70%" 
                    data={Object.entries(topicStats).map(([cat, stats]: [string, { correct: number; total: number }]) => ({
                      subject: cat,
                      A: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
                      fullMark: 100,
                    }))}
                  >
                    <PolarGrid stroke="#e5e7eb" className="dark:stroke-[#334155]" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={false} 
                      axisLine={false}
                    />
                    <Radar
                      name="Padronanza"
                      dataKey="A"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.5}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '2px solid #E5E7EB',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        backgroundColor: '#fff',
                        color: '#0F172A',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#3B82F6', fontWeight: '900' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-6 transition-colors flex-1 flex flex-col justify-center items-center text-center min-h-[300px]">
              <AlertCircle className="text-[#EF4444] dark:text-[#F87171] w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm font-bold text-gray-400">Rispondi a più domande su diversi argomenti per vedere il tuo profilo per argomento.</p>
            </div>
          )}

          {/* Progresso per Livello */}
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col min-h-[250px]">
             <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-4 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <TrendingUp className="text-[#F59E0B] dark:text-[#FBBF24] w-5 h-5" />
              Progresso per Livello
            </h3>
            <div className="flex-1 min-h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelStatsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-[#334155]" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB', fontWeight: 'bold', color: '#0F172A' }}
                    formatter={(value: number, name: string) => [value, name === 'daImparare' ? 'Da Imparare' : name]}
                  />
                  <Bar dataKey="imparate" name="Imparate" stackId="a" fill="#22C55E" radius={[0, 0, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="daImparare" name="Da Imparare" stackId="a" fill="#E5E7EB" radius={[0, 4, 4, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progresso per Argomento */}
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col min-h-[350px]">
             <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-4 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <List className="text-[#8B5CF6] dark:text-[#A78BFA] w-5 h-5" />
              Progresso per Argomento
            </h3>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicStatsData} margin={{ top: 10, right: 10, left: 30, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" className="dark:stroke-[#334155]" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 'bold' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '12px', border: '2px solid #E5E7EB', fontWeight: 'bold', color: '#0F172A' }}
                    formatter={(value: number, name: string) => [value, name === 'daImparare' ? 'Da Imparare' : name]}
                  />
                  <Bar dataKey="imparate" name="Imparate" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} maxBarSize={20} />
                  <Bar dataKey="daImparare" name="Da Imparare" stackId="a" fill="#E5E7EB" radius={[0, 4, 4, 0]} maxBarSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Errori Comuni */}
          <div className="bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-6 transition-colors flex flex-col">
            <h3 className="text-sm sm:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] mb-3 uppercase tracking-widest flex items-center gap-2 shrink-0">
              <AlertCircle className="text-[#EF4444] dark:text-[#F87171] w-5 h-5" />
              Errori Comuni
            </h3>
            {topErrors.length === 0 ? (
              <div className="py-6 flex items-center justify-center text-center">
                <span className="font-bold text-sm text-gray-400 dark:text-gray-500">Non ci sono ancora dati sufficienti.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {topErrors.map(err => {
                  const q = questions.find(q => q.id === err.qId);
                  if (!q) return null;
                  return (
                    <div key={err.qId} className="bg-[#FEE2E2] dark:bg-[#7F1D1D]/25 border border-[#EF4444] dark:border-[#EF4444] rounded-xl p-3 sm:p-4 shadow-sm transition-colors flex flex-col gap-2.5">
                      <p className="font-bold text-sm sm:text-base text-[#1E293B] dark:text-[#F8FAFC] line-clamp-2 leading-tight">{q.prompt}</p>
                      
                      {/* Breakdown: Giuste, Sbagliate, Omesse */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors",
                          err.correct > 0 
                            ? "bg-[#DCFCE7] dark:bg-[#059669]/30 text-[#16A34A] dark:text-[#34D399] border-[#22C55E]/30" 
                            : "bg-white/80 dark:bg-black/20 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                        )}>
                          <Check size={11} strokeWidth={3} />
                          {err.correct} {err.correct === 1 ? 'giusta' : 'giuste'}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border bg-white dark:bg-[#450A0A] text-[#B91C1C] dark:text-[#FCA5A5] border-[#EF4444]/30">
                          <X size={11} strokeWidth={3} />
                          {err.incorrect} {err.incorrect === 1 ? 'sbagliata' : 'sbagliate'}
                        </span>

                        <span className={cn(
                          "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors",
                          err.omitted > 0 
                            ? "bg-[#FFF4E5] dark:bg-[#F59E0B]/30 text-[#D97706] dark:text-[#FBBF24] border-[#F59E0B]/30" 
                            : "bg-white/80 dark:bg-black/20 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700"
                        )}>
                          <Minus size={11} strokeWidth={3} />
                          {err.omitted} {err.omitted === 1 ? 'omessa' : 'omesse'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#EF4444]/20 dark:border-[#EF4444]/20">
                        <span className="text-xs sm:text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5]">
                          {Math.round(err.errorRate * 100)}% errore
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#16A34A] dark:text-[#34D399] truncate max-w-[50%]">
                          {q.options[q.correctIndex]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Bottom Full Width Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 shrink-0">
          {/* XP & Level Bar */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 sm:p-5 border-2 border-gray-200 dark:border-[#334155] border-b-4 flex flex-col justify-center gap-2 shadow-sm transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#F59E0B] text-white p-1.5 rounded-lg shadow-sm">
                  <Crown size={18} strokeWidth={3} />
                </div>
                <span className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC]">Liv. {currentLevel}</span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#F59E0B]">{totalXP} XP</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden flex relative">
              <div className={cn("bg-[#F59E0B] h-full rounded-full transition-all duration-500 ease-out", progressPercent > 80 && "animate-pulse")} style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {/* Daily Goal Endless */}
          <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-4 sm:p-5 border-2 border-gray-200 dark:border-[#334155] border-b-4 flex flex-col justify-center gap-2 shadow-sm transition-colors relative overflow-hidden group">
            <div className="flex justify-between items-center z-10 leading-none">
              <span className="text-sm sm:text-lg font-black text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
                Sfida Quotidiana
                <span className="bg-[#3B82F6] text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  Fase {milestoneIndex + 1}
                </span>
              </span>
              <span className="text-sm sm:text-lg font-black text-[#3B82F6]">{currentTotalDaily}/{currentMilestone}</span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden flex relative mt-1">
              <div 
                className={cn("bg-[#3B82F6] h-full rounded-full transition-all duration-700 ease-out", phaseProgressPercent > 80 && "animate-pulse")} 
                style={{ width: `${phaseProgressPercent}%` }} 
              />
            </div>
          </div>
        </div>

      </main>
      </div>
    </div>
  );
}
