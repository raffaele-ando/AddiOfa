import type { CapacitorConfig } from '@capacitor/cli';

// App Android (APK): il sito costruito (app/dist) viene incluso nell'app, quindi funziona anche senza rete.
// Per costruirla: dalla radice `npm run apk` (vedi docs/APK.md).
const config: CapacitorConfig = {
  appId: 'world.theproject.addiofa',
  appName: 'AddiOFA',
  webDir: 'dist',
  android: { allowMixedContent: false },
  server: { androidScheme: 'https' },
};

export default config;
