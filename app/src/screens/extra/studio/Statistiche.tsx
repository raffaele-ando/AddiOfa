// `statistiche` non è più una schermata: le statistiche stanno in Profilo > Progressi (panoramica). Questo file resta solo come ponte
// per chi importasse ancora il componente: mostra la stessa panoramica a tutta pagina.
import StatsMode from '../../../components/StatsMode';
import { useExtra } from '../contesto';

export default function Statistiche() {
  const { appState, indietro, apriPaywall } = useExtra();
  return <StatsMode appState={appState} onExit={indietro} onNeedPass={() => apriPaywall()} />;
}
