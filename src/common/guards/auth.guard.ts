import { Inject, UnauthorizedException, CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
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
        const authHeader = request.headers['authorization'];
        
        if (!authHeader) return null;

        const [type, token] = authHeader.split(' ');

        return type === 'Bearer' ? token : null;
    }
}