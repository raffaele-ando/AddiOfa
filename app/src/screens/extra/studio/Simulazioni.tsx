// Scheda «Simulazioni», metà Prove: la carta della nuova simulazione (tre dati a parole, un solo pulsante «Inizia la simulazione»)
// e l'elenco di quelle svolte (punteggio /30, data, «Superata» o «Sotto la soglia» a parole). Le regole stanno dietro la «i». Concept: 30.10, 49.6, 18.7.
// Arte: `simulazione-esame` accanto ai tre dati; nessuna se non ce n'è nessuna svolta (una riga di testo, non una carta con la mascotte).
import { useMemo } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { EXAM } from '../../../config/offer';
import { elencoSimulazioni } from '../../../lib/studio/simulazioni';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { RegoleFormato } from '../../../components/esito/InfoPunteggio';
import { Carta } from '../sfide/comuni';
import { SchedaProveSfide } from '../sfide/scheda';
import { Bottone, IconaTono, dataBreve, minSec, type Tono } from './comune';

function Dato({ icona, tono, children }: { icona: NomeIcona; tono: Tono; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5">
      <IconaTono tono={tono} lato={32} className="rounded-full bg-superficie"><Icona nome={icona} size={18} /></IconaTono>
      <span className="text-[15px] leading-[20px] font-bold text-testo">{children}</span>
    </li>
  );
}

/** Quanto manca alla soglia, a parole e a colori: verde superata, ambra vicina (a 5 risposte o meno), corallo sotto. */
function esitoVista(esatte: number, soglia: number, superata: boolean) {
  if (superata) return { parola: 'Superata', icona: 'stato-ok' as const, tinta: 'bg-alto-tinta text-alto-testo', numero: 'text-alto-numero' };
  if (esatte >= soglia - 5) return { parola: 'Sotto la soglia', icona: 'soglia' as const, tinta: 'bg-medio-tinta text-medio-testo', numero: 'text-medio-testo' };
  return { parola: 'Sotto la soglia', icona: 'soglia' as const, tinta: 'bg-basso-tinta text-basso-testo', numero: 'text-basso-numero' };
}

export default function Simulazioni() {
  const { appState, vai, avviaSimulazione } = useExtra();
  const f = EXAM;
  const elenco = useMemo(() => elencoSimulazioni(appState.history), [appState.history]);
  const migliore = elenco.length > 0 ? Math.max(...elenco.map(s => s.esatte)) : null;
  return (
    <SchedaProveSfide sezione="prove" titoloInfo="Regole" info={<RegoleFormato format={f} />}>
      <Carta tono="azione" className="mt-4">
        <div className="flex items-center gap-4">
          <Illustrazione nome="simulazione-esame" lato={96} />
          <ul className="flex min-w-0 flex-1 flex-col gap-2.5" aria-label="Com'è fatta la simulazione">
            <Dato icona="risposte" tono="azione">{f.questions} domande</Dato>
            <Dato icona="tempo" tono="medio">{f.minutes} minuti</Dato>
            <Dato icona="soglia" tono="alto">Si supera con {f.passMark}</Dato>
          </ul>
        </div>
        <Bottone className="mt-4" icona={<Icona nome="studia" size={20} />} onClick={avviaSimulazione}>Inizia la simulazione</Bottone>
      </Carta>

      <section aria-labelledby="titolo-svolte" className="mt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <h2 id="titolo-svolte" className="flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo"><Icona nome="storico" size={20} className="text-testo-tenue" />Svolte</h2>
          {migliore !== null && (
            <span role="img" aria-label={`Migliore: ${migliore} su ${f.questions}`} className="inline-flex items-center gap-1.5 text-[14px] font-extrabold tabular-nums text-medio-testo">
              <Icona nome="stato-primo" size={18} className="text-medio-numero" />Migliore {migliore}/{f.questions}
            </span>
          )}
        </div>
        {elenco.length === 0 ? (
          <p data-testo-ok className="rounded-[12px] bg-superficie-2 px-4 py-5 text-center text-[15px] leading-[22px] text-testo-tenue">Non hai ancora svolto simulazioni.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {elenco.map(s => {
              const v = esitoVista(s.esatte, s.soglia, s.superata);
              return (
                <li key={s.id}>
                  <button type="button" onClick={() => { playTapSound(); vai('simulazione-dettaglio', { id: s.id }); }}
                    aria-label={`Simulazione ${s.numero}, ${dataBreve(s.data)}: ${s.esatte} su ${s.totale}, ${s.superata ? 'superata' : 'sotto la soglia'}`}
                    className="brand-premibile flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 pr-2.5 text-left">
                    <span className="min-w-[58px] text-center" aria-hidden="true">
                      <span className={cn('block text-[26px] leading-[28px] font-extrabold tabular-nums', v.numero)}>{s.esatte}</span>
                      <span className="block text-[12px] leading-[14px] font-semibold tabular-nums text-testo-tenue">/{s.totale}</span>
                    </span>
                    <span className="min-w-0 flex-1" aria-hidden="true">
                      <span className="block text-[15px] leading-[20px] font-bold text-testo">{dataBreve(s.data)}</span>
                      <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12.5px] leading-[16px] font-bold', v.tinta)}><Icona nome={v.icona} size={14} />{v.parola}</span>
                      {s.tempoSecondi > 0 && <span className="ml-2 inline-flex items-center gap-1 text-[12.5px] leading-[17px] font-semibold tabular-nums text-testo-tenue"><Icona nome="tempo" size={13} />{minSec(s.tempoSecondi)}</span>}
                    </span>
                    <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </SchedaProveSfide>
  );
}
