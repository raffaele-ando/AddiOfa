import { useEffect, useRef } from 'react';
import { Icona } from '../brand/icone/Icona';
import type { LegalSection } from '../types';
import { Screen, TopBar } from '../components/ui';
import { cn } from '../lib/utils';
import { LEGAL_DOCS, LEGAL_TABS } from '../legal';
import { ICONE_LEGALI } from './Footer';

const MISURA = 'mx-auto w-full max-w-[65ch]';
const TESTO = 'text-[15px] leading-[1.7] text-testo';

export default function Legal({ section, onBack, onSection }: {
  section: LegalSection;
  onBack: () => void;
  onSection: (s: LegalSection) => void;
}) {
  const doc = LEGAL_DOCS[section];
  const cima = useRef<HTMLDivElement>(null);

  // Cambiando scheda si riparte dall'alto
  useEffect(() => {
    cima.current?.scrollIntoView({ block: 'start' });
  }, [section]);

  const vai = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ block: 'start' });

  const sid = (i: number) => `${section}-s${i}`;

  return (
    <Screen>
      <TopBar onBack={onBack} />
      <div ref={cima} className="-mt-2" />
      <div className={cn(MISURA, 'flex flex-col gap-4 pb-6')}>
        <div role="tablist" aria-label="Documenti legali" className="grid grid-cols-3 gap-1 rounded-xl bg-superficie-2 p-1">
          {LEGAL_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={t.id === section}
              aria-controls="legal-pannello"
              onClick={() => onSection(t.id)}
              className={cn(
                'flex min-h-[52px] flex-col items-center justify-center rounded-lg px-1 py-2 text-[13px] font-bold transition-colors duration-100',
                t.id === section
                  ? 'bg-superficie text-testo shadow-sm dark:shadow-none'
                  : 'text-testo-tenue hover:text-testo'
              )}
            >
              <Icona nome={ICONE_LEGALI[t.id]} size={20} className="mb-0.5" />
              {t.label}
            </button>
          ))}
        </div>

        <article id="legal-pannello" data-testo-ok role="tabpanel" aria-labelledby={`tab-${section}`} className="flex flex-col gap-3">
          <h1 className="text-2xl font-extrabold leading-tight text-testo">{doc.titolo}</h1>
          <p className="text-[13px] text-testo-tenue">Aggiornato il {doc.aggiornato}</p>

          <nav aria-label="Indice della pagina" className="rounded-xl bg-superficie-2">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-3 text-sm font-bold text-testo [&::-webkit-details-marker]:hidden">
                <h2 className="flex items-center gap-2 text-sm font-bold"><Icona nome="indice" size={18} />Indice <span className="font-normal text-testo-tenue">{doc.sezioni.length}</span></h2>
                <Icona nome="espandi" size={20} className="shrink-0 text-testo-tenue group-open:rotate-180" />
              </summary>
              <ol className="space-y-0.5 px-3 pb-3 text-sm">
                {doc.sezioni.map((s, i) => (
                  <li key={sid(i)}>
                    <button
                      type="button"
                      onClick={() => vai(sid(i))}
                      className="w-full py-1.5 text-left font-semibold text-azione-testo hover:underline underline-offset-2"
                    >
                      {i + 1}. {s.titolo}
                    </button>
                  </li>
                ))}
              </ol>
            </details>
          </nav>

          {doc.sezioni.map((s, i) => (
            <section key={sid(i)} id={sid(i)} className="scroll-mt-4 border-t border-linea pt-5 mt-2">
              <h2 className="text-[17px] font-extrabold leading-snug text-testo">
                <span className="mr-1.5 text-azione-testo tabular-nums">{i + 1}.</span>{s.titolo}
              </h2>
              {s.paragrafi.map((p, j) => (
                <p key={j} className={cn(TESTO, 'mt-2')}>{p}</p>
              ))}
              {s.elenco && (
                <ul className={cn(TESTO, 'mt-2 list-disc space-y-1.5 pl-5 marker:text-testo-tenue')}>
                  {s.elenco.map((e, j) => <li key={j}>{e}</li>)}
                </ul>
              )}
            </section>
          ))}
        </article>
      </div>
    </Screen>
  );
}
