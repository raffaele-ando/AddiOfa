// Tessere dell'esito di una simulazione: giuste (verde), sbagliate (corallo), senza risposta (ambra), più la riga del tempo (ambra).
// Servono sia alla consegna (EsitoSimulazione) sia alle simulazioni già svolte (SimulazioneDettaglio): stessi colori, stesso posto.
import { Check, Clock, Minus, X } from 'lucide-react';
import { IconaTono, type Tono } from '../../screens/extra/ui';
import { minSec } from '../../screens/extra/studio/comune';

function Tessera({ Icona, valore, etichetta, tono, aria }: { Icona: typeof Check; valore: string; etichetta: string; tono: Tono; aria: string }) {
  return (
    <div role="group" aria-label={aria} className="rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center gap-1.5 min-w-0">
      <IconaTono tono={tono} lato={34} className="rounded-full"><Icona size={17} strokeWidth={3} /></IconaTono>
      <span className="text-[24px] leading-[26px] font-extrabold tabular-nums text-testo" aria-hidden="true">{valore}</span>
      <span className="text-[11.5px] font-semibold text-testo-tenue text-center leading-tight" aria-hidden="true">{etichetta}</span>
    </div>
  );
}

/** `sbagliate` e `vuote` null = dato non salvato (simulazioni vecchie). */
export function TessereEsito({ giuste, sbagliate, vuote }: { giuste: number; sbagliate: number | null; vuote: number | null }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Tessera Icona={Check} tono="alto" valore={String(giuste)} etichetta="Giuste" aria={`${giuste} risposte giuste`} />
      <Tessera Icona={X} tono="basso" valore={sbagliate === null ? '–' : String(sbagliate)} etichetta="Sbagliate" aria={sbagliate === null ? 'Sbagliate: dato non salvato' : `${sbagliate} risposte sbagliate`} />
      <Tessera Icona={Minus} tono="medio" valore={vuote === null ? '–' : String(vuote)} etichetta="Senza risposta" aria={vuote === null ? 'Senza risposta: dato non salvato' : `${vuote} domande senza risposta`} />
    </div>
  );
}

/** «10:40 su 15 min»: il tempo è ambra in tutta l'app. */
export function RigaTempo({ secondi, minuti }: { secondi: number; minuti: number }) {
  if (!(secondi > 0)) return null;
  return (
    <p className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-medio-testo" aria-label={`Tempo usato: ${minSec(secondi)} su ${minuti} minuti`}>
      <Clock size={15} strokeWidth={2.6} aria-hidden="true" /><span className="tabular-nums">{minSec(secondi)}</span> su {minuti} min
    </p>
  );
}
