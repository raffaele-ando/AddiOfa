import { useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { GRUPPI_BADGE, type BadgeValutato } from '../../../lib/profilo/badge';
import { BarraTono, Carta, FoglioInfo, IconaTono, Segmenti, TONI, TitoloSezione } from '../ui';
import { useExtra } from '../contesto';
import { IconaBadge, Pagina, TONO_GRUPPO, useBadge } from './componenti';

type Filtro = 'tutti' | 'ottenuti' | 'da-ottenere';

/** Tessera di un badge (griglia a tre colonne, altezza fissa): icona, titolo su al massimo due righe e, se ancora da ottenere, avanzamento.
 *  Ottenuto = a colori, con la spunta; da ottenere = la stessa icona al 45 %, non grigia, con la barra e il numero. */
function SchedaBadge({ b, onApri }: { b: BadgeValutato; onApri: () => void }) {
  const tono = TONO_GRUPPO[b.gruppo];
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }} aria-label={`${b.titolo}: ${b.sbloccato ? 'ottenuto' : b.avanzamento}`}
        className={cn('brand-premibile flex h-[164px] w-full flex-col items-center rounded-[16px] border bg-superficie px-2 pb-3 pt-3 text-center shadow-sm dark:shadow-none', b.sbloccato ? TONI[tono].bordo : 'border-linea')}>
        <span className="relative grid h-[64px] w-[64px] shrink-0 place-items-center" aria-hidden="true">
          <IconaBadge b={b} lato={56} />
          {b.sbloccato
            ? <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-[8px] border-2 border-superficie bg-alto-pieno text-alto-su"><Icona nome="stato-ok" size={13} /></span>
            : <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-[7px] bg-superficie-2 text-testo-tenue"><Icona nome="blocco" size={11} /></span>}
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-[13px] leading-[17px] font-bold text-testo">{b.titolo}</h3>
        <span className="mt-auto flex w-full flex-col items-center gap-1">
          {b.sbloccato ? (
            <span className={cn('text-[12px] leading-[16px] font-bold', TONI[tono].testo)}>Ottenuto</span>
          ) : (
            <>
              <BarraTono valore={b.quota * 100} tono={tono} className="h-1.5" />
              {b.numeri && <span className="text-[12px] leading-[16px] font-semibold tabular-nums text-testo-tenue">{b.numeri.corrente}/{b.numeri.obiettivo}</span>}
            </>
          )}
        </span>
      </button>
    </li>
  );
}

/** Traguardi veri di studio: niente punti né XP. Selettore a parole, prossimo badge in testa, griglia a altezza fissa; la condizione di ogni badge si apre toccandolo. */
export default function Badge() {
  const { indietro } = useExtra();
  const badge = useBadge();
  const [filtro, setFiltro] = useState<Filtro>('tutti');
  const [aperto, setAperto] = useState<BadgeValutato | null>(null);
  const ottenuti = badge.filter(b => b.sbloccato);
  const visibili = badge.filter(b => filtro === 'tutti' || (filtro === 'ottenuti') === b.sbloccato);
  // il più vicino da ottenere: quello con la barra più piena
  const prossimo = useMemo(() => badge.filter(b => !b.sbloccato && b.raggiungibile).sort((a, b) => b.quota - a.quota)[0], [badge]);

  return (
    <Pagina titolo="Badge" indietro={indietro} destra={
      <span className="inline-flex h-9 items-center rounded-full bg-viola-tinta px-3.5 text-[14px] font-bold tabular-nums text-viola-testo dark:bg-superficie-2" role="img" aria-label={`${ottenuti.length} su ${badge.length} ottenuti`}>
        {ottenuti.length} di {badge.length}
      </span>
    }>
      <Segmenti<Filtro> className="mt-3" nome="Mostra" valore={filtro} onScegli={setFiltro} voci={[
        { id: 'tutti', nome: 'Tutti' }, { id: 'ottenuti', nome: 'Ottenuti' }, { id: 'da-ottenere', nome: 'Da ottenere' },
      ]} />

      {prossimo && filtro !== 'ottenuti' && (
        <Carta tono="viola" className="mt-4">
          <p className="text-[12px] leading-[16px] font-semibold text-testo-tenue">Il prossimo badge</p>
          <button type="button" onClick={() => { playTapSound(); setAperto(prossimo); }} className="brand-premibile mt-2 flex w-full items-center gap-3 text-left" aria-label={`${prossimo.titolo}: ${prossimo.avanzamento}`}>
            <IconaBadge b={prossimo} lato={56} />
            <span className="min-w-0 flex-1">
              <span className="block text-[16px] leading-[22px] font-bold text-testo">{prossimo.titolo}</span>
              <span className="block text-[13px] leading-[18px] text-testo-tenue">{prossimo.avanzamento}</span>
            </span>
          </button>
          <BarraTono className="mt-3 h-2" tono={TONO_GRUPPO[prossimo.gruppo]} valore={prossimo.quota * 100} />
        </Carta>
      )}

      {visibili.length === 0 && (
        <div className="mt-10 flex flex-col items-center gap-3 text-center" role="status">
          <IconaTono tono={filtro === 'ottenuti' ? 'viola' : 'alto'} lato={64}><Icona nome={filtro === 'ottenuti' ? 'badge' : 'stato-ok'} size={32} /></IconaTono>
          <p className="text-[17px] leading-[24px] font-bold text-testo">{filtro === 'ottenuti' ? 'Nessun badge ancora' : 'Li hai ottenuti tutti'}</p>
          {filtro === 'ottenuti' && <p data-testo-ok className="max-w-[28ch] text-[14px] leading-[20px] text-testo-tenue">Il primo arriva con la prima domanda imparata.</p>}
        </div>
      )}
      {GRUPPI_BADGE.map(g => {
        const dentro = visibili.filter(b => b.gruppo === g.id);
        if (dentro.length === 0) return null;
        const quanti = badge.filter(b => b.gruppo === g.id && b.sbloccato).length;
        return (
          <section key={g.id} aria-labelledby={`badge-${g.id}`} className="mt-7 flex flex-col gap-3">
            <TitoloSezione id={`badge-${g.id}`} destra={
              // il colore c'è solo da 1 in su: con zero ottenuti il conteggio è neutro
              <span className={cn('text-[13px] font-semibold tabular-nums', quanti > 0 ? TONI[TONO_GRUPPO[g.id]].testo : 'text-testo-tenue')}>{quanti} di {badge.filter(b => b.gruppo === g.id).length}</span>
            }>{g.titolo}</TitoloSezione>
            <ul className="grid grid-cols-3 gap-3">{dentro.map(b => <SchedaBadge key={b.id} b={b} onApri={() => setAperto(b)} />)}</ul>
          </section>
        );
      })}
      <FoglioInfo aperto={!!aperto} onChiudi={() => setAperto(null)} titolo={aperto?.titolo ?? ''}>
        {aperto && (
          <>
            <div className="mb-3 flex items-center justify-center">
              <IconaBadge b={aperto} lato={80} />
            </div>
            <p>{aperto.condizione}</p>
            <p className="mt-2 font-bold tabular-nums">{aperto.sbloccato ? 'Ottenuto' : aperto.avanzamento}</p>
            <p className="mt-2 text-testo-tenue">I badge si ottengono solo studiando davvero: non danno punti.</p>
          </>
        )}
      </FoglioInfo>
    </Pagina>
  );
}
