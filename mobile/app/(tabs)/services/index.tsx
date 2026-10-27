import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Gamepad2, Car, Utensils, CloudSun } from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';

const miniAppsList = [
  {
    id: 'app_1',
    appKey: 'jump-2048',
    name: 'Jump 2048 Challenge',
    category: 'Gaming',
    usersCount: '1.2M users',
    description: 'Addictive number merging puzzle. Instant launch without downloading an app.'
  },
  {
    id: 'app_2',
    appKey: 'omni-ride',
    name: 'Omni Ride Cabs',
    category: 'Travel & Mobility',
    usersCount: '850K rides',
    description: 'Instant auto and cab booking across Bengaluru, Mumbai & Delhi with UPI pay.'
  },
  {
    id: 'app_3',
    appKey: 'omni-eats',
    name: 'Omni Eats Gourmet',
    category: 'Food Delivery',
    usersCount: '2.4M orders',
    description: 'Order Biryani, artisanal filter coffee, and Indian snacks with 1-tap checkout.'
  },
  {
    id: 'app_4',
    appKey: 'weather',
    name: 'Live Weather & AQI',
    category: 'Utilities',
    usersCount: '500K daily',
    description: 'Real-time temperature, air quality index (AQI), and monsoon radar alerts.'
  }
];

export default function ServicesScreen() {
  const router = useRouter();

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
        <Text style={styles.headerTitle}>Services & Mini Programs</Text>
      </View>

      <FlatList
        data={miniAppsList}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <View style={styles.banner}>
            <View style={styles.bannerBadge}>
              <Sparkles size={14} color="#FFFFFF" />
              <Text style={styles.bannerBadgeText}>INSTANT MINI ECOSYSTEM</Text>
            </View>
            <Text style={styles.bannerTitle}>Instant Services, Zero Installs</Text>
            <Text style={styles.bannerSubtitle}>
              Play casual games, book city cabs, order delicious food, and pay seamlessly using UPI.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.appCard}
            activeOpacity={0.7}
            onPress={() => router.push(`/mini-app/${item.appKey}`)}
          >
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
              <Text style={styles.appCategory}>{item.category} • {item.usersCount}</Text>
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
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  banner: {
    backgroundColor: '#07C160',
    margin: 16,
    borderRadius: 16,
    padding: 18
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
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
    color: '#E6F9F0',
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
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999
  },
  openPillText: {
    color: '#07C160',
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
