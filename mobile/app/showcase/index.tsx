import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Smartphone,
  Shield,
  Layers,
  Users,
  CreditCard,
  Compass,
  MessageSquare,
  QrCode,
  Heart,
  Video,
  Phone,
  Settings as SettingsIcon,
  CheckCircle2
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { ChatIndiaLogo } from '../../src/components/ChatIndiaLogo';

const { width } = Dimensions.get('window');

export default function ShowcaseScreen() {
  const router = useRouter();
  const { isDarkMode, startCall } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const SCREEN_LIST = [
    { num: '01', title: 'Splash Screen', desc: 'Branded emerald green launch screen with Indian monuments skyline', route: '/splash', icon: Sparkles, color: '#07C160' },
    { num: '02', title: 'Onboarding (4 Slides)', desc: 'Welcome, Communities, Smart Payments, and Secure Cards carousel', route: '/onboarding', icon: Layers, color: '#3B82F6' },
    { num: '03', title: 'Login / Sign Up', desc: 'Mobile/Email, password with eye toggle, Google & Apple auth', route: '/auth/login', icon: Smartphone, color: '#10B981' },
    { num: '04', title: 'Sign Up', desc: 'Full Name, Mobile Number, optional Email registration form', route: '/auth/signup', icon: Users, color: '#F59E0B' },
    { num: '05', title: 'OTP Verification', desc: '6-digit interactive code verification with resend timer', route: '/auth/otp', icon: Shield, color: '#8B5CF6' },
    { num: '06', title: 'Profile Setup', desc: 'Avatar photo picker, Rohan Sharma display name & @rohan username', route: '/auth/profile-setup', icon: Users, color: '#EC4899' },
    { num: '07', title: 'Group Chats & Chat List', desc: 'Search, Scan/Pay/Top-Up pills, Riya Sharma, Family & Office chats', route: '/(tabs)/chats', icon: MessageSquare, color: '#07C160' },
    { num: '08', title: 'Chat Screen', desc: 'Riya Sharma chat with texts, scenic mountain image & composer bar', route: '/chat/conv_riya', icon: MessageSquare, color: '#10B981' },
    { num: '10', title: 'Voice & Video Call', desc: 'HD Voice (00:24 timer) & Video call with PiP self-view', route: 'call_demo', icon: Video, color: '#2563EB' },
    { num: '11', title: 'QR Code Scanner', desc: 'Camera viewfinder with green glowing reticle, gallery & flash', route: '/qr/scan', icon: QrCode, color: '#059669' },
    { num: '12', title: 'My QR Code', desc: 'Rohan Sharma card with vector QR, share, save & copy link', route: '/qr/my-qr', icon: QrCode, color: '#0D9488' },
    { num: '13', title: 'Contacts Tab', desc: 'New Friend Requests (3), My QR, Groups (12) & friend list', route: '/(tabs)/contacts', icon: Users, color: '#3B82F6' },
    { num: '14', title: 'Discover Tab', desc: 'Search, For You/Groups/Channels tabs, Featured communities', route: '/(tabs)/discover', icon: Compass, color: '#F59E0B' },
    { num: '15', title: 'Moments / Social Feed', desc: 'Stories row, Neha Singh lake sunset photo, likes & comments', route: '/moments', icon: Heart, color: '#EF4444' },
    { num: '16', title: 'Services / Super App', desc: 'UPI, Shopping, Travel, Food grid + Amazon, Flipkart mini apps', route: '/(tabs)/services', icon: Layers, color: '#8B5CF6' },
    { num: '17', title: 'Wallet / Payments', desc: 'Emerald ₹2,480.00 wallet card, Scan & Pay, UPI & transactions', route: '/wallet', icon: CreditCard, color: '#047857' },
    { num: '20', title: 'Settings', desc: 'Account & Security, Privacy, Theme, Language & Log Out', route: '/settings', icon: SettingsIcon, color: '#6B7280' }
  ];

  const handleScreenClick = (item: typeof SCREEN_LIST[0]) => {
    if (item.route === 'call_demo') {
      Alert.alert('Launch Call Simulation', 'Which call screen would you like to view?', [
        { text: 'Voice Call (00:24)', onPress: () => startCall('Riya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160', 'audio') },
        { text: 'Video Call (HD PiP)', onPress: () => startCall('Riya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160', 'video') },
        { text: 'Cancel', style: 'cancel' }
      ]);
    } else {
      router.push(item.route as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>ChatIndia Showcase</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Brand Banner */}
        <View style={styles.brandHero}>
          <ChatIndiaLogo size={64} showText textColor={theme.textPrimary} isDark={isDarkMode} />
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            All 20+ Screens • Pixel-Perfect • 100% Working
          </Text>
        </View>

        {/* Reference Image Container */}
        <View style={[styles.showcaseImageCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Design Mockup Reference Image
          </Text>
          <Text style={[styles.cardSub, { color: theme.textMuted }]}>
            Included directly in mobile assets: /assets/chatindia_showcase.jpg
          </Text>

          <Image
            source={require('../../assets/chatindia_showcase.jpg')}
            style={styles.mockupImage}
            resizeMode="contain"
          />
        </View>

        {/* Start Complete Flow CTA */}
        <TouchableOpacity
          style={[styles.startTourBtn, { backgroundColor: theme.primary }]}
          onPress={() => router.replace('/splash')}
          activeOpacity={0.85}
        >
          <View style={styles.startTourLeft}>
            <Sparkles size={22} color="#FFFFFF" />
            <View>
              <Text style={styles.startTourTitle}>Start App from the Beginning</Text>
              <Text style={styles.startTourSub}>Screen 01 Splash → Onboarding → Auth → App</Text>
            </View>
          </View>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Grid of all Screens matching the image */}
        <View style={styles.screensSection}>
          <Text style={[styles.sectionHeading, { color: theme.textPrimary }]}>
            All App Screens from Reference Image
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
            Tap any screen below to jump directly into it:
          </Text>

          <View style={styles.screenGrid}>
            {SCREEN_LIST.map(item => {
              const IconComp = item.icon;
              return (
                <TouchableOpacity
                  key={item.num}
                  style={[styles.screenCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  activeOpacity={0.75}
                  onPress={() => handleScreenClick(item)}
                >
                  <View style={styles.cardHeaderRow}>
                    <View style={[styles.badgeNum, { backgroundColor: item.color }]}>
                      <Text style={styles.badgeNumText}>{item.num}</Text>
                    </View>
                    <IconComp size={20} color={item.color} />
                  </View>

                  <Text style={[styles.screenItemTitle, { color: theme.textPrimary }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.screenItemDesc, { color: theme.textSecondary }]}>
                    {item.desc}
                  </Text>

                  <View style={styles.tapToOpenRow}>
                    <Text style={[styles.tapToOpenText, { color: theme.primary }]}>Open Screen</Text>
                    <ArrowRight size={14} color={theme.primary} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  backBtn: {
    padding: 6
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 48
  },
  brandHero: {
    alignItems: 'center',
    marginBottom: 20
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8
  },
  showcaseImageCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  cardSub: {
    fontSize: 12,
    marginBottom: 12
  },
  mockupImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#042C18'
  },
  startTourBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  startTourLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  startTourTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  startTourSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11.5,
    marginTop: 2
  },
  screensSection: {
    width: '100%'
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4
  },
  sectionSub: {
    fontSize: 13,
    marginBottom: 16
  },
  screenGrid: {
    gap: 12
  },
  screenCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  badgeNum: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8
  },
  badgeNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  screenItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4
  },
  screenItemDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 10
  },
  tapToOpenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  tapToOpenText: {
    fontSize: 12.5,
    fontWeight: '700'
  }
});

