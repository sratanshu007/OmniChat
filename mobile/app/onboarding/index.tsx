import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
  Text as SvgText
} from 'react-native-svg';
import { ChevronRight, ArrowRight, Globe } from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

const { width } = Dimensions.get('window');

// SVG Illustration 1: Welcome to ChatIndia (Two people chatting on smartphones)
const IllustrationWelcome = () => (
  <Svg width={260} height={200} viewBox="0 0 260 200" fill="none">
    <Defs>
      <LinearGradient id="bgGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#E8F8F0" />
        <Stop offset="100%" stopColor="#D1FAE5" />
      </LinearGradient>
      <LinearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#07C160" />
        <Stop offset="100%" stopColor="#047857" />
      </LinearGradient>
      <LinearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FBBF24" />
        <Stop offset="100%" stopColor="#D97706" />
      </LinearGradient>
    </Defs>

    {/* Background Soft Bubble */}
    <Circle cx="130" cy="100" r="90" fill="url(#bgGrad1)" />

    {/* Left Character (Male in green hoodie) */}
    {/* Head & Hair */}
    <Circle cx="76" cy="56" r="20" fill="#E0A96D" />
    <Path d="M56 54C56 42 66 36 76 36C86 36 96 42 96 54C96 46 88 40 76 40C64 40 56 46 56 54Z" fill="#1F2937" />
    {/* Body / Green Hoodie */}
    <Path d="M46 130V94C46 84 56 76 68 76H84C96 76 106 84 106 94V130H46Z" fill="url(#hoodieGrad)" />
    {/* Arms holding phone */}
    <Path d="M86 94L102 110L94 116L80 100Z" fill="#E0A96D" />
    {/* Smartphone */}
    <Rect x="96" y="96" width="20" height="34" rx="4" fill="#1F2937" />
    <Rect x="98" y="99" width="16" height="28" rx="2" fill="#34D399" />

    {/* Right Character (Female in bright yellow) */}
    {/* Head & Hair */}
    <Circle cx="178" cy="62" r="19" fill="#D49B6A" />
    <Path d="M158 64C158 46 168 40 178 40C188 40 198 46 198 64V76H158V64Z" fill="#111827" />
    {/* Body / Yellow Kurti / Top */}
    <Path d="M150 134V98C150 88 160 80 172 80H184C196 80 206 88 206 98V134H150Z" fill="url(#yellowGrad)" />
    {/* Arms holding phone */}
    <Path d="M166 98L150 114L156 120L172 104Z" fill="#D49B6A" />
    {/* Smartphone */}
    <Rect x="140" y="102" width="20" height="34" rx="4" fill="#1F2937" />
    <Rect x="142" y="105" width="16" height="28" rx="2" fill="#FFFFFF" />

    {/* Floating Chat Bubbles */}
    <G>
      <Rect x="110" y="34" width="46" height="24" rx="8" fill="#07C160" />
      <Circle cx="122" cy="46" r="2.5" fill="#FFFFFF" />
      <Circle cx="132" cy="46" r="2.5" fill="#FFFFFF" />
      <Circle cx="142" cy="46" r="2.5" fill="#FFFFFF" />
      <Path d="M118 58L124 58L120 64Z" fill="#07C160" />
    </G>

    <G>
      <Rect x="142" y="14" width="40" height="20" rx="6" fill="#FFFFFF" stroke="#07C160" strokeWidth="1.5" />
      <Circle cx="152" cy="24" r="2" fill="#07C160" />
      <Circle cx="160" cy="24" r="2" fill="#07C160" />
      <Circle cx="168" cy="24" r="2" fill="#07C160" />
    </G>
  </Svg>
);

// SVG Illustration 2: Join Communities (Group of friends celebrating)
const IllustrationCommunities = () => (
  <Svg width={260} height={200} viewBox="0 0 260 200" fill="none">
    <Defs>
      <LinearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#EFF6FF" />
        <Stop offset="100%" stopColor="#DBEAFE" />
      </LinearGradient>
    </Defs>
    <Circle cx="130" cy="100" r="90" fill="url(#bgGrad2)" />

    {/* Center Character */}
    <Circle cx="130" cy="62" r="18" fill="#E5B287" />
    <Path d="M112 60C112 46 122 42 130 42C138 42 148 46 148 60Z" fill="#1F2937" />
    <Path d="M106 140V100C106 90 116 84 126 84H134C144 84 154 90 154 100V140H106Z" fill="#07C160" />

    {/* Left Friend */}
    <Circle cx="84" cy="74" r="16" fill="#D49B6A" />
    <Path d="M68 72C68 58 78 54 84 54C90 54 100 58 100 72Z" fill="#374151" />
    <Path d="M64 140V108C64 100 72 94 80 94H88C96 94 104 100 104 108V140H64Z" fill="#F59E0B" />

    {/* Right Friend */}
    <Circle cx="176" cy="74" r="16" fill="#C68642" />
    <Path d="M160 72C160 58 170 54 176 54C182 54 192 58 192 72Z" fill="#111827" />
    <Path d="M156 140V108C156 100 164 94 172 94H180C188 94 196 100 196 108V140H156Z" fill="#3B82F6" />

    {/* Far Left and Far Right friends */}
    <Circle cx="44" cy="88" r="14" fill="#E0A96D" />
    <Path d="M28 140V118C28 112 34 106 42 106H46C54 106 60 112 60 118V140H28Z" fill="#10B981" />

    <Circle cx="216" cy="88" r="14" fill="#E5B287" />
    <Path d="M200 140V118C200 112 206 106 214 106H218C226 106 232 112 232 118V140H200Z" fill="#8B5CF6" />

    {/* Community connection sparkles / speech bubble */}
    <Rect x="108" y="22" width="44" height="20" rx="6" fill="#10B981" />
    <Path d="M116 32L124 32M116 35L132 35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// SVG Illustration 3: Connect Payments / Commerce
const IllustrationConnectPayments = () => (
  <Svg width={260} height={200} viewBox="0 0 260 200" fill="none">
    <Defs>
      <LinearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FEF3C7" />
        <Stop offset="100%" stopColor="#FDE68A" />
      </LinearGradient>
      <LinearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#1E293B" />
        <Stop offset="100%" stopColor="#0F172A" />
      </LinearGradient>
    </Defs>
    <Circle cx="130" cy="100" r="90" fill="url(#bgGrad3)" />

    {/* Center Big Smartphone */}
    <Rect x="88" y="32" width="84" height="136" rx="14" fill="url(#phoneGrad)" />
    <Rect x="94" y="42" width="72" height="116" rx="8" fill="#FFFFFF" />

    {/* Phone screen UI: UPI Payment Badge */}
    <Circle cx="130" cy="74" r="18" fill="#07C160" />
    <Path d="M122 74L128 80L138 68" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <SvgText
      x="130"
      y="110"
      textAnchor="middle"
      fill="#111827"
      fontSize="13"
      fontWeight="bold"
    >
      ₹ 2,480.00
    </SvgText>
    <Rect x="104" y="122" width="52" height="18" rx="6" fill="#07C160" />

    {/* Left Shopper & Right Merchant hands */}
    <Circle cx="52" cy="104" r="24" fill="#E8F8F0" />
    <Path d="M42 104L62 104M52 94L52 114" stroke="#07C160" strokeWidth="3" strokeLinecap="round" />

    <Circle cx="208" cy="104" r="24" fill="#FEF3C7" />
    <SvgText x="208" y="112" textAnchor="middle" fontSize="18">🛍️</SvgText>
  </Svg>
);

// SVG Illustration 4: Secure Payments (Digital Card, Shield & Bank Level Security)
const IllustrationSecure = () => (
  <Svg width={260} height={200} viewBox="0 0 260 200" fill="none">
    <Defs>
      <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#08C261" />
        <Stop offset="50%" stopColor="#059669" />
        <Stop offset="100%" stopColor="#047857" />
      </LinearGradient>
      <LinearGradient id="bgGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#D1FAE5" />
        <Stop offset="100%" stopColor="#A7F3D0" />
      </LinearGradient>
    </Defs>
    <Circle cx="130" cy="100" r="90" fill="url(#bgGrad4)" />

    {/* Tilted Digital Debit / Wallet Card */}
    <G transform="rotate(-6 130 96)">
      <Rect x="46" y="52" width="168" height="96" rx="14" fill="url(#cardGrad)" />
      {/* Chip */}
      <Rect x="64" y="70" width="28" height="20" rx="4" fill="#FBBF24" />
      <Path d="M64 80H92M78 70V90" stroke="#B45309" strokeWidth="1" />
      {/* Brand & Number */}
      <Circle cx="184" cy="74" r="10" fill="#FFFFFF" opacity="0.3" />
      <Circle cx="196" cy="74" r="10" fill="#FFFFFF" opacity="0.3" />
      <Rect x="64" y="108" width="80" height="6" rx="3" fill="#FFFFFF" opacity="0.75" />
      <Rect x="64" y="122" width="48" height="8" rx="3" fill="#FFFFFF" />
    </G>

    {/* Central Floating Security Shield */}
    <G transform="translate(162, 106)">
      <Circle cx="20" cy="20" r="22" fill="#FFFFFF" />
      <Path
        d="M20 8L32 13V22C32 29 27 34 20 37C13 34 8 29 8 22V13L20 8Z"
        fill="#07C160"
      />
      <Path d="M16 22L19 25L25 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  </Svg>
);

export default function OnboardingScreen() {
  const router = useRouter();
  const { language, setLanguage, isDarkMode, setHasCompletedOnboarding } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: '1',
      title: 'Welcome to ChatIndia',
      subtitle: 'Chat, Connect, Share',
      illustration: <IllustrationWelcome />
    },
    {
      id: '2',
      title: 'Join Communities',
      subtitle: 'Stay close to your loved ones no matter where they are.',
      illustration: <IllustrationCommunities />
    },
    {
      id: '3',
      title: 'Connect Payments',
      subtitle: 'Explore groups, channels and interests that match you.',
      illustration: <IllustrationConnectPayments />
    },
    {
      id: '4',
      title: 'Secure Payments',
      subtitle: 'Send money, pay bills, shop and more — all in app',
      illustration: <IllustrationSecure />
    }
  ];

  const handleFinish = () => {
    setHasCompletedOnboarding(true);
    // Move to Screen 03: Login / Sign Up
    router.push('/auth/login');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={[styles.langBtn, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}
          onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        >
          <Globe size={14} color={theme.textPrimary} />
          <Text style={[styles.langText, { color: theme.textPrimary }]}>
            {language === 'en' ? 'हिन्दी' : 'English'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFinish} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Slide Visual Presentation matching Screen 02 */}
        <View style={styles.illustrationWrapper}>
          {slides[currentSlide].illustration}
        </View>

        {/* Slide Text Content */}
        <View style={styles.textContent}>
          <Text style={[styles.slideTitle, { color: theme.textPrimary }]}>
            {slides[currentSlide].title}
          </Text>
          <Text style={[styles.slideSubtitle, { color: theme.textSecondary }]}>
            {slides[currentSlide].subtitle}
          </Text>
        </View>

        {/* Page Dots Indicator */}
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setCurrentSlide(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: i === currentSlide ? theme.primary : theme.border,
                  width: i === currentSlide ? 24 : 8
                }
              ]}
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: theme.primary }]}
          activeOpacity={0.85}
          onPress={handleNext}
        >
          <Text style={styles.actionBtnText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={[styles.loginText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1
  },
  langText: {
    fontSize: 12,
    fontWeight: '700'
  },
  skipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20
  },
  illustrationWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16
  },
  textContent: {
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 16
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4
  },
  slideSubtitle: {
    fontSize: 14.5,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 14
  },
  dot: {
    height: 8,
    borderRadius: 4
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 26,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4
  },
  loginText: {
    fontSize: 13.5
  }
});
