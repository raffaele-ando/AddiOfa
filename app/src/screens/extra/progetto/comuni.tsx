// Mattoncini comuni delle schermate di Project (Esplora, Project ID, ATLAS, NOI, Agorà): pagina, testata con illustrazione, righe, interruttore.
import type { ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { TONI, type Tono } from '../ui';

export { Pagina, Sezione, Nota, Etichetta, BottoneAzione, BottoneSecondario, copiaTesto } from '../servizi/componenti';

/** Illustrazione di testata della pagina (illustrazioni piane del kit blu o luminoso, senza sfondi tondi). */
export function Testata({ nome, kit = 'kit-blu', lato = 96, className }: { nome: string; kit?: 'kit-blu' | 'kit-luminoso'; lato?: number; className?: string }) {
  return (
    <div className={cn('mt-3 flex justify-center', className)}>
      <Illustrazione kit={kit} nome={nome} lato={lato} />
    </div>
  );
}

/** Interruttore con i token del tema (spento di partenza). */
export function Interruttore({ acceso, onChange, etichetta, disabled }: { acceso: boolean; onChange: (v: boolean) => void; etichetta: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={acceso} aria-label={etichetta} disabled={disabled}
      onClick={() => { playTapSound(); onChange(!acceso); }}
      className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors duration-100 disabled:opacity-50', acceso ? 'bg-azione' : 'bg-tacca')}>
      <span className={cn('absolute left-1 top-1 h-5 w-5 rounded-full bg-superficie shadow', acceso && 'translate-x-5')} />
    </button>
  );
}

/** Una riga di dato: etichetta piccola sopra, valore sotto. `valore` può essere un nodo (per le etichette di stato). */
export function RigaDato({ icona, etichetta, valore, tono = 'azione' }: { icona?: NomeIcona; etichetta: string; valore: ReactNode; tono?: Tono }) {
  return (
    <li className="flex items-start gap-3 px-3.5 py-3">
      {icona && <span aria-hidden="true" className={cn('mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full', TONI[tono].tinta, TONI[tono].icona)}><Icona nome={icona} size={17} /></span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] leading-[16px] font-bold text-testo-tenue">{etichetta}</span>
        <span data-testo-ok className="block break-words text-[15px] leading-[21px] font-semibold text-testo">{valore}</span>
      </span>
    </li>
  );
}

/** Pulsante di riga con icona a sinistra (esporta, scollega, elimina...). */
export function BottoneRiga({ icona, children, onClick, tono = 'neutro', disabled }: { icona: NomeIcona; children: ReactNode; onClick: () => void; tono?: 'neutro' | 'rischio'; disabled?: boolean }) {
  return (
    <button type="button" disabled={disabled} onClick={() => { playTapSound(); onClick(); }}
      className={cn('brand-premibile flex w-full items-center gap-3 rounded-[13px] px-3.5 py-3.5 text-left text-[15px] font-bold disabled:opacity-40 disabled:pointer-events-none',
        tono === 'rischio' ? 'bg-basso-tinta text-basso-testo' : 'bg-superficie-2 text-testo')}>
      <Icona nome={icona} size={20} className={tono === 'rischio' ? '' : 'text-azione-scuro'} />{children}
    </button>
  );
}
