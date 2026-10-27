import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("==================================================================");
console.log("🚀 STARTING COMPLETE OMNICHAT WECHAT-INSPIRED SUPER APP MONOREPO");
console.log("==================================================================");
console.log("📱 Mobile Client:    http://localhost:3030");
console.log("🛡️  Admin Dashboard:  http://localhost:3031");
console.log("⚙️  Backend REST API: http://localhost:5055/api/v1");
console.log("📖 OpenAPI Swagger:  http://localhost:5055/api/docs");
console.log("==================================================================");

// 1. Start Backend Server
const backend = spawn('npx', ['tsx', 'src/index.ts'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Mobile / Web SuperApp Client
const client = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// 3. Start Admin Dashboard
const admin = spawn('npx', ['vite', '--port', '3031', '--host'], {
  cwd: path.join(__dirname, 'admin-dashboard'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log("\n🛑 Stopping all OmniChat services...");
  backend.kill();
  client.kill();
  admin.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
