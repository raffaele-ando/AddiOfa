import { ReactNode } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { playTapSound } from '../../lib/audio';

/**
 * Pulsante d'azione a tutta larghezza (concept 14, 01): gradiente blu, cerchio con ▶, verbo + oggetto e, sotto, una riga piccola che dice cosa succede.
 * Il testo parte a 68 px dal bordo, come il testo della fascia di stato (14 + 38 + 16: stessa colonna). In scuro il gradiente è un gradino più scuro
 * (il testo resta scuro: il bianco sull'azzurro chiaro non arriva a 4,5:1).
 */
export default function Cta({ onClick, children, sotto }: {
  onClick: () => void; children: ReactNode; sotto?: ReactNode;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onClick(); }}
      className="brand-premibile w-full min-h-[64px] flex items-center gap-4 rounded-[14px] pl-[14px] pr-[12px] py-[13px] text-left text-azione-su shadow-[0_2px_8px_rgba(37,99,235,0.24)] dark:shadow-none bg-[linear-gradient(90deg,var(--color-azione-da),var(--color-azione-a))] dark:bg-[linear-gradient(90deg,var(--color-azione),var(--color-azione-a))]">
      <span className="w-[38px] h-[38px] rounded-full bg-white dark:bg-azione-su flex items-center justify-center shrink-0 text-azione-a dark:text-azione">
        <Icona nome="studia" size={22} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[17px] font-semibold leading-[22px]">{children}</span>
        {sotto && <span className="block text-[12.5px] leading-[16px]">{sotto}</span>}
      </span>
      <Icona nome="avanti" size={26} className="shrink-0" />
    </button>
  );
}
