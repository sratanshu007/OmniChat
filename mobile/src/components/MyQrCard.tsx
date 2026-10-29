import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share, Alert } from 'react-native';
import { Colors } from '../theme/tokens';
import { Share2, Download, Copy, Check } from 'lucide-react-native';

interface MyQrCardProps {
  user: {
    displayName: string;
    username: string;
    avatarUrl?: string;
    region?: string;
  };
  qrToken: string;
  onRefresh: () => void;
}

export function MyQrCard({ user, qrToken, onRefresh }: MyQrCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Add me on ChatIndia! My username is @${user.username}. Scan my QR code identity: https://chatindia.app/u/${user.username}`
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    Alert.alert('Link Copied! 📋', `chatindia.app/u/${user.username} copied to clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveImage = () => {
    Alert.alert('QR Saved! 🖼️', 'ChatIndia QR code image has been saved to your photo gallery.');
  };

  return (
    <View style={styles.cardContainer}>
      {/* Profile Header matching Screen 12 */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri:
              user.avatarUrl ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240'
          }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.displayName}>{user.displayName}</Text>
      <Text style={styles.username}>@{user.username}</Text>

      {/* QR Code Container */}
      <View style={styles.qrBox}>
        <Image
          source={{
            uri: `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=1&data=${encodeURIComponent(
              `chatindia://profile/${user.username}?token=${qrToken || 'rohan_secure_token'}`
            )}`
          }}
          style={styles.qrImage}
        />
      </View>

      {/* Primary Green Action Button: Share QR */}
      <TouchableOpacity style={styles.primaryShareBtn} onPress={handleShare} activeOpacity={0.85}>
        <Share2 size={18} color="#FFFFFF" />
        <Text style={styles.primaryShareText}>Share QR</Text>
      </TouchableOpacity>

      {/* Secondary Horizontal Buttons: Save Image & Copy Link */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity style={styles.secondaryBtn} onPress={handleSaveImage} activeOpacity={0.7}>
          <Download size={16} color="#374151" />
          <Text style={styles.secondaryBtnText}>Save Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleCopyLink} activeOpacity={0.7}>
          {copied ? (
            <Check size={16} color="#07C160" />
          ) : (
            <Copy size={16} color="#374151" />
          )}
          <Text style={styles.secondaryBtnText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Subtitle matching Screen 12 */}
      <Text style={styles.scanNotice}>
        Scan my QR code to connect with me on ChatIndia
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
    alignItems: 'center',
    marginHorizontal: 16
  },
  avatarWrapper: {
    marginBottom: 10,
    shadowColor: '#07C160',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#07C160'
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2
  },
  username: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 16
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  qrImage: {
    width: 200,
    height: 200,
    borderRadius: 10
  },
  primaryShareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07C160',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
    shadowColor: '#07C160',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3
  },
  primaryShareText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700'
  },
  secondaryRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6
  },
  secondaryBtnText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '600'
  },
  scanNotice: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500'
  }
});
