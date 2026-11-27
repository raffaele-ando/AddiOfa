// `condividi`: il foglio di condivisione come schermata. Parametri: `testo` (il messaggio), `url` (il link), `titolo` (facoltativo).
// Solo le scelte (canali e copia): il messaggio parte con il canale scelto. Senza niente da condividere non è un vicolo cieco: dice perché e porta a farlo.
import { useExtra } from '../contesto';
import { OpzioniCondivisione } from './FoglioCondividi';
import { Bottone, Fermo, Pagina } from './comuni';
import { indirizzoApp } from './dati';
import { elencoSimulazioni } from '../../../lib/studio/simulazioni';

export default function Condividi() {
  const { params, indietro, vai, avviaSimulazione, appState } = useExtra();
  // senza niente passato si propone l'ultima simulazione, se c'è
  const ultima = !params.testo && !params.url ? elencoSimulazioni(appState.history)[0] : undefined;
  const testo = (params.testo ?? (ultima ? `Ho fatto ${ultima.esatte}/${ultima.totale} in una simulazione del test d'inglese dell'OFA su AddiOFA.` : '')).slice(0, 600);
  const url = (params.url ?? (ultima ? indirizzoApp() : '')).slice(0, 1000);
  return (
    <Pagina titolo={params.titolo?.slice(0, 40) || 'Condividi'} onBack={indietro}>
      <div className="mt-2">
        {!url && !testo ? (
          <Fermo illustrazione={{ nome: 'vuoto' }} titolo="Niente da condividere" causa="Fai una sfida o una simulazione, poi manda il risultato.">
            <Bottone icona="simulazioni" onClick={avviaSimulazione}>Fai una simulazione</Bottone>
            <Bottone variante="secondario" icona="sfide" onClick={() => vai('sfide')}>Vai alle sfide</Bottone>
          </Fermo>
        ) : (
          <>
            {ultima && <p data-testo-ok className="mb-3 text-s2 leading-[21px] text-testo-tenue">La tua ultima simulazione: {ultima.esatte}/{ultima.totale}.</p>}
            <OpzioniCondivisione testo={testo} url={url} mostraAnteprima={false} />
          </>
        )}
      </div>
    </Pagina>
  );
}
