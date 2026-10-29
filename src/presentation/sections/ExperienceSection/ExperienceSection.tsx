import type { ExperienceOverview } from '@application/use-cases/GetResumeOverview';
import { Section } from '../../components/Section/Section';
import { Tag } from '../../components/Tag/Tag';
import { formatDuration, formatPeriod } from '../../formatters/periodFormatter';
import styles from './ExperienceSection.module.css';

interface ExperienceSectionProps {
  readonly id: string;
  readonly experiences: readonly ExperienceOverview[];
}

export function ExperienceSection({ id, experiences }: ExperienceSectionProps) {
  return (
    <Section id={id} title="Experiência profissional">
      <ol className={styles.timeline}>
        {experiences.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </ol>
    </Section>
  );
}

function ExperienceItem({ experience }: { readonly experience: ExperienceOverview }) {
  return (
    <li className={`${styles.item} ${experience.isCurrent ? styles.current : ''}`}>
      <div className={styles.when}>
        <span className={styles.period}>{formatPeriod(experience.period)}</span>
        <span className={styles.duration}>{formatDuration(experience.durationInMonths)}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.roleLine}>
          <h3 className={styles.role}>{experience.role}</h3>
          {experience.isCurrent && <Tag tone="accent">atual</Tag>}
        </div>
        <p className={styles.organization}>
          {experience.organization} <span aria-hidden="true">·</span> {experience.location}
        </p>
        <p className={styles.summary}>{experience.summary}</p>

        {experience.highlights.length > 0 && (
          <ul className={styles.highlights}>
            {experience.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
