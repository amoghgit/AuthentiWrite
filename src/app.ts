import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { fileLogger, consoleLogger } from './utils/logger';
import { swaggerSpec } from './utils/swagger';
import routes from './routes';

const app = express();

// ============================================
// Security Middleware
// ============================================
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================
// Rate Limiting
// ============================================
app.use('/api', apiLimiter);

// ============================================
// Body Parsing
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Logging
// ============================================
if (env.NODE_ENV === 'development') {
  app.use(consoleLogger);
}
app.use(fileLogger);

// ============================================
// Swagger Documentation
// ============================================
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AuthentiWrite API Docs',
  })
);

// ============================================
// API Routes
// ============================================
app.use('/api', routes);

// ============================================
// Root Route
// ============================================
app.get('/', (_req, res) => {
  res.json({
    name: 'AuthentiWrite API',
    version: '1.0.0',
    description: 'Transparent AI Writing Analysis for College Admission Essays',
    docs: '/api-docs',
    health: '/api/health',
  });
});

// ============================================
// Error Handling
// ============================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
