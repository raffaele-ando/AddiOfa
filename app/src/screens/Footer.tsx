import type { LegalSection } from '../types';
import { AVVERTENZA_INDIPENDENZA, LEGAL_TABS } from '../legal';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { InfoFoglio } from './landing/comune';

/** Icona di ogni documento legale: la stessa nell'indice delle pagine legali, nelle Impostazioni e nel piè di pagina. */
export const ICONE_LEGALI: Record<LegalSection, NomeIcona> = {
  termini: 'documento',
  privacy: 'privacy',
  cookie: 'cookie',
};

// Piè di pagina: i documenti legali come icona + parola e l'avvertenza di indipendenza (testo legale, esente dal controllo del testo).
export default function Footer({ onOpenLegal }: { onOpenLegal: (s: LegalSection) => void }) {
  return (
    <footer className="shrink-0 pt-2 text-center">
      <nav aria-label="Informazioni legali" className="flex flex-wrap items-center justify-center gap-x-1 text-xs font-semibold text-testo-tenue">
        {LEGAL_TABS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onOpenLegal(t.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 hover:text-testo hover:underline underline-offset-2"
          >
            <Icona nome={ICONE_LEGALI[t.id]} size={15} />{t.label}
          </button>
        ))}
      </nav>
      <p data-testo-ok className="mx-auto max-w-[52ch] text-[11px] leading-snug text-testo-tenue">{AVVERTENZA_INDIPENDENZA}</p>
    </footer>
  );
}

/** Avvertenza di indipendenza dietro la «i»: per le schermate a tutta pagina dove il piè di pagina non c'è. */
export function InfoIndipendenza() {
  return (
    <InfoFoglio titolo="Progetto indipendente" etichetta="Progetto indipendente">
      <p data-testo-ok>{AVVERTENZA_INDIPENDENZA}</p>
    </InfoFoglio>
  );
}
