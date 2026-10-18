import type { LegalSection } from '../../types';
import { AVVERTENZA_INDIPENDENZA, LEGAL_TABS } from '../../legal';
import { Icona } from '../../brand/icone/Icona';
import Marchio from '../../brand/Marchio';
import { ICONE_LEGALI } from '../Footer';
import { Colonna, FOCUS } from './comune';
import { cn } from '../../lib/utils';

// Piè di pagina della landing: filetto in cima (niente cucitura), marchio a sinistra e documenti a destra da 1024 px, avvertenza di indipendenza a 13 px.
// Il Footer comune (screens/Footer.tsx) resta quello delle altre schermate.
export default function PiePagina({ onOpenLegal }: { onOpenLegal: (s: LegalSection) => void }) {
  return (
    <footer className="border-t border-linea">
      <Colonna className="flex flex-col items-center gap-3 py-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <div className="flex flex-col items-center gap-2 lg:items-start">
          <Marchio disposizione="orizzontale" altezza={24} />
          <p data-testo-ok className="max-w-[52ch] text-[13px] leading-snug text-testo-tenue">{AVVERTENZA_INDIPENDENZA}</p>
        </div>
        <nav aria-label="Informazioni legali" className="flex flex-wrap items-center justify-center gap-x-1">
          {LEGAL_TABS.map(t => (
            <button key={t.id} type="button" onClick={() => onOpenLegal(t.id)}
              className={cn('inline-flex min-h-11 items-center gap-1.5 rounded px-2.5 text-[13px] font-semibold text-testo-tenue hover:text-testo hover:underline underline-offset-2', FOCUS)}>
              <Icona nome={ICONE_LEGALI[t.id]} size={15} />{t.label}
            </button>
          ))}
        </nav>
      </Colonna>
    </footer>
  );
}
