import type { EducationOverview, EducationStatus } from '@application/use-cases/GetResumeOverview';
import { Section } from '../../components/Section/Section';
import { Tag } from '../../components/Tag/Tag';
import { formatPeriod } from '../../formatters/periodFormatter';
import styles from './EducationSection.module.css';

interface EducationSectionProps {
  readonly id: string;
  readonly education: readonly EducationOverview[];
}

const STATUS_LABEL: Record<EducationStatus, string> = {
  'em-andamento': 'em andamento',
  concluido: 'concluído',
};

export function EducationSection({ id, education }: EducationSectionProps) {
  return (
    <Section id={id} title="Formação acadêmica" tone="muted">
      <ul className={styles.grid}>
        {education.map((item) => (
          <li key={item.id} className={styles.card}>
            <div className={styles.top}>
              <span className={styles.level}>{item.level}</span>
              <Tag tone={item.status === 'em-andamento' ? 'accent' : 'outline'}>{STATUS_LABEL[item.status]}</Tag>
            </div>
            <h3 className={styles.course}>{item.course}</h3>
            <p className={styles.institution}>{item.institution}</p>
            <p className={styles.period}>{formatPeriod(item.period)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
