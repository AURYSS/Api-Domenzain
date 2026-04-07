import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogsService } from '../../modules/logs/logs.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logsService: LogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const userId = (request as any).user?.id;

    return next.handle().pipe(
      tap(async (data) => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        // Log successful requests
        await this.logsService.createLog({
          statusCode,
          path: url,
          session_id: userId,
        });
      }),
    );
  }
}