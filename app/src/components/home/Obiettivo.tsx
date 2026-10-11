import { ChevronRight, Lock, Target } from 'lucide-react';
import { motion } from 'motion/react';
import { Carta, useRiduci } from './comune';
import type { Obiettivo } from './stima';
import { FORMATS } from '../../config/offer';
import { playTapSound } from '../../lib/audio';

function Anello({ valore, testo, colore }: { valore: number; testo: string; colore: string }) {
  const riduci = useRiduci();
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="relative w-[64px] h-[64px] shrink-0" aria-hidden="true">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-black/[0.07] dark:stroke-white/10" />
        <motion.circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" stroke={colore} strokeDasharray={c}
          initial={riduci ? false : { strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(1, valore)) }}
          transition={{ duration: riduci ? 0 : 0.9, delay: riduci ? 0 : 0.5, ease: 'easeOut' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">{testo}</span>
    </div>
  );
}

/** Ultima simulazione contro la soglia, oppure invito alla prima. Un tocco avvia la simulazione (o apre il Pass). */
export default function ObiettivoCard({ ultima, bloccata, onVai }: { ultima: Obiettivo | null; bloccata: boolean; onVai: () => void }) {
  const f = FORMATS[ultima?.formato ?? 'ente'];
  return (
    <Carta indice={2} tinta="bg-[#EDF9F1] dark:bg-[#22C55E]/10 border-[#CDEFDA] dark:border-[#22C55E]/25" className="p-0">
      <button type="button" onClick={() => { playTapSound(); onVai(); }} className="brand-premibile w-full flex items-center gap-3 p-4 text-left rounded-3xl">
        <span className="w-11 h-11 rounded-2xl bg-white dark:bg-[#0F172A] text-[#16A34A] flex items-center justify-center shrink-0"><Target size={24} aria-hidden="true" /></span>
        <span className="flex-1 min-w-0">
          <span className="block text-[16px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">Il tuo obiettivo</span>
          {ultima ? (
            <span className="block text-[13px] leading-snug text-[#475569] dark:text-[#CBD5E1] mt-0.5">
              Ultima simulazione: {ultima.esatte} su {ultima.totale}, soglia {ultima.soglia}.{' '}
              {ultima.superata ? 'Soglia superata.' : `Ti ${ultima.soglia - ultima.esatte === 1 ? 'manca 1 risposta esatta' : `mancano ${ultima.soglia - ultima.esatte} risposte esatte`}.`}
            </span>
          ) : (
            <span className="block text-[13px] leading-snug text-[#475569] dark:text-[#CBD5E1] mt-0.5">
              Arrivare a {f.passMark} risposte esatte su {f.questions}. Fai la prima simulazione per vedere dove sei.
              {bloccata && <Lock size={12} className="inline ml-1 -mt-0.5" aria-label="Richiede il Pass" />}
            </span>
          )}
          {ultima && bloccata && <span className="flex items-center gap-1 text-[12px] font-semibold text-[#475569] dark:text-[#CBD5E1] mt-1"><Lock size={12} aria-hidden="true" /> Rifarla richiede il Pass</span>}
        </span>
        {ultima
          ? <Anello valore={ultima.esatte / ultima.soglia} testo={`${ultima.esatte}/${ultima.soglia}`} colore={ultima.superata ? '#22C55E' : '#F59E0B'} />
          : <ChevronRight size={20} className="shrink-0 text-[#94A3B8]" aria-hidden="true" />}
      </button>
    </Carta>
  );
}
