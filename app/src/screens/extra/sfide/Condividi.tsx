// `condividi`: il foglio di condivisione come schermata. Parametri: `testo` (il messaggio), `url` (il link), `titolo` (facoltativo).
import { useExtra } from '../contesto';
import { OpzioniCondivisione } from './FoglioCondividi';
import { Carta, Pagina } from './comuni';

export default function Condividi() {
  const { params, indietro } = useExtra();
  const testo = (params.testo ?? '').slice(0, 600);
  const url = (params.url ?? '').slice(0, 1000);
  return (
    <Pagina titolo={params.titolo?.slice(0, 60) || 'Condividi'} sottotitolo={url || testo ? 'Scegli come mandarlo.' : undefined} onBack={indietro}>
      <div className="mt-5">
        {!url && !testo ? (
          <Carta><p className="text-[14px] text-testo-tenue">Non c'è niente da condividere da questa schermata. Torna indietro e riprova da dove avevi toccato «Condividi».</p></Carta>
        ) : (
          <OpzioniCondivisione testo={testo} url={url} />
        )}
      </div>
    </Pagina>
  );
}
