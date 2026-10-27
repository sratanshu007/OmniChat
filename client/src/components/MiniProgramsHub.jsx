import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, MoreHorizontal, X, Star, Sparkles, Navigation,
  ShoppingBag, Utensils, CloudSun, RotateCcw, CheckCircle2, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function MiniProgramsHub({
  miniApps,
  onBack,
  currentUser,
  onWeChatPayTransfer
}) {
  const [activeApp, setActiveApp] = useState(null);

  // 2048 Game State
  const [board2048, setBoard2048] = useState([
    [2, 0, 0, 2],
    [0, 4, 0, 0],
    [0, 0, 8, 0],
    [0, 0, 0, 16]
  ]);
  const [score2048, setScore2048] = useState(128);

  // OmniRide State
  const [rideStep, setRideStep] = useState('select'); // 'select' | 'calling' | 'matched'
  const [ridePickup, setRidePickup] = useState('Shenzhen Bay Innovation Tech Park');
  const [rideDropoff, setRideDropoff] = useState('Shenzhen Baoan International Airport (T3)');
  const [rideFare, setRideFare] = useState(68.50);

  // OmniEats State
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Har Gow Shrimp Dim Sum (虾饺皇)", price: 32, qty: 1 },
    { id: 2, name: "Hong Kong Brown Sugar Milk Tea (丝袜奶茶)", price: 18, qty: 2 }
  ]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // 2048 Simple Slide Logic
  const handleMove2048 = (dir) => {
    // Clone board
    let next = board2048.map(row => [...row]);
    let points = 0;

    if (dir === 'left') {
      for (let r = 0; r < 4; r++) {
        let row = next[r].filter(v => v !== 0);
        for (let c = 0; c < row.length - 1; c++) {
          if (row[c] === row[c + 1]) {
            row[c] *= 2;
            points += row[c];
            row.splice(c + 1, 1);
          }
        }
        while (row.length < 4) row.push(0);
        next[r] = row;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < 4; r++) {
        let row = next[r].filter(v => v !== 0);
        for (let c = row.length - 1; c > 0; c--) {
          if (row[c] === row[c - 1]) {
            row[c] *= 2;
            points += row[c];
            row.splice(c - 1, 1);
            c--;
          }
        }
        while (row.length < 4) row.unshift(0);
        next[r] = row;
      }
    } else if (dir === 'up' || dir === 'down') {
      // Rotate, shift, rotate back
      let transposed = [0, 1, 2, 3].map(col => [0, 1, 2, 3].map(row => next[row][col]));
      for (let r = 0; r < 4; r++) {
        let row = transposed[r].filter(v => v !== 0);
        if (dir === 'up') {
          for (let c = 0; c < row.length - 1; c++) {
            if (row[c] === row[c + 1]) {
              row[c] *= 2;
              points += row[c];
              row.splice(c + 1, 1);
            }
          }
          while (row.length < 4) row.push(0);
        } else {
          for (let c = row.length - 1; c > 0; c--) {
            if (row[c] === row[c - 1]) {
              row[c] *= 2;
              points += row[c];
              row.splice(c - 1, 1);
              c--;
            }
          }
          while (row.length < 4) row.unshift(0);
        }
        transposed[r] = row;
      }
      next = [0, 1, 2, 3].map(col => [0, 1, 2, 3].map(row => transposed[row][col]));
    }

    // Add a random tile
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (next[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      next[r][c] = Math.random() > 0.8 ? 4 : 2;
    }

    setBoard2048(next);
    setScore2048(prev => prev + points);
    sounds.playMessage();
  };

  const reset2048 = () => {
    setBoard2048([
      [2, 0, 0, 2],
      [0, 4, 0, 0],
      [0, 0, 8, 0],
      [0, 0, 0, 16]
    ]);
    setScore2048(128);
  };

  // Ride Booking
  const handleBookRide = () => {
    setRideStep('calling');
    setTimeout(() => {
      setRideStep('matched');
      sounds.playRedPacketCoin();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
      onWeChatPayTransfer("DiDi OmniRide", rideFare, "Taxi Ride to Airport");
    }, 2000);
  };

  // Food Checkout
  const handleFoodCheckout = () => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    setOrderPlaced(true);
    sounds.playRedPacketCoin();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onWeChatPayTransfer("Meituan OmniEats", total, "Dim Sum & Milk Tea Order");
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--wechat-bg)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* If No Active App: Mini Programs Store View */}
      {!activeApp ? (
        <>
          <div className="wechat-header" style={{ justifyContent: 'flex-start', gap: 12 }}>
            <button className="header-icon-btn" onClick={onBack}>
              <ChevronLeft size={24} />
            </button>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Mini Programs (微信小程序)</div>
          </div>

          <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
            {/* Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              borderRadius: 16,
              padding: '20px',
              color: '#ffffff',
              marginBottom: 20,
              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', fontWeight: 700 }}>
                <Sparkles size={16} /> WECHAT MINI ECOSYSTEM
              </div>
              <div style={{ fontSize: '19px', fontWeight: 800, marginTop: 6 }}>
                Instant Apps, Zero Downloads
              </div>
              <div style={{ fontSize: '12.5px', opacity: 0.85, marginTop: 4 }}>
                Play games, hail cabs, order food, and pay seamlessly with WeChat Pay.
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wechat-text-secondary)', marginBottom: 10 }}>
              FEATURED MINI APPS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {miniApps.map(app => (
                <div
                  key={app.id}
                  onClick={() => setActiveApp(app)}
                  style={{
                    background: 'var(--wechat-card-bg)',
                    borderRadius: 16,
                    padding: '16px',
                    border: '1px solid var(--wechat-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: app.color || '#07c160',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}>
                    {app.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wechat-text-primary)' }}>
                        {app.name}
                      </div>
                      <span style={{
                        fontSize: '11px',
                        background: '#e8f8f0',
                        color: '#07c160',
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontWeight: 700
                      }}>
                        Open
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', marginTop: 2 }}>
                      {app.category} • {app.users}
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--wechat-text-muted)', marginTop: 4, lineClamp: 1 }}>
                      {app.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ACTIVE RUNNING MINI PROGRAM RUNNER */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', color: '#111' }}>
          {/* Authentic WeChat Capsule Navigation Bar */}
          <div style={{
            height: 48,
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            background: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '18px' }}>{activeApp.icon}</span>
              <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#111827' }}>
                {activeApp.name.split('(')[0]}
              </span>
            </div>

            {/* WeChat Pill Capsule */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              padding: '2px 8px',
              gap: 8
            }}>
              <button
                onClick={() => alert(`Mini Program Info: ${activeApp.name}\nDeveloper: ${activeApp.developer}\nRating: ${activeApp.rating} ★`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <MoreHorizontal size={16} color="#4b5563" />
              </button>
              <div style={{ width: 1, height: 14, background: '#d1d5db' }} />
              <button
                onClick={() => setActiveApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}
              >
                <X size={16} color="#4b5563" />
              </button>
            </div>
          </div>

          {/* MINI APP CONTENT RUNNER */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f9fafb' }}>
            {/* MINI APP 1: JUMP 2048 GAME */}
            {activeApp.id === 'mini-game-2048' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#f59e0b' }}>2048</div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Join the numbers to get to 2048!</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ background: '#bbada0', color: '#fff', borderRadius: 6, padding: '4px 10px' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700 }}>SCORE</div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>{score2048}</div>
                    </div>
                    <button
                      onClick={reset2048}
                      style={{
                        background: '#8f7a66',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '6px 10px',
                        cursor: 'pointer'
                      }}
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>

                {/* 4x4 Game Grid */}
                <div style={{
                  background: '#bbada0',
                  borderRadius: 12,
                  padding: 10,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 8,
                  width: 290,
                  height: 290,
                  margin: '0 auto'
                }}>
                  {board2048.map((row, r) =>
                    row.map((val, c) => {
                      const colors = {
                        0: '#cdc1b4',
                        2: '#eee4da',
                        4: '#ede0c8',
                        8: '#f2b179',
                        16: '#f59563',
                        32: '#f67c5f',
                        64: '#f65e3b',
                        128: '#edcf72',
                        256: '#edcc61',
                        512: '#edc850',
                        1024: '#edc53f',
                        2048: '#edc22e'
                      };
                      return (
                        <div
                          key={`${r}-${c}`}
                          style={{
                            background: colors[val] || '#edc22e',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: val > 64 ? '18px' : '22px',
                            fontWeight: 800,
                            color: val <= 4 ? '#776e65' : '#ffffff',
                            boxShadow: val > 0 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          {val > 0 ? val : ''}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Arrow Controls */}
                <div style={{ marginTop: 20 }}>
                  <button
                    onClick={() => handleMove2048('up')}
                    style={{ padding: '8px 24px', margin: 4, borderRadius: 8, background: '#8f7a66', color: '#fff', border: 'none', fontWeight: 700 }}
                  >
                    ▲ UP
                  </button>
                  <div>
                    <button
                      onClick={() => handleMove2048('left')}
                      style={{ padding: '8px 20px', margin: 4, borderRadius: 8, background: '#8f7a66', color: '#fff', border: 'none', fontWeight: 700 }}
                    >
                      ◀ LEFT
                    </button>
                    <button
                      onClick={() => handleMove2048('down')}
                      style={{ padding: '8px 20px', margin: 4, borderRadius: 8, background: '#8f7a66', color: '#fff', border: 'none', fontWeight: 700 }}
                    >
                      ▼ DOWN
                    </button>
                    <button
                      onClick={() => handleMove2048('right')}
                      style={{ padding: '8px 20px', margin: 4, borderRadius: 8, background: '#8f7a66', color: '#fff', border: 'none', fontWeight: 700 }}
                    >
                      ▶ RIGHT
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MINI APP 2: OMNIRIDE (DIDI) */}
            {activeApp.id === 'mini-ride' && (
              <div>
                <div style={{
                  height: 140,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  color: '#fff',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 800, fontSize: '16px' }}>DiDi Mobility Express</span>
                    <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 999 }}>
                      GPS Accurate
                    </span>
                  </div>
                  <div style={{ fontSize: '13px' }}>
                    🚖 12 Available Drivers within 3 mins
                  </div>
                </div>

                {/* Form */}
                <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginTop: 14, border: '1px solid #e5e7eb' }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>PICKUP:</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>🟢 {ridePickup}</div>
                  </div>
                  <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: 10 }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 600 }}>DESTINATION:</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>🔴 {rideDropoff}</div>
                  </div>
                </div>

                {rideStep === 'select' && (
                  <button
                    onClick={handleBookRide}
                    style={{
                      width: '100%',
                      background: '#f97316',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: 14,
                      fontSize: '15px',
                      fontWeight: 800,
                      marginTop: 18,
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Booking (¥{rideFare.toFixed(2)} via WeChat Pay)
                  </button>
                )}

                {rideStep === 'calling' && (
                  <div style={{ textAlign: 'center', padding: 24, color: '#f97316', fontWeight: 700 }}>
                    Connecting with nearest driver...
                  </div>
                )}

                {rideStep === 'matched' && (
                  <div style={{ background: '#ecfdf5', borderRadius: 14, padding: 16, marginTop: 16, border: '1px solid #a7f3d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontWeight: 700 }}>
                      <CheckCircle2 size={20} /> Driver Matched! Toyota Camry (粤B•8829F)
                    </div>
                    <div style={{ fontSize: '12px', color: '#065f46', marginTop: 4 }}>
                      Arriving in 3 minutes. Settled automatically via WeChat Pay.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MINI APP 3: OMNIEATS (MEITUAN) */}
            {activeApp.id === 'mini-food' && (
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, marginBottom: 12 }}>
                  Guangdong Gourmet House (粤菜经典)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: '12px 14px',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#e04a3f', fontWeight: 800, marginTop: 2 }}>
                          ¥{item.price}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>Qty: {item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {!orderPlaced ? (
                  <button
                    onClick={handleFoodCheckout}
                    style={{
                      width: '100%',
                      background: '#07c160',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 12,
                      padding: 14,
                      fontSize: '15px',
                      fontWeight: 800,
                      marginTop: 20,
                      cursor: 'pointer'
                    }}
                  >
                    WeChat Pay Checkout (¥{cartItems.reduce((acc, i) => acc + i.price * i.qty, 0)})
                  </button>
                ) : (
                  <div style={{
                    background: '#e8f8f0',
                    border: '1px solid #a7f3d0',
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 18,
                    textAlign: 'center',
                    color: '#065f46',
                    fontWeight: 700
                  }}>
                    🎉 Order Placed! Courier will deliver in 28 minutes.
                  </div>
                )}
              </div>
            )}

            {/* MINI APP 4: WEATHER */}
            {activeApp.id === 'mini-weather' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  background: 'linear-gradient(180deg, #38bdf8, #0284c7)',
                  borderRadius: 20,
                  padding: '24px 20px',
                  color: '#fff'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 800 }}>Shenzhen (深圳)</div>
                  <div style={{ fontSize: '54px', fontWeight: 900, margin: '8px 0' }}>26°C</div>
                  <div style={{ fontSize: '14px', opacity: 0.9 }}>Sunny & Gentle Breeze • AQI 24 (Excellent)</div>
                </div>

                <div style={{ background: '#fff', borderRadius: 14, padding: 16, marginTop: 16, border: '1px solid #e5e7eb', textAlign: 'left' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: 8 }}>7-Day Forecast</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div>Mon: 27°C ☀️</div>
                    <div>Tue: 26°C ⛅</div>
                    <div>Wed: 25°C 🌧️</div>
                    <div>Thu: 26°C ☀️</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
