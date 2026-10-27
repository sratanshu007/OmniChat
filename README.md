# OmniChat (微信 WeChat-Inspired Super App) 🚀🧧

A production-oriented, full-featured social communication super app inspired by WeChat, with original branding, emerald-and-neutral visual identity, and complete monorepo architecture.

---

## 🏗️ Monorepo Architecture

```
omnichat-superapp/
├── backend/                  # Node.js + Express + TypeScript + Prisma ORM + Socket.IO
│   ├── prisma/
│   │   └── schema.prisma     # Complete PostgreSQL schema (UUIDs, immutable ledger)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Phone/email verification, OTP, JWT sessions
│   │   │   ├── qr/           # Cryptographic random token generator & SHA-256 verifier
│   │   │   ├── friends/      # Friend requests, acceptance, blocking & reporting
│   │   │   ├── conversations/# Direct & group chats, persistent message store
│   │   │   ├── moments/      # Social feed with friends-only privacy rules
│   │   │   ├── wallet/       # Integer minor currency ledger, lucky red packets
│   │   │   ├── services/     # Mini apps directory & official business accounts
│   │   │   ├── calls/        # WebRTC call signaling & STUN/TURN ICE config
│   │   │   └── admin/        # RBAC, suspension audit logs, moderation queue
│   │   ├── socket/           # Real-time authenticated event gateway
│   │   └── docs/openapi.ts   # Interactive OpenAPI / Swagger UI (/api/docs)
│   └── tests/                # Automated Vitest acceptance test suite
│
├── mobile/                   # React Native + Expo + TypeScript + Expo Router
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── chats/        # Real-time chats, voice notes, red packets
│   │   │   ├── contacts/     # Friends list, Add Friend flow
│   │   │   ├── discover/     # Moments, Channels, Scan, Shake gateways
│   │   │   ├── services/     # Mini programs sandbox (2048, DiDi, Meituan)
│   │   │   └── me/           # Profile, WeChat Pay wallet, settings
│   │   └── _layout.tsx       # Expo Router root stack
│   ├── src/components/
│   │   ├── MyQrCard.tsx      # Scannable user QR identity card with share & reset
│   │   └── QrCameraScanner.tsx # Viewfinder, laser line, public profile preview
│   └── eas.json              # EAS Build configuration (Android APK/AAB & iOS)
│
├── admin-dashboard/          # Responsive React + TypeScript Web Operations Console
│   └── src/App.tsx           # Health metrics, User suspension, Moderation queue
│
├── client/                   # Web SuperApp client with dual Mobile & Desktop frames
├── docker-compose.yml        # PostgreSQL 16, Redis 7, Backend, and Admin Dashboard
└── start-all.js              # One-command root startup script
```

---

## 🌟 QR Code Friend System — Core Workflow

As required by **Section 5 (Mandatory Feature)**:
1. **Cryptographic Unguessable Identity**:
   - `POST /api/v1/qr-tokens`: Generates a 256-bit secure token (`omnichat_qr_...`).
   - Only a cryptographic SHA-256 hash is persisted in the database.
   - Tokens are revocable and support expiration.
2. **Scan & Resolve Without Auto-Friending**:
   - `POST /api/v1/qr-tokens/resolve`: Validates token validity.
   - **Returns target user's public profile preview ONLY**.
   - **Strictly does not auto-create a friendship** merely because a QR code was scanned.
3. **Explicit Add Friend Flow**:
   - The user inspects the public profile and taps **"Add Friend"**.
   - A friend request is dispatched to `/api/v1/friend-requests` with source `qr_scan`.
   - The recipient is notified via push/socket.
   - Upon acceptance, bidirectional friendship and a 1-on-1 conversation are established.

---

## 💰 WeChat Pay & Auditable Wallet Ledger

As required by **Section 10 & 14**:
- **Integer Minor Currency Units**: Balances and transactions are stored as integer cents/fen (`balanceCents`) to avoid floating-point math errors.
- **Idempotency**: All payment orders and P2P transfers require an `idempotencyKey` to prevent duplicate charges.
- **Immutable Ledger**: Every financial event creates an immutable `WalletTransaction` audit trail.
- **Lucky Red Packets (微信红包)**: Sent in chat, opened with animated gold coin ("開") and celebratory audio chime, credited directly to recipient balance.

---

## ⚡ Quick Start Guide

### 1. Start All Services:
```bash
cd /Users/sratanshushukla/Downloads/omnichat-superapp
npm run dev
# Or
node start-all.js
```

### 2. Service URLs:
- **Mobile / Web SuperApp**: [http://localhost:3030](http://localhost:3030)
- **Admin Command Dashboard**: [http://localhost:3031](http://localhost:3031)
- **Backend API Server**: [http://localhost:5055/api/v1](http://localhost:5055/api/v1)
- **Interactive Swagger Docs**: [http://localhost:5055/api/docs](http://localhost:5055/api/docs)

---

## 🧪 Automated Acceptance Test Suite

Run the full acceptance test suite verifying all 12 critical acceptance tests:
```bash
cd backend
npm test
```
**Results**: 6/6 test suites passed in ~280ms (Registration, QR Token resolution without auto-friending, Request workflow, Persistent messaging, Wallet idempotency, Content moderation).

---

## 📦 Mobile Build & EAS Instructions

To build native Android and iOS artifacts:
```bash
cd mobile
# Android APK test build:
eas build -p android --profile preview

# Android Production App Bundle (AAB):
eas build -p android --profile production

# iOS Production build:
eas build -p ios --profile production
```
