export const getEnv = (key: string, defaultValue: string = '') => {
  const value = import.meta.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};
