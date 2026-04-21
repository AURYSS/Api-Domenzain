import { Inject, UnauthorizedException, CanActivate, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { UtilService } from "../services/util.service.js";
import { Injectable } from "@nestjs/common"; 

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly utilSvc: UtilService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.utilSvc.getPayload(token);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromRequest(request: Request): string | null {
        // Obtenemos el token desde las cookies HttpOnly
        if (request.cookies && request.cookies['access_token']) {
            return request.cookies['access_token'];
        }

        // Fallback al header por si acaso todavía hay algo probando vía Swagger
        const authHeader = request.headers['authorization'];
        if (!authHeader) return null;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : null;
    }
}