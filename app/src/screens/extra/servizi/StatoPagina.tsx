// Pagina di stato (kit blu «stati», concept 08/16/17: vuoto = nuvola triste, errore = foglio con croce, offline = globo): illustrazione, titolo di 2-4 parole, azioni (icona + verbo).
// Se serve dire qualcosa di più (per onestà), sta dietro la «i» (`info`). Non legge nessun contesto: la usano anche l'ErrorBoundary
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

export default function StatoPagina({ illustrazione, kit, titolo, testo, azioni = [], ruolo = 'status', pienaAltezza = true, figuraLato = 168, info, children }: {
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
    <div className={cn('relative w-full bg-superficie text-testo flex items-center justify-center overflow-y-auto', pienaAltezza ? 'h-full' : '')} style={{ fontFamily: FONT }}>
      <div role={ruolo} className="mx-auto flex w-full max-w-[420px] flex-col items-center px-6 py-10 text-center">
        <Disegno nome={illustrazione} kit={kit} lato={figuraLato} />
        <h1 className="mt-5 flex items-center gap-1 text-[24px] leading-[31px] font-extrabold tracking-[-0.02em] text-testo">
          {titolo}
          {info && <PulsanteInfo onClick={() => setAperta(true)} etichetta="Dettagli" />}
        </h1>
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
      {info && <FoglioInfo aperto={aperta} onChiudi={() => setAperta(false)} titolo={titolo}>{info}</FoglioInfo>}
    </div>
  );
}

