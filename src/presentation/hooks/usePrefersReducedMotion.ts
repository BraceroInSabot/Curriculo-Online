import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const update = () => setPrefersReduced(mediaQuery.matches);
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return prefersReduced;
}
