// «Come ho calcolato la stima»: schermata ferma prima del risultato. Le tre tappe sono quelle che fa davvero il calcolo
// (conta le risposte, guarda i livelli delle domande, applica la soglia del test): ciascuna è un'icona e il suo numero vero.
// Niente frasi, niente attesa, niente conteggio: il risultato si apre solo quando l'utente preme il pulsante.
import { Icona, type NomeIcona } from '../brand/icone/Icona';
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
  const tappe: { icona: NomeIcona; etichetta: string; valore: string; tono: Tono }[] = [
    { icona: 'risposte', etichetta: 'Risposte esatte', valore: `${dati.esatte}/${dati.totale}`, tono: 'alto' },
    { icona: 'livello', etichetta: 'Livelli', valore: dati.livelli, tono: 'viola' },
    { icona: 'soglia', etichetta: 'Soglia', valore: `${dati.soglia}/${dati.domandeTest}`, tono: 'azione' },
  ];

  return (
    <>
      <h2 className="text-center text-2xl sm:text-3xl font-bold text-testo">Calcolo</h2>
      <ol className="flex flex-col gap-3 rounded-2xl bg-superficie-2 border border-linea p-4" aria-label="Tre tappe del calcolo">
        {tappe.map((x, i) => (
          <li key={x.etichetta} className="flex items-center gap-3 min-h-[52px]">
            <span className="w-4 shrink-0 text-center text-sm font-extrabold text-testo-tenue" aria-hidden>{i + 1}</span>
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONI[x.tono].tinta} ${TONI[x.tono].icona}`}>
              <Icona nome={x.icona} size={24} titolo={x.etichetta} />
            </span>
            <span className={`min-w-0 flex-1 text-xl font-extrabold leading-tight ${TONI[x.tono].testo}`}>{x.valore}</span>
          </li>
        ))}
      </ol>
      <div className="mt-auto">
        <PrimaryButton onClick={onFine}>Risultato</PrimaryButton>
      </div>
    </>
  );
}
