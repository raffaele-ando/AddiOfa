import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { OFA_DEADLINES, OFA_RULES_NOTE } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { formatoDurata } from '../../../lib/profilo/giorni';
import {
  avanzamentoGiornaliero, avanzamentoStima, giorniConObiettivo, giorniMancanti, MINUTI_OPZIONI, normalizzaObiettivi, OBIETTIVI_INIZIALI, STIMA_OPZIONI,
  type ObiettiviDati,
} from '../../../lib/profilo/obiettivi';
import { DOMANDE_TEST, SOGLIA_TEST } from '../../../lib/profilo/numeri';
import { BarraTono, Carta, FoglioInfo, IconaTono, PulsanteInfo } from '../ui';
import { useExtra, useExtraDati } from '../contesto';
import { BottoneSecondario } from '../servizi/componenti';
import CampoData from './CampoData';
import { Pagina, useNumeri, useOggi } from './componenti';

/** Scelta fra pochi valori: chip a colonne uguali, alti 44 px (cinque per riga: nessun chip rimane da solo a capo). */
function Scelte({ nome, valori, scelto, onScegli, formato }: { nome: string; valori: number[]; scelto: number; onScegli: (v: number) => void; formato: (v: number) => string }) {
  const elenco = valori.includes(scelto) ? valori : [...valori, scelto].sort((a, b) => a - b);
  return (
    <div role="radiogroup" aria-label={nome} className="grid grid-cols-5 gap-2">
      {elenco.map(v => (
        <button key={v} type="button" role="radio" aria-checked={scelto === v} onClick={() => { playTapSound(); onScegli(v); }}
          className={cn('brand-premibile h-11 rounded-[12px] border text-[15px] font-semibold tabular-nums',
            scelto === v ? 'border-azione border-[1.5px] bg-azione-tinta text-azione-testo' : 'border-linea bg-superficie text-testo')}>
          {formato(v)}
        </button>
      ))}
    </div>
  );
}

const Domanda = ({ id, children, sotto }: { id: string; children: string; sotto?: string }) => (
  <div>
    <h2 id={id} className="text-[17px] leading-[24px] font-bold text-testo">{children}</h2>
    {sotto && <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">{sotto}</p>}
  </div>
);

/** Obiettivi: in testa la scheda dell'obiettivo principale (la probabilità SALE verso il traguardo: barra e numero vanno nello stesso verso), poi le tre scelte dell'utente. */
export default function Obiettivi() {
  const { appState, indietro, avviaDiagnostico } = useExtra();
  const [grezzi, salva] = useExtraDati<ObiettiviDati>('obiettivi', OBIETTIVI_INIZIALI);
  const ob = useMemo(() => normalizzaObiettivi(grezzi), [grezzi]);
  const oggi = useOggi();
  const n = useNumeri();
  const [foglio, setFoglio] = useState(false);
  const imposta = (p: Partial<ObiettiviDati>) => salva(normalizzaObiettivi({ ...ob, ...p }));

  const mancano = giorniMancanti(ob.dataTest, oggi);
  const giorno = useMemo(() => avanzamentoGiornaliero(appState, oggi, ob.minutiGiorno), [appState, oggi, ob.minutiGiorno]);
  const settimana = useMemo(() => giorniConObiettivo(appState, oggi, ob.minutiGiorno, 7), [appState, oggi, ob.minutiGiorno]);
  const av = avanzamentoStima(n.stima?.p, ob.stimaTarget);
  const anni = useMemo(() => [oggi.getFullYear(), oggi.getFullYear() + 1, oggi.getFullYear() + 2], [oggi]);

  return (
    <Pagina titolo="Obiettivi" indietro={indietro} destra={<PulsanteInfo onClick={() => setFoglio(true)} etichetta="Come funzionano gli obiettivi" />}>
      <Carta tono={av.raggiunto ? 'alto' : 'azione'} className="mt-3">
        <div className="flex items-center gap-3">
          <IconaTono tono="azione" lato={48} className="bg-superficie dark:bg-superficie-2"><Icona nome="obiettivi" size={26} /></IconaTono>
          <div className="min-w-0 flex-1">
            <h2 className="text-[17px] leading-[24px] font-bold text-testo">Superare il test</h2>
            <p className="text-[13px] leading-[18px] text-testo-tenue">{SOGLIA_TEST} risposte giuste su {DOMANDE_TEST}</p>
          </div>
          {av.raggiunto && <span role="img" aria-label="Raggiunto" className="text-alto-numero"><Icona nome="stato-ok" size={24} /></span>}
        </div>
        {av.corrente !== null ? (
          <>
            <div className="mt-4 flex items-baseline justify-between gap-3">
              <p className="text-[30px] leading-[34px] font-extrabold tabular-nums text-testo">{av.corrente}%<span className="ml-1.5 text-[14px] font-semibold text-testo-tenue">probabilità ora</span></p>
              <p className="text-[14px] leading-[20px] font-bold tabular-nums text-testo">Obiettivo {av.target}%</p>
            </div>
            <BarraTono className="mt-2 h-2.5" tono="alto" valore={av.quota * 100} />
            <p className="mt-2 text-[13px] leading-[18px] text-testo-tenue">{av.raggiunto ? 'Obiettivo raggiunto.' : `Mancano ${av.mancano} punti percentuali.`}</p>
          </>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <p data-testo-ok className="text-[14px] leading-[20px] text-testo-tenue">Non c'è ancora una stima: la calcola il test di livello.</p>
            <BottoneSecondario icona={<Icona nome="diagnostico" size={20} />} onClick={avviaDiagnostico}>Fai il test di livello</BottoneSecondario>
          </div>
        )}
      </Carta>

      <div className="mt-3 flex flex-col gap-3">
        <Carta as="section" className="flex flex-col gap-3">
          <Domanda id="ob-data" sotto="Ti diciamo quanti giorni mancano.">Quando fai il test?</Domanda>
          <CampoData valore={ob.dataTest} onCambia={v => imposta({ dataTest: v })} anni={anni} />
          {mancano && (
            <div className="flex items-center justify-between gap-3" aria-live="polite">
              <p className="text-[17px] leading-[24px] font-extrabold tabular-nums text-testo">
                {mancano.quando === 'oggi' ? 'Il test è oggi'
                  : mancano.quando === 'futuro' ? `Mancano ${mancano.giorni} ${mancano.giorni === 1 ? 'giorno' : 'giorni'}`
                  : `Data passata da ${-mancano.giorni} ${-mancano.giorni === 1 ? 'giorno' : 'giorni'}`}
              </p>
              <button type="button" onClick={() => { playTapSound(); imposta({ dataTest: null }); }}
                className="brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-[12px] px-3 text-[14px] font-bold text-testo-tenue"><Icona nome="chiudi" size={16} />Togli la data</button>
            </div>
          )}
        </Carta>

        <Carta as="section" className="flex flex-col gap-3">
          <Domanda id="ob-minuti" sotto="Minuti di studio al giorno.">Quanto studi al giorno?</Domanda>
          <Scelte nome="Minuti di studio al giorno" valori={MINUTI_OPZIONI} scelto={ob.minutiGiorno} onScegli={v => imposta({ minutiGiorno: v })} formato={v => `${v}`} />
          <div>
            <div className="flex items-center justify-between gap-3 text-[14px] leading-[20px]">
              <span className="font-semibold text-testo">Oggi {formatoDurata(giorno.secondi)} · obiettivo {ob.minutiGiorno} min</span>
              {giorno.raggiunto && <span role="img" aria-label="Raggiunto" className="text-alto-numero"><Icona nome="stato-ok" size={20} /></span>}
            </div>
            <BarraTono className="mt-1.5" tono="medio" valore={giorno.quota * 100} />
            <p className="mt-2 text-[13px] leading-[18px] tabular-nums text-testo-tenue">{settimana.raggiunti} giorni su {settimana.giorni} questa settimana</p>
          </div>
        </Carta>

        <Carta as="section" className="flex flex-col gap-3">
          <Domanda id="ob-prob" sotto="Probabilità di superare il test.">Quanto vuoi esserne sicuro?</Domanda>
          <Scelte nome="Probabilità da raggiungere" valori={STIMA_OPZIONI} scelto={ob.stimaTarget} onScegli={v => imposta({ stimaTarget: v })} formato={v => `${v}%`} />
          <p className="text-[14px] leading-[20px] font-semibold tabular-nums text-testo">{av.corrente !== null ? `Ora ${av.corrente}% · obiettivo ${av.target}%` : `Obiettivo ${av.target}%`}</p>
        </Carta>

        <Carta as="section">
          <h2 className="text-[17px] leading-[24px] font-bold text-testo">Scadenze</h2>
          <p data-testo-ok className="text-[13px] leading-[18px] text-testo-tenue">Per il piano completo del 2° anno</p>
          <dl className="mt-3 flex flex-col divide-y divide-linea">
            {OFA_DEADLINES.map(d => (
              <div key={d.scuola} className="flex items-baseline justify-between gap-3 py-2 first:pt-0 last:pb-0">
                <dt className="text-[15px] leading-[21px] text-testo-tenue">{d.scuola}</dt>
                <dd className="text-[15px] leading-[21px] font-bold text-testo">{d.data}</dd>
              </div>
            ))}
          </dl>
        </Carta>
      </div>
      <FoglioInfo aperto={foglio} onChiudi={() => setFoglio(false)} titolo="Come funzionano gli obiettivi">
        <p>La data è facoltativa e serve solo a te, per contare i giorni che mancano. Il tempo conta mentre fai esercizi, simulazioni e il test di livello. La probabilità è una stima: cambia solo con il test di livello e le simulazioni, non con gli esercizi, e dice quanto è probabile fare almeno {SOGLIA_TEST} risposte giuste su {DOMANDE_TEST}.</p>
        <p className="mt-2">Le scadenze sono quelle per avere il piano completo del 2° anno (calendario 2026/27). {OFA_RULES_NOTE}</p>
      </FoglioInfo>
    </Pagina>
  );
}
