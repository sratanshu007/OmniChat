import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Alert,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  CreditCard,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  ShieldCheck,
  History,
  Send,
  Download,
  Share2,
  CheckCircle2,
  X
} from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp, WalletTransaction } from '../../src/context/AppContext';
import { Button } from '../../src/components/Button';
import { QrCameraScanner } from '../../src/components/QrCameraScanner';

export default function WalletScreen() {
  const router = useRouter();
  const { user, walletBalanceFormatted, walletTransactions, topUpWallet, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('500');

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferRecipient, setTransferRecipient] = useState('priya@okhdfcbank');
  const [transferAmount, setTransferAmount] = useState('250');
  const [transferNote, setTransferNote] = useState('Dinner split 🍛');

  const [showScanner, setShowScanner] = useState(false);
  const [showReceiveQrModal, setShowReceiveQrModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<WalletTransaction | null>(null);

  const handleTopUp = () => {
    const val = parseFloat(topUpAmount);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid top-up amount.');
      return;
    }
    topUpWallet(val);
    setShowTopUpModal(false);
  };

  const handleExecuteTransfer = () => {
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid transfer amount.');
      return;
    }
    topUpWallet(-val);
    setShowTransferModal(false);
    Alert.alert(
      'UPI Payment Successful! ✅',
      `₹${val.toFixed(2)} sent to ${transferRecipient}.\nRef ID: UPI/CHATINDIA/${Date.now()}`
    );
  };

  const handleShareReceipt = async (tx: WalletTransaction) => {
    try {
      await Share.share({
        message: `ChatIndia UPI Payment Receipt\nTitle: ${tx.title}\nAmount: ${tx.amountFormatted}\nDate: ${tx.date}\nStatus: ${tx.status || 'SUCCESS'}\nRef ID: ${tx.refId || 'UPI/CHATINDIA/98214'}`
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header matching Screen 17 */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          My Wallet
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Emerald Hero Balance Card matching Screen 17 */}
        <View style={[styles.heroCard, { backgroundColor: '#047857' }]}>
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>My Wallet</Text>
            <TouchableOpacity
              style={styles.topUpPill}
              onPress={() => setShowTopUpModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.topUpPillText}>Top-Up</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceBig}>₹ 2,480.00</Text>
        </View>

        {/* 4 Circular Quick Action Buttons matching Screen 17: Scan & Pay, Send, UPI, Bills */}
        <View style={[styles.quickActionsContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => setShowScanner(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCircle, { backgroundColor: '#E8F8F0' }]}>
              <QrCode size={22} color="#07C160" />
            </View>
            <Text style={[styles.actionCircleLabel, { color: theme.textPrimary }]}>
              Scan & Pay
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => setShowTransferModal(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCircle, { backgroundColor: '#EFF6FF' }]}>
              <Send size={20} color="#2563EB" />
            </View>
            <Text style={[styles.actionCircleLabel, { color: theme.textPrimary }]}>
              Send
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => setShowReceiveQrModal(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCircle, { backgroundColor: '#F0FDF4' }]}>
              <CreditCard size={21} color="#059669" />
            </View>
            <Text style={[styles.actionCircleLabel, { color: theme.textPrimary }]}>
              UPI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.circleActionItem}
            onPress={() => router.push('/mini-app/bill-pay')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionCircle, { backgroundColor: '#FFFBEB' }]}>
              <History size={20} color="#D97706" />
            </View>
            <Text style={[styles.actionCircleLabel, { color: theme.textPrimary }]}>
              Bills
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bank Accounts Section */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
            LINKED BANK ACCOUNTS & UPI ID
          </Text>

          <View style={[styles.cardItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.cardIconBox, { backgroundColor: '#1E3A8A' }]}>
              <CreditCard size={18} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                HDFC Bank Savings Account
              </Text>
              <Text style={[styles.cardDigits, { color: theme.textMuted }]}>
                Account ending in **** 8821 • Primary UPI
              </Text>
            </View>
            <Text style={[styles.primaryTag, { color: theme.primary, backgroundColor: theme.primaryLight }]}>
              Primary
            </Text>
          </View>

          <View style={[styles.cardItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.cardIconBox, { backgroundColor: '#0070BA' }]}>
              <QrCode size={18} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={[styles.bankName, { color: theme.textPrimary }]}>
                ChatIndia UPI ID
              </Text>
              <Text style={[styles.cardDigits, { color: theme.textMuted }]}>
                {user.upiId}
              </Text>
            </View>
            <Text style={[styles.primaryTag, { color: '#2563EB', backgroundColor: '#EFF6FF' }]}>
              Active
            </Text>
          </View>
        </View>

        {/* Transactions History List */}
        <View style={[styles.sectionCard, { backgroundColor: theme.surface, borderColor: theme.border, marginBottom: 40 }]}>
          <View style={styles.txHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <History size={16} color={theme.textMuted} />
              <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                TRANSACTION HISTORY
              </Text>
            </View>
          </View>

          {walletTransactions.map(tx => (
            <TouchableOpacity
              key={tx.id}
              style={[styles.txItem, { borderBottomColor: theme.border }]}
              onPress={() => setSelectedTx(tx)}
              activeOpacity={0.7}
            >
              <View style={styles.txInfo}>
                <Text style={[styles.txTitle, { color: theme.textPrimary }]}>{tx.title}</Text>
                <Text style={[styles.txDate, { color: theme.textMuted }]}>{tx.date}</Text>
              </View>
              <Text
                style={[
                  styles.txAmount,
                  { color: tx.isPositive ? '#10B981' : theme.textPrimary }
                ]}
              >
                {tx.amountFormatted}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={showTopUpModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Add Money to Wallet
            </Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>
              Source: HDFC Bank Account (**** 8821)
            </Text>

            <View style={[styles.topUpInputRow, { borderBottomColor: theme.primary }]}>
              <Text style={[styles.currencyPrefix, { color: theme.textPrimary }]}>₹</Text>
              <TextInput
                style={[styles.topUpInput, { color: theme.textPrimary }]}
                keyboardType="decimal-pad"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
              />
            </View>

            <View style={styles.presetAmounts}>
              {['100', '200', '500', '1000', '2000'].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetPill,
                    { borderColor: theme.border },
                    topUpAmount === val && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setTopUpAmount(val)}
                >
                  <Text
                    style={[
                      styles.presetPillText,
                      { color: topUpAmount === val ? '#FFFFFF' : theme.textPrimary }
                    ]}
                  >
                    +₹{val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="md"
                onPress={() => setShowTopUpModal(false)}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
              <Button
                title="Confirm & Pay UPI"
                variant="primary"
                size="md"
                onPress={handleTopUp}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Direct UPI Transfer Modal */}
      <Modal visible={showTransferModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>
              Send Money via UPI
            </Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>
              Instant 24x7 Settlement via NPCI UPI
            </Text>

            <View style={{ marginVertical: 14 }}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                Recipient UPI ID / Mobile
              </Text>
              <TextInput
                style={[
                  styles.formField,
                  { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }
                ]}
                value={transferRecipient}
                onChangeText={setTransferRecipient}
                placeholder="name@okhdfcbank"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>
                Amount (₹)
              </Text>
              <TextInput
                style={[
                  styles.formField,
                  { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }
                ]}
                value={transferAmount}
                onChangeText={setTransferAmount}
                keyboardType="decimal-pad"
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>
                Add Note (Optional)
              </Text>
              <TextInput
                style={[
                  styles.formField,
                  { backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }
                ]}
                value={transferNote}
                onChangeText={setTransferNote}
                placeholder="e.g. Chai, split bill, gift"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                title="Cancel"
                variant="outline"
                size="md"
                onPress={() => setShowTransferModal(false)}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
              <Button
                title="Pay Now"
                variant="primary"
                size="md"
                onPress={handleExecuteTransfer}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Receive QR Modal */}
      <Modal visible={showReceiveQrModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.receiveQrCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.receiveTitle, { color: theme.textPrimary }]}>
              Scan to Pay Aarav Sharma
            </Text>
            <Text style={[styles.receiveUpiId, { color: theme.primary }]}>
              UPI ID: {user.upiId}
            </Text>

            <View style={styles.qrImageFrame}>
              <Image
                source={{
                  uri: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                    `upi://pay?pa=${user.upiId}&pn=${encodeURIComponent(user.displayName)}`
                  )}`
                }}
                style={styles.qrImage}
              />
            </View>

            <Text style={[styles.receiveHint, { color: theme.textMuted }]}>
              Accepts GPay, PhonePe, Paytm, BHIM and all banking UPI apps
            </Text>

            <Button
              title="Close"
              variant="outline"
              size="md"
              onPress={() => setShowReceiveQrModal(false)}
              style={{ width: '100%', marginTop: 16 }}
              isDark={isDarkMode}
            />
          </View>
        </View>
      </Modal>

      {/* Transaction Receipt Details Modal */}
      <Modal visible={!!selectedTx} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.receiptCard, { backgroundColor: theme.surface }]}>
            <View style={styles.receiptTop}>
              <CheckCircle2 size={44} color="#10B981" />
              <Text style={[styles.receiptAmount, { color: theme.textPrimary }]}>
                {selectedTx?.amountFormatted}
              </Text>
              <Text style={[styles.receiptStatus, { color: '#10B981' }]}>
                Payment Successful • Verified
              </Text>
            </View>

            <View style={[styles.receiptDetails, { borderTopColor: theme.border, borderBottomColor: theme.border }]}>
              <View style={styles.receiptRow}>
                <Text style={[styles.receiptKey, { color: theme.textMuted }]}>Description</Text>
                <Text style={[styles.receiptVal, { color: theme.textPrimary }]}>
                  {selectedTx?.title}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptKey, { color: theme.textMuted }]}>Date & Time</Text>
                <Text style={[styles.receiptVal, { color: theme.textPrimary }]}>
                  {selectedTx?.date}
                </Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={[styles.receiptKey, { color: theme.textMuted }]}>UPI Ref ID</Text>
                <Text style={[styles.receiptVal, { color: theme.textPrimary }]}>
                  {selectedTx?.refId || 'UPI/CHATINDIA/98214'}
                </Text>
              </View>
            </View>

            <View style={styles.receiptActions}>
              <Button
                title="Share Receipt"
                variant="primary"
                size="md"
                icon={<Share2 size={16} color="#FFFFFF" />}
                onPress={() => selectedTx && handleShareReceipt(selectedTx)}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
              <Button
                title="Done"
                variant="outline"
                size="md"
                onPress={() => setSelectedTx(null)}
                style={{ flex: 1 }}
                isDark={isDarkMode}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* QR Scanner */}
      <Modal visible={showScanner} animationType="slide">
        <QrCameraScanner
          onClose={() => setShowScanner(false)}
          onFriendAdded={() => setShowScanner(false)}
        />
      </Modal>
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
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '700'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  content: {
    padding: 16
  },
  heroCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  heroLabel: {
    color: '#D1FAE5',
    fontSize: 16,
    fontWeight: '800'
  },
  topUpPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)'
  },
  topUpPillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  balanceBig: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  circleActionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 70
  },
  actionCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionCircleLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 12
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5
  },
  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  cardInfo: {
    flex: 1
  },
  bankName: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  cardDigits: {
    fontSize: 12,
    marginTop: 2
  },
  primaryTag: {
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  txInfo: {
    flex: 1,
    marginRight: 12
  },
  txTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 3
  },
  txDate: {
    fontSize: 11.5
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 22
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center'
  },
  modalSub: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16
  },
  topUpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    paddingBottom: 8,
    marginVertical: 12
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '800',
    marginRight: 6
  },
  topUpInput: {
    fontSize: 36,
    fontWeight: '800',
    minWidth: 120,
    textAlign: 'center'
  },
  presetAmounts: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginVertical: 14
  },
  presetPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1
  },
  presetPillText: {
    fontSize: 12.5,
    fontWeight: '700'
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4
  },
  formField: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14
  },
  receiveQrCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center'
  },
  receiveTitle: {
    fontSize: 17,
    fontWeight: '800'
  },
  receiveUpiId: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 16
  },
  qrImageFrame: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  qrImage: {
    width: 200,
    height: 200
  },
  receiveHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14
  },
  receiptCard: {
    width: '100%',
    maxWidth: 330,
    borderRadius: 20,
    padding: 22,
    alignItems: 'center'
  },
  receiptTop: {
    alignItems: 'center',
    marginBottom: 16
  },
  receiptAmount: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 8
  },
  receiptStatus: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2
  },
  receiptDetails: {
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    gap: 8
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  receiptKey: {
    fontSize: 12
  },
  receiptVal: {
    fontSize: 12.5,
    fontWeight: '700',
    maxWidth: 180,
    textAlign: 'right'
  },
  receiptActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 16
  }
});
