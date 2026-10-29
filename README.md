# ChatIndia — Production-Ready Social Communication Super App 🇮🇳 🚀

> **Chat. Connect. Share.**
> A WeChat-inspired social communication super app designed specifically for Indian users, featuring emerald-and-white branding, clean layouts, unguessable QR friend discovery, instant UPI & Shagun gift envelopes, interactive mini-programs, and complete bilingual localization (English & Hindi).

---

## 🎨 Visual Identity & Design System

- **Brand Name**: **ChatIndia**
- **Tagline**: *Chat. Connect. Share.*
- **Primary Color**: Emerald Green (`#07C160` / `#059648`)
- **Secondary Color**: Deep Green (`#047857`)
- **Accent**: Soft Mint Green (`#E8F8F0` / `#D1FAE5`)
- **Background**: Warm Neutral Off-White (`#F3F4F6` / `#FFFFFF`)
- **Text**: Dark Charcoal (`#111827`)
- **Indian Accents**: Shagun Red/Gold (`#DC2626` / `#F59E0B`), UPI Official Blue (`#0070BA`), Indian Tricolor subtle accents
- **Localization**: English and Hindi (हिन्दी) out of the box, architecture ready for all Indian regional languages.
- **Dark Mode**: OLED dark theme (`#0B0F19` / `#111827`).

---

## 📱 Complete Mobile Screen Inventory

### 1. Splash & Onboarding (`mobile/app/onboarding/index.tsx`)
- High-fidelity ChatIndia branding and logo
- Language toggle pill (**English** / **हिन्दी**)
- 4-Slide carousel with smooth pagination:
  1. *Seamless Chats & HD Calling* (Voice notes, stickers, reactions)
  2. *Instant Unguessable QR Friend Discovery* (Privacy-preserving, phone number hidden)
  3. *Super Fast UPI & Shagun Payments* (Shagun gift envelopes, bill splitting)
  4. *Instant Mini Ecosystem* (Cabs, Biryani food delivery, IRCTC train status, BBPS bill pay)
- "Get Started" and "Skip" navigation

### 2. Authentication (`mobile/app/auth/login.tsx` & `signup.tsx`)
- Indian phone number entry with `+91` prefix and 10-digit validation
- Email login toggle
- 6-Digit OTP verification with 60-second countdown and resend action
- Account registration with avatar picker, display name, unique username validation, and live `@chatindia` UPI ID preview
- Terms of Service and Privacy Policy agreements

### 3. Chats Home (`mobile/app/(tabs)/chats/index.tsx`)
- Time-based Indian greeting ("Good morning / afternoon / evening")
- Global search across chats, contacts, and groups
- Indian Quick Action Bar:
  - 📷 **Scan QR** (Live camera or simulator test scan)
  - 💳 **Scan & Pay** (UPI scanner)
  - ⚡ **UPI Wallet** (Live balance display with 1-tap top-up)
  - 👥 **New Group** (Create group chat)
- Filter chips: **All Chats**, **Unread**, **Groups**
- Conversation cards with avatar, online green indicator, unread badge, Shagun/Gift envelope highlight, pinned icon, and mute indicator
- Pull-to-refresh & empty states
- Floating Action Button (FAB) for instant conversation creation

### 4. One-to-One & Group Chats (`mobile/app/chat/[id].tsx`)
- Encrypted conversation header with avatar, status, audio call and video call shortcuts
- Rich message history: text bubbles with WeChat-style green/white colorway
- Shagun Gift Envelopes (send ₹51, ₹101, ₹251, ₹501 with festive blessings)
- Claim celebration modal with animated "OPEN" action and direct wallet balance credit
- UPI Transfer bubble with verified payment notes
- Voice note recording and playback visualizer
- Photo and Document (`.pdf`) sharing
- Emoji picker quick bar and message reactions (`❤️`, `👍`, `😂`, `🎉`, `🙏`, `🔥`)
- Message reply preview and long-press action sheet (Copy, Reply, React, Delete)
- Report and block controls

### 5. Group Chat Management (`mobile/app/group/create.tsx`)
- Select contacts with multi-select checkboxes
- Group subject name, photo avatar, and description
- Member list and role permissions

### 6. Contacts (`mobile/app/(tabs)/contacts/index.tsx` & `mobile/app/contact/[id].tsx`)
- Search contacts by name or UPI ID
- Quick system rows:
  - New Friend Requests (with pending request counter badge and Accept/Reject buttons)
  - Scan QR Code
  - My QR Profile Card
  - Verified Official Businesses & Channels
  - Create New Group
- Contact Profile Screen: UPI ID copy, direct messaging, voice/video calling, send Shagun, and block user

### 7. QR Code Identity System (`mobile/src/components/MyQrCard.tsx` & `QrCameraScanner.tsx`)
- **Cryptographic Privacy**: Generates unguessable 256-bit QR tokens (`chatindia_qr_...`). Only a SHA-256 hash is verified on the backend.
- **Never reveals private phone numbers** or passwords inside the QR code.
- **No Auto-Friending**: Scanning a QR code returns the public profile preview ONLY. Explicit confirmation via "Add Friend" is strictly required.

### 8. Discover & Moments (`mobile/app/(tabs)/discover/index.tsx` & `mobile/app/moments/index.tsx`)
- Moments feed with cover banner, user profile avatar, and stories/status carousel
- Like/unlike counters, friends' comment threads, inline comment composer
- Post creation modal with photo preview, location tag, and Friends-Only audience privacy
- Nearby Communities gateway with explicit location permission prompt
- Trending Videos in India (ISRO Solar Mission, Filter Coffee Brewing, Bengaluru Drone Tour)

### 9. Services & Mini Programs (`mobile/app/(tabs)/services/index.tsx` & `mobile/app/mini-app/[key].tsx`)
Interactive zero-install mini-apps:
1. **Jump 2048**: Casual number merging puzzle
2. **ChatIndia Auto & Cabs**: Book city autos and EV cabs with live fare estimation and UPI pay
3. **Desi Gourmet Eats**: Order Hyderabadi Dum Biryani and Paneer Butter Masala with 1-tap UPI checkout
4. **India Weather & AQI Radar**: Real-time AQI and monsoon alerts
5. **IRCTC Train & PNR Tracker**: 10-digit PNR running status & chart preparation check
6. **BBPS Utility BillPay**: Electricity (BESCOM), water, FASTag, and mobile recharges

### 10. UPI Wallet & Indian Payments (`mobile/app/wallet/index.tsx`)
- Emerald Hero balance card with KYC verification badge
- Receive QR with user's `@chatindia` UPI ID
- Top-Up Modal (Add money with ₹100, ₹200, ₹500, ₹1000, ₹2000 presets)
- Direct UPI Send Modal (enter UPI ID/phone number, amount in ₹, and note)
- Transaction History with filter
- Downloadable/Shareable transaction receipt modal

### 11. Profile & Settings (`mobile/app/(tabs)/me/index.tsx` & `mobile/app/settings/index.tsx`)
- Profile photo, display name, copyable UPI ID, region, and bio
- Settings: Two-step verification, device sessions, online status toggle, read receipts toggle, blocked contacts, dark mode toggle, English/Hindi language switch, and permanent account deletion dialog

---

## 🛡️ Responsive Admin Operations Console (`admin-dashboard/`)

A responsive React + Vite web dashboard located at `http://localhost:3031`:
- **System Overview**: Registered users, active conversations, moments shared, and real-time service health
- **User Directory**: Search by name or phone, view accounts, suspend or restore users with audit reasons
- **Content Moderation**: Review reported users, posts, and comments with 1-click enforcement and content removal
- **ChatIndia UPI Financial Ledger**: Complete transaction audit trail formatted in Indian Rupees (₹) with idempotency keys
- **Mini Programs & Business Directory**: Ecosystem health and active user metrics

---

## ⚡ Quick Start Guide

### 1. Launch All Services:
```bash
cd /Users/sratanshushukla/Downloads/omnichat-superapp
node start-all.js
```

### 2. Service Endpoints:
- **Admin Operations Console**: [http://localhost:3031](http://localhost:3031)
- **Backend REST API**: [http://localhost:5055/api/v1](http://localhost:5055/api/v1)
- **Interactive OpenAPI / Swagger**: [http://localhost:5055/api/docs](http://localhost:5055/api/docs)

### 3. Launch Mobile App:
```bash
cd mobile
npx expo start -c
```
- Press `a` for Android Emulator
- Press `i` for iOS Simulator
- Press `w` for Web Browser
- Or scan QR code with Expo Go on your physical Android or iPhone device.

---

## 🧪 Acceptance Test Suite

Run the automated backend test suite:
```bash
cd backend
npm test
```
**Results**: 6/6 test suites passed in ~280ms verifying user registration, QR token unguessable resolution without auto-friending, friend request workflow, persistent messaging, and wallet idempotency.

---

## 📦 Mobile Build & EAS Configuration

To build production native binaries:
```bash
cd mobile

# Android APK Preview Build:
eas build -p android --profile preview

# Android Production App Bundle (AAB):
eas build -p android --profile production

# iOS Production Build:
eas build -p ios --profile production
```
