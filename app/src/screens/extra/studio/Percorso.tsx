// «Percorso»: le lezioni in ordine didattico (una per argomento di teoria), con stato a icona e minuti.
// Aprire una lezione = `lezione-dettaglio` (teoria, esercizi, verifica). Concept: 49 (scheda 4, elenco lezioni), 31 (11-13), 25.
// Ogni riga ha il suo numero (niente miniature ripetute), i minuti a parole e lo stato a icona. Gli stati vengono dai progressi veri (lib/studio/percorso.ts).
import { useMemo } from 'react';
import { useExtra } from '../contesto';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { lezioniPercorso, prossimaLezione, titoloBreve, type LezionePercorso } from '../../../lib/studio/percorso';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, Bottone, StatoVuoto, BarraTono, ChipLivello, TesseraLezione, Arte } from './comune';

const LIVELLI = ['A1', 'A2', 'B1'] as const;

const STATO: Record<LezionePercorso['stato'], { icona: NomeIcona; colore: string; nome: string }> = {
  imparata: { icona: 'stato-imparata', colore: 'text-alto-numero', nome: 'imparata' },
  'in-corso': { icona: 'stato-in-corso', colore: 'text-azione-testo', nome: 'in corso' },
  'da-iniziare': { icona: 'stato-da-iniziare', colore: 'text-testo-tenue', nome: 'da iniziare' },
};

function Riga({ l, prossima, onApri }: { l: LezionePercorso; prossima: boolean; onApri: () => void }) {
  const st = STATO[l.stato];
  const totale = l.intere;
  const percento = totale > 0 ? Math.round((l.imparate / totale) * 100) : 0;
  const titolo = titoloBreve(l.topic);
  return (
    <li className="border-b border-linea last:border-b-0">
      <button type="button" onClick={() => { playTapSound(); onApri(); }}
        aria-label={`Lezione ${l.numero}: ${titolo}, ${st.nome}${prossima ? ', la prossima' : ''}`}
        className={cn('brand-premibile flex w-full items-center gap-3 py-2.5 text-left', prossima ? 'border-l-[3px] border-azione pl-3 pr-1' : 'pr-1')}>
        {/* Il numero della lezione: ogni riga è diversa dalle altre, niente miniature che si ripetono */}
        <TesseraLezione numero={l.numero} lato={44} tono={prossima ? 'azione' : 'neutra'} />
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] leading-[20px] font-bold text-testo break-words">{titolo}</span>
          {prossima && <span className="mt-0.5 block text-[12.5px] leading-[16px] font-bold text-azione-testo">Prossima</span>}
          {l.stato === 'in-corso' && (
            <span className="mt-1.5 flex items-center gap-2.5">
              <BarraTono valore={percento} tono="azione" className="h-[6px] flex-1" />
              <span className="shrink-0 text-[12px] leading-[14px] font-semibold tabular-nums text-azione-testo">{l.imparate} di {totale}</span>
            </span>
          )}
        </span>
        <span className="shrink-0 text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">{l.minuti.totale} min</span>
        <span aria-hidden="true" className={cn('shrink-0', st.colore)}><Icona nome={st.icona} size={26} /></span>
      </button>
    </li>
  );
}

export default function Percorso() {
  const { appState, vai, indietro } = useExtra();
  const lezioni = useMemo(() => lezioniPercorso(appState), [appState]);
  const fatte = lezioni.filter(l => l.stato === 'imparata').length;
  const prossima = prossimaLezione(lezioni);
  const vaiLezione = (l: LezionePercorso) => vai('lezione-dettaglio', { id: l.topic.id });
  const daCapo = fatte === 0 && prossima?.stato === 'da-iniziare';

  return (
    <Pagina titolo="Percorso" onIndietro={indietro}>
      {lezioni.length === 0 ? (
        <div className="mt-6"><StatoVuoto illustrazione={{ nome: 'vuoto' }} titolo="Nessuna lezione" testo="Le lezioni non sono state caricate.">
          <Bottone variante="secondario" onClick={indietro} icona={<Icona nome="indietro" size={18} />}>Indietro</Bottone>
        </StatoVuoto></div>
      ) : (
        <div className="mt-4 rounded-[16px] bg-superficie-2 p-4">
          <div className="flex items-center gap-4">
            <Arte nome="piano-superamento" lato={72} />
            <div className="flex-1 min-w-0">
              <p aria-label={`${fatte} lezioni imparate su ${lezioni.length}`} className="text-[22px] leading-[28px] font-extrabold tabular-nums text-testo">
                <span className="text-alto-numero">{fatte}</span> di {lezioni.length} <span className="text-[15px] font-bold text-testo-tenue">lezioni</span>
              </p>
              <BarraTono valore={(fatte / lezioni.length) * 100} tono="alto" className="mt-2 h-2" />
            </div>
          </div>
          {prossima && (
            <>
              <p data-testo-ok className="mt-3 text-[14px] leading-[20px] text-testo-tenue">{daCapo ? 'Inizia dalla prima' : 'Prossima'}: <span className="font-bold text-testo">{titoloBreve(prossima.topic)}</span></p>
              <div className="mt-3">
                <Bottone onClick={() => vaiLezione(prossima)} icona={<Icona nome="studia" size={18} />}>{daCapo ? 'Inizia' : 'Continua'}</Bottone>
              </div>
            </>
          )}
        </div>
      )}

      {LIVELLI.map(liv => {
        const delLivello = lezioni.filter(l => l.topic.livello === liv);
        if (delLivello.length === 0) return null;
        const fatteLiv = delLivello.filter(l => l.stato === 'imparata').length;
        return (
          <section key={liv} aria-labelledby={`liv-${liv}`} className="mt-6 flex flex-col gap-1">
            <h2 id={`liv-${liv}`} className="flex items-center gap-2.5">
              <ChipLivello livello={liv} className="text-[14px] leading-[18px] px-2 py-1" /><span className="sr-only"> livello {liv}</span>
              <span className="text-[13px] font-semibold tabular-nums text-testo-tenue">{fatteLiv} di {delLivello.length} imparate</span>
            </h2>
            <ol className="flex flex-col">
              {delLivello.map(l => <Riga key={l.topic.id} l={l} prossima={prossima?.topic.id === l.topic.id} onApri={() => vaiLezione(l)} />)}
            </ol>
          </section>
        );
      })}
    </Pagina>
  );
}
