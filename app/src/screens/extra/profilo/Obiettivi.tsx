import { useMemo } from 'react';
import { CalendarClock, Gauge, Timer } from 'lucide-react';
import { calcolaStima } from '../../../components/home/stima';
import { Barra, Carta } from '../../../components/home/comune';
import { OFA_DEADLINES, OFA_RULES_NOTE } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { formatoDurata } from '../../../lib/profilo/giorni';
import {
  avanzamentoGiornaliero, avanzamentoStima, giorniConObiettivo, giorniMancanti, MINUTI_OPZIONI, normalizzaObiettivi, OBIETTIVI_INIZIALI, STIMA_OPZIONI,
  type ObiettiviDati,
} from '../../../lib/profilo/obiettivi';
import { useExtra, useExtraDati } from '../contesto';
import { Pagina, Sezione, useOggi } from './componenti';

function Scelte({ nome, valori, scelto, onScegli, formato }: { nome: string; valori: number[]; scelto: number; onScegli: (v: number) => void; formato: (v: number) => string }) {
  return (
    <div role="radiogroup" aria-label={nome} className="flex flex-wrap gap-2">
      {valori.map(v => (
        <button key={v} type="button" role="radio" aria-checked={scelto === v} onClick={() => { playTapSound(); onScegli(v); }}
          className={cn('brand-premibile h-9 px-3.5 rounded-full text-[13.5px] font-semibold tabular-nums', scelto === v ? 'bg-azione text-azione-su' : 'bg-superficie text-testo border border-linea')}>
          {formato(v)}
        </button>
      ))}
    </div>
  );
}

function Titolo({ icona, children }: { icona: React.ReactNode; children: React.ReactNode }) {
  return <div className="flex items-center gap-2 text-[15px] font-bold text-testo"><span className="text-azione" aria-hidden="true">{icona}</span>{children}</div>;
}

/** Obiettivi scelti dall'utente (data del test, minuti al giorno, probabilità) con l'avanzamento vero verso ciascuno. */
export default function Obiettivi() {
  const { appState, indietro, vaiHome, avviaSimulazione } = useExtra();
  const [grezzi, salva] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const ob = useMemo(() => normalizzaObiettivi(grezzi), [grezzi]);
  const oggi = useOggi();
  const imposta = (p: Partial<ObiettiviDati>) => salva(normalizzaObiettivi({ ...ob, ...p }));

  const mancano = giorniMancanti(ob.dataTest, oggi);
  const giorno = useMemo(() => avanzamentoGiornaliero(appState, oggi, ob.minutiGiorno), [appState, oggi, ob.minutiGiorno]);
  const settimana = useMemo(() => giorniConObiettivo(appState, oggi, ob.minutiGiorno, 7), [appState, oggi, ob.minutiGiorno]);
  const stima = useMemo(() => calcolaStima(appState), [appState]);
  const av = avanzamentoStima(stima?.p, ob.stimaTarget);

  return (
    <Pagina titolo="I miei obiettivi" indietro={indietro}>
      <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">Li scegli tu. Qui vedi dove sei adesso rispetto a ciascuno, con i numeri veri del tuo studio.</p>

      <Sezione titolo="Data del test" id="titolo-data">
        <Carta className="p-4 flex flex-col gap-3">
          <Titolo icona={<CalendarClock size={19} />}>Quando fai il test</Titolo>
          {mancano ? (
            <p className="text-[24px] leading-[30px] font-extrabold text-testo" aria-live="polite">
              {mancano.quando === 'oggi' ? 'Il test è oggi'
                : mancano.quando === 'futuro' ? `Mancano ${mancano.giorni} ${mancano.giorni === 1 ? 'giorno' : 'giorni'}`
                : `Data passata da ${-mancano.giorni} ${mancano.giorni === -1 ? 'giorno' : 'giorni'}`}
            </p>
          ) : (
            <p className="text-[13.5px] leading-[19px] text-testo-tenue">Non hai scelto una data. È facoltativa: serve solo a te, per contare i giorni che mancano.</p>
          )}
          <div className="flex items-center gap-2.5">
            <label htmlFor="data-test" className="sr-only">Data del test</label>
            <input id="data-test" type="date" value={ob.dataTest ?? ''} onChange={e => imposta({ dataTest: e.target.value || null })}
              className="h-11 min-w-0 flex-1 rounded-[10px] bg-superficie border border-linea px-3 text-[15px] text-testo focus:outline-none focus:border-azione" />
            {ob.dataTest && (
              <button type="button" onClick={() => { playTapSound(); imposta({ dataTest: null }); }} className="brand-premibile h-11 px-3.5 rounded-[10px] bg-superficie border border-linea text-[14px] font-semibold text-testo">Togli</button>
            )}
          </div>
          {ob.dataTest && mancano?.quando === 'passato' && <p className="text-[12.5px] text-testo-tenue">Se hai un nuovo tentativo, scegli la nuova data.</p>}
          <p className="text-[12px] leading-[17px] text-testo-tenue">
            Scadenze per avere il piano completo del 2° anno (calendario 2026/27): {OFA_DEADLINES.map(d => `${d.scuola} ${d.data}`).join(', ')}. {OFA_RULES_NOTE}
          </p>
        </Carta>
      </Sezione>

      <Sezione titolo="Obiettivo giornaliero" id="titolo-giorno">
        <Carta className="p-4 flex flex-col gap-3">
          <Titolo icona={<Timer size={19} />}>Minuti di studio al giorno</Titolo>
          <Scelte nome="Minuti di studio al giorno" valori={MINUTI_OPZIONI} scelto={ob.minutiGiorno} onScegli={v => imposta({ minutiGiorno: v })} formato={v => `${v} min`} />
          <div>
            <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
              <span className="text-testo">Oggi</span>
              <span className="text-testo-tenue tabular-nums">{formatoDurata(giorno.secondi)} su {ob.minutiGiorno} min</span>
            </div>
            <div className="mt-1.5"><Barra valore={giorno.quota * 100} colore={giorno.raggiunto ? 'var(--color-alto)' : 'var(--color-azione)'} /></div>
            <p className="mt-2 text-[13px] leading-[18px] text-testo">
              {giorno.raggiunto ? 'Obiettivo di oggi raggiunto.' : giorno.secondi === 0 ? 'Oggi non hai ancora studiato.' : `Ti mancano ${Math.max(1, Math.ceil((giorno.obiettivoSecondi - giorno.secondi) / 60))} min.`}
              {' '}Negli ultimi {settimana.giorni} giorni l'hai raggiunto {settimana.raggiunti} {settimana.raggiunti === 1 ? 'volta' : 'volte'}.
            </p>
          </div>
          <p className="text-[12px] leading-[17px] text-testo-tenue">Il tempo conta mentre fai esercizi, simulazioni e il diagnostico.</p>
        </Carta>
      </Sezione>

      <Sezione titolo="Obiettivo di probabilità" id="titolo-stima">
        <Carta className="p-4 flex flex-col gap-3">
          <Titolo icona={<Gauge size={19} />}>Probabilità stimata di superare il test</Titolo>
          <Scelte nome="Probabilità da raggiungere" valori={STIMA_OPZIONI} scelto={ob.stimaTarget} onScegli={v => imposta({ stimaTarget: v })} formato={v => `${v} %`} />
          {av.corrente === null ? (
            <>
              <p className="text-[13.5px] leading-[19px] text-testo-tenue">Non c'è ancora una stima: la fanno il diagnostico e le simulazioni.</p>
              <button type="button" onClick={() => { playTapSound(); vaiHome(); }} className="brand-premibile self-start h-10 px-4 rounded-full bg-azione text-azione-su text-[14px] font-semibold">Vai alla home</button>
            </>
          ) : (
            <div>
              <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="text-testo">Ora <span className="font-bold tabular-nums">{av.corrente} %</span></span>
                <span className="text-testo-tenue tabular-nums">obiettivo {av.target} %</span>
              </div>
              <div className="mt-1.5"><Barra valore={av.quota * 100} colore={av.raggiunto ? 'var(--color-alto)' : 'var(--color-azione)'} /></div>
              <p className="mt-2 text-[13px] leading-[18px] text-testo">
                {av.raggiunto ? 'Hai raggiunto la probabilità che ti eri dato.' : `Mancano ${av.mancano} punti percentuali.`}
              </p>
              <p className="mt-1 text-[12px] leading-[17px] text-testo-tenue">La stima cambia solo con il diagnostico e le simulazioni, non con gli esercizi.</p>
              {!av.raggiunto && <button type="button" onClick={() => { playTapSound(); avviaSimulazione(); }} className="brand-premibile mt-3 h-10 px-4 rounded-full bg-azione-tinta text-azione-scuro text-[14px] font-semibold">Fai una simulazione</button>}
            </div>
          )}
        </Carta>
      </Sezione>
    </Pagina>
  );
}
