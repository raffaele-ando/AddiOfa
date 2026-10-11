import { ChevronRight } from 'lucide-react';
import { Carta, Barra, coloreValore } from './comune';
import type { Fattore } from './stima';
import { playTapSound } from '../../lib/audio';

function Riga({ f, icona, onVai, piccolo }: { f: Fattore; icona?: React.ReactNode; onVai?: (filtro: string) => void; piccolo?: boolean }) {
  const dato = f.percento !== null;
  const corpo = (
    <>
      <span className="flex items-center justify-between gap-1.5">
        <span className="flex items-center gap-1.5 min-w-0 text-[14px] font-semibold text-testo">
          {icona && <span className="text-azione shrink-0" aria-hidden="true">{icona}</span>}
          <span className="truncate">{f.nome}</span>
        </span>
        <span className={`text-[13px] tabular-nums shrink-0 ${dato ? 'font-bold text-testo' : 'text-testo-tenue'}`}>{dato ? `${f.percento}%` : '\u2013'}</span>
      </span>
      <span className="block mt-2"><Barra valore={dato ? f.percento! : 0} colore={dato ? coloreValore(f.percento!) : 'transparent'} alta={piccolo ? 6 : 7} /></span>
      <span className="flex items-center justify-between text-[11px] leading-tight text-testo-tenue mt-1.5">
        <span className="truncate">{dato ? `${f.risposte} risposte` : 'Poche risposte'}</span>
        {onVai && <ChevronRight size={14} className="shrink-0 text-testo-tenue" aria-hidden="true" />}
      </span>
    </>
  );
  const classe = 'block rounded-[10px] bg-superficie px-3 py-2.5 text-left w-full min-w-0';
  return onVai
    ? <button type="button" onClick={() => { playTapSound(); onVai(f.filtro); }} className={`brand-premibile ${classe}`} aria-label={`Allenati su ${f.nome}`}>{corpo}</button>
    : <div className={classe}>{corpo}</div>;
}

/** Aree reali dell'app: categoria (Grammatica, Traduzione) e livello (A1, A2, B1). */
export default function Fattori({ categorie, livelli, onVai }: { categorie: Fattore[]; livelli: Fattore[]; onVai?: (filtro: string) => void }) {
  return (
    <Carta className="p-3.5">
      <h2 className="text-[15.5px] font-bold text-testo leading-tight">Dove sei più solido</h2>
      <p className="text-[12.5px] text-testo-tenue mt-0.5 mb-3">Accuratezza sulle domande a cui hai risposto. Sotto 5 risposte non mostriamo la percentuale.</p>
      <div className="grid grid-cols-2 gap-2">
        {categorie.map(f => <Riga key={f.id} f={f} onVai={onVai} />)}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {livelli.map(f => <Riga key={f.id} f={f} onVai={onVai} piccolo />)}
      </div>
    </Carta>
  );
}
