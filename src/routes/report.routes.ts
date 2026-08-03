import { Router } from 'express';
import { getReport, deleteReport, getHistory } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get user's analysis history
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Authentication required
 */
router.get('/history', authMiddleware, getHistory);

/**
 * @swagger
 * /api/report/{id}:
 *   get:
 *     summary: Get a specific analysis report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AnalysisReport'
 *       404:
 *         description: Report not found
 *       401:
 *         description: Authentication required
 */
router.get('/report/:id', authMiddleware, getReport);

/**
 * @swagger
 * /api/report/{id}:
 *   delete:
 *     summary: Delete a specific analysis report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *       404:
 *         description: Report not found
 *       401:
 *         description: Authentication required
 */
router.delete('/report/:id', authMiddleware, deleteReport);

export default router;
