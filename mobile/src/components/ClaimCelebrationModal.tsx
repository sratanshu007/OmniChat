import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { ChatMessage, useApp } from '../context/AppContext';

interface Props {
  visible: boolean;
  message: ChatMessage | null;
  onClose: () => void;
}

export const ClaimCelebrationModal: React.FC<Props> = ({ visible, message, onClose }) => {
  const { claimRedPacket, walletBalanceFormatted } = useApp();
  const [opened, setOpened] = useState(false);

  if (!message || !visible) return null;

  const isAlreadyClaimed = message.metadata?.isClaimed;
  const amountRupees = message.metadata?.amountRupees || 501;
  const amountFormatted = amountRupees.toFixed(2);

  const handleOpen = () => {
    claimRedPacket(message.conversationId, message.id);
    setOpened(true);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.envelopeCard}>
          {/* Sender header */}
          <View style={styles.topInfo}>
            <Image source={{ uri: message.senderAvatar }} style={styles.senderAvatar} />
            <Text style={styles.senderName}>{message.senderName}'s Gift Envelope</Text>
            <Text style={styles.greeting}>{message.metadata?.greeting || 'Best Wishes & Good Luck! 🎁'}</Text>
          </View>

          {/* Envelope Opening Circle */}
          {!isAlreadyClaimed && !opened ? (
            <View style={styles.openCircleContainer}>
              <TouchableOpacity style={styles.openBtn} onPress={handleOpen}>
                <Text style={styles.openBtnText}>OPEN</Text>
              </TouchableOpacity>
              <Text style={styles.openHint}>Tap to open gift envelope</Text>
            </View>
          ) : (
            <View style={styles.claimedContainer}>
              <Text style={styles.claimedAmount}>₹{amountFormatted}</Text>
              <Text style={styles.claimedStatus}>Added directly to your OmniPay Wallet! ✅</Text>
              <Text style={styles.walletCurrent}>Current Wallet: ₹{walletBalanceFormatted}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  envelopeCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#07C160',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DEF7EC'
  },
  topInfo: {
    alignItems: 'center',
    marginBottom: 24
  },
  senderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10
  },
  senderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center'
  },
  openCircleContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  openBtn: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  openBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#07C160',
    letterSpacing: 1
  },
  openHint: {
    color: '#DEF7EC',
    fontSize: 13,
    marginTop: 12,
    fontWeight: '600'
  },
  claimedContainer: {
    alignItems: 'center',
    marginVertical: 18
  },
  claimedAmount: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  claimedStatus: {
    color: '#DEF7EC',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center'
  },
  walletCurrent: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 28,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700'
  }
});
