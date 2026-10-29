import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Image as ImageIcon, Zap, ZapOff } from 'lucide-react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { useApp } from '../../src/context/AppContext';

const { width } = Dimensions.get('window');
const SCAN_FRAME_SIZE = width * 0.72;

export default function QrScannerScreen() {
  const router = useRouter();
  const { isDarkMode } = useApp();
  const [flashOn, setFlashOn] = useState(false);

  const handleSimulateScan = () => {
    Alert.alert(
      'QR Code Detected! 🎯',
      'Contact: Amit Verma (@amit_v)\nUPI: amit@okaxis\n\nWould you like to add Amit or send money?',
      [
        { text: 'Send UPI', onPress: () => router.push('/wallet') },
        { text: 'Add Contact', onPress: () => router.push('/(tabs)/contacts') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleGalleryPick = () => {
    Alert.alert('Scan from Gallery', 'Select an image containing a ChatIndia or UPI QR code from your gallery.', [
      { text: 'Pick Sample QR', onPress: handleSimulateScan },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Header matching Screen 11 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.title}>Scan QR Code</Text>
          <Text style={styles.subtitle}>Point your camera at a QR code</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Camera Viewfinder View with Green Glowing Corners */}
      <View style={styles.centerArea}>
        <TouchableOpacity
          style={styles.scanTarget}
          activeOpacity={0.9}
          onPress={handleSimulateScan}
        >
          {/* Target Reticle corners */}
          <Svg width={SCAN_FRAME_SIZE} height={SCAN_FRAME_SIZE} viewBox="0 0 240 240">
            {/* Top-Left */}
            <Path d="M 10 50 L 10 10 L 50 10" stroke="#07C160" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Top-Right */}
            <Path d="M 190 10 L 230 10 L 230 50" stroke="#07C160" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Bottom-Left */}
            <Path d="M 10 190 L 10 230 L 50 230" stroke="#07C160" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Bottom-Right */}
            <Path d="M 190 230 L 230 230 L 230 190" stroke="#07C160" strokeWidth="5" strokeLinecap="round" fill="none" />
          </Svg>

          {/* Scanner horizontal sweep line */}
          <View style={styles.sweepLine} />

          <Text style={styles.tapToScanHint}>Align QR code inside box to scan</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls matching Screen 11: [Gallery] [Flash] */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.controlItem} onPress={handleGalleryPick} activeOpacity={0.75}>
          <View style={styles.controlIconCircle}>
            <ImageIcon size={22} color="#FFFFFF" />
          </View>
          <Text style={styles.controlLabel}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlItem}
          onPress={() => setFlashOn(!flashOn)}
          activeOpacity={0.75}
        >
          <View style={[styles.controlIconCircle, flashOn && styles.flashActive]}>
            {flashOn ? <Zap size={22} color="#07C160" /> : <ZapOff size={22} color="#FFFFFF" />}
          </View>
          <Text style={styles.controlLabel}>Flash</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F14',
    justifyContent: 'space-between'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  backBtn: {
    padding: 6
  },
  headerTitleGroup: {
    alignItems: 'center'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12.5,
    marginTop: 2
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scanTarget: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  sweepLine: {
    position: 'absolute',
    width: '80%',
    height: 2,
    backgroundColor: '#07C160',
    shadowColor: '#07C160',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
  tapToScanHint: {
    position: 'absolute',
    bottom: -32,
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    fontWeight: '600'
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
    paddingBottom: 36,
    paddingTop: 16
  },
  controlItem: {
    alignItems: 'center',
    gap: 8
  },
  controlIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)'
  },
  flashActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#07C160'
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600'
  }
});

