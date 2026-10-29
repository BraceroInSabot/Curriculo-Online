import type { ReactNode } from 'react';
import styles from './Container.module.css';

export function Container({ children }: { readonly children: ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}
