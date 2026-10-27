import React, { createContext, useContext, useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  upiId: string;
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
    amountRupees?: number;
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
  upiId: string;
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
  sendRedPacket: (convId: string, amountRupees: number, greeting: string) => void;
  claimRedPacket: (convId: string, messageId: string) => void;
  sendTransfer: (convId: string, amountRupees: number, note: string) => void;
  topUpWallet: (amountRupees: number) => void;
  postMoment: (content: string, imageUrl?: string) => void;
  likeMoment: (momentId: string) => void;
  addMomentComment: (momentId: string, text: string) => void;
  addFriendByUsernameOrQR: (identifier: string) => boolean;
  acceptFriendRequest: (reqId: string) => void;
  startCall: (targetName: string, targetAvatar: string, type: 'audio' | 'video') => void;
  endCall: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

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
    id: 'user_aarav',
    displayName: 'Aarav Sharma',
    username: 'aarav_sharma',
    upiId: 'aarav@omnichat',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    region: 'Bengaluru, Karnataka',
    bio: 'Software Architect building Indian SuperApps 🇮🇳 🚀',
    phone: '+91 98765 43210'
  });

  const [walletBalance, setWalletBalance] = useState<number>(245000); // In paise => ₹2,450.00

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_1',
      title: '🎁 Received Shagun Gift Envelope',
      amountFormatted: '+₹501.00',
      isPositive: true,
      type: 'GIFT_ENVELOPE',
      date: 'Today 14:20'
    },
    {
      id: 'tx_2',
      title: '☕ Filter Coffee & Dosa via Mini Program',
      amountFormatted: '-₹180.00',
      isPositive: false,
      type: 'MINI_APP_PURCHASE',
      date: 'Today 10:15'
    },
    {
      id: 'tx_3',
      title: '💳 UPI Bank Account Top-Up (HDFC Bank)',
      amountFormatted: '+₹2,000.00',
      isPositive: true,
      type: 'TOP_UP',
      date: 'Yesterday 18:30'
    },
    {
      id: 'tx_4',
      title: '🚖 OmniRide Cab Booking',
      amountFormatted: '-₹340.00',
      isPositive: false,
      type: 'RIDE_PAY',
      date: 'Oct 25 21:05'
    }
  ]);

  const [friends, setFriends] = useState<Contact[]>([
    {
      id: 'user_priya',
      displayName: 'Priya Patel',
      username: 'priya_p',
      upiId: 'priya@okhdfcbank',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      region: 'Mumbai, Maharashtra',
      signature: 'Life is too short for bad chai ☕✨',
      phone: '+91 98200 11223'
    },
    {
      id: 'user_rohan',
      displayName: 'Rohan Verma',
      username: 'rohan_v',
      upiId: 'rohan@okaxis',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      region: 'New Delhi',
      signature: 'Tech, Cricket & Code 🏏💻',
      phone: '+91 98111 22334'
    },
    {
      id: 'user_neha',
      displayName: 'Neha Gupta',
      username: 'neha_g',
      upiId: 'neha@icici',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      region: 'Hyderabad, Telangana',
      signature: 'Biryani lover and UI Designer 🎨🍛',
      phone: '+91 99887 76655'
    },
    {
      id: 'user_vikram',
      displayName: 'Vikram Singh',
      username: 'vikram_s',
      upiId: 'vikram@sbi',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
      region: 'Jaipur, Rajasthan',
      signature: 'Exploring India one road trip at a time 🚗',
      phone: '+91 97654 32100'
    }
  ]);

  const [friendRequests, setFriendRequests] = useState<any[]>([
    {
      id: 'req_1',
      senderId: 'user_ananya',
      senderName: 'Ananya Sharma',
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160',
      message: 'Hi Aarav! Scanned your OmniChat QR at the Bengaluru Tech Summit.',
      time: '15 mins ago'
    }
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_priya',
      title: 'Priya Patel',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      isGroup: false,
      isPinned: true,
      unreadCount: 0,
      lastMessageText: '🎁 [Gift Envelope] Best Wishes & Good Luck!',
      lastMessageAt: '14:20',
      partnerId: 'user_priya'
    },
    {
      id: 'conv_rohan',
      title: 'Rohan Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      isGroup: false,
      isPinned: false,
      unreadCount: 1,
      lastMessageText: 'Are you coming for the cricket match screening?',
      lastMessageAt: '12:45',
      partnerId: 'user_rohan'
    },
    {
      id: 'conv_group',
      title: 'Indian SuperApp Builders 🇮🇳',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160',
      isGroup: true,
      isPinned: false,
      unreadCount: 3,
      lastMessageText: 'Neha: Tested the UPI QR code payments in Expo Go!',
      lastMessageAt: '11:10',
      partnerId: 'group_core'
    },
    {
      id: 'conv_neha',
      title: 'Neha Gupta',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'Will share the design mockups in 10 mins.',
      lastMessageAt: 'Yesterday',
      partnerId: 'user_neha'
    }
  ]);

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    conv_priya: [
      {
        id: 'msg_p1',
        conversationId: 'conv_priya',
        senderId: 'user_priya',
        senderName: 'Priya Patel',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: 'Hi Aarav! How is the new OmniChat mobile build working on Expo Go?',
        type: 'TEXT',
        createdAt: '14:15'
      },
      {
        id: 'msg_p2',
        conversationId: 'conv_priya',
        senderId: 'user_aarav',
        senderName: 'Aarav Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        isMe: true,
        content: 'It works seamlessly! Clean English UI, UPI payments, voice notes, and calls are running on SDK 57!',
        type: 'TEXT',
        createdAt: '14:17'
      },
      {
        id: 'msg_p3',
        conversationId: 'conv_priya',
        senderId: 'user_priya',
        senderName: 'Priya Patel',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: '🎁 Shagun Gift Envelope',
        type: 'RED_PACKET',
        createdAt: '14:20',
        metadata: {
          amountRupees: 501,
          greeting: 'Best Wishes & Great Success! 🎁✨',
          isClaimed: false
        }
      }
    ],
    conv_rohan: [
      {
        id: 'msg_r1',
        conversationId: 'conv_rohan',
        senderId: 'user_rohan',
        senderName: 'Rohan Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
        isMe: false,
        content: 'Are you coming for the cricket match screening?',
        type: 'TEXT',
        createdAt: '12:45'
      }
    ],
    conv_group: [
      {
        id: 'msg_g1',
        conversationId: 'conv_group',
        senderId: 'user_neha',
        senderName: 'Neha Gupta',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
        isMe: false,
        content: 'Tested the UPI QR code payments in Expo Go!',
        type: 'TEXT',
        createdAt: '11:10'
      }
    ],
    conv_neha: [
      {
        id: 'msg_n1',
        conversationId: 'conv_neha',
        senderId: 'user_neha',
        senderName: 'Neha Gupta',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
        isMe: false,
        content: 'Will share the design mockups in 10 mins.',
        type: 'TEXT',
        createdAt: 'Yesterday'
      }
    ]
  });

  const [moments, setMoments] = useState<MomentPost[]>([
    {
      id: 'post_1',
      authorId: 'user_priya',
      authorName: 'Priya Patel',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      content: 'Chilly morning walk at Marine Drive, Mumbai! 🌊 The sea breeze here is unmatched.',
      mediaUrls: [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600'
      ],
      createdAt: '1 hour ago',
      likes: ['Aarav Sharma', 'Rohan Verma', 'Neha Gupta'],
      comments: [
        { id: 'c1', authorName: 'Aarav Sharma', text: 'Stunning view of Mumbai! 👏' },
        { id: 'c2', authorName: 'Rohan Verma', text: 'Enjoy your morning!' }
      ]
    },
    {
      id: 'post_2',
      authorId: 'user_neha',
      authorName: 'Neha Gupta',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      content: 'Authentic Hyderabadi Dum Biryani with the team today! Weekend vibes starting early 🍛✨',
      mediaUrls: [
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600'
      ],
      createdAt: '3 hours ago',
      likes: ['Aarav Sharma'],
      comments: []
    }
  ]);

  const [activeCall, setActiveCall] = useState<CallState | null>(null);

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

    setTimeout(() => {
      const buddyAnswers = [
        'Got it! Looking super clean and fast 👍',
        'Haha totally agree! Great work 😄',
        'Awesome, testing UPI and chats with you right now!',
        'Love the new Indian English interface!',
        'Checked! Let us do a quick call in a minute.'
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

  const sendRedPacket = (convId: string, amountRupees: number, greeting: string) => {
    const amountPaise = Math.round(amountRupees * 100);
    if (walletBalance < amountPaise) {
      alert('Insufficient wallet balance! Please top up via UPI.');
      return;
    }

    setWalletBalance(prev => prev - amountPaise);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `🎁 Sent Gift Envelope (${greeting})`,
        amountFormatted: `-₹${amountRupees.toFixed(2)}`,
        isPositive: false,
        type: 'GIFT_SENT',
        date: 'Just now'
      },
      ...prev
    ]);

    const newMsg: ChatMessage = {
      id: 'msg_rp_' + Date.now(),
      conversationId: convId,
      senderId: user.id,
      senderName: user.displayName,
      senderAvatar: user.avatarUrl,
      isMe: true,
      content: '🎁 Shagun Gift Envelope',
      type: 'RED_PACKET',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        amountRupees,
        greeting: greeting || 'Best Wishes & Good Luck! 🎁',
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
          ? { ...c, lastMessageText: `🎁 [Gift Envelope] ${greeting || 'Best Wishes'}`, lastMessageAt: 'Just now' }
          : c
      )
    );
  };

  const claimRedPacket = (convId: string, messageId: string) => {
    const convMsgs = messages[convId] || [];
    const msg = convMsgs.find(m => m.id === messageId);
    if (!msg || !msg.metadata || msg.metadata.isClaimed) return;

    const claimedRupees = msg.metadata.amountRupees || 501;
    const claimedPaise = Math.round(claimedRupees * 100);
    setWalletBalance(prev => prev + claimedPaise);

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

    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `🎁 Claimed Gift Envelope from ${msg.senderName}`,
        amountFormatted: `+₹${claimedRupees.toFixed(2)}`,
        isPositive: true,
        type: 'GIFT_CLAIMED',
        date: 'Just now'
      },
      ...prev
    ]);
  };

  const sendTransfer = (convId: string, amountRupees: number, note: string) => {
    const amountPaise = Math.round(amountRupees * 100);
    if (walletBalance < amountPaise) {
      alert('Insufficient wallet balance!');
      return;
    }

    setWalletBalance(prev => prev - amountPaise);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `💸 UPI Transfer: ${note || 'Direct Payment'}`,
        amountFormatted: `-₹${amountRupees.toFixed(2)}`,
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
      content: `💸 UPI Transfer: ₹${amountRupees.toFixed(2)}`,
      type: 'TRANSFER',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        amountRupees,
        note
      }
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));
  };

  const topUpWallet = (amountRupees: number) => {
    const amountPaise = Math.round(amountRupees * 100);
    setWalletBalance(prev => prev + amountPaise);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: '💳 UPI Top-Up Successful',
        amountFormatted: `+₹${amountRupees.toFixed(2)}`,
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

    const cleanName = identifier.includes('@') ? identifier.split('@')[0] : identifier;
    const newFriend: Contact = {
      id: 'friend_' + Date.now(),
      displayName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      username: cleanName.toLowerCase().replace(/\s+/g, '_'),
      upiId: `${cleanName.toLowerCase()}@omnichat`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160',
      region: 'Bengaluru, Karnataka',
      signature: 'Added via OmniChat QR Code Scan 📱'
    };

    setFriends(prev => [newFriend, ...prev]);

    const newConv: Conversation = {
      id: 'conv_' + newFriend.id,
      title: newFriend.displayName,
      avatarUrl: newFriend.avatarUrl,
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'Connected on OmniChat. Say hello! 👋',
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

    const cleanUsername = req.senderName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newFriend: Contact = {
      id: req.senderId,
      displayName: req.senderName,
      username: cleanUsername,
      upiId: `${cleanUsername}@omnichat`,
      avatarUrl: req.senderAvatar,
      region: 'Delhi NCR',
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
      lastMessageText: 'Accepted your friend request. Lets chat! 🎉',
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

    setTimeout(() => {
      setActiveCall(prev => (prev ? { ...prev, status: 'connected' } : null));
    }, 2000);
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const walletBalanceFormatted = (walletBalance / 100).toLocaleString('en-IN', {
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
