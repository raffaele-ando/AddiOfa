import { useState, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { AppState, QuestionClickEvent, QuestionTelemetry, UserStats } from '../types';
import { selectPracticeIds, updateStats, bankMeta, countLearned, isLearned } from '../lib/spacedRepetition';
import { Icona } from '../brand/icone/Icona';
import { cn, shuffleArray } from '../lib/utils';
import { playTapSound, playCorrectSound, playIncorrectSound, playVictorySound } from '../lib/audio';
import { provider } from '../access';
import type { GradeResult, PublicQuestion } from '../access/provider';
import { Screen } from './ui';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { Bottone, OpzioneRisposta, StatoVuoto, tipografiche, type StatoOpzione } from '../screens/extra/studio/comune';

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

const QUANTE = 10;

export default function LearnMode({ appState, mode: modoIniziale, category, onUpdateAppState, onExit, onOpenTheory }: LearnModeProps) {
  // La modalità può cambiare dentro la sessione: da «Punti deboli» senza errori si passa all'«Allenamento consigliato» dallo stato vuoto
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
  // Il tempo è finito senza che l'utente scegliesse nulla: il pannello lo dice (non è un errore di risposta)
  const [tempoScaduto, setTempoScaduto] = useState(false);
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
      numQuestions: QUANTE,
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
    setTempoScaduto(false);
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
        <StatoVuoto pagina illustrazione={{ nome: 'documento-completato', lato: 120 }} titolo="Niente da ripassare" testo="Non hai domande sbagliate da rivedere.">
          <Bottone onClick={() => { setMode('smart'); setLoadKey(k => k + 1); }} icona={<Icona nome="studia" size={20} />}>Allenamento consigliato</Bottone>
          <Bottone variante="secondario" onClick={onExit} icona={<Icona nome="indietro" size={18} />}>Indietro</Bottone>
        </StatoVuoto>
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
        <StatoVuoto pagina illustrazione={{ nome: 'documento-errore', lato: 110 }} titolo="Domande non caricate" testo="Non siamo riusciti a leggerle. Riprova.">
          <Bottone onClick={() => setLoadKey(k => k + 1)} icona={<Icona nome="riprova" size={20} />}>Riprova</Bottone>
          <Bottone variante="secondario" onClick={onExit} icona={<Icona nome="indietro" size={18} />}>Indietro</Bottone>
        </StatoVuoto>
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
    setTempoScaduto(omessa);

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

  // `salta`: dopo due tentativi sbagliati si va avanti senza ripetere (la domanda resta tra quelle sbagliate)
  const handleNext = (salta = false) => {
    playTapSound();
    if (!isCorrect && !salta) {
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
  const daControllare = !optionsRevealed ? selectedRecallWords.length > 0 : selectedOption !== null;
  const ultima = currentIndex + 1 >= questions.length;
  const inAllarme = timeLeft <= timeLimit / 3;
  const inAllarmeForte = timeLeft <= timeLimit / 6;
  const timerAttivo = !hasChecked && !checking && attempts === 0;
  const titoloPannello = isCorrect ? 'Giusto' : tempoScaduto ? 'Tempo scaduto' : 'Non è questa';
  const rispostaEsatta = result && !isCorrect && !optionsRevealed && correctDisplay >= 0 ? question.options[correctDisplay] : null;

  return (
    <div className="flex flex-col h-full w-full bg-superficie overflow-hidden transition-colors duration-100">
      {/* Testata: esci, avanzamento, serie, tempo (con unità) e, sotto, il consumo del tempo */}
      <header className="relative shrink-0 border-b border-linea">
        <div className="mx-auto flex h-14 w-full max-w-[520px] items-center gap-2 px-2 sm:px-4">
          <button onClick={() => { playTapSound(); onExit(); }} aria-label="Esci" className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo transition-colors duration-100">
            <Icona nome="chiudi" size={24} />
          </button>
          <div className="flex-1 bg-superficie-2 h-2 rounded-full overflow-hidden" role="progressbar" aria-label="Avanzamento" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={currentIndex}>
            <div className="bg-azione h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          {streak > 1 && (
            <div className="flex items-center gap-1 text-medio-testo font-bold text-sm" role="img" aria-label={`${streak} giuste di fila`}>
              <Icona nome="serie" size={16} />
              <span className="tabular-nums">{streak}</span>
            </div>
          )}
          <div role="timer" aria-label={`Tempo per questa domanda: ${timeLeft} secondi`}
            className={cn('inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-bold tabular-nums text-sm transition-colors duration-100',
              inAllarmeForte ? 'bg-basso-tinta text-basso-testo' : inAllarme ? 'bg-medio-tinta text-medio-testo' : 'bg-superficie-2 text-testo')}>
            <Icona nome="tempo" size={15} /><span>{timeLeft} s</span>
          </div>
        </div>
        {timerAttivo && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px]">
            <div className={cn('h-full', inAllarmeForte ? 'bg-basso' : inAllarme ? 'bg-medio-numero' : 'bg-azione')} style={{ width: `${Math.max(0, Math.min(100, (timeLeft / timeLimit) * 100))}%` }} />
          </div>
        )}
      </header>

      {/* Domanda e risposte */}
      <main className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto flex w-full max-w-[520px] flex-col px-5 pb-4 pt-4">
          <p aria-label={`Domanda ${currentIndex + 1} di ${questions.length}`} className="mb-3 text-[13px] font-semibold tabular-nums text-testo-tenue">
            Domanda {currentIndex + 1} di {questions.length}
          </p>
          <h2 data-testo-ok className="mb-5 text-xl sm:text-2xl font-bold leading-snug text-testo">
            {question.prompt}
          </h2>

          {!optionsRevealed ? (
            <div className="flex flex-col gap-4">
              <div className={cn(
                'flex min-h-[100px] w-full flex-wrap content-start items-center gap-2 rounded-2xl border-[1.5px] p-3 transition-colors duration-100',
                hasChecked && !isCorrect ? 'border-errore bg-errore-tinta' : 'border-tacca bg-superficie-2'
              )}>
                {selectedRecallWords.length === 0 && <span data-testo-ok className="px-1 text-[14px] text-testo-tenue">Tocca le parole per comporre la frase</span>}
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
                    className="min-h-[44px] rounded-xl border border-azione bg-azione-tinta px-4 py-2 font-bold text-testo transition-colors duration-100"
                  >
                    {recallWords[wordIndex]}
                  </button>
                ))}
              </div>

              <div className="flex min-h-[120px] w-full flex-wrap content-start justify-center gap-2.5">
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
                        'min-h-[44px] rounded-xl border px-4 py-2 text-[15px] font-bold transition-colors duration-100',
                        isSelected ? 'cursor-default border-linea bg-tacca text-transparent' : 'border-tacca bg-superficie-2 text-testo hover:bg-linea'
                      )}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {!showHint ? (
                  <button onClick={() => { playTapSound(); setShowHint(true); }}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-azione-tinta px-4 font-bold text-azione-testo transition-colors duration-100">
                    <Icona nome="suggerimento" size={20} />Suggerimento
                  </button>
                ) : (
                  <div data-testo-ok className="rounded-xl bg-azione-tinta px-4 py-2 text-center text-sm font-bold text-azione-testo">
                    {question.grammarTopic || question.category}{question.level && ` · ${question.level}`}
                  </div>
                )}
                <button onClick={() => { playTapSound(); setOptionsRevealed(true); }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-tacca px-4 text-[14px] font-bold text-testo transition-colors duration-100">
                  <Icona nome="opzioni" size={18} />Mostra le opzioni
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {question.options.map((opt, idx) => {
                let stato: StatoOpzione = 'neutra';
                if (hasChecked) {
                  if (idx === correctDisplay) stato = 'giusta';
                  else if (idx === selectedOption) stato = 'sbagliata';
                  else stato = 'spenta';
                } else if (selectedOption === idx) stato = 'scelta';
                else if (wrongOptions.has(idx)) stato = 'spenta';
                return (
                  <OpzioneRisposta key={idx} lettera={String.fromCharCode(65 + idx)} testo={opt} stato={stato}
                    disabilitata={hasChecked || wrongOptions.has(idx)} onClick={() => handleSelectOption(idx)} />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {checkError && (
        <div role="alert" className="shrink-0 flex items-center justify-between gap-3 border-t border-errore/40 bg-errore-tinta px-4 py-2 text-sm font-bold text-errore-testo">
          <span>{checkError}</span>
          <button onClick={() => { const l = lastCheckRef.current; if (l) void handleCheck(l.confidence, l.isTimeout); }} className="min-h-[44px] shrink-0 px-2 underline">Riprova</button>
        </div>
      )}

      {/* Piè di pagina: prima della risposta «Quanto sei sicuro?» (è anche il modo di controllare); dopo, l'esito con la spiegazione */}
      <div className={cn('shrink-0 border-t transition-colors duration-100', hasChecked ? (isCorrect ? 'border-alto/50 bg-alto-tinta/60' : 'border-errore/50 bg-errore-tinta/60') : 'border-linea bg-superficie')}>
        <div className="mx-auto flex w-full max-w-[520px] flex-col gap-3 px-4 pb-4 pt-3">
          {!hasChecked ? (
            <>
              <p id="etichetta-fiducia" data-testo-ok className="text-[13px] font-semibold text-testo-tenue">
                {daControllare
                  ? <><span className="text-testo">Quanto sei sicuro di questa risposta?</span> Tocca per controllare.</>
                  : (!optionsRevealed ? 'Prima componi la frase' : 'Scegli una risposta')}
              </p>
              <div role="group" aria-labelledby="etichetta-fiducia" className="grid grid-cols-3 gap-2">
                {FIDUCIA.map(f => (
                  <button key={f.id} type="button" onClick={() => handleCheck(f.id)} disabled={checking || !daControllare}
                    className={cn('flex h-[64px] flex-col items-center justify-center gap-1 rounded-[12px] border-[1.5px] text-[13.5px] font-bold text-testo transition-colors duration-100 disabled:opacity-45',
                      daControllare ? f.pronto : 'border-linea bg-superficie-2')}>
                    <BarreFiducia livello={f.livello} className={f.colore} />{f.nome}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', isCorrect ? 'bg-alto-pieno text-alto-su' : 'bg-errore text-errore-su')}>
                  <Icona nome={isCorrect ? 'stato-risposta-giusta' : 'stato-risposta-sbagliata'} size={20} />
                </span>
                <p role="status" className={cn('flex-1 text-[16px] leading-[22px] font-bold', isCorrect ? 'text-alto-testo' : 'text-errore-testo')}>{titoloPannello}</p>
                {isCorrect && streak > 2 && (
                  <span role="img" aria-label={`${streak} giuste di fila`} className="inline-flex items-center gap-1 text-base font-bold tabular-nums text-medio-testo"><Icona nome="serie" size={18} />{streak}</span>
                )}
              </div>
              {rispostaEsatta && (
                <p data-testo-ok className="text-[15px] leading-[22px] text-testo"><span className="font-bold">Risposta esatta:</span> {rispostaEsatta}</p>
              )}
              {result?.explanation && <Spiegazione key={`${question.id}-${attempts}`} testo={result.explanation} />}
              <div className="flex gap-2.5">
                {result?.theoryId && onOpenTheory && (
                  <button type="button" onClick={() => { playTapSound(); onOpenTheory(result.theoryId!); }}
                    className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-[12px] border border-azione/60 bg-superficie px-3.5 text-[14px] font-bold text-azione-testo transition-colors duration-100 hover:bg-azione-tinta">
                    <Icona nome="teoria" size={18} />Rivedi la teoria
                  </button>
                )}
                <button type="button" onClick={() => handleNext()}
                  className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[12px] bg-azione text-base font-bold text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
                  {isCorrect
                    ? <>{ultima ? 'Vedi com’è andata' : 'Avanti'} <Icona nome="avanti" size={22} /></>
                    : <>Riprova <Icona nome="riprova" size={20} /></>}
                </button>
              </div>
              {!isCorrect && attempts >= 2 && (
                <button type="button" onClick={() => handleNext(true)}
                  className="mx-auto inline-flex min-h-[44px] items-center gap-1.5 px-3 text-[14px] font-bold text-testo underline underline-offset-2">
                  <Icona nome="salta" size={16} />Vai avanti
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const FIDUCIA = [
  { id: 'low' as const, livello: 1, nome: 'Tirato a caso', pronto: 'border-basso bg-basso-tinta', colore: 'text-basso-numero' },
  { id: 'medium' as const, livello: 2, nome: 'Non del tutto', pronto: 'border-medio-numero bg-medio-tinta', colore: 'text-medio-numero' },
  { id: 'high' as const, livello: 3, nome: 'Sicuro', pronto: 'border-alto bg-alto-tinta', colore: 'text-alto-numero' },
];

/** Tre barre (una, due o tre piene): il livello di sicurezza si legge dalla forma, non solo dal colore. */
function BarreFiducia({ livello, className }: { livello: number; className?: string }) {
  return (
    <span aria-hidden="true" className={cn('flex h-[18px] items-end gap-[3px]', className)}>
      {[7, 12, 18].map((alt, i) => (
        <span key={alt} className={cn('w-[5px] rounded-[2px] bg-current', i >= livello && 'opacity-25')} style={{ height: alt }} />
      ))}
    </span>
  );
}

/** La spiegazione dopo la risposta: testo normale, a sinistra, tre righe; se è più lunga «Leggi tutto» la apre (e scorre da sola se non basta lo schermo). */
function Spiegazione({ testo }: { testo: string }) {
  const [aperta, setAperta] = useState(false);
  const [troncata, setTroncata] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !aperta) setTroncata(el.scrollHeight > el.clientHeight + 1);
  }, [testo, aperta]);
  return (
    <div data-testo-ok>
      <div className={aperta ? 'max-h-[30dvh] overflow-y-auto' : undefined}>
        <p ref={ref} className={cn('text-[15px] leading-[22px] font-normal text-testo', !aperta && 'line-clamp-3')}>{tipografiche(testo)}</p>
      </div>
      {(troncata || aperta) && (
        <button type="button" aria-expanded={aperta} onClick={() => { playTapSound(); setAperta(v => !v); }}
          className="mt-1 inline-flex min-h-[40px] items-center text-[14px] font-bold text-azione-testo underline underline-offset-2">
          {aperta ? 'Mostra meno' : 'Leggi tutto'}
        </button>
      )}
    </div>
  );
}

interface DomandaDaRiprendere { id: string; prompt: string; argomento: string }

/** Fine di una sessione: numeri veri con la loro parola (giuste, da riprendere, tempo, domande imparate prima e ora). La regola dell'«imparata» sta nella FAQ. */
function FineSessione({ corrette, totale, secondi, prima, dopo, gruppo, daRiprendere, regola, onContinua, onExit, onOpenTheory }: {
  corrette: number; totale: number; secondi: number; prima: number; dopo: number; gruppo: number;
  daRiprendere: DomandaDaRiprendere[]; regola?: { nome: string; theoryId: string };
  onContinua: () => void; onExit: () => void; onOpenTheory?: (id: string) => void;
}) {
  const pc = (n: number) => (gruppo > 0 ? Math.max(0, Math.min(100, (n / gruppo) * 100)) : 0);
  const differenza = dopo - prima;
  const mm = Math.floor(secondi / 60);
  const ss = String(secondi % 60).padStart(2, '0');
  const tessera = 'rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5 min-w-0';
  const parola = 'text-[12.5px] leading-[16px] font-semibold text-testo-tenue text-center';

  return (
    <div className="flex flex-col h-full w-full bg-superficie overflow-hidden transition-colors duration-100">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[520px] px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col items-center text-center">
            <span aria-hidden="true" className="grid place-items-center"><IllustrazioneAnimata nome="successo" lato={112} /></span>
            <h2 className="mt-1 text-[20px] leading-[26px] font-bold text-testo">Sessione completata</h2>
            <p role="img" aria-label={`${corrette} giuste su ${totale} al primo tentativo`} className="mt-1 text-[40px] leading-[44px] font-extrabold tabular-nums text-testo">
              {corrette}<span className="text-[22px] font-bold text-testo-tenue">/{totale}</span>
            </p>
            <p className="text-[13px] font-semibold text-testo-tenue">giuste al primo tentativo</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div role="group" aria-label={`${corrette} giuste al primo tentativo`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-alto-tinta text-alto-testo"><Icona nome="stato-risposta-giusta" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{corrette}</span>
              <span aria-hidden className={parola}>Giuste</span>
            </div>
            <div role="group" aria-label={`${daRiprendere.length} da riprendere`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-basso-tinta text-basso-testo"><Icona nome="stato-da-ripassare" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{daRiprendere.length}</span>
              <span aria-hidden className={parola}>Da riprendere</span>
            </div>
            <div role="group" aria-label={`Tempo ${mm}:${ss}`} className={tessera}>
              <span className="w-9 h-9 rounded-full flex items-center justify-center bg-medio-tinta text-medio-testo"><Icona nome="tempo" size={20} /></span>
              <span aria-hidden className="text-2xl font-extrabold tabular-nums leading-none text-testo">{mm}:{ss}</span>
              <span aria-hidden className={parola}>Tempo</span>
            </div>
          </div>

          {gruppo > 0 && (
            <section aria-label={`Domande imparate: prima ${prima}, ora ${dopo}, su ${gruppo}`} className="rounded-[12px] bg-superficie-2 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><span className="text-alto-numero"><Icona nome="stato-imparata" size={22} /></span>Domande imparate</h3>
                {differenza !== 0 && (
                  <span className={cn('inline-flex items-center rounded-full text-[13px] font-bold px-2.5 py-1 tabular-nums', differenza > 0 ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')}>
                    {differenza > 0 ? '+' : '−'}{Math.abs(differenza)}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-end justify-center gap-5 tabular-nums">
                <div className="text-center"><div className="text-3xl font-extrabold leading-none text-testo-tenue">{prima}</div><div className={cn(parola, 'mt-1')}>Prima</div></div>
                <span className="mb-5 text-testo-tenue"><Icona nome="avanti" size={24} /></span>
                <div className="text-center"><div className="text-3xl font-extrabold leading-none text-alto-numero">{dopo}</div><div className={cn(parola, 'mt-1')}>Ora, su {gruppo}</div></div>
              </div>
              <div className="mt-3 relative h-3 rounded-full bg-tacca overflow-hidden" role="presentation">
                <div className="absolute inset-y-0 left-0 rounded-full bg-alto" style={{ width: `${pc(dopo)}%` }} />
                <div className="absolute inset-y-0 w-0.5 bg-testo" style={{ left: `${pc(prima)}%` }} aria-hidden />
              </div>
            </section>
          )}

          {daRiprendere.length > 0 && (
            <section aria-labelledby="titolo-da-riprendere" className="rounded-[12px] bg-superficie-2 p-4 text-left">
              <h3 id="titolo-da-riprendere" className="mb-2.5 flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><span className="text-basso-numero"><Icona nome="stato-da-ripassare" size={20} /></span>Da riprendere</h3>
              <ul data-testo-ok className="divide-y divide-linea">
                {daRiprendere.slice(0, 5).map(d => (
                  <li key={d.id} className="py-2 first:pt-0 last:pb-0">
                    <p className="text-[14px] font-semibold text-testo leading-snug">{d.prompt}</p>
                    <p className="text-[12px] font-semibold text-testo-tenue mt-0.5">{d.argomento}</p>
                  </li>
                ))}
              </ul>
              {daRiprendere.length > 5 && <p className="mt-2 text-[13px] font-semibold text-testo-tenue tabular-nums">e altre {daRiprendere.length - 5}</p>}
              {regola && onOpenTheory && (
                <button type="button" onClick={() => { playTapSound(); onOpenTheory(regola.theoryId); }}
                  className="mt-3 w-full inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-azione/60 px-3 text-azione-testo font-bold text-sm hover:bg-azione-tinta transition-colors duration-100">
                  <Icona nome="teoria" size={18} /><span data-testo-ok>Rivedi la teoria: {regola.nome}</span>
                </button>
              )}
            </section>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-linea bg-superficie p-3 sm:p-4">
        <div className="mx-auto w-full max-w-[520px] flex flex-col gap-2">
          <button type="button" onClick={() => { playTapSound(); onContinua(); }}
            className="w-full inline-flex h-[52px] items-center justify-center gap-2.5 bg-azione hover:bg-azione-scuro text-azione-su rounded-[12px] px-4 font-bold text-base transition-colors duration-100">
            <Icona nome="studia" size={22} />Altre {QUANTE} domande
          </button>
          <button type="button" onClick={() => { playTapSound(); onExit(); }}
            className="w-full inline-flex h-[52px] items-center justify-center gap-2 bg-superficie border border-azione/60 text-azione-testo font-bold text-base rounded-[12px] transition-colors duration-100 hover:bg-azione-tinta">
            <Icona nome="home" size={20} />Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
}
