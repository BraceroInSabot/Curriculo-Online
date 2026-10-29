import type { ReactNode } from 'react';
import styles from './Tag.module.css';

type TagTone = 'neutral' | 'accent' | 'outline';

interface TagProps {
  readonly children: ReactNode;
  readonly tone?: TagTone;
}

export function Tag({ children, tone = 'neutral' }: TagProps) {
  return <span className={`${styles.tag} ${styles[tone]}`}>{children}</span>;
}
