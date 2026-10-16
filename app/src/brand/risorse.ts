// Grafica spedita con l'app, copiata da grafica/brand/ con tools/sincronizza-essenziali.sh (illustrazioni pulite chiare e scure,
// glifi delle icone, logo). Kit blu (illustrazioni, stati, sfere) = quello dell'app; kit luminoso = gli stessi soggetti per i formati grandi;
// kit rosso = solo catalogo ?brand. Elenco, descrizioni e dove va ognuna: catalogo.ts e docs/design/ILLUSTRAZIONI.md.
// I PNG originali e gli SVG ricalcati (25 MB) restano in grafica/brand/ e non entrano nel bundle.

// L'app usa il kit blu (colore d'azione blu). In demo (VITE_MODE='demo') il kit rosso e il logo grande non entrano
// nel bundle: li usa solo il catalogo ?brand, che nella demo è sostituito da uno stub. Il ternario con costante viene tolto dal build.
const DEMO = import.meta.env.VITE_MODE === 'demo';

type Mappa = Record<string, string>;
const disegniRosso: Mappa = DEMO ? {} : import.meta.glob('./essenziali/disegni/kit-rosso/**/*.svg', { query: '?url&no-inline', import: 'default', eager: true }) as Mappa;
const glifiRosso: Mappa = DEMO ? {} : import.meta.glob('./essenziali/glifi/kit-rosso/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
// Le illustrazioni sono tante e piccole: nell'app normale restano file a parte (le scarica il browser quando le mostra: il JavaScript
// pesa 380 KB in meno); nella demo (un solo file HTML) vanno incorporate.
const disegniBlu: Mappa = DEMO
  ? import.meta.glob('./essenziali/disegni/kit-blu/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa
  : import.meta.glob('./essenziali/disegni/kit-blu/**/*.svg', { query: '?url&no-inline', import: 'default', eager: true }) as Mappa;
const glifiBlu = import.meta.glob('./essenziali/glifi/kit-blu/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
const disegniLuminoso: Mappa = DEMO
  ? import.meta.glob('./essenziali/disegni/kit-luminoso/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa
  : import.meta.glob('./essenziali/disegni/kit-luminoso/**/*.svg', { query: '?url&no-inline', import: 'default', eager: true }) as Mappa;
const disegni: Mappa = { ...disegniRosso, ...disegniBlu, ...disegniLuminoso };
const glifi: Mappa = { ...glifiRosso, ...glifiBlu };
import logoGrande from './essenziali/logo/addiofa-logo.svg?url';
import iconaUrl from './essenziali/icone/favicon-64.png';

export type KitId = 'kit-blu' | 'kit-rosso' | 'kit-luminoso' | 'logo';

/** PNG originale del kit: non spedito con l'app (sta in grafica/brand/elementi). */
export function urlPng(_kit: KitId, _gruppo: string, _nome: string, _scuro = false): string | undefined {
  return undefined;
}

/** SVG ricalcato: non spedito con l'app (sta in grafica/brand/vettori). */
export function urlSvg(_kit: KitId, _gruppo: string, _nome: string): string | undefined {
  return undefined;
}

/** Illustrazione ridisegnata in SVG (nitida a ogni dimensione), se c'è. `scuro` = nuvola di sfondo quasi trasparente. */
export function urlDisegno(kit: KitId, gruppo: string, nome: string, scuro = false): string | undefined {
  return scuro ? disegni[`./essenziali/disegni/${kit}/${gruppo}/${nome}.scuro.svg`] : disegni[`./essenziali/disegni/${kit}/${gruppo}/${nome}.svg`];
}

/** Glifo di un'icona, senza il cerchio (che disegna il codice). */
export function urlGlifo(kit: 'kit-blu' | 'kit-rosso', nome: string): string | undefined {
  return glifi[`./essenziali/glifi/${kit}/${nome}.svg`];
}

// Il logo SVG pesa 460 KB: in demo si usa l'icona PNG (la stessa del favicon).
export const urlLogo = DEMO ? iconaUrl : logoGrande;
export const urlLogoTrasparente = urlLogo;

/** Icona piccola dell'app (la stessa del favicon), incorporata nel bundle. */
export const urlIcona = iconaUrl;
