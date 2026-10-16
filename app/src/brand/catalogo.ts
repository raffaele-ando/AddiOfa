// Ogni elemento del Brand Kit, con che cosa è diventato:
//   codice  → componente React, colori e misure nei token (modificabile al volo)
//   misto   → parte in codice (contenitore, valore, testo) + parte disegnata (glifo o illustrazione)
//   grafica → illustrazione: PNG identico al pixel + SVG ricreato; si può animare ma non si clicca
// `cliccabile` dice se l'elemento, così com'è, risponde a un tocco.

export type Tipo = 'codice' | 'misto' | 'grafica';
export type Animazione = 'galleggia' | 'pulsa' | 'oscilla' | 'gira' | 'gira-lento' | 'rimbalza' | 'capovolgi' | 'brilla' | 'entra';

export interface Voce {
  kit: 'kit-blu' | 'kit-rosso' | 'kit-luminoso' | 'logo';
  gruppo: string;
  nome: string;
  etichetta: string;
  /** Cosa raffigura e dove sta bene (una riga). Le grafiche spedite ce l'hanno tutte; l'elenco per schermata è in docs/design/ILLUSTRAZIONI.md. */
  descrizione?: string;
  tipo: Tipo;
  cliccabile: boolean;
  componente?: string;   // il componente che lo ricrea in codice
  animazione?: Animazione;
  nota?: string;
}

const g = (kit: Voce['kit'], nome: string, etichetta: string, animazione?: Animazione, nota?: string, gruppo = 'illustrazioni'): Voce =>
  ({ kit, gruppo, nome, etichetta, tipo: 'grafica', cliccabile: false, animazione, nota });

const VOCI: Voce[] = [
  { kit: 'logo', gruppo: 'logo', nome: 'icona-app', etichetta: 'Logo AddiOFA', tipo: 'grafica', cliccabile: false, componente: 'Logo',
    nota: 'Ricostruito come scena 3D in SVG con parametri (grafica/strumenti/brand/logo).' },

  // --- Kit blu: illustrazioni principali
  g('kit-blu', 'studio-inglese', 'Studio / Inglese', 'galleggia'),
  g('kit-blu', 'quiz-test', 'Quiz / Test', 'galleggia'),
  { kit: 'kit-blu', gruppo: 'illustrazioni', nome: 'risultato-probabilita', etichetta: 'Risultato / Probabilità', tipo: 'misto', cliccabile: false,
    componente: 'Misuratore', nota: 'In codice: la percentuale è un valore vero e l\'arco si anima.' },
  g('kit-blu', 'rischio-economico', 'Rischio economico', 'oscilla'),
  g('kit-blu', 'piano-studi-bloccato', 'Piano di studi bloccato', 'oscilla'),
  g('kit-blu', 'superamento', 'Superamento', 'rimbalza'),
  g('kit-blu', 'successo', 'Successo', 'brilla'),
  g('kit-blu', 'suggerimenti-consigli', 'Suggerimenti / Consigli', 'pulsa'),
  // --- Kit blu: illustrazioni contestuali
  g('kit-blu', 'verifica-utente', 'Verifica utente', 'galleggia'),
  g('kit-blu', 'accesso-bloccato', 'Accesso bloccato dal secondo anno', 'oscilla'),
  g('kit-blu', 'mancato-superamento', 'Mancato superamento', 'oscilla'),
  g('kit-blu', 'progressi-statistiche', 'Progressi / Statistiche', 'entra'),
  g('kit-blu', 'mondo-internazionale', 'Mondo / Internazionale', 'galleggia'),
  g('kit-blu', 'messaggi-supporto', 'Messaggi / Supporto', 'galleggia'),
  g('kit-blu', 'celebrazione', 'Celebrazione', 'rimbalza'),
  g('kit-blu', 'attesa-caricamento', 'Attesa / Caricamento', 'capovolgi'),
  g('kit-blu', 'ricerca', 'Ricerca', 'oscilla'),

  // --- Kit blu: varianti ricavate dal kit rosso (blu_da_rosso.py) e illustrazioni portate dai concept
  g('kit-blu', 'attenzione-rischio', 'Attenzione / Rischio'),
  g('kit-blu', 'piano-superamento', 'Piano di superamento'),
  g('kit-blu', 'simulazione-esame', 'Simulazione d\'esame'),
  g('kit-blu', 'rischio-economico-ali', 'Rischio economico (con le ali)'),
  g('kit-blu', 'progressi-statistiche-scheda', 'Progressi su scheda'),
  g('kit-blu', 'quiz-test-lista', 'Quiz con una risposta scelta'),
  g('kit-blu', 'cappello-laurea-orologio', 'Cappello di laurea e cronometro'),
  g('kit-blu', 'composizione-tre', 'Misuratore, globo e calendario'),

  // --- Kit blu: stati (ricavati dal kit rosso)
  g('kit-blu', 'attesa', 'Attesa', undefined, undefined, 'stati'),
  g('kit-blu', 'caricamento', 'Caricamento (anello)', undefined, 'Immagine ferma: lo spinner che gira è il componente Caricamento.', 'stati'),
  g('kit-blu', 'celebrazione-fiocco', 'Celebrazione (fiocco)', undefined, undefined, 'stati'),
  g('kit-blu', 'documento-completato', 'Documento completato', undefined, undefined, 'stati'),
  g('kit-blu', 'documento-errore', 'Documento con errore', undefined, undefined, 'stati'),
  g('kit-blu', 'documento-in-corso', 'Documento in corso', undefined, undefined, 'stati'),
  g('kit-blu', 'messaggi', 'Messaggi (tre fumetti)', undefined, undefined, 'stati'),
  g('kit-blu', 'mondo-globo', 'Globo', undefined, undefined, 'stati'),
  g('kit-blu', 'notifica', 'Notifica', undefined, undefined, 'stati'),
  g('kit-blu', 'obiettivo', 'Obiettivo', undefined, undefined, 'stati'),
  g('kit-blu', 'ricerca-scintille', 'Ricerca senza risultati', undefined, undefined, 'stati'),
  g('kit-blu', 'vuoto', 'Vuoto / Nessun dato', undefined, undefined, 'stati'),

  // --- Kit blu: sfere (icone grandi 3D dei concept 28 e 35)
  ...(['addiofa', 'app', 'community', 'consigli', 'costi', 'faq', 'ofa', 'opportunita', 'polimi', 'quiz', 'risultati', 'studio', 'successi', 'tips'] as const)
    .map(n => g('kit-blu', `sfera-${n}`, `Sfera: ${n}`, undefined, undefined, 'sfere')),

  // --- Kit luminoso: gli stessi soggetti del kit blu, blu più acceso e luce piena, per i formati grandi (≥ 160 px)
  ...(['accesso-bloccato', 'attesa-caricamento', 'celebrazione', 'mancato-superamento', 'messaggi-supporto', 'mondo-internazionale', 'piano-studi-bloccato',
    'progressi-statistiche', 'quiz-test', 'ricerca', 'rischio-economico', 'risultato-probabilita', 'studio-inglese', 'successo', 'suggerimenti-consigli',
    'superamento', 'verifica-utente'] as const).map(n => g('kit-luminoso', n, n.replace(/-/g, ' '))),

  // --- Kit rosso: illustrazioni
  g('kit-rosso', 'studio-inglese', 'Studio / Inglese', 'galleggia'),
  g('kit-rosso', 'quiz-test', 'Quiz / Test', 'galleggia'),
  { kit: 'kit-rosso', gruppo: 'illustrazioni', nome: 'risultato-probabilita', etichetta: 'Risultato / Probabilità', tipo: 'misto', cliccabile: false,
    componente: 'Misuratore', nota: 'In codice: la percentuale è un valore vero e l\'arco si anima.' },
  g('kit-rosso', 'rischio-economico', 'Rischio economico', 'oscilla'),
  g('kit-rosso', 'piano-studi-bloccato', 'Piano di studi bloccato', 'oscilla'),
  g('kit-rosso', 'piano-superamento', 'Piano di superamento', 'rimbalza'),
  g('kit-rosso', 'successo-superamento', 'Successo / Superamento', 'brilla'),
  g('kit-rosso', 'verifica-utente', 'Verifica utente', 'galleggia'),
  g('kit-rosso', 'simulazione-esame', 'Simulazione esame', 'galleggia'),
  g('kit-rosso', 'attenzione-rischio', 'Attenzione / Rischio', 'pulsa'),
  g('kit-rosso', 'progressi-statistiche', 'Progressi / Statistiche', 'entra'),
  g('kit-rosso', 'suggerimenti-consigli', 'Suggerimenti / Consigli', 'pulsa'),
  // --- Kit rosso: illustrazioni di stato
  g('kit-rosso', 'ricerca', 'Ricerca', 'oscilla', undefined, 'stati'),
  { kit: 'kit-rosso', gruppo: 'stati', nome: 'caricamento', etichetta: 'Loading', tipo: 'codice', cliccabile: false, componente: 'Caricamento',
    nota: 'In codice: gira davvero, non è un\'immagine ferma.' },
  g('kit-rosso', 'completato', 'Completato', 'entra', undefined, 'stati'),
  g('kit-rosso', 'errore', 'Errore', 'oscilla', undefined, 'stati'),
  g('kit-rosso', 'vuoto', 'Vuoto / Nessun dato', 'galleggia', undefined, 'stati'),
  g('kit-rosso', 'celebrazione', 'Celebrazione', 'rimbalza', undefined, 'stati'),
  { ...g('kit-rosso', 'notifica', 'Notifica', 'rimbalza', 'La busta è disegno, il numero sul pallino si può mettere in codice.', 'stati'), tipo: 'misto' },
  g('kit-rosso', 'attesa', 'Attesa', 'capovolgi', undefined, 'stati'),
  g('kit-rosso', 'in-corso', 'In corso', 'galleggia', undefined, 'stati'),
  g('kit-rosso', 'obiettivo', 'Obiettivo', 'pulsa', undefined, 'stati'),
  g('kit-rosso', 'messaggi', 'Messaggi', 'galleggia', undefined, 'stati'),
  g('kit-rosso', 'mondo-internazionale', 'Mondo / Internazionale', 'gira-lento', undefined, 'stati'),

  // --- Stati e feedback (kit blu): card in codice
  ...(['operazione-completata', 'errore', 'attenzione', 'informazione'] as const).map((nome): Voce => ({
    kit: 'kit-blu', gruppo: 'stati', nome, etichetta: { 'operazione-completata': 'Operazione completata', errore: 'Qualcosa è andato storto', attenzione: 'Attenzione', informazione: 'Informazione importante' }[nome],
    tipo: 'misto', cliccabile: false, componente: 'Stato', nota: 'Card, testo e simbolo in codice; si può aggiungere il pulsante di chiusura.' })),

  // --- Elementi UI: codice interattivo o solo visivo
  ...(['kit-blu', 'kit-rosso'] as const).flatMap((kit): Voce[] => [
    { kit, gruppo: 'ui', nome: 'pulsante-primario', etichetta: 'Pulsante primario', tipo: 'codice', cliccabile: true, componente: 'Pulsante' },
    { kit, gruppo: 'ui', nome: 'pulsante-secondario', etichetta: 'Pulsante secondario', tipo: 'codice', cliccabile: true, componente: 'Pulsante' },
    { kit, gruppo: 'ui', nome: 'pulsante-outline', etichetta: 'Pulsante outline', tipo: 'codice', cliccabile: true, componente: 'Pulsante' },
    { kit, gruppo: 'ui', nome: 'interruttore-acceso', etichetta: 'Interruttore acceso', tipo: 'codice', cliccabile: true, componente: 'Interruttore' },
    { kit, gruppo: 'ui', nome: 'interruttore-spento', etichetta: 'Interruttore spento', tipo: 'codice', cliccabile: true, componente: 'Interruttore' },
    { kit, gruppo: 'ui', nome: 'casella-spuntata', etichetta: 'Casella spuntata', tipo: 'codice', cliccabile: true, componente: 'Casella' },
    { kit, gruppo: 'ui', nome: 'indicatore-avanzamento', etichetta: 'Indicatore di avanzamento', tipo: 'codice', cliccabile: false, componente: 'Avanzamento' },
  ]),
  { kit: 'kit-blu', gruppo: 'ui', nome: 'casella-vuota', etichetta: 'Casella vuota', tipo: 'codice', cliccabile: true, componente: 'Casella' },
  { kit: 'kit-blu', gruppo: 'ui', nome: 'radio-selezionato', etichetta: 'Radio selezionato', tipo: 'codice', cliccabile: true, componente: 'Radio' },
  { kit: 'kit-blu', gruppo: 'ui', nome: 'radio-vuoto', etichetta: 'Radio vuoto', tipo: 'codice', cliccabile: true, componente: 'Radio' },
  { kit: 'kit-rosso', gruppo: 'ui', nome: 'radio-vuoto', etichetta: 'Radio vuoto', tipo: 'codice', cliccabile: true, componente: 'Radio' },
  { kit: 'kit-rosso', gruppo: 'ui', nome: 'barre-avanzamento', etichetta: 'Barre di avanzamento', tipo: 'codice', cliccabile: false, componente: 'Barra' },
  ...(['badge-piu-scelto', 'badge-massima-sicurezza', 'badge-consigliato'] as const).map((nome): Voce => ({
    kit: 'kit-blu', gruppo: 'ui', nome, etichetta: { 'badge-piu-scelto': 'Più scelto', 'badge-massima-sicurezza': 'Massima sicurezza', 'badge-consigliato': 'Consigliato' }[nome],
    tipo: 'codice', cliccabile: false, componente: 'Badge' })),
  { kit: 'kit-rosso', gruppo: 'ui', nome: 'stile-illustrativo', etichetta: 'Stile illustrativo', tipo: 'misto', cliccabile: false,
    nota: 'Card e testo in codice, icona del libro come glifo.' },

  // --- Icone: cerchio in codice + glifo vettoriale; cliccabili solo quando fanno da pulsante
  ...(['kit-blu', 'kit-rosso'] as const).flatMap(kit =>
    ['studio', 'statistiche', 'quiz', 'contenuti', 'costo', 'blocco', 'successo', 'email', 'profilo', 'impostazioni', 'aiuto', 'completato', 'errore', 'info']
      .map((nome): Voce => ({ kit, gruppo: 'icone', nome, etichetta: nome[0].toUpperCase() + nome.slice(1), tipo: 'misto', cliccabile: false,
        componente: 'IconaChip', nota: 'Cliccabile se riceve onClick (per esempio come pulsante di navigazione).' }))),
];

// Cosa raffigura ogni grafica e dove sta bene; chiave `kit/gruppo/nome`. La tabella «schermata → illustrazione» è in docs/design/ILLUSTRAZIONI.md.
const DESCRIZIONI: Record<string, string> = {
  'logo/logo/icona-app': 'Il logo 3D (la stella che diventa porta): icona dell\'app e dello store, non marchio nelle schermate.',
  // kit blu, illustrazioni
  'kit-blu/illustrazioni/studio-inglese': 'Due libri impilati con la bandiera del Regno Unito: lo studio dell\'inglese.',
  'kit-blu/illustrazioni/quiz-test': 'Foglio di quiz con risposte A, B, C e una spunta: domande a risposta multipla.',
  'kit-blu/illustrazioni/risultato-probabilita': 'Misuratore al 82 %: in app lo disegna il componente Misuratore col valore vero.',
  'kit-blu/illustrazioni/rischio-economico': 'Banconota da euro inclinata: il costo di un nuovo tentativo (circa 30 €). Il rischio economico del «Se non superi».',
  'kit-blu/illustrazioni/piano-studi-bloccato': 'Calendario con un lucchetto rosso: il piano di studi che resta limitato finché c\'è l\'OFA.',
  'kit-blu/illustrazioni/superamento': 'Fogli con una spunta verde: test superato, OFA tolto. Il test superato.',
  'kit-blu/illustrazioni/successo': 'Coppa gialla con una stella: obiettivo raggiunto.',
  'kit-blu/illustrazioni/suggerimenti-consigli': 'Lampadina accesa: un consiglio, una spiegazione.',
  'kit-blu/illustrazioni/verifica-utente': 'Tessera con foto e righe di testo: il profilo, i dati di chi studia.',
  'kit-blu/illustrazioni/accesso-bloccato': 'Studente col tocco in una finestra e un orologio: l\'accesso al secondo anno che dipende dalla scadenza.',
  'kit-blu/illustrazioni/mancato-superamento': 'Foglio con una croce rossa: test non superato, sotto soglia.',
  'kit-blu/illustrazioni/progressi-statistiche': 'Quattro barre blu crescenti: andamento e statistiche.',
  'kit-blu/illustrazioni/mondo-internazionale': 'Globo con un aeroplano in orbita: il mondo, i collegamenti.',
  'kit-blu/illustrazioni/messaggi-supporto': 'Due fumetti, uno con tre puntini: messaggi e supporto.',
  'kit-blu/illustrazioni/celebrazione': 'Cono di coriandoli: festa per un esito positivo. Si usa ferma (niente coriandoli che cadono).',
  'kit-blu/illustrazioni/attesa-caricamento': 'Clessidra: attesa e tempo.',
  'kit-blu/illustrazioni/ricerca': 'Lente d\'ingrandimento: cercare.',
  // kit blu, varianti dal kit rosso e dai concept
  'kit-blu/illustrazioni/attenzione-rischio': 'Triangolo di attenzione rosso con tre tacche: avvertenza seria (rosso perché il rosso qui è significato).',
  'kit-blu/illustrazioni/piano-superamento': 'Calendario con due caselle spuntate e raggi: il piano di studio in corso verso il test.',
  'kit-blu/illustrazioni/simulazione-esame': 'Cartellina con la bandiera UK e due spunte: una simulazione d\'esame.',
  'kit-blu/illustrazioni/rischio-economico-ali': 'Pila di euro con le ali: i soldi che volano via a ogni tentativo.',
  'kit-blu/illustrazioni/progressi-statistiche-scheda': 'Scheda con barre blu e freccia in su: miglioramento tra una simulazione e l\'altra.',
  'kit-blu/illustrazioni/quiz-test-lista': 'Lista di domande con la prima già spuntata: una sessione appena iniziata.',
  'kit-blu/illustrazioni/cappello-laurea-orologio': 'Tocco di laurea con un cronometro: il tempo che resta prima dell\'OFA e della laurea.',
  'kit-blu/illustrazioni/composizione-tre': 'Misuratore, globo e calendario con lucchetto insieme: riepilogo del percorso, intestazioni larghe.',
  // kit blu, stati
  'kit-blu/stati/attesa': 'Clessidra azzurra chiara: aspettare qualcosa (sfida inviata, risposta dell\'amico).',
  'kit-blu/stati/caricamento': 'Anello a due archi: caricamento (l\'anello che gira è il componente Caricamento).',
  'kit-blu/stati/celebrazione-fiocco': 'Fiocco blu con coriandoli: piccolo traguardo (badge sbloccato, lezione finita).',
  'kit-blu/stati/documento-completato': 'Foglio con spunta verde: operazione o lezione completata.',
  'kit-blu/stati/documento-errore': 'Foglio con una croce rossa: qualcosa non è andato a buon fine (import fallito, file non valido).',
  'kit-blu/stati/documento-in-corso': 'Foglio con un orologio: elaborazione in corso, calcolo.',
  'kit-blu/stati/messaggi': 'Tre fumetti: messaggi, conversazioni, segnalazioni inviate.',
  'kit-blu/stati/mondo-globo': 'Globo senza aeroplano: collegamento, offline, mondo.',
  'kit-blu/stati/notifica': 'Busta con un pallino rosso «1»: un avviso da leggere (promemoria dello studio).',
  'kit-blu/stati/obiettivo': 'Bersaglio con una freccia al centro: obiettivo (data del test, punteggio da raggiungere).',
  'kit-blu/stati/ricerca-scintille': 'Lente con tre tratti: la ricerca non trova nulla.',
  'kit-blu/stati/vuoto': 'Nuvola triste: non c\'è ancora niente (nessuna simulazione, nessun amico).',
  // kit blu, sfere
  'kit-blu/sfere/sfera-addiofa': 'Sfera di vetro con la stella a quattro punte del marchio.',
  'kit-blu/sfere/sfera-app': 'Sfera con un telefono: installare l\'app, funziona offline.',
  'kit-blu/sfere/sfera-community': 'Sfera con tre persone: amici, community, classifica.',
  'kit-blu/sfere/sfera-consigli': 'Sfera con la lampadina: consigli e spiegazioni.',
  'kit-blu/sfere/sfera-costi': 'Sfera con una moneta da euro: quanto costa il test (circa 30 €); l\'app è gratuita.',
  'kit-blu/sfere/sfera-faq': 'Sfera con due fumetti: domande frequenti, aiuto.',
  'kit-blu/sfere/sfera-ofa': 'Sfera con un lucchetto: che cos\'è l\'OFA e che cosa blocca.',
  'kit-blu/sfere/sfera-opportunita': 'Sfera con il globo e l\'aeroplano: le opportunità dopo l\'OFA (secondo anno, scambi).',
  'kit-blu/sfere/sfera-polimi': 'Sfera con un edificio a colonne: il Politecnico come istituzione, in testo mai come marchio.',
  'kit-blu/sfere/sfera-quiz': 'Sfera con un foglio A, B, C: quiz e domande.',
  'kit-blu/sfere/sfera-risultati': 'Sfera con barre e una freccia: risultati e andamento.',
  'kit-blu/sfere/sfera-studio': 'Sfera con libri e bandiera UK: studio, lezioni.',
  'kit-blu/sfere/sfera-successi': 'Sfera con un bersaglio colpito: traguardi e obiettivi.',
  'kit-blu/sfere/sfera-tips': 'Sfera con un tocco di laurea: i consigli per arrivare al test.',
  // kit luminoso
  'kit-luminoso/illustrazioni/accesso-bloccato': 'Come nel kit blu, in stile luminoso: studente con il tocco, finestra e orologio.',
  'kit-luminoso/illustrazioni/attesa-caricamento': 'Clessidra arancione in stile luminoso.',
  'kit-luminoso/illustrazioni/celebrazione': 'Cono di coriandoli in stile luminoso.',
  'kit-luminoso/illustrazioni/mancato-superamento': 'Fogli con una croce rossa in stile luminoso.',
  'kit-luminoso/illustrazioni/messaggi-supporto': 'Due fumetti blu in stile luminoso.',
  'kit-luminoso/illustrazioni/mondo-internazionale': 'Globo blu con aeroplano e orbita gialla, stile luminoso.',
  'kit-luminoso/illustrazioni/piano-studi-bloccato': 'Calendario con lucchetto rosso, stile luminoso.',
  'kit-luminoso/illustrazioni/progressi-statistiche': 'Quattro barre blu piene, stile luminoso.',
  'kit-luminoso/illustrazioni/quiz-test': 'Foglio di quiz A, B, C (B rossa), stile luminoso.',
  'kit-luminoso/illustrazioni/ricerca': 'Lente blu, stile luminoso.',
  'kit-luminoso/illustrazioni/rischio-economico': 'Banconote blu con l\'euro, stile luminoso.',
  'kit-luminoso/illustrazioni/risultato-probabilita': 'Arco blu con il 82 % e il pallino giallo, stile luminoso.',
  'kit-luminoso/illustrazioni/studio-inglese': 'Libri blu con la bandiera UK, stile luminoso.',
  'kit-luminoso/illustrazioni/successo': 'Coppa gialla con la stella, stile luminoso.',
  'kit-luminoso/illustrazioni/suggerimenti-consigli': 'Lampadina gialla, stile luminoso.',
  'kit-luminoso/illustrazioni/superamento': 'Fogli con spunta verde, stile luminoso.',
  'kit-luminoso/illustrazioni/verifica-utente': 'Tessera con avatar e righe, stile luminoso.',
  // kit rosso (alternativa di colore: non è il colore dell\'app)
  'kit-rosso/illustrazioni/studio-inglese': 'Kit rosso: libri rosa con la bandiera UK. Solo catalogo (l\'app è blu).',
  'kit-rosso/illustrazioni/quiz-test': 'Kit rosso: lista di domande con una spunta. Variante blu: quiz-test-lista.',
  'kit-rosso/illustrazioni/risultato-probabilita': 'Kit rosso: misuratore. Il misuratore dell\'app è in codice.',
  'kit-rosso/illustrazioni/rischio-economico': 'Kit rosso: pila di euro con le ali. Variante blu: rischio-economico-ali.',
  'kit-rosso/illustrazioni/piano-studi-bloccato': 'Kit rosso: calendario con lucchetto. Doppione del kit blu.',
  'kit-rosso/illustrazioni/piano-superamento': 'Kit rosso: calendario con spunte. Variante blu: piano-superamento.',
  'kit-rosso/illustrazioni/successo-superamento': 'Kit rosso: coppa. Doppione del kit blu (successo).',
  'kit-rosso/illustrazioni/verifica-utente': 'Kit rosso: tessera. Doppione del kit blu.',
  'kit-rosso/illustrazioni/simulazione-esame': 'Kit rosso: cartellina con bandiera. Variante blu: simulazione-esame.',
  'kit-rosso/illustrazioni/attenzione-rischio': 'Kit rosso: triangolo di attenzione. Già rosso anche nel kit blu.',
  'kit-rosso/illustrazioni/progressi-statistiche': 'Kit rosso: scheda con barre. Variante blu: progressi-statistiche-scheda.',
  'kit-rosso/illustrazioni/suggerimenti-consigli': 'Kit rosso: lampadina. Doppione del kit blu.',
  'kit-rosso/stati/ricerca': 'Kit rosso: lente con tratti. Variante blu: ricerca-scintille.',
  'kit-rosso/stati/completato': 'Kit rosso: foglio con spunta. Variante blu: documento-completato.',
  'kit-rosso/stati/errore': 'Kit rosso: foglio con croce. Variante blu: documento-errore.',
  'kit-rosso/stati/vuoto': 'Kit rosso: nuvola triste. Variante blu: vuoto.',
  'kit-rosso/stati/celebrazione': 'Kit rosso: fiocco rosso con coriandoli. Variante blu: celebrazione-fiocco.',
  'kit-rosso/stati/notifica': 'Kit rosso: busta con pallino. Variante blu: notifica.',
  'kit-rosso/stati/attesa': 'Kit rosso: clessidra. Variante blu: attesa.',
  'kit-rosso/stati/in-corso': 'Kit rosso: foglio con orologio. Variante blu: documento-in-corso.',
  'kit-rosso/stati/obiettivo': 'Kit rosso: bersaglio. Variante blu: obiettivo.',
  'kit-rosso/stati/messaggi': 'Kit rosso: tre fumetti. Variante blu: messaggi.',
  'kit-rosso/stati/mondo-internazionale': 'Kit rosso: globo. Variante blu: mondo-globo.',
};

export const CATALOGO: Voce[] = VOCI.map(v => {
  const d = DESCRIZIONI[`${v.kit}/${v.gruppo}/${v.nome}`];
  return d ? { ...v, descrizione: d } : v;
});
