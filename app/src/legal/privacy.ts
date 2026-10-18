import { ECOSYSTEM } from '../config/ecosystem';
import { LEGAL_AGGIORNATO, rigaContatto, rigaTitolare, testoCancellazioneDati, type LegalDoc } from './base';
import { CONTACT_EMAIL } from '../config/offer';

const P = ECOSYSTEM.name;
const A = ECOSYSTEM.engineName;
const ID = ECOSYSTEM.accountName;
const NOI = ECOSYSTEM.rankingName;
const AG = ECOSYSTEM.agoraName;

export const privacy: LegalDoc = {
  titolo: 'Informativa sulla privacy',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        `AddiOFA si usa senza dati personali: domande, simulazioni e progressi stanno nel tuo browser e non li riceviamo. Solo se scegli tu di creare un ${ID}, di entrare nella classifica ${NOI} o di ricevere email, trattiamo i dati che servono a quella cosa e nient'altro. Non usiamo cookie di tracciamento né statistiche, non c'è pubblicità e non vendiamo dati.`,
      ],
    },
    {
      titolo: 'Chi è il titolare',
      paragrafi: [
        rigaTitolare(),
        `${P} è il progetto studentesco che pubblica AddiOFA, ${NOI}, ${A} e ${AG}. Progetto studentesco indipendente, non affiliato al Politecnico di Milano: il Politecnico non è titolare né responsabile di questi dati.`,
        ...rigaContatto(),
      ],
    },
    {
      titolo: 'Quali dati trattiamo',
      paragrafi: ['Solo questi, e solo nei casi indicati:'],
      elenco: [
        'Sempre, sul tuo dispositivo e non inviati a nessuno: progressi di studio (risposte, simulazioni, ripasso, statistiche), profilo scelto (nome, corso, avatar), obiettivi, badge, sfide e preferenze (tema, suoni).',
        `Se vuoi, sul tuo dispositivo e non inviati a nessuno: il percorso di studi (scuola, sede, livello, corso, anno), come ci hai conosciuto e il badge «studente PoliMi». Si scrivono in «${ID}» e si tolgono da lì.`,
        `Se crei un ${ID}, su ${A}: l'indirizzo email, un identificativo dell'account, il @nome utente (parte neutro, lo scegli tu) e i permessi che dai con la data. Il nome e la foto del tuo account Google non li salviamo. La dichiarazione «Ho almeno 14 anni» non viene salvata.`,
        `Se entri nella classifica ${NOI}: il tuo @nome utente, le domande imparate e il miglior punteggio in simulazione, visibili a tutti i partecipanti.`,
        `Se chiedi le email di ${P} e ${AG}: l'indirizzo che scrivi (anche personale), la data, la versione del testo che hai visto e, quando esiste, la data della conferma.`,
        `Se chiedi il badge «studente PoliMi»: l'indirizzo PoliMi serve solo a scriverti un link di verifica tramite Google (Firebase); ${A} non lo riceve e la verifica resta sul tuo dispositivo.`,
        'Dati tecnici di connessione (indirizzo IP e simili) nei registri di chi ospita il sito e il servizio; ATLAS ne conserva solo un\'impronta per un\'ora, per limitare le richieste ripetute.',
      ],
    },
    {
      titolo: 'Che cosa non raccogliamo',
      paragrafi: [
        'Nome vero, matricola, codice fiscale, telefono, indirizzo di casa, posizione, le singole risposte che dai, il contenuto delle tue sessioni di studio. Nessuno strumento di statistica o di pubblicità osserva come usi il sito.',
      ],
    },
    {
      titolo: 'Se non fornisci i dati',
      paragrafi: [
        `Nessun dato è obbligatorio per studiare. Per creare il ${ID} serve l'email; per la classifica ${NOI}, un @nome utente; per le email, un indirizzo. Senza questi dati la cosa corrispondente non si può fare, e tutto il resto funziona uguale.`,
      ],
    },
    {
      titolo: 'Perché li trattiamo e su quale base',
      paragrafi: ['Ogni dato ha uno scopo, e per ogni scopo c\'è una base giuridica:'],
      elenco: [
        `${ID}: esecuzione del servizio che chiedi (art. 6.1.b GDPR).`,
        `Classifica ${NOI}: il tuo consenso (art. 6.1.a GDPR), che ritiri con un tocco.`,
        `Email di ${P} e ${AG}: il tuo consenso (art. 6.1.a GDPR e art. 130 del Codice privacy), confermato con un link. Puoi opporti ai messaggi in ogni momento.`,
        'Sicurezza e limite delle richieste ripetute: legittimo interesse (art. 6.1.f GDPR), con dati minimi.',
        'I consensi sono facoltativi e indipendenti: non darli non toglie nessuna funzione di studio. Ritirarli non rende illecito quanto fatto prima.',
      ],
    },
    {
      titolo: 'Con chi li condividiamo',
      paragrafi: [`Non vendiamo né cediamo i dati. Possono trattarli, per conto del titolare, questi fornitori, come responsabili del trattamento secondo i loro termini di trattamento dei dati:`],
      elenco: [
        `Cloudflare: ospita il servizio ${A} e il suo database, creato con giurisdizione nell'Unione europea, e può ospitare il sito; vede i dati di connessione.`,
        `Google (Firebase Authentication): solo se scegli «Accedi con Google», «Accedi con email» o «Verifica con un link». L'accesso è eseguito da data center anche negli Stati Uniti, sulla base del Data Privacy Framework e delle clausole contrattuali tipo.`,
        `Instagram: solo se apri il profilo di ${AG} dal link; da quel momento lasci AddiOFA e valgono le regole di Instagram.`,
        `Gli altri partecipanti alla classifica vedono solo il tuo @nome utente, le domande imparate e il miglior punteggio, e solo se hai acceso la casella.`,
      ],
    },
    {
      titolo: 'Quanto restano',
      paragrafi: [
        'Sul dispositivo: finché non li cancelli (da «Project ID» › «Cancella dal dispositivo», dalle Impostazioni o dal browser).',
        `${ID}: finché non lo elimini. Punteggio ${NOI}: finché la casella è accesa; spenta, il punteggio sparisce subito. Email delle comunicazioni: finché non spegni la casella; poi l'indirizzo si cancella. Prova del consenso (data, finalità, versione del testo): finché esiste l'account, e si cancella con lui. Impronta dell'IP: un'ora.`,
      ],
    },
    {
      titolo: 'I tuoi diritti e come esercitarli',
      paragrafi: [
        'Hai diritto di accedere ai dati, correggerli, cancellarli, limitarne il trattamento, riceverli in un formato leggibile, opporti ai messaggi promozionali in ogni momento e ritirare i consensi. Ogni consenso si ritira con lo stesso tocco con cui si dà, nella stessa pagina, senza eliminare l\'account.',
        'Dentro l\'app:',
      ],
      elenco: [
        `«${NOI}»: spegni la casella e il tuo punteggio sparisce subito.`,
        `«${ID}» › «Comunicazioni»: spegni la casella e l'indirizzo si cancella.`,
        `«${ID}» › «Cambia @nome utente»: correggi il nome che si vede in classifica.`,
        `«${ID}» › «Esporta»: una copia dei dati del dispositivo e, se hai l'accesso, di quelli su ${A}.`,
        `«${ID}» › «Cancella dal dispositivo» toglie le scelte dal tuo dispositivo. Per cancellare ciò che è su ${A}: ${testoCancellazioneDati()}`,
        ...(CONTACT_EMAIL ? [`Se pensi che qualcuno abbia usato il tuo indirizzo senza il tuo consenso, scrivi a ${CONTACT_EMAIL}.`] : []),
        'Reclamo: puoi rivolgerti al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      ],
    },
    {
      titolo: 'Email e verifica',
      paragrafi: [
        `Per entrare nel ${ID} con l'email, e per il badge «studente PoliMi», ti scriviamo un link da aprire dallo stesso browser: finché non lo apri l'indirizzo non è verificato e non conta come tale. Per le comunicazioni la conferma funziona allo stesso modo: l'invio dei link di conferma oggi non è collegato, quindi finché non lo è nessuna email di ${P} parte, anche se la casella è accesa. Scrivi solo il tuo indirizzo.`,
      ],
    },
    {
      titolo: 'Sicurezza',
      paragrafi: [
        `Le comunicazioni con ${A} usano una connessione cifrata (HTTPS). I dati sono accessibili solo al titolare, con un segreto che non è nel sito. Nessun sistema è perfetto: se avvenisse una violazione che ti riguarda, ti avvisiamo come richiede la legge.`,
      ],
    },
    {
      titolo: 'Minori',
      paragrafi: [
        `Per creare il ${ID} e dare i consensi devi avere almeno 14 anni; sotto serve l'autorizzazione di chi esercita la responsabilità genitoriale. Se non sei sicuro, chiedi a un adulto o non attivare nulla: AddiOFA funziona uguale. Se condividi un link di sfida, scegli un nome di fantasia.`,
      ],
    },
    {
      titolo: 'Aggiornamenti',
      paragrafi: [
        'Se cambiano i dati raccolti o gli scopi, aggiorniamo questa pagina e la data in alto, e ti chiediamo di nuovo i consensi interessati. Il testo dei consensi ha una versione, registrata insieme alla tua scelta.',
      ],
    },
  ],
};
