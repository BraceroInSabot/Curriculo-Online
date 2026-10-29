import type { CSSProperties } from 'react';
import type { Project } from '@domain/entities/Resume';
import styles from './ProjectCover.module.css';

const ACCENTS = ['var(--accent-yellow)', 'var(--accent-teal)', 'var(--accent-coral)'] as const;
const MAX_STACK_ITEMS = 3;

interface ProjectCoverProps {
  readonly project: Project;
  readonly index: number;
}

/** Capa gerada em código: uma "janela de editor" com o projeto descrito como objeto. */
export function ProjectCover({ project, index }: ProjectCoverProps) {
  const accent = ACCENTS[index % ACCENTS.length];
  const stack = project.stack.slice(0, MAX_STACK_ITEMS);

  return (
    <div className={styles.cover} style={{ '--accent': accent } as CSSProperties} aria-hidden="true">
      <div className={styles.window}>
        <div className={styles.chrome}>
          <span />
          <span />
          <span />
          <em>{project.id}.ts</em>
        </div>
        <pre className={styles.code}>
          <span className={styles.keyword}>const</span> projeto = {'{\n'}
          {'  '}nome: <span className={styles.string}>"{project.name}"</span>,{'\n'}
          {'  '}tipo: <span className={styles.string}>"{project.category}"</span>,{'\n'}
          {'  '}stack: [{stack.map((item, position) => (
            <span key={item}>
              <span className={styles.string}>"{item}"</span>
              {position < stack.length - 1 ? ', ' : ''}
            </span>
          ))}],{'\n'}
          {'}'};
        </pre>
      </div>
    </div>
  );
}
