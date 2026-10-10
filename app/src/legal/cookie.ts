import { LEGAL_AGGIORNATO, type LegalDoc } from './base';

export const cookie: LegalDoc = {
  titolo: 'Cookie e statistiche',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        'Non usiamo cookie di profilazione né cookie di terze parti. Per questo non vedi un banner dei cookie.',
        'Salviamo sul tuo dispositivo solo ciò che serve a far funzionare l\'app. Le statistiche sono aggregate e non contengono dati personali.',
      ],
    },
    {
      titolo: 'Che cosa salviamo sul dispositivo',
      paragrafi: [
        'Usiamo il localStorage del browser, una memoria che resta sul tuo dispositivo e non viene inviata a nessuno quando apri una pagina. Serve solo a ricordare i tuoi progressi e le tue scelte. Sono dati tecnici, necessari al servizio che hai chiesto.',
        'Le chiavi principali sono:',
      ],
      elenco: [
        'ofa_polimi_app_state: i tuoi progressi di studio, le risposte e le simulazioni.',
        'theme: se preferisci il tema chiaro o scuro.',
        'sound_muted: se hai disattivato i suoni.',
        'Poche altre chiavi tecniche dello stesso tipo, per esempio per ricordare l\'accesso in prova al Pass o l\'iscrizione alla lista d\'attesa in modalità demo.',
      ],
    },
    {
      titolo: 'Statistiche aggregate',
      paragrafi: [
        'Contiamo alcuni eventi per capire se il servizio funziona, per esempio: diagnostico completato, pagina del Pass vista, iscrizione alla lista d\'attesa, simulazione iniziata o finita, Pass sbloccato.',
        'Gli eventi non hanno identificativi, non usano cookie e non si collegano a te né ad altri tuoi dati. Per questo non serve un consenso. Nella modalità demo restano in memoria e spariscono quando chiudi la pagina.',
      ],
    },
    {
      titolo: 'Pagamento',
      paragrafi: [
        'Quando i pagamenti saranno attivi, la pagina di pagamento sarà gestita da Stripe, che ha la sua informativa sulla privacy e sui cookie. Ti consigliamo di leggerla prima di pagare.',
      ],
    },
    {
      titolo: 'Come cancellare o bloccare i dati',
      paragrafi: [
        'Puoi cancellare i dati del sito, localStorage compreso, dalle impostazioni del browser. Cancellandoli perdi i progressi salvati sul dispositivo. Nessun cookie di profilazione da bloccare: non ne usiamo.',
        'Per ogni altro trattamento di dati personali vedi l\'Informativa sulla privacy.',
      ],
    },
  ],
};
