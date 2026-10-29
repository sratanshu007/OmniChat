import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

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
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        <Defs>
          <LinearGradient id="ciGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#08C261" />
            <Stop offset="100%" stopColor="#047857" />
          </LinearGradient>
        </Defs>

        {/* Outer Green Rounded Badge */}
        <Rect x="4" y="4" width="92" height="92" rx="28" fill="url(#ciGreenGrad)" />

        {/* Primary Left Chat Bubble (White) */}
        <Path
          d="M22 46C22 34.9543 30.9543 26 42 26C53.0457 26 62 34.9543 62 46C62 57.0457 53.0457 66 42 66C38.6863 66 35.5878 65.19 32.8719 63.7601L23.5 67L25.8 58.5C23.4 54.8 22 50.6 22 46Z"
          fill="#FFFFFF"
        />

        {/* Two Eyes in Left Bubble */}
        <Circle cx="35" cy="45" r="3.2" fill="#047857" />
        <Circle cx="47" cy="45" r="3.2" fill="#047857" />

        {/* Secondary Overlapping Right Chat Bubble */}
        <Path
          d="M52 50C52 42.8203 58.268 37 66 37C73.732 37 80 42.8203 80 50C80 57.1797 73.732 63 66 63C63.6 63 61.4 62.4 59.4 61.4L53 64L54.7 58.3C53 55.8 52 53 52 50Z"
          fill="#FFFFFF"
          stroke="#047857"
          strokeWidth="1.5"
        />

        {/* Two Eyes in Right Bubble */}
        <Circle cx="62" cy="49" r="2.4" fill="#047857" />
        <Circle cx="70" cy="49" r="2.4" fill="#047857" />
      </Svg>

      {showText && (
        <View style={styles.textContainer}>
          <Text style={[styles.brandTitle, { color: resolvedTextColor }]}>
            Chat<Text style={{ color: '#07C160', fontWeight: '900' }}>India</Text>
          </Text>
          {tagline ? (
            <Text style={[styles.tagline, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
              {tagline}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  textContainer: {
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1
  }
});
