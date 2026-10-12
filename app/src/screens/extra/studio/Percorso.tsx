// «Il tuo percorso»: le lezioni in ordine didattico (una per argomento di teoria) con spunta, avanzamento e blocco del Pass.
// Concept: 49 (scheda 4, elenco lezioni), 31 (11-13), 25 («percorso»). Gli stati vengono dai progressi veri (lib/studio/percorso.ts).
import { useMemo } from 'react';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { useExtra } from '../contesto';
import { lezioniPercorso, prossimaLezione, QUOTA_LEZIONE_IMPARATA, type LezionePercorso } from '../../../lib/studio/percorso';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, TitoloSezione, Barra, Carta, Bottone } from './comune';

const LIVELLI: { id: string; nome: string; sotto: string }[] = [
  { id: 'A1', nome: 'Livello A1', sotto: 'Le basi' },
  { id: 'A2', nome: 'Livello A2', sotto: 'Il passato e il confronto' },
  { id: 'B1', nome: 'Livello B1', sotto: 'Le strutture più avanzate del test' },
];

function Pallino({ l, prossima }: { l: LezionePercorso; prossima: boolean }) {
  const fatta = l.stato === 'imparata';
  return (
    <span aria-hidden="true" className={cn('shrink-0 grid place-items-center w-[30px] h-[30px] rounded-full text-[13px] font-bold tabular-nums border-2',
      fatta ? 'bg-alto-pieno border-alto-pieno text-azione-su' : prossima ? 'border-azione text-azione' : 'border-tacca text-testo-tenue')}>
      {fatta ? <Check size={17} strokeWidth={3.2} /> : l.numero}
    </span>
  );
}

function Riga({ l, prossima, onApri }: { l: LezionePercorso; prossima: boolean; onApri: () => void }) {
  const percento = l.disponibili > 0 ? Math.round((l.imparate / l.disponibili) * 100) : 0;
  const stato = l.stato === 'imparata' ? 'imparata' : l.stato === 'in-corso' ? `in corso, ${l.imparate} domande imparate su ${l.disponibili || l.intere}` : 'da iniziare';
  return (
    <li>
      <button type="button" onClick={() => { playTapSound(); onApri(); }}
        aria-label={`Lezione ${l.numero}: ${l.topic.titolo}, ${stato}${l.teoriaBloccata ? ', scheda nel Pass' : ''}`}
        className={cn('brand-premibile w-full flex items-center gap-3 rounded-[12px] p-3 pr-2.5 text-left', prossima ? 'bg-azione-tinta' : 'bg-superficie-2')}>
        <Pallino l={l} prossima={prossima} />
        <span className="flex-1 min-w-0">
          <span className="block text-[15px] leading-[20px] font-bold text-testo break-words">{l.topic.titolo}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[12.5px] leading-[17px] text-testo-tenue">
            <span>{l.topic.livello}</span>
            <span aria-hidden="true">·</span>
            <span>{l.minuti.totale} min</span>
            {l.stato === 'in-corso' && <><span aria-hidden="true">·</span><span className="tabular-nums">{l.imparate}/{l.disponibili || l.intere} domande imparate</span></>}
            {l.stato === 'imparata' && <><span aria-hidden="true">·</span><span className="font-semibold text-alto-testo">Imparata</span></>}
          </span>
          {l.stato === 'in-corso' && <span className="mt-1.5 block"><Barra valore={percento} colore="var(--color-azione)" alta={6} /></span>}
        </span>
        {l.teoriaBloccata && <Lock size={17} className="shrink-0 text-testo-tenue" aria-hidden="true" />}
        <ChevronRight size={22} strokeWidth={2} className="shrink-0 text-testo-tenue" aria-hidden="true" />
      </button>
    </li>
  );
}

export default function Percorso() {
  const { appState, pass, vai, indietro, apriPaywall } = useExtra();
  const lezioni = useMemo(() => lezioniPercorso(appState, pass), [appState, pass]);
  const fatte = lezioni.filter(l => l.stato === 'imparata').length;
  const prossima = prossimaLezione(lezioni);
  const vaiLezione = (l: LezionePercorso) => vai('lezione-dettaglio', { id: l.topic.id });

  return (
    <Pagina titolo="Il tuo percorso" onIndietro={indietro}
      sotto="Una lezione per argomento, dai più semplici ai più avanzati. I primi sono i più frequenti nel test.">
      <Carta className="mt-4 p-4">
        <p className="text-[15px] font-bold text-testo">
          <span className="tabular-nums">{fatte}</span> lezioni imparate su <span className="tabular-nums">{lezioni.length}</span>
        </p>
        <div className="mt-2.5"><Barra valore={lezioni.length ? (fatte / lezioni.length) * 100 : 0} colore="var(--color-alto)" alta={8} /></div>
        <p className="mt-2.5 text-[12.5px] leading-[18px] text-testo-tenue">
          Una lezione conta come imparata quando hai imparato almeno l’{Math.round(QUOTA_LEZIONE_IMPARATA * 100)}&nbsp;% delle sue domande
          (risposte giuste due volte, a distanza di mezza giornata).
        </p>
        {prossima && (
          <div className="mt-3.5">
            <Bottone onClick={() => vaiLezione(prossima)}>
              {fatte === 0 && prossima.stato === 'da-iniziare' ? 'Inizia la prima lezione' : `Continua: ${prossima.topic.titolo.split(':')[0]}`}
            </Bottone>
          </div>
        )}
        {!prossima && lezioni.length > 0 && <p className="mt-3 text-[14px] font-semibold text-alto-testo">Hai imparato tutte le lezioni. Ora ripassa con le simulazioni.</p>}
      </Carta>

      {!pass && (
        <p className="mt-3 text-[13px] leading-[18px] text-testo-tenue">
          Una scheda di teoria è gratis, le altre sono nel Pass (lucchetto). Gli esercizi sul nucleo gratuito di ogni argomento sono aperti.{' '}
          <button type="button" onClick={() => { playTapSound(); apriPaywall(); }} className="font-semibold text-azione underline underline-offset-2">Scopri il Pass</button>
        </p>
      )}

      {lezioni.length === 0 && <p className="mt-6 text-[14px] text-testo-tenue">Le lezioni sono in preparazione.</p>}

      {LIVELLI.map(liv => {
        const delLivello = lezioni.filter(l => l.topic.livello === liv.id);
        if (delLivello.length === 0) return null;
        return (
          <section key={liv.id} aria-labelledby={`liv-${liv.id}`} className="mt-6 flex flex-col gap-2.5">
            <TitoloSezione id={`liv-${liv.id}`}>
              <span className="inline-flex items-baseline gap-2">{liv.nome}<span className="text-[12.5px] font-medium text-testo-tenue">{liv.sotto}</span></span>
            </TitoloSezione>
            <ol className="flex flex-col gap-2">
              {delLivello.map(l => <Riga key={l.topic.id} l={l} prossima={prossima?.topic.id === l.topic.id} onApri={() => vaiLezione(l)} />)}
            </ol>
          </section>
        );
      })}
    </Pagina>
  );
}
