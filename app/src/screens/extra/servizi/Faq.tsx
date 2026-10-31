// «FAQ»: ricerca e filtri con le parole (Tutte, Il test, Lo studio, I tuoi dati, L'app), domande in 15/600 e risposte in 14/400. Testi veri da config/offer.ts e dal banco, via lib/servizi/faq.ts.
// Le domande e le risposte sono contenuto (data-testo-ok); il resto della pagina sono controlli con le parole. Nessuna illustrazione in testata.
import { useId, useMemo, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import { Pagina, BottoneSecondario, Vuoto } from './componenti';
import { FiltriChip, FoglioInfo, PulsanteInfo } from '../ui';
import { CATEGORIE_FAQ, cercaFaq, vociFaq, type CategoriaFaq, type VoceFaq } from '../../../lib/servizi/faq';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';

function Voce({ voce, aperta, onToggle }: { voce: VoceFaq; aperta: boolean; onToggle: () => void }) {
  const { vai, apriLegale } = useExtra();
  const id = useId();
  return (
    <li data-testo-ok className="rounded-[16px] border border-linea bg-superficie shadow-sm dark:shadow-none">
      <h3>
        <button type="button" id={`${id}-b`} aria-expanded={aperta} aria-controls={`${id}-p`} onClick={() => { playTapSound(); onToggle(); }}
          className="brand-premibile flex min-h-[56px] w-full items-center justify-between gap-3 rounded-[16px] px-4 py-3.5 text-left text-[15px] leading-[21px] font-semibold text-testo">
          <span>{voce.domanda}</span>
          <Icona nome="espandi" size={20} className={cn('shrink-0 text-testo-tenue', aperta && 'rotate-180')} />
        </button>
      </h3>
      {aperta && (
        <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className="px-4 pb-4">
          {voce.risposta.map((p, i) => <p key={i} className={cn('text-[14px] leading-[22px] text-testo', i > 0 && 'mt-2')}>{p}</p>)}
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
            {voce.vai && <button type="button" onClick={() => vai(voce.vai!.id, voce.vai!.params)} className="min-h-[44px] rounded text-[14px] font-bold text-azione-testo underline underline-offset-2">{voce.vai.testo}</button>}
            {voce.legale && <button type="button" onClick={() => apriLegale(voce.legale!.sezione)} className="min-h-[44px] rounded text-[14px] font-bold text-azione-testo underline underline-offset-2">{voce.legale.testo}</button>}
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
  const filtri: { id: CategoriaFaq | 'tutte'; nome: string }[] = [{ id: 'tutte', nome: 'Tutte' }, ...CATEGORIE_FAQ.map(c => ({ id: c.id, nome: c.nome }))];

  return (
    <Pagina titolo="Domande frequenti" destra={<PulsanteInfo onClick={() => setInfo(true)} etichetta="Avvertenze" />}>
      <div className="mt-3">
        <label htmlFor={campo} className="sr-only">Cerca nelle domande</label>
        <div className="flex items-center gap-2 rounded-[14px] border border-bordo-campo bg-superficie px-3.5 focus-within:outline focus-within:outline-2 focus-within:outline-azione">
          <Icona nome="cerca" size={20} className="shrink-0 text-testo-tenue" />
          <input id={campo} type="search" value={testo} onChange={e => setTesto(e.target.value)} placeholder="Cerca nelle domande" autoComplete="off" maxLength={80}
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-testo placeholder:text-testo-tenue outline-none [&::-webkit-search-cancel-button]:hidden" />
          {testo && (
            <button type="button" onClick={() => setTesto('')} aria-label="Cancella la ricerca" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-testo-tenue">
              <Icona nome="chiudi" size={18} />
            </button>
          )}
        </div>
      </div>

      <FiltriChip<CategoriaFaq | 'tutte'> className="mt-3" nome="Categoria" voci={filtri} valore={categoria} onScegli={c => { setCategoria(c); setAperta(null); }} />

      {risultati.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2.5">
          {risultati.map(v => <Voce key={v.id} voce={v} aperta={aperta === v.id} onToggle={() => setAperta(aperta === v.id ? null : v.id)} />)}
        </ul>
      ) : (
        <Vuoto className="mt-4" illustrazione="ricerca-scintille" titolo="Nessun risultato" causa="Prova con altre parole, o scrivici cosa cercavi."
          azioni={<BottoneSecondario icona={<Icona nome="segnala" size={20} />} onClick={() => vai('segnala', { tipo: 'idea' })}>Scrivici un'idea</BottoneSecondario>} />
      )}

      <FoglioInfo aperto={info} onChiudi={() => setInfo(false)} titolo="Avvertenze">
        <p>Le regole del test possono cambiare: controlla sempre il regolamento aggiornato del tuo corso.</p>
      </FoglioInfo>
    </Pagina>
  );
}
