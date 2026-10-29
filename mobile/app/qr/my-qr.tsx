import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, Download, Copy, Check } from 'lucide-react-native';
import Svg, { Rect } from 'react-native-svg';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

const { width } = Dimensions.get('window');

// High precision vector QR pattern
const QrPattern = () => {
  const size = 180;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background White */}
      <Rect width="100" height="100" fill="#FFFFFF" />

      {/* Top Left Marker */}
      <Rect x="8" y="8" width="28" height="28" fill="#111827" rx="3" />
      <Rect x="12" y="12" width="20" height="20" fill="#FFFFFF" rx="2" />
      <Rect x="16" y="16" width="12" height="12" fill="#07C160" rx="1" />

      {/* Top Right Marker */}
      <Rect x="64" y="8" width="28" height="28" fill="#111827" rx="3" />
      <Rect x="68" y="12" width="20" height="20" fill="#FFFFFF" rx="2" />
      <Rect x="72" y="16" width="12" height="12" fill="#07C160" rx="1" />

      {/* Bottom Left Marker */}
      <Rect x="8" y="64" width="28" height="28" fill="#111827" rx="3" />
      <Rect x="12" y="68" width="20" height="20" fill="#FFFFFF" rx="2" />
      <Rect x="16" y="72" width="12" height="12" fill="#07C160" rx="1" />

      {/* Center QR Matrix bits */}
      <Rect x="42" y="12" width="6" height="6" fill="#111827" />
      <Rect x="52" y="12" width="6" height="6" fill="#111827" />
      <Rect x="42" y="24" width="6" height="6" fill="#111827" />
      <Rect x="48" y="32" width="6" height="6" fill="#07C160" />
      <Rect x="12" y="44" width="6" height="6" fill="#111827" />
      <Rect x="24" y="44" width="6" height="6" fill="#111827" />
      <Rect x="34" y="44" width="6" height="6" fill="#111827" />
      <Rect x="44" y="44" width="12" height="12" fill="#07C160" rx="2" />
      <Rect x="62" y="44" width="6" height="6" fill="#111827" />
      <Rect x="74" y="44" width="6" height="6" fill="#111827" />
      <Rect x="84" y="44" width="6" height="6" fill="#111827" />
      <Rect x="42" y="62" width="6" height="6" fill="#111827" />
      <Rect x="52" y="70" width="6" height="6" fill="#07C160" />
      <Rect x="62" y="62" width="6" height="6" fill="#111827" />
      <Rect x="74" y="72" width="6" height="6" fill="#111827" />
      <Rect x="84" y="80" width="6" height="6" fill="#111827" />
      <Rect x="42" y="82" width="6" height="6" fill="#111827" />
      <Rect x="52" y="84" width="6" height="6" fill="#111827" />
      <Rect x="68" y="84" width="6" height="6" fill="#111827" />
    </Svg>
  );
};

export default function MyQrScreen() {
  const router = useRouter();
  const { user, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Link Copied', `https://chatindia.app/u/${user.username}`);
  };

  const handleShare = () => {
    Alert.alert('Share QR Code', `Share Rohan Sharma's ChatIndia card via WhatsApp, Telegram or SMS.`);
  };

  const handleSave = () => {
    Alert.alert('Saved to Gallery', 'ChatIndia QR card has been saved to your Photos.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>My QR Code</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main QR Card matching Screen 12 */}
        <View style={[styles.qrCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* User profile header inside card */}
          <View style={styles.userHeader}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <Text style={[styles.displayName, { color: theme.textPrimary }]}>
              {user.displayName}
            </Text>
            <Text style={[styles.username, { color: theme.textMuted }]}>
              @{user.username}
            </Text>
          </View>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            <QrPattern />
          </View>

          {/* Actions matching Screen 12: [Share QR] [Save Image] [Copy Link] */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: theme.primary }]}
              onPress={handleShare}
              activeOpacity={0.85}
            >
              <Share2 size={16} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Share QR</Text>
            </TouchableOpacity>

            <View style={styles.secondaryActionsRow}>
              <TouchableOpacity
                style={[styles.secondaryActionBtn, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}
                onPress={handleSave}
                activeOpacity={0.7}
              >
                <Download size={15} color={theme.textPrimary} />
                <Text style={[styles.secondaryActionText, { color: theme.textPrimary }]}>Save Image</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryActionBtn, { borderColor: theme.border, backgroundColor: theme.surfaceSecondary }]}
                onPress={handleCopyLink}
                activeOpacity={0.7}
              >
                {copied ? <Check size={15} color={theme.primary} /> : <Copy size={15} color={theme.textPrimary} />}
                <Text style={[styles.secondaryActionText, { color: theme.textPrimary }]}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slogan at bottom of card */}
          <Text style={[styles.scanHint, { color: theme.textSecondary }]}>
            Scan my QR code to connect with me on ChatIndia
          </Text>
        </View>
      </ScrollView>
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
    paddingVertical: 12
  },
  backBtn: {
    padding: 6
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center'
  },
  qrCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3
  },
  userHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  username: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 24
  },
  cardActions: {
    width: '100%',
    gap: 12,
    marginBottom: 16
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  secondaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 42,
    borderRadius: 21,
    borderWidth: 1
  },
  secondaryActionText: {
    fontSize: 13,
    fontWeight: '700'
  },
  scanHint: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6
  }
});

