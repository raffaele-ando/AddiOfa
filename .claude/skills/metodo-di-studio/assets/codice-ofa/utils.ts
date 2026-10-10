import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

  if (set1.size === 0 && set2.size === 0) return 0;

  let intersection = 0;
  for (const word of set1) {
    if (set2.has(word)) {
      intersection++;
    }
  }

  const union = set1.size + set2.size - intersection;
  return intersection / union;
}
