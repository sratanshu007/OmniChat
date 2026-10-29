import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MessageSquare,
  Phone,
  Video,
  Camera,
  ChevronRight,
  ShieldCheck,
  Gift,
  Share2,
  UserX,
  CreditCard
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';
import { ConfirmationModal } from '../../src/components/ConfirmationModal';

export default function ContactProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { friends, startCall, blockUser, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [showBlockModal, setShowBlockModal] = useState(false);

  const contact = friends.find(f => f.id === id) || {
    id: id || 'user_priya',
    displayName: 'Priya Patel',
    username: 'priya_p',
    upiId: 'priya@okhdfcbank',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
    region: 'Mumbai, Maharashtra',
    signature: 'Life is too short for bad chai ☕✨',
    phone: '+91 98200 11223'
  };

  const convId =
    contact.id === 'user_priya'
      ? 'conv_priya'
      : contact.id === 'user_rohan'
      ? 'conv_rohan'
      : 'conv_' + contact.id;

  const handleShareCard = async () => {
    try {
      await Share.share({
        message: `Connect with ${contact.displayName} on ChatIndia! UPI: ${contact.upiId}`
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleConfirmBlock = () => {
    setShowBlockModal(false);
    blockUser(contact.id);
    Alert.alert('Contact Blocked', `${contact.displayName} has been blocked.`);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        title="Contact Profile"
        showBack
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={handleShareCard} style={{ padding: 4 }}>
            <Share2 size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        }
        isDark={isDarkMode}
      />

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Image source={{ uri: contact.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.name, { color: theme.textPrimary }]}>{contact.displayName}</Text>
              <ShieldCheck size={16} color={theme.primary} />
            </View>
            <Text style={[styles.wechatId, { color: theme.primary }]}>UPI: {contact.upiId}</Text>
            <Text style={[styles.region, { color: theme.textMuted }]}>📍 {contact.region}</Text>
            {contact.phone && (
              <Text style={[styles.phone, { color: theme.textSecondary }]}>📞 {contact.phone}</Text>
            )}
          </View>
        </View>

        {/* Status / Signature */}
        <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.row}>
            <Text style={[styles.rowTitle, { color: theme.textSecondary }]}>About / Status</Text>
            <Text style={[styles.signatureText, { color: theme.textPrimary }]}>
              {contact.signature || 'No status set'}
            </Text>
          </View>
        </View>

        {/* Moments preview */}
        <View style={[styles.groupCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/moments')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Camera size={18} color="#3B82F6" />
              <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>Moments & Stories</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=120'
                }}
                style={styles.momentThumb}
              />
              <ChevronRight size={18} color={theme.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Actions: Send Message, Calls & Send Shagun */}
        <View style={styles.actionSection}>
          <Button
            title="Send Message"
            onPress={() => router.push(`/chat/${convId}`)}
            variant="primary"
            size="lg"
            icon={<MessageSquare size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
            isDark={isDarkMode}
          />

          <View style={styles.callRow}>
            <Button
              title="Voice Call"
              onPress={() => startCall(contact.displayName, contact.avatarUrl, 'audio')}
              variant="outline"
              size="md"
              icon={<Phone size={18} color={theme.primary} />}
              style={{ flex: 1 }}
              isDark={isDarkMode}
            />
            <Button
              title="Video Call"
              onPress={() => startCall(contact.displayName, contact.avatarUrl, 'video')}
              variant="outline"
              size="md"
              icon={<Video size={18} color={theme.primary} />}
              style={{ flex: 1 }}
              isDark={isDarkMode}
            />
          </View>

          <Button
            title="Send Shagun Envelope via UPI"
            onPress={() => router.push(`/chat/${convId}`)}
            variant="secondary"
            size="md"
            icon={<Gift size={18} color={theme.primaryDark} />}
            style={styles.actionBtn}
            isDark={isDarkMode}
          />

          <Button
            title="Block Contact"
            onPress={() => setShowBlockModal(true)}
            variant="danger"
            size="sm"
            icon={<UserX size={16} color="#FFFFFF" />}
            style={{ marginTop: 12 }}
            isDark={isDarkMode}
          />
        </View>
      </ScrollView>

      {/* Block Confirmation Modal */}
      <ConfirmationModal
        visible={showBlockModal}
        title={`Block ${contact.displayName}?`}
        message="They will no longer be able to message you or call you on ChatIndia."
        confirmText="Block User"
        cancelText="Cancel"
        isDestructive
        onConfirm={handleConfirmBlock}
        onCancel={() => setShowBlockModal(false)}
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
    padding: 16
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginRight: 16
  },
  profileInfo: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontWeight: '800'
  },
  wechatId: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2
  },
  region: {
    fontSize: 11.5,
    marginTop: 2
  },
  phone: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500'
  },
  groupCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14
  },
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  signatureText: {
    fontSize: 13,
    maxWidth: 200,
    textAlign: 'right'
  },
  momentThumb: {
    width: 40,
    height: 40,
    borderRadius: 8
  },
  actionSection: {
    marginTop: 16,
    gap: 10,
    marginBottom: 40
  },
  actionBtn: {
    width: '100%'
  },
  callRow: {
    flexDirection: 'row',
    gap: 10
  }
});
