import type { SkillGroup } from '@domain/entities/Resume';
import { Section } from '../../components/Section/Section';
import { Tag } from '../../components/Tag/Tag';
import styles from './SkillsSection.module.css';

interface SkillsSectionProps {
  readonly id: string;
  readonly skillGroups: readonly SkillGroup[];
}

export function SkillsSection({ id, skillGroups }: SkillsSectionProps) {
  return (
    <Section id={id} title="Habilidades">
      <div className={styles.grid}>
        {skillGroups.map((group, index) => (
          <div key={group.category} className={styles.group}>
            <h3 className={styles.category}>
              <span className={styles.index}>{String(index + 1).padStart(2, '0')}</span>
              {group.category}
            </h3>
            <ul className={styles.skills}>
              {group.skills.map((skill) => (
                <li key={skill}>
                  <Tag tone="outline">{skill}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
