import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Video } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

export const CallOverlayModal: React.FC = () => {
  const { activeCall, endCall } = useApp();
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  if (!activeCall) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <Modal visible={!!activeCall} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        {/* Background / Caller Info */}
        <View style={styles.topSection}>
          <Image source={{ uri: activeCall.targetAvatar }} style={styles.callerAvatar} />
          <Text style={styles.callerName}>{activeCall.targetName}</Text>
          <Text style={styles.callStatus}>
            {activeCall.status === 'calling'
              ? `Calling ${activeCall.type === 'video' ? 'Video' : 'Voice'}...`
              : formatDuration(activeCall.durationSeconds)}
          </Text>
        </View>

        {/* Video Preview or Visual Wave */}
        {activeCall.type === 'video' ? (
          <View style={styles.videoBox}>
            <View style={styles.videoPlaceholder}>
              <Video size={40} color="#07C160" />
              <Text style={styles.videoHint}>720p HD Video Stream Connected</Text>
            </View>
          </View>
        ) : (
          <View style={styles.voiceVisualizer}>
            <View style={[styles.waveCircle, { width: 140, height: 140, borderRadius: 70 }]} />
            <View style={[styles.waveCircle, { width: 100, height: 100, borderRadius: 50, opacity: 0.6 }]} />
          </View>
        )}

        {/* Action Controls */}
        <View style={styles.controlsRow}>
          {/* Mute */}
          <TouchableOpacity
            style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} color="#EF4444" /> : <Mic size={24} color="#FFFFFF" />}
            <Text style={styles.controlText}>{isMuted ? 'Muted' : 'Mute'}</Text>
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity style={styles.hangupBtn} onPress={endCall}>
            <PhoneOff size={32} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Speaker */}
          <TouchableOpacity
            style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
            onPress={() => setIsSpeaker(!isSpeaker)}
          >
            {isSpeaker ? <Volume2 size={24} color="#07C160" /> : <VolumeX size={24} color="#FFFFFF" />}
            <Text style={styles.controlText}>{isSpeaker ? 'Speaker On' : 'Speaker'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    justifyContent: 'space-between',
    paddingVertical: 40
  },
  topSection: {
    alignItems: 'center',
    marginTop: 30
  },
  callerAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#07C160',
    marginBottom: 16
  },
  callerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8
  },
  callStatus: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600'
  },
  videoBox: {
    marginHorizontal: 30,
    height: 220,
    backgroundColor: '#262626',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#404040'
  },
  videoPlaceholder: {
    alignItems: 'center',
    gap: 12
  },
  videoHint: {
    color: '#A3A3A3',
    fontSize: 14,
    fontWeight: '600'
  },
  voiceVisualizer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160
  },
  waveCircle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#07C160',
    opacity: 0.3
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.15)'
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  controlText: {
    color: '#D1D5DB',
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
    elevation: 6
  }
});
