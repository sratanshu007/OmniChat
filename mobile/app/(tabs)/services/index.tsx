import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Sparkles, Gamepad2, Car, Utensils, CloudSun } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { api } from '../../../src/services/api';

export default function ServicesScreen() {
  const [miniApps, setMiniApps] = useState<any[]>([]);

  useEffect(() => {
    loadMiniApps();
  }, []);

  const loadMiniApps = async () => {
    try {
      const res = await api.request('/services/mini-apps');
      if (res.miniApps) setMiniApps(res.miniApps);
    } catch (e) {
      console.warn(e);
    }
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'jump-2048': return <Gamepad2 size={24} color="#F59E0B" />;
      case 'omni-ride': return <Car size={24} color="#F97316" />;
      case 'omni-eats': return <Utensils size={24} color="#10B981" />;
      default: return <CloudSun size={24} color="#3B82F6" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services & Mini Programs (服务与小程序)</Text>
      </View>

      <FlatList
        data={miniApps}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.banner}>
            <View style={styles.bannerBadge}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.bannerBadgeText}>MINI ECOSYSTEM</Text>
            </View>
            <Text style={styles.bannerTitle}>Instant Apps, Zero Installs</Text>
            <Text style={styles.bannerSubtitle}>
              Play casual games, hail rides, order food, and check weather with WeChat Pay integration.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.appCard}>
            <View style={styles.iconContainer}>
              {getIcon(item.appKey)}
            </View>
            <View style={styles.appInfo}>
              <View style={styles.appNameRow}>
                <Text style={styles.appName}>{item.name}</Text>
                <View style={styles.openPill}>
                  <Text style={styles.openPillText}>Open</Text>
                </View>
              </View>
              <Text style={styles.appCategory}>{item.category} • {item.usersCount} users</Text>
              <Text style={styles.appDesc} numberOfLines={2}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
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
  banner: {
    backgroundColor: '#4F46E5',
    margin: 16,
    borderRadius: 16,
    padding: 18
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999
  },
  bannerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8
  },
  bannerSubtitle: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16
  },
  appCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center'
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  appInfo: {
    flex: 1
  },
  appNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  appName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  openPill: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999
  },
  openPillText: {
    color: Colors.light.primary,
    fontSize: 11,
    fontWeight: '800'
  },
  appCategory: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  appDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4
  }
});
