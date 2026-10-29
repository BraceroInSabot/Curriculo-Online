import type { Profile } from '@domain/entities/Resume';
import { ButtonLink } from '../../components/Button/Button';
import { Container } from '../../components/Container/Container';
import { Marquee } from '../../components/Marquee/Marquee';
import { RotatingWord } from '../../components/RotatingWord/RotatingWord';
import { useRotatingIndex } from '../../hooks/useRotatingIndex';
import { SECTION_IDS } from '../../navigation';
import styles from './HeroSection.module.css';
import { PhotoStage } from './PhotoStage';

interface HeroSectionProps {
  readonly id: string;
  readonly profile: Profile;
  readonly keywords: readonly string[];
}

const ROLE_INTERVAL_MS = 5500;

export function HeroSection({ id, profile, keywords }: HeroSectionProps) {
  const [activeRoleIndex] = useRotatingIndex(profile.roles.length, { intervalMs: ROLE_INTERVAL_MS });
  const [firstName, ...otherNames] = profile.shortName.split(' ');

  return (
    <section id={id} className={styles.hero} aria-label="Apresentação">
      <Container>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <h1 className={styles.name}>
              <span className={styles.reveal}>{firstName}</span>
              <span className={`${styles.reveal} ${styles.outlined}`}>{otherNames.join(' ')}</span>
              <span className="sr-only">, {profile.headline}</span>
            </h1>

            {profile.roles.length > 0 && (
              <p className={`${styles.roleLine} ${styles.reveal}`}>
                sou <RotatingWord words={profile.roles} activeIndex={activeRoleIndex} />
                <span className="sr-only">{profile.roles.join(' e ')}</span>
              </p>
            )}

            <p className={`${styles.tagline} ${styles.reveal}`}>{profile.tagline}</p>

            <div className={`${styles.actions} ${styles.reveal}`}>
              <ButtonLink href={`#${SECTION_IDS.projects}`} icon="arrow-right">
                Ver projetos
              </ButtonLink>
              <ButtonLink href={`#${SECTION_IDS.contact}`} variant="secondary">
                Fale comigo
              </ButtonLink>
            </div>
          </div>

          <div className={styles.photo}>
            <PhotoStage
              fullName={profile.fullName}
              avatarUrl={profile.avatarUrl}
              badgeWords={[...profile.roles, profile.location]}
            />
          </div>
        </div>
      </Container>

      <Marquee items={keywords} />
    </section>
  );
}
