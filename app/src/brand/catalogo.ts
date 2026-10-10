// Ogni elemento del Brand Kit, con che cosa è diventato:
//   codice  → componente React, colori e misure nei token (modificabile al volo)
//   misto   → parte in codice (contenitore, valore, testo) + parte disegnata (glifo o illustrazione)
//   grafica → illustrazione: PNG identico al pixel + SVG ricreato; si può animare ma non si clicca
// `cliccabile` dice se l'elemento, così com'è, risponde a un tocco.

export type Tipo = 'codice' | 'misto' | 'grafica';
export type Animazione = 'galleggia' | 'pulsa' | 'oscilla' | 'gira' | 'gira-lento' | 'rimbalza' | 'capovolgi' | 'brilla' | 'entra';

export interface Voce {
  kit: 'kit-blu' | 'kit-rosso' | 'logo';
  gruppo: string;
  nome: string;
  etichetta: string;
  tipo: Tipo;
  cliccabile: boolean;
  componente?: string;   // il componente che lo ricrea in codice
  animazione?: Animazione;
  nota?: string;
}

const g = (kit: Voce['kit'], nome: string, etichetta: string, animazione?: Animazione, nota?: string, gruppo = 'illustrazioni'): Voce =>
  ({ kit, gruppo, nome, etichetta, tipo: 'grafica', cliccabile: false, animazione, nota });

const NOTA_SIGILLO = 'Contiene il sigillo del Politecnico: da non usare in pubblico senza autorizzazione.';

export const CATALOGO: Voce[] = [
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
  g('kit-blu', 'email-istituzionale', 'Email istituzionale', 'galleggia', NOTA_SIGILLO),
  g('kit-blu', 'verifica-utente', 'Verifica utente', 'galleggia'),
  g('kit-blu', 'accesso-bloccato', 'Accesso bloccato dal secondo anno', 'oscilla'),
  g('kit-blu', 'mancato-superamento', 'Mancato superamento', 'oscilla'),
  g('kit-blu', 'progressi-statistiche', 'Progressi / Statistiche', 'entra'),
  g('kit-blu', 'mondo-internazionale', 'Mondo / Internazionale', 'galleggia'),
  g('kit-blu', 'messaggi-supporto', 'Messaggi / Supporto', 'galleggia'),
  g('kit-blu', 'celebrazione', 'Celebrazione', 'rimbalza'),
  g('kit-blu', 'attesa-caricamento', 'Attesa / Caricamento', 'capovolgi'),
  g('kit-blu', 'ricerca', 'Ricerca', 'oscilla'),

  // --- Kit rosso: illustrazioni
  g('kit-rosso', 'studio-inglese', 'Studio / Inglese', 'galleggia'),
  g('kit-rosso', 'quiz-test', 'Quiz / Test', 'galleggia'),
  { kit: 'kit-rosso', gruppo: 'illustrazioni', nome: 'risultato-probabilita', etichetta: 'Risultato / Probabilità', tipo: 'misto', cliccabile: false,
    componente: 'Misuratore', nota: 'In codice: la percentuale è un valore vero e l\'arco si anima.' },
  g('kit-rosso', 'rischio-economico', 'Rischio economico', 'oscilla'),
  g('kit-rosso', 'piano-studi-bloccato', 'Piano di studi bloccato', 'oscilla'),
  g('kit-rosso', 'piano-superamento', 'Piano di superamento', 'rimbalza'),
  g('kit-rosso', 'successo-superamento', 'Successo / Superamento', 'brilla'),
  g('kit-rosso', 'email-istituzionale', 'Email istituzionale', 'galleggia', NOTA_SIGILLO),
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
