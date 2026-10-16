import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { Carta } from '../../../components/home/comune';
import { playTapSound } from '../../../lib/audio';
import { cn, chiaveGiorno } from '../../../lib/utils';
import {
  datiDelGiorno, formatoDurata, giornoStudiato, INTESTAZIONE_SETTIMANA, leggiData, meseCalendario, NOMI_MESI, registroGiorni, spostaMese, totaliPeriodo,
} from '../../../lib/profilo/giorni';
import { normalizzaObiettivi, type ObiettiviDati, OBIETTIVI_INIZIALI } from '../../../lib/profilo/obiettivi';
import { useExtra, useExtraDati } from '../contesto';
import { Pagina, useOggi } from './componenti';

const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const plurale = (n: number, uno: string, molti: string) => `${n} ${n === 1 ? uno : molti}`;

function nomeGiorno(data: string): string {
  const d = leggiData(data)!;
  return `${GIORNI[d.getDay()]} ${d.getDate()} ${NOMI_MESI[d.getMonth()]}`;
}

/** Il mese con i giorni in cui hai studiato davvero (risposte, simulazioni o almeno un minuto di studio). */
export default function Calendario() {
  const { appState, indietro, vai } = useExtra();
  const [grezzi] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const dataTest = normalizzaObiettivi(grezzi).dataTest;
  const oggi = useOggi();
  const chiaveOggi = chiaveGiorno(oggi);
  const [vista, setVista] = useState({ anno: oggi.getFullYear(), mese: oggi.getMonth() });
  const [scelto, setScelto] = useState(chiaveOggi);

  const registro = useMemo(() => registroGiorni(appState), [appState]);
  const mese = useMemo(() => meseCalendario(vista.anno, vista.mese, registro, oggi, dataTest), [vista, registro, oggi, dataTest]);
  const totali = useMemo(() => totaliPeriodo(mese.settimane.flat().filter(c => c.delMese).map(c => datiDelGiorno(registro, c.data))), [mese, registro]);
  const giorno = datiDelGiorno(registro, scelto);
  const eTest = scelto === dataTest;
  const sposta = (delta: number) => { playTapSound(); setVista(v => spostaMese(v.anno, v.mese, delta)); };

  return (
    <Pagina titolo="Calendario" indietro={indietro}>
      <Carta className="mt-4 p-3.5">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => sposta(-1)} aria-label="Mese precedente" className="brand-premibile w-10 h-10 rounded-full grid place-items-center text-azione"><ChevronLeft size={24} aria-hidden="true" /></button>
          <h2 className="text-[16px] font-bold text-testo" aria-live="polite">{mese.etichetta}</h2>
          <button type="button" onClick={() => sposta(1)} aria-label="Mese successivo" className="brand-premibile w-10 h-10 rounded-full grid place-items-center text-azione"><ChevronRight size={24} aria-hidden="true" /></button>
        </div>
        <div className="mt-1 grid grid-cols-7 text-center text-[12px] font-semibold text-testo-tenue" aria-hidden="true">
          {INTESTAZIONE_SETTIMANA.map((l, i) => <span key={i} className="py-1.5">{l}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1" role="group" aria-label={mese.etichetta}>
          {mese.settimane.flat().map(c => c.delMese ? (
            <button key={c.data} type="button" aria-pressed={scelto === c.data}
              aria-label={`${nomeGiorno(c.data)}${c.studiato ? ', hai studiato' : ''}${c.oggi ? ', oggi' : ''}${c.test ? ', data del test' : ''}`}
              onClick={() => { playTapSound(); setScelto(c.data); }}
              className="relative h-11 grid place-items-center">
              <span className={cn('w-10 h-10 rounded-full grid place-items-center text-[14.5px] tabular-nums',
                c.studiato ? 'bg-medio-chiaro text-testo dark:bg-medio dark:text-azione-su font-bold' : c.futuro ? 'text-testo-tenue' : 'text-testo',
                c.oggi && !c.studiato && 'border-2 border-azione font-bold',
                c.oggi && c.studiato && 'ring-2 ring-offset-2 ring-azione ring-offset-superficie-2',
                scelto === c.data && !c.studiato && !c.oggi && 'bg-azione-tinta font-bold',
                scelto === c.data && c.studiato && 'ring-2 ring-offset-2 ring-testo ring-offset-superficie-2',
              )}>{c.giorno}</span>
              {c.test && <Flag size={12} fill="currentColor" className="absolute top-0.5 right-0.5 text-medio-numero" aria-hidden="true" />}
            </button>
          ) : <span key={c.data} aria-hidden="true" />)}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-testo-tenue">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-medio" aria-hidden="true" />Hai studiato</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full border-2 border-azione" aria-hidden="true" />Oggi</span>
          <span className="flex items-center gap-1.5"><Flag size={12} fill="currentColor" className="text-medio-testo" aria-hidden="true" />Data del test</span>
        </div>
      </Carta>

      <Carta className="mt-3 p-4" >
        <h2 className="text-[15.5px] font-bold text-testo" aria-live="polite">{nomeGiorno(scelto)}{scelto === chiaveOggi ? ' (oggi)' : ''}</h2>
        {eTest && <p className="mt-1 flex items-center gap-1.5 text-[13.5px] font-semibold text-medio-testo"><Flag size={14} fill="currentColor" aria-hidden="true" />Data del test</p>}
        {giornoStudiato(giorno) || giorno.secondi > 0 ? (
          <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
            {[
              [String(giorno.domande), giorno.domande === 1 ? 'domanda' : 'domande'],
              [formatoDurata(giorno.secondi), 'di studio'],
              [String(giorno.simulazioni), giorno.simulazioni === 1 ? 'simulazione' : 'simulazioni'],
            ].map(([v, e]) => (
              <div key={e} className="rounded-[10px] bg-superficie py-2.5 px-1">
                <dd className="text-[17px] leading-[22px] font-extrabold text-testo tabular-nums">{v}</dd>
                <dt className="text-[12px] text-testo-tenue">{e}</dt>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">
            {scelto > chiaveOggi ? 'Giorno che deve ancora arrivare.' : 'Nessuno studio registrato in questo giorno.'}
          </p>
        )}
      </Carta>

      <p className="mt-3 px-1 text-[13px] leading-[18px] text-testo-tenue">
        {mese.etichetta.split(' ')[0]}: {totali.giorniDiStudio === 0 ? 'nessun giorno di studio' : `${plurale(totali.giorniDiStudio, 'giorno di studio', 'giorni di studio')}, ${plurale(totali.domande, 'domanda', 'domande')}, ${formatoDurata(totali.secondi)}`}.
        {' '}Un giorno conta se hai risposto ad almeno una domanda, fatto una simulazione o studiato per almeno un minuto.
      </p>
      <button type="button" onClick={() => { playTapSound(); vai('obiettivi'); }} className="brand-premibile mt-3 h-10 px-4 rounded-full bg-azione-tinta text-azione-scuro text-[14px] font-semibold">
        {dataTest ? 'Cambia la data del test' : 'Scegli la data del test'}
      </button>
    </Pagina>
  );
}
