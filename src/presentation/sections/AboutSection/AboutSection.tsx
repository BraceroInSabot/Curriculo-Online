import type { EducationOverview, ExperienceOverview } from '@application/use-cases/GetResumeOverview';
import type { Profile } from '@domain/entities/Resume';
import { ButtonLink } from '../../components/Button/Button';
import { Section } from '../../components/Section/Section';
import { SECTION_IDS } from '../../navigation';
import styles from './AboutSection.module.css';

interface AboutSectionProps {
  readonly id: string;
  readonly profile: Profile;
  readonly currentPosition: ExperienceOverview | null;
  readonly education: readonly EducationOverview[];
}

interface Fact {
  readonly label: string;
  readonly value: string;
}

function buildFacts(profile: Profile, currentPosition: ExperienceOverview | null, education: readonly EducationOverview[]): Fact[] {
  const ongoingCourse = education.find((item) => item.status === 'em-andamento');
  const latestDegree = education.find((item) => item.status === 'concluido');

  const facts: (Fact | null)[] = [
    { label: 'Localização', value: profile.location },
    currentPosition ? { label: 'Atualmente', value: currentPosition.role } : null,
    latestDegree ? { label: 'Formação', value: `${latestDegree.course} · ${latestDegree.institution}` } : null,
    ongoingCourse ? { label: 'Cursando', value: `${ongoingCourse.level} em ${ongoingCourse.course} · ${ongoingCourse.institution}` } : null,
  ];

  return facts.filter((fact): fact is Fact => fact !== null);
}

export function AboutSection({ id, profile, currentPosition, education }: AboutSectionProps) {
  const facts = buildFacts(profile, currentPosition, education);

  return (
    <Section id={id} title="Sobre mim" tone="muted">
      <div className={styles.grid}>
        <div>
          <p className={styles.greeting}>
            Entre a <strong>sala de aula</strong> e o <strong>código</strong>.
          </p>
          <div className={styles.text}>
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className={styles.actions}>
            <ButtonLink href={`#${SECTION_IDS.projects}`} icon="arrow-right">
              Ver projetos
            </ButtonLink>
            <ButtonLink href={`#${SECTION_IDS.contact}`} variant="secondary">
              Entrar em contato
            </ButtonLink>
          </div>
        </div>

        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
