// Esercizi (scheda della barra): una carta con l'unica azione primaria «Allenamento consigliato» (▶ Inizia), le quattro modalità
// (Punti deboli, Blitz, Richiamo, Argomento) ognuna con una riga che dice cosa fa, e le due righe Frasi utili e Riepilogo di grammatica.
// Colonna unica, senza cornice finta. Concept: 30 (scheda 7, «Studia»), 49 (scheda 4), 31 (scheda 8). Arte: docs/design/ILLUSTRAZIONI.md.
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

type ModoCard = { id: 'weakness' | 'blitz' | 'recall'; tono: Tono; icona: NomeIcona; nome: string; riga: string };
const MODI: ModoCard[] = [
  { id: 'weakness', tono: 'basso', icona: 'modo-punti-deboli', nome: 'Punti deboli', riga: 'Le domande che sbagli' },
  { id: 'blitz', tono: 'medio', icona: 'modo-blitz', nome: 'Blitz', riga: '10 domande, 10 secondi l’una' },
  { id: 'recall', tono: 'viola', icona: 'modo-richiamo', nome: 'Richiamo', riga: 'Componi la frase da zero' },
];

const TESSERA = 'brand-premibile flex min-h-[132px] flex-col items-start gap-1 rounded-[16px] bg-superficie-2 border border-linea p-3.5 text-left';

/** Riga con la sua icona in una tessera da 48 px (Frasi utili, Riepilogo di grammatica): stesso trattamento per tutte e due. */
function RigaTesto({ icona, tono, nome, riga, onClick }: { icona: NomeIcona; tono: Tono; nome: string; riga: string; onClick?: () => void }) {
  if (!onClick) return null;
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile flex w-full items-center gap-3.5 rounded-[16px] border border-linea bg-superficie-2 p-3 pr-4 text-left">
      <IconaTono tono={tono} lato={48} className="rounded-[12px]"><Icona nome={icona} size={26} /></IconaTono>
      <span className="flex-1 min-w-0">
        <span className="block text-[16px] leading-[22px] font-bold text-testo">{nome}</span>
        <span className="block text-[13px] leading-[18px] text-testo-tenue">{riga}</span>
      </span>
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

  // Domande sbagliate almeno una volta e non ancora imparate: i «punti deboli» veri dell'utente
  const daRipassare = useMemo(() => Object.values(appState.stats ?? {}).filter(s => (s.incorrect ?? 0) > 0 && !isLearned(s)).length, [appState.stats]);

  const avvia = (modo: ModoEsercizi, categoria?: string) => {
    if (onAvvia) { onAvvia(modo, categoria); return; }
    if (modo === 'weakness' && onStartErrors) { onStartErrors(); return; }
    if (modo === 'category' && categoria && onStartFocus) { onStartFocus(categoria); return; }
    onStartLearn?.();
  };

  return (
    <div className="h-full w-full bg-superficie text-testo overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[480px] px-6 pt-[max(16px,env(safe-area-inset-top))] pb-6">
          <TestataScheda titolo="Esercizi" onProfilo={() => (onOpenProfilo ? onOpenProfilo() : onOpenExtra?.('profilo'))} />

          {/* L'unica azione primaria: titolo, che cosa fa, ▶ Inizia. L'illustrazione sta a destra, piccola */}
          <section aria-labelledby="titolo-consigliato" className="mt-4 rounded-[20px] border border-azione/25 bg-azione-tinta p-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <h2 id="titolo-consigliato" className="text-[19px] leading-[25px] font-extrabold tracking-[-0.01em] text-testo">Allenamento consigliato</h2>
                <p data-testo-ok className="mt-1 text-[14px] leading-[20px] text-testo-tenue">10 domande scelte per te</p>
              </div>
              <Arte nome="quiz-test" kit="kit-luminoso" lato={88} />
            </div>
            <button type="button" onClick={() => { playTapSound(); avvia('smart'); }}
              className="brand-premibile mt-3 flex h-[56px] w-full items-center justify-center gap-2.5 rounded-[14px] bg-azione text-[17px] font-bold text-azione-su transition-colors duration-100 hover:bg-azione-scuro">
              <Icona nome="studia" size={22} />Inizia
            </button>
          </section>

          <h2 className="mt-6 text-[15.5px] leading-[20px] font-bold text-testo">Scegli come allenarti</h2>
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            {MODI.map(m => (
              <button key={m.id} type="button" onClick={() => { playTapSound(); avvia(m.id); }} className={TESSERA}>
                <IconaTono tono={m.tono} lato={44} className="mb-1.5 rounded-[13px]"><Icona nome={m.icona} size={26} /></IconaTono>
                <span className="text-[16px] leading-[21px] font-bold text-testo">{m.nome}</span>
                <span className="text-[13px] leading-[18px] text-testo-tenue">{m.id === 'weakness' && daRipassare > 0 ? `${daRipassare} da ripassare` : m.riga}</span>
              </button>
            ))}
            <button type="button" aria-pressed={sceltaArgomento} onClick={() => { playTapSound(); setSceltaArgomento(v => !v); }}
              className={cn(TESSERA, sceltaArgomento && 'border-azione ring-1 ring-azione')}>
              <IconaTono tono="alto" lato={44} className="mb-1.5 rounded-[13px]"><Icona nome="modo-argomento" size={26} /></IconaTono>
              <span className="text-[16px] leading-[21px] font-bold text-testo">Per argomento</span>
              <span className="text-[13px] leading-[18px] text-testo-tenue">Scegli tu cosa studiare</span>
            </button>
          </div>

          {sceltaArgomento && (
            <div className="mt-3 flex flex-col gap-2.5">
              <select aria-label="Argomento" value={filtro} onChange={e => setFiltro(e.target.value)}
                className="w-full min-h-[48px] appearance-none rounded-[12px] border border-bordo-campo bg-superficie px-4 text-[15px] font-semibold text-testo outline-none focus:border-azione">
                <option value="" disabled>Scegli un argomento</option>
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
              <button type="button" disabled={!filtro} onClick={() => { playTapSound(); avvia('category', filtro); }}
                className="brand-premibile flex h-[52px] w-full items-center justify-center gap-2 rounded-[12px] bg-azione text-[15px] font-bold text-azione-su hover:bg-azione-scuro disabled:bg-tacca disabled:text-testo-tenue">
                <Icona nome="studia" size={20} />Inizia con questo argomento
              </button>
            </div>
          )}

          <h2 className="mt-6 text-[15.5px] leading-[20px] font-bold text-testo">Per studiare</h2>
          <div className="mt-2.5 flex flex-col gap-3">
            <RigaTesto icona="frasi" tono="azione" nome="Frasi utili" riga="Frasi con traduzione e spiegazione" onClick={onOpenExtra ? () => onOpenExtra('frasi') : undefined} />
            <RigaTesto icona="prontuario" tono="viola" nome="Riepilogo di grammatica" riga="Le regole che tornano più spesso" onClick={onOpenCheatSheet} />
          </div>
        </div>
      </div>
      {onNaviga && <Navigazione attiva="esercizi" onVai={onNaviga} />}
    </div>
  );
}
