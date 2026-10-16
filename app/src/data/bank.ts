// Il banco domande visto dall'app. QuestionMeta è l'indice leggero (id, categoria, livello, argomento, senza risposte);
// Question (types.ts) è la domanda intera con risposta e spiegazione. Tutto il banco è aperto: nessun «nucleo».
import type { Question } from '../types';

export interface QuestionMeta {
  id: string;
  category: string;
  level?: string;
  grammarTopic?: string;
}

export function toMeta(q: Question, _index?: number): QuestionMeta {
  return { id: q.id, category: q.category, level: q.level, grammarTopic: q.grammarTopic };
}

export function toPublic(q: Question) {
  const { correctIndex: _c, explanation: _e, ...pubblica } = q;
  return pubblica;
}
