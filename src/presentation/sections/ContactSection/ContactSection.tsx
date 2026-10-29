import type { ContactLink } from '@domain/entities/Resume';
import { ButtonLink } from '../../components/Button/Button';
import { Container } from '../../components/Container/Container';
import { Icon } from '../../components/Icon/Icon';
import { SocialLinks } from '../../components/SocialLinks/SocialLinks';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  readonly id: string;
  readonly location: string;
  readonly contacts: readonly ContactLink[];
}

export function ContactSection({ id, location, contacts }: ContactSectionProps) {
  const email = contacts.find((contact) => contact.kind === 'email');

  return (
    <section id={id} className={styles.contact} aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Contato</p>
          <h2 id={`${id}-titulo`} className={styles.title}>
            Vamos construir algo <span className={styles.highlight}>juntos</span>?
          </h2>
          <p className={styles.text}>
            Aberto a oportunidades em desenvolvimento, projetos freelance e parcerias em educação e tecnologia.
          </p>

          <div className={styles.actions}>
            {email && (
              <ButtonLink href={email.url} icon="arrow-right">
                {email.label}
              </ButtonLink>
            )}
            <SocialLinks links={contacts.filter((contact) => contact.kind !== 'email')} variant="onLight" />
          </div>

          <p className={styles.location}>
            <Icon name="pin" size={16} /> {location} · Brasil
          </p>
        </div>
      </Container>
    </section>
  );
}
