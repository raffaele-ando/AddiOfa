import { ReactNode } from 'react';
import { ArrowRight, Lock } from 'lucide-react';
import { playTapSound } from '../../lib/audio';

/** Pulsante d'azione a tutta larghezza: gradiente blu, cerchio bianco con "play", testo, freccia (concept 14). */
export default function Cta({ onClick, children, bloccato, icona }: {
  onClick: () => void; children: ReactNode; bloccato?: boolean; icona?: ReactNode;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full h-[60px] flex items-center gap-[25px] rounded-[13px] pl-[12px] pr-[12px] text-left text-azione-su shadow-[0_2px_8px_rgba(37,99,235,0.24)] dark:shadow-none"
      style={{ background: 'linear-gradient(90deg, var(--color-azione-da), var(--color-azione-a))' }}>
      <span className="w-[37px] h-[37px] rounded-full bg-white flex items-center justify-center shrink-0 text-azione-a">
        {icona ?? <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a.8.8 0 0 0 1.2.7l11-6.8a.8.8 0 0 0 0-1.4L9.2 4.5A.8.8 0 0 0 8 5.2z" fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" /></svg>}
      </span>
      <span className="flex-1 min-w-0 text-[16px] font-semibold leading-tight">{children}</span>
      {bloccato ? <Lock size={20} className="shrink-0" aria-label="Richiede il Pass" /> : <ArrowRight size={24} strokeWidth={1.7} className="shrink-0" aria-hidden="true" />}
    </button>
  );
}
