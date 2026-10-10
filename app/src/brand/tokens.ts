// Valori misurati sulle immagini del Brand Kit (grafica/strumenti/brand/misura.py → grafica/brand/misure.json).
// Due kit: "blu" (Brand Kit con palette) e "rosso" (Brand Kit stile Duolingo).
// Cambiare un colore qui lo cambia in tutti i componenti di quel kit.

export type Kit = 'blu' | 'rosso';

export const FONT = "'Inter', 'Nunito Sans', system-ui, -apple-system, 'Segoe UI', sans-serif";

export const PALETTE = {
  primario: '#0F172A',
  secondario: '#3B82F6',
  sfondo: '#F6F8FC',
  superfici: '#E5E7EB',
  testoSecondario: '#6B7280',
  accento: '#EF4444',
  attenzione: '#F59E0B',
  successo: '#22C55E',
  quiz: '#8B5CF6',
} as const;

export interface TokenKit {
  sfondoTavola: string;
  pulsante: {
    primario: { w: number; h: number; r: number; fondo: string; testo: string; ombra: string; corpo: number; freccia: boolean };
    secondario: { w: number; h: number; r: number; fondo: string; testo: string; ombra: string; corpo: number; freccia: boolean };
    outline: { w: number; h: number; r: number; fondo: string; bordo: string; testo: string; corpo: number; freccia: boolean };
  };
  interruttore: { w: number; h: number; acceso: string; spento: string; spentoBordo?: string; pomello: string; alone: string };
  casella: { lato: number; r: number; piena: string; bordo: string };
  radio: { lato: number; colore: string; bordo: string; alone: string };
  avanzamento: { cerchio: number; fatto: string; attuale: string; futuro: string; futuroTesto: string; linea: string; lineaFatta: string; etichetta: string; stileAttuale: 'pieno' | 'anello' };
  barra: { pieno: string; chiaro: string; vuoto: string; gradiente: [string, string] };
}

export const KIT: Record<Kit, TokenKit> = {
  blu: {
    sfondoTavola: '#FEFDFE',
    pulsante: {
      primario: { w: 151, h: 45, r: 10, fondo: '#F4393F', testo: '#FFFFFF', ombra: '0 3px 8px rgba(244, 57, 63, 0.16)', corpo: 14, freccia: true },
      secondario: { w: 148, h: 44, r: 10, fondo: '#F4F6F9', testo: '#0D1B3B', ombra: '0 1px 2px rgba(15, 23, 42, 0.06)', corpo: 14, freccia: true },
      outline: { w: 140, h: 45, r: 9, fondo: '#FFFFFF', bordo: '#81ABFC', testo: '#155EFA', corpo: 14, freccia: true },
    },
    interruttore: { w: 47, h: 27, acceso: '#226EFD', spento: '#D7DBE3', pomello: '#FFFFFF', alone: 'rgba(34, 110, 253, 0.12)' },
    casella: { lato: 24, r: 4, piena: '#246FFD', bordo: '#DEE1E9' },
    radio: { lato: 26, colore: '#1F6BFD', bordo: '#DADEE8', alone: 'rgba(31, 107, 253, 0.18)' },
    avanzamento: { cerchio: 22, fatto: '#236EFD', attuale: '#236EFD', futuro: '#FFFFFF', futuroTesto: '#6B7280', linea: '#E5E7EB', lineaFatta: '#236EFD', etichetta: '#6B7280', stileAttuale: 'pieno' },
    barra: { pieno: '#236EFD', chiaro: '#BFD5FE', vuoto: '#EEF1F6', gradiente: ['#6EA0FE', '#1F63F5'] },
  },
  rosso: {
    sfondoTavola: '#FEFEFE',
    pulsante: {
      primario: { w: 179, h: 54, r: 12, fondo: '#F22B36', testo: '#FFFFFF', ombra: '0 3px 8px rgba(242, 43, 54, 0.16)', corpo: 16, freccia: true },
      secondario: { w: 173, h: 54, r: 13, fondo: '#FEEEEE', testo: '#FC1217', ombra: 'none', corpo: 16, freccia: true },
      outline: { w: 140, h: 56, r: 13, fondo: '#FFFFFF', bordo: '#FDA4AA', testo: '#FB1A23', corpo: 16, freccia: false },
    },
    interruttore: { w: 44, h: 26, acceso: '#F8464C', spento: '#E4E7EE', spentoBordo: '#D3D7E1', pomello: '#FFFFFF', alone: 'rgba(248, 70, 76, 0.10)' },
    casella: { lato: 26, r: 6, piena: '#F52C34', bordo: '#D4D7E2' },
    radio: { lato: 26, colore: '#F52C34', bordo: '#D4D7E2', alone: 'rgba(245, 44, 52, 0.16)' },
    avanzamento: { cerchio: 30, fatto: '#F0303B', attuale: '#F0303B', futuro: '#9CA3AF', futuroTesto: '#FFFFFF', linea: '#E5E7EB', lineaFatta: '#FCD6D8', etichetta: '#4B5563', stileAttuale: 'anello' },
    barra: { pieno: '#EF3B45', chiaro: '#FDD5D8', vuoto: '#EFF0F5', gradiente: ['#F87171', '#E11D2B'] },
  },
};

// Card di stato (Brand Kit blu): fondo, colore del cerchio e del testo
export const STATI = {
  successo: { fondo: '#EDF9F1', cerchio: '#22C55E', titolo: '#16884D', testo: '#16884D' },
  errore: { fondo: '#FEF0F0', cerchio: '#EF4444', titolo: '#E0242C', testo: '#E0242C' },
  attenzione: { fondo: '#FEF7EC', cerchio: '#F59E0B', titolo: '#B07004', testo: '#B07004' },
  info: { fondo: '#F1F5FE', cerchio: '#1D5FF5', titolo: '#1D2B4A', testo: '#4B5563' },
} as const;

export const BADGE = {
  'piu-scelto': { fondo: '#FEEEEE', colore: '#F83238', testo: 'Più scelto' },
  'massima-sicurezza': { fondo: '#E9F9EE', colore: '#159F48', testo: 'Massima sicurezza' },
  consigliato: { fondo: '#EDF3FE', colore: '#1460FD', testo: 'Consigliato' },
} as const;
