import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, Phone, Video, MoreHorizontal, Smile, Plus,
  Mic, Keyboard, Send, Image as ImageIcon, MapPin, Gift, CreditCard,
  Volume2, Check, CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function ChatWindow({
  chat,
  onBack,
  currentUserId,
  currentUser,
  onSendMessage,
  onInitiateCall,
  onClaimRedPacket,
  onSendRedPacket
}) {
  const [inputText, setInputText] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeVoiceId, setActiveVoiceId] = useState(null);

  // Red Packet Modals
  const [showSendRpModal, setShowSendRpModal] = useState(false);
  const [rpAmount, setRpAmount] = useState('88.88');
  const [rpGreeting, setRpGreeting] = useState('大吉大利，恭喜发财！🧧 (Best Wishes!)');
  const [openedRpData, setOpenedRpData] = useState(null);
  const [isOpeningRp, setIsOpeningRp] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage({
      type: 'text',
      content: inputText.trim()
    });
    setInputText('');
  };

  // Voice Recording simulation
  const handleStartRecord = () => {
    sounds.playVoiceRecord();
    setIsRecording(true);
    setRecordDuration(1);
    timerRef.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);
  };

  const handleStopRecord = () => {
    if (!isRecording) return;
    clearInterval(timerRef.current);
    setIsRecording(false);
    const duration = Math.max(1, recordDuration);
    onSendMessage({
      type: 'voice',
      content: `Voice Note (${duration}s)`,
      duration
    });
    setRecordDuration(0);
  };

  // Play voice note
  const handlePlayVoice = (msgId) => {
    setActiveVoiceId(msgId);
    sounds.playVoiceRecord();
    setTimeout(() => {
      setActiveVoiceId(null);
    }, 3000);
  };

  // Image Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSendMessage({
        type: 'image',
        content: reader.result,
        caption: file.name
      });
      setShowDrawer(false);
    };
    reader.readAsDataURL(file);
  };

  // Send Red Packet
  const handleSendRpSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(rpAmount);
    if (isNaN(amt) || amt <= 0) return alert("Please enter a valid amount");
    if (amt > currentUser.wallet.balance) {
      return alert("Insufficient wallet balance. Please top up first!");
    }
    onSendRedPacket({
      chatId: chat.id,
      amount: amt,
      greeting: rpGreeting
    });
    setShowSendRpModal(false);
    setShowDrawer(false);
  };

  // Open Red Packet
  const handleOpenRedPacket = (msg) => {
    setOpenedRpData(msg);
  };

  const handleSpinOpenRp = () => {
    setIsOpeningRp(true);
    setTimeout(() => {
      sounds.playRedPacketCoin();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f8d486', '#e04a3f', '#ffffff', '#ffd700']
      });
      setIsOpeningRp(false);
      onClaimRedPacket(openedRpData.id, chat.id);
      setOpenedRpData(prev => ({ ...prev, isClaimed: true }));
    }, 900);
  };

  const emojis = ['😊', '😂', '🧧', '👍', '🙏', '❤️', '🎉', '🔥', '🍜', '☕️', '🍻', '💼', '🚀', '✨', '🌸', '😎'];

  const chatTitle = chat.type === 'direct'
    ? chat.targetUser?.name
    : chat.type === 'official'
    ? chat.targetUser?.name
    : chat.groupName;

  const chatAvatar = chat.type === 'direct'
    ? chat.targetUser?.avatar
    : chat.groupAvatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100';

  return (
    <div className="chat-window">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Chat Window Top Bar */}
      <div className="wechat-header" style={{ borderBottom: '1px solid var(--wechat-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="header-icon-btn" onClick={onBack}>
            <ChevronLeft size={24} />
          </button>
          <div>
            <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--wechat-text-primary)' }}>
              {chatTitle}
            </div>
            {chat.type === 'direct' && (
              <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                Online
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {chat.type === 'direct' && (
            <>
              <button
                className="header-icon-btn"
                title="Voice Call"
                onClick={() => onInitiateCall(chat.targetUser, 'voice')}
              >
                <Phone size={19} />
              </button>
              <button
                className="header-icon-btn"
                title="Video Call"
                onClick={() => onInitiateCall(chat.targetUser, 'video')}
              >
                <Video size={20} />
              </button>
            </>
          )}
          <button className="header-icon-btn" title="Chat Details">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="chat-messages-container">
        {chat.messages?.map((msg, index) => {
          const isSentByMe = msg.senderId === currentUserId;
          const senderAvatar = isSentByMe ? currentUser?.avatar : (chat.targetUser?.avatar || chatAvatar);

          return (
            <div
              key={msg.id || index}
              className={`chat-bubble-row ${isSentByMe ? 'sent' : 'recv'}`}
            >
              <img
                src={senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt=""
                className="bubble-avatar"
              />

              <div className="bubble-content-box">
                {chat.type === 'group' && !isSentByMe && (
                  <span className="bubble-sender-name">{msg.senderName || 'Member'}</span>
                )}

                {/* Bubble Types */}
                {msg.type === 'text' && (
                  <div className={`bubble-bubble ${isSentByMe ? 'sent' : 'recv'}`}>
                    {msg.content}
                  </div>
                )}

                {msg.type === 'image' && (
                  <div style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    maxWidth: 240,
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--wechat-border)'
                  }}>
                    <img src={msg.content} alt="Attachment" style={{ width: '100%', display: 'block' }} />
                    {msg.caption && (
                      <div style={{ padding: '6px 10px', fontSize: '12px', background: 'var(--wechat-card-bg)' }}>
                        {msg.caption}
                      </div>
                    )}
                  </div>
                )}

                {msg.type === 'voice' && (
                  <div
                    className={`bubble-bubble ${isSentByMe ? 'sent' : 'recv'}`}
                    onClick={() => handlePlayVoice(msg.id)}
                  >
                    <div className="voice-bubble">
                      <Volume2 size={18} />
                      <div className="voice-wave-bar">
                        <span style={{ height: activeVoiceId === msg.id ? 14 : 8 }} />
                        <span style={{ height: activeVoiceId === msg.id ? 18 : 12 }} />
                        <span style={{ height: activeVoiceId === msg.id ? 10 : 6 }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>{msg.duration || 5}"</span>
                    </div>
                  </div>
                )}

                {/* Red Packet (Hongbao) Bubble */}
                {msg.type === 'red_packet' && (
                  <div
                    className="red-packet-bubble"
                    onClick={() => handleOpenRedPacket(msg)}
                  >
                    <div className="red-packet-top">
                      <div className="red-packet-icon-wrapper">
                        🧧
                      </div>
                      <div>
                        <div className="red-packet-greeting">
                          {msg.greeting || "大吉大利，恭喜发财！"}
                        </div>
                        <div className="red-packet-status">
                          {msg.isClaimed ? "Red packet already opened" : "Tap to open lucky money"}
                        </div>
                      </div>
                    </div>
                    <div className="red-packet-bottom">
                      <span>WeChat Pay (微信支付)</span>
                      <span>🧧 {msg.amount ? `¥${msg.amount}` : ''}</span>
                    </div>
                  </div>
                )}

                {msg.type === 'location' && (
                  <div style={{
                    background: 'var(--wechat-card-bg)',
                    borderRadius: 10,
                    overflow: 'hidden',
                    width: 220,
                    border: '1px solid var(--wechat-border)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--wechat-text-primary)' }}>
                        {msg.content}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--wechat-text-secondary)', marginTop: 2 }}>
                        {msg.address || 'Shenzhen, Guangdong'}
                      </div>
                    </div>
                    <div style={{
                      height: 70,
                      background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#065f46',
                      fontWeight: 700,
                      gap: 4
                    }}>
                      <MapPin size={18} /> Map Preview
                    </div>
                  </div>
                )}

                {msg.type === 'call_log' && (
                  <div style={{
                    alignSelf: 'center',
                    background: 'rgba(0,0,0,0.06)',
                    padding: '4px 12px',
                    borderRadius: 999,
                    fontSize: '11.5px',
                    color: 'var(--wechat-text-secondary)',
                    margin: '4px auto'
                  }}>
                    📞 {msg.content}
                  </div>
                )}

                {/* Timestamp & Status */}
                <div style={{
                  fontSize: '10px',
                  color: 'var(--wechat-text-muted)',
                  marginTop: 3,
                  alignSelf: isSentByMe ? 'flex-end' : 'flex-start',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3
                }}>
                  {msg.timestamp}
                  {isSentByMe && <CheckCheck size={11} color="#07c160" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div style={{
          background: 'var(--wechat-card-bg)',
          borderTop: '1px solid var(--wechat-border)',
          padding: '12px',
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          gap: '8px',
          fontSize: '22px',
          maxHeight: '130px',
          overflowY: 'auto'
        }}>
          {emojis.map((emoji, idx) => (
            <button
              key={idx}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              onClick={() => {
                setInputText(prev => prev + emoji);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="chat-input-bar">
        <button
          className="chat-input-btn"
          title="Toggle Voice Mode"
          onClick={() => setIsVoiceMode(!isVoiceMode)}
        >
          {isVoiceMode ? <Keyboard size={22} /> : <Mic size={22} />}
        </button>

        {isVoiceMode ? (
          <div
            className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
            onMouseDown={handleStartRecord}
            onMouseUp={handleStopRecord}
            onTouchStart={handleStartRecord}
            onTouchEnd={handleStopRecord}
          >
            {isRecording ? `🔴 Recording (${recordDuration}s) - Release to Send` : 'Hold to Talk (按住 说话)'}
          </div>
        ) : (
          <textarea
            className="chat-text-input"
            rows={1}
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
          />
        )}

        <button
          className="chat-input-btn"
          title="Emoji"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <Smile size={22} />
        </button>

        {inputText.trim() ? (
          <button className="send-msg-btn" onClick={handleSendText}>
            Send
          </button>
        ) : (
          <button
            className="chat-input-btn"
            title="More Options"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* Attachments Drawer */}
      {showDrawer && (
        <div className="chat-attachments-drawer">
          <div className="drawer-action-item" onClick={() => fileInputRef.current?.click()}>
            <div className="drawer-icon-box">
              <ImageIcon size={24} color="#07c160" />
            </div>
            <span className="drawer-label">Photos</span>
          </div>

          <div className="drawer-action-item" onClick={() => setShowSendRpModal(true)}>
            <div className="drawer-icon-box" style={{ background: '#fef2f2' }}>
              <Gift size={24} color="#e04a3f" />
            </div>
            <span className="drawer-label">Red Packet 🧧</span>
          </div>

          {chat.type === 'direct' && (
            <>
              <div
                className="drawer-action-item"
                onClick={() => {
                  setShowDrawer(false);
                  onInitiateCall(chat.targetUser, 'voice');
                }}
              >
                <div className="drawer-icon-box">
                  <Phone size={24} color="#3b82f6" />
                </div>
                <span className="drawer-label">Voice Call</span>
              </div>

              <div
                className="drawer-action-item"
                onClick={() => {
                  setShowDrawer(false);
                  onInitiateCall(chat.targetUser, 'video');
                }}
              >
                <div className="drawer-icon-box">
                  <Video size={24} color="#8b5cf6" />
                </div>
                <span className="drawer-label">Video Call</span>
              </div>
            </>
          )}

          <div
            className="drawer-action-item"
            onClick={() => {
              onSendMessage({
                type: 'location',
                content: 'Shenzhen Bay Innovation Hub',
                address: 'High-Tech Industrial Park, Nanshan, Shenzhen'
              });
              setShowDrawer(false);
            }}
          >
            <div className="drawer-icon-box">
              <MapPin size={24} color="#10b981" />
            </div>
            <span className="drawer-label">Location</span>
          </div>

          <div
            className="drawer-action-item"
            onClick={() => {
              onSendMessage({
                type: 'text',
                content: '💳 WeChat Pay Transfer initiated for ¥200.00'
              });
              setShowDrawer(false);
            }}
          >
            <div className="drawer-icon-box">
              <CreditCard size={24} color="#f59e0b" />
            </div>
            <span className="drawer-label">Transfer</span>
          </div>
        </div>
      )}

      {/* Modal: Send Lucky Red Packet (发红包) */}
      {showSendRpModal && (
        <div className="red-packet-modal-backdrop" onClick={() => setShowSendRpModal(false)}>
          <div
            style={{
              background: 'var(--wechat-card-bg)',
              borderRadius: 16,
              width: 330,
              padding: 24,
              boxShadow: 'var(--shadow-lg)',
              animation: 'scaleFadeIn 0.2s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 36,
                height: 36,
                background: '#e04a3f',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18
              }}>
                🧧
              </div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--wechat-text-primary)' }}>
                Send WeChat Red Packet
              </div>
            </div>

            <form onSubmit={handleSendRpSubmit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', fontWeight: 600 }}>
                  Total Amount (¥)
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--wechat-bg)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginTop: 6
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#e04a3f', marginRight: 6 }}>¥</span>
                  <input
                    type="number"
                    step="0.01"
                    value={rpAmount}
                    onChange={(e) => setRpAmount(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '18px',
                      fontWeight: 700,
                      width: '100%',
                      outline: 'none',
                      color: 'var(--wechat-text-primary)'
                    }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--wechat-text-muted)', marginTop: 4 }}>
                  Available Balance: ¥{currentUser?.wallet?.balance?.toFixed(2) || '0.00'}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', fontWeight: 600 }}>
                  Blessing / Greeting
                </label>
                <input
                  type="text"
                  value={rpGreeting}
                  onChange={(e) => setRpGreeting(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--wechat-bg)',
                    border: '1px solid var(--wechat-border)',
                    borderRadius: 8,
                    padding: '9px 12px',
                    fontSize: '13.5px',
                    marginTop: 6,
                    outline: 'none',
                    color: 'var(--wechat-text-primary)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: '1px solid var(--wechat-border)',
                    background: 'transparent',
                    color: 'var(--wechat-text-primary)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={() => setShowSendRpModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 8,
                    border: 'none',
                    background: 'linear-gradient(135deg, #fa5151, #e04a3f)',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(224, 74, 63, 0.4)'
                  }}
                >
                  Put in Packet 🧧
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Open / Celebrate Red Packet (开红包) */}
      {openedRpData && (
        <div className="red-packet-modal-backdrop" onClick={() => setOpenedRpData(null)}>
          <div className="red-packet-envelope-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rp-envelope-curve" />

            {/* Header info */}
            <div style={{ zIndex: 10, textAlign: 'center', marginTop: 12 }}>
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 8px',
                border: '2px solid #ffeaac'
              }}>
                <img
                  src={chat.targetUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700 }}>
                {openedRpData.senderName || chat.targetUser?.name || 'Friend'}
              </div>
              <div style={{ fontSize: '13px', color: '#ffeaac', marginTop: 4 }}>
                Sent you a Lucky Red Packet 🧧
              </div>
              <div style={{ fontSize: '14px', marginTop: 14, fontWeight: 600, padding: '0 12px' }}>
                "{openedRpData.greeting || '大吉大利，恭喜发财！'}"
              </div>
            </div>

            {/* Center: Interactive "開" Gold Coin Button */}
            {!openedRpData.isClaimed ? (
              <div
                className={`rp-open-coin-btn ${isOpeningRp ? 'spinning' : ''}`}
                onClick={handleSpinOpenRp}
                title="Click to Open"
              >
                開
              </div>
            ) : (
              <div style={{ zIndex: 10, textAlign: 'center', animation: 'scaleFadeIn 0.3s ease' }}>
                <div style={{ fontSize: '13px', color: '#ffeaac' }}>Amount Received</div>
                <div style={{ fontSize: '38px', fontWeight: 800, color: '#f8d486', margin: '4px 0' }}>
                  ¥{openedRpData.amount || '88.88'}
                </div>
                <div style={{
                  fontSize: '11px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '3px 12px',
                  borderRadius: 999,
                  display: 'inline-block'
                }}>
                  Added directly to WeChat Pay Wallet ✅
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ zIndex: 10, fontSize: '11.5px', color: 'rgba(255,255,255,0.75)' }}>
              {openedRpData.isClaimed ? "Details saved in Transaction History" : "Tap '開' to open lucky money"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
