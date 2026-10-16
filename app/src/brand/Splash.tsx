import Marchio from './Marchio';
import { FONT } from './tokens';

/**
 * Schermata di avvio (concept 13/30/31/36/49): marchio grande al centro e il motto. Statica, senza animazioni.
 * Si usa come `fallback` di Suspense (dentro una cornice: `<Splash />`) e come schermata di caricamento iniziale
 * (a pagina intera: `<Splash pienoSchermo />`). Non legge nessun contesto e non dipende da nessun dato.
 * `stato` è l'annuncio per gli screen reader. Gli spinner di caricamento restano fuori da qui.
 */
export default function Splash({ stato = 'Caricamento', pienoSchermo = false }: { stato?: string; pienoSchermo?: boolean }) {
  return (
    <div role="status" aria-label={stato}
      className={`flex w-full flex-col items-center justify-center px-8 text-center text-testo ${pienoSchermo ? 'min-h-[100dvh] bg-fondo' : 'h-full bg-superficie'}`}
      style={{ fontFamily: FONT }}>
      <Marchio disposizione="orizzontale" altezza={64} className="max-w-full" />
      <p data-testo-ok className="mt-5 text-[17px] leading-[24px] font-semibold text-testo-tenue">Studia oggi, sblocca il tuo domani.</p>
    </div>
  );
}
