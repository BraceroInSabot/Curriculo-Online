import type { ContactLink } from '@domain/entities/Resume';
import { Icon } from '../Icon/Icon';
import styles from './SocialLinks.module.css';

interface SocialLinksProps {
  readonly links: readonly ContactLink[];
  readonly variant?: 'onDark' | 'onLight';
}

export function SocialLinks({ links, variant = 'onDark' }: SocialLinksProps) {
  return (
    <ul className={`${styles.list} ${styles[variant]}`}>
      {links.map((link) => (
        <li key={link.kind}>
          <a
            href={link.url}
            className={styles.link}
            title={link.label}
            aria-label={link.label}
            target={link.kind === 'email' ? undefined : '_blank'}
            rel="noreferrer"
          >
            <Icon name={link.kind} size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
