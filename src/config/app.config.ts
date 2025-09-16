import { getEnv } from '@/utils/get-env';

const appConfig = () => ({
  BASE_URL: getEnv('VITE_MENTOR_BASE_URL'),
  STORE_KEY: getEnv('VITE_STORE_KEY'),
});

export const config = appConfig();
