import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

// Ensure logs directory exists
const logsDir = path.resolve('logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Morgan middleware for file logging
export const fileLogger = morgan('combined', { stream: accessLogStream });

// Morgan middleware for console logging (development)
export const consoleLogger = morgan('dev');

// Custom error logger
export const logError = (error: Error, context?: string): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${context ? `[${context}] ` : ''}ERROR: ${error.message}\nStack: ${error.stack}\n\n`;
  errorLogStream.write(logEntry);
  console.error(`❌ [${context || 'ERROR'}]:`, error.message);
};

// Custom info logger
export const logInfo = (message: string, context?: string): void => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${context ? `[${context}] ` : ''}INFO: ${message}\n`;
  accessLogStream.write(logEntry);
};
