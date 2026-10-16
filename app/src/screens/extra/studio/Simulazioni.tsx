// Scheda «Simulazioni», metà Prove: la carta della nuova simulazione (tre dati a icone, un solo ▶)
// e l'elenco di quelle svolte (data, punteggio /30, icona esito). Le regole stanno dietro la «i». Concept: 36 e 49, 18.
import { useMemo } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { EXAM } from '../../../config/offer';
import { elencoSimulazioni } from '../../../lib/studio/simulazioni';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { RegoleFormato } from '../../../components/esito/InfoPunteggio';
import { Bottone, Carta, Dato } from '../sfide/comuni';
import { IconaTono } from '../ui';
import { SchedaProveSfide } from '../sfide/scheda';
import { dataBreve, minSec } from './comune';

export default function Simulazioni() {
  const { appState, vai, avviaSimulazione } = useExtra();
  const f = EXAM;
  const elenco = useMemo(() => elencoSimulazioni(appState.history), [appState.history]);
  const migliore = elenco.length > 0 ? Math.max(...elenco.map(s => s.esatte)) : null;
  return (
    <SchedaProveSfide sezione="prove" titoloInfo="Regole" info={<RegoleFormato format={f} />}>
      <Carta tono="azione" className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <Dato icona="risposte" tono="azione" valore={f.questions} aria={`${f.questions} domande`} />
          <Dato icona="tempo" tono="medio" valore={f.minutes} unita="min" aria={`${f.minutes} minuti`} />
          <Dato icona="soglia" tono="alto" valore={`${f.passMark}/${f.questions}`} aria={`Soglia ${f.passMark} su ${f.questions}`} />
        </div>
        <Bottone className="mt-4" icona="studia" aria="Inizia la simulazione" onClick={avviaSimulazione} />
      </Carta>

      <section aria-labelledby="titolo-svolte" className="mt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="titolo-svolte" className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="storico" size={20} className="text-testo-tenue" />Svolte</h2>
          {migliore !== null && (
            <span role="img" aria-label={`Migliore: ${migliore} su ${f.questions}`} className="inline-flex items-center gap-1.5 text-[14px] font-extrabold tabular-nums text-medio-testo">
              <Icona nome="stato-primo" size={18} className="text-medio-numero" />{migliore}/{f.questions}
            </span>
          )}
        </div>
        {elenco.length === 0 ? (
          <Carta className="flex flex-col items-center py-6 text-center">
            <IconaTono tono="azione" lato={52} className="rounded-full"><Icona nome="simulazioni" size={26} /></IconaTono>
            <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessuna simulazione</p>
          </Carta>
        ) : (
          <ul className="flex flex-col gap-2">
            {elenco.map(s => (
              <li key={s.id}>
                <button type="button" onClick={() => { playTapSound(); vai('simulazione-dettaglio', { id: s.id }); }}
                  aria-label={`Simulazione ${s.numero}, ${dataBreve(s.data)}: ${s.esatte} su ${s.totale}, ${s.superata ? 'superata' : 'non superata'}`}
                  className="brand-premibile flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 pr-2.5 text-left">
                  <span className="min-w-[58px] text-center" aria-hidden="true">
                    <span className={cn('block text-[26px] leading-[28px] font-extrabold tabular-nums', s.superata ? 'text-alto-numero' : 'text-basso-numero')}>{s.esatte}</span>
                    <span className="block text-[12px] leading-[14px] font-semibold tabular-nums text-testo-tenue">/{s.totale}</span>
                  </span>
                  <span className="min-w-0 flex-1" aria-hidden="true">
                    <span className="block text-[15px] leading-[20px] font-bold text-testo">{dataBreve(s.data)}</span>
                    {s.tempoSecondi > 0 && <span className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] leading-[17px] font-semibold tabular-nums text-medio-testo"><Icona nome="tempo" size={13} />{minSec(s.tempoSecondi)}</span>}
                  </span>
                  <span aria-hidden="true" className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-full', s.superata ? 'bg-alto-tinta text-alto-numero' : 'bg-basso-tinta text-basso-numero')}>
                    <Icona nome={s.superata ? 'stato-ok' : 'stato-errore'} size={20} />
                  </span>
                  <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SchedaProveSfide>
  );
}
