import { Response, NextFunction } from 'express';
import { Essay } from '../models/Essay';
import { UploadedFile } from '../models/UploadedFile';
import { History } from '../models/History';
import { AnalysisReport } from '../models/AnalysisReport';
import { AuthRequest } from '../types';
import { FileExtractorService } from '../services/fileExtractor.service';
import { MockAIService } from '../services/mockAI.service';
import { analyzeEssaySchema } from '../validators/essay.validator';
import { ApiResponseHelper } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';

/**
 * POST /api/upload
 * Upload a file (PDF, DOCX, TXT) and extract text
 */
export const uploadEssay = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    if (!req.file) {
      throw new AppError('No file uploaded. Please upload a PDF, DOCX, or TXT file.', 400);
    }

    const { file } = req;

    // Extract text from file
    const extractedText = await FileExtractorService.extractText(file.path);

    // Calculate metrics
    const metrics = FileExtractorService.calculateMetrics(extractedText);

    // Get file type
    const fileType = FileExtractorService.getFileType(file.mimetype);

    // Save uploaded file record
    const uploadedFile = await UploadedFile.create({
      userId: req.user.id,
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      fileType,
      fileSizeBytes: file.size,
      filePath: file.path,
    });

    // Create essay record
    const title = req.body.title || file.originalname.replace(/\.[^.]+$/, '');
    const essay = await Essay.create({
      userId: req.user.id,
      title,
      originalText: extractedText,
      wordCount: metrics.wordCount,
      characterCount: metrics.characterCount,
      readingTime: metrics.readingTime,
      status: 'uploaded',
    });

    // Link essay to uploaded file
    uploadedFile.essayId = essay._id;
    await uploadedFile.save();

    ApiResponseHelper.created(res, {
      essay: {
        id: essay._id,
        title: essay.title,
        wordCount: essay.wordCount,
        characterCount: essay.characterCount,
        readingTime: essay.readingTime,
        status: essay.status,
        uploadDate: essay.uploadDate,
      },
      file: {
        id: uploadedFile._id,
        originalName: uploadedFile.originalName,
        fileType: uploadedFile.fileType,
        fileSizeBytes: uploadedFile.fileSizeBytes,
      },
      extractedTextPreview: extractedText.substring(0, 200) + '...',
    }, 'File uploaded and text extracted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/analyze
 * Analyze essay text (returns mock AI response)
 */
export const analyzeEssay = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const validated = analyzeEssaySchema.parse(req.body);

    // Calculate metrics
    const metrics = FileExtractorService.calculateMetrics(validated.text);

    // Create essay record
    const essay = await Essay.create({
      userId: req.user.id,
      title: validated.title,
      originalText: validated.text,
      wordCount: metrics.wordCount,
      characterCount: metrics.characterCount,
      readingTime: metrics.readingTime,
      status: 'analyzing',
    });

    // Generate mock AI analysis
    const mockAnalysis = MockAIService.generateMockAnalysis(validated.text);

    // Save analysis report
    const report = await AnalysisReport.create({
      essayId: essay._id,
      userId: req.user.id,
      ...mockAnalysis,
    });

    // Update essay with report reference and status
    essay.reportId = report._id;
    essay.status = 'completed';
    await essay.save();

    // Create history entry
    await History.create({
      userId: req.user.id,
      essayId: essay._id,
      reportId: report._id,
      action: 'analyze',
    });

    ApiResponseHelper.created(res, {
      essayId: essay._id,
      reportId: report._id,
      title: essay.title,
      wordCount: essay.wordCount,
      characterCount: essay.characterCount,
      readingTime: essay.readingTime,
      analysis: mockAnalysis,
    }, 'Essay analyzed successfully');
  } catch (error) {
    next(error);
  }
};
