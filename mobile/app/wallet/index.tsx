import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  CreditCard,
  QrCode,
  ArrowDownLeft,
  PlusCircle,
  ShieldCheck,
  History
} from 'lucide-react-native';
import { useApp } from '../../src/context/AppContext';

export default function WalletScreen() {
  const router = useRouter();
  const { walletBalanceFormatted, walletTransactions, topUpWallet } = useApp();

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('200');

  const handleTopUp = () => {
    const val = parseFloat(topUpAmount);
    if (isNaN(val) || val <= 0) return;
    topUpWallet(val);
    setShowTopUpModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color="#FFFFFF" />
          <Text style={styles.backLabel}>Me</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WeChat Pay (微信支付)</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Emerald Hero Balance Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Text style={styles.heroLabel}>Wallet Balance (零钱)</Text>
            <View style={styles.verifiedBadge}>
              <ShieldCheck size={14} color="#D1FAE5" />
              <Text style={styles.verifiedText}>Real-Name Verified</Text>
            </View>
          </View>

          <Text style={styles.balanceBig}>¥{walletBalanceFormatted}</Text>

          <View style={styles.heroActionsRow}>
            {/* Money Code */}
            <TouchableOpacity style={styles.heroActionBtn}>
              <QrCode size={20} color="#07C160" />
              <Text style={styles.heroActionText}>Money Code</Text>
            </TouchableOpacity>

            {/* Top Up */}
            <TouchableOpacity
              style={styles.heroActionBtn}
              onPress={() => setShowTopUpModal(true)}
            >
              <PlusCircle size={20} color="#07C160" />
              <Text style={styles.heroActionText}>Top Up (充值)</Text>
            </TouchableOpacity>

            {/* Transfer */}
            <TouchableOpacity style={styles.heroActionBtn}>
              <ArrowDownLeft size={20} color="#07C160" />
              <Text style={styles.heroActionText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Cards Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>MY CARDS (银行卡)</Text>
          <View style={styles.cardItem}>
            <View style={[styles.cardIconBox, { backgroundColor: '#EF4444' }]}>
              <CreditCard size={18} color="#FFFFFF" />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.bankName}>Industrial and Commercial Bank of China</Text>
              <Text style={styles.cardDigits}>Debit Card (**** 8821)</Text>
            </View>
            <Text style={styles.primaryTag}>Primary</Text>
          </View>
        </View>

        {/* Transactions History List */}
        <View style={styles.sectionCard}>
          <View style={styles.txHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <History size={16} color="#6B7280" />
              <Text style={styles.sectionTitle}>RECENT TRANSACTIONS (账单明细)</Text>
            </View>
          </View>

          {walletTransactions.map(tx => (
            <View key={tx.id} style={styles.txItem}>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, tx.isPositive ? styles.txPositive : styles.txNegative]}>
                {tx.amountFormatted}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Top Up Modal */}
      <Modal visible={showTopUpModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Top Up Wallet (零钱充值)</Text>
            <Text style={styles.modalSub}>From: ICBC Debit Card (**** 8821)</Text>

            <View style={styles.topUpInputRow}>
              <Text style={styles.currencyPrefix}>¥</Text>
              <TextInput
                style={styles.topUpInput}
                keyboardType="decimal-pad"
                value={topUpAmount}
                onChangeText={setTopUpAmount}
              />
            </View>

            <View style={styles.presetAmounts}>
              {['100', '200', '500', '1000'].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.presetPill,
                    topUpAmount === val && styles.presetPillActive
                  ]}
                  onPress={() => setTopUpAmount(val)}
                >
                  <Text
                    style={[
                      styles.presetPillText,
                      topUpAmount === val && styles.presetPillTextActive
                    ]}
                  >
                    ¥{val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.confirmTopUpBtn} onPress={handleTopUp}>
              <Text style={styles.confirmTopUpText}>Confirm Top Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setShowTopUpModal(false)}
            >
              <Text style={styles.cancelModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#07C160'
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  backLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600'
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800'
  },
  content: {
    flex: 1
  },
  heroCard: {
    backgroundColor: '#07C160',
    margin: 16,
    borderRadius: 18,
    padding: 22,
    shadowColor: '#07C160',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heroLabel: {
    color: '#E6F9F0',
    fontSize: 14,
    fontWeight: '600'
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999
  },
  verifiedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  balanceBig: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
    marginVertical: 16
  },
  heroActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  heroActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 4
  },
  heroActionText: {
    color: '#111827',
    fontSize: 12.5,
    fontWeight: '700'
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    marginBottom: 12
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardInfo: {
    flex: 1
  },
  bankName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  cardDigits: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2
  },
  primaryTag: {
    backgroundColor: '#DEF7EC',
    color: '#07C160',
    fontSize: 11,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  txInfo: {
    flex: 1,
    marginRight: 12
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827'
  },
  txDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '800'
  },
  txPositive: {
    color: '#07C160'
  },
  txNegative: {
    color: '#111827'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827'
  },
  modalSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16
  },
  topUpInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#07C160',
    paddingBottom: 8,
    marginBottom: 16
  },
  currencyPrefix: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginRight: 8
  },
  topUpInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: '#111827'
  },
  presetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  presetPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  presetPillActive: {
    backgroundColor: '#DEF7EC'
  },
  presetPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563'
  },
  presetPillTextActive: {
    color: '#07C160'
  },
  confirmTopUpBtn: {
    backgroundColor: '#07C160',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  confirmTopUpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  cancelModalBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center'
  },
  cancelModalText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600'
  }
});
