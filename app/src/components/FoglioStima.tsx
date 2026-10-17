// Foglio dal basso che spiega la stima di superare il test. I numeri vengono dal codice che calcola
// (lib/diagnostic.ts, config/offer.ts): se cambiano le soglie, cambia anche il testo.
import { ReactNode, useEffect, useRef } from 'react';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { estimatePassProbability, intervalloStima, formatProbabilita, formatPunteggio, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { EXAM, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';
import { TONI, type Tono } from '../screens/extra/ui';

interface Props {
  aperto: boolean;
  onChiudi(): void;
  /** 'diagnostico': stima sul solo diagnostico. 'simulazione': stima che include anche le simulazioni. */
  tipo: 'diagnostico' | 'simulazione';
  /** Risposte su cui è calcolata la stima (di default quelle del diagnostico). */
  risposte?: number;
}

const FOCALIZZABILI = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Il colore dell'icona dice di che cosa parla la voce: come si calcola = blu, cosa non entra = corallo, i limiti della stima = ambra, come migliorarla = verde.
function Voce({ icona, titolo, tono = 'azione', children }: { icona: ReactNode; titolo: string; tono?: Tono; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONI[tono].tinta} ${TONI[tono].icona}`} aria-hidden>
        {icona}
      </span>
      <div className="min-w-0">
        <h4 className="text-[15px] font-bold leading-snug text-testo">{titolo}</h4>
        <div className="mt-0.5 text-[13.5px] leading-snug text-testo-tenue">{children}</div>
      </div>
    </li>
  );
}

export default function FoglioStima({ aperto, onChiudi, tipo, risposte = DIAGNOSTIC_LENGTH }: Props) {
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

  const soloDiagnostico = tipo === 'diagnostico';
  // Esempio calcolato con la stessa funzione della stima: nessun numero scritto a mano
  const esempio = [7, 8, 9].map(k => ({ k, p: formatProbabilita(estimatePassProbability(k, DIAGNOSTIC_LENGTH)) }));
  const largo = intervalloStima(esempio[1].k, DIAGNOSTIC_LENGTH);

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
      <div className="absolute inset-0 bg-black/60" onClick={onChiudi} aria-hidden />
      <div
        ref={pannelloRef}
        role="dialog" aria-modal="true" aria-labelledby="foglio-stima-titolo"
        className="relative flex max-h-[88vh] w-full max-w-xl flex-col rounded-t-3xl bg-superficie-2 border border-b-0 border-linea shadow-2xl dark:shadow-none"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 shrink-0">
          <h2 id="foglio-stima-titolo" ref={titoloRef} tabIndex={-1} className="text-xl font-bold leading-snug text-testo outline-none">
            Come viene calcolata la stima
          </h2>
          <button type="button" onClick={onChiudi} aria-label="Chiudi"
            className="-mr-1 shrink-0 rounded-full p-1.5 text-testo-tenue hover:bg-linea hover:text-testo">
            <Icona nome="chiudi" size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-2 scrollbar-hide">
          {/* Come nel concept 25: la domanda in un riquadro tinto, poi una riga per voce (icona, titolo, una frase breve). */}
          <div className="flex items-start gap-3 rounded-2xl bg-azione-tinta p-3.5">
            <Icona nome="soglia" size={22} className="mt-0.5 shrink-0 text-azione-testo" />
            <p className="text-[14.5px] leading-snug font-semibold text-testo">
              Se facessi oggi un test da {REAL_TEST_QUESTIONS} domande, quanto è probabile azzeccarne almeno {REAL_TEST_PASS_MARK}?
            </p>
          </div>

          <ul className="mt-4 flex flex-col gap-3.5">
            <Voce icona={<Icona nome="risposte" size={20} />} titolo={`Le tue ${risposte} risposte`}>
              {soloDiagnostico
                ? `Le esatte sul diagnostico. Le domande hanno i livelli A1, A2, B1 in proporzione al banco.`
                : `Diagnostico e simulazioni insieme. Contano le ultime 3 simulazioni; dopo due, il diagnostico esce. Le vuote valgono zero.`}
            </Voce>
            <Voce icona={<Icona nome="soglia" size={20} />} titolo={`Soglia ${REAL_TEST_PASS_MARK} su ${REAL_TEST_QUESTIONS}`}>
              La soglia del test di recupero di LinguaViva. Controlla sempre quella del test che farai.
            </Voce>
            <Voce icona={<Icona nome="stima-modello" size={20} />} titolo={`Dal livello alle ${REAL_TEST_QUESTIONS} domande`}>
              Media su tutti i livelli compatibili con le tue risposte, ciascuno con la sua probabilità di arrivare a {REAL_TEST_PASS_MARK}.
            </Voce>
            <Voce icona={<Icona nome="stima-intervallo" size={20} />} titolo="Punteggio probabile">
              Intervallo all'80 %, su {REAL_TEST_QUESTIONS} domande: con poche risposte è largo (con {esempio[1].k} su {DIAGNOSTIC_LENGTH}: {formatPunteggio(largo)}) e si stringe man mano. Mai una certezza.
            </Voce>
            <Voce icona={<Icona nome="stima-escluso" size={20} />} titolo="Cosa non entra" tono="basso">
              Il tempo impiegato, gli esercizi di ripasso, il confronto con altri. Ogni esatta vale uguale.
            </Voce>
          </ul>

          <h3 className="mt-6 text-lg font-bold text-testo">Solo una stima</h3>
          <ul className="mt-3 flex flex-col gap-3.5">
            <Voce icona={<Icona nome="stima-campione" size={20} />} titolo={soloDiagnostico ? `${DIAGNOSTIC_LENGTH} domande sono poche` : 'Più risposte, più stabile'} tono="medio">
              {soloDiagnostico
                ? <>Una risposta in più cambia molto il risultato.
                    <span className="mt-2 grid grid-cols-3 gap-2">
                      {esempio.map(e => (
                        <span key={e.k} className="flex flex-col items-center rounded-xl bg-medio-tinta px-1 py-2 text-testo">
                          <span className="text-[12.5px] font-bold tabular-nums text-testo-tenue">{e.k}/{DIAGNOSTIC_LENGTH}</span>
                          <span className="text-[17px] leading-[22px] font-extrabold tabular-nums">{e.p}</span>
                        </span>
                      ))}
                    </span></>
                : <>Un quiz di {EXAM.questions} domande resta un campione: un'altra giornata può andare diversamente.</>}
            </Voce>
            <Voce icona={<Icona nome="stima-garanzia" size={20} />} titolo="Non è una previsione" tono="medio">
              Progetto studentesco indipendente: non conosce domande né risultati del test vero. Il giorno della prova contano anche concentrazione e tempo ({EXAM.minutes} minuti per {EXAM.questions} domande).
            </Voce>
            <Voce icona={<Icona nome="stima-miglioramento" size={20} />} titolo="Migliora con le simulazioni" tono="alto">
              Ogni simulazione aggiunge {EXAM.questions} risposte e la stima si ricalcola da sola. Puoi farne quante vuoi.
            </Voce>
          </ul>
        </div>

        <div className="px-5 pt-3 pb-5 shrink-0">
          <button type="button" onClick={onChiudi}
            className="w-full rounded-2xl bg-azione py-3.5 text-base font-bold text-azione-su hover:bg-azione-scuro transition-colors duration-100">
            Ho capito
          </button>
        </div>
      </div>
    </div>
  );
}
