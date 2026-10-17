import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { theoryTopics, type TheoryTopic } from '../data/theory';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { RichText } from '../components/ui';
import { FONT } from '../brand/tokens';
import { Icona } from '../brand/icone/Icona';
import { ChipLivello, Arte, TesseraArte, StatoVuoto } from './extra/studio/comune';
import { famigliaDi } from '../lib/studio/famiglie';
import { titoloBreve } from '../lib/studio/percorso';

interface TheoryProps {
  onBack(): void;
  initialTopicId?: string;
}

type Livello = TheoryTopic['livello'];
const LIVELLI: { id: Livello }[] = [{ id: 'A1' }, { id: 'A2' }, { id: 'B1' }];

// Ordine di studio: per livello, poi nell'ordine del file (sort stabile). Si mostrano solo gli argomenti pronti.
const ordinati: TheoryTopic[] = theoryTopics.filter(t => t.pronta).sort(
  (a, b) => LIVELLI.findIndex(l => l.id === a.livello) - LIVELLI.findIndex(l => l.id === b.livello),
);
const pronti = ordinati;

/** Pagina di teoria: stessa cornice delle schermate extra (freccia a sinistra del titolo, colonna di 440 px), ma con il riferimento al titolo per il focus. */
function Cornice({ titolo, titoloRef, onBack, children, intestazione, arte }: {
  titolo?: string; titoloRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; children: ReactNode; intestazione?: ReactNode; arte?: ReactNode;
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
            {arte && <div className="shrink-0 pt-1">{arte}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Theory({ onBack, initialTopicId }: TheoryProps) {
  const [topicId, setTopicId] = useState<string | null>(() => pronti.find(x => x.id === initialTopicId)?.id ?? null);
  const topic = topicId ? pronti.find(t => t.id === topicId) ?? null : null;

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

  const apri = (t: TheoryTopic) => setTopicId(t.id);

  if (topic) {
    const i = pronti.findIndex(t => t.id === topic.id);
    return (
      <Dettaglio
        topic={topic}
        prec={i > 0 ? pronti[i - 1] : null}
        succ={i >= 0 && i < pronti.length - 1 ? pronti[i + 1] : null}
        titoloRef={titoloRef}
        onList={daLezione ? onBack : () => setTopicId(null)}
        onGo={apri}
      />
    );
  }

  const nPronti = pronti.length;
  return (
    <Cornice titolo="Teoria" titoloRef={titoloRef} onBack={onBack}
      arte={<Arte nome="suggerimenti-consigli" kit="kit-luminoso" lato={132} className="-mt-3 -mb-3" />}>
      {nPronti === 0 && (
        <div className="mt-4"><StatoVuoto illustrazione={{ nome: 'vuoto' }} titolo="Nessuna lezione" /></div>
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
              {lista.map(t => <Riga key={t.id} t={t} onOpen={apri} />)}
            </ul>
          </section>
        );
      })}
    </Cornice>
  );
}

function Riga({ t, onOpen }: { t: TheoryTopic; onOpen: (t: TheoryTopic) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => { playTapSound(); onOpen(t); }}
        className={cn(
          'w-full text-left rounded-[12px] px-3 py-2.5 min-h-[56px] flex items-center gap-3',
          'bg-superficie-2 hover:bg-linea transition-colors duration-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione',
        )}
      >
        <TesseraArte nome={famigliaDi(t.id).illustrazione} lato={44} />
        <span className="min-w-0 flex-1">
          <span className="block font-bold leading-snug break-words text-testo">{titoloBreve(t)}</span>
        </span>
        <span aria-hidden="true" className="shrink-0 text-testo-tenue"><Icona nome="avanti" size={20} /></span>
      </button>
    </li>
  );
}

function Dettaglio({ topic, prec, succ, titoloRef, onList, onGo }: {
  topic: TheoryTopic;
  prec: TheoryTopic | null;
  succ: TheoryTopic | null;
  titoloRef: React.RefObject<HTMLHeadingElement | null>;
  onList: () => void;
  onGo: (t: TheoryTopic) => void;
}) {
  const h2 = 'flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo';
  const corpo = 'text-[15px] font-medium text-testo leading-[24px]';
  return (
    <Cornice titoloRef={titoloRef} titolo={titoloBreve(topic)} onBack={onList}
      arte={<Arte nome={famigliaDi(topic.id).illustrazione} lato={76} />}
      intestazione={<p className="flex items-center gap-2 pt-1"><ChipLivello livello={topic.livello} /><span className="sr-only">Livello {topic.livello}</span></p>}>
      {/* Il testo della scheda è contenuto (esente dal controllo di testo): attorno non c'è nessuna introduzione. */}
      <article data-testo-ok className="mt-5 flex flex-col gap-6">
        <section aria-labelledby="t-regola" className="flex flex-col gap-2.5">
          <h2 id="t-regola" className={h2}><span aria-hidden="true" className="text-azione-testo"><Icona nome="teoria-regola" size={20} /></span>Regola</h2>
          {topic.regola.map((r, i) => <p key={i} className={corpo}><RichText text={r} /></p>)}
        </section>

        {topic.esempi.length > 0 && (
          <section aria-labelledby="t-esempi">
            <h2 id="t-esempi" className={h2}><span aria-hidden="true" className="text-azione-testo"><Icona nome="teoria-esempi" size={20} /></span>Esempi</h2>
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
            <h2 id="t-errori" className={h2}><span aria-hidden="true" className="text-errore"><Icona nome="stato-risposta-sbagliata" size={20} /></span>Errori</h2>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {topic.errori.map((e, i) => (
                <li key={i} className="rounded-[12px] bg-superficie-2 p-4 flex flex-col gap-2.5">
                  <h3 className="sr-only">Errore {i + 1}</h3>
                  <p className="flex gap-2.5 items-start">
                    <span role="img" aria-label="Sbagliato" className="mt-0.5 inline-flex items-center shrink-0 rounded-full bg-errore-tinta text-errore-testo p-1"><Icona nome="stato-risposta-sbagliata" size={16} /></span>
                    <span lang="en" className="font-semibold text-testo line-through decoration-errore/60 leading-snug break-words min-w-0">{e.sbagliato}</span>
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
        {succ && <Vicino t={succ} verso="succ" onGo={onGo} />}
        {prec && <Vicino t={prec} verso="prec" onGo={onGo} />}
      </nav>
    </Cornice>
  );
}

function Vicino({ t, verso, onGo }: { t: TheoryTopic; verso: 'prec' | 'succ'; onGo: (t: TheoryTopic) => void }) {
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
      {succ && <span aria-hidden="true" className="shrink-0 text-azione-testo"><Icona nome="avanti" size={20} /></span>}
    </button>
  );
}
