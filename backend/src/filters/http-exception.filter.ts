import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception;

    // Log l'erreur complète
    this.logger.error(
      `HTTP ${status} Error on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : exception,
    );

    // En développement, retourner les détails complets de l'erreur
    const isDevelopment = process.env.NODE_ENV !== 'production';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'object' ? (message as any).message || message : message,
      ...(isDevelopment && {
        error: exception instanceof Error ? exception.message : exception,
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }
}
