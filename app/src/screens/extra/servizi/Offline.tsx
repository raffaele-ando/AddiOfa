// Pagina «Sei offline» (concept 16/17). Dice quello che è vero: i progressi sono sul dispositivo e non si perdono.
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useExtra } from '../contesto';
import StatoPagina from './StatoPagina';
import { Nota } from './componenti';

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
      illustrazione="mondo-internazionale"
      titolo={online ? 'La connessione c\'è' : 'Sei offline'}
      testo={online ? 'Il dispositivo risulta collegato a internet. Puoi riprendere da dove eri.' : 'Sei offline: i progressi restano sul dispositivo.'}
      azioni={[
        online ? { testo: 'Riprendi', onClick: indietro } : { testo: 'Riprova', onClick: () => window.location.reload(), icona: <RefreshCw size={18} aria-hidden="true" /> },
        { testo: 'Vai alla Home', onClick: vaiHome },
      ]}>
      <Nota tono="riuscito">
        Quello che hai già fatto è salvato qui e non si perde. Le funzioni che hanno bisogno della rete (domande servite dal server, inviti, lista d'attesa) ripartono quando torna la connessione.
      </Nota>
    </StatoPagina>
  );
}
