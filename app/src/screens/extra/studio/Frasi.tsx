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
import { Pagina, StatoVuoto, Bottone, tipografiche } from './comune';

// Si calcolano una volta sola: il banco non cambia mentre l'app è aperta.
let cache: Frase[] | null = null;
const tutteLeFrasi = () => (cache ??= estraiFrasi(questions));

// Il filtro scelto prende il colore dell'icona che compare sulle righe: preferite ambra, da ripassare corallo, imparate verde. Ogni filtro ha la sua parola e il numero.
const FILTRI: { id: FiltroFrasi; nome: string; icona: NomeIcona; attivo: string }[] = [
  { id: 'tutte', nome: 'Tutte', icona: 'filtro-tutte', attivo: 'bg-azione-tinta text-azione-testo border-azione' },
  { id: 'preferite', nome: 'Preferite', icona: 'preferita', attivo: 'bg-medio-tinta text-medio-testo border-medio' },
  { id: 'da-ripassare', nome: 'Da ripassare', icona: 'stato-da-ripassare', attivo: 'bg-basso-tinta text-basso-testo border-basso' },
  { id: 'gia-note', nome: 'Imparate', icona: 'stato-imparata', attivo: 'bg-alto-tinta text-alto-testo border-alto' },
];
const PAGINA = 40;

// Stati vuoti: la causa in una riga; il foglio con la spunta quando non c'è nulla da ripassare (è una buona notizia)
const VUOTI: Record<Exclude<FiltroFrasi, 'tutte'>, { titolo: string; testo: string; nome: string }> = {
  preferite: { titolo: 'Nessuna preferita', testo: 'Tocca la stella accanto a una frase per salvarla.', nome: 'vuoto' },
  'da-ripassare': { titolo: 'Niente da ripassare', testo: 'Qui compaiono le frasi che sbagli negli esercizi.', nome: 'documento-completato' },
  'gia-note': { titolo: 'Nessuna frase imparata', testo: 'Compaiono quando rispondi bene più volte.', nome: 'vuoto' },
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
    <Pagina titolo="Frasi utili" onIndietro={indietro}>
      <div className="mt-4 relative">
        <span aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue pointer-events-none"><Icona nome="cerca" size={18} /></span>
        <input type="search" value={testo} onChange={e => { setTesto(e.target.value); setQuante(PAGINA); }}
          aria-label="Cerca una frase" placeholder="Cerca una frase" autoComplete="off" spellCheck={false}
          className="w-full h-[46px] rounded-[12px] border border-bordo-campo bg-superficie-2 pl-10 pr-10 text-[15px] text-testo placeholder:text-testo-tenue outline-none focus:border-azione" />
        {testo && (
          <button type="button" onClick={() => { setTesto(''); setQuante(PAGINA); }} aria-label="Cancella"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo">
            <Icona nome="chiudi" size={17} />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filtri" className="mt-3 flex flex-wrap gap-2">
        {FILTRI.map(f => {
          const on = filtro === f.id;
          return (
            <button key={f.id} type="button" aria-pressed={on} onClick={() => { playTapSound(); setFiltro(f.id); setQuante(PAGINA); }}
              className={cn('min-h-[44px] flex items-center justify-center gap-1.5 rounded-full px-3.5 text-[14px] font-bold border transition-colors duration-100',
                on ? f.attivo : 'bg-superficie text-testo border-linea hover:bg-superficie-2')}>
              <Icona nome={f.icona} size={18} />{f.nome}<span className="tabular-nums font-extrabold">{conteggi[f.id]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4">
        {elenco.length === 0 ? (
          testo.trim() || filtro === 'tutte'
            ? (
              <StatoVuoto illustrazione={{ nome: 'ricerca-scintille' }} titolo="Nessuna frase trovata" testo="Prova con un'altra parola.">
                {testo && <Bottone variante="secondario" onClick={() => { setTesto(''); setQuante(PAGINA); }} icona={<Icona nome="chiudi" size={18} />}>Cancella la ricerca</Bottone>}
              </StatoVuoto>
            )
            : (
              <StatoVuoto illustrazione={{ nome: VUOTI[filtro].nome }} titolo={VUOTI[filtro].titolo} testo={VUOTI[filtro].testo}>
                <Bottone variante="secondario" onClick={() => { setFiltro('tutte'); setQuante(PAGINA); }}>Vedi tutte le frasi</Bottone>
              </StatoVuoto>
            )
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
                      <span data-testo-ok className={cn('mt-0.5 block text-[14px] leading-[20px] text-testo-tenue break-words', apertaOra ? '' : 'line-clamp-3')}>
                        {tipografiche(f.it)}
                      </span>
                      {!apertaOra && f.it.length > 130 && <span aria-hidden="true" className="mt-0.5 block text-[13px] font-bold text-azione-testo">Altro</span>}
                      {(stato.daRipassare || stato.nota) && (
                        <span className={cn('mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-bold', stato.daRipassare ? 'bg-basso-tinta text-basso-testo' : 'bg-alto-tinta text-alto-testo')}>
                          <Icona nome={stato.daRipassare ? 'stato-da-ripassare' : 'stato-imparata'} size={13} />{stato.daRipassare ? 'Da ripassare' : 'Imparata'}
                        </span>
                      )}
                    </button>
                    <button type="button" aria-label={pref ? `Togli dalle preferite: ${f.en}` : `Salva tra le preferite: ${f.en}`} aria-pressed={pref}
                      onClick={() => alternaPreferita(f.id)} className="shrink-0 grid place-items-center w-[48px] self-stretch">
                      <Icona nome="preferita" size={24} pieno={pref} className={cn('transition-colors duration-100', pref ? 'text-medio-numero' : 'text-testo-tenue')} />
                    </button>
                  </div>
                  {apertaOra && (
                    <div className="px-4 pb-3.5 pt-0.5">
                      {f.itTipo === 'traduzione' && f.spiegazione && (
                        <p data-testo-ok className="flex gap-2 text-[13.5px] leading-[20px] text-testo">
                          <span aria-hidden="true" className="mt-0.5 shrink-0 text-medio-numero"><Icona nome="spiegazioni" size={16} /></span>{tipografiche(f.spiegazione)}
                        </p>
                      )}
                      {f.itTipo === 'regola' && f.spiegazione && f.spiegazione !== f.it && (
                        <p data-testo-ok className="text-[14px] leading-[21px] text-testo">{tipografiche(f.spiegazione)}</p>
                      )}
                      {f.theoryId && (
                        <button type="button" onClick={() => { playTapSound(); apriTeoria(f.theoryId); }}
                          className="mt-2 inline-flex items-center gap-1.5 min-h-[36px] text-[14px] font-semibold text-azione">
                          <Icona nome="teoria" size={18} /> Rivedi la teoria
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
          <button type="button" onClick={() => { playTapSound(); setQuante(n => n + PAGINA); }} className="mt-3 w-full min-h-[48px] rounded-[12px] border border-linea text-[14.5px] font-bold text-azione-testo hover:bg-azione-tinta">
            Mostra altre <span className="tabular-nums">{elenco.length - visibili.length}</span>
          </button>
        )}
      </div>
    </Pagina>
  );
}
