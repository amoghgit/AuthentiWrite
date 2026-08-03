import { Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Essay } from '../models/Essay';
import { AnalysisReport } from '../models/AnalysisReport';
import { AuthRequest } from '../types';
import { ApiResponseHelper } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';

/**
 * GET /api/profile
 * Get the authenticated user's profile with stats
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required.', 401);
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Get user stats
    const [totalEssays, totalReports, avgScore] = await Promise.all([
      Essay.countDocuments({ userId: req.user.id }),
      AnalysisReport.countDocuments({ userId: req.user.id }),
      AnalysisReport.aggregate([
        { $match: { userId: user._id } },
        { $group: { _id: null, avgScore: { $avg: '$overallScore' } } },
      ]),
    ]);

    ApiResponseHelper.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      stats: {
        totalEssays,
        totalReports,
        averageScore: avgScore.length > 0 ? Math.round(avgScore[0].avgScore) : 0,
      },
    }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
