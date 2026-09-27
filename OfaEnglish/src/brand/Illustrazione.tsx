import { CSSProperties } from 'react';
import { urlPng, urlSvg, urlDisegno, urlLogo, KitId } from './risorse';
import { CATALOGO, Animazione } from './catalogo';
import './brand.css';

/**
 * Un'illustrazione del Brand Kit.
 * - formato "disegno" (default): ridisegnata a mano in SVG, nitida a qualsiasi dimensione;
 *   se il disegno non c'è ancora si usa il PNG
 * - formato "png": identica al pixel all'originale
 * - formato "svg": ricalco vettoriale automatico
 * - fondoScuro: per il tema scuro, con la nuvola di sfondo quasi trasparente invece che bianca
 * - animazione: quella suggerita dal catalogo, un'altra, oppure "nessuna"
 * - tinta: rotazione del colore in gradi, per prove veloci (per un cambio preciso: strumenti/brand/ricolora.py)
 */
export function Illustrazione({ nome, kit = 'kit-blu', gruppo, lato, formato = 'disegno', fondoScuro = false, animazione, tinta, alt = '', style }: {
  nome: string; kit?: KitId; gruppo?: string; lato?: number; formato?: 'disegno' | 'png' | 'svg'; fondoScuro?: boolean;
  animazione?: Animazione | 'nessuna'; tinta?: number; alt?: string; style?: CSSProperties;
}) {
  const voce = CATALOGO.find(v => v.kit === kit && v.nome === nome && (!gruppo || v.gruppo === gruppo));
  const gr = gruppo ?? voce?.gruppo ?? 'illustrazioni';
  const src = formato === 'svg' ? urlSvg(kit, gr, nome)
    : formato === 'disegno' ? (urlDisegno(kit, gr, nome, fondoScuro) ?? urlPng(kit, gr, nome, fondoScuro))
    : urlPng(kit, gr, nome, fondoScuro);
  const anim = animazione ?? voce?.animazione;
  return (
    <span className={anim && anim !== 'nessuna' ? `brand-anim-${anim}` : undefined} style={{ display: 'inline-block', lineHeight: 0, ...style }}>
      <img src={src} alt={alt} draggable={false}
        style={{ width: lato, height: 'auto', maxWidth: '100%', filter: tinta ? `hue-rotate(${tinta}deg)` : undefined }} />
    </span>
  );
}

export function Logo({ lato = 64, arrotondato = true }: { lato?: number; arrotondato?: boolean }) {
  return <img src={urlLogo} alt="AddiOFA" width={lato} height={lato} style={{ borderRadius: arrotondato ? 0 : undefined }} />;
}
