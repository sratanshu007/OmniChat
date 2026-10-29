import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  isDark?: boolean;
  tagline?: string;
}

export const ChatIndiaLogo: React.FC<LogoProps> = ({
  size = 48,
  showText = false,
  textColor,
  isDark = false,
  tagline = 'Chat • Connect • Share'
}) => {
  const defaultTextColor = isDark ? '#FFFFFF' : '#111827';
  const resolvedTextColor = textColor || defaultTextColor;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ciGreenGradAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#08C261" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Outer Green Rounded Badge */}
        <rect x="4" y="4" width="92" height="92" rx="28" fill="url(#ciGreenGradAdmin)" />

        {/* Primary Left Chat Bubble (White) */}
        <path
          d="M22 46C22 34.9543 30.9543 26 42 26C53.0457 26 62 34.9543 62 46C62 57.0457 53.0457 66 42 66C38.6863 66 35.5878 65.19 32.8719 63.7601L23.5 67L25.8 58.5C23.4 54.8 22 50.6 22 46Z"
          fill="#FFFFFF"
        />

        {/* Two Eyes in Left Bubble */}
        <circle cx="35" cy="45" r="3.2" fill="#047857" />
        <circle cx="47" cy="45" r="3.2" fill="#047857" />

        {/* Secondary Overlapping Right Chat Bubble */}
        <path
          d="M52 50C52 42.8203 58.268 37 66 37C73.732 37 80 42.8203 80 50C80 57.1797 73.732 63 66 63C63.6 63 61.4 62.4 59.4 61.4L53 64L54.7 58.3C53 55.8 52 53 52 50Z"
          fill="#FFFFFF"
          stroke="#047857"
          strokeWidth="1.5"
        />

        {/* Two Eyes in Right Bubble */}
        <circle cx="62" cy="49" r="2.4" fill="#047857" />
        <circle cx="70" cy="49" r="2.4" fill="#047857" />
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: resolvedTextColor, letterSpacing: '-0.4px', lineHeight: 1.1 }}>
            Chat<span style={{ color: '#07c160' }}>India</span>
          </div>
          {tagline && (
            <div style={{ fontSize: '11px', fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', marginTop: '3px', letterSpacing: '0.2px' }}>
              {tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

