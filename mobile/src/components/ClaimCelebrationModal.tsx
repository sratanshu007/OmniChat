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
  const amountCents = message.metadata?.amountCents || 8888;
  const amountYuan = (amountCents / 100).toFixed(2);

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
            <Text style={styles.senderName}>{message.senderName}'s Red Packet</Text>
            <Text style={styles.greeting}>{message.metadata?.greeting || 'Gong Xi Fa Cai 🧧'}</Text>
          </View>

          {/* Envelope Opening Circle */}
          {!isAlreadyClaimed && !opened ? (
            <View style={styles.openCircleContainer}>
              <TouchableOpacity style={styles.openBtn} onPress={handleOpen}>
                <Text style={styles.openBtnText}>開</Text>
              </TouchableOpacity>
              <Text style={styles.openHint}>Tap to open red packet</Text>
            </View>
          ) : (
            <View style={styles.claimedContainer}>
              <Text style={styles.claimedAmount}>¥{amountYuan}</Text>
              <Text style={styles.claimedStatus}>Added directly to your WeChat Pay Wallet! ✅</Text>
              <Text style={styles.walletCurrent}>Current Wallet: ¥{walletBalanceFormatted}</Text>
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
    backgroundColor: '#FA4E42',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FBE8B3'
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
    color: '#FBE8B3',
    textAlign: 'center'
  },
  openCircleContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  openBtn: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FBE8B3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  openBtnText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#A82820'
  },
  openHint: {
    color: '#FCE7C8',
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
    color: '#FBE8B3'
  },
  claimedStatus: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center'
  },
  walletCurrent: {
    color: '#FCE7C8',
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
