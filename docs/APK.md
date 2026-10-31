# App Android (APK)

L'app Android è lo stesso sito dentro una WebView (Capacitor): i file del sito sono **dentro l'APK**, quindi domande, correzione, simulazioni e progressi funzionano **senza rete**. Cartella: `app/android/` (progetto Android generato), configurazione: `app/capacitor.config.ts` (id `world.theproject.addiofa`).

## Cosa cambia rispetto al sito
- Funziona offline. I progressi stanno nella memoria dell'app (si perdono se si disinstalla: usa «Esporta» nelle Impostazioni).
- Il tasto «indietro» di Android torna alla schermata precedente; dalla Home esce dall'app. Orientamento verticale.
- «Accedi con Google» e il link di verifica email non si offrono nell'app (la finestra di Google e il link, che riporta a un indirizzo web, non funzionano in una WebView): l'accesso a Project ID resta sul sito. Le iscrizioni e la classifica NOI funzionano solo con il server ATLAS collegato (`VITE_ATLAS_API_URL`); il server accetta la chiamata dall'app perché `https://localhost` è tra le `ALLOWED_ORIGINS` di `atlas/wrangler.jsonc`.

## Costruire l'APK
- **Da GitHub, senza comandi**: Actions → **APK Android** → **Run workflow** (campo facoltativo: indirizzo del server ATLAS) → a fine esecuzione scarica `AddiOFA-apk` dagli Artifacts.
- **Da terminale** (serve JDK 21 e Android SDK): `cd app && npm run build && npx cap sync android && cd android && ./gradlew assembleDebug` → `app/android/app/build/outputs/apk/debug/app-debug.apk`.

## Installare
Copia l'APK sul telefono → aprilo → consenti «Installa app sconosciute» per quell'app (file manager o browser) → Installa. È firmato con la chiave di debug: va bene per provare; per Google Play serve una versione firmata con la tua chiave (`assembleRelease`) e un account sviluppatore.

## Cosa non è stato provato
Non è mai stato avviato su un telefono o un emulatore (l'ambiente di costruzione non ha l'emulazione). Verificato: l'APK si costruisce, è firmato, contiene i file del sito e il manifesto corretto (id, nome, icona, verticale, solo permesso Internet).
