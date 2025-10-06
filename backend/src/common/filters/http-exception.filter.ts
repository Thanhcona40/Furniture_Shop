import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MongoError } from 'mongodb';

/**
 * Global HTTP Exception Filter
 * Catches all exceptions and formats them consistently
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    // Handle HTTP Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name || 'Error';
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || exception.name || error;
      }
    }
    // Handle MongoDB Errors
    else if (exception instanceof MongoError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'Database Error';

      // Duplicate key error
      if ((exception as any).code === 11000) {
        const field = Object.keys((exception as any).keyPattern)[0];
        message = `${field} đã tồn tại trong hệ thống`;
        error = 'Duplicate Entry';
      } else {
        message = 'Lỗi cơ sở dữ liệu';
      }
    }
    // Handle Validation Errors
    else if (exception instanceof Error) {
      // Check if it's a validation error
      if (exception.name === 'ValidationError') {
        status = HttpStatus.BAD_REQUEST;
        error = 'Validation Error';
        message = exception.message;
      } else {
        message = exception.message || 'An unexpected error occurred';
      }
    }

    // Log the error
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: message,
    };

    // Log detailed error for server-side debugging
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} - ${status}: ${JSON.stringify(message)}`,
      );
    }

    // Send response
    response.status(status).json(errorResponse);
  }
}
