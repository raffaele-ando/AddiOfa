import { useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { Disegno } from '../servizi/componenti';
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

/** L'arte di ogni badge. Due scelte del piano d'uso (docs/design/ILLUSTRAZIONI.md §3.4): i badge di costanza hanno il calendario;
 *  `risultato-probabilita` ha scritto nel disegno «82 %», un numero che sembrerebbe dell'utente, e qui non si usa. */
function arte(b: BadgeValutato): string {
  if (b.gruppo === 'costanza') return 'piano-superamento';
  if (b.illustrazione === 'risultato-probabilita') return 'progressi-statistiche-scheda';
  return b.illustrazione;
}

/** Tessera di un badge (concept 06.4: griglia a tre colonne): arte, titolo e, se ancora da ottenere, avanzamento. */
function SchedaBadge({ b, onApri }: { b: BadgeValutato; onApri: () => void }) {
  const tono = TONO_GRUPPO[b.gruppo];
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} aria-label={`${b.titolo}: ${b.sbloccato ? 'ottenuto' : b.avanzamento}`}
        className="brand-premibile flex h-full w-full flex-col items-center gap-2 rounded-[14px] bg-superficie-2 px-2 pb-3 pt-3.5 text-center">
        <span className={cn('relative grid h-[72px] w-[72px] place-items-center rounded-[18px]', b.sbloccato ? TONI[tono].tinta : 'bg-superficie')} aria-hidden="true">
          <Disegno nome={arte(b)} lato={60} className={cn(!b.sbloccato && 'grayscale opacity-45')} />
          {b.sbloccato && <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-superficie-2 bg-alto-pieno text-azione-su"><Icona nome="stato-ok" size={13} /></span>}
        </span>
        <h3 className="text-[13px] leading-[17px] font-bold text-testo">{b.titolo}</h3>
        {!b.sbloccato && (
          <span className="mt-auto flex w-full flex-col items-center gap-1">
            <BarraTono valore={b.quota * 100} tono={tono} className="h-1.5" />
            {b.numeri && <span className="text-[11.5px] leading-[14px] font-bold tabular-nums text-testo-tenue">{b.numeri.corrente}/{b.numeri.obiettivo}</span>}
          </span>
        )}
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
        <div className="mt-8 flex flex-col items-center gap-2 text-center" role="status">
          <Disegno nome={filtro === 'ottenuti' ? 'vuoto' : 'celebrazione-fiocco'} lato={filtro === 'ottenuti' ? 120 : 96} />
          <p className="text-[15px] font-bold text-testo-tenue">{filtro === 'ottenuti' ? 'Nessun badge ancora' : 'Tutti ottenuti'}</p>
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
            <ul className="grid grid-cols-3 gap-2.5">{dentro.map(b => <SchedaBadge key={b.id} b={b} onApri={() => setAperto(b)} />)}</ul>
          </section>
        );
      })}
      <FoglioInfo aperto={!!aperto} onChiudi={() => setAperto(null)} titolo={aperto?.titolo ?? ''}>
        {aperto && (
          <>
            <div className="mb-3 flex items-center justify-center gap-3">
              <Disegno nome={arte(aperto)} lato={72} className={cn(!aperto.sbloccato && 'grayscale opacity-45')} />
              {aperto.sbloccato && <Disegno nome="celebrazione-fiocco" lato={96} />}
            </div>
            <p>{aperto.condizione}</p>
            {!aperto.sbloccato && <p className="mt-2 font-bold tabular-nums">{aperto.avanzamento}</p>}
            <p className="mt-2 text-testo-tenue">I badge si ottengono solo studiando davvero: non danno punti.</p>
          </>
        )}
      </FoglioInfo>
    </Pagina>
  );
}
