// `amici`: i «rivali», cioè le persone con cui hai fatto almeno un duello (il nome lo scelgono loro nel link), con il saldo di vittorie
// a icone e numeri. Salvati solo su questo dispositivo, ricavati dai duelli veri. Nessun amico inventato. Gli inviti stanno in Pass.
import { useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Illustrazione } from '../../../brand/Illustrazione';
import { confronta, duelliInAttesa, ricavaRivali, tempoBreve, type Rivale } from '../../../lib/sfide/risultati';
import { useStorico } from './dati';
import { IconaTono } from '../ui';
import { Avatar, Bottone, Carta, IconaEsito, dataBreve, useScuro } from './comuni';
import { Regole, SchedaProveSfide } from './scheda';

/** Il saldo di una persona: vinti, pari, persi, ognuno con la sua icona e il suo colore; solo quelli che ci sono. */
function Saldo({ r }: { r: Rivale }) {
  const voci: [NomeIcona, number, string, string][] = [
    ['stato-vinto', r.vinti, 'text-alto-testo', `${r.vinti} vinti`],
    ['trend-uguale', r.pari, 'text-medio-testo', `${r.pari} pari`],
    ['stato-perso', r.persi, 'text-basso-testo', `${r.persi} persi`],
  ];
  return (
    <span className="mt-0.5 flex items-center gap-3 text-[14px] leading-[18px] font-extrabold tabular-nums">
      {voci.filter(([, n]) => n > 0).map(([nome, n, colore, aria]) => (
        <span key={nome} role="img" aria-label={aria} className={cn('inline-flex items-center gap-1', colore)}><Icona nome={nome} size={15} />{n}</span>
      ))}
    </span>
  );
}

function RigaRivale({ r, aperto, onToggle, onRimuovi, onApri }: { r: Rivale; aperto: boolean; onToggle: () => void; onRimuovi: () => void; onApri: (id: string) => void }) {
  return (
    <li className="overflow-hidden rounded-[14px] border border-linea bg-superficie-2">
      <button type="button" aria-expanded={aperto} aria-label={r.nome} onClick={() => { playTapSound(); onToggle(); }} className="brand-premibile flex w-full items-center gap-3 p-3 text-left">
        <Avatar nome={r.nome} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15.5px] leading-[20px] font-bold text-testo">{r.nome}</span>
          <Saldo r={r} />
        </span>
        <Icona nome="espandi" size={20} className={cn('shrink-0 text-testo-tenue', aperto && 'rotate-180')} />
      </button>
      {aperto && (
        <div className="border-t border-linea px-3 pb-3 pt-1">
          <ul className="flex flex-col">
            {r.voci.map(v => (
              <li key={v.id}>
                <button type="button" aria-label={`Duello del ${dataBreve(v.quando)}`} onClick={() => { playTapSound(); onApri(v.id); }} className="brand-premibile flex w-full items-center gap-3 py-2 text-left">
                  <span className="min-w-0 flex-1 text-[16px] font-extrabold tabular-nums text-testo">
                    {v.corrette} – {v.avversario!.corrette}
                    <span className="block text-[12px] font-semibold text-testo-tenue">{dataBreve(v.quando)} · {tempoBreve(v.secondi)} – {tempoBreve(v.avversario!.secondi)}</span>
                  </span>
                  <IconaEsito esito={confronta(v, v.avversario!)} lato={30} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" aria-label={`Togli ${r.nome}`} onClick={() => { playTapSound(); onRimuovi(); }} className="brand-premibile mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-basso-testo">
            <Icona nome="cancella" size={15} /> Togli
          </button>
        </div>
      )}
    </li>
  );
}

export default function Amici() {
  const { vai } = useExtra();
  const { voci, modifica } = useStorico();
  const scuro = useScuro();
  const rivali = ricavaRivali(voci);
  const attesa = duelliInAttesa(voci);
  const [aperto, setAperto] = useState<string | null>(null);
  const [daRimuovere, setDaRimuovere] = useState<Rivale | null>(null);

  const info = (
    <Regole righe={[
      'Qui compaiono le persone con cui hai fatto un duello, quando rimandano il loro risultato.',
      'Il saldo è visto da te: vinti, pari e persi.',
      'Tutto resta su questo dispositivo: nessun amico è inventato e togliere qualcuno cancella solo i tuoi duelli con lui.',
    ]} />
  );

  return (
    <SchedaProveSfide sezione="amici" info={info} titoloInfo="Amici">
      {rivali.length === 0 && attesa.length === 0 ? (
        <Carta className="mt-4 flex flex-col items-center py-6 text-center">
          <Illustrazione nome="messaggi-supporto" lato={120} fondoScuro={scuro} />
          <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessun amico</p>
          <div className="mt-4 w-full"><Bottone icona="sfide" aria="Sfida un amico" onClick={() => vai('sfide')} /></div>
        </Carta>
      ) : (
        <>
          {rivali.length > 0 && (
            <ul className="mt-4 flex flex-col gap-2">
              {rivali.map(r => (
                <RigaRivale key={r.id} r={r} aperto={aperto === r.id} onToggle={() => setAperto(a => (a === r.id ? null : r.id))}
                  onRimuovi={() => setDaRimuovere(r)} onApri={id => vai('sfida-risultato', { voce: id })} />
              ))}
            </ul>
          )}
          {attesa.length > 0 && (
            <ul aria-label="In attesa" className="mt-4 flex flex-col gap-2">
              {attesa.map(v => (
                <li key={v.id}>
                  <button type="button" aria-label={`Duello del ${dataBreve(v.quando)} in attesa`} onClick={() => { playTapSound(); vai('sfida-risultato', { voce: v.id }); }} className="brand-premibile flex w-full items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
                    <IconaTono tono="medio"><Icona nome="stato-attesa" size={22} /></IconaTono>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[20px] leading-[24px] font-extrabold tabular-nums text-testo">{v.corrette}<span className="text-[14px] font-bold text-testo-tenue">/{v.totale}</span></span>
                      <span className="block text-[12.5px] leading-[17px] text-testo-tenue">{dataBreve(v.quando)}</span>
                    </span>
                    <Icona nome="avanti" size={20} className="shrink-0 -mr-1 text-testo-tenue" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ConfirmDialog open={daRimuovere !== null} title={`Togliere ${daRimuovere?.nome ?? ''}?`}
        message="Si cancellano dal tuo storico i duelli con questa persona. Non succede niente a lei: i dati sono solo su questo dispositivo."
        confirmLabel="Togli" cancelLabel="Annulla" danger
        onCancel={() => setDaRimuovere(null)}
        onConfirm={() => { const r = daRimuovere; setDaRimuovere(null); if (r) { modifica(v => v.filter(x => x.avversario?.id !== r.id)); setAperto(null); } }} />
    </SchedaProveSfide>
  );
}
