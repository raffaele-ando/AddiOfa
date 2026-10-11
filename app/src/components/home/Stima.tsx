import { ReactNode } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ChevronRight, Sprout, Stethoscope, Target } from 'lucide-react';
import Misuratore from './Misuratore';
import Cta from './Cta';
import { Carta, RigaIntervallo, RISPOSTE_PER_STIMA_STRETTA } from './comune';
import type { Livello, Stima } from './stima';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../config/offer';
import { playTapSound } from '../../lib/audio';

function fonteTesto(s: Stima): string {
  const n = `${s.risposte} risposte`;
  return s.fonte === 'diagnostico' ? `calcolata sulle tue ${n} del diagnostico`
    : s.fonte === 'simulazioni' ? `calcolata sulle tue ${n} nelle simulazioni`
    : `calcolata sulle tue ${n}, diagnostico e simulazioni`;
}

/** Il misuratore con le righe piccole sotto: da dove viene il numero, punteggio probabile, differenza dal diagnostico. */
export function StimaSezione({ stima, livello, onInfo }: { stima: Stima; livello: Livello; onInfo: () => void }) {
  return (
    <section aria-label="Probabilità stimata di superare il test" className="-mt-1">
      <Misuratore percento={stima.p * 100} livello={livello} etichetta="Probabilità stimata di superare il test" onInfo={onInfo} />
      <div className="mt-1 flex flex-col items-center gap-1">
        <p className="text-[12.5px] text-[#6B7280] dark:text-[#94A3B8] text-center leading-snug px-2">{fonteTesto(stima)}</p>
        {stima.risposte < RISPOSTE_PER_STIMA_STRETTA && <RigaIntervallo intervallo={stima.intervallo} className="px-2" />}
        {stima.delta !== undefined && (
          <p className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white dark:bg-[#1E293B] border border-[#E8ECF3] dark:border-[#334155] px-2.5 py-1 text-[12px] font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
            {stima.delta > 0 ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" />}
            {stima.delta > 0 ? '+' : '−'}{Math.abs(stima.delta)} punti <span className="font-medium text-[#6B7280] dark:text-[#94A3B8]">rispetto al diagnostico</span>
          </p>
        )}
      </div>
    </section>
  );
}

const BANNER: Record<'partenza' | 'margine' | 'soglia' | 'strada', { titolo: string; testo: string; Icona: typeof Target; fondo: string; icona: string; chip: string; titoloCol: string }> = {
  partenza: {
    titolo: 'Parti da qui', testo: 'Poche domande al giorno: la stima sale con la pratica.', Icona: Sprout,
    fondo: 'bg-[#FFF5EC] border-[#FBE0C6] dark:bg-[#F97316]/10 dark:border-[#F97316]/25', icona: 'text-[#EA580C]', chip: 'bg-white dark:bg-[#0F172A]', titoloCol: 'text-[#0F172A] dark:text-[#F8FAFC]',
  },
  margine: {
    titolo: 'Hai ancora margine', testo: `La soglia è alta: ${REAL_TEST_PASS_MARK} su ${REAL_TEST_QUESTIONS}. Ripassa gli argomenti più deboli.`, Icona: Sprout,
    fondo: 'bg-[#FFF5EC] border-[#FBE0C6] dark:bg-[#F97316]/10 dark:border-[#F97316]/25', icona: 'text-[#EA580C]', chip: 'bg-white dark:bg-[#0F172A]', titoloCol: 'text-[#0F172A] dark:text-[#F8FAFC]',
  },
  soglia: {
    titolo: 'Sei vicino alla soglia', testo: 'Continua a studiare, poi una simulazione ti dice se ci sei.', Icona: Target,
    fondo: 'bg-[#FFF8E8] border-[#FBE9BE] dark:bg-[#F59E0B]/10 dark:border-[#F59E0B]/25', icona: 'text-[#D97706]', chip: 'bg-white dark:bg-[#0F172A]', titoloCol: 'text-[#0F172A] dark:text-[#F8FAFC]',
  },
  strada: {
    titolo: 'Sei sulla strada giusta', testo: 'Una simulazione ti dice se sei pronto davvero.', Icona: CheckCircle2,
    fondo: 'bg-[#EDF9F1] border-[#CDEFDA] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/25', icona: 'text-[#16A34A]', chip: 'bg-white dark:bg-[#0F172A]', titoloCol: 'text-[#0F172A] dark:text-[#F8FAFC]',
  },
};

/** "Parti da qui" solo a chi ha fatto il diagnostico e basta (sotto il 20 %); dopo le simulazioni "Hai ancora margine". Il testo sta sempre accanto al colore. */
export function chiaveBanner(stima: Stima, livello: Livello): keyof typeof BANNER {
  return livello === 'alto' ? 'strada' : livello === 'medio' ? 'soglia' : stima.fonte === 'diagnostico' && stima.p < 0.2 ? 'partenza' : 'margine';
}

/** Banner di stato a tutta larghezza: icona, titolo, frase e freccia. Un tocco porta alla pratica o alla simulazione. */
export function BannerStato({ chiave, onClick }: { chiave: keyof typeof BANNER; onClick: () => void }) {
  const m = BANNER[chiave];
  return (
    <Carta indice={1} tinta={m.fondo} className="p-0">
      <button type="button" onClick={() => { playTapSound(); onClick(); }} className="brand-premibile w-full flex items-center gap-3 px-4 py-3.5 text-left rounded-3xl">
        <span className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${m.chip}`}><m.Icona size={24} className={m.icona} aria-hidden="true" /></span>
        <span className="flex-1 min-w-0">
          <span className={`block text-[16px] font-bold leading-tight ${m.titoloCol}`}>{m.titolo}</span>
          <span className="block text-[13.5px] leading-snug text-[#475569] dark:text-[#CBD5E1] mt-0.5">{m.testo}</span>
        </span>
        <ChevronRight size={22} className={`shrink-0 ${m.icona}`} aria-hidden="true" />
      </button>
    </Carta>
  );
}

/** Nessuna stima: niente misuratore finto, si invita a fare il diagnostico. */
export function ScopriCard({ haRisposte, onDiagnostico, onStudia, etichettaStudia, sotto }: {
  haRisposte: boolean; onDiagnostico?: () => void; onStudia: () => void; etichettaStudia: string; sotto?: ReactNode;
}) {
  return (
    <Carta indice={0} className="p-5">
      <div className="flex items-center gap-3 mb-1">
        <span className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-[#2563EB]/15 text-azione dark:text-azione-chiaro flex items-center justify-center shrink-0"><Stethoscope size={22} aria-hidden="true" /></span>
        <h2 className="text-[19px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Scopri a che punto sei</h2>
      </div>
      <p className="text-[14px] leading-snug text-[#6B7280] dark:text-[#94A3B8] mt-2 mb-4">
        10 domande, 3 minuti: ti diciamo la probabilità stimata di superare il test e da quali argomenti partire. È gratis e non serve registrarsi.
      </p>
      <div className="flex flex-col gap-2.5">
        {onDiagnostico && <Cta onClick={onDiagnostico} sotto="10 domande · 3 minuti">Fai il diagnostico gratuito</Cta>}
        <button type="button" onClick={() => { playTapSound(); onStudia(); }}
          className="brand-premibile w-full rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] text-[15px] font-semibold py-3">
          {haRisposte ? 'Continua a studiare' : etichettaStudia}
        </button>
        {sotto}
      </div>
    </Carta>
  );
}
