import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions
} from 'react-native';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Video,
  VideoOff,
  Grid,
  X
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

export const CallOverlayModal: React.FC = () => {
  const { activeCall, endCall, user } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dialedDigits, setDialedDigits] = useState('');

  if (!activeCall) return null;

  const isVideo = activeCall.type === 'video';

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (digit: string) => {
    setDialedDigits(prev => (prev + digit).slice(-12));
  };

  return (
    <Modal visible={!!activeCall} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* VIDEO CALL VIEW matching Screen 10 (Right Panel) */}
        {isVideo ? (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            {/* Fullscreen Video Stream of Target (Riya) */}
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000'
              }}
              style={styles.fullVideo}
              resizeMode="cover"
            />
            {/* Dark gradient overlay for top & bottom */}
            <View style={styles.topGradient} />
            <View style={styles.bottomGradient} />

            <SafeAreaView style={styles.videoUiContainer}>
              {/* Top Header */}
              <View style={styles.videoTopHeader}>
                <View>
                  <Text style={styles.videoCallerName}>{activeCall.targetName}</Text>
                  <Text style={styles.videoCallStatus}>
                    {activeCall.status === 'calling'
                      ? 'Connecting HD Video...'
                      : formatDuration(activeCall.durationSeconds)}
                  </Text>
                </View>

                {/* Floating Picture-In-Picture (Self View) */}
                <View style={styles.pipContainer}>
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.pipImage}
                  />
                  <View style={styles.pipBadge}>
                    <Text style={styles.pipText}>You</Text>
                  </View>
                </View>
              </View>

              {/* Bottom Video Controls */}
              <View style={styles.videoControlsRow}>
                {/* Mute */}
                <TouchableOpacity
                  style={[styles.videoControlBtn, isMuted && styles.controlBtnActive]}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={24} color="#EF4444" /> : <Mic size={24} color="#FFFFFF" />}
                  <Text style={styles.controlText}>{isMuted ? 'Muted' : 'Mute'}</Text>
                </TouchableOpacity>

                {/* End Call (Red Button) */}
                <TouchableOpacity style={styles.hangupBtn} onPress={endCall}>
                  <PhoneOff size={32} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Video On/Off or Camera Flip */}
                <TouchableOpacity
                  style={[styles.videoControlBtn, isVideoOff && styles.controlBtnActive]}
                  onPress={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? (
                    <VideoOff size={24} color="#EF4444" />
                  ) : (
                    <Video size={24} color="#07C160" />
                  )}
                  <Text style={styles.controlText}>{isVideoOff ? 'Cam Off' : 'Camera'}</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          /* VOICE CALL VIEW matching Screen 10 (Left Panel) */
          <SafeAreaView style={styles.voiceContainer}>
            {/* Top Caller Info */}
            <View style={styles.voiceTopSection}>
              <View style={styles.avatarBorderGlow}>
                <Image
                  source={{ uri: activeCall.targetAvatar }}
                  style={styles.callerAvatar}
                />
              </View>

              <Text style={styles.callerName}>{activeCall.targetName}</Text>
              <Text style={styles.callStatus}>
                {activeCall.status === 'calling'
                  ? 'Calling Voice...'
                  : `Voice Call  ${formatDuration(activeCall.durationSeconds)}`}
              </Text>
            </View>

            {/* Visual audio wave ripples */}
            <View style={styles.voiceVisualizer}>
              <View style={[styles.waveCircle, { width: 220, height: 220, borderRadius: 110, opacity: 0.15 }]} />
              <View style={[styles.waveCircle, { width: 170, height: 170, borderRadius: 85, opacity: 0.3 }]} />
              <View style={[styles.waveCircle, { width: 120, height: 120, borderRadius: 60, opacity: 0.5 }]} />
            </View>

            {/* Action Controls matching Screen 10: Mute, Keypad, Speaker + Hangup */}
            <View style={styles.voiceControlsContainer}>
              <View style={styles.controlsRow}>
                {/* Mute */}
                <TouchableOpacity
                  style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                  onPress={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff size={24} color="#EF4444" /> : <Mic size={24} color="#FFFFFF" />}
                  <Text style={styles.controlText}>{isMuted ? 'Muted' : 'Mute'}</Text>
                </TouchableOpacity>

                {/* Keypad */}
                <TouchableOpacity
                  style={[styles.controlBtn, showKeypad && styles.controlBtnActive]}
                  onPress={() => setShowKeypad(!showKeypad)}
                >
                  <Grid size={24} color="#FFFFFF" />
                  <Text style={styles.controlText}>Keypad</Text>
                </TouchableOpacity>

                {/* Speaker */}
                <TouchableOpacity
                  style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
                  onPress={() => setIsSpeaker(!isSpeaker)}
                >
                  {isSpeaker ? (
                    <Volume2 size={24} color="#07C160" />
                  ) : (
                    <VolumeX size={24} color="#FFFFFF" />
                  )}
                  <Text style={styles.controlText}>{isSpeaker ? 'Speaker On' : 'Speaker'}</Text>
                </TouchableOpacity>
              </View>

              {/* Red Hangup Button */}
              <View style={styles.hangupRow}>
                <TouchableOpacity style={styles.hangupBtn} onPress={endCall}>
                  <PhoneOff size={32} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        )}

        {/* DTMF Keypad Overlay */}
        {showKeypad && (
          <View style={styles.keypadOverlay}>
            <View style={styles.keypadHeader}>
              <Text style={styles.keypadDisplay}>{dialedDigits || 'Press numbers'}</Text>
              <TouchableOpacity onPress={() => setShowKeypad(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.keypadGrid}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                <TouchableOpacity
                  key={key}
                  style={styles.keypadKey}
                  onPress={() => handleKeypadPress(key)}
                >
                  <Text style={styles.keypadDigit}>{key}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  voiceContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 30
  },
  voiceTopSection: {
    alignItems: 'center',
    marginTop: 36
  },
  avatarBorderGlow: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 3.5,
    borderColor: '#07C160',
    padding: 3,
    marginBottom: 20,
    backgroundColor: 'rgba(7, 193, 96, 0.15)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  callerAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56
  },
  callerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8
  },
  callStatus: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '600'
  },
  voiceVisualizer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 140
  },
  waveCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#07C160'
  },
  voiceControlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30
  },
  hangupRow: {
    alignItems: 'center'
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.12)'
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)'
  },
  controlText: {
    color: '#E2E8F0',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600'
  },
  hangupBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#EF4444',
    shadowOpacity: 0.5,
    shadowRadius: 16
  },

  // Video Styles
  fullVideo: {
    width,
    height
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.45)'
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.65)'
  },
  videoUiContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  videoTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20
  },
  videoCallerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  videoCallStatus: {
    fontSize: 14,
    color: '#E2E8F0',
    marginTop: 4,
    fontWeight: '600'
  },
  pipContainer: {
    width: 90,
    height: 125,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 6
  },
  pipImage: {
    width: '100%',
    height: '100%'
  },
  pipBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  pipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700'
  },
  videoControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  videoControlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },

  // Keypad
  keypadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24
  },
  keypadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  keypadDisplay: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  keypadKey: {
    width: '30%',
    aspectRatio: 1.5,
    backgroundColor: '#334155',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  keypadDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
