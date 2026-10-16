import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ClipboardCheck, Flag, Info } from 'lucide-react';
import type { User } from 'firebase/auth';
import { AppState, OnboardingResult, Question } from '../types';
import {
  DISCLAIMER, FEATURE_FLAGS, FREE_FEATURES, OFA_CONSEQUENCES, OFA_RULES_NOTE, PASS,
  REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, currentPriceEur, isLaunchPrice, formatEur,
} from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, intervalloStima, formatProbabilita, weakTopics, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { playTapSound } from '../lib/audio';
import { useAccess } from '../access/context';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from './ui';
import { Illustrazione } from '../brand/Illustrazione';
import { IllustrazioneAnimata, eAnimata } from '../brand/IllustrazioneAnimata';
import { IconaChip, Misuratore } from '../brand/componenti';
import { ECOSYSTEM } from '../config/ecosystem';
import Marchio from '../brand/Marchio';
import FoglioStima from './FoglioStima';
import CalcoloRisultato from './CalcoloRisultato';
import { Barra, RigaIntervallo, coloreValore } from './home/comune';
import { livelloDi, type Livello } from './home/stima';

type Step = 'intro' | 'certification' | 'certInfo' | 'ofa' | 'quizIntro' | 'quiz' | 'save' | 'risk' | 'calcolo' | 'result' | 'ready';

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

// Messaggio per fascia di probabilità: onesto, senza allarmismi e senza promesse
// La soglia (25 su 30) è alta: la fascia 'basso' comprende anche chi ha risposto bene a 8 domande su 10, e il testo lo dice.
const MESSAGGI: Record<Livello, { titolo: string; testo: string }> = {
  alto: { titolo: 'Hai buone basi', testo: 'Con queste risposte la stima è favorevole, ma dieci domande sono poche per dirlo con sicurezza. Una simulazione da 30 domande lo conferma o lo corregge.' },
  medio: { titolo: 'Sei vicino alla soglia', testo: 'Oggi potrebbe andare in un modo o nell\'altro. Ripassare gli argomenti sbagliati qui sotto e fare una simulazione ti dice meglio a che punto sei.' },
  basso: { titolo: 'Hai margine per migliorare', testo: `Per superare il test servono ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}, quindi la stima parte bassa anche con un buon risultato. Non è un giudizio su di te: ripassa gli argomenti sbagliati qui sotto, poi misurati con una simulazione.` },
};

// Tessera "n su m" per area o livello: mai percentuali precise su così poche domande.
// Barra e numero hanno il tono della fascia (stesse soglie della Home): verde solido, ambra a metà, corallo da ripassare.
const TESTO_FASCIA: Record<Livello, string> = { alto: 'text-alto-numero', medio: 'text-medio-numero', basso: 'text-basso-numero' };
function Tessera({ nome, n, m }: { nome: string; n: number; m: number }) {
  const frazione = m ? n / m : 0;
  return (
    <div className="rounded-2xl border border-linea bg-superficie-2 p-3">
      <div className="text-xs font-bold text-testo-tenue">{nome}</div>
      <div className="mt-0.5 text-lg font-extrabold leading-tight text-testo"><span className={TESTO_FASCIA[livelloDi(frazione)]}>{n}</span> <span className="text-sm font-bold text-testo-tenue">su {m}</span></div>
      <div className="mt-2"><Barra valore={frazione * 100} colore={coloreValore(frazione * 100)} alta={6} /></div>
    </div>
  );
}

// Il messaggio del risultato è l'unico blocco tinto della schermata: ha la tinta e l'icona della fascia, come il banner della Home.
const STILE_MESSAGGIO: Record<Livello, { tinta: string; tessera: string }> = {
  alto: { tinta: 'bg-alto-tinta', tessera: 'bg-alto-pieno text-azione-su' },
  medio: { tinta: 'bg-medio-tinta', tessera: 'bg-medio-pieno text-azione-su' },
  basso: { tinta: 'bg-basso-tinta', tessera: 'bg-basso-pieno text-azione-su' },
};
function IconaMessaggio({ livello }: { livello: Livello }) {
  return livello === 'alto' ? <Check size={20} strokeWidth={3} aria-hidden /> : livello === 'basso' ? <Flag size={18} strokeWidth={2.4} fill="currentColor" aria-hidden /> : <ClipboardCheck size={20} strokeWidth={2.2} aria-hidden />;
}

// Illustrazioni del Brand Kit (kit blu). Il tema scuro usa la variante con aloni semitrasparenti.
function Scena({ nome, gruppo }: { nome: string; gruppo?: string }) {
  const scuro = document.documentElement.classList.contains('dark');
  return (
    <div className="mx-auto my-3 flex items-center justify-center" style={{ minHeight: 150 }}>
      {eAnimata(nome)
        ? <IllustrazioneAnimata nome={nome} lato={200} />
        : <Illustrazione kit="kit-blu" nome={nome} gruppo={gruppo} lato={200} fondoScuro={scuro} />}
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
  const [foglio, setFoglio] = useState(false);

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
  const progressIndex = progressSteps.indexOf(step === 'calcolo' ? 'result' : step);
  const bar = progressIndex >= 0 ? { step: progressIndex + 1, totalSteps: progressSteps.length } : {};

  const answered = quiz.length > 0 && Object.keys(answers).length === quiz.length;
  const correct = quiz.filter(q => answers[q.id] === q.correctIndex).length;
  // Probabilità esatta (0-1): non si arrotonda né si salva arrotondata; per scriverla si usa formatProbabilita
  const passProb = useMemo(
    () => estimatePassProbability(correct, quiz.length || DIAGNOSTIC_LENGTH),
    [correct, quiz.length]
  );
  const intervallo = useMemo(() => intervalloStima(correct, quiz.length || DIAGNOSTIC_LENGTH), [correct, quiz.length]);

  const result = (): OnboardingResult => ({
    completedAt: Date.now(),
    hasCertification: !!hasCertification,
    hasOfa: hasOfa ?? 'unknown',
    diagnosticCorrect: answered ? correct : undefined,
    diagnosticTotal: answered ? quiz.length : undefined,
    passProbability: answered ? passProb : undefined,
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

  const titolo = 'text-2xl sm:text-3xl font-bold text-testo';
  const sotto = 'font-semibold text-testo-tenue';

  switch (step) {
    case 'intro':
      return (
        <Screen>
          <div className="flex items-center gap-2 shrink-0">
            <Marchio disposizione="orizzontale" altezza={34} />
          </div>
          <div className="mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance text-testo">
              Due domande su di te, poi <span className="text-azione">{DIAGNOSTIC_LENGTH} di inglese.</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg font-semibold text-testo-tenue">
              Circa 3 minuti. Non serve un account e il risultato è subito sullo schermo.
            </p>
          </div>
          <Scena nome="studio-inglese" />
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('certification')}>Inizia il diagnostico</PrimaryButton>
            <button onClick={() => { playTapSound(); onFinish(result()); }} className="text-sm font-bold text-testo-tenue hover:text-testo py-1">
              Salta e vai all'app
            </button>
            <p className="text-center text-[10px] font-semibold text-testo-tenue">{DISCLAIMER}</p>
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
          <Scena nome="superamento" />
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
            Hai l'<span className="text-azione">OFA</span> di inglese assegnato?
          </h2>
          <p className="text-sm font-semibold text-testo-tenue">Se non sei sicuro, scegli «Non lo so ancora»: puoi allenarti lo stesso.</p>
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
          <span className="text-xs font-bold text-testo-tenue">Domanda {quizIndex + 1} di {quiz.length}</span>
          <h2 className="text-xl sm:text-2xl font-bold text-testo leading-snug">{q.prompt}</h2>
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
              <li key={c} className="flex gap-3 items-center font-semibold text-sm text-testo">
                <IconaChip nome={(['costo', 'blocco', 'info'] as const)[i % 3]} lato={36} />
                {c}
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-testo-tenue">{OFA_RULES_NOTE}</p>
          <div className="mt-auto">
            <PrimaryButton onClick={() => setStep('calcolo')}>Vedi il tuo risultato</PrimaryButton>
          </div>
        </Screen>
      );

    case 'calcolo': {
      const livelli = ['A1', 'A2', 'B1'].map(l => [l, quiz.filter(q => q.level === l).length] as const).filter(([, n]) => n > 0).map(([l, n]) => `${n} ${l}`).join(', ');
      return (
        <Screen>
          <TopBar {...bar} />
          <CalcoloRisultato
            dati={{ esatte: correct, totale: quiz.length, livelli: livelli || 'livelli misti', soglia: REAL_TEST_PASS_MARK, domandeTest: REAL_TEST_QUESTIONS }}
            onFine={() => setStep('result')}
          />
        </Screen>
      );
    }

    case 'result': {
      const weak = weakTopics(quiz, answers);
      const msg = MESSAGGI[livelloDi(passProb)];
      const conta = (filtro: (q: Question) => boolean) => {
        const dom = quiz.filter(filtro);
        return { m: dom.length, n: dom.filter(q => answers[q.id] === q.correctIndex).length };
      };
      const aree = ['Grammatica', 'Traduzione'].map(nome => ({ nome, ...conta(q => q.category === nome) })).filter(x => x.m > 0);
      const livelli = ['A1', 'A2', 'B1'].map(nome => ({ nome, ...conta(q => q.level === nome) })).filter(x => x.m >= 3);
      const tessere = [...aree, ...livelli];
      return (
        <Screen>
          <TopBar {...bar} />
          <div className="text-center">
            <h2 className={titolo}>Il tuo risultato</h2>
            <p className={sotto}>Hai risposto bene a {correct} {correct === 1 ? 'domanda' : 'domande'} su {quiz.length}.</p>
          </div>
          <div className="flex justify-center -mb-1"><Misuratore valore={passProb * 100} larghezza={300} testo={formatProbabilita(passProb)} etichetta={`Probabilità ${formatProbabilita(passProb)}`} /></div>
          <div className="text-center -mt-1">
            <p className="font-bold text-testo">Probabilità stimata di superare il test oggi</p>
            <button type="button" onClick={() => setFoglio(true)} aria-haspopup="dialog"
              className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-testo-tenue hover:text-testo">
              Calcolata sulle tue {quiz.length} risposte
              <Info size={16} strokeWidth={2.5} className="text-azione " aria-hidden />
              <span className="sr-only">: come viene calcolata e perché è solo una stima</span>
            </button>
            <RigaIntervallo intervallo={intervallo} className="mt-1 px-2" />
          </div>
          <div className={`flex gap-3 rounded-2xl p-4 ${STILE_MESSAGGIO[livelloDi(passProb)].tinta}`}>
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${STILE_MESSAGGIO[livelloDi(passProb)].tessera}`}><IconaMessaggio livello={livelloDi(passProb)} /></span>
            <div className="min-w-0">
              <h3 className="font-bold text-testo">{msg.titolo}</h3>
              <p className="mt-1 text-sm font-semibold text-testo-tenue">{msg.testo}</p>
            </div>
          </div>
          {tessere.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-testo-tenue">Per area e per livello</span>
              <div className={`grid grid-cols-2 gap-2.5 ${tessere.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
                {tessere.map(x => <Tessera key={x.nome} nome={x.nome} n={x.n} m={x.m} />)}
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-testo-tenue">Da ripassare</span>
            {weak.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weak.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-bold bg-basso-tinta text-basso-testo">{t}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-testo-tenue">Nessun errore in queste {quiz.length} domande.</p>
            )}
          </div>
          <div className="mt-auto pt-1">
            <PrimaryButton onClick={() => { setStep('ready'); }}>Scopri come prepararti</PrimaryButton>
          </div>
          <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo="diagnostico" risposte={quiz.length} />
        </Screen>
      );
    }

    case 'ready': {
      const lancio = isLaunchPrice();
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('result')} />
          <h2 className={titolo}>Cosa ottieni gratis e cosa c'è nel Pass</h2>
          <div className="rounded-2xl border border-linea bg-superficie-2 p-4">
            <h3 className="font-bold text-testo mb-2">Gratis, da subito</h3>
            <ul className="flex flex-col gap-2">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-testo">
                  <Check size={16} strokeWidth={3.5} className="text-alto-numero shrink-0 mt-0.5" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-azione/30 bg-azione-tinta/50 p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-bold text-testo">{PASS.name}</h3>
              <span className="font-bold text-testo">
                {formatEur(currentPriceEur())}
                {lancio && <span className="ml-2 text-sm font-semibold text-testo-tenue"><span className="sr-only">invece di </span><s>{formatEur(PASS.priceEur)}</s></span>}
              </span>
            </div>
            {lancio && <p className="text-xs font-bold text-azione-scuro">Prezzo di lancio fino al {dataEstesa(PASS.launchUntil)}</p>}
            <ul className="mt-2 flex flex-col gap-2">
              {PASS.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm font-semibold text-testo">
                  <Check size={16} strokeWidth={3.5} className="text-azione shrink-0 mt-0.5" aria-hidden />
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
            <p className="text-center text-[10px] font-semibold text-testo-tenue">{DISCLAIMER}</p>
          </div>
        </Screen>
      );
    }
  }
}
