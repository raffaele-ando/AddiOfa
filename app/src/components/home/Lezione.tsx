import { Clock, FileText, Lock } from 'lucide-react';
import { Carta } from './comune';
import Cta from './Cta';
import type { Lezione } from './stima';

export default function LezioneCard({ lezione, onApri }: { lezione: Lezione; onApri: () => void }) {
  const motivo = lezione.motivo === 'debole'
    ? `È l'argomento in cui sbagli di più: ${lezione.percento}% di risposte esatte su ${lezione.risposte}.`
    : 'Una scheda breve per cominciare dalle regole che servono di più.';
  return (
    <Carta indice={3} className="p-4">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-2xl bg-[#F1F5F9] dark:bg-[#0F172A] text-[#EF4444] flex items-center justify-center shrink-0"><FileText size={22} aria-hidden="true" /></span>
        <div className="min-w-0">
          <div className="text-[12.5px] font-medium text-[#6B7280] dark:text-[#94A3B8]">Prossima lezione consigliata</div>
          <div className="text-[16px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-snug">{lezione.topic.titolo}</div>
          <div className="text-[13px] leading-snug text-[#6B7280] dark:text-[#94A3B8] mt-0.5">{motivo}</div>
        </div>
      </div>
      <div className="mt-3">
        <Cta compatto onClick={onApri} bloccato={lezione.bloccata}
          icona={lezione.bloccata ? <Lock size={14} className="text-[#EF4444]" aria-hidden="true" /> : undefined}
          sotto={<span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" /> {lezione.minuti} min{lezione.bloccata ? ' · con il Pass' : ''}</span>}>
          Inizia la lezione
        </Cta>
      </div>
    </Carta>
  );
}
