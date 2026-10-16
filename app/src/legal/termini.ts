import { AVVERTENZA_INDIPENDENZA, LEGAL_AGGIORNATO, type LegalDoc } from './base';

export const termini: LegalDoc = {
  titolo: 'Termini di uso',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'Che cos\'è AddiOFA',
      paragrafi: [
        'AddiOFA è un sito gratuito per esercitarsi al test d\'inglese dell\'OFA: domande a scelta multipla con spiegazione in italiano, simulazioni, schede di teoria, frasi utili e un prontuario. Non serve nessun account e non si paga nulla.',
        'Il quiz diagnostico calcola, dalle tue risposte, una stima indicativa della probabilità di superare il test. È una stima: non è una previsione e non è una promessa.',
      ],
    },
    {
      titolo: 'Che cosa non è',
      paragrafi: [
        AVVERTENZA_INDIPENDENZA,
        'Il nome del Politecnico compare solo per dire a quale test ci si prepara. Non garantiamo che usando AddiOFA supererai il test, né che le domande siano uguali a quelle del test vero.',
        'Le regole dell\'OFA e del test (date, formato, soglie, enti, costi) possono cambiare. Verificale sempre sul sito dell\'Ateneo: se qualcosa qui differisce, vale quello che dice il Politecnico.',
      ],
    },
    {
      titolo: 'Come si usa',
      paragrafi: [
        'Puoi usare il sito quanto vuoi, per studiare. Tutte le domande, le schede di teoria e le simulazioni sono aperte.',
        'I tuoi progressi, il profilo, gli obiettivi e le sfide restano nel browser di questo dispositivo: non c\'è un server che li conservi. Se cancelli i dati del sito o cambi dispositivo li perdi, a meno che tu non li abbia esportati dalle Impostazioni.',
      ],
    },
    {
      titolo: 'Sfide e link',
      paragrafi: [
        'Il duello con un amico passa da un link che contiene la sfida e il nome che hai scelto. Chi riceve il link vede quel nome e il tuo risultato: condividilo solo con chi vuoi. Classifica e amici sono locali: contano solo le persone che hanno giocato con te su questo dispositivo.',
      ],
    },
    {
      titolo: 'Contenuti',
      paragrafi: [
        'Domande, spiegazioni e schede di teoria sono scritte per l\'esercizio. Puoi usarle per studiare e condividere un link al sito. Non puoi presentarle come materiale ufficiale del Politecnico né venderle.',
      ],
    },
    {
      titolo: 'Errori e responsabilità',
      paragrafi: [
        'Il servizio è offerto così com\'è, senza garanzie sull\'esito del test. Facciamo il possibile perché domande e spiegazioni siano corrette, ma può capitare un errore: se ne trovi uno, usa «Segnala» nelle Impostazioni.',
        'Nulla in questi termini limita i diritti che la legge ti riconosce.',
      ],
    },
    {
      titolo: 'Modifiche ai termini',
      paragrafi: [
        'Possiamo aggiornare questi termini, per esempio quando cambia il servizio o la legge. La data in cima indica l\'ultima versione.',
      ],
    },
    {
      titolo: 'Legge applicabile',
      paragrafi: [
        'Questi termini sono regolati dalla legge italiana, senza togliere al consumatore le tutele inderogabili del Paese in cui risiede.',
      ],
    },
  ],
};
