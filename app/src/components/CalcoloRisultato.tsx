// «Come ho calcolato la stima»: schermata ferma prima del risultato (concept 09, 10, 20, 29, 42, 43, senza le animazioni: l'app è statica).
// Le tre tappe sono quelle che fa davvero il calcolo (conta le risposte, guarda i livelli delle domande, applica la soglia del test):
// ciascuna è un'icona, il suo nome in una o due parole e il suo numero vero, già «fatta» (spunta). Il risultato si apre solo quando l'utente preme il pulsante.
// Arte: `documento-in-corso` (elaborazione), ferma. Niente percentuale qui: è la schermata dopo.
import { Icona, type NomeIcona } from '../brand/icone/Icona';
import { Illustrazione } from '../brand/Illustrazione';
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
      <div className="flex flex-col items-center gap-1 pt-2">
        <Illustrazione nome="documento-in-corso" lato={112} />
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-testo">Calcolo</h2>
      </div>
      <ol className="flex flex-col gap-2.5" aria-label="Tre tappe del calcolo">
        {tappe.map((x, i) => (
          <li key={x.etichetta} className="flex items-center gap-3 rounded-2xl bg-superficie-2 border border-linea px-3.5 py-3 min-h-[68px]">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONI[x.tono].tinta} ${TONI[x.tono].icona}`} aria-hidden>
              <Icona nome={x.icona} size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] leading-[16px] font-bold text-testo-tenue"><span className="tabular-nums">{i + 1}</span> · {x.etichetta}</span>
              <span className={`block text-xl font-extrabold leading-tight ${TONI[x.tono].testo}`}>{x.valore}</span>
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-alto-tinta text-alto-numero" role="img" aria-label="Fatto"><Icona nome="stato-ok" size={18} /></span>
          </li>
        ))}
      </ol>
      <div className="mt-auto">
        <PrimaryButton onClick={onFine}>Risultato</PrimaryButton>
      </div>
    </>
  );
}
