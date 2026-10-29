import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Phone,
  Video,
  Plus,
  Send,
  Image as ImageIcon,
  Mic,
  Smile,
  FileText,
  CreditCard,
  Gift,
  MoreVertical,
  Check,
  CheckCheck,
  Trash2,
  Copy,
  CornerUpLeft,
  ShieldAlert,
  X
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp, ChatMessage } from '../../src/context/AppContext';
import { RedPacketModal } from '../../src/components/RedPacketModal';
import { ClaimCelebrationModal } from '../../src/components/ClaimCelebrationModal';

const REACTION_EMOJIS = ['❤️', '👍', '😂', '🎉', '🙏', '🔥'];

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    t,
    user,
    conversations,
    messages,
    sendMessage,
    deleteMessage,
    reactToMessage,
    startCall,
    blockUser,
    isDarkMode
  } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const convId = id || 'conv_priya';
  const conv = conversations.find(c => c.id === convId) || {
    id: convId,
    title: 'Chat',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
    partnerId: 'user_unknown',
    isGroup: false,
    memberCount: 2
  };

  const convMessages = messages[convId] || [];
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showRedPacketModal, setShowRedPacketModal] = useState(false);
  const [selectedRedPacket, setSelectedRedPacket] = useState<ChatMessage | null>(null);
  const [showChatInfo, setShowChatInfo] = useState(false);

  // Message Action Sheet (long-press)
  const [selectedMsgForActions, setSelectedMsgForActions] = useState<ChatMessage | null>(null);
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    sendMessage(
      convId,
      inputText.trim(),
      'TEXT',
      undefined,
      replyTarget
        ? {
            id: replyTarget.id,
            senderName: replyTarget.senderName,
            content: replyTarget.content
          }
        : undefined
    );

    setInputText('');
    setReplyTarget(null);
    setShowAttachMenu(false);
    setShowEmojiPicker(false);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendVoiceNote = () => {
    sendMessage(convId, '🎤 Voice Note (4s)', 'VOICE', { voiceDuration: 4 });
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

  const handleSendDocument = () => {
    sendMessage(
      convId,
      '📄 Tech_Architecture_Spec.pdf',
      'DOCUMENT',
      { fileName: 'Tech_Architecture_Spec.pdf', fileSize: '1.4 MB' }
    );
    setShowAttachMenu(false);
  };

  const handleSendUpiTransfer = () => {
    sendMessage(
      convId,
      '💸 UPI Payment: ₹200.00',
      'TRANSFER',
      { amountRupees: 200, note: 'Chai & Snacks Split ☕' }
    );
    setShowAttachMenu(false);
  };

  const handleCopyMessage = (msg: ChatMessage) => {
    Clipboard.setString(msg.content);
    setSelectedMsgForActions(null);
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const handleReplyMessage = (msg: ChatMessage) => {
    setReplyTarget(msg);
    setSelectedMsgForActions(null);
  };

  const handleDeleteMsg = (msg: ChatMessage) => {
    deleteMessage(convId, msg.id);
    setSelectedMsgForActions(null);
  };

  const handleReact = (msg: ChatMessage, emoji: string) => {
    reactToMessage(convId, msg.id, emoji);
    setSelectedMsgForActions(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0B0F19' : '#EDEDED' }]}>
      {/* Top Header matching Screen 08 */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerProfileGroup}
          onPress={() => setShowChatInfo(true)}
          activeOpacity={0.7}
        >
          <View style={styles.headerAvatarWrapper}>
            <Image source={{ uri: conv.avatarUrl }} style={styles.headerAvatar} />
            {!conv.isGroup && <View style={styles.headerOnlineDot} />}
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>
              {conv.title}
            </Text>
            <Text style={[styles.headerStatus, { color: '#07C160' }]}>
              {conv.isGroup ? `${conv.memberCount || 5} members` : 'Online'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => startCall(conv.title, conv.avatarUrl, 'audio')}
          >
            <Phone size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => startCall(conv.title, conv.avatarUrl, 'video')}
          >
            <Video size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setShowChatInfo(true)}
          >
            <MoreVertical size={20} color={theme.textPrimary} />
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

          // Shagun Gift Envelope Bubble
          if (item.type === 'RED_PACKET') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={[styles.redPacketCard, { backgroundColor: '#DC2626' }]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedRedPacket(item)}
                  onLongPress={() => setSelectedMsgForActions(item)}
                >
                  <View style={styles.redPacketTop}>
                    <View style={styles.redPacketIconCircle}>
                      <Text style={styles.redPacketIconText}>🎁</Text>
                    </View>
                    <View style={styles.redPacketInfo}>
                      <Text style={styles.redPacketGreeting}>
                        {item.metadata?.greeting || 'Shagun Best Wishes! 🎁'}
                      </Text>
                      <Text style={styles.redPacketClaimHint}>
                        {item.metadata?.isClaimed ? 'Claimed ✅' : 'Tap to open Shagun Envelope'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.redPacketBottom}>
                    <Text style={styles.redPacketFooterText}>ChatIndia Shagun Pay</Text>
                    <Text style={styles.redPacketTime}>{item.createdAt}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          // Direct UPI Transfer Bubble
          if (item.type === 'TRANSFER') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <View
                  style={[styles.transferCard, { backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF' }]}
                >
                  <View style={styles.transferTop}>
                    <CreditCard size={22} color="#2563EB" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.transferTitle, { color: theme.textPrimary }]}>
                        UPI Transfer: ₹{item.metadata?.amountRupees?.toFixed(2) || '200.00'}
                      </Text>
                      <Text style={[styles.transferNote, { color: theme.textSecondary }]}>
                        {item.metadata?.note || 'Direct payment via UPI'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.transferBottom}>
                    <Text style={[styles.transferFooter, { color: theme.textMuted }]}>
                      Verified UPI • Instant Settlement
                    </Text>
                    <Text style={[styles.transferTime, { color: theme.textMuted }]}>
                      {item.createdAt}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }

          // Document Bubble
          if (item.type === 'DOCUMENT') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={[
                    styles.docCard,
                    { backgroundColor: isMe ? (isDarkMode ? '#059648' : '#95EC69') : theme.surface }
                  ]}
                  onLongPress={() => setSelectedMsgForActions(item)}
                >
                  <FileText size={24} color={isMe ? '#064E3B' : '#3B82F6'} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={[styles.docName, { color: isMe ? '#064E3B' : theme.textPrimary }]}
                      numberOfLines={1}
                    >
                      {item.metadata?.fileName || 'document.pdf'}
                    </Text>
                    <Text style={[styles.docSize, { color: isMe ? '#047857' : theme.textMuted }]}>
                      {item.metadata?.fileSize || '1.2 MB'} • Tap to view
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }

          // Image Bubble
          if (item.type === 'IMAGE') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={styles.imageCard}
                  onLongPress={() => setSelectedMsgForActions(item)}
                >
                  <Image
                    source={{
                      uri: item.metadata?.imageUrl || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600'
                    }}
                    style={styles.photoImg}
                  />
                  <Text style={styles.imageTime}>{item.createdAt}</Text>
                </TouchableOpacity>
              </View>
            );
          }

          // Voice Note Bubble
          if (item.type === 'VOICE') {
            return (
              <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
                {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}
                <TouchableOpacity
                  style={[
                    styles.voiceBubble,
                    { backgroundColor: isMe ? (isDarkMode ? '#059648' : '#95EC69') : theme.surface }
                  ]}
                  onLongPress={() => setSelectedMsgForActions(item)}
                >
                  <Mic size={18} color={isMe ? '#064E3B' : theme.primary} />
                  <Text style={[styles.voiceDuration, { color: isMe ? '#064E3B' : theme.textPrimary }]}>
                    {item.metadata?.voiceDuration || 3}" Voice Note
                  </Text>
                  <Text style={[styles.voiceWave, { color: isMe ? '#047857' : theme.textMuted }]}>
                    ▂ ▃ ▅ ▆ ▇ ▄ ▃
                  </Text>
                  <Text style={[styles.bubbleTime, { color: isMe ? '#047857' : theme.textMuted }]}>
                    {item.createdAt}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }

          // Standard Text Bubble
          return (
            <View style={[styles.bubbleRow, isMe ? styles.bubbleRowMe : styles.bubbleRowThem]}>
              {!isMe && <Image source={{ uri: item.senderAvatar }} style={styles.bubbleAvatar} />}

              <TouchableOpacity
                style={[
                  styles.textBubble,
                  { backgroundColor: isMe ? (isDarkMode ? '#059648' : '#95EC69') : theme.surface }
                ]}
                activeOpacity={0.8}
                onLongPress={() => setSelectedMsgForActions(item)}
              >
                {/* Reply To Preview */}
                {item.replyTo && (
                  <View style={styles.replyInBubble}>
                    <Text style={styles.replyInSender}>{item.replyTo.senderName}</Text>
                    <Text style={styles.replyInText} numberOfLines={1}>
                      {item.replyTo.content}
                    </Text>
                  </View>
                )}

                <Text
                  style={[
                    styles.messageText,
                    { color: isMe ? '#064E3B' : theme.textPrimary }
                  ]}
                >
                  {item.content}
                </Text>

                <View style={styles.timeRow}>
                  <Text style={[styles.bubbleTime, { color: isMe ? '#047857' : theme.textMuted }]}>
                    {item.createdAt}
                  </Text>
                  {isMe && <CheckCheck size={14} color="#047857" style={{ marginLeft: 4 }} />}
                </View>

                {/* Reactions badge */}
                {item.reactions && Object.keys(item.reactions).length > 0 && (
                  <View style={styles.reactionsBadge}>
                    {(Object.entries(item.reactions) as [string, string[]][]).map(([emoji, list]) =>
                      list.length > 0 ? (
                        <Text key={emoji} style={styles.reactionText}>
                          {emoji} {list.length > 1 ? list.length : ''}
                        </Text>
                      ) : null
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Reply Banner if replying */}
      {replyTarget && (
        <View style={[styles.replyBanner, { backgroundColor: theme.surfaceSecondary }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.replyBannerName, { color: theme.primary }]}>
              Replying to {replyTarget.senderName}
            </Text>
            <Text style={[styles.replyBannerContent, { color: theme.textSecondary }]} numberOfLines={1}>
              {replyTarget.content}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTarget(null)}>
            <X size={18} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      {/* Attachment Tray */}
      {showAttachMenu && (
        <View style={[styles.attachGrid, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          {/* Shagun Gift */}
          <TouchableOpacity
            style={styles.attachOption}
            onPress={() => {
              setShowAttachMenu(false);
              setShowRedPacketModal(true);
            }}
          >
            <View style={[styles.attachIconBox, { backgroundColor: '#DC2626' }]}>
              <Gift size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachLabel, { color: theme.textPrimary }]}>Shagun Gift</Text>
          </TouchableOpacity>

          {/* Photo */}
          <TouchableOpacity style={styles.attachOption} onPress={handleSendPhoto}>
            <View style={[styles.attachIconBox, { backgroundColor: '#3B82F6' }]}>
              <ImageIcon size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachLabel, { color: theme.textPrimary }]}>Photo</Text>
          </TouchableOpacity>

          {/* Document */}
          <TouchableOpacity style={styles.attachOption} onPress={handleSendDocument}>
            <View style={[styles.attachIconBox, { backgroundColor: '#8B5CF6' }]}>
              <FileText size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachLabel, { color: theme.textPrimary }]}>Document</Text>
          </TouchableOpacity>

          {/* UPI Direct Pay */}
          <TouchableOpacity style={styles.attachOption} onPress={handleSendUpiTransfer}>
            <View style={[styles.attachIconBox, { backgroundColor: '#10B981' }]}>
              <CreditCard size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.attachLabel, { color: theme.textPrimary }]}>UPI Pay</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Emoji Picker Row */}
      {showEmojiPicker && (
        <View style={[styles.emojiRow, { backgroundColor: theme.surface }]}>
          {['😀', '😂', '❤️', '🔥', '🙏', '🎉', '🏏', '☕', '🇮🇳', '👍'].map(em => (
            <TouchableOpacity
              key={em}
              style={styles.emojiBtn}
              onPress={() => setInputText(prev => prev + em)}
            >
              <Text style={{ fontSize: 24 }}>{em}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Composer Bar */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity style={styles.inputIconBtn} onPress={handleSendVoiceNote}>
            <Mic size={22} color={theme.textMuted} />
          </TouchableOpacity>

          <TextInput
            style={[styles.input, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t.chatDetail.placeholder}
            placeholderTextColor={theme.textMuted}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity
            style={styles.inputIconBtn}
            onPress={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile size={22} color={showEmojiPicker ? theme.primary : theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputIconBtn}
            onPress={() => setShowAttachMenu(!showAttachMenu)}
          >
            <Plus size={24} color={showAttachMenu ? theme.primary : theme.textMuted} />
          </TouchableOpacity>

          {inputText.trim().length > 0 && (
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme.primary }]}
              onPress={handleSend}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Shagun Send Modal */}
      <RedPacketModal
        visible={showRedPacketModal}
        convId={convId}
        onClose={() => setShowRedPacketModal(false)}
      />

      {/* Shagun Claim Celebration Modal */}
      <ClaimCelebrationModal
        visible={!!selectedRedPacket}
        message={selectedRedPacket}
        onClose={() => setSelectedRedPacket(null)}
      />

      {/* Long-press Action Sheet Modal */}
      <Modal visible={!!selectedMsgForActions} transparent animationType="fade">
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setSelectedMsgForActions(null)}
        >
          <View style={[styles.actionSheetCard, { backgroundColor: theme.surface }]}>
            {/* Quick Reactions */}
            <View style={styles.reactionPickers}>
              {REACTION_EMOJIS.map(em => (
                <TouchableOpacity
                  key={em}
                  onPress={() => selectedMsgForActions && handleReact(selectedMsgForActions, em)}
                  style={styles.reactBtn}
                >
                  <Text style={{ fontSize: 22 }}>{em}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={[styles.actionItem, { borderBottomColor: theme.border }]}
              onPress={() => selectedMsgForActions && handleCopyMessage(selectedMsgForActions)}
            >
              <Copy size={18} color={theme.textPrimary} />
              <Text style={[styles.actionText, { color: theme.textPrimary }]}>Copy Text</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderBottomColor: theme.border }]}
              onPress={() => selectedMsgForActions && handleReplyMessage(selectedMsgForActions)}
            >
              <CornerUpLeft size={18} color={theme.textPrimary} />
              <Text style={[styles.actionText, { color: theme.textPrimary }]}>Reply</Text>
            </TouchableOpacity>

            {selectedMsgForActions?.isMe && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => selectedMsgForActions && handleDeleteMsg(selectedMsgForActions)}
              >
                <Trash2 size={18} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete Message</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Chat Info Modal (Report, Block, Profile) */}
      <Modal visible={showChatInfo} transparent animationType="slide">
        <View style={styles.actionSheetOverlay}>
          <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
            <View style={styles.infoTop}>
              <Image source={{ uri: conv.avatarUrl }} style={styles.infoAvatar} />
              <Text style={[styles.infoTitle, { color: theme.textPrimary }]}>{conv.title}</Text>
              <Text style={[styles.infoSub, { color: theme.textMuted }]}>
                {conv.isGroup ? 'Group Conversation' : 'Direct Conversation • UPI Enabled'}
              </Text>
            </View>

            <View style={styles.infoOptions}>
              <TouchableOpacity
                style={[styles.infoRow, { borderBottomColor: theme.border }]}
                onPress={() => {
                  setShowChatInfo(false);
                  Alert.alert('Notifications', 'Chat notifications muted.');
                }}
              >
                <Text style={[styles.infoRowText, { color: theme.textPrimary }]}>
                  Mute Notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.infoRow, { borderBottomColor: theme.border }]}
                onPress={() => {
                  setShowChatInfo(false);
                  Alert.alert('Report Content', 'Report submitted to ChatIndia moderation queue.');
                }}
              >
                <Text style={[styles.infoRowText, { color: '#EF4444' }]}>Report Conversation</Text>
              </TouchableOpacity>

              {!conv.isGroup && (
                <TouchableOpacity
                  style={[styles.infoRow, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    setShowChatInfo(false);
                    blockUser(conv.partnerId);
                    router.back();
                  }}
                >
                  <Text style={[styles.infoRowText, { color: '#EF4444', fontWeight: '800' }]}>
                    Block User
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.closeInfoBtn} onPress={() => setShowChatInfo(false)}>
              <Text style={[styles.closeInfoText, { color: theme.textSecondary }]}>Close</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '700'
  },
  headerProfileGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 10
  },
  headerAvatarWrapper: {
    position: 'relative',
    marginRight: 10
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19
  },
  headerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#07C160',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  headerTextGroup: {
    flex: 1,
    justifyContent: 'center'
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  headerStatus: {
    fontSize: 11,
    fontWeight: '600'
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  headerIconBtn: {
    padding: 4
  },
  messageList: {
    padding: 16,
    paddingBottom: 24
  },
  bubbleRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end'
  },
  bubbleRowMe: {
    justifyContent: 'flex-end'
  },
  bubbleRowThem: {
    justifyContent: 'flex-start'
  },
  bubbleAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 8
  },
  textBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 20
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4
  },
  bubbleTime: {
    fontSize: 10,
    fontWeight: '500'
  },
  reactionsBadge: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  reactionText: {
    fontSize: 11,
    marginRight: 4
  },
  replyInBubble: {
    borderLeftWidth: 2,
    borderLeftColor: '#07C160',
    paddingLeft: 8,
    marginBottom: 6
  },
  replyInSender: {
    fontSize: 11,
    fontWeight: '700',
    color: '#07C160'
  },
  replyInText: {
    fontSize: 11.5,
    color: '#6B7280'
  },
  voiceBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8
  },
  voiceDuration: {
    fontSize: 13,
    fontWeight: '700'
  },
  voiceWave: {
    fontSize: 12
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    maxWidth: '78%'
  },
  docName: {
    fontSize: 13.5,
    fontWeight: '700'
  },
  docSize: {
    fontSize: 11,
    marginTop: 2
  },
  imageCard: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative'
  },
  photoImg: {
    width: 220,
    height: 180,
    borderRadius: 14
  },
  imageTime: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFFFFF',
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  redPacketCard: {
    width: 240,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4
  },
  redPacketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12
  },
  redPacketIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8D486',
    alignItems: 'center',
    justifyContent: 'center'
  },
  redPacketIconText: {
    fontSize: 20
  },
  redPacketInfo: {
    flex: 1
  },
  redPacketGreeting: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  redPacketClaimHint: {
    color: '#FEE2E2',
    fontSize: 11,
    marginTop: 2
  },
  redPacketBottom: {
    backgroundColor: '#B91C1C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  redPacketFooterText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '600'
  },
  redPacketTime: {
    color: '#FCA5A5',
    fontSize: 10
  },
  transferCard: {
    width: 240,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 12
  },
  transferTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  transferTitle: {
    fontSize: 14,
    fontWeight: '800'
  },
  transferNote: {
    fontSize: 11.5,
    marginTop: 2
  },
  transferBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#DBEAFE'
  },
  transferFooter: {
    fontSize: 9.5,
    fontWeight: '600'
  },
  transferTime: {
    fontSize: 9.5
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  replyBannerName: {
    fontSize: 12,
    fontWeight: '700'
  },
  replyBannerContent: {
    fontSize: 12
  },
  attachGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1
  },
  attachOption: {
    alignItems: 'center',
    gap: 6
  },
  attachIconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  attachLabel: {
    fontSize: 12,
    fontWeight: '600'
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  emojiBtn: {
    padding: 4
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    gap: 8
  },
  inputIconBtn: {
    padding: 6
  },
  input: {
    flex: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14.5,
    maxHeight: 100
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  actionSheetCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center'
  },
  reactionPickers: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 8
  },
  reactBtn: {
    padding: 4
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  actionText: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  infoCard: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center'
  },
  infoTop: {
    alignItems: 'center',
    marginBottom: 20
  },
  infoAvatar: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginBottom: 10
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  infoSub: {
    fontSize: 12,
    marginTop: 2
  },
  infoOptions: {
    width: '100%'
  },
  infoRow: {
    paddingVertical: 14,
    borderBottomWidth: 0.5
  },
  infoRowText: {
    fontSize: 15,
    fontWeight: '600'
  },
  closeInfoBtn: {
    marginTop: 16,
    paddingVertical: 8
  },
  closeInfoText: {
    fontSize: 14,
    fontWeight: '700'
  }
});
