export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "OmniChat SuperApp REST API",
    version: "1.0.0",
    description: "Production-grade OpenAPI documentation for OmniChat WeChat-inspired SuperApp."
  },
  servers: [
    { url: "http://localhost:5055/api/v1", description: "Local Development Server" }
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register new account",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["identifier", "displayName", "username"],
                properties: {
                  identifier: { type: "string", example: "+86 138 0000 0000" },
                  displayName: { type: "string", example: "John Doe" },
                  username: { type: "string", example: "john_d" },
                  password: { type: "string", example: "securepassword123" }
                }
              }
            }
          }
        },
        responses: { 201: { description: "Registered successfully" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Login with password or OTP",
        tags: ["Authentication"],
        responses: { 200: { description: "Authenticated successfully" } }
      }
    },
    "/qr-tokens": {
      post: {
        summary: "Generate cryptographically unguessable QR token for user",
        tags: ["QR Code System"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Returns raw QR token and deep link" } }
      }
    },
    "/qr-tokens/resolve": {
      post: {
        summary: "Resolve scanned QR token and return target user's public profile preview",
        tags: ["QR Code System"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Public profile preview (Strictly does not auto-friend)" } }
      }
    },
    "/friend-requests": {
      post: {
        summary: "Send a friend request",
        tags: ["Friends"],
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "Request dispatched" } }
      }
    },
    "/conversations": {
      get: {
        summary: "Get user's conversations list",
        tags: ["Conversations"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of conversations" } }
      }
    },
    "/wallet": {
      get: {
        summary: "Get wallet balance in integer cents and currency",
        tags: ["Wallet & Payments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Wallet details" } }
      }
    },
    "/moments/feed": {
      get: {
        summary: "Get Moments social feed",
        tags: ["Moments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Moments list" } }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
};
