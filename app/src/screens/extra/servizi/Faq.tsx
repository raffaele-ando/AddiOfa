// «FAQ» (concept 44 icona FAQ, 49): ricerca e categorie a icone. Testi veri da config/offer.ts, via lib/servizi/faq.ts.
// Le domande e le risposte sono contenuto (data-testo-ok); il resto della pagina sono icone.
import { useId, useMemo, useState } from 'react';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { Disegno, Pagina } from './componenti';
import { FoglioInfo, PulsanteInfo, TONI, type Tono } from '../ui';
import { CATEGORIE_FAQ, cercaFaq, vociFaq, type CategoriaFaq, type VoceFaq } from '../../../lib/servizi/faq';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

// Un colore e un'icona per categoria (non a rotazione): il test = blu (studio), Pass = ambra (premio), dati = verde (al sicuro), app = viola.
const TONO_CATEGORIA: Record<CategoriaFaq, Tono> = { test: 'azione', pass: 'medio', dati: 'alto', app: 'viola' };
const ICONA_CATEGORIA: Record<CategoriaFaq, NomeIcona> = { test: 'esame', pass: 'pass', dati: 'dati', app: 'app' };
const PUNTO: Record<Tono, string> = { azione: 'bg-azione', alto: 'bg-alto', medio: 'bg-medio', basso: 'bg-basso', viola: 'bg-viola' };

function Voce({ voce, aperta, onToggle }: { voce: VoceFaq; aperta: boolean; onToggle: () => void }) {
  const { vai, apriLegale } = useExtra();
  const id = useId();
  return (
    <li data-testo-ok className="rounded-[12px] bg-superficie-2">
      <h3>
        <button type="button" id={`${id}-b`} aria-expanded={aperta} aria-controls={`${id}-p`} onClick={() => { playTapSound(); onToggle(); }}
          className="brand-premibile flex w-full items-center justify-between gap-3 rounded-[12px] px-3.5 py-3.5 text-left text-[14.5px] leading-[20px] font-bold text-testo">
          <span className="flex items-start gap-2.5"><span aria-hidden="true" className={cn('mt-[7px] h-2 w-2 shrink-0 rounded-full', PUNTO[TONO_CATEGORIA[voce.categoria]])} /><span>{voce.domanda}</span></span>
          <Icona nome="espandi" size={20} className={cn('shrink-0 text-testo-tenue', aperta && 'rotate-180')} />
        </button>
      </h3>
      {aperta && (
        <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="px-3.5 pb-3.5">
          {voce.risposta.map((p, i) => <p key={i} className={cn('text-[13.5px] leading-[21px] text-testo', i > 0 && 'mt-2')}>{p}</p>)}
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
            {voce.vai && <button type="button" onClick={() => vai(voce.vai!.id, voce.vai!.params)} className="rounded text-[13.5px] font-bold text-azione-scuro underline underline-offset-2">{voce.vai.testo}</button>}
            {voce.legale && <button type="button" onClick={() => apriLegale(voce.legale!.sezione)} className="rounded text-[13.5px] font-bold text-azione-scuro underline underline-offset-2">{voce.legale.testo}</button>}
          </div>
        </div>
      )}
    </li>
  );
}

export default function Faq() {
  const { vai } = useExtra();
  const voci = useMemo(() => vociFaq(), []);
  const [testo, setTesto] = useState('');
  const [categoria, setCategoria] = useState<CategoriaFaq | 'tutte'>('tutte');
  const [aperta, setAperta] = useState<string | null>(null);
  const [info, setInfo] = useState(false);
  const campo = useId();
  const risultati = useMemo(() => cercaFaq(voci, testo, categoria), [voci, testo, categoria]);
  const filtri: { id: CategoriaFaq | 'tutte'; nome: string; icona: NomeIcona }[] = [{ id: 'tutte', nome: 'Tutte', icona: 'filtro-tutte' }, ...CATEGORIE_FAQ.map(c => ({ ...c, icona: ICONA_CATEGORIA[c.id] }))];

  return (
    <Pagina titolo="FAQ" destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Avvertenze" />}>

      <div className="mt-5">
        <label htmlFor={campo} className="sr-only">Cerca nelle domande</label>
        <div className="flex items-center gap-2 rounded-[12px] bg-superficie-2 px-3.5 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
          <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
          <input id={campo} type="search" value={testo} onChange={e => setTesto(e.target.value)} placeholder="Cerca" autoComplete="off" maxLength={80}
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-testo placeholder:text-testo-tenue outline-none [&::-webkit-search-cancel-button]:hidden" />
          {testo && (
            <button type="button" onClick={() => setTesto('')} aria-label="Cancella la ricerca" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-testo-tenue">
              <Icona nome="chiudi" size={18} />
            </button>
          )}
        </div>
      </div>

      <div role="group" aria-label="Categoria" className="mt-3 grid grid-cols-5 gap-2">
        {filtri.map(f => {
          const on = categoria === f.id;
          // tessera leggera nel tono della categoria; quella scelta si riempie. «Tutte» è blu (l'azione di filtrare).
          const t: Tono = f.id === 'tutte' ? 'azione' : TONO_CATEGORIA[f.id];
          return (
            <button key={f.id} type="button" aria-pressed={on} aria-label={f.nome} title={f.nome} onClick={() => { playTapSound(); setCategoria(f.id); setAperta(null); }}
              className={cn('brand-premibile grid h-12 place-items-center rounded-[12px]', on ? TONI[t].pieno : `${TONI[t].tinta} ${TONI[t].testo}`)}>
              <Icona nome={f.icona} size={22} />
            </button>
          );
        })}
      </div>

      {risultati.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-[8px]">
          {risultati.map(v => <Voce key={v.id} voce={v} aperta={aperta === v.id} onToggle={() => setAperta(aperta === v.id ? null : v.id)} />)}
        </ul>
      ) : (
        <div role="status" className="mt-4 flex flex-col items-center text-center">
          <Disegno nome="ricerca" lato={140} />
          <p className="mt-3 text-[16px] leading-[22px] font-bold text-testo">Nessun risultato</p>
          <div className="mt-4 flex w-full flex-col gap-2.5">
            <button type="button" onClick={() => { playTapSound(); vai('segnala', { tipo: 'idea' }); }}
              className="brand-premibile flex min-h-[48px] w-full items-center justify-center gap-2 rounded-[13px] bg-superficie-2 px-4 py-3 text-[15px] font-bold text-testo"><Icona nome="segnala" size={18} />Segnala</button>
          </div>
        </div>
      )}

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Avvertenze">
        <p>Le regole del test possono cambiare: controlla sempre il regolamento aggiornato del tuo corso. Le pagine legali sono bozze in attesa di revisione.</p>
      </FoglioInfo>
    </Pagina>
  );
}
