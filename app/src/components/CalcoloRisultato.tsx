// "Sto calcolando…": circa 3 secondi, saltabili. Le tre tappe corrispondono a quello che fa davvero il calcolo
// (conta le risposte, guarda i livelli delle domande, applica la soglia del test) e mostrano il dato vero di ciascuna.
import { useEffect, useRef, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Misuratore } from '../brand/componenti';
import { formatProbabilita } from '../lib/diagnostic';

const DURATA_MS = 3000;

export interface DatiCalcolo {
  /** Probabilità finale in percentuale (0-100), già calcolata e non arrotondata. */
  percento: number;
  esatte: number;
  totale: number;
  /** Mescolanza dei livelli delle domande, es. "3 A1, 2 A2, 5 B1". */
  livelli: string;
  soglia: number;
  domandeTest: number;
}

// Sale quasi in modo uniforme, così i cambi di colore si vedono
const salita = (k: number) => { const x = Math.min(1, Math.max(0, k)); return x * x * (3 - 2 * x) * 0.6 + x * 0.4; };

export default function CalcoloRisultato({ dati, onFine }: { dati: DatiCalcolo; onFine: () => void }) {
  const [t, setT] = useState(0);
  const fineRef = useRef(onFine);
  fineRef.current = onFine;

  useEffect(() => {
    let raf = 0;
    const inizio = performance.now();
    const passo = (ora: number) => {
      const trascorso = ora - inizio;
      setT(trascorso);
      if (trascorso >= DURATA_MS + 250) { fineRef.current(); return; }
      raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, []);

  const tappa = Math.min(3, Math.floor(t / (DURATA_MS / 3)));   // 0, 1, 2: in corso; 3: tutte fatte
  const valore = dati.percento * salita(t / (DURATA_MS - 200));
  // Mentre sale si vede il numero intero; quando arriva si scrive la forma onesta ('<1 %', '>99 %')
  const arrivato = t >= DURATA_MS - 200;

  const tappe = [
    { nome: `Controllo le ${dati.totale} risposte`, esito: `${dati.esatte} esatte su ${dati.totale}` },
    { nome: 'Guardo il livello delle domande', esito: dati.livelli },
    { nome: 'Calcolo la probabilità', esito: `Soglia: ${dati.soglia} su ${dati.domandeTest}` },
  ];

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Sto calcolando…</h2>
        <p className="mt-1 font-semibold text-gray-500 dark:text-gray-400">Ci vogliono pochi secondi.</p>
      </div>
      <div className="flex justify-center" aria-hidden>
        <Misuratore valore={valore} larghezza={300} animato={false} testo={arrivato ? formatProbabilita(dati.percento / 100) : undefined} />
      </div>
      <ol className="flex flex-col gap-2.5 rounded-2xl bg-[#F4F7FC] dark:bg-[#0F172A] border border-[#E8ECF3] dark:border-[#334155] p-4" aria-label="Tappe del calcolo">
        {tappe.map((x, i) => {
          const fatta = i < tappa, inCorso = i === tappa;
          return (
            <li key={x.nome} className="flex items-center gap-3 min-h-[40px]">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${fatta ? 'bg-azione text-white' : inCorso ? 'text-azione dark:text-azione-chiaro' : 'border-2 border-gray-300 dark:border-[#475569]'}`}>
                {fatta ? <Check size={16} strokeWidth={3.5} aria-hidden /> : inCorso ? <Loader2 size={20} strokeWidth={2.75} className="animate-spin" aria-hidden /> : null}
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className={`text-[15px] font-bold ${fatta || inCorso ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-gray-400 dark:text-gray-500'}`}>{x.nome}</span>
                {fatta && <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{x.esito}</span>}
              </span>
              <span className="sr-only">{fatta ? 'fatto' : inCorso ? 'in corso' : 'in attesa'}</span>
            </li>
          );
        })}
      </ol>
      <div role="status" className="sr-only">Sto calcolando la probabilità</div>
      <div className="mt-auto flex justify-center">
        <button type="button" onClick={onFine}
          className="py-2 px-6 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          Salta
        </button>
      </div>
    </>
  );
}
