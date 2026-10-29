import { useState } from 'react';

export const AVATAR_FALLBACK_SRC = './avatar-placeholder.svg';

interface AvatarProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
}

/** Imagem que troca para um placeholder local se a foto remota não carregar. */
export function Avatar({ src, alt, className }: AvatarProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const showFallback = () => setCurrentSrc(AVATAR_FALLBACK_SRC);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={currentSrc === AVATAR_FALLBACK_SRC ? undefined : showFallback}
      draggable={false}
    />
  );
}
