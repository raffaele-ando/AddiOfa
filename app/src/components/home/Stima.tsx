import { ReactNode } from 'react';
import { Check, ChevronRight, ClipboardCheck, Flag } from 'lucide-react';
import Misuratore from './Misuratore';
import type { Livello, Stima } from './stima';
import { playTapSound } from '../../lib/audio';

/** Il misuratore del concept 14: percentuale, etichetta colorata e riga grigia. Senza stima (stima = null) l'arco è vuoto e non c'è nessun numero. */
export function StimaSezione({ stima, livello, onInfo }: { stima: Stima | null; livello: Livello; onInfo?: () => void }) {
  return (
    <section aria-label="Probabilità stimata di superare il test">
      <Misuratore percento={stima ? stima.p * 100 : null} livello={livello}
        etichetta="Probabilità stimata di superare" sotto="il test OFA di inglese" onInfo={onInfo} />
    </section>
  );
}

export type ChiaveBanner = 'nuovo' | 'partenza' | 'margine' | 'soglia' | 'strada';

const BANNER: Record<ChiaveBanner, { titolo: string; testo: string; fascia: Livello | null }> = {
  nuovo: { titolo: 'Fai il diagnostico gratuito', testo: '10 domande, 3 minuti: scopri da dove partire.', fascia: null },
  partenza: { titolo: 'Parti da qui', testo: 'Poche domande al giorno: la stima sale con la pratica.', fascia: 'basso' },
  margine: { titolo: 'Hai ancora margine', testo: 'Ripassa gli argomenti più deboli e fai una simulazione.', fascia: 'basso' },
  soglia: { titolo: 'Sei vicino alla soglia', testo: 'Continua a studiare, poi una simulazione ti dice se ci sei.', fascia: 'medio' },
  strada: { titolo: 'Sei sulla strada giusta', testo: 'Una simulazione ti dice se sei pronto davvero.', fascia: 'alto' },
};

/** "Parti da qui" solo a chi ha fatto il diagnostico e basta (sotto il 20 %); dopo le simulazioni "Hai ancora margine". Il testo sta sempre accanto al colore. */
export function chiaveBanner(stima: Stima | null, livello: Livello): ChiaveBanner {
  if (!stima) return 'nuovo';
  return livello === 'alto' ? 'strada' : livello === 'medio' ? 'soglia' : stima.fonte === 'diagnostico' && stima.p < 0.2 ? 'partenza' : 'margine';
}

function IconaBanner({ chiave }: { chiave: ChiaveBanner }) {
  const f = BANNER[chiave].fascia;
  if (f === 'medio') {
    // tessera bianca con tre barre, come nel foglio dei tre stati
    return (
      <span className="w-[36px] h-[36px] rounded-[8px] bg-superficie flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(245,158,11,0.25)] dark:shadow-none" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="11" width="4.2" height="7" rx="1.4" fill="#FFC04D" /><rect x="8" y="7" width="4.2" height="11" rx="1.4" fill="#FFAE2C" /><rect x="14" y="2.5" width="4.2" height="15.5" rx="1.4" fill="#F99B0F" /></svg>
      </span>
    );
  }
  const colore = f ? `var(--color-${f})` : 'var(--color-azione)';
  return (
    <span className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0 text-superficie shadow-[0_1px_3px_rgba(15,23,42,0.18)] dark:shadow-none" style={{ background: colore }} aria-hidden="true">
      {f === 'alto' ? <Check size={22} strokeWidth={3} /> : f === 'basso' ? <Flag size={20} strokeWidth={2.4} fill="currentColor" /> : <ClipboardCheck size={22} strokeWidth={2.2} />}
    </span>
  );
}

/** Banner di stato a tutta larghezza, tinta chiara: icona tonda piena, titolo, frase, freccia. Un tocco porta alla pratica o alla simulazione. */
export function BannerStato({ chiave, onClick }: { chiave: ChiaveBanner; onClick: () => void }) {
  const m = BANNER[chiave];
  const fascia = m.fascia;
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full min-h-[80px] flex items-center gap-[20px] rounded-[12px] pl-[14px] pr-[6px] py-[10px] text-left shadow-[0_1px_4px_rgba(15,23,42,0.05)] dark:shadow-[inset_0_0_0_1px_var(--anello)]"
      style={{ background: fascia ? `var(--color-${fascia}-tinta)` : 'var(--color-superficie-2)', ['--anello' as string]: `color-mix(in srgb, ${fascia ? `var(--color-${fascia})` : 'var(--color-azione)'} 40%, transparent)` }}>
      <IconaBanner chiave={chiave} />
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] font-semibold leading-[20px] text-testo">{m.titolo}</span>
        <span className="block text-[13.5px] leading-[20px] text-testo-tenue">{m.testo}</span>
      </span>
      <ChevronRight size={22} strokeWidth={2.2} className="shrink-0" style={{ color: fascia ? `var(--color-${fascia})` : 'var(--color-azione)' }} aria-hidden="true" />
    </button>
  );
}

/** Titolo di sezione del concept: grassetto, con un elemento a destra (link o niente). */
export function TitoloSezione({ children, destra, id }: { children: ReactNode; destra?: ReactNode; id?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{children}</h2>
      {destra}
    </div>
  );
}
