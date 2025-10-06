import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Custom exception for business logic errors
 */
export class BusinessException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: message,
        error: 'Business Logic Error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}

/**
 * Custom exception for resource not found
 */
export class ResourceNotFoundException extends HttpException {
  constructor(resource: string = 'Resource') {
    super(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: `${resource} không tìm thấy`,
        error: 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

/**
 * Custom exception for unauthorized access
 */
export class UnauthorizedAccessException extends HttpException {
  constructor(message: string = 'Unauthorized access') {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: message,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}

/**
 * Custom exception for invalid data
 */
export class InvalidDataException extends HttpException {
  constructor(message: string = 'Dữ liệu không hợp lệ') {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: message,
        error: 'Invalid Data',
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
