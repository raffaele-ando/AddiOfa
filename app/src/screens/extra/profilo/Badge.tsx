import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Barra, Carta } from '../../../components/home/comune';
import { urlDisegno } from '../../../brand/risorse';
import { useTheme } from '../../../hooks/useTheme';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { GRUPPI_BADGE, type BadgeValutato } from '../../../lib/profilo/badge';
import { useAccess } from '../../../access/context';
import { useExtra } from '../contesto';
import { Pagina, useBadge } from './componenti';

type Filtro = 'tutti' | 'sbloccati' | 'bloccati';
const FILTRI: { id: Filtro; nome: string }[] = [
  { id: 'tutti', nome: 'Tutti' },
  { id: 'sbloccati', nome: 'Sbloccati' },
  { id: 'bloccati', nome: 'Da sbloccare' },
];

function Figura({ nome, bloccato }: { nome: string; bloccato: boolean }) {
  const { isDark } = useTheme();
  const src = urlDisegno('kit-blu', 'illustrazioni', nome, isDark);
  return (
    <span className="relative shrink-0 w-[64px] h-[64px] rounded-[16px] bg-azione-tinta grid place-items-center" aria-hidden="true">
      {src && <img src={src} alt="" draggable={false} className={cn('w-[88%] h-[88%] object-contain', bloccato && 'grayscale opacity-45')} />}
      {bloccato && <span className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-superficie border border-linea text-testo-tenue grid place-items-center"><Lock size={13} /></span>}
    </span>
  );
}

function SchedaBadge({ b, pass }: { b: BadgeValutato; pass: boolean }) {
  return (
    <li>
      <Carta className="p-3.5 flex gap-3.5 items-start">
        <Figura nome={b.illustrazione} bloccato={!b.sbloccato} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] leading-[20px] font-bold text-testo">{b.titolo}</h3>
            {b.sbloccato && <span className="shrink-0 rounded-full bg-alto-tinta text-alto-testo px-2 py-0.5 text-[11.5px] font-bold">Sbloccato</span>}
          </div>
          <p className="mt-0.5 text-[12.5px] leading-[17px] text-testo-tenue">{b.condizione}</p>
          {!b.sbloccato && (
            <div className="mt-2">
              <Barra valore={b.quota * 100} colore="var(--color-azione)" alta={6} sfondo="bg-tacca" />
              <p className="mt-1 text-[12px] leading-[16px] text-testo tabular-nums">{b.avanzamento}</p>
              {!b.raggiungibile && !pass && <p className="mt-0.5 text-[12px] leading-[16px] text-testo-tenue">Con le domande gratuite non si arriva fin qui: serve il Pass.</p>}
            </div>
          )}
        </div>
      </Carta>
    </li>
  );
}

/** Traguardi veri di studio: niente punti né XP, solo cose che hai fatto. Quelli bloccati mostrano condizione e avanzamento. */
export default function Badge() {
  const { indietro } = useExtra();
  const { pass } = useAccess();
  const badge = useBadge();
  const [filtro, setFiltro] = useState<Filtro>('tutti');
  const sbloccati = badge.filter(b => b.sbloccato).length;
  const visibili = badge.filter(b => filtro === 'tutti' || (filtro === 'sbloccati') === b.sbloccato);

  return (
    <Pagina titolo="I miei badge" indietro={indietro}>
      <p className="mt-1 text-[13.5px] leading-[19px] text-testo-tenue">
        <span className="font-bold text-testo tabular-nums">{sbloccati} su {badge.length}</span> traguardi raggiunti. Si sbloccano solo studiando davvero: non danno punti.
      </p>
      <div role="radiogroup" aria-label="Filtro" className="mt-4 grid grid-cols-3 gap-1 p-1 rounded-[12px] bg-superficie-2">
        {FILTRI.map(f => (
          <button key={f.id} type="button" role="radio" aria-checked={filtro === f.id} onClick={() => { playTapSound(); setFiltro(f.id); }}
            className={cn('rounded-[9px] py-2 text-[13px] font-semibold', filtro === f.id ? 'bg-superficie text-testo shadow-[0_1px_3px_rgba(15,23,42,0.08)] dark:shadow-none dark:border dark:border-linea' : 'text-testo-tenue')}>
            {f.nome}
          </button>
        ))}
      </div>
      {visibili.length === 0 && (
        <p className="mt-6 rounded-[12px] bg-superficie-2 p-4 text-[13.5px] leading-[19px] text-testo-tenue">
          {filtro === 'sbloccati' ? 'Nessun badge ancora: il primo arriva con la prima domanda imparata.' : 'Hai sbloccato tutti i badge.'}
        </p>
      )}
      {GRUPPI_BADGE.map(g => {
        const dentro = visibili.filter(b => b.gruppo === g.id);
        if (dentro.length === 0) return null;
        return (
          <section key={g.id} aria-labelledby={`badge-${g.id}`} className="mt-[22px] flex flex-col gap-[10px]">
            <h2 id={`badge-${g.id}`} className="text-[15.5px] leading-[20px] font-bold text-testo">{g.titolo}</h2>
            <ul className="flex flex-col gap-2.5">{dentro.map(b => <SchedaBadge key={b.id} b={b} pass={pass} />)}</ul>
          </section>
        );
      })}
    </Pagina>
  );
}
