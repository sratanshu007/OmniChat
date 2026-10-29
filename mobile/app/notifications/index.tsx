import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Bell,
  CheckCircle2,
  Gift,
  UserPlus,
  MessageSquare,
  Shield,
  Trash2,
  Check
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp, NotificationItem } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { EmptyState } from '../../src/components/EmptyState';

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    isDarkMode
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [activeTab, setActiveTab] = useState<'ALL' | 'REQUESTS' | 'SHAGUN' | 'SYSTEM'>('ALL');

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'SHAGUN':
        return <Gift size={20} color="#DC2626" />;
      case 'FRIEND_REQUEST':
        return <UserPlus size={20} color="#2563EB" />;
      case 'MOMENT_LIKE':
        return <Bell size={20} color="#EC4899" />;
      default:
        return <Shield size={20} color="#10B981" />;
    }
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'REQUESTS') return n.type === 'FRIEND_REQUEST';
    if (activeTab === 'SHAGUN') return n.type === 'SHAGUN';
    if (activeTab === 'SYSTEM') return n.type === 'SYSTEM';
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        title="Notifications"
        showBack
        onBack={() => router.back()}
        rightAction={
          notifications.length > 0 ? (
            <TouchableOpacity onPress={clearAllNotifications} style={{ padding: 4 }}>
              <Trash2 size={19} color={theme.textMuted} />
            </TouchableOpacity>
          ) : undefined
        }
        isDark={isDarkMode}
      />

      {/* Tabs */}
      <View style={[styles.tabsBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {(['ALL', 'REQUESTS', 'SHAGUN', 'SYSTEM'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              activeTab === tab && { borderBottomColor: theme.primary, borderBottomWidth: 2 }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? theme.primary : theme.textMuted }
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <EmptyState
            icon={<Bell size={32} color={theme.primary} />}
            title="All Caught Up!"
            description="You don't have any notifications right now."
            isDark={isDarkMode}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.notifCard,
              {
                backgroundColor: item.isRead ? theme.surface : (isDarkMode ? '#1E293B' : '#F0FDF4'),
                borderColor: theme.border
              }
            ]}
            onPress={() => markNotificationAsRead(item.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: isDarkMode ? '#374151' : '#F3F4F6' }]}>
              {getIcon(item.type)}
            </View>

            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: theme.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.time, { color: theme.textMuted }]}>{item.time}</Text>
              </View>
              <Text style={[styles.body, { color: theme.textSecondary }]}>{item.body}</Text>
            </View>

            {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabsBar: {
    flexDirection: 'row',
    borderBottomWidth: 1
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  title: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  time: {
    fontSize: 11,
    fontWeight: '500'
  },
  body: {
    fontSize: 12.5,
    lineHeight: 18
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  }
});
