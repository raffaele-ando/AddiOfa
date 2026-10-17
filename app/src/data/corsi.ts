// GENERATO da contenuti/corsi/corsi-polimi.json con npm run contenuti:corsi: non modificare a mano.
// Corsi di laurea del Politecnico di Milano, a.a. 2026/27, verificati il 2026-10-17 sulle pagine ufficiali.

export type Livello = 'triennale' | 'magistrale' | 'ciclo-unico';
export type Lingua = 'it' | 'en' | 'it-en';

export interface Scuola {
  id: string;
  nome: string;
  sigla: string;
  /** Sedi in cui la scuola ha almeno un corso. */
  sedi: string[];
}

export interface Sede {
  id: string;
  nome: string;
  citta: string;
  /** false: la sede non ha corsi attivi per le nuove iscrizioni; le funzioni qui sotto la escludono. */
  attiva: boolean;
  nota: string;
}

export interface Corso {
  id: string;
  /** Nome ufficiale in italiano (o il nome ufficiale se esiste solo in inglese). */
  nome: string;
  nomeEn?: string;
  scuola: string;
  sede: string;
  livello: Livello;
  /** Durata legale in anni. */
  anni: number;
  lingua: Lingua;
  /** Pagina ufficiale del corso. */
  fonte: string;
  nota?: string;
}

/** Corso disattivato per le nuove iscrizioni ma con anni ancora in erogazione. */
export interface CorsoInEsaurimento {
  id: string;
  nome: string;
  scuola: string;
  sede: string;
  livello: Livello;
  anniAttivi: number[];
  fonte: string;
}

export const VERSIONE_CORSI = "2026/27";
export const CORSI_VERIFICATI_IL = "2026-10-17";

export const scuole: Scuola[] = [
  {
    "id": "ing-ind-inf",
    "nome": "Scuola di Ingegneria Industriale e dell'Informazione",
    "sigla": "3I",
    "sedi": [
      "leonardo",
      "bovisa",
      "cremona",
      "lecco",
      "piacenza",
      "partner"
    ]
  },
  {
    "id": "icat",
    "nome": "Scuola di Ingegneria Civile, Ambientale e Territoriale",
    "sigla": "ICAT",
    "sedi": [
      "leonardo",
      "lecco"
    ]
  },
  {
    "id": "auic",
    "nome": "Scuola di Architettura Urbanistica Ingegneria delle Costruzioni",
    "sigla": "AUIC",
    "sedi": [
      "leonardo",
      "lecco",
      "mantova",
      "piacenza"
    ]
  },
  {
    "id": "design",
    "nome": "Scuola del Design",
    "sigla": "Design",
    "sedi": [
      "bovisa",
      "lecco"
    ]
  }
];

export const sedi: Sede[] = [
  {
    "id": "leonardo",
    "nome": "Milano Leonardo",
    "citta": "Milano",
    "attiva": true,
    "nota": "Campus storico (Città Studi)."
  },
  {
    "id": "bovisa",
    "nome": "Milano Bovisa",
    "citta": "Milano",
    "attiva": true,
    "nota": ""
  },
  {
    "id": "cremona",
    "nome": "Cremona",
    "citta": "Cremona",
    "attiva": true,
    "nota": "Polo territoriale."
  },
  {
    "id": "lecco",
    "nome": "Lecco",
    "citta": "Lecco",
    "attiva": true,
    "nota": "Polo territoriale."
  },
  {
    "id": "mantova",
    "nome": "Mantova",
    "citta": "Mantova",
    "attiva": true,
    "nota": "Polo territoriale: per il 2026/27 solo Architettura (Progettazione dell'Architettura e laurea magistrale Architectural Design and History)."
  },
  {
    "id": "piacenza",
    "nome": "Piacenza",
    "citta": "Piacenza",
    "attiva": true,
    "nota": "Polo territoriale."
  },
  {
    "id": "partner",
    "nome": "Università partner",
    "citta": "Milano",
    "attiva": true,
    "nota": "Corsi in convenzione con Humanitas University, Università degli Studi di Milano, Università Bocconi e Università Vita-Salute San Raffaele: le lezioni si tengono anche presso l'ateneo partner."
  },
  {
    "id": "xian",
    "nome": "Xi'an (XJTU-POLIMI International Campus)",
    "citta": "Xi'an",
    "attiva": false,
    "nota": "Compare tra le sedi del sito del Politecnico, ma non ha nessun corso nell'elenco delle lauree e lauree magistrali 2026/27."
  }
];

export const corsi: Corso[] = [
  {
    "id": "design-degli-interni-lt-bovisa",
    "nome": "Design degli Interni",
    "nomeEn": "Interior Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/design-degli-interni"
  },
  {
    "id": "design-del-prodotto-industriale-lt-bovisa",
    "nome": "Design del Prodotto Industriale",
    "nomeEn": "Product Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/design-del-prodotto-industriale"
  },
  {
    "id": "design-della-comunicazione-lt-bovisa",
    "nome": "Design della Comunicazione",
    "nomeEn": "Communication Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/design-della-comunicazione"
  },
  {
    "id": "design-della-moda-lt-bovisa",
    "nome": "Design della Moda",
    "nomeEn": "Fashion Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/design-della-moda"
  },
  {
    "id": "interaction-design-lt-lecco",
    "nome": "Interaction Design",
    "scuola": "design",
    "sede": "lecco",
    "livello": "triennale",
    "anni": 3,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/interaction-design"
  },
  {
    "id": "engineering-science-lt-leonardo",
    "nome": "Engineering Science",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/engineering-science"
  },
  {
    "id": "engineering-science-lt-bovisa",
    "nome": "Engineering Science",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/engineering-science"
  },
  {
    "id": "industrial-engineering-lt-piacenza",
    "nome": "Industrial Engineering",
    "scuola": "ing-ind-inf",
    "sede": "piacenza",
    "livello": "triennale",
    "anni": 3,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/industrial-engineering"
  },
  {
    "id": "process-engineering-lt-cremona",
    "nome": "Process Engineering",
    "scuola": "ing-ind-inf",
    "sede": "cremona",
    "livello": "triennale",
    "anni": 3,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/process-engineering"
  },
  {
    "id": "ingegneria-aerospaziale-lt-bovisa",
    "nome": "Ingegneria Aerospaziale",
    "nomeEn": "Aerospace Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-aerospaziale"
  },
  {
    "id": "ingegneria-biomedica-lt-leonardo",
    "nome": "Ingegneria Biomedica",
    "nomeEn": "Biomedical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-biomedica"
  },
  {
    "id": "ingegneria-chimica-lt-leonardo",
    "nome": "Ingegneria Chimica",
    "nomeEn": "Chemical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-chimica"
  },
  {
    "id": "ingegneria-dei-materiali-e-delle-nanotecnologie-lt-leonardo",
    "nome": "Ingegneria dei Materiali e delle Nanotecnologie",
    "nomeEn": "Materials and Nanotechnology Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-dei-materiali-e-delle-nanotecnologie"
  },
  {
    "id": "ingegneria-della-produzione-industriale-lt-lecco",
    "nome": "Ingegneria della Produzione Industriale",
    "nomeEn": "Industrial Production Engineering",
    "scuola": "ing-ind-inf",
    "sede": "lecco",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-della-produzione-industriale"
  },
  {
    "id": "ingegneria-dellautomazione-lt-leonardo",
    "nome": "Ingegneria dell'Automazione",
    "nomeEn": "Automation Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-dellautomazione"
  },
  {
    "id": "ingegneria-elettrica-lt-leonardo",
    "nome": "Ingegneria Elettrica",
    "nomeEn": "Electrical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-elettrica"
  },
  {
    "id": "ingegneria-elettronica-lt-leonardo",
    "nome": "Ingegneria Elettronica",
    "nomeEn": "Electronic Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-elettronica"
  },
  {
    "id": "ingegneria-energetica-lt-bovisa",
    "nome": "Ingegneria Energetica",
    "nomeEn": "Energy Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-energetica"
  },
  {
    "id": "ingegneria-fisica-lt-leonardo",
    "nome": "Ingegneria Fisica",
    "nomeEn": "Physics Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-fisica"
  },
  {
    "id": "ingegneria-gestionale-lt-cremona",
    "nome": "Ingegneria Gestionale",
    "nomeEn": "Management and Production Engineering",
    "scuola": "ing-ind-inf",
    "sede": "cremona",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-gestionale"
  },
  {
    "id": "ingegneria-gestionale-lt-bovisa",
    "nome": "Ingegneria Gestionale",
    "nomeEn": "Management and Production Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-gestionale"
  },
  {
    "id": "ingegneria-informatica-lt-leonardo",
    "nome": "Ingegneria Informatica",
    "nomeEn": "Engineering of Computing Systems",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-informatica"
  },
  {
    "id": "ingegneria-informatica-lt-cremona",
    "nome": "Ingegneria Informatica",
    "nomeEn": "Engineering of Computing Systems",
    "scuola": "ing-ind-inf",
    "sede": "cremona",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-informatica"
  },
  {
    "id": "ingegneria-matematica-lt-leonardo",
    "nome": "Ingegneria Matematica",
    "nomeEn": "Mathematical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-matematica"
  },
  {
    "id": "ingegneria-meccanica-lt-piacenza",
    "nome": "Ingegneria Meccanica",
    "nomeEn": "Mechanical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "piacenza",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-meccanica"
  },
  {
    "id": "ingegneria-meccanica-lt-bovisa",
    "nome": "Ingegneria Meccanica",
    "nomeEn": "Mechanical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-meccanica"
  },
  {
    "id": "ingegneria-civile-lt-leonardo",
    "nome": "Ingegneria Civile",
    "nomeEn": "Civil Engineering",
    "scuola": "icat",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-civile"
  },
  {
    "id": "ingegneria-per-lambiente-e-il-territorio-lt-leonardo",
    "nome": "Ingegneria per l'Ambiente e il Territorio",
    "nomeEn": "Environmental and Land Planning Engineering",
    "scuola": "icat",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-per-lambiente-e-il-territorio"
  },
  {
    "id": "ingegneria-edile-e-delle-costruzioni-lt-leonardo",
    "nome": "Ingegneria Edile e delle Costruzioni",
    "nomeEn": "Building and Construction Engineering",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-edile-e-delle-costruzioni"
  },
  {
    "id": "urbanistica-citt-ambiente-paesaggio-lt-leonardo",
    "nome": "Urbanistica: Città Ambiente Paesaggio",
    "nomeEn": "Urban Planning: Cities, Environment & Landscapes",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/urbanistica-citta-ambiente-paesaggio"
  },
  {
    "id": "progettazione-dellarchitettura-lt-leonardo",
    "nome": "Progettazione dell'Architettura",
    "nomeEn": "Architectural Design",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/progettazione-dellarchitettura"
  },
  {
    "id": "progettazione-dellarchitettura-lt-piacenza",
    "nome": "Progettazione dell'Architettura",
    "nomeEn": "Architectural Design",
    "scuola": "auic",
    "sede": "piacenza",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/progettazione-dellarchitettura"
  },
  {
    "id": "progettazione-dellarchitettura-lt-mantova",
    "nome": "Progettazione dell'Architettura",
    "nomeEn": "Architectural Design",
    "scuola": "auic",
    "sede": "mantova",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/progettazione-dellarchitettura"
  },
  {
    "id": "ingegneria-informatica-corso-online-lt-leonardo",
    "nome": "Ingegneria Informatica (corso online)",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "triennale",
    "anni": 3,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-informatica",
    "nota": "Corso di Ingegneria Informatica OnLine: posti dedicati nel bando 2026/27 (Milano Città Studi, «Corso Online»); stessa pagina del corso in presenza."
  },
  {
    "id": "ingegneria-edile-architettura-cu-lecco",
    "nome": "Ingegneria Edile-Architettura",
    "nomeEn": "Building Engineering/Architecture",
    "scuola": "auic",
    "sede": "lecco",
    "livello": "ciclo-unico",
    "anni": 5,
    "lingua": "it",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/ingegneria-edile-architettura"
  },
  {
    "id": "medtec-school-cu-leonardo",
    "nome": "MEDTEC School",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "ciclo-unico",
    "anni": 6,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/medtec-school",
    "nota": "Corso a ciclo unico (6 anni) di Humanitas University in convenzione col Politecnico: lezioni a Humanitas e al Politecnico (Milano Leonardo). Rilascia anche la laurea triennale in Ingegneria Biomedica."
  },
  {
    "id": "medtec-school-cu-partner",
    "nome": "MEDTEC School",
    "scuola": "ing-ind-inf",
    "sede": "partner",
    "livello": "ciclo-unico",
    "anni": 6,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea/dettaglio-corso/medtec-school",
    "nota": "Corso a ciclo unico (6 anni) di Humanitas University in convenzione col Politecnico: lezioni a Humanitas e al Politecnico (Milano Leonardo). Rilascia anche la laurea triennale in Ingegneria Biomedica."
  },
  {
    "id": "ingegneria-aeronautica-lm-bovisa",
    "nome": "Ingegneria Aeronautica",
    "nomeEn": "Aeronautical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/aeronautical-engineering-ingegneria-aeronautica"
  },
  {
    "id": "agricultural-engineering-lm-cremona",
    "nome": "Agricultural Engineering",
    "scuola": "ing-ind-inf",
    "sede": "cremona",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/agricultural-engineering"
  },
  {
    "id": "progettazione-architettonica-e-storia-lm-mantova",
    "nome": "Progettazione Architettonica e Storia",
    "nomeEn": "Architectural Design and History",
    "scuola": "auic",
    "sede": "mantova",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/architectural-design-and-history-progettazione-architettonica-e-storia"
  },
  {
    "id": "architectural-engineering-lm-lecco",
    "nome": "Architectural Engineering",
    "scuola": "auic",
    "sede": "lecco",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/architectural-engineering"
  },
  {
    "id": "architettura-lm-leonardo",
    "nome": "Architettura",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/architettura"
  },
  {
    "id": "ingegneria-dellautomazione-lm-leonardo",
    "nome": "Ingegneria dell'Automazione",
    "nomeEn": "Automation and Control Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/automation-and-control-engineering-ingegneria-dellautomazione"
  },
  {
    "id": "bioinformatics-for-computational-genomics-lm-leonardo",
    "nome": "Bioinformatics for Computational Genomics",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/aeronautical-engineering-ingegneria-aeronautica-1",
    "nota": "Corso congiunto con l'Università degli Studi di Milano: lezioni all'Università degli Studi di Milano e a Milano Leonardo."
  },
  {
    "id": "bioinformatics-for-computational-genomics-lm-partner",
    "nome": "Bioinformatics for Computational Genomics",
    "scuola": "ing-ind-inf",
    "sede": "partner",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/aeronautical-engineering-ingegneria-aeronautica-1",
    "nota": "Corso congiunto con l'Università degli Studi di Milano: lezioni all'Università degli Studi di Milano e a Milano Leonardo."
  },
  {
    "id": "ingegneria-biomedica-lm-leonardo",
    "nome": "Ingegneria Biomedica",
    "nomeEn": "Biomedical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/biomedical-engineering-ingegneria-biomedica"
  },
  {
    "id": "building-engineering-for-sustainability-lm-leonardo",
    "nome": "Building Engineering for Sustainability",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/ingegneria-edile-per-la-sostenibilita-building-engineering-for-sustainability"
  },
  {
    "id": "ingegneria-chimica-lm-leonardo",
    "nome": "Ingegneria Chimica",
    "nomeEn": "Chemical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/chemical-engineering-ingegneria-chimica"
  },
  {
    "id": "civil-engineering-for-risk-mitigation-lm-lecco",
    "nome": "Civil Engineering for Risk Mitigation",
    "scuola": "icat",
    "sede": "lecco",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/civil-engineering-for-risk-mitigation"
  },
  {
    "id": "ingegneria-informatica-lm-leonardo",
    "nome": "Ingegneria Informatica",
    "nomeEn": "Computer Science and Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/computer-science-and-engineering-ingegneria-informatica"
  },
  {
    "id": "cyber-risk-strategy-and-governance-lm-leonardo",
    "nome": "Cyber Risk Strategy and Governance",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/cyber-risk-strategy-and-governance",
    "nota": "Corso in collaborazione con l'Università Bocconi: lezioni alla Bocconi e a Milano Leonardo."
  },
  {
    "id": "cyber-risk-strategy-and-governance-lm-partner",
    "nome": "Cyber Risk Strategy and Governance",
    "scuola": "ing-ind-inf",
    "sede": "partner",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/cyber-risk-strategy-and-governance",
    "nota": "Corso in collaborazione con l'Università Bocconi: lezioni alla Bocconi e a Milano Leonardo."
  },
  {
    "id": "design-della-comunicazione-lm-bovisa",
    "nome": "Design della Comunicazione",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/design-della-comunicazione-1"
  },
  {
    "id": "progetto-e-ingegnerizzazione-del-prodotto-industriale-lm-bovisa",
    "nome": "Progetto e Ingegnerizzazione del Prodotto Industriale",
    "nomeEn": "Design & Engineering",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/design-engineering-progetto-e-ingegnerizzazione-del-prodotto-industriale"
  },
  {
    "id": "design-for-the-fashion-system-lm-bovisa",
    "nome": "Design for the Fashion System",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/design-for-the-fashion-system"
  },
  {
    "id": "digital-and-interaction-design-lm-bovisa",
    "nome": "Digital and Interaction Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/digital-and-interaction-design"
  },
  {
    "id": "ingegneria-elettrica-lm-leonardo",
    "nome": "Ingegneria Elettrica",
    "nomeEn": "Electrical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/electrical-engineering-ingegneria-elettrica"
  },
  {
    "id": "ingegneria-elettronica-lm-leonardo",
    "nome": "Ingegneria Elettronica",
    "nomeEn": "Electronics Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/electronics-engineering-ingegneria-elettronica"
  },
  {
    "id": "ingegneria-energetica-lm-bovisa",
    "nome": "Ingegneria Energetica",
    "nomeEn": "Energy Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/energy-engineering-ingegneria-energetica"
  },
  {
    "id": "ingegneria-energetica-lm-piacenza",
    "nome": "Ingegneria Energetica",
    "nomeEn": "Energy Engineering",
    "scuola": "ing-ind-inf",
    "sede": "piacenza",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/energy-engineering-ingegneria-energetica"
  },
  {
    "id": "ingegneria-fisica-lm-leonardo",
    "nome": "Ingegneria Fisica",
    "nomeEn": "Engineering Physics",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/engineering-physics-ingegneria-fisica"
  },
  {
    "id": "food-engineering-lm-leonardo",
    "nome": "Food Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/food-engineering"
  },
  {
    "id": "ingegneria-geoinformatica-lm-leonardo",
    "nome": "Ingegneria Geoinformatica",
    "nomeEn": "Geoinformatics Engineering",
    "scuola": "icat",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/geoinformatics-engineering-ingegneria-geoinformatica",
    "nota": "La pagina del corso cita sia la Scuola ICAT sia la Scuola 3I; assegnato a ICAT (non compare nell'elenco della Scuola 3I)."
  },
  {
    "id": "health-informatics-lm-partner",
    "nome": "Health Informatics",
    "scuola": "ing-ind-inf",
    "sede": "partner",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/health-informatics",
    "nota": "Corso interateneo con l'Università Vita-Salute San Raffaele: lezioni al San Raffaele."
  },
  {
    "id": "high-performance-computing-engineering-lm-leonardo",
    "nome": "High Performance Computing Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/high-performance-computing-engineering"
  },
  {
    "id": "industrial-safety-and-risk-engineering-lm-leonardo",
    "nome": "Industrial Safety and Risk Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/industrial-safety-and-risk-engineering"
  },
  {
    "id": "ingegneria-civile-lm-leonardo",
    "nome": "Ingegneria Civile",
    "nomeEn": "Civil Engineering",
    "scuola": "icat",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/ingegneria-civile-civil-engineering"
  },
  {
    "id": "ingegneria-per-lambiente-e-il-territorio-lm-leonardo",
    "nome": "Ingegneria per l'Ambiente e il Territorio",
    "nomeEn": "Environmental and Land Planning Engineering",
    "scuola": "icat",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/ingegneria-per-lambiente-e-il-territorio-environmental-and-land-planning-engineering"
  },
  {
    "id": "integrated-product-design-lm-bovisa",
    "nome": "Integrated Product Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/integrated-product-design"
  },
  {
    "id": "interior-and-spatial-design-lm-bovisa",
    "nome": "Interior and Spatial Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "it-en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/interior-and-spatial-design"
  },
  {
    "id": "landscape-architecture-land-landscape-heritage-lm-piacenza",
    "nome": "Landscape Architecture - Land Landscape Heritage",
    "scuola": "auic",
    "sede": "piacenza",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/landscape-architecture-land-landscape-heritage"
  },
  {
    "id": "ingegneria-gestionale-lm-bovisa",
    "nome": "Ingegneria Gestionale",
    "nomeEn": "Management Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/management-engineering-ingegneria-gestionale"
  },
  {
    "id": "gestione-del-costruito-lm-leonardo",
    "nome": "Gestione del Costruito",
    "nomeEn": "Management of Built Environment",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/management-of-built-environment-gestione-del-costruito"
  },
  {
    "id": "ingegneria-dei-materiali-e-delle-nanotecnologie-lm-leonardo",
    "nome": "Ingegneria dei Materiali e delle Nanotecnologie",
    "nomeEn": "Materials Engineering and Nanotechnology",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/materials-engineering-and-nanotechnology-ingegneria-dei-materiali-e-delle-nanotecnologie"
  },
  {
    "id": "mathematical-engineering-lm-leonardo",
    "nome": "Mathematical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/mathematical-engineering"
  },
  {
    "id": "ingegneria-meccanica-lm-bovisa",
    "nome": "Ingegneria Meccanica",
    "nomeEn": "Mechanical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/mechanical-engineering-ingegneria-meccanica"
  },
  {
    "id": "ingegneria-meccanica-lm-piacenza",
    "nome": "Ingegneria Meccanica",
    "nomeEn": "Mechanical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "piacenza",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/mechanical-engineering-ingegneria-meccanica"
  },
  {
    "id": "ingegneria-meccanica-lm-lecco",
    "nome": "Ingegneria Meccanica",
    "nomeEn": "Mechanical Engineering",
    "scuola": "ing-ind-inf",
    "sede": "lecco",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/mechanical-engineering-ingegneria-meccanica"
  },
  {
    "id": "mobility-engineering-lm-bovisa",
    "nome": "Mobility Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/mobility-engineering"
  },
  {
    "id": "music-and-acoustic-engineering-lm-leonardo",
    "nome": "Music and Acoustic Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/music-and-acoustic-engineering"
  },
  {
    "id": "music-and-acoustic-engineering-lm-cremona",
    "nome": "Music and Acoustic Engineering",
    "scuola": "ing-ind-inf",
    "sede": "cremona",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/music-and-acoustic-engineering"
  },
  {
    "id": "ingegneria-nucleare-lm-bovisa",
    "nome": "Ingegneria Nucleare",
    "nomeEn": "Nuclear Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/nuclear-engineering-ingegneria-nucleare"
  },
  {
    "id": "product-service-system-design-lm-bovisa",
    "nome": "Product Service System Design",
    "scuola": "design",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/product-service-system-design"
  },
  {
    "id": "ingegneria-spaziale-lm-bovisa",
    "nome": "Ingegneria Spaziale",
    "nomeEn": "Space Engineering",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/aeronautical-engineering-ingegneria-aeronautica-2"
  },
  {
    "id": "architettura-sostenibile-e-progetto-del-paesaggio-lm-piacenza",
    "nome": "Architettura Sostenibile e Progetto del Paesaggio",
    "nomeEn": "Sustainable Architecture and Landscape Design",
    "scuola": "auic",
    "sede": "piacenza",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/sustainable-architecture-and-landscape-design-architettura-sostenibile-e-progetto-del-paesaggio"
  },
  {
    "id": "ingegneria-delle-telecomunicazioni-lm-leonardo",
    "nome": "Ingegneria delle Telecomunicazioni",
    "nomeEn": "Telecommunication Engineering",
    "scuola": "ing-ind-inf",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/telecommunication-engineering-ingegneria-delle-telecomunicazioni"
  },
  {
    "id": "transformative-sustainability-lm-bovisa",
    "nome": "Transformative Sustainability",
    "scuola": "ing-ind-inf",
    "sede": "bovisa",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/transformative-sustainability",
    "nota": "Corso in collaborazione con l'Università Bocconi: lezioni alla Bocconi e a Milano Bovisa."
  },
  {
    "id": "transformative-sustainability-lm-partner",
    "nome": "Transformative Sustainability",
    "scuola": "ing-ind-inf",
    "sede": "partner",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/transformative-sustainability",
    "nota": "Corso in collaborazione con l'Università Bocconi: lezioni alla Bocconi e a Milano Bovisa."
  },
  {
    "id": "pianificazione-urbana-e-politiche-territoriali-lm-leonardo",
    "nome": "Pianificazione Urbana e Politiche Territoriali",
    "nomeEn": "Urban Planning and Policy Design",
    "scuola": "auic",
    "sede": "leonardo",
    "livello": "magistrale",
    "anni": 2,
    "lingua": "en",
    "fonte": "https://www.polimi.it/formazione/corsi-di-laurea-magistrale/dettaglio-corso/urban-planning-and-policy-design-pianificazione-urbana-e-politiche-territoriali"
  }
];

export const corsiInEsaurimento: CorsoInEsaurimento[] = [];

const ORDINE_LIVELLI: Livello[] = ['triennale', 'ciclo-unico', 'magistrale'];

const sedeAttiva = (sedeId: string): boolean => sedi.some((s) => s.id === sedeId && s.attiva);
const confronta = (a: string, b: string): number => a.localeCompare(b, 'it');

/** Corsi attivi (sede attiva) di una scuola in una sede, di qualunque livello. */
function corsiAttivi(scuolaId: string, sedeId: string): Corso[] {
  if (!sedeAttiva(sedeId)) return [];
  return corsi.filter((c) => c.scuola === scuolaId && c.sede === sedeId);
}

/** Sedi attive della scuola, con almeno un corso, nell'ordine in cui la scuola le elenca. */
export function sediDellaScuola(scuolaId: string): Sede[] {
  const scuola = scuole.find((s) => s.id === scuolaId);
  if (!scuola) return [];
  return scuola.sedi
    .map((id) => sedi.find((s) => s.id === id))
    .filter((s): s is Sede => s !== undefined && s.attiva && corsiAttivi(scuolaId, s.id).length > 0);
}

/** Livelli per cui la scuola ha corsi attivi nella sede (triennale, ciclo unico, magistrale). */
export function livelliDisponibili(scuolaId: string, sedeId: string): Livello[] {
  const presenti = new Set(corsiAttivi(scuolaId, sedeId).map((c) => c.livello));
  return ORDINE_LIVELLI.filter((l) => presenti.has(l));
}

/** Corsi attivi della scuola in quella sede e livello, in ordine alfabetico. */
export function corsiDisponibili(scuolaId: string, sedeId: string, livello: Livello): Corso[] {
  return corsiAttivi(scuolaId, sedeId)
    .filter((c) => c.livello === livello)
    .sort((a, b) => confronta(a.nome, b.nome));
}

/** Gli anni di corso da proporre: [1, ..., anni]. */
export function anniDelCorso(corso: Pick<Corso, 'anni'>): number[] {
  return Array.from({ length: corso.anni }, (_, i) => i + 1);
}
