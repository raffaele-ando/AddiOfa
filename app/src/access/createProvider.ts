// Sceglie il provider in base alle variabili di build: VITE_MODE ('demo' | 'prod') e VITE_API_URL (Worker in pass/).
// Demo, sviluppo senza variabili o produzione senza URL: LocalProvider (dati sul dispositivo).
import type { DataProvider } from './provider';
import { LocalProvider } from './localProvider';
import { ApiProvider } from './apiProvider';

export function createProvider(): DataProvider {
  const modo = import.meta.env.VITE_MODE as string | undefined;
  const url = import.meta.env.VITE_API_URL as string | undefined;
  if (modo !== 'demo' && url) return new ApiProvider(url);
  return new LocalProvider();
}
