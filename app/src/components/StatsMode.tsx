import { useState, useMemo, useEffect } from 'react';
import { AppState } from '../types';
import { Icona } from '../brand/icone/Icona';
import { cn } from '../lib/utils';
import { confidenceFromEasiness, bankMeta, isLearned } from '../lib/spacedRepetition';
import { provider } from '../access';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FoglioInfo, TONI } from '../screens/extra/ui';
import { Tessere, AndamentoSimulazioni } from '../screens/extra/studio/StatistichePezzi';
import { ChipLivello } from '../screens/extra/studio/comune';
import { playTapSound } from '../lib/audio';

// Grafici (Recharts): colori dai token, così il tema scuro li cambia da solo.
const GRIGLIA = 'var(--color-linea)';
const ASSE = 'var(--color-testo-tenue)';
const ALTO = 'var(--color-alto)';
const TRACCIA = 'var(--color-tacca)';
const CURSORE = 'color-mix(in srgb, var(--color-testo) 6%, transparent)';
const TOOLTIP = { borderRadius: '12px', border: '1px solid var(--color-linea)', fontWeight: 'bold', color: 'var(--color-testo)', backgroundColor: 'var(--color-superficie)', boxShadow: 'none' } as const;

interface StatsModeProps {
  appState: AppState;
  onExit: () => void;
  /** Non più usati (il percorso e le lezioni si aprono da Lezioni, l'analisi per argomento sta in Progressi): restano per compatibilità con App. */
  onVaiPercorso?: () => void;
  onApriLezione?: (topicId: string) => void;
  /** Dentro Progressi la pagina ha già cornice, titolo e selettore: si disegna solo il corpo (senza intestazione né cornice). */
  incorporata?: boolean;
  /** Rifare il diagnostico: il solo pulsante pieno della panoramica. Assente = il pulsante non si vede. */
  onDiagnostico?: () => void;
}

// Scarica il testo delle domande dal provider a gruppi, senza ripetere quelle già in mano
async function fetchPrompts(
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

/** Intestazione della schermata a sé (vista `stats`): freccia indietro e titolo con l'icona. Dentro Progressi non c'è. */
function Intestazione({ onExit }: { onExit: () => void }) {
  return (
    <header className="flex items-start gap-1 shrink-0">
      <button type="button" onClick={() => { playTapSound(); onExit(); }} aria-label="Indietro"
        className="-ml-3 grid place-items-center w-10 h-10 shrink-0 rounded-full text-testo-tenue hover:text-testo">
        <Icona nome="indietro" size={28} />
      </button>
      <h1 className="min-w-0 flex-1 text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">Statistiche</h1>
    </header>
  );
}

/** Conteggio con icona: giuste, sbagliate, omesse. Il colore dice quale è. */
function Conto({ tipo, n, piccolo }: { tipo: 'giuste' | 'sbagliate' | 'omesse'; n: number; piccolo?: boolean }) {
  const stile = tipo === 'giuste' ? (n > 0 ? 'bg-alto-tinta text-alto-testo border-alto/30' : 'bg-superficie text-testo-tenue border-linea')
    : tipo === 'sbagliate' ? (n > 0 ? 'bg-errore-tinta text-errore-testo border-errore/30' : 'bg-superficie text-testo-tenue border-linea')
    : (n > 0 ? 'bg-medio-tinta text-medio-testo border-medio/30' : 'bg-superficie text-testo-tenue border-linea');
  const icona = tipo === 'giuste' ? 'stato-risposta-giusta' : tipo === 'sbagliate' ? 'stato-risposta-sbagliata' : 'stato-risposta-omessa';
  return (
    <span role="img" aria-label={`${n} ${tipo}`} className={cn('inline-flex items-center gap-1 text-[12px] font-bold tabular-nums px-2 py-0.5 rounded-lg border', stile)}>
      <Icona nome={icona} size={piccolo ? 12 : 13} />{n}
    </span>
  );
}

export default function StatsMode({ appState, onExit, incorporata, onDiagnostico }: StatsModeProps) {
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [answersText, setAnswersText] = useState<Record<string, string>>({});
  const [promptsState, setPromptsState] = useState<'idle' | 'loading' | 'error'>('idle');

  // Indice leggero del banco (tutte le domande)
  const allMeta = useMemo(() => bankMeta(), []);

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

  // Testo e risposta esatta delle domande più sbagliate: arrivano dal provider
  useEffect(() => {
    if (!topErrorIds) return;
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
  }, [topErrorIds]);

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

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = allMeta;
    if (filterCategory !== 'all') {
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
    if (!showDetailedStats) return;
    let alive = true;
    setPromptsState('loading');
    fetchPrompts(allMeta.map(q => q.id), prompts)
      .then(got => { if (alive) { setPrompts(p => ({ ...p, ...got })); setPromptsState('idle'); } })
      .catch(() => { if (alive) setPromptsState('error'); });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDetailedStats]);

  /** Pulsanti in fondo: il diagnostico è il solo pieno; il dettaglio delle domande è secondario. */
  const pulsanti = (
    <div className="flex flex-col gap-2.5">
      {onDiagnostico && (
        <button type="button" onClick={() => { playTapSound(); onDiagnostico(); }}
          className="brand-premibile w-full min-h-[52px] rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su flex items-center justify-center gap-2">
          <Icona nome="diagnostico" size={20} />Test di livello
        </button>
      )}
      <button type="button" onClick={() => { playTapSound(); setShowDetailedStats(true); }}
        className="brand-premibile w-full min-h-[48px] rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo flex items-center justify-center gap-2">
        <Icona nome="dettaglio" size={20} />Dettaglio
      </button>
    </div>
  );

  const corpo = (
    <>
      <Tessere stato={appState} />
      <AndamentoSimulazioni stato={appState} />

      {/* Progresso per livello: domande imparate e da imparare */}
      <section aria-labelledby="titolo-livello" className="flex flex-col gap-2.5">
        <h2 id="titolo-livello" className="text-[15.5px] leading-[20px] font-bold text-testo flex items-center gap-2"><Icona nome="livello" size={20} className="text-viola" />Livelli</h2>
        <div className="rounded-[12px] border border-linea p-4 flex flex-col">
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
        <h2 id="titolo-errori" className="text-[15.5px] leading-[20px] font-bold text-testo flex items-center gap-2"><Icona nome="errori" size={20} className="text-errore" />Errori</h2>
        {topErrors.length === 0 ? (
          <div role="status" className="rounded-[12px] border border-linea py-6 flex items-center justify-center text-testo-tenue"><Icona nome="stato-ok" size={26} /></div>
        ) : (
          <div className="space-y-3">
            {topErrors.map(err => {
              const text = prompts[err.qId];
              const rightAnswer = answersText[err.qId];
              return (
                <div key={err.qId} className="bg-superficie-2 rounded-[12px] border-l-[3px] border-errore p-3 sm:p-4 flex flex-col gap-2.5">
                  <p data-testo-ok className="font-bold text-sm sm:text-base text-testo line-clamp-2 leading-tight">{text ?? '…'}</p>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <Conto tipo="giuste" n={err.correct} piccolo />
                    <Conto tipo="sbagliate" n={err.incorrect} piccolo />
                    <Conto tipo="omesse" n={err.omitted} piccolo />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-linea">
                    <span className="text-xs sm:text-sm font-bold text-errore-testo tabular-nums">{Math.round(err.errorRate * 100)}%</span>
                    <span data-testo-ok className="text-xs sm:text-sm font-bold text-alto-testo truncate max-w-[70%]">{rightAnswer ?? ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {pulsanti}
    </>
  );

  // ================== Dettaglio delle domande ==================
  if (showDetailedStats) {
    return (
      <div className="h-full w-full bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100 flex flex-col">
        <header className="flex items-center justify-between gap-3 p-4 border-b border-linea shrink-0 transition-colors duration-100">
          <button type="button" onClick={() => { playTapSound(); setShowDetailedStats(false); }} aria-label="Indietro"
            className="grid h-10 w-10 place-items-center rounded-full text-testo-tenue hover:text-testo"><Icona nome="indietro" size={26} /></button>
          <h2 className="flex items-center gap-2 text-lg font-bold text-testo leading-tight"><Icona nome="dettaglio" size={20} /><span className="tabular-nums">{filteredAndSortedQuestions.length}</span></h2>
        </header>
        <div className="flex items-center justify-between gap-3 p-4 border-b border-linea shrink-0 transition-colors duration-100 bg-superficie-2">
          <div className="flex min-w-0 items-center gap-2">
            <Icona nome="filtro" size={18} className="shrink-0 text-testo-tenue" />
            <select
              aria-label="Categoria"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="min-w-0 bg-transparent border-none text-sm font-bold text-testo focus:ring-0 cursor-pointer"
            >
              <option value="all">Tutte</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="button"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex shrink-0 items-center gap-2 text-sm font-bold text-azione hover:text-azione-testo transition-colors duration-100"
          >
            <Icona nome="ordina" size={18} />
            {sortOrder === 'asc' ? 'Peggiori' : 'Migliori'}
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
          {promptsState === 'loading' && (
            <p role="status" className="flex items-center gap-2 text-sm font-bold text-testo-tenue"><Icona nome="stato-caricamento" size={18} className="animate-spin" /></p>
          )}
          {promptsState === 'error' && (
            <p role="alert" className="flex items-center gap-2 text-sm font-bold text-errore-testo bg-errore-tinta rounded-xl px-3 py-2">
              <Icona nome="stato-errore" size={18} />Domande non caricate
            </p>
          )}
          {filteredAndSortedQuestions.map((q, index) => {
            const stat = appState.stats[q.id];
            const hasSeen = !!stat;
            const correctCount = stat?.correct || 0;
            const incorrectCount = stat?.incorrect || 0;
            const omittedCount = stat?.omitted || 0;
            const accuracy = (correctCount + incorrectCount) > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
            const confidenceScore = hasSeen ? confidenceFromEasiness(stat.easiness) : 0;
            const previousEasiness = stat?.previousEasiness ?? stat?.easiness;
            let trend: 'up' | 'down' | 'same' = 'same';
            if (stat && stat.easiness !== undefined && previousEasiness !== undefined) {
              if (stat.easiness > previousEasiness) trend = 'up';
              if (stat.easiness < previousEasiness) trend = 'down';
            }

            return (
              <div key={q.id} className="bg-superficie-2 border border-linea p-4 rounded-xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 flex gap-3 sm:gap-4 items-start">
                  <span className="text-testo-tenue font-bold text-sm sm:text-base mt-0.5 shrink-0 w-6 sm:w-8 text-right tabular-nums">{index + 1}</span>
                  <div className="flex-1">
                    <p data-testo-ok className="font-bold text-testo text-sm sm:text-base mb-1">{prompts[q.id] ?? '…'}</p>
                    <p className="text-xs text-testo-tenue font-bold flex items-center gap-2 flex-wrap">
                      <span>{q.category}</span>
                      {q.level && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-tacca"></span>
                          <ChipLivello livello={q.level} />
                        </>
                      )}
                      {q.grammarTopic && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-tacca"></span>
                          <span>{q.grammarTopic}</span>
                        </>
                      )}
                    </p>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-2.5 flex-wrap">
                      <Conto tipo="giuste" n={correctCount} />
                      <Conto tipo="sbagliate" n={incorrectCount} />
                      <Conto tipo="omesse" n={omittedCount} />
                      {stat?.lastResponseTimeMs !== undefined && (
                        <span role="img" aria-label={`${(stat.lastResponseTimeMs / 1000).toFixed(1)} secondi`} className="inline-flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-lg bg-medio-tinta text-medio-testo border border-medio/30 tabular-nums">
                            <Icona nome="tempo" size={12} />{(stat.lastResponseTimeMs / 1000).toFixed(1)}s
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-4 sm:gap-2 items-center sm:items-end w-full sm:w-auto shrink-0">
                  {hasSeen ? (
                    <>
                      <span role="img" aria-label={`Accuratezza ${accuracy}%`} className={cn('inline-flex items-center gap-1.5 text-sm sm:text-base font-bold tabular-nums', accuracy > 70 ? 'text-alto-testo' : accuracy > 40 ? 'text-medio-testo' : 'text-basso-testo')}>
                        <Icona nome="accuratezza" size={16} />{accuracy}%
                      </span>
                      <div className="flex flex-col items-center sm:items-end w-full sm:w-24" role="img" aria-label={`Fiducia ${confidenceScore}%`}>
                        <div className="flex justify-between w-full mb-1 items-center">
                          <span className="inline-flex items-center gap-1 text-viola-testo">
                            <Icona nome={trend === 'up' ? 'trend-su' : trend === 'down' ? 'trend-giu' : 'trend-uguale'} size={13} className={trend === 'up' ? 'text-alto-testo' : trend === 'down' ? 'text-basso-testo' : 'text-testo-tenue'} />
                          </span>
                          <span className="text-[11px] sm:text-xs font-bold text-viola-testo tabular-nums">{confidenceScore}%</span>
                        </div>
                        <div className="w-full bg-tacca h-2 rounded-full overflow-hidden">
                          <div className="bg-viola h-full transition-colors duration-100" style={{ width: `${confidenceScore}%` }} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <span role="img" aria-label="Mai vista" className="inline-flex items-center px-3 py-1 bg-tacca rounded-full text-testo-tenue"><Icona nome="stato-da-iniziare" size={14} /></span>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      </div>
    );
  }

  // Dentro Progressi: solo il corpo, la cornice e il titolo sono della pagina
  if (incorporata) return <div className="flex flex-col gap-6">{corpo}</div>;

  return (
    <div className="h-full w-full bg-superficie sm:rounded-[28px] sm:border sm:border-linea overflow-hidden shadow-sm dark:shadow-none transition-colors duration-100">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8 flex flex-col gap-6">
          <Intestazione onExit={onExit} />
          {corpo}
        </div>
      </div>
    </div>
  );
}
