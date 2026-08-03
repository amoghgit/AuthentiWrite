import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthRequest } from '../types';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        statusCode: 401,
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
        statusCode: 401,
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
        statusCode: 401,
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
        statusCode: 401,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
      statusCode: 500,
    });
  }
};
