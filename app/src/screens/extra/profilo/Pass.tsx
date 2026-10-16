import { useExtra } from '../contesto';
import { Pagina } from './componenti';
import CorpoPass from './CorpoPass';

/** Pass: stato, scadenza, scoprirlo o provarlo, inviti con codice e condivisione, accesso sbloccato. È l'unico punto di accesso agli inviti. */
export default function Pass() {
  const { indietro, vai, vaiHome, apriPaywall } = useExtra();
  return (
    <Pagina titolo="Pass" indietro={indietro}>
      <CorpoPass
        onCondividi={p => vai('condividi', p)}
        onInizia={vaiHome}
        onScopri={apriPaywall} />
    </Pagina>
  );
}
