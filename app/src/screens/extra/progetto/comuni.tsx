// Mattoncini comuni delle schermate di Project (Esplora, Project ID, ATLAS, NOI, Agorà): pagina, testata con illustrazione, righe, interruttore.
import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { TONI, type Tono } from '../ui';

import { Etichetta as EtichettaBase } from '../servizi/componenti';
export { Pagina, Sezione, Nota, BottoneAzione, BottoneSecondario, copiaTesto } from '../servizi/componenti';

/** Tono di uno stato: i toni delle fasce più `errore` (rosso: solo per ciò che è andato storto, mai per la fascia «bassa»). */
export type TonoStato = Tono | 'neutro' | 'errore';

/** Pillola di stato: come quella dei servizi, più il tono `errore` (classi `errore*`, con la parola sempre scritta). In scuro il fondo è neutro. */
export function Etichetta({ tono = 'neutro', children, className }: { tono?: TonoStato; children: ReactNode; className?: string }) {
  if (tono !== 'errore') return <EtichettaBase tono={tono} className={cn(tono !== 'neutro' && 'dark:bg-superficie-2', className)}>{children}</EtichettaBase>;
  return <span className={cn('inline-flex items-center gap-1 rounded-full bg-errore-tinta px-2.5 py-[3px] text-[12px] leading-[16px] font-semibold text-errore-testo dark:bg-superficie-2', className)}>{children}</span>;
}

/** Illustrazione di testata: SOLO in Community, NOI e Agorà, centrata, sempre a 72 px (la stessa posizione e dimensione ovunque). */
export function Testata({ nome, kit = 'kit-blu', lato = 72, className }: { nome: string; kit?: 'kit-blu' | 'kit-luminoso'; lato?: number; className?: string }) {
  return (
    <div className={cn('mt-2 flex justify-center', className)}>
      <Illustrazione kit={kit} nome={nome} lato={lato} />
    </div>
  );
}

/** Interruttore con i token del tema (spento di partenza). */
export function Interruttore({ acceso, onChange, etichetta, disabled }: { acceso: boolean; onChange: (v: boolean) => void; etichetta: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={acceso} aria-label={etichetta} disabled={disabled}
      onClick={() => { playTapSound(); onChange(!acceso); }}
      className={cn('relative h-7 w-12 shrink-0 rounded-full border-2 transition-colors duration-100 disabled:opacity-50', acceso ? 'border-azione bg-azione' : 'border-bordo-campo bg-superficie-2')}>
      <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full shadow', acceso ? 'translate-x-5 bg-azione-su' : 'bg-bordo-campo')} />
    </button>
  );
}

/** Una riga di dato (come quelle di Project ID): tessera neutra con l'icona, etichetta 13 px sopra, valore 15/600 sotto. `valore` può essere un nodo (pillole di stato).
 *  Le icone sono tutte neutre: la categoria si legge dall'icona e dall'etichetta, il colore sta solo nelle pillole di stato. */
export function RigaDato({ icona, etichetta, valore }: { icona?: NomeIcona; etichetta: string; valore: ReactNode; tono?: Tono | 'errore' }) {
  return (
    <li className="flex items-start gap-3 px-3.5 py-3">
      {icona && <span aria-hidden="true" className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-superficie-2 text-testo-tenue"><Icona nome={icona} size={22} /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] leading-[18px] font-semibold text-testo-tenue">{etichetta}</span>
        <span data-testo-ok className="block break-words text-[15px] leading-[21px] font-semibold text-testo">{valore}</span>
      </span>
    </li>
  );
}

/** Pulsante di riga con icona a sinistra (esporta, scollega, elimina...). */
export function BottoneRiga({ icona, children, onClick, tono = 'neutro', disabled }: { icona: NomeIcona; children: ReactNode; onClick: () => void; tono?: 'neutro' | 'rischio'; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile flex min-h-[52px] w-full items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left text-[15px] font-bold disabled:opacity-45 disabled:pointer-events-none',
        tono === 'rischio' ? 'border-basso/40 bg-basso-tinta text-basso-testo dark:bg-superficie' : 'border-linea bg-superficie text-testo shadow-sm dark:shadow-none')}>
      <Icona nome={icona} size={20} className={tono === 'rischio' ? '' : 'text-azione-testo'} />{children}
    </button>
  );
}
