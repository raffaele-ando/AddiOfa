import { Flame, BarChart3, ChevronRight } from 'lucide-react';
import { Carta } from './comune';
import { playTapSound } from '../../lib/audio';

type Giorno = { data: string; conteggio: number; lettera: string };

/** Serie di giorni di studio: sette pallini, pieni nei giorni con attività. Mai messaggi di perdita. */
export function SerieCard({ serie, giorni }: { serie: number; giorni: Giorno[] }) {
  const haDati = giorni.some(g => g.conteggio > 0);
  // senza storico giornaliero (dati vecchi) si riempiono gli ultimi giorni della serie
  const attivo = (g: Giorno, i: number) => haDati ? g.conteggio > 0 : i >= giorni.length - Math.min(serie, giorni.length);
  const quanti = giorni.filter(attivo).length;
  return (
    <Carta className="p-3.5 flex flex-col">
      <div className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#6B7280] dark:text-[#94A3B8]">
        <Flame size={16} className="text-[#F59E0B]" fill="currentColor" aria-hidden="true" /> Serie di studio
      </div>
      <div className="text-[20px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight mt-1">
        {serie > 0 ? `${serie} ${serie === 1 ? 'giorno' : 'giorni'}` : 'Comincia oggi'}
      </div>
      <div className="flex gap-1 mt-auto pt-3" role="img" aria-label={`Studio in ${quanti} degli ultimi 7 giorni`}>
        {giorni.map((g, i) => (
          <span key={g.data} className={`w-[14px] h-[14px] rounded-full ${attivo(g, i) ? 'bg-[#F59E0B]' : 'bg-[#E5E7EB] dark:bg-[#334155]'}`} />
        ))}
      </div>
      <div className="text-[10.5px] text-[#6B7280] dark:text-[#94A3B8] mt-1">Ultimi 7 giorni</div>
    </Carta>
  );
}

export function ProgressiCard({ imparate, totale, giorni, onVai }: { imparate: number; totale: number; giorni: Giorno[]; onVai?: () => void }) {
  const max = Math.max(...giorni.map(g => g.conteggio), 1);
  const haDati = giorni.some(g => g.conteggio > 0);
  const corpo = (
    <>
      <div className="flex items-center justify-between gap-1 text-[12.5px] font-medium text-[#6B7280] dark:text-[#94A3B8]">
        <span className="flex items-center gap-1.5"><BarChart3 size={16} className="text-[#2563EB] dark:text-[#60A5FA]" aria-hidden="true" /> I tuoi progressi</span>
        {onVai && <ChevronRight size={15} aria-hidden="true" />}
      </div>
      <div className="text-[20px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight mt-1">
        {imparate} <span className="text-[13px] font-semibold text-[#6B7280] dark:text-[#94A3B8]">su {totale}</span>
      </div>
      <div className="text-[11.5px] text-[#6B7280] dark:text-[#94A3B8] leading-tight">domande imparate</div>
      {haDati && (
        <div className="flex items-end gap-1 h-[26px] mt-auto pt-2" role="img" aria-label="Risposte date negli ultimi 7 giorni">
          {giorni.map(g => (
            <span key={g.data} className="flex-1 rounded-sm bg-[#2563EB]" style={{ opacity: g.conteggio ? 1 : 0.18, height: Math.max(3, Math.round((g.conteggio / max) * 24)) }} />
          ))}
        </div>
      )}
    </>
  );
  return (
    <Carta className="p-0 flex flex-col">
      {onVai
        ? <button type="button" onClick={() => { playTapSound(); onVai(); }} className="brand-premibile w-full flex-1 text-left p-3.5 rounded-3xl flex flex-col">{corpo}</button>
        : <div className="p-3.5 flex-1 flex flex-col">{corpo}</div>}
    </Carta>
  );
}
