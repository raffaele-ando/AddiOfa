// Indirizzi dei file estratti e ricreati in OfaEnglish/brand/ (generati da strumenti/brand/).
// Vite li pubblica come file a parte: si scaricano solo quando servono.

const png = import.meta.glob('/brand/elementi/**/*.png', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
// l'SVG ricalcato del logo (4 MB) resta fuori: nell'app si usa quello costruito in strumenti/brand/logo
const svg = import.meta.glob(['/brand/vettori/**/*.svg', '!/brand/vettori/logo/**'], { query: '?url', import: 'default', eager: true }) as Record<string, string>;
// illustrazioni ridisegnate a mano in SVG (forme con nome + maglie di sfumature), vedi strumenti/brand/DISEGNI.md
const disegni = import.meta.glob(['/brand/disegni/**/*.maglie.svg', '/brand/disegni/**/*.scuro.svg'], { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const glifi = import.meta.glob('/brand/glifi/**/*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const logo = import.meta.glob('/strumenti/brand/logo/addiofa-logo*.svg', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

export type KitId = 'kit-blu' | 'kit-rosso' | 'logo';

/** PNG identico al pixel (fondo trasparente). `scuro` = variante con aloni semitrasparenti. */
export function urlPng(kit: KitId, gruppo: string, nome: string, scuro = false): string | undefined {
  if (scuro) return png[`/brand/elementi/${kit}/fondo-scuro/${nome}.png`] ?? png[`/brand/elementi/${kit}/${gruppo}/${nome}.png`];
  return png[`/brand/elementi/${kit}/${gruppo}/${nome}.png`];
}

/** SVG ricreato (vettoriale, scalabile). */
export function urlSvg(kit: KitId, gruppo: string, nome: string): string | undefined {
  return svg[`/brand/vettori/${kit}/${gruppo}/${nome}.svg`];
}

/** Illustrazione ridisegnata in SVG (nitida a ogni dimensione), se c'è. `scuro` = nuvola di sfondo quasi trasparente. */
export function urlDisegno(kit: KitId, gruppo: string, nome: string, scuro = false): string | undefined {
  return (scuro ? disegni[`/brand/disegni/${kit}/${gruppo}/${nome}.scuro.svg`] : undefined)
    ?? (scuro ? undefined : disegni[`/brand/disegni/${kit}/${gruppo}/${nome}.maglie.svg`]);
}

/** Glifo di un'icona, senza il cerchio (che disegna il codice). */
export function urlGlifo(kit: 'kit-blu' | 'kit-rosso', nome: string): string | undefined {
  return glifi[`/brand/glifi/${kit}/${nome}.svg`];
}

export const urlLogo = logo['/strumenti/brand/logo/addiofa-logo.svg'];
export const urlLogoTrasparente = logo['/strumenti/brand/logo/addiofa-logo-trasparente.svg'];
