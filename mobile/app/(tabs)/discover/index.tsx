import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Video, QrCode, Smartphone, Globe, Search, Sparkles, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { QrCameraScanner } from '../../../src/components/QrCameraScanner';

export default function DiscoverScreen() {
  const router = useRouter();
  const { moments } = useApp();
  const [showScanner, setShowScanner] = useState(false);

  const latestMomentAuthorAvatar = moments[0]?.authorAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover (发现)</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Group 1: Moments */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push('/moments')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#3B82F6' }]}>
              <Camera size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Moments (朋友圈)</Text>
            <View style={styles.momentsPreview}>
              <Image source={{ uri: latestMomentAuthorAvatar }} style={styles.previewAvatar} />
              <View style={styles.redDot} />
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Group 2: Channels */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Channels (视频号)', 'Short video feeds similar to WeChat Channels')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#F97316' }]}>
              <Video size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Channels (视频号)</Text>
            <Text style={styles.hotTag}>Hot Clips 🔥</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Group 3: Scan & Shake */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => setShowScanner(true)}
          >
            <View style={[styles.iconBox, { backgroundColor: Colors.light.primary }]}>
              <QrCode size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Scan (扫一扫)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Shake (摇一摇)', 'Looking for nearby people who are shaking phones...')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#10B981' }]}>
              <Smartphone size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Shake (摇一摇)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Group 4: Top Stories & Search */}
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Top Stories', 'Trending articles read by friends in WeChat')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EAB308' }]}>
              <Globe size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Top Stories (看一看)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Search (搜一搜)', 'Global WeChat Search index')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#EF4444' }]}>
              <Search size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Search (搜一搜)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Group 5: Mini Programs */}
        <View style={[styles.groupCard, { marginBottom: 30 }]}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => router.push('/(tabs)/services')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#8B5CF6' }]}>
              <Sparkles size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.rowLabel}>Mini Programs (小程序)</Text>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner onClose={() => setShowScanner(false)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EDEDED',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  content: {
    flex: 1
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
  momentsPreview: {
    position: 'relative',
    marginRight: 10
  },
  previewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 4
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.badgeRed
  },
  hotTag: {
    fontSize: 11,
    color: '#F97316',
    fontWeight: '700',
    marginRight: 8
  }
});
