import { useState, useEffect } from 'react';
import { Question, AppState, QuestionClickEvent, QuestionTelemetry } from '../types';
import { selectPracticeQuestions, updateStats } from '../lib/spacedRepetition';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, RotateCcw, Lightbulb, Flame } from 'lucide-react';
import { cn, shuffleQuestion } from '../lib/utils';
import { playTapSound, playCorrectSound, playIncorrectSound, playVictorySound, triggerConfetti } from '../lib/audio';

interface LearnModeProps {
  appState: AppState;
  mode: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart';
  category?: string;
  onUpdateAppState: (newState: AppState) => void;
  onExit: () => void;
}

export default function LearnMode({ appState, mode, category, onUpdateAppState, onExit }: LearnModeProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
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

  const timeLimit = mode === 'blitz' ? 10 : 30;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setQuestions(selectPracticeQuestions(appState.stats, { 
      numQuestions: 10, 
      mode, 
      category, 
      corpus: appState.selectedCorpus 
    }).map(shuffleQuestion));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play fanfare & celebration confetti when session completes
  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      playVictorySound();
      triggerConfetti('celebration');
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

    if (mode === 'recall' && questions[currentIndex]) {
      const q = questions[currentIndex];
      const correctText = q.options[q.correctIndex];
      // Split by spaces, filter out empty strings just in case
      let words = correctText.split(' ').filter(w => w.trim() !== '');
      
      const distractors = new Set<string>();
      
      // First try to get distractors from the current question's options
      q.options.forEach((opt, idx) => {
        if (idx !== q.correctIndex) {
          const optWords = opt.split(' ').filter(w => w.trim() !== '');
          optWords.forEach(w => {
            if (!words.includes(w)) {
              distractors.add(w);
            }
          });
        }
      });
      
      const maxDistractors = words.length <= 3 ? 8 : 5;
      
      // If we don't have enough, pull from other questions in the set
      if (distractors.size < maxDistractors) {
        questions.forEach(otherQ => {
          otherQ.options.forEach(opt => {
            const optWords = opt.split(' ').filter(w => w.trim() !== '');
            optWords.forEach(w => {
              if (!words.includes(w)) {
                distractors.add(w);
              }
            });
          });
        });
      }
      
      const shuffledDistractors = Array.from(distractors).sort(() => Math.random() - 0.5).slice(0, maxDistractors);
      
      const combined = [...words, ...shuffledDistractors].sort(() => Math.random() - 0.5);
      
      setRecallWords(combined);
      setSelectedRecallWords([]);
    }
  }, [currentIndex, mode, timeLimit, questions]);

  useEffect(() => {
    if (hasChecked || timeLeft <= 0 || attempts > 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [hasChecked, timeLeft, attempts]);

  useEffect(() => {
    if (timeLeft === 0 && !hasChecked && attempts === 0) {
      handleCheck('low', true);
    }
  }, [timeLeft, hasChecked, attempts]);

  if (questions.length === 0) return null;

  const question = questions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (hasChecked || wrongOptions.has(idx)) return;
    playTapSound();
    setSelectedOption(idx);
    const now = Date.now();
    const elapsedMs = now - startTime;
    const isOptionCorrect = idx === question.correctIndex;
    setLastSelectionTimestamp(now);
    setSelectionHistory(prev => [
      ...prev,
      { optionIndex: idx, timestamp: now, elapsedMs, isCorrect: isOptionCorrect }
    ]);
  };

  const handleCheck = (confidence: 'low' | 'medium' | 'high', isTimeout: boolean = false) => {
    if (!optionsRevealed && mode === 'recall') {
      if (selectedRecallWords.length === 0 && !isTimeout) return;
      
      setHasChecked(true);
      const currentAttempts = attempts + 1;
      setAttempts(currentAttempts);
      
      const constructedAnswer = selectedRecallWords.map(i => recallWords[i]).join(' ').trim();
      const correctAnswer = question.options[question.correctIndex].split(' ').filter(w => w.trim() !== '').join(' ');
      const correct = !isTimeout && constructedAnswer === correctAnswer;
      
      setSelectedOption(correct ? question.correctIndex : -1);

      const timeTakenMs = Date.now() - startTime;
      const hesitationBeforeSubmitMs = lastSelectionTimestamp ? Math.max(0, Date.now() - lastSelectionTimestamp) : 0;
      const telemetry: QuestionTelemetry = {
        firstClickTimeMs: selectionHistory.length > 0 ? selectionHistory[0].elapsedMs : timeTakenMs,
        firstOptionIndex: selectionHistory.length > 0 ? selectionHistory[0].optionIndex : (correct ? question.correctIndex : null),
        finalOptionIndex: correct ? question.correctIndex : null,
        switchCount: Math.max(0, selectionHistory.length - 1),
        trajectory: selectionHistory.map(h => h.optionIndex),
        hesitationBeforeSubmitMs,
        clickEvents: selectionHistory
      };

      if (correct) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        playCorrectSound(nextStreak);
        triggerConfetti(nextStreak >= 4 ? 'cannon' : (nextStreak >= 2 ? 'burst' : 'mini'));

        const newState = updateStats(appState, question.id, true, timeTakenMs, currentAttempts, confidence, telemetry);
        onUpdateAppState(newState);
        
        if (currentAttempts === 1) {
          setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
        } else {
          setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));
        }
      } else {
        setStreak(0);
        playIncorrectSound();
        if (currentAttempts === 1) {
          const newState = updateStats(appState, question.id, false, timeTakenMs, currentAttempts, confidence, telemetry);
          onUpdateAppState(newState);
        }
      }
      return;
    }

    if (selectedOption === null && !isTimeout) return;
    
    setHasChecked(true);
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);
    
    const correct = !isTimeout && selectedOption === question.correctIndex;
    const timeTakenMs = Date.now() - startTime;
    const hesitationBeforeSubmitMs = lastSelectionTimestamp ? Math.max(0, Date.now() - lastSelectionTimestamp) : 0;

    const telemetry: QuestionTelemetry = {
      firstClickTimeMs: selectionHistory.length > 0 ? selectionHistory[0].elapsedMs : timeTakenMs,
      firstOptionIndex: selectionHistory.length > 0 ? selectionHistory[0].optionIndex : selectedOption,
      finalOptionIndex: selectedOption,
      switchCount: Math.max(0, selectionHistory.length - 1),
      trajectory: selectionHistory.map(h => h.optionIndex),
      hesitationBeforeSubmitMs,
      clickEvents: selectionHistory
    };
    
    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      playCorrectSound(nextStreak);
      triggerConfetti(nextStreak >= 4 ? 'cannon' : (nextStreak >= 2 ? 'burst' : 'mini'));

      const newState = updateStats(appState, question.id, true, timeTakenMs, currentAttempts, confidence, telemetry);
      onUpdateAppState(newState);
      
      if (currentAttempts === 1) {
        setSessionStats(prev => ({ ...prev, correct: prev.correct + 1, total: prev.total + 1 }));
      } else {
        setSessionStats(prev => ({ ...prev, total: prev.total + 1 }));
      }
    } else {
      setStreak(0);
      playIncorrectSound();
      if (selectedOption !== null) {
        setWrongOptions(prev => new Set(prev).add(selectedOption));
      }
      
      // Update stats as incorrect on the first failed attempt
      if (currentAttempts === 1) {
        const newState = updateStats(appState, question.id, false, timeTakenMs, currentAttempts, confidence, telemetry);
        onUpdateAppState(newState);
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
      <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm p-4 sm:p-6 items-center justify-center text-center transition-colors duration-300">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#58CC02] dark:bg-[#46A302] p-4 sm:p-6 rounded-full mb-4 sm:mb-6 text-white shadow-sm"
        >
          <Check size={40} className="sm:w-12 sm:h-12" strokeWidth={3} />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] dark:text-[#F8FAFC] mb-2">Sessione Completata!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 font-bold text-base sm:text-lg">
          Hai risposto a {sessionStats.correct} su {sessionStats.total} correttamente al primo tentativo.
        </p>
        <button
          onClick={() => { playTapSound(); onExit(); }}
          className="w-full max-w-sm bg-[#1CB0F6] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 text-white font-black text-base sm:text-lg py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl transition-all uppercase tracking-widest"
        >
          Continua
        </button>
      </div>
    );
  }

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      {/* Header & Progress */}
      <header className="flex items-center gap-3 sm:gap-4 p-3 border-b-2 border-gray-200 dark:border-[#334155] h-12 shrink-0 transition-colors">
        <button onClick={() => { playTapSound(); onExit(); }} className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-full transition-colors">
          <X size={18} strokeWidth={3} />
        </button>
        <div className="flex-1 bg-gray-200 dark:bg-[#334155] h-3 rounded-full overflow-hidden transition-colors">
          <motion.div 
            className="bg-[#58CC02] h-full rounded-full transition-all duration-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1 text-[#FFC800] font-black text-xs sm:text-sm animate-bounce">
            <Flame size={16} fill="currentColor" />
            <span>{streak}x</span>
          </div>
        )}
        <div className={cn("font-black text-sm w-8 text-center", timeLeft <= 5 ? "text-[#FF4B4B] animate-pulse" : "text-gray-500 dark:text-gray-400")}>
          {timeLeft}s
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <span className="px-4 py-1.5 bg-[#CE82FF] dark:bg-[#D946EF] text-white text-xs sm:text-sm font-black uppercase rounded-full tracking-widest shadow-sm">
            Domanda {currentIndex + 1}
          </span>
          {(category === 'corpus:initial' || appState.selectedCorpus === 'initial') && (
            <span className="px-3 py-1 bg-[#58CC02]/10 text-[#58CC02] border border-[#58CC02]/30 text-xs font-black uppercase rounded-full tracking-wider">
              Primo Corpus (60)
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-[#3C3C3C] dark:text-[#F8FAFC] mb-6 sm:mb-8 leading-tight shrink-0">
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
                <div className="bg-[#DDF4FF] dark:bg-[#0369A1] text-[#1899D6] dark:text-[#E0F2FE] px-4 py-2 rounded-xl text-sm font-bold text-center animate-in fade-in zoom-in duration-300">
                  Argomento: {question.grammarTopic || question.category} {question.level && `(${question.level})`}
                </div>
              )}
            </div>

            {/* Answer Box */}
            <div className={cn(
              "min-h-[100px] w-full border-b-4 p-4 flex flex-wrap content-start gap-2 items-center bg-gray-50/50 dark:bg-[#0F172A]/50 rounded-t-2xl transition-colors",
              hasChecked && !isCorrect ? "border-[#FF4B4B] bg-[#FFE5E5]/50 dark:bg-[#7F1D1D]/50" : "border-gray-300 dark:border-[#475569]"
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
                    "bg-white dark:bg-[#1E293B] border-2 text-[#4B4B4B] dark:text-[#F8FAFC] px-4 py-2 rounded-xl font-bold shadow-sm transition-all",
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
                        ? "bg-gray-200 dark:bg-[#334155] text-transparent border-2 border-gray-200 dark:border-[#334155] cursor-default shadow-none" 
                        : "bg-white dark:bg-[#1E293B] border-2 border-gray-200 dark:border-[#475569] border-b-4 text-[#4B4B4B] dark:text-[#F8FAFC] active:border-b-0 active:translate-y-[2px] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#0F172A]"
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
                className="text-gray-400 font-bold text-xs sm:text-sm uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Troppo difficile? Usa le opzioni multiple
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
            {question.options.map((opt, idx) => {
              let stateClass = "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-400 text-[#4B4B4B] dark:text-gray-200 border-b-4 active:border-b-2 active:translate-y-[2px]";
              let numberClass = "border-gray-200 dark:border-[#334155] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#1E293B]";
              
              if (hasChecked) {
                if (idx === question.correctIndex) {
                  stateClass = "border-[#58CC02] dark:border-[#46A302] bg-[#E5F5E5] dark:bg-[#064E3B] text-[#46A302] dark:text-[#10B981] border-b-4";
                  numberClass = "border-[#58CC02] dark:border-[#46A302] bg-white dark:bg-[#064E3B] text-[#58CC02] dark:text-[#10B981]";
                } else if (idx === selectedOption) {
                  stateClass = "border-[#FF4B4B] dark:border-[#EF4444] bg-[#FFE5E5] dark:bg-[#7F1D1D] text-[#D80000] dark:text-[#F87171] border-b-4";
                  numberClass = "border-[#FF4B4B] dark:border-[#EF4444] bg-white dark:bg-[#7F1D1D] text-[#FF4B4B] dark:text-[#F87171]";
                } else if (wrongOptions.has(idx)) {
                  stateClass = "border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#1E293B] opacity-40 border-b-2 translate-y-[2px]";
                } else {
                  stateClass = "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] opacity-40 border-b-2 translate-y-[2px]";
                }
              } else if (selectedOption === idx) {
                stateClass = "bg-[#DDF4FF] dark:bg-[#0369A1] border-[#84D8FF] dark:border-[#38BDF8] text-[#1899D6] dark:text-[#E0F2FE] border-b-4";
                numberClass = "border-[#84D8FF] dark:border-[#38BDF8] bg-white dark:bg-[#0369A1] text-[#1899D6] dark:text-[#E0F2FE]";
              } else if (wrongOptions.has(idx)) {
                stateClass = "border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#1E293B] opacity-40 border-b-2 translate-y-[2px]";
              }

              return (
                <button
                  key={idx}
                  disabled={hasChecked || wrongOptions.has(idx)}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "p-4 sm:p-5 text-left border-2 rounded-[24px] group transition-all duration-150 flex items-center min-h-[90px]",
                    stateClass
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className={cn("w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base flex shrink-0 items-center justify-center border-2 rounded-[14px] font-black transition-colors", numberClass)}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-base sm:text-lg font-bold leading-snug flex-1">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className={cn("border-t-2 border-gray-200 dark:border-[#334155] shrink-0 p-4 transition-colors", hasChecked ? (isCorrect ? "bg-[#D7FFB8] dark:bg-[#064E3B] border-[#58CC02] dark:border-[#46A302]" : "bg-[#FFDFE0] dark:bg-[#7F1D1D] border-[#FF4B4B] dark:border-[#EF4444]") : "bg-white dark:bg-[#1E293B]")}>
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
          <AnimatePresence>
            {hasChecked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "font-black flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto",
                  isCorrect ? "text-[#58CC02] dark:text-[#10B981]" : "text-[#FF4B4B] dark:text-[#F87171]"
                )}
              >
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xl sm:text-2xl">{isCorrect ? (streak > 2 ? `Fantastico! 🔥 ${streak} di fila!` : "Ottimo!") : "Errata."}</span>
                  {isCorrect && question.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-white/80 dark:bg-black/30 text-[#46A302] dark:text-[#34D399] border border-[#58CC02]/30 dark:border-[#10B981]/30 shadow-xs">
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
                {isCorrect && (
                  <p className="text-sm font-bold opacity-80 text-gray-700 dark:text-gray-200 leading-tight">
                    {question.explanation}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!hasChecked ? (
            <div className="w-full sm:w-auto flex flex-row gap-2 justify-between sm:justify-end">
              <button
                onClick={() => handleCheck('low')}
                disabled={!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null}
                className="flex-1 sm:flex-none bg-[#FF4B4B] hover:bg-[#E63E3E] border-b-4 border-[#D80000] disabled:bg-gray-200 disabled:dark:bg-[#334155] disabled:border-gray-300 disabled:dark:border-[#475569] disabled:text-gray-400 disabled:dark:text-gray-600 text-white font-black uppercase text-xs sm:text-sm py-4 px-5 rounded-[20px] transition-all active:border-b-0 active:translate-y-[2px] duration-150"
              >
                Indovino
              </button>
              <button
                onClick={() => handleCheck('medium')}
                disabled={!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null}
                className="flex-1 sm:flex-none bg-[#FFC800] hover:bg-[#F0BD00] border-b-4 border-[#E5B400] disabled:bg-gray-200 disabled:dark:bg-[#334155] disabled:border-gray-300 disabled:dark:border-[#475569] disabled:text-gray-400 disabled:dark:text-gray-600 text-white font-black uppercase text-xs sm:text-sm py-4 px-5 rounded-[20px] transition-all active:border-b-0 active:translate-y-[2px] duration-150"
              >
                Incerto
              </button>
              <button
                onClick={() => handleCheck('high')}
                disabled={!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null}
                className="flex-1 sm:flex-none bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#46A302] disabled:bg-gray-200 disabled:dark:bg-[#334155] disabled:border-gray-300 disabled:dark:border-[#475569] disabled:text-gray-400 disabled:dark:text-gray-600 text-white font-black uppercase text-xs sm:text-sm py-4 px-5 rounded-[20px] transition-all active:border-b-0 active:translate-y-[2px] duration-150"
              >
                Sicuro
              </button>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className={cn(
                "w-full sm:w-auto text-white font-black uppercase text-base sm:text-lg py-4 px-8 rounded-[20px] transition-all active:border-b-0 active:translate-y-[2px] border-b-4 flex items-center justify-center gap-2 duration-150",
                isCorrect ? "bg-[#58CC02] hover:bg-[#46A302] border-[#46A302] dark:bg-[#10B981] dark:border-[#059669]" : "bg-[#FF4B4B] hover:bg-[#E63E3E] border-[#D80000] dark:bg-[#EF4444] dark:border-[#DC2626]"
              )}
            >
              {isCorrect ? (
                <>Next <ArrowRight size={20} strokeWidth={3} /></>
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


