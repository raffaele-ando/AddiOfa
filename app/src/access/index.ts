// Punto d'ingresso dei dati: `import { provider } from '../access'`. Non c'è più nessun contesto React né permesso da controllare.
import { LocalProvider } from './localProvider';
import type { DataProvider } from './provider';

export const provider: DataProvider = new LocalProvider();
export { LocalProvider } from './localProvider';
export type * from './provider';
