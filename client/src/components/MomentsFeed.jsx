import React, { useState } from 'react';
import { ChevronLeft, Camera, Heart, MessageCircle, MapPin, Send, Plus, X, Globe, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MomentsFeed({
  moments,
  currentUser,
  onBack,
  onPostMoment,
  onLikeMoment,
  onCommentMoment
}) {
  const [showPostModal, setShowPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postImages, setPostImages] = useState([]);
  const [postLocation, setPostLocation] = useState('Shenzhen Bay Innovation Park');
  const [activeActionMenuId, setActiveActionMenuId] = useState(null);
  const [commentInputMap, setCommentInputMap] = useState({});
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  // New post submission
  const handlePublish = (e) => {
    e.preventDefault();
    if (!postText.trim() && postImages.length === 0) return;
    onPostMoment({
      content: postText.trim(),
      images: postImages.length > 0 ? postImages : [
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800"
      ],
      location: postLocation,
      privacy: "Public"
    });
    setPostText('');
    setPostImages([]);
    setShowPostModal(false);
  };

  const handleToggleLike = (momentId) => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#fa5151', '#ff7875', '#ffffff']
    });
    onLikeMoment(momentId);
    setActiveActionMenuId(null);
  };

  const handleSendComment = (momentId) => {
    const text = commentInputMap[momentId];
    if (!text?.trim()) return;
    onCommentMoment(momentId, text.trim());
    setCommentInputMap(prev => ({ ...prev, [momentId]: '' }));
    setActiveCommentPostId(null);
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
      {/* Top Bar with translucent overlay */}
      <div style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)'
      }}>
        <button
          className="header-icon-btn"
          onClick={onBack}
          style={{ color: '#ffffff', background: 'rgba(0,0,0,0.3)' }}
        >
          <ChevronLeft size={24} />
        </button>

        <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '16px' }}>Moments (朋友圈)</span>

        <button
          className="header-icon-btn"
          onClick={() => setShowPostModal(true)}
          style={{ color: '#ffffff', background: 'rgba(0,0,0,0.3)' }}
          title="Post Moment"
        >
          <Camera size={20} />
        </button>
      </div>

      {/* Moments Feed Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Cover Photo & User Avatar Header */}
        <div style={{ position: 'relative', marginBottom: 40 }}>
          <div style={{
            width: '100%',
            height: 240,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200"
              alt="Cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))'
            }} />
          </div>

          {/* User Name & Avatar Floating */}
          <div style={{
            position: 'absolute',
            bottom: -28,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span style={{
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 800,
              textShadow: '0 2px 6px rgba(0,0,0,0.8)'
            }}>
              {currentUser?.name}
            </span>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              overflow: 'hidden',
              border: '3px solid #ffffff',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}>
              <img
                src={currentUser?.avatar}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Moments Post Items */}
        <div style={{ padding: '0 16px 40px' }}>
          {moments.map(moment => {
            const hasLiked = moment.likes?.some(l => l.id === currentUser?.id);

            return (
              <div
                key={moment.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '20px 0',
                  borderBottom: '1px solid var(--wechat-border)'
                }}
              >
                {/* Author Avatar */}
                <img
                  src={moment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }}
                />

                {/* Content Area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#576b95' }}>
                    {moment.author?.name}
                  </div>

                  {/* Text */}
                  {moment.content && (
                    <div style={{
                      fontSize: '14.5px',
                      lineHeight: 1.5,
                      color: 'var(--wechat-text-primary)',
                      marginTop: 6,
                      wordBreak: 'break-word'
                    }}>
                      {moment.content}
                    </div>
                  )}

                  {/* Photo Grid */}
                  {moment.images?.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: moment.images.length === 1 ? '1fr' : 'repeat(3, 1fr)',
                      gap: 6,
                      marginTop: 10,
                      maxWidth: moment.images.length === 1 ? 260 : '100%'
                    }}>
                      {moment.images.map((img, idx) => (
                        <div
                          key={idx}
                          style={{
                            aspectRatio: '1/1',
                            borderRadius: 6,
                            overflow: 'hidden',
                            background: '#000'
                          }}
                        >
                          <img
                            src={img}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Location */}
                  {moment.location && (
                    <div style={{
                      fontSize: '12px',
                      color: '#576b95',
                      marginTop: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <MapPin size={13} />
                      {moment.location}
                    </div>
                  )}

                  {/* Timestamp & Popover Action Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--wechat-text-muted)' }}>
                      {moment.timestamp}
                    </span>

                    {/* WeChat Signature '••' button */}
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setActiveActionMenuId(activeActionMenuId === moment.id ? null : moment.id)}
                        style={{
                          background: 'rgba(0,0,0,0.06)',
                          border: 'none',
                          borderRadius: 4,
                          padding: '3px 8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#576b95'
                        }}
                      >
                        ••
                      </button>

                      {/* WeChat Like/Comment pill flyout */}
                      {activeActionMenuId === moment.id && (
                        <div style={{
                          position: 'absolute',
                          right: 32,
                          top: -6,
                          background: '#4c515a',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          color: '#ffffff',
                          zIndex: 50,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                          overflow: 'hidden',
                          animation: 'scaleFadeIn 0.15s ease'
                        }}>
                          <button
                            onClick={() => handleToggleLike(moment.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#fff',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            <Heart size={14} fill={hasLiked ? '#fa5151' : 'none'} color={hasLiked ? '#fa5151' : '#fff'} />
                            <span>{hasLiked ? 'Unlike' : 'Like'}</span>
                          </button>
                          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
                          <button
                            onClick={() => {
                              setActiveActionMenuId(null);
                              setActiveCommentPostId(moment.id);
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#fff',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            <MessageCircle size={14} />
                            <span>Comment</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Likes and Comments Container */}
                  {((moment.likes?.length > 0) || (moment.comments?.length > 0)) && (
                    <div style={{
                      background: 'rgba(0,0,0,0.035)',
                      borderRadius: 6,
                      marginTop: 8,
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}>
                      {/* Likes list */}
                      {moment.likes?.length > 0 && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          color: '#576b95',
                          fontWeight: 600,
                          borderBottom: moment.comments?.length > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                          paddingBottom: moment.comments?.length > 0 ? 6 : 0,
                          marginBottom: moment.comments?.length > 0 ? 6 : 0
                        }}>
                          <Heart size={13} fill="#576b95" color="#576b95" />
                          <span>{moment.likes.map(l => l.name).join(', ')}</span>
                        </div>
                      )}

                      {/* Comments list */}
                      {moment.comments?.map((c, i) => (
                        <div key={c.id || i} style={{ marginTop: 4, lineHeight: 1.4 }}>
                          <span style={{ color: '#576b95', fontWeight: 600 }}>{c.author}: </span>
                          <span style={{ color: 'var(--wechat-text-primary)' }}>{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active Comment Input */}
                  {activeCommentPostId === moment.id && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={commentInputMap[moment.id] || ''}
                        onChange={(e) => setCommentInputMap({ ...commentInputMap, [moment.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(moment.id)}
                        style={{
                          flex: 1,
                          background: 'var(--wechat-card-bg)',
                          border: '1px solid var(--wechat-border)',
                          borderRadius: 6,
                          padding: '6px 10px',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleSendComment(moment.id)}
                        style={{
                          background: '#07c160',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          padding: '0 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post New Moment Modal */}
      {showPostModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16
        }}>
          <div style={{
            width: 360,
            background: 'var(--wechat-card-bg)',
            borderRadius: 16,
            padding: 20,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: '16px', fontWeight: 700 }}>New Moment</span>
              <button
                onClick={() => setShowPostModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="What's on your mind? Share thoughts, photos, travel..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--wechat-bg)',
                border: '1px solid var(--wechat-border)',
                borderRadius: 8,
                padding: 10,
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />

            <div style={{ margin: '12px 0' }}>
              <label style={{ fontSize: '12px', color: 'var(--wechat-text-secondary)', fontWeight: 600 }}>
                Location:
              </label>
              <input
                type="text"
                value={postLocation}
                onChange={(e) => setPostLocation(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--wechat-bg)',
                  border: '1px solid var(--wechat-border)',
                  borderRadius: 6,
                  padding: '6px 10px',
                  fontSize: '13px',
                  marginTop: 4,
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={handlePublish}
              style={{
                width: '100%',
                background: '#07c160',
                color: '#ffffff',
                border: 'none',
                borderRadius: 10,
                padding: 12,
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 6
              }}
            >
              Post to Moments (发表)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
