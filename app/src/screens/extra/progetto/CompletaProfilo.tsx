// «Completa il profilo»: la registrazione (Chi sei, Il tuo corso, Consensi) per chi ha già usato l'app senza registrarsi. Si vede finché non è fatta,
// poi mai più. Non rifà il diagnostico: usa gli stessi passi del funnel (components/Onboarding.tsx, `soloRegistrazione`).
import Onboarding from '../../../components/Onboarding';
import { useExtra } from '../contesto';

export default function CompletaProfilo() {
  const { appState, aggiorna, vaiHome, apriLegale } = useExtra();
  return (
    <Onboarding
      soloRegistrazione
      appState={appState}
      onUpdateAppState={nuovo => aggiorna(() => nuovo)}
      onFinish={() => vaiHome()}
      onOpenLegal={apriLegale}
    />
  );
}
