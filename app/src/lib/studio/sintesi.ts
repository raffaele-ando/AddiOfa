// Lettura ad alta voce con la sintesi vocale del browser (speechSynthesis). Niente audio finto: se il browser non ha la sintesi,
// o non ha nemmeno una voce inglese, `disponibile` è false e le schermate nascondono il bottone.
import { useCallback, useEffect, useRef, useState } from 'react';

const LINGUA = 'en-GB';

function api(): SpeechSynthesis | null {
  if (typeof window === 'undefined') return null;
  try {
    if ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') return window.speechSynthesis;
  } catch { /* alcuni browser lanciano all'accesso */ }
  return null;
}

/** La voce migliore: en-GB, poi qualunque inglese. undefined = nessuna voce inglese. */
export function scegliVoce(voci: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return voci.find(v => norm(v) === 'en-gb') ?? voci.find(v => norm(v).startsWith('en'));
}

export function useSintesi(): { disponibile: boolean; inLettura: string | null; leggi: (id: string, testo: string) => void; ferma: () => void } {
  const [disponibile, setDisponibile] = useState(false);
  const [inLettura, setInLettura] = useState<string | null>(null);
  const voce = useRef<SpeechSynthesisVoice | undefined>(undefined);

  useEffect(() => {
    const s = api();
    if (!s) return;
    const aggiorna = () => {
      try {
        voce.current = scegliVoce(s.getVoices());
        setDisponibile(!!voce.current);
      } catch { setDisponibile(false); }
    };
    aggiorna();
    // le voci possono arrivare dopo l'apertura della pagina
    s.addEventListener?.('voiceschanged', aggiorna);
    return () => {
      s.removeEventListener?.('voiceschanged', aggiorna);
      try { s.cancel(); } catch { /* niente da fermare */ }
    };
  }, []);

  const ferma = useCallback(() => {
    try { api()?.cancel(); } catch { /* niente */ }
    setInLettura(null);
  }, []);

  const leggi = useCallback((id: string, testo: string) => {
    const s = api();
    if (!s || !voce.current) return;
    try {
      s.cancel();
      const u = new SpeechSynthesisUtterance(testo);
      u.lang = LINGUA;
      u.voice = voce.current;
      u.rate = 0.9;
      u.onend = () => setInLettura(c => (c === id ? null : c));
      u.onerror = () => setInLettura(c => (c === id ? null : c));
      setInLettura(id);
      s.speak(u);
    } catch { setInLettura(null); }
  }, []);

  return { disponibile, inLettura, leggi, ferma };
}
