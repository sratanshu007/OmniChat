import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Phone,
  Video,
  Plus,
  Send,
  Image as ImageIcon,
  Mic,
  DollarSign
} from 'lucide-react-native';
import { useApp, ChatMessage } from '../../src/context/AppContext';
import { RedPacketModal } from '../../src/components/RedPacketModal';
import { ClaimCelebrationModal } from '../../src/components/ClaimCelebrationModal';

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { conversations, messages, sendMessage, startCall } = useApp();

  const convId = id || 'conv_emma';
  const conv = conversations.find(c => c.id === convId) || {
    id: convId,
    title: 'Chat',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
    partnerId: 'user_unknown'
  };

  const convMessages = messages[convId] || [];
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showRedPacketModal, setShowRedPacketModal] = useState(false);
  const [selectedRedPacket, setSelectedRedPacket] = useState<ChatMessage | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(convId, inputText.trim(), 'TEXT');
    setInputText('');
    setShowAttachMenu(false);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendVoiceNote = () => {
    sendMessage(convId, '🎤 Voice Note (3s)', 'VOICE', { voiceDuration: 3 });
    setShowAttachMenu(false);
  };

  const handleSendPhoto = () => {
    sendMessage(
      convId,
      '📷 Sent a photo',
      'IMAGE',
      { imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600' }
    );
    setShowAttachMenu(false);
  };

  const handleStartAudioCall = () => {
    startCall(conv.title, conv.avatarUrl, 'audio');
  };

  const handleStartVideoCall = () => {
    startCall(conv.title, conv.avatarUrl, 'video');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#111827" />
          <Text style={styles.backLabel}>Chats</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conv.title}
          </Text>
          <Text style={styles.headerStatus}>Online via WeChat Protocol</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={handleStartAudioCall}>
            <Phone size={20} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={handleStartVideoCall}>
            <Video size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={convMessages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const isMe = item.isMe;

          // Render Red Packet Bubble
          if (item.type === 'RED_PACKET') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={styles.redPacketCard}
                  activeOpacity={0.85}
                  onPress={() => setSelectedRedPacket(item)}
                >
                  <View style={styles.redPacketTop}>
                    <View style={styles.redPacketIconCircle}>
                      <Text style={styles.redPacketIconText}>🧧</Text>
                    </View>
                    <View style={styles.redPacketInfo}>
                      <Text style={styles.redPacketGreeting}>
                        {item.metadata?.greeting || 'Best Wishes!'}
                      </Text>
                      <Text style={styles.redPacketClaimHint}>
                        {item.metadata?.isClaimed ? 'Claimed ✅' : 'Tap to open WeChat Red Packet'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.redPacketBottom}>
                    <Text style={styles.redPacketFooterText}>OmniChat Lucky Money</Text>
                  </View>
                </TouchableOpacity>
                {isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
              </View>
            );
          }

          // Render Image Bubble
          if (item.type === 'IMAGE' && item.metadata?.imageUrl) {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <View style={[styles.imageBubble, isMe && styles.imageBubbleMe]}>
                  <Image source={{ uri: item.metadata.imageUrl }} style={styles.photoContent} />
                  <Text style={styles.messageTime}>{item.createdAt}</Text>
                </View>
                {isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
              </View>
            );
          }

          // Render Voice Message Bubble
          if (item.type === 'VOICE') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={[styles.voiceBubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
                  onPress={() => Alert.alert('Playing Audio', 'Simulating WeChat Voice Note playback 🔊')}
                >
                  <Mic size={18} color={isMe ? '#111827' : '#111827'} />
                  <Text style={styles.voiceText}>(( 3" ))</Text>
                  <Text style={styles.messageTime}>{item.createdAt}</Text>
                </TouchableOpacity>
                {isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
              </View>
            );
          }

          // Standard Text Bubble
          return (
            <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
              {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
              <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={styles.bubbleText}>{item.content}</Text>
                <Text style={styles.messageTime}>{item.createdAt}</Text>
              </View>
              {isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
            </View>
          );
        }}
      />

      {/* Attachment Tray (Red packet, voice call, video call, photo) */}
      {showAttachMenu && (
        <View style={styles.attachMenu}>
          <TouchableOpacity style={styles.attachOption} onPress={() => setShowRedPacketModal(true)}>
            <View style={[styles.attachIconBox, { backgroundColor: '#FA4E42' }]}>
              <Text style={{ fontSize: 24 }}>🧧</Text>
            </View>
            <Text style={styles.attachLabel}>Red Packet</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachOption} onPress={handleSendPhoto}>
            <View style={[styles.attachIconBox, { backgroundColor: '#3B82F6' }]}>
              <ImageIcon size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.attachLabel}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachOption} onPress={handleStartAudioCall}>
            <View style={[styles.attachIconBox, { backgroundColor: '#10B981' }]}>
              <Phone size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.attachLabel}>Voice Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.attachOption} onPress={handleStartVideoCall}>
            <View style={[styles.attachIconBox, { backgroundColor: '#8B5CF6' }]}>
              <Video size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.attachLabel}>Video Call</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Input Row */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.inputIconBtn} onPress={handleSendVoiceNote}>
            <Mic size={24} color="#6B7280" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={styles.inputIconBtn}
            onPress={() => setShowAttachMenu(!showAttachMenu)}
          >
            <Plus size={24} color={showAttachMenu ? '#07C160' : '#6B7280'} />
          </TouchableOpacity>

          {inputText.trim().length > 0 && (
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Red Packet Create Modal */}
      <RedPacketModal
        visible={showRedPacketModal}
        convId={convId}
        onClose={() => setShowRedPacketModal(false)}
      />

      {/* Red Packet Claim Modal */}
      <ClaimCelebrationModal
        visible={!!selectedRedPacket}
        message={selectedRedPacket}
        onClose={() => setSelectedRedPacket(null)}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
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
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },
  headerStatus: {
    fontSize: 11,
    color: '#07C160',
    fontWeight: '600'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12
  },
  headerIconBtn: {
    padding: 6
  },
  messageList: {
    padding: 16,
    gap: 14
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginVertical: 4
  },
  bubbleRowMe: {
    justifyContent: 'flex-end'
  },
  bubbleRowThem: {
    justifyContent: 'flex-start'
  },
  bubbleAvatar: {
    width: 38,
    height: 38,
    borderRadius: 8
  },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8
  },
  bubbleMe: {
    backgroundColor: '#95EC69', // Classic WeChat Emerald Green
    borderTopRightRadius: 2
  },
  bubbleThem: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2
  },
  bubbleText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 20
  },
  messageTime: {
    fontSize: 9.5,
    color: '#6B7280',
    alignSelf: 'flex-end',
    marginTop: 4
  },
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 110
  },
  voiceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  imageBubble: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    padding: 4
  },
  imageBubbleMe: {
    backgroundColor: '#95EC69'
  },
  photoContent: {
    width: 200,
    height: 140,
    borderRadius: 6
  },
  redPacketCard: {
    width: 230,
    backgroundColor: '#FA9D3B', // WeChat Red Packet orange-red
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2
  },
  redPacketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FA5151'
  },
  redPacketIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBE8B3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  redPacketIconText: {
    fontSize: 20
  },
  redPacketInfo: {
    flex: 1
  },
  redPacketGreeting: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  redPacketClaimHint: {
    fontSize: 11,
    color: '#FBE8B3',
    marginTop: 2
  },
  redPacketBottom: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF'
  },
  redPacketFooterText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '600'
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F7F7F7',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 100
  },
  inputIconBtn: {
    padding: 4
  },
  sendBtn: {
    backgroundColor: '#07C160',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F7F7F7',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB'
  },
  attachOption: {
    alignItems: 'center',
    gap: 6
  },
  attachIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563'
  }
});
