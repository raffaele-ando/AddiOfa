import { ReactNode } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { playTapSound } from '../../lib/audio';

/** Pulsante d'azione rosso (colore d'azione del kit) con cerchio bianco e freccia, come nel design. */
export default function Cta({ onClick, children, sotto, bloccato, compatto, icona }: {
  onClick: () => void; children: ReactNode; sotto?: ReactNode; bloccato?: boolean; compatto?: boolean; icona?: ReactNode;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className={`brand-premibile w-full flex items-center gap-3 rounded-2xl bg-[#EF4444] text-white text-left shadow-[0_6px_16px_rgba(239,68,68,0.26)] ${compatto ? 'px-3 py-2.5' : 'px-4 py-3.5'}`}>
      <span className={`${compatto ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-white flex items-center justify-center shrink-0`}>
        {icona ?? <svg width="14" height="16" viewBox="0 0 16 18" aria-hidden="true"><path d="M2 1.5 14 9 2 16.5Z" fill="#EF4444" /></svg>}
      </span>
      <span className="flex-1 min-w-0">
        <span className={`block font-bold ${compatto ? 'text-[15px]' : 'text-[17px]'} leading-tight`}>{children}</span>
        {sotto && <span className="block text-[12.5px] text-white/85 leading-tight mt-0.5">{sotto}</span>}
      </span>
      {bloccato ? <Lock size={18} className="shrink-0" aria-label="Richiede il Pass" /> : <ArrowRight size={20} className="shrink-0" aria-hidden="true" />}
    </button>
  );
}
