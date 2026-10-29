import { Platform } from 'react-native';

// In Android Emulator localhost is 10.0.2.2, in iOS simulator or web it's localhost
const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5055/api/v1',
  ios: 'http://localhost:5055/api/v1',
  default: 'http://localhost:5055/api/v1'
});

class ApiService {
  private token: string | null = null;

  setToken(t: string | null) {
    this.token = t;
  }

  getToken(): string | null {
    return this.token;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {})
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (e: any) {
      // In mobile environment when backend is starting or offline, provide descriptive error
      throw new Error(e.message || 'Network connection failed');
    }
  }

  // --- Auth Endpoints ---
  async requestOtp(phoneNumber: string) {
    return this.request('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber })
    });
  }

  async verifyOtpAndLogin(phoneNumber: string, code: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code })
    });
  }

  async registerUser(userData: {
    phoneNumber: string;
    displayName: string;
    username: string;
    avatarUrl?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // --- QR Token Endpoints ---
  async generateMyQrToken() {
    return this.request('/qr-tokens', { method: 'POST' });
  }

  async resolveQrToken(token: string) {
    return this.request('/qr-tokens/resolve', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  // --- Friends Endpoints ---
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

  async rejectFriendRequest(requestId: string) {
    return this.request(`/friend-requests/${requestId}/reject`, { method: 'POST' });
  }

  async getFriendsList() {
    return this.request('/friends');
  }

  // --- Conversations & Messages ---
  async getConversations() {
    return this.request('/conversations');
  }

  async createConversation(participantIds: string[], isGroup = false, title?: string) {
    return this.request('/conversations', {
      method: 'POST',
      body: JSON.stringify({ participantIds, isGroup, title })
    });
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

  // --- Wallet & UPI Payments ---
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

  async transferUpi(recipientUpiId: string, amountCents: number, note?: string) {
    return this.request('/payments/transfer', {
      method: 'POST',
      body: JSON.stringify({ recipientUpiId, amountCents, note })
    });
  }

  // --- Moments Endpoints ---
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

  async addPostComment(postId: string, text: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  // --- Services / Mini Programs ---
  async getServices() {
    return this.request('/services');
  }
}

export const api = new ApiService();
