// `classifica`: la classifica tra te e i tuoi rivali, calcolata dai duelli veri (il podio dal terzo in poi: i primi tre non si ripetono nell'elenco;
// il primo in ambra con la medaglia), e UNA riga per la classifica NOI (stato a icona, porta al Project ID). Nessuna posizione inventata.
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { playTapSound } from '../../../lib/audio';
import { useExtra } from '../contesto';
import { ATLAS_API_URL, ECOSYSTEM } from '../../../config/ecosystem';
import { FEATURE_FLAGS } from '../../../config/offer';
import { statoNoi, type StatoNoi } from '../../../lib/servizi/collegamento';
import { cn, formatNumber } from '../../../lib/utils';
import { costruisciClassifica, tempoBreve, type RigaClassifica } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { IconaTono } from '../ui';
import { Avatar, Bottone, Carta } from './comuni';
import { Regole, SchedaProveSfide } from './scheda';

/** Podio (solo con almeno tre persone): il primo in ambra con la medaglia, gli altri neutri; chi sei tu ha l'avatar blu. */
function Podio({ righe }: { righe: RigaClassifica[] }) {
  // ordine visivo come nel concept: secondo, primo, terzo
  const visivo = [righe[1], righe[0], righe[2]];
  const alt: Record<number, string> = { 0: 'h-[88px]', 1: 'h-[64px]', 2: 'h-[48px]' };
  return (
    <ol className="grid grid-cols-3 items-end gap-2" aria-label="Podio">
      {visivo.map(r => {
        const pos = righe.indexOf(r);
        return (
          <li key={r.id} className="flex min-w-0 flex-col items-center">
            {pos === 0 && <Icona nome="stato-primo" size={24} className="mb-0.5 text-medio-numero" />}
            <Avatar nome={r.nome} grande={pos === 0} io={r.io} />
            <p className="mt-1.5 max-w-full truncate text-[13.5px] font-bold text-testo">{r.nome}</p>
            <p className="text-[12.5px] font-semibold tabular-nums text-testo-tenue">{formatNumber(Math.round(r.percentuale))} %</p>
            <div className={cn('mt-1.5 flex w-full items-start justify-center rounded-t-[10px] pt-1.5 text-[18px] font-extrabold', alt[pos], pos === 0 ? 'bg-medio-tinta text-medio-testo' : 'bg-superficie text-testo-tenue')}>
              {pos + 1}
              <span className="sr-only">° posto</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Lo stato della classifica NOI, a icona: spuntata se sei dentro, avviso se manca un passo tuo, lucchetto se non è attiva. */
const ICONA_NOI: Record<StatoNoi, { nome: NomeIcona; colore: string }> = {
  aderito: { nome: 'stato-ok', colore: 'text-alto-numero' },
  'da-aderire': { nome: 'stato-attenzione', colore: 'text-medio-numero' },
  'da-collegare': { nome: 'stato-attenzione', colore: 'text-medio-numero' },
  demo: { nome: 'blocco', colore: 'text-testo-tenue' },
  'project-id-spento': { nome: 'blocco', colore: 'text-testo-tenue' },
  'classifica-spenta': { nome: 'blocco', colore: 'text-testo-tenue' },
  atlas: { nome: 'blocco', colore: 'text-testo-tenue' },
};

function RigaNoi() {
  const { appState, demo, vai } = useExtra();
  const stato = statoNoi({ demo, flagProjectId: FEATURE_FLAGS.projectId, flagClassifica: FEATURE_FLAGS.leaderboard, atlasOnline: !!ATLAS_API_URL, permessi: appState.projectLink?.scopes });
  const s = ICONA_NOI[stato];
  return (
    <button type="button" aria-label={`Classifica ${ECOSYSTEM.rankingName}`} onClick={() => { playTapSound(); vai('projectid'); }}
      className="brand-premibile mt-6 flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
      <IconaTono tono="viola"><Icona nome="classifica-noi" size={22} /></IconaTono>
      <span className="min-w-0 flex-1 text-[16px] font-extrabold tracking-[0.02em] text-testo">{ECOSYSTEM.rankingName}</span>
      <Icona nome={s.nome} size={22} className={s.colore} />
      <Icona nome="avanti" size={20} className="shrink-0 -mr-1 text-testo-tenue" />
    </button>
  );
}

export default function Classifica() {
  const { vai } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const righe = costruisciClassifica(voci, profilo.nome ?? 'Tu');
  // Il podio c'è dal terzo in poi e mostra i primi tre: l'elenco sotto riprende dal quarto (nessuno compare due volte).
  const conPodio = righe.length >= 3;
  const elenco = conPodio ? righe.slice(3) : righe;
  const primo = conPodio ? 3 : 0;

  const info = (
    <Regole righe={[
      'La classifica è tra te e le persone con cui hai fatto un duello: la media delle risposte giuste nei duelli giocati con te.',
      'A parità di media decide il tempo.',
      'Chi non ha duellato con te non compare: nessuna posizione è inventata.',
      'Il podio compare quando siete almeno in tre.',
      `La classifica ${ECOSYSTEM.rankingName}, tra tutti gli studenti che la scelgono, richiede il ${ECOSYSTEM.accountName}.`,
    ]} />
  );

  return (
    <SchedaProveSfide sezione="classifica" info={info} titoloInfo="Classifica">
      {righe.length === 0 ? (
        <Carta className="mt-4 flex flex-col items-center py-6 text-center">
          <IconaTono tono="medio" lato={52} className="rounded-full"><Icona nome="classifica" size={26} /></IconaTono>
          <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessuna classifica</p>
          <div className="mt-4 w-full"><Bottone icona="sfide" aria="Sfida un amico" onClick={() => vai('sfide')} /></div>
        </Carta>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {conPodio && <Carta><Podio righe={righe} /></Carta>}
          {elenco.length > 0 && (
            <ol className="flex flex-col gap-2" start={primo + 1}>
              {elenco.map((r, k) => {
                const i = primo + k;
                return (
                  <li key={r.id} className={cn('flex items-center gap-3 rounded-[14px] border p-3', r.io ? 'border-azione/40 bg-azione-tinta' : 'border-linea bg-superficie-2')}>
                    {i === 0
                      ? <span className="grid w-6 place-items-center text-medio-numero" aria-label="Primo posto"><Icona nome="stato-primo" size={22} /></span>
                      : <span className="w-6 text-center text-[16px] font-extrabold tabular-nums text-testo-tenue" aria-label={`Posizione ${i + 1}`}>{i + 1}</span>}
                    <Avatar nome={r.nome} io={r.io} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-bold text-testo">{r.nome}</span>
                      <span className="flex items-center gap-3 text-[12.5px] tabular-nums text-testo-tenue">
                        <span role="img" aria-label={`${r.duelli} duelli`} className="inline-flex items-center gap-1"><Icona nome="sfide" size={13} />{r.duelli}</span>
                        <span role="img" aria-label={`Tempo medio ${tempoBreve(r.secondiMedi)}`} className="inline-flex items-center gap-1 text-medio-testo"><Icona nome="tempo" size={13} />{tempoBreve(r.secondiMedi)}</span>
                      </span>
                    </span>
                    <span className="block text-[20px] font-extrabold tabular-nums text-testo">{formatNumber(Math.round(r.percentuale))} %</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}

      <RigaNoi />
    </SchedaProveSfide>
  );
}
