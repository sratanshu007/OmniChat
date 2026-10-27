import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, Camera, Search, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateQrMatrix } from '../utils/qrHelper';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export default function QrScannerModal({
  isOpen,
  onClose,
  currentUser,
  allContacts,
  onAddFriendByQr,
  initialTab = 'scan'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'scan' | 'my-qr' | 'search'
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedResult, setScannedResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Handle camera stream when on 'scan' tab
  useEffect(() => {
    if (isOpen && activeTab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
        }
      } else {
        setCameraActive(false);
      }
    } catch (err) {
      console.warn("Camera access not available or denied:", err);
      setCameraError("Camera preview simulated for demo environment");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Perform QR scan action
  const triggerScanSuccess = async (qrString, targetName) => {
    sounds.playMessage();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#07c160', '#10b981', '#34d399', '#ffffff']
    });

    const result = await onAddFriendByQr(qrString);
    if (result?.success) {
      setScannedResult({
        name: result.user?.name || targetName,
        avatar: result.user?.avatar,
        wechatId: result.user?.wechatId,
        region: result.user?.region || "Shenzhen, China",
        chatId: result.chatId
      });
    }
  };

  // Generate My Personal QR Code SVG
  const myQrMatrix = generateQrMatrix(currentUser?.qrCode || `OMNICHAT_USER_${currentUser?.id}`);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: 390,
        maxHeight: '92vh',
        background: '#191919',
        borderRadius: 24,
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        border: '1px solid #333333',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#ffffff'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #282828'
        }}>
          <div style={{ fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <QrCode size={20} color="#07c160" />
            <span>WeChat QR Code Services</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              setScannedResult(null);
              onClose();
            }}
            style={{
              background: '#282828',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: 32,
              height: 32,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#222222',
          padding: 4,
          margin: '12px 16px 0',
          borderRadius: 12
        }}>
          <button
            onClick={() => {
              setScannedResult(null);
              setActiveTab('scan');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'scan' ? '#07c160' : 'transparent',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Scan QR Code (扫一扫)
          </button>
          <button
            onClick={() => {
              setScannedResult(null);
              setActiveTab('my-qr');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'my-qr' ? '#07c160' : 'transparent',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            My QR Code (我的名片)
          </button>
          <button
            onClick={() => {
              setScannedResult(null);
              setActiveTab('search');
            }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'search' ? '#07c160' : 'transparent',
              color: '#ffffff',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Search ID / Phone
          </button>
        </div>

        {/* TAB 1: SCAN QR CODE VIEW */}
        {activeTab === 'scan' && !scannedResult && (
          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Viewfinder Screen */}
            <div className="qr-scanner-overlay" style={{ background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cameraActive ? (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Camera size={36} color="#07c160" style={{ margin: '0 auto 8px', opacity: 0.8 }} />
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    Align QR Code within the frame
                  </div>
                </div>
              )}

              {/* Glowing Corner Brackets */}
              <div className="qr-corner-bracket bracket-tl" />
              <div className="qr-corner-bracket bracket-tr" />
              <div className="qr-corner-bracket bracket-bl" />
              <div className="qr-corner-bracket bracket-br" />

              {/* Animated Laser Scanning Line */}
              <div className="laser-beam" />
            </div>

            <div style={{ fontSize: '12.5px', color: '#aaa', marginTop: 14, textAlign: 'center' }}>
              Place QR Code inside the frame to scan and add friend automatically
            </div>

            {/* Quick Test QR Badges */}
            <div style={{
              width: '100%',
              marginTop: 18,
              background: '#222222',
              borderRadius: 14,
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#07c160', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} /> One-Click Test Scans (Scan Anyone Instantly):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {allContacts?.slice(0, 3).map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => triggerScanSuccess(contact.qrCode || `OMNICHAT_USER_${contact.id}`, contact.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#2c2c2c',
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={contact.avatar}
                        alt=""
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{contact.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>ID: {contact.wechatId}</div>
                      </div>
                    </div>
                    <button style={{
                      background: '#07c160',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      Scan QR
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SCAN SUCCESS CONFIRMATION MODAL */}
        {scannedResult && (
          <div style={{
            padding: '30px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            animation: 'scaleFadeIn 0.25s ease'
          }}>
            <div style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#07c160',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 0 25px rgba(7, 193, 96, 0.5)'
            }}>
              <CheckCircle2 size={36} color="#ffffff" />
            </div>

            <div style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff' }}>
              QR Code Recognized!
            </div>
            <div style={{ fontSize: '13px', color: '#10b981', marginTop: 4 }}>
              Friend request accepted automatically via QR
            </div>

            {/* User Profile Card */}
            <div style={{
              background: '#222222',
              borderRadius: 16,
              padding: 16,
              width: '100%',
              marginTop: 18,
              border: '1px solid #333'
            }}>
              <img
                src={scannedResult.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'}
                alt=""
                style={{ width: 68, height: 68, borderRadius: 12, objectFit: 'cover', margin: '0 auto 8px' }}
              />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{scannedResult.name}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: 2 }}>
                WeChat ID: {scannedResult.wechatId}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: 4 }}>
                📍 {scannedResult.region}
              </div>
            </div>

            <button
              onClick={() => {
                setScannedResult(null);
                onClose();
              }}
              style={{
                width: '100%',
                background: '#07c160',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '12px',
                fontSize: '15px',
                fontWeight: 700,
                marginTop: 20,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(7, 193, 96, 0.4)'
              }}
            >
              Start Chatting Now
            </button>
          </div>
        )}

        {/* TAB 2: MY PERSONAL QR CODE CARD */}
        {activeTab === 'my-qr' && (
          <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              background: '#ffffff',
              color: '#000000',
              borderRadius: 20,
              padding: '24px 20px',
              width: '100%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}>
              {/* Profile Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, textAlign: 'left' }}>
                <img
                  src={currentUser?.avatar}
                  alt=""
                  style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>
                    {currentUser?.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    WeChat ID: {currentUser?.wechatId}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {currentUser?.region || 'Shenzhen, China'}
                  </div>
                </div>
              </div>

              {/* High-Resolution SVG QR Matrix */}
              <div style={{
                background: '#f9fafb',
                padding: 16,
                borderRadius: 12,
                display: 'inline-block',
                border: '1px solid #e5e7eb'
              }}>
                <svg
                  width={200}
                  height={200}
                  viewBox={`0 0 ${myQrMatrix.size} ${myQrMatrix.size}`}
                  style={{ display: 'block', shapeRendering: 'crispEdges' }}
                >
                  {myQrMatrix.matrix.map((row, r) =>
                    row.map((isDark, c) => (
                      <rect
                        key={`${r}-${c}`}
                        x={c}
                        y={r}
                        width={1}
                        height={1}
                        fill={isDark ? '#000000' : 'transparent'}
                      />
                    ))
                  )}
                </svg>
              </div>

              <div style={{ fontSize: '12px', color: '#4b5563', marginTop: 14, fontWeight: 500 }}>
                Scan this QR code to add me as a friend on OmniChat
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEARCH BY ID OR PHONE */}
        {activeTab === 'search' && (
          <div style={{ padding: '24px 20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#aaa', marginBottom: 10 }}>
              Search by WeChat ID, Mobile, or User Code
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#222222',
              borderRadius: 10,
              padding: '10px 14px',
              border: '1px solid #333'
            }}>
              <Search size={18} color="#888" style={{ marginRight: 8 }} />
              <input
                type="text"
                placeholder="e.g. emma_design or kevin_tech"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '14px',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: 8 }}>Available to add:</div>
              {allContacts
                ?.filter(c =>
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.wechatId.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(contact => (
                  <div
                    key={contact.id}
                    onClick={() => triggerScanSuccess(contact.qrCode || `OMNICHAT_USER_${contact.id}`, contact.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#242424',
                      borderRadius: 10,
                      padding: '10px 14px',
                      marginBottom: 8,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={contact.avatar}
                        alt=""
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{contact.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{contact.wechatId}</div>
                      </div>
                    </div>
                    <button style={{
                      background: '#07c160',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 6,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      Add Friend
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
