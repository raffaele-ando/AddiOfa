// Schermata extra `splash` (a tutto schermo, senza barra): l'avvio di AddiOFA. Aperta da un indirizzo (?vista=splash) non resta per sempre:
// dopo un attimo porta alla Home, come le viste che non esistono.
import { useEffect } from 'react';
import Splash from '../../../brand/Splash';
import { useExtra } from '../contesto';

export default function SplashExtra() {
  const { vaiHome } = useExtra();
  useEffect(() => {
    const t = setTimeout(vaiHome, 1500);
    return () => clearTimeout(t);
  }, [vaiHome]);
  return <Splash />;
}
