import type { LegalSection } from '../types';
import { DISCLAIMER } from '../config/offer';
import { LEGAL_TABS } from '../legal';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { InfoFoglio } from './landing/comune';

/** Icona di ogni documento legale: la stessa nell'indice delle pagine legali e nel piè di pagina. */
export const ICONE_LEGALI: Record<LegalSection, NomeIcona> = {
  termini: 'documento',
  privacy: 'privacy',
  cookie: 'cookie',
  recesso: 'recesso',
};

/** Recesso: regola di legge, resta scritta ma nel piè di pagina legale (esente dal controllo del testo). */
export function NotaRecesso({ onOpenLegal, className }: { onOpenLegal: (s: LegalSection) => void; className?: string }) {
  return (
    <p data-testo-ok className={className ?? 'mx-auto max-w-[52ch] text-[11px] leading-snug text-testo-tenue'}>
      Se compri da consumatore hai 14 giorni per recedere, nei casi previsti dalla legge:{' '}
      <button type="button" onClick={() => onOpenLegal('recesso')} className="rounded font-bold underline underline-offset-2">condizioni di recesso</button>.
    </p>
  );
}

// Piè di pagina: i documenti legali come icona + parola, l'avvertenza di indipendenza e il recesso (testi legali, esenti dal controllo del testo).
export default function Footer({ onOpenLegal, conRecesso = true }: { onOpenLegal: (s: LegalSection) => void; conRecesso?: boolean }) {
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
      <div data-testo-ok className="flex flex-col items-center gap-1.5">
        <p className="mx-auto max-w-[52ch] text-[11px] leading-snug text-testo-tenue">{DISCLAIMER}</p>
        {conRecesso && <NotaRecesso onOpenLegal={onOpenLegal} />}
      </div>
    </footer>
  );
}

/** Avvertenza di indipendenza dietro la «i»: per le schermate a tutta pagina (funnel, Pass, lista d'attesa) dove il piè di pagina non c'è. */
export function InfoIndipendenza() {
  return (
    <InfoFoglio titolo="Progetto indipendente" etichetta="Progetto indipendente">
      <p data-testo-ok>{DISCLAIMER}</p>
    </InfoFoglio>
  );
}
