import { Platform } from 'react-native';

// In Android Emulator localhost is 10.0.2.2, in iOS simulator or web it's localhost
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5055/api/v1',
  ios: 'http://localhost:5055/api/v1',
  default: 'http://localhost:5055/api/v1'
});

class ApiService {
  private token: string | null = null;

  setToken(t: string) {
    this.token = t;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  }

  // QR Token Endpoints
  async generateMyQrToken() {
    return this.request('/qr-tokens', { method: 'POST' });
  }

  async resolveQrToken(token: string) {
    return this.request('/qr-tokens/resolve', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  // Friends Endpoints
  async sendFriendRequest(recipientId: string, message?: string) {
    return this.request('/friend-requests', {
      method: 'POST',
      body: JSON.stringify({ recipientId, source: 'qr_scan', message })
    });
  }

  async getFriendRequests() {
    return this.request('/friend-requests');
  }

  async acceptFriendRequest(requestId: string) {
    return this.request(`/friend-requests/${requestId}/accept`, { method: 'POST' });
  }

  // Conversations Endpoints
  async getConversations() {
    return this.request('/conversations');
  }

  async getMessages(conversationId: string) {
    return this.request(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, content: string, type: string = 'TEXT', metadata?: any) {
    return this.request(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, type, metadata })
    });
  }

  // Wallet Endpoints
  async getWallet() {
    return this.request('/wallet');
  }

  async sendLuckyPacket(conversationId: string, amountCents: number, greeting: string) {
    return this.request('/payments/lucky-packet/send', {
      method: 'POST',
      body: JSON.stringify({ conversationId, amountCents, greeting })
    });
  }

  async claimLuckyPacket(messageId: string) {
    return this.request('/payments/lucky-packet/claim', {
      method: 'POST',
      body: JSON.stringify({ messageId })
    });
  }

  // Moments Endpoints
  async getMomentsFeed() {
    return this.request('/moments/feed');
  }

  async createPost(content: string, media: any[] = [], locationName?: string) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify({ content, media, locationName })
    });
  }

  async toggleLikePost(postId: string) {
    return this.request(`/posts/${postId}/likes`, { method: 'POST' });
  }
}

export const api = new ApiService();
