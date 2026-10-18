import { useId, useState } from 'react';
import { Icona } from '../../brand/icone/Icona';
import type { LegalSection } from '../../types';
import { DIAGNOSTIC_QUESTIONS, DISCLAIMER, EXAM } from '../../config/offer';
import { questions } from '../../data/questions';
import { ICONE_LEGALI } from '../Footer';
import { FOCUS, Sezione, TitoloSezione } from './comune';
import { cn } from '../../lib/utils';

interface Voce { d: string; r: string; legale?: { sezione: LegalSection; testo: string } }

const VOCI: Voce[] = [
  {
    d: 'Quanto costa?',
    r: `Niente. AddiOFA è gratuita e non serve nessuna password. Trovi tutte le ${questions.length} domande con spiegazione in italiano, la teoria, simulazioni illimitate (${EXAM.questions} domande in ${EXAM.minutes} minuti), il ripasso sugli errori e le statistiche.`,
  },
  {
    d: 'Cos’è il test di livello?',
    r: `Un quiz da ${DIAGNOSTIC_QUESTIONS} domande che stima la probabilità di superare il test. Dopo, il ripasso si adatta ai tuoi errori.`,
  },
  {
    d: 'Il risultato è una garanzia?',
    r: 'No. È una stima calcolata sulle tue risposte: con poche domande è approssimativa e non dice come andrà il test vero. Si affina con le simulazioni.',
  },
  {
    d: 'Dove vengono salvati i miei progressi?',
    r: 'I progressi di studio restano nel tuo browser: dalle Impostazioni li esporti e li importi su un altro dispositivo. All’inizio ti chiediamo la tua email del Politecnico (il nome lo ricaviamo da lì) e che cosa studi: li ricevono Project e ATLAS, che gestiscono questo sito. Niente matricola, niente codice fiscale. Non vendiamo dati; le comunicazioni e la classifica sono consensi facoltativi.',
    legale: { sezione: 'privacy', testo: 'Privacy' },
  },
  {
    d: 'AddiOFA è un servizio del Politecnico di Milano?',
    r: `No. ${DISCLAIMER} Il test lo fai con il Politecnico o con l’ente che scegli, non con noi.`,
  },
];

function Domanda({ voce, aperta, onToggle, onOpenLegal }: { voce: Voce; aperta: boolean; onToggle(): void; onOpenLegal(s: LegalSection): void }) {
  const id = useId();
  return (
    <div className="overflow-hidden rounded-[20px] border border-linea bg-superficie">
      <h3>
        <button
          type="button"
          aria-expanded={aperta}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={onToggle}
          className={cn('flex w-full items-center justify-between gap-4 rounded-[20px] px-5 py-4 text-left text-base font-bold text-testo sm:px-6', FOCUS)}
        >
          <span data-testo-ok>{voce.d}</span>
          <Icona nome="espandi" size={22} className={cn('text-azione', aperta && 'rotate-180')} />
        </button>
      </h3>
      {/* la riga si apre subito; chiusa, il contenuto esce dal giro della tastiera con inert */}
      <div
        id={`${id}-p`}
        role="region"
        aria-labelledby={`${id}-b`}
        inert={!aperta}
        className={cn('grid', aperta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 sm:px-6">
            <p data-testo-ok className="text-[15px] leading-relaxed text-testo">{voce.r}</p>
            {voce.legale && (
              <button type="button" onClick={() => onOpenLegal(voce.legale!.sezione)} className={cn('mt-2 inline-flex min-h-9 items-center gap-1.5 rounded text-[15px] font-bold text-azione-testo underline underline-offset-2', FOCUS)}>
                <Icona nome={ICONE_LEGALI[voce.legale!.sezione]} size={16} />{voce.legale.testo}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq({ onOpenLegal }: { onOpenLegal(s: LegalSection): void }) {
  const [aperta, setAperta] = useState<number | null>(0);
  return (
    <Sezione id="domande" titoloId="t-faq">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="lg:sticky lg:top-[88px] lg:self-start">
          <TitoloSezione id="t-faq">Domande frequenti</TitoloSezione>
        </div>
        <div className="flex flex-col gap-3">
          {VOCI.map((v, i) => (
            <div key={v.d}>
              <Domanda voce={v} aperta={aperta === i} onToggle={() => setAperta(aperta === i ? null : i)} onOpenLegal={onOpenLegal} />
            </div>
          ))}
        </div>
      </div>
    </Sezione>
  );
}
