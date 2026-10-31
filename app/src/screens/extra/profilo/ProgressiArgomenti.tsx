import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { REGOLA_IMPARATA } from '../../../components/home/comune';
import { MIN_RISPOSTE } from '../../../components/home/stima';
import { REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../../../config/offer';
import { playTapSound } from '../../../lib/audio';
import { analizzaLivello, argomentiRadar, MIN_RISPOSTE_ARGOMENTO, SOGLIA_DA_MIGLIORARE, type ArgomentoAnalisi } from '../../../lib/servizi/analisi';
import { BarraTono, Carta, FoglioInfo, TONI, type Tono } from '../ui';
import { useExtra } from '../contesto';
import Radar from '../servizi/Radar';
import { BottoneAzione, Vuoto } from '../servizi/componenti';
import { SOGLIA_DA_RIPASSARE, TESTO_TONO, tonoAccuratezza } from '../servizi/tono';

const TONO_LIVELLO: Record<string, Tono> = { A1: 'azione', A2: 'viola', B1: 'medio' };

function RigaArgomento({ a, onApri }: { a: ArgomentoAnalisi; onApri: () => void }) {
  const dato = a.percento !== null;
  const tono = tonoAccuratezza(a.percento);
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }} aria-label={`${a.titolo}: apri la lezione`}
      className="brand-premibile block w-full px-1 py-3 text-left">
      <span className="flex items-baseline justify-between gap-3">
        <span data-testo-ok className="min-w-0 text-[15px] leading-[21px] font-semibold text-testo">{a.titolo}</span>
        <span className={`shrink-0 text-[14px] tabular-nums ${dato ? 'font-bold' : ''} ${TESTO_TONO[tono ?? 'nessuno']}`}>{dato ? `${a.percento}%` : '–'}</span>
      </span>
      <span className="mt-2 block"><BarraTono valore={dato ? a.percento! : 0} tono={tono ?? 'azione'} className="h-1.5" /></span>
      <span className="mt-2 flex items-center gap-3 text-[12px] leading-[16px] text-testo-tenue tabular-nums">
        <span className={`rounded-full px-2 font-bold ${TONI[TONO_LIVELLO[a.livello] ?? 'azione'].tinta} ${TONI[TONO_LIVELLO[a.livello] ?? 'azione'].testo}`}>{a.livello}</span>
        <span>{a.risposte} {a.risposte === 1 ? 'risposta' : 'risposte'}</span>
        <span>{a.imparate} di {a.totaleDomande} imparate</span>
      </span>
    </button>
  );
}

/** Analisi del livello, argomento per argomento: radar e barre calcolati sulle risposte dell'utente. Nessun confronto con altri. */
export default function ProgressiArgomenti() {
  const { appState, vai, avviaEsercizi } = useExtra();
  const an = useMemo(() => analizzaLivello(appState), [appState]);
  const radar = useMemo(() => argomentiRadar(an.argomenti), [an.argomenti]);
  const [tutti, setTutti] = useState(false);
  const [info, setInfo] = useState(false);

  // prima gli argomenti con dati (dal più debole), poi quelli senza
  const ordinati = useMemo(() => {
    const con = an.argomenti.filter(a => a.percento !== null).sort((x, y) => (x.percento ?? 0) - (y.percento ?? 0) || y.risposte - x.risposte);
    const poche = an.argomenti.filter(a => a.percento === null && a.risposte > 0);
    const senza = an.argomenti.filter(a => a.risposte === 0);
    return { iniziali: [...con, ...poche], senza };
  }, [an.argomenti]);
  const mostrati = tutti ? [...ordinati.iniziali, ...ordinati.senza] : ordinati.iniziali.slice(0, 6);
  const altri = (tutti ? 0 : ordinati.iniziali.slice(6).length + ordinati.senza.length);

  if (!an.haDati) {
    return (
      <Vuoto className="mt-4" illustrazione="progressi-statistiche" titolo="Ancora nessun argomento" causa="Servono tre risposte su un argomento per vederlo qui."
        azioni={<BottoneAzione icona={<Icona nome="studia" size={20} />} onClick={() => avviaEsercizi('smart')}>Inizia a studiare</BottoneAzione>} />
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-3">
      {radar.length > 0 && (
        <Carta>
          <Radar assi={radar.map(a => ({ nome: a.nome, valore: a.percento ?? 0 }))}
            descrizione={`Radar dell'accuratezza su ${radar.length} argomenti: ${radar.map(a => `${a.nome} ${a.percento} per cento`).join(', ')}.`} />
          <ul className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Colori">
            {/* ogni fascia ha il suo colore, la sua forma (icona) e la sua parola: mai il solo colore */}
            {([['alto', 'Solido', 'stato-ok'], ['medio', 'Da migliorare', 'stato-medio'], ['basso', 'Da ripassare', 'stato-da-ripassare']] as const).map(([t, nome, icona]) => (
              <li key={t} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] leading-[16px] font-bold ${TONI[t].tinta} ${TONI[t].testo}`}>
                <Icona nome={icona} size={14} />{nome}
              </li>
            ))}
          </ul>
        </Carta>
      )}

      <Carta className="px-3 py-1">
        <ul className="flex flex-col divide-y divide-linea">
          {mostrati.map(a => <li key={a.id}><RigaArgomento a={a} onApri={() => vai('lezione-dettaglio', { id: a.id })} /></li>)}
        </ul>
        {(altri > 0 || tutti) && (
          <button type="button" onClick={() => { playTapSound(); setTutti(v => !v); }} aria-expanded={tutti}
            className="brand-premibile flex min-h-[44px] w-full items-center justify-center gap-1.5 border-t border-linea text-[14px] font-bold text-azione-testo">
            <Icona nome="espandi" size={18} className={tutti ? 'rotate-180' : undefined} />{tutti ? 'Mostra meno argomenti' : `Mostra tutti i ${an.argomenti.length} argomenti`}
          </button>
        )}
      </Carta>

      <button type="button" onClick={() => { playTapSound(); setInfo(true); }}
        className="brand-premibile mx-auto inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-testo-tenue hover:text-testo"><Icona nome="info" size={18} />Come si calcola</button>

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Come si calcola">
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>Calcolata sulle tue risposte, argomento per argomento. Nessun confronto con altri studenti e nessun chatbot: sono conti fatti sul tuo dispositivo.</li>
          <li>Verde: da {SOGLIA_DA_MIGLIORARE} % di risposte esatte (più o meno la soglia del test). Ambra: da migliorare. Corallo: sotto {SOGLIA_DA_RIPASSARE} %, da ripassare. La linea tratteggiata del radar è l'{SOGLIA_DA_MIGLIORARE} %.</li>
          <li>La percentuale compare da {MIN_RISPOSTE_ARGOMENTO} risposte su un argomento; il radar da 3 argomenti con dati. Per il livello per tipo di domanda servono almeno {MIN_RISPOSTE} risposte.</li>
          <li>{REGOLA_IMPARATA}</li>
          <li>Le domande lasciate senza risposta in simulazione contano come errori nella stima, perché al test valgono zero; negli argomenti non sono errori di conoscenza.</li>
          <li>La stima di superare il test è la probabilità di fare almeno {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. Non è una promessa: non dice come andrà il test vero.</li>
        </ul>
      </FoglioInfo>
    </div>
  );
}
