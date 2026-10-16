import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Carta } from '../../../components/home/comune';
import { urlDisegno } from '../../../brand/risorse';
import { useTheme } from '../../../hooks/useTheme';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { GRUPPI_BADGE, type BadgeValutato, type GruppoBadge } from '../../../lib/profilo/badge';
import { BarraTono, FoglioInfo, TONI, type Tono } from '../ui';
import { useExtra } from '../contesto';
import { Pagina, SelettoreIcone, useBadge } from './componenti';

type Filtro = 'tutti' | 'ottenuti' | 'da-ottenere';
const FILTRI = [
  { id: 'tutti' as const, icona: <Icona nome="filtro-tutte" size={22} />, nome: 'Tutti' },
  { id: 'ottenuti' as const, icona: <Icona nome="stato-ok" size={22} />, nome: 'Ottenuti' },
  { id: 'da-ottenere' as const, icona: <Icona nome="stato-da-iniziare" size={22} />, nome: 'Da ottenere' },
];

/** Ogni gruppo ha il suo colore, lo stesso in tutta l'app: domande e argomenti imparati = verde, simulazioni = blu, giorni di studio = ambra, livelli = viola. */
const TONO_GRUPPO: Record<GruppoBadge, Tono> = { studio: 'alto', simulazioni: 'azione', costanza: 'medio', livello: 'viola' };

function Figura({ nome, bloccato, tono }: { nome: string; bloccato: boolean; tono: Tono }) {
  const { isDark } = useTheme();
  const src = urlDisegno('kit-blu', 'illustrazioni', nome, isDark);
  return (
    <span className={cn('relative shrink-0 w-[64px] h-[64px] rounded-[16px] grid place-items-center', bloccato ? 'bg-superficie' : TONI[tono].tinta)} aria-hidden="true">
      {src && <img src={src} alt="" draggable={false} className={cn('w-[88%] h-[88%] object-contain', bloccato && 'grayscale opacity-45')} />}
    </span>
  );
}

function SchedaBadge({ b, onApri }: { b: BadgeValutato; onApri: () => void }) {
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} aria-label={`${b.titolo}: ${b.sbloccato ? 'ottenuto' : b.avanzamento}`}
        className="brand-premibile w-full text-left">
        <Carta className="p-3.5 flex gap-3.5 items-center">
          <Figura nome={b.illustrazione} bloccato={!b.sbloccato} tono={TONO_GRUPPO[b.gruppo]} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[15px] leading-[20px] font-bold text-testo">{b.titolo}</h3>
              {b.sbloccato && <span role="img" aria-label="Ottenuto" className="shrink-0 text-alto-numero"><Icona nome="stato-ok" size={22} /></span>}
            </div>
            {!b.sbloccato && (
              <div className="mt-2 flex items-center gap-3">
                <BarraTono valore={b.quota * 100} tono={TONO_GRUPPO[b.gruppo]} className="h-1.5 flex-1" />
                {b.numeri && <span className="shrink-0 text-[12.5px] leading-[16px] font-bold text-testo tabular-nums">{b.numeri.corrente}/{b.numeri.obiettivo}</span>}
              </div>
            )}
          </div>
        </Carta>
      </button>
    </li>
  );
}

/** Traguardi veri di studio: niente punti né XP. Icone, barre e numeri; la condizione di ogni badge si apre toccandolo. */
export default function Badge() {
  const { indietro } = useExtra();
  const badge = useBadge();
  const [filtro, setFiltro] = useState<Filtro>('tutti');
  const [aperto, setAperto] = useState<BadgeValutato | null>(null);
  const sbloccati = badge.filter(b => b.sbloccato).length;
  const visibili = badge.filter(b => filtro === 'tutti' || (filtro === 'ottenuti') === b.sbloccato);

  return (
    <Pagina titolo="Badge" indietro={indietro} destra={
      <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-viola-tinta px-3.5 text-[15px] font-extrabold tabular-nums text-viola-testo" role="img" aria-label={`${sbloccati} su ${badge.length} ottenuti`}>
        <Icona nome="badge" size={18} />{sbloccati}/{badge.length}
      </span>
    }>
      <div className="mt-4"><SelettoreIcone<Filtro> nome="Filtro" voci={FILTRI} valore={filtro} onScegli={setFiltro} /></div>
      {visibili.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-2 text-testo-tenue" role="status">
          <Icona nome={filtro === 'ottenuti' ? 'badge' : 'stato-ok'} size={32} />
          <p className="text-[15px] font-bold">{filtro === 'ottenuti' ? 'Nessun badge ancora' : 'Tutti ottenuti'}</p>
        </div>
      )}
      {GRUPPI_BADGE.map(g => {
        const dentro = visibili.filter(b => b.gruppo === g.id);
        if (dentro.length === 0) return null;
        return (
          <section key={g.id} aria-labelledby={`badge-${g.id}`} className="mt-[22px] flex flex-col gap-[10px]">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={`badge-${g.id}`} className="text-[15.5px] leading-[20px] font-bold text-testo">{g.titolo}</h2>
              <span className={cn('text-[12.5px] font-semibold tabular-nums', TONI[TONO_GRUPPO[g.id]].testo)}>{badge.filter(b => b.gruppo === g.id && b.sbloccato).length}/{badge.filter(b => b.gruppo === g.id).length}</span>
            </div>
            <ul className="flex flex-col gap-2.5">{dentro.map(b => <SchedaBadge key={b.id} b={b} onApri={() => setAperto(b)} />)}</ul>
          </section>
        );
      })}
      <FoglioInfo aperto={!!aperto} onChiudi={() => setAperto(null)} titolo={aperto?.titolo ?? ''}>
        {aperto && (
          <>
            <p>{aperto.condizione}</p>
            {!aperto.sbloccato && <p className="mt-2 font-bold tabular-nums">{aperto.avanzamento}</p>}
            <p className="mt-2 text-testo-tenue">I badge si ottengono solo studiando davvero: non danno punti.</p>
          </>
        )}
      </FoglioInfo>
    </Pagina>
  );
}
