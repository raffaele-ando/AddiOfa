import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LegalSection } from '../../types';
import { DISCLAIMER, FREE_LIMITS, PASS } from '../../config/offer';
import { FOCUS, Sezione, TitoloSezione, SCHEDA } from './comune';
import { cn } from '../../lib/utils';

interface Voce { d: string; r: string; legale?: { sezione: LegalSection; testo: string } }

const VOCI: Voce[] = [
  {
    d: 'Cos\'è il Pass AddiOFA?',
    r: `È l'accesso completo all'app per ${PASS.validMonths} mesi, con un solo pagamento: tutte le domande del banco con la spiegazione in italiano, simulazioni illimitate nel formato del test di recupero, la teoria dei 31 argomenti, il ripasso sugli errori e le statistiche complete. Non è un abbonamento e non si rinnova da solo.`,
  },
  {
    d: 'Cosa posso fare senza pagare?',
    r: `Il diagnostico da ${FREE_LIMITS.diagnostic} domande con la probabilità stimata, il ripasso su un nucleo di circa ${FREE_LIMITS.coreQuestions} domande, una simulazione completa e una scheda di teoria. Non serve un account.`,
  },
  {
    d: 'La probabilità che vedo è una promessa?',
    r: 'No. È una stima calcolata sulle tue risposte: con poche domande è approssimativa e non dice come andrà il test vero. Si affina con le simulazioni.',
  },
  {
    d: 'Posso recedere dall\'acquisto?',
    r: 'Il diritto di recesso previsto dalla legge per chi compra da consumatore è di 14 giorni, con le eccezioni per i contenuti digitali spiegate nella pagina dedicata. Al momento i pagamenti non sono attivi, quindi non c\'è ancora nulla da comprare.',
    legale: { sezione: 'recesso', testo: 'Leggi la pagina sul recesso' },
  },
  {
    d: 'Che dati raccogliete?',
    r: 'Il meno possibile: niente matricola, niente codice fiscale, niente email del Politecnico. I progressi di studio restano sul tuo dispositivo; l\'email serve solo se entri in lista d\'attesa o compri il Pass. Non vendiamo i dati.',
    legale: { sezione: 'privacy', testo: 'Leggi l\'informativa privacy' },
  },
  {
    d: 'AddiOFA è collegata al Politecnico di Milano?',
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
          <ChevronDown size={20} aria-hidden className={cn('shrink-0 text-azione ', aperta && 'rotate-180')} />
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
            <p className="text-sm font-medium leading-relaxed text-testo">{voce.r}</p>
            {voce.legale && (
              <button type="button" onClick={() => onOpenLegal(voce.legale!.sezione)} className={cn('mt-2 rounded text-sm font-bold text-azione-scuro underline underline-offset-2', FOCUS)}>
                {voce.legale.testo}
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
          <TitoloSezione id="t-faq" occhiello="FAQ" sotto="Le risposte brevi. Per il resto ci sono i testi legali in fondo alla pagina.">
            Domande frequenti
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
