import { useState, useEffect, useMemo } from 'react';
import { Question, ExamHistory, ExamQuestionLog, QuestionClickEvent, CorpusType } from '../types';
import { questions, getQuestionsByCorpus } from '../data/questions';
import { motion } from 'motion/react';
import { X, Clock, ChevronLeft, ChevronRight, BookmarkCheck } from 'lucide-react';
import { cn, calculateSimilarity, shuffleQuestion } from '../lib/utils';
import { playTapSound, playVictorySound, triggerConfetti } from '../lib/audio';

interface ExamModeProps {
  onComplete: (
    history: ExamHistory, 
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>
  ) => void;
  onExit: () => void;
  corpus?: CorpusType;
}

const EXAM_DURATION = 15 * 60; // 15 minutes
const PASSING_SCORE = 25;

export default function ExamMode({ onComplete, onExit, corpus = 'all' }: ExamModeProps) {
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
  const [questionTelemetry, setQuestionTelemetry] = useState<Record<string, {
    clicks: QuestionClickEvent[];
    firstClickTimeMs?: number;
    firstOptionIndex?: number;
    lastClickTimestamp?: number;
  }>>({});
  const [questionStartTimestamp, setQuestionStartTimestamp] = useState<number>(Date.now());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Pick 30 distinct questions avoiding high similarity from active corpus
    const sourcePool = getQuestionsByCorpus(corpus);
    const shuffled = [...sourcePool].sort(() => 0.5 - Math.random());
    const selected: Question[] = [];
    
    for (const q of shuffled) {
      if (selected.length >= 30) break;
      
      // Check similarity with already selected questions (threshold 0.45)
      const isTooSimilar = selected.some(
        selectedQ => calculateSimilarity(selectedQ.prompt, q.prompt) > 0.45
      );
      
      if (!isTooSimilar) {
        selected.push(q);
      }
    }
    
    // Fallback if we couldn't find 30 different ones
    if (selected.length < 30) {
      for (const q of shuffled) {
        if (selected.length >= 30) break;
        if (!selected.some(s => s.id === q.id)) {
          selected.push(q);
        }
      }
    }

    setExamQuestions(selected.map(shuffleQuestion));
  }, [corpus]);

  const updateCurrentQuestionTime = () => {
    if (examQuestions.length > 0 && examQuestions[currentIndex]) {
      const qId = examQuestions[currentIndex].id;
      const elapsed = Date.now() - questionStartTimestamp;
      setQuestionTimeSpent(prev => ({
        ...prev,
        [qId]: (prev[qId] || 0) + elapsed
      }));
      setQuestionStartTimestamp(Date.now());
    }
  };

  useEffect(() => {
    let timer: any;
    if (hasStarted && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish(answers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, isFinished, timeLeft]);

  const handleStart = () => {
    setHasStarted(true);
    setQuestionStartTimestamp(Date.now());
  };

  const handleFinish = (finalAnswers = answers) => {
    setIsFinished(true);
    
    // Calculate synchronous final question time map so the active question's elapsed time is preserved
    const currentQ = examQuestions[currentIndex];
    const currentElapsed = currentQ ? Math.max(0, Date.now() - questionStartTimestamp) : 0;
    const finalTimeSpentMap = {
      ...questionTimeSpent,
      ...(currentQ ? { [currentQ.id]: (questionTimeSpent[currentQ.id] || 0) + currentElapsed } : {})
    };
    setQuestionTimeSpent(finalTimeSpentMap);

    let score = 0;
    const categoryUpdates: Record<string, { correct: number, total: number }> = {};
    const questionResults: Record<string, 'correct' | 'incorrect' | 'omitted'> = {};
    const questionLogs: ExamQuestionLog[] = [];

    examQuestions.forEach(q => {
      if (!categoryUpdates[q.category]) {
        categoryUpdates[q.category] = { correct: 0, total: 0 };
      }
      categoryUpdates[q.category].total++;

      const isOmitted = finalAnswers[q.id] === undefined;
      const isCorrect = !isOmitted && finalAnswers[q.id] === q.correctIndex;

      if (isOmitted) {
        questionResults[q.id] = 'omitted';
      } else if (isCorrect) {
        score++;
        categoryUpdates[q.category].correct++;
        questionResults[q.id] = 'correct';
      } else {
        questionResults[q.id] = 'incorrect';
      }

      const tel = questionTelemetry[q.id];
      const clicks = tel?.clicks || [];
      const switchCount = Math.max(0, clicks.length - 1);
      const trajectory = clicks.map(c => c.optionIndex);
      const firstOptionIndex = clicks.length > 0 ? clicks[0].optionIndex : (isOmitted ? null : finalAnswers[q.id]);
      const firstClickTimeMs = clicks.length > 0 ? clicks[0].elapsedMs : undefined;
      const hesitationBeforeSubmitMs = tel?.lastClickTimestamp ? Math.max(0, Date.now() - tel.lastClickTimestamp) : undefined;

      questionLogs.push({
        questionId: q.id,
        userAnswerIndex: isOmitted ? null : finalAnswers[q.id],
        correctIndex: q.correctIndex,
        isCorrect,
        timeSpentMs: finalTimeSpentMap[q.id] || 0,
        firstClickTimeMs,
        firstOptionIndex,
        switchCount,
        trajectory,
        hesitationBeforeSubmitMs,
        clickEvents: clicks,
        category: q.category,
        grammarTopic: q.grammarTopic,
        level: q.level
      });
    });

    const passed = score >= PASSING_SCORE;
    if (passed) {
      playVictorySound();
      triggerConfetti('celebration');
    }

    onComplete({
      id: Math.random().toString(36).substring(7),
      date: Date.now(),
      score,
      passed,
      timeSpentSeconds: EXAM_DURATION - timeLeft,
      categoryStats: categoryUpdates,
      questionLogs,
      answers: finalAnswers,
      questionIds: examQuestions.map(q => q.id)
    }, categoryUpdates, questionResults);
  };

  const handleOptionSelect = (qId: string, optIdx: number) => {
    playTapSound();
    const now = Date.now();
    const q = examQuestions.find(x => x.id === qId);
    const isOptionCorrect = q ? optIdx === q.correctIndex : false;
    const currentQuestionElapsed = (questionTimeSpent[qId] || 0) + (now - questionStartTimestamp);

    setAnswers(prev => ({ ...prev, [qId]: optIdx }));

    setQuestionTelemetry(prev => {
      const existing = prev[qId] || { clicks: [] };
      return {
        ...prev,
        [qId]: {
          clicks: [
            ...existing.clicks,
            { optionIndex: optIdx, timestamp: now, elapsedMs: currentQuestionElapsed, isCorrect: isOptionCorrect }
          ],
          firstClickTimeMs: existing.firstClickTimeMs !== undefined ? existing.firstClickTimeMs : currentQuestionElapsed,
          firstOptionIndex: existing.firstOptionIndex !== undefined ? existing.firstOptionIndex : optIdx,
          lastClickTimestamp: now
        }
      };
    });
  };

  const handleNavigateQuestion = (newIndex: number) => {
    updateCurrentQuestionTime();
    setCurrentIndex(newIndex);
  };

  if (examQuestions.length === 0) return null;

  if (!hasStarted) {
    return (
      <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-y-auto shadow-sm transition-colors duration-300 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full max-w-lg">
          <Clock className="text-[#1CB0F6] dark:text-[#38BDF8] mb-4 sm:mb-6 shrink-0 w-16 h-16 sm:w-20 sm:h-20" strokeWidth={3} />
          <h2 className="text-3xl sm:text-4xl font-black text-[#4B4B4B] dark:text-[#F8FAFC] mb-4 sm:mb-6 tracking-widest uppercase">Mock Exam</h2>
          <ul className="text-left text-gray-500 dark:text-gray-400 font-bold space-y-4 mb-8 sm:mb-10 w-full text-sm sm:text-base bg-gray-50 dark:bg-[#0F172A] p-4 sm:p-6 rounded-2xl border-2 border-gray-100 dark:border-[#334155]">
            <li className="flex gap-3 sm:gap-4 items-center"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1CB0F6] dark:bg-[#38BDF8] rounded-full shrink-0"></span> 30 Multiple choice questions</li>
            <li className="flex gap-3 sm:gap-4 items-center"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FFC800] dark:bg-[#FBBF24] rounded-full shrink-0"></span> 15 Minutes time limit</li>
            <li className="flex gap-3 sm:gap-4 items-center"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#58CC02] dark:bg-[#46A302] rounded-full shrink-0"></span> 25/30 required to pass</li>
            <li className="flex gap-3 sm:gap-4 items-center"><span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#CE82FF] dark:bg-[#D946EF] rounded-full shrink-0"></span> No immediate feedback</li>
          </ul>
          <div className="flex flex-col gap-3 sm:gap-4 w-full shrink-0">
            <button onClick={handleStart} className="w-full py-4 sm:py-5 font-black tracking-widest text-white bg-[#1CB0F6] hover:bg-[#1899D6] border-b-4 border-[#1899D6] rounded-[24px] active:border-b-0 active:translate-y-[2px] transition-all uppercase text-base sm:text-lg duration-150">
              Start Exam
            </button>
            <button onClick={onExit} className="w-full py-4 sm:py-5 font-black tracking-widest text-gray-400 dark:text-gray-500 bg-white dark:bg-[#0F172A] border-2 border-gray-200 dark:border-[#334155] border-b-4 rounded-[24px] active:border-b-0 active:translate-y-[2px] transition-all uppercase hover:bg-gray-50 dark:hover:bg-[#1E293B] text-base sm:text-lg duration-150">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const score = Object.keys(answers).filter(id => {
      const q = examQuestions.find(q => q.id === id);
      return q && answers[id] === q.correctIndex;
    }).length;
    
    const passed = score >= PASSING_SCORE;

    return (
      <div className="h-full w-full overflow-hidden bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] shadow-sm transition-colors duration-300">
        <div className="flex flex-col h-full p-4 sm:p-6 text-center">
        <div className="py-4 sm:py-8 shrink-0">
          <h2 className={cn("text-2xl sm:text-3xl font-black uppercase tracking-widest mb-1 sm:mb-2", passed ? "text-[#58CC02] dark:text-[#10B981]" : "text-[#FF4B4B] dark:text-[#F87171]")}>
            {passed ? "PASSED" : "FAILED"}
          </h2>
          <div className="text-5xl sm:text-6xl leading-none font-black text-[#4B4B4B] dark:text-[#F8FAFC] mb-1 sm:mb-2">{score}/30</div>
          <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider text-[10px] sm:text-xs mt-2 sm:mt-4">
            Time taken: {Math.floor((EXAM_DURATION - timeLeft) / 60)}m {((EXAM_DURATION - timeLeft) % 60).toString().padStart(2, '0')}s
          </p>
        </div>

        <button onClick={onExit} className="w-full max-w-sm mx-auto mb-4 sm:mb-8 bg-[#1CB0F6] border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-[2px] text-white font-black text-sm sm:text-base uppercase tracking-widest py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shrink-0">
          Return to Menu
        </button>

        <div className="text-left max-w-2xl mx-auto w-full flex-1 overflow-y-auto scrollbar-hide">
          <h3 className="text-base sm:text-xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 sm:mb-6">Review Incorrect Answers</h3>
          <div className="space-y-4 sm:space-y-6 pb-6">
            {examQuestions.filter(q => answers[q.id] !== q.correctIndex).map((q, idx) => (
              <div key={q.id} className="bg-[#FFE5E5] dark:bg-[#7F1D1D] border-2 border-[#FF4B4B] dark:border-[#EF4444] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-colors">
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/70 dark:bg-black/30 border border-[#FF4B4B]/30 text-[#D80000] dark:text-[#FCA5A5]">
                    Categoria: {q.category}{q.grammarTopic ? ` • ${q.grammarTopic}` : ''}
                  </span>
                </div>
                <p className="font-bold text-base sm:text-lg text-[#3C3C3C] dark:text-[#F8FAFC] mb-3 sm:mb-4">{q.prompt}</p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-[#D80000] dark:text-[#FCA5A5] uppercase text-[10px] sm:text-xs tracking-widest">Your Answer:</span>
                    <span className="text-[#D80000] dark:text-[#FCA5A5] line-through font-medium">
                      {answers[q.id] !== undefined ? q.options[answers[q.id]] : "No answer"}
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="font-bold text-[#46A302] dark:text-[#34D399] uppercase text-[10px] sm:text-xs tracking-widest">Correct:</span>
                    <span className="text-[#46A302] dark:text-[#34D399] font-bold">
                      {q.options[q.correctIndex]}
                    </span>
                  </div>
                  <p className="text-[#4B4B4B] dark:text-gray-200 font-medium mt-3 sm:mt-4 bg-white/60 dark:bg-black/20 p-3 sm:p-4 rounded-xl border border-[#FF4B4B]/20 dark:border-[#EF4444]/20">
                    {q.explanation}
                  </p>
                </div>
              </div>
            ))}
            {score === 30 && (
              <p className="text-[#58CC02] dark:text-[#10B981] font-black text-center p-4 sm:p-6 bg-[#D7FFB8] dark:bg-[#064E3B] rounded-2xl sm:rounded-3xl border-2 border-[#58CC02] dark:border-[#46A302] transition-colors">
                Perfect score! Nothing to review.
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    );
  }

  const question = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / 30) * 100;
  
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border-2 sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <header className="flex flex-col gap-2 p-3 sm:p-4 border-b-2 border-gray-200 dark:border-[#334155] shrink-0 transition-colors">
        <div className="flex items-center justify-between">
          <button onClick={onExit} className="p-1 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155] rounded-full transition-colors">
            <X size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </button>
          <div className={cn("font-black font-mono text-base sm:text-xl flex items-center gap-1 sm:gap-2", timeLeft < 120 ? "text-[#FF4B4B] dark:text-[#EF4444]" : "text-[#1CB0F6] dark:text-[#38BDF8]")}>
            <Clock size={18} className="sm:w-5 sm:h-5" strokeWidth={3} /> {timeStr}
          </div>
          <button 
            onClick={() => handleFinish()}
            className="text-[10px] sm:text-xs font-black text-[#CE82FF] dark:text-[#D946EF] hover:bg-[#CE82FF]/10 dark:hover:bg-[#D946EF]/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl uppercase tracking-widest transition-colors"
          >
            Submit
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 sm:mt-2">
          <span className="text-[10px] sm:text-xs font-black text-gray-400 dark:text-gray-500 w-8 sm:w-10 text-right">{answeredCount}/30</span>
          <div className="flex-1 bg-gray-200 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden transition-colors">
            <div className="bg-[#1CB0F6] dark:bg-[#38BDF8] h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <span className="px-4 py-1.5 bg-[#FFC800] dark:bg-[#F59E0B] text-white text-xs sm:text-sm font-black uppercase rounded-full tracking-widest shadow-sm">
            Question {currentIndex + 1}
          </span>
          {corpus === 'initial' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#58CC02]/10 text-[#58CC02] border border-[#58CC02]/30 text-xs font-black uppercase rounded-full tracking-wider">
              <BookmarkCheck size={14} />
              Primo Corpus (60)
            </span>
          )}
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-[#3C3C3C] dark:text-[#F8FAFC] mb-6 sm:mb-8 leading-tight shrink-0">
          {question.prompt}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(question.id, idx)}
                className={cn(
                  "p-4 sm:p-5 text-left border-2 rounded-[24px] group transition-all duration-150 flex items-center min-h-[90px]",
                  isSelected 
                    ? "bg-[#DDF4FF] dark:bg-[#0369A1] border-[#84D8FF] dark:border-[#38BDF8] text-[#1899D6] dark:text-[#E0F2FE] border-b-4" 
                    : "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-400 text-[#4B4B4B] dark:text-gray-200 border-b-4 active:border-b-2 active:translate-y-[2px]"
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className={cn("w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base flex shrink-0 items-center justify-center border-2 rounded-[14px] font-black transition-colors", 
                    isSelected ? "border-[#84D8FF] dark:border-[#38BDF8] bg-white dark:bg-[#0369A1] text-[#1899D6] dark:text-[#E0F2FE]" : "border-gray-200 dark:border-[#334155] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#1E293B]"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-base sm:text-lg font-bold leading-snug flex-1">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <div className="p-3 sm:p-4 border-t-2 border-gray-200 dark:border-[#334155] bg-white dark:bg-[#1E293B] shrink-0 flex items-center transition-colors min-h-[70px] sm:min-h-[80px]">
        <div className="max-w-4xl w-full mx-auto flex justify-between items-center px-2 sm:px-4">
          <button
            onClick={() => handleNavigateQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 sm:p-3 text-gray-400 dark:text-gray-500 disabled:opacity-30 rounded-xl hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors border-2 border-transparent active:bg-gray-200 dark:active:bg-[#475569]"
          >
            <ChevronLeft size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
          </button>
          
          <div className="flex gap-1 overflow-x-auto max-w-[150px] sm:max-w-xs px-1 scrollbar-hide items-center">
            {examQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleNavigateQuestion(idx)}
                className={cn(
                  "h-1.5 sm:h-2 min-w-[6px] sm:min-w-[8px] flex-1 rounded-full transition-all cursor-pointer", 
                  currentIndex === idx ? "bg-[#4B4B4B] dark:bg-[#F8FAFC] h-2.5 sm:h-3" : answers[q.id] !== undefined ? "bg-[#1CB0F6] dark:bg-[#38BDF8]" : "bg-gray-200 dark:bg-[#334155]"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => handleNavigateQuestion(Math.min(29, currentIndex + 1))}
            disabled={currentIndex === 29}
            className="p-2 sm:p-3 text-gray-400 dark:text-gray-500 disabled:opacity-30 rounded-xl hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors border-2 border-transparent active:bg-gray-200 dark:active:bg-[#475569]"
          >
            <ChevronRight size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}
