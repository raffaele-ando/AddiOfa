import { useState } from 'react';
import { AlertCircle, BarChart3, CheckCircle2, Info, ArrowUp, ArrowDown, Stethoscope } from 'lucide-react';
import Indicatore from './Indicatore';
import Cta from './Cta';
import { Carta } from './comune';
import { livelloDi, type Livello, type Stima } from './stima';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../config/offer';
import { playTapSound } from '../../lib/audio';

const MESSAGGI: Record<Livello, { titolo: string; testo: string; Icona: typeof Info; fondo: string; icona: string; testoTitolo: string }> = {
  basso: {
    titolo: 'Probabilità ancora bassa', testo: 'Per ora il livello non basta per la soglia. Con un po’ di pratica ogni giorno può salire.', Icona: AlertCircle,
    fondo: 'bg-[#FEF1F1] border-[#FBD9D9] dark:bg-[#EF4444]/10 dark:border-[#EF4444]/25', icona: 'text-[#EF4444]', testoTitolo: 'text-[#B91C1C] dark:text-[#FCA5A5]',
  },
  medio: {
    titolo: 'Probabilità media', testo: 'Stai migliorando. Continua a studiare per avvicinarti alla soglia.', Icona: BarChart3,
    fondo: 'bg-[#FFF8E8] border-[#FBE9BE] dark:bg-[#F59E0B]/10 dark:border-[#F59E0B]/25', icona: 'text-[#D97706]', testoTitolo: 'text-[#92400E] dark:text-[#FCD34D]',
  },
  alto: {
    titolo: 'Probabilità alta', testo: 'Buon punto di partenza. Una simulazione ti dice se sei pronto davvero.', Icona: CheckCircle2,
    fondo: 'bg-[#EDF9F1] border-[#CDEFDA] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/25', icona: 'text-[#16A34A]', testoTitolo: 'text-[#166534] dark:text-[#86EFAC]',
  },
};

export const SOTTO_CIAO: Record<Livello | 'nuovo', string> = {
  nuovo: 'Cominciamo da dove sei oggi.', basso: 'Ecco la tua situazione attuale.', medio: 'Un passo alla volta.', alto: 'Buon punto di partenza.',
};

function fonteTesto(s: Stima): string {
  const n = `${s.risposte} risposte`;
  return s.fonte === 'diagnostico' ? `calcolata sulle tue ${n} del diagnostico`
    : s.fonte === 'simulazioni' ? `calcolata sulle tue ${n} nelle simulazioni`
    : `calcolata sulle tue ${n}, diagnostico e simulazioni`;
}

interface Props {
  stima: Stima | null;
  haRisposte: boolean;
  corpoCta: { etichetta: string; sotto?: string; bloccato?: boolean; azione: () => void };
  onStudia: () => void;
  onDiagnostico?: () => void;
}

export default function StimaCard({ stima, haRisposte, corpoCta, onStudia, onDiagnostico }: Props) {
  const [info, setInfo] = useState(false);

  // Nessuna stima: niente indicatore finto, si invita a fare il diagnostico
  if (!stima) {
    return (
      <Carta indice={0} className="p-5">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-11 h-11 rounded-2xl bg-[#FEEEEE] dark:bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center shrink-0"><Stethoscope size={22} aria-hidden="true" /></span>
          <h2 className="text-[19px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">Scopri a che punto sei</h2>
        </div>
        <p className="text-[14px] leading-snug text-[#6B7280] dark:text-[#94A3B8] mt-2 mb-4">
          10 domande, 3 minuti: ti diciamo la probabilità stimata di superare il test e da quali argomenti partire. È gratis e non serve registrarsi.
        </p>
        <div className="flex flex-col gap-2.5">
          {onDiagnostico && <Cta onClick={onDiagnostico} sotto="10 domande · 3 minuti">Fai il diagnostico gratuito</Cta>}
          <button type="button" onClick={() => { playTapSound(); onStudia(); }}
            className="brand-premibile w-full rounded-2xl border border-[#E5E7EB] dark:border-[#334155] bg-transparent text-[#0F172A] dark:text-[#F8FAFC] text-[15px] font-semibold py-3">
            {haRisposte ? 'Continua a studiare' : 'Oppure inizia a studiare'}
          </button>
        </div>
      </Carta>
    );
  }

  const percento = Math.round(stima.p * 100);
  const livello = livelloDi(stima.p);
  const m = MESSAGGI[livello];
  return (
    <Carta indice={0} className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-[18px] leading-tight font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">La tua probabilità</h2>
            <button type="button" onClick={() => setInfo(v => !v)} aria-expanded={info} aria-controls="info-stima" aria-label="Come è calcolata la stima"
              className="p-1 -m-0.5 rounded-full text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"><Info size={17} /></button>
          </div>
          <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8] mt-0.5 leading-snug">Più ti alleni, più la stima si precisa.</p>
        </div>
        {stima.delta !== undefined && (
          <div className="shrink-0 rounded-2xl px-3 py-2 text-center bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center justify-center gap-1 text-[16px] font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              {stima.delta > 0 ? <ArrowUp size={15} aria-hidden="true" /> : <ArrowDown size={15} aria-hidden="true" />}
              {stima.delta > 0 ? '+' : '−'}{Math.abs(stima.delta)} punti
            </div>
            <div className="text-[10.5px] leading-tight text-[#6B7280] dark:text-[#94A3B8]">rispetto al diagnostico</div>
          </div>
        )}
      </div>
      {info && (
        <p id="info-stima" className="mt-3 rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] px-3 py-2.5 text-[12.5px] leading-snug text-[#475569] dark:text-[#CBD5E1]">
          È una stima approssimativa, non una garanzia. Dice quanto è probabile fare almeno {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}, partendo dalle risposte date nel diagnostico e nelle simulazioni. Con poche risposte può sbagliare anche di molto. Le sessioni di ripasso non contano: scelgono le domande più difficili.
        </p>
      )}

      <div className="mt-1">
        <Indicatore percento={percento} livello={livello} etichetta="di superare il test" sotto={fonteTesto(stima)} />
      </div>

      <div className={`flex items-start gap-3 rounded-2xl border px-3.5 py-3 mt-1 ${m.fondo}`}>
        <m.Icona size={24} className={`shrink-0 mt-0.5 ${m.icona}`} aria-hidden="true" />
        <div className="min-w-0">
          <div className={`text-[15px] font-bold leading-tight ${m.testoTitolo}`}>{m.titolo}</div>
          <div className="text-[13px] leading-snug text-[#475569] dark:text-[#CBD5E1] mt-0.5">{m.testo}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-[13px] font-medium text-[#6B7280] dark:text-[#94A3B8] mb-2">Cosa puoi fare ora?</div>
        <Cta onClick={corpoCta.azione} sotto={corpoCta.sotto} bloccato={corpoCta.bloccato}>{corpoCta.etichetta}</Cta>
      </div>
    </Carta>
  );
}
