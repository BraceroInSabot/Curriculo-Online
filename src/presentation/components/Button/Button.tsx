import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly variant?: ButtonVariant;
  readonly icon?: IconName;
  readonly children: ReactNode;
}

export function ButtonLink({ variant = 'primary', icon, children, className, ...rest }: ButtonLinkProps) {
  return (
    <a className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest}>
      <span>{children}</span>
      {icon && <Icon name={icon} size={18} />}
    </a>
  );
}
