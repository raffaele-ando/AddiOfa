import { useState, useEffect, useRef } from 'react';
import { ExamHistory, ExamQuestionLog, QuestionClickEvent, CorpusType, PaywallReason } from '../types';
import { cn, errorCode } from '../lib/utils';
import { playTapSound, playVictorySound } from '../lib/audio';
import { Icona } from '../brand/icone/Icona';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Screen, TopBar } from './ui';
import ConfirmDialog from './ConfirmDialog';
import EsitoSimulazione from './esito/EsitoSimulazione';
import { useAccess } from '../access/context';
import { canStartSim } from '../access/entitlement';
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
  /** Quante risposte entrano nella stima (diagnostico + simulazioni): serve al foglio "Come viene calcolata la stima" dell'esito. Facoltativa. */
  risposteStima?: number;
  /** Non più usato: la simulazione prende le domande dal formato scelto. Resta perché App lo passa ancora. */
  corpus?: CorpusType;
}

type Phase = 'select' | 'starting' | 'running' | 'submitting' | 'submitError' | 'done';

// Solo il test di recupero LinguaViva: il TENG resta dormiente nel codice e nel Worker, non si offre. Con un solo formato non c'è nulla da scegliere:
// la prova parte da sola (la fase «select» resta solo come stato di attesa dell'avvio, con il lucchetto o l'errore se non parte).
const FORMATO_UNICO: FormatId = 'ente';

function messaggioErrore(e: unknown): string {
  const code = errorCode(e);
  if (/network|fetch|failed to|offline/i.test(code)) return 'Nessuna connessione. Riprova.';
  return 'Qualcosa è andato storto. Riprova.';
}

export default function ExamMode({ onComplete, onExit, onNeedPass, onOpenTheory, risposteStima }: ExamModeProps) {
  const { provider, entitlement, simsDone, track } = useAccess();
  const bloccata = !canStartSim(entitlement, FORMATO_UNICO, simsDone);

  const [phase, setPhase] = useState<Phase>('select');
  const [error, setError] = useState<string | null>(null);
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

  // La prova parte da sola; se non si può (limite gratuito finito) si apre il Pass e resta il lucchetto.
  const partito = useRef(false);
  useEffect(() => {
    if (partito.current) return;
    partito.current = true;
    if (!bloccata) void startFormat(FORMATO_UNICO);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const format: ExamFormat | null = session ? FORMATS[session.format] : null;
  const questions: PublicQuestion[] = session?.questions ?? [];

  // ---- Avvio
  const startFormat = async (id: FormatId, rifai = false) => {
    if (phase !== 'select' && !(rifai && phase === 'done')) return;
    if (!canStartSim(entitlement, id, simsDone)) {
      onNeedPass(id === 'teng' ? 'teng' : 'simulazione');
      return;
    }
    setError(null);
    setResult(null);
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
      setError(errorCode(e).includes('formato_non_disponibile') ? 'Formato non disponibile.' : messaggioErrore(e));
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

    if (res.passed) playVictorySound();
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

  // ================== Avvio (nessuna scelta: un solo formato) ==================
  // Preparo le domande: solo il caricamento. Se non parte, l'icona dice perché (lucchetto = serve il Pass, avviso = errore) e un pulsante.
  if (phase === 'select' || phase === 'starting') {
    const mostraStato = phase === 'select' && (bloccata || !!error);
    return (
      <Screen>
        <TopBar onBack={onExit} />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {!mostraStato ? (
            <div role="status" aria-label="Preparo le domande"><IllustrazioneAnimata nome="attesa-caricamento" lato={110} /></div>
          ) : (
            <div className="flex w-full max-w-xs flex-col items-center gap-4">
              <span aria-hidden className={cn('grid h-16 w-16 place-items-center rounded-full', error ? 'bg-basso-tinta text-basso-numero' : 'bg-azione-tinta text-azione-scuro')}>
                <Icona nome={error ? 'stato-attenzione' : 'blocco'} size={30} />
              </span>
              {error && <p role="alert" className="text-[15px] leading-[22px] font-bold text-testo">{error}</p>}
              <button type="button" onClick={() => { playTapSound(); if (bloccata) onNeedPass('simulazione'); else void startFormat(FORMATO_UNICO); }}
                aria-label={bloccata ? 'Altre simulazioni con il Pass' : 'Riprova'}
                className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-azione text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
                <Icona nome={bloccata ? 'pass' : 'riprova'} size={26} />
              </button>
            </div>
          )}
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
          <div role="status" aria-label="Consegno e correggo" className="flex flex-col items-center gap-3">
            <IllustrazioneAnimata nome="attesa-caricamento" lato={110} />
          </div>
        ) : (
          <div className="flex w-full max-w-xs flex-col items-center gap-4">
            <span aria-hidden className="grid h-16 w-16 place-items-center rounded-full bg-basso-tinta text-basso-numero"><Icona nome="stato-attenzione" size={30} /></span>
            <p role="alert" className="text-[15px] leading-[22px] font-bold text-testo">{error}</p>
            <div className="flex w-full gap-2">
              <button type="button" onClick={() => { playTapSound(); void finish(); }} aria-label="Riprova a consegnare"
                className="flex h-[54px] flex-1 items-center justify-center rounded-2xl bg-azione text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
                <Icona nome="riprova" size={26} />
              </button>
              <button type="button" onClick={onExit} aria-label="Esci senza salvare"
                className="grid h-[54px] w-16 shrink-0 place-items-center rounded-2xl border border-linea bg-superficie text-testo-tenue transition-colors duration-100 hover:text-testo">
                <Icona nome="chiudi" size={24} />
              </button>
            </div>
          </div>
        )}
      </Screen>
    );
  }

  // ================== Esito ==================
  if (phase === 'done' && result) {
    return (
      <>
        <EsitoSimulazione
          format={format}
          result={result}
          questions={questions}
          answers={answers}
          elapsedSeconds={elapsedFinal}
          onExit={onExit}
          onOpenTheory={onOpenTheory}
          risposteStima={risposteStima}
          retryLocked={!canStartSim(entitlement, format.id, simsDone)}
          onRetry={() => void startFormat(format.id, true)}
        />
        {dialog}
      </>
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
    <div className="flex flex-col h-full w-full sm:max-h-[calc(100dvh-3rem)] bg-superficie sm:rounded-[32px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      <header className="flex flex-col gap-2 p-3 sm:p-4 border-b border-linea shrink-0 transition-colors duration-100">
        <div className="flex items-center justify-between">
          <button onClick={requestExit} aria-label="Esci dalla simulazione" className="p-1 sm:p-2 text-testo-tenue hover:text-testo hover:bg-linea rounded-full transition-colors duration-100">
            <Icona nome="chiudi" size={22} />
          </button>
          <div role="timer" aria-label="Tempo rimasto" className={cn("font-bold tabular-nums text-base sm:text-xl flex items-center gap-1.5 rounded-full px-3 py-1", timeLeft < 120 ? "bg-basso-tinta text-basso-testo" : "bg-medio-tinta text-medio-testo")}>
            <Icona nome="tempo" size={19} /> {timeStr}
          </div>
          <button
            onClick={requestSubmit}
            className="text-xs sm:text-sm font-bold text-azione hover:bg-azione-tinta border border-azione/60 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[10px] transition-colors duration-100"
          >
            Consegna
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1 sm:mt-2">
          <span className="text-[11px] sm:text-xs font-bold tabular-nums text-testo-tenue w-10 text-right">{answeredCount}/{questions.length}</span>
          <div className="flex-1 bg-tacca h-3 sm:h-4 rounded-full overflow-hidden transition-colors duration-100">
            <div className="bg-azione h-full rounded-full transition-colors duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center">
          <span aria-label={`Domanda ${currentIndex + 1} di ${questions.length}`} className="grid h-9 min-w-9 place-items-center rounded-full bg-superficie-2 px-2 text-[15px] font-extrabold tabular-nums text-testo">{currentIndex + 1}</span>
        </div>
        <h2 data-testo-ok className="text-xl sm:text-2xl font-bold text-testo mb-5 sm:mb-6 leading-snug shrink-0">
          {question.prompt}
        </h2>

        <div data-testo-ok className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 content-start">
          {question.options.map((opt, idx) => {
            const isSelected = answers[question.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(question.id, idx)}
                aria-pressed={isSelected}
                className={cn(
                  "p-3 sm:p-3.5 text-left border rounded-2xl group transition-colors duration-100 flex items-center min-h-[56px]",
                  isSelected
                    ? "bg-azione-tinta border-azione text-testo"
                    : "border-linea bg-superficie-2 hover:bg-linea hover:border-tacca text-testo  "
                )}
              >
                <div className="flex items-center gap-4 w-full">
                  <span className={cn("w-8 h-8 text-sm flex shrink-0 items-center justify-center border rounded-full font-bold transition-colors duration-100",
                    isSelected ? "border-azione bg-azione text-azione-su" : "border-linea text-testo-tenue bg-superficie"
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

      <div className="p-3 sm:p-4 border-t border-linea bg-superficie shrink-0 flex items-center transition-colors duration-100 min-h-[70px] sm:min-h-[80px]">
        <div className="max-w-4xl w-full mx-auto flex justify-between items-center px-2 sm:px-4">
          <button
            onClick={() => goTo(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Domanda precedente"
            className="p-2 sm:p-3 text-testo-tenue disabled:opacity-30 rounded-xl hover:bg-linea transition-colors duration-100 border border-transparent active:bg-linea"
          >
            <Icona nome="indietro" size={28} />
          </button>

          <div className="flex gap-1 overflow-x-auto max-w-[150px] sm:max-w-xs px-1 scrollbar-hide items-center">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => goTo(idx)}
                aria-label={`Vai alla domanda ${idx + 1}`}
                className={cn(
                  "h-1.5 sm:h-2 min-w-[6px] sm:min-w-[8px] flex-1 rounded-full transition-colors duration-100 cursor-pointer",
                  currentIndex === idx ? "bg-testo h-2.5 sm:h-3" : answers[q.id] !== undefined ? "bg-azione" : "bg-tacca"
                )}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(currentIndex + 1)}
            disabled={currentIndex === questions.length - 1}
            aria-label="Domanda successiva"
            className="p-2 sm:p-3 text-testo-tenue disabled:opacity-30 rounded-xl hover:bg-linea transition-colors duration-100 border border-transparent active:bg-linea"
          >
            <Icona nome="avanti" size={28} />
          </button>
        </div>
      </div>
      {dialog}
    </div>
  );
}
