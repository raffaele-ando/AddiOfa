import { useEffect, type RefObject } from 'react';

const FOCALIZZABILI = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialoghi e fogli modali: finché `attivo`, Tab e Maiusc+Tab girano solo dentro `ref` (niente fuoco sui pulsanti sotto il velo)
 * ed Esc chiama `onEsc` ovunque sia il fuoco.
 */
export function useTrappolaFuoco(ref: RefObject<HTMLElement | null>, attivo: boolean, onEsc?: () => void): void {
  useEffect(() => {
    if (!attivo) return;
    const tasto = (e: KeyboardEvent) => {
      const el = ref.current;
      if (!el) return;
      if (e.key === 'Escape' && onEsc) { e.preventDefault(); onEsc(); return; }
      if (e.key !== 'Tab') return;
      const voci = [...el.querySelectorAll<HTMLElement>(FOCALIZZABILI)].filter(v => v.offsetParent !== null || v === document.activeElement);
      if (voci.length === 0) { e.preventDefault(); return; }
      const prima = voci[0], ultima = voci[voci.length - 1];
      const dentro = el.contains(document.activeElement);
      if (e.shiftKey && (!dentro || document.activeElement === prima)) { e.preventDefault(); ultima.focus(); }
      else if (!e.shiftKey && (!dentro || document.activeElement === ultima)) { e.preventDefault(); prima.focus(); }
    };
    document.addEventListener('keydown', tasto, true);
    return () => document.removeEventListener('keydown', tasto, true);
  }, [ref, attivo, onEsc]);
}
