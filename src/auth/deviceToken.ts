const DEVICE_TOKEN_KEY = 'okto_device_token';

export const getDeviceToken = (): string | null => {
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setDeviceToken = (token: string) => {
  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  } catch {
    /* storage unavailable */
  }
};

export const clearDeviceToken = () => {
  try {
    localStorage.removeItem(DEVICE_TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};
