import { useState } from 'react';
import { Pagina, IconaTono, type Tono } from '../screens/extra/ui';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { playTapSound } from '../lib/audio';
import { CorpusType, PaywallReason } from '../types';
import { cn } from '../lib/utils';
import { useAccess } from '../access/context';
import { poolMeta } from '../lib/spacedRepetition';

type Modo = 'smart' | 'standard' | 'weakness' | 'blitz' | 'category' | 'recall';

interface PracticeMenuProps {
  onSelectMode: (mode: Modo, category?: string) => void;
  onBack: () => void;
  /** Il materiale (nucleo o tutto il banco) si sceglie in Impostazioni: qui serve solo a leggere il gruppo attivo. */
  selectedCorpus?: CorpusType;
  /** Non più usata (la scelta del materiale è in Impostazioni): resta opzionale perché App.tsx la passa ancora. */
  onSelectCorpus?: (corpus: CorpusType) => void;
  onNeedPass: (reason: PaywallReason) => void;
}

/** Esercizi: un ▶ per la modalità consigliata (intelligente) e le altre come tessere con icona e una parola. «Punti deboli» comprende il ripasso degli errori. */
export default function PracticeMenu({ onSelectMode, onBack, selectedCorpus = 'all', onNeedPass }: PracticeMenuProps) {
  const { pass } = useAccess();
  const [scelta, setScelta] = useState(false);
  const [filtro, setFiltro] = useState<string>('');

  // Senza Pass si studia solo il nucleo gratuito, qualunque sia la scelta salvata
  const corpus: CorpusType = pass ? selectedCorpus : 'initial';
  const poolQuestions = poolMeta(pass, corpus);
  const categories = Array.from(new Set(poolQuestions.map(q => q.category))).filter(Boolean);
  const levels = Array.from(new Set(poolQuestions.map(q => q.level))).filter(Boolean);
  const topics = Array.from(new Set(poolQuestions.map(q => q.grammarTopic))).filter(Boolean);

  const modi: { id: 'weakness' | 'blitz' | 'recall'; tono: Tono; icona: NomeIcona; nome: string; bloccato?: boolean }[] = [
    { id: 'weakness', tono: 'basso', icona: 'modo-punti-deboli', nome: 'Punti deboli', bloccato: !pass },
    { id: 'blitz', tono: 'medio', icona: 'modo-blitz', nome: 'Blitz' },
    { id: 'recall', tono: 'viola', icona: 'modo-richiamo', nome: 'Richiamo' },
  ];

  const avvia = (id: 'weakness' | 'blitz' | 'recall') => {
    if (id === 'weakness' && !pass) onNeedPass('errori');
    else onSelectMode(id);
  };

  const tessera = 'brand-premibile relative flex min-h-[124px] flex-col items-center justify-center gap-2.5 rounded-[16px] bg-superficie-2 p-3';

  return (
    <Pagina titolo="Esercizi" onBack={() => { playTapSound(); onBack(); }}>
      <button type="button" onClick={() => { playTapSound(); onSelectMode('smart'); }}
        className="brand-premibile mt-5 w-full min-h-[56px] flex items-center justify-center gap-2.5 rounded-[14px] bg-azione hover:bg-azione-scuro text-azione-su text-[16px] font-bold transition-colors duration-100">
        <Icona nome="studia" size={22} />Intelligente
      </button>

      <div className="mt-4 grid grid-cols-2 gap-[12px]">
        {modi.map(m => (
          <button key={m.id} type="button" onClick={() => { playTapSound(); avvia(m.id); }} className={tessera}>
            <IconaTono tono={m.tono} lato={56} className="rounded-[16px]"><Icona nome={m.icona} size={30} /></IconaTono>
            <span className="text-[15px] leading-[20px] font-bold text-testo">{m.nome}</span>
            {m.bloccato && <span className="absolute right-2.5 top-2.5 text-testo-tenue"><Icona nome="blocco" size={16} titolo="Pass" /></span>}
          </button>
        ))}
        <button type="button" aria-pressed={scelta} onClick={() => { playTapSound(); setScelta(v => !v); }}
          className={cn(tessera, scelta && 'ring-2 ring-alto')}>
          <IconaTono tono="alto" lato={56} className="rounded-[16px]"><Icona nome="modo-argomento" size={30} /></IconaTono>
          <span className="text-[15px] leading-[20px] font-bold text-testo">Argomento</span>
        </button>
      </div>

      {scelta && (
        <div className="mt-4 flex items-center gap-2.5">
          <select aria-label="Argomento" value={filtro} onChange={e => setFiltro(e.target.value)}
            className="flex-1 min-w-0 min-h-[48px] bg-superficie border border-linea rounded-[12px] px-4 text-[15px] font-semibold text-testo outline-none focus:border-azione appearance-none">
            <option value="" disabled>Argomento</option>
            <optgroup label="Categorie">
              {categories.map(c => <option key={`category:${c}`} value={`category:${c}`}>{c}</option>)}
            </optgroup>
            <optgroup label="Livelli">
              {levels.map(l => <option key={`level:${l}`} value={`level:${l}`}>{l}</option>)}
            </optgroup>
            <optgroup label="Argomenti">
              {topics.map(t => <option key={`topic:${t}`} value={`topic:${t}`}>{t}</option>)}
            </optgroup>
          </select>
          <button type="button" disabled={!filtro} aria-label="Inizia" onClick={() => { playTapSound(); onSelectMode('category', filtro); }}
            className="brand-premibile shrink-0 grid h-[48px] w-[48px] place-items-center rounded-[12px] bg-azione hover:bg-azione-scuro disabled:bg-tacca disabled:text-testo-tenue text-azione-su">
            <Icona nome="studia" size={22} />
          </button>
        </div>
      )}
    </Pagina>
  );
}
