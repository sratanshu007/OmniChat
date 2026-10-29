import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  UserPlus,
  QrCode,
  Award,
  Users,
  ChevronRight,
  Check,
  X,
  Search,
  Shield,
  PhoneCall,
  MessageCircle
} from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { Header } from '../../../src/components/Header';
import { OnlineDot } from '../../../src/components/Badge';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';
import { MyQrCard } from '../../../src/components/MyQrCard';

export default function ContactsScreen() {
  const router = useRouter();
  const {
    t,
    user,
    friends,
    friendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    isDarkMode
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [search, setSearch] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showMyQr, setShowMyQr] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const filteredFriends = friends.filter(
    f =>
      f.displayName.toLowerCase().includes(search.toLowerCase()) ||
      f.username.toLowerCase().includes(search.toLowerCase()) ||
      f.upiId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* Header */}
      <Header
        title={t.contacts.title}
        showQr
        onQrPress={() => router.push('/qr/scan')}
        isDark={isDarkMode}
      />

      {/* Search Input */}
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
            placeholder={t.contacts.searchPlaceholder}
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredFriends}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={() => (
          <View style={styles.systemRowsContainer}>
            {/* 1. New Friend Request matching Screen 12/13 */}
            <TouchableOpacity
              style={[styles.sysRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              onPress={() => setShowRequestsModal(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.sysIconBox, { backgroundColor: '#07C160' }]}>
                <UserPlus size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.sysRowLabel, { color: theme.textPrimary }]}>
                New Friend Request
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 13, color: '#07C160', fontWeight: '700' }}>
                  {friendRequests.length} requests
                </Text>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>

            {/* 2. My QR Code matching Screen 12/13 */}
            <TouchableOpacity
              style={[styles.sysRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              onPress={() => setShowMyQr(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.sysIconBox, { backgroundColor: '#07C160' }]}>
                <QrCode size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.sysRowLabel, { color: theme.textPrimary }]}>
                My QR Code
              </Text>
              <ChevronRight size={18} color={theme.textMuted} />
            </TouchableOpacity>

            {/* 3. Groups matching Screen 12/13 */}
            <TouchableOpacity
              style={[styles.sysRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              onPress={() => router.push('/group/create')}
              activeOpacity={0.7}
            >
              <View style={[styles.sysIconBox, { backgroundColor: '#07C160' }]}>
                <Users size={20} color="#FFFFFF" />
              </View>
              <Text style={[styles.sysRowLabel, { color: theme.textPrimary }]}>
                Groups
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 13, color: theme.textMuted, fontWeight: '500' }}>
                  12 groups
                </Text>
                <ChevronRight size={18} color={theme.textMuted} />
              </View>
            </TouchableOpacity>

            {/* Section Divider */}
            <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
              <Text style={[styles.sectionHeaderText, { color: theme.textMuted }]}>
                {t.contacts.allContacts} ({friends.length})
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.contactItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => router.push(`/contact/${item.id}`)}
          >
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: item.avatarUrl }} style={styles.contactAvatar} />
              <OnlineDot isOnline={item.isOnline ?? true} />
            </View>

            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: theme.textPrimary }]}>
                {item.displayName}
              </Text>
              <Text style={[styles.contactUsername, { color: theme.textSecondary }]}>
                UPI: {item.upiId}
              </Text>
              <Text style={[styles.contactRegion, { color: theme.textMuted }]}>
                📍 {item.region}
              </Text>
            </View>

            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        )}
      />

      {/* QR Camera Scanner Modal */}
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

      {/* Friend Requests Modal */}
      <Modal visible={showRequestsModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={[styles.requestsCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.requestsHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.requestsTitle, { color: theme.textPrimary }]}>
                {t.contacts.newFriends}
              </Text>
              <TouchableOpacity onPress={() => setShowRequestsModal(false)}>
                <X size={20} color={theme.textPrimary} />
              </TouchableOpacity>
            </View>

            {friendRequests.length === 0 ? (
              <View style={styles.emptyRequests}>
                <Text style={{ color: theme.textMuted, fontSize: 13.5 }}>
                  No pending friend requests.
                </Text>
              </View>
            ) : (
              <FlatList
                data={friendRequests}
                keyExtractor={r => r.id}
                renderItem={({ item: req }) => (
                  <View style={[styles.reqRow, { borderBottomColor: theme.border }]}>
                    <Image source={{ uri: req.senderAvatar }} style={styles.reqAvatar} />
                    <View style={styles.reqInfo}>
                      <Text style={[styles.reqName, { color: theme.textPrimary }]}>
                        {req.senderName}
                      </Text>
                      <Text style={[styles.reqMsg, { color: theme.textSecondary }]}>
                        {req.message}
                      </Text>
                    </View>
                    <View style={styles.reqActions}>
                      <TouchableOpacity
                        style={[styles.reqActionBtn, { backgroundColor: theme.primary }]}
                        onPress={() => acceptFriendRequest(req.id)}
                      >
                        <Check size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.reqActionBtn, { backgroundColor: '#EF4444' }]}
                        onPress={() => rejectFriendRequest(req.id)}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
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
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5
  },
  systemRowsContainer: {
    marginTop: 8
  },
  sysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5
  },
  sysIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  sysRowLabel: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1
  },
  reqBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8
  },
  reqBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6
  },
  sectionHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14
  },
  contactAvatar: {
    width: 46,
    height: 46,
    borderRadius: 10
  },
  contactInfo: {
    flex: 1
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2
  },
  contactUsername: {
    fontSize: 12.5,
    fontWeight: '500'
  },
  contactRegion: {
    fontSize: 11,
    marginTop: 2
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalDismissArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  requestsCard: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 16,
    padding: 16
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1
  },
  requestsTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  emptyRequests: {
    padding: 30,
    alignItems: 'center'
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  reqAvatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12
  },
  reqInfo: {
    flex: 1
  },
  reqName: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  reqMsg: {
    fontSize: 12,
    marginTop: 2
  },
  reqActions: {
    flexDirection: 'row',
    gap: 8
  },
  reqActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
