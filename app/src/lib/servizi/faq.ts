// «Guida e FAQ»: testi veri, presi da config/offer.ts. Nessuna promessa che non si possa mantenere:
// l'app è gratuita, statica, senza account, e i dati restano nel dispositivo. Cercare e filtrare sono funzioni pure.
import type { LegalSection } from '../../types';
import {
  DISCLAIMER, EXAM, OFA_CONSEQUENCES, OFA_RULES_NOTE, DIAGNOSTIC_QUESTIONS, REAL_TEST_PASS_MARK, REAL_TEST_QUESTIONS, RETAKE_COST_EUR,
} from '../../config/offer';
import { questions } from '../../data/questions';
import { theoryTopics } from '../../data/theory';

export type CategoriaFaq = 'test' | 'studio' | 'dati' | 'app';

export const CATEGORIE_FAQ: readonly { id: CategoriaFaq; nome: string }[] = [
  { id: 'test', nome: 'Il test' },
  { id: 'studio', nome: 'Lo studio' },
  { id: 'dati', nome: 'I tuoi dati' },
  { id: 'app', nome: 'L\'app' },
];

export interface VoceFaq {
  id: string;
  categoria: CategoriaFaq;
  domanda: string;
  /** Paragrafi della risposta. */
  risposta: string[];
  /** Parole che l'utente può cercare e che nel testo non compaiono. */
  chiavi?: string;
  legale?: { sezione: LegalSection; testo: string };
  /** Schermata dell'app collegata alla risposta. */
  vai?: { id: string; testo: string; params?: Record<string, string> };
}

/** Le voci della guida. I numeri vengono dal banco vero e da config/offer.ts: se cambiano, cambiano anche le risposte. */
export function vociFaq(): VoceFaq[] {
  const schede = theoryTopics.filter(t => t.pronta).length;
  return [
    // ---- Il test
    {
      id: 'ofa-cose', categoria: 'test', domanda: 'Che cos\'è l\'OFA di inglese?',
      risposta: [
        'OFA sta per obblighi formativi aggiuntivi: quello di inglese si recupera superando un test.',
        `${OFA_CONSEQUENCES[1]}.`,
        OFA_RULES_NOTE,
      ],
      chiavi: 'obbligo formativo aggiuntivo debito piano degli studi',
    },
    {
      id: 'test-formato', categoria: 'test', domanda: 'Com\'è fatto il test di recupero?',
      risposta: [
        `${EXAM.questions} domande, ${EXAM.options} opzioni, ${EXAM.minutes} minuti. Si supera con ${EXAM.passMark} su ${EXAM.questions}. È il formato che l'app usa nelle simulazioni.`,
        'Formato del test di LinguaViva. Language Academy e British Institutes non pubblicano la soglia: controlla con l\'ente che hai scelto.',
        `Presso gli enti convenzionati un tentativo costa circa ${RETAKE_COST_EUR} €.`,
      ],
      chiavi: 'soglia 25 30 domande quindici minuti enti convenzionati linguaviva costo',
    },
    {
      id: 'test-chi', categoria: 'test', domanda: 'Il test lo faccio con AddiOFA?',
      risposta: [`No. ${DISCLAIMER} Il test lo sostieni con l'ente che scegli: AddiOFA serve a prepararti.`],
      chiavi: 'politecnico affiliazione ufficiale non ufficiale',
    },
    {
      id: 'test-certificazione', categoria: 'test', domanda: 'Ho già una certificazione o ho già fatto il test: cosa cambia?',
      risposta: [
        'Il riconoscimento di una certificazione e l\'esito di un test già sostenuto si gestiscono con il Politecnico, non con l\'app: AddiOFA non li verifica e non ti chiede nessuna email istituzionale.',
        OFA_RULES_NOTE,
      ],
      chiavi: 'gia sostenuto certificazione ielts cambridge esonero email polimi',
    },
    {
      id: 'stima-cosa', categoria: 'test', domanda: 'La probabilità che vedo è una promessa?',
      risposta: [
        `No. È una stima, calcolata sulle tue risposte: la probabilità di fare almeno ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}. Con poche risposte è approssimativa e non dice come andrà il test vero; si affina con le simulazioni.`,
        'Nella Home, con il pulsante «i» sotto la probabilità, vedi come è calcolata e tra quali valori può stare.',
      ],
      chiavi: 'percentuale stima probabilita superare intervallo',
      vai: { id: 'progressi', testo: 'Apri Progressi', params: { sezione: 'argomenti' } },
    },

    // ---- Lo studio
    {
      id: 'studio-cosa-ce', categoria: 'studio', domanda: 'Cosa trovo nell\'app?',
      risposta: [
        `Tutte le ${questions.length} domande del banco, le ${schede} schede di teoria, simulazioni senza limite, ripasso degli errori, statistiche complete, frasi e prontuario delle regole. Nessuna parte è bloccata.`,
      ],
      chiavi: 'contenuti domande teoria simulazioni frasi prontuario gratis gratuito limiti',
    },
    {
      id: 'studio-da-dove', categoria: 'studio', domanda: 'Da dove comincio?',
      risposta: [
        `Dal quiz diagnostico: ${DIAGNOSTIC_QUESTIONS} domande, circa 3 minuti. Ti dà una prima stima e ti dice quali argomenti guardare. Poi ripasso sugli errori e, quando ti senti pronto, una simulazione.`,
      ],
      chiavi: 'diagnostico iniziare partire primo passo',
    },
    {
      id: 'studio-ripasso', categoria: 'studio', domanda: 'Come sceglie le domande il ripasso?',
      risposta: [
        'Ripropone una domanda a distanza di giorni che crescono se rispondi bene, e prima se sbagli. Dà la precedenza alle domande che dovresti rivedere e ne mescola di nuove, così non rifai solo quelle che già sai.',
      ],
      chiavi: 'ripasso dilazionato intervalli algoritmo spaced repetition errori',
    },

    // ---- I tuoi dati
    {
      id: 'dati-raccolti', categoria: 'dati', domanda: 'Che dati raccogliete?',
      risposta: [
        'I progressi di studio restano nel tuo browser. All\'inizio ti chiediamo la tua email del Politecnico (obbligatoria: il nome lo ricaviamo dall\'email) e il percorso di studi (scuola, sede, livello, corso, anno), e ti chiediamo come ci hai conosciuto: li riceve ATLAS, il servizio di Project che gestisce AddiOFA. La classifica NOI, la personalizzazione e le comunicazioni sono consensi facoltativi, spenti finché non li accendi tu.',
      ],
      chiavi: 'privacy gdpr tracciamento account email',
      legale: { sezione: 'privacy', testo: 'Leggi l\'informativa privacy' },
    },
    {
      id: 'dati-dove', categoria: 'dati', domanda: 'Dove sono i miei progressi? Se cambio telefono?',
      risposta: [
        'Sono salvati su questo dispositivo, nel browser. Se cancelli i dati del sito o cambi dispositivo non li ritrovi da soli: puoi esportarli in un file e importarli altrove dalle Impostazioni.',
      ],
      chiavi: 'salvataggio backup esporta importa cancellare browser localstorage',
    },
    {
      id: 'dati-cookie', categoria: 'dati', domanda: 'Usate cookie o statistiche di tracciamento?',
      risposta: ['No: nessun cookie di tracciamento e nessuna statistica sul tuo uso. Il browser conserva solo i tuoi progressi e le tue preferenze (come il tema).'],
      chiavi: 'analytics tracciamento',
      legale: { sezione: 'cookie', testo: 'Leggi la pagina sui cookie' },
    },

    // ---- L'app
    {
      id: 'app-gratis', categoria: 'app', domanda: 'È davvero gratis?',
      risposta: ['Sì. Nessun pagamento, nessun abbonamento e nessuna funzione a pagamento.'],
      chiavi: 'costo prezzo pagare gratuito abbonamento',
      legale: { sezione: 'termini', testo: 'Leggi i termini d\'uso' },
    },
    {
      id: 'app-offline', categoria: 'app', domanda: 'Funziona senza internet?',
      risposta: ['Per aprire il sito serve la connessione. Una volta caricata la pagina, domande e correzioni sono già nel browser e non chiedono altro alla rete: i progressi si salvano sul dispositivo.'],
      chiavi: 'connessione rete offline installare',
    },
    {
      id: 'app-sfide', categoria: 'app', domanda: 'Come funzionano le sfide?',
      risposta: ['La sfida del giorno è la stessa per tutti. Il duello è un link che contiene la sfida: lo mandi a un amico e confrontate i risultati. Amici e classifica sono locali: contano solo chi ha giocato con te su questo dispositivo.'],
      chiavi: 'sfida duello amici classifica link condividi',
      vai: { id: 'sfide', testo: 'Apri Sfide' },
    },
    {
      id: 'app-errore', categoria: 'app', domanda: 'Ho trovato una domanda o una spiegazione sbagliata',
      risposta: ['Segnalala: dalla pagina Segnala scegli il tipo, scrivi cosa non va e ti viene preparato un testo da copiare. La segnalazione resta salvata sul dispositivo.'],
      chiavi: 'errore bug segnalare problema sbaglio',
      vai: { id: 'segnala', testo: 'Apri Segnala' },
    },
  ];
}

/** Minuscole e senza accenti: «perché» e «perche» devono trovarsi. */
export function normalizza(testo: string): string {
  return testo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Le voci che contengono TUTTE le parole cercate (nella domanda, nella risposta o nelle parole chiave), nella categoria scelta. */
export function cercaFaq(voci: readonly VoceFaq[], testo: string, categoria: CategoriaFaq | 'tutte' = 'tutte'): VoceFaq[] {
  const parole = normalizza(testo).split(' ').filter(p => p.length > 0);
  return voci.filter(v => {
    if (categoria !== 'tutte' && v.categoria !== categoria) return false;
    if (parole.length === 0) return true;
    const pagliaio = normalizza([v.domanda, ...v.risposta, v.chiavi ?? ''].join(' '));
    return parole.every(p => pagliaio.includes(p));
  });
}
