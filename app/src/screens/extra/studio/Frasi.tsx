// «Frasi e vocaboli»: le frasi inglesi corrette del banco domande, con traduzione, preferite e lettura ad alta voce.
// Concept: 18 (scheda 3) e 36/49 («Esplora → frasi»). Le frasi vengono dal banco vero (lib/studio/frasi.ts), niente di inventato.
import { useMemo, useState } from 'react';
import { BookOpen, Search, Star, Volume2, X } from 'lucide-react';
import { useExtra, useExtraDati } from '../contesto';
import { questions, isCoreId } from '../../../data/questions';
import { estraiFrasi, filtraFrasi, contaFrasi, statoFrase, type Frase, type FiltroFrasi } from '../../../lib/studio/frasi';
import { useSintesi } from '../../../lib/studio/sintesi';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, StatoVuoto } from './comune';

// Si calcolano una volta sola: il banco non cambia mentre l'app è aperta.
let cache: Frase[] | null = null;
const tutteLeFrasi = () => (cache ??= estraiFrasi(questions, isCoreId));

const FILTRI: { id: FiltroFrasi; nome: string }[] = [
  { id: 'tutte', nome: 'Tutte' },
  { id: 'preferite', nome: 'Preferite' },
  { id: 'da-ripassare', nome: 'Da ripassare' },
  { id: 'gia-note', nome: 'Già note' },
];
const PAGINA = 40;

const VUOTI: Record<Exclude<FiltroFrasi, 'tutte'>, { titolo: string; testo: string }> = {
  preferite: { titolo: 'Nessuna frase preferita', testo: 'Tocca la stella accanto a una frase per salvarla qui.' },
  'da-ripassare': { titolo: 'Niente da ripassare', testo: 'Qui compaiono le frasi delle domande che sbagli, finché non le impari.' },
  'gia-note': { titolo: 'Ancora nessuna frase nota', testo: 'Qui compaiono le frasi delle domande che hai imparato: due risposte giuste a distanza di mezza giornata.' },
};

export default function Frasi() {
  const { appState, pass, indietro, apriTeoria, apriPaywall } = useExtra();
  const [preferiteElenco, setPreferite] = useExtraDati<string[]>('frasi-preferite', []);
  const preferite = useMemo(() => new Set(Array.isArray(preferiteElenco) ? preferiteElenco : []), [preferiteElenco]);
  const [testo, setTesto] = useState('');
  const [filtro, setFiltro] = useState<FiltroFrasi>('tutte');
  const [quante, setQuante] = useState(PAGINA);
  const [aperta, setAperta] = useState<string | null>(null);
  const { disponibile, inLettura, leggi, ferma } = useSintesi();

  const tutte = tutteLeFrasi();
  const stats = appState.stats;
  const conteggi = useMemo(() => contaFrasi(tutte, { preferite, stats, pass }), [tutte, preferite, stats, pass]);
  const elenco = useMemo(() => filtraFrasi(tutte, { testo, filtro, preferite, stats, pass }), [tutte, testo, filtro, preferite, stats, pass]);
  const visibili = elenco.slice(0, quante);

  const alternaPreferita = (id: string) => {
    playTapSound();
    setPreferite(prec => {
      const lista = Array.isArray(prec) ? prec : [];
      return lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id];
    });
  };

  const totaleBanco = tutte.length;
  return (
    <Pagina titolo="Frasi e vocaboli" onIndietro={indietro}
      sotto={`${conteggi.tutte} frasi del banco domande, con la traduzione.`}>
      <div className="mt-4 relative">
        <Search size={18} aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-testo-tenue pointer-events-none" />
        <input type="search" value={testo} onChange={e => { setTesto(e.target.value); setQuante(PAGINA); }}
          aria-label="Cerca una frase, una parola o un tema" placeholder="Cerca una frase, parola o tema…" autoComplete="off" spellCheck={false}
          className="w-full h-[46px] rounded-[12px] border border-linea bg-superficie-2 pl-10 pr-10 text-[15px] text-testo placeholder:text-testo-tenue outline-none focus:border-azione" />
        {testo && (
          <button type="button" onClick={() => { setTesto(''); setQuante(PAGINA); }} aria-label="Cancella la ricerca"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-9 h-9 rounded-full text-testo-tenue hover:text-testo">
            <X size={17} aria-hidden="true" />
          </button>
        )}
      </div>

      <div role="group" aria-label="Filtra le frasi" className="mt-3 flex flex-wrap gap-2">
        {FILTRI.map(f => {
          const on = filtro === f.id;
          return (
            <button key={f.id} type="button" aria-pressed={on} onClick={() => { playTapSound(); setFiltro(f.id); setQuante(PAGINA); }}
              className={cn('min-h-[38px] rounded-full px-3.5 text-[13.5px] font-semibold border transition-colors duration-100',
                on ? 'bg-azione text-azione-su border-azione' : 'bg-superficie text-testo-tenue border-linea hover:text-testo')}>
              {f.nome}<span className={cn('ml-1.5 tabular-nums text-[12px]', on ? 'text-azione-su' : 'text-testo-tenue')}>{conteggi[f.id]}</span>
            </button>
          );
        })}
      </div>

      {!pass && (
        <p className="mt-3 text-[13px] leading-[18px] text-testo-tenue">
          Gratis trovi le {conteggi.tutte} frasi del nucleo di domande. Con il Pass sono tutte e {totaleBanco}.{' '}
          <button type="button" onClick={() => { playTapSound(); apriPaywall(); }} className="font-semibold text-azione underline underline-offset-2">Scopri il Pass</button>
        </p>
      )}

      <div className="mt-4">
        {elenco.length === 0 ? (
          testo.trim()
            ? <StatoVuoto titolo="Nessuna frase trovata" testo="Prova con un’altra parola, in inglese o in italiano." />
            : filtro === 'tutte'
              ? <StatoVuoto titolo="Nessuna frase disponibile" testo="Le frasi arrivano dalle domande del banco: appena ce ne sono, le trovi qui." />
              : <StatoVuoto titolo={VUOTI[filtro].titolo} testo={VUOTI[filtro].testo} />
        ) : (
          <ul className="flex flex-col gap-2" aria-label="Elenco delle frasi">
            {visibili.map(f => {
              const pref = preferite.has(f.id);
              const apertaOra = aperta === f.id;
              const stato = statoFrase(f, stats);
              const inCorso = inLettura === f.id;
              return (
                <li key={f.id} className="rounded-[12px] bg-superficie-2">
                  <div className="flex items-stretch">
                    {disponibile && (
                      <button type="button" aria-label={inCorso ? `Ferma la lettura: ${f.en}` : `Ascolta: ${f.en}`} aria-pressed={inCorso}
                        onClick={() => { playTapSound(); if (inCorso) ferma(); else leggi(f.id, f.en); }}
                        className="shrink-0 grid place-items-center w-[52px] text-azione">
                        <span className={cn('grid place-items-center w-9 h-9 rounded-full transition-colors duration-100', inCorso ? 'bg-azione text-azione-su' : 'bg-azione-tinta text-azione')}>
                          <Volume2 size={18} aria-hidden="true" />
                        </span>
                      </button>
                    )}
                    <button type="button" aria-expanded={apertaOra} onClick={() => { playTapSound(); setAperta(apertaOra ? null : f.id); }}
                      className={cn('flex-1 min-w-0 py-3 text-left', disponibile ? 'pl-0' : 'pl-4')}>
                      <span lang="en" className="block text-[15.5px] leading-[21px] font-bold text-testo break-words">{f.en}</span>
                      <span className={cn('mt-0.5 block text-[13.5px] leading-[19px] text-testo-tenue break-words', apertaOra ? '' : 'line-clamp-2')}>
                        {f.itTipo === 'regola' && <span className="font-semibold">Regola: </span>}{f.it}
                      </span>
                      {(stato.daRipassare || stato.nota) && (
                        <span className={cn('mt-1.5 inline-block rounded-full px-2 py-0.5 text-[11.5px] font-semibold', stato.daRipassare ? 'bg-basso-tinta text-basso-testo' : 'bg-alto-tinta text-alto-testo')}>
                          {stato.daRipassare ? 'Da ripassare' : 'Già nota'}
                        </span>
                      )}
                    </button>
                    <button type="button" aria-label={pref ? `Togli dalle preferite: ${f.en}` : `Salva tra le preferite: ${f.en}`} aria-pressed={pref}
                      onClick={() => alternaPreferita(f.id)} className="shrink-0 grid place-items-center w-[48px] text-testo-tenue">
                      <Star size={22} aria-hidden="true" strokeWidth={2} className={pref ? 'text-medio' : undefined} fill={pref ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  {apertaOra && (
                    <div className="px-4 pb-3.5 pt-0.5">
                      {f.itTipo === 'traduzione' && f.spiegazione && (
                        <p className="text-[13.5px] leading-[20px] text-testo"><span className="font-semibold">Perché: </span>{f.spiegazione}</p>
                      )}
                      {f.itTipo === 'regola' && f.spiegazione && f.spiegazione !== f.it && (
                        <p className="text-[13.5px] leading-[20px] text-testo">{f.spiegazione}</p>
                      )}
                      {f.theoryId && (
                        <button type="button" onClick={() => { playTapSound(); apriTeoria(f.theoryId); }}
                          className="mt-2 inline-flex items-center gap-1.5 min-h-[36px] text-[14px] font-semibold text-azione underline underline-offset-2">
                          <BookOpen size={16} aria-hidden="true" /> Apri la teoria
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
          <button type="button" onClick={() => { playTapSound(); setQuante(n => n + PAGINA); }}
            className="mt-3 w-full min-h-[46px] rounded-[12px] border border-linea text-[14.5px] font-semibold text-azione hover:bg-azione-tinta">
            Mostra altre frasi ({elenco.length - visibili.length})
          </button>
        )}
        {elenco.length > 0 && <p className="mt-3 text-[12.5px] text-testo-tenue" aria-live="polite">{elenco.length === 1 ? '1 frase' : `${elenco.length} frasi`}</p>}
        {!disponibile && <p className="mt-1 text-[12.5px] leading-[17px] text-testo-tenue">L’ascolto compare solo se questo dispositivo ha una voce inglese.</p>}
      </div>
    </Pagina>
  );
}
