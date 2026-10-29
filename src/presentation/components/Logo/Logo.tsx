import styles from './Logo.module.css';

interface LogoProps {
  readonly name: string;
  readonly href: string;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

export function Logo({ name, href }: LogoProps) {
  return (
    <a href={href} className={styles.logo} aria-label={`${name} — voltar ao início`}>
      <span className={styles.mark} aria-hidden="true">
        {initialsOf(name)}
      </span>
      <span className={styles.name}>{name}</span>
    </a>
  );
}
