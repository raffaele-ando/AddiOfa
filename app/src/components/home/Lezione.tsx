import { Icona, type NomeIcona } from '../../brand/icone/Icona';
import { TitoloSezione, LinkTutte } from './Stima';
import { ChipLivello, TesseraLezione } from '../../screens/extra/studio/comune';
import { titoloBreve, type LezionePercorso } from '../../lib/studio/percorso';
import { playTapSound } from '../../lib/audio';
import { Barra } from './comune';

function Dato({ icona, children }: { icona: NomeIcona; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] leading-[18px] font-medium tabular-nums text-testo-tenue">
      <Icona nome={icona} size={16} />{children}
    </span>
  );
}

/**
 * La carta «prossimo passo» (concept 33, ma NEUTRA: il colore di stato non passa sulla lezione): tessera, livello e numero,
 * titolo, tre dati veri (domande, minuti, imparate) e un pulsante che dice cosa fa. Ferma.
 */
export function ProssimaLezione({ lezione, onApri }: { lezione: LezionePercorso; onApri: () => void }) {
  const { imparate, intere, minuti, viste } = lezione;
  const titolo = titoloBreve(lezione.topic);
  const verbo = viste > 0 ? 'Riprendi la lezione' : 'Inizia la lezione';
  return (
    <div className="rounded-[16px] bg-superficie-2 p-4">
      <div className="flex items-center gap-3">
        <TesseraLezione numero={lezione.numero} lato={56} tono="carta" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] leading-[14px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">Lezione {lezione.numero} <ChipLivello livello={lezione.topic.livello} /></p>
          <p className="mt-0.5 text-[20px] leading-[26px] font-extrabold tracking-[-0.01em] text-testo break-words">{titolo}</p>
        </div>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Dato icona="risposte">{intere} domande</Dato>
        <Dato icona="tempo">{minuti.totale} min</Dato>
        <Dato icona="imparate">{imparate} imparate</Dato>
      </p>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} aria-label={`${verbo}: ${titolo}`}
        className="brand-premibile mt-3 w-full min-h-[48px] flex items-center justify-center gap-2 rounded-[12px] bg-azione-tinta text-azione-testo text-[15px] leading-[20px] font-bold">
        <Icona nome="studia" size={18} />{verbo}
      </button>
    </div>
  );
}

/**
 * Riga compatta di una lezione che viene dopo: tessera da 44, titolo 15/20, sotto livello e domande.
 * Il testo parte a 68 px dal bordo (12 + 44 + 12), come la fascia di stato e il pulsante. La barra compare solo se qualcosa è già imparato.
 */
export function RigaLezione({ lezione, onApri }: { lezione: LezionePercorso; onApri: () => void }) {
  const { imparate, intere: totale } = lezione;
  const valore = totale > 0 ? Math.max(0, Math.min(100, (imparate / totale) * 100)) : 0;
  const titolo = titoloBreve(lezione.topic);
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(); }}
      aria-label={`${titolo}: ${imparate} su ${totale} domande imparate`}
      className="brand-premibile w-full flex items-center gap-3 rounded-[14px] bg-superficie-2 p-3 pr-[10px] text-left">
      <TesseraLezione numero={lezione.numero} lato={44} tono="carta" />
      <span className="flex-1 min-w-0">
        <span className="block text-[15px] leading-[20px] font-bold text-testo truncate">{titolo}</span>
        {imparate > 0 ? (
          <span className="mt-1 flex items-center gap-3">
            <span className="flex-1 min-w-[40px]"><Barra valore={valore} colore="linear-gradient(90deg, var(--color-alto-chiaro), var(--color-alto))" alta={6} /></span>
            <span className="shrink-0 text-[12.5px] leading-[16px] font-semibold tabular-nums text-alto-testo">{imparate}/{totale} imparate</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[13px] leading-[18px] text-testo-tenue"><ChipLivello livello={lezione.topic.livello} />{totale} domande</span>
        )}
      </span>
      <Icona nome="avanti" size={20} className="shrink-0 text-testo-tenue" />
    </button>
  );
}

/**
 * «Prossima lezione»: la carta grande per la prima non imparata del percorso, poi «Poi» e al massimo due righe compatte.
 * «Tutte le lezioni» apre il percorso.
 */
export default function Lezioni({ lezioni, onApri, onTutte }: {
  lezioni: LezionePercorso[]; onApri: (id: string) => void; onTutte?: () => void;
}) {
  const [prima, ...dopo] = lezioni;
  return (
    <section aria-labelledby="titolo-lezioni" className="flex flex-col gap-3">
      <TitoloSezione id="titolo-lezioni" destra={onTutte ? <LinkTutte onClick={onTutte} aria="Tutte le lezioni" testo="Tutte le lezioni" /> : undefined}>Prossima lezione</TitoloSezione>
      {!prima ? (
        <div role="status" className="rounded-[16px] bg-alto-tinta dark:bg-[color-mix(in_srgb,var(--color-alto)_12%,var(--color-superficie-2))] flex items-center gap-3 p-4">
          <Icona nome="stato-imparata" size={28} className="text-alto-numero" />
          <span className="text-[16px] leading-[22px] font-bold text-testo">Tutte imparate</span>
        </div>
      ) : (
        <>
          <ProssimaLezione lezione={prima} onApri={() => onApri(prima.topic.id)} />
          {dopo.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[12px] leading-[16px] font-semibold uppercase tracking-[0.06em] text-testo-tenue">Poi</p>
              <ul className="flex flex-col gap-2">
                {dopo.map(l => <li key={l.topic.id}><RigaLezione lezione={l} onApri={() => onApri(l.topic.id)} /></li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
