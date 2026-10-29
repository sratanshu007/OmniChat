import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  Gamepad2,
  Car,
  Utensils,
  CloudSun,
  Search,
  Train,
  Zap,
  ShieldCheck,
  ChevronRight,
  CreditCard,
  ShoppingBag,
  Plane,
  Smartphone,
  GraduationCap,
  HeartPulse,
  Film,
  Building2,
  ExternalLink
} from 'lucide-react-native';
import { Colors } from '../../../src/theme/tokens';
import { useApp } from '../../../src/context/AppContext';
import { Header } from '../../../src/components/Header';

const CATEGORIES = ['All', 'Finance', 'Shopping', 'Travel', 'Food'];

const GRID_SERVICES = [
  { id: 's1', name: 'UPI & Payments', icon: CreditCard, color: '#07C160', bg: '#E8F8F0', route: '/wallet' },
  { id: 's2', name: 'Shopping', icon: ShoppingBag, color: '#2563EB', bg: '#EFF6FF', action: 'shop' },
  { id: 's3', name: 'Travel', icon: Plane, color: '#0D9488', bg: '#CCFBF1', route: '/mini-app/omni-ride' },
  { id: 's4', name: 'Food', icon: Utensils, color: '#EA580C', bg: '#FFEDD5', route: '/mini-app/omni-eats' },
  { id: 's5', name: 'Bills', icon: Zap, color: '#0284C7', bg: '#E0F2FE', route: '/mini-app/bill-pay' },
  { id: 's6', name: 'Recharge', icon: Smartphone, color: '#D97706', bg: '#FEF3C7', route: '/mini-app/bill-pay' },
  { id: 's7', name: 'Education', icon: GraduationCap, color: '#4F46E5', bg: '#EEF2FF', action: 'edu' },
  { id: 's8', name: 'Health', icon: HeartPulse, color: '#16A34A', bg: '#DCFCE7', action: 'health' }
];

const FEATURED_SERVICES = [
  {
    id: 'feat_amazon',
    name: 'Amazon',
    category: 'Mega Store & Electronics',
    tagline: 'Great Indian Festival Deals & 1-day delivery',
    logo: 'https://images.unsplash.com/photo-1523474255658-40e4509cc013?w=120'
  },
  {
    id: 'feat_flipkart',
    name: 'Flipkart',
    category: 'Fashion & Groceries',
    tagline: 'Big Billion Days discounts with instant UPI pay',
    logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120'
  },
  {
    id: 'feat_bms',
    name: 'BookMyShow',
    category: 'Movies & Live Events',
    tagline: 'Book latest Bollywood & Hollywood movie seats',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120'
  }
];

const miniAppsList = [
  {
    id: 'app_1',
    appKey: 'jump-2048',
    name: 'Jump 2048 Challenge',
    category: 'Gaming',
    usersCount: '1.2M users',
    description: 'Addictive number merging puzzle. Instant launch without downloading an app.',
    rating: '4.8 ★'
  },
  {
    id: 'app_2',
    appKey: 'omni-ride',
    name: 'ChatIndia Auto & Cabs',
    category: 'Travel & Mobility',
    usersCount: '850K rides',
    description: 'Instant auto and cab booking across Bengaluru, Mumbai & Delhi with UPI pay.',
    rating: '4.9 ★'
  },
  {
    id: 'app_3',
    appKey: 'omni-eats',
    name: 'Desi Gourmet Eats',
    category: 'Food Delivery',
    usersCount: '2.4M orders',
    description: 'Order authentic Dum Biryani, artisanal filter coffee, and Indian snacks with 1-tap UPI.',
    rating: '4.9 ★'
  },
  {
    id: 'app_4',
    appKey: 'weather',
    name: 'India Weather & AQI Radar',
    category: 'Utilities',
    usersCount: '620K daily',
    description: 'Real-time temperature, air quality index (AQI), and monsoon radar alerts.',
    rating: '4.7 ★'
  },
  {
    id: 'app_5',
    appKey: 'irctc-pnr',
    name: 'IRCTC Train & PNR Tracker',
    category: 'Citizen & Gov',
    usersCount: '3.1M checks',
    description: 'Live Indian Railways train running status, platform locator, and PNR confirmation chance.',
    rating: '4.9 ★'
  },
  {
    id: 'app_6',
    appKey: 'bill-pay',
    name: 'BBPS Bills & FASTag Recharge',
    category: 'Finance',
    usersCount: '1.8M bills',
    description: 'Bharat BillPay electricity, water, gas, FASTag recharge, and mobile prepaid plans.',
    rating: '4.9 ★'
  }
];

export default function ServicesScreen() {
  const router = useRouter();
  const { t, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const handleServiceClick = (service: typeof GRID_SERVICES[0]) => {
    if (service.route) {
      router.push(service.route as any);
    } else {
      Alert.alert(
        service.name,
        `Opening ${service.name} inside ChatIndia Mini Program Sandbox with 1-click UPI authorization.`
      );
    }
  };

  const handleFeaturedClick = (feat: typeof FEATURED_SERVICES[0]) => {
    Alert.alert(
      feat.name,
      `Connecting to official ${feat.name} Verified Partner Mini Program.\n\nEnjoy seamless checkout with ChatIndia UPI!`
    );
  };

  const filteredApps = miniAppsList.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCat === 'All') return true;
    if (selectedCat === 'Finance') return item.category.includes('Finance') || item.category.includes('Gaming');
    if (selectedCat === 'Travel') return item.category.includes('Travel');
    if (selectedCat === 'Food') return item.category.includes('Food');
    return true;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <Header title="Services" isDark={isDarkMode} />

      {/* Search Input matching Screen 16 */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
          <Search size={16} color={theme.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: theme.textPrimary }]}
            placeholder="Search services, mini apps & billers..."
            placeholderTextColor={theme.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Category Pills matching Screen 16 */}
      <View style={[styles.categoryRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCat === cat && { backgroundColor: '#07C160', borderColor: '#07C160' }
              ]}
              onPress={() => setSelectedCat(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCat === cat ? '#FFFFFF' : theme.textSecondary }
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* 8 Services Icons Grid matching Screen 16 */}
        <View style={[styles.gridCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.gridContainer}>
            {GRID_SERVICES.map(srv => {
              const IconComp = srv.icon;
              return (
                <TouchableOpacity
                  key={srv.id}
                  style={styles.gridItem}
                  activeOpacity={0.75}
                  onPress={() => handleServiceClick(srv)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: srv.bg }]}>
                    <IconComp size={22} color={srv.color} />
                  </View>
                  <Text style={[styles.gridLabel, { color: theme.textPrimary }]} numberOfLines={1}>
                    {srv.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Featured Services matching Screen 16: Amazon, Flipkart, BookMyShow */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Featured Services</Text>
        </View>

        <View style={[styles.featuredCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {FEATURED_SERVICES.map((feat, idx) => (
            <TouchableOpacity
              key={feat.id}
              style={[
                styles.featuredItem,
                idx < FEATURED_SERVICES.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
              ]}
              activeOpacity={0.75}
              onPress={() => handleFeaturedClick(feat)}
            >
              <Image source={{ uri: feat.logo }} style={styles.featuredLogo} />
              <View style={styles.featuredInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.featuredName, { color: theme.textPrimary }]}>{feat.name}</Text>
                  <ShieldCheck size={14} color="#07C160" />
                </View>
                <Text style={[styles.featuredCategory, { color: '#07C160' }]}>{feat.category}</Text>
                <Text style={[styles.featuredTagline, { color: theme.textMuted }]}>{feat.tagline}</Text>
              </View>
              <ExternalLink size={16} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Mini Programs Directory */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="#07C160" />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              ChatIndia Mini Programs ({filteredApps.length})
            </Text>
          </View>
        </View>

        <View style={[styles.miniAppsCard, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 40 }]}>
          {filteredApps.map((app, idx) => (
            <TouchableOpacity
              key={app.id}
              style={[
                styles.appRow,
                idx < filteredApps.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
              ]}
              activeOpacity={0.7}
              onPress={() => router.push(`/mini-app/${app.appKey}`)}
            >
              <View style={[styles.appIconBox, { backgroundColor: '#F3F4F6' }]}>
                {app.appKey === 'jump-2048' && <Gamepad2 size={22} color="#F59E0B" />}
                {app.appKey === 'omni-ride' && <Car size={22} color="#F97316" />}
                {app.appKey === 'omni-eats' && <Utensils size={22} color="#10B981" />}
                {app.appKey === 'weather' && <CloudSun size={22} color="#3B82F6" />}
                {app.appKey === 'irctc-pnr' && <Train size={22} color="#2563EB" />}
                {app.appKey === 'bill-pay' && <Zap size={22} color="#7C3AED" />}
              </View>

              <View style={styles.appDetails}>
                <View style={styles.appNameRow}>
                  <Text style={[styles.appName, { color: theme.textPrimary }]}>{app.name}</Text>
                  <Text style={styles.appRating}>{app.rating}</Text>
                </View>
                <Text style={[styles.appDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                  {app.description}
                </Text>
                <View style={styles.appMetaRow}>
                  <Text style={[styles.appCategoryBadge, { color: '#07C160', backgroundColor: '#E8F8F0' }]}>
                    {app.category}
                  </Text>
                  <Text style={[styles.appUsers, { color: theme.textMuted }]}>{app.usersCount}</Text>
                </View>
              </View>

              <ChevronRight size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0
  },
  categoryRow: {
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700'
  },
  content: {
    flex: 1,
    padding: 16
  },
  gridCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  gridItem: {
    width: '24%',
    alignItems: 'center',
    marginBottom: 16
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800'
  },
  featuredCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 22,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  featuredItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  featuredLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    marginRight: 12
  },
  featuredInfo: {
    flex: 1
  },
  featuredName: {
    fontSize: 15,
    fontWeight: '800'
  },
  featuredCategory: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1
  },
  featuredTagline: {
    fontSize: 11.5,
    marginTop: 2
  },
  miniAppsCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden'
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  appIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  appDetails: {
    flex: 1,
    marginRight: 8
  },
  appNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  appName: {
    fontSize: 15,
    fontWeight: '700'
  },
  appRating: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '800'
  },
  appDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3
  },
  appMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6
  },
  appCategoryBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  appUsers: {
    fontSize: 11
  }
});
