import { useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { User } from 'firebase/auth';
import { AppState, OnboardingResult, Question } from '../types';
import {
  APP_NAME, DISCLAIMER, FEATURE_FLAGS, FREE_FEATURES, OFA_CONSEQUENCES, OFA_RULES_NOTE, PASS,
  REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, currentPriceEur, isLaunchPrice, formatEur,
} from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, weakTopics, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { playTapSound } from '../lib/audio';
import { useAccess } from '../access/context';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from './ui';
import { Illustrazione } from '../brand/Illustrazione';
import { IconaChip, Misuratore } from '../brand/componenti';
import { ECOSYSTEM } from '../config/ecosystem';
import { urlIcona } from '../brand/risorse';

type Step = 'intro' | 'certification' | 'certInfo' | 'ofa' | 'quizIntro' | 'quiz' | 'save' | 'risk' | 'result' | 'ready';

interface OnboardingProps {
  appState: AppState;
  user: User | null;
  onLogin: () => Promise<unknown> | void;
  onUpdateAppState: (state: AppState) => void;
  onFinish: (result: OnboardingResult) => void;
  /** Apre il paywall (il pulsante "Vedi il Pass"). Il risultato dell'onboarding viene salvato prima. */
  onOpenPaywall?: () => void;
}

// Il passo di accesso con Project ID esiste solo se la funzione è accesa e non siamo nella demo online
const SHOW_LOGIN = FEATURE_FLAGS.projectId && import.meta.env.VITE_MODE !== 'demo';

const dataEstesa = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

// Illustrazioni del Brand Kit (kit rosso). Il tema scuro usa la variante con aloni semitrasparenti.
function Scena({ nome, gruppo }: { nome: string; gruppo?: string }) {
  const scuro = document.documentElement.classList.contains('dark');
  return (
    <div className="mx-auto my-3 flex items-center justify-center" style={{ minHeight: 150 }}>
      <Illustrazione kit="kit-rosso" nome={nome} gruppo={gruppo} lato={200} fondoScuro={scuro} />
    </div>
  );
}

export default function Onboarding({ appState, user, onLogin, onUpdateAppState, onFinish, onOpenPaywall }: OnboardingProps) {
  const { track } = useAccess();
  const [step, setStep] = useState<Step>('intro');
  const [hasCertification, setHasCertification] = useState<boolean | null>(null);
  const [hasOfa, setHasOfa] = useState<OnboardingResult['hasOfa'] | null>(null);
  // Se la scelta delle domande diventa asincrona (lib/diagnostic.ts) questo codice regge lo stesso
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questionStart = useRef(Date.now());
  const stateRef = useRef(appState);
  stateRef.current = appState;
  const diagTracked = useRef(false);
  const quizStartedAt = useRef<number | null>(null);

  useEffect(() => {
    let vivo = true;
    Promise.resolve(pickDiagnosticQuestions()).then(q => { if (vivo) setQuiz(q); });
    return () => { vivo = false; };
  }, []);

  // Una sola volta, quando l'utente vede il risultato
  useEffect(() => {
    if (step !== 'result' || diagTracked.current) return;
    diagTracked.current = true;
    const seconds = quizStartedAt.current ? Math.round((Date.now() - quizStartedAt.current) / 1000) : undefined;
    track({ name: 'diag_done', audience: hasOfa === 'yes' ? 'recupero' : 'prevenzione', seconds });
  }, [step, hasOfa, track]);

  // Barra di avanzamento: il passo di accesso conta solo se c'è
  const progressSteps = useMemo<Step[]>(
    () => ['certification', 'ofa', 'quizIntro', 'quiz', ...(SHOW_LOGIN ? ['save' as const] : []), 'risk', 'result', 'ready'],
    []
  );
  const progressIndex = progressSteps.indexOf(step);
  const bar = progressIndex >= 0 ? { step: progressIndex + 1, totalSteps: progressSteps.length } : {};

  const answered = quiz.length > 0 && Object.keys(answers).length === quiz.length;
  const correct = quiz.filter(q => answers[q.id] === q.correctIndex).length;
  const passPercent = useMemo(
    () => Math.round(estimatePassProbability(correct, quiz.length || DIAGNOSTIC_LENGTH) * 100),
    [correct, quiz.length]
  );

  const result = (): OnboardingResult => ({
    completedAt: Date.now(),
    hasCertification: !!hasCertification,
    hasOfa: hasOfa ?? 'unknown',
    diagnosticCorrect: answered ? correct : undefined,
    diagnosticTotal: answered ? quiz.length : undefined,
    passProbability: answered ? passPercent / 100 : undefined,
  });

  const handleQuizNext = () => {
    const q = quiz[quizIndex];
    const chosen = answers[q.id];
    // Le risposte del diagnostico alimentano già il ripasso dilazionato
    onUpdateAppState(updateStats(stateRef.current, q.id, chosen === q.correctIndex, Date.now() - questionStart.current));
    questionStart.current = Date.now();
    if (quizIndex + 1 < quiz.length) {
      setQuizIndex(quizIndex + 1);
    } else {
      setStep(SHOW_LOGIN && !user ? 'save' : 'risk');
    }
  };

  const titolo = 'text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]';
  const sotto = 'font-semibold text-gray-500 dark:text-gray-400';

  switch (step) {
    case 'intro':
      return (
        <Screen>
          <div className="flex items-center gap-2 shrink-0">
            <img src={urlIcona} alt="" className="w-9 h-9 rounded-xl" />
            <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
          </div>
          <div className="mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance text-[#0F172A] dark:text-[#F8FAFC]">
              Due domande su di te, poi <span className="text-[#EF4444]">{DIAGNOSTIC_LENGTH} di inglese.</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg font-semibold text-gray-500 dark:text-gray-400">
              Circa 3 minuti. Non serve un account e il risultato è subito sullo schermo.
            </p>
          </div>
          <Scena nome="studio-inglese" />
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('certification')}>Inizia il diagnostico</PrimaryButton>
            <button onClick={() => { playTapSound(); onFinish(result()); }} className="text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 py-1">
              Salta e vai all'app
            </button>
            <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
          </div>
        </Screen>
      );

    case 'certification':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('intro')} />
          <h2 className={titolo}>Hai già una certificazione di inglese riconosciuta dal tuo ateneo?</h2>
          <div className="flex flex-col gap-3 mt-2">
            <ChoiceCard selected={hasCertification === true} onClick={() => setHasCertification(true)} title="Sì, ho una certificazione" subtitle="Cambridge, IELTS, TOEFL…" />
            <ChoiceCard selected={hasCertification === false} onClick={() => setHasCertification(false)} title="No, non ho una certificazione" />
          </div>
          <div className="mt-auto">
            <PrimaryButton disabled={hasCertification === null} onClick={() => setStep(hasCertification ? 'certInfo' : 'ofa')}>Avanti</PrimaryButton>
          </div>
        </Screen>
      );

    case 'certInfo':
      return (
        <Screen>
          <TopBar onBack={() => setStep('certification')} />
          <Scena nome="piano-superamento" />
          <h2 className={`${titolo} text-center`}>Forse non ti serve il test</h2>
          <p className={`text-center ${sotto}`}>
            Se la tua certificazione è tra quelle accettate dal Politecnico, potresti non dover fare il test. Controlla l'elenco e i livelli minimi sul sito del tuo corso prima di pagare qualsiasi cosa.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('ofa')}>Voglio allenarmi comunque</PrimaryButton>
            <SecondaryButton onClick={() => onFinish(result())}>Vai all'app</SecondaryButton>
          </div>
        </Screen>
      );

    case 'ofa':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('certification')} />
          <h2 className={titolo}>
            Hai l'<span className="text-[#EF4444]">OFA</span> di inglese assegnato?
          </h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Se non sei sicuro, scegli «Non lo so ancora»: puoi allenarti lo stesso.</p>
          <div className="flex flex-col gap-3 mt-2">
            <ChoiceCard selected={hasOfa === 'yes'} onClick={() => setHasOfa('yes')} title="Sì, ho l'OFA di inglese" subtitle="Devo recuperarlo" />
            <ChoiceCard selected={hasOfa === 'no'} onClick={() => setHasOfa('no')} title="No, non ho l'OFA di inglese" subtitle="Preparo il test d'ingresso o mi alleno" />
            <ChoiceCard selected={hasOfa === 'unknown'} onClick={() => setHasOfa('unknown')} title="Non lo so ancora" />
          </div>
          <div className="mt-auto">
            <PrimaryButton disabled={hasOfa === null} onClick={() => setStep('quizIntro')}>Avanti</PrimaryButton>
          </div>
        </Screen>
      );

    case 'quizIntro':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('ofa')} />
          <h2 className={titolo}>Verifica il tuo livello di inglese</h2>
          <p className={sotto}>
            {DIAGNOSTIC_LENGTH} domande, circa 3 minuti. Il risultato è immediato.
          </p>
          <Scena nome="quiz-test" />
          <div className="mt-auto">
            <PrimaryButton disabled={quiz.length === 0} onClick={() => { questionStart.current = Date.now(); quizStartedAt.current = Date.now(); setStep('quiz'); }}>Inizia il quiz</PrimaryButton>
          </div>
        </Screen>
      );

    case 'quiz': {
      const q = quiz[quizIndex];
      if (!q) {
        return (
          <Screen>
            <TopBar {...bar} onBack={() => setStep('quizIntro')} />
            <p className={sotto} role="status">Preparo le domande…</p>
          </Screen>
        );
      }
      return (
        <Screen>
          <TopBar {...bar} onBack={quizIndex > 0 ? () => setQuizIndex(quizIndex - 1) : () => setStep('quizIntro')} />
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Domanda {quizIndex + 1} di {quiz.length}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{q.prompt}</h2>
          <div className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => (
              <ChoiceCard key={i} selected={answers[q.id] === i} onClick={() => setAnswers({ ...answers, [q.id]: i })} title={opt} />
            ))}
          </div>
          <div className="mt-auto">
            <PrimaryButton disabled={answers[q.id] === undefined} onClick={handleQuizNext}>
              {quizIndex + 1 < quiz.length ? 'Avanti' : 'Vedi il risultato'}
            </PrimaryButton>
          </div>
        </Screen>
      );
    }

    case 'save':
      return (
        <Screen>
          <TopBar {...bar} />
          <Scena nome="verifica-utente" />
          <h2 className={`${titolo} text-center`}>Salva i tuoi risultati</h2>
          <p className={`text-center ${sotto}`}>
            Accedi con il tuo {ECOSYSTEM.accountName} (con Google) per ritrovare progressi e piano di studio su telefono e computer. Subito dopo scegli tu cosa condividere.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={async () => { try { await onLogin(); } finally { setStep('risk'); } }}>Accedi con {ECOSYSTEM.accountName}</PrimaryButton>
            <SecondaryButton onClick={() => setStep('risk')}>Non ora</SecondaryButton>
          </div>
        </Screen>
      );

    case 'risk':
      return (
        <Screen>
          <TopBar {...bar} />
          <Scena nome="rischio-economico" />
          <h2 className={titolo}>Se non superi l'OFA…</h2>
          <ul className="flex flex-col gap-3">
            {OFA_CONSEQUENCES.map((c, i) => (
              <li key={c} className="flex gap-3 items-center font-semibold text-sm text-[#0F172A] dark:text-gray-200">
                <IconaChip nome={(['costo', 'blocco', 'info'] as const)[i % 3]} lato={36} />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{OFA_RULES_NOTE}</p>
          <div className="mt-auto">
            <PrimaryButton onClick={() => setStep('result')}>Vedi il tuo risultato</PrimaryButton>
          </div>
        </Screen>
      );

    case 'result': {
      const weak = weakTopics(quiz, answers);
      return (
        <Screen>
          <TopBar {...bar} />
          <div className="text-center">
            <h2 className={titolo}>Quiz completato</h2>
            <p className={sotto}>Hai risposto bene a {correct} {correct === 1 ? 'domanda' : 'domande'} su {quiz.length}.</p>
          </div>
          <div className="flex justify-center"><Misuratore valore={passPercent} larghezza={250} etichetta={passPercent === 0 ? '< 1%' : passPercent === 100 ? '> 99%' : `${passPercent}%`} /></div>
          <p className="text-center font-bold text-[#0F172A] dark:text-[#F8FAFC] -mt-2">
            Probabilità stimata di superare il test oggi
          </p>
          <p className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            Calcolata sulle tue {quiz.length} risposte: al test servono {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. Con così poche domande è una stima prudente e approssimativa; si affina con le simulazioni.
          </p>
          {weak.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">Da ripassare</span>
              <div className="flex flex-wrap gap-2">
                {weak.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/40 dark:text-[#FCA5A5]">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto">
            <PrimaryButton onClick={() => { setStep('ready'); }}>Scopri come prepararti</PrimaryButton>
          </div>
        </Screen>
      );
    }

    case 'ready': {
      const lancio = isLaunchPrice();
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('result')} />
          <h2 className={titolo}>Cosa ottieni gratis e cosa c'è nel Pass</h2>
          <div className="rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-4">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">Gratis, da subito</h3>
            <ul className="flex flex-col gap-2">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-[#0F172A] dark:text-gray-200">
                  <Check size={16} strokeWidth={3.5} className="text-[#EF4444] shrink-0 mt-0.5" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{PASS.name}</h3>
              <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {formatEur(currentPriceEur())}
                {lancio && <span className="ml-2 text-sm font-semibold text-gray-500 dark:text-gray-400"><span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s></span>}
              </span>
            </div>
            {lancio && <p className="text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5]">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>}
            <ul className="mt-2 flex flex-col gap-2">
              {PASS.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-[#0F172A] dark:text-gray-200">
                  <Check size={16} strokeWidth={3.5} className="text-[#EF4444] shrink-0 mt-0.5" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => onFinish(result())}>Continua gratis</PrimaryButton>
            {onOpenPaywall && (
              <SecondaryButton onClick={() => { onFinish(result()); onOpenPaywall(); }}>Vedi il Pass</SecondaryButton>
            )}
            <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
          </div>
        </Screen>
      );
    }
  }
}
