import { useMemo } from 'react';
import type { AppState, CorpusType, PaywallReason } from '../types';
import { getQuestionsByCorpus } from '../data/questions';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { titoloBreve } from '../lib/studio/percorso';
import Navigazione, { Scheda } from '../components/Navigazione';
import { IconaTono, BarraTono, TestataScheda, type Tono } from './extra/ui';
import { lezioneConsigliata, progressoArgomento, type Lezione, type ProgressoArgomento } from '../components/home/stima';

interface Props {
  appState: AppState;
  corpus?: CorpusType;
  /** Apre la scheda Esercizi (vista `practiceMenu`). */
  onStartLearn: () => void;
  onOpenCheatSheet?: () => void;
  /** Profilo in alto a destra. Assente = si apre la schermata extra `profilo`. */
  onOpenProfilo?: () => void;
  onNaviga?: (s: Scheda) => void;
  /** Apre una schermata extra (`percorso`, `frasi`, `lezione-dettaglio` con `{ id }`, `profilo`). */
  onOpenExtra?: (id: string, params?: Record<string, string>) => void;
  /** Non più usate dalla scheda (le funzioni stanno in altre destinazioni): restano opzionali solo perché App.tsx le passa ancora. */
  onOpenStats?: () => void;
  onStartErrors?: () => void;
  onOpenTheory?: () => void;
  onOpenTheoryTopic?: (id: string) => void;
  onStartFocus?: (filtro: string) => void;
  onOpenDiagnostic?: () => void;
  onOpenLeaderboard?: () => void;
  onSelectCorpus?: (corpus: CorpusType) => void;
  onOpenPaywall?: () => void;
  onNeedPass?: (reason: PaywallReason) => void;
}

/** La prossima lezione: è l'unico blocco tinto della pagina (blu, il colore dello studio). Tessera dell'argomento, titolo, barra e numeri. */
function CartaProssima({ lezione, progresso, onApri }: { lezione: Lezione; progresso: ProgressoArgomento; onApri: () => void }) {
  const { imparate, totale } = progresso;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  const titolo = titoloBreve(lezione.topic);
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${titolo}: ${imparate} su ${totale}${lezione.bloccata ? ', nel Pass' : ''}`}
      className="brand-premibile mt-[10px] w-full flex items-center gap-[14px] rounded-[12px] bg-azione-tinta p-[10px] pr-[12px] text-left">
      <span aria-hidden="true" className="w-[53px] h-[53px] rounded-[13px] bg-azione text-azione-su flex items-center justify-center shrink-0"><Icona nome="teoria" size={28} /></span>
      <span className="flex-1 min-w-0 py-[1px]">
        <span className="flex items-start justify-between gap-2">
          <span className="block min-w-0 text-[15px] leading-[20px] font-bold text-testo line-clamp-2">{titolo}</span>
          <span className="shrink-0 mt-0.5 text-testo-tenue">{lezione.bloccata ? <Icona nome="blocco" size={18} /> : <Icona nome="avanti" size={22} className="-mr-1 text-azione-scuro" />}</span>
        </span>
        <span className="mt-[6px] flex items-center gap-3">
          <BarraTono valore={valore} tono="azione" className="flex-1 min-w-[40px] h-[7px] bg-superficie/80" />
          <span className="shrink-0 inline-flex items-center gap-1 text-[12.5px] leading-[14px] font-semibold text-azione-scuro tabular-nums">
            <Icona nome="stato-imparata" size={14} />{imparate}/{totale}
          </span>
        </span>
      </span>
    </button>
  );
}

/** Tessera grande: icona e una parola. */
function Tessera({ icona, tono, etichetta, onClick }: { icona: NomeIcona; tono: Tono; etichetta: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile flex min-h-[168px] flex-col items-center justify-center gap-3.5 rounded-[16px] bg-superficie-2 p-3">
      <IconaTono tono={tono} lato={72} className="rounded-[18px]"><Icona nome={icona} size={38} /></IconaTono>
      <span className="text-[15px] leading-[20px] font-bold text-testo">{etichetta}</span>
    </button>
  );
}

/** Scheda Lezioni: la prossima lezione e quattro tessere (Percorso, Esercizi, Frasi, Prontuario). Il resto sta nelle altre destinazioni. */
export default function Lezioni({ appState, corpus, onStartLearn, onOpenCheatSheet, onOpenProfilo, onNaviga, onOpenExtra }: Props) {
  const { pass } = useAccess();
  const selectedCorpus: CorpusType = corpus ?? appState.selectedCorpus ?? 'all';
  const attive = useMemo(() => getQuestionsByCorpus(selectedCorpus), [selectedCorpus]);
  const lezione = useMemo(() => lezioneConsigliata(appState, pass), [appState, pass]);
  const progresso = useMemo(
    () => (lezione ? progressoArgomento(appState, lezione.topic.id, new Set(attive.map(q => q.id))) : null),
    [appState, lezione, attive],
  );

  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-6">
          <TestataScheda titolo="Lezioni" onProfilo={() => (onOpenProfilo ? onOpenProfilo() : onOpenExtra?.('profilo'))} />

          {lezione && progresso && (
            <CartaProssima lezione={lezione} progresso={progresso}
              onApri={() => onOpenExtra?.('lezione-dettaglio', { id: lezione.topic.id })} />
          )}

          <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
            <Tessera icona="percorso" tono="azione" etichetta="Percorso" onClick={onOpenExtra ? () => onOpenExtra('percorso') : undefined} />
            <Tessera icona="esercizi" tono="medio" etichetta="Esercizi" onClick={onStartLearn} />
            <Tessera icona="frasi" tono="viola" etichetta="Frasi" onClick={onOpenExtra ? () => onOpenExtra('frasi') : undefined} />
            <Tessera icona="prontuario" tono="azione" etichetta="Prontuario" onClick={onOpenCheatSheet} />
          </div>
        </div>
      </div>
      {onNaviga && <Navigazione attiva="lezioni" onVai={onNaviga} />}
    </div>
  );
}
