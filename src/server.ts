import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import fs from 'fs';
import path from 'path';

// Ensure required directories exist
const ensureDirectories = (): void => {
  const dirs = [
    path.resolve(env.UPLOAD_DIR),
    path.resolve('logs'),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Ensure directories exist
    ensureDirectories();

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🖊️  AuthentiWrite API Server                        ║
║                                                      ║
║   Environment : ${env.NODE_ENV.padEnd(20)}            ║
║   Port        : ${String(env.PORT).padEnd(20)}        ║
║   API Docs    : http://localhost:${env.PORT}/api-docs   ║
║   Health      : http://localhost:${env.PORT}/api/health ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
