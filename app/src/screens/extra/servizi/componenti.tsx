// Mattoncini condivisi dalle schermate dei servizi: stessa impostazione di Lezioni (intestazione, carte superficie-2, token di tema).
import { ReactNode, useEffect, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { FONT } from '../../../brand/tokens';
import { Illustrazione } from '../../../brand/Illustrazione';
import type { KitId } from '../../../brand/risorse';
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

/** Illustrazione del Brand Kit (blu di default: `illustrazioni`, `stati` o `sfere`; `kit="kit-luminoso"` per le testate da 160 px in su).
 *  La variante chiara o scura la sceglie il CSS: non si passa il tema. Decorativa: alt vuoto. */
export function Disegno({ nome, lato = 140, kit = 'kit-blu', className }: { nome: string; lato?: number; kit?: KitId; className?: string }) {
  return (
    <span className={cn('inline-block max-w-full', className)} style={{ width: lato, lineHeight: 0 }} aria-hidden="true">
      <Illustrazione kit={kit} nome={nome} lato={lato} />
    </span>
  );
}

import { Carta, Pagina as PaginaBase, Sezione as SezioneBase, TONI, type Tono } from '../ui';
export { Carta };
/** Pagina dei servizi: la pagina comune a fondo velato; la freccia torna alla schermata precedente (o a `indietroA`). `destra` è un comando piccolo (la «i»); `piede` il pulsante fisso. */
export function Pagina({ titolo, sottotitolo, children, indietroA, destra, piede }: {
  titolo: string; sottotitolo?: ReactNode; children: ReactNode; indietroA?: () => void; destra?: ReactNode; piede?: ReactNode;
}) {
  const { indietro } = useExtra();
  return <PaginaBase velata titolo={titolo} sottotitolo={sottotitolo} onBack={indietroA ?? indietro} destra={destra} piede={piede}>{children}</PaginaBase>;
}

/** Sezione con titolo (h2 17/700), per tenere i titoli in ordine per chi usa lo screen reader. */
export function Sezione({ id, titolo, children, className }: { id: string; titolo: string; children: ReactNode; className?: string }) {
  return <SezioneBase id={id} titolo={titolo} className={className}>{children}</SezioneBase>;
}

/** Nota informativa: icona e testo, tinta del tono (neutro, azione, attenzione = ambra, riuscito = verde, rischio = corallo). Mai solo colore: il testo dice tutto.
 *  In scuro la nota ha la superficie con un bordo nel colore del tono, non un fondo colorato. */
export function Nota({ children, tono = 'neutro', className }: { children: ReactNode; tono?: 'neutro' | 'azione' | 'attenzione' | 'riuscito' | 'rischio'; className?: string }) {
  const tinta = tono === 'azione' ? 'bg-azione-tinta border-azione/25 dark:bg-superficie dark:border-azione/45'
    : tono === 'attenzione' ? 'bg-medio-tinta border-medio/40 dark:bg-superficie dark:border-medio/45'
    : tono === 'riuscito' ? 'bg-alto-tinta border-alto/30 dark:bg-superficie dark:border-alto/45'
    : tono === 'rischio' ? 'bg-basso-tinta border-basso/30 dark:bg-superficie dark:border-basso/45'
    : 'bg-superficie border-linea shadow-sm dark:shadow-none';
  const icona = tono === 'azione' ? 'text-azione-testo' : tono === 'attenzione' ? 'text-medio-numero' : tono === 'riuscito' ? 'text-alto-numero' : tono === 'rischio' ? 'text-basso-numero' : 'text-testo-tenue';
  return (
    <div role="note" className={cn('flex gap-2.5 rounded-[16px] border p-4 text-[14px] leading-[20px] text-testo', tinta, className)}>
      <Icona nome="info" size={20} className={cn('mt-[1px] shrink-0', icona)} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Pillola di stato (12/600): `neutro` per le informazioni senza significato di stato; un tono solo quando dice davvero qualcosa (ambra = «Non attivo»). */
export function Etichetta({ tono = 'neutro', children, className }: { tono?: Tono | 'neutro'; children: ReactNode; className?: string }) {
  const stile = tono === 'neutro' ? 'bg-superficie-2 text-testo-tenue' : `${TONI[tono].tinta} ${TONI[tono].testo}`;
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-[3px] text-[12px] leading-[16px] font-semibold', stile, className)}>{children}</span>;
}

/** Pulsante principale: blu pieno, 52 px, a tutta larghezza, sempre con un verbo scritto (l'icona è facoltativa, a sinistra). */
export function BottoneAzione({ children, onClick, disabled, className, icona }: {
  children: ReactNode; onClick: () => void; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile w-full min-h-[52px] rounded-[14px] bg-azione px-4 py-3 text-[16px] font-bold text-azione-su flex items-center justify-center gap-2 disabled:opacity-45 disabled:pointer-events-none', className)}>
      {icona}{children}
    </button>
  );
}

/** Pulsante secondario: stessa altezza e forma, superficie con bordo e testo scuro. */
export function BottoneSecondario({ children, onClick, disabled, className, icona }: {
  children: ReactNode; onClick: () => void; disabled?: boolean; className?: string; icona?: ReactNode;
}) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile w-full min-h-[52px] rounded-[14px] border border-tacca bg-superficie px-4 py-3 text-[16px] font-bold text-testo flex items-center justify-center gap-2 disabled:opacity-45 disabled:pointer-events-none', className)}>
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

/** Stato vuoto dentro una pagina (elenco senza voci, funzione senza dati): UN solo modo di dirlo, dappertutto.
 *  Illustrazione dell'area a 96 px (mai una faccia triste), titolo 20/700 senza punto, UNA riga di causa sempre visibile, azioni con un verbo.
 *  `compatto` = dentro una card, senza illustrazione: una riga di testo e, se serve, l'azione. */
export function Vuoto({ illustrazione, titolo, causa, azioni, compatto, className }: {
  illustrazione?: string; titolo: string; causa?: string; azioni?: ReactNode; compatto?: boolean; className?: string;
}) {
  return (
    <div role="status" className={cn('flex flex-col items-center text-center', compatto ? 'py-2' : 'py-6', className)}>
      {!compatto && illustrazione && <Disegno nome={illustrazione} lato={96} />}
      <h2 className={cn('text-[20px] leading-[26px] font-bold text-testo', !compatto && illustrazione && 'mt-4')}>{titolo}</h2>
      {causa && <p data-testo-ok className="mt-1.5 max-w-[32ch] text-[15px] leading-[21px] text-testo-tenue">{causa}</p>}
      {azioni && <div className="mt-5 flex w-full flex-col gap-2.5">{azioni}</div>}
    </div>
  );
}
