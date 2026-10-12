// Panoramica di una lezione (params.id = id dell'argomento di teoria): obiettivo, tempo stimato, passi, avanzamento vero e i due bottoni.
// Concept: 31 («dettaglio lezione», 12) e 49. Niente promesse sul punteggio: solo contenuto e avanzamento misurato.
import { useMemo } from 'react';
import { BookOpen, Check, ChevronRight, Dumbbell, Lock, ShieldCheck } from 'lucide-react';
import { useExtra } from '../contesto';
import { lezioniPercorso, obiettivoLezione, filtroArgomento, QUOTA_LEZIONE_IMPARATA, DOMANDE_PER_SESSIONE, SECONDI_PER_DOMANDA } from '../../../lib/studio/percorso';
import { playTapSound } from '../../../lib/audio';
import { cn } from '../../../lib/utils';
import { Pagina, Carta, Barra, Bottone, StatoVuoto, TitoloSezione } from './comune';

function Passo({ n, icona, titolo, testo, fatto }: { n: number; icona: React.ReactNode; titolo: string; testo: string; fatto?: boolean }) {
  return (
    <li className="flex items-start gap-3 rounded-[12px] bg-superficie-2 p-3">
      <span aria-hidden="true" className={cn('shrink-0 grid place-items-center w-[38px] h-[38px] rounded-[11px]', fatto ? 'bg-alto-pieno text-azione-su' : 'bg-superficie text-azione dark:border dark:border-linea')}>
        {fatto ? <Check size={20} strokeWidth={3} /> : icona}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] leading-[20px] font-bold text-testo"><span className="text-testo-tenue font-semibold">{n}. </span>{titolo}{fatto && <span className="sr-only"> (fatto)</span>}</span>
        <span className="block mt-0.5 text-[13.5px] leading-[19px] text-testo-tenue">{testo}</span>
      </span>
    </li>
  );
}

export default function LezioneDettaglio() {
  const { appState, pass, params, vai, indietro, apriTeoria, apriPaywall, avviaEsercizi } = useExtra();
  const lezioni = useMemo(() => lezioniPercorso(appState, pass), [appState, pass]);
  const i = lezioni.findIndex(l => l.topic.id === params.id);
  const l = i >= 0 ? lezioni[i] : null;

  if (!l) {
    return (
      <Pagina titolo="Lezione" onIndietro={indietro}>
        <div className="mt-6">
          <StatoVuoto titolo="Lezione non trovata" testo="Questa lezione non esiste o non è ancora pronta. Scegline una dal percorso.">
            <Bottone onClick={() => vai('percorso')}>Apri il percorso</Bottone>
          </StatoVuoto>
        </div>
      </Pagina>
    );
  }

  const { topic } = l;
  const { cosa, inBreve } = obiettivoLezione(topic);
  const totaleDomande = l.disponibili || l.intere;
  const percento = totaleDomande > 0 ? Math.round((l.imparate / totaleDomande) * 100) : 0;
  const successiva = lezioni[i + 1];
  const nEsercizi = Math.min(DOMANDE_PER_SESSIONE, l.disponibili);

  const apriLaTeoria = () => (l.teoriaBloccata ? apriPaywall() : apriTeoria(topic.id));
  const esercitati = () => (l.disponibili > 0 ? avviaEsercizi('category', filtroArgomento(topic)) : apriPaywall());

  return (
    <Pagina titolo={topic.titolo} onIndietro={indietro}
      sotto={<>Lezione {l.numero} di {lezioni.length} · Livello {topic.livello}</>}>
      <Carta className="mt-4 p-4">
        <p className="text-[15px] font-bold text-testo">
          {l.stato === 'imparata' ? 'Lezione imparata' : l.stato === 'in-corso' ? 'Lezione in corso' : 'Lezione da iniziare'}
        </p>
        <div className="mt-2.5"><Barra valore={percento} colore={l.stato === 'imparata' ? 'var(--color-alto)' : 'var(--color-azione)'} alta={8} /></div>
        <p className="mt-2 text-[13px] leading-[18px] text-testo-tenue">
          <span className="tabular-nums font-semibold text-testo">{l.imparate}/{totaleDomande}</span> domande imparate
          {l.stato !== 'imparata' && <> · la lezione è imparata a {Math.round(QUOTA_LEZIONE_IMPARATA * 100)}&nbsp;%</>}.
          {!pass && l.intere > l.disponibili && <> Gratis hai {l.disponibili} domande di questo argomento, con il Pass {l.intere}.</>}
        </p>
      </Carta>

      <section aria-labelledby="titolo-obiettivo" className="mt-6 flex flex-col gap-2">
        <TitoloSezione id="titolo-obiettivo">Obiettivo</TitoloSezione>
        <p className="text-[15px] leading-[22px] text-testo font-semibold">{cosa}</p>
        {inBreve && <p className="text-[14px] leading-[21px] text-testo-tenue">La regola in breve: {inBreve.charAt(0).toLowerCase()}{inBreve.slice(1)}.</p>}
      </section>

      <section aria-labelledby="titolo-tempo" className="mt-6 flex flex-col gap-2">
        <TitoloSezione id="titolo-tempo">Tempo stimato</TitoloSezione>
        <p className="text-[15px] leading-[22px] text-testo">
          <span className="font-bold tabular-nums">{l.minuti.totale} min</span>
          <span className="text-testo-tenue"> · teoria {l.minuti.teoria} min{l.minuti.esercizi > 0 && <>, esercizi {l.minuti.esercizi} min</>}</span>
        </p>
        <p className="text-[12.5px] leading-[18px] text-testo-tenue">
          La teoria è calcolata sulla lunghezza della scheda (180 parole al minuto). Gli esercizi sono {nEsercizi} domande a {SECONDI_PER_DOMANDA} secondi l’una, come al test.
        </p>
      </section>

      <section aria-labelledby="titolo-passi" className="mt-6 flex flex-col gap-2.5">
        <TitoloSezione id="titolo-passi">I tre passi</TitoloSezione>
        <ol className="flex flex-col gap-2">
          <Passo n={1} icona={<BookOpen size={20} />} titolo="Teoria" testo="La regola, gli esempi e gli errori tipici di chi parla italiano." />
          <Passo n={2} icona={<Dumbbell size={20} />} titolo="Esercizi"
            testo={l.disponibili > 0 ? `${l.viste} ${l.viste === 1 ? 'domanda' : 'domande'} su ${l.disponibili} già ${l.viste === 1 ? 'vista' : 'viste'} almeno una volta.` : 'Le domande di questo argomento sono nel Pass.'}
            fatto={l.disponibili > 0 && l.viste >= l.disponibili} />
          <Passo n={3} icona={<ShieldCheck size={20} />} titolo="Verifica"
            testo={`Rispondi giusto due volte, a mezza giornata di distanza, ad almeno l’${Math.round(QUOTA_LEZIONE_IMPARATA * 100)}\u00a0% delle domande: ora ${l.imparate} su ${totaleDomande}.`}
            fatto={l.stato === 'imparata'} />
        </ol>
      </section>

      <div className="mt-6 flex flex-col gap-2.5">
        <Bottone onClick={apriLaTeoria} icona={l.teoriaBloccata ? <Lock size={17} aria-hidden="true" /> : <BookOpen size={18} aria-hidden="true" />}>
          {l.teoriaBloccata ? 'Apri la teoria (nel Pass)' : 'Apri la teoria'}
        </Bottone>
        <Bottone variante="secondario" onClick={esercitati} icona={l.disponibili > 0 ? <Dumbbell size={18} aria-hidden="true" /> : <Lock size={17} aria-hidden="true" />}>
          Esercitati su questo argomento
        </Bottone>
      </div>

      <nav aria-label="Altre lezioni" className="mt-5 flex flex-col gap-2">
        {successiva && (
          <button type="button" onClick={() => { playTapSound(); vai('lezione-dettaglio', { id: successiva.topic.id }); }}
            className="w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 p-3 text-left">
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] font-semibold text-testo-tenue">Lezione successiva</span>
              <span className="block text-[14.5px] leading-[20px] font-bold text-testo break-words">{successiva.topic.titolo}</span>
            </span>
            <ChevronRight size={22} className="shrink-0 text-testo-tenue" aria-hidden="true" />
          </button>
        )}
        <button type="button" onClick={() => { playTapSound(); vai('percorso'); }}
          className="min-h-[44px] text-[14px] font-semibold text-azione underline underline-offset-4">
          Vedi tutto il percorso
        </button>
      </nav>
    </Pagina>
  );
}
