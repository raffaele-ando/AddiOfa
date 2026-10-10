// Testi legali di AddiOFA. Sono una BOZZA: vanno rivisti da un professionista prima di vendere.
// Quando saranno rivisti e i dati del venditore saranno compilati (base.ts), mettere LEGAL_DRAFT = false.
import type { LegalSection } from '../types';
import type { LegalDoc } from './base';
import { termini } from './termini';
import { privacy } from './privacy';
import { cookie } from './cookie';
import { recesso } from './recesso';

export { LEGAL_SELLER, LEGAL_AGGIORNATO } from './base';
export type { LegalDoc, LegalSezione } from './base';

export const LEGAL_DRAFT = true;

export const LEGAL_DOCS: Record<LegalSection, LegalDoc> = { termini, privacy, cookie, recesso };

/** Etichette brevi per schede e footer, nell'ordine di visualizzazione. */
export const LEGAL_TABS: { id: LegalSection; label: string }[] = [
  { id: 'termini', label: 'Termini' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'cookie', label: 'Cookie' },
  { id: 'recesso', label: 'Recesso' },
];
