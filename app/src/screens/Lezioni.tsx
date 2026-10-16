import { ReactNode, useMemo } from 'react';
import { BarChart3, BookOpen, ChevronRight, Compass, Dumbbell, Gauge, GraduationCap, KeyRound, Languages, ListChecks, Lock, Route, RotateCcw, Swords, Trophy } from 'lucide-react';
import type { AppState, CorpusType, PaywallReason } from '../types';
import { getQuestionsByCorpus, questions, INITIAL_CORPUS_COUNT } from '../data/questions';
import { theoryTopics } from '../data/theory';
import { ECOSYSTEM } from '../config/ecosystem';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { FONT } from '../brand/tokens';
import Navigazione, { Scheda } from '../components/Navigazione';
import Fattori from '../components/home/Fattori';
import { IconaTono, BarraTono, type Tono } from './extra/ui';
import { TitoloSezione } from '../components/home/Stima';
import { calcolaFattori, lezioneConsigliata, progressoArgomento, type Lezione, type ProgressoArgomento } from '../components/home/stima';

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

/** Riga dell'hub: tessera colorata per significato, titolo navy, testo grigio. Il lucchetto resta grigio e la riga non si spegne. */
function Voce({ icona, tono, titolo, testo, onClick, bloccato }: {
  icona: ReactNode; tono: Tono; titolo: string; testo: string; onClick?: () => void; bloccato?: boolean;
}) {
  if (!onClick) return null;
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onClick(); }}
        className="brand-premibile w-full flex items-center gap-3.5 rounded-[12px] bg-superficie-2 p-[10px] pr-3 text-left">
        <IconaTono tono={tono} lato={44}>{icona}</IconaTono>
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

/** Gruppo di righe con il suo titolo di sezione. */
function Gruppo({ id, titolo, children }: { id: string; titolo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-[24px] flex flex-col gap-[10px]">
      <TitoloSezione id={id}>{titolo}</TitoloSezione>
      <ul className="flex flex-col gap-[8px]">{children}</ul>
    </section>
  );
}

/** La prossima lezione: è l'unico blocco tinto della pagina (blu, il colore dello studio). */
function CartaProssima({ lezione, progresso, onApri }: { lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void }) {
  const { imparate, totale } = progresso;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${lezione.topic.titolo}: ${imparate} su ${totale} domande imparate${lezione.bloccata ? ' (richiede il Pass)' : ''}`}
      className="brand-premibile w-full flex items-center gap-[14px] rounded-[12px] bg-azione-tinta p-[10px] pr-[12px] text-left">
      <span aria-hidden="true" className="w-[53px] h-[53px] rounded-[13px] bg-azione text-azione-su flex items-center justify-center shrink-0"><BookOpen size={28} strokeWidth={2.2} /></span>
      <span className="flex-1 min-w-0 py-[1px]">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            {progresso.area && <span className="block text-[11px] leading-[13px] font-semibold uppercase tracking-[0.06em] text-azione-scuro">{progresso.area}</span>}
            <span className="block text-[15px] leading-[20px] font-bold text-testo line-clamp-2">{lezione.topic.titolo}</span>
          </span>
          {lezione.bloccata
            ? <Lock size={18} className="shrink-0 mt-0.5 text-testo-tenue" aria-hidden="true" />
            : <ChevronRight size={22} strokeWidth={2} className="shrink-0 -mr-1 text-azione-scuro" aria-hidden="true" />}
        </span>
        <span className="mt-[6px] flex items-center gap-3">
          <BarraTono valore={valore} tono="azione" className="flex-1 min-w-[40px] h-[7px] bg-superficie/80" />
          <span className="shrink-0 text-[12px] leading-[14px] text-testo-tenue tabular-nums">{imparate}/{totale} imparate</span>
        </span>
      </span>
    </button>
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
          <header>
            <h1 className="text-[26px] leading-[40px] font-extrabold tracking-[-0.02em] text-testo">Lezioni</h1>
          </header>

          {lezione && progresso && (
            <section aria-labelledby="titolo-prossima" className="mt-[10px] flex flex-col gap-[10px]">
              <TitoloSezione id="titolo-prossima">Prossima lezione</TitoloSezione>
              <CartaProssima lezione={lezione} progresso={progresso} onApri={apriLezione} />
            </section>
          )}

          {/* Un tono per significato: studio blu, frasi viola; esercizi ambra, errori corallo, verifica verde; progressi verde, sfide corallo, esplora viola. */}
          <Gruppo id="titolo-studia" titolo="Studia">
            <Voce tono="azione" icona={<GraduationCap size={24} />} titolo={`Teoria · ${SCHEDE_PRONTE} schede`} testo={pass ? 'Tutti gli argomenti sbloccati' : 'Una gratis, le altre con il Pass'} onClick={onOpenTheory} bloccato={!pass} />
            {onOpenExtra && <Voce tono="azione" icona={<Route size={24} />} titolo="Il tuo percorso" testo="31 lezioni in ordine, con l'avanzamento" onClick={() => onOpenExtra('percorso')} />}
            {onOpenExtra && <Voce tono="viola" icona={<Languages size={24} />} titolo="Frasi e vocaboli" testo="Cerca, salva le preferite, ascolta" onClick={() => onOpenExtra('frasi')} />}
            <Voce tono="azione" icona={<ListChecks size={24} />} titolo="Prontuario" testo="Le regole e le trappole in breve" onClick={onOpenCheatSheet} />
          </Gruppo>

          <Gruppo id="titolo-allenati" titolo="Allenati">
            <Voce tono="medio" icona={<Dumbbell size={24} />} titolo="Esercizi mirati" testo="Punti deboli, blitz, richiamo attivo" onClick={onStartLearn} />
            <Voce tono="basso" icona={<RotateCcw size={24} />} titolo="Ripasso sugli errori" testo="Riparti da ciò che hai sbagliato" onClick={() => (pass ? onStartErrors() : onNeedPass('errori'))} bloccato={!pass} />
            <Voce tono="alto" icona={<Gauge size={24} />} titolo="Verifica il livello" testo="10 domande, 3 minuti" onClick={onOpenDiagnostic} />
          </Gruppo>

          <Gruppo id="titolo-progressi" titolo="Progressi e sfide">
            <Voce tono="alto" icona={<BarChart3 size={24} />} titolo="Progressi" testo={pass ? 'Argomenti, simulazioni, costanza' : 'Le statistiche complete con il Pass'} onClick={onOpenStats} bloccato={!pass} />
            {onOpenExtra && <Voce tono="basso" icona={<Swords size={24} />} titolo="Sfide" testo="Sfida del giorno e duelli con un amico" onClick={() => onOpenExtra('sfide')} />}
            <Voce tono="medio" icona={<Trophy size={24} />} titolo={`Classifica ${ECOSYSTEM.rankingName}`} testo="Chi sa più regole" onClick={onOpenLeaderboard} />
            {onOpenExtra && <Voce tono="viola" icona={<Compass size={24} />} titolo="Esplora" testo="Analisi del livello, Project ID, guida e FAQ" onClick={() => onOpenExtra('esplora')} />}
          </Gruppo>

          {!pass && (
            <button type="button" onClick={() => { playTapSound(); onOpenPaywall(); }}
              className="brand-premibile mt-[24px] w-full flex items-center gap-3.5 rounded-[12px] bg-medio-tinta p-[10px] pr-3 text-left">
              <IconaTono tono="medio" lato={44} className="bg-superficie"><KeyRound size={24} /></IconaTono>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] leading-[20px] font-bold text-testo">Pass AddiOFA</span>
                <span className="block text-[12.5px] leading-[17px] text-testo-tenue">Tutto sbloccato, un solo pagamento</span>
              </span>
              <ChevronRight size={22} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />
            </button>
          )}

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
