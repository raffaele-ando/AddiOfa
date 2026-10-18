import { useId, useState } from 'react';
import { Icona } from '../../brand/icone/Icona';
import type { LegalSection } from '../../types';
import { DIAGNOSTIC_QUESTIONS, DISCLAIMER, EXAM } from '../../config/offer';
import { questions } from '../../data/questions';
import { ICONE_LEGALI } from '../Footer';
import { FOCUS, Sezione, TitoloSezione, SCHEDA } from './comune';
import { cn } from '../../lib/utils';

interface Voce { d: string; r: string; legale?: { sezione: LegalSection; testo: string } }

const VOCI: Voce[] = [
  {
    d: 'Quanto costa?',
    r: `Niente: AddiOFA è aperto a tutti e non serve nessuna password. Hai tutte le ${questions.length} domande con la spiegazione in italiano, le schede di teoria, simulazioni illimitate nel formato del test di recupero (${EXAM.questions} domande in ${EXAM.minutes} minuti), il ripasso sugli errori e le statistiche.`,
  },
  {
    d: 'Cos\'è il diagnostico?',
    r: `Un quiz da ${DIAGNOSTIC_QUESTIONS} domande che stima la probabilità di superare il test. Dopo, il ripasso si adatta ai tuoi errori.`,
  },
  {
    d: 'La stima è una promessa?',
    r: 'No. È una stima calcolata sulle tue risposte: con poche domande è approssimativa e non dice come andrà il test vero. Si affina con le simulazioni.',
  },
  {
    d: 'Dove restano i progressi?',
    r: 'I progressi di studio restano nel tuo browser: dalle Impostazioni li esporti e li importi su un altro dispositivo. Non ti chiediamo nessun dato per studiare; account, classifica e email di Project sono facoltativi e si attivano solo se li accendi tu. Niente matricola, niente codice fiscale. Non vendiamo dati.',
    legale: { sezione: 'privacy', testo: 'Privacy' },
  },
  {
    d: 'Legata al Polimi?',
    r: `No. ${DISCLAIMER} Il test lo fai con il Politecnico o con l'ente che scegli, non con noi.`,
  },
];

function Domanda({ voce, aperta, onToggle, onOpenLegal }: { voce: Voce; aperta: boolean; onToggle(): void; onOpenLegal(s: LegalSection): void }) {
  const id = useId();
  return (
    <div className={cn(SCHEDA, 'overflow-hidden !rounded-[24px]')}>
      <h3>
        <button
          type="button"
          aria-expanded={aperta}
          aria-controls={`${id}-p`}
          id={`${id}-b`}
          onClick={onToggle}
          className={cn('flex w-full items-center justify-between gap-4 rounded-[24px] px-5 py-4 text-left text-base font-bold text-testo sm:px-6', FOCUS)}
        >
          <span>{voce.d}</span>
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
            <p data-testo-ok className="text-sm font-medium leading-relaxed text-testo">{voce.r}</p>
            {voce.legale && (
              <button type="button" onClick={() => onOpenLegal(voce.legale!.sezione)} className={cn('mt-2 inline-flex items-center gap-1.5 rounded text-sm font-bold text-azione-testo underline underline-offset-2', FOCUS)}>
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
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <TitoloSezione id="t-faq" occhiello="FAQ" icona="faq">
            Domande
          </TitoloSezione>
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
