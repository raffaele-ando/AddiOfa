import { useState, useMemo, useEffect } from 'react';
import { AppState, PaywallReason } from '../types';
import { X, TrendingUp, AlertCircle, Clock, List, ArrowLeft, Activity, Filter, ArrowDownUp, ArrowUp, ArrowDown, Minus, Check, Lock, Loader2, ChevronLeft } from 'lucide-react';
import { cn, chiaveGiorno } from '../lib/utils';
import { REGOLA_IMPARATA } from './home/comune';
import { confidenceFromEasiness, bankMeta, poolMeta, countLearned, isLearned } from '../lib/spacedRepetition';
import GuaranteeTracker from './GuaranteeTracker';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import { PoweredByAtlas } from './ui';
import { useAccess } from '../access/context';
import { FEATURE_FLAGS, FORMATS, PASS } from '../config/offer';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { serieStime } from './home/stima';
import GraficoStime from './home/GraficoStime';
import { Tessere, AndamentoSimulazioni, PerArgomento, Obiettivi } from '../screens/extra/studio/StatistichePezzi';
import { playTapSound } from '../lib/audio';

// Grafici (Recharts): colori dai token, così il tema scuro li cambia da solo.
const GRIGLIA = 'var(--color-linea)';
const ASSE = 'var(--color-testo-tenue)';
const AZIONE = 'var(--color-azione)';
const ALTO = 'var(--color-alto)';
const TRACCIA = 'var(--color-tacca)';
const CURSORE = 'color-mix(in srgb, var(--color-testo) 6%, transparent)';
const TOOLTIP = { borderRadius: '12px', border: '1px solid var(--color-linea)', fontWeight: 'bold', color: 'var(--color-testo)', backgroundColor: 'var(--color-superficie)', boxShadow: 'none' } as const;

interface StatsModeProps {
  appState: AppState;
  onExit: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  /** Aprono il percorso e una lezione (schermate extra): se assenti, «Per argomento» resta senza collegamenti. */
  onVaiPercorso?: () => void;
  onApriLezione?: (topicId: string) => void;
  /** Dentro la struttura extra la pagina ha già la sua cornice: si toglie solo l'arrotondamento esterno. */
  incorniciata?: boolean;
}

// Scarica il testo delle domande dal provider a gruppi, senza ripetere quelle già in mano
async function fetchPrompts(
  provider: ReturnType<typeof useAccess>['provider'],
  ids: string[],
  have: Record<string, string>
): Promise<Record<string, string>> {
  const missing = ids.filter(id => !(id in have));
  const out: Record<string, string> = {};
  for (let i = 0; i < missing.length; i += 80) {
    const list = await provider.getQuestions(missing.slice(i, i + 80));
    list.forEach(q => { out[q.id] = q.prompt; });
  }
  return out;
}

/** Intestazione della schermata: freccia indietro, titolo del concept e illustrazione. */
function Intestazione({ sotto, onExit }: { sotto: string; onExit: () => void }) {
  return (
    <header className="flex items-center gap-1 shrink-0">
      <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Indietro"
        className="-ml-2 grid place-items-center w-10 h-10 shrink-0 rounded-full text-testo-tenue hover:text-testo">
        <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="text-[26px] leading-[32px] font-extrabold tracking-[-0.02em] text-testo">Le tue statistiche</h1>
        <p className="text-sm text-testo-tenue">{sotto}</p>
      </div>
      <IllustrazioneAnimata nome="progressi-statistiche" lato={84} />
    </header>
  );
}

export default function StatsMode({ appState, onExit, onNeedPass, onVaiPercorso, onApriLezione }: StatsModeProps) {
  const { provider, pass } = useAccess();
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [answersText, setAnswersText] = useState<Record<string, string>>({});
  const [promptsState, setPromptsState] = useState<'idle' | 'loading' | 'error'>('idle');

  // Indice leggero del banco: senza Pass solo il nucleo gratuito
  const allMeta = useMemo(() => poolMeta(pass, 'all'), [pass]);
  const activeMeta = useMemo(() => poolMeta(pass, appState.selectedCorpus || 'all'), [pass, appState.selectedCorpus]);

  // Compute stats
  // Stesso materiale del menu: con il nucleo di base la percentuale è calcolata su quelle domande
  const totalQuestions = activeMeta.length;
  const masteredQuestions = countLearned(appState.stats, activeMeta.map(q => q.id));
  const masteryPercentage = Math.round((masteredQuestions / totalQuestions) * 100) || 0;
  
  const examsTaken = appState.history.length;
  const passedExams = appState.history.filter(h => h.passed).length;
  const passRate = examsTaken > 0 ? Math.round((passedExams / examsTaken) * 100) : 0;
  
  const bestScore = Math.max(0, ...appState.history.map(h => h.score));
  const lastExam = appState.history.reduce<AppState['history'][number] | null>((last, h) => (!last || h.date > last.date ? h : last), null);

  let totalCorrect = 0;
  let totalIncorrect = 0;
  Object.values(appState.stats).forEach(stat => {
    totalCorrect += stat.correct;
    totalIncorrect += stat.incorrect;
  });
  const globalAccuracy = (totalCorrect + totalIncorrect) > 0 
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
    : 0;

  // Find most frequent errors
  const errorRates = Object.keys(appState.stats)
    .map(qId => {
      const stat = appState.stats[qId];
      const correct = stat.correct || 0;
      const incorrect = stat.incorrect || 0;
      const omitted = stat.omitted || 0;
      const totalAttempts = correct + incorrect + omitted;
      const errorRate = totalAttempts > 0 ? (incorrect + omitted) / totalAttempts : 0;
      return { qId, errorRate, incorrect, correct, omitted, box: stat.box, easiness: stat.easiness || 2.5 };
    })
    .filter(item => item.incorrect > 0 || item.omitted > 0)
    .sort((a, b) => (b.errorRate - a.errorRate) || (b.incorrect - a.incorrect));

  const topErrors = errorRates.slice(0, 5); // top 5 hardest questions
  const topErrorIds = topErrors.map(e => e.qId).join(',');

  // Testo e risposta esatta delle domande più sbagliate: arrivano dal provider (solo con il Pass)
  useEffect(() => {
    if (!pass || !topErrorIds) return;
    let alive = true;
    const ids = topErrorIds.split(',');
    (async () => {
      try {
        const meta = await provider.getQuestions(ids);
        const got: Record<string, string> = {};
        meta.forEach(q => { got[q.id] = q.prompt; });
        const texts: Record<string, string> = {};
        await Promise.all(meta.map(async q => {
          try {
            const g = await provider.grade(q.id, -1);
            texts[q.id] = q.options[g.correctIndex] ?? '';
          } catch { /* la risposta esatta è un di più: senza, resta il testo della domanda */ }
        }));
        if (!alive) return;
        setPrompts(p => ({ ...p, ...got }));
        setAnswersText(t => ({ ...t, ...texts }));
      } catch { /* il testo mancante si mostra come puntini */ }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pass, topErrorIds, provider]);

  // Prepare Daily Activity Data for Chart (last 7 days)
  const activityData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = chiaveGiorno(d);
      const displayStr = d.toLocaleDateString('it-IT', { weekday: 'short' });
      data.push({
        name: displayStr,
        domande: appState.dailyActivity?.[dateStr] || 0,
        minuti: Math.round((appState.dailyTimeSpent?.[dateStr] || 0) / 60)
      });
    }
    return data;
  }, [appState.dailyActivity, appState.dailyTimeSpent]);

  const levelStatsData = useMemo(() => {
    const stats: Record<string, { imparate: number; total: number }> = {};
    allMeta.forEach(q => {
      const level = q.level || 'Varie';
      if (!stats[level]) {
        stats[level] = { imparate: 0, total: 0 };
      }
      stats[level].total += 1;
      const stat = appState.stats[q.id];
      if (isLearned(stat)) {
        stats[level].imparate += 1;
      }
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      imparate: data.imparate,
      daImparare: data.total - data.imparate,
      total: data.total
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [appState.stats, allMeta]);

  const categories = useMemo(() => Array.from(new Set(allMeta.map(q => q.category))), [allMeta]);
  const coreCount = useMemo(() => poolMeta(false).length, []);

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = allMeta;
    if (filterCategory === 'corpus:initial') {
      filtered = poolMeta(false);
    } else if (filterCategory !== 'all') {
      filtered = filtered.filter(q => q.category === filterCategory);
    }
    
    return [...filtered].sort((a, b) => {
      const statA = appState.stats[a.id];
      const statB = appState.stats[b.id];
      
      const confA = statA ? confidenceFromEasiness(statA.easiness) : -1;
      const confB = statB ? confidenceFromEasiness(statB.easiness) : -1;

      if (sortOrder === 'asc') {
        return confA - confB;
      } else {
        return confB - confA;
      }
    });
  }, [filterCategory, sortOrder, appState.stats, allMeta]);

  // Il dettaglio mostra il testo di ogni domanda: si scarica quando si apre la vista
  useEffect(() => {
    if (!showDetailedStats || !pass) return;
    let alive = true;
    setPromptsState('loading');
    fetchPrompts(provider, allMeta.map(q => q.id), prompts)
      .then(got => { if (alive) { setPrompts(p => ({ ...p, ...got })); setPromptsState('idle'); } })
      .catch(() => { if (alive) setPromptsState('error'); });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDetailedStats, pass, provider]);

  const lastExamFormat = lastExam ? FORMATS[lastExam.format ?? 'ente'] : null;
  // Probabilità stimata: solo punti misurati (diagnostico e simulazioni)
  const punti = useMemo(() => serieStime(appState), [appState]);

  // ================== Senza Pass: i numeri di base e un invito ==================
  if (!pass) {
    return (
      <div className="h-full w-full bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-[560px] px-5 pt-3 pb-8 flex flex-col gap-5">
            <Intestazione sotto="Quanto sai, in breve." onExit={onExit} />

            <Tessere stato={appState} />

            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-3">
              {([
                [`${masteryPercentage}%`, `Domande imparate (su ${totalQuestions})`],
                [`${globalAccuracy}%`, 'Accuratezza'],
              ] as const).map(([valore, nome]) => (
                <div key={nome} className="bg-superficie-2 rounded-[12px] p-4 flex flex-col gap-1.5">
                  <span className="text-[26px] font-extrabold text-testo leading-none">{valore}</span>
                  <span className="text-xs text-testo-tenue">{nome}</span>
                </div>
              ))}
              <p className="min-[420px]:col-span-2 -mt-1 text-xs leading-snug text-testo-tenue">{REGOLA_IMPARATA}</p>
              <div className="min-[420px]:col-span-2 bg-superficie-2 rounded-[12px] p-4 flex flex-col gap-1.5">
                {lastExam && lastExamFormat ? (
                  <>
                    <span className="text-[26px] font-extrabold text-testo leading-none">
                      {lastExam.score}/{lastExamFormat.questions}
                      <span className={cn("ml-3 text-base font-bold", lastExam.passed ? "text-alto-testo" : "text-basso-testo")}>
                        {lastExam.passed ? 'Superata' : 'Non superata'}
                      </span>
                    </span>
                    <span className="text-xs text-testo-tenue">
                      Ultimo esame, {new Date(lastExam.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}. Soglia {lastExamFormat.passMark} su {lastExamFormat.questions}.
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[26px] font-extrabold text-testo leading-none">-</span>
                    <span className="text-xs text-testo-tenue">Ultimo esame: non ne hai ancora fatto uno.</span>
                  </>
                )}
              </div>
            </div>

            <Obiettivi stato={appState} />

            <div className="bg-superficie-2 rounded-[12px] p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Lock size={18} className="mt-0.5 shrink-0 text-testo-tenue" />
                <div>
                  <h3 className="font-bold text-testo">Il quadro completo è nel Pass</h3>
                  <p className="text-sm font-semibold text-testo-tenue mt-1">
                    Andamento dei risultati, padronanza per argomento, le domande che sbagli di più e il dettaglio di ogni domanda. Il Pass si paga una volta sola e dura {PASS.validMonths} mesi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNeedPass('statistiche')}
                className="self-start text-sm font-bold text-azione border border-azione/60 hover:bg-azione-tinta px-4 py-2 rounded-xl transition-colors duration-100"
              >
                Scopri il Pass
              </button>
            </div>
            <p className="text-xs font-semibold text-testo-tenue">I numeri contano il nucleo gratuito ({coreCount} domande).</p>
          </div>
        </div>
      </div>
    );
  }

  if (showDetailedStats) {
    return (
      <div className="h-full w-full bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-linea shrink-0 transition-colors duration-100">
          <button onClick={() => setShowDetailedStats(false)} className="flex items-center gap-2 text-sm sm:text-base font-bold text-testo-tenue hover:text-testo transition-colors duration-100">
            <ArrowLeft size={20} />
            Indietro
          </button>
          <div className="flex flex-col items-end">
            <h2 className="text-sm sm:text-lg font-bold text-testo leading-tight">Dettaglio domande</h2>
            <span className="text-xs font-bold text-testo-tenue">{filteredAndSortedQuestions.length} domande totali</span>
          </div>
        </header>
        <div className="flex items-center justify-between p-4 border-b border-linea shrink-0 transition-colors duration-100 bg-superficie-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-testo-tenue" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-testo focus:ring-0 cursor-pointer"
            >
              <option value="all">Tutte le categorie</option>
              <option value="corpus:initial">Nucleo di base ({coreCount} domande)</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 text-sm font-bold text-azione hover:text-azione-scuro transition-colors duration-100"
          >
            <ArrowDownUp size={16} />
            {sortOrder === 'asc' ? 'Peggiori prima' : 'Migliori prima'}
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {promptsState === 'loading' && (
            <p className="flex items-center gap-2 text-sm font-bold text-testo-tenue"><Loader2 size={16} className="animate-spin" /> Carico le domande…</p>
          )}
          {promptsState === 'error' && (
            <p role="alert" className="text-sm font-bold text-basso-testo bg-basso-tinta rounded-xl px-3 py-2">
              Non riesco a caricare il testo delle domande. Controlla la connessione e riapri il dettaglio.
            </p>
          )}
          {filteredAndSortedQuestions.map((q, index) => {
            const stat = appState.stats[q.id];
            const hasSeen = !!stat;
            const correctCount = stat?.correct || 0;
            const incorrectCount = stat?.incorrect || 0;
            const omittedCount = stat?.omitted || 0;
            const totalAttempts = correctCount + incorrectCount + omittedCount;
            const accuracy = (correctCount + incorrectCount) > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
            const confidenceScore = hasSeen ? confidenceFromEasiness(stat.easiness) : 0;
            const previousEasiness = stat?.previousEasiness ?? stat?.easiness;
            let trend = 'same';
            if (stat && stat.easiness !== undefined && previousEasiness !== undefined) {
              if (stat.easiness > previousEasiness) trend = 'up';
              if (stat.easiness < previousEasiness) trend = 'down';
            }

            return (
              <div key={q.id} className="bg-superficie-2 border border-linea p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 flex gap-3 sm:gap-4 items-start">
                  <span className="text-testo-tenue font-bold text-sm sm:text-base mt-0.5 shrink-0 w-6 sm:w-8 text-right">{index + 1}.</span>
                  <div className="flex-1">
                    <p className="font-bold text-testo text-sm sm:text-base mb-1">{prompts[q.id] ?? '…'}</p>
                    <p className="text-xs text-testo-tenue font-bold flex items-center gap-2 flex-wrap">
                      <span>{q.category}</span>
                      {q.level && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-tacca"></span>
                          <span className="bg-azione/10 text-azione px-1.5 py-0.5 rounded">{q.level}</span>
                        </>
                      )}
                      {q.grammarTopic && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-tacca"></span>
                          <span>{q.grammarTopic}</span>
                        </>
                      )}
                    </p>

                    {/* Breakdown: Giuste, Sbagliate, Omesse + Telemetria Cognitiva */}
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors duration-100",
                        correctCount > 0 
                          ? "bg-alto-tinta text-alto-testo border-alto/30" 
                          : "bg-superficie text-testo-tenue border-linea"
                      )}>
                        <Check size={12} strokeWidth={3} />
                        {correctCount} {correctCount === 1 ? 'giusta' : 'giuste'}
                      </span>

                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors duration-100",
                        incorrectCount > 0 
                          ? "bg-basso-tinta text-basso-testo border-basso/30" 
                          : "bg-superficie text-testo-tenue border-linea"
                      )}>
                        <X size={12} strokeWidth={3} />
                        {incorrectCount} {incorrectCount === 1 ? 'sbagliata' : 'sbagliate'}
                      </span>

                      <span className={cn(
                        "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors duration-100",
                        omittedCount > 0 
                          ? "bg-medio-tinta text-medio-testo border-medio/30" 
                          : "bg-superficie text-testo-tenue border-linea"
                      )}>
                        <Minus size={12} strokeWidth={3} />
                        {omittedCount} {omittedCount === 1 ? 'omessa' : 'omesse'}
                      </span>

                      {stat?.lastSwitchCount !== undefined && stat.lastSwitchCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg bg-medio-tinta text-medio-testo border border-medio/30">
                          {stat.lastSwitchCount} {stat.lastSwitchCount === 1 ? 'cambio' : 'cambi'}
                        </span>
                      )}

                      {stat?.lastResponseTimeMs !== undefined && (
                        <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-lg bg-azione-tinta text-azione border border-azione/30">
                          <Clock size={11} /> {(stat.lastResponseTimeMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 items-center sm:items-end w-full sm:w-auto shrink-0">
                  {hasSeen ? (
                    <>
                      <div className="flex flex-col items-center sm:items-end">
                        <span className="text-[10px] sm:text-xs font-bold text-testo-tenue">Accuratezza</span>
                        <span className={cn("text-sm sm:text-base font-bold", accuracy > 70 ? "text-alto-testo" : accuracy > 40 ? "text-medio-testo" : "text-basso-testo")}>
                          {accuracy}%
                        </span>
                      </div>
                      <div className="flex flex-col items-center sm:items-end w-full sm:w-24">
                        <div className="flex justify-between w-full mb-1 items-center">
                          <span className="text-[10px] sm:text-xs font-bold text-testo-tenue flex items-center gap-1">
                            Confidenza
                            {trend === 'up' && <ArrowUp size={12} className="text-alto-testo" />}
                            {trend === 'down' && <ArrowDown size={12} className="text-basso-testo" />}
                            {trend === 'same' && <Minus size={12} className="text-testo-tenue" />}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-azione">{confidenceScore}%</span>
                        </div>
                        <div className="w-full bg-tacca h-2 rounded-full overflow-hidden">
                          <div className="bg-azione h-full transition-colors duration-100" style={{ width: `${confidenceScore}%` }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-testo-tenue px-3 py-1 bg-tacca rounded-full">
                      Mai vista
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[560px] px-5 pt-3 pb-8 flex flex-col gap-6">
          <Intestazione sotto="Quanto sai, argomento per argomento." onExit={onExit} />

          <Tessere stato={appState} />
          <p className="-mt-3 text-xs leading-snug text-testo-tenue">{REGOLA_IMPARATA}</p>

          <AndamentoSimulazioni stato={appState} />

          {punti.length > 0 && <GraficoStime punti={punti} />}

          <PerArgomento stato={appState} pass={pass} onVaiPercorso={onVaiPercorso} onApriLezione={onApriLezione} />

          <Obiettivi stato={appState} />

          <button
            onClick={() => { playTapSound(); setShowDetailedStats(true); }}
            className="w-full min-h-[48px] bg-azione hover:bg-azione-scuro text-azione-su font-bold text-[15px] py-3 px-4 rounded-[12px] transition-colors duration-100 flex items-center justify-center gap-2"
          >
            <List className="w-5 h-5" />
            Vedi il dettaglio delle domande
          </button>

          {/* Costanza */}
          <section aria-labelledby="titolo-costanza" className="flex flex-col gap-2.5">
            <h2 id="titolo-costanza" className="text-[15.5px] leading-[20px] font-bold text-testo flex items-center gap-2"><Activity className="text-medio-testo w-5 h-5" />Costanza (ultimi 7 giorni)</h2>
            <div className="bg-superficie-2 rounded-[12px] p-4 flex flex-col">
              <div className="w-full">
                <ResponsiveContainer width="100%" height={170}>
                  <BarChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRIGLIA} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: ASSE, fontWeight: 'bold' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: ASSE, fontWeight: 'bold' }} allowDecimals={false} />
                    <Tooltip isAnimationActive={false} cursor={{ fill: CURSORE }} contentStyle={TOOLTIP} />
                    <Bar isAnimationActive={false} dataKey="domande" name="Domande" fill={AZIONE} radius={[4, 4, 0, 0]} maxBarSize={30} />
                    <Bar isAnimationActive={false} dataKey="minuti" name="Minuti" fill={ALTO} radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-xs text-testo-tenue"><span className="inline-block w-2.5 h-2.5 rounded-sm align-middle mr-1" style={{ background: AZIONE }} />Domande risposte <span className="inline-block w-2.5 h-2.5 rounded-sm align-middle ml-3 mr-1" style={{ background: ALTO }} />Minuti di studio</p>
            </div>
          </section>

          {/* Progresso per livello */}
          <section aria-labelledby="titolo-livello" className="flex flex-col gap-2.5">
            <h2 id="titolo-livello" className="text-[15.5px] leading-[20px] font-bold text-testo flex items-center gap-2"><TrendingUp className="text-medio-testo w-5 h-5" />Progresso per livello</h2>
            <div className="bg-superficie-2 rounded-[12px] p-4 flex flex-col">
              <div className="w-full">
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={levelStatsData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={GRIGLIA} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: ASSE, fontWeight: 'bold' }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: ASSE, fontWeight: 'bold' }} />
                    <Tooltip isAnimationActive={false} cursor={{ fill: CURSORE }} contentStyle={TOOLTIP}
                      formatter={(value: number, name: string) => [value, name === 'daImparare' ? 'Da imparare' : name]} />
                    <Bar isAnimationActive={false} dataKey="imparate" name="Imparate" stackId="a" fill={ALTO} radius={[0, 0, 0, 0]} maxBarSize={30} />
                    <Bar isAnimationActive={false} dataKey="daImparare" name="Da imparare" stackId="a" fill={TRACCIA} radius={[0, 4, 4, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Errori frequenti */}
          <section aria-labelledby="titolo-errori" className="flex flex-col gap-2.5">
            <h2 id="titolo-errori" className="text-[15.5px] leading-[20px] font-bold text-testo flex items-center gap-2"><AlertCircle className="text-basso-testo w-5 h-5" />Errori frequenti</h2>
            {topErrors.length === 0 ? (
              <div className="bg-superficie-2 rounded-[12px] py-6 flex items-center justify-center text-center">
                <span className="font-bold text-sm text-testo-tenue">Non ci sono ancora dati sufficienti.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {topErrors.map(err => {
                  const text = prompts[err.qId];
                  const rightAnswer = answersText[err.qId];
                  return (
                    <div key={err.qId} className="bg-basso-tinta border border-basso/30 rounded-xl p-3 sm:p-4 shadow-sm dark:shadow-none transition-colors duration-100 flex flex-col gap-2.5">
                      <p className="font-bold text-sm sm:text-base text-testo line-clamp-2 leading-tight">{text ?? '…'}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors duration-100",
                          err.correct > 0 ? "bg-alto-tinta text-alto-testo border-alto/30" : "bg-superficie/80 text-testo-tenue border-linea"
                        )}>
                          <Check size={11} strokeWidth={3} />
                          {err.correct} {err.correct === 1 ? 'giusta' : 'giuste'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border bg-superficie text-basso-testo border-basso/30">
                          <X size={11} strokeWidth={3} />
                          {err.incorrect} {err.incorrect === 1 ? 'sbagliata' : 'sbagliate'}
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-lg border transition-colors duration-100",
                          err.omitted > 0 ? "bg-medio-tinta text-medio-testo border-medio/30" : "bg-superficie/80 text-testo-tenue border-linea"
                        )}>
                          <Minus size={11} strokeWidth={3} />
                          {err.omitted} {err.omitted === 1 ? 'omessa' : 'omesse'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-basso/20">
                        <span className="text-xs sm:text-sm font-bold text-basso-testo">{Math.round(err.errorRate * 100)}% errore</span>
                        <span className="text-xs sm:text-sm font-bold text-alto-testo truncate max-w-[50%]">{rightAnswer ?? ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {FEATURE_FLAGS.guarantee && <GuaranteeTracker appState={appState} />}
          <PoweredByAtlas />
        </div>
      </div>
    </div>
  );
}
