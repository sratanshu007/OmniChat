import React, { createContext, useContext, useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  region: string;
  bio: string;
  phone?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isMe: boolean;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VOICE' | 'RED_PACKET' | 'TRANSFER';
  createdAt: string;
  metadata?: {
    amountCents?: number;
    greeting?: string;
    isClaimed?: boolean;
    claimedBy?: string;
    voiceDuration?: number;
    imageUrl?: string;
    note?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  avatarUrl: string;
  isGroup: boolean;
  isPinned: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageAt: string;
  partnerId: string;
}

export interface Contact {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  region: string;
  signature: string;
  phone?: string;
}

export interface MomentPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrls: string[];
  createdAt: string;
  likes: string[];
  comments: { id: string; authorName: string; text: string }[];
}

export interface WalletTransaction {
  id: string;
  title: string;
  amountFormatted: string;
  isPositive: boolean;
  type: string;
  date: string;
}

interface CallState {
  targetName: string;
  targetAvatar: string;
  type: 'audio' | 'video';
  status: 'calling' | 'connected';
  durationSeconds: number;
}

interface AppContextType {
  user: UserProfile;
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  friends: Contact[];
  friendRequests: any[];
  walletBalance: number;
  walletBalanceFormatted: string;
  walletTransactions: WalletTransaction[];
  moments: MomentPost[];
  activeCall: CallState | null;
  serverUrl: string;
  sendMessage: (convId: string, content: string, type?: 'TEXT' | 'IMAGE' | 'VOICE', meta?: any) => void;
  sendRedPacket: (convId: string, amountYuan: number, greeting: string) => void;
  claimRedPacket: (convId: string, messageId: string) => void;
  sendTransfer: (convId: string, amountYuan: number, note: string) => void;
  topUpWallet: (amountYuan: number) => void;
  postMoment: (content: string, imageUrl?: string) => void;
  likeMoment: (momentId: string) => void;
  addMomentComment: (momentId: string, text: string) => void;
  addFriendByUsernameOrQR: (identifier: string) => boolean;
  acceptFriendRequest: (reqId: string) => void;
  startCall: (targetName: string, targetAvatar: string, type: 'audio' | 'video') => void;
  endCall: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

// Detect Local Backend Host dynamically for Expo Go on physical phones or simulators
function getBackendHost() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:5055/api/v1`;
  }
  return Platform.select({
    android: 'http://10.0.2.2:5055/api/v1',
    ios: 'http://localhost:5055/api/v1',
    default: 'http://localhost:5055/api/v1'
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const serverUrl = getBackendHost();

  const [user, setUser] = useState<UserProfile>({
    id: 'user_me_001',
    displayName: 'Alex Chen (陈博)',
    username: 'alex_chen',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    region: 'Shenzhen, Guangdong',
    bio: 'Architecting next-gen SuperApps 🚀 | WeChat Clone',
    phone: '+86 138 0000 8888'
  });

  const [walletBalance, setWalletBalance] = useState<number>(188850); // in cents => 1,888.50 CNY

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_1',
      title: '🧧 Received Lucky Money (WeChat Red Packet)',
      amountFormatted: '+¥88.88',
      isPositive: true,
      type: 'RED_PACKET',
      date: 'Today 14:20'
    },
    {
      id: 'tx_2',
      title: '☕ Manner Coffee via Mini Program',
      amountFormatted: '-¥32.00',
      isPositive: false,
      type: 'MINI_APP_PURCHASE',
      date: 'Today 10:15'
    },
    {
      id: 'tx_3',
      title: '💳 Bank Card Top-Up (ICBC)',
      amountFormatted: '+¥1,000.00',
      isPositive: true,
      type: 'TOP_UP',
      date: 'Yesterday 18:30'
    },
    {
      id: 'tx_4',
      title: '🚕 OmniRide Taxi Booking',
      amountFormatted: '-¥45.50',
      isPositive: false,
      type: 'RIDE_PAY',
      date: 'Oct 25 21:05'
    }
  ]);

  const [friends, setFriends] = useState<Contact[]>([
    {
      id: 'user_emma',
      displayName: 'Emma Watson',
      username: 'emma_w',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      region: 'London, UK',
      signature: 'Keep smiling, tomorrow is a brand new day 🌸',
      phone: '+44 7911 123456'
    },
    {
      id: 'user_wei',
      displayName: 'Wei Zhang (张伟)',
      username: 'weizhang',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      region: 'Beijing, China',
      signature: 'Tech & Coffee lover ☕💻',
      phone: '+86 139 1234 5678'
    },
    {
      id: 'user_sophia',
      displayName: 'Sophia Liu (刘雅)',
      username: 'sophia_liu',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      region: 'Shanghai, China',
      signature: 'Foodie exploring the world 🍜🍣',
      phone: '+86 137 9876 5432'
    },
    {
      id: 'user_david',
      displayName: 'David Miller',
      username: 'david_m',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
      region: 'Singapore',
      signature: 'Always learning something new 🚀',
      phone: '+65 9123 4567'
    }
  ]);

  const [friendRequests, setFriendRequests] = useState<any[]>([
    {
      id: 'req_1',
      senderId: 'user_grace',
      senderName: 'Grace Hopper (王玲)',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160',
      message: 'Hi Alex! Scanned your WeChat QR card from tech meetup.',
      time: '10 mins ago'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_emma',
      title: 'Emma Watson',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      isGroup: false,
      isPinned: true,
      unreadCount: 0,
      lastMessageText: '🧧 [WeChat Red Packet] Best Wishes!',
      lastMessageAt: '14:20',
      partnerId: 'user_emma'
    },
    {
      id: 'conv_wei',
      title: 'Wei Zhang (张伟)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      isGroup: false,
      isPinned: false,
      unreadCount: 1,
      lastMessageText: 'Are you joining the group call tonight?',
      lastMessageAt: '12:45',
      partnerId: 'user_wei'
    },
    {
      id: 'conv_group',
      title: 'OmniChat Core Builders 🚀',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160',
      isGroup: true,
      isPinned: false,
      unreadCount: 3,
      lastMessageText: 'Sophia: Just tested the QR code sharing feature!',
      lastMessageAt: '11:10',
      partnerId: 'group_core'
    },
    {
      id: 'conv_sophia',
      title: 'Sophia Liu (刘雅)',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'See you at the mini program demo.',
      lastMessageAt: 'Yesterday',
      partnerId: 'user_sophia'
    }
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    conv_emma: [
      {
        id: 'msg_e1',
        conversationId: 'conv_emma',
        senderId: 'user_emma',
        senderName: 'Emma Watson',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: 'Hi Alex! How is the new OmniChat mobile build going?',
        type: 'TEXT',
        createdAt: '14:15'
      },
      {
        id: 'msg_e2',
        conversationId: 'conv_emma',
        senderId: 'user_me_001',
        senderName: 'Alex Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        isMe: true,
        content: 'It is amazing! Red packets, voice calls, moments and mini apps are all working in Expo Go!',
        type: 'TEXT',
        createdAt: '14:17'
      },
      {
        id: 'msg_e3',
        conversationId: 'conv_emma',
        senderId: 'user_emma',
        senderName: 'Emma Watson',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: '🧧 WeChat Red Packet',
        type: 'RED_PACKET',
        createdAt: '14:20',
        metadata: {
          amountCents: 8888,
          greeting: 'Best Wishes & Great Success! 🧧🎉',
          isClaimed: false
        }
      }
    ],
    conv_wei: [
      {
        id: 'msg_w1',
        conversationId: 'conv_wei',
        senderId: 'user_wei',
        senderName: 'Wei Zhang',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
        isMe: false,
        content: 'Are you joining the group call tonight?',
        type: 'TEXT',
        createdAt: '12:45'
      }
    ],
    conv_group: [
      {
        id: 'msg_g1',
        conversationId: 'conv_group',
        senderId: 'user_sophia',
        senderName: 'Sophia Liu',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
        isMe: false,
        content: 'Just tested the QR code sharing feature!',
        type: 'TEXT',
        createdAt: '11:10'
      }
    ],
    conv_sophia: [
      {
        id: 'msg_s1',
        conversationId: 'conv_sophia',
        senderId: 'user_sophia',
        senderName: 'Sophia Liu',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
        isMe: false,
        content: 'See you at the mini program demo.',
        type: 'TEXT',
        createdAt: 'Yesterday'
      }
    ]
  });

  const [moments, setMoments] = useState<MomentPost[]>([
    {
      id: 'post_1',
      authorId: 'user_emma',
      authorName: 'Emma Watson',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      content: 'Beautiful sunset in London today! 🌅 Reminds me how important it is to pause and breathe.',
      mediaUrls: [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600'
      ],
      createdAt: '1 hour ago',
      likes: ['Alex Chen (陈博)', 'Wei Zhang (张伟)', 'Sophia Liu (刘雅)'],
      comments: [
        { id: 'c1', authorName: 'Alex Chen', text: 'Stunning view! 👏' },
        { id: 'c2', authorName: 'Wei Zhang', text: 'Have a great evening!' }
      ]
    },
    {
      id: 'post_2',
      authorId: 'user_sophia',
      authorName: 'Sophia Liu (刘雅)',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      content: 'Exploring the new artisanal bakery in downtown. The matcha croissant is definitely worth the hype! 🥐🍵',
      mediaUrls: [
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'
      ],
      createdAt: '3 hours ago',
      likes: ['Alex Chen (陈博)'],
      comments: []
    }
  ]);

  const [activeCall, setActiveCall] = useState<CallState | null>(null);

  // Call timer simulation
  useEffect(() => {
    let interval: any = null;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  const sendMessage = (convId: string, content: string, type: 'TEXT' | 'IMAGE' | 'VOICE' = 'TEXT', meta?: any) => {
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      conversationId: convId,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      isMe: true,
      content,
      type,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: meta
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

    // Update conversation preview
    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessageText: type === 'VOICE' ? '🎤 Voice message' : type === 'IMAGE' ? '📷 [Photo]' : content,
            lastMessageAt: 'Just now'
          };
        }
        return c;
      })
    );

    // Simulated buddy echo response after 1.5s for lively interaction
    setTimeout(() => {
      const buddyAnswers = [
        'Got it! Looking great on mobile 👍',
        'Haha totally agree! 😄',
        'Awesome, testing with you right now!',
        'Super smooth WeChat style animations!',
        'Checked! Let us do a video call in a minute.'
      ];
      const randomText = buddyAnswers[Math.floor(Math.random() * buddyAnswers.length)];
      const targetConv = conversations.find(c => c.id === convId);
      if (!targetConv || targetConv.isGroup) return;

      const replyMsg: ChatMessage = {
        id: 'reply_' + Date.now(),
        conversationId: convId,
        senderId: targetConv.partnerId,
        senderName: targetConv.title,
        senderAvatar: targetConv.avatarUrl,
        isMe: false,
        content: randomText,
        type: 'TEXT',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(p => ({
        ...p,
        [convId]: [...(p[convId] || []), replyMsg]
      }));

      setConversations(prev =>
        prev.map(c =>
          c.id === convId ? { ...c, lastMessageText: randomText, lastMessageAt: 'Just now' } : c
        )
      );
    }, 1500);
  };

  const sendRedPacket = (convId: string, amountYuan: number, greeting: string) => {
    const amountCents = Math.round(amountYuan * 100);
    if (walletBalance < amountCents) {
      alert('Insufficient wallet balance! Please top up first.');
      return;
    }

    // Deduct wallet
    setWalletBalance(prev => prev - amountCents);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `🧧 Sent Red Packet (${greeting})`,
        amountFormatted: `-¥${amountYuan.toFixed(2)}`,
        isPositive: false,
        type: 'RED_PACKET_SENT',
        date: 'Just now'
      },
      ...prev
    ]);

    // Send Red Packet Message
    const newMsg: ChatMessage = {
      id: 'msg_rp_' + Date.now(),
      conversationId: convId,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      isMe: true,
      content: '🧧 WeChat Red Packet',
      type: 'RED_PACKET',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        amountCents,
        greeting: greeting || 'Gong Xi Fa Cai! 🧧',
        isClaimed: false
      }
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

    setConversations(prev =>
      prev.map(c =>
        c.id === convId
          ? { ...c, lastMessageText: `🧧 [Red Packet] ${greeting || 'Best Wishes'}`, lastMessageAt: 'Just now' }
          : c
      )
    );
  };

  const claimRedPacket = (convId: string, messageId: string) => {
    const convMsgs = messages[convId] || [];
    const msg = convMsgs.find(m => m.id === messageId);
    if (!msg || !msg.metadata || msg.metadata.isClaimed) return;

    const claimedCents = msg.metadata.amountCents || 8888;
    setWalletBalance(prev => prev + claimedCents);

    // Update message state
    setMessages(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).map(m =>
        m.id === messageId
          ? {
              ...m,
              metadata: {
                ...m.metadata,
                isClaimed: true,
                claimedBy: user.displayName
              }
            }
          : m
      )
    }));

    // Record transaction
    const yuanStr = (claimedCents / 100).toFixed(2);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `🧧 Claimed Red Packet from ${msg.senderName}`,
        amountFormatted: `+¥${yuanStr}`,
        isPositive: true,
        type: 'RED_PACKET_CLAIMED',
        date: 'Just now'
      },
      ...prev
    ]);
  };

  const sendTransfer = (convId: string, amountYuan: number, note: string) => {
    const amountCents = Math.round(amountYuan * 100);
    if (walletBalance < amountCents) {
      alert('Insufficient wallet balance!');
      return;
    }

    setWalletBalance(prev => prev - amountCents);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `💸 WeChat Transfer: ${note || 'Direct Transfer'}`,
        amountFormatted: `-¥${amountYuan.toFixed(2)}`,
        isPositive: false,
        type: 'TRANSFER_SENT',
        date: 'Just now'
      },
      ...prev
    ]);

    const newMsg: ChatMessage = {
      id: 'msg_tr_' + Date.now(),
      conversationId: convId,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      isMe: true,
      content: `💸 WeChat Transfer: ¥${amountYuan.toFixed(2)}`,
      type: 'TRANSFER',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        amountCents,
        note
      }
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));
  };

  const topUpWallet = (amountYuan: number) => {
    const amountCents = Math.round(amountYuan * 100);
    setWalletBalance(prev => prev + amountCents);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: '💳 Bank Card Top-Up Successful',
        amountFormatted: `+¥${amountYuan.toFixed(2)}`,
        isPositive: true,
        type: 'TOP_UP',
        date: 'Just now'
      },
      ...prev
    ]);
  };

  const postMoment = (content: string, imageUrl?: string) => {
    const newMoment: MomentPost = {
      id: 'moment_' + Date.now(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      content,
      mediaUrls: imageUrl ? [imageUrl] : [],
      createdAt: 'Just now',
      likes: [],
      comments: []
    };
    setMoments(prev => [newMoment, ...prev]);
  };

  const likeMoment = (momentId: string) => {
    setMoments(prev =>
      prev.map(m => {
        if (m.id === momentId) {
          const isLiked = m.likes.includes(user.displayName);
          return {
            ...m,
            likes: isLiked ? m.likes.filter(name => name !== user.displayName) : [...m.likes, user.displayName]
          };
        }
        return m;
      })
    );
  };

  const addMomentComment = (momentId: string, text: string) => {
    if (!text.trim()) return;
    setMoments(prev =>
      prev.map(m => {
        if (m.id === momentId) {
          return {
            ...m,
            comments: [
              ...m.comments,
              { id: 'c_' + Date.now(), authorName: user.displayName, text: text.trim() }
            ]
          };
        }
        return m;
      })
    );
  };

  const addFriendByUsernameOrQR = (identifier: string): boolean => {
    const found = friends.find(f => f.username.toLowerCase() === identifier.toLowerCase());
    if (found) return true;

    // Create new friend dynamically
    const newFriend: Contact = {
      id: 'friend_' + Date.now(),
      displayName: identifier.includes('@') ? identifier.split('@')[0] : identifier,
      username: identifier.toLowerCase().replace(/\s+/g, '_'),
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160',
      region: 'Shanghai, China',
      signature: 'Added via WeChat QR Code scan 📱'
    };

    setFriends(prev => [newFriend, ...prev]);

    // Create a new conversation
    const newConv: Conversation = {
      id: 'conv_' + newFriend.id,
      title: newFriend.displayName,
      avatarUrl: newFriend.avatarUrl,
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'You are now friends on OmniChat. Say hi! 👋',
      lastMessageAt: 'Just now',
      partnerId: newFriend.id
    };

    setConversations(prev => [newConv, ...prev]);
    return true;
  };

  const acceptFriendRequest = (reqId: string) => {
    const req = friendRequests.find(r => r.id === reqId);
    if (!req) return;

    setFriendRequests(prev => prev.filter(r => r.id !== reqId));

    const newFriend: Contact = {
      id: req.senderId,
      displayName: req.senderName,
      username: req.senderName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      avatarUrl: req.senderAvatar,
      region: 'Guangzhou, China',
      signature: 'Friend request accepted! 🎉'
    };

    setFriends(prev => [newFriend, ...prev]);

    const newConv: Conversation = {
      id: 'conv_' + req.senderId,
      title: req.senderName,
      avatarUrl: req.senderAvatar,
      isGroup: false,
      isPinned: false,
      unreadCount: 1,
      lastMessageText: 'I accepted your friend request. Let us chat! 🎉',
      lastMessageAt: 'Just now',
      partnerId: req.senderId
    };

    setConversations(prev => [newConv, ...prev]);
  };

  const startCall = (targetName: string, targetAvatar: string, type: 'audio' | 'video') => {
    setActiveCall({
      targetName,
      targetAvatar,
      type,
      status: 'calling',
      durationSeconds: 0
    });

    // Automatically simulate connection after 2 seconds
    setTimeout(() => {
      setActiveCall(prev => (prev ? { ...prev, status: 'connected' } : null));
    }, 2000);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const walletBalanceFormatted = (walletBalance / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <AppContext.Provider
      value={{
        user,
        conversations,
        messages,
        friends,
        friendRequests,
        walletBalance,
        walletBalanceFormatted,
        walletTransactions,
        moments,
        activeCall,
        serverUrl,
        sendMessage,
        sendRedPacket,
        claimRedPacket,
        sendTransfer,
        topUpWallet,
        postMoment,
        likeMoment,
        addMomentComment,
        addFriendByUsernameOrQR,
        acceptFriendRequest,
        startCall,
        endCall
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
