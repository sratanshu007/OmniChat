import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';

interface Props {
  visible: boolean;
  convId: string;
  onClose: () => void;
}

export const RedPacketModal: React.FC<Props> = ({ visible, convId, onClose }) => {
  const { sendRedPacket, walletBalanceFormatted } = useApp();
  const [amount, setAmount] = useState('8.88');
  const [greeting, setGreeting] = useState('Best Wishes & Good Luck! 🧧');

  const handleSend = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    sendRedPacket(convId, val, greeting);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Send Lucky Red Packet (发红包)</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Amount input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Amount (金额)</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencySymbol}>¥</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
              />
            </View>
          </View>

          {/* Greeting message */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Greeting (祝福语)</Text>
            <TextInput
              style={styles.textInput}
              value={greeting}
              onChangeText={setGreeting}
              placeholder="Gong Xi Fa Cai 🧧"
            />
          </View>

          {/* Quick Preset Buttons */}
          <View style={styles.presetRow}>
            {['6.66', '8.88', '52.00', '88.88'].map(preset => (
              <TouchableOpacity
                key={preset}
                style={[styles.presetBtn, amount === preset && styles.presetBtnActive]}
                onPress={() => setAmount(preset)}
              >
                <Text style={[styles.presetText, amount === preset && styles.presetTextActive]}>
                  ¥{preset}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.walletHint}>Wallet Balance: ¥{walletBalanceFormatted}</Text>

          {/* Submit Button */}
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Put Money in Red Packet (塞钱进红包)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#FA4E42',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FBE8B3'
  },
  closeTxt: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginRight: 6
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827'
  },
  textInput: {
    fontSize: 15,
    color: '#111827',
    paddingVertical: 4
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8
  },
  presetBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  presetBtnActive: {
    backgroundColor: '#FBE8B3'
  },
  presetText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  },
  presetTextActive: {
    color: '#FA4E42'
  },
  walletHint: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10
  },
  sendBtn: {
    backgroundColor: '#FBE8B3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6
  },
  sendBtnText: {
    color: '#A82820',
    fontSize: 16,
    fontWeight: '800'
  }
});
