import React, { useState } from 'react';
import { ChevronLeft, Award, Eye, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

export default function OfficialAccountsView({
  officialAccounts,
  onBack,
  onSelectOfficialChat
}) {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'var(--wechat-bg)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div className="wechat-header" style={{ justifyContent: 'flex-start', gap: 12 }}>
        <button className="header-icon-btn" onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ fontWeight: 800, fontSize: '16px' }}>Official Accounts (微信公众号)</div>
      </div>

      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {/* Accounts List */}
        {officialAccounts.map(oa => (
          <div
            key={oa.id}
            style={{
              background: 'var(--wechat-card-bg)',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              border: '1px solid var(--wechat-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {/* Top Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={oa.avatar}
                  alt=""
                  style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '15px', fontWeight: 800 }}>
                    {oa.name}
                    {oa.verified && <Award size={15} color="#0284c7" />}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', marginTop: 2 }}>
                    {oa.category} • {oa.followers} followers
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectOfficialChat(oa)}
                style={{
                  background: '#e8f8f0',
                  color: '#07c160',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <MessageSquare size={13} /> Chat
              </button>
            </div>

            {/* Articles Published */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--wechat-text-muted)', marginBottom: 8 }}>
                LATEST ARTICLES & BROADCASTS
              </div>
              {oa.articles?.map(art => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  style={{
                    background: 'var(--wechat-bg)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    marginBottom: 10,
                    border: '1px solid var(--wechat-border)'
                  }}
                >
                  <img
                    src={art.cover}
                    alt=""
                    style={{ width: '100%', height: 110, objectFit: 'cover' }}
                  />
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--wechat-text-primary)' }}>
                      {art.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 6,
                      fontSize: '11px',
                      color: 'var(--wechat-text-muted)'
                    }}>
                      <span>{art.date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Eye size={12} /> {art.readCount} views
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--wechat-card-bg)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="wechat-header" style={{ justifyContent: 'flex-start', gap: 12 }}>
            <button className="header-icon-btn" onClick={() => setSelectedArticle(null)}>
              ← Back
            </button>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>Article Viewer</div>
          </div>

          <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 900, lineHeight: 1.3, color: 'var(--wechat-text-primary)' }}>
              {selectedArticle.title}
            </h1>
            <div style={{ fontSize: '12px', color: 'var(--wechat-text-muted)', margin: '10px 0 16px' }}>
              Published {selectedArticle.date} • {selectedArticle.readCount} reads • WeChat Official
            </div>

            <img
              src={selectedArticle.cover}
              alt=""
              style={{ width: '100%', borderRadius: 12, maxHeight: 220, objectFit: 'cover', marginBottom: 18 }}
            />

            <div style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--wechat-text-secondary)' }}>
              {selectedArticle.content}
            </div>

            <div style={{
              background: 'var(--wechat-bg)',
              borderRadius: 12,
              padding: 16,
              marginTop: 24,
              fontSize: '13px',
              border: '1px solid var(--wechat-border)'
            }}>
              ⭐ Read and recommended by 12 friends in Moments.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
