// Mattoncini condivisi dalle schermate dei servizi: stessa impostazione di Lezioni (intestazione, carte superficie-2, token di tema).
import { ReactNode, useEffect, useState } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import { useExtra } from '../contesto';
import { FONT } from '../../../brand/tokens';
import { urlDisegno } from '../../../brand/risorse';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

/** Tema scuro attivo (classe `dark` sulla radice), con ascolto dei cambi. */
export function useScuro(): boolean {
  const [scuro, setScuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const o = new MutationObserver(() => setScuro(document.documentElement.classList.contains('dark')));
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => o.disconnect();
  }, []);
  return scuro;
}

/** Illustrazione del kit blu, nella variante del tema (la nuvola di sfondo cambia). Decorativa: alt vuoto. */
export function Disegno({ nome, lato = 140, className }: { nome: string; lato?: number; className?: string }) {
  const scuro = useScuro();
  const src = urlDisegno('kit-blu', 'illustrazioni', nome, scuro) ?? urlDisegno('kit-blu', 'illustrazioni', nome);
  if (!src) return null;
  return <img src={src} alt="" draggable={false} width={lato} className={cn('h-auto max-w-full', className)} style={{ width: lato }} />;
}

/** Pagina: colonna centrata, freccia indietro e titolo. Il corpo scorre, la barra in basso la mette l'App. */
export function Pagina({ titolo, sottotitolo, figura, children, indietroA }: {
  titolo: string; sottotitolo?: string; figura?: ReactNode; children: ReactNode; indietroA?: () => void;
}) {
  const { indietro } = useExtra();
  return (
    <div className="h-full w-full bg-superficie text-testo overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(12px,env(safe-area-inset-top))] pb-8">
          <button type="button" onClick={() => { playTapSound(); (indietroA ?? indietro)(); }} aria-label="Indietro"
            className="brand-premibile -ml-2 mb-1 flex h-11 w-11 items-center justify-center rounded-full text-testo-tenue hover:text-testo">
            <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[28px] leading-[36px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
              {sottotitolo && <p className="mt-1 text-[14.5px] leading-[21px] text-testo-tenue">{sottotitolo}</p>}
            </div>
            {figura}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Sezione con titolo (h2), per tenere i titoli in ordine per chi usa lo screen reader. */
export function Sezione({ id, titolo, children, className }: { id: string; titolo: string; children: ReactNode; className?: string }) {
  return (
    <section aria-labelledby={id} className={cn('mt-[24px] flex flex-col gap-[10px]', className)}>
      <h2 id={id} className="text-[15.5px] leading-[20px] font-bold text-testo">{titolo}</h2>
      {children}
    </section>
  );
}

/** Nota informativa: icona e testo, tinta neutra o d'azione. Mai solo colore: il testo dice tutto. */
export function Nota({ children, tono = 'neutro', className }: { children: ReactNode; tono?: 'neutro' | 'azione' | 'attenzione'; className?: string }) {
  const tinta = tono === 'azione' ? 'bg-azione-tinta text-testo' : tono === 'attenzione' ? 'bg-medio-tinta text-testo' : 'bg-superficie-2 text-testo';
  const icona = tono === 'azione' ? 'text-azione' : tono === 'attenzione' ? 'text-medio-testo' : 'text-testo-tenue';
  return (
    <div role="note" className={cn('flex gap-2.5 rounded-[12px] p-3.5 text-[13.5px] leading-[20px]', tinta, className)}>
      <Info size={18} className={cn('mt-[1px] shrink-0', icona)} aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Pulsante principale: blu pieno, a tutta larghezza. */
export function BottoneAzione({ children, onClick, disabled, className, icona }: {
  children: ReactNode; onClick: () => void; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile w-full min-h-[52px] rounded-[13px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none', className)}>
      {icona}{children}
    </button>
  );
}

/** Pulsante secondario: superficie-2 con testo scuro. */
export function BottoneSecondario({ children, onClick, disabled, className, icona }: {
  children: ReactNode; onClick: () => void; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile w-full min-h-[48px] rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none', className)}>
      {icona}{children}
    </button>
  );
}

/** Copia un testo negli appunti; se il browser lo vieta restituisce false e la schermata mostra il testo selezionabile. */
export async function copiaTesto(testo: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(testo);
    return true;
  } catch {
    return false;
  }
}
