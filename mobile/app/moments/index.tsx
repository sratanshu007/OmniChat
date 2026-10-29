import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Camera,
  Heart,
  MessageCircle,
  Send,
  Plus,
  MapPin,
  Lock,
  Globe,
  Trash2,
  X
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { Button } from '../../src/components/Button';

export default function MomentsScreen() {
  const router = useRouter();
  const { user, moments, postMoment, likeMoment, addMomentComment, deleteMoment, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [locationTag, setLocationTag] = useState('Bengaluru, Karnataka');
  const [audience, setAudience] = useState<'FRIENDS' | 'ALL'>('FRIENDS');
  const [refreshing, setRefreshing] = useState(false);

  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  const handleCreatePost = () => {
    if (!newContent.trim()) {
      Alert.alert('Empty Post', 'Please write something to share on Moments.');
      return;
    }
    const sampleImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600';
    postMoment(newContent.trim(), sampleImage, locationTag);
    setNewContent('');
    setShowCreateModal(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentText.trim()) return;
    addMomentComment(postId, commentText.trim());
    setCommentText('');
    setCommentingPostId(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color={theme.textPrimary} />
          <Text style={[styles.backLabel, { color: theme.textPrimary }]}>Discover</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>Moments & Stories</Text>
        <TouchableOpacity style={styles.cameraBtn} onPress={() => setShowCreateModal(true)}>
          <Camera size={22} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={moments}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={() => (
          <View>
            {/* Cover Banner */}
            <View style={styles.coverSection}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000'
                }}
                style={styles.coverImage}
              />
              <View style={styles.profileBadge}>
                <Text style={styles.badgeName}>{user.displayName}</Text>
                <Image source={{ uri: user.avatarUrl }} style={styles.badgeAvatar} />
              </View>
            </View>

            {/* Stories Status Carousel */}
            <View style={[styles.storiesRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
                {/* Add Story */}
                <TouchableOpacity
                  style={styles.storyItem}
                  onPress={() => setShowCreateModal(true)}
                >
                  <View style={[styles.addStoryRing, { borderColor: theme.primary }]}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.storyAvatar} />
                    <View style={[styles.addPlusBadge, { backgroundColor: theme.primary }]}>
                      <Plus size={12} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={[styles.storyName, { color: theme.textPrimary }]}>Your Story</Text>
                </TouchableOpacity>

                {/* Friends' Stories matching Screen 15: Riya, Rahul, Priya, Neha */}
                {[
                  { name: 'Riya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160' },
                  { name: 'Rahul', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160' },
                  { name: 'Priya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160' },
                  { name: 'Neha', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160' }
                ].map((s, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.storyItem}
                    onPress={() => Alert.alert(`${s.name}'s Story 📸`, `${s.name} posted a new moment 2 hours ago!`)}
                  >
                    <View style={[styles.storyRing, { borderColor: '#07C160' }]}>
                      <Image source={{ uri: s.avatar }} style={styles.storyAvatar} />
                    </View>
                    <Text style={[styles.storyName, { color: theme.textPrimary }]}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        renderItem={({ item }) => {
          const isLikedByMe = item.likes.includes(user.displayName);
          const isMyPost = item.authorId === user.id;

          return (
            <View style={[styles.postItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
              {/* Author Avatar */}
              <Image source={{ uri: item.authorAvatar }} style={styles.postAvatar} />

              <View style={styles.postBody}>
                {/* Author Name and Location */}
                <View style={styles.authorRow}>
                  <Text style={[styles.postAuthor, { color: theme.textPrimary }]}>
                    {item.authorName}
                  </Text>
                  {isMyPost && (
                    <TouchableOpacity onPress={() => deleteMoment(item.id)}>
                      <Trash2 size={15} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {item.locationName && (
                  <Text style={[styles.postLocation, { color: theme.primary }]}>
                    📍 {item.locationName}
                  </Text>
                )}

                {/* Content */}
                <Text style={[styles.postText, { color: theme.textPrimary }]}>{item.content}</Text>

                {/* Media grid */}
                {item.mediaUrls && item.mediaUrls.length > 0 && (
                  <View style={styles.mediaGrid}>
                    {item.mediaUrls.map((url, idx) => (
                      <Image key={idx} source={{ uri: url }} style={styles.postImage} />
                    ))}
                  </View>
                )}

                {/* Footer / Time & Action buttons */}
                <View style={styles.postFooter}>
                  <Text style={[styles.postTime, { color: theme.textMuted }]}>{item.createdAt}</Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => likeMoment(item.id)}
                    >
                      <Heart
                        size={16}
                        color={isLikedByMe ? '#EF4444' : theme.textMuted}
                        fill={isLikedByMe ? '#EF4444' : 'transparent'}
                      />
                      <Text style={[styles.actionBtnText, isLikedByMe && styles.likedText]}>
                        {item.likes.length}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        setCommentingPostId(commentingPostId === item.id ? null : item.id)
                      }
                    >
                      <MessageCircle size={16} color={theme.textMuted} />
                      <Text style={styles.actionBtnText}>{item.comments.length}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Likes List */}
                {item.likes.length > 0 && (
                  <View style={[styles.likesBox, { backgroundColor: theme.surfaceSecondary }]}>
                    <Heart size={13} color="#576B95" fill="#576B95" />
                    <Text style={styles.likesText}>{item.likes.join(', ')}</Text>
                  </View>
                )}

                {/* Comments List */}
                {item.comments.length > 0 && (
                  <View style={[styles.commentsBox, { backgroundColor: theme.surfaceSecondary }]}>
                    {item.comments.map(c => (
                      <View key={c.id} style={styles.commentRow}>
                        <Text style={[styles.commentAuthor, { color: theme.primary }]}>
                          {c.authorName}:{' '}
                        </Text>
                        <Text style={[styles.commentText, { color: theme.textPrimary }]}>
                          {c.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Inline Comment Composer */}
                {commentingPostId === item.id && (
                  <View style={styles.inlineCommentRow}>
                    <TextInput
                      style={[styles.commentInput, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                      placeholder="Write a comment..."
                      placeholderTextColor={theme.textMuted}
                      value={commentText}
                      onChangeText={setCommentText}
                      returnKeyType="send"
                      onSubmitEditing={() => handleSendComment(item.id)}
                    />
                    <TouchableOpacity
                      style={[styles.commentSendBtn, { backgroundColor: theme.primary }]}
                      onPress={() => handleSendComment(item.id)}
                    >
                      <Send size={15} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Create Post Modal */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={[styles.modalCancel, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>Share to Moments</Text>
            <Button
              title="Post"
              onPress={handleCreatePost}
              variant="primary"
              size="sm"
              disabled={!newContent.trim()}
              isDark={isDarkMode}
            />
          </View>

          <ScrollView style={{ padding: 16 }}>
            <TextInput
              style={[styles.createPostInput, { color: theme.textPrimary }]}
              placeholder="What's happening in your day? Share photos, chai moments, or updates..."
              placeholderTextColor={theme.textMuted}
              multiline
              value={newContent}
              onChangeText={setNewContent}
            />

            <View style={styles.imagePreviewContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'
                }}
                style={styles.attachedPreview}
              />
            </View>

            {/* Location & Audience */}
            <View style={[styles.postOptionsCard, { backgroundColor: theme.surfaceSecondary }]}>
              <View style={styles.optionRow}>
                <MapPin size={18} color={theme.primary} />
                <TextInput
                  style={[styles.optionInput, { color: theme.textPrimary }]}
                  value={locationTag}
                  onChangeText={setLocationTag}
                  placeholder="Location tag..."
                  placeholderTextColor={theme.textMuted}
                />
              </View>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setAudience(audience === 'FRIENDS' ? 'ALL' : 'FRIENDS')}
              >
                <Lock size={18} color={theme.primary} />
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>
                  Audience: {audience === 'FRIENDS' ? 'Friends Only' : 'Public'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
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
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  cameraBtn: {
    padding: 6
  },
  coverSection: {
    height: 200,
    position: 'relative',
    marginBottom: 40
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  profileBadge: {
    position: 'absolute',
    bottom: -30,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  badgeName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4
  },
  badgeAvatar: {
    width: 64,
    height: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  storiesRow: {
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  storyItem: {
    alignItems: 'center',
    gap: 4
  },
  addStoryRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  storyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  storyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  addPlusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  storyName: {
    fontSize: 11,
    fontWeight: '700'
  },
  postItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0.5
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginRight: 12
  },
  postBody: {
    flex: 1
  },
  authorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#576B95'
  },
  postLocation: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6
  },
  mediaGrid: {
    marginTop: 8,
    borderRadius: 8,
    overflow: 'hidden'
  },
  postImage: {
    width: '100%',
    height: 190,
    borderRadius: 8
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10
  },
  postTime: {
    fontSize: 11.5
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  actionBtnText: {
    fontSize: 12,
    color: '#6B7280'
  },
  likedText: {
    color: '#EF4444',
    fontWeight: '700'
  },
  likesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8
  },
  likesText: {
    fontSize: 12,
    color: '#576B95',
    fontWeight: '600'
  },
  commentsBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4
  },
  commentRow: {
    flexDirection: 'row',
    marginVertical: 2
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700'
  },
  commentText: {
    fontSize: 12,
    flex: 1
  },
  inlineCommentRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8
  },
  commentInput: {
    flex: 1,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13
  },
  commentSendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  modalCancel: {
    fontSize: 15,
    fontWeight: '600'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  createPostInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  imagePreviewContainer: {
    marginVertical: 14
  },
  attachedPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12
  },
  postOptionsCard: {
    borderRadius: 12,
    padding: 12,
    gap: 12
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  optionInput: {
    flex: 1,
    fontSize: 13.5
  },
  optionText: {
    fontSize: 13.5,
    fontWeight: '600'
  }
});
