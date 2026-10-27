import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, QrCode, Award, Users, ChevronRight, Check } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';
import { MyQrCard } from '../../../src/components/MyQrCard';

export default function ContactsScreen() {
  const router = useRouter();
  const { user, friends, friendRequests, acceptFriendRequest } = useApp();

  const [showScanner, setShowScanner] = useState(false);
  const [showMyQr, setShowMyQr] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <TouchableOpacity onPress={() => setShowScanner(true)}>
          <QrCode size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.systemRowsContainer}>
            {/* New Friends */}
            <TouchableOpacity
              style={styles.sysRow}
              onPress={() => setShowRequestsModal(true)}
            >
              <View style={[styles.sysIconBox, { backgroundColor: '#FA9D3B' }]}>
                <UserPlus size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.sysRowLabel}>New Friends</Text>
              {friendRequests.length > 0 && (
                <View style={styles.reqBadge}>
                  <Text style={styles.reqBadgeText}>{friendRequests.length}</Text>
                </View>
              )}
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Scan QR Code */}
            <TouchableOpacity style={styles.sysRow} onPress={() => setShowScanner(true)}>
              <View style={[styles.sysIconBox, { backgroundColor: Colors.light.primary }]}>
                <QrCode size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.sysRowLabel}>Scan QR Code</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* My QR Code Card */}
            <TouchableOpacity style={styles.sysRow} onPress={() => setShowMyQr(true)}>
              <View style={[styles.sysIconBox, { backgroundColor: '#3B82F6' }]}>
                <Users size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.sysRowLabel}>My QR Profile Card</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Verified Businesses / Official Channels */}
            <TouchableOpacity style={styles.sysRow}>
              <View style={[styles.sysIconBox, { backgroundColor: '#2B82FF' }]}>
                <Award size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.sysRowLabel}>Verified Businesses</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>ALL CONTACTS ({friends.length})</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            activeOpacity={0.7}
            onPress={() => router.push(`/contact/${item.id}`)}
          >
            <Image source={{ uri: item.avatarUrl }} style={styles.contactAvatar} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.displayName}</Text>
              <Text style={styles.contactUsername}>UPI: {item.upiId}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Friend Requests Modal */}
      <Modal visible={showRequestsModal} animationType="slide">
        <SafeAreaView style={styles.requestsModalContainer}>
          <View style={styles.requestsHeader}>
            <TouchableOpacity onPress={() => setShowRequestsModal(false)}>
              <Text style={styles.backLinkText}>✕ Close</Text>
            </TouchableOpacity>
            <Text style={styles.requestsTitle}>Friend Requests</Text>
            <View style={{ width: 40 }} />
          </View>

          {friendRequests.length === 0 ? (
            <View style={styles.emptyRequests}>
              <Text style={styles.emptyText}>No pending friend requests</Text>
            </View>
          ) : (
            <FlatList
              data={friendRequests}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.requestCard}>
                  <Image source={{ uri: item.senderAvatar }} style={styles.reqAvatar} />
                  <View style={styles.reqInfo}>
                    <Text style={styles.reqSenderName}>{item.senderName}</Text>
                    <Text style={styles.reqMessage}>{item.message}</Text>
                    <Text style={styles.reqTime}>{item.time}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => acceptFriendRequest(item.id)}
                  >
                    <Check size={16} color="#FFFFFF" />
                    <Text style={styles.acceptBtnText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* QR Camera Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onFriendAdded={() => setShowScanner(false)}
        />
      </Modal>

      {/* My QR Code Modal */}
      <Modal visible={showMyQr} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowMyQr(false)}
            >
              <Text style={styles.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
            <MyQrCard
              user={user}
              qrToken={`omnichat_qr_${user.username}_identity`}
              onRefresh={() => {}}
            />
          </View>
        </View>
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
  systemRowsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  sysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  sysIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  sysRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1
  },
  reqBadge: {
    backgroundColor: Colors.light.badgeRed,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 8
  },
  reqBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  sectionHeader: {
    backgroundColor: '#EDEDED',
    paddingHorizontal: 16,
    paddingVertical: 6
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF'
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    marginRight: 14
  },
  contactInfo: {
    flex: 1
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  contactUsername: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    marginRight: 24,
    marginBottom: 12
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700'
  },
  requestsModalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  requestsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  backLinkText: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '600'
  },
  requestsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827'
  },
  emptyRequests: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 15
  },
  requestCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  reqAvatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12
  },
  reqInfo: {
    flex: 1
  },
  reqSenderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  reqMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  reqTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#07C160',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  }
});
