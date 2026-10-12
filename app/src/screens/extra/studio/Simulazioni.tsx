// «Le mie simulazioni»: la card della nuova simulazione (test di recupero LinguaViva) e l'elenco di quelle svolte (appState.history).
// Concept: 36 e 49 («Le mie simulazioni»), 18 («Simulatore d'esame»). Barra in basso: Simulazioni.
import { useMemo } from 'react';
import { CheckCircle2, ChevronRight, Clock, Lock, XCircle } from 'lucide-react';
import { useExtra } from '../contesto';
import { FORMATS } from '../../../config/offer';
import { elencoSimulazioni, limiteGratuito, FORMATO_SIMULAZIONE } from '../../../lib/studio/simulazioni';
import { IllustrazioneAnimata } from '../../../brand/IllustrazioneAnimata';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, Carta, Bottone, StatoVuoto, TitoloSezione, dataBreve, minSec } from './comune';

export default function Simulazioni() {
  const { appState, pass, vai, indietro, avviaSimulazione } = useExtra();
  const f = FORMATS[FORMATO_SIMULAZIONE];
  const elenco = useMemo(() => elencoSimulazioni(appState.history), [appState.history]);
  const limite = useMemo(() => limiteGratuito(appState, pass), [appState, pass]);
  const migliore = elenco.length > 0 ? Math.max(...elenco.map(s => s.esatte)) : null;

  return (
    <Pagina titolo="Simulazioni" onIndietro={indietro}
      destra={<IllustrazioneAnimata nome="quiz-test" lato={84} />}
      sotto="Allenati nel formato del test di recupero.">
      <Carta className="mt-4 p-4">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">Nuova simulazione</p>
        <h2 className="mt-1 text-[18px] leading-[24px] font-extrabold text-testo">Test di recupero</h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[14px] leading-[20px] text-testo">
          <li><span className="font-bold tabular-nums">{f.questions}</span> domande</li>
          <li><span className="font-bold tabular-nums">{f.minutes}</span> minuti</li>
          <li>soglia <span className="font-bold tabular-nums">{f.passMark}/{f.questions}</span></li>
        </ul>
        <p className="mt-2 text-[13px] leading-[18px] text-testo-tenue">
          {pass
            ? 'Con il Pass le simulazioni sono illimitate.'
            : limite.puoiIniziare
              ? `Gratis hai ${limite.restanti === 1 ? '1 simulazione' : `${limite.restanti} simulazioni`}; le altre sono nel Pass.`
              : 'La simulazione gratuita l’hai già fatta: le altre sono nel Pass.'}
        </p>
        <div className="mt-3.5 flex flex-col gap-2">
          <Bottone onClick={avviaSimulazione} icona={!pass && !limite.puoiIniziare ? <Lock size={17} aria-hidden="true" /> : undefined}>
            {!pass && !limite.puoiIniziare ? 'Altre simulazioni con il Pass' : 'Inizia la simulazione'}
          </Bottone>
          <Bottone variante="secondario" onClick={() => vai('simulazione-dettaglio')}>Cosa contiene e come si calcola</Bottone>
        </div>
      </Carta>

      <section aria-labelledby="titolo-svolte" className="mt-7 flex flex-col gap-2.5">
        <TitoloSezione id="titolo-svolte" destra={elenco.length > 0 && migliore !== null
          ? <span className="text-[13px] text-testo-tenue">Migliore <span className="font-bold tabular-nums text-testo">{migliore}/{f.questions}</span></span> : undefined}>
          Le mie simulazioni
        </TitoloSezione>
        {elenco.length === 0 ? (
          <StatoVuoto titolo="Nessuna simulazione ancora" testo="Quando ne fai una, la ritrovi qui con il punteggio, il tempo e le correzioni." />
        ) : (
          <ul className="flex flex-col gap-2">
            {elenco.map(s => (
              <li key={s.id}>
                <button type="button" onClick={() => { playTapSound(); vai('simulazione-dettaglio', { id: s.id }); }}
                  aria-label={`Simulazione ${s.numero}, ${dataBreve(s.data)}: ${s.esatte} su ${s.totale}, ${s.superata ? 'superata' : 'non superata'}`}
                  className="brand-premibile w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 p-3 pr-2.5 text-left">
                  <span className="min-w-[58px] text-center" aria-hidden="true">
                    <span className="block text-[22px] leading-[26px] font-extrabold tabular-nums text-testo">{s.esatte}</span>
                    <span className="block text-[12px] leading-[14px] text-testo-tenue">su {s.totale}</span>
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] leading-[20px] font-bold text-testo">Simulazione {s.numero}</span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12.5px] leading-[17px] text-testo-tenue">
                      <span>{dataBreve(s.data)}</span>
                      {s.tempoSecondi > 0 && <><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{minSec(s.tempoSecondi)}</span></>}
                    </span>
                    <span className={cn('mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold', s.superata ? 'bg-alto-tinta text-alto-testo' : 'bg-basso-tinta text-basso-testo')}>
                      {s.superata ? <CheckCircle2 size={13} aria-hidden="true" /> : <XCircle size={13} aria-hidden="true" />}
                      {s.superata ? 'Superata' : 'Non superata'}
                    </span>
                  </span>
                  <ChevronRight size={22} strokeWidth={2} className="shrink-0 text-testo-tenue" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[12.5px] leading-[18px] text-testo-tenue">Una simulazione ti dice come stai andando: non prevede il risultato del test vero.</p>
      </section>
    </Pagina>
  );
}
