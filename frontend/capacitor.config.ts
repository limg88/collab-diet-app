import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.collabdiet.app',
  appName: 'CollabDiet',
  webDir: 'www',
  server: { androidScheme: 'http', cleartext: true }
};
export default config;
