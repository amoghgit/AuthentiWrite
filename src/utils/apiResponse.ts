import { Response } from 'express';

/**
 * Consistent API response helper
 */
export class ApiResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
      statusCode,
    });
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): void {
    res.status(201).json({
      success: true,
      message,
      data,
      statusCode: 201,
    });
  }

  static error(
    res: Response,
    message: string = 'Internal server error',
    statusCode: number = 500,
    error?: string
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
      error,
      statusCode,
    });
  }

  static notFound(
    res: Response,
    message: string = 'Resource not found'
  ): void {
    res.status(404).json({
      success: false,
      message,
      statusCode: 404,
    });
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): void {
    res.status(401).json({
      success: false,
      message,
      statusCode: 401,
    });
  }
}
