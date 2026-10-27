import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_DATA = {
  currentUser: {
    id: "user-1",
    username: "alex_chen",
    name: "Alex Chen (陈博)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    phone: "+86 138-0018-8888",
    email: "alex.chen@omnichat.io",
    wechatId: "alex_c88",
    qrCode: "OMNICHAT_USER_user-1",
    gender: "male",
    region: "Shenzhen, Guangdong",
    bio: "Building next-gen superapps & AI experiences 🚀",
    status: "online",
    wallet: {
      balance: 1888.50,
      currency: "¥",
      totalSpent: 420.00,
      totalReceived: 2308.50,
      bankCards: [
        { id: "card-1", bank: "Industrial and Commercial Bank of China (ICBC)", number: "•••• •••• •••• 8866", type: "Debit" },
        { id: "card-2", bank: "China Merchants Bank (CMB)", number: "•••• •••• •••• 3291", type: "Credit" }
      ]
    }
  },
  users: [
    {
      id: "user-1",
      username: "alex_chen",
      name: "Alex Chen (陈博)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
      phone: "+86 138-0018-8888",
      email: "alex.chen@omnichat.io",
      wechatId: "alex_c88",
      qrCode: "OMNICHAT_USER_user-1",
      region: "Shenzhen, Guangdong",
      bio: "Building next-gen superapps & AI experiences 🚀",
      status: "online",
      role: "admin"
    },
    {
      id: "user-2",
      username: "emma_watson",
      name: "Emma Watson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      phone: "+1 415-555-0143",
      email: "emma@example.com",
      wechatId: "emma_design",
      qrCode: "OMNICHAT_USER_user-2",
      region: "San Francisco, USA",
      bio: "Product Designer @ OmniLab ✨ Coffee & Photography",
      status: "online",
      role: "user"
    },
    {
      id: "user-3",
      username: "kevin_zhang",
      name: "Kevin Zhang (张伟)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      phone: "+86 139-2222-3333",
      email: "kevin.z@tencent.example",
      wechatId: "kevin_tech",
      qrCode: "OMNICHAT_USER_user-3",
      region: "Hangzhou, Zhejiang",
      bio: "Full Stack Engineer & Cloud Architect ⚡️",
      status: "busy",
      role: "user"
    },
    {
      id: "user-4",
      username: "sophia_lin",
      name: "Sophia Lin (林雨欣)",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
      phone: "+86 186-8888-9999",
      email: "sophia@techventures.cn",
      wechatId: "sophia_vc",
      qrCode: "OMNICHAT_USER_user-4",
      region: "Shanghai, China",
      bio: "Tech Investor & AI enthusiast 🌱",
      status: "offline",
      role: "user"
    },
    {
      id: "user-5",
      username: "david_miller",
      name: "David Miller",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      phone: "+44 20-7946-0912",
      email: "david.m@uktech.co",
      wechatId: "david_uk",
      qrCode: "OMNICHAT_USER_user-5",
      region: "London, UK",
      bio: "FinTech Strategist | Badminton amateur 🏸",
      status: "online",
      role: "user"
    },
    {
      id: "user-6",
      username: "li_wei",
      name: "Li Wei (李维)",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200",
      phone: "+86 137-0099-1122",
      email: "liwei@beijing.cn",
      wechatId: "liwei_bj",
      qrCode: "OMNICHAT_USER_user-6",
      region: "Beijing, China",
      bio: "Mobile systems & Mini-programs Dev",
      status: "online",
      role: "user"
    }
  ],
  chats: [
    {
      id: "chat-1",
      type: "direct",
      targetUser: {
        id: "user-2",
        name: "Emma Watson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        wechatId: "emma_design",
        status: "online"
      },
      lastMessage: "I just sent you a lucky red packet! Check it out 🧧",
      lastTime: "15:38",
      unreadCount: 1,
      isPinned: true,
      isMuted: false,
      messages: [
        {
          id: "m-101",
          senderId: "user-2",
          type: "text",
          content: "Hey Alex! Have you reviewed the new WeChat Mini-App prototype designs?",
          timestamp: "15:20",
          status: "read"
        },
        {
          id: "m-102",
          senderId: "user-1",
          type: "text",
          content: "Yes Emma! The UI looks incredibly clean, especially the WeChat Pay and Red Packet animations.",
          timestamp: "15:22",
          status: "read"
        },
        {
          id: "m-103",
          senderId: "user-2",
          type: "image",
          content: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
          caption: "Design system preview for Discover & Moments tabs",
          timestamp: "15:25",
          status: "read"
        },
        {
          id: "m-104",
          senderId: "user-1",
          type: "voice",
          content: "Voice note",
          duration: 7,
          timestamp: "15:28",
          status: "read"
        },
        {
          id: "m-105",
          senderId: "user-2",
          type: "red_packet",
          redPacketId: "rp-1",
          amount: 88.88,
          greeting: "大吉大利，恭喜发财！Best Wishes! 🧧",
          isClaimed: false,
          senderName: "Emma Watson",
          timestamp: "15:38",
          status: "delivered"
        }
      ]
    },
    {
      id: "chat-2",
      type: "group",
      groupName: "OmniChat Core Devs & AI Lab 🚀",
      groupAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200",
      members: ["user-1", "user-2", "user-3", "user-6"],
      lastMessage: "Kevin Zhang: Pushed the WebRTC voice/video call signaling server!",
      lastTime: "14:45",
      unreadCount: 3,
      isPinned: true,
      isMuted: false,
      messages: [
        {
          id: "m-201",
          senderId: "user-3",
          senderName: "Kevin Zhang (张伟)",
          type: "text",
          content: "Hey team! QR code friend scanning feature is ready for testing on mobile & desktop.",
          timestamp: "14:10",
          status: "read"
        },
        {
          id: "m-202",
          senderId: "user-6",
          senderName: "Li Wei (李维)",
          type: "text",
          content: "Awesome! The camera scanner recognizes both WeChat personal IDs and merchant payment codes seamlessly.",
          timestamp: "14:15",
          status: "read"
        },
        {
          id: "m-203",
          senderId: "user-1",
          senderName: "Alex Chen",
          type: "location",
          content: "Shenzhen Bay Science & Technology Park, Nanshan",
          address: "No. 18 Keyuan Road, Nanshan District, Shenzhen",
          timestamp: "14:30",
          status: "read"
        },
        {
          id: "m-204",
          senderId: "user-3",
          senderName: "Kevin Zhang (张伟)",
          type: "text",
          content: "Pushed the WebRTC voice/video call signaling server!",
          timestamp: "14:45",
          status: "read"
        }
      ]
    },
    {
      id: "chat-3",
      type: "direct",
      targetUser: {
        id: "user-3",
        name: "Kevin Zhang (张伟)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        wechatId: "kevin_tech",
        status: "busy"
      },
      lastMessage: "Call ended • Duration 04:32",
      lastTime: "Yesterday",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: "m-301",
          senderId: "user-1",
          type: "text",
          content: "Can we review the low latency voice pipeline?",
          timestamp: "Yesterday 18:00",
          status: "read"
        },
        {
          id: "m-302",
          senderId: "user-3",
          type: "call_log",
          callType: "voice",
          content: "Voice Call ended • 4m 32s",
          duration: "04:32",
          timestamp: "Yesterday 18:05",
          status: "read"
        }
      ]
    },
    {
      id: "chat-4",
      type: "official",
      targetUser: {
        id: "oa-1",
        name: "Omni Official News (腾讯科技)",
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
        wechatId: "omni_official",
        verified: true
      },
      lastMessage: "Featured: SuperApp Mini Programs reached 1.2B daily active users",
      lastTime: "Oct 26",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: "m-401",
          senderId: "oa-1",
          type: "article",
          title: "The Architecture of a SuperApp: How WeChat Unified Chat, Payments, and Web Services",
          summary: "Exploring mini-programs ecosystem, offline QR integration, and high concurrency messaging systems.",
          cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
          link: "https://omnichat.io/articles/superapp-architecture",
          timestamp: "Oct 26 10:00",
          status: "read"
        }
      ]
    },
    {
      id: "chat-5",
      type: "direct",
      targetUser: {
        id: "user-4",
        name: "Sophia Lin (林雨欣)",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
        wechatId: "sophia_vc",
        status: "offline"
      },
      lastMessage: "Looking forward to our coffee meeting tomorrow!",
      lastTime: "Oct 25",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: "m-501",
          senderId: "user-4",
          type: "text",
          content: "Looking forward to our coffee meeting tomorrow!",
          timestamp: "Oct 25 16:30",
          status: "read"
        }
      ]
    }
  ],
  moments: [
    {
      id: "moment-1",
      author: {
        id: "user-2",
        name: "Emma Watson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"
      },
      content: "Golden hour over Shenzhen Bay! The skyline looks breathtaking today. Working on the new SuperApp design while enjoying fresh iced latte ☕️✨",
      images: [
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800",
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"
      ],
      location: "Shenzhen Bay Park, Nanshan",
      timestamp: "25 minutes ago",
      likes: [
        { id: "user-1", name: "Alex Chen (陈博)" },
        { id: "user-3", name: "Kevin Zhang" },
        { id: "user-5", name: "David Miller" }
      ],
      comments: [
        { id: "c-1", author: "Alex Chen (陈博)", text: "Stunning colors! Love the vibe.", timestamp: "18m ago" },
        { id: "c-2", author: "Kevin Zhang", text: "Is that near Houhai station? Let's grab lunch there tomorrow!", timestamp: "10m ago" }
      ]
    },
    {
      id: "moment-2",
      author: {
        id: "user-3",
        name: "Kevin Zhang (张伟)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
      },
      content: "Weekend road trip to Hangzhou West Lake! Fresh green tea Longjing and tranquil misty mountains ⛰️🍵",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800"
      ],
      location: "West Lake, Hangzhou",
      timestamp: "3 hours ago",
      likes: [
        { id: "user-1", name: "Alex Chen (陈博)" },
        { id: "user-4", name: "Sophia Lin" }
      ],
      comments: [
        { id: "c-3", author: "Sophia Lin", text: "Longjing village tea is the best during autumn! Have fun!", timestamp: "2h ago" }
      ]
    },
    {
      id: "moment-3",
      author: {
        id: "user-5",
        name: "David Miller",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"
      },
      content: "Finished 3 hours of intense badminton tonight! Who's joining for the mixed doubles next Thursday? 🏸💪",
      images: [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800"
      ],
      location: "London Olympic Stadium Sports Center",
      timestamp: "Yesterday",
      likes: [
        { id: "user-1", name: "Alex Chen (陈博)" }
      ],
      comments: []
    }
  ],
  channels: [
    {
      id: "ch-1",
      creator: "CyberTech Innovations",
      creatorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
      poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
      caption: "Next-gen holographic displays in real-world everyday devices! #Technology #Future #SuperApp",
      music: "Original Sound - Tech Beats 2026",
      likes: 12480,
      comments: 632,
      shares: 310
    },
    {
      id: "ch-2",
      creator: "Travel China & Beyond",
      creatorAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4",
      poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600",
      caption: "Breathtaking morning mist across Zhangjiajie Avatar mountains 🇨🇳✨ #WondersOfTheWorld",
      music: "Chinese Traditional Flute & Guqin",
      likes: 34900,
      comments: 1420,
      shares: 1890
    }
  ],
  miniApps: [
    {
      id: "mini-game-2048",
      name: "Jump 2048 (跳一跳 2048)",
      icon: "🎮",
      category: "Gaming & Entertainment",
      developer: "Omni Interactive",
      description: "Iconic WeChat casual game! Slide and merge tiles to reach 2048 and beat your friends' high scores.",
      rating: 4.9,
      users: "12.4M users",
      color: "#f59e0b"
    },
    {
      id: "mini-ride",
      name: "OmniRide (滴滴出行)",
      icon: "🚖",
      category: "Travel & Transport",
      developer: "DiDi / Omni Mobility",
      description: "Quick taxi, express ride, and premier booking with live driver tracking and WeChat Pay settlement.",
      rating: 4.8,
      users: "45.1M users",
      color: "#f97316"
    },
    {
      id: "mini-food",
      name: "OmniEats (美团外卖)",
      icon: "🍱",
      category: "Food Delivery",
      developer: "Meituan / Omni Food",
      description: "Delicious Dim Sum, Bubble Tea, Noodles, and groceries delivered to your door in 30 minutes.",
      rating: 4.9,
      users: "68.3M users",
      color: "#eab308"
    },
    {
      id: "mini-weather",
      name: "SkyCast Weather (天气通)",
      icon: "⛅",
      category: "Utilities & Life",
      developer: "Met Office Global",
      description: "Real-time air quality index, hourly precipitation radar, typhoon warnings, and 15-day forecast.",
      rating: 4.7,
      users: "18.2M users",
      color: "#0284c7"
    }
  ],
  officialAccounts: [
    {
      id: "oa-1",
      name: "Omni Tech Review (腾讯科技)",
      category: "Technology Media",
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200",
      verified: true,
      followers: "2.8M",
      description: "Official insights, developer updates, and deep dives into the SuperApp ecosystem.",
      articles: [
        {
          id: "art-1",
          title: "OmniChat 3.0 Released: Supercharged Mini-Programs & WebRTC Dual HD Calls",
          readCount: "100k+",
          date: "Today 09:30",
          cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600",
          content: "Today marks the launch of OmniChat 3.0, introducing a unified cross-platform SuperApp experience. Featuring lightning-fast QR code connections, digital lucky red packets, and next-generation mini programs."
        },
        {
          id: "art-2",
          title: "The Rise of WeChat Pay: From Lunar Red Packets to Global QR Payment",
          readCount: "86.4k",
          date: "Yesterday",
          cover: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600",
          content: "How the red envelope tradition digitized consumer behavior, creating the world's most ubiquitous mobile payment standard."
        }
      ]
    },
    {
      id: "oa-2",
      name: "Starbucks Coffee Rewards (星巴克)",
      category: "Dining & Lifestyle",
      avatar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200",
      verified: true,
      followers: "5.4M",
      description: "Order on-the-go with Say it with Green Star (用星说), exclusive drinks, and seasonal member perks.",
      articles: [
        {
          id: "art-3",
          title: "Autumn Special: Hazelnut Toffee Latte & Maple Pecan Danish",
          readCount: "94.1k",
          date: "Oct 24",
          cover: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",
          content: "Warm up this season with our handcrafted hazelnut toffee latte and flaky golden pastries. Member double stars today!"
        }
      ]
    }
  ],
  transactions: [
    {
      id: "tx-1",
      type: "red_packet_received",
      title: "Lucky Red Packet from Emma Watson",
      amount: 88.88,
      currency: "¥",
      timestamp: "Today 15:38",
      status: "Completed",
      icon: "🧧"
    },
    {
      id: "tx-2",
      type: "qr_payment",
      title: "Starbucks Nanshan Science Park",
      amount: -36.00,
      currency: "¥",
      timestamp: "Today 08:45",
      status: "Completed",
      icon: "☕"
    },
    {
      id: "tx-3",
      type: "transfer_in",
      title: "Top-up from ICBC (••••8866)",
      amount: 500.00,
      currency: "¥",
      timestamp: "Yesterday 14:20",
      status: "Completed",
      icon: "💳"
    },
    {
      id: "tx-4",
      type: "red_packet_sent",
      title: "Lucky Money to OmniChat Core Devs",
      amount: -200.00,
      currency: "¥",
      timestamp: "Oct 24 20:00",
      status: "Completed",
      icon: "🧧"
    }
  ],
  friendRequests: [
    {
      id: "fr-1",
      fromUser: {
        id: "user-4",
        name: "Sophia Lin (林雨欣)",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200",
        wechatId: "sophia_vc",
        region: "Shanghai, China"
      },
      source: "Scanned your Personal QR Code",
      message: "Hi Alex! Met you at the SuperApp Summit. Adding you on WeChat!",
      status: "accepted",
      timestamp: "Oct 25 15:00"
    }
  ]
};

class Database {
  constructor() {
    this.data = INITIAL_DATA;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.warn("Could not load database file, using initial data:", err);
      this.data = INITIAL_DATA;
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Failed to save database file:", err);
    }
  }

  get() {
    return this.data;
  }
}

export const db = new Database();
