import { useCallback, useLayoutEffect, useRef, useState, type TransitionEvent } from 'react';
import styles from './RotatingWord.module.css';

interface RotatingWordProps {
  readonly words: readonly string[];
  readonly activeIndex: number;
}

/**
 * Palavra que troca com crossfade suave. Todas as palavras ficam empilhadas no DOM,
 * então a saída e a entrada animam ao mesmo tempo; a largura do destaque acompanha
 * a palavra ativa com transição.
 */
export function RotatingWord({ words, activeIndex }: RotatingWordProps) {
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [transition, setTransition] = useState({ current: activeIndex, previous: -1 });

  // Guarda a palavra anterior para ela sair por cima enquanto a nova entra por baixo.
  if (transition.current !== activeIndex) {
    setTransition({ current: activeIndex, previous: transition.current });
  }

  // Quando a saída termina, a palavra volta (invisível) para baixo, pronta para entrar de novo.
  const finishExit = (event: TransitionEvent<HTMLSpanElement>) => {
    if (event.propertyName !== 'transform') return;
    setTransition((state) => ({ ...state, previous: -1 }));
  };

  const measureActiveWord = useCallback(() => {
    setWidth(wordRefs.current[activeIndex]?.offsetWidth);
  }, [activeIndex]);

  useLayoutEffect(() => {
    measureActiveWord();
    document.fonts?.ready.then(measureActiveWord);
    window.addEventListener('resize', measureActiveWord);
    return () => window.removeEventListener('resize', measureActiveWord);
  }, [measureActiveWord]);

  return (
    <span className={styles.window} style={{ width }} aria-hidden="true">
      {words.map((word, index) => (
        <span
          key={word}
          ref={(element) => {
            wordRefs.current[index] = element;
          }}
          className={styles.word}
          data-state={stateOf(index, activeIndex, transition.previous)}
          onTransitionEnd={index === transition.previous ? finishExit : undefined}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

type WordState = 'active' | 'exiting' | 'waiting';

function stateOf(index: number, activeIndex: number, previousIndex: number): WordState {
  if (index === activeIndex) return 'active';
  return index === previousIndex ? 'exiting' : 'waiting';
}
