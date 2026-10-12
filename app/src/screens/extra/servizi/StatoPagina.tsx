// Pagina di stato (kit blu «stati e feedback», concept 16/17): illustrazione, titolo, testo, azioni.
// Non legge nessun contesto: la usano anche l'ErrorBoundary (che sta fuori da tutto) e il Suspense di avvio.
import { ReactNode } from 'react';
import { Disegno } from './componenti';
import { FONT } from '../../../brand/tokens';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

export interface AzioneStato {
  testo: string;
  onClick: () => void;
  /** Primaria (blu pieno) o secondaria (superficie-2). Default: la prima è primaria. */
  tipo?: 'primaria' | 'secondaria';
  icona?: ReactNode;
}

export default function StatoPagina({ illustrazione, titolo, testo, azioni = [], ruolo = 'status', pienaAltezza = true, figuraLato = 168, children }: {
  /** Nome di un'illustrazione del kit blu (es. 'ricerca', 'accesso-bloccato', 'messaggi-supporto'). */
  illustrazione: string;
  titolo: string;
  testo?: string;
  azioni?: AzioneStato[];
  /** 'alert' per gli errori, 'status' per il resto. */
  ruolo?: 'status' | 'alert';
  pienaAltezza?: boolean;
  figuraLato?: number;
  children?: ReactNode;
}) {
  return (
    <div className={cn('w-full bg-superficie text-testo flex items-center justify-center overflow-y-auto', pienaAltezza ? 'h-full' : '')} style={{ fontFamily: FONT }}>
      <div role={ruolo} className="mx-auto flex w-full max-w-[420px] flex-col items-center px-6 py-10 text-center">
        <Disegno nome={illustrazione} lato={figuraLato} />
        <h1 className="mt-5 text-[24px] leading-[31px] font-extrabold tracking-[-0.02em] text-testo">{titolo}</h1>
        {testo && <p className="mt-2 text-[15px] leading-[22px] text-testo-tenue">{testo}</p>}
        {children && <div className="mt-4 w-full text-left">{children}</div>}
        {azioni.length > 0 && (
          <div className="mt-6 flex w-full flex-col gap-2.5">
            {azioni.map((a, i) => {
              const primaria = (a.tipo ?? (i === 0 ? 'primaria' : 'secondaria')) === 'primaria';
              return (
                <button key={a.testo} type="button" onClick={() => { playTapSound(); a.onClick(); }}
                  className={cn('brand-premibile w-full min-h-[50px] rounded-[13px] px-4 py-3 text-[15.5px] font-bold flex items-center justify-center gap-2',
                    primaria ? 'bg-azione text-azione-su' : 'bg-superficie-2 text-testo')}>
                  {a.icona}{a.testo}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
