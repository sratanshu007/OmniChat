import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, Mic, MicOff, Volume2, VolumeX, Camera, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function CallOverlay({
  callData, // { caller, receiver, callType: 'voice' | 'video', status: 'incoming' | 'active' }
  onAccept,
  onDecline,
  onEndCall
}) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Ringtone for incoming call
  useEffect(() => {
    if (callData?.status === 'incoming') {
      sounds.startRingtone();
    } else {
      sounds.stopRingtone();
    }
    return () => sounds.stopRingtone();
  }, [callData?.status]);

  // Call timer when active
  useEffect(() => {
    let timer = null;
    if (callData?.status === 'active') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callData?.status]);

  if (!callData) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const partner = callData.partner || callData.caller;
  const isVideo = callData.callType === 'video';

  return (
    <div className="call-modal-overlay">
      {/* Background for video calls */}
      {isVideo && callData.status === 'active' && !isVideoMuted && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          overflow: 'hidden'
        }}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200"
            alt="Video Feed"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85)' }}
          />

          {/* Picture-in-Picture Local Camera */}
          <div style={{
            position: 'absolute',
            top: 24,
            right: 20,
            width: 100,
            height: 140,
            borderRadius: 14,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.7)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            zIndex: 10
          }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
              alt="Me"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      )}

      {/* Top Details */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: 20,
          overflow: 'hidden',
          margin: '0 auto 16px',
          border: '3px solid rgba(255,255,255,0.3)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
        }}>
          <img
            src={partner?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ fontSize: '22px', fontWeight: 800 }}>{partner?.name || 'Contact'}</div>

        <div style={{ fontSize: '13.5px', color: '#9ca3af', marginTop: 6 }}>
          {callData.status === 'incoming'
            ? `Inviting you to a WeChat ${isVideo ? 'Video' : 'Voice'} Call...`
            : callData.status === 'active'
            ? `${isVideo ? 'HD Video Call' : 'Encrypted Voice Call'} • ${formatTimer(callDuration)}`
            : 'Connecting...'}
        </div>
      </div>

      {/* Center Wave for Voice Call */}
      {!isVideo && (
        <div style={{ zIndex: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 4, height: 28, background: '#07c160', borderRadius: 4 }} />
          <span style={{ width: 4, height: 42, background: '#07c160', borderRadius: 4 }} />
          <span style={{ width: 4, height: 60, background: '#07c160', borderRadius: 4 }} />
          <span style={{ width: 4, height: 36, background: '#07c160', borderRadius: 4 }} />
          <span style={{ width: 4, height: 20, background: '#07c160', borderRadius: 4 }} />
        </div>
      )}

      {/* Bottom Controls */}
      <div style={{ width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        {callData.status === 'incoming' ? (
          /* Incoming Buttons: Decline vs Accept */
          <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: 280 }}>
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={onDecline}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#fa5151',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(250, 81, 81, 0.4)'
                }}
              >
                <PhoneOff size={28} />
              </button>
              <div style={{ fontSize: '12px', marginTop: 8 }}>Decline</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={onAccept}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#07c160',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(7, 193, 96, 0.4)'
                }}
              >
                <Phone size={28} />
              </button>
              <div style={{ fontSize: '12px', marginTop: 8 }}>Accept</div>
            </div>
          </div>
        ) : (
          /* Active Call Controls */
          <>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: isMuted ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  color: isMuted ? '#000000' : '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: isSpeakerOn ? '#ffffff' : 'rgba(255,255,255,0.2)',
                  color: isSpeakerOn ? '#000000' : '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {isSpeakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
              </button>

              {isVideo && (
                <button
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: isVideoMuted ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    color: isVideoMuted ? '#000000' : '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Camera size={22} />
                </button>
              )}
            </div>

            {/* Red End Call Button */}
            <button
              onClick={onEndCall}
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#fa5151',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(250, 81, 81, 0.4)'
              }}
            >
              <PhoneOff size={28} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
