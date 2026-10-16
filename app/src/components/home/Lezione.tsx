import { Icona } from '../../brand/icone/Icona';
import { Illustrazione } from '../../brand/Illustrazione';
import { TitoloSezione, LinkTutte } from './Stima';
import { arteArgomento } from './arte';
import { titoloBreve, type LezionePercorso } from '../../lib/studio/percorso';
import { playTapSound } from '../../lib/audio';

/** Tessera quadrata con l'illustrazione dell'argomento (una per famiglia di argomenti), come la tessera del libro del concept 14. */
export function TesseraArgomento({ topicId, lato = 56 }: { topicId: string; lato?: number }) {
  return (
    <span aria-hidden="true" className="shrink-0 rounded-[13px] bg-superficie grid place-items-center shadow-[0_1px_4px_rgba(15,23,42,0.07)] dark:shadow-none dark:bg-azione-tinta"
      style={{ width: lato, height: lato }}>
      <Illustrazione nome={arteArgomento(topicId)} lato={Math.round(lato * 0.78)} />
    </span>
  );
}

/** Una riga del concept: tessera, livello in maiuscolo grigio, titolo breve, barra verde (domande imparate) e «n/m». */
export function RigaLezione({ lezione, onApri }: { lezione: LezionePercorso; onApri: () => void }) {
  const { imparate, intere: totale } = lezione;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  const titolo = titoloBreve(lezione.topic);
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${titolo}: ${imparate} su ${totale} domande imparate`}
      className="brand-premibile w-full flex items-center gap-[14px] rounded-[12px] bg-superficie-2 p-[9px] pr-[10px] text-left">
      <TesseraArgomento topicId={lezione.topic.id} />
      <span className="flex-1 min-w-0">
        <span className="block text-[11px] leading-[13px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">{lezione.topic.livello}</span>
        <span className="block text-[15px] leading-[20px] font-bold text-testo truncate">{titolo}</span>
        <span className="mt-[5px] flex items-center gap-3">
          <span className="flex-1 min-w-[40px] h-[7px] rounded-full bg-linea overflow-hidden">
            <span className="block h-full rounded-full" style={{ width: `${valore}%`, background: 'linear-gradient(90deg, var(--color-alto-chiaro), var(--color-alto))' }} />
          </span>
          <span className={`shrink-0 inline-flex items-center gap-1 text-[12.5px] leading-[14px] font-semibold tabular-nums ${imparate > 0 ? 'text-alto-testo' : 'text-testo-tenue'}`}>
            <Icona nome="imparate" size={14} />{imparate}/{totale}
          </span>
        </span>
      </span>
      <Icona nome="avanti" size={22} className="shrink-0 text-testo-tenue" />
    </button>
  );
}

/** «Lezioni»: le prossime tre del percorso (le prime non ancora imparate) e «Tutte» che apre il percorso. */
export default function Lezioni({ lezioni, onApri, onTutte }: {
  lezioni: LezionePercorso[]; onApri: (id: string) => void; onTutte?: () => void;
}) {
  return (
    <section aria-labelledby="titolo-lezioni" className="flex flex-col gap-[10px]">
      <TitoloSezione id="titolo-lezioni" destra={onTutte ? <LinkTutte onClick={onTutte} aria="Tutte le lezioni" /> : undefined}>Lezioni</TitoloSezione>
      {lezioni.length === 0 ? (
        <div role="status" className="rounded-[12px] bg-alto-tinta flex items-center gap-3 p-[14px]">
          <Icona nome="stato-imparata" size={28} className="text-alto-numero" />
          <span className="text-[15px] font-bold text-testo">Tutte imparate</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {lezioni.map(l => <li key={l.topic.id}><RigaLezione lezione={l} onApri={() => onApri(l.topic.id)} /></li>)}
        </ul>
      )}
    </section>
  );
}
