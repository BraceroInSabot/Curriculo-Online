import { useCallback, type PointerEvent } from 'react';

/**
 * Escreve a posição do mouse (de -1 a 1 em cada eixo) nas variáveis CSS `--px` e `--py`
 * do elemento. O CSS decide quanto cada camada se move — sem re-render do React.
 */
export function usePointerParallax<T extends HTMLElement>() {
  const onPointerMove = useCallback((event: PointerEvent<T>) => {
    if (event.pointerType !== 'mouse') return;

    const element = event.currentTarget;
    const bounds = element.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;

    element.style.setProperty('--px', x.toFixed(3));
    element.style.setProperty('--py', y.toFixed(3));
  }, []);

  const onPointerLeave = useCallback((event: PointerEvent<T>) => {
    event.currentTarget.style.setProperty('--px', '0');
    event.currentTarget.style.setProperty('--py', '0');
  }, []);

  return { onPointerMove, onPointerLeave };
}
