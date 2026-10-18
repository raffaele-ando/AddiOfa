// Logica pura della Home (nessun React): quale fascia, quali parole, quale pulsante, come si ordinano le aree, che scala ha il grafico.
// Tutti i numeri e i testi con numeri vengono da stima.ts e da config/offer.ts: nulla è scritto a mano.
import { formatPunteggio } from '../../lib/diagnostic';
import { EXAM, DIAGNOSTIC_QUESTIONS, REAL_TEST_PASS_MARK } from '../../config/offer';
import type { Fattore, Livello, PuntoStima, Stima } from './stima';

export type ChiaveBanner = 'nuovo' | 'partenza' | 'margine' | 'soglia' | 'strada';

/** "In partenza" solo a chi ha fatto il diagnostico e basta (sotto il 20 %); dopo le simulazioni "Da migliorare". */
export function chiaveBanner(stima: Stima | null, livello: Livello): ChiaveBanner {
  if (!stima) return 'nuovo';
  return livello === 'alto' ? 'strada' : livello === 'medio' ? 'soglia' : stima.fonte === 'diagnostico' && stima.p < 0.2 ? 'partenza' : 'margine';
}

/** Titolo (al massimo tre parole) e riga di spiegazione (al massimo dieci) della fascia di stato. */
export function testiFascia(chiave: ChiaveBanner, stima: Stima | null, areeConDati: boolean): { titolo: string; riga: string } {
  switch (chiave) {
    case 'nuovo': return { titolo: 'Da iniziare', riga: `Con ${DIAGNOSTIC_QUESTIONS} domande ottieni la prima stima.` };
    case 'partenza': return { titolo: 'In partenza', riga: `Stima su ${DIAGNOSTIC_QUESTIONS} domande: si affina con altre risposte.` };
    case 'margine': return { titolo: 'Da migliorare', riga: areeConDati ? 'Parti dalle aree in cima all’elenco.' : 'Allenati ancora per far salire la stima.' };
    case 'soglia': return { titolo: 'Vicino alla soglia', riga: stima ? `Punteggio probabile ${formatPunteggio(stima.intervallo)}, soglia ${REAL_TEST_PASS_MARK}.` : `Soglia ${REAL_TEST_PASS_MARK} su ${EXAM.questions}.` };
    case 'strada': return { titolo: 'In linea', riga: stima?.fonte === 'diagnostico' ? 'Conferma la stima con una simulazione.' : 'Mantieni il ritmo con una simulazione.' };
  }
}

/** Riga sotto «Ciao, {nome}» (solo se il nome esiste): breve, mai una promessa. */
export function rigaSaluto(chiave: ChiaveBanner): string {
  return chiave === 'nuovo' ? 'Facciamo la prima stima.' : chiave === 'strada' ? 'Ottimo lavoro.' : chiave === 'soglia' ? 'Ci sei quasi.' : 'Un passo alla volta.';
}

export type AzioneCta = 'diagnostico' | 'simulazione' | 'allenamento';
export interface Cta { azione: AzioneCta; etichetta: string; sotto: string }

/**
 * Il pulsante principale cambia con lo stato e dice cosa fa (verbo + oggetto):
 * senza stima il test iniziale, con la stima alta una simulazione, altrimenti la sessione di allenamento.
 * `puoDiagnostico` / `puoSimulare`: se la schermata non ha la funzione, il pulsante ripiega sull'allenamento.
 */
export function ctaPrincipale(stima: Stima | null, livello: Livello, puoDiagnostico: boolean, puoSimulare: boolean): Cta {
  if (!stima && puoDiagnostico) return { azione: 'diagnostico', etichetta: 'Fai il test iniziale', sotto: `${DIAGNOSTIC_QUESTIONS} domande per la stima` };
  if (stima && livello === 'alto' && puoSimulare) return { azione: 'simulazione', etichetta: 'Fai una simulazione', sotto: `${EXAM.questions} domande, ${EXAM.minutes} minuti` };
  return { azione: 'allenamento', etichetta: stima ? 'Continua l’allenamento' : 'Inizia ad allenarti', sotto: '10 domande scelte per te' };
}

/** Chip della fascia: da quale stima si è partiti (la prima misura, in %), con la direzione. Nessun chip con meno di due misure o senza differenza. */
export function variazioneDaPrima(tutti: readonly PuntoStima[]): { da: number; verso: 'su' | 'giu' } | null {
  if (tutti.length < 2) return null;
  const prima = Math.round(tutti[0].p * 100), ultima = Math.round(tutti[tutti.length - 1].p * 100);
  if (prima === ultima) return null;
  return { da: prima, verso: ultima > prima ? 'su' : 'giu' };
}

/** Le aree reali dell'app (categorie e livelli di calcolaFattori): prima quelle con dati, dalla più debole; poi quelle senza dati. */
export function areeOrdinate(categorie: readonly Fattore[], livelli: readonly Fattore[]): Fattore[] {
  const tutte = [...categorie, ...livelli];
  const conDati = tutte.filter(f => f.percento !== null)
    .map((f, i) => ({ f, i }))
    .sort((a, b) => (a.f.percento! - b.f.percento!) || (b.f.risposte - a.f.risposte) || (a.i - b.i))
    .map(x => x.f);
  return [...conDati, ...tutte.filter(f => f.percento === null)];
}

/** Nome per esteso di un'area: i livelli diventano «Livello A1». */
export function nomeArea(f: Pick<Fattore, 'nome' | 'filtro'>): string {
  return f.filtro.startsWith('level:') ? `Livello ${f.nome}` : f.nome;
}

/** Un'area è «da migliorare» sotto questa percentuale (la soglia della fascia bassa, come livelloDi): si segna con una parola e un segno, non solo col colore. */
export const AREA_DEBOLE = 40;

/**
 * Scala verticale del grafico: da (minimo - 10) a (massimo + 10), tra 0 e 100, larga almeno 30 punti
 * (con due misure vicine la linea non deve fingere un salto).
 */
export function scalaGrafico(valori: readonly number[]): { lo: number; hi: number } {
  if (valori.length === 0) return { lo: 0, hi: 100 };
  let lo = Math.max(0, Math.min(...valori) - 10), hi = Math.min(100, Math.max(...valori) + 10);
  if (hi - lo < 30) {
    const c = (lo + hi) / 2;
    lo = c - 15; hi = c + 15;
    if (lo < 0) { hi -= lo; lo = 0; }
    if (hi > 100) { lo -= hi - 100; hi = 100; }
  }
  return { lo, hi };
}
