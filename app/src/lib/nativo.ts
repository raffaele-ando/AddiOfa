// App Android (Capacitor): la stessa pagina dentro una WebView, con i file inclusi nell'APK (funziona senza rete).
type CapacitorGlobale = { isNativePlatform?: () => boolean };

/** Vero solo dentro l'app Android; nel sito e nella build a file unico è falso. */
export const inAppNativa = (): boolean => {
  if (typeof window === 'undefined') return false;
  const c = (window as unknown as { Capacitor?: CapacitorGlobale }).Capacitor;
  return !!c?.isNativePlatform?.();
};
