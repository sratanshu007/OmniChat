import React, { useState } from 'react';
import { ChevronLeft, Heart, MessageCircle, Share2, Music, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChannelsView({ channels, onBack }) {
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);
  const [likesMap, setLikesMap] = useState({});

  const current = channels[activeChannelIdx] || channels[0];

  const handleLike = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fa5151', '#f43f5e', '#ffffff']
    });
    setLikesMap(prev => ({
      ...prev,
      [current.id]: (prev[current.id] || current.likes) + 1
    }));
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#000000',
      color: '#ffffff',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'
      }}>
        <button
          onClick={onBack}
          style={{ background: 'rgba(0,0,0,0.4)', border: 'none', color: '#fff', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={22} />
        </button>

        <span style={{ fontSize: '16px', fontWeight: 800 }}>WeChat Channels (视频号)</span>

        <div style={{ width: 34 }} />
      </div>

      {/* Main Video Reel */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video
          src={current?.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={current?.poster}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Right Floating Actions */}
        <div style={{
          position: 'absolute',
          right: 14,
          bottom: 70,
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18
        }}>
          {/* Creator Avatar */}
          <div style={{ position: 'relative' }}>
            <img
              src={current?.creatorAvatar}
              alt=""
              style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }}
            />
          </div>

          {/* Like */}
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleLike}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Heart size={24} color="#fa5151" fill={likesMap[current?.id] ? "#fa5151" : "none"} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, marginTop: 4, display: 'block' }}>
              {(likesMap[current?.id] || current?.likes || 12000).toLocaleString()}
            </span>
          </div>

          {/* Comments */}
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Comments panel: 632 active viewers talking about this clip")}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageCircle size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, marginTop: 4, display: 'block' }}>
              {current?.comments || 632}
            </span>
          </div>

          {/* Share */}
          <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => alert("Shared to Moments & Chat!")}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={24} color="#fff" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, marginTop: 4, display: 'block' }}>
              Share
            </span>
          </div>
        </div>

        {/* Bottom Details Overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 16px 20px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent)',
          zIndex: 20
        }}>
          <div style={{ fontSize: '15px', fontWeight: 800 }}>@{current?.creator}</div>
          <div style={{ fontSize: '13px', lineHeight: 1.4, marginTop: 4, maxWidth: '80%' }}>
            {current?.caption}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#9ca3af', marginTop: 8 }}>
            <Music size={12} />
            <span>{current?.music}</span>
          </div>
        </div>
      </div>

      {/* Switch Next Video button */}
      <div style={{
        height: 48,
        background: '#111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        borderTop: '1px solid #222'
      }}>
        <button
          onClick={() => setActiveChannelIdx(prev => (prev > 0 ? prev - 1 : channels.length - 1))}
          style={{ background: '#222', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: '12px', cursor: 'pointer' }}
        >
          Previous Clip
        </button>
        <span style={{ fontSize: '12px', color: '#888' }}>
          {activeChannelIdx + 1} / {channels.length}
        </span>
        <button
          onClick={() => setActiveChannelIdx(prev => (prev < channels.length - 1 ? prev + 1 : 0))}
          style={{ background: '#07c160', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          Next Clip ▶
        </button>
      </div>
    </div>
  );
}
