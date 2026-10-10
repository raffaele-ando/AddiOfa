import { Fragment } from 'react';
import type { LegalSection } from '../types';
import { DISCLAIMER } from '../config/offer';
import { LEGAL_TABS } from '../legal';

// Riga piccola in fondo alle pagine: link ai testi legali e avviso di indipendenza.
export default function Footer({ onOpenLegal }: { onOpenLegal: (s: LegalSection) => void }) {
  return (
    <footer className="shrink-0 pt-2 text-center">
      <nav aria-label="Informazioni legali" className="flex flex-wrap items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
        {LEGAL_TABS.map((t, i) => (
          <Fragment key={t.id}>
            {i > 0 && <span aria-hidden className="text-gray-300 dark:text-[#475569]">·</span>}
            <button
              type="button"
              onClick={() => onOpenLegal(t.id)}
              className="px-2.5 py-2 underline-offset-2 hover:underline hover:text-gray-700 dark:hover:text-gray-200"
            >
              {t.label}
            </button>
          </Fragment>
        ))}
      </nav>
      <p className="mx-auto max-w-[44ch] text-[11px] leading-snug text-gray-500 dark:text-gray-400">{DISCLAIMER}</p>
    </footer>
  );
}
