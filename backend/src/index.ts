import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { config } from './config/env.js';
import { openApiSpec } from './docs/openapi.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

// Import Route Handlers
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import qrRoutes from './modules/qr/qr.routes.js';
import friendsRoutes from './modules/friends/friends.routes.js';
import conversationsRoutes from './modules/conversations/conversations.routes.js';
import momentsRoutes from './modules/moments/moments.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';
import servicesRoutes from './modules/services/services.routes.js';
import callsRoutes from './modules/calls/calls.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});
setupSocketHandlers(io);

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir));

// OpenAPI / Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Mount Versioned API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/qr-tokens', qrRoutes);
app.use('/api/v1/friends', friendsRoutes);
app.use('/api/v1/friend-requests', friendsRoutes);
app.use('/api/v1/conversations', conversationsRoutes);
app.use('/api/v1/moments', momentsRoutes);
app.use('/api/v1/posts', momentsRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/payments', walletRoutes);
app.use('/api/v1/services', servicesRoutes);
app.use('/api/v1/calls', callsRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'OmniChat SuperApp Backend API',
    version: '1.0.0'
  });
});

const PORT = parseInt(config.PORT, 10) || 5055;
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 OmniChat Backend Server running on http://localhost:${PORT}`);
  console.log(`📖 OpenAPI Swagger Documentation at http://localhost:${PORT}/api/docs`);
  console.log(`⚡ Realtime Socket.IO Gateway ready on port ${PORT}`);
  console.log(`====================================================`);
});
