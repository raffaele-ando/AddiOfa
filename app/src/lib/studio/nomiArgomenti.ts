// Un argomento ha un solo nome in tutta l'app: quello italiano del Percorso (il `titolo` della scheda di teoria).
// Le domande portano il nome inglese tecnico (`grammarTopic`): qui si traduce per mostrarlo. Senza scheda corrispondente resta com'è.
import { theoryTopics } from '../../data/theory';

const PER_TOPIC = new Map(theoryTopics.map(t => [t.grammarTopic, t.titolo]));

/** Il nome del Percorso per un `grammarTopic` (o per una categoria, che resta invariata). */
export function nomeArgomento(topic: string | undefined | null): string {
  if (!topic) return '';
  return PER_TOPIC.get(topic) ?? topic;
}

/** Nome breve (la parte prima dei due punti), per grafici e righe strette. */
export function nomeArgomentoBreve(topic: string | undefined | null): string {
  const n = nomeArgomento(topic);
  return n.includes(':') ? n.split(':')[0].trim() : n;
}
