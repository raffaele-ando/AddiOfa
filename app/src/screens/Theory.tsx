import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Lightbulb, Lock, X } from 'lucide-react';
import { theoryTopics, type TheoryTopic } from '../data/theory';
import { FREE_LIMITS } from '../config/offer';
import { useAccess } from '../access/context';
import { playTapSound } from '../lib/audio';
import { cn } from '../lib/utils';
import { Screen, TopBar, RichText } from '../components/ui';

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
  const primaVolta = useRef(true);
  useEffect(() => {
    if (primaVolta.current) { primaVolta.current = false; return; }
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
    <Screen>
      <TopBar onBack={onBack} />
      <header className="shrink-0">
        <h1 ref={titoloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] outline-none">Teoria</h1>
        <p className="mt-1 max-w-[65ch] text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
          {theoryTopics.length} argomenti in tre livelli. Ogni scheda ha la regola, qualche esempio e gli errori tipici di chi parla italiano.
        </p>
        <p className="mt-2 max-w-[65ch] text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
          {pass
            ? 'Hai il Pass: tutte le schede pronte sono aperte.'
            : `Una scheda è gratis, le altre sono nel Pass.`}
        </p>
      </header>

      {nPronti === 0 && (
        <p role="status" className="shrink-0 max-w-[65ch] rounded-2xl border border-gray-200 dark:border-[#334155] bg-gray-50 dark:bg-[#0F172A] px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
          Le schede sono ancora in preparazione e per ora nessuna è pronta. Quando lo saranno le trovi qui, nello stesso ordine.
        </p>
      )}

      <div className="flex flex-col gap-6 pb-4">
        {LIVELLI.map(l => {
          const lista = ordinati.filter(t => t.livello === l.id);
          if (lista.length === 0) return null;
          const idTitolo = `liv-${l.id}`;
          return (
            <section key={l.id} aria-labelledby={idTitolo}>
              <h2 id={idTitolo} className="flex items-baseline gap-2 text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                {l.nome}
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{l.sotto}</span>
              </h2>
              <ul className="mt-2 flex flex-col gap-2">
                {lista.map(t => <Riga key={t.id} t={t} pass={pass} gratis={gratisIds.has(t.id)} onOpen={apri} />)}
              </ul>
            </section>
          );
        })}
      </div>
    </Screen>
  );
}

function Riga({ t, pass, gratis, onOpen }: { t: TheoryTopic; pass: boolean; gratis: boolean; onOpen: (t: TheoryTopic) => void }) {
  const base = 'w-full text-left rounded-2xl border px-4 py-3 min-h-[56px] flex items-center gap-3';
  const stato = !t.pronta ? 'arrivo' : pass || gratis ? 'aperto' : 'pass';

  const etichetta =
    stato === 'arrivo' ? (
      <span className={cn(BADGE, 'gap-1 bg-gray-100 text-gray-600 dark:bg-[#334155] dark:text-gray-300')}><Clock size={12} aria-hidden /> In arrivo</span>
    ) : stato === 'pass' ? (
      <span className={cn(BADGE, 'gap-1 bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/50 dark:text-[#FCA5A5]')}><Lock size={12} aria-hidden /> Nel Pass</span>
    ) : (
      <span className={cn(BADGE, 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300')}>{gratis && !pass ? 'Gratis' : 'Aperta'}</span>
    );

  const contenuto = (
    <>
      <span className="min-w-0 flex-1">
        <span className={cn('block font-bold leading-snug break-words', stato === 'arrivo' ? 'text-gray-500 dark:text-gray-400' : 'text-[#0F172A] dark:text-[#F8FAFC]')}>{t.titolo}</span>
        <span className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{t.livello}</span>
          {etichetta}
        </span>
      </span>
      {stato !== 'arrivo' && <ChevronRight size={20} className="shrink-0 text-gray-400" aria-hidden />}
    </>
  );

  if (stato === 'arrivo') {
    return (
      <li>
        <div className={cn(base, 'border-dashed border-gray-200 dark:border-[#334155] bg-transparent')}>{contenuto}</div>
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
          'border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B] transition-colors motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF4444]',
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
  const h2 = 'text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]';
  const corpo = 'max-w-[65ch] text-base font-medium text-gray-800 dark:text-gray-200 leading-relaxed';
  return (
    <Screen>
      <TopBar onBack={onList} />
      <article className="flex flex-col gap-6 pb-2">
        <header>
          <p className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            <span className={cn(BADGE, 'bg-[#EDE9FE] text-[#6D28D9] dark:bg-[#4C1D95]/50 dark:text-[#C4B5FD]')}>{topic.livello}</span>
            Teoria
          </p>
          <h1 ref={titoloRef} tabIndex={-1} className="mt-2 text-2xl sm:text-3xl font-bold leading-tight text-[#0F172A] dark:text-[#F8FAFC] outline-none break-words">
            {topic.titolo}
          </h1>
        </header>

        <section aria-labelledby="t-regola" className="flex flex-col gap-3">
          <h2 id="t-regola" className={h2}>La regola</h2>
          {topic.regola.map((r, i) => <p key={i} className={corpo}><RichText text={r} /></p>)}
        </section>

        {topic.esempi.length > 0 && (
          <section aria-labelledby="t-esempi">
            <h2 id="t-esempi" className={h2}>Esempi</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {topic.esempi.map((e, i) => (
                <li key={i} className="max-w-[65ch] border-l-4 border-[#8B5CF6] pl-3">
                  <p lang="en" className="font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug"><RichText text={e.en} /></p>
                  <p className="mt-0.5 text-sm font-medium text-gray-600 dark:text-gray-400 leading-snug"><RichText text={e.it} /></p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {topic.errori.length > 0 && (
          <section aria-labelledby="t-errori">
            <h2 id="t-errori" className={h2}>Errori tipici</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {topic.errori.map((e, i) => (
                <li key={i} className="max-w-[65ch] rounded-2xl border border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] p-4 flex flex-col gap-3">
                  <h3 className="sr-only">Errore {i + 1}</h3>
                  <p className="flex gap-2.5 items-start">
                    <span className="mt-0.5 inline-flex items-center gap-1 shrink-0 rounded-full bg-[#FEE2E2] text-[#B91C1C] dark:bg-[#7F1D1D]/50 dark:text-[#FCA5A5] px-2 py-0.5 text-[11px] font-bold">
                      <X size={12} strokeWidth={3.5} aria-hidden /> Sbagliato
                    </span>
                    <span lang="en" className="font-semibold text-gray-700 dark:text-gray-300 line-through decoration-[#EF4444]/60 leading-snug break-words min-w-0">{e.sbagliato}</span>
                  </p>
                  <p className="flex gap-2.5 items-start">
                    <span className="mt-0.5 inline-flex items-center gap-1 shrink-0 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-bold">
                      <Check size={12} strokeWidth={3.5} aria-hidden /> Giusto
                    </span>
                    <span lang="en" className="font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-snug break-words min-w-0">{e.giusto}</span>
                  </p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    <span className="font-bold text-gray-700 dark:text-gray-300">Perché: </span><RichText text={e.perche} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {topic.consiglio && (
          <section aria-labelledby="t-consiglio" className="max-w-[65ch] rounded-2xl bg-[#EFF6FF] dark:bg-[#1E3A8A]/25 border border-[#BFDBFE] dark:border-[#1E40AF]/60 p-4">
            <h2 id="t-consiglio" className="flex items-center gap-2 text-base font-bold text-[#1D4ED8] dark:text-[#93C5FD]">
              <Lightbulb size={18} aria-hidden /> Per il test
            </h2>
            <p className="mt-1.5 font-medium text-[#0F172A] dark:text-gray-200 leading-relaxed"><RichText text={topic.consiglio} /></p>
          </section>
        )}

        <nav aria-label="Altri argomenti" className="flex flex-col gap-2 pt-2">
          {succ && <Vicino t={succ} verso="succ" bloccato={!aperto(succ)} onGo={onGo} />}
          {prec && <Vicino t={prec} verso="prec" bloccato={!aperto(prec)} onGo={onGo} />}
          <button
            type="button"
            onClick={() => { playTapSound(); onList(); }}
            className="w-full py-3 px-6 font-bold text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline-offset-4 hover:underline"
          >
            Tutti gli argomenti
          </button>
        </nav>
      </article>
    </Screen>
  );
}

function Vicino({ t, verso, bloccato, onGo }: { t: TheoryTopic; verso: 'prec' | 'succ'; bloccato: boolean; onGo: (t: TheoryTopic) => void }) {
  const succ = verso === 'succ';
  return (
    <button
      type="button"
      onClick={() => { playTapSound(); onGo(t); }}
      className={cn(
        'w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors motion-reduce:transition-none',
        succ
          ? 'border-[#EF4444] bg-[#FEE2E2]/50 dark:bg-[#7F1D1D]/30 hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D]/50'
          : 'border-gray-200 dark:border-[#334155] bg-white dark:bg-[#0F172A] hover:bg-gray-50 dark:hover:bg-[#1E293B]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#EF4444]',
      )}
    >
      {!succ && <ChevronLeft size={20} className="shrink-0 text-gray-400" aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold text-gray-600 dark:text-gray-400">{succ ? 'Argomento successivo' : 'Argomento precedente'}</span>
        <span className="block font-bold leading-snug text-[#0F172A] dark:text-[#F8FAFC] break-words">{t.titolo}</span>
        {bloccato && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#B91C1C] dark:text-[#FCA5A5]"><Lock size={12} aria-hidden /> Nel Pass</span>
        )}
      </span>
      {succ && <ChevronRight size={20} className="shrink-0 text-gray-400" aria-hidden />}
    </button>
  );
}
