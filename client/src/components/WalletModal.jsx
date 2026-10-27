import React, { useState } from 'react';
import {
  ChevronLeft, CreditCard, QrCode, ArrowDownLeft, ArrowUpRight,
  Gift, ShieldCheck, Plus, CheckCircle2, RefreshCw
} from 'lucide-react';
import { generateQrMatrix } from '../utils/qrHelper';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function WalletModal({
  isOpen,
  onClose,
  wallet,
  transactions,
  currentUser,
  onTopupWallet
}) {
  const [activeSubModal, setActiveSubModal] = useState(null); // 'pay-code' | 'receive-code' | 'topup'
  const [topupAmount, setTopupAmount] = useState('500');

  if (!isOpen) return null;

  // Generate Matrix for Payment / Receive Code
  const qrMatrix = generateQrMatrix(`WECHAT_PAY_${currentUser?.id}_${Date.now()}`);

  const handleTopupSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(topupAmount);
    if (isNaN(amt) || amt <= 0) return alert("Invalid amount");
    onTopupWallet(amt);
    sounds.playRedPacketCoin();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
    setActiveSubModal(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 500,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: 400,
        maxHeight: '94vh',
        background: 'var(--wechat-bg)',
        borderRadius: 24,
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div className="wechat-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="header-icon-btn" onClick={onClose}>
              <ChevronLeft size={24} />
            </button>
            <span style={{ fontSize: '16px', fontWeight: 800 }}>WeChat Pay (微信支付)</span>
          </div>
          <span style={{ fontSize: '12px', color: '#07c160', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ShieldCheck size={16} /> Secured
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
          {/* Green Balance Card */}
          <div style={{
            background: 'linear-gradient(135deg, #07c160, #059648)',
            borderRadius: 18,
            padding: '24px 20px',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(7, 193, 96, 0.35)'
          }}>
            <div style={{ fontSize: '13px', opacity: 0.9 }}>Total Balance (零钱)</div>
            <div style={{ fontSize: '38px', fontWeight: 900, margin: '6px 0 16px' }}>
              ¥{wallet?.balance?.toFixed(2) || '1,888.50'}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setActiveSubModal('topup')}
                style={{
                  flex: 1,
                  background: '#ffffff',
                  color: '#07c160',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Top-up (充值)
              </button>
              <button
                onClick={() => alert("Withdraw to ICBC (••••8866): Instant transfer with 0% fee.")}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '9px',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
              >
                Withdraw (提现)
              </button>
            </div>
          </div>

          {/* Quick Pay / Receive Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 16
          }}>
            <div
              onClick={() => setActiveSubModal('pay-code')}
              style={{
                background: 'var(--wechat-card-bg)',
                borderRadius: 14,
                padding: '16px',
                border: '1px solid var(--wechat-border)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#e8f8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                color: '#07c160'
              }}>
                <QrCode size={24} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Quick Pay Code</div>
              <div style={{ fontSize: '11px', color: 'var(--wechat-text-muted)', marginTop: 2 }}>
                Scan to pay in shops
              </div>
            </div>

            <div
              onClick={() => setActiveSubModal('receive-code')}
              style={{
                background: 'var(--wechat-card-bg)',
                borderRadius: 14,
                padding: '16px',
                border: '1px solid var(--wechat-border)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                color: '#e04a3f'
              }}>
                <Gift size={24} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700 }}>Receive Money QR</div>
              <div style={{ fontSize: '11px', color: 'var(--wechat-text-muted)', marginTop: 2 }}>
                Friends scan to pay you
              </div>
            </div>
          </div>

          {/* Linked Bank Cards */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wechat-text-secondary)', marginBottom: 8 }}>
              LINKED BANK CARDS
            </div>
            {wallet?.bankCards?.map(card => (
              <div
                key={card.id}
                style={{
                  background: 'var(--wechat-card-bg)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  border: '1px solid var(--wechat-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8
                }}
              >
                <CreditCard size={22} color="#07c160" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700 }}>{card.bank}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--wechat-text-muted)' }}>
                    {card.type} • {card.number}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transaction History */}
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wechat-text-secondary)', marginBottom: 8 }}>
              RECENT BILLS & TRANSACTIONS
            </div>
            <div style={{ background: 'var(--wechat-card-bg)', borderRadius: 14, border: '1px solid var(--wechat-border)', overflow: 'hidden' }}>
              {transactions?.map((tx, idx) => (
                <div
                  key={tx.id || idx}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--wechat-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '20px' }}>{tx.icon || '💳'}</span>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600 }}>{tx.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--wechat-text-muted)' }}>{tx.timestamp}</div>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '14.5px',
                    fontWeight: 800,
                    color: tx.amount > 0 ? '#07c160' : '#111827'
                  }}>
                    {tx.amount > 0 ? `+¥${tx.amount.toFixed(2)}` : `-¥${Math.abs(tx.amount).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUBMODAL: QUICK PAY CODE (付款码) */}
        {activeSubModal === 'pay-code' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#07c160',
            color: '#fff',
            zIndex: 600,
            display: 'flex',
            flexDirection: 'column',
            padding: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setActiveSubModal(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕ Close
              </button>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>Quick Payment Code</span>
              <div style={{ width: 24 }} />
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 18,
              padding: '24px 20px',
              color: '#000',
              marginTop: 24,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Priority: Wallet Balance (¥{wallet?.balance?.toFixed(2)})</div>

              {/* Barcode representation */}
              <div style={{
                height: 50,
                background: 'repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 6px)',
                margin: '16px 0 8px'
              }} />
              <div style={{ fontSize: '12px', letterSpacing: 2, fontWeight: 700 }}>
                6217 8890 2314 9980
              </div>

              {/* QR Code */}
              <div style={{ padding: 14, display: 'inline-block', background: '#f9fafb', borderRadius: 12, marginTop: 14 }}>
                <svg width={160} height={160} viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}>
                  {qrMatrix.matrix.map((row, r) =>
                    row.map((isDark, c) => (
                      <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={isDark ? '#000' : 'transparent'} />
                    ))
                  )}
                </svg>
              </div>

              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: 10 }}>
                Code automatically refreshes every minute for security
              </div>
            </div>
          </div>
        )}

        {/* SUBMODAL: RECEIVE MONEY QR (收款码) */}
        {activeSubModal === 'receive-code' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: '#eab308',
            color: '#fff',
            zIndex: 600,
            display: 'flex',
            flexDirection: 'column',
            padding: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setActiveSubModal(null)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕ Close
              </button>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>Receive Money QR (个人收款)</span>
              <div style={{ width: 24 }} />
            </div>

            <div style={{
              background: '#fff',
              borderRadius: 18,
              padding: '24px 20px',
              color: '#000',
              marginTop: 24,
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800 }}>WeChat Pay QR Collection</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 2 }}>{currentUser?.name}</div>

              {/* QR Code */}
              <div style={{ padding: 14, display: 'inline-block', background: '#fefce8', borderRadius: 12, margin: '16px 0' }}>
                <svg width={180} height={180} viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}>
                  {qrMatrix.matrix.map((row, r) =>
                    row.map((isDark, c) => (
                      <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill={isDark ? '#ca8a04' : 'transparent'} />
                    ))
                  )}
                </svg>
              </div>

              <div style={{ fontSize: '12px', color: '#4b5563' }}>
                Funds go straight into your WeChat Pay wallet balance with zero fee.
              </div>
            </div>
          </div>
        )}

        {/* SUBMODAL: TOP UP (充值) */}
        {activeSubModal === 'topup' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            zIndex: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}>
            <div style={{
              background: 'var(--wechat-card-bg)',
              borderRadius: 16,
              padding: 24,
              width: 320,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: 14 }}>
                Top-up Wallet Balance
              </div>

              <form onSubmit={handleTopupSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', fontWeight: 600 }}>
                    Select / Enter Amount (¥)
                  </label>
                  <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
                    {['100', '500', '1000'].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopupAmount(amt)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: 8,
                          border: topupAmount === amt ? '2px solid #07c160' : '1px solid var(--wechat-border)',
                          background: topupAmount === amt ? '#e8f8f0' : 'transparent',
                          color: topupAmount === amt ? '#07c160' : 'inherit',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        ¥{amt}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: 10,
                      borderRadius: 8,
                      border: '1px solid var(--wechat-border)',
                      fontSize: '16px',
                      fontWeight: 700,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setActiveSubModal(null)}
                    style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid var(--wechat-border)', background: 'none' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#07c160', color: '#fff', fontWeight: 700 }}
                  >
                    Confirm Top-up
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
