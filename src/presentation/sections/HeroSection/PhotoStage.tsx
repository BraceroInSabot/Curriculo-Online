import { Avatar } from '../../components/Avatar/Avatar';
import { RotatingBadge } from '../../components/RotatingBadge/RotatingBadge';
import { usePointerParallax } from '../../hooks/usePointerParallax';
import styles from './PhotoStage.module.css';

interface PhotoStageProps {
  readonly fullName: string;
  readonly avatarUrl: string;
  readonly badgeWords: readonly string[];
}

/**
 * Foto em card inclinado sobre um bloco de cor, com um selo girando no canto.
 * As camadas reagem ao mouse com profundidades diferentes (parallax via variáveis CSS).
 */
export function PhotoStage({ fullName, avatarUrl, badgeWords }: PhotoStageProps) {
  const parallax = usePointerParallax<HTMLDivElement>();

  return (
    <div className={styles.stage} {...parallax}>
      <span className={styles.backdrop} aria-hidden="true" />

      <figure className={styles.card}>
        <Avatar src={avatarUrl} alt={`Foto de ${fullName}`} className={styles.photo} />
      </figure>

      <RotatingBadge words={badgeWords} center="</>" className={styles.badge} />
    </div>
  );
}
