import React from 'react';
import {
  Compass, Camera, Video, QrCode, Smartphone,
  Radio, Globe, Search, Users, ChevronRight, Sparkles
} from 'lucide-react';

export default function DiscoverView({
  onOpenMoments,
  onOpenChannels,
  onOpenMiniPrograms,
  onOpenQrScanner,
  hasMomentUpdates,
  latestMomentAvatar
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--wechat-bg)' }}>
      {/* Group 1: Moments (Iconic 朋友圈) */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={onOpenMoments}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Camera size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Moments (朋友圈)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {hasMomentUpdates && (
              <div style={{ position: 'relative' }}>
                <img
                  src={latestMomentAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover' }}
                />
                <span className="tab-dot" style={{ top: -2, right: -2 }} />
              </div>
            )}
            <ChevronRight size={18} color="var(--wechat-text-muted)" />
          </div>
        </div>
      </div>

      {/* Group 2: Channels (视频号) */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={onOpenChannels}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#f97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Video size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Channels (视频号)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '12px', color: '#f97316', fontWeight: 600 }}>Hot Clips 🔥</span>
            <ChevronRight size={18} color="var(--wechat-text-muted)" />
          </div>
        </div>
      </div>

      {/* Group 3: Scan & Shake */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={() => onOpenQrScanner('scan')}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#07c160',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <QrCode size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Scan (扫一扫)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>

        <div
          className="chat-list-item"
          onClick={() => alert("Shake (摇一摇): Shaking phone... Found 3 people shaking nearby in Shenzhen!")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Shake (摇一摇)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>
      </div>

      {/* Group 4: Top Stories & Search */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={() => alert("Top Stories (看一看): Displaying trending articles and friends' recommendations.")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Top Stories (看一看)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>

        <div
          className="chat-list-item"
          onClick={() => alert("Search (搜一搜): Global WeChat search across mini-programs, moments, articles, and services.")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Search size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Search (搜一搜)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>
      </div>

      {/* Group 5: Mini Programs (小程序 - Huge Feature) */}
      <div style={{ marginTop: 10, marginBottom: 20, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={onOpenMiniPrograms}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Mini Programs (小程序)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: '#8b5cf6',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: 999
            }}>
              4 Apps
            </span>
            <ChevronRight size={18} color="var(--wechat-text-muted)" />
          </div>
        </div>
      </div>
    </div>
  );
}
