import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { LogsService } from "../../modules/logs/logs.service.js";

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private logsService: LogsService) {}

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp(); 
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? exception.getResponse()
            : "Internal server error";

        const errorMessage = typeof message === "string"
            ? message
            : (message as any).message || "Internal server error";

        // Log to database
        await this.logsService.createLog({
            statusCode: status,
            path: request.url,
            error: errorMessage,
            errorCode: (exception as any)?.errorCode || "UNKNOWN_ERROR",
            session_id: (request as any).user?.id, // Assuming user is attached to request
        });

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: errorMessage,
            errorCode: (exception as any)?.errorCode || "UNKNOWN_ERROR"
        });
    }
}