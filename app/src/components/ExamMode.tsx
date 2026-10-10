import { useState, useEffect, useRef } from 'react';
import { ExamHistory, ExamQuestionLog, QuestionClickEvent, CorpusType, PaywallReason } from '../types';
import { X, Clock, ChevronLeft, ChevronRight, Lock, BookOpen, Loader2 } from 'lucide-react';
import { cn, formatDuration, formatNumber, errorCode, prefersReducedMotion } from '../lib/utils';
import { playTapSound, playVictorySound, triggerConfetti } from '../lib/audio';
import { Illustrazione } from '../brand/Illustrazione';
import { Screen, TopBar } from './ui';
import ConfirmDialog from './ConfirmDialog';
import { useAccess } from '../access/context';
import { canStartSim, remainingFreeSims, isPass } from '../access/entitlement';
import type { ExamResult, ExamSession, PublicQuestion } from '../access/provider';
import { FORMATS, type ExamFormat, type FormatId } from '../config/offer';

interface ExamModeProps {
  onComplete: (
    history: ExamHistory,
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>
  ) => void;
  onExit: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  /** Se c'è, sotto una domanda sbagliata compare "Studia la regola". */
  onOpenTheory?: (id: string) => void;
  /** Non più usato: la simulazione prende le domande dal formato scelto. Resta perché App lo passa ancora. */
  corpus?: CorpusType;
}

type Phase = 'select' | 'starting' | 'running' | 'submitting' | 'submitError' | 'done';

const FORMAT_LIST: ExamFormat[] = [FORMATS.ente, FORMATS.teng];

function messaggioErrore(e: unknown): string {
  const code = errorCode(e);
  if (/network|fetch|failed to|offline/i.test(code)) return 'Non riesco a collegarmi. Controlla la connessione e riprova.';
  return 'Qualcosa è andato storto. Riprova tra un momento.';
}

export default function ExamMode({ onComplete, onExit, onNeedPass, onOpenTheory }: ExamModeProps) {
  const { provider, entitlement, simsDone, track } = useAccess();

  const [phase, setPhase] = useState<Phase>('select');
  const [error, setError] = useState<string | null>(null);
  const [comingSoon, setComingSoon] = useState<Set<FormatId>>(new Set());
  const [session, setSession] = useState<ExamSession | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedFinal, setElapsedFinal] = useState(0);
  const [confirm, setConfirm] = useState<null | 'exit' | 'submit'>(null);

  // Stato che non serve a disegnare lo schermo: tempi per domanda, clic, scadenza. Nei ref per non avere valori vecchi nel timer.
  const aliveRef = useRef(true);
  const answersRef = useRef<Record<string, number>>({});
  const deadlineRef = useRef(0);
  const startedAtRef = useRef(0);
  const submittingRef = useRef(false);
  const completedRef = useRef(false);
  const timeSpentRef = useRef<Record<string, number>>({});
  const qStartRef = useRef(0);
  const indexRef = useRef(0);
  const clicksRef = useRef<Record<string, QuestionClickEvent[]>>({});
  const pendingRef = useRef<{ payload: Record<string, number | null>; elapsed: number } | null>(null);

  useEffect(() => {
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  const format: ExamFormat | null = session ? FORMATS[session.format] : null;
  const questions: PublicQuestion[] = session?.questions ?? [];

  // ---- Avvio
  const startFormat = async (id: FormatId) => {
    if (phase !== 'select') return;
    if (!canStartSim(entitlement, id, simsDone)) {
      onNeedPass(id === 'teng' ? 'teng' : 'simulazione');
      return;
    }
    setError(null);
    setPhase('starting');
    try {
      const s = await provider.startExam(id);
      if (!aliveRef.current) return;
      if (!s.questions || s.questions.length === 0) throw new Error('sessione_vuota');
      const f = FORMATS[s.format ?? id];
      const now = Date.now();
      startedAtRef.current = now;
      deadlineRef.current = now + f.minutes * 60 * 1000;
      qStartRef.current = now;
      indexRef.current = 0;
      answersRef.current = {};
      timeSpentRef.current = {};
      clicksRef.current = {};
      submittingRef.current = false;
      completedRef.current = false;
      pendingRef.current = null;
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(f.minutes * 60);
      setSession(s);
      setPhase('running');
      track({ name: 'sim_started', format: s.format ?? id });
    } catch (e) {
      if (!aliveRef.current) return;
      if (errorCode(e).includes('formato_non_disponibile')) {
        setComingSoon(prev => new Set(prev).add(id));
      } else {
        setError(messaggioErrore(e));
      }
      setPhase('select');
    }
  };

  // ---- Tempo: si calcola dalla scadenza, non contando i secondi, così non si sfasa se la scheda va in secondo piano
  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(prev => (prev === left ? prev : left));
      if (left === 0) void finish();
    };
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, session]);

  const flushQuestionTime = () => {
    const q = questions[indexRef.current];
    if (!q) return;
    const now = Date.now();
    timeSpentRef.current[q.id] = (timeSpentRef.current[q.id] || 0) + Math.max(0, now - qStartRef.current);
    qStartRef.current = now;
  };

  // ---- Consegna
  const finish = async () => {
    if (!session || !format) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (!pendingRef.current) {
      flushQuestionTime();
      const payload: Record<string, number | null> = {};
      for (const q of session.questions) payload[q.id] = answersRef.current[q.id] ?? null;
      const elapsed = Math.min(format.minutes * 60, Math.round((Date.now() - startedAtRef.current) / 1000));
      pendingRef.current = { payload, elapsed };
    }
    const { payload, elapsed } = pendingRef.current;
    setElapsedFinal(elapsed);
    setError(null);
    setPhase('submitting');
    try {
      const res = await provider.submitExam(session.id, payload, elapsed);
      if (!aliveRef.current) return;
      complete(res, payload, elapsed);
    } catch (e) {
      submittingRef.current = false;
      if (!aliveRef.current) return;
      setError(messaggioErrore(e));
      setPhase('submitError');
    }
  };

  const complete = (res: ExamResult, payload: Record<string, number | null>, elapsed: number) => {
    if (!session || completedRef.current) return;
    completedRef.current = true;
    const byId = new Map(res.perQuestion.map(r => [r.id, r]));
    const categoryUpdates: Record<string, { correct: number; total: number }> = {};
    const questionResults: Record<string, 'correct' | 'incorrect' | 'omitted'> = {};
    const questionLogs: ExamQuestionLog[] = [];
    const answered: Record<string, number> = {};

    for (const q of session.questions) {
      const r = byId.get(q.id);
      const given = payload[q.id];
      const cu = categoryUpdates[q.category] || (categoryUpdates[q.category] = { correct: 0, total: 0 });
      cu.total++;
      const isOmitted = given === null || given === undefined;
      const isCorrect = r?.correct === true;
      if (isCorrect) cu.correct++;
      questionResults[q.id] = isOmitted ? 'omitted' : isCorrect ? 'correct' : 'incorrect';
      if (!isOmitted) answered[q.id] = given as number;

      // Nei clic registrati durante la prova non si sapeva ancora quale fosse la risposta esatta: lo si completa ora
      const clicks = (clicksRef.current[q.id] || []).map(c => ({ ...c, isCorrect: r ? c.optionIndex === r.correctIndex : false }));
      questionLogs.push({
        questionId: q.id,
        userAnswerIndex: isOmitted ? null : (given as number),
        correctIndex: r?.correctIndex ?? -1,
        isCorrect,
        timeSpentMs: timeSpentRef.current[q.id] || 0,
        firstClickTimeMs: clicks.length > 0 ? clicks[0].elapsedMs : undefined,
        firstOptionIndex: clicks.length > 0 ? clicks[0].optionIndex : (isOmitted ? null : (given as number)),
        switchCount: Math.max(0, clicks.length - 1),
        trajectory: clicks.map(c => c.optionIndex),
        hesitationBeforeSubmitMs: clicks.length > 0 ? Math.max(0, Date.now() - clicks[clicks.length - 1].timestamp) : undefined,
        clickEvents: clicks,
        category: q.category,
        grammarTopic: q.grammarTopic,
        level: q.level,
      });
    }

    if (res.passed) {
      playVictorySound();
      if (!prefersReducedMotion()) triggerConfetti('celebration');
    }
    track({ name: 'sim_done', format: session.format, passed: res.passed });
    setResult(res);
    setPhase('done');

    onComplete({
      id: session.id,
      date: Date.now(),
      score: res.rawCorrect,
      passed: res.passed,
      timeSpentSeconds: elapsed,
      categoryStats: categoryUpdates,
      questionLogs,
      answers: answered,
      questionIds: session.questions.map(q => q.id),
      format: session.format,
    }, categoryUpdates, questionResults);
  };

  // ---- Azioni durante la prova
  const handleOptionSelect = (qId: string, optIdx: number) => {
    if (phase !== 'running') return;
    playTapSound();
    const now = Date.now();
    const spent = (timeSpentRef.current[qId] || 0) + (now - qStartRef.current);
    (clicksRef.current[qId] ||= []).push({ optionIndex: optIdx, timestamp: now, elapsedMs: spent, isCorrect: false });
    answersRef.current = { ...answersRef.current, [qId]: optIdx };
    setAnswers(answersRef.current);
  };

  const goTo = (i: number) => {
    flushQuestionTime();
    const next = Math.min(questions.length - 1, Math.max(0, i));
    indexRef.current = next;
    setCurrentIndex(next);
  };

  const requestExit = () => {
    if (phase === 'running' && Object.keys(answers).length > 0) setConfirm('exit');
    else onExit();
  };

  const requestSubmit = () => {
    if (questions.length - Object.keys(answers).length > 0) setConfirm('submit');
    else void finish();
  };

  const missing = questions.length - Object.keys(answers).length;
  const dialog = (
    <ConfirmDialog
      open={confirm !== null}
      title={confirm === 'exit' ? 'Uscire dalla simulazione?' : 'Consegnare adesso?'}
      message={confirm === 'exit'
        ? 'La simulazione non verrà salvata e non conta tra quelle fatte.'
        : `Hai ancora ${missing} ${missing === 1 ? 'domanda' : 'domande'} senza risposta. Dopo la consegna non si torna indietro.`}
      confirmLabel={confirm === 'exit' ? 'Esci' : 'Consegna'}
      cancelLabel={confirm === 'exit' ? 'Resta' : 'Continua'}
      danger={confirm === 'exit'}
      onCancel={() => setConfirm(null)}
      onConfirm={() => {
        const c = confirm;
        setConfirm(null);
        if (c === 'exit') onExit();
        else void finish();
      }}
    />
  );

  // ================== Schermata di scelta del formato ==================
  if (phase === 'select' || phase === 'starting') {
    const starting = phase === 'starting';
    const freeLeft = remainingFreeSims(entitlement, simsDone);
    return (
      <Screen>
        <TopBar onBack={onExit} />
        <div className="flex flex-col items-center text-center shrink-0">
          <Illustrazione kit="kit-rosso" nome="simulazione-esame" lato={110} />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-2">Simulazione</h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
            Scegli il formato. Nessun feedback durante la prova: le risposte e le spiegazioni arrivano alla consegna.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5] bg-[#FEE2E2] dark:bg-[#7F1D1D]/40 border border-[#EF4444]/40 rounded-2xl px-4 py-3">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {FORMAT_LIST.map(f => {
            const soon = comingSoon.has(f.id);
            const allowed = canStartSim(entitlement, f.id, simsDone);
            const locked = !allowed;
            return (
              <div key={f.id} className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{f.name}</h3>
                  {soon && <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/50 text-[#92400E] dark:text-[#FCD34D]">In arrivo</span>}
                  {!soon && locked && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-[#334155] text-gray-600 dark:text-gray-300">
                      <Lock size={12} strokeWidth={3} /> Con il Pass
                    </span>
                  )}
                </div>
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  <div><dt className="text-xs font-bold text-gray-400 dark:text-gray-500">Domande</dt><dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.questions}</dd></div>
                  <div><dt className="text-xs font-bold text-gray-400 dark:text-gray-500">Tempo</dt><dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.minutes} minuti</dd></div>
                  <div><dt className="text-xs font-bold text-gray-400 dark:text-gray-500">Soglia</dt><dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.passMark} su {f.questions}</dd></div>
                  <div><dt className="text-xs font-bold text-gray-400 dark:text-gray-500">Opzioni</dt><dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.options} per domanda</dd></div>
                  <div className="col-span-2"><dt className="text-xs font-bold text-gray-400 dark:text-gray-500">Penalità</dt>
                    <dd className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{f.penalty > 0 ? `${formatNumber(f.penalty)} punti per ogni risposta sbagliata` : 'Nessuna'}</dd></div>
                </dl>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">{f.notes}</p>
                {f.id === 'ente' && !isPass(entitlement) && (
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {freeLeft > 0 ? 'La prima simulazione è gratuita.' : 'La simulazione gratuita è già stata usata: con il Pass sono illimitate.'}
                  </p>
                )}
                <div className="mt-auto pt-1">
                  <button
                    type="button"
                    disabled={starting || soon}
                    onClick={() => { playTapSound(); void startFormat(f.id); }}
                    className={cn(
                      "w-full py-3.5 px-5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-150 active:scale-[.99] disabled:opacity-50 disabled:pointer-events-none",
                      locked
                        ? "bg-white dark:bg-[#1E293B] border border-[#EF4444] text-[#EF4444]"
                        : "bg-[#EF4444] hover:bg-[#DC2626] text-white"
                    )}
                  >
                    {starting ? <><Loader2 size={18} className="animate-spin" /> Preparo le domande</>
                      : soon ? 'In arrivo'
                      : locked ? <><Lock size={16} strokeWidth={3} /> Sblocca con il Pass</>
                      : 'Inizia'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {dialog}
      </Screen>
    );
  }

  if (!session || !format) return null;

  // ================== Consegna in corso o fallita ==================
  if (phase === 'submitting' || phase === 'submitError') {
    return (
      <Screen className="items-center justify-center text-center">
        {phase === 'submitting' ? (
          <>
            <Loader2 size={36} className="animate-spin text-[#EF4444]" />
            <p className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Consegno e correggo…</p>
          </>
        ) : (
          <>
            <p role="alert" className="font-bold text-[#B91C1C] dark:text-[#FCA5A5] max-w-sm">{error}</p>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 max-w-sm">Le tue risposte sono ancora qui. Il tempo è fermo: riprova a consegnare.</p>
            <button onClick={() => { playTapSound(); void finish(); }} className="w-full max-w-xs bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[.99]">
              Riprova a consegnare
            </button>
            <button onClick={onExit} className="text-sm font-bold text-gray-500 dark:text-gray-400 underline">Esci senza salvare</button>
          </>
        )}
      </Screen>
    );
  }

  // ================== Esito ==================
  if (phase === 'done' && result) {
    const total = format.questions;
    const passed = result.passed;
    const categoryTotals: Record<string, { correct: number; total: number }> = {};
    const perQ = new Map(result.perQuestion.map(r => [r.id, r]));
    questions.forEach(q => {
      const c = categoryTotals[q.category] || (categoryTotals[q.category] = { correct: 0, total: 0 });
      c.total++;
      if (perQ.get(q.id)?.correct === true) c.correct++;
    });
    const wrongQuestions = questions.filter(q => perQ.get(q.id)?.correct !== true);

    return (
      <div className="h-full w-full overflow-hidden bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] shadow-sm transition-colors duration-300">
        <div className="flex flex-col h-full p-4 sm:p-6 text-center">
          <div className="py-3 sm:py-6 shrink-0">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">{format.name}</p>
            <h2 className={cn("text-2xl sm:text-3xl font-bold mb-1 sm:mb-2", passed ? "text-[#16A34A] dark:text-[#10B981]" : "text-[#EF4444] dark:text-[#F87171]")}>
              {passed ? 'Superata' : 'Non superata'}
            </h2>
            <div className="text-5xl sm:text-6xl leading-none font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1 sm:mb-2">{result.rawCorrect}/{total}</div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {passed
                ? `Soglia ${format.passMark} su ${total}: raggiunta.`
                : `Soglia ${format.passMark} su ${total}: ${format.passMark - result.rawCorrect === 1 ? 'ti è mancata 1 risposta' : `ti sono mancate ${format.passMark - result.rawCorrect} risposte`}.`}
            </p>
            {format.penalty > 0 && (
              <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
                Punteggio con penalità: {formatNumber(result.score)}
                <span className="font-semibold text-gray-500 dark:text-gray-400"> ({formatNumber(format.penalty)} per ognuna delle {result.wrong} sbagliate)</span>
              </p>
            )}
            <p className="text-gray-400 dark:text-gray-500 font-bold text-xs mt-3">
              {result.rawCorrect} giuste, {result.wrong} sbagliate, {result.omitted} senza risposta. Tempo: {formatDuration(elapsedFinal)}
            </p>
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 mt-1 max-w-md mx-auto">
              È una simulazione: ti dice come stai andando, non prevede il risultato del test vero.
            </p>
          </div>

          <button onClick={onExit} className="w-full max-w-sm mx-auto mb-4 sm:mb-6 bg-[#EF4444] hover:bg-[#DC2626] active:scale-[.99] text-white font-bold text-base py-3.5 rounded-2xl transition-all shrink-0">
            Torna al menu
          </button>

          <div className="text-left max-w-2xl mx-auto w-full flex-1 overflow-y-auto scrollbar-hide">
            {Object.keys(categoryTotals).length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.entries(categoryTotals).map(([cat, r]) => (
                  <div key={cat} className="bg-gray-50 dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] rounded-2xl p-3 sm:p-4">
                    <div className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500">{cat}</div>
                    <div className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{r.correct}/{r.total}</div>
                  </div>
                ))}
              </div>
            )}
            <h3 className="text-base sm:text-xl font-bold text-gray-400 dark:text-gray-500 mb-4 sm:mb-6">Rivedi le risposte sbagliate</h3>
            <div className="space-y-4 sm:space-y-6 pb-6">
              {wrongQuestions.map(q => {
                const r = perQ.get(q.id);
                const given = answers[q.id];
                return (
                  <div key={q.id} className="bg-[#FEE2E2] dark:bg-[#7F1D1D] border border-[#EF4444] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm transition-colors">
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-white/70 dark:bg-black/30 border border-[#EF4444]/30 text-[#B91C1C] dark:text-[#FCA5A5]">
                        Categoria: {q.category}{q.grammarTopic ? ` • ${q.grammarTopic}` : ''}
                      </span>
                    </div>
                    <p className="font-bold text-base sm:text-lg text-[#1E293B] dark:text-[#F8FAFC] mb-3 sm:mb-4">{q.prompt}</p>
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-bold text-[#B91C1C] dark:text-[#FCA5A5] text-[10px] sm:text-xs">La tua risposta:</span>
                        <span className={cn("text-[#B91C1C] dark:text-[#FCA5A5] font-medium", given !== undefined && "line-through")}>
                          {given !== undefined ? q.options[given] : 'Nessuna risposta'}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <span className="font-bold text-[#15803D] dark:text-[#34D399] text-[10px] sm:text-xs">Corretta:</span>
                        <span className="text-[#15803D] dark:text-[#34D399] font-bold">{r ? q.options[r.correctIndex] : ''}</span>
                      </div>
                      {r?.explanation && (
                        <p className="text-[#0F172A] dark:text-gray-200 font-medium mt-3 sm:mt-4 bg-white/60 dark:bg-black/20 p-3 sm:p-4 rounded-xl border border-[#EF4444]/20">
                          {r.explanation}
                        </p>
                      )}
                      {r?.theoryId && onOpenTheory && (
                        <button
                          onClick={() => { playTapSound(); onOpenTheory(r.theoryId!); }}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#B91C1C] dark:text-[#FCA5A5] underline underline-offset-2"
                        >
                          <BookOpen size={14} /> Studia la regola
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {wrongQuestions.length === 0 && (
                <p className="text-[#15803D] dark:text-[#10B981] font-bold text-center p-4 sm:p-6 bg-[#DCFCE7] dark:bg-[#064E3B] rounded-2xl sm:rounded-3xl border border-[#22C55E] dark:border-[#16A34A] transition-colors">
                  Punteggio perfetto: niente da rivedere.
                </p>
              )}
            </div>
          </div>
        </div>
        {dialog}
      </div>
    );
  }

  // ================== Prova in corso ==================
  const question = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const timeStr = `${m}:${s.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300">
      <header className="flex flex-col gap-2 p-3 sm:p-4 border-b border-gray-100 dark:border-[#334155] shrink-0 transition-colors">
        <div className="flex items-center justify-between">
          <button onClick={requestExit} aria-label="Esci dalla simulazione" className="p-1 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#334155] rounded-full transition-colors">
            <X size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </button>
          <div role="timer" aria-label="Tempo rimasto" className={cn("font-bold tabular-nums text-base sm:text-xl flex items-center gap-1 sm:gap-2", timeLeft < 120 ? "text-[#EF4444]" : "text-[#0F172A] dark:text-[#F8FAFC]")}>
            <Clock size={18} className="sm:w-5 sm:h-5" strokeWidth={3} /> {timeStr}
          </div>
          <button
            onClick={requestSubmit}
            className="text-[10px] sm:text-xs font-bold text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/40 border border-[#FCA5A5] px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl transition-colors"
          >
            Consegna
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 sm:mt-2">
          <span className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 w-8 sm:w-10 text-right">{answeredCount}/{questions.length}</span>
          <div className="flex-1 bg-gray-200 dark:bg-[#334155] h-3 sm:h-4 rounded-full overflow-hidden transition-colors">
            <div className="bg-[#EF4444] h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400">
            Domanda {currentIndex + 1} di {questions.length}
          </span>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{format.name}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-5 sm:mb-6 leading-snug shrink-0">
          {question.prompt}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 content-start">
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(question.id, idx)}
                aria-pressed={isSelected}
                className={cn(
                  "p-3 sm:p-3.5 text-left border rounded-2xl group transition-all duration-150 flex items-center min-h-[56px]",
                  isSelected
                    ? "bg-[#FEF2F2] dark:bg-[#7F1D1D]/40 border-[#EF4444] text-[#0F172A] dark:text-[#F8FAFC]"
                    : "border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] hover:border-gray-300 dark:hover:border-gray-400 text-[#0F172A] dark:text-gray-200 active:scale-[.99]"
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className={cn("w-8 h-8 text-sm flex shrink-0 items-center justify-center border rounded-full font-bold transition-colors",
                    isSelected ? "border-[#EF4444] bg-[#EF4444] text-white" : "border-gray-200 dark:border-[#334155] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-[#1E293B]"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-[15px] sm:text-base font-semibold leading-snug flex-1">{opt}</span>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      <div className="p-3 sm:p-4 border-t border-gray-100 dark:border-[#334155] bg-white dark:bg-[#1E293B] shrink-0 flex items-center transition-colors min-h-[70px] sm:min-h-[80px]">
        <div className="max-w-4xl w-full mx-auto flex justify-between items-center px-2 sm:px-4">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Domanda precedente"
            className="p-2 sm:p-3 text-gray-400 dark:text-gray-500 disabled:opacity-30 rounded-xl hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors border border-transparent active:bg-gray-200 dark:active:bg-[#475569]"
          >
            <ChevronLeft size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
          </button>

          <div className="flex gap-1 overflow-x-auto max-w-[150px] sm:max-w-xs px-1 scrollbar-hide items-center">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => goTo(idx)}
                aria-label={`Vai alla domanda ${idx + 1}`}
                className={cn(
                  "h-1.5 sm:h-2 min-w-[6px] sm:min-w-[8px] flex-1 rounded-full transition-all cursor-pointer",
                  currentIndex === idx ? "bg-[#0F172A] dark:bg-[#F8FAFC] h-2.5 sm:h-3" : answers[q.id] !== undefined ? "bg-[#EF4444]" : "bg-gray-200 dark:bg-[#334155]"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            aria-label="Domanda successiva"
            className="p-2 sm:p-3 text-gray-400 dark:text-gray-500 disabled:opacity-30 rounded-xl hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors border border-transparent active:bg-gray-200 dark:active:bg-[#475569]"
          >
            <ChevronRight size={24} className="sm:w-8 sm:h-8" strokeWidth={3} />
          </button>
        </div>
      </div>
      {dialog}
    </div>
  );
}
