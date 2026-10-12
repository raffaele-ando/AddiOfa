// «Frasi e vocaboli»: frasi inglesi corrette ricavate dal banco domande vero, senza inventare niente.
// Fonti (solo la risposta ESATTA di ogni domanda, mai le opzioni sbagliate):
//  - domande di Traduzione: l'inglese è l'opzione esatta, l'italiano è la frase da tradurre nel testo della domanda;
//  - domande di Grammatica «Complete…»: la frase con la risposta esatta al posto del vuoto (italiano = la regola della spiegazione);
//  - domande di Grammatica «Which sentence is correct?» e simili: la frase esatta intera (italiano = la regola della spiegazione).
// Niente doppioni (stessa frase = una riga sola), niente vuoti «___» rimasti, niente frasi senza senso.
import type { Question, UserStats } from '../../types';
import { isLearned } from '../spacedRepetition';

export interface Frase {
  /** Id stabile (quello della domanda da cui è presa): serve per le preferite. */
  id: string;
  en: string;
  /** Traduzione italiana se la domanda era di Traduzione; altrimenti la regola (prima frase della spiegazione). */
  it: string;
  itTipo: 'traduzione' | 'regola';
  /** Spiegazione italiana intera della domanda (per «Perché»). */
  spiegazione: string;
  /** Tutte le domande del banco che portano a questa stessa frase (la prima è quella da cui è presa). */
  domande: string[];
  theoryId?: string;
  argomento?: string;
  livello?: string;
  /** Fa parte del nucleo gratuito. */
  core: boolean;
}

export type FiltroFrasi = 'tutte' | 'preferite' | 'da-ripassare' | 'gia-note';

const SPAZI = /\s+/g;

/** Chiave per riconoscere la stessa frase scritta con maiuscole o punteggiatura diverse. */
export function chiaveFrase(en: string): string {
  return en
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(SPAZI, ' ')
    .trim();
}

/** Pulizia di una frase: spazi doppi tolti, spazio prima della punteggiatura tolto, primo e ultimo spazio via. */
function pulisci(s: string): string {
  return s.replace(SPAZI, ' ').replace(/\s+([,.!?;:])/g, '$1').trim();
}

/** Prima frase (o primo pezzo) della spiegazione italiana: la regola in breve. */
export function primaFrase(spiegazione: string, max = 150): string {
  const testo = spiegazione.replace(SPAZI, ' ').trim();
  if (!testo) return '';
  // si cerca la fine della prima frase: punto seguito da spazio e maiuscola, ma non dentro virgolette ('Is there.')
  let fine = -1;
  for (let i = 0; i < testo.length - 1; i++) {
    const c = testo[i];
    if ((c === '.' || c === '!' || c === '?') && testo[i + 1] === ' ' && /[A-ZÀ-Ý'"‘“]/.test(testo[i + 2] ?? '') ) { fine = i + 1; break; }
  }
  let frase = fine > 0 ? testo.slice(0, fine) : testo;
  if (frase.length > max) {
    const taglio = frase.lastIndexOf(' ', max - 1);
    frase = frase.slice(0, taglio > 40 ? taglio : max).replace(/[,;:\s]+$/, '') + '…';
  }
  return frase;
}

const RE_TRADUZIONE = /^(?:Choose the correct translation for|Translate:?)\s+'(.+)'(?:\s*\([^)]*\))?\s*$/;
// Istruzione iniziale di una domanda con un vuoto («Complete the sentence:», «Choose the correct question:»...), poi la frase, a volte tra apici,
// a volte con un suggerimento tra parentesi in fondo («(him/he/his/himself)», «(of us)»).
const RE_ISTRUZIONE = /^(?:Complete(?: the sentence)?|Choose the correct (?:question|sentence|form)):\s*/;
const RE_SUGGERIMENTO = /\s*\([^)]*\)\s*$/;

/** Il testo con il vuoto di una domanda di Grammatica, senza istruzione, apici esterni e suggerimento; null se non c'è un vuoto. */
function modelloConVuoto(prompt: string): string | null {
  if (!/_{2,}/.test(prompt)) return null;
  let t = prompt.trim().replace(RE_ISTRUZIONE, '').replace(RE_SUGGERIMENTO, '').trim();
  // trasformazioni «discorso diretto -> discorso indiretto»: la frase da tenere è quella dopo la freccia
  if (t.includes('->')) t = t.slice(t.lastIndexOf('->') + 2).trim();
  const tra = t.match(/^'(.+)'$/);
  if (tra) t = tra[1];
  // dialoghi scritti come 'domanda?' - 'risposta.' (o con i due apici di seguito): si uniscono con un trattino lungo
  t = t.replace(/'\s*(?:-\s*)?'/g, ' – ');
  return t;
}

const PAROLE_GRAMMATICALI: ReadonlySet<string> = new Set([
  'there', 'it', 'this', 'that', 'these', 'those', 'he', 'she', 'we', 'they', 'you', 'who', 'whom', 'whose', 'what', 'where', 'when',
  'why', 'how', 'which', 'the', 'a', 'an', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'is', 'are', 'was', 'were', 'am', 'do',
  'does', 'did', 'have', 'has', 'had', 'can', 'could', 'will', 'would', 'shall', 'should', 'must', 'may', 'might', 'not', 'no', 'some',
  'any', 'much', 'many', 'more', 'most', 'less', 'few', 'little', 'if', 'because', 'while', 'since', 'for', 'in', 'on', 'at', 'to',
  'of', 'by', 'with', 'about', 'from', 'me', 'him', 'us', 'them', 'mine', 'yours', 'hers', 'ours', 'theirs', 'one', 'ones',
]);

/**
 * La risposta messa al posto del vuoto: maiuscola se il vuoto apre la frase, minuscola se sta a metà
 * (il banco scrive «There» anche quando la frase comincia con «In my town ___»). «I», «I'm», «I'll» restano maiuscoli.
 */
export function maiuscolaGiusta(risposta: string, prima: string): string {
  const inizio = /(^|[.!?–:]\s*|[.!?]['"”]\s*)$/.test(prima);
  if (inizio) return risposta.charAt(0).toUpperCase() + risposta.slice(1);
  if (/^I(\b|')/.test(risposta)) return risposta;
  // si abbassa solo una parola grammaticale: «Italian» o «London» restano come sono
  const prima1 = risposta.split(/[\s']/)[0].toLowerCase();
  return PAROLE_GRAMMATICALI.has(prima1) ? risposta.charAt(0).toLowerCase() + risposta.slice(1) : risposta;
}

/** Una risposta è usabile per riempire un vuoto se è fatta di lettere (niente «-», «—», «(niente)»). */
function rispostaUsabile(r: string): boolean {
  return /[A-Za-z]{1,}/.test(r) && !/[()_…]/.test(r);
}

/**
 * Estrae la frase di una domanda, o null se la domanda non dà una frase completa e sicura.
 * Funzione pura: non guarda lo stato dell'utente.
 */
export function fraseDaDomanda(q: Question): Omit<Frase, 'domande' | 'core'> | null {
  const esatta = q.options?.[q.correctIndex];
  if (typeof esatta !== 'string' || !esatta.trim()) return null;
  const spiegazione = (q.explanation ?? '').replace(SPAZI, ' ').trim();
  const regola = primaFrase(spiegazione);
  const comune = { id: q.id, spiegazione, theoryId: q.theoryId, argomento: q.grammarTopic, livello: q.level };

  let en: string | null = null;
  let it = '';
  let itTipo: Frase['itTipo'] = 'regola';

  if (q.category === 'Traduzione') {
    const m = q.prompt.match(RE_TRADUZIONE);
    if (!m) return null;
    en = esatta;
    it = pulisci(m[1]);
    itTipo = 'traduzione';
    if (!it) return null;
  } else if (q.category === 'Grammatica') {
    const modello = modelloConVuoto(q.prompt);
    if (modello) {
      const vuoti = modello.match(/_{2,}/g)?.length ?? 0;
      const pezzi = vuoti > 1 ? esatta.split(/\s*\/\s*/) : [esatta];
      if (pezzi.length !== vuoti || !pezzi.every(rispostaUsabile)) return null;
      let i = 0;
      en = modello.replace(/_{2,}/g, (_v, pos: number) => maiuscolaGiusta(pezzi[i++], modello.slice(0, pos)));
    } else if (!/_/.test(q.prompt)) {
      // «Which sentence is correct?», «Choose the correct negative sentence:»...: l'opzione esatta è già la frase intera
      if (!rispostaUsabile(esatta)) return null;
      en = esatta;
    } else {
      return null;
    }
    it = regola;
    if (!it) return null;
  } else {
    return null;
  }

  en = pulisci(en);
  // controlli finali: niente segnaposto, niente frasi vuote o troppo corte per essere una frase, niente doppie spaziature
  if (!en || /_{1,}|…|\.\.\./.test(en) || en.length < 3) return null;
  if (!/[A-Za-z]/.test(en)) return null;
  return { ...comune, en, it, itTipo };
}

/**
 * Frasi dal banco: una riga per frase, senza doppioni. Se due domande danno la stessa frase vince quella del nucleo gratuito,
 * poi quella con la traduzione italiana vera; le altre restano nell'elenco `domande` (servono a «Da ripassare» e «Già note»).
 */
export function estraiFrasi(banco: readonly Question[], isCore: (id: string) => boolean): Frase[] {
  const perChiave = new Map<string, Frase>();
  const punteggio = (f: Frase) => (f.core ? 2 : 0) + (f.itTipo === 'traduzione' ? 1 : 0);
  for (const q of banco) {
    const f = fraseDaDomanda(q);
    if (!f) continue;
    const nuova: Frase = { ...f, domande: [q.id], core: isCore(q.id) };
    const chiave = chiaveFrase(nuova.en);
    if (!chiave) continue;
    const presente = perChiave.get(chiave);
    if (!presente) { perChiave.set(chiave, nuova); continue; }
    const vince = punteggio(nuova) > punteggio(presente) ? nuova : presente;
    const domande = [...new Set([...presente.domande, q.id])];
    perChiave.set(chiave, { ...vince, domande: [vince.id, ...domande.filter(d => d !== vince.id)] });
  }
  return [...perChiave.values()];
}

export interface StatoFrase { daRipassare: boolean; nota: boolean }

/** Stato di una frase rispetto ai progressi: sbagliata da ripassare (errore e non ancora imparata) oppure già nota (imparata). */
export function statoFrase(f: Frase, stats: UserStats | undefined | null): StatoFrase {
  let sbagliata = false, imparata = false;
  for (const id of f.domande) {
    const s = stats?.[id];
    if (!s) continue;
    if (isLearned(s)) imparata = true;
    else if ((s.incorrect ?? 0) > 0) sbagliata = true;
  }
  // un errore su una domanda non ancora imparata pesa di più di un'altra domanda uguale già imparata
  return { daRipassare: sbagliata, nota: imparata && !sbagliata };
}

export interface RicercaFrasi {
  testo: string;
  filtro: FiltroFrasi;
  preferite: ReadonlySet<string>;
  stats: UserStats | undefined | null;
  /** Senza Pass si vedono solo le frasi del nucleo gratuito. */
  pass: boolean;
}

/** Toglie accenti e maiuscole: «perche» trova «perché». */
function semplifica(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function filtraFrasi(tutte: readonly Frase[], r: RicercaFrasi): Frase[] {
  const q = semplifica(r.testo.trim());
  return tutte.filter(f => {
    if (!r.pass && !f.core) return false;
    if (q && !semplifica(`${f.en} ${f.it} ${f.argomento ?? ''}`).includes(q)) return false;
    switch (r.filtro) {
      case 'preferite': return r.preferite.has(f.id);
      case 'da-ripassare': return statoFrase(f, r.stats).daRipassare;
      case 'gia-note': return statoFrase(f, r.stats).nota;
      default: return true;
    }
  });
}

/** Conteggi per le etichette dei filtri. */
export function contaFrasi(tutte: readonly Frase[], r: Omit<RicercaFrasi, 'testo' | 'filtro'>): Record<FiltroFrasi, number> {
  const visibili = tutte.filter(f => r.pass || f.core);
  let ripassare = 0, note = 0, pref = 0;
  for (const f of visibili) {
    const s = statoFrase(f, r.stats);
    if (s.daRipassare) ripassare++;
    if (s.nota) note++;
    if (r.preferite.has(f.id)) pref++;
  }
  return { tutte: visibili.length, preferite: pref, 'da-ripassare': ripassare, 'gia-note': note };
}
