import { ECOSYSTEM } from '../config/ecosystem';
import { LEGAL_AGGIORNATO, type LegalDoc } from './base';

export const cookie: LegalDoc = {
  titolo: 'Cookie e dati nel dispositivo',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        'AddiOFA non usa cookie di tracciamento, di profilazione o di terze parti, né strumenti di statistica o pubblicità: per questo non vedi nessun banner. Salva alcune cose nella memoria del browser, solo per farti ritrovare ciò che hai fatto.',
      ],
    },
    {
      titolo: 'Che cosa salviamo nel dispositivo',
      paragrafi: [
        'Usiamo la memoria locale del browser (localStorage), che resta sul tuo dispositivo e non viene inviata a nessuno quando apri una pagina. Sono dati tecnici, necessari al servizio che hai chiesto. Le chiavi principali sono:',
      ],
      elenco: [
        'ofa_polimi_app_state: progressi di studio, simulazioni, profilo, obiettivi, badge, sfide e i dati della tua registrazione (nome, email, corso, sede, provenienza, consensi).',
        `addiofa_progetto_coda: lo stato dell'invio dell'iscrizione a ${ECOSYSTEM.engineName} («inviata» o «in attesa di collegamento»), con i dati da inviare finché non sono partiti.`,
        'theme: tema chiaro o scuro.',
        'sound_muted: suoni attivi o spenti.',
        'Poche altre chiavi tecniche dello stesso tipo, per esempio l\'ultimo diagnostico.',
      ],
    },
    {
      titolo: 'Se accedi con Google',
      paragrafi: [
        `Solo se scegli «Accedi con Google» per il ${ECOSYSTEM.accountName}, la finestra di accesso è di Google e vale la sua informativa; Firebase salva nel browser (IndexedDB) i dati dell'accesso per ricordarti. Sono dati tecnici necessari all'accesso che hai chiesto. Esci dall'account per cancellarli.`,
      ],
    },
    {
      titolo: 'Come cancellarli',
      paragrafi: [
        'Da «Project ID» › «Cancella dal dispositivo» togli i dati della registrazione e il collegamento; dalle Impostazioni di AddiOFA cancelli tutti i dati di questo dispositivo; oppure dalle impostazioni del browser cancella i dati del sito. Cancellandoli perdi i progressi salvati: esportali prima se vuoi tenerli.',
        'Per ogni altro trattamento di dati personali vedi l\'informativa sulla privacy.',
      ],
    },
  ],
};
