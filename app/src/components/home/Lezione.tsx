import { Icona } from '../../brand/icone/Icona';
import { TitoloSezione, LinkTutte } from './Stima';
import { ChipLivello, TesseraLezione } from '../../screens/extra/studio/comune';
import { titoloBreve, type LezionePercorso } from '../../lib/studio/percorso';
import { playTapSound } from '../../lib/audio';
import { Barra } from './comune';

/**
 * Riga di una lezione del percorso, secondaria rispetto al pulsante: bordo leggero, tessera da 36, titolo 15/20, sotto livello e domande
 * oppure la barra delle imparate (compare solo se qualcosa è già imparato). Nessuna illustrazione.
 */
export function RigaLezione({ lezione, onApri }: { lezione: LezionePercorso; onApri: () => void }) {
  const { imparate, intere: totale } = lezione;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  const titolo = titoloBreve(lezione.topic);
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${titolo}: ${imparate} su ${totale} domande imparate`}
      className="brand-premibile w-full flex items-center gap-3 rounded-xl border border-linea dark:border-tacca bg-superficie px-3 py-2 text-left">
      <TesseraLezione numero={lezione.numero} lato={36} tono="neutra" />
      <span className="flex-1 min-w-0">
        <span className="block text-s2 leading-[20px] font-semibold text-testo truncate">{titolo}</span>
        {imparate > 0 ? (
          <span className="mt-1 flex items-center gap-3">
            <span className="flex-1 min-w-[40px]"><Barra valore={valore} colore="var(--color-alto)" alta={6} /></span>
            <span className="shrink-0 text-s1 leading-[16px] font-semibold tabular-nums text-alto-testo">{imparate}/{totale} imparate</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-s1 leading-[16px] text-testo-tenue"><ChipLivello livello={lezione.topic.livello} />{totale} domande</span>
        )}
      </span>
      <Icona nome="avanti" size={18} className="shrink-0 text-testo-tenue" />
    </button>
  );
}

/**
 * «Prossima lezione»: le prime tre non imparate del percorso, come righe compatte (la prima è la prossima). «Tutte le lezioni» apre il percorso.
 * Tutte imparate: una riga che lo dice.
 */
export default function Lezioni({ lezioni, onApri, onTutte }: {
  lezioni: LezionePercorso[]; onApri: (id: string) => void; onTutte?: () => void;
}) {
  return (
    <section aria-labelledby="titolo-lezioni" className="flex flex-col gap-3">
      <TitoloSezione id="titolo-lezioni" destra={onTutte ? <LinkTutte onClick={onTutte} aria="Tutte le lezioni" testo="Tutte le lezioni" /> : undefined}>Prossima lezione</TitoloSezione>
      {lezioni.length === 0 ? (
        <div role="status" className="flex items-center gap-3 rounded-xl border border-linea dark:border-tacca bg-superficie px-3 py-3">
          <Icona nome="stato-imparata" size={22} className="shrink-0 text-alto-numero" />
          <span className="text-s2 leading-[20px] font-bold text-testo">Tutte imparate</span>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {lezioni.map(l => <li key={l.topic.id}><RigaLezione lezione={l} onApri={() => onApri(l.topic.id)} /></li>)}
        </ul>
      )}
    </section>
  );
}
