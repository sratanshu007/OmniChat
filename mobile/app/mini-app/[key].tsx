import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MoreHorizontal,
  Gamepad2,
  Car,
  Utensils,
  CloudSun,
  Train,
  Zap,
  CheckCircle2,
  Sparkles,
  RefreshCw
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

export default function MiniAppScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const router = useRouter();
  const { isDarkMode, topUpWallet } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const appKey = key || 'jump-2048';

  // 2048 State
  const [gameScore, setGameScore] = useState(256);
  const [highScore, setHighScore] = useState(1024);

  // Cab State
  const [pickup, setPickup] = useState('Indiranagar 100ft Road, Bengaluru');
  const [dropoff, setDropoff] = useState('Kempegowda International Airport (BLR)');
  const [rideBooked, setRideBooked] = useState(false);

  // Food State
  const [orderPlaced, setOrderPlaced] = useState(false);

  // IRCTC PNR State
  const [pnrNumber, setPnrNumber] = useState('4281948201');
  const [pnrResult, setPnrResult] = useState<any>(null);

  // Bill Pay State
  const [billType, setBillType] = useState('Electricity (BESCOM)');
  const [consumerId, setConsumerId] = useState('109482910');
  const [billPaid, setBillPaid] = useState(false);

  const handleOrderFood = () => {
    Alert.alert(
      'UPI Payment Confirmation',
      'Pay ₹340.00 for Hyderabadi Dum Biryani Special Meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay with UPI',
          onPress: () => {
            topUpWallet(-340);
            setOrderPlaced(true);
          }
        }
      ]
    );
  };

  const handleBookRide = () => {
    Alert.alert(
      'ChatIndia Auto Booking',
      'Confirm Sedan EV Cab to Airport (₹450.00)?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm & Pay via UPI',
          onPress: () => {
            topUpWallet(-450);
            setRideBooked(true);
          }
        }
      ]
    );
  };

  const handleCheckPnr = () => {
    if (pnrNumber.length < 8) {
      Alert.alert('Invalid PNR', 'Please enter a valid 10-digit Indian Railways PNR number.');
      return;
    }
    setPnrResult({
      train: '12658 - KSR Bengaluru Mail',
      class: '3A (AC 3 Tier)',
      status: 'CNF (B2, Berth 23 - Lower)',
      charting: 'Chart Prepared ✅',
      departure: '22:40 PM • Platform 1'
    });
  };

  const handlePayBill = () => {
    Alert.alert(
      'BBPS Bill Payment',
      'Pay BESCOM Electricity Bill ₹1,420.00 via UPI?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now via UPI',
          onPress: () => {
            topUpWallet(-1420);
            setBillPaid(true);
          }
        }
      ]
    );
  };

  const getAppName = () => {
    switch (appKey) {
      case 'jump-2048': return 'Jump 2048';
      case 'omni-ride': return 'ChatIndia Cabs';
      case 'omni-eats': return 'Desi Gourmet Eats';
      case 'irctc-pnr': return 'IRCTC PNR Status';
      case 'bill-pay': return 'BBPS BillPay';
      default: return 'Live Weather & AQI';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Mini App Capsule Header */}
      <View style={[styles.capsuleHeader, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color={theme.textPrimary} />
          <Text style={[styles.appName, { color: theme.textPrimary }]}>{getAppName()}</Text>
        </TouchableOpacity>

        {/* WeChat-style mini app pill controls */}
        <View style={[styles.capsulePill, { borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.capsuleBtn}
            onPress={() => Alert.alert(getAppName(), 'Instant ChatIndia Mini Program. Running securely without downloading.')}
          >
            <MoreHorizontal size={18} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.capsuleDivider, { backgroundColor: theme.border }]} />
          <TouchableOpacity style={styles.capsuleBtn} onPress={() => router.back()}>
            <View style={[styles.exitCircle, { borderColor: theme.textPrimary }]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* 1. JUMP 2048 GAME */}
        {appKey === 'jump-2048' && (
          <View style={styles.gameContainer}>
            <View style={styles.scoreRow}>
              <View style={[styles.scoreBox, { backgroundColor: theme.surface }]}>
                <Text style={styles.scoreLabel}>SCORE</Text>
                <Text style={[styles.scoreValue, { color: theme.textPrimary }]}>{gameScore}</Text>
              </View>
              <View style={[styles.scoreBox, { backgroundColor: theme.surface }]}>
                <Text style={styles.scoreLabel}>BEST</Text>
                <Text style={[styles.scoreValue, { color: theme.textPrimary }]}>{highScore}</Text>
              </View>
            </View>

            <View style={styles.board}>
              {[2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 0, 0, 0, 0, 0, 0].map((tile, i) => (
                <View
                  key={i}
                  style={[
                    styles.tile,
                    { backgroundColor: tile > 0 ? getTileColor(tile) : '#CDC1B4' }
                  ]}
                >
                  {tile > 0 && <Text style={styles.tileText}>{tile}</Text>}
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                setGameScore(s => s + 64);
                if (gameScore + 64 > highScore) setHighScore(gameScore + 64);
              }}
            >
              <Gamepad2 size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Slide Tiles (+64 Score)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2. CHATINDIA AUTO & CABS */}
        {appKey === 'omni-ride' && (
          <View style={[styles.serviceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Book City Auto or EV Cab</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>PICKUP</Text>
              <TextInput
                style={[styles.inputBox, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                value={pickup}
                onChangeText={setPickup}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>DROPOFF</Text>
              <TextInput
                style={[styles.inputBox, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                value={dropoff}
                onChangeText={setDropoff}
              />
            </View>

            {rideBooked ? (
              <View style={[styles.successBox, { backgroundColor: '#E8F8F0' }]}>
                <CheckCircle2 size={36} color="#047857" />
                <Text style={styles.successHeading}>EV Cab Dispatched!</Text>
                <Text style={styles.successSub}>Driver: Suresh Kumar • Tata Tigor EV (KA-01-MJ-8821) arriving in 3 mins</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={handleBookRide}
              >
                <Car size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Confirm EV Cab (₹450.00 via UPI)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 3. FOOD DELIVERY */}
        {appKey === 'omni-eats' && (
          <View style={[styles.serviceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Order Gourmet Indian Food</Text>

            <View style={styles.menuItem}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>Hyderabadi Dum Biryani Special 🍛</Text>
                <Text style={[styles.menuDesc, { color: theme.textMuted }]}>Slow cooked fragrant basmati rice with aromatic spices & raita</Text>
                <Text style={[styles.menuPrice, { color: theme.primary }]}>₹280.00</Text>
              </View>
            </View>

            <View style={styles.menuItem}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: theme.textPrimary }]}>Paneer Butter Masala with Naan 🫓</Text>
                <Text style={[styles.menuDesc, { color: theme.textMuted }]}>Rich butter gravy with 2 freshly baked tandoori naans</Text>
                <Text style={[styles.menuPrice, { color: theme.primary }]}>₹240.00</Text>
              </View>
            </View>

            {orderPlaced ? (
              <View style={[styles.successBox, { backgroundColor: '#E8F8F0' }]}>
                <CheckCircle2 size={36} color="#047857" />
                <Text style={styles.successHeading}>Order Placed via UPI!</Text>
                <Text style={styles.successSub}>Restaurant is packing your meal. Delivery in 25 mins.</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
                onPress={handleOrderFood}
              >
                <Utensils size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Order Now (₹340.00 via UPI)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 4. IRCTC PNR STATUS */}
        {appKey === 'irctc-pnr' && (
          <View style={[styles.serviceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Indian Railways Live PNR & Train Status</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>10-DIGIT PNR NUMBER</Text>
              <TextInput
                style={[styles.inputBox, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                value={pnrNumber}
                onChangeText={setPnrNumber}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#2563EB', marginBottom: 14 }]}
              onPress={handleCheckPnr}
            >
              <Train size={20} color="#FFFFFF" />
              <Text style={styles.actionBtnText}>Check Live PNR Status</Text>
            </TouchableOpacity>

            {pnrResult && (
              <View style={[styles.pnrCard, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.pnrTrain, { color: theme.textPrimary }]}>{pnrResult.train}</Text>
                <Text style={[styles.pnrStatus, { color: '#047857' }]}>{pnrResult.status}</Text>
                <Text style={[styles.pnrMeta, { color: theme.textSecondary }]}>
                  {pnrResult.class} • {pnrResult.charting}
                </Text>
                <Text style={[styles.pnrMeta, { color: theme.primary }]}>
                  {pnrResult.departure}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* 5. BBPS BILL PAY */}
        {appKey === 'bill-pay' && (
          <View style={[styles.serviceCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Bharat BillPay (BBPS) Utilities</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>SERVICE PROVIDER</Text>
              <TextInput
                style={[styles.inputBox, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                value={billType}
                onChangeText={setBillType}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>CONSUMER / ACCOUNT ID</Text>
              <TextInput
                style={[styles.inputBox, { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary }]}
                value={consumerId}
                onChangeText={setConsumerId}
              />
            </View>

            {billPaid ? (
              <View style={[styles.successBox, { backgroundColor: '#E8F8F0' }]}>
                <CheckCircle2 size={36} color="#047857" />
                <Text style={styles.successHeading}>Bill Paid Successfully!</Text>
                <Text style={styles.successSub}>BESCOM Receipt generated. Reference: BBPS/928472910</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#7C3AED' }]}
                onPress={handlePayBill}
              >
                <Zap size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Pay Electricity Bill (₹1,420.00 via UPI)</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 6. WEATHER */}
        {appKey === 'weather' && (
          <View style={[styles.weatherCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <CloudSun size={60} color="#F59E0B" />
            <Text style={[styles.weatherTemp, { color: theme.textPrimary }]}>24°C</Text>
            <Text style={[styles.weatherCity, { color: theme.textPrimary }]}>Bengaluru, Karnataka</Text>
            <Text style={[styles.weatherDesc, { color: theme.textSecondary }]}>
              Pleasant & Breezy • AQI: 38 (Satisfactory)
            </Text>
            <View style={styles.weatherGrid}>
              <View style={styles.wItem}>
                <Text style={styles.wLabel}>HUMIDITY</Text>
                <Text style={[styles.wVal, { color: theme.textPrimary }]}>54%</Text>
              </View>
              <View style={styles.wItem}>
                <Text style={styles.wLabel}>WIND</Text>
                <Text style={[styles.wVal, { color: theme.textPrimary }]}>14 km/h</Text>
              </View>
              <View style={styles.wItem}>
                <Text style={styles.wLabel}>UV INDEX</Text>
                <Text style={[styles.wVal, { color: theme.textPrimary }]}>Moderate</Text>
              </View>
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
    case 1024: return '#EDC22E';
    default: return '#CDC1B4';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  capsuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  appName: {
    fontSize: 16,
    fontWeight: '800'
  },
  capsulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  capsuleBtn: {
    padding: 4
  },
  capsuleDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 6
  },
  exitCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2
  },
  gameContainer: {
    alignItems: 'center'
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16
  },
  scoreBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 100
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF'
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: '900'
  },
  board: {
    width: 280,
    height: 280,
    backgroundColor: '#BBADA0',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 20
  },
  tile: {
    width: 60,
    height: 60,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tileText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#776E65'
  },
  serviceCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16
  },
  inputGroup: {
    marginBottom: 14
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4
  },
  inputBox: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 6
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700'
  },
  successBox: {
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    marginTop: 10
  },
  successHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
    marginTop: 8
  },
  successSub: {
    fontSize: 12,
    color: '#065F46',
    textAlign: 'center',
    marginTop: 4
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB'
  },
  menuTitle: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  menuDesc: {
    fontSize: 12,
    marginTop: 2
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4
  },
  pnrCard: {
    padding: 14,
    borderRadius: 12,
    gap: 4
  },
  pnrTrain: {
    fontSize: 15,
    fontWeight: '800'
  },
  pnrStatus: {
    fontSize: 13,
    fontWeight: '800'
  },
  pnrMeta: {
    fontSize: 12
  },
  weatherCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center'
  },
  weatherTemp: {
    fontSize: 48,
    fontWeight: '900',
    marginTop: 8
  },
  weatherCity: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4
  },
  weatherDesc: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 20
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB'
  },
  wItem: {
    alignItems: 'center'
  },
  wLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF'
  },
  wVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2
  }
});
