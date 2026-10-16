// "Ecco come ho calcolato la stima": schermata ferma prima del risultato. Le tre tappe corrispondono a quello che fa davvero
// il calcolo (conta le risposte, guarda i livelli delle domande, applica la soglia del test) e mostrano il dato vero di ciascuna.
// Niente attesa, niente conteggio: il risultato si apre solo quando l'utente preme il pulsante.
import { Layers, ListChecks, Target } from 'lucide-react';
import { PrimaryButton } from './ui';
import { TONI, type Tono } from '../screens/extra/ui';

export interface DatiCalcolo {
  /** Mescolanza dei livelli delle domande, es. "3 A1, 2 A2, 5 B1". */
  livelli: string;
  esatte: number;
  totale: number;
  soglia: number;
  domandeTest: number;
}

export default function CalcoloRisultato({ dati, onFine }: { dati: DatiCalcolo; onFine: () => void }) {
  // Ogni tappa ha il colore di ciò che misura: le risposte esatte sono verdi (riuscito), i livelli viola (apprendimento), la soglia blu.
  const tappe: { nome: string; esito: string; tono: Tono; Icona: typeof Layers }[] = [
    { nome: `Controllo le ${dati.totale} risposte`, esito: `${dati.esatte} esatte su ${dati.totale}`, tono: 'alto', Icona: ListChecks },
    { nome: 'Guardo il livello delle domande', esito: dati.livelli, tono: 'viola', Icona: Layers },
    { nome: 'Calcolo la probabilità', esito: `Soglia: ${dati.soglia} su ${dati.domandeTest}`, tono: 'azione', Icona: Target },
  ];

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-testo">Ecco come ho calcolato la stima</h2>
        <p className="mt-1 font-semibold text-testo-tenue">Tre passaggi, con i tuoi dati.</p>
      </div>
      <ol className="flex flex-col gap-2.5 rounded-2xl bg-superficie-2 border border-linea p-4" aria-label="Tappe del calcolo">
        {tappe.map(x => (
          <li key={x.nome} className="flex items-center gap-3 min-h-[40px]">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONI[x.tono].tinta} ${TONI[x.tono].icona}`}>
              <x.Icona size={20} strokeWidth={2.4} aria-hidden />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[15px] font-bold text-testo">{x.nome}</span>
              <span className={`text-xs font-bold ${TONI[x.tono].testo}`}>{x.esito}</span>
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
