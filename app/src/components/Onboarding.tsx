import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState, OnboardingResult, Question } from '../types';
import { DISCLAIMER, OFA_CONSEQUENCES, OFA_RULES_NOTE, EXAM, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, RETAKE_COST_EUR } from '../config/offer';
import { pickDiagnosticQuestions, estimatePassProbability, intervalloStima, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { updateStats } from '../lib/spacedRepetition';
import { Screen, TopBar, PrimaryButton, SecondaryButton, ChoiceCard, Segmenti, TastoTesto, Titolo, Eroe, RigaStoria } from './ui';
import { Misuratore } from '../brand/componenti';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import Marchio from '../brand/Marchio';
import FoglioStima from './FoglioStima';
import { livelloDi, type Livello } from './home/stima';
import { InfoFoglio } from '../screens/landing/comune';
import { CampiConsensi, CampoEmail, campiPercorso, ElencoCorsi, formDa, nomeEffettivo, PilloleAnno, ScelteProvenienza, type FormRegistrazione } from '../screens/extra/progetto/registrazione';
import { anniDelLivello, elencoCorsi, livelliPresenti, corsoScelto, cammino, indiceDomanda, argomentiDaRipassare, testoErrori, ORDINE_RICHIESTE, type Richiesta } from './funnel-logica';
import { CORSO_ALTRO_ID, type LivelloId } from '../lib/progetto/percorso';
import { fonteCorsi } from '../lib/progetto/percorsoDati';
import { coda } from '../lib/progetto/coda';
import { corpoIscrizione, creaProfilo, impostaProfilo, leggiProgetto } from '../lib/progetto/profilo';
import { controllaDatiMinimi } from '../lib/progetto/validazione';
import { inviaLinkVerifica } from '../lib/firebase';
import type { LegalSection } from '../types';

interface OnboardingProps {
  appState: AppState;
  onUpdateAppState: (state: AppState) => void;
  onFinish: (result: OnboardingResult) => void;
  /** Solo la registrazione («Completa il profilo»): email, corso, come ci hai conosciuto, consensi. Chi ha già usato l'app non rifà il test di livello. */
  soloRegistrazione?: boolean;
  /** Apre una pagina legale (per il link all'informativa nel passo dei consensi). Senza, il link non compare. */
  onOpenLegal?: (s: LegalSection) => void;
}

// Ordine del percorso (decisione del 17/10, rivista il 18/10): perché farlo (pain → gain) → certificazione e OFA in una schermata (possono esonerare,
// quindi vengono prima di tutto) → le 10 domande del test, con le altre richieste SPARSE fra una domanda e l'altra, una per volta
// (email PoliMi dopo la 2ª, «come ci hai conosciuto» dopo la 3ª, il corso dopo la 5ª, i consensi dopo la 7ª) → risultato. Le ultime tre domande
// sono solo domande e fra l'ultima e il risultato non c'è nulla. 18 schermate in tutto; l'ordine è calcolato da `cammino` (funnel-logica.ts).
// «Calcolo» non c'è più: il risultato è già noto, un finto caricamento avrebbe solo aggiunto un tocco e una promessa non vera.

/** Perché farlo: guadagni (icona + frase intera). Le promesse sono quelle che AddiOFA può mantenere; il resto sta dietro la «i». */
const GUADAGNI: { icona: NomeIcona; testo: string }[] = [
  { icona: 'probabilita', testo: 'Una stima onesta della probabilità di superare il test' },
  { icona: 'modo-punti-deboli', testo: 'Quali argomenti ripassare, in ordine' },
  { icona: 'simulazioni', testo: `Simulazioni da ${EXAM.questions} domande in ${EXAM.minutes} minuti, come il test vero` },
];

// Messaggio per fascia di probabilità, visibile in pagina (non dietro la «i»): il titolo non contraddice mai il numero, la frase è vera e rassicura.
// La soglia (25 su 30) è alta: la fascia 'basso' comprende anche chi ha risposto bene a 8 domande su 10, e il testo lo dice.
const MESSAGGI: Record<Livello, { titolo: string; testo: string; icona: NomeIcona }> = {
  alto: { titolo: 'Hai buone basi', icona: 'stato-ok', testo: 'Con queste risposte la stima è favorevole. Con dieci domande è larga: una simulazione da 30 la conferma o la corregge.' },
  medio: { titolo: 'Sei vicino alla soglia', icona: 'stato-attenzione', testo: 'Oggi potrebbe andare in un modo o nell\'altro. Con dieci domande la stima è larga: ripassa gli errori e prova una simulazione.' },
  basso: { titolo: 'Si parte da qui', icona: 'stato-basso', testo: `Servono ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}: con dieci domande la stima parte bassa anche andando bene. Non è un giudizio su di te.` },
};
// La probabilità (arco) è un numero solo, intero, mai «0 %» né «100 %» (formatProbabilita) e sempre con la sua didascalia; per area o livello,
// su 3-5 domande, non si scrivono percentuali: il risultato mostra il punteggio probabile (fascia) contro la soglia e gli argomenti da ripassare con i loro errori.
const TESTO_FASCIA: Record<Livello, string> = { alto: 'text-alto-numero', medio: 'text-medio-numero', basso: 'text-basso-numero' };

/** Un testo con «___» (la parola mancante): il vuoto si disegna come un tratto, non come trattini di battitura. */
function ConVuoto({ testo }: { testo: string }) {
  const pezzi = testo.split(/(_{2,})/);
  return <>{pezzi.map((p, i) => /^_{2,}$/.test(p)
    ? <span key={i} role="img" aria-label="spazio da completare" className="mx-1 inline-block h-[3px] w-12 translate-y-[-0.2em] rounded-full bg-azione align-middle" />
    : <span key={i}>{p}</span>)}</>;
}

/** Messaggio di una riga sotto un pulsante o nel piè di pagina. */
const Micro = ({ children }: { children: ReactNode }) => <p data-testo-ok className="text-center text-[13px] leading-[18px] text-testo-tenue">{children}</p>;

export default function Onboarding({ appState, onUpdateAppState, onFinish, soloRegistrazione = false, onOpenLegal }: OnboardingProps) {
  // Chi ha già una registrazione completa non la rifà (apre il test dalla Home); gli altri la fanno nel funnel, con i dati già inseriti se c'erano.
  const giaRegistrato = useRef(!!leggiProgetto(appState).profilo?.completato && !soloRegistrazione);
  const precedente = appState.onboarding;
  // chi ha già detto se ha l'OFA e la certificazione non lo rifà
  const giaDetto = giaRegistrato.current && !!precedente;
  const [reg, setRegStato] = useState<FormRegistrazione>(() => formDa(leggiProgetto(appState).profilo));
  const regRef = useRef(reg);
  const setReg = (n: FormRegistrazione | ((r: FormRegistrazione) => FormRegistrazione)) => { const v = typeof n === 'function' ? n(regRef.current) : n; regRef.current = v; setRegStato(v); };
  const [provato, setProvato] = useState(false);
  const [hasCertification, setHasCertification] = useState<boolean | null>(() => (giaDetto && precedente ? precedente.hasCertification : null));
  const [hasOfa, setHasOfa] = useState<OnboardingResult['hasOfa'] | null>(() => (giaDetto && precedente ? precedente.hasOfa : null));
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questionStart = useRef(Date.now());
  const tempi = useRef<Record<string, number>>({});
  const stateRef = useRef(appState);
  stateRef.current = appState;
  const [foglio, setFoglio] = useState(false);
  // il corso: livello e anno stanno qui perché le pillole dell'anno sono nel piè di pagina
  const voci = useMemo(() => elencoCorsi(fonteCorsi), []);
  const [livCorso, setLivCorso] = useState<LivelloId>(() => reg.percorso.livello ?? corsoScelto(voci, reg.percorso)?.livello ?? livelliPresenti(voci)[0] ?? 'triennale');
  const [annoCorso, setAnnoCorso] = useState<number>(() => reg.percorso.anno ?? 1);

  // L'iscrizione parte da sola appena possibile e si riprova se il server non risponde (lib/progetto/coda.ts): mai un blocco per l'utente.
  useEffect(() => { coda.avvia(); }, []);

  useEffect(() => {
    let vivo = true;
    Promise.resolve(pickDiagnosticQuestions()).then(q => { if (vivo) setQuiz(q); });
    return () => { vivo = false; };
  }, []);

  // ---- La sequenza delle schermate e dove siamo
  const domande = quiz.length || DIAGNOSTIC_LENGTH;
  const passi = useMemo<string[]>(() => {
    if (soloRegistrazione) return ['email', 'corso', 'prov', 'consensi'];
    const richieste: Richiesta[] = giaRegistrato.current ? [] : [...ORDINE_RICHIESTE];
    return cammino({ domande, richieste, racconto: !giaRegistrato.current, avvio: giaRegistrato.current, certOfa: !giaDetto });
  }, [soloRegistrazione, domande, giaDetto]);
  const [pos, setPos] = useState(0);
  const k = passi[Math.min(pos, passi.length - 1)];
  const avanti = () => setPos(p => Math.min(p + 1, passi.length - 1));
  const indietro = () => setPos(p => Math.max(0, p - 1));
  const barra = { step: pos + 1, totalSteps: passi.length };
  const daIndietro = pos > 0 ? indietro : undefined;

  // il tocco su una scelta evidenzia la voce per un attimo e poi porta avanti da solo (col tasto indietro si corregge)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bloccato = useRef(false);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const poi = (fn: () => void) => {
    if (bloccato.current) return;
    bloccato.current = true;
    timer.current = setTimeout(() => { bloccato.current = false; fn(); }, 140);
  };
  // ogni schermata nuova riparte da capo (le domande misurano il tempo da qui)
  useEffect(() => { questionStart.current = Date.now(); bloccato.current = false; }, [pos]);

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

  const errori = controllaDatiMinimi({ nome: reg.nome, email: reg.email });
  const emailOk = !errori.email && !errori.nome;

  // Salva il profilo nel dispositivo (subito, a ogni passo). `completato` = la registrazione è arrivata ai consensi: solo allora si mette in coda l'invio ad ATLAS,
  // cioè dopo che l'utente ha visto l'informativa breve. I passi intermedi restano su questo dispositivo.
  const salva = (completato: boolean) => {
    const prec = leggiProgetto(stateRef.current).profilo;
    const r = regRef.current;
    const profilo = creaProfilo({ email: r.email, nome: nomeEffettivo(r) ?? '', ...campiPercorso(r.percorso), provenienza: r.provenienza, consensi: r.consensi, completato }, Date.now(), prec);
    if (!profilo) return null;
    onUpdateAppState(impostaProfilo(stateRef.current, profilo));
    if (completato) void coda.accoda(corpoIscrizione(profilo));
    return profilo;
  };

  /** Una risposta del test (indice della voce, -1 = «Non lo so», che conta come errata). L'ultima porta al risultato; le statistiche si scrivono una volta sola, alla fine. */
  const rispondi = (q: Question, i: number, ultima: boolean) => {
    if (bloccato.current) return;
    const nuove = { ...answers, [q.id]: i };
    setAnswers(nuove);
    tempi.current[q.id] = Date.now() - questionStart.current;
    poi(() => {
      if (ultima) {
        // le risposte del test alimentano già il ripasso dilazionato: una sola scrittura, in ordine di domanda
        let st = stateRef.current;
        const ora = Date.now();
        for (const d of quiz) if (nuove[d.id] !== undefined) st = updateStats(st, d.id, nuove[d.id] === d.correctIndex, tempi.current[d.id] ?? ora - questionStart.current);
        onUpdateAppState(st);
      }
      avanti();
    });
  };

  const indiceQ = indiceDomanda(k);

  // ---- La schermata di una domanda di profilo: titolo + campi + piè di pagina
  const barraTesta = (destra?: ReactNode) => <TopBar {...barra} onBack={daIndietro} destra={destra} />;

  // Risultato: nessuna freccia indietro (non si rifà il test dal risultato), la barra è piena
  if (k === 'result') {
    const argomenti = argomentiDaRipassare(quiz, answers);
    const livello = livelloDi(passProb);
    const msg = MESSAGGI[livello];
    const { min, max } = intervallo.punteggio;
    const totale = REAL_TEST_QUESTIONS;
    const da = (min / totale) * 100, a = (max / totale) * 100;
    const soglia = (REAL_TEST_PASS_MARK / totale) * 100;
    return (
      <Screen
        testata={<TopBar {...barra} />}
        piede={<>
          <PrimaryButton onClick={() => onFinish(result())}>Vai alla tua Home</PrimaryButton>
          <SecondaryButton onClick={() => setFoglio(true)}>Come viene calcolata la stima</SecondaryButton>
        </>}
      >
        <Titolo titolo="Il tuo punto di partenza" sotto={`Hai risposto bene a ${correct} ${correct === 1 ? 'domanda' : 'domande'} su ${quiz.length}.`} />

        {/* 1. L'arco: la probabilità di superare il test, con la sua didascalia */}
        <div className="flex flex-col items-center">
          <Misuratore valore={passProb * 100} larghezza={264} etichetta={`Probabilità di superare il test: ${Math.round(passProb * 100)} %`} />
          <p data-testo-ok className="mt-0 text-center text-[16px] leading-[22px] font-semibold text-testo">probabilità di superare il test</p>
        </div>

        {/* 2. Il punteggio probabile contro la soglia, e che cosa vuol dire */}
        <section aria-label="Punteggio probabile" className="flex flex-col gap-3 rounded-2xl border border-tacca bg-superficie-2 p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span data-testo-ok className="text-[15px] leading-[20px] font-semibold text-testo">Punteggio probabile</span>
            <span className="text-[17px] leading-[24px] font-bold tabular-nums text-testo">{min === max ? min : `${min}–${max}`} <span className="text-[14px] font-medium text-testo-tenue">su {totale}</span></span>
          </div>
          <div className="relative pt-6" role="img" aria-label={`Punteggio probabile da ${min} a ${max} su ${totale}; la soglia è ${REAL_TEST_PASS_MARK}`}>
            <span data-testo-ok className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[13px] leading-[16px] font-semibold text-testo" style={{ left: `${soglia}%` }}>soglia {REAL_TEST_PASS_MARK}</span>
            <div className="relative h-3 rounded-full bg-testo-tenue/30">
              <div className="absolute inset-y-0 rounded-full bg-azione" style={{ left: `${da}%`, width: `max(${a - da}%, 8px)` }} />
              <div className="absolute -top-1.5 h-6 w-[3px] -translate-x-1/2 rounded-full bg-testo" style={{ left: `${soglia}%` }} />
            </div>
            <div aria-hidden="true" className="mt-1.5 flex justify-between text-[12px] leading-[16px] tabular-nums text-testo-tenue"><span>0</span><span>10</span><span>20</span><span>30</span></div>
          </div>
          <div className="flex items-start gap-3 border-t border-linea pt-3">
            <Icona nome={msg.icona} size={24} className={`mt-0.5 ${TESTO_FASCIA[livello]}`} />
            <div className="min-w-0">
              <h3 data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">{msg.titolo}</h3>
              <p data-testo-ok className="mt-0.5 text-[15px] leading-[22px] text-testo-tenue">{msg.testo}</p>
            </div>
          </div>
        </section>

        {/* 3. Da dove cominciare */}
        <section aria-label="Da dove cominciare" className="flex flex-col gap-2">
          <h3 data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">Da dove cominciare</h3>
          {argomenti.length > 0 ? (
            <>
              <ul className="flex flex-col gap-2">
                {argomenti.slice(0, 3).map(x => (
                  <li key={x.nome} className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-tacca bg-superficie-2 px-4 py-2">
                    <span data-testo-ok className="min-w-0 text-[16px] leading-[22px] font-semibold text-testo">{x.nome}</span>
                    <span className="shrink-0 text-[14px] leading-[20px] tabular-nums text-testo-tenue">{testoErrori(x.errori)}</span>
                  </li>
                ))}
              </ul>
              {argomenti.length > 3 && <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">e altri {argomenti.length - 3} {argomenti.length - 3 === 1 ? 'argomento' : 'argomenti'}</p>}
            </>
          ) : (
            <p className="inline-flex items-center gap-2 text-[16px] leading-[22px] font-semibold text-alto-testo"><Icona nome="stato-ok" size={22} />Nessun errore</p>
          )}
        </section>
        <FoglioStima aperto={foglio} onChiudi={() => setFoglio(false)} tipo="diagnostico" risposte={quiz.length} />
      </Screen>
    );
  }

  // ---- Una domanda del test
  if (indiceQ !== null) {
    const q = quiz[indiceQ];
    if (!q) {
      return (
        <Screen testata={barraTesta()}>
          <div role="status" aria-label="Preparo le domande" className="mx-auto mt-8 h-7 w-7 animate-spin rounded-full border-[3px] border-azione/30 border-t-azione" />
        </Screen>
      );
    }
    const n = quiz.length;
    const tappa = indiceQ + 1 === Math.ceil(n / 2) ? ' · Sei a metà' : indiceQ + 1 === n - 2 ? ' · Ultime tre' : '';
    const ultima = indiceQ + 1 >= n;
    return (
      <Screen testata={barraTesta()} piede={<div className="flex justify-center"><TastoTesto onClick={() => rispondi(q, -1, ultima)}>Non lo so</TastoTesto></div>}>
        <div className="flex flex-col gap-2">
          <p className="text-[13px] leading-[18px] font-medium text-testo-tenue tabular-nums" aria-label={`Domanda ${indiceQ + 1} di ${n}`}>Domanda {indiceQ + 1} di {n}{tappa}</p>
          {/* la domanda e le opzioni sono contenuto del test */}
          <h2 data-testo-ok className="text-[24px] leading-[32px] font-semibold text-testo"><ConVuoto testo={q.prompt} /></h2>
          {indiceQ === 0 && <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Scegli la risposta giusta: toccandola passi alla domanda dopo.</p>}
        </div>
        <div data-testo-ok className="flex flex-1 flex-col gap-3">
          {q.options.map((opt, i) => (
            <div key={i} className="flex min-h-16 max-h-[104px] flex-1 [&>button]:h-full">
              <ChoiceCard selected={answers[q.id] === i} onClick={() => rispondi(q, i, ultima)} title={opt} />
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  switch (k) {
    // ---- Perché farlo: prima di qualsiasi domanda. «Se non superi» (pain) e cosa si ottiene (gain).
    case 'pain':
      return (
        <Screen
          testata={<div className="flex h-14 shrink-0 items-center"><Marchio disposizione="orizzontale" altezza={34} /></div>}
          piede={<>
            <PrimaryButton onClick={avanti}>Scopri a che punto sei</PrimaryButton>
            <Micro>{DISCLAIMER}</Micro>
          </>}
        >
          <Eroe nome="rischio-economico-ali" min={112} />
          <Titolo titolo="Se non superi l'OFA di inglese"
            destra={
              <InfoFoglio titolo="OFA di inglese" etichetta="Informazioni sulle conseguenze">
                <div className="flex flex-col gap-2">
                  <p>{OFA_CONSEQUENCES[0]}. {OFA_CONSEQUENCES[1]}. {OFA_CONSEQUENCES[2]}.</p>
                  <p>{OFA_RULES_NOTE}</p>
                </div>
              </InfoFoglio>
            } />
          <ul className="flex flex-col">
            <RigaStoria tono="basso" icona="soglia" testo={`Si supera con ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}`} />
            <RigaStoria tono="basso" icona="costo" testo={`Un nuovo tentativo costa circa ${RETAKE_COST_EUR} €`} />
            <RigaStoria tono="basso" icona="blocco" testo="Finché c'è l'OFA, nel piano di studi puoi inserire solo esami del 1° anno" />
          </ul>
        </Screen>
      );

    case 'gain':
      return (
        <Screen
          testata={<TopBar {...barra} onBack={daIndietro} />}
          piede={<PrimaryButton onClick={avanti} disabled={quiz.length === 0}>Inizia il test di livello</PrimaryButton>}
        >
          <Eroe nome="piano-superamento" min={112} />
          <Titolo titolo="Arrivi al test sapendo a che punto sei" sotto={`${DIAGNOSTIC_LENGTH} domande e una stima subito dopo.`}
            destra={
              <InfoFoglio titolo="Che cosa ottieni" etichetta="Informazioni su cosa ottieni">
                <div className="flex flex-col gap-2">
                  <p>Il test di livello ti dà una stima onesta della probabilità di superare il test, con l'intervallo di incertezza: con dieci domande è larga, e si stringe con le simulazioni.</p>
                  <p>AddiOFA non toglie l'OFA e non garantisce l'esito: ti aiuta a ripassare ciò che sbagli e ad arrivare preparato al test. Se lo superi, l'OFA si toglie e il piano del 2° anno si apre.</p>
                </div>
              </InfoFoglio>
            } />
          <ul className="flex flex-col">
            {GUADAGNI.map(g => <RigaStoria key={g.testo} tono="alto" icona={g.icona} testo={g.testo} />)}
          </ul>
        </Screen>
      );

    // Chi ha già la registrazione e rifà il test dalla Home: una schermata di avvio
    case 'avvio':
      return (
        <Screen
          testata={<TopBar {...barra} />}
          piede={<PrimaryButton onClick={avanti} disabled={quiz.length === 0}>Inizia le {DIAGNOSTIC_LENGTH} domande</PrimaryButton>}
        >
          <Eroe nome="quiz-test" min={112} />
          <Titolo titolo="Test di livello" sotto={`${DIAGNOSTIC_LENGTH} domande e la tua stima aggiornata.`} />
        </Screen>
      );

    // ---- Certificazione e OFA in una schermata: prima delle domande, perché possono esonerare dal test
    case 'certOfa': {
      const esenteForse = hasCertification === true;
      const pronto = hasCertification !== null && hasOfa !== null;
      return (
        <Screen
          testata={<TopBar {...barra} onBack={daIndietro} />}
          piede={esenteForse ? (
            <>
              <PrimaryButton disabled={!pronto} onClick={avanti}>Mi preparo lo stesso</PrimaryButton>
              <SecondaryButton onClick={() => onFinish(result())}>Vai all'app</SecondaryButton>
            </>
          ) : (
            <PrimaryButton disabled={!pronto} onClick={avanti}>Continua</PrimaryButton>
          )}
        >
          <Eroe nome="superamento" />
          <Titolo titolo="Da dove parti" />
          <div role="group" aria-labelledby="dom-ofa" className="flex flex-col gap-2">
            <p id="dom-ofa" data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">Hai l'OFA di inglese?</p>
            <Segmenti<'yes' | 'no' | 'unknown'> etichetta="OFA di inglese" voci={[{ id: 'yes', nome: 'Sì' }, { id: 'no', nome: 'No' }, { id: 'unknown', nome: 'Non so' }]} valore={hasOfa} onChange={setHasOfa} />
            <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Se non sei sicuro, scegli «Non so»: puoi prepararti lo stesso.</p>
          </div>
          <div role="group" aria-labelledby="dom-cert" className="flex flex-col gap-2">
            <p id="dom-cert" data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">Hai una certificazione d'inglese?</p>
            <Segmenti etichetta="Certificazione d'inglese" voci={[{ id: 'si', nome: 'Sì' }, { id: 'no', nome: 'No' }]} valore={hasCertification === null ? null : hasCertification ? 'si' : 'no'} onChange={id => setHasCertification(id === 'si')} />
            <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Per esempio Cambridge, IELTS o TOEFL.</p>
          </div>
          {esenteForse && (
            <div role="status" className="flex items-start gap-3 rounded-2xl bg-azione-tinta p-4">
              <Icona nome="certificazione" size={24} className="mt-0.5 text-azione-testo" />
              <div className="min-w-0">
                <p data-testo-ok className="text-[17px] leading-[24px] font-semibold text-testo">Forse non devi fare il test</p>
                <p data-testo-ok className="mt-0.5 text-[15px] leading-[22px] text-testo">Se la tua certificazione è tra quelle accettate dal Politecnico, potresti essere esentato. Controlla l'elenco e i livelli minimi sul sito del tuo corso.</p>
              </div>
            </div>
          )}
        </Screen>
      );
    }

    // ---- Email PoliMi: un solo campo; il nome si ricava
    case 'email':
      return (
        <Screen
          testata={<TopBar {...barra} onBack={soloRegistrazione ? undefined : daIndietro} />}
          piede={<PrimaryButton onClick={() => {
            if (!emailOk) { setProvato(true); return; }
            salva(false);
            avanti();
          }}>Continua</PrimaryButton>}
        >
          <Eroe nome="verifica-utente" max={240} />
          <Titolo etichetta="Su di te" titolo="La tua email PoliMi" sotto="Ci serve per creare la tua iscrizione. Le novità per email sono facoltative." />
          <CampoEmail form={reg} onChange={setReg} provato={provato}
            verificata={leggiProgetto(appState).profilo?.emailVerificata && leggiProgetto(appState).profilo?.email === reg.email.trim().toLowerCase()}
            onInviaVerifica={async () => {
              if (!emailOk || !salva(false)) return { ok: false as const, messaggio: 'Scrivi prima il tuo nome.' };
              return inviaLinkVerifica(reg.email);
            }} />
        </Screen>
      );

    // ---- «Come ci hai conosciuto?»: una domanda come le altre, ma non conta nel punteggio né nel x/10. Il tocco avanza da solo; «Salta» in alto.
    case 'prov':
      return (
        <Screen
          testata={<TopBar {...barra} onBack={soloRegistrazione && pos === 0 ? undefined : daIndietro}
            destra={<TastoTesto icona="salta" etichetta="Salta questa domanda" onClick={() => { setReg({ ...reg, provenienza: '' }); salva(false); avanti(); }}>Salta</TastoTesto>} />}
          piede={<Micro>Tocca una voce per continuare.</Micro>}
        >
          <Eroe nome="messaggi-supporto" max={240} />
          <Titolo etichetta="Su di te" titolo="Come ci hai conosciuto?" sotto="Ci aiuta a capire dove farci trovare." />
          <ScelteProvenienza valore={reg.provenienza} onChange={id => {
            setReg({ ...reg, provenienza: id });
            salva(false);
            poi(avanti);
          }} />
        </Screen>
      );

    // ---- Che corso frequenti: livello, ricerca, elenco (scuola e sede si ricavano dal corso), anno nelle pillole in basso. Il tocco su un corso avanza da solo.
    case 'corso':
      return (
        <Screen
          testata={<TopBar {...barra} onBack={soloRegistrazione && pos === 0 ? undefined : daIndietro} />}
          piede={
            <div className="flex flex-col gap-2">
              <p data-testo-ok className="text-[13px] leading-[18px] font-medium text-testo-tenue">In che anno sei? Poi tocca il tuo corso.</p>
              <PilloleAnno voci={voci} livello={livCorso} anno={annoCorso} onChange={setAnnoCorso} />
            </div>
          }
        >
          <Titolo etichetta="Su di te" titolo="Che corso frequenti?" />
          <ElencoCorsi
            scelte={reg.percorso} livello={livCorso} onLivello={l => { setLivCorso(l); setAnnoCorso(a => Math.min(a, anniDelLivello(voci, l))); }} anno={annoCorso}
            onScelto={s => { setReg(r => ({ ...r, percorso: s })); salva(false); poi(avanti); }}
            onAltro={() => { setReg(r => ({ ...r, percorso: { livello: livCorso, corso: CORSO_ALTRO_ID, anno: annoCorso } })); salva(false); poi(avanti); }} />
        </Screen>
      );

    // ---- Consensi facoltativi, mai preselezionati; qui l'iscrizione si completa e parte la coda
    case 'consensi': {
      const nessuno = !reg.consensi.noi && !reg.consensi.atlas && !reg.consensi.comunicazioni;
      return (
        <Screen
          testata={<TopBar {...barra} onBack={daIndietro} />}
          piede={<PrimaryButton onClick={() => {
            if (!salva(true)) return;
            if (soloRegistrazione) onFinish(stateRef.current.onboarding ?? result());
            else avanti();
          }}>{soloRegistrazione ? 'Salva' : nessuno ? 'Continua senza' : 'Continua'}</PrimaryButton>}
        >
          <Eroe nome="documento-completato" max={160} />
          <Titolo etichetta="Su di te" titolo="Le tue scelte" sotto="Sono tutte facoltative. Puoi cambiare idea quando vuoi." />
          <CampiConsensi senzaIntro consensi={reg.consensi} onChange={c => setReg({ ...reg, consensi: c })} onOpenLegal={onOpenLegal} />
        </Screen>
      );
    }
  }
  return null;
}
