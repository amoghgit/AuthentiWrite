import { Router } from 'express';
import authRoutes from './auth.routes';
import essayRoutes from './essay.routes';
import reportRoutes from './report.routes';
import profileRoutes from './profile.routes';

const router = Router();

// Mount route groups
router.use('/auth', authRoutes);
router.use('/', essayRoutes);
router.use('/', reportRoutes);
router.use('/', profileRoutes);

// Health check
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: API health check
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AuthentiWrite API is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
