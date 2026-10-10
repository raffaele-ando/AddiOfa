import { LEGAL_AGGIORNATO, righeVenditore, type LegalDoc } from './base';

export const recesso: LegalDoc = {
  titolo: 'Diritto di recesso',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'In breve',
      paragrafi: [
        'Se compri il Pass come consumatore hai 14 giorni dalla conclusione del contratto per recedere, senza dover dare un motivo.',
        'Per i contenuti digitali, come il Pass, la legge prevede un caso in cui il diritto si perde: quando chiedi di iniziare subito e lo accetti espressamente. Le regole sono qui sotto.',
      ],
    },
    {
      titolo: 'Quando puoi recedere',
      paragrafi: [
        'Il termine è di 14 giorni e parte dal giorno in cui il contratto è concluso, cioè da quando fai l\'ordine. Recedendo non paghi penali. Le regole sono quelle degli articoli 52 e seguenti del Codice del Consumo.',
      ],
    },
    {
      titolo: 'Quando il diritto si perde',
      paragrafi: [
        'Il Pass è un contenuto digitale fornito senza supporto materiale. Per la legge (art. 59 del Codice del Consumo) il recesso è escluso solo se l\'accesso è già iniziato e ricorrono tutte e tre queste condizioni:',
      ],
      elenco: [
        'hai dato prima il consenso espresso a iniziare subito, durante il periodo di recesso;',
        'hai riconosciuto che così perdi il diritto di recesso;',
        'ti abbiamo inviato la conferma del contratto su un supporto durevole, come una email.',
      ],
    },
    {
      titolo: 'Come lo facciamo noi',
      paragrafi: [
        'Al momento dell\'ordine trovi due caselle, non preselezionate: le spunti tu. Con la prima chiedi di iniziare subito, con la seconda dichiari di sapere che così perdi il recesso. Dopo l\'acquisto ricevi per email una conferma che ripete le due cose.',
        'Se non spunti le caselle, il diritto di recesso resta intero per tutti i 14 giorni.',
      ],
    },
    {
      titolo: 'Come recedere',
      paragrafi: [
        'Puoi usare il modulo "Recedi dal contratto qui" in questa pagina: è sempre disponibile e non serve entrare in un account. Indica il tuo nome e l\'email usata per l\'ordine; il riferimento dell\'ordine è facoltativo. Poi premi "Conferma recesso".',
        'In alternativa puoi scrivere al venditore una dichiarazione chiara che vuoi recedere, ai contatti qui sotto.',
      ],
      elenco: righeVenditore(),
      modulo: true,
    },
    {
      titolo: 'Che cosa succede dopo',
      paragrafi: [
        'Appena invii il modulo vedi a schermo una ricevuta con un numero, la data e l\'ora. Quando i pagamenti sono attivi te ne mandiamo una anche per email, come prova su supporto durevole.',
        'Se il recesso è valido ti rimborsiamo il prezzo senza ritardo ingiustificato, con lo stesso mezzo di pagamento che hai usato, e il Pass termina.',
      ],
    },
    {
      titolo: 'Se non hai ancora comprato nulla',
      paragrafi: [
        'Finché i pagamenti non sono attivi il Pass non si può comprare, quindi non c\'è nessun contratto da cui recedere. Il modulo resta visibile perché la legge richiede che sia sempre disponibile, ma una richiesta inviata ora non ha un acquisto a cui riferirsi.',
        'Per uscire dalla lista d\'attesa o cancellare la tua email scrivi ai contatti indicati: non è un recesso, è la revoca del tuo consenso.',
      ],
    },
    {
      titolo: 'Recesso e garanzia',
      paragrafi: [
        'Il recesso è un diritto di legge e non dipende dal risultato del test. Nel lancio non c\'è invece una garanzia di rimborso se non superi il test (vedi i Termini).',
      ],
    },
  ],
};
