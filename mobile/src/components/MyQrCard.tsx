import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Share } from 'react-native';
import { Colors } from '../theme/tokens';
import { Share2, RefreshCw, Download } from 'lucide-react-native';

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
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Add me on OmniChat! My username is @${user.username}. Scan my QR code identity: ${qrToken}`
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <View style={styles.cardContainer}>
      {/* User Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.displayName}>{user.displayName}</Text>
          <Text style={styles.username}>OmniChat ID: @{user.username}</Text>
          <Text style={styles.region}>📍 {user.region || 'India'}</Text>
        </View>
      </View>

      {/* QR Code Graphic Box */}
      <View style={styles.qrBox}>
        {/* Crisp deterministic SVG/styled grid */}
        <View style={styles.qrMatrixContainer}>
          <Image
            source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrToken || user.username)}` }}
            style={styles.qrImage}
          />
        </View>
        <Text style={styles.scanNotice}>Scan this QR code to add me as a friend on OmniChat</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
          <Share2 size={16} color={Colors.light.primary} />
          <Text style={styles.actionText}>Share Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={onRefresh}>
          <RefreshCw size={16} color={Colors.light.primary} />
          <Text style={styles.actionText}>Reset Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
    marginHorizontal: 20
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 14
  },
  profileInfo: {
    flex: 1
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  username: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2
  },
  region: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2
  },
  qrBox: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  qrMatrixContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden'
  },
  qrImage: {
    width: '100%',
    height: '100%'
  },
  scanNotice: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.light.primaryLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.primary
  }
});
