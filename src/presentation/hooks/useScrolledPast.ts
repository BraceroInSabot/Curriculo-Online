import { useEffect, useState } from 'react';

/** Indica se a página já rolou além de `offset` pixels. */
export function useScrolledPast(offset: number): boolean {
  const [hasScrolledPast, setHasScrolledPast] = useState(false);

  useEffect(() => {
    const update = () => setHasScrolledPast(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);

  return hasScrolledPast;
}
