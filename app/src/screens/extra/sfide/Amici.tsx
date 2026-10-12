// `amici`: i «rivali», cioè le persone con cui hai fatto almeno un duello (il nome lo scelgono loro nel link), con i risultati
// a confronto e il saldo di vittorie. Salvati solo su questo dispositivo, ricavati dai duelli veri. Nessun amico inventato.
import { useState } from 'react';
import { ChevronDown, Swords, Trash2, UserPlus } from 'lucide-react';
import { useExtra } from '../contesto';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Illustrazione } from '../../../brand/Illustrazione';
import { confronta, duelliInAttesa, ricavaRivali, tempoBreve, type Rivale } from '../../../lib/sfide/risultati';
import { indirizzoApp, useStorico } from './dati';
import { Bottone, Carta, EtichettaEsito, Pagina, SchedeSfide, Sezione, dataBreve, useScuro } from './comuni';

function RigaRivale({ r, aperto, onToggle, onRimuovi, onApri }: { r: Rivale; aperto: boolean; onToggle: () => void; onRimuovi: () => void; onApri: (id: string) => void }) {
  const iniziale = (r.nome.trim()[0] ?? '?').toUpperCase();
  return (
    <li className="rounded-[14px] bg-superficie-2 border border-linea overflow-hidden">
      <button type="button" aria-expanded={aperto} onClick={() => { playTapSound(); onToggle(); }} className="brand-premibile w-full flex items-center gap-3 p-3 text-left">
        <span className="w-11 h-11 shrink-0 rounded-full bg-azione-tinta text-azione-scuro text-[18px] font-extrabold flex items-center justify-center" aria-hidden>{iniziale}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15.5px] leading-[20px] font-bold text-testo">{r.nome}</span>
          <span className="block text-[13px] leading-[18px] text-testo-tenue tabular-nums">
            {r.duelli} {r.duelli === 1 ? 'duello' : 'duelli'} · {r.vinti} {r.vinti === 1 ? 'vinto' : 'vinti'} · {r.pari} pari · {r.persi} {r.persi === 1 ? 'perso' : 'persi'}
          </span>
        </span>
        <ChevronDown size={20} className={cn('shrink-0 text-testo-tenue', aperto && 'rotate-180')} aria-hidden />
      </button>
      {aperto && (
        <div className="border-t border-linea px-3 pb-3 pt-2">
          <ul className="flex flex-col">
            {r.voci.map(v => (
              <li key={v.id}>
                <button type="button" onClick={() => { playTapSound(); onApri(v.id); }} className="brand-premibile w-full flex items-center gap-2 py-2 text-left">
                  <span className="min-w-0 flex-1 text-[13.5px] tabular-nums text-testo">
                    <span className="font-bold">Tu {v.corrette}/{v.totale}</span> <span className="text-testo-tenue">({tempoBreve(v.secondi)})</span>
                    {' · '}<span className="font-bold">{r.nome} {v.avversario!.corrette}/{v.avversario!.totale}</span> <span className="text-testo-tenue">({tempoBreve(v.avversario!.secondi)})</span>
                    <span className="block text-[12px] text-testo-tenue">{dataBreve(v.quando)}</span>
                  </span>
                  <EtichettaEsito esito={confronta(v, v.avversario!)} />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => { playTapSound(); onRimuovi(); }} className="brand-premibile mt-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-basso-testo">
            <Trash2 size={14} aria-hidden /> Togli {r.nome} dai tuoi rivali
          </button>
        </div>
      )}
    </li>
  );
}

export default function Amici() {
  const { vai, indietro } = useExtra();
  const { voci, modifica } = useStorico();
  const scuro = useScuro();
  const rivali = ricavaRivali(voci);
  const attesa = duelliInAttesa(voci);
  const [aperto, setAperto] = useState<string | null>(null);
  const [daRimuovere, setDaRimuovere] = useState<Rivale | null>(null);

  const invito = {
    testo: 'Studio per il test d\'inglese dell\'OFA con AddiOFA: ci sono domande, spiegazioni e sfide a tempo. Provalo anche tu.',
    url: indirizzoApp(),
    titolo: 'Invita amici',
  };

  return (
    <Pagina titolo="Sfide" sottotitolo="I tuoi rivali: chi hai affrontato in un duello." onBack={indietro}>
      <SchedeSfide attiva="amici" />

      <Sezione id="titolo-rivali" titolo="I tuoi rivali">
        {rivali.length === 0 ? (
          <Carta className="flex flex-col items-center text-center py-6">
            <Illustrazione nome="messaggi-supporto" lato={120} fondoScuro={scuro} />
            <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Qui compariranno gli amici con cui fai un duello</p>
            <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">Giochi 10 domande, mandi il link e, quando il tuo amico ti rimanda il suo risultato, lo ritrovi qui con il saldo delle vittorie. Niente account: restano solo su questo dispositivo.</p>
            <div className="mt-4 w-full"><Bottone onClick={() => vai('sfide')}><Swords size={18} aria-hidden /> Sfida un amico</Bottone></div>
          </Carta>
        ) : (
          <ul className="flex flex-col gap-2">
            {rivali.map(r => (
              <RigaRivale key={r.id} r={r} aperto={aperto === r.id} onToggle={() => setAperto(a => (a === r.id ? null : r.id))}
                onRimuovi={() => setDaRimuovere(r)} onApri={id => vai('sfida-risultato', { voce: id })} />
            ))}
          </ul>
        )}
      </Sezione>

      {attesa.length > 0 && (
        <Sezione id="titolo-attesa" titolo="In attesa di risposta">
          <ul className="flex flex-col gap-2">
            {attesa.map(v => (
              <li key={v.id}>
                <button type="button" onClick={() => { playTapSound(); vai('sfida-risultato', { voce: v.id }); }} className="brand-premibile w-full rounded-[12px] bg-medio-tinta p-3 text-left">
                  <span className="block text-[14px] font-bold text-medio-testo">Duello del {dataBreve(v.quando)} · {v.corrette}/{v.totale}</span>
                  <span className="block text-[12.5px] text-testo-tenue">Il tuo amico non ha ancora rimandato il risultato. Tocca per rimandare il link.</span>
                </button>
              </li>
            ))}
          </ul>
        </Sezione>
      )}

      {rivali.length > 0 && (
        <div className="mt-5"><Bottone onClick={() => vai('sfide')}><Swords size={18} aria-hidden /> Sfida un amico</Bottone></div>
      )}
      <div className="mt-3">
        <Bottone variante="secondario" onClick={() => vai('condividi', { testo: invito.testo, url: invito.url, titolo: invito.titolo })}><UserPlus size={18} aria-hidden /> Invita amici su AddiOFA</Bottone>
      </div>

      <ConfirmDialog open={daRimuovere !== null} title={`Togliere ${daRimuovere?.nome ?? ''}?`}
        message="Si cancellano dal tuo storico i duelli con questa persona. Non succede niente a lei: i dati sono solo su questo dispositivo."
        confirmLabel="Togli" cancelLabel="Annulla" danger
        onCancel={() => setDaRimuovere(null)}
        onConfirm={() => { const r = daRimuovere; setDaRimuovere(null); if (r) { modifica(v => v.filter(x => x.avversario?.id !== r.id)); setAperto(null); } }} />
    </Pagina>
  );
}
