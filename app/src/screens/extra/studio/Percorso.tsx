// «Percorso»: le lezioni in ordine didattico (una per argomento di teoria), con stato a icona e minuti.
// Aprire una lezione = `lezione-dettaglio` (teoria, esercizi, verifica). Concept: 49 (scheda 4, elenco lezioni), 31 (11-13), 25.
// Nessuna frase: stati a icona, numeri accanto a icone. Gli stati vengono dai progressi veri (lib/studio/percorso.ts).
import { useMemo } from 'react';
import { useExtra } from '../contesto';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { lezioniPercorso, prossimaLezione, titoloBreve, type LezionePercorso } from '../../../lib/studio/percorso';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { famigliaDi } from '../../../lib/studio/famiglie';
import { Pagina, Bottone, StatoVuoto, BarraTono, ChipLivello, Arte, TesseraArte } from './comune';

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
  const famiglia = famigliaDi(l.topic.id);
  return (
    <li className={prossima ? 'my-1' : 'border-b border-linea last:border-b-0'}>
      <button type="button" onClick={() => { playTapSound(); onApri(); }}
        aria-label={`${titolo}, ${st.nome}`}
        className={cn('brand-premibile -mx-3 w-[calc(100%+24px)] flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-left', prossima && 'bg-azione-tinta')}>
        <TesseraArte nome={famiglia.illustrazione} lato={48} className={prossima ? 'bg-superficie' : 'bg-superficie-2'} />
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] leading-[20px] font-bold text-testo break-words">{titolo}</span>
          {l.stato === 'in-corso' && (
            <span className="mt-1.5 flex items-center gap-2.5">
              <BarraTono valore={percento} tono="azione" className="h-[6px] flex-1" />
              <span className="shrink-0 text-[12px] leading-[14px] font-semibold tabular-nums text-azione-testo">{l.imparate}/{totale}</span>
            </span>
          )}
        </span>
        <span className="shrink-0 inline-flex items-center gap-1 text-[12.5px] leading-[17px] tabular-nums text-testo-tenue">
          <Icona nome="tempo" size={14} />{l.minuti.totale}
        </span>
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

  return (
    <Pagina titolo="Percorso" onIndietro={indietro} destra={<Arte nome="studio-inglese" kit="kit-luminoso" lato={132} className="-mt-3 -mb-3" />}>
      {lezioni.length === 0 ? (
        <div className="mt-6"><StatoVuoto illustrazione={{ nome: 'vuoto' }} titolo="Nessuna lezione" /></div>
      ) : (
        <div className="mt-4 rounded-[16px] bg-superficie-2 p-4">
          <div className="flex items-center gap-4">
            <Arte nome="piano-superamento" lato={84} />
            <div className="flex-1 min-w-0">
              <p role="img" aria-label={`${fatte} lezioni su ${lezioni.length}`} className="text-[32px] leading-[34px] font-extrabold tabular-nums text-alto-numero">
                {fatte}<span className="text-[16px] font-bold text-testo-tenue">/{lezioni.length}</span>
              </p>
              <BarraTono valore={(fatte / lezioni.length) * 100} tono="alto" className="mt-2.5 h-2" />
            </div>
          </div>
          {prossima && (
            <div className="mt-4">
              <Bottone onClick={() => vaiLezione(prossima)} icona={<Icona nome="studia" size={18} />}>
                {fatte === 0 && prossima.stato === 'da-iniziare' ? 'Inizia' : 'Continua'}
              </Bottone>
            </div>
          )}
        </div>
      )}

      {LIVELLI.map(liv => {
        const delLivello = lezioni.filter(l => l.topic.livello === liv);
        if (delLivello.length === 0) return null;
        const fatteLiv = delLivello.filter(l => l.stato === 'imparata').length;
        return (
          <section key={liv} aria-labelledby={`liv-${liv}`} className="mt-6 flex flex-col gap-1">
            <h2 id={`liv-${liv}`} className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center"><ChipLivello livello={liv} className="text-[14px] leading-[18px] px-2 py-1" /><span className="sr-only"> livello {liv}</span></span>
              <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold tabular-nums text-testo-tenue">
                <Icona nome="stato-imparata" size={15} />{fatteLiv}/{delLivello.length}
              </span>
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
