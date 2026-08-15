import { Router } from 'express';
import { getProfile } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the authenticated user's profile and stats
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         stats:
 *                           type: object
 *                           properties:
 *                             totalEssays:
 *                               type: integer
 *                             totalReports:
 *                               type: integer
 *                             averageScore:
 *                               type: number
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
router.get('/profile', authMiddleware, getProfile);

export default router;
