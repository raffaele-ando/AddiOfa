import { ReactNode, useState } from 'react';
import { X } from 'lucide-react';

/** Banda sottile della versione dimostrativa: si chiude solo per la sessione (niente memoria su disco). */
export function DemoBanner() {
  const [chiuso, setChiuso] = useState(false);
  if (chiuso) return null;
  return (
    <div role="note" className="shrink-0 flex items-start gap-2 bg-[#0E1B3F] dark:bg-superficie-2 text-white dark:text-testo text-[11px] leading-snug px-4 py-1.5">
      <p className="flex-1 min-w-0">Versione dimostrativa: nessun pagamento, i dati restano su questo dispositivo.</p>
      <button type="button" onClick={() => setChiuso(true)} aria-label="Chiudi l'avviso" className="shrink-0 p-0.5 -mr-1 text-white/80 dark:text-testo-tenue hover:text-white dark:hover:text-testo">
        <X size={14} />
      </button>
    </div>
  );
}

export function Layout({ children, banner }: { children: ReactNode; banner?: ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-fondo text-testo font-['Inter',sans-serif] selection:bg-azione-tinta transition-colors duration-100 overflow-hidden sm:overflow-y-auto sm:p-6 flex flex-col">
      {banner}
      <div className="w-full max-w-3xl mx-auto flex-1 min-h-0 sm:flex-none sm:h-[800px] sm:min-h-[800px] sm:my-auto flex flex-col relative">
        {children}
      </div>
    </div>
  );
}
