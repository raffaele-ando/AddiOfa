import { ECOSYSTEM } from '../config/ecosystem';
import { LEGAL_AGGIORNATO, descrizioneTitolare, rigaContatto, testoCancellazioneIscrizione, type LegalDoc } from './base';
import { CONTACT_EMAIL } from '../config/offer';

const P = ECOSYSTEM.name;
const A = ECOSYSTEM.engineName;
const ID = ECOSYSTEM.accountName;

export const privacy: LegalDoc = {
  titolo: 'Informativa sulla privacy',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        `AddiOFA si usa senza account: domande, simulazioni e progressi stanno nel tuo browser. All'inizio ti chiediamo la tua email del Politecnico (obbligatoria: il nome lo ricaviamo dall'email) e che cosa studi (scuola, sede, livello, corso, anno), e come ci hai conosciuto: questi dati vengono inviati ad ${A}, il servizio di ${P}, appena possibile. Chiediamo anche tre consensi facoltativi, sempre spenti finché non li accendi tu.`,
        `Non usiamo cookie di tracciamento né strumenti di statistica, non ci sono pubblicità, non vendiamo dati e non facciamo profilazione commerciale senza il tuo consenso. Il ${ID} (accesso con Google) è facoltativo.`,
      ],
    },
    {
      titolo: 'Chi è il titolare',
      paragrafi: [
        `Titolare del trattamento: ${descrizioneTitolare()}. ${P} è il progetto studentesco che pubblica AddiOFA, NOI, ${A} e Agorà.`,
        'Progetto studentesco indipendente, non affiliato al Politecnico di Milano: il Politecnico non è titolare né responsabile di questi dati.',
        ...rigaContatto(),
      ],
    },
    {
      titolo: 'Quali dati trattiamo',
      paragrafi: ['Solo questi, e solo nei casi indicati:'],
      elenco: [
        'Sempre, sul tuo dispositivo e non inviati a nessuno: progressi di studio (risposte, simulazioni, ripasso, statistiche), profilo scelto (nome, corso, avatar), obiettivi, badge, sfide e preferenze (tema, suoni).',
        `Con la registrazione, inviati ad ${A}: l'email del Politecnico (controllata nel formato e nel dominio; «verificata» solo se apri il link di verifica), il nome che ricaviamo dall'email (per esempio nome.cognome@… diventa «Nome Cognome»: lo puoi correggere), il percorso di studi (scuola, sede, livello, corso, anno), come ci hai conosciuto (gruppo o chat, Instagram, amici, altro); i tre consensi facoltativi con data e versione del testo che hai visto.`,
        `Se scegli «Accedi con Google» (${ID}): nome, foto ed email del tuo account Google, un identificativo del ${ID}, il @nome utente, i permessi che concedi con il loro registro (concessione, modifica, revoca, con data).`,
        'Se aderisci alla classifica NOI: il tuo @nome utente, le domande imparate e il miglior punteggio in simulazione, visibili agli altri partecipanti.',
        'Dati tecnici di connessione (indirizzo IP e simili) nei registri di chi ospita il sito e il servizio; ATLAS ne conserva solo un\'impronta per un\'ora, per limitare le richieste ripetute.',
      ],
    },
    {
      titolo: 'Che cosa non raccogliamo',
      paragrafi: [
        'Matricola, codice fiscale, telefono, indirizzo di casa, posizione, le singole risposte che dai, il contenuto delle tue sessioni di studio. Nessuno strumento di statistica o di pubblicità osserva come usi il sito.',
      ],
    },
    {
      titolo: 'Perché li trattiamo e su quale base',
      paragrafi: ['Ogni dato ha uno scopo, e per ogni scopo c\'è una base giuridica:'],
      elenco: [
        `Creare e tenere la tua iscrizione e, se lo scegli, il ${ID}: esecuzione del servizio che chiedi (art. 6.1.b GDPR).`,
        'Conoscere in forma aggregata chi usa AddiOFA (per esempio quante persone per corso e sede), senza usare i dati per decisioni su di te: legittimo interesse del titolare (art. 6.1.f GDPR). Puoi opporti in ogni momento.',
        `Classifica NOI: solo se dai il consenso (art. 6.1.a GDPR), come permesso del ${ID} o con la casella dell'iscrizione. Personalizzazione ${A}: solo con consenso, che puoi ritirare.`,
        `Messaggi da ${P} e Agorà all'indirizzo che hai indicato: solo se dai il consenso (art. 6.1.a GDPR). Senza consenso non ti scriviamo.`,
        'Sicurezza e limite delle richieste ripetute: legittimo interesse (art. 6.1.f GDPR).',
        'I consensi sono facoltativi e indipendenti: non darli non toglie nessuna funzione di studio. Ritirarli non rende illecito quanto fatto prima.',
      ],
    },
    {
      titolo: 'Con chi li condividiamo',
      paragrafi: ['Non vendiamo né cediamo i dati. Possono trattarli, per conto del titolare, questi fornitori:'],
      elenco: [
        `Cloudflare: ospita il servizio ${A} e il suo database (regione Europa occidentale) e può ospitare il sito; vede i dati di connessione.`,
        `Google (Firebase Authentication): solo se scegli «Accedi con Google» (per provare che l'account è tuo) o «Verifica con un link» (per scriverti un link all'indirizzo che hai indicato e provare che è tuo; la verifica resta sul tuo dispositivo e ${A} non la riceve). Il trattamento può comportare un trasferimento fuori dallo Spazio economico europeo, con le garanzie previste dal GDPR.`,
        'Instagram: solo se apri il profilo di Agorà dal link; da quel momento lasci AddiOFA e valgono le regole di Instagram.',
        'Gli altri partecipanti alla classifica vedono solo il tuo @nome utente, le domande imparate e il miglior punteggio, e solo se hai aderito.',
      ],
    },
    {
      titolo: 'Quanto restano',
      paragrafi: [
        'Sul dispositivo: finché non li cancelli (da «Project ID» › «Cancella dal dispositivo», dalle Impostazioni o dal browser).',
        `Su ${A}: l'iscrizione e il suo registro dei consensi restano finché non vengono cancellati su tua richiesta o con l'eliminazione del ${ID}; l'impronta delle richieste dopo un'ora. Non c'è una cancellazione automatica per inattività.`,
      ],
    },
    {
      titolo: 'I tuoi diritti e come esercitarli',
      paragrafi: [
        'Hai diritto di accedere ai dati, correggerli, cancellarli, limitarne il trattamento, riceverli in un formato leggibile, opporti e ritirare i consensi in ogni momento. Entro un mese rispondiamo a ogni richiesta.',
        'Dentro l\'app:',
      ],
      elenco: [
        '«Project ID» › «Esporta»: una copia dei dati del dispositivo e, se hai l\'accesso, di quelli su ATLAS.',
        '«Project ID» › «Modifica»: correggi email, nome, percorso di studi, come ci hai conosciuto e consensi; salvando di nuovo l\'iscrizione si aggiorna e il cambio dei consensi viene registrato. Se l\'iscrizione è collegata al Project ID, da qui si cambiano percorso di studi e come ci hai conosciuto, e i permessi si ritirano uno per uno nella stessa pagina; email, nome e i consensi dell\'iscrizione (anche quello ai messaggi) si ritirano eliminando il Project ID.',
        `«Project ID» › «Cancella dal dispositivo» toglie i dati dal tuo dispositivo. Per cancellare ciò che è già su ${A}: ${testoCancellazioneIscrizione()}`,
        ...(CONTACT_EMAIL ? [`Se pensi che qualcuno abbia usato il tuo indirizzo senza il tuo consenso, scrivi a ${CONTACT_EMAIL}: l'iscrizione si cancella dopo aver verificato la richiesta.`] : []),
        'Reclamo: puoi rivolgerti al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      ],
    },
    {
      titolo: 'Email non verificata',
      paragrafi: [
        'L\'email del Politecnico è controllata nel formato e nel dominio, e questo non prova che l\'indirizzo sia tuo: per questo la chiamiamo «non verificata». Dove la versione del sito lo offre, «Verifica con un link» ti scrive un link da aprire: solo dopo averlo aperto, per lo stesso indirizzo, l\'etichetta cambia in «verificata» (sul tuo dispositivo; ATLAS continua a registrarla come non verificata). Nessun diritto o funzione di studio dipende da questo. Scrivi solo il tuo indirizzo.',
      ],
    },
    {
      titolo: 'Sicurezza',
      paragrafi: [
        `Le comunicazioni con ${A} usano una connessione cifrata (HTTPS). I dati delle iscrizioni sono accessibili solo al titolare, con un segreto che non è nel sito. Nessun sistema è perfetto: se avvenisse una violazione che ti riguarda, ti avvisiamo come richiede la legge.`,
      ],
    },
    {
      titolo: 'Minori',
      paragrafi: [
        'L\'iscrizione è pensata per chi è iscritto o sta per iscriversi al Politecnico. Per iscriverti e dare i consensi devi avere almeno 14 anni; sotto questa età serve il consenso di chi esercita la responsabilità genitoriale. Se condividi un link di sfida, scegli un nome di fantasia.',
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
