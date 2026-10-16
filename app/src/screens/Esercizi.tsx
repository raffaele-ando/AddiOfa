import type { AppState } from '../types';
import { playTapSound } from '../lib/audio';
import { FONT } from '../brand/tokens';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import Navigazione, { Scheda } from '../components/Navigazione';
import { IconaTono, TestataScheda, type Tono } from './extra/ui';

interface Props {
  appState: AppState;
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

/** Scheda Lezioni: quattro tessere (Percorso, Esercizi, Frasi, Prontuario). Il resto sta nelle altre destinazioni. */
export default function Esercizi({ onStartLearn, onOpenCheatSheet, onOpenProfilo, onNaviga, onOpenExtra }: Props) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-6">
          <TestataScheda titolo="Esercizi" onProfilo={() => (onOpenProfilo ? onOpenProfilo() : onOpenExtra?.('profilo'))} />

          <div className="mt-[16px] grid grid-cols-2 gap-[12px]">
            <Tessera icona="percorso" tono="azione" etichetta="Percorso" onClick={onOpenExtra ? () => onOpenExtra('percorso') : undefined} />
            <Tessera icona="esercizi" tono="medio" etichetta="Esercizi" onClick={onStartLearn} />
            <Tessera icona="frasi" tono="viola" etichetta="Frasi" onClick={onOpenExtra ? () => onOpenExtra('frasi') : undefined} />
            <Tessera icona="prontuario" tono="azione" etichetta="Prontuario" onClick={onOpenCheatSheet} />
          </div>
        </div>
      </div>
      {onNaviga && <Navigazione attiva="esercizi" onVai={onNaviga} />}
    </div>
  );
}
