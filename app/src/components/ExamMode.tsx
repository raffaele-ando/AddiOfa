import { useState, useEffect, useRef } from 'react';
import { ExamHistory, ExamQuestionLog, QuestionClickEvent } from '../types';
import { cn } from '../lib/utils';
import { playTapSound, playVictorySound } from '../lib/audio';
import { Icona } from '../brand/icone/Icona';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Illustrazione } from '../brand/Illustrazione';
import { Screen, TopBar } from './ui';
import { FoglioInfo } from '../screens/extra/ui';
import { Bottone, OpzioneRisposta, StatoVuoto } from '../screens/extra/studio/comune';
import ConfirmDialog from './ConfirmDialog';
import EsitoSimulazione from './esito/EsitoSimulazione';
import { provider } from '../access';
import type { ExamResult, ExamSession, PublicQuestion } from '../access/provider';
import { EXAM } from '../config/offer';
import { loadState } from '../lib/storage';
import { elencoSimulazioni } from '../lib/studio/simulazioni';
import { calcolaStima } from './home/stima';
import type { PuntiConfronto } from './esito/ConfrontoPrecedente';

interface ExamModeProps {
  onComplete: (
    history: ExamHistory,
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>
  ) => void;
  onExit: () => void;
  /** Se c'è, sotto una domanda sbagliata compare "Studia la regola". */
  onOpenTheory?: (id: string) => void;
  /** Quante risposte entrano nella stima (diagnostico + simulazioni): serve al foglio "Come viene calcolata la stima" dell'esito. Facoltativa. */
  risposteStima?: number;
  /** Le simulazioni già svolte, per il confronto prima/dopo dell'esito. Facoltativa: se manca si leggono dal salvataggio del dispositivo. */
  storico?: ExamHistory[];
}

type Phase = 'select' | 'starting' | 'running' | 'submitting' | 'submitError' | 'done';

// Un solo formato (EXAM: 30 domande, 15 minuti, soglia 25): non c'è nulla da scegliere e la prova parte da sola
// (la fase «select» resta solo come stato di attesa dell'avvio, con l'errore se non parte).

export default function ExamMode({ onComplete, onExit, onOpenTheory, risposteStima, storico }: ExamModeProps) {
  const [phase, setPhase] = useState<Phase>('select');
  const [error, setError] = useState<boolean>(false);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsedFinal, setElapsedFinal] = useState(0);
  const [confirm, setConfirm] = useState<null | 'exit' | 'submit'>(null);
  // Il foglio con la griglia delle 30 domande e le domande già viste (per distinguere «saltata» da «ancora da vedere»)
  const [griglia, setGriglia] = useState(false);
  const [viste, setViste] = useState<Set<number>>(new Set([0]));
  // La simulazione svolta prima di questa (per il confronto prima/dopo) e se la prova si è chiusa perché il tempo è finito.
  const [precedente, setPrecedente] = useState<PuntiConfronto | null>(null);
  const [scaduto, setScaduto] = useState(false);
  // Su quante risposte è calcolata la stima dopo questa simulazione (per il foglio «Come viene calcolata»), se App non lo passa.
  const [risposteCalcolate, setRisposteCalcolate] = useState<number | undefined>(undefined);

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

  // La prova parte da sola.
  const partito = useRef(false);
  useEffect(() => {
    if (partito.current) return;
    partito.current = true;
    void avvia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const format = session ? EXAM : null;
  const questions: PublicQuestion[] = session?.questions ?? [];

  // ---- Avvio
  const avvia = async (rifai = false) => {
    if (phase !== 'select' && !(rifai && phase === 'done')) return;
    setError(false);
    // Il confronto è con l'ultima simulazione: se si rifà subito, quella appena finita (non serve aspettare il salvataggio).
    if (rifai && result) setPrecedente({ esatte: result.rawCorrect, totale: EXAM.questions });
    else {
      const ultima = elencoSimulazioni(storico ?? loadState().history)[0];
      setPrecedente(ultima ? { esatte: ultima.esatte, totale: ultima.totale } : null);
    }
    setScaduto(false);
    setResult(null);
    setPhase('starting');
    try {
      const s = await provider.startExam();
      if (!aliveRef.current) return;
      if (!s.questions || s.questions.length === 0) throw new Error('sessione_vuota');
      const f = EXAM;
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
      setViste(new Set([0]));
      setTimeLeft(f.minutes * 60);
      setSession(s);
      setPhase('running');
    } catch {
      if (!aliveRef.current) return;
      setError(true);
      setPhase('select');
    }
  };

  // ---- Tempo: si calcola dalla scadenza, non contando i secondi, così non si sfasa se la scheda va in secondo piano
  useEffect(() => {
    if (phase !== 'running') return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setTimeLeft(prev => (prev === left ? prev : left));
      if (left === 0) void finish(true);
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
  const finish = async (tempoFinito = false) => {
    if (!session || !format) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    if (tempoFinito) setScaduto(true);
    if (!pendingRef.current) {
      flushQuestionTime();
      const payload: Record<string, number | null> = {};
      for (const q of session.questions) payload[q.id] = answersRef.current[q.id] ?? null;
      const elapsed = Math.min(format.minutes * 60, Math.round((Date.now() - startedAtRef.current) / 1000));
      pendingRef.current = { payload, elapsed };
    }
    const { payload, elapsed } = pendingRef.current;
    setElapsedFinal(elapsed);
    setError(false);
    setPhase('submitting');
    try {
      const res = await provider.submitExam(session.id, payload, elapsed);
      if (!aliveRef.current) return;
      complete(res, payload, elapsed);
    } catch {
      submittingRef.current = false;
      if (!aliveRef.current) return;
      setError(true);
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
    setResult(res);
    setPhase('done');

    const voce: ExamHistory = {
      id: session.id,
      date: Date.now(),
      score: res.rawCorrect,
      passed: res.passed,
      timeSpentSeconds: elapsed,
      categoryStats: categoryUpdates,
      questionLogs,
      answers: answered,
      questionIds: session.questions.map(q => q.id),
    };
    try {
      const salvato = loadState();
      setRisposteCalcolate(calcolaStima({ ...salvato, history: [...(storico ?? salvato.history).filter(h => h.id !== voce.id), voce] })?.risposte);
    } catch { setRisposteCalcolate(undefined); }
    onComplete(voce, categoryUpdates, questionResults);
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
    setViste(prev => (prev.has(next) ? prev : new Set(prev).add(next)));
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
      title={confirm === 'exit' ? 'Uscire dalla simulazione?' : 'Vuoi consegnare ora?'}
      message={confirm === 'exit'
        ? 'Le risposte date andranno perse.'
        : `${missing === 1 ? 'Manca 1 risposta' : `Mancano ${missing} risposte`}. Una volta consegnato non puoi più cambiare niente.`}
      confirmLabel={confirm === 'exit' ? 'Esci' : 'Consegna'}
      cancelLabel={confirm === 'exit' ? 'Resta' : 'Torna alle domande'}
      danger={confirm === 'exit'}
      illustrazione={confirm === 'exit' ? <Illustrazione nome="attenzione-rischio" lato={72} /> : <Illustrazione nome="simulazione-esame" lato={80} />}
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
  // Preparo le domande: solo il caricamento. Se non parte, la causa e un pulsante per riprovare.
  if (phase === 'select' || phase === 'starting') {
    const mostraStato = phase === 'select' && error;
    return (
      <Screen>
        <TopBar onBack={onExit} />
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {!mostraStato ? (
            <div role="status" aria-label="Preparo le domande"><IllustrazioneAnimata nome="attesa-caricamento" lato={110} /></div>
          ) : (
            <StatoVuoto pagina illustrazione={{ nome: 'documento-errore', lato: 96 }} titolo="La simulazione non parte" testo="Le domande non si sono caricate.">
              <Bottone onClick={() => void avvia()} icona={<Icona nome="riprova" size={20} />}>Riprova</Bottone>
              <Bottone variante="secondario" onClick={onExit} icona={<Icona nome="indietro" size={18} />}>Indietro</Bottone>
            </StatoVuoto>
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
          <div role="status" aria-label={scaduto ? 'Tempo scaduto: consegno e correggo' : 'Consegno e correggo'} className="flex flex-col items-center gap-3">
            {scaduto && (
              <span aria-hidden="true" className="inline-flex items-center gap-1.5 rounded-full bg-basso-tinta px-3.5 py-1.5 text-[15px] font-extrabold text-basso-testo">
                <Icona nome="tempo" size={18} />Tempo scaduto
              </span>
            )}
            <Illustrazione nome="documento-in-corso" lato={96} />
            <Icona nome="stato-caricamento" size={26} className="animate-spin text-azione-testo" />
          </div>
        ) : (
          <StatoVuoto pagina illustrazione={{ nome: 'documento-errore', lato: 96 }} titolo="Consegna non riuscita" testo="Le tue risposte sono ancora qui.">
            <Bottone onClick={() => void finish()} icona={<Icona nome="riprova" size={20} />}>Riprova a consegnare</Bottone>
            <Bottone variante="secondario" onClick={onExit} icona={<Icona nome="chiudi" size={18} />}>Esci senza salvare</Bottone>
          </StatoVuoto>
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
          risposteStima={risposteStima ?? risposteCalcolate}
          onRetry={() => void avvia(true)}
          precedente={precedente}
          scaduto={scaduto}
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
  // Il tempo è neutro finché c'è margine, ambra negli ultimi 5 minuti, corallo nell'ultimo
  const tempoAmbra = timeLeft <= 300;
  const tempoCorallo = timeLeft <= 60;
  const statoDomanda = (i: number): 'risposta' | 'saltata' | 'da-vedere' =>
    answers[questions[i].id] !== undefined ? 'risposta' : (viste.has(i) && i !== currentIndex ? 'saltata' : 'da-vedere');
  const nSaltate = questions.filter((_, i) => statoDomanda(i) === 'saltata').length;
  const nDaVedere = questions.length - answeredCount - nSaltate;
  const vaiA = (i: number) => { setGriglia(false); goTo(i); };

  return (
    <div className="relative flex flex-col h-full w-full bg-superficie overflow-hidden transition-colors duration-100">
      <header className="shrink-0 border-b border-linea">
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-2 px-2 pb-3 pt-2 sm:px-4">
          <div className="flex items-center justify-between">
            <button onClick={requestExit} aria-label="Esci dalla simulazione" className="grid h-11 w-11 place-items-center rounded-full text-testo-tenue hover:text-testo transition-colors duration-100">
              <Icona nome="chiudi" size={24} />
            </button>
            <div role="timer" aria-label="Tempo rimasto"
              className={cn('flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-base font-bold tabular-nums transition-colors duration-100',
                tempoCorallo ? 'bg-basso-tinta text-basso-testo' : tempoAmbra ? 'bg-medio-tinta text-medio-testo' : 'bg-superficie-2 text-testo')}>
              <Icona nome="tempo" size={18} /> {timeStr}
            </div>
            <button onClick={requestSubmit}
              className="inline-flex h-10 items-center rounded-[10px] border border-azione/60 px-4 text-[13px] font-bold text-azione-testo transition-colors duration-100 hover:bg-azione-tinta">
              Consegna
            </button>
          </div>
          <div className="flex items-center gap-3 px-1">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-tacca" role="presentation">
              <div className="h-full rounded-full bg-azione" style={{ width: `${progress}%` }} />
            </div>
            <span className="shrink-0 text-[12px] font-semibold tabular-nums text-testo-tenue">{answeredCount === 1 ? '1 risposta' : `${answeredCount} risposte`} su {questions.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto flex w-full max-w-[520px] flex-col px-5 pb-4 pt-5">
          <h2 data-testo-ok aria-label={`Domanda ${currentIndex + 1} di ${questions.length}: ${question.prompt}`} className="mb-5 text-xl sm:text-2xl font-bold leading-snug text-testo">
            {question.prompt}
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, idx) => (
              <OpzioneRisposta key={idx} lettera={String.fromCharCode(65 + idx)} testo={opt}
                stato={answers[question.id] === idx ? 'scelta' : 'neutra'} onClick={() => handleOptionSelect(question.id, idx)} />
            ))}
          </div>
        </div>
      </main>

      <div className="shrink-0 border-t border-linea bg-superficie">
        <div className="mx-auto flex w-full max-w-[520px] items-center justify-between gap-2 px-3 py-3 sm:px-4">
          <button onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="Domanda precedente"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-testo hover:bg-linea disabled:opacity-30 transition-colors duration-100">
            <Icona nome="indietro" size={28} />
          </button>
          <button onClick={() => { playTapSound(); setGriglia(true); }} aria-haspopup="dialog"
            className="inline-flex h-12 min-w-0 flex-1 max-w-[240px] items-center justify-center gap-2 rounded-xl border border-tacca bg-superficie-2 px-3 text-[15px] font-bold tabular-nums text-testo transition-colors duration-100 hover:bg-linea">
            Domanda {currentIndex + 1} di {questions.length}<Icona nome="espandi" size={18} className="text-testo-tenue" />
          </button>
          <button onClick={() => goTo(currentIndex + 1)} disabled={currentIndex === questions.length - 1} aria-label="Domanda successiva"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-testo hover:bg-linea disabled:opacity-30 transition-colors duration-100">
            <Icona nome="avanti" size={28} />
          </button>
        </div>
      </div>

      {/* Griglia delle domande: tessere da 48 px, con stato (risposta, saltata, da vedere) detto anche a parole */}
      <FoglioInfo aperto={griglia} onChiudi={() => setGriglia(false)} titolo="Vai a una domanda">
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold text-testo">
          <li className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[5px] border-2 border-azione bg-azione" />Risposte <span className="tabular-nums">{answeredCount}</span></li>
          <li className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[5px] border-2 border-dashed border-medio-numero bg-medio-tinta" />Saltate <span className="tabular-nums">{nSaltate}</span></li>
          <li className="inline-flex items-center gap-1.5"><span aria-hidden="true" className="h-4 w-4 rounded-[5px] border-2 border-tacca bg-superficie-2" />Da vedere <span className="tabular-nums">{Math.max(0, nDaVedere)}</span></li>
        </ul>
        <div role="group" aria-label="Domande" className="grid grid-cols-6 gap-2">
          {questions.map((q, i) => {
            const st = statoDomanda(i);
            const corrente = i === currentIndex;
            return (
              <button key={q.id} type="button" onClick={() => vaiA(i)} aria-current={corrente ? 'true' : undefined}
                aria-label={`Domanda ${i + 1}: ${st === 'risposta' ? 'risposta data' : st === 'saltata' ? 'saltata' : corrente ? 'quella di ora' : 'da vedere'}`}
                className={cn('grid h-12 w-full place-items-center rounded-[10px] border-2 text-[15px] font-bold tabular-nums transition-colors duration-100',
                  st === 'risposta' && 'border-azione bg-azione text-azione-su',
                  st === 'saltata' && 'border-dashed border-medio-numero bg-medio-tinta text-medio-testo',
                  st === 'da-vedere' && 'border-tacca bg-superficie-2 text-testo',
                  corrente && 'outline outline-2 outline-offset-2 outline-testo')}>
                {i + 1}
              </button>
            );
          })}
        </div>
        <button type="button" onClick={() => { setGriglia(false); requestSubmit(); }}
          className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[12px] border border-azione/60 text-[15px] font-bold text-azione-testo transition-colors duration-100 hover:bg-azione-tinta">
          Consegna
        </button>
      </FoglioInfo>
      {dialog}
    </div>
  );
}
