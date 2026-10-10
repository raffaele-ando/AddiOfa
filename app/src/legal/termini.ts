import { FREE_FEATURES, PASS } from '../config/offer';
import { LEGAL_AGGIORNATO, righeVenditore, type LegalDoc } from './base';

const eur = (n: number) => `${n.toFixed(2).replace('.', ',')} €`;
const dataLunga = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

export const termini: LegalDoc = {
  titolo: 'Termini di vendita e di uso',
  aggiornato: LEGAL_AGGIORNATO,
  sezioni: [
    {
      titolo: 'Chi siamo',
      paragrafi: [
        'AddiOFA è un servizio per esercitarsi al test d\'inglese dell\'OFA. Lo offre il venditore indicato qui sotto, a cui puoi scrivere per qualsiasi domanda su questi termini.',
      ],
      elenco: righeVenditore(),
    },
    {
      titolo: 'Che cos\'è AddiOFA',
      paragrafi: [
        'AddiOFA è uno strumento di studio: domande a scelta multipla con spiegazione in italiano, simulazioni del test e schede di teoria. Serve a prepararti, non a sostituire lo studio né il test vero.',
        'Il quiz diagnostico calcola, dalle tue risposte, una stima indicativa della probabilità di superare il test. È una stima: non è una previsione e non è una promessa.',
      ],
    },
    {
      titolo: 'Che cosa non è',
      paragrafi: [
        'AddiOFA è un prodotto indipendente, non affiliato né approvato dal Politecnico di Milano. Il nome del Politecnico compare solo per dire a quale test ci si prepara.',
        'Non garantiamo che usando AddiOFA supererai il test. Le domande sono scritte per esercitarsi: non promettiamo che siano uguali a quelle del test vero.',
        'Le regole dell\'OFA e del test (date, formato, soglie, enti, costi) possono cambiare. Verificale sempre sul sito dell\'Ateneo: se qualcosa qui differisce, vale quello che dice il Politecnico.',
      ],
    },
    {
      titolo: 'Parte gratuita e Pass AddiOFA',
      paragrafi: [
        'Una parte di AddiOFA è gratuita e resta tale. Comprende:',
      ],
      elenco: FREE_FEATURES,
    },
    {
      titolo: 'Che cosa include il Pass',
      paragrafi: [
        `Il ${PASS.name} sblocca il resto del servizio per ${PASS.validMonths} mesi dall'attivazione. Comprende:`,
      ],
      elenco: PASS.features.filter((f) => !/^Valido/.test(f)),
    },
    {
      titolo: 'Prezzo e pagamento',
      paragrafi: [
        `Il pagamento è uno solo, una tantum. Prezzo previsto: ${eur(PASS.launchPriceEur)} fino al ${dataLunga(PASS.launchUntil)}, poi ${eur(PASS.priceEur)}.`,
        'Il prezzo che paghi è quello scritto nel riepilogo prima dell\'ordine, con l\'IVA inclusa se dovuta. Prima di ordinare vedi prezzo, durata e condizioni; il pulsante finale dice chiaramente che l\'ordine comporta l\'obbligo di pagare.',
        'Il pagamento passa da un fornitore di pagamenti esterno (Stripe): i dati della carta non arrivano a noi.',
        'Non c\'è nessun rinnovo automatico e nessun abbonamento. Alla scadenza dei 12 mesi non ti addebitiamo nulla: il Pass finisce e resta la parte gratuita.',
      ],
    },
    {
      titolo: 'Dove siamo oggi: pagamenti e lista d\'attesa',
      paragrafi: [
        'Finché non lo annunciamo i pagamenti non sono attivi e il Pass non si può comprare. Il pulsante d\'acquisto porta alla lista d\'attesa.',
        'Iscriverti alla lista d\'attesa non è un ordine, non ti impegna a comprare e non ti dà diritto a prezzi o sconti. Se acconsenti, ti scriviamo una sola email quando il Pass apre.',
        'Quando i pagamenti partiranno aggiorneremo questa pagina: i termini valgono per gli acquisti fatti da quel momento.',
      ],
    },
    {
      titolo: 'Modalità demo',
      paragrafi: [
        'Nella versione dimostrativa puoi usare "Sblocca il Pass in prova", senza pagare. In questa modalità il blocco del Pass è solo grafico: le domande si trovano nella pagina stessa, quindi non è una protezione. È una prova di come funziona il Pass, senza valore di acquisto.',
        'In demo i tuoi dati (progressi, preferenze, lista d\'attesa) restano sul tuo dispositivo e non vengono inviati a un server. Se cancelli i dati del sito dal browser, spariscono.',
      ],
    },
    {
      titolo: 'Rimborsi e recesso',
      paragrafi: [
        'Nel lancio non offriamo una garanzia di rimborso, nemmeno in caso di mancato superamento del test.',
        'Hai però i diritti che la legge ti riconosce come consumatore, incluso il diritto di recesso entro 14 giorni, con le regole speciali dei contenuti digitali. Le trovi nella scheda Recesso, insieme al modulo per esercitarlo.',
      ],
    },
    {
      titolo: 'Uso dell\'account e dei contenuti',
      paragrafi: [
        'Il Pass è personale: puoi usarlo tu, per studiare. Non puoi cederlo, rivenderlo né condividere l\'accesso con altri.',
        'Domande, risposte, spiegazioni e schede di teoria sono protette. Non puoi copiarle, estrarle con programmi automatici, pubblicarle o ridistribuirle, né in forma di elenco né a pezzi, e non puoi usarle per altri servizi.',
        'Se l\'uso del servizio viola queste regole possiamo sospendere l\'accesso, dopo averti avvisato e averti dato modo di rispondere.',
      ],
    },
    {
      titolo: 'Errori e responsabilità',
      paragrafi: [
        'Facciamo il possibile perché domande e spiegazioni siano corrette, ma può capitare un errore. Se ne trovi uno, scrivici: lo correggiamo.',
        'Nulla in questi termini limita o esclude i diritti che la legge ti riconosce come consumatore.',
      ],
    },
    {
      titolo: 'Modifiche ai termini',
      paragrafi: [
        'Possiamo aggiornare questi termini, per esempio quando cambia la legge o il servizio. La data in cima indica l\'ultima versione. Una modifica non cambia le condizioni di un acquisto già fatto, salvo quando è a tuo vantaggio o la impone la legge.',
      ],
    },
    {
      titolo: 'Contatti',
      paragrafi: [
        `Per domande, errori nelle domande, richieste sui dati o assistenza scrivi a ${righeVenditore()[2].replace('Email: ', '')}.`,
      ],
    },
    {
      titolo: 'Legge applicabile e foro competente',
      paragrafi: [
        'Questi termini sono regolati dalla legge italiana, senza togliere al consumatore le tutele inderogabili del Paese in cui risiede.',
        'Per le controversie con un consumatore è competente il giudice del luogo di residenza o domicilio del consumatore.',
      ],
    },
  ],
};
