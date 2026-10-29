import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { QrCode, Search, Bell, Plus, ChevronLeft } from 'lucide-react-native';
import { Colors } from '../theme/tokens';
import { ChatIndiaLogo } from './ChatIndiaLogo';

interface HeaderProps {
  title?: string;
  showLogo?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  showQr?: boolean;
  onQrPress?: () => void;
  showPlus?: boolean;
  onPlusPress?: () => void;
  showNotification?: boolean;
  unreadNotifications?: number;
  rightAction?: React.ReactNode;
  subtitle?: string;
  isDark?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showLogo = false,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchPress,
  showQr = false,
  onQrPress,
  showPlus = false,
  onPlusPress,
  showNotification = false,
  unreadNotifications = 0,
  rightAction,
  subtitle,
  isDark = false
}) => {
  const router = useRouter();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={onBack || (() => router.back())}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        )}

        {showLogo ? (
          <ChatIndiaLogo size={34} showText textColor={theme.textPrimary} isDark={isDark} />
        ) : (
          <View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>}
          </View>
        )}
      </View>

      <View style={styles.right}>
        {showSearch && (
          <TouchableOpacity style={styles.iconBtn} onPress={onSearchPress}>
            <Search size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        )}

        {showQr && (
          <TouchableOpacity style={styles.iconBtn} onPress={onQrPress}>
            <QrCode size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        )}

        {showNotification && (
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color={theme.textPrimary} />
            {unreadNotifications > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.badgeRed }]}>
                <Text style={styles.badgeText}>
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showPlus && (
          <TouchableOpacity style={styles.iconBtn} onPress={onPlusPress}>
            <Plus size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        )}

        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    minHeight: 56
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  backBtn: {
    paddingRight: 6
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconBtn: {
    padding: 6,
    position: 'relative'
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800'
  }
});
