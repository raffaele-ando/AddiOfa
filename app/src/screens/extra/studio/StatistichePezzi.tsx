// Le parti della schermata Statistiche (concept 18 scheda 2, 06 «progressi», 25 «come cambia»): tessere, andamento, per argomento, obiettivi.
// Usate da components/StatsMode.tsx. Tutto ricavato da appState (lib/studio/statistiche.ts): nessun punto o dato inventato.
import { useState } from 'react';
import { ChevronRight, Clock, ListChecks, Target } from 'lucide-react';
import type { AppState } from '../../../types';
import { REAL_TEST_PASS_MARK } from '../../../config/offer';
import {
  andamentoSimulazioni, formatTempoStudio, leggiObiettivi, padronanzaArgomenti, tessereStatistiche,
} from '../../../lib/studio/statistiche';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Barra, Carta, TitoloSezione, coloreValore } from './comune';

/** Tre tessere: risposte date, tempo di studio, media delle simulazioni. */
export function Tessere({ stato }: { stato: AppState }) {
  const t = tessereStatistiche(stato);
  const voci = [
    { Icona: ListChecks, valore: String(t.risposte), nome: 'Risposte date', tono: 'bg-azione-tinta text-azione' },
    { Icona: Clock, valore: formatTempoStudio(t.secondiStudio), nome: 'Tempo di studio', tono: 'bg-medio-tinta text-medio-testo' },
    { Icona: Target, valore: t.mediaSimulazioni ? `${t.mediaSimulazioni.esatte.toLocaleString('it-IT')}/${t.mediaSimulazioni.totale}` : '–', nome: t.mediaSimulazioni ? `Media di ${t.mediaSimulazioni.quante} ${t.mediaSimulazioni.quante === 1 ? 'simulazione' : 'simulazioni'}` : 'Media simulazioni', tono: 'bg-alto-tinta text-alto-testo' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2" role="list" aria-label="Riepilogo">
      {voci.map(v => (
        <div key={v.nome} role="listitem" className="rounded-[12px] bg-superficie-2 px-2 py-3 flex flex-col items-center text-center min-w-0">
          <span aria-hidden="true" className={cn('grid place-items-center w-9 h-9 rounded-[10px]', v.tono)}><v.Icona size={19} strokeWidth={2.2} /></span>
          <span className="mt-2 text-[18px] leading-[22px] font-extrabold tabular-nums text-testo break-words">{v.valore}</span>
          <span className="mt-0.5 text-[11.5px] leading-[15px] text-testo-tenue">{v.nome}</span>
        </div>
      ))}
    </div>
  );
}

/** Andamento dei risultati delle simulazioni: una colonna per simulazione (solo quelle vere), con la soglia. */
export function AndamentoSimulazioni({ stato }: { stato: AppState }) {
  const punti = andamentoSimulazioni(stato, 10);
  const ultimo = punti[punti.length - 1];
  const totali = Math.max(30, ...punti.map(p => p.totale));
  const superate = punti.filter(p => p.esatte >= REAL_TEST_PASS_MARK).length;
  return (
    <section aria-labelledby="titolo-andamento" className="flex flex-col gap-2.5">
      <TitoloSezione id="titolo-andamento" destra={ultimo ? <span className="text-[13px] text-testo-tenue">Ultima <span className="font-bold tabular-nums text-testo">{ultimo.esatte}/{ultimo.totale}</span></span> : undefined}>
        Andamento risultati
      </TitoloSezione>
      {punti.length === 0 ? (
        <Carta className="p-4"><p className="text-[14px] leading-[20px] text-testo-tenue">Dopo la prima simulazione vedi qui come cambiano i tuoi risultati.</p></Carta>
      ) : (
        <Carta className="p-4">
          <div role="img" aria-label={`Risultati delle ultime ${punti.length} simulazioni: ${punti.map(p => `${p.esatte} su ${p.totale}`).join(', ')}. Soglia ${REAL_TEST_PASS_MARK}.`}
            className="relative mt-5 h-[110px]">
            <div aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-testo-tenue" style={{ bottom: `${(REAL_TEST_PASS_MARK / totali) * 100}%` }} />
            <div aria-hidden="true" className="absolute inset-0 flex gap-1.5">
              {punti.map(p => {
                const altezza = Math.max(3, (p.esatte / totali) * 100);
                const ok = p.esatte >= REAL_TEST_PASS_MARK;
                return (
                  <div key={p.numero} className="relative flex-1 min-w-0 h-full">
                    <span className="absolute left-1/2 -translate-x-1/2 px-0.5 rounded-sm bg-superficie-2 text-center text-[11.5px] leading-[14px] font-bold tabular-nums text-testo" style={{ bottom: `calc(${altezza}% + 2px)` }}>{p.esatte}</span>
                    <div className="absolute bottom-0 left-1/2 w-full max-w-[26px] -translate-x-1/2 rounded-t-[5px]" style={{ height: `${altezza}%`, background: ok ? 'var(--color-alto)' : 'var(--color-azione-chiaro)' }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div aria-hidden="true" className="mt-1 flex gap-1.5 border-t border-linea pt-1">
            {punti.map(p => <span key={p.numero} className="flex-1 min-w-0 text-center text-[11px] leading-[14px] tabular-nums text-testo-tenue">{p.numero}</span>)}
          </div>
          <p className="mt-2.5 text-[12.5px] leading-[18px] text-testo-tenue">
            Numero della simulazione sotto ogni colonna, risposte esatte sopra. Linea tratteggiata: soglia di {REAL_TEST_PASS_MARK}. In verde le simulazioni che la raggiungono ({superate} su {punti.length}).
          </p>
        </Carta>
      )}
    </section>
  );
}

/** «Per argomento»: barre di padronanza (domande imparate su domande dell'argomento). Prima i più deboli tra quelli iniziati. */
export function PerArgomento({ stato, pass, onVaiPercorso, onApriLezione }: {
  stato: AppState; pass: boolean; onVaiPercorso?: () => void; onApriLezione?: (id: string) => void;
}) {
  const [tutti, setTutti] = useState(false);
  const righe = padronanzaArgomenti(stato, pass);
  const iniziati = righe.filter(r => r.risposte > 0).sort((a, b) => a.percento - b.percento || b.risposte - a.risposte);
  const mostrate = tutti ? righe : iniziati.slice(0, 6);
  return (
    <section aria-labelledby="titolo-argomenti" className="flex flex-col gap-2.5">
      <TitoloSezione id="titolo-argomenti" destra={righe.length > 0 && (iniziati.length > 6 || !tutti) ? (
        <button type="button" onClick={() => { playTapSound(); setTutti(t => !t); }} aria-expanded={tutti}
          className="shrink-0 inline-flex items-center text-[13.5px] font-medium text-azione -mr-1 min-h-[36px]">
          {tutti ? 'Mostra meno' : 'Vedi dettagli'}<ChevronRight size={18} strokeWidth={2} aria-hidden="true" className={tutti ? 'rotate-90' : undefined} />
        </button>
      ) : undefined}>Per argomento</TitoloSezione>
      <Carta className="p-4">
        {mostrate.length === 0 ? (
          <p className="text-[14px] leading-[20px] text-testo-tenue">Rispondi alle domande di qualche argomento e qui vedrai quanto lo padroneggi. Per ora nessun argomento è iniziato.</p>
        ) : (
          <ul className="flex flex-col gap-3.5">
            {mostrate.map(r => {
              const colore = r.risposte > 0 ? coloreValore(r.percento) : 'transparent';
              const contenuto = (
                <>
                  <span className="flex items-baseline justify-between gap-3 text-[14px]">
                    <span className="font-semibold text-testo min-w-0 break-words">{r.nome}<span className="ml-1.5 text-[11.5px] font-medium text-testo-tenue">{r.livello}</span></span>
                    <span className="shrink-0 font-bold tabular-nums text-testo">{r.risposte > 0 ? `${r.percento}%` : '–'}</span>
                  </span>
                  <span className="mt-1.5 block"><Barra valore={r.risposte > 0 ? r.percento : 0} colore={colore} alta={7} /></span>
                  <span className="mt-1 block text-[11.5px] text-testo-tenue">{r.risposte > 0 ? `${r.imparate} imparate su ${r.totale} · ${r.risposte} risposte` : 'Non ancora iniziato'}</span>
                </>
              );
              return (
                <li key={r.id}>
                  {onApriLezione
                    ? <button type="button" onClick={() => { playTapSound(); onApriLezione(r.id); }} aria-label={`${r.nome}: apri la lezione`} className="block w-full text-left">{contenuto}</button>
                    : contenuto}
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-3.5 text-[12px] leading-[17px] text-testo-tenue">
          Padronanza = domande imparate su domande dell’argomento{!pass && ' (nel nucleo gratuito)'}. Una domanda è imparata con due risposte giuste a distanza di mezza giornata.
        </p>
        {onVaiPercorso && (
          <button type="button" onClick={() => { playTapSound(); onVaiPercorso(); }} className="mt-1.5 min-h-[40px] text-[14px] font-semibold text-azione underline underline-offset-4">
            Apri il percorso di studio
          </button>
        )}
      </Carta>
    </section>
  );
}

/** «Obiettivi» che l'utente ha impostato nel profilo. Se non ne ha, la sezione non compare. */
export function Obiettivi({ stato }: { stato: AppState }) {
  const voci = leggiObiettivi(stato.extra, stato);
  if (voci.length === 0) return null;
  return (
    <section aria-labelledby="titolo-obiettivi" className="flex flex-col gap-2.5">
      <TitoloSezione id="titolo-obiettivi">Obiettivi</TitoloSezione>
      <ul className="flex flex-col gap-2">
        {voci.map(o => (
          <li key={o.id} className="rounded-[12px] bg-superficie-2 p-3.5">
            <p className="text-[14.5px] leading-[20px] font-bold text-testo break-words">{o.titolo}</p>
            {o.dettaglio && <p className="mt-0.5 text-[13px] leading-[18px] text-testo-tenue">{o.dettaglio}</p>}
            {o.percento !== undefined && <div className="mt-2"><Barra valore={o.percento} colore={o.percento >= 100 ? 'var(--color-alto)' : 'var(--color-azione)'} alta={7} /></div>}
          </li>
        ))}
      </ul>
    </section>
  );
}
