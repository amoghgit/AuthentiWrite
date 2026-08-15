import { Router } from 'express';
import { uploadEssay, analyzeEssay } from '../controllers/essay.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { uploadLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file (PDF, DOCX, TXT) and extract text
 *     tags: [Essays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF, DOCX, or TXT file
 *               title:
 *                 type: string
 *                 description: Optional title for the essay
 *     responses:
 *       201:
 *         description: File uploaded and text extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid file type or empty file
 *       401:
 *         description: Authentication required
 */
router.post(
  '/upload',
  authMiddleware,
  uploadLimiter,
  upload.single('file'),
  uploadEssay
);

/**
 * @swagger
 * /api/analyze:
 *   post:
 *     summary: Analyze essay text for AI detection (mock response)
 *     tags: [Essays]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeInput'
 *     responses:
 *       201:
 *         description: Essay analyzed successfully
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
 *                         analysis:
 *                           $ref: '#/components/schemas/AnalysisReport'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 */
router.post('/analyze', authMiddleware, analyzeEssay);

export default router;
