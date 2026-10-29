import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  QrCode,
  CreditCard,
  Bookmark,
  Image as ImageIcon,
  Smile,
  Settings,
  ChevronRight,
  LogOut,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { Header } from '../../../src/components/Header';
import { MyQrCard } from '../../../src/components/MyQrCard';
import { ConfirmationModal } from '../../../src/components/ConfirmationModal';

export default function MeScreen() {
  const router = useRouter();
  const { t, user, walletBalanceFormatted, isDarkMode, logout } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [showMyQr, setShowMyQr] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const copyUpiId = () => {
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Header title={t.me.title} isDark={isDarkMode} />

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={[styles.displayName, { color: theme.textPrimary }]}>
              {user.displayName}
            </Text>

            <TouchableOpacity style={styles.upiRow} onPress={copyUpiId}>
              <Text style={[styles.wechatId, { color: theme.primary }]}>
                {user.upiId}
              </Text>
              {copiedUpi ? (
                <Check size={13} color={theme.primary} />
              ) : (
                <Copy size={13} color={theme.textMuted} />
              )}
            </TouchableOpacity>

            <Text style={[styles.region, { color: theme.textMuted }]}>
              📍 {user.region}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.qrBtn, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => setShowMyQr(true)}
          >
            <QrCode size={22} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ChatIndia Pay & UPI Wallet Row */}
        <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push('/wallet')}
          >
            <View style={[styles.iconBox, { backgroundColor: theme.primary }]}>
              <CreditCard size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.walletRow}
            </Text>
            <Text style={[styles.balanceText, { color: theme.primary }]}>
              ₹{walletBalanceFormatted}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Starred & Moments */}
        <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Saved & Starred Messages',
                'Your saved important notes, UPI payment receipts, and family photos are safely synced.'
              )
            }
          >
            <View style={[styles.iconBox, { backgroundColor: '#F59E0B' }]}>
              <Bookmark size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.saved}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => router.push('/moments')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#3B82F6' }]}>
              <ImageIcon size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.moments}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Sticker & Meme Gallery',
                'Express yourself with Indian festive stickers, chai memes, and cricket animations! 🏏☕'
              )
            }
          >
            <View style={[styles.iconBox, { backgroundColor: '#EC4899' }]}>
              <Smile size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.stickers}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Settings & Help */}
        <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[styles.row, { borderBottomColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => router.push('/settings')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#64748B' }]}>
              <Settings size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.settings}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Help & Customer Support',
                'ChatIndia 24x7 Support:\nEmail: support@chatindia.app\nToll-Free: 1800-CHAT-INDIA'
              )
            }
          >
            <View style={[styles.iconBox, { backgroundColor: '#0EA5E9' }]}>
              <HelpCircle size={19} color="#FFFFFF" />
            </View>
            <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
              {t.me.help}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Log Out Row */}
        <View
          style={[
            styles.groupCard,
            { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 40 }
          ]}
        >
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <LogOut size={19} color="#EF4444" />
            </View>
            <Text style={[styles.rowLabel, { color: '#EF4444' }]}>
              {t.me.logout}
            </Text>
            <ChevronRight size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

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

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out of ChatIndia?"
        message="You will need to verify your mobile number via OTP to log in again."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleConfirmLogout}
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
  content: {
    paddingTop: 12
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 14,
    marginRight: 14
  },
  profileText: {
    flex: 1
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  wechatId: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  region: {
    fontSize: 11.5,
    fontWeight: '500'
  },
  qrBtn: {
    padding: 10,
    borderRadius: 12
  },
  groupCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1
  },
  balanceText: {
    fontSize: 15,
    fontWeight: '800',
    marginRight: 8
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
  }
});
