// Foglio dal basso che spiega la stima di superare il test. I numeri vengono dal codice che calcola
// (lib/diagnostic.ts, config/offer.ts): se cambiano le soglie, cambia anche il testo.
import { ReactNode, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, ListChecks, Target, Dices, Ban, Layers, Scale, TrendingUp } from 'lucide-react';
import { estimatePassProbability, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { FORMATS, FREE_LIMITS, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';
import { useRiduci } from './home/comune';

interface Props {
  aperto: boolean;
  onChiudi(): void;
  /** 'diagnostico': stima sul solo diagnostico. 'simulazione': stima che include anche le simulazioni. */
  tipo: 'diagnostico' | 'simulazione';
  /** Risposte su cui è calcolata la stima (di default quelle del diagnostico). */
  risposte?: number;
}

const FOCALIZZABILI = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function Voce({ icona, titolo, children }: { icona: ReactNode; titolo: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-azione-tinta text-azione-scuro dark:bg-azione-tinta-scura/60 dark:text-azione-chiaro" aria-hidden>
        {icona}
      </span>
      <div className="min-w-0">
        <h4 className="text-[15px] font-bold leading-snug text-[#0F172A] dark:text-[#F8FAFC]">{titolo}</h4>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{children}</p>
      </div>
    </li>
  );
}

export default function FoglioStima({ aperto, onChiudi, tipo, risposte = DIAGNOSTIC_LENGTH }: Props) {
  const riduci = useRiduci();
  const titoloRef = useRef<HTMLHeadingElement>(null);
  const pannelloRef = useRef<HTMLDivElement>(null);
  const chiudiRef = useRef(onChiudi);
  chiudiRef.current = onChiudi;

  // Focus sul titolo all'apertura e ritorno all'elemento che l'aveva aperto alla chiusura
  useEffect(() => {
    if (!aperto) return;
    const prima = document.activeElement as HTMLElement | null;
    titoloRef.current?.focus();
    return () => { prima?.focus?.(); };
  }, [aperto]);

  if (!aperto) return null;

  const { passMark: sogliaEnte } = FORMATS.ente;
  const soloDiagnostico = tipo === 'diagnostico';
  // Esempio calcolato con la stessa funzione della stima: nessun numero scritto a mano
  const esempio = [7, 8, 9].map(k => ({ k, p: Math.round(estimatePassProbability(k, DIAGNOSTIC_LENGTH) * 100) }));

  const tastiera = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); chiudiRef.current(); return; }
    if (e.key !== 'Tab') return;
    const el = Array.from(pannelloRef.current?.querySelectorAll<HTMLElement>(FOCALIZZABILI) ?? []);
    if (el.length === 0) return;
    const prima = el[0], ultima = el[el.length - 1];
    const attivo = document.activeElement;
    if (e.shiftKey && (attivo === prima || attivo === titoloRef.current)) { e.preventDefault(); ultima.focus(); }
    else if (!e.shiftKey && attivo === ultima) { e.preventDefault(); prima.focus(); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={tastiera}>
      <div className="absolute inset-0 bg-black/55" onClick={onChiudi} aria-hidden />
      <motion.div
        ref={pannelloRef}
        role="dialog" aria-modal="true" aria-labelledby="foglio-stima-titolo"
        initial={riduci ? false : { y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: riduci ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col rounded-t-3xl bg-white shadow-2xl dark:bg-[#1E293B] dark:border-t dark:border-[#334155]"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 shrink-0">
          <h2 id="foglio-stima-titolo" ref={titoloRef} tabIndex={-1} className="text-xl font-bold leading-snug text-[#0F172A] outline-none dark:text-[#F8FAFC]">
            Come viene calcolata la stima
          </h2>
          <button type="button" onClick={onChiudi} aria-label="Chiudi"
            className="-mr-1 shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-[#334155] dark:hover:text-gray-200">
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-2 scrollbar-hide">
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            La percentuale risponde a una sola domanda: se facessi oggi un test da {REAL_TEST_QUESTIONS} domande, quanto è probabile che tu ne azzecchi almeno {REAL_TEST_PASS_MARK}?
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            <Voce icona={<ListChecks size={18} strokeWidth={2.5} />} titolo={`Le tue ${risposte} risposte`}>
              {soloDiagnostico
                ? `Il calcolo parte da quante risposte esatte hai dato sulle ${risposte} del diagnostico. Le domande sono quelle del nucleo gratuito, prese con la stessa proporzione di livelli (A1, A2, B1) del resto del banco, così non sono tutte facili né tutte difficili.`
                : `Il calcolo parte da quante risposte esatte hai dato in tutto: ${risposte} tra il diagnostico e le simulazioni che hai fatto. Gli esercizi di ripasso non contano, perché scelgono le domande più difficili e darebbero una stima troppo severa.`}
            </Voce>
            <Voce icona={<Target size={18} strokeWidth={2.5} />} titolo={`La soglia: ${REAL_TEST_PASS_MARK} su ${REAL_TEST_QUESTIONS}`}>
              Il calcolo usa la soglia del TENG: {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. Il test di recupero di LinguaViva chiede {sogliaEnte} su {FORMATS.ente.questions}: con quella soglia la probabilità è un po' più bassa. Controlla sempre la soglia del test che farai davvero.
            </Voce>
            <Voce icona={<Dices size={18} strokeWidth={2.5} />} titolo="Dal tuo livello a 30 domande">
              Non sappiamo quanto sei bravo davvero: lo deduciamo dalle risposte. Il calcolo considera tutti i livelli di preparazione compatibili con quello che hai risposto e, per ciascuno, quanto è probabile fare almeno {REAL_TEST_PASS_MARK} su {REAL_TEST_QUESTIONS}. La percentuale è la media di tutte queste possibilità.
            </Voce>
            <Voce icona={<Ban size={18} strokeWidth={2.5} />} titolo="Cosa non entra">
              Non conta il tempo che hai impiegato e ogni risposta esatta vale uguale, facile o difficile. Non c'è nessun confronto con altri studenti.
            </Voce>
          </ul>

          <h3 className="mt-6 text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">Perché è solo una stima?</h3>
          <ul className="mt-3 flex flex-col gap-4">
            <Voce icona={<Layers size={18} strokeWidth={2.5} />} titolo={soloDiagnostico ? `${DIAGNOSTIC_LENGTH} domande sono poche` : 'Più risposte, stima più stabile'}>
              {soloDiagnostico
                ? <>Una risposta in più o in meno cambia molto il risultato: con {esempio[0].k} esatte su {DIAGNOSTIC_LENGTH} la stima è {esempio[0].p}%, con {esempio[1].k} è {esempio[1].p}%, con {esempio[2].k} è {esempio[2].p}%. Un test vero ha {REAL_TEST_QUESTIONS} domande: un'altra mattina potresti rispondere diversamente.</>
                : <>Ogni risposta in più rende la stima meno sensibile alla fortuna di un singolo quiz, ma una simulazione di {FORMATS.ente.questions} domande resta un campione: un'altra giornata potrebbe andare diversamente.</>}
            </Voce>
            <Voce icona={<Scale size={18} strokeWidth={2.5} />} titolo="Non è una previsione né una garanzia">
              AddiOFA è un progetto studentesco indipendente: non ha accesso alle domande né ai risultati del test vero e la stima non è collegata a quel test. Il giorno della prova contano anche la concentrazione e il tempo ({FORMATS.ente.minutes} minuti per {FORMATS.ente.questions} domande), che qui non misuriamo.
            </Voce>
            <Voce icona={<TrendingUp size={18} strokeWidth={2.5} />} titolo="Migliora con le simulazioni">
              {soloDiagnostico
                ? <>Ogni simulazione aggiunge {FORMATS.ente.questions} risposte alla stima, che si ricalcola da sola. Nella parte gratuita ne puoi fare {FREE_LIMITS.freeSimulations === 1 ? 'una' : FREE_LIMITS.freeSimulations}; con il Pass sono illimitate.</>
                : <>Ogni nuova simulazione aggiunge {FORMATS.ente.questions} risposte e la stima si ricalcola da sola.</>}
            </Voce>
          </ul>
        </div>

        <div className="px-5 pt-3 pb-5 shrink-0">
          <button type="button" onClick={onChiudi}
            className="w-full rounded-2xl bg-azione py-3.5 text-base font-bold text-white hover:bg-azione-scuro active:scale-[.99] transition-all">
            Ho capito
          </button>
        </div>
      </motion.div>
    </div>
  );
}
