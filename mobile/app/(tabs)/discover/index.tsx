import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Camera,
  Video,
  QrCode,
  MapPin,
  Globe,
  Search,
  Sparkles,
  ChevronRight,
  Flame,
  Users,
  Tv,
  CheckCircle2,
  X,
  Radio,
  Trophy,
  Newspaper
} from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { Header } from '../../../src/components/Header';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';

export default function DiscoverScreen() {
  const router = useRouter();
  const { t, moments, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<'for_you' | 'groups' | 'channels' | 'apps'>('for_you');
  const [showScanner, setShowScanner] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({ 'g_tech': true });
  const [followedChannels, setFollowedChannels] = useState<Record<string, boolean>>({});

  const latestAvatar =
    moments[0]?.authorAvatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100';

  const toggleGroupJoin = (id: string, name: string) => {
    setJoinedGroups(prev => {
      const next = !prev[id];
      Alert.alert(next ? 'Joined Community! 🎉' : 'Left Community', next ? `You are now a member of ${name}.` : `You left ${name}.`);
      return { ...prev, [id]: next };
    });
  };

  const toggleChannelFollow = (id: string, name: string) => {
    setFollowedChannels(prev => {
      const next = !prev[id];
      Alert.alert(next ? 'Channel Followed 📢' : 'Unfollowed', next ? `You will now receive updates from ${name}.` : `Unfollowed ${name}.`);
      return { ...prev, [id]: next };
    });
  };

  const handleNearbyPress = () => {
    if (!locationGranted) {
      setShowLocationModal(true);
    } else {
      Alert.alert('Nearby Communities', 'Found 14 active ChatIndia communities in your 2km radius!');
    }
  };

  const grantLocation = () => {
    setLocationGranted(true);
    setShowLocationModal(false);
    setTimeout(() => {
      Alert.alert(
        'Nearby Communities Discovered 📍',
        '• Bengaluru Tech Builders (4.8k)\n• Connaught Place Foodies (2.1k)\n• Cyber City Cyclists (1.2k)'
      );
    }, 300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Header title="Discover" isDark={isDarkMode} />

      {/* Search Bar matching Screen 14 */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <Search size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search groups, channels, apps..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* 4 Tabs Pills matching Screen 14: [For You] [Groups] [Channels] [Apps] */}
      <View style={[styles.tabsBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        {[
          { key: 'for_you', label: 'For You' },
          { key: 'groups', label: 'Groups' },
          { key: 'channels', label: 'Channels' },
          { key: 'apps', label: 'Apps' }
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabPill,
              selectedTab === tab.key && { backgroundColor: '#07C160', borderColor: '#07C160' }
            ]}
            onPress={() => setSelectedTab(tab.key as any)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabPillText,
                { color: selectedTab === tab.key ? '#FFFFFF' : theme.textSecondary }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Moments Shortcut Banner matching Screen 14 */}
        <TouchableOpacity
          style={[styles.momentsRow, { backgroundColor: theme.surface, borderColor: theme.border }]}
          activeOpacity={0.75}
          onPress={() => router.push('/moments')}
        >
          <View style={styles.momentsLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#07C160' }]}>
              <Camera size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.momentsTitle, { color: theme.textPrimary }]}>Moments & Social Feed</Text>
              <Text style={[styles.momentsSub, { color: theme.textMuted }]}>Photos, Stories & Status updates</Text>
            </View>
          </View>

          <View style={styles.momentsRight}>
            <Image source={{ uri: latestAvatar }} style={styles.previewAvatar} />
            <View style={[styles.redDot, { backgroundColor: '#EF4444' }]} />
            <ChevronRight size={18} color={theme.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Featured Communities Section matching Screen 14 */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Featured</Text>
          <TouchableOpacity onPress={() => setSelectedTab('groups')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Tech Lovers */}
          <View style={[styles.groupItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.groupAvatar, { backgroundColor: '#3B82F6' }]}>
              <Users size={22} color="#FFFFFF" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.textPrimary }]}>Tech Lovers</Text>
              <Text style={[styles.groupCount, { color: theme.textMuted }]}>12.5k members</Text>
            </View>
            <TouchableOpacity
              style={[styles.joinBtn, joinedGroups['g_tech'] && styles.joinedBtn]}
              onPress={() => toggleGroupJoin('g_tech', 'Tech Lovers')}
            >
              <Text style={[styles.joinBtnText, joinedGroups['g_tech'] && styles.joinedBtnText]}>
                {joinedGroups['g_tech'] ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Travel & Adventure */}
          <View style={[styles.groupItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.groupAvatar, { backgroundColor: '#10B981' }]}>
              <Globe size={22} color="#FFFFFF" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.textPrimary }]}>Travel & Adventure</Text>
              <Text style={[styles.groupCount, { color: theme.textMuted }]}>8.2k members</Text>
            </View>
            <TouchableOpacity
              style={[styles.joinBtn, joinedGroups['g_travel'] && styles.joinedBtn]}
              onPress={() => toggleGroupJoin('g_travel', 'Travel & Adventure')}
            >
              <Text style={[styles.joinBtnText, joinedGroups['g_travel'] && styles.joinedBtnText]}>
                {joinedGroups['g_travel'] ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Education & Career */}
          <View style={[styles.groupItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.groupAvatar, { backgroundColor: '#8B5CF6' }]}>
              <Sparkles size={22} color="#FFFFFF" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.textPrimary }]}>Education & Career</Text>
              <Text style={[styles.groupCount, { color: theme.textMuted }]}>15.3k members</Text>
            </View>
            <TouchableOpacity
              style={[styles.joinBtn, joinedGroups['g_edu'] && styles.joinedBtn]}
              onPress={() => toggleGroupJoin('g_edu', 'Education & Career')}
            >
              <Text style={[styles.joinBtnText, joinedGroups['g_edu'] && styles.joinedBtnText]}>
                {joinedGroups['g_edu'] ? 'Joined' : 'Join'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Channels Section matching Screen 14 */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Popular Channels</Text>
        </View>

        <View style={styles.channelsRow}>
          {/* News Channel Card */}
          <TouchableOpacity
            style={[styles.channelCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => toggleChannelFollow('ch_news', 'News 24/7')}
          >
            <View style={[styles.channelIconBox, { backgroundColor: '#EF4444' }]}>
              <Newspaper size={26} color="#FFFFFF" />
            </View>
            <Text style={[styles.channelTitle, { color: theme.textPrimary }]}>News</Text>
            <Text style={[styles.channelDesc, { color: theme.textMuted }]}>Daily Indian Headlines & Live Updates</Text>
            <View style={[styles.followPill, followedChannels['ch_news'] && styles.followPillActive]}>
              <Text style={[styles.followText, followedChannels['ch_news'] && styles.followTextActive]}>
                {followedChannels['ch_news'] ? 'Following' : 'Follow'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Sports Channel Card */}
          <TouchableOpacity
            style={[styles.channelCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
            activeOpacity={0.8}
            onPress={() => toggleChannelFollow('ch_sports', 'Sports Central')}
          >
            <View style={[styles.channelIconBox, { backgroundColor: '#F59E0B' }]}>
              <Trophy size={26} color="#FFFFFF" />
            </View>
            <Text style={[styles.channelTitle, { color: theme.textPrimary }]}>Sports</Text>
            <Text style={[styles.channelDesc, { color: theme.textMuted }]}>Cricket Live Scores & Match Clips</Text>
            <View style={[styles.followPill, followedChannels['ch_sports'] && styles.followPillActive]}>
              <Text style={[styles.followText, followedChannels['ch_sports'] && styles.followTextActive]}>
                {followedChannels['ch_sports'] ? 'Following' : 'Follow'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Scan QR & Nearby Shortcuts */}
        <View style={[styles.cardContainer, { backgroundColor: theme.surface, borderColor: theme.border, marginTop: 16, marginBottom: 40 }]}>
          <TouchableOpacity
            style={[styles.groupItem, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => setShowScanner(true)}
          >
            <View style={[styles.groupAvatar, { backgroundColor: '#07C160' }]}>
              <QrCode size={20} color="#FFFFFF" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.textPrimary }]}>Scan QR Code</Text>
              <Text style={[styles.groupCount, { color: theme.textMuted }]}>Scan friends, groups, or channels</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.groupItem, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={handleNearbyPress}
          >
            <View style={[styles.groupAvatar, { backgroundColor: '#10B981' }]}>
              <MapPin size={20} color="#FFFFFF" />
            </View>
            <View style={styles.groupInfo}>
              <Text style={[styles.groupName, { color: theme.textPrimary }]}>People & Groups Nearby</Text>
              <Text style={[styles.groupCount, { color: theme.textMuted }]}>Find local communities within 2km</Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Scanner */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onFriendAdded={() => setShowScanner(false)}
        />
      </Modal>

      {/* Location Permission Modal */}
      <Modal visible={showLocationModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.permissionCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.permIconBox, { backgroundColor: '#E8F8F0' }]}>
              <MapPin size={32} color="#07C160" />
            </View>
            <Text style={[styles.permTitle, { color: theme.textPrimary }]}>
              Discover Local Communities
            </Text>
            <Text style={[styles.permDesc, { color: theme.textSecondary }]}>
              ChatIndia uses coarse location to discover nearby interest groups, cultural societies, and community boards without sharing exact GPS.
            </Text>

            <TouchableOpacity style={styles.grantBtn} onPress={grantLocation}>
              <Text style={styles.grantBtnText}>Allow While Using App</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.denyBtn} onPress={() => setShowLocationModal(false)}>
              <Text style={[styles.denyBtnText, { color: theme.textMuted }]}>Not Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0
  },
  tabsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  tabPillText: {
    fontSize: 13,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    padding: 16
  },
  momentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  momentsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  momentsTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  momentsSub: {
    fontSize: 12,
    marginTop: 2
  },
  momentsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  previewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  seeAllText: {
    fontSize: 13,
    color: '#07C160',
    fontWeight: '700'
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1
  },
  groupAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  groupInfo: {
    flex: 1
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700'
  },
  groupCount: {
    fontSize: 12,
    marginTop: 2
  },
  joinBtn: {
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16
  },
  joinedBtn: {
    backgroundColor: '#F3F4F6'
  },
  joinBtnText: {
    color: '#07C160',
    fontSize: 13,
    fontWeight: '700'
  },
  joinedBtnText: {
    color: '#6B7280'
  },
  channelsRow: {
    flexDirection: 'row',
    gap: 12
  },
  channelCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  channelIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  channelTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  channelDesc: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 15,
    height: 30
  },
  followPill: {
    backgroundColor: '#07C160',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 14
  },
  followPillActive: {
    backgroundColor: '#F3F4F6'
  },
  followText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  followTextActive: {
    color: '#4B5563'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  permissionCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center'
  },
  permIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  permTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10
  },
  permDesc: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  grantBtn: {
    backgroundColor: '#07C160',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10
  },
  grantBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  denyBtn: {
    paddingVertical: 10
  },
  denyBtnText: {
    fontSize: 14,
    fontWeight: '600'
  }
});
