// `condividi`: il foglio di condivisione come schermata. Parametri: `testo` (il messaggio), `url` (il link), `titolo` (facoltativo).
// Solo le scelte (canali e copia): il messaggio parte con il canale scelto. In testa la clessidra: si aspetta l'amico (piano d'uso, §3.2).
import { Illustrazione } from '../../../brand/Illustrazione';
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
          <Fermo tono="azione" illustrazione={{ nome: 'vuoto' }} testo="Niente da condividere." />
        ) : (
          <>
            <div className="mb-4 flex justify-center"><Illustrazione nome="attesa" lato={64} /></div>
            <OpzioniCondivisione testo={testo} url={url} mostraAnteprima={false} />
          </>
        )}
      </div>
    </Pagina>
  );
}
