import { LEGAL_AGGIORNATO, type LegalDoc } from './base';

export const cookie: LegalDoc = {
  titolo: 'Cookie e dati nel dispositivo',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        'AddiOFA non usa cookie. Non ci sono cookie di tracciamento, di profilazione o di terze parti, né strumenti di statistica: per questo non vedi nessun banner.',
      ],
    },
    {
      titolo: 'Che cosa salviamo nel dispositivo',
      paragrafi: [
        'Usiamo la memoria locale del browser (localStorage), che resta sul tuo dispositivo e non viene inviata a nessuno quando apri una pagina. Serve solo a ricordare i tuoi progressi e le tue scelte: sono dati tecnici, necessari al servizio che hai chiesto.',
        'Le chiavi principali sono:',
      ],
      elenco: [
        'ofa_polimi_app_state: progressi di studio, simulazioni, profilo, obiettivi, badge e sfide.',
        'theme: tema chiaro o scuro.',
        'sound_muted: suoni attivi o spenti.',
        'Poche altre chiavi tecniche dello stesso tipo, per esempio l\'ultimo diagnostico.',
      ],
    },
    {
      titolo: 'Come cancellarli',
      paragrafi: [
        'Dalle Impostazioni di AddiOFA puoi cancellare i dati di questo dispositivo; oppure dalle impostazioni del browser cancella i dati del sito. Cancellandoli perdi i progressi salvati: esportali prima se vuoi tenerli.',
        'Per ogni altro trattamento di dati personali vedi l\'informativa sulla privacy.',
      ],
    },
  ],
};
