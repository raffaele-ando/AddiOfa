import type { CSSProperties } from 'react';
import { ICONE, type NomeIcona } from './nomi.generato';
import { cn } from '../../lib/utils';

/**
 * Icona dell'app (kit lucide, ISC). Una funzione = un'icona: i nomi sono semantici (`<Icona nome="simulazioni" />`) e stanno in
 * app/src/brand/icone/registro/*.json; `node tools/genera-icone.mjs` controlla che due funzioni non usino la stessa icona.
 * Si disegna come maschera di un SVG-indirizzo (nessun tracciato nel codice) e prende il colore del testo (`text-*`).
 */
const URL_SVG = import.meta.glob('./svg/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

// Varianti piene (stessa funzione, stato «attivo»: la stella salvata si riempie). Stanno in pieno/<icona lucide>.svg.
const URL_PIENO = import.meta.glob('./pieno/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type { NomeIcona };

export function Icona({ nome, size = 24, className, titolo, pieno = false }: { nome: NomeIcona; size?: number; className?: string; titolo?: string; pieno?: boolean }) {
  const u = (pieno && URL_PIENO[`./pieno/${ICONE[nome]}.svg`]) || URL_SVG[`./svg/${ICONE[nome]}.svg`];
  const stile: CSSProperties = {
    width: size, height: size,
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url("${u}")`, maskImage: `url("${u}")`,
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center', maskPosition: 'center',
    WebkitMaskSize: 'contain', maskSize: 'contain',
  };
  return <span role={titolo ? 'img' : undefined} aria-label={titolo} aria-hidden={titolo ? undefined : true} className={cn('inline-block shrink-0', className)} style={stile} />;
}
