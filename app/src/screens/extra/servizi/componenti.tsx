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

import { Pagina as PaginaBase, TONI, type Tono } from '../ui';
/** Pagina dei servizi: la pagina comune; la freccia torna alla schermata precedente (o a `indietroA`). `figura` non si disegna più (niente icone decorative). */
export function Pagina({ titolo, sottotitolo, children, indietroA }: {
  titolo: string; sottotitolo?: string; figura?: ReactNode; children: ReactNode; indietroA?: () => void;
}) {
  const { indietro } = useExtra();
  return <PaginaBase titolo={titolo} sottotitolo={sottotitolo} onBack={indietroA ?? indietro}>{children}</PaginaBase>;
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

/** Nota informativa: icona e testo, tinta del tono (neutro, azione, attenzione = ambra, riuscito = verde, rischio = corallo). Mai solo colore: il testo dice tutto. */
export function Nota({ children, tono = 'neutro', className }: { children: ReactNode; tono?: 'neutro' | 'azione' | 'attenzione' | 'riuscito' | 'rischio'; className?: string }) {
  const tinta = tono === 'azione' ? 'bg-azione-tinta text-testo' : tono === 'attenzione' ? 'bg-medio-tinta text-testo' : tono === 'riuscito' ? 'bg-alto-tinta text-testo' : tono === 'rischio' ? 'bg-basso-tinta text-testo' : 'bg-superficie-2 text-testo';
  const icona = tono === 'azione' ? 'text-azione' : tono === 'attenzione' ? 'text-medio-numero' : tono === 'riuscito' ? 'text-alto-numero' : tono === 'rischio' ? 'text-basso-numero' : 'text-testo-tenue';
  return (
    <div role="note" className={cn('flex gap-2.5 rounded-[12px] p-3.5 text-[13.5px] leading-[20px]', tinta, className)}>
      <Info size={18} className={cn('mt-[1px] shrink-0', icona)} aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Etichetta piccola (pillola) nel tono scelto; `neutro` per le informazioni senza significato di stato. */
export function Etichetta({ tono = 'neutro', children, className }: { tono?: Tono | 'neutro'; children: ReactNode; className?: string }) {
  const stile = tono === 'neutro' ? 'bg-superficie text-testo-tenue' : `${TONI[tono].tinta} ${TONI[tono].testo}`;
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11.5px] leading-[16px] font-bold', stile, className)}>{children}</span>;
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
