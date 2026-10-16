// Pulsante «Segnala» da mettere accanto alle domande (concept 13/16/17). Non legge nessun contesto, così si può usare anche
// dentro le sessioni di studio, che stanno fuori dalle schermate extra.
// Uso: <BottoneSegnala domandaId={q.id} onApri={id => vaiExtra('segnala', { domanda: id })} />
import { Icona } from '../../../brand/icone/Icona';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

export default function BottoneSegnala({ domandaId, onApri, className }: {
  /** Id della domanda a cui si riferisce (opzionale: senza, la segnalazione è generica). */
  domandaId?: string;
  /** Apre la schermata `segnala` passando l'id della domanda come parametro `domanda`. */
  onApri: (domandaId?: string) => void;
  className?: string;
  /** Non più usato: il pulsante è solo icona. */
  etichetta?: string;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(domandaId); }}
      aria-label={domandaId ? 'Segnala un problema con questa domanda' : 'Segnala un problema'}
      className={cn('brand-premibile inline-grid min-h-[44px] min-w-[44px] place-items-center rounded-[10px] bg-superficie-2 text-testo-tenue hover:text-testo', className)}>
      <Icona nome="segnala" size={20} />
    </button>
  );
}
