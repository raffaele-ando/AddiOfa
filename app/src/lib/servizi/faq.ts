// «Guida e FAQ»: testi veri, presi da config/offer.ts. Nessuna promessa che non si possa mantenere:
// pagamenti spenti e Pass in prova sono dichiarati. Cercare e filtrare sono funzioni pure.
import type { LegalSection } from '../../types';
import {
  DISCLAIMER, FEATURE_FLAGS, FORMATS, FREE_LIMITS, INVITE, OFA_RULES_NOTE, PASS, PAYMENTS_ENABLED, REAL_TEST_PASS_MARK,
  REAL_TEST_QUESTIONS, RETAKE_COST_EUR, OFA_CONSEQUENCES, formatEur, currentPriceEur, isLaunchPrice,
} from '../../config/offer';
import { ECOSYSTEM } from '../../config/ecosystem';

export type CategoriaFaq = 'test' | 'pass' | 'dati' | 'app';

export const CATEGORIE_FAQ: readonly { id: CategoriaFaq; nome: string }[] = [
  { id: 'test', nome: 'Il test' },
  { id: 'pass', nome: 'Il Pass e i pagamenti' },
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
  vai?: { id: string; testo: string };
}

const prezzo = (): string => {
  const ora = currentPriceEur();
  return isLaunchPrice()
    ? `${formatEur(ora)} fino al ${new Date(`${PASS.launchUntil}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}, poi ${formatEur(PASS.priceEur)}`
    : formatEur(ora);
};

/** Le voci della guida. Dipendono dagli interruttori di config/offer.ts: se cambiano, cambiano anche le risposte. */
export function vociFaq(): VoceFaq[] {
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
        `${FORMATS.ente.summary} È il formato che l'app usa nelle simulazioni.`,
        FORMATS.ente.notes,
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
        'Il riconoscimento di una certificazione e l\'esito di un test già sostenuto si gestiscono con il Politecnico, non con l\'app: AddiOFA non li verifica e per studiare non ti chiede nessuna email istituzionale.',
        OFA_RULES_NOTE,
      ],
      chiavi: 'gia sostenuto certificazione ielts cambridge esonero email polimi',
    },
    {
      id: 'stima-cosa', categoria: 'test', domanda: 'La probabilità che vedo è una promessa?',
      risposta: [
        `No. È una stima, calcolata sulle tue risposte: la probabilità di fare almeno ${REAL_TEST_PASS_MARK} risposte esatte su ${REAL_TEST_QUESTIONS}. Con poche risposte è approssimativa e non dice come andrà il test vero; si affina con le simulazioni.`,
        'Nell\'Analisi del livello vedi come è calcolata e tra quali valori può stare.',
      ],
      chiavi: 'percentuale stima probabilita superare intervallo',
      vai: { id: 'atlas-analisi', testo: 'Apri l\'Analisi del livello' },
    },
    {
      id: 'test-da-dove', categoria: 'test', domanda: 'Da dove comincio?',
      risposta: [
        `Dal quiz diagnostico: ${FREE_LIMITS.diagnostic} domande, circa 3 minuti. Ti dà una prima stima e ti dice quali argomenti guardare. Poi ripasso sugli errori e, quando ti senti pronto, una simulazione.`,
      ],
      chiavi: 'diagnostico iniziare partire primo passo',
    },

    // ---- Il Pass e i pagamenti
    {
      id: 'pass-cose', categoria: 'pass', domanda: 'Che cos\'è il Pass AddiOFA?',
      risposta: [
        `${PASS.summary} Vale ${PASS.validMonths} mesi dall'attivazione.`,
        `Comprende: ${PASS.features.map(f => f.charAt(0).toLowerCase() + f.slice(1)).join('; ')}.`,
      ],
      chiavi: 'abbonamento una tantum cosa comprende',
    },
    {
      id: 'pass-gratis', categoria: 'pass', domanda: 'Cosa posso fare senza pagare?',
      risposta: [
        `Il diagnostico da ${FREE_LIMITS.diagnostic} domande con la probabilità stimata, il ripasso su un nucleo di circa ${FREE_LIMITS.coreQuestions} domande, ${FREE_LIMITS.freeSimulations === 1 ? 'una simulazione completa' : `${FREE_LIMITS.freeSimulations} simulazioni complete`} e ${FREE_LIMITS.freeTheoryTopics === 1 ? 'una scheda di teoria' : `${FREE_LIMITS.freeTheoryTopics} schede di teoria`}. Non serve un account.`,
      ],
      chiavi: 'gratuito free senza account',
    },
    {
      id: 'pass-pagamenti', categoria: 'pass', domanda: 'Posso comprare il Pass adesso?',
      risposta: PAYMENTS_ENABLED
        ? [`Sì: il Pass costa ${prezzo()}, con un solo pagamento.`]
        : [
            'Non ancora: al momento i pagamenti non sono attivi e il pulsante del Pass porta alla lista d\'attesa.',
            `Il prezzo previsto è ${prezzo()}. Nelle versioni dimostrative puoi sbloccare un «Pass in prova»: non costa nulla e non è un acquisto.`,
          ],
      chiavi: 'prezzo costo quanto costa acquisto pagare stripe carta lista attesa prova',
    },
    {
      id: 'pass-abbonamento', categoria: 'pass', domanda: 'È un abbonamento? Si rinnova da solo?',
      risposta: ['No: è un pagamento unico, senza rinnovo automatico. Alla scadenza dei mesi di validità decidi tu se rinnovare.'],
      chiavi: 'rinnovo scadenza disdetta',
    },
    {
      id: 'pass-recesso', categoria: 'pass', domanda: 'Posso recedere dall\'acquisto?',
      risposta: [
        'Il diritto di recesso previsto dalla legge per chi compra da consumatore è di 14 giorni, con le eccezioni per i contenuti digitali spiegate nella pagina dedicata.',
        PAYMENTS_ENABLED ? 'Le condizioni complete sono nei testi legali.' : 'Al momento i pagamenti non sono attivi, quindi non c\'è ancora nulla da comprare.',
        'Le pagine legali sono bozze in attesa di revisione di un professionista.',
      ],
      chiavi: 'rimborso restituzione soldi indietro',
      legale: { sezione: 'recesso', testo: 'Leggi la pagina sul recesso' },
    },
    {
      id: 'pass-garanzia', categoria: 'pass', domanda: 'C\'è una garanzia «soddisfatti o rimborsati»?',
      risposta: [FEATURE_FLAGS.guarantee
        ? 'Sì, con condizioni precise: sono scritte per intero accanto al prezzo e l\'app le misura in Statistiche.'
        : 'Oggi no: non c\'è nessuna garanzia di rimborso legata all\'esito del test. Se in futuro ci sarà, le condizioni saranno scritte per intero accanto al prezzo.'],
      chiavi: 'garanzia rimborso esito',
    },
    {
      id: 'pass-inviti', categoria: 'pass', domanda: 'Posso avere il Pass gratis invitando dei compagni?',
      risposta: [
        `È la regola della pagina Inviti: il Pass diventa gratuito quando ${INVITE.required} compagni, con la verifica prevista, finiscono il diagnostico. Conta finirlo, non il punteggio. Chi usa il tuo codice ha il ${INVITE.inviteeDiscountPct} % di sconto.`,
        'Nelle versioni dimostrative la verifica non è attiva e non si sblocca nessun Pass.',
      ],
      chiavi: 'inviti codice amici compagni sconto',
    },

    // ---- I tuoi dati
    {
      id: 'dati-raccolti', categoria: 'dati', domanda: 'Che dati raccogliete?',
      risposta: [
        'Il meno possibile: niente matricola, niente codice fiscale, niente email del Politecnico. I progressi di studio restano sul tuo dispositivo; l\'email serve solo se entri in lista d\'attesa o compri il Pass. Non vendiamo i dati.',
      ],
      chiavi: 'privacy gdpr tracciamento cookie',
      legale: { sezione: 'privacy', testo: 'Leggi l\'informativa privacy' },
    },
    {
      id: 'dati-dove', categoria: 'dati', domanda: 'Dove sono i miei progressi? Se cambio telefono?',
      risposta: [
        'Sono salvati su questo dispositivo, nel browser. Se cancelli i dati del sito o cambi dispositivo non li ritrovi da soli: puoi esportarli e importarli dalle Impostazioni (nelle versioni dimostrative l\'esportazione non è disponibile).',
      ],
      chiavi: 'salvataggio backup esporta importa cancellare browser localstorage',
    },
    {
      id: 'dati-projectid', categoria: 'dati', domanda: `Cos'è il ${ECOSYSTEM.accountName} e devo averlo?`,
      risposta: [
        `No, non serve per studiare. È un account facoltativo, per chi vorrà partecipare a ${ECOSYSTEM.rankingName} o collegare più app. ${FEATURE_FLAGS.projectId ? 'Si attiva solo se lo scegli, e solo fuori dalle versioni dimostrative.' : 'Oggi non è attivo in AddiOFA.'} Nella schermata dedicata c'è scritto cosa condividerebbe e cosa no.`,
      ],
      chiavi: 'login accesso account google collegamento',
      vai: { id: 'projectid', testo: `Cos'è il ${ECOSYSTEM.accountName}` },
    },
    {
      id: 'dati-cookie', categoria: 'dati', domanda: 'Usate cookie o statistiche di tracciamento?',
      risposta: ['Le statistiche sono senza identificativi né cookie: contano eventi come «diagnostico finito», non persone. Il dettaglio è nella pagina sui cookie, che è una bozza da rivedere.'],
      chiavi: 'analytics tracciamento',
      legale: { sezione: 'cookie', testo: 'Leggi la pagina sui cookie' },
    },

    // ---- L'app
    {
      id: 'app-offline', categoria: 'app', domanda: 'Funziona senza internet?',
      risposta: ['I progressi già salvati restano sul dispositivo anche se cade la connessione. Alcune funzioni hanno bisogno della rete (per esempio le domande servite dal server, la verifica degli inviti, la lista d\'attesa e i pagamenti): se sei offline l\'app te lo dice e riprendi quando torna la connessione.'],
      chiavi: 'connessione rete offline pwa installare',
    },
    {
      id: 'app-errore', categoria: 'app', domanda: 'Ho trovato una domanda o una spiegazione sbagliata',
      risposta: ['Segnalala: dalla pagina Segnala scegli il tipo, scrivi cosa non va e ti viene preparato un testo da copiare. La segnalazione resta salvata sul dispositivo; l\'app non ha ancora un canale che la invii da solo.'],
      chiavi: 'errore bug segnalare problema sbaglio',
      vai: { id: 'segnala', testo: 'Apri Segnala' },
    },
    {
      id: 'app-noi-agora', categoria: 'app', domanda: `Cosa sono ${ECOSYSTEM.engineName}, ${ECOSYSTEM.rankingName} e Agorà?`,
      risposta: [
        `${ECOSYSTEM.engineName} è il nome dell'algoritmo di studio che calcola le stime e il ripasso. ${ECOSYSTEM.rankingName} sarà la classifica per chi sceglie di partecipare; Agorà un forum degli studenti. ${FEATURE_FLAGS.leaderboard ? 'Agorà non è ancora attivo dentro AddiOFA.' : `Oggi ${ECOSYSTEM.rankingName} e Agorà non sono attivi dentro AddiOFA.`}`,
      ],
      chiavi: 'classifica forum community ecosistema project',
      vai: { id: 'esplora', testo: 'Apri Esplora' },
    },
  ];
}

/** Minuscole e senza accenti: «perché» e «perche» devono trovarsi. */
export function normalizza(testo: string): string {
  return testo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
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
