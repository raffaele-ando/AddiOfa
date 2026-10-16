// «Frasi e vocaboli»: le frasi inglesi corrette del banco domande, con traduzione, preferite e lettura ad alta voce.
// Concept: 18 (scheda 3) e 36/49 («Esplora → frasi»). Le frasi vengono dal banco vero (lib/studio/frasi.ts), niente di inventato.
import { useMemo, useState } from 'react';
import { useExtra, useExtraDati } from '../contesto';
import { Icona, type NomeIcona } from '../../../brand/icone/Icona';
import { questions } from '../../../data/questions';
import { estraiFrasi, filtraFrasi, contaFrasi, statoFrase, type Frase, type FiltroFrasi } from '../../../lib/studio/frasi';
import { useSintesi } from '../../../lib/studio/sintesi';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, StatoVuoto, Arte } from './comune';

// Si calcolano una volta sola: il banco non cambia mentre l'app è aperta.
let cache: Frase[] | null = null;
const tutteLeFrasi = () => (cache ??= estraiFrasi(questions));

// Il filtro scelto prende il colore dell'icona che compare sulle righe: preferite ambra, da ripassare corallo, già note verde. Solo icone e numeri.
const FILTRI: { id: FiltroFrasi; nome: string; icona: NomeIcona; attivo: string }[] = [
  { id: 'tutte', nome: 'Tutte', icona: 'filtro-tutte', attivo: 'bg-azione-tinta text-azione-scuro border-azione' },
  { id: 'preferite', nome: 'Preferite', icona: 'preferita', attivo: 'bg-medio-tinta text-medio-testo border-medio' },
  { id: 'da-ripassare', nome: 'Da ripassare', icona: 'stato-da-ripassare', attivo: 'bg-basso-tinta text-basso-testo border-basso' },
  { id: 'gia-note', nome: 'Già note', icona: 'stato-imparata', attivo: 'bg-alto-tinta text-alto-testo border-alto' },
];
const PAGINA = 40;

// Stati vuoti: la nuvola per «ancora niente», il foglio con la spunta quando non c'è nulla da ripassare (è una buona notizia)
const VUOTI: Record<Exclude<FiltroFrasi, 'tutte'>, { titolo: string; nome: string }> = {
  preferite: { titolo: 'Nessuna preferita', nome: 'vuoto' },
  'da-ripassare': { titolo: 'Niente da ripassare', nome: 'documento-completato' },
  'gia-note': { titolo: 'Nessuna già nota', nome: 'vuoto' },
};

export default function Frasi() {
  const { appState, indietro, apriTeoria } = useExtra();
  const [preferiteElenco, setPreferite] = useExtraDati<string[]>('frasi-preferite', []);
  const preferite = useMemo(() => new Set(Array.isArray(preferiteElenco) ? preferiteElenco : []), [preferiteElenco]);
  const [testo, setTesto] = useState('');
  const [filtro, setFiltro] = useState<FiltroFrasi>('tutte');
  const [quante, setQuante] = useState(PAGINA);
  const [aperta, setAperta] = useState<string | null>(null);
  const { disponibile, inLettura, leggi, ferma } = useSintesi();

  const tutte = tutteLeFrasi();
  const stats = appState.stats;
  const conteggi = useMemo(() => contaFrasi(tutte, { preferite, stats }), [tutte, preferite, stats]);
  const elenco = useMemo(() => filtraFrasi(tutte, { testo, filtro, preferite, stats }), [tutte, testo, filtro, preferite, stats]);
  const visibili = elenco.slice(0, quante);

  const alternaPreferita = (id: string) => {
    playTapSound();
    setPreferite(prec => {
      const lista = Array.isArray(prec) ? prec : [];
      return lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id];
    });
  };

  return (
    <Pagina titolo="Frasi" onIndietro={indietro} destra={<Arte nome="ricerca" kit="kit-luminoso" lato={132} className="-mt-3 -mb-3" />}>
      <div className="mt-4 relative">
        <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue pointer-events-none"><Icona nome="cerca" size={18} /></span>
        <input type="search" value={testo} onChange={e => { setTesto(e.target.value); setQuante(PAGINA); }}
          aria-label="Cerca" placeholder="Cerca" autoComplete="off" spellCheck={false}
          className="w-full h-[46px] rounded-[12px] border border-linea bg-superficie-2 pl-10 pr-10 text-[15px] text-testo placeholder:text-testo-tenue outline-none focus:border-azione" />
        {testo && (
          <button type="button" onClick={() => { setTesto(''); setQuante(PAGINA); }} aria-label="Cancella"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo">
            <Icona nome="chiudi" size={17} />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filtri" className="mt-3 grid grid-cols-4 gap-2">
        {FILTRI.map(f => {
          const on = filtro === f.id;
          return (
            <button key={f.id} type="button" aria-pressed={on} aria-label={f.nome} onClick={() => { playTapSound(); setFiltro(f.id); setQuante(PAGINA); }}
              className={cn('min-h-[48px] flex items-center justify-center gap-1.5 rounded-[12px] px-1.5 text-[13px] font-semibold border transition-colors duration-100',
                on ? f.attivo : 'bg-superficie text-testo-tenue border-linea hover:text-testo')}>
              <Icona nome={f.icona} size={20} /><span className="tabular-nums">{conteggi[f.id]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {elenco.length === 0 ? (
          testo.trim() || filtro === 'tutte'
            ? <StatoVuoto illustrazione={{ nome: 'ricerca-scintille' }} titolo="Nessuna frase" />
            : <StatoVuoto illustrazione={{ nome: VUOTI[filtro].nome }} titolo={VUOTI[filtro].titolo} />
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Frasi">
            {visibili.map(f => {
              const pref = preferite.has(f.id);
              const apertaOra = aperta === f.id;
              const stato = statoFrase(f, stats);
              const inCorso = inLettura === f.id;
              return (
                <li key={f.id} className="rounded-[12px] border border-linea bg-superficie">
                  <div className="flex items-stretch">
                    {disponibile && (
                      <button type="button" aria-label={inCorso ? `Ferma: ${f.en}` : `Ascolta: ${f.en}`} aria-pressed={inCorso}
                        onClick={() => { playTapSound(); if (inCorso) ferma(); else leggi(f.id, f.en); }}
                        className="shrink-0 grid place-items-center w-[52px] text-azione">
                        <span className={cn('grid place-items-center w-9 h-9 rounded-full transition-colors duration-100', inCorso ? 'bg-azione text-azione-su' : 'bg-azione-tinta text-azione')}>
                          <Icona nome={inCorso ? 'ferma' : 'ascolta'} size={18} />
                        </span>
                      </button>
                    )}
                    <button type="button" aria-expanded={apertaOra} onClick={() => { playTapSound(); setAperta(apertaOra ? null : f.id); }}
                      className={cn('flex-1 min-w-0 py-3 text-left', disponibile ? 'pl-0' : 'pl-4')}>
                      <span data-testo-ok lang="en" className="block text-[15.5px] leading-[21px] font-bold text-testo break-words">{f.en}</span>
                      <span data-testo-ok className={cn('mt-0.5 block text-[13.5px] leading-[19px] text-testo-tenue break-words', apertaOra ? '' : 'line-clamp-2')}>
                        {f.itTipo === 'regola' && <span aria-hidden="true" className="mr-1 inline-block align-[-3px] text-azione-scuro"><Icona nome="teoria" size={15} /></span>}{f.it}
                      </span>
                      {(stato.daRipassare || stato.nota) && (
                        <span role="img" aria-label={stato.daRipassare ? 'Da ripassare' : 'Già nota'}
                          className={cn('mt-1.5 inline-flex items-center rounded-full px-1.5 py-0.5', stato.daRipassare ? 'bg-basso-tinta text-basso-testo' : 'bg-alto-tinta text-alto-testo')}>
                          <Icona nome={stato.daRipassare ? 'stato-da-ripassare' : 'stato-imparata'} size={14} />
                        </span>
                      )}
                    </button>
                    <button type="button" aria-label={pref ? `Togli dalle preferite: ${f.en}` : `Salva tra le preferite: ${f.en}`} aria-pressed={pref}
                      onClick={() => alternaPreferita(f.id)} className="shrink-0 grid place-items-center w-[48px]">
                      <span className={cn('grid place-items-center w-9 h-9 rounded-full transition-colors duration-100', pref ? 'bg-medio-tinta text-medio-numero' : 'text-testo-tenue')}>
                        <Icona nome="preferita" size={22} />
                      </span>
                    </button>
                  </div>
                  {apertaOra && (
                    <div className="px-4 pb-3.5 pt-0.5">
                      {f.itTipo === 'traduzione' && f.spiegazione && (
                        <p data-testo-ok className="flex gap-2 text-[13.5px] leading-[20px] text-testo">
                          <span aria-hidden="true" className="mt-0.5 shrink-0 text-medio-numero"><Icona nome="suggerimento" size={16} /></span>{f.spiegazione}
                        </p>
                      )}
                      {f.itTipo === 'regola' && f.spiegazione && f.spiegazione !== f.it && (
                        <p data-testo-ok className="text-[13.5px] leading-[20px] text-testo">{f.spiegazione}</p>
                      )}
                      {f.theoryId && (
                        <button type="button" onClick={() => { playTapSound(); apriTeoria(f.theoryId); }}
                          className="mt-2 inline-flex items-center gap-1.5 min-h-[36px] text-[14px] font-semibold text-azione">
                          <Icona nome="teoria" size={18} /> Teoria
                        </button>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {elenco.length > visibili.length && (
          <button type="button" onClick={() => { playTapSound(); setQuante(n => n + PAGINA); }} aria-label="Mostra altre"
            className="mt-3 w-full min-h-[46px] rounded-[12px] border border-linea text-[14.5px] font-semibold tabular-nums text-azione hover:bg-azione-tinta">
            +{elenco.length - visibili.length}
          </button>
        )}
      </div>
    </Pagina>
  );
}
