import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('5055'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/omnichat?schema=public'),
  JWT_SECRET: z.string().default('omnichat_superapp_jwt_secret_key_2026_production_grade'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REFRESH_TOKEN_SECRET: z.string().default('omnichat_superapp_refresh_secret_key_2026'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('30d'),
  ADMIN_JWT_SECRET: z.string().default('omnichat_superapp_admin_secret_key_2026'),
  CORS_ORIGIN: z.string().default('*'),
  MOCK_OTP_MODE: z.string().default('true')
});

export const config = envSchema.parse(process.env);
