import { LEGAL_AGGIORNATO, LEGAL_SELLER, righeVenditore, type LegalDoc } from './base';

export const privacy: LegalDoc = {
  titolo: 'Informativa sulla privacy',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'Chi tratta i tuoi dati',
      paragrafi: [
        'Il titolare del trattamento, cioè chi decide come e perché si usano i tuoi dati, è il venditore di AddiOFA. Questa informativa è resa ai sensi degli articoli 13 e 14 del GDPR.',
      ],
      elenco: righeVenditore(),
    },
    {
      titolo: 'Quali dati trattiamo',
      paragrafi: [
        'Raccogliamo il meno possibile. A seconda di quello che fai:',
      ],
      elenco: [
        'Lista d\'attesa: la tua email, il tipo di percorso che hai scelto (recupero o prevenzione) e il fatto che hai dato il consenso.',
        'Acquisto del Pass, quando i pagamenti saranno attivi: email, data e importo dell\'ordine, stato del Pass. I dati della carta li gestisce il fornitore di pagamenti, non noi.',
        'Richiesta di recesso: nome, email dell\'ordine, riferimento dell\'ordine se lo scrivi, data e ora della richiesta.',
        'Progressi di studio (risposte, simulazioni, ripasso): restano sul tuo dispositivo. Nella versione in produzione, collegata a un server, vengono salvati anche lì.',
        'Statistiche d\'uso: eventi aggregati, come "diagnostico completato" o "simulazione iniziata", senza identificativi e senza cookie. Non sono collegati a te.',
        'Dati tecnici: per mostrarti la pagina e proteggere il servizio, il fornitore di hosting tratta in via tecnica dati di connessione, come l\'indirizzo IP.',
      ],
    },
    {
      titolo: 'Che cosa non raccogliamo',
      paragrafi: [
        'Non ti chiediamo matricola né codice fiscale. Non ti chiediamo l\'email del Politecnico. Non creiamo profili su di te e non vendiamo i tuoi dati a nessuno.',
      ],
    },
    {
      titolo: 'Perché li usiamo e su quale base',
      paragrafi: [
        'Ogni uso ha una base giuridica precisa:',
      ],
      elenco: [
        'Contratto (art. 6.1.b GDPR): per vendere il Pass, dartene l\'accesso, gestire il recesso e darti assistenza.',
        'Consenso (art. 6.1.a): per la lista d\'attesa e per l\'unica email che ti mandiamo quando il Pass apre. Puoi revocarlo in qualsiasi momento, senza pregiudicare quanto fatto prima.',
        'Obbligo di legge (art. 6.1.c): per la contabilità e gli obblighi fiscali che riguardano le vendite.',
        'Legittimo interesse (art. 6.1.f): per la sicurezza del servizio e per statistiche che non identificano nessuno.',
      ],
    },
    {
      titolo: 'Quanto li conserviamo',
      paragrafi: [],
      elenco: [
        'Lista d\'attesa: fino a quando ti scriviamo l\'email di apertura o ritiri il consenso; poi cancelliamo l\'email dalla lista.',
        'Dati dell\'ordine: per il tempo richiesto dagli obblighi fiscali e contabili e per difendere i nostri diritti, poi li cancelliamo.',
        'Richieste di recesso: per il tempo necessario a gestirle e a poterle documentare.',
        'Progressi sul dispositivo: finché non li cancelli tu dal browser. Sul server, finché esiste il tuo accesso o finché non chiedi la cancellazione.',
        'Statistiche: non contengono dati personali, quindi non hanno una scadenza legata a te.',
      ],
    },
    {
      titolo: 'Con chi li condividiamo',
      paragrafi: [
        'Non vendiamo i dati. Li affidiamo solo ai fornitori che servono a far funzionare il servizio, nominati responsabili del trattamento (art. 28 GDPR):',
      ],
      elenco: [
        'Cloudflare: hosting e infrastruttura del servizio.',
        'Stripe: pagamenti, quando saranno attivi.',
        'Il servizio che usiamo per inviare le email di servizio e di apertura, quando sarà attivo.',
        'Il consulente fiscale o contabile, per gli adempimenti di legge sulle vendite.',
      ],
    },
    {
      titolo: 'Trasferimenti fuori dall\'Unione europea',
      paragrafi: [
        'Alcuni fornitori, come Cloudflare e Stripe, hanno sede o sistemi negli Stati Uniti. Per questi trasferimenti ci affidiamo al Data Privacy Framework UE-USA e, come garanzia aggiuntiva, alle clausole contrattuali standard della Commissione europea.',
      ],
    },
    {
      titolo: 'I tuoi diritti',
      paragrafi: [
        'Puoi chiederci in qualsiasi momento:',
      ],
      elenco: [
        'di sapere quali dati abbiamo su di te e di averne una copia (accesso);',
        'di correggere i dati sbagliati;',
        'di cancellare i tuoi dati e il tuo account;',
        'di limitare il trattamento o di opporti;',
        'di ricevere i tuoi dati in un formato leggibile da altri programmi (portabilità);',
        'di revocare il consenso dato.',
      ],
    },
    {
      titolo: 'Come esercitarli e reclamo',
      paragrafi: [
        `Scrivi a ${LEGAL_SELLER.email}. Rispondiamo entro un mese, come prevede il GDPR.`,
        'I dati salvati sul dispositivo li controlli tu: li cancelli dalle impostazioni del browser, cancellando i dati del sito.',
        'Se ritieni che il trattamento violi la legge puoi presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      ],
    },
    {
      titolo: 'Età minima',
      paragrafi: [
        'In Italia il consenso digitale vale da 14 anni. Se hai meno di 14 anni, per iscriverti alla lista d\'attesa o comprare serve il consenso di chi esercita la responsabilità genitoriale.',
      ],
    },
    {
      titolo: 'Nessuna decisione automatizzata',
      paragrafi: [
        'Non prendiamo decisioni automatizzate che producono effetti su di te e non facciamo profilazione. La stima del quiz diagnostico serve solo a mostrarti a che punto sei.',
      ],
    },
    {
      titolo: 'Aggiornamenti',
      paragrafi: [
        'Se cambiamo il modo in cui trattiamo i dati aggiorniamo questa pagina e la data in alto. Per usi nuovi che richiedono il tuo consenso, te lo chiederemo di nuovo.',
      ],
    },
  ],
};
