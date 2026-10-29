import type { NavigationItem } from '../../navigation';
import { Container } from '../Container/Container';
import { Icon } from '../Icon/Icon';
import styles from './Footer.module.css';

interface FooterProps {
  readonly ownerName: string;
  readonly navigation: readonly NavigationItem[];
  readonly topAnchor: string;
}

export function Footer({ ownerName, navigation, topAnchor }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <a href={`#${topAnchor}`} className={styles.backToTop} aria-label="Voltar ao topo">
        <Icon name="chevron-up" size={26} />
      </a>

      <Container>
        <div className={styles.bar}>
          <a href={`#${topAnchor}`} className={styles.copyright}>
            © {year} {ownerName}
          </a>
          <nav aria-label="Navegação do rodapé">
            <ul className={styles.links}>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
