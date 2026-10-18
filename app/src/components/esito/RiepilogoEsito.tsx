// Il riquadro del risultato di una simulazione, uguale alla consegna e al dettaglio di una già svolta: misuratore con la soglia nominata,
// un solo badge (verde «Superata»; ambra «Sotto la soglia» da 20 in su; corallo sotto), quanto manca, soglia e tempo a parole,
// e, solo se ci sono domande vuote, una riga che dice che contano come errori. Niente illustrazione con la X sopra il misuratore.
import type { ReactNode } from 'react';
import { Icona } from '../../brand/icone/Icona';
import { cn } from '../../lib/utils';
import MisuratoreEsito from './MisuratoreEsito';
import { RigaTempo } from './TessereEsito';

/** Da quante risposte sotto la soglia il badge è ambra (vicino) invece che corallo. */
const VICINO = 5;

export default function RiepilogoEsito({ giuste, totale, soglia, superata, vuote, secondi, minuti, scaduto, data, arte }: {
  giuste: number; totale: number; soglia: number; superata: boolean;
  /** Domande senza risposta (null = dato non salvato). */
  vuote: number | null;
  secondi: number; minuti: number; scaduto?: boolean;
  /** Data della prova (solo nel dettaglio di una già svolta). */
  data?: string;
  /** Un'illustrazione sopra il misuratore: solo per la prova superata. */
  arte?: ReactNode;
}) {
  const mancano = Math.max(0, soglia - giuste);
  const vicino = !superata && giuste >= soglia - VICINO;
  const classeBadge = superata ? 'bg-alto-tinta text-alto-testo' : vicino ? 'bg-medio-tinta text-medio-testo' : 'bg-basso-tinta text-basso-testo';
  return (
    <section aria-label="Risultato" className="rounded-[12px] bg-superficie-2 px-4 pt-3 pb-4 text-center">
      {superata && arte && <div className="mb-1 flex justify-center">{arte}</div>}
      <MisuratoreEsito giuste={giuste} totale={totale} soglia={soglia} superata={superata} />
      <div className="-mt-1 flex justify-center">
        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-base font-extrabold', classeBadge)}>
          <Icona nome={superata ? 'stato-ok' : 'soglia'} size={19} />
          {superata ? 'Superata' : 'Sotto la soglia'}
        </span>
      </div>
      {!superata && (
        <p data-testo-ok className="mt-2 text-[14px] leading-[20px] text-testo-tenue">
          {mancano === 1 ? 'Ti manca 1 risposta esatta' : `Ti mancano ${mancano} risposte esatte`}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
        {data && <span className="text-[13.5px] font-bold tabular-nums text-testo-tenue">{data}</span>}
        <span role="img" aria-label={`Soglia ${soglia} su ${totale}`} className="inline-flex items-center gap-1.5 text-[14px] font-bold text-testo">
          <Icona nome="soglia" size={17} className="text-alto-numero" />Soglia <span className="tabular-nums">{soglia} su {totale}</span>
        </span>
        <RigaTempo secondi={secondi} minuti={minuti} scaduto={scaduto} />
      </div>
      {vuote !== null && vuote > 0 && (
        <p data-testo-ok role="note" className="mt-3 rounded-[10px] bg-medio-tinta px-3 py-2 text-[13.5px] leading-[19px] font-semibold text-medio-testo">
          {vuote === 1 ? '1 domanda senza risposta. Conta come errore.' : `${vuote} domande senza risposta. Contano come errori.`}
        </p>
      )}
    </section>
  );
}
