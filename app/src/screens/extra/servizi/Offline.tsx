// Pagina «Sei offline» (concept 16/17). Il titolo dice lo stato; la spiegazione onesta (i progressi sono sul dispositivo e non si perdono) sta dietro la «i».
import { useEffect, useState } from 'react';
import { Icona } from '../../../brand/icone/Icona';
import { useExtra } from '../contesto';
import StatoPagina from './StatoPagina';

function useOnline(): boolean {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  useEffect(() => {
    const su = () => setOnline(true), giu = () => setOnline(false);
    window.addEventListener('online', su); window.addEventListener('offline', giu);
    return () => { window.removeEventListener('online', su); window.removeEventListener('offline', giu); };
  }, []);
  return online;
}

export default function Offline() {
  const { vaiHome, indietro } = useExtra();
  const online = useOnline();
  return (
    <StatoPagina
      illustrazione="mondo-globo"
      titolo={online ? 'Connesso' : 'Sei offline'}
      info={<p>Quello che hai già fatto è salvato su questo dispositivo e non si perde. Le domande sono già nel sito: se la pagina è aperta puoi continuare a studiare.</p>}
      azioni={[
        online ? { testo: 'Riprendi', onClick: indietro, icona: <Icona nome="studia" size={18} /> } : { testo: 'Riprova', onClick: () => window.location.reload(), icona: <Icona nome="riprova" size={18} /> },
        { testo: 'Home', onClick: vaiHome, icona: <Icona nome="home" size={18} /> },
      ]} />
  );
}
