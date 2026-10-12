import { ReactNode, useMemo } from 'react';
import { BarChart3, ChevronRight, Dumbbell, Gauge, GraduationCap, KeyRound, ListChecks, Lock, Route, RotateCcw, Trophy } from 'lucide-react';
import type { AppState, CorpusType, PaywallReason } from '../types';
import { getQuestionsByCorpus, questions, INITIAL_CORPUS_COUNT } from '../data/questions';
import { theoryTopics } from '../data/theory';
import { ECOSYSTEM } from '../config/ecosystem';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { FONT } from '../brand/tokens';
import { IllustrazioneAnimata } from '../brand/IllustrazioneAnimata';
import Navigazione, { Scheda } from '../components/Navigazione';
import Fattori from '../components/home/Fattori';
import { SchedaLezione } from '../components/home/Lezione';
import { TitoloSezione } from '../components/home/Stima';
import { calcolaFattori, lezioneConsigliata, progressoArgomento } from '../components/home/stima';

interface Props {
  appState: AppState;
  corpus?: CorpusType;
  onStartLearn: () => void;
  onOpenStats: () => void;
  onStartErrors: () => void;
  onOpenTheory: () => void;
  /** Apre la scheda di un argomento. Assente = si apre l'elenco con onOpenTheory. */
  onOpenTheoryTopic?: (id: string) => void;
  /** Avvia l'allenamento su un filtro come "category:Grammatica". Assente = le barre di "Dove sei più solido" non sono cliccabili. */
  onStartFocus?: (filtro: string) => void;
  onOpenCheatSheet?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenLeaderboard?: () => void;
  onSelectCorpus?: (corpus: CorpusType) => void;
  onOpenPaywall: () => void;
  onNeedPass: (reason: PaywallReason) => void;
  onNaviga?: (s: Scheda) => void;
  /** Apre una schermata extra (percorso, frasi, sfide, esplora, faq...). */
  onOpenExtra?: (id: string) => void;
}

const SCHEDE_PRONTE = theoryTopics.filter(t => t.pronta).length;

function Voce({ icona, titolo, testo, onClick, bloccato, evidenza }: {
  icona: ReactNode; titolo: string; testo: string; onClick?: () => void; bloccato?: boolean; evidenza?: boolean;
}) {
  if (!onClick) return null;
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onClick(); }}
        className={cn('brand-premibile w-full flex items-center gap-3.5 rounded-[12px] p-[10px] pr-3 text-left', evidenza ? 'bg-azione-tinta' : 'bg-superficie-2')}>
        <span className={cn('w-[44px] h-[44px] rounded-[11px] flex items-center justify-center shrink-0',
          evidenza ? 'bg-azione text-azione-su' : 'bg-superficie text-azione shadow-[0_1px_4px_rgba(37,99,235,0.12)] dark:shadow-none dark:border dark:border-linea')} aria-hidden="true">{icona}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] leading-[20px] font-bold text-testo">{titolo}</span>
          <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{testo}</span>
        </span>
        {bloccato
          ? <Lock size={17} className="shrink-0 text-testo-tenue" aria-label="Richiede il Pass" />
          : <ChevronRight size={22} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />}
      </button>
    </li>
  );
}

/** Hub delle lezioni: la prossima scheda, poi teoria, esercizi, ripasso, prontuario, verifica, progressi; sotto "Dove sei più solido" e la scelta del materiale. */
export default function Lezioni({ appState, corpus, onStartLearn, onOpenStats, onStartErrors, onOpenTheory, onOpenTheoryTopic, onStartFocus, onOpenCheatSheet, onOpenDiagnostic, onOpenLeaderboard, onSelectCorpus, onOpenPaywall, onNeedPass, onNaviga, onOpenExtra }: Props) {
  const { pass } = useAccess();
  const selectedCorpus: CorpusType = corpus ?? appState.selectedCorpus ?? 'all';
  const attive = useMemo(() => getQuestionsByCorpus(selectedCorpus), [selectedCorpus]);
  const lezione = useMemo(() => lezioneConsigliata(appState, pass), [appState, pass]);
  const progresso = useMemo(
    () => (lezione ? progressoArgomento(appState, lezione.topic.id, new Set(attive.map(q => q.id))) : null),
    [appState, lezione, attive],
  );
  const fattori = useMemo(() => calcolaFattori(appState), [appState]);

  const apriLezione = () => {
    if (!lezione) return;
    if (lezione.bloccata) onNeedPass('teoria');
    else if (onOpenTheoryTopic) onOpenTheoryTopic(lezione.topic.id);
    else onOpenTheory();
  };

  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-6">
          <header className="flex items-center justify-between gap-3">
            <h1 className="text-[28px] leading-[36px] font-extrabold tracking-[-0.02em] text-testo">Lezioni</h1>
            <IllustrazioneAnimata nome="studio-inglese" lato={110} />
          </header>

          {lezione && progresso && (
            <section aria-labelledby="titolo-prossima" className="mt-[18px] flex flex-col gap-[10px]">
              <TitoloSezione id="titolo-prossima">Prossima lezione</TitoloSezione>
              <SchedaLezione lezione={lezione} progresso={progresso} onApri={apriLezione} />
            </section>
          )}

          <section aria-labelledby="titolo-studia" className="mt-[24px] flex flex-col gap-[10px]">
            <TitoloSezione id="titolo-studia">Studia</TitoloSezione>
            <ul className="flex flex-col gap-[8px]">
              <Voce icona={<GraduationCap size={24} />} titolo={`Teoria · ${SCHEDE_PRONTE} schede`} testo={pass ? 'Tutti gli argomenti sbloccati' : 'Una gratis, le altre con il Pass'} onClick={onOpenTheory} bloccato={!pass} />
              {onOpenExtra && <Voce icona={<Route size={24} />} titolo="Il tuo percorso" testo="31 lezioni in ordine, con l'avanzamento" onClick={() => onOpenExtra('percorso')} />}
              {onOpenExtra && <Voce icona={<GraduationCap size={24} />} titolo="Frasi e vocaboli" testo="Cerca, salva le preferite, ascolta" onClick={() => onOpenExtra('frasi')} />}
              <Voce icona={<Dumbbell size={24} />} titolo="Esercizi mirati" testo="Punti deboli, blitz, richiamo attivo" onClick={onStartLearn} />
              <Voce icona={<RotateCcw size={24} />} titolo="Ripasso sugli errori" testo="Riparti da ciò che hai sbagliato" onClick={() => (pass ? onStartErrors() : onNeedPass('errori'))} bloccato={!pass} />
              <Voce icona={<ListChecks size={24} />} titolo="Prontuario" testo="Le regole e le trappole in breve" onClick={onOpenCheatSheet} />
              <Voce icona={<Gauge size={24} />} titolo="Verifica il livello" testo="10 domande, 3 minuti" onClick={onOpenDiagnostic} />
              <Voce icona={<BarChart3 size={24} />} titolo="Progressi" testo={pass ? 'Argomenti, simulazioni, costanza' : 'Le statistiche complete con il Pass'} onClick={onOpenStats} bloccato={!pass} />
              {onOpenExtra && <Voce icona={<Trophy size={24} />} titolo="Sfide" testo="Sfida del giorno e duelli con un amico" onClick={() => onOpenExtra('sfide')} />}
              <Voce icona={<Trophy size={24} />} titolo={`Classifica ${ECOSYSTEM.rankingName}`} testo="Chi sa più regole" onClick={onOpenLeaderboard} />
              {onOpenExtra && <Voce icona={<Gauge size={24} />} titolo="Esplora" testo="Analisi del livello, Project ID, guida e FAQ" onClick={() => onOpenExtra('esplora')} />}
              {!pass && <Voce icona={<KeyRound size={24} />} titolo="Pass AddiOFA" testo="Tutto sbloccato, un solo pagamento" onClick={onOpenPaywall} evidenza />}
            </ul>
          </section>

          {fattori.risposteTotali > 0 && (
            <div className="mt-[24px]">
              <Fattori categorie={fattori.categorie} livelli={fattori.livelli} onVai={onStartFocus} />
            </div>
          )}

          {onSelectCorpus && (
            <section aria-labelledby="titolo-materiale" className="mt-[24px] flex flex-col gap-[10px]">
              <TitoloSezione id="titolo-materiale">Materiale</TitoloSezione>
              <div role="group" aria-label="Materiale di studio" className="grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-superficie-2">
                {([['initial', `Nucleo gratuito (${INITIAL_CORPUS_COUNT})`], ['all', `Tutto il banco (${questions.length})`]] as const).map(([id, testo]) => {
                  const on = selectedCorpus === id;
                  return (
                    <button key={id} type="button" aria-pressed={on} onClick={() => { playTapSound(); onSelectCorpus(id); }}
                      className={cn('rounded-[9px] py-2.5 text-[13px] font-semibold transition-colors duration-100', on ? 'bg-superficie text-testo shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>
                      {testo}{id === 'all' && !pass && <Lock size={12} className="inline ml-1 -mt-0.5" aria-label="Richiede il Pass" />}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
      {onNaviga && <Navigazione attiva="lezioni" onVai={onNaviga} />}
    </div>
  );
}
