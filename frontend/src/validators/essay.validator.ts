import { z } from 'zod';

export const analyzeEssaySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  text: z
    .string()
    .min(50, 'Essay must be at least 50 characters')
    .max(50000, 'Essay cannot exceed 50,000 characters')
    .trim(),
});

export const essayIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid essay/report ID format'),
});

export type AnalyzeEssayInput = z.infer<typeof analyzeEssaySchema>;
export type EssayIdParam = z.infer<typeof essayIdParamSchema>;
