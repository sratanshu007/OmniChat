import React, { useState } from 'react';
import {
  CreditCard, QrCode, Bookmark, Image, Smile, Settings,
  ChevronRight, RefreshCw, Moon, Sun, Monitor, Smartphone, ShieldCheck
} from 'lucide-react';

export default function MeView({
  currentUser,
  allUsers,
  onOpenWallet,
  onOpenQrScanner,
  onSwitchUser,
  viewMode,
  onToggleViewMode,
  theme,
  onToggleTheme,
  onOpenAdmin
}) {
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--wechat-bg)' }}>
      {/* 1. Profile Top Card */}
      <div style={{
        background: 'var(--wechat-card-bg)',
        padding: '28px 20px 20px',
        borderBottom: '1px solid var(--wechat-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src={currentUser?.avatar}
              alt=""
              style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--wechat-text-primary)' }}>
                {currentUser?.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--wechat-text-secondary)', marginTop: 4 }}>
                WeChat ID: {currentUser?.wechatId}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--wechat-text-muted)', marginTop: 2 }}>
                📍 {currentUser?.region || 'Shenzhen, China'}
              </div>
            </div>
          </div>

          <button
            className="header-icon-btn"
            onClick={() => onOpenQrScanner('my-qr')}
            title="My QR Code"
            style={{ width: 40, height: 40 }}
          >
            <QrCode size={22} color="var(--wechat-text-secondary)" />
          </button>
        </div>

        {/* Bio */}
        <div style={{
          marginTop: 14,
          fontSize: '12.5px',
          color: 'var(--wechat-text-secondary)',
          background: 'var(--wechat-bg)',
          padding: '8px 12px',
          borderRadius: 8
        }}>
          💬 {currentUser?.bio || "Living the SuperApp dream!"}
        </div>
      </div>

      {/* 2. WeChat Services / Pay (微信支付) */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={onOpenWallet}
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
              <CreditCard size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Services / WeChat Pay (微信支付)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#07c160' }}>
              ¥{currentUser?.wallet?.balance?.toFixed(2) || '0.00'}
            </span>
            <ChevronRight size={18} color="var(--wechat-text-muted)" />
          </div>
        </div>
      </div>

      {/* 3. Favorites, My Posts, Stickers */}
      <div style={{ marginTop: 10, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={() => alert("Favorites: 14 saved articles and red packet memories")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Favorites (收藏)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>

        <div
          className="chat-list-item"
          onClick={() => alert("My Moments: Browse your personal archive")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>My Posts & Moments (朋友圈相册)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>

        <div
          className="chat-list-item"
          onClick={() => alert("Sticker Gallery: Over 10,000 animated emoji packs")}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smile size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Sticker Gallery (表情包)</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>
      </div>

      {/* 4. Controls: Switch Account, Dual Layout, Theme, Admin */}
      <div style={{ marginTop: 10, marginBottom: 20, background: 'var(--wechat-card-bg)', borderBottom: '1px solid var(--wechat-border)' }}>
        <div
          className="chat-list-item"
          onClick={() => setShowSwitchModal(true)}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={16} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>Switch Account (切换账号)</div>
              <div style={{ fontSize: '11px', color: 'var(--wechat-text-muted)' }}>Test live 2-way chats as Emma or Kevin</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>

        <div
          className="chat-list-item"
          onClick={onToggleViewMode}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewMode === 'mobile' ? <Monitor size={16} color="#ffffff" /> : <Smartphone size={16} color="#ffffff" />}
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>
              Layout: {viewMode === 'mobile' ? 'Mobile Phone Frame' : 'Desktop SuperApp Wide'}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>Toggle</span>
        </div>

        <div
          className="chat-list-item"
          onClick={onToggleTheme}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'dark' ? <Sun size={16} color="#ffffff" /> : <Moon size={16} color="#ffffff" />}
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>
              Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', fontWeight: 600 }}>
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </span>
        </div>

        <div
          className="chat-list-item"
          onClick={onOpenAdmin}
          style={{ justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Admin Moderation & Metrics</span>
          </div>
          <ChevronRight size={18} color="var(--wechat-text-muted)" />
        </div>
      </div>

      {/* Switch Account Modal */}
      {showSwitchModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div style={{
            background: 'var(--wechat-card-bg)',
            borderRadius: 18,
            padding: 20,
            width: 330,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: 14 }}>
              Switch Logged-in Account
            </div>
            <div style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', marginBottom: 12 }}>
              Select another user to test peer-to-peer real-time chatting and WeChat Pay transfers:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allUsers?.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSwitchUser(user.id);
                    setShowSwitchModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: user.id === currentUser?.id ? '#e8f8f0' : 'var(--wechat-bg)',
                    border: user.id === currentUser?.id ? '2px solid #07c160' : '1px solid var(--wechat-border)',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={user.avatar}
                    alt=""
                    style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{user.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--wechat-text-secondary)' }}>ID: {user.wechatId}</div>
                  </div>
                  {user.id === currentUser?.id && (
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#07c160' }}>Active</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSwitchModal(false)}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: 8,
                border: '1px solid var(--wechat-border)',
                background: 'transparent',
                fontWeight: 600,
                marginTop: 14,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
