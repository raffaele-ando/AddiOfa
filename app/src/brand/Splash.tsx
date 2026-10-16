import Marchio from './Marchio';
import { Caricamento } from './componenti';
import { FONT } from './tokens';

/**
 * Schermata di avvio (concept 30.1 e 49.1: solo il marchio, nessuna illustrazione): marchio grande al centro e, sotto,
 * lo spinner di caricamento (l'unica cosa che si muove). Nessuna frase.
 * Si usa come `fallback` di Suspense (dentro una cornice: `<Splash />`) e come schermata di caricamento iniziale
 * (a pagina intera: `<Splash pienoSchermo />`). Non legge nessun contesto e non dipende da nessun dato.
 * `stato` è l'annuncio per gli screen reader.
 */
export default function Splash({ stato = 'Caricamento', pienoSchermo = false }: { stato?: string; pienoSchermo?: boolean }) {
  return (
    <div role="status" aria-label={stato}
      className={`flex w-full flex-col items-center justify-center px-8 text-center text-testo ${pienoSchermo ? 'min-h-[100dvh] bg-fondo' : 'h-full bg-superficie'}`}
      style={{ fontFamily: FONT }}>
      <Marchio disposizione="orizzontale" altezza={72} className="max-w-full" />
      <div className="mt-8" aria-hidden="true"><Caricamento lato={36} etichetta={stato} /></div>
    </div>
  );
}
