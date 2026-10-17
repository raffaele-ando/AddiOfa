// Esercizi (scheda della barra): un grande ▶ «Intelligente», le quattro modalità (Punti deboli, Blitz, Richiamo, Argomento) e
// le due tessere illustrate Frasi e Prontuario. Concept: 30 (scheda 7, «Studia»), 49 (scheda 4), 31 (scheda 8). Arte: docs/design/ILLUSTRAZIONI.md.
import { useMemo, useState } from 'react';
import type { AppState } from '../types';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { bankMeta, isLearned } from '../lib/spacedRepetition';
import { FONT } from '../brand/tokens';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import Navigazione, { Scheda } from '../components/Navigazione';
import { IconaTono, TestataScheda, type Tono } from './extra/ui';
import { Arte } from './extra/studio/comune';

export type ModoEsercizi = 'smart' | 'weakness' | 'blitz' | 'category' | 'recall';

interface Props {
  appState: AppState;
  /** Avvia una sessione. Nuova, facoltativa: se App.tsx non la passa, si usano le props sotto (le modalità senza una prop di ripiego aprono il vecchio menu `onStartLearn`). */
  onAvvia?: (modo: ModoEsercizi, categoria?: string) => void;
  /** Ripiego per `onAvvia`: apre il vecchio menu degli esercizi (vista `practiceMenu`). */
  onStartLearn?: () => void;
  /** Ripiego per `onAvvia('weakness')`. */
  onStartErrors?: () => void;
  /** Ripiego per `onAvvia('category', filtro)`. */
  onStartFocus?: (filtro: string) => void;
  onOpenCheatSheet?: () => void;
  /** Profilo in alto a destra. Assente = si apre la schermata extra `profilo`. */
  onOpenProfilo?: () => void;
  onNaviga?: (s: Scheda) => void;
  /** Apre una schermata extra (`frasi`, `profilo`). */
  onOpenExtra?: (id: string, params?: Record<string, string>) => void;
  /** Non usate dalla scheda (le funzioni stanno in altre destinazioni): restano opzionali perché App.tsx le passa ancora. */
  onOpenStats?: () => void;
  onOpenTheory?: () => void;
  onOpenTheoryTopic?: (id: string) => void;
  onOpenDiagnostic?: () => void;
}

const MODI: { id: 'weakness' | 'blitz' | 'recall'; tono: Tono; icona: NomeIcona; nome: string }[] = [
  { id: 'weakness', tono: 'basso', icona: 'modo-punti-deboli', nome: 'Punti deboli' },
  { id: 'blitz', tono: 'medio', icona: 'modo-blitz', nome: 'Blitz' },
  { id: 'recall', tono: 'viola', icona: 'modo-richiamo', nome: 'Richiamo' },
];

const TESSERA = 'brand-premibile relative flex min-h-[116px] flex-col items-center justify-center gap-2.5 rounded-[16px] bg-superficie-2 p-3';

/** Riga con un'illustrazione (Frasi, Prontuario). */
function RigaArte({ arte, nome, onClick }: { arte: string; nome: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile flex w-full items-center gap-4 rounded-[16px] bg-superficie-2 p-3 pr-4 text-left">
      <Arte nome={arte} lato={56} />
      <span className="flex-1 min-w-0 text-[16px] leading-[22px] font-bold text-testo">{nome}</span>
      <span aria-hidden="true" className="shrink-0 text-testo-tenue"><Icona nome="avanti" size={22} /></span>
    </button>
  );
}

export default function Esercizi({ appState, onAvvia, onStartLearn, onStartErrors, onStartFocus, onOpenCheatSheet, onOpenProfilo, onNaviga, onOpenExtra }: Props) {
  const [sceltaArgomento, setSceltaArgomento] = useState(false);
  const [filtro, setFiltro] = useState('');

  const meta = useMemo(() => bankMeta(), []);
  const categorie = useMemo(() => Array.from(new Set(meta.map(q => q.category))).filter(Boolean), [meta]);
  const livelli = useMemo(() => Array.from(new Set(meta.map(q => q.level))).filter(Boolean), [meta]);
  const argomenti = useMemo(() => Array.from(new Set(meta.map(q => q.grammarTopic))).filter(Boolean), [meta]);

  // Domande sbagliate almeno una volta e non ancora imparate: i «punti deboli» veri dell'utente (un numero, non una frase)
  const daRipassare = useMemo(() => Object.values(appState.stats ?? {}).filter(s => (s.incorrect ?? 0) > 0 && !isLearned(s)).length, [appState.stats]);

  const avvia = (modo: ModoEsercizi, categoria?: string) => {
    if (onAvvia) { onAvvia(modo, categoria); return; }
    if (modo === 'weakness' && onStartErrors) { onStartErrors(); return; }
    if (modo === 'category' && categoria && onStartFocus) { onStartFocus(categoria); return; }
    onStartLearn?.();
  };

  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-6">
          <TestataScheda titolo="Esercizi" onProfilo={() => (onOpenProfilo ? onOpenProfilo() : onOpenExtra?.('profilo'))} />

          {/* Il ▶ consigliato: l'illustrazione grande (concept 16/17) e un solo pulsante pieno */}
          <section aria-label="Intelligente" className="mt-4 rounded-[20px] bg-superficie-2 px-4 pb-4 pt-3">
            <div className="flex justify-center"><Arte nome="quiz-test" kit="kit-luminoso" lato={128} /></div>
            <button type="button" onClick={() => { playTapSound(); avvia('smart'); }}
              className="brand-premibile mt-2 flex min-h-[60px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-azione text-[17px] font-bold text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
              <Icona nome="studia" size={24} />Intelligente
            </button>
          </section>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {MODI.map(m => (
              <button key={m.id} type="button" onClick={() => { playTapSound(); avvia(m.id); }} className={TESSERA}>
                <IconaTono tono={m.tono} lato={52} className="rounded-[15px]"><Icona nome={m.icona} size={28} /></IconaTono>
                <span className="text-[15px] leading-[20px] font-bold text-testo">{m.nome}</span>
                {m.id === 'weakness' && daRipassare > 0 && (
                  <span aria-label={`${daRipassare} da ripassare`} className="absolute right-2.5 top-2.5 inline-flex min-w-[26px] items-center justify-center rounded-full bg-basso-tinta px-1.5 py-0.5 text-[12px] leading-[16px] font-extrabold tabular-nums text-basso-testo">
                    {daRipassare}
                  </span>
                )}
              </button>
            ))}
            <button type="button" aria-pressed={sceltaArgomento} onClick={() => { playTapSound(); setSceltaArgomento(v => !v); }}
              className={cn(TESSERA, sceltaArgomento && 'ring-2 ring-alto')}>
              <IconaTono tono="alto" lato={52} className="rounded-[15px]"><Icona nome="modo-argomento" size={28} /></IconaTono>
              <span className="text-[15px] leading-[20px] font-bold text-testo">Argomento</span>
            </button>
          </div>

          {sceltaArgomento && (
            <div className="mt-3 flex items-center gap-2.5">
              <select aria-label="Argomento" value={filtro} onChange={e => setFiltro(e.target.value)}
                className="flex-1 min-w-0 min-h-[48px] appearance-none rounded-[12px] border border-linea bg-superficie px-4 text-[15px] font-semibold text-testo outline-none focus:border-azione">
                <option value="" disabled>Argomento</option>
                <optgroup label="Categorie">
                  {categorie.map(c => <option key={`category:${c}`} value={`category:${c}`}>{c}</option>)}
                </optgroup>
                <optgroup label="Livelli">
                  {livelli.map(l => <option key={`level:${l}`} value={`level:${l}`}>{l}</option>)}
                </optgroup>
                <optgroup label="Argomenti">
                  {argomenti.map(t => <option key={`topic:${t}`} value={`topic:${t}`}>{t}</option>)}
                </optgroup>
              </select>
              <button type="button" disabled={!filtro} aria-label="Inizia" onClick={() => { playTapSound(); avvia('category', filtro); }}
                className="brand-premibile grid h-[48px] w-[48px] shrink-0 place-items-center rounded-[12px] bg-azione text-azione-su hover:bg-azione-scuro disabled:bg-tacca disabled:text-testo-tenue">
                <Icona nome="studia" size={22} />
              </button>
            </div>
          )}

          <div className="mt-4 flex flex-col gap-3">
            <RigaArte arte="studio-inglese" nome="Frasi" onClick={onOpenExtra ? () => onOpenExtra('frasi') : undefined} />
            <RigaArte arte="suggerimenti-consigli" nome="Prontuario" onClick={onOpenCheatSheet} />
          </div>
        </div>
      </div>
      {onNaviga && <Navigazione attiva="esercizi" onVai={onNaviga} />}
    </div>
  );
}
