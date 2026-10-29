import type { Project } from '@domain/entities/Resume';
import { ButtonLink } from '../../components/Button/Button';
import { Icon } from '../../components/Icon/Icon';
import { Section } from '../../components/Section/Section';
import { Tag } from '../../components/Tag/Tag';
import { ProjectCover } from './ProjectCover';
import styles from './ProjectsSection.module.css';

interface ProjectsSectionProps {
  readonly id: string;
  readonly featured: readonly Project[];
  readonly others: readonly Project[];
  readonly allProjectsUrl?: string;
}

export function ProjectsSection({ id, featured, others, allProjectsUrl }: ProjectsSectionProps) {
  return (
    <Section id={id} title="Alguns dos meus projetos" tone="muted">
      <ul className={styles.cards}>
        {featured.map((project, index) => (
          <li key={project.id}>
            <ProjectCard project={project} index={index} />
          </li>
        ))}
      </ul>

      {others.length > 0 && (
        <div className={styles.others}>
          <h3 className={styles.othersTitle}>Outros projetos</h3>
          <ul className={styles.list}>
            {others.map((project) => (
              <li key={project.id}>
                <ProjectRow project={project} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {allProjectsUrl && (
        <div className={styles.more}>
          <ButtonLink href={allProjectsUrl} target="_blank" rel="noreferrer" variant="secondary" icon="arrow-right">
            Ver todos no GitHub
          </ButtonLink>
        </div>
      )}
    </Section>
  );
}

function ProjectCard({ project, index }: { readonly project: Project; readonly index: number }) {
  return (
    <article className={styles.card}>
      <ProjectCover project={project} index={index} />
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className={styles.stretchedLink}>
            {project.name}
          </a>
        </h3>
        <p className={styles.category}>{project.category}</p>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.cardFooter}>
          <span className={styles.repoHint}>
            <Icon name="github" size={16} /> Repositório
          </span>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.liveLink}>
              Ver online <Icon name="external" size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project }: { readonly project: Project }) {
  return (
    <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className={styles.row}>
      <span className={styles.rowName}>{project.name}</span>
      <span className={styles.rowDescription}>{project.description}</span>
      <span className={styles.rowStack}>
        {project.stack.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </span>
      <Icon name="arrow-right" size={18} className={styles.rowArrow} />
    </a>
  );
}
