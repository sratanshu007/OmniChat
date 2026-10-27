import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { QrCode, CreditCard, Bookmark, Image as ImageIcon, Smile, Settings, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { MyQrCard } from '../../../src/components/MyQrCard';

export default function MeScreen() {
  const router = useRouter();
  const { user, walletBalanceFormatted } = useApp();
  const [showMyQr, setShowMyQr] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileText}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.wechatId}>WeChat ID: {user.username}</Text>
            <Text style={styles.region}>📍 {user.region}</Text>
          </View>

          <TouchableOpacity
            style={styles.qrBtn}
            onPress={() => setShowMyQr(true)}
          >
            <QrCode size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* WeChat Pay Services Row */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push('/wallet')}
          >
            <View style={[styles.iconBox, { backgroundColor: Colors.light.primary }]}>
              <CreditCard size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Services / WeChat Pay (微信支付)</Text>
            <Text style={styles.balanceText}>¥{walletBalanceFormatted}</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Favorites & Moments */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Favorites (收藏)', 'Your saved messages, articles, and voice notes')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F59E0B' }]}>
              <Bookmark size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Favorites (收藏)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push('/moments')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#3B82F6' }]}>
              <ImageIcon size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>My Posts & Moments (相册)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Sticker Gallery (表情包)', 'Custom animated stickers and memes')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EC4899' }]}>
              <Smile size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Sticker Gallery (表情包)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={[styles.groupCard, { marginBottom: 30 }]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Settings', 'Account security, notifications, and language (English / 简体中文)')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#64748B' }]}>
              <Settings size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Settings (设置)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* My QR Code Card Modal */}
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
  content: {
    flex: 1
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16
  },
  profileText: {
    flex: 1
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  wechatId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2
  },
  region: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2
  },
  qrBtn: {
    padding: 8
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.primary,
    marginRight: 8
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
  }
});
