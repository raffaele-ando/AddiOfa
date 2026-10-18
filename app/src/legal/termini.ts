import { ECOSYSTEM } from '../config/ecosystem';
import { AVVERTENZA_INDIPENDENZA, LEGAL_AGGIORNATO, rigaContatto, type LegalDoc } from './base';

const P = ECOSYSTEM.name;
const A = ECOSYSTEM.engineName;
const ID = ECOSYSTEM.accountName;

export const termini: LegalDoc = {
  titolo: 'Termini di uso',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'Che cos\'è AddiOFA',
      paragrafi: [
        'AddiOFA è un sito gratuito per esercitarsi al test d\'inglese dell\'OFA: domande a scelta multipla con spiegazione in italiano, simulazioni, schede di teoria, frasi utili e un prontuario. Non si paga nulla e non ci sono funzioni a pagamento.',
        'Il quiz diagnostico calcola, dalle tue risposte, una stima indicativa della probabilità di superare il test. È una stima: non è una previsione e non è una promessa.',
      ],
    },
    {
      titolo: 'Chi lo pubblica',
      paragrafi: [
        `AddiOFA fa parte di ${P}, insieme a NOI, ${A} e Agorà: ${P} è il progetto studentesco che lo pubblica. ${A} è il servizio che custodisce l'account e la classifica, NOI è la classifica, Agorà è la pagina di ${P} per gli studenti del Politecnico, il ${ID} è l'account facoltativo.`,
        ...rigaContatto(),
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
        'Puoi usare il sito quanto vuoi, per studiare: tutte le domande, le schede di teoria e le simulazioni sono aperte. Non ti chiediamo dati per studiare. Project ID, classifica NOI e le email di Project sono facoltativi e si attivano solo se lo scegli.',
        'I tuoi progressi, il profilo, gli obiettivi e le sfide restano nel browser di questo dispositivo. Se cancelli i dati del sito o cambi dispositivo li perdi, a meno che tu non li abbia esportati dalle Impostazioni.',
      ],
    },
    {
      titolo: 'Il tuo indirizzo email',
      paragrafi: [
        'Se crei un Project ID, scrivi il tuo indirizzo, non quello di un\'altra persona.',
        'Come trattiamo i dati lo dice l\'informativa sulla privacy; chi vuole può cambiarli o cancellarli da «Project ID».',
      ],
    },
    {
      titolo: `${ID}, NOI e Agorà`,
      paragrafi: [
        `Il ${ID} è facoltativo e serve per entrare in NOI e per ricevere le email di ${P}. Per crearlo devi avere almeno 14 anni. Entrare nella classifica NOI è una casella a parte, spenta di partenza: chi entra è visibile con il @nome utente, le domande imparate e il miglior punteggio. Uscire dalla classifica o dalle comunicazioni non richiede di eliminare il ${ID}.`,
        'Scegli un @nome utente che non offenda nessuno: ci riserviamo di togliere dalla classifica chi non lo fa. I punteggi li invia l\'app e non sono controllati: la classifica è un gioco, non una prova di merito.',
        'Agorà è su Instagram: aprendo il suo profilo lasci AddiOFA e valgono le regole di Instagram.',
      ],
    },
    {
      titolo: 'Sfide e link',
      paragrafi: [
        'Il duello con un amico passa da un link che contiene la sfida e il nome che hai scelto. Chi riceve il link vede quel nome e il tuo risultato: condividilo solo con chi vuoi. La classifica tra amici conta solo le persone che hanno giocato con te su questo dispositivo.',
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
