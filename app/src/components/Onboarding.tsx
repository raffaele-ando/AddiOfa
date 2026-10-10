import { useMemo, useRef, useState } from 'react';
// icone del Brand Kit: vedi IconaChip
import { User } from 'firebase/auth';
import { AppState, OnboardingResult, Question } from '../types';
import { APP_NAME, DISCLAIMER, OFA_CONSEQUENCES, OFA_RULES_NOTE, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, SIM_PASS_SCORE } from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, weakTopics, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { cn } from '../lib/utils';
import { playTapSound } from '../lib/audio';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from './ui';
import Plans from './Plans';
import { Illustrazione } from '../brand/Illustrazione';
import { IconaChip, Misuratore } from '../brand/componenti';
import { ECOSYSTEM } from '../config/ecosystem';
import { urlIcona } from '../brand/risorse';

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

// Illustrazioni del Brand Kit (kit rosso, come le schermate di riferimento), con l'animazione del
// catalogo. Il tema scuro usa la variante con aloni semitrasparenti.
function Scena({ nome, gruppo }: { nome: string; gruppo?: string }) {
  const scuro = document.documentElement.classList.contains('dark');
  return (
    <div className="mx-auto my-3 flex items-center justify-center" style={{ minHeight: 150 }}>
      <Illustrazione kit="kit-rosso" nome={nome} gruppo={gruppo} lato={200} fondoScuro={scuro} />
    </div>
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
            <img src={urlIcona} alt="" className="w-9 h-9 rounded-xl" />
            <span className="font-bold text-lg text-[#0F172A] dark:text-[#F8FAFC]">{APP_NAME}</span>
          </div>
          <div className="mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
              Hai l'OFA <br />di <span className="text-[#EF4444]">inglese?</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg font-semibold text-gray-500 dark:text-gray-400">
              Scopri in 3 minuti a che punto sei e come superarlo.
            </p>
          </div>
          <Scena nome="studio-inglese" />
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
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
          <Scena nome="piano-superamento" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center">Forse non ti serve il test</h2>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Verifica il tuo livello di inglese</h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400">
            {DIAGNOSTIC_LENGTH} domande, circa 3 minuti. Il risultato è immediato.
          </p>
          <Scena nome="quiz-test" />
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
          <span className="text-xs font-bold text-gray-400">Domanda {quizIndex + 1} di {quiz.length}</span>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center">Salva i tuoi risultati</h2>
          <p className="text-center font-semibold text-gray-500 dark:text-gray-400">
            Accedi con il tuo {ECOSYSTEM.accountName} (con Google) per ritrovare progressi e piano di studio su telefono, computer e nelle altre app {ECOSYSTEM.name}. Subito dopo scegli tu cosa condividere.
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
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Se non superi l'OFA…</h2>
          <ul className="flex flex-col gap-3">
            {OFA_CONSEQUENCES.map((c, i) => (
              <li key={c} className="flex gap-3 items-center font-semibold text-sm text-[#0F172A] dark:text-gray-200">
                <IconaChip nome={(['costo', 'blocco', 'contenuti'] as const)[i % 3]} lato={36} />
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Quiz completato!</h2>
            <p className="font-semibold text-gray-500 dark:text-gray-400">Hai risposto bene a {correct} domande su {quiz.length}.</p>
          </div>
          <div className="flex justify-center"><Misuratore valore={passPercent} larghezza={250} etichetta={passPercent === 0 ? '< 1%' : passPercent === 100 ? '> 99%' : `${passPercent}%`} /></div>
          <p className="text-center font-bold text-[#0F172A] dark:text-[#F8FAFC] -mt-2">
            Probabilità stimata di superare il test oggi
          </p>
          <p className="text-center text-xs font-semibold text-gray-400">
            Stima di {ECOSYSTEM.engineName} su {quiz.length} domande: al test servono {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. È un'indicazione, si affina con le simulazioni.
          </p>
          {weak.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-400">Da ripassare</span>
              <div className="flex flex-wrap gap-2">
                {weak.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/40 dark:text-[#FCA5A5]">{t}</span>
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">È il momento di prepararti.</h2>
          <p className="font-semibold text-gray-500 dark:text-gray-400">Con 15 minuti al giorno arrivi al test sapendo davvero le regole.</p>
          <div className="flex flex-col gap-4 mt-2">
            {[
              { icona: 'quiz', text: 'Simulazioni come l\'esame: 30 domande in 15 minuti' },
              { icona: 'studio', text: 'Ripasso che si adatta a te e ai tuoi errori' },
              { icona: 'contenuti', text: 'Spiegazioni per ogni domanda e un prontuario delle regole' },
              { icona: 'statistiche', text: 'Statistiche per argomento: sai sempre dove sei debole' },
            ].map(({ icona, text }) => (
              <div key={text} className="flex items-center gap-4">
                <IconaChip nome={icona as 'quiz'} lato={48} />
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
          <Scena nome="obiettivo" gruppo="stati" />
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC] text-center leading-tight">Il tuo obiettivo è a portata di mano.</h2>
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
