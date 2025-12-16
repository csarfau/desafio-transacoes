import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InvalidTransactionError } from '../../../domain/errors/invalid-transaction.error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionHandler');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let httpStatus: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof InvalidTransactionError) {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()) as string,
      error: message,
    };

    const path = responseBody.path;

    if (httpStatus >= 500) {
      this.logger.error(
        `Critical Error on ${path}`,
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn(`Client Error on ${path}: ${JSON.stringify(message)}`);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
