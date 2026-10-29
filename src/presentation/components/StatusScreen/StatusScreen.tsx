import styles from './StatusScreen.module.css';

export function StatusScreen({ message }: { readonly message: string }) {
  return (
    <div className={styles.screen} role="status">
      <span className={styles.dot} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
