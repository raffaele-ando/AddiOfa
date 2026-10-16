import { useState } from 'react';
import { Screen, TopBar } from '../components/ui';
import CorpoPass from './extra/profilo/CorpoPass';
import FoglioCondividi from './extra/sfide/FoglioCondividi';

interface InvitesProps {
  onBack(): void;
  /** Scopri il Pass (paywall). Assente = la pagina non ha il pulsante. */
  onOpenPaywall?: () => void;
}

/**
 * Vista `invites` di App: lo stesso contenuto della schermata `pass` (Profilo > Pass), per chi la apre fuori dalle schermate extra.
 * Il punto di accesso è uno solo: questo file non ha una grafica sua. La condivisione apre il foglio di condivisione.
 */
export default function Invites({ onBack, onOpenPaywall }: InvitesProps) {
  const [condividi, setCondividi] = useState<{ testo: string; url: string; titolo: string } | null>(null);
  return (
    <Screen>
      <TopBar onBack={onBack} />
      <h1 className="text-[26px] leading-[34px] font-extrabold tracking-[-0.02em] text-testo">Pass</h1>
      <CorpoPass onCondividi={setCondividi} onInizia={onBack} onScopri={onOpenPaywall ?? onBack} />
      {condividi && <FoglioCondividi aperto onChiudi={() => setCondividi(null)} testo={condividi.testo} url={condividi.url} titolo={condividi.titolo} />}
    </Screen>
  );
}
