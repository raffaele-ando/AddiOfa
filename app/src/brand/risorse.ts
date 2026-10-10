// Grafica spedita con l'app: solo ciò che le schermate usano davvero, copiato da grafica/brand/ con
// tools/sincronizza-essenziali.sh (illustrazioni pulite chiare e scure, glifi delle icone, logo).
// I PNG originali e gli SVG ricalcati (25 MB) restano in grafica/brand/ e non entrano nel bundle.

// In demo (VITE_MODE='demo') il kit blu e il logo grande non entrano nel bundle: li usa solo il catalogo ?brand,
// che nella demo è sostituito da uno stub. Il ternario con costante viene tolto dal build.
const DEMO = import.meta.env.VITE_MODE === 'demo';

type Mappa = Record<string, string>;
const disegniRosso = import.meta.glob('./essenziali/disegni/kit-rosso/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
const glifiRosso = import.meta.glob('./essenziali/glifi/kit-rosso/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
const disegniBlu: Mappa = DEMO ? {} : import.meta.glob('./essenziali/disegni/kit-blu/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
const glifiBlu: Mappa = DEMO ? {} : import.meta.glob('./essenziali/glifi/kit-blu/**/*.svg', { query: '?url', import: 'default', eager: true }) as Mappa;
const disegni: Mappa = { ...disegniRosso, ...disegniBlu };
const glifi: Mappa = { ...glifiRosso, ...glifiBlu };
import logoGrande from './essenziali/logo/addiofa-logo.svg?url';
import iconaUrl from './essenziali/icone/favicon-64.png';

export type KitId = 'kit-blu' | 'kit-rosso' | 'logo';

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
