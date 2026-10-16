// `classifica`: la classifica tra te e i tuoi rivali, calcolata dai duelli veri (podio dal terzo in poi: i primi tre non si ripetono nell'elenco; il primo in ambra con la corona),
// e la sezione «Classifica NOI» con il suo stato onesto: richiede il Project ID, non attivo in questa versione. Nessuna posizione inventata.
import { ChevronRight, Crown, Lock, Swords, Users } from 'lucide-react';
import { playTapSound } from '../../../lib/audio';
import { useExtra } from '../contesto';
import { ECOSYSTEM } from '../../../config/ecosystem';
import { cn, formatNumber } from '../../../lib/utils';
import { costruisciClassifica, tempoBreve, type RigaClassifica } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { IconaTono } from '../ui';
import { Avatar, Bottone, Carta, Pagina, SchedeSfide, Sezione } from './comuni';

/** Podio (solo con almeno tre persone): il primo in ambra con la corona, gli altri neutri; chi sei tu ha l'avatar blu. */
function Podio({ righe }: { righe: RigaClassifica[] }) {
  // ordine visivo come nel concept: secondo, primo, terzo
  const visivo = [righe[1], righe[0], righe[2]];
  const alt: Record<number, string> = { 0: 'h-[88px]', 1: 'h-[64px]', 2: 'h-[48px]' };
  return (
    <ol className="grid grid-cols-3 items-end gap-2" aria-label="Podio">
      {visivo.map(r => {
        const pos = righe.indexOf(r);
        return (
          <li key={r.id} className="flex flex-col items-center min-w-0">
            {pos === 0 && <Crown size={22} className="text-medio-numero mb-0.5" fill="currentColor" aria-hidden />}
            <Avatar nome={r.nome} grande={pos === 0} io={r.io} />
            <p className="mt-1.5 max-w-full truncate text-[13.5px] font-bold text-testo">{r.io ? `${r.nome} (tu)` : r.nome}</p>
            <p className="text-[12.5px] font-semibold tabular-nums text-testo-tenue">{formatNumber(Math.round(r.percentuale))} %</p>
            <div className={cn('mt-1.5 w-full rounded-t-[10px] flex items-start justify-center pt-1.5 text-[18px] font-extrabold', alt[pos], pos === 0 ? 'bg-medio-tinta text-medio-testo' : 'bg-superficie text-testo-tenue')}>
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
  // Il podio c'è dal terzo in poi e mostra i primi tre: l'elenco sotto riprende dal quarto (nessuno compare due volte).
  const conPodio = righe.length >= 3;
  const elenco = conPodio ? righe.slice(3) : righe;
  const primo = conPodio ? 3 : 0;

  return (
    <Pagina titolo="Sfide" sottotitolo="Media di risposte giuste nei duelli, tra te e chi hai sfidato." onBack={indietro}>
      <SchedeSfide attiva="classifica" />

      <Sezione id="titolo-rivali" titolo="Tra te e i rivali">
        {righe.length === 0 ? (
          <Carta className="flex flex-col items-center text-center py-6">
            <IconaTono tono="medio" lato={52} className="rounded-full"><Crown size={26} /></IconaTono>
            <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessuna classifica, per ora</p>
            <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">Si forma con i duelli: appena un amico ti rimanda il suo risultato, compare qui con te.</p>
            <div className="mt-4 w-full"><Bottone onClick={() => vai('sfide')}><Swords size={18} aria-hidden /> Sfida un amico</Bottone></div>
          </Carta>
        ) : (
          <>
            {conPodio && <Carta><Podio righe={righe} /></Carta>}
            {elenco.length > 0 && (
              <ol className="flex flex-col gap-2" start={primo + 1}>
                {elenco.map((r, k) => {
                  const i = primo + k;
                  return (
                    <li key={r.id} className={cn('flex items-center gap-3 rounded-[14px] border p-3', r.io ? 'border-azione/40 bg-azione-tinta' : 'border-linea bg-superficie-2')}>
                      {i === 0
                        ? <span className="grid w-6 place-items-center text-medio-numero" aria-label="Primo posto"><Crown size={20} fill="currentColor" aria-hidden /></span>
                        : <span className="w-6 text-center text-[16px] font-extrabold tabular-nums text-testo-tenue" aria-label={`Posizione ${i + 1}`}>{i + 1}</span>}
                      <Avatar nome={r.nome} io={r.io} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-bold text-testo">{r.io ? `${r.nome} (tu)` : r.nome}</span>
                        <span className="block text-[12.5px] text-testo-tenue tabular-nums">{r.duelli} {r.duelli === 1 ? 'duello' : 'duelli'} con te · tempo medio {tempoBreve(r.secondiMedi)}</span>
                      </span>
                      <span className="block text-[20px] font-extrabold tabular-nums text-testo">{formatNumber(Math.round(r.percentuale))} %</span>
                    </li>
                  );
                })}
              </ol>
            )}
            <p className="text-[12.5px] leading-[18px] text-testo-tenue">
              A parità di media decide il tempo. Chi non ha duellato con te non compare: nessuna posizione è inventata.
              {righe.length < 3 && ' Il podio compare quando siete almeno in tre.'}
            </p>
          </>
        )}
      </Sezione>

      <Sezione id="titolo-noi" titolo={`Classifica ${ECOSYSTEM.rankingName}`}
        destra={<span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-linea bg-superficie-2 px-2.5 py-0.5 text-[12px] font-bold text-testo-tenue"><Lock size={12} aria-hidden /> Non attiva</span>}>
        <button type="button" onClick={() => { playTapSound(); vai('noi'); }}
          className="brand-premibile flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
          <IconaTono tono="viola"><Users size={20} /></IconaTono>
          <span className="min-w-0 flex-1 text-[14px] leading-[20px] text-testo">Tra tutti gli studenti che la scelgono: serve il Project ID.</span>
          <ChevronRight size={20} className="shrink-0 text-testo-tenue" aria-hidden />
        </button>
      </Sezione>
    </Pagina>
  );
}
