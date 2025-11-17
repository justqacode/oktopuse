import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface GA4RouteTrackerProps {
  measurementId: string;
}

export default function GA4RouteTracker({ measurementId }: GA4RouteTrackerProps) {
  const location = useLocation();

  useEffect(() => {
    const gtag = (window as any).gtag as ((...args: any[]) => void) | undefined;

    if (!gtag || !measurementId) return;

    gtag('config', measurementId, {
      page_location: window.location.href,
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [location, measurementId]);

  return null;
}

// // GA4RouteTracker.jsx
// import { useEffect } from 'react';
// import { useLocation } from 'react-router-dom';

// export default function GA4RouteTracker({ measurementId }) {
//   const location = useLocation();

//   useEffect(() => {
//     if (!window.gtag || !measurementId) return;

//     window.gtag('config', measurementId, {
//       page_location: window.location.href,
//       page_path: location.pathname + location.search,
//       page_title: document.title,
//     });
//   }, [location, measurementId]);

//   return null;
// }
