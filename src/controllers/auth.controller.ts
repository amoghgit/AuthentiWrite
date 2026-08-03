import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { env } from '../config/env';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ApiResponseHelper } from '../utils/apiResponse';
import { AppError } from '../middleware/error.middleware';

/**
 * Generate JWT token
 */
const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign({ id: userId, email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string | number,
  } as jwt.SignOptions);
};

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: validated.email });
    if (existingUser) {
      throw new AppError('A user with this email already exists.', 409);
    }

    // Create user
    const user = await User.create(validated);

    // Generate token
    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );

    ApiResponseHelper.created(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validated = loginSchema.parse(req.body);

    // Find user with password included
    const user = await User.findOne({ email: validated.email }).select(
      '+password'
    );

    if (!user) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(validated.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate token
    const token = generateToken(
      user._id.toString(),
      user.email,
      user.role
    );

    ApiResponseHelper.success(res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};
