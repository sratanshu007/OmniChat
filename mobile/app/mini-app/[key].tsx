import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MoreHorizontal,
  Gamepad2,
  Car,
  Utensils,
  CloudSun,
  CheckCircle2
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';

export default function MiniAppScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();
  const { sendTransfer, walletBalanceFormatted } = useApp();

  const appKey = key || 'jump-2048';

  // State for Jump Game
  const [gameScore, setGameScore] = useState(256);
  const [highScore, setHighScore] = useState(1024);

  // State for Ride
  const [pickup, setPickup] = useState('Shenzhen Tech Bay Building B');
  const [dropoff, setDropoff] = useState('Baoan International Airport Terminal 3');
  const [rideBooked, setRideBooked] = useState(false);

  // State for Food
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrderFood = () => {
    Alert.alert(
      'WeChat Pay Confirmation',
      'Pay ¥38.00 for Signature Dim Sum Platter?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            setOrderPlaced(true);
          }
        }
      ]
    );
  };

  const handleBookRide = () => {
    Alert.alert(
      'OmniRide Booking',
      'Confirm Comfort Electric Ride (¥42.50)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay',
          onPress: () => {
            setRideBooked(true);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Mini App Capsule Top Header */}
      <View style={styles.capsuleHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#111827" />
          <Text style={styles.backText}>Exit</Text>
        </TouchableOpacity>

        <Text style={styles.miniAppTitle}>
          {appKey === 'jump-2048'
            ? 'Jump 2048 Mini'
            : appKey === 'omni-ride'
            ? 'Omni Ride Hailing'
            : appKey === 'omni-eats'
            ? 'Omni Eats Gourmet'
            : 'City Weather Forecast'}
        </Text>

        {/* WeChat Mini Program standard capsule menu */}
        <View style={styles.capsulePill}>
          <TouchableOpacity style={styles.capsuleBtn}>
            <MoreHorizontal size={16} color="#111827" />
          </TouchableOpacity>
          <View style={styles.capsuleDivider} />
          <TouchableOpacity style={styles.capsuleBtn} onPress={() => router.back()}>
            <View style={styles.capsuleCloseDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* GAME: 2048 */}
        {appKey === 'jump-2048' && (
          <View style={styles.gameContainer}>
            <View style={styles.gameScoreBoard}>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={styles.scoreVal}>{gameScore}</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={styles.scoreLabel}>BEST</Text>
                <Text style={styles.scoreVal}>{highScore}</Text>
              </View>
            </View>

            <View style={styles.gameGrid}>
              {[64, 128, 256, 512, 16, 32, 64, 128, 4, 8, 16, 32, 2, 4, 8, 16].map((num, idx) => (
                <View key={idx} style={[styles.gameTile, { backgroundColor: getTileColor(num) }]}>
                  <Text style={styles.tileNumber}>{num}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                setGameScore(s => s + 64);
                if (gameScore + 64 > highScore) setHighScore(gameScore + 64);
              }}
            >
              <Gamepad2 size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Slide & Merge Tiles! (+64)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RIDE: Omni Ride */}
        {appKey === 'omni-ride' && (
          <View style={styles.serviceContainer}>
            <View style={styles.rideCard}>
              <Text style={styles.cardSectionTitle}>PICKUP & DROPOFF</Text>
              <View style={styles.locationRow}>
                <View style={[styles.dot, { backgroundColor: '#07C160' }]} />
                <Text style={styles.locationText}>{pickup}</Text>
              </View>
              <View style={styles.locationRow}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.locationText}>{dropoff}</Text>
              </View>
            </View>

            {rideBooked ? (
              <View style={styles.successCard}>
                <CheckCircle2 size={40} color="#07C160" />
                <Text style={styles.successTitle}>Driver is On The Way!</Text>
                <Text style={styles.successSub}>
                  Toyota Camry (粤B•886A2) • Arriving in 3 mins
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={handleBookRide}>
                <Car size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Request Ride (¥42.50 with WeChat Pay)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* FOOD: Omni Eats */}
        {appKey === 'omni-eats' && (
          <View style={styles.serviceContainer}>
            <Text style={styles.cardSectionTitle}>TODAY'S SPECIAL DISHES</Text>

            <View style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>Signature Dim Sum Platter 🥟</Text>
                <Text style={styles.foodDesc}>Handcrafted shrimp dumplings and pork buns</Text>
                <Text style={styles.foodPrice}>¥38.00</Text>
              </View>
            </View>

            <View style={styles.foodItem}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodTitle}>Roast Duck Cantonese Style 🍗</Text>
                <Text style={styles.foodDesc}>Crispy skin, honey plum dipping glaze</Text>
                <Text style={styles.foodPrice}>¥58.00</Text>
              </View>
            </View>

            {orderPlaced ? (
              <View style={styles.successCard}>
                <CheckCircle2 size={40} color="#07C160" />
                <Text style={styles.successTitle}>Order Confirmed & Paid!</Text>
                <Text style={styles.successSub}>Kitchen is preparing your fresh meal.</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={handleOrderFood}>
                <Utensils size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Order Now (¥38.00 with WeChat Pay)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* WEATHER */}
        {appKey === 'weather' && (
          <View style={styles.serviceContainer}>
            <View style={styles.weatherCard}>
              <CloudSun size={54} color="#F59E0B" />
              <Text style={styles.weatherTemp}>26°C</Text>
              <Text style={styles.weatherCity}>Shenzhen, Guangdong</Text>
              <Text style={styles.weatherDesc}>Sunny and Comfortable • AQI: 28 (Excellent)</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getTileColor(num: number): string {
  switch (num) {
    case 2: return '#EEE4DA';
    case 4: return '#EDE0C8';
    case 8: return '#F2B179';
    case 16: return '#F59563';
    case 32: return '#F67C5F';
    case 64: return '#F65E3B';
    case 128: return '#EDCF72';
    case 256: return '#EDCC61';
    case 512: return '#EDC850';
    default: return '#EDC22E';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6'
  },
  capsuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600'
  },
  miniAppTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827'
  },
  capsulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  capsuleBtn: {
    paddingHorizontal: 6
  },
  capsuleDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 4
  },
  capsuleCloseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827'
  },
  content: {
    flex: 1,
    padding: 16
  },
  gameContainer: {
    alignItems: 'center'
  },
  gameScoreBoard: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20
  },
  scoreBox: {
    backgroundColor: '#BBADA0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center'
  },
  scoreLabel: {
    color: '#EEE4DA',
    fontSize: 10,
    fontWeight: '800'
  },
  scoreVal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900'
  },
  gameGrid: {
    width: 280,
    height: 280,
    backgroundColor: '#BBADA0',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameTile: {
    width: 58,
    height: 58,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#776E65'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#07C160',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    width: '100%'
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800'
  },
  serviceContainer: {
    gap: 14
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 10
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 6
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },
  successCard: {
    backgroundColor: '#DEF7EC',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#07C160'
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#07C160',
    marginTop: 10
  },
  successSub: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
    textAlign: 'center'
  },
  foodItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  foodInfo: {
    flex: 1
  },
  foodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827'
  },
  foodDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginVertical: 4
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#07C160'
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: '900',
    color: '#111827',
    marginVertical: 6
  },
  weatherCity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563'
  },
  weatherDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  }
});
