import { getEnv } from '@/utils/get-env';

const appConfig = () => ({
  BASE_URL: getEnv('VITE_MENTOR_BASE_URL'),
  STORE_KEY: getEnv('VITE_STORE_KEY'),
  GA4_MEASUREMENT_ID: getEnv('VITE_GA4_MEASUREMENT_ID'),
  GOOGLE_CLIENT_ID: getEnv('VITE_GOOGLE_CLIENT_ID', ''),
  SQUARE_APPLICATION_ID: getEnv('VITE_SQUARE_APPLICATION_ID', ''),
  SQUARE_LOCATION_ID: getEnv('VITE_SQUARE_LOCATION_ID', ''),
  // SQUARE_ACCESS_TOKEN: getEnv('VITE_SQUARE_ACCESS_TOKEN', ''),
});

export const config = appConfig();
