import { Server, Socket } from 'socket.io';
import { dbStore } from '../config/db.js';

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // 1. Join Personal User Room
    socket.on('user:join', (userId: string) => {
      socket.join(`user_${userId}`);
      console.log(`[Socket.IO] User ${userId} joined personal room user_${userId}`);
      io.emit('presence:update', { userId, status: 'online' });
    });

    // 2. Join Conversation Room with Membership Authorization
    socket.on('conversation:join', ({ conversationId, userId }: { conversationId: string; userId: string }) => {
      const isMember = dbStore.conversationMembers.some(
        m => m.conversationId === conversationId && m.userId === userId
      );
      if (isMember) {
        socket.join(`conv_${conversationId}`);
        console.log(`[Socket.IO] User ${userId} joined room conv_${conversationId}`);
      }
    });

    // 3. Typing Indicator
    socket.on('typing:start', ({ conversationId, userId, displayName }) => {
      socket.to(`conv_${conversationId}`).emit('typing:start', { conversationId, userId, displayName });
    });

    socket.on('typing:stop', ({ conversationId, userId }) => {
      socket.to(`conv_${conversationId}`).emit('typing:stop', { conversationId, userId });
    });

    // 4. Real-time Message Broadcasting
    socket.on('message:send', ({ conversationId, message }) => {
      io.to(`conv_${conversationId}`).emit('message:new', { conversationId, message });
      // Also broadcast to individual member rooms for notification badges
      const members = dbStore.conversationMembers.filter(m => m.conversationId === conversationId);
      members.forEach(m => {
        io.to(`user_${m.userId}`).emit('message:notify', { conversationId, message });
      });
    });

    // 5. Message Read Receipts
    socket.on('message:read', ({ conversationId, messageId, userId }) => {
      io.to(`conv_${conversationId}`).emit('message:read', { conversationId, messageId, userId });
    });

    // 6. WebRTC Voice and Video Call Signaling
    socket.on('call:offer', (data: { caller: any; receiverId: string; callType: string; offer: any; callId: string }) => {
      console.log(`[WebRTC] Call offer from ${data.caller?.displayName} to ${data.receiverId}`);
      io.to(`user_${data.receiverId}`).emit('call:incoming', data);
    });

    socket.on('call:answer', (data: { callerId: string; answer: any; callId: string }) => {
      io.to(`user_${data.callerId}`).emit('call:answered', data);
    });

    socket.on('call:ice-candidate', (data: { targetUserId: string; candidate: any }) => {
      io.to(`user_${data.targetUserId}`).emit('call:ice-candidate', data);
    });

    socket.on('call:end', (data: { targetUserId: string; callId: string }) => {
      io.to(`user_${data.targetUserId}`).emit('call:ended', data);
    });

    // 7. Disconnect
    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
}
