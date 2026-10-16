import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { theoryTopics, type TheoryTopic } from '../data/theory';
import { FREE_LIMITS } from '../config/offer';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { RichText } from '../components/ui';
import { FONT } from '../brand/tokens';
import { Icona } from '../brand/icone/Icona';
import { ChipLivello } from './extra/studio/comune';
import { titoloBreve } from '../lib/studio/percorso';

interface TheoryProps {
  onBack(): void;
  onOpenPaywall(): void;
  initialTopicId?: string;
}

type Livello = TheoryTopic['livello'];
const LIVELLI: { id: Livello }[] = [{ id: 'A1' }, { id: 'A2' }, { id: 'B1' }];

// Ordine di studio: per livello, poi nell'ordine del file (sort stabile)
const ordinati: TheoryTopic[] = [...theoryTopics].sort(
  (a, b) => LIVELLI.findIndex(l => l.id === a.livello) - LIVELLI.findIndex(l => l.id === b.livello),
);
const pronti = ordinati.filter(t => t.pronta);
// Gratis: i primi N argomenti pronti nell'ordine di studio (quindi il primo di A1)
const gratisIds = new Set(pronti.slice(0, FREE_LIMITS.freeTheoryTopics).map(t => t.id));

/** Pagina di teoria: stessa cornice delle schermate extra (freccia a sinistra del titolo, colonna di 440 px), ma con il riferimento al titolo per il focus. */
function Cornice({ titolo, titoloRef, onBack, children, intestazione }: {
  titolo?: string; titoloRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; children: ReactNode; intestazione?: ReactNode;
}) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          <header className="flex items-start gap-1">
            <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
              className="brand-premibile -ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
              <Icona nome="indietro" size={28} />
            </button>
            <div className="min-w-0 flex-1">
              {intestazione}
              <h1 ref={titoloRef} tabIndex={-1} className="text-[26px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo outline-none break-words pt-[3px]">{titolo}</h1>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Theory({ onBack, onOpenPaywall, initialTopicId }: TheoryProps) {
  const { pass } = useAccess();
  const aperto = (t: TheoryTopic) => t.pronta && (pass || gratisIds.has(t.id));

  const [topicId, setTopicId] = useState<string | null>(() => {
    const t = theoryTopics.find(x => x.id === initialTopicId);
    return t && t.pronta && (pass || gratisIds.has(t.id)) ? t.id : null;
  });
  const topic = topicId ? theoryTopics.find(t => t.id === topicId) ?? null : null;

  // Se il Pass sparisce mentre si legge una scheda a pagamento, si torna all'elenco
  useEffect(() => {
    if (topic && !aperto(topic)) setTopicId(null);
  }, [pass]); // eslint-disable-line react-hooks/exhaustive-deps

  // Al cambio di vista il focus va al titolo: la lettura riparte dall'alto
  const titoloRef = useRef<HTMLHeadingElement>(null);
  const precedente = useRef(topicId);
  useEffect(() => {
    if (precedente.current === topicId) return;
    precedente.current = topicId;
    titoloRef.current?.focus();
    titoloRef.current?.scrollIntoView({ block: 'start' });
  }, [topicId]);

  // Aperta da una lezione (initialTopicId): la freccia riporta alla lezione; dall'elenco, all'elenco.
  const daLezione = useRef(initialTopicId !== undefined).current;

  const apri = (t: TheoryTopic) => {
    if (!t.pronta) return;
    if (aperto(t)) setTopicId(t.id);
    else onOpenPaywall();
  };

  if (topic) {
    const i = pronti.findIndex(t => t.id === topic.id);
    return (
      <Dettaglio
        topic={topic}
        prec={i > 0 ? pronti[i - 1] : null}
        succ={i >= 0 && i < pronti.length - 1 ? pronti[i + 1] : null}
        aperto={aperto}
        titoloRef={titoloRef}
        onList={daLezione ? onBack : () => setTopicId(null)}
        onGo={apri}
      />
    );
  }

  const nPronti = pronti.length;
  return (
    <Cornice titolo="Teoria" titoloRef={titoloRef} onBack={onBack}>
      {nPronti === 0 && (
        <div role="status" className="mt-4 flex flex-col items-center gap-2 rounded-[12px] bg-superficie-2 px-4 py-6 text-testo-tenue">
          <Icona nome="teoria" size={28} />
        </div>
      )}

      {LIVELLI.map(l => {
        const lista = ordinati.filter(t => t.livello === l.id);
        if (lista.length === 0) return null;
        const idTitolo = `liv-${l.id}`;
        return (
          <section key={l.id} aria-labelledby={idTitolo} className="mt-6 flex flex-col gap-2.5">
            <h2 id={idTitolo} className="inline-flex items-center gap-2">
              <ChipLivello livello={l.id} className="text-[14px] leading-[18px] px-2 py-1" /><span className="sr-only">Livello {l.id}</span>
            </h2>
            <ul className="flex flex-col gap-2">
              {lista.map(t => <Riga key={t.id} t={t} pass={pass} gratis={gratisIds.has(t.id)} onOpen={apri} />)}
            </ul>
          </section>
        );
      })}
    </Cornice>
  );
}

function Riga({ t, pass, gratis, onOpen }: { t: TheoryTopic; pass: boolean; gratis: boolean; onOpen: (t: TheoryTopic) => void }) {
  const base = 'w-full text-left rounded-[12px] px-3.5 py-3 min-h-[52px] flex items-center gap-3';
  const stato = !t.pronta ? 'arrivo' : pass || gratis ? 'aperto' : 'pass';

  const contenuto = (
    <>
      <span className="min-w-0 flex-1">
        <span className={cn('block font-bold leading-snug break-words', stato === 'arrivo' ? 'text-testo-tenue' : 'text-testo')}>{titoloBreve(t)}</span>
      </span>
      {stato === 'pass' && <span className="shrink-0 text-testo-tenue"><Icona nome="blocco" size={17} titolo="Nel Pass" /></span>}
      {stato === 'aperto' && <span aria-hidden="true" className="shrink-0 text-testo-tenue"><Icona nome="avanti" size={20} /></span>}
    </>
  );

  if (stato === 'arrivo') {
    return (
      <li>
        <div className={cn(base, 'border border-dashed border-linea bg-transparent')}>{contenuto}</div>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        onClick={() => { playTapSound(); onOpen(t); }}
        className={cn(
          base,
          'bg-superficie-2 hover:bg-linea transition-colors duration-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione',
        )}
      >
        {contenuto}
      </button>
    </li>
  );
}

function Dettaglio({ topic, prec, succ, aperto, titoloRef, onList, onGo }: {
  topic: TheoryTopic;
  prec: TheoryTopic | null;
  succ: TheoryTopic | null;
  aperto: (t: TheoryTopic) => boolean;
  titoloRef: React.RefObject<HTMLHeadingElement | null>;
  onList: () => void;
  onGo: (t: TheoryTopic) => void;
}) {
  const h2 = 'flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo';
  const corpo = 'text-[15px] font-medium text-testo leading-[24px]';
  return (
    <Cornice titoloRef={titoloRef} titolo={titoloBreve(topic)} onBack={onList}
      intestazione={<p className="flex items-center gap-2 pt-1"><ChipLivello livello={topic.livello} /><span className="sr-only">Livello {topic.livello}</span></p>}>
      {/* Il testo della scheda è contenuto (esente dal controllo di testo): attorno non c'è nessuna introduzione. */}
      <article data-testo-ok className="mt-5 flex flex-col gap-6">
        <section aria-labelledby="t-regola" className="flex flex-col gap-2.5">
          <h2 id="t-regola" className={h2}><span aria-hidden="true" className="text-azione-scuro"><Icona nome="teoria-regola" size={20} /></span>Regola</h2>
          {topic.regola.map((r, i) => <p key={i} className={corpo}><RichText text={r} /></p>)}
        </section>

        {topic.esempi.length > 0 && (
          <section aria-labelledby="t-esempi">
            <h2 id="t-esempi" className={h2}><span aria-hidden="true" className="text-azione-scuro"><Icona nome="teoria-esempi" size={20} /></span>Esempi</h2>
            <ul className="mt-2.5 flex flex-col gap-3">
              {topic.esempi.map((e, i) => (
                <li key={i} className="border-l-[3px] border-azione pl-3">
                  <p lang="en" className="font-bold text-testo leading-snug"><RichText text={e.en} /></p>
                  <p className="mt-0.5 text-[14px] font-medium text-testo-tenue leading-snug"><RichText text={e.it} /></p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {topic.errori.length > 0 && (
          <section aria-labelledby="t-errori">
            <h2 id="t-errori" className={h2}><span aria-hidden="true" className="text-basso-numero"><Icona nome="stato-risposta-sbagliata" size={20} /></span>Errori</h2>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {topic.errori.map((e, i) => (
                <li key={i} className="rounded-[12px] bg-superficie-2 p-4 flex flex-col gap-2.5">
                  <h3 className="sr-only">Errore {i + 1}</h3>
                  <p className="flex gap-2.5 items-start">
                    <span role="img" aria-label="Sbagliato" className="mt-0.5 inline-flex items-center shrink-0 rounded-full bg-basso-tinta text-basso-testo p-1"><Icona nome="stato-risposta-sbagliata" size={16} /></span>
                    <span lang="en" className="font-semibold text-testo line-through decoration-basso/60 leading-snug break-words min-w-0">{e.sbagliato}</span>
                  </p>
                  <p className="flex gap-2.5 items-start">
                    <span role="img" aria-label="Giusto" className="mt-0.5 inline-flex items-center shrink-0 rounded-full bg-alto-tinta text-alto-testo p-1"><Icona nome="stato-risposta-giusta" size={16} /></span>
                    <span lang="en" className="font-bold text-testo leading-snug break-words min-w-0">{e.giusto}</span>
                  </p>
                  <p className="flex gap-2.5 items-start text-[14px] font-medium text-testo-tenue leading-relaxed">
                    <span role="img" aria-label="Perché" className="mt-0.5 shrink-0 text-medio-numero"><Icona nome="suggerimento" size={18} /></span>
                    <span className="min-w-0"><RichText text={e.perche} /></span>
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* L'avviso del test: l'unico blocco tinto della scheda, ambra (attenzione) */}
        {topic.consiglio && (
          <section aria-label="Per il test" className="rounded-[12px] bg-medio-tinta p-4">
            <p className="flex gap-2.5 items-start text-[14.5px] font-medium text-testo leading-relaxed">
              <span aria-hidden="true" className="mt-0.5 shrink-0 text-medio-testo"><Icona nome="suggerimento" size={20} /></span>
              <span className="min-w-0"><RichText text={topic.consiglio} /></span>
            </p>
          </section>
        )}
      </article>

      <nav aria-label="Altre lezioni" className="mt-6 flex flex-col gap-2">
        {succ && <Vicino t={succ} verso="succ" bloccato={!aperto(succ)} onGo={onGo} />}
        {prec && <Vicino t={prec} verso="prec" bloccato={!aperto(prec)} onGo={onGo} />}
      </nav>
    </Cornice>
  );
}

function Vicino({ t, verso, bloccato, onGo }: { t: TheoryTopic; verso: 'prec' | 'succ'; bloccato: boolean; onGo: (t: TheoryTopic) => void }) {
  const succ = verso === 'succ';
  return (
    <button
      type="button"
      aria-label={`${succ ? 'Successiva' : 'Precedente'}: ${titoloBreve(t)}`}
      onClick={() => { playTapSound(); onGo(t); }}
      className="w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 px-3.5 py-3 text-left transition-colors duration-100 hover:bg-linea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione"
    >
      {!succ && <span aria-hidden="true" className="shrink-0 text-testo-tenue"><Icona nome="indietro" size={20} /></span>}
      <span className="block min-w-0 flex-1 font-bold leading-snug text-testo break-words">{titoloBreve(t)}</span>
      {bloccato && <span className="shrink-0 text-testo-tenue"><Icona nome="blocco" size={17} titolo="Nel Pass" /></span>}
      {succ && !bloccato && <span aria-hidden="true" className="shrink-0 text-azione-scuro"><Icona nome="avanti" size={20} /></span>}
    </button>
  );
}
