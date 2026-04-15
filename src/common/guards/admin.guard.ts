import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "./auth.guard.js";
import { UtilService } from "../services/util.service.js";

@Injectable()
export class AdminGuard extends AuthGuard {
    constructor(utilSvc: UtilService) {
        super(utilSvc);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Primero verificamos que el token sea válido (autenticación)
        const isAuthenticated = await super.canActivate(context);
        if (!isAuthenticated) return false;

        const request = context.switchToHttp().getRequest();
        const user = request['user'];

        // Verificamos si el rol es admin
        if (user && user.role === 'admin') {
            return true;
        }

        throw new ForbiddenException("No tienes permisos de administrador para esta acción");
    }
}
