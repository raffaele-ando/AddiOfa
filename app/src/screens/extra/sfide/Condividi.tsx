// `condividi`: il foglio di condivisione come schermata. Parametri: `testo` (il messaggio), `url` (il link), `titolo` (facoltativo).
// Solo le scelte (canali e copia): il messaggio parte con il canale scelto.
import { useExtra } from '../contesto';
import { OpzioniCondivisione } from './FoglioCondividi';
import { Fermo, Pagina } from './comuni';

export default function Condividi() {
  const { params, indietro } = useExtra();
  const testo = (params.testo ?? '').slice(0, 600);
  const url = (params.url ?? '').slice(0, 1000);
  return (
    <Pagina titolo={params.titolo?.slice(0, 40) || 'Condividi'} onBack={indietro}>
      <div className="mt-5">
        {!url && !testo ? (
          <Fermo icona="condividi" tono="azione" testo="Niente da condividere." />
        ) : (
          <OpzioniCondivisione testo={testo} url={url} mostraAnteprima={false} />
        )}
      </div>
    </Pagina>
  );
}
