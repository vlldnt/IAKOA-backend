import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  private colorizeStatus(statusCode: number, text: string): string {
    if (statusCode >= 200 && statusCode < 300) {
      return `\x1b[32m${text}\x1b[0m`; // Vert
    } else if (statusCode >= 300 && statusCode < 400) {
      return `\x1b[34m${text}\x1b[0m`; // Bleu
    } else if (statusCode >= 400 && statusCode < 500) {
      return `\x1b[31m${text}\x1b[0m`; // Rouge
    } else if (statusCode >= 500) {
      return `\x1b[35m${text}\x1b[0m`; // Magenta
    }
    return text;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const statusCode = response.statusCode;
        const duration = Date.now() - now;
        const message = this.colorizeStatus(statusCode, `${statusCode} ${method} ${url} - ${duration}ms`);
        this.logger.log(message);
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        const statusCode = error instanceof HttpException ? error.getStatus() : 500;

        let errorMsg = '';
        if (error instanceof HttpException) {
          const response = error.getResponse();
          if (typeof response === 'object' && 'message' in response) {
            const msg = (response as any).message;
            errorMsg = Array.isArray(msg) ? msg.join(', ') : String(msg);
          } else if (typeof response === 'string') {
            errorMsg = response;
          }
        }

        const logMessage = errorMsg
          ? `${statusCode} ${method} ${url} - ${duration}ms - ${errorMsg}`
          : `${statusCode} ${method} ${url} - ${duration}ms`;

        const message = this.colorizeStatus(statusCode, logMessage);
        this.logger.log(message);
        return throwError(() => error);
      }),
    );
  }
}
