import { useId } from 'react';
import styles from './RotatingBadge.module.css';

interface RotatingBadgeProps {
  readonly words: readonly string[];
  readonly center: string;
  readonly className?: string;
}

const SEPARATOR = ' • ';

/** Selo circular com texto girando em volta de um símbolo central. */
export function RotatingBadge({ words, center, className }: RotatingBadgeProps) {
  const pathId = `badge-path-${useId().replace(/:/g, '')}`;
  const ringText = words.map((word) => word.toUpperCase()).join(SEPARATOR) + SEPARATOR;

  return (
    <div className={`${styles.badge} ${className ?? ''}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className={styles.ring}>
        <defs>
          <path id={pathId} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className={styles.text}>
          <textPath href={`#${pathId}`} textLength="289" lengthAdjust="spacing">
            {ringText}
          </textPath>
        </text>
      </svg>
      <span className={styles.center}>{center}</span>
    </div>
  );
}
