import { CalendarDays, Layers, Target, Wallet } from 'lucide-react';
import { FORMATS, OFA_CONSEQUENCES, OFA_DEADLINES, OFA_RULES_NOTE } from '../../config/offer';
import { BottoneAzione, Sezione, TitoloSezione, SCHEDA, Evidenza } from './comune';
import { cn } from '../../lib/utils';

function Anello({ Icona }: { Icona: typeof Target }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-azione-tinta text-azione-scuro ">
      <Icona size={22} aria-hidden />
    </span>
  );
}

// Fatti veri sull'OFA, tutti presi da config/offer.ts. Nessun numero di studenti, nessuna percentuale.
export default function SeNonSuperi({ onStart }: { onStart(): void }) {
  const scheda = cn(SCHEDA, 'p-5 flex items-start gap-4');
  return (
    <Sezione titoloId="t-ofa" className="bg-superficie-2">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <TitoloSezione
            id="t-ofa"
            occhiello="Cosa c'è in gioco"
            sotto="Poche cose, tutte verificabili. Le regole possono cambiare: sul sito del Politecnico trovi quelle aggiornate."
          >
            Se non superi l'<Evidenza>OFA…</Evidenza>
          </TitoloSezione>
          <p className="mt-6 max-w-md text-sm font-medium text-testo-tenue">
            AddiOFA non cambia le regole né sostituisce il test: ti aiuta a sapere a che punto sei prima di affrontarlo.
          </p>
        </div>

        <ol className="relative flex flex-col gap-4">
          <span aria-hidden className="absolute left-[2.1rem] top-10 bottom-10 z-0 w-0.5 bg-azione/25" />

          <li className="relative z-10">
            <div>
              <div className={scheda}>
                <Anello Icona={Target} />
                <div>
                  <h3 className="font-bold text-testo">La soglia</h3>
                  <p className="mt-1 text-sm font-medium text-testo-tenue">
                    TENG: meno di {FORMATS.teng.passMark} risposte esatte su {FORMATS.teng.questions} dà l'OFA. Test di recupero (formato LinguaViva): si supera con {FORMATS.ente.passMark} su {FORMATS.ente.questions}.
                  </p>
                </div>
              </div>
            </div>
          </li>
          <li className="relative z-10">
            <div>
              <div className={scheda}>
                <Anello Icona={Wallet} />
                <div>
                  <h3 className="font-bold text-testo">Un nuovo tentativo costa</h3>
                  <p className="mt-1 text-sm font-medium text-testo-tenue">{OFA_CONSEQUENCES[0]}.</p>
                </div>
              </div>
            </div>
          </li>
          <li className="relative z-10">
            <div>
              <div className={scheda}>
                <Anello Icona={Layers} />
                <div>
                  <h3 className="font-bold text-testo">Il piano degli studi</h3>
                  <p className="mt-1 text-sm font-medium text-testo-tenue">{OFA_CONSEQUENCES[1]}.</p>
                </div>
              </div>
            </div>
          </li>
          <li className="relative z-10">
            <div>
              <div className={scheda}>
                <Anello Icona={CalendarDays} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-testo">Scadenze per il piano completo del 2° anno</h3>
                  <dl className="mt-2 flex flex-col gap-1">
                    {OFA_DEADLINES.map(d => (
                      <div key={d.scuola} className="flex justify-between gap-3 text-sm font-medium text-testo-tenue">
                        <dt>{d.scuola}</dt><dd className="font-bold text-testo">{d.data}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-2 text-xs font-medium text-testo-tenue">Calendario 2026/27 del Politecnico. {OFA_RULES_NOTE}</p>
                </div>
              </div>
            </div>
          </li>
          <li className="relative z-10">
            <div>
              <div className="rounded-3xl bg-azione p-5 sm:p-6 text-azione-su shadow-[0_12px_28px_rgba(37,99,235,0.28)] dark:shadow-none">
                <h3 className="text-lg font-bold">Con il diagnostico lo sai prima</h3>
                <p className="mt-1.5 text-sm font-medium text-azione-su/95">
                  Vedi una probabilità stimata calcolata sulle tue risposte e gli argomenti da cui ripartire, prima di pagare un tentativo.
                </p>
                <BottoneAzione onClick={onStart} className="mt-4 !bg-superficie !text-azione-scuro hover:!bg-azione-tinta !shadow-none focus-visible:!outline-white">Fai il diagnostico gratuito</BottoneAzione>
              </div>
            </div>
          </li>
        </ol>
      </div>
    </Sezione>
  );
}
