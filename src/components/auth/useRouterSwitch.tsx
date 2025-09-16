import { useState } from 'react';

export const useRouterSwitch = () => {
  const [route, setRoute] = useState('/login');

  const navigate = (path: string) => {
    setRoute(path);
    // Real app: window.history.pushState(null, '', path);
  };

  return { route, navigate };
};
