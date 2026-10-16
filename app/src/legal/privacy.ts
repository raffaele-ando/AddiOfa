import { LEGAL_AGGIORNATO, type LegalDoc } from './base';

export const privacy: LegalDoc = {
  titolo: 'Informativa sulla privacy',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        'AddiOFA è un sito statico: non ha account, non ha un server che riceva i tuoi dati e non ti chiede email, nome vero, matricola o codice fiscale. Quello che fai resta nel tuo dispositivo.',
        'Non facciamo profilazione, non vendiamo dati, non usiamo strumenti di statistica e non ci sono pubblicità.',
      ],
    },
    {
      titolo: 'Che cosa resta sul tuo dispositivo',
      paragrafi: [
        'Nella memoria del browser (localStorage) salviamo, solo per farti ritrovare le cose:',
      ],
      elenco: [
        'i progressi di studio: risposte, simulazioni, ripasso, statistiche;',
        'il profilo che scegli tu (nome, corso, avatar), gli obiettivi e i badge;',
        'le sfide giocate e i nomi che hai usato per presentarti agli amici;',
        'le segnalazioni che scrivi, finché non le copi o le cancelli;',
        'le preferenze: tema chiaro o scuro, suoni.',
      ],
    },
    {
      titolo: 'Che cosa esce dal dispositivo',
      paragrafi: [
        'Niente, salvo quello che decidi tu: se condividi il link di una sfida, il link contiene la sfida, il nome che hai scelto e il tuo risultato; se esporti i progressi o copi una segnalazione, il testo finisce dove lo incolli.',
        'Per mostrarti la pagina, chi ospita il sito tratta in via tecnica i dati di connessione, come l\'indirizzo IP, nei propri registri di sicurezza. Questi dati non li vediamo e non li colleghiamo a te.',
      ],
    },
    {
      titolo: 'Base giuridica',
      paragrafi: [
        'Quello che salviamo nel tuo browser serve a darti il servizio che hai chiesto e non viene inviato a nessuno: non occorre un consenso. I dati tecnici di connessione sono trattati dal fornitore di hosting per la sicurezza del servizio (legittimo interesse, art. 6.1.f GDPR).',
      ],
    },
    {
      titolo: 'Quanto restano',
      paragrafi: [
        'I dati nel dispositivo restano finché non li cancelli tu, dalle Impostazioni di AddiOFA («Cancella i dati») o da quelle del browser. Cancellandoli perdi i progressi, a meno che tu non li abbia esportati.',
      ],
    },
    {
      titolo: 'I tuoi diritti',
      paragrafi: [
        'Poiché i dati sono solo nel tuo dispositivo, li controlli direttamente: puoi vederli, esportarli, importarli su un altro dispositivo e cancellarli quando vuoi.',
        'Se ritieni che un trattamento violi la legge puoi presentare reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it).',
      ],
    },
    {
      titolo: 'Minori',
      paragrafi: [
        'Il sito non raccoglie dati personali, quindi può essere usato anche da chi ha meno di 14 anni. Se condividi un link di sfida, scegli un nome di fantasia.',
      ],
    },
    {
      titolo: 'Aggiornamenti',
      paragrafi: [
        'Se cambia il modo in cui il sito tratta i dati, aggiorniamo questa pagina e la data in alto. Se un giorno servisse un consenso, te lo chiederemo prima.',
      ],
    },
  ],
};
