// `condividi`: il foglio di condivisione come schermata. Parametri: `testo` (il messaggio), `url` (il link), `titolo` (facoltativo).
// Solo le scelte (canali e copia): il messaggio parte con il canale scelto. Senza niente da condividere non è un vicolo cieco: dice perché e porta a farlo.
import { useExtra } from '../contesto';
import { OpzioniCondivisione } from './FoglioCondividi';
import { Bottone, Fermo, Pagina } from './comuni';

export default function Condividi() {
  const { params, indietro, vai, avviaSimulazione } = useExtra();
  const testo = (params.testo ?? '').slice(0, 600);
  const url = (params.url ?? '').slice(0, 1000);
  return (
    <Pagina titolo={params.titolo?.slice(0, 40) || 'Condividi'} onBack={indietro}>
      <div className="mt-2">
        {!url && !testo ? (
          <Fermo illustrazione={{ nome: 'messaggi-supporto' }} titolo="Niente da condividere" causa="Fai una sfida o una simulazione, poi manda il risultato.">
            <Bottone icona="simulazioni" onClick={avviaSimulazione}>Fai una simulazione</Bottone>
            <Bottone variante="secondario" icona="sfide" onClick={() => vai('sfide')}>Vai alle sfide</Bottone>
          </Fermo>
        ) : (
          <OpzioniCondivisione testo={testo} url={url} mostraAnteprima={false} />
        )}
      </div>
    </Pagina>
  );
}
