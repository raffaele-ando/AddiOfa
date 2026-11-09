import { ReactNode } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';

/**
 * Il prossimo passo: la card dominante della Home (concept 14, 01). Superficie piena in tinta d'azione (`bg-azione`, testo `text-azione-su`: bianco
 * su blu in chiaro, 5,2:1; scuro su azzurro, 6,3:1), raggio 16 (superficie grande), niente gradiente e niente ombra. Cerchio con ▶, verbo + oggetto
 * (in grande) e, sotto, una riga che dice cosa succede. È l'unico elemento pieno della Home: il resto sta su superfici chiare con bordo leggero.
 */
export default function Cta({ onClick, children, sotto }: {
  onClick: () => void; children: ReactNode; sotto?: ReactNode;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full min-h-[76px] flex items-center gap-4 rounded-2xl pl-4 pr-4 py-4 text-left bg-azione text-azione-su">
      <span className="w-[44px] h-[44px] rounded-full bg-azione-su text-azione flex items-center justify-center shrink-0">
        <Icona nome="studia" size={22} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-s4 leading-[28px] font-extrabold tracking-[-0.01em]">{children}</span>
        {sotto && <span className="mt-0.5 block text-s2 leading-[19px]">{sotto}</span>}
      </span>
      <Icona nome="avanti" size={24} className="shrink-0" />
    </button>
  );
}
