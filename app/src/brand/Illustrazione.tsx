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
 * - tema: la variante chiara o scura (`.scuro.svg`) si sceglie da sola col CSS (classe `.dark`); `fondoScuro` è ignorato
 * - animazione: l'app è statica, quindi si applica solo 'gira' (lo spinner); ogni altro valore è ignorato.
 * - tinta: rotazione del colore in gradi, per prove veloci (per un cambio preciso: grafica/strumenti/brand/ricolora.py)
 */
export function Illustrazione({ nome, kit = 'kit-blu', gruppo, lato, formato = 'disegno', fondoScuro: _fondoScuro, animazione, tinta, alt = '', style }: {
  nome: string; kit?: KitId; gruppo?: string; lato?: number; formato?: 'disegno' | 'png' | 'svg'; fondoScuro?: boolean;
  animazione?: Animazione | 'nessuna'; tinta?: number; alt?: string; style?: CSSProperties;
}) {
  const voce = CATALOGO.find(v => v.kit === kit && v.nome === nome && v.tipo === 'grafica' && (!gruppo || v.gruppo === gruppo));
  const gr = gruppo ?? voce?.gruppo ?? 'illustrazioni';
  const scegli = (scuro: boolean) => formato === 'svg' ? urlSvg(kit, gr, nome)
    : formato === 'disegno' ? (urlDisegno(kit, gr, nome, scuro) ?? urlPng(kit, gr, nome, scuro))
    : urlPng(kit, gr, nome, scuro);
  const chiara = scegli(false);
  const scura = scegli(true) ?? chiara;
  const anim = animazione === 'gira' ? animazione : undefined; // solo lo spinner gira; ogni altra animazione è ignorata
  // La variante giusta per il tema la sceglie il CSS (classe .dark sull'antenato), non chi chiama: nessun lampeggio al cambio di tema
  // e nessun bisogno di passare il tema. `fondoScuro` resta accettato per compatibilità e viene ignorato.
  const stile: CSSProperties = { width: lato, height: 'auto', maxWidth: '100%', filter: tinta ? `hue-rotate(${tinta}deg)` : undefined };
  const doppia = !!scura && scura !== chiara;
  return (
    <span className={anim ? `brand-anim-${anim}` : undefined} style={{ display: 'inline-block', lineHeight: 0, ...style }}>
      <img src={chiara} alt={alt} draggable={false} className={doppia ? 'brand-ill-chiara' : undefined} style={stile} />
      {doppia && <img src={scura} alt={alt} aria-hidden={alt ? undefined : true} draggable={false} className="brand-ill-scura" style={stile} />}
    </span>
  );
}

export function Logo({ lato = 64, arrotondato = true }: { lato?: number; arrotondato?: boolean }) {
  return <img src={urlLogo} alt="AddiOFA" width={lato} height={lato} style={{ borderRadius: arrotondato ? 0 : undefined }} />;
}
