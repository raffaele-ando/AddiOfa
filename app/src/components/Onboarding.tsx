import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import { AppState, OnboardingResult, Question } from '../types';
import {
  FEATURE_FLAGS, OFA_RULES_NOTE, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, RETAKE_COST_EUR,
} from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, intervalloStima, formatProbabilita, weakTopics, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { playTapSound } from '../lib/audio';
import { useAccess } from '../access/context';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard } from './ui';
import { Illustrazione } from '../brand/Illustrazione';
import { IllustrazioneAnimata, eAnimata } from '../brand/IllustrazioneAnimata';
import { Misuratore } from '../brand/componenti';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { ECOSYSTEM } from '../config/ecosystem';
import Marchio from '../brand/Marchio';
import FoglioStima from './FoglioStima';
import CalcoloRisultato from './CalcoloRisultato';
import { Barra, coloreValore } from './home/comune';
import { livelloDi, type Livello } from './home/stima';
import { PulsanteInfo, IconaTono } from '../screens/extra/ui';
import { Dato, Fatti, InfoFoglio } from '../screens/landing/comune';
import { BloccoPrezzo, CONSEGUENZE, TabellaConfronto } from '../screens/landing/dati';
import { InfoIndipendenza } from '../screens/Footer';

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

// Messaggio per fascia di probabilità: in pagina c'è solo il titolo (con l'icona della fascia); la spiegazione onesta sta dietro la «i».
// La soglia (25 su 30) è alta: la fascia 'basso' comprende anche chi ha risposto bene a 8 domande su 10, e il testo lo dice.
const MESSAGGI: Record<Livello, { titolo: string; testo: string }> = {
  alto: { titolo: 'Hai buone basi', testo: 'Con queste risposte la stima è favorevole, ma dieci domande sono poche per dirlo con sicurezza. Una simulazione da 30 domande lo conferma o lo corregge.' },
  medio: { titolo: 'Sei vicino alla soglia', testo: 'Oggi potrebbe andare in un modo o nell\'altro. Ripassare gli argomenti sbagliati qui sotto e fare una simulazione ti dice meglio a che punto sei.' },
  basso: { titolo: 'Hai margine', testo: `Per superare il test servono ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}, quindi la stima parte bassa anche con un buon risultato. Non è un giudizio su di te: ripassa gli argomenti sbagliati qui sotto, poi misurati con una simulazione.` },
};

// Tessera "n/m" per area o livello: mai percentuali precise su così poche domande.
// Barra e numero hanno il tono della fascia (stesse soglie della Home): verde solido, ambra a metà, corallo da ripassare.
const TESTO_FASCIA: Record<Livello, string> = { alto: 'text-alto-testo', medio: 'text-medio-testo', basso: 'text-basso-testo' };
function Tessera({ nome, n, m }: { nome: string; n: number; m: number }) {
  const frazione = m ? n / m : 0;
  return (
    <div className="rounded-2xl border border-linea bg-superficie-2 p-3">
      <div className="text-xs font-bold text-testo-tenue">{nome}</div>
      <div className={`mt-0.5 text-lg font-extrabold leading-tight tabular-nums ${TESTO_FASCIA[livelloDi(frazione)]}`}>{n}/{m}</div>
      <div className="mt-2"><Barra valore={frazione * 100} colore={coloreValore(frazione * 100)} alta={6} /></div>
    </div>
  );
}

// Il messaggio del risultato è l'unico blocco tinto della schermata: ha la tinta e l'icona della fascia, come il banner della Home.
const STILE_MESSAGGIO: Record<Livello, { tinta: string; tessera: string; icona: NomeIcona }> = {
  alto: { tinta: 'bg-alto-tinta', tessera: 'bg-alto-pieno text-azione-su', icona: 'stato-ok' },
  medio: { tinta: 'bg-medio-tinta', tessera: 'bg-medio-pieno text-azione-su', icona: 'stato-attenzione' },
  basso: { tinta: 'bg-basso-tinta', tessera: 'bg-basso-pieno text-azione-su', icona: 'errori' },
};

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

/** Titolo di una schermata di domanda: icona tonda + poche parole (+ «i» facoltativa con i dettagli). */
function TestataDomanda({ icona, titolo, info, titoloInfo }: { icona: NomeIcona; titolo: string; info?: string; titoloInfo?: string }) {
  return (
    <div className="flex items-center gap-3">
      <IconaTono tono="azione" lato={52} className="!rounded-full"><Icona nome={icona} size={28} /></IconaTono>
      <h2 className="min-w-0 flex-1 text-2xl sm:text-3xl font-bold text-testo">{titolo}</h2>
      {info && <InfoFoglio titolo={titoloInfo ?? titolo}><p>{info}</p></InfoFoglio>}
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

  switch (step) {
    case 'intro':
      return (
        <Screen>
          <div className="flex items-center justify-between gap-2 shrink-0">
            <Marchio disposizione="orizzontale" altezza={34} />
            <InfoIndipendenza />
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-balance text-testo">
              <span className="text-azione">Diagnostico</span>
            </h1>
            <Fatti />
          </div>
          <Scena nome="studio-inglese" />
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('certification')}>Inizia</PrimaryButton>
            <button onClick={() => { playTapSound(); onFinish(result()); }} aria-label="Salta e vai all'app" className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-testo-tenue hover:text-testo py-1">
              <Icona nome="salta" size={16} />Salta
            </button>
          </div>
        </Screen>
      );

    case 'certification':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('intro')} />
          <TestataDomanda icona="certificazione" titolo="Certificazione?" info="Una certificazione di inglese riconosciuta dal tuo ateneo (Cambridge, IELTS, TOEFL…)." titoloInfo="Certificazione" />
          <div className="flex flex-col gap-3 mt-2">
            <ChoiceCard selected={hasCertification === true} onClick={() => setHasCertification(true)} title="Sì" />
            <ChoiceCard selected={hasCertification === false} onClick={() => setHasCertification(false)} title="No" />
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
          <div className="flex items-center justify-center gap-2">
            <h2 className={`${titolo} text-center`}>Forse sei esente</h2>
            <InfoFoglio titolo="Certificazione" etichetta="Dettagli sulla certificazione">
              <p>Se la tua certificazione è tra quelle accettate dal Politecnico, potresti non dover fare il test. Controlla l'elenco e i livelli minimi sul sito del tuo corso prima di pagare qualsiasi cosa.</p>
            </InfoFoglio>
          </div>
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => setStep('ofa')}>Mi alleno</PrimaryButton>
            <SecondaryButton onClick={() => onFinish(result())}>Vai all'app</SecondaryButton>
          </div>
        </Screen>
      );

    case 'ofa':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('certification')} />
          <TestataDomanda icona="ofa" titolo="OFA di inglese?" info="Se non sei sicuro, scegli «Non so»: puoi allenarti lo stesso." titoloInfo="OFA di inglese" />
          <div className="flex flex-col gap-3 mt-2">
            <ChoiceCard selected={hasOfa === 'yes'} onClick={() => setHasOfa('yes')} title="Sì" />
            <ChoiceCard selected={hasOfa === 'no'} onClick={() => setHasOfa('no')} title="No" />
            <ChoiceCard selected={hasOfa === 'unknown'} onClick={() => setHasOfa('unknown')} title="Non so" />
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
          <h2 className={titolo}>Diagnostico</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Dato icona="risposte" tono="azione" etichetta="Domande">{DIAGNOSTIC_LENGTH}</Dato>
            <Dato icona="tempo" tono="medio" etichetta="Durata">3 min</Dato>
          </div>
          <Scena nome="quiz-test" />
          <div className="mt-auto">
            <PrimaryButton disabled={quiz.length === 0} onClick={() => { questionStart.current = Date.now(); quizStartedAt.current = Date.now(); setStep('quiz'); }}>Inizia</PrimaryButton>
          </div>
        </Screen>
      );

    case 'quiz': {
      const q = quiz[quizIndex];
      if (!q) {
        return (
          <Screen>
            <TopBar {...bar} onBack={() => setStep('quizIntro')} />
            <div role="status" aria-label="Preparo le domande" className="mx-auto mt-8 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />
          </Screen>
        );
      }
      return (
        <Screen>
          <TopBar {...bar} onBack={quizIndex > 0 ? () => setQuizIndex(quizIndex - 1) : () => setStep('quizIntro')} />
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-testo-tenue tabular-nums" aria-label={`Domanda ${quizIndex + 1} di ${quiz.length}`}>
            <Icona nome="risposte" size={18} />{quizIndex + 1}/{quiz.length}
          </span>
          {/* la domanda e le opzioni sono contenuto del test */}
          <h2 data-testo-ok className="text-xl sm:text-2xl font-bold text-testo leading-snug">{q.prompt}</h2>
          <div data-testo-ok className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => (
              <ChoiceCard key={i} selected={answers[q.id] === i} onClick={() => setAnswers({ ...answers, [q.id]: i })} title={opt} />
            ))}
          </div>
          <div className="mt-auto">
            <PrimaryButton disabled={answers[q.id] === undefined} onClick={handleQuizNext}>
              {quizIndex + 1 < quiz.length ? 'Avanti' : 'Risultato'}
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
          <h2 className={`${titolo} text-center`}>Salva i progressi</h2>
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
          <div className="flex items-center gap-2">
            <h2 className={`${titolo} flex-1`}>Se non superi</h2>
            <InfoFoglio titolo="OFA di inglese" etichetta="Informazioni sulle conseguenze">
              <div className="flex flex-col gap-2">
                <p>Il test di recupero presso gli enti convenzionati costa circa {RETAKE_COST_EUR} € a tentativo. Finché l'OFA non è tolto, nel piano degli studi puoi inserire solo esami del 1° anno. Le scadenze per avere il piano completo del 2° anno cadono tra fine agosto e fine settembre.</p>
                <p>{OFA_RULES_NOTE}</p>
              </div>
            </InfoFoglio>
          </div>
          <ul className="flex flex-col gap-3">
            {CONSEGUENZE.map(c => (
              <li key={c.etichetta} className="flex items-center gap-4 rounded-2xl bg-superficie-2 p-3">
                <IconaTono tono={c.tono} lato={48}><Icona nome={c.icona} size={26} /></IconaTono>
                <span className="text-2xl font-extrabold leading-none text-testo">{c.valore}</span>
                <span className="ml-auto text-sm font-bold text-testo-tenue">{c.etichetta}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            <PrimaryButton onClick={() => setStep('calcolo')}>Risultato</PrimaryButton>
          </div>
        </Screen>
      );

    case 'calcolo': {
      const livelli = ['A1', 'A2', 'B1'].map(l => [l, quiz.filter(q => q.level === l).length] as const).filter(([, n]) => n > 0).map(([l, n]) => `${n} ${l}`).join(' · ');
      return (
        <Screen>
          <TopBar {...bar} />
          <CalcoloRisultato
            dati={{ esatte: correct, totale: quiz.length, livelli: livelli || 'misti', soglia: REAL_TEST_PASS_MARK, domandeTest: REAL_TEST_QUESTIONS }}
            onFine={() => setStep('result')}
          />
        </Screen>
      );
    }

    case 'result': {
      const weak = weakTopics(quiz, answers);
      const livello = livelloDi(passProb);
      const msg = MESSAGGI[livello];
      const conta = (filtro: (q: Question) => boolean) => {
        const dom = quiz.filter(filtro);
        return { m: dom.length, n: dom.filter(q => answers[q.id] === q.correctIndex).length };
      };
      const aree = ['Grammatica', 'Traduzione'].map(nome => ({ nome, ...conta(q => q.category === nome) })).filter(x => x.m > 0);
      const livelli = ['A1', 'A2', 'B1'].map(nome => ({ nome, ...conta(q => q.level === nome) })).filter(x => x.m >= 3);
      const tessere = [...aree, ...livelli];
      const { min, max } = intervallo.punteggio;
      return (
        <Screen>
          <TopBar {...bar} />
          <div className="flex items-center justify-center gap-4">
            <h2 className={titolo}>Risultato</h2>
            <Dato icona="risposte" tono="alto" etichetta="Risposte esatte">{correct}/{quiz.length}</Dato>
          </div>
          <div className="flex justify-center -mb-1"><Misuratore valore={passProb * 100} larghezza={300} testo={formatProbabilita(passProb)} etichetta={`Probabilità ${formatProbabilita(passProb)}`} /></div>
          <div className="flex items-center justify-center gap-4 -mt-1">
            <Dato icona="stima-intervallo" tono="azione" etichetta="Punteggio probabile al test">{min === max ? min : `${min}–${max}`}</Dato>
            <Dato icona="soglia" tono="medio" etichetta="Soglia">{REAL_TEST_PASS_MARK}</Dato>
            <PulsanteInfo onClick={() => setFoglio(true)} etichetta="Come viene calcolata la stima" />
          </div>
          <div className={`flex items-center gap-3 rounded-2xl p-4 ${STILE_MESSAGGIO[livello].tinta}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${STILE_MESSAGGIO[livello].tessera}`}><Icona nome={STILE_MESSAGGIO[livello].icona} size={20} /></span>
            <h3 className="min-w-0 flex-1 font-bold text-testo">{msg.titolo}</h3>
            <InfoFoglio titolo={msg.titolo} etichetta="Che cosa significa"><p>{msg.testo}</p></InfoFoglio>
          </div>
          {tessere.length > 0 && (
            <div className={`grid grid-cols-2 gap-2.5 ${tessere.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
              {tessere.map(x => <Tessera key={x.nome} nome={x.nome} n={x.n} m={x.m} />)}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-testo-tenue"><Icona nome="errori" size={16} />Da ripassare</span>
            {weak.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {weak.map(t => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-bold bg-basso-tinta text-basso-testo">{t}</span>
                ))}
              </div>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-bold text-alto-testo"><Icona nome="stato-ok" size={20} />Nessun errore</span>
            )}
          </div>
          <div className="mt-auto pt-1">
            <PrimaryButton onClick={() => { setStep('ready'); }}>Avanti</PrimaryButton>
          </div>
          <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo="diagnostico" risposte={quiz.length} />
        </Screen>
      );
    }

    case 'ready':
      return (
        <Screen>
          <TopBar {...bar} onBack={() => setStep('result')} />
          <div className="flex items-center gap-3">
            <IconaTono tono="viola" lato={52} className="!rounded-full"><Icona nome="pass" size={28} /></IconaTono>
            <h2 className={`${titolo} flex-1`}>Gratis o Pass</h2>
            <InfoIndipendenza />
          </div>
          <BloccoPrezzo />
          <TabellaConfronto />
          <div className="mt-auto flex flex-col gap-3">
            <PrimaryButton onClick={() => onFinish(result())}>Continua gratis</PrimaryButton>
            {onOpenPaywall && (
              <SecondaryButton onClick={() => { onFinish(result()); onOpenPaywall(); }}>Vedi il Pass</SecondaryButton>
            )}
          </div>
        </Screen>
      );
  }
}
