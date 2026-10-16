// Foglio dal basso che spiega la stima di superare il test. I numeri vengono dal codice che calcola
// (lib/diagnostic.ts, config/offer.ts): se cambiano le soglie, cambia anche il testo.
import { ReactNode, useEffect, useRef } from 'react';
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { estimatePassProbability, intervalloStima, formatProbabilita, formatPunteggio, DIAGNOSTIC_LENGTH } from '../lib/diagnostic';
import { FORMATS, FREE_LIMITS, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS } from '../config/offer';
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
        <p className="mt-0.5 text-sm leading-relaxed text-testo-tenue">{children}</p>
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
          <p className="text-sm leading-relaxed text-testo-tenue">
            La percentuale risponde a una sola domanda: se facessi oggi un test da {REAL_TEST_QUESTIONS} domande, quanto è probabile che tu ne azzecchi almeno {REAL_TEST_PASS_MARK}?
          </p>

          <ul className="mt-4 flex flex-col gap-4">
            <Voce icona={<Icona nome="risposte" size={20} />} titolo={`Le tue ${risposte} risposte`}>
              {soloDiagnostico
                ? `Il calcolo parte da quante risposte esatte hai dato sulle ${risposte} del diagnostico. Le domande sono quelle del nucleo gratuito, prese con la stessa proporzione di livelli (A1, A2, B1) del resto del banco, così non sono tutte facili né tutte difficili.`
                : `Il calcolo parte da quante risposte esatte hai dato in tutto: ${risposte} tra il diagnostico e le simulazioni che hai fatto. Contano le ultime 3 simulazioni, così chi migliora non resta legato ai risultati vecchi, e dopo due simulazioni le 10 domande del diagnostico escono dal calcolo. Le domande lasciate senza risposta valgono come errori, perché al test vero valgono zero. Gli esercizi di ripasso non contano, perché scelgono le domande più difficili e darebbero una stima troppo severa.`}
            </Voce>
            <Voce icona={<Icona nome="soglia" size={20} />} titolo={`La soglia: ${REAL_TEST_PASS_MARK} su ${REAL_TEST_QUESTIONS}`}>
              Il calcolo usa la soglia del test di recupero di LinguaViva: {REAL_TEST_PASS_MARK} risposte esatte su {REAL_TEST_QUESTIONS}. Controlla sempre la soglia del test che farai davvero.
            </Voce>
            <Voce icona={<Icona nome="stima-modello" size={20} />} titolo="Dal tuo livello a 30 domande">
              Non sappiamo quanto sei bravo davvero: lo deduciamo dalle risposte. Il calcolo considera tutti i livelli di preparazione compatibili con quello che hai risposto e, per ciascuno, quanto è probabile fare almeno {REAL_TEST_PASS_MARK} su {REAL_TEST_QUESTIONS}. La percentuale è la media di tutte queste possibilità.
            </Voce>
            <Voce icona={<Icona nome="stima-intervallo" size={20} />} titolo="Il punteggio probabile">
              Sotto la percentuale, finché le risposte sono poche, c'è una riga come «punteggio probabile: {formatPunteggio(largo)}». È l'intervallo in cui cade il tuo livello vero con probabilità 80 %, riportato a {REAL_TEST_QUESTIONS} domande. Con {esempio[1].k} esatte su {DIAGNOSTIC_LENGTH} è largo: va da sotto a sopra la soglia di {REAL_TEST_PASS_MARK}, e dice onestamente che con così poche risposte la percentuale da sola non basta. Più risposte dai, più si stringe. Se la stima è molto bassa o molto alta, la percentuale si scrive «&lt;1 %» o «&gt;99 %»: non è mai una certezza.
            </Voce>
            <Voce icona={<Icona nome="stima-escluso" size={20} />} titolo="Cosa non entra" tono="basso">
              Non conta il tempo che hai impiegato e ogni risposta esatta vale uguale, facile o difficile. Non c'è nessun confronto con altri studenti.
            </Voce>
          </ul>

          <h3 className="mt-6 text-lg font-bold text-testo">Perché è solo una stima?</h3>
          <ul className="mt-3 flex flex-col gap-4">
            <Voce icona={<Icona nome="stima-campione" size={20} />} titolo={soloDiagnostico ? `${DIAGNOSTIC_LENGTH} domande sono poche` : 'Più risposte, stima più stabile'} tono="medio">
              {soloDiagnostico
                ? <>Una risposta in più o in meno cambia molto il risultato: con {esempio[0].k} esatte su {DIAGNOSTIC_LENGTH} la stima è {esempio[0].p}, con {esempio[1].k} è {esempio[1].p}, con {esempio[2].k} è {esempio[2].p}. Un test vero ha {REAL_TEST_QUESTIONS} domande: un'altra mattina potresti rispondere diversamente.</>
                : <>Ogni risposta in più rende la stima meno sensibile alla fortuna di un singolo quiz, ma una simulazione di {FORMATS.ente.questions} domande resta un campione: un'altra giornata potrebbe andare diversamente.</>}
            </Voce>
            <Voce icona={<Icona nome="stima-garanzia" size={20} />} titolo="Non è una previsione né una garanzia" tono="medio">
              AddiOFA è un progetto studentesco indipendente: non ha accesso alle domande né ai risultati del test vero e la stima non è collegata a quel test. Il giorno della prova contano anche la concentrazione e il tempo ({FORMATS.ente.minutes} minuti per {FORMATS.ente.questions} domande), che qui non misuriamo.
            </Voce>
            <Voce icona={<Icona nome="stima-miglioramento" size={20} />} titolo="Migliora con le simulazioni" tono="alto">
              {soloDiagnostico
                ? <>Ogni simulazione aggiunge {FORMATS.ente.questions} risposte alla stima, che si ricalcola da sola. Nella parte gratuita ne puoi fare {FREE_LIMITS.freeSimulations === 1 ? 'una' : FREE_LIMITS.freeSimulations}; con il Pass sono illimitate.</>
                : <>Ogni nuova simulazione aggiunge {FORMATS.ente.questions} risposte e la stima si ricalcola da sola.</>}
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
