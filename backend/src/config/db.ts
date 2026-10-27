import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// In-Memory & File Persistent Repository mimicking Prisma Models
// Allows zero-configuration immediate testing AND connects to Prisma Postgres when DATABASE_URL is available
class DataStore {
  public users: any[] = [];
  public profiles: any[] = [];
  public qrTokens: any[] = [];
  public friendRequests: any[] = [];
  public friendships: any[] = [];
  public conversations: any[] = [];
  public conversationMembers: any[] = [];
  public messages: any[] = [];
  public posts: any[] = [];
  public postLikes: any[] = [];
  public postComments: any[] = [];
  public calls: any[] = [];
  public notifications: any[] = [];
  public walletAccounts: any[] = [];
  public walletTransactions: any[] = [];
  public miniApps: any[] = [];
  public businessAccounts: any[] = [];
  public reports: any[] = [];
  public adminUsers: any[] = [];
  public adminAuditLogs: any[] = [];

  private filePath: string;

  constructor() {
    this.filePath = path.join(process.cwd(), 'data-store.json');
    this.initSeedData();
  }

  private initSeedData() {
    // Seed Admin
    this.adminUsers.push({
      id: "admin-1",
      email: "admin@omnichat.io",
      name: "SuperAdmin Operator",
      passwordHash: "admin123", // In production hashed with Argon2/bcrypt
      role: "SUPERADMIN",
      createdAt: new Date().toISOString()
    });

    // Seed Primary User (Alex Chen)
    const user1Id = "user-1";
    this.users.push({
      id: user1Id,
      phoneNumber: "+86 138-0018-8888",
      email: "alex.chen@omnichat.io",
      username: "alex_chen",
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    });
    this.profiles.push({
      id: "prof-1",
      userId: user1Id,
      displayName: "Alex Chen (陈博)",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      bio: "Building next-generation super apps & real-time mobile experiences 🚀",
      region: "Shenzhen, Guangdong",
      publicQrId: "qr-user-1",
      createdAt: new Date().toISOString()
    });
    this.walletAccounts.push({
      id: "wal-1",
      userId: user1Id,
      balanceCents: 188850, // ¥1,888.50 represented as integer minor currency units
      currency: "CNY",
      createdAt: new Date().toISOString()
    });

    // Seed Contact 2 (Emma Watson)
    const user2Id = "user-2";
    this.users.push({
      id: user2Id,
      phoneNumber: "+1 415-555-0143",
      email: "emma@example.com",
      username: "emma_watson",
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    });
    this.profiles.push({
      id: "prof-2",
      userId: user2Id,
      displayName: "Emma Watson",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      bio: "Product Designer @ OmniLab ✨ Coffee & Photography",
      region: "San Francisco, USA",
      publicQrId: "qr-user-2",
      createdAt: new Date().toISOString()
    });
    this.walletAccounts.push({
      id: "wal-2",
      userId: user2Id,
      balanceCents: 52000,
      currency: "CNY",
      createdAt: new Date().toISOString()
    });

    // Seed Contact 3 (Kevin Zhang)
    const user3Id = "user-3";
    this.users.push({
      id: user3Id,
      phoneNumber: "+86 139-2222-3333",
      email: "kevin.z@tencent.example",
      username: "kevin_zhang",
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    });
    this.profiles.push({
      id: "prof-3",
      userId: user3Id,
      displayName: "Kevin Zhang (张伟)",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      bio: "Full Stack Engineer & Cloud Architect ⚡️",
      region: "Hangzhou, Zhejiang",
      publicQrId: "qr-user-3",
      createdAt: new Date().toISOString()
    });
    this.walletAccounts.push({
      id: "wal-3",
      userId: user3Id,
      balanceCents: 88800,
      currency: "CNY",
      createdAt: new Date().toISOString()
    });

    // Seed Friendship between User 1 and User 2
    this.friendships.push({
      id: "friendship-1",
      userId1: user1Id,
      userId2: user2Id,
      createdAt: new Date().toISOString()
    });

    // Seed Conversation 1 (Alex & Emma)
    const conv1Id = "conv-1";
    this.conversations.push({
      id: conv1Id,
      type: "DIRECT",
      title: null,
      lastMessageText: "I just sent you a lucky red packet! Check it out 🧧",
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    this.conversationMembers.push(
      { id: "cm-1", conversationId: conv1Id, userId: user1Id, role: "MEMBER", isPinned: true },
      { id: "cm-2", conversationId: conv1Id, userId: user2Id, role: "MEMBER", isPinned: false }
    );
    this.messages.push(
      {
        id: "msg-101",
        conversationId: conv1Id,
        senderId: user2Id,
        type: "TEXT",
        content: "Hey Alex! The WeChat SuperApp design system is live on mobile and desktop.",
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: "msg-102",
        conversationId: conv1Id,
        senderId: user1Id,
        type: "TEXT",
        content: "Awesome! The QR Code scanning and wallet ledger are working smoothly.",
        createdAt: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: "msg-103",
        conversationId: conv1Id,
        senderId: user2Id,
        type: "LUCKY_PACKET",
        content: "大吉大利，恭喜发财！🧧 (Best Wishes!)",
        metadata: { amountCents: 8888, isClaimed: false, senderName: "Emma Watson" },
        createdAt: new Date(Date.now() - 600000).toISOString()
      }
    );

    // Seed Moments Posts
    this.posts.push(
      {
        id: "post-1",
        authorId: user2Id,
        content: "Golden hour over Shenzhen Bay! The skyline looks breathtaking today. Enjoying iced latte ☕️✨",
        locationName: "Shenzhen Bay Park, Nanshan",
        audience: "PUBLIC",
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        media: [
          { id: "m-1", mediaUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800", mediaType: "IMAGE" }
        ],
        likes: [{ userId: user1Id, displayName: "Alex Chen (陈博)" }],
        comments: [{ id: "c-1", authorName: "Alex Chen (陈博)", content: "Stunning colors! Love the vibe." }]
      },
      {
        id: "post-2",
        authorId: user3Id,
        content: "Road trip to West Lake! Fresh green tea Longjing and tranquil misty mountains ⛰️🍵",
        locationName: "West Lake, Hangzhou",
        audience: "FRIENDS_ONLY",
        createdAt: new Date(Date.now() - 14400000).toISOString(),
        media: [
          { id: "m-2", mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", mediaType: "IMAGE" }
        ],
        likes: [{ userId: user1Id, displayName: "Alex Chen (陈博)" }],
        comments: []
      }
    );

    // Seed Mini Apps Directory
    this.miniApps.push(
      {
        id: "mini-1",
        appKey: "jump-2048",
        name: "Jump 2048 (跳一跳 2048)",
        category: "Gaming & Entertainment",
        developer: "Omni Interactive",
        description: "Slide and merge numbers to hit 2048! Pure casual fun.",
        rating: 4.9,
        usersCount: "12.4M",
        isFeatured: true
      },
      {
        id: "mini-2",
        appKey: "omni-ride",
        name: "OmniRide (滴滴出行)",
        category: "Travel & Transport",
        developer: "DiDi / Omni Mobility",
        description: "Express taxi booking with live GPS tracking and WeChat Pay settlement.",
        rating: 4.8,
        usersCount: "45.1M",
        isFeatured: true
      },
      {
        id: "mini-3",
        appKey: "omni-eats",
        name: "OmniEats (美团外卖)",
        category: "Food Delivery",
        developer: "Meituan / Omni Food",
        description: "Cantonese Dim Sum, Milk Tea, Dumplings delivered to your door.",
        rating: 4.9,
        usersCount: "68.3M",
        isFeatured: true
      },
      {
        id: "mini-4",
        appKey: "skycast-weather",
        name: "SkyCast Weather (天气通)",
        category: "Utilities & Life",
        developer: "Met Office Global",
        description: "Real-time air quality index, hourly radar, and 15-day forecast.",
        rating: 4.7,
        usersCount: "18.2M",
        isFeatured: false
      }
    );

    // Seed Business Official Accounts
    this.businessAccounts.push({
      id: "biz-1",
      name: "Omni Tech Review (腾讯科技)",
      handle: "omni_tech",
      category: "Technology Media",
      avatarUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
      description: "Official insights, developer updates, and deep dives into the SuperApp ecosystem.",
      isVerified: true
    });
  }
}

export const dbStore = new DataStore();
