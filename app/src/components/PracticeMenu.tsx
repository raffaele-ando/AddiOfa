import React, { useState } from 'react';
import { Brain, ChevronRight, Crosshair, Lock, Repeat, Target, Zap } from 'lucide-react';
import { Pagina, IconaTono, type Tono } from '../screens/extra/ui';
import { getQuestionsByCorpus } from '../data/questions';
import { playTapSound } from '../lib/audio';
import { CorpusType, PaywallReason } from '../types';
import { cn } from '../lib/utils';
import { useAccess } from '../access/context';
import { bankMeta, poolMeta } from '../lib/spacedRepetition';

interface PracticeMenuProps {
  onSelectMode: (mode: 'standard' | 'weakness' | 'blitz' | 'category' | 'recall', category?: string) => void;
  onBack: () => void;
  selectedCorpus?: CorpusType;
  onSelectCorpus?: (corpus: CorpusType) => void;
  onNeedPass: (reason: PaywallReason) => void;
}

export default function PracticeMenu({ onSelectMode, onBack, selectedCorpus = 'all', onSelectCorpus, onNeedPass }: PracticeMenuProps) {
  const { pass } = useAccess();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Senza Pass si studia solo il nucleo gratuito, qualunque sia la scelta salvata
  const corpus: CorpusType = pass ? selectedCorpus : 'initial';
  const coreCount = getQuestionsByCorpus('initial').length;
  const bankCount = bankMeta().length;
  const poolQuestions = poolMeta(pass, corpus);
  const categories = Array.from(new Set(poolQuestions.map(q => q.category))).filter(Boolean);
  const levels = Array.from(new Set(poolQuestions.map(q => q.level))).filter(Boolean);
  const topics = Array.from(new Set(poolQuestions.map(q => q.grammarTopic))).filter(Boolean);

  const startFilter = () => {
    // "Tutto il banco" richiede il Pass
    if (!pass && selectedCategory === 'corpus:all') { onNeedPass('domande'); return; }
    onSelectMode('category', selectedCategory);
  };

  const modi: { id: 'standard' | 'weakness' | 'blitz' | 'recall'; tono: Tono; Icona: typeof Repeat; titolo: string; testo: string; bloccato?: boolean }[] = [
    { id: 'standard', tono: 'azione', Icona: Repeat, titolo: 'Standard', testo: 'Ripasso a intervalli: ogni domanda torna quando serve.' },
    { id: 'weakness', tono: 'basso', Icona: Crosshair, titolo: 'Punti deboli', testo: 'Ti fa ripartire dagli errori.', bloccato: !pass },
    { id: 'blitz', tono: 'medio', Icona: Zap, titolo: 'Blitz', testo: 'Dieci secondi a domanda.' },
    { id: 'recall', tono: 'viola', Icona: Brain, titolo: 'Richiamo attivo', testo: 'Le opzioni sono nascoste: ricostruisci la risposta.' },
  ];

  return (
    <Pagina titolo="Esercizi" onBack={() => { playTapSound(); onBack(); }}
      sottotitolo={!pass ? `Gratis studi il nucleo di ${coreCount} domande. Con il Pass si apre tutto il banco (${bankCount}) e il ripasso sugli errori.` : 'Scegli come allenarti.'}>
      {(onSelectCorpus || !pass) && (
        <div role="group" aria-label="Materiale di studio" className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-[12px] bg-superficie-2">
          {([['all', `Tutte le domande (${bankCount})`], ['initial', `${pass ? 'Nucleo di base' : 'Nucleo gratuito'} (${coreCount})`]] as const).map(([id, testo]) => {
            const on = (id === 'initial') === (corpus === 'initial');
            return (
              <button key={id} type="button" aria-pressed={on}
                onClick={() => { playTapSound(); if (id === 'all') { if (!pass) onNeedPass('domande'); else onSelectCorpus?.('all'); } else onSelectCorpus?.('initial'); }}
                className={cn('rounded-[9px] py-2.5 px-2 text-[13px] font-semibold transition-colors duration-100', on ? 'bg-superficie text-testo shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>
                {testo}{id === 'all' && !pass && <Lock size={12} className="inline ml-1 -mt-0.5" aria-label="Richiede il Pass" />}
              </button>
            );
          })}
        </div>
      )}

      <ul className="mt-5 flex flex-col gap-[8px]">
        {modi.map(m => (
          <li key={m.id}>
            <button type="button" onClick={() => { playTapSound(); if (m.id === 'weakness' && !pass) onNeedPass('errori'); else onSelectMode(m.id); }}
              className="brand-premibile w-full flex items-center gap-3.5 rounded-[12px] bg-superficie-2 p-[10px] pr-3 text-left">
              <IconaTono tono={m.tono} lato={44}><m.Icona size={24} /></IconaTono>
              <span className="flex-1 min-w-0">
                <span className="block text-[15px] leading-[20px] font-bold text-testo">{m.titolo}</span>
                <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{m.testo}</span>
              </span>
              {m.bloccato
                ? <Lock size={17} className="shrink-0 text-testo-tenue" aria-label="Richiede il Pass" />
                : <ChevronRight size={22} strokeWidth={2} className="shrink-0 -mr-1 text-testo-tenue" aria-hidden="true" />}
            </button>
          </li>
        ))}
      </ul>

      <section aria-labelledby="titolo-filtro" className="mt-6 flex flex-col gap-[10px]">
        <h2 id="titolo-filtro" className="text-[15.5px] leading-[20px] font-bold text-testo">Filtro mirato</h2>
        <div className="flex items-center gap-3.5">
          <IconaTono tono="alto" lato={44}><Target size={24} /></IconaTono>
          <p className="text-[12.5px] leading-[17px] text-testo-tenue">Allenati su una categoria, un livello o un argomento specifico.</p>
        </div>
        <select aria-label="Filtro" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
          className="w-full min-h-[48px] bg-superficie border border-linea rounded-[12px] px-4 text-[15px] font-semibold text-testo outline-none focus:border-azione appearance-none">
          <option value="" disabled>Seleziona un filtro...</option>
          <optgroup label="Raccolte">
            <option value="corpus:initial">Nucleo {pass ? 'di base' : 'gratuito'} ({coreCount} domande)</option>
            <option value="corpus:all">{pass ? '' : 'Con il Pass: '}Tutto il banco ({bankCount} domande)</option>
          </optgroup>
          <optgroup label="Categorie">
            {categories.map(c => <option key={`category:${c}`} value={`category:${c}`}>{c}</option>)}
          </optgroup>
          <optgroup label="Livelli">
            {levels.map(l => <option key={`level:${l}`} value={`level:${l}`}>Livello {l}</option>)}
          </optgroup>
          <optgroup label="Argomenti grammaticali">
            {topics.map(t => <option key={`topic:${t}`} value={`topic:${t}`}>{t}</option>)}
          </optgroup>
        </select>
        <button type="button" disabled={!selectedCategory} onClick={() => { playTapSound(); startFilter(); }}
          className="brand-premibile w-full min-h-[48px] bg-azione hover:bg-azione-scuro disabled:bg-tacca disabled:text-testo-tenue text-azione-su font-bold text-[15px] rounded-[12px]">
          Inizia
        </button>
      </section>
    </Pagina>
  );
}
