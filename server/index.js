import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { db } from './data/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5055;

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static directory for file uploads
const uploadDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadDir));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uuidv4().slice(0, 8)}${ext}`);
  }
});
const upload = multer({ storage });

// Helper to get current active user
function getCurrentUser() {
  return db.get().currentUser;
}

// ==========================
// 1. AUTH & PROFILE ROUTES
// ==========================

// Get Current User Profile & Wallet
app.get('/api/me', (req, res) => {
  res.json({ success: true, user: db.get().currentUser });
});

// Update Profile
app.put('/api/me', (req, res) => {
  const current = db.get().currentUser;
  const { name, bio, region, avatar, gender } = req.body;
  if (name) current.name = name;
  if (bio !== undefined) current.bio = bio;
  if (region !== undefined) current.region = region;
  if (avatar) current.avatar = avatar;
  if (gender) current.gender = gender;

  // Also sync in users list
  const userIdx = db.get().users.findIndex(u => u.id === current.id);
  if (userIdx !== -1) {
    db.get().users[userIdx] = { ...db.get().users[userIdx], ...current };
  }

  db.save();
  res.json({ success: true, user: current });
});

// Switch active user (great for testing 2-way real-time chatting!)
app.post('/api/auth/switch-user', (req, res) => {
  const { userId } = req.body;
  const target = db.get().users.find(u => u.id === userId);
  if (!target) {
    return res.status(404).json({ error: "User not found" });
  }

  // Ensure target has wallet
  if (!target.wallet) {
    target.wallet = {
      balance: 1000.00,
      currency: "¥",
      totalSpent: 120.00,
      totalReceived: 1120.00,
      bankCards: [
        { id: `card-${target.id}`, bank: "Bank of China", number: "•••• •••• •••• 9988", type: "Debit" }
      ]
    };
  }

  db.get().currentUser = target;
  db.save();
  res.json({ success: true, user: target });
});

// Login with mobile/email + OTP simulation
app.post('/api/auth/login', (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: "Mobile number or email is required" });
  }
  // Any OTP valid for demo
  let user = db.get().users.find(u =>
    u.phone === identifier || u.email === identifier || u.wechatId === identifier
  );

  if (!user) {
    // Auto-create or select default
    user = {
      id: `user-${Date.now()}`,
      username: identifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_'),
      name: identifier.includes('@') ? identifier.split('@')[0] : `OmniUser ${identifier.slice(-4)}`,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200`,
      phone: identifier.includes('@') ? "+86 139 0000 0000" : identifier,
      email: identifier.includes('@') ? identifier : `${identifier}@omnichat.io`,
      wechatId: `wx_${Math.random().toString(36).substring(2, 8)}`,
      qrCode: `OMNICHAT_USER_${Date.now()}`,
      region: "Shenzhen, China",
      bio: "Just joined OmniChat SuperApp!",
      status: "online",
      role: "user",
      wallet: {
        balance: 500.00,
        currency: "¥",
        totalSpent: 0,
        totalReceived: 500.00,
        bankCards: []
      }
    };
    db.get().users.push(user);
  }

  db.get().currentUser = user;
  db.save();
  res.json({ success: true, user });
});

// Signup
app.post('/api/auth/signup', (req, res) => {
  const { name, phone, email, wechatId } = req.body;
  const newUser = {
    id: `user-${uuidv4().slice(0, 8)}`,
    username: wechatId || `user_${Date.now()}`,
    name: name || "New WeChat Friend",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    phone: phone || "+86 138-0000-0000",
    email: email || "user@omnichat.io",
    wechatId: wechatId || `wx_${Math.random().toString(36).substring(2, 8)}`,
    qrCode: `OMNICHAT_USER_${Date.now()}`,
    region: "Beijing, China",
    bio: "Living in the future with OmniChat SuperApp",
    status: "online",
    role: "user",
    wallet: {
      balance: 666.00,
      currency: "¥",
      totalSpent: 0,
      totalReceived: 666.00,
      bankCards: []
    }
  };

  db.get().users.push(newUser);
  db.get().currentUser = newUser;
  db.save();
  res.json({ success: true, user: newUser });
});

// ==========================
// 2. CHATS & MESSAGES
// ==========================

// Get All Chats for current user
app.get('/api/chats', (req, res) => {
  const current = getCurrentUser();
  const chats = db.get().chats;
  res.json({ success: true, chats, currentUserId: current.id });
});

// Get Messages for a specific Chat
app.get('/api/chats/:id/messages', (req, res) => {
  const { id } = req.params;
  const chat = db.get().chats.find(c => c.id === id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }
  // Clear unread count when opened
  chat.unreadCount = 0;
  db.save();
  res.json({ success: true, messages: chat.messages || [] });
});

// Send Message
app.post('/api/chats/:id/messages', (req, res) => {
  const { id } = req.params;
  const { type, content, caption, duration, address, title, cover, redPacketId, amount, greeting } = req.body;
  const current = getCurrentUser();

  const chat = db.get().chats.find(c => c.id === id);
  if (!chat) {
    return res.status(404).json({ error: "Chat not found" });
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const message = {
    id: `m-${Date.now()}-${uuidv4().slice(0, 4)}`,
    senderId: current.id,
    senderName: current.name,
    type: type || "text",
    content: content || "",
    caption: caption || "",
    duration: duration || null,
    address: address || null,
    title: title || null,
    cover: cover || null,
    redPacketId: redPacketId || null,
    amount: amount || null,
    greeting: greeting || null,
    isClaimed: false,
    timestamp: timeStr,
    status: "delivered"
  };

  if (!chat.messages) chat.messages = [];
  chat.messages.push(message);

  // Update chat metadata
  if (type === 'image') chat.lastMessage = '[Photo]';
  else if (type === 'voice') chat.lastMessage = `[Voice] ${duration || 5}"`;
  else if (type === 'video') chat.lastMessage = '[Video]';
  else if (type === 'red_packet') chat.lastMessage = `[Lucky Money 🧧] ${greeting || 'Best Wishes'}`;
  else if (type === 'location') chat.lastMessage = `[Location] ${content}`;
  else chat.lastMessage = content;

  chat.lastTime = timeStr;
  db.save();

  // Socket notification
  io.emit('new_message', { chatId: id, message });

  // Simulated auto-reply from contact if direct chat
  if (chat.type === 'direct' && chat.targetUser && chat.targetUser.id !== current.id) {
    setTimeout(() => {
      const replies = [
        "Sounds great! Looking forward to it 👍",
        "Got it! Thanks for the update.",
        "Haha exactly! WeChat SuperApp makes everything so effortless.",
        "Received! Let's talk more when we meet.",
        "Check out the Moments feed, just posted some photos!"
      ];
      const botReply = replies[Math.floor(Math.random() * replies.length)];
      const botMsg = {
        id: `m-${Date.now()}-${uuidv4().slice(0, 4)}`,
        senderId: chat.targetUser.id,
        senderName: chat.targetUser.name,
        type: "text",
        content: botReply,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        status: "read"
      };
      chat.messages.push(botMsg);
      chat.lastMessage = botReply;
      chat.lastTime = botMsg.timestamp;
      db.save();
      io.emit('new_message', { chatId: id, message: botMsg });
    }, 2500);
  }

  res.json({ success: true, message });
});

// Create New Chat (1-to-1 or Group)
app.post('/api/chats/new', (req, res) => {
  const { targetUserId, groupName, memberIds } = req.body;
  const current = getCurrentUser();

  if (targetUserId) {
    // 1-to-1 chat
    let existing = db.get().chats.find(c => c.type === 'direct' && c.targetUser && c.targetUser.id === targetUserId);
    if (existing) {
      return res.json({ success: true, chat: existing });
    }
    const target = db.get().users.find(u => u.id === targetUserId);
    if (!target) return res.status(404).json({ error: "Target user not found" });

    const newChat = {
      id: `chat-${Date.now()}`,
      type: "direct",
      targetUser: {
        id: target.id,
        name: target.name,
        avatar: target.avatar,
        wechatId: target.wechatId,
        status: target.status || "online"
      },
      lastMessage: "You can now start chatting!",
      lastTime: "Just now",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: "system",
          type: "text",
          content: `You and ${target.name} are now friends on OmniChat. Start chatting!`,
          timestamp: "Just now",
          status: "read"
        }
      ]
    };
    db.get().chats.unshift(newChat);
    db.save();
    return res.json({ success: true, chat: newChat });
  }

  if (groupName && memberIds) {
    // Group chat
    const members = Array.from(new Set([current.id, ...memberIds]));
    const newGroup = {
      id: `chat-group-${Date.now()}`,
      type: "group",
      groupName,
      groupAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200",
      members,
      lastMessage: `${current.name} created the group "${groupName}"`,
      lastTime: "Just now",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: "system",
          type: "text",
          content: `${current.name} created the group "${groupName}".`,
          timestamp: "Just now",
          status: "read"
        }
      ]
    };
    db.get().chats.unshift(newGroup);
    db.save();
    return res.json({ success: true, chat: newGroup });
  }

  res.status(400).json({ error: "Invalid request payload" });
});

// ==========================
// 3. WECHAT PAY & RED PACKET (红包)
// ==========================

// Send Red Packet
app.post('/api/redpacket/send', (req, res) => {
  const { chatId, amount, greeting } = req.body;
  const current = getCurrentUser();
  const amt = parseFloat(amount);

  if (isNaN(amt) || amt <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  if (current.wallet.balance < amt) {
    return res.status(400).json({ error: "Insufficient wallet balance" });
  }

  // Deduct from sender
  current.wallet.balance = parseFloat((current.wallet.balance - amt).toFixed(2));
  current.wallet.totalSpent = parseFloat(((current.wallet.totalSpent || 0) + amt).toFixed(2));

  // Add transaction record
  const tx = {
    id: `tx-${Date.now()}`,
    type: "red_packet_sent",
    title: `Red Packet: ${greeting || 'Best Wishes!'}`,
    amount: -amt,
    currency: "¥",
    timestamp: "Just now",
    status: "Completed",
    icon: "🧧"
  };
  db.get().transactions.unshift(tx);

  // Send message in chat
  const chat = db.get().chats.find(c => c.id === chatId);
  const rpId = `rp-${Date.now()}`;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const message = {
    id: `m-${Date.now()}`,
    senderId: current.id,
    senderName: current.name,
    type: "red_packet",
    redPacketId: rpId,
    amount: amt,
    greeting: greeting || "大吉大利，恭喜发财！🧧",
    isClaimed: false,
    timestamp: timeStr,
    status: "delivered"
  };

  if (chat) {
    chat.messages.push(message);
    chat.lastMessage = `[Lucky Money 🧧] ${message.greeting}`;
    chat.lastTime = timeStr;
  }

  db.save();

  io.emit('new_message', { chatId, message });
  io.emit('wallet_updated', { userId: current.id, wallet: current.wallet });

  res.json({ success: true, message, balance: current.wallet.balance });
});

// Claim / Open Red Packet
app.post('/api/redpacket/claim', (req, res) => {
  const { messageId, chatId } = req.body;
  const current = getCurrentUser();

  const chat = db.get().chats.find(c => c.id === chatId);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  const msg = chat.messages.find(m => m.id === messageId || m.redPacketId === messageId);
  if (!msg) return res.status(404).json({ error: "Red packet not found" });

  if (msg.isClaimed) {
    return res.status(400).json({ error: "Red packet already opened" });
  }

  msg.isClaimed = true;
  msg.claimedBy = current.name;
  msg.claimedAt = "Just now";

  // Credit money to current user wallet
  const amt = parseFloat(msg.amount || 0);
  current.wallet.balance = parseFloat((current.wallet.balance + amt).toFixed(2));
  current.wallet.totalReceived = parseFloat(((current.wallet.totalReceived || 0) + amt).toFixed(2));

  // Add transaction
  const tx = {
    id: `tx-${Date.now()}`,
    type: "red_packet_received",
    title: `Lucky Red Packet from ${msg.senderName || 'Friend'}`,
    amount: amt,
    currency: "¥",
    timestamp: "Just now",
    status: "Completed",
    icon: "🧧"
  };
  db.get().transactions.unshift(tx);

  db.save();

  io.emit('red_packet_claimed', {
    chatId,
    messageId: msg.id,
    claimedBy: current.name,
    amount: amt
  });
  io.emit('wallet_updated', { userId: current.id, wallet: current.wallet });

  res.json({
    success: true,
    amount: amt,
    greeting: msg.greeting,
    senderName: msg.senderName,
    newBalance: current.wallet.balance
  });
});

// Wallet Overview & Transactions
app.get('/api/wallet', (req, res) => {
  const current = getCurrentUser();
  res.json({
    success: true,
    wallet: current.wallet,
    transactions: db.get().transactions
  });
});

// Direct Transfer / QR Scan-to-Pay
app.post('/api/wallet/pay-transfer', (req, res) => {
  const { recipient, amount, note, type } = req.body;
  const current = getCurrentUser();
  const amt = parseFloat(amount);

  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: "Invalid payment amount" });
  if (current.wallet.balance < amt) return res.status(400).json({ error: "Insufficient balance" });

  current.wallet.balance = parseFloat((current.wallet.balance - amt).toFixed(2));
  current.wallet.totalSpent = parseFloat(((current.wallet.totalSpent || 0) + amt).toFixed(2));

  const tx = {
    id: `tx-${Date.now()}`,
    type: type || "qr_payment",
    title: `Payment to ${recipient || 'Vendor'}`,
    amount: -amt,
    currency: "¥",
    note: note || "WeChat Pay Quick Settlement",
    timestamp: "Just now",
    status: "Completed",
    icon: type === 'transfer' ? "💳" : "⚡️"
  };
  db.get().transactions.unshift(tx);
  db.save();

  res.json({ success: true, balance: current.wallet.balance, transaction: tx });
});

// Top-up wallet
app.post('/api/wallet/topup', (req, res) => {
  const { amount } = req.body;
  const current = getCurrentUser();
  const amt = parseFloat(amount);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: "Invalid amount" });

  current.wallet.balance = parseFloat((current.wallet.balance + amt).toFixed(2));
  const tx = {
    id: `tx-${Date.now()}`,
    type: "transfer_in",
    title: "Bank Top-up (ICBC)",
    amount: amt,
    currency: "¥",
    timestamp: "Just now",
    status: "Completed",
    icon: "💳"
  };
  db.get().transactions.unshift(tx);
  db.save();

  res.json({ success: true, balance: current.wallet.balance, transaction: tx });
});

// ==========================
// 4. CONTACTS & QR SCANNER (Add Friend via QR)
// ==========================

// Get Contacts list
app.get('/api/contacts', (req, res) => {
  const users = db.get().users;
  const current = getCurrentUser();
  const contacts = users.filter(u => u.id !== current.id);
  res.json({ success: true, contacts, friendRequests: db.get().friendRequests || [] });
});

// Search User by Phone, WeChat ID, or QR Code
app.post('/api/contacts/search', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });

  const q = query.trim().toLowerCase();
  const user = db.get().users.find(u =>
    (u.wechatId && u.wechatId.toLowerCase() === q) ||
    (u.phone && u.phone.includes(q)) ||
    (u.qrCode && u.qrCode.toLowerCase() === q) ||
    (u.username && u.username.toLowerCase() === q)
  );

  if (!user) {
    return res.status(404).json({ error: "User not found with matching WeChat ID, phone, or QR code" });
  }

  res.json({ success: true, user });
});

// Add Friend by QR Code (The requested feature: "QR Code se Add Friend")
app.post('/api/contacts/add-by-qr', (req, res) => {
  const { qrString, remark } = req.body;
  const current = getCurrentUser();

  if (!qrString) {
    return res.status(400).json({ error: "QR code data is missing" });
  }

  // Parse QR String format: e.g. "OMNICHAT_USER_user-2" or plain ID
  const userId = qrString.startsWith("OMNICHAT_USER_")
    ? qrString.replace("OMNICHAT_USER_", "")
    : qrString;

  const target = db.get().users.find(u => u.id === userId || u.qrCode === qrString || u.wechatId === qrString);
  if (!target) {
    return res.status(404).json({ error: "Invalid QR Code: No WeChat user found" });
  }

  if (target.id === current.id) {
    return res.status(400).json({ error: "You cannot add yourself via QR code" });
  }

  // Check if already in friend requests or chats
  let existingChat = db.get().chats.find(c => c.type === 'direct' && c.targetUser && c.targetUser.id === target.id);
  if (!existingChat) {
    // Automatically accept or add
    existingChat = {
      id: `chat-${Date.now()}`,
      type: "direct",
      targetUser: {
        id: target.id,
        name: target.name,
        avatar: target.avatar,
        wechatId: target.wechatId,
        status: target.status || "online"
      },
      lastMessage: `You are now friends with ${target.name} via QR Code Scan!`,
      lastTime: "Just now",
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          senderId: "system",
          type: "text",
          content: `You scanned ${target.name}'s QR Code. You are now connected!`,
          timestamp: "Just now",
          status: "read"
        }
      ]
    };
    db.get().chats.unshift(existingChat);
  }

  // Record friend request
  const fr = {
    id: `fr-${Date.now()}`,
    fromUser: {
      id: target.id,
      name: target.name,
      avatar: target.avatar,
      wechatId: target.wechatId,
      region: target.region
    },
    source: "Scanned Personal QR Code ✅",
    message: remark || "Added via QR Code scan",
    status: "accepted",
    timestamp: "Just now"
  };
  if (!db.get().friendRequests) db.get().friendRequests = [];
  db.get().friendRequests.unshift(fr);

  db.save();

  io.emit('friend_added', { user: target, source: "QR Scan" });

  res.json({
    success: true,
    user: target,
    chatId: existingChat.id,
    message: `Successfully connected with ${target.name} via QR Code!`
  });
});

// ==========================
// 5. MOMENTS (朋友圈 - Social Feed)
// ==========================

// Get Moments
app.get('/api/moments', (req, res) => {
  res.json({ success: true, moments: db.get().moments });
});

// Post Moment
app.post('/api/moments', (req, res) => {
  const { content, images, location, privacy } = req.body;
  const current = getCurrentUser();

  if (!content && (!images || images.length === 0)) {
    return res.status(400).json({ error: "Moment content or image is required" });
  }

  const newMoment = {
    id: `moment-${Date.now()}`,
    author: {
      id: current.id,
      name: current.name,
      avatar: current.avatar
    },
    content: content || "",
    images: images || [],
    location: location || "",
    privacy: privacy || "Public",
    timestamp: "Just now",
    likes: [],
    comments: []
  };

  db.get().moments.unshift(newMoment);
  db.save();

  io.emit('new_moment', { moment: newMoment });
  res.json({ success: true, moment: newMoment });
});

// Like / Unlike Moment
app.post('/api/moments/:id/like', (req, res) => {
  const { id } = req.params;
  const current = getCurrentUser();
  const moment = db.get().moments.find(m => m.id === id);
  if (!moment) return res.status(404).json({ error: "Moment not found" });

  const existingIdx = moment.likes.findIndex(l => l.id === current.id);
  if (existingIdx !== -1) {
    moment.likes.splice(existingIdx, 1);
  } else {
    moment.likes.push({ id: current.id, name: current.name });
  }

  db.save();
  io.emit('moment_updated', { moment });
  res.json({ success: true, likes: moment.likes });
});

// Comment on Moment
app.post('/api/moments/:id/comment', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const current = getCurrentUser();
  if (!text) return res.status(400).json({ error: "Comment text required" });

  const moment = db.get().moments.find(m => m.id === id);
  if (!moment) return res.status(404).json({ error: "Moment not found" });

  const comment = {
    id: `c-${Date.now()}`,
    author: current.name,
    text,
    timestamp: "Just now"
  };
  moment.comments.push(comment);
  db.save();

  io.emit('moment_updated', { moment });
  res.json({ success: true, comment, moment });
});

// ==========================
// 6. MINI PROGRAMS & OFFICIAL ACCOUNTS
// ==========================

// Get Mini Programs
app.get('/api/mini-apps', (req, res) => {
  res.json({ success: true, miniApps: db.get().miniApps });
});

// Get Official Accounts & Articles
app.get('/api/official-accounts', (req, res) => {
  res.json({ success: true, officialAccounts: db.get().officialAccounts });
});

// Get Channels (Short Videos)
app.get('/api/channels', (req, res) => {
  res.json({ success: true, channels: db.get().channels });
});

// ==========================
// 7. ADMIN DASHBOARD & MODERATION
// ==========================

app.get('/api/admin/metrics', (req, res) => {
  const users = db.get().users;
  const chats = db.get().chats;
  const moments = db.get().moments;
  const transactions = db.get().transactions;

  const totalBalance = users.reduce((acc, u) => acc + (u.wallet?.balance || 0), 0);
  const totalMessages = chats.reduce((acc, c) => acc + (c.messages?.length || 0), 0);

  res.json({
    success: true,
    stats: {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'online').length,
      totalChats: chats.length,
      totalMessages,
      totalMoments: moments.length,
      walletVolume: `¥${totalBalance.toLocaleString()}`,
      miniProgramsRunning: 4,
      totalTransactions: transactions.length
    },
    users,
    moments,
    transactions
  });
});

// Moderate Content (delete moment or ban user)
app.post('/api/admin/moderate', (req, res) => {
  const { action, targetId } = req.body;

  if (action === 'delete_moment') {
    db.get().moments = db.get().moments.filter(m => m.id !== targetId);
    db.save();
    return res.json({ success: true, message: "Moment removed by moderator" });
  }

  if (action === 'toggle_user_status') {
    const user = db.get().users.find(u => u.id === targetId);
    if (user) {
      user.status = user.status === 'banned' ? 'online' : 'banned';
      db.save();
      return res.json({ success: true, user });
    }
  }

  res.status(400).json({ error: "Invalid moderation action" });
});

// ==========================
// 8. FILE UPLOAD (Images, Audio, Docs)
// ==========================

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileUrl,
    filename: req.file.originalname,
    size: req.file.size
  });
});

// ==========================
// 9. SOCKET.IO REALTIME SIGNALING
// ==========================

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User joins room
  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  // Call Signaling (Voice & Video Calls)
  socket.on('initiate_call', (data) => {
    // data: { caller, receiverId, callType: 'voice' | 'video' }
    console.log(`Call initiated by ${data.caller.name} to ${data.receiverId}`);
    io.to(`user_${data.receiverId}`).emit('incoming_call', data);
    // Broadcast to sender and others for multi-view testing
    socket.broadcast.emit('incoming_call', data);
  });

  socket.on('answer_call', (data) => {
    io.emit('call_answered', data);
  });

  socket.on('reject_call', (data) => {
    io.emit('call_rejected', data);
  });

  socket.on('end_call', (data) => {
    io.emit('call_ended', data);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 OmniChat SuperApp Server running on http://localhost:${PORT}`);
});
