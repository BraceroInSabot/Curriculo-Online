import styles from './Marquee.module.css';

interface MarqueeProps {
  readonly items: readonly string[];
}

/** Faixa com palavras rolando infinitamente. A lista é duplicada para o loop não ter emenda. */
export function Marquee({ items }: MarqueeProps) {
  const renderTrack = (copy: number) => (
    <ul className={styles.track} aria-hidden={copy > 0 ? true : undefined}>
      {items.map((item) => (
        <li key={`${copy}-${item}`} className={styles.item}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.marquee}>
      <span className="sr-only">Tecnologias e áreas: {items.join(', ')}</span>
      <div className={styles.rail} aria-hidden="true">
        {renderTrack(0)}
        {renderTrack(1)}
      </div>
    </div>
  );
}
