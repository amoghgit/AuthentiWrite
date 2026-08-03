import { Response, NextFunction } from 'express';
import { AnalysisReport } from '../models/AnalysisReport';
import { Essay } from '../models/Essay';
import { History } from '../models/History';
import { AuthRequest } from '../types';
import { essayIdParamSchema } from '../validators/essay.validator';
import { ApiResponseHelper } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/report/:id
 * Get a specific analysis report
 */
export const getReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const { id } = essayIdParamSchema.parse(req.params);

    const report = await AnalysisReport.findOne({
      _id: id,
      userId: req.user.id,
    }).populate('essayId', 'title wordCount characterCount readingTime uploadDate');

    if (!report) {
      throw new AppError('Report not found.', 404);
    }

    // Create history entry for viewing
    await History.create({
      userId: req.user.id,
      essayId: report.essayId,
      reportId: report._id,
      action: 'view',
    });

    ApiResponseHelper.success(res, report, 'Report retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/report/:id
 * Delete a specific analysis report
 */
export const deleteReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const { id } = essayIdParamSchema.parse(req.params);

    const report = await AnalysisReport.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!report) {
      throw new AppError('Report not found.', 404);
    }

    // Delete associated essay
    await Essay.findByIdAndDelete(report.essayId);

    // Create history entry for deletion
    await History.create({
      userId: req.user.id,
      essayId: report.essayId,
      reportId: report._id,
      action: 'delete',
    });

    // Delete report
    await AnalysisReport.findByIdAndDelete(id);

    ApiResponseHelper.success(res, null, 'Report deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/history
 * Get user's analysis history
 */
export const getHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      History.find({ userId: req.user.id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('essayId', 'title wordCount status uploadDate')
        .populate('reportId', 'overallScore confidence overallAssessment'),
      History.countDocuments({ userId: req.user.id }),
    ]);

    ApiResponseHelper.success(res, {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }, 'History retrieved successfully');
  } catch (error) {
    next(error);
  }
};
