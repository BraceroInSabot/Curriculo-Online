import type { ReactNode } from 'react';
import { Container } from '../Container/Container';
import styles from './Section.module.css';

type SectionTone = 'light' | 'muted';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  readonly tone?: SectionTone;
  readonly children: ReactNode;
}

/** Seção padrão com título em caixa-alta ladeado por linhas, como no site de referência. */
export function Section({ id, title, tone = 'light', children }: SectionProps) {
  const headingId = `${id}-titulo`;

  return (
    <section id={id} className={`${styles.section} ${styles[tone]}`} aria-labelledby={headingId}>
      <Container>
        <h2 id={headingId} className={styles.heading}>
          <span>{title}</span>
        </h2>
        {children}
      </Container>
    </section>
  );
}
