import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.tribal.scholarship',
  appName: 'Tribal Scholarship Connect',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
