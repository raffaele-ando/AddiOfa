import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Question } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fisher-Yates: rimescolamento uniforme (sort con Math.random non lo è)
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Con la quinta opzione (extraOption) non si fa nulla qui: resta fuori da options, che ha le 4 opzioni del banco.
// Per le simulazioni (4 o 5 opzioni a seconda del formato) si usa prepareQuestion di lib/exam.ts.
// Nota: non aggiungere parametri facoltativi, la funzione viene passata direttamente a .map().
export function shuffleQuestion(q: Question): Question {
  const optionsWithIndex = q.options.map((opt, i) => ({ text: opt, isCorrect: i === q.correctIndex }));
  
  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }
  
  const newCorrectIndex = optionsWithIndex.findIndex(o => o.isCorrect);
  
  return {
    ...q,
    options: optionsWithIndex.map(o => o.text),
    correctIndex: newCorrectIndex
  };
}

export function calculateSimilarity(str1: string, str2: string): number {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "do", "does", "did", "have", "has", "had",
    "in", "on", "at", "to", "for", "of", "with", "choose", "correct", "sentence", "translation",
    "which", "complete", "translate", "and", "or", "but", "if", "by", "from", "as", "about"
  ]);

  const tokenize = (s: string) => {
    return new Set(
      s.toLowerCase()
       .replace(/[^\w\s]|_/g, "")
       .split(/\s+/)
       .filter(w => w.length > 0 && !stopWords.has(w))
    );
  };

  const set1 = tokenize(str1);
  const set2 = tokenize(str2);

  // Due frasi fatte solo di parole comuni (es. "Choose the correct sentence") non hanno parole da confrontare:
  // se sono lo stesso testo sono la stessa domanda, altrimenti non si può dire che si somiglino.
  if (set1.size === 0 && set2.size === 0) {
    return str1.trim().toLowerCase() === str2.trim().toLowerCase() ? 1 : 0;
  }

  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) {
      intersection++;
    }
  }

  const union = set1.size + set2.size - intersection;
  return intersection / union;
}

/**
 * Chiave del giorno nel fuso locale ("2026-10-11"), per dailyActivity, dailyTimeSpent e il grafico dei sette giorni.
 * Non usare toISOString(): è in UTC e tra mezzanotte e le 2 (ora italiana) darebbe il giorno prima.
 */
export function chiaveGiorno(d: Date = new Date()): string {
  const due = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${due(d.getMonth() + 1)}-${due(d.getDate())}`;
}

// 12,5 e non 12.5; i numeri interi restano interi
export function formatNumber(value: number): string {
  return value.toLocaleString('it-IT', { maximumFractionDigits: 2 });
}

// 125 secondi → "2 min 05 s"
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)} min ${(s % 60).toString().padStart(2, '0')} s`;
}

// "formato_non_disponibile" e simili arrivano come messaggio dell'errore lanciato dal provider
export function errorCode(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
