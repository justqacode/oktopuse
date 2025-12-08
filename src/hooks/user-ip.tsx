import { useEffect, useState } from 'react';

export function useIP() {
  const [ip, setIP] = useState('');

  useEffect(() => {
    async function fetchIP() {
      const res = await fetch('https://icanhazip.com');
      const ip = (await res.text()).trim();
      setIP(ip);
    }
    fetchIP();
  }, []);

  return ip;
}
