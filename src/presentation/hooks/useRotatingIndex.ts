import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

interface RotatingIndexOptions {
  readonly intervalMs: number;
  readonly paused?: boolean;
}

/** Índice que avança sozinho em ciclo (0, 1, ..., length-1, 0...). Pausa se o usuário preferir menos movimento. */
export function useRotatingIndex(length: number, { intervalMs, paused = false }: RotatingIndexOptions) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isRotating = length > 1 && !paused && !prefersReducedMotion;

  useEffect(() => {
    if (!isRotating) return;

    const timer = window.setInterval(() => setIndex((current) => (current + 1) % length), intervalMs);
    return () => window.clearInterval(timer);
  }, [isRotating, length, intervalMs]);

  return [index, setIndex] as const;
}
