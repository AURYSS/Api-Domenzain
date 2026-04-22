import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service.js";
import { UserPublicDto } from "../dto/user-public.dto.js";
import { LogsService } from "../../logs/logs.service.js";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly logsSvc: LogsService
    ) {}

    /**
     * Obtiene lista de usuarios con datos públicos filtrados
     * No expone: password, hash, username, email
     */
    public async getUsers(): Promise<UserPublicDto[]> {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                role: true,
                created_at: true,
                _count: {
                    select: { tasks: true }
                }
            }
        });

        return users.map(user => this.mapToUserPublicDto(user));
    }

    /**
     * Mapea datos del usuario a DTO público
     */
    private mapToUserPublicDto(user: any): UserPublicDto {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            username: user.username,
            role: user.role.name,
            created_at: user.created_at,
            task_count: user._count?.tasks || 0
        };
    }

    public async deleteUser(id: number) {
        // Verificar si tiene tareas
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { tasks: true }
                }
            }
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user._count.tasks > 0) {
            throw new ConflictException("No se puede eliminar un usuario con tareas asociadas");
        }

        await this.prisma.user.delete({
            where: { id }
        });

        return { message: "Usuario eliminado con éxito" };
    }

    public async createUser(data: any) {
        const existing = await this.prisma.user.findUnique({
            where: { username: data.username }
        });

        if (existing) {
            throw new ConflictException("El nombre de usuario ya existe");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const { role, ...userData } = data;

        const user = await this.prisma.user.create({
            data: {
                ...userData,
                password: hashedPassword,
                role: { connect: { name: role || "user" } }
            },
            include: { role: true }
        });

        return this.mapToUserPublicDto(user);
    }

    public async updateUser(id: number, data: any) {
        const user = await (this.prisma.user as any).findUnique({ 
            where: { id },
            include: { role: true }
        });
        if (!user) throw new NotFoundException("Usuario no encontrado");

        // Si se intenta cambiar el username, verificar que no esté en uso por otro
        if (data.username && data.username !== user.username) {
            const existing = await (this.prisma.user as any).findUnique({
                where: { username: data.username }
            });
            if (existing) {
                throw new ConflictException("El nombre de usuario ya está en uso");
            }
        }

        const { role, ...userData } = data;
        const updateData: any = { ...userData };
        
        if (data.password && data.password.trim() !== "") {
            updateData.password = await bcrypt.hash(data.password, 10);
        } else {
            delete updateData.password;
        }

        if (role) {
            updateData.role = { connect: { name: role } };
        }

        const updated = await (this.prisma.user as any).update({
            where: { id },
            data: updateData,
            include: {
                role: true,
                _count: {
                    select: { tasks: true }
                }
            }
        });

        // AUDITORÍA: Registrar cambio de rol
        if (role && role !== user.role.name) {
            await this.logsSvc.audit('ROLE_CHANGED', `Admin cambió el rol de ${user.username} de ${user.role.name} a ${role}`, undefined, 300);
        }

        return this.mapToUserPublicDto(updated);
    }

    /**
     * Actualiza el perfil del propio usuario (Protección contra IDOR)
     */
    public async updateOwnProfile(id: number, requesterId: number, data: any) {
        // PREVENCIÓN DE IDOR: El usuario solo puede editar su propio ID
        if (id !== requesterId) {
            throw new UnauthorizedException("Seguridad: No puedes editar el perfil de otro usuario (Intento de IDOR bloqueado)");
        }

        const user = await (this.prisma.user as any).findUnique({ where: { id } });
        if (!user) throw new NotFoundException("Usuario no encontrado");

        // Restricción: Un usuario normal no puede cambiarse el rol a sí mismo
        const { role, ...safeData } = data;
        const updateData: any = { ...safeData };

        if (data.password && data.password.trim() !== "") {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        const updated = await (this.prisma.user as any).update({
            where: { id },
            data: updateData,
            include: { role: true }
        });

        return this.mapToUserPublicDto(updated);
    }
}
