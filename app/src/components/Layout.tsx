import { ReactNode, useEffect } from 'react';

/**
 * Guscio dell'app: UNA colonna centrata a tutta altezza, senza cornice finta (niente riquadro arrotondato, niente margine attorno).
 * Larghezza = `--colonna` (480 px; vedi index.css). Sotto i 640 px la colonna è tutta la finestra. Da 640 px il fondo pagina (`fondo`) fa risaltare
 * la colonna (`superficie`) con due fili laterali; nei due temi i colori seguono i token.
 * La barra in basso (Navigazione) sta dentro la colonna, quindi ha la sua stessa larghezza.
 *
 * Colonna larga (per una Home a due colonne): da 1024 px la colonna passa a 960 px (`--colonna`).
 *   - dentro un componente: `useColonnaLarga()` (si attiva al montaggio e si spegne allo smontaggio);
 *   - oppure `<Layout larga>`.
 *   Sotto i 1024 px non cambia nulla. Dentro la colonna larga si può usare la variante `lg:` di Tailwind (es. `lg:grid-cols-2`).
 *
 * Compatibilità: le schermate che hanno ancora la loro cornice (`sm:rounded-[28px] sm:border`, `sm:rounded-[32px]`, `sm:max-h-[calc(100dvh-3rem)]`)
 * la perdono da qui con le regole `.guscio-colonna` di index.css, senza toccare i loro file. La landing è un livello fisso (`fixed inset-0`) e non dipende dal guscio.
 */
export function useColonnaLarga(attiva = true) {
  useEffect(() => {
    if (!attiva) return;
    const el = document.documentElement;
    el.dataset.colonna = 'larga';
    return () => { delete el.dataset.colonna; };
  }, [attiva]);
}

export function Layout({ children, larga = false }: { children: ReactNode; larga?: boolean }) {
  useColonnaLarga(larga);
  return (
    <div className="h-[100dvh] w-full bg-fondo text-testo font-['Inter',sans-serif] selection:bg-azione-tinta transition-colors duration-100 overflow-hidden flex flex-col">
      <div className="guscio-colonna w-full max-w-[var(--colonna)] mx-auto flex-1 min-h-0 flex flex-col relative bg-superficie sm:border-x sm:border-linea">
        {children}
      </div>
    </div>
  );
}
