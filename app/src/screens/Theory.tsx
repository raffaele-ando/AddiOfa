import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Lightbulb, Lock, X } from 'lucide-react';
import type { ReactNode, RefObject } from 'react';
import { theoryTopics, type TheoryTopic } from '../data/theory';
import { FREE_LIMITS } from '../config/offer';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { RichText } from '../components/ui';
import { FONT } from '../brand/tokens';
import { ChipLivello } from './extra/studio/comune';

interface TheoryProps {
  onBack(): void;
  onOpenPaywall(): void;
  initialTopicId?: string;
}

type Livello = TheoryTopic['livello'];
const LIVELLI: { id: Livello; nome: string; sotto: string }[] = [
  { id: 'A1', nome: 'Livello A1', sotto: 'Le basi' },
  { id: 'A2', nome: 'Livello A2', sotto: 'Il passato e il confronto' },
  { id: 'B1', nome: 'Livello B1', sotto: 'Le strutture più avanzate del test' },
];

// Ordine di studio: per livello, poi nell'ordine del file (sort stabile)
const ordinati: TheoryTopic[] = [...theoryTopics].sort(
  (a, b) => LIVELLI.findIndex(l => l.id === a.livello) - LIVELLI.findIndex(l => l.id === b.livello),
);
const pronti = ordinati.filter(t => t.pronta);
// Gratis: i primi N argomenti pronti nell'ordine di studio (quindi il primo di A1)
const gratisIds = new Set(pronti.slice(0, FREE_LIMITS.freeTheoryTopics).map(t => t.id));

const BADGE = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide';

/** Pagina di teoria: stessa cornice delle schermate extra (freccia a sinistra del titolo, colonna di 440 px), ma con il riferimento al titolo per il focus. */
function Cornice({ titolo, sotto, titoloRef, onBack, children, intestazione }: {
  titolo?: string; sotto?: ReactNode; titoloRef: RefObject<HTMLHeadingElement | null>; onBack: () => void; children: ReactNode; intestazione?: ReactNode;
}) {
  return (
    <div className="h-full w-full bg-superficie text-testo sm:rounded-[28px] sm:border sm:border-linea overflow-hidden flex flex-col" style={{ fontFamily: FONT }}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="mx-auto w-full max-w-[440px] px-6 pt-[max(14px,env(safe-area-inset-top))] pb-8">
          <header className="flex items-start gap-1">
            <button type="button" onClick={() => { playTapSound(); onBack(); }} aria-label="Indietro"
              className="brand-premibile -ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-full text-testo-tenue hover:text-testo">
              <ChevronLeft size={28} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <div className="min-w-0 flex-1">
              {intestazione}
              <h1 ref={titoloRef} tabIndex={-1} className="text-[26px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo outline-none break-words pt-[3px]">{titolo}</h1>
              {sotto && <p className="mt-0.5 text-[14px] leading-[20px] text-testo-tenue">{sotto}</p>}
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
        onList={() => setTopicId(null)}
        onGo={apri}
      />
    );
  }

  const nPronti = pronti.length;
  return (
    <Cornice titolo="Teoria" titoloRef={titoloRef} onBack={onBack}
      sotto={`${theoryTopics.length} argomenti in tre livelli, con la regola, gli esempi e gli errori tipici di chi parla italiano.${pass ? '' : ' Una scheda è gratis, le altre sono nel Pass.'}`}>
      {nPronti === 0 && (
        <p role="status" className="mt-4 rounded-[12px] bg-superficie-2 px-4 py-3 text-[14px] text-testo leading-relaxed">
          Le schede sono ancora in preparazione e per ora nessuna è pronta. Quando lo saranno le trovi qui, nello stesso ordine.
        </p>
      )}

      {LIVELLI.map(l => {
        const lista = ordinati.filter(t => t.livello === l.id);
        if (lista.length === 0) return null;
        const idTitolo = `liv-${l.id}`;
        return (
          <section key={l.id} aria-labelledby={idTitolo} className="mt-6 flex flex-col gap-2.5">
            <h2 id={idTitolo} className="inline-flex items-center gap-2 text-[15.5px] leading-[20px] font-bold text-testo">
              <ChipLivello livello={l.id} /><span className="sr-only">{l.nome}: </span>{l.sotto}
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

  // L'etichetta compare solo dove dice qualcosa: «Gratis» sull'unica scheda aperta senza Pass, «In arrivo» sulle schede non pronte. Con il Pass tutte sono aperte: niente etichette uguali su ogni riga.
  const etichetta =
    stato === 'arrivo' ? (
      <span className={cn(BADGE, 'gap-1 bg-superficie-2 text-testo-tenue')}><Clock size={12} aria-hidden /> In arrivo</span>
    ) : stato === 'aperto' && gratis && !pass ? (
      <span className={cn(BADGE, 'bg-alto-tinta text-alto-testo')}>Gratis</span>
    ) : null;

  const contenuto = (
    <>
      <span className="min-w-0 flex-1">
        <span className={cn('block font-bold leading-snug break-words', stato === 'arrivo' ? 'text-testo-tenue' : 'text-testo')}>{t.titolo}</span>
        {etichetta && <span className="mt-1 flex flex-wrap items-center gap-2">{etichetta}</span>}
      </span>
      {stato === 'pass' && <Lock size={17} className="shrink-0 text-testo-tenue" aria-label="Nel Pass" />}
      {stato === 'aperto' && <ChevronRight size={20} className="shrink-0 text-testo-tenue" aria-hidden />}
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
  const h2 = 'text-[15.5px] leading-[20px] font-bold text-testo';
  const corpo = 'text-[15px] font-medium text-testo leading-[24px]';
  return (
    <Cornice titoloRef={titoloRef} titolo={topic.titolo} onBack={onList}
      intestazione={<p className="flex items-center gap-2 text-[12.5px] font-semibold text-testo-tenue pt-1"><ChipLivello livello={topic.livello} />Teoria</p>}>
      <article className="mt-5 flex flex-col gap-6">
        <section aria-labelledby="t-regola" className="flex flex-col gap-2.5">
          <h2 id="t-regola" className={h2}>La regola</h2>
          {topic.regola.map((r, i) => <p key={i} className={corpo}><RichText text={r} /></p>)}
        </section>

        {topic.esempi.length > 0 && (
          <section aria-labelledby="t-esempi">
            <h2 id="t-esempi" className={h2}>Esempi</h2>
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
            <h2 id="t-errori" className={h2}>Errori tipici</h2>
            <ul className="mt-2.5 flex flex-col gap-2.5">
              {topic.errori.map((e, i) => (
                <li key={i} className="rounded-[12px] bg-superficie-2 p-4 flex flex-col gap-2.5">
                  <h3 className="sr-only">Errore {i + 1}</h3>
                  <p className="flex gap-2.5 items-start">
                    <span className="mt-0.5 inline-flex items-center gap-1 shrink-0 rounded-full bg-basso-tinta text-basso-testo px-2 py-0.5 text-[11px] font-bold">
                      <X size={12} strokeWidth={3.5} aria-hidden /> Sbagliato
                    </span>
                    <span lang="en" className="font-semibold text-testo line-through decoration-basso/60 leading-snug break-words min-w-0">{e.sbagliato}</span>
                  </p>
                  <p className="flex gap-2.5 items-start">
                    <span className="mt-0.5 inline-flex items-center gap-1 shrink-0 rounded-full bg-alto-tinta text-alto-testo px-2 py-0.5 text-[11px] font-bold">
                      <Check size={12} strokeWidth={3.5} aria-hidden /> Giusto
                    </span>
                    <span lang="en" className="font-bold text-testo leading-snug break-words min-w-0">{e.giusto}</span>
                  </p>
                  <p className="text-[14px] font-medium text-testo-tenue leading-relaxed">
                    <span className="font-bold text-testo">Perché: </span><RichText text={e.perche} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* L'avviso del test: l'unico blocco tinto della scheda, ambra (attenzione) */}
        {topic.consiglio && (
          <section aria-labelledby="t-consiglio" className="rounded-[12px] bg-medio-tinta p-4">
            <h2 id="t-consiglio" className="flex items-center gap-2 text-[15px] font-bold text-medio-testo">
              <Lightbulb size={18} aria-hidden /> Per il test
            </h2>
            <p className="mt-1.5 text-[14.5px] font-medium text-testo leading-relaxed"><RichText text={topic.consiglio} /></p>
          </section>
        )}

        <nav aria-label="Altri argomenti" className="flex flex-col gap-2 pt-1">
          {succ && <Vicino t={succ} verso="succ" bloccato={!aperto(succ)} onGo={onGo} />}
          {prec && <Vicino t={prec} verso="prec" bloccato={!aperto(prec)} onGo={onGo} />}
          <button
            type="button"
            onClick={() => { playTapSound(); onList(); }}
            className="w-full min-h-[44px] px-6 font-semibold text-[14px] text-azione underline underline-offset-4"
          >
            Tutti gli argomenti
          </button>
        </nav>
      </article>
    </Cornice>
  );
}

function Vicino({ t, verso, bloccato, onGo }: { t: TheoryTopic; verso: 'prec' | 'succ'; bloccato: boolean; onGo: (t: TheoryTopic) => void }) {
  const succ = verso === 'succ';
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onGo(t); }}
      className="w-full flex items-center gap-3 rounded-[12px] bg-superficie-2 px-3.5 py-3 text-left transition-colors duration-100 hover:bg-linea focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azione"
    >
      {!succ && <ChevronLeft size={20} className="shrink-0 text-testo-tenue" aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className={cn('block text-xs font-bold', succ ? 'text-azione-scuro' : 'text-testo-tenue')}>{succ ? 'Argomento successivo' : 'Argomento precedente'}</span>
        <span className="block font-bold leading-snug text-testo break-words">{t.titolo}</span>
      </span>
      {bloccato && <Lock size={17} className="shrink-0 text-testo-tenue" aria-label="Nel Pass" />}
      {succ && !bloccato && <ChevronRight size={20} className="shrink-0 text-azione-scuro" aria-hidden />}
    </button>
  );
}
