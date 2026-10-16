import { ReactNode } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';

/** Pulsante d'azione a tutta larghezza: gradiente blu, cerchio bianco con ▶, parola, freccia (concept 14). */
export default function Cta({ onClick, children }: {
  onClick: () => void; children: ReactNode;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full h-[60px] flex items-center gap-[25px] rounded-[13px] pl-[12px] pr-[12px] text-left text-azione-su shadow-[0_2px_8px_rgba(37,99,235,0.24)] dark:shadow-none"
      style={{ background: 'linear-gradient(90deg, var(--color-azione-da), var(--color-azione-a))' }}>
      <span className="w-[37px] h-[37px] rounded-full bg-white flex items-center justify-center shrink-0 text-azione-a">
        <Icona nome="studia" size={22} />
      </span>
      <span className="flex-1 min-w-0 text-[17px] font-semibold leading-tight">{children}</span>
      <Icona nome="avanti" size={26} className="shrink-0" />
    </button>
  );
}
