import React, { createContext, useContext, useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from '../services/api';
import { Language, translations } from '../localization/i18n';

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  upiId: string;
  avatarUrl: string;
  region: string;
  bio: string;
  phone: string;
  email?: string;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isMe: boolean;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'VOICE' | 'DOCUMENT' | 'RED_PACKET' | 'TRANSFER';
  createdAt: string;
  reactions?: Record<string, string[]>; // emoji -> array of user names
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  metadata?: {
    amountRupees?: number;
    greeting?: string;
    isClaimed?: boolean;
    claimedBy?: string;
    voiceDuration?: number;
    imageUrl?: string;
    fileName?: string;
    fileSize?: string;
    note?: string;
    upiReference?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  avatarUrl: string;
  isGroup: boolean;
  isPinned: boolean;
  isMuted?: boolean;
  unreadCount: number;
  lastMessageText: string;
  lastMessageAt: string;
  partnerId: string;
  memberCount?: number;
  isOnline?: boolean;
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
  isOnline?: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  message: string;
  time: string;
}

export interface MomentPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  mediaUrls: string[];
  locationName?: string;
  createdAt: string;
  likes: string[];
  comments: { id: string; authorName: string; text: string; time?: string }[];
}

export interface WalletTransaction {
  id: string;
  title: string;
  amountFormatted: string;
  isPositive: boolean;
  type: string;
  date: string;
  refId?: string;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface CallRecord {
  id: string;
  targetName: string;
  targetAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  time: string;
  duration?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'MESSAGE' | 'FRIEND_REQUEST' | 'SHAGUN' | 'MOMENT_LIKE' | 'SYSTEM';
  time: string;
  isRead: boolean;
  actionUrl?: string;
}

interface CallState {
  targetName: string;
  targetAvatar: string;
  type: 'audio' | 'video';
  status: 'calling' | 'connected';
  durationSeconds: number;
  isMuted?: boolean;
  isCameraOff?: boolean;
}

interface AppContextType {
  // Auth & Onboarding
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  user: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  signupWithPhone: (phone: string, displayName: string, username: string, avatarUrl?: string) => Promise<boolean>;
  logout: () => void;

  // Localization & Theme
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Chats & Messages
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  sendMessage: (
    convId: string,
    content: string,
    type?: 'TEXT' | 'IMAGE' | 'VOICE' | 'DOCUMENT' | 'TRANSFER' | 'RED_PACKET',
    meta?: any,
    replyTo?: any
  ) => void;
  deleteMessage: (convId: string, messageId: string) => void;
  reactToMessage: (convId: string, messageId: string, emoji: string) => void;
  togglePinConversation: (convId: string) => void;
  toggleMuteConversation: (convId: string) => void;
  createGroupChat: (title: string, memberIds: string[]) => string;

  // Shagun Envelopes & Payments
  sendRedPacket: (convId: string, amountRupees: number, greeting: string) => void;
  claimRedPacket: (convId: string, messageId: string) => void;
  sendTransfer: (convId: string, amountRupees: number, note: string) => void;
  topUpWallet: (amountRupees: number) => void;
  walletBalance: number;
  walletBalanceFormatted: string;
  walletTransactions: WalletTransaction[];

  // Contacts & Requests
  friends: Contact[];
  friendRequests: FriendRequest[];
  blockedUsers: Contact[];
  addFriendByUsernameOrQR: (identifier: string) => boolean;
  sendFriendRequestToUser: (recipientId: string, note?: string) => Promise<boolean>;
  acceptFriendRequest: (reqId: string) => void;
  rejectFriendRequest: (reqId: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;

  // Moments
  moments: MomentPost[];
  postMoment: (content: string, imageUrl?: string, locationName?: string) => void;
  likeMoment: (momentId: string) => void;
  addMomentComment: (momentId: string, text: string) => void;
  deleteMoment: (momentId: string) => void;

  // Calling
  activeCall: CallState | null;
  startCall: (targetName: string, targetAvatar: string, type: 'audio' | 'video') => void;
  endCall: () => void;
  toggleMuteMic: () => void;
  toggleCamera: () => void;
  callHistory: CallRecord[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Server host
  serverUrl: string;
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

  // Onboarding & Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Localization & Theme
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const t = translations[language];

  // User Profile matching ChatIndia Reference Image (Screen 06 & 12: Rohan Sharma @rohan)
  const [user, setUser] = useState<UserProfile>({
    id: 'user_rohan',
    displayName: 'Rohan Sharma',
    username: 'rohan',
    upiId: 'rohan@chatindia',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240',
    region: 'New Delhi, India',
    bio: 'Digital India Innovator • Building ChatIndia 🇮🇳',
    phone: '+91 98765 43210',
    email: 'rohan@chatindia.app',
    isOnline: true
  });

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...updates,
      upiId: updates.username ? `${updates.username.replace('@', '')}@chatindia` : prev.upiId
    }));
  };

  // Wallet State (stored in Paise: 248000 paise = ₹2,480.00 as shown on Screen 17)
  const [walletBalance, setWalletBalance] = useState<number>(248000);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: 'tx_1',
      title: 'Riya Sharma',
      amountFormatted: '+₹500.00',
      isPositive: true,
      type: 'RECEIVED',
      date: 'Today 10:15 AM',
      refId: 'UPI/CHATINDIA/92847291',
      status: 'SUCCESS'
    },
    {
      id: 'tx_2',
      title: 'Mobile Recharge',
      amountFormatted: '-₹199.00',
      isPositive: false,
      type: 'RECHARGE',
      date: 'Yesterday 8:20 PM',
      refId: 'UPI/BBPS/83719284',
      status: 'SUCCESS'
    },
    {
      id: 'tx_3',
      title: 'Food Order',
      amountFormatted: '-₹320.00',
      isPositive: false,
      type: 'FOOD',
      date: '12 Oct 2024',
      refId: 'UPI/ZOMATO/72819402',
      status: 'SUCCESS'
    },
    {
      id: 'tx_4',
      title: 'UPI Top-Up via HDFC Bank',
      amountFormatted: '+₹2,000.00',
      isPositive: true,
      type: 'TOP_UP',
      date: '10 Oct 2024',
      refId: 'UPI/HDFC/61928374',
      status: 'SUCCESS'
    }
  ]);

  // Friends & Contacts matching Screen 12/13
  const [friends, setFriends] = useState<Contact[]>([
    {
      id: 'user_riya',
      displayName: 'Riya Sharma',
      username: 'riya_s',
      upiId: 'riya@okhdfcbank',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      region: 'New Delhi, India',
      signature: 'Never lonely. Living every moment! ✨',
      phone: '+91 98765 11223',
      isOnline: true
    },
    {
      id: 'user_amit',
      displayName: 'Amit Verma',
      username: 'amit_v',
      upiId: 'amit@okaxis',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      region: 'New Delhi, India',
      signature: 'Tech, Cricket & Code 🏏💻',
      phone: '+91 98111 22334',
      isOnline: true
    },
    {
      id: 'user_neha_singh',
      displayName: 'Neha Singh',
      username: 'neha_s',
      upiId: 'neha@icici',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      region: 'Mumbai, Maharashtra',
      signature: 'Sunsets, photography & chai 📸🌅',
      phone: '+91 99887 76655',
      isOnline: true
    },
    {
      id: 'user_rahul',
      displayName: 'Rahul Kumar',
      username: 'rahul_k',
      upiId: 'rahul@sbi',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
      region: 'Bengaluru, Karnataka',
      signature: 'Exploring Karnataka by bike 🚴‍♂️',
      phone: '+91 97654 32100',
      isOnline: false
    },
    {
      id: 'user_pooja',
      displayName: 'Pooja Patel',
      username: 'pooja_p',
      upiId: 'pooja@kotak',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      region: 'Ahmedabad, Gujarat',
      signature: 'Design & Culture enthusiast 🎨',
      phone: '+91 98234 56789',
      isOnline: true
    },
    {
      id: 'user_sahil',
      displayName: 'Sahil Khan',
      username: 'sahil_k',
      upiId: 'sahil@paytm',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160',
      region: 'Hyderabad, Telangana',
      signature: 'Foodie & Mobile Architect ☕',
      phone: '+91 96543 21098',
      isOnline: true
    }
  ]);

  // Friend Requests (3 requests as shown in Screen 12/13 badge)
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    {
      id: 'req_1',
      senderId: 'user_amit',
      senderName: 'Amit Verma',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      message: 'Hi Rohan! Scanned your ChatIndia QR at the expo.',
      time: '10 mins ago'
    },
    {
      id: 'req_2',
      senderId: 'user_neha_singh',
      senderName: 'Neha Singh',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      message: 'Hey Rohan, loved your latest post on Moments! Let us connect.',
      time: '1 hour ago'
    },
    {
      id: 'req_3',
      senderId: 'user_pooja',
      senderName: 'Pooja Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160',
      message: 'Hello! Joining ChatIndia community.',
      time: '2 hours ago'
    }
  ]);

  const [blockedUsers, setBlockedUsers] = useState<Contact[]>([]);

  // Conversations matching Screen 09 (Chats Home)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_riya',
      title: 'Riya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      isGroup: false,
      isPinned: true,
      unreadCount: 2,
      lastMessageText: 'Planning for the weekend?',
      lastMessageAt: '9:45 AM',
      partnerId: 'user_riya',
      isOnline: true
    },
    {
      id: 'conv_family',
      title: 'Family Group',
      avatarUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=160',
      isGroup: true,
      isPinned: true,
      unreadCount: 0,
      lastMessageText: 'Mom: Take care beta',
      lastMessageAt: '9:12 AM',
      partnerId: 'group_family',
      memberCount: 5
    },
    {
      id: 'conv_office',
      title: 'Office Team',
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160',
      isGroup: true,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'Project update meeting',
      lastMessageAt: '8:21 AM',
      partnerId: 'group_office',
      memberCount: 12
    },
    {
      id: 'conv_rahul',
      title: 'Rahul Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'sent a photo 📷',
      lastMessageAt: '7:56 AM',
      partnerId: 'user_rahul',
      isOnline: false
    },
    {
      id: 'conv_travel',
      title: 'Travel Buddies',
      avatarUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=160',
      isGroup: true,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: "Let's plan!",
      lastMessageAt: '7:32 AM',
      partnerId: 'group_travel',
      memberCount: 6
    }
  ]);

  // Messages matching Screen 08 (Chat Screen with Riya Sharma)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    conv_riya: [
      {
        id: 'msg_r1',
        conversationId: 'conv_riya',
        senderId: 'user_riya',
        senderName: 'Riya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: "I'm good! What about you?",
        type: 'TEXT',
        createdAt: '9:40 AM'
      },
      {
        id: 'msg_r2',
        conversationId: 'conv_riya',
        senderId: 'user_rohan',
        senderName: 'Rohan Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240',
        isMe: true,
        content: 'All good! Planning for the weekend?',
        type: 'TEXT',
        createdAt: '9:42 AM'
      },
      {
        id: 'msg_r3',
        conversationId: 'conv_riya',
        senderId: 'user_rohan',
        senderName: 'Rohan Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240',
        isMe: true,
        content: "How's this place? :)",
        type: 'IMAGE',
        createdAt: '9:43 AM',
        metadata: {
          imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
        }
      },
      {
        id: 'msg_r4',
        conversationId: 'conv_riya',
        senderId: 'user_riya',
        senderName: 'Riya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: "Never lonely. I'm with you! 😊 Let's do it!",
        type: 'TEXT',
        createdAt: '9:45 AM'
      },
      {
        id: 'msg_r5',
        conversationId: 'conv_riya',
        senderId: 'user_riya',
        senderName: 'Riya Sharma',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
        isMe: false,
        content: '🎁 Shagun Gift Envelope',
        type: 'RED_PACKET',
        createdAt: '9:46 AM',
        metadata: {
          amountRupees: 500,
          greeting: 'Weekend treat from me! 🎁✨',
          isClaimed: true
        }
      }
    ],
    conv_family: [
      {
        id: 'msg_f1',
        conversationId: 'conv_family',
        senderId: 'user_mom',
        senderName: 'Mom',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160',
        isMe: false,
        content: 'Take care beta, remember to eat your lunch on time.',
        type: 'TEXT',
        createdAt: '9:12 AM'
      }
    ],
    conv_office: [
      {
        id: 'msg_o1',
        conversationId: 'conv_office',
        senderId: 'user_boss',
        senderName: 'Team Lead',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
        isMe: false,
        content: 'Project update meeting scheduled for 11:30 AM.',
        type: 'TEXT',
        createdAt: '8:21 AM'
      }
    ],
    conv_rahul: [
      {
        id: 'msg_rh1',
        conversationId: 'conv_rahul',
        senderId: 'user_rahul',
        senderName: 'Rahul Verma',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160',
        isMe: false,
        content: 'Sent a photo 📷',
        type: 'IMAGE',
        createdAt: '7:56 AM',
        metadata: {
          imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
        }
      }
    ],
    conv_travel: [
      {
        id: 'msg_t1',
        conversationId: 'conv_travel',
        senderId: 'user_traveler',
        senderName: 'Sameer',
        senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160',
        isMe: false,
        content: "Let's plan our trip to Spiti Valley next month!",
        type: 'TEXT',
        createdAt: '7:32 AM'
      }
    ]
  });

  // Moments Feed matching Screen 15 (Moments / Social Feed: Neha Singh "Beautiful evening ❤️", 24 likes, 8 comments)
  const [moments, setMoments] = useState<MomentPost[]>([
    {
      id: 'post_1',
      authorId: 'user_neha_singh',
      authorName: 'Neha Singh',
      authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160',
      content: 'Beautiful evening ❤️',
      mediaUrls: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
      locationName: 'Pichola Lake, Udaipur',
      createdAt: '2 hours ago',
      likes: ['Rohan Sharma', 'Riya Sharma', 'Amit Verma', 'Rahul Kumar', 'Pooja Patel', 'Sahil Khan', 'Aarav Sharma', 'Priya Patel', 'Vikram Singh', 'Ananya Sharma', 'Sunil Dutt', 'Kavita Rao', 'Meera Nair', 'Aditya Roy', 'Nisha Sen', 'Karan Johar', 'Tina Roy', 'Deepak Verma', 'Sanjay Kumar', 'Geeta Rani', 'Harsh Vardhan', 'Shalini Jain', 'Vikas Oberoi', 'Divya Khurana'],
      comments: [
        { id: 'c1', authorName: 'Rohan Sharma', text: 'Stunning sunset colors! 🌅' },
        { id: 'c2', authorName: 'Riya Sharma', text: 'Udaipur is so magical during this season ✨' },
        { id: 'c3', authorName: 'Amit Verma', text: 'Great capture Neha!' },
        { id: 'c4', authorName: 'Rahul Kumar', text: 'Which camera was this taken with?' },
        { id: 'c5', authorName: 'Pooja Patel', text: 'Adding this to my travel bucket list!' },
        { id: 'c6', authorName: 'Sahil Khan', text: 'Breathtaking reflection on the water' },
        { id: 'c7', authorName: 'Vikram Singh', text: 'Pure tranquility 🧘' },
        { id: 'c8', authorName: 'Ananya Sharma', text: 'Enjoy your vacation!' }
      ]
    },
    {
      id: 'post_2',
      authorId: 'user_riya',
      authorName: 'Riya Sharma',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      content: 'Chilly morning walk and hot filter coffee! ☕✨ Perfect start to the day.',
      mediaUrls: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'],
      locationName: 'Lodhi Garden, New Delhi',
      createdAt: '4 hours ago',
      likes: ['Rohan Sharma', 'Amit Verma', 'Neha Singh'],
      comments: [
        { id: 'c9', authorName: 'Rohan Sharma', text: 'Nothing beats morning coffee ☕' }
      ]
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: '🎁 Shagun Received',
      body: 'Priya Patel sent you a ₹501 Shagun envelope in Chat.',
      type: 'SHAGUN',
      time: '14:20',
      isRead: false
    },
    {
      id: 'notif_2',
      title: '👋 New Friend Request',
      body: 'Ananya Sharma scanned your ChatIndia QR and wants to connect.',
      type: 'FRIEND_REQUEST',
      time: '15 mins ago',
      isRead: false
    },
    {
      id: 'notif_3',
      title: '❤️ Moment Liked',
      body: 'Rohan Verma liked your photo at Nandi Hills.',
      type: 'MOMENT_LIKE',
      time: '2 hours ago',
      isRead: true
    }
  ]);

  // Calling State matching Screen 10 (Voice & Video Call with Riya Sharma)
  const [activeCall, setActiveCall] = useState<CallState | null>(null);
  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: 'call_1',
      targetName: 'Riya Sharma',
      targetAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      type: 'audio',
      direction: 'incoming',
      time: 'Today 09:24 AM',
      duration: '0m 24s'
    },
    {
      id: 'call_2',
      targetName: 'Riya Sharma',
      targetAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160',
      type: 'video',
      direction: 'outgoing',
      time: 'Yesterday 17:45',
      duration: '4m 32s'
    },
    {
      id: 'call_3',
      targetName: 'Amit Verma',
      targetAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160',
      type: 'audio',
      direction: 'outgoing',
      time: 'Yesterday 12:15',
      duration: '1m 15s'
    }
  ]);

  useEffect(() => {
    let interval: any = null;
    if (activeCall && activeCall.status === 'connected') {
      interval = setInterval(() => {
        setActiveCall(prev => (prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall?.status]);

  // --- Auth Handlers ---
  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    // In production, calls api.verifyOtpAndLogin
    setIsAuthenticated(true);
    return true;
  };

  const signupWithPhone = async (
    phone: string,
    displayName: string,
    username: string,
    avatarUrl?: string
  ): Promise<boolean> => {
    setUser(prev => ({
      ...prev,
      phone,
      displayName,
      username,
      upiId: `${username}@chatindia`,
      avatarUrl: avatarUrl || prev.avatarUrl
    }));
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // --- Chat Handlers ---
  const sendMessage = (
    convId: string,
    content: string,
    type: 'TEXT' | 'IMAGE' | 'VOICE' | 'DOCUMENT' | 'TRANSFER' | 'RED_PACKET' = 'TEXT',
    meta?: any,
    replyTo?: any
  ) => {
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
      metadata: meta,
      replyTo
    };

    setMessages(prev => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg]
    }));

    setConversations(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const preview =
            type === 'VOICE'
              ? '🎤 Voice note'
              : type === 'IMAGE'
              ? '📷 [Photo]'
              : type === 'DOCUMENT'
              ? '📄 [Document]'
              : content;
          return {
            ...c,
            lastMessageText: preview,
            lastMessageAt: 'Just now'
          };
        }
        return c;
      })
    );

    // Simulated buddy reply
    setTimeout(() => {
      const buddyAnswers = [
        'Got it! Looking super clean and fast 👍',
        'Loved the Indian English & Hindi support! 🇮🇳',
        'Awesome, testing UPI and chats with you right now!',
        'Checked! Let us do a quick call in a minute.',
        'Great work! ChatIndia feels just like a super app.'
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

      setConversations(p =>
        p.map(c => (c.id === convId ? { ...c, lastMessageText: randomText, lastMessageAt: 'Just now' } : c))
      );
    }, 1400);
  };

  const deleteMessage = (convId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).filter(m => m.id !== messageId)
    }));
  };

  const reactToMessage = (convId: string, messageId: string, emoji: string) => {
    setMessages(prev => ({
      ...prev,
      [convId]: (prev[convId] || []).map(m => {
        if (m.id === messageId) {
          const current = m.reactions || {};
          const list = current[emoji] || [];
          const hasReacted = list.includes(user.displayName);
          return {
            ...m,
            reactions: {
              ...current,
              [emoji]: hasReacted
                ? list.filter(n => n !== user.displayName)
                : [...list, user.displayName]
            }
          };
        }
        return m;
      })
    }));
  };

  const togglePinConversation = (convId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const toggleMuteConversation = (convId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === convId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const createGroupChat = (title: string, memberIds: string[]): string => {
    const newGroupId = 'group_' + Date.now();
    const newConv: Conversation = {
      id: newGroupId,
      title,
      avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=160',
      isGroup: true,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'Group created. Say hello to everyone! 🎉',
      lastMessageAt: 'Just now',
      partnerId: newGroupId,
      memberCount: memberIds.length + 1
    };

    setConversations(prev => [newConv, ...prev]);
    setMessages(prev => ({
      ...prev,
      [newGroupId]: [
        {
          id: 'msg_welcome_' + Date.now(),
          conversationId: newGroupId,
          senderId: user.id,
          senderName: user.displayName,
          senderAvatar: user.avatarUrl,
          isMe: true,
          content: `Welcome to "${title}"! 🇮🇳`,
          type: 'TEXT',
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));

    return newGroupId;
  };

  // --- Shagun Envelopes & Payments ---
  const sendRedPacket = (convId: string, amountRupees: number, greeting: string) => {
    const amountPaise = Math.round(amountRupees * 100);
    if (walletBalance < amountPaise) {
      alert('Insufficient wallet balance! Please add money via UPI.');
      return;
    }

    setWalletBalance(prev => prev - amountPaise);
    setWalletTransactions(prev => [
      {
        id: 'tx_' + Date.now(),
        title: `🎁 Sent Shagun Envelope (${greeting})`,
        amountFormatted: `-₹${amountRupees.toFixed(2)}`,
        isPositive: false,
        type: 'SHAGUN_SENT',
        date: 'Just now',
        status: 'SUCCESS'
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
        greeting: greeting || 'Best Wishes & Shagun! 🎁',
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
          ? { ...c, lastMessageText: `🎁 [Shagun] ${greeting || 'Best Wishes'}`, lastMessageAt: 'Just now' }
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
        title: `🎁 Claimed Shagun from ${msg.senderName}`,
        amountFormatted: `+₹${claimedRupees.toFixed(2)}`,
        isPositive: true,
        type: 'SHAGUN_CLAIMED',
        date: 'Just now',
        status: 'SUCCESS'
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
        date: 'Just now',
        status: 'SUCCESS'
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
        date: 'Just now',
        status: 'SUCCESS'
      },
      ...prev
    ]);
  };

  // --- Contacts & Friends Handlers ---
  const addFriendByUsernameOrQR = (identifier: string): boolean => {
    const cleanId = identifier.trim();
    const cleanName = cleanId.includes('@') ? cleanId.split('@')[0] : cleanId;

    const newFriend: Contact = {
      id: 'friend_' + Date.now(),
      displayName: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      username: cleanName.toLowerCase().replace(/\s+/g, '_'),
      upiId: `${cleanName.toLowerCase()}@chatindia`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160',
      region: 'Bengaluru, Karnataka',
      signature: 'Connected on ChatIndia 📱✨',
      isOnline: true
    };

    setFriends(prev => [newFriend, ...prev]);

    const newConv: Conversation = {
      id: 'conv_' + newFriend.id,
      title: newFriend.displayName,
      avatarUrl: newFriend.avatarUrl,
      isGroup: false,
      isPinned: false,
      unreadCount: 0,
      lastMessageText: 'Connected on ChatIndia. Say hello! 👋',
      lastMessageAt: 'Just now',
      partnerId: newFriend.id,
      isOnline: true
    };

    setConversations(prev => [newConv, ...prev]);
    return true;
  };

  const sendFriendRequestToUser = async (recipientId: string, note?: string): Promise<boolean> => {
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
      upiId: `${cleanUsername}@chatindia`,
      avatarUrl: req.senderAvatar,
      region: 'Delhi NCR',
      signature: 'Friend request accepted! 🎉',
      isOnline: true
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
      partnerId: req.senderId,
      isOnline: true
    };

    setConversations(prev => [newConv, ...prev]);
  };

  const rejectFriendRequest = (reqId: string) => {
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const blockUser = (userId: string) => {
    const target = friends.find(f => f.id === userId);
    if (target) {
      setFriends(prev => prev.filter(f => f.id !== userId));
      setBlockedUsers(prev => [...prev, target]);
      setConversations(prev => prev.filter(c => c.partnerId !== userId));
    }
  };

  const unblockUser = (userId: string) => {
    const target = blockedUsers.find(f => f.id === userId);
    if (target) {
      setBlockedUsers(prev => prev.filter(f => f.id !== userId));
      setFriends(prev => [...prev, target]);
    }
  };

  // --- Moments Handlers ---
  const postMoment = (content: string, imageUrl?: string, locationName?: string) => {
    const newMoment: MomentPost = {
      id: 'moment_' + Date.now(),
      authorId: user.id,
      authorName: user.displayName,
      authorAvatar: user.avatarUrl,
      content,
      mediaUrls: imageUrl ? [imageUrl] : [],
      locationName: locationName || 'India',
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
              { id: 'c_' + Date.now(), authorName: user.displayName, text: text.trim(), time: 'Just now' }
            ]
          };
        }
        return m;
      })
    );
  };

  const deleteMoment = (momentId: string) => {
    setMoments(prev => prev.filter(m => m.id !== momentId));
  };

  // --- Calling Handlers ---
  const startCall = (targetName: string, targetAvatar: string, type: 'audio' | 'video') => {
    setActiveCall({
      targetName,
      targetAvatar,
      type,
      status: 'calling',
      durationSeconds: 0,
      isMuted: false,
      isCameraOff: false
    });

    setTimeout(() => {
      setActiveCall(prev => (prev ? { ...prev, status: 'connected' } : null));
    }, 2000);
  };

  const endCall = () => {
    if (activeCall) {
      setCallHistory(prev => [
        {
          id: 'call_' + Date.now(),
          targetName: activeCall.targetName,
          targetAvatar: activeCall.targetAvatar,
          type: activeCall.type,
          direction: 'outgoing',
          time: 'Just now',
          duration: `${Math.floor(activeCall.durationSeconds / 60)}m ${activeCall.durationSeconds % 60}s`
        },
        ...prev
      ]);
    }
    setActiveCall(null);
  };

  const toggleMuteMic = () => {
    setActiveCall(prev => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleCamera = () => {
    setActiveCall(prev => (prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null));
  };

  // --- Notifications Handlers ---
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const walletBalanceFormatted = (walletBalance / 100).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        user,
        updateUserProfile,
        loginWithPhone,
        signupWithPhone,
        logout,
        language,
        setLanguage,
        t,
        isDarkMode,
        toggleDarkMode,
        conversations,
        messages,
        sendMessage,
        deleteMessage,
        reactToMessage,
        togglePinConversation,
        toggleMuteConversation,
        createGroupChat,
        sendRedPacket,
        claimRedPacket,
        sendTransfer,
        topUpWallet,
        walletBalance,
        walletBalanceFormatted,
        walletTransactions,
        friends,
        friendRequests,
        blockedUsers,
        addFriendByUsernameOrQR,
        sendFriendRequestToUser,
        acceptFriendRequest,
        rejectFriendRequest,
        blockUser,
        unblockUser,
        moments,
        postMoment,
        likeMoment,
        addMomentComment,
        deleteMoment,
        activeCall,
        startCall,
        endCall,
        toggleMuteMic,
        toggleCamera,
        callHistory,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        clearAllNotifications,
        serverUrl
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
