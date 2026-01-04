import React from 'react';

interface PastelSectionProps {
  children: React.ReactNode;
  variant?: 'top' | 'bottom' | 'both' | 'none';
  bgColor?: string;
  className?: string;
  id?: string;
}

export function PastelSection({ 
  children, 
  variant = 'both', 
  bgColor = '#1B1511',
  className = '',
  id
}: PastelSectionProps) {
  const gradientId = `gradient-${bgColor.replace('#', '').replace(/\s/g, '')}`;
  
  const WaveSeparator = ({ flip = false }: { flip?: boolean }) => (
    <div className={`w-full ${flip ? 'rotate-180' : ''}`} style={{ marginTop: flip ? '-1px' : '0', marginBottom: flip ? '-1px' : '0', lineHeight: 0 }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-16 md:h-20"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={bgColor} stopOpacity="1" />
            <stop offset="100%" stopColor={bgColor} stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 Q150,90 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
          fill={`url(#${gradientId})`}
          style={{ filter: 'drop-shadow(0 -3px 10px rgba(231, 168, 68, 0.12))' }}
        />
      </svg>
    </div>
  );

  return (
    <section id={id} className={`relative ${className}`} style={{ backgroundColor: bgColor }}>
      {variant === 'top' || variant === 'both' ? <WaveSeparator /> : null}
      <div className="relative z-10">{children}</div>
      {variant === 'bottom' || variant === 'both' ? <WaveSeparator flip /> : null}
    </section>
  );
}

