import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { ChatIndiaLogo } from '../../src/components/ChatIndiaLogo';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Auto transition to Screen 02 (Onboarding) after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2800);
    return () => clearTimeout(timer);
  }, [router]);

  const handleNext = () => {
    router.replace('/onboarding');
  };

  const handleDirectApp = () => {
    router.replace('/(tabs)/chats');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Background Gradient */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="splashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#0B5D36" />
            <Stop offset="45%" stopColor="#064E2C" />
            <Stop offset="100%" stopColor="#032D19" />
          </LinearGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#splashGrad)" />
      </Svg>

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
        {/* Top Direct Skip Pill */}
        <View style={styles.topSkipRow}>
          <TouchableOpacity
            style={styles.skipPill}
            onPress={handleDirectApp}
            activeOpacity={0.8}
          >
            <Text style={styles.skipPillText}>Skip to App ⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Brand Center matching Screen 01 */}
        <View style={styles.heroCenter}>
          <View style={styles.logoBadgeContainer}>
            <ChatIndiaLogo size={84} />
          </View>

          <Text style={styles.appTitle}>ChatIndia</Text>
          <Text style={styles.tagline}>Chat  •  Connect  •  Share</Text>

          <View style={styles.pillBadge}>
            <Text style={styles.pillText}>Digital India Community 🇮🇳</Text>
          </View>
        </View>

        {/* Bottom Section with Indian Heritage Monuments Skyline matching Screen 01 */}
        <View style={styles.bottomSection}>
          <Text style={styles.slogan}>Bringing People Closer</Text>

          {/* SVG Indian Monuments Silhouette: Taj Mahal, India Gate, Lotus Temple & Minarets */}
          <View style={styles.skylineContainer}>
            <Svg width={width} height={110} viewBox="0 0 360 110" fill="none">
              <Defs>
                <LinearGradient id="skylineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor="#083E23" stopOpacity="0.9" />
                  <Stop offset="100%" stopColor="#021C10" stopOpacity="0.98" />
                </LinearGradient>
              </Defs>

              {/* Distant domes */}
              <Path
                d="M10 110V85L20 72L30 85V110H10Z M45 110V76Q55 58 65 76V110H45Z M78 110V68L88 50L98 68V110H78Z"
                fill="#0A4D2B"
                opacity="0.5"
              />

              {/* India Gate arch (Center-Left) */}
              <Path
                d="M108 110V42H168V110H155V66Q138 52 121 66V110H108Z"
                fill="url(#skylineGrad)"
              />
              <Rect x="103" y="39" width="70" height="4.5" rx="1" fill="#0A4D2B" />
              <Rect x="110" y="35" width="56" height="4.5" rx="1" fill="#0A4D2B" />

              {/* Lotus Temple Petals (Center-Right) */}
              <Path
                d="M198 110Q203 70 218 52Q233 70 238 110Z"
                fill="url(#skylineGrad)"
              />
              <Path
                d="M188 110Q198 80 208 66Q218 85 218 110Z"
                fill="url(#skylineGrad)"
                opacity="0.8"
              />
              <Path
                d="M218 110Q223 85 233 66Q243 80 248 110Z"
                fill="url(#skylineGrad)"
                opacity="0.8"
              />

              {/* Taj Mahal & Minarets (Right) */}
              <Path
                d="M272 110V56Q287 38 302 56V110H272Z"
                fill="url(#skylineGrad)"
              />
              {/* Spire */}
              <Path d="M287 38V28H288V38Z" stroke="#34D399" strokeWidth="1.8" />
              {/* Minarets */}
              <Path d="M262 110V46L265 42L268 46V110H262Z" fill="url(#skylineGrad)" />
              <Path d="M308 110V46L311 42L314 46V110H308Z" fill="url(#skylineGrad)" />

              {/* Ground base */}
              <Rect x="0" y="106" width="360" height="4" fill="#021C10" />
            </Svg>
          </View>

          {/* Action button to proceed */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text style={styles.continueText}>Get Started  →</Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>Made for India • Built for You 🇮🇳</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#054B2A'
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  topSkipRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8
  },
  skipPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  skipPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  heroCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  logoBadgeContainer: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8
  },
  appTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D1FAE5',
    letterSpacing: 1.2,
    marginBottom: 16
  },
  pillBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20
  },
  slogan: {
    fontSize: 14.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
    marginBottom: 8
  },
  skylineContainer: {
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden'
  },
  continueBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 38,
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4
  },
  continueText: {
    color: '#047857',
    fontSize: 16,
    fontWeight: '800'
  },
  footerNote: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)'
  }
});
