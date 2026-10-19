// Pagina di stato, UNA sola per tutta l'app (vuoto, non trovato, errore, offline): illustrazione dell'area a 96-120 px (mai una faccia triste: non trovato = lente,
// offline = globo, errore = foglio con croce), titolo 20/700 senza punto, UNA riga di causa sempre visibile (`testo`), azioni con un verbo (la prima è piena).
// Gli approfondimenti stanno dietro la «i» (`info`). Non legge nessun contesto: la usano anche l'ErrorBoundary
// (che sta fuori da tutto) e il Suspense di avvio.
import { ReactNode, useState } from 'react';
import { Disegno } from './componenti';
import { FoglioInfo, PulsanteInfo } from '../ui';
import { FONT } from '../../../brand/tokens';
import type { KitId } from '../../../brand/risorse';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

export interface AzioneStato {
  testo: string;
  onClick: () => void;
  /** Primaria (blu pieno) o secondaria (superficie-2). Default: la prima è primaria. */
  tipo?: 'primaria' | 'secondaria';
  icona?: ReactNode;
}

export default function StatoPagina({ illustrazione, kit, titolo, testo, azioni = [], ruolo = 'status', pienaAltezza = true, figuraLato = 112, info, children }: {
  /** Nome di un'illustrazione del kit blu (es. 'vuoto', 'mondo-globo', 'documento-errore'; piano d'uso in docs/design/ILLUSTRAZIONI.md). */
  illustrazione: string;
  /** Kit dell'illustrazione (default: blu). */
  kit?: KitId;
  titolo: string;
  /** Solo se serve davvero: di norma niente. */
  testo?: string;
  azioni?: AzioneStato[];
  /** 'alert' per gli errori, 'status' per il resto. */
  ruolo?: 'status' | 'alert';
  pienaAltezza?: boolean;
  figuraLato?: number;
  /** Spiegazione onesta dietro la «i» (foglio). */
  info?: ReactNode;
  children?: ReactNode;
}) {
  const [aperta, setAperta] = useState(false);
  return (
    <div className={cn('relative w-full bg-fondo text-testo flex items-center justify-center overflow-y-auto', pienaAltezza ? 'h-full' : '')} style={{ fontFamily: FONT }}>
      <div role={ruolo} className="mx-auto flex w-full max-w-[420px] flex-col items-center px-6 py-10 text-center">
        <Disegno nome={illustrazione} kit={kit} lato={figuraLato} />
        <h1 className="mt-4 flex items-center gap-1 text-[20px] leading-[26px] font-bold text-testo">
          {titolo}
          {info && <PulsanteInfo onClick={() => setAperta(true)} etichetta="Dettagli" />}
        </h1>
        {testo && <p data-testo-ok className="mt-1.5 max-w-[34ch] text-[15px] leading-[21px] text-testo-tenue">{testo}</p>}
        {children && <div className="mt-4 w-full text-left">{children}</div>}
        {azioni.length > 0 && (
          <div className="mt-6 flex w-full flex-col gap-2.5">
            {azioni.map((a, i) => {
              const primaria = (a.tipo ?? (i === 0 ? 'primaria' : 'secondaria')) === 'primaria';
              return (
                <button key={a.testo} type="button" onClick={() => { playTapSound(); a.onClick(); }}
                  className={cn('brand-premibile w-full min-h-[52px] rounded-[14px] px-4 py-3 text-[16px] font-bold flex items-center justify-center gap-2',
                    primaria ? 'bg-azione text-azione-su' : 'border border-tacca bg-superficie text-testo')}>
                  {a.icona}{a.testo}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {info && <FoglioInfo aperto={aperta} onChiudi={() => setAperta(false)} titolo={titolo}>{info}</FoglioInfo>}
    </div>
  );
}

