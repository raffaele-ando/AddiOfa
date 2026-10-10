// Il banco domande visto dall'app. QuestionMeta è l'indice leggero (sempre nel bundle, anche in produzione);
// Question (types.ts) è la domanda intera con risposta e spiegazione.
// Nel bundle di produzione restano solo le domande del nucleo gratuito per intero; il resto lo serve il Worker (pass/).
import type { Question } from '../types';
import { isCoreId } from './questions';

export interface QuestionMeta {
  id: string;
  category: string;
  level?: string;
  grammarTopic?: string;
  core: boolean;            // fa parte del nucleo gratuito
  format: 4 | 5;            // opzioni della domanda (5 = disponibile anche nel pool TENG)
}

export function toMeta(q: Question, _index?: number): QuestionMeta {
  return {
    id: q.id,
    category: q.category,
    level: q.level,
    grammarTopic: q.grammarTopic,
    core: isCoreId(q.id),
    format: (q.options.length === 5 ? 5 : 4),
  };
}

export function toPublic(q: Question) {
  const { correctIndex: _c, explanation: _e, ...pubblica } = q;
  return pubblica;
}
