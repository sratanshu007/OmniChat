import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Eye,
  Bell,
  MessageSquare,
  HardDrive,
  SunMoon,
  Globe,
  HelpCircle,
  Info,
  LogOut,
  Lock
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { ConfirmationModal } from '../../src/components/ConfirmationModal';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    t,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    logout
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const SETTINGS_ITEMS = [
    {
      id: 'acc',
      title: 'Account & Security',
      icon: Shield,
      color: '#07C160',
      bg: '#E8F8F0',
      onPress: () => Alert.alert('Account & Security', 'Phone: +91 98765 43210\nTwo-Step Verification: Active ✅\nLinked Bank: HDFC Bank (**** 8821)')
    },
    {
      id: 'priv',
      title: 'Privacy',
      icon: Lock,
      color: '#3B82F6',
      bg: '#EFF6FF',
      onPress: () => Alert.alert('Privacy Settings', '• Online status: Visible to friends\n• Read receipts: Enabled\n• Add by QR code: Allowed')
    },
    {
      id: 'notif',
      title: 'Notifications',
      icon: Bell,
      color: '#F59E0B',
      bg: '#FEF3C7',
      onPress: () => Alert.alert('Notifications', 'Push Notifications: Enabled\nSound & Vibrate: Enabled\nPayment Alerts: Instant')
    },
    {
      id: 'chat',
      title: 'Chat Settings',
      icon: MessageSquare,
      color: '#10B981',
      bg: '#D1FAE5',
      onPress: () => Alert.alert('Chat Settings', 'Chat wallpaper: Default Light/Dark\nEnter key sends: Enabled\nFont size: Medium')
    },
    {
      id: 'storage',
      title: 'Storage & Data',
      icon: HardDrive,
      color: '#6366F1',
      bg: '#EEF2FF',
      onPress: () => Alert.alert('Storage & Data', 'ChatIndia Cache: 42.8 MB\nMedia Auto-Download on Wi-Fi: Enabled\nDPDP Data Portability: Available')
    },
    {
      id: 'theme',
      title: 'Theme',
      icon: SunMoon,
      color: '#8B5CF6',
      bg: '#F3E8FF',
      rightText: isDarkMode ? 'Dark' : 'Light',
      onPress: toggleDarkMode
    },
    {
      id: 'lang',
      title: 'Language',
      icon: Globe,
      color: '#EC4899',
      bg: '#FCE7F3',
      rightText: language === 'en' ? 'English' : 'हिन्दी',
      onPress: () => setLanguage(language === 'en' ? 'hi' : 'en')
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
      color: '#0D9488',
      bg: '#CCFBF1',
      onPress: () => Alert.alert('Help & Support', 'ChatIndia 24x7 Customer Care\nEmail: support@chatindia.app\nToll-Free: 1800-CHAT-INDIA')
    },
    {
      id: 'about',
      title: 'About',
      icon: Info,
      color: '#6B7280',
      bg: '#F3F4F6',
      rightText: 'v2.4.0',
      onPress: () => Alert.alert('About ChatIndia', 'ChatIndia Super App v2.4.0\nMade with ❤️ in India for 1.4 Billion citizens.\nTagline: Chat • Connect • Share')
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header matching Screen 20 */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Settings List matching Screen 20 */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {SETTINGS_ITEMS.map((item, idx) => {
            const IconComp = item.icon;
            const isLast = idx === SETTINGS_ITEMS.length - 1;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.row,
                  !isLast && { borderBottomWidth: 0.5, borderBottomColor: theme.border }
                ]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                  <IconComp size={18} color={item.color} />
                </View>

                <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                  {item.title}
                </Text>

                <View style={styles.rowRight}>
                  {item.rightText && (
                    <Text style={[styles.rightText, { color: theme.textMuted }]}>
                      {item.rightText}
                    </Text>
                  )}
                  <ChevronRight size={18} color={theme.textMuted} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Centered Red Log Out Button matching Screen 20 */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() => setShowLogoutModal(true)}
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out of ChatIndia?"
        message="You will need to verify your phone number with OTP to log back in."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
          router.replace('/splash');
        }}
        onCancel={() => setShowLogoutModal(false)}
        isDark={isDarkMode}
      />
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
    width: 40,
    height: 40,
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  scroll: {
    padding: 16
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600'
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  rightText: {
    fontSize: 13,
    fontWeight: '500'
  },
  logoutBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800'
  }
});
