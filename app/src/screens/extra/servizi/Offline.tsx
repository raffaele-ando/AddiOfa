// Pagina «Sei offline» / «Sei di nuovo online»: lo stato lo dice il titolo, la causa e cosa funziona lo stesso sta in UNA riga sempre visibile (non dietro la «i»).
// Offline vero: i progressi, le domande e la correzione funzionano sul dispositivo; sfide con il link e classifica servono la rete.
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
  const { vaiHome, indietro, avviaEsercizi } = useExtra();
  const online = useOnline();
  return online ? (
    <StatoPagina
      illustrazione="mondo-globo" figuraLato={104}
      titolo="Sei di nuovo online"
      testo="La connessione è tornata: sfide e iscrizione funzionano di nuovo."
      azioni={[
        { testo: 'Riprendi da dove eri', onClick: indietro, icona: <Icona nome="studia" size={18} /> },
        { testo: 'Vai alla Home', onClick: vaiHome, tipo: 'secondaria', icona: <Icona nome="home" size={18} /> },
      ]} />
  ) : (
    <StatoPagina
      illustrazione="mondo-globo" figuraLato={104}
      titolo="Sei offline"
      testo="Domande, correzione e progressi funzionano lo stesso. Sfide e classifica servono la rete."
      info={<p>Quello che hai già fatto è salvato su questo dispositivo e non si perde. Le domande sono già nel sito: se la pagina è aperta puoi continuare a studiare.</p>}
      azioni={[
        { testo: 'Continua a studiare', onClick: () => avviaEsercizi('smart'), icona: <Icona nome="studia" size={18} /> },
        { testo: 'Riprova la connessione', onClick: () => window.location.reload(), tipo: 'secondaria', icona: <Icona nome="riprova" size={18} /> },
      ]} />
  );
}
