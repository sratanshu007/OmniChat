import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MessageSquare,
  Phone,
  Video,
  Camera,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';

export default function ContactProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { friends, startCall } = useApp();

  const contact = friends.find(f => f.id === id) || {
    id: id || 'user_emma',
    displayName: 'Emma Watson',
    username: 'emma_w',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
    region: 'London, UK',
    signature: 'Keep smiling, tomorrow is a brand new day 🌸',
    phone: '+44 7911 123456'
  };

  const convId = contact.id === 'user_emma' ? 'conv_emma' : contact.id === 'user_wei' ? 'conv_wei' : 'conv_' + contact.id;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#111827" />
          <Text style={styles.backLabel}>Contacts</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: contact.avatarUrl }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.name}>{contact.displayName}</Text>
              <ShieldCheck size={16} color="#07C160" />
            </View>
            <Text style={styles.wechatId}>WeChat ID: {contact.username}</Text>
            <Text style={styles.region}>📍 Region: {contact.region}</Text>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.groupCard}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Signature</Text>
            <Text style={styles.signatureText}>{contact.signature || 'No status set'}</Text>
          </View>
        </View>

        {/* Moments preview */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push('/moments')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Camera size={18} color="#3B82F6" />
              <Text style={styles.rowTitle}>Moments (朋友圈)</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=120'
                }}
                style={styles.momentThumb}
              />
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Actions: Send Message & Calls */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={() => router.push(`/chat/${convId}`)}
          >
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.messageBtnText}>Send Message (发消息)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => startCall(contact.displayName, contact.avatarUrl, 'audio')}
          >
            <Phone size={20} color="#111827" />
            <Text style={styles.callBtnText}>Voice Call (语音通话)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.callBtn}
            onPress={() => startCall(contact.displayName, contact.avatarUrl, 'video')}
          >
            <Video size={20} color="#111827" />
            <Text style={styles.callBtnText}>Video Call (视频通话)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827'
  },
  content: {
    flex: 1
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 12,
    marginRight: 16
  },
  profileInfo: {
    flex: 1
  },
  name: {
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
  groupCard: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  signatureText: {
    fontSize: 13,
    color: '#6B7280',
    maxWidth: '70%'
  },
  momentThumb: {
    width: 38,
    height: 38,
    borderRadius: 6
  },
  actionSection: {
    margin: 16,
    gap: 10
  },
  messageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#07C160',
    paddingVertical: 14,
    borderRadius: 10
  },
  messageBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  callBtnText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700'
  }
});
