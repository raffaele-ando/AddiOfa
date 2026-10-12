// «Le tue statistiche» dentro la struttura extra: lo stesso componente della vista `stats`, con i collegamenti al percorso e alle lezioni.
// Le altre aree la aprono con vai('statistiche'). Concept: 18 scheda 2, 06 «progressi», 25 «come cambia».
import StatsMode from '../../../components/StatsMode';
import { useExtra } from '../contesto';

export default function Statistiche() {
  const { appState, indietro, apriPaywall, vai } = useExtra();
  return (
    <StatsMode
      appState={appState}
      onExit={indietro}
      onNeedPass={() => apriPaywall()}
      onVaiPercorso={() => vai('percorso')}
      onApriLezione={id => vai('lezione-dettaglio', { id })}
    />
  );
}
