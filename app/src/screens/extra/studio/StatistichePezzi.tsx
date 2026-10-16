// Le parti della panoramica dei Progressi (concept 18 scheda 2, 06 «progressi»): tessere e andamento delle simulazioni.
// Usate da components/StatsMode.tsx. Tutto ricavato da appState (lib/studio/statistiche.ts): nessun punto o dato inventato.
// Le altre parti stanno altrove: per argomento in Progressi > argomenti, obiettivi in Profilo > Obiettivi, costanza in Progressi > calendario.
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import type { AppState } from '../../../types';
import { REAL_TEST_PASS_MARK } from '../../../config/offer';
import { andamentoSimulazioni, formatTempoStudio, tessereStatistiche } from '../../../lib/studio/statistiche';
import { cn } from '../../../lib/utils';
import { TitoloSezione, TONI, type Tono } from './comune';

/** Tre tessere nel tono del loro significato (concept 18): risposte date blu, tempo di studio ambra, media delle simulazioni verde. Icona, numero, una parola. */
export function Tessere({ stato }: { stato: AppState }) {
  const t = tessereStatistiche(stato);
  const voci: { icona: NomeIcona; valore: string; nome: string; tono: Tono }[] = [
    { icona: 'risposte', valore: String(t.risposte), nome: 'Risposte', tono: 'azione' },
    { icona: 'tempo', valore: formatTempoStudio(t.secondiStudio), nome: 'Tempo', tono: 'medio' },
    { icona: 'simulazioni', valore: t.mediaSimulazioni ? `${t.mediaSimulazioni.esatte.toLocaleString('it-IT')}/${t.mediaSimulazioni.totale}` : '–', nome: 'Media', tono: 'alto' },
  ];
  return (
    <div className="grid grid-cols-3 gap-2" role="list" aria-label="Riepilogo">
      {voci.map(v => (
        <div key={v.nome} role="listitem" className={cn('rounded-[12px] px-2 py-3.5 flex flex-col items-center text-center min-w-0', TONI[v.tono].tinta)}>
          <Icona nome={v.icona} size={24} className={TONI[v.tono].icona} />
          <span className="mt-2 text-[18px] leading-[24px] font-extrabold tabular-nums text-testo whitespace-nowrap">{v.valore}</span>
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
      <TitoloSezione id="titolo-andamento" destra={ultimo ? <span className="inline-flex items-center gap-1.5 text-[13px] font-bold tabular-nums text-testo" role="img" aria-label={`Ultima: ${ultimo.esatte} su ${ultimo.totale}`}><Icona nome="simulazioni" size={16} className="text-azione-scuro" />{ultimo.esatte}/{ultimo.totale}</span> : undefined}>
        Risultati
      </TitoloSezione>
      {punti.length === 0 ? (
        <div role="status" aria-label="Nessuna simulazione" className="flex flex-col items-center rounded-[12px] bg-superficie-2 px-4 py-4">
          <Illustrazione nome="vuoto" lato={96} />
        </div>
      ) : (
        <div className="rounded-[12px] border border-linea p-4">
          <div role="img" aria-label={`Risultati delle ultime ${punti.length} simulazioni: ${punti.map(p => `${p.esatte} su ${p.totale}`).join(', ')}. Soglia ${REAL_TEST_PASS_MARK}. Superate ${superate}.`}
            className="relative mt-5 h-[110px]">
            <div aria-hidden="true" className="absolute inset-x-0 border-t border-dashed border-testo-tenue" style={{ bottom: `${(REAL_TEST_PASS_MARK / totali) * 100}%` }} />
            <div aria-hidden="true" className="absolute inset-0 flex gap-1.5">
              {punti.map(p => {
                const altezza = Math.max(3, (p.esatte / totali) * 100);
                const ok = p.esatte >= REAL_TEST_PASS_MARK;
                return (
                  <div key={p.numero} className="relative flex-1 min-w-0 h-full">
                    <span className="absolute left-1/2 -translate-x-1/2 px-0.5 rounded-sm bg-superficie text-center text-[11.5px] leading-[14px] font-bold tabular-nums text-testo" style={{ bottom: `calc(${altezza}% + 2px)` }}>{p.esatte}</span>
                    <div className="absolute bottom-0 left-1/2 w-full max-w-[26px] -translate-x-1/2 rounded-t-[5px]" style={{ height: `${altezza}%`, background: ok ? 'var(--color-alto)' : 'var(--color-azione-chiaro)' }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div aria-hidden="true" className="mt-1 flex gap-1.5 border-t border-linea pt-1">
            {punti.map(p => <span key={p.numero} className="flex-1 min-w-0 text-center text-[11px] leading-[14px] tabular-nums text-testo-tenue">{p.numero}</span>)}
          </div>
        </div>
      )}
    </section>
  );
}
