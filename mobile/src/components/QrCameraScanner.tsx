import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { Camera, Flashlight, X, UserPlus, CheckCircle2 } from 'lucide-react-native';
import { Colors } from '../theme/tokens';
import { api } from '../services/api';

interface QrCameraScannerProps {
  onClose: () => void;
  onFriendAdded?: () => void;
}

export function QrCameraScanner({ onClose, onFriendAdded }: QrCameraScannerProps) {
  const [torchOn, setTorchOn] = useState(false);
  const [scannedUser, setScannedUser] = useState<any>(null);
  const [requestMessage, setRequestMessage] = useState("Hi! Added you via QR code.");
  const [isSending, setIsSending] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Simulated scan handler (compatible across simulators & physical cameras)
  const handleSimulatedScan = async (mockToken: string) => {
    try {
      const res = await api.resolveQrToken(mockToken);
      if (res.targetUser) {
        setScannedUser(res.targetUser);
      }
    } catch (e: any) {
      Alert.alert('Scan Failed', e.message || 'Invalid QR code token');
    }
  };

  const handleSendFriendRequest = async () => {
    if (!scannedUser) return;
    setIsSending(true);
    try {
      await api.sendFriendRequest(scannedUser.id, requestMessage);
      setRequestSent(true);
      if (onFriendAdded) onFriendAdded();
    } catch (e: any) {
      Alert.alert('Request Failed', e.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Scanner Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code (扫一扫)</Text>
        <TouchableOpacity
          style={styles.torchBtn}
          onPress={() => setTorchOn(!torchOn)}
        >
          <Flashlight size={20} color={torchOn ? '#F59E0B' : '#FFFFFF'} />
        </TouchableOpacity>
      </View>

      {/* Viewfinder Area */}
      <View style={styles.viewfinderContainer}>
        <View style={styles.viewfinderBox}>
          {/* Corner brackets */}
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />

          {/* Laser scanning beam */}
          <View style={styles.laserBeam} />
        </View>
        <Text style={styles.instructionText}>
          Align QR code within the frame to scan public profile
        </Text>
      </View>

      {/* Quick Test Bar (Allows 1-Click Scanning in Mobile Simulator) */}
      <View style={styles.simulatorTestBar}>
        <Text style={styles.testBarLabel}>⚡ Instant Test Scans:</Text>
        <View style={styles.testButtonsRow}>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => handleSimulatedScan('user-2')}
          >
            <Text style={styles.testBtnText}>Scan Emma</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => handleSimulatedScan('user-3')}
          >
            <Text style={styles.testBtnText}>Scan Kevin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Public Profile Preview Modal (Section 5 Requirement) */}
      <Modal visible={!!scannedUser} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.profileSheet}>
            {!requestSent ? (
              <>
                <View style={styles.sheetHandle} />

                {/* Profile Header */}
                <Image
                  source={{ uri: scannedUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' }}
                  style={styles.sheetAvatar}
                />
                <Text style={styles.sheetName}>{scannedUser?.displayName}</Text>
                <Text style={styles.sheetId}>WeChat ID: {scannedUser?.username}</Text>
                <Text style={styles.sheetRegion}>📍 {scannedUser?.region || 'Global'}</Text>

                {scannedUser?.bio && (
                  <View style={styles.bioBox}>
                    <Text style={styles.bioText}>"{scannedUser.bio}"</Text>
                  </View>
                )}

                {/* Greeting Note Input */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Greeting Message:</Text>
                  <TextInput
                    style={styles.greetingInput}
                    value={requestMessage}
                    onChangeText={setRequestMessage}
                    placeholder="Introduce yourself..."
                  />
                </View>

                {/* Actions */}
                <View style={styles.sheetActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setScannedUser(null)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.addFriendBtn}
                    onPress={handleSendFriendRequest}
                    disabled={isSending}
                  >
                    <UserPlus size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.addFriendText}>
                      {isSending ? 'Sending...' : 'Add Friend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              /* Success Confirmation */
              <View style={styles.successContainer}>
                <CheckCircle2 size={54} color={Colors.light.primary} />
                <Text style={styles.successTitle}>Friend Request Sent!</Text>
                <Text style={styles.successSubtitle}>
                  {scannedUser?.displayName} will be notified. Once accepted, you can start chatting.
                </Text>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => {
                    setScannedUser(null);
                    setRequestSent(false);
                    onClose();
                  }}
                >
                  <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700'
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  torchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewfinderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewfinderBox: {
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    position: 'relative'
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: Colors.light.primary
  },
  tl: { top: -1, left: -1, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 16 },
  tr: { top: -1, right: -1, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 16 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 16 },
  br: { bottom: -1, right: -1, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 16 },
  laserBeam: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.light.primary
  },
  instructionText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 24,
    textAlign: 'center'
  },
  simulatorTestBar: {
    backgroundColor: '#111827',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#1F2937',
    alignItems: 'center'
  },
  testBarLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8
  },
  testButtonsRow: {
    flexDirection: 'row',
    gap: 12
  },
  testBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  testBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end'
  },
  profileSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    alignItems: 'center'
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginBottom: 16
  },
  sheetAvatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 10
  },
  sheetName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827'
  },
  sheetId: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2
  },
  sheetRegion: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2
  },
  bioBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    width: '100%'
  },
  bioText: {
    fontSize: 12.5,
    color: '#4B5563',
    textAlign: 'center',
    fontStyle: 'italic'
  },
  inputWrapper: {
    width: '100%',
    marginTop: 16
  },
  inputLabel: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 4
  },
  greetingInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#111827'
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%'
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center'
  },
  cancelText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14
  },
  addFriendBtn: {
    flex: 2,
    backgroundColor: Colors.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10
  },
  addFriendText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  },
  successContainer: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 14
  },
  successSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20
  },
  doneBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 20
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14
  }
});
