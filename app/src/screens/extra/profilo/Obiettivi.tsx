import { useMemo, useState, type ReactNode } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { calcolaStima } from '../../../components/home/stima';
import { Carta } from '../../../components/home/comune';
import { OFA_DEADLINES, OFA_RULES_NOTE } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { formatoDurata } from '../../../lib/profilo/giorni';
import {
  avanzamentoGiornaliero, avanzamentoStima, giorniConObiettivo, giorniMancanti, MINUTI_OPZIONI, normalizzaObiettivi, OBIETTIVI_INIZIALI, STIMA_OPZIONI,
  type ObiettiviDati,
} from '../../../lib/profilo/obiettivi';
import { BarraTono, FoglioInfo, IconaTono, PulsanteInfo, type Tono } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { Disegno } from '../servizi/componenti';
import { Pagina, useOggi } from './componenti';

function Scelte({ nome, valori, scelto, onScegli, formato }: { nome: string; valori: number[]; scelto: number; onScegli: (v: number) => void; formato: (v: number) => string }) {
  return (
    <div role="radiogroup" aria-label={nome} className="flex flex-wrap gap-2">
      {valori.map(v => (
        <button key={v} type="button" role="radio" aria-checked={scelto === v} onClick={() => { playTapSound(); onScegli(v); }}
          className={cn('brand-premibile h-9 px-3.5 rounded-full text-[13.5px] font-semibold tabular-nums', scelto === v ? 'bg-azione-tinta text-azione-testo border border-azione' : 'bg-superficie text-testo border border-linea')}>
          {formato(v)}
        </button>
      ))}
    </div>
  );
}

/** Intestazione di carta: tessera icona nel tono del significato (data e tempo = ambra, probabilità = verde) e titolo di due parole. */
function Titolo({ tono, icona, children, destra }: { tono: Tono; icona: NomeIcona; children: ReactNode; destra?: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <IconaTono tono={tono} lato={36} className="bg-superficie"><Icona nome={icona} size={19} /></IconaTono>
      <h2 className="flex-1 text-[15px] leading-[20px] font-bold text-testo">{children}</h2>
      {destra}
    </div>
  );
}

/** Obiettivo raggiunto: segno verde (il colore dice che è riuscito). */
const Raggiunto = () => <span role="img" aria-label="Raggiunto" className="text-alto-numero"><Icona nome="stato-ok" size={22} /></span>;

/** Obiettivi scelti dall'utente (data del test, minuti al giorno, probabilità) con l'avanzamento vero verso ciascuno: solo icone, numeri e barre. */
export default function Obiettivi() {
  const { appState, indietro } = useExtra();
  const [grezzi, salva] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const ob = useMemo(() => normalizzaObiettivi(grezzi), [grezzi]);
  const oggi = useOggi();
  const [foglio, setFoglio] = useState(false);
  const imposta = (p: Partial<ObiettiviDati>) => salva(normalizzaObiettivi({ ...ob, ...p }));

  const mancano = giorniMancanti(ob.dataTest, oggi);
  const giorno = useMemo(() => avanzamentoGiornaliero(appState, oggi, ob.minutiGiorno), [appState, oggi, ob.minutiGiorno]);
  const settimana = useMemo(() => giorniConObiettivo(appState, oggi, ob.minutiGiorno, 7), [appState, oggi, ob.minutiGiorno]);
  const stima = useMemo(() => calcolaStima(appState), [appState]);
  const av = avanzamentoStima(stima?.p, ob.stimaTarget);

  const dataCol = mancano?.quando === 'passato' ? 'text-testo-tenue' : 'text-medio-numero';
  return (
    <Pagina titolo="Obiettivi" indietro={indietro}>
      <div className="mt-2 flex justify-center"><Disegno nome="obiettivo" lato={120} /></div>
      <div className="mt-3 flex flex-col gap-3">
        <Carta className="p-4 flex flex-col gap-3">
          <Titolo tono="medio" icona="data-test" destra={<PulsanteInfo onClick={() => setFoglio(true)} etichetta="Scadenze del test" />}>Data del test</Titolo>
          {mancano && (
            <p className={`flex items-baseline gap-2 text-[34px] leading-[38px] font-extrabold tabular-nums ${dataCol}`} aria-live="polite"
              aria-label={mancano.quando === 'oggi' ? 'Il test è oggi' : mancano.quando === 'futuro' ? `Mancano ${mancano.giorni} giorni` : `Data passata da ${-mancano.giorni} giorni`}>
              {mancano.quando === 'oggi' ? 'Oggi' : <>{mancano.quando === 'passato' ? '−' : ''}{Math.abs(mancano.giorni)}<span className="text-[15px] font-bold text-testo-tenue">{Math.abs(mancano.giorni) === 1 ? 'giorno' : 'giorni'}</span></>}
            </p>
          )}
          <div className="flex items-center gap-2.5">
            <label htmlFor="data-test" className="sr-only">Data del test</label>
            <input id="data-test" type="date" value={ob.dataTest ?? ''} onChange={e => imposta({ dataTest: e.target.value || null })}
              className="h-11 min-w-0 flex-1 rounded-[10px] bg-superficie border border-bordo-campo px-3 text-[15px] text-testo focus:outline-none focus:border-azione" />
            {ob.dataTest && (
              <button type="button" onClick={() => { playTapSound(); imposta({ dataTest: null }); }} aria-label="Togli la data"
                className="brand-premibile grid h-11 w-11 place-items-center rounded-[10px] bg-superficie border border-linea text-testo-tenue"><Icona nome="chiudi" size={20} /></button>
            )}
          </div>
        </Carta>

        <Carta className="p-4 flex flex-col gap-3">
          <Titolo tono="medio" icona="minuti-giorno">Minuti al giorno</Titolo>
          <Scelte nome="Minuti di studio al giorno" valori={MINUTI_OPZIONI} scelto={ob.minutiGiorno} onScegli={v => imposta({ minutiGiorno: v })} formato={v => `${v}`} />
          <div>
            <div className="flex items-center justify-between gap-3 text-[14px]">
              <span className="inline-flex items-center gap-1.5 font-bold tabular-nums text-testo"><Icona nome="tempo" size={17} className="text-medio-numero" />{formatoDurata(giorno.secondi)}<span className="font-semibold text-testo-tenue">/ {ob.minutiGiorno} min</span></span>
              {giorno.raggiunto && <Raggiunto />}
            </div>
            <div className="mt-1.5"><BarraTono tono="alto" valore={giorno.quota * 100} /></div>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-bold tabular-nums text-testo" role="img" aria-label={`Obiettivo raggiunto ${settimana.raggiunti} volte su ${settimana.giorni} giorni`}>
              <Icona nome="giorni-studio" size={17} className="text-medio-numero" />{settimana.raggiunti}/{settimana.giorni}
            </p>
          </div>
        </Carta>

        <Carta className="p-4 flex flex-col gap-3">
          <Titolo tono="alto" icona="probabilita">Probabilità</Titolo>
          <Scelte nome="Probabilità da raggiungere" valori={STIMA_OPZIONI} scelto={ob.stimaTarget} onScegli={v => imposta({ stimaTarget: v })} formato={v => `${v}%`} />
          {av.corrente === null ? (
            <p className="inline-flex items-center gap-2 text-[15px] font-bold text-testo-tenue" role="img" aria-label="Ancora nessuna stima">
              <Icona nome="stato-non-attivo" size={18} />–
            </p>
          ) : (
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <span className={`text-[26px] leading-[30px] font-extrabold tabular-nums ${av.raggiunto ? 'text-alto-numero' : 'text-testo'}`}>{av.corrente}%</span>
                <span className="inline-flex items-center gap-1.5 text-[14px] font-bold tabular-nums text-testo-tenue"><Icona nome="obiettivi" size={16} />{av.target}%</span>
                {av.raggiunto && <Raggiunto />}
              </div>
              <div className="mt-1.5"><BarraTono tono="alto" valore={av.quota * 100} /></div>
            </div>
          )}
        </Carta>

        <Carta className="flex items-center gap-2 p-4 pr-3">
          <div className="min-w-0 flex-1 flex flex-col gap-3">
            <Titolo tono="medio" icona="scadenza">Scadenze</Titolo>
            <dl className="flex flex-col gap-2.5">
              {OFA_DEADLINES.map(d => (
                <div key={d.scuola} className="flex flex-col">
                  <dt className="text-[13.5px] leading-[18px] text-testo-tenue">{d.scuola}</dt>
                  <dd className="text-[16px] leading-[22px] font-bold text-testo">{d.data}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Disegno nome="accesso-bloccato" kit="kit-luminoso" lato={136} className="shrink-0" />
        </Carta>
      </div>
      <FoglioInfo aperto={foglio} onChiudi={() => setFoglio(false)} titolo="Data del test">
        <p>La data è facoltativa e serve solo a te, per contare i giorni che mancano. Il tempo conta mentre fai esercizi, simulazioni e il diagnostico. La probabilità cambia solo con il diagnostico e le simulazioni, non con gli esercizi.</p>
        <p className="mt-2">Le scadenze sono quelle per avere il piano completo del 2° anno (calendario 2026/27). {OFA_RULES_NOTE}</p>
      </FoglioInfo>
    </Pagina>
  );
}
