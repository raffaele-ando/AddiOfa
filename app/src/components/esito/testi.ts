// Testi puri dell'esito e della correzione (senza React, per poterli provare): la riga del confronto con la simulazione precedente
// e la tipografia delle spiegazioni (virgolette dritte → caporali).
export interface PuntiConfronto { esatte: number; totale: number }

/** Differenza di risposte esatte, solo se le due prove avevano lo stesso numero di domande (altrimenti i numeri non sono confrontabili). */
export function differenzaEsatte(prima: PuntiConfronto, dopo: PuntiConfronto): number | null {
  return prima.totale === dopo.totale ? dopo.esatte - prima.esatte : null;
}

/** La riga della differenza, neutra: «3 risposte esatte in più della precedente», «Come la precedente». */
export function fraseDifferenza(d: number): string {
  if (d === 0) return 'Come la precedente';
  const n = Math.abs(d);
  return `${n} ${n === 1 ? 'risposta esatta' : 'risposte esatte'} ${d > 0 ? 'in più' : 'in meno'} della precedente`;
}

/** Le virgolette dritte attorno a una parola o a una frase («'more' …») diventano caporali; gli apostrofi (l'auto, students') restano. */
export function tipografiche(t: string): string {
  return t.replace(/(^|[\s(\[—-])'((?:[^'\n]|'(?=\p{L})){1,80}?)'(?=$|[\s.,;:!?)\]—])/gu, '$1«$2»');
}
