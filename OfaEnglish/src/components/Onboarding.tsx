import { useMemo, useRef, useState } from 'react';
import { BookOpen, ClipboardCheck, Cloud, AlertTriangle, Target, Zap, BarChart3, Lightbulb, Award } from 'lucide-react';
import { User } from 'firebase/auth';
import { AppState, OnboardingResult, Question } from '../types';
import { APP_NAME, DISCLAIMER, OFA_CONSEQUENCES, OFA_RULES_NOTE, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, SIM_PASS_SCORE } from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, weakTopics, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from './ui';
import Plans from './Plans';

type Step = 'intro' | 'certification' | 'certInfo' | 'ofa' | 'quizIntro' | 'quiz' | 'save' | 'risk' | 'result' | 'ready' | 'plans' | 'goal';

// Ordine dei passi con barra di avanzamento (l'intro non la mostra)
const PROGRESS_STEPS: Step[] = ['certification', 'ofa', 'quizIntro', 'quiz', 'save', 'risk', 'result', 'ready', 'plans'];

interface OnboardingProps {
  appState: AppState;
  user: User | null;
  onLogin: () => Promise<unknown> | void;
  onUpdateAppState: (state: AppState) => void;
  onFinish: (result: OnboardingResult) => void;
}

function Illustration({ icon: Icon, tone }: { icon: typeof BookOpen; tone: 'red' | 'blue' | 'green' | 'amber' }) {
  const tones = {
    red: 'bg-[#FEE2E2] text-[#EF4444] dark:bg-[#7F1D1D]/40',
    blue: 'bg-[#DBEAFE] text-[#3B82F6] dark:bg-[#1E3A8A]/40',
    green: 'bg-[#DCFCE7] text-[#22C55E] dark:bg-[#064E3B]/40',
    amber: 'bg-[#FEF3C7] text-[#F59E0B] dark:bg-[#78350F]/40',
  };
  return (
    <div className={cn("mx-auto my-4 w-32 h-32 sm:w-40 sm:h-40 rounded-[40px] flex items-center justify-center", tones[tone])}>
      <Icon className="w-16 h-16 sm:w-20 sm:h-20" strokeWidth={2} />
    </div>
  );
}

function Gauge({ percent, label }: { percent: number; label: string }) {
  // Semicerchio da 180°: colore a semaforo sulla probabilità di superare il test
  const color = percent >= 70 ? '#22C55E' : percent >= 40 ? '#F59E0B' : '#EF4444';
  const r = 80;
  const circumference = Math.PI * r;
  return (
    <svg viewBox="0 0 200 115" className="w-full max-w-[260px] mx-auto" role="img" aria-label={label}>
      <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" className="text-gray-200 dark:text-[#334155]" />
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - percent / 100)}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
      <text x="100" y="92" textAnchor="middle" fontSize="40" fontWeight="900" fill={color}>{label}</text>
    </svg>
  );
}

export default function Onboarding({ appState, user, onLogin, onUpdateAppState, onFinish }: OnboardingProps) {
  const [step, setStep] = useState<Step>('intro');
  const [hasCertification, setHasCertification] = useState<boolean | null>(null);
  const [hasOfa, setHasOfa] = useState<OnboardingResult['hasOfa'] | null>(null);
  const [quiz] = useState<Question[]>(() => pickDiagnosticQuestions());
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questionStart = useRef(Date.now());
  const stateRef = useRef(appState);
  stateRef.current = appState;

  const progressIndex = PROGRESS_STEPS.indexOf(step);
  const bar = progressIndex >= 0 ? { step: progressIndex + 1, totalSteps: PROGRESS_STEPS.length } : {};

  const correct = quiz.filter(q => answers[q.id] === q.correctIndex).length;
  const passPercent = useMemo(
    () => Math.round(estimatePassProbability(correct, quiz.length) * 100),
    [correct, quiz.length]
  );

  const result = (): OnboardingResult => ({
    completedAt: Date.now(),
    hasCertification: !!hasCertification,
    hasOfa: hasOfa ?? 'unknown',
    diagnosticCorrect: Object.keys(answers).length === quiz.length ? correct : undefined,
    diagnosticTotal: Object.keys(answers).length === quiz.length ? quiz.length : undefined,
    passProbability: Object.keys(answers).length === quiz.length ? passPercent / 100 : undefined,
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
      setStep(user ? 'risk' : 'save');
    }
  };

  switch (step) {
    case 'intro':
      return (
        <Screen>
          <div className="flex items-center gap-2 shrink-0">
            <img src="/favicon-64.png" alt="" className="w-9 h-9 rounded-xl" />
            <span className="font-black text-lg text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
          </div>
          <div className="mt-4">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Hai l'OFA <br />di <span className="text-[#EF4444]">inglese?</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg font-semibold text-gray-500 dark:text-gray-400">
              Scopri in 3 minuti a che punto sei e come superarlo.
            </p>
          </div>
          <Illustration icon={BookOpen} tone="red" />
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('certification')}>Inizia la verifica</PrimaryButton>
            <button onClick={() => { playTapSound(); onFinish(result()); }} className="text-sm font-bold text-gray-400 hover:text-gray-600 py-1">
              Salta, vai direttamente all'app
            </button>
            <p className="text-center text-[10px] font-semibold text-gray-400">{DISCLAIMER}</p>
          </div>
        </Screen>
      );

    case 'certification':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('intro')} />
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Hai già una certificazione di inglese riconosciuta dal tuo ateneo?
          </h2>
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
          <Illustration icon={Award} tone="green" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] text-center">Forse non ti serve il test</h2>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
            Con una certificazione accettata dall'ateneo di solito l'OFA si toglie senza fare il test. Controlla l'elenco delle certificazioni valide e i livelli minimi sulla pagina del tuo corso prima di pagare qualsiasi cosa.
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
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">
            Hai l'<span className="text-[#EF4444]">OFA</span> di inglese assegnato?
          </h2>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Puoi verificarlo nella tua pagina di immatricolazione.</p>
          <div className="flex flex-col gap-3 mt-2">
            <ChoiceCard selected={hasOfa === 'yes'} onClick={() => setHasOfa('yes')} title="Sì, ho l'OFA di inglese" />
            <ChoiceCard selected={hasOfa === 'no'} onClick={() => setHasOfa('no')} title="No, non ho l'OFA di inglese" subtitle="Puoi allenarti lo stesso" />
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
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Verifica il tuo livello di inglese</h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400">
            {DIAGNOSTIC_LENGTH} domande, circa 3 minuti. Il risultato è immediato.
          </p>
          <Illustration icon={ClipboardCheck} tone="blue" />
          <div className="mt-auto">
            <PrimaryButton onClick={() => { questionStart.current = Date.now(); setStep('quiz'); }}>Inizia il quiz</PrimaryButton>
          </div>
        </Screen>
      );

    case 'quiz': {
      const q = quiz[quizIndex];
      return (
        <Screen>
          <TopBar {...bar} onBack={quizIndex > 0 ? () => setQuizIndex(quizIndex - 1) : () => setStep('quizIntro')} />
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Domanda {quizIndex + 1} di {quiz.length}</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{q.prompt}</h2>
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
          <Illustration icon={Cloud} tone="blue" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] text-center">Salva i tuoi risultati</h2>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
            Accedi con Google per ritrovare progressi e piano di studio su telefono e computer. Usiamo il tuo account solo per salvare i tuoi dati di studio.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={async () => { try { await onLogin(); } finally { setStep('risk'); } }}>Accedi con Google</PrimaryButton>
            <SecondaryButton onClick={() => setStep('risk')}>Non ora</SecondaryButton>
          </div>
        </Screen>
      );

    case 'risk':
      return (
        <Screen>
          <TopBar {...bar} />
          <Illustration icon={AlertTriangle} tone="amber" />
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Se non superi l'OFA…</h2>
          <ul className="flex flex-col gap-3">
            {OFA_CONSEQUENCES.map(c => (
              <li key={c} className="flex gap-3 items-start font-bold text-[#0F172A] dark:text-gray-200">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-gray-400">{OFA_RULES_NOTE}</p>
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
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC]">Quiz completato!</h2>
            <p className="font-semibold text-gray-500 dark:text-gray-400">Hai risposto bene a {correct} domande su {quiz.length}.</p>
          </div>
          <Gauge percent={passPercent} label={passPercent === 0 ? '< 1%' : passPercent === 100 ? '> 99%' : `${passPercent}%`} />
          <p className="text-center font-black text-[#0F172A] dark:text-[#F8FAFC] -mt-2">
            Probabilità stimata di superare il test oggi
          </p>
          <p className="text-center text-xs font-semibold text-gray-400">
            Stima su {quiz.length} domande: al test servono {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. È un'indicazione, si affina con le simulazioni.
          </p>
          {weak.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Da ripassare</span>
              <div className="flex flex-wrap gap-2">
                {weak.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-black bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/40 dark:text-[#FCA5A5]">{t}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mt-auto">
            <PrimaryButton onClick={() => setStep('ready')}>Scopri come prepararti</PrimaryButton>
          </div>
        </Screen>
      );
    }

    case 'ready':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('result')} />
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] leading-tight">È il momento di prepararti.</h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400">Con 15 minuti al giorno arrivi al test sapendo davvero le regole.</p>
          <div className="flex flex-col gap-4 mt-2">
            {[
              { icon: Target, text: 'Simulazioni come l\'esame: 30 domande in 15 minuti', tone: 'text-[#EF4444] bg-[#FEE2E2]' },
              { icon: BarChart3, text: 'Ripasso che si adatta a te e ai tuoi errori', tone: 'text-[#F59E0B] bg-[#FEF3C7]' },
              { icon: Lightbulb, text: 'Spiegazioni per ogni domanda e un prontuario delle regole', tone: 'text-[#8B5CF6] bg-[#EDE9FE]' },
              { icon: Zap, text: 'Statistiche per argomento: sai sempre dove sei debole', tone: 'text-[#3B82F6] bg-[#DBEAFE]' },
            ].map(({ icon: Icon, text, tone }) => (
              <div key={text} className="flex items-center gap-4">
                <span className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", tone)}><Icon size={24} /></span>
                <span className="font-bold text-[#0F172A] dark:text-gray-200">{text}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <PrimaryButton onClick={() => setStep('plans')}>Scegli il piano</PrimaryButton>
          </div>
        </Screen>
      );

    case 'plans':
      return (
        <Plans
          appState={appState}
          user={user}
          step={bar.step}
          totalSteps={bar.totalSteps}
          onBack={() => setStep('ready')}
          onContinueFree={() => setStep('goal')}
        />
      );

    case 'goal':
      return (
        <Screen>
          <Illustration icon={Target} tone="red" />
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-[#F8FAFC] text-center leading-tight">Il tuo obiettivo è a portata di mano.</h2>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
            Inizia dal Primo Corpus e fai una sessione al giorno. Quando superi stabilmente {SIM_PASS_SCORE}/30 nel simulatore sei pronto.
          </p>
          <div className="mt-auto">
            <PrimaryButton onClick={() => onFinish(result())}>Vai alla dashboard</PrimaryButton>
          </div>
        </Screen>
      );
  }
}
