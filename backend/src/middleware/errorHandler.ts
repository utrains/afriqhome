import { Response } from 'express';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  _req: any,
  res: Response,
  _next: any
): void => {
  console.error('Global error handler:', err);

  // Handle specific error types
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(config.env === 'development' && { stack: err.stack })
  });
}; 