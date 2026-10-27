import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Search, Plus, Pin } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { api } from '../../../src/services/api';

export default function ChatsScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const res = await api.getConversations();
      if (res.conversations) setConversations(res.conversations);
    } catch (e) {
      console.warn(e);
    }
  };

  const filtered = conversations.filter(c =>
    (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.lastMessageText || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>OmniChat (微信)</Text>
        <TouchableOpacity style={styles.headerPlusBtn}>
          <Plus size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations & messages"
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
          <TouchableOpacity style={[styles.chatItem, item.isPinned && styles.pinnedItem]}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' }}
                style={styles.avatar}
              />
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.chatInfo}>
              <View style={styles.chatInfoHeader}>
                <Text style={styles.chatTitle}>{item.title}</Text>
                <Text style={styles.chatTime}>
                  {new Date(item.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>

              <View style={styles.chatSubtitleRow}>
                <Text
                  style={[
                    styles.lastMessage,
                    item.lastMessageText?.includes('🧧') && styles.redPacketText
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
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  headerPlusBtn: {
    padding: 6
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
  redPacketText: {
    color: '#E04A3F',
    fontWeight: '600'
  }
});
