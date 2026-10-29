import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  QrCode,
  UserPlus,
  CreditCard,
  Users,
  Grid,
  ArrowUpRight,
  MessageSquarePlus
} from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp, Conversation } from '../../../src/context/AppContext';
import { Header } from '../../../src/components/Header';
import { UnreadBadge, OnlineDot } from '../../../src/components/Badge';
import { EmptyState } from '../../../src/components/EmptyState';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';
import { MyQrCard } from '../../../src/components/MyQrCard';

export default function ChatsScreen() {
  const router = useRouter();
  const {
    t,
    user,
    conversations,
    isDarkMode,
    unreadNotificationCount
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'groups'>('all');
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showMyQr, setShowMyQr] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const filtered = conversations.filter(c => {
    const matchesSearch =
      (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessageText || '').toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'unread') return c.unreadCount > 0;
    if (filterTab === 'groups') return c.isGroup;
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header with ChatIndia Brand */}
      <Header
        showLogo
        showNotification
        unreadNotifications={unreadNotificationCount}
        showPlus
        onPlusPress={() => setShowPlusMenu(!showPlusMenu)}
        isDark={isDarkMode}
      />

      {/* Plus Dropdown Menu */}
      {showPlusMenu && (
        <View style={[styles.plusMenuDropdown, { backgroundColor: isDarkMode ? '#1F2937' : '#1F2937' }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowPlusMenu(false);
              setShowScanner(true);
            }}
          >
            <QrCode size={18} color="#FFFFFF" />
            <Text style={styles.menuItemText}>{t.chats.scanQr}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowPlusMenu(false);
              router.push('/group/create');
            }}
          >
            <Users size={18} color="#FFFFFF" />
            <Text style={styles.menuItemText}>New Group Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowPlusMenu(false);
              router.push('/(tabs)/contacts');
            }}
          >
            <UserPlus size={18} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Add Contacts</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => {
              setShowPlusMenu(false);
              router.push('/wallet');
            }}
          >
            <CreditCard size={18} color="#34D399" />
            <Text style={styles.menuItemText}>Scan & Pay UPI</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions Row matching Screen 09: [Scan] [Pay] [Top Up] [More] */}
      <View style={[styles.quickActionsBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => setShowScanner(true)}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#E8F8F0' }]}>
            <QrCode size={20} color="#07C160" />
          </View>
          <Text style={[styles.quickActionLabel, { color: theme.textPrimary }]}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => router.push('/wallet')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#EFF6FF' }]}>
            <CreditCard size={20} color="#2563EB" />
          </View>
          <Text style={[styles.quickActionLabel, { color: theme.textPrimary }]}>Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => router.push('/wallet')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#FEF3C7' }]}>
            <ArrowUpRight size={20} color="#D97706" />
          </View>
          <Text style={[styles.quickActionLabel, { color: theme.textPrimary }]}>Top Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => router.push('/(tabs)/services')}
          activeOpacity={0.7}
        >
          <View style={[styles.quickIconCircle, { backgroundColor: '#F3E8FF' }]}>
            <Grid size={20} color="#8B5CF6" />
          </View>
          <Text style={[styles.quickActionLabel, { color: theme.textPrimary }]}>More</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar matching Screen 09 */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }
          ]}
        >
          <Search size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search chats, contacts, groups..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filterTab === 'all' && { backgroundColor: theme.primary, borderColor: theme.primary }
          ]}
          onPress={() => setFilterTab('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filterTab === 'all' ? '#FFFFFF' : theme.textSecondary }
            ]}
          >
            All Chats ({conversations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterTab === 'unread' && { backgroundColor: theme.primary, borderColor: theme.primary }
          ]}
          onPress={() => setFilterTab('unread')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filterTab === 'unread' ? '#FFFFFF' : theme.textSecondary }
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filterTab === 'groups' && { backgroundColor: theme.primary, borderColor: theme.primary }
          ]}
          onPress={() => setFilterTab('groups')}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: filterTab === 'groups' ? '#FFFFFF' : theme.textSecondary }
            ]}
          >
            Groups
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversations List with ample bottom padding so nothing cuts off */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon={<MessageSquarePlus size={36} color={theme.primary} />}
            title={t.chats.emptyChats}
            description={t.chats.emptySub}
            actionTitle={t.chats.startChatBtn}
            onAction={() => router.push('/(tabs)/contacts')}
            isDark={isDarkMode}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chatItem,
              {
                backgroundColor: item.isPinned
                  ? (isDarkMode ? '#1E293B' : '#F8FAF9')
                  : theme.surface,
                borderBottomColor: theme.border
              }
            ]}
            activeOpacity={0.7}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            {/* Avatar with Online indicator & Badge */}
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              {!item.isGroup && <OnlineDot isOnline={item.isOnline ?? true} />}
              <View style={styles.badgeWrapper}>
                <UnreadBadge count={item.unreadCount} />
              </View>
            </View>

            {/* Content info */}
            <View style={styles.chatInfo}>
              <View style={styles.chatInfoHeader}>
                <Text
                  style={[styles.chatTitle, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={[styles.chatTime, { color: theme.textMuted }]}>
                  {item.lastMessageAt}
                </Text>
              </View>

              <View style={styles.chatSubtitleRow}>
                <Text
                  style={[
                    styles.chatSubtitle,
                    {
                      color:
                        item.unreadCount > 0
                          ? theme.textPrimary
                          : (item.partnerId === 'user_riya' ? '#07C160' : theme.textSecondary),
                      fontWeight: (item.unreadCount > 0 || item.partnerId === 'user_riya') ? '700' : '400'
                    }
                  ]}
                  numberOfLines={1}
                >
                  {item.partnerId === 'user_riya' ? 'Typing...' : item.lastMessageText}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/(tabs)/contacts')}
        activeOpacity={0.85}
      >
        <MessageSquarePlus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onFriendAdded={() => setShowScanner(false)}
        />
      </Modal>

      {/* My QR Profile Modal */}
      <Modal visible={showMyQr} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={styles.modalDismissArea}
            onPress={() => setShowMyQr(false)}
          />
          <MyQrCard
            user={user}
            qrToken={`chatindia_qr_${user.username}`}
            onRefresh={() => {}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listContent: {
    paddingBottom: 90
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14
  },
  quickActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 6
  },
  quickIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700'
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16
  },
  badgeWrapper: {
    position: 'absolute',
    top: -4,
    right: -4
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  chatInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8
  },
  chatTime: {
    fontSize: 12,
    fontWeight: '500'
  },
  chatSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  chatSubtitle: {
    fontSize: 13.5
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6
  },
  plusMenuDropdown: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 180,
    borderRadius: 12,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    paddingVertical: 4
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)'
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalDismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
