import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../../common/services/prisma.service.js";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    public async getUsers() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
                lastname: true,
                role: true,
                created_at: true,
                _count: {
                    select: { taks: true }
                }
            }
        });
    }

    public async deleteUser(id: number) {
        // Verificar si tiene tareas
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { taks: true }
                }
            }
        });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user._count.taks > 0) {
            throw new ConflictException("No se puede eliminar un usuario con tareas asociadas");
        }

        await this.prisma.user.delete({
            where: { id }
        });

        return { message: "Usuario eliminado con éxito" };
    }
}
