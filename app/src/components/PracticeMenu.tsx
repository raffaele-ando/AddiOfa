import React, { useState } from 'react';
import { ArrowLeft, Layers, BookmarkCheck, Lock } from 'lucide-react';
import { IconaChip } from '../brand/componenti';
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

  return (
    <div className="h-full w-full bg-white dark:bg-[#1E293B] sm:rounded-[32px] sm:border sm:border-gray-200 dark:sm:border-[#334155] overflow-hidden shadow-sm transition-colors duration-300 flex flex-col">
      <div className="flex flex-col h-full p-4 sm:p-6 gap-3 sm:gap-4 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
      <header className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { playTapSound(); onBack(); }}
            className="p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Modalità</h1>
        </div>
        {corpus === 'initial' && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#22C55E]/10 text-[#16A34A] dark:text-[#34D399] border border-[#22C55E]/30">
            <BookmarkCheck size={14} />
            <span>{pass ? 'Nucleo di base' : 'Nucleo gratuito'} ({coreCount})</span>
          </span>
        )}
      </header>

      {/* Corpus Selector Control */}
      {(onSelectCorpus || !pass) && (
        <div className="flex items-center justify-between bg-gray-100 dark:bg-[#0F172A] p-1.5 rounded-2xl border border-gray-200 dark:border-[#334155] shrink-0">
          <button
            type="button"
            onClick={() => {
              playTapSound();
              if (!pass) onNeedPass('domande');
              else onSelectCorpus?.('all');
            }}
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5",
              corpus !== 'initial'
                ? "bg-white dark:bg-[#1E293B] text-[#EF4444] shadow-xs border border-gray-200/50 dark:border-[#334155]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            {pass ? <Layers size={15} /> : <Lock size={15} />}
            <span>Tutte le domande ({bankCount})</span>
          </button>
          <button
            type="button"
            onClick={() => { playTapSound(); onSelectCorpus?.('initial'); }}
            className={cn(
              "flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5",
              corpus === 'initial'
                ? "bg-white dark:bg-[#1E293B] text-[#16A34A] dark:text-[#34D399] shadow-xs border border-gray-200/50 dark:border-[#334155]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            )}
          >
            <BookmarkCheck size={15} />
            <span>{pass ? 'Nucleo di base' : 'Nucleo gratuito'} ({coreCount})</span>
          </button>
        </div>
      )}
      {!pass && (
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 -mt-1 shrink-0">
          Gratis studi il nucleo di {coreCount} domande. Con il Pass si apre tutto il banco ({bankCount}) e il ripasso sugli errori.
        </p>
      )}

      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 min-h-0 items-stretch">
        <button
          onClick={() => { playTapSound(); onSelectMode('standard'); }}
          className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1E293B] text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 active:scale-[.99] flex items-center gap-4 h-full"
        >
          <IconaChip nome="studio" lato={48} />
          <div>
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg mb-0.5">Standard</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Ripasso a intervalli: ogni domanda torna quando serve.</p>
          </div>
        </button>

        <button
          onClick={() => { playTapSound(); if (!pass) onNeedPass('errori'); else onSelectMode('weakness'); }}
          className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1E293B] text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 active:scale-[.99] flex items-center gap-4 h-full"
        >
          <IconaChip nome="errore" lato={48} />
          <div>
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg mb-0.5 flex items-center gap-2">
              Punti deboli
              {!pass && <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-[#334155] text-gray-600 dark:text-gray-300"><Lock size={11} strokeWidth={3} /> Pass</span>}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Focalizzati sugli errori.</p>
          </div>
        </button>

        <button
          onClick={() => { playTapSound(); onSelectMode('blitz'); }}
          className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1E293B] text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 active:scale-[.99] flex items-center gap-4 h-full"
        >
          <IconaChip nome="quiz" lato={48} />
          <div>
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg mb-0.5">Blitz</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Timer aggressivo (10s).</p>
          </div>
        </button>

        <button
          onClick={() => { playTapSound(); onSelectMode('recall'); }}
          className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] hover:bg-gray-50 dark:hover:bg-[#1E293B] text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 active:scale-[.99] flex items-center gap-4 h-full"
        >
          <IconaChip nome="aiuto" lato={48} />
          <div>
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg mb-0.5">Richiamo attivo</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Nasconde le opzioni.</p>
          </div>
        </button>

        <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-[#334155] p-4 sm:p-6 rounded-2xl flex flex-col justify-between gap-4 sm:col-span-2 h-full">
          <div className="flex items-center gap-4">
            <IconaChip nome="contenuti" lato={48} />
            <div>
              <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg mb-0.5">Filtro mirato</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Allenati su una categoria, un livello o un argomento specifico.</p>
            </div>
          </div>
          <div className="flex flex-row gap-3 mt-auto">
            <select 
              className="flex-1 min-w-0 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-xl px-4 py-3 text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] outline-none focus:border-[#EF4444] transition-colors appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="" disabled>Seleziona un filtro...</option>
              <optgroup label="Raccolte">
                <option value="corpus:initial">Nucleo {pass ? 'di base' : 'gratuito'} ({coreCount} domande)</option>
                <option value="corpus:all">{pass ? '' : 'Con il Pass: '}Tutto il banco ({bankCount} domande)</option>
              </optgroup>
              <optgroup label="Categorie">
                {categories.map(c => (
                  <option key={`category:${c}`} value={`category:${c}`}>{c}</option>
                ))}
              </optgroup>
              <optgroup label="Livelli">
                {levels.map(l => (
                  <option key={`level:${l}`} value={`level:${l}`}>Livello {l}</option>
                ))}
              </optgroup>
              <optgroup label="Argomenti Grammaticali">
                {topics.map(t => (
                  <option key={`topic:${t}`} value={`topic:${t}`}>{t}</option>
                ))}
              </optgroup>
            </select>
            <button
              disabled={!selectedCategory}
              onClick={() => { playTapSound(); startFilter(); }}
              className="brand-premibile bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-200 disabled:dark:bg-[#334155] disabled:text-gray-400 text-white font-semibold px-6 sm:px-8 py-3 text-sm sm:text-base rounded-xl"
            >
              Inizia
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
