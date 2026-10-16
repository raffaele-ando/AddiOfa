import { Icona } from '../brand/icone/Icona';
import { AppState } from '../types';
import { computeGuaranteeProgress } from '../lib/guarantee';
import { cn } from '../lib/utils';

// Mostra all'utente, con i suoi dati, a che punto è con le condizioni della Garanzia Promosso
export default function GuaranteeTracker({ appState }: { appState: AppState }) {
  const progress = computeGuaranteeProgress(appState);

  return (
    <div className="bg-alto-tinta border border-alto/30 rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icona nome="garanzia" size={22} className="text-alto-testo" />
        <span className="font-bold text-sm text-alto-testo">
          Garanzia
        </span>
        <span role="img" aria-label={progress.qualified ? 'Hai tutti i requisiti: se non superi il test hai diritto al rimborso' : 'Completa tutti i requisiti prima del test per avere diritto al rimborso'}
          className={cn('ml-auto', progress.qualified ? 'text-alto-testo' : 'text-testo-tenue')}>
          <Icona nome={progress.qualified ? 'stato-ok' : 'blocco'} size={20} />
        </span>
      </div>
      {progress.checks.map(c => (
        <div key={c.label} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs sm:text-sm font-bold text-testo">
            <span className="flex items-center gap-1.5">
              {c.done && <Icona nome="stato-ok" size={16} className="text-alto-testo" />}
              {c.label}
            </span>
            <span>{c.current}/{c.target}</span>
          </div>
          <div className="h-2 bg-superficie-2 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-colors duration-100", c.done ? "bg-alto-pieno" : "bg-medio-pieno")}
              style={{ width: `${(c.current / c.target) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
