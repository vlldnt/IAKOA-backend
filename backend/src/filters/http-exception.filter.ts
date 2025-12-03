import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Une erreur interne est survenue';
    let error = 'Internal Server Error';

    // Gérer les HttpException (incluant BadRequest, NotFound, Conflict, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        error = responseObj.error || exception.name;
      }
    }
    // Gérer les erreurs Prisma qui pourraient passer à travers
    else if (exception && typeof exception === 'object' && 'code' in exception) {
      const prismaError = exception as any;

      if (prismaError.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        message = 'Une ressource avec ces données existe déjà';
        error = 'Conflict';
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Ressource non trouvée';
        error = 'Not Found';
      } else if (prismaError.code?.startsWith('P')) {
        status = HttpStatus.BAD_REQUEST;
        message = 'Erreur de base de données';
        error = 'Database Error';
      }
    }
    // Gérer les autres erreurs
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    // Logger uniquement les erreurs serveur (5xx)
    if (status >= 500) {
      this.logger.error(
        `Error: ${Array.isArray(message) ? message.join(', ') : message}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    // Construire la réponse propre
    const errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
      message,
    };

    // En développement, ajouter des détails supplémentaires uniquement pour les erreurs serveur
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment && status >= 500 && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
