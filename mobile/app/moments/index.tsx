import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, Heart, MessageCircle, Send } from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';

export default function MomentsScreen() {
  const router = useRouter();
  const { user, moments, postMoment, likeMoment, addMomentComment } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'
  );

  const [commentingPostId, setCommentingPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleCreatePost = () => {
    if (!newContent.trim()) return;
    postMoment(newContent.trim(), newImageUrl);
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
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#FFFFFF" />
          <Text style={styles.backLabel}>Discover</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moments (朋友圈)</Text>
        <TouchableOpacity style={styles.cameraBtn} onPress={() => setShowCreateModal(true)}>
          <Camera size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={moments}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
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
        )}
        renderItem={({ item }) => {
          const isLikedByMe = item.likes.includes(user.displayName);

          return (
            <View style={styles.postItem}>
              {/* Author Avatar */}
              <Image source={{ uri: item.authorAvatar }} style={styles.postAvatar} />

              <View style={styles.postBody}>
                {/* Author Name */}
                <Text style={styles.postAuthor}>{item.authorName}</Text>

                {/* Content */}
                <Text style={styles.postText}>{item.content}</Text>

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
                  <Text style={styles.postTime}>{item.createdAt}</Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => likeMoment(item.id)}
                    >
                      <Heart
                        size={16}
                        color={isLikedByMe ? '#EF4444' : '#6B7280'}
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
                      <MessageCircle size={16} color="#6B7280" />
                      <Text style={styles.actionBtnText}>{item.comments.length}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Likes List */}
                {item.likes.length > 0 && (
                  <View style={styles.likesBox}>
                    <Heart size={13} color="#576B95" fill="#576B95" />
                    <Text style={styles.likesText}>{item.likes.join(', ')}</Text>
                  </View>
                )}

                {/* Comments List */}
                {item.comments.length > 0 && (
                  <View style={styles.commentsBox}>
                    {item.comments.map(c => (
                      <Text key={c.id} style={styles.commentLine}>
                        <Text style={styles.commentAuthor}>{c.authorName}: </Text>
                        {c.text}
                      </Text>
                    ))}
                  </View>
                )}

                {/* Comment Input */}
                {commentingPostId === item.id && (
                  <View style={styles.commentInputRow}>
                    <TextInput
                      style={styles.commentInput}
                      placeholder="Add a comment..."
                      placeholderTextColor="#9CA3AF"
                      value={commentText}
                      onChangeText={setCommentText}
                      onSubmitEditing={() => handleSendComment(item.id)}
                    />
                    <TouchableOpacity
                      style={styles.commentSendBtn}
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

      {/* Create New Moment Modal */}
      <Modal visible={showCreateModal} animationType="slide">
        <SafeAreaView style={styles.createModalContainer}>
          <View style={styles.createModalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.createModalTitle}>New Moment</Text>
            <TouchableOpacity style={styles.publishBtn} onPress={handleCreatePost}>
              <Text style={styles.publishBtnText}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.createModalBody}>
            <TextInput
              style={styles.createInput}
              multiline
              placeholder="What's on your mind? Share with WeChat friends..."
              placeholderTextColor="#9CA3AF"
              value={newContent}
              onChangeText={setNewContent}
            />

            <View style={styles.imageSelector}>
              <Text style={styles.imageSelectorLabel}>Attach Photo URL:</Text>
              <TextInput
                style={styles.urlInput}
                value={newImageUrl}
                onChangeText={setNewImageUrl}
              />
              <Image source={{ uri: newImageUrl }} style={styles.previewImage} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B'
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  cameraBtn: {
    padding: 4
  },
  coverSection: {
    position: 'relative',
    marginBottom: 40
  },
  coverImage: {
    width: '100%',
    height: 220
  },
  profileBadge: {
    position: 'absolute',
    bottom: -24,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  badgeName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  badgeAvatar: {
    width: 68,
    height: 68,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  postItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    gap: 12
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 8
  },
  postBody: {
    flex: 1
  },
  postAuthor: {
    fontSize: 15,
    fontWeight: '800',
    color: '#576B95' // Classic WeChat Blue-Purple username
  },
  postText: {
    fontSize: 14,
    color: '#1F2937',
    marginTop: 4,
    lineHeight: 20
  },
  mediaGrid: {
    marginTop: 8
  },
  postImage: {
    width: 220,
    height: 150,
    borderRadius: 8
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  postTime: {
    fontSize: 11,
    color: '#9CA3AF'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  actionBtnText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600'
  },
  likedText: {
    color: '#EF4444'
  },
  likesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F3F4F6',
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
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
    gap: 4
  },
  commentLine: {
    fontSize: 12.5,
    color: '#374151'
  },
  commentAuthor: {
    fontWeight: '700',
    color: '#576B95'
  },
  commentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  commentSendBtn: {
    backgroundColor: '#07C160',
    padding: 8,
    borderRadius: 6
  },
  createModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  createModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  cancelText: {
    fontSize: 15,
    color: '#6B7280'
  },
  createModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },
  publishBtn: {
    backgroundColor: '#07C160',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6
  },
  publishBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  createModalBody: {
    padding: 16
  },
  createInput: {
    fontSize: 15,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top'
  },
  imageSelector: {
    marginTop: 20
  },
  imageSelectorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6
  },
  urlInput: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 12,
    color: '#374151',
    marginBottom: 10
  },
  previewImage: {
    width: 140,
    height: 100,
    borderRadius: 8
  }
});
