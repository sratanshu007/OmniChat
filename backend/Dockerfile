FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate || true

EXPOSE 5055
CMD ["npx", "tsx", "src/index.ts"]
