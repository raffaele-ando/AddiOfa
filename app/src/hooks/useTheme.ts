import { useCallback, useEffect, useState } from 'react';

/** Scelta dell'utente: 'sistema' segue il telefono, 'chiaro' e 'scuro' sono fissi. */
export type ModoTema = 'sistema' | 'chiaro' | 'scuro';

const CHIAVE = 'theme';

function leggiModo(): ModoTema {
  try {
    const t = localStorage.getItem(CHIAVE);
    if (t === 'dark') return 'scuro';
    if (t === 'light') return 'chiaro';
  } catch { /* memoria non disponibile: si segue il sistema */ }
  return 'sistema';
}

function sistemaScuro(): boolean {
  try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; }
}

/**
 * Tema dell'app. Il tema scuro è la classe `dark` sulla radice (la imposta anche lo script in index.html prima del primo disegno).
 * 'sistema' = nessun valore salvato (lo script iniziale e questo hook seguono prefers-color-scheme, anche se cambia mentre l'app è aperta).
 */
export function useTheme() {
  const [modo, setModoStato] = useState<ModoTema>(leggiModo);
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const radice = document.documentElement;
    const applica = () => {
      const scuro = modo === 'scuro' || (modo === 'sistema' && sistemaScuro());
      radice.classList.toggle('dark', scuro);
      setIsDark(scuro);
    };
    try {
      if (modo === 'sistema') localStorage.removeItem(CHIAVE);
      else localStorage.setItem(CHIAVE, modo === 'scuro' ? 'dark' : 'light');
    } catch { /* si lavora senza memoria */ }
    applica();
    if (modo !== 'sistema') return;
    let mq: MediaQueryList | null = null;
    try { mq = window.matchMedia('(prefers-color-scheme: dark)'); } catch { /* niente ascolto */ }
    mq?.addEventListener('change', applica);
    return () => mq?.removeEventListener('change', applica);
  }, [modo]);

  const setModo = useCallback((m: ModoTema) => setModoStato(m), []);
  return { isDark, modo, setModo, toggleTheme: () => setModoStato(isDark ? 'chiaro' : 'scuro') };
}
