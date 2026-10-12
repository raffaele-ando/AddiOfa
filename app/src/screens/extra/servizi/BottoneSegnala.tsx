// Pulsante «Segnala» da mettere accanto alle domande (concept 13/16/17). Non legge nessun contesto, così si può usare anche
// dentro le sessioni di studio, che stanno fuori dalle schermate extra.
// Uso: <BottoneSegnala domandaId={q.id} onApri={id => vaiExtra('segnala', { domanda: id })} />
import { Flag } from 'lucide-react';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

export default function BottoneSegnala({ domandaId, onApri, className, etichetta = 'Segnala' }: {
  /** Id della domanda a cui si riferisce (opzionale: senza, la segnalazione è generica). */
  domandaId?: string;
  /** Apre la schermata `segnala` passando l'id della domanda come parametro `domanda`. */
  onApri: (domandaId?: string) => void;
  className?: string;
  etichetta?: string;
}) {
  return (
    <button type="button" onClick={() => { playTapSound(); onApri(domandaId); }}
      aria-label={domandaId ? 'Segnala un problema con questa domanda' : 'Segnala un problema'}
      className={cn('brand-premibile inline-flex min-h-[44px] items-center gap-1.5 rounded-[10px] bg-superficie-2 px-3 text-[13.5px] font-semibold text-testo-tenue hover:text-testo', className)}>
      <Flag size={16} aria-hidden="true" />
      {etichetta}
    </button>
  );
}
