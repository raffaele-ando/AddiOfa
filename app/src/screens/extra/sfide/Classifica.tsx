// `classifica` (voce «Classifica», concept 06.4 e 30.14): la classifica tra te e i tuoi rivali, calcolata dai duelli veri. Il podio mostra i primi
// tre (con due persone, due colonne); l'elenco riprende dal quarto. Nessuna posizione inventata: solo chi ha giocato con te su questo dispositivo.
// Sotto, il punto di innesto `ClassificaNoi` (oggi: «non collegato»).
import { Icona } from '../../../brand/icone/Icona';
import { Illustrazione } from '../../../brand/Illustrazione';
import { useExtra } from '../contesto';
import { cn, formatNumber } from '../../../lib/utils';
import { costruisciClassifica, tempoBreve, type RigaClassifica } from '../../../lib/sfide/risultati';
import { useProfiloSfide, useStorico } from './dati';
import { Avatar, Bottone, Carta } from './comuni';
import ClassificaNoi from './ClassificaNoi';
import { Regole, SchedaProveSfide } from './scheda';

/** Podio (con almeno due persone): il primo in ambra con la medaglia, gli altri neutri; chi sei tu ha l'avatar blu.
 *  Ordine come nel concept: secondo, primo, terzo (con due persone: secondo, primo). */
function Podio({ righe }: { righe: RigaClassifica[] }) {
  const prime = righe.slice(0, 3);
  const visivo = prime.length === 3 ? [prime[1], prime[0], prime[2]] : [prime[1], prime[0]];
  const alt: Record<number, string> = { 0: 'h-[88px]', 1: 'h-[64px]', 2: 'h-[48px]' };
  return (
    <ol className={cn('grid items-end gap-2', prime.length === 3 ? 'grid-cols-3' : 'mx-auto max-w-[260px] grid-cols-2')} aria-label="Podio">
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

export default function Classifica() {
  const { vai } = useExtra();
  const { voci } = useStorico();
  const { profilo } = useProfiloSfide();
  const righe = costruisciClassifica(voci, profilo.nome ?? 'Tu');
  // Il podio mostra i primi tre (due, se siete in due): l'elenco sotto riprende dal quarto, nessuno compare due volte.
  const conPodio = righe.length >= 2;
  const nelPodio = Math.min(3, righe.length);
  const elenco = conPodio ? righe.slice(nelPodio) : righe;
  const primo = conPodio ? nelPodio : 0;
  const mia = righe.findIndex(r => r.io);

  const info = (
    <Regole righe={[
      'La classifica è tra te e le persone con cui hai fatto un duello: la media delle risposte giuste nei duelli giocati con te.',
      'A parità di media decide il tempo.',
      'Chi non ha duellato con te non compare: nessuna posizione è inventata.',
      'Il podio mostra i primi tre.',
      'La classifica con tutti gli studenti (NOI) richiede il collegamento: finché non c\'è, vedi solo questa.',
    ]} />
  );

  return (
    <SchedaProveSfide sezione="classifica" info={info} titoloInfo="Classifica">
      {righe.length === 0 ? (
        <Carta className="mt-4 flex flex-col items-center py-6 text-center">
          <Illustrazione nome="vuoto" lato={120} />
          <p className="mt-3 text-[18px] leading-[24px] font-extrabold text-testo">Nessuna classifica</p>
          <p className="mt-1 max-w-[28ch] text-[14px] leading-[20px] text-testo-tenue">Nasce dal primo duello concluso.</p>
          <div className="mt-5 w-full"><Bottone icona="sfide" onClick={() => vai('sfide')}>Sfida un amico</Bottone></div>
        </Carta>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {/* La tua posizione (concept 30.14): un numero vero, calcolato qui. */}
          <Carta tono="azione" className="flex items-center gap-4">
            <Illustrazione nome="sfera-community" lato={64} />
            <div className="min-w-0 flex-1" role="status" aria-label={`La tua posizione: ${mia + 1} su ${righe.length}`}>
              <p aria-hidden className="text-[13px] font-semibold text-testo-tenue">La tua posizione</p>
              <p aria-hidden className="text-[30px] leading-[34px] font-extrabold tabular-nums text-testo">{mia + 1}<span className="text-[16px] font-bold text-testo-tenue"> su {righe.length}</span></p>
            </div>
          </Carta>
          {conPodio && <Carta><Podio righe={righe} /></Carta>}
          {elenco.length > 0 && (
            <ol className="flex flex-col gap-2" start={primo + 1}>
              {elenco.map((r, k) => {
                const i = primo + k;
                return (
                  <li key={r.id} className={cn('flex items-center gap-3 rounded-[14px] border p-3', r.io ? 'border-azione/40 bg-azione-tinta' : 'border-linea bg-superficie-2')}>
                    <span className="w-6 text-center text-[16px] font-extrabold tabular-nums text-testo-tenue" aria-label={`Posizione ${i + 1}`}>{i + 1}</span>
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

      {/* Punto di innesto della classifica NOI: l'agente del progetto sostituisce ClassificaNoi.tsx. Nessuna fonte per saperlo ancora: sempre «non collegato». */}
      <ClassificaNoi attivo={false} />
    </SchedaProveSfide>
  );
}
