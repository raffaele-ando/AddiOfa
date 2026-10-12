// `classifica`: la classifica tra te e i tuoi rivali, calcolata dai duelli veri (podio solo se siete almeno in due),
// e la sezione «Classifica NOI» con il suo stato onesto: richiede il Project ID, non attivo in questa versione. Nessuna posizione inventata.
import { Crown, Lock, Swords } from 'lucide-react';
import { useExtra } from '../contesto';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { cn, formatNumber } from '../../../lib/utils';
import { costruisciClassifica, tempoBreve, type RigaClassifica } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { Bottone, Carta, Pagina, SchedeSfide, Sezione } from './comuni';

function Cerchio({ nome, grande, io }: { nome: string; grande?: boolean; io?: boolean }) {
  return (
    <span aria-hidden className={cn('rounded-full flex items-center justify-center font-extrabold shrink-0',
      grande ? 'w-14 h-14 text-[22px]' : 'w-10 h-10 text-[16px]', io ? 'bg-azione text-azione-su' : 'bg-azione-tinta text-azione-scuro')}>
      {(nome.trim()[0] ?? '?').toUpperCase()}
    </span>
  );
}

function Podio({ righe }: { righe: RigaClassifica[] }) {
  // ordine visivo come nel concept: secondo, primo, terzo (con due sole persone: primo e secondo)
  const top = righe.slice(0, 3);
  const visivo = top.length === 3 ? [top[1], top[0], top[2]] : top;
  const alt: Record<number, string> = { 0: 'h-[88px]', 1: 'h-[64px]', 2: 'h-[48px]' };
  return (
    <ol className={cn('grid items-end gap-2', top.length === 3 ? 'grid-cols-3' : 'grid-cols-2')} aria-label="Podio">
      {visivo.map(r => {
        const pos = righe.indexOf(r);
        return (
          <li key={r.id} className="flex flex-col items-center min-w-0">
            {pos === 0 && <Crown size={20} className="text-medio-numero mb-0.5" aria-hidden />}
            <Cerchio nome={r.nome} grande={pos === 0} io={r.io} />
            <p className="mt-1.5 max-w-full truncate text-[13.5px] font-bold text-testo">{r.io ? `${r.nome} (tu)` : r.nome}</p>
            <p className="text-[12.5px] font-semibold tabular-nums text-testo-tenue">{formatNumber(Math.round(r.percentuale))} %</p>
            <div className={cn('mt-1.5 w-full rounded-t-[10px] flex items-start justify-center pt-1.5 text-[18px] font-extrabold', alt[pos], pos === 0 ? 'bg-medio-tinta text-medio-testo' : 'bg-superficie-2 text-testo-tenue')}>
              {pos + 1}
              <span className="sr-only">° posto</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function Classifica() {
  const { vai, indietro } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const righe = costruisciClassifica(voci, profilo.nome ?? 'Tu');
  const conPodio = righe.length >= 2;

  return (
    <Pagina titolo="Sfide" sottotitolo="La classifica tra te e i tuoi rivali, dai duelli che avete giocato." onBack={indietro}>
      <SchedeSfide attiva="classifica" />

      <Sezione id="titolo-rivali" titolo="Tra te e i tuoi rivali">
        {righe.length === 0 ? (
          <Carta className="text-center py-6">
            <p className="text-[16px] leading-[22px] font-bold text-testo">Nessuna classifica, per ora</p>
            <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">Si forma con i duelli: appena un amico ti rimanda il suo risultato, compare qui con te. Non ci sono posizioni se nessuno ha giocato contro di te.</p>
            <div className="mt-4"><Bottone onClick={() => vai('sfide')}><Swords size={18} aria-hidden /> Sfida un amico</Bottone></div>
          </Carta>
        ) : (
          <>
            {conPodio && <Carta><Podio righe={righe} /></Carta>}
            <ol className="flex flex-col gap-2">
              {righe.map((r, i) => (
                <li key={r.id} className={cn('flex items-center gap-3 rounded-[14px] border p-3', r.io ? 'border-azione/40 bg-azione-tinta' : 'border-linea bg-superficie-2')}>
                  <span className="w-6 text-center text-[16px] font-extrabold tabular-nums text-testo-tenue" aria-label={`Posizione ${i + 1}`}>{i + 1}</span>
                  <Cerchio nome={r.nome} io={r.io} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-bold text-testo">{r.io ? `${r.nome} (tu)` : r.nome}</span>
                    <span className="block text-[12.5px] text-testo-tenue tabular-nums">{r.duelli} {r.duelli === 1 ? 'duello' : 'duelli'} con te · tempo medio {tempoBreve(r.secondiMedi)}</span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[18px] font-extrabold tabular-nums text-testo">{formatNumber(Math.round(r.percentuale))} %</span>
                    <span className="block text-[11px] font-bold text-testo-tenue">risposte giuste</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-[12.5px] leading-[18px] text-testo-tenue">
              Conta la media di risposte giuste nei duelli giocati contro di te (a parità, il tempo medio). Chi non ha duellato con te non compare: nessuna posizione è inventata.
              {!conPodio && ' Il podio compare quando siete almeno in due.'}
            </p>
          </>
        )}
      </Sezione>

      <Sezione id="titolo-noi" titolo={`Classifica ${ECOSYSTEM.rankingName}`} destra={<span className="inline-flex items-center gap-1 rounded-full border border-linea bg-superficie-2 px-2.5 py-0.5 text-[12px] font-bold text-testo-tenue"><Lock size={12} aria-hidden /> Non attiva</span>}>
        <Carta>
          <p className="text-[14.5px] leading-[21px] text-testo">
            {ECOSYSTEM.rankingName} sarà la classifica di tutti gli studenti che la scelgono, per sapere chi conosce più regole. Per partecipare serve collegare AddiOFA al tuo {ECOSYSTEM.accountName}, e si entra solo con un consenso esplicito.
          </p>
          <p className="mt-2 text-[14px] leading-[20px] text-testo-tenue">
            {FEATURE_FLAGS.leaderboard && FEATURE_FLAGS.projectId ? 'Il collegamento è in preparazione.' : `In questa versione il collegamento con ${ECOSYSTEM.accountName} non è attivo: non c'è nessuna classifica ${ECOSYSTEM.rankingName}, né posizioni o punteggi da mostrare.`}
          </p>
        </Carta>
      </Sezione>
    </Pagina>
  );
}
