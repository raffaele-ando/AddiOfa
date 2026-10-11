// "Ecco come ho calcolato la stima": schermata ferma prima del risultato. Le tre tappe corrispondono a quello che fa davvero
// il calcolo (conta le risposte, guarda i livelli delle domande, applica la soglia del test) e mostrano il dato vero di ciascuna.
// Niente attesa, niente conteggio: il risultato si apre solo quando l'utente preme il pulsante.
import { Check } from 'lucide-react';
import { PrimaryButton } from './ui';

export interface DatiCalcolo {
  /** Mescolanza dei livelli delle domande, es. "3 A1, 2 A2, 5 B1". */
  livelli: string;
  esatte: number;
  totale: number;
  soglia: number;
  domandeTest: number;
}

export default function CalcoloRisultato({ dati, onFine }: { dati: DatiCalcolo; onFine: () => void }) {
  const tappe = [
    { nome: `Controllo le ${dati.totale} risposte`, esito: `${dati.esatte} esatte su ${dati.totale}` },
    { nome: 'Guardo il livello delle domande', esito: dati.livelli },
    { nome: 'Calcolo la probabilità', esito: `Soglia: ${dati.soglia} su ${dati.domandeTest}` },
  ];

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">Ecco come ho calcolato la stima</h2>
        <p className="mt-1 font-semibold text-gray-500 dark:text-gray-400">Tre passaggi, con i tuoi dati.</p>
      </div>
      <ol className="flex flex-col gap-2.5 rounded-2xl bg-[#F4F7FC] dark:bg-[#0F172A] border border-[#E8ECF3] dark:border-[#334155] p-4" aria-label="Tappe del calcolo">
        {tappe.map(x => (
          <li key={x.nome} className="flex items-center gap-3 min-h-[40px]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-azione text-white">
              <Check size={16} strokeWidth={3.5} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[15px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{x.nome}</span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{x.esito}</span>
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-auto">
        <PrimaryButton onClick={onFine}>Vedi il risultato</PrimaryButton>
      </div>
    </>
  );
}
