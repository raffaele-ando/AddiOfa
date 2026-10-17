import { useState, useEffect, useRef, useMemo } from 'react';
import { AppState, QuestionClickEvent, QuestionTelemetry, UserStats } from '../types';
import { selectPracticeIds, updateStats, bankMeta, countLearned, isLearned } from '../lib/spacedRepetition';
import { Icona } from '../brand/icone/Icona';
import { cn, shuffleArray } from '../lib/utils';
import { playTapSound, playCorrectSound, playIncorrectSound, playVictorySound } from '../lib/audio';
import { provider } from '../access';
import type { GradeResult, PublicQuestion } from '../access/provider';
import { Screen } from './ui';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Illustrazione } from '../brand/Illustrazione';

interface LearnModeProps {
  appState: AppState;
  mode: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart';
  category?: string;
  onUpdateAppState: (newState: AppState) => void;
  onExit: () => void;
  /** Se c'è, dopo la risposta compare "Studia la regola" (quando la domanda ha una scheda di teoria). */
  onOpenTheory?: (id: string) => void;
}

// Una domanda come la vede l'utente: le opzioni sono rimescolate qui, `order[i]` dice quale opzione originale sta in posizione i.
// Al provider si manda sempre l'indice originale, perché è quello che conosce.
interface Item { q: PublicQuestion; order: number[]; }

const words = (t: string) => t.split(' ').filter(w => w.trim() !== '');

export default function LearnMode({ appState, mode: modoIniziale, category, onUpdateAppState, onExit, onOpenTheory }: LearnModeProps) {
  // La modalità può cambiare dentro la sessione: da «Punti deboli» senza errori si passa a «Intelligente» dallo stato vuoto
  const [mode, setMode] = useState(modoIniziale);
  // Punti deboli = gli errori ancora da ripassare (sbagliate almeno una volta e non ancora imparate), contati una volta all'apertura
  const erroriAllaPartenza = useRef<number | null>(null);
  if (erroriAllaPartenza.current === null) {
    erroriAllaPartenza.current = Object.values(appState.stats ?? {}).filter(s => (s.incorrect ?? 0) > 0 && !isLearned(s)).length;
  }
  const nessunErrore = mode === 'weakness' && erroriAllaPartenza.current === 0;
  const [items, setItems] = useState<Item[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadKey, setLoadKey] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  // Una voce per domanda, scritta al primo tentativo: serve alla schermata finale
  const [esiti, setEsiti] = useState<{ id: string; prompt: string; argomento: string; theoryId?: string; giusta: boolean }[]>([]);
  const [secondiSessione, setSecondiSessione] = useState(0);
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

  // Domande imparate (isLearned: due risposte esatte a distanza di tempo) su tutto il banco: prima della sessione si fotografa una volta
  const gruppoIds = useMemo(() => bankMeta().map(m => m.id), []);
  const contaImparate = (st: UserStats) => countLearned(st, gruppoIds);
  const imparatePrima = useRef<number | null>(null);
  if (imparatePrima.current === null) imparatePrima.current = contaImparate(appState.stats);
  const inizioRef = useRef(Date.now());

  const checkingRef = useRef(false);
  const lastCheckRef = useRef<{ confidence: 'low' | 'medium' | 'high'; isTimeout: boolean } | null>(null);
  const appStateRef = useRef(appState);
  appStateRef.current = appState;

  const timeLimit = mode === 'blitz' ? 10 : 30;
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Scelta degli id sul solo indice leggero, poi le domande (senza risposte) dal provider
  useEffect(() => {
    if (nessunErrore) return; // stato vuoto: si carica solo quando si passa a un'altra modalità
    let alive = true;
    setLoadState('loading');
    const ids = selectPracticeIds(appStateRef.current.stats, {
      numQuestions: 10,
      mode,
      category,
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
        inizioRef.current = Date.now();
        setLoadState('ready');
      })
      .catch(() => { if (alive) setLoadState('error'); });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadKey]);

  const questions = useMemo(() => items.map(i => i.q), [items]);

  // Fanfara a fine sessione
  useEffect(() => {
    if (questions.length > 0 && currentIndex >= questions.length) {
      playVictorySound();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (nessunErrore) {
    return (
      <Screen className="items-center justify-center text-center">
        <Illustrazione nome="documento-completato" gruppo="stati" lato={120} />
        <p role="status" className="text-[18px] leading-[24px] font-bold text-testo">Niente da ripassare</p>
        <button onClick={() => { playTapSound(); setMode('smart'); setLoadKey(k => k + 1); }} className="w-full max-w-xs inline-flex items-center justify-center gap-2 bg-azione hover:bg-azione-scuro text-azione-su font-bold py-3.5 rounded-2xl transition-colors duration-100"><Icona nome="studia" size={20} />Intelligente</button>
        <button onClick={() => { playTapSound(); onExit(); }} className="inline-flex items-center gap-1.5 text-sm font-bold text-testo-tenue"><Icona nome="indietro" size={18} />Indietro</button>
      </Screen>
    );
  }
  if (loadState === 'loading') {
    return (
      <Screen className="items-center justify-center text-center">
        <div role="status" aria-label="Caricamento"><IllustrazioneAnimata nome="attesa-caricamento" lato={110} /></div>
      </Screen>
    );
  }
  if (loadState === 'error') {
    return (
      <Screen className="items-center justify-center text-center">
 <Illustrazione nome="documento-errore" gruppo="stati" lato={110} />
        <p role="alert" className="font-bold text-basso-testo max-w-sm">Domande non caricate</p>
        <button onClick={() => { playTapSound(); setLoadKey(k => k + 1); }} className="w-full max-w-xs inline-flex items-center justify-center gap-2 bg-azione hover:bg-azione-scuro text-azione-su font-bold py-3.5 rounded-2xl transition-colors duration-100"><Icona nome="riprova" size={20} />Riprova</button>
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-sm font-bold text-testo-tenue"><Icona nome="indietro" size={18} />Indietro</button>
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
    if (currentAttempts === 1) {
      setEsiti(prev => [...prev, { id: question.id, prompt: question.prompt, argomento: question.grammarTopic || question.category, theoryId: res.theoryId, giusta: correct }]);
    }

    setResult(res);
    setHasChecked(true);
    setAttempts(currentAttempts);
    setChecking(false);
    checkingRef.current = false;

    if (recall) setSelectedOption(correct ? correctIdx : -1);

    // Nessuna risposta data (tempo scaduto senza scelta, frase che non corrisponde a nessuna opzione): conta come omessa, non come errore
    const omessa = isTimeout && (chosen === null || chosen < 0);

    if (correct) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      playCorrectSound(nextStreak);

      onUpdateAppState(updateStats(appStateRef.current, question.id, true, timeTakenMs, currentAttempts, confidence, telemetry, quiz, false));
    } else {
      setStreak(0);
      playIncorrectSound();
      if (!recall && chosen !== null && chosen >= 0) {
        setWrongOptions(prev => new Set(prev).add(chosen as number));
      }
      // La prima risposta sbagliata conta come errore; i tentativi dopo no
      if (currentAttempts === 1) {
        onUpdateAppState(updateStats(appStateRef.current, question.id, false, timeTakenMs, currentAttempts, confidence, telemetry, quiz, omessa));
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
    if (currentIndex + 1 >= questions.length) setSecondiSessione(Math.max(1, Math.round((Date.now() - inizioRef.current) / 1000)));
    setCurrentIndex(prev => prev + 1);
  };

  // "Continua da qui": nuova sessione dello stesso tipo, scelta sui dati aggiornati
  const riparti = () => {
    imparatePrima.current = contaImparate(appStateRef.current.stats);
    setItems([]);
    setEsiti([]);
    setStreak(0);
    setCurrentIndex(0);
    setSecondiSessione(0);
    setLoadKey(k => k + 1);
  };

  if (currentIndex >= questions.length) {
    const daRiprendere: DomandaDaRiprendere[] = esiti.filter(e => !e.giusta).map(e => ({ id: e.id, prompt: e.prompt, argomento: e.argomento }));
    // L'argomento con più errori che ha una scheda di teoria
    const perArgomento = new Map<string, { n: number; theoryId?: string }>();
    esiti.filter(e => !e.giusta).forEach(e => {
      const v = perArgomento.get(e.argomento) ?? { n: 0 };
      perArgomento.set(e.argomento, { n: v.n + 1, theoryId: v.theoryId ?? e.theoryId });
    });
    const peggiore = [...perArgomento.entries()].filter(([, v]) => v.theoryId).sort((x, y) => y[1].n - x[1].n)[0];
    return (
      <FineSessione
        corrette={esiti.filter(e => e.giusta).length}
        totale={esiti.length}
        secondi={secondiSessione}
        prima={imparatePrima.current ?? 0}
        dopo={contaImparate(appState.stats)}
        gruppo={gruppoIds.length}
        daRiprendere={daRiprendere}
        regola={peggiore ? { nome: peggiore[0], theoryId: peggiore[1].theoryId! } : undefined}
        onContinua={riparti}
        onExit={onExit}
        onOpenTheory={onOpenTheory}
      />
    );
  }

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="flex flex-col h-full w-full sm:max-h-[calc(100dvh-3rem)] bg-superficie sm:rounded-[32px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      {/* Header & Progress */}
      <header className="flex items-center gap-3 sm:gap-4 p-3 border-b border-linea h-12 shrink-0 transition-colors duration-100">
        <button onClick={() => { playTapSound(); onExit(); }} aria-label="Esci" className="p-1 text-testo-tenue hover:text-testo rounded-full transition-colors duration-100">
          <Icona nome="chiudi" size={22} />
        </button>
        <div className="flex-1 bg-superficie-2 h-2 rounded-full overflow-hidden transition-colors duration-100">
          <div className="bg-azione h-full rounded-full" style={{ width: `${progress}%` }} />
        </div>
        {streak > 1 && (
          <div className="flex items-center gap-1 text-medio-testo font-bold text-xs sm:text-sm">
            <Icona nome="serie" size={16} />
            <span className="tabular-nums">{streak}</span>
          </div>
        )}
        <div role="timer" aria-label="Tempo per questa domanda" className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold tabular-nums text-sm", timeLeft <= 5 ? "bg-basso-tinta text-basso-testo" : "bg-medio-tinta text-medio-testo")}>
          <Icona nome="tempo" size={14} />{timeLeft}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 flex flex-col w-full overflow-y-auto scrollbar-hide">
        <div className="mb-4 shrink-0 flex items-center justify-between">
          <span aria-label={`Domanda ${currentIndex + 1} di ${questions.length}`} className="text-xs sm:text-sm font-semibold tabular-nums text-testo-tenue">
            {currentIndex + 1}/{questions.length}
          </span>
        </div>
        <h2 data-testo-ok className="text-xl sm:text-2xl font-bold text-testo mb-5 sm:mb-6 leading-snug shrink-0">
          {question.prompt}
        </h2>

        {!optionsRevealed ? (
          <div className="flex-1 flex flex-col gap-6 w-full max-w-2xl mx-auto items-center justify-center pt-8">
            
            {/* Hint Section */}
            <div className="flex flex-col items-center gap-2 mb-4 h-12 justify-center">
              {!showHint ? (
                <button 
                  onClick={() => { playTapSound(); setShowHint(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-azione-tinta text-azione-scuro font-bold rounded-xl hover:bg-azione-tinta/70 transition-colors duration-100"
                >
                  <Icona nome="suggerimento" size={20} />
                  Suggerimento
                </button>
              ) : (
                <div className="bg-azione-tinta text-azione-scuro px-4 py-2 rounded-xl text-sm font-bold text-center">
                  {question.grammarTopic || question.category}{question.level && ` · ${question.level}`}
                </div>
              )}
            </div>

            {/* Answer Box */}
            <div className={cn(
              "min-h-[100px] w-full p-4 flex flex-wrap content-start gap-2 items-center bg-superficie-2/50 rounded-t-2xl transition-colors duration-100",
              hasChecked && !isCorrect ? "border-basso/30 bg-basso-tinta/50" : "border-linea"
            )}>
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
                    "bg-superficie border text-testo px-4 py-2 rounded-xl font-bold shadow-sm dark:shadow-none transition-colors duration-100",
                    hasChecked ? "border-linea opacity-80" : "border-linea hover:border-tacca"
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
                      "px-5 py-2.5 rounded-[16px] font-bold transition-colors duration-100 text-sm sm:text-base",
                      isSelected 
                        ? "bg-tacca text-transparent border border-linea cursor-default shadow-none" 
                        : "bg-superficie border border-linea text-testo cursor-pointer hover:bg-linea"
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
                className="inline-flex items-center gap-1.5 text-testo-tenue font-bold text-xs sm:text-sm hover:text-testo transition-colors duration-100"
              >
                <Icona nome="opzioni" size={18} />Opzioni
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 content-start">
            {question.options.map((opt, idx) => {
              let stateClass = "border-linea bg-superficie-2 hover:bg-linea hover:border-tacca text-testo  ";
              let numberClass = "border-linea text-testo-tenue bg-superficie";
              
              if (hasChecked) {
                if (idx === correctDisplay) {
                  stateClass = "border-alto/30 bg-alto-tinta text-testo";
                  numberClass = "border-alto bg-alto-pieno text-azione-su";
                } else if (idx === selectedOption) {
                  stateClass = "border-basso/30 bg-basso-tinta text-testo";
                  numberClass = "border-basso bg-basso-pieno text-azione-su";
                } else if (wrongOptions.has(idx)) {
                  stateClass = "border-linea bg-superficie opacity-40";
                } else {
                  stateClass = "border-linea bg-superficie-2 opacity-40";
                }
              } else if (selectedOption === idx) {
                stateClass = "bg-azione-tinta border-azione text-testo";
                numberClass = "border-azione bg-azione text-azione-su";
              } else if (wrongOptions.has(idx)) {
                stateClass = "border-linea bg-superficie opacity-40";
              }

              return (
                <button
                  key={idx}
                  disabled={hasChecked || wrongOptions.has(idx)}
                  onClick={() => handleSelectOption(idx)}
                  className={cn(
                    "p-3 sm:p-3.5 text-left border rounded-2xl group transition-colors duration-100 flex items-center min-h-[56px]",
                    stateClass
                  )}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className={cn("w-8 h-8 text-sm flex shrink-0 items-center justify-center border rounded-full font-bold transition-colors duration-100", numberClass)}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span data-testo-ok className="text-[15px] sm:text-base font-semibold leading-snug flex-1">{opt}</span>
                    {hasChecked && idx === correctDisplay && <><Icona nome="stato-risposta-giusta" size={22} className="text-alto-testo" /><span className="sr-only">Giusta</span></>}
                    {hasChecked && idx !== correctDisplay && idx === selectedOption && <><Icona nome="stato-risposta-sbagliata" size={22} className="text-basso-testo" /><span className="sr-only">Sbagliata</span></>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {checkError && (
        <div role="alert" className="shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-basso-tinta text-basso-testo text-sm font-bold">
          <span>{checkError}</span>
          <button onClick={() => { const l = lastCheckRef.current; if (l) void handleCheck(l.confidence, l.isTimeout); }} className="underline shrink-0">Riprova</button>
        </div>
      )}
      {/* Bottom Action Bar */}
      <div className={cn("border-t border-linea shrink-0 p-4 transition-colors duration-100", hasChecked ? (isCorrect ? "bg-alto-tinta border-alto/30" : "bg-basso-tinta border-basso/30") : "bg-superficie")}>
        <div className="w-full flex flex-col sm:flex-row gap-4 items-center justify-between">
          {hasChecked && (
              <div
                className={cn(
                  "font-bold flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto",
                  isCorrect ? "text-alto-testo" : "text-basso-testo"
                )}
              >
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <Illustrazione nome={isCorrect ? 'documento-completato' : 'documento-errore'} gruppo="stati" lato={48} />
                  <span role="img" aria-label={isCorrect ? 'Giusta' : 'Sbagliata'}><Icona nome={isCorrect ? 'stato-risposta-giusta' : 'stato-risposta-sbagliata'} size={32} /></span>
                  {isCorrect && streak > 2 && (
                    <span className="inline-flex items-center gap-1 text-lg tabular-nums"><Icona nome="serie" size={20} />{streak}</span>
                  )}
                </div>
                {result?.explanation && (
                  <div data-testo-ok className="max-h-[28vh] overflow-y-auto">
                    <p className="text-sm font-semibold text-testo leading-snug">
                      {result.explanation}
                    </p>
                  </div>
                )}
                {result?.theoryId && onOpenTheory && (
                  <button
                    onClick={() => { playTapSound(); onOpenTheory(result.theoryId!); }}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold text-testo underline underline-offset-2"
                  >
                    <Icona nome="teoria" size={18} /> Teoria
                  </button>
                )}
              </div>
            )}

          {!hasChecked ? (
            <div className="w-full sm:w-auto flex flex-col gap-2">
              <div className="flex flex-row gap-2 justify-between sm:justify-end">
              <button
                onClick={() => handleCheck('low')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-superficie-2 border border-linea hover:border-basso disabled:opacity-50 text-testo font-bold text-sm py-3.5 px-4 rounded-[12px] transition-colors duration-100"
              >
                <span aria-hidden="true" className="text-basso-numero"><Icona nome="fiducia-bassa" size={20} /></span>Non so
              </button>
              <button
                onClick={() => handleCheck('medium')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-superficie-2 border border-linea hover:border-medio disabled:opacity-50 text-testo font-bold text-sm py-3.5 px-4 rounded-[12px] transition-colors duration-100"
              >
                <span aria-hidden="true" className="text-medio-numero"><Icona nome="fiducia-media" size={20} /></span>Incerto
              </button>
              <button
                onClick={() => handleCheck('high')}
                disabled={checking || (!optionsRevealed ? selectedRecallWords.length === 0 : selectedOption === null)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-superficie-2 border border-linea hover:border-alto disabled:opacity-50 text-testo font-bold text-sm py-3.5 px-4 rounded-[12px] transition-colors duration-100"
              >
                <span aria-hidden="true" className="text-alto-numero"><Icona nome="fiducia-alta" size={20} /></span>Sicuro
              </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleNext}
              className={cn(
                "w-full sm:w-auto bg-azione hover:bg-azione-scuro text-azione-su font-bold text-base py-3.5 px-8 rounded-[12px] transition-colors duration-100 flex items-center justify-center gap-2"
              )}
            >
              {isCorrect ? (
                <>Avanti <Icona nome="avanti" size={24} /></>
              ) : (
                <>Riprova <Icona nome="riprova" size={22} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface DomandaDaRiprendere { id: string; prompt: string; argomento: string }

/** Fine di una sessione: icone e numeri veri (giuste, da riprendere, tempo, domande imparate prima e dopo). Nessuna frase: la regola dell'«imparata» sta nella FAQ. */
function FineSessione({ corrette, totale, secondi, prima, dopo, gruppo, daRiprendere, regola, onContinua, onExit, onOpenTheory }: {
  corrette: number; totale: number; secondi: number; prima: number; dopo: number; gruppo: number;
  daRiprendere: DomandaDaRiprendere[]; regola?: { nome: string; theoryId: string };
  onContinua: () => void; onExit: () => void; onOpenTheory?: (id: string) => void;
}) {
  const pc = (n: number) => (gruppo > 0 ? Math.max(0, Math.min(100, (n / gruppo) * 100)) : 0);
  const differenza = dopo - prima;
  const mm = Math.floor(secondi / 60);
  const ss = String(secondi % 60).padStart(2, '0');
  const tessera = 'rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5';

  return (
    <div className="flex flex-col h-full w-full sm:max-h-[calc(100dvh-3rem)] bg-superficie sm:rounded-[32px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center pt-1">
            <span aria-hidden="true" className="grid place-items-center"><IllustrazioneAnimata nome="successo" lato={132} /></span>
            <p role="img" aria-label={`${corrette} giuste su ${totale}`} className="mt-1 text-[40px] leading-[44px] font-extrabold tabular-nums text-testo">
              {corrette}<span className="text-[22px] font-bold text-testo-tenue">/{totale}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div role="group" aria-label={`${corrette} giuste al primo tentativo`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-alto-tinta text-alto-testo"><Icona nome="stato-risposta-giusta" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{corrette}</span>
            </div>
            <div role="group" aria-label={`${daRiprendere.length} da riprendere`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-basso-tinta text-basso-testo"><Icona nome="stato-da-ripassare" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{daRiprendere.length}</span>
            </div>
            <div role="group" aria-label={`Tempo ${mm}:${ss}`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-medio-tinta text-medio-testo"><Icona nome="tempo" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{mm}:{ss}</span>
            </div>
          </div>

          {gruppo > 0 && (
            <section aria-label={`Domande imparate: prima ${prima}, dopo ${dopo}, su ${gruppo}`} className="rounded-[12px] bg-superficie-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-alto-numero"><Icona nome="stato-imparata" size={24} /></span>
                {differenza !== 0 && (
                  <span className={cn('inline-flex items-center rounded-full text-xs font-bold px-2.5 py-1 tabular-nums', differenza > 0 ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')}>
                    {differenza > 0 ? '+' : '−'}{Math.abs(differenza)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex justify-center"><Illustrazione nome="progressi-statistiche-scheda" lato={104} /></div>
              <div className="mt-2 flex items-center justify-center gap-4 text-center tabular-nums">
                <span className="text-3xl font-extrabold leading-none text-testo-tenue">{prima}</span>
                <span className="text-testo-tenue"><Icona nome="avanti" size={26} /></span>
                <span className="text-3xl font-extrabold leading-none text-alto-numero">{dopo}</span>
                <span className="text-sm font-semibold text-testo-tenue">/{gruppo}</span>
              </div>
              <div className="mt-3 relative h-3 rounded-full bg-tacca overflow-hidden" role="presentation">
                <div className="absolute inset-y-0 left-0 rounded-full bg-alto" style={{ width: `${pc(dopo)}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-testo" style={{ left: `${pc(prima)}%` }} aria-hidden />
              </div>
            </section>
          )}

          {daRiprendere.length > 0 && (
            <section aria-label="Da riprendere" className="rounded-[12px] bg-superficie-2 p-4 text-left">
              <div className="mb-2.5 flex items-center gap-2 text-basso-numero"><Icona nome="stato-da-ripassare" size={20} /></div>
              <ul data-testo-ok className="divide-y divide-linea">
                {daRiprendere.slice(0, 5).map(d => (
                  <li key={d.id} className="py-2 first:pt-0 last:pb-0">
                    <p className="text-sm font-semibold text-testo leading-snug">{d.prompt}</p>
                    <p className="text-[11px] font-bold text-testo-tenue mt-0.5">{d.argomento}</p>
                  </li>
                ))}
              </ul>
              {daRiprendere.length > 5 && <p className="mt-2 text-xs font-bold text-testo-tenue tabular-nums">+{daRiprendere.length - 5}</p>}
              {regola && onOpenTheory && (
                <button type="button" onClick={() => { playTapSound(); onOpenTheory(regola.theoryId); }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-azione/60 text-azione font-bold text-sm py-2.5 hover:bg-azione-tinta/40 transition-colors duration-100">
                  <Icona nome="teoria" size={18} /><span data-testo-ok>{regola.nome}</span>
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-linea bg-superficie p-3 sm:p-4">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-2">
          <button type="button" onClick={() => { playTapSound(); onContinua(); }}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-azione hover:bg-azione-scuro text-azione-su rounded-[12px] px-4 py-3.5 font-bold text-base transition-colors duration-100">
            <Icona nome="studia" size={22} />Continua
          </button>
          <button type="button" onClick={() => { playTapSound(); onExit(); }}
            className="w-full inline-flex items-center justify-center gap-2 bg-superficie border border-azione/60 text-azione font-bold text-base py-3 rounded-[12px] transition-colors duration-100 hover:bg-azione-tinta">
            <Icona nome="home" size={20} />Home
          </button>
        </div>
      </div>
    </div>
  );
}
