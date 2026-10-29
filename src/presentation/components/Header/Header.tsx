import { useState } from 'react';
import type { ContactLink } from '@domain/entities/Resume';
import { useScrolledPast } from '../../hooks/useScrolledPast';
import type { NavigationItem } from '../../navigation';
import { Container } from '../Container/Container';
import { Icon } from '../Icon/Icon';
import { Logo } from '../Logo/Logo';
import { SocialLinks } from '../SocialLinks/SocialLinks';
import styles from './Header.module.css';

interface HeaderProps {
  readonly name: string;
  readonly homeHref: string;
  readonly navigation: readonly NavigationItem[];
  readonly socialLinks: readonly ContactLink[];
}

const SCROLL_SHADOW_OFFSET = 8;

export function Header({ name, homeHref, navigation, socialLinks }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hasScrolled = useScrolledPast(SCROLL_SHADOW_OFFSET);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`${styles.header} ${hasScrolled ? styles.scrolled : ''}`}>
      <Container>
        <div className={styles.bar}>
          <Logo name={name} href={homeHref} />

          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="menu-principal"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Icon name={isMenuOpen ? 'close' : 'menu'} size={28} />
          </button>

          <nav
            id="menu-principal"
            className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}
            aria-label="Navegação principal"
          >
            <ul className={styles.links}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={styles.link} onClick={closeMenu}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <SocialLinks links={socialLinks} variant="onDark" />
          </nav>
        </div>
      </Container>
    </header>
  );
}
