import { useState, useEffect, useRef, useMemo } from 'react';
import { AppState, QuestionClickEvent, QuestionTelemetry, PaywallReason } from '../types';
import { selectPracticeIds, updateStats, poolMeta } from '../lib/spacedRepetition';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, RotateCcw, Lightbulb, Flame, BookOpen, Loader2 } from 'lucide-react';
import { Illustrazione } from '../brand/Illustrazione';
import { cn, shuffleArray, prefersReducedMotion } from '../lib/utils';
import { playTapSound, playCorrectSound, playIncorrectSound, playVictorySound, triggerConfetti } from '../lib/audio';
import { useAccess } from '../access/context';
import type { GradeResult, PublicQuestion } from '../access/provider';
import { Screen } from './ui';

interface LearnModeProps {
  appState: AppState;
  mode: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart';
  category?: string;
  onUpdateAppState: (newState: AppState) => void;
  onExit: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  /** Se c'è, dopo la risposta compare "Studia la regola" (quando la domanda ha una scheda di teoria). */
  onOpenTheory?: (id: string) => void;
}

// Una domanda come la vede l'utente: le opzioni sono rimescolate qui, `order[i]` dice quale opzione originale sta in posizione i.
// Al provider si manda sempre l'indice originale, perché è quello che conosce.
interface Item { q: PublicQuestion; order: number[]; }

const words = (t: string) => t.split(' ').filter(w => w.trim() !== '');

export default function LearnMode({ appState, mode, category, onUpdateAppState, onExit, onNeedPass, onOpenTheory }: LearnModeProps) {
  const { provider, pass } = useAccess();
  const [items, setItems] = useState<Item[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadKey, setLoadKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [optionsRevealed, setOptionsRevealed] = useState(mode !== 'recall');
  
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [wrongOptions, setWrongOptions] = useState<Set<number>>(new Set());
  const [selectionHistory, setSelectionHistory] = useState<QuestionClickEvent[]>([]);
  const [lastSelectionTimestamp, setLastSelectionTimestamp] = useState<number | null>(null);
  
  // Recall mode specific state
  const [recallWords, setRecallWords] = useState<string[]>([]);
  const [selectedRecallWords, setSelectedRecallWords] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  const checkingRef = useRef(false);
  const lastCheckRef = useRef<{ confidence: 'low' | 'medium' | 'high'; isTimeout: boolean } | null>(null);
  const appStateRef = useRef(appState);
  appStateRef.current = appState;

  const timeLimit = mode === 'blitz' ? 10 : 30;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Senza Pass non si entra nel ripasso sugli errori: lo decide già il menu, qui è una rete di sicurezza
  const blocked = !pass && mode === 'weakness';
  useEffect(() => {
    if (blocked) onNeedPass('errori');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocked]);

  // Scelta degli id sul solo indice leggero, poi le domande (senza risposte) dal provider
  useEffect(() => {
    if (blocked) return;
    let alive = true;
    setLoadState('loading');
    const ids = selectPracticeIds(appStateRef.current.stats, {
      numQuestions: 10,
      mode,
      category,
      corpus: appStateRef.current.selectedCorpus,
      pass,
    });
    provider.getQuestions(ids)
      .then(list => {
        if (!alive) return;
        const byId = new Map(list.map(q => [q.id, q]));
        const ordered = ids.map(id => byId.get(id)).filter((q): q is PublicQuestion => !!q);
        if (ordered.length === 0) { setLoadState('error'); return; }
        setItems(ordered.map(q => {
          const order = shuffleArray(q.options.map((_, i) => i));
          return { q: { ...q, options: order.map(i => q.options[i]) }, order };
        }));
        setCurrentIndex(0);
        setLoadState('ready');
      })
      .catch(() => { if (alive) setLoadState('error'); });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKey, blocked]);

  const questions = useMemo(() => items.map(i => i.q), [items]);

  // Fanfara e coriandoli a fine sessione (i coriandoli solo se il sistema non chiede animazioni ridotte)
  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      playVictorySound();
      if (!prefersReducedMotion()) triggerConfetti('celebration');
    }
  }, [currentIndex, questions.length]);

  useEffect(() => {
    setStartTime(Date.now());
    setAttempts(0);
    setWrongOptions(new Set());
    setSelectionHistory([]);
    setLastSelectionTimestamp(null);
    setTimeLeft(timeLimit);
    setOptionsRevealed(mode !== 'recall');
    setShowHint(false);
    setResult(null);
    setCheckError(null);
    setSelectedOption(null);
    setHasChecked(false);
    setChecking(false);
    checkingRef.current = false;

    if (mode === 'recall' && questions[currentIndex]) {
      // La risposta esatta non è nell'app prima di rispondere: le parole offerte sono quelle di tutte le opzioni
      // (ogni parola tante volte quante ne serve in una sola opzione), rimescolate.
      const need = new Map<string, number>();
      questions[currentIndex].options.forEach(opt => {
        const count = new Map<string, number>();
        words(opt).forEach(w => count.set(w, (count.get(w) || 0) + 1));
        count.forEach((n, w) => need.set(w, Math.max(need.get(w) || 0, n)));
      });
      const pool: string[] = [];
      need.forEach((n, w) => { for (let i = 0; i < n; i++) pool.push(w); });
      setRecallWords(shuffleArray(pool));
      setSelectedRecallWords([]);
    }
  }, [currentIndex, mode, timeLimit, questions]);

  useEffect(() => {
    if (hasChecked || checking || timeLeft <= 0 || attempts > 0 || currentIndex >= questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasChecked, checking, timeLeft, attempts, currentIndex, questions.length]);

  useEffect(() => {
    if (timeLeft === 0 && !hasChecked && !checking && attempts === 0 && loadState === 'ready') {
      void handleCheck('low', true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, hasChecked, checking, attempts, loadState]);

  if (blocked) return null;

  if (loadState === 'loading') {
    return (
      <Screen className="items-center justify-center text-center">
        <Loader2 size={32} className="animate-spin text-[#EF4444]" />
        <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Preparo le domande…</p>
      </Screen>
    );
  }
  if (loadState === 'error') {
    return (
      <Screen className="items-center justify-center text-center">
        <p role="alert" className="font-bold text-[#B91C1C] dark:text-[#FCA5A5] max-w-sm">Non riesco a caricare le domande. Controlla la connessione e riprova.</p>
        <button onClick={() => { playTapSound(); setLoadKey(k => k + 1); }} className="w-full max-w-xs bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[.99]">Riprova</button>
        <button onClick={onExit} className="text-sm font-bold text-gray-500 dark:text-gray-400 underline">Torna indietro</button>
      </Screen>
    );
  }

  const item = items[currentIndex];
  const question = item?.q;
  // Posizione (nell'ordine mostrato) della risposta esatta, nota solo dopo grade()
  const correctDisplay = result && item ? item.order.indexOf(result.correctIndex) : -1;
  const isCorrect = result !== null && selectedOption === correctDisplay;

  const handleSelectOption = (idx: number) => {
    if (hasChecked || checking || wrongOptions.has(idx)) return;
    playTapSound();
    setSelectedOption(idx);
    const now = Date.now();
    const elapsedMs = now - startTime;
    setLastSelectionTimestamp(now);
    // Il provider non dice ancora se l'opzione è esatta: il campo si riempie in base alla risposta più avanti
    setSelectionHistory(prev => [
      ...prev,
      { optionIndex: idx, timestamp: now, elapsedMs, isCorrect: false }
    ]);
  };

  const handleCheck = async (confidence: 'low' | 'medium' | 'high', isTimeout: boolean = false) => {
    if (!item || checkingRef.current || hasChecked) return;
    const recall = !optionsRevealed && mode === 'recall';

    // Cosa ha scelto l'utente, come posizione nell'ordine mostrato (-1 = nessuna opzione corrispondente)
    let chosen: number | null = selectedOption;
    if (recall) {
      if (selectedRecallWords.length === 0 && !isTimeout) return;
      const built = selectedRecallWords.map(i => recallWords[i]).join(' ').trim();
      chosen = question.options.findIndex(opt => words(opt).join(' ') === built);
    } else if (selectedOption === null && !isTimeout) {
      return;
    }

    // Il tempo si ferma al clic, non quando arriva la risposta del provider
    const now = Date.now();
    const timeTakenMs = now - startTime;
    const hesitationBeforeSubmitMs = lastSelectionTimestamp ? Math.max(0, now - lastSelectionTimestamp) : 0;
    const history = selectionHistory;

    checkingRef.current = true;
    lastCheckRef.current = { confidence, isTimeout };
    setChecking(true);
    setCheckError(null);

    let res = result;
    if (!res) {
      try {
        // -1 = nessuna risposta (tempo scaduto o frase che non corrisponde a nessuna opzione)
        res = await provider.grade(question.id, chosen !== null && chosen >= 0 ? item.order[chosen] : -1);
      } catch {
        checkingRef.current = false;
        setChecking(false);
        setCheckError('Non riesco a controllare la risposta. Riprova.');
        return;
      }
    }

    const correctIdx = item.order.indexOf(res.correctIndex);
    const correct = !isTimeout && chosen !== null && chosen >= 0 && chosen === correctIdx;
    const currentAttempts = attempts + 1;

    const finalChoice = recall ? (correct ? correctIdx : null) : chosen;
    const telemetry: QuestionTelemetry = {
      firstClickTimeMs: history.length > 0 ? history[0].elapsedMs : timeTakenMs,
      firstOptionIndex: history.length > 0 ? history[0].optionIndex : (recall ? (correct ? correctIdx : null) : chosen),
      finalOptionIndex: finalChoice,
      switchCount: Math.max(0, history.length - 1),
      trajectory: history.map(h => h.optionIndex),
      hesitationBeforeSubmitMs,
      clickEvents: history.map(h => ({ ...h, isCorrect: h.optionIndex === correctIdx })),
    };
    const quiz = { prompt: question.prompt, options: question.options, correctIndex: correctIdx };

    setResult(res);
    setHasChecked(true);
    setAttempts(currentAttempts);
    setChecking(false);
    checkingRef.current = false;

    if (recall) setSelectedOption(correct ? correctIdx : -1);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      playCorrectSound(nextStreak);
      if (!prefersReducedMotion()) triggerConfetti(nextStreak >= 4 ? 'cannon' : (nextStreak >= 2 ? 'burst' : 'mini'));

      onUpdateAppState(updateStats(appStateRef.current, question.id, true, timeTakenMs, currentAttempts, confidence, telemetry, quiz));
      setSessionStats(prev => ({ ...prev, correct: prev.correct + (currentAttempts === 1 ? 1 : 0), total: prev.total + 1 }));
    } else {
      setStreak(0);
      playIncorrectSound();
      if (!recall && chosen !== null && chosen >= 0) {
        setWrongOptions(prev => new Set(prev).add(chosen as number));
      }
      // La prima risposta sbagliata conta come errore; i tentativi dopo no
      if (currentAttempts === 1) {
        onUpdateAppState(updateStats(appStateRef.current, question.id, false, timeTakenMs, currentAttempts, confidence, telemetry, quiz));
      }
    }
  };

  const handleNext = () => {
    playTapSound();
    if (!isCorrect) {
      // Try again logic
      setHasChecked(false);
      setSelectedOption(null);
      setSelectionHistory([]);
      setLastSelectionTimestamp(null);
      return;
    }
    setSelectedOption(null);
    setHasChecked(false);
    setSelectionHistory([]);
    setLastSelectionTimestamp(null);
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= questions.length) {
    return (
      <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm p-4 sm:p-6 items-center justify-center text-center transition-colors duration-300">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-4">
          <Illustrazione kit="kit-rosso" gruppo="stati" nome="completato" lato={150} />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">Sessione completata!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 font-semibold text-base">
          Hai risposto a {sessionStats.correct} su {sessionStats.total} correttamente al primo tentativo.
        </p>
        <button
          onClick={() => { playTapSound(); onExit(); }}
          className="w-full max-w-sm bg-[#EF4444] hover:bg-[#DC2626] active:scale-[.99] text-white font-bold text-base py-3.5 px-6 rounded-2xl transition-all"
        >
          Continua
        </button>
      </div>
    );
  }

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      {/* Header & Progress */}
      <header className="flex items-center gap-3 sm:gap-4 p-3 border-b border-gray-100 dark:border-[#334155] h-12 shrink-0 transition-colors">
        <button onClick={() => { playTapSound(); onExit(); }} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors">
          <X size={18} strokeWidth={3} />
        </button>
        <div className="flex-1 bg-gray-100 dark:bg-[#334155] h-2 rounded-full overflow-hidden transition-colors">
          <motion.div 
            className="bg-[#EF4444] h-full rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1 text-[#F59E0B] font-bold text-xs sm:text-sm animate-bounce">
            <Flame size={16} fill="currentColor" />
            <span>{streak}x</span>
          </div>
        )}
        <div className={cn("font-bold text-sm w-8 text-center", timeLeft <= 5 ? "text-[#EF4444] animate-pulse" : "text-gray-500 dark:text-gray-400")}>
          {timeLeft}s
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
            Domanda {currentIndex + 1} di {questions.length}
          </span>
          {(!pass || category === 'corpus:initial' || appState.selectedCorpus === 'initial') && (
            <span className="px-3 py-1 bg-[#22C55E]/10 text-[#16A34A] dark:text-[#34D399] border border-[#22C55E]/30 text-xs font-bold rounded-full">
              {pass ? 'Nucleo di base' : 'Nucleo gratuito'} ({poolMeta(false).length})
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-5 sm:mb-6 leading-snug shrink-0">
          {question.prompt}
        </h2>

        {!optionsRevealed ? (
          <div className="flex-1 flex flex-col gap-6 w-full max-w-2xl mx-auto items-center justify-center pt-8">
            
            {/* Hint Section */}
            <div className="flex flex-col items-center gap-2 mb-4 h-12 justify-center">
              {!showHint ? (
                <button 
                  onClick={() => { playTapSound(); setShowHint(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 font-bold rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Lightbulb size={20} />
                  Mostra Suggerimento
                </button>
              ) : (
                <div className="bg-[#DBEAFE] dark:bg-[#1D4ED8] text-[#2563EB] dark:text-[#DBEAFE] px-4 py-2 rounded-xl text-sm font-bold text-center animate-in fade-in zoom-in duration-300">
                  Argomento: {question.grammarTopic || question.category} {question.level && `(${question.level})`}
                </div>
              )}
            </div>

            {/* Answer Box */}
            <div className={cn(
              "min-h-[100px] w-full p-4 flex flex-wrap content-start gap-2 items-center bg-gray-50/50 dark:bg-[#0F172A]/50 rounded-t-2xl transition-colors",
              hasChecked && !isCorrect ? "border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/50" : "border-gray-300 dark:border-[#475569]"
            )}>
              {selectedRecallWords.length === 0 && (
                <span className="text-gray-400 font-bold px-2 py-1">Tocca le parole per formare la frase...</span>
              )}
              {selectedRecallWords.map((wordIndex) => (
                <button
                  key={`selected-${wordIndex}`}
                  onClick={() => {
                    if (!hasChecked) {
                      playTapSound();
                      setSelectedRecallWords(prev => prev.filter(i => i !== wordIndex));
                    }
                  }}
                  disabled={hasChecked}
                  className={cn(
                    "bg-white dark:bg-[#1E293B] border text-[#0F172A] dark:text-[#F8FAFC] px-4 py-2 rounded-xl font-bold shadow-sm transition-all",
                    hasChecked ? "border-gray-200 dark:border-[#475569] opacity-80" : "border-gray-200 dark:border-[#475569] active:scale-95 hover:border-gray-300"
                  )}
                >
                  {recallWords[wordIndex]}
                </button>
              ))}
            </div>

            {/* Word Chips Pool */}
            <div className="flex flex-wrap gap-3 justify-center w-full max-w-lg mt-4 min-h-[120px] content-start">
              {recallWords.map((word, index) => {
                const isSelected = selectedRecallWords.includes(index);
                return (
                  <button
                    key={`pool-${index}`}
                    onClick={() => {
                      if (!hasChecked) {
                        playTapSound();
                        setSelectedRecallWords(prev => [...prev, index]);
                      }
                    }}
                    disabled={isSelected || hasChecked}
                    className={cn(
                      "px-5 py-2.5 rounded-[16px] font-bold transition-all text-sm sm:text-base",
                      isSelected 
                        ? "bg-gray-200 dark:bg-[#334155] text-transparent border border-gray-200 dark:border-[#334155] cursor-default shadow-none" 
                        : "bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#475569] text-[#0F172A] dark:text-[#F8FAFC] active:scale-[.99] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]"
                    )}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-4 pt-4">
              <button
                onClick={() => { playTapSound(); setOptionsRevealed(true); }}
                className="text-gray-400 font-bold text-xs sm:text-sm hover:text-gray-600 transition-colors"
              >
                Troppo difficile? Usa le opzioni multiple
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 content-start">
            {question.options.map((opt, idx) => {
              let stateClass = "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-400 text-[#0F172A] dark:text-gray-200 active:scale-[.99]";
              let numberClass = "border-gray-200 dark:border-[#334155] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#1E293B]";
              
              if (hasChecked) {
                if (idx === correctDisplay) {
                  stateClass = "border-[#22C55E] dark:border-[#16A34A] bg-[#F0FDF4] dark:bg-[#064E3B] text-[#16A34A] dark:text-[#10B981]";
                  numberClass = "border-[#22C55E] dark:border-[#16A34A] bg-white dark:bg-[#064E3B] text-[#22C55E] dark:text-[#10B981]";
                } else if (idx === selectedOption) {
                  stateClass = "border-[#EF4444] dark:border-[#EF4444] bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#B91C1C] dark:text-[#F87171]";
                  numberClass = "border-[#EF4444] dark:border-[#EF4444] bg-white dark:bg-[#7F1D1D] text-[#EF4444] dark:text-[#F87171]";
                } else if (wrongOptions.has(idx)) {
                  stateClass = "border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#1E293B] opacity-40";
                } else {
                  stateClass = "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] opacity-40";
                }
              } else if (selectedOption === idx) {
                stateClass = "bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 border-[#EF4444] text-[#0F172A] dark:text-[#F8FAFC]";
                numberClass = "border-[#EF4444] bg-[#EF4444] text-white";
              } else if (wrongOptions.has(idx)) {
                stateClass = "border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#1E293B] opacity-40";
              }

              return (
                <button
                  key={idx}
                  disabled={hasChecked || wrongOptions.has(idx)}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "p-3 sm:p-3.5 text-left border rounded-2xl group transition-all duration-150 flex items-center min-h-[56px]",
                    stateClass
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className={cn("w-8 h-8 text-sm flex shrink-0 items-center justify-center border rounded-full font-bold transition-colors", numberClass)}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-[15px] sm:text-base font-semibold leading-snug flex-1">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {checkError && (
        <div role="alert" className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#B91C1C] dark:text-[#FCA5A5] text-sm font-bold">
          <span>{checkError}</span>
          <button onClick={() => { const l = lastCheckRef.current; if (l) void handleCheck(l.confidence, l.isTimeout); }} className="underline shrink-0">Riprova</button>
        </div>
      )}
      {/* Bottom Action Bar */}
      <div className={cn("border-t border-gray-100 dark:border-[#334155] shrink-0 p-4 transition-colors", hasChecked ? (isCorrect ? "bg-[#DCFCE7] dark:bg-[#064E3B] border-[#22C55E] dark:border-[#16A34A]" : "bg-[#FEE2E2] dark:bg-[#7F1D1D] border-[#EF4444] dark:border-[#EF4444]") : "bg-white dark:bg-[#1E293B]")}>
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
          <AnimatePresence>
            {hasChecked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "font-bold flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto",
                  isCorrect ? "text-[#22C55E] dark:text-[#10B981]" : "text-[#EF4444] dark:text-[#F87171]"
                )}
              >
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xl sm:text-2xl">{isCorrect ? (streak > 2 ? `Fantastico, ${streak} di fila!` : "Ottimo!") : "Errata."}</span>
                  {isCorrect && question.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/80 dark:bg-black/30 text-[#16A34A] dark:text-[#34D399] border border-[#22C55E]/30 dark:border-[#10B981]/30 shadow-xs">
                      <span>Categoria:</span>
                      <span className="font-extrabold">{question.category}{question.grammarTopic ? ` (${question.grammarTopic})` : ''}</span>
                    </span>
                  )}
                </div>
                {!isCorrect && (
                  <p className="text-sm font-bold opacity-80 text-gray-700 dark:text-gray-200">
                    Riprova!
                  </p>
                )}
                {result?.explanation && (
                  <div className="max-h-[28vh] overflow-y-auto">
                    <p className="text-sm font-bold opacity-80 text-gray-700 dark:text-gray-200 leading-snug">
                      {result.explanation}
                    </p>
                  </div>
                )}
                {result?.theoryId && onOpenTheory && (
                  <button
                    onClick={() => { playTapSound(); onOpenTheory(result.theoryId!); }}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 underline underline-offset-2"
                  >
                    <BookOpen size={15} /> Studia la regola
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!hasChecked ? (
            <div className="w-full sm:w-auto flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sm:text-right">Quanto sei sicuro della risposta?</span>
              <div className="flex flex-row gap-2 justify-between sm:justify-end">
              <button
                onClick={() => handleCheck('low')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-100 disabled:dark:bg-[#334155] disabled:text-gray-400 disabled:dark:text-gray-500 text-white font-bold text-sm py-3.5 px-5 rounded-2xl transition-all active:scale-[.99] duration-150"
              >
                Indovino
              </button>
              <button
                onClick={() => handleCheck('medium')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none bg-[#F59E0B] hover:bg-[#D97706] disabled:bg-gray-100 disabled:dark:bg-[#334155] disabled:text-gray-400 disabled:dark:text-gray-500 text-white font-bold text-sm py-3.5 px-5 rounded-2xl transition-all active:scale-[.99] duration-150"
              >
                Incerto
              </button>
              <button
                onClick={() => handleCheck('high')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none bg-[#22C55E] hover:bg-[#16A34A] disabled:bg-gray-100 disabled:dark:bg-[#334155] disabled:text-gray-400 disabled:dark:text-gray-500 text-white font-bold text-sm py-3.5 px-5 rounded-2xl transition-all active:scale-[.99] duration-150"
              >
                Sicuro
              </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className={cn(
                "w-full sm:w-auto text-white font-bold text-base py-3.5 px-8 rounded-2xl transition-all active:scale-[.99] flex items-center justify-center gap-2 duration-150",
                isCorrect ? "bg-[#22C55E] hover:bg-[#16A34A] border-[#16A34A] dark:bg-[#10B981] dark:border-[#059669]" : "bg-[#EF4444] hover:bg-[#DC2626] border-[#B91C1C] dark:bg-[#EF4444] dark:border-[#DC2626]"
              )}
            >
              {isCorrect ? (
                <>Avanti <ArrowRight size={20} strokeWidth={3} /></>
              ) : (
                <>Riprova <RotateCcw size={20} strokeWidth={3} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


