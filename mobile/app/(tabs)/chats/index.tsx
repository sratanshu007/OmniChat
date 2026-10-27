import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Plus, Pin, QrCode, UserPlus } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';

export default function ChatsScreen() {
  const router = useRouter();
  const { conversations } = useApp();
  const [search, setSearch] = useState('');
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const filtered = conversations.filter(
    c =>
      (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.lastMessageText || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OmniChat</Text>
        <TouchableOpacity
          style={styles.headerPlusBtn}
          onPress={() => setShowPlusMenu(!showPlusMenu)}
        >
          <Plus size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Dropdown Plus Menu */}
      {showPlusMenu && (
        <View style={styles.plusMenuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowPlusMenu(false);
              setShowScanner(true);
            }}
          >
            <QrCode size={18} color="#FFFFFF" />
            <Text style={styles.menuItemText}>Scan QR Code</Text>
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
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats and messages"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Conversations List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chatItem, item.isPinned && styles.pinnedItem]}
            activeOpacity={0.7}
            onPress={() => router.push(`/chat/${item.id}`)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.chatInfo}>
              <View style={styles.chatInfoHeader}>
                <Text style={styles.chatTitle}>{item.title}</Text>
                <Text style={styles.chatTime}>{item.lastMessageAt}</Text>
              </View>

              <View style={styles.chatSubtitleRow}>
                <Text
                  style={[
                    styles.lastMessage,
                    (item.lastMessageText?.includes('🎁') || item.lastMessageText?.includes('🧧')) &&
                      styles.giftText
                  ]}
                  numberOfLines={1}
                >
                  {item.lastMessageText}
                </Text>
                {item.isPinned && <Pin size={13} color="#9CA3AF" />}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onFriendAdded={() => setShowScanner(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EDEDED',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  headerPlusBtn: {
    padding: 6
  },
  plusMenuDropdown: {
    position: 'absolute',
    top: 55,
    right: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#4B5563'
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  searchContainer: {
    padding: 8,
    backgroundColor: '#EDEDED'
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#111827'
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  pinnedItem: {
    backgroundColor: '#F9FAFB'
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.light.badgeRed,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  chatInfo: {
    flex: 1
  },
  chatInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  chatTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  chatTime: {
    fontSize: 11,
    color: '#9CA3AF'
  },
  chatSubtitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  lastMessage: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
    marginRight: 8
  },
  giftText: {
    color: '#07C160',
    fontWeight: '700'
  }
});
