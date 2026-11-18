import React from 'react';

interface VeracyLogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const VeracyLogo: React.FC<VeracyLogoProps> = ({
  variant = 'dark',
  className = 'h-12 w-auto',
}) => {
  const imageSrc =
    variant === 'light' ? '/veracy-logo-light.png' : '/veracy-logo-main.png';
  const subtitleFill = variant === 'light' ? '#E6CA85' : '#0b192c';

  return (
    <svg
      viewBox="0 0 815 377"
      width={815}
      height={377}
      role="img"
      aria-label="Veracy Immobilien"
      className={`aspect-[815/377] ${className}`}
    >
      <image href={imageSrc} x="0" y="0" width="815" height="377" />
      <text
        x="410"
        y="282"
        fill={subtitleFill}
        fontFamily="Inter, 'Montserrat', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontSize="36"
        fontWeight="700"
        textLength="387"
        lengthAdjust="spacing"
      >
        IMMOBILIEN
      </text>
    </svg>
  );
};
